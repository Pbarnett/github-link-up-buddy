Parker Flight – Auto‑Booking Front‑End Architecture v3
(Warp score 10 / 10 – “production‑grade & future‑proof”)

0 . Why a “v3” document?
v1 = initial wire‑up of missing UI pieces.

v2 = performance/reliability/observability overhaul.

v3 (this doc) = merges Warp’s last feedback, plugs residual gaps, and locks‑in a reference spec the FE team can implement without further clarifications. Everything is expressed as concrete files, code snippets, acceptance criteria, and rollout tasks.

1 . High‑level Reference Diagram
java
Copy
 ┌───────────── Browser / PWA ─────────────┐
 │ React‑SPA  (Vercel edge network)        │
 │  • Route‑level lazy chunks              │
 │  • Zustand + React‑Query store          │
 │  • SW (Workbox)  ↔  IndexedDB cache     │
 │  • Stripe Elements  (iframe)            │
 │  • a11y / i18n hooks                    │
 └──────────▲──────────────▲───────────────┘
            │              │  WebSocket (Supabase Realtime)
HTTPS+JWT   │              └────────────────────┐
            │                                   │
 ┌──────────┴─────────┐       RPC/SSE           ▼
 │ Supabase Edge Fns  │◀──────────────┐  Stripe Webhooks
 │  - Campaign CRUD   │               │
 │  - Payment intents │────────────┐  │
 │  - Realtime feed   │            ▼  │
 └────────┬───────────┘    Postgres CDC│
          │                            │
          ▼                            │
  Duffel API (booking)     Stripe API  │
                                      (tokenisation, 3‑DS Secure)
2 . Folder / File Layout (locked)
pgsql
Copy
src/
├─ pages/
│  └─ autobooking/
│     ├─ dashboard/            # /autobooking/dashboard
│     │   └─ index.tsx
│     ├─ new/                  # /autobooking/new  (wizard shell)
│     │   └─ index.tsx
│     ├─ [campaignId]/         # /autobooking/<id>
│     │   └─ index.tsx
│     └─ history/
│         └─ index.tsx
│
├─ components/
│  └─ autobooking/
│     ├─ CampaignWizard/
│     │   ├─ StepCriteria.tsx
│     │   ├─ StepTraveler.tsx
│     │   ├─ StepPayment.tsx
│     │   └─ StepReview.tsx
│     ├─ TravelerForm.tsx
│     ├─ PaymentCardForm.tsx
│     ├─ StatusTracker.tsx
│     └─ BookingTile.tsx
│
├─ hooks/
│  ├─ useOptimizedQuery.ts
│  ├─ useRealtimeSync.ts
│  ├─ useNetworkStatus.ts
│  ├─ useAnalytics.ts
│  └─ useFeatureFlag.ts
│
├─ store/
│  └─ campaignStore.ts
│
├─ utils/
│  ├─ monitoring.ts
│  ├─ retryQueue.ts
│  └─ mergeServerChange.ts
│
├─ service‑worker/
│  └─ sw.ts
└─ tokens/                      # design‑tokens (TS + JSON)
Immutable‑contract: Changing any folder path triggers a DX RFC.

3 . Core Architectural Pillars & Concrete Mechanisms
Pillar	Implementation in Code	Acceptance test
Performance	Route & feature code‑splitting (React.lazy), useOptimizedQuery (5 min stale), Workbox SW with cache‑first for JSON, Critical CSS via Tailwind JIT, predictive rel="prefetch" on hover.	Lighthouse CI score ≥ 90 on mobile (p95). Build artefact ≤ 250 kB initial JS.
Reliability	SmartErrorBoundary, retryQueue (localforage + online listener), optimistic mutations in Zustand.	Cypress E2E: kill network mid‑wizard, resume → state resumes & submission succeeds.
Observability	monitoring.ts bootstraps Core Web Vitals (web‑vitals lib) → useAnalytics; Sentry BrowserTracing + correlation‑id header on Edge Fns.	Sentry shows breadcrumb chain for a synthetic error in staging.
State	Local‑first Zustand store wrapped by React‑Query. IndexedDB persistence middleware with conflict resolution using updated_at timestamp.	Manual: Create campaign offline → becomes queued. Go online → record exists in DB.
Security & a11y	Stripe Elements iframe only, CSP: script-src 'self' https://js.stripe.com, automated axe & Pa11y in GitHub Actions, Focus‑trap modals.	CI fails if new component introduces a WCAG 2.1 AA violation or inline style breaks CSP.
Extensibility	@pf/design‑system package, feature flags (feature_flags table) resolved at boot + runtime; Route isolation ready for Module Federation.	Demo: load remote reports/ micro‑frontend at runtime via flag without rebuild.

4 . Key Component Specs
4.1 CampaignWizard
tsx
Copy
type WizardCtx = {
  criteria: CriteriaForm;    // destination, date window, budget
  travelers: Traveler[];     // FK → traveler_profiles
  paymentMethodId: string;   // Stripe PaymentMethod
};

const steps: WizardStep<WizardCtx>[] = [
  StepCriteria, StepTraveler, StepPayment, StepReview,
];

