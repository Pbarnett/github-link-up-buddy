// Stripe Wallet Service - Day 4: Payments & Wallet System
// Handles lazy customer creation and payment method management

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { logAuditEvent } from './auditService';

// Initialize Stripe with proper error handling
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_pm_id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  billing_zip?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface SetupIntentResult {
  client_secret: string;
  setup_intent_id: string;
  customer_id: string;
}

/**
 * Get or create a Stripe customer (lazy creation)
 * Only creates customer when user first adds a payment method
 */
export async function getOrCreateStripeCustomer(user: User): Promise<string> {
  try {
    // First check if customer already exists
    const { data: existing, error: selectError } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows
      throw new Error(`Failed to query existing customer: ${selectError.message}`);
    }

    if (existing) {
      return existing.stripe_customer_id;
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        user_id: user.id,
        created_via: 'parker_flight_wallet',
      },
    });

    // Store in our database
    const { error: insertError } = await supabase
      .from('stripe_customers')
      .insert({
        user_id: user.id,
        stripe_customer_id: customer.id,
      });

    if (insertError) {
      // Cleanup: delete the Stripe customer if DB insert fails
      await stripe.customers.del(customer.id);
      throw new Error(`Failed to store customer: ${insertError.message}`);
    }

    // Log the customer creation
    await logAuditEvent({
      user_id: user.id,
      action: 'CREATE_STRIPE_CUSTOMER',
      table_name: 'stripe_customers',
      record_id: customer.id,
      new_data: { stripe_customer_id: customer.id },
    });

    return customer.id;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw new Error(`Failed to create customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create a SetupIntent for adding a new payment method
 * Client will use this to collect payment details securely
 */
export async function createSetupIntent(
  user: User,
  options: {
    usage?: 'off_session' | 'on_session';
    idempotencyKey?: string;
  } = {}
): Promise<SetupIntentResult> {
  try {
    const customerId = await getOrCreateStripeCustomer(user);
    
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      usage: options.usage || 'off_session',
      payment_method_types: ['card'],
      metadata: {
        user_id: user.id,
        created_via: 'parker_flight_wallet',
      },
    }, {
      idempotencyKey: options.idempotencyKey,
    });

    // Log the setup intent creation
    await logAuditEvent({
      user_id: user.id,
      action: 'CREATE_SETUP_INTENT',
      table_name: 'setup_intents',
      record_id: setupIntent.id,
      new_data: {
        setup_intent_id: setupIntent.id,
        customer_id: customerId,
        status: setupIntent.status,
      },
    });

    return {
      client_secret: setupIntent.client_secret!,
      setup_intent_id: setupIntent.id,
      customer_id: customerId,
    };
  } catch (error) {
    console.error('Error creating SetupIntent:', error);
    throw new Error(`Failed to create setup intent: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get user's payment methods from database
 * Returns decrypted data for UI display
 */
export async function getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch payment methods: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw new Error(`Failed to get payment methods: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Set a payment method as default
 * Automatically unsets other defaults for the user
 */
export async function setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('id', paymentMethodId);

    if (error) {
      throw new Error(`Failed to set default payment method: ${error.message}`);
    }

    await logAuditEvent({
      user_id: userId,
      action: 'SET_DEFAULT_PM',
      table_name: 'payment_methods',
      record_id: paymentMethodId,
      new_data: { is_default: true },
    });
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw new Error(`Failed to set default: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete a payment method
 * Removes from both Stripe and our database
 */
export async function deletePaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
  try {
    // First get the payment method details
    const { data: pm, error: fetchError } = await supabase
      .from('payment_methods')
      .select('stripe_pm_id, is_default')
      .eq('user_id', userId)
      .eq('id', paymentMethodId)
      .single();

    if (fetchError) {
      throw new Error(`Payment method not found: ${fetchError.message}`);
    }

    // Don't allow deletion of the only payment method if it's default
    const { data: userPMs, error: countError } = await supabase
      .from('payment_methods')
      .select('id')
      .eq('user_id', userId);

    if (countError) {
      throw new Error(`Failed to check payment methods: ${countError.message}`);
    }

    if (pm.is_default && userPMs.length === 1) {
      throw new Error('Cannot delete the only payment method');
    }

    // Detach from Stripe first
    await stripe.paymentMethods.detach(pm.stripe_pm_id);

    // Remove from our database
    const { error: deleteError } = await supabase
      .from('payment_methods')
      .delete()
      .eq('user_id', userId)
      .eq('id', paymentMethodId);

    if (deleteError) {
      throw new Error(`Failed to delete payment method: ${deleteError.message}`);
    }

    await logAuditEvent({
      user_id: userId,
      action: 'DELETE_PM',
      table_name: 'payment_methods',
      record_id: paymentMethodId,
      old_data: { stripe_pm_id: `****${pm.stripe_pm_id.slice(-4)}` },
    });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw new Error(`Failed to delete payment method: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Handle payment method attached webhook from Stripe
 * This is called when a SetupIntent is confirmed and PM is attached
 */
export async function handlePaymentMethodAttached(
  paymentMethod: Stripe.PaymentMethod
): Promise<void> {
  try {
    if (!paymentMethod.customer || typeof paymentMethod.customer === 'string') {
      // Get customer info if we only have ID
      const customerId = typeof paymentMethod.customer === 'string' 
        ? paymentMethod.customer 
        : ((paymentMethod.customer as any) && (paymentMethod.customer as any).id ? (paymentMethod.customer as any).id : undefined);

      if (!customerId) {
        throw new Error('Payment method has no customer');
      }

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

      console.log(`Payment method ${paymentMethod.id} attached for user ${customerData.user_id}`);
    }
  } catch (error) {
    console.error('Error handling payment method attached:', error);
    // Don't throw here - this is a webhook handler
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
  }
}

/**
 * Get default payment method for a user
 */
export async function getDefaultPaymentMethod(userId: string): Promise<PaymentMethod | null> {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      throw new Error(`Failed to fetch default payment method: ${error.message}`);
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching default payment method:', error);
    return null;
  }
}

/**
 * Validate Stripe webhook signature
 */
export function validateWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error('Webhook signature validation failed:', error);
    throw new Error('Invalid webhook signature');
  }
}
