/**
 * Enhanced Payment KMS Service for Parker Flight
 * Standardized on multi-region KMS approach for payment data processing
 * Based on AWS AI bot recommendations for Supabase Edge Functions
 */

import { KMSClient, EncryptCommand, DecryptCommand, GenerateDataKeyCommand } from '@aws-sdk/client-kms';
import { STSClient, AssumeRoleCommand, Credentials } from '@aws-sdk/client-sts';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export interface PaymentKMSConfig {
  primaryRegion: string;
  fallbackRegions: string[];
  keyAliases: {
    general: string;
    pii: string;
    payment: string;
  };
  roleArn?: string;
  externalId?: string;
}

export interface EncryptedPaymentData {
  encryptedData: string;
  encryptedDataKey: string;
  iv: string;
  algorithm: string;
  keyId: string;
  version: number;
  region: string;
}

export interface PaymentData {
  cardNumber?: string;
  cvv?: string;
  expiryDate?: string;
  billingAddress?: any;
  paymentMethodId?: string;
  fingerprint?: string;
  metadata?: Record<string, any>;
}

/**
 * Enhanced Multi-Region KMS Service for Payment Processing
 * Implements envelope encryption with automatic failover
 */
export class PaymentKMSService {
  private static clientCache = new Map<string, KMSClient>();
  private secretsClient: SecretsManagerClient;
  private stsClient: STSClient;
  private config: PaymentKMSConfig;
  private credentialsCache: Map<string, { credentials: { AccessKeyId: string; SecretAccessKey: string; SessionToken: string; }; expiry: Date }> = new Map();
  
  constructor(config: PaymentKMSConfig) {
    this.config = config;
    
    // Initialize STS client first (no credentials needed for assuming role)
    this.stsClient = new STSClient({
      region: config.primaryRegion,
    });
    
    // Initialize supporting clients (will be configured with assumed role credentials)
    this.secretsClient = new SecretsManagerClient({
      region: config.primaryRegion,
    });
    
    // Note: KMS clients will be initialized lazily with assumed role credentials
  }
  
  /**
   * Encrypt payment data using envelope encryption with multi-region failover
   */
  async encryptPaymentData(
    paymentData: PaymentData,
    keyType: 'general' | 'pii' | 'payment' = 'payment'
  ): Promise<EncryptedPaymentData> {
    const keyAlias = this.config.keyAliases[keyType];
    const plaintext = JSON.stringify(paymentData);
    
    let lastError: Error | null = null;
    
    // Try primary region first
    try {
      const primaryClient = await this.getPrimaryClient();
      return await this.performEnvelopeEncryption(
        primaryClient,
        plaintext,
        keyAlias,
        this.config.primaryRegion
      );
    } catch (error) {
      lastError = error as Error;
      console.warn(`Primary region ${this.config.primaryRegion} encryption failed:`, error);
    }
    
    // Fallback to other regions
    for (const region of this.config.fallbackRegions) {
      try {
        console.info(`Attempting encryption in fallback region: ${region}`);
        const client = await this.getFallbackClient(region);
        return await this.performEnvelopeEncryption(
          client,
          plaintext,
          keyAlias,
          region
        );
      } catch (error) {
        lastError = error as Error;
        console.warn(`Fallback region ${region} encryption failed:`, error);
      }
    }
    
    // All regions failed
    throw new Error(`Payment data encryption failed in all regions. Last error: ${lastError?.message}`);
  }
  
