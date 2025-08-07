#!/bin/bash

# Setup Git Hooks for Automated Script Execution
# This script installs Git hooks that automatically run scripts at appropriate times

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
GIT_HOOKS_DIR="$PROJECT_ROOT/.git/hooks"
SCRIPTS_ROOT="$PROJECT_ROOT/scripts"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Create pre-commit hook
create_pre_commit_hook() {
    local hook_file="$GIT_HOOKS_DIR/pre-commit"
    
    cat > "$hook_file" << 'EOF'
#!/bin/bash
# Auto-generated Git hook - runs scripts on pre-commit

set -euo pipefail

SCRIPTS_ROOT="$(git rev-parse --show-toplevel)/scripts"
ORCHESTRATOR="$SCRIPTS_ROOT/_core/orchestrator.js"

if [ -f "$ORCHESTRATOR" ]; then
    echo "🔄 Running pre-commit scripts..."
    if node "$ORCHESTRATOR" trigger pre-commit; then
        echo "✅ Pre-commit scripts completed successfully"
    else
        echo "❌ Pre-commit scripts failed - commit blocked"
        exit 1
    fi
else
    echo "⚠️  Script orchestrator not found, skipping automated scripts"
fi
EOF

    chmod +x "$hook_file"
    log "Created pre-commit hook"
}

# Create pre-push hook
create_pre_push_hook() {
    local hook_file="$GIT_HOOKS_DIR/pre-push"
    
    cat > "$hook_file" << 'EOF'
#!/bin/bash
# Auto-generated Git hook - runs scripts on pre-push

set -euo pipefail

SCRIPTS_ROOT="$(git rev-parse --show-toplevel)/scripts"
ORCHESTRATOR="$SCRIPTS_ROOT/_core/orchestrator.js"

if [ -f "$ORCHESTRATOR" ]; then
    echo "🚀 Running pre-push scripts..."
    if node "$ORCHESTRATOR" trigger pre-push; then
        echo "✅ Pre-push scripts completed successfully"
    else
        echo "❌ Pre-push scripts failed - push blocked"
        exit 1
    fi
else
    echo "⚠️  Script orchestrator not found, skipping automated scripts"
fi
EOF

    chmod +x "$hook_file"
    log "Created pre-push hook"
}

# Create post-merge hook
create_post_merge_hook() {
    local hook_file="$GIT_HOOKS_DIR/post-merge"
    
    cat > "$hook_file" << 'EOF'
#!/bin/bash
# Auto-generated Git hook - runs scripts after merge

set -euo pipefail

SCRIPTS_ROOT="$(git rev-parse --show-toplevel)/scripts"
ORCHESTRATOR="$SCRIPTS_ROOT/_core/orchestrator.js"

if [ -f "$ORCHESTRATOR" ]; then
    echo "🔄 Running post-merge scripts..."
    node "$ORCHESTRATOR" trigger post-merge || echo "⚠️  Some post-merge scripts failed"
else
    echo "⚠️  Script orchestrator not found, skipping automated scripts"
fi
EOF

    chmod +x "$hook_file"
    log "Created post-merge hook"
}

# Create post-checkout hook
create_post_checkout_hook() {
    local hook_file="$GIT_HOOKS_DIR/post-checkout"
    
    cat > "$hook_file" << 'EOF'
#!/bin/bash
# Auto-generated Git hook - runs scripts after checkout

set -euo pipefail

SCRIPTS_ROOT="$(git rev-parse --show-toplevel)/scripts"
ORCHESTRATOR="$SCRIPTS_ROOT/_core/orchestrator.js"

# Only run on branch switches (not file checkouts)
if [ "$3" = "1" ] && [ -f "$ORCHESTRATOR" ]; then
    echo "🔄 Running post-checkout scripts..."
    node "$ORCHESTRATOR" trigger post-checkout || echo "⚠️  Some post-checkout scripts failed"
fi
EOF

    chmod +x "$hook_file"
    log "Created post-checkout hook"
}

