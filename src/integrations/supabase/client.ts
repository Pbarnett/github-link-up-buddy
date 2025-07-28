import * as React from 'react';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables with fallbacks for development
const SUPABASE_URL =
  process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log for debugging
console.log('🔍 Supabase client initialization:', {
  hasURL: !!SUPABASE_URL,
  hasKey: !!SUPABASE_ANON_KEY,
  url: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 20)}...` : 'missing',
  fullURL: SUPABASE_URL, // Show full URL for debugging
  env: import.meta.env.MODE,
});

// Create the Supabase client with proper error handling for testing
let supabaseClient: SupabaseClient<Database> | MockSupabaseClient;

// Connection pooler configuration for different environments
const getConnectionConfig = () => {
  const isProduction = import.meta.env.PROD;
  const isServerSide = typeof window === 'undefined';

  if (isServerSide && isProduction) {
    // Use pooler for server-side production (session mode for persistent connections)
    return {
      db: {
        schema: 'public',
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          'x-client-info': 'github-link-up-buddy@1.0.0',
          Connection: 'close', // Prevent connection pooling issues
        },
      },
    };
  }

  // Client-side configuration or development
  return {
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
        eventsPerSecond: 100,
        log_level: import.meta.env.DEV ? 'info' : 'error',
      },
      heartbeatIntervalMs: 30000,
      reconnectAfterMs: (tries: number) => Math.min(tries * 1000, 30000),
      broadcastEnabled: true,
      presenceEnabled: true,
    },
  };
};

// Mock client interface for testing
interface MockQueryChain {
  select: () => MockQueryChain;
  eq: () => MockQueryChain;
  neq: () => MockQueryChain;
  gt: () => MockQueryChain;
  gte: () => MockQueryChain;
  lt: () => MockQueryChain;
  lte: () => MockQueryChain;
  like: () => MockQueryChain;
  ilike: () => MockQueryChain;
  is: () => MockQueryChain;
  in: () => MockQueryChain;
  contains: () => MockQueryChain;
  containedBy: () => MockQueryChain;
  rangeGt: () => MockQueryChain;
  rangeGte: () => MockQueryChain;
  rangeLt: () => MockQueryChain;
  rangeLte: () => MockQueryChain;
  rangeAdjacent: () => MockQueryChain;
  overlaps: () => MockQueryChain;
  textSearch: () => MockQueryChain;
  match: () => MockQueryChain;
  not: () => MockQueryChain;
  or: () => MockQueryChain;
  filter: () => MockQueryChain;
  order: () => MockQueryChain;
  limit: () => MockQueryChain;
  range: () => MockQueryChain;
  insert: () => MockQueryChain;
  upsert: () => MockQueryChain;
  update: () => MockQueryChain;
  delete: () => MockQueryChain;
  single: () => Promise<{ data: null; error: null }>;
  maybeSingle: () => Promise<{ data: null; error: null }>;
  then: (callback: any) => Promise<any>;
  catch: () => Promise<{ data: []; error: null }>;
  finally: (onFinally?: any) => Promise<{ data: []; error: null }>;
}

interface MockSupabaseClient {
  from: (table: string) => MockQueryChain;
  auth: {
    getUser: () => Promise<{ data: { user: null }; error: null }>;
    getSession: () => Promise<{ data: { session: null }; error: null }>;
    onAuthStateChange: (callback: any) => {
      data: { subscription: { unsubscribe: () => void } };
      error: null;
    };
    signOut: () => Promise<{ error: null }>;
    signInWithPassword: (
      credentials: any
    ) => Promise<{ data: { user: any; session: any }; error: null }>;
    signInWithOAuth: (
      options: any
    ) => Promise<{ data: { user: any; session: any }; error: null }>;
    getSettings: () => Promise<{ data: { settings: any }; error: null }>;
  };
  functions: {
    invoke: () => Promise<{ data: null; error: null }>;
  };
  rpc: () => Promise<{ data: null; error: null }>;
  channel: () => {
    on: () => any;
    subscribe: () => any;
    unsubscribe: () => any;
  };
  removeChannel: () => void;
}

// Check if environment variables are available
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables:', {
    SUPABASE_URL: !!SUPABASE_URL,
    SUPABASE_ANON_KEY: !!SUPABASE_ANON_KEY,
  });

  // In test environment, provide a mock client instead of throwing
  if (import.meta.env.MODE === 'test') {
    console.log('🧪 Using mock Supabase client for testing');

    // Create a comprehensive query chain that supports all Supabase operations
    const createQueryChain = () => {
      const queryChain = {
        select: () => queryChain,
        eq: () => queryChain,
        neq: () => queryChain,
        gt: () => queryChain,
        gte: () => queryChain,
        lt: () => queryChain,
        lte: () => queryChain,
        like: () => queryChain,
        ilike: () => queryChain,
        is: () => queryChain,
        in: () => queryChain,
        contains: () => queryChain,
        containedBy: () => queryChain,
        rangeGt: () => queryChain,
        rangeGte: () => queryChain,
        rangeLt: () => queryChain,
        rangeLte: () => queryChain,
        rangeAdjacent: () => queryChain,
        overlaps: () => queryChain,
        textSearch: () => queryChain,
        match: () => queryChain,
        not: () => queryChain,
        or: () => queryChain,
        filter: () => queryChain,
        order: () => queryChain,
        limit: () => queryChain,
        range: () => queryChain,
        insert: () => queryChain,
        upsert: () => queryChain,
        update: () => queryChain,
        delete: () => queryChain,
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        then: (callback: any) => {
          const result = { data: [], error: null };
          return callback
            ? Promise.resolve(callback(result))
            : Promise.resolve(result);
        },
        catch: () => Promise.resolve({ data: [], error: null }),
        finally: (onFinally?: any) => {
          if (onFinally) onFinally();
          return Promise.resolve({ data: [], error: null });
        },
      };
      return queryChain;
    };

    supabaseClient = {
      from: () => createQueryChain() as any,
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () =>
          Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: (callback: any) => {
          return {
            data: { subscription: { unsubscribe: () => {} } },
            error: null,
          };
        },
        signOut: () => Promise.resolve({ error: null }),
        signInWithPassword: (credentials: any) =>
          Promise.resolve({ data: { user: null, session: null }, error: null }),
        signInWithOAuth: (options: any) =>
          Promise.resolve({ data: { user: null, session: null }, error: null }),
        getSettings: () =>
          Promise.resolve({ data: { settings: {} }, error: null }),
      },
      functions: {
        invoke: () => Promise.resolve({ data: null, error: null }),
      },
      rpc: () => Promise.resolve({ data: null, error: null }),
      channel: () => ({
        on: () => {},
        subscribe: () => {},
        unsubscribe: () => {},
      }),
      removeChannel: () => {},
    };
  } else {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env file.'
    );
  }
} else {
  // Normal initialization when environment variables are available
  try {
    const config = getConnectionConfig();
    supabaseClient = createClient<Database>(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      config
    );

    console.log('✅ Supabase client initialized successfully', {
      mode: import.meta.env.MODE,
      isProduction: import.meta.env.PROD,
      isServerSide: typeof window === 'undefined',
      authConfig: config.auth ? 'configured' : 'default',
    });
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error);
    throw error;
  }
}

export const supabase = supabaseClient;
