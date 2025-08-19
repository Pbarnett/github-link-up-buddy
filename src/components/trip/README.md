Phase 1 improvements in TripRequestForm and related modules

What was done
- Strong validation: Introduced a comprehensive Zod schema and wired it through react-hook-form via zodResolver, ensuring strict, typed validation for all fields.
- Robust submit flow: Added idempotency keys, AbortController with safe cleanup on re-submission/unmount, and retry/backoff for transient 5xx errors.
- Better error handling: Centralized error mapping with user-friendly toasts and structured logging; analytics events emitted across submit lifecycle.
- Accessibility: Added page-level live region announcing validation errors, focused the first invalid field on submit failure, and ensured UI “Form” primitives propagate aria-invalid and aria-describedby automatically. Audited key sections and aligned labels with controls.
- Performance and stability: Reduced re-renders using selective useWatch and useMemo for computed derivations.
- Testing: Stabilized unit tests for adapters/hooks and introduced MSW-backed integration tests for submit flows (including 422 and 500 scenarios). CI configured with a Vitest workspace split for unit/integration.

Key files
- src/components/trip/TripRequestForm.tsx
- src/types/form.ts (schema)
- src/services/tripRequestAdapter.ts (transform + idempotency)
- src/components/ui/form.tsx (a11y wiring for form controls)
- src/components/trip/sections/* (sectionized inputs)

Notes on a11y
- The FormControl in src/components/ui/form.tsx assigns ids and describedby/message ids to inputs and messages, so individual inputs inherit aria-invalid/aria-describedby automatically when used under FormField/FormItem.
- Labels should come from FormLabel associated with the same FormItem to maintain correct for/id linkage. Where we had manual htmlFor/id usage, we aligned to FormLabel without explicit ids to avoid conflicts with generated ids.

Next steps
- Optional: Add a quick render-count test or dev profile pass for the date pickers and selects to confirm no regressions.
- Continue with Phase 3 observability and broader integration coverage.

