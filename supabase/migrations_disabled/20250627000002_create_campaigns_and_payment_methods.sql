-- Create campaigns and payment methods tables according to Traveler Data Architecture
-- This completes the core data structures for Phase 1 implementation

-- Enhance existing payment methods table to match campaign requirements
-- payment_methods table already exists, so we'll add missing columns
ALTER TABLE payment_methods 
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add index for stripe_customer_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_payment_methods_stripe_customer ON payment_methods(stripe_customer_id);

-- Create additional indexes for payment methods (user_id and default already exist)
CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(user_id, is_default);

-- Enable Row Level Security on payment methods
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment methods
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_methods' AND policyname = 'Users can view their own payment methods') THEN
    CREATE POLICY "Users can view their own payment methods" ON payment_methods FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_methods' AND policyname = 'Users can insert their own payment methods') THEN
    CREATE POLICY "Users can insert their own payment methods" ON payment_methods FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_methods' AND policyname = 'Users can update their own payment methods') THEN
    CREATE POLICY "Users can update their own payment methods" ON payment_methods FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_methods' AND policyname = 'Users can delete their own payment methods') THEN
    CREATE POLICY "Users can delete their own payment methods" ON payment_methods FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  traveler_profile_id UUID NOT NULL REFERENCES traveler_profiles(id) ON DELETE CASCADE,
  payment_method_id UUID NOT NULL REFERENCES payment_methods(id) ON DELETE CASCADE,
  
  -- Campaign criteria
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date_start DATE,
  departure_date_end DATE,
  return_date_start DATE,
  return_date_end DATE,
  max_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  cabin_class TEXT DEFAULT 'economy',
  
  -- Campaign status and metadata
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled', 'expired')),
  name TEXT, -- User-friendly campaign name
  description TEXT,
  
  -- Scheduling
  next_search_at TIMESTAMPTZ DEFAULT NOW(),
  search_frequency_hours INTEGER DEFAULT 24, -- How often to search
  last_searched_at TIMESTAMPTZ,
  
  -- Campaign lifecycle
  expires_at TIMESTAMPTZ, -- When campaign should expire
  max_bookings INTEGER DEFAULT 1, -- How many bookings before completion
  bookings_made INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_traveler_profile ON campaigns(traveler_profile_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_payment_method ON campaigns(payment_method_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_next_search ON campaigns(next_search_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_active_searches ON campaigns(status, next_search_at) WHERE status = 'active';

-- Enable Row Level Security on campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for campaigns
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campaigns' AND policyname = 'Users can view their own campaigns') THEN
    CREATE POLICY "Users can view their own campaigns" ON campaigns FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campaigns' AND policyname = 'Users can insert their own campaigns') THEN
    CREATE POLICY "Users can insert their own campaigns" ON campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campaigns' AND policyname = 'Users can update their own campaigns') THEN
    CREATE POLICY "Users can update their own campaigns" ON campaigns FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campaigns' AND policyname = 'Users can delete their own campaigns') THEN
    CREATE POLICY "Users can delete their own campaigns" ON campaigns FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create bookings table for completed campaign bookings
CREATE TABLE IF NOT EXISTS campaign_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- External booking references
  duffel_order_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  
  -- Flight details
  pnr TEXT, -- Passenger Name Record from airline
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  booking_reference TEXT,
  
  -- Status tracking
  booking_status TEXT DEFAULT 'confirmed' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'refunded')),
  payment_status TEXT DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  
  -- Flight details as JSON for flexibility
  flight_details JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for campaign bookings
CREATE INDEX IF NOT EXISTS idx_campaign_bookings_campaign ON campaign_bookings(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_bookings_user ON campaign_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_bookings_duffel ON campaign_bookings(duffel_order_id);
CREATE INDEX IF NOT EXISTS idx_campaign_bookings_stripe ON campaign_bookings(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_campaign_bookings_status ON campaign_bookings(booking_status);

-- Enable Row Level Security on campaign bookings
ALTER TABLE campaign_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for campaign bookings
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campaign_bookings' AND policyname = 'Users can view their own campaign bookings') THEN
    CREATE POLICY "Users can view their own campaign bookings" ON campaign_bookings FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campaign_bookings' AND policyname = 'Service role can manage campaign bookings') THEN
    CREATE POLICY "Service role can manage campaign bookings" ON campaign_bookings FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;

-- Create trigger functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_payment_methods_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_campaigns_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_campaign_bookings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at timestamps
CREATE TRIGGER payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_methods_updated_at();

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_campaigns_updated_at();

CREATE TRIGGER campaign_bookings_updated_at
  BEFORE UPDATE ON campaign_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_bookings_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE payment_methods TO authenticated;
GRANT ALL ON TABLE campaigns TO authenticated;
GRANT ALL ON TABLE campaign_bookings TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE payment_methods IS 'Stores Stripe payment method references with tokenization for PCI compliance';
COMMENT ON TABLE campaigns IS 'Auto-booking campaigns linking traveler profiles with payment methods and search criteria';
COMMENT ON TABLE campaign_bookings IS 'Completed bookings from successful campaign matches';

COMMENT ON COLUMN payment_methods.stripe_customer_id IS 'Stripe Customer ID for this user';
COMMENT ON COLUMN payment_methods.stripe_pm_id IS 'Stripe PaymentMethod ID (tokenized card reference)';
COMMENT ON COLUMN campaigns.max_price IS 'Maximum price user is willing to pay for this campaign';
COMMENT ON COLUMN campaigns.search_frequency_hours IS 'How often to search for deals (in hours)';
COMMENT ON COLUMN campaign_bookings.duffel_order_id IS 'Duffel Order ID for the booked flight';
COMMENT ON COLUMN campaign_bookings.stripe_payment_intent_id IS 'Stripe PaymentIntent ID for the payment';
