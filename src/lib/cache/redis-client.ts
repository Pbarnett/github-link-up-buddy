import { Redis } from 'ioredis';

// Simple LaunchDarkly interfaces for Redis client use
interface SimpleLDContext {
  key: string;
  kind?: string;
  [key: string]: any;
}

class SimpleLaunchDarklyClient {
  async evaluateBooleanFlag(flagKey: string, context: SimpleLDContext, defaultValue: boolean): Promise<boolean> {
    // For now, return default value - this will be implemented when LD SDK is properly configured
    console.log(`[LD] Evaluating flag ${flagKey} for context ${context.key}, returning default: ${defaultValue}`);
    return defaultValue;
  }
}

function buildSimpleServerContext(userData: any): SimpleLDContext {
  return {
    kind: 'user',
    key: userData.key || 'system',
    ...userData
  };
}

function getSimpleLaunchDarklyClient(): SimpleLaunchDarklyClient {
  return new SimpleLaunchDarklyClient();
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  maxRetriesPerRequest: number;
  enableReadyCheck: boolean;
  lazyConnect: boolean;
  keepAlive: number;
  family: 4 | 6;
  keyPrefix?: string;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
  avgResponseTime: number;
  connectionPoolSize: number;
  lastHealthCheck: Date;
  circuitBreakerOpen: boolean;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  version: string;
}

