
-- Backfill missing destination_location_code from destination_airport
UPDATE public.trip_requests
SET destination_location_code = destination_airport
WHERE destination_location_code IS NULL AND destination_airport IS NOT NULL;

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

-- Safely add NOT NULL constraint with guards
DO $$
DECLARE
  cnt INT;
BEGIN
  -- Check if any rows still have NULL destination_location_code
  SELECT COUNT(*) INTO cnt
    FROM public.trip_requests
   WHERE destination_location_code IS NULL;
   
  IF cnt = 0 THEN
    -- Check if column is already NOT NULL to avoid error on re-run
    IF EXISTS (
      SELECT 1
        FROM information_schema.columns
       WHERE table_name = 'trip_requests'
         AND column_name = 'destination_location_code'
         AND is_nullable = 'YES'
    ) THEN
      ALTER TABLE public.trip_requests
        ALTER COLUMN destination_location_code SET NOT NULL;
      RAISE NOTICE 'Successfully set destination_location_code to NOT NULL';
    ELSE
      RAISE NOTICE 'Column destination_location_code is already NOT NULL';
    END IF;
  ELSE
    RAISE NOTICE 'Still % null destination_location_code rows—skipping NOT NULL constraint', cnt;
  END IF;
END
$$;
