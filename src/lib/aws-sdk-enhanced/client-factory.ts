/**
 * Enhanced AWS SDK Client Factory
 * 
 * Production-grade client factory implementation following AWS SDK v3 best practices
 * from AWS SDK Developer Guide and Tools Reference Guide.
 */

import { KMSClient, KMSClientConfig } from '@aws-sdk/client-kms';
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { STSClient, STSClientConfig } from '@aws-sdk/client-sts';
import { CloudWatchClient, CloudWatchClientConfig } from '@aws-sdk/client-cloudwatch';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { fromInstanceMetadata, fromEnv, fromContainerMetadata } from '@aws-sdk/credential-providers';
import https from 'https';

// Environment types for configuration optimization
export type Environment = 'development' | 'staging' | 'production';

// Client configuration interface following AWS best practices
export interface EnhancedClientConfig {
  region: string;
  environment: Environment;
  enableMetrics?: boolean;
  enableLogging?: boolean;
  enableTracing?: boolean;
  maxAttempts?: number;
  connectionTimeout?: number;
  socketTimeout?: number;
  maxSockets?: number;
  keepAlive?: boolean;
  credentialSource?: 'environment' | 'instance-metadata' | 'container-metadata' | 'auto';
}

// Default configurations optimized per environment
const DEFAULT_CONFIGS: Record<Environment, Partial<EnhancedClientConfig>> = {
  development: {
    maxAttempts: 2,
    connectionTimeout: 3000,
    socketTimeout: 10000,
    maxSockets: 10,
    keepAlive: true,
    enableLogging: true,
    enableMetrics: false,
  },
  staging: {
    maxAttempts: 3,
    connectionTimeout: 5000,
    socketTimeout: 20000,
    maxSockets: 25,
    keepAlive: true,
    enableLogging: true,
    enableMetrics: true,
  },
  production: {
    maxAttempts: 3,
    connectionTimeout: 5000,
    socketTimeout: 30000,
    maxSockets: 50,
    keepAlive: true,
    enableLogging: false,
    enableMetrics: true,
    enableTracing: true,
  },
};

/**
 * Enhanced AWS Client Factory following AWS SDK v3 best practices
 * 
 * Features:
 * - Environment-optimized configurations
 * - Proper credential provider chain
 * - Connection pooling and keep-alive
 * - Retry configuration with adaptive mode
 * - Custom HTTP handlers
 * - Comprehensive logging
 */
export class EnhancedAWSClientFactory {
  private static clientInstances: Map<string, any> = new Map();

  /**
   * Creates optimized HTTPS agent for connection pooling
   */
  private static createHttpsAgent(config: EnhancedClientConfig): https.Agent {
    return new https.Agent({
      keepAlive: config.keepAlive ?? true,
      keepAliveMsecs: 1000,
      maxSockets: config.maxSockets ?? 50,
      maxFreeSockets: Math.floor((config.maxSockets ?? 50) / 5),
      timeout: config.socketTimeout ?? 30000,
      freeSocketTimeout: 30000,
      // Enable TCP_NODELAY for better latency
      setNoDelay: true,
    });
  }

  /**
   * Creates credential provider following AWS precedence order
   */
  private static createCredentialProvider(config: EnhancedClientConfig) {
    const { credentialSource = 'auto', environment } = config;

    switch (credentialSource) {
      case 'instance-metadata':
        return fromInstanceMetadata({
          timeout: 1000,
          maxRetries: 3,
        });

      case 'container-metadata':
        return fromContainerMetadata({
          timeout: 1000,
          maxRetries: 3,
        });

      case 'environment':
        return fromEnv();

      case 'auto':
      default:
        // Follow AWS SDK credential provider chain
        // 1. Environment variables
        // 2. Container metadata (if available)
        // 3. Instance metadata (for EC2)
        if (environment === 'production') {
          // In production, prefer container/instance metadata for security
          return process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI
            ? fromContainerMetadata({ timeout: 1000, maxRetries: 3 })
            : fromInstanceMetadata({ timeout: 1000, maxRetries: 3 });
        } else {
          // In development/staging, use environment variables
          return fromEnv();
        }
    }
  }

