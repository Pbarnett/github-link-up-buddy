#!/usr/bin/env deno run --allow-net --allow-env --allow-read

/**
 * OpenTelemetry Resource Monitoring and Performance Tuning Script
 * 
 * Monitors collector metrics and provides tuning recommendations
 * Based on OpenTelemetry specification requirements for resource optimization
 */

interface CollectorMetrics {
  exporterQueueSize: number;
  exporterQueueCapacity: number;
  batchSendSize: number;
  acceptedSpans: number;
  refusedSpans: number;
  memoryUsage: number;
  cpuUsage: number;
  exportLatency: number;
}

interface TuningRecommendation {
  component: string;
  current: number;
  recommended: number;
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

class ResourceMonitor {
  private metricsEndpoint: string;
  private alertThresholds = {
    queueUtilization: 0.8,
    refusedSpansRatio: 0.01,
    memoryUsage: 0.8,
    cpuUsage: 0.7,
    exportLatency: 5000 // ms
  };

  constructor(metricsEndpoint: string = 'http://localhost:8888/metrics') {
    this.metricsEndpoint = metricsEndpoint;
  }

  async fetchMetrics(): Promise<CollectorMetrics> {
    try {
      const response = await fetch(this.metricsEndpoint);
      const metricsText = await response.text();
      
      return this.parsePrometheusMetrics(metricsText);
    } catch {
      console.error('Failed to fetch collector metrics:', error);
      throw error;
    }
  }

  private parsePrometheusMetrics(metricsText: string): CollectorMetrics {
    const metrics: Partial<CollectorMetrics> = {};
    const lines = metricsText.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('#') || !line.trim()) continue;
      
      const [metricName, value] = line.split(' ');
      const numValue = parseFloat(value);
      
      if (metricName.includes('otelcol_exporter_queue_size')) {
        metrics.exporterQueueSize = numValue;
      } else if (metricName.includes('otelcol_exporter_queue_capacity')) {
        metrics.exporterQueueCapacity = numValue;
      } else if (metricName.includes('otelcol_processor_batch_batch_send_size')) {
        metrics.batchSendSize = numValue;
      } else if (metricName.includes('otelcol_receiver_accepted_spans')) {
        metrics.acceptedSpans = numValue;
      } else if (metricName.includes('otelcol_receiver_refused_spans')) {
        metrics.refusedSpans = numValue;
      } else if (metricName.includes('process_resident_memory_bytes')) {
        metrics.memoryUsage = numValue / (1024 * 1024); // Convert to MB
      } else if (metricName.includes('process_cpu_seconds_total')) {
        metrics.cpuUsage = numValue;
      } else if (metricName.includes('otelcol_exporter_sent_spans_duration')) {
        metrics.exportLatency = numValue;
      }
    }
    
