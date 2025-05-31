#!/usr/bin/env bash
set -ex

# Install Node dependencies using pnpm
corepack enable pnpm
pnpm install --frozen-lockfile

# Install Playwright browsers if Playwright is used
if grep -q '@playwright/test' package.json; then
  npx playwright install --with-deps
fi
