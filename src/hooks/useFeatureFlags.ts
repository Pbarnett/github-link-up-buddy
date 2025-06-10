
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
}

/**
 * Hook to fetch a specific feature flag
 */
export const useFeatureFlag = (flagName: string) => {
  return useQuery({
    queryKey: ['feature-flag', flagName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('enabled')
        .eq('name', flagName)
        .single();

      if (error) {
        console.warn(`Feature flag '${flagName}' not found, defaulting to false`);
        return false;
      }

      return data.enabled;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch all feature flags
 */
export const useFeatureFlags = () => {
  return useQuery({
    queryKey: ['feature-flags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      return data as FeatureFlag[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
