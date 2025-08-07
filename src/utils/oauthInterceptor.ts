/**
 * OAuth Redirect Interceptor
 *
 * Handles cross-origin OAuth redirects when Supabase is configured to redirect
 * to a different domain (like Lovable) than the current localhost environment.
 */

/**
 * Detects if the current page is an OAuth callback with foreign domain parameters
 */
export function detectCrossOriginCallback(): boolean {
  // Check if we're on a foreign domain with OAuth parameters
  const isLovableDomain = window.location.hostname.includes('lovable.app');
  const hasOAuthCode = new URLSearchParams(window.location.search).has('code');

  return isLovableDomain && hasOAuthCode;
}

/**
 * Redirects OAuth callback from foreign domain to localhost
 */
export function interceptCrossOriginCallback(): void {
  if (!detectCrossOriginCallback()) {
    return;
  }

  console.log('🔀 Intercepting cross-origin OAuth callback...');

  // Extract all OAuth parameters
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.substring(1));

  // Combine query and hash parameters
  const allParams = new URLSearchParams();

  // Add query parameters
  for (const [key, value] of urlParams) {
    allParams.set(key, value);
  }

  // Add hash parameters (Supabase often uses hash for OAuth)
  for (const [key, value] of hashParams) {
    allParams.set(key, value);
  }

  // Build localhost redirect URL
  const localhostUrl = new URL('http://localhost:3000/auth/callback');

  // Add all parameters to the redirect URL
  for (const [key, value] of allParams) {
    localhostUrl.searchParams.set(key, value);
  }

  console.log('🏠 Redirecting to localhost:', localhostUrl.toString());

  // Redirect to localhost with all OAuth parameters
  window.location.href = localhostUrl.toString();
}

/**
 * Initialize the OAuth interceptor
 */
export function initializeOAuthInterceptor(): void {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    return;
  }

  // Check immediately on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', interceptCrossOriginCallback);
  } else {
    interceptCrossOriginCallback();
  }
}

/**
 * Cross-origin postMessage handler for OAuth callbacks
 */
export function setupCrossOriginMessageHandler(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.addEventListener('message', event => {
    // Only accept messages from trusted Lovable domains
    if (!event.origin.includes('lovable.app')) {
      return;
    }

    // Check if this is an OAuth callback message
    if (event.data?.type === 'oauth_callback' && event.data?.params) {
      console.log(
        '📨 Received cross-origin OAuth callback message:',
        event.data
      );

      // Build callback URL with parameters
      const callbackUrl = new URL('http://localhost:3000/auth/callback');

      // Add OAuth parameters
      Object.entries(event.data.params).forEach(([key, value]) => {
        if (typeof value === 'string') {
          callbackUrl.searchParams.set(key, value);
        }
      });

      console.log('🏠 Redirecting via postMessage to:', callbackUrl.toString());

      // Navigate to the callback URL
      window.location.href = callbackUrl.toString();
    }
  });

  console.log('👂 Cross-origin message handler setup complete');
}
