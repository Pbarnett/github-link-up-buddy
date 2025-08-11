// src/functions/validate-booking-input.ts
import { BookingInputSchema } from '@shared/booking/types';
import { logger } from './_lib/logger';

interface HandlerEvent {
  correlationId?: string;
  input?: unknown;
}

interface HandlerResult {
  isValid: boolean;
  data?: any;
}

export async function handler(event: HandlerEvent): Promise<HandlerResult> {
  const correlationId = event.correlationId || 'unknown-correlation';
  try {
    const parsed = BookingInputSchema.parse(event.input);
    logger.info('input_validation_success', { correlationId, step: 'input_validation', state: 'success' });
    return { isValid: true, data: parsed };
  } catch (err: any) {
    logger.error('input_validation_error', { correlationId, step: 'input_validation', state: 'error', errorType: 'ValidationError', errorCode: err?.name, message: err?.message });
    // In AWS, you would throw a typed error (e.g., new Error('ValidationError')) so SFN Catch can route
    throw new Error('ValidationError');
  }
}

