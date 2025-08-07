#!/bin/bash

# Backup script for staging database before personalization migration
# Usage: ./scripts/backup-staging.sh

set -e

echo "Creating backup directory..."
mkdir -p backups

echo "Backing up staging database..."
supabase db dump --linked > backups/20250709_pre_personalization.sql

echo "✅ Database backup created: backups/20250709_pre_personalization.sql"
echo "File size: $(ls -lh backups/20250709_pre_personalization.sql | awk '{print $5}')"
