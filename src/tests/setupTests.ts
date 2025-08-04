// Test setup file for Vitest
import * as React from 'react';
import { Fragment } from 'react';
import '@testing-library/jest-dom';
// Global test setup
Object.defineProperty(
  /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window,
  'matchMedia',
  {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  }
);

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '0px';
  thresholds: ReadonlyArray<number> = [];
  
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    // Mock implementation
  }
  observe() {}
  disconnect() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  disconnect() {}
  unobserve() {}
};

// Mock DOM APIs that Radix UI components expect
Object.defineProperty(Element.prototype, 'hasPointerCapture', {
  value: () => false,
  writable: true,
});

Object.defineProperty(Element.prototype, 'setPointerCapture', {
  value: () => {},
  writable: true,
});

Object.defineProperty(Element.prototype, 'releasePointerCapture', {
  value: () => {},
  writable: true,
});

// Mock scrollIntoView
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: () => {},
  writable: true,
});

// Mock getBoundingClientRect
Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
  value: () => ({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  }),
  writable: true,
});

// Mock range APIs for text selection with complete Range interface
const createMockRange = (): Range => ({
  setStart: () => {},
  setEnd: () => {},
  setStartBefore: () => {},
  setStartAfter: () => {},
  setEndBefore: () => {},
  setEndAfter: () => {},
  selectNode: () => {},
  selectNodeContents: () => {},
  collapse: () => {},
  cloneRange: () => createMockRange(),
  cloneContents: () => document.createDocumentFragment(),
  deleteContents: () => {},
  extractContents: () => document.createDocumentFragment(),
  insertNode: () => {},
  surroundContents: () => {},
  compareBoundaryPoints: () => 0,
  detach: () => {},
  toString: () => '',
  // Add missing Range properties
  comparePoint: () => 0,
  createContextualFragment: () => document.createDocumentFragment(),
  intersectsNode: () => false,
  isPointInRange: () => false,
  // Range constants with proper literal types
  START_TO_START: 0 as const,
  START_TO_END: 1 as const,
  END_TO_END: 2 as const,
  END_TO_START: 3 as const,
  // Existing properties
  commonAncestorContainer: document.body,
  collapsed: true,
  startContainer: document.body,
  startOffset: 0,
  endContainer: document.body,
  endOffset: 0,
  getBoundingClientRect: () => ({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  }),
  getClientRects: () => ({
    length: 0,
    item: () => null,
    [Symbol.iterator]: function* () {},
  }) as DOMRectList,
} as Range);

Object.defineProperty(document, 'createRange', {
  value: createMockRange,
  writable: true,
});

// Make sure global Range constructor is also available
if (!global.Range) {
  global.Range = function Range() {
    return createMockRange();
  } as any;
  global.Range.prototype = createMockRange();
}

// Mock /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.getSelection with complete Selection interface
const createMockSelection = () => ({
  removeAllRanges: () => {},
  addRange: () => {},
  collapse: () => {},
  collapseToEnd: () => {},
  collapseToStart: () => {},
  containsNode: () => false,
  deleteFromDocument: () => {},
  empty: () => {},
  extend: () => {},
  getRangeAt: () => createMockRange(),
  removeRange: () => {},
  selectAllChildren: () => {},
  setBaseAndExtent: () => {},
  setPosition: () => {},
  toString: () => '',
  // Add missing Selection properties
  direction: 'none' as 'forward' | 'backward' | 'none',
  modify: () => {},
  rangeCount: 0,
  anchorNode: null,
  anchorOffset: 0,
  focusNode: null,
  focusOffset: 0,
  isCollapsed: true,
  type: 'None',
});

Object.defineProperty(
  /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window,
  'getSelection',
  {
    value: createMockSelection,
    writable: true,
  }
);

Object.defineProperty(document, 'getSelection', {
  value: createMockSelection,
  writable: true,
});

// Global Selection constructor
if (!global.Selection) {
  global.Selection = function Selection() {
    return createMockSelection();
  } as any;
  global.Selection.prototype = createMockSelection();
}

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = (cb: FrameRequestCallback) => {
  return setTimeout(cb, 0);
};

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

// Mock HTMLElement methods
HTMLElement.prototype.focus = () => {};
HTMLElement.prototype.blur = () => {};
HTMLElement.prototype.click = () => {};

// Mock additional DOM methods that might be needed
HTMLElement.prototype.scrollTo = () => {};
HTMLElement.prototype.scroll = () => {};

// Mock CSS.supports for feature detection
if (!global.CSS) {
  global.CSS = {
    supports: () => false,
    escape: (str: string) => str,
  } as any;
}

// Mock MutationObserver if not already available
if (!global.MutationObserver) {
  global.MutationObserver = class MutationObserver {
    constructor(callback: MutationCallback) {}
    observe() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}

// Suppress console warnings during tests (optional)
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning:') ||
      args[0].includes('hasPointerCapture') ||
      args[0].includes('cloneRange') ||
      args[0].includes('React Router Future Flag Warning'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};

console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('React Router Future Flag Warning') ||
      args[0].includes('pointer-events: none'))
  ) {
    return;
  }
  originalWarn.call(console, ...args);
};
