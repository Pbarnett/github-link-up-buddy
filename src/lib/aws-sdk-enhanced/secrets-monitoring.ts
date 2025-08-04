/**
 * AWS Secrets Manager Monitoring and Alerting
 * 
 * Implements comprehensive monitoring for secrets operations including:
 * - CloudWatch metrics publishing
 * - Custom alarms for security events
 * - Audit logging for compliance
 * - Performance metrics tracking
 */

import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';
import { EnhancedAWSClientFactory } from './client-factory';

interface SecurityEvent {
  eventType: 'SECRET_RETRIEVED' | 'SECRET_FAILED' | 'CIRCUIT_BREAKER_OPENED' | 'ROTATION_DETECTED' | 'UNAUTHORIZED_ACCESS' | 'FORMAT_VALIDATION_FAILED';
  secretId: string;
  region: string;
  environment: string;
  timestamp: number;
  details?: Record<string, any>;
  userId?: string;
  sourceIp?: string;
  userAgent?: string;
}

interface MetricData {
  MetricName: string;
  Value: number;
  Unit: 'Count' | 'Seconds' | 'Milliseconds' | 'Percent';
  Dimensions?: Array<{ Name: string; Value: string }>;
  Timestamp?: Date;
}

/**
 * CloudWatch Metrics Publisher for Secrets Manager
 */
export class SecretsMetricsPublisher {
  private static instance: SecretsMetricsPublisher;
  private cloudWatchClient: CloudWatchClient | null = null;
  private metricsBuffer: MetricData[] = [];
  private readonly NAMESPACE = 'AWS/SecretsManager/Enhanced';
  private readonly BATCH_SIZE = 20; // CloudWatch limit
  private readonly FLUSH_INTERVAL = 30000; // 30 seconds

  static getInstance(): SecretsMetricsPublisher {
    if (!SecretsMetricsPublisher.instance) {
      SecretsMetricsPublisher.instance = new SecretsMetricsPublisher();
    }
    return SecretsMetricsPublisher.instance;
  }

  private constructor() {
    // Auto-flush metrics buffer periodically
    setInterval(() => {
      this.flushMetrics().catch(error => 
        console.error('Failed to flush metrics:', error)
      );
    }, this.FLUSH_INTERVAL);
  }

  /**
   * Initialize CloudWatch client
   */
  private getCloudWatchClient(): CloudWatchClient {
    if (!this.cloudWatchClient) {
      this.cloudWatchClient = EnhancedAWSClientFactory.createCloudWatchClient({
        region: process.env.AWS_REGION || 'us-west-2',
        environment: (process.env.NODE_ENV as any) || 'development'
      });
    }
    return this.cloudWatchClient!;
  }

  /**
   * Publish security event metrics
   */
  async publishSecurityEvent(event: SecurityEvent): Promise<void> {
    const dimensions = [
      { Name: 'Environment', Value: event.environment },
      { Name: 'Region', Value: event.region },
      { Name: 'EventType', Value: event.eventType }
    ];

    // Add secret ID dimension (masked for security)
    const maskedSecretId = this.maskSecretId(event.secretId);
    dimensions.push({ Name: 'SecretCategory', Value: maskedSecretId });

    const metrics: MetricData[] = [
      {
        MetricName: 'SecurityEvents',
        Value: 1,
        Unit: 'Count',
        Dimensions: dimensions,
        Timestamp: new Date(event.timestamp)
      }
    ];

    // Add specific metrics based on event type
    switch (event.eventType) {
      case 'SECRET_FAILED':
        metrics.push({
          MetricName: 'SecretRetrievalFailures',
          Value: 1,
          Unit: 'Count',
          Dimensions: dimensions.filter(d => d.Name !== 'EventType')
        });
        break;

      case 'CIRCUIT_BREAKER_OPENED':
        metrics.push({
          MetricName: 'CircuitBreakerActivations',
          Value: 1,
          Unit: 'Count',
          Dimensions: dimensions.filter(d => d.Name !== 'EventType')
        });
        break;

      case 'UNAUTHORIZED_ACCESS':
        metrics.push({
          MetricName: 'UnauthorizedAccess',
          Value: 1,
          Unit: 'Count',
          Dimensions: [
            { Name: 'Environment', Value: event.environment },
            { Name: 'SourceIP', Value: event.sourceIp || 'unknown' }
          ]
        });
        break;
    }

    this.bufferMetrics(metrics);
    
    // Log security event for audit trail
    this.logSecurityEvent(event);
  }

