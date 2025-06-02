-- 20250524_rls_booking_requests.sql

-- Enable RLS
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Allow users to SELECT their own requests
CREATE POLICY select_own_booking_requests ON public.booking_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to INSERT new requests for themselves
CREATE POLICY insert_booking_requests ON public.booking_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow service_role to update only the status column
CREATE POLICY update_booking_request_status_only ON public.booking_requests
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Prevent users from deleting requests
CREATE POLICY no_delete_booking_requests ON public.booking_requests
  FOR DELETE
  USING (false);
