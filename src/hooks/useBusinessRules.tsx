import * as React from 'react';
import { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { configLoader } from '../lib/business-rules/ConfigLoader';
import { BusinessRulesConfig } from '../lib/business-rules/schema';
interface BusinessRulesContextType {
  config: BusinessRulesConfig | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const BusinessRulesContext = React.createContext<
  BusinessRulesContextType | undefined
>(undefined);

const BusinessRulesProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<BusinessRulesConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const newConfig = await configLoader.loadConfig();
      setConfig(newConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load config');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <BusinessRulesContext.Provider
      value={{ config, loading, error, refetch: loadConfig }}
    >
      {children}
    </BusinessRulesContext.Provider>
  );
};

export { BusinessRulesProvider };

export function useBusinessRules() {
  const context = useContext(BusinessRulesContext);
  if (context === undefined) {
    throw new Error(
      'useBusinessRules must be used within a BusinessRulesProvider'
    );
  }
  return context;
}
