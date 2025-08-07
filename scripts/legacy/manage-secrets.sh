#!/bin/bash
# Simple secrets management for MVP
# This script helps manage environment variables securely

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SECRETS_FILE=".env.secrets"
TEMPLATE_FILE=".env.secrets.example"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Generate secrets template
generate_template() {
    log_info "Generating secrets template..."
    
    cat > "$TEMPLATE_FILE" <<EOF
# Secrets Configuration Template
# Copy this to .env.secrets and fill in real values
# NEVER commit .env.secrets to version control!

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Authentication
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# External APIs
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project

# Admin
ADMIN_EMAIL=admin@yourcompany.com
EOF

    log_success "Template created at $TEMPLATE_FILE"
}

# Validate secrets file
validate_secrets() {
    if [[ ! -f "$SECRETS_FILE" ]]; then
        log_error "Secrets file not found: $SECRETS_FILE"
        log_info "Run: ./scripts/manage-secrets.sh init"
        return 1
    fi
    
    log_info "Validating secrets..."
    
    # Check for empty values
    if grep -q "=.*your_.*_here" "$SECRETS_FILE"; then
        log_warn "Found template values in secrets file - update with real values"
        return 1
    fi
    
    # Check for required secrets
    required_vars=(
        "VITE_SUPABASE_URL"
        "VITE_SUPABASE_ANON_KEY"
        "DATABASE_URL"
    )
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" "$SECRETS_FILE"; then
            log_error "Required secret missing: $var"
            return 1
        fi
    done
    
    log_success "Secrets validation passed"
}

# Load secrets into environment
load_secrets() {
    if validate_secrets; then
        log_info "Loading secrets into environment..."
        set -a  # automatically export all variables
        source "$SECRETS_FILE"
        set +a
        log_success "Secrets loaded"
    else
        log_error "Cannot load secrets - validation failed"
        return 1
    fi
}

# Generate random secret
generate_secret() {
    local length=${1:-32}
    openssl rand -hex $length 2>/dev/null || \
    python3 -c "import secrets; print(secrets.token_hex($length))" 2>/dev/null || \
    head -c $length /dev/urandom | xxd -p | tr -d '\n'
}

# Interactive secrets setup
setup_secrets() {
    log_info "Interactive secrets setup..."
    
    if [[ -f "$SECRETS_FILE" ]]; then
        read -p "Secrets file exists. Overwrite? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Keeping existing secrets file"
            return 0
        fi
    fi
    
    cat > "$SECRETS_FILE" <<EOF
# Generated secrets file - $(date)
# Keep this file secure and never commit to version control!

# Supabase Configuration
VITE_SUPABASE_URL=https://bbonngdyfyfjqfhvoljl.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_FLAG_FS_V2=true

# Auto-generated secrets
JWT_SECRET=$(generate_secret 32)
SESSION_SECRET=$(generate_secret 24)

# Database (update with your values)
DATABASE_URL=postgresql://user:password@localhost:5432/parker_flight

# Update these with your actual values:
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_key
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
EOF

    chmod 600 "$SECRETS_FILE"
    log_success "Secrets file created with secure permissions"
    log_warn "Update the placeholder values with your actual secrets!"
}

# Show help
show_help() {
    cat <<EOF
Secrets Management Script

Usage: $0 <command>

Commands:
  init          Create secrets template and setup
  template      Generate .env.secrets.example template
  validate      Validate secrets file
  load          Load secrets into environment (use with 'source')
  generate      Generate a random secret
  help          Show this help

Examples:
  $0 init                    # Setup secrets for the first time
  $0 validate                # Check if secrets are valid
  source $0 load             # Load secrets into current shell
  $0 generate 16             # Generate 16-byte random hex string

Security Notes:
  - .env.secrets is ignored by git
  - File permissions are set to 600 (owner read/write only)
  - Never commit secrets to version control
  - Use GitHub Secrets for CI/CD
EOF
}

# Main command handling
case "${1:-help}" in
    "init")
        generate_template
        setup_secrets
        ;;
    "template")
        generate_template
        ;;
    "validate")
        validate_secrets
        ;;
    "load")
        load_secrets
        ;;
    "generate")
        generate_secret "${2:-32}"
        ;;
    "help"|*)
        show_help
        ;;
esac
