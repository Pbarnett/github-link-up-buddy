-- Step 2: Create monitoring view and webhook events table
-- Execute this after step 1

-- Create duffel_webhook_events table
CREATE TABLE IF NOT EXISTS duffel_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    booking_attempt_id UUID REFERENCES booking_attempts(id),
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON duffel_webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON duffel_webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_events_booking_attempt ON duffel_webhook_events(booking_attempt_id);

-- Enable RLS
ALTER TABLE duffel_webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS Policy for webhook events (service role only)
DROP POLICY IF EXISTS "Service role can manage webhook events" ON duffel_webhook_events;
CREATE POLICY "Service role can manage webhook events" ON duffel_webhook_events
    FOR ALL USING (auth.role() = 'service_role');

-- Create monitoring view for booking attempts
CREATE OR REPLACE VIEW booking_attempts_summary AS
SELECT 
    DATE_TRUNC('hour', created_at) AS hour,
    status,
    COUNT(*) AS count,
    AVG(EXTRACT(EPOCH FROM (COALESCE(completed_at, NOW()) - created_at))) AS avg_duration_seconds,
    SUM(CASE WHEN retry_count > 0 THEN 1 ELSE 0 END) AS retry_count
FROM booking_attempts
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at), status
ORDER BY hour DESC, status;

-- Grant permissions for monitoring view
GRANT SELECT ON booking_attempts_summary TO authenticated;
