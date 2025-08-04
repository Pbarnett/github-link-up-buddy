/**
 * AWS Resilience Orchestrator
 * 
 * Main orchestrator that coordinates circuit breakers, retries, rate limiting,
 * and graceful degradation for AWS service operations.
 */

import { ResilienceConfig, ResilienceContext, OperationMetrics } from './types';
import { getServiceConfig } from './service-configs';
import { AdvancedCircuitBreaker, circuitBreakerRegistry } from './circuit-breaker';
import { IntelligentRetryStrategy } from './retry-strategy';
import { rateLimiterRegistry } from './rate-limiter';
import { awsDegradationManager } from './degradation-manager';

export class ResilienceOrchestrator {
  private retryStrategy = new IntelligentRetryStrategy();
  private operationMetrics = new Map<string, OperationMetrics>();
  private metricsRetentionMs = 300000; // 5 minutes

  /**
   * Execute operation with full resilience protection
   */
  async executeWithResilience<T>(
    serviceName: string,
    operationName: string,
    operation: () => Promise<T>,
    context?: any
  ): Promise<T> {
    const operationId = `${serviceName}:${operationName}`;
    const startTime = Date.now();

    // Get rate limiter and acquire token
    const rateLimiter = rateLimiterRegistry.getRateLimiter(serviceName);
    await rateLimiter.acquire();

    try {
      // Execute with retry strategy inside circuit breaker
      const result = await this.retryStrategy.executeWithRetry(
        async () => {
          return await awsDegradationManager.executeWithDegradation(
            serviceName,
            operation,
            context
          );
        },
        serviceName,
        operationId
      );

      this.recordOperationSuccess(operationId, startTime);
      return result;
    } catch (error) {
      this.recordOperationFailure(operationId, startTime, error);
      throw error;
    }
  }

  private recordOperationSuccess(operationId: string, startTime: number): void {
    const responseTime = Date.now() - startTime;
    const metrics = this.getOrCreateMetrics(operationId);

    metrics.totalRequests++;
    metrics.successCount++;
    metrics.avgResponseTime = this.updateMovingAverage(
      metrics.avgResponseTime,
      responseTime,
      metrics.totalRequests
    );
    metrics.p95ResponseTime = this.updateP95(operationId, responseTime);
  }

  private recordOperationFailure(operationId: string, startTime: number, error: any): void {
    const responseTime = Date.now() - startTime;
    const metrics = this.getOrCreateMetrics(operationId);

    metrics.totalRequests++;
    metrics.failureCount++;
    metrics.lastFailureTime = Date.now();
    metrics.consecutiveFailures++;
    metrics.avgResponseTime = this.updateMovingAverage(
      metrics.avgResponseTime,
      responseTime,
      metrics.totalRequests
    );
  }

  private getOrCreateMetrics(operationId: string): OperationMetrics {
    if (!this.operationMetrics.has(operationId)) {
      const serviceName = operationId.split(':')[0];
      const breaker = circuitBreakerRegistry.getBreaker(serviceName);
      
      this.operationMetrics.set(operationId, {
        totalRequests: 0,
        successCount: 0,
        failureCount: 0,
        avgResponseTime: 0,
        p95ResponseTime: 0,
        circuitState: breaker.getState(),
        lastFailureTime: 0,
        consecutiveFailures: 0,
        retryCount: 0,
        fallbackUsageCount: 0
      });
    }
    return this.operationMetrics.get(operationId)!;
  }

  private updateMovingAverage(currentAvg: number, newValue: number, count: number): number {
    return (currentAvg * (count - 1) + newValue) / count;
  }

  private updateP95(operationId: string, responseTime: number): number {
    // Simplified P95 calculation - in production, you'd want a more sophisticated approach
    const metrics = this.operationMetrics.get(operationId)!;
    return Math.max(metrics.p95ResponseTime, responseTime * 0.95);
  }

