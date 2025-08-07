/**
 * Enhanced OAuth Interceptor
 *
 * A robust solution to handle OAuth redirects that go to lovable.app
 * instead of localhost during development.
 */

interface OAuthParams {
  [key: string]: string;
}

/**
 * Extract OAuth parameters from current URL
 */
function extractOAuthParams(): OAuthParams {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const hashParams = new URLSearchParams(url.hash.substring(1));

  const oauthParams: OAuthParams = {};

  // Common OAuth parameters
  const oauthKeys = [
    'code',
    'access_token',
    'refresh_token',
    'token_type',
    'expires_in',
    'scope',
    'state',
    'error',
    'error_description',
  ];

  // Extract from query parameters
  oauthKeys.forEach(key => {
    if (params.has(key)) {
      oauthParams[key] = params.get(key)!;
    }
  });

  // Extract from hash parameters
  oauthKeys.forEach(key => {
    if (hashParams.has(key)) {
      oauthParams[key] = hashParams.get(key)!;
    }
  });

  return oauthParams;
}

/**
 * Check if current page has OAuth parameters
 */
function hasOAuthParams(): boolean {
  const params = extractOAuthParams();
  return Object.keys(params).length > 0;
}

/**
 * Check if we're on an external domain (not localhost)
 */
function isExternalDomain(): boolean {
  const hostname = window.location.hostname;
  return (
    !hostname.includes('localhost') &&
    !hostname.includes('127.0.0.1') &&
    !hostname.includes('0.0.0.0')
  );
}

/**
 * Redirect to localhost with OAuth parameters
 */
function redirectToLocalhost(): void {
  const oauthParams = extractOAuthParams();

  // Determine the correct localhost URL
  const targetUrl = new URL('http://localhost:3000/auth/callback');

  // Try different ports if 3000 is not available
  const possiblePorts = ['3000', '3001', '5173', '8080'];
  const port = possiblePorts[0]; // Default to 3000 for now

  targetUrl.port = port;

  // Add OAuth parameters to the target URL
  Object.entries(oauthParams).forEach(([key, value]) => {
    targetUrl.searchParams.set(key, value);
  });

  console.log('🔄 Redirecting OAuth callback to localhost:', targetUrl.href);
  console.log('📋 OAuth parameters:', oauthParams);

  // Perform the redirect
  window.location.href = targetUrl.href;
}

/**
 * Main interceptor function
 */
export function initializeEnhancedOAuthInterceptor(): void {
  console.log('🔍 Initializing Enhanced OAuth Interceptor...');
  console.log('🌐 Current URL:', window.location.href);
  console.log('🏠 Hostname:', window.location.hostname);

  // Check if we're currently on an OAuth callback
  if (hasOAuthParams() && isExternalDomain()) {
    console.log('🚨 OAuth callback detected on external domain!');
    redirectToLocalhost();
    return;
  }

  // Set up monitoring for future redirects
  const originalOpen = window.open;
  window.open = function (...args) {
    const result = originalOpen.apply(window, args);
    console.log('🔗 Window.open intercepted:', args);
    return result;
  };

  // Monitor URL changes
  let lastUrl = window.location.href;
  const urlMonitor = setInterval(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      console.log('📍 URL changed:', lastUrl);

      if (hasOAuthParams() && isExternalDomain()) {
        console.log('🚨 OAuth callback detected during navigation!');
        clearInterval(urlMonitor);
        redirectToLocalhost();
      }
    }
  }, 500);

  // Clean up monitoring after 5 minutes
  setTimeout(
    () => {
      clearInterval(urlMonitor);
      console.log('⏰ OAuth interceptor monitoring stopped');
    },
    5 * 60 * 1000
  );

  console.log('✅ Enhanced OAuth Interceptor initialized');
}

/**
 * Force redirect function for manual testing
 */
export function forceRedirectToLocalhost(): void {
  console.log('🔧 Force redirecting to localhost...');
  redirectToLocalhost();
}

/**
 * Check if we should redirect (for debugging)
 */
export function shouldRedirect(): boolean {
  return hasOAuthParams() && isExternalDomain();
}
