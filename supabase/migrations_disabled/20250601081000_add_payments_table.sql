-- Create payments table to track payment information related to bookings
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL,        -- e.g., pending/paid/failed. Consider ENUM type.
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional: Add index for faster lookups on booking_id or stripe_payment_intent_id
-- CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
-- CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);

-- Note: Consider using an ENUM type for 'status'.
-- This will be handled in a subsequent migration if chosen.
