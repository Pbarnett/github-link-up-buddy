
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and Anon Key from environment variables with fallbacks
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bbonngdyfyfjqfhvoljl.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib25uZ2R5ZnlmanFmaHZvbGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNTE5NTQsImV4cCI6MjA2MjgyNzk1NH0.qoXypUh-SemZwFjTyONGztNbhoowqLMiKSRKgA7fRR0';

console.log('Environment check:', {
  SUPABASE_URL: SUPABASE_URL ? 'Set' : 'Missing',
  SUPABASE_ANON_KEY: SUPABASE_PUBLISHABLE_KEY ? 'Set' : 'Missing',
  envVarCount: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')).length
});

// Initialize and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

console.log('Supabase client initialized successfully');
