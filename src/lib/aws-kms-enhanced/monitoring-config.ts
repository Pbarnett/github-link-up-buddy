/**
 * Enhanced KMS Monitoring and Security Event Detection
 * 
 * Implementing AWS AI Bot recommendations for world-class monitoring:
 * 1. CloudWatch alarms for security events and performance
 * 2. EventBridge rules for real-time security monitoring
 * 3. CloudTrail integration for audit compliance
 * 4. Custom metrics for application-level KMS usage
 */

export interface KMSMonitoringConfig {
  environment: 'development' | 'staging' | 'production';
  region: string;
  accountId: string;
  keyIds: {
    paymentKey: string;
    piiKey: string;
    databaseKey: string;
    apiKey: string;
  };
  alerting: {
    snsTopicArn: string;
    slackWebhookUrl?: string;
    emailAddresses: string[];
  };
}

/**
 * CloudWatch Alarms Configuration for KMS Security Monitoring
 */
export function generateKMSCloudWatchAlarms(config: KMSMonitoringConfig) {
  const { environment, region, keyIds, alerting } = config;
  
  return {
    // High-priority security alarms
    'KMS-Failed-Decrypt-Operations': {
      AlarmName: `${environment}-KMS-Failed-Decrypt-Operations`,
      AlarmDescription: 'Multiple failed KMS decrypt operations detected - potential security incident',
      ActionsEnabled: true,
      AlarmActions: [alerting.snsTopicArn],
      MetricName: 'NumberOfWrongKeyUsageException',
      Namespace: 'AWS/KMS',
      Statistic: 'Sum',
      Dimensions: [
        {
          Name: 'KeyId',
          Value: keyIds.paymentKey // Monitor payment key most closely
        }
      ],
      Period: 300, // 5 minutes
      EvaluationPeriods: 1,
      Threshold: 5, // Alert on 5+ failed attempts in 5 minutes
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      TreatMissingData: 'notBreaching'
    },

    'KMS-Unusual-Usage-Volume': {
      AlarmName: `${environment}-KMS-Unusual-Usage-Volume`,
      AlarmDescription: 'Unusual volume of KMS operations detected',
      ActionsEnabled: true,
      AlarmActions: [alerting.snsTopicArn],
      MetricName: 'NumberOfRequestsSucceeded',
      Namespace: 'AWS/KMS',
      Statistic: 'Sum',
      Period: 900, // 15 minutes
      EvaluationPeriods: 2,
      Threshold: 1000, // Alert if >1000 operations in 15 minutes
      ComparisonOperator: 'GreaterThanThreshold',
      TreatMissingData: 'notBreaching'
    },

    'KMS-Unauthorized-Access-Attempts': {
      AlarmName: `${environment}-KMS-Unauthorized-Access-Attempts`,
      AlarmDescription: 'Unauthorized access attempts to KMS keys detected',
      ActionsEnabled: true,
      AlarmActions: [alerting.snsTopicArn],
      MetricName: 'NumberOfAccessDeniedException',
      Namespace: 'AWS/KMS',
      Statistic: 'Sum',
      Period: 300, // 5 minutes
      EvaluationPeriods: 1,
      Threshold: 3, // Alert on 3+ unauthorized attempts
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      TreatMissingData: 'notBreaching'
    },

    'KMS-Key-Policy-Changes': {
      AlarmName: `${environment}-KMS-Key-Policy-Changes`,
      AlarmDescription: 'KMS key policy modifications detected',
      ActionsEnabled: true,
      AlarmActions: [alerting.snsTopicArn],
      MetricName: 'NumberOfPutKeyPolicyRequests',
      Namespace: 'AWS/KMS',
      Statistic: 'Sum',
      Period: 300,
      EvaluationPeriods: 1,
      Threshold: 1, // Alert on any policy change
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      TreatMissingData: 'notBreaching'
    },

    // Performance monitoring alarms
    'KMS-High-Latency': {
      AlarmName: `${environment}-KMS-High-Latency`,
      AlarmDescription: 'KMS operations experiencing high latency',
      ActionsEnabled: true,
      AlarmActions: [alerting.snsTopicArn],
      MetricName: 'ResponseTime',
      Namespace: 'AWS/KMS',
      Statistic: 'Average',
      Period: 300,
      EvaluationPeriods: 2,
      Threshold: 1000, // Alert if average response time > 1 second
      ComparisonOperator: 'GreaterThanThreshold',
      TreatMissingData: 'notBreaching'
    }
  };
}

/**
 * EventBridge Rules for Real-time KMS Security Monitoring
 */
