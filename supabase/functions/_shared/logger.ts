/**
 * Structured JSON Logger for Supabase Edge Functions
 * 
 * Provides structured logging with OpenTelemetry trace correlation
 * and Prometheus metrics integration for auto-booking pipeline
 */

import { addBreadcrumb } from './sentry.ts';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  userId?: string;
  tripRequestId?: string;
  bookingAttemptId?: string;
  function?: string;
  operation?: string;
  duration?: number;
  traceId?: string;
  spanId?: string;
  requestId?: string;
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  msg: string;
  timestamp: string;
  service: string;
  version: string;
  environment: string;
  context?: LogContext;
}

/**
 * Global context for request-scoped logging
 */
interface GlobalLogContext {
  requestId?: string;
  userId?: string;
  function?: string;
}

let globalContext: GlobalLogContext = {};

/**
 * Set global context for all subsequent log calls
 */
export function setLogContext(context: GlobalLogContext) {
  globalContext = { ...globalContext, ...context };
}

/**
 * Get current global context
 */
export function getLogContext(): GlobalLogContext {
  return { ...globalContext };
}

/**
 * Clear global context (useful for testing)
 */
export function clearLogContext() {
  globalContext = {};
}

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  // Use Deno's crypto API for UUID generation
  return `req_${Date.now()}_${crypto.randomUUID()}`;
}

/**
 * Initialize logging context for an Edge Function
 */
export function initializeLogContext(functionName: string, userId?: string, requestId?: string) {
  const context: GlobalLogContext = {
    function: functionName,
    requestId: requestId || generateRequestId(),
    userId
  };
  setLogContext(context);
  return context;
}

/**
 * Prometheus-style metrics counters
 */
const metrics = {
  auto_booking_success_total: 0,
  auto_booking_failure_total: 0,
  stripe_capture_success_total: 0,
  stripe_capture_failure_total: 0,
  duffel_order_success_total: 0,
  duffel_order_failure_total: 0,
  webhook_processed_total: 0,
  redis_lock_acquired_total: 0,
  redis_lock_failed_total: 0
};

/**
 * Get current metrics snapshot
 */
export function getMetrics() {
  return { ...metrics };
}

/**
 * Increment a Prometheus-style counter
 */
export function incrementCounter(metric: keyof typeof metrics) {
  if (metric in metrics) {
    metrics[metric]++;
  }
}

/**
 * Core structured logger function with trace correlation
 */
export function log(level: LogLevel, msg: string, context: LogContext = {}) {
  // Try to get trace context without causing circular dependency
  let traceContext: any = null;
  try {
    // Use globalThis to check if getCurrentTraceContext is available
    if (globalThis.getCurrentTraceContext) {
      traceContext = globalThis.getCurrentTraceContext();
    }
  } catch {
    // OTEL not available, continue without trace context
  }
  
  // Merge global context with trace context and provided context
  const enrichedContext = {
    ...globalContext,
    ...context,
    ...(traceContext && {
      traceId: traceContext.traceId,
      spanId: traceContext.spanId
    })
  };
  
  const entry: LogEntry = {
    level,
    msg,
    timestamp: new Date().toISOString(),
    service: 'parker-flight-auto-booking',
    version: Deno.env.get('VERSION') || '1.0.0',
    environment: Deno.env.get('ENVIRONMENT') || 'development',
    context: enrichedContext
  };

  // Output structured JSON
  console.log(JSON.stringify(entry));

  // Add to Sentry breadcrumbs for context
  if (level === 'error' || level === 'warn') {
    addBreadcrumb(msg, 'log', {
      level,
      ...enrichedContext
    });
  }
}

/**
 * Convenience logging methods
 */
