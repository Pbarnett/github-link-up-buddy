
import { render as rtlRender, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'

import { vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest'; // Import jest-dom matchers for Vitest

// Cleanup after each test
afterEach(() => {
  // Only do React cleanup if we have RTL available (DOM environment)
  if (typeof window !== 'undefined') {
    cleanup();
    
    // Additional cleanup for Radix UI components
    // Press Escape key to close any open Radix UI components
    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      keyCode: 27,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(escapeEvent);
    
    // Force close any open popovers, dialogs, or comboboxes
    const openPopovers = document.querySelectorAll('[data-radix-popper-content-wrapper]');
    openPopovers.forEach(popover => popover.remove());
    
    const openPortals = document.querySelectorAll('[data-radix-portal]');
    openPortals.forEach(portal => portal.remove());
    
    // Clear any content that might have been portaled
    const radixContent = document.querySelectorAll('[data-state="open"]');
    radixContent.forEach(element => {
      element.setAttribute('data-state', 'closed');
      (element as HTMLElement).style.display = 'none';
    });
    
    // Reset body styles that might be set by Radix UI
    document.body.style.pointerEvents = '';
    document.body.removeAttribute('data-scroll-locked');
    
    // Clear any remaining focus guards and overlays
    const focusGuards = document.querySelectorAll('[data-radix-focus-guard]');
    focusGuards.forEach(guard => guard.remove());
    
    // Force remove any select content elements
    const selectContent = document.querySelectorAll('[role="listbox"]');
    selectContent.forEach(content => content.remove());
  }
});

// Wrap all components in a router for tests
export function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, { wrapper: MemoryRouter, ...options })
}

// Re-export everything else from RTL
export * from '@testing-library/react'

// Only setup DOM-specific mocks if we're in a DOM environment (not Node)
if (typeof window !== 'undefined') {
  console.log('Setting up DOM environment for frontend tests...');
  
  // Mock window.matchMedia for JSDOM
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false, // Default value for matches
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated but sometimes used
      removeListener: vi.fn(), // Deprecated but sometimes used
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  
  // Polyfill for JSDom compatibility with Radix UI
  Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
    value: function() { return false; },
    writable: true,
  });

  Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
    value: function() {},
    writable: true,
  });

  Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
    value: function() {},
    writable: true,
  });

  // Polyfill for scrollIntoView used by Radix UI components
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    value: function() {},
    writable: true,
  });
} else {
  console.log('Setting up Node environment for backend/Edge Function tests...');
}

// Mock ResizeObserver for both environments (global for Node, window for DOM)
const mockResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

if (typeof global !== 'undefined') {
  global.ResizeObserver = mockResizeObserver;
}
if (typeof window !== 'undefined') {
  (window as any).ResizeObserver = mockResizeObserver;
}

// Mock Supabase client and auth (basic mock for useCurrentUser)
vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(() => ({
    userId: 'test-user-id-123',
    user: { id: 'test-user-id-123', email: 'test@example.com' },
    isLoading: false,
  })),
}));

// Mock usePaymentMethods hook
vi.mock('@/hooks/usePaymentMethods', () => ({
  usePaymentMethods: vi.fn(() => ({
    data: [],
    isLoading: false,
    error: undefined,
    refetch: vi.fn(),
  })),
}));

// Create a shared mock supabase client that can be accessed by different tests
const mockSupabaseClient = {
  auth: {
    getSession: vi.fn().mockResolvedValue({
      data: { session: { access_token: 'mock-token' } },
      error: null,
    }),
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user-id-123', email: 'test@example.com' } },
      error: null,
    }),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    admin: {
      getUserById: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id-123', email: 'test@example.com' } },
        error: null,
      }),
    },
    signOut: vi.fn().mockResolvedValue({ error: null }),
  },
  from: vi.fn().mockImplementation(() => {
    const createMockQueryBuilder = () => ({
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      like: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      contains: vi.fn().mockReturnThis(),
      containedBy: vi.fn().mockReturnThis(),
      rangeGt: vi.fn().mockReturnThis(),
      rangeGte: vi.fn().mockReturnThis(),
      rangeLt: vi.fn().mockReturnThis(),
      rangeLte: vi.fn().mockReturnThis(),
      rangeAdjacent: vi.fn().mockReturnThis(),
      overlaps: vi.fn().mockReturnThis(),
      textSearch: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      filter: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: {}, error: null }),
      then: vi.fn().mockResolvedValue({ data: [], error: null }),
      // Add promise-like behavior for awaiting
      catch: vi.fn(),
      finally: vi.fn(),
    });
    return createMockQueryBuilder();
  }),
  rpc: vi.fn().mockResolvedValue({ data: {}, error: null }),
  functions: {
    invoke: vi.fn().mockResolvedValue({ data: {}, error: null }),
  },
  channel: vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
  })),
  removeChannel: vi.fn(),
};

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient,
}));

