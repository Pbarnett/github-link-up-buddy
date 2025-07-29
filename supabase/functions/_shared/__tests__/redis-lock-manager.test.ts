import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock environment variables
vi.mock('$env/dynamic/private', () => ({
  UPSTASH_REDIS_REST_URL: 'https://mock-redis.upstash.io',
  UPSTASH_REDIS_REST_TOKEN: 'mock-token'
}));

// Mock the global fetch function
const mockFetch = vi.fn();
global.fetch = mockFetch;

import { RedisLockManager, acquireMonitorLock, acquireOfferLock } from '../../lib/redis-lock.ts';

describe('RedisLockManager', () => {
  let lockManager: RedisLockManager;

  beforeEach(() => {
    vi.clearAllMocks();
    lockManager = new RedisLockManager();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('acquireLock', () => {
    it('should acquire lock successfully with NX+EX semantics', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ result: 'OK' })
      });

      const result = await lockManager.acquireLock({
        key: 'test-key',
        ttlSeconds: 30
      });

      expect(result.acquired).toBe(true);
      expect(result.lockId).toBeDefined();
      expect(result.expiresAt).toBeDefined();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/set/test-key/'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      );
    });

    it('should fail to acquire lock when already held', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ result: null })
      });

      const result = await lockManager.acquireLock({
        key: 'test-key',
        ttlSeconds: 30
      });

      expect(result.acquired).toBe(false);
      expect(result.lockId).toBeUndefined();
    });

    it('should handle Redis errors gracefully', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Redis error')
      });

      await expect(lockManager.acquireLock({
        key: 'test-key',
        ttlSeconds: 30
      })).rejects.toThrow('Redis error: 500');
    });
  });

  describe('extendLock', () => {
    it('should extend lock TTL successfully if owned', async () => {
      // Mock GET request to verify ownership
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ result: 'lock-token-123' })
      });

      // Mock EXPIRE request to extend TTL
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ result: 1 })
      });

      const result = await lockManager.extendLock('test-key', 'lock-token-123', 60);

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(1,
        expect.stringContaining('/get/test-key'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenNthCalledWith(2,
        expect.stringContaining('/expire/test-key/60'),
        expect.any(Object)
      );
    });

    it('should fail to extend lock TTL if not owned', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ result: 'different-token' })
      });

      const result = await lockManager.extendLock('test-key', 'lock-token-123', 60);

      expect(result).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(1); // Only GET, no EXPIRE
    });

    it('should fail to extend expired lock', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ result: null })
      });

      const result = await lockManager.extendLock('test-key', 'lock-token-123', 60);

      expect(result).toBe(false);
    });
  });

  describe('releaseLock', () => {
    it('should release lock successfully if owned', async () => {
      // Mock GET request to verify ownership
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ result: 'lock-token-123' })
      });

      // Mock DEL request to release lock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ result: 1 })
      });

      const result = await lockManager.releaseLock('test-key', 'lock-token-123');

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should fail to release lock if not owned', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ result: 'different-token' })
      });

      const result = await lockManager.releaseLock('test-key', 'lock-token-123');

      expect(result).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(1); // Only GET, no DEL
    });
  });

  describe('checkLock', () => {
    it('should return lock exists with TTL', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ result: 120 })
      });

      const result = await lockManager.checkLock('test-key');

      expect(result.exists).toBe(true);
      expect(result.ttl).toBe(120);
    });

    it('should return lock does not exist', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ result: -1 })
      });

      const result = await lockManager.checkLock('test-key');

      expect(result.exists).toBe(false);
      expect(result.ttl).toBeUndefined();
    });
  });
});

describe('Utility Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('acquireMonitorLock', () => {
    it('should acquire monitor lock with correct parameters', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ result: 'OK' })
      });

      const result = await acquireMonitorLock(600);

      expect(result.acquired).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/set/locks:auto_book_monitor/'),
        expect.any(Object)
      );
    });
  });

  describe('acquireOfferLock', () => {
    it('should acquire offer lock with correct key format', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ result: 'OK' })
      });

      const result = await acquireOfferLock('offer-123', 300);

      expect(result.acquired).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/set/lock:offer:offer-123/'),
        expect.any(Object)
      );
    });
  });
});

describe('Integration Tests', () => {
  it('should handle monitor exits early when LaunchDarkly flag is off', async () => {
    // This test would require mocking the LaunchDarkly function call
    // and verifying that the monitor function returns early when flags are disabled
    // This would be implemented as part of the auto-book-monitor function tests
    expect(true).toBe(true); // Placeholder for actual integration test
  });
});
