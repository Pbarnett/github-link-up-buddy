

import LaunchDarklyService from '../launchDarklyService';
import LaunchDarklyService from '../launchDarklyService'; } from '../../../types/launchDarkly';

// Mock the LaunchDarkly SDK
vi.mock('launchdarkly-js-client-sdk', () => ({
  initialize: vi.fn(),
}));

// Mock performance.now
Object.defineProperty(global, 'performance', {
  value: { now: vi.fn(() => Date.now()) },
});

// Mock localStorage globally
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    keys: vi.fn(() => []),
  },
  writable: true,
});

// Mock window object
Object.defineProperty(global, 'window', {
  value: {
    localStorage: global.localStorage,
  },
  writable: true,
});

describe('LaunchDarklyService', () => {
  let mockClient: Partial<LDClient>;
  let mockContext: LDContext;
  let originalEnv: string | undefined;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock environment variable
    originalEnv = import.meta.env.VITE_LD_CLIENT_ID;
    import.meta.env.VITE_LD_CLIENT_ID = 'test-client-id';

    // Mock LaunchDarkly client
    mockClient = {
      waitForInitialization: vi.fn().mockResolvedValue(undefined),
      variation: vi.fn().mockReturnValue(false),
      identify: vi.fn().mockResolvedValue(undefined),
      on: vi.fn(),
      close: vi.fn(),
    };

    (initialize as any).mockReturnValue(mockClient);

    // Mock context
    mockContext = {
      kind: 'user',
      key: 'test-user-123',
      name: 'Test User',
    };

    // Reset service state completely
    LaunchDarklyService.resetService();
  });

  afterEach(() => {
    // Restore environment
    import.meta.env.VITE_LD_CLIENT_ID = originalEnv;

    // Clear localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      LaunchDarklyService.clearAllDeveloperOverrides();
    }
  });

  describe('Initialization', () => {
    it('should initialize successfully with resilience features disabled', async () => {
      // Test legacy initialization path
      await LaunchDarklyService.initializeClient(mockContext);

      expect(initialize).toHaveBeenCalledWith('test-client-id', mockContext);
      expect(mockClient.waitForInitialization).toHaveBeenCalled();
      expect(LaunchDarklyService.isInitialized()).toBe(true);
    });

    it('should initialize with resilience features enabled', async () => {
      // Mock resilience flag to return true
      const getVariationSpy = vi.spyOn(LaunchDarklyService, 'getVariation');
      getVariationSpy.mockReturnValue(true);

      await LaunchDarklyService.initializeClient(mockContext);

      expect(initialize).toHaveBeenCalledWith('test-client-id', mockContext);
      expect(mockClient.waitForInitialization).toHaveBeenCalled();
      expect(LaunchDarklyService.isInitialized()).toBe(true);

      getVariationSpy.mockRestore();
    });

    it('should handle initialization failure gracefully', async () => {
      const error = new Error('Network error');
      mockClient.waitForInitialization = vi.fn().mockRejectedValue(error);

      await LaunchDarklyService.initializeClient(mockContext);

      expect(LaunchDarklyService.isInitialized()).toBe(false);
      // In legacy mode, isOnline remains true even after failure
      expect(LaunchDarklyService.isOnline()).toBe(true);

      const state = LaunchDarklyService.getServiceState();
      expect(state.isOffline).toBe(false); // Legacy mode doesn't set offline
    });

    it('should not initialize if already initialized', async () => {
      // First initialization
      await LaunchDarklyService.initializeClient(mockContext);

      // Reset mock calls
      vi.clearAllMocks();

      // Second initialization should not call initialize again
      await LaunchDarklyService.initializeClient(mockContext);

      expect(initialize).not.toHaveBeenCalled();
    });

    it('should handle missing client ID', async () => {
      import.meta.env.VITE_LD_CLIENT_ID = undefined;

      await LaunchDarklyService.initializeClient(mockContext);

      // In legacy mode, it still calls initialize with 'undefined' client ID
      expect(initialize).toHaveBeenCalledWith('undefined', mockContext);
      expect(LaunchDarklyService.isInitialized()).toBe(true);
    });
  });

  describe('Flag Evaluation', () => {
    beforeEach(async () => {
      await LaunchDarklyService.initializeClient(mockContext);
    });

    it('should evaluate flags successfully', () => {
      mockClient.variation = vi.fn().mockReturnValue(true);

      const result = LaunchDarklyService.getVariation('test_flag', false);

      expect(result).toBe(true);
      expect(mockClient.variation).toHaveBeenCalledWith('test_flag', false);
    });

    it('should return default value when client is not initialized', () => {
      LaunchDarklyService.close();

      const result = LaunchDarklyService.getVariation('test_flag', 'default');

      expect(result).toBe('default');
    });

    it('should use fallback values when offline', async () => {
      // Force offline mode
      const error = new Error('Network error');
      mockClient.waitForInitialization = vi.fn().mockRejectedValue(error);

      await LaunchDarklyService.initializeClient(mockContext);

      const result = LaunchDarklyService.getVariation(
        'personalization_greeting',
        true
      );

      expect(result).toBe(false); // Should use fallback value from config
    });

    it('should handle personalization flag correctly', () => {
      mockClient.variation = vi.fn().mockReturnValue(true);

      const result = LaunchDarklyService.isPersonalizationEnabled();

      expect(result).toBe(true);
      expect(mockClient.variation).toHaveBeenCalledWith(
        'personalization_greeting',
        false
      );
    });

    it('should handle opt-out banner flag correctly', () => {
      mockClient.variation = vi.fn().mockReturnValue(true);

      const result = LaunchDarklyService.shouldShowOptOutBanner();

      expect(result).toBe(true);
      expect(mockClient.variation).toHaveBeenCalledWith(
        'show_opt_out_banner',
        false
      );
    });
  });

  describe('Retry Logic', () => {
    it('should retry failed operations', async () => {
      let attempts = 0;
      mockClient.waitForInitialization = vi.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          return Promise.reject(new Error('Temporary failure'));
        }
        return Promise.resolve();
      });

      const getVariationSpy = vi.spyOn(
        LaunchDarklyService as any,
        '_variationRaw'
      );
      getVariationSpy.mockReturnValue(true); // Enable resilience

      await LaunchDarklyService.initializeClient(mockContext);

      expect(attempts).toBe(3);
      expect(LaunchDarklyService.isInitialized()).toBe(true);

      getVariationSpy.mockRestore();
    });

    it('should fail after max retries', async () => {
      mockClient.waitForInitialization = vi
        .fn()
        .mockRejectedValue(new Error('Persistent failure'));

      const getVariationSpy = vi.spyOn(
        LaunchDarklyService as any,
        '_variationRaw'
      );
      getVariationSpy.mockReturnValue(true); // Enable resilience

      await LaunchDarklyService.initializeClient(mockContext);

      expect(LaunchDarklyService.isInitialized()).toBe(false);
      expect(LaunchDarklyService.isOnline()).toBe(false);

      const metrics = LaunchDarklyService.getMetrics();
      expect(metrics.failureCount).toBeGreaterThan(0);

      getVariationSpy.mockRestore();
    });
  });

  describe('Circuit Breaker', () => {
    it('should open circuit breaker after threshold failures', async () => {
      // Enable resilience features
      const getVariationSpy = vi.spyOn(
        LaunchDarklyService as any,
        '_variationRaw'
      );
      getVariationSpy.mockReturnValue(true);

      // Mock multiple failures
      mockClient.waitForInitialization = vi
        .fn()
        .mockRejectedValue(new Error('Failure'));

      // The singleton uses default config with threshold 5, so we need to fail 5+ times
      // Don't reset metrics between attempts to accumulate failures
      for (let i = 0; i < 6; i++) {
        LaunchDarklyService.close();
        await LaunchDarklyService.initializeClient(mockContext);
      }

      const metrics = LaunchDarklyService.getMetrics();
      expect(metrics.isCircuitBreakerOpen).toBe(true);

      getVariationSpy.mockRestore();
    }, 30000); // 30 second timeout

    it('should reset circuit breaker after timeout', async () => {
      const config = {
        ...DEFAULT_LAUNCHDARKLY_CONFIG,
        resilience: {
          ...DEFAULT_LAUNCHDARKLY_CONFIG.resilience,
          circuitBreakerThreshold: 1,
          circuitBreakerResetTimeout: 100, // 100ms for testing
        },
      };

      const service = new (LaunchDarklyService.constructor as any)(config);

      // Cause circuit breaker to open
      mockClient.waitForInitialization = vi
        .fn()
        .mockRejectedValue(new Error('Failure'));

      const getVariationSpy = vi.spyOn(service as any, '_variationRaw');
      getVariationSpy.mockReturnValue(true); // Enable resilience

      await service.initializeClient(mockContext);

      let metrics = service.getMetrics();
      expect(metrics.isCircuitBreakerOpen).toBe(true);

      // Wait for timeout
      await new Promise(resolve => setTimeout(resolve, 150));

      // Circuit breaker should reset
      mockClient.waitForInitialization = vi.fn().mockResolvedValue(undefined);
      await service.initializeClient(mockContext);

      metrics = service.getMetrics();
      expect(metrics.isCircuitBreakerOpen).toBe(false);

      getVariationSpy.mockRestore();
    });
  });

  describe('Timeout Handling', () => {
    it('should timeout initialization after configured time', async () => {
      mockClient.waitForInitialization = vi.fn().mockImplementation(() => {
        return new Promise(() => {}); // Never resolves
      });

      const getVariationSpy = vi.spyOn(
        LaunchDarklyService as any,
        '_variationRaw'
      );
      getVariationSpy.mockReturnValue(true); // Enable resilience

      await LaunchDarklyService.initializeClient(mockContext);

      expect(LaunchDarklyService.isInitialized()).toBe(false);
      expect(LaunchDarklyService.isOnline()).toBe(false);

      getVariationSpy.mockRestore();
    }, 60000); // 60 second timeout
  });

  describe('Context Updates', () => {
    beforeEach(async () => {
      await LaunchDarklyService.initializeClient(mockContext);
    });

    it('should update context successfully', async () => {
      const newContext: LDContext = {
        kind: 'user',
        key: 'new-user-456',
        name: 'New User',
      };

      await LaunchDarklyService.updateContext(newContext);

      expect(mockClient.identify).toHaveBeenCalledWith(newContext);
    });

    it('should handle context update failure gracefully', async () => {
      const error = new Error('Update failed');
      mockClient.identify = vi.fn().mockRejectedValue(error);

      const newContext: LDContext = {
        kind: 'user',
        key: 'new-user-456',
        name: 'New User',
      };

      // Should not throw
      await LaunchDarklyService.updateContext(newContext);

      expect(mockClient.identify).toHaveBeenCalledWith(newContext);
    });
  });

  describe('Flag Change Listeners', () => {
    beforeEach(async () => {
      await LaunchDarklyService.initializeClient(mockContext);
    });

    it('should register flag change listeners', () => {
      const callback = vi.fn();

      LaunchDarklyService.onFlagChange('test_flag', callback);

      expect(mockClient.on).toHaveBeenCalledWith('change:test_flag', callback);
    });

    it('should handle listener registration when client is not initialized', () => {
      LaunchDarklyService.close();

      const callback = vi.fn();

      // Should not throw
      LaunchDarklyService.onFlagChange('test_flag', callback);

      expect(mockClient.on).not.toHaveBeenCalled();
    });
  });

  describe('Developer Overrides', () => {
    beforeEach(() => {
      // Mock localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn(),
          setItem: vi.fn(),
          removeItem: vi.fn(),
          clear: vi.fn(),
        },
        writable: true,
      });
    });

    it('should set developer override', () => {
      LaunchDarklyService.setDeveloperOverride('test_flag', true);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'launchDarkly_override_test_flag',
        'true'
      );
    });

    it('should get variation with override', () => {
      (localStorage.getItem as any).mockReturnValue('true');

      const result = LaunchDarklyService.getVariationWithOverride(
        'test_flag',
        false
      );

      expect(result).toBe(true);
      expect(localStorage.getItem).toHaveBeenCalledWith(
        'launchDarkly_override_test_flag'
      );
    });

    it('should clear developer override', () => {
      LaunchDarklyService.clearDeveloperOverride('test_flag');

      expect(localStorage.removeItem).toHaveBeenCalledWith(
        'launchDarkly_override_test_flag'
      );
    });

    it('should handle invalid override values', async () => {
      (localStorage.getItem as any).mockReturnValue('invalid-json');

      // Initialize client first to ensure proper fallback
      await LaunchDarklyService.initializeClient(mockContext);
      mockClient.variation = vi.fn().mockReturnValue(false);

      const result = LaunchDarklyService.getVariationWithOverride(
        'test_flag',
        false
      );

      expect(result).toBe(false); // Should fall back to regular evaluation
      expect(mockClient.variation).toHaveBeenCalledWith('test_flag', false);
    });
  });

  describe('Metrics and Monitoring', () => {
    it('should track initialization time', async () => {
      const startTime = Date.now();
      vi.spyOn(performance, 'now').mockReturnValue(startTime);

      await LaunchDarklyService.initializeClient(mockContext);

      const metrics = LaunchDarklyService.getMetrics();
      expect(metrics.initializationTime).toBeGreaterThanOrEqual(0);
    });

    it('should track success and failure counts', async () => {
      // Success case - use resilience mode for metrics tracking
      const getVariationSpy = vi.spyOn(
        LaunchDarklyService as any,
        '_variationRaw'
      );
      getVariationSpy.mockReturnValue(true); // Enable resilience

      await LaunchDarklyService.initializeClient(mockContext);

      let metrics = LaunchDarklyService.getMetrics();
      expect(metrics.successCount).toBeGreaterThan(0);
      expect(metrics.failureCount).toBe(0);

      // Reset and test failure case
      LaunchDarklyService.resetMetrics();
      LaunchDarklyService.close();

      mockClient.waitForInitialization = vi
        .fn()
        .mockRejectedValue(new Error('Failure'));
      await LaunchDarklyService.initializeClient(mockContext);

      metrics = LaunchDarklyService.getMetrics();
      expect(metrics.failureCount).toBeGreaterThan(0);

      getVariationSpy.mockRestore();
    });

    it('should provide service state', () => {
      const state = LaunchDarklyService.getServiceState();

      expect(state).toHaveProperty('isInitialized');
      expect(state).toHaveProperty('isInitializing');
      expect(state).toHaveProperty('isOffline');
      expect(state).toHaveProperty('metrics');
      expect(state).toHaveProperty('config');
    });

    it('should reset metrics', () => {
      LaunchDarklyService.resetMetrics();

      const metrics = LaunchDarklyService.getMetrics();
      expect(metrics.successCount).toBe(0);
      expect(metrics.failureCount).toBe(0);
      expect(metrics.initializationTime).toBe(0);
      expect(metrics.flagEvaluationTime).toBe(0);
    });
  });

  describe('Service Cleanup', () => {
    it('should close client and reset state', async () => {
      await LaunchDarklyService.initializeClient(mockContext);

      expect(LaunchDarklyService.isInitialized()).toBe(true);

      LaunchDarklyService.close();

      expect(mockClient.close).toHaveBeenCalled();
      expect(LaunchDarklyService.isInitialized()).toBe(false);
    });
  });
});
