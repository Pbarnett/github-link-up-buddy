# Github Link-Up Buddy

This repository contains the Parker Flight web app (React + Vite), local server (Express), Supabase Edge functions, and infrastructure/monitoring configs.

Quick links
- Contributing: see CONTRIBUTING.md for setup, hooks, tests, and CI policies
- Repository organization: docs/REPOSITORY_ORGANIZATION_GUIDELINES.md

## Feature Flag Utilities

### userInBucket

`userInBucket(userId: string, rollout: number) => boolean`

- Description: Determines if a user falls within the specified rollout percentage using consistent hashing with MurmurHash.
- Parameters:
  - userId (string): The unique user identifier.
  - rollout (number): The rollout percentage (0-100).
- Returns: true if the user should see the feature, false otherwise.
- Why MurmurHash? Fast, non-cryptographic, stable across runtimes — ideal for consistent user bucketing.

### Example Usage

```typescript
type UserId = string
const isEligible = userInBucket('user123', 10)
console.log(isEligible) // true if user falls within the 10% rollout
```

## CI highlights
- Lint + Type-check on PRs/Pushes to main/develop (pnpm via Corepack)
- Prettier check enforced
- Anti-pattern guard: no remote https imports in tests/vi.mock
- Unit/Integration tests with coverage thresholds
- Edge functions tests with coverage thresholds
- E2E Smoke on all PRs
- Comprehensive nightly/main: E2E, visual, Lighthouse, k6
- Security & secrets scan workflow (blocks on high/critical and detected secrets)

## Developer bootstrap
- Install deps: pnpm install
- Enable hooks: ./scripts/development/git-hooks-setup.sh
- Dev server: pnpm run dev
- Run smoke test locally: pnpm run test:smoke

