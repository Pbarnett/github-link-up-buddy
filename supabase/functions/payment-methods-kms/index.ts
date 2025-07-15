import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { encryptData } from "../_shared/kms.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Initialize Stripe (using test key for development)
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = {
  customers: {
    create: async (params: Record<string, string>) => {
      const response = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params),
      });
      return await response.json();
    },
    retrieve: async (id: string) => {
      const response = await fetch(`https://api.stripe.com/v1/customers/${id}`, {
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
        },
      });
      return await response.json();
    },
    update: async (id: string, params: Record<string, string>) => {
      const response = await fetch(`https://api.stripe.com/v1/customers/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params),
      });
      return await response.json();
    }
  },
  paymentMethods: {
    create: async (params: Record<string, string>) => {
      const response = await fetch('https://api.stripe.com/v1/payment_methods', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params),
      });
      return await response.json();
    },
    attach: async (id: string, params: Record<string, string>) => {
      const response = await fetch(`https://api.stripe.com/v1/payment_methods/${id}/attach`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params),
      });
      return await response.json();
    },
    detach: async (id: string) => {
      const response = await fetch(`https://api.stripe.com/v1/payment_methods/${id}/detach`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
        },
      });
      return await response.json();
    }
  }
};

async function getOrCreateStripeCustomer(user: {
  id: string;
  email: string;
  user_metadata?: { name?: string };
}) {
  // Check if customer already exists
  const { data: existingCustomer } = await supabase
    .from('stripe_customers')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();

  if (existingCustomer) {
    return existingCustomer.stripe_customer_id;
  }

  // Create new Stripe customer
  const stripeCustomer = await stripe.customers.create({
    email: user.email,
    name: user.user_metadata?.name || user.email,
    metadata: {
      user_id: user.id,
    },
  });

  if (stripeCustomer.error) {
    throw new Error(`Failed to create Stripe customer: ${stripeCustomer.error.message}`);
  }

  // Save customer record
  await supabase
    .from('stripe_customers')
    .insert({
      user_id: user.id,
      stripe_customer_id: stripeCustomer.id,
      email: user.email,
      name: user.user_metadata?.name || user.email,
    });

  return stripeCustomer.id;
}


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, paymentData, paymentMethodId } = await req.json();

    switch (action) {
      case 'create': {
        const {
          card_number,
          cardholder_name,
          exp_month,
          exp_year,
          cvv,
          is_default = false
        } = paymentData;

        // Validate input
        if (!card_number || !cardholder_name || !exp_month || !exp_year || !cvv) {
          return new Response(
            JSON.stringify({ error: 'Missing required payment method fields' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get or create Stripe customer
        const stripeCustomerId = await getOrCreateStripeCustomer(user);

        // Create Stripe payment method
        const stripePaymentMethod = await stripe.paymentMethods.create({
          type: 'card',
          card: {
            number: card_number,
            exp_month: exp_month,
            exp_year: exp_year,
            cvc: cvv,
          },
          billing_details: {
            name: cardholder_name,
          },
        });

        if (stripePaymentMethod.error) {
          return new Response(
            JSON.stringify({ error: `Stripe error: ${stripePaymentMethod.error.message}` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Attach payment method to customer
        await stripe.paymentMethods.attach(stripePaymentMethod.id, {
          customer: stripeCustomerId,
        });

        // If this is the default payment method, unset others
        if (is_default) {
          await supabase
            .from('payment_methods')
            .update({ is_default: false })
            .eq('user_id', user.id);
        }

        // Store in database with KMS encryption
        const encryptedPaymentData = await encryptData(JSON.stringify({
          stripe_payment_method_id: stripePaymentMethod.id,
          card_number,
          cardholder_name,
          cvv,
        }), 'PAYMENT');

        const { data: paymentMethod, error: dbError } = await supabase
          .from('payment_methods')
          .insert({
            user_id: user.id,
            stripe_customer_id: stripeCustomerId,
            stripe_payment_method_id: stripePaymentMethod.id,
            encrypted_payment_data: encryptedPaymentData,
            brand: stripePaymentMethod.card.brand,
            last4: stripePaymentMethod.card.last4,
            exp_month: stripePaymentMethod.card.exp_month,
            exp_year: stripePaymentMethod.card.exp_year,
            funding: stripePaymentMethod.card.funding,
            country: stripePaymentMethod.card.country,
            is_default,
          })
          .select()
          .single();

        if (dbError) {
          // Clean up Stripe payment method if DB insert fails
          await stripe.paymentMethods.detach(stripePaymentMethod.id);
          throw dbError;
        }

        // Return safe response
        return new Response(
          JSON.stringify({
            ...paymentMethod,
            encrypted_payment_data: undefined, // Don't send encrypted data back
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'setDefault': {
        if (!paymentMethodId) {
          return new Response(
            JSON.stringify({ error: 'Payment method ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Verify ownership and get payment method
        const { data: paymentMethod, error: fetchError } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('id', paymentMethodId)
          .eq('user_id', user.id)
          .single();

        if (fetchError || !paymentMethod) {
          return new Response(
            JSON.stringify({ error: 'Payment method not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get Stripe customer ID
        const stripeCustomerId = await getOrCreateStripeCustomer(user);

        // Update default payment method in Stripe
        await stripe.customers.update(stripeCustomerId, {
          invoice_settings: {
            default_payment_method: paymentMethod.stripe_payment_method_id,
          },
        });

        // Update in database (trigger will handle unsetting other defaults)
        const { data: updatedPaymentMethod, error: updateError } = await supabase
          .from('payment_methods')
          .update({ is_default: true })
          .eq('id', paymentMethodId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        return new Response(
          JSON.stringify({
            ...updatedPaymentMethod,
            encrypted_payment_data: undefined,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Payment method error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
