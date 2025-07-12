/**
 * Secure Traveler Profile Management
 * Handles CRUD operations for traveler profiles with KMS encryption, audit logging, and compliance features
 */

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
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

interface TravelerProfile {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  email: string;
  phone?: string;
  passportNumber?: string;
  passportCountry?: string;
  passportExpiry?: string;
  knownTravelerNumber?: string;
  isPrimary?: boolean;
}

interface AuditLogEntry {
  user_id: string;
  traveler_profile_id: string;
  action: string;
  field_accessed?: string;
  ip_address?: string;
  user_agent?: string;
}

// Helper function to log audit events
async function logAuditEvent(entry: AuditLogEntry) {
  try {
    const { error } = await supabase
      .from('traveler_data_audit')
      .insert(entry);
    
    if (error) {
      console.error('Failed to log audit event:', error);
    }
  } catch (err) {
    console.error('Exception logging audit event:', err);
  }
}

// Helper function to get client info from request
function getClientInfo(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIP || req.headers.get('cf-connecting-ip') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  return { ip_address: ip, user_agent: userAgent };
}

// Validate traveler profile data
function validateTravelerProfile(profile: TravelerProfile): string[] {
  const errors: string[] = [];
  
  if (!profile.fullName || profile.fullName.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters');
  }
  
  if (!profile.dateOfBirth) {
    errors.push('Date of birth is required');
  } else {
    const dob = new Date(profile.dateOfBirth);
    const now = new Date();
    const age = now.getFullYear() - dob.getFullYear();
    if (age < 0 || age > 120) {
      errors.push('Invalid date of birth');
    }
  }
  
  if (!profile.gender || !['MALE', 'FEMALE', 'OTHER'].includes(profile.gender)) {
    errors.push('Valid gender is required');
  }
  
  if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errors.push('Valid email is required');
  }
  
  if (profile.passportExpiry) {
    const expiry = new Date(profile.passportExpiry);
    const now = new Date();
    if (expiry < now) {
      errors.push('Passport expiry date cannot be in the past');
    }
  }
  
  return errors;
}

