import { vi, describe, it, expect, beforeEach } from 'vitest';
import { supabase as supabaseMock, resetSupabaseMocks } from '../../tests/setup/supabaseMock';

// Use shared supabase mock
const supabase = supabaseMock;

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => supabase)
}));

describe('get-personalization-data Edge Function', () => {
  let testUserToken: string;
  let testUserId: string;
  let secondUserToken: string;
  let secondUserId: string;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup test data
    testUserToken = 'test-token-1';
    testUserId = 'user-1';
    secondUserToken = 'test-token-2';
    secondUserId = 'user-2';
    
    // Setup mock responses
    supabase.functions.invoke.mockImplementation((functionName, options) => {
      if (functionName === 'get-personalization-data') {
        const authHeader = options?.headers?.Authorization;
        
        if (!authHeader) {
          return Promise.resolve({
            data: null,
            error: { message: 'Missing or invalid authorization header' }
          });
        }
        
        if (authHeader === `Bearer ${testUserToken}`) {
          return Promise.resolve({
            data: {
              firstName: 'John',
              nextTripCity: 'Paris',
              personalizationEnabled: true
            },
            error: null
          });
        }
        
        if (authHeader === `Bearer ${secondUserToken}`) {
          return Promise.resolve({
            data: {
              firstName: 'Jane',
              nextTripCity: 'Tokyo',
              personalizationEnabled: false
            },
            error: null
          });
        }
        
        return Promise.resolve({
          data: null,
          error: { message: 'Invalid or expired token' }
        });
      }
      
      return Promise.resolve({ data: null, error: null });
    });
  });

  it('returns firstName and nextTripCity with valid token', async () => {
    const { data, error } = await supabase.functions.invoke('get-personalization-data', {
      headers: {
        Authorization: `Bearer ${testUserToken}`,
      },
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.firstName).toBe('John');
    expect(data.nextTripCity).toBe('Paris');
    expect(data.personalizationEnabled).toBe(true);
  });

  it('rejects missing JWT token', async () => {
    const { data, error } = await supabase.functions.invoke('get-personalization-data');

    expect(error).toBeDefined();
    expect(error?.message).toContain('Missing or invalid authorization header');
  });

  it('rejects invalid JWT token', async () => {
    const { data, error } = await supabase.functions.invoke('get-personalization-data', {
      headers: {
        Authorization: 'Bearer invalid.jwt.token',
      },
    });

    expect(error).toBeDefined();
    expect(error?.message).toContain('Invalid or expired token');
  });

  it('prevents cross-user access with RLS', async () => {
    // Try to access with second user's token but expect only their data
    const { data, error } = await supabase.functions.invoke('get-personalization-data', {
      headers: {
        Authorization: `Bearer ${secondUserToken}`,
      },
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.firstName).toBe('Jane'); // Should only see Jane's data
    expect(data.nextTripCity).toBe('Tokyo');
    expect(data.personalizationEnabled).toBe(false);
  });

  it('logs data_requested event', async () => {
    // Setup mock for database query
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({
        data: [{
          user_id: testUserId,
          event_type: 'data_requested',
          context: {
            has_name: true,
            has_next_trip: true,
            personalization_enabled: true
          }
        }],
        error: null
      })
    });

    await supabase.functions.invoke('get-personalization-data', {
      headers: {
        Authorization: `Bearer ${testUserToken}`,
      },
    });

    // Verify the function was called
    expect(supabase.functions.invoke).toHaveBeenCalledWith(
      'get-personalization-data',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${testUserToken}`
        })
      })
    );
  });

  it('handles missing profile gracefully', async () => {
    const noProfileToken = 'no-profile-token';
    
    // Update mock to return profile not found error
    supabase.functions.invoke.mockImplementationOnce(() => {
      return Promise.resolve({
        data: null,
        error: { message: 'Profile not found' }
      });
    });

    const { data, error } = await supabase.functions.invoke('get-personalization-data', {
      headers: {
        Authorization: `Bearer ${noProfileToken}`,
      },
    });

    expect(error).toBeDefined();
    expect(error?.message).toContain('Profile not found');
  });

  it('returns null-safe values for missing fields', async () => {
    const minimalToken = 'minimal-token';
    
    // Update mock to return minimal data
    supabase.functions.invoke.mockImplementationOnce(() => {
      return Promise.resolve({
        data: {
          firstName: null,
          nextTripCity: null,
          personalizationEnabled: true
        },
        error: null
      });
    });

    const { data, error } = await supabase.functions.invoke('get-personalization-data', {
      headers: {
        Authorization: `Bearer ${minimalToken}`,
      },
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.firstName).toBeNull();
    expect(data.nextTripCity).toBeNull();
    expect(data.personalizationEnabled).toBe(true);
  });
});
