import { KMSClient, EncryptCommand, DecryptCommand } from "npm:@aws-sdk/client-kms";

/**
 * AWS KMS utility functions for Parker Flight
 * Provides secure encryption/decryption for sensitive data
 */

// Initialize KMS client
const kmsClient = new KMSClient({
  region: Deno.env.get("AWS_REGION") || "us-east-1",
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID")!,
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
  },
});

// Key aliases for different data types
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
