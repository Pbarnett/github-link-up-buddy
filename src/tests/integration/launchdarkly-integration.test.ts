import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initialize } from 'launchdarkly-js-client-sdk';
import LaunchDarklyService from '@/lib/featureFlags/launchDarklyService';
import { LaunchDarklyFallbackManager } from '@/lib/launchdarkly/fallback-manager';
import { LaunchDarklyContextManager } from '@/lib/launchdarkly/context-manager';

// Mock the LaunchDarkly SDK for testing
vi.mock('launchdarkly-js-client-sdk');

describe('LaunchDarkly Integration Tests', () => {
  const mockClient = {
    waitForInitialization: vi.fn(),
    variation: vi.fn(),
    identify: vi.fn(),
    on: vi.fn(),
    close: vi.fn()
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(initialize).mockReturnValue(mockClient as any);
    
    // Reset LaunchDarkly service state
    LaunchDarklyService.resetService();
    LaunchDarklyFallbackManager.resetState();
    
    // Mock environment variables
    vi.stubEnv('VITE_LD_CLIENT_ID', 'test-client-id-123456789012');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('Service Initialization', () => {
    it('should initialize successfully with valid configuration', async () => {
      mockClient.waitForInitialization.mockResolvedValue(undefined);
      
      const context = LaunchDarklyContextManager.createAnonymousContext();
      await LaunchDarklyService.initializeClient(context);
      
      expect(initialize).toHaveBeenCalledWith('test-client-id-123456789012', context);
      expect(mockClient.waitForInitialization).toHaveBeenCalled();
      expect(LaunchDarklyService.isInitialized()).toBe(true);
    });

    it('should handle initialization timeout gracefully', async () => {
      const timeoutError = new Error('LaunchDarkly initialization timeout after 10000ms');
      mockClient.waitForInitialization.mockRejectedValue(timeoutError);
      
      const context = LaunchDarklyContextManager.createAnonymousContext();
      await LaunchDarklyService.initializeClient(context);
      
      // Should fallback gracefully
      expect(LaunchDarklyService.isInitialized()).toBe(false);
      expect(LaunchDarklyFallbackManager.areFallbacksActive()).toBe(true);
    });

    it('should handle network connectivity issues', async () => {
      const networkError = new Error('Network request failed');
      mockClient.waitForInitialization.mockRejectedValue(networkError);
      
      const context = LaunchDarklyContextManager.createAnonymousContext();
      await LaunchDarklyService.initializeClient(context);
      
      // Should record failure and activate offline mode
      expect(LaunchDarklyService.isOnline()).toBe(false);
      
      const metrics = LaunchDarklyService.getMetrics();
      expect(metrics.failureCount).toBeGreaterThan(0);
    });
  });

  describe('Feature Flag Evaluation', () => {
    beforeEach(async () => {
      mockClient.waitForInitialization.mockResolvedValue(undefined);
      const context = LaunchDarklyContextManager.createAnonymousContext();
      await LaunchDarklyService.initializeClient(context);
    });

    it('should return correct flag values when online', () => {
      mockClient.variation.mockReturnValue(true);
      
      const result = LaunchDarklyService.getVariation('profile_ui_revamp', false);
      
      expect(result).toBe(true);
      expect(mockClient.variation).toHaveBeenCalledWith('profile_ui_revamp', false);
    });

    it('should use fallback values when offline', () => {
      // Simulate offline state
      LaunchDarklyFallbackManager.handleConnectionFailure(new Error('Connection lost'));
      
      const result = LaunchDarklyService.getVariation('profile_ui_revamp', false);
      
      // Should return fallback value (false for profile_ui_revamp)
      expect(result).toBe(false);
    });

    it('should handle circuit breaker activation', () => {
      // Simulate multiple failures to trigger circuit breaker
      for (let i = 0; i < 6; i++) {
        LaunchDarklyFallbackManager.handleConnectionFailure(new Error('Connection failed'));
      }
      
      const metrics = LaunchDarklyService.getMetrics();
      expect(metrics.isCircuitBreakerOpen).toBe(true);
      
      // Should use fallback values when circuit breaker is open
      const result = LaunchDarklyService.getVariation('wallet_ui', false);
      expect(result).toBe(false); // Fallback value
    });
  });

  describe('Context Management', () => {
    it('should create valid anonymous context', () => {
      const context = LaunchDarklyContextManager.createAnonymousContext();
      
      expect(context.kind).toBe('user');
      expect(context.key).toMatch(/^anonymous-\d+-[a-z0-9]+$/);
      expect(context.anonymous).toBe(true);
    });

    it('should create valid user context from attributes', () => {
      const userAttributes = {
        userId: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        subscription: 'premium' as const
      };
      
      const context = LaunchDarklyContextManager.createContext(userAttributes);
      
      expect(context.kind).toBe('user');
      expect(context.key).toBe('user-123');
      expect(context.email).toBe('test@example.com');
      expect(context.name).toBe('Test User');
      expect(context.subscription).toBe('premium');
    });

    it('should update context on authentication', async () => {
      mockClient.waitForInitialization.mockResolvedValue(undefined);
      mockClient.identify.mockResolvedValue(undefined);
      
      const initialContext = LaunchDarklyContextManager.createAnonymousContext();
      await LaunchDarklyService.initializeClient(initialContext);
      
      const userAttributes = {
        userId: 'user-123',
        email: 'test@example.com',
        name: 'Test User'
      };
      
      const newContext = LaunchDarklyContextManager.createContext(userAttributes);
      await LaunchDarklyService.updateContext(newContext);
      
      expect(mockClient.identify).toHaveBeenCalledWith(newContext);
    });

    it('should sanitize sensitive information from context', () => {
      const unsafeContext = {
        kind: 'user' as const,
        key: 'user-123',
        email: 'test@example.com',
        password: 'secret123',
        token: 'jwt-token',
        creditCard: '4111111111111111'
      };
      
      const sanitized = LaunchDarklyContextManager.sanitizeContext(unsafeContext);
      
      expect(sanitized.email).toBe('test@example.com');
      expect(sanitized.password).toBeUndefined();
      expect(sanitized.token).toBeUndefined();
      expect(sanitized.creditCard).toBeUndefined();
    });
  });

  describe('Resilience Features', () => {
    it('should retry failed operations with exponential backoff', async () => {
      let attempts = 0;
      mockClient.waitForInitialization.mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          return Promise.reject(new Error('Connection failed'));
        }
        return Promise.resolve(undefined);
      });
      
      const context = LaunchDarklyContextManager.createAnonymousContext();
      await LaunchDarklyService.initializeClient(context);
      
      expect(attempts).toBe(3);
      expect(LaunchDarklyService.isInitialized()).toBe(true);
    });

    it('should track performance metrics', async () => {
      mockClient.waitForInitialization.mockResolvedValue(undefined);
      
      const startTime = performance.now();
      const context = LaunchDarklyContextManager.createAnonymousContext();
      await LaunchDarklyService.initializeClient(context);
      
      const metrics = LaunchDarklyService.getMetrics();
      expect(metrics.initializationTime).toBeGreaterThan(0);
      expect(metrics.successCount).toBe(1);
      expect(metrics.failureCount).toBe(0);
    });

    it('should handle flag evaluation timeout', () => {
      // Mock a slow flag evaluation
      mockClient.variation.mockImplementation(() => {
        return new Promise(resolve => setTimeout(() => resolve(true), 6000));
      });
      
      const result = LaunchDarklyService.getVariation('slow_flag', false);
      
      // Should return default value due to timeout handling in service
      expect(result).toBe(false);
    });
  });

  describe('Developer Experience', () => {
    it('should support localStorage overrides in development', () => {
      vi.stubEnv('NODE_ENV', 'development');
      
      // Mock localStorage
      const mockLocalStorage = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn()
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true
      });
      
      mockLocalStorage.getItem.mockReturnValue('true');
      
      const result = LaunchDarklyService.getVariation('test_flag', false);
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('launchDarkly_override_test_flag');
      expect(result).toBe(true);
    });

    it('should provide developer override utilities', () => {
      const mockLocalStorage = {
        setItem: vi.fn(),
        removeItem: vi.fn(),
        getItem: vi.fn()
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true
      });
      
      LaunchDarklyService.setDeveloperOverride('test_flag', true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'launchDarkly_override_test_flag',
        'true'
      );
      
      LaunchDarklyService.clearDeveloperOverride('test_flag');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        'launchDarkly_override_test_flag'
      );
    });
  });

  describe('Known Feature Flags Integration', () => {
    const KNOWN_FLAGS = [
      'personalization_greeting',
      'show_opt_out_banner',
      'profile_ui_revamp', 
      'wallet_ui'
    ];

    beforeEach(async () => {
      mockClient.waitForInitialization.mockResolvedValue(undefined);
      const context = LaunchDarklyContextManager.createAnonymousContext();
      await LaunchDarklyService.initializeClient(context);
    });

    it('should have proper fallback values for all known flags', () => {
      KNOWN_FLAGS.forEach(flagKey => {
        const fallbackValue = LaunchDarklyFallbackManager.getFallbackValue(flagKey);
        expect(fallbackValue).toBeDefined();
        expect(typeof fallbackValue).toBe('boolean');
      });
    });

    it('should evaluate all known flags without errors', () => {
      mockClient.variation.mockReturnValue(false);
      
      KNOWN_FLAGS.forEach(flagKey => {
        expect(() => {
          const result = LaunchDarklyService.getVariation(flagKey, false);
          expect(typeof result).toBe('boolean');
        }).not.toThrow();
      });
    });

    it('should handle flag changes for known flags', () => {
      const callback = vi.fn();
      
      KNOWN_FLAGS.forEach(flagKey => {
        LaunchDarklyService.onFlagChange(flagKey, callback);
        expect(mockClient.on).toHaveBeenCalledWith(`change:${flagKey}`, callback);
      });
    });
  });

  describe('Error Recovery', () => {
    it('should recover from temporary network issues', async () => {
      // Initial failure
      mockClient.waitForInitialization.mockRejectedValueOnce(new Error('Network error'));
      
      const context = LaunchDarklyContextManager.createAnonymousContext();
      await LaunchDarklyService.initializeClient(context);
      
      expect(LaunchDarklyService.isOnline()).toBe(false);
      
      // Simulate successful reconnection
      LaunchDarklyFallbackManager.handleConnectionSuccess();
      
      expect(LaunchDarklyFallbackManager.areFallbacksActive()).toBe(false);
    });

    it('should provide comprehensive error reporting', () => {
      // Generate some errors
      LaunchDarklyFallbackManager.handleConnectionFailure(new Error('Error 1'));
      LaunchDarklyFallbackManager.handleConnectionFailure(new Error('Error 2'));
      
      const report = LaunchDarklyFallbackManager.createFallbackReport();
      
      expect(report).toContain('Status: OFFLINE');
      expect(report).toContain('Failed Attempts: 2');
      expect(report).toContain('Error 1');
      expect(report).toContain('Error 2');
    });
  });
});
