-- Cleanup: Remove expired flight_offers older than 30 days
-- Set up a cron job using pg_cron to automatically clean up expired offers

-- Ensure pg_cron is installed
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the cron job to run daily at midnight
SELECT cron.schedule(
    'clean_expired_flight_offers',
    '0 0 * * *',
    $$
    DELETE FROM public.flight_offers
    WHERE expires_at < NOW() - INTERVAL '30 days';
    $$
);

-- Ensure the cron job is owned by the web_anon role for security
-- Adjust the role permissions if necessary
ALTER TABLE cron.job RUN AS OWNER FOR USER web_anon;
