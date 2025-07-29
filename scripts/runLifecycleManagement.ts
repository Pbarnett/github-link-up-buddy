#!/usr/bin/env ts-node
/**
 * Customer Lifecycle Management Operations Script
 * 
 * This script provides command-line operations for customer lifecycle management:
 * - Run lifecycle process manually
 * - Check health status
 * - View statistics
 * - Set up scheduling
 */

interface LifecycleConfig {
  dryRun?: boolean;
  batchSize?: number;
  inactiveThresholdDays?: number;
  anonymizationDelayDays?: number;
  deletionDelayDays?: number;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const LIFECYCLE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/customer-lifecycle-scheduler`;

async function callLifecycleFunction(action: string, config?: LifecycleConfig) {
  const url = `${LIFECYCLE_FUNCTION_URL}?action=${action}`;
  
  const options: RequestInit = {
    method: action === 'run' ? 'POST' : 'GET',
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  if (action === 'run' && config) {
    options.body = JSON.stringify(config);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error || 'Unknown error'}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error calling lifecycle function:`, error);
    throw error;
  }
}

async function runLifecycleProcess(options: LifecycleConfig = {}) {
  console.log('🔄 Running customer lifecycle process...');
  
  const config = {
    dryRun: options.dryRun ?? true,
    batchSize: options.batchSize ?? 10,
    inactiveThresholdDays: options.inactiveThresholdDays ?? 365,
    anonymizationDelayDays: options.anonymizationDelayDays ?? 1095,
    deletionDelayDays: options.deletionDelayDays ?? 2555,
    ...options,
  };
  
  console.log('Configuration:', config);
  
  const result = await callLifecycleFunction('run', config);
  
  console.log('\n📊 Lifecycle Process Results:');
  console.log(`✅ Success: ${result.success}`);
  console.log(`📋 Identified: ${result.results.identified} inactive customers`);
  console.log(`🔒 Anonymized: ${result.results.anonymized} customers`);
  console.log(`🗑️  Deleted: ${result.results.deleted} customers`);
  console.log(`❌ Errors: ${result.results.errors}`);
  
  if (result.results.processedCustomers?.length > 0) {
    console.log('\n🎯 Processed Customers:');
    result.results.processedCustomers.forEach((customer: any) => {
      console.log(`  - ${customer.customer_id}: ${customer.action_taken} (${customer.days_inactive} days inactive)`);
    });
  }
  
  console.log(`\n⏰ Completed at: ${result.timestamp}`);
  
  return result;
}

async function checkHealth() {
  console.log('🩺 Checking lifecycle scheduler health...');
  
  const result = await callLifecycleFunction('health');
  
  console.log(`✅ Status: ${result.success ? 'Healthy' : 'Unhealthy'}`);
  console.log(`📝 Message: ${result.message}`);
  console.log(`⏰ Checked at: ${result.timestamp}`);
  
  return result;
}

async function viewStats() {
  console.log('📈 Fetching lifecycle statistics...');
  
  const result = await callLifecycleFunction('stats');
  
  if (result.success) {
    console.log('\n📊 Lifecycle Statistics:');
    console.log(`📋 Total audit records: ${result.stats.total_audit_records}`);
    console.log(`🔍 Identified inactive: ${result.stats.identified_inactive}`);
    console.log(`🔒 Anonymized: ${result.stats.anonymized}`);
    console.log(`🗑️  Deleted: ${result.stats.deleted}`);
    console.log(`📂 Archived customers: ${result.stats.archived_customers}`);
    console.log(`⏰ Last updated: ${result.stats.last_updated}`);
  } else {
    console.error('❌ Failed to fetch stats:', result.error);
  }
  
  return result;
}

function printUsage() {
  console.log(`
🔄 Customer Lifecycle Management Tool

Usage: ts-node scripts/runLifecycleManagement.ts [command] [options]

Commands:
  run [--production] [--batch-size=N]  Run lifecycle process
  health                               Check scheduler health
  stats                                View statistics
  help                                 Show this help

Options:
  --production                         Run in production mode (not dry-run)
  --batch-size=N                       Process N customers at a time (default: 10)
  --inactive-days=N                    Mark inactive after N days (default: 365)
  --anonymize-days=N                   Anonymize after N days (default: 1095)
  --delete-days=N                      Delete after N days (default: 2555)

Examples:
  # Dry run with default settings
  ts-node scripts/runLifecycleManagement.ts run
  
  # Production run with custom batch size
  ts-node scripts/runLifecycleManagement.ts run --production --batch-size=50
  
  # Check health
  ts-node scripts/runLifecycleManagement.ts health
  
  # View statistics
  ts-node scripts/runLifecycleManagement.ts stats
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  // Parse options
  const options: LifecycleConfig = {
    dryRun: !args.includes('--production'),
  };
  
  args.forEach(arg => {
    if (arg.startsWith('--batch-size=')) {
      options.batchSize = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--inactive-days=')) {
      options.inactiveThresholdDays = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--anonymize-days=')) {
      options.anonymizationDelayDays = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--delete-days=')) {
      options.deletionDelayDays = parseInt(arg.split('=')[1]);
    }
  });
  
  try {
    switch (command) {
      case 'run':
        await runLifecycleProcess(options);
        break;
        
      case 'health':
        await checkHealth();
        break;
        
      case 'stats':
        await viewStats();
        break;
        
      case 'help':
      case '--help':
      case '-h':
        printUsage();
        break;
        
      default:
        console.error('❌ Unknown command:', command);
        printUsage();
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Operation failed:', error);
    process.exit(1);
  }
}

// Self-executing
if (require.main === module) {
  main();
}

export { runLifecycleProcess, checkHealth, viewStats };

