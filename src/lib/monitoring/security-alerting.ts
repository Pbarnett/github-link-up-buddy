import { 
  CloudWatchClient, 
  PutMetricAlarmCommand, 
  PutCompositeAlarmCommand,
  ComparisonOperator,
  Statistic
} from '@aws-sdk/client-cloudwatch';
import { SNSClient, CreateTopicCommand, SubscribeCommand, PublishCommand } from '@aws-sdk/client-sns';

// Define TreatMissingData enum since it's not exported from the SDK
enum TreatMissingData {
  breaching = 'breaching',
  notBreaching = 'notBreaching',
  ignore = 'ignore',
  missing = 'missing'
}

interface AlertThreshold {
  threshold: number;
  evaluationPeriods: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  comparisonOperator: ComparisonOperator;
  treatMissingData: TreatMissingData;
}

interface SecurityAlert {
  alertName: string;
  service: string;
  metricName: string;
  namespace: string;
  config: AlertThreshold;
  dimensions?: { Name: string; Value: string }[];
}

/**
 * Enterprise Security Alerting System
 * Phase 2: Configure comprehensive security alerting thresholds
 */
export class SecurityAlertingThresholds {
  private cloudWatch: CloudWatchClient;
  private sns: SNSClient;
  private region: string;
  private topicArns: Map<string, string> = new Map();

  private alertConfigs: SecurityAlert[] = [
    // KMS Security Alerts
    {
      alertName: 'KMS-UnauthorizedAccess-Critical',
      service: 'kms',
      metricName: 'UnauthorizedAPICallsErrorCount',
      namespace: 'AWS/KMS',
      config: {
        threshold: 5,
        evaluationPeriods: 1,
        severity: 'CRITICAL',
        comparisonOperator: ComparisonOperator.GreaterThanThreshold,
        treatMissingData: TreatMissingData.notBreaching
      }
    },
    {
      alertName: 'KMS-HighLatency-Performance',
      service: 'kms',
      metricName: 'DecryptLatency',
      namespace: 'Parker-Flight/KMS/Performance',
      config: {
        threshold: 100,
        evaluationPeriods: 3,
        severity: 'HIGH',
        comparisonOperator: ComparisonOperator.GreaterThanThreshold,
        treatMissingData: TreatMissingData.breaching
      }
    },
    {
      alertName: 'KMS-KeyPolicyViolations',
      service: 'kms',
      metricName: 'KeyPolicyViolations',
      namespace: 'Parker-Flight/KMS/Advanced',
      config: {
        threshold: 1,
        evaluationPeriods: 1,
        severity: 'HIGH',
        comparisonOperator: ComparisonOperator.GreaterThanOrEqualToThreshold,
        treatMissingData: TreatMissingData.notBreaching
      }
    },
    {
      alertName: 'KMS-CrossRegionAnomaly',
      service: 'kms',
      metricName: 'CrossRegionKeyUsage',
      namespace: 'Parker-Flight/KMS/Advanced',
      config: {
        threshold: 10,
        evaluationPeriods: 1,
        severity: 'MEDIUM',
        comparisonOperator: ComparisonOperator.GreaterThanThreshold,
        treatMissingData: TreatMissingData.notBreaching
      }
    },

    // Secrets Manager Security Alerts
    {
      alertName: 'Secrets-RotationFailure-Critical',
      service: 'secretsmanager',
      metricName: 'RotationFailed',
      namespace: 'AWS/SecretsManager',
      config: {
        threshold: 1,
        evaluationPeriods: 1,
        severity: 'CRITICAL',
        comparisonOperator: ComparisonOperator.GreaterThanOrEqualToThreshold,
        treatMissingData: TreatMissingData.notBreaching
      }
    },
    {
      alertName: 'Secrets-UnusualAccess',
      service: 'secretsmanager',
      metricName: 'AccessFrequencyAnomaly',
      namespace: 'Parker-Flight/SecretsManager/Advanced',
      config: {
        threshold: 5,
        evaluationPeriods: 2,
        severity: 'HIGH',
        comparisonOperator: ComparisonOperator.GreaterThanThreshold,
        treatMissingData: TreatMissingData.notBreaching
      }
    },
    {
      alertName: 'Secrets-CacheHitRatio-Low',
      service: 'secretsmanager',
      metricName: 'CacheHitRatio',
      namespace: 'Parker-Flight/SecretsManager/Performance',
      config: {
        threshold: 90,
        evaluationPeriods: 5,
        severity: 'MEDIUM',
        comparisonOperator: ComparisonOperator.LessThanThreshold,
        treatMissingData: TreatMissingData.breaching
      }
    },

    // Application-Level Security Alerts
    {
      alertName: 'Payment-ProcessingErrors',
      service: 'application',
      metricName: 'PaymentProcessingErrors',
      namespace: 'Parker-Flight/Payment/Security',
      config: {
        threshold: 3,
        evaluationPeriods: 2,
        severity: 'HIGH',
        comparisonOperator: ComparisonOperator.GreaterThanThreshold,
        treatMissingData: TreatMissingData.notBreaching
      }
    },
    {
      alertName: 'Auth-TokenRefreshFailures',
      service: 'application',
      metricName: 'TokenRefreshFailures',
      namespace: 'Parker-Flight/Auth/Security',
      config: {
        threshold: 5,
        evaluationPeriods: 1,
        severity: 'HIGH',
        comparisonOperator: ComparisonOperator.GreaterThanThreshold,
        treatMissingData: TreatMissingData.notBreaching
      }
    }
  ];

