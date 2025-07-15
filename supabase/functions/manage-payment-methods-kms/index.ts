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
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

async function logKMSAudit(operation: string, keyType: string, success: boolean, userId?: string, error?: string, metadata?: Record<string, unknown>) {
  try {
    await supabase.from('kms_audit_log').insert({
      operation,
      key_id: keyType,
      success,
      error_message: error,
      user_id: userId,
      ip_address: '127.0.0.1', // Edge function IP
      timestamp: new Date().toISOString(),
      additional_data: metadata ? JSON.stringify(metadata) : null
    });
  } catch (auditError) {
    console.error('Failed to log KMS audit:', auditError);
  }
}

// Utility to mask card number for display (show only last 4 digits)
function maskCardNumber(cardNumber: string): string {
  return `****-****-****-${cardNumber.slice(-4)}`;
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
          function: 'manage-payment-methods-kms'
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
      case 'list': {
        try {
          // Get all payment methods for the user
          const { data: paymentMethods, error } = await supabase
            .from('payment_methods')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          // Decrypt and prepare payment methods for response
          const decryptedMethods = await Promise.all(
            paymentMethods.map(async (method) => {
              try {
                const decryptedMethod = { ...method };
                
                if (method.encryption_version === 2) {
                  // KMS encrypted payment method
                  if (method.card_number_encrypted) {
                    const fullCardNumber = await decryptData(method.card_number_encrypted);
                    decryptedMethod.card_number_masked = maskCardNumber(fullCardNumber);
                    // Don't return full card number in response
                    delete decryptedMethod.card_number_encrypted;
                  }
                  
                  if (method.cardholder_name_encrypted) {
                    decryptedMethod.cardholder_name = await decryptData(method.cardholder_name_encrypted);
                    delete decryptedMethod.cardholder_name_encrypted;
                  }
                } else if (method.card_number) {
                  // Legacy unencrypted method - mask it
                  decryptedMethod.card_number_masked = maskCardNumber(method.card_number);
                  delete decryptedMethod.card_number;
                }

                // Remove sensitive fields from response
                delete decryptedMethod.cvv;
                delete decryptedMethod.cvv_encrypted;
                
                return decryptedMethod;
              } catch (decryptError) {
                console.error('Error decrypting payment method:', decryptError);
                await logKMSAudit('decrypt', 'payment_data', false, user.id, decryptError.message, { payment_method_id: method.id });
                
                // Return method with minimal info if decryption fails
                return {
                  id: method.id,
                  user_id: method.user_id,
                  type: method.type,
                  is_default: method.is_default,
                  created_at: method.created_at,
                  card_number_masked: '****-****-****-****',
                  cardholder_name: 'Encrypted Data Error',
                  exp_month: method.exp_month,
                  exp_year: method.exp_year,
                  brand: method.brand
                };
              }
            })
          );

          await logKMSAudit('decrypt', 'payment_data', true, user.id, undefined, { count: decryptedMethods.length });

          return new Response(
            JSON.stringify({ payment_methods: decryptedMethods }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          console.error('Error fetching payment methods:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch payment methods' }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'add': {
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        try {
          const body = await req.json();
          const { card_number, cardholder_name, exp_month, exp_year, cvv, brand, is_default } = body;

          // Validate required fields
          if (!card_number || !cardholder_name || !exp_month || !exp_year || !cvv) {
            return new Response(
              JSON.stringify({ error: 'Missing required payment method fields' }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // If this is the new default, unset other defaults
          if (is_default) {
            await supabase
              .from('payment_methods')
              .update({ is_default: false })
              .eq('user_id', user.id)
              .eq('is_active', true);
          }

          // Encrypt sensitive payment data using KMS PAYMENT key
          const encryptedCardNumber = await encryptData(card_number, 'PAYMENT');
          const encryptedCardholderName = await encryptData(cardholder_name, 'PAYMENT');
          const encryptedCvv = await encryptData(cvv, 'PAYMENT');

          // Insert new payment method
          const { data, error } = await supabase
            .from('payment_methods')
            .insert({
              user_id: user.id,
              type: 'card',
              card_number_encrypted: encryptedCardNumber,
              cardholder_name_encrypted: encryptedCardholderName,
              cvv_encrypted: encryptedCvv,
              exp_month: parseInt(exp_month),
              exp_year: parseInt(exp_year),
              brand: brand || null,
              is_default: is_default || false,
              is_active: true,
              encryption_version: 2, // Mark as KMS encrypted
              created_at: new Date().toISOString()
            })
            .select()
            .single();

          if (error) {
            throw error;
          }

          await logKMSAudit('encrypt', 'payment_data', true, user.id, undefined, { payment_method_id: data.id });

          // Return safe response without sensitive data
          const responseData = {
            ...data,
            card_number_masked: maskCardNumber(card_number),
            cardholder_name,
            // Remove encrypted and sensitive fields
          };
          delete responseData.card_number_encrypted;
          delete responseData.cardholder_name_encrypted;
          delete responseData.cvv_encrypted;
          delete responseData.cvv;

          return new Response(
            JSON.stringify({ payment_method: responseData }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          await logKMSAudit('encrypt', 'payment_data', false, user.id, error.message);
          console.error('Error adding payment method:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to add payment method' }),
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
          const { payment_method_id, is_default } = body;

          if (!payment_method_id) {
            return new Response(
              JSON.stringify({ error: 'Payment method ID is required' }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Verify ownership
          const { data: existingMethod, error: checkError } = await supabase
            .from('payment_methods')
            .select('id')
            .eq('id', payment_method_id)
            .eq('user_id', user.id)
            .eq('is_active', true)
            .single();

          if (checkError || !existingMethod) {
            return new Response(
              JSON.stringify({ error: 'Payment method not found' }),
              { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const updateData: Record<string, unknown> = {};

          // If setting as default, unset other defaults first
          if (is_default === true) {
            await supabase
              .from('payment_methods')
              .update({ is_default: false })
              .eq('user_id', user.id)
              .eq('is_active', true);
            
            updateData.is_default = true;
          } else if (is_default === false) {
            updateData.is_default = false;
          }

          if (Object.keys(updateData).length === 0) {
            return new Response(
              JSON.stringify({ error: 'No valid fields to update' }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          updateData.updated_at = new Date().toISOString();

          // Update the payment method
          const { data, error } = await supabase
            .from('payment_methods')
            .update(updateData)
            .eq('id', payment_method_id)
            .eq('user_id', user.id)
            .select()
            .single();

          if (error) {
            throw error;
          }

          await logKMSAudit('update', 'payment_data', true, user.id, undefined, { payment_method_id });

          return new Response(
            JSON.stringify({ success: true, payment_method: data }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          console.error('Error updating payment method:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to update payment method' }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'delete': {
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        try {
          const body = await req.json();
          const { payment_method_id } = body;

          if (!payment_method_id) {
            return new Response(
              JSON.stringify({ error: 'Payment method ID is required' }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Soft delete the payment method
          const { data, error } = await supabase
            .from('payment_methods')
            .update({
              is_active: false,
              is_default: false,
              updated_at: new Date().toISOString()
            })
            .eq('id', payment_method_id)
            .eq('user_id', user.id)
            .eq('is_active', true)
            .select()
            .single();

          if (error || !data) {
            return new Response(
              JSON.stringify({ error: 'Payment method not found or already deleted' }),
              { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          await logKMSAudit('delete', 'payment_data', true, user.id, undefined, { payment_method_id });

          return new Response(
            JSON.stringify({ success: true, message: 'Payment method deleted successfully' }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          console.error('Error deleting payment method:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to delete payment method' }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }


      default:
        return new Response(
          JSON.stringify({
            error: 'Not found',
            availableEndpoints: ['list', 'add', 'update', 'delete', 'health']
          }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

  } catch (error) {
    console.error('Payment method management error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
