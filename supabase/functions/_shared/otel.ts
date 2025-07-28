/**
 * OpenTelemetry Tracing for Supabase Edge Functions
 * 
 * Implements W3C Trace Context propagation and OpenTelemetry semantic conventions
 * for distributed tracing across auto-booking pipeline operations
 */

import { getLogContext } from './logger.ts';
import { otelConfig, resourceMonitor } from './otel-config.ts';

// W3C Trace Context Propagator
class W3CTraceContextPropagator {
  inject(context: TraceContext, headers: Record<string, string>): void {
    injectTraceContext(headers, context);
  }
  
  extract(headers: Headers): TraceContext | null {
    return extractTraceContext(headers);
  }
}

// BatchSpanProcessor implementation
class BatchSpanProcessor {
  private batch: Span[] = [];
  private timer: number | null = null;
  private readonly maxBatchSize: number;
  private readonly scheduledDelayMs: number;
  private readonly maxQueueSize: number;
  
  constructor(
    maxBatchSize: number = 512,
    scheduledDelayMs: number = 5000,
    maxQueueSize: number = 2048
  ) {
    this.maxBatchSize = maxBatchSize;
    this.scheduledDelayMs = scheduledDelayMs;
    this.maxQueueSize = maxQueueSize;
  }
  
  onEnd(span: Span): void {
    if (this.batch.length >= this.maxQueueSize) {
      console.warn('[BatchSpanProcessor] Queue full, dropping span');
      return;
    }
    
    this.batch.push(span);
    
    if (this.batch.length >= this.maxBatchSize) {
      this.flush();
    } else if (!this.timer && this.batch.length > 0) {
      this.timer = setTimeout(() => this.flush(), this.scheduledDelayMs);
    }
  }
  
  flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    if (this.batch.length === 0) return;
    
    const batchToExport = [...this.batch];
    this.batch = [];
    
    this.exportBatch(batchToExport);
  }
  
  private exportBatch(spans: Span[]): void {
    console.log(JSON.stringify({
      event: 'batch.export',
      spans: spans.map(span => ({
        traceId: span.traceId,
        spanId: span.spanId,
        parentSpanId: span.parentSpanId,
        name: span.operationName,
        startTime: span.startTime,
        endTime: span.endTime,
        attributes: span.attributes,
        events: span.events,
        status: span.status
      })),
      timestamp: new Date().toISOString()
    }));
  }
  
  shutdown(): void {
    this.flush();
  }
}

// Global propagator and processor instances
const globalPropagator = new W3CTraceContextPropagator();
const batchProcessor = new BatchSpanProcessor(512, 5000, 2048);

// Resource detection
function detectResourcesSync(): SpanAttributes {
  const environment = Deno.env.get('NODE_ENV') || Deno.env.get('ENVIRONMENT') || 'development';
  const projectId = Deno.env.get('SUPABASE_PROJECT_REF') || 'unknown';
  
  return {
    'deployment.environment': environment,
    'supabase.project_id': projectId,
    'service.name': 'parker-flight-auto-booking',
    'service.version': Deno.env.get('VERSION') || '1.0.0',
    'cloud.provider': 'supabase',
    'cloud.platform': 'supabase_edge_functions',
    'cloud.region': Deno.env.get('SUPABASE_REGION') || 'unknown',
    'faas.name': Deno.env.get('SUPABASE_FUNCTION_NAME') || 'unknown',
    'faas.version': Deno.env.get('SUPABASE_FUNCTION_VERSION') || '1.0.0',
    'runtime.name': 'deno',
    'runtime.version': Deno.version.deno
  };
}

// Initialize global propagator
export function setGlobalPropagator(propagator: W3CTraceContextPropagator = globalPropagator): void {
  // This sets the global propagator for W3C trace context
  console.log('[OTEL] W3C Trace Context Propagator initialized');
  
  // Expose getCurrentTraceContext on globalThis for logger integration
  globalThis.getCurrentTraceContext = getCurrentTraceContext;
}

export interface SpanAttributes {
  [key: string]: string | number | boolean;
}

