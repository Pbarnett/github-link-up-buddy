-- Create ENUM types for booking_status and payment_status for data integrity

-- Drop existing default and alter column for booking_status
ALTER TABLE bookings ALTER COLUMN status DROP DEFAULT;
CREATE TYPE booking_status_enum AS ENUM ('pending','booked','ticketed','failed','canceled');
ALTER TABLE bookings
  ALTER COLUMN status TYPE booking_status_enum USING status::booking_status_enum;
ALTER TABLE bookings ALTER COLUMN status SET DEFAULT 'pending'::booking_status_enum;

-- Drop existing default and alter column for payment_status
ALTER TABLE payments ALTER COLUMN status DROP DEFAULT;
CREATE TYPE payment_status_enum AS ENUM ('unpaid','pending','paid','failed');
ALTER TABLE payments
  ALTER COLUMN status TYPE payment_status_enum USING status::payment_status_enum;
ALTER TABLE payments ALTER COLUMN status SET DEFAULT 'unpaid'::payment_status_enum;
