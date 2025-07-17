# Google OAuth Testing Suite

This directory contains comprehensive tests for Google OAuth authentication flow.

## Test Structure

```
tests/auth/
├── oauth.spec.ts              # Main OAuth test suite
├── README.md                  # This file
└── utils/
    └── oauthTestUtils.ts      # Utility functions for OAuth testing
```

## Test Commands

### Local Testing
```bash
# Run OAuth tests with real Google OAuth
pnpm run test:auth

# Run OAuth tests with mock Google OAuth server
pnpm run test:auth:ci

# Run edge deployment tests
pnpm run test:auth:edge

# Verify OAuth session
pnpm run verify:session
```

### CI/CD Integration
The tests are automatically run in CI with both real and mock OAuth modes.

## Test Scenarios

### 1. Happy Path
- User clicks "Sign in with Google"
- Redirects to Google OAuth
- User grants permissions
- Redirects back to app
- Supabase session is created
- User is authenticated

### 2. Error Scenarios
- **Expired auth code**: Tests graceful handling of expired OAuth codes
- **Popup blocked**: Tests fallback to redirect flow when popup is blocked
- **Invalid redirect URI**: Tests error handling for redirect URI mismatch
- **Network failures**: Tests OAuth flow resilience

### 3. Edge Cases
- Session persistence across page reloads
- Multiple concurrent login attempts
- Token refresh scenarios
- Logout flow validation

## Mock OAuth Server

For CI testing, we use a lightweight mock OAuth server that simulates Google's OAuth endpoints:

```typescript
// Mock endpoints
GET /o/oauth2/v2/auth     # Authorization endpoint
POST /token               # Token exchange endpoint
```

To run with mock server:
```bash
MOCK_GOOGLE_OAUTH=true pnpm run test:auth:ci
```

## Test Reports

Test results are saved to:
- `tests/reports/oauth/html/` - HTML reports
- `tests/reports/oauth/report.json` - JSON reports

## Configuration

### Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `MOCK_GOOGLE_OAUTH` - Enable mock OAuth server

### Redirect URIs
Configured in `supabase/config.toml`:
- `http://localhost:3000/auth/callback`
- `http://127.0.0.1:3000/auth/callback`
- `https://staging.parkerflight.app/auth/callback`

## Troubleshooting

### Common Issues

1. **Tests failing in CI**
   - Check if mock server is running
   - Verify environment variables are set
   - Check redirect URI configuration

2. **Session assertion failures**
   - Ensure Supabase client is available globally
   - Check OAuth flow completion
   - Verify token exchange

3. **Popup blocked errors**
   - Tests should fallback to redirect flow
   - Check popup blocker simulation

### Debug Mode
Run tests with verbose output:
```bash
pnpm run test:auth --reporter=verbose
```

## Contributing

When adding new OAuth test scenarios:

1. Add test cases to `oauth.spec.ts`
2. Create utility functions in `oauthTestUtils.ts`
3. Update this README with new scenarios
4. Ensure tests work in both real and mock modes
