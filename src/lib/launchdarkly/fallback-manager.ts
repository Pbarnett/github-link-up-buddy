import * as React from 'react';
import { LDFlagValue } from 'launchdarkly-js-client-sdk';
export interface FallbackConfig {
  [flagKey: string]: {
    defaultValue: LDFlagValue;
    fallbackReason?: string;
    criticalFlag?: boolean;
    description?: string;
  };
}

export interface FallbackState {
  isOffline: boolean;
  lastConnectionTime?: Date;
  failedAttempts: number;
  fallbacksActive: string[];
  errors: string[];
}

export class LaunchDarklyFallbackManager {
  private static fallbackConfig: FallbackConfig = {
    // Critical business flags
    wallet_ui: {
      defaultValue: false,
      fallbackReason:
        'Safety first - disable new wallet UI if connectivity issues',
      criticalFlag: true,
      description: 'Controls new wallet UI rollout',
    },
    personalization_greeting: {
      defaultValue: false,
      fallbackReason: 'Graceful degradation - show standard greeting',
      criticalFlag: false,
      description: 'Personalizes user greeting messages',
    },
    profile_ui_revamp: {
      defaultValue: false,
      fallbackReason: 'Conservative fallback - use existing profile UI',
      criticalFlag: true,
      description: 'Controls profile UI redesign',
    },
    show_opt_out_banner: {
      defaultValue: false,
      fallbackReason:
        'Privacy-friendly default - no banner unless explicitly enabled',
      criticalFlag: false,
      description: 'Controls opt-out banner visibility',
    },
    // Default fallbacks for unknown flags
    default_boolean: {
      defaultValue: false,
      fallbackReason: 'Conservative default for unknown boolean flags',
      criticalFlag: false,
    },
    default_string: {
      defaultValue: '',
      fallbackReason: 'Safe default for unknown string flags',
      criticalFlag: false,
    },
    default_number: {
      defaultValue: 0,
      fallbackReason: 'Safe default for unknown number flags',
      criticalFlag: false,
    },
  };

  private static state: FallbackState = {
    isOffline: false,
    failedAttempts: 0,
    fallbacksActive: [],
    errors: [],
  };

  /**
   * Gets fallback value for a flag
   */
  static getFallbackValue(
    flagKey: string,
    requestedType?: 'boolean' | 'string' | 'number'
  ): LDFlagValue {
    const config = this.fallbackConfig[flagKey];

    if (config) {
      console.warn(
        `[LaunchDarkly Fallback] Using fallback for ${flagKey}: ${config.fallbackReason}`
      );
      this.trackFallbackUsage(flagKey);
      return config.defaultValue;
    }

    // Use type-specific defaults for unknown flags
    const typeDefault = this.getTypeDefaultValue(requestedType);
    console.warn(
      `[LaunchDarkly Fallback] Using type default for unknown flag ${flagKey}: ${typeDefault}`
    );
    this.trackFallbackUsage(flagKey);
    return typeDefault;
  }

  /**
   * Gets type-specific default value
   */
  private static getTypeDefaultValue(
    type?: 'boolean' | 'string' | 'number'
  ): LDFlagValue {
    switch (type) {
      case 'boolean':
        return this.fallbackConfig['default_boolean'].defaultValue;
      case 'string':
        return this.fallbackConfig['default_string'].defaultValue;
      case 'number':
        return this.fallbackConfig['default_number'].defaultValue;
      default:
        return this.fallbackConfig['default_boolean'].defaultValue;
    }
  }

  /**
   * Tracks fallback usage for monitoring
   */
  private static trackFallbackUsage(flagKey: string): void {
    if (!this.state.fallbacksActive.includes(flagKey)) {
      this.state.fallbacksActive.push(flagKey);
    }
  }

  /**
   * Handles SDK connection failure
   */
  static handleConnectionFailure(error: Error): void {
    this.state.isOffline = true;
    this.state.failedAttempts++;
    this.state.errors.push(`${new Date().toISOString()}: ${error.message}`);

    console.error(
      `[LaunchDarkly Fallback] Connection failed (attempt ${this.state.failedAttempts}):`,
      error.message
    );

    // Keep only last 10 errors
    if (this.state.errors.length > 10) {
      this.state.errors = this.state.errors.slice(-10);
    }
  }

  /**
   * Handles successful SDK connection
   */
  static handleConnectionSuccess(): void {
    const wasOffline = this.state.isOffline;

    this.state.isOffline = false;
    this.state.lastConnectionTime = new Date();
    this.state.failedAttempts = 0;
    this.state.fallbacksActive = [];

    if (wasOffline) {
      console.info(
        '[LaunchDarkly Fallback] Connection restored, fallbacks deactivated'
      );
    }
  }

  /**
   * Checks if fallbacks are currently active
   */
  static areFallbacksActive(): boolean {
    return this.state.isOffline || this.state.fallbacksActive.length > 0;
  }

  /**
   * Gets current fallback state for monitoring
   */
  static getFallbackState(): FallbackState {
    return { ...this.state };
  }

  /**
   * Registers custom fallback config
   */
  static registerFallbackConfig(
    flagKey: string,
    config: FallbackConfig[string]
  ): void {
    this.fallbackConfig[flagKey] = config;
    console.info(`[LaunchDarkly Fallback] Registered fallback for ${flagKey}`);
  }

  /**
   * Creates wrapped flag evaluation with automatic fallback
   */
  static createSafeFlagEvaluator<T extends LDFlagValue>(
    flagKey: string,
    defaultValue: T,
    sdkEvaluator: () => Promise<T> | T
  ): () => Promise<T> {
    return async (): Promise<T> => {
      try {
        const result = await sdkEvaluator()();

        // If we got a result, connection is working
        if (!this.state.isOffline && this.state.failedAttempts > 0) {
          this.handleConnectionSuccess();
        }

        return result;
      } catch (error) {
        this.handleConnectionFailure(error as Error);
        return this.getFallbackValue(flagKey, typeof defaultValue as any) as T;
      }
    };
  }

  /**
   * Creates monitoring report for fallback usage
   */
  static createFallbackReport(): string {
    const report = [
      '=== LaunchDarkly Fallback Report ===',
      `Status: ${this.state.isOffline ? 'OFFLINE' : 'ONLINE'}`,
      `Failed Attempts: ${this.state.failedAttempts}`,
      `Active Fallbacks: ${this.state.fallbacksActive.length}`,
      `Last Connection: ${this.state.lastConnectionTime?.toISOString() || 'Never'}`,
      '',
      'Active Fallbacks:',
      ...this.state.fallbacksActive.map(flag => `  - ${flag}`),
      '',
      'Recent Errors:',
      ...this.state.errors.map(error => `  - ${error}`),
      '=================================',
    ].join('\n');

    return report;
  }

  /**
   * Resets fallback state (useful for testing)
   */
  static resetState(): void {
    this.state = {
      isOffline: false,
      failedAttempts: 0,
      fallbacksActive: [],
      errors: [],
    };
  }
}
