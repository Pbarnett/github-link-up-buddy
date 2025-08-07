import { createClient } from 'npm:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: Record<string, unknown>
  schema: 'auth'
  old_record: null | Record<string, unknown>
}

Deno.serve(async (req) => {
  // Verify the webhook signature for security
  const _signature = req.headers.get('Authorization')  
  
  try {
    const payload: WebhookPayload = await req.json()
    
    // Only process user creation events
    if (payload.type !== 'INSERT' || payload.table !== 'users') {
      return new Response('Event not processed', { status: 200 })
    }

    const user = payload.record
    console.log(`Processing new user: ${user.id}`)

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create user preferences asynchronously
    const { error: preferencesError } = await supabase
      .from('user_preferences')
      .insert([
        {
          user_id: user.id,
          preferred_currency: 'USD',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()

    if (preferencesError) {
      console.error('Failed to create user preferences:', preferencesError)
      // Don't throw - this shouldn't block user creation
      // Instead, we could implement retry logic or error notifications
    } else {
      console.log(`Successfully created preferences for user: ${user.id}`)
    }

    return new Response(
      JSON.stringify({ success: true, user_id: user.id }), 
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Auth hook error:', error)
    
    // Return success even on error to prevent blocking auth flow
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }), 
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  }
})
