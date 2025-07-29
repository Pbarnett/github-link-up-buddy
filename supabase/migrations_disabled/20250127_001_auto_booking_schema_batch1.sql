-- Auto-Booking Pipeline Schema - Batch 1
-- Requirements: #6, #7, #8, #11, #12, #36, #37, #38, #39

-- Add auto-booking columns to trip_requests table
ALTER TABLE public.trip_requests 
ADD COLUMN IF NOT EXISTS auto_book_enabled boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_book_status text CHECK (auto_book_status IN ('PENDING','BOOKED','FAILED','CANCELLED')) DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS selected_offer_id uuid REFERENCES public.flight_offers_v2(id),
ADD COLUMN IF NOT EXISTS last_checked_at timestamptz;

-- Update flight_offers_v2 table to meet requirements
ALTER TABLE public.flight_offers_v2 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS offer_id text UNIQUE,
ADD COLUMN IF NOT EXISTS expires_at timestamptz,
ADD COLUMN IF NOT EXISTS price_currency text DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS price_amount numeric(10,2),
ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('ACTIVE','EXPIRED','SELECTED','BOOKED')) DEFAULT 'ACTIVE',
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS external_offer_id text,
ADD COLUMN IF NOT EXISTS raw_offer_payload jsonb;

-- Copy price_total to price_amount for consistency
UPDATE public.flight_offers_v2 
SET price_amount = price_total, price_currency = 'USD' 
WHERE price_amount IS NULL;

-- Update user_id from trip_requests relationship
UPDATE public.flight_offers_v2 fo
SET user_id = tr.user_id
FROM public.trip_requests tr
WHERE fo.trip_request_id = tr.id AND fo.user_id IS NULL;

-- Make user_id NOT NULL after backfill
ALTER TABLE public.flight_offers_v2 
ALTER COLUMN user_id SET NOT NULL;

-- Update booking_attempts table to add required columns
ALTER TABLE public.booking_attempts 
ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('PENDING','SUCCESS','FAILED')) DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS idempotency_key text UNIQUE,
ADD COLUMN IF NOT EXISTS started_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS error_message text;

-- Create flight_bookings table (requirement #9, #10)
CREATE TABLE IF NOT EXISTS public.flight_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id uuid NOT NULL REFERENCES public.flight_offers_v2(id),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id text NOT NULL, -- Duffel order ID
  payment_intent_id text NOT NULL, -- Stripe payment intent ID
  booking_reference text, -- PNR from airline
  price numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  booked_at timestamptz DEFAULT now(),
  status text CHECK (status IN ('CONFIRMED','CANCELLED','REFUNDED')) DEFAULT 'CONFIRMED',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add performance indexes (requirement #8)
CREATE INDEX IF NOT EXISTS idx_trip_requests_auto_book ON public.trip_requests(user_id, auto_book_enabled, auto_book_status) WHERE auto_book_enabled = true;
CREATE INDEX IF NOT EXISTS idx_flight_offers_v2_user_status ON public.flight_offers_v2(user_id, status);
CREATE INDEX IF NOT EXISTS idx_flight_offers_v2_expires_at ON public.flight_offers_v2(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_flight_offers_v2_offer_id ON public.flight_offers_v2(offer_id) WHERE offer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_booking_attempts_idempotency ON public.booking_attempts(idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_flight_bookings_user_id ON public.flight_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_order_id ON public.flight_bookings(order_id);

-- Enable RLS on new/updated tables (requirement #7, #10)
ALTER TABLE public.flight_offers_v2 ENABLE ROW LEVEL SECURITY;

-- RLS policies for flight_offers_v2
DROP POLICY IF EXISTS "Users can view own flight offers" ON public.flight_offers_v2;
CREATE POLICY "Users can view own flight offers" 
  ON public.flight_offers_v2 FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own flight offers" ON public.flight_offers_v2;
CREATE POLICY "Users can insert own flight offers" 
  ON public.flight_offers_v2 FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own flight offers" ON public.flight_offers_v2;
CREATE POLICY "Users can update own flight offers" 
  ON public.flight_offers_v2 FOR UPDATE 
  USING (auth.uid() = user_id);

-- Service role bypass for Edge Functions
DROP POLICY IF EXISTS "Service role can manage all flight offers" ON public.flight_offers_v2;
CREATE POLICY "Service role can manage all flight offers" 
  ON public.flight_offers_v2 FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Enable RLS on flight_bookings
ALTER TABLE public.flight_bookings ENABLE ROW LEVEL SECURITY;

-- RLS policies for flight_bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON public.flight_bookings;
CREATE POLICY "Users can view own bookings" 
  ON public.flight_bookings FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all bookings" ON public.flight_bookings;
CREATE POLICY "Service role can manage all bookings" 
  ON public.flight_bookings FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Update RLS on booking_attempts to include new columns
DROP POLICY IF EXISTS "Users can view own booking attempts" ON public.booking_attempts;
CREATE POLICY "Users can view own booking attempts" 
  ON public.booking_attempts FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.trip_requests tr 
      WHERE tr.id = booking_attempts.trip_request_id 
        AND tr.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Service role can manage all booking attempts" ON public.booking_attempts;
CREATE POLICY "Service role can manage all booking attempts" 
  ON public.booking_attempts FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Update RLS on trip_requests to include new auto-booking columns
DROP POLICY IF EXISTS "Users can update own trip requests" ON public.trip_requests;
CREATE POLICY "Users can update own trip requests" 
  ON public.trip_requests FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger for flight_offers_v2
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_flight_offers_v2_updated_at ON public.flight_offers_v2;
CREATE TRIGGER update_flight_offers_v2_updated_at
  BEFORE UPDATE ON public.flight_offers_v2
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_flight_bookings_updated_at ON public.flight_bookings;
CREATE TRIGGER update_flight_bookings_updated_at
  BEFORE UPDATE ON public.flight_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Comments for documentation
COMMENT ON COLUMN public.trip_requests.auto_book_enabled IS 'Whether user has enabled auto-booking for this trip request';
COMMENT ON COLUMN public.trip_requests.auto_book_status IS 'Current status of auto-booking pipeline for this request';
COMMENT ON COLUMN public.trip_requests.selected_offer_id IS 'Currently selected offer for auto-booking';
COMMENT ON COLUMN public.trip_requests.last_checked_at IS 'Last time this request was checked by auto-book monitor';

COMMENT ON COLUMN public.flight_offers_v2.offer_id IS 'Unique external offer identifier (e.g., from Duffel)';
COMMENT ON COLUMN public.flight_offers_v2.expires_at IS 'When this offer expires and can no longer be booked';
COMMENT ON COLUMN public.flight_offers_v2.external_offer_id IS 'Provider-specific offer ID for booking';
COMMENT ON COLUMN public.flight_offers_v2.raw_offer_payload IS 'Complete offer data from provider for booking';

COMMENT ON COLUMN public.booking_attempts.idempotency_key IS 'Unique key to prevent duplicate booking attempts';
COMMENT ON COLUMN public.booking_attempts.status IS 'Current status of this booking attempt';

COMMENT ON TABLE public.flight_bookings IS 'Confirmed flight bookings with payment and order details';
COMMENT ON COLUMN public.flight_bookings.order_id IS 'Provider order ID (e.g., Duffel order ID)';
COMMENT ON COLUMN public.flight_bookings.payment_intent_id IS 'Stripe PaymentIntent ID for this booking';
COMMENT ON COLUMN public.flight_bookings.booking_reference IS 'Airline booking reference/PNR';
