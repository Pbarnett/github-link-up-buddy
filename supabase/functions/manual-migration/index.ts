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

// KMS migration SQL broken into chunks
const kmsAuditTableSQL = `
-- Create KMS audit log table for tracking all encryption operations
CREATE TABLE IF NOT EXISTS kms_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation TEXT NOT NULL CHECK (operation IN ('encrypt', 'decrypt', 'health_check')),
  key_id TEXT NOT NULL,                    -- AWS KMS key ID used
  success BOOLEAN NOT NULL,                -- Whether the operation succeeded
  error_message TEXT,                      -- Error details if operation failed
  user_id UUID,                           -- User who performed the operation
  ip_address INET,                        -- IP address of the request
  timestamp TIMESTAMPTZ DEFAULT NOW()     -- When the operation occurred
);

-- Create performance indexes for KMS audit log
CREATE INDEX IF NOT EXISTS idx_kms_audit_timestamp ON kms_audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_kms_audit_user_id ON kms_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_kms_audit_operation ON kms_audit_log(operation);
CREATE INDEX IF NOT EXISTS idx_kms_audit_success ON kms_audit_log(success);

-- Enable RLS on KMS audit table (only service role can read)
ALTER TABLE kms_audit_log ENABLE ROW LEVEL SECURITY;
`;

const kmsRotationTableSQL = `
-- Create KMS key rotation history table
CREATE TABLE IF NOT EXISTS kms_key_rotation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  old_key_id TEXT NOT NULL,
  new_key_id TEXT NOT NULL,
  rotation_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  records_migrated INTEGER DEFAULT 0,
  total_records INTEGER DEFAULT 0,
  error_details TEXT,
  created_by UUID
);

-- Create index for rotation queries
CREATE INDEX IF NOT EXISTS idx_kms_rotation_date ON kms_key_rotation_history(rotation_date);
CREATE INDEX IF NOT EXISTS idx_kms_rotation_status ON kms_key_rotation_history(status);
`;

const kmsMetadataTableSQL = `
-- Create KMS encryption metadata table
CREATE TABLE IF NOT EXISTS kms_encryption_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  column_name TEXT NOT NULL,
  key_id TEXT NOT NULL,
  algorithm TEXT NOT NULL DEFAULT 'AES_256',
  encryption_context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(table_name, column_name)
);

-- Create indexes for metadata queries
CREATE INDEX IF NOT EXISTS idx_kms_metadata_table ON kms_encryption_metadata(table_name);
CREATE INDEX IF NOT EXISTS idx_kms_metadata_key_id ON kms_encryption_metadata(key_id);
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("🔧 Manually executing KMS migration...");
    
    const results = [];
    
    // Execute KMS audit table creation
    try {
      await supabase.rpc('exec_sql', { sql: kmsAuditTableSQL });
      results.push({ table: 'kms_audit_log', status: '✅ Created' });
    } catch (error) {
      results.push({ table: 'kms_audit_log', status: `❌ Error: ${error.message}` });
    }
    
    // Execute KMS rotation table creation
    try {
      await supabase.rpc('exec_sql', { sql: kmsRotationTableSQL });
      results.push({ table: 'kms_key_rotation_history', status: '✅ Created' });
    } catch (error) {
      results.push({ table: 'kms_key_rotation_history', status: `❌ Error: ${error.message}` });
    }
    
    // Execute KMS metadata table creation
    try {
      await supabase.rpc('exec_sql', { sql: kmsMetadataTableSQL });
      results.push({ table: 'kms_encryption_metadata', status: '✅ Created' });
    } catch (error) {
      results.push({ table: 'kms_encryption_metadata', status: `❌ Error: ${error.message}` });
    }
    
    // Test that tables were created
    const { error: auditError } = await supabase
      .from('kms_audit_log')
      .select('count')
      .limit(1);
    
    const { error: rotationError } = await supabase
      .from('kms_key_rotation_history')
      .select('count')
      .limit(1);
    
    const { error: metadataError } = await supabase
      .from('kms_encryption_metadata')
      .select('count')
      .limit(1);
    
    const verification = {
      kms_audit_log: auditError ? `Error: ${auditError.message}` : "✅ Verified",
      kms_key_rotation_history: rotationError ? `Error: ${rotationError.message}` : "✅ Verified", 
      kms_encryption_metadata: metadataError ? `Error: ${metadataError.message}` : "✅ Verified"
    };
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Manual KMS migration execution",
        timestamp: new Date().toISOString(),
        results,
        verification,
        allTablesCreated: !auditError && !rotationError && !metadataError
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
    console.error("Manual migration error:", error);
    
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
