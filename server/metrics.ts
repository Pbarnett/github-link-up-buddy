/**
 * Business Metrics for Phase 4 Day 15 Monitoring
 * 
 * Custom Prometheus metrics for business rule and feature flag monitoring
 */

import client from 'prom-client';

// Register default Node.js metrics (memory, CPU, etc.)
client.register.setDefaultLabels({
  app: 'parker-flight-api',
  environment: process.env.NODE_ENV || 'development'
});

// Custom business metrics

export const featureFlagHits = new client.Counter({
  name: 'feature_flag_hits_total',
  help: 'Total hits per feature flag with rollout status',
  labelNames: ['flag', 'userInRollout', 'enabled']
});

export const businessRulesConfigRequests = new client.Counter({
  name: 'business_rules_config_requests_total',
  help: 'Total requests to business rules config endpoint',
  labelNames: ['environment', 'status']
});

export const awsOperations = new client.Counter({
  name: 'aws_operations_total',
  help: 'Total AWS operations (S3, DynamoDB)',
  labelNames: ['service', 'operation', 'status']
});

export const apiResponseTime = new client.Histogram({
  name: 'api_response_time_seconds',
  help: 'API response time in seconds',
  labelNames: ['endpoint', 'method', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

// Business rule validation metrics
export const configValidationErrors = new client.Counter({
  name: 'config_validation_errors_total',
  help: 'Total config validation errors by type',
  labelNames: ['error_type', 'environment']
});

// Feature flag rollout metrics
export const rolloutPercentageGauge = new client.Gauge({
  name: 'feature_flag_rollout_percentage',
  help: 'Current rollout percentage for feature flags',
  labelNames: ['flag']
});

export const activeUsers = new client.Gauge({
  name: 'active_users_in_rollout',
  help: 'Number of users currently in feature flag rollout',
  labelNames: ['flag']
});

// Export the registry for /metrics endpoint
export const register = client.register;
