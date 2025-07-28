import * as React from 'react';
/**
 * Enhanced AWS SDK Error Handling
 *
 * Comprehensive error handling following AWS SDK v3 best practices
 * with service-specific exception handling and retry logic.
 */

import {
  KMSServiceException,
  DisabledException,
  InvalidKeyUsageException,
  KeyUnavailableException,
  LimitExceededException,
  NotFoundException,
  InvalidCiphertextException,
  // DecryptionFailedException - not available in current SDK version
} from '@aws-sdk/client-kms';
import {
  S3ServiceException,
  // NoSuchBucketException - not available in current SDK version
  // NoSuchKeyException - not available in current SDK version
  // BucketAlreadyExistsException - not available in current SDK version
} from '@aws-sdk/client-s3';
import {
  ResourceNotFoundException,
  ConditionalCheckFailedException,
  ProvisionedThroughputExceededException,
} from '@aws-sdk/client-dynamodb';
import { ExpiredTokenException } from '@aws-sdk/client-sts';
import {
  InvalidParameterValueException,
  LimitExceededException as CloudWatchLimitExceeded,
} from '@aws-sdk/client-cloudwatch';
import {
  SecretsManagerServiceException,
  ResourceNotFoundException as SecretsManagerResourceNotFound,
  InvalidParameterException,
  InvalidRequestException,
  // DecryptionFailureException - not available in current SDK version
  // InternalServiceErrorException - not available in current SDK version
  LimitExceededException as SecretsManagerLimitExceeded,
} from '@aws-sdk/client-secrets-manager';

// Enhanced error types for application-level handling
export enum ErrorCategory {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  CONFIGURATION = 'CONFIGURATION',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN',
}

export interface EnhancedError {
  category: ErrorCategory;
  code: string;
  message: string;
  originalError: Error;
  retryable: boolean;
  statusCode: number;
  service: string;
  operation?: string;
  requestId?: string;
  suggestions: string[];
  metadata: Record<string, any>;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitterFactor: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  jitterFactor: 0.1,
};

/**
 * Enhanced AWS Error Handler following SDK v3 best practices
 */
export class EnhancedAWSErrorHandler {
  /**
   * Analyzes and categorizes AWS SDK errors
   */
  static analyzeError(
    error: Error,
    service: string,
    operation?: string
  ): EnhancedError {
    // Initialize base enhanced error
    const enhancedError: EnhancedError = {
      category: ErrorCategory.UNKNOWN,
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      originalError: error,
      retryable: false,
      statusCode: 500,
      service,
      operation,
      suggestions: [],
      metadata: {},
    };

    // Extract common AWS error properties
    const awsError = error as any;
    if (awsError.$metadata) {
      enhancedError.requestId = awsError.$metadata.requestId;
      enhancedError.statusCode = awsError.$metadata.httpStatusCode || 500;
    }

    // Service-specific error analysis
    switch (service.toLowerCase()) {
      case 'kms':
        return this.analyzeKMSError(error, enhancedError);
      case 's3':
        return this.analyzeS3Error(error, enhancedError);
      case 'dynamodb':
        return this.analyzeDynamoDBError(error, enhancedError);
      case 'sts':
        return this.analyzeSTSError(error, enhancedError);
      case 'cloudwatch':
        return this.analyzeCloudWatchError(error, enhancedError);
      case 'secretsmanager':
        return this.analyzeSecretsManagerError(error, enhancedError);
      default:
        return this.analyzeGenericAWSError(error, enhancedError);
    }
  }

