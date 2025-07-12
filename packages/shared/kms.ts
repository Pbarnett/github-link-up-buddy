import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';

// KMS Configuration
const KMS_KEY_ID = 'parker-kms-key';
const KMS_REGION = process.env.AWS_REGION || 'us-east-1';

// Initialize KMS client
const kmsClient = new KMSClient({ 
  region: KMS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
});

export interface PaymentMethodData {
  fingerprint?: string;
  network?: string;
  wallet?: string;
  three_d_secure_usage?: {
    supported: boolean;
  };
  [key: string]: any;
}

export interface EncryptedPaymentData {
  encryptedData: Uint8Array;
  encryptionKeyId: string;
  encryptionVersion: number;
}

/**
 * Encrypt sensitive payment method data using AWS KMS
 */
export async function encryptPaymentData(
  data: PaymentMethodData, 
  keyId: string = KMS_KEY_ID
): Promise<EncryptedPaymentData> {
  try {
    const plaintext = JSON.stringify(data);
    
    const command = new EncryptCommand({
      KeyId: keyId,
      Plaintext: Buffer.from(plaintext, 'utf8'),
      EncryptionContext: {
        purpose: 'payment-method-data',
        version: '1',
        timestamp: new Date().toISOString(),
      },
    });

    const response = await kmsClient.send(command);
    
    if (!response.CiphertextBlob) {
      throw new Error('KMS encryption failed: no ciphertext returned');
    }

    return {
      encryptedData: response.CiphertextBlob,
      encryptionKeyId: keyId,
      encryptionVersion: 1,
    };
  } catch (error) {
    console.error('KMS encryption error:', error);
    throw new Error(`Failed to encrypt payment data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decrypt sensitive payment method data using AWS KMS
 */
export async function decryptPaymentData(
  encryptedData: Uint8Array
): Promise<PaymentMethodData> {
  try {
    const command = new DecryptCommand({
      CiphertextBlob: encryptedData,
      EncryptionContext: {
        purpose: 'payment-method-data',
        version: '1',
      },
    });

    const response = await kmsClient.send(command);
    
    if (!response.Plaintext) {
      throw new Error('KMS decryption failed: no plaintext returned');
    }

    const decryptedText = Buffer.from(response.Plaintext).toString('utf8');
    return JSON.parse(decryptedText);
  } catch (error) {
    console.error('KMS decryption error:', error);
    throw new Error(`Failed to decrypt payment data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Rotate encryption for existing payment method data
 */
export async function rotateEncryption(
  oldEncryptedData: Uint8Array,
  newKeyId: string = KMS_KEY_ID
): Promise<EncryptedPaymentData> {
  try {
    // Decrypt with old key
    const decryptedData = await decryptPaymentData(oldEncryptedData);
    
    // Re-encrypt with new key
    return await encryptPaymentData(decryptedData, newKeyId);
  } catch (error) {
    console.error('Encryption rotation error:', error);
    throw new Error(`Failed to rotate encryption: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate KMS key accessibility
 */
export async function validateKMSKey(keyId: string = KMS_KEY_ID): Promise<boolean> {
  try {
    const testData = { test: 'validation' };
    const encrypted = await encryptPaymentData(testData, keyId);
    const decrypted = await decryptPaymentData(encrypted.encryptedData);
    
    return JSON.stringify(testData) === JSON.stringify(decrypted);
  } catch (error) {
    console.error('KMS key validation error:', error);
    return false;
  }
}

/**
 * Create audit log entry for encryption operations
 */
export function createEncryptionAuditLog(
  operation: 'encrypt' | 'decrypt' | 'rotate',
  success: boolean,
  keyId: string = KMS_KEY_ID,
  metadata?: Record<string, any>
): Record<string, any> {
  return {
    operation,
    success,
    keyId,
    timestamp: new Date().toISOString(),
    metadata: metadata || {},
    aws_region: KMS_REGION,
  };
}

/**
 * Helper function to safely handle KMS operations with retries
 */
export async function safeKMSOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

/**
 * Environment validation for KMS operations
 */
export function validateKMSEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!process.env.AWS_ACCESS_KEY_ID) {
    errors.push('AWS_ACCESS_KEY_ID is not set');
  }
  
  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    errors.push('AWS_SECRET_ACCESS_KEY is not set');
  }
  
  if (!process.env.AWS_REGION) {
    errors.push('AWS_REGION is not set (defaulting to us-east-1)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
