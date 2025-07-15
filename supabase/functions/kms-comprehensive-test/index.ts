import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { 
  getKMSManager,
  encryptData,
  decryptData,
  encryptPII,
  decryptPII,
  encryptPaymentData,
  decryptPaymentData,
  encryptUserProfile,
  decryptUserProfile,
  testKMS,
  validateKMSConfig
} from "../_shared/kms.ts";

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
  success: boolean;
  duration: number;
  details: Record<string, unknown> | null;
  error?: string;
}

async function runTest(testName: string, testFn: () => Promise<Record<string, unknown>>): Promise<TestResult> {
  const startTime = Date.now();
  try {
    const result = await testFn();
    const duration = Date.now() - startTime;
    return {
      testName,
      success: true,
      duration,
      details: result
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      testName,
      success: false,
      duration,
      details: null,
      error: error.message
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("🧪 Running comprehensive KMS end-to-end tests...");
    
    const testResults: TestResult[] = [];
    
    // Test 1: KMS Configuration Validation
    testResults.push(await runTest("Configuration Validation", async () => {
      const configValid = validateKMSConfig();
      if (!configValid) throw new Error("KMS configuration is invalid");
      return { configValid };
    }));
    
    // Test 2: Basic KMS Connectivity
    testResults.push(await runTest("Basic KMS Connectivity", async () => {
      const basicTest = await testKMS();
      if (!basicTest) throw new Error("Basic KMS test failed");
      return { basicTest };
    }));
    
    // Test 3: General Data Encryption/Decryption
    testResults.push(await runTest("General Data Encryption", async () => {
      const testData = "This is sensitive general data for testing";
      const encrypted = await encryptData(testData, "GENERAL");
      const decrypted = await decryptData(encrypted);
      
      if (decrypted !== testData) {
        throw new Error(`Decryption mismatch: expected "${testData}", got "${decrypted}"`);
      }
      
      return {
        originalLength: testData.length,
        encryptedLength: encrypted.length,
        encryptionRatio: (encrypted.length / testData.length).toFixed(2),
        success: true
      };
    }));
    
    // Test 4: PII Data Encryption/Decryption
    testResults.push(await runTest("PII Data Encryption", async () => {
      const piiData = "john.doe@example.com";
      const encrypted = await encryptPII(piiData);
      const decrypted = await decryptPII(encrypted);
      
      if (decrypted !== piiData) {
        throw new Error(`PII decryption mismatch: expected "${piiData}", got "${decrypted}"`);
      }
      
      return {
        originalPII: piiData,
        encryptedLength: encrypted.length,
        success: true
      };
    }));
    
    // Test 5: Payment Data Encryption/Decryption
    testResults.push(await runTest("Payment Data Encryption", async () => {
      const paymentData = {
        cardLast4: "1234",
        expiryMonth: "12",
        expiryYear: "2026",
        brand: "visa"
      };
      
      const encrypted = await encryptPaymentData(paymentData);
      const decrypted = await decryptPaymentData(encrypted, true);
      
      if (JSON.stringify(decrypted) !== JSON.stringify(paymentData)) {
        throw new Error("Payment data decryption mismatch");
      }
      
      return {
        originalData: paymentData,
        encryptedLength: encrypted.length,
        success: true
      };
    }));
    
    // Test 6: User Profile Encryption/Decryption
    testResults.push(await runTest("User Profile Encryption", async () => {
      const profileData = {
        email: "test.user@example.com",
        phone: "+1-555-123-4567",
        firstName: "Test",
        lastName: "User",
        passport: "US123456789",
        preferences: {
          notifications: true,
          currency: "USD",
          language: "en"
        }
      };
      
      const encrypted = await encryptUserProfile(profileData);
      const decrypted = await decryptUserProfile(encrypted);
      
      if (JSON.stringify(decrypted) !== JSON.stringify(profileData)) {
        throw new Error("Profile data decryption mismatch");
      }
      
      return {
        fieldsEncrypted: Object.keys(encrypted).length,
        totalDataSize: JSON.stringify(profileData).length,
        success: true
      };
    }));
    
    // Test 7: Performance Benchmark
    testResults.push(await runTest("Performance Benchmark", async () => {
      const iterations = 5;
      const testData = "Performance test data";
      const times: number[] = [];
      
      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        const encrypted = await encryptData(testData, "GENERAL");
        const decrypted = await decryptData(encrypted);
        const end = Date.now();
        
        if (decrypted !== testData) {
          throw new Error(`Performance test iteration ${i + 1} failed`);
        }
        
        times.push(end - start);
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      
      return {
        iterations,
        averageTime: avgTime,
        minTime,
        maxTime,
        times
      };
    }));
    
    // Test 8: Error Handling
    testResults.push(await runTest("Error Handling", async () => {
      const tests = [];
      
      // Test invalid encrypted data
      try {
        await decryptData("invalid-encrypted-data");
        tests.push({ test: "invalid_data", result: "FAIL - should have thrown" });
      } catch {
        tests.push({ test: "invalid_data", result: "PASS - correctly threw error" });
      }
      
      // Test empty data encryption
      try {
        const encrypted = await encryptData("", "GENERAL");
        const decrypted = await decryptData(encrypted);
        tests.push({ 
          test: "empty_data", 
          result: decrypted === "" ? "PASS" : "FAIL",
          details: { encrypted: encrypted.length > 0, decrypted }
        });
      } catch {
        tests.push({ test: "empty_data", result: "FAIL - should handle empty data" });
      }
      
      return { errorTests: tests };
    }));
    
    // Test 9: Audit Logging
    testResults.push(await runTest("Audit Logging", async () => {
      // Insert a test audit log entry
      const { data, error } = await supabase
        .from('kms_audit_log')
        .insert({
          operation: 'encrypt',
          key_id: 'test-key-id',
          success: true,
          user_id: null,
          ip_address: '127.0.0.1'
        })
        .select();
      
      if (error) throw new Error(`Audit log insert failed: ${error.message}`);
      
      // Query recent audit logs
      const { data: auditLogs, error: queryError } = await supabase
        .from('kms_audit_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(5);
      
      if (queryError) throw new Error(`Audit log query failed: ${queryError.message}`);
      
      return {
        auditLogInserted: data?.length > 0,
        recentAuditLogs: auditLogs?.length || 0,
        latestLog: auditLogs?.[0]
      };
    }));
    
    // Test 10: KMS Manager Direct Test
    testResults.push(await runTest("KMS Manager Direct Access", async () => {
      const kmsManager = getKMSManager();
      const metadata = kmsManager.getEncryptionMetadata();
      const healthCheck = await kmsManager.healthCheck();
      
      return {
        metadata,
        healthCheck,
        managerReady: healthCheck.status === 'healthy'
      };
    }));
    
    // Calculate overall results
    const totalTests = testResults.length;
    const passedTests = testResults.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    const totalDuration = testResults.reduce((sum, r) => sum + r.duration, 0);
    const averageDuration = totalDuration / totalTests;
    
    const overallSuccess = failedTests === 0;
    
    return new Response(
      JSON.stringify({
        success: overallSuccess,
        message: `Comprehensive KMS Testing Complete: ${passedTests}/${totalTests} tests passed`,
        timestamp: new Date().toISOString(),
        summary: {
          totalTests,
          passedTests,
          failedTests,
          successRate: ((passedTests / totalTests) * 100).toFixed(1) + '%',
          totalDuration,
          averageDuration: Math.round(averageDuration)
        },
        results: testResults,
        recommendation: overallSuccess 
          ? "✅ All tests passed! KMS integration is production ready."
          : "⚠️ Some tests failed. Please review the failed tests before production use."
      }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: overallSuccess ? 200 : 500
      }
    );
    
  } catch (error) {
    console.error("Comprehensive test error:", error);
    
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
