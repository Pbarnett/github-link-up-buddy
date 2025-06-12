
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Returns whether the named feature flag is enabled.
 * Falls back to defaultVal on error or missing table.
 * ⚠️ Warning: makes a fetch on each mount; caching may be needed later.
 */
export const useFeatureFlag = (name: string, defaultVal = false): boolean => {
  const [enabled, setEnabled] = useState(defaultVal);

  useEffect(() => {
    const fetchFlag = async () => {
      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('enabled')
          .eq('name', name)
          .single();

        if (!error && typeof data?.enabled === 'boolean') {
          setEnabled(data.enabled);
        } else {
          console.warn(`[useFeatureFlag] Error fetching flag "${name}", falling back to ${defaultVal}. Error:`, error?.message || 'Unknown error');
          setEnabled(defaultVal);
        }
      } catch (err) {
        console.warn(`[useFeatureFlag] Error fetching flag "${name}", falling back to ${defaultVal}. Error:`, err);
        setEnabled(defaultVal);
      }
    };

    fetchFlag();
  }, [name, defaultVal]);

  return enabled;
};
