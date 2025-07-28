# OpenTelemetry Implementation Guide

## Overview

This document provides comprehensive guidance for the OpenTelemetry distributed tracing implementation in the Parker Flight Auto-Booking system. Our implementation follows OpenTelemetry best practices and semantic conventions.

## Architecture

### Components

1. **Trace Context Management** (`_shared/otel.ts`)
   - W3C Trace Context propagation
   - Span lifecycle management
   - Resource detection

2. **Configuration Management** (`_shared/otel-config.ts`)
   - Environment-based configuration
   - Resource monitoring
   - Security validation

3. **Testing Framework** (`_shared/otel-test.ts`)
   - Trace-based testing utilities
   - Span relationship validation
   - Integration test helpers

### Service Integration

- **Duffel Service**: Flight booking API tracing
- **Stripe Service**: Payment processing tracing  
- **Redis Lock Service**: Distributed locking tracing
- **Auto-Book Monitor**: Batch processing tracing

## Configuration

### Environment Variables

```bash
# Required
OTEL_EXPORTER_OTLP_ENDPOINT=https://api.honeycomb.io/v1/traces
HONEYCOMB_API_KEY=your_api_key_here

# Optional
SUPABASE_ENV=production|staging|development
OTEL_RESOURCE_ATTRIBUTES=service.version=1.2.3,deployment.id=abc123
```

### Environment-Specific Settings

#### Development
- 100% sampling rate
- Local export endpoint
- Extended debugging

#### Staging  
- 50% sampling rate
- Staging export endpoint
- Error sampling enabled

#### Production
- 10% sampling rate
- Production export endpoint
- Enhanced security validation

## Instrumentation Patterns

### Basic Span Creation

```typescript
import { withSpan } from '../_shared/otel.ts';

async function businessOperation() {
  return withSpan('business.operation', async (span) => {
    span.setAttribute('business.entity_id', 'abc123');
    span.setAttribute('business.operation_type', 'create');
    
    // Your business logic here
    const result = await performWork();
    
    span.setAttribute('business.result_count', result.length);
    return result;
  });
}
```

### HTTP Client Tracing

```typescript
import { getCurrentTraceContext, injectTraceContext } from '../_shared/otel.ts';

async function makeHttpRequest(url: string, options: RequestInit) {
  const headers = { ...options.headers };
  
  // Propagate trace context
  const traceContext = getCurrentTraceContext();
  if (traceContext) {
    injectTraceContext(headers, traceContext);
  }
  
  return fetch(url, { ...options, headers });
}
```

### Error Handling

```typescript
return withSpan('operation.with_error_handling', async (span) => {
  try {
    const result = await riskyOperation();
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    // This automatically sets span status to ERROR and records exception
    span.recordException(error);
    throw error;
  }
});
```

## Testing

### Unit Tests

```typescript
import { TraceTest, clearSpans } from '../_shared/otel-test.ts';

Deno.test('operation creates expected spans', async () => {
  clearSpans();
  
  const test = new TraceTest('Operation Test')
    .expectSpan({
      operationName: 'business.operation',
      attributes: { 'business.entity_id': 'test123' },
      status: SpanStatusCode.OK
    });
  
  await businessOperation();
  
  const result = await test.validate();
  assertEquals(result.passed, true, result.message);
});
```

### Integration Tests

```typescript
import { testRequestTracing } from '../_shared/otel-test.ts';

Deno.test('full request lifecycle', async () => {
  const request = new Request('https://api.example.com/auto-book', {
    method: 'POST',
    headers: { 'traceparent': '00-...' }
  });
  
  const expectedSpans = [
    'auto_booking.validate_request',
    'auto_booking.search_flights',
    'auto_booking.create_booking'
  ];
  
  const result = await testRequestTracing(request, handler, expectedSpans);
  assertEquals(result.passed, true);
});
```

## Semantic Conventions

### Span Naming

- Use lowercase, dot-separated names
- Include service/component prefix
- Use verbs for operations: `duffel.create_order`, `stripe.capture_payment`

### Attribute Naming

