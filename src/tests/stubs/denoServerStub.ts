import { vi } from 'vitest'

// Stub for Deno's serve function to work in Node.js test environment
export const serve = vi.fn((handler: Function) => {
  // Return a mock server object
  return {
    shutdown: vi.fn(),
    finished: Promise.resolve(),
  }
})

// Additional Deno std exports that might be used
export default {
  serve,
}
