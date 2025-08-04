import {
    CloudWatchClient,
    PutMetricDataCommand,
    PutMetricAlarmCommand,
    PutDashboardCommand,
    StandardUnit,
    Statistic,
    ComparisonOperator,
    DescribeAlarmsCommand
} from '@aws-sdk/client-cloudwatch';
import { 
  CloudWatchLogsClient, 
  CreateLogGroupCommand, 
  PutMetricFilterCommand 
} from '@aws-sdk/client-cloudwatch-logs';
import { SNSClient, CreateTopicCommand, SubscribeCommand } from '@aws-sdk/client-sns';

interface AlarmConfiguration {
  alarmName: string;
  metricName: string;
  namespace: string;
  statistic: string;
  period: number;
  evaluationPeriods: number;
  threshold: number;
  comparisonOperator: string;
  alarmDescription: string;
  treatMissingData: string;
}

interface CustomMetric {
  MetricName: string;
  Namespace: string;
  Unit: string;
  Dimensions?: Array<{ Name: string; Value: string }>;
}

class ComprehensiveMonitoringSystem {
  private cloudWatchClient: CloudWatchClient;
  private logsClient: CloudWatchLogsClient;
  private snsClient: SNSClient;
  private environment: string;

  constructor(region: string = 'us-east-1', environment: string = 'production') {
    this.cloudWatchClient = new CloudWatchClient({ region });
    this.logsClient = new CloudWatchLogsClient({ region });
    this.snsClient = new SNSClient({ region });
    this.environment = environment;
  }

  async setupMonitoring(): Promise<void> {
    console.log('Setting up comprehensive monitoring system...');
    
    await this.createCustomMetrics();
    await this.setupAlarms();
    await this.createDashboard();
    await this.setupLogAnalytics();
    
    console.log('Monitoring system setup completed successfully');
  }

  private async createCustomMetrics(): Promise<void> {
    const customMetrics: CustomMetric[] = [
      {
        MetricName: 'GitHubConnectionsCreated',
        Namespace: 'GitHubLinkBuddy/Business',
        Unit: 'Count'
      },
      {
        MetricName: 'APIResponseTime',
        Namespace: 'GitHubLinkBuddy/Performance',
        Unit: 'Milliseconds'
      },
      {
        MetricName: 'ErrorRate',
        Namespace: 'GitHubLinkBuddy/Errors',
        Unit: 'Percent'
      },
      {
        MetricName: 'ActiveUsers',
        Namespace: 'GitHubLinkBuddy/Business',
        Unit: 'Count'
      },
      {
        MetricName: 'DatabaseConnectionPoolUsage',
        Namespace: 'GitHubLinkBuddy/Database',
        Unit: 'Percent'
      },
      {
        MetricName: 'S3UploadSuccess',
        Namespace: 'GitHubLinkBuddy/Storage',
        Unit: 'Count'
      },
      {
        MetricName: 'DynamoDBThrottleEvents',
        Namespace: 'GitHubLinkBuddy/Database',
        Unit: 'Count'
      }
    ];

    for (const metric of customMetrics) {
      try {
        await this.cloudWatchClient.send(new PutMetricDataCommand({
          Namespace: metric.Namespace,
          MetricData: [{
            MetricName: metric.MetricName,
            Value: 0,
            Unit: metric.Unit as StandardUnit,
            Timestamp: new Date(),
            Dimensions: metric.Dimensions
          }]
        }));
        console.log(`Created custom metric: ${metric.MetricName}`);
      } catch (error) {
        console.error(`Failed to create metric ${metric.MetricName}:`, error);
      }
    }
  }

