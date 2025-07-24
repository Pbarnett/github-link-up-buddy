import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { 
  encryptData, 
  encryptPII, 
  encryptPaymentData,
  validateKMSConfig,
  safeKMSOperation,
  createKMSAuditLog,
  type KMSKeyType 
} from "../shared/kms.ts";

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
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// Data type to KMS key mapping
const DATA_TYPE_TO_KEY: Record<string, KMSKeyType> = {
  'general': 'GENERAL',
  'pii': 'PII',
  'payment': 'PAYMENT',
  'profile': 'PII',
  'user': 'PII',
  'card': 'PAYMENT',
  'billing': 'PAYMENT'
};

// Determine appropriate key type based on data type or content analysis
function determineKeyType(dataType?: string, data?: string): KMSKeyType {
  if (dataType && DATA_TYPE_TO_KEY[dataType.toLowerCase()]) {
    return DATA_TYPE_TO_KEY[dataType.toLowerCase()];
  }
  
  // Content-based analysis for automatic classification
  if (data) {
    const lowerData = data.toLowerCase();
    
    // PII patterns
    if (lowerData.includes('@') || 
        lowerData.includes('phone') || 
        lowerData.includes('email') ||
        lowerData.includes('name') ||
        lowerData.includes('passport')) {
      return 'PII';
    }
    
    // Payment patterns
    if (lowerData.includes('card') ||
        lowerData.includes('payment') ||
        lowerData.includes('billing') ||
        /\d{4}[\s-]*\d{4}[\s-]*\d{4}[\s-]*\d{4}/.test(lowerData)) {
      return 'PAYMENT';
    }
  }
  
  return 'GENERAL';
}

// Log audit entry to database
async function logAuditEntry(
  operation: string, 
  success: boolean, 
  userId: string,
  keyType: KMSKeyType,
  error?: string,
  metadata?: Record<string, unknown>
) {
  try {
    const auditLog = createKMSAuditLog(operation, success, keyType, {
      userId,
      error,
      ...metadata
    });
    
    await supabase.from('kms_audit_log').insert({
      operation: auditLog.operation,
      success: auditLog.success,
      key_type: auditLog.keyType,
      key_alias: auditLog.keyAlias,
      user_id: userId,
      error_message: error,
      metadata: auditLog.metadata,
      timestamp: auditLog.timestamp,
      region: auditLog.region,
      environment: auditLog.environment
    });
  } catch (auditError) {
    console.error('Failed to log KMS audit entry:', auditError);
    // Don't throw here - audit logging failure shouldn't break the main operation
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Validate KMS configuration first
    if (!validateKMSConfig()) {
      return new Response(
        JSON.stringify({ 
          error: 'KMS service not properly configured',
          details: 'Missing required AWS credentials or KMS keys'
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const jwt = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { data, dataType, keyId } = body;
    
    if (!data) {
      return new Response(
        JSON.stringify({ error: 'Missing data to encrypt' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine the appropriate key type
    let keyType: KMSKeyType;
    if (keyId && keyId !== 'test-key-id') {
      // Custom key ID provided - assume GENERAL for safety
      keyType = 'GENERAL';
    } else {
      keyType = determineKeyType(dataType, typeof data === 'string' ? data : JSON.stringify(data));
    }

    // Perform encryption with retry logic and audit logging
    try {
      const encryptedData = await safeKMSOperation(
        async () => {
          if (keyType === 'PII') {
            return await encryptPII(data);
          } else if (keyType === 'PAYMENT') {
            return await encryptPaymentData(data);
          } else {
            return await encryptData(data, keyType);
          }
        },
        'encrypt',
        3 // max retries
      );
      
      // Log successful encryption
      await logAuditEntry(
        'encrypt', 
        true, 
        user.id,
        keyType,
        undefined,
        {
          dataType,
          dataSize: typeof data === 'string' ? data.length : JSON.stringify(data).length,
          keyType,
          requestId: crypto.randomUUID()
        }
      );
      
      return new Response(
        JSON.stringify({
          success: true,
          encryptedData,
          keyType,
          dataType: dataType || 'auto-detected',
          timestamp: new Date().toISOString(),
          metadata: {
            algorithm: 'AES-256-GCM',
            version: '2.0'
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (encryptError) {
      console.error('Encryption error:', encryptError);
      
      // Log failed encryption
      await logAuditEntry(
        'encrypt', 
        false, 
        user.id,
        keyType,
        encryptError.message,
        {
          dataType,
          keyType,
          errorCategory: encryptError.name
        }
      );
      
      return new Response(
        JSON.stringify({ 
          error: 'Encryption failed', 
          details: encryptError.message,
          keyType,
          retryable: encryptError.name === 'ThrottlingException' || encryptError.name === 'NetworkError'
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error('General error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
