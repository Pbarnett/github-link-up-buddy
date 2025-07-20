-- Duffel Webhook Events Table
-- Stores webhook events from Duffel API for deduplication and audit trail

-- Create webhook events table
CREATE TABLE IF NOT EXISTS duffel_webhook_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_id text NOT NULL UNIQUE, -- Duffel's webhook event ID
  event_type text NOT NULL, -- e.g., 'order.created', 'order.payment_succeeded'
  processed_at timestamptz NOT NULL DEFAULT now(),
  raw_data jsonb NOT NULL, -- Complete webhook payload
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_duffel_webhook_events_webhook_id ON duffel_webhook_events(webhook_id);
CREATE INDEX IF NOT EXISTS idx_duffel_webhook_events_event_type ON duffel_webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_duffel_webhook_events_processed_at ON duffel_webhook_events(processed_at);

-- Add RLS (Row Level Security)
ALTER TABLE duffel_webhook_events ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (webhook processing)
CREATE POLICY "Service role can manage webhook events" ON duffel_webhook_events
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_duffel_webhook_events_updated_at
  BEFORE UPDATE ON duffel_webhook_events
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Add table comment
COMMENT ON TABLE duffel_webhook_events IS 'Stores Duffel webhook events for deduplication and audit trail';
COMMENT ON COLUMN duffel_webhook_events.webhook_id IS 'Unique ID from Duffel webhook event';
COMMENT ON COLUMN duffel_webhook_events.event_type IS 'Type of webhook event (order.created, etc.)';
COMMENT ON COLUMN duffel_webhook_events.processed_at IS 'When the webhook was successfully processed';
COMMENT ON COLUMN duffel_webhook_events.raw_data IS 'Complete webhook payload from Duffel';
