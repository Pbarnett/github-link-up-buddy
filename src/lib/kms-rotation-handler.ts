/**
 * KMS Key Rotation Handler
 * Handles automated KMS key rotation events and alias updates
 */

import {
  KMSClient,
  UpdateAliasCommand,
  DescribeKeyCommand,
  ListAliasesCommand,
} from '@aws-sdk/client-kms';
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';

export interface KeyRotationEvent {
  source: string;
  'detail-type': string;
  detail: {
    keyId: string;
    eventName: string;
    rotationStatus: string;
  };
}

export class KMSRotationHandler {
  private kmsClient: KMSClient;
  private cloudWatchClient: CloudWatchClient;
  private keyAlias: string;

  constructor(keyAlias: string, region: string = 'us-east-1') {
    this.kmsClient = new KMSClient({ region });
    this.cloudWatchClient = new CloudWatchClient({ region });
    this.keyAlias = keyAlias;
  }

  /**
   * Main handler for KMS key rotation events
   */
  async handleRotationEvent(event: KeyRotationEvent): Promise<void> {
    console.log('Processing KMS key rotation event:', JSON.stringify(event, null, 2));

    try {
      if (event.source !== 'aws.kms' || event['detail-type'] !== 'KMS Key Rotation') {
        console.log('Ignoring non-KMS rotation event');
        return;
      }

      const { keyId, eventName, rotationStatus } = event.detail;

      // Handle different rotation events
      switch (eventName) {
        case 'KeyRotation':
          await this.handleKeyRotationCompletion(keyId, rotationStatus);
          break;
        case 'KeyRotationScheduled':
          await this.handleKeyRotationScheduled(keyId);
          break;
        default:
          console.log(`Unhandled KMS event: ${eventName}`);
      }

      // Record successful processing
      await this.recordMetric('KMS.RotationEvent.Success', 1, {
        EventType: eventName,
        KeyId: keyId,
      });

    } catch (error) {
      console.error('Error handling KMS rotation event:', error);
      await this.recordMetric('KMS.RotationEvent.Error', 1, {
        Error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Handle key rotation completion
   */
  private async handleKeyRotationCompletion(keyId: string, rotationStatus: string): Promise<void> {
    console.log(`Key rotation completed for ${keyId} with status: ${rotationStatus}`);

    if (rotationStatus !== 'Enabled') {
      console.warn(`Key rotation failed or disabled for ${keyId}`);
      return;
    }

    try {
      // Verify the key is active and healthy
      const keyInfo = await this.validateRotatedKey(keyId);
      
      if (keyInfo.KeyMetadata?.KeyState !== 'Enabled') {
        throw new Error(`Rotated key ${keyId} is not in Enabled state: ${keyInfo.KeyMetadata?.KeyState}`);
      }

      // Update the alias to point to the rotated key
      await this.updateKeyAlias(keyId);

      // Validate the alias update
      await this.validateAliasUpdate(keyId);

      console.log(`Successfully completed key rotation process for ${keyId}`);

      // Record rotation metrics
      await this.recordMetric('KMS.KeyRotation.Completed', 1, {
        KeyId: keyId,
        KeyAlias: this.keyAlias,
      });

    } catch (error) {
      console.error(`Failed to process key rotation for ${keyId}:`, error);
      await this.recordMetric('KMS.KeyRotation.Failed', 1, {
        KeyId: keyId,
        Error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Handle key rotation scheduling notification
   */
  private async handleKeyRotationScheduled(keyId: string): Promise<void> {
    console.log(`Key rotation scheduled for ${keyId}`);

    // Record that rotation is scheduled
    await this.recordMetric('KMS.KeyRotation.Scheduled', 1, {
      KeyId: keyId,
      KeyAlias: this.keyAlias,
    });

    // Optionally send notifications or perform pre-rotation checks
    await this.performPreRotationValidation(keyId);
  }

  /**
   * Validate the rotated key is healthy
   */
  private async validateRotatedKey(keyId: string): Promise<any> {
    const command = new DescribeKeyCommand({
      KeyId: keyId
    });

    const result = await this.kmsClient.send(command);
    
    if (!result.KeyMetadata) {
      throw new Error(`Unable to retrieve metadata for rotated key ${keyId}`);
    }

    console.log(`Validated rotated key ${keyId}:`, {
      KeyState: result.KeyMetadata.KeyState,
      KeyUsage: result.KeyMetadata.KeyUsage,
      Origin: result.KeyMetadata.Origin,
    });

    return result;
  }

  /**
   * Update the key alias to point to the rotated key
   */
  private async updateKeyAlias(keyId: string): Promise<void> {
    console.log(`Updating alias ${this.keyAlias} to point to rotated key ${keyId}`);

    const command = new UpdateAliasCommand({
      AliasName: this.keyAlias,
      TargetKeyId: keyId
    });

    await this.kmsClient.send(command);
    console.log(`Successfully updated alias ${this.keyAlias}`);
  }

  /**
   * Validate that the alias update was successful
   */
  private async validateAliasUpdate(expectedKeyId: string): Promise<void> {
    const command = new ListAliasesCommand({
      KeyId: expectedKeyId
    });

    const result = await this.kmsClient.send(command);
    const alias = result.Aliases?.find(a => a.AliasName === this.keyAlias);

    if (!alias) {
      throw new Error(`Alias ${this.keyAlias} not found after update`);
    }

    if (alias.TargetKeyId !== expectedKeyId) {
      throw new Error(
        `Alias validation failed: expected ${expectedKeyId}, got ${alias.TargetKeyId}`
      );
    }

    console.log(`Alias ${this.keyAlias} successfully validated`);
  }

  /**
   * Perform pre-rotation validation
   */
  private async performPreRotationValidation(keyId: string): Promise<void> {
    try {
      // Verify current key is accessible
      const keyInfo = await this.validateRotatedKey(keyId);
      
      // Check if key rotation is properly enabled
      if (!keyInfo.KeyMetadata?.KeyRotationStatus) {
        console.warn(`Key rotation status not enabled for ${keyId}`);
      }

      // Record pre-rotation validation
      await this.recordMetric('KMS.PreRotation.Validation', 1, {
        KeyId: keyId,
        Status: 'Success',
      });

    } catch (error) {
      console.error(`Pre-rotation validation failed for ${keyId}:`, error);
      await this.recordMetric('KMS.PreRotation.Validation', 1, {
        KeyId: keyId,
        Status: 'Failed',
        Error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Record CloudWatch metrics
   */
  private async recordMetric(
    metricName: string,
    value: number,
    dimensions: Record<string, string> = {}
  ): Promise<void> {
    try {
      const command = new PutMetricDataCommand({
        Namespace: 'GitHubLinkBuddy/KMS',
        MetricData: [
          {
            MetricName: metricName,
            Value: value,
            Unit: 'Count',
            Dimensions: Object.entries({
              Environment: process.env.NODE_ENV || 'development',
              KeyAlias: this.keyAlias,
              ...dimensions,
            }).map(([Name, Value]) => ({ Name, Value })),
            Timestamp: new Date(),
          },
        ],
      });

      await this.cloudWatchClient.send(command);
    } catch (error) {
      console.warn('Failed to record CloudWatch metric:', error);
    }
  }
}

/**
 * Lambda handler function for AWS Lambda integration
 */
export const lambdaHandler = async (event: KeyRotationEvent): Promise<void> => {
  const keyAlias = process.env.KMS_KEY_ALIAS || 'alias/github-link-buddy-encryption-key';
  const region = process.env.AWS_REGION || 'us-east-1';

  const handler = new KMSRotationHandler(keyAlias, region);
  await handler.handleRotationEvent(event);
};

export default KMSRotationHandler;
