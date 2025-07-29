-- Alter payments table to make stripe_payment_intent_id nullable
-- This supports scenarios where a payment record might be for an old Stripe Checkout session
-- or when a payment record is created before a PaymentIntent ID is available.
ALTER TABLE public.payments
ALTER COLUMN stripe_payment_intent_id DROP NOT NULL;
