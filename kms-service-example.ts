// kms-service.ts
import { KMSClient, EncryptCommand, DecryptCommand, GenerateDataKeyCommand } from "@aws-sdk/client-kms";

interface KMSConfig {
  region: string;
  keyId: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export class KMSService {
  private client: KMSClient;
  private keyId: string;

  constructor(config?: KMSConfig) {
    const environment = process.env.NODE_ENV || 'development';
    
    // Environment-specific configuration
    const defaultConfig = this.getEnvironmentConfig(environment);
    const finalConfig = { ...defaultConfig, ...config };
    
    this.client = new KMSClient({
      region: finalConfig.region,
      credentials: finalConfig.credentials,
    });
    
    this.keyId = finalConfig.keyId;
  }

  private getEnvironmentConfig(environment: string): KMSConfig {
    const configs = {
      development: {
        region: process.env.AWS_REGION || 'us-east-1',
        keyId: process.env.KMS_DEV_KEY_ID || 'arn:aws:kms:us-east-1:123456789012:key/dev-key-id',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        }
      },
      staging: {
        region: process.env.AWS_REGION || 'us-east-1',
        keyId: process.env.KMS_STAGING_KEY_ID || 'arn:aws:kms:us-east-1:123456789012:key/staging-key-id',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        }
      },
      production: {
        region: process.env.AWS_REGION || 'us-east-1',
        keyId: process.env.KMS_PROD_KEY_ID || 'arn:aws:kms:us-east-1:123456789012:key/prod-key-id',
        // In production, use IAM roles instead of access keys
      }
    };

    return configs[environment] || configs.development;
  }

  async encrypt(plaintext: string, context?: Record<string, string>): Promise<string> {
    try {
      const command = new EncryptCommand({
        KeyId: this.keyId,
        Plaintext: Buffer.from(plaintext, 'utf-8'),
        EncryptionContext: context,
      });

      const result = await this.client.send(command);
      return Buffer.from(result.CiphertextBlob!).toString('base64');
    } catch (error) {
      console.error('KMS encryption failed:', error);
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  async decrypt(ciphertext: string, context?: Record<string, string>): Promise<string> {
    try {
      const command = new DecryptCommand({
        CiphertextBlob: Buffer.from(ciphertext, 'base64'),
        EncryptionContext: context,
      });

      const result = await this.client.send(command);
      return Buffer.from(result.Plaintext!).toString('utf-8');
    } catch (error) {
      console.error('KMS decryption failed:', error);
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  async generateDataKey(keySpec: 'AES_256' | 'AES_128' = 'AES_256'): Promise<{
    plaintextKey: Buffer;
    encryptedKey: string;
  }> {
    try {
      const command = new GenerateDataKeyCommand({
        KeyId: this.keyId,
        KeySpec: keySpec,
      });

      const result = await this.client.send(command);
      
      return {
        plaintextKey: Buffer.from(result.Plaintext!),
        encryptedKey: Buffer.from(result.CiphertextBlob!).toString('base64'),
      };
    } catch (error) {
      console.error('KMS data key generation failed:', error);
      throw new Error(`Data key generation failed: ${error.message}`);
    }
  }
}

// Mock service for testing
export class MockKMSService {
  async encrypt(plaintext: string, context?: Record<string, string>): Promise<string> {
    // Simple base64 encoding for testing
    return Buffer.from(JSON.stringify({ data: plaintext, context })).toString('base64');
  }

  async decrypt(ciphertext: string, context?: Record<string, string>): Promise<string> {
    // Simple base64 decoding for testing
    const decoded = JSON.parse(Buffer.from(ciphertext, 'base64').toString('utf-8'));
    return decoded.data;
  }

  async generateDataKey(): Promise<{ plaintextKey: Buffer; encryptedKey: string }> {
    const mockKey = Buffer.from('mock-32-byte-key-for-testing-only!!');
    return {
      plaintextKey: mockKey,
      encryptedKey: Buffer.from('mock-encrypted-key').toString('base64'),
    };
  }
}

// Factory function to get appropriate service
export function createKMSService(): KMSService | MockKMSService {
  return process.env.NODE_ENV === 'test' ? new MockKMSService() : new KMSService();
}
