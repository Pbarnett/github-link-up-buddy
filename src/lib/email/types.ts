/**
 * Email Infrastructure Types
 * 
 * Comprehensive type definitions for the email system including
 * retry logic, circuit breaker, queue management, and monitoring.
 */

export interface EmailMessage {
  id: string;
  to: string | string[];
  from: string;
  subject: string;
  html?: string;
  text?: string;
  templateId?: string;
  templateData?: Record<string, unknown>;
  priority: EmailPriority;
  scheduledAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export enum EmailPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  URGENT = 3,
  CRITICAL = 4
}

export enum EmailStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  SENDING = 'sending',
  SENT = 'sent',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  RETRYING = 'retrying'
}

export interface EmailAttempt {
  id: string;
  emailId: string;
  attemptNumber: number;
  status: EmailStatus;
  error?: EmailError;
  startedAt: Date;
  completedAt?: Date;
  responseData?: unknown;
  metadata?: Record<string, unknown>;
}

export interface EmailError {
  code: string;
  message: string;
  type: EmailErrorType;
  retryable: boolean;
  provider?: string;
  httpStatus?: number;
  details?: Record<string, unknown>;
}

export enum EmailErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  RATE_LIMIT = 'rate_limit',
  QUOTA_EXCEEDED = 'quota_exceeded',
  INVALID_EMAIL = 'invalid_email',
  PROVIDER_ERROR = 'provider_error',
  TEMPLATE_ERROR = 'template_error',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown'
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number; // milliseconds
  maxDelay: number; // milliseconds
  backoffMultiplier: number;
  jitter: boolean;
  retryableErrors: EmailErrorType[];
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number; // milliseconds
  monitoringWindow: number; // milliseconds
  enabled: boolean;
}

export enum CircuitBreakerState {
  CLOSED = 'closed',
  OPEN = 'open',
  HALF_OPEN = 'half_open'
}

export interface CircuitBreakerStatus {
  state: CircuitBreakerState;
  failureCount: number;
  successCount: number;
  lastFailureTime?: Date;
  nextAttemptTime?: Date;
  isRequestAllowed: boolean;
}

export interface QueueConfig {
  maxSize: number;
  processingConcurrency: number;
  batchSize: number;
  processingInterval: number; // milliseconds
  priorityWeights: Record<EmailPriority, number>;
  deadLetterQueue: boolean;
  maxRetentionTime: number; // milliseconds
}

export interface QueueMetrics {
  totalQueued: number;
  processing: number;
  completed: number;
  failed: number;
  retrying: number;
  queueSizeByPriority: Record<EmailPriority, number>;
  averageProcessingTime: number;
  throughputPerMinute: number;
}

export interface EmailMetrics {
  totalSent: number;
  totalFailed: number;
  successRate: number;
  averageDeliveryTime: number;
  retryRate: number;
  circuitBreakerTriggers: number;
  queueMetrics: QueueMetrics;
  errorsByType: Record<EmailErrorType, number>;
  providerMetrics: Record<string, ProviderMetrics>;
}

export interface ProviderMetrics {
  totalRequests: number;
  successCount: number;
  failureCount: number;
  averageResponseTime: number;
  lastSuccessTime?: Date;
  lastFailureTime?: Date;
  circuitBreakerState: CircuitBreakerState;
}

export interface EmailProvider {
  name: string;
  priority: number;
  enabled: boolean;
  config: Record<string, unknown>;
  circuitBreaker: CircuitBreakerStatus;
  sendEmail(message: EmailMessage): Promise<EmailSendResult>;
  validateConfig(): boolean;
  getHealth(): Promise<ProviderHealth>;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: EmailError;
  responseTime: number;
  provider: string;
  metadata?: Record<string, unknown>;
}

export interface ProviderHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastChecked: Date;
  details?: Record<string, unknown>;
}

export interface MonitoringConfig {
  enableMetrics: boolean;
  enableTracing: boolean;
  enableAlerting: boolean;
  metricsInterval: number; // milliseconds
  alertThresholds: AlertThresholds;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface AlertThresholds {
  failureRate: number; // percentage
  queueSize: number;
  processingTime: number; // milliseconds
  circuitBreakerTriggers: number;
}

export interface EmailServiceConfig {
  providers: EmailProvider[];
  retry: RetryConfig;
  circuitBreaker: CircuitBreakerConfig;
  queue: QueueConfig;
  monitoring: MonitoringConfig;
  defaultFrom: string;
  enableFallback: boolean;
}

export interface EmailJob {
  id: string;
  message: EmailMessage;
  attempts: EmailAttempt[];
  status: EmailStatus;
  priority: EmailPriority;
  scheduledAt: Date;
  processAfter?: Date;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  text?: string;
  variables: string[];
  metadata?: Record<string, unknown>;
  version: number;
  isActive: boolean;
}

export interface EmailBatch {
  id: string;
  emails: EmailMessage[];
  totalCount: number;
  processedCount: number;
  successCount: number;
  failureCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}
