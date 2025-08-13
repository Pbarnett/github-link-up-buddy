import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthModal from '@/components/auth/AuthModal';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    signInWithGoogle: vi.fn(() => Promise.resolve()),
    signInWithEmailOtp: vi.fn(() => Promise.resolve()),
  }),
}));

// Provide a minimal analytics mock on window
beforeEach(() => {
  (window as any).analytics = { track: vi.fn() };
});

describe('AuthModal', () => {
  it('emits auth_prompt_shown when choosing Google', () => {
    render(<AuthModal open={true} onOpenChange={() => {}} reason="checkout" />);
    const btn = screen.getByText(/continue with google/i);
    fireEvent.click(btn);
    expect((window as any).analytics.track).toHaveBeenCalledWith('auth_prompt_shown', { reason: 'checkout' });
  });

  it('emits auth_prompt_shown when continuing with email', () => {
    render(<AuthModal open={true} onOpenChange={() => {}} reason="generic" />);
    const input = screen.getByLabelText(/email/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'user@example.com' } });
    const btn = screen.getByText(/continue with email/i);
    fireEvent.click(btn);
    expect((window as any).analytics.track).toHaveBeenCalledWith('auth_prompt_shown', { reason: 'generic' });
  });
});

