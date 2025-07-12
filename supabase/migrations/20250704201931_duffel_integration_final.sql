-- Duffel Integration Final Migration
-- This migration adds the remaining RPC functions and monitoring capabilities
-- Compatible with the existing basic booking_attempts table

-- First, add the missing columns to booking_attempts if they don't exist
ALTER TABLE booking_attempts 
ADD COLUMN IF NOT EXISTS duffel_offer_id TEXT,
ADD COLUMN IF NOT EXISTS duffel_booking_reference TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS idempotency_key TEXT,
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add unique constraint on idempotency_key if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'booking_attempts_idempotency_key_key') THEN
        ALTER TABLE booking_attempts ADD CONSTRAINT booking_attempts_idempotency_key_key UNIQUE (idempotency_key);
    END IF;
END $$;

-- Create simplified RPC Functions for Duffel integration
CREATE OR REPLACE FUNCTION create_booking_attempt(
  p_trip_request_id UUID,
  p_offer_id TEXT,
  p_idempotency_key TEXT,
  p_passenger_data JSONB
) RETURNS UUID AS $$
DECLARE
  v_attempt_id UUID;
BEGIN
  -- Check for existing attempt with same idempotency key
  SELECT id INTO v_attempt_id 
  FROM booking_attempts 
  WHERE idempotency_key = p_idempotency_key;
  
  IF v_attempt_id IS NOT NULL THEN
    RETURN v_attempt_id;
  END IF;
  
  -- Create new booking attempt
  INSERT INTO booking_attempts (
    trip_request_id,
    duffel_offer_id,
    idempotency_key,
    status,
    created_at
  ) VALUES (
    p_trip_request_id,
    p_offer_id,
    p_idempotency_key,
    'pending',
    NOW()
  ) RETURNING id INTO v_attempt_id;
  
  RETURN v_attempt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_booking_status(
  p_attempt_id UUID,
  p_status TEXT,
  p_booking_reference TEXT DEFAULT NULL,
  p_error_details JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  UPDATE booking_attempts 
  SET 
    status = p_status,
    duffel_booking_reference = p_booking_reference,
    error_message = CASE WHEN p_error_details IS NOT NULL THEN p_error_details->>'message' ELSE NULL END,
    updated_at = NOW()
  WHERE id = p_attempt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Create Monitoring View
CREATE OR REPLACE VIEW booking_monitoring AS
SELECT 
  ba.id,
  ba.trip_request_id,
  ba.duffel_offer_id,
  ba.status,
  ba.duffel_booking_reference,
  ba.created_at,
  ba.updated_at,
  tr.origin_location_code as origin,
  tr.destination_location_code as destination,
  tr.departure_date,
  CASE 
    WHEN ba.status = 'completed' THEN 'SUCCESS'
    WHEN ba.status = 'failed' THEN 'FAILED'
    ELSE 'PENDING'
  END as monitoring_status
FROM booking_attempts ba
LEFT JOIN trip_requests tr ON ba.trip_request_id = tr.id
ORDER BY ba.created_at DESC;

-- Grant Permissions
GRANT EXECUTE ON FUNCTION create_booking_attempt TO authenticated;
GRANT EXECUTE ON FUNCTION update_booking_status TO authenticated;
GRANT SELECT ON booking_monitoring TO authenticated;
