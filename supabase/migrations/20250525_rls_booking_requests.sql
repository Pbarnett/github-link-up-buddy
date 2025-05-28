-- Enable RLS (if not already enabled)
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Drop conflicting policies before re-creating them
DROP POLICY IF EXISTS select_own_booking_requests ON public.booking_requests;
DROP POLICY IF EXISTS insert_booking_requests ON public.booking_requests;
DROP POLICY IF EXISTS update_booking_request_status_only ON public.booking_requests;
DROP POLICY IF EXISTS no_delete_booking_requests ON public.booking_requests;

-- Allow users to SELECT their own requests
CREATE POLICY select_own_booking_requests
  ON public.booking_requests
  FOR SELECT
  USING ( auth.uid() = user_id );

-- Allow users to INSERT new requests for themselves
CREATE POLICY insert_booking_requests
  ON public.booking_requests
  FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- Allow service_role to UPDATE only the status column
CREATE POLICY update_booking_request_status_only
  ON public.booking_requests
  FOR UPDATE
  USING ( auth.jwt() ->> 'role' = 'service_role' )
  WITH CHECK ( auth.jwt() ->> 'role' = 'service_role' );

-- Prevent users from deleting requests
CREATE POLICY no_delete_booking_requests
  ON public.booking_requests
  FOR DELETE
  USING ( false );

