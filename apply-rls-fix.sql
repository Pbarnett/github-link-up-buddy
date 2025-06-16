-- Direct SQL to fix RLS warnings on booking_attempts and payments tables

-- Enable RLS on booking_attempts table
ALTER TABLE public.booking_attempts ENABLE ROW LEVEL SECURITY;

-- Enable RLS on payments table  
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policies for booking_attempts table
-- Allow users to view booking attempts for their own trip requests
CREATE POLICY "Users can view their own booking attempts" ON public.booking_attempts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_requests 
      WHERE trip_requests.id = booking_attempts.trip_request_id 
      AND trip_requests.user_id = auth.uid()
    )
  );

-- Allow service role to manage all booking attempts
CREATE POLICY "Service role can manage booking attempts" ON public.booking_attempts
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Policies for payments table
-- Allow users to view their own payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = payments.booking_id 
      AND bookings.user_id = auth.uid()
    )
  );

-- Allow service role to manage all payments (needed for Stripe webhooks and payment processing)
CREATE POLICY "Service role can manage payments" ON public.payments
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Allow authenticated users to insert payments for their own bookings
CREATE POLICY "Users can create payments for their bookings" ON public.payments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = payments.booking_id 
      AND bookings.user_id = auth.uid()
    )
  );

