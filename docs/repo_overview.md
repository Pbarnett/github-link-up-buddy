# Repository Overview

## Directory Structure & Purposes

### Frontend (`src/`)
- **`src/components/`** - React components organized by feature
  - `src/components/forms/` - React Hook Form + Zod form components
  - `src/components/ui/` - Reusable UI components
  - `src/components/trip/` - Trip-specific components
  - `src/components/dashboard/` - Dashboard-specific components
  - `src/components/filtering/` - Flight filtering components
  - `src/components/navigation/` - Navigation components
  - `src/components/layout/` - Layout components
  - `src/components/debug/` - Debug and development components
  - `src/components/autobooking/` - Auto-booking related components

- **`src/pages/`** - Main page components and routes
- **`src/hooks/`** - Custom React hooks
- **`src/services/`** - API service layer and business logic
- **`src/utils/`** - Utility functions
- **`src/types/`** - TypeScript type definitions
- **`src/contexts/`** - React context providers
- **`src/data/`** - Static data and lookups
- **`src/tests/`** - Frontend test suites

### Backend (`supabase/`)
- **`supabase/functions/`** - Edge functions (serverless functions)
  - `supabase/functions/_shared/` - Shared utilities for edge functions
  - `supabase/functions/lib/` - Common libraries for edge functions
- **`supabase/migrations/`** - Database schema migrations
- **`supabase/src/`** - Additional backend source code

### Infrastructure & Config
- **`docker/`** - Docker configuration files
- **`scripts/`** - Build, deployment, and development scripts
- **`docs/`** - Documentation
- **`tests/`** - Integration and E2E tests
- **`monitoring/`** - Monitoring and observability configuration

## Key Conventions

### Naming Conventions
- **`use*`** - React hook (e.g., `useFlightOffers`, `useCurrentUser`)
- **`*Service`** - Network API wrapper (e.g., `flightApi`, `campaignService`)
- **`*.edge.ts`** - Edge-function client code
- **`*Form.tsx`** - Form components using React Hook Form + Zod
- **`*Context.tsx`** - React context providers

### Forms
- **Location**: `src/components/forms/`
- **Pattern**: React Hook Form + Zod validation
- **Naming**: `[Entity]Form.tsx` (e.g., `ProfileForm.tsx`, `TripForm.tsx`)

### Edge Functions
- **Location**: `supabase/functions/[function-name]/`
- **Entry**: Each function has `index.ts` as entry point
- **Shared Code**: Common utilities in `supabase/functions/_shared/`
- **How to call**: `invokeEdgeFn('function-name', { params })`

### Database
- **Migrations**: `supabase/migrations/` with timestamp prefixes
- **Schema**: PostgreSQL with RLS (Row Level Security)
- **Naming**: Snake_case for database objects

### Testing
- **Unit Tests**: Co-located with source files (`.test.ts`, `.test.tsx`)
- **Integration**: `src/tests/integration/`
- **E2E**: `tests/` directory
- **Mocks**: `src/tests/mocks/`

## Source of Truth Files

### Types
- **`src/types/`** - Core type definitions
- **`src/flightSearchV2/types.ts`** - Flight search specific types
- **`src/types/offer.ts`** - Offer-related types
- **`src/types/form.ts`** - Form-related types
- **`src/types/campaign.ts`** - Campaign-related types

### Configuration
- **`supabase/config.toml`** - Supabase configuration
- **`tsconfig.json`** - TypeScript configuration
- **`vite.config.ts`** - Vite build configuration
- **`package.json`** - Node.js dependencies and scripts

### Environment & Utils
- **`src/flightSearchV2/createEnv.ts`** - Environment variable loader
- **`src/lib/utils.ts`** - General utility functions
- **`src/lib/supabaseUtils.ts`** - Supabase-specific utilities
- **`src/integrations/supabase/`** - Supabase client setup

### Services
- **`src/services/flightApi.ts`** - Flight API service
- **`src/services/tripService.ts`** - Trip management service
- **`src/services/campaignService.ts`** - Campaign service
- **`src/services/currencyService.ts`** - Currency conversion service

## Development Workflow

### Before Starting Work
1. Run `npm run warp-refresh` to update file overview
2. Check `git status` for any uncommitted changes
3. Ensure you're on the correct branch

### Code Organization
- Keep related files close together
- Use consistent naming conventions
- Follow existing patterns in the codebase
- Update this overview when adding new directories or patterns

### Testing
- Write tests alongside new features
- Use the existing test patterns and helpers
- Run test suites before committing changes

## Notes
- This is a React + TypeScript frontend with Supabase backend
- Uses Vite for building and development
- Deployed on Vercel (frontend) and Supabase (backend)
- Payment processing via Stripe
- Flight data from Duffel API
