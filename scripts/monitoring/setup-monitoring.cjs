#!/usr/bin/env node

/**
 * CloudWatch Monitoring Setup Script
 * 
 * Sets up comprehensive monitoring, dashboards, and alarms for the enhanced
 * AWS SDK integration with KMS encryption workflows.
 */

const { CloudWatchClient, PutMetricAlarmCommand, PutDashboardCommand } = require('@aws-sdk/client-cloudwatch');
const { SNSClient, CreateTopicCommand, SubscribeCommand } = require('@aws-sdk/client-sns');

class MonitoringSetup {
  constructor() {
    this.cloudWatch = new CloudWatchClient({ 
      region: process.env.AWS_REGION || 'us-east-1' 
    });
    this.sns = new SNSClient({ 
      region: process.env.AWS_REGION || 'us-east-1' 
    });
    this.namespace = 'ParkerFlight/KMS';
    this.environment = process.env.NODE_ENV || 'production';
  }

  /**
   * Create SNS topic for alerts
   */
  async createAlertTopic() {
    try {
      const topicName = `parker-flight-kms-alerts-${this.environment}`;
      
      console.log(`📢 Creating SNS topic: ${topicName}`);
      
      const createTopicCommand = new CreateTopicCommand({
        Name: topicName,
        Tags: [
          { Key: 'Application', Value: 'Parker Flight' },
          { Key: 'Service', Value: 'KMS Monitoring' },
          { Key: 'Environment', Value: this.environment },
        ],
      });
      
      const response = await this.sns.send(createTopicCommand);
      const topicArn = response.TopicArn;
      
      console.log(`✅ Created SNS topic: ${topicArn}`);
      
      // Subscribe email if provided
      if (process.env.ALERT_EMAIL) {
        console.log(`📧 Subscribing email: ${process.env.ALERT_EMAIL}`);
        
        const subscribeCommand = new SubscribeCommand({
          TopicArn: topicArn,
          Protocol: 'email',
          Endpoint: process.env.ALERT_EMAIL,
        });
        
        await this.sns.send(subscribeCommand);
        console.log(`✅ Email subscription created (confirmation required)`);
      }
      
      return topicArn;
      
    } catch (error) {
      console.error('❌ Failed to create SNS topic:', error.message);
      throw error;
    }
  }

  /**
   * Create CloudWatch alarms
   */
  async createAlarms(snsTopicArn) {
    console.log('⏰ Creating CloudWatch alarms...');
    
    const alarms = [
      {
        AlarmName: `ParkerFlight-KMS-HighErrorRate-${this.environment}`,
        AlarmDescription: 'KMS operations error rate is too high',
        MetricName: 'KMSErrorRate',
        Namespace: this.namespace,
        Statistic: 'Average',
        Period: 300, // 5 minutes
        EvaluationPeriods: 2,
        Threshold: 5.0, // 5% error rate
        ComparisonOperator: 'GreaterThanThreshold',
        Dimensions: [
          { Name: 'Environment', Value: this.environment },
        ],
      },
      {
        AlarmName: `ParkerFlight-KMS-HighLatency-${this.environment}`,
        AlarmDescription: 'KMS operations latency is too high',
        MetricName: 'KMSEncryptionDuration',
        Namespace: this.namespace,
        Statistic: 'Average',
        Period: 300,
        EvaluationPeriods: 3,
        Threshold: 5000, // 5 seconds
        ComparisonOperator: 'GreaterThanThreshold',
        Dimensions: [
          { Name: 'Environment', Value: this.environment },
        ],
      },
      {
        AlarmName: `ParkerFlight-KMS-FrequentFailovers-${this.environment}`,
        AlarmDescription: 'Too many regional failovers occurring',
        MetricName: 'KMSFailoverCount',
        Namespace: this.namespace,
        Statistic: 'Sum',
        Period: 600, // 10 minutes
        EvaluationPeriods: 1,
        Threshold: 5, // More than 5 failovers in 10 minutes
        ComparisonOperator: 'GreaterThanThreshold',
        Dimensions: [
          { Name: 'Environment', Value: this.environment },
        ],
      },
      {
        AlarmName: `ParkerFlight-KMS-LowSuccessRate-${this.environment}`,
        AlarmDescription: 'KMS operation success rate is too low',
        MetricName: 'KMSSuccessRate',
        Namespace: this.namespace,
        Statistic: 'Average',
        Period: 300,
        EvaluationPeriods: 3,
        Threshold: 95.0, // Less than 95% success rate
        ComparisonOperator: 'LessThanThreshold',
        Dimensions: [
          { Name: 'Environment', Value: this.environment },
        ],
      },
    ];

    for (const alarm of alarms) {
      try {
        const command = new PutMetricAlarmCommand({
          ...alarm,
          AlarmActions: [snsTopicArn],
          OKActions: [snsTopicArn],
          TreatMissingData: 'breaching',
        });
        
        await this.cloudWatch.send(command);
        console.log(`  ✅ Created alarm: ${alarm.AlarmName}`);
        
      } catch (error) {
        console.error(`  ❌ Failed to create alarm ${alarm.AlarmName}:`, error.message);
      }
    }
  }

