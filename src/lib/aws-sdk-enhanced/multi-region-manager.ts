/**
 * Multi-Region AWS Service Manager
 *
 * Production-grade multi-region support with automatic failover
 * following AWS SDK v3 and Well-Architected Framework best practices.
 */

import { IS_MOCK_MODE } from '../aws-sdk-browser-compat';
import { EnhancedAWSClientFactory, Environment } from './client-factory';
import { EnhancedAWSErrorHandler, ErrorCategory } from './error-handling';

// Conditionally import AWS SDK commands based on environment
let KMSClient: any, S3Client: any, DynamoDBClient: any;
let EncryptCommand: any, DecryptCommand: any, DescribeKeyCommand: any;
let HeadBucketCommand: any, DescribeTableCommand: any;

if (!IS_MOCK_MODE) {
  ({
    KMSClient,
    EncryptCommand,
    DecryptCommand,
    DescribeKeyCommand,
  } = require('@aws-sdk/client-kms'));
  ({ S3Client, HeadBucketCommand } = require('@aws-sdk/client-s3'));
  ({
    DynamoDBClient,
    DescribeTableCommand,
  } = require('@aws-sdk/client-dynamodb'));
} else {
  // Mock clients and commands for browser environments
  KMSClient = class MockKMSClient {};
  S3Client = class MockS3Client {};
  DynamoDBClient = class MockDynamoDBClient {};

  EncryptCommand = class MockEncryptCommand {
    constructor(public input: any) {}
  };
  DecryptCommand = class MockDecryptCommand {
    constructor(public input: any) {}
  };
  DescribeKeyCommand = class MockDescribeKeyCommand {
    constructor(public input: any) {}
  };
  HeadBucketCommand = class MockHeadBucketCommand {
    constructor(public input: any) {}
  };
  DescribeTableCommand = class MockDescribeTableCommand {
    constructor(public input: any) {}
  };
}

// Region configuration interface
export interface RegionConfig {
  region: string;
  priority: number; // Lower numbers = higher priority
  enabled: boolean;
  healthCheckEndpoint?: string;
  maxLatencyMs?: number;
}

// Multi-region service configuration
export interface MultiRegionConfig {
  regions: RegionConfig[];
  environment: Environment;
  failoverStrategy: 'priority' | 'latency' | 'round-robin';
  healthCheckIntervalMs: number;
  maxFailoverAttempts: number;
  circuitBreakerConfig: {
    failureThreshold: number;
    timeoutMs: number;
    resetTimeoutMs: number;
  };
}

// Health check result
export interface RegionHealth {
  region: string;
  healthy: boolean;
  latencyMs: number;
  lastChecked: Date;
  consecutiveFailures: number;
  circuitBreakerState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  errorCount: number;
  requestCount: number;
}

// Operation result with region metadata
export interface RegionOperationResult<T> {
  result: T;
  region: string;
  latencyMs: number;
  attempt: number;
}

/**
 * Multi-Region AWS Service Manager
 *
 * Features:
 * - Automatic failover between regions
 * - Circuit breaker pattern implementation
 * - Health monitoring and region ranking
 * - Latency-based routing
 * - Comprehensive error handling
 * - Metrics collection for each region
 */
export class MultiRegionAWSManager {
  private regionClients: Map<string, any> = new Map();
  private regionHealth: Map<string, RegionHealth> = new Map();
  private healthCheckTimer?: NodeJS.Timeout;
  private config: MultiRegionConfig;
  private currentRegionIndex = 0;

  constructor(config: MultiRegionConfig) {
    this.config = config;
    this.initializeRegions();
    this.startHealthChecking();
  }

  /**
   * Initialize clients for all configured regions
   */
  private initializeRegions(): void {
    this.config.regions
      .filter(region => region.enabled)
      .forEach(regionConfig => {
        // Initialize health tracking
        this.regionHealth.set(regionConfig.region, {
          region: regionConfig.region,
          healthy: true,
          latencyMs: 0,
          lastChecked: new Date(),
          consecutiveFailures: 0,
          circuitBreakerState: 'CLOSED',
          errorCount: 0,
          requestCount: 0,
        });
      });
  }

