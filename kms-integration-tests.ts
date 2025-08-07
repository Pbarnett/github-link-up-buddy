// tests/kms.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { KMSService, MockKMSService, createKMSService } from '../kms-service-example';

describe('KMS Integration Tests', () => {
  let kmsService: KMSService | MockKMSService;
  
  beforeAll(async () => {
    // Use real KMS for integration tests, mock for unit tests
    kmsService = createKMSService();
  });

  describe('Encryption/Decryption Flow', () => {
    it('should encrypt and decrypt payment data successfully', async () => {
      const originalData = JSON.stringify({
        stripe_payment_intent: 'pi_1234567890',
        customer_id: 'cus_1234567890',
        amount: 2000,
        currency: 'usd'
      });

      const context = {
        'payment-id': 'pay_123',
        'user-id': 'user_456',
        'environment': process.env.NODE_ENV || 'test'
      };
      
      // Test encryption
      const encrypted = await kmsService.encrypt(originalData, context);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(originalData);
      expect(encrypted.length).toBeGreaterThan(0);
      
      // Test decryption
      const decrypted = await kmsService.decrypt(encrypted, context);
      expect(decrypted).toBe(originalData);
      
      // Verify the data structure
      const decryptedObject = JSON.parse(decrypted);
      expect(decryptedObject.stripe_payment_intent).toBe('pi_1234567890');
      expect(decryptedObject.amount).toBe(2000);
    });

    it('should handle encryption context validation', async () => {
      const testData = 'sensitive-user-data';
      const context1 = { 'user-id': 'user123' };
      const context2 = { 'user-id': 'user456' }; // Different context
      
      const encrypted = await kmsService.encrypt(testData, context1);
      
      // Should decrypt successfully with correct context
      const decrypted1 = await kmsService.decrypt(encrypted, context1);
      expect(decrypted1).toBe(testData);
      
      // Should fail with incorrect context (only for real KMS)
      if (kmsService instanceof KMSService) {
        await expect(kmsService.decrypt(encrypted, context2)).rejects.toThrow();
      }
    });

    it('should handle large data encryption', async () => {
      // Test with larger payload (simulating detailed payment metadata)
      const largeData = JSON.stringify({
        stripe_payment_intent: 'pi_1234567890',
        customer_details: {
          id: 'cus_1234567890',
          name: 'John Doe',
          email: 'john@example.com',
          address: {
            line1: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            postal_code: '94105',
            country: 'US'
          }
        },
        payment_method: {
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2025
          }
        },
        amount: 5000,
        currency: 'usd',
        metadata: {
          order_id: 'ord_1234567890',
          product_ids: ['prod_1', 'prod_2', 'prod_3'],
          timestamp: new Date().toISOString()
        }
      });
      
      const encrypted = await kmsService.encrypt(largeData);
      const decrypted = await kmsService.decrypt(encrypted);
      
      expect(decrypted).toBe(largeData);
      const parsedData = JSON.parse(decrypted);
      expect(parsedData.customer_details.email).toBe('john@example.com');
      expect(parsedData.metadata.product_ids).toHaveLength(3);
    });
  });

  describe('Data Key Generation', () => {
    it('should generate data keys for envelope encryption', async () => {
      if (!(kmsService instanceof KMSService)) {
        // Skip for mock service
        return;
      }

      const dataKey = await (kmsService as KMSService).generateDataKey('AES_256');
      
      expect(dataKey.plaintextKey).toBeDefined();
      expect(dataKey.encryptedKey).toBeDefined();
      expect(dataKey.plaintextKey).toHaveLength(32); // 256 bits = 32 bytes
      expect(dataKey.encryptedKey.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid encrypted data gracefully', async () => {
      const invalidCiphertext = 'invalid-base64-data';
      
      await expect(kmsService.decrypt(invalidCiphertext)).rejects.toThrow();
    });

    it('should handle empty data', async () => {
      await expect(kmsService.encrypt('')).resolves.toBeDefined();
      
      const encrypted = await kmsService.encrypt('');
      const decrypted = await kmsService.decrypt(encrypted);
      expect(decrypted).toBe('');
    });

    it('should handle special characters and unicode', async () => {
      const unicodeData = '🔐 Encrypted payment data with émojis and spëcial chars: 测试';
      
      const encrypted = await kmsService.encrypt(unicodeData);
      const decrypted = await kmsService.decrypt(encrypted);
      
      expect(decrypted).toBe(unicodeData);
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple concurrent encryptions', async () => {
      const testData = Array.from({ length: 10 }, (_, i) => `test-data-${i}`);
      
      const encryptPromises = testData.map(data => kmsService.encrypt(data));
      const encrypted = await Promise.all(encryptPromises);
      
      expect(encrypted).toHaveLength(10);
      expect(encrypted.every(enc => enc.length > 0)).toBe(true);
      
      const decryptPromises = encrypted.map(enc => kmsService.decrypt(enc));
      const decrypted = await Promise.all(decryptPromises);
      
      expect(decrypted).toEqual(testData);
    });

    it('should complete encryption/decryption within reasonable time', async () => {
      const startTime = Date.now();
      const testData = 'performance-test-data';
      
      const encrypted = await kmsService.encrypt(testData);
      const decrypted = await kmsService.decrypt(encrypted);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(decrypted).toBe(testData);
      // Should complete within 5 seconds (adjust based on your requirements)
      expect(duration).toBeLessThan(5000);
    });
  });
});

// Supabase Edge Function Integration Test
describe('Supabase Edge Function KMS Integration', () => {
  const FUNCTION_URL = process.env.SUPABASE_FUNCTION_URL || 'http://localhost:54321/functions/v1/encrypt-payment-data';
  
  it('should encrypt data via Edge Function', async () => {
    const testData = {
      data: 'test-payment-token',
      context: { 'test-id': '12345' }
    };

    const response = await fetch(`${FUNCTION_URL}/encrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.encryptedData).toBeDefined();
  });

  it('should decrypt data via Edge Function', async () => {
    // First encrypt some data
    const originalData = 'test-payment-token';
    const encryptResponse = await fetch(`${FUNCTION_URL}/encrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: originalData })
    });

    const encryptResult = await encryptResponse.json();
    
    // Then decrypt it
    const decryptResponse = await fetch(`${FUNCTION_URL}/decrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encryptedData: encryptResult.encryptedData })
    });

    expect(decryptResponse.status).toBe(200);
    const decryptResult = await decryptResponse.json();
    expect(decryptResult.success).toBe(true);
    expect(decryptResult.data).toBe(originalData);
  });
});
