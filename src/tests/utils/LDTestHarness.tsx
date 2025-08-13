import React, { createContext, useContext } from 'react';

export type LDFlags = Record<string, any>;

export const FlagsContext = createContext<LDFlags>({});

export function useTestFlags(): LDFlags {
  return useContext(FlagsContext);
}

export const LDTestHarness: React.FC<{ flags: LDFlags; children: React.ReactNode }>
  = ({ flags, children }) => {
  // Also expose flags on a global for tests that mock the LD SDK without importing this module instance
  (globalThis as any).__TEST_FLAGS = flags;
  return (
    <FlagsContext.Provider value={flags}>
      {children}
    </FlagsContext.Provider>
  );
};
