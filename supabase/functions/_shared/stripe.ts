/**
 * Stripe Payment Processing Wrapper
 * 
 * Typed Stripe client with OpenTelemetry tracing, structured logging,
 * and idempotency support for auto-booking pipeline
 */

import Stripe from 'https://esm.sh/stripe@11.17.0';
import { logger, withTiming, getLogContext } from './logger.ts';
import { captureException } from './sentry.ts';
import { withSpan, tracer, getCurrentTraceContext, injectTraceContext } from './otel.ts';

let stripeClient: Stripe | null = null;

/**
 * Initialize Stripe client
 */
function getStripeClient(): Stripe {
  if (!stripeClient) {
    const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
    
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }

    stripeClient = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    logger.info('Stripe client initialized', {
      operation: 'stripe_client_init'
    });
  }

  return stripeClient;
}


/**
 * Create payment intent with proper OpenTelemetry tracing
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata: Record<string, string> = {},
  context: { userId?: string; tripRequestId?: string; bookingAttemptId?: string } = {}
): Promise<Stripe.PaymentIntent> {
  return withSpan(
    'stripe.create_payment_intent',
    async (span) => {
      const stripe = getStripeClient();
      
      span.attributes['stripe.amount'] = amount;
      span.attributes['stripe.currency'] = currency;
      span.attributes['stripe.metadata_keys'] = Object.keys(metadata).join(',');
      
      const result = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata,
        capture_method: 'manual'
      });

      span.attributes['stripe.payment_intent_id'] = result.id;
      span.attributes['stripe.status'] = result.status;

      logger.info('Stripe payment intent created', {
        operation: 'stripe_payment_intent_created',
        paymentIntentId: result.id,
        amount,
        currency,
        status: result.status,
        ...context
      });

      return result;
    },
    {
      'service.name': 'stripe-api',
      'stripe.operation': 'create_payment_intent'
    }
  );
}

/**
 * Capture a payment intent with idempotency support
 */
export async function capturePaymentIntent(
  paymentIntentId: string,
  idempotencyKey: string,
  context: { userId?: string; tripRequestId?: string; bookingAttemptId?: string } = {}
): Promise<Stripe.PaymentIntent> {
  return withSpan(
    'stripe.capture_payment_intent',
    async (span) => {
      const stripe = getStripeClient();
      
      span.attributes['stripe.payment_intent_id'] = paymentIntentId;
      span.attributes['stripe.idempotency_key'] = idempotencyKey;
      
      const result = await stripe.paymentIntents.capture(paymentIntentId, {}, {
        idempotencyKey
      });

      span.attributes['stripe.amount_received'] = result.amount_received || 0;
      span.attributes['stripe.status'] = result.status;

      logger.info('Stripe payment intent captured', {
        operation: 'stripe_payment_intent_captured',
        paymentIntentId,
        amountReceived: result.amount_received || 0,
        currency: result.currency,
        idempotencyKey,
        ...context
      });

      return result;
    },
    {
      'service.name': 'stripe-api',
      'stripe.operation': 'capture_payment_intent'
    }
  );
}

/**
 * Create a refund for a payment intent
 */
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason: 'duplicate' | 'fraudulent' | 'requested_by_customer' = 'requested_by_customer',
  context: { userId?: string; tripRequestId?: string; bookingAttemptId?: string } = {}
): Promise<Stripe.Refund> {
  return withSpan(
    'stripe.create_refund',
    async (span) => {
      const stripe = getStripeClient();
      
      span.attributes['stripe.payment_intent_id'] = paymentIntentId;
      span.attributes['stripe.refund_amount'] = amount || 0;
      span.attributes['stripe.refund_reason'] = reason;
      
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount,
        reason
      });

      span.attributes['stripe.refund_id'] = refund.id;
      span.attributes['stripe.refund_status'] = refund.status;

      logger.info('Stripe refund created successfully', {
        operation: 'stripe_refund_success',
        refundId: refund.id,
        paymentIntentId,
        amount: refund.amount,
        reason,
        ...context
      });

      return refund;
    },
    {
      'service.name': 'stripe-api',
      'stripe.operation': 'create_refund'
    }
  );
}

/**
 * Refund a payment intent with proper idempotency and status mapping
 */
