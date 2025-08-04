/**
 * Advanced Circuit Breaker Implementation for AWS Services
 * 
 * Service-specific circuit breakers with intelligent failure detection,
 * half-open state management, and metrics collection.
 */

import { CircuitState, CircuitBreakerMetrics, ErrorType, ServiceConfig } from './types';
import { getServiceConfig } from './service-configs';

interface RequestRecord {
  timestamp: number;
  success: boolean;
  responseTime: number;
  errorType?: ErrorType;
}

export class AdvancedCircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private metrics: CircuitBreakerMetrics;
  private config: ServiceConfig;
  private requestHistory: RequestRecord[] = [];
  private stateTransitionCallbacks: Map<CircuitState, (() => void)[]> = new Map();
  private healthCheckInterval?: NodeJS.Timeout;

  constructor(private serviceName: string) {
    this.config = getServiceConfig(serviceName);
    this.metrics = this.initializeMetrics();
    this.setupStateTransitionCallbacks();
  }

  private initializeMetrics(): CircuitBreakerMetrics {
    return {
      state: CircuitState.CLOSED,
      failures: 0,
      successes: 0,
      requests: 0,
      lastFailureTime: 0,
      lastSuccessTime: 0,
      stateChangedAt: Date.now(),
      halfOpenCalls: 0
    };
  }

  private setupStateTransitionCallbacks(): void {
    this.stateTransitionCallbacks.set(CircuitState.OPEN, [
      () => this.startHealthCheck(),
      () => this.logStateTransition('Circuit breaker OPENED')
    ]);
    
    this.stateTransitionCallbacks.set(CircuitState.HALF_OPEN, [
      () => this.stopHealthCheck(),
      () => this.logStateTransition('Circuit breaker transitioned to HALF_OPEN')
    ]);
    
    this.stateTransitionCallbacks.set(CircuitState.CLOSED, [
      () => this.stopHealthCheck(),
      () => this.resetMetrics(),
      () => this.logStateTransition('Circuit breaker CLOSED')
    ]);
  }

  /**
   * Execute operation with circuit breaker protection
   */
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (!this.canExecute()) {
      throw new Error(`Circuit breaker is ${this.state} for service ${this.serviceName}`);
    }

    const startTime = Date.now();
    this.metrics.requests++;

    try {
      const result = await operation();
      const responseTime = Date.now() - startTime;
      
      this.onSuccess(startTime, responseTime);
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.onFailure(error, startTime, responseTime);
      throw error;
    }
  }

  private canExecute(): boolean {
    const now = Date.now();

    switch (this.state) {
      case CircuitState.CLOSED:
        return true;

      case CircuitState.OPEN:
        if (now - this.metrics.stateChangedAt >= this.config.resetTimeoutMs) {
          this.transitionToHalfOpen();
          return true;
        }
        return false;

      case CircuitState.HALF_OPEN:
        return this.metrics.halfOpenCalls < this.config.halfOpenMaxCalls;

      default:
        return false;
    }
  }

  private onSuccess(timestamp: number, responseTime: number): void {
    this.metrics.successes++;
    this.metrics.lastSuccessTime = timestamp;
    
    this.addRequestRecord({
      timestamp,
      success: true,
      responseTime
    });

    if (this.state === CircuitState.HALF_OPEN) {
      this.metrics.halfOpenCalls++;

      // If we've had enough successful calls in half-open, close the circuit
      if (this.metrics.halfOpenCalls >= this.config.halfOpenMaxCalls) {
        this.transitionToClosed();
      }
    } else if (this.state === CircuitState.CLOSED) {
      // Reset consecutive failure count on success
      this.resetConsecutiveFailures();
    }
  }

  private onFailure(error: any, timestamp: number, responseTime: number): void {
    const errorType = this.config.errorClassifier(error);
    
    // Don't count non-retryable errors towards circuit breaker failures
    if (errorType === ErrorType.NON_RETRYABLE) {
      this.addRequestRecord({
        timestamp,
        success: false,
        responseTime,
        errorType
      });
      return;
    }

    this.metrics.failures++;
    this.metrics.lastFailureTime = timestamp;
    
    this.addRequestRecord({
      timestamp,
      success: false,
      responseTime,
      errorType
    });

    if (this.state === CircuitState.HALF_OPEN) {
      // Any retryable failure in half-open state should open the circuit
      this.transitionToOpen();
    } else if (this.state === CircuitState.CLOSED) {
      // Check if we should open the circuit
      if (this.shouldOpenCircuit()) {
        this.transitionToOpen();
      }
    }
  }

  private shouldOpenCircuit(): boolean {
    const now = Date.now();
    const timeWindow = this.config.timeoutMs;
    
    // Get recent retryable failures within the time window
    const recentFailures = this.requestHistory.filter(record => 
      !record.success &&
      (now - record.timestamp) <= timeWindow &&
      record.errorType !== ErrorType.NON_RETRYABLE
    );

    // Check if we've exceeded the failure threshold
    return recentFailures.length >= this.config.failureThreshold;
  }

  private addRequestRecord(record: RequestRecord): void {
    this.requestHistory.push(record);
    
    // Keep only recent records (last 2x timeout window)
    const cutoff = Date.now() - (this.config.timeoutMs * 2);
    this.requestHistory = this.requestHistory.filter(
      record => record.timestamp >= cutoff
    );
  }

  private transitionToOpen(): void {
    this.setState(CircuitState.OPEN);
  }

  private transitionToHalfOpen(): void {
    this.setState(CircuitState.HALF_OPEN);
    this.metrics.halfOpenCalls = 0;
  }

  private transitionToClosed(): void {
    this.setState(CircuitState.CLOSED);
  }

  private setState(newState: CircuitState): void {
    if (this.state === newState) return;

    const oldState = this.state;
    this.state = newState;
    this.metrics.state = newState;
    this.metrics.stateChangedAt = Date.now();

    // Execute state transition callbacks
    const callbacks = this.stateTransitionCallbacks.get(newState) || [];
    callbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error(`Error in circuit breaker state transition callback:`, error);
      }
    });

    // Emit state change event
    this.emitStateChange(oldState, newState);
  }

  private resetMetrics(): void {
    this.metrics.failures = 0;
    this.metrics.halfOpenCalls = 0;
    this.requestHistory = [];
  }

  private resetConsecutiveFailures(): void {
    // Remove recent consecutive failures from history
    const now = Date.now();
    let consecutiveFailures = 0;
    
    // Count recent consecutive failures
    for (let i = this.requestHistory.length - 1; i >= 0; i--) {
      const record = this.requestHistory[i];
      if (record.success) break;
      if (record.errorType !== ErrorType.NON_RETRYABLE) {
        consecutiveFailures++;
      }
    }

    // If we have too many consecutive failures, reduce them
    if (consecutiveFailures > this.config.failureThreshold / 2) {
      this.metrics.failures = Math.max(0, this.metrics.failures - 1);
    }
  }

  private startHealthCheck(): void {
    if (this.healthCheckInterval) return;

    const checkInterval = Math.min(
      this.config.resetTimeoutMs / 4,
      30000 // Max 30 seconds
    );

    this.healthCheckInterval = setInterval(async () => {
      try {
        const isHealthy = await this.config.healthCheck();
        if (isHealthy && this.state === CircuitState.OPEN) {
          // Service seems healthy, try transitioning to half-open
          const timeSinceOpen = Date.now() - this.metrics.stateChangedAt;
          if (timeSinceOpen >= this.config.resetTimeoutMs) {
            this.transitionToHalfOpen();
          }
        }
      } catch (error) {
        // Health check failed, remain in current state
        console.debug(`Health check failed for ${this.serviceName}:`, error);
      }
    }, checkInterval);
  }

  private stopHealthCheck(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
  }

  private logStateTransition(message: string): void {
    console.info(`[CircuitBreaker:${this.serviceName}] ${message}`, {
      state: this.state,
      failures: this.metrics.failures,
      successes: this.metrics.successes,
      requests: this.metrics.requests,
      successRate: this.getSuccessRate()
    });
  }

  private emitStateChange(oldState: CircuitState, newState: CircuitState): void {
    // This could be extended to emit events to monitoring systems
    const event = {
      service: this.serviceName,
      oldState,
      newState,
      timestamp: Date.now(),
      metrics: this.getMetrics()
    };

    // In a real implementation, you might emit to monitoring systems here
    console.debug('Circuit breaker state change:', event);
  }

  /**
   * Get current circuit breaker metrics
   */
  getMetrics(): CircuitBreakerMetrics {
    return { ...this.metrics };
  }

  /**
   * Get detailed operational metrics
   */
  getDetailedMetrics(): {
    basic: CircuitBreakerMetrics;
    advanced: {
      successRate: number;
      avgResponseTime: number;
      p95ResponseTime: number;
      recentErrorTypes: Record<string, number>;
      timeInCurrentState: number;
    };
  } {
    const now = Date.now();
    const recentRecords = this.requestHistory.filter(
      record => (now - record.timestamp) <= this.config.timeoutMs
    );

    const responseTimes = recentRecords.map(r => r.responseTime).sort((a, b) => a - b);
    const p95Index = Math.floor(responseTimes.length * 0.95);
    
    const errorTypeCounts: Record<string, number> = {};
    recentRecords
      .filter(r => !r.success && r.errorType)
      .forEach(r => {
        const errorType = r.errorType!;
        errorTypeCounts[errorType] = (errorTypeCounts[errorType] || 0) + 1;
      });

    return {
      basic: this.getMetrics(),
      advanced: {
        successRate: this.getSuccessRate(),
        avgResponseTime: responseTimes.length > 0 
          ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
          : 0,
        p95ResponseTime: responseTimes.length > 0 ? responseTimes[p95Index] || 0 : 0,
        recentErrorTypes: errorTypeCounts,
        timeInCurrentState: now - this.metrics.stateChangedAt
      }
    };
  }

  private getSuccessRate(): number {
    if (this.metrics.requests === 0) return 1;
    return this.metrics.successes / this.metrics.requests;
  }

  /**
   * Get current circuit state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Check if circuit breaker allows requests
   */
  isRequestAllowed(): boolean {
    return this.canExecute();
  }

  /**
   * Manually reset the circuit breaker
   */
  reset(): void {
    this.stopHealthCheck();
    this.state = CircuitState.CLOSED;
    this.metrics = this.initializeMetrics();
    this.requestHistory = [];
    
    console.info(`[CircuitBreaker:${this.serviceName}] Manually reset`);
  }

  /**
   * Register callback for state transitions
   */
  onStateChange(state: CircuitState, callback: () => void): void {
    if (!this.stateTransitionCallbacks.has(state)) {
      this.stateTransitionCallbacks.set(state, []);
    }
    this.stateTransitionCallbacks.get(state)!.push(callback);
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stopHealthCheck();
    this.stateTransitionCallbacks.clear();
    this.requestHistory = [];
  }
}