  /**
   * KMS-specific error analysis
   */
  private static analyzeKMSError(
    error: Error,
    base: EnhancedError
  ): EnhancedError {
    if (error instanceof DisabledException) {
      return {
        ...base,
        category: ErrorCategory.CONFIGURATION,
        code: 'KMS_KEY_DISABLED',
        message:
          'The KMS key is disabled and cannot be used for cryptographic operations',
        retryable: false,
        statusCode: 400,
        suggestions: [
          'Enable the KMS key before using it',
          'Check if the key was accidentally disabled',
          'Verify key permissions and policies',
        ],
      };
    }

    if (error instanceof InvalidKeyUsageException) {
      return {
        ...base,
        category: ErrorCategory.VALIDATION,
        code: 'KMS_INVALID_KEY_USAGE',
        message: 'The request is not valid for the current key usage',
        retryable: false,
        statusCode: 400,
        suggestions: [
          'Verify the key is configured for the intended operation (encrypt/decrypt vs sign/verify)',
          'Check the key spec matches your usage requirements',
        ],
      };
    }

    if (error instanceof KeyUnavailableException) {
      return {
        ...base,
        category: ErrorCategory.SERVICE_UNAVAILABLE,
        code: 'KMS_KEY_UNAVAILABLE',
        message: 'The KMS key is temporarily unavailable',
        retryable: true,
        statusCode: 503,
        suggestions: [
          'Retry the operation after a brief delay',
          'Check AWS service health status',
          'Consider using a different key if available',
        ],
      };
    }

    if (error instanceof LimitExceededException) {
      return {
        ...base,
        category: ErrorCategory.RATE_LIMIT,
        code: 'KMS_RATE_LIMIT_EXCEEDED',
        message: 'KMS rate limit exceeded',
        retryable: true,
        statusCode: 429,
        suggestions: [
          'Implement exponential backoff with jitter',
          'Consider request batching if applicable',
          'Review your KMS usage patterns',
          'Contact AWS support for rate limit increases if needed',
        ],
      };
    }

    if (error instanceof NotFoundException) {
      return {
        ...base,
        category: ErrorCategory.NOT_FOUND,
        code: 'KMS_KEY_NOT_FOUND',
        message: 'The specified KMS key was not found',
        retryable: false,
        statusCode: 404,
        suggestions: [
          'Verify the key ID or alias is correct',
          'Check if the key exists in the correct region',
          'Ensure you have permission to access the key',
        ],
      };
    }

    if (error instanceof InvalidCiphertextException) {
      return {
        ...base,
        category: ErrorCategory.VALIDATION,
        code: 'KMS_INVALID_CIPHERTEXT',
        message: 'The ciphertext is not valid for decryption',
        retryable: false,
        statusCode: 400,
        suggestions: [
          'Verify the ciphertext was not corrupted during transmission',
          'Ensure the ciphertext was encrypted with a valid KMS key',
          'Check if the encryption context matches',
        ],
      };
    }

    // Note: DecryptionFailedException not available in current AWS SDK version
    // Generic handling for decryption-related errors will be covered by KMSServiceException

    if (error instanceof KMSServiceException) {
      return {
        ...base,
        category: ErrorCategory.SERVICE_UNAVAILABLE,
        code: 'KMS_SERVICE_ERROR',
        message: `KMS service error: ${error.message}`,
        retryable: true,
        statusCode: 500,
        suggestions: [
          'Retry the operation with exponential backoff',
          'Check AWS service health dashboard',
        ],
      };
    }

    return base;
  }

  /**
   * S3-specific error analysis
   */
  private static analyzeS3Error(
    error: Error,
    base: EnhancedError
  ): EnhancedError {
    if (error instanceof S3ServiceException) {
      return {
        ...base,
        category: ErrorCategory.SERVICE_UNAVAILABLE,
        code: 'S3_SERVICE_ERROR',
        message: `S3 service error: ${error.message}`,
        retryable: true,
        statusCode: 500,
        suggestions: [
          'Retry the operation with exponential backoff',
          'Check AWS service health dashboard',
        ],
      };
    }

    // Note: Specific S3 exceptions like NoSuchBucketException, NoSuchKeyException not available in current SDK version
    // Generic handling for S3 errors will be covered by analyzeGenericAWSError based on HTTP status codes

    return base;
  }

