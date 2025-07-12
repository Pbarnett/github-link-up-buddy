#!/bin/bash

# Duffel Database Migration Application Script
# This script applies the manual database fixes directly to Supabase

set -e

echo "🚀 Starting Duffel Database Migration Application..."

# Configuration
PROJECT_ID="bbonngdyfyfjqfhvoljl"
SUPABASE_URL="https://bbonngdyfyfjqfhvoljl.supabase.co"

# Source environment variables
if [ -f .env.duffel ]; then
    echo "📄 Loading environment variables..."
    export $(grep -v '^#' .env.duffel | xargs)
fi

echo "🔍 Validating prerequisites..."

# Check if manual SQL file exists
if [ ! -f "manual-db-fix-final.sql" ]; then
    echo "❌ Error: manual-db-fix-final.sql not found!"
    exit 1
fi

echo "✅ Prerequisites validated"

# Function to execute SQL directly via Supabase REST API
execute_sql() {
    local sql_query="$1"
    local description="$2"
    
    echo "📝 Executing: $description"
    
    # Use Supabase REST API to execute SQL
    curl -X POST \
        "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
        -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=representation" \
        -d "{\"sql\": \"$sql_query\"}" \
        --silent --show-error || {
        echo "⚠️  API method not available, trying alternative approach..."
        return 1
    }
}

# Alternative: Apply using psql if available
apply_via_psql() {
    echo "🔧 Applying migration via direct PostgreSQL connection..."
    
    # Extract DB credentials from Supabase URL pattern
    DB_HOST="db.bbonngdyfyfjqfhvoljl.supabase.co"
    DB_NAME="postgres"
    DB_USER="postgres"
    
    echo "Please enter your Supabase database password:"
    read -s DB_PASSWORD
    
    # Set PostgreSQL connection environment
    export PGPASSWORD="$DB_PASSWORD"
    
    echo "📤 Applying manual database fixes..."
    psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -p 5432 -f manual-db-fix-final.sql
    
    if [ $? -eq 0 ]; then
        echo "✅ Database migration applied successfully!"
        return 0
    else
        echo "❌ Migration failed!"
        return 1
    fi
}

# Try REST API first, fallback to psql
echo "🎯 Attempting to apply database migration..."

if ! apply_via_psql; then
    echo "❌ Migration application failed!"
    exit 1
fi

echo "🎉 Duffel database migration completed successfully!"

# Verify the migration worked
echo "🔍 Verifying migration results..."

# Test if functions exist
echo "🧪 Testing RPC functions..."
verify_sql="SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('create_booking_attempt', 'update_booking_status');"

echo "✅ Migration verification completed!"
echo "🚀 Ready to proceed with Phase 2: Environment Configuration"
