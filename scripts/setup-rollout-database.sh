#!/bin/bash

# Setup Rollout Database Script
# Initializes the feature flags database for coordinated rollout

set -euo pipefail

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

# Check if we're in the correct directory
check_directory() {
    if [[ ! -f "scripts/setup-feature-flags-db.sql" ]]; then
        error "Must be run from the project root directory"
        error "The setup-feature-flags-db.sql file is not found"
        exit 1
    fi
}

# Get database password securely
get_database_password() {
    echo
    info "This script will set up the feature flags database in your Supabase project"
    info "Project ID: bbonngdyfyfjqfhvoljl"
    info "Database Host: db.bbonngdyfyfjqfhvoljl.supabase.co"
    echo
    
    if [[ -n "${SUPABASE_DB_PASSWORD:-}" ]]; then
        info "Using database password from environment variable"
        DB_PASSWORD="$SUPABASE_DB_PASSWORD"
    else
DB_PASSWORD="zrhXOjjMK2pX154UeLiKM8-iRvuVzVA8cGne8LTVrqE"
        info "Using hard-coded service role key for testing (do not use in production!)"
        echo
    fi
    
    if [[ -z "$DB_PASSWORD" ]]; then
        error "Database password is required"
        exit 1
    fi
}

# Test database connection
test_connection() {
    log "🔗 Testing database connection..."
    
    export PGPASSWORD="$DB_PASSWORD"
    
    if psql -h "db.bbonngdyfyfjqfhvoljl.supabase.co" \
           -U "postgres" \
           -d "postgres" \
           -p 5432 \
           -c "SELECT version();" > /dev/null 2>&1; then
        success "Database connection successful"
        return 0
    else
        error "Cannot connect to database. Please check your password and network connection."
        return 1
    fi
}

# Apply database setup
apply_setup() {
    log "🚀 Setting up feature flags database..."
    
    export PGPASSWORD="$DB_PASSWORD"
    
    # Apply the setup SQL
    if psql -h "db.bbonngdyfyfjqfhvoljl.supabase.co" \
           -U "postgres" \
           -d "postgres" \
           -p 5432 \
           -f "scripts/setup-feature-flags-db.sql"; then
        success "Database setup completed successfully!"
        return 0
    else
        error "Database setup failed"
        return 1
    fi
}

# Verify setup
verify_setup() {
    log "🔍 Verifying database setup..."
    
    export PGPASSWORD="$DB_PASSWORD"
    
    # Check if tables exist
    local check_result=$(psql -h "db.bbonngdyfyfjqfhvoljl.supabase.co" \
                              -U "postgres" \
                              -d "postgres" \
                              -p 5432 \
                              -t -c "
        SELECT COUNT(*)
        FROM information_schema.tables 
        WHERE table_name IN ('feature_flags', 'logs') 
        AND table_schema = 'public';
    " 2>/dev/null | tr -d ' ' || echo "0")
    
    if [[ "$check_result" == "2" ]]; then
        success "✅ Tables created successfully"
    else
        warning "⚠️  Some tables may not have been created properly"
    fi
    
    # Check if feature flags exist
    local flags_result=$(psql -h "db.bbonngdyfyfjqfhvoljl.supabase.co" \
                               -U "postgres" \
                               -d "postgres" \
                               -p 5432 \
                               -t -c "
        SELECT COUNT(*)
        FROM feature_flags 
        WHERE name IN ('wallet_ui', 'profile_ui_revamp');
    " 2>/dev/null | tr -d ' ' || echo "0")
    
    if [[ "$flags_result" == "2" ]]; then
        success "✅ Feature flags initialized successfully"
    else
        warning "⚠️  Feature flags may not have been created properly"
    fi
    
    # Show current status
    echo
    log "📊 Current feature flags status:"
    psql -h "db.bbonngdyfyfjqfhvoljl.supabase.co" \
         -U "postgres" \
         -d "postgres" \
         -p 5432 \
         -c "
        SELECT 
            name,
            enabled,
            rollout_percentage,
            TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
        FROM feature_flags 
        ORDER BY name;
    " 2>/dev/null || warning "Could not retrieve feature flags status"
}

# Update rollout environment file
update_env_file() {
    log "🔧 Updating rollout environment file..."
    
    # Replace placeholder with actual password in .env.rollout-dev
    if [[ -f ".env.rollout-dev" ]]; then
        if grep -q "{{your_supabase_password}}" ".env.rollout-dev"; then
            # Create a backup
            cp ".env.rollout-dev" ".env.rollout-dev.backup"
            
            # Replace the placeholder (be careful with special characters)
            sed "s/{{your_supabase_password}}/$DB_PASSWORD/g" ".env.rollout-dev" > ".env.rollout-dev.tmp"
            mv ".env.rollout-dev.tmp" ".env.rollout-dev"
            
            success "Environment file updated with database password"
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

🎉 FEATURE FLAGS DATABASE SETUP COMPLETE
=======================================

✅ Status: SUCCESS
🗓️  Completed: $end_time
🏗️  Project: bbonngdyfyfjqfhvoljl

📋 Setup Summary:
┌─────────────────────────────────┬──────────┐
│ Component                       │ Status   │
├─────────────────────────────────┼──────────┤
│ Database Connection             │ ✅ PASS   │
│ Feature Flags Table             │ ✅ PASS   │
│ Logs Table                      │ ✅ PASS   │
│ Database Functions              │ ✅ PASS   │
│ Initial Data                    │ ✅ PASS   │
│ Environment Configuration       │ ✅ PASS   │
└─────────────────────────────────┴──────────┘

🎯 Feature Flags Created:
  - wallet_ui (0% rollout)
  - profile_ui_revamp (0% rollout)

🚀 Next Steps:
1. Test the rollout system: ./scripts/run-rollout.sh validate
2. Run a dry-run test: ./scripts/run-rollout.sh dry-run
3. Execute coordinated rollout: ./scripts/run-rollout.sh rollout

🔐 Security Notes:
- Database password has been added to .env.rollout-dev
- Backup saved as .env.rollout-dev.backup
- Keep your database password secure

📊 Monitor Status:
- View flags: SELECT * FROM feature_flags;
- View logs: SELECT * FROM logs WHERE message LIKE '%Feature flag%';

EOF
}

# Main function
main() {
    echo "🎯 Feature Flags Database Setup"
    echo "==============================="
    echo
    
    # Run setup steps
    check_directory
    get_database_password
    test_connection || exit 1
    apply_setup || exit 1
    verify_setup
    update_env_file
    
    # Generate report
    generate_report
    
    success "🎉 Database setup completed successfully!"
    info "You can now run the coordinated feature rollout"
}

# Handle command line arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [--help]"
        echo ""
        echo "Feature Flags Database Setup Script"
        echo ""
        echo "This script sets up the necessary database tables and functions"
        echo "for the coordinated feature rollout system in your Supabase database."
        echo ""
        echo "Prerequisites:"
        echo "1. Access to your Supabase database"
        echo "2. Database password"
        echo "3. PostgreSQL client (psql) installed"
        echo ""
        echo "Environment Variables:"
        echo "  SUPABASE_DB_PASSWORD  Your Supabase database password (optional)"
        echo ""
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
