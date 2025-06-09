-- 20250524_add_sessions_and_status_enum_booking_requests.sql

-- 1. Add checkout_session_id column for Stripe session lookup
ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS checkout_session_id TEXT;

-- 2. Create an enum for the workflow statuses
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_request_status') THEN
    CREATE TYPE public.booking_request_status AS ENUM (
      'new',
      'pending_payment',
      'pending_booking',
      'processing',
      'done',
      'failed'
    );
  END IF;
END
$$;

-- 3. Alter the status column to use the new enum
ALTER TABLE public.booking_requests
  ALTER COLUMN status
  TYPE public.booking_request_status
  USING status::public.booking_request_status;
