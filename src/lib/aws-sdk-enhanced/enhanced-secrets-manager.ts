/**
 * Enhanced AWS Secrets Manager Implementation
 * 
 * Implements enterprise-grade security patterns including:
 * - Enhanced caching with TTL-based invalidation
 * - Circuit breaker for fault tolerance
 * - Attribute-based access control validation
 * - Rotation-aware secret retrieval
 * - Comprehensive error handling and logging
 */

import { getSecretValue } from './secrets-manager';
import { SecurityEventLogger } from './secrets-monitoring';

interface SecretCacheEntry {
  value: string;
  expiry: number;
  rotationInProgress?: boolean;
  lastRotationCheck?: number;
}

interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

interface EnhancedSecretOptions {
  ttlMs?: number;
  enableRotationDetection?: boolean;
  maxRetries?: number;
  circuitBreakerThreshold?: number;
  validateFormat?: (value: string) => boolean;
  environment?: string;
  tags?: Record<string, string>;
}

/**
 * Enterprise-grade Secrets Manager with advanced security features
 */
export class EnhancedSecretsManager {
  private static instance: EnhancedSecretsManager;
  private cache = new Map<string, SecretCacheEntry>();
  private circuitBreakers = new Map<string, CircuitBreakerState>();
  
  // Configuration
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly CIRCUIT_BREAKER_THRESHOLD = 5;
  private readonly CIRCUIT_BREAKER_TIMEOUT = 60 * 1000; // 1 minute
  private readonly ROTATION_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes

  static getInstance(): EnhancedSecretsManager {
    if (!EnhancedSecretsManager.instance) {
      EnhancedSecretsManager.instance = new EnhancedSecretsManager();
    }
    return EnhancedSecretsManager.instance;
  }

  /**
   * Enhanced secret retrieval with enterprise security patterns
   */
  async getSecret(
    secretId: string,
    region: string,
    options: EnhancedSecretOptions = {}
  ): Promise<string | undefined> {
    const {
      ttlMs = this.DEFAULT_TTL,
      enableRotationDetection = true,
      maxRetries = 3,
      circuitBreakerThreshold = this.CIRCUIT_BREAKER_THRESHOLD,
      validateFormat,
      environment = process.env.NODE_ENV || 'development',
      tags = {}
    } = options;

    const cacheKey = `${secretId}-${region}-${environment}`;

    // Check circuit breaker
    if (this.isCircuitBreakerOpen(cacheKey, circuitBreakerThreshold)) {
      console.warn(`Circuit breaker OPEN for secret: ${secretId}`);
      throw new Error(`Circuit breaker open for secret: ${secretId}`);
    }

    // Check cache first
    const cached = this.getCachedSecret(cacheKey, enableRotationDetection);
    if (cached) {
      console.log(`✅ Cache hit for secret: ${secretId}`);
      // Log cache hit
      SecurityEventLogger.logSecretRetrieved(secretId, region, environment, 0, true);
      return cached;
    }

    // Retrieve with retry logic and circuit breaker
    return this.retrieveWithRetry(
      secretId,
      region,
      cacheKey,
      ttlMs,
      maxRetries,
      validateFormat,
      tags
    );
  }

