
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';

// Get environment variables with fallbacks for development
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://bbonngdyfyfjqfhvoljl.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib25uZ2R5ZnlmanFmaHZvbGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNTE5NTQsImV4cCI6MjA2MjgyNzk1NH0.qoXypUh-SemZwFjTyONGztNbhoowqLMiKSRKgA7fRR0';

// Log for debugging
console.log('🔍 Supabase client initialization:', {
  hasURL: !!SUPABASE_URL,
  hasKey: !!SUPABASE_ANON_KEY,
  url: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 20)}...` : 'missing'
});

// Check if environment variables are available
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables:', {
    SUPABASE_URL: !!SUPABASE_URL,
    SUPABASE_ANON_KEY: !!SUPABASE_ANON_KEY
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Initialize and export the Supabase client with error handling
let supabaseClient;
try {
  supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce', // Use PKCE for better security
    },
    global: {
      headers: {
        'x-client-info': 'github-link-up-buddy@1.0.0',
      },
    },
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
  
  console.log('✅ Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error);
  throw error;
}

export const supabase = supabaseClient;