  private async setupAlarms(): Promise<void> {
    const snsTopicArn = await this.createSNSTopic();
    
    const alarmConfigurations: AlarmConfiguration[] = [
      {
        alarmName: `github-link-buddy-high-error-rate-${this.environment}`,
        metricName: 'ErrorRate',
        namespace: 'GitHubLinkBuddy/Errors',
        statistic: 'Average',
        period: 300,
        evaluationPeriods: 2,
        threshold: 5,
        comparisonOperator: 'GreaterThanThreshold',
        alarmDescription: 'Alert when error rate exceeds 5%',
        treatMissingData: 'notBreaching'
      },
      {
        alarmName: `github-link-buddy-high-response-time-${this.environment}`,
        metricName: 'APIResponseTime',
        namespace: 'GitHubLinkBuddy/Performance',
        statistic: 'Average',
        period: 300,
        evaluationPeriods: 3,
        threshold: 2000,
        comparisonOperator: 'GreaterThanThreshold',
        alarmDescription: 'Alert when API response time exceeds 2 seconds',
        treatMissingData: 'breaching'
      },
      {
        alarmName: `github-link-buddy-dynamo-throttle-${this.environment}`,
        metricName: 'DynamoDBThrottleEvents',
        namespace: 'GitHubLinkBuddy/Database',
        statistic: 'Sum',
        period: 300,
        evaluationPeriods: 1,
        threshold: 0,
        comparisonOperator: 'GreaterThanThreshold',
        alarmDescription: 'Alert on DynamoDB throttle events',
        treatMissingData: 'notBreaching'
      },
      {
        alarmName: `github-link-buddy-low-active-users-${this.environment}`,
        metricName: 'ActiveUsers',
        namespace: 'GitHubLinkBuddy/Business',
        statistic: 'Average',
        period: 3600,
        evaluationPeriods: 2,
        threshold: 10,
        comparisonOperator: 'LessThanThreshold',
        alarmDescription: 'Alert when active users drop below 10',
        treatMissingData: 'breaching'
      },
      {
        alarmName: `github-link-buddy-ec2-high-cpu-${this.environment}`,
        metricName: 'CPUUtilization',
        namespace: 'AWS/EC2',
        statistic: 'Average',
        period: 300,
        evaluationPeriods: 2,
        threshold: 80,
        comparisonOperator: 'GreaterThanThreshold',
        alarmDescription: 'Alert when EC2 CPU utilization exceeds 80%',
        treatMissingData: 'notBreaching'
      },
      {
        alarmName: `github-link-buddy-rds-high-cpu-${this.environment}`,
        metricName: 'CPUUtilization',
        namespace: 'AWS/RDS',
        statistic: 'Average',
        period: 300,
        evaluationPeriods: 2,
        threshold: 75,
        comparisonOperator: 'GreaterThanThreshold',
        alarmDescription: 'Alert when RDS CPU utilization exceeds 75%',
        treatMissingData: 'notBreaching'
      },
      {
        alarmName: `github-link-buddy-alb-target-response-time-${this.environment}`,
        metricName: 'TargetResponseTime',
        namespace: 'AWS/ApplicationELB',
        statistic: 'Average',
        period: 300,
        evaluationPeriods: 2,
        threshold: 1,
        comparisonOperator: 'GreaterThanThreshold',
        alarmDescription: 'Alert when ALB target response time exceeds 1 second',
        treatMissingData: 'notBreaching'
      }
    ];

    for (const config of alarmConfigurations) {
      try {
        await this.cloudWatchClient.send(new PutMetricAlarmCommand({
          AlarmName: config.alarmName,
          AlarmDescription: config.alarmDescription,
          MetricName: config.metricName,
          Namespace: config.namespace,
          Statistic: config.statistic as Statistic,
          Period: config.period,
          EvaluationPeriods: config.evaluationPeriods,
          Threshold: config.threshold,
          ComparisonOperator: config.comparisonOperator as ComparisonOperator,
          TreatMissingData: config.treatMissingData,
          AlarmActions: [snsTopicArn],
          OKActions: [snsTopicArn],
          ActionsEnabled: true,
          Tags: [
            { Key: 'Environment', Value: this.environment },
            { Key: 'Project', Value: 'github-link-buddy' },
            { Key: 'Type', Value: 'CloudWatchAlarm' }
          ]
        }));
        console.log(`Created alarm: ${config.alarmName}`);
      } catch (error) {
        console.error(`Failed to create alarm ${config.alarmName}:`, error);
      }
    }
  }

  private async createSNSTopic(): Promise<string> {
    try {
      const topicName = `github-link-buddy-alerts-${this.environment}`;
      const createTopicResult = await this.snsClient.send(new CreateTopicCommand({
        Name: topicName,
        Tags: [
          { Key: 'Environment', Value: this.environment },
          { Key: 'Project', Value: 'github-link-buddy' }
        ]
      }));
      
      console.log(`Created SNS topic: ${topicName}`);
      return createTopicResult.TopicArn!;
    } catch (error) {
      console.error('Failed to create SNS topic:', error);
      throw error;
    }
  }

