/**
 * Fetch-Based KMS Test
 * Uses direct AWS API calls with fetch instead of AWS SDK
 * AWS AI bot recommended approach for Edge Functions
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// AWS Signature V4 implementation simplified for KMS
async function signAWSRequest(method: string, url: string, headers: Record<string, string>, body: string, credentials: { accessKeyId: string; secretAccessKey: string }, region: string) {
  // This is a simplified implementation - in production you'd use a proper AWS v4 signing library
  // For now, let's test if the basic approach works without signature
  return headers;
}

serve(async (req: Request) => {
  const results = {
    timestamp: new Date().toISOString(),
    steps: [],
    success: false
  };

  try {
    results.steps.push("Starting fetch-based KMS test");
    
    // Get credentials
    const region = Deno.env.get('AWS_REGION') || 'us-east-1';
    const accessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
    const keyAlias = Deno.env.get('KMS_GENERAL_ALIAS');

    if (!accessKeyId || !secretAccessKey || !keyAlias) {
      throw new Error('Missing credentials or key alias');
    }

    results.steps.push(`Region: ${region}, Key: ${keyAlias}`);
    results.steps.push(`Credentials: ${accessKeyId ? 'SET' : 'MISSING'}, ${secretAccessKey ? 'SET' : 'MISSING'}`);

    // Prepare the request
    const endpoint = `https://kms.${region}.amazonaws.com/`;
    const testData = "Hello, KMS via fetch!";
    const encodedData = btoa(testData);
    
    const requestBody = JSON.stringify({
      KeyId: keyAlias,
      Plaintext: encodedData
    });

    results.steps.push("Preparing AWS API request...");
    
    const headers = {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'TrentService.Encrypt',
      'Host': `kms.${region}.amazonaws.com`,
    };

    results.steps.push("Attempting direct AWS API call...");
    
    // For this test, let's see if we can reach the endpoint
    // Note: This will fail due to missing AWS signature, but it tests connectivity
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: requestBody
    });

    const responseText = await response.text();
    results.steps.push(`Response status: ${response.status}`);
    results.steps.push(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers))}`);
    results.steps.push(`Response body: ${responseText.substring(0, 200)}...`);

    // We expect this to fail with authentication error (which means connectivity works)
    if (response.status === 400 || response.status === 403) {
      results.steps.push("✓ AWS endpoint reachable (authentication expected to fail without signature)");
      results.success = true; // Success in terms of connectivity
    } else {
      results.steps.push(`Unexpected status: ${response.status}`);
    }

    return new Response(JSON.stringify(results, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    results.steps.push(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    results.error = {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
    };

    return new Response(JSON.stringify(results, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
