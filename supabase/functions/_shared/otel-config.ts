/**
 * OpenTelemetry Configuration and Resource Monitoring
 * 
 * Provides centralized configuration management and resource monitoring
 * for OpenTelemetry components following production best practices
 */

export interface OtelConfig {
  // Span processing configuration
  maxQueueSize: number;
  exportTimeoutMs: number;
  maxExportBatchSize: number;
  scheduledDelayMs: number;
  
  // Resource limits
  maxActiveSpans: number;
  maxCompletedSpans: number;
  spanRetentionMs: number;
  
  // Export configuration
  exportEndpoint: string;
  exportProtocol: 'http' | 'grpc';
  exportHeaders: Record<string, string>;
  
  // Sampling configuration
  samplingRatio: number;
  alwaysSampleErrors: boolean;
  
  // Security configuration
  useSecureTransport: boolean;
  validateCertificates: boolean;
}

/**
 * Environment-based configuration
 */
export function getOtelConfig(): OtelConfig {
  const env = Deno.env.get('SUPABASE_ENV') || 'development';
  
  const baseConfig: OtelConfig = {
    maxQueueSize: 2048,
    exportTimeoutMs: 30000,
    maxExportBatchSize: 512,
    scheduledDelayMs: 5000,
    maxActiveSpans: 1000,
    maxCompletedSpans: 100,
    spanRetentionMs: 300000, // 5 minutes
    exportEndpoint: Deno.env.get('OTEL_EXPORTER_OTLP_ENDPOINT') || 'http://localhost:4318/v1/traces',
    exportProtocol: 'http',
    exportHeaders: {},
    samplingRatio: 1.0, // 100% for development
    alwaysSampleErrors: true,
    useSecureTransport: true,
    validateCertificates: true
  };

  // Environment-specific overrides
  switch (env) {
    case 'production':
      return {
        ...baseConfig,
        maxQueueSize: 4096,
        maxExportBatchSize: 1024,
        scheduledDelayMs: 2000,
        samplingRatio: 0.1, // 10% sampling in production
        exportEndpoint: Deno.env.get('OTEL_EXPORTER_OTLP_ENDPOINT') || 'https://api.honeycomb.io/v1/traces',
        exportHeaders: {
          'x-honeycomb-team': Deno.env.get('HONEYCOMB_API_KEY') || '',
          'x-honeycomb-dataset': 'parker-flight-booking'
        }
      };
      
    case 'staging':
      return {
        ...baseConfig,
        samplingRatio: 0.5, // 50% sampling in staging
        scheduledDelayMs: 3000
      };
      
    default: // development
      return baseConfig;
  }
}

/**
 * Resource utilization monitoring
 */
export class OtelResourceMonitor {
  private config: OtelConfig;
  private metrics = {
    activeSpans: 0,
    completedSpans: 0,
    exportedSpans: 0,
    droppedSpans: 0,
    exportErrors: 0,
    memoryUsage: 0,
    lastExportTime: 0,
    exportDuration: 0
  };

  constructor(config: OtelConfig) {
    this.config = config;
    this.startMonitoring();
  }

  private startMonitoring() {
    // Monitor resource usage every 30 seconds
    setInterval(() => {
      this.checkResourceUsage();
    }, 30000);
  }

  private checkResourceUsage() {
    const memInfo = this.getMemoryUsage();
    this.metrics.memoryUsage = memInfo.heapUsed;

    // Check for potential issues
    if (this.metrics.activeSpans > this.config.maxActiveSpans * 0.8) {
      console.warn('[OTel Monitor] High active span count:', {
        activeSpans: this.metrics.activeSpans,
        maxAllowed: this.config.maxActiveSpans,
        recommendation: 'Consider increasing maxActiveSpans or reducing span creation rate'
      });
    }

    if (this.metrics.droppedSpans > 0) {
      console.warn('[OTel Monitor] Spans being dropped:', {
        droppedSpans: this.metrics.droppedSpans,
        recommendation: 'Increase queue size or export frequency'
      });
    }

    if (this.metrics.exportErrors > 0) {
      console.error('[OTel Monitor] Export errors detected:', {
        exportErrors: this.metrics.exportErrors,
        lastExportTime: this.metrics.lastExportTime,
        recommendation: 'Check export endpoint connectivity and authentication'
      });
    }

    // Log metrics periodically
    console.log('[OTel Monitor] Resource utilization:', {
      ...this.metrics,
      timestamp: new Date().toISOString()
    });
  }

