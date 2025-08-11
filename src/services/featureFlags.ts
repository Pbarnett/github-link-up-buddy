/**
 * Feature Flag Service for Safe Auto-Booking Migration
 * 
 * This service allows us to toggle between old Supabase Edge Functions
 * and new AWS Step Functions without affecting any other app functionality.
 */

interface FeatureFlags {
  USE_AWS_STEP_FUNCTIONS: boolean;
  USE_LEGACY_AUTO_BOOKING: boolean;
  ENABLE_AUTO_BOOKING_DEBUG: boolean;
  MIGRATION_ROLLBACK_MODE: boolean;
}

class FeatureFlagService {
  private flags: FeatureFlags = {
    // Start with legacy system to ensure no disruption
    USE_AWS_STEP_FUNCTIONS: false,
    USE_LEGACY_AUTO_BOOKING: true,
    ENABLE_AUTO_BOOKING_DEBUG: false,
    MIGRATION_ROLLBACK_MODE: false,
  };

  // Environment-based overrides
  constructor() {
    // Read from browser-safe Vite env; fall back to defaults when absent
    const env = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};

    this.flags.USE_AWS_STEP_FUNCTIONS = String(env.VITE_USE_AWS_STEP_FUNCTIONS).toLowerCase() === 'true';

    // default true unless explicitly set to 'false'
    this.flags.USE_LEGACY_AUTO_BOOKING = String(env.VITE_USE_LEGACY_AUTO_BOOKING).toLowerCase() !== 'false';

    this.flags.ENABLE_AUTO_BOOKING_DEBUG = String(env.VITE_ENABLE_AUTO_BOOKING_DEBUG).toLowerCase() === 'true';

    this.flags.MIGRATION_ROLLBACK_MODE = String(env.VITE_MIGRATION_ROLLBACK_MODE).toLowerCase() === 'true';
  }

  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag];
  }

  // Safe migration toggles
  useAwsStepFunctions(): boolean {
    return this.isEnabled('USE_AWS_STEP_FUNCTIONS') && !this.isEnabled('MIGRATION_ROLLBACK_MODE');
  }

  useLegacyAutoBooking(): boolean {
    return this.isEnabled('USE_LEGACY_AUTO_BOOKING') || this.isEnabled('MIGRATION_ROLLBACK_MODE');
  }

  isDebugMode(): boolean {
    return this.isEnabled('ENABLE_AUTO_BOOKING_DEBUG');
  }

  isRollbackMode(): boolean {
    return this.isEnabled('MIGRATION_ROLLBACK_MODE');
  }

  // Emergency rollback - can be called from anywhere
  emergencyRollback(): void {
    console.warn('🚨 EMERGENCY ROLLBACK ACTIVATED - Switching to legacy auto-booking');
    this.flags.MIGRATION_ROLLBACK_MODE = true;
    this.flags.USE_AWS_STEP_FUNCTIONS = false;
    this.flags.USE_LEGACY_AUTO_BOOKING = true;
  }

  // Safe migration activation
  enableStepFunctions(): void {
    if (this.isRollbackMode()) {
      console.warn('Cannot enable Step Functions while in rollback mode');
      return;
    }
    this.flags.USE_AWS_STEP_FUNCTIONS = true;
    this.flags.USE_LEGACY_AUTO_BOOKING = false;
  }
}

export const featureFlags = new FeatureFlagService();

// Make emergency rollback available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).emergencyRollback = () => featureFlags.emergencyRollback();
}
