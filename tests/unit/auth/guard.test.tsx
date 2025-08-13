import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RequireAuth from '@/components/auth/RequireAuth';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Minimal mock for AuthModal child rendering side effect
vi.mock('@/components/auth/AuthModal', () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) => open ? React.createElement('div', { 'data-testid': 'auth-modal' }, 'Auth Modal') : null,
}));

describe('RequireAuth', () => {
  const { useAuth } = await import('@/hooks/useAuth');

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('opens AuthModal when not authenticated and preserves returnTo', async () => {
    (useAuth as any).mockReturnValue({ user: null, loading: false });

    const setItemSpy = vi.spyOn(window.sessionStorage.__proto__, 'setItem');

    render(
      <RequireAuth reason="checkout">
        <div>Private Content</div>
      </RequireAuth>
    );

    // Modal should render
    expect(await screen.findByTestId('auth-modal')).toBeInTheDocument();

    // ReturnTo should be written
    expect(setItemSpy).toHaveBeenCalled();
  });

  it('renders children when authenticated', () => {
    (useAuth as any).mockReturnValue({ user: { id: 'user_1', email: 'u@example.com' }, loading: false });

    render(
      <RequireAuth>
        <div data-testid="protected">Private Content</div>
      </RequireAuth>
    );

    expect(screen.getByTestId('protected')).toBeInTheDocument();
  });
});

