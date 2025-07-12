import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing Supabase environment variables');
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS'
};

// Log AI activity for audit trail
async function logAIActivity(
  agentId: string,
  action: string,
  result: string | null = null,
  context: any = {},
  userId?: string
) {
  try {
    await supabase.from('ai_activity').insert({
      agent_id: agentId,
      action,
      result,
      task_context: context,
      user_id: userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log AI activity:', error);
  }
}

// Log profile activity for user tracking
async function logProfileActivity(
  userId: string,
  activityType: string,
  activityDetails: any = {},
  scoreBefore?: number,
  scoreAfter?: number,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await supabase.from('profile_activity_log').insert({
      user_id: userId,
      activity_type: activityType,
      activity_details: activityDetails,
      completion_score_before: scoreBefore,
      completion_score_after: scoreAfter,
      ip_address: ipAddress,
      user_agent: userAgent,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log profile activity:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'health';

    // Health endpoint - no authentication required
    if (action === 'health') {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0',
          function: 'user-profile-manager',
          features: ['profile-completion', 'recommendations', 'verification']
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Authentication required for all other endpoints
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const jwt = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    switch (action) {
      case 'get-profile': {
        try {
          // Get traveler profile with completion tracking
          const { data: profile, error: profileError } = await supabase
            .from('traveler_profiles')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_primary', true)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }

          // Get completion tracking
          const { data: completionTracking, error: trackingError } = await supabase
            .from('profile_completion_tracking')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (trackingError && trackingError.code !== 'PGRST116') {
            console.warn('Error fetching completion tracking:', trackingError);
          }

          // Get recommendations
          const { data: recommendations, error: recError } = await supabase
            .rpc('get_profile_recommendations', { profile_user_id: user.id });

          if (recError) {
            console.warn('Error fetching recommendations:', recError);
          }

          await logProfileActivity(
            user.id,
            'profile_viewed',
            { has_profile: !!profile },
            undefined,
            undefined,
            clientIP,
            userAgent
          );

          return new Response(
            JSON.stringify({
              profile: profile || null,
              completion_tracking: completionTracking || null,
              recommendations: recommendations || []
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          console.error('Error fetching profile:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch profile' }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'update-profile': {
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        try {
          const body = await req.json();
          const { 
            full_name, 
            date_of_birth, 
            gender, 
            email, 
            phone, 
            travel_preferences,
            notification_preferences 
          } = body;

          // Get current profile for score comparison
          const { data: currentProfile } = await supabase
            .from('traveler_profiles')
            .select('profile_completeness_score')
            .eq('user_id', user.id)
            .eq('is_primary', true)
            .single();

          const currentScore = currentProfile?.profile_completeness_score || 0;

          // Update or create profile
          const profileData: any = {
            user_id: user.id,
            is_primary: true,
            updated_at: new Date().toISOString()
          };

          if (full_name !== undefined) profileData.full_name = full_name;
          if (date_of_birth !== undefined) profileData.date_of_birth = date_of_birth;
          if (gender !== undefined) profileData.gender = gender;
          if (email !== undefined) profileData.email = email;
          if (phone !== undefined) profileData.phone = phone;
          if (travel_preferences !== undefined) profileData.travel_preferences = travel_preferences;
          if (notification_preferences !== undefined) profileData.notification_preferences = notification_preferences;

          const { data: updatedProfile, error: updateError } = await supabase
            .from('traveler_profiles')
            .upsert(profileData, { onConflict: 'user_id,is_primary' })
            .select()
            .single();

          if (updateError) {
            throw updateError;
          }

          const newScore = updatedProfile.profile_completeness_score || 0;

          await logProfileActivity(
            user.id,
            'profile_updated',
            { 
              fields_updated: Object.keys(body),
              score_change: newScore - currentScore
            },
            currentScore,
            newScore,
            clientIP,
            userAgent
          );

          await logAIActivity(
            'warp-agent-profile-update',
            'Profile updated via user-profile-manager',
            `Score changed from ${currentScore} to ${newScore}`,
            { fields_updated: Object.keys(body) },
            user.id
          );

          return new Response(
            JSON.stringify({ 
              profile: updatedProfile,
              score_change: newScore - currentScore
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          console.error('Error updating profile:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to update profile' }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'verify-phone': {
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        try {
          const body = await req.json();
          const { phone_number, verification_code } = body;

          if (!phone_number || !verification_code) {
            return new Response(
              JSON.stringify({ error: 'Phone number and verification code are required' }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Check verification attempt
          const { data: attempt, error: attemptError } = await supabase
            .from('phone_verification_attempts')
            .select('*')
            .eq('user_id', user.id)
            .eq('phone_number', phone_number)
            .eq('verification_code', verification_code)
            .eq('status', 'pending')
            .gte('expires_at', new Date().toISOString())
            .single();

          if (attemptError || !attempt) {
            return new Response(
              JSON.stringify({ error: 'Invalid or expired verification code' }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Mark verification as successful
          await supabase
            .from('phone_verification_attempts')
            .update({
              status: 'verified',
              verified_at: new Date().toISOString()
            })
            .eq('id', attempt.id);

          // Update traveler profile
          const { data: updatedProfile, error: profileError } = await supabase
            .from('traveler_profiles')
            .update({
              phone: phone_number,
              phone_verified: true,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('is_primary', true)
            .select()
            .single();

          if (profileError) {
            throw profileError;
          }

          await logProfileActivity(
            user.id,
            'phone_verified',
            { phone_number },
            undefined,
            updatedProfile.profile_completeness_score,
            clientIP,
            userAgent
          );

          await logAIActivity(
            'warp-agent-phone-verification',
            'Phone number verified',
            'Successfully verified phone number',
            { phone_number },
            user.id
          );

          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'Phone number verified successfully',
              profile: updatedProfile
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          console.error('Error verifying phone:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to verify phone number' }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'get-completion-tracking': {
        try {
          const { data: tracking, error } = await supabase
            .from('profile_completion_tracking')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            throw error;
          }

          return new Response(
            JSON.stringify({ tracking: tracking || null }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          console.error('Error fetching completion tracking:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch completion tracking' }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'calculate-completeness': {
        try {
          // Get traveler profile
          const { data: profile, error: profileError } = await supabase
            .from('traveler_profiles')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_primary', true)
            .single();

          if (profileError) {
            throw profileError;
          }

          if (!profile) {
            return new Response(
              JSON.stringify({ completeness_score: 0, profile: null }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Calculate completeness using database function
          const { data: score, error: scoreError } = await supabase
            .rpc('calculate_profile_completeness', { profile_id: profile.id });

          if (scoreError) {
            throw scoreError;
          }

          await logAIActivity(
            'warp-agent-completeness-calc',
            'Profile completeness calculated',
            `Calculated score: ${score}`,
            { profile_id: profile.id },
            user.id
          );

          return new Response(
            JSON.stringify({ 
              completeness_score: score,
              profile: profile
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          console.error('Error calculating completeness:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to calculate completeness' }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      default:
        return new Response(
          JSON.stringify({
            error: 'Not found',
            availableEndpoints: [
              'get-profile', 
              'update-profile', 
              'verify-phone', 
              'get-completion-tracking',
              'calculate-completeness',
              'health'
            ]
          }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

  } catch (error) {
    console.error('User profile manager error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
