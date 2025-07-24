/**
 * Circuit Breaker Pattern Implementation
 *
 * Provides circuit breaker pattern for external API calls
 * to prevent cascading failures and improve system resilience.
 */

export enum CircuitBreakerState {
  CLOSED = 'CLOSED', // Normal operation
  OPEN = 'OPEN', // Circuit is open, calls are rejected
  HALF_OPEN = 'HALF_OPEN', // Testing if service has recovered
}

export interface CircuitBreakerConfig {
  failureThreshold: number; // Number of failures before opening circuit
  recoveryTimeout: number; // Time to wait before attempting recovery (ms)
  monitoringPeriod: number; // Period for failure rate calculation (ms)
  minimumRequests: number; // Minimum requests before calculating failure rate
  successThreshold: number; // Successful calls needed to close circuit in half-open state
}

export interface CircuitBreakerMetrics {
  state: CircuitBreakerState;
  totalRequests: number;
  successCount: number;
  failureCount: number;
  lastFailureTime: number;
  consecutiveFailures: number;
  successfulRecoveryAttempts: number;
  failureRate: number;
}

export class CircuitBreakerError extends Error {
  constructor(
    message: string,
    public readonly state: CircuitBreakerState
  ) {
    super(message);
    this.name = 'CircuitBreakerError';
  }
}

/**
 * Circuit Breaker implementation for external service calls
 */
export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private consecutiveFailures = 0;
  private lastFailureTime = 0;
  private nextAttemptTime = 0;
  private successfulRecoveryAttempts = 0;
  private totalRequests = 0;
  private requestHistory: Array<{ timestamp: number; success: boolean }> = [];

  constructor(
    private readonly name: string,
    private readonly config: CircuitBreakerConfig
  ) {}

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return this.call(fn);
  }

  /**
   * Main circuit breaker logic
   */
  private async call<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();

    // Check if circuit should transition states
    this.updateState(now);

    // If circuit is open, reject the call
    if (this.state === CircuitBreakerState.OPEN) {
      this.logStateChange('REJECTED', 'Circuit breaker is OPEN');
      throw new CircuitBreakerError(
        `${this.name} service is currently unavailable (circuit breaker is OPEN)`,
        this.state
      );
    }

    // Track the request
    this.totalRequests++;

    try {
      // Execute the function
      const startTime = performance.now();
      const result = await fn();
      const duration = performance.now() - startTime;

      // Record success
      this.onSuccess(now);
      this.logCall('SUCCESS', duration);

      return result;
    } catch (error) {
      // Record failure
      this.onFailure(now);
      this.logCall('FAILURE', 0, error);

      // Re-throw the original error
      throw error;
    }
  }

  /**
   * Handle successful call
   */
  private onSuccess(timestamp: number): void {
    this.successCount++;
    this.consecutiveFailures = 0;
    this.addToHistory(timestamp, true);

    // If in half-open state, check if we can close the circuit
    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.successfulRecoveryAttempts++;
      if (this.successfulRecoveryAttempts >= this.config.successThreshold) {
        this.transitionTo(CircuitBreakerState.CLOSED);
        this.resetCounters();
      }
    }
  }

  /**
   * Handle failed call
   */
  private onFailure(timestamp: number): void {
    this.failureCount++;
    this.consecutiveFailures++;
    this.lastFailureTime = timestamp;
    this.addToHistory(timestamp, false);

    // Check if we should open the circuit
    if (this.shouldOpenCircuit()) {
      this.transitionTo(CircuitBreakerState.OPEN);
      this.nextAttemptTime = timestamp + this.config.recoveryTimeout;
    }
  }

  /**
   * Update circuit breaker state based on current conditions
   */
  private updateState(now: number): void {
    if (
      this.state === CircuitBreakerState.OPEN &&
      now >= this.nextAttemptTime
    ) {
      this.transitionTo(CircuitBreakerState.HALF_OPEN);
      this.successfulRecoveryAttempts = 0;
    }
  }

  /**
   * Determine if circuit should be opened
   */
  private shouldOpenCircuit(): boolean {
    // Must have minimum number of requests
    if (this.totalRequests < this.config.minimumRequests) {
      return false;
    }

    // Check consecutive failures
    if (this.consecutiveFailures >= this.config.failureThreshold) {
      return true;
    }

    // Check failure rate over monitoring period
    const failureRate = this.calculateFailureRate();
    return (
      failureRate >= this.config.failureThreshold / this.config.minimumRequests
    );
  }

  /**
   * Calculate failure rate over the monitoring period
   */
  private calculateFailureRate(): number {
    const now = Date.now();
    const cutoff = now - this.config.monitoringPeriod;

    // Filter to recent requests
    const recentRequests = this.requestHistory.filter(
      r => r.timestamp >= cutoff
    );

    if (recentRequests.length === 0) {
      return 0;
    }

    const failures = recentRequests.filter(r => !r.success).length;
    return failures / recentRequests.length;
  }

  /**
   * Add request to history and clean up old entries
   */
  private addToHistory(timestamp: number, success: boolean): void {
    this.requestHistory.push({ timestamp, success });

    // Clean up old entries (keep only monitoring period + buffer)
    const cutoff = timestamp - this.config.monitoringPeriod * 2;
    this.requestHistory = this.requestHistory.filter(
      r => r.timestamp >= cutoff
    );
  }

  /**
   * Transition to a new state
   */
  private transitionTo(newState: CircuitBreakerState): void {
    if (this.state !== newState) {
      const oldState = this.state;
      this.state = newState;
      this.logStateChange('STATE_TRANSITION', `${oldState} -> ${newState}`);
    }
  }

  /**
   * Reset counters (typically when closing circuit)
   */
  private resetCounters(): void {
    this.consecutiveFailures = 0;
    this.successfulRecoveryAttempts = 0;
  }

  /**
   * Get current metrics
   */
  getMetrics(): CircuitBreakerMetrics {
    return {
      state: this.state,
      totalRequests: this.totalRequests,
      successCount: this.successCount,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
      consecutiveFailures: this.consecutiveFailures,
      successfulRecoveryAttempts: this.successfulRecoveryAttempts,
      failureRate: this.calculateFailureRate(),
    };
  }

  /**
   * Manually reset the circuit breaker
   */
  reset(): void {
    this.state = CircuitBreakerState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.consecutiveFailures = 0;
    this.lastFailureTime = 0;
    this.nextAttemptTime = 0;
    this.successfulRecoveryAttempts = 0;
    this.totalRequests = 0;
    this.requestHistory = [];
    this.logStateChange('RESET', 'Circuit breaker manually reset');
  }

  /**
   * Log circuit breaker events
   */
  private logCall(
    type: 'SUCCESS' | 'FAILURE',
    duration: number,
    error?: unknown
  ): void {
    const message =
      type === 'SUCCESS'
        ? `[CircuitBreaker:${this.name}] Call succeeded in ${duration.toFixed(2)}ms`
        : `[CircuitBreaker:${this.name}] Call failed: ${error instanceof Error ? error.message : 'Unknown error'}`;

    if (type === 'SUCCESS') {
      console.log(message);
    } else {
      console.warn(message);
    }
  }

  private logStateChange(event: string, details: string): void {
    console.log(`[CircuitBreaker:${this.name}] ${event}: ${details}`);
  }
}

