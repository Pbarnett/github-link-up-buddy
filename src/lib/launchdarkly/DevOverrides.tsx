import * as React from 'react';
const { useState, useEffect } = React;

import { useFlags as useLDFlags, useLDClient } from 'launchdarkly-react-client-sdk';
import { LDFlagValue } from 'launchdarkly-js-client-sdk';

const OVERRIDE_KEY = 'LD_FLAG_OVERRIDES';

// Type for flag overrides
interface FlagOverrides {
  [flagKey: string]: LDFlagValue;
}

// Utility functions for managing localStorage overrides
export class DevFlagOverrides {
  /**
   * Gets all active flag overrides from localStorage
   */
  static getOverrides(): FlagOverrides {
    if (!import.meta.env.DEV) return {};
    
    try {
      const stored = localStorage.getItem(OVERRIDE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to parse flag overrides from localStorage:', error);
      return {};
    }
  }

  /**
   * Sets a flag override in localStorage
   */
  static setOverride(flagKey: string, value: LDFlagValue): void {
    if (!import.meta.env.DEV) {
      console.warn('Flag overrides are only available in development mode');
      return;
    }

    try {
      const overrides = this.getOverrides();
      overrides[flagKey] = value;
      localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
      
      // Dispatch storage event for cross-tab updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: OVERRIDE_KEY,
        newValue: JSON.stringify(overrides),
        oldValue: localStorage.getItem(OVERRIDE_KEY)
      }));
      
      console.log(`🚩 Override set: ${flagKey} = ${value}`);
    } catch (error) {
      console.error('Failed to set flag override:', error);
    }
  }

  /**
   * Removes a flag override from localStorage
   */
  static removeOverride(flagKey: string): void {
    if (!import.meta.env.DEV) return;

    try {
      const overrides = this.getOverrides();
      delete overrides[flagKey];
      localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
      
      console.log(`🚩 Override removed: ${flagKey}`);
    } catch (error) {
      console.error('Failed to remove flag override:', error);
    }
  }

  /**
   * Clears all flag overrides
   */
  static clearAllOverrides(): void {
    if (!import.meta.env.DEV) return;

    try {
      localStorage.removeItem(OVERRIDE_KEY);
      console.log('🚩 All flag overrides cleared');
    } catch (error) {
      console.error('Failed to clear flag overrides:', error);
    }
  }

  /**
   * Lists all active overrides
   */
  static listOverrides(): void {
    if (!import.meta.env.DEV) return;

    const overrides = this.getOverrides();
    const entries = Object.entries(overrides);
    
    if (entries.length === 0) {
      console.log('🚩 No active flag overrides');
      return;
    }

    console.log('🚩 Active flag overrides:');
    entries.forEach(([flag, value]) => {
      console.log(`  ${flag}: ${value}`);
    });
  }
}

/**
 * Hook that wraps useFlags with localStorage overrides
 */
export function useDevFlags(): Record<string, LDFlagValue> {
  const ldFlags = useLDFlags();
  const [overrides, setOverrides] = useState<FlagOverrides>({});

  useEffect(() => {
    // Only enable in development
    if (!import.meta.env.DEV) return;

    // Load initial overrides
    setOverrides(DevFlagOverrides.getOverrides());

    // Listen for storage changes (from other tabs or programmatic changes)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === OVERRIDE_KEY) {
        try {
          const newOverrides = event.newValue ? JSON.parse(event.newValue) : {};
          setOverrides(newOverrides);
        } catch (error) {
          console.warn('Failed to parse override update:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // In development, merge overrides with LaunchDarkly flags
  if (import.meta.env.DEV) {
    return { ...ldFlags, ...overrides };
  }

  return ldFlags;
}

/**
 | * Hook that wraps flag evaluation with localStorage overrides
 | */
export function useDevFlag<T extends LDFlagValue>(flagKey: string, defaultValue?: T): T {
  const ldClient = useLDClient();
  const [override, setOverride] = useState<T | null>(null);
  const [ldValue, setLdValue] = useState<T | undefined>(defaultValue);

  useEffect(() => {
    // Only enable in development
    if (!import.meta.env.DEV) return;

    // Check for override on mount
    const checkOverride = () => {
      const overrides = DevFlagOverrides.getOverrides();
      if (flagKey in overrides) {
        setOverride(overrides[flagKey] as T);
      } else {
        setOverride(null);
      }
    };

    checkOverride();

    // Listen for storage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === OVERRIDE_KEY) {
        checkOverride();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [flagKey]);

  useEffect(() => {
    // Get flag value from LaunchDarkly client
    if (ldClient && !override) {
      const value = ldClient.variation(flagKey, defaultValue);
      setLdValue(value as T);
    }
  }, [ldClient, flagKey, defaultValue, override]);

  // Return override if present in development, otherwise LaunchDarkly value
  if (import.meta.env.DEV && override !== null) {
    return override;
  }

  return ldValue ?? defaultValue as T;
}

/**
 * Development component that shows override status
 */
export function DevFlagOverrideStatus() {
  const [overrides, setOverrides] = useState<FlagOverrides>({});

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const updateOverrides = () => {
      setOverrides(DevFlagOverrides.getOverrides());
    };

    updateOverrides();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === OVERRIDE_KEY) {
        updateOverrides();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!import.meta.env.DEV) return null;

  const overrideEntries = Object.entries(overrides);
  
  if (overrideEntries.length === 0) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#1a1a1a',
        color: '#ffd700',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        border: '1px solid #ffd700',
        maxWidth: '300px'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        🚩 Flag Overrides Active
      </div>
      {overrideEntries.map(([flag, value]) => (
        <div key={flag} style={{ marginBottom: '4px' }}>
          <strong>{flag}:</strong> {String(value)}
        </div>
      ))}
      <button
        onClick={() => DevFlagOverrides.clearAllOverrides()}
        style={{
          background: 'transparent',
          border: '1px solid #ffd700',
          color: '#ffd700',
          padding: '4px 8px',
          fontSize: '10px',
          cursor: 'pointer',
          marginTop: '8px'
        }}
      >
        Clear All
      </button>
    </div>
  );
}

// Global utility functions for console use
if (import.meta.env.DEV) {
  // Add global utilities for easy console access
  (window as any).ldOverrides = {
    set: DevFlagOverrides.setOverride,
    remove: DevFlagOverrides.removeOverride,
    clear: DevFlagOverrides.clearAllOverrides,
    list: DevFlagOverrides.listOverrides
  };

  // Log available commands
  console.log('🚩 LaunchDarkly dev overrides available:');
  console.log('  ldOverrides.set("flagKey", true)  - Set flag override');
  console.log('  ldOverrides.remove("flagKey")     - Remove flag override');
  console.log('  ldOverrides.clear()               - Clear all overrides');
  console.log('  ldOverrides.list()                - List active overrides');
}
