-- Add booking_url field to flight_offers_v2 table to support external airline booking
-- This allows V2 offers to redirect users to airline websites like Google Flights does

ALTER TABLE public.flight_offers_v2 
ADD COLUMN booking_url text;

-- Add index for performance when querying by booking URL availability
CREATE INDEX IF NOT EXISTS idx_fov2_booking_url 
ON public.flight_offers_v2(booking_url) 
WHERE booking_url IS NOT NULL;

-- Add helpful comment
COMMENT ON COLUMN public.flight_offers_v2.booking_url 
IS 'External URL for booking on airline website (like Google Flights deeplinks)';
