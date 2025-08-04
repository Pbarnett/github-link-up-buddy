/**
 * Simple isolated test for callWithRetry debugging
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock all dependencies completely
vi.mock('ioredis', () => ({
  default: vi.fn(() => ({
    get: vi.fn().mockResolvedValue(null),
    setex: vi.fn().mockResolvedValue('OK'),
    del: vi.fn().mockResolvedValue(1),
    ttl: vi.fn().mockResolvedValue(-1)
  }))
}));

// Mock config
vi.mock('../../lib/config', () => ({
  getApiConfig: vi.fn(() => ({
    retryAttempts: 3,
    retryDelay: 100
  }))
}));

// Mock errors types
vi.mock('../../lib/errors/types', () => ({
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
}));

// Mock service configs  
vi.mock('../../lib/aws-resilience/service-configs', () => ({
  getServiceConfig: vi.fn(() => ({
    name: 'test-service',
    failureThreshold: 5,
    timeoutMs: 30000,
    resetTimeoutMs: 60000,
    halfOpenMaxCalls: 1,
    errorClassifier: vi.fn(() => 'RETRYABLE')
  }))
}));

// Mock circuit breaker types
vi.mock('../../lib/aws-resilience/types', () => ({
  CircuitState: {
    CLOSED: 'CLOSED',
    OPEN: 'OPEN',
    HALF_OPEN: 'HALF_OPEN'
  },
  ErrorType: {
    RETRYABLE: 'RETRYABLE',
    NON_RETRYABLE: 'NON_RETRYABLE'
  }
}));

describe('callWithRetry - simple debug test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should import the module without errors', async () => {
    const module = await import('../call-with-retry');
    expect(module.callWithRetry).toBeDefined();
    expect(typeof module.callWithRetry).toBe('function');
  });

  it('should execute a simple function', async () => {
    const { callWithRetry } = await import('../call-with-retry');
    const mockFn = vi.fn().mockResolvedValue('test-result');
    
    const result = await callWithRetry('test-service', mockFn);
    
    expect(result).toBe('test-result');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