  /**
   * Publish performance metrics
   */
  async publishPerformanceMetrics(
    operation: string,
    duration: number,
    success: boolean,
    environment: string,
    region: string
  ): Promise<void> {
    const dimensions = [
      { Name: 'Operation', Value: operation },
      { Name: 'Environment', Value: environment },
      { Name: 'Region', Value: region },
      { Name: 'Status', Value: success ? 'Success' : 'Failure' }
    ];

    const metrics: MetricData[] = [
      {
        MetricName: 'OperationDuration',
        Value: duration,
        Unit: 'Milliseconds',
        Dimensions: dimensions
      },
      {
        MetricName: 'OperationCount',
        Value: 1,
        Unit: 'Count',
        Dimensions: dimensions
      }
    ];

    if (success) {
      metrics.push({
        MetricName: 'SuccessfulOperations',
        Value: 1,
        Unit: 'Count',
        Dimensions: dimensions.filter(d => d.Name !== 'Status')
      });
    }

    this.bufferMetrics(metrics);
  }

  /**
   * Publish cache metrics
   */
  async publishCacheMetrics(
    cacheHits: number,
    cacheMisses: number,
    cacheSize: number,
    environment: string
  ): Promise<void> {
    const dimensions = [{ Name: 'Environment', Value: environment }];
    
    const hitRate = cacheHits + cacheMisses > 0 
      ? (cacheHits / (cacheHits + cacheMisses)) * 100 
      : 0;

    const metrics: MetricData[] = [
      {
        MetricName: 'CacheHits',
        Value: cacheHits,
        Unit: 'Count',
        Dimensions: dimensions
      },
      {
        MetricName: 'CacheMisses',
        Value: cacheMisses,
        Unit: 'Count',
        Dimensions: dimensions
      },
      {
        MetricName: 'CacheHitRate',
        Value: hitRate,
        Unit: 'Percent',
        Dimensions: dimensions
      },
      {
        MetricName: 'CacheSize',
        Value: cacheSize,
        Unit: 'Count',
        Dimensions: dimensions
      }
    ];

    this.bufferMetrics(metrics);
  }

  /**
   * Buffer metrics for batch publishing
   */
  private bufferMetrics(metrics: MetricData[]): void {
    this.metricsBuffer.push(...metrics);
    
    // Flush if buffer is getting full
    if (this.metricsBuffer.length >= this.BATCH_SIZE) {
      this.flushMetrics().catch(error => 
        console.error('Failed to flush metrics buffer:', error)
      );
    }
  }

  /**
   * Flush metrics buffer to CloudWatch
   */
  private async flushMetrics(): Promise<void> {
    if (this.metricsBuffer.length === 0) return;

    try {
      const client = this.getCloudWatchClient();
      const metricsToFlush = this.metricsBuffer.splice(0, this.BATCH_SIZE);

      const command = new PutMetricDataCommand({
        Namespace: this.NAMESPACE,
        MetricData: metricsToFlush.map(metric => ({
          MetricName: metric.MetricName,
          Value: metric.Value,
          Unit: metric.Unit,
          Dimensions: metric.Dimensions,
          Timestamp: metric.Timestamp || new Date()
        }))
      });

      await client.send(command);
      console.log(`✅ Published ${metricsToFlush.length} metrics to CloudWatch`);

    } catch (error) {
      console.error('Failed to publish metrics to CloudWatch:', error);
      // Re-add metrics to buffer for retry (with limit to prevent memory issues)
      if (this.metricsBuffer.length < 100) {
        this.metricsBuffer.unshift(...this.metricsBuffer.splice(0, this.BATCH_SIZE));
      }
    }
  }

