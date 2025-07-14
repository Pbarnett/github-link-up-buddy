/**
 * Feature Flag Types and Constants
 * 
 * Shared types and utilities for feature flags across the application
 */

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
  rolloutPercentage?: number;
  rollout_percentage?: number; // Alternative property name for compatibility
  conditions?: Record<string, unknown>;
}

export interface FeatureFlagConfig {
  flags: Record<string, FeatureFlag>;
  defaultValue?: boolean;
}

export const DEFAULT_FEATURE_FLAGS: Record<string, FeatureFlag> = {
  wallet_ui: {
    name: 'wallet_ui',
    enabled: false,
    description: 'Enable wallet UI features',
    rolloutPercentage: 0
  },
  advanced_search: {
    name: 'advanced_search',
    enabled: true,
    description: 'Enable advanced search features',
    rolloutPercentage: 100
  },
  personalization: {
    name: 'personalization',
    enabled: true,
    description: 'Enable personalization features',
    rolloutPercentage: 50
  }
};

export const isFeatureEnabled = (flagName: string, userContext?: any): boolean => {
  const flag = DEFAULT_FEATURE_FLAGS[flagName];
  if (!flag) {
    console.warn(`Feature flag '${flagName}' not found`);
    return false;
  }
  
  // Simple rollout percentage check
  if (flag.rolloutPercentage !== undefined) {
    const userHash = userContext?.id ? hashString(userContext.id) : Math.random();
    return (userHash * 100) < flag.rolloutPercentage;
  }
  
  return flag.enabled;
};

// Alternative function name for compatibility
export const isEnabled = (flag: FeatureFlag, userId: string): boolean => {
  if (!flag.enabled) return false;
  
  // Check both property names for rollout percentage
  const rolloutPercentage = flag.rolloutPercentage ?? flag.rollout_percentage;
  if (rolloutPercentage !== undefined) {
    const userHash = hashString(userId);
    return (userHash * 100) < rolloutPercentage;
  }
  
  return flag.enabled;
};

// Simple hash function for consistent user bucketing
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) / 0x7fffffff; // Normalize to 0-1
}

// Additional utility functions for advanced user bucketing
export const getUserBucket = (userId: string): number => {
  const hash = hashString(userId);
  return Math.floor(hash * 100);
};

export const userInBucket = (userId: string, rolloutPercentage: number): boolean => {
  if (!userId || rolloutPercentage <= 0) return false;
  if (rolloutPercentage >= 100) return true;
  
  const bucket = getUserBucket(userId);
  return bucket < rolloutPercentage;
};

export default {
  DEFAULT_FEATURE_FLAGS,
  isFeatureEnabled,
  getUserBucket,
  userInBucket
};
