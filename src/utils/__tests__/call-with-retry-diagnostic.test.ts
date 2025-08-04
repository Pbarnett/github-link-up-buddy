/**
 * COMPREHENSIVE DIAGNOSTIC TEST
 * 
 * This test will help us understand:
 * 1. Module loading order
 * 2. Mock application timing
 * 3. Circuit breaker instance creation
 * 4. Execution flow through mocked dependencies
 */

import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest';

console.log('🔍 DIAGNOSTIC: Test file loading...');

// Track mock creation
const mockTracker = {
  redisCreated: 0,
  retryCreated: 0,
  circuitBreakerCreated: 0,
  callHistory: [] as string[]
};

// Mock functions that will be applied dynamically
function createRedisMock() {
  console.log('🔍 DIAGNOSTIC: Redis mock being created');
  mockTracker.redisCreated++;
  return {
    default: vi.fn(() => {
      console.log('🔍 DIAGNOSTIC: Redis instance being created');
      return {
        get: vi.fn().mockImplementation(async (key) => {
          console.log(`🔍 DIAGNOSTIC: Redis.get called with key: ${key}`);
          mockTracker.callHistory.push(`redis.get(${key})`);
          return null;
        }),
        setex: vi.fn().mockImplementation(async (key, ttl, value) => {
          console.log(`🔍 DIAGNOSTIC: Redis.setex called with key: ${key}, ttl: ${ttl}, value: ${value}`);
          mockTracker.callHistory.push(`redis.setex(${key}, ${ttl}, ${value})`);
          return 'OK';
        }),
        del: vi.fn().mockImplementation(async (key) => {
          console.log(`🔍 DIAGNOSTIC: Redis.del called with key: ${key}`);
          mockTracker.callHistory.push(`redis.del(${key})`);
          return 1;
        }),
        ttl: vi.fn().mockImplementation(async (key) => {
          console.log(`🔍 DIAGNOSTIC: Redis.ttl called with key: ${key}`);
          mockTracker.callHistory.push(`redis.ttl(${key})`);
          return -1;
        })
      };
    })
  };
}

function createRetryMock() {
  console.log('🔍 DIAGNOSTIC: Retry mock being created');
  mockTracker.retryCreated++;
  return {
    retry: vi.fn().mockImplementation(async (fn, options) => {
      console.log('🔍 DIAGNOSTIC: retry function called with options:', options);
      mockTracker.callHistory.push(`retry(${typeof fn}, ${JSON.stringify(options)})`);
      
      try {
        const result = await fn();
        console.log('🔍 DIAGNOSTIC: retry function result:', result);
        return result;
      } catch (error) {
        console.log('🔍 DIAGNOSTIC: retry function error:', error);
        throw error;
      }
    })
  };
}

