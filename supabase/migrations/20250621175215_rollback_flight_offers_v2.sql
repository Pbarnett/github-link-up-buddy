-- Rollback migration for flight_offers_v2 table
-- This file can be used to safely remove the v2 table if needed

-- Drop indexes first
DROP INDEX IF EXISTS "public"."idx_flight_offers_v2_enabled";
DROP INDEX IF EXISTS "public"."idx_flight_offers_v2_trip_request_id";

-- Drop the table (CASCADE will remove foreign key constraints)
DROP TABLE IF EXISTS "public"."flight_offers_v2" CASCADE;

-- Note: This rollback migration should be run manually if needed
-- It is not automatically executed by Supabase migrations
