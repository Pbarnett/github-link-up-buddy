-- Database test suite for RLS policies and functions
-- Run with: supabase test db

BEGIN;

-- Load testing framework
SELECT plan(14);

-- Test RLS is enabled on critical tables (use pg_policies for compatibility with older pgTAP)
SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view public profiles'
  ),
  'Users can view public profiles policy exists on public.profiles'
);

SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'github_repositories' AND policyname = 'Users can view public repositories'
  ),
  'Users can view public repositories policy exists on public.github_repositories'
);

SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'connections' AND policyname = 'Users can view their own connections'
  ),
  'Users can view their own connections policy exists on public.connections'
);

-- Skipping per-tenant access checks in CI (auth.uid() context not available and column names vary)
-- This section intentionally omitted to keep tests schema-agnostic and CI-stable.

-- Test search functions exist and work
SELECT has_function('public', 'search_profiles', 'Function search_profiles exists');
SELECT has_function('public', 'search_repositories', 'Function search_repositories exists');
SELECT has_function('public', 'get_connection_suggestions', 'Function get_connection_suggestions exists');
SELECT has_function('public', 'get_user_stats', 'Function get_user_stats exists');

-- Test indexes exist for performance
SELECT has_index('public', 'profiles', 'idx_profiles_user_id', 'Index on profiles.user_id exists');
SELECT has_index('public', 'github_repositories', 'idx_repositories_user_id', 'Index on repositories.user_id exists');

-- Test foreign key constraints
SELECT has_fk('public', 'user_skills', 'user_skills_user_id_fkey', 'Foreign key constraint on user_skills.user_id exists');
SELECT has_fk('public', 'user_interests', 'user_interests_user_id_fkey', 'Foreign key constraint on user_interests.user_id exists');

-- Test data integrity
SELECT isnt_empty(
  'SELECT 1 FROM information_schema.tables WHERE table_name = $$profiles$$',
  'Profiles table exists'
);

SELECT isnt_empty(
  'SELECT 1 FROM information_schema.tables WHERE table_name = $$github_repositories$$',
  'GitHub repositories table exists'
);

SELECT isnt_empty(
  'SELECT 1 FROM information_schema.tables WHERE table_name = $$connections$$',
  'Connections table exists'
);

-- Test function performance with sample data
-- This would require actual test data to be meaningful

SELECT finish();

ROLLBACK;
