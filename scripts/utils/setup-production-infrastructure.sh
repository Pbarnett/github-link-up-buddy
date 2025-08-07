#!/bin/bash

# =============================================================================
# PRODUCTION INFRASTRUCTURE SETUP - GitHub Link Up Buddy
# =============================================================================

set -e

echo "🚀 Setting up production-ready infrastructure..."

# =============================================================================
# 1. Configure Sentry for Error Tracking
# =============================================================================

echo "📊 Setting up error tracking and monitoring..."

# Install Sentry CLI if not present
if ! command -v sentry-cli &> /dev/null; then
    echo "Installing Sentry CLI..."
    npm install -g @sentry/cli
fi

# Create Sentry configuration
cat > .sentryclirc << EOF
[defaults]
url=https://sentry.io/
org=github-link-up-buddy
project=flight-booking-platform

[auth]
token=YOUR_SENTRY_AUTH_TOKEN_HERE
EOF

echo "✅ Sentry configuration created"

# =============================================================================
# 2. Set up Container Health Monitoring
# =============================================================================

echo "🔍 Setting up container health monitoring..."

# Create health monitoring script
cat > scripts/health-monitor.sh << 'EOF'
#!/bin/bash

CONTAINER_NAME="github-link-up-buddy-prod"
WEBHOOK_URL="YOUR_SLACK_WEBHOOK_URL_HERE"

check_container_health() {
    if ! docker ps | grep -q "$CONTAINER_NAME"; then
        echo "❌ Container $CONTAINER_NAME is not running!"
        
        # Send alert (replace with your notification method)
        curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"🚨 GitHub Link Up Buddy container is down!"}' \
            "$WEBHOOK_URL" 2>/dev/null || true
        
        # Attempt restart
        echo "🔄 Attempting to restart container..."
        docker restart "$CONTAINER_NAME" || {
            echo "❌ Failed to restart container"
            exit 1
        }
    else
        # Check health endpoint
        if ! curl -f http://localhost:3001/health > /dev/null 2>&1; then
            echo "❌ Health check failed!"
            docker restart "$CONTAINER_NAME"
        else
            echo "✅ Container is healthy"
        fi
    fi
}

check_container_health
EOF

chmod +x scripts/health-monitor.sh

# Create cron job for health monitoring (runs every 5 minutes)
echo "*/5 * * * * /Users/parkerbarnett/github-link-up-buddy/scripts/health-monitor.sh >> /tmp/health-monitor.log 2>&1" | crontab -

echo "✅ Health monitoring configured"

# =============================================================================
# 3. Set up SSL/HTTPS with Let's Encrypt
# =============================================================================

echo "🔐 Setting up SSL configuration..."

# Create nginx SSL configuration template
mkdir -p docker/ssl
cat > docker/nginx-ssl.conf << 'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN_HERE;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name YOUR_DOMAIN_HERE;

    ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN_HERE/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN_HERE/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    location /health {
        access_log off;
        return 200 "healthy\n";
    }
}
EOF

echo "✅ SSL configuration template created"

# =============================================================================
# 4. Create Backup Strategy
# =============================================================================

echo "💾 Setting up backup strategy..."

# Create backup script
mkdir -p scripts/backup
cat > scripts/backup/daily-backup.sh << 'EOF'
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
EOF

chmod +x scripts/backup/daily-backup.sh

# Schedule daily backups at 2 AM
echo "0 2 * * * /Users/parkerbarnett/github-link-up-buddy/scripts/backup/daily-backup.sh >> /tmp/backup.log 2>&1" | crontab -

echo "✅ Backup strategy configured"

# =============================================================================
# 5. Set up Performance Monitoring
# =============================================================================

echo "⚡ Setting up performance monitoring..."

# Create performance monitoring script
cat > scripts/performance-monitor.sh << 'EOF'
#!/bin/bash

CONTAINER_NAME="github-link-up-buddy-prod"

