/**
 * Production-grade PostgreSQL Connection Pool
 * 
 * This module implements a robust connection pool for high-concurrency scenarios
 * with comprehensive monitoring, health checks, and graceful degradation.
 * 
 * Features:
 * - LaunchDarkly feature flag integration for safe rollout
 * - Connection pooling with configurable limits
 * - Health monitoring and circuit breaker pattern
 * - Metrics collection for performance monitoring
 * - Automatic retry logic with exponential backoff
 * - Connection lifecycle management
 */

import { Pool, PoolClient, PoolConfig } from 'pg';
import { evaluateFlag, createUserContext } from '../../../supabase/functions/_shared/launchdarkly';
import { performanceMonitor } from '@/services/monitoring/performanceMonitor';

// Connection pool configuration interface
interface ConnectionPoolConfig {
  // Core connection settings
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  
  // Pool settings
  max: number;                    // Maximum number of connections in pool
  min: number;                    // Minimum number of connections to maintain
  idleTimeoutMillis: number;      // How long a client is allowed to remain idle
  connectionTimeoutMillis: number; // How long to wait for connection
  
  // Advanced settings
  maxUses: number;               // Maximum uses per connection before recreation
  keepAlive: boolean;            // TCP keep-alive
  keepAliveInitialDelayMillis: number;
  
  // SSL settings
  ssl: boolean | object;
  
  // Application settings
  application_name: string;
  statement_timeout: number;     // Query timeout in milliseconds
}

// Health check interface
interface HealthStatus {
  healthy: boolean;
  totalConnections: number;
  idleConnections: number;
  waitingClients: number;
  lastError?: string;
  lastHealthCheck: Date;
  avgResponseTime: number;
  errorRate: number;
}

// Metrics interface
interface PoolMetrics {
  totalQueries: number;
  successfulQueries: number;
  failedQueries: number;
  avgQueryTime: number;
  connectionsCreated: number;
  connectionsDestroyed: number;
  poolHits: number;
  poolMisses: number;
}

/**
 * Advanced PostgreSQL Connection Pool Manager
 */
export class PostgreSQLConnectionPool {
  private pool: Pool | null = null;
  private isEnabled = false;
  private config: ConnectionPoolConfig;
  private metrics: PoolMetrics;
  private healthStatus: HealthStatus;
  private circuitBreakerState: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly maxFailures = 5;
  private readonly recoveryTimeMs = 30000; // 30 seconds

  constructor(config: Partial<ConnectionPoolConfig> = {}) {
    this.config = this.buildConfig(config);
    this.metrics = this.initializeMetrics();
    this.healthStatus = this.initializeHealthStatus();
  }

  /**
   * Initialize the connection pool with feature flag check
   */
  async initialize(userId?: string): Promise<void> {
    try {
      // Check if connection pooling is enabled via LaunchDarkly
      const context = createUserContext(userId || 'system', {
        environment: process.env.NODE_ENV || 'development',
        userAgent: 'github-link-up-buddy-pool'
      });

      const flagResponse = await evaluateFlag(
        'enable_connection_pooling',
        context,
        false, // Default to false for safety
        true   // Include reason for debugging
      );

      this.isEnabled = flagResponse.value;

      console.log('🏊‍♂️ Connection Pool Feature Flag Evaluation:', {
        enabled: this.isEnabled,
        reason: flagResponse.reason,
        userId,
        timestamp: flagResponse.timestamp
      });

      if (!this.isEnabled) {
        console.log('📴 Connection pooling disabled via feature flag');
        return;
      }

      // Initialize the actual pool
      await this.createPool();
      
      // Start health monitoring
      this.startHealthMonitoring();

      console.log('✅ PostgreSQL Connection Pool initialized successfully', {
        maxConnections: this.config.max,
        minConnections: this.config.min,
        database: this.config.database,
        host: this.config.host
      });

    } catch (error) {
      console.error('❌ Failed to initialize connection pool:', error);
      // Gracefully degrade - disable pooling on initialization failure
      this.isEnabled = false;
      throw error;
    }
  }

