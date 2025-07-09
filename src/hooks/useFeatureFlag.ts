import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { userInBucket } from '../../../packages/shared/featureFlag';

interface FeatureFlagResponse {
  enabled: boolean;
  bucket?: number;
  rollout_percentage?: number;
}

export const useFeatureFlag = (flagName: string, defaultValue: boolean = false) => {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: ['feature-flag', flagName, user?.id],
    queryFn: async (): Promise<boolean> => {
      if (!user?.id) return defaultValue;
      
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        const response = await fetch(`${supabaseUrl}/functions/v1/flags`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ 
            flag: flagName, 
            user_id: user.id 
          }),
        });
        
        if (!response.ok) {
          console.warn(`Feature flag API error for '${flagName}':`, response.status);
          return defaultValue;
        }
        
        const data: FeatureFlagResponse = await response.json();
        return data.enabled;
      } catch (error) {
        console.error(`Error fetching feature flag '${flagName}':`, error);
        return defaultValue;
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
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
  
  return userInBucket(user.id, rolloutPercentage);
};
