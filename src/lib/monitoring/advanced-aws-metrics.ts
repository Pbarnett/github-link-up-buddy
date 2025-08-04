import { CloudWatchClient, PutMetricDataCommand, PutAnomalyDetectorCommand } from '@aws-sdk/client-cloudwatch';
import { KMSClient, DescribeKeyCommand } from '@aws-sdk/client-kms';
import { SecretsManagerClient, DescribeSecretCommand } from '@aws-sdk/client-secrets-manager';

interface AdvancedMetrics {
  keyUtilizationRate: number;
  dataKeyGenerationRate: number;
  crossRegionKeyUsage: number;
  keyPolicyViolations: number;
  encryptionContextVariety: number;
  secretAgeDistribution: number;
  rotationSuccessRate: number;
  accessFrequencyAnomaly: number;
  secretVersionUsage: number;
  crossServiceSecretAccess: number;
}

/**
 * Advanced AWS Services Monitoring
 * Phase 1: Enhanced metrics collection for KMS and Secrets Manager
 */
export class AdvancedAWSMetrics {
  private cloudWatch: CloudWatchClient;
  private kmsClient: KMSClient;
  private secretsClient: SecretsManagerClient;
  private region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-west-2';
    this.cloudWatch = new CloudWatchClient({ region: this.region });
    this.kmsClient = new KMSClient({ region: this.region });
    this.secretsClient = new SecretsManagerClient({ region: this.region });
  }

  /**
   * Publish comprehensive KMS metrics
   */
  async publishAdvancedKMSMetrics(): Promise<void> {
    const startTime = Date.now();
    
    try {
      const metrics = await this.collectKMSMetrics();
      
      const metricData = [
        {
          MetricName: 'KeyUtilizationRate',
          Value: metrics.keyUtilizationRate,
          Unit: 'Percent',
          Dimensions: [
            { Name: 'Region', Value: this.region },
            { Name: 'Environment', Value: process.env.NODE_ENV || 'development' }
          ]
        },
        {
          MetricName: 'DataKeyGenerationRate',
          Value: metrics.dataKeyGenerationRate,
          Unit: 'Count/Second',
          Dimensions: [
            { Name: 'Region', Value: this.region }
          ]
        },
        {
          MetricName: 'CrossRegionKeyUsage',
          Value: metrics.crossRegionKeyUsage,
          Unit: 'Count',
          Dimensions: [
            { Name: 'SourceRegion', Value: this.region },
            { Name: 'AlertLevel', Value: (metrics.crossRegionKeyUsage || 0) > 10 ? 'HIGH' : 'NORMAL' }
          ]
        },
        {
          MetricName: 'KeyPolicyViolations',
          Value: metrics.keyPolicyViolations,
          Unit: 'Count',
          Dimensions: [
            { Name: 'Severity', Value: 'HIGH' }
          ]
        },
        {
          MetricName: 'EncryptionContextVariety',
          Value: metrics.encryptionContextVariety,
          Unit: 'Count',
          Dimensions: [
            { Name: 'KeyType', Value: 'CustomerManaged' }
          ]
        }
      ];

      await this.publishMetrics('Parker-Flight/KMS/Advanced', metricData);
      
      // Record collection performance
      const collectionTime = Date.now() - startTime;
      await this.recordMetricCollectionPerformance('KMS', collectionTime);
      
      console.log('Advanced KMS metrics published successfully');
      
    } catch (error) {
      console.error('Failed to publish advanced KMS metrics:', error);
      await this.recordMetricCollectionError('KMS', error as Error);
    }
  }

  /**
   * Publish comprehensive Secrets Manager metrics
   */
  async publishAdvancedSecretsMetrics(): Promise<void> {
    const startTime = Date.now();
    
    try {
      const metrics = await this.collectSecretsManagerMetrics();
      
      const metricData = [
        {
          MetricName: 'SecretAgeDistribution',
          Value: metrics.secretAgeDistribution,
          Unit: 'Days',
          Dimensions: [
            { Name: 'AgeCategory', Value: this.categorizeSecretAge(metrics.secretAgeDistribution || 0) }
          ]
        },
        {
          MetricName: 'RotationSuccessRate',
          Value: metrics.rotationSuccessRate,
          Unit: 'Percent',
          Dimensions: [
            { Name: 'Period', Value: 'Last30Days' }
          ]
        },
        {
          MetricName: 'AccessFrequencyAnomaly',
          Value: metrics.accessFrequencyAnomaly,
          Unit: 'Count',
          Dimensions: [
            { Name: 'AnomalyType', Value: 'UnusualAccess' }
          ]
        },
        {
          MetricName: 'SecretVersionUsage',
          Value: metrics.secretVersionUsage,
          Unit: 'Count',
          Dimensions: [
            { Name: 'VersionType', Value: 'Active' }
          ]
        },
        {
          MetricName: 'CrossServiceSecretAccess',
          Value: metrics.crossServiceSecretAccess,
          Unit: 'Count',
          Dimensions: [
            { Name: 'AccessPattern', Value: 'CrossService' }
          ]
        }
      ];

      await this.publishMetrics('Parker-Flight/SecretsManager/Advanced', metricData);
      
      const collectionTime = Date.now() - startTime;
      await this.recordMetricCollectionPerformance('SecretsManager', collectionTime);
      
      console.log('Advanced Secrets Manager metrics published successfully');
      
    } catch (error) {
      console.error('Failed to publish advanced Secrets Manager metrics:', error);
      await this.recordMetricCollectionError('SecretsManager', error as Error);
    }
  }

  /**
   * Setup anomaly detection for key metrics
   */
  async setupAnomalyDetection(): Promise<void> {
    const anomalyDetectors = [
      {
        MetricName: 'KeyUtilizationRate',
        Namespace: 'Parker-Flight/KMS/Advanced',
        Stat: 'Average',
        Dimensions: [{ Name: 'Region', Value: this.region }]
      },
      {
        MetricName: 'RotationSuccessRate',
        Namespace: 'Parker-Flight/SecretsManager/Advanced',
        Stat: 'Average',
        Dimensions: [{ Name: 'Period', Value: 'Last30Days' }]
      },
      {
        MetricName: 'AccessFrequencyAnomaly',
        Namespace: 'Parker-Flight/SecretsManager/Advanced',
        Stat: 'Sum',
        Dimensions: [{ Name: 'AnomalyType', Value: 'UnusualAccess' }]
      }
    ];

    for (const detector of anomalyDetectors) {
      try {
        const command = new PutAnomalyDetectorCommand({
          Namespace: detector.Namespace,
          MetricName: detector.MetricName,
          Stat: detector.Stat,
          Dimensions: detector.Dimensions
        });

        await this.cloudWatch.send(command);
        console.log(`Anomaly detector created for ${detector.MetricName}`);
        
      } catch (error) {
        console.error(`Failed to create anomaly detector for ${detector.MetricName}:`, error);
      }
    }
  }

  /**
   * Collect KMS-specific metrics
   */
  private async collectKMSMetrics(): Promise<Partial<AdvancedMetrics>> {
    // Simulate real metric collection - replace with actual CloudWatch queries
    const now = Date.now();
    const hourAgo = now - (60 * 60 * 1000);
    
    return {
      keyUtilizationRate: await this.calculateKeyUtilization(),
      dataKeyGenerationRate: await this.getDataKeyGenerationRate(),
      crossRegionKeyUsage: await this.getCrossRegionKeyUsage(),
      keyPolicyViolations: await this.getKeyPolicyViolations(),
      encryptionContextVariety: await this.getEncryptionContextMetrics()
    };
  }

  /**
   * Collect Secrets Manager-specific metrics
   */
  private async collectSecretsManagerMetrics(): Promise<Partial<AdvancedMetrics>> {
    return {
      secretAgeDistribution: await this.getSecretAgeMetrics(),
      rotationSuccessRate: await this.getRotationSuccessRate(),
      accessFrequencyAnomaly: await this.detectAccessAnomalies(),
      secretVersionUsage: await this.getVersionUsageMetrics(),
      crossServiceSecretAccess: await this.getCrossServiceAccess()
    };
  }

  /**
   * Calculate key utilization patterns
   */
  private async calculateKeyUtilization(): Promise<number> {
    // Mock calculation - replace with actual CloudWatch metrics query
    // Query: KMS API calls per key over time period
    const totalKeys = 5; // Number of active keys
    const activeKeys = 4; // Keys used in last hour
    return (activeKeys / totalKeys) * 100;
  }

  /**
   * Get data key generation rate
   */
  private async getDataKeyGenerationRate(): Promise<number> {
    // Mock calculation - replace with actual metrics
    // Query: GenerateDataKey API calls per second
    return 2.5; // Keys per second
  }

  /**
   * Detect cross-region key usage
   */
  private async getCrossRegionKeyUsage(): Promise<number> {
    // Mock calculation - detect unusual cross-region patterns
    return 3; // Number of cross-region calls
  }

  /**
   * Get key policy violations
   */
  private async getKeyPolicyViolations(): Promise<number> {
    // Mock calculation - detect policy violations from CloudTrail
    return 0; // Number of violations
  }

  /**
   * Get encryption context variety
   */
  private async getEncryptionContextMetrics(): Promise<number> {
    // Mock calculation - analyze encryption context patterns
    return 8; // Number of different contexts used
  }

  /**
   * Get secret age distribution
   */
  private async getSecretAgeMetrics(): Promise<number> {
    // Mock calculation - average age of secrets
    return 45; // Average age in days
  }

  /**
   * Get rotation success rate
   */
  private async getRotationSuccessRate(): Promise<number> {
    // Mock calculation - successful rotations / total rotations
    return 98.5; // Percentage
  }

  /**
   * Detect access anomalies
   */
  private async detectAccessAnomalies(): Promise<number> {
    // Mock calculation - unusual access patterns
    return 2; // Number of anomalies detected
  }

  /**
   * Get version usage metrics
   */
  private async getVersionUsageMetrics(): Promise<number> {
    // Mock calculation - active secret versions
    return 12; // Number of active versions
  }

  /**
   * Get cross-service access patterns
   */
  private async getCrossServiceAccess(): Promise<number> {
    // Mock calculation - secrets accessed by multiple services
    return 6; // Number of cross-service accesses
  }

  /**
   * Categorize secret age for dimensional analysis
   */
  private categorizeSecretAge(age: number): string {
    if (age <= 30) return 'Fresh';
    if (age <= 90) return 'Moderate';
    if (age <= 180) return 'Aging';
    return 'Stale';
  }

  /**
   * Publish metrics to CloudWatch
   */
  private async publishMetrics(namespace: string, metricData: any[]): Promise<void> {
    const command = new PutMetricDataCommand({
      Namespace: namespace,
      MetricData: metricData.map(metric => ({
        ...metric,
        Timestamp: new Date()
      }))
    });

    await this.cloudWatch.send(command);
  }

  /**
   * Record metric collection performance
   */
  private async recordMetricCollectionPerformance(service: string, duration: number): Promise<void> {
    const command = new PutMetricDataCommand({
      Namespace: 'Parker-Flight/Monitoring/Performance',
      MetricData: [{
        MetricName: 'MetricCollectionDuration',
        Value: duration,
        Unit: 'Milliseconds',
        Dimensions: [
          { Name: 'Service', Value: service },
          { Name: 'Region', Value: this.region }
        ]
      }]
    });

    await this.cloudWatch.send(command);
  }

  /**
   * Record metric collection errors
   */
  private async recordMetricCollectionError(service: string, error: Error): Promise<void> {
    const command = new PutMetricDataCommand({
      Namespace: 'Parker-Flight/Monitoring/Errors',
      MetricData: [{
        MetricName: 'MetricCollectionErrors',
        Value: 1,
        Unit: 'Count',
        Dimensions: [
          { Name: 'Service', Value: service },
          { Name: 'ErrorType', Value: error.constructor.name }
        ]
      }]
    });

    await this.cloudWatch.send(command);
  }

  /**
   * Start automated metric collection
   */
  public async startMetricCollection(): Promise<void> {
    // Setup anomaly detection first
    await this.setupAnomalyDetection();
    
    // Collect advanced metrics every 5 minutes
    setInterval(async () => {
      await Promise.all([
        this.publishAdvancedKMSMetrics(),
        this.publishAdvancedSecretsMetrics()
      ]);
    }, 5 * 60 * 1000);

    // Initial collection
    await Promise.all([
      this.publishAdvancedKMSMetrics(),
      this.publishAdvancedSecretsMetrics()
    ]);

    console.log('Advanced AWS metrics collection started');
  }

  /**
   * Get current metric collection status
   */
  async getMetricCollectionStatus(): Promise<any> {
    return {
      isCollecting: true,
      lastCollection: new Date().toISOString(),
      metricsCollected: {
        kms: ['KeyUtilizationRate', 'DataKeyGenerationRate', 'CrossRegionKeyUsage', 'KeyPolicyViolations', 'EncryptionContextVariety'],
        secretsManager: ['SecretAgeDistribution', 'RotationSuccessRate', 'AccessFrequencyAnomaly', 'SecretVersionUsage', 'CrossServiceSecretAccess']
      },
      region: this.region,
      anomalyDetectionEnabled: true
    };
  }
}
