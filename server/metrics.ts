/**
 * Production-Grade Business Metrics for Parker Flight
 * 
 * Comprehensive Prometheus metrics for monitoring:
 * - Business KPIs (registrations, transactions, feature flags)
 * - Application performance (API response times, error rates)
 * - Third-party service health (LaunchDarkly, Supabase, Stripe)
 * - User journey tracking (login, profile, wallet flows)
 */

import client from 'prom-client';

// Enable collection of default Node.js metrics (memory, CPU, etc.)
client.collectDefaultMetrics({
  register: client.register,
  prefix: 'parker_flight_nodejs_',
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
  eventLoopMonitoringPrecision: 5,
});

// Set default labels for all metrics
client.register.setDefaultLabels({
  app: 'parker-flight',
  environment: process.env.NODE_ENV || 'development',
  version: process.env.npm_package_version || '1.0.0'
});

// =================
// BUSINESS METRICS
// =================

// User registration and authentication
export const userRegistrations = new client.Counter({
  name: 'parker_flight_user_registrations_total',
  help: 'Total user registrations',
  labelNames: ['method', 'status'] // google, email, success/failure
});

export const userLogins = new client.Counter({
  name: 'parker_flight_user_logins_total',
  help: 'Total user login attempts',
  labelNames: ['method', 'status'] // google, email, success/failure
});

// Profile system metrics
export const profileCompleteness = new client.Histogram({
  name: 'parker_flight_profile_completeness_score',
  help: 'User profile completeness scores',
  buckets: [0, 0.25, 0.5, 0.75, 0.9, 1.0]
});

export const profileOperations = new client.Counter({
  name: 'parker_flight_profile_operations_total',
  help: 'Total profile operations',
  labelNames: ['operation', 'status'] // create, update, delete, success/failure
});

// Wallet system metrics
export const walletTransactions = new client.Counter({
  name: 'parker_flight_wallet_transactions_total',
  help: 'Total wallet transactions',
  labelNames: ['type', 'status'] // payment_method_add, charge, success/failure
});

export const walletOperations = new client.Counter({
  name: 'parker_flight_wallet_operations_total',
  help: 'Total wallet operations',
  labelNames: ['operation', 'status'] // add_card, remove_card, set_default, success/failure
});

// Feature flag metrics
export const featureFlagEvaluations = new client.Counter({
  name: 'parker_flight_feature_flag_evaluations_total',
  help: 'Total feature flag evaluations',
  labelNames: ['flag', 'value', 'user_in_rollout'] // flag_name, true/false, yes/no
});

export const featureFlagErrors = new client.Counter({
  name: 'parker_flight_feature_flag_errors_total',
  help: 'Total feature flag evaluation errors',
  labelNames: ['flag', 'error_type'] // flag_name, timeout/network/initialization
});

// ===================
// APPLICATION METRICS
// ===================

// API endpoint performance
export const httpRequests = new client.Counter({
  name: 'parker_flight_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'endpoint', 'status_code']
});

export const httpRequestDuration = new client.Histogram({
  name: 'parker_flight_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'endpoint', 'status_code'],
  buckets: [0.001, 0.01, 0.1, 0.2, 0.5, 1, 2, 5, 10] // P95 target: <0.2s
});

// Error tracking
export const applicationErrors = new client.Counter({
  name: 'parker_flight_application_errors_total',
  help: 'Total application errors',
  labelNames: ['error_type', 'component', 'severity'] // validation, network, auth / frontend, backend / critical, warning
});

// ========================
// THIRD-PARTY SERVICE METRICS
// ========================

// LaunchDarkly service health
export const launchDarklyOperations = new client.Counter({
  name: 'parker_flight_launchdarkly_operations_total',
  help: 'Total LaunchDarkly operations',
  labelNames: ['operation', 'status'] // init, flag_eval, context_update, success/failure/timeout
});

export const launchDarklyResponseTime = new client.Histogram({
  name: 'parker_flight_launchdarkly_response_time_seconds',
  help: 'LaunchDarkly response time in seconds',
  labelNames: ['operation'],
  buckets: [0.001, 0.01, 0.1, 0.5, 1, 2, 5]
});

// Supabase operations
export const supabaseOperations = new client.Counter({
  name: 'parker_flight_supabase_operations_total',
  help: 'Total Supabase operations',
  labelNames: ['operation', 'table', 'status'] // select, insert, update, delete / users, profiles, etc. / success/failure
});

export const supabaseResponseTime = new client.Histogram({
  name: 'parker_flight_supabase_response_time_seconds',
  help: 'Supabase response time in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5]
});

// Stripe operations
export const stripeOperations = new client.Counter({
  name: 'parker_flight_stripe_operations_total',
  help: 'Total Stripe operations',
  labelNames: ['operation', 'status'] // create_payment_method, charge, success/failure
});

export const stripeResponseTime = new client.Histogram({
  name: 'parker_flight_stripe_response_time_seconds',
  help: 'Stripe response time in seconds',
  labelNames: ['operation'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30]
});

// ====================
// USER JOURNEY METRICS
// ====================

// Track critical user flows
export const userJourneySteps = new client.Counter({
  name: 'parker_flight_user_journey_steps_total',
  help: 'User journey step completions',
  labelNames: ['journey', 'step', 'outcome'] // onboarding, booking / login, profile, search / completed, abandoned
});

// Page load performance
export const pageLoadTime = new client.Histogram({
  name: 'parker_flight_page_load_time_seconds',
  help: 'Frontend page load time in seconds',
  labelNames: ['page', 'user_type'], // home, search, profile / new, returning
  buckets: [0.5, 1, 2, 3, 5, 10, 30]
});

// ====================
// SYSTEM HEALTH METRICS
// ====================

// Circuit breaker states
export const circuitBreakerState = new client.Gauge({
  name: 'parker_flight_circuit_breaker_state',
  help: 'Circuit breaker state (0=closed, 1=open, 2=half-open)',
  labelNames: ['service'] // launchdarkly, supabase, stripe
});

// Cache hit rates
export const cacheOperations = new client.Counter({
  name: 'parker_flight_cache_operations_total',
  help: 'Total cache operations',
  labelNames: ['operation', 'cache_type', 'result'] // get, set / redis, memory / hit, miss
});

// ====================
// SLO TRACKING METRICS
// ====================

// Availability tracking (for 99.9% uptime SLO)
export const uptimeCheck = new client.Gauge({
  name: 'parker_flight_uptime_status',
  help: 'Service uptime status (1=up, 0=down)',
  labelNames: ['service'] // api, frontend, database
});

// Error budget tracking
export const errorBudget = new client.Gauge({
  name: 'parker_flight_error_budget_remaining',
  help: 'Remaining error budget percentage',
  labelNames: ['slo_type'] // availability, latency
});

// ====================
// UTILITY FUNCTIONS
// ====================

// Helper function to measure operation duration
export function measureOperation<T>(
  histogram: client.Histogram<string>,
  operation: () => Promise<T>,
  labels: Record<string, string>
): Promise<T> {
  const endTimer = histogram.startTimer(labels);
  return operation().finally(() => endTimer());
}

// Helper function to safely increment counters
export function safeIncrement(
  counter: client.Counter<string>,
  labels: Record<string, string> = {},
  value: number = 1
): void {
  try {
    counter.inc(labels, value);
  } catch (error) {
    console.error('Error incrementing metric counter:', error);
  }
}

// Export the registry for /metrics endpoint
export const register = client.register;
