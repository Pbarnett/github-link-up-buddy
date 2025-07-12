/**
 * AWS KMS Encryption Utility for Parker Flight
 * 
 * This module provides secure encryption/decryption operations using AWS KMS
 * with envelope encryption pattern for optimal performance and security.
 */

import { 
  KMSClient, 
  EncryptCommand, 
  DecryptCommand, 
  GenerateDataKeyCommand,
  GenerateDataKeyCommandOutput 
} from "https://esm.sh/@aws-sdk/client-kms@3.454.0";

// Types
interface EncryptionResult {
  encryptedData: string;        // Base64 encoded encrypted data
  encryptedDataKey: string;     // Base64 encoded encrypted data key
  iv: string;                   // Base64 encoded initialization vector
  algorithm: string;            // Encryption algorithm used
  keyId: string;               // KMS key ID used
  version: number;             // Encryption version for future migrations
}

interface DecryptionInput {
  encryptedData: string;
  encryptedDataKey: string;
  iv: string;
  algorithm: string;
  keyId: string;
  version: number;
}

interface KMSConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  keyId: string;
}

/**
 * KMS Manager for secure encryption operations
 * 
 * Uses envelope encryption pattern:
 * 1. Generate a data encryption key (DEK) using KMS
 * 2. Use DEK to encrypt the actual data locally
 * 3. Store the encrypted DEK alongside encrypted data
 * 4. For decryption, decrypt the DEK first, then decrypt data
 */
export class KMSManager {
  private kmsClient: KMSClient;
  private masterKeyId: string;
  private algorithm = 'AES-GCM';
  private version = 2; // Version 2 = KMS encryption (Version 1 = old pgcrypto)

