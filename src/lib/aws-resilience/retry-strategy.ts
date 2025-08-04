/**
 * Intelligent Retry Strategy with Exponential Backoff and Jitter
 * 
 * Customized retry strategies for AWS services with rate limiting and
 * intelligent backoff handling for different error types.
 */

import { RetryConfig, ErrorType } from './types';
import { getServiceConfig } from './service-configs';

export class IntelligentRetryStrategy {
  private globalRetryCounter = new Map<string, number>();
  private lastResetTime = Date.now();
  private readonly GLOBAL_RESET_INTERVAL = 60000; // 1 minute

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    serviceName: string,
    operationId: string = 'default'
  ): Promise<T> {
    const config = getServiceConfig(serviceName).retryConfig;
    let lastError: Error;

    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        const errorType = this.classifyError(error as any, config);

        // Don't retry non-retryable errors
        if (errorType === ErrorType.NON_RETRYABLE) {
          throw error;
        }

        // Check global retry limits to prevent storms
        if (this.isGlobalRetryLimitExceeded(serviceName)) {
          console.warn(`Global retry limit exceeded for service ${serviceName}`);
          throw new Error(`Global retry limit exceeded for service ${serviceName}`);
        }

        if (attempt < config.maxRetries) {
          const delay = this.calculateDelay(attempt, errorType, config);

          console.warn(`Retry attempt ${attempt}/${config.maxRetries} for ${serviceName}:${operationId}`, {
            error: errorType,
            delay
          });

          this.incrementGlobalRetryCounter(serviceName);
          await this.sleep(delay);
        }
      }
    }

    throw lastError!;
  }

  private classifyError(error: any, config: RetryConfig): ErrorType {
    if (config.retryableErrors.includes(error.name)) {
      return ErrorType.RETRYABLE;
    }
    if (config.nonRetryableErrors.includes(error.name)) {
      return ErrorType.NON_RETRYABLE;
    }
    return ErrorType.RETRYABLE; // Default classification
  }

  private calculateDelay(attempt: number, errorType: ErrorType, config: RetryConfig): number {
    let baseDelay = config.baseDelayMs;

    // Adjust base delay based on error type
    switch (errorType) {
      case ErrorType.THROTTLING:
        baseDelay *= 3; // Longer delays for throttling
        break;
      case ErrorType.CIRCUIT_BREAKER:
        baseDelay *= 2;
        break;
    }

    // Calculate exponential backoff
    let delay = baseDelay * Math.pow(config.backoffMultiplier, attempt - 1);

    // Add decorrelated jitter to prevent thundering herd
    const jitter = delay * config.jitterFactor * Math.random();
    delay += jitter;

    // Apply max delay cap
    return Math.min(delay, config.maxDelayMs);
  }

  private isGlobalRetryLimitExceeded(serviceName: string): boolean {
    this.resetGlobalCountersIfNeeded();
    const currentRetries = this.globalRetryCounter.get(serviceName) || 0;

    // Global limits per service per minute
    const limits = getServiceConfig(serviceName).rateLimiter.globalLimits;

    return currentRetries >= (limits.maxRetries || 300);
  }

  private incrementGlobalRetryCounter(serviceName: string): void {
    const current = this.globalRetryCounter.get(serviceName) || 0;
    this.globalRetryCounter.set(serviceName, current + 1);
  }

  private resetGlobalCountersIfNeeded(): void {
    const now = Date.now();
    if (now - this.lastResetTime >= this.GLOBAL_RESET_INTERVAL) {
      this.globalRetryCounter.clear();
      this.lastResetTime = now;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
