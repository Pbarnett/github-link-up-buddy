import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user ID from headers
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

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

    // Generate personalized greeting based on available data
    const greeting = generateGreeting(profile);

    // Log analytics event
    await supabase
      .from('personalization_events')
      .insert({
        user_id: userId,
        event_type: 'greeting_fetched',
        context: {
          has_name: !!profile.first_name,
          has_next_trip: !!profile.next_trip_city,
          personalization_enabled: profile.personalization_enabled,
        },
      });

    return new Response(
      JSON.stringify({
        greeting,
        profile: {
          firstName: profile.first_name,
          nextTripCity: profile.next_trip_city,
          loyaltyTier: profile.loyalty_tier,
          personalizationEnabled: profile.personalization_enabled,
        },
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

function generateGreeting(profile: any): string {
  const timeOfDay = getTimeOfDay();
  
  if (!profile.personalization_enabled) {
    return 'Welcome to Parker Flight!';
  }

  if (profile.first_name) {
    if (profile.next_trip_city) {
      return `${timeOfDay}, ${profile.first_name}! Ready for your trip to ${profile.next_trip_city}?`;
    } else {
      return `${timeOfDay}, ${profile.first_name}! Where would you like to fly today?`;
    }
  }

  return `${timeOfDay}! Where would you like to fly today?`;
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
