import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { usePersonalization } from '@/hooks/usePersonalization';

interface PersonalizationData {
  firstName?: string;
  nextTripCity?: string;
  personalizationEnabled: boolean;
}

interface PersonalizationContextType {
  personalizationData: PersonalizationData | null;
  isLoading: boolean;
  error: Error | null;
  trackEvent: (eventType: string, context?: any) => void;
  refetch: () => void;
}

const PersonalizationContext = createContext<PersonalizationContextType | null>(null);

export interface PersonalizationProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export function PersonalizationProvider({ 
  children, 
  userId 
}: PersonalizationProviderProps) {
  const { 
    personalizationData, 
    isLoading, 
    error, 
    trackEvent, 
    refetch 
  } = usePersonalization(userId);
  
  const contextValue = useMemo(() => ({
    personalizationData: personalizationData ?? null,
    isLoading,
    error,
    trackEvent: useCallback((eventType: string, context?: any) => {
      trackEvent({ eventType, context });
    }, [trackEvent]),
    refetch
  }), [personalizationData, isLoading, error, trackEvent, refetch]);
  
  return (
    <PersonalizationContext.Provider value={contextValue}>
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalizationContext() {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalizationContext must be used within PersonalizationProvider');
  }
  return context;
}

export type { PersonalizationData, PersonalizationContextType };
