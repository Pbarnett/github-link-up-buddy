import * as React from 'react';
/**
 * Dynamic Forms Zustand Store
 *
 * Global state management for dynamic form configurations and runtime state
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  FormConfiguration,
  FormConfigurationRecord,
  FormDeployment,
  FormUsageAnalytics,
  SecurityValidationResult,
  DeploymentOptions,
} from '@/types/dynamic-forms';
import { formConfigService } from '@/services/form-config.service';
interface FormStore {
  // Configuration state
  configurations: Map<string, FormConfiguration>;
  configurationRecords: Map<string, FormConfigurationRecord>;
  activeDeployments: Map<string, FormDeployment>;

  // Runtime state
  formInstances: Map<
    string,
    {
      configId: string;
      values: Record<string, unknown>;
      errors: Record<string, string>;
      touched: Record<string, boolean>;
      isSubmitting: boolean;
    }
  >;

  // Analytics state
  analytics: Map<string, FormUsageAnalytics[]>;

  // Loading states
  loading: {
    configurations: boolean;
    deployment: boolean;
    validation: boolean;
    analytics: boolean;
  };

  // Error states
  errors: {
    configuration: string | null;
    deployment: string | null;
    validation: string | null;
    analytics: string | null;
  };

  // Actions
  // Configuration management
  loadConfiguration: (configId: string) => Promise<void>;
  loadConfigurationByName: (name: string) => Promise<void>;
  createConfiguration: (config: FormConfiguration) => Promise<string | null>;
  updateConfiguration: (
    configId: string,
    updates: Partial<FormConfiguration>
  ) => Promise<void>;
  deleteConfiguration: (configId: string) => Promise<void>;

  // Deployment management
  deployConfiguration: (
    configId: string,
    options?: DeploymentOptions
  ) => Promise<void>;
  rollbackDeployment: (deploymentId: string) => Promise<void>;

  // Form instance management
  createFormInstance: (instanceId: string, configId: string) => void;
  updateFormInstance: (
    instanceId: string,
    updates: {
      values?: Record<string, unknown>;
      errors?: Record<string, string>;
      touched?: Record<string, boolean>;
      isSubmitting?: boolean;
    }
  ) => void;
  removeFormInstance: (instanceId: string) => void;

  // Analytics
  logFormEvent: (
    configId: string,
    eventType: string,
    eventData?: unknown
  ) => Promise<void>;
  loadAnalytics: (configId: string, timeRange?: string) => Promise<void>;

  // Validation
  validateConfiguration: (
    config: FormConfiguration
  ) => Promise<SecurityValidationResult | null>;

  // Utility actions
  clearErrors: () => void;
  reset: () => void;
}

const initialState = {
  configurations: new Map(),
  configurationRecords: new Map(),
  activeDeployments: new Map(),
  formInstances: new Map(),
  analytics: new Map(),
  loading: {
    configurations: false,
    deployment: false,
    validation: false,
    analytics: false,
  },
  errors: {
    configuration: null,
    deployment: null,
    validation: null,
    analytics: null,
  },
};

export const useFormStore = create<FormStore>()(
  devtools(
    immer(
      persist(
        (set, get) => ({
          ...initialState,

          // Configuration management
          loadConfiguration: async (configId: string) => {
            set(state => {
              state.loading.configurations = true;
              state.errors.configuration = null;
            });

            try {
              const response =
                await formConfigService.getConfiguration(configId);

              if (response.success && response.data) {
                set(state => {
                  state.configurations.set(
                    configId,
                    response.data!.config.config_data
                  );
                  state.configurationRecords.set(
                    configId,
                    response.data!.config
                  );
                });
              } else {
                throw new Error(
                  response.error?.message || 'Failed to load configuration'
                );
              }
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
              set(state => {
                state.errors.configuration = errorMessage;
              });
              console.error('Failed to load configuration:', error);
            } finally {
              set(state => {
                state.loading.configurations = false;
              });
            }
          },

          loadConfigurationByName: async (name: string) => {
            set(state => {
              state.loading.configurations = true;
              state.errors.configuration = null;
            });

            try {
              const response =
                await formConfigService.getConfigurationByName(name);

              if (response.success && response.data) {
                const configId = response.data.config.id;
                set(state => {
                  state.configurations.set(
                    configId,
                    response.data!.config.config_data
                  );
                  state.configurationRecords.set(
                    configId,
                    response.data!.config
                  );
                });
              } else {
                throw new Error(
                  response.error?.message || 'Failed to load configuration'
                );
              }
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
              set(state => {
                state.errors.configuration = errorMessage;
              });
              console.error('Failed to load configuration by name:', error);
            } finally {
              set(state => {
                state.loading.configurations = false;
              });
            }
          },

          createConfiguration: async (config: FormConfiguration) => {
            set(state => {
              state.loading.configurations = true;
              state.errors.configuration = null;
            });

            try {
              const response =
                await formConfigService.createConfiguration(config);

              if (response.success && response.data) {
                const configId = response.data.config.id;
                set(state => {
                  state.configurations.set(
                    configId,
                    response.data!.config.config_data
                  );
                  state.configurationRecords.set(
                    configId,
                    response.data!.config
                  );
                });
                return configId;
              } else {
                throw new Error(
                  response.error?.message || 'Failed to create configuration'
                );
              }
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
              set(state => {
                state.errors.configuration = errorMessage;
              });
              console.error('Failed to create configuration:', error);
              return null;
            } finally {
              set(state => {
                state.loading.configurations = false;
              });
            }
          },

          updateConfiguration: async (
            configId: string,
            updates: Partial<FormConfiguration>
          ) => {
            const currentConfig = get().configurations.get(configId);
            if (!currentConfig) {
              throw new Error('Configuration not found in store');
            }

            set(state => {
              state.loading.configurations = true;
              state.errors.configuration = null;
            });

            try {
              const updatedConfig = { ...currentConfig, ...updates };
              const response = await formConfigService.updateConfiguration(
                configId,
                updatedConfig
              );

              if (response.success && response.data) {
                set(state => {
                  state.configurations.set(
                    configId,
                    response.data!.config.config_data
                  );
                  state.configurationRecords.set(
                    configId,
                    response.data!.config
                  );
                });
              } else {
                throw new Error(
                  response.error?.message || 'Failed to update configuration'
                );
              }
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
              set(state => {
                state.errors.configuration = errorMessage;
              });
              throw error;
            } finally {
              set(state => {
                state.loading.configurations = false;
              });
            }
          },

          deleteConfiguration: async (configId: string) => {
            set(state => {
              state.loading.configurations = true;
              state.errors.configuration = null;
            });

            try {
              const response =
                await formConfigService.deleteConfiguration(configId);

              if (response.success) {
                set(state => {
                  state.configurations.delete(configId);
                  state.configurationRecords.delete(configId);
                });
              } else {
                throw new Error('Failed to delete configuration');
              }
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
              set(state => {
                state.errors.configuration = errorMessage;
              });
              throw error;
            } finally {
              set(state => {
                state.loading.configurations = false;
              });
            }
          },

          // Deployment management
          deployConfiguration: async (
            configId: string,
            options?: DeploymentOptions
          ) => {
            set(state => {
              state.loading.deployment = true;
              state.errors.deployment = null;
            });

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
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
              set(state => {
                state.errors.deployment = errorMessage;
              });
              throw error;
            } finally {
              set(state => {
                state.loading.deployment = false;
              });
            }
          },

          rollbackDeployment: async (deploymentId: string) => {
            // Implementation for rollback would go here
            console.log('Rollback deployment:', deploymentId);
          },

          // Form instance management
          createFormInstance: (instanceId: string, configId: string) => {
            set(state => {
              state.formInstances.set(instanceId, {
                configId,
                values: {},
                errors: {},
                touched: {},
                isSubmitting: false,
              });
            });
          },

          updateFormInstance: (instanceId: string, updates) => {
            set(state => {
              const instance = state.formInstances.get(instanceId);
              if (instance) {
                state.formInstances.set(instanceId, {
                  ...instance,
                  ...updates,
                });
              }
            });
          },

          removeFormInstance: (instanceId: string) => {
            set(state => {
              state.formInstances.delete(instanceId);
            });
          },

          // Analytics
          logFormEvent: async (
            configId: string,
            eventType: string,
            eventData?: unknown
          ) => {
            try {
              await formConfigService.logUsageAnalytics(
                configId,
                eventType as string,
                eventData
              );
            } catch (error) {
              console.warn('Failed to log form event:', error);
            }
          },

          loadAnalytics: async (configId: string, timeRange = '7d') => {
            set(state => {
              state.loading.analytics = true;
              state.errors.analytics = null;
            });

            try {
              const data = await formConfigService.getFormAnalytics(
                configId,
                timeRange as string
              );
              // Store analytics data (simplified for now)
              console.log('Analytics data:', data);
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
              set(state => {
                state.errors.analytics = errorMessage;
              });
              console.error('Failed to load analytics:', error);
            } finally {
              set(state => {
                state.loading.analytics = false;
              });
            }
          },

          // Validation
          validateConfiguration: async (config: FormConfiguration) => {
            set(state => {
              state.loading.validation = true;
              state.errors.validation = null;
            });

            try {
              const response = await formConfigService.validateConfiguration(
                config,
                'comprehensive',
                true
              );

              if (response.success) {
                return response.validationResults;
              } else {
                throw new Error('Validation failed');
              }
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
              set(state => {
                state.errors.validation = errorMessage;
              });
              console.error('Failed to validate configuration:', error);
              return null;
            } finally {
              set(state => {
                state.loading.validation = false;
              });
            }
          },

          // Utility actions
          clearErrors: () => {
            set(state => {
              state.errors = {
                configuration: null,
                deployment: null,
                validation: null,
                analytics: null,
              };
            });
          },

          reset: () => {
            set(() => ({ ...initialState }));
          },
        }),
        {
          name: 'parker-flight-form-store',
          partialize: state => ({
            // Only persist configurations and form instances
            configurations: Array.from(state.configurations.entries()) as [
              string,
              FormConfiguration,
            ][],
            formInstances: Array.from(state.formInstances.entries()) as [
              string,
              {
                configId: string;
                values: Record<string, unknown>;
                errors: Record<string, string>;
                touched: Record<string, boolean>;
                isSubmitting: boolean;
              },
            ][],
          }),
          onRehydrateStorage: () => state => {
            if (state) {
              // Convert persisted arrays back to Maps
              state.configurations = new Map(
                state.configurations as unknown as [string, FormConfiguration][]
              );
              state.formInstances = new Map(
                state.formInstances as unknown as [
                  string,
                  {
                    configId: string;
                    values: Record<string, unknown>;
                    errors: Record<string, string>;
                    touched: Record<string, boolean>;
                    isSubmitting: boolean;
                  },
                ][]
              );
            }
          },
        }
      )
    ),
    { name: 'parker-flight-form-store' }
  )
);
