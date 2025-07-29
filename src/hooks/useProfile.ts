import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useCurrentUser } from './useCurrentUser';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { userId } = useCurrentUser();
  const queryClient = useQueryClient();

  const query = useQuery<Profile | null>({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!userId,
  });

  const updateMutation = useMutation({
    mutationFn: async (
      updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
    ) => {
      if (!userId) throw new Error('User not authenticated');

      // Check if profile exists first
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('id', userId)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new profile - need to provide required fields
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) throw new Error('User email is required');

        const { data, error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: user.email,
            ...updates,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
