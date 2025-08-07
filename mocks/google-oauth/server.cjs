const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock Google OAuth consent page
app.get('/mock/google-consent', (req, res) => {
  res.send(`
    <html>
      <head><title>Mock Google OAuth</title></head>
      <body>
        <h1>Mock Google OAuth Consent</h1>
        <p>This is a mock Google OAuth consent page for testing.</p>
        <button onclick="window.close()">Grant Access</button>
      </body>
    </html>
  `);
});

// Google OAuth authorization endpoint
app.get('/o/oauth2/v2/auth', (req, res) => {
  console.log('📝 Mock OAuth Auth Request:', req.query);
  
  const { redirect_uri, state, client_id, response_type } = req.query;
  
  if (!redirect_uri || !state) {
    return res.status(400).json({ error: 'missing_required_params' });
  }
  
  // Simulate user granting permission
  setTimeout(() => {
    const authCode = 'MOCK_AUTH_CODE_' + Date.now();
    const redirectUrl = `${redirect_uri}?code=${authCode}&state=${state}`;
    console.log('🔀 Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  }, 100);
});

// Token exchange endpoint
app.post('/token', (req, res) => {
  console.log('🔄 Mock Token Exchange Request:', req.body);
  
  const { code, grant_type, client_id, client_secret } = req.body;
  
  if (!code || grant_type !== 'authorization_code') {
    return res.status(400).json({ error: 'invalid_request' });
  }
  
  // Mock successful token response
  res.json({
    access_token: 'MOCK_ACCESS_TOKEN_' + Date.now(),
    expires_in: 3600,
    id_token: 'MOCK_ID_TOKEN_' + Date.now(),
    token_type: 'Bearer',
    refresh_token: 'MOCK_REFRESH_TOKEN_' + Date.now(),
    scope: 'openid email profile'
  });
});

// Mock user info endpoint
app.get('/oauth2/v2/userinfo', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  
  res.json({
    id: 'mock_user_123',
    email: 'test@example.com',
    name: 'Test User',
    picture: 'https://example.com/mock-avatar.jpg',
    verified_email: true
  });
});

const PORT = process.env.MOCK_OAUTH_PORT || 4001;
app.listen(PORT, () => {
  console.log(`🚀 Mock Google OAuth server running on port ${PORT}`);
  console.log(`📍 Authorization URL: http://localhost:${PORT}/o/oauth2/v2/auth`);
  console.log(`📍 Token URL: http://localhost:${PORT}/token`);
  console.log(`📍 UserInfo URL: http://localhost:${PORT}/oauth2/v2/userinfo`);
});
