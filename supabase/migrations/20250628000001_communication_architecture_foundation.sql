-- Communication Architecture Foundation Schema
-- Phase 1: Core Infrastructure & Reliability Improvements
-- This migration creates the comprehensive notification system database schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgmq";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Events table (immutable log for event sourcing)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    payload JSONB NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    booking_id UUID,
    source TEXT DEFAULT 'system',
    occurred_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'processing', 'processed', 'failed'))
);

-- Notification templates for content management
CREATE TABLE IF NOT EXISTS public.notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    notification_type TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'push', 'in_app')),
    language TEXT DEFAULT 'en',
    subject TEXT,
    body_text TEXT NOT NULL,
    body_html TEXT,
    active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences for granular notification control
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    preferences JSONB DEFAULT '{}',
    quiet_hours JSONB DEFAULT '{"start": 22, "end": 7}',
    timezone TEXT DEFAULT 'America/New_York',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced notifications table (extending existing if needed)
DO $$
BEGIN
    -- Check if we need to add new columns to existing notifications table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
        -- Add new columns if they don't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'title') THEN
            ALTER TABLE public.notifications ADD COLUMN title TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'content') THEN
            ALTER TABLE public.notifications ADD COLUMN content JSONB NOT NULL DEFAULT '{}';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'channels') THEN
            ALTER TABLE public.notifications ADD COLUMN channels TEXT[] DEFAULT ARRAY['email'];
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'priority') THEN
            ALTER TABLE public.notifications ADD COLUMN priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical'));
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'scheduled_for') THEN
            ALTER TABLE public.notifications ADD COLUMN scheduled_for TIMESTAMPTZ DEFAULT NOW();
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'booking_id') THEN
            ALTER TABLE public.notifications ADD COLUMN booking_id UUID;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'event_id') THEN
            ALTER TABLE public.notifications ADD COLUMN event_id UUID REFERENCES public.events(id);
        END IF;
        
        -- Rename payload to content if payload exists
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'payload') 
           AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'content') THEN
            -- Copy payload data to content and drop payload
            UPDATE public.notifications SET content = COALESCE(payload, '{}');
            ALTER TABLE public.notifications DROP COLUMN payload;
        END IF;
    ELSE
        -- Create new comprehensive notifications table
CREATE TABLE public.notifications (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            type TEXT NOT NULL,
            title TEXT,
            content JSONB NOT NULL DEFAULT '{}',
            channels TEXT[] DEFAULT ARRAY['email'],
            priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
            scheduled_for TIMESTAMPTZ DEFAULT NOW(),
            is_read BOOLEAN DEFAULT false,
            booking_id UUID,
            event_id UUID REFERENCES public.events(id),
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
END
$$;

-- Delivery logs for tracking notification attempts
CREATE TABLE IF NOT EXISTS public.notification_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
    channel TEXT NOT NULL,
    provider TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('queued', 'sending', 'sent', 'delivered', 'failed', 'bounced')),
    attempt_count INTEGER DEFAULT 1,
    provider_response JSONB,
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_events_type_occurred ON public.events(type, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_booking_id ON public.events(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read, created_at DESC);
-- Replace partial index using NOW() (not immutable) with a straightforward index
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON public.notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON public.notifications(priority);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON public.notification_deliveries(status, created_at);
CREATE INDEX IF NOT EXISTS idx_deliveries_notification_id ON public.notification_deliveries(notification_id);
CREATE INDEX IF NOT EXISTS idx_templates_type_channel ON public.notification_templates(notification_type, channel, active);

-- Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_deliveries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY IF NOT EXISTS "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own notification read status" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Service role can manage all notifications" ON public.notifications
    FOR ALL USING (current_setting('role') = 'service_role');

CREATE POLICY IF NOT EXISTS "Users can manage own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Service role can manage all preferences" ON public.user_preferences
    FOR ALL USING (current_setting('role') = 'service_role');

CREATE POLICY IF NOT EXISTS "Users can view own delivery logs" ON public.notification_deliveries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.notifications n 
            WHERE n.id = notification_deliveries.notification_id 
            AND n.user_id = auth.uid()
        )
    );

CREATE POLICY IF NOT EXISTS "Service role can manage all deliveries" ON public.notification_deliveries
    FOR ALL USING (current_setting('role') = 'service_role');

-- Initialize PGMQ queues for notification processing
SELECT pgmq.create_queue('critical_notifications');
SELECT pgmq.create_queue('notifications');
SELECT pgmq.create_queue('marketing_notifications');

