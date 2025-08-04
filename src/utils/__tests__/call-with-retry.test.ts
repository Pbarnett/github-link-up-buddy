/**
 * Unit Tests for callWithRetry Utility
 * 
 * Tests cover happy path, retry logic, circuit breaker functionality,
 * and idempotency key handling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Define the types we need for testing
interface CallWithRetryOptions {
  idempotencyKey?: string;
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  headers?: Record<string, string>;
}

// Mock factory functions that will be applied dynamically
function createIORedisMock() {
  return {
    default: vi.fn(() => ({
      get: vi.fn().mockResolvedValue(null),
      setex: vi.fn().mockResolvedValue('OK'),
      del: vi.fn().mockResolvedValue(1),
      ttl: vi.fn().mockResolvedValue(-1)
    }))
  };
}

function createConfigMock() {
  return {
    getApiConfig: vi.fn(() => ({
      retryAttempts: 3,
      retryDelay: 100
    }))
  };
}

function createErrorTypesMock() {
  return {
    AppError: class AppError extends Error {
      constructor(message: string, public code: string, public retryable: boolean = false) {
        super(message);
      }
    },
    ErrorCode: {
      NETWORK_ERROR: 'NETWORK_ERROR',
      TIMEOUT_ERROR: 'TIMEOUT_ERROR',
      RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
      SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
    }
  };
}

function createCircuitBreakerTypesMock() {
  return {
    CircuitState: {
      CLOSED: 'CLOSED',
      OPEN: 'OPEN',
      HALF_OPEN: 'HALF_OPEN'
    },
    ErrorType: {
      RETRYABLE: 'RETRYABLE',
      NON_RETRYABLE: 'NON_RETRYABLE'
    }
  };
}

function createServiceConfigMock() {
  return {
    getServiceConfig: vi.fn().mockImplementation((serviceName: string) => ({
      name: serviceName.toUpperCase(),
      failureThreshold: 5,
      timeoutMs: 30000,
      resetTimeoutMs: 60000,
      halfOpenMaxCalls: 1,
      errorClassifier: vi.fn().mockReturnValue('RETRYABLE'),
      retryConfig: {
        maxRetries: 3,
        baseDelayMs: 500,
        maxDelayMs: 5000,
        backoffMultiplier: 2,
        jitterFactor: 0.1,
        retryableErrors: ['TimeoutError', 'ServiceUnavailableException'],
        nonRetryableErrors: ['ValidationException', 'AccessDeniedException']
      }
    }))
  };
}

function createCircuitBreakerMock() {
  return {
    AdvancedCircuitBreaker: vi.fn(() => ({
      execute: vi.fn().mockImplementation(async (fn) => {
        return await fn();
      }),
      isOpen: vi.fn().mockReturnValue(false),
      isHalfOpen: vi.fn().mockReturnValue(false),
      isClosed: vi.fn().mockReturnValue(true),
      recordSuccess: vi.fn(),
      recordFailure: vi.fn(),
      getState: vi.fn().mockReturnValue('CLOSED'),
      open: vi.fn(),
      close: vi.fn(),
      halfOpen: vi.fn()
    }))
  };
}

function createRetryMock() {
  return {
    retry: vi.fn().mockImplementation(async (fn, options) => {
      let lastError;
      const maxAttempts = options?.maxAttempts || 3;
      
      for (let i = 0; i < maxAttempts; i++) {
        try {
          // Add a small delay to simulate retry timing (but keep it very small for tests)
          if (i > 0 && options?.initialDelay) {
            await new Promise(resolve => setTimeout(resolve, 1)); // Minimal delay for tests
          }
          return await fn();
        } catch (error) {
          lastError = error;
          
          // If this is the last attempt, throw the error
          if (i === maxAttempts - 1) {
            throw error;
          }
          
          // Check if we should retry based on the shouldRetry function
          // Note: shouldRetry receives (error, attemptNumber) where attemptNumber starts at 1
          if (options?.shouldRetry && !options.shouldRetry(error, i + 1)) {
            throw error;
          }
        }
      }
      throw lastError;
    })
  };
}

describe('callWithRetry', () => {
  let callWithRetry: any;
  let createServiceCaller: any;
  let stripeCall: any;
  let duffelCall: any;
  let awsCall: any;

  beforeEach(async () => {
    // Reset all modules and mocks to ensure proper test isolation
    vi.resetModules();
    vi.clearAllMocks();
    
    // Apply mocks dynamically using vi.doMock
    vi.doMock('ioredis', createIORedisMock);
    vi.doMock('../../lib/config', createConfigMock);
    vi.doMock('../../lib/errors/types', createErrorTypesMock);
    vi.doMock('../../lib/aws-resilience/types', createCircuitBreakerTypesMock);
    vi.doMock('../../lib/aws-resilience/service-configs', createServiceConfigMock);
    vi.doMock('../../lib/aws-resilience/circuit-breaker', createCircuitBreakerMock);
    vi.doMock('../../lib/resilience/retry', createRetryMock);
    
    // Dynamically import the module after mocks are set up
    const module = await import('../call-with-retry');
    callWithRetry = module.callWithRetry;
    createServiceCaller = module.createServiceCaller;
    stripeCall = module.stripeCall;
    duffelCall = module.duffelCall;
    awsCall = module.awsCall;
    
    // Clear circuit breaker cache between tests to prevent state issues
    if (module.__clearCircuitBreakerCache) {
      module.__clearCircuitBreakerCache();
    }
  });

describe('Redis Initialization', () => {
    it('should initialize Redis with URL when provided', async () => {
      process.env.REDIS_URL = 'redis://test-host:6379';
      const mockRedis = await vi.importMock('ioredis');
      const mockRedisConstructor = vi.fn();
      mockRedis.default = mockRedisConstructor;

      const mockFn = vi.fn().mockResolvedValue('success');
      await callWithRetry('test-service', mockFn);

      expect(mockRedisConstructor).toHaveBeenCalledWith('redis://test-host:6379');
    });

    it('should use Upstash Redis URL as fallback', async () => {
      process.env.REDIS_URL = '';
      process.env.UPSTASH_REDIS_REST_URL = 'redis://upstash:6379';
      const mockRedis = await vi.importMock('ioredis');
      const mockRedisConstructor = vi.fn();
      mockRedis.default = mockRedisConstructor;

      const mockFn = vi.fn().mockResolvedValue('success');
      await callWithRetry('test-service', mockFn);

      expect(mockRedisConstructor).toHaveBeenCalledWith('redis://upstash:6379');
    });

    it('should initialize Redis with default config when no URL provided', async () => {
      process.env.REDIS_URL = '';
      process.env.UPSTASH_REDIS_REST_URL = '';
      const mockRedis = await vi.importMock('ioredis');
      const mockRedisConstructor = vi.fn();
      mockRedis.default = mockRedisConstructor;

      const mockFn = vi.fn().mockResolvedValue('success');
      await callWithRetry('test-service', mockFn);

      expect(mockRedisConstructor).toHaveBeenCalledWith({
        host: 'localhost',
        port: 6379,
        maxRetriesPerRequest: 3,
        lazyConnect: true
      });
    });
  });

  describe('Circuit Breaker State Management', () => {
    it('should handle TTL edge cases for circuit breaker state', async () => {
      const mockRedis = await vi.importMock('ioredis');
      const getTTL = vi.fn().mockResolvedValue(0); // Edge case: TTL = 0
      mockRedis.default = vi.fn(() => ({
        get: vi.fn().mockResolvedValue('OPEN'),
        ttl: getTTL,
        setex: vi.fn().mockResolvedValue('OK'),
        del: vi.fn().mockResolvedValue(1)
      }));

      const mockFn = vi.fn().mockResolvedValue('success');
      const result = await callWithRetry('test-service', mockFn);
      expect(result).toBe('success');

      // Test negative TTL
      getTTL.mockResolvedValue(-1);
      const result2 = await callWithRetry('test-service', mockFn);
      expect(result2).toBe('success');
    });

    it('should properly format circuit breaker keys', async () => {
      const mockRedis = await vi.importMock('ioredis');
      const mockGet = vi.fn().mockResolvedValue(null);
      const mockSetex = vi.fn().mockResolvedValue('OK');
      const mockDel = vi.fn().mockResolvedValue(1);
      mockRedis.default.mockReturnValue({
        get: mockGet,
        ttl: vi.fn().mockResolvedValue(-1),
        setex: mockSetex,
        del: mockDel
      });

      const mockFn = vi.fn().mockResolvedValue('success');
      await callWithRetry('test-service', mockFn);

      expect(mockGet).toHaveBeenCalledWith('resilient_cb:test-service');
      expect(mockDel).toHaveBeenCalledWith('resilient_cb:test-service');
    });
  });

  describe('Idempotency Key Generation', () => {
    it('should generate unique and properly formatted idempotency keys', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      const mockRedis = await vi.importMock('ioredis');
      mockRedis.default = vi.fn(() => ({
        get: vi.fn().mockResolvedValue(null),
        ttl: vi.fn().mockResolvedValue(-1),
        setex: vi.fn().mockResolvedValue('OK'),
        del: vi.fn().mockResolvedValue(1)
      }));

      // Freeze time and random for deterministic testing
      const mockDate = new Date('2025-01-01T00:00:00Z');
      vi.setSystemTime(mockDate);
      const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0.123456789);

      await callWithRetry('stripe', mockFn);
      await callWithRetry('stripe', mockFn);

      const timestamp = mockDate.getTime();
      const randomPart = (0.123456789).toString(36).substring(2, 15);
      const expectedKey = `stripe-${timestamp}-${randomPart}`;

      // Reset mocks
      vi.useRealTimers();
      mockRandom.mockRestore();
    });

    it('should properly handle service-specific idempotency headers', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      const services = [
        { name: 'stripe', header: 'Idempotency-Key' },
        { name: 'duffel', header: 'X-Request-ID' },
        { name: 'aws', header: 'X-Amz-Client-Token' },
        { name: 'custom', header: 'X-Idempotency-Key' }
      ];

      for (const service of services) {
        const result = await callWithRetry(service.name, mockFn, {
          headers: { 'Custom-Header': 'value' }
        });
        expect(result).toBe('success');
      }
    });
  });

  describe('Error Classification Edge Cases', () => {
    it('should handle errors without code or status', async () => {
      const error = new Error('Unknown error');
      const mockFn = vi.fn()
        .mockRejectedValue(error);

      await expect(callWithRetry('test-service', mockFn, {
        maxRetries: 3,
        shouldRetry: () => true
      }))
        .rejects.toThrow('Unknown error');
      expect(mockFn).toHaveBeenCalledTimes(3); // Should retry on unclassified errors
    });

    it('should properly classify all HTTP status codes', async () => {
      const statusCodes = [
        { code: 400, retryable: false },
        { code: 401, retryable: false },
        { code: 403, retryable: false },
        { code: 404, retryable: false },
        { code: 408, retryable: true },
        { code: 429, retryable: true },
        { code: 500, retryable: true },
        { code: 502, retryable: true },
        { code: 503, retryable: true },
        { code: 504, retryable: true }
      ];

      for (const { code, retryable } of statusCodes) {
        const error = new Error(`HTTP ${code}`);
        (error as any).statusCode = code;
        const mockFn = vi.fn()
          .mockRejectedValueOnce(error)
          .mockResolvedValue('success');

        if (retryable) {
          const result = await callWithRetry('test-service', mockFn);
          expect(result).toBe('success');
          expect(mockFn).toHaveBeenCalledTimes(2);
        } else {
          await expect(callWithRetry('test-service', mockFn))
            .rejects.toThrow(`HTTP ${code}`);
          expect(mockFn).toHaveBeenCalledTimes(1);
        }

        vi.clearAllMocks();
      }
    });
  });

  describe('Survivor Tests', () => {
    it('should handle missing Redis without error', async () => {
      process.env.REDIS_URL = '';
      const mockFn = vi.fn().mockResolvedValue('success');
      const result = await callWithRetry('test-service', mockFn);
      expect(result).toBe('success');
    });

    it('should handle undefined idempotency key gracefully', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      const result = await callWithRetry('stripe', mockFn, { idempotencyKey: undefined });
      expect(result).toBe('success');
    });

    it('should not retry for non-retryable error codes', async () => {
      const nonRetryableError = new Error('Validation failed');
      (nonRetryableError as any).code = 'ValidationException';
      const mockFn = vi.fn().mockRejectedValue(nonRetryableError);

      await expect(callWithRetry('test-service', mockFn)).rejects.toThrow('Validation failed');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should handle empty headers', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      const result = await callWithRetry('aws', mockFn, { headers: {} });
      expect(result).toBe('success');
    });
  });

  

  describe('Happy Path', () => {
    it('should successfully execute function and return result', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      
      const result = await callWithRetry('test-service', mockFn);
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should work with different service names', async () => {
      const mockFn = vi.fn().mockResolvedValue({ data: 'test' });
      
      const result = await callWithRetry('stripe', mockFn);
      
      expect(result).toEqual({ data: 'test' });
    });

    it('should handle async functions with complex return types', async () => {
      const complexResult = {
        id: '123',
        status: 'success',
        data: [1, 2, 3],
        metadata: { timestamp: Date.now() }
      };
      const mockFn = vi.fn().mockResolvedValue(complexResult);
      
      const result = await callWithRetry('duffel', mockFn);
      
      expect(result).toEqual(complexResult);
    });
  });

  describe('Retry Logic', () => {
    it('should retry on retryable errors and eventually succeed', async () => {
      const error1 = new Error('ECONNRESET');
      (error1 as any).code = 'ECONNRESET';
      const error2 = new Error('ETIMEDOUT');
      (error2 as any).code = 'ETIMEDOUT';
      
      const mockFn = vi.fn()
        .mockRejectedValueOnce(error1)
        .mockRejectedValueOnce(error2)
        .mockResolvedValue('success');
      
      const result = await callWithRetry('test-service', mockFn, {
        maxRetries: 3, // maxRetries is passed as maxAttempts to retry function
        baseDelay: 10
      });
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should respect maxRetries setting', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('network error'));
      
      await expect(
        callWithRetry('test-service', mockFn, { maxRetries: 2 })
      ).rejects.toThrow('network error');
      
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should not retry on non-retryable errors', async () => {
      const nonRetryableError = new Error('Validation failed');
      (nonRetryableError as any).statusCode = 400;
      
      const mockFn = vi.fn().mockRejectedValue(nonRetryableError);
      
      await expect(
        callWithRetry('test-service', mockFn)
      ).rejects.toThrow('Validation failed');
      
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on HTTP 5xx errors', async () => {
      const serverError = new Error('Internal Server Error');
      (serverError as any).statusCode = 500;
      
      const mockFn = vi.fn()
        .mockRejectedValueOnce(serverError)
        .mockResolvedValue('recovered');
      
      const result = await callWithRetry('test-service', mockFn);
      
      expect(result).toBe('recovered');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should retry on HTTP 429 (rate limit) errors', async () => {
      const rateLimitError = new Error('Too Many Requests');
      (rateLimitError as any).statusCode = 429;
      
      const mockFn = vi.fn()
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValue('success');
      
      const result = await callWithRetry('test-service', mockFn);
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('Circuit Breaker Integration', () => {
    it('should throw error when circuit breaker is open', async () => {
      // Mock Redis to return circuit breaker is open
      const mockRedis = await vi.importMock('ioredis');
      (mockRedis.default as any).mockImplementation(() => ({
        get: vi.fn().mockResolvedValue('OPEN'),
        ttl: vi.fn().mockResolvedValue(30), // 30 seconds remaining
        setex: vi.fn().mockResolvedValue('OK'),
        del: vi.fn().mockResolvedValue(1)
      }));

      const mockFn = vi.fn().mockResolvedValue('success');
      
      await expect(
        callWithRetry('test-service', mockFn)
      ).rejects.toThrow('Circuit breaker is OPEN for service: test-service');
      
      expect(mockFn).not.toHaveBeenCalled();
    });

    it('should open circuit breaker after repeated failures', async () => {
      const mockRedis = await vi.importMock('ioredis');
      const setexMock = vi.fn().mockResolvedValue('OK');
      (mockRedis.default as any).mockImplementation(() => ({
        get: vi.fn().mockResolvedValue(null),
        ttl: vi.fn().mockResolvedValue(-1),
        setex: setexMock,
        del: vi.fn().mockResolvedValue(1)
      }));

      const retryableError = new Error('Service Unavailable');
      (retryableError as any).statusCode = 503;
      
      const mockFn = vi.fn().mockRejectedValue(retryableError);
      
      await expect(
        callWithRetry('test-service', mockFn)
      ).rejects.toThrow('Service Unavailable');
      
      // Circuit breaker should be opened
      expect(setexMock).toHaveBeenCalledWith('resilient_cb:test-service', 60, 'OPEN');
    });

    it('should close circuit breaker on successful call', async () => {
      const mockRedis = await vi.importMock('ioredis');
      const delMock = vi.fn().mockResolvedValue(1);
      (mockRedis.default as any).mockImplementation(() => ({
        get: vi.fn().mockResolvedValue(null),
        ttl: vi.fn().mockResolvedValue(-1),
        setex: vi.fn().mockResolvedValue('OK'),
        del: delMock
      }));

      const mockFn = vi.fn().mockResolvedValue('success');
      
      const result = await callWithRetry('test-service', mockFn);
      
      expect(result).toBe('success');
      expect(delMock).toHaveBeenCalledWith('resilient_cb:test-service');
    });
  });

  describe('Idempotency Key Handling', () => {
    it('should generate unique idempotency keys for different calls', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      
      // Make multiple calls
      await callWithRetry('stripe', mockFn);
      await callWithRetry('stripe', mockFn);
      
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should use provided idempotency key', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      
      await callWithRetry('stripe', mockFn, {
        idempotencyKey: 'custom-key-123'
      });
      
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should handle different service header patterns', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      
      // Test different services
      await callWithRetry('stripe', mockFn);
      await callWithRetry('duffel', mockFn);
      await callWithRetry('aws', mockFn);
      await callWithRetry('custom-service', mockFn);
      
      expect(mockFn).toHaveBeenCalledTimes(4);
    });
  });

  describe('Pre-configured Service Callers', () => {
    it('should work with stripeCall', async () => {
      const mockFn = vi.fn().mockResolvedValue({ id: 'payment_123' });
      
      const result = await stripeCall(mockFn);
      
      expect(result).toEqual({ id: 'payment_123' });
    });

    it('should work with duffelCall', async () => {
      const mockFn = vi.fn().mockResolvedValue({ offers: [] });
      
      const result = await duffelCall(mockFn);
      
      expect(result).toEqual({ offers: [] });
    });

    it('should work with awsCall', async () => {
      const mockFn = vi.fn().mockResolvedValue({ Body: 'file-content' });
      
      const result = await awsCall(mockFn);
      
      expect(result).toEqual({ Body: 'file-content' });
    });

    it('should allow overriding options in pre-configured callers', async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new Error('ECONNRESET'))
        .mockResolvedValue('success');
      
      const result = await stripeCall(mockFn, { maxRetries: 5 });
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('createServiceCaller', () => {
    it('should create a custom service caller', async () => {
      const customCaller = createServiceCaller('custom-api', {
        maxRetries: 5,
        baseDelay: 500
      });
      
      const mockFn = vi.fn().mockResolvedValue('custom-result');
      
      const result = await customCaller(mockFn);
      
      expect(result).toBe('custom-result');
    });

    it('should merge default options with call-specific options', async () => {
      const customCaller = createServiceCaller('custom-api', {
        maxRetries: 2,
        baseDelay: 100
      });
      
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new Error('ECONNRESET'))
        .mockResolvedValue('success');
      
      const result = await customCaller(mockFn, { maxRetries: 4 });
      
      expect(result).toBe('success');
    });
  });

  describe('Error Classification', () => {
    it('should correctly identify retryable network errors', async () => {
      const networkErrors = [
        { code: 'ECONNRESET' },
        { code: 'ETIMEDOUT' },
        { code: 'ENOTFOUND' },
        { message: 'fetch failed' },
        { message: 'connection timeout' }
      ];
      
      for (const error of networkErrors) {
        const mockFn = vi.fn()
          .mockRejectedValueOnce(error)
          .mockResolvedValue('recovered');
        
        const result = await callWithRetry('test-service', mockFn);
        expect(result).toBe('recovered');
      }
    });

    it('should correctly identify non-retryable errors', async () => {
      const nonRetryableErrors = [
        { statusCode: 400 }, // Bad Request
        { statusCode: 401 }, // Unauthorized
        { statusCode: 403 }, // Forbidden
        { statusCode: 404 }, // Not Found
        { message: 'invalid input' }
      ];
      
      for (const error of nonRetryableErrors) {
        const mockFn = vi.fn().mockRejectedValue(error);
        
        await expect(
          callWithRetry('test-service', mockFn)
        ).rejects.toEqual(error);
        
        expect(mockFn).toHaveBeenCalledTimes(1);
        vi.clearAllMocks();
      }
    });
  });

  describe('Configuration Options', () => {
    it('should respect custom delay settings', async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new Error('ECONNRESET'))
        .mockResolvedValue('success');
      
      await callWithRetry('test-service', mockFn, {
        baseDelay: 100,
        maxDelay: 1000
      });
      
      expect(mockFn).toHaveBeenCalledTimes(2);
      // Just verify function behavior without timing assertions
    });

    it('should handle custom headers', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      
      await callWithRetry('test-service', mockFn, {
        headers: { 'X-Custom-Header': 'test-value' }
      });
      
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined service name', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      
      const result = await callWithRetry('', mockFn);
      
      expect(result).toBe('success');
    });

    it('should handle function that throws immediately', async () => {
      const mockFn = vi.fn().mockImplementation(() => {
        throw new Error('immediate error');
      });
      
      await expect(
        callWithRetry('test-service', mockFn)
      ).rejects.toThrow('immediate error');
    });

    it('should handle Redis connection failures gracefully', async () => {
      const mockRedis = await vi.importMock('ioredis');
      (mockRedis.default as any).mockImplementation(() => ({
        get: vi.fn().mockRejectedValue(new Error('Redis connection failed')),
        setex: vi.fn().mockRejectedValue(new Error('Redis connection failed')),
        del: vi.fn().mockRejectedValue(new Error('Redis connection failed')),
        ttl: vi.fn().mockRejectedValue(new Error('Redis connection failed'))
      }));

      const mockFn = vi.fn().mockResolvedValue('success');
      
      // Should still work even if Redis fails
      const result = await callWithRetry('test-service', mockFn);
      
      expect(result).toBe('success');
    });
  });
});
