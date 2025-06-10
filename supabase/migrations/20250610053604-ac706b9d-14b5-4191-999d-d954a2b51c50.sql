
-- 1. Back-fill only valid destination_location_code values
UPDATE trip_requests
SET destination_location_code = destination_airport
WHERE destination_location_code IS NULL
  AND destination_airport IS NOT NULL
  AND destination_airport != '';

-- 2. Identify and handle problematic rows (optional - for visibility)
-- You can uncomment this to see how many rows would be affected:
-- SELECT COUNT(*) FROM trip_requests 
-- WHERE destination_location_code IS NULL;

-- 3. For any remaining NULL values, we'll need to decide:
-- Option A: Delete invalid rows (aggressive cleanup)
-- DELETE FROM trip_requests 
-- WHERE destination_location_code IS NULL;

-- Option B: Set a placeholder that can be handled in code
-- UPDATE trip_requests 
-- SET destination_location_code = 'INVALID'
-- WHERE destination_location_code IS NULL;

-- For now, let's use option B with a clear marker
UPDATE trip_requests 
SET destination_location_code = 'INVALID'
WHERE destination_location_code IS NULL;

-- 4. Now we can safely enforce NOT NULL
ALTER TABLE trip_requests
  ALTER COLUMN destination_location_code SET NOT NULL;

-- 5. Add booking preference to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS trip_mode TEXT
  CHECK (trip_mode IN ('manual','auto'))
  DEFAULT 'manual';

-- 6. Draft wizard state per-user
CREATE TABLE IF NOT EXISTS draft_trip_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  step_data JSONB NOT NULL DEFAULT '{}',
  current_step TEXT NOT NULL DEFAULT 'trip',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT draft_trip_requests_user_id_key UNIQUE (user_id)
);

-- 7. Enable RLS and policies
ALTER TABLE draft_trip_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select own draft trips"
  ON draft_trip_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Insert own draft trips"
  ON draft_trip_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Update own draft trips"
  ON draft_trip_requests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Delete own draft trips"
  ON draft_trip_requests
  FOR DELETE USING (auth.uid() = user_id);