serve(async (req: Request) => {
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

    const clientInfo = getClientInfo(req);
    const url = new URL(req.url);
    const method = req.method;
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    // Route handling
    switch (method) {
      case 'GET': {
        if (pathSegments.length === 0) {
          // Get all traveler profiles for user
          const { data: profiles, error } = await supabase
            .from('traveler_profiles')
            .select('id, full_name, date_of_birth, gender, email, phone, passport_country, passport_expiry, known_traveler_number, is_primary, is_verified, created_at, updated_at')
            .eq('user_id', user.id)
            .order('is_primary', { ascending: false });

          if (error) throw error;

          // Log audit event
          await logAuditEvent({
            user_id: user.id,
            traveler_profile_id: 'multiple',
            action: 'viewed',
            field_accessed: 'profile_list',
            ...clientInfo
          });

          return new Response(
            JSON.stringify({ profiles }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } else {
          // Get specific traveler profile
          const profileId = pathSegments[0];
          const { data: profile, error } = await supabase
            .from('traveler_profiles')
            .select('*')
            .eq('id', profileId)
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          if (!profile) {
            return new Response(
              JSON.stringify({ error: 'Profile not found' }),
              { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Decrypt passport number if it exists
          let decryptedPassportNumber = null;
          if (profile.passport_number_encrypted) {
            try {
              if (profile.encryption_version === 2) {
                // Use KMS decryption for version 2
                const kmsResponse = await fetch(`${supabaseUrl}/functions/v1/kms-operations/decrypt`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ 
                    encryptedData: profile.passport_number_encrypted,
                    context: 'traveler_profile_access'
                  }),
                });

                if (kmsResponse.ok) {
                  const kmsResult = await kmsResponse.json();
                  decryptedPassportNumber = kmsResult.plaintext;
                }
              } else {
                // Use legacy decryption for version 1
                const { data: decryptResult, error: decryptError } = await supabase
                  .rpc('decrypt_passport_number_legacy', { encrypted_passport: profile.passport_number_encrypted });
              
                if (!decryptError) {
                  decryptedPassportNumber = decryptResult;
                }
              }
            } catch (decryptError) {
              console.error('Decryption error:', decryptError);
              // Don't fail the request, just don't return the passport number
            }
          }

          // Log audit event
          await logAuditEvent({
            user_id: user.id,
            traveler_profile_id: profileId,
            action: 'viewed',
            field_accessed: 'full_profile',
            ...clientInfo
          });

          // Remove encrypted field and add decrypted value
          const { passport_number_encrypted, ...profileData } = profile;
          const responseProfile = {
            ...profileData,
            passportNumber: decryptedPassportNumber
          };

          return new Response(
            JSON.stringify({ profile: responseProfile }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'POST': {
        // Create new traveler profile
        const body = await req.json();
        const profile: TravelerProfile = body.profile;

        // Validate input
        const validationErrors = validateTravelerProfile(profile);
        if (validationErrors.length > 0) {
          return new Response(
            JSON.stringify({ errors: validationErrors }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Encrypt passport number using KMS if provided
        let encryptedPassportNumber = null;
        if (profile.passportNumber) {
          try {
            // Call KMS operations Edge Function for encryption
            const kmsResponse = await fetch(`${supabaseUrl}/functions/v1/kms-operations/encrypt`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                plaintext: profile.passportNumber,
                context: 'traveler_profile_creation'
              }),
            });

            if (!kmsResponse.ok) {
              throw new Error(`KMS encryption failed: ${kmsResponse.statusText}`);
            }

            const kmsResult = await kmsResponse.json();
            encryptedPassportNumber = kmsResult.encryptedData;
          } catch (encryptError) {
            console.error('KMS encryption error:', encryptError);
            return new Response(
              JSON.stringify({ error: 'Failed to encrypt sensitive data' }),
              { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }

        // Insert profile
        const { data: newProfile, error: insertError } = await supabase
          .from('traveler_profiles')
          .insert({
            user_id: user.id,
            full_name: profile.fullName,
            date_of_birth: profile.dateOfBirth,
            gender: profile.gender,
            email: profile.email,
            phone: profile.phone,
            passport_number_encrypted: encryptedPassportNumber,
            encryption_version: encryptedPassportNumber ? 2 : null, // 2 = KMS encryption
            passport_country: profile.passportCountry,
            passport_expiry: profile.passportExpiry,
            known_traveler_number: profile.knownTravelerNumber,
            is_primary: profile.isPrimary || false
          })
          .select('id, full_name, date_of_birth, gender, email, phone, passport_country, passport_expiry, known_traveler_number, is_primary, is_verified, created_at, updated_at')
          .single();

        if (insertError) throw insertError;

        // Log audit event
        await logAuditEvent({
          user_id: user.id,
          traveler_profile_id: newProfile.id,
          action: 'created',
          field_accessed: 'full_profile',
          ...clientInfo
        });

        return new Response(
          JSON.stringify({ profile: newProfile }),
          { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case 'PUT': {
        // Update traveler profile
        const profileId = pathSegments[0];
        if (!profileId) {
          return new Response(
            JSON.stringify({ error: 'Profile ID is required' }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const body = await req.json();
        const profile: TravelerProfile = body.profile;

        // Validate input
        const validationErrors = validateTravelerProfile(profile);
        if (validationErrors.length > 0) {
          return new Response(
            JSON.stringify({ errors: validationErrors }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Check if profile exists and belongs to user
        const { data: existingProfile, error: fetchError } = await supabase
          .from('traveler_profiles')
          .select('id')
          .eq('id', profileId)
          .eq('user_id', user.id)
          .single();

        if (fetchError || !existingProfile) {
          return new Response(
            JSON.stringify({ error: 'Profile not found' }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Encrypt passport number using KMS if provided
        let encryptedPassportNumber = null;
        if (profile.passportNumber) {
          try {
            // Call KMS operations Edge Function for encryption
            const kmsResponse = await fetch(`${supabaseUrl}/functions/v1/kms-operations/encrypt`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                plaintext: profile.passportNumber,
                context: 'traveler_profile_update'
              }),
            });

            if (!kmsResponse.ok) {
              throw new Error(`KMS encryption failed: ${kmsResponse.statusText}`);
            }

            const kmsResult = await kmsResponse.json();
            encryptedPassportNumber = kmsResult.encryptedData;
          } catch (encryptError) {
            console.error('KMS encryption error:', encryptError);
            return new Response(
              JSON.stringify({ error: 'Failed to encrypt sensitive data' }),
              { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }

        // Update profile
        const updateData: any = {
          full_name: profile.fullName,
          date_of_birth: profile.dateOfBirth,
          gender: profile.gender,
          email: profile.email,
          phone: profile.phone,
          passport_country: profile.passportCountry,
          passport_expiry: profile.passportExpiry,
          known_traveler_number: profile.knownTravelerNumber,
        };

        if (encryptedPassportNumber !== null) {
          updateData.passport_number_encrypted = encryptedPassportNumber;
          updateData.encryption_version = 2; // KMS encryption
        }

        const { data: updatedProfile, error: updateError } = await supabase
          .from('traveler_profiles')
          .update(updateData)
          .eq('id', profileId)
          .eq('user_id', user.id)
          .select('id, full_name, date_of_birth, gender, email, phone, passport_country, passport_expiry, known_traveler_number, is_primary, is_verified, created_at, updated_at')
          .single();

        if (updateError) throw updateError;

        // Log audit event
        await logAuditEvent({
          user_id: user.id,
          traveler_profile_id: profileId,
          action: 'updated',
          field_accessed: 'full_profile',
          ...clientInfo
        });

        return new Response(
          JSON.stringify({ profile: updatedProfile }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case 'DELETE': {
        // Delete traveler profile
        const profileId = pathSegments[0];
        if (!profileId) {
          return new Response(
            JSON.stringify({ error: 'Profile ID is required' }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Check if profile exists and belongs to user
        const { data: existingProfile, error: fetchError } = await supabase
          .from('traveler_profiles')
          .select('id, is_primary')
          .eq('id', profileId)
          .eq('user_id', user.id)
          .single();

        if (fetchError || !existingProfile) {
          return new Response(
            JSON.stringify({ error: 'Profile not found' }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Prevent deletion of primary profile if it's the only one
        if (existingProfile.is_primary) {
          const { data: allProfiles, error: countError } = await supabase
            .from('traveler_profiles')
            .select('id')
            .eq('user_id', user.id);

          if (countError) throw countError;
          
          if (allProfiles.length === 1) {
            return new Response(
              JSON.stringify({ error: 'Cannot delete the only traveler profile' }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }

        // Delete profile
        const { error: deleteError } = await supabase
          .from('traveler_profiles')
          .delete()
          .eq('id', profileId)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        // Log audit event
        await logAuditEvent({
          user_id: user.id,
          traveler_profile_id: profileId,
          action: 'deleted',
          field_accessed: 'full_profile',
          ...clientInfo
        });

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

  } catch (error) {
    console.error('Secure traveler profiles error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
