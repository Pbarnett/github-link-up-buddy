-- Add provider column to flight_offers table to support Duffel integration
-- This allows distinguishing between Amadeus and Duffel flight offers

ALTER TABLE public.flight_offers 
ADD COLUMN IF NOT EXISTS provider text DEFAULT 'amadeus' CHECK (provider IN ('amadeus', 'duffel'));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_flight_offers_provider ON public.flight_offers(provider);

-- Add comment
COMMENT ON COLUMN public.flight_offers.provider IS 'Flight offer provider: amadeus for legacy offers, duffel for new offers';

-- Update any existing records to have amadeus as provider (they are legacy offers)
UPDATE public.flight_offers 
SET provider = 'amadeus' 
WHERE provider IS NULL;
