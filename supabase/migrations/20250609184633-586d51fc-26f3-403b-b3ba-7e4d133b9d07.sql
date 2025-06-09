
-- Remove duplicate auto_book column (keeping auto_book_enabled)
ALTER TABLE public.trip_requests DROP COLUMN IF EXISTS auto_book;

-- Remove unused columns that don't exist in the reverted code
ALTER TABLE public.trip_requests DROP COLUMN IF EXISTS adults;
ALTER TABLE public.trip_requests DROP COLUMN IF EXISTS departure_date;
ALTER TABLE public.trip_requests DROP COLUMN IF EXISTS return_date;
ALTER TABLE public.trip_requests DROP COLUMN IF EXISTS origin_location_code;
ALTER TABLE public.trip_requests DROP COLUMN IF EXISTS destination_location_code;
ALTER TABLE public.trip_requests DROP COLUMN IF EXISTS baggage_included_required;
ALTER TABLE public.trip_requests DROP COLUMN IF EXISTS nonstop_required;
ALTER TABLE public.trip_requests DROP COLUMN IF EXISTS best_price;
ALTER TABLE public.trip_requests DROP COLUMN IF EXISTS last_checked_at;

-- Create the trigger function that the code expects
CREATE OR REPLACE FUNCTION public.set_destination_location_code()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.destination_location_code IS NULL THEN
    NEW.destination_location_code := NEW.destination_airport;
  END IF;
  RETURN NEW;
END;
$function$;

-- Note: The trigger will be created after we add back the destination_location_code column
-- Add back only the columns that the reverted code actually uses
ALTER TABLE public.trip_requests ADD COLUMN IF NOT EXISTS destination_location_code text;

-- Now create the trigger
DROP TRIGGER IF EXISTS set_destination_location_code_trigger ON public.trip_requests;
CREATE TRIGGER set_destination_location_code_trigger
  BEFORE INSERT OR UPDATE ON public.trip_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.set_destination_location_code();
