/* === TRIP_REQUESTS ====================================================== */

ALTER TABLE public.trip_requests
  ADD COLUMN IF NOT EXISTS origin_location_code TEXT,
  ADD COLUMN IF NOT EXISTS departure_date DATE,
  ADD COLUMN IF NOT EXISTS return_date DATE,
  ADD COLUMN IF NOT EXISTS adults INTEGER DEFAULT 1;

/* rename auto_book_enabled → auto_book (guarded) */
DO $$
BEGIN
  IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name='trip_requests' AND column_name='auto_book'
  )
  AND EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name='trip_requests' AND column_name='auto_book_enabled'
  ) THEN
    ALTER TABLE public.trip_requests RENAME COLUMN auto_book_enabled TO auto_book;
  END IF;
END $$;
