import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log('Get Flag function started');

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { key } = await req.json();

    if (!key) {
      return new Response(JSON.stringify({ error: 'Missing key' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await supabaseClient
      .from('feature_flags')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      console.error('Error fetching flag:', error);
      // If the flag is not found, it's not necessarily an "error" state for the caller,
      // it might just mean the feature is disabled or not configured.
      // Depending on desired behavior, you might return enabled: false or a more specific error.
      if (error.code === 'PGRST116') { // PGRST116: "The result contains 0 rows"
        return new Response(JSON.stringify({ enabled: false, message: 'Flag not found' }), {
          status: 200, // Or 404 if you prefer to indicate not found as an error
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: 'Failed to fetch flag' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!data || typeof data.value !== 'object' || data.value === null || typeof data.value.enabled !== 'boolean') {
      // If data is found but value is not in the expected format { "enabled": boolean }
      console.warn('Flag data is not in the expected format for key:', key, 'data:', data);
      return new Response(JSON.stringify({ enabled: false, message: 'Flag data format incorrect' }), {
        status: 200, // Or 500 if this should be treated as a server error
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ enabled: data.value.enabled }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Unexpected error in get-flag function:', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
