#!/usr/bin/env bash
# Enable repository shared git hooks and ensure executable permissions
# Usage: ./scripts/development/git-hooks-setup.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")"/../.. && pwd)"
HOOKS_DIR="$REPO_ROOT/.githooks"

if [ ! -d "$HOOKS_DIR" ]; then
  echo "Error: .githooks directory not found at $HOOKS_DIR" >&2
  exit 1
fi

# Set the repository to use the versioned hooks directory
git config core.hooksPath .githooks

# Ensure all hook files are executable
chmod +x "$HOOKS_DIR"/* || true

# Verify
echo "core.hooksPath is set to: $(git config core.hooksPath)"
echo "Hooks marked executable:"
ls -l "$HOOKS_DIR"

echo "✅ Git hooks enabled. Commits to main and pushes to main are blocked by hooks."

