#!/usr/bin/env node

/**
 * Script to check database schema and fix missing columns
 * 
 * This script:
 * 1. Connects to Supabase
 * 2. Checks if auto_book_enabled column exists in trip_requests table
 * 3. If missing, adds the column
 * 
 * Usage:
 * node scripts/check-schema.js
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Debug environment variables
console.log('Environment variables:');
console.log('- SUPABASE_PROJECT_URL:', process.env.SUPABASE_PROJECT_URL ? 'Found (value hidden)' : 'Not found');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Found (value hidden)' : 'Not found');

// Check for required environment variables
if (!process.env.SUPABASE_PROJECT_URL) {
  throw new Error('SUPABASE_PROJECT_URL environment variable is required');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

// Connect to Supabase
const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Main function to check and fix schema
 */
async function checkSchema() {
  try {
    console.log('Checking database schema...');
    
    // First, check if we can access the trip_requests table
    console.log('Step 1: Checking if trip_requests table exists...');
    const { data: tripRequests, error: tableError } = await supabase
      .from('trip_requests')
      .select('id')
      .limit(1);
    
    if (tableError) {
      console.error('Error accessing trip_requests table:', tableError);
      console.log('\nIt seems we cannot access the trip_requests table or it does not exist.');
      return;
    }
    
    console.log('✅ trip_requests table exists and is accessible.');
    console.log('\nStep 2: Checking for auto_book_enabled column...');
    console.log('\nSince we cannot directly query the information_schema through the Supabase client,');
    console.log('please run the following SQL in the Supabase SQL Editor:');
    
    console.log(`
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'trip_requests'
ORDER BY ordinal_position;

-- Look for auto_book_enabled in the results
-- If it's not there, run this command to add it:

ALTER TABLE trip_requests
ADD COLUMN auto_book_enabled BOOLEAN NOT NULL DEFAULT false;

-- After adding the column, restart the API by going to:
-- Project Settings → Database → Restart API
`);
    
    // Try to query a record and look for the auto_book_enabled field
    const { data: sampleData, error: sampleError } = await supabase
      .from('trip_requests')
      .select('*')
      .limit(1);
    
    if (!sampleError && sampleData && sampleData.length > 0) {
      const record = sampleData[0];
      if ('auto_book_enabled' in record) {
        console.log('\n✅ Good news! The auto_book_enabled column appears to exist in the data.');
        console.log(`Current value: ${record.auto_book_enabled}`);
      } else {
        console.log('\n❌ The auto_book_enabled column does not appear in the data.');
        console.log('This confirms you need to add the column using the SQL command above.');
      }
    } else {
      console.log('\nCould not check sample data. Please use the SQL command to verify.');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the script
checkSchema()
  .then(() => console.log('\nSchema check completed.'))
  .catch(err => console.error('Schema check failed:', err));

