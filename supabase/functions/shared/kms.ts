import { KMSClient, EncryptCommand, DecryptCommand } from "npm:@aws-sdk/client-kms";
import { NodeHttpHandler } from "npm:@aws-sdk/node-http-handler";

/**
 * AWS KMS utility functions for Parker Flight
 * Enhanced with production-grade configuration and error handling
 */

// Environment and configuration
const KMS_REGION = Deno.env.get("AWS_REGION") || "us-east-1";
const ENVIRONMENT = Deno.env.get("NODE_ENV") || "development";

// Enhanced KMS client with production-grade configuration
const kmsClient = new KMSClient({
  region: KMS_REGION,
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID")!,
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
  },
  maxAttempts: 3,
  retryMode: 'adaptive',
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 5000,
    socketTimeout: 30000,
  }),
});

// Production KMS Key Aliases (deployed successfully)
export const KMS_KEYS = {
  GENERAL: Deno.env.get("KMS_GENERAL_ALIAS") || "alias/parker-flight-general-production",
  PII: Deno.env.get("KMS_PII_ALIAS") || "alias/parker-flight-pii-production",
  PAYMENT: Deno.env.get("KMS_PAYMENT_ALIAS") || "alias/parker-flight-payment-production",
} as const;

export type KMSKeyType = keyof typeof KMS_KEYS;

/**
 * Encrypt data using AWS KMS
 * @param data - The data to encrypt (string or object)
 * @param keyType - The type of key to use for encryption
 * @returns Base64-encoded encrypted data
 */
export async function encryptData(
  data: string | object,
  keyType: KMSKeyType = "GENERAL"
): Promise<string> {
  try {
    const plaintext = typeof data === "string" ? data : JSON.stringify(data);
    
    const command = new EncryptCommand({
      KeyId: KMS_KEYS[keyType],
      Plaintext: new TextEncoder().encode(plaintext),
      EncryptionContext: {
        purpose: keyType === 'PAYMENT' ? 'payment-method-data' : keyType === 'PII' ? 'user-profile-data' : 'general-data',
        application: 'parker-flight',
      },
    });

    const response = await kmsClient.send(command);
    
    if (!response.CiphertextBlob) {
      throw new Error("No ciphertext returned from KMS");
    }

    // Convert to base64 for safe storage
    return btoa(String.fromCharCode(...new Uint8Array(response.CiphertextBlob)));
  } catch (error) {
    console.error("KMS encryption error:", error);
    throw new Error(`Failed to encrypt data: ${error.message}`);
  }
}

/**
 * Decrypt data using AWS KMS
 * @param encryptedData - Base64-encoded encrypted data
 * @param parseJson - Whether to parse the decrypted data as JSON
 * @returns Decrypted data
 */
export async function decryptData(
  encryptedData: string,
  parseJson = false
): Promise<string | object> {
  try {
    // Convert from base64
    const ciphertextBlob = new Uint8Array(
      atob(encryptedData)
        .split("")
        .map(char => char.charCodeAt(0))
    );

    const command = new DecryptCommand({
      CiphertextBlob: ciphertextBlob,
      // KMS will automatically use the encryption context from the encrypted data
    });

    const response = await kmsClient.send(command);
    
    if (!response.Plaintext) {
      throw new Error("No plaintext returned from KMS");
    }

    const decrypted = new TextDecoder().decode(response.Plaintext);
    
    return parseJson ? JSON.parse(decrypted) : decrypted;
  } catch (error) {
    console.error("KMS decryption error:", error);
    throw new Error(`Failed to decrypt data: ${error.message}`);
  }
}

/**
 * Encrypt PII data (personally identifiable information)
 * Uses the PII-specific KMS key
 */
export async function encryptPII(data: string | object): Promise<string> {
  return encryptData(data, "PII");
}

/**
 * Decrypt PII data
 * @param encryptedData - Base64-encoded encrypted PII data
 * @param parseJson - Whether to parse the decrypted data as JSON
 */
export async function decryptPII(
  encryptedData: string,
  parseJson = false
): Promise<string | object> {
  return decryptData(encryptedData, parseJson);
}

/**
 * Encrypt payment data
 * Uses the payment-specific KMS key
 */
export async function encryptPaymentData(data: string | object): Promise<string> {
  return encryptData(data, "PAYMENT");
}

/**
 * Decrypt payment data
 * @param encryptedData - Base64-encoded encrypted payment data
 * @param parseJson - Whether to parse the decrypted data as JSON
 */
export async function decryptPaymentData(
  encryptedData: string,
  parseJson = false
): Promise<string | object> {
  return decryptData(encryptedData, parseJson);
}

/**
 * Encrypt user profile data
 * Automatically determines the appropriate key based on data sensitivity
 */
