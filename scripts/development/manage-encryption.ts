#!/usr/bin/env deno run --allow-net --allow-env

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");
const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ Missing required environment variables:");
  console.error("   SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL, ADMIN_PASSWORD");
  Deno.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface MigrationStatus {
  profiles: { legacy: number; kms: number };
  payment_methods: { legacy: number; kms: number };
  total_legacy: number;
  total_kms: number;
  migration_complete: boolean;
}

interface RotationStatus {
  rotation_history: Array<{
    operation: string;
    timestamp: string;
    success: boolean;
  }>;
  current_pii_key_version: number | null;
  current_payment_key_version: number | null;
  last_rotation: string | null;
  rotation_available: boolean;
}

async function authenticate(): Promise<string> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (error || !data.session) {
    throw new Error(`Authentication failed: ${error?.message}`);
  }

  return data.session.access_token;
}

async function makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = await authenticate();
  
  const defaultHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${SUPABASE_URL}/functions/v1/${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  return response;
}

async function getMigrationStatus(): Promise<MigrationStatus> {
  console.log("🔍 Checking migration status...");
  
  const response = await makeAuthenticatedRequest('migrate-legacy-data?action=status');
  
  if (!response.ok) {
    throw new Error(`Failed to get migration status: ${response.statusText}`);
  }

  return await response.json();
}

async function runMigration(batchSize: number = 10, entityType: string = 'all'): Promise<{
  migratedProfiles: number;
  migratedPaymentMethods: number;
  totalTime: number;
  errors: string[];
}> {
  console.log(`🚀 Starting migration (batch size: ${batchSize}, entity type: ${entityType})...`);
  
  const response = await makeAuthenticatedRequest('migrate-legacy-data?action=migrate', {
    method: 'POST',
    body: JSON.stringify({
      batch_size: batchSize,
      entity_type: entityType
    })
  });

  if (!response.ok) {
    throw new Error(`Migration failed: ${response.statusText}`);
  }

  return await response.json();
}

async function getRotationStatus(): Promise<RotationStatus> {
  console.log("🔍 Checking key rotation status...");
  
  const response = await makeAuthenticatedRequest('key-rotation?action=status');
  
  if (!response.ok) {
    throw new Error(`Failed to get rotation status: ${response.statusText}`);
  }

  return await response.json();
}

async function rotateKey(keyType: 'PII' | 'PAYMENT', batchSize: number = 50): Promise<{
  reencryptedRecords: number;
  totalTime: number;
  message?: string;
}> {
  console.log(`🔄 Starting ${keyType} key rotation (batch size: ${batchSize})...`);
  
  const response = await makeAuthenticatedRequest('key-rotation?action=rotate', {
    method: 'POST',
    body: JSON.stringify({
      key_type: keyType,
      batch_size: batchSize
    })
  });

  if (!response.ok) {
    throw new Error(`Key rotation failed: ${response.statusText}`);
  }

  return await response.json();
}

async function scheduleKeyRotation(keyType: 'PII' | 'PAYMENT', intervalDays: number = 90): Promise<{
  message: string;
  next_rotation: string;
}> {
  console.log(`📅 Scheduling ${keyType} key rotation (every ${intervalDays} days)...`);
  
  const response = await makeAuthenticatedRequest('key-rotation?action=schedule', {
    method: 'POST',
    body: JSON.stringify({
      key_type: keyType,
      schedule_type: 'automatic',
      interval_days: intervalDays
    })
  });

  if (!response.ok) {
    throw new Error(`Key rotation scheduling failed: ${response.statusText}`);
  }

  return await response.json();
}

function printMigrationStatus(status: MigrationStatus) {
  console.log("\n📊 Migration Status:");
  console.log("─".repeat(50));
  console.log(`Profiles: ${status.profiles.legacy} legacy → ${status.profiles.kms} KMS`);
  console.log(`Payment Methods: ${status.payment_methods.legacy} legacy → ${status.payment_methods.kms} KMS`);
  console.log(`Total Legacy: ${status.total_legacy}`);
  console.log(`Total KMS: ${status.total_kms}`);
  console.log(`Migration Complete: ${status.migration_complete ? '✅' : '❌'}`);
  console.log("─".repeat(50));
}

function printRotationStatus(status: RotationStatus) {
  console.log("\n🔑 Key Rotation Status:");
  console.log("─".repeat(50));
  console.log(`PII Key Version: ${status.current_pii_key_version || 'Not set'}`);
  console.log(`Payment Key Version: ${status.current_payment_key_version || 'Not set'}`);
  console.log(`Last Rotation: ${status.last_rotation ? new Date(status.last_rotation).toLocaleString() : 'Never'}`);
  console.log(`Rotation Available: ${status.rotation_available ? '✅' : '❌'}`);
  
  if (status.rotation_history.length > 0) {
    console.log("\nRecent Rotations:");
    status.rotation_history.slice(0, 3).forEach((rotation) => {
      console.log(`  • ${rotation.operation} - ${new Date(rotation.timestamp).toLocaleString()} - ${rotation.success ? '✅' : '❌'}`);
    });
  }
  console.log("─".repeat(50));
}