function createCircuitBreakerMock() {
  console.log('🔍 DIAGNOSTIC: Circuit breaker mock being created');
  mockTracker.circuitBreakerCreated++;
  return {
    AdvancedCircuitBreaker: vi.fn().mockImplementation((serviceName) => {
      console.log(`🔍 DIAGNOSTIC: AdvancedCircuitBreaker instance created for service: ${serviceName}`);
      mockTracker.callHistory.push(`new AdvancedCircuitBreaker(${serviceName})`);
      
      return {
        execute: vi.fn().mockImplementation(async (fn) => {
          console.log(`🔍 DIAGNOSTIC: CircuitBreaker.execute called for service: ${serviceName}`);
          mockTracker.callHistory.push(`circuitBreaker.execute(${typeof fn}) for ${serviceName}`);
          
          try {
            const result = await fn();
            console.log(`🔍 DIAGNOSTIC: CircuitBreaker.execute result for ${serviceName}:`, result);
            return result;
          } catch (error) {
            console.log(`🔍 DIAGNOSTIC: CircuitBreaker.execute error for ${serviceName}:`, error);
            throw error;
          }
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
      };
    })
  };
}

describe('🔍 DIAGNOSTIC: Call With Retry Analysis', () => {
  let callWithRetry: any;
  let clearCache: any;
  let moduleImports: any;

  beforeAll(() => {
    console.log('🔍 DIAGNOSTIC: beforeAll hook');
    console.log('🔍 DIAGNOSTIC: Mock creation counts:', mockTracker);
  });

  beforeEach(async () => {
    console.log('\n🔍 DIAGNOSTIC: ===== NEW TEST STARTING =====');
    console.log('🔍 DIAGNOSTIC: beforeEach hook');
    
    // Reset tracking
    mockTracker.callHistory = [];
    
    // Reset all modules and mocks
    vi.resetModules();
    vi.clearAllMocks();
    console.log('🔍 DIAGNOSTIC: vi.resetModules() and vi.clearAllMocks() called');

    // Apply mocks dynamically
    console.log('🔍 DIAGNOSTIC: Applying mocks dynamically...');
    vi.doMock('ioredis', createRedisMock);
    vi.doMock('../../lib/resilience/retry', createRetryMock);
    vi.doMock('../../lib/aws-resilience/circuit-breaker', createCircuitBreakerMock);
    console.log('🔍 DIAGNOSTIC: Mocks applied with vi.doMock()');

    // Import the module fresh
    console.log('🔍 DIAGNOSTIC: About to import call-with-retry module...');
    moduleImports = await import('../call-with-retry');
    
    callWithRetry = moduleImports.callWithRetry;
    clearCache = moduleImports.__clearCircuitBreakerCache;
    
    console.log('🔍 DIAGNOSTIC: Module imported successfully');
    console.log('🔍 DIAGNOSTIC: callWithRetry type:', typeof callWithRetry);
    console.log('🔍 DIAGNOSTIC: clearCache type:', typeof clearCache);
    
    // Clear cache
    if (clearCache) {
      console.log('🔍 DIAGNOSTIC: Clearing circuit breaker cache...');
      clearCache();
      console.log('🔍 DIAGNOSTIC: Cache cleared');
    }
    
    console.log('🔍 DIAGNOSTIC: beforeEach complete');
  });

  afterEach(() => {
    console.log('\n🔍 DIAGNOSTIC: ===== TEST COMPLETED =====');
    console.log('🔍 DIAGNOSTIC: Call history:', mockTracker.callHistory);
    console.log('🔍 DIAGNOSTIC: Mock creation counts:', mockTracker);
  });

  it('🔍 DIAGNOSTIC: Test 1 - Basic function call with test-service', async () => {
    console.log('\n🔍 DIAGNOSTIC: Starting Test 1');
    
    const mockFn = vi.fn().mockResolvedValue('test-1-result');
    console.log('🔍 DIAGNOSTIC: Created mockFn that returns: test-1-result');
    
    console.log('🔍 DIAGNOSTIC: About to call callWithRetry with test-service...');
    const result = await callWithRetry('test-service', mockFn);
    
    console.log('🔍 DIAGNOSTIC: callWithRetry returned:', result);
    console.log('🔍 DIAGNOSTIC: mockFn call count:', mockFn.mock.calls.length);
    console.log('🔍 DIAGNOSTIC: Final call history:', mockTracker.callHistory);
    
    expect(result).toBe('test-1-result');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('🔍 DIAGNOSTIC: Test 2 - Basic function call with stripe', async () => {
    console.log('\n🔍 DIAGNOSTIC: Starting Test 2');
    
    const mockFn = vi.fn().mockResolvedValue('test-2-result');
    console.log('🔍 DIAGNOSTIC: Created mockFn that returns: test-2-result');
    
    console.log('🔍 DIAGNOSTIC: About to call callWithRetry with stripe...');
    const result = await callWithRetry('stripe', mockFn);
    
    console.log('🔍 DIAGNOSTIC: callWithRetry returned:', result);
    console.log('🔍 DIAGNOSTIC: mockFn call count:', mockFn.mock.calls.length);
    console.log('🔍 DIAGNOSTIC: Final call history:', mockTracker.callHistory);
    
    expect(result).toBe('test-2-result');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('🔍 DIAGNOSTIC: Test 3 - Multiple calls in same test', async () => {
    console.log('\n🔍 DIAGNOSTIC: Starting Test 3');
    
    const mockFn1 = vi.fn().mockResolvedValue('test-3a-result');
    const mockFn2 = vi.fn().mockResolvedValue('test-3b-result');
    
    console.log('🔍 DIAGNOSTIC: First call with test-service...');
    const result1 = await callWithRetry('test-service', mockFn1);
    console.log('🔍 DIAGNOSTIC: First call returned:', result1);
    
    console.log('🔍 DIAGNOSTIC: Second call with stripe...');
    const result2 = await callWithRetry('stripe', mockFn2);
    console.log('🔍 DIAGNOSTIC: Second call returned:', result2);
    
    console.log('🔍 DIAGNOSTIC: Final call history:', mockTracker.callHistory);
    
    expect(result1).toBe('test-3a-result');
    expect(result2).toBe('test-3b-result');
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  it('🔍 DIAGNOSTIC: Test 4 - Function execution flow analysis', async () => {
    console.log('\n🔍 DIAGNOSTIC: Starting Test 4 - Flow Analysis');
    
    const mockFn = vi.fn().mockImplementation(async () => {
      console.log('🔍 DIAGNOSTIC: Mock function is being executed!');
      return 'flow-test-result';
    });
    
    console.log('🔍 DIAGNOSTIC: About to trace execution flow...');
    
    try {
      const result = await callWithRetry('flow-test', mockFn);
      console.log('🔍 DIAGNOSTIC: Flow test result:', result);
      
      expect(result).toBe('flow-test-result');
      expect(mockFn).toHaveBeenCalledTimes(1);
    } catch (error) {
      console.error('🔍 DIAGNOSTIC: Flow test error:', error);
      throw error;
    }
  });

  it('🔍 DIAGNOSTIC: Test 5 - Module state inspection', async () => {
    console.log('\n🔍 DIAGNOSTIC: Starting Test 5 - Module State');
    
    // Inspect the imported module
    console.log('🔍 DIAGNOSTIC: Module exports:', Object.keys(moduleImports));
    
    // Test if functions are actually functions
    console.log('🔍 DIAGNOSTIC: callWithRetry is function:', typeof callWithRetry === 'function');
    console.log('🔍 DIAGNOSTIC: clearCache is function:', typeof clearCache === 'function');
    
    // Try a simple call
    const mockFn = vi.fn().mockResolvedValue('state-test-result');
    const result = await callWithRetry('state-test', mockFn);
    
    console.log('🔍 DIAGNOSTIC: State test result:', result);
    
    expect(typeof callWithRetry).toBe('function');
    expect(result).toBe('state-test-result');
  });
});
