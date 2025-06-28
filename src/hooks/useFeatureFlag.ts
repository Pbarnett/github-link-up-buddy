
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFeatureFlag = (flagName: string, defaultValue: boolean = false): boolean => {
  const [isEnabled, setIsEnabled] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatureFlag = async () => {
      try {
        // Check if supabase client is available
        if (!supabase) {
          console.warn(`Supabase client not available for feature flag '${flagName}', using default:`, defaultValue);
          setIsEnabled(defaultValue);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('feature_flags')
          .select('enabled')
          .eq('name', flagName)
          .maybeSingle();

        if (error) {
          console.warn(`Error fetching feature flag '${flagName}':`, error.message);
          // For specific flags, use production defaults when DB fails
          if (flagName === 'use_new_pools_ui') {
            console.warn('Using production default: enabling new pools UI');
            setIsEnabled(true);
          } else if (flagName === 'flight_search_v2_enabled') {
            console.warn('Using production default: enabling V2 flight search');
            setIsEnabled(true);
          } else {
            setIsEnabled(defaultValue);
          }
        } else if (data) {
          setIsEnabled(data.enabled);
        } else {
          console.warn(`Feature flag '${flagName}' not found, using default value:`, defaultValue);
          // For specific flags, use production defaults when not found
          if (flagName === 'use_new_pools_ui') {
            console.warn('Flag not found: enabling new pools UI as production default');
            setIsEnabled(true);
          } else if (flagName === 'flight_search_v2_enabled') {
            console.warn('Flag not found: enabling V2 flight search as production default');
            setIsEnabled(true);
          } else {
            setIsEnabled(defaultValue);
          }
        }
      } catch (error) {
        console.error(`Error fetching feature flag '${flagName}':`, error);
        // For specific flags, use production defaults when errors occur
        if (flagName === 'use_new_pools_ui') {
          console.warn('Error fetching flag: enabling new pools UI as production default');
          setIsEnabled(true);
        } else if (flagName === 'flight_search_v2_enabled') {
          console.warn('Error fetching flag: enabling V2 flight search as production default');
          setIsEnabled(true);
        } else {
          setIsEnabled(defaultValue);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatureFlag();
  }, [flagName, defaultValue]);

  // Return the default value while loading to prevent UI flicker
  return isLoading ? defaultValue : isEnabled;
};
