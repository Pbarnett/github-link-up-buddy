/**
 * Redis Distributed Lock Implementation with OpenTelemetry Tracing
 * 
 * Provides distributed locking capabilities for the auto-booking pipeline
 * with proper span wrapping and error recording
 */

import { withSpan, SpanStatusCode } from './otel.ts';
import { logger } from './logger.ts';

interface RedisLockResult {
  acquired: boolean;
  lockId?: string;
  ttl?: number;
  error?: string;
}

interface RedisClient {
  set(key: string, value: string, options?: { EX?: number; NX?: boolean }): Promise<string | null>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
}

// Mock Redis client for development (replace with actual Redis client in production)
class MockRedisClient implements RedisClient {
  private store = new Map<string, { value: string; expiry: number }>();

  async set(key: string, value: string, options?: { EX?: number; NX?: boolean }): Promise<string | null> {
    const now = Date.now();
    const existing = this.store.get(key);
    
    // Check NX (not exists) constraint
    if (options?.NX && existing && existing.expiry > now) {
      return null; // Key exists and hasn't expired
    }
    
    // Clean up expired keys
    if (existing && existing.expiry <= now) {
      this.store.delete(key);
    }
    
    const expiry = options?.EX ? now + (options.EX * 1000) : Number.MAX_SAFE_INTEGER;
    this.store.set(key, { value, expiry });
    
    return 'OK';
  }

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (item.expiry <= Date.now()) {
      this.store.delete(key);
      return null;
    }
    
    return item.value;
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.store.get(key);
    if (!item) return 0;
    
    item.expiry = Date.now() + (seconds * 1000);
    return 1;
  }
}

let redisClient: RedisClient;

/**
 * Initialize Redis client (use mock for development)
 */
function getRedisClient(): RedisClient {
  if (!redisClient) {
    // In production, replace with actual Redis client initialization
    // const redis = new Redis(Deno.env.get('REDIS_URL'));
    redisClient = new MockRedisClient();
    console.log('[RedisLock] Using mock Redis client for development');
  }
  return redisClient;
}

/**
 * Generate a unique lock ID
 */
