import * as React from 'react';
/**
 * Enterprise Authentication Error Handler
 *
 * Provides structured error handling, logging, and monitoring for authentication flows.
 * Integrates with Sentry for error tracking and includes correlation IDs for tracing.
 *
 * Features:
 * - Error categorization and classification
 * - Correlation ID tracking for debugging
 * - Sentry integration with structured context
 * - Retry-ability assessment
 * - User-friendly error messages
 * - Security-aware logging (no sensitive data)
 */

import * as Sentry from '@sentry/react';
import { generateCorrelationId } from '@/utils/monitoring';
export interface AuthError {
  id: string;
  timestamp: string;
  category: AuthErrorCategory;
  code: string;
  message: string;
  userMessage: string;
  context: AuthErrorContext;
  retryable: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata: Record<string, unknown>;
}

export enum AuthErrorCategory {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  TOKEN = 'TOKEN',
  POPUP_BLOCKED = 'POPUP_BLOCKED',
  BROWSER_COMPATIBILITY = 'BROWSER_COMPATIBILITY',
  SESSION = 'SESSION',
  CSRF = 'CSRF',
  CONFIGURATION = 'CONFIGURATION',
  UNKNOWN = 'UNKNOWN',
}

export interface AuthErrorContext {
  component: string;
  flow: string;
  provider?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  sessionId?: string;
  userId?: string;
  attemptNumber?: number;
  previousErrors?: string[];
}

/**
 * Enterprise Authentication Error Handler
 */
export class AuthErrorHandler {
  private static errorCount = new Map<string, number>();
  private static lastErrors = new Map<string, AuthError[]>();

  /**
   * Handle and categorize authentication errors
   */
  static handleAuthError(
    error: unknown,
    context: Partial<AuthErrorContext>,
    options: {
      silent?: boolean;
      skipSentry?: boolean;
      additionalMetadata?: Record<string, unknown>;
    } = {}
  ): AuthError {
    const errorId = generateCorrelationId();
    const timestamp = new Date().toISOString();

    // Extract error information
    const errorInfo = this.extractErrorInfo(error);

    // Categorize the error
    const category = this.categorizeError(error, errorInfo);

    // Build full context
    const fullContext: AuthErrorContext = {
      component: 'unknown',
      flow: 'unknown',
      url: /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
        .location.href,
      userAgent: navigator.userAgent,
      timestamp,
      ...context,
    };

    // Create structured error
    const authError: AuthError = {
      id: errorId,
      timestamp,
      category,
      code: this.getErrorCode(category, errorInfo),
      message: errorInfo.message,
      userMessage: this.getUserFriendlyMessage(category, errorInfo),
      context: fullContext,
      retryable: this.isRetryable(category, errorInfo),
      severity: this.getSeverity(category, errorInfo),
      metadata: {
        originalError: errorInfo.name,
        stack: errorInfo.stack,
        ...options.additionalMetadata,
      },
    };

    // Track error frequency
    this.trackErrorFrequency(fullContext.component, category);

    // Store recent errors for pattern analysis
    this.storeRecentError(fullContext.component, authError);

    // Log to Sentry with structured context
    if (!options.skipSentry) {
      this.logToSentry(authError, error);
    }

    // Console logging for development
    if (import.meta.env.DEV && !options.silent) {
      console.error('🚨 Auth Error:', {
        id: errorId,
        category,
        message: authError.message,
        context: fullContext,
        retryable: authError.retryable,
      });
    }

    return authError;
  }

  /**
   * Extract error information from various error types
   */
  private static extractErrorInfo(error: unknown): {
    message: string;
    name: string;
    stack?: string;
  } {
    if (error instanceof Error) {
      return {
        message: error.message,
        name: error.name,
        stack: error.stack,
      };
    }

    if (typeof error === 'string') {
      return {
        message: error,
        name: 'StringError',
      };
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return {
        message: String((error as any).message),
        name: (error as any).name || 'ObjectError',
      };
    }

    return {
      message: 'Unknown error occurred',
      name: 'UnknownError',
    };
  }

  /**
   * Categorize errors based on their characteristics
   */
  private static categorizeError(
    error: unknown,
    errorInfo: any
  ): AuthErrorCategory {
    const message = errorInfo.message.toLowerCase();

    // Network-related errors
    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('connection') ||
      message.includes('timeout') ||
      message.includes('cors')
    ) {
      return AuthErrorCategory.NETWORK;
    }

