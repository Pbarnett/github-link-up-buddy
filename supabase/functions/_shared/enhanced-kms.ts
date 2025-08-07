/**
 * Enhanced KMS Service for Supabase Edge Functions (Deno)
 * Standardized multi-region KMS with envelope encryption
 * Based on AWS AI bot recommendations for payment processing
 */

import { 
  KMSClient, 
  EncryptCommand, 
  DecryptCommand, 
  GenerateDataKeyCommand 
} from "https://esm.sh/@aws-sdk/client-kms@3.454.0";

export interface DenoKMSConfig {
  primaryRegion: string;
  fallbackRegions: string[];
  keyAliases: {
    general: string;
    pii: string;
    payment: string;
  };
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
}

export interface EncryptedData {
  encryptedData: string;
  encryptedDataKey: string;
  iv: string;
  algorithm: string;
  keyId: string;
  version: number;
  region: string;
}

/**
 * Enhanced Multi-Region KMS Service for Deno/Supabase Edge Functions
 * Implements envelope encryption with automatic failover
 */
export class DenoKMSService {
  private primaryClient: KMSClient;
  private fallbackClients: Map<string, KMSClient> = new Map();
  private config: DenoKMSConfig;
  
  constructor(config?: Partial<DenoKMSConfig>) {
    // Load configuration from environment or passed config
    this.config = {
      primaryRegion: config?.primaryRegion || Deno.env.get("AWS_REGION") || "us-east-1",
      fallbackRegions: config?.fallbackRegions || JSON.parse(Deno.env.get("KMS_FALLBACK_REGIONS") || '["us-west-2", "eu-west-1"]'),
      keyAliases: {
        general: config?.keyAliases?.general || Deno.env.get("KMS_GENERAL_ALIAS") || "alias/parker-flight-general-production",
        pii: config?.keyAliases?.pii || Deno.env.get("KMS_PII_ALIAS") || "alias/parker-flight-pii-production",
        payment: config?.keyAliases?.payment || Deno.env.get("KMS_PAYMENT_ALIAS") || "alias/parker-flight-payment-production",
      },
      awsAccessKeyId: config?.awsAccessKeyId || Deno.env.get("AWS_ACCESS_KEY_ID") || "",
      awsSecretAccessKey: config?.awsSecretAccessKey || Deno.env.get("AWS_SECRET_ACCESS_KEY") || "",
    };
    
    if (!this.config.awsAccessKeyId || !this.config.awsSecretAccessKey) {
      throw new Error("Missing AWS credentials. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.");
    }
    
    // Initialize primary KMS client
    this.primaryClient = new KMSClient({
      region: this.config.primaryRegion,
      credentials: {
        accessKeyId: this.config.awsAccessKeyId,
        secretAccessKey: this.config.awsSecretAccessKey,
      },
      maxAttempts: 3,
      requestTimeout: 30000,
    });
    
    // Initialize fallback KMS clients
    this.config.fallbackRegions.forEach(region => {
      this.fallbackClients.set(region, new KMSClient({
        region,
        credentials: {
          accessKeyId: this.config.awsAccessKeyId,
          secretAccessKey: this.config.awsSecretAccessKey,
        },
        maxAttempts: 3,
        requestTimeout: 30000,
      }));
    });
  }
  
  /**
   * Encrypt data using envelope encryption with multi-region failover
   */
  async encrypt(
    data: string | object,
    keyType: 'general' | 'pii' | 'payment' = 'general'
  ): Promise<EncryptedData> {
    const keyAlias = this.config.keyAliases[keyType];
    const plaintext = typeof data === 'string' ? data : JSON.stringify(data);
    
    let lastError: Error | null = null;
    
    // Try primary region first
    try {
      return await this.performEnvelopeEncryption(
        this.primaryClient,
        plaintext,
        keyAlias,
        this.config.primaryRegion,
        keyType
      );
    } catch (error) {
      lastError = error as Error;
      console.warn(`Primary region ${this.config.primaryRegion} encryption failed:`, error.message);
    }
    
    // Fallback to other regions
    for (const [region, client] of this.fallbackClients.entries()) {
      try {
        console.info(`Attempting encryption in fallback region: ${region}`);
        return await this.performEnvelopeEncryption(
          client,
          plaintext,
          keyAlias,
          region,
          keyType
        );
      } catch (error) {
        lastError = error as Error;
        console.warn(`Fallback region ${region} encryption failed:`, error.message);
      }
    }
    
    // All regions failed
    throw new Error(`Data encryption failed in all regions. Last error: ${lastError?.message}`);
  }
  
