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
-- **NEW**: drop the old default so we can change the column type
ALTER TABLE public.booking_requests
  ALTER COLUMN status DROP DEFAULT;
-- ADDED

-- 3. Alter the status column to use the new enum,
--    mapping any existing values back into the enum
ALTER TABLE public.booking_requests
  ALTER COLUMN status
  TYPE public.booking_request_status
  USING (
    CASE status
      WHEN 'new'             THEN 'new'
      WHEN 'pending_payment' THEN 'pending_payment'
      WHEN 'pending_booking' THEN 'pending_booking'
      WHEN 'processing'      THEN 'processing'
      WHEN 'done'            THEN 'done'
      WHEN 'failed'          THEN 'failed'
      ELSE 'new'
    END
  )::public.booking_request_status;
-- **NEW**: re-set the default to 'new'
ALTER TABLE public.booking_requests
  ALTER COLUMN status
  SET DEFAULT 'new';
-- ADDED;
