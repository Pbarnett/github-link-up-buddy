import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "./useCurrentUser";
import { toast } from "@/hooks/use-toast";
import { profileCompletenessService } from "@/services/profileCompletenessService";

export interface TravelerProfile {
  id?: string;
  user_id?: string;
  full_name: string;
  date_of_birth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  email: string;
  phone?: string;
  phone_verified?: boolean;
  passport_number?: string;
  passport_country?: string;
  passport_expiry?: string;
  known_traveler_number?: string;
  is_primary?: boolean;
  is_verified?: boolean;
  verification_level?: 'basic' | 'enhanced' | 'premium';
  profile_completeness_score?: number;
  travel_preferences?: any;
  notification_preferences?: any;
  created_at?: string;
  updated_at?: string;
  last_profile_update?: string;
}

export interface ProfileCompletionData {
  completion_percentage: number;
  missing_fields: string[];
  recommendations: any[];
  last_calculated: string;
}

export function useTravelerProfile() {
  const { userId } = useCurrentUser();
  const queryClient = useQueryClient();

  // Get traveler profile
  const profileQuery = useQuery<TravelerProfile | null>({
    queryKey: ["traveler-profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("traveler_profiles")
        .select(`
          *,
          profile_completion_tracking(
            completion_percentage,
            missing_fields,
            recommendations,
            last_calculated
          )
        `)
        .eq("user_id", userId)
        .eq("is_primary", true)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Get profile completion data
  const completionQuery = useQuery<ProfileCompletionData | null>({
    queryKey: ["profile-completion", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("profile_completion_tracking")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Get recommendations
  const recommendationsQuery = useQuery({
    queryKey: ["profile-recommendations", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .rpc("get_profile_recommendations", { profile_user_id: userId });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // Create or update traveler profile
  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<TravelerProfile>) => {
      if (!userId) throw new Error("User not authenticated");
      
      const { data: existingProfile } = await supabase
        .from("traveler_profiles")
        .select("id")
        .eq("user_id", userId)
        .eq("is_primary", true)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from("traveler_profiles")
          .update(updates)
          .eq("id", existingProfile.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from("traveler_profiles")
          .insert({
            ...updates,
            user_id: userId,
            is_primary: true,
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["traveler-profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["profile-completion", userId] });
      queryClient.invalidateQueries({ queryKey: ["profile-recommendations", userId] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Phone verification mutation
  const verifyPhoneMutation = useMutation({
    mutationFn: async (phoneNumber: string) => {
      if (!userId) throw new Error("User not authenticated");
      
      // Call SMS verification endpoint
      const response = await fetch("/api/send-verification-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) {
        throw new Error("Failed to send verification SMS");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Verification SMS sent",
        description: "Please check your phone for the verification code.",
      });
    },
    onError: (error) => {
      console.error("Error sending verification SMS:", error);
      toast({
        title: "Error",
        description: "Failed to send verification SMS. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Calculate client-side completeness (fallback if DB calculation not available)
  const calculateCompleteness = (profile: TravelerProfile | null) => {
    if (!profile) return { overall: 0, recommendations: [] };
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
