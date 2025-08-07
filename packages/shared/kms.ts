import { EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';
import { EnhancedAWSClientFactory, Environment } from '../src/lib/aws-sdk-enhanced/client-factory';
import { EnhancedAWSErrorHandler } from '../src/lib/aws-sdk-enhanced/error-handling';
import { MultiRegionAWSManager } from '../src/lib/aws-sdk-enhanced/multi-region-manager';

// KMS Configuration - Production Keys from AWS SDK Enhanced Integration
const KMS_REGION = process.env.AWS_REGION || 'us-east-1';
const ENVIRONMENT = (process.env.NODE_ENV as Environment) || 'development';

// Production KMS Key Aliases (deployed successfully)
const KMS_KEYS = {
  GENERAL: process.env.KMS_GENERAL_ALIAS || 'alias/parker-flight-general-production',
  PII: process.env.KMS_PII_ALIAS || 'alias/parker-flight-pii-production', 
  PAYMENT: process.env.KMS_PAYMENT_ALIAS || 'alias/parker-flight-payment-production',
} as const;

type KMSKeyType = keyof typeof KMS_KEYS;

// Initialize enhanced KMS client with production-grade configuration
export const kmsClient = EnhancedAWSClientFactory.createKMSClient({
  region: KMS_REGION,
  environment: ENVIRONMENT,
  enableMetrics: true,
  enableLogging: ENVIRONMENT !== 'production',
  maxAttempts: 3,
  connectionTimeout: 5000,
  socketTimeout: 30000,
});

// Initialize multi-region manager for high availability
const multiRegionManager = new MultiRegionAWSManager({
  primaryRegion: KMS_REGION,
  backupRegions: ['us-west-2', 'eu-west-1'],
  services: ['kms'],
  environment: ENVIRONMENT,
});

export interface PaymentMethodData {
  fingerprint?: string;
  network?: string;
  wallet?: string;
  three_d_secure_usage?: {
    supported: boolean;
  };
  [key: string]: unknown;
}

export interface EncryptedPaymentData {
  encryptedData: Uint8Array;
  encryptionKeyId: string;
  encryptionVersion: number;
}

/**
 * Encrypt sensitive payment method data using AWS KMS with enhanced error handling
 */
export async function encryptPaymentData(
  data: PaymentMethodData, 
  keyType: KMSKeyType = 'PAYMENT'
): Promise<EncryptedPaymentData> {
  const keyId = KMS_KEYS[keyType];
  try {
    const plaintext = JSON.stringify(data);
    
    const command = new EncryptCommand({
      KeyId: keyId,
      Plaintext: Buffer.from(plaintext, 'utf8'),
      EncryptionContext: {
        purpose: 'payment-method-data',
        application: 'parker-flight',
        version: '2', // Version 2 = Enhanced AWS SDK Integration
        timestamp: new Date().toISOString(),
      },
    });

    // Use multi-region manager for high availability
    const response = await multiRegionManager.executeWithFailover(
      'kms',
      async (client) => await client.send(command),
      { operation: 'encrypt', keyId }
    );
    
    if (!response.CiphertextBlob) {
      throw new Error('KMS encryption failed: no ciphertext returned');
    }

    // Create audit log for successful encryption
    const auditLog = createEncryptionAuditLog('encrypt', true, keyId, {
      dataSize: plaintext.length,
      encryptionContext: command.input.EncryptionContext,
    });
    console.info('Payment data encrypted successfully:', auditLog);

    return {
      encryptedData: response.CiphertextBlob,
      encryptionKeyId: keyId,
      encryptionVersion: 1,
    };
  } catch (error) {
    // Use enhanced error handling for detailed diagnostics
    const enhancedError = EnhancedAWSErrorHandler.analyzeError(
      error as Error,
      'kms',
      'encrypt'
    );
    
    // Create audit log for failed encryption
    const auditLog = createEncryptionAuditLog('encrypt', false, keyId, {
      errorCategory: enhancedError.category,
      errorCode: enhancedError.code,
      retryable: enhancedError.retryable,
    });
    console.error('Payment data encryption failed:', auditLog);
    
    // Provide actionable error message with suggestions
    const errorMessage = `Failed to encrypt payment data: ${enhancedError.message}. Suggestions: ${enhancedError.suggestions.join(', ')}`;
    throw new Error(errorMessage);
  }
}

/**
 * Decrypt sensitive payment method data using AWS KMS with enhanced error handling
 */
export async function decryptPaymentData(
  encryptedData: Uint8Array
): Promise<PaymentMethodData> {
  try {
    const command = new DecryptCommand({
      CiphertextBlob: encryptedData,
      EncryptionContext: {
        purpose: 'payment-method-data',
        application: 'parker-flight',
        version: '2',
      },
    });

    // Use multi-region manager for high availability
    const response = await multiRegionManager.executeWithFailover(
      'kms',
      async (client) => await client.send(command),
      { operation: 'decrypt' }
    );
    
    if (!response.Plaintext) {
      throw new Error('KMS decryption failed: no plaintext returned');
    }

    const decryptedText = Buffer.from(response.Plaintext).toString('utf8');
    const result = JSON.parse(decryptedText);
    
    // Create audit log for successful decryption
    const auditLog = createEncryptionAuditLog('decrypt', true, response.KeyId || 'unknown', {
      dataSize: decryptedText.length,
      encryptionContext: command.input.EncryptionContext,
    });
    console.info('Payment data decrypted successfully:', auditLog);
    
    return result;
  } catch (error) {
    // Use enhanced error handling for detailed diagnostics
    const enhancedError = EnhancedAWSErrorHandler.analyzeError(
      error as Error,
      'kms',
      'decrypt'
    );
    
    // Create audit log for failed decryption
    const auditLog = createEncryptionAuditLog('decrypt', false, 'unknown', {
      errorCategory: enhancedError.category,
      errorCode: enhancedError.code,
      retryable: enhancedError.retryable,
    });
    console.error('Payment data decryption failed:', auditLog);
    
    // Provide actionable error message with suggestions
    const errorMessage = `Failed to decrypt payment data: ${enhancedError.message}. Suggestions: ${enhancedError.suggestions.join(', ')}`;
    throw new Error(errorMessage);
  }
}

/**
 * Rotate encryption for existing payment method data
 */
export async function rotateEncryption(
  oldEncryptedData: Uint8Array,
  newKeyType: KMSKeyType = 'PAYMENT'
): Promise<EncryptedPaymentData> {
  try {
    // Decrypt with old key
    const decryptedData = await decryptPaymentData(oldEncryptedData);
    
    // Re-encrypt with new key
    return await encryptPaymentData(decryptedData, newKeyType);
  } catch (error) {
    console.error('Encryption rotation error:', error);
    throw new Error(`Failed to rotate encryption: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate KMS key accessibility
 */
export async function validateKMSKey(keyType: KMSKeyType = 'PAYMENT'): Promise<boolean> {
  try {
    const testData = { test: 'validation' };
    const encrypted = await encryptPaymentData(testData, keyType);
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
  keyId: string,
  metadata?: Record<string, unknown>
): Record<string, unknown> {
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
 * Enhanced KMS operation handler with intelligent retry logic
 */
export async function safeKMSOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Analyze error to determine if retry is appropriate
      const enhancedError = EnhancedAWSErrorHandler.analyzeError(
        lastError,
        'kms',
        operationName
      );
      
      console.warn(`KMS operation '${operationName}' failed (attempt ${attempt}/${maxRetries}):`, {
        error: enhancedError.code,
        category: enhancedError.category,
        retryable: enhancedError.retryable,
        message: enhancedError.message
      });
      
      // Don't retry if error is not retryable
      if (!enhancedError.retryable || attempt === maxRetries) {
        break;
      }
      
      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        baseDelayMs * Math.pow(2, attempt - 1),
        30000 // Max 30 seconds
      );
      const jitter = delay * 0.1 * Math.random();
      const totalDelay = delay + jitter;
      
      console.info(`Retrying KMS operation '${operationName}' in ${Math.round(totalDelay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, totalDelay));
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
