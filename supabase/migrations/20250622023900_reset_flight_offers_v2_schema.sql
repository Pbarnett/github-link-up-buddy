-- Reset flight_offers_v2 table to the correct schema that matches our code
-- This migration fixes the schema mismatch between database and application code

-- First, drop the existing table if it exists (with the wrong schema)
DROP TABLE IF EXISTS public.flight_offers_v2 CASCADE;

-- Recreate with the correct schema that matches our TypeScript interfaces
CREATE TABLE IF NOT EXISTS public.flight_offers_v2 (
  id                uuid primary key default gen_random_uuid(),
  trip_request_id   uuid not null references public.trip_requests(id) on delete cascade,
  mode              text not null default 'LEGACY' check (mode in ('LEGACY','AUTO','MANUAL')),
  price_total       numeric(10,2) not null,
  price_currency    text default 'USD',
  price_carry_on    numeric(10,2),
  bags_included     boolean not null default false,
  cabin_class       text,
  nonstop           boolean not null,
  origin_iata       char(3) not null,
  destination_iata  char(3) not null,
  depart_dt         timestamptz not null,
  return_dt         timestamptz,
  seat_pref         text,
  created_at        timestamptz not null default now(),
  constraint chk_positive_price_total check (price_total > 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_fov2_trip_request ON public.flight_offers_v2(trip_request_id);
CREATE INDEX IF NOT EXISTS idx_fov2_mode ON public.flight_offers_v2(mode);
CREATE INDEX IF NOT EXISTS idx_fov2_depart_dt ON public.flight_offers_v2(depart_dt);
CREATE INDEX IF NOT EXISTS idx_fov2_price_total ON public.flight_offers_v2(price_total);

-- Add helpful comments
COMMENT ON TABLE public.flight_offers_v2 IS 'Flight offers table V2 with simplified schema matching application code';
COMMENT ON COLUMN public.flight_offers_v2.mode IS 'How the offer was generated: LEGACY, AUTO, or MANUAL';
COMMENT ON COLUMN public.flight_offers_v2.price_total IS 'Total price including all fees';
COMMENT ON COLUMN public.flight_offers_v2.price_currency IS 'Currency code (USD, EUR, etc.)';
COMMENT ON COLUMN public.flight_offers_v2.price_carry_on IS 'Additional carry-on fee if not included';