export interface SpanEvent {
  name: string;
  timestamp: number;
  attributes?: SpanAttributes;
}

export enum SpanStatusCode {
  UNSET = 0,
  OK = 1,
  ERROR = 2
}

export interface SpanStatus {
  code: SpanStatusCode;
  message?: string;
}

export interface Span {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: number;
  endTime?: number;
  attributes: SpanAttributes;
  events: SpanEvent[];
  status: SpanStatus;
  
  // Methods for span manipulation
  setAttributes(attributes: SpanAttributes): void;
  setAttribute(key: string, value: string | number | boolean): void;
  addEvent(name: string, attributes?: SpanAttributes): void;
  recordException(exception: Error): void;
  setStatus(status: SpanStatus): void;
  end(): void;
}

export interface TraceContext {
  traceId: string;
  spanId: string;
  traceFlags: number;
  traceState?: string;
}

/**
 * W3C Trace Context utilities
 */
const TRACEPARENT_HEADER = 'traceparent';
const TRACESTATE_HEADER = 'tracestate';
const TRACE_VERSION = '00';

/**
 * OpenTelemetry Span implementation
 */
class OtelSpan implements Span {
  public traceId: string;
  public spanId: string;
  public parentSpanId?: string;
  public operationName: string;
  public startTime: number;
  public endTime?: number;
  public attributes: SpanAttributes = {};
  public events: SpanEvent[] = [];
  public status: SpanStatus = { code: SpanStatusCode.UNSET };
  private _ended = false;

  constructor(
    traceId: string,
    spanId: string,
    operationName: string,
    parentSpanId?: string
  ) {
    this.traceId = traceId;
    this.spanId = spanId;
    this.operationName = operationName;
    this.parentSpanId = parentSpanId;
    this.startTime = performance.now();
  }

  setAttributes(attributes: SpanAttributes): void {
    if (this._ended) return;
    Object.assign(this.attributes, attributes);
  }

  setAttribute(key: string, value: string | number | boolean): void {
    if (this._ended) return;
    this.attributes[key] = value;
  }

  addEvent(name: string, attributes?: SpanAttributes): void {
    if (this._ended) return;
    this.events.push({
      name,
      timestamp: performance.now(),
      attributes
    });
  }

  recordException(exception: Error): void {
    if (this._ended) return;
    
    // Follow OpenTelemetry semantic conventions for exceptions
    this.addEvent('exception', {
      'exception.type': exception.constructor.name,
      'exception.message': exception.message,
      'exception.stacktrace': exception.stack || 'No stack trace available'
    });
    
    this.setStatus({
      code: SpanStatusCode.ERROR,
      message: exception.message
    });
  }

  setStatus(status: SpanStatus): void {
    if (this._ended) return;
    this.status = status;
  }

  end(): void {
    if (this._ended) return;
    this._ended = true;
    this.endTime = performance.now();
    this.setAttribute('duration.ms', Math.round(this.endTime - this.startTime));
    
    // Remove from active spans and update monitoring
    activeSpans.delete(this.spanId);
    resourceMonitor.decrementActiveSpans();
    resourceMonitor.incrementCompletedSpans();
    
    completedSpans.push(this);
    
    // Keep only configured number of completed spans to prevent memory leaks
    const config = otelConfig.getConfig();
    if (completedSpans.length > config.maxCompletedSpans) {
      completedSpans.shift();
    }
    
    // Send to batch processor
    batchProcessor.onEnd(this);
  }
}

/**
 * Resource attributes for service identification
 */
function getResourceAttributes(): SpanAttributes {
  return {
    'service.name': 'parker-flight-auto-booking',
    'service.version': Deno.env.get('VERSION') || '1.0.0',
    'deployment.environment': Deno.env.get('SUPABASE_ENV') || 'development',
    'cloud.provider': 'supabase',
    'cloud.platform': 'supabase_edge_functions',
    'cloud.region': Deno.env.get('SUPABASE_REGION') || 'unknown',
    'faas.name': Deno.env.get('SUPABASE_FUNCTION_NAME') || 'unknown',
    'faas.version': Deno.env.get('SUPABASE_FUNCTION_VERSION') || '1.0.0',
    'runtime.name': 'deno',
    'runtime.version': Deno.version.deno
  };
}

