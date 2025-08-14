# Testing guide (E2E/CI-only)

- Critical E2E locally:
  - pnpm install && npx playwright install --with-deps
  - pnpm run test:e2e:critical
- Against preview (8080):
  - Terminal A: pnpm build && PORT=8080 pnpm preview
  - Terminal B: E2E_BASE_URL=http://localhost:8080 pnpm run test:e2e:critical

Optional suites:
- TripRequestForm: pnpm run test:e2e:trip-request
- OAuth callback (mocked): pnpm run test:e2e:callback
- Visual: pnpm run test:visual

