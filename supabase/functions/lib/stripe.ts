
import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

export { stripe };

export async function capturePaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
    return { success: true, paymentIntent };
  } catch (error) {
    console.error("Failed to capture payment intent:", error);
    return { success: false, error: error.message };
  }
}

export async function refundPaymentIntent(paymentIntentId: string, amount?: number) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount,
    });
    return { success: true, refund };
  } catch (error) {
    console.error("Failed to refund payment intent:", error);
    return { success: false, error: error.message };
  }
}
