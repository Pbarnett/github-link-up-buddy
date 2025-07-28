/**
 * OpenTelemetry Tracing Unit Tests
 * 
 * Tests W3C trace context propagation, span lifecycle,
 * and BatchSpanProcessor functionality
 */

import { assertEquals, assertExists, assert } from 'https://deno.land/std@0.192.0/testing/asserts.ts';
import {
  generateTraceId,
  generateSpanId,
  parseTraceparent,
  createTraceparent,
  extractTraceContext,
  injectTraceContext,
  startSpan,
  withSpan,
  clearSpans,
  getCompletedSpans,
  initializeTraceContext,
  setGlobalPropagator,
  SpanStatusCode
} from '../otel.ts';

Deno.test('OpenTelemetry - Generate valid W3C trace ID', () => {
  const traceId = generateTraceId();
  
  // Should be 32 hex characters
  assertEquals(traceId.length, 32);
  assert(/^[0-9a-f]{32}$/.test(traceId));
  
  // Should be unique
  const traceId2 = generateTraceId();
  assert(traceId !== traceId2);
});

Deno.test('OpenTelemetry - Generate valid W3C span ID', () => {
  const spanId = generateSpanId();
  
  // Should be 16 hex characters
  assertEquals(spanId.length, 16);
  assert(/^[0-9a-f]{16}$/.test(spanId));
  
  // Should be unique
  const spanId2 = generateSpanId();
  assert(spanId !== spanId2);
});

Deno.test('OpenTelemetry - Parse W3C traceparent header', () => {
  const traceId = 'abcdef1234567890abcdef1234567890';
  const spanId = '1234567890abcdef';
  const traceFlags = '01';
  const traceparent = `00-${traceId}-${spanId}-${traceFlags}`;
  
  const context = parseTraceparent(traceparent);
  
  assertExists(context);
  assertEquals(context.traceId, traceId);
  assertEquals(context.spanId, spanId);
  assertEquals(context.traceFlags, 1);
});

Deno.test('OpenTelemetry - Reject invalid traceparent format', () => {
  // Invalid version
  assertEquals(parseTraceparent('01-abcdef1234567890abcdef1234567890-1234567890abcdef-01'), null);
  
  // Wrong number of parts
  assertEquals(parseTraceparent('00-abcdef1234567890abcdef1234567890-1234567890abcdef'), null);
  
  // Invalid trace ID length
  assertEquals(parseTraceparent('00-abcdef123456789-1234567890abcdef-01'), null);
  
  // Invalid span ID length
  assertEquals(parseTraceparent('00-abcdef1234567890abcdef1234567890-123456789-01'), null);
});

Deno.test('OpenTelemetry - Create W3C traceparent header', () => {
  const context = {
    traceId: 'abcdef1234567890abcdef1234567890',
    spanId: '1234567890abcdef',
    traceFlags: 1
  };
  
  const traceparent = createTraceparent(context);
  assertEquals(traceparent, '00-abcdef1234567890abcdef1234567890-1234567890abcdef-01');
});

Deno.test('OpenTelemetry - Extract trace context from headers', () => {
  const headers = new Headers({
    'traceparent': '00-abcdef1234567890abcdef1234567890-1234567890abcdef-01',
    'tracestate': 'vendor1=value1,vendor2=value2'
  });
  
  const context = extractTraceContext(headers);
  
  assertExists(context);
  assertEquals(context.traceId, 'abcdef1234567890abcdef1234567890');
  assertEquals(context.spanId, '1234567890abcdef');
  assertEquals(context.traceFlags, 1);
  assertEquals(context.traceState, 'vendor1=value1,vendor2=value2');
});

Deno.test('OpenTelemetry - Inject trace context into headers', () => {
  const headers: Record<string, string> = {};
  const context = {
    traceId: 'abcdef1234567890abcdef1234567890',
    spanId: '1234567890abcdef',
    traceFlags: 1,
    traceState: 'vendor1=value1'
  };
  
  injectTraceContext(headers, context);
  
  assertEquals(headers['traceparent'], '00-abcdef1234567890abcdef1234567890-1234567890abcdef-01');
  assertEquals(headers['tracestate'], 'vendor1=value1');
});

Deno.test('OpenTelemetry - Initialize trace context from request', () => {
  // Clear any existing spans
  clearSpans();
  
  // Request with existing trace context
  const request1 = new Request('https://example.com', {
    headers: {
      'traceparent': '00-abcdef1234567890abcdef1234567890-1234567890abcdef-01'
    }
  });
  
  const context1 = initializeTraceContext(request1);
  assertEquals(context1.traceId, 'abcdef1234567890abcdef1234567890');
  assertEquals(context1.spanId, '1234567890abcdef');
  
  // Request without trace context (should generate new)
  const request2 = new Request('https://example.com');
  const context2 = initializeTraceContext(request2);
  
  assertEquals(context2.traceId.length, 32);
  assertEquals(context2.spanId.length, 16);
  assertEquals(context2.traceFlags, 1);
});