Follow OpenTelemetry semantic conventions:

```typescript
// HTTP attributes
span.setAttribute('http.method', 'POST');
span.setAttribute('http.url', 'https://api.duffel.com/orders');
span.setAttribute('http.status_code', 200);

// Database attributes  
span.setAttribute('db.operation', 'SELECT');
span.setAttribute('db.collection.name', 'bookings');

// Business attributes
span.setAttribute('booking.trip_request_id', tripId);
span.setAttribute('payment.amount', amount);
span.setAttribute('user.id', userId);
```

### Exception Recording

```typescript
// Automatic exception recording
span.recordException(error);

// Manual exception event
span.addEvent('exception', {
  'exception.type': 'ValidationError',
  'exception.message': 'Invalid passenger data',
  'exception.stacktrace': error.stack
});
```

## Resource Monitoring

### Metrics

The system automatically monitors:

- Active span count
- Completed span count  
- Export success/failure rates
- Memory usage
- Export latency

### Alerts

Monitor these metrics for operational issues:

```typescript
// High active span count (potential memory leak)
activeSpans > maxActiveSpans * 0.8

// Export failures (connectivity issues)
exportErrors > 0

// High export latency (backend issues)  
exportDuration > 10000ms
```

## Security Best Practices

### Configuration Security

- Store API keys in environment variables
- Use HTTPS endpoints in production
- Validate configuration on startup
- Audit sensitive data in spans

### Data Privacy

- Avoid PII in span attributes
- Use user IDs, not names/emails
- Sanitize URLs and headers
- Review span data before export

## Troubleshooting

### Common Issues

#### Missing Spans
- Check trace context propagation
- Verify span lifecycle (start/end)
- Review sampling configuration

#### Context Not Propagated
- Ensure `injectTraceContext` is called
- Verify HTTP header transmission
- Check async context handling

#### High Memory Usage
- Monitor active span count
- Adjust batch size and frequency
- Review span retention settings

#### Export Failures
- Verify endpoint connectivity
- Check authentication credentials
- Review network security policies

### Debug Mode

Enable debug logging:

```typescript
// In development
export const DEBUG_OTEL = true;

// This will log all span operations
console.log('[DEBUG] Span created:', spanInfo);
```

## Migration Guide

### From Custom Tracing

1. Replace custom trace ID generation with OpenTelemetry
2. Update span creation to use `withSpan`
3. Convert custom attributes to semantic conventions
4. Implement proper context propagation

### Upgrading OpenTelemetry

1. Review specification changes
2. Update semantic conventions
3. Test trace completeness
4. Validate backend compatibility

## Performance Tuning

### Sampling Strategies

```typescript
// High-volume endpoints
samplingRatio: 0.01 // 1%

// Error traces (always sample)
alwaysSampleErrors: true

// Critical business operations
samplingRatio: 1.0 // 100%
```

### Resource Limits

```typescript
// Memory management
maxActiveSpans: 1000
maxCompletedSpans: 100
spanRetentionMs: 300000 // 5 minutes

// Export efficiency  
maxExportBatchSize: 512
scheduledDelayMs: 5000
exportTimeoutMs: 30000
```

## Maintenance

### Regular Tasks

1. **Weekly**: Review span metrics and adjust sampling
2. **Monthly**: Update OpenTelemetry SDK and review spec changes
3. **Quarterly**: Audit security configuration and span data
4. **As Needed**: Update semantic conventions for new services

### Monitoring Checklist

- [ ] Export success rate > 99%
- [ ] Average export latency < 5s
- [ ] Active span count within limits
- [ ] No configuration security issues
- [ ] Trace completeness validation passing

## Support

### Internal Resources

- Observability Team: `observability@example.com`
- Documentation: `/docs/observability/`
- Runbooks: `/docs/runbooks/otel-*`

### External Resources

- [OpenTelemetry Specification](https://opentelemetry.io/docs/specs/)
- [Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/)  
- [Deno OpenTelemetry](https://deno.land/x/opentelemetry)
- [Honeycomb Documentation](https://docs.honeycomb.io/)
