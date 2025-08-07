-- FINAL SCHEMA FIXES
-- Create the missing user_preferences table

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY,
  preferences JSONB DEFAULT '{}',
  quiet_hours JSONB DEFAULT '{"start": 22, "end": 7}',
  timezone TEXT DEFAULT 'America/New_York',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create duffel_webhook_events table (referenced in test)
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

-- Add foreign key constraint to notification_deliveries if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'notification_deliveries_notification_id_fkey'
        AND table_name = 'notification_deliveries'
    ) THEN
        ALTER TABLE public.notification_deliveries 
        ADD CONSTRAINT notification_deliveries_notification_id_fkey 
        FOREIGN KEY (notification_id) REFERENCES public.notifications(id) ON DELETE CASCADE;
    END IF;
END
$$;

-- Create additional useful indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_booking_id ON public.events(booking_id);

-- Final fixes complete!
