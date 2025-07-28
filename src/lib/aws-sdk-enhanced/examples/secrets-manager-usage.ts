import * as React from 'react';
/**
 * AWS Secrets Manager Usage Examples
 *
 * Comprehensive examples showing how to use the AWS Secrets Manager integration
 * in various real-world scenarios following AWS SDK v3 best practices.
 */

import { getSecretValue } from '../secrets-manager';

/**
 * Example 1: Retrieve Stripe API Keys
 * Common pattern for payment processing applications
 */
export async function getStripeKeys(
  environment: 'dev' | 'staging' | 'prod' = 'prod'
) {
  try {
    // Retrieve different Stripe keys based on environment
    const secretNames = {
      dev: 'dev/payments/stripe-secret-key',
      staging: 'staging/payments/stripe-secret-key',
      prod: 'prod/payments/stripe-secret-key',
    };

    const stripeSecretKey = await getSecretValue(
      secretNames[environment],
      process.env.AWS_REGION || 'us-west-2'
    );

    if (!stripeSecretKey) {
      throw new Error(
        `Stripe secret key not found for environment: ${environment}`
      );
    }

    return {
      secretKey: stripeSecretKey,
      environment,
    };
  } catch (error) {
    console.error('Failed to retrieve Stripe keys:', error);
    throw new Error('Unable to initialize payment processing');
  }
}

/**
 * Example 2: Database Connection Credentials
 * Secure database access using secrets from AWS Secrets Manager
 */
export async function getDatabaseCredentials(region: string = 'us-west-2') {
  try {
    // Retrieve database connection string or credentials
    const dbSecretId = 'prod/database/connection-string';
    const connectionString = await getSecretValue(dbSecretId, region);

    if (!connectionString) {
      throw new Error('Database credentials not found');
    }

    // Parse connection string (example format)
    // "postgresql://username:password@host:port/database"
    return {
      connectionString,
      // You could also store credentials as JSON and parse them
      // const creds = JSON.parse(connectionString);
      // return { host: creds.host, username: creds.username, ... };
    };
  } catch (error) {
    console.error('Failed to retrieve database credentials:', error);
    throw new Error('Unable to connect to database');
  }
}

/**
 * Example 3: OAuth Client Secrets
 * Secure OAuth integration with third-party services
 */
export async function getOAuthCredentials(
  provider: 'google' | 'github' | 'discord'
) {
  try {
    const region = process.env.AWS_REGION || 'us-west-2';

    // Retrieve OAuth credentials for different providers
    const secretIds = {
      google: 'prod/oauth/google-client-secret',
      github: 'prod/oauth/github-client-secret',
      discord: 'prod/oauth/discord-client-secret',
    };

    const clientSecret = await getSecretValue(secretIds[provider], region);

    if (!clientSecret) {
      throw new Error(`OAuth secret not found for provider: ${provider}`);
    }

    // Parse JSON secrets if they contain multiple values
    try {
      const credentials = JSON.parse(clientSecret);
      return {
        clientId: credentials.client_id,
        clientSecret: credentials.client_secret,
        redirectUri: credentials.redirect_uri,
        provider,
      };
    } catch {
      // If not JSON, assume it's just the client secret
      return {
        clientSecret,
        provider,
      };
    }
  } catch (error) {
    console.error(
      `Failed to retrieve OAuth credentials for ${provider}:`,
      error
    );
    throw new Error(`Unable to configure ${provider} OAuth`);
  }
}

/**
 * Example 4: API Keys with Caching
 * Implement caching to reduce AWS API calls and improve performance
 */
