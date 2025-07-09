import { assertEquals, assertExists } from 'https://deno.land/std@0.168.0/testing/asserts.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'http://localhost:54321';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'test-service-key';

Deno.test('Payment Methods KMS Health Check', async () => {
  const response = await fetch(`${supabaseUrl}/functions/v1/payment-methods-kms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseServiceKey}`,
    },
    body: JSON.stringify({
      action: 'health'
    })
  });

  const data = await response.json();
  
  // Check that the function responds
  assertEquals(response.status, 200);
  assertExists(data);
});

Deno.test('Payment Methods Schema Validation', async () => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Test that the payment_methods table exists and has expected columns
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .limit(1);
  
  // Should not error (table exists)
  assertEquals(error, null);
  
  // Test that stripe_customers table exists
  const { data: customerData, error: customerError } = await supabase
    .from('stripe_customers')
    .select('*')
    .limit(1);
  
  assertEquals(customerError, null);
});

Deno.test('KMS Audit Log Schema', async () => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Test that the kms_audit_log table exists
  const { data, error } = await supabase
    .from('kms_audit_log')
    .select('*')
    .limit(1);
  
  assertEquals(error, null);
});

Deno.test('Feature Flag for Wallet UI', async () => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Test that the wallet_ui feature flag exists
  const { data, error } = await supabase
    .from('feature_flags')
    .select('*')
    .eq('name', 'wallet_ui')
    .single();
  
  assertEquals(error, null);
  assertEquals(data?.name, 'wallet_ui');
  assertExists(data?.enabled);
});

Deno.test('Payment Method Triggers and Functions', async () => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Test that the required functions exist
  const { data: functions, error } = await supabase
    .rpc('get_function_names');
  
  // This is a basic check - in a real test we'd check for specific functions
  assertEquals(error, null);
});
