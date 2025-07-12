import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { encryptData, decryptData } from "../_shared/kms.ts";

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
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

interface MigrationResult {
  success: boolean;
  migratedProfiles: number;
  migratedPaymentMethods: number;
  skippedProfiles: number;
  skippedPaymentMethods: number;
  errors: string[];
  totalTime: number;
}

// Legacy decryption functions (for migration only)
async function decryptLegacyData(encryptedData: string, keyName: string): Promise<string | null> {
  try {
    // Simulate legacy decryption - this would use your old encryption method
    // For now, we'll assume it's base64 encoded for demonstration
    // In reality, you'd use your actual legacy decryption logic here
    const decoded = atob(encryptedData);
    return decoded;
  } catch (error) {
    console.error(`Failed to decrypt legacy ${keyName}:`, error);
    return null;
  }
}

async function logMigrationAudit(operation: string, success: boolean, entityType: string, entityId?: string, error?: string) {
  try {
    await supabase.from('kms_audit_log').insert({
      operation: `migration_${operation}`,
      key_id: `migration_${entityType}`,
      success,
      error_message: error,
      user_id: null, // System migration
      ip_address: '127.0.0.1',
      timestamp: new Date().toISOString(),
      additional_data: JSON.stringify({ entity_type: entityType, entity_id: entityId })
    });
  } catch (auditError) {
    console.error('Failed to log migration audit:', auditError);
  }
}

async function migrateProfileData(profileId: string, batchNumber: number): Promise<boolean> {
  try {
    // Get the legacy profile data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .eq('encryption_version', 1)
      .single();

    if (error || !profile) {
      console.log(`Profile ${profileId} not found or already migrated`);
      return false;
    }

    const updates: any = {
      encryption_version: 2,
      updated_at: new Date().toISOString()
    };

    let migrationNeeded = false;

    // Migrate first_name if it exists
    if (profile.first_name && !profile.first_name_encrypted) {
      const encrypted = await encryptData(profile.first_name, 'PII');
      updates.first_name_encrypted = encrypted;
      updates.first_name = null; // Clear plaintext
      migrationNeeded = true;
    }

    // Migrate last_name if it exists
    if (profile.last_name && !profile.last_name_encrypted) {
      const encrypted = await encryptData(profile.last_name, 'PII');
      updates.last_name_encrypted = encrypted;
      updates.last_name = null; // Clear plaintext
      migrationNeeded = true;
    }

    // Migrate phone if it exists
    if (profile.phone && !profile.phone_encrypted) {
      const encrypted = await encryptData(profile.phone, 'PII');
      updates.phone_encrypted = encrypted;
      updates.phone = null; // Clear plaintext
      migrationNeeded = true;
    }

    if (!migrationNeeded) {
      // Just update the encryption version
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ encryption_version: 2 })
        .eq('id', profileId);

      if (updateError) {
        throw updateError;
      }

      console.log(`Profile ${profileId} (batch ${batchNumber}): No data to migrate, marked as KMS`);
      return true;
    }

    // Apply the updates
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profileId);

    if (updateError) {
      throw updateError;
    }

    await logMigrationAudit('profile', true, 'profile', profileId);
    console.log(`Profile ${profileId} (batch ${batchNumber}): Successfully migrated to KMS encryption`);
    return true;

  } catch (error) {
    await logMigrationAudit('profile', false, 'profile', profileId, error.message);
    console.error(`Profile ${profileId} (batch ${batchNumber}): Migration failed:`, error);
    return false;
  }
}

