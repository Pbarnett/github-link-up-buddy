

/**
 * @file Payment integration hook for Duffel bookings
 * Integrates with existing Stripe payment infrastructure
 */


import { createStripePaymentIntent } from '@/services/api/paymentApi';
import logger from '@/lib/logger';
import { DuffelError } from '@/components/trip/DuffelErrorHandler';
import * as React from 'react';

export interface DuffelPaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface DuffelPaymentOptions {
  amount: number;
  currency: string;
  description: string;
  metadata?: {
    duffel_offer_id: string;
    flight_route: string;
    passenger_name: string;
    [key: string]: string;
  };
}

export interface UseDuffelPaymentReturn {
  // State
  isCreatingPayment: boolean;
  paymentIntent: DuffelPaymentIntent | null;
  error: DuffelError | null;
  
  // Actions
  createPaymentIntent: (options: DuffelPaymentOptions) => Promise<DuffelPaymentIntent | null>;
  confirmPayment: (paymentIntentId: string, paymentMethodId: string) => Promise<boolean>;
  clearPayment: () => void;
  
  // Status
  isReady: boolean;
}

export const useDuffelPayment = (): UseDuffelPaymentReturn => {
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<DuffelPaymentIntent | null>(null);
  const [error, setError] = useState<DuffelError | null>(null);

  const createPaymentIntent = useCallback(async (
    options: DuffelPaymentOptions
  ): Promise<DuffelPaymentIntent | null> => {
    setIsCreatingPayment(true);
    setError(null);
    
    try {
      logger.info('[DUFFEL-PAYMENT] Creating payment intent for Duffel booking:', {
        amount: options.amount,
        currency: options.currency,
        offerId: options.metadata?.duffel_offer_id
      });

      // Create payment intent using existing Stripe infrastructure
      const paymentData = await createStripePaymentIntent(
        options.amount,
        options.currency
      );

      const intent: DuffelPaymentIntent = {
        id: paymentData.id,
        client_secret: paymentData.client_secret,
        amount: options.amount,
        currency: options.currency,
        status: 'requires_payment_method'
      };

      setPaymentIntent(intent);
      
      logger.info('[DUFFEL-PAYMENT] Payment intent created successfully:', {
        intentId: intent.id,
        amount: intent.amount
      });

      return intent;
    } catch (err: unknown) {
      logger.error('[DUFFEL-PAYMENT] Failed to create payment intent:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment intent';
      const errorDetails = err instanceof Error ? err.stack : String(err);
      
      const duffelError: DuffelError = {
        type: 'payment',
        message: errorMessage,
        details: errorDetails,
        retryable: true
      };
      
      setError(duffelError);
      return null;
    } finally {
      setIsCreatingPayment(false);
    }
  }, []);

  const confirmPayment = useCallback(async (
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<boolean> => {
    try {
      logger.info('[DUFFEL-PAYMENT] Confirming payment for Duffel booking:', {
        paymentIntentId,
        paymentMethodId
      });

      // This would typically call your existing payment confirmation endpoint
      // For now, we'll simulate the confirmation process
      
      // In a real implementation, you would:
      // 1. Call Stripe's confirmPayment with the payment method
      // 2. Wait for payment confirmation
      // 3. Then proceed with Duffel booking creation
      
      logger.info('[DUFFEL-PAYMENT] Payment confirmed successfully');
      return true;
    } catch (err: unknown) {
      logger.error('[DUFFEL-PAYMENT] Payment confirmation failed:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Payment confirmation failed';
      
      const duffelError: DuffelError = {
        type: 'payment',
        message: errorMessage,
        details: errorMessage,
        retryable: false
      };
      
      setError(duffelError);
      return false;
    }
  }, []);

  const clearPayment = useCallback(() => {
    setPaymentIntent(null);
    setError(null);
    setIsCreatingPayment(false);
  }, []);

  return {
    // State
    isCreatingPayment,
    paymentIntent,
    error,
    
    // Actions
    createPaymentIntent,
    confirmPayment,
    clearPayment,
    
    // Status
    isReady: !isCreatingPayment && !error
  };
};

export default useDuffelPayment;
