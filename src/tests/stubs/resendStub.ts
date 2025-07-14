import { vi } from 'vitest'

// Stub for Resend API to work in Node.js test environment
export class Resend {
  emails = {
    send: vi.fn().mockResolvedValue({
      data: { id: 'test-email-id' },
      error: null,
    }),
  }

  constructor() {
    // Mock constructor
  }
}

export default Resend
