/**
 * AWS Services Configuration
 * Enhanced integration with AWS optimization patterns from AWS_Optimization_Answers.md
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import {
  KMSClient,
  EncryptCommand,
  DecryptCommand,
  DescribeKeyCommand,
} from '@aws-sdk/client-kms';

import {
  CloudWatchClient,
  PutMetricDataCommand,
} from '@aws-sdk/client-cloudwatch';


// Environment configuration
const AWS_REGION = process.env.VITE_AWS_REGION || 'us-east-1';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ENABLE_XRAY = process.env.VITE_ENABLE_XRAY === 'true';
const ENABLE_METRICS = process.env.VITE_ENABLE_METRICS === 'true';

// AWS SDK Configuration with optimization
const awsConfig = {
  region: AWS_REGION,
  maxAttempts: 3,
  retryMode: 'adaptive' as const,
  requestHandler: {
    requestTimeout: 10000, // 10 seconds
    connectionTimeout: 5000, // 5 seconds
  },
};

// Initialize AWS clients with X-Ray tracing
let AWSXRay: any;
let captureAWS: any;

if (ENABLE_XRAY && typeof window === 'undefined') {
  try {
    AWSXRay = require('aws-xray-sdk-core');
    captureAWS = AWSXRay.captureAWS;
  } catch (error) {
    console.warn('X-Ray SDK not available, disabling tracing:', error);
  }
}

// Create AWS clients
const createDynamoDBClient = () => {
  const client = new DynamoDBClient(awsConfig);
  return captureAWS
    ? DynamoDBDocumentClient.from(captureAWS(client))
    : DynamoDBDocumentClient.from(client);
};

const createS3Client = () => {
  const client = new S3Client({
    ...awsConfig,
    useAccelerateEndpoint: true,
    useDualstackEndpoint: true,
  });
  return captureAWS ? captureAWS(client) : client;
};

const createSecretsManagerClient = () => {
  const client = new SecretsManagerClient(awsConfig);
  return captureAWS ? captureAWS(client) : client;
};

const createCloudWatchClient = () => {
  const client = new CloudWatchClient(awsConfig);
  return captureAWS ? captureAWS(client) : client;
};

const createKMSClient = () => {
  const client = new KMSClient(awsConfig);
  return captureAWS ? captureAWS(client) : client;
};

// Singleton instances
let dynamoDbClient: DynamoDBDocumentClient | null = null;
let s3Client: S3Client | null = null;
let secretsManagerClient: SecretsManagerClient | null = null;
let cloudWatchClient: CloudWatchClient | null = null;
let kmsClient: KMSClient | null = null;

// Lazy initialization of clients
export const getDynamoDBClient = (): DynamoDBDocumentClient => {
  if (!dynamoDbClient) {
    dynamoDbClient = createDynamoDBClient();
  }
  return dynamoDbClient;
};

export const getS3Client = (): S3Client => {
  if (!s3Client) {
    s3Client = createS3Client();
  }
  return s3Client!;
};

export const getSecretsManagerClient = (): SecretsManagerClient => {
  if (!secretsManagerClient) {
    secretsManagerClient = createSecretsManagerClient();
  }
  return secretsManagerClient!;
};

export const getCloudWatchClient = (): CloudWatchClient => {
  if (!cloudWatchClient) {
    cloudWatchClient = createCloudWatchClient();
  }
  return cloudWatchClient!;
};

export const getKMSClient = (): KMSClient => {
  if (!kmsClient) {
    kmsClient = createKMSClient();
  }
  return kmsClient!;
};

// KMS configuration with alias-based key access for rotation support
export const kmsConfig = {
  keyAlias: process.env.KMS_KEY_ALIAS || 'alias/github-link-buddy-encryption-key',
  region: AWS_REGION,
  rotationConfig: {
    enabled: true,
    rotationPeriodInDays: 365, // Annual rotation
    autoUpdateAlias: true
  }
};

// Application configuration from environment
export const appConfig = {
  aws: {
    region: AWS_REGION,
    dynamoDbTable:
      process.env.DYNAMODB_TABLE || 'github-link-buddy-links-production',
    s3Bucket: process.env.S3_BUCKET || 'github-link-buddy-primary-bucket',
    kmsKeyAlias: kmsConfig.keyAlias, // Use alias instead of direct key ID
    databaseSecretArn: process.env.DATABASE_SECRET_ARN,
    apiKeysSecretArn: process.env.API_KEYS_SECRET_ARN,
  },
  features: {
    enableXRay: ENABLE_XRAY,
    enableMetrics: ENABLE_METRICS,
    enableCaching: IS_PRODUCTION,
    enableEncryption: true,
  },
  performance: {
    cacheTimeout: 300, // 5 minutes
    queryTimeout: 10000, // 10 seconds
    batchSize: 25, // DynamoDB batch operations
    retryAttempts: 3,
  },
};

// Enhanced DynamoDB operations with metrics and error handling
export class DynamoDBService {
  private client: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName: string = appConfig.aws.dynamoDbTable) {
    this.client = getDynamoDBClient();
    this.tableName = tableName;
  }

  async getItem(id: string, userId?: string): Promise<any> {
    const startTime = Date.now();

    try {
      const command = new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': id,
        },
        Limit: 1,
      });

      const result = await this.client.send(command);

      // Record custom metrics
      this.recordMetric(
        'DynamoDB.GetItem.Duration',
        Date.now() - startTime
      );
      this.recordMetric('DynamoDB.GetItem.Success', 1);

      return result.Items?.[0] || null;
    } catch (error) {
      this.recordMetric('DynamoDB.GetItem.Error', 1);
      console.error('DynamoDB getItem error:', error);
      throw error;
    }
  }

  async putItem(item: any): Promise<void> {
    const startTime = Date.now();

    try {
      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          ...item,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

      await this.client.send(command);

      this.recordMetric(
        'DynamoDB.PutItem.Duration',
        Date.now() - startTime
      );
      this.recordMetric('DynamoDB.PutItem.Success', 1);
    } catch (error) {
      this.recordMetric('DynamoDB.PutItem.Error', 1);
      console.error('DynamoDB putItem error:', error);
      throw error;
    }
  }

  async queryByUser(
    userId: string, 
    limit: number = 50, 
    lastEvaluatedKey?: any
  ): Promise<{items: any[], lastKey?: any}> {
    const startTime = Date.now();

    try {
      const command = new QueryCommand({
        TableName: this.tableName,
        IndexName: 'UserIndex',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
        Limit: limit,
        ExclusiveStartKey: lastEvaluatedKey,
        ScanIndexForward: false, // Sort by creation date descending
      });

      const result = await this.client.send(command);

      this.recordMetric(
        'DynamoDB.QueryByUser.Duration',
        Date.now() - startTime
      );
      this.recordMetric('DynamoDB.QueryByUser.Success', 1);
      this.recordMetric(
        'DynamoDB.QueryByUser.ItemCount',
        result.Items?.length || 0
      );
      
      // Track pagination usage for monitoring
      if (lastEvaluatedKey) {
        this.recordMetric('DynamoDB.QueryByUser.PaginatedRequest', 1);
      }
      if (result.LastEvaluatedKey) {
        this.recordMetric('DynamoDB.QueryByUser.HasMoreResults', 1);
      }

      return {
        items: result.Items || [],
        lastKey: result.LastEvaluatedKey
      };
    } catch (error: any) {
      await this.recordMetric('DynamoDB.QueryByUser.Error', 1);
      console.error('DynamoDB queryByUser error:', error);
      throw new Error(`Failed to query user data: ${error?.message || 'Unknown error'}`);
    }
  }

  // Backward compatibility helper - returns only items (for existing code)
  async queryByUserLegacy(userId: string, limit: number = 50): Promise<any[]> {
    const result = await this.queryByUser(userId, limit);
    return result.items;
  }

  // Advanced paginated query with all items (use with caution for large datasets)
  async queryByUserAll(userId: string, batchSize: number = 50): Promise<any[]> {
    let allItems: any[] = [];
    let lastKey: any = undefined;
    let requestCount = 0;
    const maxRequests = 20; // Safety limit to prevent runaway queries

    do {
      const result = await this.queryByUser(userId, batchSize, lastKey);
      allItems.push(...result.items);
      lastKey = result.lastKey;
      requestCount++;
      
      // Safety check to prevent excessive API calls
      if (requestCount >= maxRequests) {
        console.warn(`Query for user ${userId} exceeded ${maxRequests} requests, stopping pagination`);
        this.recordMetric('DynamoDB.QueryByUser.MaxRequestsExceeded', 1);
        break;
      }
    } while (lastKey);

    this.recordMetric('DynamoDB.QueryByUser.TotalRequests', requestCount);
    this.recordMetric('DynamoDB.QueryByUser.TotalItems', allItems.length);

    return allItems;
  }

  private recordMetric(metricName: string, value: number): void {
    if (!ENABLE_METRICS) return;

    // Use batched metrics service instead of individual API calls
    const { metricsService } = require('../services/MetricsService');
    metricsService.addMetric(metricName, value, {
      namespace: 'GitHubLinkBuddy/Application',
      dimensions: [{ Name: 'Service', Value: 'DynamoDB' }]
    });
  }
}

// Enhanced S3 Service with multipart upload support and performance optimizations
export class S3Service {
  private client: S3Client;
  private bucketName: string;
  private readonly MULTIPART_THRESHOLD = 100 * 1024 * 1024; // 100MB
  private readonly PART_SIZE = 10 * 1024 * 1024; // 10MB per part
  private readonly MAX_CONCURRENT_PARTS = 5; // Parallel upload limit

  constructor(bucketName: string = appConfig.aws.s3Bucket) {
    this.client = getS3Client();
    this.bucketName = bucketName;
  }

  /**
   * Intelligent upload that automatically chooses between standard and multipart upload
   * based on file size and optimizes for Transfer Acceleration
   */
  async uploadFile(
    key: string,
    body: Buffer | Uint8Array | string,
    options: {
      contentType?: string;
      metadata?: Record<string, string>;
      useMultipart?: boolean;
      onProgress?: (progress: number) => void;
    } = {}
  ): Promise<string> {
    const startTime = Date.now();
    const bodyBuffer = Buffer.isBuffer(body) ? body : Buffer.from(body);
    const fileSize = bodyBuffer.length;

    try {
      // Track file size metrics
      this.recordMetric('S3.Upload.FileSize', fileSize, 'Bytes');

      // Decide upload strategy based on file size
      const useMultipart = options.useMultipart ?? (fileSize >= this.MULTIPART_THRESHOLD);
      
      let result: string;
      if (useMultipart) {
        this.recordMetric('S3.Upload.Strategy', 1, 'Count', { Strategy: 'Multipart' });
        result = await this.multipartUpload(key, bodyBuffer, options);
      } else {
        this.recordMetric('S3.Upload.Strategy', 1, 'Count', { Strategy: 'Standard' });
        result = await this.standardUpload(key, bodyBuffer, options);
      }

      const duration = Date.now() - startTime;
      this.recordMetric('S3.Upload.Duration', duration, 'Milliseconds');
      this.recordMetric('S3.Upload.Success', 1);
      
      // Calculate and track upload speed
      const speedMbps = (fileSize * 8) / (duration * 1000); // Megabits per second
      this.recordMetric('S3.Upload.Speed', speedMbps, 'Count/Second');

      return result;
    } catch (error) {
      this.recordMetric('S3.Upload.Error', 1);
      console.error('S3 upload error:', error);
      throw error;
    }
  }

  /**
   * Standard S3 upload for smaller files
   */
  private async standardUpload(
    key: string,
    body: Buffer,
    options: {
      contentType?: string;
      metadata?: Record<string, string>;
    }
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
      ContentType: options.contentType,
      ServerSideEncryption: 'aws:kms',
      SSEKMSKeyId: appConfig.aws.kmsKeyAlias,
      Metadata: {
        uploadedAt: new Date().toISOString(),
        service: 'github-link-buddy',
        uploadStrategy: 'standard',
        ...options.metadata,
      },
    });

    await this.client.send(command);
    return this.getObjectUrl(key);
  }

  /**
   * Multipart upload for large files with progress tracking and parallel uploads
   */
  private async multipartUpload(
    key: string,
    body: Buffer,
    options: {
      contentType?: string;
      metadata?: Record<string, string>;
      onProgress?: (progress: number) => void;
    }
  ): Promise<string> {
    const fileSize = body.length;
    let uploadId: string | undefined;

    try {
      // Step 1: Initialize multipart upload
      const createCommand = new CreateMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: options.contentType,
        ServerSideEncryption: 'aws:kms',
        SSEKMSKeyId: appConfig.aws.kmsKeyAlias,
        Metadata: {
          uploadedAt: new Date().toISOString(),
          service: 'github-link-buddy',
          uploadStrategy: 'multipart',
          ...options.metadata,
        },
      });

      const createResponse = await this.client.send(createCommand);
      uploadId = createResponse.UploadId!;
      this.recordMetric('S3.Multipart.Initiated', 1);

      // Step 2: Calculate parts
      const numParts = Math.ceil(fileSize / this.PART_SIZE);
      const parts: Array<{ ETag: string; PartNumber: number }> = [];
      
      // Step 3: Upload parts with concurrency control
      const uploadPromises: Promise<void>[] = [];
      let completedParts = 0;

      for (let partNumber = 1; partNumber <= numParts; partNumber++) {
        const start = (partNumber - 1) * this.PART_SIZE;
        const end = Math.min(start + this.PART_SIZE, fileSize);
        const partBody = body.subarray(start, end);

        const uploadPartPromise = this.uploadPart(
          uploadId,
          key,
          partNumber,
          partBody
        ).then((etag) => {
          parts[partNumber - 1] = { ETag: etag, PartNumber: partNumber };
          completedParts++;
          
          // Report progress
          if (options.onProgress) {
            const progress = (completedParts / numParts) * 100;
            options.onProgress(progress);
          }
        });

        uploadPromises.push(uploadPartPromise);

        // Control concurrency
        if (uploadPromises.length >= this.MAX_CONCURRENT_PARTS) {
          await Promise.all(uploadPromises);
          uploadPromises.length = 0; // Clear the array
        }
      }

      // Wait for remaining uploads
      await Promise.all(uploadPromises);

      // Step 4: Complete multipart upload
      const completeCommand = new CompleteMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts,
        },
      });

      await this.client.send(completeCommand);
      this.recordMetric('S3.Multipart.Completed', 1);
      this.recordMetric('S3.Multipart.PartsCount', numParts);

      return this.getObjectUrl(key);
    } catch (error) {
      // Clean up failed multipart upload
      if (uploadId) {
        try {
          await this.client.send(
            new AbortMultipartUploadCommand({
              Bucket: this.bucketName,
              Key: key,
              UploadId: uploadId,
            })
          );
          this.recordMetric('S3.Multipart.Aborted', 1);
        } catch (abortError) {
          console.warn('Failed to abort multipart upload:', abortError);
        }
      }
      this.recordMetric('S3.Multipart.Error', 1);
      throw error;
    }
  }

  /**
   * Upload a single part of a multipart upload
   */
  private async uploadPart(
    uploadId: string,
    key: string,
    partNumber: number,
    body: Buffer
  ): Promise<string> {
    const command = new UploadPartCommand({
      Bucket: this.bucketName,
      Key: key,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: body,
    });

    const response = await this.client.send(command);
    return response.ETag!;
  }

  /**
   * Download file with enhanced error handling and metrics
   */
  async downloadFile(key: string): Promise<string> {
    const startTime = Date.now();

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.client.send(command);
      const content = (await response.Body?.transformToString()) || '';

      const duration = Date.now() - startTime;
      this.recordMetric('S3.Download.Duration', duration, 'Milliseconds');
      this.recordMetric('S3.Download.Success', 1);
      this.recordMetric('S3.Download.Size', content.length, 'Bytes');

      return content;
    } catch (error) {
      this.recordMetric('S3.Download.Error', 1);
      console.error('S3 download error:', error);
      throw error;
    }
  }

  /**
   * Check if file exists and get metadata
   */
  async fileExists(key: string): Promise<{ exists: boolean; size?: number; lastModified?: Date }> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.client.send(command);
      this.recordMetric('S3.HeadObject.Success', 1);
      
      return {
        exists: true,
        size: response.ContentLength,
        lastModified: response.LastModified,
      };
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return { exists: false };
      }
      this.recordMetric('S3.HeadObject.Error', 1);
      throw error;
    }
  }

  /**
   * Generate optimized object URL considering Transfer Acceleration
   */
  private getObjectUrl(key: string): string {
    // Use Transfer Acceleration endpoint for faster downloads
    return `https://${this.bucketName}.s3-accelerate.amazonaws.com/${key}`;
  }

  /**
   * Get presigned URL for direct client uploads (leverages Transfer Acceleration)
   */
  async getPresignedUploadUrl(
    key: string,
    expiresIn: number = 3600,
    options: {
      contentType?: string;
      maxSize?: number;
    } = {}
  ): Promise<string> {
    // Note: Presigned URLs would require additional implementation with @aws-sdk/s3-request-presigner
    // This is a placeholder for the method signature
    throw new Error('Presigned URL generation requires @aws-sdk/s3-request-presigner');
  }

  private recordMetric(metricName: string, value: number, unit: string = 'Count', dimensions: Record<string, string> = {}): void {
    if (!ENABLE_METRICS) return;

    // Use batched metrics service instead of individual API calls
    const { metricsService } = require('../services/MetricsService');
    metricsService.addMetric(metricName, value, {
      namespace: 'GitHubLinkBuddy/Application',
      unit: unit,
      dimensions: [
        { Name: 'Service', Value: 'S3' },
        { Name: 'Bucket', Value: this.bucketName },
        ...Object.entries(dimensions).map(([Name, Value]) => ({ Name, Value }))
      ]
    });
  }
}

