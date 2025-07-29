-- 1) Add missing columns to bookings table
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS booking_attempt_id UUID NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS seat_fee NUMERIC(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS amadeus_order_id TEXT,
  ADD COLUMN IF NOT EXISTS pnr TEXT;

CREATE INDEX IF NOT EXISTS idx_bookings_booking_attempt_id ON bookings (booking_attempt_id);
CREATE INDEX IF NOT EXISTS idx_bookings_amadeus_order_id ON bookings (amadeus_order_id);
CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON bookings (pnr);

-- 2) Add missing columns to notifications table
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS channel TEXT,                -- 'email' or 'sms'
  ADD COLUMN IF NOT EXISTS payload JSONB,               -- { "to": "...", "subject": "...", "body": "..." }
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending', -- 'pending','sent','failed','permanently_failed'
  ADD COLUMN IF NOT EXISTS retry_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS booking_id UUID;             -- Link to bookings table

-- Conditionally create foreign key constraint only if it doesn’t exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_notifications_booking_id'
      AND table_name = 'notifications'
  ) THEN
    ALTER TABLE notifications
      ADD CONSTRAINT fk_notifications_booking_id
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_booking_id ON notifications (booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications (status);

-- 3) Add missing columns to profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS prefers_email_notifications BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS prefers_sms_notifications BOOLEAN DEFAULT FALSE;

-- 4) Ensure RLS policies exist without duplication
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'update_profile_prefs'
      AND tablename = 'profiles'
  ) THEN
    CREATE POLICY update_profile_prefs ON profiles
      FOR UPDATE
      USING (auth.uid() = id);
  END IF;
END$$;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'users_select_own_notifications'
      AND tablename = 'notifications'
  ) THEN
    CREATE POLICY users_select_own_notifications ON notifications
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END$$;
