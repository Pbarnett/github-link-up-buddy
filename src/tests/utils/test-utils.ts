import { vi, type MockedFunction, expect } from 'vitest'

/**
 * Modern Vitest utilities for enhanced testing experience (non-JSX)
 */

// Enhanced mock utilities using Vitest's improved mocking
export const mockUtils = {
  /**
   * Create a deep mock with Vitest's latest features
   */
  createDeepMock: <T extends Record<string, any>>(obj: T): MockedFunction<T> => {
    const mock = vi.fn() as MockedFunction<T>
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'function') {
        mock[key] = vi.fn(obj[key])
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        mock[key] = mockUtils.createDeepMock(obj[key])
      } else {
        mock[key] = obj[key]
      }
    })
    return mock
  },

  /**
   * Create a partial mock with type safety
   */
  createPartialMock: <T>(overrides: Partial<T> = {}): T => {
    return overrides as T
  },

  /**
   * Mock a module with automatic cleanup
   */
  mockModuleWithCleanup: (moduleName: string, mockImplementation: any) => {
    vi.doMock(moduleName, () => mockImplementation)
    return () => vi.doUnmock(moduleName)
  }
}

// Modern async utilities
export const asyncUtils = {
  /**
   * Wait for all pending promises with timeout
   */
  waitForPromises: (timeout = 1000): Promise<void> => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error('Timeout waiting for promises')), timeout)
      queueMicrotask(() => {
        clearTimeout(timeoutId)
        resolve()
      })
    })
  },

  /**
   * Advanced timer utilities
   */
  advanceTimers: async (ms: number) => {
    vi.advanceTimersByTime(ms)
    await asyncUtils.waitForPromises()
  },

  /**
   * Run all timers and wait for promises
   */
  runAllTimersAndWait: async () => {
    vi.runAllTimers()
    await asyncUtils.waitForPromises()
  }
}

// Modern assertion utilities
export const assertionUtils = {
  /**
   * Assert that a function was called with specific partial arguments
   */
  toHaveBeenCalledWithPartial: <T extends any[]>(
    mockFn: MockedFunction<(...args: T) => any>,
    expectedArgs: Partial<T>
  ) => {
    const calls = mockFn.mock.calls
    const matchingCall = calls.find(call => 
      Object.keys(expectedArgs).every(key => 
        call[key as any] === expectedArgs[key as any]
      )
    )
    return !!matchingCall
  },

  /**
   * Assert that an async function resolves/rejects as expected
   */
  expectAsyncResult: async <T>(
    promise: Promise<T>,
    expected: { resolves?: T; rejects?: any }
  ) => {
    if (expected.resolves !== undefined) {
      await expect(promise).resolves.toEqual(expected.resolves)
    }
    if (expected.rejects !== undefined) {
      await expect(promise).rejects.toEqual(expected.rejects)
    }
  }
}

// Performance testing utilities
export const performanceUtils = {
  /**
   * Measure execution time of a function
   */
  measureTime: async <T>(fn: () => T | Promise<T>): Promise<{ result: T; duration: number }> => {
    const start = performance.now()
    const result = await fn()
    const duration = performance.now() - start
    return { result, duration }
  },

  /**
   * Assert that a function completes within a time limit
   */
  expectWithinTime: async <T>(
    fn: () => T | Promise<T>,
    maxDuration: number
  ): Promise<T> => {
    const { result, duration } = await performanceUtils.measureTime(fn)
    expect(duration).toBeLessThan(maxDuration)
    return result
  }
}

// Enhanced cleanup utilities
export const cleanupUtils = {
  /**
   * Comprehensive test cleanup
   */
  cleanupTest: () => {
    // Clear all mocks
    vi.clearAllMocks()
    
    // Reset all modules
    vi.resetAllMocks()
    
    // Clear timers
    vi.clearAllTimers()
    vi.useRealTimers()
    
    // Clear storage
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear()
    }
    
    // Unstub globals
    vi.unstubAllGlobals()
  },

  /**
   * Setup automatic cleanup
   */
  setupAutoCleanup: () => {
    afterEach(() => {
      cleanupUtils.cleanupTest()
    })
  }
}

// Modern snapshot utilities
export const snapshotUtils = {
  /**
   * Create inline snapshots with better formatting
   */
  expectInlineSnapshot: (value: any) => {
    expect(value).toMatchInlineSnapshot()
  },

  /**
   * Create custom snapshot serializers
   */
  createCustomSerializer: (name: string, test: (val: any) => boolean, serialize: (val: any) => string) => {
    expect.addSnapshotSerializer({
      test,
      serialize: (val, config, indentation, depth) => serialize(val)
    })
  }
}

// Export all utilities as a single object for easy importing
export const vitestUtils = {
  mock: mockUtils,
  async: asyncUtils,
  assert: assertionUtils,
  performance: performanceUtils,
  cleanup: cleanupUtils,
  snapshot: snapshotUtils
}

export default vitestUtils
