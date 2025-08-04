-- Create flight_bookings table for comprehensive booking state management
-- This is separate from the existing bookings table to handle flight-specific data

CREATE TABLE IF NOT EXISTS public.flight_bookings (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_request_id     uuid NOT NULL REFERENCES public.trip_requests(id) ON DELETE CASCADE,
  offer_id            text NOT NULL,  -- Duffel offer ID
  order_id            text UNIQUE,    -- Duffel order ID after successful booking
  payment_intent_id   text,           -- Stripe PaymentIntent ID
  booking_reference   text,           -- Airline booking reference
  status              text NOT NULL DEFAULT 'initiated', -- initiated|processing|confirmed|failed|cancelled|refunded
  total_amount        numeric(10,2) NOT NULL,
  currency            text NOT NULL DEFAULT 'USD',
  passenger_count     integer NOT NULL DEFAULT 1,
  booking_data        jsonb,          -- Raw Duffel order response
  failure_reason      text,           -- Error details if booking failed
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  confirmed_at        timestamptz,    -- When booking was confirmed
  expires_at          timestamptz     -- When booking hold expires
);

-- Enable RLS
ALTER TABLE public.flight_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own bookings
CREATE POLICY "Users can view their own flight bookings" ON public.flight_bookings
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own flight bookings" ON public.flight_bookings
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own flight bookings" ON public.flight_bookings
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Service role has full access for server operations
CREATE POLICY "Service role full access" ON public.flight_bookings
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

-- Performance indexes
CREATE INDEX IF NOT EXISTS flight_bookings_user_id_status_idx ON public.flight_bookings (user_id, status);
CREATE INDEX IF NOT EXISTS flight_bookings_trip_request_idx ON public.flight_bookings (trip_request_id);
CREATE INDEX IF NOT EXISTS flight_bookings_offer_id_idx ON public.flight_bookings (offer_id);
CREATE INDEX IF NOT EXISTS flight_bookings_payment_intent_idx ON public.flight_bookings (payment_intent_id) WHERE payment_intent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS flight_bookings_order_id_idx ON public.flight_bookings (order_id) WHERE order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS flight_bookings_expires_at_idx ON public.flight_bookings (expires_at) WHERE expires_at IS NOT NULL;

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_flight_bookings_updated_at 
  BEFORE UPDATE ON public.flight_bookings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add check constraints
ALTER TABLE public.flight_bookings
  ADD CONSTRAINT flight_bookings_status_check 
  CHECK (status IN ('initiated', 'processing', 'confirmed', 'failed', 'cancelled', 'refunded'));

ALTER TABLE public.flight_bookings
  ADD CONSTRAINT flight_bookings_amount_check 
  CHECK (total_amount > 0);

ALTER TABLE public.flight_bookings
  ADD CONSTRAINT flight_bookings_passenger_check 
  CHECK (passenger_count > 0 AND passenger_count <= 9);

-- Comments for documentation
COMMENT ON TABLE public.flight_bookings IS 'Comprehensive flight booking state management with RLS';
COMMENT ON COLUMN public.flight_bookings.offer_id IS 'Duffel offer ID that was booked';
COMMENT ON COLUMN public.flight_bookings.order_id IS 'Duffel order ID from successful booking';
COMMENT ON COLUMN public.flight_bookings.payment_intent_id IS 'Stripe PaymentIntent ID for payment tracking';
COMMENT ON COLUMN public.flight_bookings.status IS 'Booking lifecycle: initiated|processing|confirmed|failed|cancelled|refunded';
COMMENT ON COLUMN public.flight_bookings.booking_reference IS 'Airline confirmation/PNR number';
COMMENT ON COLUMN public.flight_bookings.booking_data IS 'Raw Duffel order response for audit trail';
