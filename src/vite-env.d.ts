/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_RESEND_API_KEY: string;
  readonly VITE_FLAG_FS_V2: string;
  readonly NODE_ENV: string;
  readonly DEV: boolean;
  readonly MODE: string;
  readonly VITE_TWILIO_ACCOUNT_SID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
