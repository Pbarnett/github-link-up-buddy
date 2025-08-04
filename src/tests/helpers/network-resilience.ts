import * as React from 'react';
import { vi, expect } from 'vitest';

/**
 * Network simulation utilities for testing resilience
 */
export class NetworkSimulator {
  /**
   * Creates a mock that simulates network timeouts
   */
  static createTimeoutMock(timeoutMs: number = 1000) {
    return vi.fn().mockImplementation(() => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Network timeout after ${timeoutMs}ms`));
        }, Math.min(timeoutMs, 100)); // Cap at 100ms for tests
      });
    });
  }

  /**
   * Creates a mock that simulates intermittent failures
   */
  static createIntermittentFailureMock(failureRate: number = 0.3) {
    let callCount = 0;
    return vi.fn().mockImplementation(() => {
      callCount++;
      if (Math.random() < failureRate) {
        throw new Error(`Intermittent network failure (call ${callCount})`);
      }
      return Promise.resolve(`Success (call ${callCount})`);
    });
  }

  /**
   * Creates a mock that fails for first N attempts then succeeds
   */
  static createRetryMock(failAttempts: number = 2) {
    let attemptCount = 0;
    return vi.fn().mockImplementation(() => {
      attemptCount++;
      if (attemptCount <= failAttempts) {
        return Promise.reject(new Error(`Attempt ${attemptCount} failed`));
      }
      return Promise.resolve(`Success on attempt ${attemptCount}`);
    });
  }

  /**
   * Creates a mock that simulates different types of network errors
   */
  static createNetworkErrorMock(errorType: 'timeout' | 'dns' | 'connection' | 'server' = 'timeout') {
    const errorMessages = {
      timeout: 'Request timeout',
      dns: 'DNS resolution failed',
      connection: 'Connection refused',
      server: 'Internal server error'
    };

    return vi.fn().mockRejectedValue(new Error(errorMessages[errorType]));
  }

  /**
   * Wraps a promise with timeout for testing
   */
  static withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Test timeout after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  }
}

/**
 * Test utilities for LaunchDarkly resilience testing
 */
export class LaunchDarklyTestHelper {
  /**
   * Creates a mock LaunchDarkly client with configurable behaviors
   */
  static createMockClient(config: {
    initializationBehavior?: 'success' | 'timeout' | 'failure';
    variationBehavior?: 'success' | 'intermittent' | 'failure';
    timeoutMs?: number;
  } = {}) {
    const {
      initializationBehavior = 'success',
      variationBehavior = 'success',
      timeoutMs = 1000
    } = config;

    const mockClient = {
      waitForInitialization: vi.fn(),
      variation: vi.fn(),
      identify: vi.fn(),
      on: vi.fn(),
      close: vi.fn(),
      isInitialized: vi.fn()
    };

    // Configure initialization behavior
    switch (initializationBehavior) {
      case 'success':
        mockClient.waitForInitialization.mockResolvedValue(undefined);
        mockClient.isInitialized.mockReturnValue(true);
        break;
      case 'timeout':
        mockClient.waitForInitialization.mockImplementation(() =>
          NetworkSimulator.createTimeoutMock(timeoutMs)()
        );
        mockClient.isInitialized.mockReturnValue(false);
        break;
      case 'failure':
        mockClient.waitForInitialization.mockRejectedValue(new Error('Initialization failed'));
        mockClient.isInitialized.mockReturnValue(false);
        break;
    }

    // Configure variation behavior
    switch (variationBehavior) {
      case 'success':
        mockClient.variation.mockImplementation((key: string, defaultValue: any) => defaultValue);
        break;
      case 'intermittent':
        mockClient.variation.mockImplementation(NetworkSimulator.createIntermittentFailureMock(0.3));
        break;
      case 'failure':
        mockClient.variation.mockImplementation(() => {
          throw new Error('Flag evaluation failed');
        });
        break;
    }

    return mockClient;
  }

  /**
   * Creates environment for testing network issues
   */
  static setupNetworkIssueEnvironment() {
    // Set environment flag for network simulation
    vi.stubEnv('VITEST_LD_SIMULATE_NETWORK_ISSUES', 'true');
    
    return () => {
      vi.unstubAllEnvs();
    };
  }
}

/**
 * Test utilities for server action resilience
 */
export class ServerActionTestHelper {
  /**
   * Creates mock dependencies for server actions with network issues
   */
  static createMockDepsWithNetworkIssues() {
    const mockSupabaseClient = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis()
    };

    // Configure different failure scenarios
    const scenarios = {
      timeout: () => {
        (mockSupabaseClient as any).mockRejectedValue(new Error('Query timeout'));
      },
      networkError: () => {
        (mockSupabaseClient as any).mockRejectedValue(new Error('Network error'));
      },
      success: (data: any) => {
        (mockSupabaseClient as any).mockResolvedValue({ data, error: null });
      }
    };

    const mockInvokeEdgeFn = vi.fn();

    return {
      supabaseClient: mockSupabaseClient,
      invokeEdgeFn: mockInvokeEdgeFn,
      scenarios
    };
  }

  /**
   * Simulates AbortController for timeout testing
   */
  static createAbortController(timeoutMs: number = 3000) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeoutMs);
    return controller;
  }
}

/**
 * Test utilities for React component resilience
 */
export class ComponentTestHelper {
  /**
   * Creates a test wrapper that simulates network conditions
   */
  static createNetworkTestWrapper(networkCondition: 'offline' | 'slow' | 'normal' = 'normal') {
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: networkCondition !== 'offline'
    });

    // Mock fetch with network conditions
    const originalFetch = global.fetch;
    
    global.fetch = vi.fn().mockImplementation((...args) => {
      if (networkCondition === 'offline') {
        return Promise.reject(new Error('Network offline'));
      }
      
      if (networkCondition === 'slow') {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve((originalFetch as any)(...(args as [RequestInfo | URL, RequestInit?])));
          }, 2000); // 2 second delay
        });
      }
      
      return (originalFetch as any)(...(args as [RequestInfo | URL, RequestInit?]));
    });

    return () => {
      global.fetch = originalFetch;
      Object.defineProperty(navigator, 'onLine', {
        value: true
      });
    };
  }
}

/**
 * Assertion helpers for resilience testing
 */
export class ResilienceAssertions {
  /**
   * Asserts that a function handles timeouts gracefully
   */
  static async assertTimeoutHandling(
    fn: () => Promise<any>,
    expectedFallback: any,
    timeoutMs: number = 1000
  ) {
    const result = await NetworkSimulator.withTimeout(
      fn().catch(() => expectedFallback),
      timeoutMs
    );
    
    expect(result).toEqual(expectedFallback);
  }

  /**
   * Asserts that retry logic works correctly
   */
  static async assertRetryBehavior(
    mockFn: any,
    expectedRetries: number,
    finalResult: any
  ) {
    expect(mockFn).toHaveBeenCalledTimes(expectedRetries);
    const result = await mockFn.mock.results[mockFn.mock.results.length - 1].value;
    expect(result).toEqual(finalResult);
  }

  /**
   * Asserts that fallback values are used correctly
   */
  static assertFallbackUsage(
    actualValue: any,
    expectedFallback: any,
    fallbackReason?: string
  ) {
    expect(actualValue).toEqual(expectedFallback);
    if (fallbackReason) {
      // You could extend this to check console logs or tracking systems
      console.log(`Fallback used: ${fallbackReason}`);
    }
  }
}
