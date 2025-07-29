-- Auto-Booking pg_cron Job Setup
-- Schedules the auto-book-monitor to run every 10 minutes

SELECT cron.schedule('auto_booking_check', '*/10 * * * *', $$
  SELECT net.http_post(
    url := 'https://your-cloud-function-url/edge-function-path',
    headers := jsonb_build_object('Authorization', 'Bearer your-token')
  );
$$);

