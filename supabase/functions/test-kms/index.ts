import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { KMSClient, GenerateDataKeyCommand, DecryptCommand } from "https://esm.sh/@aws-sdk/client-kms@3.454.0";

// Simple KMS utility functions for testing
async function testKMSConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    const region = Deno.env.get('AWS_REGION') || 'us-east-1';
    const accessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
    const piiKeyId = Deno.env.get('AWS_KMS_PII_KEY_ID');
    
    if (!accessKeyId || !secretAccessKey || !piiKeyId) {
      return {
        success: false,
        message: 'Missing required AWS credentials or KMS key ID'
      };
    }
    
    const kmsClient = new KMSClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    
    // Test generating a data key
    const command = new GenerateDataKeyCommand({
      KeyId: piiKeyId,
      KeySpec: 'AES_256',
    });
    
    const result = await kmsClient.send(command);
    
    if (!result.Plaintext || !result.CiphertextBlob) {
      return {
        success: false,
        message: 'KMS GenerateDataKey returned incomplete result'
      };
    }
    
    // Test decrypting the data key
    const decryptCommand = new DecryptCommand({
      CiphertextBlob: result.CiphertextBlob,
    });
    
    const decryptResult = await kmsClient.send(decryptCommand);
    
    if (!decryptResult.Plaintext) {
      return {
        success: false,
        message: 'KMS DecryptCommand failed'
      };
    }
    
    return {
      success: true,
      message: 'KMS connection and operations successful',
      details: {
        keyId: result.KeyId,
        encryptionSuccessful: !!result.Plaintext,
        decryptionSuccessful: !!decryptResult.Plaintext
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: `KMS test failed: ${error.message}`,
      details: {
        error: error.name,
        stack: error.stack
      }
    };
  }
}

function validateKMSConfig(): boolean {
  const region = Deno.env.get('AWS_REGION');
  const accessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
  const secretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
  const piiKeyId = Deno.env.get('AWS_KMS_PII_KEY_ID');
  const paymentKeyId = Deno.env.get('AWS_KMS_PAYMENT_KEY_ID');
  
  return !!(region && accessKeyId && secretAccessKey && piiKeyId && paymentKeyId);
}

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
    console.log("🔐 Testing KMS functionality...");
    
    // Validate KMS configuration
    const configValid = validateKMSConfig();
    console.log("KMS Configuration Valid:", configValid);
    
    if (!configValid) {
      throw new Error("KMS configuration is invalid. Check environment variables.");
    }
    
    // Test basic KMS functionality
    const basicTest = await testKMSConnection();
    console.log("Basic KMS Test:", basicTest.success ? "✅ PASS" : "❌ FAIL");
    
    const testResults = {
      configValid,
      basicTestPassed: basicTest.success,
      basicTestDetails: basicTest,
      tests: {
        kmsConnection: {
          success: basicTest.success,
          message: basicTest.message,
          details: basicTest.details
        }
      } as Record<string, { success: boolean; message?: string; details?: any; error?: string }>
    };
    
    // Environment check
    testResults.tests.environment = {
      success: configValid,
      details: {
        AWS_REGION: Deno.env.get('AWS_REGION') || 'NOT_SET',
        AWS_ACCESS_KEY_ID: Deno.env.get('AWS_ACCESS_KEY_ID') ? 'SET' : 'NOT_SET',
        AWS_SECRET_ACCESS_KEY: Deno.env.get('AWS_SECRET_ACCESS_KEY') ? 'SET' : 'NOT_SET',
        AWS_KMS_PII_KEY_ID: Deno.env.get('AWS_KMS_PII_KEY_ID') || 'NOT_SET',
        AWS_KMS_PAYMENT_KEY_ID: Deno.env.get('AWS_KMS_PAYMENT_KEY_ID') || 'NOT_SET'
      }
    };
    
    // Overall success check
    const allTestsPassed = Object.values(testResults.tests).every((test) => test.success);
    
    return new Response(
      JSON.stringify({
        success: allTestsPassed,
        message: allTestsPassed 
          ? "🎉 All KMS tests passed successfully!" 
          : "❌ Some KMS tests failed",
        timestamp: new Date().toISOString(),
        ...testResults
      }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: allTestsPassed ? 200 : 500
      }
    );
    
  } catch (error) {
    console.error("KMS test error:", error);
    
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