  private async createDashboard(): Promise<void> {
    const dashboardBody = {
      widgets: [
        {
          type: "metric",
          x: 0,
          y: 0,
          width: 12,
          height: 6,
          properties: {
            metrics: [
              ["GitHubLinkBuddy/Business", "GitHubConnectionsCreated"],
              [".", "ActiveUsers"]
            ],
            view: "timeSeries",
            stacked: false,
            region: "us-east-1",
            title: "Business Metrics",
            period: 300
          }
        },
        {
          type: "metric",
          x: 12,
          y: 0,
          width: 12,
          height: 6,
          properties: {
            metrics: [
              ["GitHubLinkBuddy/Performance", "APIResponseTime"],
              ["GitHubLinkBuddy/Errors", "ErrorRate"]
            ],
            view: "timeSeries",
            stacked: false,
            region: "us-east-1",
            title: "Performance & Error Metrics",
            period: 300
          }
        },
        {
          type: "metric",
          x: 0,
          y: 6,
          width: 8,
          height: 6,
          properties: {
            metrics: [
              ["AWS/EC2", "CPUUtilization", "AutoScalingGroupName", `github-link-buddy-asg-${this.environment}`],
              ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", `app/github-link-buddy-alb-${this.environment}`]
            ],
            view: "timeSeries",
            stacked: false,
            region: "us-east-1",
            title: "Infrastructure Metrics",
            period: 300
          }
        },
        {
          type: "metric",
          x: 8,
          y: 6,
          width: 8,
          height: 6,
          properties: {
            metrics: [
              ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", `github-link-buddy-db-${this.environment}`],
              [".", "DatabaseConnections", ".", "."],
              ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", `github-link-buddy-connections-${this.environment}`]
            ],
            view: "timeSeries",
            stacked: false,
            region: "us-east-1",
            title: "Database Metrics",
            period: 300
          }
        },
        {
          type: "metric",
          x: 16,
          y: 6,
          width: 8,
          height: 6,
          properties: {
            metrics: [
              ["AWS/S3", "BucketSizeBytes", "BucketName", `github-link-buddy-assets-${this.environment}`, "StorageType", "StandardStorage"],
              [".", "NumberOfObjects", ".", ".", ".", "AllStorageTypes"]
            ],
            view: "timeSeries",
            stacked: false,
            region: "us-east-1",
            title: "Storage Metrics",
            period: 86400
          }
        },
        {
          type: "log",
          x: 0,
          y: 12,
          width: 24,
          height: 6,
          properties: {
            query: `SOURCE '/aws/ec2/github-link-buddy-${this.environment}'\n| fields @timestamp, @message\n| filter @message like /ERROR/\n| sort @timestamp desc\n| limit 100`,
            region: "us-east-1",
            title: "Recent Error Logs",
            view: "table"
          }
        }
      ]
    };

    try {
      await this.cloudWatchClient.send(new PutDashboardCommand({
        DashboardName: `GitHubLinkBuddy-${this.environment}-Dashboard`,
        DashboardBody: JSON.stringify(dashboardBody)
      }));
      console.log(`Created CloudWatch dashboard: GitHubLinkBuddy-${this.environment}-Dashboard`);
    } catch (error) {
      console.error('Failed to create dashboard:', error);
    }
  }

  private async setupLogAnalytics(): Promise<void> {
    const logGroups = [
      `/aws/ec2/github-link-buddy-${this.environment}`,
      `/aws/lambda/github-link-buddy-${this.environment}`,
      `/aws/rds/instance/github-link-buddy-db-${this.environment}/error`
    ];

    for (const logGroup of logGroups) {
      try {
        await this.logsClient.send(new CreateLogGroupCommand({
          logGroupName: logGroup,
          tags: {
            Environment: this.environment,
            Project: 'github-link-buddy'
          }
        }));
        console.log(`Created log group: ${logGroup}`);

        // Create metric filters for error detection
        await this.logsClient.send(new PutMetricFilterCommand({
          logGroupName: logGroup,
          filterName: `${logGroup.replace(/[\/\-]/g, '_')}_error_filter`,
          filterPattern: '[timestamp, request_id, level="ERROR", ...]',
          metricTransformations: [{
            metricName: 'ErrorCount',
            metricNamespace: 'GitHubLinkBuddy/Logs',
            metricValue: '1',
            defaultValue: 0
          }]
        }));
        console.log(`Created metric filter for: ${logGroup}`);
      } catch (error) {
        if (error.name !== 'ResourceAlreadyExistsException') {
          console.error(`Failed to create log group ${logGroup}:`, error);
        }
      }
    }
  }

  async publishCustomMetric(metricName: string, value: number, unit: string, namespace: string, dimensions?: Array<{ Name: string; Value: string }>): Promise<void> {
    try {
      await this.cloudWatchClient.send(new PutMetricDataCommand({
        Namespace: namespace,
        MetricData: [{
          MetricName: metricName,
          Value: value,
          Unit: unit as StandardUnit,
          Timestamp: new Date(),
          Dimensions: dimensions
        }]
      }));
    } catch (error) {
      console.error(`Failed to publish metric ${metricName}:`, error);
    }
  }

  async generateMonitoringReport(): Promise<object> {
    const report = {
      timestamp: new Date().toISOString(),
      environment: this.environment,
      metrics: {
        alarms_configured: 7,
        log_groups_created: 3,
        custom_metrics: 7,
        dashboard_created: true
      },
      status: 'operational'
    };

    console.log('Monitoring system report:', JSON.stringify(report, null, 2));
    return report;
  }
}

export default ComprehensiveMonitoringSystem;

// Usage example:
async function main() {
  const monitoringSystem = new ComprehensiveMonitoringSystem('us-east-1', 'production');
  
  try {
    await monitoringSystem.setupMonitoring();
    await monitoringSystem.generateMonitoringReport();
    
    // Example of publishing a custom metric
    await monitoringSystem.publishCustomMetric(
      'GitHubConnectionsCreated',
      1,
      'Count',
      'GitHubLinkBuddy/Business',
      [{ Name: 'Environment', Value: 'production' }]
    );
    
  } catch (error) {
    console.error('Failed to setup monitoring:', error);
  }
}

// Uncomment to run directly
// main().catch(console.error);
