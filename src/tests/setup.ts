import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);


// Add any global test setup here
beforeAll(() => {
  // Any global setup
});

afterAll(() => {
  // Any global cleanup
});

