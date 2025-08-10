import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
  // Test override acts as a master switch: if it returns false, personalization is OFF regardless of other flags
  const featureFlagEnabled = useFeatureFlag('personalizedGreetings') ?? false;
  const testingOverride = enablePersonalizationForTesting();
  const abTestPersonalizationEnabled = experimentConfig?.enablePersonalization ?? false;
  const isPersonalizationEnabled = (testingOverride === false)
    ? false
    : Boolean((testingOverride === true) || featureFlagEnabled || abTestPersonalizationEnabled);

  // A/B testing event tracking function (stabilized)
  const trackPersonalizationEvent = useCallback(async (
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
  }, [userId, abTestVariant]);

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
    // Double-guard: bail out entirely in test mode if personalization is disabled
    if (typeof window !== 'undefined' && (window as any).DISABLE_PERSONALIZATION_FOR_TESTS) {
      setLoading(false);
      setPersonalizationData(null);
      return;
    }

    if (!userId || !isPersonalizationEnabled) {
      setPersonalizationData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Ensure we send the user's JWT so the Edge Function can authenticate
      const { data: sessionData } = await supabase.auth.getSession();
      const jwt = sessionData?.session?.access_token;
      if (!jwt) {
        throw new Error('No active session token available for personalization request');
      }

      // Call the deployed edge function for personalization data
      const { data: personalizationResult, error: functionError } = await supabase.functions.invoke(
        'get-personalization-data',
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
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
      const nextData: PersonalizationData = {
        firstName: personalizationResult.firstName || undefined,
        nextTripCity: personalizationResult.nextTripCity || undefined,
        // loyaltyTier: undefined, // Can be added later
      };

      // Avoid unnecessary state updates if data hasn't changed
      const sameAsCurrent = personalizationData?.firstName === nextData.firstName && personalizationData?.nextTripCity === nextData.nextTripCity;
      if (!sameAsCurrent) {
        setPersonalizationData(nextData);
      }
      
      // Log analytics event (without exposing personal data)
      console.log('🎯 Personalization data loaded from edge function:', {
        hasFirstName: !!nextData.firstName,
        hasNextTrip: !!nextData.nextTripCity,
        userId: userId.slice(0, 8), // Log only partial ID for debugging
        functionResponse: {
          personalizationEnabled: personalizationResult.personalizationEnabled,
        },
      });

      // Track successful data fetch
      await trackPersonalizationEvent('exposure', 'data_fetched', {
        hasFirstName: !!nextData.firstName,
        hasNextTrip: !!nextData.nextTripCity,
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
