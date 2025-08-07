# Load Balancer Health Check Configuration

## Overview
This document provides configuration examples for setting up health checks with popular load balancers to integrate with the Parker Flight monitoring system.

## Health Check Endpoints

### Primary Health Check
- **URL**: `/functions/v1/health`
- **Port**: 54321 (Supabase Edge Functions)
- **Method**: GET
- **Expected Status**: 200
- **Timeout**: 10 seconds
- **Interval**: 30 seconds
- **Healthy Threshold**: 2 consecutive successes
- **Unhealthy Threshold**: 3 consecutive failures

### Prometheus Metrics Health Check
- **URL**: `/functions/v1/health?format=prometheus`
- **Port**: 54321
- **Method**: GET
- **Expected Status**: 200
- **Expected Content-Type**: `text/plain; charset=utf-8`

## Load Balancer Configurations

### AWS Application Load Balancer (ALB)

```json
{
  "HealthCheckPath": "/functions/v1/health",
  "HealthCheckPort": "54321",
  "HealthCheckProtocol": "HTTP",
  "HealthCheckTimeoutSeconds": 10,
  "HealthCheckIntervalSeconds": 30,
  "HealthyThresholdCount": 2,
  "UnhealthyThresholdCount": 3,
  "Matcher": {
    "HttpCode": "200"
  }
}
```

### NGINX Load Balancer

```nginx
upstream parker_flight_backend {
    server host.docker.internal:54321 max_fails=3 fail_timeout=30s;
    # Add more servers as needed
}

server {
    listen 80;
    server_name parker-flight.com;

    location /health {
        proxy_pass http://host.docker.internal:54321/functions/v1/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_connect_timeout 10s;
        proxy_read_timeout 10s;
    }

    location / {
        proxy_pass http://parker_flight_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### HAProxy Configuration

```haproxy
backend parker_flight_backend
    balance roundrobin
    option httpchk GET /functions/v1/health
    http-check expect status 200
    server app1 host.docker.internal:54321 check inter 30s rise 2 fall 3

frontend parker_flight_frontend
    bind *:80
    default_backend parker_flight_backend
```

### Docker Swarm Health Check

```yaml
version: '3.8'
services:
  parker-flight:
    image: parker-flight:latest
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:54321/functions/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
        monitor: 60s
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
        window: 120s
```

### Kubernetes Health Checks

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: parker-flight
spec:
  replicas: 3
  selector:
    matchLabels:
      app: parker-flight
  template:
    metadata:
      labels:
        app: parker-flight
    spec:
      containers:
      - name: parker-flight
        image: parker-flight:latest
        ports:
        - containerPort: 54321
        livenessProbe:
          httpGet:
            path: /functions/v1/health
            port: 54321
          initialDelaySeconds: 30
          periodSeconds: 30
          timeoutSeconds: 10
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /functions/v1/health
            port: 54321
          initialDelaySeconds: 5
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
---
apiVersion: v1
kind: Service
metadata:
  name: parker-flight-service
spec:
  selector:
    app: parker-flight
  ports:
  - port: 80
    targetPort: 54321
  type: LoadBalancer
```

## Health Check Response Format

### Healthy Response (Status 200)
```json
{
  "status": "healthy",
  "timestamp": "2025-07-23T05:44:30.123Z",
  "version": "1.0.0",
  "checks": [
    {
      "name": "database",
      "status": "healthy",
      "duration": 45,
      "metadata": {
        "rowCount": 1
      }
    },
    {
      "name": "feature_flags",
      "status": "healthy",
      "duration": 12,
      "metadata": {
        "flagCount": 5
      }
    },
    {
      "name": "memory",
      "status": "healthy",
      "duration": 1,
      "metadata": {
        "rss": 32,
        "heapUsed": 18,
        "heapTotal": 25
      }
    }
  ],
  "metrics": {
    "health_check_duration_ms": 78,
    "health_check_average_duration_ms": 19,
    "health_checks_total": 3,
    "health_checks_healthy": 3,
    "health_checks_degraded": 0,
    "health_checks_unhealthy": 0,
    "timestamp": 1753249470123
  }
}
```

### Degraded Response (Status 200)
```json
{
  "status": "degraded",
  "timestamp": "2025-07-23T05:44:30.123Z",
  "version": "1.0.0",
  "checks": [
    {
      "name": "database",
      "status": "healthy",
      "duration": 45
    },
    {
      "name": "memory",
      "status": "degraded",
      "duration": 1,
      "metadata": {
        "rss": 520
      }
    }
  ]
}
```

### Unhealthy Response (Status 503)
```json
{
  "status": "unhealthy",
  "timestamp": "2025-07-23T05:44:30.123Z",
  "version": "1.0.0",
  "checks": [
    {
      "name": "database",
      "status": "unhealthy",
      "duration": 5000,
      "error": "connection timeout"
    }
  ]
}
```

## Monitoring Integration

### Prometheus Scraping
The health endpoint provides Prometheus-compatible metrics when called with `?format=prometheus`:

```
pf_health_check_duration_ms 78
pf_health_check_average_duration_ms 19
pf_health_checks_total 3
pf_health_checks_healthy 3
pf_health_checks_degraded 0
pf_health_checks_unhealthy 0
pf_timestamp 1753249470123
```

### Alert Rules
Configure alerts based on health check failures:

```yaml
groups:
  - name: health-check-alerts
    rules:
      - alert: ServiceUnhealthy
        expr: pf_health_checks_unhealthy > 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Parker Flight service is unhealthy"
          description: "One or more health checks are failing"

      - alert: ServiceDegraded
        expr: pf_health_checks_degraded > 0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Parker Flight service performance is degraded"
          description: "Some health checks are in degraded state"
```

## Best Practices

1. **Multiple Health Check Endpoints**: Use different endpoints for different purposes (load balancer vs monitoring)
2. **Graceful Degradation**: Return degraded status instead of unhealthy when possible
3. **Timeout Configuration**: Set appropriate timeouts based on your SLA requirements
4. **Retry Logic**: Implement retry logic in health checks to avoid false positives
5. **Monitoring the Monitor**: Monitor the health check endpoints themselves
6. **Regional Health Checks**: Implement health checks from multiple regions for global services

## Troubleshooting

### Common Issues
1. **Health check timeout**: Increase timeout or optimize health check logic
2. **False positives**: Implement retry logic and adjust thresholds
3. **Network issues**: Ensure proper network connectivity between load balancer and service
4. **Resource constraints**: Monitor resource usage during health checks

### Debug Commands
```bash
# Test health check endpoint directly
curl -v http://localhost:54321/functions/v1/health

# Test with Prometheus format
curl -v http://localhost:54321/functions/v1/health?format=prometheus

# Check Prometheus metrics
curl -s http://localhost:9090/api/v1/query?query=pf_health_checks_total
```