  /**
   * Create KMS clients for all regions
   */
  createKMSClients(): Map<string, KMSClient> {
    const clients = new Map<string, KMSClient>();

    this.config.regions
      .filter(region => region.enabled)
      .forEach(regionConfig => {
        const client = EnhancedAWSClientFactory.createKMSClient({
          region: regionConfig.region,
          environment: this.config.environment,
          enableMetrics: true,
          enableLogging: this.config.environment !== 'production',
        });

        clients.set(regionConfig.region, client);
      });

    this.regionClients.set('kms', clients);
    return clients;
  }

  /**
   * Create S3 clients for all regions
   */
  createS3Clients(): Map<string, S3Client> {
    const clients = new Map<string, S3Client>();

    this.config.regions
      .filter(region => region.enabled)
      .forEach(regionConfig => {
        const client = EnhancedAWSClientFactory.createS3Client({
          region: regionConfig.region,
          environment: this.config.environment,
          enableMetrics: true,
          enableLogging: this.config.environment !== 'production',
        });

        clients.set(regionConfig.region, client);
      });

    this.regionClients.set('s3', clients);
    return clients;
  }

  /**
   * Create DynamoDB clients for all regions
   */
  createDynamoDBClients(): Map<string, DynamoDBClient> {
    const clients = new Map<string, DynamoDBClient>();

    this.config.regions
      .filter(region => region.enabled)
      .forEach(regionConfig => {
        const client = EnhancedAWSClientFactory.createDynamoDBClient({
          region: regionConfig.region,
          environment: this.config.environment,
          enableMetrics: true,
          enableLogging: this.config.environment !== 'production',
        });

        clients.set(regionConfig.region, client);
      });

    this.regionClients.set('dynamodb', clients);
    return clients;
  }

  /**
   * Execute operation with multi-region failover
   */
  async executeWithFailover<T>(
    service: 'kms' | 's3' | 'dynamodb',
    operation: (client: any) => Promise<T>,
    operationName: string
  ): Promise<RegionOperationResult<T>> {
    const clients = this.regionClients.get(service);
    if (!clients) {
      throw new Error(`No clients configured for service: ${service}`);
    }

    const availableRegions = this.getAvailableRegions();
    let lastError: Error | null = null;

    for (
      let attempt = 1;
      attempt <= this.config.maxFailoverAttempts;
      attempt++
    ) {
      const region = this.selectRegion(availableRegions, attempt);
      const client = clients.get(region);

      if (!client) {
        continue;
      }

      try {
        const startTime = Date.now();

        // Check circuit breaker
        if (!this.isRegionAvailable(region)) {
          continue;
        }

        // Execute operation with error handling
        const result = await EnhancedAWSErrorHandler.executeWithRetry(
          () => operation(client),
          service,
          operationName,
          { maxRetries: 2 } // Fewer retries per region, rely on region failover
        );

        const latencyMs = Date.now() - startTime;

        // Update region health on success
        this.updateRegionHealth(region, true, latencyMs);

        return {
          result,
          region,
          latencyMs,
          attempt,
        };
      } catch (error) {
        lastError = error as Error;

        // Update region health on failure
        this.updateRegionHealth(region, false, Date.now() - Date.now());

        // Check if error is retryable across regions
        const enhancedError = EnhancedAWSErrorHandler.analyzeError(
          error as Error,
          service,
          operationName
        );

        if (!this.shouldRetryInAnotherRegion(enhancedError)) {
          throw error;
        }

        console.warn(
          `Region ${region} failed for ${service}.${operationName}, attempting failover...`,
          {
            error: enhancedError.message,
            attempt,
            nextRegion:
              attempt < this.config.maxFailoverAttempts
                ? this.selectRegion(availableRegions, attempt + 1)
                : null,
          }
        );
      }
    }

    throw lastError || new Error('All regions failed for operation');
  }

  /**
   * KMS-specific multi-region operations
   */
  async kmsEncrypt(
    keyId: string,
    plaintext: string | Uint8Array,
    encryptionContext?: Record<string, string>
  ): Promise<RegionOperationResult<any>> {
    if (!this.regionClients.has('kms')) {
      this.createKMSClients();
    }

    return this.executeWithFailover(
      'kms',
      async (client: KMSClient) => {
        const command = new EncryptCommand({
          KeyId: keyId,
          Plaintext:
            typeof plaintext === 'string'
              ? new TextEncoder().encode(plaintext)
              : plaintext,
          EncryptionContext: encryptionContext,
        });

        return await client.send(command);
      },
      'encrypt'
    );
  }

