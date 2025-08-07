
/**
 * LaunchDarkly React Client Integration
 * Comprehensive client-side implementation with hooks and context management
 */

import React from 'react';
import {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  createContext,
  ComponentType,

import {
  LDProvider,
  LDClient,
  LDContext,
  useLDClient,
  useFlags,
  useLDClientError,
  withLDProvider,
  LDFlagSet,
  LDFlagValue,

../../hooks/useCurrentUser';
./context-builder';

// Client-side configuration
const CLIENT_SIDE_CONFIG = {
  bootstrap: 'localStorage', // Cache flags in localStorage
  hash: undefined, // Let LD generate the hash
  baseUri: process.env.LAUNCHDARKLY_BASE_URI,
  streamUri: process.env.LAUNCHDARKLY_STREAM_URI,
  eventsUri: process.env.LAUNCHDARKLY_EVENTS_URI,
  sendEvents: process.env.NODE_ENV !== 'test',
  allAttributesPrivate: true,
  privateAttributes: ['email', 'name', 'ip'],
  sendEventsOnlyForVariation: true,
  flushInterval: 10000,
  streamReconnectDelay: 1000,
  useReport: false,
  withCredentials: false,
  timeout: 5000,
};

interface LaunchDarklyState {
  isInitialized: boolean;
  error: Error | undefined;
  flags: LDFlagSet;
  client: LDClient | undefined;
}

interface LaunchDarklyContextValue extends LaunchDarklyState {
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
  getFlagDetail: (
    key: string,
    defaultValue: any
  ) => { value: any; reason?: any };
}

const LaunchDarklyContext = createContext<LaunchDarklyContextValue | undefined>(
  undefined
);

// Hook to access LaunchDarkly functionality
export function useLaunchDarkly(): LaunchDarklyContextValue {
  const context = useContext(LaunchDarklyContext);
  if (!context) {
    throw new Error('useLaunchDarkly must be used within LaunchDarklyProvider');
  }
  return context;
}

// Feature flag hooks
export function useFeatureFlag(
  flagKey: string,
  defaultValue: boolean = false
): boolean {
  const { getBooleanFlag } = useLaunchDarkly();
  return getBooleanFlag(flagKey, defaultValue);
}

export function useStringFlag(
  flagKey: string,
  defaultValue: string = ''
): string {
  const { getStringFlag } = useLaunchDarkly();
  return getStringFlag(flagKey, defaultValue);
}

export function useNumberFlag(
  flagKey: string,
  defaultValue: number = 0
): number {
  const { getNumberFlag } = useLaunchDarkly();
  return getNumberFlag(flagKey, defaultValue);
}

export function useJsonFlag<T extends any>(
  flagKey: string,
  defaultValue: T
): T {
  const { getJsonFlag } = useLaunchDarkly();
  return getJsonFlag(flagKey, defaultValue);
}

// Multi-flag hook for performance
export function useFeatureFlags(
  flagKeys: string[]
): Record<string, LDFlagValue> {
  const { getAllFlags } = useLaunchDarkly();
  const allFlags = getAllFlags();

  return useMemo(() => {
    return flagKeys.reduce(
      (acc, key) => {
        acc[key] = allFlags[key];
        return acc;
      },
      {} as Record<string, LDFlagValue>
    );
  }, [allFlags, flagKeys]);
}

// Flag change subscription hook
export function useFlagChangeListener(
  flagKey: string,
  callback: (value: LDFlagValue) => void
): void {
  const { client, flags } = useLaunchDarkly();

  useEffect(() => {
    if (!client) return;

    const listener = (changes: LDFlagSet) => {
      if (changes[flagKey] !== undefined) {
        callback(changes[flagKey]);
      }
    };

    client.on('change', listener);

    return () => {
      client.off('change', listener);
    };
  }, [client, flagKey, callback]);
}

// Context provider component
interface LaunchDarklyProviderProps {
  children: React.ReactNode;
  clientSideID?: string;
  options?: any;
  context?: LDContext;
  deferInitialization?: boolean;
}

export function LaunchDarklyProvider({
  children,
  clientSideID,
  options = {},
  context,
  deferInitialization = false,
}: LaunchDarklyProviderProps): JSX.Element {
  const { user } = useCurrentUser();
  const [isReady, setIsReady] = useState(!deferInitialization);

  // Build context from current user and device info
  const ldContext = useMemo(() => {
    if (context) return context;

    return ContextBuilder.buildMultiContext({
      userData: user,
      userAgent: navigator.userAgent,
      includeSession: true,
      includeOrganization: !!user?.organization,
    });
  }, [user, context]);

  const clientConfig = {
    ...CLIENT_SIDE_CONFIG,
    ...options,
  };

  const clientID =
    clientSideID || process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID;

  if (!clientID) {
    console.error('LaunchDarkly client ID is required');
    return <>{children}</>;
  }

  // Wait for user data before initializing
  useEffect(() => {
    if (!deferInitialization || user) {
      setIsReady(true);
    }
  }, [user, deferInitialization]);

  if (!isReady) {
    return <div>Loading feature flags...</div>;
  }

  return (
    <LDProvider
      clientSideID={clientID}
      context={ldContext}
      options={clientConfig}
      reactOptions={{
        useCamelCaseFlagKeys: false,
      }}
    >
      <LaunchDarklyContextProvider>{children}</LaunchDarklyContextProvider>
    </LDProvider>
  );
}

// Internal context provider that wraps LaunchDarkly hooks
function LaunchDarklyContextProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const client = useLDClient();
  const flags = useFlags();
  const error = useLDClientError();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (client) {
      const handleReady = () => setIsInitialized(true);
      const handleError = () => setIsInitialized(true); // Still mark as initialized on error

      if (client.getInitializationState?.() === 'initialized') {
        setIsInitialized(true);
      } else {
        client.waitForInitialization().then(handleReady).catch(handleError);
      }
    }
  }, [client]);

  // Flag evaluation methods with error handling
  const getBooleanFlag = useCallback(
    (key: string, defaultValue: boolean): boolean => {
      try {
        return flags[key] !== undefined ? Boolean(flags[key]) : defaultValue;
      } catch (err) {
        console.warn(`Error evaluating boolean flag ${key}:`, err);
        return defaultValue;
      }
    },
    [flags]
  );

  const getStringFlag = useCallback(
    (key: string, defaultValue: string): string => {
      try {
        return flags[key] !== undefined ? String(flags[key]) : defaultValue;
      } catch (err) {
        console.warn(`Error evaluating string flag ${key}:`, err);
        return defaultValue;
      }
    },
    [flags]
  );

  const getNumberFlag = useCallback(
    (key: string, defaultValue: number): number => {
      try {
        const value = flags[key];
        return value !== undefined && !isNaN(Number(value))
          ? Number(value)
          : defaultValue;
      } catch (err) {
        console.warn(`Error evaluating number flag ${key}:`, err);
        return defaultValue;
      }
    },
    [flags]
  );

  const getJsonFlag = useCallback(
    <T extends any>(key: string, defaultValue: T): T => {
      try {
        const value = flags[key];
        return value !== undefined ? (value as T) : defaultValue;
      } catch (err) {
        console.warn(`Error evaluating JSON flag ${key}:`, err);
        return defaultValue;
      }
    },
    [flags]
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
    async (context: LDContext): Promise<void> => {
      if (!client) {
        console.warn('LaunchDarkly client not available for identification');
        return;
      }

      try {
        await client.identify(context);
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

  const getFlagDetail = useCallback(
    (key: string, defaultValue: any) => {
      try {
        if (client?.variationDetail) {
          return client.variationDetail(key, defaultValue);
        }
        return { value: flags[key] !== undefined ? flags[key] : defaultValue };
      } catch (err) {
        console.warn(`Error getting flag detail for ${key}:`, err);
        return { value: defaultValue };
      }
    },
    [client, flags]
  );

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
    getFlagDetail,
  };

  return (
    <LaunchDarklyContext.Provider value={contextValue}>
      {children}
    </LaunchDarklyContext.Provider>
  );
}

// HOC for wrapping components with LaunchDarkly
export function withLaunchDarkly<P extends object = {}>(
  Component: ComponentType<P>,
  options?: LaunchDarklyProviderProps
) {
  return function WrappedComponent(props: P) {
    return (
      <LaunchDarklyProvider {...options}>
        <Component {...props} />
      </LaunchDarklyProvider>
    );
  };
}

// Error boundary for LaunchDarkly
export class LaunchDarklyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(
      'LaunchDarkly Error Boundary caught an error:',
      error,
      errorInfo
    );
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div>
            <h2>LaunchDarkly Integration Error</h2>
            <p>
              Feature flags are temporarily unavailable. Please refresh the
              page.
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Performance monitoring hook
export function useFlagPerformance() {
  const { flags, isInitialized } = useLaunchDarkly();
  const [performanceMetrics, setPerformanceMetrics] = useState({
    flagCount: 0,
    initializationTime: 0,
    lastUpdate: Date.now(),
  });

  useEffect(() => {
    if (isInitialized) {
      setPerformanceMetrics(prev => ({
        ...prev,
        flagCount: Object.keys(flags).length,
        lastUpdate: Date.now(),
      }));
    }
  }, [flags, isInitialized]);

  return performanceMetrics;
}

// Development tools hook
export function useLaunchDarklyDebug() {
  const { client, flags, isInitialized, error } = useLaunchDarkly();

  return {
    client,
    flags,
    isInitialized,
    error,
    debugInfo: {
      clientVersion: client?.getVersion?.(),
      flagCount: Object.keys(flags).length,
      connectionState: client?.getInternalEventEmitter?.()
        ? 'connected'
        : 'disconnected',
      lastUpdated: Date.now(),
    },
    // Debug methods
    dumpFlags: () => {
      console.table(flags);
    },
    logClientInfo: () => {
      console.log('LaunchDarkly Client Info:', {
        initialized: isInitialized,
        error: error?.message,
        flagCount: Object.keys(flags).length,
        client: client,
      });
    },
  };
}
