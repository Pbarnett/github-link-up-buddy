-- Create test data for encryption migration testing
-- This script creates sample users, profiles, and payment methods for testing

-- Insert test users (in auth.users)
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'test1@example.com',
    '$2a$10$test.password.hash.for.testing.only',
    NOW(),
    NOW(),
    NOW(),
    '{"first_name": "John", "last_name": "Doe"}'::jsonb
),
(
    '22222222-2222-2222-2222-222222222222',
    'test2@example.com',
    '$2a$10$test.password.hash.for.testing.only',
    NOW(),
    NOW(),
    NOW(),
    '{"first_name": "Jane", "last_name": "Smith"}'::jsonb
),
(
    '33333333-3333-3333-3333-333333333333',
    'test3@example.com',
    '$2a$10$test.password.hash.for.testing.only',
    NOW(),
    NOW(),
    NOW(),
    '{"first_name": "Bob", "last_name": "Johnson"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Insert test profiles with legacy (unencrypted) data
INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    phone,
    email,
    encryption_version
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'John',
    'Doe',
    '+1-555-0101',
    'test1@example.com',
    0  -- Legacy/unencrypted
),
(
    '22222222-2222-2222-2222-222222222222',
    'Jane',
    'Smith',
    '+1-555-0102',
    'test2@example.com',
    0  -- Legacy/unencrypted
),
(
    '33333333-3333-3333-3333-333333333333',
    'Bob',
    'Johnson',
    '+1-555-0103',
    'test3@example.com',
    0  -- Legacy/unencrypted
) ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone,
    encryption_version = EXCLUDED.encryption_version;

-- Insert test payment methods with legacy (unencrypted) data
INSERT INTO public.payment_methods (
    id,
    user_id,
    stripe_pm_id,
    brand,
    last4,
    exp_month,
    exp_year,
    is_default,
    encryption_version
) VALUES 
(
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'pm_1234567890abcdef1',
    'visa',
    '4242',
    12,
    2025,
    true,
    0  -- Legacy/unencrypted
),
(
    '55555555-5555-5555-5555-555555555555',
    '22222222-2222-2222-2222-222222222222',
    'pm_1234567890abcdef2',
    'mastercard',
    '5555',
    6,
    2026,
    true,
    0  -- Legacy/unencrypted
),
(
    '66666666-6666-6666-6666-666666666666',
    '33333333-3333-3333-3333-333333333333',
    'pm_1234567890abcdef3',
    'amex',
    '1234',
    3,
    2027,
    true,
    0  -- Legacy/unencrypted
) ON CONFLICT (id) DO UPDATE SET
    stripe_pm_id = EXCLUDED.stripe_pm_id,
    brand = EXCLUDED.brand,
    last4 = EXCLUDED.last4,
    encryption_version = EXCLUDED.encryption_version;

-- Update migration status with test data counts
UPDATE public.encryption_migration_status 
SET 
    total_records = (SELECT COUNT(*) FROM public.profiles WHERE encryption_version = 0),
    updated_at = NOW()
WHERE table_name = 'profiles';

UPDATE public.encryption_migration_status 
SET 
    total_records = (SELECT COUNT(*) FROM public.payment_methods WHERE encryption_version = 0),
    updated_at = NOW()
WHERE table_name = 'payment_methods';

-- Display current status
SELECT 
    table_name,
    total_records,
    migrated_records,
    migration_status,
    (total_records - migrated_records) as remaining_records
FROM public.encryption_migration_status
ORDER BY table_name;