// Export the mock client for use in tests
(globalThis as any).mockSupabaseClient = mockSupabaseClient;

// Global mock for toast functionality
vi.mock('@/components/ui/use-toast', () => {
  const mockToast = vi.fn();
  return {
    useToast: () => ({ toast: mockToast }),
    toast: mockToast,
  };
});

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn().mockImplementation(() => ({
    invalidateQueries: vi.fn(),
    getQueryData: vi.fn(),
    setQueryData: vi.fn(),
    clear: vi.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
    getQueryData: vi.fn(),
    setQueryData: vi.fn(),
  })),
  useQuery: vi.fn(() => ({
    data: undefined,
    isLoading: false,
    error: null,
    isError: false,
    refetch: vi.fn(),
  })),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isLoading: false,
    isError: false,
    error: null,
    data: undefined,
  })),
}));

// Setup calendar mocks for reliable testing
const setupCalendarMocks = () => {
  // Mock react-day-picker's DayPicker component
  vi.mock('react-day-picker', () => {
    const MockDayPicker = ({ selected, onSelect, disabled, ...props }: any) => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      const handleDateClick = (date: Date) => {
        if (disabled && disabled(date)) return;
        if (onSelect) {
          onSelect(date);
        }
      };
      
      return React.createElement('div', {
        'data-testid': 'mock-day-picker',
        role: 'grid',
        className: 'calendar-mock'
      }, [
        React.createElement('button', {
          key: 'tomorrow',
          type: 'button',
          role: 'button',
          name: tomorrow.getDate().toString(),
          onClick: () => handleDateClick(tomorrow),
          'data-testid': 'calendar-day-tomorrow',
          className: 'calendar-day'
        }, tomorrow.getDate().toString()),
        React.createElement('button', {
          key: 'next-week',
          type: 'button',
          role: 'button',
          name: nextWeek.getDate().toString(),
          onClick: () => handleDateClick(nextWeek),
          'data-testid': 'calendar-day-next-week',
          className: 'calendar-day'
        }, nextWeek.getDate().toString())
      ]);
    };
    
    return {
      DayPicker: MockDayPicker
    };
  });

  // Mock our Calendar UI component to directly use the MockDayPicker
  vi.mock('@/components/ui/calendar', () => {
    const MockCalendar = ({ selected, onSelect, disabled, ...props }: any) => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      const handleDateClick = (date: Date) => {
        if (disabled && disabled(date)) return;
        if (onSelect) {
          onSelect(date);
        }
      };
      
      return React.createElement('div', {
        'data-testid': 'mock-day-picker',
        role: 'grid',
        className: 'calendar-mock'
      }, [
        React.createElement('button', {
          key: 'tomorrow',
          type: 'button',
          role: 'button',
          name: tomorrow.getDate().toString(),
          onClick: () => handleDateClick(tomorrow),
          'data-testid': 'calendar-day-tomorrow',
          className: 'calendar-day'
        }, tomorrow.getDate().toString()),
        React.createElement('button', {
          key: 'next-week',
          type: 'button',
          role: 'button',
          name: nextWeek.getDate().toString(),
          onClick: () => handleDateClick(nextWeek),
          'data-testid': 'calendar-day-next-week',
          className: 'calendar-day'
        }, nextWeek.getDate().toString())
      ]);
    };
    
    return {
      Calendar: MockCalendar
    };
  });
};

// Apply calendar mocks
setupCalendarMocks();

console.log('Test setup file (src/tests/setupTests.ts) loaded with calendar mocks.');