# Create commit-msg hook for automated tagging/versioning
create_commit_msg_hook() {
    local hook_file="$GIT_HOOKS_DIR/commit-msg"
    
    cat > "$hook_file" << 'EOF'
#!/bin/bash
# Auto-generated Git hook - validates commit messages and runs scripts

set -euo pipefail

SCRIPTS_ROOT="$(git rev-parse --show-toplevel)/scripts"
ORCHESTRATOR="$SCRIPTS_ROOT/_core/orchestrator.js"
COMMIT_MSG_FILE="$1"

# Validate commit message format (conventional commits)
commit_msg=$(cat "$COMMIT_MSG_FILE")

# Skip validation for merge commits and automated commits
if [[ "$commit_msg" =~ ^(Merge|Revert|fixup!|squash!) ]] || [[ "$commit_msg" =~ ^\[automated\] ]]; then
    exit 0
fi

# Basic validation for conventional commits
if ! [[ "$commit_msg" =~ ^(feat|fix|docs|style|refactor|perf|test|chore|ci|build)(\(.+\))?: .+ ]]; then
    echo "❌ Invalid commit message format!"
    echo "Use conventional commits: type(scope): description"
    echo "Examples:"
    echo "  feat(auth): add OAuth2 integration"
    echo "  fix(api): resolve database connection issue"
    echo "  docs: update API documentation"
    exit 1
fi

# Run commit message validation scripts
if [ -f "$ORCHESTRATOR" ]; then
    node "$ORCHESTRATOR" trigger commit-msg || echo "⚠️  Some commit-msg scripts failed"
fi
EOF

    chmod +x "$hook_file"
    log "Created commit-msg hook"
}

# Main setup function
setup_hooks() {
    log "Setting up Git hooks for automated script execution..."
    
    # Ensure Git hooks directory exists
    mkdir -p "$GIT_HOOKS_DIR"
    
    # Create hooks
    create_pre_commit_hook
    create_pre_push_hook
    create_post_merge_hook
    create_post_checkout_hook
    create_commit_msg_hook
    
    log "Git hooks setup completed successfully!"
    log "The following hooks were installed:"
    log "  - pre-commit: Runs linting, tests, and validation"
    log "  - pre-push: Runs comprehensive checks before push"
    log "  - post-merge: Runs setup and synchronization scripts"
    log "  - post-checkout: Runs branch-specific setup"
    log "  - commit-msg: Validates commit message format"
}

# Remove hooks function
remove_hooks() {
    log "Removing automated Git hooks..."
    
    local hooks=("pre-commit" "pre-push" "post-merge" "post-checkout" "commit-msg")
    
    for hook in "${hooks[@]}"; do
        local hook_file="$GIT_HOOKS_DIR/$hook"
        if [ -f "$hook_file" ] && grep -q "Auto-generated Git hook" "$hook_file"; then
            rm "$hook_file"
            log "Removed $hook hook"
        fi
    done
    
    log "Git hooks removal completed"
}

# CLI Interface
case "${1:-setup}" in
    "setup")
        setup_hooks
        ;;
    "remove")
        remove_hooks
        ;;
    "status")
        log "Git hooks status:"
        local hooks=("pre-commit" "pre-push" "post-merge" "post-checkout" "commit-msg")
        for hook in "${hooks[@]}"; do
            local hook_file="$GIT_HOOKS_DIR/$hook"
            if [ -f "$hook_file" ]; then
                if grep -q "Auto-generated Git hook" "$hook_file"; then
                    echo "  ✅ $hook (automated)"
                else
                    echo "  📝 $hook (custom)"
                fi
            else
                echo "  ❌ $hook (not installed)"
            fi
        done
        ;;
    *)
        echo "Usage: $0 [setup|remove|status]"
        echo ""
        echo "Commands:"
        echo "  setup   Install automated Git hooks (default)"
        echo "  remove  Remove automated Git hooks"
        echo "  status  Show current hooks status"
        exit 1
        ;;
esac
