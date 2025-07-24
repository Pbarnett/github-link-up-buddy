# External Services Integration Tests

This directory contains integration tests for external services including Stripe, LaunchDarkly, and Supabase. These tests validate that our application can successfully communicate with third-party services and handle various scenarios.

## Overview

The integration tests are designed to:
- Validate connectivity to external services
- Test API functionality in real environments
- Verify error handling and edge cases
- Ensure cross-service integration works correctly
- Check security and authentication flows

## Test Structure

### `external-services.test.ts`
Main integration test suite that covers:

**Stripe Integration:**
- API connectivity validation
- Test payment method creation
- Webhook endpoint structure
- Declined card scenarios
- Test vs production environment safety checks

**LaunchDarkly Integration:**
- SDK initialization and connectivity
- Feature flag retrieval (`wallet_ui`, `profile_ui_revamp`)
- Fallback handling for unknown flags
- User segmentation validation

**Supabase Integration:**
- Database connectivity
- Table structure validation (`payment_methods`, `profiles`)
- Row Level Security (RLS) policy verification
- Edge Function health checks
- KMS encryption service validation

**Cross-Service Integration:**
- Stripe + Supabase payment flow
- LaunchDarkly + UI feature toggles

## Environment Variables

The tests require the following environment variables:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration (Use test keys only!)
STRIPE_SECRET_KEY=sk_test_...

# LaunchDarkly Configuration
LAUNCHDARKLY_SDK_KEY=your_launchdarkly_sdk_key
```

⚠️ **Security Note**: Always use test/development keys for integration tests. The tests include safety checks to prevent accidental use of production keys.

## Running Tests

### Local Development

```bash
# Run all integration tests
npm run test:integration:external

# Run with headed browser (for debugging)
npm run test:integration:external:headed

# Run in debug mode
npm run test:integration:external:debug
```

### CI Environment

The tests are automatically run in the CI pipeline as part of the comprehensive test suite. They are configured to:
- Run sequentially to avoid API rate limits
- Retry failed tests up to 2 times
- Skip tests if required environment variables are missing
- Generate detailed reports and artifacts

## Configuration

### Playwright Configuration

The tests use a dedicated Playwright configuration (`playwright.integration.config.ts`) with:
- Extended timeout (60 seconds) for external service calls
- Sequential execution to avoid rate limits
- Single worker to prevent API conflicts
- Comprehensive reporting (list, JSON, HTML)

### Test Environment Safety

The tests include multiple safety mechanisms:
- Automatic detection of production vs test environments
- Validation that test keys are being used
- Graceful skipping when services are unavailable
- Clear logging of test results and service status

## Adding New Integration Tests

When adding tests for new external services:

1. **Add environment variables** to the test configuration
2. **Include safety checks** for production vs test environments  
3. **Handle service unavailability** gracefully with test.skip()
4. **Add comprehensive logging** for debugging
5. **Update CI configuration** with new environment variables
6. **Document the new tests** in this README

### Example Test Structure

```typescript
test.describe('New Service Integration', () => {
  test.beforeAll(() => {
    if (!process.env.NEW_SERVICE_API_KEY) {
      test.skip('NEW_SERVICE_API_KEY not configured');
    }
  });

  test('should validate service connectivity', async () => {
    // Test implementation
    console.log('✅ New service connectivity verified');
  });

  test('should handle error scenarios', async () => {
    // Error handling tests
  });
});
```

## Troubleshooting

### Common Issues

**Environment Variables Not Set:**
- Ensure all required environment variables are configured
- Check that test keys (not production keys) are being used
- Verify environment variables in CI/CD settings

**API Rate Limits:**
- Tests are configured to run sequentially
- If you encounter rate limits, increase delays between requests
- Consider using mock services for rapid development

**Service Unavailability:**
- Tests will skip if services are unavailable
- Check service status pages for outages
- Verify network connectivity and firewall settings

**Authentication Failures:**
- Verify API keys are valid and have correct permissions
- Check that test environments are properly configured
- Ensure RLS policies allow test access

### Debugging

Enable detailed logging:
```bash
DEBUG=* npm run test:integration:external
```

Run specific test files:
```bash
npx playwright test tests/integration/external-services.test.ts --config=playwright.integration.config.ts
```

Generate and view test reports:
```bash
npx playwright show-report playwright-report/integration
```

## Monitoring and Alerts

The integration tests are monitored for:
- Test execution success/failure rates
- Service response times and availability
- API error rates and types
- Feature flag consistency across environments

Results are reported to:
- GitHub Actions artifacts
- Slack notifications (for main branch)
- Monitoring dashboards (if configured)

## Related Documentation

- [Stripe API Reference](../../docs/api/stripe/STRIPE_API_REFERENCE.md)
- [LaunchDarkly SDK Documentation](../../docs/api/launchdarkly/LAUNCHDARKLY_SDK_DOCUMENTATION.md)
- [Supabase Edge Functions](../../docs/api/supabase/SUPABASE_EDGE_FUNCTION_DOCUMENTATION.md)
- [Playwright Documentation](../../docs/api/playwright/PLAYWRIGHT_API_ADVANCED_GUIDE.md)

## Contributing

When contributing to these tests:
1. Ensure tests are reliable and not flaky
2. Add appropriate error handling and logging
3. Update documentation for new test cases
4. Test both success and failure scenarios
5. Consider the impact on CI/CD pipeline execution time

## Implementation Status

✅ **Completed**: Basic test framework and connectivity validation
✅ **Completed**: Profile Completeness Integration 
✅ **Completed**: Wallet UI integration with feature flags
🔄 **In Progress**: External services integration testing
⏳ **Next**: Production monitoring and deployment automation

## Next Steps

After completing the external services integration tests, the recommended next priorities are:

1. **Production Monitoring Setup**
   - Deploy AWS CloudWatch dashboards
   - Set up health check endpoints
   - Configure alerting for service failures

2. **Database Migration Automation**
   - Resolve local database migration issues
   - Automate feature flag rollout processes

3. **Load Testing**
   - Performance testing with k6
   - Service capacity validation
   - Rate limiting validation
