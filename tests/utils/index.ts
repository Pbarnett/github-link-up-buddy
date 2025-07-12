/**
 * @fileoverview Test utilities and helpers for Parker Flight
 * @module tests/utils
 */

// Re-export all test utilities for easy AI/LLM discovery
export * from './test-providers'
export * from './test-data'
export * from './setup-tests'

/**
 * Common test utilities for AI assistants:
 * 
 * - TestProviders: React Query and Supabase providers for testing
 * - createTestFlightOffer: Factory for flight offer test data
 * - createTestUser: Factory for user test data
 * - setupTests: Global test configuration
 * 
 * Usage:
 * ```typescript
 * import { TestProviders, createTestFlightOffer } from '@/tests/utils'
 * 
 * const mockOffer = createTestFlightOffer({ price: 299 })
 * render(
 *   <TestProviders>
 *     <Component offer={mockOffer} />
 *   </TestProviders>
 * )
 * ```
 */
