-- Backfill missing destination_location_code from destination_airport
UPDATE public.trip_requests
  SET destination_location_code = destination_airport
WHERE destination_location_code IS NULL;

-- Create or replace function to default destination_location_code
CREATE OR REPLACE FUNCTION set_destination_location_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.destination_location_code IS NULL THEN
    NEW.destination_location_code := NEW.destination_airport;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to trip_requests
DROP TRIGGER IF EXISTS trg_default_dest_code ON public.trip_requests;
CREATE TRIGGER trg_default_dest_code
  BEFORE INSERT OR UPDATE ON public.trip_requests
  FOR EACH ROW EXECUTE FUNCTION set_destination_location_code();

-- Add NOT NULL constraint
ALTER TABLE public.trip_requests
  ALTER COLUMN destination_location_code SET NOT NULL;
