/**
 * Simple Direct KMS Encrypt Test
 * Direct test of KMS encrypt operation without complex wrappers
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req: Request) => {
  const results = {
    timestamp: new Date().toISOString(),
    steps: [],
    success: false
  };

  try {
    results.steps.push("Starting KMS encrypt test");
    
    // Import AWS SDK
    const { KMSClient, EncryptCommand } = await import("https://esm.sh/@aws-sdk/client-kms@3.454.0");
    results.steps.push("✓ AWS SDK imported");

    // Get credentials
    const region = Deno.env.get('AWS_REGION');
    const accessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
    const keyAlias = Deno.env.get('KMS_GENERAL_ALIAS');

    results.steps.push(`Region: ${region}, Key: ${keyAlias}`);
    results.steps.push(`Credentials: ${accessKeyId ? 'SET' : 'MISSING'}, ${secretAccessKey ? 'SET' : 'MISSING'}`);

    if (!accessKeyId || !secretAccessKey || !keyAlias) {
      throw new Error('Missing credentials or key alias');
    }

    // Create KMS client
    const kmsClient = new KMSClient({
      region: region || 'us-east-1',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    results.steps.push("✓ KMS client created");

    // Simple encrypt test
    const testData = "Hello, KMS!";
    const encoder = new TextEncoder();
    const encryptCommand = new EncryptCommand({
      KeyId: keyAlias,
      Plaintext: encoder.encode(testData),
    });

    results.steps.push("Attempting encrypt...");
    const encryptResult = await kmsClient.send(encryptCommand);
    results.steps.push("✓ Encrypt successful!");
    
    results.success = true;
    results.encryptResult = {
      keyId: encryptResult.KeyId,
      hasData: !!encryptResult.CiphertextBlob,
      dataLength: encryptResult.CiphertextBlob?.length,
    };

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
