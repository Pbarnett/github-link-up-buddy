import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk'
import App from './App.tsx'
import './index.css'
import './styles/tokens.css'
import { ThemeProvider } from './components/theme-provider'

// Initialize Sentry only if DSN provided
const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
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
}

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

// Enforce single dev origin to prevent auth flakiness
if (import.meta.env.VITE_DISABLE_BASE_ENFORCE !== 'true') {
  (function enforceBaseOrigin() {
    const base = (import.meta.env.VITE_PUBLIC_BASE_URL as string) || window.location.origin;
    const normalizedBase = base.replace(/\/$/, '');
    // If the URL contains an auth code but we are not on /auth/callback, normalize path to the callback first
    const params = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const hasCode = params.has('code') || hash.has('code');
    if (hasCode && window.location.pathname !== '/auth/callback') {
      const dst = normalizedBase + '/auth/callback' + window.location.search + window.location.hash;
      console.warn('[Boot] Detected auth code on non-callback path. Redirecting to:', dst);
      window.location.replace(dst);
      return;
    }
    // Otherwise, ensure we’re on the configured base origin
    if (window.location.origin !== normalizedBase) {
      const dst = normalizedBase + window.location.pathname + window.location.search + window.location.hash;
      console.warn('[Boot] Redirecting to base origin for consistency:', dst);
      window.location.replace(dst);
    }
  })();
}

// Initialize LaunchDarkly (optional) and render app
(async () => {
  const clientId = import.meta.env.VITE_LD_CLIENT_ID as string | undefined;

  // In development, optionally disable LD entirely if it causes issues
  const disableLd = import.meta.env.VITE_DISABLE_LD === 'true';

  // If no LD client ID or disabled, render app without LD
  if (!clientId || disableLd) {
    if (disableLd) console.warn('[LD] Disabled via VITE_DISABLE_LD');
    createRoot(document.getElementById('root')!).render(
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <App />
      </ThemeProvider>
    );
    return;
  }

  try {
    // Initialize LD Provider correctly and render
    const LDProvider = await asyncWithLDProvider({
      clientSideID: clientId,
      user: { key: 'anonymous', anonymous: true },
      options: {
        // Quieter and more robust defaults for local dev
        streaming: import.meta.env.PROD,            // use streaming in prod; polling in dev
        sendEvents: true,                            // keep events enabled
        diagnosticOptOut: import.meta.env.DEV,       // opt-out of diagnostics in dev
      },
    });

    createRoot(document.getElementById('root')!).render(
      <LDProvider>
        <ThemeProvider defaultTheme="system" storageKey="app-theme">
          <App />
        </ThemeProvider>
      </LDProvider>
    );
  } catch (err) {
    // Fallback: render app without LD if provider initialization fails (e.g., invalid hook call)
    console.error('[LD] Failed to initialize provider, rendering without LD:', err);
    createRoot(document.getElementById('root')!).render(<App />);
  }
})();
