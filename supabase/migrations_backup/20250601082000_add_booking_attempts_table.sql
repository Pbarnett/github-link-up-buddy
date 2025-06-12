-- Create booking_attempts table to track attempts to book a trip_request
CREATE TABLE IF NOT EXISTS booking_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_request_id UUID REFERENCES trip_requests(id) ON DELETE CASCADE,
  attempt_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (trip_request_id) -- Ensures only one attempt record per trip_request, effectively tracking the first attempt.
                           -- If multiple attempts need to be logged, remove this UNIQUE constraint
                           -- or make a composite key if attempt_timestamp should also be part of uniqueness.
                           -- For now, assuming we only care about the first/latest attempt flag.
);

-- Optional: Add index for faster lookups on trip_request_id if needed,
-- though the UNIQUE constraint already creates an index.
-- CREATE INDEX IF NOT EXISTS idx_booking_attempts_trip_request_id ON booking_attempts(trip_request_id);
