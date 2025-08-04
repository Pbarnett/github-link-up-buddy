import { 
  SecretsManagerClient, 
  GetSecretValueCommand,
  DescribeSecretCommand,
  ListSecretsCommand,
  UpdateSecretCommand
} from '@aws-sdk/client-secrets-manager';

// Browser/Node compatibility detection
const isNode = typeof window === 'undefined';

// Use Web Crypto API for cross-platform compatibility
const crypto = globalThis.crypto || {};

// Types and interfaces
export interface CachedSecret {
  value: any;
  versionId: string;
  lastUpdated: number;
  expiresAt: number;
  rotationInProgress: boolean;
  refreshPromise?: Promise<any>;
  accessCount: number;
  lastAccessed: number;
}

export interface SecretConfig {
  name: string;
  ttl: number;
  rotationEnabled: boolean;
  fallbackRegions: string[];
  proactiveRefreshThreshold?: number;
  maxRetries?: number;
  priority: 'high' | 'medium' | 'low';
}

export interface CircuitBreakerState {
  failures: number;
  lastFailure: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  nextAttempt: number;
  successCount: number;
}

export interface SecretMetrics {
  region: string;
  secretName: string;
  operation: string;
  success: boolean;
  duration: number;
  cacheHit: boolean;
  error?: string;
  timestamp: number;
}

export interface StripeCredentials {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  environment: string;
}

export interface SupabaseCredentials {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
  databaseUrl?: string;
}

export interface FlightAPICredentials {
  apiKey: string;
  apiSecret?: string;
  baseUrl: string;
  clientId?: string;
  clientSecret?: string;
}

/**
 * Enhanced AWS Secrets Manager with intelligent caching and rotation handling
 * 
 * Features:
 * - Multi-layer caching with proactive refresh
 * - Circuit breaker pattern for region failover
 * - Rotation-aware connection management
 * - Cost optimization through intelligent caching
 * - Comprehensive error handling and retries
 * - Performance metrics and monitoring
 */
export class EnhancedSecretsManager {
  private cache = new Map<string, CachedSecret>();
  private clients = new Map<string, SecretsManagerClient>();
  private circuitBreakers = new Map<string, CircuitBreakerState>();
  private metrics: SecretMetrics[] = [];
  private refreshTimers = new Map<string, NodeJS.Timeout>();
  
  // Configuration constants
  private readonly DEFAULT_TTL = 300000; // 5 minutes
  private readonly ROTATION_BUFFER = 60000; // 1 minute buffer before expiry
  private readonly STALE_CACHE_THRESHOLD = 1800000; // 30 minutes
  private readonly MAX_CACHE_SIZE = 1000;
  private readonly CIRCUIT_BREAKER_THRESHOLD = 3;
  private readonly CIRCUIT_BREAKER_TIMEOUT = 60000; // 1 minute
  private readonly PROACTIVE_REFRESH_THRESHOLD = 0.2; // 20% of TTL remaining

  constructor(
    private regions: string[] = ['us-east-1', 'us-west-2', 'eu-west-1'],
    private primaryRegion: string = 'us-east-1'
  ) {
    this.initializeClients();
    this.startCacheCleanupTimer();
  }

  /**
   * Initialize Secrets Manager clients for all regions with optimized configuration
   */
  private initializeClients(): void {
    this.regions.forEach(region => {
      const clientConfig: any = {
        region,
        maxAttempts: 5,
        retryMode: 'adaptive'
      };
      
      this.clients.set(region, new SecretsManagerClient(clientConfig));
    });
  }

  /**
   * Get secret with intelligent caching and failover
   */
  /**
   * Simple wrapper for backward compatibility
   */
  async getSecretValue(secretName: string, region?: string): Promise<string | undefined> {
    try {
      const result = await this.getSecret(secretName, { fallbackRegions: region ? [region] : undefined });
      return typeof result === 'string' ? result : JSON.stringify(result);
    } catch (error) {
      console.error(`Failed to get secret ${secretName}:`, error);
      return undefined;
    }
  }

