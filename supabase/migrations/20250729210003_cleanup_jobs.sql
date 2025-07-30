-- Scheduled cleanup for expired flight offers
SELECT cron.schedule(
  'cleanup_expired_offers',
  '0 2 * * *',  -- Run at 02:00 UTC daily
  $$DELETE FROM public.flight_offers
    WHERE status IN ('pending','expired')
      AND expires_at IS NOT NULL
      AND expires_at < now() - interval '30 days';$$
);

-- Anonymize passenger PII after 90 days post flight date (conditional on table existence)
DO $main$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'passengers') 
       AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bookings') THEN
        
        PERFORM cron.schedule(
          'anonymize_passenger_pii',
          '30 2 * * *',  -- Run at 02:30 UTC daily
          $cron$UPDATE public.passengers
            SET given_name = 'ANON', family_name = 'USER', born_on = NULL, anonymized_at = now()
          FROM public.bookings b
          WHERE passengers.booking_id = b.id
            AND b.created_at < current_date - interval '90 days'
            AND passengers.anonymized_at IS NULL;$cron$
        );
    ELSE
        RAISE NOTICE 'Skipping passenger anonymization job - required tables not found';
    END IF;
END $main$;

-- Ensure the anonymization uses a flag for repeats (only if passengers table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'passengers') THEN
        ALTER TABLE public.passengers ADD COLUMN IF NOT EXISTS anonymized_at timestamptz;
    END IF;
END $$;

-- Add comment only if passengers table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'passengers') THEN
        COMMENT ON COLUMN public.passengers.anonymized_at IS 'Timestamp indicating PII has been anonymized';
    END IF;
END $$;
