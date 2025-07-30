-- Extend flight_offers table with missing required columns
ALTER TABLE public.flight_offers
  ADD COLUMN IF NOT EXISTS user_id        uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS offer_id       text UNIQUE,
  ADD COLUMN IF NOT EXISTS expires_at     timestamptz,
  ADD COLUMN IF NOT EXISTS price_currency text DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS price_amount   numeric(10,2),
  ADD COLUMN IF NOT EXISTS status         text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS updated_at     timestamptz DEFAULT now();

-- Back-fill user_id for historical rows
UPDATE public.flight_offers fo
SET    user_id = tr.user_id
FROM   public.trip_requests tr
WHERE  tr.id = fo.trip_request_id
  AND  fo.user_id IS NULL;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS flight_offers_user_status_idx
  ON public.flight_offers (user_id, status);

CREATE INDEX IF NOT EXISTS flight_offers_expires_at_idx
  ON public.flight_offers (expires_at);

CREATE INDEX IF NOT EXISTS flight_offers_offer_id_idx
  ON public.flight_offers (offer_id);

-- Update RLS policy to use user_id
DROP POLICY IF EXISTS "Users can view their own flight offers" ON public.flight_offers;
CREATE POLICY "Users can view their own flight offers" ON public.flight_offers
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.trip_requests tr 
      WHERE tr.id = flight_offers.trip_request_id 
        AND tr.user_id = auth.uid()
    )
  );

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_flight_offers_updated_at 
  BEFORE UPDATE ON public.flight_offers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON COLUMN public.flight_offers.offer_id IS 'Unique Duffel offer identifier';
COMMENT ON COLUMN public.flight_offers.expires_at IS 'When this offer expires and should not be bookable';
COMMENT ON COLUMN public.flight_offers.status IS 'pending|expired|booked|failed - offer lifecycle status';
