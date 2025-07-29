import * as React from 'react';
/**
 * Authentication Resilience Service
 *
 * Provides retry logic, circuit breaker patterns, and session recovery
 * for enterprise-grade authentication stability.
 *
 * Features:
 * - Exponential backoff retry with jitter
 * - Circuit breaker to prevent cascade failures
 * - Session validation and recovery
 * - Silent re-authentication
 * - Network resilience patterns
 */

import { supabase } from '@/integrations/supabase/client';
import { AuthErrorHandler } from './authErrorHandler';
export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  jitter?: boolean;
  exponentialBase?: number;
}

export interface CircuitBreakerState {
  isOpen: boolean;
  failureCount: number;
  lastFailureTime: number;
  nextAttemptTime: number;
}

/**
 * Authentication Resilience Manager
 */
export class AuthResilience {
  private static retryAttempts = new Map<string, number>();
  private static circuitBreakers = new Map<string, CircuitBreakerState>();
  private static readonly CIRCUIT_BREAKER_THRESHOLD = 5;
  private static readonly CIRCUIT_BREAKER_TIMEOUT = 30000; // 30 seconds
  private static readonly CIRCUIT_BREAKER_RESET_TIMEOUT = 60000; // 1 minute

  /**
   * Execute operation with retry logic and circuit breaker
   */
  static async withRetry<T>(
    operation: () => Promise<T>,
    context: string,
    options: RetryOptions = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      baseDelay = 1000,
      maxDelay = 10000,
      jitter = true,
      exponentialBase = 2,
    } = options;

    const operationKey = `${context}_${Date.now()}`;

    // Check circuit breaker
    if (this.isCircuitBreakerOpen(context)) {
      const circuitBreaker = this.circuitBreakers.get(context);
      const timeUntilReset = circuitBreaker
        ? circuitBreaker.nextAttemptTime - Date.now()
        : 0;

      throw new Error(
        `Circuit breaker open for ${context}. Retry in ${Math.ceil(timeUntilReset / 1000)} seconds.`
      );
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Track attempt
        this.retryAttempts.set(operationKey, attempt);

        // Execute operation
        const result = await operation();

        // Success - reset circuit breaker
        this.resetCircuitBreaker(context);
        this.retryAttempts.delete(operationKey);

        return result;
      } catch (error) {
        lastError = error as Error;

        // Record failure for circuit breaker
        this.recordFailure(context);

        // If this is the last attempt, throw the error
        if (attempt === maxRetries) {
          this.retryAttempts.delete(operationKey);
          throw lastError;
        }

        // Calculate delay with exponential backoff and jitter
        const exponentialDelay = Math.min(
          baseDelay * Math.pow(exponentialBase, attempt),
          maxDelay
        );

        const jitterAmount = jitter
          ? Math.random() * 0.3 * exponentialDelay
          : 0;
        const _delay = exponentialDelay + jitterAmount;

        // Log retry attempt
        console.warn(
          `🔄 Retry attempt ${attempt + 1}/${maxRetries} for ${context} in ${Math.round(delay)}ms`,
          { error: lastError.message }
        );

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // This should never be reached, but TypeScript requires it
    throw lastError || new Error('Max retries exceeded');
  }

  /**
   * Check if circuit breaker is open for a context
   */
  private static isCircuitBreakerOpen(context: string): boolean {
    const circuitBreaker = this.circuitBreakers.get(context);

    if (!circuitBreaker) {
      return false;
    }

    const now = Date.now();

    // If timeout has passed, move to half-open state
    if (circuitBreaker.isOpen && now >= circuitBreaker.nextAttemptTime) {
      circuitBreaker.isOpen = false;
      circuitBreaker.failureCount = 0;
      return false;
    }

    return circuitBreaker.isOpen;
  }

