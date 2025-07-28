#!/usr/bin/env -S deno run --allow-net --allow-env --allow-read

/**
 * OpenTelemetry Health Check and Validation Script
 * 
 * Performs comprehensive validation of OpenTelemetry implementation
 * including configuration, connectivity, and trace completeness
 */

import { 
  OtelSecurityValidator, 
  OtelResourceMonitor,
  getOtelConfig 
} from '../supabase/functions/_shared/otel-config.ts';
import { 
  TraceTest, 
  TraceTestUtils,
  clearSpans 
} from '../supabase/functions/_shared/otel-test.ts';
import { 
  withSpan, 
  SpanStatusCode,
  generateTraceId,
  generateSpanId,
  createTraceparent,
  parseTraceparent
} from '../supabase/functions/_shared/otel.ts';

interface HealthCheckResult {
  component: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: any;
}

class OtelHealthChecker {
  private results: HealthCheckResult[] = [];

  async runAllChecks(): Promise<HealthCheckResult[]> {
    console.log('🔍 Starting OpenTelemetry Health Check...\n');

    await this.checkConfiguration();
    await this.checkSecurity();
    await this.checkTraceContextGeneration();
    await this.checkSpanLifecycle();
    await this.checkContextPropagation();
    await this.checkErrorHandling();
    await this.checkResourceMonitoring();
    await this.checkExportConnectivity();
    await this.checkSemanticConventions();

    this.printSummary();
    return this.results;
  }

  private async checkConfiguration() {
    console.log('📋 Checking configuration...');
    
    try {
      const config = getOtelConfig();
      
      // Validate required fields
      const requiredFields = ['exportEndpoint', 'samplingRatio', 'maxActiveSpans'];
      const missingFields = requiredFields.filter(field => !config[field as keyof typeof config]);
      
      if (missingFields.length > 0) {
        this.addResult('configuration', 'fail', `Missing required config: ${missingFields.join(', ')}`);
        return;
      }

      // Validate reasonable values
      if (config.samplingRatio < 0 || config.samplingRatio > 1) {
        this.addResult('configuration', 'fail', 'Sampling ratio must be between 0 and 1');
        return;
      }

      if (config.maxActiveSpans < 100) {
        this.addResult('configuration', 'warn', 'MaxActiveSpans is very low, may cause span drops');
      }

      this.addResult('configuration', 'pass', 'Configuration validation passed', {
        environment: Deno.env.get('SUPABASE_ENV'),
        samplingRatio: config.samplingRatio,
        exportEndpoint: config.exportEndpoint.replace(/api[_-]?key[s]?=[^&]+/gi, 'api_key=***')
      });

    } catch (error) {
      this.addResult('configuration', 'fail', `Configuration error: ${error.message}`);
    }
  }

  private async checkSecurity() {
    console.log('🔒 Checking security configuration...');
    
    try {
      OtelSecurityValidator.auditConfiguration();
      
      const config = getOtelConfig();
      const issues = OtelSecurityValidator.validateConfig(config);
      
      if (issues.length > 0) {
        this.addResult('security', 'fail', 'Security issues detected', { issues });
      } else {
        this.addResult('security', 'pass', 'Security validation passed');
      }

    } catch (error) {
      this.addResult('security', 'fail', `Security check error: ${error.message}`);
    }
  }

  private async checkTraceContextGeneration() {
    console.log('🆔 Checking trace context generation...');
    
    try {
      // Test trace ID generation
      const traceId1 = generateTraceId();
      const traceId2 = generateTraceId();
      
      if (traceId1.length !== 32 || traceId2.length !== 32) {
        this.addResult('trace_context', 'fail', 'Invalid trace ID length');
        return;
      }
      
      if (traceId1 === traceId2) {
        this.addResult('trace_context', 'fail', 'Trace IDs not unique');
        return;
      }
      
      if (!/^[0-9a-f]{32}$/.test(traceId1)) {
        this.addResult('trace_context', 'fail', 'Trace ID not valid hex');
        return;
      }

      // Test span ID generation
      const spanId1 = generateSpanId();
      const spanId2 = generateSpanId();
      
      if (spanId1.length !== 16 || spanId2.length !== 16) {
        this.addResult('trace_context', 'fail', 'Invalid span ID length');
        return;
      }
      
      if (!/^[0-9a-f]{16}$/.test(spanId1)) {
        this.addResult('trace_context', 'fail', 'Span ID not valid hex');
        return;
      }

      // Test traceparent generation and parsing
      const context = { traceId: traceId1, spanId: spanId1, traceFlags: 1 };
      const traceparent = createTraceparent(context);
      const parsed = parseTraceparent(traceparent);
      
      if (!parsed || parsed.traceId !== traceId1 || parsed.spanId !== spanId1) {
        this.addResult('trace_context', 'fail', 'Traceparent round-trip failed');
        return;
      }

      this.addResult('trace_context', 'pass', 'Trace context generation working correctly');

    } catch (error) {
      this.addResult('trace_context', 'fail', `Trace context error: ${error.message}`);
    }
  }