/**
 * Circuit Breaker Registry for managing multiple circuit breakers
 */
export class CircuitBreakerRegistry {
  private breakers = new Map<string, AdvancedCircuitBreaker>();
  private globalMetrics = {
    totalBreakers: 0,
    openBreakers: 0,
    halfOpenBreakers: 0,
    closedBreakers: 0
  };

  /**
   * Get or create a circuit breaker for a service
   */
  getBreaker(serviceName: string): AdvancedCircuitBreaker {
    const key = serviceName.toUpperCase();
    
    if (!this.breakers.has(key)) {
      const breaker = new AdvancedCircuitBreaker(serviceName);
      this.breakers.set(key, breaker);
      this.updateGlobalMetrics();
      
      // Register for state change notifications
      [CircuitState.OPEN, CircuitState.HALF_OPEN, CircuitState.CLOSED].forEach(state => {
        breaker.onStateChange(state, () => this.updateGlobalMetrics());
      });
    }
    
    return this.breakers.get(key)!;
  }

  /**
   * Get metrics for all circuit breakers
   */
  getAllMetrics(): Record<string, CircuitBreakerMetrics> {
    const metrics: Record<string, CircuitBreakerMetrics> = {};
    
    for (const [serviceName, breaker] of this.breakers) {
      metrics[serviceName] = breaker.getMetrics();
    }
    
    return metrics;
  }

