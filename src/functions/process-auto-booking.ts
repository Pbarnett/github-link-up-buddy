// src/functions/process-auto-booking.ts
import { LedgerService } from '@/services/ledgerService';
import { logger } from './_lib/logger';

interface HandlerEvent {
  correlationId?: string;
  bookingData?: any;
}

export async function handler(event: HandlerEvent) {
  const correlationId = event.correlationId || 'unknown-correlation';
  logger.info('process_booking_start', { correlationId, step: 'process_booking', state: 'started' });
  try {
    const ledger = new LedgerService();
    await ledger.recordSagaStep(correlationId, 'process_booking_started', correlationId, 'process_booking', 'completed');
  } catch (e) {
    logger.warn('saga_record_failed', { correlationId, step: 'process_booking', state: 'record', errorType: 'SagaWriteFailed' });
  }

  // Simulated error controls (safe defaults):
  // - Set env PROCESS_SIMULATE=transient|fatal to test ASL retry/catch behavior
  // - Or include event.bookingData.simulate = 'transient' | 'fatal'
  const simulate = (event.bookingData && event.bookingData.simulate) || process.env.PROCESS_SIMULATE;
  if (simulate === 'transient') {
    logger.warn('simulate_transient_error', { correlationId, step: 'process_booking', state: 'simulated', errorType: 'TransientProviderError' });
    throw new Error('TransientProviderError');
  }
  if (simulate === 'fatal') {
    logger.error('simulate_fatal_error', { correlationId, step: 'process_booking', state: 'simulated', errorType: 'FatalProviderError' });
    throw new Error('FatalProviderError');
  }

  // Minimal placeholder: pretend booking succeeded and return a bookingId
  const bookingId = `bk_${Math.random().toString(36).slice(2, 10)}`;

  const result = {
    statusCode: 200,
    bookingId,
    status: 'SUCCEEDED',
    correlationId,
  };

  logger.info('process_booking_success', { correlationId, step: 'process_booking', state: 'success' });
  try {
    const ledger = new LedgerService();
    await ledger.recordSagaStep(correlationId, 'process_booking_succeeded', correlationId, 'process_booking', 'completed');
  } catch (e) {
    logger.warn('saga_record_failed', { correlationId, step: 'process_booking', state: 'record', errorType: 'SagaWriteFailed' });
  }
  return result;
}

