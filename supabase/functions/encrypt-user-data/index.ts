import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { KMSClient, EncryptCommand, DecryptCommand } from "https://esm.sh/@aws-sdk/client-kms@3.454.0";

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

// Initialize KMS client
let kmsClient: KMSClient | null = null;

function getKMSClient() {
  if (!kmsClient) {
    const awsRegion = Deno.env.get("AWS_REGION")?.trim();
    const awsAccessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID")?.trim();
    const awsSecretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY")?.trim();
    
    if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey) {
      throw new Error("Missing AWS credentials");
    }
    
    kmsClient = new KMSClient({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });
  }
  return kmsClient;
}

// Get appropriate KMS key based on data type
function getKeyForDataType(dataType: string): string {
  const keyMap = {
    'general': Deno.env.get("KMS_GENERAL_KEY_ID")?.trim(),
    'pii': Deno.env.get("KMS_PII_KEY_ID")?.trim(),
    'payment': Deno.env.get("KMS_PAYMENT_KEY_ID")?.trim(),
  };
  
  const key = keyMap[dataType.toLowerCase()];
  if (!key) {
    throw new Error(`Unknown data type: ${dataType}`);
  }
  return key;
}

// Encrypt data using appropriate KMS key
async function encryptData(plaintext: string, dataType: string): Promise<string> {
  const client = getKMSClient();
  const keyId = getKeyForDataType(dataType);
  
  const command = new EncryptCommand({
    KeyId: keyId,
    Plaintext: new TextEncoder().encode(plaintext),
  });
  
  const response = await client.send(command);
  if (!response.CiphertextBlob) {
    throw new Error("Encryption failed - no ciphertext returned");
  }
  
  // Return base64 encoded ciphertext with metadata
  const ciphertext = btoa(String.fromCharCode(...new Uint8Array(response.CiphertextBlob)));
  return JSON.stringify({
    ciphertext,
    keyId: response.KeyId,
    algorithm: "AES_256",
    version: "2", // KMS version
    timestamp: new Date().toISOString()
  });
}

// Decrypt data
async function decryptData(encryptedData: string): Promise<string> {
  const client = getKMSClient();
  const data = JSON.parse(encryptedData);
  
  // Convert base64 back to Uint8Array
  const ciphertextBlob = new Uint8Array(
    atob(data.ciphertext).split('').map(char => char.charCodeAt(0))
  );
  
  const command = new DecryptCommand({
    CiphertextBlob: ciphertextBlob,
  });
  
  const response = await client.send(command);
  if (!response.Plaintext) {
    throw new Error("Decryption failed - no plaintext returned");
  }
  
  return new TextDecoder().decode(response.Plaintext);
}

// Log audit entry
async function logAuditEntry(operation: string, keyId: string, success: boolean, userId?: string, error?: string) {
  try {
    await supabase.from('kms_audit_log').insert({
      operation,
      key_id: keyId,
      success,
      error_message: error,
      user_id: userId,
      ip_address: '127.0.0.1', // Edge function IP
      timestamp: new Date().toISOString()
    });
  } catch (auditError) {
    console.error('Failed to log audit entry:', auditError);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    
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

    switch (path) {
      case 'encrypt-profile': {
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const body = await req.json();
        const { profileData } = body;
        
        if (!profileData) {
          return new Response(
            JSON.stringify({ error: 'Missing profile data' }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        try {
          // Encrypt different profile fields with appropriate keys
          const encryptedProfile = {
            id: profileData.id, // Never encrypt IDs
            user_id: profileData.user_id, // Never encrypt foreign keys
            email: profileData.email ? await encryptData(profileData.email, 'pii') : null,
            phone: profileData.phone ? await encryptData(profileData.phone, 'pii') : null,
            first_name: profileData.first_name ? await encryptData(profileData.first_name, 'pii') : null,
            last_name: profileData.last_name ? await encryptData(profileData.last_name, 'pii') : null,
            passport_number: profileData.passport_number ? await encryptData(profileData.passport_number, 'pii') : null,
            preferences: profileData.preferences ? await encryptData(JSON.stringify(profileData.preferences), 'general') : null,
            encryption_version: 2, // KMS version
            created_at: profileData.created_at,
            updated_at: new Date().toISOString()
          };

          // Log successful encryption
          await logAuditEntry('encrypt', 'profile_data', true, user.id);

          return new Response(
            JSON.stringify({
              success: true,
              encryptedProfile,
              message: 'Profile data encrypted successfully',
              fieldsEncrypted: Object.keys(encryptedProfile).filter(k => 
                encryptedProfile[k] && typeof encryptedProfile[k] === 'string' && 
                encryptedProfile[k].includes('ciphertext')
              ).length
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          await logAuditEntry('encrypt', 'profile_data', false, user.id, error.message);
          
          return new Response(
            JSON.stringify({ error: 'Encryption failed', details: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'decrypt-profile': {
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const body = await req.json();
        const { encryptedProfile } = body;
        
        if (!encryptedProfile) {
          return new Response(
            JSON.stringify({ error: 'Missing encrypted profile data' }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        try {
          // Decrypt profile fields
          const decryptedProfile = {
            id: encryptedProfile.id,
            user_id: encryptedProfile.user_id,
            email: encryptedProfile.email ? await decryptData(encryptedProfile.email) : null,
            phone: encryptedProfile.phone ? await decryptData(encryptedProfile.phone) : null,
            first_name: encryptedProfile.first_name ? await decryptData(encryptedProfile.first_name) : null,
            last_name: encryptedProfile.last_name ? await decryptData(encryptedProfile.last_name) : null,
            passport_number: encryptedProfile.passport_number ? await decryptData(encryptedProfile.passport_number) : null,
            preferences: encryptedProfile.preferences ? JSON.parse(await decryptData(encryptedProfile.preferences)) : null,
            encryption_version: encryptedProfile.encryption_version,
            created_at: encryptedProfile.created_at,
            updated_at: encryptedProfile.updated_at
          };

          // Log successful decryption
          await logAuditEntry('decrypt', 'profile_data', true, user.id);

          return new Response(
            JSON.stringify({
              success: true,
              decryptedProfile,
              message: 'Profile data decrypted successfully'
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          await logAuditEntry('decrypt', 'profile_data', false, user.id, error.message);
          
          return new Response(
            JSON.stringify({ error: 'Decryption failed', details: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'encrypt-data': {
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const body = await req.json();
        const { data, dataType } = body;
        
        if (!data || !dataType) {
          return new Response(
            JSON.stringify({ error: 'Missing data or dataType' }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        try {
          const keyId = getKeyForDataType(dataType);
          const encryptedData = await encryptData(data, dataType);
          
          await logAuditEntry('encrypt', keyId, true, user.id);

          return new Response(
            JSON.stringify({
              success: true,
              encryptedData,
              dataType,
              message: 'Data encrypted successfully'
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          const keyId = getKeyForDataType(dataType);
          await logAuditEntry('encrypt', keyId, false, user.id, error.message);
          
          return new Response(
            JSON.stringify({ error: 'Encryption failed', details: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'health': {
        const health = {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          kmsConnected: true,
          version: '2.0'
        };

        return new Response(
          JSON.stringify(health),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ 
            error: 'Not found',
            availableEndpoints: ['encrypt-profile', 'decrypt-profile', 'encrypt-data', 'health']
          }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

  } catch (error) {
    console.error('User data encryption error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
