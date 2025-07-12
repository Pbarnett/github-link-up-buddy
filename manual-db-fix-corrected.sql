-- Fix Missing Feature Flags (corrected column names)
INSERT INTO feature_flags (name, enabled, description) VALUES 
('duffel_webhooks_enabled', false, 'Enable Duffel webhook processing'),
('auto_booking_enhanced', false, 'Enable enhanced auto-booking features')
ON CONFLICT (name) DO NOTHING;

-- Create RPC Functions for Booking Logic
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
    offer_id,
    idempotency_key,
    passenger_data,
    status,
    created_at
  ) VALUES (
    p_trip_request_id,
    p_offer_id,
    p_idempotency_key,
    p_passenger_data,
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
    booking_reference = p_booking_reference,
    error_details = p_error_details,
    updated_at = NOW()
  WHERE id = p_attempt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Monitoring View
CREATE OR REPLACE VIEW booking_monitoring AS
SELECT 
  ba.id,
  ba.trip_request_id,
  ba.offer_id,
  ba.status,
  ba.booking_reference,
  ba.created_at,
  ba.updated_at,
  tr.origin,
  tr.destination,
  tr.departure_date,
  CASE 
    WHEN ba.status = 'confirmed' THEN 'SUCCESS'
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
