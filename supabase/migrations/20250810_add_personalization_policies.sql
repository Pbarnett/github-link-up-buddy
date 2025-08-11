-- Migration: Add personalization tables, indexes, and RLS policies
-- Date: 2025-08-10
-- Purpose: Support personalization Edge Function with secure, least-privilege access

-- 1) Table: personalization_events
create table if not exists public.personalization_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type varchar(50) not null,
  context jsonb,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_personalization_events_user_time
  on public.personalization_events(user_id, created_at desc);

-- 2) Profiles performance index (optional but helpful for lookups when enabled)
create index if not exists idx_profiles_personalization
  on public.profiles(id, first_name, next_trip_city)
  where personalization_enabled = true;

-- 3) Enable RLS where appropriate
alter table public.profiles enable row level security;
alter table public.personalization_events enable row level security;

-- 4) RLS Policies
-- Allow users to read their own profile
create policy if not exists "read own profile"
  on public.profiles for select
  using (id = auth.uid());

-- Allow users to insert their own personalization events
create policy if not exists "insert own personalization events"
  on public.personalization_events for insert
  with check (user_id = auth.uid());

-- Optional: allow users to read their own events (for debugging/analytics UI)
create policy if not exists "read own personalization events"
  on public.personalization_events for select
  using (user_id = auth.uid());

-- 5) Helper function to seed or ensure a profile row exists for a given user
create or replace function public.ensure_profile_exists(p_user_id uuid, p_first_name text default null)
returns void
language plpgsql
as $$
begin
  insert into public.profiles (id, first_name, personalization_enabled)
  values (p_user_id, p_first_name, true)
  on conflict (id) do update
    set first_name = coalesce(excluded.first_name, public.profiles.first_name),
        personalization_enabled = true;
end;
$$;

-- Notes:
-- - This migration assumes public.profiles exists with columns:
--   id (uuid primary key), first_name (text), next_trip_city (text), loyalty_tier (text),
--   personalization_enabled (boolean), last_login_at (timestamptz). Adjust as needed.
-- - If profiles differs, update the policies and index definitions accordingly.