export function generateKMSEventBridgeRules(config: KMSMonitoringConfig) {
  const { environment, keyIds } = config;

  return {
    'KMS-Administrative-Actions': {
      Name: `${environment}-KMS-Administrative-Actions`,
      Description: 'Monitor administrative actions on KMS keys',
      EventPattern: {
        source: ['aws.kms'],
        'detail-type': ['AWS API Call via CloudTrail'],
        detail: {
          eventSource: ['kms.amazonaws.com'],
          eventName: [
            'PutKeyPolicy',
            'CreateGrant',
            'RevokeGrant',
            'RetireGrant',
            'DisableKey',
            'ScheduleKeyDeletion',
            'CancelKeyDeletion'
          ],
          resources: {
            ARN: Object.values(keyIds).map(keyId => 
              `arn:aws:kms:${config.region}:${config.accountId}:key/${keyId}`
            )
          }
        }
      },
      State: 'ENABLED',
      Targets: [
        {
          Id: '1',
          Arn: config.alerting.snsTopicArn,
          InputTransformer: {
            InputPathsMap: {
              eventName: '$.detail.eventName',
              userIdentity: '$.detail.userIdentity.type',
              sourceIPAddress: '$.detail.sourceIPAddress',
              keyId: '$.detail.resources[0].ARN'
            },
            InputTemplate: '{"alert": "KMS Administrative Action", "event": "<eventName>", "user": "<userIdentity>", "ip": "<sourceIPAddress>", "key": "<keyId>"}'
          }
        }
      ]
    },

    'KMS-Failed-Operations': {
      Name: `${environment}-KMS-Failed-Operations`,
      Description: 'Monitor failed KMS operations',
      EventPattern: {
        source: ['aws.kms'],
        'detail-type': ['AWS API Call via CloudTrail'],
        detail: {
          eventSource: ['kms.amazonaws.com'],
          errorCode: ['AccessDenied', 'InvalidKeyUsage.WrongKeyUsage', 'KMSInvalidStateException'],
          resources: {
            ARN: Object.values(keyIds).map(keyId => 
              `arn:aws:kms:${config.region}:${config.accountId}:key/${keyId}`
            )
          }
        }
      },
      State: 'ENABLED',
      Targets: [
        {
          Id: '1',
          Arn: config.alerting.snsTopicArn,
          InputTransformer: {
            InputPathsMap: {
              errorCode: '$.detail.errorCode',
              eventName: '$.detail.eventName',
              sourceIPAddress: '$.detail.sourceIPAddress',
              userIdentity: '$.detail.userIdentity.arn'
            },
            InputTemplate: '{"alert": "KMS Operation Failed", "error": "<errorCode>", "operation": "<eventName>", "ip": "<sourceIPAddress>", "user": "<userIdentity>"}'
          }
        }
      ]
    },

    'KMS-Suspicious-Activity': {
      Name: `${environment}-KMS-Suspicious-Activity`,
      Description: 'Monitor suspicious KMS activity patterns',
      EventPattern: {
        source: ['aws.kms'],
        'detail-type': ['AWS API Call via CloudTrail'],
        detail: {
          eventSource: ['kms.amazonaws.com'],
          eventName: ['Decrypt', 'Encrypt'],
          sourceIPAddress: {
            'not-exists': false // Ensure IP is captured
          },
          userIdentity: {
            type: ['AssumedRole', 'IAMUser'],
            principalId: {
              'not-starts-with': ['AIDA', 'AROA'] // Detect unusual principal patterns
            }
          }
        }
      },
      State: 'ENABLED'
    }
  };
}

/**
 * Custom CloudWatch Metrics for Application-Level KMS Usage
 */
export class KMSApplicationMetrics {
  private cloudWatch: any;
  private namespace: string;
  private environment: string;

  constructor(config: { cloudWatch: any; environment: string }) {
    this.cloudWatch = config.cloudWatch;
    this.environment = config.environment;
    this.namespace = `FlightBooking/KMS/${config.environment}`;
  }

