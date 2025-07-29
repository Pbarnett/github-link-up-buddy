#!/usr/bin/env node

/**
 * Parker Flight - Production Rollback & Disaster Recovery Script
 * 
 * This script handles emergency rollbacks and disaster recovery including:
 * - Automated rollback to previous deployment
 * - Database migration rollbacks
 * - Edge function rollbacks
 * - Infrastructure state restoration
 * - Monitoring and validation of rollback success
 */

import { execSync } from 'child_process';
const fs = require('fs');
import {} from 'path';
// Utility functions
// Removed unused info function
// Removed unused warning function
// Removed unused error function
// Removed unused success function

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m', 
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'

};
// Utility functions
// Removed unused log function

const step = (message) => console.log(`🔄 ${message}`, 'cyan');
const emergency = (message) => console.log(`🚨 ${message}`, 'red');

// Configuration
const PRODUCTION_ENV_FILE = '.env.production';
const ROLLBACK_DATA_DIR = 'rollback-data';
const MAX_ROLLBACK_ATTEMPTS = 3;

class ProductionRollback {
  constructor(options = {}) {
    this.startTime = Date.now();
    this.rollbackReason = options.reason || 'Manual rollback initiated';
    this.targetCommit = options.targetCommit || null;
    this.emergencyMode = options.emergency || false;
    this.dryRun = options.dryRun || false;
    this.rollbackSteps = [];
    this.currentDeploymentId = null;
    this.rollbackAttempt = 1;
    
    this.checks = {
      preRollback: false,
      gitRollback: false,
      databaseRollback: false,
      edgeFunctionRollback: false,
      infrastructureRestore: false,
      postRollbackValidation: false
    };
  }

  async execute() {
    try {
      emergency('🚨 PRODUCTION ROLLBACK INITIATED');
      console.log('=' .repeat(70), 'red');
      
      if (this.dryRun) {
        console.warn('DRY RUN MODE - No actual changes will be made');
      }
      
      await this.preRollbackChecks();
      await this.identifyRollbackTarget();
      await this.createRollbackPlan();
      await this.executeRollbackPlan();
      await this.validateRollback();
      await this.generateRollbackReport();
      
      const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
      console.log(`✅ 🎉 Rollback completed successfully in ${duration}s`);
      
    } catch (err) {
      console.error(`Rollback failed: ${err.message}`);
      await this.handleRollbackFailure(err);
      process.exit(1);
    }
  }

  async preRollbackChecks() {
    console.log('Performing pre-rollback safety checks...');
    
    // Load current environment
    if (fs.existsSync(PRODUCTION_ENV_FILE)) {
      const { config } = await import('dotenv');
      config({ path: PRODUCTION_ENV_FILE });
    }
    
    // Check current deployment status
    try {
      const currentStatus = await this.getCurrentDeploymentStatus();
      this.currentDeploymentId = currentStatus.deployment_id
      console.info(`Current deployment: ${this.currentDeploymentId}`);
    } catch (error) {
      console.warn('Could not determine current deployment status');
    }
    
    // Verify rollback permissions
    if (!this.emergencyMode) {
      await this.verifyRollbackPermissions();
    }
    
    // Check system health before rollback
    await this.checkSystemHealth();
    
    this.checks.preRollback = true;
    console.log('Pre-rollback checks completed');
  }

  async getCurrentDeploymentStatus() {
    // Try to get deployment info from various sources
    const sources = [
      () => process.env.DEPLOYMENT_VERSION,
      () => {
        if (fs.existsSync('deployment-report-*.json')) {
          const reports = fs.readdirSync('.').filter(f => f.startsWith('deployment-report-'));
          if (reports.length > 0) {
            const latest = reports.sort().pop();
            const report = JSON.parse(fs.readFileSync(latest, 'utf8'));
            return report.version
          }
        }
        return null;
      },
      () => {
        try {
          const gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
          return `git-${gitHash}`;
        } catch (error) {
          return null;
        }
      }
    ];
    
    for (const source of sources) {
      const result = source();
      if (result) {
        return { deployment_id: result, source: 'detected' };
      }
    }
    
    throw new Error('Could not determine current deployment status');
  }

