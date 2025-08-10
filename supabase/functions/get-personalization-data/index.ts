import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
};

// Simple rate limiting with a map (for demo purposes)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(key: string, limit: number = 30, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = requestCounts.get(key);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Check rate limit
    const authHeader = req.headers.get('authorization');
    const rateLimitKey = authHeader || req.headers.get('x-forwarded-for') || 'anonymous';
    
    if (!checkRateLimit(rateLimitKey)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !anonKey) {
      return new Response(
        JSON.stringify({ error: 'Function misconfigured: missing SUPABASE_URL or SUPABASE_ANON_KEY' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get and validate JWT token
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.replace(/bearer /i, '');

    // 1) Use anon client to verify the JWT belongs to a valid user
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const userId = user.id;

    // 2) Use service role for DB access to avoid RLS surprises, but scope by userId explicitly
    const dbClient = serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey)
      : authClient; // fallback if service key not set

    // Fetch user personalization data
    const { data: profile, error: profileError } = await dbClient
      .from('profiles')
      .select('id, first_name, next_trip_city, loyalty_tier, personalization_enabled, last_login_at')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Database error (profiles):', profileError);
      const status = (profileError.code === '42501' /* insufficient_privilege */) ? 403 : 500;
      const debug = Deno.env.get('DEBUG_PERSONALIZATION') === '1';
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch profile data',
          ...(debug ? { code: profileError.code, message: profileError.message } : {})
        }),
        {
          status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Log analytics event for data request (best-effort)
    try {
      await dbClient
        .from('personalization_events')
        .insert({
          user_id: userId,
          event_type: 'data_requested',
          context: {
            has_name: !!profile.first_name,
            has_next_trip: !!profile.next_trip_city,
            personalization_enabled: profile.personalization_enabled,
          },
        });
    } catch (e) {
      console.warn('Non-fatal: failed to insert personalization_events', e);
    }

    // Return personalization data in the required format
    return new Response(
      JSON.stringify({
        firstName: profile.first_name ?? null,
        nextTripCity: profile.next_trip_city ?? null,
        personalizationEnabled: profile.personalization_enabled ?? true,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    const debug = Deno.env.get('DEBUG_PERSONALIZATION') === '1';
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        ...(debug ? { message: (error as any)?.message } : {})
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
