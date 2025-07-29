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

app.get('/', (req, res) => {
  res.json({
    message: 'Parker Flight Metrics Server',
    endpoints: ['GET /health', 'GET /metrics', 'GET /api/test-dependencies']
  });
});

const port = 5001;
app.listen(port, '127.0.0.1', () => {
  console.log(`✅ Metrics server running on http://127.0.0.1:${port}`);
  console.log(`📊 Metrics: http://127.0.0.1:${port}/metrics`);
});
