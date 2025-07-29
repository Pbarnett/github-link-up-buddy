/**
 * Advanced Retry Logic System
 * 
 * Provides intelligent retry mechanisms with exponential backoff,
 * circuit breaker patterns, and contextual retry strategies
 */

import logger from '@/lib/logger';

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number; // Base delay in milliseconds
  maxDelay: number; // Maximum delay cap
  backoffMultiplier: number;
  jitter: boolean; // Add randomness to prevent thundering herd
  retryableErrors: Array<string | RegExp | ((error: Error) => boolean)>;
  onRetry?: (attempt: number, error: Error, nextDelay: number) => void;
  onMaxRetriesReached?: (error: Error) => void;
}

export interface CircuitBreakerConfig {
  failureThreshold: number; // Number of failures before opening circuit
  recoveryTimeout: number; // Time before trying to close circuit
  monitoringPeriod: number; // Time window for monitoring failures
}

export interface RetryOperation<T> {
  id: string;
  fn: () => Promise<T>;
  config: RetryConfig;
  circuitBreaker?: CircuitBreakerConfig;
}

enum CircuitState {
  CLOSED = 'closed',
  OPEN = 'open',
  HALF_OPEN = 'half_open',
}

interface CircuitBreakerState {
  state: CircuitState;
  failures: number;
  lastFailureTime: number;
  successes: number;
}

class CircuitBreaker {
  private state: CircuitBreakerState;
  private config: CircuitBreakerConfig;
  private recentFailures: number[] = [];

  constructor(config: CircuitBreakerConfig) {
    this.config = config;
    this.state = {
      state: CircuitState.CLOSED,
      failures: 0,
      lastFailureTime: 0,
      successes: 0,
    };
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state.state === CircuitState.OPEN) {
      if (Date.now() - this.state.lastFailureTime < this.config.recoveryTimeout) {
        throw new Error('Circuit breaker is OPEN - operation rejected');
      }
      // Try to close circuit
      this.state.state = CircuitState.HALF_OPEN;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.state.successes++;
    if (this.state.state === CircuitState.HALF_OPEN) {
      this.state.state = CircuitState.CLOSED;
      this.state.failures = 0;
      this.recentFailures = [];
    }
  }

  private onFailure() {
    const now = Date.now();
    this.state.failures++;
    this.state.lastFailureTime = now;
    this.recentFailures.push(now);

    // Clean old failures outside monitoring period
    this.recentFailures = this.recentFailures.filter(
      time => now - time < this.config.monitoringPeriod
    );

    if (
      this.recentFailures.length >= this.config.failureThreshold &&
      this.state.state === CircuitState.CLOSED
    ) {
      this.state.state = CircuitState.OPEN;
      logger.warn(`Circuit breaker opened after ${this.state.failures} failures`);
    }
  }

  getState(): CircuitBreakerState {
    return { ...this.state };
  }
}

/**
 * Advanced retry system with circuit breaker support
 */
export class RetrySystem {
  private circuitBreakers = new Map<string, CircuitBreaker>();

