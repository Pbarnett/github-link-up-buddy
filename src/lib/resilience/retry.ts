/**
 * Retry Utility with Exponential Backoff
 *
 * Provides configurable retry logic for handling transient failures
 * in external API calls and other operations.
 */

../config';
../errors/types';

/**
 * Retry configuration options
 */
export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxAttempts?: number;

  /** Initial delay between retries in milliseconds (default: 1000) */
  initialDelay?: number;

  /** Maximum delay between retries in milliseconds (default: 30000) */
  maxDelay?: number;

  /** Backoff multiplier for exponential backoff (default: 2) */
  backoffMultiplier?: number;

  /** Jitter factor to randomize delays (0-1, default: 0.1) */
  jitterFactor?: number;

  /** Function to determine if an error should trigger a retry */
  shouldRetry?: (error: unknown, attempt: number) => boolean;

  /** Function called before each retry attempt */
  onRetry?: (error: unknown, attempt: number, delay: number) => void;

  /** Function called when all retries are exhausted */
  onMaxRetriesExceeded?: (error: unknown, attempts: number) => void;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_OPTIONS: Required<
  Omit<RetryOptions, 'onRetry' | 'onMaxRetriesExceeded'>
> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  jitterFactor: 0.1,
  shouldRetry: (error: unknown, attempt: number) => {
    // Don't retry if we've exceeded max attempts
    if (attempt >= 3) return false;

    // Retry for network errors, timeouts, and rate limits
    if (error instanceof AppError) {
      return (
        error.retryable ||
        error.code === ErrorCode.NETWORK_ERROR ||
        error.code === ErrorCode.TIMEOUT_ERROR ||
        error.code === ErrorCode.RATE_LIMIT_EXCEEDED ||
        error.code === ErrorCode.SERVICE_UNAVAILABLE
      );
    }

    // Retry for generic network/fetch errors
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes('network') ||
        message.includes('timeout') ||
        message.includes('fetch') ||
        message.includes('connection') ||
        message.includes('ECONNRESET') ||
        message.includes('ETIMEDOUT')
      );
    }

    return false;
  },
};

/**
 * Sleep utility function
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  backoffMultiplier: number,
  jitterFactor: number
): number {
  // Exponential backoff: delay = initialDelay * (backoffMultiplier ^ attempt)
  const exponentialDelay = initialDelay * Math.pow(backoffMultiplier, attempt);

  // Cap at max delay
  const clampedDelay = Math.min(exponentialDelay, maxDelay);

  // Add jitter to prevent thundering herd
  const jitter = clampedDelay * jitterFactor * Math.random();

  return Math.floor(clampedDelay + jitter);
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = getApiConfig();
  const opts = {
    ...DEFAULT_RETRY_OPTIONS,
    maxAttempts: options.maxAttempts ?? config.retryAttempts,
    initialDelay: options.initialDelay ?? config.retryDelay,
    ...options,
  };

  let lastError: unknown;

  for (let attempt = 0; attempt < opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if we should retry
      if (!opts.shouldRetry(error, attempt)) {
        throw error;
      }

      // If this was the last attempt, don't wait
      if (attempt === opts.maxAttempts - 1) {
        break;
      }

      // Calculate delay for next attempt
      const delay = calculateDelay(
        attempt,
        opts.initialDelay,
        opts.maxDelay,
        opts.backoffMultiplier,
        opts.jitterFactor
      );

      // Call retry callback if provided
      opts.onRetry?.(error, attempt + 1, delay);

      // Wait before next attempt
      await sleep(delay);
    }
  }

  // All retries exhausted
  opts.onMaxRetriesExceeded?.(lastError, opts.maxAttempts);
  throw lastError;
}

/**
 * Create a retry wrapper for a function
 */
export function withRetry<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: RetryOptions = {}
): (...args: TArgs) => Promise<TReturn> {
  return (...args: TArgs) => retry(() => fn(...args), options);
}

/**
 * Retry specifically for HTTP requests
 */
