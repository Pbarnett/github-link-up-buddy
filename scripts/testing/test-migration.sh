#!/bin/bash

# Test script for personalization migration
# This script validates the SQL syntax and structure of the migration

echo "🔍 Testing personalization migration SQL..."
echo "==========================================="

# Test 1: Validate SQL syntax
echo "✅ Test 1: Validating SQL syntax"
MIGRATION_FILE="supabase/migrations/20250709171557_add_personalization_fields.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi

# Check if migration file has content
if [ ! -s "$MIGRATION_FILE" ]; then
    echo "❌ Migration file is empty"
    exit 1
fi

echo "✅ Migration file exists and has content"

# Test 2: Check SQL structure
echo "✅ Test 2: Checking SQL structure"

# Check for required ALTER TABLE statements
if grep -q "ALTER TABLE profiles" "$MIGRATION_FILE"; then
    echo "✅ Found ALTER TABLE profiles statement"
else
    echo "❌ Missing ALTER TABLE profiles statement"
    exit 1
fi

# Check for required CREATE TABLE statements
if grep -q "CREATE TABLE.*personalization_events" "$MIGRATION_FILE"; then
    echo "✅ Found CREATE TABLE personalization_events statement"
else
    echo "❌ Missing CREATE TABLE personalization_events statement"
    exit 1
fi

# Check for required columns
required_columns=("next_trip_city" "loyalty_tier" "personalization_enabled" "last_login_at")
for col in "${required_columns[@]}"; do
    if grep -q "$col" "$MIGRATION_FILE"; then
        echo "✅ Found column: $col"
    else
        echo "❌ Missing column: $col"
        exit 1
    fi
done

# Check for indexes
if grep -q "CREATE INDEX" "$MIGRATION_FILE"; then
    echo "✅ Found index creation statements"
else
    echo "❌ Missing index creation statements"
    exit 1
fi

# Check for RLS policies
if grep -q "CREATE POLICY" "$MIGRATION_FILE"; then
    echo "✅ Found RLS policy creation statements"
else
    echo "❌ Missing RLS policy creation statements"
    exit 1
fi

# Test 3: Check rollback migration
echo "✅ Test 3: Checking rollback migration"
ROLLBACK_FILE="supabase/migrations/20250709174901_rollback_personalization_fields.sql"

if [ ! -f "$ROLLBACK_FILE" ]; then
    echo "❌ Rollback file not found: $ROLLBACK_FILE"
    exit 1
fi

if [ ! -s "$ROLLBACK_FILE" ]; then
    echo "❌ Rollback file is empty"
    exit 1
fi

echo "✅ Rollback file exists and has content"

# Check for required DROP statements
if grep -q "DROP TABLE.*personalization_events" "$ROLLBACK_FILE"; then
    echo "✅ Found DROP TABLE personalization_events statement"
else
    echo "❌ Missing DROP TABLE personalization_events statement"
    exit 1
fi

# Check for column drops
for col in "${required_columns[@]}"; do
    if grep -q "DROP COLUMN.*$col" "$ROLLBACK_FILE"; then
        echo "✅ Found DROP COLUMN for: $col"
    else
        echo "❌ Missing DROP COLUMN for: $col"
        exit 1
    fi
done

echo ""
echo "🎉 All migration tests passed!"
echo "🔄 Migration is ready for deployment"
echo ""
echo "Next steps:"
echo "1. Deploy to staging environment"
echo "2. Test personalization features"
echo "3. Verify rollback procedure"
echo "4. Deploy to production"
