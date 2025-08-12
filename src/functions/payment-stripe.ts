// src/functions/payment-stripe.ts
// Stripe payment Lambda (scaffold):
// - Uses payments-idempotency for dedupe
// - Feature-flagged: if ENABLE_STRIPE !== 'true', returns stub result
// - Reads STRIPE secret from SSM parameter STRIPE_SECRET_PARAM (or STRIPE_SECRET env)

import { LedgerService } from '@/services/ledgerService';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { logger } from './_lib/logger';

// Importing stripe at top allows bundling by esbuild; actual network use gated by feature flag
import Stripe from 'stripe';

interface Event {
  correlationId: string;
  idempotencyKey: string; // required for Stripe idempotency
  amount: number; // cents
  currency?: string; // default 'usd'
  customerId?: string;
}

const ENABLE_STRIPE = process.env.ENABLE_STRIPE === 'true';
const STRIPE_SECRET_PARAM = process.env.STRIPE_SECRET_PARAM || '';
const STRIPE_SECRET_ENV = process.env.STRIPE_SECRET || '';

const ssm = new SSMClient({});

async function getStripeSecret(): Promise<string> {
  if (STRIPE_SECRET_ENV) return STRIPE_SECRET_ENV;
  if (!STRIPE_SECRET_PARAM) throw new Error('FatalProviderError');
  try {
    const out = await ssm.send(
      new GetParameterCommand({ Name: STRIPE_SECRET_PARAM, WithDecryption: true })
    );
    const val = out.Parameter?.Value;
    if (!val) throw new Error('MissingStripeSecret');
    return val;
  } catch (e) {
    // Treat as transient; SSM or KMS might be temporarily unavailable
    throw new Error('TransientProviderError');
  }
}

export async function handler(event: Event) {
  const { correlationId, idempotencyKey, amount } = event || ({} as Event);
  const currency = event.currency || 'usd';

  if (!correlationId || !idempotencyKey || !Number.isFinite(amount)) {
    logger.error('stripe_payment_validation_error', { correlationId, step: 'payment', state: 'error', errorType: 'ValidationError' });
    throw new Error('ValidationError');
  }

  const ledger = new LedgerService();
  logger.info('stripe_payment_attempt', { correlationId, step: 'payment', state: 'attempt', idempotencyKey, amount, currency });

  // Record attempt (dedupe via conditional put)
  try {
    await ledger.recordPaymentAttempt(idempotencyKey, correlationId, amount);
  } catch (e) {
    const msg = String(e);
    if (!msg.includes('ConditionalCheckFailed')) {
      logger.warn('stripe_payment_attempt_record_failed', { correlationId, step: 'payment', state: 'record', errorType: 'TransientProviderError' });
      throw new Error('TransientProviderError');
    }
  }

  // Feature flag: short-circuit to stub behavior
  if (!ENABLE_STRIPE) {
    const paymentIntentId = `pi_stub_${Math.random().toString(36).slice(2, 12)}`;
    try {
      await ledger.markPaymentCompleted(idempotencyKey, paymentIntentId);
    } catch (e) {
      logger.warn('stripe_payment_mark_complete_failed', { correlationId, step: 'payment', state: 'record', errorType: 'TransientProviderError' });
      throw new Error('TransientProviderError');
    }
    logger.info('stripe_payment_success_stub', { correlationId, step: 'payment', state: 'success', idempotencyKey });
    return { ok: true, correlationId, idempotencyKey, paymentIntentId, amount, currency, stub: true };
  }

  // Real Stripe path
  const secret = await getStripeSecret();
const stripe = new Stripe(secret, { apiVersion: '2025-06-30.basil' });

  try {
    const intent = await stripe.paymentIntents.create(
      {
        amount,
        currency,
        // Optional: customer: event.customerId,
        confirmation_method: 'automatic',
        confirm: true,
      },
      { idempotencyKey }
    );

    if (intent.status !== 'succeeded' && intent.status !== 'requires_capture' && intent.status !== 'processing') {
      // Treat unexpected statuses as transient to allow retry or manual handling later
      logger.warn('stripe_unexpected_status', { correlationId, step: 'payment', state: 'unexpected_status', errorType: 'TransientProviderError', status: intent.status });
      throw new Error('TransientProviderError');
    }

    try {
      await ledger.markPaymentCompleted(idempotencyKey, intent.id);
    } catch (e) {
      logger.warn('stripe_payment_mark_complete_failed', { correlationId, step: 'payment', state: 'record', errorType: 'TransientProviderError' });
      throw new Error('TransientProviderError');
    }

    logger.info('stripe_payment_success', { correlationId, step: 'payment', state: 'success', idempotencyKey });
    return {
      ok: true,
      correlationId,
      idempotencyKey,
      paymentIntentId: intent.id,
      amount,
      currency,
      status: intent.status,
    };
  } catch (err: any) {
    // Map common Stripe errors
    const code = err?.code || err?.type || '';
    if (
      code.includes('api_connection') ||
      code.includes('rate_limit') ||
      code.includes('api_error') ||
      code.includes('idempotency')
    ) {
      logger.warn('stripe_transient_error', { correlationId, step: 'payment', state: 'error', errorType: 'TransientProviderError', errorCode: code });
      throw new Error('TransientProviderError');
    }
    if (code.includes('card_error') || code.includes('invalid_request')) {
      // Could also map to a domain-specific fatal error class
      logger.error('stripe_fatal_error', { correlationId, step: 'payment', state: 'error', errorType: 'FatalProviderError', errorCode: code });
      throw new Error('FatalProviderError');
    }
    // Default to transient to be safe
    logger.warn('stripe_unknown_error', { correlationId, step: 'payment', state: 'error', errorType: 'TransientProviderError' });
    throw new Error('TransientProviderError');
  }
}