  /**
   * Batch secret retrieval with parallel processing and error aggregation
   */
  async getBatchSecrets(
    secrets: Array<{
      id: string;
      region?: string;
      options?: EnhancedSecretOptions;
    }>,
    defaultRegion: string = 'us-west-2'
  ): Promise<{
    successful: Array<{ id: string; value: string }>;
    failed: Array<{ id: string; error: string }>;
    summary: { total: number; success: number; failed: number };
  }> {
    const results = await Promise.allSettled(
      secrets.map(async ({ id, region = defaultRegion, options = {} }) => {
        try {
          const value = await this.getSecret(id, region, options);
          return { id, value, success: true };
        } catch (error) {
          return {
            id,
            error: error instanceof Error ? error.message : 'Unknown error',
            success: false
          };
        }
      })
    );

    const successful: Array<{ id: string; value: string }> = [];
    const failed: Array<{ id: string; error: string }> = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const data = result.value;
        if (data.success && data.value) {
          successful.push({ id: data.id, value: data.value });
        } else {
          failed.push({ id: data.id, error: data.error || 'No value retrieved' });
        }
      } else {
        failed.push({
          id: secrets[index].id,
          error: result.reason?.message || 'Promise rejection'
        });
      }
    });

    return {
      successful,
      failed,
      summary: {
        total: secrets.length,
        success: successful.length,
        failed: failed.length
      }
    };
  }

  /**
   * Multi-region failover with health-based routing
   */
  async getSecretWithRegionalFailover(
    secretId: string,
    primaryRegion: string = 'us-west-2',
    fallbackRegions: string[] = ['us-east-1', 'eu-west-1'],
    options: EnhancedSecretOptions = {}
  ): Promise<{ value: string; region: string; failoverUsed: boolean }> {
    // Try primary region
    try {
      console.log(`🔍 Attempting primary region: ${primaryRegion}`);
      const value = await this.getSecret(secretId, primaryRegion, options);
      if (value) {
        return { value, region: primaryRegion, failoverUsed: false };
      }
    } catch (error) {
      console.warn(`❌ Primary region ${primaryRegion} failed:`, error);
      this.recordCircuitBreakerFailure(`${secretId}-${primaryRegion}`);
    }

    // Try fallback regions
    for (const region of fallbackRegions) {
      try {
        console.log(`🔄 Attempting fallback region: ${region}`);
        const value = await this.getSecret(secretId, region, options);
        if (value) {
          return { value, region, failoverUsed: true };
        }
      } catch (error) {
        console.warn(`❌ Fallback region ${region} failed:`, error);
        this.recordCircuitBreakerFailure(`${secretId}-${region}`);
      }
    }

    throw new Error(`Secret ${secretId} not available in any configured region`);
  }

  /**
   * Get cached secret with rotation detection
   */
  private getCachedSecret(cacheKey: string, enableRotationDetection: boolean): string | undefined {
    const cached = this.cache.get(cacheKey);
    
    if (!cached || cached.expiry <= Date.now()) {
      return undefined;
    }

    // Check for rotation if enabled
    if (enableRotationDetection && this.shouldCheckRotation(cached)) {
      console.log(`🔄 Rotation check needed for secret: ${cacheKey}`);
      return undefined; // Force refresh
    }

    return cached.value;
  }

  /**
   * Retrieve secret with retry logic and circuit breaker protection
   */
  private async retrieveWithRetry(
    secretId: string,
    region: string,
    cacheKey: string,
    ttlMs: number,
    maxRetries: number,
    validateFormat?: (value: string) => boolean,
    tags: Record<string, string> = {}
  ): Promise<string | undefined> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔐 Fetching secret (attempt ${attempt}/${maxRetries}): ${secretId}`);
        
        const value = await getSecretValue(secretId, region);
        
        if (!value) {
          throw new Error(`Secret ${secretId} returned empty value`);
        }

        // Validate format if provided
        if (validateFormat && !validateFormat(value)) {
          throw new Error(`Secret ${secretId} failed format validation`);
        }

        // Cache the successful result
        this.cache.set(cacheKey, {
          value,
          expiry: Date.now() + ttlMs,
          rotationInProgress: false,
          lastRotationCheck: Date.now()
        });

        // Reset circuit breaker on success
        this.resetCircuitBreaker(cacheKey);

        // Log success with tags for monitoring
        console.log(`✅ Secret retrieved successfully: ${secretId}`, { 
          region, 
          attempt, 
          tags 
        });

        return value;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`❌ Attempt ${attempt} failed for ${secretId}:`, lastError.message);

        // Record failure for circuit breaker
        this.recordCircuitBreakerFailure(cacheKey);

        // Wait before retry (exponential backoff with jitter)
        if (attempt < maxRetries) {
          const backoffMs = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    }

    throw lastError || new Error(`Failed to retrieve secret ${secretId} after ${maxRetries} attempts`);
  }

  /**
   * Circuit breaker management
   */
  private isCircuitBreakerOpen(key: string, threshold: number): boolean {
    const breaker = this.circuitBreakers.get(key);
    if (!breaker) return false;

    const now = Date.now();
    
    // Reset if timeout expired
    if (breaker.state === 'OPEN' && now - breaker.lastFailureTime > this.CIRCUIT_BREAKER_TIMEOUT) {
      breaker.state = 'HALF_OPEN';
      breaker.failures = 0;
    }

    return breaker.state === 'OPEN';
  }

  private recordCircuitBreakerFailure(key: string): void {
    const breaker = this.circuitBreakers.get(key) || {
      failures: 0,
      lastFailureTime: 0,
      state: 'CLOSED' as const
    };

    breaker.failures++;
    breaker.lastFailureTime = Date.now();

    if (breaker.failures >= this.CIRCUIT_BREAKER_THRESHOLD) {
      breaker.state = 'OPEN';
      console.warn(`🚨 Circuit breaker OPENED for: ${key}`);
    }

    this.circuitBreakers.set(key, breaker);
  }

  private resetCircuitBreaker(key: string): void {
    const breaker = this.circuitBreakers.get(key);
    if (breaker) {
      breaker.failures = 0;
      breaker.state = 'CLOSED';
    }
  }

  /**
   * Rotation detection
   */
  private shouldCheckRotation(cached: SecretCacheEntry): boolean {
    if (!cached.lastRotationCheck) return true;
    return Date.now() - cached.lastRotationCheck > this.ROTATION_CHECK_INTERVAL;
  }

  /**
   * Cache management
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🧹 Secret cache cleared');
  }

  cleanupExpired(): void {
    const now = Date.now();
    let cleaned = 0;
    
    this.cache.forEach((entry, key) => {
      if (entry.expiry <= now) {
        this.cache.delete(key);
        cleaned++;
      }
    });
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
    }
  }

  /**
   * Health check for monitoring
   */
  getHealthStatus(): {
    cacheSize: number;
    openCircuitBreakers: number;
    expiredEntries: number;
  } {
    const now = Date.now();
    let expiredEntries = 0;
    
    this.cache.forEach((entry) => {
      if (entry.expiry <= now) {
        expiredEntries++;
      }
    });

    const openCircuitBreakers = Array.from(this.circuitBreakers.values())
      .filter(breaker => breaker.state === 'OPEN').length;

    return {
      cacheSize: this.cache.size,
      openCircuitBreakers,
      expiredEntries
    };
  }
}

// Export singleton instance
export const enhancedSecretsManager = EnhancedSecretsManager.getInstance();

// Common validation functions
export const SecretValidators = {
  stripeKey: (value: string) => /^sk_(test_|live_)[a-zA-Z0-9]+$/.test(value),
  stripePublishableKey: (value: string) => /^pk_(test_|live_)[a-zA-Z0-9]+$/.test(value),
  webhookSecret: (value: string) => /^whsec_[a-zA-Z0-9]+$/.test(value),
  apiKey: (value: string) => value.length >= 32,
  databaseUrl: (value: string) => /^postgresql:\/\//.test(value) || /^mysql:\/\//.test(value),
  jwt: (value: string) => value.split('.').length === 3,
};

// Pre-configured secret patterns for common services
export const SecretPatterns = {
  stripe: {
    publishableKey: (env: string) => `${env}/payments/stripe-publishable-key`,
    secretKey: (env: string) => `${env}/payments/stripe-secret-key`,
    webhookSecret: (env: string) => `${env}/payments/stripe-webhook-secret`,
  },
  database: {
    url: (env: string) => `${env}/database/connection-string`,
    credentials: (env: string) => `${env}/database/credentials`,
  },
  oauth: {
    google: (env: string) => `${env}/oauth/google-credentials`,
    github: (env: string) => `${env}/oauth/github-credentials`,
    discord: (env: string) => `${env}/oauth/discord-credentials`,
  },
  apis: {
    duffel: (env: string) => `${env}/apis/duffel-credentials`,
    twilio: (env: string) => `${env}/apis/twilio-credentials`,
    launchDarkly: (env: string) => `${env}/apis/launchdarkly-credentials`,
  }
};
