-- Migration: Add 'cancelled' value to public.booking_request_status ENUM type
-- Timestamp: 20250610130000

-- This migration adds the 'cancelled' status to the existing booking_request_status ENUM.
-- This is required by the cancel-booking function to correctly update the status
-- of booking requests that have been cancelled.

-- The command ALTER TYPE ... ADD VALUE is transactional and generally safe.
-- IF NOT EXISTS for ADD VALUE is supported in PostgreSQL 10+.
-- Supabase migrations run once, so if the value somehow exists, the command might error
-- without IF NOT EXISTS, but IF NOT EXISTS makes it more robust for re-runnable dev scripts.
ALTER TYPE public.booking_request_status ADD VALUE IF NOT EXISTS 'cancelled';

COMMENT ON TYPE public.booking_request_status IS
'Enum for tracking the lifecycle status of a booking request. Values include: new, pending_payment, pending_booking, processing, done, failed, cancelled.';
