# UI refresh v1 (flagged)

Scope
- No feature changes, no schema changes
- All changes behind feature flag: ui_refresh_v1 (default OFF)

Includes
- src/styles/tokens.css
- src/components/ui/Field.tsx
- src/components/ui/MoneyInput.tsx
- src/components/ui/MonthPreset.tsx
- src/components/layout/SummaryBar.tsx
- src/components/trip/TripRequestForm.tsx
- src/components/trip/sections/EnhancedBudgetSection.tsx
- src/pages/Wallet.tsx
- src/main.tsx

Manual QA checklist
- Keyboard-only flow on Search and Auto Booking Step 1
- SummaryBar (aria-live) updates and does not steal focus
- MonthPreset writes earliest/latest dates
- MoneyInput formats with separators and submits numeric
- Wallet zero-state reassurance; dev Stripe warning appears only in dev

Rollback
- Toggle ui_refresh_v1 to OFF

Notes
- This PR intentionally avoids touching logic/APIs; it is safe to enable for internal users only in staging.
