#!/bin/bash
# Upstash Redis Setup Guide for Auto-Booking System
# This script guides you through setting up Upstash Redis

set -euo pipefail

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

echo "🔴 Setting up Upstash Redis for Auto-Booking System"
echo "=================================================="
echo

log_info "🌐 Step 1: Create Upstash Account and Database"
echo "1. Visit: https://upstash.com"
echo "2. Sign up or log in with your account"
echo "3. Click 'Create Database'"
echo "4. Configure your Redis database:"
echo "   - Name: auto-booking-prod"
echo "   - Region: Choose closest to your users (e.g., us-west-1)"
echo "   - Type: Pay as you go (recommended for production)"
echo "   - TLS: Enabled (recommended)"
echo "5. Click 'Create'"
echo

log_warn "⏳ Please complete the above steps, then press Enter to continue..."
read -p ""

echo
log_info "📋 Step 2: Get Your Redis Credentials"
echo "1. In your Upstash dashboard, click on your 'auto-booking-prod' database"
echo "2. Go to the 'Details' tab"
echo "3. Copy the following credentials:"
echo "   - REST URL (starts with https://)"
echo "   - REST Token (long string)"
echo

# Prompt for credentials
read -p "Enter your Upstash Redis REST URL: " UPSTASH_URL
read -p "Enter your Upstash Redis REST Token: " UPSTASH_TOKEN

# Validate inputs
if [[ ! $UPSTASH_URL =~ ^https:// ]]; then
    log_error "Redis URL should start with 'https://'"
    exit 1
fi

if [[ ${#UPSTASH_TOKEN} -lt 20 ]]; then
    log_error "Redis token seems too short. Please check and try again."
    exit 1
fi

log_success "✅ Credentials validated!"

# Update environment files
log_info "📝 Updating environment configuration..."

# Create backup
cp .env.production .env.production.backup.$(date +%s)

# Update .env.production with Redis credentials
sed -i.bak "s|REDIS_URL=\"rediss://default:{{UPSTASH_REDIS_PASSWORD}}@{{UPSTASH_REDIS_HOST}}:6380\"|REDIS_URL=\"${UPSTASH_URL}\"|g" .env.production
rm .env.production.bak

# Add Upstash-specific environment variables
cat >> .env.production << EOF

# Upstash Redis Configuration (added $(date))
UPSTASH_REDIS_REST_URL="${UPSTASH_URL}"
UPSTASH_REDIS_REST_TOKEN="${UPSTASH_TOKEN}"
EOF

log_success "✅ Environment configuration updated!"

# Test the connection
log_info "🧪 Testing Redis connection..."

# Create a simple test script
cat > /tmp/test-redis.js << 'EOF'
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function testConnection() {
  try {
    console.log('Testing Redis connection...');
    
    // Test basic operations
    await redis.set('test-key', 'Hello from auto-booking system!');
    const result = await redis.get('test-key');
    await redis.del('test-key');
    
    if (result === 'Hello from auto-booking system!') {
      console.log('✅ Redis connection successful!');
      console.log('✅ Read/write operations working');
      process.exit(0);
    } else {
      console.log('❌ Redis connection failed - unexpected result');
      process.exit(1);
    }
  } catch (error) {
    console.log('❌ Redis connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
EOF

# Run the test with the new environment variables
if UPSTASH_REDIS_REST_URL="${UPSTASH_URL}" UPSTASH_REDIS_REST_TOKEN="${UPSTASH_TOKEN}" node /tmp/test-redis.js; then
    log_success "🎉 Upstash Redis setup complete!"
    rm /tmp/test-redis.js
else
    log_error "❌ Redis connection test failed. Please check your credentials."
    rm /tmp/test-redis.js
    exit 1
fi

echo
log_info "📊 Redis Configuration Summary:"
echo "Database Name: auto-booking-prod"
echo "REST URL: ${UPSTASH_URL}"
echo "Token: ${UPSTASH_TOKEN:0:20}..."
echo "Status: ✅ Connected and ready"

echo
log_info "🔄 Next Steps:"
echo "1. Your Redis database is ready for production use"
echo "2. Auto-booking concurrency control is now enabled"
echo "3. You can now run the full pipeline tests"
echo "4. The system will use Redis for:"
echo "   - Trip request locking (prevent duplicate processing)"
echo "   - Job queuing (search → monitor → book → notify)"
echo "   - Monitoring data storage (price history, check counts)"

echo
log_success "🚀 Redis setup complete! Ready for LaunchDarkly flag creation."
