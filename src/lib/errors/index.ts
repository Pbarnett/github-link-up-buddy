/**
 * Error Handling System Exports
 * 
 * Centralized exports for all error handling functionality
 */

// Error types and classes
export * from './types';

// Error handler and utilities
export * from './handler';

// Re-export commonly used items for convenience
export {
  ErrorCode,
  AppError,
  ValidationError,
  ExternalApiError,
  DatabaseError,
  BusinessLogicError,
  RateLimitError,
  CircuitBreakerError
} from './types';

export {
  errorHandler,
  handleError,
  handleAndThrowError,
  mapAmadeusError,
  mapDuffelError,
  mapStripeError,
  type ErrorResponse,
  type Logger
} from './handler';
