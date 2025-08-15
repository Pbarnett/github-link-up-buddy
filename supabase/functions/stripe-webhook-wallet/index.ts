// Supabase Edge Function: Stripe Webhook Handler for Wallet
// Day 4: Payments & Wallet System
// Handles payment_method.attached and other wallet-related events

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.15.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-06-20',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function logAuditEvent(event: {
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  old_data?: any;
  new_data?: any;
}) {
  try {
    await supabase
      .from('traveler_data_audit')
      .insert({
        user_id: event.user_id,
        action: event.action,
        table_name: event.table_name,
        record_id: event.record_id,
        old_data: event.old_data || null,
        new_data: event.new_data || null,
        created_at: new Date().toISOString(),
      });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}

async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  try {
    if (!paymentMethod.customer) {
      throw new Error('Payment method has no customer');
    }

    const customerId = typeof paymentMethod.customer === 'string' 
      ? paymentMethod.customer 
      : paymentMethod.customer.id;

    // Find the user associated with this customer
    const { data: customerData, error: customerError } = await supabase
      .from('stripe_customers')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (customerError) {
      throw new Error(`Customer not found: ${customerError.message}`);
    }

    // Extract card details for display
    const card = paymentMethod.card;
    if (!card) {
      throw new Error('Payment method is not a card');
    }

    // Insert payment method into our database
    const { error: insertError } = await supabase
      .from('payment_methods')
      .insert({
        user_id: customerData.user_id,
        stripe_customer_id: customerId,
        stripe_pm_id: paymentMethod.id,
        brand: card.brand,
        last4: card.last4,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        billing_zip: paymentMethod.billing_details?.address?.postal_code,
      });

    if (insertError) {
      throw new Error(`Failed to store payment method: ${insertError.message}`);
    }

    await logAuditEvent({
      user_id: customerData.user_id,
      action: 'ADD_PM',
      table_name: 'payment_methods',
      record_id: paymentMethod.id,
      new_data: {
        brand: card.brand,
        last4: card.last4,
        masked_pm_id: `****${card.last4}`,
      },
    });

    console.log(`Payment method ${paymentMethod.id} attached for user ${customerData.user_id}`);
  } catch (error) {
    console.error('Error handling payment method attached:', error);
    
    // Log the error for monitoring
    await logAuditEvent({
      user_id: 'system',
      action: 'PM_ATTACH_FAILED',
      table_name: 'payment_methods',
      record_id: paymentMethod.id,
      new_data: { 
        error: error instanceof Error ? error.message : 'Unknown error',
        payment_method_id: paymentMethod.id 
      },
    });
    
    throw error; // Re-throw to return 500 response
  }
}

async function handlePaymentMethodDetached(paymentMethod: Stripe.PaymentMethod) {
  try {
    // Remove from our database
    const { error: deleteError } = await supabase
      .from('payment_methods')
      .delete()
      .eq('stripe_pm_id', paymentMethod.id);

    if (deleteError) {
      throw new Error(`Failed to remove payment method: ${deleteError.message}`);
    }

    await logAuditEvent({
      user_id: 'system', // We don't have user context in webhook
      action: 'DELETE_PM',
      table_name: 'payment_methods',
      record_id: paymentMethod.id,
      old_data: {
        stripe_pm_id: `****${paymentMethod.id.slice(-4)}`,
      },
    });

    console.log(`Payment method ${paymentMethod.id} detached`);
  } catch (error) {
    console.error('Error handling payment method detached:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Hard deprecation: return 410 Gone for all non-OPTIONS requests
  const url = new URL(req.url);
  if (url.searchParams.get('action') === 'health') {
    return new Response(
      JSON.stringify({
        status: 'deprecated',
        endpoint: 'stripe-webhook-wallet',
        message: 'This webhook is deprecated. Wallet persistence is handled by setup_intent.succeeded in stripe-webhook.',
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.warn('[DEPRECATION] stripe-webhook-wallet invoked. Returning 410 Gone.');
  return new Response(
    JSON.stringify({
      error: 'This endpoint is deprecated (PCI/architecture consolidation). Use the canonical stripe-webhook handler.',
      code: 'endpoint_deprecated'
    }),
    { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
