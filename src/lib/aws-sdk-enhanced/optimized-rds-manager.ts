import { Pool, PoolClient, PoolConfig } from 'pg';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface RDSPoolConfig {
  environment: 'development' | 'staging' | 'production';
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

interface PoolMetrics {
  totalConnections: number;
  idleConnections: number;
  waitingRequests: number;
}

export class OptimizedRDSManager {
  private pools = new Map<string, Pool>();
  private supabaseClients = new Map<string, SupabaseClient>();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private connectionMetrics = new Map<string, PoolMetrics>();

  constructor() {
    this.startHealthChecks();
    this.startMetricsCollection();
  }

  createPool(config: RDSPoolConfig): Pool {
    const poolKey = `${config.environment}-${config.host}`;
    
    if (this.pools.has(poolKey)) {
      return this.pools.get(poolKey)!;
    }

    const poolConfig: PoolConfig = {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      
      // Environment-specific pool settings
      max: this.getMaxConnections(config.environment),
      min: this.getMinConnections(config.environment),
      
      // Connection management
      idleTimeoutMillis: 30000, // 30 seconds
      connectionTimeoutMillis: this.getConnectionTimeout(config.environment),
      acquireTimeoutMillis: 60000, // 60 seconds
      
      // Query timeout
      query_timeout: this.getQueryTimeout(config.environment),
      
      // Connection validation
      allowExitOnIdle: true,
      
      // Error handling
      maxUses: 7500, // Max queries per connection before recycling
    };

    const pool = new Pool(poolConfig);
    
    // Set up pool event handlers
    this.setupPoolEventHandlers(pool, poolKey);
    
    this.pools.set(poolKey, pool);
    console.log(`RDS pool created for ${poolKey}`);
    
    return pool;
  }

  private getMaxConnections(environment: string): number {
    const maxConnections = {
      development: 10,
      staging: 25,
      production: 150
    };
    return maxConnections[environment] || 10;
  }

  private getMinConnections(environment: string): number {
    const minConnections = {
      development: 2,
      staging: 5,
      production: 10
    };
    return minConnections[environment] || 2;
  }

  private getConnectionTimeout(environment: string): number {
    const timeouts = {
      development: 10000, // 10 seconds
      staging: 20000,     // 20 seconds
      production: 15000   // 15 seconds
    };
    return timeouts[environment] || 10000;
  }

  private getQueryTimeout(environment: string): number {
    const timeouts = {
      development: 30000, // 30 seconds
      staging: 45000,     // 45 seconds
      production: 60000   // 60 seconds
    };
    return timeouts[environment] || 30000;
  }

  private setupPoolEventHandlers(pool: Pool, poolKey: string): void {
    pool.on('connect', (client: PoolClient) => {
      console.log(`New client connected to pool ${poolKey}`);
      this.updateConnectionMetrics(poolKey, pool);
    });

    pool.on('acquire', (client: PoolClient) => {
      console.debug(`Client acquired from pool ${poolKey}`);
      this.updateConnectionMetrics(poolKey, pool);
    });

    pool.on('release', (client: PoolClient) => {
      console.debug(`Client released back to pool ${poolKey}`);
      this.updateConnectionMetrics(poolKey, pool);
    });

    pool.on('remove', (client: PoolClient) => {
      console.log(`Client removed from pool ${poolKey}`);
      this.updateConnectionMetrics(poolKey, pool);
    });

    pool.on('error', (err: Error, client: PoolClient) => {
      console.error(`Pool error for ${poolKey}:`, err);
      this.handlePoolError(poolKey, err);
    });
  }

  private updateConnectionMetrics(poolKey: string, pool: Pool): void {
    this.connectionMetrics.set(poolKey, {
      totalConnections: pool.totalCount,
      idleConnections: pool.idleCount,
      waitingRequests: pool.waitingCount
    });
  }

  private handlePoolError(poolKey: string, error: Error): void {
    console.error(`Pool error for ${poolKey}:`, error);
    
    // If it's a connection error, attempt to recreate the pool
    if (error.message.includes('connection') || error.message.includes('timeout')) {
      setTimeout(() => {
        this.recreatePool(poolKey);
      }, 5000); // Wait 5 seconds before recreating
    }
  }

  private async recreatePool(poolKey: string): Promise<void> {
    try {
      const existingPool = this.pools.get(poolKey);
      if (existingPool) {
        await existingPool.end();
        this.pools.delete(poolKey);
        console.log(`Pool ${poolKey} recreated due to errors`);
      }
    } catch (error) {
      console.error(`Failed to recreate pool ${poolKey}:`, error);
    }
  }

  async executeQuery<T = any>(
    poolKey: string, 
    query: string, 
    params: any[] = []
  ): Promise<T[]> {
    const pool = this.pools.get(poolKey);
    if (!pool) {
      throw new Error(`Pool not found: ${poolKey}`);
    }

    const client = await pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async executeTransaction<T>(
    poolKey: string,
    operations: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const pool = this.pools.get(poolKey);
    if (!pool) {
      throw new Error(`Pool not found: ${poolKey}`);
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await operations(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Supabase client management with connection pooling
  createSupabaseClient(
    url: string, 
    anonKey: string, 
    environment: string = 'production'
  ): SupabaseClient {
    const clientKey = `${environment}-${url}`;
    
    if (this.supabaseClients.has(clientKey)) {
      return this.supabaseClients.get(clientKey)!;
    }

    const supabaseClient = createClient(url, anonKey, {
      auth: {
        persistSession: false
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'x-application-name': 'parker-flight-enhanced'
        }
      },
      // Connection pooling configuration
      realtime: {
        params: {
          eventsPerSecond: this.getRealtimeEventsPerSecond(environment)
        }
      }
    });

    this.supabaseClients.set(clientKey, supabaseClient);
    console.log(`Supabase client created for ${clientKey}`);
    
    return supabaseClient;
  }

  private getRealtimeEventsPerSecond(environment: string): number {
    const eventsPerSecond = {
      development: 10,
      staging: 50,
      production: 100
    };
    return eventsPerSecond[environment] || 10;
  }

  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks();
    }, 30000); // Every 30 seconds
  }

  private startMetricsCollection(): void {
    setInterval(() => {
      this.logConnectionMetrics();
    }, 60000); // Every minute
  }

  private async performHealthChecks(): Promise<void> {
    const healthCheckPromises = Array.from(this.pools.entries()).map(async ([poolKey, pool]) => {
      try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        
        console.debug(`Health check passed for pool ${poolKey}`);
      } catch (error) {
        console.warn(`Health check failed for pool ${poolKey}:`, error);
        this.handlePoolError(poolKey, error as Error);
      }
    });

    await Promise.allSettled(healthCheckPromises);
  }

  private logConnectionMetrics(): void {
    this.connectionMetrics.forEach((metrics, poolKey) => {
      console.log(`Pool metrics for ${poolKey}:`, {
        total: metrics.totalConnections,
        idle: metrics.idleConnections,
        waiting: metrics.waitingRequests,
        utilization: `${((metrics.totalConnections - metrics.idleConnections) / metrics.totalConnections * 100).toFixed(1)}%`
      });

      // Alert if pool utilization is high
      const utilization = (metrics.totalConnections - metrics.idleConnections) / metrics.totalConnections;
      if (utilization > 0.8) {
        console.warn(`High pool utilization detected for ${poolKey}: ${(utilization * 100).toFixed(1)}%`);
      }

      // Alert if there are waiting requests
      if (metrics.waitingRequests > 0) {
        console.warn(`Waiting requests detected for ${poolKey}: ${metrics.waitingRequests}`);
      }
    });
  }

  getPoolMetrics(poolKey: string): PoolMetrics | undefined {
    return this.connectionMetrics.get(poolKey);
  }

  getAllPoolMetrics(): Map<string, PoolMetrics> {
    return new Map(this.connectionMetrics);
  }

  async getPoolStatus(poolKey: string): Promise<{
    isHealthy: boolean;
    totalConnections: number;
    idleConnections: number;
    waitingRequests: number;
  }> {
    const pool = this.pools.get(poolKey);
    if (!pool) {
      return {
        isHealthy: false,
        totalConnections: 0,
        idleConnections: 0,
        waitingRequests: 0
      };
    }

    let isHealthy = true;
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
    } catch (error) {
      isHealthy = false;
    }

    return {
      isHealthy,
      totalConnections: pool.totalCount,
      idleConnections: pool.idleCount,
      waitingRequests: pool.waitingCount
    };
  }

  async gracefulShutdown(): Promise<void> {
    console.log('Starting graceful shutdown of RDS manager...');
    
    // Clear intervals
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    // Close all pools
    const shutdownPromises = Array.from(this.pools.entries()).map(async ([poolKey, pool]) => {
      try {
        await pool.end();
        console.log(`Pool ${poolKey} closed successfully`);
      } catch (error) {
        console.error(`Error closing pool ${poolKey}:`, error);
      }
    });

    await Promise.allSettled(shutdownPromises);

    // Clear all data structures
    this.pools.clear();
    this.supabaseClients.clear();
    this.connectionMetrics.clear();

    console.log('RDS manager shutdown completed');
  }

  // Connection pool scaling based on demand
  async scalePool(poolKey: string, targetSize: number): Promise<void> {
    const pool = this.pools.get(poolKey);
    if (!pool) {
      throw new Error(`Pool not found: ${poolKey}`);
    }

    console.log(`Scaling pool ${poolKey} to target size: ${targetSize}`);
    
    // This is a conceptual implementation - actual scaling would depend on
    // the specific pool implementation and might require recreating the pool
    // with new configuration
  }

  // Circuit breaker pattern for failed connections
  private circuitBreakers = new Map<string, {
    failures: number;
    lastFailure: number;
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  }>();

  private shouldAllowConnection(poolKey: string): boolean {
    const breaker = this.circuitBreakers.get(poolKey);
    if (!breaker) return true;

    const now = Date.now();
    
    switch (breaker.state) {
      case 'CLOSED':
        return true;
      case 'OPEN':
        // Try to transition to HALF_OPEN after timeout
        if (now - breaker.lastFailure > 60000) { // 1 minute timeout
          breaker.state = 'HALF_OPEN';
          return true;
        }
        return false;
      case 'HALF_OPEN':
        return true;
      default:
        return true;
    }
  }

  private recordConnectionResult(poolKey: string, success: boolean): void {
    let breaker = this.circuitBreakers.get(poolKey);
    if (!breaker) {
      breaker = { failures: 0, lastFailure: 0, state: 'CLOSED' };
      this.circuitBreakers.set(poolKey, breaker);
    }

    if (success) {
      breaker.failures = 0;
      breaker.state = 'CLOSED';
    } else {
      breaker.failures++;
      breaker.lastFailure = Date.now();
      
      // Open circuit breaker after 5 consecutive failures
      if (breaker.failures >= 5) {
        breaker.state = 'OPEN';
        console.warn(`Circuit breaker opened for pool ${poolKey} due to consecutive failures`);
      }
    }
  }
}

// Export singleton instance
export const optimizedRDSManager = new OptimizedRDSManager();