export async function retryHttpRequest<T>(
  request: () => Promise<Response>,
  parseResponse: (response: Response) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const httpOptions: RetryOptions = {
    ...options,
    shouldRetry: (error: unknown, attempt: number) => {
      // Check base retry conditions first
      if (options.shouldRetry && !options.shouldRetry(error, attempt)) {
        return false;
      }

      // Retry for specific HTTP status codes
      if (error instanceof Error && error.message.includes('HTTP')) {
        const statusMatch = error.message.match(/HTTP (\d+)/);
        if (statusMatch) {
          const status = parseInt(statusMatch[1]);
          // Retry for server errors (5xx) and rate limiting (429)
          return status >= 500 || status === 429 || status === 408; // 408 = Request Timeout
        }
      }

      return DEFAULT_RETRY_OPTIONS.shouldRetry(error, attempt);
    },
  };

  return retry(async () => {
    const response = await request();

    // Check if response indicates a retryable error
    if (!response.ok) {
      const isRetryable =
        response.status >= 500 ||
        response.status === 429 ||
        response.status === 408;

      const errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      if (isRetryable) {
        throw new Error(errorMessage);
      } else {
        // For non-retryable errors, parse the response for more details
        try {
          const errorBody = await response.text();
          throw new Error(`${errorMessage} - ${errorBody}`);
        } catch {
          throw new Error(errorMessage);
        }
      }
    }

    return parseResponse(response);
  }, httpOptions);
}

/**
 * Retry with circuit breaker integration
 */
export async function retryWithCircuitBreaker<T>(
  fn: () => Promise<T>,
  circuitBreakerKey: string,
  options: RetryOptions = {}
): Promise<T> {
  // This will be implemented when we add circuit breaker
  // For now, just use regular retry
  return retry(fn, options);
}

/**
 * Preset retry configurations for common scenarios
 */
export const RetryPresets = {
  /** Quick retry for fast operations */
  quick: {
    maxAttempts: 2,
    initialDelay: 500,
    maxDelay: 2000,
    backoffMultiplier: 2,
  } as RetryOptions,

  /** Standard retry for most API calls */
  standard: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  } as RetryOptions,

  /** Aggressive retry for critical operations */
  aggressive: {
    maxAttempts: 5,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
  } as RetryOptions,

  /** Patient retry for long-running operations */
  patient: {
    maxAttempts: 3,
    initialDelay: 5000,
    maxDelay: 60000,
    backoffMultiplier: 1.5,
  } as RetryOptions,
};

/**
 * Type-safe retry decorators for different scenarios
 */
export const RetryDecorators = {
  /** For database operations */
  database: (options: Partial<RetryOptions> = {}) => ({
    ...RetryPresets.standard,
    ...options,
    shouldRetry: (error: unknown, attempt: number) => {
      if (error instanceof AppError) {
        return (
          error.code === ErrorCode.DATABASE_ERROR ||
          error.code === ErrorCode.NETWORK_ERROR ||
          error.code === ErrorCode.TIMEOUT_ERROR
        );
      }
      return DEFAULT_RETRY_OPTIONS.shouldRetry(error, attempt);
    },
  }),

  /** For external API calls */
  externalApi: (options: Partial<RetryOptions> = {}) => ({
    ...RetryPresets.standard,
    ...options,
    shouldRetry: (error: unknown, attempt: number) => {
      if (error instanceof AppError) {
        return (
          error.retryable ||
          error.code === ErrorCode.EXTERNAL_API_ERROR ||
          error.code === ErrorCode.AMADEUS_API_ERROR ||
          error.code === ErrorCode.DUFFEL_API_ERROR ||
          error.code === ErrorCode.RATE_LIMIT_EXCEEDED ||
          error.code === ErrorCode.NETWORK_ERROR ||
          error.code === ErrorCode.TIMEOUT_ERROR
        );
      }
      return DEFAULT_RETRY_OPTIONS.shouldRetry(error, attempt);
    },
  }),

  /** For payment operations (more careful) */
  payment: (options: Partial<RetryOptions> = {}) => ({
    ...RetryPresets.quick,
    maxAttempts: 2, // Be very careful with payments
    ...options,
    shouldRetry: (error: unknown) => {
      if (error instanceof AppError) {
        // Only retry for clear network/timeout errors in payments
        return (
          error.code === ErrorCode.NETWORK_ERROR ||
          error.code === ErrorCode.TIMEOUT_ERROR
        );
      }
      return false; // Don't retry payment errors by default
    },
  }),
};