export const logger = {
  debug: (msg: string, context?: LogContext) => log('debug', msg, context),
  info: (msg: string, context?: LogContext) => log('info', msg, context),
  warn: (msg: string, context?: LogContext) => log('warn', msg, context),
  error: (msg: string, context?: LogContext) => log('error', msg, context),

  /**
   * Log auto-booking success
   */
  bookingSuccess: (tripRequestId: string, bookingId: string, context: LogContext = {}) => {
    incrementCounter('auto_booking_success_total');
    log('info', 'Auto-booking completed successfully', {
      tripRequestId,
      bookingId,
      operation: 'auto_booking_complete',
      ...context
    });
  },

  /**
   * Log auto-booking failure
   */
  bookingFailure: (tripRequestId: string, error: string, context: LogContext = {}) => {
    incrementCounter('auto_booking_failure_total');
    log('error', 'Auto-booking failed', {
      tripRequestId,
      error,
      operation: 'auto_booking_failed',
      ...context
    });
  },

  /**
   * Log Stripe capture success
   */
  stripeCaptureSuccess: (paymentIntentId: string, amount: number, context: LogContext = {}) => {
    incrementCounter('stripe_capture_success_total');
    log('info', 'Stripe payment captured successfully', {
      paymentIntentId,
      amount,
      operation: 'stripe_capture_success',
      ...context
    });
  },

  /**
   * Log Stripe capture failure
   */
  stripeCaptureFailure: (paymentIntentId: string, error: string, context: LogContext = {}) => {
    incrementCounter('stripe_capture_failure_total');
    log('error', 'Stripe payment capture failed', {
      paymentIntentId,
      error,
      operation: 'stripe_capture_failed',
      ...context
    });
  },

  /**
   * Log Duffel order success
   */
  duffelOrderSuccess: (orderId: string, offerId: string, context: LogContext = {}) => {
    incrementCounter('duffel_order_success_total');
    log('info', 'Duffel order created successfully', {
      orderId,
      offerId,
      operation: 'duffel_order_success',
      ...context
    });
  },

  /**
   * Log Duffel order failure
   */
  duffelOrderFailure: (offerId: string, error: string, context: LogContext = {}) => {
    incrementCounter('duffel_order_failure_total');
    log('error', 'Duffel order creation failed', {
      offerId,
      error,
      operation: 'duffel_order_failed',
      ...context
    });
  },

  /**
   * Log webhook processing
   */
  webhookProcessed: (eventType: string, eventId: string, context: LogContext = {}) => {
    incrementCounter('webhook_processed_total');
    log('info', 'Webhook processed', {
      eventType,
      eventId,
      operation: 'webhook_processed',
      ...context
    });
  },

  /**
   * Log Redis lock operations
   */
  lockAcquired: (lockKey: string, lockId: string, ttl: number, context: LogContext = {}) => {
    incrementCounter('redis_lock_acquired_total');
    log('debug', 'Redis lock acquired', {
      lockKey,
      lockId,
      ttl,
      operation: 'lock_acquired',
      ...context
    });
  },

  lockFailed: (lockKey: string, reason: string, context: LogContext = {}) => {
    incrementCounter('redis_lock_failed_total');
    log('warn', 'Redis lock acquisition failed', {
      lockKey,
      reason,
      operation: 'lock_failed',
      ...context
    });
  }
};

/**
 * Performance timing decorator for functions
 */
export function withTiming<T extends (...args: any[]) => any>(
  fn: T,
  operation: string,
  context: LogContext = {}
): T {
  return ((...args: any[]) => {
    const start = performance.now();
    
    try {
      const result = fn(...args);
      
      // Handle async functions
      if (result instanceof Promise) {
        return result
          .then(value => {
            const duration = performance.now() - start;
            logger.debug(`${operation} completed`, {
              operation,
              duration: Math.round(duration),
              success: true,
              ...context
            });
            return value;
          })
          .catch(error => {
            const duration = performance.now() - start;
            logger.error(`${operation} failed`, {
              operation,
              duration: Math.round(duration),
              success: false,
              error: error.message,
              ...context
            });
            throw error;
          });
      }
      
      // Handle sync functions
      const duration = performance.now() - start;
      logger.debug(`${operation} completed`, {
        operation,
        duration: Math.round(duration),
        success: true,
        ...context
      });
      return result;
      
    } catch (error) {
      const duration = performance.now() - start;
      logger.error(`${operation} failed`, {
        operation,
        duration: Math.round(duration),
        success: false,
        error: error.message,
        ...context
      });
      throw error;
    }
  }) as T;
}