  /**
   * Get global registry metrics
   */
  getGlobalMetrics() {
    return { ...this.globalMetrics };
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset();
    }
    this.updateGlobalMetrics();
  }

  /**
   * Reset specific circuit breaker
   */
  reset(serviceName: string): void {
    const key = serviceName.toUpperCase();
    const breaker = this.breakers.get(key);
    if (breaker) {
      breaker.reset();
      this.updateGlobalMetrics();
    }
  }

  /**
   * Remove a circuit breaker
   */
  remove(serviceName: string): void {
    const key = serviceName.toUpperCase();
    const breaker = this.breakers.get(key);
    if (breaker) {
      breaker.destroy();
      this.breakers.delete(key);
      this.updateGlobalMetrics();
    }
  }

  /**
   * Clean up all resources
   */
  destroy(): void {
    for (const breaker of this.breakers.values()) {
      breaker.destroy();
    }
    this.breakers.clear();
    this.updateGlobalMetrics();
  }

  private updateGlobalMetrics(): void {
    this.globalMetrics.totalBreakers = this.breakers.size;
    this.globalMetrics.openBreakers = 0;
    this.globalMetrics.halfOpenBreakers = 0;
    this.globalMetrics.closedBreakers = 0;

    for (const breaker of this.breakers.values()) {
      const state = breaker.getState();
      switch (state) {
        case CircuitState.OPEN:
          this.globalMetrics.openBreakers++;
          break;
        case CircuitState.HALF_OPEN:
          this.globalMetrics.halfOpenBreakers++;
          break;
        case CircuitState.CLOSED:
          this.globalMetrics.closedBreakers++;
          break;
      }
    }
  }

  /**
   * Get services with open circuit breakers
   */
  getFailedServices(): string[] {
    const failedServices: string[] = [];
    
    for (const [serviceName, breaker] of this.breakers) {
      if (breaker.getState() === CircuitState.OPEN) {
        failedServices.push(serviceName);
      }
    }
    
    return failedServices;
  }

  /**
   * Check overall system health
   */
  getSystemHealth(): {
    healthy: boolean;
    score: number; // 0-1, where 1 is fully healthy
    details: {
      totalServices: number;
      healthyServices: number;
      degradedServices: number;
      failedServices: number;
    };
  } {
    const total = this.breakers.size;
    const failed = this.globalMetrics.openBreakers;
    const degraded = this.globalMetrics.halfOpenBreakers;
    const healthy = this.globalMetrics.closedBreakers;
    
    const score = total > 0 ? (healthy + degraded * 0.5) / total : 1;
    
    return {
      healthy: failed === 0,
      score,
      details: {
        totalServices: total,
        healthyServices: healthy,
        degradedServices: degraded,
        failedServices: failed
      }
    };
  }
}

// Global circuit breaker registry instance
export const circuitBreakerRegistry = new CircuitBreakerRegistry();

/**
 * Convenience function to execute with circuit breaker protection
 */
export async function withCircuitBreaker<T>(
  serviceName: string,
  operation: () => Promise<T>
): Promise<T> {
  const breaker = circuitBreakerRegistry.getBreaker(serviceName);
  return breaker.execute(operation);
}
