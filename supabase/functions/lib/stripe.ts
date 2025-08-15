// Centralized Stripe factory for Edge functions.
// Uses dynamic import to avoid ESM URL loader issues in tests.

let cachedStripe: any | null = null;

export async function getStripe(): Promise<any> {
  if (cachedStripe) return cachedStripe;

  const sk = Deno.env.get("STRIPE_SECRET_KEY");
  if (!sk) {
    console.error('Error: Missing Stripe environment variable. STRIPE_SECRET_KEY must be set.');
    throw new Error('Edge Function: Missing Stripe environment variable (STRIPE_SECRET_KEY).');
  }
  const { default: Stripe } = await import("https://esm.sh/stripe@14.21.0");
  cachedStripe = new Stripe(sk, { apiVersion: "2024-06-20" });
  return cachedStripe;
}

export async function capturePaymentIntent(paymentIntentId: string) {
  try {
    const stripe = await getStripe();
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
    return { success: true, paymentIntent };
  } catch (error) {
    console.error("Failed to capture payment intent:", error);
    return { success: false, error: (error as any).message };
  }
}

export async function refundPaymentIntent(paymentIntentId: string, amount?: number) {
  try {
    const stripe = await getStripe();
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount,
    });
    return { success: true, refund };
  } catch (error) {
    console.error("Failed to refund payment intent:", error);
    return { success: false, error: (error as any).message };
  }
}
