const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing Supabase environment variables. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  throw new Error('Edge Function: Missing Supabase environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
}
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { method, headers } = req;
    const authHeader = headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const jwt = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(jwt);
    if (error || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { action, travelerData } = await req.json();
    switch (action) {
      case 'create': {
        const { fullName, dateOfBirth, gender, email, phone, passportNumber, passportCountry, passportExpiry, knownTravelerNumber } = travelerData;
        
        // Encrypt passport number if provided
        let encryptedPassport = null;
        if (passportNumber) {
          const { data: encrypted } = await supabase.rpc('encrypt_passport_number', { passport_number: passportNumber });
          encryptedPassport = encrypted;
        }
        
        const { data, error } = await supabase.from('traveler_profiles').insert({
          user_id: user.id,
          full_name: fullName,
          date_of_birth: dateOfBirth,
          gender,
          email,
          phone,
          passport_number_encrypted: encryptedPassport,
          passport_country: passportCountry,
          passport_expiry: passportExpiry,
          known_traveler_number: knownTravelerNumber,
        }).select();

        if (error) throw error;
        
        // Log audit trail
        await supabase.from('traveler_data_audit').insert({
          user_id: user.id,
          traveler_profile_id: data[0].id,
          action: 'created',
          field_accessed: 'full_profile',
        });
        
        return new Response(JSON.stringify(data[0]), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      case 'update': {
        const { id, fullName, dateOfBirth, gender, email, phone } = travelerData;
        const { data, error } = await supabase.from('traveler_profiles').update({
          full_name: fullName,
          date_of_birth: dateOfBirth,
          gender,
          email,
          phone,
        }).eq('id', id).eq('user_id', user.id).select();

        if (error) throw error;
        return new Response(JSON.stringify(data[0]), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      case 'delete': {
        const { id } = travelerData;
        const { error } = await supabase.from('traveler_profiles').delete().eq('id', id).eq('user_id', user.id);

        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      case 'get': {
        const { data, error } = await supabase.from('traveler_profiles').select().eq('user_id', user.id);
        if (error) throw error;
        return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
