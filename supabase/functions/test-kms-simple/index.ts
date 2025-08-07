import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { KMSClient, GenerateDataKeyCommand } from "https://esm.sh/@aws-sdk/client-kms@3.454.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("🔐 Testing KMS environment and functionality...");
    
    // Check environment variables
    const envCheck = {
      AWS_REGION: Deno.env.get('AWS_REGION') || 'NOT_SET',
      AWS_ACCESS_KEY_ID: Deno.env.get('AWS_ACCESS_KEY_ID') ? 'SET' : 'NOT_SET',
      AWS_SECRET_ACCESS_KEY: Deno.env.get('AWS_SECRET_ACCESS_KEY') ? 'SET' : 'NOT_SET',
      AWS_KMS_PII_KEY_ID: Deno.env.get('AWS_KMS_PII_KEY_ID') || 'NOT_SET',
      AWS_KMS_PAYMENT_KEY_ID: Deno.env.get('AWS_KMS_PAYMENT_KEY_ID') || 'NOT_SET',
    };
    
    console.log("Environment variables:", envCheck);
    
    // Try actual KMS operation
    const region = Deno.env.get('AWS_REGION') || 'us-east-1';
    const accessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
    const piiKeyId = Deno.env.get('AWS_KMS_PII_KEY_ID');
    
    if (!accessKeyId || !secretAccessKey || !piiKeyId) {
      throw new Error('Missing required AWS credentials or KMS key ID');
    }
    
    console.log('Creating KMS client...');
    const kmsClient = new KMSClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    
    console.log('Testing KMS GenerateDataKey operation...');
    const command = new GenerateDataKeyCommand({
      KeyId: piiKeyId,
      KeySpec: 'AES_256',
    });
    
    const result = await kmsClient.send(command);
    console.log('KMS operation successful!');
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "KMS test completed successfully!",
        environment: envCheck,
        kmsTest: {
          keyId: result.KeyId,
          hasPlaintext: !!result.Plaintext,
          hasCiphertext: !!result.CiphertextBlob
        },
        timestamp: new Date().toISOString()
      }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Simple KMS test error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 500
      }
    );
  }
});
