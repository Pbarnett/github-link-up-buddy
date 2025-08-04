/**
 * Tests for Emergency Kill-Switch functionality
 * 
 * Ensures the kill-switch properly gates auto-booking operations
 * across different scenarios and contexts.
 */

import { assertEquals, assertRejects } from 'https://deno.land/std@0.168.0/testing/asserts.ts';
import { 
  EmergencyKillSwitch, 
  canProceedWithAutoBooking, 
  canProceedWithPayment, 
  canProceedWithDuffel,
  KillSwitchContext 
} from './emergency-kill-switch.ts';

// Mock the LaunchDarkly utilities
const mockEvaluateFlag = (flagValue: boolean) => {
  return async (flagKey: string, _context: any, defaultValue: any): Promise<any> => {
    // Simulate different kill-switch scenarios
    const killSwitchFlags: Record<string, boolean> = {
      'emergency-global-kill-switch': flagValue,
      'emergency-auto-booking-kill-switch': flagValue,
      'emergency-payment-kill-switch': flagValue,
      'emergency-duffel-kill-switch': flagValue,
      'emergency-user-kill-switch': flagValue
    };

    // Return LaunchDarkly response structure
    return {
      value: killSwitchFlags[flagKey] ?? defaultValue,
      flagKey,
      timestamp: new Date().toISOString()
    };
  };
};

Deno.test('EmergencyKillSwitch - All systems enabled', async () => {
  // Mock all flags as enabled (kill switches OFF)
  const originalEvaluateFlag = (await import('./launchdarkly.ts')).evaluateFlag;
  const mockModule = await import('./launchdarkly.ts');
  (mockModule as any).evaluateFlag = mockEvaluateFlag(true);

  const killSwitch = EmergencyKillSwitch.getInstance();
  const context: KillSwitchContext = {
    userId: 'test-user-123',
    feature: 'auto_booking',
    environment: 'test'
  };

  const enabled = await killSwitch.isAutoBookingEnabled(context);
  assertEquals(enabled, true, 'Auto-booking should be enabled when all kill switches are off');
  
  // Restore original function
  (mockModule as any).evaluateFlag = originalEvaluateFlag;
});

Deno.test('EmergencyKillSwitch - Global kill switch active', async () => {
  // Mock global kill switch as disabled (kill switch ON)
  const mockModule = await import('./launchdarkly.ts');
  const originalEvaluateFlag = mockModule.evaluateFlag;
  (mockModule as any).evaluateFlag = async (flagKey: string, _context: any, defaultValue: any) => {
    if (flagKey === 'emergency-global-kill-switch') {
      return {
        value: false, // Kill switch is ON (disabling the system)
        flagKey,
        timestamp: new Date().toISOString()
      };
    }
    return {
      value: defaultValue,
      flagKey,
      timestamp: new Date().toISOString()
    };
  };

  const killSwitch = EmergencyKillSwitch.getInstance();
  const context: KillSwitchContext = {
    userId: 'test-user-123',
    feature: 'auto_booking',
    environment: 'test'
  };

  const enabled = await killSwitch.isAutoBookingEnabled(context);
  assertEquals(enabled, false, 'Auto-booking should be disabled when global kill switch is active');
  
  // Restore original function
  (mockModule as any).evaluateFlag = originalEvaluateFlag;
});

Deno.test('EmergencyKillSwitch - Feature-specific kill switch active', async () => {
  // Mock auto-booking kill switch as disabled
  (globalThis as any).__evaluateFlag = async (flagKey: string, _context: any, defaultValue: any) => {
    if (flagKey === 'emergency-global-kill-switch') {
      return true; // Global is enabled
    }
    if (flagKey === 'emergency-auto-booking-kill-switch') {
      return false; // Auto-booking kill switch is ON
    }
    return defaultValue;
  };

  const killSwitch = EmergencyKillSwitch.getInstance();
  const context: KillSwitchContext = {
    userId: 'test-user-123',
    feature: 'auto_booking',
    environment: 'test'
  };

  const enabled = await killSwitch.isAutoBookingEnabled(context);
  assertEquals(enabled, false, 'Auto-booking should be disabled when feature kill switch is active');
});

