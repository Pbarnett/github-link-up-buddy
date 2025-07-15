import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface CampaignData {
  id?: string;
  name?: string;
  description?: string;
  traveler_profile_id: string;
  payment_method_id: string;
  origin: string;
  destination: string;
  departure_date_start?: string;
  departure_date_end?: string;
  return_date_start?: string;
  return_date_end?: string;
  max_price: number;
  currency?: string;
  cabin_class?: string;
  search_frequency_hours?: number;
  expires_at?: string;
  max_bookings?: number;
  status?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const jwt = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const url = new URL(req.url);
    const method = req.method;

    switch (method) {
      case 'GET': {
        const campaignId = url.searchParams.get('id');
        if (campaignId) {
          return await handleGetCampaign(user.id, campaignId);
        } else {
          return await handleGetCampaigns(user.id);
        }
      }
      
      case 'POST':
        return await handleCreateCampaign(user.id, await req.json());
      
      case 'PUT':
        return await handleUpdateCampaign(user.id, await req.json());
      
      case 'DELETE': {
        const deleteId = url.searchParams.get('id');
        if (!deleteId) {
          return new Response(JSON.stringify({ error: 'Campaign ID required' }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        return await handleDeleteCampaign(user.id, deleteId);
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
  } catch (error) {
    console.error('Campaign management error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

async function handleGetCampaigns(userId: string) {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      traveler_profiles!campaigns_traveler_profile_id_fkey (
        id,
        full_name,
        email
      ),
      payment_methods!campaigns_payment_method_id_fkey (
        id,
        last4,
        brand,
        is_default
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return new Response(JSON.stringify({ campaigns: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

async function handleGetCampaign(userId: string, campaignId: string) {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      traveler_profiles!campaigns_traveler_profile_id_fkey (
        id,
        full_name,
        email,
        date_of_birth,
        gender
      ),
      payment_methods!campaigns_payment_method_id_fkey (
        id,
        last4,
        brand,
        exp_month,
        exp_year,
        is_default
      ),
      campaign_bookings (
        id,
        duffel_order_id,
        pnr,
        total_amount,
        currency,
        booking_status,
        payment_status,
        flight_details,
        created_at
      )
    `)
    .eq('id', campaignId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return new Response(JSON.stringify({ error: 'Campaign not found' }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    throw error;
  }

  return new Response(JSON.stringify({ campaign: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

async function handleCreateCampaign(userId: string, campaignData: CampaignData) {
  // Validate required fields
  const requiredFields = ['traveler_profile_id', 'payment_method_id', 'origin', 'destination', 'max_price'];
  for (const field of requiredFields) {
    if (!campaignData[field as keyof CampaignData]) {
      return new Response(JSON.stringify({ error: `Missing required field: ${field}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }

  try {
    // Verify that the traveler profile and payment method belong to the user
    const [travelerResult, paymentResult] = await Promise.all([
      supabase
        .from('traveler_profiles')
        .select('id')
        .eq('id', campaignData.traveler_profile_id)
        .eq('user_id', userId)
        .single(),
      supabase
        .from('payment_methods')
        .select('id')
        .eq('id', campaignData.payment_method_id)
        .eq('user_id', userId)
        .single()
    ]);

    if (travelerResult.error || paymentResult.error) {
      return new Response(JSON.stringify({ error: 'Invalid traveler profile or payment method' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Set default expiration if not provided (12 months from now)
    const expiresAt = campaignData.expires_at || 
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    // Generate a default name if not provided
    const campaignName = campaignData.name || 
      `${campaignData.origin} to ${campaignData.destination}`;

    const { data: newCampaign, error } = await supabase
      .from('campaigns')
      .insert({
        user_id: userId,
        name: campaignName,
        description: campaignData.description,
        traveler_profile_id: campaignData.traveler_profile_id,
        payment_method_id: campaignData.payment_method_id,
        origin: campaignData.origin,
        destination: campaignData.destination,
        departure_date_start: campaignData.departure_date_start,
        departure_date_end: campaignData.departure_date_end,
        return_date_start: campaignData.return_date_start,
        return_date_end: campaignData.return_date_end,
        max_price: campaignData.max_price,
        currency: campaignData.currency || 'USD',
        cabin_class: campaignData.cabin_class || 'economy',
        search_frequency_hours: campaignData.search_frequency_hours || 24,
        expires_at: expiresAt,
        max_bookings: campaignData.max_bookings || 1,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    // Log audit trail
    await supabase
      .from('traveler_data_audit')
      .insert({
        user_id: userId,
        traveler_profile_id: campaignData.traveler_profile_id,
        action: 'campaign_created',
        field_accessed: 'campaign',
      });

    return new Response(JSON.stringify({ 
      campaign: newCampaign,
      message: 'Campaign created successfully'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Campaign creation error:', error);
    throw error;
  }
}

async function handleUpdateCampaign(userId: string, campaignData: CampaignData) {
  const { id, ...updateData } = campaignData;
  
  if (!id) {
    return new Response(JSON.stringify({ error: 'Campaign ID required' }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    // Remove undefined values
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined)
    );

    const { data: updatedCampaign, error } = await supabase
      .from('campaigns')
      .update(cleanUpdateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Campaign not found' }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      throw error;
    }

    // Log audit trail
    await supabase
      .from('traveler_data_audit')
      .insert({
        user_id: userId,
        traveler_profile_id: updatedCampaign.traveler_profile_id,
        action: 'campaign_updated',
        field_accessed: 'campaign',
      });

    return new Response(JSON.stringify({ 
      campaign: updatedCampaign,
      message: 'Campaign updated successfully'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Campaign update error:', error);
    throw error;
  }
}

async function handleDeleteCampaign(userId: string, campaignId: string) {
  try {
    // First check if campaign exists and get its details
    const { data: campaign, error: fetchError } = await supabase
      .from('campaigns')
      .select('traveler_profile_id, status')
      .eq('id', campaignId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !campaign) {
      return new Response(JSON.stringify({ error: 'Campaign not found' }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Check if campaign has any bookings
    const { data: bookings } = await supabase
      .from('campaign_bookings')
      .select('id')
      .eq('campaign_id', campaignId);

    if (bookings && bookings.length > 0) {
      // Don't delete campaigns with bookings, just mark as cancelled
      const { data: cancelledCampaign, error: cancelError } = await supabase
        .from('campaigns')
        .update({ status: 'cancelled' })
        .eq('id', campaignId)
        .eq('user_id', userId)
        .select()
        .single();

      if (cancelError) throw cancelError;

      return new Response(JSON.stringify({ 
        campaign: cancelledCampaign,
        message: 'Campaign cancelled (has existing bookings)'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } else {
      // Safe to delete campaign with no bookings
      const { error: deleteError } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Log audit trail
      await supabase
        .from('traveler_data_audit')
        .insert({
          user_id: userId,
          traveler_profile_id: campaign.traveler_profile_id,
          action: 'campaign_deleted',
          field_accessed: 'campaign',
        });

      return new Response(JSON.stringify({ 
        message: 'Campaign deleted successfully'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

  } catch (error) {
    console.error('Campaign deletion error:', error);
    throw error;
  }
}