class RedisClient {
  private client: Redis | null = null;
  private isEnabled = false;
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    errors: 0,
    avgResponseTime: 0,
    connectionPoolSize: 0,
    lastHealthCheck: new Date(),
    circuitBreakerOpen: false
  };
  private circuitBreakerFailures = 0;
  private readonly maxFailures = 5;
  private circuitBreakerResetTime = 60000; // 1 minute
  private lastFailureTime = 0;
  private responseTimes: number[] = [];

  constructor(private config: RedisConfig) {
    this.initializeClient();
  }


  private async evaluateFlag(flagKey: string, defaultValue: boolean): Promise<boolean> {
    try {
      const client = getSimpleLaunchDarklyClient();
      const context = buildSimpleServerContext({ key: 'system' });
      return await client.evaluateBooleanFlag(flagKey, context, defaultValue);
    } catch (error) {
      console.warn(`Failed to evaluate flag ${flagKey}:`, error);
      return defaultValue;
    }
  }

  private async initializeClient(): Promise<void> {
    try {
      // Check feature flag
      this.isEnabled = await this.evaluateFlag('redis-caching-enabled', false);
      
      if (!this.isEnabled) {
        console.log('Redis caching disabled via feature flag');
        return;
      }

      this.client = new Redis({
        host: this.config.host,
        port: this.config.port,
        password: this.config.password,
        db: this.config.db,
        maxRetriesPerRequest: this.config.maxRetriesPerRequest,
        enableReadyCheck: this.config.enableReadyCheck,
        lazyConnect: this.config.lazyConnect,
        keepAlive: this.config.keepAlive,
        family: this.config.family,
        keyPrefix: this.config.keyPrefix,
        // Connection pool settings
        connectTimeout: 10000,
        commandTimeout: 5000,
      });

      this.client.on('connect', () => {
        console.log('Redis connected successfully');
        this.resetCircuitBreaker();
      });

      this.client.on('error', (error) => {
        console.error('Redis connection error:', error);
        this.handleCircuitBreakerFailure();
        this.metrics.errors++;
        
      });

      this.client.on('close', () => {
        console.log('Redis connection closed');
      });

      // Health check interval
      setInterval(() => this.performHealthCheck(), 30000);

    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      this.handleCircuitBreakerFailure();
      
    }
  }

  private async performHealthCheck(): Promise<void> {
    if (!this.client || !this.isEnabled) return;

    const startTime = Date.now();
    try {
      await this.client.ping();
      const responseTime = Date.now() - startTime;
      
      this.metrics.lastHealthCheck = new Date();
      this.updateResponseTime(responseTime);
      
      if (this.metrics.circuitBreakerOpen && this.shouldResetCircuitBreaker()) {
        this.resetCircuitBreaker();
      }
    } catch (error) {
      console.error('Redis health check failed:', error);
      this.handleCircuitBreakerFailure();
      this.metrics.errors++;
    }
  }

  private handleCircuitBreakerFailure(): void {
    this.circuitBreakerFailures++;
    this.lastFailureTime = Date.now();
    
    if (this.circuitBreakerFailures >= this.maxFailures) {
      this.metrics.circuitBreakerOpen = true;
      console.log('Redis circuit breaker opened due to consecutive failures');
    }
  }

  private resetCircuitBreaker(): void {
    this.circuitBreakerFailures = 0;
    this.metrics.circuitBreakerOpen = false;
    console.log('Redis circuit breaker reset');
  }

  private shouldResetCircuitBreaker(): boolean {
    return Date.now() - this.lastFailureTime > this.circuitBreakerResetTime;
  }

  private updateResponseTime(responseTime: number): void {
    this.responseTimes.push(responseTime);
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }
    this.metrics.avgResponseTime = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
  }

  async get<T = any>(key: string): Promise<T | null> {
    if (!this.client || !this.isEnabled || this.metrics.circuitBreakerOpen) {
      this.metrics.misses++;
      return null;
    }

    const startTime = Date.now();
    try {
      const cached = await this.client.get(key);
      const responseTime = Date.now() - startTime;
      
      this.updateResponseTime(responseTime);

      if (cached) {
        this.metrics.hits++;
        const entry: CacheEntry<T> = JSON.parse(cached);
        
        // Check if entry is expired
        if (Date.now() - entry.timestamp > entry.ttl * 1000) {
          await this.delete(key);
          this.metrics.misses++;
          return null;
        }
        
        return entry.data;
      } else {
        this.metrics.misses++;
        return null;
      }
    } catch (error) {
      console.error('Redis get error:', error);
      this.handleCircuitBreakerFailure();
      this.metrics.errors++;
      this.metrics.misses++;
      return null;
    }
  }

  async set<T = any>(key: string, value: T, ttlSeconds: number = 3600): Promise<boolean> {
    if (!this.client || !this.isEnabled || this.metrics.circuitBreakerOpen) {
      return false;
    }

    try {
      const startTime = Date.now();
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        ttl: ttlSeconds,
        version: '1.0'
      };

      await this.client.setex(key, ttlSeconds, JSON.stringify(entry));
      const responseTime = Date.now() - startTime;
      
      this.updateResponseTime(responseTime);
      this.metrics.sets++;
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      this.handleCircuitBreakerFailure();
      this.metrics.errors++;
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    if (!this.client || !this.isEnabled || this.metrics.circuitBreakerOpen) {
      return false;
    }

    try {
      const startTime = Date.now();
      const result = await this.client.del(key);
      const responseTime = Date.now() - startTime;
      
      this.updateResponseTime(responseTime);
      this.metrics.deletes++;
      return result > 0;
    } catch (error) {
      console.error('Redis delete error:', error);
      this.handleCircuitBreakerFailure();
      this.metrics.errors++;
      return false;
    }
  }

  async invalidatePattern(pattern: string): Promise<number> {
    if (!this.client || !this.isEnabled || this.metrics.circuitBreakerOpen) {
      return 0;
    }

    try {
      const startTime = Date.now();
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) return 0;

      const result = await this.client.del(...keys);
      const responseTime = Date.now() - startTime;
      
      this.updateResponseTime(responseTime);
      this.metrics.deletes += result;
      return result;
    } catch (error) {
      console.error('Redis invalidate pattern error:', error);
      this.handleCircuitBreakerFailure();
      this.metrics.errors++;
      return 0;
    }
  }

  async mget<T = any>(keys: string[]): Promise<(T | null)[]> {
    if (!this.client || !this.isEnabled || this.metrics.circuitBreakerOpen) {
      return keys.map(() => null);
    }

    try {
      const startTime = Date.now();
      const results = await this.client.mget(...keys);
      const responseTime = Date.now() - startTime;
      
      this.updateResponseTime(responseTime);

      return results.map((cached, index) => {
        if (cached) {
          try {
            const entry: CacheEntry<T> = JSON.parse(cached);
            if (Date.now() - entry.timestamp <= entry.ttl * 1000) {
              this.metrics.hits++;
              return entry.data;
            } else {
              // Async cleanup of expired entry
              this.delete(keys[index]).catch(() => {});
              this.metrics.misses++;
              return null;
            }
          } catch {
            this.metrics.misses++;
            return null;
          }
        } else {
          this.metrics.misses++;
          return null;
        }
      });
    } catch (error) {
      console.error('Redis mget error:', error);
      this.handleCircuitBreakerFailure();
      this.metrics.errors++;
      return keys.map(() => null);
    }
  }

  async mset(entries: Array<{key: string, value: any, ttl?: number}>): Promise<boolean> {
    if (!this.client || !this.isEnabled || this.metrics.circuitBreakerOpen) {
      return false;
    }

    try {
      const startTime = Date.now();
      const pipeline = this.client.pipeline();
      
      entries.forEach(({ key, value, ttl = 3600 }) => {
        const entry: CacheEntry = {
          data: value,
          timestamp: Date.now(),
          ttl,
          version: '1.0'
        };
        pipeline.setex(key, ttl, JSON.stringify(entry));
      });

      await pipeline.exec();
      const responseTime = Date.now() - startTime;
      
      this.updateResponseTime(responseTime);
      this.metrics.sets += entries.length;
      return true;
    } catch (error) {
      console.error('Redis mset error:', error);
      this.handleCircuitBreakerFailure();
      this.metrics.errors++;
      return false;
    }
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  getHitRatio(): number {
    const total = this.metrics.hits + this.metrics.misses;
    return total > 0 ? this.metrics.hits / total : 0;
  }

  async flushAll(): Promise<boolean> {
    if (!this.client || !this.isEnabled) {
      return false;
    }

    try {
      await this.client.flushall();
      console.log('Redis cache cleared');
      return true;
    } catch (error) {
      console.error('Redis flush error:', error);
      this.metrics.errors++;
      
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }
}

// Global Redis client instance
export const redisClient = new RedisClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
  keepAlive: 30000,
  family: 4,
  keyPrefix: process.env.REDIS_KEY_PREFIX || 'app:'
});

export default redisClient;
