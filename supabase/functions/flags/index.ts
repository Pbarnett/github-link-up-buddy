// supabase/functions/flags/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import murmur from 'https://esm.sh/murmurhash-js@1.0.0';

// Inline the shared functions for Edge Function compatibility
function userInBucket(userId: string, rollout: number): boolean {
  if (!userId) return false;
  if (rollout <= 0) return false;
  if (rollout >= 100) return true;
  
  const bucket = murmur.murmur3(userId) % 100; // 0-99
  return bucket < rollout; // 5 → first five buckets (0-4)
}

function getUserBucket(userId: string): number {
  if (!userId) return 0;
  return murmur.murmur3(userId) % 100;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

interface FlagRequest {
  user_id: string;
  flag: string;
}

interface FlagResponse {
  enabled: boolean;
  bucket?: number;
  rollout_percentage?: number;
}

export default async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, flag }: FlagRequest = await req.json();

    if (!user_id || !flag) {
      return new Response(
        JSON.stringify({ error: 'user_id and flag are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch feature flag from database
    const { data: row, error } = await supabase
      .from('feature_flags')
      .select('*')
      .eq('name', flag)
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!row) {
      // Flag not found, return disabled
      return new Response(
        JSON.stringify({ enabled: false }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Calculate if user should see the feature
    const userBucket = getUserBucket(user_id);
    const enabled = row.enabled && userInBucket(user_id, row.rollout_percentage);

    const response: FlagResponse = {
      enabled,
      bucket: userBucket,
      rollout_percentage: row.rollout_percentage
    };

    // Add canary header for monitoring
    const headers = {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'x-canary': enabled.toString(),
      'x-user-bucket': userBucket.toString(),
      'x-rollout-percentage': row.rollout_percentage.toString()
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}
