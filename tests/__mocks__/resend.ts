// tests/__mocks__/resend.ts
import { vi } from 'vitest';

export const mockResendEmailsSend = vi.fn(() => {
  return {
    data: { id: `SN_deadbeef` }, // Static ID matching test pattern
    error: null
  };
});

export const Resend = vi.fn(() => ({
  emails: { send: mockResendEmailsSend }
}));

export function __resetMocks() {
  vi.clearAllMocks();
}
