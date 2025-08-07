#!/bin/bash

# Simple Rollout Runner
# Loads environment and runs the coordinated feature rollout

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Coordinated Feature Rollout Runner${NC}"
echo "======================================"
echo

# Check if we're in the right directory
if [[ ! -f "scripts/coordinated-feature-rollout.sh" ]]; then
    echo "❌ Error: Must be run from project root directory"
    exit 1
fi

# Load development environment
if [[ -f ".env.rollout-dev" ]]; then
    echo "📋 Loading development environment..."
    source .env.rollout-dev
    echo -e "${GREEN}✅ Environment loaded${NC}"
    echo
else
    echo "❌ Error: .env.rollout-dev not found"
    echo "Please create and configure .env.rollout-dev first"
    exit 1
fi

# Export required variables
export DATABASE_URL API_BASE_URL LAUNCHDARKLY_SDK_KEY

# Show current configuration
echo "🔧 Current Configuration:"
echo "  Database: ${DATABASE_URL}"
echo "  API: ${API_BASE_URL}"
echo "  LaunchDarkly SDK: ${LAUNCHDARKLY_SDK_KEY:0:20}..."
echo "  Primary Flag: ${PRIMARY_FLAG}"
echo "  Secondary Flag: ${SECONDARY_FLAG}"
echo

# Parse command line arguments and run appropriate command
case "${1:-help}" in
    "validate"|"--validate")
        echo "🔍 Running validation only..."
        ./scripts/coordinated-feature-rollout.sh --validate-only
        ;;
    "dry-run"|"--dry-run")
        echo "🧪 Running dry-run test..."
        export MONITOR_DURATION=10
        export CHECK_INTERVAL=2
        ./scripts/coordinated-feature-rollout.sh --dry-run --skip-user-input
        ;;
    "rollout"|"--rollout")
        echo "🚀 Running actual rollout (with manual approvals)..."
        ./scripts/coordinated-feature-rollout.sh
        ;;
    "auto-rollout"|"--auto-rollout")
        echo "🤖 Running automated rollout (no manual approvals)..."
        ./scripts/coordinated-feature-rollout.sh --skip-user-input
        ;;
    "rollback"|"--rollback")
        echo "🔄 Running emergency rollback..."
        ./scripts/coordinated-feature-rollout.sh --rollback
        ;;
    "test"|"--test")
        echo "🧪 Running development test suite..."
        ./scripts/test-rollout-dev.sh
        ;;
    "help"|"--help"|"-h"|*)
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  validate      Run validation checks only (safe)"
        echo "  dry-run       Simulate the entire rollout process"
        echo "  rollout       Run actual rollout with manual approvals"
        echo "  auto-rollout  Run automated rollout (skip manual approvals)"
        echo "  rollback      Emergency rollback both feature flags"
        echo "  test          Run comprehensive development test suite"
        echo "  help          Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 validate      # Safe validation check"
        echo "  $0 dry-run       # Test the rollout process"
        echo "  $0 rollout       # Run actual rollout"
        echo "  $0 rollback      # Emergency rollback"
        echo ""
        exit 0
        ;;
esac
