/**
 * OpenTelemetry Integration Tests
 * 
 * Demonstrates world-class trace-based testing for the auto-booking pipeline
 * following OpenTelemetry best practices and recommendations
 */

import { assertEquals, assertExists } from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { 
  TraceTest, 
  TraceTestUtils, 
  MockSpanExporter,
  testRequestTracing 
} from '../_shared/otel-test.ts';
import { 
  initializeTraceContext, 
  withSpan, 
  SpanStatusCode, 
  clearSpans,
  getCurrentTraceContext,
  createTraceparent,
  extractTraceContext
} from '../_shared/otel.ts';
import { createDuffelService } from '../lib/duffelService.ts';
import { createPaymentIntent } from '../_shared/stripe.ts';

Deno.test('OpenTelemetry W3C Trace Context Propagation', async () => {
  // Test W3C trace context parsing and generation
  const mockRequest = new Request('https://example.com', {
    headers: {
      'traceparent': '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'
    }
  });

  const context = initializeTraceContext(mockRequest);
  assertExists(context);
  assertEquals(context.traceId, '4bf92f3577b34da6a3ce929d0e0e4736');
  assertEquals(context.spanId, '00f067aa0ba902b7');
  assertEquals(context.traceFlags, 1);

  // Test trace context injection
  const headers: Record<string, string> = {};
  const currentContext = getCurrentTraceContext();
  if (currentContext) {
    const traceparent = createTraceparent(currentContext);
    assertEquals(traceparent.split('-').length, 4);
    assertEquals(traceparent.startsWith('00-'), true);
  }
});

Deno.test('Duffel Service Trace Completeness', async () => {
  clearSpans();

  // Mock Duffel service for testing
  const mockDuffelService = {
    async createOfferRequest() {
      return withSpan('duffel.create_offer_request', async (span) => {
        span.setAttribute('duffel.slices_count', 2);
        span.setAttribute('duffel.passengers_count', 1);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return { id: 'test-offer-request-123' };
      });
    }
  };

  const test = new TraceTest('Duffel Offer Request Trace')
    .expectSpan({
      operationName: 'duffel.create_offer_request',
      attributes: {
        'duffel.slices_count': 2,
        'duffel.passengers_count': 1
      },
      status: SpanStatusCode.OK,
      minDuration: 90 // At least 90ms due to setTimeout
    });

  // Execute the operation
  const result = await mockDuffelService.createOfferRequest();
  assertEquals(result.id, 'test-offer-request-123');

  // Validate trace structure
  const traceResult = await test.validate();
  assertEquals(traceResult.passed, true, traceResult.message);
  assertEquals(traceResult.foundSpans.length, 1);
  assertEquals(traceResult.missingSpans.length, 0);
});

Deno.test('Error Propagation in Traces', async () => {
  const errorOperation = async () => {
    return withSpan('test.error_operation', async (span) => {
      span.setAttribute('test.will_fail', true);
      
      // Simulate an error
      throw new Error('Simulated test error');
    });
  };

  const result = await TraceTestUtils.testErrorTrace(
    errorOperation,
    'Error'
  );

  assertEquals(result.passed, true, result.message);
  
  // Verify exception was recorded properly
  const errorSpan = result.foundSpans[0];
  assertExists(errorSpan);
  assertEquals(errorSpan.status.code, SpanStatusCode.ERROR);
  
  // Check for exception event
  const exceptionEvent = errorSpan.events.find(e => e.name === 'exception');
  assertExists(exceptionEvent);
  assertEquals(exceptionEvent.attributes?.['exception.message'], 'Simulated test error');
  assertEquals(exceptionEvent.attributes?.['exception.type'], 'Error');
});

Deno.test('Async Context Propagation', async () => {
  clearSpans();

  const parentOperation = async () => {
    return withSpan('parent.operation', async (parentSpan) => {
      parentSpan.setAttribute('parent.id', 'test-parent');
      
      // Simulate child operation
      return withSpan('child.operation', async (childSpan) => {
        childSpan.setAttribute('child.id', 'test-child');
        
        // Simulate async work
        await new Promise(resolve => setTimeout(resolve, 50));
        
        return 'child-result';
      });
    });
  };

  const result = await TraceTestUtils.testAsyncContextPropagation(
    parentOperation,
    'child.operation'
  );

  assertEquals(result.passed, true, result.message);
  assertEquals(result.foundSpans.length, 2);
  
  // Verify parent-child relationship
  const parentSpan = result.foundSpans.find(s => s.operationName === 'parent.operation');
  const childSpan = result.foundSpans.find(s => s.operationName === 'child.operation');
  
  assertExists(parentSpan);
  assertExists(childSpan);
  assertEquals(childSpan.parentSpanId, parentSpan.spanId);
  assertEquals(childSpan.traceId, parentSpan.traceId);
});

Deno.test('HTTP Client Request Tracing', async () => {
  const mockHttpOperation = async () => {
    return withSpan('http.client.request', async (span) => {
      span.setAttribute('http.method', 'POST');
      span.setAttribute('http.url', 'https://api.duffel.com/air/offers');
      span.setAttribute('http.status_code', 200);
      
      // Simulate HTTP request
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return { success: true };
    });
  };

  const result = await TraceTestUtils.testHttpClientTrace(
    mockHttpOperation,
    'https://api.duffel.com/air/offers',
    'POST'
  );

  assertEquals(result.passed, true, result.message);
  
  const httpSpan = result.foundSpans[0];
  assertEquals(httpSpan.attributes['http.method'], 'POST');
  assertEquals(httpSpan.attributes['http.url'], 'https://api.duffel.com/air/offers');
});

