/**
 * AWS Network Resilience System
 * 
 * Comprehensive AWS network resilience with service-specific circuit breakers,
 * intelligent retries, rate limiting, and graceful degradation.
 */

export * from './circuit-breaker';
export * from './retry-strategy';
export * from './rate-limiter';
export * from './degradation-manager';
export * from './service-configs';
export * from './resilience-orchestrator';
export * from './types';

// Re-export commonly used functions
export {
  executeWithResilience,
  createAwsResilientClient,
  withAwsResilience,
} from './resilience-orchestrator';

export {
  AWS_SERVICE_CONFIGS,
  DEGRADATION_STRATEGIES,
} from './service-configs';

export {
  ErrorType,
  CircuitState,
  type ResilienceConfig,
  type ServiceConfig,
  type OperationMetrics,
} from './types';
