-- Auto-Booking Monitor pg_cron Migration

-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the auto-book-monitor job
SELECT cron.schedule(
  'auto_book_monitor',
  '*/10 * * * *',
  $$
    SELECT net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/auto-book-monitor',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key'),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'action', 'monitor',
        'maxOffers', 50,
        'dryRun', false
      )
    );
  $$
);

