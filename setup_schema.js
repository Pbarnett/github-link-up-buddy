import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const supabaseUrl = 'https://bbonngdyfyfjqfhvoljl.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupSchema() {
  console.log('Setting up database schema...');
  
  try {
    // Create customer lifecycle audit table
    const { error: auditError } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS customer_lifecycle_audit (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            customer_id TEXT NOT NULL,
            user_id UUID,
            action TEXT NOT NULL CHECK (action IN ('identified_inactive', 'anonymized', 'deleted', 'retained')),
            reason TEXT NOT NULL,
            metadata JSONB DEFAULT '{}',
            performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_audit_customer_id ON customer_lifecycle_audit(customer_id);
        CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_audit_action ON customer_lifecycle_audit(action);
        CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_audit_performed_at ON customer_lifecycle_audit(performed_at);
        
        ALTER TABLE customer_lifecycle_audit ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Service role can manage lifecycle audit" ON customer_lifecycle_audit;
        CREATE POLICY "Service role can manage lifecycle audit" ON customer_lifecycle_audit
            FOR ALL USING (
                (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
            );
      `
    });

    if (auditError) {
      console.error('Error creating audit table:', auditError);
    } else {
      console.log('✅ Customer lifecycle audit table created successfully');
    }

    // Add columns to stripe_customers if it exists
    const { error: customerError } = await supabase.rpc('sql', {
      query: `
        DO $$
        BEGIN
            IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'stripe_customers') THEN
                ALTER TABLE stripe_customers 
                ADD COLUMN IF NOT EXISTS last_payment_at TIMESTAMPTZ,
                ADD COLUMN IF NOT EXISTS anonymized_at TIMESTAMPTZ,
                ADD COLUMN IF NOT EXISTS anonymization_reason TEXT;
                
                CREATE INDEX IF NOT EXISTS idx_stripe_customers_last_payment_at ON stripe_customers(last_payment_at);
            END IF;
        END
        $$;
      `
    });

    if (customerError) {
      console.error('Error updating stripe_customers table:', customerError);
    } else {
      console.log('✅ Stripe customers table updated successfully');
    }

    console.log('Schema setup completed!');
    
  } catch (error) {
    console.error('Error setting up schema:', error);
  }
}

setupSchema();
