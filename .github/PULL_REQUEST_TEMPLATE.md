## Summary

Describe the changes and why they’re needed.

## Checklist
- [ ] Workflows do NOT use pnpm/action-setup (Corepack is used instead)
- [ ] package.json contains "packageManager": "pnpm@8.15.5"
- [ ] CI enables Corepack and prepares pnpm from package.json
- [ ] Auth-sensitive files reviewed if applicable (src/pages/Login.tsx, src/pages/AuthCallback.tsx, src/components/AuthGuard.tsx, src/services/userInitialization.ts)
- [ ] Tests updated or added as needed (unit/integration/E2E)

## Screenshots/Artifacts (if any)

## Risks and Rollback
- Risk level: low/medium/high
- Rollback plan:
