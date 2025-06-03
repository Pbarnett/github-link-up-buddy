-- Add columns to trip_requests table
ALTER TABLE trip_requests
ADD COLUMN IF NOT EXISTS nonstop_required BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS baggage_included_required BOOLEAN NOT NULL DEFAULT FALSE;

-- Add column to flight_offers table

ALTER TABLE flight_offers
ADD COLUMN IF NOT EXISTS baggage_included BOOLEAN NOT NULL DEFAULT FALSE;

-- Add columns to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS email_reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS sms_reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS one_hour_email_sent BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS one_hour_sms_sent BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS second_reminder_scheduled_at TIMESTAMP NULL;
