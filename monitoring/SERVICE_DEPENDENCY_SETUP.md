# Service Dependency Monitoring Setup

This guide helps you set up service dependency monitoring for Parker Flight to track outbound requests to Supabase, LaunchDarkly, Stripe, and other external services.

## 🚀 Quick Start

### 1. Install Plugin in Grafana

The Novatec Service Dependency Graph Panel plugin is already configured in your `docker-compose.monitoring.yml`:

```yaml
grafana:
  environment:
    - GF_INSTALL_PLUGINS=novatec-sdg-panel
```

### 2. Restart Grafana

```bash
docker compose -f docker-compose.monitoring.yml restart grafana
```

### 3. Integrate with Your Application

Add this to your main server file (e.g., `server.js` or `index.js`):

```javascript
// Import the service dependency monitoring
const { initializeServiceDependencyMonitoring } = require('./monitoring/service-dependency-monitoring');

// Initialize early in your application startup
initializeServiceDependencyMonitoring();

// Your existing server code...
```

### 4. Expose Metrics

Add the service dependency metrics to your existing metrics endpoint:

```javascript
const { serviceDependencyMetrics } = require('./monitoring/service-dependency-monitoring');
const client = require('prom-client');

// In your /metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  
  // Combine with your existing metrics
  const metrics = await client.register.metrics();
  res.end(metrics);
});
```

## 📊 Dashboard Access

Once set up, your Service Dependency Dashboard will be available at:
- **Grafana**: http://localhost:3001
- **Dashboard**: Look for "Parker Flight - Service Dependencies"

## 🎯 What Gets Tracked Automatically

The system automatically tracks:

### Supabase
- Database queries (SELECT, INSERT, UPDATE, DELETE)
- Response times and success rates
- Connection health

### LaunchDarkly  
- Feature flag evaluations
- Response times and success rates
- Service availability

### Stripe
- Payment processing requests
- API call success rates
- Response times

### Other Services
- Any HTTP/HTTPS requests to external services
- Custom service patterns can be added

## 📈 Available Metrics

### Service Dependency Requests
```
parker_flight_service_dependency_requests_total
```
- Counts all outbound requests by service
- Labels: origin_service, target_service, method, status_code, protocol

### Service Dependency Duration  
```
parker_flight_service_dependency_duration_seconds
```
- Histogram of request duration
- Same labels as requests metric

### Service Dependency Health
```
parker_flight_service_dependency_health
```
- Health status (1 = healthy, 0 = unhealthy)
- Labels: origin_service, target_service, protocol

## 🔧 Manual Tracking

For cases where automatic tracking doesn't work, use manual tracking:

```javascript
const { serviceTrackers } = require('./monitoring/metrics/service-dependencies');

// Track Supabase operation
serviceTrackers.supabase('SELECT', 0.125, true, 200);

// Track LaunchDarkly evaluation
serviceTrackers.launchdarkly('wallet_ui', 0.05, true, 200);

// Track Stripe payment
serviceTrackers.stripe('POST', 0.8, true, 200);

// Track any external service
serviceTrackers.external('some-api', 'GET', 0.3, true, 200);
```

## 🔍 Troubleshooting

### Plugin Not Appearing
1. Restart Grafana container: `docker compose restart grafana`
2. Check Grafana logs: `docker logs parker-flight-grafana`
3. Verify plugin is listed in Administration > Plugins

### No Data in Dashboard
1. Check metrics endpoint: http://localhost:5001/metrics
2. Look for `parker_flight_service_dependency_*` metrics
3. Verify Prometheus is scraping: http://localhost:9090/targets

### Service Not Detected
1. Check service URL patterns in `http-interceptor.js`
2. Add custom patterns if needed
3. Use manual tracking for custom services

## 🎨 Customizing Service Detection

Edit `monitoring/interceptors/http-interceptor.js` to add new service patterns:

```javascript
const SERVICE_PATTERNS = {
  supabase: /supabase\.co/,
  launchdarkly: /app\.launchdarkly\.com|launchdarkly\.com/,
  stripe: /api\.stripe\.com/,
  
  // Add your custom services
  yourapi: /api\.yourservice\.com/,
  thirdparty: /thirdparty\.example\.com/
};
```

## 📋 Verification Checklist

- [ ] Grafana plugin installed and visible
- [ ] Service dependency monitoring initialized in app
- [ ] Metrics visible at /metrics endpoint  
- [ ] Prometheus scraping metrics successfully
- [ ] Dashboard showing data in Grafana
- [ ] Service health status updating

## 🆘 Getting Help

If you encounter issues:

1. Check the console logs for initialization messages
2. Verify metrics are being generated: `curl http://localhost:5001/metrics | grep dependency`
3. Check Prometheus targets: http://localhost:9090/targets
4. Review Grafana dashboard configuration

The service dependency monitoring provides valuable insights into:
- **External service health and performance** 
- **Impact of third-party outages on your application**
- **Response time trends and SLA monitoring**
- **Dependency bottlenecks and optimization opportunities**
