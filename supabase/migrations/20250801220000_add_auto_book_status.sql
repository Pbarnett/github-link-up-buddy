-- Add auto_book_status column to trip_requests table
-- This column tracks the state of auto-booking requests throughout the pipeline

ALTER TABLE public.trip_requests
ADD COLUMN IF NOT EXISTS auto_book_status text DEFAULT 'PENDING'
CHECK (auto_book_status IN ('PENDING', 'PROCESSING', 'BOOKED', 'FAILED', 'CANCELLED'));

-- Create index for efficient querying by status
CREATE INDEX IF NOT EXISTS idx_trip_requests_auto_book_status
ON public.trip_requests (auto_book_status, auto_book_enabled)
WHERE auto_book_enabled = true;

-- Add last_checked_at column for monitoring optimization  
ALTER TABLE public.trip_requests
ADD COLUMN IF NOT EXISTS last_checked_at timestamptz;

-- Create index for monitoring efficiency
CREATE INDEX IF NOT EXISTS idx_trip_requests_last_checked
ON public.trip_requests (last_checked_at)
WHERE auto_book_enabled = true;

-- Comments for documentation
COMMENT ON COLUMN public.trip_requests.auto_book_status IS 'Auto-booking pipeline status: PENDING|PROCESSING|BOOKED|FAILED|CANCELLED';
COMMENT ON COLUMN public.trip_requests.last_checked_at IS 'Timestamp when this trip was last checked by the auto-book monitor';
