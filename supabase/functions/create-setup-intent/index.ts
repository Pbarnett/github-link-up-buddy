// Supabase Edge Function: Create Setup Intent
// Day 4: Payments & Wallet System
// Creates Stripe SetupIntent for adding payment methods

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.15.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface RequestBody {
  idempotency_key?: string;
  usage?: 'off_session' | 'on_session';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2024-06-20',
    });

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    const userSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: userError } = await userSupabase.auth.getUser();
    if (userError || !user) {
      return new Response('Unauthorized', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    // Parse request body
    const body: RequestBody = await req.json();

    // Get or create Stripe customer
    let customerId: string;
    
    // Check if customer exists
    const { data: existingCustomer, error: customerError } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (customerError && customerError.code !== 'PGRST116') {
      throw new Error(`Failed to query customer: ${customerError.message}`);
    }

    if (existingCustomer) {
      customerId = existingCustomer.stripe_customer_id;
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          user_id: user.id,
          created_via: 'parker_flight_wallet',
        },
      });

      // Store in database
      const { error: insertError } = await supabase
        .from('stripe_customers')
        .insert({
          user_id: user.id,
          stripe_customer_id: customer.id,
        });

      if (insertError) {
        // Cleanup: delete Stripe customer if DB insert fails
        await stripe.customers.del(customer.id);
        throw new Error(`Failed to store customer: ${insertError.message}`);
      }

      customerId = customer.id;
    }

    // Create SetupIntent
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      usage: body.usage || 'off_session',
      payment_method_types: ['card'],
      metadata: {
        user_id: user.id,
        created_via: 'parker_flight_wallet',
      },
    }, {
      idempotencyKey: body.idempotency_key,
    });

    // Log audit event
    await supabase
      .from('traveler_data_audit')
      .insert({
        user_id: user.id,
        action: 'CREATE_SETUP_INTENT',
        table_name: 'setup_intents',
        record_id: setupIntent.id,
        new_data: {
          setup_intent_id: setupIntent.id,
          customer_id: customerId,
          status: setupIntent.status,
        },
        created_at: new Date().toISOString(),
      });

    // Return response
    return new Response(
      JSON.stringify({
        client_secret: setupIntent.client_secret,
        setup_intent_id: setupIntent.id,
        customer_id: customerId,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error creating setup intent:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