  /**
   * Decrypt payment data with automatic region detection
   */
  async decryptPaymentData(encryptedPaymentData: EncryptedPaymentData): Promise<PaymentData> {
    const region = encryptedPaymentData.region;
    
    // Get the appropriate KMS client for the region with role-based authentication
    const kmsClient = region === this.config.primaryRegion 
      ? await this.getPrimaryClient()
      : await this.getFallbackClient(region);
    
    try {
      const decryptedText = await this.performEnvelopeDecryption(
        kmsClient,
        encryptedPaymentData
      );
      
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error('Payment data decryption failed:', error);
      throw new Error(`Failed to decrypt payment data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Perform envelope encryption using the specified KMS client
   */
  private async performEnvelopeEncryption(
    kmsClient: KMSClient,
    plaintext: string,
    keyAlias: string,
    region: string
  ): Promise<EncryptedPaymentData> {
    // Step 1: Generate data encryption key
    const generateKeyCommand = new GenerateDataKeyCommand({
      KeyId: keyAlias,
      KeySpec: 'AES_256',
      EncryptionContext: {
        purpose: 'payment-data',
        application: 'parker-flight',
        region,
        timestamp: new Date().toISOString(),
      },
    });
    
    const dataKeyResult = await kmsClient.send(generateKeyCommand);
    
    if (!dataKeyResult.Plaintext || !dataKeyResult.CiphertextBlob) {
      throw new Error('Failed to generate data encryption key');
    }
    
    // Step 2: Encrypt data locally using the data key
    const plaintextKey = new Uint8Array(dataKeyResult.Plaintext);
    const encryptedDataKey = new Uint8Array(dataKeyResult.CiphertextBlob);
    
    // Generate random IV for AES-GCM
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Import key for Web Crypto API
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      plaintextKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    // Encrypt the data
    const encodedData = new TextEncoder().encode(plaintext);
    const encryptedArrayBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encodedData
    );
    
    const encryptedData = new Uint8Array(encryptedArrayBuffer);
    
    // Clear the plaintext key from memory
    plaintextKey.fill(0);
    
    return {
      encryptedData: this.arrayBufferToBase64(encryptedData),
      encryptedDataKey: this.arrayBufferToBase64(encryptedDataKey),
      iv: this.arrayBufferToBase64(iv),
      algorithm: 'AES-GCM',
      keyId: keyAlias,
      version: 2, // Version 2 = Enhanced multi-region
      region,
    };
  }
  
  /**
   * Perform envelope decryption using the specified KMS client
   */
  private async performEnvelopeDecryption(
    kmsClient: KMSClient,
    encryptedPaymentData: EncryptedPaymentData
  ): Promise<string> {
    // Step 1: Decrypt the data key using KMS
    const encryptedDataKeyBuffer = this.base64ToArrayBuffer(encryptedPaymentData.encryptedDataKey);
    
    const decryptKeyCommand = new DecryptCommand({
      CiphertextBlob: new Uint8Array(encryptedDataKeyBuffer),
      EncryptionContext: {
        purpose: 'payment-data',
        application: 'parker-flight',
        region: encryptedPaymentData.region,
      },
    });
    
    const decryptKeyResult = await kmsClient.send(decryptKeyCommand);
    
    if (!decryptKeyResult.Plaintext) {
      throw new Error('Failed to decrypt data encryption key');
    }
    
    // Step 2: Decrypt the data using the decrypted data key
    const plaintextKey = new Uint8Array(decryptKeyResult.Plaintext);
    const encryptedData = this.base64ToArrayBuffer(encryptedPaymentData.encryptedData);
    const iv = this.base64ToArrayBuffer(encryptedPaymentData.iv);
    
    // Import key for Web Crypto API
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      plaintextKey,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    // Decrypt the data
    const decryptedArrayBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      cryptoKey,
      new Uint8Array(encryptedData)
    );
    
    // Clear the plaintext key from memory
    plaintextKey.fill(0);
    
    return new TextDecoder().decode(decryptedArrayBuffer);
  }
  
  /**
   * Assume IAM role for secure credential access
   * This method replaces long-term access keys with temporary credentials
   */
  private async assumeRole(): Promise<{ AccessKeyId: string; SecretAccessKey: string; SessionToken: string; }> {
    if (!this.config.roleArn) {
      throw new Error('Role ARN not configured - IAM role assumption required for production security');
    }
    
    if (!this.config.externalId) {
      throw new Error('External ID not configured - required for secure role assumption');
    }
    
    const cacheKey = 'aws-credentials';
    const cached = this.credentialsCache.get(cacheKey);
    
    // Return cached credentials if they're still valid (with 5-minute buffer)
    if (cached && cached.expiry.getTime() - Date.now() > 5 * 60 * 1000) {
      return cached.credentials;
    }
    
    const command = new AssumeRoleCommand({
      RoleArn: this.config.roleArn,
      RoleSessionName: 'supabase-edge-function',
      ExternalId: this.config.externalId,
      DurationSeconds: 3600, // 1 hour session
    });
    
    try {
      const result = await this.stsClient.send(command);
      
      if (!result.Credentials) {
        throw new Error('Failed to assume role - no credentials returned');
      }
      
      const credentials = {
        AccessKeyId: result.Credentials.AccessKeyId!,
        SecretAccessKey: result.Credentials.SecretAccessKey!,
        SessionToken: result.Credentials.SessionToken!,
      };
      
      // Cache credentials with expiration
      this.credentialsCache.set(cacheKey, {
        credentials,
        expiry: result.Credentials.Expiration!,
      });
      
      console.info('Successfully assumed IAM role for KMS operations');
      return credentials;
    } catch (error) {
      console.error('Failed to assume IAM role:', error);
      throw new Error(`IAM role assumption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Get KMS client with assumed role credentials and connection pooling
   */
  private async getKMSClient(region: string): Promise<KMSClient> {
    const credentials = await this.assumeRole();
    const clientKey = `${region}-${credentials.AccessKeyId}-${credentials.SessionToken?.substring(0, 10) || ''}`;
    
    if (!PaymentKMSService.clientCache.has(clientKey)) {
      PaymentKMSService.clientCache.set(clientKey, new KMSClient({
        region,
        credentials: {
          accessKeyId: credentials.AccessKeyId,
          secretAccessKey: credentials.SecretAccessKey,
          sessionToken: credentials.SessionToken,
        },
        maxAttempts: 3,
      }));
    }
    
    return PaymentKMSService.clientCache.get(clientKey)!;
  }
  
  /**
   * Get primary KMS client with role-based authentication and connection pooling
   */
  private async getPrimaryClient(): Promise<KMSClient> {
    return await this.getKMSClient(this.config.primaryRegion);
  }
  
  /**
   * Get fallback KMS client for specified region with role-based authentication and connection pooling
   */
  private async getFallbackClient(region: string): Promise<KMSClient> {
    return await this.getKMSClient(region);
  }
  
  /**
   * Health check to verify KMS connectivity across all regions
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    regions: Record<string, { status: 'healthy' | 'unhealthy'; latency?: number; error?: string }>;
  }> {
    const results: Record<string, { status: 'healthy' | 'unhealthy'; latency?: number; error?: string }> = {};
    
    // Test primary region with role-based authentication
    const primaryStart = Date.now();
    try {
      const primaryClient = await this.getPrimaryClient();
      await this.testKMSRegion(primaryClient, this.config.keyAliases.general);
      results[this.config.primaryRegion] = {
        status: 'healthy',
        latency: Date.now() - primaryStart,
      };
    } catch (error) {
      results[this.config.primaryRegion] = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
    
    // Test fallback regions with role-based authentication
    for (const region of this.config.fallbackRegions) {
      const start = Date.now();
      try {
        const client = await this.getFallbackClient(region);
        await this.testKMSRegion(client, this.config.keyAliases.general);
        results[region] = {
          status: 'healthy',
          latency: Date.now() - start,
        };
      } catch (error) {
        results[region] = {
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }
    
    // Overall status is healthy if at least primary or one fallback is healthy
    const hasHealthyRegion = Object.values(results).some(r => r.status === 'healthy');
    
    return {
      status: hasHealthyRegion ? 'healthy' : 'unhealthy',
      regions: results,
    };
  }
  
  /**
   * Test KMS connectivity for a specific region
   */
  private async testKMSRegion(kmsClient: KMSClient, keyAlias: string): Promise<void> {
    const testData = { test: 'health-check', timestamp: Date.now() };
    const encrypted = await this.performEnvelopeEncryption(
      kmsClient,
      JSON.stringify(testData),
      keyAlias,
      'test'
    );
    
    const decrypted = await this.performEnvelopeDecryption(kmsClient, encrypted);
    const decryptedData = JSON.parse(decrypted);
    
    if (decryptedData.test !== 'health-check') {
      throw new Error('Health check encryption/decryption mismatch');
    }
  }
  
  /**
   * Clean up cached clients to prevent memory leaks
   * Call this method periodically in long-running applications
   */
  static clearClientCache(): void {
    PaymentKMSService.clientCache.clear();
    console.info('KMS client cache cleared');
  }
  
  /**
   * Get current cache statistics for monitoring
   */
  static getCacheStats(): { clientCount: number } {
    return {
      clientCount: PaymentKMSService.clientCache.size,
    };
  }
  
  // Utility methods
  private arrayBufferToBase64(buffer: Uint8Array): string {
    const bytes = Array.from(buffer);
    const binaryString = bytes.map(byte => String.fromCharCode(byte)).join('');
    return btoa(binaryString);
  }
  
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

/**
 * Factory function to create PaymentKMSService with environment-based configuration
 * Requires IAM role configuration for production security
 */
export function createPaymentKMSService(): PaymentKMSService {
  // Validate required IAM role configuration
  const roleArn = process.env.AWS_ROLE_ARN;
  const externalId = process.env.AWS_EXTERNAL_ID;
  
  if (!roleArn) {
    throw new Error('AWS_ROLE_ARN environment variable is required for secure KMS operations');
  }
  
  if (!externalId) {
    throw new Error('AWS_EXTERNAL_ID environment variable is required for secure role assumption');
  }
  
  const config: PaymentKMSConfig = {
    primaryRegion: process.env.AWS_REGION || 'us-east-1',
    fallbackRegions: JSON.parse(process.env.KMS_FALLBACK_REGIONS || '["us-west-2", "eu-west-1"]'),
    keyAliases: {
      general: process.env.KMS_GENERAL_ALIAS || 'alias/parker-flight-general-production',
      pii: process.env.KMS_PII_ALIAS || 'alias/parker-flight-pii-production',
      payment: process.env.KMS_PAYMENT_ALIAS || 'alias/parker-flight-payment-production',
    },
    roleArn,
    externalId,
  };
  
  return new PaymentKMSService(config);
}
