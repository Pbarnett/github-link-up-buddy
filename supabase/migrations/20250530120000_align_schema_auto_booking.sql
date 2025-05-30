-- supabase/migrations/20250530120000_align_schema_auto_booking.sql

-- Alter booking_requests table
ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS trip_request_id UUID REFERENCES public.trip_requests(id), -- Ensuring type is UUID as per user requirement
  ADD COLUMN IF NOT EXISTS error_message TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Alter bookings table
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS booking_request_id UUID REFERENCES public.booking_requests(id), -- Ensuring type is UUID
  ADD COLUMN IF NOT EXISTS flight_details JSONB,
  ADD COLUMN IF NOT EXISTS price NUMERIC,
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'booked'; -- This default might be 'pending' in a real scenario before payment

-- Alter notifications table
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS trip_request_id UUID REFERENCES public.trip_requests(id), -- Ensuring type is UUID
  ADD COLUMN IF NOT EXISTS message TEXT,
  ADD COLUMN IF NOT EXISTS data JSONB;

-- Alter trip_requests table
ALTER TABLE public.trip_requests
  ADD COLUMN IF NOT EXISTS origin_location_code TEXT,
  ADD COLUMN IF NOT EXISTS destination_location_code TEXT,
  ADD COLUMN IF NOT EXISTS departure_date DATE,
  ADD COLUMN IF NOT EXISTS return_date DATE,
  ADD COLUMN IF NOT EXISTS adults INT DEFAULT 1;

-- Handle renaming of auto_book_enabled to auto_book
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'trip_requests' AND column_name = 'auto_book_enabled') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'trip_requests' AND column_name = 'auto_book') THEN
      RAISE NOTICE 'Renaming column "auto_book_enabled" to "auto_book" on table "trip_requests".';
      ALTER TABLE public.trip_requests RENAME COLUMN auto_book_enabled TO auto_book;
    ELSE
      RAISE NOTICE 'Column "auto_book" already exists on "trip_requests". Skipping rename of "auto_book_enabled". Consider manually reviewing "auto_book_enabled" if it still contains relevant data.';
    END IF;
  ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'trip_requests' AND column_name = 'auto_book') THEN
    RAISE NOTICE 'Adding column "auto_book" to table "trip_requests" as neither "auto_book" nor "auto_book_enabled" exist.';
    ALTER TABLE public.trip_requests ADD COLUMN auto_book BOOLEAN;
  ELSE
    RAISE NOTICE 'Column "auto_book" already exists on "trip_requests". "auto_book_enabled" not found. No action taken for auto_book column.';
  END IF;
END
$$;

-- Comment on potential type changes for existing columns with data:
-- If existing 'id' columns in 'trip_requests' or 'booking_requests' were not UUID and held data,
-- they would need to be altered carefully, e.g.:
-- ALTER TABLE public.trip_requests ALTER COLUMN id TYPE UUID USING id::TEXT::UUID;
-- This script assumes that if these tables/columns exist, their 'id' PKs are already UUID
-- or are being newly created as UUIDs elsewhere, aligning with the FKs defined above.

COMMENT ON COLUMN public.bookings.status IS 'Default status for new bookings; might be ''pending'' pre-payment in other flows.';

-- Set statement timeout to a higher value for potentially long-running DDL changes on large tables.
SET statement_timeout = '300s'; -- 5 minutes
```