Deno.test('EmergencyKillSwitch - User-specific kill switch active', async () => {
  // Mock user-specific kill switch as disabled
  (globalThis as any).__evaluateFlag = async (flagKey: string, context: any, defaultValue: any) => {
    if (flagKey === 'emergency-global-kill-switch') {
      return true; // Global is enabled
    }
    if (flagKey === 'emergency-auto-booking-kill-switch') {
      return true; // Feature is enabled
    }
    if (flagKey === 'emergency-user-kill-switch' && context.kind === 'user') {
      return false; // User kill switch is ON
    }
    return defaultValue;
  };

  const killSwitch = EmergencyKillSwitch.getInstance();
  const context: KillSwitchContext = {
    userId: 'blocked-user-123',
    feature: 'auto_booking',
    environment: 'test'
  };

  const enabled = await killSwitch.isAutoBookingEnabled(context);
  assertEquals(enabled, false, 'Auto-booking should be disabled for blocked user');
});

Deno.test('EmergencyKillSwitch - System status check', async () => {
  // Mock mixed system state
  (globalThis as any).__evaluateFlag = async (flagKey: string, _context: any, defaultValue: any) => {
    const flagStates: Record<string, boolean> = {
      'emergency-global-kill-switch': true,          // Global enabled
      'emergency-auto-booking-kill-switch': false,  // Auto-booking disabled
      'emergency-payment-kill-switch': true,        // Payment enabled
      'emergency-duffel-kill-switch': true          // Duffel enabled
    };
    return flagStates[flagKey] ?? defaultValue;
  };

  const killSwitch = EmergencyKillSwitch.getInstance();
  const context: KillSwitchContext = {
    userId: 'test-user-123',
    environment: 'test'
  };

  const systemStatus = await killSwitch.getSystemStatus(context);
  
  assertEquals(systemStatus.overall, false, 'Overall system should be disabled when any component is disabled');
  assertEquals(systemStatus.components.global.enabled, true, 'Global should be enabled');
  assertEquals(systemStatus.components.autoBooking.enabled, false, 'Auto-booking should be disabled');
  assertEquals(systemStatus.components.paymentProcessing.enabled, true, 'Payment should be enabled');
  assertEquals(systemStatus.components.duffelIntegration.enabled, true, 'Duffel should be enabled');
});

Deno.test('canProceedWithAutoBooking - Guard function with kill switch active', async () => {
  // Mock auto-booking kill switch as disabled
  (globalThis as any).__evaluateFlag = async (flagKey: string, _context: any, defaultValue: any) => {
    if (flagKey === 'emergency-global-kill-switch') {
      return true; // Global enabled
    }
    if (flagKey === 'emergency-auto-booking-kill-switch') {
      return false; // Auto-booking disabled
    }
    return defaultValue;
  };

  const context: KillSwitchContext = {
    userId: 'test-user-123',
    feature: 'auto_booking',
    environment: 'test'
  };

  const result = await canProceedWithAutoBooking(context);
  
  assertEquals(result.canProceed, false, 'Should not be able to proceed with auto-booking');
  assertEquals(typeof result.reason, 'string', 'Should provide a reason');
  assertEquals(result.emergencyResponse instanceof Response, true, 'Should provide emergency response');
  
  if (result.emergencyResponse) {
    assertEquals(result.emergencyResponse.status, 503, 'Emergency response should have 503 status');
    const responseData = await result.emergencyResponse.json();
    assertEquals(responseData.error.code, 'EMERGENCY_KILL_SWITCH_ACTIVE', 'Should have correct error code');
  }
});

Deno.test('canProceedWithAutoBooking - Guard function allows when enabled', async () => {
  // Mock all systems as enabled
  (globalThis as any).__evaluateFlag = mockEvaluateFlag(true);

  const context: KillSwitchContext = {
    userId: 'test-user-123',
    feature: 'auto_booking',
    environment: 'test'
  };

  const result = await canProceedWithAutoBooking(context);
  
  assertEquals(result.canProceed, true, 'Should be able to proceed with auto-booking');
  assertEquals(result.reason, undefined, 'Should have no blocking reason');
  assertEquals(result.emergencyResponse, undefined, 'Should have no emergency response');
});