  constructor(config?: KMSConfig) {
    // Load configuration from environment or passed config
    const region = config?.region || Deno.env.get("AWS_REGION") || "us-east-1";
    const accessKeyId = config?.accessKeyId || Deno.env.get("AWS_ACCESS_KEY_ID");
    const secretAccessKey = config?.secretAccessKey || Deno.env.get("AWS_SECRET_ACCESS_KEY");
    this.masterKeyId = config?.keyId || Deno.env.get("AWS_KMS_KEY_ID") || "";

    if (!accessKeyId || !secretAccessKey || !this.masterKeyId) {
      throw new Error("Missing required AWS KMS configuration. Please check AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_KMS_KEY_ID environment variables.");
    }

    this.kmsClient = new KMSClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  /**
   * Encrypt sensitive data using envelope encryption
   */
  async encryptData(plaintext: string): Promise<EncryptionResult> {
    try {
      // Step 1: Generate a data encryption key from KMS
      const generateKeyCommand = new GenerateDataKeyCommand({
        KeyId: this.masterKeyId,
        KeySpec: "AES_256",
      });

      const dataKeyResult: GenerateDataKeyCommandOutput = await this.kmsClient.send(generateKeyCommand);
      
      if (!dataKeyResult.Plaintext || !dataKeyResult.CiphertextBlob) {
        throw new Error("Failed to generate data encryption key");
      }

      // Step 2: Use the plaintext data key to encrypt our data
      const plaintextKey = new Uint8Array(dataKeyResult.Plaintext);
      const encryptedDataKey = new Uint8Array(dataKeyResult.CiphertextBlob);
      
      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
      
      // Import the key for Web Crypto API
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
        {
          name: "AES-GCM",
          iv: iv,
        },
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
        algorithm: this.algorithm,
        keyId: this.masterKeyId,
        version: this.version,
      };

    } catch (error) {
      console.error("KMS encryption error:", error);
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt data using envelope encryption
   */
  async decryptData(input: DecryptionInput): Promise<string> {
    try {
      // Validate input
      if (!input.encryptedData || !input.encryptedDataKey || !input.iv) {
        throw new Error("Missing required decryption parameters");
      }

      // Step 1: Decrypt the data key using KMS
      const encryptedDataKeyBuffer = this.base64ToArrayBuffer(input.encryptedDataKey);
      
      const decryptKeyCommand = new DecryptCommand({
        CiphertextBlob: new Uint8Array(encryptedDataKeyBuffer),
      });

      const decryptKeyResult = await this.kmsClient.send(decryptKeyCommand);
      
      if (!decryptKeyResult.Plaintext) {
        throw new Error("Failed to decrypt data encryption key");
      }

      // Step 2: Use the decrypted data key to decrypt our data
      const plaintextKey = new Uint8Array(decryptKeyResult.Plaintext);
      const encryptedData = this.base64ToArrayBuffer(input.encryptedData);
      const iv = this.base64ToArrayBuffer(input.iv);

      // Import the key for Web Crypto API
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        plaintextKey,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      // Decrypt the data
      const decryptedArrayBuffer = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: new Uint8Array(iv),
        },
        cryptoKey,
        new Uint8Array(encryptedData)
      );

      // Clear the plaintext key from memory
      plaintextKey.fill(0);

      // Convert back to string
      const decoder = new TextDecoder();
      return decoder.decode(decryptedArrayBuffer);

    } catch (error) {
      console.error("KMS decryption error:", error);
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Health check to verify KMS connectivity
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: string }> {
    try {
      // Try to encrypt a test string
      const testData = "health-check-test";
      const encrypted = await this.encryptData(testData);
      const decrypted = await this.decryptData(encrypted);
      
      if (decrypted === testData) {
        return { status: 'healthy', details: 'KMS encryption/decryption successful' };
      } else {
        return { status: 'unhealthy', details: 'KMS round-trip test failed' };
      }
    } catch (error) {
      return { 
        status: 'unhealthy', 
        details: `KMS health check failed: ${error.message}` 
      };
    }
  }

  /**
   * Get encryption metadata for audit purposes
   */
  getEncryptionMetadata(): { algorithm: string; version: number; keyId: string } {
    return {
      algorithm: this.algorithm,
      version: this.version,
      keyId: this.masterKeyId,
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

// Singleton instance for use across the application
let kmsManagerInstance: KMSManager | null = null;

/**
 * Get or create the KMS manager instance
 */
export function getKMSManager(): KMSManager {
  if (!kmsManagerInstance) {
    kmsManagerInstance = new KMSManager();
  }
  return kmsManagerInstance;
}

/**
 * Utility function to convert legacy pgcrypto format to KMS format
 * Used during migration from old encryption to new KMS encryption
 */
export function createLegacyDecryptionInput(encryptedText: string): DecryptionInput | null {
  // This is for backward compatibility with pgcrypto encrypted data
  // Returns null if the data is not in legacy format
  try {
    // Legacy format detection logic would go here
    // For now, return null to indicate this is not legacy data
    return null;
  } catch {
    return null;
  }
}

/**
 * Utility to serialize encryption result for database storage
 */
export function serializeEncryptionResult(result: EncryptionResult): string {
  return JSON.stringify(result);
}

/**
 * Utility to deserialize encryption result from database
 */
export function deserializeEncryptionResult(serialized: string): DecryptionInput {
  try {
    const parsed = JSON.parse(serialized);
    
    // Validate the structure
    if (!parsed.encryptedData || !parsed.encryptedDataKey || !parsed.iv) {
      throw new Error("Invalid encryption result format");
    }
    
    return parsed as DecryptionInput;
  } catch (error) {
    throw new Error(`Failed to deserialize encryption result: ${error.message}`);
  }
}

/**
 * Audit logging helper for encryption operations
 */
export interface KMSAuditEvent {
  operation: 'encrypt' | 'decrypt' | 'health_check';
  keyId: string;
  success: boolean;
  errorMessage?: string;
  timestamp: string;
  userId?: string;
  ipAddress?: string;
}

export function createKMSAuditEvent(
  operation: 'encrypt' | 'decrypt' | 'health_check',
  keyId: string,
  success: boolean,
  errorMessage?: string,
  userId?: string,
  ipAddress?: string
): KMSAuditEvent {
  return {
    operation,
    keyId,
    success,
    errorMessage,
    timestamp: new Date().toISOString(),
    userId,
    ipAddress,
  };
}

/**
 * Simple wrapper functions for Edge Function compatibility
 * These provide a more convenient interface for the Edge Functions
 */

/**
 * Encrypt data using the specified key type
 * @param plaintext - The data to encrypt
 * @param keyType - Either 'PII' or 'PAYMENT'
 * @returns Serialized encrypted data ready for database storage
 */
export async function encryptData(plaintext: string, keyType: 'PII' | 'PAYMENT'): Promise<string> {
  const keyId = keyType === 'PII' ? 
    Deno.env.get('AWS_KMS_PII_KEY_ID') : 
    Deno.env.get('AWS_KMS_PAYMENT_KEY_ID');
  
  if (!keyId) {
    throw new Error(`Missing KMS key ID for ${keyType}`);
  }
  
  // Create KMS manager with the specific key
  const kms = new KMSManager({ 
    keyId,
    region: Deno.env.get('AWS_REGION') || 'us-east-1',
    accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID')!,
    secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY')!
  });
  
  const result = await kms.encryptData(plaintext);
  return serializeEncryptionResult(result);
}

/**
 * Decrypt data from serialized encrypted format
 * @param encryptedData - Serialized encrypted data from database
 * @returns The decrypted plaintext
 */
export async function decryptData(encryptedData: string): Promise<string> {
  const decryptionInput = deserializeEncryptionResult(encryptedData);
  
  // Create KMS manager (key ID is in the decryption input)
  const kms = new KMSManager({ 
    keyId: decryptionInput.keyId,
    region: Deno.env.get('AWS_REGION') || 'us-east-1',
    accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID')!,
    secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY')!
  });
  
  return await kms.decryptData(decryptionInput);
}