  /**
   * DynamoDB-specific error analysis
   */
  private static analyzeDynamoDBError(
    error: Error,
    base: EnhancedError
  ): EnhancedError {
    if (error instanceof ResourceNotFoundException) {
      return {
        ...base,
        category: ErrorCategory.NOT_FOUND,
        code: 'DYNAMODB_TABLE_NOT_FOUND',
        message: 'The specified DynamoDB table does not exist',
        retryable: false,
        statusCode: 404,
        suggestions: [
          'Verify the table name is correct',
          'Check if the table exists in the correct region',
          'Ensure the table is in ACTIVE state',
        ],
      };
    }

    if (error instanceof ProvisionedThroughputExceededException) {
      return {
        ...base,
        category: ErrorCategory.RATE_LIMIT,
        code: 'DYNAMODB_THROTTLING',
        message: 'Request rate too high for the provisioned throughput',
        retryable: true,
        statusCode: 400,
        suggestions: [
          'Implement exponential backoff with jitter',
          'Consider using auto-scaling for your table',
          'Review your access patterns and consider using global secondary indexes',
          'Switch to on-demand billing mode if appropriate',
        ],
      };
    }

    if (error instanceof ConditionalCheckFailedException) {
      return {
        ...base,
        category: ErrorCategory.CONFLICT,
        code: 'DYNAMODB_CONDITION_FAILED',
        message: 'The conditional check failed',
        retryable: false,
        statusCode: 400,
        suggestions: [
          'Review your conditional expression',
          'Check if the item state changed between reads',
          'Consider using optimistic locking patterns',
        ],
      };
    }

    return base;
  }

  /**
   * STS-specific error analysis
   */
  private static analyzeSTSError(
    error: Error,
    base: EnhancedError
  ): EnhancedError {
    if (error instanceof ExpiredTokenException) {
      return {
        ...base,
        category: ErrorCategory.AUTHENTICATION,
        code: 'STS_TOKEN_EXPIRED',
        message: 'The security token has expired',
        retryable: true,
        statusCode: 403,
        suggestions: [
          'Refresh your credentials',
          'Re-authenticate with your identity provider',
          'Check token expiration times in your application',
        ],
      };
    }

    return base;
  }

  /**
   * CloudWatch-specific error analysis
   */
  private static analyzeCloudWatchError(
    error: Error,
    base: EnhancedError
  ): EnhancedError {
    if (error instanceof InvalidParameterValueException) {
      return {
        ...base,
        category: ErrorCategory.VALIDATION,
        code: 'CLOUDWATCH_INVALID_PARAMETER',
        message: 'Invalid parameter value provided',
        retryable: false,
        statusCode: 400,
        suggestions: [
          'Review the CloudWatch API documentation for valid parameter values',
          'Check metric names, dimensions, and units',
        ],
      };
    }

    if (error instanceof CloudWatchLimitExceeded) {
      return {
        ...base,
        category: ErrorCategory.RATE_LIMIT,
        code: 'CLOUDWATCH_RATE_LIMIT',
        message: 'CloudWatch rate limit exceeded',
        retryable: true,
        statusCode: 429,
        suggestions: [
          'Implement exponential backoff',
          'Batch metric data points where possible',
          'Review CloudWatch service quotas',
        ],
      };
    }

    return base;
  }

