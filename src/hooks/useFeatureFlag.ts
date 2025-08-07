

import {  } from '../services/launchDarklyService';

  type FeatureFlag,
  isFeatureEnabled as isEnabled,

// New LaunchDarkly-powered hook with tracking
export const useFeatureFlag = (
  flagName: string,
  defaultValue: boolean = false
) => {
  const flags = useFlags<Record<string, boolean>>();

  // Check for test environment or preset flags from tests first
  let flagValue = defaultValue;
  if (typeof window !== 'undefined') {
    // Check if we're in a test environment (playwright sets this)
    const isTestEnv =
      window.location.hostname === 'localhost' &&
      (window.navigator.userAgent.includes('HeadlessChrome') ||
        window.navigator.userAgent.includes('Playwright'));

    // Also check for explicit environment variables set by Playwright
    const isPlaywrightTest = import.meta.env.VITE_PLAYWRIGHT_TEST === 'true';
    const isWalletUIEnabled = import.meta.env.VITE_WALLET_UI_ENABLED === 'true';

    // In test environment, enable wallet_ui and profile_ui_revamp flags
    if (
      (isTestEnv || isPlaywrightTest) &&
      (flagName === 'wallet_ui' || flagName === 'profile_ui_revamp')
    ) {
      flagValue = true;
    } else if (isWalletUIEnabled && flagName === 'wallet_ui') {
      flagValue = true;
    } else {
      const presetFlags = localStorage.getItem('LD_PRESET_FLAGS');
      if (presetFlags) {
        try {
          const parsedFlags = JSON.parse(presetFlags);
          if (parsedFlags[flagName] !== undefined) {
            flagValue = parsedFlags[flagName];
          }
        } catch {
          // Ignore parsing errors
        }
      }
    }
  }

  // If no preset, use LaunchDarkly value
  if (flagValue === defaultValue) {
    flagValue = flags[flagName] ?? defaultValue;
  }

  // Track personalization events with error handling
  useEffect(() => {
    if (
      flagName === 'personalization_greeting' &&
      typeof flagValue === 'boolean'
    ) {
      try {
        trackPersonalizationSeen(flagValue);
      } catch (error) {
        console.error('Failed to track personalization seen event:', error);
        // Don't throw - tracking failures shouldn't break the app
      }
    }
  }, [flagName, flagValue]);

  // Return object similar to useQuery for backward compatibility
  return {
    data: flagValue,
    isLoading: flags === undefined,
    isError: false,
    error: null,
  };
};

// Legacy hook for backward compatibility
export const useFeatureFlagLegacy = (
  flagName: string,
  defaultValue: boolean = false
): boolean => {
  const result = useFeatureFlag(flagName, defaultValue);
  return result.data ?? defaultValue;
};

// Client-side feature flag evaluation (for cases where you have the rollout percentage)
export const useClientFeatureFlag = (
  flagName: string,
  rolloutPercentage: number,
  defaultValue: boolean = false
): boolean => {
  const { user } = useCurrentUser();

  if (!user?.id) return defaultValue;

  const flag: FeatureFlag = {
    name: flagName,
    enabled: true,
    rollout_percentage: rolloutPercentage,
  };

  return isEnabled(flag.name, user.id);
};
