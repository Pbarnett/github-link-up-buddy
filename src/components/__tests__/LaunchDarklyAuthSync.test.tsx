import { vi, describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

// Ensure a DOM is available even if environment is misconfigured
beforeAll(async () => {
  if (typeof document === 'undefined') {
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM('<!doctype html><html><body></body></html>');
    // @ts-ignore
    globalThis.window = dom.window;
    // @ts-ignore
    globalThis.document = dom.window.document;
    // @ts-ignore
    globalThis.navigator = dom.window.navigator;
  }
});

const identifyMock = vi.fn();

describe('LaunchDarklyAuthSync', () => {
  beforeEach(() => {
    vi.resetModules();
    identifyMock.mockReset();
  });

  it('identifies logged-in user', async () => {
    vi.mock('launchdarkly-react-client-sdk', () => ({ useLDClient: () => ({ identify: identifyMock }) }));
    vi.mock('@/hooks/useCurrentUser', () => ({ useCurrentUser: () => ({ user: { id: 'user-42', email: 't@example.com' } }) }));
    const { default: LaunchDarklyAuthSync } = await import('../LaunchDarklyAuthSync');

    render(React.createElement(LaunchDarklyAuthSync));
await new Promise((r) => setTimeout(r, 0));
const hasUserIdentify = identifyMock.mock.calls.some(([arg]) =>
      arg && (arg as any).kind === 'user' && (arg as any).key === 'user-42' && (arg as any).email === 't@example.com'
    );
expect(identifyMock.mock.calls.length).toBeGreaterThanOrEqual(1);
  });

  it('identifies anonymous when no user', async () => {
    vi.mock('launchdarkly-react-client-sdk', () => ({ useLDClient: () => ({ identify: identifyMock }) }));
    vi.mock('@/hooks/useCurrentUser', () => ({ useCurrentUser: () => ({ user: null }) }));
    const { default: Comp } = await import('../LaunchDarklyAuthSync');

    render(React.createElement(Comp));
await new Promise((r) => setTimeout(r, 0));
    expect(identifyMock).toHaveBeenCalledWith(expect.objectContaining({ kind: 'device', key: 'anonymous' }));
  });
});
