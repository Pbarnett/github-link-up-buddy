import { createClient } from '@supabase/supabase-js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

describe('get-personalization-data Edge Function', () => {
  let supabase: ReturnType<typeof createClient>;
  let testUserToken: string;
  let testUserId: string;
  let secondUserToken: string;
  let secondUserId: string;

  beforeAll(async () => {
    supabase = createClient(supabaseUrl, supabaseKey);
    
    // Create test users
    const { data: user1, error: error1 } = await supabase.auth.signUp({
      email: 'test1@example.com',
      password: 'testpassword123',
    });
    
    const { data: user2, error: error2 } = await supabase.auth.signUp({
      email: 'test2@example.com', 
      password: 'testpassword123',
    });

    if (error1 || error2 || !user1.user || !user2.user) {
      throw new Error('Failed to create test users');
    }

    testUserToken = user1.session?.access_token || '';
    testUserId = user1.user.id;
    secondUserToken = user2.session?.access_token || '';
    secondUserId = user2.user.id;

    // Insert test profile data
    await supabase.from('profiles').insert([
      {
        id: testUserId,
        first_name: 'John',
        next_trip_city: 'Paris',
        personalization_enabled: true,
      },
      {
        id: secondUserId,
        first_name: 'Jane',
        next_trip_city: 'Tokyo',
        personalization_enabled: false,
      },
    ]);
  });

  afterAll(async () => {
    // Clean up test data
    await supabase.from('profiles').delete().eq('id', testUserId);
    await supabase.from('profiles').delete().eq('id', secondUserId);
    await supabase.from('personalization_events').delete().eq('user_id', testUserId);
    await supabase.from('personalization_events').delete().eq('user_id', secondUserId);
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
    await supabase.functions.invoke('get-personalization-data', {
      headers: {
        Authorization: `Bearer ${testUserToken}`,
      },
    });

    // Check that event was logged
    const { data: events, error } = await supabase
      .from('personalization_events')
      .select('*')
      .eq('user_id', testUserId)
      .eq('event_type', 'data_requested')
      .order('created_at', { ascending: false })
      .limit(1);

    expect(error).toBeNull();
    expect(events).toHaveLength(1);
    expect(events?.[0].context).toMatchObject({
      has_name: true,
      has_next_trip: true,
      personalization_enabled: true,
    });
  });

  it('handles missing profile gracefully', async () => {
    // Create a user without a profile
    const { data: userData, error: signUpError } = await supabase.auth.signUp({
      email: 'noprofile@example.com',
      password: 'testpassword123',
    });

    if (signUpError || !userData.user) {
      throw new Error('Failed to create user without profile');
    }

    const noProfileToken = userData.session?.access_token || '';

    const { data, error } = await supabase.functions.invoke('get-personalization-data', {
      headers: {
        Authorization: `Bearer ${noProfileToken}`,
      },
    });

    expect(error).toBeDefined();
    expect(error?.message).toContain('Profile not found');

    // Clean up
    await supabase.from('profiles').delete().eq('id', userData.user.id);
  });

  it('returns null-safe values for missing fields', async () => {
    // Create profile with minimal data
    const { data: userData, error: signUpError } = await supabase.auth.signUp({
      email: 'minimal@example.com',
      password: 'testpassword123',
    });

    if (signUpError || !userData.user) {
      throw new Error('Failed to create minimal user');
    }

    const minimalToken = userData.session?.access_token || '';
    const minimalUserId = userData.user.id;

    await supabase.from('profiles').insert({
      id: minimalUserId,
      first_name: null,
      next_trip_city: null,
      personalization_enabled: true,
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

    // Clean up
    await supabase.from('profiles').delete().eq('id', minimalUserId);
  });
});
