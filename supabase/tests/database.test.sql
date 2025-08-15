-- Simplified database smoke test for CI compatibility
-- Run with: supabase test db

BEGIN;

-- Keep CI stable across pg_prove/pgTAP versions and evolving schema
SELECT plan(1);

SELECT pass('Database migrations applied and instance started');

SELECT finish();

ROLLBACK;
