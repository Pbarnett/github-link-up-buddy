/**
 * Apply migration to remote database
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const migrationSQL = `
-- Check if tables exist first
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'form_configurations'
);
`;

async function testConnection() {
  try {
    console.log('Testing connection to Supabase...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error('Connection test failed:', error);
      return false;
    }
    
    console.log('✅ Connection successful');
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

async function checkTableExists() {
  try {
    console.log('Checking if form_configurations table exists...');
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = 'form_configurations'
        ) as table_exists;
      `
    });
    
    if (error) {
      console.log('Table check failed (table probably doesn\'t exist):', error.message);
      return false;
    }
    
    console.log('Table exists:', data);
    return data && data.length > 0 && data[0].table_exists;
  } catch (error) {
    console.log('Table check failed:', error.message);
    return false;
  }
}

async function runTest() {
  const connected = await testConnection();
  if (!connected) {
    process.exit(1);
  }
  
  const tableExists = await checkTableExists();
  console.log('Form configurations table exists:', tableExists);
  
  if (!tableExists) {
    console.log('Need to apply migration to remote database...');
    console.log('You can use the Supabase dashboard SQL editor to run the migration.');
  }
}

runTest();
