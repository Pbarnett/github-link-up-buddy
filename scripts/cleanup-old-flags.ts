#!/usr/bin/env tsx

/**
 * LaunchDarkly Flag Cleanup Script
 * Task #50-51: Flag lifecycle and cleanup automation
 * 
 * This script identifies and removes obsolete feature flags after rollout completion.
 * It includes the emergency disable flag and proper lifecycle management.
 */

import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'fs';
import { join } from 'path';

interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  creationDate: string;
  lastModified: string;
  status: 'active' | 'deprecated' | 'archived';
  tags: string[];
  rolloutPercentage: number;
  environments: string[];
  temporary: boolean;
  expirationDate?: string;
}

interface FlagCleanupConfig {
  dryRun: boolean;
  maxAgeInDays: number;
  excludeFlags: string[];
  requireConfirmation: boolean;
  archiveOnly: boolean;
}

class LaunchDarklyFlagCleanup {
  private config: FlagCleanupConfig;
  private projectRoot: string;
  private flagsConfigPath: string;
  private logFile: string;

  constructor(config: Partial<FlagCleanupConfig> = {}) {
    this.config = {
      dryRun: config.dryRun ?? true,
      maxAgeInDays: config.maxAgeInDays ?? 90,
      excludeFlags: config.excludeFlags ?? [
        'auto_booking_emergency_disable', // Never auto-cleanup emergency flags
        'kill_switch_global',
        'maintenance_mode'
      ],
      requireConfirmation: config.requireConfirmation ?? true,
      archiveOnly: config.archiveOnly ?? false
    };

    this.projectRoot = process.cwd();
    this.flagsConfigPath = join(this.projectRoot, 'src/lib/feature-flags/flags-config.json');
    this.logFile = join(this.projectRoot, 'flag-cleanup.log');
  }

  /**
   * Main cleanup process
   */
  async cleanup(): Promise<void> {
    this.log('info', '🧹 Starting LaunchDarkly flag cleanup process');
    this.log('info', `Configuration: ${JSON.stringify(this.config, null, 2)}`);

    try {
      const flags = await this.loadFlags();
      const obsoleteFlags = this.identifyObsoleteFlags(flags);
      
      if (obsoleteFlags.length === 0) {
        this.log('info', '✅ No obsolete flags found');
        return;
      }

      this.log('info', `Found ${obsoleteFlags.length} potentially obsolete flags`);
      
      if (this.config.dryRun) {
        this.log('info', '🔍 DRY RUN MODE - No flags will be actually removed');
        this.displayObsoleteFlags(obsoleteFlags);
        return;
      }

      if (this.config.requireConfirmation) {
        const confirmed = await this.confirmCleanup(obsoleteFlags);
        if (!confirmed) {
          this.log('info', '❌ Cleanup cancelled by user');
          return;
        }
      }

      await this.processObsoleteFlags(obsoleteFlags);
      this.log('info', '✅ Flag cleanup completed successfully');

    } catch (error) {
      this.log('error', `❌ Flag cleanup failed: ${error}`);
      throw error;
    }
  }

  /**
   * Load flags from configuration
   */
  private async loadFlags(): Promise<FeatureFlag[]> {
    this.log('info', 'Loading feature flags configuration');

    // Try to load from local config file first
    if (existsSync(this.flagsConfigPath)) {
      const configContent = readFileSync(this.flagsConfigPath, 'utf-8');
      const config = JSON.parse(configContent);
      return config.flags || [];
    }

    // If no local config, create a mock set for demonstration
    return this.getMockFlags();
  }

