import * as React from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { ThemeProvider } from 'next-themes';
import App from './App';
import {} from './components/ErrorBoundary';
import { initializeDatabase } from './lib/database/init';
import './index.css';

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
console.log(
  'VITE_SUPABASE_ANON_KEY:',
  import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'
);
console.log(
  'VITE_STRIPE_PUBLISHABLE_KEY:',
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'SET' : 'MISSING'
);

if (import.meta.env.VITE_SUPABASE_URL?.includes('127.0.0.1')) {
  console.log('❌ Still using LOCAL Supabase instance');
} else if (import.meta.env.VITE_SUPABASE_URL?.includes('supabase.co')) {
  console.log('✅ Using PRODUCTION Supabase instance');
} else {
  console.log('⚠️ Unknown Supabase configuration');
}

// Helper function to render app without LaunchDarkly
const renderAppWithoutLD = () => {
  const AppWithoutLD = () => (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
    </ThemeProvider>
  );
  createRoot(document.getElementById('root')!).render(<AppWithoutLD />);
};

// Initialize database layer and LaunchDarkly
(async () => {
  console.log('🚀 Starting application initialization...');
  
  // Initialize database layer first
  try {
    await initializeDatabase('system');
  } catch (error) {
    console.error('Database initialization failed, continuing with degraded functionality:', error);
  }

  // Initialize LaunchDarkly and render app
  const clientSideID = import.meta.env.VITE_LD_CLIENT_ID;
  const isTestMode = import.meta.env.VITE_PLAYWRIGHT_TEST === 'true' || import.meta.env.NODE_ENV === 'test';

  if (!clientSideID) {
    console.error(
      'LaunchDarkly client-side ID is missing. Please set VITE_LD_CLIENT_ID in your environment variables.'
    );
    renderAppWithoutLD();
    return;
  }

  try {
    // Conditionally import LaunchDarkly providers
    const ldModule = isTestMode
      ? await import('./providers/TestLaunchDarklyProvider')
      : await import('launchdarkly-react-client-sdk');

    const { asyncWithLDProvider } = ldModule;

    // Add timeout wrapper for LaunchDarkly initialization
    const initWithTimeout = (timeoutMs = 10000) => {
      return Promise.race([
        asyncWithLDProvider({
          clientSideID,
          user: {
            key: 'anonymous',
            anonymous: true,
          },
          options: {
            bootstrap: 'localStorage', // Cache flags for faster loading
            sendEvents: false, // Disable events to reduce 500 errors
            streaming: false, // Disable streaming to prevent connection issues
            streamReconnectDelay: 5000, // Increased delay between reconnect attempts
            diagnosticOptOut: true, // Disable diagnostics to reduce traffic
            sendEventsOnlyForVariation: false,
            allAttributesPrivate: true, // Increase privacy
            useReport: false, // Use GET instead of POST for better compatibility
            logger: {
              warn: (message: string) =>
                console.warn('[LaunchDarkly]', message),
              error: (message: string) =>
                console.error('[LaunchDarkly]', message),
              info: () => {}, // Suppress info logs
              debug: () => {}, // Suppress debug logs
            },
          },
        }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('LaunchDarkly initialization timeout')),
            timeoutMs
          )
        ),
      ]);
    };

    const LDProvider = await initWithTimeout() as React.ComponentType<{ children: React.ReactNode }>;

    const WrappedApp = () => (
      <LDProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <App />
        </ThemeProvider>
      </LDProvider>
    );
    createRoot(document.getElementById('root')!).render(<WrappedApp />);
  } catch (error) {
    console.error('Failed to initialize LaunchDarkly:', error);
    renderAppWithoutLD();
  }
})();
