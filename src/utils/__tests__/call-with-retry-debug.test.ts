/**
 * Debug test to isolate the callWithRetry issue
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

// Mock retry utility - simplified to just execute once
vi.mock('../../lib/resilience/retry', () => ({
  retry: vi.fn().mockImplementation(async (fn) => {
    console.log('Retry mock called with function:', typeof fn);
    const result = await fn();
    console.log('Retry mock result:', result);
    return result;
  })
}));

// Mock circuit breaker - simplified to just execute
vi.mock('../../lib/aws-resilience/circuit-breaker', () => ({
  AdvancedCircuitBreaker: vi.fn(() => ({
    execute: vi.fn().mockImplementation(async (fn) => {
      console.log('Circuit breaker execute called with function:', typeof fn);
      const result = await fn();
      console.log('Circuit breaker execute result:', result);
      return result;
    })
  }))
}));

describe('callWithRetry - Debug Test', () => {
  let callWithRetry: any;
  let clearCache: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Import the module after mocks are set up
    const callWithRetryModule = await import('../call-with-retry');
    callWithRetry = callWithRetryModule.callWithRetry;
    clearCache = callWithRetryModule.__clearCircuitBreakerCache;
    
    // Clear the circuit breaker cache to prevent state persistence between tests
    clearCache();
  });

  it('should execute test-service correctly', async () => {
    const mockFn = vi.fn().mockResolvedValue('test-service-result');
    
    console.log('=== Test 1: test-service ===');
    const result = await callWithRetry('test-service', mockFn);
    console.log('Final result:', result);
    
    expect(result).toBe('test-service-result');
  });

  it('should execute stripe correctly', async () => {
    const mockFn = vi.fn().mockResolvedValue('stripe-result');
    
    console.log('=== Test 2: stripe ===');
    const result = await callWithRetry('stripe', mockFn);
    console.log('Final result:', result);
    
    expect(result).toBe('stripe-result');
  });

  it('should execute multiple services in same test', async () => {
    console.log('=== Test 3: Multiple services ===');
    
    const mockFn1 = vi.fn().mockResolvedValue('test-service-result');
    const result1 = await callWithRetry('test-service', mockFn1);
    console.log('Result 1 (test-service):', result1);
    
    const mockFn2 = vi.fn().mockResolvedValue('stripe-result');
    const result2 = await callWithRetry('stripe', mockFn2);
    console.log('Result 2 (stripe):', result2);
    
    expect(result1).toBe('test-service-result');
    expect(result2).toBe('stripe-result');
  });
});
