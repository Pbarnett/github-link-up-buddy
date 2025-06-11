import { createContext, useContext, useState, ReactNode } from 'react';

interface ConstraintContextValue { // Renamed for clarity from ConstraintContext to avoid conflict
  budgetMultiplier: number;
  currentBudget: number;
  setBudgetMultiplier: (val: number) => void;
}

const ConstraintCtx = createContext<ConstraintContextValue | undefined>(undefined);

/**
 * Wrap your app (e.g. in App.tsx) with:
 * <ConstraintProvider initialBudget={tripRequests.budget}>…</ConstraintProvider>
 */
export const ConstraintProvider = ({
  children,
  initialBudget,
}: {
  children: ReactNode;
  initialBudget: number; // from trip_requests.budget or user budget
}) => {
  const [budgetMultiplier, setBudgetMultiplier] = useState(1);
  return (
    <ConstraintCtx.Provider
      value={{
        budgetMultiplier,
        currentBudget: initialBudget * budgetMultiplier,
        setBudgetMultiplier,
      }}
    >
      {children}
    </ConstraintCtx.Provider>
  );
};

/**
 * Hook to access budget multiplier state.
 * Must be used within a ConstraintProvider.
 */
export const useConstraintState = (): ConstraintContextValue => { // Ensure return type matches the context value type
  const ctx = useContext(ConstraintCtx);
  if (!ctx) {
    throw new Error(
      'useConstraintState must be used within a ConstraintProvider'
    );
  }
  return ctx;
};
