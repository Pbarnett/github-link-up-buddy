/**
 * Step 3: Payment Information
 * Collect and tokenize payment methods using Stripe Elements
 */

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { withErrorBoundary } from '@/components/ErrorBoundary';
import { trackCampaignEvent } from '@/utils/monitoring';

// Initialize Stripe.js with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// Validation schema for payment step
const paymentSchema = z.object({
  saveCard: z.boolean().default(true),
  agreeToPaymentTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the payment terms',
  }),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

interface StepPaymentProps {
  onNext: (paymentMethodId: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

function StepPayment({ onNext, onBack, isLoading = false }: StepPaymentProps) {
  const { control, handleSubmit, formState: { errors }, watch } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      saveCard: true,
      agreeToPaymentTerms: false,
    },
  });

  const stripe = useStripe();
  const elements = useElements();

  const handleFormSubmit = async (data: PaymentFormData) => {
    if (!stripe || !elements) {
      console.error("Stripe.js hasn't loaded yet.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Create payment method via Stripe
    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement as any, // Type assertion to resolve compatibility issue
        billing_details: {
          name: 'Jenny Rosen', // TODO: Use actual cardholder name
        },
      });

      if (error) {
        console.error(error);
        return;
      }

      trackCampaignEvent('wizard_step_completed', 'temp-id', {
        step_name: 'payment',
        payment_method_id: paymentMethod?.id,
        save_card: data.saveCard,
      });

      onNext(paymentMethod?.id || '');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const watchSaveCard = watch('saveCard');

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
        <CardDescription>
          Safely enter your payment information. Your card details are encrypted and processed by Stripe.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Credit Card Details */}
          <div className="space-y-4">
            <Label htmlFor="cardNumber">Credit Card *</Label>
            <div className="border rounded-md p-2">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
            <p className="text-sm text-gray-500">
              Powered by Stripe - We never store your credit card info
            </p>
          </div>

          {/* Save Card Option */}
          <div className="flex items-center space-x-2">
            <Controller
              name="saveCard"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="saveCard"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="saveCard" className="text-sm">
              Save this card for future payments
            </Label>
          </div>

          {/* Privacy & Terms */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Controller
                name="agreeToPaymentTerms"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="agreeToPaymentTerms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={errors.agreeToPaymentTerms ? 'border-red-500' : ''}
                  />
                )}
              />
              <Label htmlFor="agreeToPaymentTerms" className="text-sm">
                I agree to the <a href="/payment-terms" className="text-blue-600 hover:underline">Payment Terms</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> *
              </Label>
            </div>
            {errors.agreeToPaymentTerms && (
              <p className="text-sm text-red-500">{errors.agreeToPaymentTerms.message}</p>
            )}
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your payment method is handled securely by Stripe. Parker Flight never stores your card details.
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isLoading}
            >
              Back
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading || !stripe || !elements}
            >
              {isLoading ? 'Processing...' : 'Next: Review & Confirm'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const WrappedStepPayment = withErrorBoundary(StepPayment, 'component');

export default function StepPaymentWrapper(props: StepPaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <WrappedStepPayment {...props} />
    </Elements>
  );
}