class SecretCache {
  private cache = new Map<string, { value: string; expiry: number }>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  async getSecret(
    secretId: string,
    region: string,
    ttlMs?: number
  ): Promise<string | undefined> {
    const cacheKey = `${secretId}-${region}`;
    const cached = this.cache.get(cacheKey);

    // Check if cache is still valid
    if (cached && cached.expiry > Date.now()) {
      console.log(`Cache hit for secret: ${secretId}`);
      return cached.value;
    }

    // Cache miss or expired - fetch from AWS
    try {
      console.log(`Fetching secret from AWS: ${secretId}`);
      const value = await getSecretValue(secretId, region);

      if (value) {
        // Cache the result
        this.cache.set(cacheKey, {
          value,
          expiry: Date.now() + (ttlMs || this.DEFAULT_TTL),
        });
      }

      return value;
    } catch (error) {
      console.error(`Failed to fetch secret ${secretId}:`, error);
      throw error;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanupExpired(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (value.expiry <= now) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance for use across the application
export const secretCache = new SecretCache();

/**
 * Example 5: Multi-Region Secret Retrieval
 * Handle secrets across multiple AWS regions with fallback
 */
export async function getSecretWithRegionalFallback(
  secretId: string,
  primaryRegion: string = 'us-west-2',
  fallbackRegions: string[] = ['us-east-1', 'eu-west-1']
) {
  // Try primary region first
  try {
    console.log(
      `Attempting to retrieve secret from primary region: ${primaryRegion}`
    );
    const secret = await getSecretValue(secretId, primaryRegion);
    if (secret) {
      return { secret, region: primaryRegion };
    }
  } catch (error) {
    console.warn(`Primary region ${primaryRegion} failed:`, error);
  }

  // Try fallback regions
  for (const region of fallbackRegions) {
    try {
      console.log(`Attempting fallback region: ${region}`);
      const secret = await getSecretValue(secretId, region);
      if (secret) {
        return { secret, region };
      }
    } catch (error) {
      console.warn(`Fallback region ${region} failed:`, error);
    }
  }

  throw new Error(`Secret ${secretId} not found in any configured region`);
}

/**
 * Example 6: Batch Secret Retrieval
 * Efficiently retrieve multiple secrets in parallel
 */
export async function getBatchSecrets(
  secrets: Array<{ id: string; region?: string }>,
  defaultRegion: string = 'us-west-2'
) {
  try {
    const secretPromises = secrets.map(
      async ({ id, region = defaultRegion }) => {
        try {
          const value = await getSecretValue(id, region);
          return { id, value, success: true, error: null };
        } catch (error) {
          return {
            id,
            value: null,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      }
    );

    const results = await Promise.all(secretPromises);

    // Separate successful and failed retrievals
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    return {
      successful,
      failed,
      totalCount: secrets.length,
      successCount: successful.length,
      failureCount: failed.length,
    };
  } catch (error) {
    console.error('Batch secret retrieval failed:', error);
    throw new Error('Failed to retrieve secrets in batch');
  }
}

/**
 * Example 7: Configuration Loading
 * Load application configuration from AWS Secrets Manager
 */
export async function loadApplicationConfig(environment: string = 'prod') {
  try {
    const configSecretId = `${environment}/app/config`;
    const region = process.env.AWS_REGION || 'us-west-2';

    const configJson = await getSecretValue(configSecretId, region);

    if (!configJson) {
      throw new Error(
        `Application configuration not found for environment: ${environment}`
      );
    }

    // Parse and validate configuration
    const config = JSON.parse(configJson);

    // Validate required configuration keys
    const requiredKeys = ['database_url', 'api_keys', 'feature_flags'];
    const missingKeys = requiredKeys.filter(key => !(key in config));

    if (missingKeys.length > 0) {
      throw new Error(
        `Missing required configuration keys: ${missingKeys.join(', ')}`
      );
    }

    return {
      ...config,
      environment,
      loadedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to load application configuration:', error);

    // Return default configuration for development
    if (environment === 'development') {
      console.warn('Using default development configuration');
      return {
        database_url: 'postgresql://localhost:5432/dev',
        api_keys: {},
        feature_flags: {},
        environment: 'development',
        loadedAt: new Date().toISOString(),
      };
    }

    throw error;
  }
}

/**
 * Example 8: Secure Secret Rotation Handling
 * Handle secrets that may be in the process of rotation
 */
export async function getSecretWithRotationSupport(
  secretId: string,
  region: string,
  maxRetries: number = 3
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const secret = await getSecretValue(secretId, region);

      if (secret) {
        return secret;
      }

      // If secret is null/undefined, it might be rotating
      if (attempt < maxRetries) {
        console.warn(
          `Secret ${secretId} not available, attempt ${attempt}/${maxRetries}. Retrying...`
        );
        // Wait before retrying (exponential backoff)
        await new Promise(resolve =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    } catch (error) {
      console.warn(`Attempt ${attempt} failed for secret ${secretId}:`, error);

      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }

  throw new Error(
    `Failed to retrieve secret ${secretId} after ${maxRetries} attempts`
  );
}

// Export utility functions for common patterns
export const SecretPatterns = {
  stripe: (env: string) => `${env}/payments/stripe-secret-key`,
  database: (env: string) => `${env}/database/connection-string`,
  oauth: (provider: string, env: string = 'prod') =>
    `${env}/oauth/${provider}-client-secret`,
  apiKey: (service: string, env: string = 'prod') =>
    `${env}/api/${service}-key`,
};
