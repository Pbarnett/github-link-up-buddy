import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { KMSClient, EncryptCommand, DecryptCommand, DescribeKeyCommand } from "https://esm.sh/@aws-sdk/client-kms@3.454.0";

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
};

interface TestResult {
  testName: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  duration: number;
  details: Record<string, unknown> | null;
  error?: string;
  critical: boolean;
}

async function runTest(testName: string, testFn: () => Promise<Record<string, unknown>>, critical = true): Promise<TestResult> {
  const startTime = Date.now();
  try {
    const result = await testFn();
    const duration = Date.now() - startTime;
    return {
      testName,
      status: 'PASS',
      duration,
      details: result,
      critical
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      testName,
      status: 'FAIL',
      duration,
      details: null,
      error: error.message,
      critical
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("🧪 PRODUCTION KMS VALIDATION SUITE");
    console.log("==================================");
    
    const testResults: TestResult[] = [];
    const startTime = Date.now();
    
    // Critical Test 1: Environment Configuration
    testResults.push(await runTest("Environment Configuration", async () => {
      const awsRegion = Deno.env.get("AWS_REGION")?.trim();
      const awsAccessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID")?.trim();
      const awsSecretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY")?.trim();
      const generalKeyId = Deno.env.get("KMS_GENERAL_KEY_ID")?.trim();
      const piiKeyId = Deno.env.get("KMS_PII_KEY_ID")?.trim();
      const paymentKeyId = Deno.env.get("KMS_PAYMENT_KEY_ID")?.trim();
      
      const allConfigured = !!(awsRegion && awsAccessKeyId && awsSecretAccessKey && generalKeyId && piiKeyId && paymentKeyId);
      
      if (!allConfigured) {
        throw new Error("Missing critical environment variables");
      }
      
      return {
        region: awsRegion,
        credentialsConfigured: true,
        keysConfigured: 3,
        generalKey: generalKeyId.substring(0, 8) + "...",
        piiKey: piiKeyId.substring(0, 8) + "...",
        paymentKey: paymentKeyId.substring(0, 8) + "..."
      };
    }, true));
    
    // Critical Test 2: AWS KMS Connectivity
    let kmsClient: KMSClient | null = null;
    testResults.push(await runTest("AWS KMS Connectivity", async () => {
      const awsRegion = Deno.env.get("AWS_REGION")?.trim();
      const awsAccessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID")?.trim();
      const awsSecretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY")?.trim();
      const generalKeyId = Deno.env.get("KMS_GENERAL_KEY_ID")?.trim();
      
      kmsClient = new KMSClient({
        region: awsRegion,
        credentials: {
          accessKeyId: awsAccessKeyId!,
          secretAccessKey: awsSecretAccessKey!,
        },
      });
      
      const describeCommand = new DescribeKeyCommand({ KeyId: generalKeyId });
      const keyInfo = await kmsClient.send(describeCommand);
      
      if (keyInfo.KeyMetadata?.KeyState !== 'Enabled') {
        throw new Error(`Key state is ${keyInfo.KeyMetadata?.KeyState}, expected Enabled`);
      }
      
      return {
        keyId: keyInfo.KeyMetadata?.KeyId?.substring(0, 8) + "...",
        keyState: keyInfo.KeyMetadata?.KeyState,
        keyUsage: keyInfo.KeyMetadata?.KeyUsage,
        creationDate: keyInfo.KeyMetadata?.CreationDate,
        region: awsRegion
      };
    }, true));
    
    // Critical Test 3: Basic Encryption/Decryption with All Keys
    const keyTypes = [
      { name: "General", envKey: "KMS_GENERAL_KEY_ID", testData: "General sensitive data test" },
      { name: "PII", envKey: "KMS_PII_KEY_ID", testData: "john.doe@example.com" },
      { name: "Payment", envKey: "KMS_PAYMENT_KEY_ID", testData: "4111-1111-1111-1111" }
    ];
    
    for (const keyType of keyTypes) {
      testResults.push(await runTest(`${keyType.name} Key Encryption`, async () => {
        if (!kmsClient) throw new Error("KMS client not initialized");
        
        const keyId = Deno.env.get(keyType.envKey)?.trim();
        if (!keyId) throw new Error(`Missing ${keyType.envKey}`);
        
        const dataToEncrypt = new TextEncoder().encode(keyType.testData);
        
        // Encrypt
        const encryptCommand = new EncryptCommand({
          KeyId: keyId,
          Plaintext: dataToEncrypt,
        });
        const encryptResponse = await kmsClient.send(encryptCommand);
        
        // Decrypt
        const decryptCommand = new DecryptCommand({
          CiphertextBlob: encryptResponse.CiphertextBlob,
        });
        const decryptResponse = await kmsClient.send(decryptCommand);
        const decryptedText = new TextDecoder().decode(decryptResponse.Plaintext);
        
        if (decryptedText !== keyType.testData) {
          throw new Error(`Decryption mismatch: expected "${keyType.testData}", got "${decryptedText}"`);
        }
        
        return {
          keyType: keyType.name,
          original: keyType.testData,
          decrypted: decryptedText,
          encryptedSize: encryptResponse.CiphertextBlob?.length || 0,
          keyUsed: decryptResponse.KeyId?.substring(0, 8) + "...",
          success: true
        };
      }, true));
    }
    
    // Critical Test 4: Database Audit Logging
    testResults.push(await runTest("Audit Logging Functionality", async () => {
      const testAuditData = {
        operation: 'encrypt' as const,
        key_id: Deno.env.get("KMS_GENERAL_KEY_ID")?.trim(),
        success: true,
        user_id: null,
        ip_address: '127.0.0.1'
      };
      
      // Insert audit log
      const { data: insertData, error: insertError } = await supabase
        .from('kms_audit_log')
        .insert(testAuditData)
        .select();
      
      if (insertError) throw new Error(`Audit insert failed: ${insertError.message}`);
      
      // Query recent logs
      const { data: queryData, error: queryError } = await supabase
        .from('kms_audit_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(5);
      
      if (queryError) throw new Error(`Audit query failed: ${queryError.message}`);
      
      return {
        insertedRecord: insertData?.[0]?.id,
        recentLogCount: queryData?.length || 0,
        latestOperation: queryData?.[0]?.operation,
        auditTableWorking: true
      };
    }, true));
    
    // Critical Test 5: Performance Validation
    testResults.push(await runTest("Performance Validation", async () => {
      if (!kmsClient) throw new Error("KMS client not initialized");
      
      const keyId = Deno.env.get("KMS_GENERAL_KEY_ID")?.trim();
      const testData = new TextEncoder().encode("Performance test data");
      const iterations = 5;
      const times: number[] = [];
      
      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        
        const encryptCmd = new EncryptCommand({
          KeyId: keyId,
          Plaintext: testData,
        });
        const encryptResp = await kmsClient.send(encryptCmd);
        
        const decryptCmd = new DecryptCommand({
          CiphertextBlob: encryptResp.CiphertextBlob,
        });
        await kmsClient.send(decryptCmd);
        
        times.push(Date.now() - start);
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const maxTime = Math.max(...times);
      
      // Fail if average time exceeds 3 seconds or max time exceeds 5 seconds
      if (avgTime > 3000 || maxTime > 5000) {
        throw new Error(`Performance too slow: avg=${avgTime}ms, max=${maxTime}ms`);
      }
      
      return {
        iterations,
        averageTime: Math.round(avgTime),
        maxTime,
        minTime: Math.min(...times),
        performanceGrade: avgTime < 1000 ? 'A' : avgTime < 2000 ? 'B' : 'C',
        times
      };
    }, true));
    
    // Test 6: Error Handling (Non-critical)
    testResults.push(await runTest("Error Handling", async () => {
      if (!kmsClient) throw new Error("KMS client not initialized");
      
      const tests = [];
      
      // Test 1: Invalid ciphertext
      try {
        const invalidDecrypt = new DecryptCommand({
          CiphertextBlob: new Uint8Array([1, 2, 3, 4, 5])
        });
        await kmsClient.send(invalidDecrypt);
        tests.push({ test: "invalid_ciphertext", result: "FAIL - should have thrown" });
      } catch {
        tests.push({ test: "invalid_ciphertext", result: "PASS - correctly threw error" });
      }
      
      // Test 2: Empty plaintext encryption
      try {
        const keyId = Deno.env.get("KMS_GENERAL_KEY_ID")?.trim();
        const emptyEncrypt = new EncryptCommand({
          KeyId: keyId,
          Plaintext: new Uint8Array([]),
        });
        await kmsClient.send(emptyEncrypt);
        tests.push({ test: "empty_plaintext", result: "PASS - handled empty data" });
      } catch {
        tests.push({ test: "empty_plaintext", result: "EXPECTED - empty data rejected" });
      }
      
      return { errorTests: tests };
    }, false));
    
    // Calculate results
    const totalTime = Date.now() - startTime;
    const criticalTests = testResults.filter(t => t.critical);
    const criticalPassed = criticalTests.filter(t => t.status === 'PASS').length;
    const totalPassed = testResults.filter(t => t.status === 'PASS').length;
    
    const productionReady = criticalPassed === criticalTests.length;
    
    return new Response(
      JSON.stringify({
        success: productionReady,
        productionReady,
        message: productionReady 
          ? `🚀 PRODUCTION READY: All ${criticalPassed}/${criticalTests.length} critical tests passed!`
          : `⚠️ NOT READY: Only ${criticalPassed}/${criticalTests.length} critical tests passed`,
        timestamp: new Date().toISOString(),
        summary: {
          totalTests: testResults.length,
          criticalTests: criticalTests.length,
          criticalPassed,
          totalPassed,
          totalTime: `${totalTime}ms`,
          productionReady
        },
        results: testResults,
        recommendation: productionReady 
          ? "✅ PROCEED TO PRODUCTION: All critical systems validated"
          : "❌ FIX ISSUES FIRST: Critical failures must be resolved"
      }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: productionReady ? 200 : 500
      }
    );
    
  } catch (error) {
    console.error("Production test error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        productionReady: false,
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
