const client = require('prom-client');

// Service dependency metrics for tracking outbound requests
const serviceDependencyMetrics = {
  // Counter for outbound requests
  outboundRequests: new client.Counter({
    name: 'parker_flight_service_dependency_requests_total',
    help: 'Total number of outbound requests to external services',
    labelNames: [
      'origin_service',
      'target_service', 
      'method',
      'status_code',
      'protocol',
      'origin_external',
      'target_external'
    ]
  }),

  // Histogram for outbound request duration
  outboundRequestDuration: new client.Histogram({
    name: 'parker_flight_service_dependency_duration_seconds',
    help: 'Duration of outbound requests to external services',
    labelNames: [
      'origin_service',
      'target_service',
      'method', 
      'status_code',
      'protocol',
      'origin_external',
      'target_external'
    ],
    buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10]
  }),

  // Gauge for service dependency health
  serviceDependencyHealth: new client.Gauge({
    name: 'parker_flight_service_dependency_health',
    help: 'Health status of external service dependencies (1 = healthy, 0 = unhealthy)',
    labelNames: [
      'origin_service',
      'target_service',
      'protocol'
    ]
  })
};

// Helper function to track outbound requests
function trackOutboundRequest(options) {
  const {
    targetService,
    method = 'GET',
    statusCode,
    duration,
    protocol = 'http',
    error = false
  } = options;

  const labels = {
    origin_service: 'parker-flight',
    target_service: targetService,
    method: method.toUpperCase(),
    status_code: statusCode?.toString() || (error ? '000' : '200'),
    protocol,
    origin_external: 'false', // Parker Flight is internal
    target_external: 'true'   // External services are external
  };

  // Increment request counter
  serviceDependencyMetrics.outboundRequests.inc(labels);

  // Record duration if provided
  if (duration !== undefined) {
    serviceDependencyMetrics.outboundRequestDuration.observe(labels, duration);
  }

  // Update health status based on success/failure
  const healthLabels = {
    origin_service: labels.origin_service,
    target_service: labels.target_service,
    protocol: labels.protocol
  };
  
  const isHealthy = !error && (statusCode >= 200 && statusCode < 400);
  serviceDependencyMetrics.serviceDependencyHealth.set(healthLabels, isHealthy ? 1 : 0);
}

// Service-specific tracking functions
const serviceTrackers = {
  // Supabase database operations
  supabase: (operation, duration, success, statusCode) => {
    trackOutboundRequest({
      targetService: 'supabase',
      method: operation, // 'SELECT', 'INSERT', 'UPDATE', 'DELETE'
      statusCode,
      duration,
      protocol: 'https',
      error: !success
    });
  },

  // LaunchDarkly feature flag evaluations
  launchdarkly: (flagKey, duration, success, statusCode) => {
    trackOutboundRequest({
      targetService: 'launchdarkly',
      method: 'GET', // Feature flag evaluations are typically GET requests
      statusCode,
      duration,
      protocol: 'https',
      error: !success
    });
  },

  // Stripe payment processing
  stripe: (operation, duration, success, statusCode) => {
    trackOutboundRequest({
      targetService: 'stripe',
      method: operation, // 'POST', 'GET', etc.
      statusCode,
      duration,
      protocol: 'https', 
      error: !success
    });
  },

  // Generic external service tracker
  external: (serviceName, method, duration, success, statusCode) => {
    trackOutboundRequest({
      targetService: serviceName.toLowerCase(),
      method,
      statusCode,
      duration,
      protocol: 'https',
      error: !success
    });
  }
};

// Initialize service dependency metrics for Service Dependency Graph
function initializeServiceDependencyGraph() {
  // Set initial health status for known services
  const knownServices = ['supabase', 'launchdarkly', 'stripe'];
  
  knownServices.forEach(service => {
    serviceDependencyMetrics.serviceDependencyHealth.set({
      origin_service: 'parker-flight',
      target_service: service,
      protocol: 'https'
    }, 1); // Start with healthy status
  });

  console.log('🔗 Service Dependency Metrics initialized for Service Dependency Graph');
  console.log('📊 Tracking outbound requests to: Supabase, LaunchDarkly, Stripe');
}

module.exports = {
  serviceDependencyMetrics,
  trackOutboundRequest,
  serviceTrackers,
  initializeServiceDependencyGraph
};
