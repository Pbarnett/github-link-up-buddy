/**
 * Booking Saga Pattern Implementation
 * 
 * Implements the Saga pattern for distributed transaction management
 * in the flight booking system. Ensures data consistency by providing
 * compensating actions for failed booking operations.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { captureException, addBreadcrumb } from './sentry.ts';

// Saga step states
export enum SagaStepState {
  PENDING = 'pending',
  COMPLETED = 'completed',
  COMPENSATING = 'compensating',
  COMPENSATED = 'compensated',
  FAILED = 'failed'
}

// Saga transaction states
export enum SagaTransactionState {
  STARTED = 'started',
  EXECUTING = 'executing',
  COMPLETED = 'completed',
  COMPENSATING = 'compensating',
  COMPENSATED = 'compensated',
  FAILED = 'failed'
}

// Saga step definition
export interface SagaStep {
  stepId: string;
  stepName: string;
  execute: () => Promise<any>;
  compensate: () => Promise<void>;
  isCompensatable: boolean;
  maxRetries: number;
  retryDelay: number; // in milliseconds
  metadata?: Record<string, any>;
}

// Saga transaction definition
export interface SagaTransaction {
  transactionId: string;
  correlationId: string;
  steps: SagaStep[];
  state: SagaTransactionState;
  startedAt: Date;
  completedAt?: Date;
  failedAt?: Date;
  errorDetails?: any;
  compensation?: {
    startedAt: Date;
    completedAt?: Date;
    compensatedSteps: string[];
  };
}

// Saga execution result
export interface SagaExecutionResult {
  success: boolean;
  transactionId: string;
  completedSteps: string[];
  failedStep?: string;
  errorDetails?: any;
  compensationResult?: {
    success: boolean;
    compensatedSteps: string[];
    failedCompensations: string[];
  };
}

/**
 * Booking Saga Orchestrator
 * Manages the execution and compensation of booking-related distributed transactions
 */
export class BookingSaga {
  private supabase: any;
  private transactions: Map<string, SagaTransaction> = new Map();

  constructor() {
    this.supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
  }

  /**
   * Execute a saga transaction
   */
  async execute(transaction: SagaTransaction): Promise<SagaExecutionResult> {
    const startTime = Date.now();
    
    addBreadcrumb({
      message: `Starting saga transaction ${transaction.transactionId}`,
      category: 'saga',
      data: {
        transactionId: transaction.transactionId,
        correlationId: transaction.correlationId,
        stepCount: transaction.steps.length
      }
    });

    try {
      // Store transaction state
      this.transactions.set(transaction.transactionId, {
        ...transaction,
        state: SagaTransactionState.EXECUTING,
        startedAt: new Date()
      });

      // Log saga start
      await this.logSagaEvent(transaction.transactionId, 'SAGA_STARTED', {
        correlationId: transaction.correlationId,
        stepCount: transaction.steps.length
      });

      const completedSteps: string[] = [];
      let failedStep: string | undefined;
      let errorDetails: any;

      // Execute steps sequentially
      for (const step of transaction.steps) {
        try {
          addBreadcrumb({
            message: `Executing saga step: ${step.stepName}`,
            category: 'saga',
            data: { stepId: step.stepId, stepName: step.stepName }
          });

          await this.executeStepWithRetry(step);
          completedSteps.push(step.stepId);

          // Log successful step execution
          await this.logSagaEvent(transaction.transactionId, 'STEP_COMPLETED', {
            stepId: step.stepId,
            stepName: step.stepName
          });

        } catch (stepError) {
          failedStep = step.stepId;
          errorDetails = stepError;

          // Log failed step
          await this.logSagaEvent(transaction.transactionId, 'STEP_FAILED', {
            stepId: step.stepId,
            stepName: step.stepName,
            error: stepError.message
          });

          // If this step failed, we need to compensate
          const compensationResult = await this.compensateTransaction(
            transaction.transactionId,
            completedSteps,
            stepError
          );

          return {
            success: false,
            transactionId: transaction.transactionId,
            completedSteps,
            failedStep,
            errorDetails,
            compensationResult
          };
        }
      }

      // All steps completed successfully
      const updatedTransaction = this.transactions.get(transaction.transactionId)!;
      updatedTransaction.state = SagaTransactionState.COMPLETED;
      updatedTransaction.completedAt = new Date();

      await this.logSagaEvent(transaction.transactionId, 'SAGA_COMPLETED', {
        duration: Date.now() - startTime,
        completedSteps: completedSteps.length
      });

      return {
        success: true,
        transactionId: transaction.transactionId,
        completedSteps
      };

    } catch (error) {
      captureException(error, {
        transactionId: transaction.transactionId,
        correlationId: transaction.correlationId
      });

      await this.logSagaEvent(transaction.transactionId, 'SAGA_FAILED', {
        error: error.message,
        duration: Date.now() - startTime
      });

      return {
        success: false,
        transactionId: transaction.transactionId,
        completedSteps: [],
        errorDetails: error
      };
    }
  }

