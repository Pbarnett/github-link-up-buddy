
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';

// Get environment variables with fallbacks for development
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log for debugging
console.log('🔍 Supabase client initialization:', {
  hasURL: !!SUPABASE_URL,
  hasKey: !!SUPABASE_ANON_KEY,
  url: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 20)}...` : 'missing',
  fullURL: SUPABASE_URL, // Show full URL for debugging
  env: import.meta.env.MODE
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
