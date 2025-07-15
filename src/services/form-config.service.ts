/**
 * Form Configuration Service
 * 
 * Handles form configuration management and persistence
 */

import { supabase } from '@/integrations/supabase/client';
import type { FormConfiguration } from '@/types/dynamic-forms';

export interface FormConfigurationService {
  getConfiguration(id: string): Promise<{ success: boolean; data?: { config: any }; error?: { message: string } }>;
  getConfigurationByName(name: string): Promise<{ success: boolean; data?: { config: any }; error?: { message: string } }>;
  saveConfiguration(config: FormConfiguration): Promise<{ success: boolean; data?: { config: any }; error?: { message: string } }>;
  createConfiguration(config: FormConfiguration): Promise<{ success: boolean; data?: { config: any }; error?: { message: string } }>;
  updateConfiguration(id: string, config: FormConfiguration): Promise<{ success: boolean; data?: { config: any }; error?: { message: string } }>;
  deployConfiguration(id: string, options?: any): Promise<{ success: boolean; error?: { message: string } }>;
  listConfigurations(): Promise<FormConfiguration[]>;
  deleteConfiguration(id: string): Promise<{ success: boolean; error?: { message: string } }>;
  validateConfiguration(config: FormConfiguration, type: string, comprehensive: boolean): Promise<{ success: boolean; validationResults?: any; error?: { message: string } }>;
  logUsageAnalytics(configId: string, eventType: string, eventData?: unknown): Promise<void>;
  getFormAnalytics(configId: string, timeRange: string): Promise<any>;
}

