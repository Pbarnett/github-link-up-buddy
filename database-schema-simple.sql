-- ===============================================
-- SIMPLE DATABASE SCHEMA FIXES
-- ===============================================
-- This version avoids all problematic syntax

-- 1. Create notification_templates table
CREATE TABLE IF NOT EXISTS public.notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 2. Add missing columns to notifications table
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS content JSONB NOT NULL DEFAULT '{}';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS channels TEXT[] DEFAULT ARRAY['email'];
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical'));
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS booking_id UUID;

-- 3. Create missing queue tables
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
  user_id UUID REFERENCES auth.users(id),
  booking_id UUID,
  source TEXT DEFAULT 'system',
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'processing', 'processed', 'failed'))
);

-- 5. Create notification_deliveries table
CREATE TABLE IF NOT EXISTS public.notification_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 6. Create duffel_webhook_events table
CREATE TABLE IF NOT EXISTS public.duffel_webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  order_id TEXT,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processing_error TEXT,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- 7. Create indexes
CREATE INDEX IF NOT EXISTS idx_templates_type_channel ON public.notification_templates(notification_type, channel, active);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON public.notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON public.notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON public.notification_deliveries(status, created_at);
CREATE INDEX IF NOT EXISTS idx_events_type_occurred ON public.events(type, occurred_at DESC);

-- 8. Insert default templates
INSERT INTO public.notification_templates (name, notification_type, channel, subject, body_text, body_html) VALUES
('booking_success_email', 'booking_success', 'email', '✈️ Your flight is booked!', 
 'Booking Confirmed! Your flight booking is confirmed. Thank you for booking with us!',
 '<h1>Booking Confirmed!</h1><p>Your flight booking is confirmed.</p><p><b>Details:</b></p><p><b>Origin:</b> {{origin}}</p><p><b>Destination:</b> {{destination}}</p><p><b>Date:</b> {{departure_date}}</p><p><b>Reference:</b> {{booking_reference}}</p><p>Thank you for booking with us!</p>'),

('booking_success_sms', 'booking_success', 'sms', null,
 '✈️ Flight booked! {{passenger_name}}, your flight from {{origin}} to {{destination}} on {{departure_date}} is confirmed. Ref: {{booking_reference}}', null),

('price_alert_email', 'price_alert', 'email', '💸 Price Drop Alert!',
 'Great news! The price for your watched flight has dropped.',
 '<h1>Price Drop Alert!</h1><p>Great news! The price for your watched flight has dropped.</p><p><b>Route:</b> {{origin}} → {{destination}}</p><p><b>New Price:</b> ${{new_price}} (was ${{old_price}})</p><p><b>Savings:</b> ${{savings}}</p><p><a href="{{booking_url}}">Book Now</a></p>'),

('price_alert_sms', 'price_alert', 'sms', null,
 '💸 Price Drop! Flight {{origin}} → {{destination}} now ${{new_price}} (was ${{old_price}}). Save ${{savings}}! Book: {{booking_url}}', null)
ON CONFLICT (name) DO NOTHING;
