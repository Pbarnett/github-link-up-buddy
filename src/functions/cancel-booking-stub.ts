// src/functions/cancel-booking-stub.ts
import { LedgerService } from '@/services/ledgerService';
import { logger } from './_lib/logger';

interface Event {
  correlationId: string;
}

export async function handler(event: Event) {
  const correlationId = event?.correlationId;
  if (!correlationId) {
    logger.error('cancel_validation_error', { correlationId, step: 'cancel_booking', state: 'error', errorType: 'ValidationError' });
    throw new Error('ValidationError');
  }

  const ledger = new LedgerService();
  try {
    await ledger.recordSagaStepOnce(correlationId, 'cancel_booking', correlationId, 'cancel_booking', 'completed');
  } catch (e) {
    const msg = String(e);
    if (!msg.includes('ConditionalCheckFailed')) {
      logger.warn('cancel_record_failed', { correlationId, step: 'cancel_booking', state: 'record', errorType: 'TransientProviderError' });
      throw new Error('TransientProviderError');
    }
  }

  logger.info('cancel_success', { correlationId, step: 'cancel_booking', state: 'success' });
  return { ok: true, correlationId, action: 'cancel_booking' };
}
