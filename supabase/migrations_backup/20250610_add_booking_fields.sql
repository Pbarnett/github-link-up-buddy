-- Migration: 20250610_add_booking_fields.sql
-- Adds new columns to 'bookings' and 'booking_requests' tables,
-- and establishes a foreign key relationship.

-- 0) Add booking_request_id to bookings table (prerequisite for FK)
-- Making it nullable initially to handle existing rows that might not have this link.
-- Consider a backfill strategy if this needs to be NOT NULL eventually.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS booking_request_id UUID NULL;

-- 1) Add status, payment_intent_id, booked_at to bookings
-- Note: 'status' column likely already exists as TEXT. This attempts to add VARCHAR(20).
-- IF NOT EXISTS will prevent adding a new column if 'status' already exists.
-- If type change from TEXT to VARCHAR(20) is desired for an existing 'status' column,
-- a separate ALTER COLUMN status TYPE VARCHAR(20) would be needed, potentially with a USING clause.
-- For this migration, we primarily ensure the other columns are added.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' NOT NULL,
  ADD COLUMN IF NOT EXISTS payment_intent_id TEXT NULL, -- Allow NULL for payment_intent_id
  ADD COLUMN IF NOT EXISTS booked_at TIMESTAMPTZ DEFAULT timezone('utc', now());

-- 2) Add reminder_scheduled to booking_requests
ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS reminder_scheduled BOOLEAN DEFAULT FALSE NOT NULL;

-- 2a) Add channel, status, retry_count, sent_at, booking_id to notifications
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS channel TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS retry_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS booking_id UUID;

-- 2b) Add missing payload JSONB to notifications
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS payload JSONB;

-- 2c) Comment on payload only if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name   = 'notifications'
       AND column_name  = 'payload'
  ) THEN
    COMMENT ON COLUMN public.notifications.payload IS
      'JSONB payload with additional data specific to the notification type, e.g., PNR, flight details, error messages.';
  END IF;
END
$$;

-- 3) Ensure foreign key
-- This assumes booking_request_id column was added in step 0.
-- And that booking_requests.id is a PK or has a UNIQUE constraint.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM pg_constraint
     WHERE conname = 'fk_bookings_booking_request'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT fk_bookings_booking_request
      FOREIGN KEY (booking_request_id)
      REFERENCES public.booking_requests(id)
      ON DELETE CASCADE;
  END IF;
END
$$;

-- Add comments for new columns
COMMENT ON COLUMN public.bookings.booking_request_id IS 'Foreign key linking to the original booking_request, if applicable.';
COMMENT ON COLUMN public.bookings.payment_intent_id IS 'Stripe PaymentIntent ID associated with this booking''s payment.';
COMMENT ON COLUMN public.bookings.booked_at IS 'Timestamp of when the booking was confirmed/ticketed.';
COMMENT ON COLUMN public.booking_requests.reminder_scheduled IS 'Flag to indicate if a reminder notification has been scheduled or sent for this request.';


-- Optional Backfill Statements (Execute manually or in a separate script if needed):

-- If bookings were created without booked_at, default it to created_at:
-- UPDATE public.bookings
-- SET booked_at = created_at
-- WHERE booked_at IS NULL;

-- For existing booking_requests, mark reminder_scheduled based on current status.
-- If reminder_scheduled means "a reminder has been processed/sent", then FALSE for old records is safer.
-- If it means "this request is eligible for future reminder scheduling", then TRUE for active ones.
-- User spec: "mark reminder_scheduled = TRUE if they’re still pending/processing"
-- This implies the latter meaning for this backfill example.
-- UPDATE public.booking_requests
-- SET reminder_scheduled = TRUE
-- WHERE status IN ('pending_booking', 'processing', 'pending_payment');
-- -- Adjust condition based on which statuses should be considered eligible for reminders.
-- -- Or, if it means "reminder already sent", initialize to FALSE for all old records:
-- -- UPDATE public.booking_requests
-- -- SET reminder_scheduled = FALSE
-- -- WHERE reminder_scheduled IS NULL;
-- -- The default in the ADD COLUMN is FALSE, so this might not be needed if that's the desired state for old records.