  /**
   * Execute operation with retry logic
   */
  async execute<T>(operation: RetryOperation<T>): Promise<T> {
    const { id, fn, config, circuitBreaker } = operation;
    
    // Initialize circuit breaker if configured
    if (circuitBreaker && !this.circuitBreakers.has(id)) {
      this.circuitBreakers.set(id, new CircuitBreaker(circuitBreaker));
    }

    const cb = this.circuitBreakers.get(id);
    let lastError: Error;
    let attempt = 0;

    while (attempt <= config.maxRetries) {
      try {
        const executeOperation = async () => {
          attempt++;
          logger.debug(`Executing operation ${id}, attempt ${attempt}`);
          return await fn();
        };

        // Execute with circuit breaker if available
        if (cb) {
          return await cb.execute(executeOperation);
        } else {
          return await executeOperation();
        }
      } catch (error) {
        lastError = error as Error;
        
        // Check if error is retryable
        if (!this.isRetryableError(error as Error, config.retryableErrors)) {
          logger.error(`Non-retryable error in operation ${id}:`, error);
          throw error;
        }

        // If this was the last attempt, throw the error
        if (attempt >= config.maxRetries) {
          logger.error(`Max retries (${config.maxRetries}) reached for operation ${id}`);
          config.onMaxRetriesReached?.(error as Error);
          throw error;
        }

        // Calculate delay for next attempt
        const delay = this.calculateDelay(attempt, config);
        
        logger.warn(
          `Operation ${id} failed (attempt ${attempt}/${config.maxRetries}). Retrying in ${delay}ms`,
          { error: error.message }
        );
        
        config.onRetry?.(attempt, error as Error, delay);
        
        // Wait before retry
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Get circuit breaker state for an operation
   */
  getCircuitBreakerState(operationId: string): CircuitBreakerState | null {
    const cb = this.circuitBreakers.get(operationId);
    return cb ? cb.getState() : null;
  }

  /**
   * Reset circuit breaker for an operation
   */
  resetCircuitBreaker(operationId: string): void {
    this.circuitBreakers.delete(operationId);
  }

  /**
   * Check if error is retryable based on configuration
   */
  private isRetryableError(error: Error, retryableErrors: RetryConfig['retryableErrors']): boolean {
    return retryableErrors.some(matcher => {
      if (typeof matcher === 'string') {
        return error.message.includes(matcher);
      }
      if (matcher instanceof RegExp) {
        return matcher.test(error.message);
      }
      if (typeof matcher === 'function') {
        return matcher(error);
      }
      return false;
    });
  }

  /**
   * Calculate delay with exponential backoff and jitter
   */
  private calculateDelay(attempt: number, config: RetryConfig): number {
    let delay = Math.min(
      config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1),
      config.maxDelay
    );

    // Add jitter to prevent thundering herd
    if (config.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }

    return Math.floor(delay);
  }

  /**
   * Promise-based sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Global retry system instance
export const retrySystem = new RetrySystem();

// Predefined retry configurations for common scenarios
export const RETRY_CONFIGS = {
  API_CALL: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    jitter: true,
    retryableErrors: [
      'Network Error',
      'timeout',
      'ECONNRESET',
      'ENOTFOUND',
      /5\d{2}/, // 5xx HTTP errors
      (error: Error) => error.message.includes('fetch failed'),
    ],
  },

  FLIGHT_SEARCH: {
    maxRetries: 2,
    baseDelay: 2000,
    maxDelay: 8000,
    backoffMultiplier: 2,
    jitter: true,
    retryableErrors: [
      'timeout',
      'Service Unavailable',
      'Too Many Requests',
      /502|503|504/, // Gateway errors
      (error: Error) => error.message.includes('Amadeus'),
    ],
  },

  DATABASE_OPERATION: {
    maxRetries: 3,
    baseDelay: 500,
    maxDelay: 5000,
    backoffMultiplier: 2,
    jitter: true,
    retryableErrors: [
      'connection timeout',
      'connection refused',
      'temporary failure',
      /PGRST\d{3}/, // PostgREST errors
    ],
  },

  PAYMENT_PROCESSING: {
    maxRetries: 1, // Be very careful with payment retries
    baseDelay: 2000,
    maxDelay: 2000,
    backoffMultiplier: 1,
    jitter: false,
    retryableErrors: [
      'network_error',
      'processing_timeout',
      (error: Error) => {
        // Only retry specific Stripe errors that are safe to retry
        return error.message.includes('network') && 
               !error.message.includes('card_declined');
      },
    ],
  },
} as const;

// Circuit breaker configurations
export const CIRCUIT_BREAKER_CONFIGS = {
  FLIGHT_SEARCH_API: {
    failureThreshold: 5,
    recoveryTimeout: 60000, // 1 minute
    monitoringPeriod: 300000, // 5 minutes
  },

  PAYMENT_GATEWAY: {
    failureThreshold: 3,
    recoveryTimeout: 30000, // 30 seconds
    monitoringPeriod: 120000, // 2 minutes
  },

  DATABASE: {
    failureThreshold: 5,
    recoveryTimeout: 10000, // 10 seconds
    monitoringPeriod: 60000, // 1 minute
  },
} as const;

/**
 * Convenience function for API calls with retry
 */
export async function retryApiCall<T>(
  operationId: string,
  apiFunction: () => Promise<T>,
  customConfig?: Partial<RetryConfig>
): Promise<T> {
  const config = { ...RETRY_CONFIGS.API_CALL, ...customConfig };
  
  return retrySystem.execute({
    id: operationId,
    fn: apiFunction,
    config,
  });
}

/**
 * Convenience function for flight search with retry and circuit breaker
 */
export async function retryFlightSearch<T>(
  operationId: string,
  searchFunction: () => Promise<T>,
  customConfig?: Partial<RetryConfig>
): Promise<T> {
  const config = { ...RETRY_CONFIGS.FLIGHT_SEARCH, ...customConfig };
  
  return retrySystem.execute({
    id: operationId,
    fn: searchFunction,
    config,
    circuitBreaker: CIRCUIT_BREAKER_CONFIGS.FLIGHT_SEARCH_API,
  });
}

/**
 * Convenience function for database operations with retry
 */
export async function retryDatabaseOperation<T>(
  operationId: string,
  dbFunction: () => Promise<T>,
  customConfig?: Partial<RetryConfig>
): Promise<T> {
  const config = { ...RETRY_CONFIGS.DATABASE_OPERATION, ...customConfig };
  
  return retrySystem.execute({
    id: `db_${operationId}`,
    fn: dbFunction,
    config,
    circuitBreaker: CIRCUIT_BREAKER_CONFIGS.DATABASE,
  });
}

/**
 * Convenience function for payment processing with retry
 */
export async function retryPaymentOperation<T>(
  operationId: string,
  paymentFunction: () => Promise<T>,
  customConfig?: Partial<RetryConfig>
): Promise<T> {
  const config = { ...RETRY_CONFIGS.PAYMENT_PROCESSING, ...customConfig };
  
  return retrySystem.execute({
    id: `payment_${operationId}`,
    fn: paymentFunction,
    config,
    circuitBreaker: CIRCUIT_BREAKER_CONFIGS.PAYMENT_GATEWAY,
  });
}
