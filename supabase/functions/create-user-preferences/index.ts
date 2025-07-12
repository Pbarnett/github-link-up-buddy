import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface RequestBody {
  user_id: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Extract JWT token
    const token = authHeader.replace('Bearer ', '')
    
    // Create Supabase client with service role for admin operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    
    // Create Supabase client with user JWT for verification
    const supabaseUser = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    })

    // Verify the user token and get user info
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser(token)
    
    if (userError || !user) {
      console.error('Invalid user token:', userError)
      return new Response(
        JSON.stringify({ error: 'Invalid authorization token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const body: RequestBody = await req.json()
    const { user_id } = body

    // Verify the user_id matches the authenticated user
    if (user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'User ID mismatch' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Creating user preferences for user: ${user_id}`)

    // Check if user preferences already exist
    const { data: existingPrefs, error: checkError } = await supabaseAdmin
      .from('user_preferences')
      .select('id')
      .eq('user_id', user_id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" which is expected
      console.error('Error checking existing preferences:', checkError)
      return new Response(
        JSON.stringify({ error: 'Database error checking preferences' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (existingPrefs) {
      console.log(`User preferences already exist for user: ${user_id}`)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'User preferences already exist',
          user_id: user_id 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create user preferences with default values
    const { data: newPrefs, error: insertError } = await supabaseAdmin
      .from('user_preferences')
      .insert([
        {
          user_id: user_id,
          preferred_currency: 'USD',
          home_country: null, // Will be set by user later
          timezone: 'UTC',
          email_notifications: true,
          sms_notifications: false,
          push_notifications: true,
          temperature_unit: 'celsius',
          distance_unit: 'metric',
          analytics_consent: false,
          marketing_consent: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (insertError) {
      console.error('Failed to create user preferences:', insertError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create user preferences',
          details: insertError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Successfully created user preferences for user: ${user_id}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User preferences created successfully',
        user_id: user_id,
        preferences: newPrefs
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