  /**
   * Creates logger based on environment and configuration
   */
  private static createLogger(config: EnhancedClientConfig) {
    if (!config.enableLogging) return undefined;

    const logPrefix = `[AWS-${config.environment.toUpperCase()}]`;

    return {
      trace: (message: any) => console.trace(`${logPrefix} ${message}`),
      debug: (message: any) => console.debug(`${logPrefix} ${message}`),
      info: (message: any) => console.info(`${logPrefix} ${message}`),
      warn: (message: any) => console.warn(`${logPrefix} ${message}`),
      error: (message: any) => console.error(`${logPrefix} ${message}`),
    };
  }

  /**
   * Creates base AWS client configuration following SDK best practices
   */
  private static createBaseConfig(config: EnhancedClientConfig) {
    const mergedConfig = {
      ...DEFAULT_CONFIGS[config.environment],
      ...config,
    };

    const httpsAgent = this.createHttpsAgent(mergedConfig);
    const credentials = this.createCredentialProvider(mergedConfig);
    const logger = this.createLogger(mergedConfig);

    return {
      region: mergedConfig.region,
      credentials,
      maxAttempts: mergedConfig.maxAttempts,
      retryMode: 'adaptive' as const,
      requestHandler: new NodeHttpHandler({
        httpsAgent,
        connectionTimeout: mergedConfig.connectionTimeout,
        socketTimeout: mergedConfig.socketTimeout,
      }),
      logger,
    };
  }

  /**
   * Creates or retrieves cached KMS client
   */
  static createKMSClient(config: EnhancedClientConfig): KMSClient {
    const cacheKey = `kms-${config.region}-${config.environment}`;
    
    if (this.clientInstances.has(cacheKey)) {
      return this.clientInstances.get(cacheKey);
    }

    const baseConfig = this.createBaseConfig(config);
    const kmsConfig: KMSClientConfig = {
      ...baseConfig,
      serviceId: 'KMS',
      // KMS-specific optimizations
      endpoint: undefined, // Use default KMS endpoint
    };

    const client = new KMSClient(kmsConfig);
    this.clientInstances.set(cacheKey, client);

    return client;
  }

  /**
   * Creates or retrieves cached S3 client
   */
  static createS3Client(config: EnhancedClientConfig): S3Client {
    const cacheKey = `s3-${config.region}-${config.environment}`;
    
    if (this.clientInstances.has(cacheKey)) {
      return this.clientInstances.get(cacheKey);
    }

    const baseConfig = this.createBaseConfig(config);
    const s3Config: S3ClientConfig = {
      ...baseConfig,
      serviceId: 'S3',
      // S3-specific optimizations
      forcePathStyle: false, // Use virtual-hosted-style requests
      useAccelerateEndpoint: config.environment === 'production',
      maxAttempts: config.environment === 'production' ? 5 : 3, // S3 benefits from more retries
    };

    const client = new S3Client(s3Config);
    this.clientInstances.set(cacheKey, client);

    return client;
  }

  /**
   * Creates or retrieves cached DynamoDB client
   */
  static createDynamoDBClient(config: EnhancedClientConfig): DynamoDBClient {
    const cacheKey = `dynamodb-${config.region}-${config.environment}`;
    
    if (this.clientInstances.has(cacheKey)) {
      return this.clientInstances.get(cacheKey);
    }

    const baseConfig = this.createBaseConfig(config);
    const dynamoConfig: DynamoDBClientConfig = {
      ...baseConfig,
      serviceId: 'DynamoDB',
      // DynamoDB-specific optimizations
      maxAttempts: config.environment === 'production' ? 10 : 5, // DynamoDB benefits from aggressive retries
    };

    const client = new DynamoDBClient(dynamoConfig);
    this.clientInstances.set(cacheKey, client);

    return client;
  }

