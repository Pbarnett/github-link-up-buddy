/**
 * Focused Unit Tests for callWithRetry Utility
 * 
 * Tests only the actual dependencies used by the implementation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Redis
vi.mock('ioredis', () => ({
  default: vi.fn(() => ({
    get: vi.fn().mockResolvedValue(null),
    setex: vi.fn().mockResolvedValue('OK'),
    del: vi.fn().mockResolvedValue(1),
    ttl: vi.fn().mockResolvedValue(-1)
  }))
}));

// Mock retry utility
vi.mock('../../lib/resilience/retry', () => ({
  retry: vi.fn().mockImplementation(async (fn, options) => {
    let lastError;
    const maxAttempts = options?.maxAttempts || 3;
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (i === maxAttempts - 1) {
          throw error;
        }
        if (options?.shouldRetry && !options.shouldRetry(error, i)) {
          throw error;
        }
      }
    }
    throw lastError;
  })
}));

// Mock circuit breaker
vi.mock('../../lib/aws-resilience/circuit-breaker', () => ({
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
}));

describe('callWithRetry - Focused Tests', () => {
  let callWithRetry: any;
  let createServiceCaller: any;
  let stripeCall: any;
  let duffelCall: any;
  let awsCall: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Import the module after mocks are set up
    const module = await import('../call-with-retry');
    callWithRetry = module.callWithRetry;
    createServiceCaller = module.createServiceCaller;
    stripeCall = module.stripeCall;
    duffelCall = module.duffelCall;
    awsCall = module.awsCall;
  });

  describe('Basic Functionality', () => {
    it('should execute a function and return its result', async () => {
      const mockFn = vi.fn().mockResolvedValue('test-result');
      
      console.log('Test 1: callWithRetry function type:', typeof callWithRetry);
      const result = await callWithRetry('test-service', mockFn);
      console.log('Test 1: Result received:', result);
      
      expect(result).toBe('test-result');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should work with different return types', async () => {
      const mockData = { id: 123, name: 'test' };
      const mockFn = vi.fn().mockResolvedValue(mockData);
      
      console.log('Test 2: callWithRetry function type:', typeof callWithRetry);
      const result = await callWithRetry('stripe', mockFn);
      console.log('Test 2: Result received:', result);
      
      expect(result).toEqual(mockData);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should handle async functions', async () => {
      const mockFn = vi.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'async-result';
      });
      
      const result = await callWithRetry('duffel', mockFn);
      
      expect(result).toBe('async-result');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should throw errors that are not retryable', async () => {
      const error = new Error('Non-retryable error');
      const mockFn = vi.fn().mockRejectedValue(error);
      
      await expect(callWithRetry('test-service', mockFn)).rejects.toThrow('Non-retryable error');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on retryable errors', async () => {
      const retryableError = new Error('ECONNRESET');
      retryableError.code = 'ECONNRESET';
      
      const mockFn = vi.fn()
        .mockRejectedValueOnce(retryableError)
        .mockRejectedValueOnce(retryableError)
        .mockResolvedValue('success-after-retries');
      
      const result = await callWithRetry('test-service', mockFn);
      
      expect(result).toBe('success-after-retries');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });
  });

  describe('Service-specific Callers', () => {
    it('should work with stripeCall', async () => {
      const mockFn = vi.fn().mockResolvedValue({ id: 'stripe-result' });
      
      const result = await stripeCall(mockFn);
      
      expect(result).toEqual({ id: 'stripe-result' });
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should work with duffelCall', async () => {
      const mockFn = vi.fn().mockResolvedValue({ offers: ['flight1', 'flight2'] });
      
      const result = await duffelCall(mockFn);
      
      expect(result).toEqual({ offers: ['flight1', 'flight2'] });
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should work with awsCall', async () => {
      const mockFn = vi.fn().mockResolvedValue({ Body: 'file-content' });
      
      const result = await awsCall(mockFn);
      
      expect(result).toEqual({ Body: 'file-content' });
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom Service Caller', () => {
    it('should create a working custom service caller', async () => {
      const customCaller = createServiceCaller('custom-service');
      const mockFn = vi.fn().mockResolvedValue('custom-result');
      
      const result = await customCaller(mockFn);
      
      expect(result).toBe('custom-result');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should merge options correctly', async () => {
      const customCaller = createServiceCaller('custom-service', { maxRetries: 5 });
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new Error('ETIMEDOUT'))
        .mockResolvedValue('success');
      
      const result = await customCaller(mockFn, { baseDelay: 100 });
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
});
