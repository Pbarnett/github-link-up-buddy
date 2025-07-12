-- Create user_personalization table for storing personalization preferences
CREATE TABLE IF NOT EXISTS user_personalization (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR(255),
    personalization_enabled BOOLEAN DEFAULT true,
    last_visit TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    loyalty_tier VARCHAR(50), -- marked for future use
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index on user_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_personalization_user_id ON user_personalization(user_id);

-- Create index on personalization_enabled for performance
CREATE INDEX IF NOT EXISTS idx_user_personalization_enabled ON user_personalization(personalization_enabled);

-- Add RLS (Row Level Security) policies
ALTER TABLE user_personalization ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own personalization data
CREATE POLICY "Users can view own personalization data" ON user_personalization
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own personalization data" ON user_personalization
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own personalization data" ON user_personalization
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON user_personalization TO authenticated;
GRANT USAGE ON SEQUENCE user_personalization_id_seq TO authenticated;

-- Add comment
COMMENT ON TABLE user_personalization IS 'Stores user personalization preferences and data for customized experiences';