  /**
   * Record KMS operation metrics
   */
  async recordKMSOperation(operation: string, keyUsage: string, success: boolean, duration: number) {
    const timestamp = new Date();
    
    const metrics = [
      {
        MetricName: 'KMSOperationCount',
        Dimensions: [
          { Name: 'Operation', Value: operation },
          { Name: 'KeyUsage', Value: keyUsage },
          { Name: 'Status', Value: success ? 'Success' : 'Failure' }
        ],
        Value: 1,
        Unit: 'Count',
        Timestamp: timestamp
      },
      {
        MetricName: 'KMSOperationDuration',
        Dimensions: [
          { Name: 'Operation', Value: operation },
          { Name: 'KeyUsage', Value: keyUsage }
        ],
        Value: duration,
        Unit: 'Milliseconds',
        Timestamp: timestamp
      }
    ];

    if (!success) {
      metrics.push({
        MetricName: 'KMSFailureRate',
        Dimensions: [
          { Name: 'Operation', Value: operation },
          { Name: 'KeyUsage', Value: keyUsage }
        ],
        Value: 1,
        Unit: 'Count',
        Timestamp: timestamp
      });
    }

    await this.cloudWatch.putMetricData({
      Namespace: this.namespace,
      MetricData: metrics
    }).promise();
  }

  /**
   * Record security events
   */
  async recordSecurityEvent(eventType: string, severity: 'low' | 'medium' | 'high' | 'critical', details: any) {
    await this.cloudWatch.putMetricData({
      Namespace: `${this.namespace}/Security`,
      MetricData: [
        {
          MetricName: 'SecurityEvent',
          Dimensions: [
            { Name: 'EventType', Value: eventType },
            { Name: 'Severity', Value: severity }
          ],
          Value: 1,
          Unit: 'Count',
          Timestamp: new Date()
        }
      ]
    }).promise();

    // Log detailed security event for audit
    console.log(JSON.stringify({
      eventType: 'KMSSecurityEvent',
      severity,
      eventDetails: eventType,
      timestamp: new Date().toISOString(),
      environment: this.environment,
      details
    }));
  }

  /**
   * Record cache performance metrics
   */
  async recordCacheMetrics(operation: string, hit: boolean, ttl?: number) {
    const metrics = [
      {
        MetricName: 'KMSCacheHitRate',
        Dimensions: [
          { Name: 'Operation', Value: operation },
          { Name: 'Result', Value: hit ? 'Hit' : 'Miss' }
        ],
        Value: 1,
        Unit: 'Count',
        Timestamp: new Date()
      }
    ];

    if (ttl) {
      metrics.push({
        MetricName: 'KMSCacheTTL',
        Dimensions: [
          { Name: 'Operation', Value: operation }
        ],
        Value: ttl,
        Unit: 'Seconds',
        Timestamp: new Date()
      });
    }

    await this.cloudWatch.putMetricData({
      Namespace: `${this.namespace}/Cache`,
      MetricData: metrics
    }).promise();
  }
}

/**
 * CloudTrail Configuration for KMS Audit Compliance
 */
export function generateKMSCloudTrailConfig(config: KMSMonitoringConfig) {
  return {
    TrailName: `${config.environment}-KMS-Audit-Trail`,
    S3BucketName: `${config.accountId}-${config.environment}-kms-audit-logs`,
    S3KeyPrefix: 'kms-audit-logs',
    IncludeGlobalServiceEvents: true,
    IsMultiRegionTrail: true,
    EnableLogFileValidation: true,
    
    // Event selectors for KMS-specific logging
    EventSelectors: [
      {
        ReadWriteType: 'All',
        IncludeManagementEvents: true,
        DataResources: [
          {
            Type: 'AWS::KMS::Key',
            Values: Object.values(config.keyIds).map(keyId => 
              `arn:aws:kms:${config.region}:${config.accountId}:key/${keyId}`
            )
          }
        ]
      }
    ],

    // CloudWatch Logs integration for real-time analysis
    CloudWatchLogsLogGroupArn: `arn:aws:logs:${config.region}:${config.accountId}:log-group:${config.environment}-KMS-CloudTrail:*`,
    CloudWatchLogsRoleArn: `arn:aws:iam::${config.accountId}:role/${config.environment}-CloudTrail-Logs-Role`
  };
}

/**
 * Example monitoring configuration
 */
export const EXAMPLE_MONITORING_CONFIG: KMSMonitoringConfig = {
  environment: 'production',
  region: 'us-west-2',
  accountId: '123456789012',
  keyIds: {
    paymentKey: 'arn:aws:kms:us-west-2:123456789012:key/payment-key-id',
    piiKey: 'arn:aws:kms:us-west-2:123456789012:key/pii-key-id',
    databaseKey: 'arn:aws:kms:us-west-2:123456789012:key/database-key-id',
    apiKey: 'arn:aws:kms:us-west-2:123456789012:key/api-key-id'
  },
  alerting: {
    snsTopicArn: 'arn:aws:sns:us-west-2:123456789012:kms-security-alerts',
    emailAddresses: ['security@company.com', 'devops@company.com']
  }
};
