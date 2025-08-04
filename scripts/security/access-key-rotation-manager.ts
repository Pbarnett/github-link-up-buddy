#!/usr/bin/env tsx

/**
 * Access Key Rotation Manager
 * 
 * AWS World-Class Standards Compliance - Automated Access Key Rotation
 * 
 * This script manages:
 * - 90-day access key rotation policy
 * - Automated key creation and notification
 * - Grace period for key transition
 * - Monitoring and alerting
 * - Audit trail for key lifecycle
 */

import {
  IAMClient,
  ListUsersCommand,
  ListAccessKeysCommand,
  CreateAccessKeyCommand,
  DeleteAccessKeyCommand,
  UpdateAccessKeyCommand,
  AccessKeyMetadata,
  User
} from '@aws-sdk/client-iam';

import {
  SNSClient,
  PublishCommand,
  CreateTopicCommand,
  SubscribeCommand
} from '@aws-sdk/client-sns';

import {
  EventBridgeClient,
  PutEventsCommand,
  PutRuleCommand,
  PutTargetsCommand
} from '@aws-sdk/client-eventbridge';

import {
  SecretsManagerClient,
  CreateSecretCommand,
  UpdateSecretCommand,
  GetSecretValueCommand
} from '@aws-sdk/client-secrets-manager';

import { promises as fs } from 'fs';

interface KeyRotationConfig {
  maxKeyAgeDays: number;
  warningDays: number;
  gracePeriodDays: number;
  dryRun: boolean;
  notificationTopicArn?: string;
  excludeUsers: string[];
}

interface KeyRotationResult {
  userName: string;
  oldKeyId: string;
  newKeyId?: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED' | 'WARNING';
  message: string;
  timestamp: string;
}

interface RotationReport {
  executionId: string;
  timestamp: string;
  config: KeyRotationConfig;
  results: KeyRotationResult[];
  summary: {
    totalUsers: number;
    keysRotated: number;
    warningsSent: number;
    failures: number;
    skipped: number;
  };
}

class AccessKeyRotationManager {
  private iamClient: IAMClient;
  private snsClient: SNSClient;
  private eventBridgeClient: EventBridgeClient;
  private secretsClient: SecretsManagerClient;
  private config: KeyRotationConfig;
  private executionId: string;