// Cache entry interface with access tracking
interface CacheEntry {
  value: any;
  expiry: number;
  accessCount: number;
  lastAccessed: number;
  createdAt: number;
}

// Secrets Manager Service for secure configuration with optimized caching
export class SecretsManagerService {
  private client: SecretsManagerClient;
  private cache = new Map<string, CacheEntry>();
  private readonly MAX_CACHE_SIZE = 100;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private cleanupInterval: NodeJS.Timeout | null = null;
  private metrics = {
    hits: 0,
    misses: 0,
    evictions: 0,
    errors: 0,
  };

  constructor() {
    this.client = getSecretsManagerClient();
    this.startPeriodicCleanup();
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    let removedCount = 0;

    // Remove expired entries
    const keysToRemove: string[] = [];
    this.cache.forEach((entry, key) => {
      if (now > entry.expiry) {
        this.secureClear(entry);
        keysToRemove.push(key);
        removedCount++;
      }
    });
    
    keysToRemove.forEach(key => this.cache.delete(key));

    // LRU cleanup if cache is still too large
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const sortedEntries: Array<[string, CacheEntry]> = [];
      this.cache.forEach((entry, key) => {
        sortedEntries.push([key, entry]);
      });
      
      sortedEntries.sort(([,a], [,b]) => {
        // Sort by access count first, then by last accessed time
        if (a.accessCount !== b.accessCount) {
          return a.accessCount - b.accessCount;
        }
        return a.lastAccessed - b.lastAccessed;
      });

      const toRemove = sortedEntries.slice(0, this.cache.size - this.MAX_CACHE_SIZE);
      toRemove.forEach(([key, entry]) => {
        this.secureClear(entry);
        this.cache.delete(key);
        removedCount++;
        this.metrics.evictions++;
      });
    }

