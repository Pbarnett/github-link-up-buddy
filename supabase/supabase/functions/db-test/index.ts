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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("🔍 Testing database tables...");
    
    // Test if KMS tables exist
    const { data: auditTable, error: auditError } = await supabase
      .from('kms_audit_log')
      .select('count')
      .limit(1);
    
    const { data: keyRotationTable, error: keyRotationError } = await supabase
      .from('kms_key_rotation_history')
      .select('count')
      .limit(1);
    
    const { data: encryptionMetaTable, error: encryptionMetaError } = await supabase
      .from('kms_encryption_metadata')
      .select('count')
      .limit(1);
    
    const results = {
      kms_audit_log: auditError ? `Error: ${auditError.message}` : "✅ Exists",
      kms_key_rotation_history: keyRotationError ? `Error: ${keyRotationError.message}` : "✅ Exists", 
      kms_encryption_metadata: encryptionMetaError ? `Error: ${encryptionMetaError.message}` : "✅ Exists"
    };
    
    const allTablesExist = !auditError && !keyRotationError && !encryptionMetaError;
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Database table check",
        timestamp: new Date().toISOString(),
        tables: results,
        allKMSTablesExist: allTablesExist
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
    console.error("Database test error:", error);
    
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
