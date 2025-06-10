/// <reference types="vitest/globals" />
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest'; // Import jest-dom matchers for Vitest

// JSDOM Polyfills for Radix UI and other components

// Pointer Events
if (!global.PointerEvent) {
  // Basic PointerEvent class if not present
  class PointerEvent extends MouseEvent { // Inheriting from MouseEvent for more properties
    public pointerId?: number;
    public pointerType?: string;
    // Add other properties as needed by tests or components
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId;
      this.pointerType = params.pointerType;
    }
  }
  global.PointerEvent = PointerEvent as any;
}

Element.prototype.hasPointerCapture = Element.prototype.hasPointerCapture || vi.fn(() => false);
Element.prototype.setPointerCapture = Element.prototype.setPointerCapture || vi.fn();
Element.prototype.releasePointerCapture = Element.prototype.releasePointerCapture || vi.fn();

// scrollIntoView
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || vi.fn();

// ResizeObserver - common for some UI components, good to have a basic mock
if (!global.ResizeObserver) {
  class ResizeObserver {
    observe() { /* do nothing */ }
    unobserve() { /* do nothing */ }
    disconnect() { /* do nothing */ }
  }
  global.ResizeObserver = ResizeObserver;
}

// IntersectionObserver - also common
if (!global.IntersectionObserver) {
  class IntersectionObserver {
    observe() { /* do nothing */ }
    unobserve() { /* do nothing */ }
    disconnect() { /* do nothing */ }
    takeRecords() { return []; }
  }
  global.IntersectionObserver = IntersectionObserver;
  // Add rootMargin, thresholds etc. to prototype if needed by tests
  (global.IntersectionObserver as any).prototype.root = null;
  (global.IntersectionObserver as any).prototype.rootMargin = '';
  (global.IntersectionObserver as any).prototype.thresholds = [0];
}

// matchMedia - for responsive hooks/components
window.matchMedia = window.matchMedia || vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// --- End of JSDOM Polyfills ---

// Mock Supabase client and auth (basic mock for useCurrentUser)
// This is a very basic mock. Depending on how useCurrentUser is implemented
// and what other Supabase features are used, this might need to be more sophisticated.
vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(() => ({
    userId: 'test-user-id-123', // Provide a mock user ID
    user: { id: 'test-user-id-123', email: 'test@example.com' }, // Provide mock user object
    isLoading: false,
    // Add any other properties returned by your actual useCurrentUser hook
  })),
}));

// Mock supabase client if it's directly imported and used in components for non-auth calls
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: {}, error: null }), // Default single mock
    rpc: vi.fn().mockResolvedValue({ data: {}, error: null }), // Default rpc mock
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: {}, error: null }),
    },
    // Mock other Supabase client methods as needed by your components during tests
  },
}));

console.log('Test setup file (src/tests/setupTests.ts) loaded.');
