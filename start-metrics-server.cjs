const express = require('express');
const client = require('prom-client');

const app = express();

// Enable collection of default Node.js metrics
client.collectDefaultMetrics({ prefix: 'parker_flight_nodejs_' });

// Service dependency metrics
const serviceDependencyRequests = new client.Counter({
  name: 'parker_flight_service_dependency_requests_total',
  help: 'Total outbound requests to external services',
  labelNames: ['origin_service', 'target_service', 'method', 'status_code', 'protocol', 'origin_external', 'target_external']
});

const serviceDependencyDuration = new client.Histogram({
  name: 'parker_flight_service_dependency_duration_seconds',
  help: 'Duration of outbound requests to external services',
  labelNames: ['origin_service', 'target_service', 'method', 'status_code', 'protocol', 'origin_external', 'target_external'],
  buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10]
});

const serviceDependencyHealth = new client.Gauge({
  name: 'parker_flight_service_dependency_health',
  help: 'Health status of external service dependencies (1 = healthy, 0 = unhealthy)',
  labelNames: ['origin_service', 'target_service', 'protocol']
});

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Generate test service dependency data
app.get('/api/test-dependencies', (req, res) => {
  const testData = [
    { service: 'supabase', requests: 25, avgDuration: 0.12, success: true },
    { service: 'stripe', requests: 15, avgDuration: 0.25, success: true },
    { service: 'launchdarkly', requests: 50, avgDuration: 0.08, success: true },
    { service: 'duffel', requests: 8, avgDuration: 1.5, success: true },
    { service: 'resend', requests: 12, avgDuration: 0.3, success: true },
    // Add some errors
    { service: 'stripe', requests: 2, avgDuration: 0.1, success: false },
    { service: 'supabase', requests: 1, avgDuration: 5.0, success: false }
  ];

  testData.forEach(({ service, requests, avgDuration, success }) => {
    for (let i = 0; i < requests; i++) {
      serviceDependencyRequests
        .labels({
          origin_service: 'parker-flight',
          target_service: service,
          method: 'GET',
          status_code: success ? '200' : '500',
          protocol: 'https',
          origin_external: 'false',
          target_external: 'true'
        })
        .inc();

      serviceDependencyDuration
        .labels({
          origin_service: 'parker-flight',
          target_service: service,
          method: 'GET',
          status_code: success ? '200' : '500',
          protocol: 'https',
          origin_external: 'false',
          target_external: 'true'
        })
        .observe(avgDuration + (Math.random() - 0.5) * 0.1);
    }

    serviceDependencyHealth
      .labels({
        origin_service: 'parker-flight',
        target_service: service,
        protocol: 'https'
      })
      .set(success ? 1 : 0);
  });

  res.json({
    message: 'Test service dependency data generated',
    services: testData.length,
    check_metrics: '/metrics'
  });
});

// Alert testing endpoints
const testMetrics = new Map();

app.post('/api/test-metrics', (req, res) => {
  try {
    const { metric, value, timestamp } = req.body;
    
    // Parse metric name and labels
    const metricRegex = /^([a-zA-Z_:][a-zA-Z0-9_:]*)(\{.*\})?$/;
    const match = metric.match(metricRegex);
    
    if (!match) {
      return res.status(400).json({ error: 'Invalid metric format' });
    }
    
    const metricName = match[1];
    const labels = match[2] || '{}';
    
    // Create a test metric if it doesn't exist
    if (metricName.includes('dependency_up')) {
      // For dependency up metrics
      const serviceMatch = metric.match(/service="([^"]+)"/);
      if (serviceMatch) {
        serviceDependencyHealth
          .labels({
            origin_service: 'parker-flight',
            target_service: serviceMatch[1],
            protocol: 'https'
          })
          .set(value);
      }
    } else if (metricName.includes('requests_total')) {
      // For request counter metrics
      const statusMatch = metric.match(/status="([^"]+)"/);
      if (statusMatch) {
        serviceDependencyRequests
          .labels({
            origin_service: 'parker-flight',
            target_service: 'test-service',
            method: 'GET',
            status_code: statusMatch[1],
            protocol: 'https',
            origin_external: 'false',
            target_external: 'true'
          })
          .inc(value);
      }
    }
    
    console.log(`📊 Test metric set: ${metric} = ${value}`);
    
    res.json({
      message: 'Test metric set successfully',
      metric: metricName,
      value: value,
      timestamp: timestamp || Date.now()
    });
    
  } catch (error) {
    console.error('❌ Error setting test metric:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cleanup-test-metrics', (req, res) => {
  try {
    // Reset all dependencies to healthy
    const services = ['supabase', 'stripe', 'launchdarkly', 'duffel', 'resend'];
    services.forEach(service => {
      serviceDependencyHealth
        .labels({
          origin_service: 'parker-flight',
          target_service: service,
          protocol: 'https'
        })
        .set(1);
    });
    
    console.log('🧹 Test metrics cleaned up');
    
    res.json({
      message: 'Test metrics cleaned up successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error cleaning up test metrics:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'Parker Flight Metrics Server',
    endpoints: [
      'GET /health', 
      'GET /metrics', 
      'GET /api/test-dependencies',
      'POST /api/test-metrics',
      'POST /api/cleanup-test-metrics'
    ]
  });
});

const port = 5001;
app.listen(port, '127.0.0.1', () => {
  console.log(`✅ Metrics server running on http://127.0.0.1:${port}`);
  console.log(`📊 Metrics: http://127.0.0.1:${port}/metrics`);
  console.log(`🧪 Test data: http://127.0.0.1:${port}/api/test-dependencies`);
});
