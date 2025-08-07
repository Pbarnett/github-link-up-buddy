/**
 * Enhanced AWS SDK Configuration
 * 
 * Environment-specific configurations for your Parker Flight application.
 * This file provides templates for different deployment environments.
 */

const environments = {
  // Development Environment
  development: {
    aws: {
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        // For development, you can use environment variables
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    },
    
    // Enhanced client configuration
    clientFactory: {
      environment: 'development',
      enableLogging: true,
      enableMetrics: false,
      enableTracing: false,
      maxAttempts: 2,
      connectionTimeout: 3000,
      socketTimeout: 10000,
      maxSockets: 10,
      keepAlive: true,
    },
    
    // Multi-region configuration
    multiRegion: {
      enabled: false, // Disable for development
      primaryRegion: 'us-east-1',
      backupRegions: ['us-west-2'],
      healthCheckInterval: 60000,
      circuitBreakerThreshold: 3,
    },
    
    // KMS configuration
    kms: {
      keys: {
        general: process.env.KMS_GENERAL_ALIAS || 'alias/parker-flight-general-dev',
        pii: process.env.KMS_PII_ALIAS || 'alias/parker-flight-pii-dev',
        payment: process.env.KMS_PAYMENT_ALIAS || 'alias/parker-flight-payment-dev',
      },
      enableAuditLogging: true,
      enableMetrics: false,
    },
  },

  // Staging Environment
  staging: {
    aws: {
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        // In staging, prefer IAM roles but allow env vars for testing
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    },
    
    clientFactory: {
      environment: 'staging',
      enableLogging: true,
      enableMetrics: true,
      enableTracing: true,
      maxAttempts: 3,
      connectionTimeout: 5000,
      socketTimeout: 20000,
      maxSockets: 25,
      keepAlive: true,
      credentialSource: 'auto', // Try IAM roles first
    },
    
    multiRegion: {
      enabled: true,
      primaryRegion: 'us-east-1',
      backupRegions: ['us-west-2', 'eu-west-1'],
      failoverStrategy: 'latency',
      healthCheckInterval: 30000,
      circuitBreakerThreshold: 5,
    },
    
    kms: {
      keys: {
        general: process.env.KMS_GENERAL_ALIAS || 'alias/parker-flight-general-staging',
        pii: process.env.KMS_PII_ALIAS || 'alias/parker-flight-pii-staging',
        payment: process.env.KMS_PAYMENT_ALIAS || 'alias/parker-flight-payment-staging',
      },
      enableAuditLogging: true,
      enableMetrics: true,
    },
  },

  // Production Environment
  production: {
    aws: {
      region: process.env.AWS_REGION || 'us-east-1',
      // In production, use IAM roles - no hardcoded credentials
    },
    
    clientFactory: {
      environment: 'production',
      enableLogging: false, // Reduce logging for performance
      enableMetrics: true,
      enableTracing: true,
      maxAttempts: 3,
      connectionTimeout: 5000,
      socketTimeout: 30000,
      maxSockets: 50,
      keepAlive: true,
      credentialSource: 'auto', // Use IAM roles
    },
    
    multiRegion: {
      enabled: true,
      primaryRegion: 'us-east-1',
      backupRegions: ['us-west-2', 'eu-west-1', 'ap-southeast-1'],
      failoverStrategy: 'latency',
      healthCheckInterval: 15000,
      circuitBreakerThreshold: 5,
      circuitBreakerTimeout: 60000,
    },
    
    kms: {
      keys: {
        general: process.env.KMS_GENERAL_ALIAS || 'alias/parker-flight-general-production',
        pii: process.env.KMS_PII_ALIAS || 'alias/parker-flight-pii-production',
        payment: process.env.KMS_PAYMENT_ALIAS || 'alias/parker-flight-payment-production',
      },
      enableAuditLogging: true,
      enableMetrics: true,
    },
    
    // Production monitoring
    monitoring: {
      cloudWatch: {
        namespace: 'ParkerFlight/KMS',
        enableDetailedMetrics: true,
        alarmThresholds: {
          errorRate: 0.05, // 5% error rate threshold
          latency: 5000,   // 5 second latency threshold
          failoverRate: 0.1, // 10% failover rate threshold
        },
      },
      xray: {
        enabled: true,
        samplingRate: 0.1, // Sample 10% of requests
      },
    },
  },
};

// Get current environment
const currentEnv = process.env.NODE_ENV || 'development';
const config = environments[currentEnv];

if (!config) {
  throw new Error(`Unknown environment: ${currentEnv}`);
}

// Validation function
function validateConfig() {
  const errors = [];
  
  // Check required environment variables based on environment
  if (currentEnv !== 'production' && !process.env.AWS_ACCESS_KEY_ID) {
    errors.push('AWS_ACCESS_KEY_ID is required for non-production environments');
  }
  
  if (currentEnv !== 'production' && !process.env.AWS_SECRET_ACCESS_KEY) {
    errors.push('AWS_SECRET_ACCESS_KEY is required for non-production environments');
  }
  
  if (!process.env.AWS_REGION) {
    errors.push('AWS_REGION should be set explicitly');
  }
  
  // Check KMS key aliases
  if (currentEnv === 'production') {
    if (!process.env.KMS_GENERAL_ALIAS) {
      errors.push('KMS_GENERAL_ALIAS must be set in production');
    }
    if (!process.env.KMS_PII_ALIAS) {
      errors.push('KMS_PII_ALIAS must be set in production');
    }
    if (!process.env.KMS_PAYMENT_ALIAS) {
      errors.push('KMS_PAYMENT_ALIAS must be set in production');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    environment: currentEnv,
    config: config,
  };
}

// Export configuration
module.exports = {
  current: config,
  environment: currentEnv,
  all: environments,
  validate: validateConfig,
  
  // Helper functions
  getClientFactoryConfig: () => ({
    region: config.aws.region,
    ...config.clientFactory,
  }),
  
  getMultiRegionConfig: () => ({
    primaryRegion: config.aws.region,
    environment: currentEnv,
    ...config.multiRegion,
  }),
  
  getKMSConfig: () => ({
    region: config.aws.region,
    keys: config.kms.keys,
    ...config.kms,
  }),
};

// Validate configuration on module load
const validation = validateConfig();
if (!validation.isValid) {
  console.warn('⚠️  AWS SDK Enhanced Configuration Issues:');
  validation.errors.forEach(error => {
    console.warn(`   - ${error}`);
  });
  console.warn('   Please check your environment variables and configuration.');
}
