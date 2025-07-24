// AddCardModal.tsx - Modal for adding a new card via Stripe Elements
// Day 4: Payments & Wallet System

import * as React from 'react';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';

type FC<T = {}> = React.FC<T>;
type FormEvent = React.FormEvent;

// Load Stripe Object
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface AddCardFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddCardForm: FC<AddCardFormProps> = ({ onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { addPaymentMethod } = useWallet();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    // Request a client secret from your server
    const idempotencyKey = new Date().toISOString(); // Generate a unique key for this operation
    const clientSecret = await addPaymentMethod(idempotencyKey);
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) return;

    const { error } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'Failed to setup payment method');
    } else {
      onSuccess(); // Notify parent component of success
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      <Button type="submit" disabled={!stripe || !elements}>
        Add Card
      </Button>
      <Button type="button" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
};

export const AddCardModal: FC<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  return (
    <Elements stripe={stripePromise}>
      <div className="bg-white shadow-lg rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Card</h2>
        <AddCardForm onSuccess={closeModal} onCancel={closeModal} />
      </div>
    </Elements>
  );
};