    return {
      exporterQueueSize: metrics.exporterQueueSize || 0,
      exporterQueueCapacity: metrics.exporterQueueCapacity || 1000,
      batchSendSize: metrics.batchSendSize || 0,
      acceptedSpans: metrics.acceptedSpans || 0,
      refusedSpans: metrics.refusedSpans || 0,
      memoryUsage: metrics.memoryUsage || 0,
      cpuUsage: metrics.cpuUsage || 0,
      exportLatency: metrics.exportLatency || 0
    };
  }

  analyzeMetrics(metrics: CollectorMetrics): TuningRecommendation[] {
    const recommendations: TuningRecommendation[] = [];
    
    // Queue utilization analysis
    const queueUtilization = metrics.exporterQueueSize / metrics.exporterQueueCapacity
    if (queueUtilization > this.alertThresholds.queueUtilization) {
      recommendations.push({
        component: 'exporter.sending_queue.queue_size',
        current: metrics.exporterQueueCapacity,
        recommended: Math.ceil(metrics.exporterQueueCapacity * 1.5),
        reason: `Queue utilization at ${(queueUtilization * 100).toFixed(1)}% - risk of data loss`,
        priority: queueUtilization > 0.95 ? 'critical' : 'high'
      });
    }
    
    // Refused spans analysis
    const totalSpans = metrics.acceptedSpans + metrics.refusedSpans
    const refusedRatio = totalSpans > 0 ? metrics.refusedSpans / totalSpans : 0;
    if (refusedRatio > this.alertThresholds.refusedSpansRatio) {
      recommendations.push({
        component: 'processor.batch.send_batch_size',
        current: metrics.batchSendSize,
        recommended: Math.max(512, Math.ceil(metrics.batchSendSize * 0.8)),
        reason: `${(refusedRatio * 100).toFixed(2)}% spans refused - reduce batch size`,
        priority: 'high'
      });
    }
    
    // Memory usage analysis
    const memoryLimitMB = parseInt(Deno.env.get('OTEL_MEMORY_LIMIT_MIB') || '512');
    const memoryUtilization = metrics.memoryUsage / memoryLimitMB;
    if (memoryUtilization > this.alertThresholds.memoryUsage) {
      recommendations.push({
        component: 'processor.memory_limiter.limit_mib',
        current: memoryLimitMB,
        recommended: Math.ceil(memoryLimitMB * 1.25),
        reason: `Memory usage at ${(memoryUtilization * 100).toFixed(1)}% of limit`,
        priority: memoryUtilization > 0.9 ? 'critical' : 'medium'
      });
    }
    
    // Export latency analysis
    if (metrics.exportLatency > this.alertThresholds.exportLatency) {
      recommendations.push({
        component: 'exporter.sending_queue.num_consumers',
        current: 4, // Default from config
        recommended: 6,
        reason: `Export latency ${metrics.exportLatency.toFixed(0)}ms exceeds threshold`,
        priority: 'medium'
      });
    }
    
    return recommendations;
  }

  async generateReport(): Promise<void> {
    console.log('🔍 OpenTelemetry Resource Monitor Report');
    console.log('=' .repeat(50));
    console.log();
    
    try {
      const metrics = await this.fetchMetrics();
      const recommendations = this.analyzeMetrics(metrics);
      
      // Current metrics summary
      console.log('📊 Current Metrics:');
      console.log(`  Queue Utilization: ${((metrics.exporterQueueSize / metrics.exporterQueueCapacity) * 100).toFixed(1)}%`);
      console.log(`  Accepted Spans: ${metrics.acceptedSpans.toLocaleString()}`);
      console.log(`  Refused Spans: ${metrics.refusedSpans.toLocaleString()}`);
      console.log(`  Memory Usage: ${metrics.memoryUsage.toFixed(1)} MB`);
      console.log(`  Export Latency: ${metrics.exportLatency.toFixed(0)} ms`);
      console.log();
      
      // Health status
      const criticalIssues = recommendations.filter(r => r.priority === 'critical').length
      const highIssues = recommendations.filter(r => r.priority === 'high').length
      
      if (criticalIssues > 0) {
        console.log('🚨 CRITICAL: Immediate action required!');
      } else if (highIssues > 0) {
        console.log('⚠️  WARNING: Performance issues detected');
      } else if (recommendations.length > 0) {
        console.log('💡 INFO: Optimization opportunities available');
      } else {
        console.log('✅ HEALTHY: All metrics within acceptable ranges');
      }
      console.log();
      
      // Tuning recommendations
      if (recommendations.length > 0) {
        console.log('🔧 Tuning Recommendations:');
        recommendations.forEach((rec, index) => {
          const priorityIcon = {
            'critical': '🚨',
            'high': '⚠️ ',
            'medium': '💡',
            'low': 'ℹ️ '
          }[rec.priority];
          
          console.log(`  ${index + 1}. ${priorityIcon} ${rec.component}`);
          console.log(`     Current: ${rec.current}`);
          console.log(`     Recommended: ${rec.recommended}`);
          console.log(`     Reason: ${rec.reason}`);
          console.log();
        });
        
        console.log('📝 Configuration Updates:');
        console.log('Update your otel-collector.yaml with these values:');
        console.log();
        
        recommendations.forEach(rec => {
          if (rec.component.includes('queue_size')) {
            console.log(`exporters:`);
            console.log(`  otlp:`);
            console.log(`    sending_queue:`);
            console.log(`      queue_size: ${rec.recommended}`);
          } else if (rec.component.includes('batch_size')) {
            console.log(`processors:`);
            console.log(`  batch:`);
            console.log(`    send_batch_size: ${rec.recommended}`);
          } else if (rec.component.includes('memory_limiter')) {
            console.log(`processors:`);
            console.log(`  memory_limiter:`);
            console.log(`    limit_mib: ${rec.recommended}`);
          } else if (rec.component.includes('num_consumers')) {
            console.log(`exporters:`);
            console.log(`  otlp:`);
            console.log(`    sending_queue:`);
            console.log(`      num_consumers: ${rec.recommended}`);
          }
          console.log();
        });
      }
      
    } catch {
      console.error('❌ Failed to generate resource monitor report:', error);
      Deno.exit(1);
    }
  }

  async startContinuousMonitoring(intervalMinutes: number = 5): Promise<void> {
    console.log(`🔄 Starting continuous monitoring (${intervalMinutes} minute intervals)`);
    console.log('Press Ctrl+C to stop');
    console.log();
    
    const intervalMs = intervalMinutes * 60 * 1000;
    
    while (true) {
      await this.generateReport();
      console.log(`⏰ Next check in ${intervalMinutes} minutes...`);
      console.log('─'.repeat(50));
      console.log();
      
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }
}

// CLI Interface
async function main() {
  const args = Deno.args
  const command = args[0] || 'report';
  const metricsEndpoint = Deno.env.get('OTEL_METRICS_ENDPOINT') || 'http://localhost:8888/metrics';
  
  const monitor = new ResourceMonitor(metricsEndpoint);
  
  switch (command) {
    case 'report':
      await monitor.generateReport();
      break;
      
    case 'monitor': {
      const interval = parseInt(args[1]) || 5;
      await monitor.startContinuousMonitoring(interval);
      break;
    }
      
    case 'help':
      console.log('OpenTelemetry Resource Monitor');
      console.log();
      console.log('Usage:');
      console.log('  deno run otel-resource-monitor.ts [command] [options]');
      console.log();
      console.log('Commands:');
      console.log('  report         Generate one-time resource report (default)');
      console.log('  monitor [min]  Start continuous monitoring (default: 5 minutes)');
      console.log('  help          Show this help message');
      console.log();
      console.log('Environment Variables:');
      console.log('  OTEL_METRICS_ENDPOINT  Collector metrics endpoint (default: http://localhost:8888/metrics)');
      break;
      
    default:
      console.error(`Unknown command: ${command}`);
      console.error('Use "help" for usage information');
      Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
