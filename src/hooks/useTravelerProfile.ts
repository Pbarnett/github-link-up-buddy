import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { profileCompletenessService } from '@/services/profileCompletenessService';
import { useCurrentUser } from './useCurrentUser';
export interface TravelerProfile {
  id?: string;
  user_id?: string;
  full_name: string;
  date_of_birth: string;
  gender: string; // DB stores string, not enum
  email: string;
  phone?: string | null;
  phone_verified?: boolean | null;
  passport_number?: string | null;
  passport_country?: string | null;
  passport_expiry?: string | null;
  known_traveler_number?: string | null;
  is_primary?: boolean | null;
  is_verified?: boolean | null;
  verification_level?: string | null;
  profile_completeness_score?: number | null;
  travel_preferences?: any | null; // Matches Json type
  notification_preferences?: any | null; // Matches Json type
  created_at?: string | null;
  updated_at?: string | null;
  last_profile_update?: string | null;
}

export interface ProfileCompletionData {
  completion_percentage: number;
  missing_fields: string[] | null;
  recommendations: any | null; // Matches Json type from Supabase
  last_calculated: string | null;
}

export function useTravelerProfile() {
  const { userId } = useCurrentUser();
  const queryClient = useQueryClient();

  // Get traveler profile
  const profileQuery = useQuery<TravelerProfile | null>({
    queryKey: ['traveler-profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('traveler_profiles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_primary', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Get profile completion data
  const completionQuery = useQuery<ProfileCompletionData | null>({
    queryKey: ['profile-completion', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profile_completion_tracking')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Get recommendations
  const recommendationsQuery = useQuery({
    queryKey: ['profile-recommendations', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase.rpc(
        'get_profile_recommendations',
        { profile_user_id: userId }
      );

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // Create or update traveler profile
  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<TravelerProfile>) => {
      if (!userId) throw new Error('User not authenticated');

      const { data: existingProfile } = await supabase
        .from('traveler_profiles')
        .select('id')
        .eq('user_id', userId)
        .eq('is_primary', true)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('traveler_profiles')
          .update(updates)
          .eq('id', existingProfile.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new profile - ensure required fields are provided
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) throw new Error('User email is required');
        
        // Prepare insert data with required fields
        const insertData = {
          user_id: userId,
          email: user.email,
          full_name: updates.full_name || 'User Profile',
          date_of_birth: updates.date_of_birth || '1990-01-01',
          gender: updates.gender || 'OTHER',
          is_primary: true,
          ...updates, // Override with any specific updates
        };

        const { data, error } = await supabase
          .from('traveler_profiles')
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['traveler-profile', userId] });
      queryClient.invalidateQueries({
        queryKey: ['profile-completion', userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['profile-recommendations', userId],
      });
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    },
    onError: error => {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Phone verification mutation
  const verifyPhoneMutation = useMutation({
    mutationFn: async (phoneNumber: string) => {
      if (!userId) throw new Error('User not authenticated');

      // Call SMS verification endpoint
      const response = await fetch('/api/send-verification-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification SMS');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Verification SMS sent',
        description: 'Please check your phone for the verification code.',
      });
    },
    onError: error => {
      console.error('Error sending verification SMS:', error);
      toast({
        title: 'Error',
        description: 'Failed to send verification SMS. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Calculate client-side completeness (fallback if DB calculation not available)
  const calculateCompleteness = (profile: TravelerProfile | null) => {
    if (!profile) {
      return {
        overall: 0,
        categories: {
          basic_info: 0,
          contact_info: 0,
          travel_documents: 0,
          preferences: 0,
          verification: 0,
        },
        missing_fields: [],
        recommendations: [],
      };
    }
    return profileCompletenessService.calculateCompleteness(profile);
  };

  return {
    profile: profileQuery.data,
    completion: completionQuery.data,
    recommendations: recommendationsQuery.data,
    isLoading: profileQuery.isLoading,
    isUpdating: updateMutation.isPending,
    updateProfile: updateMutation.mutate,
    verifyPhone: verifyPhoneMutation.mutate,
    isVerifyingPhone: verifyPhoneMutation.isPending,
    calculateCompleteness,
    refetch: () => {
      profileQuery.refetch();
      completionQuery.refetch();
      recommendationsQuery.refetch();
    },
  };
}
