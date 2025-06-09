ALTER TABLE public.flight_offers
ADD COLUMN IF NOT EXISTS selected_seat_type TEXT NULL;
