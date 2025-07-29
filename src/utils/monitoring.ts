import * as React from 'react';
/**
 * Parker Flight - Monitoring & Observability
 * Core Web Vitals, Error Tracking, and Analytics Setup
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';
interface AnalyticsEvent {
  name: string;
  properties: Record<string, unknown>;
  correlationId?: string;
}

/**
 * Generates a unique correlation ID for tracing requests and events
 * @returns A unique string identifier in format 'pf_timestamp_randomstring'
 * @example
 * const correlationId = generateCorrelationId();
 * // Returns: "pf_1640995200000_abc123xyz"
 */
export const generateCorrelationId = (): string => {
  return `pf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Initializes comprehensive monitoring for the Parker Flight application
 * Sets up Core Web Vitals tracking, error handlers, and performance observers
 * @returns void
 * @example
 * initMonitoring(); // Call once during app initialization
 */
export const initMonitoring = () => {
  // Report Core Web Vitals
  onCLS(reportWebVital);
  onINP(reportWebVital); // INP replaces FID in v3+
  onFCP(reportWebVital);
  onLCP(reportWebVital);
  onTTFB(reportWebVital);

  // Global error handlers
  /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.addEventListener(
    'error',
    event => {
      reportError(event.error, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    }
  );

  /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.addEventListener(
    'unhandledrejection',
    event => {
      reportError(event.reason, {
        type: 'unhandledrejection',
        promise: event.promise,
      });
    }
  );

  console.log('🔍 Parker Flight monitoring initialized');
};

// Report Web Vitals
const reportWebVital = (metric: {
  name: string;
  value: number;
  id: string;
  delta: number;
  entries: PerformanceEntry[];
}) => {
  const data = {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    delta: metric.delta,
    entries: metric.entries,
  };

  // Send to analytics
  trackEvent('web_vital', data);

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`📊 ${metric.name}:`, metric.value);
  }
};

// Error reporting
export const reportError = (
  error: Error,
  context?: Record<string, unknown>
) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    correlationId: generateCorrelationId(),
    timestamp: new Date().toISOString(),
    url: /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
      .location.href,
    userAgent: navigator.userAgent,
    ...context,
  };

  // Send to Sentry (when configured)
  if (
    /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.Sentry
  ) {
    /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.Sentry.captureException(
      error,
      { extra: errorData }
    );
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('🚨 Error captured:', errorData);
  }

  // Send to custom analytics endpoint
  trackEvent('error', errorData);
};

// Analytics event tracking with modern async patterns
export const trackEvent = async (
  eventName: string,
  properties: Record<string, unknown> = {}
): Promise<void> => {
  try {
    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        page:
          typeof (
            /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
          ) !== 'undefined'
            ? /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
                .location.pathname
            : '',
        correlationId: properties.correlationId || generateCorrelationId(),
      },
    };

    // Send to analytics service (PostHog, Segment, etc.) with error handling
    if (
      typeof (
        /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
      ) !== 'undefined' &&
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.analytics
    ) {
      try {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Analytics tracking timeout'));
          }, 5000);

          try {
            /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.analytics!.track(
              event.name,
              event.properties
            );
            clearTimeout(timeout);
            resolve();
          } catch (error) {
            clearTimeout(timeout);
            reject(error);
          }
        });
      } catch (error) {
        console.warn('Analytics service error:', error);
      }
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`📈 Event: ${event.name}`, event.properties);
    }

    // Store in local queue for offline scenarios with async handling
    await queueEventForOffline(event);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Helper function for offline event queueing
const queueEventForOffline = async (event: AnalyticsEvent): Promise<void> => {
  try {
    if (typeof localStorage === 'undefined') return;

    const queueData = localStorage.getItem('pf_analytics_queue');
    const queue = queueData ? JSON.parse(queueData) : [];

    queue.push(event);

    // Keep last 50 events and store back
    const trimmedQueue = queue.slice(-50);
    localStorage.setItem('pf_analytics_queue', JSON.stringify(trimmedQueue));
  } catch (error) {
    console.warn('Failed to queue analytics event:', error);
  }
};

// Performance observer for custom metrics
export const observePerformance = () => {
  if (
    !(
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.PerformanceObserver
    )
  )
    return;

  // Observe layout shifts
  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'layout-shift') {
        const layoutShiftEntry = entry as PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
          sources?: { length: number };
        };
        if (!layoutShiftEntry.hadRecentInput) {
          trackEvent('layout_shift', {
            value: layoutShiftEntry.value,
            sources: layoutShiftEntry.sources?.length || 0,
          });
        }
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['layout-shift'] });
  } catch (error) {
    console.warn('Failed to observe performance:', error);
  }
};

// Campaign-specific analytics
export const trackCampaignEvent = (
  eventName: string,
  campaignId: string,
  properties: Record<string, unknown> = {}
) => {
  trackEvent(eventName, {
    ...properties,
    campaign_id: campaignId,
    feature: 'auto_booking',
  });
};

// Initialize monitoring when module loads
if (
  typeof (
    /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
  ) !== 'undefined'
) {
  // Defer initialization to avoid blocking
  setTimeout(initMonitoring, 100);
  setTimeout(observePerformance, 200);
}

// Type declarations for global analytics
declare global {
  interface Window {
    analytics?: {
      track: (event: string, properties: Record<string, unknown>) => void;
    };
    Sentry?: {
      captureException: (
        error: Error,
        options?: { extra?: Record<string, unknown> }
      ) => void;
    };
  }
}