    if (removedCount > 0) {
      console.log(`SecretsManager cache: Cleaned up ${removedCount} entries`);
    }
  }

  private startPeriodicCleanup(): void {
    // Run cleanup every 2 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredEntries();
    }, 2 * 60 * 1000);
  }

  private secureClear(entry: CacheEntry): void {
    // Clear sensitive data from memory when removing from cache
    if (typeof entry.value === 'string') {
      // Overwrite string data (limited effectiveness in JS)
      entry.value = '0'.repeat(entry.value.length);
    } else if (typeof entry.value === 'object' && entry.value) {
      // Clear object properties
      Object.keys(entry.value).forEach(key => {
        if (typeof entry.value[key] === 'string') {
          entry.value[key] = '';
        }
      });
    }
  }

  async getSecret(secretArn: string, useCache: boolean = true, ttl?: number): Promise<any> {
    // Check cache first
    if (useCache) {
      const cached = this.cache.get(secretArn);
      if (cached) {
        const now = Date.now();
        
        // Check if entry has expired
        if (now > cached.expiry) {
          this.secureClear(cached);
          this.cache.delete(secretArn);
        } else {
          // Update access statistics
          cached.accessCount++;
          cached.lastAccessed = now;
          this.metrics.hits++;
          return cached.value;
        }
      }
    }

    this.metrics.misses++;
    const startTime = Date.now();

    try {
      const command = new GetSecretValueCommand({
        SecretId: secretArn,
      });

      const response = await this.client.send(command);
      const secretValue = response.SecretString
        ? JSON.parse(response.SecretString)
        : null;

      // Cache the result
      if (useCache && secretValue) {
        // Clean up before adding new entry
        this.cleanupExpiredEntries();
        
        const now = Date.now();
        const cacheEntry: CacheEntry = {
          value: secretValue,
          expiry: now + (ttl || this.DEFAULT_TTL),
          accessCount: 1,
          lastAccessed: now,
          createdAt: now,
        };
        
        this.cache.set(secretArn, cacheEntry);
      }

      this.recordMetric(
        'SecretsManager.GetSecret.Duration',
        Date.now() - startTime
      );
      this.recordMetric('SecretsManager.GetSecret.Success', 1);

      return secretValue;
    } catch (error) {
      this.metrics.errors++;
      this.recordMetric('SecretsManager.GetSecret.Error', 1);
      console.error('Secrets Manager error:', error);
      throw error;
    }
  }

  public invalidateSecret(secretArn: string): boolean {
    const entry = this.cache.get(secretArn);
    if (entry) {
      this.secureClear(entry);
      return this.cache.delete(secretArn);
    }
    return false;
  }

  public clearCache(): void {
    this.cache.forEach((entry) => {
      this.secureClear(entry);
    });
    this.cache.clear();
  }

  public getCacheStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    metrics: {
      hits: number;
      misses: number;
      evictions: number;
      errors: number;
    };
  } {
    const total = this.metrics.hits + this.metrics.misses;
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      hitRate: total > 0 ? (this.metrics.hits / total) * 100 : 0,
      metrics: { ...this.metrics },
    };
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clearCache();
  }

  async getDatabaseCredentials(): Promise<any> {
    if (!appConfig.aws.databaseSecretArn) {
      throw new Error('Database secret ARN not configured');
    }
    return this.getSecret(appConfig.aws.databaseSecretArn);
  }

  async getAPIKeys(): Promise<any> {
    if (!appConfig.aws.apiKeysSecretArn) {
      throw new Error('API keys secret ARN not configured');
    }
    return this.getSecret(appConfig.aws.apiKeysSecretArn);
  }

  private recordMetric(metricName: string, value: number): void {
    if (!ENABLE_METRICS) return;

    // Use batched metrics service instead of individual API calls
    const { metricsService } = require('../services/MetricsService');
    metricsService.addMetric(metricName, value, {
      namespace: 'GitHubLinkBuddy/Application',
      dimensions: [{ Name: 'Service', Value: 'SecretsManager' }]
    });
  }

  // Ensure cleanup on process termination
  private static setupGracefulShutdown(instance: SecretsManagerService): void {
    const cleanup = () => {
      console.log('Cleaning up SecretsManager cache...');
      instance.destroy();
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('exit', cleanup);
  }
}

