/**
 * Database Initialization Module
 * 
 * Handles the startup sequence for database connections, pools, and monitoring.
 * This should be called early in the application lifecycle.
 */

import { initializeConnectionPool, shutdownConnectionPool } from './connection-pool';
import { databaseAnalytics } from './analytics';
import { DatabaseOperations } from '../supabase/database-operations';
import { redisClient } from '../cache/redis-client';
import { startOpenTelemetry } from '../tracing/otel-instrumentation';

/**
 * Initialize the database layer
 */
export async function initializeDatabase(userId?: string): Promise<void> {
  console.log('🚀 Initializing database layer...');

  try {
    // Initialize OpenTelemetry tracing first
    await startOpenTelemetry();
    
    // Initialize connection pool (will check feature flags internally)
    await initializeConnectionPool(userId);
    
    // Initialize Redis cache (will check feature flags internally)
    console.log('🔄 Redis client initialized (feature flag controlled)');
    const cacheMetrics = redisClient.getMetrics();
    console.log('📊 Initial cache metrics:', {
      hitRatio: redisClient.getHitRatio(),
      lastHealthCheck: cacheMetrics.lastHealthCheck
    });

    // Test basic connectivity
    const healthCheck = await DatabaseOperations.healthCheck();
    if (!healthCheck.healthy) {
      console.warn('⚠️ Database health check failed:', healthCheck.error);
    } else {
      console.log('✅ Database connectivity verified', {
        latency: healthCheck.latency,
        timestamp: healthCheck.timestamp
      });
    }

    // Clear old analytics data on startup (optional)
    databaseAnalytics.clearMetrics(24 * 60 * 60 * 1000); // Keep last 24 hours

    console.log('✅ Database layer initialized successfully');

  } catch (error) {
    console.error('❌ Failed to initialize database layer:', error);
    // Don't throw - allow application to continue with degraded functionality
  }
}

/**
 * Gracefully shutdown the database layer
 */
export async function shutdownDatabase(): Promise<void> {
  console.log('🔄 Shutting down database layer...');

  try {
    // Shutdown Redis connection
    await redisClient.disconnect();
    console.log('✅ Redis client disconnected');
    
    // Shutdown connection pool
    await shutdownConnectionPool();
    console.log('✅ Database layer shutdown complete');
  } catch (error) {
    console.error('❌ Error during database shutdown:', error);
  }
}

/**
 * Get database status summary
 */
export async function getDatabaseStatus(): Promise<{
  connectionPool: boolean;
  health: any;
  analytics: any;
}> {
  const { getConnectionPool } = await import('./connection-pool');
  const pool = getConnectionPool();
  
  const health = await DatabaseOperations.healthCheck();
  const analytics = databaseAnalytics.generateHealthReport();

  return {
    connectionPool: pool.isEnabled,
    health,
    analytics
  };
}

/**
 * React hook for database initialization status
 */
export function useDatabaseStatus() {
  const [status, setStatus] = React.useState<{
    initialized: boolean;
    connectionPool: boolean;
    healthy: boolean;
    error?: string;
  }>({
    initialized: false,
    connectionPool: false,
    healthy: false
  });

  React.useEffect(() => {
    let mounted = true;

    const checkStatus = async () => {
      try {
        const dbStatus = await getDatabaseStatus();
        
        if (mounted) {
          setStatus({
            initialized: true,
            connectionPool: dbStatus.connectionPool,
            healthy: dbStatus.health.healthy,
          });
        }
      } catch (error) {
        if (mounted) {
          setStatus({
            initialized: false,
            connectionPool: false,
            healthy: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    };

    checkStatus();

    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return status;
}

// Global error handlers for database operations
process.on('unhandledRejection', (reason, promise) => {
  if (reason && typeof reason === 'object' && 'code' in reason) {
    // Database connection errors
    if (['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT'].includes(reason.code as string)) {
      console.error('🔴 Database connection error:', reason);
      // Could trigger circuit breaker or alert systems here
    }
  }
});

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  console.log('📴 SIGTERM received, shutting down database layer...');
  await shutdownDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📴 SIGINT received, shutting down database layer...');
  await shutdownDatabase();
  process.exit(0);
});

import * as React from 'react';
