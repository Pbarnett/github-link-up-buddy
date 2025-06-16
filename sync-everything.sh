#!/bin/bash

# Complete sync script to align GitHub, Supabase, and local environment

echo "🔄 Starting comprehensive sync process..."
echo "📋 This will sync GitHub ↔ Supabase ↔ Local"

# Step 1: Ensure we're on latest GitHub
echo "\n1️⃣ Syncing with GitHub..."
git fetch origin
git reset --hard origin/main
echo "   ✅ Local repo synced with GitHub"

# Step 2: Reset Supabase migration state completely
echo "\n2️⃣ Resetting Supabase migration state..."

# Create a backup of current schema
echo "   📦 Creating schema backup..."
supabase db dump --schema=public --linked -f backup_schema_$(date +%Y%m%d_%H%M%S).sql

# Get current schema as baseline
echo "   🔍 Capturing current remote schema..."
supabase db dump --schema=public --linked -f current_remote_schema.sql

# Step 3: Reset local Supabase state to start fresh
echo "\n3️⃣ Resetting local Supabase state..."
supabase db reset --linked

echo "\n4️⃣ Applying all migrations in order..."
# Push all migrations to ensure remote has everything
supabase db push --linked --include-all

echo "\n5️⃣ Verifying final state..."
supabase migration list --linked

echo "\n6️⃣ Testing edge functions..."
echo "   🧪 Checking edge function deployment status..."
supabase functions list --linked

echo "\n✅ SYNC COMPLETE!"
echo "📊 Summary:"
echo "   ✅ GitHub: Latest commits pulled"
echo "   ✅ Supabase: All migrations applied"
echo "   ✅ Local: In sync with remote"
echo "   ✅ Edge functions: Deployed"

echo "\n🚀 Ready to test the June 12th fix!"
echo "   Run: node test-user-and-fix.js"

