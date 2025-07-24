import { initialize, LDClient, LDContext } from 'launchdarkly-js-client-sdk';
import {
  LaunchDarklyConfig,
  LaunchDarklyMetrics,
  LaunchDarklyServiceState,
  RetryResult,
  DEFAULT_LAUNCHDARKLY_CONFIG,
} from '../types/launchDarkly';

class LaunchDarklyService {
  private client: LDClient | null = null;
  private state: LaunchDarklyServiceState;
  private circuitBreakerOpenTime: number | null = null;

  constructor(config: Partial<LaunchDarklyConfig> = {}) {
    this.state = {
      isInitialized: false,
      isInitializing: false,
      isOffline: false,
      metrics: {
        initializationTime: 0,
        flagEvaluationTime: 0,
        failureCount: 0,
        successCount: 0,
        isCircuitBreakerOpen: false,
      },
      config: { ...DEFAULT_LAUNCHDARKLY_CONFIG, ...config },
    };
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<RetryResult<T>> {
    const { maxRetries, backoffMultiplier, initialDelay, maxDelay } =
      this.state.config.retryConfig;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation()();
        this.recordSuccess();
        return { success: true, data: result, attempts: attempt };
      } catch (error) {
        this.recordFailure();

        if (attempt === maxRetries) {
          console.error(
            `${operationName} failed after ${maxRetries} attempts:`,
            error
          );
          return { success: false, error: error as Error, attempts: attempt };
        }

        const _delay = Math.min(
          initialDelay * Math.pow(backoffMultiplier, attempt - 1),
          maxDelay
        );
        console.warn(
          `${operationName} attempt ${attempt} failed, retrying in ${delay}ms:`,
          error
        );
        await this.sleep(delay);
      }
    }