  /**
   * Record a failure for circuit breaker tracking
   */
  private static recordFailure(context: string): void {
    const now = Date.now();
    let circuitBreaker = this.circuitBreakers.get(context);

    if (!circuitBreaker) {
      circuitBreaker = {
        isOpen: false,
        failureCount: 0,
        lastFailureTime: now,
        nextAttemptTime: now,
      };
      this.circuitBreakers.set(context, circuitBreaker);
    }

    circuitBreaker.failureCount++;
    circuitBreaker.lastFailureTime = now;

    // Open circuit breaker if threshold exceeded
    if (circuitBreaker.failureCount >= this.CIRCUIT_BREAKER_THRESHOLD) {
      circuitBreaker.isOpen = true;
      circuitBreaker.nextAttemptTime = now + this.CIRCUIT_BREAKER_TIMEOUT;

      console.warn(
        `🚨 Circuit breaker OPENED for ${context} after ${circuitBreaker.failureCount} failures`
      );

      // Send alert to monitoring
      AuthErrorHandler.handleAuthError(
        new Error(`Circuit breaker opened for ${context}`),
        { component: 'AuthResilience', flow: 'circuit-breaker' }
      );
    }
  }

  /**
   * Reset circuit breaker after successful operation
   */
  private static resetCircuitBreaker(context: string): void {
    const circuitBreaker = this.circuitBreakers.get(context);

    if (
      circuitBreaker &&
      (circuitBreaker.isOpen || circuitBreaker.failureCount > 0)
    ) {
      console.log(`✅ Circuit breaker RESET for ${context}`);
      circuitBreaker.isOpen = false;
      circuitBreaker.failureCount = 0;
    }
  }

  /**
   * Get circuit breaker status for monitoring
   */
  static getCircuitBreakerStatus(): Record<string, CircuitBreakerState> {
    const status: Record<string, CircuitBreakerState> = {};

    for (const [context, state] of this.circuitBreakers.entries()) {
      status[context] = { ...state };
    }

    return status;
  }

  /**
   * Manually reset circuit breaker (for admin/debugging)
   */
  static resetCircuitBreakerManually(context: string): boolean {
    const circuitBreaker = this.circuitBreakers.get(context);

    if (circuitBreaker) {
      this.resetCircuitBreaker(context);
      return true;
    }

    return false;
  }

  /**
   * Clear all retry tracking (for cleanup)
   */
  static clearRetryHistory(): void {
    this.retryAttempts.clear();
    this.circuitBreakers.clear();
  }
}

/**
 * Session Management and Recovery
 */
export class SessionManager {
  private static recoveryAttempts = new Map<string, number>();
  private static readonly MAX_RECOVERY_ATTEMPTS = 3;

  /**
   * Validate current session and attempt recovery if needed
   */
  static async validateAndRecoverSession(): Promise<boolean> {
    try {
      const { data: session, error } = await supabase.auth.getSession();

      if (error) {
        console.warn('Session validation error:', error.message);
        return this.attemptSessionRecovery('session-error');
      }

      // Check if session is expired
      if (session?.expires_at && session.expires_at < Date.now() / 1000) {
        console.log('Session expired, attempting refresh...');
        return this.refreshSession();
      }

      return !!session;
    } catch (error) {
      AuthErrorHandler.handleAuthError(error, {
        component: 'SessionManager',
        flow: 'validateAndRecoverSession',
      });

      return this.attemptSessionRecovery('validation-error');
    }
  }

  /**
   * Attempt to refresh the current session
   */
  private static async refreshSession(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.warn('Session refresh failed:', error.message);
        return this.attemptSessionRecovery('refresh-failed');
      }

