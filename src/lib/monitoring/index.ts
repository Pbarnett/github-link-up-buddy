/**
 * Parker Flight Enterprise Monitoring System
 * 
 * Comprehensive observability solution featuring:
 * - Advanced AWS KMS and Secrets Manager metrics
 * - Security alerting with CloudWatch alarms and SNS
 * - Multi-region health monitoring with Route53
 * - Distributed tracing with AWS X-Ray
 * - Centralized orchestration and reporting
 */

// Core Components
export { AdvancedAWSMetrics } from './advanced-aws-metrics.js';
export { SecurityAlertingThresholds } from './security-alerting.js';
export { MultiRegionHealthMonitor } from './multi-region-health.js';
export { DistributedTracing } from './distributed-tracing.js';

// Central Orchestrator
export { MonitoringOrchestrator } from './monitoring-orchestrator.js';

// Demo and Utilities
export { runMonitoringDemo } from './demo.js';

/**
 * Quick Start Usage:
 * 
 * ```typescript
 * import { MonitoringOrchestrator } from './monitoring';
 * 
 * const monitoring = new MonitoringOrchestrator();
 * await monitoring.initializeMonitoring();
 * ```
 * 
 * Environment Variables Required:
 * - AWS_REGION: AWS region for deployment
 * - SECURITY_TEAM_EMAIL: Email for security alerts
 * - ONCALL_PHONE: Phone number for critical alerts
 * - PAGERDUTY_WEBHOOK: PagerDuty webhook URL (optional)
 * - SLACK_WEBHOOK: Slack webhook URL (optional)
 * - PRIMARY_API_DOMAIN: Primary API domain for health checks
 * - PAYMENT_API_DOMAIN: Payment service domain (optional)
 * - AUTH_API_DOMAIN: Auth service domain (optional)
 */
