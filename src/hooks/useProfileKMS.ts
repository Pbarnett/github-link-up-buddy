import * as React from 'react';
// Hook for useProfile with KMS encryption

import { profileServiceKMS, UserProfile } from '@/services/api/profileApiKMS';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';

export interface UseProfileKMSReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error?: Error;
  refetch: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<UserProfile>;
  clearError: () => void;
}

export const useProfileKMS = (): UseProfileKMSReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(undefined);

      const userProfile = await profileServiceKMS.getProfile();
      setProfile(userProfile);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch profile')
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
      try {
        setError(undefined);
        const updatedProfile =
          await profileServiceKMS.updateProfile(profileData);
        setProfile(updatedProfile);
        return updatedProfile;
      } catch (err) {
        console.error('Error updating profile:', err);
        const error =
          err instanceof Error ? err : new Error('Failed to update profile');
        setError(error);
        throw error;
      }
    },
    []
  );

  const refetch = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile,
    clearError,
  };
};
