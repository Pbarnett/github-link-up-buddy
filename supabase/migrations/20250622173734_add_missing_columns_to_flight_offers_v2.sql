-- Add missing columns to flight_offers_v2 table for V2 functionality

ALTER TABLE public.flight_offers_v2 
ADD COLUMN IF NOT EXISTS external_offer_id text,
ADD COLUMN IF NOT EXISTS raw_offer_payload jsonb;

-- Add index on external_offer_id for better performance
CREATE INDEX IF NOT EXISTS idx_fov2_external_offer_id ON public.flight_offers_v2(external_offer_id);

-- Add comment to document the new columns
COMMENT ON COLUMN public.flight_offers_v2.external_offer_id IS 'External ID from third-party APIs (e.g., Amadeus offer ID)';
COMMENT ON COLUMN public.flight_offers_v2.raw_offer_payload IS 'Full raw response from external APIs for debugging and analysis';
