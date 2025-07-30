import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ Supabase URL not found in environment variables');
  console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('SUPABASE')));
  throw new Error('SUPABASE_URL or VITE_SUPABASE_URL environment variable is required');
}

if (!supabaseKey) {
  console.error('❌ Supabase anon key not found in environment variables');
  throw new Error('SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY environment variable is required');
}

console.log('✅ Server Supabase client initialized:', {
  url: supabaseUrl,
  hasKey: !!supabaseKey
});

export const supabase = createClient(supabaseUrl, supabaseKey);

