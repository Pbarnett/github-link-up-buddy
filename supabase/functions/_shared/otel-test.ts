/**
 * OpenTelemetry Trace-Based Testing Utilities
 * 
 * Provides tools for validating trace completeness, span relationships,
 * and context propagation in distributed systems following OpenTelemetry best practices
 */

import { 
  Span, 
  SpanStatusCode, 
  getCompletedSpans, 
  getActiveSpans,
  clearSpans 
} from './otel.ts';

export interface TraceAssertion {
  spanName?: string;
  operationName?: string;
  parentSpanId?: string;
  attributes?: Record<string, string | number | boolean>;
  events?: string[];
  status?: SpanStatusCode;
  minDuration?: number;
  maxDuration?: number;
}

export interface TraceTestResult {
  passed: boolean;
  message: string;
  foundSpans: Span[];
  missingSpans: string[];
  extraSpans: Span[];
}

/**
 * Trace-based test runner for OpenTelemetry instrumentation validation
 */
export class TraceTest {
  private expectedSpans: TraceAssertion[] = [];
  private testName: string;
  private timeout: number;

  constructor(testName: string, timeout: number = 5000) {
    this.testName = testName;
    this.timeout = timeout;
  }

  /**
   * Expect a span to be present in the trace
   */
  expectSpan(assertion: TraceAssertion): TraceTest {
    this.expectedSpans.push(assertion);
    return this;
  }

  /**
   * Execute the test and validate trace structure
   */
  async validate(): Promise<TraceTestResult> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const checkTrace = () => {
        const completed = getCompletedSpans();
        const active = getActiveSpans();
        
        // Wait for all spans to complete or timeout
        if (active.length > 0 && Date.now() - startTime < this.timeout) {
          setTimeout(checkTrace, 100);
          return;
        }
        
        resolve(this.validateTraceStructure(completed));
      };
      
      checkTrace();
    });
  }

  /**
   * Validate the structure and completeness of collected traces
   */
  private validateTraceStructure(spans: Span[]): TraceTestResult {
    const foundSpans: Span[] = [];
    const missingSpans: string[] = [];
    const extraSpans: Span[] = [...spans];

    // Check each expected span
    for (const expected of this.expectedSpans) {
      const matchingSpan = spans.find(span => this.spanMatches(span, expected));
      
      if (matchingSpan) {
        foundSpans.push(matchingSpan);
        const index = extraSpans.indexOf(matchingSpan);
        if (index > -1) {
          extraSpans.splice(index, 1);
        }
      } else {
        missingSpans.push(expected.spanName || expected.operationName || 'unknown');
      }
    }

    // Validate parent-child relationships
    const relationshipErrors = this.validateSpanRelationships(spans);
    
    // Validate trace completeness
    const completenessErrors = this.validateTraceCompleteness(spans);

    const passed = missingSpans.length === 0 && 
                  relationshipErrors.length === 0 && 
                  completenessErrors.length === 0;

    const message = this.buildResultMessage(
      foundSpans, 
      missingSpans, 
      extraSpans, 
      relationshipErrors, 
      completenessErrors
    );

    return {
      passed,
      message,
      foundSpans,
      missingSpans,
      extraSpans
    };
  }

  /**
   * Check if a span matches the expected assertion
   */
  private spanMatches(span: Span, expected: TraceAssertion): boolean {
    // Check operation name
    if (expected.operationName && span.operationName !== expected.operationName) {
      return false;
    }

    // Check parent span relationship
    if (expected.parentSpanId && span.parentSpanId !== expected.parentSpanId) {
      return false;
    }

    // Check attributes
    if (expected.attributes) {
      for (const [key, value] of Object.entries(expected.attributes)) {
        if (span.attributes[key] !== value) {
          return false;
        }
      }
    }

    // Check events
    if (expected.events) {
      for (const eventName of expected.events) {
        if (!span.events.some(event => event.name === eventName)) {
          return false;
        }
      }
    }

    // Check status
    if (expected.status !== undefined && span.status?.code !== expected.status) {
      return false;
    }

    // Check duration
    if (span.endTime && span.startTime) {
      const duration = span.endTime - span.startTime;
      if (expected.minDuration && duration < expected.minDuration) {
        return false;
      }
      if (expected.maxDuration && duration > expected.maxDuration) {
        return false;
      }
    }

    return true;
  }

  /**
   * Validate parent-child relationships between spans
   */
  private validateSpanRelationships(spans: Span[]): string[] {
    const errors: string[] = [];
    const spanMap = new Map(spans.map(span => [span.spanId, span]));

    for (const span of spans) {
      if (span.parentSpanId) {
        const parent = spanMap.get(span.parentSpanId);
        if (!parent) {
          errors.push(`Span ${span.operationName} (${span.spanId}) references missing parent ${span.parentSpanId}`);
        } else if (parent.traceId !== span.traceId) {
          errors.push(`Span ${span.operationName} has different trace ID than parent ${parent.operationName}`);
        }
      }
    }

    return errors;
  }

  /**
   * Validate trace completeness (no missing spans in trace tree)
   */
  private validateTraceCompleteness(spans: Span[]): string[] {
    const errors: string[] = [];
    const traceGroups = new Map<string, Span[]>();

    // Group spans by trace ID
    for (const span of spans) {
      if (!traceGroups.has(span.traceId)) {
        traceGroups.set(span.traceId, []);
      }
      traceGroups.get(span.traceId)!.push(span);
    }

    // Check each trace for completeness
    for (const [traceId, traceSpans] of traceGroups) {
      const spanIds = new Set(traceSpans.map(s => s.spanId));
      
      for (const span of traceSpans) {
        if (span.parentSpanId && !spanIds.has(span.parentSpanId)) {
          errors.push(`Trace ${traceId} is incomplete: span ${span.operationName} references missing parent ${span.parentSpanId}`);
        }
      }
    }

    return errors;
  }

  /**
   * Build a comprehensive result message
   */
  private buildResultMessage(
    foundSpans: Span[], 
    missingSpans: string[], 
    extraSpans: Span[],
    relationshipErrors: string[],
    completenessErrors: string[]
  ): string {
    const messages: string[] = [`Test: ${this.testName}`];

    if (foundSpans.length > 0) {
      messages.push(`✓ Found ${foundSpans.length} expected spans`);
    }

    if (missingSpans.length > 0) {
      messages.push(`✗ Missing spans: ${missingSpans.join(', ')}`);
    }

    if (extraSpans.length > 0) {
      messages.push(`ℹ Extra spans found: ${extraSpans.map(s => s.operationName).join(', ')}`);
    }

    if (relationshipErrors.length > 0) {
      messages.push(`✗ Relationship errors:`);
      relationshipErrors.forEach(error => messages.push(`  - ${error}`));
    }

    if (completenessErrors.length > 0) {
      messages.push(`✗ Completeness errors:`);
      completenessErrors.forEach(error => messages.push(`  - ${error}`));
    }

    return messages.join('\n');
  }
}

