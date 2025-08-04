import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { ZeroDowntimeKeyRotation } from './zero-downtime-key-rotation';

interface RotationSchedule {
  service: string;
  frequency: number; // days
  lastRotation: number;
  nextRotation: number;
  autoRotate: boolean;
  retryCount: number;
  maxRetries: number;
}

interface MonitoringMetrics {
  rotationSuccess: number;
  rotationFailures: number;
  averageRotationTime: number;
  servicesRotated: string[];
}

/**
 * Automated Rotation Scheduler with comprehensive monitoring
 */
export class RotationScheduler {
  private schedules = new Map<string, RotationSchedule>();
  private keyRotation: ZeroDowntimeKeyRotation;
  private cloudWatchClient: CloudWatchClient;
  private snsClient: SNSClient;
  private metrics: MonitoringMetrics = {
    rotationSuccess: 0,
    rotationFailures: 0,
    averageRotationTime: 0,
    servicesRotated: []
  };

  constructor() {
    this.keyRotation = new ZeroDowntimeKeyRotation();
    this.cloudWatchClient = new CloudWatchClient({
      region: process.env.AWS_REGION || 'us-west-2'
    });
    this.snsClient = new SNSClient({
      region: process.env.AWS_REGION || 'us-west-2'
    });
    
    this.initializeSchedules();
    this.startScheduler();
  }

  /**
   * Initialize rotation schedules for all services
   */
  private initializeSchedules(): void {
    const services = [
      { name: 'stripe', frequency: 90, autoRotate: true, maxRetries: 3 },
      { name: 'twilio', frequency: 60, autoRotate: true, maxRetries: 3 },
      { name: 'duffel', frequency: 180, autoRotate: false, maxRetries: 2 },
      { name: 'amadeus', frequency: 365, autoRotate: false, maxRetries: 2 },
      { name: 'openai', frequency: 90, autoRotate: true, maxRetries: 3 }
    ];

    services.forEach(service => {
      const now = Date.now();
      this.schedules.set(service.name, {
        service: service.name,
        frequency: service.frequency,
        lastRotation: now,
        nextRotation: now + (service.frequency * 24 * 60 * 60 * 1000),
        autoRotate: service.autoRotate,
        retryCount: 0,
        maxRetries: service.maxRetries
      });
    });
  }

  /**
   * Start the rotation scheduler
   */
  private startScheduler(): void {
    // Check every hour for rotations
    setInterval(async () => {
      await this.checkAndRotateKeys();
    }, 3600000); // 1 hour

    // Send daily metrics
    setInterval(async () => {
      await this.sendDailyMetrics();
    }, 86400000); // 24 hours
  }

  /**
   * Check and rotate keys if needed
   */
  private async checkAndRotateKeys(): Promise<void> {
    const now = Date.now();
    
    for (const [service, schedule] of this.schedules) {
      if (schedule.autoRotate && now >= schedule.nextRotation) {
        await this.rotateServiceWithRetry(service);
      }

      // Check for overdue rotations (alert if > 7 days overdue)
      const overdueDays = (now - schedule.nextRotation) / (24 * 60 * 60 * 1000);
      if (overdueDays > 7) {
        await this.alertOverdueRotation(service, overdueDays);
      }
    }
  }

  /**
   * Rotate service with retry logic
   */
  private async rotateServiceWithRetry(service: string): Promise<void> {
    const schedule = this.schedules.get(service);
    if (!schedule) return;

    const startTime = Date.now();

    try {
      await this.keyRotation.rotateApiKey(service);
      
      // Reset retry count on success
      schedule.retryCount = 0;
      this.updateSchedule(service, Date.now());
      
      // Record success metrics
      this.metrics.rotationSuccess++;
      this.metrics.servicesRotated.push(service);
      
      const duration = Date.now() - startTime;
      await this.recordRotationMetrics(service, 'success', duration);
      
      console.log(`Successfully rotated API key for ${service}`);

    } catch (error) {
      schedule.retryCount++;
      this.metrics.rotationFailures++;
      
      await this.recordRotationMetrics(service, 'failure', Date.now() - startTime);
      
      if (schedule.retryCount >= schedule.maxRetries) {
        // Alert operations team about failed rotation
        await this.alertRotationFailure(service, error as Error, schedule.retryCount);
        
        // Schedule next attempt in 1 day instead of normal frequency
        schedule.nextRotation = Date.now() + (24 * 60 * 60 * 1000);
        schedule.retryCount = 0;
      } else {
        // Retry in 2 hours
        schedule.nextRotation = Date.now() + (2 * 60 * 60 * 1000);
      }
      
      console.error(`Failed to rotate ${service} (attempt ${schedule.retryCount}):`, error);
    }
  }

  /**
   * Update rotation schedule after successful rotation
   */
  private updateSchedule(service: string, rotationTime: number): void {
    const schedule = this.schedules.get(service);
    if (!schedule) return;

    schedule.lastRotation = rotationTime;
    schedule.nextRotation = rotationTime + (schedule.frequency * 24 * 60 * 60 * 1000);
    this.schedules.set(service, schedule);
  }

