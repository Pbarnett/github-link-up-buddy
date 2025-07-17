export interface LaunchDarklyConfig {
  // Retry configuration
  retryConfig: {
    maxRetries: number;
    backoffMultiplier: number;
    initialDelay: number;
    maxDelay: number;
  };
  
  // Timeout configuration
  timeoutConfig: {
    initializationTimeout: number;
    flagEvaluationTimeout: number;
  };
  
  // Offline mode configuration
  offlineMode: {
    enabled: boolean;
    fallbackFlags: Record<string, boolean | string | number>;
  };
  
  // Resilience enhancements
  resilience: {
    enabled: boolean;
    circuitBreakerEnabled: boolean;
    circuitBreakerThreshold: number;
    circuitBreakerResetTimeout: number;
  };
}

export interface LaunchDarklyMetrics {
  initializationTime: number;
  flagEvaluationTime: number;
  failureCount: number;
  successCount: number;
  lastErrorTime?: number;
  lastSuccessTime?: number;
  isCircuitBreakerOpen: boolean;
}

export interface LaunchDarklyServiceState {
  isInitialized: boolean;
  isInitializing: boolean;
  isOffline: boolean;
  lastError?: Error;
  metrics: LaunchDarklyMetrics;
  config: LaunchDarklyConfig;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
}

export const DEFAULT_LAUNCHDARKLY_CONFIG: LaunchDarklyConfig = {
  retryConfig: {
    maxRetries: 3,
    backoffMultiplier: 2,
    initialDelay: 1000,
    maxDelay: 10000,
  },
  timeoutConfig: {
    initializationTimeout: 10000,
    flagEvaluationTimeout: 5000,
  },
  offlineMode: {
    enabled: true,
    fallbackFlags: {
      personalization_greeting: false,
      show_opt_out_banner: false,
      enhanced_launchdarkly_resilience: false,
    },
  },
  resilience: {
    enabled: true,
    circuitBreakerEnabled: true,
    circuitBreakerThreshold: 5,
    circuitBreakerResetTimeout: 60000,
  },
};
