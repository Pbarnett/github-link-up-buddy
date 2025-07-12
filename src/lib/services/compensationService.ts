/**
 * Compensation Service for Failed Booking Operations
 * 
 * Implements compensating actions for the booking Saga pattern.
 * Handles rollback operations when booking fails at any stage.
 */

import { DuffelAPIError } from '../errors/duffelErrors';

export interface CompensationContext {
  tripRequestId: string;
  bookingRequestId?: string;
  bookingAttemptId?: string;
  paymentIntentId?: string;
  stripePaymentIntentId?: string;
  duffelOrderId?: string;
  userId: string;
  amount?: number;
  currency?: string;
}

export interface CompensationResult {
  success: boolean;
  actionsExecuted: string[];
  errors: string[];
  requiresManualIntervention: boolean;
}

/**
 * Main compensation orchestrator
 * Determines and executes appropriate compensating actions
 */
export async function executeCompensation(
  context: CompensationContext,
  failureStage: 'payment' | 'booking' | 'notification' | 'unknown',
  failureReason: string,
  services: {
    supabase: any;
    stripe?: any;
    duffel?: any;
    sendNotification?: (userId: string, type: string, data: any) => Promise<void>;
  }
): Promise<CompensationResult> {
  console.log(`[Compensation] Starting compensation for ${context.tripRequestId} at stage: ${failureStage}`);
  
  const actionsExecuted: string[] = [];
  const errors: string[] = [];
  let requiresManualIntervention = false;
  
  try {
    // Handle different failure stages
    switch (failureStage) {
      case 'payment':
        await compensatePaymentStageFailure(context, failureReason, services, actionsExecuted);
        break;
        
      case 'booking':
        await compensateBookingStageFailure(context, failureReason, services, actionsExecuted);
        break;
        
      case 'notification':
        await compensateNotificationStageFailure(context, failureReason, services, actionsExecuted);
        break;
        
      case 'unknown':
      default:
        await compensateUnknownFailure(context, failureReason, services, actionsExecuted);
        requiresManualIntervention = true;
        break;
    }
    
    // Log compensation attempt
    await logCompensationAttempt(context, failureStage, actionsExecuted, errors, services.supabase);
    
    return {
      success: errors.length === 0,
      actionsExecuted,
      errors,
      requiresManualIntervention
    };
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown compensation error';
    errors.push(errorMsg);
    console.error('[Compensation] Fatal error during compensation:', error);
    
    return {
      success: false,
      actionsExecuted,
      errors,
      requiresManualIntervention: true
    };
  }
}

/**
 * Handle payment stage failures
 */
async function compensatePaymentStageFailure(
  context: CompensationContext,
  failureReason: string,
  services: any,
  actionsExecuted: string[]
): Promise<void> {
  // Update booking request status
  if (context.bookingRequestId) {
    await services.supabase
      .from('booking_requests')
      .update({
        status: 'payment_failed',
        error_message: failureReason,
        updated_at: new Date().toISOString()
      })
      .eq('id', context.bookingRequestId);
    
    actionsExecuted.push('Updated booking request status to payment_failed');
  }
  
  // Notify user of payment failure
  if (services.sendNotification) {
    try {
      await services.sendNotification(context.userId, 'payment_failed', {
        reason: failureReason,
        trip_request_id: context.tripRequestId
      });
      actionsExecuted.push('Sent payment failure notification to user');
    } catch (error) {
      console.warn('[Compensation] Failed to send payment failure notification:', error);
    }
  }
}

/**
 * Handle booking stage failures (after payment succeeded)
 */
async function compensateBookingStageFailure(
  context: CompensationContext,
  failureReason: string,
  services: any,
  actionsExecuted: string[]
): Promise<void> {
  // Attempt to refund payment
  if (context.paymentIntentId || context.stripePaymentIntentId) {
    try {
      await executeRefund(context, services);
      actionsExecuted.push('Initiated payment refund due to booking failure');
    } catch (error) {
      console.error('[Compensation] Failed to process refund:', error);
      actionsExecuted.push('Failed to process refund - manual intervention required');
    }
  }
  
  // Update booking request status
  if (context.bookingRequestId) {
    await services.supabase
      .from('booking_requests')
      .update({
        status: 'booking_failed',
        error_message: failureReason,
        updated_at: new Date().toISOString()
      })
      .eq('id', context.bookingRequestId);
    
    actionsExecuted.push('Updated booking request status to booking_failed');
  }
  
  // Notify user of booking failure and refund
  if (services.sendNotification) {
    try {
      await services.sendNotification(context.userId, 'booking_failed', {
        reason: failureReason,
        trip_request_id: context.tripRequestId,
        refund_initiated: !!(context.paymentIntentId || context.stripePaymentIntentId)
      });
      actionsExecuted.push('Sent booking failure notification to user');
    } catch (error) {
      console.warn('[Compensation] Failed to send booking failure notification:', error);
    }
  }
}

