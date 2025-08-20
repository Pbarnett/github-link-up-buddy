import { describe, it, expect } from 'vitest'

// Diagnostic test to verify alias resolution inside Vitest

describe('Alias resolution diagnostics', () => {
  it('resolves @/types/form', async () => {
    try {
      const mod = await import('@/types/form')
      expect(mod).toBeDefined()
    } catch (e) {
      console.error('Failed to resolve alias for @/types/form:', e)
      throw e
    }
  })

  it('resolves @shared/featureFlag', async () => {
    try {
      const mod = await import('@shared/featureFlag')
      expect(mod).toBeDefined()
    } catch (e) {
      console.error('Failed to resolve alias for @shared/featureFlag:', e)
      throw e
    }
  })

  it('resolves @/integrations/supabase/client', async () => {
    try {
      const mod = await import('@/integrations/supabase/client')
      expect(mod).toBeDefined()
    } catch (e) {
      console.error('Failed to resolve alias for @/integrations/supabase/client:', e)
      throw e
    }
  })
})

