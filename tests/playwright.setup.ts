/**
 * Playwright Test Setup
 * Ensures clean test environment without Vitest interference
 */

// Clear any existing globals that might conflict
const globalContext = globalThis as any;

// Save original console methods in case they get overridden
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info
};

// Clear all potential Vitest globals
delete globalContext.describe;
delete globalContext.test;
delete globalContext.it;
delete globalContext.expect;
delete globalContext.vi;
delete globalContext.vitest;
delete globalContext.beforeEach;
delete globalContext.afterEach;
delete globalContext.beforeAll;
delete globalContext.afterAll;
delete globalContext.suite;

// Restore console methods
Object.assign(console, originalConsole);

// Explicitly import and set Playwright's expect
import { expect as playwrightExpect } from '@playwright/test';
globalContext.expect = playwrightExpect;

// Set up minimal environment for Node.js crypto (needed for external services tests)
if (typeof globalThis.crypto === 'undefined') {
  import('node:crypto').then(nodeCrypto => {
    (globalThis as any).crypto = {
      getRandomValues: nodeCrypto.getRandomValues || function(arr: any) {
        const bytes = nodeCrypto.randomBytes(arr.length);
        for (let i = 0; i < arr.length; i++) {
          arr[i] = bytes[i];
        }
        return arr;
      },
      randomUUID: nodeCrypto.randomUUID || function() {
        return nodeCrypto.randomBytes(16).toString('hex');
      },
      subtle: nodeCrypto.webcrypto?.subtle || {}
    };
  }).catch(() => {
    // Crypto polyfill failed, continue without it
  });
}

export {};