function generateLockId(): string {
  return `lock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Acquire a distributed lock with tracing
 */
export async function acquireLock(
  lockKey: string,
  ttlSeconds: number = 300,
  maxRetries: number = 3
): Promise<RedisLockResult> {
  return withSpan(
    'redis.acquire_lock',
    async (span) => {
      span.setAttribute('redis.lock_key', lockKey);
      span.setAttribute('redis.ttl_seconds', ttlSeconds);
      span.setAttribute('redis.max_retries', maxRetries);
      
      const redis = getRedisClient();
      const lockId = generateLockId();
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          span.setAttribute('redis.attempt', attempt);
          
          const result = await redis.set(lockKey, lockId, { 
            EX: ttlSeconds, 
            NX: true 
          });
          
          if (result === 'OK') {
            span.setAttribute('redis.lock_acquired', true);
            span.setAttribute('redis.lock_id', lockId);
            span.setStatus({ code: SpanStatusCode.OK });
            
            logger.lockAcquired(lockKey, lockId, ttlSeconds, {
              attempt,
              operation: 'acquire_lock'
            });
            
            return {
              acquired: true,
              lockId,
              ttl: ttlSeconds
            };
          }
          
          // Lock not acquired, wait before retry
          if (attempt < maxRetries) {
            const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            await new Promise(resolve => setTimeout(resolve, backoffMs));
          }
          
        } catch (error) {
          span.recordException(error as Error);
          
          if (attempt === maxRetries) {
            logger.lockFailed(lockKey, (error as Error).message, {
              attempt,
              operation: 'acquire_lock'
            });
            
            return {
              acquired: false,
              error: (error as Error).message
            };
          }
        }
      }
      
      span.setAttribute('redis.lock_acquired', false);
      logger.lockFailed(lockKey, 'Max retries exceeded', {
        maxRetries,
        operation: 'acquire_lock'
      });
      
      return {
        acquired: false,
        error: 'Max retries exceeded'
      };
    },
    {
      'service.name': 'redis',
      'redis.operation': 'acquire_lock'
    }
  );
}

/**
 * Extend lock TTL with tracing
 */
export async function extendLock(
  lockKey: string,
  lockId: string,
  ttlSeconds: number
): Promise<RedisLockResult> {
  return withSpan(
    'redis.extend_lock',
    async (span) => {
      span.setAttribute('redis.lock_key', lockKey);
      span.setAttribute('redis.lock_id', lockId);
      span.setAttribute('redis.ttl_seconds', ttlSeconds);
      
      const redis = getRedisClient();
      
      try {
        // Verify we still own the lock
        const currentLockId = await redis.get(lockKey);
        
        if (currentLockId !== lockId) {
          span.setAttribute('redis.lock_extended', false);
          span.setAttribute('redis.error', 'Lock ownership verification failed');
          
          logger.lockFailed(lockKey, 'Lock ownership verification failed', {
            currentLockId,
            expectedLockId: lockId,
            operation: 'extend_lock'
          });
          
          return {
            acquired: false,
            error: 'Lock ownership verification failed'
          };
        }
        
        // Extend the lock
        const result = await redis.expire(lockKey, ttlSeconds);
        
        if (result === 1) {
          span.setAttribute('redis.lock_extended', true);
          span.setStatus({ code: SpanStatusCode.OK });
          
          logger.debug('Redis lock extended', {
            lockKey,
            lockId,
            ttl: ttlSeconds,
            operation: 'extend_lock'
          });
          
          return {
            acquired: true,
            lockId,
            ttl: ttlSeconds
          };
        } else {
          span.setAttribute('redis.lock_extended', false);
          span.setAttribute('redis.error', 'Lock key not found');
          
          return {
            acquired: false,
            error: 'Lock key not found'
          };
        }
        
      } catch (error) {
        span.recordException(error as Error);
        
        logger.lockFailed(lockKey, (error as Error).message, {
          lockId,
          operation: 'extend_lock'
        });
        
        return {
          acquired: false,
          error: (error as Error).message
        };
      }
    },
    {
      'service.name': 'redis',
      'redis.operation': 'extend_lock'
    }
  );
}

/**
 * Release a distributed lock with tracing
 */
export async function releaseLock(
  lockKey: string,
  lockId: string
): Promise<RedisLockResult> {
  return withSpan(
    'redis.release_lock',
    async (span) => {
      span.setAttribute('redis.lock_key', lockKey);
      span.setAttribute('redis.lock_id', lockId);
      
      const redis = getRedisClient();
      
      try {
        // Verify we still own the lock before releasing
        const currentLockId = await redis.get(lockKey);
        
        if (currentLockId !== lockId) {
          span.setAttribute('redis.lock_released', false);
          span.setAttribute('redis.error', 'Lock ownership verification failed');
          
          logger.warn('Attempted to release lock not owned by this process', {
            lockKey,
            currentLockId,
            expectedLockId: lockId,
            operation: 'release_lock'
          });
          
          return {
            acquired: false,
            error: 'Lock ownership verification failed'
          };
        }
        
        // Release the lock
        const result = await redis.del(lockKey);
        
        span.setAttribute('redis.lock_released', result === 1);
        span.setStatus({ code: SpanStatusCode.OK });
        
        logger.debug('Redis lock released', {
          lockKey,
          lockId,
          success: result === 1,
          operation: 'release_lock'
        });
        
        return {
          acquired: false, // Lock is now released
          lockId
        };
        
      } catch (error) {
        span.recordException(error as Error);
        
        logger.error('Failed to release Redis lock', {
          lockKey,
          lockId,
          error: (error as Error).message,
          operation: 'release_lock'
        });
        
        return {
          acquired: false,
          error: (error as Error).message
        };
      }
    },
    {
      'service.name': 'redis',
      'redis.operation': 'release_lock'
    }
  );
}

/**
 * Lock manager class for convenient lock lifecycle management
 */
export class RedisLockManager {
  private activeLocks = new Map<string, { lockId: string; ttl: number }>();
  
  async acquire(lockKey: string, ttlSeconds: number = 300): Promise<RedisLockResult> {
    const result = await acquireLock(lockKey, ttlSeconds);
    
    if (result.acquired && result.lockId) {
      this.activeLocks.set(lockKey, {
        lockId: result.lockId,
        ttl: ttlSeconds
      });
    }
    
    return result;
  }
  
  async extend(lockKey: string, ttlSeconds: number): Promise<RedisLockResult> {
    const lock = this.activeLocks.get(lockKey);
    if (!lock) {
      return {
        acquired: false,
        error: 'Lock not managed by this instance'
      };
    }
    
    const result = await extendLock(lockKey, lock.lockId, ttlSeconds);
    
    if (result.acquired) {
      lock.ttl = ttlSeconds;
    }
    
    return result;
  }
  
  async release(lockKey: string): Promise<RedisLockResult> {
    const lock = this.activeLocks.get(lockKey);
    if (!lock) {
      return {
        acquired: false,
        error: 'Lock not managed by this instance'
      };
    }
    
    const result = await releaseLock(lockKey, lock.lockId);
    this.activeLocks.delete(lockKey);
    
    return result;
  }
  
  async releaseAll(): Promise<void> {
    const releasePromises = Array.from(this.activeLocks.keys()).map(
      lockKey => this.release(lockKey)
    );
    
    await Promise.allSettled(releasePromises);
  }
  
  getActiveLocks(): string[] {
    return Array.from(this.activeLocks.keys());
  }
}

/**
 * Utility functions for common locking patterns
 */

// Global monitor lock for preventing concurrent auto-booking runs
export async function acquireMonitorLock(ttlSeconds: number = 600): Promise<RedisLockResult> {
  return acquireLock('auto_booking:global_monitor', ttlSeconds);
}

// Per-offer lock for preventing double booking
export async function acquireOfferLock(offerId: string, ttlSeconds: number = 300): Promise<RedisLockResult> {
  return acquireLock(`auto_booking:offer:${offerId}`, ttlSeconds);
}

// Per-user lock for preventing concurrent operations
export async function acquireUserLock(userId: string, ttlSeconds: number = 60): Promise<RedisLockResult> {
  return acquireLock(`auto_booking:user:${userId}`, ttlSeconds);
}
