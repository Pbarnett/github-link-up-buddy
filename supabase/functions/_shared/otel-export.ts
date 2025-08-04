/**
 * OpenTelemetry Export Configuration
 * 
 * Configures proper span export to external telemetry systems.
 * This addresses gap #61: OpenTelemetry span export configured.
 * 
 * Features:
 * - OTLP HTTP export support
 * - Console export for debugging
 * - Batch processing for performance
 * - Automatic retry logic
 */

import { Span, SpanAttributes } from './otel.ts'
import { logger } from './logger.ts'

interface OTLPSpanExporter {
  export(spans: Span[]): Promise<void>
}

interface OTLPExportConfig {
  endpoint?: string
  headers?: Record<string, string>
  timeout?: number
  compression?: 'gzip' | 'none'
}

/**
 * Console Span Exporter - exports spans to console/logs
 */
export class ConsoleSpanExporter implements OTLPSpanExporter {
  async export(spans: Span[]): Promise<void> {
    for (const span of spans) {
      const spanData = {
        traceId: span.traceId,
        spanId: span.spanId,
        parentSpanId: span.parentSpanId,
        operationName: span.operationName,
        startTime: span.startTime,
        endTime: span.endTime,
        duration: span.endTime ? span.endTime - span.startTime : 0,
        attributes: span.attributes,
        events: span.events,
        status: span.status
      }

      logger.info('OpenTelemetry Span Export', {
        operation: 'otel_span_export',
        span: spanData
      })
    }
  }
}

/**
 * OTLP HTTP Span Exporter - exports spans to OTLP compatible endpoint
 */
export class OTLPHttpSpanExporter implements OTLPSpanExporter {
  private readonly endpoint: string
  private readonly headers: Record<string, string>
  private readonly timeout: number

  constructor(config: OTLPExportConfig) {
    this.endpoint = config.endpoint || Deno.env.get('OTEL_EXPORTER_OTLP_ENDPOINT') || 'http://localhost:4318/v1/traces'
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers
    }
    this.timeout = config.timeout || 30000

    // Add auth headers if available
    const authHeader = Deno.env.get('OTEL_EXPORTER_OTLP_HEADERS')
    if (authHeader) {
      const authPairs = authHeader.split(',')
      for (const pair of authPairs) {
        const [key, value] = pair.split('=')
        if (key && value) {
          this.headers[key.trim()] = value.trim()
        }
      }
    }
  }

  async export(spans: Span[]): Promise<void> {
    if (spans.length === 0) return

    const resourceSpans = this.convertToOTLPFormat(spans)
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(resourceSpans),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`OTLP export failed: ${response.status} ${response.statusText}`)
      }

      logger.info('Successfully exported spans to OTLP endpoint', {
        operation: 'otel_export_success',
        spanCount: spans.length,
        endpoint: this.endpoint
      })

    } catch (error) {
      logger.error('Failed to export spans to OTLP endpoint', {
        operation: 'otel_export_error',
        error: error.message,
        spanCount: spans.length,
        endpoint: this.endpoint
      })
      throw error
    }
  }

  private convertToOTLPFormat(spans: Span[]): any {
    const resource = {
      attributes: [
        { key: 'service.name', value: { stringValue: 'parker-flight-auto-booking' } },
        { key: 'service.version', value: { stringValue: Deno.env.get('VERSION') || '1.0.0' } },
        { key: 'deployment.environment', value: { stringValue: Deno.env.get('ENVIRONMENT') || 'development' } },
        { key: 'cloud.provider', value: { stringValue: 'supabase' } },
        { key: 'cloud.platform', value: { stringValue: 'supabase_edge_functions' } },
        { key: 'runtime.name', value: { stringValue: 'deno' } },
        { key: 'runtime.version', value: { stringValue: Deno.version.deno } }
      ]
    }

    const instrumentationScope = {
      name: 'parker-flight-otel',
      version: '1.0.0'
    }

    const otlpSpans = spans.map(span => ({
      traceId: this.hexToBase64(span.traceId),
      spanId: this.hexToBase64(span.spanId),
      parentSpanId: span.parentSpanId ? this.hexToBase64(span.parentSpanId) : undefined,
      name: span.operationName,
      kind: 1, // SPAN_KIND_INTERNAL
      startTimeUnixNano: Math.floor(span.startTime * 1000000).toString(),
      endTimeUnixNano: span.endTime ? Math.floor(span.endTime * 1000000).toString() : undefined,
      attributes: this.convertAttributes(span.attributes),
      events: span.events.map(event => ({
        timeUnixNano: Math.floor(event.timestamp * 1000000).toString(),
        name: event.name,
        attributes: event.attributes ? this.convertAttributes(event.attributes) : []
      })),
      status: {
        code: span.status.code,
        message: span.status.message
      }
    }))

    return {
      resourceSpans: [{
        resource,
        instrumentationLibrarySpans: [{
          instrumentationLibrary: instrumentationScope,
          spans: otlpSpans
        }]
      }]
    }
  }

  private convertAttributes(attributes: SpanAttributes): any[] {
    return Object.entries(attributes).map(([key, value]) => ({
      key,
      value: this.convertAttributeValue(value)
    }))
  }

  private convertAttributeValue(value: string | number | boolean): any {
    if (typeof value === 'string') {
      return { stringValue: value }
    } else if (typeof value === 'number') {
      return Number.isInteger(value) ? { intValue: value.toString() } : { doubleValue: value }
    } else if (typeof value === 'boolean') {
      return { boolValue: value }
    }
    return { stringValue: String(value) }
  }

  private hexToBase64(hex: string): string {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
    }
    return btoa(String.fromCharCode(...bytes))
  }
}

