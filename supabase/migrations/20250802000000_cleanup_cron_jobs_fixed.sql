-- Create cleanup cron jobs for expired data (Fixed version)
-- Addresses Gaps #27 and #28: Cleanup cron removes expired offers and anonymizes PII

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 1. Cleanup expired flight offers (runs every hour)
-- This addresses Gap #27: Cleanup cron removes expired offers
SELECT cron.schedule(
  'cleanup-expired-offers',
  '0 * * * *', -- Every hour at minute 0
  $$
  UPDATE public.flight_offers 
  SET 
    status = 'expired',
    updated_at = NOW()
  WHERE 
    status = 'pending' 
    AND expires_at IS NOT NULL 
    AND expires_at < NOW()
    AND status != 'expired';
  $$
);

-- 2. Cleanup old booking attempts (runs daily at 2 AM)
-- Remove booking attempts older than 30 days to prevent table bloat
SELECT cron.schedule(
  'cleanup-old-booking-attempts',
  '0 2 * * *', -- Daily at 2 AM
  $$
  DELETE FROM public.booking_attempts 
  WHERE 
    created_at < NOW() - INTERVAL '30 days'
    AND status IN ('succeeded', 'failed');
  $$
);

-- 3. PII anonymization for deleted users (runs daily at 3 AM)
-- This addresses Gap #28: Cleanup job anonymizes PII
SELECT cron.schedule(
  'anonymize-deleted-user-pii', 
  '0 3 * * *', -- Daily at 3 AM
  $$
  -- Anonymize PII in profiles table (if it exists)
  DO $inner$
  BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
      UPDATE public.profiles
      SET 
        first_name = 'ANONYMIZED',
        last_name = 'USER',
        email = 'anonymized@example.com',
        phone = NULL,
        updated_at = NOW()
      WHERE 
        created_at < NOW() - INTERVAL '2 years'  -- Anonymize old profiles
        AND first_name != 'ANONYMIZED';
    END IF;
  END $inner$;

  -- Anonymize old trip request PII for privacy compliance
  UPDATE public.trip_requests
  SET 
    contact_email = 'anonymized@example.com',
    contact_phone = NULL,
    traveler_name = 'Anonymized User',
    updated_at = NOW()
  WHERE 
    created_at < NOW() - INTERVAL '2 years'
    AND contact_email != 'anonymized@example.com';
  $$
);

-- Create indexes to support cleanup operations efficiently
CREATE INDEX IF NOT EXISTS flight_offers_cleanup_idx 
  ON public.flight_offers (status, expires_at) 
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS booking_attempts_cleanup_idx 
  ON public.booking_attempts (created_at, status) 
  WHERE status IN ('succeeded', 'failed');

-- Comments for documentation
COMMENT ON INDEX flight_offers_cleanup_idx IS 'Supports efficient cleanup of expired flight offers';
COMMENT ON INDEX booking_attempts_cleanup_idx IS 'Supports efficient cleanup of old booking attempts';

-- View cron jobs
SELECT 
  jobname,
  schedule,
  active,
  jobid
FROM cron.job 
WHERE jobname LIKE 'cleanup-%' OR jobname LIKE 'anonymize-%';
