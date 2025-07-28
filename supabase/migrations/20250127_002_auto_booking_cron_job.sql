-- Auto-Booking Monitor pg_cron Job
-- Requirement #13: pg_cron job named `auto_book_monitor` scheduled to run every ≤10 minutes

-- Enable pg_cron extension if not already enabled
-- Note: This is already done in initial schema but included for completeness
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the auto-book monitor cron job
-- Runs every 10 minutes to check for auto-booking opportunities
SELECT cron.schedule(
  'auto_book_monitor',
  '*/10 * * * *',  -- Every 10 minutes
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

-- Create a helper function to manage the cron job
CREATE OR REPLACE FUNCTION public.manage_auto_book_monitor(action text)
RETURNS text AS $$
DECLARE
  result text;
BEGIN
  CASE action
    WHEN 'start' THEN
      -- Enable the cron job
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
      ) INTO result;
      RETURN 'Auto-book monitor job started';
      
    WHEN 'stop' THEN
      -- Disable the cron job
      SELECT cron.unschedule('auto_book_monitor') INTO result;
      RETURN 'Auto-book monitor job stopped';
      
    WHEN 'status' THEN
      -- Check if job exists
      SELECT CASE 
        WHEN EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'auto_book_monitor') 
        THEN 'running' 
        ELSE 'stopped' 
      END INTO result;
      RETURN 'Auto-book monitor status: ' || result;
      
    WHEN 'trigger' THEN
      -- Manually trigger the monitor (for testing)
      PERFORM net.http_post(
        url := current_setting('app.supabase_url') || '/functions/v1/auto-book-monitor',
        headers := jsonb_build_object(
          'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key'),
          'Content-Type', 'application/json'
        ),
        body := jsonb_build_object(
          'action', 'monitor',
          'maxOffers', 10,
          'dryRun', true
        )
      );
      RETURN 'Auto-book monitor triggered manually';
      
    ELSE
      RETURN 'Invalid action. Use: start, stop, status, or trigger';
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view to monitor cron job status and logs
CREATE OR REPLACE VIEW public.auto_book_monitor_status AS
SELECT 
  j.jobid,
  j.jobname,
  j.schedule,
  j.active,
  j.database,
  r.runid,
  r.job_pid,
  r.database as run_database,
  r.username,
  r.command,
  r.status,
  r.return_message,
  r.start_time,
  r.end_time
FROM cron.job j
LEFT JOIN cron.job_run_details r ON j.jobid = r.jobid
WHERE j.jobname = 'auto_book_monitor'
ORDER BY r.start_time DESC NULLS LAST;

-- Grant access to service role for cron management
GRANT EXECUTE ON FUNCTION public.manage_auto_book_monitor(text) TO service_role;
GRANT SELECT ON public.auto_book_monitor_status TO service_role;

-- Add system settings for Supabase URLs (to be set via environment or dashboard)
-- These should be configured in your Supabase project settings:
-- app.supabase_url = 'https://your-project.supabase.co'
-- app.supabase_service_role_key = 'your-service-role-key'

-- Create a function to set up the required settings
CREATE OR REPLACE FUNCTION public.setup_auto_book_settings(
  supabase_url text,
  service_role_key text
)
RETURNS text AS $$
BEGIN
  -- Set the configuration parameters
  PERFORM set_config('app.supabase_url', supabase_url, false);
  PERFORM set_config('app.supabase_service_role_key', service_role_key, false);
  
  RETURN 'Auto-book settings configured successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Restrict access to setup function
GRANT EXECUTE ON FUNCTION public.setup_auto_book_settings(text, text) TO service_role;

-- Add comments for documentation
COMMENT ON FUNCTION public.manage_auto_book_monitor(text) IS 'Manage the auto-book monitor cron job (start, stop, status, trigger)';
COMMENT ON VIEW public.auto_book_monitor_status IS 'View current status and recent runs of the auto-book monitor cron job';
COMMENT ON FUNCTION public.setup_auto_book_settings(text, text) IS 'Configure Supabase URL and service role key for cron job';
