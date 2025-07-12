import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';

// Personalization data structure
interface PersonalizationData {
  hasFirstName: boolean;
  hasNextTrip: boolean;
  isComplete: boolean;
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface PersonalizationContextType {
  personalizationData: PersonalizationData;
  refreshPersonalization: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

// Check for test environment
const isTestEnvironment = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    ((window as any).__PLAYWRIGHT_TEST__ || 
     (window as any).__TEST_ENV__ ||
     navigator.userAgent.includes('Playwright') ||
     process.env.NODE_ENV === 'test')
  );
};

// Feature flag to enable/disable personalization
const enablePersonalizationForTesting = (): boolean => {
  if (isTestEnvironment()) {
    return !(window as any).__DISABLE_PERSONALIZATION__;
  }
  return true;
};

// Default personalization data
const defaultPersonalizationData: PersonalizationData = {
  hasFirstName: false,
  hasNextTrip: false,
  isComplete: false,
  loading: false,
  error: null,
  success: true,
};

// Mock data for testing
const mockPersonalizationData: PersonalizationData = {
  hasFirstName: true,
  hasNextTrip: false,
  isComplete: true,
  loading: false,
  error: null,
  success: true,
};

let personalizationCallCount = 0;
let personalizationCache: PersonalizationData | null = null;

export const PersonalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = useCurrentUser();
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData>(defaultPersonalizationData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize the fetch function to prevent recreation on every render
  const fetchPersonalizationData = useCallback(async (): Promise<PersonalizationData> => {
    if (!userId) {
      return defaultPersonalizationData;
    }

    // Check if personalization is disabled for testing
    if (!enablePersonalizationForTesting()) {
      console.log('Personalization disabled for testing');
      return mockPersonalizationData;
    }

    // Return cached data if available
    if (personalizationCache) {
      console.log('Returning cached personalization data');
      return personalizationCache;
    }

    try {
      personalizationCallCount++;
      console.log(`Fetching personalization data (call #${personalizationCallCount})`);

      const { data, error } = await supabase.functions.invoke('get-personalization-data', {
        body: { userId }
      });

      if (error) {
        console.error('Personalization fetch error:', error);
        // Return cached data or default data on error
        return personalizationCache || defaultPersonalizationData;
      }

      const result: PersonalizationData = {
        hasFirstName: data?.hasFirstName ?? false,
        hasNextTrip: data?.hasNextTrip ?? false,
        isComplete: data?.isComplete ?? false,
        loading: false,
        error: null,
        success: true,
      };

      // Cache the result
      personalizationCache = result;
      console.log('Personalization data cached:', result);
      
      return result;
    } catch (error) {
      console.error('Personalization fetch exception:', error);
      // Return cached data or default data on exception
      return personalizationCache || defaultPersonalizationData;
    }
  }, [userId]); // Only depend on userId

  // Memoize the refresh function
  const refreshPersonalization = useCallback(async (): Promise<void> => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchPersonalizationData();
      setPersonalizationData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch personalization data';
      setError(errorMessage);
      console.error('Error in refreshPersonalization:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchPersonalizationData]);

  // Effect to initialize personalization data
  useEffect(() => {
    if (userId) {
      refreshPersonalization();
    } else {
      // Reset to default when no user
      setPersonalizationData(defaultPersonalizationData);
      setError(null);
    }
  }, [userId, refreshPersonalization]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    personalizationData,
    refreshPersonalization,
    isLoading,
    error,
  }), [personalizationData, refreshPersonalization, isLoading, error]);

  return (
    <PersonalizationContext.Provider value={contextValue}>
      {children}
    </PersonalizationContext.Provider>
  );
};

export const usePersonalization = (): PersonalizationContextType => {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};

// Export for testing
export { personalizationCallCount };

// Reset function for testing
export const resetPersonalizationForTesting = (): void => {
  personalizationCallCount = 0;
  personalizationCache = null;
};