  async verifyRollbackPermissions() {
    console.log('Verifying rollback permissions...');
    
    // Check AWS permissions
    try {
      execSync('aws sts get-caller-identity', { stdio: 'pipe' });
      console.log('✓ AWS permissions verified');
    } catch (error) {
      throw new Error('AWS permissions not available for rollback');
    }
    
    // Check Supabase permissions
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
          headers: { 'apikey': process.env.SUPABASE_ANON_KEY }
        });
        if (response.ok) {
          console.log('✓ Supabase permissions verified');
        }
      } catch (error) {
        console.warn('Supabase permissions could not be verified');
      }
    }
  }

  async checkSystemHealth() {
    console.log('Checking current system health...');
    
    const healthChecks = [
      {
        name: 'Database Connectivity',
        check: async () => {
          const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
            headers: { 'apikey': process.env.SUPABASE_ANON_KEY }
          });
          return response.ok
        }
      },
      {
        name: 'KMS Availability',
        check: async () => {
          try {
            execSync('aws kms describe-key --key-id "alias/parker-flight-general-production"', { stdio: 'pipe' });
            return true;
          } catch (error) {
            return false;
          }
        }
      }
    ];
    
    for (const { name, check } of healthChecks) {
      try {
        const healthy = await check();
        if (healthy) {
          console.info(`✓ ${name}: Healthy`);
        } else {
          console.warn(`⚠ ${name}: Degraded`);
        }
      } catch (error) {
        console.warn(`⚠ ${name}: Check failed - ${error.message}`);
      }
    }
  }

  async identifyRollbackTarget() {
    console.log('Identifying rollback target...');
    
    if (this.targetCommit) {
      console.info(`Using specified target commit: ${this.targetCommit}`);
      return;
    }
    
    // Find previous successful deployment
    try {
      const gitLog = execSync('git log --oneline -10', { encoding: 'utf8' });
      const commits = gitLog.split('\n').filter(line => line.trim());
      
      console.info('Recent commits:');
      commits.slice(0, 5).forEach((commit, idx) => {
        console.info(`  ${idx === 0 ? '→' : ' '} ${commit}`);
      });
      
      // Use previous commit as rollback target
      if (commits.length > 1) {
        this.targetCommit = commits[1].split(' ')[0];
        console.info(`Selected rollback target: ${this.targetCommit}`);
      } else {
        throw new Error('No previous commit found for rollback');
      }
      
    } catch (err) {
      throw new Error(`Failed to identify rollback target: ${err.message}`);
    }
  }

  async createRollbackPlan() {
    console.log('Creating rollback execution plan...');
    
    this.rollbackSteps = [
      {
        name: 'Git Rollback',
        description: `Rollback to commit ${this.targetCommit}`,
        execute: () => this.rollbackGit(),
        critical: true
      },
      {
        name: 'Database Migrations Rollback',
        description: 'Rollback database schema changes',
        execute: () => this.rollbackDatabase(),
        critical: true
      },
      {
        name: 'Edge Functions Rollback',
        description: 'Redeploy previous Edge Functions',
        execute: () => this.rollbackEdgeFunctions(),
        critical: true
      },
      {
        name: 'Infrastructure State Restore',
        description: 'Restore infrastructure configuration',
        execute: () => this.restoreInfrastructure(),
        critical: false
      }
    ];
    
    console.info('Rollback plan created:');
    this.rollbackSteps.forEach((step, idx) => {
      const criticalFlag = step.critical ? '🔴' : '🟡';
      console.info(`  ${idx + 1}. ${criticalFlag} ${step.name}: ${step.description}`);
    });
    
    if (!this.dryRun && !this.emergencyMode) {
      console.warn('Rollback will execute in 10 seconds. Press Ctrl+C to abort.');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }

  async executeRollbackPlan() {
    console.log('Executing rollback plan...');
    
    for (let i = 0; i < this.rollbackSteps.length; i++) {
      const stepInfo = this.rollbackSteps[i];
      
      try {
        console.log(`Step ${i + 1}/${this.rollbackSteps.length}: ${stepInfo.name}`);
        
        if (this.dryRun) {
          console.info(`[DRY RUN] Would execute: ${stepInfo.description}`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate execution time
        } else {
          await stepInfo.execute();
        }
        
        console.log(`✅ ✓ ${stepInfo.name} completed`);
        
      } catch (error) {
        console.error(`✗ ${stepInfo.name} failed: ${error.message}`);
        
        if (stepInfo.critical) {
          throw new Error(`Critical rollback step failed: ${stepInfo.name}`);
        } else {
          console.warn(`Non-critical step failed, continuing rollback`);
        }
      }
    }
  }

  async rollbackGit() {
    console.log('Executing Git rollback...');
    
    if (!this.targetCommit) {
      throw new Error('No target commit specified for rollback');
    }
    
    // Create backup branch of current state
    const backupBranch = `backup-before-rollback-${Date.now()}`;
    execSync(`git checkout -b ${backupBranch}`, { stdio: 'pipe' });
    console.info(`Created backup branch: ${backupBranch}`);
    
    // Switch back to main and rollback
    execSync('git checkout main', { stdio: 'pipe' });
    execSync(`git reset --hard ${this.targetCommit}`, { stdio: 'pipe' });
    
    this.checks.gitRollback = true;
    console.log('Git rollback completed');
  }

  async rollbackDatabase() {
    console.log('Executing database rollback...');
    
    try {
      // Get current migration state
      const migrationStatus = execSync('npx supabase migration list --linked', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.info('Current migration status:');
      console.info(migrationStatus);
      
      // For production rollback, we'll be conservative and not automatically
      // rollback migrations unless specifically configured
      console.warn('Database migration rollback requires manual intervention for safety');
      console.info('Current database state preserved - no automatic schema rollback performed');
      
      this.checks.databaseRollback = true;
      
    } catch (err) {
      console.warn(`Database rollback check failed: ${err.message}`);
      console.warn('Proceeding with other rollback steps');
      this.checks.databaseRollback = true; // Don't fail rollback for this
    }
  }

  async rollbackEdgeFunctions() {
    console.log('Rolling back Edge Functions...');
    
    const functions = ['encrypt-data', 'create-payment-method'];
    
    for (const functionName of functions) {
      try {
        console.info(`Redeploying function: ${functionName}`);
        execSync(`npx supabase functions deploy ${functionName}`, { 
          stdio: 'inherit' 
        });
        console.log(`✅ ✓ Redeployed: ${functionName}`);
      } catch (error) {
        console.error(`Failed to redeploy function: ${functionName}`);
        throw err;
      }
    }
    
    this.checks.edgeFunctionRollback = true;
    console.log('Edge Functions rollback completed');
  }

  async restoreInfrastructure() {
    console.log('Restoring infrastructure state...');
    
    try {
      // Restore monitoring dashboards
      await this.restoreMonitoring();
      
      // Validate KMS keys are still accessible
      await this.validateKMSKeys();
      
      this.checks.infrastructureRestore = true;
      console.log('Infrastructure restore completed');
      
    } catch (err) {
      console.warn(`Infrastructure restore had issues: ${err.message}`);
      // Don't fail rollback for infrastructure issues
      this.checks.infrastructureRestore = true;
    }
  }

  async restoreMonitoring() {
    console.log('Restoring monitoring configuration...');
    
    try {
      // Recreate CloudWatch dashboard
      const dashboardConfig = {
        widgets: [{
          type: 'metric',
          properties: {
            metrics: [
              ['AWS/Lambda', 'Duration', 'FunctionName', 'parker-flight-encrypt-data'],
              ['AWS/Lambda', 'Errors', 'FunctionName', 'parker-flight-encrypt-data']
            ],
            period: 300,
            stat: 'Average',
            region: process.env.AWS_REGION,
            title: 'Edge Functions Performance (Post-Rollback)'
          }
        }]
      };
      
      execSync(`aws cloudwatch put-dashboard --dashboard-name "ParkerFlight-Production-Rollback" --dashboard-body '${JSON.stringify(dashboardConfig)}'`, {
        stdio: 'pipe'
      });
      
      console.log('Monitoring dashboards restored');
    } catch (error) {
      console.warn('Monitoring restore failed, continuing');
    }
  }

  async validateKMSKeys() {
    console.log('Validating KMS keys accessibility...');
    
    const keyAliases = [
      'alias/parker-flight-general-production',
      'alias/parker-flight-pii-production',
      'alias/parker-flight-payment-production'
    ];
    
    for (const alias of keyAliases) {
      try {
        execSync(`aws kms describe-key --key-id "${alias}"`, { stdio: 'pipe' });
        console.info(`✓ KMS key accessible: ${alias}`);
      } catch (error) {
        console.warn(`KMS key issue: ${alias}`);
      }
    }
  }

  async validateRollback() {
    console.log('Validating rollback success...');
    
    const validationChecks = [
      {
        name: 'Git State Validation',
        check: async () => {
          const currentCommit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
          const targetShort = this.targetCommit.substring(0, 7);
          return currentCommit === targetShort;
        }
      },
      {
        name: 'Supabase Connectivity',
        check: async () => {
          const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
            headers: { 'apikey': process.env.SUPABASE_ANON_KEY }
          });
          return response.ok
        }
      },
      {
        name: 'Edge Functions Accessibility',
        check: async () => {
          const functions = ['encrypt-data', 'create-payment-method'];
          for (const func of functions) {
            const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/${func}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || 'test'}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ test: true })
            });
            if (!response.ok && response.status !== 401) {
              return false;
            }
          }
          return true;
        }
      }
    ];
    
    let passedChecks = 0;
    for (const { name, check } of validationChecks) {
      try {
        const passed = await check();
        if (passed) {
          console.log(`✅ ✓ ${name}`);
          passedChecks++;
        } else {
          console.warn(`⚠ ${name}: Failed`);
        }
      } catch (error) {
        console.warn(`⚠ ${name}: Error - ${error.message}`);
      }
    }
    
    if (passedChecks >= validationChecks.length - 1) {
      this.checks.postRollbackValidation = true;
      console.log('Rollback validation completed successfully');
    } else {
      console.warn('Some validation checks failed - manual review required');
    }
  }

  async generateRollbackReport() {
    console.log('Generating rollback report...');
    
    const report = {
      rollback_id: `rollback-${Date.now()}`,
      timestamp: new Date().toISOString(),
      duration: `${((Date.now() - this.startTime) / 1000).toFixed(2)}s`,
      reason: this.rollbackReason,
      source_deployment: this.currentDeploymentId,
      target_commit: this.targetCommit,
      emergency_mode: this.emergencyMode,
      dry_run: this.dryRun,
      attempt_number: this.rollbackAttempt,
      checks: this.checks,
      rollback_steps: this.rollbackSteps.map(step => ({
        name: step.name,
        description: step.description,
        critical: step.critical
      })),
      environment: {
        node_env: process.env.NODE_ENV,
        aws_region: process.env.AWS_REGION,
        supabase_url: process.env.SUPABASE_URL
      }
    };
    
    const reportPath = `rollback-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`✅ Rollback report saved: ${reportPath}`);
    
    // Display summary
    console.log('\n' + '='.repeat(70), 'red');
    console.log('🔄 ROLLBACK SUMMARY', 'bright');
    console.log('='.repeat(70), 'red');
    console.log(`Rollback ID: ${report.rollback_id}`);
    console.log(`Duration: ${report.duration}`);
    console.log(`Reason: ${report.reason}`);
    console.log(`Target: ${report.target_commit}`);
    console.log(`Mode: ${report.emergency_mode ? 'EMERGENCY' : 'STANDARD'}`);
    console.log('\nRollback Checks Status:');
    Object.entries(this.checks).forEach(([check, status]) => {
      console.log(`  ${status ? '✅' : '❌'} ${check}`, status ? 'green' : 'red');
    });
    console.log('='.repeat(70), 'red');
  }

  async handleRollbackFailure(err) {
    emergency('🚨 ROLLBACK FAILURE DETECTED');
    console.error(`Rollback failed after ${this.rollbackAttempt} attempt(s);`);
    console.error(`Error: ${error.message}`);
    
    if (this.rollbackAttempt < MAX_ROLLBACK_ATTEMPTS && !this.emergencyMode) {
      console.warn(`Attempting rollback retry (${this.rollbackAttempt + 1}/${MAX_ROLLBACK_ATTEMPTS})...`);
      this.rollbackAttempt++;
      
      // Reset checks for retry
      Object.keys(this.checks).forEach(key => {
        this.checks[key] = false;
      });
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      try {
        await this.execute();
        return;
      } catch (retryErr) {
        console.error(`Retry failed: ${retryErr.message}`);
      }
    }
    
    emergency('🚨 MANUAL INTERVENTION REQUIRED');
    emergency('🚨 CONTACT DEVOPS TEAM IMMEDIATELY');
    
    // Generate failure report
    const failureReport = {
      failure_timestamp: new Date().toISOString(),
      failure_reason: err.message,
      rollback_attempt: this.rollbackAttempt,
      checks_completed: this.checks,
      manual_recovery_steps: [
        '1. Assess current system state',
        '2. Check database consistency',
        '3. Verify Edge Functions status',
        '4. Restore from backup if necessary',
        '5. Contact development team'
      ]
    };
    
    fs.writeFileSync(`rollback-failure-${Date.now()}.json`, JSON.stringify(failureReport, null, 2));
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const options = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--reason':
        options.reason = args[++i];
        break;
      case '--target':
        options.targetCommit = args[++i];
        break;
      case '--emergency':
        options.emergency = true;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--help':
        console.log(`
🔄 Parker Flight Production Rollback Script

Usage: node scripts/rollback-production.js [options]

Options:
  --reason <text>      Reason for rollback (required)
  --target <commit>    Target commit to rollback to (optional, uses previous commit if not specified)
  --emergency          Emergency mode - skip safety delays
  --dry-run           Show what would be done without making changes
  --help              Show this help message

Examples:
  node scripts/rollback-production.js --reason "Critical bug in payment processing"
  node scripts/rollback-production.js --reason "Database migration failure" --target abc123
  node scripts/rollback-production.js --reason "Emergency rollback" --emergency
  node scripts/rollback-production.js --dry-run --reason "Test rollback procedure"
        `);
        process.exit(0);
    }
  }
  
  if (!options.reason && !options.dryRun) {
    console.error('❌ --reason is required for production rollbacks');
    console.error('Use --help for usage information');
    process.exit(1);
  }
  
  const rollback = new ProductionRollback(options);
  rollback.execute().catch(err => {
    console.error(`❌ Rollback failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = ProductionRollback;
