// Minimal form configuration service shim to satisfy imports and typings
// Provides basic methods used by hooks and store. Replace with real implementation as needed.

export interface ServiceResponse<T> {
  success: boolean;
  data?: any;
  error?: { message: string };
  validationResults?: any;
}

export const formConfigService = {
  async getConfiguration(id: string): Promise<ServiceResponse<any>> {
    // Placeholder: return a minimal shape resembling expected response
    return {
      success: false,
      error: { message: `Configuration ${id} not found (stub)` },
    };
  },
  async getConfigurationByName(name: string): Promise<ServiceResponse<any>> {
    return {
      success: false,
      error: { message: `Configuration ${name} not found (stub)` },
    };
  },
  async updateConfiguration(id: string, config: any): Promise<ServiceResponse<any>> {
    return {
      success: true,
      data: { config: { id, config_data: config } },
    };
  },
  async createConfiguration(config: any): Promise<ServiceResponse<any>> {
    const id = crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
    return {
      success: true,
      data: { config: { id, config_data: config } },
    };
  },
  async deployConfiguration(id: string, _options?: any): Promise<ServiceResponse<any>> {
    return { success: true };
  },
  async validateConfiguration(_config: any, _mode?: string, _strict?: boolean): Promise<ServiceResponse<any>> {
    return { success: true, validationResults: { passed: true } } as any;
  },
  async deleteConfiguration(_id: string): Promise<ServiceResponse<any>> {
    return { success: true };
  },
  logAnalytics(configId: string, eventType: string, payload: any) {
    try {
      // eslint-disable-next-line no-console
      console.debug('[formConfigService.analytics]', { configId, eventType, payload });
    } catch {}
  },
  // Back-compat names used elsewhere in the app
  async getFormAnalytics(_configId: string, _timeRange?: string): Promise<ServiceResponse<any>> {
    return { success: true, data: [] } as any;
  },
  async logUsageAnalytics(configId: string, eventType: string, payload: any): Promise<void> {
    this.logAnalytics(configId, eventType, payload);
  },
};

