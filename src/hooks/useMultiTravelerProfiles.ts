import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useCurrentUser } from './useCurrentUser';
export interface MultiTravelerProfile {
  id?: string;
  user_id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  nationality: string;
  passportNumber?: string;
  passportExpiry?: string;
  knownTravelerNumber?: string;
  redressNumber?: string;
  dietaryRestrictions?: string[];
  mobilityAssistance?: boolean;
  preferredSeat?:
    | 'window'
    | 'aisle'
    | 'middle'
    | 'no-preference';
  emailNotifications: boolean;
  isDefault: boolean;
  isActive: boolean;
  created_at?: string | undefined;
  updated_at?: string | undefined;
}

export function useMultiTravelerProfiles() {
  const { userId } = useCurrentUser();
  const queryClient = useQueryClient();

  // Fetch all traveler profiles for the current user
  const profilesQuery = useQuery<MultiTravelerProfile[]>({
    queryKey: ['multi-traveler-profiles', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await (supabase
        .from('traveler_profiles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true }) as any);

      if (error) throw error;

      // Transform the data to match our interface
      return (data || []).map(profile => {
        // Split full_name into firstName and lastName
        const nameParts = (profile.full_name || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        return {
          id: profile.id,
          user_id: profile.user_id,
          firstName,
          lastName,
          dateOfBirth: profile.date_of_birth || '',
          gender: profile.gender?.toLowerCase() as any,
          nationality: profile.passport_country || '',
          passportNumber: '', // Note: encrypted in DB, would need decryption function
          passportExpiry: profile.passport_expiry || '',
          knownTravelerNumber: profile.known_traveler_number || '',
          redressNumber: '', // Not in schema
          dietaryRestrictions: [], // Not in schema
          mobilityAssistance: false, // Not in schema
          preferredSeat: 'no-preference' as const, // Not in schema
          emailNotifications: true, // Default since no notification_preferences column
          isDefault: profile.is_primary || false,
          isActive: true, // All profiles are active (no soft delete in this schema)
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        };
      });
    },
    enabled: !!userId,
  });

  // Add new traveler profile
  const addTravelerMutation = useMutation({
    mutationFn: async (newTraveler: Omit<MultiTravelerProfile, 'id'>) => {
      if (!userId) throw new Error('User not authenticated');

      // If this is the first traveler or explicitly set as default,
      // make sure to unset other defaults first
      const currentProfiles = profilesQuery.data || [];
      if (newTraveler.isDefault || currentProfiles.length === 0) {
        await supabase
          .from('traveler_profiles')
          .update({ is_primary: false })
          .eq('user_id', userId);
      }

      const { data, error } = await supabase
        .from('traveler_profiles')
        .insert({
          user_id: userId,
          full_name: `${newTraveler.firstName} ${newTraveler.lastName}`.trim(),
          email: newTraveler.firstName + '@example.com', // Placeholder - this should come from user auth
          date_of_birth: newTraveler.dateOfBirth,
          gender: newTraveler.gender?.toUpperCase() || 'OTHER',
          passport_country: newTraveler.nationality,
          // Note: passport_number_encrypted would need encryption function
          passport_expiry: newTraveler.passportExpiry,
          known_traveler_number: newTraveler.knownTravelerNumber,
          is_primary: newTraveler.isDefault || currentProfiles.length === 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['multi-traveler-profiles', userId],
      });
      queryClient.invalidateQueries({ queryKey: ['traveler-profile', userId] }); // Refresh main profile
      toast({
        title: 'Traveler Added',
        description: 'New traveler profile has been created successfully.',
      });
    },
    onError: error => {
      console.error('Error adding traveler:', error);
      toast({
        title: 'Error',
        description: 'Failed to add traveler profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update existing traveler profile
  const updateTravelerMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<MultiTravelerProfile>;
    }) => {
      if (!userId) throw new Error('User not authenticated');

      // If setting as default, unset other defaults first
      if (updates.isDefault) {
        await supabase
          .from('traveler_profiles')
          .update({ is_primary: false })
          .eq('user_id', userId);
      }

      // Build update object with only defined fields
      const updateData: any = {};

      if (updates.firstName !== undefined || updates.lastName !== undefined) {
        const firstName = updates.firstName || '';
        const lastName = updates.lastName || '';
        updateData.full_name = `${firstName} ${lastName}`.trim();
      }

      if (updates.dateOfBirth !== undefined) {
        updateData.date_of_birth = updates.dateOfBirth;
      }

      if (updates.gender !== undefined) {
        updateData.gender = updates.gender?.toUpperCase() || 'OTHER';
      }

      if (updates.nationality !== undefined) {
        updateData.passport_country = updates.nationality;
      }

      if (updates.passportExpiry !== undefined) {
        updateData.passport_expiry = updates.passportExpiry;
      }

      if (updates.knownTravelerNumber !== undefined) {
        updateData.known_traveler_number = updates.knownTravelerNumber;
      }

      if (updates.isDefault !== undefined) {
        updateData.is_primary = updates.isDefault;
      }

      const { data, error } = await supabase
        .from('traveler_profiles')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['multi-traveler-profiles', userId],
      });
      queryClient.invalidateQueries({ queryKey: ['traveler-profile', userId] }); // Refresh main profile
      toast({
        title: 'Traveler Updated',
        description: 'Traveler profile has been updated successfully.',
      });
    },
    onError: error => {
      console.error('Error updating traveler:', error);
      toast({
        title: 'Error',
        description: 'Failed to update traveler profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete traveler profile (hard delete - this schema doesn't support soft delete)
  const deleteTravelerMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User not authenticated');

      // Prevent deleting the last/primary profile
      const currentProfiles = profilesQuery.data || [];
      if (currentProfiles.length === 1) {
        throw new Error('Cannot delete the last traveler profile');
      }

      const { error } = await supabase
        .from('traveler_profiles')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['multi-traveler-profiles', userId],
      });
      queryClient.invalidateQueries({ queryKey: ['traveler-profile', userId] }); // Refresh main profile
      toast({
        title: 'Traveler Removed',
        description: 'Traveler profile has been removed successfully.',
      });
    },
    onError: error => {
      console.error('Error deleting traveler:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove traveler profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Set default traveler
  const setDefaultTravelerMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User not authenticated');

      // First, unset all defaults
      await supabase
        .from('traveler_profiles')
        .update({ is_primary: false })
        .eq('user_id', userId);

      // Then set the selected one as default
      const { error } = await supabase
        .from('traveler_profiles')
        .update({ is_primary: true })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['multi-traveler-profiles', userId],
      });
      queryClient.invalidateQueries({ queryKey: ['traveler-profile', userId] }); // Refresh main profile
      toast({
        title: 'Default Updated',
        description: 'Default traveler has been changed successfully.',
      });
    },
    onError: error => {
      console.error('Error setting default traveler:', error);
      toast({
        title: 'Error',
        description: 'Failed to set default traveler. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    travelers: profilesQuery.data || [],
    isLoading: profilesQuery.isLoading,
    error: profilesQuery.error,
    addTraveler: addTravelerMutation.mutateAsync,
    updateTraveler: (id: string, updates: Partial<MultiTravelerProfile>) =>
      updateTravelerMutation.mutateAsync({ id, updates }),
    deleteTraveler: deleteTravelerMutation.mutateAsync,
    setDefaultTraveler: setDefaultTravelerMutation.mutateAsync,
    isAddingTraveler: addTravelerMutation.isPending,
    isUpdatingTraveler: updateTravelerMutation.isPending,
    isDeletingTraveler: deleteTravelerMutation.isPending,
    isSettingDefault: setDefaultTravelerMutation.isPending,
    refetch: profilesQuery.refetch,
  };
}
