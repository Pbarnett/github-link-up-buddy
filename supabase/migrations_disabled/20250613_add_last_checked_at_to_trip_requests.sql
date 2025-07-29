ALTER TABLE public.trip_requests
ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMPTZ;