// KMS Service for encryption/decryption with rotation support
export class KMSService {
  private client: KMSClient;
  private keyAlias: string;

  constructor() {
    this.client = getKMSClient();
    this.keyAlias = kmsConfig.keyAlias;
  }

  async encrypt(plaintext: string): Promise<string> {
    const startTime = Date.now();

    try {
      const command = new EncryptCommand({
        KeyId: this.keyAlias, // Always use alias for rotation support
        Plaintext: Buffer.from(plaintext, 'utf8')
      });
      
      const result = await this.client.send(command);
      const encryptedData = Buffer.from(result.CiphertextBlob!).toString('base64');

      this.recordMetric('KMS.Encrypt.Duration', Date.now() - startTime);
      this.recordMetric('KMS.Encrypt.Success', 1);

      return encryptedData;
    } catch (error) {
      this.recordMetric('KMS.Encrypt.Error', 1);
      console.error('KMS encryption failed:', error);
      throw new Error('Encryption operation failed');
    }
  }

  async decrypt(ciphertextBlob: string): Promise<string> {
    const startTime = Date.now();

    try {
      const command = new DecryptCommand({
        CiphertextBlob: Buffer.from(ciphertextBlob, 'base64')
        // Note: No KeyId needed for decryption - KMS automatically uses the correct key
      });
      
      const result = await this.client.send(command);
      const decryptedData = Buffer.from(result.Plaintext!).toString('utf8');

      this.recordMetric('KMS.Decrypt.Duration', Date.now() - startTime);
      this.recordMetric('KMS.Decrypt.Success', 1);

      return decryptedData;
    } catch (error) {
      this.recordMetric('KMS.Decrypt.Error', 1);
      console.error('KMS decryption failed:', error);
      throw new Error('Decryption operation failed');
    }
  }

