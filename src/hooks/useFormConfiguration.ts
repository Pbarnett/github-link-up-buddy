import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
/**
 * useFormConfiguration Hook
 *
 * Manages loading, caching, and updating of form configurations
 */

import { formConfigService } from '@/services/form-config.service';
import type {
  FormConfiguration,
  UseFormConfigurationReturn,
  DeploymentOptions,
  SecurityValidationResult,
} from '@/types/dynamic-forms';

interface UseFormConfigurationOptions {
  configId?: string;
  configName?: string;
  enabled?: boolean;
  refetchOnMount?: boolean;
}

export const useFormConfiguration = (
  options: UseFormConfigurationOptions = {}
): UseFormConfigurationReturn => {
  const {
    configId,
    configName,
    enabled = true,
    refetchOnMount = true,
  } = options;

  const [configuration, setConfiguration] = useState<FormConfiguration | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load configuration
  const loadConfiguration = useCallback(async () => {
    if (!enabled || (!configId && !configName)) return;

    setLoading(true);
    setError(null);

    try {
      const response = configId
        ? await formConfigService.getConfiguration(configId)
        : await formConfigService.getConfigurationByName(configName!);

      if (response.success && response.data) {
        setConfiguration(response.data.config.config_data);
      } else {
        throw new Error(
          response.error?.message || 'Failed to load configuration'
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Failed to load form configuration:', err);
    } finally {
      setLoading(false);
    }
  }, [configId, configName, enabled]);

  // Update configuration
  const updateConfiguration = useCallback(
    async (updates: Partial<FormConfiguration>) => {
      if (!configuration || !configId) {
        throw new Error('No configuration loaded or config ID missing');
      }

      setLoading(true);
      setError(null);

      try {
        const updatedConfig = { ...configuration, ...updates };
        const response = await formConfigService.updateConfiguration(
          configId,
          updatedConfig
        );

        if (response.success && response.data) {
          setConfiguration(response.data.config.config_data);
        } else {
          throw new Error(
            response.error?.message || 'Failed to update configuration'
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [configuration, configId]
  );

  // Deploy configuration
  const deployConfiguration = useCallback(
    async (options?: DeploymentOptions) => {
      if (!configId) {
        throw new Error('No config ID available for deployment');
      }

      setLoading(true);
      setError(null);

      try {
        const response = await formConfigService.deployConfiguration(
          configId,
          options
        );

        if (!response.success) {
          throw new Error(
            response.error?.message || 'Failed to deploy configuration'
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [configId]
  );

  // Validate configuration
  const validateConfiguration =
    useCallback(async (): Promise<SecurityValidationResult> => {
      if (!configuration) {
        throw new Error('No configuration loaded');
      }

      try {
        const response = await formConfigService.validateConfiguration(
          configuration,
          'comprehensive',
          true
        );

        if (response.success) {
          return response.validationResults;
        } else {
          throw new Error('Validation failed');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Validation error occurred';
        console.error('Configuration validation failed:', err);
        throw new Error(errorMessage);
      }
    }, [configuration]);

  // Load configuration on mount or when dependencies change
  useEffect(() => {
    if (refetchOnMount) {
      loadConfiguration();
    }
  }, [loadConfiguration, refetchOnMount]);

  return {
    configuration,
    loading,
    error,
    updateConfiguration,
    deployConfiguration,
    validateConfiguration,
  };
};
