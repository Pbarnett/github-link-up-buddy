import * as React from 'react';
/**
 * LaunchDarkly Error Handling System
 * Comprehensive error management for feature flags
 */

export enum FlagErrorType {
  INITIALIZATION_FAILED = 'initialization_failed',
  EVALUATION_ERROR = 'evaluation_error',
  NETWORK_ERROR = 'network_error',
  TIMEOUT_ERROR = 'timeout_error',
  INVALID_FLAG_KEY = 'invalid_flag_key',
  CLIENT_NOT_READY = 'client_not_ready',
  CONTEXT_INVALID = 'context_invalid',
  UNKNOWN_ERROR = 'unknown_error',
}

export interface FlagError extends Error {
  type: FlagErrorType;
  flagKey?: string;
  context?: any;
  timestamp: number;
}

export interface ErrorHandlerConfig {
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableTelemetry: boolean;
  fallbackBehavior: 'default' | 'cached' | 'fail';
  maxRetries: number;
  retryDelay: number;
}

/**
 * Centralized error handling for LaunchDarkly operations
 */
export class FlagErrorHandler {
  private static config: ErrorHandlerConfig = {
    logLevel: 'warn',
    enableTelemetry: true,
    fallbackBehavior: 'default',
    maxRetries: 3,
    retryDelay: 1000,
  };

  private static errorCache = new Map<
    string,
    { error: FlagError; count: number; lastSeen: number }
  >();

