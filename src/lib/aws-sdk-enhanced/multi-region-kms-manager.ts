import * as crypto from 'crypto';
import { Agent } from 'https';
import {
  KMSClient,
  CreateKeyCommand,
  CreateAliasCommand,
  ReplicateKeyCommand,
  GenerateDataKeyCommand,
  DecryptCommand,
  DescribeKeyCommand,
  EnableKeyRotationCommand,
  GetKeyRotationStatusCommand,
  DisableKeyRotationCommand,
  ListAliasesCommand,
} from '@aws-sdk/client-kms';
// Types and interfaces
export interface EncryptedData {
  encryptedData: Buffer;
  encryptedDataKey: Buffer;
  authTag: Buffer;
  iv: Buffer;
  keyId: string;
  keyType: KeyType;
  region: string;
  algorithm: string;
}

export interface CachedDataKey {
  plaintextKey: Buffer;
  encryptedKey: Buffer;
  createdAt: number;
  usageCount: number;
  keyId: string;
  region: string;
}

export interface CircuitBreakerState {
  failures: number;
  lastFailure: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  nextAttempt: number;
}

export interface KMSOperationMetrics {
  region: string;
  operation: string;
  success: boolean;
  duration: number;
  error?: string;
  retryCount: number;
}

export type KeyType = 'general' | 'pii' | 'payment';

/**
 * Enhanced Multi-Region KMS Manager
 * 
 * Features:
 * - Multi-Region Keys (MRKs) for seamless failover
 * - Data key caching to reduce KMS API calls
 * - Circuit breaker pattern for region failover
 * - Comprehensive error handling and retry logic
 * - Automatic key rotation management
 * - Rate limiting optimization
 */
export class MultiRegionKMSManager {
  private regions = ['us-east-1', 'us-west-2', 'eu-west-1'];
  private primaryRegion = 'us-east-1';
  private keyAliases = {
    general: 'alias/parker-flight-general-production',
    pii: 'alias/parker-flight-pii-production',
    payment: 'alias/parker-flight-payment-production'
  };
  
  private clients = new Map<string, KMSClient>();
  private keyCache = new Map<string, string>(); // alias -> keyId mapping
  private dataKeyCache = new Map<string, CachedDataKey>();
  private circuitBreakers = new Map<string, CircuitBreakerState>();
  private metrics: KMSOperationMetrics[] = [];
  
  // Configuration constants
  private readonly MAX_RETRIES = 5;
  private readonly BASE_DELAY = 1000; // 1 second
  private readonly MAX_DELAY = 30000; // 30 seconds
  private readonly DATA_KEY_TTL = 300000; // 5 minutes
  private readonly MAX_ENCRYPTIONS_PER_KEY = 1000;
  private readonly CIRCUIT_BREAKER_THRESHOLD = 3;
  private readonly CIRCUIT_BREAKER_TIMEOUT = 60000; // 1 minute

  constructor() {
    this.initializeClients();
  }

  /**
   * Initialize KMS clients for all regions with optimized configuration
   */
  private initializeClients(): void {
    this.regions.forEach(region => {
      this.clients.set(region, new KMSClient({
        region,
        maxAttempts: this.MAX_RETRIES,
        retryMode: 'adaptive'
      }));
    });
  }

  /**
   * Create Multi-Region Keys for all key types
   */
  async createMultiRegionKeys(): Promise<void> {
    const keySpecs = [
      { 
        type: 'general' as KeyType, 
        description: 'General purpose encryption for Parker Flight services' 
      },
      { 
        type: 'pii' as KeyType, 
        description: 'PII data encryption for Parker Flight user data' 
      },
      { 
        type: 'payment' as KeyType, 
        description: 'Payment data encryption for Parker Flight transactions' 
      }
    ];

    for (const spec of keySpecs) {
      try {
        await this.createMRK(spec.type, spec.description);
        console.log(`Successfully created MRK for ${spec.type}`);
      } catch (error) {
        console.error(`Failed to create MRK for ${spec.type}:`, error);
        throw error;
      }
    }
  }

