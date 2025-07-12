import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PersonalizationData } from '@/context/PersonalizationContext';

interface TrackEventParams {
  eventType: string;
  context?: any;
}

/**
 * Hook for managing personalization data with React Query
 * Provides caching, error handling, and analytics tracking
 */
export function usePersonalization(userId?: string) {
  const queryClient = useQueryClient();

  // Main query for personalization data
  const query = useQuery<PersonalizationData | null>({
    queryKey: ['personalization', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        const { data, error } = await supabase.functions.invoke('get-personalization-data', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (error) {
          console.error('Error fetching personalization data:', error);
          
          // Track error event
          trackEventMutation.mutate({
            eventType: 'personalization_error',
            context: { 
              error: error.message,
              userId,
              timestamp: new Date().toISOString()
            }
          });
          
          return null;
        }
        
        return data;
      } catch (err) {
        console.error('Personalization fetch failed:', err);
        
        // Track error event
        trackEventMutation.mutate({
          eventType: 'personalization_error',
          context: { 
            error: err instanceof Error ? err.message : 'Unknown error',
            userId,
            timestamp: new Date().toISOString()
          }
        });
        
        return null;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (was cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Mutation for tracking events
  const trackEventMutation = useMutation({
    mutationFn: async (params: TrackEventParams) => {
      if (!userId) return;
      
      try {
        const { error } = await supabase.from('personalization_events').insert({
          user_id: userId,
          event_type: params.eventType,
          context: params.context || {},
          created_at: new Date().toISOString(),
        });
        
        if (error) {
          console.error('Error tracking personalization event:', error);
        }
      } catch (err) {
        console.error('Event tracking failed:', err);
      }
    },
    onSuccess: () => {
      // Optionally invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['personalization-events', userId]
      });
    },
  });

  // Opt-out mutation
  const optOutMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      
      const { error } = await supabase
        .from('profiles')
        .update({ personalization_enabled: false })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch personalization data
      queryClient.invalidateQueries({
        queryKey: ['personalization', userId]
      });
      
      // Track opt-out event
      trackEventMutation.mutate({
        eventType: 'personalization_opt_out',
        context: { 
          userId,
          timestamp: new Date().toISOString()
        }
      });
    },
  });

  return {
    personalizationData: query.data,
    isLoading: query.isLoading,
    error: query.error,
    trackEvent: trackEventMutation.mutate,
    refetch: query.refetch,
    optOut: optOutMutation.mutate,
    isOptingOut: optOutMutation.isPending,
  };
}

/**
 * Hook for checking if personalization is enabled
 */
export function usePersonalizationEnabled(userId?: string) {
  const { personalizationData, isLoading } = usePersonalization(userId);
  
  return {
    isEnabled: personalizationData?.personalizationEnabled ?? false,
    isLoading,
  };
}

/**
 * Hook for getting personalized greeting
 */
export function usePersonalizedGreeting(userId?: string) {
  const { personalizationData, isLoading, trackEvent } = usePersonalization(userId);
  
  const getGreeting = () => {
    if (!personalizationData?.personalizationEnabled) {
      return 'Welcome back!';
    }
    
    const firstName = personalizationData.firstName;
    const nextTripCity = personalizationData.nextTripCity;
    
    let greeting = 'Welcome back';
    
    if (firstName) {
      greeting += `, ${firstName}`;
    }
    
    if (nextTripCity) {
      greeting += `! Ready for ${nextTripCity}?`;
    } else {
      greeting += '!';
    }
    
    // Track greeting shown event
    trackEvent({
      eventType: 'greeting_shown',
      context: {
        hasName: !!firstName,
        hasNextTrip: !!nextTripCity,
        greeting,
        timestamp: new Date().toISOString()
      }
    });
    
    return greeting;
  };
  
  return {
    greeting: getGreeting(),
    isLoading,
    hasPersonalization: !!personalizationData?.personalizationEnabled,
  };
}