  /**
   * Configure error handling behavior
   */
  static configure(config: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Handle flag evaluation errors with fallback values
   */
  static handleEvaluationError<T>(
    error: Error,
    flagKey: string,
    defaultValue: T,
    context?: any
  ): T {
    const flagError = this.createFlagError(error, flagKey, context);

    this.logError(flagError);
    this.trackError(flagError);

    // Check if we have a cached value
    if (this.config.fallbackBehavior === 'cached') {
      const cachedValue = this.getCachedValue(flagKey);
      if (cachedValue !== undefined) {
        return cachedValue as T;
      }
    }

    return defaultValue;
  }

  /**
   * Handle initialization errors
   */
  static handleInitializationError(error: Error, context?: any): void {
    const flagError: FlagError = {
      ...error,
      type: FlagErrorType.INITIALIZATION_FAILED,
      context,
      timestamp: Date.now(),
    };

    this.logError(flagError);
    this.trackError(flagError);

    // Emit initialization failed event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('launchdarkly:initialization:failed', {
          detail: flagError,
        })
      );
    }
  }

  /**
   * Handle network-related errors
   */
  static handleNetworkError(
    error: Error,
    operation: string,
    flagKey?: string
  ): void {
    const flagError: FlagError = {
      ...error,
      type: FlagErrorType.NETWORK_ERROR,
      flagKey,
      context: { operation },
      timestamp: Date.now(),
    };

    this.logError(flagError);
    this.trackError(flagError);
  }

  /**
   * Handle timeout errors
   */
  static handleTimeoutError(
    timeout: number,
    operation: string,
    flagKey?: string
  ): void {
    const error = new Error(
      `Operation '${operation}' timed out after ${timeout}ms`
    );
    const flagError: FlagError = {
      ...error,
      type: FlagErrorType.TIMEOUT_ERROR,
      flagKey,
      context: { operation, timeout },
      timestamp: Date.now(),
    };

    this.logError(flagError);
    this.trackError(flagError);
  }

  /**
   * Create a standardized flag error object
   */
  private static createFlagError(
    originalError: Error,
    flagKey?: string,
    context?: any
  ): FlagError {
    let errorType = FlagErrorType.UNKNOWN_ERROR;

    // Classify error type based on error message/properties
    const errorMessage = originalError.message.toLowerCase();

    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      errorType = FlagErrorType.NETWORK_ERROR;
    } else if (errorMessage.includes('timeout')) {
      errorType = FlagErrorType.TIMEOUT_ERROR;
    } else if (
      errorMessage.includes('flag') &&
      errorMessage.includes('not found')
    ) {
      errorType = FlagErrorType.INVALID_FLAG_KEY;
    } else if (
      errorMessage.includes('not ready') ||
      errorMessage.includes('not initialized')
    ) {
      errorType = FlagErrorType.CLIENT_NOT_READY;
    } else if (
      errorMessage.includes('context') ||
      errorMessage.includes('user')
    ) {
      errorType = FlagErrorType.CONTEXT_INVALID;
    }

    return {
      ...originalError,
      type: errorType,
      flagKey,
      context,
      timestamp: Date.now(),
    };
  }

  /**
   * Log error based on configuration
   */
  private static logError(error: FlagError): void {
    const logMessage = `[LaunchDarkly] ${error.type}: ${error.message}`;
    const logData = {
      type: error.type,
      flagKey: error.flagKey,
      context: error.context,
      timestamp: error.timestamp,
    };

    switch (this.config.logLevel) {
      case 'debug':
        console.debug(logMessage, logData);
        break;
      case 'info':
        console.info(logMessage, logData);
        break;
      case 'warn':
        console.warn(logMessage, logData);
        break;
      case 'error':
        console.error(logMessage, logData);
        break;
    }
  }

  /**
   * Track error for telemetry
   */
  private static trackError(error: FlagError): void {
    if (!this.config.enableTelemetry) return;

    const errorKey = `${error.type}:${error.flagKey || 'global'}`;
    const existing = this.errorCache.get(errorKey);

    if (existing) {
      existing.count++;
      existing.lastSeen = Date.now();
    } else {
      this.errorCache.set(errorKey, {
        error,
        count: 1,
        lastSeen: Date.now(),
      });
    }

    // Send telemetry data if available
    this.sendTelemetry(error);
  }

  /**
   * Send error telemetry data
   */
  private static sendTelemetry(error: FlagError): void {
    // Integration with your analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'launchdarkly_error', {
        error_type: error.type,
        flag_key: error.flagKey,
        error_message: error.message,
        custom_map: {
          timestamp: error.timestamp,
          context: JSON.stringify(error.context),
        },
      });
    }

    // Custom event for monitoring systems
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('launchdarkly:error', {
          detail: error,
        })
      );
    }
  }

  /**
   * Get cached flag value (simplified implementation)
   */
  private static getCachedValue(flagKey: string): any {
    if (typeof localStorage !== 'undefined') {
      try {
        const cached = localStorage.getItem(`ld:${flagKey}`);
        return cached ? JSON.parse(cached) : undefined;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  /**
   * Cache flag value for fallback purposes
   */
  static cacheValue(flagKey: string, value: any): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(`ld:${flagKey}`, JSON.stringify(value));
      } catch (err) {
        console.warn('Failed to cache flag value:', err);
      }
    }
  }

  /**
   * Get error statistics
   */
  static getErrorStats(): Record<string, { count: number; lastSeen: number }> {
    const stats: Record<string, { count: number; lastSeen: number }> = {};

    for (const [key, data] of this.errorCache.entries()) {
      stats[key] = {
        count: data.count,
        lastSeen: data.lastSeen,
      };
    }

    return stats;
  }

  /**
   * Clear error cache (useful for testing or cleanup)
   */
  static clearErrorCache(): void {
    this.errorCache.clear();
  }

  /**
   * Check if error rate is concerning
   */
  static isErrorRateHigh(): boolean {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    let recentErrors = 0;
    for (const [, data] of this.errorCache.entries()) {
      if (data.lastSeen > oneHourAgo) {
        recentErrors += data.count;
      }
    }

    return recentErrors > 10; // Threshold for "high" error rate
  }

  /**
   * Retry mechanism for failed operations
   */
  static async withRetry<T>(
    operation: () => Promise<T>,
    flagKey?: string,
    maxRetries?: number
  ): Promise<T> {
    const retries = maxRetries || this.config.maxRetries;
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await operation()();
      } catch (error) {
        lastError = error as Error;

        if (attempt === retries) {
          break; // Final attempt failed
        }

        // Log retry attempt
        console.warn(
          `LaunchDarkly operation failed (attempt ${attempt + 1}/${retries + 1}):`,
          error
        );

        // Wait before retrying
        if (this.config.retryDelay > 0) {
          await new Promise(resolve =>
            setTimeout(resolve, this.config.retryDelay)
          );
        }
      }
    }

    // All retries failed
    this.handleEvaluationError(lastError!, flagKey || 'unknown', undefined);
    throw lastError!;
  }
}
