import * as React from 'react';
/**
 * Centralized Error Handler
 *
 * Provides consistent error processing, logging, and response formatting
 * across the entire application.
 */

import { PostgrestError } from '@supabase/supabase-js';
import {
  AppError,
  ErrorCode,
  ValidationError,
  ExternalApiError as AppExternalApiError,
  DatabaseError,
  BusinessLogicError,
  AMADEUS_ERROR_MAPPINGS,
  DUFFEL_ERROR_MAPPINGS,
  type ErrorContext,
} from './types';

/**
 * Standard error response format
 */
export interface ErrorResponse {
  error: true;
  code: ErrorCode;
  message: string;
  userMessage?: string;
  context?: ErrorContext;
  retryable?: boolean;
  timestamp: string;
  requestId?: string;
}

/**
 * Logger interface for dependency injection
 */
export interface Logger {
  error(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  info(message: string, meta?: unknown): void;
  debug(message: string, meta?: unknown): void;
}

/**
 * External API error structures
 */
export interface AmadeusError {
  errors?: Array<{
    code?: string;
    detail?: string;
    message?: string;
  }>;
  error?: {
    code?: string;
    message?: string;
  };
  code?: string;
  message?: string;
}

export interface DuffelError {
  errors?: Array<{
    type?: string;
    message?: string;
  }>;
  error?: {
    type?: string;
    message?: string;
  };
  type?: string;
  message?: string;
}

export interface StripeError {
  code?: string;
  type?: string;
  message?: string;
  user_message?: string;
}

export type ExternalApiError = AmadeusError | DuffelError | StripeError;

/**
 * Unknown error structure for general error handling
 */
interface UnknownError {
  code?: string;
  message?: string;
  details?: unknown;
  [key: string]: unknown;
}

/**
 * Default console logger implementation
 */
class ConsoleLogger implements Logger {
  error(message: string, meta?: unknown): void {
    console.error(
      `[ERROR] ${message}`,
      meta ? JSON.stringify(meta, null, 2) : ''
    );
  }

  warn(message: string, meta?: unknown): void {
    console.warn(
      `[WARN] ${message}`,
      meta ? JSON.stringify(meta, null, 2) : ''
    );
  }

  info(message: string, meta?: unknown): void {
    console.info(
      `[INFO] ${message}`,
      meta ? JSON.stringify(meta, null, 2) : ''
    );
  }

  debug(message: string, meta?: unknown): void {
    console.debug(
      `[DEBUG] ${message}`,
      meta ? JSON.stringify(meta, null, 2) : ''
    );
  }
}

/**
 * Error handler configuration
 */
export interface ErrorHandlerConfig {
  logger?: Logger;
  includeStackTrace?: boolean;
  sanitizeErrors?: boolean;
  requestIdGenerator?: () => string;
}

/**
 * Centralized error handler class
 */
export class ErrorHandler {
  private logger: Logger;
  private includeStackTrace: boolean;
  private sanitizeErrors: boolean;
  private requestIdGenerator: () => string;

  constructor(config: ErrorHandlerConfig = {}) {
    this.logger = config.logger || new ConsoleLogger();
    this.includeStackTrace = config.includeStackTrace ?? false;
    this.sanitizeErrors = config.sanitizeErrors ?? true;
    this.requestIdGenerator =
      config.requestIdGenerator ||
      (() => Math.random().toString(36).substring(2, 15));
  }

  /**
   * Process and normalize any error into an AppError
   */
  public normalizeError(error: unknown, context?: ErrorContext): AppError {
    const requestId = this.requestIdGenerator();

    // Already an AppError - just add request ID
    if (error instanceof AppError) {
      return error;
    }

    // Supabase PostgrestError
    if (this.isPostgrestError(error)) {
      return new DatabaseError(error.message, {
        ...context,
        postgrestCode: error.code,
        requestId,
      });
    }

    // Standard JavaScript Error
    if (error instanceof Error) {
      // Try to identify error type from message patterns
      if (this.isValidationError(error)) {
        return new ValidationError(error.message, context);
      }

      if (this.isNetworkError(error)) {
        return new AppExternalApiError('Network', error.message, context, true);
      }

      // Generic error
      return new BusinessLogicError(
        ErrorCode.INTERNAL_ERROR,
        error.message,
        'An unexpected error occurred. Please try again.',
        { ...context, originalError: error.name, requestId }
      );
    }

    // String error
    if (typeof error === 'string') {
      return new BusinessLogicError(
        ErrorCode.INTERNAL_ERROR,
        error,
        'An unexpected error occurred. Please try again.',
        { ...context, requestId }
      );
    }

    // Unknown error type
    return new BusinessLogicError(
      ErrorCode.UNKNOWN_ERROR,
      'Unknown error occurred',
      'An unexpected error occurred. Please try again.',
      {
        ...context,
        originalError: JSON.stringify(error, null, 2),
        requestId,
      }
    );
  }

  /**
   * Map external API errors to AppErrors using known error mappings
   */
  public mapExternalApiError(
    provider: 'amadeus' | 'duffel' | 'stripe',
    error: ExternalApiError,
    context?: ErrorContext
  ): AppError {
    const mappings =
      provider === 'amadeus'
        ? AMADEUS_ERROR_MAPPINGS
        : provider === 'duffel'
          ? DUFFEL_ERROR_MAPPINGS
          : {};

    // Extract error code/message from different API response formats
    const errorCode = this.extractErrorCode(error, provider);
    const errorMessage = this.extractErrorMessage(error, provider);

    // Look up known error mapping
    const mapping = errorCode ? mappings[errorCode] : null;

    if (mapping) {
      return new BusinessLogicError(
        mapping.code,
        errorMessage,
        mapping.userMessage,
        {
          ...context,
          provider,
          externalErrorCode: errorCode,
          externalErrorMessage: errorMessage,
        },
        mapping.retryable
      );
    }

    // Fallback to generic external API error
    return new AppExternalApiError(provider, errorMessage, {
      ...context,
      externalErrorCode: errorCode,
      externalErrorMessage: errorMessage,
    });
  }

