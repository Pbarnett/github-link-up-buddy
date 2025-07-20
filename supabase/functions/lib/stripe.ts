const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
if (!stripeSecretKey) {
  console.error('Error: Missing Stripe environment variable. STRIPE_SECRET_KEY must be set.');
  throw new Error('Edge Function: Missing Stripe environment variable (STRIPE_SECRET_KEY).');
}


import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-06-30.basil",
  typescript: true,
});

export { stripe };

export async function capturePaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
    return { success: true, paymentIntent };
  } catch (error: any) {
    console.error("Failed to capture payment intent:", error);
    const handledError = handleStripeError(error);
    return { success: false, error: handledError.error, retryable: handledError.retryable, errorType: handledError.errorType };
  }
}

export async function refundPaymentIntent(paymentIntentId: string, amount?: number) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount,
    });
    return { success: true, refund };
  } catch (error: any) {
    console.error("Failed to refund payment intent:", error);
    const handledError = handleStripeError(error);
    return { success: false, error: handledError.error, retryable: handledError.retryable, errorType: handledError.errorType };
  }
}

/**
 * Comprehensive Stripe error handling per API reference standards
 */
export function handleStripeError(error: any): { success: false; error: string; retryable: boolean; errorType: string } {
  // Handle different Stripe error types per API reference documentation
  if (error.type) {
    switch (error.type) {
      case 'StripeCardError':
      case 'card_error':
        return {
          success: false,
          error: error.message || 'Card was declined',
          retryable: false,
          errorType: 'card_error'
        };
      
      case 'StripeRateLimitError':
      case 'rate_limit_error':
        return {
          success: false,
          error: 'Too many requests. Please try again shortly.',
          retryable: true,
          errorType: 'rate_limit_error'
        };
      
      case 'StripeInvalidRequestError':
      case 'invalid_request_error':
        return {
          success: false,
          error: error.message || 'Invalid request parameters',
          retryable: false,
          errorType: 'invalid_request_error'
        };
      
      case 'StripeAPIError':
      case 'api_error':
        return {
          success: false,
          error: 'Payment processing temporarily unavailable',
          retryable: true,
          errorType: 'api_error'
        };
      
      case 'StripeConnectionError':
      case 'connection_error':
        return {
          success: false,
          error: 'Network error. Please check your connection and try again.',
          retryable: true,
          errorType: 'connection_error'
        };
      
      case 'StripeAuthenticationError':
      case 'authentication_error':
        return {
          success: false,
          error: 'Authentication failed',
          retryable: false,
          errorType: 'authentication_error'
        };
      
      case 'idempotency_error':
        return {
          success: false,
          error: 'Duplicate request detected',
          retryable: false,
          errorType: 'idempotency_error'
        };
      
      default:
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
          retryable: false,
          errorType: 'unknown_error'
        };
    }
  }

  // Handle HTTP status codes
  if (error.statusCode) {
    switch (error.statusCode) {
      case 429:
        return {
          success: false,
          error: 'Rate limited - please try again shortly',
          retryable: true,
          errorType: 'rate_limited'
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          success: false,
          error: 'Server error - please try again',
          retryable: true,
          errorType: 'server_error'
        };
      default:
        return {
          success: false,
          error: error.message || 'An unexpected error occurred',
          retryable: false,
          errorType: 'unknown_error'
        };
    }
  }

  // Generic error handling
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    retryable: false,
    errorType: 'generic_error'
  };
}
