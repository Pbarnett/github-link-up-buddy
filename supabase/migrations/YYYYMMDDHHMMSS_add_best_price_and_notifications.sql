-- Add best_price column to trip_requests table
ALTER TABLE public.trip_requests
ADD COLUMN best_price NUMERIC;

-- Note: For existing rows, best_price will be NULL.
-- A separate backfill update is recommended to populate best_price from budget for existing rows:
-- UPDATE public.trip_requests SET best_price = budget WHERE best_price IS NULL AND budget IS NOT NULL;

-- Create notifications table
CREATE TABLE public.notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    trip_request_id BIGINT REFERENCES public.trip_requests(id) ON DELETE SET NULL, -- Or ON DELETE CASCADE depending on desired behavior
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add comments to the columns for clarity (optional but good practice)
COMMENT ON COLUMN public.notifications.id IS 'Unique identifier for the notification';
COMMENT ON COLUMN public.notifications.user_id IS 'Foreign key to the user who should receive the notification';
COMMENT ON COLUMN public.notifications.trip_request_id IS 'Optional foreign key to the related trip request';
COMMENT ON COLUMN public.notifications.type IS 'Type of notification (e.g., ''new_offer'', ''booking_confirmed'')';
COMMENT ON COLUMN public.notifications.message IS 'The main content of the notification message';
COMMENT ON COLUMN public.notifications.data IS 'Additional JSON data for the notification, specific to its type';
COMMENT ON COLUMN public.notifications.read IS 'Whether the notification has been read by the user';
COMMENT ON COLUMN public.notifications.created_at IS 'Timestamp of when the notification was created';

-- Enable Row Level Security (RLS) on the notifications table
ALTER TABLE public.notifications
ENABLE ROW LEVEL SECURITY;

-- Example RLS policy (users can only see their own notifications)
-- This would typically be in a separate policy file or added here if simple.
-- CREATE POLICY "Users can view their own notifications"
-- ON public.notifications
-- FOR SELECT
-- USING (auth.uid() = user_id);

-- CREATE POLICY "Users can update their own notifications (e.g., mark as read)"
-- ON public.notifications
-- FOR UPDATE
-- USING (auth.uid() = user_id)
-- WITH CHECK (auth.uid() = user_id);

-- Note: INSERTs of notifications would typically be handled by trusted roles (e.g., service_role) via edge functions or triggers.
-- If users are to create notifications directly (less common for this type of table), an INSERT policy would be needed.

-- Grant usage on the schema to the authenticated role if not already granted
-- This is usually handled by Supabase default permissions but good to be aware of.
-- GRANT USAGE ON SCHEMA public TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.notifications TO authenticated; -- Adjust permissions as needed for your RLS policies

-- Grant usage on the sequence for the id column to the authenticated role (if using RLS that allows inserts by users)
-- GRANT USAGE, SELECT ON SEQUENCE notifications_id_seq TO authenticated;

-- Output a success message (optional, for Supabase CLI)
-- SELECT 'Migration applied successfully: add_best_price_and_notifications';
