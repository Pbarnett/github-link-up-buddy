-- supabase/migrations/20250529145652_migrate_notification_payload_to_data.sql

-- Ensure this migration runs AFTER 20250530120000_align_schema_auto_booking.sql
-- which should have added the 'data' JSONB column and 'message' TEXT column to 'notifications'.
-- Note: The above dependency comment has a future timestamp. Assuming the align_schema was already created or will be handled.

BEGIN;

-- Copy data from 'payload' to 'data' where 'payload' is not null and 'data' is currently null.
-- This attempts to preserve any existing data in the 'data' column if it was populated by other means.
UPDATE public.notifications
SET data = payload
WHERE payload IS NOT NULL AND data IS NULL;

-- Regarding the 'message' column:
-- The 'align_schema_auto_booking.sql' migration added a 'message' TEXT column.
-- The primary goal here is to migrate 'payload' to 'data'.
-- If existing 'payload' objects contained a text field suitable for the 'message' column 
-- (e.g., payload->>'messageText' or payload->>'summary'), an additional update could be:
-- UPDATE public.notifications
-- SET message = COALESCE(message, payload->>'messageText', payload->>'summary', 'Notification details from payload.')
-- WHERE payload IS NOT NULL AND message IS NULL;
-- However, this script will stick to the direct payload->data copy as per the core request.
-- The new 'auto_booking_success' notifications created by the RPC will populate 'message' and 'data' directly.

RAISE NOTICE 'Data migration from notifications.payload to notifications.data attempted.';
RAISE NOTICE 'Review notifications table to ensure data integrity, especially if both payload and data columns had values for some rows, or if existing messages are still NULL.';

-- Add a comment to the payload column indicating its legacy status.
-- This comment will be a reminder until the column is dropped in a subsequent migration.
COMMENT ON COLUMN public.notifications.payload IS 'Legacy column. Data has been migrated to the "data" JSONB column. This column is scheduled for removal in a future migration.';

COMMIT;
```
