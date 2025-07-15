import { initialize, LDClient, LDContext } from 'launchdarkly-js-client-sdk';

class LaunchDarklyService {
  private client: LDClient | null = null;
  private isInitialized = false;

  async initializeClient(context: LDContext): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      const clientSideId = import.meta.env.VITE_LD_CLIENT_ID;
      if (!clientSideId) {
        console.error('LaunchDarkly client ID not found in environment variables');
        return;
      }

      this.client = initialize(clientSideId, context);
      await this.client.waitForInitialization();
      this.isInitialized = true;
      console.log('LaunchDarkly client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize LaunchDarkly client:', error);
      this.isInitialized = false;
    }
  }

  isPersonalizationEnabled(defaultValue: boolean = false): boolean {
    if (!this.client || !this.isInitialized) {
      console.warn('LaunchDarkly client not initialized, returning default value');
      return defaultValue;
    }

    return this.client.variation('personalization_greeting', defaultValue);
  }

  shouldShowOptOutBanner(defaultValue: boolean = false): boolean {
    if (!this.client || !this.isInitialized) {
      return defaultValue;
    }

    return this.client.variation('show_opt_out_banner', defaultValue);
  }

  getVariation<T>(flagKey: string, defaultValue: T): T {
    if (!this.client || !this.isInitialized) {
      return defaultValue;
    }

    return this.client.variation(flagKey, defaultValue);
  }

  async updateContext(context: LDContext): Promise<void> {
    if (!this.client || !this.isInitialized) {
      console.warn('LaunchDarkly client not initialized, cannot update context');
      return;
    }

    try {
      await this.client.identify(context);
    } catch (error) {
      console.error('Failed to update LaunchDarkly context:', error);
    }
  }

  onFlagChange<T>(flagKey: string, callback: (value: T) => void): void {
    if (!this.client || !this.isInitialized) {
      console.warn('LaunchDarkly client not initialized, cannot listen for flag changes');
      return;
    }

    this.client.on(`change:${flagKey}`, callback);
  }

  close(): void {
    if (this.client) {
      this.client.close();
      this.client = null;
      this.isInitialized = false;
    }
  }
}

export default new LaunchDarklyService();
