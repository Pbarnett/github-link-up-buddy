/**
 * AWS Performance Optimizations - Real Implementation Tests
 * 
 * Tests the actual implementation classes with mocked AWS SDK
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { KMSClient, GenerateDataKeyCommand } from '@aws-sdk/client-kms';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

// Mock AWS SDK
vi.mock('@aws-sdk/client-kms');
vi.mock('@aws-sdk/client-secrets-manager');
vi.mock('@smithy/node-http-handler');

// Import real implementations
import { KMSDataKeyCache, SecretCache, MultiRegionClientManager, PerformanceMonitor } from '../../lib/aws-sdk-enhanced';

describe('AWS Performance Optimization Implementations', () => {
  let mockKMSClient: any;
  let mockSecretsClient: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock instances
    mockKMSClient = {
      send: vi.fn()
    };
    
    mockSecretsClient = {
      send: vi.fn()
    };

    // Mock the constructors to return our mock instances
    vi.mocked(KMSClient).mockImplementation(() => mockKMSClient);
    vi.mocked(SecretsManagerClient).mockImplementation(() => mockSecretsClient);
  });

  describe('KMSDataKeyCache', () => {
    it('should cache data keys with real implementation', async () => {
      const cache = new KMSDataKeyCache();
      const mockDataKey = new Uint8Array([1, 2, 3, 4]);
      const mockPlaintext = new Uint8Array([5, 6, 7, 8]);

      mockKMSClient.send.mockResolvedValue({
        CiphertextBlob: mockDataKey,
        Plaintext: mockPlaintext
      });

      // First call should hit KMS
      const result1 = await cache.getDataKey('test-key', mockKMSClient);
      expect(mockKMSClient.send).toHaveBeenCalledTimes(1);
      expect(result1.dataKey).toEqual(mockDataKey);
      expect(result1.plaintext).toEqual(mockPlaintext);

      // Second call should use cache
      const result2 = await cache.getDataKey('test-key', mockKMSClient);
      expect(mockKMSClient.send).toHaveBeenCalledTimes(1); // Still only 1 call
      expect(result2.dataKey).toEqual(mockDataKey);
      expect(result2.plaintext).toEqual(mockPlaintext);
    });

    it('should handle KMS errors in real implementation', async () => {
      const cache = new KMSDataKeyCache();
      
      mockKMSClient.send.mockRejectedValue(new Error('KMS service unavailable'));

      await expect(cache.getDataKey('test-key', mockKMSClient))
        .rejects.toThrow('KMS service unavailable');
    });
  });

  describe('SecretCache', () => {
    it('should cache secrets with real implementation', async () => {
      const cache = new SecretCache();
      const mockSecret = { apiKey: 'test-api-key' };

      mockSecretsClient.send.mockResolvedValue({
        SecretString: JSON.stringify(mockSecret),
        VersionId: 'version-1'
      });

      // First call should hit Secrets Manager
      const result1 = await cache.getSecret('test-secret', mockSecretsClient);
      expect(mockSecretsClient.send).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(mockSecret);

      // Second call should use cache (within primary TTL)
      const result2 = await cache.getSecret('test-secret', mockSecretsClient);
      expect(mockSecretsClient.send).toHaveBeenCalledTimes(1); // Still only 1 call
      expect(result2).toEqual(mockSecret);
    });

    it('should handle JSON parsing errors', async () => {
      const cache = new SecretCache();
      
      mockSecretsClient.send.mockResolvedValue({
        SecretString: 'invalid-json',
        VersionId: 'version-1'
      });

      await expect(cache.getSecret('test-secret', mockSecretsClient))
        .rejects.toThrow();
    });
  });

  describe('MultiRegionClientManager', () => {
    it('should create clients with optimized configuration', () => {
      const manager = new MultiRegionClientManager();
      
      const clients = manager.getClients('us-west-2');
      
      expect(clients.kms).toBeDefined();
      expect(clients.secrets).toBeDefined();
      expect(KMSClient).toHaveBeenCalledWith(expect.objectContaining({
        region: 'us-west-2',
        maxAttempts: 3
      }));
    });

    it('should cache clients per region', () => {
      const manager = new MultiRegionClientManager();
      
      const clients1 = manager.getClients('us-west-2');
      const clients2 = manager.getClients('us-west-2');
      const clients3 = manager.getClients('us-east-1');
      
      // Same region should return cached clients
      expect(clients1).toBe(clients2);
      // Different region should return different clients
      expect(clients1).not.toBe(clients3);
    });

    it('should execute with failover', async () => {
      const manager = new MultiRegionClientManager();
      let callCount = 0;
      
      const testOperation = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          throw new Error('Primary region failed');
        }
        return Promise.resolve('success');
      });

      const result = await manager.executeWithFailover(testOperation);
      
      expect(result).toBe('success');
      expect(testOperation).toHaveBeenCalledTimes(2); // Primary + fallback
    });
  });

  describe('PerformanceMonitor', () => {
    it('should track cache hits and misses', () => {
      const monitor = new PerformanceMonitor();
      
      monitor.recordCacheHit();
      monitor.recordCacheMiss();
      monitor.recordCacheHit();
      
      const metrics = monitor.getMetrics();
      expect(metrics.cacheHits).toBe(2);
      expect(metrics.cacheMisses).toBe(1);
      expect(metrics.cacheHitRate).toBe(2/3);
      expect(metrics.totalRequests).toBe(3);
    });

    it('should track latency', () => {
      const monitor = new PerformanceMonitor();
      
      monitor.recordLatency(100);
      monitor.recordLatency(200);
      
      const metrics = monitor.getMetrics();
      expect(metrics.averageLatency).toBe(150);
    });

    it('should reset metrics', () => {
      const monitor = new PerformanceMonitor();
      
      monitor.recordCacheHit();
      monitor.recordLatency(100);
      
      let metrics = monitor.getMetrics();
      expect(metrics.cacheHits).toBe(1);
      
      monitor.reset();
      
      metrics = monitor.getMetrics();
      expect(metrics.cacheHits).toBe(0);
      expect(metrics.averageLatency).toBe(0);
    });
  });

  describe('Integration Tests', () => {
    it('should work together for complete optimization', async () => {
      const kmsCache = new KMSDataKeyCache();
      const secretCache = new SecretCache();
      const regionManager = new MultiRegionClientManager();
      const monitor = new PerformanceMonitor();

      // Mock responses
      mockKMSClient.send.mockResolvedValue({
        CiphertextBlob: new Uint8Array([1, 2, 3]),
        Plaintext: new Uint8Array([4, 5, 6])
      });

      mockSecretsClient.send.mockResolvedValue({
        SecretString: JSON.stringify({ key: 'value' }),
        VersionId: 'v1'
      });

      // Get optimized clients
      const clients = regionManager.getClients('us-west-2');
      
      // Test KMS caching with monitoring
      const startTime = Date.now();
      monitor.recordCacheMiss();
      
      const dataKey = await kmsCache.getDataKey('test-key', clients.kms);
      
      const latency = Date.now() - startTime;
      monitor.recordLatency(latency);
      
      expect(dataKey.dataKey).toEqual(new Uint8Array([1, 2, 3]));
      
      // Test secret caching
      const secret = await secretCache.getSecret('test-secret', clients.secrets);
      expect(secret).toEqual({ key: 'value' });
      
      // Verify metrics
      const metrics = monitor.getMetrics();
      expect(metrics.cacheMisses).toBe(1);
      expect(metrics.averageLatency).toBeGreaterThan(0);
    });
  });
});
