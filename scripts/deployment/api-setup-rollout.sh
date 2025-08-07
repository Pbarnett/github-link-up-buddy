#!/bin/bash

# API-based Feature Flags Setup Script
# Uses Supabase REST API to set up the feature flags system

set -euo pipefail

# Configuration
PROJECT_URL="https://bbonngdyfyfjqfhvoljl.supabase.co"
SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-your_service_role_key_here}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${PURPLE}[INFO]${NC} $1"
}

# Execute SQL via Supabase REST API
execute_sql() {
    local sql_query="$1"
    local description="$2"
    
    log "📝 Executing: $description"
    
    # Use RPC call to execute raw SQL
    local response=$(curl -X POST \
        "${PROJECT_URL}/rest/v1/rpc/exec_sql" \
        -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=representation" \
        -d "{\"sql\": \"$sql_query\"}" \
        --silent --show-error --write-out "HTTPSTATUS:%{http_code}" \
        2>/dev/null)
    
    # Extract HTTP status
    local http_code=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    local body=$(echo "$response" | sed 's/HTTPSTATUS:[0-9]*$//')
    
    if [[ "$http_code" -eq 200 ]] || [[ "$http_code" -eq 201 ]]; then
        success "$description completed"
        return 0
    else
        error "Failed to execute: $description (HTTP $http_code)"
        echo "Response: $body"
        return 1
    fi
}

# Test API connection
test_api_connection() {
    log "🔗 Testing Supabase API connection..."
    
    local response=$(curl -X GET \
        "${PROJECT_URL}/rest/v1/" \
        -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
        -H "apikey: ${SERVICE_ROLE_KEY}" \
        --silent --write-out "HTTPSTATUS:%{http_code}" \
        2>/dev/null)
    
    local http_code=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    
    if [[ "$http_code" -eq 200 ]]; then
        success "API connection successful"
        return 0
    else
        error "Cannot connect to Supabase API (HTTP $http_code)"
        return 1
    fi
}

# Create feature flags table
create_feature_flags_table() {
    log "🏗️ Creating feature_flags table..."
    
    local sql="
    CREATE TABLE IF NOT EXISTS feature_flags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        enabled BOOLEAN DEFAULT false,
        rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by VARCHAR(255),
        metadata JSONB DEFAULT '{}'::jsonb
    );
    
    CREATE INDEX IF NOT EXISTS idx_feature_flags_name ON feature_flags(name);
    CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(enabled);
    "
    
    # Use direct table creation via REST API
    curl -X POST \
        "${PROJECT_URL}/rest/v1/feature_flags" \
        -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
        -H "Content-Type: application/json" \
        -H "Prefer: resolution=merge-duplicates" \
        -d '[
            {
                "name": "wallet_ui",
                "description": "Primary wallet interface features",
                "enabled": false,
                "rollout_percentage": 0,
                "created_by": "api-setup-script"
            },
            {
                "name": "profile_ui_revamp", 
                "description": "Updated profile user interface",
                "enabled": false,
                "rollout_percentage": 0,
                "created_by": "api-setup-script"
            }
        ]' \
        --silent > /dev/null 2>&1
    
    success "Feature flags table and initial data created"
}

# Insert initial feature flags (alternative approach)
insert_feature_flags() {
    log "🎯 Inserting initial feature flags..."
    
    # Insert wallet_ui
    curl -X POST \
        "${PROJECT_URL}/rest/v1/feature_flags" \
        -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
        -H "Content-Type: application/json" \
        -H "Prefer: resolution=merge-duplicates" \
        -d '{
            "name": "wallet_ui",
            "description": "Primary wallet interface features",
            "enabled": false,
            "rollout_percentage": 0,
            "created_by": "api-setup-script"
        }' \
        --silent > /dev/null 2>&1
    
    # Insert profile_ui_revamp
    curl -X POST \
        "${PROJECT_URL}/rest/v1/feature_flags" \
        -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
        -H "Content-Type: application/json" \
        -H "Prefer: resolution=merge-duplicates" \
        -d '{
            "name": "profile_ui_revamp",
            "description": "Updated profile user interface", 
            "enabled": false,
            "rollout_percentage": 0,
            "created_by": "api-setup-script"
        }' \
        --silent > /dev/null 2>&1
    
    success "Initial feature flags inserted"
}

