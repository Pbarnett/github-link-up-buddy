-- Multi-currency support for international travel bookings
-- This supports Phase 2 international expansion features

-- Create exchange rates table for caching rates and historical data
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate DECIMAL(10,6) NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure we don't have duplicate currency pairs
  UNIQUE(from_currency, to_currency)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_exchange_rates_currencies ON exchange_rates(from_currency, to_currency);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_updated ON exchange_rates(last_updated);

-- Create user preferences table for currency and other settings
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Currency preferences
  preferred_currency TEXT DEFAULT 'USD' CHECK (preferred_currency IN (
    'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'
  )),
  
  -- Regional preferences
  home_country TEXT, -- ISO country code
  timezone TEXT DEFAULT 'UTC',
  
  -- Notification preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  
  -- Display preferences
  temperature_unit TEXT DEFAULT 'celsius' CHECK (temperature_unit IN ('celsius', 'fahrenheit')),
  distance_unit TEXT DEFAULT 'metric' CHECK (distance_unit IN ('metric', 'imperial')),
  
  -- Privacy preferences
  analytics_consent BOOLEAN DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- One preference record per user
  UNIQUE(user_id)
);

-- Create indexes for user preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_currency ON user_preferences(preferred_currency);

-- Enable Row Level Security
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for exchange rates (read-only for authenticated users)
CREATE POLICY "Authenticated users can view exchange rates"
  ON exchange_rates FOR SELECT
  USING (auth.role() = 'authenticated');

-- Service role can manage exchange rates
CREATE POLICY "Service role can manage exchange rates"
  ON exchange_rates FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for user preferences
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
  ON user_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Update campaigns table to support multiple currencies
ALTER TABLE campaigns 
  ADD COLUMN IF NOT EXISTS original_currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS user_currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS exchange_rate DECIMAL(10,6) DEFAULT 1.0,
  ADD COLUMN IF NOT EXISTS converted_max_price DECIMAL(10,2);

-- Update payment methods to support multiple currencies
ALTER TABLE payment_methods
  ADD COLUMN IF NOT EXISTS supported_currencies TEXT[] DEFAULT ARRAY['USD'];

-- Update campaign bookings to track currency conversions
ALTER TABLE campaign_bookings
  ADD COLUMN IF NOT EXISTS original_currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS user_currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS exchange_rate_used DECIMAL(10,6) DEFAULT 1.0,
  ADD COLUMN IF NOT EXISTS total_amount_user_currency DECIMAL(10,2);

-- Create trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for user preferences updated_at
CREATE TRIGGER user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_user_preferences_updated_at();

-- Function to get or create user preferences with defaults
CREATE OR REPLACE FUNCTION get_user_preferences(user_uuid UUID)
RETURNS TABLE (
  preferred_currency TEXT,
  home_country TEXT,
  timezone TEXT,
  email_notifications BOOLEAN,
  sms_notifications BOOLEAN,
  push_notifications BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.preferred_currency,
    up.home_country,
    up.timezone,
    up.email_notifications,
    up.sms_notifications,
    up.push_notifications
  FROM user_preferences up
  WHERE up.user_id = user_uuid;
  
  -- If no preferences found, create default ones
  IF NOT FOUND THEN
    INSERT INTO user_preferences (user_id, preferred_currency)
    VALUES (user_uuid, 'USD');
    
    RETURN QUERY
    SELECT 
      'USD'::TEXT as preferred_currency,
      NULL::TEXT as home_country,
      'UTC'::TEXT as timezone,
      TRUE as email_notifications,
      FALSE as sms_notifications,
      TRUE as push_notifications;
  END IF;
END;
$$;

-- Function to automatically detect and set user currency based on geolocation
CREATE OR REPLACE FUNCTION auto_detect_user_currency()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- This would typically be called after user signup
  -- For now, we'll just set USD as default, but in production
  -- you'd integrate with geolocation services
  
  INSERT INTO user_preferences (user_id, preferred_currency)
  VALUES (NEW.id, 'USD')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create user preferences on signup
CREATE TRIGGER auto_create_user_preferences
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_detect_user_currency();

-- Function to convert prices based on exchange rates
CREATE OR REPLACE FUNCTION convert_price(
  amount DECIMAL,
  from_curr TEXT,
  to_curr TEXT
) RETURNS DECIMAL
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  rate DECIMAL;
BEGIN
  -- If same currency, return original amount
  IF from_curr = to_curr THEN
    RETURN amount;
  END IF;
  
  -- Get latest exchange rate
  SELECT er.rate INTO rate
  FROM exchange_rates er
  WHERE er.from_currency = from_curr 
    AND er.to_currency = to_curr
    AND er.last_updated > NOW() - INTERVAL '1 hour'
  ORDER BY er.last_updated DESC
  LIMIT 1;
  
  -- If no recent rate found, return original amount
  IF rate IS NULL THEN
    RETURN amount;
  END IF;
  
  -- Convert and round to 2 decimal places
  RETURN ROUND(amount * rate, 2);
END;
$$;

-- Insert some initial exchange rates (these would be updated by the API)
INSERT INTO exchange_rates (from_currency, to_currency, rate) VALUES 
  ('USD', 'EUR', 0.85),
  ('EUR', 'USD', 1.18),
  ('USD', 'GBP', 0.73),
  ('GBP', 'USD', 1.37),
  ('USD', 'CAD', 1.25),
  ('CAD', 'USD', 0.80),
  ('USD', 'JPY', 110.0),
  ('JPY', 'USD', 0.009)
ON CONFLICT (from_currency, to_currency) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE exchange_rates TO authenticated;
GRANT ALL ON TABLE user_preferences TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_preferences(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION convert_price(DECIMAL, TEXT, TEXT) TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE exchange_rates IS 'Cached exchange rates for multi-currency support';
COMMENT ON TABLE user_preferences IS 'User preferences including preferred currency and regional settings';
COMMENT ON COLUMN user_preferences.preferred_currency IS 'User preferred currency for displaying prices';
COMMENT ON COLUMN campaigns.original_currency IS 'Original currency of the flight price from provider';
COMMENT ON COLUMN campaigns.user_currency IS 'Currency the user sees prices in';
COMMENT ON COLUMN campaigns.exchange_rate IS 'Exchange rate used for conversion';
COMMENT ON FUNCTION convert_price(DECIMAL, TEXT, TEXT) IS 'Convert amount between currencies using cached exchange rates';
