import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App.tsx'
import './index.css'

// Initialize Sentry
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  tracesSampleRate: 1.0,
  debug: import.meta.env.DEV,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Temporary debug logging
console.log('🔍 Environment Variables at App Startup:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING');
console.log('VITE_STRIPE_PUBLISHABLE_KEY:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'SET' : 'MISSING');

if (import.meta.env.VITE_SUPABASE_URL?.includes('127.0.0.1')) {
  console.log('❌ Still using LOCAL Supabase instance');
} else if (import.meta.env.VITE_SUPABASE_URL?.includes('supabase.co')) {
  console.log('✅ Using PRODUCTION Supabase instance');
} else {
  console.log('⚠️ Unknown Supabase configuration');
}

createRoot(document.getElementById("root")!).render(<App />);
