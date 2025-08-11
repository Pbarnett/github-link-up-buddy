#!/usr/bin/env bash
set -euo pipefail

# Safe branch switch helper
# - Warns if there are uncommitted changes
# - Offers to stash with a timestamped message
# - Suggests using a worktree for large divergences
# Usage: scripts/development/git-switch-safe.sh <target-branch>

if [ "${1-}" = "" ]; then
  echo "Usage: $0 <target-branch>" 1>&2
  exit 2
fi

TARGET="$1"

current_branch=$(git rev-parse --abbrev-ref HEAD)

# Check for uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "You have uncommitted changes on '$current_branch'." 1>&2
  read -r -p "Stash them with a timestamped message? [y/N] " ans
  if [[ "$ans" =~ ^[Yy]$ ]]; then
    ts=$(date +"%Y-%m-%d %H:%M")
    git stash push -u -m "$ts WIP: switch $current_branch -> $TARGET"
    echo "Changes stashed."
  else
    echo "Aborting to avoid losing work." 1>&2
    exit 1
  fi
fi

# Suggest worktree if branch is far from main
if git rev-parse --verify -q "$TARGET" >/dev/null; then
  # Compare with main if both exist
  if git rev-parse --verify -q main >/dev/null; then
    ahead=$(git rev-list --left-right --count main..."$TARGET" | awk '{print $1}')
    behind=$(git rev-list --left-right --count main..."$TARGET" | awk '{print $2}')
    if [ "${ahead:-0}" -gt 50 ] || [ "${behind:-0}" -gt 50 ]; then
      echo "Note: '$TARGET' diverges significantly from 'main' (ahead=$ahead, behind=$behind)." 1>&2
      echo "Consider using a separate worktree to avoid file churn:" 1>&2
      echo "  git worktree add ../github-link-up-buddy-$TARGET $TARGET" 1>&2
    fi
  fi
fi

# Finally switch
git switch "$TARGET"
echo "Switched to '$TARGET'"