export async function encryptUserProfile(profileData: {
  email?: string;
  phone?: string;
  name?: string;
  preferences?: object;
  [key: string]: unknown;
}): Promise<{ [key: string]: string }> {
  const encrypted: { [key: string]: string } = {};
  
  for (const [key, value] of Object.entries(profileData)) {
    if (value === null || value === undefined) continue;
    
    // Determine encryption key based on data sensitivity
    let keyType: KMSKeyType = "GENERAL";
    
    if (["email", "phone", "name", "passport", "ssn"].includes(key)) {
      keyType = "PII";
    } else if (["payment_method", "card_last4", "billing_address"].includes(key)) {
      keyType = "PAYMENT";
    }
    
    encrypted[key] = await encryptData(value, keyType);
  }
  
  return encrypted;
}

/**
 * Decrypt user profile data
 * Returns the original profile structure with decrypted values
 */
export async function decryptUserProfile(
  encryptedProfile: { [key: string]: string }
): Promise<{ [key: string]: unknown }> {
  const decrypted: { [key: string]: unknown } = {};
  
  for (const [key, encryptedValue] of Object.entries(encryptedProfile)) {
    try {
      // Try to parse as JSON first, fallback to string
      decrypted[key] = await decryptData(encryptedValue, true);
    } catch {
      decrypted[key] = await decryptData(encryptedValue, false);
    }
  }
  
  return decrypted;
}

/**
 * Validate KMS configuration
 * Returns true if all required environment variables are set
 */
export function validateKMSConfig(): boolean {
  const requiredEnvVars = [
    "AWS_REGION",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "KMS_GENERAL_ALIAS",
    "KMS_PII_ALIAS",
    "KMS_PAYMENT_ALIAS",
  ];
  
  return requiredEnvVars.every(varName => {
    const value = Deno.env.get(varName);
    return value !== undefined && value !== "";
  });
}

/**
 * Test KMS functionality
 * Encrypts and decrypts a test message to verify KMS is working
 */
export async function testKMS(): Promise<boolean> {
  try {
    const testData = "Parker Flight KMS Test";
    const encrypted = await encryptData(testData);
    const decrypted = await decryptData(encrypted);
    
    return decrypted === testData;
  } catch (error) {
    console.error("KMS test failed:", error);
    return false;
  }
}

/**
 * Enhanced error handler for KMS operations
 */
export function analyzeKMSError(error: Error): {
  category: string;
  retryable: boolean;
  suggestions: string[];
} {
  const errorMessage = error.message.toLowerCase();
  
  // Key-related errors
  if (errorMessage.includes('key') && errorMessage.includes('disabled')) {
    return {
      category: 'KEY_DISABLED',
      retryable: false,
      suggestions: [
        'Enable the KMS key in AWS console',
        'Check key permissions and policies',
        'Verify the key is not scheduled for deletion'
      ]
    };
  }
  
  if (errorMessage.includes('access denied') || errorMessage.includes('unauthorized')) {
    return {
      category: 'ACCESS_DENIED',
      retryable: false,
      suggestions: [
        'Check AWS credentials are valid and not expired',
        'Verify IAM permissions for KMS operations',
        'Ensure the key policy allows the current principal'
      ]
    };
  }
  
  if (errorMessage.includes('throttl') || errorMessage.includes('rate')) {
    return {
      category: 'THROTTLED',
      retryable: true,
      suggestions: [
        'Implement exponential backoff',
        'Reduce request rate',
        'Consider request limits for your key'
      ]
    };
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
    return {
      category: 'NETWORK_ERROR',
      retryable: true,
      suggestions: [
        'Check network connectivity',
        'Verify AWS service endpoints are reachable',
        'Consider increasing timeout values'
      ]
    };
  }
  
  // Default unknown error
  return {
    category: 'UNKNOWN_ERROR',
    retryable: true,
    suggestions: [
      'Check AWS service health',
      'Review error logs for more details',
      'Consider contacting AWS support'
    ]
  };
}

/**
 * Safe KMS operation wrapper with retry logic
 */
export async function safeKMSOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      const errorAnalysis = analyzeKMSError(lastError);
      
      console.warn(`KMS operation '${operationName}' failed (attempt ${attempt}/${maxRetries}):`, {
        error: errorAnalysis.category,
        retryable: errorAnalysis.retryable,
        message: lastError.message
      });
      
      // Don't retry if error is not retryable or we've exhausted retries
      if (!errorAnalysis.retryable || attempt === maxRetries) {
        console.error(`KMS operation '${operationName}' failed permanently:`, {
          category: errorAnalysis.category,
          suggestions: errorAnalysis.suggestions
        });
        break;
      }
      
      // Wait before retry with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Create audit log for KMS operations
 */
export function createKMSAuditLog(
  operation: string,
  success: boolean,
  keyType?: KMSKeyType,
  metadata?: Record<string, unknown>
): Record<string, unknown> {
  return {
    operation,
    success,
    keyType,
    keyAlias: keyType ? KMS_KEYS[keyType] : undefined,
    timestamp: new Date().toISOString(),
    region: KMS_REGION,
    environment: ENVIRONMENT,
    metadata: metadata || {},
  };
}
