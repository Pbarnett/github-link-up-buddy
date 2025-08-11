// src/functions/refund-payment-stub.ts
// Idempotent refund stub
import { LedgerService } from '@/services/ledgerService';
import { logger } from './_lib/logger';

interface Event {
  correlationId: string;
  idempotencyKey: string; // distinct from charge key
  amount: number; // cents
}

export async function handler(event: Event) {
  const { correlationId, idempotencyKey, amount } = event || ({} as Event);

  if (!correlationId || !idempotencyKey || !Number.isFinite(amount)) {
    logger.error('refund_validation_error', { correlationId, step: 'refund', state: 'error', errorType: 'ValidationError' });
    throw new Error('ValidationError');
  }

  const ledger = new LedgerService();
  logger.info('refund_attempt', { correlationId, step: 'refund', state: 'attempt', idempotencyKey, amount });

  try {
    await ledger.recordRefundAttempt(idempotencyKey, correlationId, amount);
  } catch (e) {
    const msg = String(e);
    if (!msg.includes('ConditionalCheckFailed')) {
      logger.warn('refund_attempt_record_failed', { correlationId, step: 'refund', state: 'record', errorType: 'TransientProviderError' });
      throw new Error('TransientProviderError');
    }
  }

  const refundId = `re_${Math.random().toString(36).slice(2, 12)}`;

  try {
    await ledger.markRefundCompleted(idempotencyKey, refundId);
  } catch (e) {
    logger.warn('refund_mark_complete_failed', { correlationId, step: 'refund', state: 'record', errorType: 'TransientProviderError' });
    throw new Error('TransientProviderError');
  }

  logger.info('refund_success', { correlationId, step: 'refund', state: 'success', idempotencyKey });
  return { ok: true, correlationId, idempotencyKey, refundId, amount };
}
