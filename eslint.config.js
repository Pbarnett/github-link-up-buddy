import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'dist',
      '.patch-bundles/**',
      // Keep infra/packages/lib/app ignored if not lint targets
      'infra/**',
      'packages/**',
      'lib/**',
      'app/**',
      // Do not ignore src or tests to ensure lint enforcement
      // 'supabase/**',
      'tailwind.config.ts',
      'useFlightOffers_baseline.ts',
      'validate-production-deployment.ts',
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import': importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // 'import/no-unresolved': ['error'], // Temporarily disabled for sanity check
    },
  },
);