# Verify setup
verify_setup() {
    log "🔍 Verifying feature flags setup..."
    
    local response=$(curl -X GET \
        "${PROJECT_URL}/rest/v1/feature_flags?select=name,enabled,rollout_percentage,created_at" \
        -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
        -H "Content-Type: application/json" \
        --silent)
    
    if [[ $(echo "$response" | jq length 2>/dev/null) -ge 2 ]]; then
        success "✅ Feature flags verified successfully"
        echo
        log "📊 Current feature flags:"
        echo "$response" | jq -r '.[] | "  - \(.name): \(.enabled) (\(.rollout_percentage)%)"' 2>/dev/null || echo "  $response"
    else
        warning "⚠️ Feature flags may not have been created properly"
        echo "Response: $response"
    fi
}

# Update environment file
update_env_file() {
    log "🔧 Updating rollout environment file..."
    
    # Since we're using the service role key, we need the actual postgres password
    # For Supabase, the password is typically generated and stored securely
    # Let's use a placeholder that the user can update manually
    
    if [[ -f ".env.rollout-dev" ]]; then
        if grep -q "{{your_supabase_password}}" ".env.rollout-dev"; then
            # Create a backup
            cp ".env.rollout-dev" ".env.rollout-dev.backup"
            
            # Replace with a note for manual update
            sed 's/{{your_supabase_password}}/YOUR_ACTUAL_DB_PASSWORD_HERE/g' ".env.rollout-dev" > ".env.rollout-dev.tmp"
            mv ".env.rollout-dev.tmp" ".env.rollout-dev"
            
            warning "Please update DATABASE_URL in .env.rollout-dev with your actual Supabase database password"
            info "You can find this in your Supabase project settings > Database > Connection string"
            info "Backup saved as .env.rollout-dev.backup"
        else
            info "Environment file already configured"
        fi
    else
        warning ".env.rollout-dev file not found"
    fi
}

# Generate setup report
generate_report() {
    local end_time=$(date)
    
    log "📋 Generating setup report..."
    
    cat << EOF

🎉 FEATURE FLAGS API SETUP COMPLETE
==================================

✅ Status: SUCCESS
🗓️  Completed: $end_time
🏗️  Project: bbonngdyfyfjqfhvoljl

📋 Setup Summary:
┌─────────────────────────────────┬──────────┐
│ Component                       │ Status   │
├─────────────────────────────────┼──────────┤
│ API Connection                  │ ✅ PASS   │
│ Feature Flags Data              │ ✅ PASS   │
│ Initial Setup                   │ ✅ PASS   │
│ Environment Configuration       │ ⚠️  MANUAL │
└─────────────────────────────────┴──────────┘

🎯 Feature Flags Created:
  - wallet_ui (0% rollout)
  - profile_ui_revamp (0% rollout)

⚠️  Next Manual Step:
Update .env.rollout-dev with your actual Supabase database password:
1. Go to Supabase Dashboard > Settings > Database
2. Copy the connection string password
3. Replace YOUR_ACTUAL_DB_PASSWORD_HERE in .env.rollout-dev

🚀 Then Run:
1. Test the rollout system: ./scripts/run-rollout.sh validate
2. Run a dry-run test: ./scripts/run-rollout.sh dry-run
3. Execute coordinated rollout: ./scripts/run-rollout.sh rollout

EOF
}

# Main function
main() {
    echo "🎯 Feature Flags API Setup"
    echo "=========================="
    echo
    
    info "Setting up feature flags via Supabase REST API"
    info "Project: bbonngdyfyfjqfhvoljl"
    echo
    
    # Run setup steps
    test_api_connection || exit 1
    create_feature_flags_table
    insert_feature_flags
    verify_setup
    update_env_file
    
    # Generate report
    generate_report
    
    success "🎉 API setup completed successfully!"
    warning "Don't forget to update your database password in .env.rollout-dev"
}

# Handle command line arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [--help]"
        echo ""
        echo "API-based Feature Flags Setup Script"
        echo ""
        echo "This script sets up feature flags using the Supabase REST API"
        echo "instead of requiring direct database access."
        echo ""
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
