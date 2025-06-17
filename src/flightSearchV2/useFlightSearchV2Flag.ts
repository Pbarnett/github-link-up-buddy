import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFlightSearchV2Flag = (): { enabled: boolean, loading: boolean } => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const flagName = 'flight_search_v2_enabled';

  useEffect(() => {
    const fetchFeatureFlag = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('enabled')
          .eq('name', flagName)
          .single();

        if (error) {
          console.warn(`Feature flag '${flagName}' not found, using default value: false`);
          setEnabled(false);
        } else if (data) {
          setEnabled(data.enabled);
        } else {
          // Handle case where data is null but no error (should ideally not happen with .single())
          console.warn(`Feature flag '${flagName}' returned no data, using default value: false`);
          setEnabled(false);
        }
      } catch (error) {
        console.error(`Error fetching feature flag '${flagName}':`, error);
        setEnabled(false);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatureFlag();
  }, []); // Empty dependency array to run only once on mount

  return { enabled, loading };
};