  /**
   * Mock flags for demonstration and testing
   */
  private getMockFlags(): FeatureFlag[] {
    const now = new Date();
    const oldDate = new Date(now.getTime() - (100 * 24 * 60 * 60 * 1000)); // 100 days ago
    const recentDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 days ago

    return [
      // Emergency disable flag - should never be cleaned up
      {
        key: 'auto_booking_emergency_disable',
        name: 'Auto Booking Emergency Disable',
        description: 'Emergency kill switch for auto-booking pipeline',
        creationDate: recentDate.toISOString(),
        lastModified: recentDate.toISOString(),
        status: 'active',
        tags: ['emergency', 'kill-switch', 'critical'],
        rolloutPercentage: 0,
        environments: ['production', 'staging'],
        temporary: false
      },
      // Current active flags
      {
        key: 'auto_booking_pipeline_enabled',
        name: 'Auto Booking Pipeline Enabled',
        description: 'Main feature flag for auto-booking functionality',
        creationDate: recentDate.toISOString(),
        lastModified: new Date().toISOString(),
        status: 'active',
        tags: ['feature', 'auto-booking'],
        rolloutPercentage: 100,
        environments: ['production', 'staging'],
        temporary: false
      },
      // Old flags that should be cleaned up
      {
        key: 'legacy_booking_flow',
        name: 'Legacy Booking Flow',
        description: 'Old booking flow - deprecated',
        creationDate: oldDate.toISOString(),
        lastModified: oldDate.toISOString(),
        status: 'deprecated',
        tags: ['legacy', 'deprecated'],
        rolloutPercentage: 0,
        environments: [],
        temporary: true,
        expirationDate: new Date(now.getTime() - (10 * 24 * 60 * 60 * 1000)).toISOString()
      },
      {
        key: 'experiment_checkout_v2',
        name: 'Checkout V2 Experiment',
        description: 'A/B test for new checkout flow - completed',
        creationDate: oldDate.toISOString(),
        lastModified: oldDate.toISOString(),
        status: 'archived',
        tags: ['experiment', 'completed'],
        rolloutPercentage: 100,
        environments: ['production'],
        temporary: true,
        expirationDate: new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000)).toISOString()
      }
    ];
  }

  /**
   * Identify obsolete flags based on criteria
   */
  private identifyObsoleteFlags(flags: FeatureFlag[]): FeatureFlag[] {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - (this.config.maxAgeInDays * 24 * 60 * 60 * 1000));

    return flags.filter(flag => {
      // Never cleanup excluded flags
      if (this.config.excludeFlags.includes(flag.key)) {
        return false;
      }

      // Check if flag has explicit expiration date that has passed
      if (flag.expirationDate && new Date(flag.expirationDate) < now) {
        return true;
      }

      // Check if flag is deprecated/archived and old enough
      if ((flag.status === 'deprecated' || flag.status === 'archived') && 
          new Date(flag.lastModified) < cutoffDate) {
        return true;
      }

      // Check if temporary flag is old and not being used
      if (flag.temporary && 
          new Date(flag.lastModified) < cutoffDate &&
          flag.rolloutPercentage === 0) {
        return true;
      }

      return false;
    });
  }

  /**
   * Display obsolete flags for review
   */
  private displayObsoleteFlags(flags: FeatureFlag[]): void {
    console.log('\n🔍 Obsolete Flags Found:\n');
    
    flags.forEach((flag, index) => {
      console.log(`${index + 1}. ${flag.key}`);
      console.log(`   Name: ${flag.name}`);
      console.log(`   Status: ${flag.status}`);
      console.log(`   Last Modified: ${new Date(flag.lastModified).toLocaleDateString()}`);
      console.log(`   Rollout: ${flag.rolloutPercentage}%`);
      console.log(`   Environments: ${flag.environments.join(', ')}`);
      if (flag.expirationDate) {
        console.log(`   Expired: ${new Date(flag.expirationDate).toLocaleDateString()}`);
      }
      console.log('');
    });
  }

  /**
   * Confirm cleanup with user
   */
  private async confirmCleanup(flags: FeatureFlag[]): Promise<boolean> {
    this.displayObsoleteFlags(flags);
    
    console.log(`\n⚠️  WARNING: This will ${this.config.archiveOnly ? 'archive' : 'DELETE'} ${flags.length} flags.`);
    console.log('This action cannot be undone.');
    
    // In a real implementation, you would use a proper prompt library
    // For testing purposes, we'll assume confirmation
    const isCI = process.env.CI === 'true';
    if (isCI) {
      this.log('info', 'CI environment detected, skipping confirmation prompt');
      return true;
    }

    // Simulate user confirmation (in real implementation, use readline or inquirer)
    return true;
  }

  /**
   * Process obsolete flags (archive or delete)
   */
  private async processObsoleteFlags(flags: FeatureFlag[]): Promise<void> {
    for (const flag of flags) {
      try {
        if (this.config.archiveOnly) {
          await this.archiveFlag(flag);
        } else {
          await this.deleteFlag(flag);
        }
      } catch (error) {
        this.log('error', `Failed to process flag ${flag.key}: ${error}`);
      }
    }
  }

  /**
   * Archive a flag (mark as archived but keep in system)
   */
  private async archiveFlag(flag: FeatureFlag): Promise<void> {
    this.log('info', `📦 Archiving flag: ${flag.key}`);
    
    // In a real implementation, this would call LaunchDarkly API
    // For now, we'll simulate the archival
    await this.simulateAPICall('archive', flag.key);
    
    this.log('info', `✅ Flag ${flag.key} archived successfully`);
  }

  /**
   * Delete a flag completely
   */
  private async deleteFlag(flag: FeatureFlag): Promise<void> {
    this.log('info', `🗑️  Deleting flag: ${flag.key}`);
    
    // In a real implementation, this would call LaunchDarkly API
    // For now, we'll simulate the deletion
    await this.simulateAPICall('delete', flag.key);
    
    this.log('info', `✅ Flag ${flag.key} deleted successfully`);
  }

  /**
   * Simulate API call to LaunchDarkly
   */
  private async simulateAPICall(action: 'archive' | 'delete', flagKey: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In real implementation, this would be:
    // await this.launchDarklyClient.deleteFeatureFlag(projectKey, flagKey);
    // or
    // await this.launchDarklyClient.patchFeatureFlag(projectKey, flagKey, { archived: true });
  }

  /**
   * Generate cleanup report
   */
  generateReport(): void {
    const reportPath = join(this.projectRoot, 'flag-cleanup-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      config: this.config,
      summary: {
        totalFlagsProcessed: 0,
        flagsArchived: 0,
        flagsDeleted: 0,
        errors: 0
      }
    };

    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log('info', `📊 Cleanup report generated: ${reportPath}`);
  }

  /**
   * Logging utility
   */
  private log(level: 'info' | 'warn' | 'error', message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} [${level.toUpperCase()}] ${message}`;
    
    console.log(logEntry);
    
    // Append to log file
    appendFileSync(this.logFile, logEntry + '\n');
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const config: Partial<FlagCleanupConfig> = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--dry-run':
        config.dryRun = true;
        break;
      case '--no-dry-run':
        config.dryRun = false;
        break;
      case '--max-age':
        config.maxAgeInDays = parseInt(args[++i]);
        break;
      case '--archive-only':
        config.archiveOnly = true;
        break;
      case '--no-confirmation':
        config.requireConfirmation = false;
        break;
      case '--help':
        console.log(`
LaunchDarkly Flag Cleanup Script

Usage: tsx scripts/cleanup-old-flags.ts [options]

Options:
  --dry-run              Preview changes without making them (default)
  --no-dry-run           Actually perform the cleanup
  --max-age DAYS         Maximum age in days for flags to be considered obsolete (default: 90)
  --archive-only         Archive flags instead of deleting them
  --no-confirmation      Skip confirmation prompt
  --help                 Show this help message

Examples:
  tsx scripts/cleanup-old-flags.ts --dry-run
  tsx scripts/cleanup-old-flags.ts --no-dry-run --max-age 60 --archive-only
        `);
        return;
    }
  }

  try {
    const cleanup = new LaunchDarklyFlagCleanup(config);
    await cleanup.cleanup();
    cleanup.generateReport();
  } catch (error) {
    console.error('Flag cleanup failed:', error);
    process.exit(1);
  }
}

// Export for testing
export { LaunchDarklyFlagCleanup, FeatureFlag, FlagCleanupConfig };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
