import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

// Hoisted tracker mock for personalization exposure
const tracker = vi.fn();
vi.mock('@/lib/featureFlags/launchDarklyService', () => ({
  trackPersonalizationSeen: (...args: any[]) => tracker(...args),
}));

describe('useFeatureFlag', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unmock('@/hooks/useFeatureFlag');

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('LD_PRESET_FLAGS');
      (global as any).navigator = { userAgent: 'jsdom' };
      (global as any).location = { hostname: 'localhost' } as any;
      (import.meta as any).env = { VITE_PLAYWRIGHT_TEST: 'false', VITE_WALLET_UI_ENABLED: 'false' };
    }
  });

  it('returns true when LD_PRESET_FLAGS enables wallet_ui', async () => {
    window.localStorage.setItem('LD_PRESET_FLAGS', JSON.stringify({ wallet_ui: true }));
    vi.mock('launchdarkly-react-client-sdk', () => ({ useFlags: () => ({}) }));
    vi.mock('@/hooks/useCurrentUser', () => ({
      useCurrentUser: () => ({ user: { id: 'user-123', email: 'u@example.com' } }),
    }));

    const { useFeatureFlag } = await import('@/hooks/useFeatureFlag');
    const { result } = renderHook(() => useFeatureFlag('wallet_ui', false));
    expect(result.current.data).toBe(true);
  });

  it('falls back to default when flag not set', async () => {
    vi.mock('launchdarkly-react-client-sdk', () => ({ useFlags: () => ({}) }));
    vi.mock('@/hooks/useCurrentUser', () => ({ useCurrentUser: () => ({ user: { id: 'u1' } }) }));

    const { useFeatureFlag } = await import('@/hooks/useFeatureFlag');
    const { result } = renderHook(() => useFeatureFlag('nonexistent_flag', false));
    expect(result.current.data).toBe(false);
  });

  it('honors localStorage LD_PRESET_FLAGS override for profile_ui_revamp', async () => {
    vi.mock('launchdarkly-react-client-sdk', () => ({ useFlags: () => ({}) }));
    vi.mock('@/hooks/useCurrentUser', () => ({ useCurrentUser: () => ({ user: { id: 'u2' } }) }));

    window.localStorage.setItem('LD_PRESET_FLAGS', JSON.stringify({ profile_ui_revamp: true }));
    const { useFeatureFlag } = await import('@/hooks/useFeatureFlag');
    const { result } = renderHook(() => useFeatureFlag('profile_ui_revamp', false));
    expect(result.current.data).toBe(true);
  });

  it('tracks personalization_greeting flag exposures', async () => {
    vi.mock('launchdarkly-react-client-sdk', () => ({ useFlags: () => ({ personalization_greeting: true }) }));
    vi.mock('@/hooks/useCurrentUser', () => ({ useCurrentUser: () => ({ user: { id: 'u3' } }) }));

    const { useFeatureFlag } = await import('@/hooks/useFeatureFlag');
    renderHook(() => useFeatureFlag('personalization_greeting', false));
    expect(tracker).toHaveBeenCalled();
  });
});
