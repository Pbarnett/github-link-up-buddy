#!/bin/bash

# =============================================================================
# PRODUCTION DEPLOYMENT SCRIPT - GitHub Link Up Buddy
# =============================================================================

set -e

echo "🚀 Starting Production Deployment..."

# =============================================================================
# Pre-deployment Checks
# =============================================================================

echo "🔍 Running pre-deployment validation..."

# Check if production environment file exists
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found"
    echo "Please create .env.production with your production API keys"
    exit 1
fi

# Validate Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ required. Current version: $(node --version)"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running"
    exit 1
fi

echo "✅ Pre-deployment checks passed"

# =============================================================================
# Build Production Assets
# =============================================================================

echo "🏗️ Building production assets..."

# Install dependencies
npm ci --production=false

# Run production build
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - dist directory not found"
    exit 1
fi

echo "✅ Production build completed"

# =============================================================================
# Docker Build and Deploy
# =============================================================================

echo "🐳 Building Docker image..."

# Build production Docker image
docker build -t github-link-up-buddy:latest .

# Tag for deployment
docker tag github-link-up-buddy:latest github-link-up-buddy:production

echo "✅ Docker image built successfully"

# =============================================================================
# Health Check
# =============================================================================

echo "🔍 Running health checks..."

# Start container for testing
docker run -d --name health-check-test \
    --env-file .env.production \
    -p 8888:80 \
    github-link-up-buddy:production

# Wait for container to start
sleep 10

# Check health endpoint
if curl -f http://localhost:8888/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    docker logs health-check-test
    docker stop health-check-test
    docker rm health-check-test
    exit 1
fi

# Clean up test container
docker stop health-check-test
docker rm health-check-test

# =============================================================================
# Deployment Options
# =============================================================================

echo ""
echo "🎉 Production build ready for deployment!"
echo ""
echo "Choose your deployment method:"
echo ""
echo "1. 🚢 Railway (Recommended)"
echo "   - Install Railway CLI: npm install -g @railway/cli"
echo "   - Login: railway login"
echo "   - Deploy: railway up"
echo ""
echo "2. ▲ Vercel"
echo "   - Install Vercel CLI: npm install -g vercel"
echo "   - Login: vercel login"
echo "   - Deploy: vercel --prod"
echo ""
echo "3. 🌊 DigitalOcean App Platform"
echo "   - Push to GitHub and connect via DO console"
echo "   - Or use doctl CLI"
echo ""
echo "4. 🔶 AWS ECS/Fargate"
echo "   - Push image to ECR"
echo "   - Deploy via ECS console or AWS CLI"
echo ""
echo "5. 🎯 Manual Docker Deployment"
echo "   - Export image: docker save github-link-up-buddy:production | gzip > app.tar.gz"
echo "   - Transfer to server and load: docker load < app.tar.gz"
echo "   - Run: docker run -d --env-file .env.production -p 80:80 github-link-up-buddy:production"
echo ""

# =============================================================================
# Next Steps
# =============================================================================

echo "📋 Important Next Steps:"
echo ""
echo "1. 🔐 Update .env.production with real API keys:"
echo "   - Supabase production database"
echo "   - Stripe live keys"
echo "   - OAuth production credentials"
echo "   - AWS production keys"
echo ""
echo "2. 🌐 Set up custom domain and SSL"
echo "3. 📊 Configure monitoring (Sentry, etc.)"
echo "4. 🧪 Test production deployment thoroughly"
echo ""
echo "Your app is ready for production! 🎉"
