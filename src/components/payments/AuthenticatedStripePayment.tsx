import React, { useCallback, useMemo, useState } from 'react';
import StripePaymentForm from '@/components/StripePaymentForm';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';

export interface AuthenticatedStripePaymentProps {
  amount: number;
  currency: string;
  offerId: string;
  passengers: any[];
  onSuccess: (paymentResult: any) => void;
  onError: (error: string) => void;
  onProcessing: (processing: boolean) => void;
  reason?: 'checkout' | 'save' | 'track' | 'generic';
}

/**
 * A drop-in wrapper around StripePaymentForm that ensures the user is authenticated
 * before creating a PaymentIntent or confirming payment. If unauthenticated, it opens
 * the AuthModal and preserves returnTo.
 */
export default function AuthenticatedStripePayment({
  amount,
  currency,
  offerId,
  passengers,
  onSuccess,
  onError,
  onProcessing,
  reason = 'checkout'
}: AuthenticatedStripePaymentProps) {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const fullReturnTo = useMemo(() => {
    try {
      return `${window.location.origin}${window.location.pathname}${window.location.search}${window.location.hash}`;
    } catch {
      return undefined;
    }
  }, []);

  const handleRequireAuth = useCallback(() => {
    try {
      const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}` || '/';
      sessionStorage.setItem('returnTo', returnTo);
    } catch {}
    setAuthOpen(true);
  }, []);

  return (
    <>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} reason={reason} returnTo={fullReturnTo} />
      <StripePaymentForm
        amount={amount}
        currency={currency}
        offerId={offerId}
        passengers={passengers}
        onSuccess={onSuccess}
        onError={onError}
        onProcessing={onProcessing}
        onRequireAuth={handleRequireAuth}
      />
    </>
  );
}

