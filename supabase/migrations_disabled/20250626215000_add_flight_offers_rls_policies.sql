-- Add RLS policies for flight_offers table to support Duffel integration
-- This ensures users can only see offers for their own trip requests

-- Enable RLS on flight_offers table (if not already enabled)
ALTER TABLE public.flight_offers ENABLE ROW LEVEL SECURITY;

-- Allow users to view flight offers for their own trip requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'flight_offers' AND policyname = 'users_view_own_flight_offers'
  ) THEN
    CREATE POLICY users_view_own_flight_offers ON public.flight_offers
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.trip_requests tr
          WHERE tr.id = flight_offers.trip_request_id
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
    WHERE tablename = 'flight_offers' AND policyname = 'service_role_insert_flight_offers'
  ) THEN
    CREATE POLICY service_role_insert_flight_offers ON public.flight_offers
      FOR INSERT
      WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;

-- Allow service role to update flight offers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'flight_offers' AND policyname = 'service_role_update_flight_offers'
  ) THEN
    CREATE POLICY service_role_update_flight_offers ON public.flight_offers
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
    WHERE tablename = 'flight_offers' AND policyname = 'service_role_delete_flight_offers'
  ) THEN
    CREATE POLICY service_role_delete_flight_offers ON public.flight_offers
      FOR DELETE
      USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;
