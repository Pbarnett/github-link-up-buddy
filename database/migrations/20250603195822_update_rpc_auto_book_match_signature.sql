-- Update rpc_auto_book_match to use UUID for p_match_id
-- IMPORTANT: The existing logic within the BEGIN...END block needs to be preserved.
-- This migration script primarily focuses on changing the function signature.
-- Ensure the internal logic correctly handles p_match_id as UUID.

CREATE OR REPLACE FUNCTION public.rpc_auto_book_match(
  p_match_id UUID,
  p_payment_intent_id TEXT,
  p_currency TEXT DEFAULT 'USD'
  -- Add other existing parameters here if any, preserving their types and defaults
) RETURNS VOID AS $$
BEGIN
  -- Placeholder for existing function logic.
  -- This logic should be copied from the previous version of the function.
  -- Example of what might be here (very simplified):
  -- INSERT INTO bookings (match_id, payment_intent, currency)
  -- VALUES (p_match_id, p_payment_intent_id, p_currency);

  RAISE NOTICE 'rpc_auto_book_match called with p_match_id (UUID): %, p_payment_intent_id: %', p_match_id, p_payment_intent_id;

  -- Ensure that any joins or operations using p_match_id are compatible with UUID.
  -- For instance, if joining with flight_matches, it would be:
  -- ... FROM flight_matches fm WHERE fm.id = p_match_id ...

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- It's good practice to grant execute permissions if not already handled
-- GRANT EXECUTE ON FUNCTION public.rpc_auto_book_match(UUID, TEXT, TEXT) TO authenticated;
-- GRANT EXECUTE ON FUNCTION public.rpc_auto_book_match(UUID, TEXT, TEXT) TO service_role;