  /**
   * Execute a query using the connection pool
   */
  async query<T = any>(
    text: string, 
    params?: any[], 
    options: { 
      timeout?: number; 
      userId?: string;
      retries?: number;
    } = {}
  ): Promise<{ rows: T[]; rowCount: number }> {
    const startTime = Date.now();
    const { timeout = 30000, userId, retries = 3 } = options;

    // If pooling is disabled, fall back to direct Supabase client
    if (!this.isEnabled || !this.pool) {
      return this.fallbackQuery(text, params, options);
    }

    // Check circuit breaker
    if (this.circuitBreakerState === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeMs) {
        this.circuitBreakerState = 'HALF_OPEN';
        this.failureCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN - connection pool unavailable');
      }
    }

    let client: PoolClient | null = null;
    let attempt = 0;

    while (attempt < retries) {
      try {
        // Get connection from pool
        client = await this.pool.connect();
        this.metrics.poolHits++;

        // Set query timeout
        if (timeout > 0) {
          await client.query(`SET statement_timeout = ${timeout}`);
        }

        // Execute query with performance monitoring
        const result = await performanceMonitor.timeOperation(
          'db_query_pooled',
          client.query(text, params),
          { 
            query: text.substring(0, 100), // First 100 chars for identification
            userId,
            pooled: true,
            attempt: attempt + 1
          }
        );

        // Update metrics
        this.updateSuccessMetrics(Date.now() - startTime);
        
        // Reset circuit breaker on success
        if (this.circuitBreakerState === 'HALF_OPEN') {
          this.circuitBreakerState = 'CLOSED';
          this.failureCount = 0;
        }

        return result;

      } catch (error) {
        attempt++;
        this.updateFailureMetrics();

        console.error(`❌ Pool query failed (attempt ${attempt}/${retries}):`, {
          error: error instanceof Error ? error.message : String(error),
          query: text.substring(0, 100),
          userId
        });

        // Update circuit breaker
        this.failureCount++;
        this.lastFailureTime = Date.now();

        if (this.failureCount >= this.maxFailures) {
          this.circuitBreakerState = 'OPEN';
        }

        // If this was the last attempt, throw the error
        if (attempt >= retries) {
          throw error;
        }

        // Exponential backoff
        await this.sleep(Math.min(1000 * Math.pow(2, attempt - 1), 5000));

      } finally {
        // Always release the client back to the pool
        if (client) {
          client.release();
        }
      }
    }

