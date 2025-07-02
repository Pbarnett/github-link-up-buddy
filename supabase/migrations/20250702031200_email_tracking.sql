-- Email tracking tables for Resend webhook integration

-- Email events table for storing all webhook events
CREATE TABLE IF NOT EXISTS email_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('email.sent', 'email.delivered', 'email.bounced', 'email.complained', 'email.clicked', 'email.opened')),
    recipient TEXT NOT NULL,
    subject TEXT,
    from_address TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    event_data JSONB,
    created_at TIMESTAMPTZ NOT NULL,
    received_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email suppressions table for bounces and complaints
CREATE TABLE IF NOT EXISTS email_suppressions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email_address TEXT NOT NULL UNIQUE,
    suppression_type TEXT NOT NULL CHECK (suppression_type IN ('bounce', 'complaint', 'unsubscribe')),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email engagement tracking (opens, clicks)
CREATE TABLE IF NOT EXISTS email_engagement (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email_id TEXT NOT NULL,
    engagement_type TEXT NOT NULL CHECK (engagement_type IN ('opened', 'clicked')),
    recipient TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_events_email_id ON email_events(email_id);
CREATE INDEX IF NOT EXISTS idx_email_events_recipient ON email_events(recipient);
CREATE INDEX IF NOT EXISTS idx_email_events_type ON email_events(event_type);
CREATE INDEX IF NOT EXISTS idx_email_events_created_at ON email_events(created_at);

CREATE INDEX IF NOT EXISTS idx_email_suppressions_email ON email_suppressions(email_address);
CREATE INDEX IF NOT EXISTS idx_email_suppressions_type ON email_suppressions(suppression_type);

CREATE INDEX IF NOT EXISTS idx_email_engagement_email_id ON email_engagement(email_id);
CREATE INDEX IF NOT EXISTS idx_email_engagement_recipient ON email_engagement(recipient);

-- Enable RLS (Row Level Security)
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_suppressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_engagement ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing service role access for webhooks)
CREATE POLICY "Service role can manage email events" ON email_events
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage email suppressions" ON email_suppressions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage email engagement" ON email_engagement
    FOR ALL USING (auth.role() = 'service_role');
