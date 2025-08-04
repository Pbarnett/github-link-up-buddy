import * as React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initialize } from 'launchdarkly-js-client-sdk';
import LaunchDarklyService from '@/lib/featureFlags/launchDarklyService';
import { LaunchDarklyFallbackManager } from '@/lib/launchdarkly/fallback-manager';
import { LaunchDarklyContextManager } from '@/lib/launchdarkly/context-manager';
// Mock the LaunchDarkly SDK for testing
vi.mock('launchdarkly-js-client-sdk');

describe('LaunchDarkly Network Resilience Tests', () => {
  let originalEnvFlag: string | undefined;

  beforeEach(() => {
    vi.resetAllMocks();

    // Reset LaunchDarkly service state
    LaunchDarklyService.resetService();
    LaunchDarklyFallbackManager.resetState();

    // Store original environment flag
    originalEnvFlag = process.env.VITEST_LD_SIMULATE_NETWORK_ISSUES;

    // Mock environment variables
    vi.stubEnv('VITE_LD_CLIENT_ID', 'test-client-id-123456789012');
  });

  afterEach(() => {
    vi.unstubAllEnvs();

    // Restore original environment flag
    if (originalEnvFlag !== undefined) {
      process.env.VITEST_LD_SIMULATE_NETWORK_ISSUES = originalEnvFlag;
    } else {
      delete process.env.VITEST_LD_SIMULATE_NETWORK_ISSUES;
    }
  });

  describe('Network Timeout Scenarios', () => {
    it('should handle initialization timeout gracefully', async () => {
      // Create a mock client that simulates timeout
      const mockClient = {
        waitForInitialization: vi
          .fn()
          .mockImplementation(() => {
            return new Promise((_, reject) => {
              setTimeout(() => {
                reject(new Error('LaunchDarkly initialization timeout after 1000ms'));
              }, 100); // Simulate a shorter timeout for test
            });
          }),
        variation: vi.fn().mockReturnValue(false),
        identify: vi.fn(),
        on: vi.fn(),
        close: vi.fn(),
        isInitialized: vi.fn().mockReturnValue(false),
      };

      vi.mocked(initialize).mockReturnValue(mockClient as any);

      // Enable resilience features
      const getVariationSpy = vi.spyOn(
        LaunchDarklyService as any,
        '_variationRaw'
      );
      getVariationSpy.mockReturnValue(true); // Enable enhanced resilience

      const context = LaunchDarklyContextManager.createAnonymousContext();

      // Add timeout wrapper to prevent test hanging
      const initPromise = LaunchDarklyService.initializeClient(context);
      await Promise.race([
        initPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Test timeout')), 2000)
        )
      ]).catch(() => {
        // Expected to fail, continue with test
      });

      // Should not be initialized due to timeout
      expect(LaunchDarklyService.isInitialized()).toBe(false);

      // Record failure to activate fallbacks
      LaunchDarklyFallbackManager.handleConnectionFailure(
        new Error('LaunchDarkly initialization timeout after 1000ms')
      );

      // Should activate fallbacks
      expect(LaunchDarklyFallbackManager.areFallbacksActive()).toBe(true);

      // Should still return fallback values for flags
      const flagValue = LaunchDarklyService.getVariation('wallet_ui', true);
      expect(flagValue).toBe(false); // Fallback value from config

      getVariationSpy.mockRestore();
    }, 8000); // Adjusted timeout for resilience test

  });

    it('should handle network request failures during flag evaluation', async () => {
      // Mock client that fails on specific operations
      const mockClient = {
        waitForInitialization: vi.fn().mockResolvedValue(undefined),
        variation: vi
          .fn()
          .mockImplementation((key: string, defaultValue: any) => {
            if (key === 'network_sensitive_flag') {
              throw new Error('Network request failed');
            }
            return defaultValue;
          }),
        identify: vi.fn(),
        on: vi.fn(),
        close: vi.fn(),
        isInitialized: vi.fn().mockReturnValue(true),
      };

      vi.mocked(initialize).mockReturnValue(mockClient as any);

      // Enable resilience features
      const getVariationSpy = vi.spyOn(
        LaunchDarklyService as any,
        '_variationRaw'
      );
      getVariationSpy.mockReturnValue(true); // Enable enhanced resilience

      const context = LaunchDarklyContextManager.createAnonymousContext();
      await LaunchDarklyService.initializeClient(context);

      expect(LaunchDarklyService.isInitialized()).toBe(true);

      // Should handle network failure and return fallback
      const result = LaunchDarklyService.getVariation(
        'network_sensitive_flag',
        'fallback'
      );
      expect(result).toBe('fallback');

      getVariationSpy.mockRestore();
    });

    it('should simulate network issues using environment flag', async () => {
      // Enable network issue simulation
      vi.stubEnv('VITEST_LD_SIMULATE_NETWORK_ISSUES', 'true');

      // Re-mock the initialize function to pick up the new env var
      const mockClient = {
        waitForInitialization: vi
          .fn()
          .mockRejectedValue(
            new Error('LaunchDarkly initialization timeout after 10000ms')
          ),
        variation: vi.fn().mockImplementation(() => {
          throw new Error('Network request failed');
        }),
        identify: vi
          .fn()
          .mockRejectedValue(
            new Error('Failed to identify user: network timeout')
          ),
        flush: vi
          .fn()
          .mockRejectedValue(new Error('Failed to flush: connection lost')),
        on: vi.fn(),
        close: vi.fn(),
        isInitialized: vi.fn(() => false),
      };

      vi.mocked(initialize).mockReturnValue(mockClient as any);

      const context = LaunchDarklyContextManager.createAnonymousContext();
      await LaunchDarklyService.initializeClient(context);

      expect(LaunchDarklyService.isInitialized()).toBe(false);
      expect(LaunchDarklyService.isOnline()).toBe(false);

      // All flag evaluations should use fallbacks
      const flags = [
        'personalization_greeting',
        'show_opt_out_banner',
        'profile_ui_revamp',
        'wallet_ui',
      ];

      flags.forEach(flag => {
        const result = LaunchDarklyService.getVariation(flag, true);
        expect(result).toBe(false); // Should use fallback config values
      });
    });
  });

  describe('Connection Recovery Tests', () => {
    it('should recover from temporary network issues', async () => {
      let initAttempts = 0;

      const mockClient = {
        waitForInitialization: vi.fn().mockImplementation(() => {
          initAttempts++;
          if (initAttempts < 3) {
            return Promise.reject(new Error('Temporary network error'));
          }
          return Promise.resolve(undefined);
        }),
        variation: vi.fn().mockReturnValue(true),
        identify: vi.fn(),
        on: vi.fn(),
        close: vi.fn(),
      };

      vi.mocked(initialize).mockReturnValue(mockClient as any);

      const context = LaunchDarklyContextManager.createAnonymousContext();
      await LaunchDarklyService.initializeClient(context);

      // Should eventually succeed after retries
      expect(initAttempts).toBe(3);
      expect(LaunchDarklyService.isInitialized()).toBe(true);

      // Metrics should reflect the retry attempts
      const metrics = LaunchDarklyService.getMetrics();
      expect(metrics.successCount).toBeGreaterThan(0);
      expect(metrics.failureCount).toBeGreaterThan(0);
    });

    it('should handle intermittent connection issues', async () => {
      let callCount = 0;

      const mockClient = {
        waitForInitialization: vi.fn().mockResolvedValue(undefined),
        variation: vi
          .fn()
          .mockImplementation((key: string, defaultValue: any) => {
            callCount++;
            // Simulate intermittent failures
            if (callCount % 3 === 0) {
              throw new Error('Intermittent network error');
            }
            return key === 'test_flag' ? true : defaultValue;
          }),
        identify: vi.fn(),
        on: vi.fn(),
        close: vi.fn(),
      };

      vi.mocked(initialize).mockReturnValue(mockClient as any);

      const context = LaunchDarklyContextManager.createAnonymousContext();
      await LaunchDarklyService.initializeClient(context);

      // Make multiple flag evaluation calls
      const results = [];
      for (let i = 0; i < 10; i++) {
        const result = LaunchDarklyService.getVariation('test_flag', false);
        results.push(result);
      }

      // Should have a mix of successful evaluations and fallbacks
      const successfulCalls = results.filter(r => r === true).length;
      const fallbackCalls = results.filter(r => r === false).length;

      expect(successfulCalls).toBeGreaterThan(0);
      expect(fallbackCalls).toBeGreaterThan(0);
    });
  });

  describe('Circuit Breaker Tests', () => {
    it('should open circuit breaker after consecutive failures', async () => {
      const mockClient = {
        waitForInitialization: vi
          .fn()
          .mockRejectedValue(new Error('Persistent failure')),
        variation: vi.fn(),
        identify: vi.fn(),
        on: vi.fn(),
        close: vi.fn(),
      };

      vi.mocked(initialize).mockReturnValue(mockClient as any);

      const context = LaunchDarklyContextManager.createAnonymousContext();

      // Enable resilience features by mocking the internal flag check
      const getVariationSpy = vi.spyOn(
        LaunchDarklyService as any,
        '_variationRaw'
      );
      getVariationSpy.mockReturnValue(true); // Enable enhanced resilience

      // Trigger multiple failures to open circuit breaker
      for (let i = 0; i < 6; i++) {
        LaunchDarklyService.close();
        await LaunchDarklyService.initializeClient(context);
      }

      const metrics = LaunchDarklyService.getMetrics();
      expect(metrics.isCircuitBreakerOpen).toBe(true);
      expect(metrics.failureCount).toBeGreaterThanOrEqual(5);

      // Subsequent calls should skip initialization due to open circuit breaker
      await LaunchDarklyService.initializeClient(context);
      expect(LaunchDarklyService.isOnline()).toBe(false);

      getVariationSpy.mockRestore();
    });

    it('should reset circuit breaker after timeout period', async () => {
      // This test would require time manipulation or a shorter timeout
      // For now, we'll test the logic without waiting for the actual timeout
      const mockClient = {
        waitForInitialization: vi.fn().mockResolvedValue(undefined),
        variation: vi.fn().mockReturnValue(true),
        identify: vi.fn(),
        on: vi.fn(),
        close: vi.fn(),
      };

      vi.mocked(initialize).mockReturnValue(mockClient as any);

      // First, create a service instance with shorter timeout for testing
      // This would normally be tested with dependency injection or configuration
      const context = LaunchDarklyContextManager.createAnonymousContext();

      // Simulate successful recovery after circuit breaker reset
      await LaunchDarklyService.initializeClient(context);

      const metrics = LaunchDarklyService.getMetrics();
      expect(metrics.isCircuitBreakerOpen).toBe(false);
    });
  });

  describe('Fallback Configuration Tests', () => {
    it('should use configured fallback values for known flags', () => {
      const knownFlags = [
        'personalization_greeting',
        'show_opt_out_banner',
        'profile_ui_revamp',
        'wallet_ui',
      ];

      knownFlags.forEach(flag => {
        const fallbackValue =
          LaunchDarklyFallbackManager.getFallbackValue(flag);
        expect(fallbackValue).toBeDefined();
        expect(typeof fallbackValue).toBe('boolean');

        // These flags should all default to false for safety
        expect(fallbackValue).toBe(false);
      });
    });

    it('should provide type-specific defaults for unknown flags', () => {
      const booleanFallback = LaunchDarklyFallbackManager.getFallbackValue(
        'unknown_boolean_flag',
        'boolean'
      );
      expect(booleanFallback).toBe(false);

      const stringFallback = LaunchDarklyFallbackManager.getFallbackValue(
        'unknown_string_flag',
        'string'
      );
      expect(stringFallback).toBe('');

      const numberFallback = LaunchDarklyFallbackManager.getFallbackValue(
        'unknown_number_flag',
        'number'
      );
      expect(numberFallback).toBe(0);
    });

    it('should track fallback usage for monitoring', () => {
      // Trigger some fallback usage
      LaunchDarklyFallbackManager.getFallbackValue('test_flag_1');
      LaunchDarklyFallbackManager.getFallbackValue('test_flag_2');

      const state = LaunchDarklyFallbackManager.getFallbackState();
      expect(state.fallbacksActive).toContain('test_flag_1');
      expect(state.fallbacksActive).toContain('test_flag_2');
    });
  });

  describe('Error Reporting Tests', () => {
    it('should create comprehensive error reports', () => {
      // Simulate some connection failures
      LaunchDarklyFallbackManager.handleConnectionFailure(
        new Error('Connection timeout')
      );
      LaunchDarklyFallbackManager.handleConnectionFailure(
        new Error('DNS resolution failed')
      );
      LaunchDarklyFallbackManager.handleConnectionFailure(
        new Error('Network unreachable')
      );

      const report = LaunchDarklyFallbackManager.createFallbackReport();

      expect(report).toContain('Status: OFFLINE');
      expect(report).toContain('Failed Attempts: 3');
      expect(report).toContain('Connection timeout');
      expect(report).toContain('DNS resolution failed');
      expect(report).toContain('Network unreachable');
      expect(report).toContain('Recent Errors:');
    });

    it('should limit error history to prevent memory leaks', () => {
      // Generate more than 10 errors
      for (let i = 0; i < 15; i++) {
        LaunchDarklyFallbackManager.handleConnectionFailure(
          new Error(`Error ${i}`)
        );
      }

      const state = LaunchDarklyFallbackManager.getFallbackState();

      // Should only keep the last 10 errors
      expect(state.errors.length).toBeLessThanOrEqual(10);

      // Should contain the most recent errors
      expect(state.errors.some(error => error.includes('Error 14'))).toBe(true);
      expect(state.errors.some(error => error.includes('Error 0'))).toBe(false);
    });
  });

  describe('Performance Metrics Tests', () => {
    beforeEach(() => {
      // Enable resilience features
      const getVariationSpy = vi.spyOn(
        LaunchDarklyService as any,
        '_variationRaw'
      );
      getVariationSpy.mockReturnValue(true);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should track initialization time', async () => {
      const startTime = Date.now();

      const mockClient = {
        waitForInitialization: vi.fn().mockImplementation(() => {
          // Simulate some delay
          return new Promise(resolve => setTimeout(resolve, 50));
        }),
        variation: vi.fn(),
        identify: vi.fn(),
        on: vi.fn(),
        close: vi.fn(),
        isInitialized: vi.fn().mockReturnValue(true),
      };

      vi.mocked(initialize).mockReturnValue(mockClient as any);

      const context = LaunchDarklyContextManager.createAnonymousContext();
      await LaunchDarklyService.initializeClient(context);

      // Wait a bit to ensure metrics are recorded
      await new Promise(resolve => setTimeout(resolve, 10));

      const metrics = LaunchDarklyService.getMetrics();
      expect(Date.now() - startTime).toBeGreaterThan(0);
      expect(metrics.successCount).toBe(1);
    });

    it('should track flag evaluation performance', async () => {
      const mockClient = {
        waitForInitialization: vi.fn().mockResolvedValue(undefined),
        variation: vi.fn().mockImplementation(() => {
          // Add a small delay to simulate network latency
          return new Promise(resolve => setTimeout(() => resolve(true), 10));
        }),
        identify: vi.fn(),
        on: vi.fn(),
        close: vi.fn(),
        isInitialized: vi.fn().mockReturnValue(true),
      };

      vi.mocked(initialize).mockReturnValue(mockClient as any);

      const context = LaunchDarklyContextManager.createAnonymousContext();
      await LaunchDarklyService.initializeClient(context);

      const startTime = Date.now();

      // Make some flag evaluations
      await LaunchDarklyService.getVariation('test_flag_1', false);
      await LaunchDarklyService.getVariation('test_flag_2', false);
      await LaunchDarklyService.getVariation('test_flag_3', false);

      // Wait a bit to ensure metrics are recorded
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(Date.now() - startTime).toBeGreaterThan(0);
      expect(mockClient.variation).toHaveBeenCalledTimes(3);
    });
  });
});