  /**
   * Execute a single step with retry logic
   */
  private async executeStepWithRetry(step: SagaStep): Promise<any> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= step.maxRetries; attempt++) {
      try {
        return await step.execute();
      } catch (error) {
        lastError = error;
        
        if (attempt < step.maxRetries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, step.retryDelay * attempt));
          
          addBreadcrumb({
            message: `Retrying saga step ${step.stepName} (attempt ${attempt + 1}/${step.maxRetries})`,
            category: 'saga',
            level: 'warning'
          });
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Compensate a failed transaction
   */
  private async compensateTransaction(
    transactionId: string,
    completedSteps: string[],
    originalError: any
  ): Promise<{ success: boolean; compensatedSteps: string[]; failedCompensations: string[] }> {
    
    addBreadcrumb({
      message: `Starting compensation for transaction ${transactionId}`,
      category: 'saga',
      level: 'warning',
      data: { completedSteps: completedSteps.length }
    });

    const transaction = this.transactions.get(transactionId)!;
    transaction.state = SagaTransactionState.COMPENSATING;
    transaction.compensation = {
      startedAt: new Date(),
      compensatedSteps: []
    };

    await this.logSagaEvent(transactionId, 'COMPENSATION_STARTED', {
      stepsToCompensate: completedSteps.length,
      originalError: originalError.message
    });

    const compensatedSteps: string[] = [];
    const failedCompensations: string[] = [];

    // Compensate steps in reverse order
    const stepsToCompensate = transaction.steps
      .filter(step => completedSteps.includes(step.stepId) && step.isCompensatable)
      .reverse();

    for (const step of stepsToCompensate) {
      try {
        addBreadcrumb({
          message: `Compensating step: ${step.stepName}`,
          category: 'saga',
          data: { stepId: step.stepId }
        });

        await step.compensate();
        compensatedSteps.push(step.stepId);
        transaction.compensation!.compensatedSteps.push(step.stepId);

        await this.logSagaEvent(transactionId, 'STEP_COMPENSATED', {
          stepId: step.stepId,
          stepName: step.stepName
        });

      } catch (compensationError) {
        failedCompensations.push(step.stepId);

        captureException(compensationError, {
          transactionId,
          stepId: step.stepId,
          stepName: step.stepName,
          compensationAttempt: true
        });

        await this.logSagaEvent(transactionId, 'COMPENSATION_FAILED', {
          stepId: step.stepId,
          stepName: step.stepName,
          error: compensationError.message
        });
      }
    }

    // Update transaction state
    if (failedCompensations.length === 0) {
      transaction.state = SagaTransactionState.COMPENSATED;
      transaction.compensation!.completedAt = new Date();
      
      await this.logSagaEvent(transactionId, 'COMPENSATION_COMPLETED', {
        compensatedSteps: compensatedSteps.length
      });
    } else {
      transaction.state = SagaTransactionState.FAILED;
      transaction.failedAt = new Date();
      
      await this.logSagaEvent(transactionId, 'COMPENSATION_PARTIALLY_FAILED', {
        compensatedSteps: compensatedSteps.length,
        failedCompensations: failedCompensations.length
      });
    }

    return {
      success: failedCompensations.length === 0,
      compensatedSteps,
      failedCompensations
    };
  }

  /**
   * Log saga events to database
   */
  private async logSagaEvent(
    transactionId: string,
    eventType: string,
    eventData: Record<string, any>
  ): Promise<void> {
    try {
      await this.supabase
        .from('saga_events')
        .insert({
          transaction_id: transactionId,
          event_type: eventType,
          event_data: eventData,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      // Don't fail the saga if logging fails
      console.error('Failed to log saga event:', error);
    }
  }

  /**
   * Get transaction status
   */
  getTransactionStatus(transactionId: string): SagaTransaction | undefined {
    return this.transactions.get(transactionId);
  }

  /**
   * Create a flight booking saga transaction
   */
  static createFlightBookingSaga(
    correlationId: string,
    userId: string,
    offerId: string,
    paymentData: any
  ): SagaTransaction {
    const transactionId = `booking_saga_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const steps: SagaStep[] = [
      // Step 1: Reserve offer (prevent expiration)
      {
        stepId: 'reserve_offer',
        stepName: 'Reserve Flight Offer',
        isCompensatable: true,
        maxRetries: 3,
        retryDelay: 1000,
        execute: async () => {
          // Reserve the offer to prevent expiration during booking
          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/reserve-offer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
            },
            body: JSON.stringify({
              offerId,
              userId,
              reservationDuration: 300000 // 5 minutes
            })
          });
          
          if (!response.ok) {
            throw new Error(`Failed to reserve offer: ${await response.text()}`);
          }
          
          return await response.json();
        },
        compensate: async () => {
          // Release the offer reservation
          await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/release-offer-reservation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
            },
            body: JSON.stringify({ offerId, userId })
          });
        }
      },

      // Step 2: Process payment
      {
        stepId: 'process_payment',
        stepName: 'Process Payment',
        isCompensatable: true,
        maxRetries: 2,
        retryDelay: 2000,
        execute: async () => {
          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/process-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
            },
            body: JSON.stringify({
              userId,
              paymentData,
              correlationId
            })
          });
          
          if (!response.ok) {
            throw new Error(`Payment processing failed: ${await response.text()}`);
          }
          
          return await response.json();
        },
        compensate: async () => {
          // Refund the payment
          await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/refund-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
            },
            body: JSON.stringify({
              correlationId,
              reason: 'saga_compensation'
            })
          });
        }
      },

      // Step 3: Create Duffel booking
      {
        stepId: 'create_duffel_booking',
        stepName: 'Create Duffel Booking',
        isCompensatable: true,
        maxRetries: 2,
        retryDelay: 3000,
        execute: async () => {
          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/auto-book-production`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
            },
            body: JSON.stringify({
              offerId,
              userId,
              skipPaymentProcessing: true, // Payment already processed
              correlationId
            })
          });
          
          if (!response.ok) {
            throw new Error(`Duffel booking failed: ${await response.text()}`);
          }
          
          return await response.json();
        },
        compensate: async () => {
          // Cancel the Duffel booking
          await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/cancel-booking`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
            },
            body: JSON.stringify({
              correlationId,
              reason: 'saga_compensation'
            })
          });
        }
      },

      // Step 4: Send confirmation
      {
        stepId: 'send_confirmation',
        stepName: 'Send Booking Confirmation',
        isCompensatable: false, // Email cannot be "uncomsent"
        maxRetries: 3,
        retryDelay: 1000,
        execute: async () => {
          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-booking-confirmation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
            },
            body: JSON.stringify({
              userId,
              correlationId
            })
          });
          
          if (!response.ok) {
            throw new Error(`Failed to send confirmation: ${await response.text()}`);
          }
          
          return await response.json();
        },
        compensate: async () => {
          // Cannot unsend email, but can send cancellation notice
          console.log('Email confirmation cannot be compensated');
        }
      }
    ];

    return {
      transactionId,
      correlationId,
      steps,
      state: SagaTransactionState.STARTED,
      startedAt: new Date()
    };
  }
}

// Export singleton instance
export const bookingSaga = new BookingSaga();
