import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { stripe } from "../lib/stripe.ts";
import { encryptPaymentData } from "../shared/kms.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface PaymentMethodData {
  id?: string;
  stripe_payment_method_id?: string;
  setup_intent_id?: string;
  is_default?: boolean;
}

// Export handler function for testing
export async function handleManagePaymentMethods(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const jwt = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const url = new URL(req.url);
    const method = req.method;
    const action = url.searchParams.get('action') || (await req.json())?.action;

    switch (method) {
      case 'GET':
        return await handleGetPaymentMethods(user.id);
      
      case 'POST':
        return await handleCreatePaymentMethod(user, action, await req.json());
      
      case 'PUT':
        return await handleUpdatePaymentMethod(user.id, await req.json());
      
      case 'DELETE': {
        const paymentMethodId = url.searchParams.get('id');
        if (!paymentMethodId) {
          return new Response(JSON.stringify({ error: 'Payment method ID required' }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        return await handleDeletePaymentMethod(user.id, paymentMethodId);
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
  } catch (error) {
    console.error('Payment method management error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}

// Only call serve when running in Deno (not in tests)
if (typeof Deno !== 'undefined' && !Deno.env.get('VITEST')) {
  serve(handleManagePaymentMethods);
}

// Export as default for compatibility
export default handleManagePaymentMethods;

async function handleGetPaymentMethods(userId: string) {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return new Response(JSON.stringify({ payment_methods: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

async function handleCreatePaymentMethod(user: { id: string; email: string }, action: string, requestData: unknown) {
  if (action === 'create_setup_intent') {
    return await createSetupIntent(user);
  } else if (action === 'confirm_payment_method') {
    // Type guard for requestData
    if (!requestData || typeof requestData !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid request data' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    return await confirmPaymentMethod(user, requestData as PaymentMethodData);
  } else {
    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}

async function createSetupIntent(user: { id: string; email: string }) {
  try {
    // Get or create Stripe customer
    let stripeCustomerId: string;
    
    // Check if user already has a customer in our traveler_profiles
    const { data: profile } = await supabase
      .from('traveler_profiles')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (profile?.stripe_customer_id) {
      stripeCustomerId = profile.stripe_customer_id;
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id
        }
      });
      stripeCustomerId = customer.id;

      // Update traveler profile with customer ID
      await supabase
        .from('traveler_profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('user_id', user.id);
    }

    // Create setup intent for saving payment method
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      usage: 'off_session', // For future payments
      payment_method_types: ['card'],
    });

    return new Response(JSON.stringify({
      client_secret: setupIntent.client_secret,
      stripe_customer_id: stripeCustomerId
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Setup intent creation error:', error);
    throw error;
  }
}

async function confirmPaymentMethod(user: { id: string; email: string }, data: PaymentMethodData) {
  const { setup_intent_id } = data;
  
  if (!setup_intent_id) {
    return new Response(JSON.stringify({ error: 'Setup intent ID required' }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    // Retrieve the setup intent to get payment method details
    const setupIntent = await stripe.setupIntents.retrieve(setup_intent_id);
    
    if (setupIntent.status !== 'succeeded') {
      return new Response(JSON.stringify({ error: 'Setup intent not completed' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const paymentMethodId = setupIntent.payment_method as string;
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    // Check if this is the user's first payment method
    const { data: existingMethods } = await supabase
      .from('payment_methods')
      .select('id')
      .eq('user_id', user.id);

    const isFirstMethod = !existingMethods || existingMethods.length === 0;

    // Encrypt sensitive payment data using KMS
    const encryptedCardData = await encryptPaymentData({
      last4: paymentMethod.card?.last4,
      brand: paymentMethod.card?.brand,
      exp_month: paymentMethod.card?.exp_month,
      exp_year: paymentMethod.card?.exp_year,
    });

    // Save payment method to database
    const { data: savedMethod, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: user.id,
        stripe_customer_id: setupIntent.customer as string,
        stripe_payment_method_id: paymentMethodId,
        encrypted_card_data: encryptedCardData,
        last4: paymentMethod.card?.last4, // Keep for quick display
        brand: paymentMethod.card?.brand,  // Keep for icons
        is_default: isFirstMethod, // First method becomes default
        encryption_version: 2, // KMS encryption
      })
      .select()
      .single();

    if (error) throw error;

    // Log audit trail
    await supabase
      .from('traveler_data_audit')
      .insert({
        user_id: user.id,
        traveler_profile_id: null, // Payment method isn't tied to specific profile
        action: 'payment_method_added',
        field_accessed: 'payment_method',
        ip_address: null, // Would need to extract from request
      });

    return new Response(JSON.stringify({ 
      payment_method: savedMethod,
      message: 'Payment method saved successfully'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Payment method confirmation error:', error);
    throw error;
  }
}

async function handleUpdatePaymentMethod(userId: string, data: PaymentMethodData) {
  const { id, is_default } = data;
  
  if (!id) {
    return new Response(JSON.stringify({ error: 'Payment method ID required' }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    // If setting as default, first unset all other defaults
    if (is_default) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    // Update the specific payment method
    const { data: updatedMethod, error } = await supabase
      .from('payment_methods')
      .update({ is_default })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ 
      payment_method: updatedMethod,
      message: 'Payment method updated successfully'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Payment method update error:', error);
    throw error;
  }
}

async function handleDeletePaymentMethod(userId: string, paymentMethodId: string) {
  try {
    // Get payment method details before deletion
    const { data: paymentMethod, error: fetchError } = await supabase
      .from('payment_methods')
      .select('stripe_payment_method_id, is_default')
      .eq('id', paymentMethodId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !paymentMethod) {
      return new Response(JSON.stringify({ error: 'Payment method not found' }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Detach from Stripe
    await stripe.paymentMethods.detach(paymentMethod.stripe_payment_method_id);

    // Delete from database
    const { error: deleteError } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', paymentMethodId)
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    // If this was the default, set another method as default
    if (paymentMethod.is_default) {
      const { data: otherMethods } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (otherMethods && otherMethods.length > 0) {
        await supabase
          .from('payment_methods')
          .update({ is_default: true })
          .eq('id', otherMethods[0].id);
      }
    }

    // Log audit trail
    await supabase
      .from('traveler_data_audit')
      .insert({
        user_id: userId,
        traveler_profile_id: null,
        action: 'payment_method_deleted',
        field_accessed: 'payment_method',
      });

    return new Response(JSON.stringify({ 
      message: 'Payment method deleted successfully'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Payment method deletion error:', error);
    throw error;
  }
}
