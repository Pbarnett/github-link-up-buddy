-- Add best_price column if desired
ALTER TABLE trip_requests ADD COLUMN IF NOT EXISTS best_price numeric;

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES profiles(id),
  trip_request_id  uuid        REFERENCES trip_requests(id),
  type             text        NOT NULL,
  message          text        NOT NULL,
  data             jsonb,
  read             boolean     NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Basic RLS: users see their own notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);
