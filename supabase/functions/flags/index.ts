// supabase/functions/flags/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Inline Murmur3 hash for Edge Function compatibility
function murmur3(str: string, seed: number = 0): number {
  let h1 = seed;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;
  const r1 = 15;
  const r2 = 13;
  const m = 5;
  const n = 0xe6546b64;

  // Process 4-byte chunks
  for (let i = 0; i < str.length - 3; i += 4) {
    let k1 = 
      (str.charCodeAt(i) & 0xff) |
      ((str.charCodeAt(i + 1) & 0xff) << 8) |
      ((str.charCodeAt(i + 2) & 0xff) << 16) |
      ((str.charCodeAt(i + 3) & 0xff) << 24);

    k1 = Math.imul(k1, c1);
    k1 = (k1 << r1) | (k1 >>> (32 - r1));
    k1 = Math.imul(k1, c2);

    h1 ^= k1;
    h1 = (h1 << r2) | (h1 >>> (32 - r2));
    h1 = Math.imul(h1, m) + n;
  }

  // Handle remaining bytes
  let k1 = 0;
  const remaining = str.length % 4;
  if (remaining >= 3) k1 ^= (str.charCodeAt(str.length - remaining + 2) & 0xff) << 16;
  if (remaining >= 2) k1 ^= (str.charCodeAt(str.length - remaining + 1) & 0xff) << 8;
  if (remaining >= 1) {
    k1 ^= str.charCodeAt(str.length - remaining) & 0xff;
    k1 = Math.imul(k1, c1);
    k1 = (k1 << r1) | (k1 >>> (32 - r1));
    k1 = Math.imul(k1, c2);
    h1 ^= k1;
  }

  // Finalization
  h1 ^= str.length;
  h1 ^= h1 >>> 16;
  h1 = Math.imul(h1, 0x85ebca6b);
  h1 ^= h1 >>> 13;
  h1 = Math.imul(h1, 0xc2b2ae35);
  h1 ^= h1 >>> 16;

  return h1 >>> 0; // Convert to unsigned 32-bit integer
}

function isUserInRollout(userId: string, featureName: string, rolloutPercentage: number): boolean {
  if (rolloutPercentage <= 0) return false;
  if (rolloutPercentage >= 100) return true;

  const hashInput = `${userId}:${featureName}`;
  const hash = murmur3(hashInput);
  const userBucket = hash % 100;
  
  return userBucket < rolloutPercentage;
}

function getUserBucket(userId: string, featureName: string): number {
  if (!userId) return 0;
  const hashInput = `${userId}:${featureName}`;
  return murmur3(hashInput) % 100;
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
  rollout_percentage: number;
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
        JSON.stringify({ enabled: false, rollout_percentage: 0 }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Calculate if user should see the feature
    const userBucket = getUserBucket(user_id, flag);
    const enabled = row.enabled && isUserInRollout(user_id, flag, row.rollout_percentage);

    const response: FlagResponse = {
      enabled,
      rollout_percentage: row.rollout_percentage
    };

    // Add comprehensive monitoring headers
    const headers = {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'x-canary': enabled.toString(),
      'x-user-bucket': userBucket.toString(),
      'x-rollout-percentage': row.rollout_percentage.toString(),
      'x-flag-name': flag,
      'x-flag-enabled': row.enabled.toString(),
      'x-timestamp': new Date().toISOString(),
      'x-function-version': '2.0.0'
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
