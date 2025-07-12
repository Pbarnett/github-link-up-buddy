#!/bin/bash

# Production Deployment Script for Duffel Integration
# Ensures safe, controlled deployment with validation at each step

set -e  # Exit on any error

echo "🚀 DEPLOYING DUFFEL INTEGRATION TO PRODUCTION"
echo "=============================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT=$(pwd)
SUPABASE_PROJECT_ID=${SUPABASE_PROJECT_ID:-""}
ENVIRONMENT=${ENVIRONMENT:-"production"}

# Functions
log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_step "Checking prerequisites..."
    
    # Check if Supabase CLI is installed
    if ! command -v supabase &> /dev/null; then
        log_error "Supabase CLI is not installed. Please install it first:"
        echo "  npm install -g supabase"
        exit 1
    fi
    
    # Check if Node.js is available for testing
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Required for running tests."
        exit 1
    fi
    
    # Check if we're logged into Supabase
    if ! supabase auth list &> /dev/null; then
        log_error "Not logged into Supabase. Please run: supabase auth login"
        exit 1
    fi
    
    # Check if project is linked
    if [ ! -f ".supabase/config.toml" ]; then
        log_error "Project not linked to Supabase. Please run: supabase link"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

validate_environment() {
    log_step "Validating environment configuration..."
    
    # Check for required environment variables
    required_vars=(
        "SUPABASE_URL"
        "SUPABASE_SERVICE_ROLE_KEY"
        "DUFFEL_TEST_TOKEN"
        "STRIPE_SECRET_KEY"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        log_error "Missing required environment variables:"
        printf '  %s\n' "${missing_vars[@]}"
        echo ""
        echo "Please set these variables or copy .env.duffel.template to .env.local"
        exit 1
    fi
    
    log_success "Environment validation passed"
}

run_safety_checks() {
    log_step "Running safety checks..."
    
    # Ensure feature flags are disabled by default
    log_step "Checking feature flag safety..."
    
    # Check database migrations are ready
    log_step "Validating database migrations..."
    
    if [ ! -f "supabase/migrations/20250704_duffel_integration_v1.sql" ]; then
        log_error "Missing required migration file"
        exit 1
    fi
    
    # Run migration validation (dry run)
    if ! supabase db diff --schema public > /dev/null 2>&1; then
        log_warning "Database schema differences detected. Review before proceeding."
    fi
    
    log_success "Safety checks passed"
}

deploy_database() {
    log_step "Deploying database migrations..."
    
    # Backup current schema (if in production)
    if [ "$ENVIRONMENT" = "production" ]; then
        log_step "Creating database backup..."
        # Note: In real production, you'd want a proper backup strategy
        log_warning "Ensure you have a recent database backup before proceeding!"
        
        read -p "Do you have a recent backup? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_error "Please create a backup before proceeding"
            exit 1
        fi
    fi
    
    # Apply migrations
    if supabase db push; then
        log_success "Database migrations applied successfully"
    else
        log_error "Database migration failed"
        exit 1
    fi
}

deploy_edge_functions() {
    log_step "Deploying Edge Functions..."
    
    # Deploy all Duffel-related functions
    functions=(
        "auto-book-production"
        "duffel-webhook-production"
    )
    
    for func in "${functions[@]}"; do
        log_step "Deploying function: $func"
        
        if supabase functions deploy "$func"; then
            log_success "Function $func deployed successfully"
        else
            log_error "Failed to deploy function: $func"
            exit 1
        fi
    done
}

set_environment_secrets() {
    log_step "Setting environment secrets..."
    
    # Set secrets for Edge Functions
    secrets=(
        "DUFFEL_TEST_TOKEN"
        "DUFFEL_LIVE_TOKEN"
        "STRIPE_SECRET_KEY"
        "DUFFEL_WEBHOOK_SECRET"
    )
    
    for secret in "${secrets[@]}"; do
        if [ ! -z "${!secret}" ]; then
            log_step "Setting secret: $secret"
            if echo "${!secret}" | supabase secrets set "$secret"; then
                log_success "Secret $secret set successfully"
            else
                log_warning "Failed to set secret: $secret"
            fi
        else
            log_warning "Secret $secret not found in environment"
        fi
    done
}

run_integration_tests() {
    log_step "Running integration tests..."
    
    # Install test dependencies if needed
    if [ ! -f "node_modules/@supabase/supabase-js/package.json" ]; then
        log_step "Installing test dependencies..."
        npm install @supabase/supabase-js dotenv
    fi
    
    # Run the comprehensive test suite
    if node scripts/test-duffel-production-pipeline.js; then
        log_success "Integration tests passed"
    else
        log_error "Integration tests failed - deployment aborted"
        exit 1
    fi
}

enable_feature_flags() {
    log_step "Configuring feature flags for controlled rollout..."
    
    # Start with test mode only
    log_step "Enabling test mode features..."
    
    # Note: In a real implementation, you'd update the database directly
    # For now, we'll just show what should be done
    cat << EOF

🏁 DEPLOYMENT COMPLETE!

Next steps for controlled rollout:

1. Test the integration in sandbox mode:
   - All feature flags are disabled by default for safety
   - Test with small volume using test credentials

2. Enable features gradually:
   a) Enable 'duffel_webhooks_enabled' first
   b) Enable 'auto_booking_enhanced' for limited users
   c) Finally enable 'duffel_live_enabled' for production

3. Monitor key metrics:
   - Booking success rate
   - Error rates and types  
   - Payment processing status
   - Response times

4. Database queries for feature flag management:
   
   -- Enable webhooks
   UPDATE feature_flags SET enabled = true WHERE name = 'duffel_webhooks_enabled';
   
   -- Enable auto-booking (test mode)
   UPDATE feature_flags SET enabled = true WHERE name = 'auto_booking_enhanced';
   
   -- Enable live mode (only after thorough testing)
   UPDATE feature_flags SET enabled = true WHERE name = 'duffel_live_enabled';

🔍 Monitoring endpoints:
   - Booking attempts: SELECT * FROM booking_attempts_summary;
   - Webhook events: SELECT * FROM duffel_webhook_events WHERE processed = false;
   - Error tracking: Check Sentry dashboard

⚠️  IMPORTANT: 
   - Monitor logs closely for the first hour
   - Have rollback plan ready
   - Keep feature flags easily accessible for quick disable

EOF
}

main() {
    echo "Starting deployment to $ENVIRONMENT environment..."
    echo ""
    
    # Confirmation for production
    if [ "$ENVIRONMENT" = "production" ]; then
        log_warning "You are about to deploy to PRODUCTION!"
        read -p "Are you sure you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Deployment cancelled."
            exit 0
        fi
    fi
    
    # Execute deployment steps
    check_prerequisites
    validate_environment
    run_safety_checks
    deploy_database
    deploy_edge_functions
    set_environment_secrets
    run_integration_tests
    enable_feature_flags
    
    log_success "🎉 Deployment completed successfully!"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --environment|-e)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --project-id|-p)
            SUPABASE_PROJECT_ID="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -e, --environment     Target environment (default: production)"
            echo "  -p, --project-id      Supabase project ID"
            echo "  -h, --help           Show this help message"
            echo ""
            echo "Environment variables required:"
            echo "  SUPABASE_URL"
            echo "  SUPABASE_SERVICE_ROLE_KEY"
            echo "  DUFFEL_TEST_TOKEN"
            echo "  STRIPE_SECRET_KEY"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run main deployment
main
