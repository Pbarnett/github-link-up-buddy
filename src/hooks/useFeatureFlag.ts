import { useFlags } from 'launchdarkly-react-client-sdk';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useEffect } from 'react';
import { trackPersonalizationSeen } from '@/lib/featureFlags/launchDarklyService';
import { type FeatureFlag, isEnabled } from '@shared/featureFlag';

// New LaunchDarkly-powered hook with tracking
export const useFeatureFlag = (flagName: string, defaultValue: boolean = false) => {
  const flags = useFlags<Record<string, boolean>>();
  const { user } = useCurrentUser();

  // Start from provided default
  let flagValue: boolean = Boolean(defaultValue);

  // 1) Allow local preset override (used by tests and local dev)
  if (typeof window !== 'undefined') {
    try {
      const preset = window.localStorage?.getItem('LD_PRESET_FLAGS');
      if (preset) {
        const parsed = JSON.parse(preset);
        if (parsed && Object.prototype.hasOwnProperty.call(parsed, flagName)) {
          flagValue = Boolean(parsed[flagName]);
        }
      }
    } catch {}

    // Optional explicit wallet flag via env
    if (import.meta.env?.VITE_WALLET_UI_ENABLED === 'true' && flagName === 'wallet_ui') {
      flagValue = true;
    }
  }

  // 2) If not overridden by local preset/env, use LaunchDarkly flag when available
  if (flags && Object.prototype.hasOwnProperty.call(flags, flagName)) {
    flagValue = Boolean(flags[flagName]);
  }

  // Track personalization events
  useEffect(() => {
    if (flagName === 'personalization_greeting') {
      trackPersonalizationSeen(flagValue);
    }
  }, [flagName, flagValue]);

  // Return object similar to useQuery for backward compatibility
  return {
    data: flagValue,
    isLoading: !flags,
    isError: false,
    error: null,
  };
};

// Legacy hook for backward compatibility
export const useFeatureFlagLegacy = (flagName: string, defaultValue: boolean = false): boolean => {
  const result = useFeatureFlag(flagName, defaultValue);
  return result.data ?? defaultValue;
};

// Client-side feature flag evaluation (for cases where you have the rollout percentage)
export const useClientFeatureFlag = (flagName: string, rolloutPercentage: number, defaultValue: boolean = false): boolean => {
  const { user } = useCurrentUser();
  
  if (!user?.id) return defaultValue;
  
  const flag: FeatureFlag = {
    name: flagName,
    enabled: true,
    rollout_percentage: rolloutPercentage
  };
  
  return isEnabled(flag, user.id);
};
