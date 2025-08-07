// OAuth Redirect Bookmarklet
// Copy this code and run it in the browser console when you're on the lovable.app OAuth callback page

(function() {
  console.log('🔄 OAuth Redirect Script Started');
  console.log('📍 Current URL:', window.location.href);
  
  // Extract OAuth parameters from current URL
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const hashParams = new URLSearchParams(url.hash.substring(1));
  
  const oauthParams = {};
  
  // Common OAuth parameters
  const oauthKeys = [
    'code', 'access_token', 'refresh_token', 'token_type', 
    'expires_in', 'scope', 'state', 'error', 'error_description'
  ];
  
  // Extract from query parameters
  oauthKeys.forEach(key => {
    if (params.has(key)) {
      oauthParams[key] = params.get(key);
    }
  });
  
  // Extract from hash parameters  
  oauthKeys.forEach(key => {
    if (hashParams.has(key)) {
      oauthParams[key] = hashParams.get(key);
    }
  });
  
  console.log('📋 Found OAuth parameters:', oauthParams);
  
  // Check if we have any OAuth parameters
  if (Object.keys(oauthParams).length === 0) {
    console.log('❌ No OAuth parameters found');
    return;
  }
  
  // Build localhost redirect URL
  const targetUrl = new URL('http://localhost:3000/auth/callback');
  
  // Add OAuth parameters to the target URL
  Object.entries(oauthParams).forEach(([key, value]) => {
    targetUrl.searchParams.set(key, value);
  });
  
  console.log('🚀 Redirecting to:', targetUrl.href);
  
  // Create a visible message
  const message = document.createElement('div');
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #4CAF50;
    color: white;
    padding: 20px;
    border-radius: 10px;
    font-family: Arial, sans-serif;
    font-size: 16px;
    z-index: 10000;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  `;
  message.innerHTML = `
    <h3>🔄 Redirecting to Localhost</h3>
    <p>Taking you back to your development environment...</p>
    <p><small>This will happen automatically in 2 seconds</small></p>
  `;
  
  document.body.appendChild(message);
  
  // Redirect after 2 seconds
  setTimeout(() => {
    window.location.href = targetUrl.href;
  }, 2000);
})();
