import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'max-age=300', // 5 minutes
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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    // Get and validate JWT token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Verify JWT and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
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

    // Fetch user personalization data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, first_name, next_trip_city, loyalty_tier, personalization_enabled, last_login_at')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch profile data' }),
        {
          status: 500,
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

    // Log analytics event for data request
    await supabase
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

    // Return personalization data in the required format
    return new Response(
      JSON.stringify({
        firstName: profile.first_name,
        nextTripCity: profile.next_trip_city,
        personalizationEnabled: profile.personalization_enabled,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