async function runFullMigration(): Promise<void> {
  console.log("🎯 Starting full legacy data migration...\n");

  // Check initial status
  const initialStatus = await getMigrationStatus();
  printMigrationStatus(initialStatus);

  if (initialStatus.migration_complete) {
    console.log("✅ Migration already complete!");
    return;
  }

  // Run migration in batches until complete
  let totalMigrated = 0;
  let batchCount = 0;
  
  while (true) {
    batchCount++;
    console.log(`\n📦 Running migration batch ${batchCount}...`);
    
    const result = await runMigration(10, 'all');
    
    console.log(`✅ Batch ${batchCount} complete:`);
    console.log(`   Profiles migrated: ${result.migratedProfiles}`);
    console.log(`   Payment methods migrated: ${result.migratedPaymentMethods}`);
    console.log(`   Time: ${result.totalTime}ms`);
    
    if (result.errors.length > 0) {
      console.log(`   ⚠️  Errors: ${result.errors.length}`);
      result.errors.forEach((error: string) => console.log(`     • ${error}`));
    }

    totalMigrated += result.migratedProfiles + result.migratedPaymentMethods;
    
    // Check if migration is complete
    const currentStatus = await getMigrationStatus();
    if (currentStatus.migration_complete) {
      console.log(`\n🎉 Migration complete! Total records migrated: ${totalMigrated}`);
      printMigrationStatus(currentStatus);
      break;
    }
    
    // If no records were migrated in this batch, we're done
    if (result.migratedProfiles === 0 && result.migratedPaymentMethods === 0) {
      console.log("\n✅ No more records to migrate.");
      break;
    }
    
    // Brief pause between batches
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function setupKeyRotation(): Promise<void> {
  console.log("🔐 Setting up automated key rotation...\n");

  // Check current rotation status
  const status = await getRotationStatus();
  printRotationStatus(status);

  // Schedule automatic rotation for both key types
  console.log("\n📅 Scheduling automatic key rotations...");
  
  const piiSchedule = await scheduleKeyRotation('PII', 90);
  console.log(`✅ PII key rotation scheduled: ${piiSchedule.message}`);
  console.log(`   Next rotation: ${new Date(piiSchedule.next_rotation).toLocaleString()}`);

  const paymentSchedule = await scheduleKeyRotation('PAYMENT', 90);
  console.log(`✅ Payment key rotation scheduled: ${paymentSchedule.message}`);
  console.log(`   Next rotation: ${new Date(paymentSchedule.next_rotation).toLocaleString()}`);

  console.log("\n🔄 Performing initial key rotation to establish baseline...");
  
  // Perform initial rotation for both key types
  const piiRotation = await rotateKey('PII', 25);
  console.log(`✅ PII key rotation complete:`);
  console.log(`   Records re-encrypted: ${piiRotation.reencryptedRecords}`);
  console.log(`   Time: ${piiRotation.totalTime}ms`);
  
  const paymentRotation = await rotateKey('PAYMENT', 25);
  console.log(`✅ Payment key rotation complete:`);
  console.log(`   Records re-encrypted: ${paymentRotation.reencryptedRecords}`);
  console.log(`   Time: ${paymentRotation.totalTime}ms`);

  console.log("\n🎉 Key rotation setup complete!");
}

async function main() {
  const args = Deno.args;
  const command = args[0];

  console.log("🔒 GitHub Link-Up Buddy - Encryption Management\n");

  try {
    switch (command) {
      case 'migration-status': {
        const migrationStatus = await getMigrationStatus();
        printMigrationStatus(migrationStatus);
        break;
      }

      case 'migrate': {
        const batchSize = parseInt(args[1]) || 10;
        const entityType = args[2] || 'all';
        const migrationResult = await runMigration(batchSize, entityType);
        console.log("✅ Migration batch complete:", migrationResult);
        break;
      }

      case 'migrate-all': {
        await runFullMigration();
        break;
      }

      case 'rotation-status': {
        const rotationStatus = await getRotationStatus();
        printRotationStatus(rotationStatus);
        break;
      }

      case 'rotate': {
        const keyType = (args[1] as 'PII' | 'PAYMENT') || 'PII';
        const rotationBatchSize = parseInt(args[2]) || 50;
        const rotationResult = await rotateKey(keyType, rotationBatchSize);
        console.log(`✅ ${keyType} key rotation complete:`, rotationResult);
        break;
      }

      case 'schedule-rotation': {
        const scheduleKeyType = (args[1] as 'PII' | 'PAYMENT') || 'PII';
        const intervalDays = parseInt(args[2]) || 90;
        const scheduleResult = await scheduleKeyRotation(scheduleKeyType, intervalDays);
        console.log("✅ Key rotation scheduled:", scheduleResult);
        break;
      }

      case 'setup-rotation': {
        await setupKeyRotation();
        break;
      }

      case 'full-setup': {
        console.log("🚀 Running full encryption setup (migration + key rotation)...\n");
        await runFullMigration();
        console.log("\n" + "=".repeat(60) + "\n");
        await setupKeyRotation();
        console.log("\n🎉 Full encryption setup complete!");
        break;
      }

      default:
        console.log("Usage: deno run --allow-net --allow-env manage-encryption.ts <command> [options]");
        console.log("\nCommands:");
        console.log("  migration-status              - Check migration status");
        console.log("  migrate [batch_size] [type]   - Run migration batch");
        console.log("  migrate-all                   - Run complete migration");
        console.log("  rotation-status               - Check key rotation status");
        console.log("  rotate [PII|PAYMENT] [batch]  - Rotate encryption keys");
        console.log("  schedule-rotation [type] [days] - Schedule automatic rotation");
        console.log("  setup-rotation                - Setup automated key rotation");
        console.log("  full-setup                    - Run complete setup (migration + rotation)");
        console.log("\nExamples:");
        console.log("  deno run --allow-net --allow-env manage-encryption.ts migration-status");
        console.log("  deno run --allow-net --allow-env manage-encryption.ts migrate-all");
        console.log("  deno run --allow-net --allow-env manage-encryption.ts rotate PII 25");
        console.log("  deno run --allow-net --allow-env manage-encryption.ts full-setup");
        Deno.exit(1);
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