  private getMemoryUsage() {
    // Deno memory usage approximation
    return {
      heapUsed: performance.memory?.usedJSHeapSize || 0,
      heapTotal: performance.memory?.totalJSHeapSize || 0
    };
  }

  // Methods to update metrics (called by span processor)
  incrementActiveSpans() { this.metrics.activeSpans++; }
  decrementActiveSpans() { this.metrics.activeSpans--; }
  incrementCompletedSpans() { this.metrics.completedSpans++; }
  incrementExportedSpans(count: number) { this.metrics.exportedSpans += count; }
  incrementDroppedSpans(count: number) { this.metrics.droppedSpans += count; }
  incrementExportErrors() { this.metrics.exportErrors++; }
  
  recordExport(duration: number) {
    this.metrics.lastExportTime = Date.now();
    this.metrics.exportDuration = duration;
  }

  getMetrics() {
    return { ...this.metrics };
  }
}

/**
 * Secure configuration validator
 */
export class OtelSecurityValidator {
  static validateConfig(config: OtelConfig): string[] {
    const issues: string[] = [];

    // Check for insecure transport in production
    if (Deno.env.get('SUPABASE_ENV') === 'production') {
      if (!config.useSecureTransport) {
        issues.push('Insecure transport detected in production environment');
      }
      
      if (!config.exportEndpoint.startsWith('https://')) {
        issues.push('Export endpoint should use HTTPS in production');
      }
    }

    // Check for exposed secrets in configuration
    const sensitiveKeys = ['api-key', 'token', 'secret', 'password'];
    for (const [key, value] of Object.entries(config.exportHeaders)) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        if (typeof value === 'string' && value.length > 0 && !value.startsWith('${')) {
          issues.push(`Potential hardcoded secret in export header: ${key}`);
        }
      }
    }

    // Validate sampling configuration
    if (config.samplingRatio < 0 || config.samplingRatio > 1) {
      issues.push('Sampling ratio must be between 0 and 1');
    }

    return issues;
  }

  static auditConfiguration(): void {
    const config = getOtelConfig();
    const issues = this.validateConfig(config);

    if (issues.length > 0) {
      console.error('[OTel Security] Configuration issues detected:', {
        issues,
        timestamp: new Date().toISOString(),
        environment: Deno.env.get('SUPABASE_ENV')
      });
    } else {
      console.log('[OTel Security] Configuration validation passed');
    }
  }
}

/**
 * Configuration hot-reload support
 */
export class OtelConfigManager {
  private config: OtelConfig;
  private callbacks: Array<(config: OtelConfig) => void> = [];

  constructor() {
    this.config = getOtelConfig();
    this.startConfigWatch();
  }

  private startConfigWatch() {
    // Watch for configuration changes (in production, this might come from a config service)
    // For now, we'll check for environment variable changes
    setInterval(() => {
      const newConfig = getOtelConfig();
      if (JSON.stringify(newConfig) !== JSON.stringify(this.config)) {
        console.log('[OTel Config] Configuration change detected');
        this.config = newConfig;
        this.notifyCallbacks();
      }
    }, 60000); // Check every minute
  }

  private notifyCallbacks() {
    this.callbacks.forEach(callback => {
      try {
        callback(this.config);
      } catch (error) {
        console.error('[OTel Config] Callback error:', error);
      }
    });
  }

  getConfig(): OtelConfig {
    return { ...this.config };
  }

  onConfigChange(callback: (config: OtelConfig) => void) {
    this.callbacks.push(callback);
  }

  // Manual configuration update for testing
  updateConfig(updates: Partial<OtelConfig>) {
    this.config = { ...this.config, ...updates };
    this.notifyCallbacks();
  }
}

// Global instances
export const otelConfig = new OtelConfigManager();
export const resourceMonitor = new OtelResourceMonitor(otelConfig.getConfig());

// Run security audit on startup
OtelSecurityValidator.auditConfiguration();