  /**
   * Create CloudWatch dashboard
   */
  async createDashboard() {
    console.log('📊 Creating CloudWatch dashboard...');
    
    const dashboardBody = JSON.stringify({
      widgets: [
        {
          type: 'metric',
          x: 0,
          y: 0,
          width: 12,
          height: 6,
          properties: {
            metrics: [
              [this.namespace, 'KMSEncryptionCount', 'KeyType', 'GENERAL', { stat: 'Sum' }],
              ['.', '.', '.', 'PII', { stat: 'Sum' }],
              ['.', '.', '.', 'PAYMENT', { stat: 'Sum' }],
            ],
            view: 'timeSeries',
            stacked: false,
            region: process.env.AWS_REGION || 'us-east-1',
            title: 'KMS Encryption Operations by Key Type',
            period: 300,
          },
        },
        {
          type: 'metric',
          x: 12,
          y: 0,
          width: 12,
          height: 6,
          properties: {
            metrics: [
              [this.namespace, 'KMSEncryptionDuration', 'KeyType', 'GENERAL'],
              ['.', '.', '.', 'PII'],
              ['.', '.', '.', 'PAYMENT'],
            ],
            view: 'timeSeries',
            stacked: false,
            region: process.env.AWS_REGION || 'us-east-1',
            title: 'KMS Operation Duration by Key Type',
            period: 300,
            yAxis: {
              left: {
                min: 0,
              },
            },
          },
        },
        {
          type: 'metric',
          x: 0,
          y: 6,
          width: 8,
          height: 6,
          properties: {
            metrics: [
              [this.namespace, 'KMSErrorRate', 'Environment', this.environment],
            ],
            view: 'timeSeries',
            stacked: false,
            region: process.env.AWS_REGION || 'us-east-1',
            title: 'KMS Error Rate (%)',
            period: 300,
            yAxis: {
              left: {
                min: 0,
                max: 100,
              },
            },
          },
        },
        {
          type: 'metric',
          x: 8,
          y: 6,
          width: 8,
          height: 6,
          properties: {
            metrics: [
              [this.namespace, 'KMSFailoverCount', 'Service', 'kms', { stat: 'Sum' }],
            ],
            view: 'timeSeries',
            stacked: false,
            region: process.env.AWS_REGION || 'us-east-1',
            title: 'Regional Failover Events',
            period: 300,
          },
        },
        {
          type: 'metric',
          x: 16,
          y: 6,
          width: 8,
          height: 6,
          properties: {
            metrics: [
              [this.namespace, 'KMSSuccessRate', 'Environment', this.environment],
            ],
            view: 'timeSeries',
            stacked: false,
            region: process.env.AWS_REGION || 'us-east-1',
            title: 'KMS Success Rate (%)',
            period: 300,
            yAxis: {
              left: {
                min: 0,
                max: 100,
              },
            },
          },
        },
        {
          type: 'log',
          x: 0,
          y: 12,
          width: 24,
          height: 6,
          properties: {
            query: `SOURCE '/aws/lambda/parker-flight-api' | fields @timestamp, @message
| filter @message like /KMS/
| sort @timestamp desc
| limit 100`,
            region: process.env.AWS_REGION || 'us-east-1',
            title: 'Recent KMS Operation Logs',
            view: 'table',
          },
        },
      ],
    });

    try {
      const command = new PutDashboardCommand({
        DashboardName: `ParkerFlight-KMS-${this.environment}`,
        DashboardBody: dashboardBody,
      });
      
      await this.cloudWatch.send(command);
      console.log(`✅ Created dashboard: ParkerFlight-KMS-${this.environment}`);
      
      const dashboardUrl = `https://${process.env.AWS_REGION || 'us-east-1'}.console.aws.amazon.com/cloudwatch/home?region=${process.env.AWS_REGION || 'us-east-1'}#dashboards:name=ParkerFlight-KMS-${this.environment}`;
      console.log(`🔗 Dashboard URL: ${dashboardUrl}`);
      
    } catch (error) {
      console.error('❌ Failed to create dashboard:', error.message);
    }
  }

  /**
   * Setup all monitoring components
   */
  async setupAll() {
    console.log(`
🚀 Setting up CloudWatch monitoring for Parker Flight KMS
Environment: ${this.environment}
Region: ${process.env.AWS_REGION || 'us-east-1'}
Namespace: ${this.namespace}
`);

    try {
      // Create SNS topic for alerts
      const snsTopicArn = await this.createAlertTopic();
      
      // Create CloudWatch alarms
      await this.createAlarms(snsTopicArn);
      
      // Create CloudWatch dashboard
      await this.createDashboard();
      
      console.log(`
✅ Monitoring setup complete!

Next steps:
1. If you provided an ALERT_EMAIL, check your inbox for SNS subscription confirmation
2. View your dashboard in the AWS Console
3. Test the alarms by triggering some KMS operations
4. Adjust alarm thresholds based on your baseline metrics

Environment Variables Used:
- AWS_REGION: ${process.env.AWS_REGION || 'us-east-1 (default)'}
- NODE_ENV: ${this.environment}
- ALERT_EMAIL: ${process.env.ALERT_EMAIL || 'not provided'}

For more detailed monitoring, consider:
- Setting up X-Ray tracing
- Creating custom metrics in your application
- Adding log-based metrics for specific error patterns
`);

    } catch (error) {
      console.error('❌ Monitoring setup failed:', error.message);
      console.error('Stack trace:', error.stack);
      process.exit(1);
    }
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  const setup = new MonitoringSetup();
  setup.setupAll().catch(error => {
    console.error('Critical setup failure:', error);
    process.exit(1);
  });
}

module.exports = MonitoringSetup;
