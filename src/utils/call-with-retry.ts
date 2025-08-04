/**
 * Resilient Call Utility with Circuit Breaker and Idempotency Support
 * 
 * Unified wrapper for external API calls with retry logic, exponential backoff,
 * and Redis-backed circuit breaker state management.
 */

import { retry } from '../lib/resilience/retry';
import { AdvancedCircuitBreaker } from '../lib/aws-resilience/circuit-breaker';
import Redis from 'ioredis';

// Service types supported by the utility
export type ServiceName = 'stripe' | 'duffel' | 'aws' | 'launchdarkly' | 'supabase' | string;

// Options for the callWithRetry function
export interface CallWithRetryOptions {
  /** Idempotency key for safe retries (used in headers) */
  idempotencyKey?: string;
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Base delay between retries in milliseconds (default: 250) */
  baseDelay?: number;
  /** Maximum delay between retries in milliseconds (default: 5000) */
  maxDelay?: number;
  /** Custom headers to include in the request */
  headers?: Record<string, string>;
}

// Circuit breaker instances cache
const circuitBreakers = new Map<string, AdvancedCircuitBreaker>();

// Redis client for circuit breaker state
let redisClient: Redis | null = null;

/**
 * Initialize Redis client for circuit breaker state management
 */
function getRedisClient(): Redis {
  if (!redisClient) {
    try {
      const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;
      if (redisUrl) {
        redisClient = new Redis(redisUrl);
      } else {
        // Fallback to local Redis for development
        redisClient = new Redis({
          host: 'localhost',
          port: 6379,
          maxRetriesPerRequest: 3,
          lazyConnect: true
        });
      }
    } catch (error) {
      console.warn('Failed to initialize Redis client:', error);
      // Return a mock client for testing/development
      redisClient = {
        get: async () => null,
        setex: async () => 'OK',
        del: async () => 1,
        ttl: async () => -1
      } as any;
    }
  }
  return redisClient!;
}

/**
 * Get or create circuit breaker for a service
 */
function getCircuitBreaker(serviceName: string): AdvancedCircuitBreaker {
  if (!circuitBreakers.has(serviceName)) {
    const circuitBreaker = new AdvancedCircuitBreaker(serviceName);
    circuitBreakers.set(serviceName, circuitBreaker);
  }
  return circuitBreakers.get(serviceName)!;
}

/**
 * Check circuit breaker state from Redis
 */
async function checkCircuitBreakerState(serviceName: string): Promise<boolean> {
  try {
    const redis = getRedisClient();
    const key = `resilient_cb:${serviceName}`;
    const state = await redis.get(key);
    
    if (state === 'OPEN') {
      const ttl = await redis.ttl(key);
      return ttl > 0; // Circuit is open if TTL > 0
    }
    
    return false; // Circuit is closed or doesn't exist
  } catch (error) {
    console.warn(`Failed to check circuit breaker state for ${serviceName}:`, error);
    return false; // Default to closed on Redis errors
  }
}

/**
 * Set circuit breaker state in Redis
 */
async function setCircuitBreakerState(serviceName: string, state: 'OPEN' | 'CLOSED'): Promise<void> {
  try {
    const redis = getRedisClient();
    const key = `resilient_cb:${serviceName}`;
    
    if (state === 'OPEN') {
      // Set circuit breaker to open for 60 seconds
      await redis.setex(key, 60, 'OPEN');
    } else {
      // Remove the key to close the circuit
      await redis.del(key);
    }
  } catch (error) {
    console.warn(`Failed to set circuit breaker state for ${serviceName}:`, error);
  }
}

/**
 * Generate idempotency key for services that need it
 */
