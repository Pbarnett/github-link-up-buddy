-- Add booking status, PNR, payment_status, selected_seat_number to bookings table
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS pnr TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS selected_seat_number TEXT NULL;

-- Note: Consider using ENUM types for 'status' and 'payment_status'
-- This will be handled in a subsequent migration if chosen.
