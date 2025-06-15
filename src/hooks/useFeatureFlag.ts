import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * 🚦 useFeatureFlag
 * Returns [isEnabled, isLoading]
 * Use: const [enabled, loading] = useFeatureFlag("flag_name");
 * For backward compatibility, the hook can still be consumed as a boolean (default: isEnabled).
 */
export const useFeatureFlag = (
  flagName: string, 
  defaultValue: boolean = false
): [boolean, boolean] & { isEnabled?: boolean; isLoading?: boolean } => {
  const [isEnabled, setIsEnabled] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatureFlag = async () => {
      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('enabled')
          .eq('name', flagName)
          .single();

        if (error) {
          console.warn(`Feature flag '${flagName}' not found, using default value:`, defaultValue);
          setIsEnabled(defaultValue);
        } else {
          setIsEnabled(data.enabled);
        }
      } catch (error) {
        console.error(`Error fetching feature flag '${flagName}':`, error);
        setIsEnabled(defaultValue);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatureFlag();
  }, [flagName, defaultValue]);

  // Backward compatible: single boolean return.
  // For finer control, destructure as [enabled, loading].
  const tuple: [boolean, boolean] & { isEnabled?: boolean; isLoading?: boolean } = [isLoading ? defaultValue : isEnabled, isLoading];
  tuple.isEnabled = isLoading ? defaultValue : isEnabled;
  tuple.isLoading = isLoading;
  return tuple;
};

// LEGACY default (keep for existing consumers): bool-only
// If you want only the enabled status: const [enabled] = useFeatureFlag("flag_name");