      console.log('✅ Session refreshed successfully');
      return !!data.session;
    } catch (error) {
      AuthErrorHandler.handleAuthError(error, {
        component: 'SessionManager',
        flow: 'refreshSession',
      });

      return false;
    }
  }

  /**
   * Attempt to recover from corrupted or invalid session state
   */
  private static async attemptSessionRecovery(
    reason: string
  ): Promise<boolean> {
    const recoveryKey = `${reason}_${Date.now()}`;
    const attemptCount = this.recoveryAttempts.get(reason) || 0;

    if (attemptCount >= this.MAX_RECOVERY_ATTEMPTS) {
      console.error(`❌ Max recovery attempts exceeded for ${reason}`);
      return false;
    }

    this.recoveryAttempts.set(reason, attemptCount + 1);

    try {
      console.log(
        `🔄 Attempting session recovery (${attemptCount + 1}/${this.MAX_RECOVERY_ATTEMPTS})...`
      );

      // Clear potentially corrupted auth state
      await this.clearCorruptedAuthState();

      // Try to get fresh session state
      const { data: session, error } = await supabase.auth.getSession();

      if (!error && session) {
        console.log('✅ Session recovery successful');
        this.recoveryAttempts.delete(reason);
        return true;
      }

      // If we still don't have a valid session, attempt silent re-authentication
      return this.attemptSilentReauth();
    } catch (error) {
      AuthErrorHandler.handleAuthError(error, {
        component: 'SessionManager',
        flow: 'attemptSessionRecovery',
        attemptNumber: attemptCount + 1,
      });

      return false;
    }
  }

  /**
   * Clear corrupted authentication state from storage
   */
  private static async clearCorruptedAuthState(): Promise<void> {
    console.log('🧹 Clearing potentially corrupted auth state...');

    // Clear localStorage auth keys
    const authKeys = Object.keys(localStorage).filter(
      key => key.startsWith('supabase.auth.') || key.includes('sb-')
    );

    authKeys.forEach(key => {
      console.log(`Removing corrupted key: ${key}`);
      localStorage.removeItem(key);
    });

    // Clear sessionStorage auth keys
    try {
      const sessionKeys = Object.keys(sessionStorage).filter(
        key => key.startsWith('supabase.auth.') || key.includes('sb-')
      );

      sessionKeys.forEach(key => {
        console.log(`Removing corrupted session key: ${key}`);
        sessionStorage.removeItem(key);
      });
    } catch (error) {
      // SessionStorage might not be available
      console.warn('Could not clear sessionStorage:', error);
    }

    // Give storage cleanup time to complete
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Attempt silent re-authentication
   */
  private static async attemptSilentReauth(): Promise<boolean> {
    try {
      console.log('🤫 Attempting silent re-authentication...');

      // Check if we have any stored auth tokens we can use
      const storedSession = localStorage.getItem('supabase.auth.token');

      if (storedSession) {
        try {
          const parsedSession = JSON.parse(storedSession);

          if (parsedSession.refresh_token) {
            const { data, error } = await supabase.auth.setSession({
              access_token: parsedSession.access_token,
              refresh_token: parsedSession.refresh_token,
            });

            if (!error && data.session) {
              console.log('✅ Silent re-authentication successful');
              return true;
            }
          }
        } catch (parseError) {
          console.warn('Could not parse stored session:', parseError);
        }
      }

      // If silent reauth fails, we need user interaction
      console.log(
        '❌ Silent re-authentication failed - user interaction required'
      );
      return false;
    } catch (error) {
      AuthErrorHandler.handleAuthError(error, {
        component: 'SessionManager',
        flow: 'attemptSilentReauth',
      });

      return false;
    }
  }

  /**
   * Get session recovery statistics
   */
  static getRecoveryStats(): Record<string, number> {
    const stats: Record<string, number> = {};

    for (const [reason, attempts] of this.recoveryAttempts.entries()) {
      stats[reason] = attempts;
    }

    return stats;
  }

  /**
   * Clear recovery attempt history
   */
  static clearRecoveryHistory(): void {
    this.recoveryAttempts.clear();
  }
}

/**
 * Higher-order function to wrap authentication operations with resilience
 */
export const withAuthResilience = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context: string,
  options?: RetryOptions
) => {
  return async (...args: T): Promise<R> => {
    return AuthResilience.withRetry(() => fn(...args), context, options);
  };
};

/**
 * React hook for authentication resilience
 */
export const useAuthResilience = () => {
  const withRetry = <T>(
    operation: () => Promise<T>,
    context: string,
    options?: RetryOptions
  ) => {
    return AuthResilience.withRetry(operation, context, options);
  };

  const validateSession = () => {
    return SessionManager.validateAndRecoverSession();
  };

  const getCircuitBreakerStatus = () => {
    return AuthResilience.getCircuitBreakerStatus();
  };

  const getRecoveryStats = () => {
    return SessionManager.getRecoveryStats();
  };

  return {
    withRetry,
    validateSession,
    getCircuitBreakerStatus,
    getRecoveryStats,
  };
};

export default AuthResilience;
