/**
 * AWS Resilience System Types
 */

export enum ErrorType {
  RETRYABLE = 'retryable',
  NON_RETRYABLE = 'non_retryable',
  THROTTLING = 'throttling',
  CIRCUIT_BREAKER = 'circuit_breaker',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  SERVICE_UNAVAILABLE = 'service_unavailable',
  NETWORK = 'network'
}

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitterFactor: number;
  retryableErrors: string[];
  nonRetryableErrors: string[];
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  timeoutMs: number;
  resetTimeoutMs: number;
  halfOpenMaxCalls: number;
}

export interface RateLimiterConfig {
  maxTokens: number;
  refillRate: number; // tokens per second
  globalLimits: {
    maxRetries: number;
    windowMs: number;
  };
}

export interface ServiceConfig {
  name: string;
  failureThreshold: number;
  timeoutMs: number;
  resetTimeoutMs: number;
  halfOpenMaxCalls: number;
  retryConfig: RetryConfig;
  rateLimiter: RateLimiterConfig;
  errorClassifier: (error: any) => ErrorType;
  healthCheck: () => Promise<boolean>;
}

export interface FallbackMethod {
  name: string;
  execute: (context?: any) => Promise<any>;
  priority: number;
  healthCheck?: () => Promise<boolean>;
}

export interface DegradationStrategy {
  serviceName: string;
  fallbackMethods: FallbackMethod[];
  recoveryCriteria: {
    consecutiveSuccesses: number;
    timeWindow: number;
    healthCheckInterval: number;
  };
}

export interface OperationMetrics {
  totalRequests: number;
  successCount: number;
  failureCount: number;
  avgResponseTime: number;
  p95ResponseTime: number;
  circuitState: CircuitState;
  lastFailureTime: number;
  consecutiveFailures: number;
  retryCount: number;
  fallbackUsageCount: number;
}

export interface CircuitBreakerMetrics {
  state: CircuitState;
  failures: number;
  successes: number;
  requests: number;
  lastFailureTime: number;
  lastSuccessTime: number;
  stateChangedAt: number;
  halfOpenCalls: number;
}

export interface ResilienceConfig {
  serviceConfig: ServiceConfig;
  circuitBreakerConfig: CircuitBreakerConfig;
  retryConfig: RetryConfig;
  rateLimiterConfig: RateLimiterConfig;
  degradationStrategy?: DegradationStrategy;
}

export interface AwsServiceError {
  name: string;
  code?: string;
  message: string;
  statusCode?: number;
  retryable?: boolean;
  throttling?: boolean;
  $metadata?: {
    httpStatusCode?: number;
    requestId?: string;
    attempts?: number;
  };
}

export interface ResilienceContext {
  serviceName: string;
  operationName: string;
  attempt: number;
  startTime: number;
  metadata?: Record<string, any>;
}