class FormConfigService implements FormConfigurationService {
  async getConfiguration(id: string): Promise<{ success: boolean; data?: { config: any }; error?: { message: string } }> {
    try {
      const { data, error } = await supabase
        .from('form_configurations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching form configuration:', error);
        return { success: false, error: { message: error.message } };
      }

      return { 
        success: true, 
        data: { 
          config: { 
            id: data.id, 
            config_data: data as FormConfiguration 
          } 
        } 
      };
    } catch (error) {
      console.error('Error in getConfiguration:', error);
      return { success: false, error: { message: error instanceof Error ? error.message : 'Unknown error' } };
    }
  }

  async saveConfiguration(config: FormConfiguration): Promise<{ success: boolean; data?: { config: any }; error?: { message: string } }> {
    try {
      const { data, error } = await supabase
        .from('form_configurations')
        .upsert(config)
        .select()
        .single();

      if (error) {
        console.error('Error saving form configuration:', error);
        return { success: false, error: { message: error.message } };
      }

      return { 
        success: true, 
        data: { 
          config: { 
            id: data.id, 
            config_data: data as FormConfiguration 
          } 
        } 
      };
    } catch (error) {
      console.error('Error in saveConfiguration:', error);
      return { success: false, error: { message: error instanceof Error ? error.message : 'Unknown error' } };
    }
  }

  async getConfigurationByName(name: string): Promise<{ success: boolean; data?: { config: any }; error?: { message: string } }> {
    try {
      const { data, error } = await supabase
        .from('form_configurations')
        .select('*')
        .eq('name', name)
        .single();

      if (error) {
        console.error('Error fetching form configuration by name:', error);
        return { success: false, error: { message: error.message } };
      }

      return { 
        success: true, 
        data: { 
          config: { 
            id: data.id, 
            config_data: data as FormConfiguration 
          } 
        } 
      };
    } catch (error) {
      console.error('Error in getConfigurationByName:', error);
      return { success: false, error: { message: error instanceof Error ? error.message : 'Unknown error' } };
    }
  }

  async createConfiguration(config: FormConfiguration): Promise<{ success: boolean; data?: { config: any }; error?: { message: string } }> {
    try {
      const { data, error } = await supabase
        .from('form_configurations')
        .insert(config)
        .select()
        .single();

      if (error) {
        console.error('Error creating form configuration:', error);
        return { success: false, error: { message: error.message } };
      }

      return { 
        success: true, 
        data: { 
          config: { 
            id: data.id, 
            config_data: data as FormConfiguration 
          } 
        } 
      };
    } catch (error) {
      console.error('Error in createConfiguration:', error);
      return { success: false, error: { message: error instanceof Error ? error.message : 'Unknown error' } };
    }
  }

  async updateConfiguration(id: string, config: FormConfiguration): Promise<{ success: boolean; data?: { config: any }; error?: { message: string } }> {
    try {
      const { data, error } = await supabase
        .from('form_configurations')
        .update(config)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating form configuration:', error);
        return { success: false, error: { message: error.message } };
      }

      return { 
        success: true, 
        data: { 
          config: { 
            id: data.id, 
            config_data: data as FormConfiguration 
          } 
        } 
      };
    } catch (error) {
      console.error('Error in updateConfiguration:', error);
      return { success: false, error: { message: error instanceof Error ? error.message : 'Unknown error' } };
    }
  }

  async deployConfiguration(id: string, options?: any): Promise<{ success: boolean; error?: { message: string } }> {
    try {
      // For now, just mark as deployed
      const { error } = await (supabase as any)
        .from('form_configurations')
        .update({ is_active: true, deployed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error deploying form configuration:', error);
        return { success: false, error: { message: error.message } };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deployConfiguration:', error);
      return { success: false, error: { message: error instanceof Error ? error.message : 'Unknown error' } };
    }
  }

  async listConfigurations(): Promise<FormConfiguration[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('form_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error listing form configurations:', error);
        return [];
      }

      return data as FormConfiguration[];
    } catch (error) {
      console.error('Error in listConfigurations:', error);
      return [];
    }
  }

  async deleteConfiguration(id: string): Promise<{ success: boolean; error?: { message: string } }> {
    try {
      const { error } = await (supabase
        .from('form_configurations')
        .delete()
        .eq('id', id) as any);

      if (error) {
        console.error('Error deleting form configuration:', error);
        return { success: false, error: { message: error.message } };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteConfiguration:', error);
      return { success: false, error: { message: error instanceof Error ? error.message : 'Unknown error' } };
    }
  }

  // Get form configuration by type
  async getConfigurationByType(type: string): Promise<FormConfiguration | null> {
    try {
      const { data, error } = await supabase
        .from('form_configurations')
        .select('*')
        .eq('type', type)
        .eq('is_active', true)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching form configuration by type:', error);
        return null;
      }

      return data as FormConfiguration;
    } catch (error) {
      console.error('Error in getConfigurationByType:', error);
      return null;
    }
  }

  // Validate form configuration
  async validateConfiguration(config: FormConfiguration, type: string, comprehensive: boolean): Promise<{ success: boolean; validationResults?: any; error?: { message: string } }> {
    try {
      // Basic validation
      if (!config.name || !config.sections || config.sections.length === 0) {
        return { success: false, error: { message: 'Invalid configuration: missing name or sections' } };
      }

      const validationResults = {
        isValid: true,
        errors: [] as string[],
        warnings: [] as string[]
      };

      // Validate each section
      for (const section of config.sections) {
        if (!section.id || !section.title || !section.fields || section.fields.length === 0) {
          validationResults.errors.push(`Section '${section.id}' is missing required fields`);
          validationResults.isValid = false;
        }

        // Validate each field
        for (const field of section.fields) {
          if (!field.id || !field.type || !field.label) {
            validationResults.errors.push(`Field '${field.id}' is missing required properties`);
            validationResults.isValid = false;
          }
        }
      }

      return { success: true, validationResults };
    } catch (error) {
      console.error('Error in validateConfiguration:', error);
      return { success: false, error: { message: error instanceof Error ? error.message : 'Unknown error' } };
    }
  }

  async logUsageAnalytics(configId: string, eventType: string, eventData?: unknown): Promise<void> {
    try {
      const { error } = await (supabase as any)
        .from('form_analytics')
        .insert({
          config_id: configId,
          event_type: eventType,
          event_data: eventData,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Error logging usage analytics:', error);
      }
    } catch (error) {
      console.error('Error in logUsageAnalytics:', error);
    }
  }

  async getFormAnalytics(configId: string, timeRange: string): Promise<any> {
    try {
      const { data, error } = await (supabase as any)
        .from('form_analytics')
        .select('*')
        .eq('config_id', configId)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching form analytics:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getFormAnalytics:', error);
      return null;
    }
  }

  // Get default form configuration
  getDefaultConfiguration(): FormConfiguration {
    return {
      id: 'default',
      name: 'Default Form',
      description: 'Default form configuration',
      version: 1,
      sections: [
        {
          id: 'basic',
          title: 'Basic Information',
          fields: [
            {
              id: 'name',
              type: 'text',
              label: 'Name',
              validation: {
                required: true
              }
            },
            {
              id: 'email',
              type: 'email',
              label: 'Email',
              validation: {
                required: true
              }
            }
          ]
        }
      ],
      settings: {
        theme: 'default',
        showProgressBar: true,
        allowSave: true
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const formConfigService = new FormConfigService();
export default formConfigService;
