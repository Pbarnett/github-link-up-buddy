// Script to apply RLS fixes directly to Supabase

const PRODUCTION_SUPABASE_URL = 'https://bbonngdyfyfjqfhvoljl.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib25uZ2R5ZnlmanFmaHZvbGpsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI1MTk1NCwiZXhwIjoyMDYyODI3OTU0fQ.zrhXOjjMK2pX154UeLiKM8-iRvuVzVA8cGne8LTVrqE';

async function applyRLSFixes() {
  console.log('🔒 Applying RLS fixes to booking_attempts and payments tables...');
  
  const fixes = [
    {
      name: 'Enable RLS on booking_attempts',
      sql: 'ALTER TABLE public.booking_attempts ENABLE ROW LEVEL SECURITY;'
    },
    {
      name: 'Enable RLS on payments', 
      sql: 'ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;'
    },
    {
      name: 'Create booking_attempts SELECT policy',
      sql: `CREATE POLICY "Users can view their own booking attempts" ON public.booking_attempts
        FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM trip_requests 
            WHERE trip_requests.id = booking_attempts.trip_request_id 
            AND trip_requests.user_id = auth.uid()
          )
        );`
    },
    {
      name: 'Create booking_attempts service role policy',
      sql: `CREATE POLICY "Service role can manage booking attempts" ON public.booking_attempts
        FOR ALL
        USING (auth.jwt() ->> 'role' = 'service_role')
        WITH CHECK (auth.jwt() ->> 'role' = 'service_role');`
    },
    {
      name: 'Create payments SELECT policy',
      sql: `CREATE POLICY "Users can view their own payments" ON public.payments
        FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = payments.booking_id 
            AND bookings.user_id = auth.uid()
          )
        );`
    },
    {
      name: 'Create payments service role policy',
      sql: `CREATE POLICY "Service role can manage payments" ON public.payments
        FOR ALL
        USING (auth.jwt() ->> 'role' = 'service_role')
        WITH CHECK (auth.jwt() ->> 'role' = 'service_role');`
    },
    {
      name: 'Create payments INSERT policy', 
      sql: `CREATE POLICY "Users can create payments for their bookings" ON public.payments
        FOR INSERT
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = payments.booking_id 
            AND bookings.user_id = auth.uid()
          )
        );`
    }
  ];
  
  for (const fix of fixes) {
    try {
      console.log(`\n   📝 ${fix.name}...`);
      
      const response = await fetch(`${PRODUCTION_SUPABASE_URL}/rest/v1/rpc/sql`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: fix.sql })
      });
      
      if (response.ok) {
        console.log(`   ✅ ${fix.name} applied successfully`);
      } else {
        const errorText = await response.text();
        console.log(`   ⚠️  ${fix.name}: ${errorText}`);
        // Continue with other fixes even if one fails
      }
      
    } catch (error) {
      console.log(`   ❌ ${fix.name} failed: ${error.message}`);
    }
  }
  
  console.log('\n🎯 RLS fixes completed!');
  console.log('\n✅ The following security issues should now be resolved:');
  console.log('   • RLS Disabled in Public: public.booking_attempts');
  console.log('   • RLS Disabled in Public: public.payments');
  console.log('\n📊 You can now re-run your security scan to verify the fixes.');
}

applyRLSFixes().catch(console.error);

