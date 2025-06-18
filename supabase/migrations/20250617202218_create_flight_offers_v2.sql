-- Flight-offers V2 table (Phase 2)
create table if not exists public.flight_offers_v2 (
  id                uuid primary key default gen_random_uuid(),
  trip_request_id   uuid not null references public.trip_requests(id) on delete cascade,
  mode              text not null default 'LEGACY' check (mode in ('LEGACY','AUTO','MANUAL')),
  price_total       numeric(10,2) not null,
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

create index if not exists idx_fov2_trip_request   on public.flight_offers_v2(trip_request_id);
create index if not exists idx_fov2_mode           on public.flight_offers_v2(mode);

-- TODO Phase 2.5 : add row-level-security policies
