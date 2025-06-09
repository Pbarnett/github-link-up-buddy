-- 1) Add channel, status, retry_count, sent_at, booking_id to notifications
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS channel TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS retry_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS booking_id UUID;

-- 2) Add payload column to notifications (post-creation)
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS payload JSONB;

-- 3) Idempotent COMMENT on payload
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name   = 'notifications'
       AND column_name  = 'payload'
  ) THEN
    COMMENT ON COLUMN public.notifications.payload IS
      'JSONB payload with additional data specific to the notification type, e.g., PNR, flight details, error messages.';
  END IF;
END
$$;