/**
 * Active span context for current execution
 */
let currentTraceContext: TraceContext | null = null;
const activeSpans = new Map<string, OtelSpan>();
const completedSpans: Span[] = [];

/**
 * Generate a W3C compliant trace ID (32 hex characters)
 */
export function generateTraceId(): string {
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a W3C compliant span ID (16 hex characters)
 */
export function generateSpanId(): string {
  const randomBytes = new Uint8Array(8);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Parse W3C traceparent header
 * Format: 00-{trace-id}-{parent-id}-{trace-flags}
 */
export function parseTraceparent(traceparent: string): TraceContext | null {
  const parts = traceparent.split('-');
  if (parts.length !== 4 || parts[0] !== TRACE_VERSION) {
    return null;
  }
  
  const [version, traceId, spanId, traceFlags] = parts;
  
  // Validate format
  if (traceId.length !== 32 || spanId.length !== 16) {
    return null;
  }
  
  return {
    traceId,
    spanId,
    traceFlags: parseInt(traceFlags, 16),
    traceState: undefined // Will be set separately if present
  };
}

/**
 * Create W3C traceparent header
 */
export function createTraceparent(context: TraceContext): string {
  const flags = context.traceFlags.toString(16).padStart(2, '0');
  return `${TRACE_VERSION}-${context.traceId}-${context.spanId}-${flags}`;
}

/**
 * Extract trace context from HTTP headers
 */
export function extractTraceContext(headers: Headers): TraceContext | null {
  const traceparent = headers.get(TRACEPARENT_HEADER);
  if (!traceparent) {
    return null;
  }
  
  const context = parseTraceparent(traceparent);
  if (!context) {
    return null;
  }
  
  const tracestate = headers.get(TRACESTATE_HEADER);
  if (tracestate) {
    context.traceState = tracestate;
  }
  
  return context;
}

/**
 * Inject trace context into HTTP headers
 */
export function injectTraceContext(headers: Record<string, string>, context: TraceContext): void {
  headers[TRACEPARENT_HEADER] = createTraceparent(context);
  if (context.traceState) {
    headers[TRACESTATE_HEADER] = context.traceState;
  }
}

/**
 * Export a completed span (in production, this would send to OTLP endpoint)
 */
function exportSpan(span: OtelSpan): void {
  const otlpSpan = {
    traceId: span.traceId,
    spanId: span.spanId,
    parentSpanId: span.parentSpanId,
    name: span.operationName,
    kind: 1, // SPAN_KIND_INTERNAL
    startTimeUnixNano: Math.floor(span.startTime * 1000000), // Convert to nanoseconds
    endTimeUnixNano: span.endTime ? Math.floor(span.endTime * 1000000) : undefined,
    attributes: Object.entries({ ...getResourceAttributes(), ...span.attributes }).map(([key, value]) => ({
      key,
      value: {
        stringValue: typeof value === 'string' ? value : undefined,
        intValue: typeof value === 'number' ? Math.floor(value) : undefined,
        boolValue: typeof value === 'boolean' ? value : undefined
      }
    })),
    events: span.events.map(event => ({
      timeUnixNano: Math.floor(event.timestamp * 1000000),
      name: event.name,
      attributes: event.attributes ? Object.entries(event.attributes).map(([key, value]) => ({
        key,
        value: { stringValue: value.toString() }
      })) : []
    })),
    status: {
      code: span.status.code,
      message: span.status.message
    }
  };
  
  // In production, export to OTLP endpoint
  console.log(JSON.stringify({
    event: 'span.export',
    span: otlpSpan,
    timestamp: new Date().toISOString()
  }));
}

/**
 * Initialize trace context from incoming request
 */
export function initializeTraceContext(request: Request): TraceContext {
  // Try to extract existing trace context
  const extractedContext = extractTraceContext(request.headers);
  
  if (extractedContext) {
    currentTraceContext = extractedContext;
    return extractedContext;
  }
  
  // Create new trace context
  const newContext: TraceContext = {
    traceId: generateTraceId(),
    spanId: generateSpanId(),
    traceFlags: 1 // Sampled
  };
  
  currentTraceContext = newContext;
  return newContext;
}

/**
 * Get current trace context
 */
export function getCurrentTraceContext(): TraceContext | null {
  return currentTraceContext;
}

/**
 * Start a new tracing span
 */
export function startSpan(
  operationName: string, 
  attributes: SpanAttributes = {},
  parentContext?: TraceContext
): OtelSpan {
  const context = parentContext || currentTraceContext;
  const traceId = context?.traceId || generateTraceId();
  const parentSpanId = context?.spanId;
  
  const span = new OtelSpan(
    traceId,
    generateSpanId(),
    operationName,
    parentSpanId
  );
  
  // Set initial attributes including user context
  const logContext = getLogContext();
  span.setAttributes({
    'function.name': logContext.function || 'unknown',
    'user.id': logContext.userId || 'anonymous',
    ...attributes
  });
  
  activeSpans.set(span.spanId, span);
  
  // Update resource monitor
  resourceMonitor.incrementActiveSpans();
  
  // Update current context to this span
  currentTraceContext = {
    traceId: span.traceId,
    spanId: span.spanId,
    traceFlags: 1
  };
  
  return span;
}

/**
 * Finish a tracing span (deprecated - use span.end() instead)
 */
export function finishSpan(spanId: string, error?: Error): void {
  const span = activeSpans.get(spanId);
  if (!span) {
    console.warn(`Attempted to finish unknown span: ${spanId}`);
    return;
  }
  
  if (error) {
    span.recordException(error);
  }
  
  span.end();
}

/**
 * Trace an async operation with automatic span management
 */
export async function withSpan<T>(
  operationName: string,
  operation: (span: Span) => Promise<T>,
  attributes: SpanAttributes = {}
): Promise<T> {
  const span = startSpan(operationName, attributes);
  
  try {
    const result = await operation(span);
    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
    return result;
  } catch (error) {
    span.recordException(error as Error);
    span.end();
    throw error;
  }
}

/**
 * Trace a sync operation with automatic span management
 */
export function withSyncSpan<T>(
  operationName: string,
  operation: (span: Span) => T,
  attributes: SpanAttributes = {}
): T {
  const span = startSpan(operationName, attributes);
  
  try {
    const result = operation(span);
    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
    return result;
  } catch (error) {
    span.recordException(error as Error);
    span.end();
    throw error;
  }
}

/**
 * Get all completed spans (for testing/debugging)
 */
export function getCompletedSpans(): Span[] {
  return [...completedSpans];
}

/**
 * Get all active spans (for testing/debugging)
 */
export function getActiveSpans(): Span[] {
  return Array.from(activeSpans.values());
}

/**
 * Clear all spans (useful for testing)
 */
export function clearSpans(): void {
  activeSpans.clear();
  completedSpans.length = 0;
}

/**
 * Export spans in OpenTelemetry JSON format
 * In production, this would send to a tracing backend like Jaeger or Datadog
 */
export function exportSpans(): any[] {
  return completedSpans.map(span => ({
    traceID: span.traceId,
    spanID: span.spanId,
    operationName: span.operationName,
    startTime: span.startTime * 1000, // Convert to microseconds
    duration: span.endTime ? (span.endTime - span.startTime) * 1000 : 0,
    tags: Object.entries(span.attributes).map(([key, value]) => ({
      key,
      type: typeof value === 'string' ? 'string' : 'number',
      value: value.toString()
    })),
    process: {
      serviceName: 'parker-flight-auto-booking',
      tags: [
        { key: 'jaeger.version', value: 'deno-edge-functions' }
      ]
    }
  }));
}

/**
 * Tracer interface for consistent usage across modules
 */
export const tracer = {
  startSpan,
  finishSpan,
  withSpan,
  withSyncSpan,
  generateTraceId,
  generateSpanId
};
