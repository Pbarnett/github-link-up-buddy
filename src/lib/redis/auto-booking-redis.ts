/**
 * Redis utility for auto-booking pipeline concurrency control
 * Uses Upstash Redis for serverless-friendly operations
 */

import { Redis } from '@upstash/redis';

// Lazy-initialized Redis client
let redis: Redis | null = null;

function getRedisClient(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (!url || !token) {
      throw new Error('Redis credentials not configured. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.');
    }
    
    redis = new Redis({ url, token });
  }
  return redis;
}

export interface AutoBookingLock {
  tripRequestId: string;
  lockKey: string;
  expiresAt: number;
}

export interface AutoBookingJob {
  tripRequestId: string;
  offerId?: string;
  stage: 'search' | 'monitor' | 'book' | 'notify';
  priority: number;
  createdAt: number;
  retryCount?: number;
}

export class AutoBookingRedis {
  private static readonly LOCK_PREFIX = 'auto_book_lock';
  private static readonly QUEUE_PREFIX = 'auto_book_queue';
  private static readonly JOB_PREFIX = 'auto_book_job';
  
  // Lock expiration times (in milliseconds)
  private static readonly DEFAULT_LOCK_TTL = 30 * 1000; // 30 seconds
  private static readonly BOOKING_LOCK_TTL = 60 * 1000; // 60 seconds for booking operations
  
  /**
   * Acquire a Redis lock for a trip request to prevent concurrent processing
   */
  static async acquireLock(
    tripRequestId: string, 
    operation: 'search' | 'monitor' | 'book' | 'notify' = 'monitor'
  ): Promise<AutoBookingLock | null> {
    const lockKey = `${this.LOCK_PREFIX}:${tripRequestId}`;
    const ttl = operation === 'book' ? this.BOOKING_LOCK_TTL : this.DEFAULT_LOCK_TTL;
    const expiresAt = Date.now() + ttl;
    
    try {
      // Use SET with NX (not exists) and PX (millisecond expiration)
      const result = await getRedisClient().set(lockKey, operation, { nx: true, px: ttl });
      
      if (result === 'OK') {
        return {
          tripRequestId,
          lockKey,
          expiresAt
        };
      }
      
      return null; // Lock already exists
    } catch (error) {
      console.error(`Failed to acquire lock for trip ${tripRequestId}:`, error);
      return null;
    }
  }
  
  /**
   * Release a Redis lock
   */
  static async releaseLock(lock: AutoBookingLock): Promise<boolean> {
    try {
      const result = await getRedisClient().del(lock.lockKey);
      return result === 1;
    } catch (error) {
      console.error(`Failed to release lock ${lock.lockKey}:`, error);
      return false;
    }
  }
  
  /**
   * Check if a trip request is currently locked
   */
  static async isLocked(tripRequestId: string): Promise<boolean> {
    const lockKey = `${this.LOCK_PREFIX}:${tripRequestId}`;
    try {
      const result = await getRedisClient().exists(lockKey);
      return result === 1;
    } catch (error) {
      console.error(`Failed to check lock for trip ${tripRequestId}:`, error);
      return false; // Assume not locked if we can't check
    }
  }
  
  /**
   * Add a job to the auto-booking queue
   */
  static async enqueueJob(job: AutoBookingJob): Promise<boolean> {
    const queueKey = `${this.QUEUE_PREFIX}:${job.stage}`;
    const jobKey = `${this.JOB_PREFIX}:${job.tripRequestId}:${Date.now()}`;
    
    try {
      // Store job data
      await getRedisClient().hset(jobKey, {
        tripRequestId: job.tripRequestId,
        offerId: job.offerId || '',
        stage: job.stage,
        priority: job.priority,
        createdAt: job.createdAt,
        retryCount: job.retryCount || 0
      });
      
      // Add to sorted set queue (sorted by priority, then creation time)
      const score = job.priority * 1000000 + job.createdAt; // Priority has more weight
      await getRedisClient().zadd(queueKey, { score, member: jobKey });
      
      return true;
    } catch (error) {
      console.error(`Failed to enqueue job for trip ${job.tripRequestId}:`, error);
      return false;
    }
  }
  
  /**
   * Get the next job from a queue (highest priority first)
   */
  static async dequeueJob(stage: 'search' | 'monitor' | 'book' | 'notify'): Promise<AutoBookingJob | null> {
    const queueKey = `${this.QUEUE_PREFIX}:${stage}`;
    
    try {
      // Get highest priority job
      const result = await getRedisClient().zpopmin(queueKey);
      if (!result || result.length === 0) {
        return null;
      }
      
      const jobKey = result[0];
      const jobData = await getRedisClient().hgetall(jobKey);
      
      if (!jobData || !jobData.tripRequestId) {
        return null;
      }
      
      // Clean up job data
      await getRedisClient().del(jobKey);
      
      return {
        tripRequestId: jobData.tripRequestId as string,
        offerId: jobData.offerId as string || undefined,
        stage: jobData.stage as any,
        priority: parseInt(jobData.priority as string) || 0,
        createdAt: parseInt(jobData.createdAt as string) || Date.now(),
        retryCount: parseInt(jobData.retryCount as string) || 0
      };
    } catch (error) {
      console.error(`Failed to dequeue job from ${stage}:`, error);
      return null;
    }
  }
  
  /**
   * Get queue length for monitoring
   */
  static async getQueueLength(stage: 'search' | 'monitor' | 'book' | 'notify'): Promise<number> {
    const queueKey = `${this.QUEUE_PREFIX}:${stage}`;
    try {
      return await getRedisClient().zcard(queueKey);
    } catch (error) {
      console.error(`Failed to get queue length for ${stage}:`, error);
      return 0;
    }
  }
  
  /**
   * Store monitoring data for a trip (price history, availability checks)
   */
  static async setMonitoringData(
    tripRequestId: string, 
    data: { lastPrice?: number; lastChecked: number; checkCount: number }
  ): Promise<boolean> {
    const key = `monitoring:${tripRequestId}`;
    try {
      await getRedisClient().hset(key, data);
      // Set expiration - monitoring data expires after 7 days
      await getRedisClient().expire(key, 7 * 24 * 60 * 60);
      return true;
    } catch (error) {
      console.error(`Failed to set monitoring data for trip ${tripRequestId}:`, error);
      return false;
    }
  }
  
  /**
   * Get monitoring data for a trip
   */
  static async getMonitoringData(tripRequestId: string): Promise<{
    lastPrice?: number;
    lastChecked?: number;
    checkCount?: number;
  } | null> {
    const key = `monitoring:${tripRequestId}`;
    try {
      const data = await getRedisClient().hgetall(key);
      if (!data || Object.keys(data).length === 0) {
        return null;
      }
      
      return {
        lastPrice: data.lastPrice ? parseFloat(data.lastPrice as string) : undefined,
        lastChecked: data.lastChecked ? parseInt(data.lastChecked as string) : undefined,
        checkCount: data.checkCount ? parseInt(data.checkCount as string) : undefined
      };
    } catch (error) {
      console.error(`Failed to get monitoring data for trip ${tripRequestId}:`, error);
      return null;
    }
  }
  
  /**
   * Health check for Redis connection
   */
  static async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; error?: string }> {
    try {
      const result = await getRedisClient().ping();
      if (result === 'PONG') {
        return { status: 'healthy' };
      } else {
        return { status: 'unhealthy', error: 'Unexpected ping response' };
      }
    } catch (error) {
      return { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

export { getRedisClient as redis };
