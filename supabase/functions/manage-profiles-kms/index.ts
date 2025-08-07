import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { encryptData, decryptData } from "../_shared/kms.ts";

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
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS'
};

async function logKMSAudit(operation: string, keyType: string, success: boolean, userId?: string, error?: string) {
  try {
    await supabase.from('kms_audit_log').insert({
      operation,
      key_id: keyType,
      success,
      error_message: error,
      user_id: userId,
      ip_address: '127.0.0.1', // Edge function IP
      timestamp: new Date().toISOString()
    });
  } catch (auditError) {
    console.error('Failed to log KMS audit:', auditError);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'health';

    // Health endpoint - no authentication required
    if (action === 'health') {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          kms_enabled: true,
          version: '2.0',
          function: 'manage-profiles-kms'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Authentication required for all other endpoints
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

    switch (action) {
      case 'get': {
        try {
          // Get profile data
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            throw error;
          }

          if (!profile) {
            return new Response(
              JSON.stringify({ profile: null }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Decrypt encrypted fields if they exist
          const decryptedProfile = { ...profile };
          
          if (profile.encryption_version === 2) {
            // KMS encrypted profile
            try {
              if (profile.first_name_encrypted) {
                decryptedProfile.first_name = await decryptData(profile.first_name_encrypted);
                delete decryptedProfile.first_name_encrypted;
              }
              if (profile.last_name_encrypted) {
                decryptedProfile.last_name = await decryptData(profile.last_name_encrypted);
                delete decryptedProfile.last_name_encrypted;
              }
              if (profile.phone_encrypted) {
                decryptedProfile.phone = await decryptData(profile.phone_encrypted);
                delete decryptedProfile.phone_encrypted;
              }
              
              await logKMSAudit('decrypt', 'profile_data', true, user.id);
            } catch (decryptError) {
              await logKMSAudit('decrypt', 'profile_data', false, user.id, decryptError.message);
              console.error('Decryption error:', decryptError);
              // Return profile with encrypted fields hidden but don't fail
              delete decryptedProfile.first_name_encrypted;
              delete decryptedProfile.last_name_encrypted;
              delete decryptedProfile.phone_encrypted;
            }
          }

          return new Response(
            JSON.stringify({ profile: decryptedProfile }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          console.error('Error fetching profile:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch profile' }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'update': {
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        try {
          const body = await req.json();
          const { first_name, last_name, phone } = body;

          // Encrypt PII data using KMS
          const encryptedData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
            encryption_version: 2 // Mark as KMS encrypted
          };

          if (first_name !== undefined) {
            if (first_name) {
              encryptedData.first_name_encrypted = await encryptData(first_name, 'PII');
              encryptedData.first_name = null; // Clear plaintext
            } else {
              encryptedData.first_name = null;
              encryptedData.first_name_encrypted = null;
            }
          }

          if (last_name !== undefined) {
            if (last_name) {
              encryptedData.last_name_encrypted = await encryptData(last_name, 'PII');
              encryptedData.last_name = null; // Clear plaintext
            } else {
              encryptedData.last_name = null;
              encryptedData.last_name_encrypted = null;
            }
          }

          if (phone !== undefined) {
            if (phone) {
              encryptedData.phone_encrypted = await encryptData(phone, 'PII');
              encryptedData.phone = null; // Clear plaintext
            } else {
              encryptedData.phone = null;
              encryptedData.phone_encrypted = null;
            }
          }

          // Update or insert profile
          const { data, error } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              ...encryptedData
            }, {
              onConflict: 'id'
            })
            .select()
            .single();

          if (error) {
            throw error;
          }

          await logKMSAudit('encrypt', 'profile_data', true, user.id);

          // Return decrypted data for client
          const responseData = {
            ...data,
            first_name: first_name || null,
            last_name: last_name || null,
            phone: phone || null
          };

          // Remove encrypted fields from response
          delete responseData.first_name_encrypted;
          delete responseData.last_name_encrypted;
          delete responseData.phone_encrypted;

          return new Response(
            JSON.stringify({ profile: responseData }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          await logKMSAudit('encrypt', 'profile_data', false, user.id, error.message);
          console.error('Error updating profile:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to update profile' }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }


      default:
        return new Response(
          JSON.stringify({
            error: 'Not found',
            availableEndpoints: ['get', 'update', 'health']
          }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

  } catch (error) {
    console.error('Profile management error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
