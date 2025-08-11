#!/usr/bin/env bash
set -euo pipefail

# apply_ui_refresh_bundle.sh
# Applies the UI refresh v1 bundle into the current repo on a new branch and opens a PR (if gh is available).
# Safe: only touches the nine files in the bundle; no schema or logic changes.

BUNDLE_DIR=".patch-bundles/ui-refresh-v1"
BRANCH_NAME="ui-refresh-v1-ui-upload"
COMMIT_MSG="UI refresh (flagged): tokens + Field/MoneyInput/MonthPreset/SummaryBar; wire TripRequestForm; Wallet copy; no logic/schema changes"

if [[ ! -d "$BUNDLE_DIR" ]]; then
  echo "Bundle directory not found: $BUNDLE_DIR" >&2
  exit 1
fi

# Ensure we are at repo root
if [[ ! -d ".git" ]]; then
  echo "Run this script from the repo root (where .git exists)." >&2
  exit 1
fi

# Create new branch from current HEAD
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$current_branch" == "$BRANCH_NAME" ]]; then
  echo "Already on $BRANCH_NAME" >&2
else
  git checkout -b "$BRANCH_NAME"
fi

# Copy files from the bundle to exact locations
mkdir -p src/styles src/components/ui src/components/layout src/components/trip/sections

cp -f "$BUNDLE_DIR"/tokens.css src/styles/tokens.css
cp -f "$BUNDLE_DIR"/main.tsx src/main.tsx
cp -f "$BUNDLE_DIR"/Wallet.tsx src/pages/Wallet.tsx
cp -f "$BUNDLE_DIR"/src/components/ui/Field.tsx src/components/ui/Field.tsx
cp -f "$BUNDLE_DIR"/src/components/ui/MoneyInput.tsx src/components/ui/MoneyInput.tsx
cp -f "$BUNDLE_DIR"/src/components/ui/MonthPreset.tsx src/components/ui/MonthPreset.tsx
cp -f "$BUNDLE_DIR"/src/components/layout/SummaryBar.tsx src/components/layout/SummaryBar.tsx
cp -f "$BUNDLE_DIR"/src/components/trip/TripRequestForm.tsx src/components/trip/TripRequestForm.tsx
cp -f "$BUNDLE_DIR"/src/components/trip/sections/EnhancedBudgetSection.tsx src/components/trip/sections/EnhancedBudgetSection.tsx

# Add and commit
git add src/styles/tokens.css src/main.tsx src/pages/Wallet.tsx \
        src/components/ui/Field.tsx src/components/ui/MoneyInput.tsx src/components/ui/MonthPreset.tsx \
        src/components/layout/SummaryBar.tsx src/components/trip/TripRequestForm.tsx \
        src/components/trip/sections/EnhancedBudgetSection.tsx

if git diff --cached --quiet; then
  echo "No changes to commit (files already match)." >&2
else
  git commit -m "$COMMIT_MSG"
fi

# Try to open a PR with gh if available
if command -v gh >/dev/null 2>&1; then
  # Use the README_PR.md as the PR body if present
  BODY_FILE="$BUNDLE_DIR/README_PR.md"
  if [[ -f "$BODY_FILE" ]]; then
    gh pr create --fill --body-file "$BODY_FILE" --title "UI refresh v1 (flagged)" || true
  else
    gh pr create --fill --title "UI refresh v1 (flagged)" || true
  fi
else
  echo "gh CLI not found. Push and open the PR manually:" >&2
  echo "  git push -u origin $BRANCH_NAME" >&2
  echo "Then create a PR using the text in $BUNDLE_DIR/README_PR.md" >&2
fi

