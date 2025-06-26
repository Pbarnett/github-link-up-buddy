
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFeatureFlag = (flagName: string, defaultValue: boolean = false): boolean => {
  const [isEnabled, setIsEnabled] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatureFlag = async () => {
      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('enabled')
          .eq('name', flagName)
          .maybeSingle();

        if (error) {
          console.warn(`Error fetching feature flag '${flagName}':`, error.message);
          setIsEnabled(defaultValue);
        } else if (data) {
          setIsEnabled(data.enabled);
        } else {
          console.warn(`Feature flag '${flagName}' not found, using default value:`, defaultValue);
          setIsEnabled(defaultValue);
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

  // Return the default value while loading to prevent UI flicker
  return isLoading ? defaultValue : isEnabled;
};