  async getSecret(secretName: string, config?: Partial<SecretConfig>): Promise<any> {
    const startTime = Date.now();
    const normalizedName = this.normalizeSecretName(secretName);
    
    const secretConfig: SecretConfig = {
      name: normalizedName,
      ttl: config?.ttl || this.DEFAULT_TTL,
      rotationEnabled: config?.rotationEnabled ?? true,
      fallbackRegions: config?.fallbackRegions || this.regions.slice(1),
      proactiveRefreshThreshold: config?.proactiveRefreshThreshold || this.PROACTIVE_REFRESH_THRESHOLD,
      maxRetries: config?.maxRetries || 3,
      priority: config?.priority || 'medium'
    };

    try {
      // Check cache first
      const cached = this.cache.get(normalizedName);
      if (cached && this.isCacheValid(cached, secretConfig)) {
        // Update access metrics
        cached.accessCount++;
        cached.lastAccessed = Date.now();
        
        // Proactive refresh if near expiry
        if (this.shouldProactiveRefresh(cached, secretConfig)) {
          this.refreshSecretAsync(secretConfig);
        }
        
        this.recordMetrics({
          region: 'cache',
          secretName: normalizedName,
          operation: 'getSecret',
          success: true,
          duration: Date.now() - startTime,
          cacheHit: true,
          timestamp: Date.now()
        });
        
        return cached.value;
      }

      // Cache miss or expired - fetch from AWS
      const secret = await this.fetchAndCacheSecret(secretConfig);
      
      this.recordMetrics({
        region: this.primaryRegion,
        secretName: normalizedName,
        operation: 'getSecret',
        success: true,
        duration: Date.now() - startTime,
        cacheHit: false,
        timestamp: Date.now()
      });
      
      return secret;
    } catch (error) {
      this.recordMetrics({
        region: 'unknown',
        secretName: normalizedName,
        operation: 'getSecret',
        success: false,
        duration: Date.now() - startTime,
        cacheHit: false,
        error: (error as Error).message,
        timestamp: Date.now()
      });
      
      throw error;
    }
  }

  /**
   * Normalize secret name to handle special characters and ensure consistency
   */
  private normalizeSecretName(secretName: string): string {
    return secretName
      .replace(/[^a-zA-Z0-9\-_\/\.]/g, '-') // Replace special chars with hyphens
      .replace(/\/+/g, '/') // Remove duplicate slashes
      .replace(/^\/|\/$/g, '') // Remove leading/trailing slashes
      .toLowerCase(); // Consistent casing
  }

  /**
   * Check if cached secret is still valid
   */
  private isCacheValid(cached: CachedSecret, config: SecretConfig): boolean {
    const now = Date.now();
    
    // Don't use cache if rotation is in progress (unless it's very recent)
    if (cached.rotationInProgress && (now - cached.lastUpdated) > 30000) {
      return false;
    }
    
    // Check if cache has expired
    if (now > cached.expiresAt) {
      return false;
    }
    
    return true;
  }

  /**
   * Determine if secret should be proactively refreshed
   */
  private shouldProactiveRefresh(cached: CachedSecret, config: SecretConfig): boolean {
    if (!config.rotationEnabled) return false;
    if (cached.refreshPromise) return false; // Already refreshing
    
    const now = Date.now();
    const timeUntilExpiry = cached.expiresAt - now;
    const refreshThreshold = config.ttl * (config.proactiveRefreshThreshold || this.PROACTIVE_REFRESH_THRESHOLD);
    
    return timeUntilExpiry <= refreshThreshold;
  }

