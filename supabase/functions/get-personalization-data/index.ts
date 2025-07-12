import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface PersonalizationData {
  hasFirstName: boolean;
  hasNextTrip: boolean;
  isComplete: boolean;
  success: boolean;
  loading: boolean;
  error: string | null;
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user profile to check if they have a first name
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', userId)
      .maybeSingle()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch profile data' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if user has any upcoming trips
    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select('id')
      .eq('user_id', userId)
      .gte('departure_date', new Date().toISOString())
      .limit(1)

    if (tripsError) {
      console.error('Error fetching trips:', tripsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch trips data' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const hasFirstName = !!(profile?.first_name && profile.first_name.trim())
    const hasNextTrip = !!(trips && trips.length > 0)
    const isComplete = hasFirstName && hasNextTrip

    const personalizationData: PersonalizationData = {
      hasFirstName,
      hasNextTrip,
      isComplete,
      success: true,
      loading: false,
      error: null,
    }

    return new Response(
      JSON.stringify(personalizationData),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in get-personalization-data:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        hasFirstName: false,
        hasNextTrip: false,
        isComplete: false,
        success: false,
        loading: false,
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