  /**
   * Create a Multi-Region Key with replicas in all regions
   */
  private async createMRK(keyType: KeyType, description: string): Promise<string> {
    const primaryClient = this.clients.get(this.primaryRegion)!;
    
    return await this.executeWithRetry(async () => {
      // Create MRK in primary region
      const createKeyCommand = new CreateKeyCommand({
        Description: description,
        KeyUsage: 'ENCRYPT_DECRYPT',
        KeySpec: 'SYMMETRIC_DEFAULT',
        MultiRegion: true, // Critical: This enables MRK
        Policy: this.generateKeyPolicy(keyType)
      });

      const keyResult = await primaryClient.send(createKeyCommand);
      const keyId = keyResult.KeyMetadata!.KeyId!;

      // Create alias in primary region
      await primaryClient.send(new CreateAliasCommand({
        AliasName: this.keyAliases[keyType],
        TargetKeyId: keyId
      }));

      // Enable automatic key rotation
      await primaryClient.send(new EnableKeyRotationCommand({
        KeyId: keyId
      }));

      // Replicate to other regions
      await this.replicateKeyToRegions(keyId, keyType);
      
      // Cache the key ID
      this.keyCache.set(keyType, keyId);
      
      return keyId;
    }, this.primaryRegion, 'createMRK');
  }

  /**
   * Replicate MRK to all backup regions
   */
  private async replicateKeyToRegions(keyId: string, keyType: KeyType): Promise<void> {
    const replicationRegions = this.regions.filter(r => r !== this.primaryRegion);
    
    const replicationPromises = replicationRegions.map(async (region) => {
      const client = this.clients.get(region)!;
      
      return await this.executeWithRetry(async () => {
        // Replicate the key to the region
        await client.send(new ReplicateKeyCommand({
          KeyId: keyId,
          ReplicaRegion: region,
          Description: `Replica of ${keyType} key in ${region}`,
          Policy: this.generateKeyPolicy(keyType)
        }));

        // Create alias in replica region (same key ID works for MRK)
        await client.send(new CreateAliasCommand({
          AliasName: this.keyAliases[keyType],
          TargetKeyId: keyId
        }));

        console.log(`Successfully replicated ${keyType} key to ${region}`);
      }, region, 'replicateKey');
    });

    await Promise.all(replicationPromises);
  }

