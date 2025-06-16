-- Add missing columns to flight_offers table that are referenced in edge function
-- These columns were added to the edge function code but not to the database schema

-- Add nonstop_match column (referenced in edge function but missing from schema)
ALTER TABLE flight_offers 
ADD COLUMN IF NOT EXISTS nonstop_match BOOLEAN DEFAULT false;

-- Add any other missing columns that might be referenced
-- (Check if baggage_included already exists, add if not)
ALTER TABLE flight_offers 
ADD COLUMN IF NOT EXISTS baggage_included BOOLEAN DEFAULT false;

-- Update existing records to have sensible defaults
UPDATE flight_offers 
SET nonstop_match = false 
WHERE nonstop_match IS NULL;

UPDATE flight_offers 
SET baggage_included = false 
WHERE baggage_included IS NULL;

-- Add comments for clarity
COMMENT ON COLUMN flight_offers.nonstop_match IS 'Whether this flight offer matches nonstop requirements';
COMMENT ON COLUMN flight_offers.baggage_included IS 'Whether carry-on baggage is included in the price';

