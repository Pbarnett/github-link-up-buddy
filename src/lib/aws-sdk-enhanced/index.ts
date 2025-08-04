/**
 * Enhanced AWS SDK Components
 * 
 * Production-ready AWS services with intelligent caching, failover,
 * circuit breakers, and comprehensive error handling.
 */

// Core AWS SDK enhancements
export { EnhancedAWSClientFactory } from './client-factory';
export { EnhancedAWSErrorHandler } from './error-handling';

// KMS Manager for encryption/decryption
export { 
  MultiRegionKMSManager, 
  kmsManager,
  type EncryptedData,
  type CachedDataKey,
  type KeyType 
} from './multi-region-kms-manager';

// Enhanced Secrets Manager
export { 
  EnhancedSecretsManager,
  secretsManager,
  type CachedSecret,
  type SecretConfig,
  type SecretMetrics,
  type StripeCredentials,
  type SupabaseCredentials,
  type FlightAPICredentials 
} from './secrets-manager';

// Secret Configuration Manager
export { 
  SecretConfigurationManager,
  secretConfigManager 
} from './secret-config-manager';

// Connection Manager with rotation handling
export { 
  RotationAwareConnectionManager,
  connectionManager 
} from './connection-manager';

// Usage examples and monitoring
import {
  SecretsMonitor,
  SecretsStartupHelper,
  secretsMonitor,
  startupHelper as _startupHelper,
  createSecretsMiddleware,
  basicSecretUsage,
  connectionManagementExample,
  batchSecretRetrievalExample,
  cacheWarmupExample
} from './secrets-usage-examples';

// Import required services for EnhancedAWSSetup
import { secretConfigManager } from './secret-config-manager';
import { connectionManager } from './connection-manager';
import { kmsManager } from './multi-region-kms-manager';

// Re-export for external use
export {
  SecretsMonitor,
  SecretsStartupHelper,
  secretsMonitor,
  createSecretsMiddleware,
  basicSecretUsage,
  connectionManagementExample,
  batchSecretRetrievalExample,
  cacheWarmupExample
};
export const startupHelper = _startupHelper;

// Legacy AWS Performance Optimization Classes (backward compatibility)
export { KMSDataKeyCache } from './kms-data-key-cache';
export { SecretCache } from './secret-cache-advanced';
export { MultiRegionClientManager } from './multi-region-optimized';

// Performance metrics and utilities
export interface PerformanceMetrics {
  cacheHitRate: number;
  averageLatency: number;
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
}

export class PerformanceMonitor {
  private metrics = {
    cacheHits: 0,
    cacheMisses: 0,
    totalLatency: 0,
    requestCount: 0
  };

  recordCacheHit(): void {
    this.metrics.cacheHits++;
  }

  recordCacheMiss(): void {
    this.metrics.cacheMisses++;
  }

  recordLatency(latency: number): void {
    this.metrics.totalLatency += latency;
    this.metrics.requestCount++;
  }

  getMetrics(): PerformanceMetrics {
    const totalRequests = this.metrics.cacheHits + this.metrics.cacheMisses;
    return {
      cacheHitRate: totalRequests > 0 ? this.metrics.cacheHits / totalRequests : 0,
      averageLatency: this.metrics.requestCount > 0 ? this.metrics.totalLatency / this.metrics.requestCount : 0,
      totalRequests,
      cacheHits: this.metrics.cacheHits,
      cacheMisses: this.metrics.cacheMisses
    };
  }

  reset(): void {
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      totalLatency: 0,
      requestCount: 0
    };
  }
}

/**
 * Quick Setup Helper
 * 
 * For rapid integration into existing applications
 */
export class EnhancedAWSSetup {
  /**
   * Initialize enhanced AWS services for your application
   */
  static async initialize(options?: {
    environment?: string;
    warmupSecrets?: boolean;
    enableMonitoring?: boolean;
  }) {
    const { 
      environment = process.env.NODE_ENV || 'development',
      warmupSecrets = true,
      enableMonitoring = true
    } = options || {};

    console.log('🚀 Initializing Enhanced AWS Services...');

    try {
      // Initialize startup helper only if warming up secrets
      if (warmupSecrets) {
        await startupHelper.initialize();
      }

      // Setup monitoring if requested (without warmup)
      if (enableMonitoring && !warmupSecrets) {
        console.log('📊 Setting up monitoring without warmup...');
        // Monitor setup is handled by the startup helper normally,
        // but in development we skip it to avoid secret access issues
      }

      console.log('✅ Enhanced AWS Services initialized successfully');
      
      return {
        secretConfigManager,
        connectionManager,
        kmsManager,
        secretsMonitor
      };
    } catch (error) {
      console.error('❌ Failed to initialize Enhanced AWS Services:', error);
      throw error;
    }
  }

  /**
   * Get health status of all services
   */
  static async getHealthStatus() {
    return await secretsMonitor.getHealthStatus();
  }

  /**
   * Graceful shutdown of all services
   */
  static async shutdown() {
    console.log('🛑 Shutting down Enhanced AWS Services...');
    
    await Promise.allSettled([
      startupHelper.shutdown(),
      kmsManager.cleanup()
    ]);
    
    console.log('✅ Enhanced AWS Services shutdown complete');
  }
}

// Default export for convenience
export default EnhancedAWSSetup;