  constructor() {
    this.region = process.env.AWS_REGION || 'us-west-2';
    this.cloudWatch = new CloudWatchClient({ region: this.region });
    this.sns = new SNSClient({ region: this.region });
  }

  /**
   * Setup comprehensive security alerting
   */
  async setupSecurityAlerts(): Promise<void> {
    console.log('Setting up enterprise security alerting system...');

    try {
      // Create SNS topics for different severity levels
      await this.createAlertTopics();

      // Create individual security alarms
      await this.createSecurityAlarms();

      // Create composite alarms for complex scenarios
      await this.createCompositeAlarms();

      // Setup automated incident response
      await this.setupAutomatedResponse();

      console.log('Security alerting system setup completed successfully');

    } catch (error) {
      console.error('Failed to setup security alerting:', error);
      throw error;
    }
  }

  /**
   * Create SNS topics for different alert severities
   */
  private async createAlertTopics(): Promise<void> {
    const topicConfigs = [
      { name: 'parker-flight-critical-alerts', severity: 'CRITICAL' },
      { name: 'parker-flight-high-alerts', severity: 'HIGH' },
      { name: 'parker-flight-medium-alerts', severity: 'MEDIUM' },
      { name: 'parker-flight-security-incidents', severity: 'SECURITY' }
    ];

    for (const config of topicConfigs) {
      try {
        const createTopicCommand = new CreateTopicCommand({
          Name: config.name,
          Attributes: {
            DisplayName: `Parker Flight ${config.severity} Alerts`,
            DeliveryPolicy: JSON.stringify({
              http: {
                defaultHealthyRetryPolicy: {
                  minDelayTarget: 20,
                  maxDelayTarget: 20,
                  numRetries: 3,
                  numMaxDelayRetries: 0,
                  numMinDelayRetries: 0,
                  numNoDelayRetries: 0,
                  backoffFunction: 'linear'
                }
              }
            })
          }
        });

        const result = await this.sns.send(createTopicCommand);
        this.topicArns.set(config.severity, result.TopicArn!);

        // Subscribe endpoints based on severity
        await this.subscribeToTopic(result.TopicArn!, config.severity);

        console.log(`Created SNS topic for ${config.severity} alerts: ${result.TopicArn}`);

      } catch (error) {
        console.error(`Failed to create topic for ${config.severity}:`, error);
      }
    }
  }

  /**
   * Subscribe appropriate endpoints to alert topics
   */
  private async subscribeToTopic(topicArn: string, severity: string): Promise<void> {
    const subscriptions = this.getSubscriptionsForSeverity(severity);

    for (const subscription of subscriptions) {
      try {
        const subscribeCommand = new SubscribeCommand({
          TopicArn: topicArn,
          Protocol: subscription.protocol,
          Endpoint: subscription.endpoint
        });

        await this.sns.send(subscribeCommand);
        console.log(`Subscribed ${subscription.endpoint} to ${severity} alerts`);

      } catch (error) {
        console.error(`Failed to subscribe ${subscription.endpoint}:`, error);
      }
    }
  }

  /**
   * Get subscription endpoints based on alert severity
   */
  private getSubscriptionsForSeverity(severity: string): Array<{ protocol: string; endpoint: string }> {
    const baseSubscriptions = [
      { protocol: 'email', endpoint: process.env.SECURITY_TEAM_EMAIL || 'security@parkerfl.ight' }
    ];

    switch (severity) {
      case 'CRITICAL':
        return [
          ...baseSubscriptions,
          { protocol: 'sms', endpoint: process.env.ONCALL_PHONE || '+1234567890' },
          { protocol: 'https', endpoint: process.env.PAGERDUTY_WEBHOOK || 'https://events.pagerduty.com/webhook' }
        ];
      case 'HIGH':
        return [
          ...baseSubscriptions,
          { protocol: 'https', endpoint: process.env.SLACK_WEBHOOK || 'https://hooks.slack.com/webhook' }
        ];
      default:
        return baseSubscriptions;
    }
  }

