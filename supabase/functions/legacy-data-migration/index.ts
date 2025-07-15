import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing Supabase environment variables');
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MigrationStatus {
  phase: string;
  tablesChecked: string[];
  dataFound: Record<string, unknown>;
  migrationPlan: Record<string, unknown>;
  nextSteps: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("🔄 Starting legacy data migration assessment...");
    
    const migrationStatus: MigrationStatus = {
      phase: "Assessment",
      tablesChecked: [],
      dataFound: {},
      migrationPlan: {},
      nextSteps: []
    };
    
    // Step 1: Check for existing tables with encrypted data
    const tablesToCheck = [
      'traveler_profiles',
      'user_profiles', 
      'users',
      'bookings',
      'payments',
      'passenger_details'
    ];
    
    for (const table of tablesToCheck) {
      try {
        // Check if table exists
        const { error: tableError } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (!tableError) {
          migrationStatus.tablesChecked.push(table);
          
          // Check for encrypted columns (common patterns)
          const { data: tableData, error: dataError } = await supabase
            .from(table)
            .select('*')
            .limit(10);
          
          if (!dataError && tableData && tableData.length > 0) {
            const sampleRecord = tableData[0];
            const encryptedFields = Object.keys(sampleRecord).filter(key =>
              key.includes('encrypted') || 
              key.includes('passport') ||
              key.includes('payment') ||
              key.includes('card') ||
              (typeof sampleRecord[key] === 'string' && 
               sampleRecord[key]?.length > 50 && 
               sampleRecord[key]?.match(/^[A-Za-z0-9+/=]+$/)) // Base64 pattern
            );
            
            if (encryptedFields.length > 0) {
              migrationStatus.dataFound[table] = {
                totalRecords: tableData.length,
                encryptedFields,
                sampleData: encryptedFields.reduce((acc, field) => {
                  acc[field] = sampleRecord[field]?.substring(0, 50) + "...";
                  return acc;
                }, {} as Record<string, unknown>)
              };
            }
          }
        }
      } catch {
        // Table doesn't exist, skip
        console.log(`Table ${table} not found, skipping...`);
      }
    }
    
    // Step 2: Check for existing KMS audit logs (shows KMS is being used)
    try {
      const { data: auditLogs, error: auditError } = await supabase
        .from('kms_audit_log')
        .select('operation, success')
        .limit(10);
      
      if (!auditError && auditLogs) {
        migrationStatus.dataFound['kms_usage'] = {
          totalOperations: auditLogs.length,
          recentOperations: auditLogs
        };
      }
    } catch {
      console.log("KMS audit table not accessible");
    }
    
    // Step 3: Create migration plan based on findings
    const hasEncryptedData = Object.keys(migrationStatus.dataFound).length > 0;
    const hasKMSAuditLogs = 'kms_usage' in migrationStatus.dataFound;
    
    if (hasEncryptedData) {
      migrationStatus.migrationPlan = {
        strategy: hasKMSAuditLogs ? "Hybrid Migration" : "Full Migration",
        priority: "High",
        estimatedEffort: "Medium",
        phases: [
          {
            phase: 1,
            name: "Preparation",
            tasks: [
              "Backup existing encrypted data",
              "Verify KMS keys are functional",
              "Create migration tracking tables"
            ]
          },
          {
            phase: 2,
            name: "Gradual Migration",
            tasks: [
              "Migrate data in small batches",
              "Validate each batch",
              "Update encryption version markers"
            ]
          },
          {
            phase: 3,
            name: "Verification",
            tasks: [
              "Verify all data can be decrypted",
              "Remove legacy encryption keys",
              "Update application code"
            ]
          }
        ]
      };
      
      migrationStatus.nextSteps = [
        "Run backup procedures",
        "Test KMS integration thoroughly", 
        "Plan maintenance window",
        "Execute migration in batches",
        "Verify data integrity post-migration"
      ];
    } else {
      migrationStatus.migrationPlan = {
        strategy: "Green Field Implementation",
        priority: "Low",
        estimatedEffort: "Low",
        note: "No existing encrypted data found - KMS can be used for all new data"
      };
      
      migrationStatus.nextSteps = [
        "Configure applications to use KMS for new data",
        "Monitor KMS usage",
        "Set up regular key rotation"
      ];
    }
    
    // Step 4: Generate migration script template if needed
    let migrationScript = null;
    if (hasEncryptedData) {
      migrationScript = `
-- Legacy to KMS Migration Script Template
-- Generated: ${new Date().toISOString()}

-- Step 1: Create backup tables
${Object.keys(migrationStatus.dataFound)
  .filter(table => table !== 'kms_usage')
  .map(table => `CREATE TABLE ${table}_backup AS SELECT * FROM ${table};`)
  .join('\n')}

-- Step 2: Add encryption version column if not exists
${Object.keys(migrationStatus.dataFound)
  .filter(table => table !== 'kms_usage')
  .map(table => `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS encryption_version INTEGER DEFAULT 1;`)
  .join('\n')}

-- Step 3: Create migration status tracking
CREATE TABLE IF NOT EXISTS migration_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  total_records INTEGER NOT NULL,
  migrated_records INTEGER DEFAULT 0,
  failed_records INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_details TEXT
);

-- Step 4: Batch migration function (to be called from Edge Function)
-- This should be implemented in an Edge Function that:
-- 1. Reads legacy encrypted data
-- 2. Decrypts using old method
-- 3. Re-encrypts using KMS
-- 4. Updates records with new encrypted data and version=2
`;
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Legacy data migration assessment complete",
        timestamp: new Date().toISOString(),
        migrationStatus,
        migrationScript,
        recommendations: hasEncryptedData ? [
          "🔄 Legacy encrypted data found - migration required",
          "📊 Review the migration plan carefully",
          "🔒 Test KMS integration before migration",
          "💾 Always backup data before migration",
          "📈 Monitor migration progress closely"
        ] : [
          "✅ No legacy encrypted data found",
          "🚀 Ready for KMS implementation",
          "🔒 Configure new applications to use KMS",
          "📊 Set up monitoring and alerts"
        ]
      }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Migration assessment error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 500
      }
    );
  }
});
