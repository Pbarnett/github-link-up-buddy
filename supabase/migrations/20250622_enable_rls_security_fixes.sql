-- Enable RLS for security compliance on tables flagged by Supabase
-- Fix for: RLS Disabled in Public security warnings

-- 1. Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow users to view payments for their own bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payments' AND policyname = 'users_view_own_payments'
  ) THEN
    CREATE POLICY users_view_own_payments ON public.payments
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.bookings b
          WHERE b.id = payments.booking_id
          AND b.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Allow service role to insert payments (payment processing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payments' AND policyname = 'service_role_insert_payments'
  ) THEN
    CREATE POLICY service_role_insert_payments ON public.payments
      FOR INSERT
      WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;

-- Allow service role to update payment status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payments' AND policyname = 'service_role_update_payments'
  ) THEN
    CREATE POLICY service_role_update_payments ON public.payments
      FOR UPDATE
      USING (auth.jwt() ->> 'role' = 'service_role')
      WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;

-- 2. Enable RLS on booking_attempts table
ALTER TABLE public.booking_attempts ENABLE ROW LEVEL SECURITY;

-- Allow users to view booking attempts for their own trip requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'booking_attempts' AND policyname = 'users_view_own_booking_attempts'
  ) THEN
    CREATE POLICY users_view_own_booking_attempts ON public.booking_attempts
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.trip_requests tr
          WHERE tr.id = booking_attempts.trip_request_id
          AND tr.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Allow service role to insert booking attempts (automated booking)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'booking_attempts' AND policyname = 'service_role_insert_booking_attempts'
  ) THEN
    CREATE POLICY service_role_insert_booking_attempts ON public.booking_attempts
      FOR INSERT
      WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;

-- Allow service role to update booking attempts (for status updates)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'booking_attempts' AND policyname = 'service_role_update_booking_attempts'
  ) THEN
    CREATE POLICY service_role_update_booking_attempts ON public.booking_attempts
      FOR UPDATE
      USING (auth.jwt() ->> 'role' = 'service_role')
      WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;

-- 3. Enable RLS on flight_offers_v2 table
ALTER TABLE public.flight_offers_v2 ENABLE ROW LEVEL SECURITY;

-- Allow users to view flight offers for their own trip requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'flight_offers_v2' AND policyname = 'users_view_own_flight_offers_v2'
  ) THEN
    CREATE POLICY users_view_own_flight_offers_v2 ON public.flight_offers_v2
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.trip_requests tr
          WHERE tr.id = flight_offers_v2.trip_request_id
          AND tr.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Allow service role to insert flight offers (for flight search results)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'flight_offers_v2' AND policyname = 'service_role_insert_flight_offers_v2'
  ) THEN
    CREATE POLICY service_role_insert_flight_offers_v2 ON public.flight_offers_v2
      FOR INSERT
      WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;

-- Allow service role to update flight offers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'flight_offers_v2' AND policyname = 'service_role_update_flight_offers_v2'
  ) THEN
    CREATE POLICY service_role_update_flight_offers_v2 ON public.flight_offers_v2
      FOR UPDATE
      USING (auth.jwt() ->> 'role' = 'service_role')
      WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;

-- Allow service role to delete flight offers (for cleanup)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'flight_offers_v2' AND policyname = 'service_role_delete_flight_offers_v2'
  ) THEN
    CREATE POLICY service_role_delete_flight_offers_v2 ON public.flight_offers_v2
      FOR DELETE
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;