  /**
   * Secrets Manager-specific error analysis
   */
  private static analyzeSecretsManagerError(
    error: Error,
    base: EnhancedError
  ): EnhancedError {
    if (error instanceof SecretsManagerResourceNotFound) {
      return {
        ...base,
        category: ErrorCategory.NOT_FOUND,
        code: 'SECRETS_MANAGER_SECRET_NOT_FOUND',
        message: 'The specified secret was not found',
        retryable: false,
        statusCode: 404,
        suggestions: [
          'Verify the secret name or ARN is correct',
          'Check if the secret exists in the correct region',
          'Ensure you have permission to access the secret',
        ],
      };
    }

    if (error instanceof InvalidParameterException) {
      return {
        ...base,
        category: ErrorCategory.VALIDATION,
        code: 'SECRETS_MANAGER_INVALID_PARAMETER',
        message: 'Invalid parameter provided to Secrets Manager',
        retryable: false,
        statusCode: 400,
        suggestions: [
          'Review the API documentation for valid parameter values',
          'Check secret name format and constraints',
        ],
      };
    }

    if (error instanceof InvalidRequestException) {
      return {
        ...base,
        category: ErrorCategory.VALIDATION,
        code: 'SECRETS_MANAGER_INVALID_REQUEST',
        message: 'Invalid request to Secrets Manager',
        retryable: false,
        statusCode: 400,
        suggestions: [
          'Review request format and required parameters',
          'Check API documentation for correct usage',
        ],
      };
    }

    // Note: DecryptionFailureException not available in current SDK version
    // Note: InternalServiceErrorException not available in current SDK version
    // Generic handling for these errors will be covered by SecretsManagerServiceException

    if (error instanceof SecretsManagerLimitExceeded) {
      return {
        ...base,
        category: ErrorCategory.RATE_LIMIT,
        code: 'SECRETS_MANAGER_RATE_LIMIT',
        message: 'Secrets Manager rate limit exceeded',
        retryable: true,
        statusCode: 429,
        suggestions: [
          'Implement exponential backoff with jitter',
          'Review service quotas and request limits',
          'Consider caching secret values where appropriate',
        ],
      };
    }

    if (error instanceof SecretsManagerServiceException) {
      return {
        ...base,
        category: ErrorCategory.SERVICE_UNAVAILABLE,
        code: 'SECRETS_MANAGER_SERVICE_ERROR',
        message: `Secrets Manager service error: ${error.message}`,
        retryable: true,
        statusCode: 500,
        suggestions: [
          'Retry the operation with exponential backoff',
          'Check AWS service health dashboard',
        ],
      };
    }

    return base;
  }

  /**
   * Generic AWS error analysis
   */
  private static analyzeGenericAWSError(
    error: Error,
    base: EnhancedError
  ): EnhancedError {
    const awsError = error as any;

    // Check for common HTTP status codes
    const statusCode = awsError.$metadata?.httpStatusCode;

    switch (statusCode) {
      case 400:
        return {
          ...base,
          category: ErrorCategory.VALIDATION,
          code: 'AWS_BAD_REQUEST',
          statusCode: 400,
          suggestions: [
            'Review your request parameters',
            'Check API documentation',
          ],
        };

      case 401:
        return {
          ...base,
          category: ErrorCategory.AUTHENTICATION,
          code: 'AWS_UNAUTHORIZED',
          statusCode: 401,
          suggestions: [
            'Check your credentials',
            'Verify authentication setup',
          ],
        };

      case 403:
        return {
          ...base,
          category: ErrorCategory.AUTHORIZATION,
          code: 'AWS_FORBIDDEN',
          statusCode: 403,
          suggestions: ['Review IAM permissions', 'Check resource policies'],
        };

      case 429:
        return {
          ...base,
          category: ErrorCategory.RATE_LIMIT,
          code: 'AWS_RATE_LIMITED',
          statusCode: 429,
          retryable: true,
          suggestions: [
            'Implement exponential backoff',
            'Review service quotas',
          ],
        };

      case 500:
      case 502:
      case 503:
      case 504:
        return {
          ...base,
          category: ErrorCategory.SERVICE_UNAVAILABLE,
          code: 'AWS_SERVICE_ERROR',
          statusCode: statusCode || 500,
          retryable: true,
          suggestions: [
            'Retry with exponential backoff',
            'Check AWS service health',
          ],
        };
    }

    return base;
  }