  /**
   * Generate comprehensive IAM policy for cross-region KMS access
   */
  private generateKeyPolicy(keyType: KeyType): string {
    const accountId = process.env.AWS_ACCOUNT_ID;
    if (!accountId) {
      throw new Error('AWS_ACCOUNT_ID environment variable is required');
    }

    return JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'Enable IAM User Permissions',
          Effect: 'Allow',
          Principal: {
            AWS: `arn:aws:iam::${accountId}:root`
          },
          Action: 'kms:*',
          Resource: '*'
        },
        {
          Sid: `Allow Parker Flight ${keyType} service access`,
          Effect: 'Allow',
          Principal: {
            AWS: [
              `arn:aws:iam::${accountId}:role/ParkerFlight${keyType.charAt(0).toUpperCase() + keyType.slice(1)}Role`,
              `arn:aws:iam::${accountId}:role/ParkerFlightServiceRole`
            ]
          },
          Action: [
            'kms:Encrypt',
            'kms:Decrypt',
            'kms:ReEncrypt*',
            'kms:GenerateDataKey*',
            'kms:DescribeKey',
            'kms:CreateGrant',
            'kms:ListGrants',
            'kms:RevokeGrant'
          ],
          Resource: '*',
          Condition: {
            StringEquals: {
              'kms:ViaService': [
                `s3.us-east-1.amazonaws.com`,
                `s3.us-west-2.amazonaws.com`,
                `s3.eu-west-1.amazonaws.com`,
                `dynamodb.us-east-1.amazonaws.com`,
                `dynamodb.us-west-2.amazonaws.com`,
                `dynamodb.eu-west-1.amazonaws.com`
              ]
            }
          }
        },
        {
          Sid: 'Allow cross-region access',
          Effect: 'Allow',
          Principal: {
            AWS: `arn:aws:iam::${accountId}:root`
          },
          Action: [
            'kms:Decrypt',
            'kms:GenerateDataKey*',
            'kms:DescribeKey'
          ],
          Resource: '*',
          Condition: {
            StringLike: {
              'kms:EncryptionContext:aws:SecureTransport': 'true'
            }
          }
        }
      ]
    });
  }

  /**
   * Encrypt data with optimized data key caching and failover
   */
  async encryptData(
    data: Buffer, 
    keyType: KeyType,
    preferredRegion: string = this.primaryRegion
  ): Promise<EncryptedData> {
    const dataKey = await this.getOrCreateDataKey(keyType, preferredRegion);
    
    // Use local encryption with cached data key (reduces KMS API calls)
    const iv = crypto.randomBytes(12); // 96-bit IV for GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', dataKey.plaintextKey, iv);
    cipher.setAAD(Buffer.from(keyType)); // Additional authenticated data
    
    const encrypted = Buffer.concat([
      cipher.update(data),
      cipher.final()
    ]);
    
    const authTag = cipher.getAuthTag();

    // Increment usage count for key rotation tracking
    dataKey.usageCount++;

    return {
      encryptedData: encrypted,
      encryptedDataKey: dataKey.encryptedKey,
      authTag,
      keyId: dataKey.keyId,
      keyType, // Include keyType for reliable decryption
      region: dataKey.region,
      algorithm: 'aes-256-gcm',
      iv // Include IV in the encrypted data structure
    };
  }

  /**
   * Decrypt data with multi-region failover
   */
  async decryptData(
    encryptedData: EncryptedData,
    preferredRegion: string = this.primaryRegion
  ): Promise<Buffer> {
    // Try preferred region first, then failover
    const regionsToTry = [preferredRegion, ...this.regions.filter(r => r !== preferredRegion)];
    
    for (const region of regionsToTry) {
      try {
        return await this.decryptInRegion(encryptedData, region);
      } catch (error) {
        console.warn(`Decryption failed in region ${region}:`, error);
        
        // Don't retry on certain errors
        if (this.isNonRetryableError(error)) {
          throw error;
        }
        
        // Continue to next region
        continue;
      }
    }
    
    throw new Error('Decryption failed in all regions');
  }

  /**
   * Decrypt data in a specific region
   */
  private async decryptInRegion(encryptedData: EncryptedData, region: string): Promise<Buffer> {
    // First try to get plaintext key from cache
    const cacheKey = this.getDataKeyCacheKey(encryptedData.keyId, region);
    let dataKey = this.dataKeyCache.get(cacheKey);

    if (!dataKey) {
      // Decrypt the data key using KMS
      const plaintextKey = await this.decryptDataKey(encryptedData.encryptedDataKey, region);
      
      // Cache the decrypted key for future use
      dataKey = {
        plaintextKey,
        encryptedKey: encryptedData.encryptedDataKey,
        createdAt: Date.now(),
        usageCount: 1,
        keyId: encryptedData.keyId,
        region
      };
      
      this.dataKeyCache.set(cacheKey, dataKey);
    }

    // Decrypt data locally using GCM decipher
    const decipher = crypto.createDecipheriv('aes-256-gcm', dataKey.plaintextKey, encryptedData.iv);
    
    // Set the auth tag and AAD
    decipher.setAuthTag(encryptedData.authTag);
    
    // Use the keyType from the encrypted data for AAD - this ensures consistency
    // between encryption and decryption without relying on key ID inference
    decipher.setAAD(Buffer.from(encryptedData.keyType));
    
    return Buffer.concat([
      decipher.update(encryptedData.encryptedData),
      decipher.final()
    ]);
  }

  /**
   * Get or create a cached data key with automatic rotation
   */
  private async getOrCreateDataKey(keyType: KeyType, region: string): Promise<CachedDataKey> {
    const keyId = await this.getKeyId(keyType, region);
    const cacheKey = this.getDataKeyCacheKey(keyId, region);
    
    let dataKey = this.dataKeyCache.get(cacheKey);
    
    // Check if we need a new data key
    if (!dataKey || this.shouldRotateDataKey(dataKey)) {
      dataKey = await this.generateNewDataKey(keyId, region);
      this.dataKeyCache.set(cacheKey, dataKey);
      
      // Clean up old cache entries periodically
      this.cleanupDataKeyCache();
    }
    
    return dataKey;
  }

  /**
   * Generate a new data key with failover
   */
  private async generateNewDataKey(keyId: string, preferredRegion: string): Promise<CachedDataKey> {
    const regionsToTry = [preferredRegion, ...this.regions.filter(r => r !== preferredRegion)];
    
    for (const region of regionsToTry) {
      try {
        const client = this.clients.get(region)!;
        
        const result = await this.executeWithRetry(async () => {
          const command = new GenerateDataKeyCommand({
            KeyId: keyId,
            KeySpec: 'AES_256'
          });
          
          return await client.send(command);
        }, region, 'generateDataKey');
        
        return {
          plaintextKey: Buffer.from(result.Plaintext!),
          encryptedKey: Buffer.from(result.CiphertextBlob!),
          createdAt: Date.now(),
          usageCount: 0,
          keyId,
          region
        };
      } catch (error) {
        console.warn(`Failed to generate data key in region ${region}:`, error);
        
        if (this.isNonRetryableError(error)) {
          throw error;
        }
      }
    }
    
    throw new Error('Failed to generate data key in all regions');
  }

  /**
   * Decrypt a data key with KMS
   */
  private async decryptDataKey(encryptedKey: Buffer, region: string): Promise<Buffer> {
    const client = this.clients.get(region)!;
    
    return await this.executeWithRetry(async () => {
      const command = new DecryptCommand({
        CiphertextBlob: encryptedKey
      });
      
      const result = await client.send(command);
      return Buffer.from(result.Plaintext!);
    }, region, 'decryptDataKey');
  }

  /**
   * Get key ID for a key type, with caching and failover
   */
  private async getKeyId(keyType: KeyType, region: string): Promise<string> {
    // Check cache first
    const cachedKeyId = this.keyCache.get(keyType);
    if (cachedKeyId) {
      return cachedKeyId;
    }

    // Resolve alias to key ID
    const client = this.clients.get(region)!;
    const alias = this.keyAliases[keyType];
    
    return await this.executeWithRetry(async () => {
      const command = new DescribeKeyCommand({ KeyId: alias });
      const result = await client.send(command);
      const keyId = result.KeyMetadata!.KeyId!;
      
      // Cache the result
      this.keyCache.set(keyType, keyId);
      return keyId;
    }, region, 'describeKey');
  }

  /**
   * Enhanced retry logic with circuit breaker pattern
   */
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    region: string,
    operationType: string
  ): Promise<T> {
    const startTime = Date.now();
    let retryCount = 0;
    
    // Check circuit breaker
    const circuitState = this.getCircuitBreakerState(region);
    if (circuitState.state === 'OPEN') {
      if (Date.now() < circuitState.nextAttempt) {
        throw new Error(`Circuit breaker is OPEN for region ${region}`);
      }
      circuitState.state = 'HALF_OPEN';
    }

    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const result = await operation();
        
        // Record success metrics
        this.recordMetrics({
          region,
          operation: operationType,
          success: true,
          duration: Date.now() - startTime,
          retryCount
        });
        
        // Reset circuit breaker on success
        this.resetCircuitBreaker(region);
        return result;
      } catch (error) {
        lastError = error as Error;
        retryCount = attempt;
        
        const shouldRetry = this.shouldRetry(error as any, attempt);
        const delay = this.calculateDelay(attempt, error as any);
        
        console.warn(`KMS operation failed (attempt ${attempt}/${this.MAX_RETRIES}) in ${region}:`, {
          error: (error as any).name,
          message: (error as any).message,
          operationType,
          willRetry: shouldRetry && attempt < this.MAX_RETRIES
        });

        if (!shouldRetry || attempt >= this.MAX_RETRIES) {
          break;
        }

        if (attempt < this.MAX_RETRIES) {
          await this.sleep(delay);
        }
      }
    }

    // Record failure metrics
    this.recordMetrics({
      region,
      operation: operationType,
      success: false,
      duration: Date.now() - startTime,
      error: lastError!.name,
      retryCount
    });

    this.recordCircuitBreakerFailure(region);
    throw lastError!;
  }

  /**
   * Determine if an error should trigger a retry
   */
  private shouldRetry(error: any, attempt: number): boolean {
    if (attempt >= this.MAX_RETRIES) return false;

    // Retryable errors
    const retryableErrors = [
      'KMSInvalidStateException',
      'KMSThrottlingException', 
      'LimitExceededException',
      'ServiceUnavailableException',
      'InternalException',
      'ThrottlingException',
      'RequestLimitExceeded'
    ];

    // Non-retryable errors
    const nonRetryableErrors = [
      'DisabledException',
      'InvalidKeyUsageException', 
      'InvalidCiphertextException',
      'KeyUnavailableException',
      'AccessDeniedException',
      'NotFoundException',
      'MalformedPolicyDocumentException'
    ];

    if (nonRetryableErrors.includes(error.name)) {
      return false;
    }

    if (retryableErrors.includes(error.name)) {
      return true;
    }

    // Retry on network errors
    if (error.code === 'ECONNRESET' || 
        error.code === 'ETIMEDOUT' || 
        error.code === 'ENOTFOUND' ||
        error.message?.includes('timeout')) {
      return true;
    }

    return false;
  }

  /**
   * Check if error is non-retryable across regions
   */
  private isNonRetryableError(error: any): boolean {
    const nonRetryableErrors = [
      'DisabledException',
      'InvalidKeyUsageException', 
      'InvalidCiphertextException',
      'AccessDeniedException',
      'MalformedPolicyDocumentException'
    ];
    
    return nonRetryableErrors.includes(error.name);
  }

  /**
   * Calculate retry delay with exponential backoff and jitter
   */
  private calculateDelay(attempt: number, error: any): number {
    let delay = this.BASE_DELAY * Math.pow(2, attempt - 1);
    
    // Add jitter (±25%)
    const jitter = delay * 0.25 * (Math.random() * 2 - 1);
    delay += jitter;
    
    // Special handling for throttling - use longer delays
    if (error.name === 'LimitExceededException' || 
        error.name === 'KMSThrottlingException' ||
        error.name === 'ThrottlingException') {
      delay *= 3; // Triple the delay for throttling
    }
    
    return Math.min(delay, this.MAX_DELAY);
  }

  /**
   * Determine if data key should be rotated
   */
  private shouldRotateDataKey(dataKey: CachedDataKey): boolean {
    const age = Date.now() - dataKey.createdAt;
    return age > this.DATA_KEY_TTL || dataKey.usageCount >= this.MAX_ENCRYPTIONS_PER_KEY;
  }

  /**
   * Generate cache key for data keys
   */
  private getDataKeyCacheKey(keyId: string, region: string): string {
    return `${keyId}-${region}`;
  }

  /**
   * Circuit breaker management
   */
  private getCircuitBreakerState(region: string): CircuitBreakerState {
    if (!this.circuitBreakers.has(region)) {
      this.circuitBreakers.set(region, {
        failures: 0,
        lastFailure: 0,
        state: 'CLOSED',
        nextAttempt: 0
      });
    }
    return this.circuitBreakers.get(region)!;
  }

  private recordCircuitBreakerFailure(region: string): void {
    const state = this.getCircuitBreakerState(region);
    state.failures++;
    state.lastFailure = Date.now();
    
    if (state.failures >= this.CIRCUIT_BREAKER_THRESHOLD) {
      state.state = 'OPEN';
      state.nextAttempt = Date.now() + this.CIRCUIT_BREAKER_TIMEOUT;
      console.warn(`Circuit breaker OPENED for region ${region}`);
    }
  }

  private resetCircuitBreaker(region: string): void {
    const state = this.getCircuitBreakerState(region);
    state.failures = 0;
    state.state = 'CLOSED';
    state.nextAttempt = 0;
  }

  /**
   * Cleanup expired data keys from cache
   */
  private cleanupDataKeyCache(): void {
    const now = Date.now();
    const entriesToDelete: string[] = [];
    
    this.dataKeyCache.forEach((dataKey, key) => {
      if (this.shouldRotateDataKey(dataKey)) {
        entriesToDelete.push(key);
        // Clear the plaintext key from memory
        dataKey.plaintextKey.fill(0);
      }
    });
    
    entriesToDelete.forEach(key => this.dataKeyCache.delete(key));
  }

  /**
   * Record operation metrics
   */
  private recordMetrics(metrics: KMSOperationMetrics): void {
    this.metrics.push(metrics);
    
    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics.splice(0, this.metrics.length - 1000);
    }
  }

  /**
   * Get operation metrics for monitoring
   */
  getMetrics(): KMSOperationMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get circuit breaker status for all regions
   */
  getCircuitBreakerStatus(): Map<string, CircuitBreakerState> {
    return new Map(this.circuitBreakers);
  }

  /**
   * Sleep utility for delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Health check for all regions
   */
  async healthCheck(): Promise<Map<string, boolean>> {
    const healthStatus = new Map<string, boolean>();
    
    const healthPromises = this.regions.map(async (region) => {
      try {
        const client = this.clients.get(region)!;
        await client.send(new ListAliasesCommand({ Limit: 1 }));
        healthStatus.set(region, true);
      } catch (error) {
        console.warn(`Health check failed for region ${region}:`, error);
        healthStatus.set(region, false);
      }
    });

    await Promise.allSettled(healthPromises);
    return healthStatus;
  }

  /**
   * Manage key rotation for all keys
   */
  async manageKeyRotation(): Promise<void> {
    const keyTypes = Array.from(this.keyCache.keys()) as KeyType[];
    
    for (const keyType of keyTypes) {
      try {
        await this.ensureKeyRotationEnabled(keyType);
      } catch (error) {
        console.error(`Failed to manage rotation for ${keyType}:`, error);
      }
    }
  }

  private async ensureKeyRotationEnabled(keyType: KeyType): Promise<void> {
    const keyId = this.keyCache.get(keyType);
    if (!keyId) return;

    const primaryClient = this.clients.get(this.primaryRegion)!;
    
    try {
      // Check current rotation status
      const rotationStatus = await primaryClient.send(
        new GetKeyRotationStatusCommand({ KeyId: keyId })
      );
      
      if (!rotationStatus.KeyRotationEnabled) {
        // Enable rotation if not already enabled
        await primaryClient.send(
          new EnableKeyRotationCommand({ KeyId: keyId })
        );
        console.log(`Enabled key rotation for ${keyType}`);
      }
    } catch (error) {
      console.error(`Failed to check/enable rotation for ${keyType}:`, error);
      throw error;
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    // Clear all data key caches and overwrite sensitive data
    this.dataKeyCache.forEach((dataKey) => {
      dataKey.plaintextKey.fill(0);
    });
    this.dataKeyCache.clear();
    
    // Clear key cache
    this.keyCache.clear();
    
    // Reset circuit breakers
    this.circuitBreakers.clear();
    
    // Clear metrics
    this.metrics.length = 0;
  }
}

// Export singleton instance
export const kmsManager = new MultiRegionKMSManager();