  /**
   * Creates or retrieves cached STS client
   */
  static createSTSClient(config: EnhancedClientConfig): STSClient {
    const cacheKey = `sts-${config.region}-${config.environment}`;
    
    if (this.clientInstances.has(cacheKey)) {
      return this.clientInstances.get(cacheKey);
    }

    const baseConfig = this.createBaseConfig(config);
    const stsConfig: STSClientConfig = {
      ...baseConfig,
      serviceId: 'STS',
      // STS-specific optimizations
      maxAttempts: 2, // STS operations should be fast
    };

    const client = new STSClient(stsConfig);
    this.clientInstances.set(cacheKey, client);

    return client;
  }

  /**
   * Creates or retrieves cached CloudWatch client
   */
  static createCloudWatchClient(config: EnhancedClientConfig): CloudWatchClient {
    const cacheKey = `cloudwatch-${config.region}-${config.environment}`;
    
    if (this.clientInstances.has(cacheKey)) {
      return this.clientInstances.get(cacheKey);
    }

    const baseConfig = this.createBaseConfig(config);
    const cwConfig: CloudWatchClientConfig = {
      ...baseConfig,
      serviceId: 'CloudWatch',
    };

    const client = new CloudWatchClient(cwConfig);
    this.clientInstances.set(cacheKey, client);

    return client;
  }

  /**
   * Creates multi-region client manager
   */
  static createMultiRegionClients<T>(
    clientType: 'kms' | 's3' | 'dynamodb' | 'sts' | 'cloudwatch',
    regions: string[],
    environment: Environment
  ): Map<string, T> {
    const clients = new Map<string, T>();

    regions.forEach(region => {
      const config: EnhancedClientConfig = {
        region,
        environment,
        enableMetrics: true,
        enableLogging: environment !== 'production',
      };

      let client: T;
      switch (clientType) {
        case 'kms':
          client = this.createKMSClient(config) as T;
          break;
        case 's3':
          client = this.createS3Client(config) as T;
          break;
        case 'dynamodb':
          client = this.createDynamoDBClient(config) as T;
          break;
        case 'sts':
          client = this.createSTSClient(config) as T;
          break;
        case 'cloudwatch':
          client = this.createCloudWatchClient(config) as T;
          break;
        default:
          throw new Error(`Unsupported client type: ${clientType}`);
      }

      clients.set(region, client);
    });

    return clients;
  }

  /**
   * Destroys all cached clients (for testing or cleanup)
   */
  static destroyAllClients(): void {
    for (const [key, client] of this.clientInstances) {
      if (client && typeof client.destroy === 'function') {
        client.destroy();
      }
    }
    this.clientInstances.clear();
  }

  /**
   * Health check for client connectivity
   */
  static async healthCheck(config: EnhancedClientConfig): Promise<{
    region: string;
    healthy: boolean;
    services: Record<string, boolean>;
    latency: Record<string, number>;
  }> {
    const results = {
      region: config.region,
      healthy: true,
      services: {} as Record<string, boolean>,
      latency: {} as Record<string, number>,
    };

    // Test STS (fastest service for connectivity check)
    try {
      const stsClient = this.createSTSClient(config);
      const startTime = Date.now();
      
      const { GetCallerIdentityCommand } = await import('@aws-sdk/client-sts');
      await stsClient.send(new GetCallerIdentityCommand({}));
      
      results.services.sts = true;
      results.latency.sts = Date.now() - startTime;
    } catch (error) {
      results.services.sts = false;
      results.healthy = false;
      results.latency.sts = -1;
    }

    return results;
  }
}

// Export types and default configurations
export { DEFAULT_CONFIGS };

// Convenience factory functions for common patterns
export const createProductionKMSClient = (region: string) => 
  EnhancedAWSClientFactory.createKMSClient({
    region,
    environment: 'production',
    enableMetrics: true,
    credentialSource: 'auto',
  });

export const createDevelopmentKMSClient = (region: string) => 
  EnhancedAWSClientFactory.createKMSClient({
    region,
    environment: 'development',
    enableLogging: true,
    credentialSource: 'environment',
  });

// Multi-region helper
export const createMultiRegionKMSClients = (regions: string[], environment: Environment) =>
  EnhancedAWSClientFactory.createMultiRegionClients<KMSClient>('kms', regions, environment);
