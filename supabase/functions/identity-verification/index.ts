import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { stripe } from "../lib/stripe.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface VerificationRequest {
  return_url: string;
  purpose?: 'identity_document' | 'address';
  high_value_booking?: boolean;
  campaign_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
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

    const method = req.method;

    switch (method) {
      case 'POST':
        return await handleCreateVerificationSession(user.id, await req.json());
      
      case 'GET':
        const url = new URL(req.url);
        const sessionId = url.searchParams.get('session_id');
        if (sessionId) {
          return await handleGetVerificationSession(user.id, sessionId);
        } else {
          return await handleGetVerificationStatus(user.id);
        }
      
      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

  } catch (error) {
    console.error('Identity verification error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function handleCreateVerificationSession(userId: string, requestData: VerificationRequest) {
  try {
    // Get user's traveler profile
    const { data: profile, error: profileError } = await supabase
      .from('traveler_profiles')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Traveler profile not found' }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if verification is required based on booking value or policy
    const verificationRequired = await shouldRequireVerification(requestData);
    
    if (!verificationRequired && !requestData.high_value_booking) {
      return new Response(
        JSON.stringify({ 
          verification_required: false,
          message: 'No verification needed for this booking'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Stripe Identity verification session
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        user_id: userId,
        traveler_profile_id: profile.id,
        campaign_id: requestData.campaign_id || '',
      },
      options: {
        document: {
          allowed_types: ['passport', 'id_card', 'driving_license'],
          require_id_number: true,
          require_live_capture: true,
          require_matching_selfie: true,
        },
      },
      return_url: requestData.return_url,
    });

    // Store verification session reference
    const { error: insertError } = await supabase
      .from('identity_verifications')
      .insert({
        user_id: userId,
        traveler_profile_id: profile.id,
        stripe_verification_session_id: verificationSession.id,
        status: 'requires_input',
        purpose: requestData.purpose || 'identity_document',
        campaign_id: requestData.campaign_id,
      });

    if (insertError) {
      console.error('Failed to store verification session:', insertError);
      // Continue anyway - the Stripe session is created
    }

    // Log audit event
    await supabase
      .from('traveler_data_audit')
      .insert({
        user_id: userId,
        traveler_profile_id: profile.id,
        action: 'identity_verification_started',
        field_accessed: 'identity_verification',
      });

    return new Response(
      JSON.stringify({
        verification_session: {
          id: verificationSession.id,
          client_secret: verificationSession.client_secret,
          url: verificationSession.url,
          status: verificationSession.status,
        },
        verification_required: true,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error creating verification session:', error);
    throw error;
  }
}

async function handleGetVerificationSession(userId: string, sessionId: string) {
  try {
    // Retrieve session from Stripe
    const verificationSession = await stripe.identity.verificationSessions.retrieve(sessionId);

    // Verify this session belongs to the user
    if (verificationSession.metadata?.user_id !== userId) {
      return new Response(
        JSON.stringify({ error: 'Verification session not found' }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update our database with the current status
    const { error: updateError } = await supabase
      .from('identity_verifications')
      .update({
        status: verificationSession.status,
        verified_at: verificationSession.status === 'verified' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_verification_session_id', sessionId)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Failed to update verification status:', updateError);
    }

    // If verification is complete, update traveler profile
    if (verificationSession.status === 'verified') {
      const { error: profileUpdateError } = await supabase
        .from('traveler_profiles')
        .update({ is_verified: true })
        .eq('user_id', userId)
        .eq('is_primary', true);

      if (profileUpdateError) {
        console.error('Failed to update traveler profile verification status:', profileUpdateError);
      }

      // Log successful verification
      await supabase
        .from('traveler_data_audit')
        .insert({
          user_id: userId,
          traveler_profile_id: verificationSession.metadata?.traveler_profile_id || '',
          action: 'identity_verification_completed',
          field_accessed: 'identity_verification',
        });
    }

    return new Response(
      JSON.stringify({
        verification_session: {
          id: verificationSession.id,
          status: verificationSession.status,
          verified_outputs: verificationSession.verified_outputs,
          last_error: verificationSession.last_error,
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error retrieving verification session:', error);
    throw error;
  }
}

async function handleGetVerificationStatus(userId: string) {
  try {
    // Get user's verification status from our database
    const { data: verifications, error } = await supabase
      .from('identity_verifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      throw error;
    }

    // Get traveler profile verification status
    const { data: profile, error: profileError } = await supabase
      .from('traveler_profiles')
      .select('is_verified')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single();

    return new Response(
      JSON.stringify({
        is_verified: profile?.is_verified || false,
        verifications: verifications || [],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error getting verification status:', error);
    throw error;
  }
}

async function shouldRequireVerification(requestData: VerificationRequest): Promise<boolean> {
  // Business logic for when to require identity verification
  
  // Always require for high-value bookings (>$2000)
  if (requestData.high_value_booking) {
    return true;
  }

  // Check if campaign involves international travel (requires passport verification)
  if (requestData.campaign_id) {
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('origin, destination, max_price')
      .eq('id', requestData.campaign_id)
      .single();

    if (campaign) {
      // Require verification for international flights over $1000
      const isInternational = isInternationalRoute(campaign.origin, campaign.destination);
      if (isInternational && campaign.max_price > 1000) {
        return true;
      }
    }
  }

  // Optional: Random sampling for fraud prevention (1% of users)
  if (Math.random() < 0.01) {
    return true;
  }

  return false;
}

function isInternationalRoute(origin: string, destination: string): boolean {
  // Simple check - in production, you'd use a proper country/airport mapping
  const usAirports = ['JFK', 'LAX', 'ORD', 'DFW', 'ATL', 'DEN', 'SFO', 'SEA', 'LAS', 'PHX'];
  const originIsUS = usAirports.some(code => origin.includes(code));
  const destIsUS = usAirports.some(code => destination.includes(code));
  
  return originIsUS !== destIsUS; // One is US, one is not
}
