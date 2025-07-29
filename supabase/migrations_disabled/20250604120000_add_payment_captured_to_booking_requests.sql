-- Add payment_captured column to booking_requests table
-- This flag helps prevent double-charging or double-booking in auto-book scenarios.
ALTER TABLE public.booking_requests
ADD COLUMN IF NOT EXISTS payment_captured BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.booking_requests.payment_captured IS 'Flag to indicate if the payment for this booking request has been successfully captured. Used for idempotency in auto-booking.';