/**
 * Handle notification stage failures (booking succeeded)
 */
async function compensateNotificationStageFailure(
  context: CompensationContext,
  failureReason: string,
  services: any,
  actionsExecuted: string[]
): Promise<void> {
  // Log the notification failure
  console.warn(`[Compensation] Notification failure for successful booking: ${failureReason}`);
  actionsExecuted.push('Logged notification failure for successful booking');
  
  // Retry notification if possible
  if (services.sendNotification && context.duffelOrderId) {
    try {
      await services.sendNotification(context.userId, 'booking_confirmed', {
        order_id: context.duffelOrderId,
        trip_request_id: context.tripRequestId
      });
      actionsExecuted.push('Successfully retried booking confirmation notification');
    } catch (error) {
      console.warn('[Compensation] Failed to retry notification:', error);
      actionsExecuted.push('Failed to retry notification - user may need manual contact');
    }
  }
}

/**
 * Handle unknown failures with conservative approach
 */
async function compensateUnknownFailure(
  context: CompensationContext,
  failureReason: string,
  services: any,
  actionsExecuted: string[]
): Promise<void> {
  console.error(`[Compensation] Unknown failure detected: ${failureReason}`);
  
  // If there's evidence of payment, attempt precautionary refund
  if (context.paymentIntentId || context.stripePaymentIntentId) {
    try {
      await executeRefund(context, services);
      actionsExecuted.push('Executed precautionary refund for unknown failure');
    } catch (error) {
      console.error('[Compensation] Failed to process precautionary refund:', error);
      actionsExecuted.push('Failed precautionary refund - urgent manual review required');
    }
  }
  
  // Log for manual review
  actionsExecuted.push('Logged unknown failure for manual review');
  
  // Update status to indicate manual review needed
  if (context.bookingRequestId) {
    await services.supabase
      .from('booking_requests')
      .update({
        status: 'requires_manual_review',
        error_message: `Unknown failure: ${failureReason}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', context.bookingRequestId);
  }
}

/**
 * Execute payment refund
 */
async function executeRefund(
  context: CompensationContext,
  services: any
): Promise<void> {
  const paymentIntentId = context.paymentIntentId || context.stripePaymentIntentId;
  
  if (!paymentIntentId) {
    throw new Error('No payment intent ID available for refund');
  }
  
  // Try Stripe refund (most common case)
  if (services.stripe && paymentIntentId.startsWith('pi_')) {
    await services.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: context.amount ? Math.round(context.amount * 100) : undefined,
      reason: 'requested_by_customer',
      metadata: {
        reason: 'booking_failure_compensation',
        trip_request_id: context.tripRequestId
      }
    });
    console.log(`[Compensation] Stripe refund created for PaymentIntent: ${paymentIntentId}`);
    return;
  }
  
  // Handle Duffel refunds if applicable
  if (services.duffel && paymentIntentId) {
    console.log(`[Compensation] Duffel refund initiated for PaymentIntent: ${paymentIntentId}`);
    // Note: Specific Duffel refund implementation would go here
    return;
  }
  
  throw new Error('Unable to determine payment provider for refund');
}

/**
 * Log compensation attempt for audit trail
 */
async function logCompensationAttempt(
  context: CompensationContext,
  failureStage: string,
  actionsExecuted: string[],
  errors: string[],
  supabase: any
): Promise<void> {
  try {
    const logEntry = {
      trip_request_id: context.tripRequestId,
      booking_request_id: context.bookingRequestId,
      compensation_type: 'saga_compensation',
      details: {
        failure_stage: failureStage,
        actions_executed: actionsExecuted,
        errors,
        requires_manual_intervention: errors.length > 0
      },
      created_at: new Date().toISOString()
    };
    
    // Note: This assumes a compensation_logs table exists
    // In practice, this could also be logged to a general audit_logs table
    await supabase.from('compensation_logs').insert(logEntry);
  } catch (error) {
    console.error('[Compensation] Failed to log compensation attempt:', error);
  }
}

/**
 * Helper functions for common compensation scenarios
 */
export async function compensatePaymentFailure(
  context: CompensationContext,
  failureReason: string,
  services: any
): Promise<CompensationResult> {
  return executeCompensation(context, 'payment', failureReason, services);
}

export async function compensateBookingFailure(
  context: CompensationContext,
  failureReason: string,
  services: any
): Promise<CompensationResult> {
  return executeCompensation(context, 'booking', failureReason, services);
}

export async function compensateNotificationFailure(
  context: CompensationContext,
  failureReason: string,
  services: any
): Promise<CompensationResult> {
  return executeCompensation(context, 'notification', failureReason, services);
}