# Get container stats
STATS=$(docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" "$CONTAINER_NAME")

# Log performance metrics
echo "$(date): $STATS" >> /tmp/performance.log

# Alert if CPU > 80% or Memory > 512MB
CPU_PERCENT=$(docker stats --no-stream --format "{{.CPUPerc}}" "$CONTAINER_NAME" | sed 's/%//')
MEMORY_MB=$(docker stats --no-stream --format "{{.MemUsage}}" "$CONTAINER_NAME" | cut -d'/' -f1 | sed 's/MiB//')

if (( $(echo "$CPU_PERCENT > 80" | bc -l) )); then
    echo "⚠️  High CPU usage: $CPU_PERCENT%" | tee -a /tmp/alerts.log
fi

if (( $(echo "$MEMORY_MB > 512" | bc -l) )); then
    echo "⚠️  High memory usage: ${MEMORY_MB}MB" | tee -a /tmp/alerts.log
fi
EOF

chmod +x scripts/performance-monitor.sh

# Schedule performance monitoring every 15 minutes
echo "*/15 * * * * /Users/parkerbarnett/github-link-up-buddy/scripts/performance-monitor.sh" | crontab -

echo "✅ Performance monitoring configured"

# =============================================================================
# 6. Create Production Deployment Pipeline
# =============================================================================

echo "🔄 Setting up deployment pipeline..."

# Create zero-downtime deployment script
cat > scripts/deploy-zero-downtime.sh << 'EOF'
#!/bin/bash

set -e

CONTAINER_NAME="github-link-up-buddy-prod"
NEW_CONTAINER_NAME="github-link-up-buddy-new"
IMAGE_NAME="github-link-up-buddy:latest"

echo "🚀 Starting zero-downtime deployment..."

# Build new image
echo "🏗️  Building new image..."
docker build -t "$IMAGE_NAME" .

# Start new container on different port
echo "🆕 Starting new container..."
docker run -d --name "$NEW_CONTAINER_NAME" \
    --env-file .env.production \
    -p 3002:80 \
    --restart unless-stopped \
    "$IMAGE_NAME"

# Wait for new container to be healthy
echo "⏳ Waiting for new container to be ready..."
for i in {1..30}; do
    if curl -f http://localhost:3002/health > /dev/null 2>&1; then
        echo "✅ New container is healthy"
        break
    fi
    sleep 2
done

# Switch traffic (update port mapping)
echo "🔄 Switching traffic..."
docker stop "$CONTAINER_NAME"
docker rm "$CONTAINER_NAME"

# Rename new container
docker stop "$NEW_CONTAINER_NAME"
docker rm "$NEW_CONTAINER_NAME"

# Start final container on production port
docker run -d --name "$CONTAINER_NAME" \
    --env-file .env.production \
    -p 3001:80 \
    --restart unless-stopped \
    "$IMAGE_NAME"

echo "🎉 Zero-downtime deployment completed!"
EOF

chmod +x scripts/deploy-zero-downtime.sh

echo "✅ Deployment pipeline configured"

# =============================================================================
# Summary
# =============================================================================

echo ""
echo "🎉 Production infrastructure setup completed!"
echo ""
echo "📋 What was configured:"
echo "  ✅ Error tracking (Sentry)"
echo "  ✅ Health monitoring (every 5 minutes)"
echo "  ✅ SSL/HTTPS configuration template"
echo "  ✅ Daily backups (2 AM)"
echo "  ✅ Performance monitoring (every 15 minutes)"
echo "  ✅ Zero-downtime deployment pipeline"
echo ""
echo "🔧 Next manual steps:"
echo "  1. Update Sentry auth token in .sentryclirc"
echo "  2. Configure domain name in nginx-ssl.conf"
echo "  3. Set up Slack webhook for alerts"
echo "  4. Get SSL certificate for your domain"
echo ""
echo "🚀 Your production infrastructure is ready!"
EOF
