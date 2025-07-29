import * as React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  type FeatureFlag,
  isFeatureEnabled as isEnabled,
} from '@/shared/featureFlag';

interface FeatureFlagState {
  enabled: boolean;
  loading: boolean;
  error: string | null;
  rolloutPercentage?: number;
}

export function useFeatureFlag(flagName: string): FeatureFlagState {
  const [state, setState] = useState<FeatureFlagState>({
    enabled: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchFlag() {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setState({
            enabled: false,
            loading: false,
            error: 'User not authenticated',
          });
          return;
        }

        // Fetch feature flag from database
        const { data: flag, error } = await supabase
          .from('feature_flags')
          .select('*')
          .eq('name', flagName)
          .single();

        if (error) {
          setState({
            enabled: false,
            loading: false,
            error: `Failed to fetch feature flag: ${error.message}`,
          });
          return;
        }

        // Check if user should see this feature based on rollout percentage
        const shouldEnable = isEnabled(flag.name, user.id);

        setState({
          enabled: shouldEnable,
          loading: false,
          error: null,
          rolloutPercentage: flag.rollout_percentage,
        });
      } catch (error) {
        setState({
          enabled: false,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch feature flag',
        });
      }
    }

    fetchFlag();
  }, [flagName]);

  return state;
}
