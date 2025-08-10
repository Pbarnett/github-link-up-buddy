
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';

// Get environment variables with fallbacks for development
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log for debugging (development only)
if (import.meta.env.DEV || import.meta.env.MODE === 'test') {
  console.log('🔍 Supabase client initialization:', {
    hasURL: !!SUPABASE_URL,
    hasKey: !!SUPABASE_ANON_KEY,
    url: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 20)}...` : 'missing',
    env: import.meta.env.MODE
  });
}

// Create the Supabase client with proper error handling for testing
let supabaseClient: any;

// Check if environment variables are available
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables:', {
    SUPABASE_URL: !!SUPABASE_URL,
    SUPABASE_ANON_KEY: !!SUPABASE_ANON_KEY
  });
  
  // In test environment, provide a mock client instead of throwing
  if (import.meta.env.MODE === 'test') {
    console.log('🧪 Using mock Supabase client for testing');
    
    supabaseClient = {
      from: () => ({
        select: () => ({
          eq: () => ({
            then: () => Promise.resolve({ data: [], error: null }),
            not: () => ({ then: () => Promise.resolve({ data: [], error: null }) }),
            single: () => Promise.resolve({ data: null, error: null })
          })
        })
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null })
      },
      functions: {
        invoke: () => Promise.resolve({ data: null, error: null })
      }
    };
  } else {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
  }
} else {
  // Normal initialization when environment variables are available
  try {
    supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: import.meta.env.PROD ? 'sb-pf' : 'sb-pf-dev',
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
}

export const supabase = supabaseClient;
