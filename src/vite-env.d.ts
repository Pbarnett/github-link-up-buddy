/// <reference types="vite/client" />

// Extend Vite's built-in ImportMetaEnv with our custom environment variables
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_RESEND_API_KEY: string;
  readonly VITE_FLAG_FS_V2: string;
  readonly VITE_LAUNCHDARKLY_CLIENT_ID: string;
  readonly VITE_TWILIO_ACCOUNT_SID: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_DUFFEL_ENABLED?: string;
  readonly VITE_AMADEUS_ENABLED?: string;
  readonly VITE_AUTO_BOOKING_ENABLED?: string;
  readonly VITE_LD_CLIENT_ID?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_ENVIRONMENT?: string;
  readonly VITE_PLAYWRIGHT_TEST?: string;
  readonly VITE_WALLET_UI_ENABLED?: string;
}
