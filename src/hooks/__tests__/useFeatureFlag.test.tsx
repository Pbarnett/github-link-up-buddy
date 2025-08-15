import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock LD SDK to read flags from our test harness context
vi.mock('launchdarkly-react-client-sdk', () => {
  const React = require('react');
  const { FlagsContext } = require('@/tests/utils/LDTestHarness');
  return {
    useFlags: () => React.useContext(FlagsContext),
  };
});

describe('useFeatureFlag', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('LD_PRESET_FLAGS');
      (global as any).navigator = { userAgent: 'jsdom' };
      (global as any).location = { hostname: 'localhost' } as any;
      (import.meta as any).env = { VITE_PLAYWRIGHT_TEST: 'false', VITE_WALLET_UI_ENABLED: 'false' };
    }
  });

  it.skip('returns LaunchDarkly value when available', async () => {
    vi.mock('launchdarkly-react-client-sdk', () => ({
      useFlags: () => ({ wallet_ui: true, profile_ui_revamp: false }),
    }));
    vi.mock('@/hooks/useCurrentUser', () => ({
      useCurrentUser: () => ({ user: { id: 'user-123', email: 'u@example.com' } }),
    }));
    const { LDTestHarness } = await import('@/tests/utils/LDTestHarness');
    const { useFeatureFlag } = await import('@/hooks/useFeatureFlag');
    const wrapper = ({ children }: any) => (
      <LDTestHarness flags={{ wallet_ui: true, profile_ui_revamp: false }}>
        {children}
      </LDTestHarness>
    );
    const { result } = renderHook(() => useFeatureFlag('wallet_ui', false), { wrapper });
    expect(result.current.data).toBe(true);
  });

  it.skip('falls back to default when flag not set', async () => {
    vi.mock('launchdarkly-react-client-sdk', () => ({ useFlags: () => ({}) }));
    vi.mock('@/hooks/useCurrentUser', () => ({ useCurrentUser: () => ({ user: { id: 'u1' } }) }));
    const { LDTestHarness } = await import('@/tests/utils/LDTestHarness');
    const { useFeatureFlag } = await import('@/hooks/useFeatureFlag');
    const wrapper = ({ children }: any) => (
      <LDTestHarness flags={{}}>
        {children}
      </LDTestHarness>
    );
    const { result } = renderHook(() => useFeatureFlag('nonexistent_flag', false), { wrapper });
    expect(result.current.data).toBe(false);
  });

  it.skip('honors localStorage LD_PRESET_FLAGS override', async () => {
    vi.mock('launchdarkly-react-client-sdk', () => ({ useFlags: () => ({}) }));
    vi.mock('@/hooks/useCurrentUser', () => ({ useCurrentUser: () => ({ user: { id: 'u2' } }) }));
    window.localStorage.setItem('LD_PRESET_FLAGS', JSON.stringify({ profile_ui_revamp: true }));
    const { LDTestHarness } = await import('@/tests/utils/LDTestHarness');
    const { useFeatureFlag } = await import('@/hooks/useFeatureFlag');
    const wrapper = ({ children }: any) => (
      <LDTestHarness flags={{}}>
        {children}
      </LDTestHarness>
    );
    const { result } = renderHook(() => useFeatureFlag('profile_ui_revamp', false), { wrapper });
    expect(result.current.data).toBe(true);
  });

  it.skip('tracks personalization_greeting flag exposures', async () => {
    const tracker = vi.fn();
    vi.mock('launchdarkly-react-client-sdk', () => ({ useFlags: () => ({ personalization_greeting: true }) }));
    vi.mock('@/hooks/useCurrentUser', () => ({ useCurrentUser: () => ({ user: { id: 'u3' } }) }));
    vi.mock('@/lib/featureFlags/launchDarklyService', () => ({ trackPersonalizationSeen: tracker }));

    const { LDTestHarness } = await import('@/tests/utils/LDTestHarness');
    const { useFeatureFlag } = await import('@/hooks/useFeatureFlag');
    const wrapper = ({ children }: any) => (
      <LDTestHarness flags={{ personalization_greeting: true }}>
        {children}
      </LDTestHarness>
    );
    renderHook(() => useFeatureFlag('personalization_greeting', false), { wrapper });
    expect(tracker).toHaveBeenCalled();
  });
});
