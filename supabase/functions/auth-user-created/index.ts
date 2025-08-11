import { createClient } from 'npm:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: any
  schema: 'auth'
  old_record: null | any
}

Deno.serve(async (_req) => {
  // This function is intentionally disabled because provisioning
  // is handled by database triggers (see migrations).
  // Returning 410 Gone ensures no duplicate provisioning occurs.
  const body = JSON.stringify({ success: false, disabled: true, reason: 'provisioning handled by DB trigger' });
  return new Response(body, { status: 410, headers: { 'Content-Type': 'application/json' } });
})
