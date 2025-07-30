-- Extend bookings table with missing columns for proper state tracking
-- Note: The existing table is called 'bookings' not 'flight_bookings'
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS offer_id           text,
  ADD COLUMN IF NOT EXISTS order_id           text,
  ADD COLUMN IF NOT EXISTS payment_intent_id  text;

-- Create unique constraint on order_id to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS bookings_order_id_uidx 
  ON public.bookings(order_id) 
  WHERE order_id IS NOT NULL;

-- Create index on payment_intent_id for webhook lookups
CREATE INDEX IF NOT EXISTS bookings_payment_intent_id_idx 
  ON public.bookings(payment_intent_id) 
  WHERE payment_intent_id IS NOT NULL;

-- Create index on offer_id for offer-to-booking lookups
CREATE INDEX IF NOT EXISTS bookings_offer_id_idx 
  ON public.bookings(offer_id) 
  WHERE offer_id IS NOT NULL;

-- Add foreign key constraint to link with flight_offers via offer_id
-- Note: This will be created after flight_offers.offer_id is populated
-- ALTER TABLE public.bookings 
--   ADD CONSTRAINT bookings_offer_id_fkey 
--   FOREIGN KEY (offer_id) REFERENCES public.flight_offers(offer_id);

-- Add trigger to update booking status timestamp
CREATE OR REPLACE FUNCTION update_booking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the existing updated_at if it exists, or set a new timestamp
    IF TG_OP = 'UPDATE' THEN
        NEW.updated_at = now();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Only create trigger if updated_at column exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        CREATE TRIGGER update_bookings_updated_at 
          BEFORE UPDATE ON public.bookings 
          FOR EACH ROW EXECUTE FUNCTION update_booking_updated_at();
    END IF;
END $$;

-- Comments for documentation
COMMENT ON COLUMN public.bookings.offer_id IS 'Links to flight_offers.offer_id - the Duffel offer that was booked';
COMMENT ON COLUMN public.bookings.order_id IS 'Unique Duffel order identifier from successful booking';
COMMENT ON COLUMN public.bookings.payment_intent_id IS 'Stripe PaymentIntent ID for payment tracking and webhooks';
