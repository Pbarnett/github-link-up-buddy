import { secretsManager, SecretConfig, StripeCredentials, SupabaseCredentials, FlightAPICredentials } from './secrets-manager';

/**
 * Secret Configuration Manager
 * 
 * Provides optimized secret configurations and convenient access methods
 * for different types of services with appropriate caching and rotation settings.
 */
export class SecretConfigurationManager {
  private readonly environment: string;
  
  // Optimized secret configurations for different service types
  private readonly secretConfigs = {
    // Payment secrets - shorter TTL due to high sensitivity
    payments: {
      ttl: 180000, // 3 minutes
      rotationEnabled: true,
      fallbackRegions: ['us-west-2', 'eu-west-1'],
      proactiveRefreshThreshold: 0.3, // Refresh at 30% TTL remaining
      priority: 'high' as const
    },
    
    // Database secrets - medium TTL with rotation support
    database: {
      ttl: 300000, // 5 minutes
      rotationEnabled: true,
      fallbackRegions: ['us-west-2'],
      proactiveRefreshThreshold: 0.25,
      priority: 'high' as const
    },
    
    // API keys - longer TTL as they typically rotate less frequently
    'api-keys': {
      ttl: 600000, // 10 minutes
      rotationEnabled: false,
      fallbackRegions: ['us-west-2', 'eu-west-1'],
      proactiveRefreshThreshold: 0.2,
      priority: 'medium' as const
    },
    
    // Third-party integrations - balanced approach
    integrations: {
      ttl: 450000, // 7.5 minutes
      rotationEnabled: true,
      fallbackRegions: ['us-west-2'],
      proactiveRefreshThreshold: 0.25,
      priority: 'medium' as const
    },
    
    // Configuration secrets - longer TTL for less sensitive data
    config: {
      ttl: 900000, // 15 minutes
      rotationEnabled: false,
      fallbackRegions: ['us-west-2'],
      proactiveRefreshThreshold: 0.15,
      priority: 'low' as const
    }
  };

  constructor(environment: string = process.env.NODE_ENV || 'development') {
    this.environment = this.normalizeEnvironment(environment);
  }

  /**
   * Normalize environment name for consistency
   */
  private normalizeEnvironment(env: string): string {
    const envMap: { [key: string]: string } = {
      'dev': 'development',
      'develop': 'development',
      'stage': 'staging',
      'prod': 'production',
      'test': 'test'
    };
    
    return envMap[env.toLowerCase()] || env.toLowerCase();
  }

  /**
   * Get Stripe credentials with optimized payment secret configuration
   */
  async getStripeCredentials(environment?: string): Promise<StripeCredentials> {
    const env = environment || this.environment;
    const secretName = `${env}/payments/stripe-credentials`;
    const config = this.secretConfigs.payments;
    
    try {
      const secret = await secretsManager.getSecret(secretName, config);
      
      return {
        publishableKey: secret.publishable_key || secret.publishableKey,
        secretKey: secret.secret_key || secret.secretKey,
        webhookSecret: secret.webhook_secret || secret.webhookSecret,
        environment: env
      };
    } catch (error) {
      throw new Error(`Failed to retrieve Stripe credentials for ${env}: ${(error as Error).message}`)
    }
  }

  /**
   * Get Supabase credentials with database-optimized configuration
   */
  async getSupabaseCredentials(environment?: string): Promise<SupabaseCredentials> {
    const env = environment || this.environment;
    const secretName = `${env}/database/supabase-credentials`;
    const config = this.secretConfigs.database;
    
    try {
      const secret = await secretsManager.getSecret(secretName, config);
      
      return {
        url: secret.url || secret.supabase_url,
        anonKey: secret.anon_key || secret.anonKey,
        serviceRoleKey: secret.service_role_key || secret.serviceRoleKey,
        databaseUrl: secret.database_url || secret.databaseUrl
      };
    } catch (error) {
      throw new Error(`Failed to retrieve Supabase credentials for ${env}: ${(error as Error).message}`);
    }
  }

  /**
   * Get flight API credentials (Amadeus, Duffel, etc.)
   */
  async getFlightAPICredentials(
    provider: 'amadeus' | 'duffel' | 'sabre',
    environment?: string
  ): Promise<FlightAPICredentials> {
    const env = environment || this.environment;
    const secretName = `${env}/flight-apis/${provider}-credentials`;
    const config = this.secretConfigs.integrations;
    
    try {
      const secret = await secretsManager.getSecret(secretName, config);
      
      return {
        apiKey: secret.api_key || secret.apiKey,
        apiSecret: secret.api_secret || secret.apiSecret,
        baseUrl: secret.base_url || secret.baseUrl,
        clientId: secret.client_id || secret.clientId,
        clientSecret: secret.client_secret || secret.clientSecret
      };
    } catch (error) {
      throw new Error(`Failed to retrieve ${provider} API credentials for ${env}: ${(error as Error).message}`);
    }
  }

