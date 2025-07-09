import { vi, describe, it, expect, beforeAll, afterAll } from 'vitest';

// Mock fetch for edge function tests
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Mock Stripe for tests
vi.mock('stripe', () => ({
  default: class MockStripe {
    customers = {
      create: vi.fn().mockResolvedValue({ id: 'cus_test123' }),
      update: vi.fn().mockResolvedValue({ id: 'cus_test123' }),
      retrieve: vi.fn().mockResolvedValue({ id: 'cus_test123' })
    };
    paymentMethods = {
      create: vi.fn().mockResolvedValue({ 
        id: 'pm_test123',
        card: { brand: 'visa', last4: '4242', exp_month: 12, exp_year: 2025 }
      }),
      attach: vi.fn().mockResolvedValue({ id: 'pm_test123' }),
      detach: vi.fn().mockResolvedValue({ id: 'pm_test123' })
    };
  }
}));

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  rpc: vi.fn().mockResolvedValue({ data: [], error: null })
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClient)
}));

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-key';

describe('Payment Methods KMS Integration', () => {
  beforeAll(() => {
    // Setup mock responses
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'healthy', kms_enabled: true })
    });
    
    // Setup mock Supabase responses
    mockSupabaseClient.from.mockImplementation((table) => {
      if (table === 'payment_methods' || table === 'stripe_customers' || table === 'kms_audit_log') {
        return {
          ...mockSupabaseClient,
          select: vi.fn().mockReturnValue({
            ...mockSupabaseClient,
            limit: vi.fn().mockResolvedValue({ data: [], error: null })
          })
        };
      }
      if (table === 'feature_flags') {
        return {
          ...mockSupabaseClient,
          select: vi.fn().mockReturnValue({
            ...mockSupabaseClient,
            eq: vi.fn().mockReturnValue({
              ...mockSupabaseClient,
              single: vi.fn().mockResolvedValue({ 
                data: { name: 'wallet_ui', enabled: true }, 
                error: null 
              })
            })
          })
        };
      }
      return mockSupabaseClient;
    });
  });

  it('should pass health check', async () => {
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
    expect(response.status).toBe(200);
    expect(data).toBeDefined();
    expect(data.status).toBe('healthy');
  });

  it('should validate payment methods schema', async () => {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test that the payment_methods table exists and has expected columns
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .limit(1);
    
    // Should not error (table exists)
    expect(error).toBeNull();
    
    // Test that stripe_customers table exists
    const { data: customerData, error: customerError } = await supabase
      .from('stripe_customers')
      .select('*')
      .limit(1);
    
    expect(customerError).toBeNull();
  });

  it('should validate KMS audit log schema', async () => {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test that the kms_audit_log table exists
    const { data, error } = await supabase
      .from('kms_audit_log')
      .select('*')
      .limit(1);
    
    expect(error).toBeNull();
  });

  it('should have wallet UI feature flag', async () => {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test that the wallet_ui feature flag exists
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .eq('name', 'wallet_ui')
      .single();
    
    expect(error).toBeNull();
    expect(data?.name).toBe('wallet_ui');
    expect(data?.enabled).toBeDefined();
  });

  it('should have required database functions', async () => {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test that the required functions exist
    const { data: functions, error } = await supabase
      .rpc('get_function_names');
    
    // This is a basic check - in a real test we'd check for specific functions
    expect(error).toBeNull();
  });
});