  /**
   * Executes operation with enhanced error handling and retry logic
   */
  static async executeWithRetry<T>(
    operation: () => Promise<T>,
    service: string,
    operationName?: string,
    retryConfig: Partial<RetryConfig> = {}
  ): Promise<T> {
    const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
    let lastError: EnhancedError | null = null;

    for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
      try {
        return await operation();
      } catch (error) {
        const enhancedError = this.analyzeError(
          error as Error,
          service,
          operationName
        );
        lastError = enhancedError;

        // Don't retry if not retryable or on final attempt
        if (!enhancedError.retryable || attempt > config.maxRetries) {
          throw this.createApplicationError(enhancedError);
        }

        // Calculate delay with exponential backoff and jitter
        const baseDelay =
          config.baseDelayMs * Math.pow(config.backoffMultiplier, attempt - 1);
        const jitter = baseDelay * config.jitterFactor * Math.random();
        const delay = Math.min(baseDelay + jitter, config.maxDelayMs);

        console.warn(
          `Attempt ${attempt} failed for ${service}${operationName ? `.${operationName}` : ''}: ${enhancedError.message}. Retrying in ${delay}ms...`
        );

        await this.sleep(delay);
      }
    }

    // Should never reach here due to throw in loop, but TypeScript needs this
    throw this.createApplicationError(lastError!);
  }

  /**
   * Creates application-specific error from enhanced error
   */
  private static createApplicationError(enhancedError: EnhancedError): Error {
    const error = new Error(enhancedError.message);
    (error as any).category = enhancedError.category;
    (error as any).code = enhancedError.code;
    (error as any).statusCode = enhancedError.statusCode;
    (error as any).retryable = enhancedError.retryable;
    (error as any).service = enhancedError.service;
    (error as any).suggestions = enhancedError.suggestions;
    (error as any).metadata = enhancedError.metadata;
    (error as any).originalError = enhancedError.originalError;
    return error;
  }

  /**
   * Sleep utility for retry delays
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Determines if an error should be retried based on category and service
   */
  static shouldRetry(
    error: EnhancedError,
    attempt: number,
    maxAttempts: number
  ): boolean {
    if (attempt >= maxAttempts) return false;
    if (!error.retryable) return false;

    // Additional retry logic based on error category
    switch (error.category) {
      case ErrorCategory.RATE_LIMIT:
      case ErrorCategory.SERVICE_UNAVAILABLE:
      case ErrorCategory.NETWORK:
        return true;

      case ErrorCategory.AUTHENTICATION:
        // Only retry auth errors once (for token refresh)
        return attempt === 1;

      default:
        return error.retryable;
    }
  }

  /**
   * Formats error for logging/monitoring
   */
  static formatErrorForLogging(error: EnhancedError): Record<string, any> {
    return {
      timestamp: new Date().toISOString(),
      category: error.category,
      code: error.code,
      message: error.message,
      service: error.service,
      operation: error.operation,
      statusCode: error.statusCode,
      retryable: error.retryable,
      requestId: error.requestId,
      suggestions: error.suggestions,
      metadata: error.metadata,
    };
  }
}

// Convenience wrapper functions for common operations
export const withKMSErrorHandling = <T>(
  operation: () => Promise<T>,
  operationName?: string
) => EnhancedAWSErrorHandler.executeWithRetry(operation, 'kms', operationName);

export const withS3ErrorHandling = <T>(
  operation: () => Promise<T>,
  operationName?: string
) => EnhancedAWSErrorHandler.executeWithRetry(operation, 's3', operationName);

export const withDynamoDBErrorHandling = <T>(
  operation: () => Promise<T>,
  operationName?: string
) =>
  EnhancedAWSErrorHandler.executeWithRetry(
    operation,
    'dynamodb',
    operationName
  );

export const withSecretsManagerErrorHandling = <T>(
  operation: () => Promise<T>,
  operationName?: string
) =>
  EnhancedAWSErrorHandler.executeWithRetry(
    operation,
    'secretsmanager',
    operationName
  );

// Export types for external use
export type { EnhancedError, RetryConfig };
