/**
 * Simple Prometheus Metrics for Auto-Booking Pipeline
 * 
 * Provides basic counter metrics for tracking booking success/failure rates
 * Exported in Prometheus format for monitoring systems
 */

interface MetricCounter {
  name: string;
  help: string;
  value: number;
  labels: Record<string, string>;
}

// In-memory storage for metrics (in production, use a proper metrics backend)
const metrics = new Map<string, MetricCounter>();

/**
 * Counter for total failed auto-booking attempts (refunds issued)
 */
export const autoBookingFailureTotal = {
  inc: (labels: Record<string, string> = {}) => {
    incrementCounter('auto_booking_failure_total', labels);
  }
};

/**
 * Initialize default counters
 */
function initializeMetrics() {
  if (metrics.size === 0) {
    metrics.set('auto_booking_success_total', {
      name: 'auto_booking_success_total',
      help: 'Total number of successful auto-bookings',
      value: 0,
      labels: {}
    });
    
    metrics.set('auto_booking_failure_total', {
      name: 'auto_booking_failure_total', 
      help: 'Total number of failed auto-bookings',
      value: 0,
      labels: {}
    });
    
    metrics.set('stripe_capture_success_total', {
      name: 'stripe_capture_success_total',
      help: 'Total number of successful Stripe captures',
      value: 0,
      labels: {}
    });
    
    metrics.set('stripe_capture_failure_total', {
      name: 'stripe_capture_failure_total',
      help: 'Total number of failed Stripe captures', 
      value: 0,
      labels: {}
    });
    
    metrics.set('duffel_order_success_total', {
      name: 'duffel_order_success_total',
      help: 'Total number of successful Duffel orders',
      value: 0,
      labels: {}
    });
    
    metrics.set('duffel_order_failure_total', {
      name: 'duffel_order_failure_total',
      help: 'Total number of failed Duffel orders',
      value: 0,
      labels: {}
    });
  }
}

/**
 * Increment a counter metric
 */
export function incrementCounter(metricName: string, labels: Record<string, string> = {}) {
  initializeMetrics();
  
  const labelKey = Object.keys(labels).sort().map(k => `${k}="${labels[k]}"`).join(',');
  const fullKey = labelKey ? `${metricName}{${labelKey}}` : metricName;
  
  const existing = metrics.get(fullKey);
  if (existing) {
    existing.value++;
  } else {
    const base = metrics.get(metricName);
    if (base) {
      metrics.set(fullKey, {
        name: metricName,
        help: base.help,
        value: 1,
        labels
      });
    }
  }
}

/**
 * Record auto-booking success
 */
export function recordAutoBookingSuccess(userId: string, currency: string = 'USD') {
  incrementCounter('auto_booking_success_total', { 
    user_id: userId, 
    currency 
  });
}

/**
 * Record auto-booking failure
 */
export function recordAutoBookingFailure(userId: string, reason: string, currency: string = 'USD') {
  incrementCounter('auto_booking_failure_total', { 
    user_id: userId, 
    reason, 
    currency 
  });
}

/**
 * Record Stripe capture success
 */
export function recordStripeCaptureSuccess(paymentIntentId: string, currency: string) {
  incrementCounter('stripe_capture_success_total', { 
    payment_intent_id: paymentIntentId, 
    currency 
  });
}

/**
 * Record Stripe capture failure
 */
export function recordStripeCaptureFailure(paymentIntentId: string, reason: string, currency: string) {
  incrementCounter('stripe_capture_failure_total', { 
    payment_intent_id: paymentIntentId, 
    reason, 
    currency 
  });
}

/**
 * Record Duffel order success
 */
export function recordDuffelOrderSuccess(orderId: string, offerId: string) {
  incrementCounter('duffel_order_success_total', { 
    order_id: orderId, 
    offer_id: offerId 
  });
}

/**
 * Record Duffel order failure
 */
export function recordDuffelOrderFailure(offerId: string, reason: string) {
  incrementCounter('duffel_order_failure_total', { 
    offer_id: offerId, 
    reason 
  });
}

/**
 * Get all metrics in Prometheus format
 */
export function getPrometheusMetrics(): string {
  initializeMetrics();
  
  const lines: string[] = [];
  const processedMetrics = new Set<string>();
  
  for (const [key, metric] of metrics.entries()) {
    // Add help and type comments only once per metric name
    if (!processedMetrics.has(metric.name)) {
      lines.push(`# HELP ${metric.name} ${metric.help}`);
      lines.push(`# TYPE ${metric.name} counter`);
      processedMetrics.add(metric.name);
    }
    
    // Add the metric value
    if (Object.keys(metric.labels).length > 0) {
      const labelString = Object.entries(metric.labels)
        .map(([k, v]) => `${k}="${v}"`)
        .join(',');
      lines.push(`${metric.name}{${labelString}} ${metric.value}`);
    } else {
      lines.push(`${metric.name} ${metric.value}`);
    }
  }
  
  return lines.join('\n') + '\n';
}

/**
 * Reset all metrics (useful for testing)
 */
export function resetMetrics() {
  metrics.clear();
  initializeMetrics();
}

/**
 * Get metrics as JSON (for debugging)
 */
export function getMetricsAsJson(): Record<string, MetricCounter> {
  initializeMetrics();
  return Object.fromEntries(metrics.entries());
}
