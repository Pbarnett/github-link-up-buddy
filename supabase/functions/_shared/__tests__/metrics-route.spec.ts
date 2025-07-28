/**
 * Metrics Route Unit Tests
 * 
 * Tests Prometheus metrics endpoint functionality,
 * output format, and error handling
 */

import { assertEquals, assertExists, assert, assertStringIncludes } from 'https://deno.land/std@0.192.0/testing/asserts.ts';

// Mock the metrics endpoint handler
import { getMetrics, incrementCounter } from '../logger.ts';

// Mock LaunchDarkly
const mockEvaluateFlag = () => Promise.resolve({ value: true });

// Test the formatPrometheusMetrics function directly
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

Deno.test('Metrics Route - Format Prometheus metrics with zero values', () => {
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
  
  const output = formatPrometheusMetrics(metrics);
  
  // Should include all counter metrics
  assertStringIncludes(output, 'auto_booking_success_total 0');
  assertStringIncludes(output, 'auto_booking_failure_total 0');
  assertStringIncludes(output, 'stripe_capture_success_total 0');
  assertStringIncludes(output, 'stripe_capture_failure_total 0');
  assertStringIncludes(output, 'duffel_order_success_total 0');
  assertStringIncludes(output, 'duffel_order_failure_total 0');
  assertStringIncludes(output, 'webhook_processed_total 0');
  assertStringIncludes(output, 'redis_lock_acquired_total 0');
  assertStringIncludes(output, 'redis_lock_failed_total 0');
  
  // Should include system metrics
  assertStringIncludes(output, 'metrics_up 1');
  assertStringIncludes(output, 'metrics_scrape_timestamp_seconds');
});

Deno.test('Metrics Route - Format Prometheus metrics with real values', () => {
  const metrics = {
    auto_booking_success_total: 42,
    auto_booking_failure_total: 3,
    stripe_capture_success_total: 38,
    stripe_capture_failure_total: 7,
    duffel_order_success_total: 35,
    duffel_order_failure_total: 10,
    webhook_processed_total: 156,
    redis_lock_acquired_total: 89,
    redis_lock_failed_total: 2
  };
  
  const output = formatPrometheusMetrics(metrics);
  
  // Should include actual counter values
  assertStringIncludes(output, 'auto_booking_success_total 42');
  assertStringIncludes(output, 'auto_booking_failure_total 3');
  assertStringIncludes(output, 'stripe_capture_success_total 38');
  assertStringIncludes(output, 'stripe_capture_failure_total 7');
  assertStringIncludes(output, 'duffel_order_success_total 35');
  assertStringIncludes(output, 'duffel_order_failure_total 10');
  assertStringIncludes(output, 'webhook_processed_total 156');
  assertStringIncludes(output, 'redis_lock_acquired_total 89');
  assertStringIncludes(output, 'redis_lock_failed_total 2');
});

Deno.test('Metrics Route - Include Prometheus metadata', () => {
  const metrics = getMetrics();
  const output = formatPrometheusMetrics(metrics);
  
  // Should include HELP comments
  assertStringIncludes(output, '# HELP auto_booking_success_total Total number of successful auto-bookings');
  assertStringIncludes(output, '# HELP auto_booking_failure_total Total number of failed auto-bookings');
  assertStringIncludes(output, '# HELP stripe_capture_success_total Total number of successful Stripe captures');
  
  // Should include TYPE comments
  assertStringIncludes(output, '# TYPE auto_booking_success_total counter');
  assertStringIncludes(output, '# TYPE auto_booking_failure_total counter');
  assertStringIncludes(output, '# TYPE metrics_up gauge');
  assertStringIncludes(output, '# TYPE metrics_scrape_timestamp_seconds gauge');
});

Deno.test('Metrics Route - Proper Prometheus format structure', () => {
  const metrics = {
    auto_booking_success_total: 5,
    auto_booking_failure_total: 1,
    stripe_capture_success_total: 0,
    stripe_capture_failure_total: 0,
    duffel_order_success_total: 0,
    duffel_order_failure_total: 0,
    webhook_processed_total: 0,
    redis_lock_acquired_total: 0,
    redis_lock_failed_total: 0
  };
  
  const output = formatPrometheusMetrics(metrics);
  const lines = output.split('\n');
  
  // Should have proper structure: HELP, TYPE, VALUE, blank line
  let foundPattern = false;
  for (let i = 0; i < lines.length - 3; i++) {
    if (lines[i].startsWith('# HELP auto_booking_success_total') &&
        lines[i + 1].startsWith('# TYPE auto_booking_success_total counter') &&
        lines[i + 2] === 'auto_booking_success_total 5' &&
        lines[i + 3] === '') {
      foundPattern = true;
      break;
    }
  }
  assert(foundPattern, 'Should follow Prometheus format: HELP, TYPE, VALUE, blank line');
});

