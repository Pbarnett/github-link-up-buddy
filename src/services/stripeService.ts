import { loadStripe, Stripe } from '@stripe/stripe-js';
import { createClient } from '@supabase/supabase-js';
import StripeServerModule from 'stripe';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export interface PaymentIntentParams {
  amount: number; // Amount in dollars (will be converted to cents)
  currency: string;
  metadata?: Record<string, string>;
  automatic_payment_methods?: {
    enabled: boolean;
  };
}

export interface PaymentMethodParams {
  type: 'card';
  card: any; // Stripe card element
  billing_details?: {
    name?: string;
    email?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
}

export interface DuffelPaymentSession {
  card_id: string;
  three_d_secure_session_id: string;
  status: 'ready_for_payment' | 'failed' | 'requires_action';
}

/**
 * Stripe Service for handling payment operations
 * Integrates with Supabase edge functions for secure server-side operations
 */
export class StripeService {
  private stripe: Stripe | null = null;

  constructor() {
    this.initializeStripe();
  }

  private async initializeStripe() {
    this.stripe = await getStripe();
  }

  /**
   * Create a payment intent via Supabase edge function
   * This ensures sensitive operations happen server-side
   */
  async createPaymentIntent(params: PaymentIntentParams) {
    try {
      // Ensure user is authenticated before creating a PaymentIntent
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        throw new Error('Failed to check authentication status');
      }
      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        const authErr: any = new Error('Authentication required');
        authErr.code = 'AUTH_REQUIRED';
        throw authErr;
      }

      const { data, error } = await supabase.functions.invoke('create-payment-session', {
        body: {
          amount: Math.round(params.amount * 100), // Convert to cents
          currency: params.currency.toLowerCase(),
          metadata: { ...(params.metadata || {}), user_id: userId },
          automatic_payment_methods: params.automatic_payment_methods || { enabled: true }
        }
      });

      try { (window as any)?.analytics && (window as any).analytics.track('payment_intent_created', { amount_cents: Math.round(params.amount * 100), currency: params.currency.toLowerCase() }); } catch {}

      if (error) {
        throw new Error(`Payment intent creation failed: ${error.message}`);
      }

      return {
        client_secret: data.client_secret,
        id: data.id,
        amount: data.amount,
        currency: data.currency,
        status: data.status
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  /**
   * Confirm a payment with 3D Secure authentication for Duffel
   * This method handles the complete flow including Duffel card creation and 3DS
   */
  async confirmPaymentWithDuffel({
    clientSecret,
    paymentMethod,
    offerId,
    passengers,
    returnUrl
  }: {
    clientSecret: string;
    paymentMethod: PaymentMethodParams;
    offerId: string;
    passengers: any[];
    returnUrl?: string;
  }) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      // Step 1: Create Duffel payment session (card + 3DS)
      const duffelSession = await this.createDuffelPaymentSession({
        offerId,
        paymentMethod,
        passengers
      });

      if (duffelSession.status !== 'ready_for_payment') {
        throw new Error('Payment verification failed. Please try again.');
      }

      // Step 2: Confirm payment with Stripe
      const confirmResult = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod,
        return_url: returnUrl
      });

      if (confirmResult.error) {
        throw new Error(confirmResult.error.message || 'Payment confirmation failed');
      }

      // Step 3: Return combined result
      return {
        paymentIntent: confirmResult.paymentIntent,
        duffelSession,
        success: true
      };

    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  /**
   * Create Duffel payment session (card creation + 3D Secure)
   * This handles the Duffel-specific payment flow
   */
  private async createDuffelPaymentSession({
    offerId,
    paymentMethod,
    passengers
  }: {
    offerId: string;
    paymentMethod: PaymentMethodParams;
    passengers: any[];
  }): Promise<DuffelPaymentSession> {
    try {
      // Ensure user is authenticated for Duffel payment session as well
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        throw new Error('Failed to check authentication status');
      }
      const userId = sessionData?.session?.user?.id;
      if (!userId) {
        const authErr: any = new Error('Authentication required');
        authErr.code = 'AUTH_REQUIRED';
        throw authErr;
      }

      // Create temporary card with Duffel
      const { data: cardData, error: cardError } = await supabase.functions.invoke('duffel-create-card', {
        body: {
          payment_method: paymentMethod,
          cardholder_name: `${passengers[0]?.given_name} ${passengers[0]?.family_name}`,
          cardholder_email: passengers[0]?.email,
          user_id: userId
        }
      });

      if (cardError) {
        throw new Error(`Card creation failed: ${cardError.message}`);
      }

      // Create 3D Secure session
      const { data: threeDSData, error: sessionError2 } = await supabase.functions.invoke('duffel-3ds-session', {
        body: {
          card_id: cardData.card_id,
          offer_id: offerId,
          cardholder_present: true,
          user_id: userId
        }
      });

      if (sessionError2) {
        throw new Error(`3D Secure session creation failed: ${sessionError2.message}`);
      }

      return {
        card_id: cardData.card_id,
        three_d_secure_session_id: threeDSData.session_id,
        status: threeDSData.status
      };

    } catch (error) {
      console.error('Error creating Duffel payment session:', error);
      throw error;
    }
  }

  /**
   * Retrieve payment intent details
   */
  async retrievePaymentIntent(clientSecret: string) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      const { paymentIntent, error } = await this.stripe.retrievePaymentIntent(clientSecret);

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      throw error;
    }
  }

  /**
   * Handle webhook verification (used in edge functions)
   */
  static async verifyWebhookSignature(
    payload: string,
    signature: string,
    endpointSecret: string
  ) {
    const stripe = new StripeServerModule(process.env.STRIPE_SECRET_KEY!);
    
    try {
      const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
      return { event, valid: true };
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return { event: null, valid: false, error: error.message };
    }
  }

  /**
   * Process refund (server-side via edge function)
   */
  async processRefund({
    paymentIntentId,
    amount,
    reason
  }: {
    paymentIntentId: string;
    amount?: number;
    reason?: string;
  }) {
    try {
      const { data, error } = await supabase.functions.invoke('process-refund', {
        body: {
          payment_intent_id: paymentIntentId,
          amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents if provided
          reason: reason || 'requested_by_customer'
        }
      });

      if (error) {
        throw new Error(`Refund processing failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  /**
   * Get payment methods for a customer
   */
  async getPaymentMethods(customerId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('get-payment-methods', {
        body: { customer_id: customerId }
      });

      if (error) {
        throw new Error(`Failed to retrieve payment methods: ${error.message}`);
      }

      return data.payment_methods;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  /**
   * Delete a payment method
   */
  async deletePaymentMethod(paymentMethodId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('delete-payment-method', {
        body: { payment_method_id: paymentMethodId }
      });

      if (error) {
        throw new Error(`Failed to delete payment method: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const stripeService = new StripeService();

// Export utility functions
export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
};

export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$'
  };
  
  return symbols[currency.toUpperCase()] || currency.toUpperCase();
};

export default stripeService;