export async function refundPaymentIntent({
  paymentIntentId,
  amount,
  reason = 'requested_by_customer',
  metadata = {}
}: {
  paymentIntentId: string;
  amount?: number;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
  metadata?: Record<string, string>;
}): Promise<{ refund: Stripe.Refund; status: 'refunded' | 'refund_failed'; failureReason?: string }> {
  return withSpan(
    'stripe.refund_payment_intent',
    async (span) => {
      const stripe = getStripeClient();
      const idempotencyKey = `refund-${paymentIntentId}`;
      
      span.attributes['stripe.payment_intent_id'] = paymentIntentId;
      span.attributes['stripe.refund_amount'] = amount || 0;
      span.attributes['stripe.refund_reason'] = reason;
      span.attributes['stripe.idempotency_key'] = idempotencyKey;
      
      try {
        const refund = await stripe.refunds.create({
          payment_intent: paymentIntentId,
          amount,
          reason,
          metadata
        }, {
          idempotencyKey
        });

        span.attributes['stripe.refund_id'] = refund.id;
        span.attributes['stripe.refund_status'] = refund.status;

        logger.info('Payment intent refunded successfully', {
          operation: 'refund_payment_intent_success',
          refundId: refund.id,
          paymentIntentId,
          amount: refund.amount,
          status: refund.status,
          reason
        });

        // Map Stripe status to booking status
        const status = refund.status === 'succeeded' ? 'refunded' : 'refund_failed';
        const failureReason = refund.status !== 'succeeded' ? refund.failure_reason || 'unknown_failure' : undefined;

        return { refund, status, failureReason };
      } catch (error) {
        logger.error('Payment intent refund failed', {
          operation: 'refund_payment_intent_failed',
          paymentIntentId,
          error: error.message
        });

        captureException(error, {
          operation: 'refund_payment_intent',
          paymentIntentId
        });

        return { 
          refund: null as any, 
          status: 'refund_failed' as const, 
          failureReason: error.message 
        };
      }
    },
    {
      'service.name': 'stripe-api',
      'stripe.operation': 'refund_payment_intent'
    }
  );
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  endpointSecret: string
): Stripe.Event {
  const stripe = getStripeClient();
  
  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
    
    logger.debug('Webhook signature verified', {
      operation: 'webhook_signature_verify',
      eventType: event.type,
      eventId: event.id
    });

    return event;
  } catch (error) {
    logger.error('Webhook signature verification failed', {
      operation: 'webhook_signature_verify_failed',
      error: error.message
    });

    captureException(error, {
      operation: 'webhook_signature_verify'
    });

    throw error;
  }
}

/**
 * Retrieve a payment intent
 */
export async function retrievePaymentIntent(
  paymentIntentId: string,
  context: Record<string, any> = {}
): Promise<Stripe.PaymentIntent> {
  return withSpan(
    'stripe.retrieve_payment_intent',
    async (span) => {
      const stripe = getStripeClient();
      
      span.attributes['stripe.payment_intent_id'] = paymentIntentId;
      
      const result = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      span.attributes['stripe.status'] = result.status;
      span.attributes['stripe.amount'] = result.amount;
      span.attributes['stripe.currency'] = result.currency;
      
      return result;
    },
    {
      'service.name': 'stripe-api',
      'stripe.operation': 'retrieve_payment_intent'
    }
  );
}

/**
 * Handle Stripe API errors with proper logging and classification
 */
export function handleStripeError(error: any, context: Record<string, any> = {}): never {
  if (error.type) {
    // This is a Stripe error
    const stripeError = error as Stripe.StripeError;
    
    logger.error('Stripe API error', {
      operation: 'stripe_error',
      errorType: stripeError.type,
      errorCode: stripeError.code,
      errorMessage: stripeError.message,
      requestId: stripeError.request_id,
      ...context
    });

    captureException(error, {
      stripeErrorType: stripeError.type,
      stripeErrorCode: stripeError.code,
      ...context
    });
  } else {
    // Generic error
    logger.error('Stripe operation error', {
      operation: 'stripe_generic_error',
      error: error.message,
      ...context
    });

    captureException(error, context);
  }

  throw error;
}

/**
 * Refund payment intent with enhanced tracing (vendor-namespaced)
 */
export async function refundPaymentIntentEnhanced(
  paymentIntentId: string,
  amount?: number,
  reason: 'duplicate' | 'fraudulent' | 'requested_by_customer' = 'requested_by_customer',
  context: { userId?: string; tripRequestId?: string; bookingAttemptId?: string } = {}
): Promise<{ refund: Stripe.Refund; status: 'refunded' | 'refund_failed'; failureReason?: string }> {
  return withSpan(
    'stripe.refund',
    async (span) => {
      span.setAttribute('stripe.payment_intent_id', paymentIntentId);
      span.setAttribute('stripe.refund_amount', amount || 0);
      span.setAttribute('stripe.refund_reason', reason);
      
      const result = await refundPaymentIntent({
        paymentIntentId,
        amount,
        reason,
        metadata: {
          user_id: context.userId || '',
          trip_request_id: context.tripRequestId || '',
          booking_attempt_id: context.bookingAttemptId || ''
        }
      });
      
      span.setAttribute('stripe.refund_status', result.status);
      if (result.refund?.id) {
        span.setAttribute('stripe.refund_id', result.refund.id);
      }
      
      return result;
    },
    {
      'service.name': 'stripe-api',
      'stripe.operation': 'refund'
    }
  );
}

/**
 * Wrapped Stripe operations with automatic error handling
 */
export const stripe = {
  createPaymentIntent: withTiming(createPaymentIntent, 'stripe_create_pi'),
  capturePaymentIntent: withTiming(capturePaymentIntent, 'stripe_capture'),
  createRefund: withTiming(createRefund, 'stripe_refund'),
  refundPaymentIntent: withTiming(refundPaymentIntentEnhanced, 'stripe_refund_pi'),
  retrievePaymentIntent: withTiming(retrievePaymentIntent, 'stripe_retrieve'),
  verifyWebhookSignature,
  handleError: handleStripeError
};
