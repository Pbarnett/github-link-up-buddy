// Global ambient module declarations
// For libraries without proper TypeScript support

import * as React from 'react';
type _Component<P = {}, S = {}> = React.Component<P, S>;

// Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_STRIPE_PUBLISHABLE_KEY: string;
    DATABASE_URL: string;
    STRIPE_SECRET_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
  }
}

// Vite env variables
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_APP_TITLE: string;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
