import React, { createContext, useContext, useMemo } from 'react';

// Mock flag values for testing
const DEFAULT_TEST_FLAGS = {
  wallet_ui: true,
  profile_ui_revamp: true,
  personalization_greeting: false,
  show_opt_out_banner: false,
  enhanced_launchdarkly_resilience: false,
};

// Mock LaunchDarkly context for tests
interface MockLDContextType {
  flags: Record<string, any>;
  client: null;
  isInitialized: boolean;
  error: null;
}

const MockLDContext = createContext<MockLDContextType | undefined>(undefined);

// Mock hooks that mimic LaunchDarkly React SDK
export const useFlags = () => {
  const context = useContext(MockLDContext);
  if (!context) {
    console.warn('useFlags called outside of TestLaunchDarklyProvider');
    return DEFAULT_TEST_FLAGS;
  }
  return context.flags;
};

export const useLDClient = () => {
  const context = useContext(MockLDContext);
  return context?.client || null;
};

export const useLDClientError = () => {
  const context = useContext(MockLDContext);
  return context?.error || null;
};

export const useFlag = (flagKey: string, defaultValue: any = false) => {
  const flags = useFlags();
  return flags[flagKey] !== undefined ? flags[flagKey] : defaultValue;
};

// Test provider props
interface TestLaunchDarklyProviderProps {
  children: React.ReactNode;
  testFlags?: Record<string, any>;
}

// Test provider component
export function TestLaunchDarklyProvider({
  children,
  testFlags = {},
}: TestLaunchDarklyProviderProps) {
  const contextValue = useMemo(
    () => ({
      flags: { ...DEFAULT_TEST_FLAGS, ...testFlags },
      client: null,
      isInitialized: true,
      error: null,
    }),
    [testFlags]
  );

  return (
    <MockLDContext.Provider value={contextValue}>
      {children}
    </MockLDContext.Provider>
  );
}

// Mock LDProvider component for drop-in replacement
export const LDProvider = TestLaunchDarklyProvider;

// Mock initialization functions
export const asyncWithLDProvider = async (config: any) => {
  // Return a wrapper that provides the test flags
  return ({ children }: { children: React.ReactNode }) => (
    <TestLaunchDarklyProvider testFlags={config.testFlags}>
      {children}
    </TestLaunchDarklyProvider>
  );
};

export const withLDProvider =
  (config: any) => (Component: React.ComponentType) => {
    return (props: any) => (
      <TestLaunchDarklyProvider testFlags={config.testFlags}>
        <Component {...props} />
      </TestLaunchDarklyProvider>
    );
  };
