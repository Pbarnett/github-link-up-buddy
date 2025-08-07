/**
 * LaunchDarkly Server-Side Client Implementation
 * Based on comprehensive documentation analysis recommendations
 */

import {
  LDClient,
  init,
  LDContext,
  LDLogger,

./error-handler';
./analytics';

export interface FlagEvaluationOptions {
  timeout?: number;
  trackEvents?: boolean;
  includeReason?: boolean;
}

export class LaunchDarklyServerClient {
  private client: LDClient;
  private initialized: boolean = false;
  private readonly logger: LDLogger;

  constructor() {
    const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY;

    if (!sdkKey) {
      throw new Error('LAUNCHDARKLY_SDK_KEY environment variable is required');
    }

    // Initialize with production-ready configuration
    this.client = init(sdkKey, {
      logger: this.createLogger(),
      offline: process.env.NODE_ENV === 'test',
      useLdd: false, // Use streaming for real-time updates
      sendEvents: process.env.NODE_ENV !== 'test',
      allAttributesPrivate: true, // Privacy by default
      privateAttributes: ['email', 'ip'], // Explicit privacy controls
      capacity: 10000, // Event buffer capacity
      flushInterval: 5000, // Flush events every 5 seconds
      pollInterval: 30000, // Polling fallback interval
      streamInitialReconnectDelay: 1000,
      useReport: false, // Use GET for flag requests
      withReasons: true, // Include evaluation reasons for debugging
    });

    this.logger = this.createLogger();
  }

  private createLogger(): LDLogger {
    return {
      debug: (message: string) => {
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[LaunchDarkly] ${message}`);
        }
      },
      info: (message: string) => console.info(`[LaunchDarkly] ${message}`),
      warn: (message: string) => console.warn(`[LaunchDarkly] ${message}`),
      error: (message: string) => console.error(`[LaunchDarkly] ${message}`),
    };
  }

  /**
   * Wait for SDK initialization with timeout
   */
  async waitForInitialization(timeout: number = 10000): Promise<void> {
    try {
      await this.client.waitForInitialization(timeout);
      this.initialized = true;
      this.logger.info('SDK successfully initialized');
    } catch (error) {
      this.logger.error(`SDK initialization failed: ${error}`);
      throw new Error('LaunchDarkly SDK failed to initialize');
    }
  }

  /**
   * Evaluate a boolean feature flag with comprehensive error handling
   */
  async evaluateBooleanFlag(
    flagKey: string,
    context: LDContext,
    defaultValue: boolean,
    options: FlagEvaluationOptions = {}
  ): Promise<boolean> {
    const startTime = performance.now();

    try {
      if (!this.initialized) {
        this.logger.warn(
          `SDK not initialized, using fallback value for flag: ${flagKey}`
        );
        return defaultValue;
      }

      const result = await this.client.variation(
        flagKey,
        context,
        defaultValue
      );

      const evaluationTime = performance.now() - startTime;

      // Track analytics if enabled
      if (options.trackEvents !== false) {
        FlagAnalytics.trackFlagEvaluation(flagKey, result, context);
        FlagAnalytics.trackFlagPerformance(flagKey, {
          evaluationTime,
          success: true,
        });
      }

      this.logger.debug(
        `Flag ${flagKey} evaluated to: ${result} (${evaluationTime.toFixed(2)}ms)`
      );

      return result;
    } catch (error) {
      const evaluationTime = performance.now() - startTime;

      FlagAnalytics.trackFlagPerformance(flagKey, {
        evaluationTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return FlagErrorHandler.handleEvaluationError(
        error as Error,
        flagKey,
        defaultValue
      );
    }
  }

  /**
   * Evaluate a string feature flag
   */
  async evaluateStringFlag(
    flagKey: string,
    context: LDContext,
    defaultValue: string,
    options: FlagEvaluationOptions = {}
  ): Promise<string> {
    const startTime = performance.now();

    try {
      if (!this.initialized) {
        return defaultValue;
      }

      const result = await this.client.variation(
        flagKey,
        context,
        defaultValue
      );

      if (options.trackEvents !== false) {
        FlagAnalytics.trackFlagEvaluation(flagKey, result, context);
      }

      return result;
    } catch (error) {
      return FlagErrorHandler.handleEvaluationError(
        error as Error,
        flagKey,
        defaultValue
      );
    }
  }

  /**
   * Evaluate a numeric feature flag
   */
  async evaluateNumberFlag(
    flagKey: string,
    context: LDContext,
    defaultValue: number,
    options: FlagEvaluationOptions = {}
  ): Promise<number> {
    try {
      if (!this.initialized) {
        return defaultValue;
      }

      const result = await this.client.variation(
        flagKey,
        context,
        defaultValue
      );

      if (options.trackEvents !== false) {
        FlagAnalytics.trackFlagEvaluation(flagKey, result, context);
      }

      return result;
    } catch (error) {
      return FlagErrorHandler.handleEvaluationError(
        error as Error,
        flagKey,
        defaultValue
      );
    }
  }

  /**
   * Evaluate a JSON feature flag
   */
  async evaluateJsonFlag<T>(
    flagKey: string,
    context: LDContext,
    defaultValue: T,
    options: FlagEvaluationOptions = {}
  ): Promise<T> {
    try {
      if (!this.initialized) {
        return defaultValue;
      }

      const result = await this.client.variation(
        flagKey,
        context,
        defaultValue
      );

      if (options.trackEvents !== false) {
        FlagAnalytics.trackFlagEvaluation(flagKey, result, context);
      }

      return result;
    } catch (error) {
      return FlagErrorHandler.handleEvaluationError(
        error as Error,
        flagKey,
        defaultValue
      );
    }
  }

  /**
   * Get detailed flag evaluation with reason
   */
  async evaluateBooleanFlagWithDetails(
    flagKey: string,
    context: LDContext,
    defaultValue: boolean
  ): Promise<{ value: boolean; reason?: any; variationIndex?: number }> {
    try {
      if (!this.initialized) {
        return { value: defaultValue };
      }

      const detail = await this.client.variationDetail(
        flagKey,
        context,
        defaultValue
      );

      return {
        value: detail.value,
        reason: detail.reason,
        variationIndex: detail.variationIndex,
      };
    } catch (error) {
      const fallbackValue = FlagErrorHandler.handleEvaluationError(
        error as Error,
        flagKey,
        defaultValue
      );
      return { value: fallbackValue };
    }
  }

  /**
   * Batch evaluate multiple flags for performance
   */
  async evaluateAllFlags(context: LDContext): Promise<Record<string, any>> {
    try {
      if (!this.initialized) {
        this.logger.warn('SDK not initialized for batch evaluation');
        return {};
      }

      return await this.client.allFlagsState(context, {
        withReasons: process.env.NODE_ENV === 'development',
        detailsOnlyForTrackedFlags: true,
        clientSideOnly: false,
      });
    } catch (error) {
      this.logger.error(`Batch flag evaluation failed: ${error}`);
      return {};
    }
  }

  /**
   * Track custom events for metrics
   */
  async track(
    eventName: string,
    context: LDContext,
    data?: any,
    metricValue?: number
  ): Promise<void> {
    try {
      if (!this.initialized) {
        this.logger.warn(
          `Cannot track event ${eventName}: SDK not initialized`
        );
        return;
      }

      await this.client.track(eventName, context, data, metricValue);
    } catch (error) {
      this.logger.error(`Event tracking failed for ${eventName}: ${error}`);
    }
  }

  /**
   * Identify a context (for analytics)
   */
  async identify(context: LDContext): Promise<void> {
    try {
      if (!this.initialized) {
        return;
      }

      await this.client.identify(context);
    } catch (error) {
      this.logger.error(`Context identification failed: ${error}`);
    }
  }

  /**
   * Flush pending events immediately
   */
  async flush(): Promise<void> {
    try {
      await this.client.flush();
    } catch (error) {
      this.logger.error(`Event flush failed: ${error}`);
    }
  }

  /**
   * Check if SDK is initialized and ready
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get initialization status
   */
  getInitializationState(): 'initializing' | 'initialized' | 'failed' {
    if (!this.client) return 'failed';
    if (this.initialized) return 'initialized';
    return 'initializing';
  }

  /**
   * Graceful shutdown with pending event flush
   */
  async shutdown(): Promise<void> {
    try {
      this.logger.info('Shutting down LaunchDarkly client...');

      // Flush any pending events
      await this.flush();

      // Close the client
      await this.client.close();

      this.initialized = false;
      this.logger.info('LaunchDarkly client shut down successfully');
    } catch (error) {
      this.logger.error(`Shutdown error: ${error}`);
    }
  }
}

// Singleton instance for application use
let serverClientInstance: LaunchDarklyServerClient | null = null;

export function getLaunchDarklyServerClient(): LaunchDarklyServerClient {
  if (!serverClientInstance) {
    serverClientInstance = new LaunchDarklyServerClient();
  }
  return serverClientInstance;
}

// Clean shutdown handler
if (typeof process !== 'undefined') {
  const gracefulShutdown = async () => {
    if (serverClientInstance) {
      await serverClientInstance.shutdown();
    }
    process.exit(0);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}
