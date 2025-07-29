/**
 * Metrics Edge Function
 * 
 * Exports Prometheus-style metrics counters for monitoring
 * auto-booking pipeline success/failure rates and system health
 */

import { corsHeaders } from '../_shared/cors.ts';
import { getMetrics } from '../_shared/logger.ts';
import { logger, initializeLogContext } from '../_shared/logger.ts';
import { evaluateFlag, createUserContext } from '../_shared/launchdarkly.ts';
import { checkAutoBookingFlags } from '../_shared/launchdarkly-guard.ts';
import { withSpan, initializeTraceContext, setGlobalPropagator } from '../_shared/otel.ts';

// Initialize W3C Trace Context Propagator
setGlobalPropagator();

console.log('[Metrics] Function initialized');

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Critical: Check LaunchDarkly flags before any processing
  const flagCheck = await checkAutoBookingFlags(req, 'metrics');
  if (!flagCheck.canProceed) {
    return flagCheck.response!;
  }

  // Initialize tracing and logging context
  const traceContext = initializeTraceContext(req);
  const logContext = initializeLogContext('metrics');

  return withSpan(
    'metrics.export',
    async (span) => {
      span.setAttribute('http.method', req.method);
      span.setAttribute('http.url', req.url);
      
      try {
        // Auto-booking flags already checked at function entry

        // Get current metrics snapshot
        const metrics = getMetrics();
        
        // Format as Prometheus exposition format
        const prometheusMetrics = formatPrometheusMetrics(metrics);
        
        span.setAttribute('metrics.total_counters', Object.keys(metrics).length);
        span.setAttribute('metrics.format', 'prometheus');
        
        logger.info('Metrics exported', {
          operation: 'metrics_export',
          totalCounters: Object.keys(metrics).length,
          format: 'prometheus'
        });

        return new Response(prometheusMetrics, {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/plain; version=0.0.4; charset=utf-8'
          }
        });

      } catch (error) {
        span.recordException(error as Error);
        
        logger.error('Failed to export metrics', {
          operation: 'metrics_export_failed',
          error: (error as Error).message
        });

        return new Response(JSON.stringify({
          error: 'Internal server error',
          message: (error as Error).message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    },
    {
      'service.name': 'parker-flight-auto-booking',
      'http.route': '/metrics'
    }
  );
});

/**
 * Format metrics in Prometheus exposition format
 */
function formatPrometheusMetrics(metrics: Record<string, number>): string {
  const lines: string[] = [];
  
  // Add metadata headers
  lines.push('# HELP auto_booking_success_total Total number of successful auto-bookings');
  lines.push('# TYPE auto_booking_success_total counter');
  lines.push(`auto_booking_success_total ${metrics.auto_booking_success_total || 0}`);
  lines.push('');
  
  lines.push('# HELP auto_booking_failure_total Total number of failed auto-bookings');
  lines.push('# TYPE auto_booking_failure_total counter');
  lines.push(`auto_booking_failure_total ${metrics.auto_booking_failure_total || 0}`);
  lines.push('');
  
  lines.push('# HELP stripe_capture_success_total Total number of successful Stripe captures');
  lines.push('# TYPE stripe_capture_success_total counter');
  lines.push(`stripe_capture_success_total ${metrics.stripe_capture_success_total || 0}`);
  lines.push('');
  
  lines.push('# HELP stripe_capture_failure_total Total number of failed Stripe captures');
  lines.push('# TYPE stripe_capture_failure_total counter');
  lines.push(`stripe_capture_failure_total ${metrics.stripe_capture_failure_total || 0}`);
  lines.push('');
  
  lines.push('# HELP duffel_order_success_total Total number of successful Duffel orders');
  lines.push('# TYPE duffel_order_success_total counter');
  lines.push(`duffel_order_success_total ${metrics.duffel_order_success_total || 0}`);
  lines.push('');
  
  lines.push('# HELP duffel_order_failure_total Total number of failed Duffel orders');
  lines.push('# TYPE duffel_order_failure_total counter');
  lines.push(`duffel_order_failure_total ${metrics.duffel_order_failure_total || 0}`);
  lines.push('');
  
  lines.push('# HELP webhook_processed_total Total number of processed webhooks');
  lines.push('# TYPE webhook_processed_total counter');
  lines.push(`webhook_processed_total ${metrics.webhook_processed_total || 0}`);
  lines.push('');
  
  lines.push('# HELP redis_lock_acquired_total Total number of acquired Redis locks');
  lines.push('# TYPE redis_lock_acquired_total counter');
  lines.push(`redis_lock_acquired_total ${metrics.redis_lock_acquired_total || 0}`);
  lines.push('');
  
  lines.push('# HELP redis_lock_failed_total Total number of failed Redis lock acquisitions');
  lines.push('# TYPE redis_lock_failed_total counter');
  lines.push(`redis_lock_failed_total ${metrics.redis_lock_failed_total || 0}`);
  lines.push('');
  
  // Add system metrics
  const now = Date.now();
  lines.push('# HELP metrics_scrape_timestamp_seconds Unix timestamp of this metrics scrape');
  lines.push('# TYPE metrics_scrape_timestamp_seconds gauge');
  lines.push(`metrics_scrape_timestamp_seconds ${Math.floor(now / 1000)}`);
  lines.push('');
  
  lines.push('# HELP metrics_up Whether the metrics endpoint is up');
  lines.push('# TYPE metrics_up gauge');
  lines.push('metrics_up 1');
  lines.push('');
  
  return lines.join('\n');
}