  /**
   * Record rotation metrics to CloudWatch
   */
  private async recordRotationMetrics(
    service: string, 
    status: 'success' | 'failure', 
    duration: number
  ): Promise<void> {
    const command = new PutMetricDataCommand({
      Namespace: 'Parker-Flight/API-Key-Rotation',
      MetricData: [
        {
          MetricName: 'RotationDuration',
          Value: duration,
          Unit: 'Milliseconds',
          Dimensions: [
            { Name: 'Service', Value: service },
            { Name: 'Status', Value: status },
            { Name: 'Environment', Value: process.env.NODE_ENV || 'development' }
          ]
        },
        {
          MetricName: 'RotationCount',
          Value: 1,
          Unit: 'Count',
          Dimensions: [
            { Name: 'Service', Value: service },
            { Name: 'Status', Value: status }
          ]
        }
      ]
    });

    await this.cloudWatchClient.send(command);
  }

  /**
   * Alert operations team about rotation failure
   */
  private async alertRotationFailure(
    service: string, 
    error: Error, 
    retryCount: number
  ): Promise<void> {
    const message = {
      alert: 'API Key Rotation Failure',
      service,
      error: error.message,
      retryCount,
      timestamp: new Date().toISOString(),
      severity: 'HIGH',
      action: 'Manual intervention required for API key rotation'
    };

    await this.publishAlert('rotation-failure', message);
  }

  /**
   * Alert about overdue rotations
   */
  private async alertOverdueRotation(service: string, overdueDays: number): Promise<void> {
    const message = {
      alert: 'Overdue API Key Rotation',
      service,
      overdueDays: Math.floor(overdueDays),
      timestamp: new Date().toISOString(),
      severity: 'MEDIUM',
      action: 'Schedule manual rotation or enable auto-rotation'
    };

    await this.publishAlert('overdue-rotation', message);
  }

  /**
   * Publish alert to SNS
   */
  private async publishAlert(type: string, message: any): Promise<void> {
    if (!process.env.SECURITY_ALERTS_TOPIC_ARN) {
      console.warn('No SNS topic configured for security alerts');
      return;
    }

    const command = new PublishCommand({
      TopicArn: process.env.SECURITY_ALERTS_TOPIC_ARN,
      Subject: `[Parker Flight] ${message.alert}`,
      Message: JSON.stringify(message, null, 2),
      MessageAttributes: {
        AlertType: {
          DataType: 'String',
          StringValue: type
        },
        Severity: {
          DataType: 'String',
          StringValue: message.severity
        }
      }
    });

    await this.snsClient.send(command);
  }

  /**
   * Send daily metrics summary
   */
  private async sendDailyMetrics(): Promise<void> {
    const summary = {
      date: new Date().toISOString().split('T')[0],
      rotationSuccess: this.metrics.rotationSuccess,
      rotationFailures: this.metrics.rotationFailures,
      servicesRotated: this.metrics.servicesRotated,
      upcomingRotations: this.getUpcomingRotations(7), // Next 7 days
      overdueRotations: this.getOverdueRotations()
    };

    console.log('Daily Rotation Metrics:', summary);

    // Send to monitoring dashboard
    await this.recordDailyMetrics(summary);

    // Reset daily counters
    this.resetDailyMetrics();
  }

  /**
   * Get upcoming rotations within specified days
   */
  private getUpcomingRotations(days: number): string[] {
    const cutoff = Date.now() + (days * 24 * 60 * 60 * 1000);
    const upcoming: string[] = [];

    for (const [service, schedule] of this.schedules) {
      if (schedule.nextRotation <= cutoff) {
        upcoming.push(service);
      }
    }

    return upcoming;
  }

  /**
   * Get overdue rotations
   */
  private getOverdueRotations(): string[] {
    const now = Date.now();
    const overdue: string[] = [];

    for (const [service, schedule] of this.schedules) {
      if (now > schedule.nextRotation) {
        overdue.push(service);
      }
    }

    return overdue;
  }

  /**
   * Record daily metrics to CloudWatch
   */
  private async recordDailyMetrics(summary: any): Promise<void> {
    const command = new PutMetricDataCommand({
      Namespace: 'Parker-Flight/API-Key-Rotation/Daily',
      MetricData: [
        {
          MetricName: 'SuccessfulRotations',
          Value: summary.rotationSuccess,
          Unit: 'Count'
        },
        {
          MetricName: 'FailedRotations',
          Value: summary.rotationFailures,
          Unit: 'Count'
        },
        {
          MetricName: 'OverdueRotations',
          Value: summary.overdueRotations.length,
          Unit: 'Count'
        }
      ]
    });

    await this.cloudWatchClient.send(command);
  }

  /**
   * Reset daily metrics
   */
  private resetDailyMetrics(): void {
    this.metrics = {
      rotationSuccess: 0,
      rotationFailures: 0,
      averageRotationTime: 0,
      servicesRotated: []
    };
  }

  /**
   * Manual rotation trigger for emergency situations
   */
  async triggerEmergencyRotation(service: string): Promise<void> {
    console.log(`Emergency rotation triggered for ${service}`);
    
    try {
      await this.keyRotation.rotateApiKey(service);
      this.updateSchedule(service, Date.now());
      
      // Alert about emergency rotation
      await this.publishAlert('emergency-rotation', {
        alert: 'Emergency API Key Rotation Completed',
        service,
        timestamp: new Date().toISOString(),
        severity: 'HIGH'
      });
      
    } catch (error) {
      await this.alertRotationFailure(service, error as Error, 1);
      throw error;
    }
  }

  /**
   * Get rotation status for all services
   */
  getRotationStatus(): Map<string, RotationSchedule> {
    return new Map(this.schedules);
  }
}
