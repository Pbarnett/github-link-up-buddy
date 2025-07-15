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
experimentConfig: Record<string, unknown> | null;
  trackPersonalizationEvent: (eventType: 'exposure' | 'conversion' | 'engagement', eventName: string, metadata?: Record<string, unknown>) => Promise<void>;
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
  const isPersonalizationEnabled: boolean = featureFlagEnabled || temporaryFlagEnabled || abTestPersonalizationEnabled;

  // A/B testing event tracking function
  const trackPersonalizationEvent = async (
    eventType: 'exposure' | 'conversion' | 'engagement',
    eventName: string,
metadata?: Record<string, unknown>
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
  }), [personalizationData, loading, error, isPersonalizationEnabled, abTestVariant, experimentConfig, trackPersonalizationEvent]);

  async function fetchPersonalizationData(): Promise<void> {
    if (!userId || !isPersonalizationEnabled) {
      setPersonalizationData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the deployed edge function for personalization data
      const { data: personalizationResult, error: functionError } = await supabase.functions.invoke(
        'get-personalization-data',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (functionError) {
        throw new Error(`Edge function failed: ${functionError.message}`);
      }

      if (!personalizationResult) {
        throw new Error('No personalization data returned from edge function');
      }

      // Edge function returns: { firstName, nextTripCity, personalizationEnabled }
      const personalizationData: PersonalizationData = {
        firstName: personalizationResult.firstName || undefined,
        nextTripCity: personalizationResult.nextTripCity || undefined,
        // loyaltyTier: undefined, // Can be added later
      };

      setPersonalizationData(personalizationData);
      
      // Log analytics event (without exposing personal data)
      console.log('🎯 Personalization data loaded from edge function:', {
        hasFirstName: !!personalizationData.firstName,
        hasNextTrip: !!personalizationData.nextTripCity,
        userId: userId.slice(0, 8), // Log only partial ID for debugging
        functionResponse: {
          personalizationEnabled: personalizationResult.personalizationEnabled,
        },
      });

      // Track successful data fetch
      await trackPersonalizationEvent('exposure', 'data_fetched', {
        hasFirstName: !!personalizationData.firstName,
        hasNextTrip: !!personalizationData.nextTripCity,
        source: 'edge_function',
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
      
      // Track error event
      await trackPersonalizationEvent('exposure', 'data_fetch_failed', {
        error: errorMessage,
        source: 'edge_function',
      });
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
