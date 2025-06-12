CREATE TABLE IF NOT EXISTS auto_booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_request_id UUID NOT NULL REFERENCES trip_requests(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'watching',
  criteria JSONB NOT NULL,
  price_history JSONB DEFAULT '[]'::jsonb,
  latest_booking_request_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
