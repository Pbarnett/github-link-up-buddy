-- 20250524_rls_booking_requests.sql

-- Enable RLS
DO $$
BEGIN
  ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- Allow users to SELECT their own requests
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'booking_requests' AND policyname = 'select_own_booking_requests') THEN
    CREATE POLICY select_own_booking_requests ON public.booking_requests
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Allow users to INSERT new requests for themselves
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'booking_requests' AND policyname = 'insert_booking_requests') THEN
    CREATE POLICY insert_booking_requests ON public.booking_requests
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Allow service_role to update only the status column
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'booking_requests' AND policyname = 'update_booking_request_status_only') THEN
    CREATE POLICY update_booking_request_status_only ON public.booking_requests
      FOR UPDATE
      USING (auth.jwt() ->>> 'role' = 'service_role')
      WITH CHECK (auth.jwt() ->>> 'role' = 'service_role');
  END IF;
END $$;

-- Prevent users from deleting requests
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'booking_requests' AND policyname = 'no_delete_booking_requests') THEN
    CREATE POLICY no_delete_booking_requests ON public.booking_requests
      FOR DELETE
      USING (false);
  END IF;
END $$;
