import React, { createContext, useContext } from 'react';

export type LDFlags = Record<string, any>;

export const FlagsContext = createContext<LDFlags>({});

export function useTestFlags(): LDFlags {
  return useContext(FlagsContext);
}

export const LDTestHarness: React.FC<{ flags: LDFlags; children: React.ReactNode }>
  = ({ flags, children }) => {
  return (
    <FlagsContext.Provider value={flags}>
      {children}
    </FlagsContext.Provider>
  );
};