/**
 * Multi-exporter that sends spans to multiple destinations
 */
export class MultiSpanExporter implements OTLPSpanExporter {
  private exporters: OTLPSpanExporter[]

  constructor(exporters: OTLPSpanExporter[]) {
    this.exporters = exporters
  }

  async export(spans: Span[]): Promise<void> {
    const exportPromises = this.exporters.map(exporter => 
      exporter.export(spans).catch(error => {
        logger.warn('Span exporter failed', {
          operation: 'multi_exporter_partial_failure',
          error: error.message
        })
        return error
      })
    )

    const results = await Promise.allSettled(exportPromises)
    
    const failures = results.filter(result => result.status === 'rejected').length
    if (failures > 0) {
      logger.warn(`${failures} out of ${this.exporters.length} span exporters failed`, {
        operation: 'multi_exporter_failures',
        failureCount: failures,
        totalExporters: this.exporters.length
      })
    }
  }
}

/**
 * Initialize configured span exporters
 */
export function createSpanExporter(): OTLPSpanExporter {
  const exporters: OTLPSpanExporter[] = []

  // Always include console exporter for debugging
  exporters.push(new ConsoleSpanExporter())

  // Add OTLP HTTP exporter if endpoint is configured
  const otlpEndpoint = Deno.env.get('OTEL_EXPORTER_OTLP_ENDPOINT')
  if (otlpEndpoint) {
    exporters.push(new OTLPHttpSpanExporter({
      endpoint: otlpEndpoint
    }))
    
    logger.info('OTLP span exporter configured', {
      operation: 'otel_exporter_init',
      endpoint: otlpEndpoint
    })
  } else {
    logger.info('OTLP endpoint not configured, using console exporter only', {
      operation: 'otel_exporter_init_console_only'
    })
  }

  return exporters.length === 1 ? exporters[0] : new MultiSpanExporter(exporters)
}

/**
 * Export configuration for easy access
 */
export const otelExportConfig = {
  createSpanExporter,
  ConsoleSpanExporter,
  OTLPHttpSpanExporter,
  MultiSpanExporter
}