  constructor(config: Partial<KeyRotationConfig> = {}) {
    this.iamClient = new IAMClient({ region: process.env.AWS_REGION || 'us-west-2' });
    this.snsClient = new SNSClient({ region: process.env.AWS_REGION || 'us-west-2' });
    this.eventBridgeClient = new EventBridgeClient({ region: process.env.AWS_REGION || 'us-west-2' });
    this.secretsClient = new SecretsManagerClient({ region: process.env.AWS_REGION || 'us-west-2' });
    
    this.config = {
      maxKeyAgeDays: 90,
      warningDays: 80,
      gracePeriodDays: 7,
      dryRun: false,
      excludeUsers: ['emergency-break-glass', 'service-account'],
      ...config
    };

    this.executionId = `rotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async executeRotation(): Promise<RotationReport> {
    console.log(`🔄 Starting access key rotation (ID: ${this.executionId})`);
    console.log(`Configuration: ${JSON.stringify(this.config, null, 2)}\n`);

    const results: KeyRotationResult[] = [];
    const users = await this.getAllUsers();

    console.log(`Found ${users.length} users to check\n`);

    for (const user of users) {
      if (this.config.excludeUsers.includes(user.UserName!)) {
        console.log(`⏭️  Skipping excluded user: ${user.UserName}`);
        results.push({
          userName: user.UserName!,
          oldKeyId: 'N/A',
          status: 'SKIPPED',
          message: 'User in exclude list',
          timestamp: new Date().toISOString()
        });
        continue;
      }

      const userResults = await this.processUser(user);
      results.push(...userResults);
    }

    const report = this.generateReport(results);
    await this.saveReport(report);
    this.displaySummary(report);

    return report;
  }

  private async getAllUsers(): Promise<User[]> {
    const users: User[] = [];
    let marker: string | undefined;

    do {
      const command = new ListUsersCommand({
        Marker: marker,
        MaxItems: 100
      });

      const response = await this.iamClient.send(command);
      if (response.Users) {
        users.push(...response.Users);
      }
      marker = response.Marker;
    } while (marker);

    return users;
  }

  private async processUser(user: User): Promise<KeyRotationResult[]> {
    const results: KeyRotationResult[] = [];
    
    try {
      const accessKeys = await this.getUserAccessKeys(user.UserName!);
      
      if (accessKeys.length === 0) {
        console.log(`ℹ️  User ${user.UserName} has no access keys`);
        return results;
      }

      for (const key of accessKeys) {
        const result = await this.processAccessKey(user.UserName!, key);
        results.push(result);
      }
    } catch (error) {
      console.error(`❌ Error processing user ${user.UserName}:`, error);
      results.push({
        userName: user.UserName!,
        oldKeyId: 'Unknown',
        status: 'FAILED',
        message: `Error processing user: ${error}`,
        timestamp: new Date().toISOString()
      });
    }

    return results;
  }

  private async getUserAccessKeys(userName: string): Promise<AccessKeyMetadata[]> {
    const command = new ListAccessKeysCommand({ UserName: userName });
    const response = await this.iamClient.send(command);
    return response.AccessKeyMetadata || [];
  }

  private async processAccessKey(userName: string, key: AccessKeyMetadata): Promise<KeyRotationResult> {
    const keyAge = this.calculateKeyAge(key.CreateDate!);
    const keyId = key.AccessKeyId!;

    console.log(`🔍 Checking key ${keyId} for user ${userName} (age: ${keyAge} days)`);

    // Check if key needs rotation
    if (keyAge >= this.config.maxKeyAgeDays) {
      console.log(`🔄 Key ${keyId} needs rotation (${keyAge} days old)`);
      return await this.rotateAccessKey(userName, key);
    }

    // Check if warning should be sent
    if (keyAge >= this.config.warningDays) {
      console.log(`⚠️  Key ${keyId} approaching expiration (${keyAge} days old)`);
      return await this.sendExpirationWarning(userName, key);
    }

    console.log(`✅ Key ${keyId} is current (${keyAge} days old)`);
    return {
      userName,
      oldKeyId: keyId,
      status: 'SKIPPED',
      message: `Key is current (${keyAge} days old)`,
      timestamp: new Date().toISOString()
    };
  }

  private calculateKeyAge(createDate: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private async rotateAccessKey(userName: string, oldKey: AccessKeyMetadata): Promise<KeyRotationResult> {
    try {
      if (this.config.dryRun) {
        console.log(`🧪 DRY RUN: Would rotate key ${oldKey.AccessKeyId} for user ${userName}`);
        return {
          userName,
          oldKeyId: oldKey.AccessKeyId!,
          status: 'SKIPPED',
          message: 'Dry run mode - rotation not performed',
          timestamp: new Date().toISOString()
        };
      }

      // Check if user already has 2 keys (AWS limit)
      const currentKeys = await this.getUserAccessKeys(userName);
      if (currentKeys.length >= 2) {
        console.log(`⚠️  User ${userName} already has 2 access keys. Manual intervention required.`);
        await this.notifyManualIntervention(userName, oldKey.AccessKeyId!);
        return {
          userName,
          oldKeyId: oldKey.AccessKeyId!,
          status: 'FAILED',
          message: 'User has maximum number of access keys (2). Manual rotation required.',
          timestamp: new Date().toISOString()
        };
      }

      // Create new access key
      console.log(`🔑 Creating new access key for user ${userName}`);
      const createResponse = await this.iamClient.send(new CreateAccessKeyCommand({
        UserName: userName
      }));

      const newKey = createResponse.AccessKey!;
      console.log(`✅ Created new access key ${newKey.AccessKeyId} for user ${userName}`);

      // Store new key securely
      await this.storeNewKeySecurely(userName, newKey);

      // Send notification with new key details
      await this.notifyKeyRotation(userName, oldKey.AccessKeyId!, newKey.AccessKeyId!);

      // Schedule old key deactivation
      await this.scheduleKeyDeactivation(userName, oldKey.AccessKeyId!, this.config.gracePeriodDays);

      return {
        userName,
        oldKeyId: oldKey.AccessKeyId!,
        newKeyId: newKey.AccessKeyId,
        status: 'SUCCESS',
        message: `New key created. Old key will be deactivated in ${this.config.gracePeriodDays} days.`,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`❌ Failed to rotate key for user ${userName}:`, error);
      await this.notifyRotationFailure(userName, oldKey.AccessKeyId!, error);
      
      return {
        userName,
        oldKeyId: oldKey.AccessKeyId!,
        status: 'FAILED',
        message: `Rotation failed: ${error}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async sendExpirationWarning(userName: string, key: AccessKeyMetadata): Promise<KeyRotationResult> {
    try {
      const keyAge = this.calculateKeyAge(key.CreateDate!);
      const daysRemaining = this.config.maxKeyAgeDays - keyAge;

      if (this.config.dryRun) {
        console.log(`🧪 DRY RUN: Would send warning for key ${key.AccessKeyId} (${daysRemaining} days remaining)`);
        return {
          userName,
          oldKeyId: key.AccessKeyId!,
          status: 'SKIPPED',
          message: 'Dry run mode - warning not sent',
          timestamp: new Date().toISOString()
        };
      }

      await this.notifyKeyExpiration(userName, key.AccessKeyId!, daysRemaining);

      return {
        userName,
        oldKeyId: key.AccessKeyId!,
        status: 'WARNING',
        message: `Expiration warning sent (${daysRemaining} days remaining)`,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`❌ Failed to send warning for user ${userName}:`, error);
      return {
        userName,
        oldKeyId: key.AccessKeyId!,
        status: 'FAILED',
        message: `Warning failed: ${error}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async storeNewKeySecurely(userName: string, accessKey: any): Promise<void> {
    const secretName = `github-link-buddy/access-keys/${userName}`;
    
    const secretValue = {
      accessKeyId: accessKey.AccessKeyId,
      secretAccessKey: accessKey.SecretAccessKey,
      createdDate: new Date().toISOString(),
      rotationId: this.executionId
    };

    try {
      // Try to update existing secret
      await this.secretsClient.send(new UpdateSecretCommand({
        SecretId: secretName,
        SecretString: JSON.stringify(secretValue)
      }));
    } catch (error) {
      // Create new secret if it doesn't exist
      await this.secretsClient.send(new CreateSecretCommand({
        Name: secretName,
        SecretString: JSON.stringify(secretValue),
        Description: `Access key for IAM user ${userName} - managed by key rotation system`
      }));
    }

    console.log(`🔐 Stored new access key securely in Secrets Manager: ${secretName}`);
  }

  private async scheduleKeyDeactivation(userName: string, keyId: string, graceDays: number): Promise<void> {
    const deactivationDate = new Date();
    deactivationDate.setDate(deactivationDate.getDate() + graceDays);

    await this.eventBridgeClient.send(new PutEventsCommand({
      Entries: [{
        Source: 'github-link-buddy.key-rotation',
        DetailType: 'Scheduled Key Deactivation',
        Detail: JSON.stringify({
          userName,
          keyId,
          action: 'deactivate',
          rotationId: this.executionId
        }),
        Time: deactivationDate
      }]
    }));

    console.log(`⏰ Scheduled deactivation of key ${keyId} for ${deactivationDate.toISOString()}`);
  }

  private async notifyKeyRotation(userName: string, oldKeyId: string, newKeyId: string): Promise<void> {
    if (!this.config.notificationTopicArn) return;

    const message = {
      type: 'KEY_ROTATED',
      userName,
      oldKeyId,
      newKeyId,
      gracePeriodDays: this.config.gracePeriodDays,
      executionId: this.executionId,
      timestamp: new Date().toISOString(),
      actions: [
        'Update applications to use the new access key',
        `Old key will be deactivated in ${this.config.gracePeriodDays} days`,
        'Test applications with new key before old key deactivation'
      ]
    };

    await this.snsClient.send(new PublishCommand({
      TopicArn: this.config.notificationTopicArn,
      Subject: `🔄 Access Key Rotated for ${userName}`,
      Message: JSON.stringify(message, null, 2)
    }));
  }

  private async notifyKeyExpiration(userName: string, keyId: string, daysRemaining: number): Promise<void> {
    if (!this.config.notificationTopicArn) return;

    const message = {
      type: 'KEY_EXPIRING',
      userName,
      keyId,
      daysRemaining,
      maxKeyAgeDays: this.config.maxKeyAgeDays,
      executionId: this.executionId,
      timestamp: new Date().toISOString(),
      actions: [
        'Prepare for access key rotation',
        'Ensure applications can handle key rotation',
        'Review key usage before rotation'
      ]
    };

    await this.snsClient.send(new PublishCommand({
      TopicArn: this.config.notificationTopicArn,
      Subject: `⚠️  Access Key Expiring for ${userName} (${daysRemaining} days)`,
      Message: JSON.stringify(message, null, 2)
    }));
  }

  private async notifyManualIntervention(userName: string, keyId: string): Promise<void> {
    if (!this.config.notificationTopicArn) return;

    const message = {
      type: 'MANUAL_INTERVENTION_REQUIRED',
      userName,
      keyId,
      reason: 'User has maximum number of access keys (2)',
      executionId: this.executionId,
      timestamp: new Date().toISOString(),
      actions: [
        'Manually delete one of the existing access keys',
        'Ensure applications are updated before deletion',
        'Re-run rotation after manual cleanup'
      ]
    };

    await this.snsClient.send(new PublishCommand({
      TopicArn: this.config.notificationTopicArn,
      Subject: `🚨 Manual Intervention Required - ${userName}`,
      Message: JSON.stringify(message, null, 2)
    }));
  }

  private async notifyRotationFailure(userName: string, keyId: string, error: any): Promise<void> {
    if (!this.config.notificationTopicArn) return;

    const message = {
      type: 'ROTATION_FAILED',
      userName,
      keyId,
      error: error.toString(),
      executionId: this.executionId,
      timestamp: new Date().toISOString(),
      actions: [
        'Investigate rotation failure',
        'Check IAM permissions for rotation service',
        'Manually rotate key if necessary'
      ]
    };

    await this.snsClient.send(new PublishCommand({
      TopicArn: this.config.notificationTopicArn,
      Subject: `❌ Access Key Rotation Failed - ${userName}`,
      Message: JSON.stringify(message, null, 2)
    }));
  }

  private generateReport(results: KeyRotationResult[]): RotationReport {
    const summary = {
      totalUsers: new Set(results.map(r => r.userName)).size,
      keysRotated: results.filter(r => r.status === 'SUCCESS').length,
      warningsSent: results.filter(r => r.status === 'WARNING').length,
      failures: results.filter(r => r.status === 'FAILED').length,
      skipped: results.filter(r => r.status === 'SKIPPED').length
    };

    return {
      executionId: this.executionId,
      timestamp: new Date().toISOString(),
      config: this.config,
      results,
      summary
    };
  }

  private async saveReport(report: RotationReport): Promise<void> {
    const reportPath = `access-key-rotation-report-${this.executionId}.json`;
    const fs = await import('fs');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Report saved to: ${reportPath}`);
  }

  private displaySummary(report: RotationReport): void {
    console.log('\n📊 Rotation Summary');
    console.log('==================');
    console.log(`Execution ID: ${report.executionId}`);
    console.log(`Total Users Processed: ${report.summary.totalUsers}`);
    console.log(`Keys Rotated: ${report.summary.keysRotated}`);
    console.log(`Warnings Sent: ${report.summary.warningsSent}`);
    console.log(`Failures: ${report.summary.failures}`);
    console.log(`Skipped: ${report.summary.skipped}`);

    if (report.summary.failures > 0) {
      console.log('\n❌ Failed Rotations:');
      report.results
        .filter(r => r.status === 'FAILED')
        .forEach(r => console.log(`  - ${r.userName}: ${r.message}`));
    }

    if (report.summary.keysRotated > 0) {
      console.log('\n✅ Successful Rotations:');
      report.results
        .filter(r => r.status === 'SUCCESS')
        .forEach(r => console.log(`  - ${r.userName}: ${r.oldKeyId} → ${r.newKeyId}`));
    }
  }

  // Public method to deactivate old keys (called by scheduled events)
  async deactivateExpiredKey(userName: string, keyId: string): Promise<void> {
    try {
      console.log(`🔒 Deactivating expired key ${keyId} for user ${userName}`);
      
      await this.iamClient.send(new UpdateAccessKeyCommand({
        UserName: userName,
        AccessKeyId: keyId,
        Status: 'Inactive'
      }));

      console.log(`✅ Key ${keyId} deactivated for user ${userName}`);

      // Schedule final deletion after additional grace period
      await this.scheduleKeyDeletion(userName, keyId, 30); // 30 days before deletion

    } catch (error) {
      console.error(`❌ Failed to deactivate key ${keyId} for user ${userName}:`, error);
      throw error;
    }
  }

  private async scheduleKeyDeletion(userName: string, keyId: string, days: number): Promise<void> {
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + days);

    await this.eventBridgeClient.send(new PutEventsCommand({
      Entries: [{
        Source: 'github-link-buddy.key-rotation',
        DetailType: 'Scheduled Key Deletion',
        Detail: JSON.stringify({
          userName,
          keyId,
          action: 'delete'
        }),
        Time: deletionDate
      }]
    }));

    console.log(`🗑️  Scheduled deletion of key ${keyId} for ${deletionDate.toISOString()}`);
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const config: Partial<KeyRotationConfig> = {};

  // Parse CLI arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--dry-run':
        config.dryRun = true;
        break;
      case '--max-age':
        config.maxKeyAgeDays = parseInt(args[++i]);
        break;
      case '--warning-days':
        config.warningDays = parseInt(args[++i]);
        break;
      case '--grace-period':
        config.gracePeriodDays = parseInt(args[++i]);
        break;
      case '--notification-topic':
        config.notificationTopicArn = args[++i];
        break;
      case '--exclude-user':
        config.excludeUsers = config.excludeUsers || [];
        config.excludeUsers.push(args[++i]);
        break;
      case '--help':
        console.log(`
Access Key Rotation Manager

Usage: tsx access-key-rotation-manager.ts [options]

Options:
  --dry-run                 Run in dry-run mode (no actual changes)
  --max-age <days>         Maximum key age before rotation (default: 90)
  --warning-days <days>    Send warning at this age (default: 80)
  --grace-period <days>    Grace period before old key deactivation (default: 7)
  --notification-topic     SNS topic ARN for notifications
  --exclude-user <name>    Exclude user from rotation (can be used multiple times)
  --help                   Show this help message

Examples:
  tsx access-key-rotation-manager.ts --dry-run
  tsx access-key-rotation-manager.ts --max-age 60 --warning-days 50
  tsx access-key-rotation-manager.ts --exclude-user emergency-account
        `);
        process.exit(0);
    }
  }

  try {
    const manager = new AccessKeyRotationManager(config);
    const report = await manager.executeRotation();
    
    if (report.summary.failures > 0) {
      console.error(`\n❌ Rotation completed with ${report.summary.failures} failures`);
      process.exit(1);
    } else {
      console.log('\n✅ Rotation completed successfully');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Access key rotation failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { AccessKeyRotationManager, KeyRotationConfig, RotationReport };
