
import { defineConfig } from 'vitest/config';
import path from 'path'; // Import path module

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true, // This enables global APIs like vi, describe, it, expect
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/supabase/**'
    ],
    setupFiles: ['./src/tests/setupTests.ts'], // Added setup file
    types: ['vitest/globals', '@testing-library/jest-dom'], // Added vitest/globals for vi namespace
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
  // Add optimizeDeps to help Vite pre-bundle these for Vitest
  optimizeDeps: {
    include: [
      '@radix-ui/react-select',
      '@radix-ui/react-label',
      '@radix-ui/react-switch',
      '@radix-ui/react-popover', // Often used with select
      '@radix-ui/react-dialog',  // Common UI component
      '@hookform/resolvers',     // Form handling
      'zod',                     // Schema validation
      // Add other potentially problematic UI or large deps here
    ],
  },
});
