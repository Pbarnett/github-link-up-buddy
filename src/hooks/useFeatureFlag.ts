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
    supabase
      .from('feature_flags')
      .select('enabled')
      .eq('name', name)
      .single()
      .then(({ data, error }) => {
        if (error || data?.enabled === undefined) throw error; // Intentionally throw to fall into catch
        setEnabled(data.enabled);
      })
      .catch((err) => { // Catch the error from then() or other errors
        console.warn(`[useFeatureFlag] Error fetching flag "${name}", falling back to ${defaultVal}. Error:`, err?.message || err);
        setEnabled(defaultVal);
      });
  }, [name, defaultVal]);
  return enabled;
};
