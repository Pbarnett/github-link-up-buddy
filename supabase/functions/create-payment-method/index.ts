import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { 
  encryptPaymentData,
  validateKMSConfig,
  safeKMSOperation,
  createKMSAuditLog
} from "../shared/kms.ts";
import Stripe from "https://esm.sh/stripe@14.4.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface CreatePaymentMethodRequest {
  stripePaymentMethodId: string;
  userId: string;
  isDefault?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
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

    const body: CreatePaymentMethodRequest = await req.json();
    const { stripePaymentMethodId, userId, isDefault = false } = body;
    
    if (!stripePaymentMethodId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: stripePaymentMethodId, userId' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify user matches authenticated user
    if (userId !== user.id) {
      return new Response(
        JSON.stringify({ error: 'User ID mismatch' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    try {
      // Validate KMS configuration
      if (!validateKMSConfig()) {
        return new Response(
          JSON.stringify({ 
            error: 'Payment encryption service not available',
            details: 'KMS configuration missing'
          }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Initialize Stripe client for validation
      let stripe: Stripe | null = null;
      let paymentMethodDetails: any = null;
      
      if (stripeSecretKey) {
        try {
          stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2023-10-16',
          });
          
          // Validate the Stripe payment method exists and get its details
          paymentMethodDetails = await stripe.paymentMethods.retrieve(stripePaymentMethodId);
          
          if (!paymentMethodDetails) {
            return new Response(
              JSON.stringify({ error: 'Invalid Stripe payment method ID' }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        } catch (stripeError) {
          console.error('Stripe validation error:', stripeError);
          return new Response(
            JSON.stringify({ 
              error: 'Failed to validate payment method with Stripe',
              details: stripeError.message 
            }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      // Prepare payment method data with enhanced details
      const paymentMethodData = {
        user_id: userId,
        stripe_payment_method_id: stripePaymentMethodId,
        is_default: isDefault,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        payment_method_type: paymentMethodDetails?.type || 'card',
        status: 'active',
        // Safe metadata (non-sensitive)
        last_four: paymentMethodDetails?.card?.last4 || null,
        brand: paymentMethodDetails?.card?.brand || null,
        exp_month: paymentMethodDetails?.card?.exp_month || null,
        exp_year: paymentMethodDetails?.card?.exp_year || null,
        country: paymentMethodDetails?.card?.country || null
      };

      // Encrypt sensitive payment method details using KMS with retry logic
      try {
        const sensitiveData = {
          stripe_payment_method_id: stripePaymentMethodId,
          full_details: paymentMethodDetails,
          created_by: userId,
          created_at: paymentMethodData.created_at
        };
        
        const encryptedData = await safeKMSOperation(
          () => encryptPaymentData(JSON.stringify(sensitiveData)),
          'encrypt-payment-method',
          3
        );
        
        paymentMethodData.encrypted_payment_data = encryptedData;
        
        // Log successful encryption
        const auditLog = createKMSAuditLog('encrypt', true, 'PAYMENT', {
          userId,
          paymentMethodId: stripePaymentMethodId,
          operation: 'create-payment-method'
        });
        
        await supabase.from('kms_audit_log').insert({
          operation: auditLog.operation,
          success: auditLog.success,
          key_type: auditLog.keyType,
          key_alias: auditLog.keyAlias,
          user_id: userId,
          metadata: auditLog.metadata,
          timestamp: auditLog.timestamp,
          region: auditLog.region,
          environment: auditLog.environment
        });
        
      } catch (encryptionError) {
        console.error('KMS encryption error:', encryptionError);
        
        // Log failed encryption
        const auditLog = createKMSAuditLog('encrypt', false, 'PAYMENT', {
          userId,
          paymentMethodId: stripePaymentMethodId,
          error: encryptionError.message,
          operation: 'create-payment-method'
        });
        
        await supabase.from('kms_audit_log').insert({
          operation: auditLog.operation,
          success: auditLog.success,
          key_type: auditLog.keyType,
          key_alias: auditLog.keyAlias,
          user_id: userId,
          error_message: encryptionError.message,
          metadata: auditLog.metadata,
          timestamp: auditLog.timestamp,
          region: auditLog.region,
          environment: auditLog.environment
        });
        
        return new Response(
          JSON.stringify({ 
            error: 'Failed to encrypt payment data',
            details: encryptionError.message,
            retryable: encryptionError.name === 'ThrottlingException'
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Insert payment method record
      const { data: paymentMethod, error: insertError } = await supabase
        .from('payment_methods')
        .insert(paymentMethodData)
        .select()
        .single();

      if (insertError) {
        console.error('Database insertion error:', insertError);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to create payment method record',
            details: insertError.message 
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // If this is set as default, update other payment methods
      if (isDefault) {
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', userId)
          .neq('id', paymentMethod.id);
      }

      return new Response(
        JSON.stringify({
          success: true,
          paymentMethod: {
            id: paymentMethod.id,
            stripe_payment_method_id: paymentMethod.stripe_payment_method_id,
            is_default: paymentMethod.is_default,
            status: paymentMethod.status,
            created_at: paymentMethod.created_at
          },
          message: 'Payment method created successfully'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } catch (dbError) {
      console.error('Payment method creation error:', dbError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create payment method',
          details: dbError.message 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error('General error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
