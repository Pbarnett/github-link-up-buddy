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

// Import idempotency key generator
/**
 * Generate idempotency key for payment operations
 * Uses V4 UUID as recommended by Stripe API reference
 */
const generateIdempotencyKey = (userId: string, operation: string): string => {
  // Generate V4 UUID as recommended by Stripe API documentation
  const uuid = crypto.randomUUID();
  const timestamp = new Date().toISOString().slice(0, 10);
  // Ensure key is under 255 characters and includes context for debugging
  return `${operation}_${userId}_${timestamp}_${uuid}`.slice(0, 255);
};

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
    
    // Validate key format per API reference documentation
    if (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
      throw new Error('Invalid Stripe secret key format. Must start with sk_test_ or sk_live_');
    }
    
    // Environment validation
    const isProduction = Deno.env.get('NODE_ENV') === 'production';
    if (isProduction && secretKey.startsWith('sk_test_')) {
      throw new Error('Cannot use test secret key in production environment');
    }
    
    if (!isProduction && secretKey.startsWith('sk_live_')) {
      logger.warn('Using live secret key in non-production environment', {
        operation: 'stripe_key_validation_warning'
      });
    }

    stripeClient = new Stripe(secretKey, {
      apiVersion: '2025-06-30.basil',
      httpClient: Stripe.createFetchHttpClient(),
      maxNetworkRetries: 3,
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
  idempotencyKey = generateIdempotencyKey('', 'capturePaymentIntent'),
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
  const idempotencyKey = generateIdempotencyKey(paymentIntentId, 'refundPaymentIntent');
      
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
    // This is a Stripe error - handle per API reference documentation
    const stripeError = error as Stripe.StripeError;
    
    // Enhanced error logging with classification per API reference
    const errorClassification = classifyStripeError(stripeError.type);
    
    logger.error('Stripe API error', {
      operation: 'stripe_error',
      errorType: stripeError.type,
      errorCode: stripeError.code,
      errorMessage: stripeError.message,
      requestId: stripeError.request_id,
      classification: errorClassification,
      retryable: errorClassification.retryable,
      ...context
    });

    captureException(error, {
      stripeErrorType: stripeError.type,
      stripeErrorCode: stripeError.code,
      stripeErrorClassification: errorClassification.category,
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
 * Classify Stripe errors per API reference documentation
 * Lines 462-467 define error type categories
 */
function classifyStripeError(errorType: string): {
  category: string;
  retryable: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
} {
  switch (errorType) {
    case 'card_error':
      return { category: 'card_error', retryable: false, severity: 'medium' };
    case 'rate_limit_error':
      return { category: 'rate_limit_error', retryable: true, severity: 'low' };
    case 'invalid_request_error':
      return { category: 'invalid_request_error', retryable: false, severity: 'high' };
    case 'api_error':
      return { category: 'api_error', retryable: true, severity: 'medium' };
    case 'connection_error':
      return { category: 'connection_error', retryable: true, severity: 'low' };
    case 'authentication_error':
      return { category: 'authentication_error', retryable: false, severity: 'critical' };
    case 'idempotency_error':
      return { category: 'idempotency_error', retryable: false, severity: 'medium' };
    case 'permission_error':
      return { category: 'permission_error', retryable: false, severity: 'high' };
    case 'signature_verification_error':
      return { category: 'signature_verification_error', retryable: false, severity: 'critical' };
    default:
      return { category: 'unknown_error', retryable: false, severity: 'high' };
  }
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
