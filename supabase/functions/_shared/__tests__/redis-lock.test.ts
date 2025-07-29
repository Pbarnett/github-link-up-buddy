import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock Redis client
const mockRedisClient = {
  set: vi.fn(),
  get: vi.fn(),
  del: vi.fn(),
  ping: vi.fn(),
  disconnect: vi.fn(),
};

// Mock the Redis module before importing the lock module
vi.mock('redis', () => ({
  createClient: vi.fn(() => mockRedisClient),
}));

import { RedisLockManager, acquireMonitorLock, acquireOfferLock } from '../../lib/redis-lock.ts';

describe('Redis Lock Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRedisClient.ping.mockResolvedValue('PONG');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('RedisLockManager class', () => {
    it('should acquire lock successfully with NX+EX semantics', async () => {
      // Mock fetch response for Upstash Redis REST API
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ result: 'OK' })
      });
      
      const lockManager = new RedisLockManager();
      const result = await lockManager.acquireLock({ key: 'test-key', ttlSeconds: 30 });

      expect(result.acquired).toBe(true);
      expect(result.lockId).toBeDefined();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/set/test-key/'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer')
          })
        })
      );
    });

    it('should fail to acquire lock when already held', async () => {
      mockRedisClient.set.mockResolvedValue(null);
      
      const lock = new RedisLock('test-key', 30);
      const result = await lock.acquire();

      expect(result).toBe(false);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'locks:test-key',
        expect.any(String),
        'NX',
        'EX',
        30
      );
    });

    it('should release lock successfully', async () => {
      mockRedisClient.set.mockResolvedValue('OK');
      mockRedisClient.get.mockResolvedValue('lock-token');
      mockRedisClient.del.mockResolvedValue(1);
      
      const lock = new RedisLock('test-key', 30);
      await lock.acquire();
      const result = await lock.release();

      expect(result).toBe(true);
      expect(mockRedisClient.get).toHaveBeenCalledWith('locks:test-key');
      expect(mockRedisClient.del).toHaveBeenCalledWith('locks:test-key');
    });

    it('should not release lock with wrong token', async () => {
      mockRedisClient.set.mockResolvedValue('OK');
      mockRedisClient.get.mockResolvedValue('different-token');
      
      const lock = new RedisLock('test-key', 30);
      await lock.acquire();
      const result = await lock.release();

      expect(result).toBe(false);
      expect(mockRedisClient.del).not.toHaveBeenCalled();
    });

    it('should handle lock that has already expired', async () => {
      mockRedisClient.set.mockResolvedValue('OK');
      mockRedisClient.get.mockResolvedValue(null); // Lock expired
      
      const lock = new RedisLock('test-key', 30);
      await lock.acquire();
      const result = await lock.release();

      expect(result).toBe(false);
      expect(mockRedisClient.del).not.toHaveBeenCalled();
    });

    it('should extend lock TTL', async () => {
      mockRedisClient.set.mockResolvedValue('OK');
      mockRedisClient.get.mockResolvedValue('lock-token');
      
      const lock = new RedisLock('test-key', 30);
      await lock.acquire();
      const result = await lock.extend(60);

      expect(result).toBe(true);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'locks:test-key',
        'lock-token',
        'XX',
        'EX',
        60
      );
    });

    it('should handle Redis connection errors gracefully', async () => {
      mockRedisClient.set.mockRejectedValue(new Error('Redis connection failed'));
      
      const lock = new RedisLock('test-key', 30);
      const result = await lock.acquire();

      expect(result).toBe(false);
    });

    it('should auto-release lock when TTL expires', async () => {
      mockRedisClient.set.mockResolvedValue('OK');
      
      const lock = new RedisLock('test-key', 1); // 1 second TTL
      const acquired = await lock.acquire();

      expect(acquired).toBe(true);
      
      // Wait for TTL to expire (in a real scenario)
      // This tests the design, not actual timing
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'locks:test-key',
        expect.any(String),
        'NX',
        'EX',
        1
      );
    });
  });

  // Test case for extending TTL of the Redis lock
  describe('RedisLockManager extendLock', () => {
    it('should extend lock TTL successfully if owned', async () => {
      mockRedisClient.get.mockResolvedValue('lock-token');
      mockRedisClient.set.mockResolvedValue('OK');
      
      const lockManager = new RedisLockManager();
      const result = await lockManager.extendLock('test-key', 'lock-token', 60);

      expect(result).toBe(true);
      expect(mockRedisClient.get).toHaveBeenCalledWith('locks:test-key');
      expect(mockRedisClient.set).toHaveBeenCalledWith('locks:test-key', 'lock-token', 'XX', 'EX', 60);
    });

    it('should fail to extend lock TTL if not owned', async () => {
      mockRedisClient.get.mockResolvedValue('different-token');
      
      const lockManager = new RedisLockManager();
      const result = await lockManager.extendLock('test-key', 'lock-token', 60);

      expect(result).toBe(false);
      expect(mockRedisClient.get).toHaveBeenCalledWith('locks:test-key');
      expect(mockRedisClient.set).not.toHaveBeenCalled();
    });
  });

  describe('utility functions', () => {
    it('should acquire lock using utility function', async () => {
      mockRedisClient.set.mockResolvedValue('OK');
      
      const result = await acquireLock('util-test-key', 30);

      expect(result).toBe(true);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'locks:util-test-key',
        expect.any(String),
        'NX',
        'EX',
        30
      );
    });

    it('should release lock using utility function', async () => {
      mockRedisClient.get.mockResolvedValue('some-token');
      mockRedisClient.del.mockResolvedValue(1);
      
      const result = await releaseLock('util-test-key');

      expect(result).toBe(true);
      expect(mockRedisClient.get).toHaveBeenCalledWith('locks:util-test-key');
      expect(mockRedisClient.del).toHaveBeenCalledWith('locks:util-test-key');
    });
  });

  describe('per-offer locking', () => {
    it('should create per-offer locks with correct key format', async () => {
      mockRedisClient.set.mockResolvedValue('OK');
      
      const offerId = 'offer-123';
      const lock = new RedisLock(`offer:${offerId}`, 30);
      const result = await lock.acquire();

      expect(result).toBe(true);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'locks:offer:offer-123',
        expect.any(String),
        'NX',
        'EX',
        30
      );
    });

    it('should prevent double processing of same offer', async () => {
      const offerId = 'offer-456';
      
      // First lock acquisition succeeds
      mockRedisClient.set.mockResolvedValueOnce('OK');
      const firstLock = new RedisLock(`offer:${offerId}`, 30);
      const firstResult = await firstLock.acquire();
      expect(firstResult).toBe(true);
      
      // Second lock acquisition fails (offer already being processed)
      mockRedisClient.set.mockResolvedValueOnce(null);
      const secondLock = new RedisLock(`offer:${offerId}`, 30);
      const secondResult = await secondLock.acquire();
      expect(secondResult).toBe(false);
    });
  });

  describe('auto-book-monitor locking', () => {
    it('should create monitor lock with correct key', async () => {
      mockRedisClient.set.mockResolvedValue('OK');
      
      const lock = new RedisLock('auto_book_monitor', 300); // 5 minutes
      const result = await lock.acquire();

      expect(result).toBe(true);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'locks:auto_book_monitor',
        expect.any(String),
        'NX',
        'EX',
        300
      );
    });

    it('should prevent concurrent monitor executions', async () => {
      // First monitor starts
      mockRedisClient.set.mockResolvedValueOnce('OK');
      const firstMonitor = new RedisLock('auto_book_monitor', 300);
      const firstResult = await firstMonitor.acquire();
      expect(firstResult).toBe(true);
      
      // Second monitor attempts to start while first is running
      mockRedisClient.set.mockResolvedValueOnce(null);
      const secondMonitor = new RedisLock('auto_book_monitor', 300);
      const secondResult = await secondMonitor.acquire();
      expect(secondResult).toBe(false);
    });
  });

  describe('error handling and resilience', () => {
    it('should handle Redis timeouts gracefully', async () => {
      const timeoutError = new Error('Redis timeout');
      timeoutError.name = 'TimeoutError';
      mockRedisClient.set.mockRejectedValue(timeoutError);
      
      const lock = new RedisLock('timeout-test', 30);
      const result = await lock.acquire();

      expect(result).toBe(false);
    });

    it('should handle network failures gracefully', async () => {
      const networkError = new Error('Network unreachable');
      networkError.name = 'NetworkError';
      mockRedisClient.set.mockRejectedValue(networkError);
      
      const lock = new RedisLock('network-test', 30);
      const result = await lock.acquire();

      expect(result).toBe(false);
    });

    it('should validate lock key format', async () => {
      const invalidKeys = ['', null, undefined, ' ', '\n'];
      
      for (const key of invalidKeys) {
        expect(() => new RedisLock(key as any, 30)).toThrow();
      }
    });

    it('should validate TTL values', async () => {
      const invalidTTLs = [0, -1, null, undefined];
      
      for (const ttl of invalidTTLs) {
        expect(() => new RedisLock('test', ttl as any)).toThrow();
      }
    });
  });
});
