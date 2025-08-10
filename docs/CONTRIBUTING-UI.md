# UI Contribution Guide

This guide documents conventions for UI work in this repository. It complements and does not replace the main repository guidelines.

Sources of truth
- Repository organization: see docs/REPOSITORY_ORGANIZATION_GUIDELINES.md
- Design tokens and theming: src/index.css variables and the ThemeProvider at src/components/theme-provider.tsx
- Component primitives: shadcn/ui primitives under src/components/ui

Principles
- Tokens-first: Use CSS variables (Tailwind hsl(var(--token))) or Tailwind utilities. Avoid raw hex/hsl values in component code. If a new color is needed, add a token in src/index.css.
- Primitive vs. feature components:
  - Primitive components live under src/components/ui (Button, Input, Dialog, Select, etc.). They are generic, theme-aware, and do not depend on app domain.
  - Feature/page components live under src/components/* or src/pages/* and may compose primitives with app logic.
- Accessibility by default: Favor semantic HTML; add ARIA only when semantics aren’t sufficient. Ensure focus-visible styles, keyboard operation, and screen reader announcements are correct.
- Composition over duplication: Prefer extending primitives with className and variants (cva) rather than creating one-off copies.

shadcn/ui usage norms
- Do not fork primitives unless absolutely necessary. Extend via className, variants, or wrapper components.
- Keep primitives free of domain-specific text, icons, or behavior. Provide slots/children for consumers.
- For interactive primitives (Dialog, Sheet, Popover, DropdownMenu): ensure titles, aria attributes, and focus trapping are intact. Use Radix defaults where possible.

Styling placement
- Global tokens, base resets, and shared utility classes: src/index.css
- Primitive styles: within the primitive component via cva and Tailwind utilities
- Page-specific styles: co-located with the page or feature component; avoid adding page CSS into primitives

Theming
- Wrap UI with ThemeProvider (src/components/theme-provider.tsx). Use the ModeToggle for user control. Respect system theme and persist selection in localStorage.
- Prefer HSL tokens with Tailwind’s hsl(var(--token)) for color so themes swap cleanly.

Performance
- Use React.lazy + Suspense for route-level code splitting. Prefetch heavy routes on user intent (hover/focus) and consider viewport-based prefetch for mobile.
- For large below-the-fold sections, consider content-visibility: auto with contain-intrinsic-size to improve initial rendering.

Accessibility checklist for PRs
- Keyboard tab order makes sense and remains within overlays.
- Focus outline is visible (focus-visible) and meets contrast.
- aria-current is set on active nav links; decorative icons use aria-hidden.
- Dialogs/Sheets include accessible titles and close button text (sr-only).
- Forms: labels are associated; errors announced via role="alert"; first error receives focus.
- Inputs have appropriate autocomplete/inputMode for better keyboards/autofill.

Directory conventions
- Contexts/providers live under src/contexts (not src/context). Consolidate to avoid duplication.
- Wallet-related components live under src/components/wallet (feature area), not in ui/.

When adding or modifying UI files
- Reference docs/REPOSITORY_ORGANIZATION_GUIDELINES.md.
- Favor tokens and primitives. If you must introduce a new primitive, place it under src/components/ui and keep it domain-agnostic.
- Add tests or Playwright/axe coverage where feasible for new interactive patterns.

Review tips
- Check that no raw colors were introduced (prefer tokens).
- Verify Suspense fallbacks exist where components are lazy-loaded.
- Confirm no mobile overflow at 320–375px for grids and layout containers.

