import express from 'express';
import { register } from './metrics.js';
import { PerformanceObserver, performance } from 'node:perf_hooks';
import { customDNSResolver } from './dns-resolver.js';
import { 
  publishMetrics, 
  publishAuth, 
  metricsChannel 
} from './diagnostics.js';
import adminRouter from './api/admin.js';

const app = express();

// Performance Observer to monitor event loop delay
const obs = new PerformanceObserver((list) => {
  const entry = list.getEntries()[0];
  console.log(`Event Loop Delay: ${entry.duration}ms`);
});
obs.observe({ entryTypes: ['eventLoopDelay'], buffered: true });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3001');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-User-Id');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Admin routes
app.use('/api/admin', adminRouter);

// Health check endpoint with enhanced diagnostics
app.get('/health', (req, res) => {
  const dnsStats = customDNSResolver.getStats();
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    pid: process.pid,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    dns: dnsStats
  };
  
  // Publish health check metrics
  publishMetrics({
    type: 'gauge',
    name: 'health_check_memory_used',
    value: healthData.memory.heapUsed,
    timestamp: healthData.timestamp
  });
  
  publishMetrics({
    type: 'gauge',
    name: 'health_check_uptime_seconds',
    value: healthData.uptime,
    timestamp: healthData.timestamp
  });
  
  res.json(healthData);
});

// Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

// Business rules config endpoint
app.get('/api/business-rules/config', (req, res) => {
  res.json({
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    businessRules: {
      maxPassengers: 9,
      minAdvanceBooking: 24, // hours
      maxAdvanceBooking: 365, // days
      allowedCabinClasses: ['economy', 'premium_economy', 'business', 'first'],
      refundableTicketsOnly: false,
      minimumLayoverTime: 60 // minutes
    },
    features: {
      autoBookingEnabled: true,
      paymentProcessingEnabled: true,
      notificationsEnabled: true
    },
    timestamp: new Date().toISOString()
  });
});

// Feature flags endpoint with auth diagnostics
app.get('/api/feature-flags/:flagName', (req, res) => {
  const { flagName } = req.params;
  const userId = req.headers['x-user-id'] as string;
  const startTime = Date.now();
  
  // Mock feature flag logic
  const featureFlags: Record<string, { enabled: boolean; rolloutPercentage: number }> = {
    'ENABLE_CONFIG_DRIVEN_FORMS': { enabled: true, rolloutPercentage: 100 },
    'WALLET_UI': { enabled: true, rolloutPercentage: 5 },
    'ENHANCED_SEARCH': { enabled: false, rolloutPercentage: 0 },
    'AUTO_BOOKING': { enabled: true, rolloutPercentage: 50 }
  };
  
  const flag = featureFlags[flagName];
  
  if (!flag) {
    return res.status(404).json({ error: 'Feature flag not found' });
  }
  
  // Simple hash-based user rollout simulation
  let userInRollout = false;
  if (userId && flag.rolloutPercentage > 0) {
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    userInRollout = Math.abs(hash) % 100 < flag.rolloutPercentage;
  }
  
  const response = {
    flagName,
    enabled: flag.enabled && (flag.rolloutPercentage === 100 || userInRollout),
    rolloutPercentage: flag.rolloutPercentage,
    userInRollout,
    userId: userId || null,
    timestamp: new Date().toISOString()
  };
  
  // Publish auth diagnostics for feature flag access
  publishAuth({
    operation: 'permission_check',
    userId: userId || 'anonymous',
    timestamp: response.timestamp,
    success: true,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // Publish performance metrics
  publishMetrics({
    type: 'histogram',
    name: 'feature_flag_response_time_ms',
    value: Date.now() - startTime,
    labels: { flagName },
    timestamp: response.timestamp
  });
  
  res.json(response);
});

// Trip offers endpoint (for additional testing)
app.get('/api/trip-offers', (req, res) => {
  res.json({
    offers: [],
    total: 0,
    message: 'Mock endpoint - connect to Duffel API for real data',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint to generate sample service dependency data
app.get('/api/test-dependencies', async (req, res) => {
  const { recordOutboundRequest } = await import('./service-dependency-metrics.js');
  
  try {
    // Simulate some outbound requests for testing
    const testRequests = [
      { url: 'https://supabase.co/api/v1/users', method: 'GET', status: 200, duration: 120 },
      { url: 'https://api.stripe.com/v1/customers', method: 'POST', status: 201, duration: 250 },
      { url: 'https://app.launchdarkly.com/api/v1/flags', method: 'GET', status: 200, duration: 80 },
      { url: 'https://api.duffel.com/air/offers', method: 'POST', status: 200, duration: 1500 },
      { url: 'https://api.resend.com/emails', method: 'POST', status: 200, duration: 300 },
      // Add some failures
      { url: 'https://api.stripe.com/v1/charges', method: 'POST', status: 429, duration: 100 },
      { url: 'https://supabase.co/api/v1/profiles', method: 'GET', status: 500, duration: 5000 },
    ];
    
    testRequests.forEach(req => {
      recordOutboundRequest(req.url, req.method, req.status, req.duration);
    });
    
    res.json({
      message: 'Test service dependency data generated',
      requests_generated: testRequests.length,
      check_metrics: '/metrics',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate test data', details: error.message });
  }
});

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Parker Flight API Server', 
    version: '1.0.0',
    endpoints: [
      'GET /health',
      'GET /metrics', 
      'GET /api/business-rules/config',
      'GET /api/feature-flags/:flagName',
      'GET /api/trip-offers',
      'GET /api/test-dependencies',
      // Admin endpoints
      'GET /api/admin/metrics',
      'GET /api/admin/health',
      'GET /api/admin/feature-flags',
      'PATCH /api/admin/feature-flags/:key',
      'GET /api/admin/audit-logs',
      'POST /api/admin/audit-logs',
      'GET /api/admin/stream'
    ]
  });
});

export function startServer(port: number) {
    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

    // Set server timeouts for security
    server.headersTimeout = 60000; // 60 seconds
    server.keepAliveTimeout = 5000; // 5 seconds

    return server;
}

export default app;
