/**
 * Centralized Error Type System
 * 
 * Provides consistent error handling across the application with
 * standardized error codes, messages, and context.
 */

export enum ErrorCode {
  // Validation Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // External API Errors
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  AMADEUS_API_ERROR = 'AMADEUS_API_ERROR',
  DUFFEL_API_ERROR = 'DUFFEL_API_ERROR',
  STRIPE_API_ERROR = 'STRIPE_API_ERROR',
  
  // Database Errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_RECORD = 'DUPLICATE_RECORD',
  
  // Business Logic Errors
  OFFER_EXPIRED = 'OFFER_EXPIRED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  BOOKING_FAILED = 'BOOKING_FAILED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Rate Limiting & Circuit Breaker
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  CIRCUIT_BREAKER_OPEN = 'CIRCUIT_BREAKER_OPEN',
  
  // Generic Errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ErrorContext {
  [key: string]: unknown;
}

export interface ErrorDetails {
  code: ErrorCode;
  message: string;
  userMessage?: string; // User-friendly message
  context?: ErrorContext;
  retryable?: boolean;
  timestamp?: Date;
  requestId?: string;
}

/**
 * Base application error class
 */
export abstract class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly userMessage?: string;
  public readonly context?: ErrorContext;
  public readonly retryable: boolean;
  public readonly timestamp: Date;
  public readonly requestId?: string;

  constructor(details: ErrorDetails) {
    super(details.message);
    this.name = this.constructor.name;
    this.code = details.code;
    this.userMessage = details.userMessage;
    this.context = details.context;
    this.retryable = details.retryable || false;
    this.timestamp = details.timestamp || new Date();
    this.requestId = details.requestId;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      context: this.context,
      retryable: this.retryable,
      timestamp: this.timestamp,
      requestId: this.requestId,
      stack: this.stack
    };
  }
}

/**
 * Validation-related errors
 */
export class ValidationError extends AppError {
  constructor(message: string, context?: ErrorContext, userMessage?: string) {
    super({
      code: ErrorCode.VALIDATION_ERROR,
      message,
      userMessage: userMessage || 'Please check your input and try again.',
      context,
      retryable: false
    });
  }
}

/**
 * External API integration errors
 */
export class ExternalApiError extends AppError {
  constructor(
    provider: string,
    message: string,
    context?: ErrorContext,
    retryable: boolean = true
  ) {
    const code = provider.toUpperCase().includes('AMADEUS') 
      ? ErrorCode.AMADEUS_API_ERROR
      : provider.toUpperCase().includes('DUFFEL')
      ? ErrorCode.DUFFEL_API_ERROR
      : provider.toUpperCase().includes('STRIPE')
      ? ErrorCode.STRIPE_API_ERROR
      : ErrorCode.EXTERNAL_API_ERROR;

    super({
      code,
      message: `${provider} API Error: ${message}`,
      userMessage: retryable 
        ? 'Our flight provider is temporarily unavailable. Please try again in a moment.'
        : 'Unable to process your request. Please contact support if this continues.',
      context: { ...context, provider },
      retryable
    });
  }
}

/**
 * Database operation errors
 */
export class DatabaseError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super({
      code: ErrorCode.DATABASE_ERROR,
      message: `Database Error: ${message}`,
      userMessage: 'We\'re experiencing technical difficulties. Please try again.',
      context,
      retryable: true
    });
  }
}

/**
 * Business logic errors
 */
export class BusinessLogicError extends AppError {
  constructor(
    code: ErrorCode,
    message: string,
    userMessage: string,
    context?: ErrorContext,
    retryable: boolean = false
  ) {
    super({
      code,
      message,
      userMessage,
      context,
      retryable
    });
  }
}

/**
 * Rate limiting and circuit breaker errors
 */
export class RateLimitError extends AppError {
  constructor(service: string, retryAfter?: number) {
    super({
      code: ErrorCode.RATE_LIMIT_EXCEEDED,
      message: `Rate limit exceeded for ${service}`,
      userMessage: 'Too many requests. Please wait a moment and try again.',
      context: { service, retryAfter },
      retryable: true
    });
  }
}

export class CircuitBreakerError extends AppError {
  constructor(service: string) {
    super({
      code: ErrorCode.CIRCUIT_BREAKER_OPEN,
      message: `Circuit breaker open for ${service}`,
      userMessage: 'Service temporarily unavailable. Please try again later.',
      context: { service },
      retryable: true
    });
  }
}

/**
 * Known external API error mappings
 */
export const AMADEUS_ERROR_MAPPINGS: Record<string, { code: ErrorCode; userMessage: string; retryable: boolean }> = {
  '38196': {
    code: ErrorCode.OFFER_EXPIRED,
    userMessage: 'This price is no longer available. Please search again for current prices.',
    retryable: false
  },
  '4926': {
    code: ErrorCode.VALIDATION_ERROR,
    userMessage: 'Invalid travel dates. Please check your dates and try again.',
    retryable: false
  },
  '32171': {
    code: ErrorCode.RATE_LIMIT_EXCEEDED,
    userMessage: 'Too many requests. Please wait a moment and try again.',
    retryable: true
  },
  '38189': {
    code: ErrorCode.BOOKING_FAILED,
    userMessage: 'Unable to complete booking. Please try again or contact support.',
    retryable: true
  }
};

export const DUFFEL_ERROR_MAPPINGS: Record<string, { code: ErrorCode; userMessage: string; retryable: boolean }> = {
  'offer_no_longer_available': {
    code: ErrorCode.OFFER_EXPIRED,
    userMessage: 'This flight is no longer available. Please search again.',
    retryable: false
  },
  'payment_failed': {
    code: ErrorCode.PAYMENT_FAILED,
    userMessage: 'Payment could not be processed. Please check your payment method.',
    retryable: false
  },
  'rate_limit_exceeded': {
    code: ErrorCode.RATE_LIMIT_EXCEEDED,
    userMessage: 'Too many requests. Please wait a moment and try again.',
    retryable: true
  }
};
