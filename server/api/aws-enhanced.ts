import express from 'express';
import { 
  secretConfigManager, 
  connectionManager, 
  secretsMonitor,
  EnhancedAWSClientFactory 
} from '../../src/lib/aws-sdk-enhanced';

const router = express.Router();

/**
 * Enhanced AWS SDK Management Endpoints
 * 
 * Provides comprehensive monitoring, management, and diagnostic
 * endpoints for the enhanced AWS services integration.
 */

// Middleware for admin-only endpoints
const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const adminToken = req.headers['x-admin-token'];
  
  // In production, implement proper admin authentication
  if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({
      error: 'Admin access required',
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

// === HEALTH AND STATUS ENDPOINTS ===

/**
 * GET /api/aws-enhanced/health
 * Complete health check for all AWS services
 */
router.get('/health', async (req, res) => {
  try {
    const startTime = Date.now();
    const health = await secretsMonitor.getHealthStatus();
    const clientHealth = await EnhancedAWSClientFactory.healthCheck({
      region: 'us-east-1',
      environment: (process.env.NODE_ENV as any) || 'development'
    });
    
    const healthStatus = {
      status: health.overall?.healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      response_time_ms: Date.now() - startTime,
      services: {
        secrets_manager: {
          healthy: health.cache?.healthy || false,
          cache_size: health.cache?.size || 0,
          hit_rate: health.cache?.hitRate || 0,
          errors_last_hour: health.cache?.errorsLastHour || 0
        },
        connections: {
          healthy: health.connections?.healthy || false,
          total: health.connections?.total || 0,
          active: health.connections?.healthy || 0
        },
        performance: {
          healthy: health.performance?.healthy || false,
          avg_latency_ms: health.performance?.averageLatency || 0,
          success_rate: health.performance?.successRate || 0
        },
        aws_connectivity: {
          healthy: clientHealth.healthy,
          region: clientHealth.region,
          services: clientHealth.services,
          latency: clientHealth.latency
        }
      }
    };
    
    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/aws-enhanced/status
 * Detailed status information
 */
router.get('/status', async (req, res) => {
  try {
    const [
      cacheStats,
      connectionHealth,
      circuitBreakers,
      metrics
    ] = await Promise.all([
      secretConfigManager.getCacheStats(),
      connectionManager.getConnectionHealth(),
      secretConfigManager.getCircuitBreakerStatus(),
      secretConfigManager.getMetrics()
    ]);
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      cache: {
        size: cacheStats.size,
        hit_rate: cacheStats.hitRate,
        total_requests: cacheStats.totalRequests,
        hits: cacheStats.hits,
        misses: cacheStats.misses
      },
      connections: {
        total: connectionHealth.size,
        active: connectionManager.getActiveConnectionsCount(),
        health_map: Object.fromEntries(connectionHealth.entries())
      },
      circuit_breakers: {
        total: circuitBreakers.size,
        states: Object.fromEntries(
          Array.from(circuitBreakers.entries()).map(([key, breaker]) => [
            key,
            {
              state: breaker.state,
              failure_count: breaker.failureCount,
              next_attempt: breaker.nextAttempt
            }
          ])
        )
      },
      metrics: {
        total_collected: metrics.length,
        last_24h: metrics.filter(m => 
          Date.now() - new Date(m.timestamp).getTime() < 24 * 60 * 60 * 1000
        ).length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
});

// === CACHE MANAGEMENT ===

/**
 * GET /api/aws-enhanced/cache/stats
 * Detailed cache statistics
 */
router.get('/cache/stats', async (req, res) => {
  try {
    const stats = secretConfigManager.getCacheStats();
    res.json({
      ...stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * DELETE /api/aws-enhanced/cache/clear
 * Clear all cached secrets (Admin only)
 */
router.delete('/cache/clear', requireAdmin, async (req, res) => {
  try {
    await secretConfigManager.clearCache();
    res.json({
      status: 'success',
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/aws-enhanced/cache/warmup
 * Warm up cache with common secrets (Admin only)
 */
router.post('/cache/warmup', requireAdmin, async (req, res) => {
  try {
    const environment = req.body.environment || process.env.NODE_ENV || 'development';
    await secretConfigManager.warmupCache(environment);
    
    res.json({
      status: 'success',
      message: `Cache warmed up for ${environment} environment`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
});

// === CONNECTION MANAGEMENT ===

/**
 * GET /api/aws-enhanced/connections
 * Connection status and health
 */
router.get('/connections', async (req, res) => {
  try {
    const health = connectionManager.getConnectionHealth();
    const activeCount = connectionManager.getActiveConnectionsCount();
    
    res.json({
      status: 'ok',
      connections: {
        total: health.size,
        active: activeCount,
        healthy_percentage: health.size > 0 ? (activeCount / health.size) * 100 : 0,
        details: Object.fromEntries(health.entries())
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/aws-enhanced/connections/rotate
 * Force rotation of all connections (Admin only)
 */
router.post('/connections/rotate', requireAdmin, async (req, res) => {
  try {
    await connectionManager.forceRotation();
    res.json({
      status: 'success',
      message: 'Connection rotation completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
});

// === METRICS AND MONITORING ===

/**
 * GET /api/aws-enhanced/metrics
 * Retrieve collected metrics
 */
router.get('/metrics', async (req, res) => {
  try {
    const hoursBack = parseInt(req.query.hours as string) || 24;
    const cutoff = Date.now() - (hoursBack * 60 * 60 * 1000);
    
    const allMetrics = secretConfigManager.getMetrics();
    const filteredMetrics = allMetrics.filter(m => 
      new Date(m.timestamp).getTime() >= cutoff
    );
    
    // Aggregate metrics by type
    const aggregated = {
      cache_operations: filteredMetrics.filter(m => m.type === 'cache'),
      secret_retrievals: filteredMetrics.filter(m => m.type === 'secret_retrieval'),
      errors: filteredMetrics.filter(m => m.type === 'error'),
      performance: filteredMetrics.filter(m => m.type === 'performance')
    };
    
    res.json({
      time_range_hours: hoursBack,
      total_metrics: filteredMetrics.length,
      aggregated,
      summary: {
        cache_hit_rate: calculateHitRate(aggregated.cache_operations),
        avg_retrieval_time: calculateAverageTime(aggregated.secret_retrievals),
        error_rate: (aggregated.errors.length / filteredMetrics.length) * 100,
        total_requests: aggregated.secret_retrievals.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/aws-enhanced/report
 * Generate comprehensive monitoring report
 */
router.get('/report', async (req, res) => {
  try {
    const report = await secretsMonitor.generateMonitoringReport();
    
    res.setHeader('Content-Type', 'text/plain');
    res.send(report);
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
});

// === TESTING AND DIAGNOSTICS ===

/**
 * POST /api/aws-enhanced/test/secret-access
 * Test secret access (Admin only)
 */
router.post('/test/secret-access', requireAdmin, async (req, res) => {
  try {
    const { secretName, secretType = 'config' } = req.body;
    
    if (!secretName) {
      return res.status(400).json({
        error: 'secretName is required',
        timestamp: new Date().toISOString()
      });
    }
    
    const startTime = Date.now();
    const result = await secretConfigManager.testSecretAccess(secretName, secretType);
    const duration = Date.now() - startTime;
    
    res.json({
      status: 'success',
      secret_name: secretName,
      secret_type: secretType,
      access_successful: !!result,
      response_time_ms: duration,
      cached: result?.cached || false,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
      secret_name: req.body.secretName,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/aws-enhanced/test/connectivity
 * Test AWS connectivity across regions
 */
router.get('/test/connectivity', async (req, res) => {
  try {
    const regions = ['us-east-1', 'us-west-2', 'eu-west-1'];
    const environment = (process.env.NODE_ENV as any) || 'development';
    
    const results = await Promise.allSettled(
      regions.map(async (region) => {
        const startTime = Date.now();
        const health = await EnhancedAWSClientFactory.healthCheck({
          region,
          environment
        });
        return {
          region,
          ...health,
          response_time_ms: Date.now() - startTime
        };
      })
    );
    
    const connectivity = results.map((result, index) => ({
      region: regions[index],
      status: result.status === 'fulfilled' ? 'success' : 'failed',
      ...(result.status === 'fulfilled' ? result.value : { error: (result.reason as Error).message })
    }));
    
    res.json({
      status: 'ok',
      regions_tested: regions.length,
      connectivity,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
});

// Helper functions
function calculateHitRate(cacheOps: any[]): number {
  if (cacheOps.length === 0) return 0;
  const hits = cacheOps.filter(op => op.data?.hit === true).length;
  return (hits / cacheOps.length) * 100;
}

function calculateAverageTime(retrievals: any[]): number {
  if (retrievals.length === 0) return 0;
  const total = retrievals.reduce((sum, r) => sum + (r.data?.duration || 0), 0);
  return total / retrievals.length;
}

export default router;
