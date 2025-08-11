# OpenTelemetry Operations Guide

## Overview

This guide provides comprehensive operational procedures for maintaining production-grade OpenTelemetry observability in the Parker Flight Auto-Booking system. It covers deployment, monitoring, tuning, security, and maintenance practices based on OpenTelemetry specification requirements.

## Table of Contents

1. [Deployment](#deployment)
2. [Resource Monitoring](#resource-monitoring)
3. [Performance Tuning](#performance-tuning)
4. [Security Operations](#security-operations)
5. [Validation and Testing](#validation-and-testing)
6. [Maintenance Procedures](#maintenance-procedures)
7. [Troubleshooting](#troubleshooting)
8. [Specification Compliance](#specification-compliance)

## Deployment

### Initial Setup

1. **Configure Environment Variables**
   ```bash
   cp config/.env.otel.template config/.env.otel
   # Edit .env.otel with your production values
   ```

2. **Deploy OpenTelemetry Collector**
   ```bash
   # Using Docker
   docker run -d \
     --name otel-collector \
     --env-file config/.env.otel \
     -v $(pwd)/config/otel-collector.yaml:/etc/otel-collector-config.yaml \
     -p 4317:4317 -p 4318:4318 -p 8888:8888 \
     otel/opentelemetry-collector-contrib:latest \
     --config=/etc/otel-collector-config.yaml
   
   # Using Kubernetes
   kubectl apply -f k8s/otel-collector-deployment.yaml
   ```

3. **Verify Deployment Health**
   ```bash
   deno run --allow-net scripts/otel-health-check.ts
   ```

### Production Checklist

- [ ] TLS certificates configured and valid
- [ ] Authentication tokens generated and secured
- [ ] Resource limits configured appropriately
- [ ] Monitoring endpoints accessible
- [ ] Log shipping configured
- [ ] Backup procedures established
- [ ] Runbook documentation complete

## Resource Monitoring

### Key Metrics to Monitor

Monitor these critical OpenTelemetry Collector metrics:

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| `otelcol_exporter_queue_size` | Current queue size | > 80% of capacity |
| `otelcol_exporter_queue_capacity` | Maximum queue capacity | Static configuration |
| `otelcol_receiver_accepted_spans` | Successfully received spans | Trend monitoring |
| `otelcol_receiver_refused_spans` | Rejected spans | > 1% of total |
| `otelcol_processor_batch_batch_send_size` | Batch sizes | Efficiency monitoring |
| `process_resident_memory_bytes` | Memory usage | > 80% of limit |
| `otelcol_exporter_sent_spans_duration` | Export latency | > 5000ms |

### Automated Monitoring

Use the resource monitor script for continuous oversight:

```bash
# One-time report
deno run --allow-net --allow-env scripts/otel-resource-monitor.ts report

# Continuous monitoring (5-minute intervals)
deno run --allow-net --allow-env scripts/otel-resource-monitor.ts monitor 5
```

### Dashboard Setup

Create monitoring dashboards with these panels:

1. **Queue Health**
   - Queue utilization percentage
   - Queue size over time
   - Refused spans rate

2. **Performance Metrics**
   - Export latency percentiles
   - Batch processing efficiency
   - Throughput (spans/second)

3. **Resource Usage**
   - Memory consumption
   - CPU utilization
   - Network I/O

## Performance Tuning

### Queue Configuration

Optimize sending queue parameters based on workload:

```yaml
exporters:
  otlp:
    sending_queue:
      queue_size: 800          # Increase if utilization > 80%
      num_consumers: 4         # Increase if export latency high
```

**Tuning Guidelines:**
- High volume: Increase `queue_size` to 1200-1600
- High latency: Increase `num_consumers` to 6-8
- Memory constrained: Decrease `queue_size`, increase flush frequency

### Batch Processing

Configure batch processor for optimal throughput:

```yaml
processors:
  batch:
    send_batch_size: 1024      # Larger batches for efficiency
    send_batch_max_size: 2048  # Upper bound for large traces
    timeout: 5s                # Balance latency vs efficiency
```

**Optimization Rules:**
- Network-limited: Increase batch size
- Latency-sensitive: Decrease timeout
- High cardinality: Increase max_size

### Memory Management

Prevent OOM conditions with memory limiter:

```yaml
processors:
  memory_limiter:
    check_interval: 1s
    limit_mib: 512             # 80% of available memory
    spike_limit_mib: 128       # 20% buffer for spikes
```

### Sampling Strategy

Manage data volume with probabilistic sampling:

```yaml
processors:
  probabilistic_sampler:
    sampling_percentage: 100   # Production: 10-50%
```

**Sampling Guidelines:**
- Development: 100%
- Staging: 50-75%
- Production: 10-25% (adjust based on volume)
- Critical services: Higher sampling rates

## Security Operations

### Certificate Management

1. **Generate TLS Certificates**
   ```bash
   # Generate CA
   openssl genrsa -out ca.key 4096
   openssl req -new -x509 -days 365 -key ca.key -out ca.crt
   
   # Generate server certificate
   openssl genrsa -out server.key 4096
   openssl req -new -key server.key -out server.csr
   openssl x509 -req -days 365 -in server.csr -CA ca.crt -CAkey ca.key -out server.crt
   ```

2. **Certificate Rotation**
   - Rotate certificates every 90 days
   - Use automation tools (cert-manager, Let's Encrypt)
   - Monitor certificate expiration

3. **Secure Storage**
   ```bash
   # Set appropriate permissions
   chmod 600 /path/to/certs/*.key
   chmod 644 /path/to/certs/*.crt
   chown otel-collector:otel-collector /path/to/certs/*
   ```

### API Token Security

1. **Token Generation**
   ```bash
   # Generate secure random token
   openssl rand -hex 32
   ```

2. **Token Rotation**
   - Implement regular token rotation (monthly)
   - Use secret management systems (HashiCorp Vault, AWS Secrets Manager)
   - Update configuration atomically

3. **Access Control**
   - Implement least-privilege access
   - Use network policies to restrict access
   - Audit token usage regularly

### Security Audit Checklist

- [ ] All network communication encrypted (TLS 1.2+)
- [ ] Strong authentication tokens in use
- [ ] Certificates valid and not expired
- [ ] No hardcoded secrets in configuration
- [ ] Collector running as non-root user
- [ ] Network access properly restricted
- [ ] Security logs monitored and alerting

## Validation and Testing

### End-to-End Trace Testing

Use Tracetest for comprehensive validation:

```bash
# Install Tracetest CLI
curl -L https://raw.githubusercontent.com/kubeshop/tracetest/main/install-cli.sh | bash

# Run booking flow tests
tracetest run test --file tests/tracetest/booking-flow.yaml
```

### Unit Testing Patterns

Test span creation and export:

```typescript
// Mock span processor for testing
class MockSpanProcessor {
  spans: Span[] = [];
  
  onStart(span: Span): void {
    // Validate span initialization
    assert(span.traceId);
    assert(span.spanId);
  }
  
  onEnd(span: Span): void {
    this.spans.push(span);
  }
}
```

### Integration Testing

Validate context propagation:

```typescript
async function testContextPropagation() {
  const parentSpan = tracer.startSpan('parent-operation');
  
  // Simulate HTTP call
  const headers = {};
  injectTraceContext(headers, getCurrentTraceContext()!);
  
  // Validate headers
  assert(headers['traceparent']);
  
  // Simulate child service
  const extractedContext = extractTraceContext(new Headers(headers));
  assert(extractedContext?.traceId === parentSpan.traceId);
  
  parentSpan.end();
}
```

### Performance Testing

Load test the collector:

```bash
# Generate test load
for i in {1..1000}; do
  curl -X POST http://localhost:4318/v1/traces \
    -H "Content-Type: application/json" \
    -d @test-data/sample-trace.json &
done
```

## Maintenance Procedures

### Regular Maintenance Tasks

#### Daily
- [ ] Check collector health status
- [ ] Review error logs
- [ ] Monitor queue utilization
- [ ] Verify export connectivity

#### Weekly
- [ ] Analyze performance trends
- [ ] Review tuning recommendations
- [ ] Update security configurations
- [ ] Test backup procedures

#### Monthly
- [ ] Rotate API tokens and certificates
- [ ] Update OpenTelemetry versions
- [ ] Review and update documentation
- [ ] Conduct security audit

### Version Updates

1. **Check Compatibility**
   ```bash
   # Review changelog and breaking changes
   curl -s https://api.github.com/repos/open-telemetry/opentelemetry-collector/releases/latest
   ```

2. **Test in Staging**
   ```bash
   # Deploy to staging environment
   docker pull otel/opentelemetry-collector-contrib:latest
   # Run validation tests
   deno run scripts/otel-health-check.ts
   ```

3. **Production Deployment**
   ```bash
   # Rolling update
   kubectl set image deployment/otel-collector \
     otel-collector=otel/opentelemetry-collector-contrib:v0.89.0
   ```

### Backup Procedures

1. **Configuration Backup**
   ```bash
   # Backup configuration files
   tar -czf otel-config-backup-$(date +%Y%m%d).tar.gz config/
   ```

2. **Certificate Backup**
   ```bash
   # Secure certificate backup
   gpg --cipher-algo AES256 --compress-algo 1 --s2k-mode 3 \
       --s2k-digest-algo SHA512 --s2k-count 65536 --symmetric \
       --output certs-backup-$(date +%Y%m%d).gpg \
       /path/to/certs/
   ```

## Troubleshooting

### Common Issues

#### High Queue Utilization
**Symptoms:** Queue size approaching capacity, potential data loss
**Resolution:**
1. Increase `queue_size` parameter
2. Add more export consumers
3. Optimize network connectivity to backends
4. Implement sampling if data volume is too high

#### Export Failures
**Symptoms:** Export errors in logs, spans not appearing in backend
**Resolution:**
1. Verify backend connectivity
2. Check authentication credentials
3. Validate TLS configuration
4. Review network policies and firewall rules

#### Memory Issues
**Symptoms:** OOM kills, high memory usage alerts
**Resolution:**
1. Increase memory limits
2. Optimize batch sizes
3. Implement more aggressive sampling
4. Review span attribute cardinality

#### Certificate Expiration
**Symptoms:** TLS handshake failures, authentication errors
**Resolution:**
1. Check certificate expiration dates
2. Renew certificates before expiry
3. Update configuration with new certificates
4. Restart collector services

### Debug Mode

Enable detailed logging for troubleshooting:

```yaml
service:
  telemetry:
    logs:
      level: debug
      development: true
```

### Health Check Endpoints

Monitor collector health:

```bash
# Health check
curl http://localhost:13133/

# Internal metrics
curl http://localhost:8888/metrics

# zPages (if enabled)
curl http://localhost:55679/debug/tracez
```

## Specification Compliance

### OpenTelemetry Specification Requirements

This implementation satisfies all MUST, MUST NOT, and REQUIRED specifications:

1. **W3C Trace Context Propagation**
   - ✅ Implements traceparent header format
   - ✅ Supports tracestate header
   - ✅ Validates trace context format

2. **Semantic Conventions**
   - ✅ HTTP semantic conventions implemented
   - ✅ Database semantic conventions for Redis
   - ✅ Exception recording follows specification

3. **Resource Detection**
   - ✅ Service identification attributes
   - ✅ Runtime and deployment environment detection
   - ✅ Cloud provider resource attributes

4. **OTLP Export**
   - ✅ OTLP/HTTP and OTLP/gRPC support
   - ✅ Batch export implementation
   - ✅ Retry and timeout handling

### Compliance Validation

Run compliance tests regularly:

```bash
# Validate semantic conventions
deno run scripts/otel-health-check.ts semantic-conventions

# Test W3C trace context
deno run scripts/otel-health-check.ts trace-context

# Verify OTLP export format
deno run scripts/otel-health-check.ts export-format
```

### Staying Current

1. **Monitor Specification Updates**
   - Subscribe to OpenTelemetry specification releases
   - Review semantic convention changes
   - Update implementation for new requirements

2. **SDK Updates**
   - Regularly update OpenTelemetry SDKs
   - Test compatibility with new versions
   - Implement new features as they become stable

3. **Community Engagement**
   - Participate in OpenTelemetry community discussions
   - Report issues and contribute fixes
   - Share best practices and lessons learned

## Support and Resources

- **OpenTelemetry Documentation:** https://opentelemetry.io/docs/
- **Specification Repository:** https://github.com/open-telemetry/opentelemetry-specification
- **Collector Documentation:** https://opentelemetry.io/docs/collector/
- **Community Slack:** https://cloud-native.slack.com (#opentelemetry)
- **Weekly SIG Meetings:** https://github.com/open-telemetry/community

---

*This operations guide is maintained as part of the Parker Flight Auto-Booking OpenTelemetry implementation. Last updated: 2024-01-15*