  /**
   * Get comprehensive metrics for all operations
   */
  getComprehensiveMetrics(): {
    operations: Record<string, OperationMetrics>;
    circuitBreakers: Record<string, any>;
    rateLimiters: Record<string, any>;
    systemHealth: any;
  } {
    return {
      operations: Object.fromEntries(this.operationMetrics),
      circuitBreakers: circuitBreakerRegistry.getAllMetrics(),
      rateLimiters: rateLimiterRegistry.getAllMetrics(),
      systemHealth: circuitBreakerRegistry.getSystemHealth()
    };
  }

  /**
   * Reset all resilience components
   */
  resetAll(): void {
    circuitBreakerRegistry.resetAll();
    this.operationMetrics.clear();
    console.info('All resilience components reset');
  }

  /**
   * Clean up old metrics
   */
  cleanupMetrics(): void {
    const cutoff = Date.now() - this.metricsRetentionMs;
    
    for (const [operationId, metrics] of this.operationMetrics) {
      if (metrics.lastFailureTime < cutoff && metrics.totalRequests === 0) {
        this.operationMetrics.delete(operationId);
      }
    }
  }

  /**
   * Get health status of all services
   */
  getHealthStatus(): {
    overall: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, {
      status: 'healthy' | 'degraded' | 'unhealthy';
      circuitState: string;
      successRate: number;
      avgResponseTime: number;
    }>;
  } {
    const systemHealth = circuitBreakerRegistry.getSystemHealth();
    const serviceMetrics: Record<string, any> = {};

    for (const [operationId, metrics] of this.operationMetrics) {
      const serviceName = operationId.split(':')[0];
      const successRate = metrics.totalRequests > 0 
        ? metrics.successCount / metrics.totalRequests 
        : 1;

      serviceMetrics[serviceName] = {
        status: this.determineServiceStatus(metrics, successRate),
        circuitState: metrics.circuitState,
        successRate,
        avgResponseTime: metrics.avgResponseTime
      };
    }

    return {
      overall: this.determineOverallHealth(systemHealth),
      services: serviceMetrics
    };
  }

  private determineServiceStatus(metrics: OperationMetrics, successRate: number): 'healthy' | 'degraded' | 'unhealthy' {
    if (metrics.circuitState === 'OPEN') return 'unhealthy';
    if (metrics.circuitState === 'HALF_OPEN' || successRate < 0.9) return 'degraded';
    return 'healthy';
  }

  private determineOverallHealth(systemHealth: any): 'healthy' | 'degraded' | 'unhealthy' {
    if (systemHealth.score === 1) return 'healthy';
    if (systemHealth.score > 0.5) return 'degraded';
    return 'unhealthy';
  }
}

// Global resilience orchestrator instance
export const resilienceOrchestrator = new ResilienceOrchestrator();

/**
 * Convenience function to execute with resilience
 */
export async function executeWithResilience<T>(
  serviceName: string,
  operationName: string,
  operation: () => Promise<T>,
  context?: any
): Promise<T> {
  return resilienceOrchestrator.executeWithResilience(
    serviceName,
    operationName,
    operation,
    context
  );
}

/**
 * Create a resilient wrapper for AWS SDK clients
 */
export function createAwsResilientClient<T extends Record<string, any>>(
  client: T,
  serviceName: string
): T {
  const wrappedClient = {} as T;

  // Wrap all methods of the client
  for (const [methodName, method] of Object.entries(client)) {
    if (typeof method === 'function') {
      wrappedClient[methodName as keyof T] = (async (...args: any[]) => {
        return executeWithResilience(
          serviceName,
          methodName,
          () => method.apply(client, args)
        );
      }) as any;
    } else {
      wrappedClient[methodName as keyof T] = method;
    }
  }

  return wrappedClient;
}

/**
 * Higher-order function to add resilience to any AWS operation
 */
export function withAwsResilience<TArgs extends any[], TReturn>(
  serviceName: string,
  operationName: string,
  operation: (...args: TArgs) => Promise<TReturn>
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    return executeWithResilience(
      serviceName,
      operationName,
      () => operation(...args)
    );
  };
}

// Start health checks and cleanup processes
awsDegradationManager.startHealthChecks();

// Clean up metrics every 5 minutes
setInterval(() => {
  resilienceOrchestrator.cleanupMetrics();
}, 300000);