  async kmsDecrypt(
    ciphertextBlob: Uint8Array,
    encryptionContext?: Record<string, string>
  ): Promise<RegionOperationResult<any>> {
    if (!this.regionClients.has('kms')) {
      this.createKMSClients();
    }

    return this.executeWithFailover(
      'kms',
      async (client: KMSClient) => {
        const command = new DecryptCommand({
          CiphertextBlob: ciphertextBlob,
          EncryptionContext: encryptionContext,
        });

        return await client.send(command);
      },
      'decrypt'
    );
  }

  async kmsDescribeKey(keyId: string): Promise<RegionOperationResult<any>> {
    if (!this.regionClients.has('kms')) {
      this.createKMSClients();
    }

    return this.executeWithFailover(
      'kms',
      async (client: KMSClient) => {
        const command = new DescribeKeyCommand({ KeyId: keyId });
        return await client.send(command);
      },
      'describe-key'
    );
  }

  /**
   * Get available regions sorted by strategy
   */
  private getAvailableRegions(): string[] {
    const healthyRegions = this.config.regions
      .filter(region => region.enabled && this.isRegionAvailable(region.region))
      .sort((a, b) => {
        switch (this.config.failoverStrategy) {
          case 'priority':
            return a.priority - b.priority;
          case 'latency':
            const healthA = this.regionHealth.get(a.region);
            const healthB = this.regionHealth.get(b.region);
            return (healthA?.latencyMs || 9999) - (healthB?.latencyMs || 9999);
          case 'round-robin':
            return 0; // Will be handled in selectRegion
          default:
            return a.priority - b.priority;
        }
      });

    return healthyRegions.map(r => r.region);
  }

  /**
   * Select region based on strategy and attempt number
   */
  private selectRegion(availableRegions: string[], attempt: number): string {
    if (availableRegions.length === 0) {
      throw new Error('No healthy regions available');
    }

    switch (this.config.failoverStrategy) {
      case 'round-robin':
        const index =
          (this.currentRegionIndex + attempt - 1) % availableRegions.length;
        return availableRegions[index];

      case 'priority':
      case 'latency':
      default:
        return availableRegions[
          Math.min(attempt - 1, availableRegions.length - 1)
        ];
    }
  }

  /**
   * Check if region is available (circuit breaker logic)
   */
  private isRegionAvailable(region: string): boolean {
    const health = this.regionHealth.get(region);
    if (!health) return false;

    const { circuitBreakerConfig } = this.config;

    switch (health.circuitBreakerState) {
      case 'OPEN':
        // Check if we should move to half-open
        const timeSinceLastFailure = Date.now() - health.lastChecked.getTime();
        if (timeSinceLastFailure > circuitBreakerConfig.resetTimeoutMs) {
          health.circuitBreakerState = 'HALF_OPEN';
          return true;
        }
        return false;

      case 'HALF_OPEN':
        return true; // Allow one request to test

      case 'CLOSED':
      default:
        return health.healthy;
    }
  }

  /**
   * Update region health based on operation result
   */
  private updateRegionHealth(
    region: string,
    success: boolean,
    latencyMs: number
  ): void {
    const health = this.regionHealth.get(region);
    if (!health) return;

    health.lastChecked = new Date();
    health.requestCount++;

    if (success) {
      health.healthy = true;
      health.latencyMs = this.calculateMovingAverage(
        health.latencyMs,
        latencyMs,
        10
      );
      health.consecutiveFailures = 0;

      // Reset circuit breaker if it was half-open
      if (health.circuitBreakerState === 'HALF_OPEN') {
        health.circuitBreakerState = 'CLOSED';
        health.errorCount = 0;
      }
    } else {
      health.healthy = false;
      health.errorCount++;
      health.consecutiveFailures++;

      // Check circuit breaker threshold
      const { circuitBreakerConfig } = this.config;
      if (health.consecutiveFailures >= circuitBreakerConfig.failureThreshold) {
        health.circuitBreakerState = 'OPEN';
      }
    }
  }

  /**
   * Calculate moving average for latency
   */
  private calculateMovingAverage(
    current: number,
    newValue: number,
    samples: number
  ): number {
    return (current * (samples - 1) + newValue) / samples;
  }

