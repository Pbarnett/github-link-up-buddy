import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/supabase/**',
      '**/e2e-tests/**',
      '**/*.e2e.test.ts',
      '**/*.e2e.test.tsx',
      '**/*.spec.e2e.ts',
      '**/*.spec.e2e.tsx'
    ],
  },
});
