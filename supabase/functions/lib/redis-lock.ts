/**
 * Redis Distributed Locking for Auto-Booking Pipeline
 * 
 * Uses Upstash Redis with SET NX EX semantics for safe distributed locking
 * Required for preventing double-processing in the auto-booking monitor
 */

import { withSpan, SpanStatusCode } from '../_shared/otel.ts';

export interface RedisLockConfig {
  key: string;
  ttlSeconds: number;
  retryAttempts?: number;
  retryDelayMs?: number;
}

export interface RedisLockResult {
  acquired: boolean;
  lockId?: string;
  expiresAt?: Date;
}

export class RedisLockManager {
  private redisUrl: string;
  private authToken: string;

  constructor() {
    this.redisUrl = Deno.env.get('UPSTASH_REDIS_REST_URL') || '';
    this.authToken = Deno.env.get('UPSTASH_REDIS_REST_TOKEN') || '';
    
    if (!this.redisUrl || !this.authToken) {
      throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required');
    }
  }

  /**
   * Acquire a distributed lock using SET NX EX
   */
  async acquireLock(config: RedisLockConfig): Promise<RedisLockResult> {
    return withSpan(
      'redis.acquire_lock',
      async (span) => {
        const lockId = crypto.randomUUID();
        const { key, ttlSeconds, retryAttempts = 0, retryDelayMs = 100 } = config;

        span.attributes['redis.key'] = key;
        span.attributes['redis.ttl'] = ttlSeconds;

        for (let attempt = 0; attempt <= retryAttempts; attempt++) {
          try {
            // Use Upstash REST API format: SET key value NX EX ttl
            // Format: /set/key/value/NX/EX/ttl
            const response = await fetch(`${this.redisUrl}/set/${encodeURIComponent(key)}/${encodeURIComponent(lockId)}/NX/EX/${ttlSeconds}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${this.authToken}`
              }
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Redis SET failed: ${response.status} ${errorText}`);
              throw new Error(`Redis error: ${response.status}`);
            }

            const result = await response.json();
            
            // Redis returns "OK" if lock was acquired, null if key already exists
            if (result.result === "OK") {
              const expiresAt = new Date(Date.now() + (ttlSeconds * 1000));
              console.log(`[RedisLock] Acquired lock: ${key} (expires: ${expiresAt.toISOString()})`);
              
              span.attributes['redis.acquired'] = true;

              return {
                acquired: true,
                lockId,
                expiresAt
              };
            }

            // Lock was not acquired, key already exists
            if (attempt < retryAttempts) {
              console.log(`[RedisLock] Lock ${key} busy, retrying in ${retryDelayMs}ms (attempt ${attempt + 1}/${retryAttempts + 1})`);
              await this.sleep(retryDelayMs);
              continue;
            }

            console.log(`[RedisLock] Failed to acquire lock: ${key} (key exists)`);
            span.attributes['redis.acquired'] = false;
            return { acquired: false };

          } catch (error) {
            span.recordException(error);
            span.setStatus({ code: SpanStatusCode.ERROR });
            console.error(`[RedisLock] Error acquiring lock ${key}:`, error);
            
            if (attempt < retryAttempts) {
              await this.sleep(retryDelayMs);
              continue;
            }
            
            throw error;
          }
        }

        span.attributes['redis.acquired'] = false;
        return { acquired: false };
      },
      {
        'service.name': 'redis-service',
        'redis.operation': 'acquire_lock'
      }
    );
  }

  /**
   * Release a distributed lock
   */
  async releaseLock(key: string, lockId: string): Promise<boolean> {
    return withSpan(
      'redis.release_lock',
      async (span) => {
        span.attributes['redis.key'] = key;
        span.attributes['redis.lock_id'] = lockId;
        
        try {
          // First check if we own the lock
          const getResponse = await fetch(`${this.redisUrl}/get/${encodeURIComponent(key)}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.authToken}`
            }
          });

          if (!getResponse.ok) {
            console.error(`Redis GET failed: ${getResponse.status}`);
            return false;
          }

          const getValue = await getResponse.json();
          
          // Check if we own the lock
          if (getValue.result !== lockId) {
            console.warn(`[RedisLock] Cannot release lock ${key} - not owner or already expired`);
            return false;
          }

          // Delete the lock
          const delResponse = await fetch(`${this.redisUrl}/del/${encodeURIComponent(key)}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.authToken}`
            }
          });

          if (!delResponse.ok) {
            console.error(`Redis DEL failed: ${delResponse.status}`);
            return false;
          }

          const delResult = await delResponse.json();
          const released = delResult.result === 1;
          
          if (released) {
            console.log(`[RedisLock] Released lock: ${key}`);
            span.attributes['redis.released'] = true;
          } else {
            console.warn(`[RedisLock] Failed to delete lock ${key}`);
            span.attributes['redis.released'] = false;
          }
          
          return released;

        } catch (error) {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR });
          console.error(`[RedisLock] Error releasing lock ${key}:`, error);
          return false;
        }
      },
      {
        'service.name': 'redis-service',
        'redis.operation': 'release_lock'
      }
    );
  }

  /**
   * Extend the TTL of an existing lock (task #63 requirement)
   */
  async extendLock(key: string, lockId: string, ttlSeconds: number): Promise<boolean> {
    return withSpan(
      'redis.extend_lock',
      async (span) => {
        span.attributes['redis.key'] = key;
        span.attributes['redis.lock_id'] = lockId;
        span.attributes['redis.ttl'] = ttlSeconds;
        
        try {
          // First check if we own the lock
          const getResponse = await fetch(`${this.redisUrl}/get/${encodeURIComponent(key)}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.authToken}`
            }
          });

          if (!getResponse.ok) {
            console.error(`Redis GET failed: ${getResponse.status}`);
            return false;
          }

          const getValue = await getResponse.json();
          
          // Check if we own the lock
          if (getValue.result !== lockId) {
            console.warn(`[RedisLock] Cannot extend lock ${key} - not owner or already expired`);
            return false;
          }

          // Extend the TTL using EXPIRE command
          const expireResponse = await fetch(`${this.redisUrl}/expire/${encodeURIComponent(key)}/${ttlSeconds}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.authToken}`
            }
          });

          if (!expireResponse.ok) {
            console.error(`Redis EXPIRE failed: ${expireResponse.status}`);
            return false;
          }

          const expireResult = await expireResponse.json();
          const extended = expireResult.result === 1;
          
          if (extended) {
            const newExpiresAt = new Date(Date.now() + (ttlSeconds * 1000));
            console.log(`[RedisLock] Extended lock TTL: ${key} (new expiry: ${newExpiresAt.toISOString()})`);
            span.attributes['redis.extended'] = true;
          } else {
            console.warn(`[RedisLock] Failed to extend lock TTL: ${key}`);
            span.attributes['redis.extended'] = false;
          }
          
          return extended;

        } catch (error) {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR });
          console.error(`[RedisLock] Error extending lock ${key}:`, error);
          return false;
        }
      },
      {
        'service.name': 'redis-service',
        'redis.operation': 'extend_lock'
      }
    );
  }

  /**
   * Check if a lock exists and get its TTL
   */
  async checkLock(key: string): Promise<{ exists: boolean; ttl?: number }> {
    try {
      const response = await fetch(`${this.redisUrl}/ttl/${encodeURIComponent(key)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Redis TTL failed: ${response.status}`);
      }

      const result = await response.json();
      const ttl = result.result;

      return {
        exists: ttl > 0,
        ttl: ttl > 0 ? ttl : undefined
      };

    } catch (error) {
      console.error(`[RedisLock] Error checking lock ${key}:`, error);
      return { exists: false };
    }
  }

  /**
   * Clean up expired locks (manual cleanup if needed)
   */
  async cleanupExpiredLocks(pattern: string = "locks:*"): Promise<number> {
    try {
      // Get all keys matching pattern
      const response = await fetch(`${this.redisUrl}/keys/${pattern}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Redis KEYS failed: ${response.status}`);
      }

      const result = await response.json();
      const keys = result.result || [];
      
      let cleanedCount = 0;
      
      for (const key of keys) {
        const { exists } = await this.checkLock(key);
        if (!exists) {
          // Key has expired, Redis should have cleaned it up
          // This is just for monitoring purposes
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        console.log(`[RedisLock] Found ${cleanedCount} expired locks (auto-cleaned by Redis)`);
      }

      return cleanedCount;

    } catch (error) {
      console.error('[RedisLock] Error during cleanup:', error);
      return 0;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Convenience function for auto-booking pipeline locks
 */
export async function withAutoBookingLock<T>(
  resource: string,
  operation: () => Promise<T>,
  ttlSeconds: number = 300  // 5 minutes default
): Promise<T> {
  const lockManager = new RedisLockManager();
  const lockKey = `locks:auto_book:${resource}`;
  
  const lockResult = await lockManager.acquireLock({
    key: lockKey,
    ttlSeconds,
    retryAttempts: 2,
    retryDelayMs: 1000
  });

  if (!lockResult.acquired) {
    throw new Error(`Unable to acquire lock for auto-booking resource: ${resource}`);
  }

  try {
    console.log(`[AutoBookingLock] Starting operation for ${resource}`);
    const result = await operation();
    console.log(`[AutoBookingLock] Completed operation for ${resource}`);
    return result;
  } finally {
    if (lockResult.lockId) {
      await lockManager.releaseLock(lockKey, lockResult.lockId);
    }
  }
}

/**
 * Specific lock for the global auto-book monitor
 */
export async function acquireMonitorLock(ttlSeconds: number = 600): Promise<RedisLockResult> {
  const lockManager = new RedisLockManager();
  return lockManager.acquireLock({
    key: 'locks:auto_book_monitor',
    ttlSeconds,
    retryAttempts: 0  // Don't retry for monitor lock
  });
}

/**
 * Specific lock for individual offers
 */
export async function acquireOfferLock(offerId: string, ttlSeconds: number = 300): Promise<RedisLockResult> {
  const lockManager = new RedisLockManager();
  return lockManager.acquireLock({
    key: `lock:offer:${offerId}`,
    ttlSeconds,
    retryAttempts: 1,
    retryDelayMs: 500
  });
}
