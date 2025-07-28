import * as React from 'react';
/**
 * Payment API Service
 *
 * Handles payment processing and Stripe integration
 */

import { supabase } from '@/integrations/supabase/client';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface PaymentMethodData {
  id: string;
  type: string;
  brand?: string;
  last4?: string;
  exp_month?: number;
  exp_year?: number;
}

class PaymentApiService {
  async createStripePaymentIntent(
    amount: number,
    currency: string = 'usd'
  ): Promise<PaymentIntent> {
    try {
      const { data, error } = await supabase.functions.invoke(
        'create-payment-intent',
        {
          body: {
            amount,
            currency,
          },
        }
      );

      if (error) {
        throw new Error(`Failed to create payment intent: ${error.message}`);
      }

      return data as PaymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async getPaymentMethods(): Promise<PaymentMethodData[]> {
    try {
      const { data, error } = await supabase.functions.invoke(
        'get-payment-methods'
      );

      if (error) {
        throw new Error(`Failed to get payment methods: ${error.message}`);
      }

      return data as PaymentMethodData[];
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<PaymentIntent> {
    try {
      const { data, error } = await supabase.functions.invoke(
        'confirm-payment',
        {
          body: {
            payment_intent_id: paymentIntentId,
            payment_method_id: paymentMethodId,
          },
        }
      );

      if (error) {
        throw new Error(`Failed to confirm payment: ${error.message}`);
      }

      return data as PaymentIntent;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke(
        'refund-payment',
        {
          body: {
            payment_intent_id: paymentIntentId,
            amount,
          },
        }
      );

      if (error) {
        throw new Error(`Failed to refund payment: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  }
}

// Export singleton instance
const paymentApiService = new PaymentApiService();

// Export specific functions
export const createStripePaymentIntent =
  paymentApiService.createStripePaymentIntent.bind(paymentApiService);
export const getPaymentMethods =
  paymentApiService.getPaymentMethods.bind(paymentApiService);
export const confirmPayment =
  paymentApiService.confirmPayment.bind(paymentApiService);
export const refundPayment =
  paymentApiService.refundPayment.bind(paymentApiService);

export default paymentApiService;