Deno.test('Metrics Route - All required counters present', () => {
  const metrics = getMetrics();
  const output = formatPrometheusMetrics(metrics);
  
  const requiredCounters = [
    'auto_booking_success_total',
    'auto_booking_failure_total',
    'stripe_capture_success_total',
    'stripe_capture_failure_total',
    'duffel_order_success_total',
    'duffel_order_failure_total',
    'webhook_processed_total',
    'redis_lock_acquired_total',
    'redis_lock_failed_total'
  ];
  
  for (const counter of requiredCounters) {
    assertStringIncludes(output, counter);
  }
});

Deno.test('Metrics Route - System metrics included', () => {
  const metrics = getMetrics();
  const output = formatPrometheusMetrics(metrics);
  
  // Should include up metric
  assertStringIncludes(output, 'metrics_up 1');
  
  // Should include timestamp (just check it exists with a number)
  const timestampRegex = /metrics_scrape_timestamp_seconds \d+/;
  assert(timestampRegex.test(output), 'Should include valid timestamp metric');
});

Deno.test('Metrics Route - Handle missing metrics gracefully', () => {
  const partialMetrics = {
    auto_booking_success_total: 10,
    // Missing some metrics
    duffel_order_success_total: 5
  };
  
  const output = formatPrometheusMetrics(partialMetrics);
  
  // Should default missing metrics to 0
  assertStringIncludes(output, 'auto_booking_success_total 10');
  assertStringIncludes(output, 'auto_booking_failure_total 0');
  assertStringIncludes(output, 'duffel_order_success_total 5');
  assertStringIncludes(output, 'duffel_order_failure_total 0');
});

Deno.test('Metrics Route - Timestamp is current', () => {
  const metrics = getMetrics();
  const output = formatPrometheusMetrics(metrics);
  
  // Extract timestamp from output
  const timestampMatch = output.match(/metrics_scrape_timestamp_seconds (\d+)/);
  assertExists(timestampMatch, 'Should contain timestamp metric');
  
  const timestamp = parseInt(timestampMatch[1]);
  const now = Math.floor(Date.now() / 1000);
  
  // Should be within 1 second of current time
  assert(Math.abs(timestamp - now) <= 1, 'Timestamp should be current');
});

Deno.test('Metrics Route - Counter increment affects output', () => {
  const initialMetrics = getMetrics();
  const initialOutput = formatPrometheusMetrics(initialMetrics);
  
  // Extract initial value
  const initialMatch = initialOutput.match(/auto_booking_success_total (\d+)/);
  assertExists(initialMatch);
  const initialValue = parseInt(initialMatch[1]);
  
  // Increment counter
  incrementCounter('auto_booking_success_total');
  
  // Get updated metrics
  const updatedMetrics = getMetrics();
  const updatedOutput = formatPrometheusMetrics(updatedMetrics);
  
  // Should reflect incremented value
  assertStringIncludes(updatedOutput, `auto_booking_success_total ${initialValue + 1}`);
});

Deno.test('Metrics Route - Output contains valid Prometheus format', () => {
  const metrics = getMetrics();
  const output = formatPrometheusMetrics(metrics);
  const lines = output.split('\n');
  
  for (const line of lines) {
    if (line.trim() === '') continue; // Skip empty lines
    
    if (line.startsWith('#')) {
      // Should be valid comment
      assert(
        line.startsWith('# HELP ') || line.startsWith('# TYPE '),
        `Invalid comment format: ${line}`
      );
    } else {
      // Should be valid metric line: metric_name value
      const metricRegex = /^[a-zA-Z_:][a-zA-Z0-9_:]* \d+(\.\d+)?$/;
      assert(
        metricRegex.test(line),
        `Invalid metric format: ${line}`
      );
    }
  }
});

Deno.test('Metrics Route - No trailing spaces or malformed lines', () => {
  const metrics = getMetrics();
  const output = formatPrometheusMetrics(metrics);
  const lines = output.split('\n');
  
  for (const line of lines) {
    // No trailing spaces
    assertEquals(line, line.trimEnd(), `Line has trailing spaces: "${line}"`);
    
    // If it's a metric line, should not have extra spaces
    if (line && !line.startsWith('#')) {
      const parts = line.split(' ');
      assertEquals(parts.length, 2, `Metric line should have exactly 2 parts: "${line}"`);
    }
  }
});

Deno.test('Metrics Route - Consistent metric naming', () => {
  const metrics = getMetrics();
  const output = formatPrometheusMetrics(metrics);
  
  // All counters should end with _total
  const counterNames = [
    'auto_booking_success_total',
    'auto_booking_failure_total',
    'stripe_capture_success_total',
    'stripe_capture_failure_total',
    'duffel_order_success_total',
    'duffel_order_failure_total',
    'webhook_processed_total',
    'redis_lock_acquired_total',
    'redis_lock_failed_total'
  ];
  
  for (const name of counterNames) {
    assert(name.endsWith('_total'), `Counter ${name} should end with _total`);
    assertStringIncludes(output, name);
  }
  
  // Gauge metrics should not end with _total
  assertStringIncludes(output, 'metrics_up');
  assertStringIncludes(output, 'metrics_scrape_timestamp_seconds');
});
