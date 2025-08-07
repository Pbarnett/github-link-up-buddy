/**
 * Step-by-Step KMS Validation Test
 * Tests each component individually to isolate the issue
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req: Request) => {
  const results: any = {
    timestamp: new Date().toISOString(),
    steps: {}
  };

  try {
    // Step 1: Check environment variables
    results.steps.env_check = {
      AWS_REGION: Deno.env.get('AWS_REGION') || 'NOT_SET',
      AWS_ACCESS_KEY_ID: !!Deno.env.get('AWS_ACCESS_KEY_ID'),
      AWS_SECRET_ACCESS_KEY: !!Deno.env.get('AWS_SECRET_ACCESS_KEY'),
      KMS_GENERAL_ALIAS: Deno.env.get('KMS_GENERAL_ALIAS') || 'NOT_SET',
    };
    console.log('✓ Step 1: Environment variables checked');

    // Step 2: Import AWS SDK
    const { KMSClient } = await import("https://esm.sh/@aws-sdk/client-kms@3.454.0");
    results.steps.sdk_import = { status: 'success' };
    console.log('✓ Step 2: AWS SDK imported');

    // Step 3: Create KMS client
    const kmsClient = new KMSClient({
      region: Deno.env.get('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY')!,
      },
      maxAttempts: 3,
      requestTimeout: 30000,
    });
    results.steps.client_creation = { status: 'success' };
    console.log('✓ Step 3: KMS client created');

    // Step 4: Test validation functions import
    try {
      const { validateKMSConfig } = await import("../_shared/enhanced-kms.ts");
      results.steps.validation_import = { status: 'success' };
      console.log('✓ Step 4: Validation functions imported');
      
      // Step 5: Test validation function
      const configValid = validateKMSConfig();
      results.steps.validation_result = { 
        status: configValid ? 'valid' : 'invalid',
        result: configValid 
      };
      console.log(`✓ Step 5: Config validation: ${configValid}`);
      
    } catch (error) {
      results.steps.validation_import = { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
      console.error('✗ Step 4: Validation import failed:', error);
    }

    results.overall_status = 'success';
    return new Response(JSON.stringify(results, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Test failed:', error);
    results.overall_status = 'error';
    results.error = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    };
    
    return new Response(JSON.stringify(results, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
