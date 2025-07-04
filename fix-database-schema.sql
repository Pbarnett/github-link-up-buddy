-- Critical Database Schema Fixes for Production Readiness
-- This fixes the 4 failing tests related to notification system

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

-- 3. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_templates_type_channel ON public.notification_templates(notification_type, channel, active);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON public.notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON public.notifications(scheduled_for);

-- 4. Enable Row Level Security on notification_templates
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for notification_templates
CREATE POLICY "Templates are readable by authenticated users"
  ON public.notification_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage templates"
  ON public.notification_templates FOR ALL
  TO service_role
  USING (true);

-- 6. Insert default notification templates
INSERT INTO public.notification_templates (name, notification_type, channel, subject, body_text, body_html) VALUES
('booking_success_email', 'booking_success', 'email', '✈️ Your flight is booked!', 
 'Booking Confirmed! Your flight booking is confirmed. Thank you for booking with us!',
 '<h1>Booking Confirmed!</h1><p>Your flight booking is confirmed.</p><p><b>Details:</b></p><p><b>Origin:</b> {{origin}}</p><p><b>Destination:</b> {{destination}}</p><p><b>Date:</b> {{departure_date}}</p><p><b>Reference:</b> {{booking_reference}}</p><p>Thank you for booking with us!</p>'),

('booking_success_sms', 'booking_success', 'sms', null,
 '✈️ Flight booked! {{passenger_name}}, your flight from {{origin}} to {{destination}} on {{departure_date}} is confirmed. Ref: {{booking_reference}}', null),

('booking_failure_email', 'booking_failure', 'email', '❌ Booking Issue',
 'We encountered an issue with your booking. Our support team will contact you shortly.',
 '<h1>Booking Issue</h1><p>We encountered an issue with your booking.</p><p><b>Details:</b></p><p><b>Route:</b> {{origin}} → {{destination}}</p><p><b>Reason:</b> {{error_reason}}</p><p>Our support team will contact you shortly.</p>'),

('booking_failure_sms', 'booking_failure', 'sms', null,
 '❌ Booking Failed: {{passenger_name}}, we couldn''t complete your booking for {{origin}} → {{destination}}. Reason: {{error_reason}}. Support: https://parkerflight.com/support', null),

('price_alert_email', 'price_alert', 'email', '💸 Price Drop Alert!',
 'Great news! The price for your watched flight has dropped.',
 '<h1>Price Drop Alert!</h1><p>Great news! The price for your watched flight has dropped.</p><p><b>Route:</b> {{origin}} → {{destination}}</p><p><b>New Price:</b> ${{new_price}} (was ${{old_price}})</p><p><b>Savings:</b> ${{savings}}</p><p><a href="{{booking_url}}">Book Now</a></p>'),

('price_alert_sms', 'price_alert', 'sms', null,
 '💸 Price Drop! Flight {{origin}} → {{destination}} now ${{new_price}} (was ${{old_price}}). Save ${{savings}}! Book: {{booking_url}}', null),

('phone_verification_sms', 'phone_verification', 'sms', null,
 'Your Parker Flight verification code is: {{verification_code}}. This code expires in 10 minutes.', null),

('flight_reminder_email', 'flight_reminder', 'email', '✈️ Flight Reminder',
 'Your flight is coming up soon!',
 '<h1>Flight Reminder</h1><p>Your flight is coming up soon!</p><p><b>Flight:</b> {{origin}} → {{destination}}</p><p><b>Date:</b> {{departure_date}}</p><p><b>Time:</b> {{departure_time}}</p><p><b>Reference:</b> {{booking_reference}}</p>'),

('flight_reminder_sms', 'flight_reminder', 'sms', null,
 '✈️ Flight Reminder: {{passenger_name}}, your flight {{origin}} → {{destination}} departs {{departure_date}} at {{departure_time}}. Ref: {{booking_reference}}', null)

ON CONFLICT (name) DO NOTHING;

-- 7. Grant permissions for notification templates
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON TABLE public.notification_templates TO authenticated;
GRANT ALL ON TABLE public.notification_templates TO service_role;

-- 8. Add updated_at trigger for notification_templates
CREATE OR REPLACE FUNCTION update_notification_templates_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER notification_templates_updated_at
  BEFORE UPDATE ON public.notification_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_templates_updated_at();

-- 9. Verify the schema is correct
DO $$
BEGIN
  -- Check notification_templates exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notification_templates') THEN
    RAISE EXCEPTION 'notification_templates table was not created successfully';
  END IF;
  
  -- Check channels column exists in notifications
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'channels') THEN
    RAISE EXCEPTION 'channels column was not added to notifications table';
  END IF;
  
  RAISE NOTICE 'Database schema fixes applied successfully!';
END;
$$;