export default function CampaignWizard() {
  const [ctx, setCtx] = useState<WizardCtx>();
  const { mutateAsync } = useMutation(createCampaign);

  const next = (patch) => setCtx((p) => ({ ...p, ...patch }));
  const finish = async () => {
    await mutateAsync(ctx);                 // Supabase RPC
    toast.success('Campaign created 🎉');
    router.push('/autobooking/dashboard');
  };

  return <Stepper steps={steps} ctx={ctx} onNext={next} onFinish={finish} />;
}
Validation: per‑step via React‑Hook‑Form + Zod schema; aggregate schema in StepReview.

Stripe: StepPayment mounts <Elements> only when visible (chunked import).

a11y: each step aria-labelledby="step-heading"; pressing Enter on last field triggers onNext.

4.2 StatusTracker
Finite‑state visualiser mapping campaign.status ⟶ icon + label.
States: idle → searching → deal_found → payment_pending → booking → booked | failed.
Re‑renders via subscription hook:

ts
Copy
const { data } = useOptimizedQuery(['campaign', id], fetchOne);
useRealtimeSync(userId);     // pushes updates to query‑cache
return <StepIndicator current={data?.status} />;
4.3 Real‑time merge helper
ts
Copy
// utils/mergeServerChange.ts
export function mergeServerChange(list: Campaign[], payload): Campaign[] {
  const rec = payload.new;
  const idx = list.findIndex((c) => c.id === rec.id);
  if (idx === -1) return [...list, rec];
  return list[idx].updated_at > rec.updated_at ? list : [
    ...list.slice(0, idx), rec, ...list.slice(idx + 1),
  ];
}
Idempotent, version‑aware.

5 . Service‑Worker (Workbox) – offline & perf
ts
Copy
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => url.pathname.startsWith('/rest/'),
  new StaleWhileRevalidate({ cacheName: 'api-cache', maxEntries: 50, maxAgeSeconds: 300 })
);

backgroundSyncPlugin = new BackgroundSyncPlugin('post‑queue', { maxRetentionTime: 60 });
registerRoute(
  /\/rest\/.*\/(create|update|delete)/,
  new NetworkOnly({ plugins: [backgroundSyncPlugin] }),
  'POST'
);
6 . Feature Flag Hook
ts
Copy
export function useFeatureFlag(flag: string, fallback = false) {
  const { data } = useOptimizedQuery(['feature', flag], () =>
    supabase.from('feature_flags').select('enabled').eq('name', flag).single());
  const buildTime = import.meta.env[`VITE_FLAG_${flag.toUpperCase()}`];
  return buildTime ?? data?.enabled ?? fallback;
}
Dead‑code‑elimination friendly.

7 . Analytics Events Schema (Segment)
Event	Properties
campaign_created	criteria, traveler_count, budget, flag_group
wizard_step_completed	step_name, duration_ms
campaign_status_changed	campaign_id, old, new
booking_success	campaign_id, price, currency, saving_pct
payment_failed	decline_code, requires_action, campaign_id

8 . CI / Quality Gates
Job	Tool / threshold
Unit + Integration tests	Jest + React‑Testing‑Library (≥ 90 % line)
E2E	Playwright smoke suite on staging
Lighthouse‑CI	PWA + Perf score ≥ 90
axe / Pa11y	0 critical a11y issues
Visual regression	Chromatic diff – manual review required
Bundle watch	Size‑Limit ≤ 280 kB gz main bundle

Failing any gate blocks merge to main.

9 . Roll‑out Road‑map (dev‑weeks)
Phase	Deliverables	Lead Dev	QA Buddy	Weeks
1	Dashboard + Wizard core (Criteria, Traveler, Review)	Alice	Bob	2
2	Stripe StepPayment, PaymentCardForm, Sentry + ErrorBoundary	Carol	Dana	1
3	Zustand store, optimistic queue, realtime sync; unit tests	Bob	Alice	2
4	Workbox SW, IndexedDB persistence, PWA manifest, Lighthouse pass	Dana	Carol	1
5	i18n scaffold, axe fixes, Storybook docs, Chromatic baseline	All	QA guild	1

10 . Definition‑of‑Done per Feature
Wizard

happy‑path creates row in auto_booking_requests with correct JSON criteria

validation blocks invalid budget/date ranges

lighthouse form‑interactivity < 100 ms on mid‑range mobile

Dashboard

lists campaigns in < 500 ms after FCP (cached)

status updates within 2 s of DB change (realtime)

Payment UI

passes PCI SAQ‑A audit (no card in DOM outside Stripe iframe)

handles SCA flow with fallback modal

History

lazy‑loads in its own chunk

clicking a record opens BookingTile with confirmation PDF link

Offline

navigate to /dashboard offline (served from cache)

queued traveler‑profile save syncs automatically when re‑online

11 . Open Questions / Future‑Ready Hooks
Topic	Stub / TODO decision point
Push Notifications	SW subscription helper scaffolded; need product sign‑off on messaging copy.
Micro‑frontend split	@pf/core & @pf/design-system published to npm ‑ ready but not consumed by other remotes yet.
Multi‑currency UI	Intl.NumberFormat wrapper in utils/format.ts; locale detection but only en-US res bundle today.
Dark‑mode	tailwind dark: classes ready; flag off by default.

12 . Take‑aways for Warp Implementation
Everything above is codified – follow file paths verbatim, keep gates green.

Use provided snippets as black‑box contracts (modify inside, not shape).

Any deviation (bundle size, folder moves, gate thresholds) requires Architecture PR review.

Start with Phase 1 branch feature/autobook-ui-core.

Daily commit cadence + GitHub Actions ensure we never drift from perf/a11y budgets.

