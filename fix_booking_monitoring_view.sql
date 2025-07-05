-- Fix the booking_monitoring view with correct column names
DROP VIEW IF EXISTS booking_monitoring;

CREATE OR REPLACE VIEW booking_monitoring AS
SELECT 
  ba.id,
  ba.trip_request_id,
  ba.attempt_timestamp,
  tr.origin_location_code as origin,
  tr.destination_location_code as destination,
  tr.departure_date,
  'PENDING' as monitoring_status
FROM booking_attempts ba
LEFT JOIN trip_requests tr ON ba.trip_request_id = tr.id
ORDER BY ba.attempt_timestamp DESC;

-- Grant permissions
GRANT SELECT ON booking_monitoring TO authenticated;
