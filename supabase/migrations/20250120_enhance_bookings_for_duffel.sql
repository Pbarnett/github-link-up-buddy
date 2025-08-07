-- Enhance bookings table for complete Duffel integration
-- Adds missing columns needed for webhook processing and order tracking

-- Add Duffel-specific columns if they don't exist
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS duffel_status text,
ADD COLUMN IF NOT EXISTS confirmed_at timestamptz,
ADD COLUMN IF NOT EXISTS ticketed_at timestamptz,
ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_duffel_order_id ON bookings(duffel_order_id);
CREATE INDEX IF NOT EXISTS idx_bookings_duffel_status ON bookings(duffel_status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status_updated_at ON bookings(status, updated_at);

-- Add table for storing tickets information
CREATE TABLE IF NOT EXISTS tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  duffel_ticket_id text UNIQUE,
  ticket_number text,
  passenger_name text,
  issued_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for tickets
CREATE INDEX IF NOT EXISTS idx_tickets_booking_id ON tickets(booking_id);
CREATE INDEX IF NOT EXISTS idx_tickets_duffel_ticket_id ON tickets(duffel_ticket_id);

-- Enable RLS for tickets
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create tickets policy
CREATE POLICY "Users can view their own tickets" ON tickets
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

-- Service role can manage all tickets
CREATE POLICY "Service role can manage tickets" ON tickets
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Add trigger for tickets updated_at
CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Add helpful comments
COMMENT ON COLUMN bookings.duffel_status IS 'Current status from Duffel API (pending, confirmed, cancelled, etc.)';
COMMENT ON COLUMN bookings.confirmed_at IS 'When the booking was confirmed by the airline';
COMMENT ON COLUMN bookings.ticketed_at IS 'When tickets were issued';
COMMENT ON COLUMN bookings.cancelled_at IS 'When the booking was cancelled';

COMMENT ON TABLE tickets IS 'Individual tickets issued for bookings';
COMMENT ON COLUMN tickets.duffel_ticket_id IS 'Unique ticket ID from Duffel API';
COMMENT ON COLUMN tickets.ticket_number IS 'Airline ticket number (e.g., 125-1234567890)';

-- Create view for booking status with tickets
CREATE OR REPLACE VIEW booking_status_with_tickets AS
SELECT 
  b.*,
  CASE 
    WHEN b.status = 'ticketed' THEN 'Tickets Issued'
    WHEN b.status = 'confirmed' THEN 'Confirmed'
    WHEN b.status = 'pending' THEN 'Processing'
    WHEN b.status = 'cancelled' THEN 'Cancelled'
    ELSE 'Unknown'
  END as status_display,
  COUNT(t.id) as ticket_count,
  array_agg(
    json_build_object(
      'id', t.id,
      'ticket_number', t.ticket_number,
      'passenger_name', t.passenger_name,
      'issued_at', t.issued_at
    )
  ) FILTER (WHERE t.id IS NOT NULL) as tickets
FROM bookings b
LEFT JOIN tickets t ON b.id = t.booking_id
GROUP BY b.id;

-- Grant access to the view
GRANT SELECT ON booking_status_with_tickets TO authenticated;
GRANT SELECT ON booking_status_with_tickets TO service_role;