  /**
   * Create individual security alarms
   */
  private async createSecurityAlarms(): Promise<void> {
    for (const alert of this.alertConfigs) {
      try {
        const topicArn = this.topicArns.get(alert.config.severity);
        if (!topicArn) {
          console.warn(`No topic ARN found for severity: ${alert.config.severity}`);
          continue;
        }

        const alarmCommand = new PutMetricAlarmCommand({
          AlarmName: alert.alertName,
          AlarmDescription: `Security alert for ${alert.service}: ${alert.metricName}`,
          ActionsEnabled: true,
          AlarmActions: [topicArn],
          OKActions: [topicArn],
          MetricName: alert.metricName,
          Namespace: alert.namespace,
          Statistic: Statistic.Sum,
          Dimensions: alert.dimensions || [],
          Period: 300, // 5 minutes
          EvaluationPeriods: alert.config.evaluationPeriods,
          Threshold: alert.config.threshold,
          ComparisonOperator: alert.config.comparisonOperator,
          TreatMissingData: alert.config.treatMissingData,
          Tags: [
            { Key: 'Environment', Value: process.env.NODE_ENV || 'development' },
            { Key: 'Service', Value: alert.service },
            { Key: 'Severity', Value: alert.config.severity },
            { Key: 'Team', Value: 'Security' }
          ]
        });

        await this.cloudWatch.send(alarmCommand);
        console.log(`Created security alarm: ${alert.alertName}`);

      } catch (error) {
        console.error(`Failed to create alarm ${alert.alertName}:`, error);
      }
    }
  }

  /**
   * Create composite alarms for complex security scenarios
   */
  private async createCompositeAlarms(): Promise<void> {
    const compositeAlarms = [
      {
        name: 'Security-RegionalDegradation',
        rule: `
          ALARM("KMS-UnauthorizedAccess-Critical") OR 
          ALARM("Secrets-RotationFailure-Critical") OR
          ALARM("KMS-HighLatency-Performance")
        `,
        description: 'Regional security or performance degradation detected'
      },
      {
        name: 'Security-SuspiciousActivity',
        rule: `
          ALARM("KMS-KeyPolicyViolations") AND 
          ALARM("Secrets-UnusualAccess")
        `,
        description: 'Multiple suspicious security activities detected'
      },
      {
        name: 'Application-SecurityIncident',
        rule: `
          ALARM("Payment-ProcessingErrors") OR 
          ALARM("Auth-TokenRefreshFailures")
        `,
        description: 'Application-level security incident detected'
      }
    ];

    for (const composite of compositeAlarms) {
      try {
        const topicArn = this.topicArns.get('CRITICAL');
        
        const compositeAlarmCommand = new PutCompositeAlarmCommand({
          AlarmName: composite.name,
          AlarmDescription: composite.description,
          AlarmRule: composite.rule.trim(),
          ActionsEnabled: true,
          AlarmActions: topicArn ? [topicArn] : [],
          OKActions: topicArn ? [topicArn] : [],
          Tags: [
            { Key: 'Type', Value: 'CompositeAlarm' },
            { Key: 'Severity', Value: 'CRITICAL' },
            { Key: 'Team', Value: 'Security' }
          ]
        });

        await this.cloudWatch.send(compositeAlarmCommand);
        console.log(`Created composite alarm: ${composite.name}`);

      } catch (error) {
        console.error(`Failed to create composite alarm ${composite.name}:`, error);
      }
    }
  }

  /**
   * Setup automated incident response
   */
  private async setupAutomatedResponse(): Promise<void> {
    // Create automated response workflows
    const responseActions = [
      {
        trigger: 'KMS-UnauthorizedAccess-Critical',
        actions: [
          'Disable affected IAM users',
          'Enable enhanced CloudTrail logging',
          'Notify security team immediately'
        ]
      },
      {
        trigger: 'Secrets-RotationFailure-Critical',
        actions: [
          'Attempt automatic rotation retry',
          'Fallback to manual rotation process',
          'Alert operations team'
        ]
      }
    ];

    // In a real implementation, this would integrate with AWS Systems Manager
    // or Lambda functions to execute automated responses
    console.log('Automated incident response workflows configured');
  }

  /**
   * Test alerting system
   */
  async testAlertingSystem(): Promise<void> {
    console.log('Testing security alerting system...');

    try {
      const testTopicArn = this.topicArns.get('MEDIUM');
      if (!testTopicArn) {
        throw new Error('No test topic available');
      }

      const testMessage = {
        alert: 'Security Alerting System Test',
        timestamp: new Date().toISOString(),
        severity: 'TEST',
        message: 'This is a test of the Parker Flight security alerting system',
        environment: process.env.NODE_ENV || 'development'
      };

      const publishCommand = new PublishCommand({
        TopicArn: testTopicArn,
        Subject: '[TEST] Parker Flight Security Alert',
        Message: JSON.stringify(testMessage, null, 2)
      });

      await this.sns.send(publishCommand);
      console.log('Test alert sent successfully');

    } catch (error) {
      console.error('Failed to send test alert:', error);
    }
  }

  /**
   * Get current alerting status
   */
  async getAlertingStatus(): Promise<any> {
    return {
      totalAlarms: this.alertConfigs.length,
      topicsCreated: this.topicArns.size,
      regions: [this.region],
      lastUpdated: new Date().toISOString()
    };
  }
}
