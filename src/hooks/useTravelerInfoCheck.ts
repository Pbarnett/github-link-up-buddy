import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface UseTravelerInfoCheckReturn {
  hasTravelerInfo: boolean | null; // null when loading or error, true/false once checked
  isLoading: boolean;
  error: any;
  checkTravelerInfo: () => Promise<void>; // Function to manually re-trigger check if needed
}

export const useTravelerInfoCheck = (): UseTravelerInfoCheckReturn => {
  const { userId } = useCurrentUser();
  const [hasTravelerInfo, setHasTravelerInfo] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const performCheck = async () => {
    if (!userId) {
      // Cannot check if no user is logged in.
      // This case might need specific handling depending on where the hook is used.
      // For now, assume it means no traveler info for non-logged-in users.
      setHasTravelerInfo(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('booking_requests') // Assuming 'booking_requests' stores traveler profiles
        .select('id, traveler_data') // Select any field to check for existence, and traveler_data itself
        .eq('user_id', userId)
        .not('traveler_data', 'is', null) // Check that traveler_data is actually populated
        .limit(1); // We only need to know if at least one such record exists

      if (supabaseError) {
        throw supabaseError;
      }

      setHasTravelerInfo(data && data.length > 0 && !!data[0].traveler_data);
    } catch (err) {
      console.error('Error checking for traveler information:', err);
      setError(err);
      setHasTravelerInfo(false); // Assume false on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    performCheck();
  }, [userId]);

  return {
    hasTravelerInfo,
    isLoading,
    error,
    checkTravelerInfo: performCheck // Expose re-check function
  };
};
