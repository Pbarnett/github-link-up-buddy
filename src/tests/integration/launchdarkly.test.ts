import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FeatureFlagManager } from '@/lib/feature-flags/manager';
import { FeatureFlagClient } from '@/lib/feature-flags/client';
import { FeatureFlags } from '@/types/feature-flags';
import { User } from '@supabase/supabase-js';

// Mock LaunchDarkly client
const mockLDClient = {
  waitForInitialization: vi.fn(),
  variation: vi.fn(),
  allFlags: vi.fn(),
  identify: vi.fn(),
  close: vi.fn(),
  flush: vi.fn(),
  isOffline: vi.fn(),
  getContext: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
};

const mockLDClientNode = {
  initialized: vi.fn(),
  variation: vi.fn(),
  allFlagsState: vi.fn(),
  identify: vi.fn(),
  close: vi.fn(),
  flush: vi.fn(),
  isOffline: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
};

// Mock LaunchDarkly modules
vi.mock('launchdarkly-js-client-sdk', () => ({
  initialize: vi.fn(() => mockLDClient),
}));

vi.mock('launchdarkly-node-server-sdk', () => ({
  init: vi.fn(() => mockLDClientNode),
}));

describe('LaunchDarkly Integration Tests', () => {
  let featureFlagManager: FeatureFlagManager;
  let featureFlagClient: FeatureFlagClient;
  
  const mockUser: User = {
    id: 'test-user-123',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {
      firstName: 'Test',
      lastName: 'User',
    },
    aud: '',
    created_at: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset environment variables
    process.env.LAUNCHDARKLY_CLIENT_ID = 'test-client-key';
    process.env.LAUNCHDARKLY_SERVER_KEY = 'test-server-key';
    
    featureFlagManager = FeatureFlagManager.getInstance();
    featureFlagClient = new FeatureFlagClient();
  });

  afterEach(async () => {
    await featureFlagManager.cleanup();
    vi.resetAllMocks();
  });

  describe('Client-side Feature Flags', () => {
    it('should initialize client-side LaunchDarkly SDK successfully', async () => {
      mockLDClient.waitForInitialization.mockResolvedValue(mockLDClient);
      
      const client = await featureFlagClient.initialize(mockUser);
      
      expect(client).toBeDefined();
      expect(mockLDClient.waitForInitialization).toHaveBeenCalled();
    });

    it('should handle client initialization timeout gracefully', async () => {
      mockLDClient.waitForInitialization.mockRejectedValue(new Error('Timeout'));
      
      const client = await featureFlagClient.initialize(mockUser);
      
      expect(client).toBeDefined(); // Should still return fallback client
      expect(mockLDClient.waitForInitialization).toHaveBeenCalled();
    });

    it('should get boolean feature flag values with fallback', async () => {
      mockLDClient.variation.mockReturnValue(true);
      
      await featureFlagClient.initialize(mockUser);
      const result = await featureFlagClient.getBooleanFlag('enableNewBookingFlow', false);
      
      expect(result).toBe(true);
      expect(mockLDClient.variation).toHaveBeenCalledWith('enableNewBookingFlow', false);
    });

    it('should get string feature flag values with fallback', async () => {
      mockLDClient.variation.mockReturnValue('premium');
      
      await featureFlagClient.initialize(mockUser);
      const result = await featureFlagClient.getStringFlag('subscriptionTier', 'free');
      
      expect(result).toBe('premium');
      expect(mockLDClient.variation).toHaveBeenCalledWith('subscriptionTier', 'free');
    });

    it('should get numeric feature flag values with fallback', async () => {
      mockLDClient.variation.mockReturnValue(10);
      
      await featureFlagClient.initialize(mockUser);
      const result = await featureFlagClient.getNumberFlag('maxTravelersPerBooking', 5);
      
      expect(result).toBe(10);
      expect(mockLDClient.variation).toHaveBeenCalledWith('maxTravelersPerBooking', 5);
    });

    it('should get JSON feature flag values with fallback', async () => {
      const mockConfig = { theme: 'dark', showBeta: true };
      mockLDClient.variation.mockReturnValue(mockConfig);
      
      await featureFlagClient.initialize(mockUser);
      const result = await featureFlagClient.getJSONFlag('uiConfig', {});
      
      expect(result).toEqual(mockConfig);
      expect(mockLDClient.variation).toHaveBeenCalledWith('uiConfig', {});
    });

    it('should handle client-side errors gracefully', async () => {
      mockLDClient.variation.mockImplementation(() => {
        throw new Error('Client error');
      });
      
      await featureFlagClient.initialize(mockUser);
      const result = await featureFlagClient.getBooleanFlag('enableNewBookingFlow', false);
      
      expect(result).toBe(false); // Should return fallback value
    });

    it('should update user context when user changes', async () => {
      await featureFlagClient.initialize(mockUser);
      
      const newUser = { ...mockUser, id: 'new-user-456' };
      await featureFlagClient.identify(newUser);
      
      expect(mockLDClient.identify).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'new-user-456',
          email: 'test@example.com',
        })
      );
    });
  });

  describe('Server-side Feature Flags', () => {
    it('should initialize server-side LaunchDarkly SDK successfully', async () => {
      mockLDClientNode.initialized.mockReturnValue(Promise.resolve());
      
      await featureFlagManager.initialize();
      
      expect(mockLDClientNode.initialized).toHaveBeenCalled();
    });

    it('should get server-side feature flag values with user context', async () => {
      mockLDClientNode.variation.mockResolvedValue(true);
      
      await featureFlagManager.initialize();
      const result = await featureFlagManager.getBooleanFlag(
        'enableServerSideFeature',
        mockUser,
        false
      );
      
      expect(result).toBe(true);
      expect(mockLDClientNode.variation).toHaveBeenCalledWith(
        'enableServerSideFeature',
        expect.objectContaining({
          key: mockUser.id,
          email: mockUser.email,
        }),
        false
      );
    });

    it('should get all feature flags for a user', async () => {
      const mockAllFlags = {
        enableNewBookingFlow: { value: true, variation: 0 },
        subscriptionTier: { value: 'premium', variation: 1 },
        maxTravelersPerBooking: { value: 10, variation: 0 },
      };
      
      mockLDClientNode.allFlagsState.mockResolvedValue({
        valid: true,
        allValues: () => mockAllFlags,
      });
      
      await featureFlagManager.initialize();
      const result = await featureFlagManager.getAllFlags(mockUser);
      
      expect(result).toEqual(mockAllFlags);
    });

    it('should handle server-side initialization failure gracefully', async () => {
      mockLDClientNode.initialized.mockRejectedValue(new Error('Server init failed'));
      
      await featureFlagManager.initialize();
      
      // Manager should still be functional with fallback values
      const result = await featureFlagManager.getBooleanFlag(
        'enableServerSideFeature',
        mockUser,
        false
      );
      
      expect(result).toBe(false); // Should return fallback
    });

    it('should implement circuit breaker for failed requests', async () => {
      mockLDClientNode.variation.mockRejectedValue(new Error('Service unavailable'));
      
      await featureFlagManager.initialize();
      
      // Make multiple failed requests to trigger circuit breaker
      for (let i = 0; i < 6; i++) {
        await featureFlagManager.getBooleanFlag('testFlag', mockUser, false);
      }
      
      // Next request should use fallback immediately (circuit breaker open)
      const result = await featureFlagManager.getBooleanFlag('testFlag', mockUser, false);
      expect(result).toBe(false);
      
      // Should have stopped making actual requests after circuit breaker opened
      expect(mockLDClientNode.variation).toHaveBeenCalledTimes(5); // Only first 5 attempts
    });
  });

  describe('Feature Flag Combinations', () => {
    it('should handle complex feature flag logic correctly', async () => {
      // Setup multiple feature flags
      mockLDClientNode.variation
        .mockResolvedValueOnce(true)  // enableAdvancedSearch
        .mockResolvedValueOnce('premium')  // subscriptionTier
        .mockResolvedValueOnce(50);   // searchResultsLimit
      
      await featureFlagManager.initialize();
      
      // Test business logic that depends on multiple flags
      const advancedSearchEnabled = await featureFlagManager.getBooleanFlag(
        'enableAdvancedSearch',
        mockUser,
        false
      );
      const tier = await featureFlagManager.getStringFlag(
        'subscriptionTier',
        mockUser,
        'free'
      );
      const resultLimit = await featureFlagManager.getNumberFlag(
        'searchResultsLimit',
        mockUser,
        10
      );
      
      expect(advancedSearchEnabled).toBe(true);
      expect(tier).toBe('premium');
      expect(resultLimit).toBe(50);
      
      // Test combined logic
      const shouldShowAdvancedSearch = advancedSearchEnabled && tier === 'premium';
      const effectiveLimit = shouldShowAdvancedSearch ? resultLimit : 10;
      
      expect(shouldShowAdvancedSearch).toBe(true);
      expect(effectiveLimit).toBe(50);
    });
  });

  describe('Error Handling and Fallbacks', () => {
    it('should use fallback values when LaunchDarkly is completely unavailable', async () => {
      // Simulate complete LaunchDarkly unavailability
      process.env.LAUNCHDARKLY_CLIENT_ID = '';
      process.env.LAUNCHDARKLY_SERVER_KEY = '';
      
      const fallbackManager = FeatureFlagManager.getInstance();
      await fallbackManager.initialize();
      
      const result = await fallbackManager.getBooleanFlag(
        'enableNewBookingFlow',
        mockUser,
        true // fallback value
      );
      
      expect(result).toBe(true); // Should return fallback
    });

    it('should handle malformed feature flag responses', async () => {
      mockLDClientNode.variation.mockResolvedValue(undefined);
      
      await featureFlagManager.initialize();
      const result = await featureFlagManager.getBooleanFlag(
        'enableNewBookingFlow',
        mockUser,
        false
      );
      
      expect(result).toBe(false); // Should return fallback for undefined
    });

    it('should validate feature flag types and return fallbacks for type mismatches', async () => {
      mockLDClientNode.variation.mockResolvedValue('not-a-boolean'); // Wrong type
      
      await featureFlagManager.initialize();
      const result = await featureFlagManager.getBooleanFlag(
        'enableNewBookingFlow',
        mockUser,
        false
      );
      
      expect(result).toBe(false); // Should return fallback for type mismatch
    });
  });

  describe('Performance and Caching', () => {
    it('should cache feature flag values to reduce API calls', async () => {
      mockLDClientNode.variation.mockResolvedValue(true);
      
      await featureFlagManager.initialize();
      
      // Make multiple requests for the same flag
      await featureFlagManager.getBooleanFlag('cachableFlag', mockUser, false);
      await featureFlagManager.getBooleanFlag('cachableFlag', mockUser, false);
      await featureFlagManager.getBooleanFlag('cachableFlag', mockUser, false);
      
      // Should only make one actual API call due to caching
      expect(mockLDClientNode.variation).toHaveBeenCalledTimes(1);
    });

    it('should respect cache TTL and refresh stale values', async () => {
      mockLDClientNode.variation
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);
      
      await featureFlagManager.initialize();
      
      // First call
      const result1 = await featureFlagManager.getBooleanFlag('ttlFlag', mockUser, false);
      expect(result1).toBe(true);
      
      // Simulate cache expiration
      vi.advanceTimersByTime(60000); // 1 minute
      
      // Second call after cache expiry
      const result2 = await featureFlagManager.getBooleanFlag('ttlFlag', mockUser, false);
      expect(result2).toBe(false);
      
      expect(mockLDClientNode.variation).toHaveBeenCalledTimes(2);
    });
  });

  describe('User Context and Segmentation', () => {
    it('should pass correct user context for segmentation', async () => {
      const userWithCustomAttributes = {
        ...mockUser,
        user_metadata: {
          ...mockUser.user_metadata,
          country: 'US',
          subscriptionTier: 'premium',
          accountAge: 365,
        },
      };
      
      mockLDClientNode.variation.mockResolvedValue(true);
      
      await featureFlagManager.initialize();
      await featureFlagManager.getBooleanFlag(
        'regionSpecificFeature',
        userWithCustomAttributes,
        false
      );
      
      expect(mockLDClientNode.variation).toHaveBeenCalledWith(
        'regionSpecificFeature',
        expect.objectContaining({
          key: userWithCustomAttributes.id,
          email: userWithCustomAttributes.email,
          custom: expect.objectContaining({
            country: 'US',
            subscriptionTier: 'premium',
            accountAge: 365,
          }),
        }),
        false
      );
    });

    it('should handle anonymous users correctly', async () => {
      const anonymousUser = null;
      
      mockLDClientNode.variation.mockResolvedValue(false);
      
      await featureFlagManager.initialize();
      const result = await featureFlagManager.getBooleanFlag(
        'publicFeature',
        anonymousUser,
        true
      );
      
      expect(result).toBe(false);
      expect(mockLDClientNode.variation).toHaveBeenCalledWith(
        'publicFeature',
        expect.objectContaining({
          key: 'anonymous',
          anonymous: true,
        }),
        true
      );
    });
  });

  describe('Developer Overrides', () => {
    it('should respect local development overrides', async () => {
      // Set development override
      localStorage.setItem(
        'feature-flags-dev-override',
        JSON.stringify({
          enableNewBookingFlow: true,
          subscriptionTier: 'enterprise',
        })
      );
      
      await featureFlagManager.initialize();
      
      const booleanResult = await featureFlagManager.getBooleanFlag(
        'enableNewBookingFlow',
        mockUser,
        false
      );
      const stringResult = await featureFlagManager.getStringFlag(
        'subscriptionTier',
        mockUser,
        'free'
      );
      
      expect(booleanResult).toBe(true);
      expect(stringResult).toBe('enterprise');
      
      // Should not have called LaunchDarkly for overridden flags
      expect(mockLDClientNode.variation).not.toHaveBeenCalled();
    });

    it('should allow clearing development overrides', async () => {
      localStorage.setItem(
        'feature-flags-dev-override',
        JSON.stringify({
          enableNewBookingFlow: true,
        })
      );
      
      await featureFlagManager.initialize();
      
      // Clear overrides
      localStorage.removeItem('feature-flags-dev-override');
      
      // Should now use LaunchDarkly
      mockLDClientNode.variation.mockResolvedValue(false);
      
      const result = await featureFlagManager.getBooleanFlag(
        'enableNewBookingFlow',
        mockUser,
        false
      );
      
      expect(result).toBe(false);
      expect(mockLDClientNode.variation).toHaveBeenCalled();
    });
  });

  describe('Cleanup and Resource Management', () => {
    it('should properly clean up resources on shutdown', async () => {
      await featureFlagManager.initialize();
      await featureFlagManager.cleanup();
      
      expect(mockLDClientNode.close).toHaveBeenCalled();
    });

    it('should flush pending events before cleanup', async () => {
      await featureFlagManager.initialize();
      await featureFlagManager.cleanup();
      
      expect(mockLDClientNode.flush).toHaveBeenCalled();
    });
  });
});

// Helper function to test feature flag type safety
describe('Feature Flag Type Safety', () => {
  it('should enforce type safety for known feature flags', () => {
    // This test ensures our FeatureFlags type is working correctly
    const flags: Partial<FeatureFlags> = {
      enableNewBookingFlow: true,
      subscriptionTier: 'premium',
      maxTravelersPerBooking: 10,
      uiConfig: { theme: 'dark', showBeta: true },
    };
    
    expect(flags.enableNewBookingFlow).toBe(true);
    expect(flags.subscriptionTier).toBe('premium');
    expect(flags.maxTravelersPerBooking).toBe(10);
    expect(flags.uiConfig?.theme).toBe('dark');
  });
});
