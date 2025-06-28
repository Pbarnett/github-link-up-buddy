// Payment API module
import { supabase } from "@/integrations/supabase/client";

export interface StripePaymentIntentRequest {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

export interface StripePaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

export async function createStripePaymentIntent(
  request: StripePaymentIntentRequest
): Promise<StripePaymentIntentResponse> {
  const { data, error } = await supabase.functions.invoke('create-payment-intent', {
    body: request
  });

  if (error) {
    throw new Error(`Failed to create payment intent: ${error.message}`);
  }

  return data;
}

export async function confirmPayment(paymentIntentId: string): Promise<void> {
  const { error } = await supabase.functions.invoke('confirm-payment', {
    body: { payment_intent_id: paymentIntentId }
  });

  if (error) {
    throw new Error(`Failed to confirm payment: ${error.message}`);
  }
}