Deno.test('Span Relationship Validation', async () => {
  clearSpans();

  // Create a complex trace with multiple levels
  await withSpan('root.operation', async (rootSpan) => {
    rootSpan.setAttribute('level', 0);
    
    await withSpan('level1.operation', async (level1Span) => {
      level1Span.setAttribute('level', 1);
      
      await withSpan('level2.operation', async (level2Span) => {
        level2Span.setAttribute('level', 2);
        
        // Simulate parallel operations
        await Promise.all([
          withSpan('parallel1.operation', async (p1Span) => {
            p1Span.setAttribute('parallel', 1);
            await new Promise(resolve => setTimeout(resolve, 50));
          }),
          withSpan('parallel2.operation', async (p2Span) => {
            p2Span.setAttribute('parallel', 2);
            await new Promise(resolve => setTimeout(resolve, 30));
          })
        ]);
      });
    });
  });

  const test = new TraceTest('Complex Span Relationships')
    .expectSpan({ operationName: 'root.operation' })
    .expectSpan({ operationName: 'level1.operation' })
    .expectSpan({ operationName: 'level2.operation' })
    .expectSpan({ operationName: 'parallel1.operation' })
    .expectSpan({ operationName: 'parallel2.operation' });

  const result = await test.validate();
  assertEquals(result.passed, true, result.message);
  assertEquals(result.foundSpans.length, 5);
  
  // Verify all spans belong to the same trace
  const traceIds = [...new Set(result.foundSpans.map(s => s.traceId))];
  assertEquals(traceIds.length, 1, 'All spans should belong to the same trace');
});

Deno.test('Mock Span Exporter', async () => {
  const mockExporter = new MockSpanExporter();
  
  // Simulate span export
  await withSpan('test.exportable_span', async (span) => {
    span.setAttribute('test.exported', true);
    
    // In a real implementation, the span would be exported automatically
    // For testing, we manually add it to the mock exporter
    mockExporter.export([span]);
    
    return 'test-result';
  });

  // Verify span was exported
  assertEquals(mockExporter.assertSpanExported('test.exportable_span'), true);
  
  const exportedSpan = mockExporter.getSpanByOperation('test.exportable_span');
  assertExists(exportedSpan);
  assertEquals(exportedSpan.attributes['test.exported'], true);
  
  // Clear and verify
  mockExporter.clear();
  assertEquals(mockExporter.getExportedSpans().length, 0);
});

Deno.test('Integration: Auto-Booking Request Lifecycle', async () => {
  // Simulate a complete auto-booking request with trace validation
  const mockRequest = new Request('https://api.example.com/auto-book', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'traceparent': '00-' + '1'.repeat(32) + '-' + '2'.repeat(16) + '-01'
    },
    body: JSON.stringify({
      tripRequestId: 'test-trip-123',
      userId: 'test-user-456'
    })
  });

  const mockHandler = async (req: Request) => {
    initializeTraceContext(req);
    
    // Simulate auto-booking pipeline operations
    await withSpan('auto_booking.validate_request', async (span) => {
      span.setAttribute('trip_request_id', 'test-trip-123');
      span.setAttribute('user_id', 'test-user-456');
    });

    await withSpan('auto_booking.search_flights', async (span) => {
      span.setAttribute('search.provider', 'duffel');
      span.setAttribute('search.offers_found', 5);
    });

    await withSpan('auto_booking.create_payment_intent', async (span) => {
      span.setAttribute('stripe.amount', 45000);
      span.setAttribute('stripe.currency', 'usd');
    });

    await withSpan('auto_booking.create_booking', async (span) => {
      span.setAttribute('booking.status', 'confirmed');
      span.setAttribute('booking.reference', 'ABC123');
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  };

  const expectedSpans = [
    'auto_booking.validate_request',
    'auto_booking.search_flights', 
    'auto_booking.create_payment_intent',
    'auto_booking.create_booking'
  ];

  const result = await testRequestTracing(mockRequest, mockHandler, expectedSpans);
  
  assertEquals(result.passed, true, result.message);
  assertEquals(result.foundSpans.length, 4);
  
  // Verify all spans share the same trace ID from the incoming request
  const incomingTraceId = '1'.repeat(32);
  result.foundSpans.forEach(span => {
    assertEquals(span.traceId, incomingTraceId, 'Span should use incoming trace ID');
  });
});

// Helper function to validate OpenTelemetry semantic conventions
function validateSemanticConventions(span: any) {
  // Verify resource attributes are present
  const requiredResourceAttrs = [
    'service.name',
    'service.version',
    'deployment.environment'
  ];
  
  for (const attr of requiredResourceAttrs) {
    assertExists(span.attributes[attr], `Missing required resource attribute: ${attr}`);
  }
  
  // Verify span has proper timing
  assertExists(span.startTime, 'Span should have start time');
  if (span.endTime) {
    assertEquals(
      span.endTime >= span.startTime, 
      true, 
      'End time should be >= start time'
    );
  }
}
