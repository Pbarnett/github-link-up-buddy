ALTER TABLE public.flight_offers
  ADD COLUMN IF NOT EXISTS baggage_included BOOLEAN NOT NULL DEFAULT FALSE;