Deno.test('canProceedWithPayment - Payment kill switch active', async () => {
  // Mock payment kill switch as disabled
  (globalThis as any).__evaluateFlag = async (flagKey: string, _context: any, defaultValue: any) => {
    if (flagKey === 'emergency-global-kill-switch') {
      return true; // Global enabled
    }
    if (flagKey === 'emergency-payment-kill-switch') {
      return false; // Payment disabled
    }
    return defaultValue;
  };

  const context: KillSwitchContext = {
    userId: 'test-user-123',
    feature: 'payment_processing',
    environment: 'test'
  };

  const canProceed = await canProceedWithPayment(context);
  assertEquals(canProceed, false, 'Should not be able to proceed with payment processing');
});

Deno.test('canProceedWithDuffel - Duffel integration kill switch active', async () => {
  // Mock Duffel kill switch as disabled
  (globalThis as any).__evaluateFlag = async (flagKey: string, _context: any, defaultValue: any) => {
    if (flagKey === 'emergency-global-kill-switch') {
      return true; // Global enabled
    }
    if (flagKey === 'emergency-duffel-kill-switch') {
      return false; // Duffel disabled
    }
    return defaultValue;
  };

  const context: KillSwitchContext = {
    userId: 'test-user-123',
    feature: 'duffel_integration',
    environment: 'test'
  };

  const canProceed = await canProceedWithDuffel(context);
  assertEquals(canProceed, false, 'Should not be able to proceed with Duffel integration');
});

Deno.test('EmergencyKillSwitch - Fail-safe behavior on LaunchDarkly error', async () => {
  // Mock LaunchDarkly to throw an error
  (globalThis as any).__evaluateFlag = async (_flagKey: string, _context: any, defaultValue: any) => {
    throw new Error('LaunchDarkly service unavailable');
  };

  const killSwitch = EmergencyKillSwitch.getInstance();
  const context: KillSwitchContext = {
    userId: 'test-user-123',
    feature: 'auto_booking',
    environment: 'test'
  };

  // Should fail closed (disable) when LaunchDarkly is unavailable
  const enabled = await killSwitch.isAutoBookingEnabled(context);
  assertEquals(enabled, false, 'Should fail closed when LaunchDarkly is unavailable');
});

Deno.test('EmergencyKillSwitch - Singleton pattern', () => {
  const instance1 = EmergencyKillSwitch.getInstance();
  const instance2 = EmergencyKillSwitch.getInstance();
  
  assertEquals(instance1, instance2, 'Should return the same instance (singleton)');
});

Deno.test('EmergencyKillSwitch - Different emergency levels', async () => {
  // Mock system to check if emergency level affects targeting
  (globalThis as any).__evaluateFlag = async (flagKey: string, context: any, defaultValue: any) => {
    // Simulate different behavior based on emergency level
    if (context.custom?.emergencyLevel === 'critical') {
      return flagKey === 'emergency-global-kill-switch' ? false : defaultValue;
    }
    return true; // All systems enabled for non-critical
  };

  const killSwitch = EmergencyKillSwitch.getInstance();
  
  // Test critical emergency level
  const criticalContext: KillSwitchContext = {
    userId: 'test-user-123',
    feature: 'auto_booking',
    environment: 'test',
    emergencyLevel: 'critical'
  };

  const criticalEnabled = await killSwitch.isAutoBookingEnabled(criticalContext);
  assertEquals(criticalEnabled, false, 'Should be disabled during critical emergency');

  // Test normal level
  const normalContext: KillSwitchContext = {
    userId: 'test-user-123',
    feature: 'auto_booking',
    environment: 'test',
    emergencyLevel: 'low'
  };

  const normalEnabled = await killSwitch.isAutoBookingEnabled(normalContext);
  assertEquals(normalEnabled, true, 'Should be enabled during low emergency level');
});
