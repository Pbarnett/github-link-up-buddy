-- supabase/migrations/20250729_add_trip_request_columns.sql
-- This migration adds columns to trip_requests for enhanced offer selection and auto-booking

-- Add columns for offer selection and auto-booking support
ALTER TABLE public.trip_requests
ADD COLUMN IF NOT EXISTS selected_offer_id uuid,
ADD COLUMN IF NOT EXISTS max_price numeric,
ADD COLUMN IF NOT EXISTS auto_book_enabled boolean DEFAULT false NOT NULL;

-- Add foreign key constraint for selected_offer_id
ALTER TABLE public.trip_requests
ADD CONSTRAINT trip_requests_selected_offer_id_fkey
FOREIGN KEY (selected_offer_id) REFERENCES public.flight_offers(id) ON DELETE SET NULL;

-- Add index for performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_trip_requests_auto_book_enabled
ON public.trip_requests (auto_book_enabled, created_at);

CREATE INDEX IF NOT EXISTS idx_trip_requests_selected_offer
ON public.trip_requests (selected_offer_id);

-- Add check constraint to ensure max_price is reasonable
ALTER TABLE public.trip_requests
ADD CONSTRAINT trip_requests_max_price_check
CHECK (max_price IS NULL OR (max_price >= 50 AND max_price <= 50000));

-- Add comment explaining the new columns
COMMENT ON COLUMN public.trip_requests.selected_offer_id IS 'Reference to the flight offer chosen by the user for booking';
COMMENT ON COLUMN public.trip_requests.max_price IS 'Maximum price the user is willing to pay for auto-booking (overrides budget)';
COMMENT ON COLUMN public.trip_requests.auto_book_enabled IS 'Whether automatic booking is enabled for this trip request';