    return {
      success: false,
      error: new Error('Maximum retries exceeded'),
      attempts: maxRetries,
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private recordSuccess(): void {
    this.state.metrics.successCount++;
    this.state.metrics.lastSuccessTime = Date.now();

    // Reset circuit breaker if it was open
    if (this.state.metrics.isCircuitBreakerOpen) {
      this.state.metrics.isCircuitBreakerOpen = false;
      this.circuitBreakerOpenTime = null;
      console.log('Circuit breaker reset after successful operation');
    }
  }

  private recordFailure(): void {
    this.state.metrics.failureCount++;
    this.state.metrics.lastErrorTime = Date.now();

    // Check if circuit breaker should be opened
    if (
      this.state.config.resilience.circuitBreakerEnabled &&
      this.state.metrics.failureCount >=
        this.state.config.resilience.circuitBreakerThreshold
    ) {
      this.state.metrics.isCircuitBreakerOpen = true;
      this.circuitBreakerOpenTime = Date.now();
      console.warn('Circuit breaker opened due to excessive failures');
    }
  }

  private isCircuitBreakerOpen(): boolean {
    if (
      !this.state.config.resilience.circuitBreakerEnabled ||
      !this.state.metrics.isCircuitBreakerOpen
    ) {
      return false;
    }

    if (this.circuitBreakerOpenTime) {
      const timeSinceOpen = Date.now() - this.circuitBreakerOpenTime;
      if (
        timeSinceOpen > this.state.config.resilience.circuitBreakerResetTimeout
      ) {
        this.state.metrics.isCircuitBreakerOpen = false;
        this.circuitBreakerOpenTime = null;
        console.log('Circuit breaker automatically reset after timeout');
        return false;
      }
    }

    return true;
  }

  private withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    operationName: string
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(
          () =>
            reject(new Error(`${operationName} timeout after ${timeoutMs}ms`)),
          timeoutMs
        )
      ),
    ]);
  }

  async initializeClient(context: LDContext): Promise<void> {
    if (this.state.isInitialized) {
      return;
    }

    if (this.state.isInitializing) {
      console.log('LaunchDarkly client is already initializing');
      return;
    }

    const resilienceEnabled = this._variationRaw(
      'enhanced_launchdarkly_resilience',
      false
    );
    if (!resilienceEnabled) {
      return this.initializeClientLegacy(context);
    }

    if (this.isCircuitBreakerOpen()) {
      console.warn(
        'Circuit breaker is open, skipping LaunchDarkly initialization'
      );
      this.state.isOffline = true;
      return;
    }

    this.state.isInitializing = true;
    const startTime = performance.now();

    try {
      const clientSideId = import.meta.env.VITE_LD_CLIENT_ID;
      if (!clientSideId) {
        throw new Error(
          'LaunchDarkly client ID not found in environment variables'
        );
      }

      const initResult = await this.withRetry(async () => {
        const client = initialize(clientSideId, context);
        await this.withTimeout(
          client.waitForInitialization(),
          this.state.config.timeoutConfig.initializationTimeout,
          'LaunchDarkly initialization'
        );
        return client;
      }, 'LaunchDarkly initialization');

      if (initResult.success && initResult.data) {
        this.client = initResult.data;
        this.state.isInitialized = true;
        this.state.isOffline = false;
        this.state.metrics.initializationTime = performance.now() - startTime;
        console.log(
          `LaunchDarkly client initialized successfully in ${this.state.metrics.initializationTime}ms`
        );
      } else {
        this.handleInitializationFailure(initResult.error);
      }
    } catch (error) {
      this.handleInitializationFailure(error as Error);
    } finally {
      this.state.isInitializing = false;
    }
  }

  private async initializeClientLegacy(context: LDContext): Promise<void> {
    try {
      const clientSideId = import.meta.env.VITE_LD_CLIENT_ID;
      if (!clientSideId) {
        console.error(
          'LaunchDarkly client ID not found in environment variables'
        );
        return;
      }

      this.client = initialize(clientSideId, context);
      await this.client.waitForInitialization();
      this.state.isInitialized = true;
      console.log('LaunchDarkly client initialized successfully (legacy mode)');
    } catch (error) {
      console.error(
        'Failed to initialize LaunchDarkly client (legacy mode):',
        error
      );
      this.state.isInitialized = false;
    }
  }

  private handleInitializationFailure(error?: Error): void {
    console.error('LaunchDarkly initialization failed:', error);
    this.state.isInitialized = false;
    this.state.isOffline = true;
    this.state.lastError = error;

    if (this.state.config.offlineMode.enabled) {
      console.log('Falling back to offline mode with default flag values');
    }
  }

  isPersonalizationEnabled(defaultValue: boolean = false): boolean {
    return this.getVariationWithResilience(
      'personalization_greeting',
      defaultValue
    );
  }

  shouldShowOptOutBanner(defaultValue: boolean = false): boolean {
    return this.getVariationWithResilience('show_opt_out_banner', defaultValue);
  }

  getVariation<T>(flagKey: string, defaultValue: T): T {
    if (import.meta.env.DEV) {
      return this.getVariationWithOverride(flagKey, defaultValue);
    }
    return this.getVariationWithResilience(flagKey, defaultValue);
  }

  private _variationRaw<T>(flagKey: string, defaultValue: T): T {
    if (!this.client || !this.state.isInitialized) {
      return defaultValue;
    }
    return this.client.variation(flagKey, defaultValue);
  }

  private _getRawVariation<T>(flagKey: string, defaultValue: T): T {
    return this.client?.variation?.(flagKey, defaultValue) ?? defaultValue;
  }

  private getVariationWithResilience<T>(flagKey: string, defaultValue: T): T {
    const startTime = performance.now();

    try {
      const resilienceEnabled = this.state.config.resilience.enabled;
      if (!resilienceEnabled) {
        return this.getVariationLegacy(flagKey, defaultValue);
      }

      if (this.isCircuitBreakerOpen()) {
        console.warn(
          `Circuit breaker is open, returning fallback value for flag: ${flagKey}`
        );
        return this.getFallbackValue(flagKey, defaultValue);
      }

      if (!this.client || !this.state.isInitialized) {
        console.warn(
          `LaunchDarkly client not initialized, returning fallback value for flag: ${flagKey}`
        );
        return this.getFallbackValue(flagKey, defaultValue);
      }

      if (this.state.isOffline) {
        console.warn(
          `LaunchDarkly is offline, returning fallback value for flag: ${flagKey}`
        );
        return this.getFallbackValue(flagKey, defaultValue);
      }

      const variation = this.client.variation(flagKey, defaultValue);

      this.state.metrics.flagEvaluationTime = performance.now() - startTime;
      this.recordSuccess();

      return variation;
    } catch (error) {
      console.error(`Error getting variation for flag ${flagKey}:`, error);
      this.recordFailure();
      return this.getFallbackValue(flagKey, defaultValue);
    }
  }

  private getVariationLegacy<T>(flagKey: string, defaultValue: T): T {
    if (!this.client || !this.state.isInitialized) {
      return defaultValue;
    }
    return this.client.variation(flagKey, defaultValue);
  }

  private getFallbackValue<T>(flagKey: string, defaultValue: T): T {
    if (this.state.config.offlineMode.enabled) {
      const fallbackValue =
        this.state.config.offlineMode.fallbackFlags[flagKey];
      if (fallbackValue !== undefined) {
        return fallbackValue as T;
      }
    }
    return defaultValue;
  }

  async updateContext(context: LDContext): Promise<void> {
    if (!this.client || !this.state.isInitialized) {
      console.warn(
        'LaunchDarkly client not initialized, cannot update context'
      );
      return;
    }

    try {
      await this.client.identify(context);
    } catch (error) {
      console.error('Failed to update LaunchDarkly context:', error);
    }
  }

  onFlagChange<T>(flagKey: string, callback: (value: T) => void): void {
    if (!this.client || !this.state.isInitialized) {
      console.warn(
        'LaunchDarkly client not initialized, cannot listen for flag changes'
      );
      return;
    }

    this.client.on(`change:${flagKey}`, callback);
  }

  close(): void {
    if (this.client) {
      this.client.close();
      this.client = null;
      this.state.isInitialized = false;
    }
  }

  getServiceState(): LaunchDarklyServiceState {
    return { ...this.state };
  }

  getMetrics(): LaunchDarklyMetrics {
    return { ...this.state.metrics };
  }

  isOnline(): boolean {
    return !this.state.isOffline;
  }

  isInitialized(): boolean {
    return this.state.isInitialized;
  }

  resetMetrics(): void {
    this.state.metrics = {
      initializationTime: 0,
      flagEvaluationTime: 0,
      failureCount: 0,
      successCount: 0,
      isCircuitBreakerOpen: false,
    };
    this.circuitBreakerOpenTime = null;
  }

  resetService(): void {
    this.close();
    this.state = {
      isInitialized: false,
      isInitializing: false,
      isOffline: false,
      metrics: {
        initializationTime: 0,
        flagEvaluationTime: 0,
        failureCount: 0,
        successCount: 0,
        isCircuitBreakerOpen: false,
      },
      config: { ...DEFAULT_LAUNCHDARKLY_CONFIG },
    };
    this.circuitBreakerOpenTime = null;
  }

  getVariationWithOverride<T>(flagKey: string, defaultValue: T): T {
    if (typeof window !== 'undefined' && window.localStorage) {
      const override = localStorage.getItem(`launchDarkly_override_${flagKey}`);
      if (override !== null) {
        try {
          return JSON.parse(override);
        } catch {
          console.warn(`Invalid override value for ${flagKey}:`, override);
        }
      }
    }
    return this.client?.variation(flagKey, defaultValue) ?? defaultValue;
  }

  setDeveloperOverride(
    flagKey: string,
    value: boolean | string | number
  ): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(
        `launchDarkly_override_${flagKey}`,
        JSON.stringify(value)
      );
      console.log(`Developer override set for ${flagKey}:`, value);
    }
  }

  clearDeveloperOverride(flagKey: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(`launchDarkly_override_${flagKey}`);
      console.log(`Developer override cleared for ${flagKey}`);
    }
  }

  clearAllDeveloperOverrides(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('launchDarkly_override_')) {
          localStorage.removeItem(key);
        }
      });
      console.log('All developer overrides cleared');
    }
  }
}

const launchDarklyService = new LaunchDarklyService();

// Utility function for tracking personalization seen events
export const trackPersonalizationSeen = (flagValue: boolean) => {
  // Track that the user has seen the personalization feature
  console.log('Personalization seen event tracked:', flagValue);
  // Additional tracking logic can be added here if needed
  // For example, sending to analytics service
};

export default launchDarklyService;
