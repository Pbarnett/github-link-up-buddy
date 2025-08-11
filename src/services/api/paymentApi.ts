// Minimal payment API shim for Duffel payment hook
export interface CreatePaymentIntentParams {
  amount: number; // in cents
  currency: string;
  metadata?: Record<string, string>;
}

export async function createStripePaymentIntent(params: CreatePaymentIntentParams): Promise<{ payment_intent_id: string; client_secret: string }>{
  // This stub simulates creation and returns fake IDs. Replace with real API.
  const id = `pi_${Math.random().toString(36).slice(2, 10)}`;
  return {
    payment_intent_id: id,
    client_secret: `${id}_secret`
  };
}

