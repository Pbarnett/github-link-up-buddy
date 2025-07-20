
import * as React from 'react';
type ReactNode = React.ReactNode;
type Component<P = {}, S = {}> = React.Component<P, S>;

import { vi } from 'vitest';

// Mock LaunchDarkly React SDK
const mockLDClient = {
  variation: vi.fn((key: string, defaultValue: any) => defaultValue),
  allFlags: vi.fn(() => ({})),
  track: vi.fn(),
  identify: vi.fn(),
  flush: vi.fn(),
  close: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  setStreaming: vi.fn(),
};

// Mock LaunchDarkly hooks
const mockUseFlags = vi.fn(() => ({}));
const mockUseLDClient = vi.fn(() => mockLDClient);
const mockUseFlag = vi.fn((key: string, defaultValue: any) => defaultValue);

// Mock LaunchDarkly Provider components
const MockLDProvider = ({ children }: { children: ReactNode }) => {
  return React.createElement(React.Fragment, {}, children);
};

// Mock asyncWithLDProvider to return a simple provider
const mockAsyncWithLDProvider = vi.fn().mockResolvedValue(MockLDProvider);

// Mock withLDProvider HOC
const mockWithLDProvider = vi.fn((config: any) => (Component: ComponentType) => {
  return (props: any) => React.createElement(Component, props);
});

// Export all mocks
export {
  mockLDClient,
  mockUseFlags,
  mockUseLDClient,
  mockUseFlag,
  MockLDProvider,
  mockAsyncWithLDProvider,
  mockWithLDProvider,
};

// Default export for direct module mocking
export default {
  useFlags: mockUseFlags,
  useLDClient: mockUseLDClient,
  useFlag: mockUseFlag,
  LDProvider: MockLDProvider,
  asyncWithLDProvider: mockAsyncWithLDProvider,
  withLDProvider: mockWithLDProvider,
};
