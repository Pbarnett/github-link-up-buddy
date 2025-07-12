// tests/__mocks__/resend.ts
import { vi } from 'vitest';

let mockCallCount = 0;

export const mockResendEmailsSend = vi.fn(() => {
  mockCallCount++;
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
  mockCallCount = 0;
}