async function migratePaymentMethodData(paymentMethodId: string, batchNumber: number): Promise<boolean> {
  try {
    // Get the legacy payment method data
    const { data: paymentMethod, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', paymentMethodId)
      .eq('encryption_version', 1)
      .single();

    if (error || !paymentMethod) {
      console.log(`Payment method ${paymentMethodId} not found or already migrated`);
      return false;
    }

    const updates: any = {
      encryption_version: 2,
      updated_at: new Date().toISOString()
    };

    let migrationNeeded = false;

    // Migrate card number if it exists
    if (paymentMethod.card_number && !paymentMethod.card_number_encrypted) {
      const encrypted = await encryptData(paymentMethod.card_number, 'PAYMENT');
      updates.card_number_encrypted = encrypted;
      updates.card_number = null; // Clear plaintext
      migrationNeeded = true;
    }

    // Migrate cardholder name if it exists
    if (paymentMethod.cardholder_name && !paymentMethod.cardholder_name_encrypted) {
      const encrypted = await encryptData(paymentMethod.cardholder_name, 'PAYMENT');
      updates.cardholder_name_encrypted = encrypted;
      updates.cardholder_name = null; // Clear plaintext
      migrationNeeded = true;
    }

    // Migrate CVV if it exists (this is typically not stored, but just in case)
    if (paymentMethod.cvv && !paymentMethod.cvv_encrypted) {
      const encrypted = await encryptData(paymentMethod.cvv, 'PAYMENT');
      updates.cvv_encrypted = encrypted;
      updates.cvv = null; // Clear plaintext
      migrationNeeded = true;
    }

    if (!migrationNeeded) {
      // Just update the encryption version
      const { error: updateError } = await supabase
        .from('payment_methods')
        .update({ encryption_version: 2 })
        .eq('id', paymentMethodId);

      if (updateError) {
        throw updateError;
      }

      console.log(`Payment method ${paymentMethodId} (batch ${batchNumber}): No data to migrate, marked as KMS`);
      return true;
    }

    // Apply the updates
    const { error: updateError } = await supabase
      .from('payment_methods')
      .update(updates)
      .eq('id', paymentMethodId);

    if (updateError) {
      throw updateError;
    }

    await logMigrationAudit('payment_method', true, 'payment_method', paymentMethodId);
    console.log(`Payment method ${paymentMethodId} (batch ${batchNumber}): Successfully migrated to KMS encryption`);
    return true;

  } catch (error) {
    await logMigrationAudit('payment_method', false, 'payment_method', paymentMethodId, error.message);
    console.error(`Payment method ${paymentMethodId} (batch ${batchNumber}): Migration failed:`, error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'status';

    // Health endpoint - no authentication required
    if (action === 'health') {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          migration_service: true,
          version: '1.0'
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

    switch (action) {
      case 'status': {
        try {
          // Get migration status for profiles
          const { data: profileStats, error: profileError } = await supabase
            .from('profiles')
            .select('encryption_version')
            .neq('encryption_version', null);

          const { data: paymentStats, error: paymentError } = await supabase
            .from('payment_methods')
            .select('encryption_version')
            .neq('encryption_version', null);

          if (profileError) throw profileError;
          if (paymentError) throw paymentError;

          const profileCounts = {
            legacy: profileStats?.filter(p => p.encryption_version === 1).length || 0,
            kms: profileStats?.filter(p => p.encryption_version === 2).length || 0
          };

          const paymentCounts = {
            legacy: paymentStats?.filter(p => p.encryption_version === 1).length || 0,
            kms: paymentStats?.filter(p => p.encryption_version === 2).length || 0
          };

          return new Response(
            JSON.stringify({
              profiles: profileCounts,
              payment_methods: paymentCounts,
              total_legacy: profileCounts.legacy + paymentCounts.legacy,
              total_kms: profileCounts.kms + paymentCounts.kms,
              migration_complete: (profileCounts.legacy + paymentCounts.legacy) === 0
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          console.error('Error getting migration status:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to get migration status' }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'migrate': {
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        try {
          const body = await req.json();
          const { batch_size = 10, entity_type = 'all' } = body;

          const startTime = Date.now();
          let migratedProfiles = 0;
          let migratedPaymentMethods = 0;
          let skippedProfiles = 0;
          let skippedPaymentMethods = 0;
          const errors: string[] = [];

          // Migrate profiles
          if (entity_type === 'all' || entity_type === 'profiles') {
            const { data: legacyProfiles, error: profileError } = await supabase
              .from('profiles')
              .select('id')
              .eq('encryption_version', 1)
              .limit(batch_size);

            if (profileError) {
              errors.push(`Profile query error: ${profileError.message}`);
            } else if (legacyProfiles && legacyProfiles.length > 0) {
              console.log(`Starting migration of ${legacyProfiles.length} profiles...`);
              
              for (const [index, profile] of legacyProfiles.entries()) {
                const batchNumber = index + 1;
                const success = await migrateProfileData(profile.id, batchNumber);
                if (success) {
                  migratedProfiles++;
                } else {
                  skippedProfiles++;
                }
              }
            }
          }

          // Migrate payment methods
          if (entity_type === 'all' || entity_type === 'payment_methods') {
            const { data: legacyPaymentMethods, error: paymentError } = await supabase
              .from('payment_methods')
              .select('id')
              .eq('encryption_version', 1)
              .limit(batch_size);

            if (paymentError) {
              errors.push(`Payment method query error: ${paymentError.message}`);
            } else if (legacyPaymentMethods && legacyPaymentMethods.length > 0) {
              console.log(`Starting migration of ${legacyPaymentMethods.length} payment methods...`);
              
              for (const [index, paymentMethod] of legacyPaymentMethods.entries()) {
                const batchNumber = index + 1;
                const success = await migratePaymentMethodData(paymentMethod.id, batchNumber);
                if (success) {
                  migratedPaymentMethods++;
                } else {
                  skippedPaymentMethods++;
                }
              }
            }
          }

          const totalTime = Date.now() - startTime;

          const result: MigrationResult = {
            success: errors.length === 0,
            migratedProfiles,
            migratedPaymentMethods,
            skippedProfiles,
            skippedPaymentMethods,
            errors,
            totalTime
          };

          await logMigrationAudit('batch_complete', true, 'batch', undefined, 
            `Migrated ${migratedProfiles} profiles, ${migratedPaymentMethods} payment methods`);

          return new Response(
            JSON.stringify(result),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          await logMigrationAudit('batch_complete', false, 'batch', undefined, error.message);
          console.error('Error during migration:', error);
          return new Response(
            JSON.stringify({ error: 'Migration failed', details: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      default:
        return new Response(
          JSON.stringify({
            error: 'Not found',
            availableEndpoints: ['status', 'migrate', 'health']
          }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

  } catch (error) {
    console.error('Migration service error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