/**
 * Default configurations for different service types
 */
export const CIRCUIT_BREAKER_CONFIGS = {
  // Configuration for critical external APIs (like Duffel booking)
  CRITICAL_API: {
    failureThreshold: 5,
    recoveryTimeout: 60000, // 1 minute
    monitoringPeriod: 120000, // 2 minutes
    minimumRequests: 10,
    successThreshold: 3,
  } as CircuitBreakerConfig,

  // Configuration for search APIs (more lenient)
  SEARCH_API: {
    failureThreshold: 10,
    recoveryTimeout: 30000, // 30 seconds
    monitoringPeriod: 60000, // 1 minute
    minimumRequests: 5,
    successThreshold: 2,
  } as CircuitBreakerConfig,

  // Configuration for non-critical services
  NON_CRITICAL: {
    failureThreshold: 15,
    recoveryTimeout: 120000, // 2 minutes
    monitoringPeriod: 300000, // 5 minutes
    minimumRequests: 20,
    successThreshold: 5,
  } as CircuitBreakerConfig,
};

/**
 * Circuit breaker registry for managing multiple circuit breakers
 */
class CircuitBreakerRegistry {
  private breakers = new Map<string, CircuitBreaker>();

  /**
   * Get or create a circuit breaker for a service
   */
  getBreaker(name: string, config: CircuitBreakerConfig): CircuitBreaker {
    if (!this.breakers.has(name)) {
      this.breakers.set(name, new CircuitBreaker(name, config));
    }
    return this.breakers.get(name)!;
  }

  /**
   * Get metrics for all circuit breakers
   */
  getAllMetrics(): Record<string, CircuitBreakerMetrics> {
    const metrics: Record<string, CircuitBreakerMetrics> = {};
    for (const [name, breaker] of this.breakers) {
      metrics[name] = breaker.getMetrics();
    }
    return metrics;
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset();
    }
  }
}

// Global circuit breaker registry
export const circuitBreakerRegistry = new CircuitBreakerRegistry();

/**
 * Helper function to create a protected version of any async function
 */
export function withCircuitBreaker<T extends unknown[], R>(
  name: string,
  config: CircuitBreakerConfig,
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  const breaker = circuitBreakerRegistry.getBreaker(name, config);

  return async (...args: T): Promise<R> => {
    return breaker.execute(() => fn(...args));
  };
}
