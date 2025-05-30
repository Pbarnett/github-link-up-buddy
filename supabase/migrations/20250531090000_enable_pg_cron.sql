-- supabase/migrations/20250531090000_enable_pg_cron.sql

BEGIN;

-- Attempt to create the pg_cron extension if it doesn't already exist.
-- It's typically recommended to install extensions into a dedicated schema like 'extensions'.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Grant usage on the cron schema to the postgres role.
-- The 'postgres' user (or the user that cron jobs will run as) needs USAGE permission on the 'cron' schema.
-- In Supabase environments, the 'postgres' role is the superuser.
-- If a less privileged role is used for scheduling jobs, grant to that role instead.
-- For example, if 'supabase_admin' or a custom 'cron_scheduler_role' is used:
-- GRANT USAGE ON SCHEMA cron TO supabase_admin;
-- GRANT SELECT ON cron.job TO supabase_admin; -- To view scheduled jobs
-- GRANT INSERT, UPDATE, DELETE ON cron.job TO supabase_admin; -- To manage jobs
-- However, typically the 'postgres' user (which Supabase uses for admin tasks) handles cron.
GRANT USAGE ON SCHEMA cron TO postgres;

-- Additionally, to allow the postgres user (or other admin roles) to view and manage jobs,
-- they might need specific privileges on tables within the cron schema if default privileges are not sufficient.
-- Often, the extension owner (usually 'postgres' after creation) has these by default.
-- Explicit grants if needed by other roles:
-- GRANT SELECT, INSERT, UPDATE, DELETE ON cron.job TO relevant_role;
-- GRANT SELECT, UPDATE ON cron.job_run_details TO relevant_role;

COMMENT ON EXTENSION pg_cron IS 'pg_cron: Job scheduler for PostgreSQL, used for scheduling periodic tasks such as invoking Supabase Edge Functions.';

COMMIT;
```
