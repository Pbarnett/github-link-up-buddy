-- Create trip_requests table with all required fields
CREATE TABLE IF NOT EXISTS public.trip_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    earliest_departure TIMESTAMPTZ,
    latest_departure TIMESTAMPTZ,
    budget NUMERIC(10,2),
    departure_airports TEXT[],
    destination_airport TEXT,
    min_duration INTEGER,
    max_duration INTEGER,
    auto_book BOOLEAN DEFAULT FALSE,
    max_price NUMERIC(10,2),
    preferred_payment_method_id TEXT,
    last_checked_at TIMESTAMPTZ,
    best_price NUMERIC(10,2),
    origin_location_code TEXT,
    destination_location_code TEXT NOT NULL,
    departure_date DATE,
    return_date DATE,
    adults INTEGER DEFAULT 1,
    auto_book_enabled BOOLEAN DEFAULT FALSE,
    nonstop_required BOOLEAN DEFAULT TRUE,
    baggage_included_required BOOLEAN DEFAULT FALSE
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_trip_requests_user_id ON public.trip_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_requests_destination ON public.trip_requests(destination_location_code);

-- Enable RLS
ALTER TABLE public.trip_requests ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view their own trip requests"
    ON public.trip_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trip requests"
    ON public.trip_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trip requests"
    ON public.trip_requests FOR UPDATE
    USING (auth.uid() = user_id);