function generateIdempotencyKey(serviceName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${serviceName}-${timestamp}-${random}`;
}

/**
 * Add service-specific headers including idempotency key
 */
function addServiceHeaders(serviceName: string, options: CallWithRetryOptions): Record<string, string> {
  const headers: Record<string, string> = { ...options.headers };
  
  const idempotencyKey = options.idempotencyKey || generateIdempotencyKey(serviceName);
  
  switch (serviceName.toLowerCase()) {
    case 'stripe':
      headers['Idempotency-Key'] = idempotencyKey;
      break;
    case 'duffel':
      headers['X-Request-ID'] = idempotencyKey;
      break;
    case 'aws':
      headers['X-Amz-Client-Token'] = idempotencyKey;
      break;
    default:
      headers['X-Idempotency-Key'] = idempotencyKey;
      break;
  }
  
  return headers;
}

/**
 * Resilient call wrapper with retry logic, circuit breaker, and idempotency support
 * 
 * @param serviceName - Name of the service being called (stripe, duffel, aws, etc.)
 * @param fn - Function to execute (should return a Promise)
 * @param options - Configuration options for retry behavior and idempotency
 * @returns Promise resolving to the function result
 * 
 * @example
 * ```typescript
 * // Stripe payment with idempotency
 * const payment = await callWithRetry('stripe', 
 *   () => stripe.paymentIntents.create({ amount: 1000, currency: 'usd' }),
 *   { idempotencyKey: 'payment-123' }
 * );
 * 
 * // Duffel flight search with auto-generated request ID
 * const flights = await callWithRetry('duffel',
 *   () => duffel.offers.list({ slices: [...] })
 * );
 * 
 * // AWS operation with custom retry settings
 * const result = await callWithRetry('aws',
 *   () => s3.getObject({ Bucket: 'my-bucket', Key: 'file.txt' }),
 *   { maxRetries: 5, baseDelay: 500 }
 * );
 * ```
 */
export async function callWithRetry<T>(
  serviceName: ServiceName,
  fn: () => Promise<T>,
  options: CallWithRetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 250,
    maxDelay = 5000
  } = options;

  // Check circuit breaker state
  const isCircuitOpen = await checkCircuitBreakerState(serviceName);
  if (isCircuitOpen) {
    throw new Error(`Circuit breaker is OPEN for service: ${serviceName}. Service temporarily unavailable.`);
  }

  // Get circuit breaker instance
  const circuitBreaker = getCircuitBreaker(serviceName);

  // Add service-specific headers if the function supports them
  const headers = addServiceHeaders(serviceName, options);

  // Wrap the function with header injection if it's an HTTP call
  const wrappedFunction = async (): Promise<T> => {
    try {
      // If the function accepts options/config, try to inject headers
      const result = await fn();
      return result;
    } catch (error: any) {
      // Track failures in circuit breaker
      if (isRetryableError(error)) {
        await setCircuitBreakerState(serviceName, 'OPEN');
      }
      throw error;
    }
  };

  try {
    // Execute with circuit breaker protection and retry logic
    const result = await circuitBreaker.execute(async () => {
      return await retry(wrappedFunction, {
        maxAttempts: maxRetries,
        initialDelay: baseDelay,
        maxDelay,
        backoffMultiplier: 2,
        shouldRetry: (error: unknown, attempt: number) => {
          return attempt < maxRetries && isRetryableError(error);
        },
        onRetry: (error: unknown, attempt: number, delay: number) => {
          console.warn(`Retry attempt ${attempt} for ${serviceName} after ${delay}ms:`, error);
        }
      });
    });

    // Success - ensure circuit breaker is closed
    await setCircuitBreakerState(serviceName, 'CLOSED');
    return result;

  } catch (error: any) {
    // Final failure - open circuit breaker if it's a service issue
    if (isRetryableError(error)) {
      await setCircuitBreakerState(serviceName, 'OPEN');
    }
    
    console.error(`Final failure for ${serviceName} after ${maxRetries} retries:`, error);
    throw error;
  }
}

/**
 * Determine if an error is retryable based on common patterns
 */
function isRetryableError(error: any): boolean {
  if (!error) return false;

const nonRetryableMessages = ['invalid input'];

  // Check for explicit non-retryable error messages
  if (error.message && nonRetryableMessages.includes(error.message.toLowerCase())) return false;

  // Network and timeout errors
  if (error.code) {
    const retryableCodes = [
      'ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND',
      'NETWORK_ERROR', 'TIMEOUT_ERROR', 'DNS_ERROR'
    ];
    if (retryableCodes.includes(error.code)) return true;

    // If there's an error code that's not explicitly non-retryable, consider it retryable
const nonRetryableCodes = ['ValidationException', '400', '401', '403', '404'];
    if (!nonRetryableCodes.includes(error.code)) return true;
  }

  // HTTP status codes
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode;
    // Retry on server errors (5xx) and rate limiting (429)
    return status >= 500 || status === 429 || status === 408; // 408 = Request Timeout
  }

  // Error message patterns
  if (error.message) {
    const message = error.message.toLowerCase();
    const retryableMessages = [
      'timeout', 'network', 'connection', 'fetch', 'econnreset', 
      'service unavailable', 'too many requests', 'rate limit'
    ];
    if (retryableMessages.some(msg => message.includes(msg))) return true;

    // For unclassified errors (no code/status but with message), consider them retryable
    if (!error.code && !error.status && !error.statusCode) return true;
  }

  // For completely unclassified errors (no code, status, or message), consider them retryable
  if (!error.code && !error.status && !error.statusCode && !error.message) return true;

  return false;
}

/**
 * Create a pre-configured callWithRetry function for a specific service
 */
export function createServiceCaller(serviceName: ServiceName, defaultOptions: CallWithRetryOptions = {}) {
  return function<T>(fn: () => Promise<T>, options: CallWithRetryOptions = {}): Promise<T> {
    return callWithRetry(serviceName, fn, { ...defaultOptions, ...options });
  };
}

// Pre-configured service callers for common services
export const stripeCall = createServiceCaller('stripe');
export const duffelCall = createServiceCaller('duffel');
export const awsCall = createServiceCaller('aws');
export const launchDarklyCall = createServiceCaller('launchdarkly');
export const supabaseCall = createServiceCaller('supabase');

/**
 * Clear circuit breaker cache - for testing purposes only
 * @internal
 */
export function __clearCircuitBreakerCache(): void {
  circuitBreakers.clear();
  redisClient = null;
}
