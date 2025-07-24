

type FormEvent = React.FormEvent;

import * as React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { AddCardModalProps } from '@/types/wallet';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const cardElementOptions = {
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
  hidePostalCode: true,
};

interface AddCardFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

function AddCardForm({ onSuccess, onClose }: AddCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { createSetupIntent, refreshPaymentMethods } = useWallet();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create setup intent
      const setupIntentResponse = await createSetupIntent();
      
      // Confirm setup intent with card
      const { error: confirmError, setupIntent } = await stripe.confirmCardSetup(
        setupIntentResponse.client_secret,
        {
          payment_method: {
            card: card,
            billing_details: {
              // Add billing details if needed
            },
          },
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (setupIntent && setupIntent.status === 'succeeded') {
        // Refresh payment methods to show the new card
        await refreshPaymentMethods();
        
        toast({
          title: 'Card added successfully',
          description: 'Your new payment method has been saved and is ready to use.',
        });
        
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add card';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (event: StripeCardElementChangeEvent) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Card Information</label>
          <div className="p-3 border rounded-lg bg-white">
            <CardElement
              options={cardElementOptions}
              onChange={handleCardChange}
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your card information is securely processed by Stripe. We never store your full card details.
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || !cardComplete || loading}
          className="min-w-[120px]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Adding...
            </div>
          ) : (
            'Add Card'
          )}
        </Button>
      </div>
    </form>
  );
}

export function AddCardModal({ isOpen, onClose, onSuccess }: AddCardModalProps) {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Add New Payment Method
          </DialogTitle>
          <DialogDescription>
            Add a new credit or debit card to your wallet for faster checkout.
          </DialogDescription>
        </DialogHeader>
        
        <Card>
          <CardContent className="pt-6">
            <Elements stripe={stripePromise}>
              <AddCardForm onSuccess={handleSuccess} onClose={onClose} />
            </Elements>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