  async getKeyInfo(): Promise<any> {
    const startTime = Date.now();

    try {
      const command = new DescribeKeyCommand({
        KeyId: this.keyAlias
      });
      
      const result = await this.client.send(command);

      this.recordMetric('KMS.DescribeKey.Duration', Date.now() - startTime);
      this.recordMetric('KMS.DescribeKey.Success', 1);

      return result;
    } catch (error) {
      this.recordMetric('KMS.DescribeKey.Error', 1);
      console.error('Failed to get key info:', error);
      throw error;
    }
  }

  async validateKeyRotation(): Promise<boolean> {
    try {
      const keyInfo = await this.getKeyInfo();
      const keyRotationEnabled = keyInfo.KeyMetadata?.KeyRotationStatus === 'Enabled';
      
      this.recordMetric('KMS.RotationStatus', keyRotationEnabled ? 1 : 0);
      
      if (!keyRotationEnabled) {
        console.warn('KMS key rotation is not enabled for:', this.keyAlias);
      }
      
      return keyRotationEnabled;
    } catch (error) {
      console.error('Failed to validate key rotation:', error);
      return false;
    }
  }

  private recordMetric(metricName: string, value: number): void {
    if (!ENABLE_METRICS) return;

    // Use batched metrics service instead of individual API calls
    const { metricsService } = require('../services/MetricsService');
    metricsService.addMetric(metricName, value, {
      namespace: 'GitHubLinkBuddy/Application',
      dimensions: [
        { Name: 'Service', Value: 'KMS' },
        { Name: 'KeyAlias', Value: this.keyAlias }
      ]
    });
  }
}


