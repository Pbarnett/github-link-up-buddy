/**
 * Service Dependency Metrics for Parker Flight
 * Tracks outbound requests to external services for dependency graph visualization
 */

import { register, Counter, Histogram, Gauge } from 'prom-client';

// Metrics for service dependency tracking
export const serviceDependencyMetrics = {
  // Outbound request counter by service - compatible with Novatec Service Dependency Graph Panel
  outboundRequests: new Counter({
    name: 'parker_flight_service_dependency_requests_total',
    help: 'Total outbound requests to external services',
    labelNames: ['origin_service', 'target_service', 'method', 'status_code', 'protocol', 'origin_external', 'target_external']
  }),

  // Request duration histogram
  outboundRequestDuration: new Histogram({
    name: 'parker_flight_outbound_request_duration_seconds',
    help: 'Duration of outbound requests to external services',
    labelNames: ['origin_service', 'target_service', 'method', 'protocol'],
    buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
  }),

  // Active connections gauge
  activeConnections: new Gauge({
    name: 'parker_flight_active_connections',
    help: 'Active connections to external services',
    labelNames: ['origin_service', 'target_service', 'protocol']
  }),

  // Error rate counter
  outboundErrors: new Counter({
    name: 'parker_flight_outbound_errors_total',
    help: 'Total outbound request errors by service',
    labelNames: ['origin_service', 'target_service', 'error_type', 'protocol']
  })
};

// Service mapping for dependency graph
export const serviceMap = {
  'parker-flight-api': {
    name: 'Parker Flight API',
    type: 'internal',
    external: false
  },
  'supabase': {
    name: 'Supabase Database',
    type: 'database',
    external: true,
    url_pattern: /supabase\.co/
  },
  'launchdarkly': {
    name: 'LaunchDarkly',
    type: 'feature-flags',
    external: true,
    url_pattern: /app\.launchdarkly\.com/
  },
  'stripe': {
    name: 'Stripe Payments',
    type: 'payment',
    external: true,
    url_pattern: /api\.stripe\.com/
  },
  'duffel': {
    name: 'Duffel Flights',
    type: 'flights',
    external: true,
    url_pattern: /api\.duffel\.com/
  },
  'amadeus': {
    name: 'Amadeus Travel',
    type: 'flights',
    external: true,
    url_pattern: /api\.amadeus\.com/
  },
  'resend': {
    name: 'Resend Email',
    type: 'email',
    external: true,
    url_pattern: /api\.resend\.com/
  }
};

/**
 * Identifies the target service from a URL
 */
export function identifyTargetService(url: string): string {
  for (const [serviceKey, config] of Object.entries(serviceMap)) {
    if (config.url_pattern && config.url_pattern.test(url)) {
      return serviceKey;
    }
  }
  
  // Fallback to hostname
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/\./g, '_');
  } catch {
    return 'unknown';
  }
}

/**
 * Records an outbound request for dependency tracking
 */
export function recordOutboundRequest(
  targetUrl: string,
  method: string,
  statusCode: number,
  duration: number,
  error?: Error
) {
  const originService = 'parker-flight-api';
  const targetService = identifyTargetService(targetUrl);
  const protocol = targetUrl.startsWith('https://') ? 'https' : 'http';

  const targetConfig = serviceMap[targetService as keyof typeof serviceMap];
  
  // Record request
  serviceDependencyMetrics.outboundRequests
    .labels({
      origin_service: originService,
      target_service: targetService,
      method: method.toUpperCase(),
      status_code: statusCode.toString(),
      protocol: protocol,
      origin_external: 'false', // Parker Flight API is internal
      target_external: targetConfig?.external ? 'true' : 'false'
    })
    .inc();

  // Record duration
  serviceDependencyMetrics.outboundRequestDuration
    .labels({
      origin_service: originService,
      target_service: targetService,
      method: method.toUpperCase(),
      protocol: protocol
    })
    .observe(duration / 1000); // Convert ms to seconds

  // Record errors
  if (error || statusCode >= 400) {
    const errorType = error ? 'network_error' : `http_${Math.floor(statusCode / 100)}xx`;
    serviceDependencyMetrics.outboundErrors
      .labels({
        origin_service: originService,
        target_service: targetService,
        error_type: errorType,
        protocol: protocol
      })
      .inc();
  }
}

/**
 * HTTP interceptor for automatic dependency tracking
 */
export function createDependencyTrackingInterceptor() {
  // Store original fetch
  const originalFetch = global.fetch;
  
  // Override fetch to track requests
  global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    const method = init?.method || 'GET';
    const startTime = Date.now();
    
    let statusCode = 0;
    let error: Error | undefined;
    
    try {
      const response = await originalFetch(input, init);
      statusCode = response.status;
      
      // Record the request
      recordOutboundRequest(url, method, statusCode, Date.now() - startTime);
      
      return response;
    } catch (err) {
      error = err as Error;
      statusCode = 0; // Network error
      
      // Record the error
      recordOutboundRequest(url, method, statusCode, Date.now() - startTime, error);
      
      throw err;
    }
  };
  
  return () => {
    // Restore original fetch
    global.fetch = originalFetch;
  };
}

/**
 * Initialize dependency tracking
 */
export function initializeDependencyTracking() {
  console.log('🔗 Initializing service dependency tracking...');
  
  // Set up HTTP interceptor
  const cleanup = createDependencyTrackingInterceptor();
  
  // Log active services
  const externalServices = Object.entries(serviceMap)
    .filter(([_, config]) => config.external)
    .map(([key, config]) => `${config.name} (${key})`)
    .join(', ');
  
  console.log(`📡 Tracking dependencies: ${externalServices}`);
  
  return cleanup;
}

// Service dependency graph data transformation
export function generateServiceGraphData() {
  const metrics = register.getMetricsAsJSON();
  
  const requestMetrics = metrics.find(m => m.name === 'parker_flight_service_dependency_requests_total');
  const durationMetrics = metrics.find(m => m.name === 'parker_flight_outbound_request_duration_seconds');
  const errorMetrics = metrics.find(m => m.name === 'parker_flight_outbound_errors_total');
  
  if (!requestMetrics) return [];
  
  const graphData: any[] = [];
  
  // Process request metrics
  requestMetrics.values.forEach((metric: any) => {
    const { origin_service, target_service, protocol } = metric.labels;
    const requestCount = metric.value;
    
    // Find corresponding duration and error data
    const durationData = durationMetrics?.values.find((d: any) => 
      d.labels.origin_service === origin_service && 
      d.labels.target_service === target_service
    );
    
    const errorData = errorMetrics?.values.find((e: any) => 
      e.labels.origin_service === origin_service && 
      e.labels.target_service === target_service
    );
    
    const serviceConfig = serviceMap[target_service as keyof typeof serviceMap];
    
    graphData.push({
      source: origin_service,
      target: target_service,
      target_name: serviceConfig?.name || target_service,
      target_external: serviceConfig?.external || false,
      protocol: protocol,
      request_count: requestCount,
      avg_response_time: durationData ? (durationData.value / requestCount) * 1000 : 0, // Convert to ms
      error_count: errorData?.value || 0,
      error_rate: errorData ? (errorData.value / requestCount) * 100 : 0,
      health_status: (errorData?.value || 0) / requestCount < 0.05 ? 'healthy' : 'degraded'
    });
  });
  
  return graphData;
}