Deno.test('OpenTelemetry - Create and manage spans', () => {
  clearSpans();
  
  const span = startSpan('test.operation', {
    'test.attribute': 'value',
    'test.number': 42
  });
  
  assertEquals(span.operationName, 'test.operation');
  assertEquals(span.attributes['test.attribute'], 'value');
  assertEquals(span.attributes['test.number'], 42);
  assertExists(span.traceId);
  assertExists(span.spanId);
  assertEquals(span.status.code, SpanStatusCode.UNSET);
  
  // Add event
  span.addEvent('test.event', { 'event.data': 'test' });
  assertEquals(span.events.length, 1);
  assertEquals(span.events[0].name, 'test.event');
  
  // Record exception
  const error = new Error('Test error');
  span.recordException(error);
  assertEquals(span.status.code, SpanStatusCode.ERROR);
  assertEquals(span.status.message, 'Test error');
  
  // End span
  span.end();
  assertExists(span.endTime);
  assert(span.endTime! > span.startTime);
  
  const completedSpans = getCompletedSpans();
  assertEquals(completedSpans.length, 1);
  assertEquals(completedSpans[0].operationName, 'test.operation');
});

Deno.test('OpenTelemetry - withSpan async wrapper', async () => {
  clearSpans();
  
  const result = await withSpan(
    'async.operation',
    async (span) => {
      assertEquals(span.operationName, 'async.operation');
      span.setAttribute('operation.result', 'success');
      return 'test-result';
    },
    { 'initial.attribute': 'value' }
  );
  
  assertEquals(result, 'test-result');
  
  const completedSpans = getCompletedSpans();
  assertEquals(completedSpans.length, 1);
  assertEquals(completedSpans[0].operationName, 'async.operation');
  assertEquals(completedSpans[0].attributes['operation.result'], 'success');
  assertEquals(completedSpans[0].attributes['initial.attribute'], 'value');
  assertEquals(completedSpans[0].status.code, SpanStatusCode.OK);
});

Deno.test('OpenTelemetry - withSpan error handling', async () => {
  clearSpans();
  
  try {
    await withSpan(
      'failing.operation',
      async (span) => {
        span.setAttribute('operation.attempt', 1);
        throw new Error('Operation failed');
      }
    );
    assert(false, 'Should have thrown error');
  } catch (error) {
    assertEquals(error.message, 'Operation failed');
  }
  
  const completedSpans = getCompletedSpans();
  assertEquals(completedSpans.length, 1);
  assertEquals(completedSpans[0].operationName, 'failing.operation');
  assertEquals(completedSpans[0].status.code, SpanStatusCode.ERROR);
  assertEquals(completedSpans[0].status.message, 'Operation failed');
  
  // Should have exception event
  const exceptionEvents = completedSpans[0].events.filter(e => e.name === 'exception');
  assertEquals(exceptionEvents.length, 1);
  assertEquals(exceptionEvents[0].attributes!['exception.message'], 'Operation failed');
});

Deno.test('OpenTelemetry - W3C propagator initialization', () => {
  setGlobalPropagator();
  
  // Should expose getCurrentTraceContext on globalThis
  assertExists(globalThis.getCurrentTraceContext);
});

Deno.test('OpenTelemetry - Span parent-child relationship', () => {
  clearSpans();
  
  const parentSpan = startSpan('parent.operation');
  const childSpan = startSpan('child.operation');
  
  // Child should have parent's trace ID and span ID as parent
  assertEquals(childSpan.traceId, parentSpan.traceId);
  assertEquals(childSpan.parentSpanId, parentSpan.spanId);
  
  parentSpan.end();
  childSpan.end();
  
  const completedSpans = getCompletedSpans();
  assertEquals(completedSpans.length, 2);
});

Deno.test('OpenTelemetry - Span attributes validation', () => {
  clearSpans();
  
  const span = startSpan('test.span');
  
  // Test different attribute types
  span.setAttribute('string.attr', 'test');
  span.setAttribute('number.attr', 123);
  span.setAttribute('boolean.attr', true);
  
  assertEquals(span.attributes['string.attr'], 'test');
  assertEquals(span.attributes['number.attr'], 123);
  assertEquals(span.attributes['boolean.attr'], true);
  
  // Test batch attributes
  span.setAttributes({
    'batch.attr1': 'value1',
    'batch.attr2': 456
  });
  
  assertEquals(span.attributes['batch.attr1'], 'value1');
  assertEquals(span.attributes['batch.attr2'], 456);
  
  span.end();
});

Deno.test('OpenTelemetry - Resource detection', () => {
  // Set test environment variables
  const originalEnv = Deno.env.get('NODE_ENV');
  const originalProject = Deno.env.get('SUPABASE_PROJECT_REF');
  
  Deno.env.set('NODE_ENV', 'test');
  Deno.env.set('SUPABASE_PROJECT_REF', 'test-project-123');
  
  try {
    clearSpans();
    
    const span = startSpan('resource.test');
    span.end();
    
    const completedSpans = getCompletedSpans();
    const spanAttributes = completedSpans[0].attributes;
    
    // Should detect resources and merge with span attributes
    assert('service.name' in spanAttributes);
    assertEquals(spanAttributes['service.name'], 'parker-flight-auto-booking');
    
  } finally {
    // Restore environment
    if (originalEnv) {
      Deno.env.set('NODE_ENV', originalEnv);
    } else {
      Deno.env.delete('NODE_ENV');
    }
    
    if (originalProject) {
      Deno.env.set('SUPABASE_PROJECT_REF', originalProject);
    } else {
      Deno.env.delete('SUPABASE_PROJECT_REF');
    }
  }
});
