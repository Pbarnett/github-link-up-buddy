/**
 * KMS Operations Edge Function
 * 
 * Centralized service for encryption/decryption operations using AWS KMS.
 * This function provides secure endpoints for encrypting and decrypting sensitive data.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { 
  getKMSManager, 
  serializeEncryptionResult, 
  deserializeEncryptionResult,
  createKMSAuditEvent,
  type KMSAuditEvent 
} from "../_shared/kms.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing Supabase environment variables');
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

interface EncryptRequest {
  plaintext: string;
  context?: string; // Optional context for audit logging
}

interface DecryptRequest {
  encryptedData: string;
  context?: string; // Optional context for audit logging
}

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  details: string;
  timestamp: string;
  kmsKeyId: string;
}

// Helper function to get client info from request
function getClientInfo(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIP || req.headers.get('cf-connecting-ip') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  return { ip_address: ip, user_agent: userAgent };
}

// Helper function to log KMS audit events
async function logKMSAuditEvent(auditEvent: KMSAuditEvent) {
  try {
    const { error } = await supabase
      .from('kms_audit_log')
      .insert({
        operation: auditEvent.operation,
        key_id: auditEvent.keyId,
        success: auditEvent.success,
        error_message: auditEvent.errorMessage,
        user_id: auditEvent.userId,
        ip_address: auditEvent.ipAddress,
        timestamp: auditEvent.timestamp,
      });
    
    if (error) {
      console.error('Failed to log KMS audit event:', error);
    }
  } catch (err) {
    console.error('Exception logging KMS audit event:', err);
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication - require valid Supabase JWT
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
    const path = url.pathname.split('/').filter(Boolean).pop(); // Get the last path segment
    const kmsManager = getKMSManager();
    const metadata = kmsManager.getEncryptionMetadata();

    switch (path) {
      case 'encrypt': {
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const body: EncryptRequest = await req.json();
        
        if (!body.plaintext) {
          return new Response(
            JSON.stringify({ error: 'Missing plaintext data' }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        try {
          const encryptionResult = await kmsManager.encryptData(body.plaintext);
          const serializedResult = serializeEncryptionResult(encryptionResult);

          // Log successful encryption
          const auditEvent = createKMSAuditEvent(
            'encrypt',
            metadata.keyId,
            true,
            undefined,
            user.id,
            clientInfo.ip_address
          );
          await logKMSAuditEvent(auditEvent);

          return new Response(
            JSON.stringify({ 
              encryptedData: serializedResult,
              version: metadata.version 
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          // Log failed encryption
          const auditEvent = createKMSAuditEvent(
            'encrypt',
            metadata.keyId,
            false,
            error.message,
            user.id,
            clientInfo.ip_address
          );
          await logKMSAuditEvent(auditEvent);

          console.error('Encryption failed:', error);
          return new Response(
            JSON.stringify({ error: 'Encryption failed' }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'decrypt': {
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const body: DecryptRequest = await req.json();
        
        if (!body.encryptedData) {
          return new Response(
            JSON.stringify({ error: 'Missing encrypted data' }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        try {
          const decryptionInput = deserializeEncryptionResult(body.encryptedData);
          const plaintext = await kmsManager.decryptData(decryptionInput);

          // Log successful decryption
          const auditEvent = createKMSAuditEvent(
            'decrypt',
            decryptionInput.keyId,
            true,
            undefined,
            user.id,
            clientInfo.ip_address
          );
          await logKMSAuditEvent(auditEvent);

          return new Response(
            JSON.stringify({ plaintext }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          // Log failed decryption
          const auditEvent = createKMSAuditEvent(
            'decrypt',
            metadata.keyId, // Use current key ID if deserialization failed
            false,
            error.message,
            user.id,
            clientInfo.ip_address
          );
          await logKMSAuditEvent(auditEvent);

          console.error('Decryption failed:', error);
          return new Response(
            JSON.stringify({ error: 'Decryption failed' }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'health': {
        if (req.method !== 'GET') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        try {
          const healthStatus = await kmsManager.healthCheck();
          
          // Log health check
          const auditEvent = createKMSAuditEvent(
            'health_check',
            metadata.keyId,
            healthStatus.status === 'healthy',
            healthStatus.status === 'unhealthy' ? healthStatus.details : undefined,
            user.id,
            clientInfo.ip_address
          );
          await logKMSAuditEvent(auditEvent);

          const response: HealthCheckResponse = {
            status: healthStatus.status,
            details: healthStatus.details,
            timestamp: new Date().toISOString(),
            kmsKeyId: metadata.keyId,
          };

          const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
          
          return new Response(
            JSON.stringify(response),
            { status: statusCode, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );

        } catch (error) {
          console.error('Health check failed:', error);
          return new Response(
            JSON.stringify({ 
              status: 'unhealthy', 
              details: 'Health check exception',
              timestamp: new Date().toISOString(),
              kmsKeyId: metadata.keyId,
            }),
            { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'metadata': {
        if (req.method !== 'GET') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Return encryption metadata (no sensitive information)
        return new Response(
          JSON.stringify({
            algorithm: metadata.algorithm,
            version: metadata.version,
            // Don't return the actual keyId for security
            keyIdHash: await crypto.subtle.digest('SHA-256', new TextEncoder().encode(metadata.keyId))
              .then(buffer => Array.from(new Uint8Array(buffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('')
                .substring(0, 16) // Only first 16 chars for identification
              ),
            timestamp: new Date().toISOString(),
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ 
            error: 'Not found',
            availableEndpoints: ['encrypt', 'decrypt', 'health', 'metadata']
          }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

  } catch (error) {
    console.error('KMS operations error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