  /**
   * Fetch secret from AWS and update cache
   */
  private async fetchAndCacheSecret(config: SecretConfig): Promise<any> {
    // Try primary region first, then failover
    const regionsToTry = [this.primaryRegion, ...config.fallbackRegions];
    
    let lastError: Error | null = null;
    
    for (const region of regionsToTry) {
      try {
        const secret = await this.fetchSecretFromRegion(config.name, region);
        this.updateCache(config.name, secret, config);
        return secret.value;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Failed to fetch secret ${config.name} from region ${region}:`, error);
        
        // Don't retry on certain errors
        if (this.isNonRetryableError(error)) {
          break;
        }
        
        continue;
      }
    }
    
    // All regions failed - check if we have stale cache we can use
    const staleCache = this.cache.get(config.name);
    if (staleCache && this.canUseStaleCache(staleCache)) {
      console.warn(`Using stale cache for secret ${config.name} due to fetch failures`);
      // Extend expiry slightly to allow for recovery
      staleCache.expiresAt = Date.now() + 60000; // 1 minute grace period
      return staleCache.value;
    }
    
    throw lastError || new Error(`Failed to fetch secret ${config.name} from all regions`);
  }

  /**
   * Fetch secret from specific region with circuit breaker
   */
  private async fetchSecretFromRegion(secretName: string, region: string): Promise<{
    value: any;
    versionId: string;
    lastUpdated: number;
  }> {
    const client = this.clients.get(region)!;
    const circuitBreaker = this.getCircuitBreaker(region);
    
    // Check circuit breaker
    if (circuitBreaker.state === 'OPEN') {
      if (Date.now() < circuitBreaker.nextAttempt) {
        throw new Error(`Circuit breaker is OPEN for region ${region}`);
      }
      circuitBreaker.state = 'HALF_OPEN';
    }

    try {
      const command = new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: 'AWSCURRENT'
      });

      const response = await client.send(command);
      
      // Success - reset circuit breaker
      this.resetCircuitBreaker(region);
      
      let secretValue;
      try {
        secretValue = JSON.parse(response.SecretString || '{}');
      } catch {
        // Not JSON - treat as plain string
        secretValue = response.SecretString;
      }

      return {
        value: secretValue,
        versionId: response.VersionId || 'unknown',
        lastUpdated: Date.now()
      };
    } catch (error) {
      this.recordCircuitBreakerFailure(region);
      
      // Enhanced error handling with specific messages
      if (error.name === 'ResourceNotFoundException') {
        throw new Error(`Secret '${secretName}' not found in region ${region}. Verify the secret name and region.`);
      }
      
      if (error.name === 'InvalidParameterException') {
        throw new Error(`Invalid parameters for secret '${secretName}': ${error.message}. Check for special characters or invalid format.`);
      }
      
      if (error.name === 'ThrottlingException' || error.name === 'LimitExceededException') {
        const delay = Math.min(1000 * Math.pow(2, circuitBreaker.failures), 30000);
        console.warn(`Rate limited on secret ${secretName} in ${region}, backing off for ${delay}ms`);
        await this.sleep(delay);
        throw error;
      }
      
      if (error.name === 'DecryptionFailureException') {
        throw new Error(`Failed to decrypt secret '${secretName}' in ${region}. This may be due to rotation in progress or permission issues.`);
      }
      
      throw error;
    }
  }

  /**
   * Update cache with new secret value
   */
  private updateCache(secretName: string, secret: any, config: SecretConfig): void {
    const now = Date.now();
    
    // Clean up old refresh timer if exists
    const existingTimer = this.refreshTimers.get(secretName);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.refreshTimers.delete(secretName);
    }
    
    const cached: CachedSecret = {
      value: secret.value,
      versionId: secret.versionId,
      lastUpdated: secret.lastUpdated,
      expiresAt: now + config.ttl,
      rotationInProgress: false,
      accessCount: 1,
      lastAccessed: now
    };
    
    this.cache.set(secretName, cached);
    
    // Set up proactive refresh timer
    if (config.rotationEnabled) {
      const refreshDelay = config.ttl * (1 - (config.proactiveRefreshThreshold || this.PROACTIVE_REFRESH_THRESHOLD));
      const timer = setTimeout(() => {
        this.refreshSecretAsync(config);
      }, refreshDelay);
      
      this.refreshTimers.set(secretName, timer);
    }
    
    // Ensure cache doesn't grow too large
    this.enforceMaxCacheSize();
  }

  /**
   * Asynchronously refresh secret without blocking current requests
   */
  private async refreshSecretAsync(config: SecretConfig): Promise<void> {
    const cached = this.cache.get(config.name);
    if (!cached || cached.refreshPromise) {
      return; // Already refreshing or no cache
    }

    console.log(`Proactively refreshing secret ${config.name}`);
    
    cached.refreshPromise = this.fetchAndCacheSecret(config)
      .then(() => {
        console.log(`Successfully refreshed secret ${config.name}`);
      })
      .catch(error => {
        console.error(`Failed to refresh secret ${config.name}:`, error);
        // On refresh failure, extend current cache slightly
        if (cached) {
          cached.expiresAt = Math.max(cached.expiresAt, Date.now() + 30000);
        }
      })
      .finally(() => {
        if (cached) {
          cached.refreshPromise = undefined;
        }
      });

    await cached.refreshPromise;
  }

  /**
   * Circuit breaker management
   */
  private getCircuitBreaker(region: string): CircuitBreakerState {
    if (!this.circuitBreakers.has(region)) {
      this.circuitBreakers.set(region, {
        failures: 0,
        lastFailure: 0,
        state: 'CLOSED',
        nextAttempt: 0,
        successCount: 0
      });
    }
    return this.circuitBreakers.get(region)!;
  }

  private recordCircuitBreakerFailure(region: string): void {
    const breaker = this.getCircuitBreaker(region);
    breaker.failures++;
    breaker.lastFailure = Date.now();
    breaker.successCount = 0;
    
    if (breaker.failures >= this.CIRCUIT_BREAKER_THRESHOLD) {
      breaker.state = 'OPEN';
      breaker.nextAttempt = Date.now() + this.CIRCUIT_BREAKER_TIMEOUT;
      console.warn(`Circuit breaker OPENED for Secrets Manager in region ${region}`);
    }
  }

  private resetCircuitBreaker(region: string): void {
    const breaker = this.getCircuitBreaker(region);
    breaker.successCount++;
    
    if (breaker.state === 'HALF_OPEN' && breaker.successCount >= 2) {
      breaker.failures = 0;
      breaker.state = 'CLOSED';
      breaker.nextAttempt = 0;
      console.log(`Circuit breaker CLOSED for Secrets Manager in region ${region}`);
    } else if (breaker.state === 'CLOSED') {
      breaker.failures = Math.max(0, breaker.failures - 1);
    }
  }

  /**
   * Check if error should not be retried across regions
   */
  private isNonRetryableError(error: any): boolean {
    const nonRetryableErrors = [
      'InvalidParameterException',
      'MalformedPolicyDocumentException',
      'ResourceExistsException',
      'InvalidRequestException'
    ];
    
    return nonRetryableErrors.includes(error.name);
  }

  /**
   * Check if stale cache can be used as fallback
   */
  private canUseStaleCache(cached: CachedSecret): boolean {
    const age = Date.now() - cached.lastUpdated;
    return age < this.STALE_CACHE_THRESHOLD;
  }

  /**
   * Enforce maximum cache size by removing least recently used entries
   */
  private enforceMaxCacheSize(): void {
    if (this.cache.size <= this.MAX_CACHE_SIZE) return;
    
    // Sort by last accessed time (LRU eviction)
    const entries = Array.from(this.cache.entries()).sort(
      ([, a], [, b]) => a.lastAccessed - b.lastAccessed
    );
    
    const toRemove = entries.slice(0, this.cache.size - this.MAX_CACHE_SIZE);
    toRemove.forEach(([key]) => {
      this.cache.delete(key);
      const timer = this.refreshTimers.get(key);
      if (timer) {
        clearTimeout(timer);
        this.refreshTimers.delete(key);
      }
    });
    
    console.log(`Evicted ${toRemove.length} secrets from cache (LRU)`);
  }

  /**
   * Start periodic cache cleanup
   */
  private startCacheCleanupTimer(): void {
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 60000); // Every minute
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupExpiredCache(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    this.cache.forEach((cached, key) => {
      if (now > cached.expiresAt && !cached.refreshPromise) {
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => {
      this.cache.delete(key);
      const timer = this.refreshTimers.get(key);
      if (timer) {
        clearTimeout(timer);
        this.refreshTimers.delete(key);
      }
    });
    
    if (expiredKeys.length > 0) {
      console.log(`Cleaned up ${expiredKeys.length} expired secrets from cache`);
    }
  }

  /**
   * Record operation metrics
   */
  private recordMetrics(metrics: SecretMetrics): void {
    this.metrics.push(metrics);
    
    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics.splice(0, this.metrics.length - 1000);
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics(): SecretMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    hitRate: number;
    totalRequests: number;
    cacheHits: number;
    averageAge: number;
  } {
    const now = Date.now();
    const recentMetrics = this.metrics.filter(m => now - m.timestamp < 3600000); // Last hour
    
    const totalRequests = recentMetrics.length;
    const cacheHits = recentMetrics.filter(m => m.cacheHit).length;
    const hitRate = totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0;
    
    const ages = Array.from(this.cache.values()).map(c => now - c.lastUpdated);
    const averageAge = ages.length > 0 ? ages.reduce((a, b) => a + b, 0) / ages.length : 0;
    
    return {
      size: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
      totalRequests,
      cacheHits,
      averageAge: Math.round(averageAge / 1000) // in seconds
    };
  }

  /**
   * Get circuit breaker status
   */
  getCircuitBreakerStatus(): Map<string, CircuitBreakerState> {
    return new Map(this.circuitBreakers);
  }

  /**
   * Invalidate specific secret from cache
   */
  invalidateSecret(secretName: string): void {
    const normalizedName = this.normalizeSecretName(secretName);
    this.cache.delete(normalizedName);
    
    const timer = this.refreshTimers.get(normalizedName);
    if (timer) {
      clearTimeout(timer);
      this.refreshTimers.delete(normalizedName);
    }
    
    console.log(`Invalidated secret ${normalizedName} from cache`);
  }

  /**
   * Warm up cache with frequently used secrets
   */
  async warmupCache(secretNames: string[], configs?: Map<string, Partial<SecretConfig>>): Promise<void> {
    console.log(`Warming up cache with ${secretNames.length} secrets`);
    
    const warmupPromises = secretNames.map(async (secretName) => {
      try {
        const config = configs?.get(secretName) || {};
        await this.getSecret(secretName, config);
        console.log(`Warmed up secret: ${secretName}`);
      } catch (error) {
        console.warn(`Failed to warm up secret ${secretName}:`, error);
      }
    });
    
    await Promise.allSettled(warmupPromises);
    console.log('Cache warmup completed');
  }

  /**
   * Utility function for delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    // Clear all timers
    this.refreshTimers.forEach(timer => clearTimeout(timer));
    this.refreshTimers.clear();
    
    // Clear cache
    this.cache.clear();
    
    // Reset circuit breakers
    this.circuitBreakers.clear();
    
    // Clear metrics
    this.metrics.length = 0;
    
    console.log('Secrets Manager cleanup completed');
  }
}

// Export singleton instance
export const secretsManager = new EnhancedSecretsManager();

// Standalone function for backward compatibility
export async function getSecretValue(secretName: string, region?: string): Promise<string | undefined> {
  return secretsManager.getSecretValue(secretName, region);
}