/**
 * Utility functions for common trace testing patterns
 */
export class TraceTestUtils {
  /**
   * Test HTTP client request tracing
   */
  static async testHttpClientTrace(
    operation: () => Promise<any>,
    expectedUrl: string,
    expectedMethod: string = 'GET'
  ): Promise<TraceTestResult> {
    clearSpans();
    
    const test = new TraceTest('HTTP Client Trace')
      .expectSpan({
        operationName: 'http.client.request',
        attributes: {
          'http.method': expectedMethod,
          'http.url': expectedUrl
        }
      });

    await operation();
    return test.validate();
  }

  /**
   * Test database operation tracing
   */
  static async testDatabaseTrace(
    operation: () => Promise<any>,
    expectedOperation: string,
    expectedTable?: string
  ): Promise<TraceTestResult> {
    clearSpans();
    
    const test = new TraceTest('Database Operation Trace')
      .expectSpan({
        operationName: 'db.operation',
        attributes: {
          'db.operation': expectedOperation,
          ...(expectedTable && { 'db.collection.name': expectedTable })
        }
      });

    await operation();
    return test.validate();
  }

  /**
   * Test error propagation in traces
   */
  static async testErrorTrace(
    operation: () => Promise<any>,
    expectedErrorType: string
  ): Promise<TraceTestResult> {
    clearSpans();
    
    const test = new TraceTest('Error Propagation Trace')
      .expectSpan({
        status: SpanStatusCode.ERROR,
        events: ['exception'],
        attributes: {
          'error': true
        }
      });

    try {
      await operation();
    } catch {
      // Expected to throw
    }

    return test.validate();
  }

  /**
   * Test async operation context propagation  
   */
  static async testAsyncContextPropagation(
    parentOperation: () => Promise<any>,
    childOperationName: string
  ): Promise<TraceTestResult> {
    clearSpans();
    
    let parentSpanId: string;
    
    const test = new TraceTest('Async Context Propagation')
      .expectSpan({
        operationName: 'parent.operation'
      })
      .expectSpan({
        operationName: childOperationName
      });

    await parentOperation();
    
    const result = await test.validate();
    
    // Additional validation for parent-child relationship
    const spans = result.foundSpans;
    const parentSpan = spans.find(s => s.operationName === 'parent.operation');
    const childSpan = spans.find(s => s.operationName === childOperationName);
    
    if (parentSpan && childSpan && childSpan.parentSpanId !== parentSpan.spanId) {
      return {
        ...result,
        passed: false,
        message: result.message + '\n✗ Child span not properly linked to parent'
      };
    }
    
    return result;
  }
}

/**
 * Mock span exporter for testing (captures spans instead of sending to backend)
 */
export class MockSpanExporter {
  private exportedSpans: Span[] = [];

  export(spans: Span[]): void {
    this.exportedSpans.push(...spans);
  }

  getExportedSpans(): Span[] {
    return [...this.exportedSpans];
  }

  clear(): void {
    this.exportedSpans = [];
  }

  /**
   * Assert that a specific span was exported
   */
  assertSpanExported(operationName: string): boolean {
    return this.exportedSpans.some(span => span.operationName === operationName);
  }

  /**
   * Get span by operation name
   */
  getSpanByOperation(operationName: string): Span | undefined {
    return this.exportedSpans.find(span => span.operationName === operationName);
  }
}

/**
 * Integration test helper for full request lifecycle tracing
 */
export async function testRequestTracing(
  request: Request,
  handler: (req: Request) => Promise<Response>,
  expectedSpans: string[]
): Promise<TraceTestResult> {
  clearSpans();
  
  const test = new TraceTest('Request Lifecycle Tracing');
  
  // Add expectations for each span
  expectedSpans.forEach(spanName => {
    test.expectSpan({ operationName: spanName });
  });
  
  // Execute the request
  await handler(request);
  
  return test.validate();
}
