/**
 * Sentry Error Tracking for Supabase Edge Functions
 * 
 * Centralized Sentry initialization and error handling for all Edge Functions
 * Used across auto-booking pipeline for observability and error tracking
 */

import * as Sentry from "https://deno.land/x/sentry@7.77.0/index.js";

let sentryInitialized = false;

/**
 * Initialize Sentry with configuration from environment variables
 */
export function initSentry() {
  if (sentryInitialized) {
    return;
  }

  const dsn = Deno.env.get('SENTRY_DSN') || Deno.env.get('VITE_SENTRY_DSN');
  
  if (!dsn) {
    console.warn('[Sentry] No DSN found, error tracking disabled');
    return;
  }

  try {
    Sentry.init({
      dsn,
      environment: Deno.env.get('ENVIRONMENT') || 'development',
      tracesSampleRate: 0.1, // 10% of transactions for performance monitoring
      beforeSend(event) {
        // Filter out sensitive information
        if (event.exception) {
          event.exception.values?.forEach(exception => {
            if (exception.stacktrace?.frames) {
              exception.stacktrace.frames.forEach(frame => {
                // Remove sensitive environment variables from stack traces
                if (frame.vars) {
                  delete frame.vars.STRIPE_SECRET_KEY;
                  delete frame.vars.DUFFEL_API_TOKEN;
                  delete frame.vars.UPSTASH_REDIS_REST_TOKEN;
                }
              });
            }
          });
        }
        return event;
      }
    });

    sentryInitialized = true;
    console.info('[Sentry] Initialized successfully');
  } catch (error) {
    console.error('[Sentry] Failed to initialize:', error);
  }
}

/**
 * Capture an exception with Sentry
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (!sentryInitialized) {
    console.error('[Sentry] Not initialized, logging error locally:', error);
    return;
  }

  try {
    if (context) {
      Sentry.withScope(scope => {
        Object.keys(context).forEach(key => {
          scope.setTag(key, context[key]);
        });
        Sentry.captureException(error);
      });
    } else {
      Sentry.captureException(error);
    }
  } catch (sentryError) {
    console.error('[Sentry] Failed to capture exception:', sentryError);
    console.error('[Sentry] Original error:', error);
  }
}

/**
 * Capture a message with Sentry
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) {
  if (!sentryInitialized) {
    console.log(`[Sentry] Not initialized, logging message locally [${level}]:`, message);
    return;
  }

  try {
    if (context) {
      Sentry.withScope(scope => {
        Object.keys(context).forEach(key => {
          scope.setTag(key, context[key]);
        });
        Sentry.captureMessage(message, level);
      });
    } else {
      Sentry.captureMessage(message, level);
    }
  } catch (sentryError) {
    console.error('[Sentry] Failed to capture message:', sentryError);
  }
}

/**
 * Set user context for Sentry tracking
 */
export function setUserContext(userId: string, email?: string) {
  if (!sentryInitialized) {
    return;
  }

  try {
    Sentry.setUser({
      id: userId,
      email: email
    });
  } catch (error) {
    console.error('[Sentry] Failed to set user context:', error);
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(breadcrumb: {
  message: string;
  category?: string;
  data?: Record<string, any>;
  level?: 'debug' | 'info' | 'warning' | 'error' | 'fatal';
}) {
  if (!sentryInitialized) {
    return;
  }

  try {
    Sentry.addBreadcrumb({
      message: breadcrumb.message,
      category: breadcrumb.category || 'default',
      data: breadcrumb.data,
      level: breadcrumb.level || 'info',
      timestamp: Date.now() / 1000
    });
  } catch (error) {
    console.error('[Sentry] Failed to add breadcrumb:', error);
  }
}

/**
 * Initialize Sentry in all Edge Functions
 * Call this at the top of every Edge Function
 */
export function initSentryForFunction(functionName: string) {
  initSentry();
  
  if (sentryInitialized) {
    Sentry.setTag('function', functionName);
    addBreadcrumb({
      message: `${functionName} function started`,
      category: 'function',
      level: 'info'
    });
  }
}
