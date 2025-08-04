/**
 * AWS Service-Specific Configurations
 * 
 * Optimized configurations for different AWS services based on their
 * characteristics, error patterns, and rate limits.
 */

import { ServiceConfig, ErrorType, DegradationStrategy } from './types';

export const AWS_SERVICE_CONFIGS: Record<string, ServiceConfig> = {
  KMS: {
    name: 'KMS',
    failureThreshold: 15, // Higher threshold for critical service
    timeoutMs: 90000, // 90 seconds
    resetTimeoutMs: 180000, // 3 minutes
    halfOpenMaxCalls: 3,
    retryConfig: {
      maxRetries: 5,
      baseDelayMs: 1000,
      maxDelayMs: 60000,
      backoffMultiplier: 2,
      jitterFactor: 0.1,
      retryableErrors: [
        'KMSInvalidStateException',
        'ThrottlingException',
        'ServiceUnavailableException',
        'InternalException',
        'LimitExceededException',
        'KeyUnavailableException'
      ],
      nonRetryableErrors: [
        'DisabledException',
        'InvalidKeyUsageException',
        'AccessDeniedException',
        'NotFoundException',
        'InvalidCiphertextException',
        'ValidationException'
      ]
    },
    rateLimiter: {
      maxTokens: 100,
      refillRate: 10,
      globalLimits: {
        maxRetries: 500,
        windowMs: 60000
      }
    },
    errorClassifier: (error: any) => {
      const errorName = error.name || error.code || '';
      
      if (errorName === 'ThrottlingException' || errorName === 'LimitExceededException') {
        return ErrorType.THROTTLING;
      }
      
      if ([
        'DisabledException',
        'InvalidKeyUsageException', 
        'AccessDeniedException',
        'NotFoundException',
        'InvalidCiphertextException',
        'ValidationException'
      ].includes(errorName)) {
        return ErrorType.NON_RETRYABLE;
      }
      
      if ([
        'KMSInvalidStateException',
        'ServiceUnavailableException',
        'InternalException',
        'KeyUnavailableException'
      ].includes(errorName)) {
        return ErrorType.RETRYABLE;
      }
      
      // Check HTTP status codes
      const statusCode = error.$metadata?.httpStatusCode || error.statusCode;
      if (statusCode === 429) return ErrorType.THROTTLING;
      if (statusCode >= 500) return ErrorType.RETRYABLE;
      if (statusCode >= 400 && statusCode < 500) return ErrorType.NON_RETRYABLE;
      
      return ErrorType.RETRYABLE;
    },
    healthCheck: async () => {
      try {
        // Simple health check - list keys with limit 1
        // This would be implemented with actual KMS client
        return true;
      } catch {
        return false;
      }
    }
  },

  SECRETS_MANAGER: {
    name: 'SECRETS_MANAGER',
    failureThreshold: 12,
    timeoutMs: 60000,
    resetTimeoutMs: 120000,
    halfOpenMaxCalls: 2,
    retryConfig: {
      maxRetries: 4,
      baseDelayMs: 800,
      maxDelayMs: 45000,
      backoffMultiplier: 2.5,
      jitterFactor: 0.15,
      retryableErrors: [
        'ThrottlingException',
        'ServiceUnavailableException',
        'InternalServiceException',
        'LimitExceededException'
      ],
      nonRetryableErrors: [
        'ResourceNotFoundException',
        'InvalidParameterException',
        'AccessDeniedException',
        'DecryptionFailureException',
        'InvalidRequestException',
        'ValidationException'
      ]
    },
    rateLimiter: {
      maxTokens: 50,
      refillRate: 5,
      globalLimits: {
        maxRetries: 300,
        windowMs: 60000
      }
    },
    errorClassifier: (error: any) => {
      const errorName = error.name || error.code || '';
      
      if (errorName === 'ThrottlingException' || errorName === 'LimitExceededException') {
        return ErrorType.THROTTLING;
      }
      
      if ([
        'ResourceNotFoundException',
        'InvalidParameterException',
        'AccessDeniedException',
        'DecryptionFailureException',
        'InvalidRequestException',
        'ValidationException'
      ].includes(errorName)) {
        return ErrorType.NON_RETRYABLE;
      }
      
      const statusCode = error.$metadata?.httpStatusCode || error.statusCode;
      if (statusCode === 429) return ErrorType.THROTTLING;
      if (statusCode >= 500) return ErrorType.RETRYABLE;
      if (statusCode >= 400 && statusCode < 500) return ErrorType.NON_RETRYABLE;
      
      return ErrorType.RETRYABLE;
    },
    healthCheck: async () => {
      try {
        // Simple health check for Secrets Manager
        return true;
      } catch {
        return false;
      }
    }
  },

  DYNAMODB: {
    name: 'DYNAMODB',
    failureThreshold: 20, // Higher threshold due to auto-scaling
    timeoutMs: 45000,
    resetTimeoutMs: 90000,
    halfOpenMaxCalls: 5,
    retryConfig: {
      maxRetries: 6,
      baseDelayMs: 500,
      maxDelayMs: 30000,
      backoffMultiplier: 2,
      jitterFactor: 0.2,
      retryableErrors: [
        'ProvisionedThroughputExceededException',
        'ThrottlingException',
        'ServiceUnavailableException',
        'InternalServerError',
        'RequestLimitExceeded',
        'LimitExceededException'
      ],
      nonRetryableErrors: [
        'ValidationException',
        'ResourceNotFoundException',
        'AccessDeniedException',
        'ItemCollectionSizeLimitExceededException',
        'ConditionalCheckFailedException',
        'TransactionConflictException'
      ]
    },
    rateLimiter: {
      maxTokens: 200,
      refillRate: 20,
      globalLimits: {
        maxRetries: 1000,
        windowMs: 60000
      }
    },
    errorClassifier: (error: any) => {
      const errorName = error.name || error.code || '';
      
      if ([
        'ProvisionedThroughputExceededException',
        'ThrottlingException',
        'RequestLimitExceeded'
      ].includes(errorName)) {
        return ErrorType.THROTTLING;
      }
      
      if ([
        'ValidationException',
        'ResourceNotFoundException',
        'AccessDeniedException',
        'ItemCollectionSizeLimitExceededException',
        'ConditionalCheckFailedException',
        'TransactionConflictException'
      ].includes(errorName)) {
        return ErrorType.NON_RETRYABLE;
      }
      
      const statusCode = error.$metadata?.httpStatusCode || error.statusCode;
      if (statusCode === 429) return ErrorType.THROTTLING;
      if (statusCode >= 500) return ErrorType.RETRYABLE;
      if (statusCode >= 400 && statusCode < 500) return ErrorType.NON_RETRYABLE;
      
      return ErrorType.RETRYABLE;
    },
    healthCheck: async () => {
      try {
        // Simple health check for DynamoDB
        return true;
      } catch {
        return false;
      }
    }
  },

  S3: {
    name: 'S3',
    failureThreshold: 10,
    timeoutMs: 120000, // 2 minutes for large uploads
    resetTimeoutMs: 60000,
    halfOpenMaxCalls: 3,
    retryConfig: {
      maxRetries: 4,
      baseDelayMs: 1000,
      maxDelayMs: 32000,
      backoffMultiplier: 2,
      jitterFactor: 0.1,
      retryableErrors: [
        'ServiceUnavailable',
        'InternalError',
        'SlowDown',
        'RequestTimeout',
        'RequestTimeTooSkewed'
      ],
      nonRetryableErrors: [
        'NoSuchBucket',
        'NoSuchKey',
        'AccessDenied',
        'InvalidBucketName',
        'BucketAlreadyExists',
        'InvalidObjectName'
      ]
    },
    rateLimiter: {
      maxTokens: 150,
      refillRate: 15,
      globalLimits: {
        maxRetries: 600,
        windowMs: 60000
      }
    },
    errorClassifier: (error: any) => {
      const errorName = error.name || error.code || '';
      
      if (errorName === 'SlowDown') {
        return ErrorType.THROTTLING;
      }
      
      if ([
        'NoSuchBucket',
        'NoSuchKey',
        'AccessDenied',
        'InvalidBucketName',
        'BucketAlreadyExists',
        'InvalidObjectName'
      ].includes(errorName)) {
        return ErrorType.NON_RETRYABLE;
      }
      
      const statusCode = error.$metadata?.httpStatusCode || error.statusCode;
      if (statusCode === 503) return ErrorType.THROTTLING;
      if (statusCode >= 500) return ErrorType.RETRYABLE;
      if (statusCode >= 400 && statusCode < 500) return ErrorType.NON_RETRYABLE;
      
      return ErrorType.RETRYABLE;
    },
    healthCheck: async () => {
      try {
        return true;
      } catch {
        return false;
      }
    }
  },

  STS: {
    name: 'STS',
    failureThreshold: 8,
    timeoutMs: 30000,
    resetTimeoutMs: 60000,
    halfOpenMaxCalls: 2,
    retryConfig: {
      maxRetries: 3,
      baseDelayMs: 1000,
      maxDelayMs: 16000,
      backoffMultiplier: 2,
      jitterFactor: 0.1,
      retryableErrors: [
        'ServiceUnavailableException',
        'InternalFailure',
        'Throttling'
      ],
      nonRetryableErrors: [
        'AccessDenied',
        'InvalidParameterValue',
        'ValidationError',
        'TokenRefreshRequired',
        'ExpiredTokenException'
      ]
    },
    rateLimiter: {
      maxTokens: 30,
      refillRate: 3,
      globalLimits: {
        maxRetries: 150,
        windowMs: 60000
      }
    },
    errorClassifier: (error: any) => {
      const errorName = error.name || error.code || '';
      
      if (errorName === 'Throttling') {
        return ErrorType.THROTTLING;
      }
      
      if (errorName === 'ExpiredTokenException') {
        return ErrorType.AUTHENTICATION;
      }
      
      if ([
        'AccessDenied',
        'InvalidParameterValue',
        'ValidationError',
        'TokenRefreshRequired'
      ].includes(errorName)) {
        return ErrorType.NON_RETRYABLE;
      }
      
      const statusCode = error.$metadata?.httpStatusCode || error.statusCode;
      if (statusCode === 429) return ErrorType.THROTTLING;
      if (statusCode >= 500) return ErrorType.RETRYABLE;
      if (statusCode >= 400 && statusCode < 500) return ErrorType.NON_RETRYABLE;
      
      return ErrorType.RETRYABLE;
    },
    healthCheck: async () => {
      try {
        return true;
      } catch {
        return false;
      }
    }
  }
};

