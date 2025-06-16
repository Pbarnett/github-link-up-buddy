// Verify RLS status for the fixed tables

const PRODUCTION_SUPABASE_URL = 'https://bbonngdyfyfjqfhvoljl.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib25uZ2R5ZnlmanFmaHZvbGpsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI1MTk1NCwiZXhwIjoyMDYyODI3OTU0fQ.zrhXOjjMK2pX154UeLiKM8-iRvuVzVA8cGne8LTVrqE';

async function verifyRLSStatus() {
  console.log('🔍 Verifying RLS status for booking_attempts and payments tables...');
  
  try {
    // Check if tables have RLS enabled
    const rlsCheckResponse = await fetch(`${PRODUCTION_SUPABASE_URL}/rest/v1/rpc/sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `SELECT schemaname, tablename, rowsecurity as rls_enabled FROM pg_tables WHERE tablename IN ('booking_attempts', 'payments') AND schemaname = 'public' ORDER BY tablename;`
      })
    });
    
    if (rlsCheckResponse.ok) {
      const rlsData = await rlsCheckResponse.json();
      console.log('\n📊 RLS Status:');
      rlsData.forEach(row => {
        const status = row.rls_enabled ? '✅ ENABLED' : '❌ DISABLED';
        console.log(`   ${row.tablename}: ${status}`);
      });
    } else {
      console.log('\n⚠️  Could not check RLS status via API');
    }
    
    // Check policies
    const policiesResponse = await fetch(`${PRODUCTION_SUPABASE_URL}/rest/v1/rpc/sql`, {
      method: 'POST', 
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `SELECT schemaname, tablename, policyname, cmd FROM pg_policies WHERE tablename IN ('booking_attempts', 'payments') AND schemaname = 'public' ORDER BY tablename, policyname;`
      })
    });
    
    if (policiesResponse.ok) {
      const policiesData = await policiesResponse.json();
      console.log('\n🛡️  Security Policies:');
      if (policiesData.length === 0) {
        console.log('   ⚠️  No policies found');
      } else {
        policiesData.forEach(policy => {
          console.log(`   ${policy.tablename}: ${policy.policyname} (${policy.cmd})`);
        });
      }
    } else {
      console.log('\n⚠️  Could not check policies via API');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyRLSStatus();

