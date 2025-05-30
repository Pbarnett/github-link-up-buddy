-- Migration to add auto_book_enabled column to trip_requests table
-- This fixes the "could not find the auto_book_enabled column of trip_requests in the schema cache" error

-- Add the column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'trip_requests'
        AND column_name = 'auto_book_enabled'
    ) THEN
        ALTER TABLE trip_requests
        ADD COLUMN auto_book_enabled BOOLEAN NOT NULL DEFAULT false;
        
        RAISE NOTICE 'Added auto_book_enabled column to trip_requests table';
    ELSE
        RAISE NOTICE 'auto_book_enabled column already exists in trip_requests table';
    END IF;
END $$;

-- Important: After applying this migration, restart the API via:
-- Project Settings → Database → Restart API

