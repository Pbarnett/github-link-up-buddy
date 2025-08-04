/**
 * Rate Limiter Implementation
 * 
 * Token bucket-based rate limiting to prevent retry storms and
 * manage request rates for different AWS services.
 */

import { RateLimiterConfig } from './types';
import { getServiceConfig } from './service-configs';

export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per second
  private requestQueue: Array<{
    resolve: () => void;
    reject: (error: Error) => void;
    timestamp: number;
  }> = [];
  private queueProcessingInterval?: NodeJS.Timeout;

  constructor(serviceName: string) {
    const config = getServiceConfig(serviceName).rateLimiter;
    this.maxTokens = config.maxTokens;
    this.refillRate = config.refillRate;
    this.tokens = this.maxTokens;
    this.lastRefill = Date.now();
    
    this.startQueueProcessing();
  }

  async acquire(): Promise<void> {
    this.refillTokens();

    if (this.tokens > 0) {
      this.tokens--;
      return;
    }

    // Queue the request if no tokens available
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        resolve,
        reject,
        timestamp: Date.now()
      });
    });
  }

  private refillTokens(): void {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = Math.floor(timePassed * this.refillRate);

    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }

  private startQueueProcessing(): void {
    this.queueProcessingInterval = setInterval(() => {
      this.processQueue();
    }, 100); // Process queue every 100ms
  }

  private processQueue(): void {
    this.refillTokens();

    while (this.tokens > 0 && this.requestQueue.length > 0) {
      const request = this.requestQueue.shift()!;
      this.tokens--;
      request.resolve();
    }

    // Clean up expired requests (older than 30 seconds)
    const now = Date.now();
    const expiredRequests = this.requestQueue.filter(
      req => now - req.timestamp > 30000
    );

    expiredRequests.forEach(req => {
      req.reject(new Error('Rate limiter request expired'));
    });

    this.requestQueue = this.requestQueue.filter(
      req => now - req.timestamp <= 30000
    );
  }

  getMetrics(): {
    availableTokens: number;
    maxTokens: number;
    refillRate: number;
    queueSize: number;
    utilizationRate: number;
  } {
    return {
      availableTokens: this.tokens,
      maxTokens: this.maxTokens,
      refillRate: this.refillRate,
      queueSize: this.requestQueue.length,
      utilizationRate: (this.maxTokens - this.tokens) / this.maxTokens
    };
  }

  destroy(): void {
    if (this.queueProcessingInterval) {
      clearInterval(this.queueProcessingInterval);
    }
    
    // Reject all pending requests
    this.requestQueue.forEach(req => {
      req.reject(new Error('Rate limiter destroyed'));
    });
    this.requestQueue = [];
  }
}

/**
 * Global Rate Limiter Registry
 */
export class RateLimiterRegistry {
  private rateLimiters = new Map<string, RateLimiter>();

  getRateLimiter(serviceName: string): RateLimiter {
    const key = serviceName.toUpperCase();
    
    if (!this.rateLimiters.has(key)) {
      this.rateLimiters.set(key, new RateLimiter(serviceName));
    }
    
    return this.rateLimiters.get(key)!;
  }

  getAllMetrics(): Record<string, ReturnType<RateLimiter['getMetrics']>> {
    const metrics: Record<string, ReturnType<RateLimiter['getMetrics']>> = {};
    
    for (const [serviceName, rateLimiter] of this.rateLimiters) {
      metrics[serviceName] = rateLimiter.getMetrics();
    }
    
    return metrics;
  }

  destroy(): void {
    for (const rateLimiter of this.rateLimiters.values()) {
      rateLimiter.destroy();
    }
    this.rateLimiters.clear();
  }
}

// Global rate limiter registry instance
export const rateLimiterRegistry = new RateLimiterRegistry();