  /**
   * Handle and log error, return formatted response
   */
  public handle(error: unknown, context?: ErrorContext): ErrorResponse {
    const appError = this.normalizeError(error, context);

    // Log the error with appropriate level
    this.logError(appError);

    // Return sanitized response
    return this.formatErrorResponse(appError);
  }

  /**
   * Handle error and throw formatted AppError
   */
  public handleAndThrow(error: unknown, context?: ErrorContext): never {
    const appError = this.normalizeError(error, context);
    this.logError(appError);
    throw appError;
  }

  /**
   * Log error with appropriate level and context
   */
  private logError(error: AppError): void {
    const logContext = {
      code: error.code,
      message: error.message,
      context: error.context,
      retryable: error.retryable,
      timestamp: error.timestamp,
      requestId: error.requestId,
      ...(this.includeStackTrace && { stack: error.stack }),
    };

    // Use appropriate log level based on error type
    if (error.retryable) {
      this.logger.warn(`Retryable error: ${error.message}`, logContext);
    } else if (
      error.code.includes('VALIDATION') ||
      error.code.includes('UNAUTHORIZED')
    ) {
      this.logger.info(`Client error: ${error.message}`, logContext);
    } else {
      this.logger.error(`Application error: ${error.message}`, logContext);
    }
  }

  /**
   * Format error for response
   */
  private formatErrorResponse(error: AppError): ErrorResponse {
    const response: ErrorResponse = {
      error: true,
      code: error.code,
      message: this.sanitizeErrors
        ? error.userMessage || error.message
        : error.message,
      timestamp: error.timestamp.toISOString(),
      retryable: error.retryable,
    };

    // Add optional fields
    if (error.userMessage) {
      response.userMessage = error.userMessage;
    }

    if (error.requestId) {
      response.requestId = error.requestId;
    }

    // Only include context in development or for debugging
    if (!this.sanitizeErrors && error.context) {
      response.context = error.context;
    }

    return response;
  }

  /**
   * Type guards and utility methods
   */
  private isPostgrestError(error: unknown): error is PostgrestError {
    return !!(
      error &&
      typeof error === 'object' &&
      'code' in error &&
      typeof (error as UnknownError).code === 'string' &&
      'message' in error &&
      'details' in error
    );
  }

  private isValidationError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return (
      message.includes('validation') ||
      message.includes('required') ||
      message.includes('invalid') ||
      message.includes('missing')
    );
  }

  private isNetworkError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('fetch') ||
      message.includes('connection')
    );
  }

  private extractErrorCode(
    error: ExternalApiError,
    provider: string
  ): string | null {
    if (provider === 'amadeus') {
      const amadeusError = error as AmadeusError;
      return (
        amadeusError?.errors?.[0]?.code ||
        amadeusError?.error?.code ||
        amadeusError?.code ||
        null
      );
    }

    if (provider === 'duffel') {
      const duffelError = error as DuffelError;
      return (
        duffelError?.errors?.[0]?.type ||
        duffelError?.error?.type ||
        duffelError?.type ||
        null
      );
    }

    if (provider === 'stripe') {
      const stripeError = error as StripeError;
      return stripeError?.code || stripeError?.type || null;
    }

    return null;
  }

  private extractErrorMessage(
    error: ExternalApiError,
    provider: string
  ): string {
    const defaultMessage = `${provider} API error occurred`;

    if (provider === 'amadeus') {
      const amadeusError = error as AmadeusError;
      return (
        amadeusError?.errors?.[0]?.detail ||
        amadeusError?.error?.message ||
        amadeusError?.message ||
        defaultMessage
      );
    }

    if (provider === 'duffel') {
      const duffelError = error as DuffelError;
      return (
        duffelError?.errors?.[0]?.message ||
        duffelError?.error?.message ||
        duffelError?.message ||
        defaultMessage
      );
    }

    if (provider === 'stripe') {
      const stripeError = error as StripeError;
      return (
        stripeError?.message || stripeError?.user_message || defaultMessage
      );
    }

    return 'message' in error && typeof error.message === 'string'
      ? error.message
      : defaultMessage;
  }
}

/**
 * Default error handler instance
 */
export const errorHandler = new ErrorHandler({
  logger: new ConsoleLogger(),
  includeStackTrace: process.env.NODE_ENV === 'development',
  sanitizeErrors: process.env.NODE_ENV === 'production',
});

/**
 * Convenience functions for common error handling patterns
 */
export function handleError(
  error: unknown,
  context?: ErrorContext
): ErrorResponse {
  return errorHandler.handle(error, context);
}

export function handleAndThrowError(
  error: unknown,
  context?: ErrorContext
): never {
  return errorHandler.handleAndThrow(error, context);
}

export function mapAmadeusError(
  error: AmadeusError,
  context?: ErrorContext
): AppError {
  return errorHandler.mapExternalApiError('amadeus', error, context);
}

export function mapDuffelError(
  error: DuffelError,
  context?: ErrorContext
): AppError {
  return errorHandler.mapExternalApiError('duffel', error, context);
}

export function mapStripeError(
  error: StripeError,
  context?: ErrorContext
): AppError {
  return errorHandler.mapExternalApiError('stripe', error, context);
}
