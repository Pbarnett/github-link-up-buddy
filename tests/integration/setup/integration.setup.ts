// Silence noisy console.warn/error during integration tests where we expect logged warnings/errors.
// You can still opt-in to see logs in a specific test by temporarily restoring the originals.

const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    // Allow explicit opt-in via environment variable for debugging in CI
    if (process.env.VITEST_DEBUG_LOGS === 'true') return originalError(...args)
    // Suppress known noisy patterns to avoid failing tests that assert UI states, not logs
    const msg = String(args[0] ?? '')
    if (
      /FilterPipeline] Filter .* failed:/.test(msg) ||
      /Limited processing to .* offers/.test(msg) ||
      /Business rules API not available/.test(msg) ||
      /Error in transformAmadeusToOffers/.test(msg)
    ) {
      return
    }
    // Default: forward other errors
    return originalError(...args)
  }

  console.warn = (...args) => {
    if (process.env.VITEST_DEBUG_LOGS === 'true') return originalWarn(...args)
    const msg = String(args[0] ?? '')
    if (/Limited processing to .* offers/.test(msg) || /Business rules API not available/.test(msg)) {
      return
    }
    return originalWarn(...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})

