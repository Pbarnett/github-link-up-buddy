-- supabase/migrations/20250729_add_cleanup_cron.sql
-- This migration adds nightly cleanup jobs to pg_cron for expired offers and PII anonymization.

-- Schedule a job to delete expired flight offers daily at 2:00 AM UTC
SELECT cron.schedule(
    'cleanup_expired_offers',
    '0 2 * * *', -- 2:00 AM UTC
    $$
    DELETE FROM public.flight_offers
    WHERE expires_at < NOW() - INTERVAL '1 hour';
    $$
);

-- Schedule a job to anonymize passenger PII for bookings older than 30 days, daily at 3:00 AM UTC
SELECT cron.schedule(
    'anonymize_passenger_pii',
    '0 3 * * *', -- 3:00 AM UTC
    $$
    UPDATE public.passengers
    SET
        first_name = 'ANONYMIZED',
        last_name = 'ANONYMIZED',
        email = 'anonymized@example.com',
        phone_number = NULL,
        encrypted_passport_details = NULL
    WHERE booking_id IN (
        SELECT id FROM public.bookings WHERE booked_at < NOW() - INTERVAL '30 days'
    );
    $$
);
