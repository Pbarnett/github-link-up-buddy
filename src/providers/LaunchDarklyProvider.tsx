import * as React from 'react';
import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  initialize,
  LDClient,
  LDContext,
  LDFlagSet,
  LDFlagValue,
} from 'launchdarkly-js-client-sdk';

interface LaunchDarklyContextValue {
  isInitialized: boolean;
  error: Error | undefined;
  flags: LDFlagSet;
  client: LDClient | null;

  // Flag evaluation methods
  getBooleanFlag: (key: string, defaultValue: boolean) => boolean;
  getStringFlag: (key: string, defaultValue: string) => string;
  getNumberFlag: (key: string, defaultValue: number) => number;
  getJsonFlag: <T extends any>(key: string, defaultValue: T) => T;

  // Analytics methods
  track: (eventName: string, data?: any, metricValue?: number) => void;
  identify: (context: LDContext) => Promise<void>;

  // Utility methods
  getAllFlags: () => LDFlagSet;
}

const LaunchDarklyContext = React.createContext<
  LaunchDarklyContextValue | undefined
>(undefined);

interface LaunchDarklyProviderProps {
  children: React.ReactNode;
  clientSideID?: string;
  context?: LDContext;
}

export const LaunchDarklyProvider: React.FC<LaunchDarklyProviderProps> = ({
  children,
  clientSideID,
  context,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [flags, setFlags] = useState<LDFlagSet>({});
  const [client, setClient] = useState<LDClient | null>(null);

  // Get client ID from props or environment
  const ldClientId = clientSideID || import.meta.env.VITE_LD_CLIENT_ID;

  // Default context for anonymous users
  const defaultContext: LDContext = useMemo(
    () => ({
      kind: 'user',
      key: 'anonymous-user',
      anonymous: true,
    }),
    []
  );

  const userContext = context || defaultContext;

  useEffect(() => {
    if (!ldClientId) {
      console.error(
        'LaunchDarkly client ID is required. Set VITE_LD_CLIENT_ID in your environment.'
      );
      setError(new Error('LaunchDarkly client ID is missing'));
      return;
    }

    console.log('Initializing LaunchDarkly client...');

    try {
      // Initialize the LaunchDarkly client
      const ldClient = initialize(ldClientId, userContext, {
        bootstrap: 'localStorage',
        sendEvents: import.meta.env.MODE !== 'test',
        allAttributesPrivate: true,
        privateAttributes: ['email', 'name', 'ip'],
      });

      setClient(ldClient);

      // Wait for initialization
      ldClient
        .waitForInitialization()
        .then(() => {
          console.log('LaunchDarkly client initialized successfully');
          setIsInitialized(true);
          setFlags(ldClient.allFlags());
        })
        .catch(err => {
          console.error('LaunchDarkly initialization failed:', err);
          setError(err);
          setIsInitialized(true); // Still mark as initialized to prevent hanging
        });

      // Listen for flag changes
      const handleFlagChange = (changes: LDFlagSet) => {
        setFlags(prevFlags => ({ ...prevFlags, ...changes }));
      };

      ldClient.on('change', handleFlagChange);

      // Cleanup function
      return () => {
        ldClient.off('change', handleFlagChange);
        ldClient.close();
      };
    } catch (err) {
      console.error('Error initializing LaunchDarkly:', err);
      setError(err as Error);
      setIsInitialized(true);
      // Return empty cleanup function in case of error
      return () => {};
    }
  }, [ldClientId, userContext]);

  // Flag evaluation methods with error handling
  const getBooleanFlag = useCallback(
    (key: string, defaultValue: boolean): boolean => {
      try {
        if (!client || !isInitialized) return defaultValue;
        return client.variation(key, defaultValue);
      } catch (err) {
        console.warn(`Error evaluating boolean flag ${key}:`, err);
        return defaultValue;
      }
    },
    [client, isInitialized]
  );

  const getStringFlag = useCallback(
    (key: string, defaultValue: string): string => {
      try {
        if (!client || !isInitialized) return defaultValue;
        return client.variation(key, defaultValue);
      } catch (err) {
        console.warn(`Error evaluating string flag ${key}:`, err);
        return defaultValue;
      }
    },
    [client, isInitialized]
  );

  const getNumberFlag = useCallback(
    (key: string, defaultValue: number): number => {
      try {
        if (!client || !isInitialized) return defaultValue;
        return client.variation(key, defaultValue);
      } catch (err) {
        console.warn(`Error evaluating number flag ${key}:`, err);
        return defaultValue;
      }
    },
    [client, isInitialized]
  );

  const getJsonFlag = useCallback(
    <T extends any>(key: string, defaultValue: T): T => {
      try {
        if (!client || !isInitialized) return defaultValue;
        return client.variation(key, defaultValue);
      } catch (err) {
        console.warn(`Error evaluating JSON flag ${key}:`, err);
        return defaultValue;
      }
    },
    [client, isInitialized]
  );

  // Analytics methods
  const track = useCallback(
    (eventName: string, data?: any, metricValue?: number): void => {
      if (!client) {
        console.warn('LaunchDarkly client not available for tracking');
        return;
      }

      try {
        if (metricValue !== undefined) {
          client.track(eventName, data, metricValue);
        } else {
          client.track(eventName, data);
        }
      } catch (err) {
        console.error(`Error tracking event ${eventName}:`, err);
      }
    },
    [client]
  );

  const identify = useCallback(
    async (newContext: LDContext): Promise<void> => {
      if (!client) {
        console.warn('LaunchDarkly client not available for identification');
        return;
      }

      try {
        await client.identify(newContext);
        // Update flags after context change
        setFlags(client.allFlags());
      } catch (err) {
        console.error('Error identifying context:', err);
      }
    },
    [client]
  );

  // Utility methods
  const getAllFlags = useCallback((): LDFlagSet => {
    return flags || {};
  }, [flags]);

  const contextValue: LaunchDarklyContextValue = {
    isInitialized,
    error,
    flags: flags || {},
    client,
    getBooleanFlag,
    getStringFlag,
    getNumberFlag,
    getJsonFlag,
    track,
    identify,
    getAllFlags,
  };

  return (
    <LaunchDarklyContext.Provider value={contextValue}>
      {children}
    </LaunchDarklyContext.Provider>
  );
};

export const useLaunchDarkly = (): LaunchDarklyContextValue => {
  const context = useContext(LaunchDarklyContext);
  if (!context) {
    throw new Error(
      'useLaunchDarkly must be used within a LaunchDarklyProvider'
    );
  }
  return context;
};