  /**
   * Determine if error should trigger region failover
   */
  private shouldRetryInAnotherRegion(error: any): boolean {
    // Don't retry in another region for these error categories
    const noRetryCategories = [
      ErrorCategory.VALIDATION,
      ErrorCategory.AUTHORIZATION,
      ErrorCategory.NOT_FOUND,
      ErrorCategory.CONFIGURATION,
    ];

    return !noRetryCategories.includes(error.category);
  }

  /**
   * Start health checking for all regions
   */
  private startHealthChecking(): void {
    this.healthCheckTimer = setInterval(() => {
      this.performHealthChecks();
    }, this.config.healthCheckIntervalMs);
  }

  /**
   * Perform health checks on all regions
   */
  private async performHealthChecks(): Promise<void> {
    const healthPromises = this.config.regions
      .filter(region => region.enabled)
      .map(async regionConfig => {
        try {
          const startTime = Date.now();

          // Use STS GetCallerIdentity as a lightweight health check
          const healthResult = await EnhancedAWSClientFactory.healthCheck({
            region: regionConfig.region,
            environment: this.config.environment,
          });

          const latencyMs = Date.now() - startTime;

          this.updateRegionHealth(
            regionConfig.region,
            healthResult.healthy,
            latencyMs
          );
        } catch (error) {
          this.updateRegionHealth(regionConfig.region, false, 0);
        }
      });

    await Promise.allSettled(healthPromises);
  }

  /**
   * Get current health status for all regions
   */
  getRegionHealth(): Map<string, RegionHealth> {
    return new Map(this.regionHealth);
  }

  /**
   * Get region statistics for monitoring
   */
  getRegionStatistics(): Record<string, any> {
    const stats: Record<string, any> = {};

    this.regionHealth.forEach((health, region) => {
      stats[region] = {
        healthy: health.healthy,
        latencyMs: health.latencyMs,
        consecutiveFailures: health.consecutiveFailures,
        circuitBreakerState: health.circuitBreakerState,
        errorRate:
          health.requestCount > 0 ? health.errorCount / health.requestCount : 0,
        requestCount: health.requestCount,
        lastChecked: health.lastChecked,
      };
    });

    return stats;
  }

  /**
   * Force region health refresh
   */
  async refreshRegionHealth(): Promise<void> {
    await this.performHealthChecks();
  }

  /**
   * Manually disable/enable a region
   */
  setRegionEnabled(region: string, enabled: boolean): void {
    const regionConfig = this.config.regions.find(r => r.region === region);
    if (regionConfig) {
      regionConfig.enabled = enabled;

      if (!enabled) {
        // Mark as unhealthy immediately
        this.updateRegionHealth(region, false, 0);
      }
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    // Destroy all clients
    this.regionClients.forEach(clientMap => {
      clientMap.forEach((client: any) => {
        if (client && typeof client.destroy === 'function') {
          client.destroy();
        }
      });
    });

    this.regionClients.clear();
    this.regionHealth.clear();
  }
}

// Default multi-region configurations for common patterns
export const createProductionMultiRegionConfig = (
  regions: string[]
): MultiRegionConfig => ({
  regions: regions.map((region, index) => ({
    region,
    priority: index + 1,
    enabled: true,
    maxLatencyMs: 5000,
  })),
  environment: 'production',
  failoverStrategy: 'priority',
  healthCheckIntervalMs: 30000, // 30 seconds
  maxFailoverAttempts: 3,
  circuitBreakerConfig: {
    failureThreshold: 5,
    timeoutMs: 60000,
    resetTimeoutMs: 300000, // 5 minutes
  },
});

export const createDevelopmentMultiRegionConfig = (
  regions: string[]
): MultiRegionConfig => ({
  regions: regions.map((region, index) => ({
    region,
    priority: index + 1,
    enabled: true,
    maxLatencyMs: 10000,
  })),
  environment: 'development',
  failoverStrategy: 'priority',
  healthCheckIntervalMs: 60000, // 1 minute
  maxFailoverAttempts: 2,
  circuitBreakerConfig: {
    failureThreshold: 3,
    timeoutMs: 30000,
    resetTimeoutMs: 180000, // 3 minutes
  },
});

// Convenience factory functions
export const createMultiRegionKMSManager = (
  regions: string[],
  environment: Environment = 'production'
) => {
  const config =
    environment === 'production'
      ? createProductionMultiRegionConfig(regions)
      : createDevelopmentMultiRegionConfig(regions);

  const manager = new MultiRegionAWSManager(config);
  manager.createKMSClients();
  return manager;
};
