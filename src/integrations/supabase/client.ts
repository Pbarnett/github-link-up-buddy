
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';
import type { SupabaseClient } from '@supabase/supabase-js';

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

// Create the Supabase client with proper error handling for testing
let supabaseClient: SupabaseClient<Database> | MockSupabaseClient;

// Mock client interface for testing
interface MockSupabaseClient {
  from: (table: string) => {
    select: (columns?: string) => {
      eq: (column: string, value: unknown) => {
        then: (callback: (result: { data: unknown[]; error: null }) => void) => Promise<{ data: unknown[]; error: null }>;
        not: (column: string, value: unknown) => { then: (callback: (result: { data: unknown[]; error: null }) => void) => Promise<{ data: unknown[]; error: null }> };
        single: () => Promise<{ data: unknown; error: null }>;
      };
    };
  };
  auth: {
    getUser: () => Promise<{ data: { user: null }; error: null }>;
    getSession: () => Promise<{ data: { session: null }; error: null }>;
  };
  functions: {
    invoke: (functionName: string, options?: unknown) => Promise<{ data: null; error: null }>;
  };
}

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
