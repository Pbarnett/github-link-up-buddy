# Supabase Functions CI verification

This file exists solely to trigger the CI fast-path for edge functions.

- Changing files under `supabase/functions/` should only run:
  - Lint
  - Functions tests

This PR validates that configuration.

