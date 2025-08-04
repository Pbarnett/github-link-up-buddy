-- Add comprehensive RLS policies for flight_offers table
-- Ensures users can only access their own flight offers

-- Enable RLS if not already enabled
ALTER TABLE public.flight_offers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own flight offers" ON public.flight_offers;
DROP POLICY IF EXISTS "Users can insert flight offers" ON public.flight_offers;
DROP POLICY IF EXISTS "Users can update flight offers" ON public.flight_offers;
DROP POLICY IF EXISTS "Service role full access" ON public.flight_offers;

-- Create comprehensive RLS policies

-- Users can only view offers they own or that belong to their trip requests
CREATE POLICY "Users can view their own flight offers" ON public.flight_offers
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.trip_requests tr 
      WHERE tr.id = flight_offers.trip_request_id 
        AND tr.user_id = auth.uid()
    )
  );

-- Users can insert offers for their own trip requests
CREATE POLICY "Users can insert flight offers" ON public.flight_offers
  FOR INSERT WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.trip_requests tr 
      WHERE tr.id = flight_offers.trip_request_id 
        AND tr.user_id = auth.uid()
    )
  );

-- Users can update their own offers (status changes, etc.)
CREATE POLICY "Users can update their own flight offers" ON public.flight_offers
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.trip_requests tr 
      WHERE tr.id = flight_offers.trip_request_id 
        AND tr.user_id = auth.uid()
    )
  ) WITH CHECK (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.trip_requests tr 
      WHERE tr.id = flight_offers.trip_request_id 
        AND tr.user_id = auth.uid()
    )
  );

-- Service role has full access for server operations
CREATE POLICY "Service role full access" ON public.flight_offers
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

-- Authenticated users can delete their own offers (for cleanup)
CREATE POLICY "Users can delete their own flight offers" ON public.flight_offers
  FOR DELETE USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.trip_requests tr 
      WHERE tr.id = flight_offers.trip_request_id 
        AND tr.user_id = auth.uid()
    )
  );

-- Add additional security indexes for RLS performance
CREATE INDEX IF NOT EXISTS flight_offers_user_id_idx ON public.flight_offers (user_id);
CREATE INDEX IF NOT EXISTS flight_offers_trip_request_user_idx ON public.flight_offers (trip_request_id);

-- Comments for documentation
COMMENT ON POLICY "Users can view their own flight offers" ON public.flight_offers IS 'Users can only view offers they own or from their trip requests';
COMMENT ON POLICY "Service role full access" ON public.flight_offers IS 'Service role bypass for server operations';
