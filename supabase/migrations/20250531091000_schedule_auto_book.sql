-- supabase/migrations/20250531091000_schedule_auto_book.sql

-- This migration should run AFTER 20250531090000_enable_pg_cron.sql
-- which enables the pg_cron extension.

BEGIN;

-- Comments on permissions:
-- The role executing this SELECT cron.schedule command (e.g., 'postgres' or 'supabase_admin' during migrations)
-- must have USAGE permission on the 'cron' schema. The 'postgres' user usually has this by default after
-- `CREATE EXTENSION pg_cron WITH SCHEMA extensions;` and `GRANT USAGE ON SCHEMA cron TO postgres;`.
-- The command `supabase.functions.invoke` will be executed by the 'postgres' user (or the user pg_cron runs its background worker as),
-- which typically has the necessary permissions to invoke Edge Functions if RLS is not blocking it.

RAISE NOTICE 'Scheduling job: auto_book_runner to invoke function scheduler-flight-search hourly.';

-- Schedule the 'scheduler-flight-search' Edge Function to run hourly at minute 0.
-- The job name 'auto_book_runner' is used. If a job with this name already exists,
-- cron.schedule will update its schedule and command.

-- The command for cron execution, using supabase.functions.invoke:
-- Note: The user that pg_cron runs its jobs as (typically 'postgres' or a dedicated cron user)
-- must have permissions to execute supabase.functions.invoke and the target function 'scheduler-flight-search'.
-- If RLS is enabled, ensure the invoking role is appropriately handled.
SELECT cron.schedule(
  'auto_book_runner',    -- job name (unique identifier)
  '0 * * * *',           -- cron syntax for "at minute 0 of every hour"
  $$SELECT supabase.functions.invoke('scheduler-flight-search');$$ -- SQL command to execute via Supabase's SQL interface
);

/*
-- Alternative using net.http_post (if direct HTTP invocation with specific headers/body is preferred):
-- This requires the 'pg_net' extension to be enabled.
-- Replace YOUR_SUPABASE_PROJECT_URL and YOUR_SUPABASE_SERVICE_ROLE_KEY with actual values.
-- Ensure the URL points to your specific Edge Function.
SELECT cron.schedule(
  'auto_book_runner_http', -- Use a different name if keeping both for testing, or replace the one above
  '0 * * * *',
  $$
  SELECT net.http_post(
    url:='YOUR_SUPABASE_PROJECT_URL/functions/v1/scheduler-flight-search',
    headers:='{"Authorization": "Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY", "Content-Type": "application/json"}'::jsonb,
    body:='{}'::jsonb -- Empty body, or specify if your function expects one
  );
  $$
);
*/

-- For manual verification by the user after this migration is applied:
-- You can run the following SQL query in your Supabase SQL Editor to check the cron job entry:
/*
SELECT jobid, jobname, schedule, command, nodename, nodeport, database, username, active, job_cluster
FROM cron.job
WHERE jobname = 'auto_book_runner';

-- To check run details/logs:
SELECT * 
FROM cron.job_run_details
WHERE jobname = 'auto_book_runner'
ORDER BY start_time DESC
LIMIT 10;
*/

RAISE NOTICE 'Job "auto_book_runner" scheduled. Verify with: SELECT * FROM cron.job WHERE jobname = ''auto_book_runner'';';

COMMIT;
```
