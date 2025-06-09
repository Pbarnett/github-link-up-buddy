-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow read access to flight offers" ON flight_offers;
DROP POLICY IF EXISTS "Allow anon read access to flight offers" ON flight_offers;

-- Enable RLS on the table
ALTER TABLE flight_offers ENABLE ROW LEVEL SECURITY;

-- Create a new policy that allows any authenticated user to read offers
CREATE POLICY "Allow read access to flight offers"
ON flight_offers
FOR SELECT
USING (
  -- Either the user owns the trip request
  EXISTS (
    SELECT 1 FROM trip_requests tr
    WHERE tr.id = flight_offers.trip_request_id
    AND tr.user_id = auth.uid()
  )
  -- OR allow public access during development
  OR current_setting('app.environment', TRUE) = 'development'
);

-- Also create a policy for anon access during development
CREATE POLICY "Allow anon read access to flight offers"
ON flight_offers
FOR SELECT
USING (true);

-- Grant necessary permissions
GRANT SELECT ON flight_offers TO authenticated, anon;
