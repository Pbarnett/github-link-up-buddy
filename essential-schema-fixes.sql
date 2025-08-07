-- ESSENTIAL SCHEMA FIXES - SIMPLIFIED VERSION
-- Run this in Supabase SQL Editor

-- 1. Create notification_templates table
CREATE TABLE IF NOT EXISTS public.notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  notification_type TEXT NOT NULL,
  channel TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  subject TEXT,
  body_text TEXT NOT NULL,
  body_html TEXT,
  active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add missing columns to notifications table (if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'title') THEN
        ALTER TABLE public.notifications ADD COLUMN title TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'content') THEN
        ALTER TABLE public.notifications ADD COLUMN content JSONB NOT NULL DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'channels') THEN
        ALTER TABLE public.notifications ADD COLUMN channels TEXT[] DEFAULT ARRAY['email'];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'priority') THEN
        ALTER TABLE public.notifications ADD COLUMN priority TEXT DEFAULT 'normal';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'scheduled_for') THEN
        ALTER TABLE public.notifications ADD COLUMN scheduled_for TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'booking_id') THEN
        ALTER TABLE public.notifications ADD COLUMN booking_id UUID;
    END IF;
END
$$;

-- 3. Create queue tables
CREATE TABLE IF NOT EXISTS public.notification_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message JSONB NOT NULL,
  priority INTEGER DEFAULT 1,
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.critical_notification_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message JSONB NOT NULL,
  priority INTEGER DEFAULT 1,
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0
);

-- 4. Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  user_id UUID,
  booking_id UUID,
  source TEXT DEFAULT 'system',
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'new'
);

-- 5. Create notification_deliveries table
CREATE TABLE IF NOT EXISTS public.notification_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id UUID NOT NULL,
  channel TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  provider_response JSONB,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Insert default templates
INSERT INTO public.notification_templates (name, notification_type, channel, subject, body_text, body_html) 
VALUES 
('booking_success_email', 'booking_success', 'email', 'Your flight is booked!', 'Booking Confirmed!', '<h1>Booking Confirmed!</h1>'),
('booking_success_sms', 'booking_success', 'sms', null, 'Flight booked!', null),
('price_alert_email', 'price_alert', 'email', 'Price Drop Alert!', 'Flight price has dropped.', '<h1>Price Drop!</h1>'),
('price_alert_sms', 'price_alert', 'sms', null, 'Price Drop Alert!', null)
ON CONFLICT (name) DO NOTHING;

-- 7. Create basic indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_notification_id ON public.notification_deliveries(notification_id);
CREATE INDEX IF NOT EXISTS idx_queue_scheduled ON public.notification_queue(scheduled_for);

-- Schema fixes complete!