-- Insert default notification templates
INSERT INTO public.notification_templates (name, notification_type, channel, subject, body_text, body_html) VALUES
('booking_success_email', 'booking_success', 'email', '✈️ Your flight is booked!', 
 'Booking Confirmed! Your flight booking is confirmed. Thank you for booking with us!',
 '<h1>Booking Confirmed!</h1><p>Your flight booking is confirmed.</p><p><b>Airline:</b> {{airline}}</p><p><b>Flight Number:</b> {{flight_number}}</p><p><b>PNR:</b> {{pnr}}</p><p><b>Departure:</b> {{departure_datetime}}</p><p><b>Arrival:</b> {{arrival_datetime}}</p><p><b>Price:</b> ${{price}}</p><p>Thank you for booking with us!</p>'
),
('booking_failure_email', 'booking_failure', 'email', '⚠️ Important: Flight Booking Issue',
 'Booking Issue: We encountered an issue with your recent flight booking attempt. Please contact support or try booking again.',
 '<h1>Booking Issue</h1><p>We encountered an issue with your recent flight booking attempt.</p><p><b>Details:</b> {{error}}</p><p><b>Offer ID:</b> {{flight_offer_id}}</p><p>Please contact support or try booking again.</p>'
),
('booking_canceled_email', 'booking_canceled', 'email', 'ℹ️ Your Flight Booking Has Been Canceled',
 'Booking Canceled: Your flight booking has been successfully canceled. If you have any questions, please contact support.',
 '<h1>Booking Canceled</h1><p>Your flight booking has been successfully canceled.</p><p><b>PNR:</b> {{pnr}}</p><p>If you have any questions, please contact support.</p>'
),
('reminder_23h_email', 'reminder_23h', 'email', '✈️ Reminder: Your Flight is in Approximately 23 Hours!',
 'Flight Reminder: This is a reminder that your flight is scheduled in approximately 23 hours. Please check in with your airline and verify your flight details.',
 '<h1>Flight Reminder</h1><p>This is a reminder that your flight is scheduled in approximately 23 hours.</p><p><b>PNR:</b> {{pnr}}</p><p><b>Departure:</b> {{departure_datetime}}</p><p>Please check in with your airline and verify your flight details.</p>'
),
('booking_success_sms', 'booking_success', 'sms', NULL,
 'Flight booked! PNR: {{pnr}}. Check email for details. Safe travels!',
 NULL
),
('booking_failure_sms', 'booking_failure', 'sms', NULL,
 'Booking failed: {{error}}. Please try again or contact support.',
 NULL
),
('booking_canceled_sms', 'booking_canceled', 'sms', NULL,
 'Booking canceled. PNR: {{pnr}}. Contact support for questions.',
 NULL
);

-- Initialize default user preferences for existing users
INSERT INTO public.user_preferences (user_id, preferences)
SELECT 
    id,
    '{
        "booking_success": {"email": true, "sms": false},
        "booking_failure": {"email": true, "sms": true},
        "booking_canceled": {"email": true, "sms": false},
        "reminder_23h": {"email": true, "sms": false},
        "marketing": {"email": true, "sms": false}
    }'::jsonb
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_preferences);

-- Comments for documentation
COMMENT ON TABLE public.events IS 'Immutable event log for event sourcing architecture';
COMMENT ON TABLE public.notification_templates IS 'Versioned templates for multi-channel notifications with i18n support';
COMMENT ON TABLE public.user_preferences IS 'Granular user notification preferences with quiet hours and timezone support';
COMMENT ON TABLE public.notification_deliveries IS 'Delivery tracking and analytics for all notification attempts';

COMMENT ON COLUMN public.events.type IS 'Event type (e.g., order.created, order.cancelled)';
COMMENT ON COLUMN public.events.source IS 'Event source (duffel, system, manual)';
COMMENT ON COLUMN public.events.status IS 'Processing status for event consumption tracking';
COMMENT ON COLUMN public.notification_templates.channel IS 'Delivery channel: email, sms, push, in_app';
COMMENT ON COLUMN public.notification_templates.version IS 'Template version for A/B testing and rollback';
COMMENT ON COLUMN public.user_preferences.preferences IS 'JSONB structure: {type: {channel: boolean}}';
COMMENT ON COLUMN public.user_preferences.quiet_hours IS 'Do not disturb hours in user timezone';
COMMENT ON COLUMN public.notifications.priority IS 'Message priority affecting delivery urgency and retry logic';
COMMENT ON COLUMN public.notifications.channels IS 'Target channels for this notification';
COMMENT ON COLUMN public.notification_deliveries.provider IS 'Service provider (resend, twilio, etc.)';
COMMENT ON COLUMN public.notification_deliveries.attempt_count IS 'Retry attempt number for exponential backoff';
