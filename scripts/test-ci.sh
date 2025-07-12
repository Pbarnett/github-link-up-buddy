#!/bin/bash

# Single-pass test and coverage script for CI
set -e

echo "🧪 Running tests with coverage (single pass)..."
pnpm vitest run --coverage

echo "✅ Tests and coverage completed successfully!"