  /**
   * Get general API key for various services
   */
  async getAPIKey(serviceName: string, environment?: string): Promise<string> {
    const env = environment || this.environment;
    const secretName = `${env}/api-keys/${serviceName}`;
    const config = this.secretConfigs['api-keys'];
    
    try {
      const secret = await secretsManager.getSecret(secretName, config);
      
      // Handle both string and object formats
      if (typeof secret === 'string') {
        return secret;
      }
      
      return secret.api_key || secret.apiKey || secret.key || Object.values(secret)[0];
    } catch (error) {
      throw new Error(`Failed to retrieve API key for ${serviceName} in ${env}: ${(error as Error).message}`);
    }
  }

  /**
   * Get configuration value (non-sensitive data)
   */
  async getConfig(configName: string, environment?: string): Promise<any> {
    const env = environment || this.environment;
    const secretName = `${env}/config/${configName}`;
    const config = this.secretConfigs.config;
    
    try {
      return await secretsManager.getSecret(secretName, config);
    } catch (error) {
      throw new Error(`Failed to retrieve config ${configName} for ${env}: ${(error as Error).message}`);
    }
  }

  /**
   * Get database connection string
   */
  async getDatabaseConnectionString(
    dbType: 'postgres' | 'mysql' | 'mongodb',
    environment?: string
  ): Promise<string> {
    const env = environment || this.environment;
    const secretName = `${env}/database/${dbType}-connection`;
    const config = this.secretConfigs.database;
    
    try {
      const secret = await secretsManager.getSecret(secretName, config);
      
      return secret.connection_string || secret.connectionString || secret.url;
    } catch (error) {
      throw new Error(`Failed to retrieve ${dbType} connection string for ${env}: ${(error as Error).message}`);
    }
  }

  /**
   * Warm up cache with commonly used secrets for faster startup
   */
  async warmupCache(environment?: string): Promise<void> {
    const env = environment || this.environment;
    
    const commonSecrets = [
      `${env}/payments/stripe-credentials`,
      `${env}/database/supabase-credentials`,
      `${env}/flight-apis/amadeus-credentials`,
      `${env}/api-keys/openai`,
      `${env}/config/app-settings`
    ];

    const secretConfigs = new Map<string, Partial<SecretConfig>>();
    commonSecrets.forEach(secretName => {
      if (secretName.includes('/payments/')) {
        secretConfigs.set(secretName, this.secretConfigs.payments);
      } else if (secretName.includes('/database/')) {
        secretConfigs.set(secretName, this.secretConfigs.database);
      } else if (secretName.includes('/flight-apis/')) {
        secretConfigs.set(secretName, this.secretConfigs.integrations);
      } else if (secretName.includes('/api-keys/')) {
        secretConfigs.set(secretName, this.secretConfigs['api-keys']);
      } else if (secretName.includes('/config/')) {
        secretConfigs.set(secretName, this.secretConfigs.config);
      }
    });

    await secretsManager.warmupCache(commonSecrets, secretConfigs);
  }

  /**
   * Invalidate specific secret from cache (useful after manual rotation)
   */
  invalidateSecret(secretType: string, serviceName: string, environment?: string): void {
    const env = environment || this.environment;
    const secretName = `${env}/${secretType}/${serviceName}`;
    secretsManager.invalidateSecret(secretName);
  }

  /**
   * Get cache statistics for monitoring
   */
  getCacheStats() {
    return secretsManager.getCacheStats();
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return secretsManager.getMetrics();
  }

  /**
   * Get circuit breaker status
   */
  getCircuitBreakerStatus() {
    return secretsManager.getCircuitBreakerStatus();
  }

  /**
   * Batch fetch multiple secrets efficiently
   */
  async batchGetSecrets(secretRequests: Array<{
    name: string;
    type: 'payments' | 'database' | 'api-keys' | 'integrations' | 'config';
  }>): Promise<Map<string, any>> {
    const results = new Map<string, any>();
    
    // Execute requests in parallel with appropriate configurations
    const promises = secretRequests.map(async (request) => {
      try {
        const config = this.secretConfigs[request.type];
        const secret = await secretsManager.getSecret(request.name, config);
        results.set(request.name, secret);
      } catch (error) {
        console.error(`Failed to fetch secret ${request.name}:`, error);
        // Continue with other secrets, don't fail the entire batch
      }
    });

    await Promise.allSettled(promises);
    return results;
  }

  /**
   * Test secret accessibility (useful for health checks)
   */
  async testSecretAccess(secretName: string, secretType: 'payments' | 'database' | 'api-keys' | 'integrations' | 'config'): Promise<{
    accessible: boolean;
    responseTime: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      const config = this.secretConfigs[secretType];
      await secretsManager.getSecret(secretName, { ...config, ttl: 1000 }); // Very short TTL for test
      
      return {
        accessible: true,
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        accessible: false,
        responseTime: Date.now() - startTime,
        error: (error as Error).message
      };
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    await secretsManager.cleanup();
  }
}

// Export singleton instance
export const secretConfigManager = new SecretConfigurationManager();
