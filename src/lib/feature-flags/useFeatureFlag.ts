import { useState, useEffect } from 'react';

interface FeatureFlagState {
  enabled: boolean;
  loading: boolean;
  error: string | null;
}

export function useFeatureFlag(flagName: string): FeatureFlagState {
  const [state, setState] = useState<FeatureFlagState>({
    enabled: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    async function fetchFlag() {
      try {
        const response = await fetch(`/api/feature-flags/${flagName}`);
        const data = await response.json();
        setState({
          enabled: data.enabled || false,
          loading: false,
          error: null
        });
      } catch (error) {
        setState({
          enabled: false,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch feature flag'
        });
      }
    }

    fetchFlag();
  }, [flagName]);

  return state;
}
