#!/bin/bash

BACKUP_DIR="/Users/parkerbarnett/github-link-up-buddy/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup Docker image
echo "📦 Backing up Docker image..."
docker save github-link-up-buddy:latest | gzip > "$BACKUP_DIR/app-image-$DATE.tar.gz"

# Backup environment files
echo "📋 Backing up configuration..."
cp .env.production "$BACKUP_DIR/env-production-$DATE.backup"

# Backup application data (if any volumes)
if docker volume ls | grep -q github-link-up-buddy; then
    echo "💽 Backing up volumes..."
    docker run --rm -v github-link-up-buddy-data:/data -v "$BACKUP_DIR":/backup alpine tar czf "/backup/data-$DATE.tar.gz" /data
fi

# Clean up old backups (keep last 7 days)
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.backup" -mtime +7 -delete

echo "✅ Backup completed: $BACKUP_DIR"
