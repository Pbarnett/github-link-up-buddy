import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { createClient } from '@supabase/supabase-js';

type FC<T = {}> = React.FC<T>;
type FormEvent = React.FormEvent;
// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

// Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface PaymentFormProps {
  amount: number;
  currency: string;
  offerId: string;
  passengers: Array<{
    given_name?: string;
    family_name?: string;
    email?: string;
    [key: string]: unknown;
  }>;
  onSuccess: (paymentResult: { booking: unknown; payment: unknown }) => void;
  onError: (error: string) => void;
  onProcessing: (processing: boolean) => void;
}

// Note: DuffelPaymentDetails interface removed as it's not used

const PaymentForm: FC<PaymentFormProps> = ({
  amount,
  currency,
  offerId,
  passengers,
  onSuccess,
  onError,
  onProcessing,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Create payment intent on component mount
  const createPaymentIntent = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        'create-payment-session',
        {
          body: {
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency.toLowerCase(),
            metadata: {
              offer_id: offerId,
              passenger_count: passengers.length,
            },
          },
        }
      );

      if (error) {
        onError(`Failed to create payment session: ${error.message}`);
        return;
      }

      setClientSecret(data.client_secret);
    } catch {
      onError('Failed to initialize payment');
    }
  }, [amount, currency, offerId, passengers.length, onError]);

  useEffect(() => {
    createPaymentIntent();
  }, [createPaymentIntent]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      onError('Payment system not ready');
      return;
    }

    setProcessing(true);
    onProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      onError('Card element not found');
      setProcessing(false);
      onProcessing(false);
      return;
    }

    try {
      // Create 3D Secure session for Duffel
      const threeDSResult = await create3DSecureSession(offerId, cardElement);

      if (!threeDSResult.success) {
        onError(threeDSResult.error || 'Failed to verify payment');
        setProcessing(false);
        onProcessing(false);
        return;
      }

      // Confirm payment with Stripe
      const { error: paymentError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${passengers[0]?.given_name} ${passengers[0]?.family_name}`,
              email: passengers[0]?.email,
            },
          },
        });

      if (paymentError) {
        onError(paymentError.message || 'Payment failed');
        setProcessing(false);
        onProcessing(false);
        return;
      }

      // Process Duffel booking with payment confirmation
      const bookingResult = await processDuffelBooking({
        offerId,
        passengers,
        payment: {
          type: 'card',
          three_d_secure_session_id: threeDSResult.sessionId,
          currency,
          amount: amount.toFixed(2),
        },
        stripe_payment_intent_id: paymentIntent.id,
      });

      if (bookingResult.success) {
        onSuccess({
          booking: bookingResult.booking,
          payment: paymentIntent,
        });
      } else {
        onError(bookingResult.error || 'Booking failed');
      }
    } catch (err) {
      onError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setProcessing(false);
      onProcessing(false);
    }
  };

  const create3DSecureSession = async (
    offerId: string,
    cardElement: unknown
  ) => {
    try {
      // Create temporary card with Duffel
      const { data: cardData, error: cardError } =
        await supabase.functions.invoke('duffel-create-card', {
          body: {
            card_element: cardElement,
            cardholder_name: `${passengers[0]?.given_name} ${passengers[0]?.family_name}`,
          },
        });

      if (cardError) {
        return { success: false, error: 'Failed to create card token' };
      }

      // Create 3DS session
      const { data: sessionData, error: sessionError } =
        await supabase.functions.invoke('duffel-3ds-session', {
          body: {
            card_id: cardData.card_id,
            offer_id: offerId,
            cardholder_present: true,
          },
        });

      if (sessionError) {
        return { success: false, error: 'Failed to create 3DS session' };
      }

      return {
        success: true,
        sessionId: sessionData.session_id,
      };
    } catch {
      return {
        success: false,
        error: 'Payment verification failed',
      };
    }
  };

  const processDuffelBooking = async (bookingData: Record<string, unknown>) => {
    try {
      const { data, error } = await supabase.functions.invoke('duffel-book', {
        body: bookingData,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, booking: data };
    } catch {
      return { success: false, error: 'Booking processing failed' };
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="card-element-container">
        <label
          htmlFor="card-element"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Card Information
        </label>
        <div className="p-3 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-blue-500">
          <CardElement id="card-element" options={cardElementOptions} />
        </div>
      </div>

      <div className="payment-summary mt-4 p-4 bg-gray-50 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Amount:</span>
          <span className="text-lg font-semibold">
            {currency.toUpperCase()} {amount.toFixed(2)}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Secure payment powered by Stripe & Duffel
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing || !clientSecret}
        className={`w-full mt-6 py-3 px-4 rounded-md font-medium transition-colors ${
          processing || !stripe || !clientSecret
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {processing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          `Pay ${currency.toUpperCase()} ${amount.toFixed(2)}`
        )}
      </button>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Your payment is secure and encrypted</span>
        </div>
        <div className="mt-1">Protected by 3D Secure authentication</div>
      </div>
    </form>
  );
};

const StripePaymentForm: FC<PaymentFormProps> = props => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default StripePaymentForm;
