import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PersonalizationData, PersonalizationError } from '@/types/personalization';
import { supabase } from '@/integrations/supabase/client';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { enablePersonalizationForTesting } from '@/lib/personalization/featureFlags';
import { 
  getUserVariant, 
  getExperimentConfig,
  trackABTestEvent,
  ABTestEvent 
} from '@/lib/personalization/abTesting';

interface PersonalizationContextType {
  personalizationData: PersonalizationData | null;
  loading: boolean;
  error: PersonalizationError | null;
  refreshPersonalizationData: () => Promise<void>;
  isPersonalizationEnabled: boolean;
  abTestVariant: string | null;
  experimentConfig: Record<string, any> | null;
  trackPersonalizationEvent: (eventType: 'exposure' | 'conversion' | 'engagement', eventName: string, metadata?: Record<string, any>) => Promise<void>;
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

interface PersonalizationProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export const PersonalizationProvider: React.FC<PersonalizationProviderProps> = ({ 
  children, 
  userId 
}) => {
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PersonalizationError | null>(null);
  
  // A/B testing integration
  const abTestVariant = userId ? getUserVariant(userId, 'personalizedGreetings') : null;
  const experimentConfig = userId ? getExperimentConfig(userId, 'personalizedGreetings') : null;
  
  // Feature flag check for controlled rollout (Alpha/Beta phases)
  // Now enhanced with A/B testing
  const featureFlagEnabled = useFeatureFlag('personalizedGreetings') ?? false;
  const temporaryFlagEnabled = enablePersonalizationForTesting();
  const abTestPersonalizationEnabled = experimentConfig?.enablePersonalization ?? false;
  const isPersonalizationEnabled = featureFlagEnabled || temporaryFlagEnabled || abTestPersonalizationEnabled;

  // A/B testing event tracking function
  const trackPersonalizationEvent = async (
    eventType: 'exposure' | 'conversion' | 'engagement',
    eventName: string,
    metadata?: Record<string, any>
  ) => {
    if (!userId || !abTestVariant) return;

    const event: ABTestEvent = {
      experimentId: 'personalizedGreetings',
      variantId: abTestVariant,
      userId,
      eventType,
      eventName,
      timestamp: new Date(),
      metadata,
    };

    await trackABTestEvent(event);
  };

  // Memoized value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    personalizationData,
    loading,
    error,
    refreshPersonalizationData: fetchPersonalizationData,
    isPersonalizationEnabled,
    abTestVariant,
    experimentConfig,
    trackPersonalizationEvent,
  }), [personalizationData, loading, error, isPersonalizationEnabled, abTestVariant, experimentConfig]);

  async function fetchPersonalizationData(): Promise<void> {
    if (!userId || !isPersonalizationEnabled) {
      setPersonalizationData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch user profile data - following data minimization principle
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw new Error(`Profile fetch failed: ${profileError.message}`);
      }

      // Fetch next trip data from trip_requests (optional enhancement)
      const { data: nextTrip, error: tripError } = await supabase
        .from('trip_requests')
        .select('destination_airport, destination_location_code')
        .eq('user_id', userId)
        .eq('auto_book_enabled', true)
        .order('earliest_departure', { ascending: true })
        .limit(1)
        .maybeSingle(); // Use maybeSingle to handle no results gracefully

      // Note: tripError for no results is expected and not an error condition
      if (tripError && tripError.code !== 'PGRST116') {
        console.warn('Next trip fetch failed:', tripError);
      }

      // Build personalization data with privacy-safe defaults
      const personalizationResult: PersonalizationData = {
        firstName: profile?.first_name || undefined,
        nextTripCity: nextTrip?.destination_airport || nextTrip?.destination_location_code || undefined,
        // loyaltyTier: undefined, // Can be added later
      };

      setPersonalizationData(personalizationResult);
      
      // Log analytics event (without exposing personal data)
      console.log('🎯 Personalization data loaded:', {
        hasFirstName: !!personalizationResult.firstName,
        hasNextTrip: !!personalizationResult.nextTripCity,
        userId: userId.slice(0, 8), // Log only partial ID for debugging
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const personalizationError: PersonalizationError = {
        type: 'fetch_failed',
        message: errorMessage,
        context: 'PersonalizationProvider.fetchPersonalizationData',
        fallbackUsed: true,
      };
      
      setError(personalizationError);
      setPersonalizationData(null);
      
      console.error('❌ Personalization fetch failed:', personalizationError);
    } finally {
      setLoading(false);
    }
  }

  // Fetch data when userId changes or feature is enabled
  useEffect(() => {
    if (userId && isPersonalizationEnabled) {
      fetchPersonalizationData();
    } else {
      setPersonalizationData(null);
      setLoading(false);
      setError(null);
    }
  }, [userId, isPersonalizationEnabled]);

  return (
    <PersonalizationContext.Provider value={contextValue}>
      {children}
    </PersonalizationContext.Provider>
  );
};

// Custom hook to use personalization context
export const usePersonalization = (): PersonalizationContextType => {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};

// Helper hook for easy access to personalization data
export const usePersonalizationData = (): PersonalizationData | null => {
  const { personalizationData, isPersonalizationEnabled } = usePersonalization();
  return isPersonalizationEnabled ? personalizationData : null;
};
