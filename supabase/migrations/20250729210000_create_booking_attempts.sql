-- Create booking_attempts table for idempotency and double-booking prevention
CREATE TABLE IF NOT EXISTS public.booking_attempts (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_request_id    uuid REFERENCES public.trip_requests(id) ON DELETE CASCADE,
  offer_id           text NOT NULL,                           -- Duffel offer_id
  idempotency_key    text UNIQUE NOT NULL,
  status             text NOT NULL DEFAULT 'initiated',       -- initiated|processing|succeeded|failed
  started_at         timestamptz NOT NULL DEFAULT now(),
  finished_at        timestamptz,
  error_message      text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- RLS policies
ALTER TABLE public.booking_attempts ENABLE ROW LEVEL SECURITY;

-- Users can only view their own booking attempts
CREATE POLICY "owner_can_view_attempt" ON public.booking_attempts
  FOR SELECT USING (auth.uid() = (
    SELECT user_id FROM public.trip_requests tr WHERE tr.id = trip_request_id
  ));

-- Service role has full access
CREATE POLICY "service_role_all_access" ON public.booking_attempts
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

-- Performance indexes
CREATE INDEX IF NOT EXISTS booking_attempts_status_idx ON public.booking_attempts (status, started_at);
CREATE INDEX IF NOT EXISTS booking_attempts_trip_request_idx ON public.booking_attempts (trip_request_id);
CREATE INDEX IF NOT EXISTS booking_attempts_idempotency_key_idx ON public.booking_attempts (idempotency_key);

-- Comments for documentation
COMMENT ON TABLE public.booking_attempts IS 'Tracks booking attempts with idempotency for double-booking prevention';
COMMENT ON COLUMN public.booking_attempts.idempotency_key IS 'Unique key used for Stripe/Duffel idempotency headers';
COMMENT ON COLUMN public.booking_attempts.status IS 'initiated|processing|succeeded|failed - booking attempt lifecycle';
