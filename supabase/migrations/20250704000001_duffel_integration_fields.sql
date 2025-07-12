-- Add Duffel integration fields to support booking pipeline
-- Migration: 20250704000001_duffel_integration_fields.sql

-- Add Duffel offer and order tracking to booking_requests
ALTER TABLE booking_requests 
ADD COLUMN IF NOT EXISTS duffel_offer_id TEXT,
ADD COLUMN IF NOT EXISTS duffel_offer_data JSONB;

-- Add Duffel order tracking to bookings
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS duffel_order_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS duffel_order_data JSONB,
ADD COLUMN IF NOT EXISTS ticket_numbers TEXT[];

-- Add Duffel-specific feature flag if not exists
INSERT INTO feature_flags (name, enabled, description, created_at) 
VALUES (
  'duffel_live_enabled', 
  false, 
  'Enable live Duffel bookings (vs test mode)', 
  NOW()
) ON CONFLICT (name) DO NOTHING;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_duffel_order_id ON bookings(duffel_order_id) WHERE duffel_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_booking_requests_duffel_offer_id ON booking_requests(duffel_offer_id) WHERE duffel_offer_id IS NOT NULL;

-- Add RLS policies for new fields (inherit from existing booking policies)
-- No additional RLS needed as these fields are part of existing tables with proper policies

COMMENT ON COLUMN booking_requests.duffel_offer_id IS 'Duffel offer ID from offer request API';
COMMENT ON COLUMN booking_requests.duffel_offer_data IS 'Full Duffel offer response for reference';
COMMENT ON COLUMN bookings.duffel_order_id IS 'Duffel order ID from successful booking';
COMMENT ON COLUMN bookings.duffel_order_data IS 'Full Duffel order response including ticket details';
COMMENT ON COLUMN bookings.ticket_numbers IS 'Array of airline ticket numbers from Duffel order';
