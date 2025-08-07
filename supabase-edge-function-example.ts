// supabase/functions/encrypt-payment-data/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { KMSClient, EncryptCommand, DecryptCommand } from "https://esm.sh/@aws-sdk/client-kms@3.x.x";

// Configuration based on environment
const getKMSConfig = () => {
  return {
    region: Deno.env.get("AWS_REGION") || "us-east-1",
    credentials: {
      accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID")!,
      secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
    },
  };
};

// Environment-specific KMS key selection
const getKMSKeyId = () => {
  const environment = Deno.env.get("SUPABASE_ENV") || "development";
  
  const keyIds = {
    development: Deno.env.get("KMS_DEV_KEY_ID"),
    staging: Deno.env.get("KMS_STAGING_KEY_ID"),
    production: Deno.env.get("KMS_PROD_KEY_ID"),
  };
  
  return keyIds[environment] || keyIds.development;
};

// Initialize KMS client (reuse across function invocations)
const kmsClient = new KMSClient(getKMSConfig());
const keyId = getKMSKeyId();

interface EncryptRequest {
  data: string;
  context?: Record<string, string>;
}

interface DecryptRequest {
  encryptedData: string;
  context?: Record<string, string>;
}

serve(async (req) => {
  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    if (action === 'encrypt') {
      return await handleEncrypt(req);
    } else if (action === 'decrypt') {
      return await handleDecrypt(req);
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleEncrypt(req: Request): Promise<Response> {
  const { data, context }: EncryptRequest = await req.json();
  
  if (!data) {
    return new Response(
      JSON.stringify({ error: 'Data is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const command = new EncryptCommand({
      KeyId: keyId,
      Plaintext: new TextEncoder().encode(data),
      EncryptionContext: context,
    });

    const result = await kmsClient.send(command);
    const encryptedData = Array.from(new Uint8Array(result.CiphertextBlob!));
    
    return new Response(
      JSON.stringify({ 
        success: true,
        encryptedData: btoa(String.fromCharCode(...encryptedData)),
        keyId: result.KeyId,
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  } catch (error) {
    console.error('Encryption error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Encryption failed',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function handleDecrypt(req: Request): Promise<Response> {
  const { encryptedData, context }: DecryptRequest = await req.json();
  
  if (!encryptedData) {
    return new Response(
      JSON.stringify({ error: 'Encrypted data is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Convert base64 back to Uint8Array
    const binaryString = atob(encryptedData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const command = new DecryptCommand({
      CiphertextBlob: bytes,
      EncryptionContext: context,
    });

    const result = await kmsClient.send(command);
    const decryptedData = new TextDecoder().decode(result.Plaintext!);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        data: decryptedData,
        keyId: result.KeyId,
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  } catch (error) {
    console.error('Decryption error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Decryption failed',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
