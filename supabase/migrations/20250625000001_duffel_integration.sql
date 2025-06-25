-- Migration: Add Duffel integration support to existing schema
-- This migration extends the current schema to support Duffel as booking provider

-- 1. Add Duffel-specific fields to existing bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS duffel_order_id text,
ADD COLUMN IF NOT EXISTS duffel_payment_intent_id text,
ADD COLUMN IF NOT EXISTS provider text DEFAULT 'amadeus' CHECK (provider IN ('amadeus', 'duffel')),
ADD COLUMN IF NOT EXISTS pnr text, -- Airline booking reference
ADD COLUMN IF NOT EXISTS ticket_numbers jsonb, -- Array of e-ticket numbers
ADD COLUMN IF NOT EXISTS duffel_raw_order jsonb; -- Full Duffel order response

-- 2. Create Duffel payment methods table (separate from Stripe payment_methods)
CREATE TABLE IF NOT EXISTS public.duffel_payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duffel_payment_intent_id text NOT NULL,
  card_last4 text NOT NULL,
  card_brand text NOT NULL,
  exp_month integer NOT NULL,
  exp_year integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Add Duffel webhook events tracking
CREATE TABLE IF NOT EXISTS public.duffel_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text UNIQUE NOT NULL, -- Duffel's event.id for idempotency
  event_type text NOT NULL,
  order_id text, -- Duffel order ID if applicable
  payload jsonb NOT NULL,
  processed boolean DEFAULT false,
  processing_error text,
  received_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- 4. Extend trip_requests to track Duffel auto-booking preferences
ALTER TABLE public.trip_requests 
ADD COLUMN IF NOT EXISTS duffel_auto_book_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS preferred_duffel_payment_method_id uuid REFERENCES public.duffel_payment_methods(id);

-- 5. Add Duffel-specific booking states
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'duffel_booking_status') THEN
    CREATE TYPE public.duffel_booking_status AS ENUM (
      'offer_selected',
      'payment_authorized', 
      'order_created',
      'ticketed',
      'failed',
      'cancelled',
      'refunded'
    );
  END IF;
END $$;

ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS duffel_status public.duffel_booking_status;

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_duffel_order_id ON public.bookings(duffel_order_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON public.bookings(provider);
CREATE INDEX IF NOT EXISTS idx_duffel_payment_methods_user_id ON public.duffel_payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_duffel_payment_methods_active ON public.duffel_payment_methods(is_active);
CREATE INDEX IF NOT EXISTS idx_duffel_webhooks_event_id ON public.duffel_webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_duffel_webhooks_order_id ON public.duffel_webhook_events(order_id);
CREATE INDEX IF NOT EXISTS idx_duffel_webhooks_processed ON public.duffel_webhook_events(processed);

-- 7. Add helpful comments
COMMENT ON COLUMN public.bookings.provider IS 'Booking provider: amadeus for legacy bookings, duffel for new auto-bookings';
COMMENT ON COLUMN public.bookings.duffel_order_id IS 'Duffel order ID (e.g., ord_00009htYpSCXrwaB9DnUm0)';
COMMENT ON COLUMN public.bookings.pnr IS 'Airline booking reference/confirmation code';
COMMENT ON COLUMN public.bookings.ticket_numbers IS 'Array of airline e-ticket numbers for each passenger';
COMMENT ON TABLE public.duffel_payment_methods IS 'Payment methods tokenized through Duffel Payments for auto-booking';
COMMENT ON TABLE public.duffel_webhook_events IS 'Log of webhook events received from Duffel API';

-- 8. Row Level Security policies
ALTER TABLE public.duffel_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duffel_webhook_events ENABLE ROW LEVEL SECURITY;

-- Users can only see their own payment methods
CREATE POLICY "Users can view own duffel payment methods" ON public.duffel_payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own duffel payment methods" ON public.duffel_payment_methods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own duffel payment methods" ON public.duffel_payment_methods
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can manage webhook events
CREATE POLICY "Service role can manage webhook events" ON public.duffel_webhook_events
  USING (auth.jwt() ->> 'role' = 'service_role');

-- 9. Add function to safely create Duffel booking with fallback state management
CREATE OR REPLACE FUNCTION public.rpc_create_duffel_booking(
  p_trip_request_id uuid,
  p_flight_offer_id uuid,
  p_duffel_payment_intent_id text,
  p_amount numeric,
  p_currency text DEFAULT 'USD'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY definer
AS $$
DECLARE
  v_user_id uuid;
  v_booking_id uuid;
  v_result jsonb;
BEGIN
  -- Get user from trip request
  SELECT user_id INTO v_user_id 
  FROM trip_requests 
  WHERE id = p_trip_request_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trip request not found' USING ERRCODE = 'P0002';
  END IF;
  
  -- Check if already booked
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE trip_request_id = p_trip_request_id 
    AND provider = 'duffel'
    AND status IN ('booked', 'confirmed')
  ) THEN
    RAISE EXCEPTION 'Trip already has Duffel booking' USING ERRCODE = 'P0003';
  END IF;
  
  -- Create booking record in 'pending' state
  INSERT INTO bookings (
    user_id,
    trip_request_id, 
    flight_offer_id,
    provider,
    duffel_payment_intent_id,
    price,
    status,
    duffel_status,
    source
  ) VALUES (
    v_user_id,
    p_trip_request_id,
    p_flight_offer_id, 
    'duffel',
    p_duffel_payment_intent_id,
    p_amount,
    'pending',
    'payment_authorized',
    'auto'
  )
  RETURNING id INTO v_booking_id;
  
  SELECT jsonb_build_object(
    'booking_id', v_booking_id,
    'status', 'pending',
    'duffel_status', 'payment_authorized'
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

-- 10. Add function to update booking with Duffel order details
CREATE OR REPLACE FUNCTION public.rpc_update_duffel_booking(
  p_booking_id uuid,
  p_duffel_order_id text,
  p_pnr text DEFAULT NULL,
  p_ticket_numbers jsonb DEFAULT NULL,
  p_duffel_status public.duffel_booking_status DEFAULT 'order_created',
  p_raw_order jsonb DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY definer  
AS $$
BEGIN
  UPDATE bookings SET
    duffel_order_id = p_duffel_order_id,
    pnr = COALESCE(p_pnr, pnr),
    ticket_numbers = COALESCE(p_ticket_numbers, ticket_numbers),
    duffel_status = p_duffel_status,
    duffel_raw_order = COALESCE(p_raw_order, duffel_raw_order),
    status = CASE 
      WHEN p_duffel_status = 'ticketed' THEN 'confirmed'
      WHEN p_duffel_status = 'failed' THEN 'failed'
      WHEN p_duffel_status = 'cancelled' THEN 'cancelled'
      ELSE status
    END,
    updated_at = now()
  WHERE id = p_booking_id AND provider = 'duffel';
  
  RETURN FOUND;
END;
$$;
