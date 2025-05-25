
const SUPABASE_URL = "https://bbonngdyfyfjqfhvoljl.supabase.co";

/**
 * Test script to verify payment method synchronization between Supabase and Stripe
 * 
 * This script tests:
 * 1. Setting a payment method as default (should update both Stripe and database)
 * 2. Deleting a payment method (should detach from Stripe and remove from database)
 * 3. Error handling for invalid operations
 */

async function testPaymentMethodSync() {
  console.log("🧪 Testing Payment Method Synchronization...\n");

  // You'll need to get these from your browser's developer tools after logging in
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "your_access_token_here";
  
  if (ACCESS_TOKEN === "your_access_token_here") {
    console.log("❌ Please set ACCESS_TOKEN environment variable");
    console.log("   You can get this from your browser's developer tools after logging in");
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${ACCESS_TOKEN}`,
  };

  try {
    // Step 1: Get current payment methods
    console.log("📋 Fetching current payment methods...");
    const pmResponse = await fetch(`${SUPABASE_URL}/rest/v1/payment_methods?select=*`, {
      headers: {
        ...headers,
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib25uZ2R5ZnlmanFmaHZvbGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNTE5NTQsImV4cCI6MjA2MjgyNzk1NH0.qoXypUh-SemZwFjTyONGztNbhoowqLMiKSRKgA7fRR0"
      }
    });

    if (!pmResponse.ok) {
      throw new Error(`Failed to fetch payment methods: ${pmResponse.status}`);
    }

    const paymentMethods = await pmResponse.json();
    console.log(`✅ Found ${paymentMethods.length} payment methods`);

    if (paymentMethods.length === 0) {
      console.log("ℹ️  No payment methods found. Please add some payment methods first through the wallet page.");
      return;
    }

    // Display current payment methods
    paymentMethods.forEach((pm, index) => {
      console.log(`   ${index + 1}. ${pm.brand.toUpperCase()} •••• ${pm.last4} ${pm.is_default ? '(Default)' : ''}`);
    });

    // Step 2: Test setting default payment method
    const nonDefaultMethods = paymentMethods.filter(pm => !pm.is_default);
    
    if (nonDefaultMethods.length > 0) {
      const testMethod = nonDefaultMethods[0];
      console.log(`\n🎯 Testing set default payment method: ${testMethod.brand.toUpperCase()} •••• ${testMethod.last4}`);

      const setDefaultResponse = await fetch(
        `${SUPABASE_URL}/functions/v1/set-default-payment-method`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ id: testMethod.id }),
        }
      );

      if (setDefaultResponse.ok) {
        console.log("✅ Set default payment method - SUCCESS");
      } else {
        const error = await setDefaultResponse.text();
        console.log(`❌ Set default payment method - FAILED: ${error}`);
      }
    } else {
      console.log("\n⚠️  All payment methods are default, skipping set default test");
    }

    // Step 3: Test error handling (try to delete default payment method)
    const defaultMethod = paymentMethods.find(pm => pm.is_default);
    
    if (defaultMethod) {
      console.log(`\n🚫 Testing delete default payment method (should fail): ${defaultMethod.brand.toUpperCase()} •••• ${defaultMethod.last4}`);

      const deleteDefaultResponse = await fetch(
        `${SUPABASE_URL}/functions/v1/delete-payment-method`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ id: defaultMethod.id }),
        }
      );

      if (!deleteDefaultResponse.ok) {
        const error = await deleteDefaultResponse.text();
        console.log("✅ Delete default payment method correctly failed:", error);
      } else {
        console.log("❌ Delete default payment method should have failed but succeeded");
      }
    }

    // Step 4: Test deleting non-default payment method (if available)
    const nonDefaultForDelete = paymentMethods.filter(pm => !pm.is_default);
    
    if (nonDefaultForDelete.length > 0) {
      const methodToDelete = nonDefaultForDelete[0];
      console.log(`\n🗑️  Testing delete non-default payment method: ${methodToDelete.brand.toUpperCase()} •••• ${methodToDelete.last4}`);
      console.log("⚠️  WARNING: This will actually delete the payment method!");
      
      // Uncomment the next lines to actually test deletion
      /*
      const deleteResponse = await fetch(
        `${SUPABASE_URL}/functions/v1/delete-payment-method`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ id: methodToDelete.id }),
        }
      );

      if (deleteResponse.ok) {
        console.log("✅ Delete payment method - SUCCESS");
      } else {
        const error = await deleteResponse.text();
        console.log(`❌ Delete payment method - FAILED: ${error}`);
      }
      */
      console.log("ℹ️  Deletion test commented out to prevent accidental deletion");
    } else {
      console.log("\n⚠️  No non-default payment methods available for deletion test");
    }

    console.log("\n🎉 Payment method synchronization tests completed!");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
if (require.main === module) {
  testPaymentMethodSync();
}

module.exports = testPaymentMethodSync;
