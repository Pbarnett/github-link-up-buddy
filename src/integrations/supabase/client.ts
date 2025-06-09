
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and Anon Key from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Environment check:', {
  SUPABASE_URL: SUPABASE_URL ? 'Set' : 'Missing',
  SUPABASE_ANON_KEY: SUPABASE_PUBLISHABLE_KEY ? 'Set' : 'Missing',
  allEnvVars: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
});

// Check if the environment variables are set
if (!SUPABASE_URL) {
  console.error("VITE_SUPABASE_URL is not set. Available env vars:", Object.keys(import.meta.env));
  throw new Error("VITE_SUPABASE_URL is not set. Please check your .env file or environment variables.");
}
if (!SUPABASE_PUBLISHABLE_KEY) {
  console.error("VITE_SUPABASE_ANON_KEY is not set. Available env vars:", Object.keys(import.meta.env));
  throw new Error("VITE_SUPABASE_ANON_KEY is not set. Please check your .env file or environment variables.");
}

// Initialize and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

console.log('Supabase client initialized successfully');
