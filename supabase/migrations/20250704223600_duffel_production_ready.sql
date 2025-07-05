-- Migration: Production-ready Duffel integration enhancements
-- This migration adds critical missing pieces for production deployment

-- 1. Enhanced booking_attempts table for better state tracking
ALTER TABLE public.booking_attempts 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS started_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS ended_at timestamptz,
ADD COLUMN IF NOT EXISTS error_message text,
ADD COLUMN IF NOT EXISTS stripe_charge_id text,
ADD COLUMN IF NOT EXISTS duffel_offer_id text,
ADD COLUMN IF NOT EXISTS idempotency_key text UNIQUE;

-- Remove the UNIQUE constraint on trip_request_id to allow multiple attempts
ALTER TABLE public.booking_attempts DROP CONSTRAINT IF EXISTS booking_attempts_trip_request_id_key;

-- Add composite index for performance
CREATE INDEX IF NOT EXISTS idx_booking_attempts_trip_status ON public.booking_attempts(trip_request_id, status);
CREATE INDEX IF NOT EXISTS idx_booking_attempts_idempotency ON public.booking_attempts(idempotency_key);

-- 2. Add essential feature flags for Duffel integration
INSERT INTO public.feature_flags (name, enabled, description) VALUES 
  ('duffel_live_enabled', false, 'Enable live Duffel API for production bookings'),
  ('duffel_webhooks_enabled', false, 'Enable Duffel webhook processing'),
  ('auto_booking_enhanced', false, 'Enable enhanced auto-booking with Duffel')
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- 3. Enhance bookings table with critical missing fields
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text,
ADD COLUMN IF NOT EXISTS booking_attempt_id uuid REFERENCES public.booking_attempts(id),
ADD COLUMN IF NOT EXISTS expires_at timestamptz,
ADD COLUMN IF NOT EXISTS passenger_data jsonb;

-- 4. Create optimized indexes for production performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON public.bookings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_attempt_id ON public.bookings(booking_attempt_id);
CREATE INDEX IF NOT EXISTS idx_bookings_expires_at ON public.bookings(expires_at) WHERE expires_at IS NOT NULL;

-- 5. Enhanced RPC function for idempotent booking creation
CREATE OR REPLACE FUNCTION public.rpc_create_booking_attempt(
  p_trip_request_id uuid,
  p_idempotency_key text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY definer
AS $$
DECLARE
  v_attempt_id uuid;
  v_existing_attempt jsonb;
  v_result jsonb;
BEGIN
  -- Check for existing attempt with same idempotency key
  SELECT jsonb_build_object(
    'attempt_id', id,
    'status', status,
    'created_at', started_at,
    'error', error_message
  ) INTO v_existing_attempt
  FROM booking_attempts 
  WHERE idempotency_key = p_idempotency_key;
  
  IF v_existing_attempt IS NOT NULL THEN
    -- Return existing attempt (idempotent operation)
    RETURN jsonb_build_object(
      'success', true,
      'existing', true,
      'attempt', v_existing_attempt
    );
  END IF;
  
  -- Create new booking attempt
  INSERT INTO booking_attempts (
    trip_request_id,
    status,
    started_at,
    idempotency_key
  ) VALUES (
    p_trip_request_id,
    'pending',
    now(),
    p_idempotency_key
  )
  RETURNING id INTO v_attempt_id;
  
  SELECT jsonb_build_object(
    'attempt_id', v_attempt_id,
    'status', 'pending',
    'created_at', now()
  ) INTO v_result;
  
  RETURN jsonb_build_object(
    'success', true,
    'existing', false,
    'attempt', v_result
  );
END;
$$;

-- 6. Enhanced function for atomic booking completion
CREATE OR REPLACE FUNCTION public.rpc_complete_duffel_booking(
  p_attempt_id uuid,
  p_duffel_order_id text,
  p_stripe_payment_intent_id text,
  p_price numeric,
  p_currency text DEFAULT 'USD',
  p_raw_order jsonb DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY definer
AS $$
DECLARE
  v_attempt record;
  v_booking_id uuid;
  v_result jsonb;
BEGIN
  -- Get attempt details
  SELECT * INTO v_attempt
  FROM booking_attempts 
  WHERE id = p_attempt_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking attempt not found' USING ERRCODE = 'P0002';
  END IF;
  
  -- Create booking record
  INSERT INTO bookings (
    user_id,
    trip_request_id,
    booking_attempt_id,
    provider,
    duffel_order_id,
    stripe_payment_intent_id,
    price,
    currency,
    status,
    duffel_status,
    duffel_raw_order,
    source,
    booked_at
  ) 
  SELECT 
    tr.user_id,
    v_attempt.trip_request_id,
    p_attempt_id,
    'duffel',
    p_duffel_order_id,
    p_stripe_payment_intent_id,
    p_price,
    p_currency,
    'confirmed',
    'ticketed',
    p_raw_order,
    'auto',
    now()
  FROM trip_requests tr 
  WHERE tr.id = v_attempt.trip_request_id
  RETURNING id INTO v_booking_id;
  
  -- Update attempt status
  UPDATE booking_attempts SET
    status = 'completed',
    ended_at = now()
  WHERE id = p_attempt_id;
  
  SELECT jsonb_build_object(
    'booking_id', v_booking_id,
    'status', 'confirmed',
    'duffel_order_id', p_duffel_order_id
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

-- 7. Function for atomic booking failure with compensation
CREATE OR REPLACE FUNCTION public.rpc_fail_booking_attempt(
  p_attempt_id uuid,
  p_error_message text,
  p_stripe_refund_id text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY definer
AS $$
BEGIN
  UPDATE booking_attempts SET
    status = 'failed',
    ended_at = now(),
    error_message = p_error_message
  WHERE id = p_attempt_id;
  
  -- Log refund if provided
  IF p_stripe_refund_id IS NOT NULL THEN
    UPDATE booking_attempts SET
      error_message = error_message || ' (Refunded: ' || p_stripe_refund_id || ')'
    WHERE id = p_attempt_id;
  END IF;
  
  RETURN FOUND;
END;
$$;

-- 8. Add helpful views for monitoring
CREATE OR REPLACE VIEW public.booking_attempts_summary AS
SELECT 
  ba.id,
  ba.trip_request_id,
  tr.user_id,
  ba.status,
  ba.started_at,
  ba.ended_at,
  ba.error_message,
  ba.stripe_charge_id,
  ba.duffel_offer_id,
  (ba.ended_at - ba.started_at) as duration,
  b.id as booking_id,
  b.duffel_order_id
FROM booking_attempts ba
JOIN trip_requests tr ON ba.trip_request_id = tr.id
LEFT JOIN bookings b ON ba.id = b.booking_attempt_id;

-- Grant access to the view
GRANT SELECT ON public.booking_attempts_summary TO authenticated;

-- 9. Add comments for documentation
COMMENT ON COLUMN public.booking_attempts.idempotency_key IS 'Unique key to prevent duplicate booking attempts';
COMMENT ON COLUMN public.booking_attempts.stripe_charge_id IS 'Stripe PaymentIntent ID for tracking payments';
COMMENT ON COLUMN public.booking_attempts.duffel_offer_id IS 'Duffel offer ID that was attempted to book';
COMMENT ON FUNCTION public.rpc_create_booking_attempt IS 'Idempotently create a booking attempt with unique key';
COMMENT ON FUNCTION public.rpc_complete_duffel_booking IS 'Atomically complete a Duffel booking with all required data';
COMMENT ON FUNCTION public.rpc_fail_booking_attempt IS 'Mark booking attempt as failed with error details';