  /**
   * Decrypt data with automatic region detection
   */
  async decrypt(encryptedData: EncryptedData, parseJson = false): Promise<string | object> {
    const region = encryptedData.region;
    
    // Get the appropriate KMS client for the region
    const kmsClient = region === this.config.primaryRegion 
      ? this.primaryClient 
      : this.fallbackClients.get(region);
      
    if (!kmsClient) {
      throw new Error(`No KMS client available for region: ${region}`);
    }
    
    try {
      const decryptedText = await this.performEnvelopeDecryption(
        kmsClient,
        encryptedData
      );
      
      return parseJson ? JSON.parse(decryptedText) : decryptedText;
    } catch (error) {
      console.error('Data decryption failed:', error);
      throw new Error(`Failed to decrypt data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Perform envelope encryption using the specified KMS client
   */
  private async performEnvelopeEncryption(
    kmsClient: KMSClient,
    plaintext: string,
    keyAlias: string,
    region: string,
    keyType: string
  ): Promise<EncryptedData> {
    // Step 1: Generate data encryption key
    const generateKeyCommand = new GenerateDataKeyCommand({
      KeyId: keyAlias,
      KeySpec: "AES_256",
      EncryptionContext: {
        purpose: keyType === 'payment' ? 'payment-data' : keyType === 'pii' ? 'user-pii-data' : 'general-data',
        application: 'parker-flight',
        region,
        timestamp: new Date().toISOString(),
        version: '2', // Enhanced multi-region version
      },
    });
    
    const dataKeyResult = await kmsClient.send(generateKeyCommand);
    
    if (!dataKeyResult.Plaintext || !dataKeyResult.CiphertextBlob) {
      throw new Error("Failed to generate data encryption key");
    }
    
    // Step 2: Encrypt data locally using the data key
    const plaintextKey = new Uint8Array(dataKeyResult.Plaintext);
    const encryptedDataKey = new Uint8Array(dataKeyResult.CiphertextBlob);
    
    // Generate random IV for AES-GCM
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
    
    // Import key for Web Crypto API
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      plaintextKey,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );
    
    // Encrypt the data
    const encodedData = new TextEncoder().encode(plaintext);
    const encryptedArrayBuffer = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
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
      algorithm: "AES-GCM",
      keyId: keyAlias,
      version: 2, // Enhanced multi-region version
      region,
    };
  }
  
  /**
   * Perform envelope decryption using the specified KMS client
   */
  private async performEnvelopeDecryption(
    kmsClient: KMSClient,
    encryptedData: EncryptedData
  ): Promise<string> {
    // Step 1: Decrypt the data key using KMS
    const encryptedDataKeyBuffer = this.base64ToArrayBuffer(encryptedData.encryptedDataKey);
    
    const decryptKeyCommand = new DecryptCommand({
      CiphertextBlob: new Uint8Array(encryptedDataKeyBuffer),
    });
    
    const decryptKeyResult = await kmsClient.send(decryptKeyCommand);
    
    if (!decryptKeyResult.Plaintext) {
      throw new Error("Failed to decrypt data encryption key");
    }
    
    // Step 2: Decrypt the data using the decrypted data key
    const plaintextKey = new Uint8Array(decryptKeyResult.Plaintext);
    const encryptedDataBuffer = this.base64ToArrayBuffer(encryptedData.encryptedData);
    const iv = this.base64ToArrayBuffer(encryptedData.iv);
    
    // Import key for Web Crypto API
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      plaintextKey,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
    
    // Decrypt the data
    const decryptedArrayBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      cryptoKey,
      new Uint8Array(encryptedDataBuffer)
    );
    
    // Clear the plaintext key from memory
    plaintextKey.fill(0);
    
    return new TextDecoder().decode(decryptedArrayBuffer);
  }
  
  /**
   * Health check to verify KMS connectivity across all regions
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    regions: Record<string, { status: 'healthy' | 'unhealthy'; latency?: number; error?: string }>;
  }> {
    const results: Record<string, { status: 'healthy' | 'unhealthy'; latency?: number; error?: string }> = {};
    
    // Test primary region
    const primaryStart = Date.now();
    try {
      await this.testKMSRegion(this.primaryClient, this.config.keyAliases.general, 'primary');
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
    
    // Test fallback regions
    for (const [region, client] of this.fallbackClients.entries()) {
      const start = Date.now();
      try {
        await this.testKMSRegion(client, this.config.keyAliases.general, region);
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
  private async testKMSRegion(kmsClient: KMSClient, keyAlias: string, region: string): Promise<void> {
    const testData = { test: 'health-check', timestamp: Date.now() };
    const encrypted = await this.performEnvelopeEncryption(
      kmsClient,
      JSON.stringify(testData),
      keyAlias,
      region,
      'general'
    );
    
    const decrypted = await this.performEnvelopeDecryption(kmsClient, encrypted);
    const decryptedData = JSON.parse(decrypted);
    
    if (decryptedData.test !== 'health-check') {
      throw new Error('Health check encryption/decryption mismatch');
    }
  }
  
  /**
   * Get encryption metadata for audit purposes
   */
  getEncryptionMetadata(): {
    algorithm: string;
    version: number;
    keyAliases: Record<string, string>;
    regions: {
      primary: string;
      fallbacks: string[];
    };
  } {
    return {
      algorithm: 'AES-GCM',
      version: 2,
      keyAliases: this.config.keyAliases,
      regions: {
        primary: this.config.primaryRegion,
        fallbacks: this.config.fallbackRegions,
      },
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

// Convenience functions for common use cases

/**
 * Encrypt payment data using the payment-specific KMS key
 */
export async function encryptPaymentData(paymentData: any): Promise<string> {
  const kms = new DenoKMSService();
  const encrypted = await kms.encrypt(paymentData, 'payment');
  return JSON.stringify(encrypted);
}

/**
 * Decrypt payment data
 */
export async function decryptPaymentData(encryptedData: string, parseJson = true): Promise<any> {
  const kms = new DenoKMSService();
  const encrypted = JSON.parse(encryptedData) as EncryptedData;
  return await kms.decrypt(encrypted, parseJson);
}

/**
 * Encrypt PII data using the PII-specific KMS key
 */
export async function encryptPII(piiData: any): Promise<string> {
  const kms = new DenoKMSService();
  const encrypted = await kms.encrypt(piiData, 'pii');
  return JSON.stringify(encrypted);
}

/**
 * Decrypt PII data
 */
export async function decryptPII(encryptedData: string, parseJson = true): Promise<any> {
  const kms = new DenoKMSService();
  const encrypted = JSON.parse(encryptedData) as EncryptedData;
  return await kms.decrypt(encrypted, parseJson);
}

/**
 * Validate KMS configuration
 */
export function validateKMSConfig(): boolean {
  try {
    const requiredEnvVars = [
      'AWS_REGION',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'KMS_GENERAL_ALIAS',
      'KMS_PII_ALIAS',
      'KMS_PAYMENT_ALIAS',
    ];
    
    return requiredEnvVars.every(varName => {
      const value = Deno.env.get(varName);
      return value !== undefined && value !== "";
    });
  } catch {
    return false;
  }
}

/**
 * Test KMS functionality with all three keys
 */
export async function testKMS(): Promise<{
  general: boolean;
  pii: boolean;
  payment: boolean;
  overall: boolean;
}> {
  const kms = new DenoKMSService();
  const results = {
    general: false,
    pii: false,
    payment: false,
    overall: false,
  };
  
  try {
    // Test general key
    const generalTest = await kms.encrypt('test-general', 'general');
    const generalDecrypt = await kms.decrypt(generalTest, false) as string;
    results.general = generalDecrypt === 'test-general';
    
    // Test PII key
    const piiTest = await kms.encrypt({ email: 'test@example.com' }, 'pii');
    const piiDecrypt = await kms.decrypt(piiTest, true) as any;
    results.pii = piiDecrypt.email === 'test@example.com';
    
    // Test payment key
    const paymentTest = await kms.encrypt({ cardLast4: '4242' }, 'payment');
    const paymentDecrypt = await kms.decrypt(paymentTest, true) as any;
    results.payment = paymentDecrypt.cardLast4 === '4242';
    
    results.overall = results.general && results.pii && results.payment;
  } catch (error) {
    console.error('KMS test failed:', error);
  }
  
  return results;
}

/**
 * Create audit log for KMS operations in Supabase Edge Functions
 */
export interface KMSAuditLog {
  operation: 'encrypt' | 'decrypt' | 'health_check' | 'test';
  keyType: 'general' | 'pii' | 'payment';
  success: boolean;
  timestamp: string;
  region?: string;
  latency?: number;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export function createKMSAuditLog(
  operation: 'encrypt' | 'decrypt' | 'health_check' | 'test',
  keyType: 'general' | 'pii' | 'payment',
  success: boolean,
  metadata?: {
    region?: string;
    latency?: number;
    errorMessage?: string;
    dataSize?: number;
    [key: string]: any;
  }
): KMSAuditLog {
  return {
    operation,
    keyType,
    success,
    timestamp: new Date().toISOString(),
    region: metadata?.region,
    latency: metadata?.latency,
    errorMessage: metadata?.errorMessage,
    metadata: metadata ? { ...metadata } : undefined,
  };
}

// Singleton instance for use across Edge Functions
let kmsInstance: DenoKMSService | null = null;

/**
 * Get or create the global KMS service instance
 */
export function getKMSService(): DenoKMSService {
  if (!kmsInstance) {
    kmsInstance = new DenoKMSService();
  }
  return kmsInstance;
}
