// src/functions/payment-stub.ts
// Minimal idempotent payment stub: records attempt and returns a fake paymentIntentId
import { LedgerService } from '@/services/ledgerService';
import { logger } from './_lib/logger';

interface Event {
  correlationId: string;
  idempotencyKey: string; // required for idempotency
  amount: number; // cents
}

export async function handler(event: Event) {
  const { correlationId, idempotencyKey, amount } = event || ({} as Event);

  if (!correlationId || !idempotencyKey || !Number.isFinite(amount)) {
    // Validation error: let ASL route to ValidationFailed if used there
    logger.error('payment_validation_error', { correlationId, step: 'payment', state: 'error', errorType: 'ValidationError' });
    throw new Error('ValidationError');
  }

  const ledger = new LedgerService();
  logger.info('payment_attempt', { correlationId, step: 'payment', state: 'attempt', idempotencyKey, amount });

  // Record attempt (dedupe via condition expression inside the call)
  try {
    await ledger.recordPaymentAttempt(idempotencyKey, correlationId, amount);
  } catch (e) {
    // If the key already exists, treat as idempotent re-invocation (ok)
    // Otherwise map to transient for retries
    const msg = String(e);
    if (!msg.includes('ConditionalCheckFailed')) {
      logger.warn('payment_attempt_record_failed', { correlationId, step: 'payment', state: 'record', errorType: 'TransientProviderError' });
      throw new Error('TransientProviderError');
    }
  }

  // Simulate creating a payment intent idempotently
  const paymentIntentId = `pi_${Math.random().toString(36).slice(2, 12)}`;

  try {
    await ledger.markPaymentCompleted(idempotencyKey, paymentIntentId);
  } catch (e) {
    // Marking completion failed (transient infra issue) => allow retry
    logger.warn('payment_mark_complete_failed', { correlationId, step: 'payment', state: 'record', errorType: 'TransientProviderError' });
    throw new Error('TransientProviderError');
  }

  logger.info('payment_success', { correlationId, step: 'payment', state: 'success', idempotencyKey });
  return {
    ok: true,
    correlationId,
    idempotencyKey,
    paymentIntentId,
    amount,
  };
}

