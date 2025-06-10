
import { useState, useEffect } from 'react';
import { useCurrentUser } from './useCurrentUser';
import { supabase } from '@/integrations/supabase/client';

export interface TravelerInfoStatus {
  hasBasicInfo: boolean;
  hasPhoneNumber: boolean;
  isComplete: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to check if the current user has complete traveler information
 * This is the standardized version that should replace useTravelerInfoCheck
 */
export const useTravelerInfoStatus = (): TravelerInfoStatus => {
  const { userId, loading: userLoading } = useCurrentUser();
  const [status, setStatus] = useState<TravelerInfoStatus>({
    hasBasicInfo: false,
    hasPhoneNumber: false,
    isComplete: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (userLoading) return;
    
    if (!userId) {
      setStatus({
        hasBasicInfo: false,
        hasPhoneNumber: false,
        isComplete: false,
        loading: false,
        error: 'User not authenticated',
      });
      return;
    }

    const checkTravelerInfo = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, email, phone')
          .eq('id', userId)
          .single();

        if (error) {
          throw error;
        }

        const hasBasicInfo = !!(profile?.first_name && profile?.last_name && profile?.email);
        const hasPhoneNumber = !!profile?.phone;
        const isComplete = hasBasicInfo && hasPhoneNumber;

        setStatus({
          hasBasicInfo,
          hasPhoneNumber,
          isComplete,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error checking traveler info:', error);
        setStatus({
          hasBasicInfo: false,
          hasPhoneNumber: false,
          isComplete: false,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    checkTravelerInfo();
  }, [userId, userLoading]);

  return status;
};

// Export the original hook name for backward compatibility
export const useTravelerInfoCheck = useTravelerInfoStatus;