    // Popup blocked
    if (
      message.includes('popup') ||
      message.includes('blocked') ||
      message.includes('pop-up')
    ) {
      return AuthErrorCategory.POPUP_BLOCKED;
    }

    // Token-related errors
    if (
      message.includes('token') ||
      message.includes('expired') ||
      message.includes('invalid_grant') ||
      message.includes('refresh')
    ) {
      return AuthErrorCategory.TOKEN;
    }

    // Authentication failures
    if (
      message.includes('authentication') ||
      message.includes('login') ||
      message.includes('signin') ||
      message.includes('unauthorized') ||
      message.includes('invalid_client')
    ) {
      return AuthErrorCategory.AUTHENTICATION;
    }

    // Authorization issues
    if (
      message.includes('authorization') ||
      message.includes('forbidden') ||
      message.includes('access_denied') ||
      message.includes('scope')
    ) {
      return AuthErrorCategory.AUTHORIZATION;
    }

    // CSRF/Security
    if (
      message.includes('csrf') ||
      message.includes('state') ||
      message.includes('security') ||
      message.includes('invalid state')
    ) {
      return AuthErrorCategory.CSRF;
    }

    // Session issues
    if (
      message.includes('session') ||
      message.includes('logout') ||
      message.includes('signout')
    ) {
      return AuthErrorCategory.SESSION;
    }

    // Configuration errors
    if (
      message.includes('config') ||
      message.includes('client_id') ||
      message.includes('redirect_uri') ||
      message.includes('environment')
    ) {
      return AuthErrorCategory.CONFIGURATION;
    }

    // Browser compatibility
    if (
      message.includes('browser') ||
      message.includes('support') ||
      message.includes('compatibility') ||
      message.includes('fedcm')
    ) {
      return AuthErrorCategory.BROWSER_COMPATIBILITY;
    }

