-- Create notifications table to store user notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    payload JSONB NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- Add comments only if the table and columns exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM information_schema.tables
     WHERE table_schema = 'public'
       AND table_name = 'notifications'
  ) THEN
    COMMENT ON TABLE public.notifications IS 'Stores user-facing notifications for various events like booking status changes and reminders.';
  END IF;

  IF EXISTS (
    SELECT 1
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'notifications'
       AND column_name = 'type'
  ) THEN
    COMMENT ON COLUMN public.notifications.type IS 'Type of notification, e.g., booking_success, booking_failure, reminder_23h, booking_canceled';
  END IF;

  IF EXISTS (
    SELECT 1
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'notifications'
       AND column_name = 'payload'
  ) THEN
    COMMENT ON COLUMN public.notifications.payload IS 'JSONB payload with additional data specific to the notification type, e.g., PNR, flight details, error messages.';
  END IF;
END
$$;

-- Note: Row Level Security (RLS) should be considered and implemented based on application security requirements.
-- Example RLS policies (Uncomment and adjust if needed):
-- ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view their own notifications"
-- ON public.notifications FOR SELECT
-- USING (auth.uid() = user_id);
-- CREATE POLICY "Service roles can perform all actions on notifications"
-- ON public.notifications FOR ALL
-- USING (true); -- Or, for more restriction: USING (current_setting('request.role', true) = 'service_role');
