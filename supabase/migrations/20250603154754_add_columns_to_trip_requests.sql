-- Add flight preference columns to trip_requests
ALTER TABLE trip_requests
  ADD COLUMN IF NOT EXISTS nonstop_required BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS baggage_included_required BOOLEAN NOT NULL DEFAULT FALSE;