    return AuthErrorCategory.UNKNOWN;
  }

  /**
   * Generate error codes for categorized errors
   */
  private static getErrorCode(
    category: AuthErrorCategory,
    errorInfo: any
  ): string {
    const prefix = category.substring(0, 3);
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}_${timestamp}`;
  }

  /**
   * Get user-friendly error messages
   */
  private static getUserFriendlyMessage(
    category: AuthErrorCategory,
    errorInfo: any
  ): string {
    switch (category) {
      case AuthErrorCategory.NETWORK:
        return 'Network connection issue. Please check your internet connection and try again.';

      case AuthErrorCategory.POPUP_BLOCKED:
        return 'Pop-up blocked. Please allow pop-ups for this site and try again.';

      case AuthErrorCategory.TOKEN:
        return 'Authentication session expired. Please sign in again.';

      case AuthErrorCategory.AUTHENTICATION:
        return 'Sign in failed. Please try again or contact support if the issue persists.';

      case AuthErrorCategory.AUTHORIZATION:
        return 'Access denied. Please check your permissions or contact support.';

      case AuthErrorCategory.CSRF:
        return 'Security validation failed. Please refresh the page and try again.';

      case AuthErrorCategory.SESSION:
        return 'Session error occurred. Please sign in again.';

      case AuthErrorCategory.CONFIGURATION:
        return 'Configuration error. Please contact support.';

      case AuthErrorCategory.BROWSER_COMPATIBILITY:
        return 'Browser compatibility issue. Please try using a different browser or update your current one.';

      default:
        return 'An unexpected error occurred. Please try again or contact support.';
    }
  }

  /**
   * Determine if an error is retryable
   */
  private static isRetryable(
    category: AuthErrorCategory,
    errorInfo: any
  ): boolean {
    switch (category) {
      case AuthErrorCategory.NETWORK:
      case AuthErrorCategory.TOKEN:
      case AuthErrorCategory.SESSION:
        return true;

      case AuthErrorCategory.POPUP_BLOCKED:
      case AuthErrorCategory.BROWSER_COMPATIBILITY:
      case AuthErrorCategory.CSRF:
        return false;

      case AuthErrorCategory.AUTHENTICATION:
      case AuthErrorCategory.AUTHORIZATION:
        // Retryable if it's a temporary issue, not retryable if it's a permanent access issue
        return !errorInfo.message.toLowerCase().includes('access_denied');

      case AuthErrorCategory.CONFIGURATION:
        return false;

      default:
        return true; // Default to retryable for unknown errors
    }
  }

  /**
   * Get error severity level
   */
  private static getSeverity(
    category: AuthErrorCategory,
    errorInfo: any
  ): AuthError['severity'] {
    switch (category) {
      case AuthErrorCategory.CONFIGURATION:
        return 'critical';

      case AuthErrorCategory.CSRF:
      case AuthErrorCategory.AUTHORIZATION:
        return 'high';

      case AuthErrorCategory.AUTHENTICATION:
      case AuthErrorCategory.TOKEN:
      case AuthErrorCategory.SESSION:
        return 'medium';

      case AuthErrorCategory.NETWORK:
      case AuthErrorCategory.POPUP_BLOCKED:
      case AuthErrorCategory.BROWSER_COMPATIBILITY:
        return 'low';

      default:
        return 'medium';
    }
  }

  /**
   * Log error to Sentry with structured context
   */
  private static logToSentry(
    authError: AuthError,
    originalError: unknown
  ): void {
    Sentry.withScope(scope => {
      // Set context
      scope.setTag('error_category', authError.category);
      scope.setTag('error_code', authError.code);
      scope.setTag('retryable', authError.retryable);
      scope.setTag('severity', authError.severity);
      scope.setContext('auth_error', {
        id: authError.id,
        component: authError.context.component,
        flow: authError.context.flow,
        provider: authError.context.provider,
        userMessage: authError.userMessage,
      });
      scope.setContext('browser_info', {
        userAgent: authError.context.userAgent,
        url: authError.context.url,
        timestamp: authError.timestamp,
      });

      // Set correlation ID for tracing
      scope.setTag('correlation_id', authError.id);

      // Capture the exception
      if (originalError instanceof Error) {
        Sentry.captureException(originalError);
      } else {
        Sentry.captureMessage(authError.message, 'error');
      }
    });
  }

  /**
   * Track error frequency for pattern detection
   */
  private static trackErrorFrequency(
    component: string,
    category: AuthErrorCategory
  ): void {
    const key = `${component}:${category}`;
    const count = this.errorCount.get(key) || 0;
    this.errorCount.set(key, count + 1);

    // Alert if error frequency is high
    if (count > 5) {
      console.warn(
        `🚨 High error frequency detected: ${key} (${count + 1} times)`
      );

      // Send alert to Sentry
      Sentry.captureMessage(
        `High authentication error frequency: ${key}`,
        'warning'
      );
    }
  }

  /**
   * Store recent errors for pattern analysis
   */
  private static storeRecentError(component: string, error: AuthError): void {
    const _errors = this.lastErrors.get(component) || [];
    errors.push(error);

    // Keep only last 10 errors per component
    if (errors.length > 10) {
      errors.shift();
    }

    this.lastErrors.set(component, errors);
  }

  /**
   * Get recent errors for a component
   */
  static getRecentErrors(component: string): AuthError[] {
    return this.lastErrors.get(component) || [];
  }

  /**
   * Clear error history (useful for testing or manual reset)
   */
  static clearErrorHistory(component?: string): void {
    if (component) {
      this.errorCount.delete(component);
      this.lastErrors.delete(component);
    } else {
      this.errorCount.clear();
      this.lastErrors.clear();
    }
  }

  /**
   * Get error statistics
   */
  static getErrorStats(): {
    totalErrors: number;
    errorsByComponent: Record<string, number>;
    errorsByCategory: Record<string, number>;
  } {
    const totalErrors = Array.from(this.errorCount.values()).reduce(
      (sum, count) => sum + count,
      0
    );

    const errorsByComponent: Record<string, number> = {};
    const errorsByCategory: Record<string, number> = {};

    for (const [key, count] of this.errorCount.entries()) {
      const [component, category] = key.split(':');
      errorsByComponent[component] =
        (errorsByComponent[component] || 0) + count;
      errorsByCategory[category] = (errorsByCategory[category] || 0) + count;
    }

    return {
      totalErrors,
      errorsByComponent,
      errorsByCategory,
    };
  }
}

/**
 * Hook for handling authentication errors in React components
 */
export const useAuthErrorHandler = (component: string) => {
  const handleError = (
    error: unknown,
    context: Partial<AuthErrorContext> = {},
    options: Parameters<typeof AuthErrorHandler.handleAuthError>[2] = {}
  ) => {
    return AuthErrorHandler.handleAuthError(
      error,
      { ...context, component },
      options
    );
  };

  const getRecentErrors = () => AuthErrorHandler.getRecentErrors(component);
  const clearHistory = () => AuthErrorHandler.clearErrorHistory(component);

  return {
    handleError,
    getRecentErrors,
    clearHistory,
  };
};

export default AuthErrorHandler;
