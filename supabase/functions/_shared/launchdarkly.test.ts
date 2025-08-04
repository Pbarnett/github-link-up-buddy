/**
 * Tests for LaunchDarkly server-side utilities
 * 
 * Tests the core LaunchDarkly integration functions used by the emergency kill-switch.
 */

import { assertEquals, assertThrows } from 'https://deno.land/std@0.168.0/testing/asserts.ts';
import { 
  createUserContext,
  createOrgContext, 
  createDeviceContext,
  createMultiContext,
  validateContext,
  extractUserId,
  LaunchDarklyRequest,
  LaunchDarklyResponse
} from './launchdarkly.ts';

Deno.test('createUserContext - Creates valid user context', () => {
  const userId = 'test-user-123';
  const attributes = { email: 'test@example.com', plan: 'premium' };
  
  const context = createUserContext(userId, attributes);
  
  assertEquals(context.kind, 'user');
  assertEquals(context.key, userId);
  assertEquals(context.email, 'test@example.com');
  assertEquals(context.plan, 'premium');
});

Deno.test('createUserContext - Works without attributes', () => {
  const userId = 'test-user-456';
  
  const context = createUserContext(userId);
  
  assertEquals(context.kind, 'user');
  assertEquals(context.key, userId);
  assertEquals(Object.keys(context).length, 2); // Only kind and key
});

Deno.test('createOrgContext - Creates valid organization context', () => {
  const orgId = 'org-abc-123';
  const attributes = { name: 'Acme Corp', tier: 'enterprise' };
  
  const context = createOrgContext(orgId, attributes);
  
  assertEquals(context.kind, 'organization');
  assertEquals(context.key, orgId);
  assertEquals(context.name, 'Acme Corp');
  assertEquals(context.tier, 'enterprise');
});

Deno.test('createDeviceContext - Creates valid device context', () => {
  const deviceId = 'device-xyz-789';
  const attributes = { os: 'iOS', version: '16.0' };
  
  const context = createDeviceContext(deviceId, attributes);
  
  assertEquals(context.kind, 'device');
  assertEquals(context.key, deviceId);
  assertEquals(context.os, 'iOS');
  assertEquals(context.version, '16.0');
});

Deno.test('createMultiContext - Creates valid multi-context', () => {
  const userContext = createUserContext('user-123');
  const orgContext = createOrgContext('org-456');
  const deviceContext = createDeviceContext('device-789');
  
  const multiContext = createMultiContext([userContext, orgContext, deviceContext]);
  
  assertEquals(multiContext.kind, 'multi');
  assertEquals((multiContext as any).user, userContext);
  assertEquals((multiContext as any).organization, orgContext);
  assertEquals((multiContext as any).device, deviceContext);
});

Deno.test('createMultiContext - Throws on invalid context', () => {
  const invalidContext = { kind: 'multi', key: 'invalid' }; // Multi context is not allowed as sub-context
  
  assertThrows(
    () => createMultiContext([invalidContext]),
    Error,
    'Invalid context kind for multi-context'
  );
});

Deno.test('createMultiContext - Throws on missing kind', () => {
  const invalidContext = { key: 'no-kind' }; // Missing kind
  
  assertThrows(
    () => createMultiContext([invalidContext as any]),
    Error,
    'Invalid context kind for multi-context'
  );
});

Deno.test('validateContext - Validates single context', () => {
  const validContext = { kind: 'user', key: 'user-123' };
  const invalidContext1 = { kind: 'user' }; // Missing key
  const invalidContext2 = { key: 'user-123' }; // Missing kind
  const invalidContext3 = null; // Null context
  
  assertEquals(validateContext(validContext), true);
  assertEquals(validateContext(invalidContext1), false);
  assertEquals(validateContext(invalidContext2), false);
  assertEquals(validateContext(invalidContext3), false);
});

Deno.test('validateContext - Validates multi-context', () => {
  const validMultiContext = {
    kind: 'multi',
    user: { kind: 'user', key: 'user-123' },
    organization: { kind: 'organization', key: 'org-456' }
  };
  
  const invalidMultiContext1 = {
    kind: 'multi'
    // No sub-contexts
  };
  
  const invalidMultiContext2 = {
    kind: 'multi',
    user: { kind: 'user' } // Invalid sub-context (missing key)
  };
  
  assertEquals(validateContext(validMultiContext), true);
  assertEquals(validateContext(invalidMultiContext1), false);
  assertEquals(validateContext(invalidMultiContext2), false);
});

Deno.test('extractUserId - Extracts from user context', () => {
  const userContext = createUserContext('user-123');
  
  const userId = extractUserId(userContext);
  
  assertEquals(userId, 'user-123');
});

Deno.test('extractUserId - Extracts from multi-context', () => {
  const userContext = createUserContext('user-456');
  const orgContext = createOrgContext('org-789');
  const multiContext = createMultiContext([userContext, orgContext]);
  
  const userId = extractUserId(multiContext);
  
  assertEquals(userId, 'user-456');
});

Deno.test('extractUserId - Returns null for non-user context', () => {
  const orgContext = createOrgContext('org-123');
  const deviceContext = createDeviceContext('device-456');
  
  assertEquals(extractUserId(orgContext), null);
  assertEquals(extractUserId(deviceContext), null);
});

Deno.test('extractUserId - Returns null for multi-context without user', () => {
  const orgContext = createOrgContext('org-123');
  const deviceContext = createDeviceContext('device-456');
  const multiContext = createMultiContext([orgContext, deviceContext]);
  
  const userId = extractUserId(multiContext);
  
  assertEquals(userId, null);
});

Deno.test('LaunchDarkly types - Request structure', () => {
  const request: LaunchDarklyRequest = {
    context: createUserContext('user-123'),
    flagKey: 'test-flag',
    defaultValue: false,
    includeReason: true
  };
  
  assertEquals(request.context.kind, 'user');
  assertEquals(request.flagKey, 'test-flag');
  assertEquals(request.defaultValue, false);
  assertEquals(request.includeReason, true);
});

Deno.test('LaunchDarkly types - Response structure', () => {
  const response: LaunchDarklyResponse = {
    value: true,
    variationIndex: 0,
    reason: { kind: 'RULE_MATCH' },
    flagKey: 'test-flag',
    timestamp: new Date().toISOString()
  };
  
  assertEquals(response.value, true);
  assertEquals(response.variationIndex, 0);
  assertEquals(response.flagKey, 'test-flag');
  assertEquals(typeof response.timestamp, 'string');
});

// Integration test for context validation with realistic scenarios
Deno.test('Context validation - Emergency kill-switch scenarios', () => {
  // System context for kill-switch checks
  const systemContext = {
    kind: 'system',
    key: 'auto-booking-system',
    custom: {
      checkType: 'emergency_kill_switch',
      feature: 'autoBooking',
      emergencyLevel: 'high'
    }
  };
  
  // User context for user-specific kill-switch
  const userContext = createUserContext('user-123', {
    email: 'user@example.com',
    plan: 'premium',
    custom: {
      checkType: 'emergency_kill_switch'
    }
  });
  
  // Multi-context for complex targeting
  const multiContext = createMultiContext([
    systemContext,
    userContext,
    createOrgContext('org-456', { tier: 'enterprise' })
  ]);
  
  assertEquals(validateContext(systemContext), true);
  assertEquals(validateContext(userContext), true);
  assertEquals(validateContext(multiContext), true);
  
  // Extract user ID from multi-context
  assertEquals(extractUserId(multiContext), 'user-123');
  assertEquals(extractUserId(systemContext), null);
});
