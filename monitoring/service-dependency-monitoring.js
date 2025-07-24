const { initializeServiceDependencyGraph, serviceDependencyMetrics } = require('./metrics/service-dependencies');
const { initializeHttpInterceptors } = require('./interceptors/http-interceptor');

/**
 * Initialize complete service dependency monitoring
 * Call this early in your application startup
 */
function initializeServiceDependencyMonitoring() {
  console.log('🔗 Initializing Parker Flight Service Dependency Monitoring...');
  
  try {
    // Initialize metrics
    initializeServiceDependencyGraph();
    
    // Initialize HTTP interceptors for automatic tracking
    initializeHttpInterceptors();
    
    console.log('✅ Service Dependency Monitoring initialized successfully');
    console.log('📊 Dashboard available at: http://localhost:3001/d/service-dependencies');
    
    // Log metric names for verification
    console.log('📈 Metrics being collected:');
    console.log('  - parker_flight_service_dependency_requests_total');
    console.log('  - parker_flight_service_dependency_duration_seconds');
    console.log('  - parker_flight_service_dependency_health');
    
  } catch (error) {
    console.error('❌ Failed to initialize Service Dependency Monitoring:', error.message);
    throw error;
  }
}

/**
 * Get current service dependency metrics for debugging
 */
async function getServiceDependencyMetrics() {
  try {
    const register = serviceDependencyMetrics.outboundRequests.register;
    return await register.metrics();
  } catch (error) {
    console.error('Failed to get service dependency metrics:', error.message);
    return '';
  }
}

/**
 * Health check for service dependency monitoring
 */
function healthCheck() {
  return {
    serviceDependencyMonitoring: {
      status: 'healthy',
      metrics: [
        'parker_flight_service_dependency_requests_total',
        'parker_flight_service_dependency_duration_seconds', 
        'parker_flight_service_dependency_health'
      ],
      interceptors: [
        'fetch',
        'http/https',
        'axios'
      ],
      services: [
        'supabase',
        'launchdarkly', 
        'stripe'
      ]
    }
  };
}

module.exports = {
  initializeServiceDependencyMonitoring,
  getServiceDependencyMetrics,
  healthCheck,
  serviceDependencyMetrics
};