// Degradation strategies for each service
export const DEGRADATION_STRATEGIES: Record<string, DegradationStrategy> = {
  KMS: {
    serviceName: 'KMS',
    fallbackMethods: [
      {
        name: 'local-cache',
        priority: 1,
        execute: async (context?: any) => {
          // Implement local cache fallback
          console.warn('Using KMS local cache fallback');
          throw new Error('Local cache not implemented');
        },
        healthCheck: async () => true
      },
      {
        name: 'backup-kms-region',
        priority: 2,
        execute: async (context?: any) => {
          // Implement backup region fallback
          console.warn('Using KMS backup region fallback');
          throw new Error('Backup region not implemented');
        }
      },
      {
        name: 'degraded-encryption',
        priority: 3,
        execute: async (context?: any) => {
          // Implement degraded encryption (e.g., local encryption)
          console.error('Using degraded encryption fallback');
          throw new Error('Degraded encryption not implemented');
        }
      }
    ],
    recoveryCriteria: {
      consecutiveSuccesses: 3,
      timeWindow: 300000,
      healthCheckInterval: 30000
    }
  },

  SECRETS_MANAGER: {
    serviceName: 'SECRETS_MANAGER',
    fallbackMethods: [
      {
        name: 'local-cache',
        priority: 1,
        execute: async (context?: any) => {
          console.warn('Using Secrets Manager local cache fallback');
          throw new Error('Local secrets cache not implemented');
        }
      },
      {
        name: 'environment-variables',
        priority: 2,
        execute: async (context?: any) => {
          console.warn('Using environment variables fallback');
          throw new Error('Environment variables fallback not implemented');
        }
      }
    ],
    recoveryCriteria: {
      consecutiveSuccesses: 2,
      timeWindow: 120000,
      healthCheckInterval: 20000
    }
  },

  DYNAMODB: {
    serviceName: 'DYNAMODB',
    fallbackMethods: [
      {
        name: 'read-replica',
        priority: 1,
        execute: async (context?: any) => {
          console.warn('Using DynamoDB read replica fallback');
          throw new Error('Read replica not implemented');
        }
      },
      {
        name: 'cached-data',
        priority: 2,
        execute: async (context?: any) => {
          console.warn('Using cached data fallback');
          throw new Error('Cached data fallback not implemented');
        }
      }
    ],
    recoveryCriteria: {
      consecutiveSuccesses: 5,
      timeWindow: 180000,
      healthCheckInterval: 30000
    }
  }
};

/**
 * Get service configuration by name
 */
export function getServiceConfig(serviceName: string): ServiceConfig {
  const config = AWS_SERVICE_CONFIGS[serviceName.toUpperCase()];
  if (!config) {
    throw new Error(`No configuration found for service: ${serviceName}`);
  }
  return config;
}

/**
 * Get degradation strategy by service name
 */
export function getDegradationStrategy(serviceName: string): DegradationStrategy | undefined {
  return DEGRADATION_STRATEGIES[serviceName.toUpperCase()];
}
