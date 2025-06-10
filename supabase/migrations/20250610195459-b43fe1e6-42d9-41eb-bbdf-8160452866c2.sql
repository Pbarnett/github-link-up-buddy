
-- Create feature_flags table for managing feature toggles
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on feature_flags
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Allow public read access to feature flags (they control UI features, not sensitive data)
CREATE POLICY "Anyone can read feature flags" ON public.feature_flags
FOR SELECT USING (true);

-- Only authenticated users can modify feature flags (could be restricted further to admin roles)
CREATE POLICY "Authenticated users can manage feature flags" ON public.feature_flags
FOR ALL USING (auth.uid() IS NOT NULL);

-- Ensure auto_booking_requests table exists (it should from the earlier migration)
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

-- Add index on user_id for performance
CREATE INDEX IF NOT EXISTS idx_auto_booking_requests_user_id ON public.auto_booking_requests(user_id);

-- Add RLS policies to the auto_booking_requests table
ALTER TABLE public.auto_booking_requests ENABLE ROW LEVEL SECURITY;

-- Users can only see their own auto booking requests
CREATE POLICY "Users can view their own auto booking requests" ON public.auto_booking_requests
FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own auto booking requests
CREATE POLICY "Users can create their own auto booking requests" ON public.auto_booking_requests
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own auto booking requests
CREATE POLICY "Users can update their own auto booking requests" ON public.auto_booking_requests
FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own auto booking requests
CREATE POLICY "Users can delete their own auto booking requests" ON public.auto_booking_requests
FOR DELETE USING (auth.uid() = user_id);

-- Insert the auto_booking_v2 feature flag as OFF by default for Phase-0 safety
INSERT INTO public.feature_flags (name, enabled, description) 
VALUES ('auto_booking_v2', false, 'Enable the new auto-booking workflow with enhanced UI')
ON CONFLICT (name) DO NOTHING;
