import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { Database } from '@/integrations/supabase/types';

// Define the shape of the traveler info status
export type TravelerInfoStatus = {
  isComplete: boolean;
  missingFields: string[];
  completionPercentage: number;
  requiresInternational: string[]; // Fields required for international travel
};

// Define the expected structure of traveler_data from booking_requests
// This should align with what TravelerDataForm collects and what your checks depend on.
type TravelerDetails = {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  passportNumber?: string;
  // Add other fields that might be part of traveler_data
  nationality?: string; // Example: important for international checks
  documentExpiryDate?: string; // Example: important for international checks
};

// Define the expected shape of profile data
type ProfileData = {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
};

export const useTravelerInfoStatus = (): { status: TravelerInfoStatus | null; isLoading: boolean; error: any } => {
  const { userId } = useCurrentUser();
  const [status, setStatus] = useState<TravelerInfoStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchTravelerInfo = async () => {
      if (!userId) {
        setStatus({
          isComplete: false,
          missingFields: ['userId'],
          completionPercentage: 0,
          requiresInternational: [],
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // 1. Fetch profile data (assuming email and phone are relevant for completion)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email, phone, first_name, last_name')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // If profile is crucial and not found, you might want to throw or handle
        }

        // 2. Fetch traveler details (from booking_requests table, traveler_data column)
        //    We fetch the most recent booking_request with traveler_data for this user.
        //    Adjust if traveler details are stored differently (e.g., a dedicated traveler_details table).
        const { data: travelerRequestData, error: travelerError } = await supabase
          .from('booking_requests')
          .select('traveler_data')
          .eq('user_id', userId)
          .not('traveler_data', 'is', null)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (travelerError && travelerError.code !== 'PGRST116') { // PGRST116: no rows found, which is a valid case
          throw travelerError;
        }

        const travelerDetails: TravelerDetails = travelerRequestData?.traveler_data as TravelerDetails || {};
        const profile: Partial<ProfileData> = profileData || {};

        // --- Calculate Status ---
        const missingFields: string[] = [];
        const totalFields = 7; // Adjusted to include passportNumber in the core count
        let completedFields = 0;

        // Profile checks (can be from 'profiles' or 'traveler_details' depending on your data model)
        if (profile.first_name) completedFields++; else missingFields.push('profile.first_name');
        if (profile.last_name) completedFields++; else missingFields.push('profile.last_name');
        if (profile.email) completedFields++; else missingFields.push('profile.email');
        // if (profile.phone) completedFields++; else missingFields.push('profile.phone');


        // TravelerDetails checks (from traveler_data JSON in booking_requests)
        if (travelerDetails.firstName) completedFields++; else missingFields.push('travelerDetails.firstName');
        if (travelerDetails.lastName) completedFields++; else missingFields.push('travelerDetails.lastName');
        if (travelerDetails.dateOfBirth) completedFields++; else missingFields.push('travelerDetails.dateOfBirth');
        // if (travelerDetails.gender) completedFields++; else missingFields.push('travelerDetails.gender'); // Assuming gender is optional or handled differently

        // International travel specific checks
        const requiresInternational: string[] = [];
        if (!travelerDetails.passportNumber) {
            missingFields.push('travelerDetails.passportNumber');
            requiresInternational.push('travelerDetails.passportNumber');
        } else {
            completedFields++;
        }
        // Example: Add more international fields if necessary
        // if (!travelerDetails.nationality) requiresInternational.push('travelerDetails.nationality');
        // if (!travelerDetails.documentExpiryDate) requiresInternational.push('travelerDetails.documentExpiryDate');


        const completionPercentage = Math.round((completedFields / totalFields) * 100);
        const isComplete = missingFields.length === 0;

        setStatus({
          isComplete,
          missingFields,
          completionPercentage,
          requiresInternational,
        });

      } catch (err) {
        console.error('Error fetching traveler info status:', err);
        setError(err);
        setStatus({ // Provide a default error status
          isComplete: false,
          missingFields: ['fetchError'],
          completionPercentage: 0,
          requiresInternational: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelerInfo();
  }, [userId]);

  return { status, isLoading, error };
};
