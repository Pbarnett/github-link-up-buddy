/**
 * KMS Integration Tests
 * Implements AWS AI bot's hybrid testing strategy:
 * - Mocked KMS responses for unit tests
 * - Real AWS KMS in development environment
 * - Comprehensive error scenarios
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PaymentKMSService, PaymentKMSConfig, PaymentData } from '../../../services/kms/PaymentKMSService';
import { KMSClient } from '@aws-sdk/client-kms';

// Mock configuration for testing
const mockKMSConfig: PaymentKMSConfig = {
  primaryRegion: 'us-east-1',
  fallbackRegions: ['us-west-2'],
  keyAliases: {
    general: 'alias/parker-flight-general-test',
    pii: 'alias/parker-flight-pii-test',
    payment: 'alias/parker-flight-payment-test',
  },
};

// Test data
const mockPaymentData: PaymentData = {
  cardNumber: '4242424242424242',
  cvv: '123',
  expiryDate: '12/25',
  billingAddress: {
    line1: '123 Test St',
    city: 'Test City',
    state: 'CA',
    postal_code: '12345',
    country: 'US',
  },
  fingerprint: 'test_fingerprint',
};

// Mock KMS responses
const mockGenerateDataKeyResponse = {
  KeyId: 'alias/parker-flight-payment-test',
  Plaintext: new Uint8Array(32).fill(1), // Mock 256-bit key
  CiphertextBlob: new Uint8Array(64).fill(2), // Mock encrypted key
};

const mockDecryptResponse = {
  KeyId: 'alias/parker-flight-payment-test',
  Plaintext: new Uint8Array(32).fill(1), // Same mock key
};

describe('PaymentKMSService', () => {
  let kmsService: PaymentKMSService;
  let mockKMSClient: any;

  beforeEach(() => {
    // Mock the KMS client
    mockKMSClient = {
      send: vi.fn(),
    };
    
    // Mock the KMSClient constructor
    vi.mocked(KMSClient).mockImplementation(() => mockKMSClient);
    
    kmsService = new PaymentKMSService(mockKMSConfig);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Unit Tests (Mocked KMS)', () => {
    it('should encrypt payment data successfully', async () => {
      // Mock successful data key generation
      mockKMSClient.send.mockResolvedValueOnce(mockGenerateDataKeyResponse);
      
      const result = await kmsService.encryptPaymentData(mockPaymentData);
      
      expect(result).toMatchObject({
        encryptedData: expect.any(String),
        encryptedDataKey: expect.any(String),
        iv: expect.any(String),
        algorithm: 'AES-GCM',
        keyId: mockKMSConfig.keyAliases.payment,
        version: 2,
        region: 'us-east-1',
      });
      
      expect(mockKMSClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            KeyId: mockKMSConfig.keyAliases.payment,
            KeySpec: 'AES_256',
          }),
        })
      );
    });

    it('should decrypt payment data successfully', async () => {
      // First encrypt data
      mockKMSClient.send.mockResolvedValueOnce(mockGenerateDataKeyResponse);
      const encrypted = await kmsService.encryptPaymentData(mockPaymentData);
      
      // Then mock decrypt response
      mockKMSClient.send.mockResolvedValueOnce(mockDecryptResponse);
      
      const decrypted = await kmsService.decryptPaymentData(encrypted);
      
      expect(decrypted).toEqual(mockPaymentData);
    });

    it('should handle encryption errors gracefully', async () => {
      // Mock KMS error
      mockKMSClient.send.mockRejectedValueOnce(
        new Error('AccessDeniedException: User is not authorized')
      );
      
      await expect(kmsService.encryptPaymentData(mockPaymentData))
        .rejects.toThrow('Payment data encryption failed in all regions');
    });

    it('should handle decryption errors gracefully', async () => {
      // Create a mock encrypted data object
      const mockEncryptedData = {
        encryptedData: 'mock-encrypted-data',
        encryptedDataKey: 'mock-encrypted-key',
        iv: 'mock-iv',
        algorithm: 'AES-GCM',
        keyId: mockKMSConfig.keyAliases.payment,
        version: 2,
        region: 'us-east-1',
      };
      
      // Mock KMS error during decryption
      mockKMSClient.send.mockRejectedValueOnce(
        new Error('InvalidCiphertextException: Invalid ciphertext')
      );
      
      await expect(kmsService.decryptPaymentData(mockEncryptedData))
        .rejects.toThrow('Failed to decrypt payment data');
    });

    it('should failover to backup regions on primary failure', async () => {
      // Mock primary region failure
      mockKMSClient.send
        .mockRejectedValueOnce(new Error('Primary region unavailable'))
        // Mock successful fallback
        .mockResolvedValueOnce(mockGenerateDataKeyResponse);
      
      const result = await kmsService.encryptPaymentData(mockPaymentData);
      
      expect(result.region).toBe('us-west-2'); // Should use fallback region
      expect(mockKMSClient.send).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle missing data key in response', async () => {
      // Mock response with missing data
      mockKMSClient.send.mockResolvedValueOnce({
        KeyId: 'test-key',
        // Missing Plaintext and CiphertextBlob
      });
      
      await expect(kmsService.encryptPaymentData(mockPaymentData))
        .rejects.toThrow('Failed to generate data encryption key');
    });

    it('should handle missing plaintext in decrypt response', async () => {
      const mockEncryptedData = {
        encryptedData: 'mock-encrypted-data',
        encryptedDataKey: 'mock-encrypted-key',
        iv: 'mock-iv',
        algorithm: 'AES-GCM',
        keyId: mockKMSConfig.keyAliases.payment,
        version: 2,
        region: 'us-east-1',
      };
      
      // Mock response with missing plaintext
      mockKMSClient.send.mockResolvedValueOnce({
        KeyId: 'test-key',
        // Missing Plaintext
      });
      
      await expect(kmsService.decryptPaymentData(mockEncryptedData))
        .rejects.toThrow('Failed to decrypt data encryption key');
    });

    it('should handle invalid region in encrypted data', async () => {
      const invalidEncryptedData = {
        encryptedData: 'mock-encrypted-data',
        encryptedDataKey: 'mock-encrypted-key',
        iv: 'mock-iv',
        algorithm: 'AES-GCM',
        keyId: mockKMSConfig.keyAliases.payment,
        version: 2,
        region: 'invalid-region',
      };
      
      await expect(kmsService.decryptPaymentData(invalidEncryptedData))
        .rejects.toThrow('No KMS client available for region: invalid-region');
    });
  });

  describe('Health Check', () => {
    it('should return healthy status when all regions are accessible', async () => {
      // Mock successful health checks for all regions
      mockKMSClient.send
        .mockResolvedValueOnce(mockGenerateDataKeyResponse) // Primary region encrypt
        .mockResolvedValueOnce(mockDecryptResponse)         // Primary region decrypt
        .mockResolvedValueOnce(mockGenerateDataKeyResponse) // Fallback region encrypt
        .mockResolvedValueOnce(mockDecryptResponse);        // Fallback region decrypt
      
      const healthCheck = await kmsService.healthCheck();
      
      expect(healthCheck.status).toBe('healthy');
      expect(healthCheck.regions['us-east-1'].status).toBe('healthy');
      expect(healthCheck.regions['us-west-2'].status).toBe('healthy');
    });

    it('should return unhealthy status when all regions fail', async () => {
      // Mock failures for all regions
      mockKMSClient.send.mockRejectedValue(new Error('All regions down'));
      
      const healthCheck = await kmsService.healthCheck();
      
      expect(healthCheck.status).toBe('unhealthy');
      expect(healthCheck.regions['us-east-1'].status).toBe('unhealthy');
      expect(healthCheck.regions['us-west-2'].status).toBe('unhealthy');
    });

    it('should measure latency for each region', async () => {
      // Mock successful responses with artificial delay
      mockKMSClient.send.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve(mockGenerateDataKeyResponse), 100)
        )
      );
      
      const healthCheck = await kmsService.healthCheck();
      
      expect(healthCheck.regions['us-east-1'].latency).toBeGreaterThan(50);
      expect(healthCheck.regions['us-west-2'].latency).toBeGreaterThan(50);
    });
  });

  describe('Different Key Types', () => {
    it('should encrypt with PII key when specified', async () => {
      mockKMSClient.send.mockResolvedValueOnce(mockGenerateDataKeyResponse);
      
      const piiData = { email: 'test@example.com', phone: '+1234567890' };
      await kmsService.encryptPaymentData(piiData, 'pii');
      
      expect(mockKMSClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            KeyId: mockKMSConfig.keyAliases.pii,
          }),
        })
      );
    });

    it('should encrypt with general key when specified', async () => {
      mockKMSClient.send.mockResolvedValueOnce(mockGenerateDataKeyResponse);
      
      const generalData = { preferences: { theme: 'dark' } };
      await kmsService.encryptPaymentData(generalData, 'general');
      
      expect(mockKMSClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            KeyId: mockKMSConfig.keyAliases.general,
          }),
        })
      );
    });
  });

  describe('Encryption Context', () => {
    it('should include proper encryption context for payment data', async () => {
      mockKMSClient.send.mockResolvedValueOnce(mockGenerateDataKeyResponse);
      
      await kmsService.encryptPaymentData(mockPaymentData, 'payment');
      
      expect(mockKMSClient.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            EncryptionContext: expect.objectContaining({
              purpose: 'payment-data',
              application: 'parker-flight',
              region: 'us-east-1',
            }),
          }),
        })
      );
    });

    it('should validate encryption context during decryption', async () => {
      // First encrypt with context
      mockKMSClient.send.mockResolvedValueOnce(mockGenerateDataKeyResponse);
      const encrypted = await kmsService.encryptPaymentData(mockPaymentData, 'payment');
      
      // Then decrypt - context should be automatically validated
      mockKMSClient.send.mockResolvedValueOnce(mockDecryptResponse);
      await kmsService.decryptPaymentData(encrypted);
      
      expect(mockKMSClient.send).toHaveBeenLastCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            EncryptionContext: expect.objectContaining({
              purpose: 'payment-data',
              application: 'parker-flight',
            }),
          }),
        })
      );
    });
  });
});

// Integration Tests (Run against real KMS in development)
describe('PaymentKMSService Integration Tests', () => {
  // These tests run against real AWS KMS in development environment
  // Skip in CI/test environments to avoid AWS charges
  const skipIntegration = process.env.NODE_ENV === 'test' || 
                         process.env.CI === 'true' ||
                         !process.env.AWS_ACCESS_KEY_ID;

  if (skipIntegration) {
    it.skip('Integration tests skipped - set up AWS credentials to run', () => {});
    return;
  }

  let integrationKMSService: PaymentKMSService;

  beforeEach(() => {
    // Use real AWS credentials and test keys
    const integrationConfig: PaymentKMSConfig = {
      primaryRegion: process.env.AWS_REGION || 'us-east-1',
      fallbackRegions: ['us-west-2'],
      keyAliases: {
        general: process.env.KMS_GENERAL_ALIAS || 'alias/parker-flight-general-test',
        pii: process.env.KMS_PII_ALIAS || 'alias/parker-flight-pii-test',
        payment: process.env.KMS_PAYMENT_ALIAS || 'alias/parker-flight-payment-test',
      },
    };
    
    integrationKMSService = new PaymentKMSService(integrationConfig);
  });

  it('should encrypt and decrypt real payment data', async () => {
    const testPaymentData: PaymentData = {
      cardNumber: '4242424242424242', // Test card number
      cvv: '123',
      expiryDate: '12/25',
      fingerprint: 'test_integration_fingerprint',
    };
    
    // Test encryption
    const encrypted = await integrationKMSService.encryptPaymentData(testPaymentData);
    expect(encrypted).toMatchObject({
      encryptedData: expect.any(String),
      encryptedDataKey: expect.any(String),
      iv: expect.any(String),
      algorithm: 'AES-GCM',
      version: 2,
    });
    
    // Test decryption
    const decrypted = await integrationKMSService.decryptPaymentData(encrypted);
    expect(decrypted).toEqual(testPaymentData);
  }, 10000); // 10 second timeout for AWS calls

  it('should perform real health check across regions', async () => {
    const healthCheck = await integrationKMSService.healthCheck();
    
    expect(healthCheck).toMatchObject({
      status: expect.stringMatching(/^(healthy|degraded|unhealthy)$/),
      regions: expect.any(Object),
    });
    
    // At least primary region should be testable
    const primaryRegion = process.env.AWS_REGION || 'us-east-1';
    expect(healthCheck.regions[primaryRegion]).toBeDefined();
  }, 15000); // 15 second timeout for health check

  it('should test all three key types', async () => {
    const testData = { test: 'integration-test', timestamp: Date.now() };
    
    // Test general key
    const generalEncrypted = await integrationKMSService.encryptPaymentData(testData, 'general');
    const generalDecrypted = await integrationKMSService.decryptPaymentData(generalEncrypted);
    expect(generalDecrypted).toEqual(testData);
    
    // Test PII key
    const piiEncrypted = await integrationKMSService.encryptPaymentData(testData, 'pii');
    const piiDecrypted = await integrationKMSService.decryptPaymentData(piiEncrypted);
    expect(piiDecrypted).toEqual(testData);
    
    // Test payment key
    const paymentEncrypted = await integrationKMSService.encryptPaymentData(testData, 'payment');
    const paymentDecrypted = await integrationKMSService.decryptPaymentData(paymentEncrypted);
    expect(paymentDecrypted).toEqual(testData);
  }, 20000); // 20 second timeout for multiple key tests
});