// Singleton instances for services
export const dynamoDBService = new DynamoDBService();
export const s3Service = new S3Service();
export const secretsManagerService = new SecretsManagerService();
export const kmsService = new KMSService();

// Health check function for ALB/API Gateway
export const healthCheck = async (): Promise<{
  status: string;
  timestamp: string;
  services: any;
}> => {
  const services = {
    dynamodb: 'unknown',
    s3: 'unknown',
    secretsManager: 'unknown',
    cloudwatch: 'unknown',
  };

  try {
    // Test DynamoDB connection
    await getDynamoDBClient().send(
      new QueryCommand({
        TableName: appConfig.aws.dynamoDbTable,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: { ':id': 'health-check' },
        Limit: 1,
      })
    );
    services.dynamodb = 'healthy';
  } catch (error) {
    services.dynamodb = 'unhealthy';
  }

  try {
    // Test CloudWatch (metrics service)
    const { metricsService } = require('../services/MetricsService');
    metricsService.addMetric('HealthCheck.Status', 1);
    services.cloudwatch = 'healthy';
  } catch (error) {
    services.cloudwatch = 'unhealthy';
  }

  return {
    status: Object.values(services).every(status => status === 'healthy')
      ? 'healthy'
      : 'degraded',
    timestamp: new Date().toISOString(),
    services,
  };
};

export default {
  appConfig,
  kmsConfig,
  dynamoDBService,
  s3Service,
  secretsManagerService,
  kmsService,
  healthCheck,
};
