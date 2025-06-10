-- Create feature_flags table for managing feature toggles
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read feature flags" ON public.feature_flags
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage feature flags" ON public.feature_flags
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create auto_booking_requests table
CREATE TABLE IF NOT EXISTS public.auto_booking_requests (
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
CREATE INDEX IF NOT EXISTS idx_auto_booking_requests_user_id
  ON public.auto_booking_requests(user_id);
ALTER TABLE public.auto_booking_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own auto booking requests"
  ON public.auto_booking_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own auto booking requests"
  ON public.auto_booking_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own auto booking requests"
  ON public.auto_booking_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own auto booking requests"
  ON public.auto_booking_requests FOR DELETE USING (auth.uid() = user_id);

-- Insert feature flag OFF by default
INSERT INTO public.feature_flags (name, enabled, description) 
VALUES ('auto_booking_v2', false, 'Enable the new auto-booking workflow with enhanced UI')
ON CONFLICT (name) DO NOTHING;