    throw new Error('Query failed after all retry attempts');
  }

  /**
   * Execute a transaction using the connection pool
   */
  async transaction<T>(
    queries: Array<{ text: string; params?: any[] }>,
    options: { userId?: string; timeout?: number } = {}
  ): Promise<T[]> {
    if (!this.isEnabled || !this.pool) {
      throw new Error('Transaction requires connection pooling to be enabled');
    }

    const { userId, timeout = 30000 } = options;
    let client: PoolClient | null = null;

    try {
      client = await this.pool.connect();
      
      // Set timeout
      if (timeout > 0) {
        await client.query(`SET statement_timeout = ${timeout}`);
      }

      // Begin transaction
      await client.query('BEGIN');

      const results: T[] = [];

      // Execute all queries in transaction
      for (const query of queries) {
        const result = await client.query(query.text, query.params);
        results.push(result.rows as T);
      }

      // Commit transaction
      await client.query('COMMIT');

      console.log('✅ Transaction completed successfully', {
        queryCount: queries.length,
        userId
      });

      return results;

    } catch (error) {
      // Rollback on error
      if (client) {
        try {
          await client.query('ROLLBACK');
        } catch (rollbackError) {
          console.error('❌ Rollback failed:', rollbackError);
        }
      }

      console.error('❌ Transaction failed:', error);
      throw error;

    } finally {
      if (client) {
        client.release();
      }
    }
  }

  /**
   * Get current pool health status
   */
  async getHealthStatus(): Promise<HealthStatus> {
    if (!this.isEnabled || !this.pool) {
      return {
        ...this.healthStatus,
        healthy: false,
        lastError: 'Connection pooling disabled'
      };
    }

    try {
      // Test query to check pool health
      const startTime = Date.now();
      await this.query('SELECT 1', [], { timeout: 5000 });
      const responseTime = Date.now() - startTime;

      this.healthStatus = {
        healthy: true,
        totalConnections: this.pool.totalCount,
        idleConnections: this.pool.idleCount,
        waitingClients: this.pool.waitingCount,
        lastHealthCheck: new Date(),
        avgResponseTime: responseTime,
        errorRate: this.calculateErrorRate()
      };

    } catch (error) {
      this.healthStatus.healthy = false;
      this.healthStatus.lastError = error instanceof Error ? error.message : String(error);
      this.healthStatus.lastHealthCheck = new Date();
    }

    return this.healthStatus;
  }

  /**
   * Get current pool metrics
   */
  getMetrics(): PoolMetrics & { circuitBreakerState: string; isEnabled: boolean } {
    return {
      ...this.metrics,
      circuitBreakerState: this.circuitBreakerState,
      isEnabled: this.isEnabled
    };
  }

  /**
   * Gracefully shutdown the connection pool
   */
  async shutdown(): Promise<void> {
    if (this.pool) {
      console.log('🔄 Shutting down connection pool...');
      
      try {
        await this.pool.end();
        console.log('✅ Connection pool shutdown complete');
      } catch (error) {
        console.error('❌ Error during pool shutdown:', error);
      }
      
      this.pool = null;
    }
  }

  // Private methods

  private buildConfig(userConfig: Partial<ConnectionPoolConfig>): ConnectionPoolConfig {
    const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
    
    if (!dbUrl) {
      throw new Error('DATABASE_URL or SUPABASE_DB_URL environment variable is required');
    }

    // Parse database URL
    const url = new URL(dbUrl);

    return {
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1), // Remove leading slash
      user: url.username,
      password: url.password,
      
      // Pool configuration with production-ready defaults
      max: 20,                    // Maximum connections for high-concurrency
      min: 2,                     // Keep minimum connections warm
      idleTimeoutMillis: 30000,   // 30 seconds idle timeout
      connectionTimeoutMillis: 5000, // 5 second connection timeout
      
      // Advanced settings
      maxUses: 7500,             // Recreate connections after 7500 uses
      keepAlive: true,
      keepAliveInitialDelayMillis: 0,
      
      // SSL for production
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      
      // Application settings
      application_name: 'github-link-up-buddy-pool',
      statement_timeout: 30000,   // 30 second query timeout
      
      ...userConfig
    };
  }

  private async createPool(): Promise<void> {
    const poolConfig: PoolConfig = {
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
      user: this.config.user,
      password: this.config.password,
      max: this.config.max,
      min: this.config.min,
      idleTimeoutMillis: this.config.idleTimeoutMillis,
      connectionTimeoutMillis: this.config.connectionTimeoutMillis,
      keepAlive: this.config.keepAlive,
      keepAliveInitialDelayMillis: this.config.keepAliveInitialDelayMillis,
      ssl: this.config.ssl,
      application_name: this.config.application_name
    };

    this.pool = new Pool(poolConfig);

    // Set up event listeners for monitoring
    this.pool.on('connect', (client) => {
      this.metrics.connectionsCreated++;
      console.log('🔗 New client connected to pool', {
        totalConnections: this.pool?.totalCount,
        idleConnections: this.pool?.idleCount
      });
    });

    this.pool.on('remove', (client) => {
      this.metrics.connectionsDestroyed++;
      console.log('🔌 Client removed from pool', {
        totalConnections: this.pool?.totalCount,
        idleConnections: this.pool?.idleCount
      });
    });

    this.pool.on('error', (err) => {
      console.error('❌ Pool error:', err);
      this.updateFailureMetrics();
    });

    // Test the pool connection
    const client = await this.pool.connect();
    await client.query('SELECT 1');
    client.release();
  }

  private startHealthMonitoring(): void {
    // Health check every 30 seconds
    setInterval(async () => {
      try {
        await this.getHealthStatus();
      } catch (error) {
        console.error('❌ Health check failed:', error);
      }
    }, 30000);
  }

  private initializeMetrics(): PoolMetrics {
    return {
      totalQueries: 0,
      successfulQueries: 0,
      failedQueries: 0,
      avgQueryTime: 0,
      connectionsCreated: 0,
      connectionsDestroyed: 0,
      poolHits: 0,
      poolMisses: 0
    };
  }

  private initializeHealthStatus(): HealthStatus {
    return {
      healthy: false,
      totalConnections: 0,
      idleConnections: 0,
      waitingClients: 0,
      lastHealthCheck: new Date(),
      avgResponseTime: 0,
      errorRate: 0
    };
  }

  private updateSuccessMetrics(queryTime: number): void {
    this.metrics.totalQueries++;
    this.metrics.successfulQueries++;
    
    // Update running average
    const totalTime = this.metrics.avgQueryTime * (this.metrics.successfulQueries - 1) + queryTime;
    this.metrics.avgQueryTime = totalTime / this.metrics.successfulQueries;
  }

  private updateFailureMetrics(): void {
    this.metrics.totalQueries++;
    this.metrics.failedQueries++;
    this.metrics.poolMisses++;
  }

  private calculateErrorRate(): number {
    if (this.metrics.totalQueries === 0) return 0;
    return (this.metrics.failedQueries / this.metrics.totalQueries) * 100;
  }

  private async fallbackQuery<T = any>(
    text: string, 
    params?: any[], 
    options: any = {}
  ): Promise<{ rows: T[]; rowCount: number }> {
    // Import here to avoid circular dependencies
    const { supabase } = await import('@/integrations/supabase/client');
    
    console.log('⚠️ Using fallback query (no pooling)', {
      query: text.substring(0, 50)
    });

    // This is a simplified fallback - in production you'd want more sophisticated handling
    try {
      const result = await supabase.rpc('execute_sql', { 
        query: text, 
        parameters: params || [] 
      });
      
      if (result.error) {
        throw result.error;
      }

      return {
        rows: result.data || [],
        rowCount: result.data?.length || 0
      };
    } catch (error) {
      console.error('❌ Fallback query failed:', error);
      throw error;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
let connectionPool: PostgreSQLConnectionPool | null = null;

/**
 * Get the singleton connection pool instance
 */
export function getConnectionPool(): PostgreSQLConnectionPool {
  if (!connectionPool) {
    connectionPool = new PostgreSQLConnectionPool();
  }
  return connectionPool;
}

/**
 * Initialize the global connection pool
 */
export async function initializeConnectionPool(userId?: string): Promise<void> {
  const pool = getConnectionPool();
  await pool.initialize(userId);
}

/**
 * Shutdown the global connection pool
 */
export async function shutdownConnectionPool(): Promise<void> {
  if (connectionPool) {
    await connectionPool.shutdown();
    connectionPool = null;
  }
}

/**
 * Helper function for flight search queries with connection pooling
 */
export async function queryFlightDatabase<T = any>(
  text: string,
  params?: any[],
  userId?: string
): Promise<{ rows: T[]; rowCount: number }> {
  const pool = getConnectionPool();
  
  return pool.query<T>(text, params, {
    userId,
    timeout: 30000, // 30 second timeout for flight queries
    retries: 2      // 2 retries for high availability
  });
}