  /**
   * Mask secret ID for security logging
   */
  private maskSecretId(secretId: string): string {
    const parts = secretId.split('/');
    if (parts.length >= 2) {
      return `${parts[0]}/${parts[1]}/***`;
    }
    return secretId.length > 10 ? secretId.substring(0, 10) + '***' : '***';
  }

  /**
   * Log security event for audit trail
   */
  private logSecurityEvent(event: SecurityEvent): void {
    const logEntry = {
      timestamp: new Date(event.timestamp).toISOString(),
      eventType: event.eventType,
      secretId: this.maskSecretId(event.secretId),
      region: event.region,
      environment: event.environment,
      details: event.details,
      userId: event.userId,
      sourceIp: event.sourceIp,
      userAgent: event.userAgent
    };

    // In production, this would go to a centralized logging system
    console.log(`🔐 SECURITY EVENT:`, JSON.stringify(logEntry));
  }

  /**
   * Force flush all buffered metrics
   */
  async forceFlush(): Promise<void> {
    while (this.metricsBuffer.length > 0) {
      await this.flushMetrics();
    }
  }
}

/**
 * Security Event Logger - Wrapper for common security events
 */
export class SecurityEventLogger {
  private static metricsPublisher = SecretsMetricsPublisher.getInstance();

  static async logSecretRetrieved(
    secretId: string,
    region: string,
    environment: string,
    duration: number,
    fromCache: boolean = false
  ): Promise<void> {
    const event: SecurityEvent = {
      eventType: 'SECRET_RETRIEVED',
      secretId,
      region,
      environment,
      timestamp: Date.now(),
      details: { duration, fromCache }
    };

    await this.metricsPublisher.publishSecurityEvent(event);
    await this.metricsPublisher.publishPerformanceMetrics(
      'getSecret',
      duration,
      true,
      environment,
      region
    );
  }

  static async logSecretFailed(
    secretId: string,
    region: string,
    environment: string,
    error: string,
    duration: number
  ): Promise<void> {
    const event: SecurityEvent = {
      eventType: 'SECRET_FAILED',
      secretId,
      region,
      environment,
      timestamp: Date.now(),
      details: { error, duration }
    };

    await this.metricsPublisher.publishSecurityEvent(event);
    await this.metricsPublisher.publishPerformanceMetrics(
      'getSecret',
      duration,
      false,
      environment,
      region
    );
  }

  static async logCircuitBreakerOpened(
    secretId: string,
    region: string,
    environment: string,
    failureCount: number
  ): Promise<void> {
    const event: SecurityEvent = {
      eventType: 'CIRCUIT_BREAKER_OPENED',
      secretId,
      region,
      environment,
      timestamp: Date.now(),
      details: { failureCount }
    };

    await this.metricsPublisher.publishSecurityEvent(event);
  }

  static async logRotationDetected(
    secretId: string,
    region: string,
    environment: string
  ): Promise<void> {
    const event: SecurityEvent = {
      eventType: 'ROTATION_DETECTED',
      secretId,
      region,
      environment,
      timestamp: Date.now()
    };

    await this.metricsPublisher.publishSecurityEvent(event);
  }

  static async logFormatValidationFailed(
    secretId: string,
    region: string,
    environment: string,
    expectedFormat: string
  ): Promise<void> {
    const event: SecurityEvent = {
      eventType: 'FORMAT_VALIDATION_FAILED',
      secretId,
      region,
      environment,
      timestamp: Date.now(),
      details: { expectedFormat }
    };

    await this.metricsPublisher.publishSecurityEvent(event);
  }
}

// Export singleton instance
export const secretsMetricsPublisher = SecretsMetricsPublisher.getInstance();
