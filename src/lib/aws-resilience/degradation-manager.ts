/**
 * Graceful Degradation Manager
 * 
 * Manages service degradation strategies with configurable fallbacks
 * and health checks for critical AWS services.
 */

import { DegradationStrategy, ServiceConfig } from './types';
import { getDegradationStrategy, getServiceConfig } from './service-configs';
import { withCircuitBreaker } from './circuit-breaker';

export class GracefulDegradationManager {
  private degradationStrategies = new Map<string, DegradationStrategy>();
  private serviceHealth = new Map<string, boolean>();
  private activeFallbacks = new Map<string, number>();
  private recoveryAttempts = new Map<string, number>();

  constructor(serviceNames: string[]) {
    serviceNames.forEach((serviceName) => {
      const strategy = getDegradationStrategy(serviceName);
      if (strategy) {
        this.degradationStrategies.set(serviceName.toUpperCase(), strategy);
        this.serviceHealth.set(serviceName.toUpperCase(), true);
      }
    });
  }

  async executeWithDegradation<T>(
    serviceName: string,
    primaryOperation: () => Promise<T>,
    operationContext?: any
  ): Promise<T> {
    const strategy = this.degradationStrategies.get(serviceName.toUpperCase());
    const isHealthy = this.serviceHealth.get(serviceName.toUpperCase()) ?? true;

    try {
      // Try primary operation if service is healthy
      if (isHealthy) {
        const result = await withCircuitBreaker(serviceName, primaryOperation);
        this.markServiceHealthy(serviceName);
        return result;
      }
    } catch (error) {
      this.markServiceUnhealthy(serviceName);

      // Try fallback methods
      if (strategy?.fallbackMethods) {
        return this.executeFallbacks(serviceName, strategy, operationContext);
      }

      throw error;
    }

    // If service is unhealthy, try fallbacks directly
    if (strategy?.fallbackMethods) {
      return this.executeFallbacks(serviceName, strategy, operationContext);
    }

    throw new Error(`Service ${serviceName} is unhealthy and no fallbacks available`);
  }

  private async executeFallbacks<T>(
    serviceName: string,
    strategy: DegradationStrategy,
    context?: any
  ): Promise<T> {
    const sortedFallbacks = strategy.fallbackMethods.sort((a, b) => a.priority - b.priority);

    for (const fallback of sortedFallbacks) {
      try {
        const activeCount = this.activeFallbacks.get(serviceName.toUpperCase()) || 0;
        if (activeCount < fallback.priority) {
          if (fallback.healthCheck && !(await fallback.healthCheck())) {
            continue;
          }

          console.info(`Using fallback method ${fallback.name} for ${serviceName}`);
          const result = await fallback.execute(context);
          this.activeFallbacks.set(serviceName.toUpperCase(), fallback.priority);
          return result;
        }
      } catch (error) {
        console.warn(`Fallback ${fallback.name} failed for ${serviceName}:`, error);
        continue;
      }
    }

    throw new Error(`All fallback methods failed for ${serviceName}`);
  }

  private markServiceHealthy(serviceName: string): void {
    const wasUnhealthy = !this.serviceHealth.get(serviceName.toUpperCase());
    this.serviceHealth.set(serviceName.toUpperCase(), true);

    if (wasUnhealthy) {
      console.info(`Service ${serviceName} recovered`);
      this.recoveryAttempts.delete(serviceName.toUpperCase());
      this.activeFallbacks.delete(serviceName.toUpperCase());
    }
  }

  private markServiceUnhealthy(serviceName: string): void {
    const wasHealthy = this.serviceHealth.get(serviceName.toUpperCase());
    this.serviceHealth.set(serviceName.toUpperCase(), false);

    if (wasHealthy) {
      console.warn(`Service ${serviceName} marked as unhealthy`);
    }
  }

  startHealthChecks(): void {
    setInterval(async () => {
      for (const [serviceName, strategy] of this.degradationStrategies) {
        if (!this.serviceHealth.get(serviceName)) {
          try {
            const config: ServiceConfig = getServiceConfig(serviceName);
            const isHealthy = await config.healthCheck();
            if (isHealthy) {
              const attempts = this.recoveryAttempts.get(serviceName) || 0;
              this.recoveryAttempts.set(serviceName, attempts + 1);

              if (attempts + 1 >= strategy.recoveryCriteria.consecutiveSuccesses) {
                this.markServiceHealthy(serviceName);
              }
            } else {
              this.recoveryAttempts.set(serviceName, 0);
            }
          } catch (error) {
            this.recoveryAttempts.set(serviceName, 0);
          }
        }
      }
    }, 30000); // Check every 30 seconds
  }
}

// Example of creating a degradation manager for certain AWS services
export const awsDegradationManager = new GracefulDegradationManager([
  'KMS',
  'SECRETS_MANAGER',
  'DYNAMODB'
]);