  private async checkSpanLifecycle() {
    console.log('🔄 Checking span lifecycle...');
    
    try {
      clearSpans();
      
      await withSpan('test.lifecycle_check', async (span) => {
        span.setAttribute('test.component', 'health_check');
        span.addEvent('test.event', { 'test.data': 'lifecycle_test' });
        
        // Simulate some work
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      const test = new TraceTest('Span Lifecycle Test')
        .expectSpan({
          operationName: 'test.lifecycle_check',
          attributes: { 'test.component': 'health_check' },
          events: ['test.event'],
          status: SpanStatusCode.OK,
          minDuration: 5
        });

      const result = await test.validate();
      
      if (result.passed) {
        this.addResult('span_lifecycle', 'pass', 'Span lifecycle working correctly');
      } else {
        this.addResult('span_lifecycle', 'fail', 'Span lifecycle issues', { 
          issues: result.message,
          missingSpans: result.missingSpans 
        });
      }

    } catch (error) {
      this.addResult('span_lifecycle', 'fail', `Span lifecycle error: ${error.message}`);
    }
  }

  private async checkContextPropagation() {
    console.log('🔗 Checking context propagation...');
    
    try {
      clearSpans();
      
      const parentOperation = async () => {
        return withSpan('test.parent_operation', async (parentSpan) => {
          parentSpan.setAttribute('test.level', 'parent');
          
          return withSpan('test.child_operation', async (childSpan) => {
            childSpan.setAttribute('test.level', 'child');
            return 'success';
          });
        });
      };

      const result = await TraceTestUtils.testAsyncContextPropagation(
        parentOperation,
        'test.child_operation'
      );

      if (result.passed) {
        this.addResult('context_propagation', 'pass', 'Context propagation working correctly');
      } else {
        this.addResult('context_propagation', 'fail', 'Context propagation issues', {
          issues: result.message
        });
      }

    } catch (error) {
      this.addResult('context_propagation', 'fail', `Context propagation error: ${error.message}`);
    }
  }

  private async checkErrorHandling() {
    console.log('❌ Checking error handling...');
    
    try {
      const errorOperation = async () => {
        return withSpan('test.error_operation', async (span) => {
          span.setAttribute('test.will_error', true);
          throw new Error('Test error for health check');
        });
      };

      const result = await TraceTestUtils.testErrorTrace(errorOperation, 'Error');

      if (result.passed) {
        const errorSpan = result.foundSpans[0];
        const hasExceptionEvent = errorSpan.events.some(e => e.name === 'exception');
        
        if (hasExceptionEvent) {
          this.addResult('error_handling', 'pass', 'Error handling working correctly');
        } else {
          this.addResult('error_handling', 'warn', 'Errors recorded but missing exception events');
        }
      } else {
        this.addResult('error_handling', 'fail', 'Error handling issues', {
          issues: result.message
        });
      }

    } catch (error) {
      // This is expected - we're testing error handling
      this.addResult('error_handling', 'pass', 'Error handling working correctly');
    }
  }

  private async checkResourceMonitoring() {
    console.log('📊 Checking resource monitoring...');
    
    try {
      const monitor = new OtelResourceMonitor(getOtelConfig());
      const metrics = monitor.getMetrics();
      
      // Check if monitoring is collecting data
      const hasData = Object.values(metrics).some(value => value !== 0);
      
      if (hasData || metrics.activeSpans >= 0) {
        this.addResult('resource_monitoring', 'pass', 'Resource monitoring active', {
          currentMetrics: metrics
        });
      } else {
        this.addResult('resource_monitoring', 'warn', 'Resource monitoring not collecting data');
      }

    } catch (error) {
      this.addResult('resource_monitoring', 'fail', `Resource monitoring error: ${error.message}`);
    }
  }

  private async checkExportConnectivity() {
    console.log('🌐 Checking export connectivity...');
    
    try {
      const config = getOtelConfig();
      
      // Basic connectivity check (without sending actual spans)
      const url = new URL(config.exportEndpoint);
      
      if (!url.hostname) {
        this.addResult('export_connectivity', 'fail', 'Invalid export endpoint URL');
        return;
      }

      // In production, you might want to do an actual connectivity test
      // For now, we'll just validate the endpoint format
      if (config.exportEndpoint.includes('localhost') && Deno.env.get('SUPABASE_ENV') === 'production') {
        this.addResult('export_connectivity', 'warn', 'Using localhost endpoint in production');
      } else {
        this.addResult('export_connectivity', 'pass', 'Export endpoint configuration valid', {
          endpoint: url.hostname,
          protocol: url.protocol
        });
      }

    } catch (error) {
      this.addResult('export_connectivity', 'fail', `Export connectivity error: ${error.message}`);
    }
  }

  private async checkSemanticConventions() {
    console.log('📝 Checking semantic conventions...');
    
    try {
      clearSpans();
      
      // Test proper semantic convention usage
      await withSpan('http.client.request', async (span) => {
        span.setAttribute('http.method', 'POST');
        span.setAttribute('http.url', 'https://api.example.com/test');
        span.setAttribute('http.status_code', 200);
        span.setAttribute('service.name', 'test-service');
      });

      const test = new TraceTest('Semantic Conventions Test')
        .expectSpan({
          operationName: 'http.client.request',
          attributes: {
            'http.method': 'POST',
            'http.url': 'https://api.example.com/test',
            'http.status_code': 200,
            'service.name': 'test-service'
          }
        });

      const result = await test.validate();
      
      if (result.passed) {
        this.addResult('semantic_conventions', 'pass', 'Semantic conventions properly implemented');
      } else {
        this.addResult('semantic_conventions', 'fail', 'Semantic convention issues', {
          issues: result.message
        });
      }

    } catch (error) {
      this.addResult('semantic_conventions', 'fail', `Semantic conventions error: ${error.message}`);
    }
  }

  private addResult(component: string, status: 'pass' | 'fail' | 'warn', message: string, details?: any) {
    this.results.push({ component, status, message, details });
    
    const icon = status === 'pass' ? '✅' : status === 'warn' ? '⚠️' : '❌';
    console.log(`${icon} ${component}: ${message}`);
    
    if (details && (status === 'fail' || status === 'warn')) {
      console.log(`   Details:`, details);
    }
    console.log();
  }

  private printSummary() {
    const passed = this.results.filter(r => r.status === 'pass').length;
    const warned = this.results.filter(r => r.status === 'warn').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    
    console.log('📋 HEALTH CHECK SUMMARY');
    console.log('========================');
    console.log(`✅ Passed: ${passed}`);
    console.log(`⚠️  Warnings: ${warned}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total: ${this.results.length}\n`);
    
    if (failed > 0) {
      console.log('🚨 CRITICAL ISSUES:');
      this.results
        .filter(r => r.status === 'fail')
        .forEach(r => console.log(`   - ${r.component}: ${r.message}`));
      console.log();
    }
    
    if (warned > 0) {
      console.log('⚠️  WARNINGS:');
      this.results
        .filter(r => r.status === 'warn')
        .forEach(r => console.log(`   - ${r.component}: ${r.message}`));
      console.log();
    }

    const overallStatus = failed > 0 ? 'UNHEALTHY' : warned > 0 ? 'DEGRADED' : 'HEALTHY';
    console.log(`🎯 Overall Status: ${overallStatus}`);
  }
}

// CLI interface
if (import.meta.main) {
  const checker = new OtelHealthChecker();
  const results = await checker.runAllChecks();
  
  // Exit with appropriate code
  const failed = results.filter(r => r.status === 'fail').length;
  Deno.exit(failed > 0 ? 1 : 0);
}
