import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { 
  testKMS, 
  validateKMSConfig, 
  encryptData, 
  decryptData,
  encryptPII,
  decryptPII,
  encryptPaymentData,
  decryptPaymentData,
  encryptUserProfile,
  decryptUserProfile
} from "../_shared/kms.ts";

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
    const basicTestPassed = await testKMS();
    console.log("Basic KMS Test:", basicTestPassed ? "✅ PASS" : "❌ FAIL");
    
    if (!basicTestPassed) {
      throw new Error("Basic KMS test failed");
    }
    
    // Test different encryption types
    const testResults = {
      configValid,
      basicTestPassed,
      tests: {} as Record<string, { success: boolean; original?: unknown; encrypted?: string; decrypted?: unknown; error?: string }>
    };
    
    // Test general encryption
    try {
      const testData = "General test data";
      const encrypted = await encryptData(testData, "GENERAL");
      const decrypted = await decryptData(encrypted);
      testResults.tests.general = {
        success: decrypted === testData,
        original: testData,
        encrypted: encrypted.substring(0, 50) + "...",
        decrypted
      };
    } catch (error) {
      testResults.tests.general = { success: false, error: error.message };
    }
    
    // Test PII encryption
    try {
      const piiData = "john.doe@example.com";
      const encryptedPII = await encryptPII(piiData);
      const decryptedPII = await decryptPII(encryptedPII);
      testResults.tests.pii = {
        success: decryptedPII === piiData,
        original: piiData,
        encrypted: encryptedPII.substring(0, 50) + "...",
        decrypted: decryptedPII
      };
    } catch (error) {
      testResults.tests.pii = { success: false, error: error.message };
    }
    
    // Test payment data encryption
    try {
      const paymentData = { cardLast4: "1234", exp: "12/26" };
      const encryptedPayment = await encryptPaymentData(paymentData);
      const decryptedPayment = await decryptPaymentData(encryptedPayment, true);
      testResults.tests.payment = {
        success: JSON.stringify(decryptedPayment) === JSON.stringify(paymentData),
        original: paymentData,
        encrypted: encryptedPayment.substring(0, 50) + "...",
        decrypted: decryptedPayment
      };
    } catch (error) {
      testResults.tests.payment = { success: false, error: error.message };
    }
    
    // Test user profile encryption
    try {
      const profileData = {
        email: "test@example.com",
        phone: "+1234567890",
        name: "Test User",
        preferences: { notifications: true },
        settings: { theme: "dark" }
      };
      
      const encryptedProfile = await encryptUserProfile(profileData);
      const decryptedProfile = await decryptUserProfile(encryptedProfile);
      
      testResults.tests.userProfile = {
        success: JSON.stringify(decryptedProfile) === JSON.stringify(profileData),
        original: profileData,
        encrypted: Object.keys(encryptedProfile).reduce((acc, key) => {
          acc[key] = encryptedProfile[key].substring(0, 30) + "...";
          return acc;
        }, {} as Record<string, string>),
        decrypted: decryptedProfile
      };
    } catch (error) {
      testResults.tests.userProfile = { success: false, error: error.message };
    }
    
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
