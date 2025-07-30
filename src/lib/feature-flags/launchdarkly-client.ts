/**
 * Client-side LaunchDarkly utilities for feature flag evaluation
 * 
 * This module provides a client-side interface to LaunchDarkly that works
 * with both the React SDK and server-side evaluation via Supabase Edge Functions.
 */

import { supabase } from '@/integrations/supabase/client';

// LaunchDarkly context interface
interface LDContext {
  key: string;
  kind: string;
  [key: string]: any;
}

interface LaunchDarklyResponse {
  value: any;
  variationIndex?: number;
  reason?: any;
  flagKey: string;
  timestamp: string;
}

/**
 * Evaluate a feature flag via server-side function
 */
export async function evaluateFlag(
  flagKey: string,
  context: LDContext,
  defaultValue: any = false,
  includeReason: boolean = false
): Promise<LaunchDarklyResponse> {
  try {
    // Call the Supabase Edge Function for server-side evaluation
    const { data, error } = await supabase.functions.invoke('launchdarkly-server', {
      body: {
        context,
        flagKey,
        defaultValue,
        includeReason
      }
    });

    if (error) {
      console.warn('LaunchDarkly server evaluation failed:', error);
      return {
        value: defaultValue,
        flagKey,
        timestamp: new Date().toISOString()
      };
    }

    return data;
  } catch (error) {
    console.error('LaunchDarkly evaluation error:', error);
    
    // Fallback: try to get cached value from localStorage
    const cacheKey = `ld_flag_${flagKey}_${context.key}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const parsedCache = JSON.parse(cached);
        // Use cached value if it's less than 5 minutes old
        if (Date.now() - parsedCache.timestamp < 5 * 60 * 1000) {
          console.log('Using cached LaunchDarkly flag value:', flagKey);
          return parsedCache;
        }
      } catch (parseError) {
        console.warn('Failed to parse cached flag value:', parseError);
      }
    }

    // Final fallback
    return {
      value: defaultValue,
      flagKey,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Create a user context for flag evaluation
 */
export function createUserContext(
  userId: string,
  attributes: Record<string, any> = {}
): LDContext {
  return {
    kind: 'user',
    key: userId,
    ...attributes
  };
}

/**
 * Create an organization context for flag evaluation
 */
export function createOrgContext(
  orgId: string,
  attributes: Record<string, any> = {}
): LDContext {
  return {
    kind: 'organization',
    key: orgId,
    ...attributes
  };
}

/**
 * Create a device context for flag evaluation
 */
export function createDeviceContext(
  deviceId: string,
  attributes: Record<string, any> = {}
): LDContext {
  return {
    kind: 'device',
    key: deviceId,
    ...attributes
  };
}

/**
 * Cache flag values in localStorage for offline usage
 */
export function cacheFlagValue(
  flagKey: string,
  contextKey: string,
  value: any,
  ttlMs: number = 5 * 60 * 1000 // 5 minutes default
): void {
  try {
    const cacheKey = `ld_flag_${flagKey}_${contextKey}`;
    const cacheValue = {
      value,
      timestamp: Date.now(),
      ttl: ttlMs
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheValue));
  } catch (error) {
    console.warn('Failed to cache flag value:', error);
  }
}

/**
 * Clear cached flag values
 */
export function clearFlagCache(flagKey?: string): void {
  try {
    if (flagKey) {
      // Clear specific flag cache
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(`ld_flag_${flagKey}_`)
      );
      keys.forEach(key => localStorage.removeItem(key));
    } else {
      // Clear all flag cache
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('ld_flag_')
      );
      keys.forEach(key => localStorage.removeItem(key));
    }
  } catch (error) {
    console.warn('Failed to clear flag cache:', error);
  }
}

/**
 * React hook for feature flag evaluation with caching
 */
export function useFeatureFlag(
  flagKey: string,
  defaultValue: any = false,
  context?: Partial<LDContext>
) {
  const [value, setValue] = React.useState(defaultValue);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let mounted = true;

    const evaluateAsync = async () => {
      try {
        setLoading(true);
        setError(null);

        const userContext = createUserContext(
          context?.key || 'anonymous',
          context || {}
        );

        const result = await evaluateFlag(flagKey, userContext, defaultValue, true);
        
        if (mounted) {
          setValue(result.value);
          
          // Cache the result
          cacheFlagValue(flagKey, userContext.key, result.value);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Flag evaluation failed'));
          setValue(defaultValue);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    evaluateAsync();

    return () => {
      mounted = false;
    };
  }, [flagKey, defaultValue, context?.key]);

  return { value, loading, error };
}

/**
 * Batch evaluate multiple flags
 */
export async function evaluateFlags(
  flags: Array<{
    key: string;
    defaultValue: any;
  }>,
  context: LDContext
): Promise<Record<string, any>> {
  const results: Record<string, any> = {};

  // Evaluate flags in parallel
  const promises = flags.map(async flag => {
    const result = await evaluateFlag(flag.key, context, flag.defaultValue);
    return { key: flag.key, value: result.value };
  });

  try {
    const resolved = await Promise.allSettled(promises);
    
    resolved.forEach((result, index) => {
      const flagKey = flags[index].key;
      if (result.status === 'fulfilled') {
        results[flagKey] = result.value.value;
      } else {
        console.warn(`Flag evaluation failed for ${flagKey}:`, result.reason);
        results[flagKey] = flags[index].defaultValue;
      }
    });
  } catch (error) {
    console.error('Batch flag evaluation failed:', error);
    
    // Return default values
    flags.forEach(flag => {
      results[flag.key] = flag.defaultValue;
    });
  }

  return results;
}

/**
 * Performance-optimized flag checker for high-frequency usage
 */
export class FeatureFlagCache {
  private cache = new Map<string, { value: any; timestamp: number; ttl: number }>();
  private readonly defaultTtl = 5 * 60 * 1000; // 5 minutes

  async getFlag(
    flagKey: string,
    context: LDContext,
    defaultValue: any = false,
    ttl: number = this.defaultTtl
  ): Promise<any> {
    const cacheKey = `${flagKey}_${context.key}`;
    const cached = this.cache.get(cacheKey);

    // Return cached value if valid
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.value;
    }

    // Evaluate and cache
    try {
      const result = await evaluateFlag(flagKey, context, defaultValue);
      
      this.cache.set(cacheKey, {
        value: result.value,
        timestamp: Date.now(),
        ttl
      });

      return result.value;
    } catch (error) {
      console.warn(`Flag evaluation failed for ${flagKey}, using default:`, error);
      return defaultValue;
    }
  }

  clearCache(flagKey?: string): void {
    if (flagKey) {
      const keys = Array.from(this.cache.keys()).filter(key => 
        key.startsWith(`${flagKey}_`)
      );
      keys.forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Global cache instance
export const globalFlagCache = new FeatureFlagCache();

import * as React from 'react';
