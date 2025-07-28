#!/bin/bash

# Deployment Status Check Script
# Parker Flight - Authentication Migration Service

echo "🚀 Parker Flight - Deployment Status Check"
echo "==========================================="
echo

# Check Docker
echo "📦 Docker Status:"
if command -v docker &> /dev/null; then
    echo "✅ Docker installed: $(docker --version)"
    if docker info &> /dev/null; then
        echo "✅ Docker daemon running"
    else
        echo "❌ Docker daemon not running"
        exit 1
    fi
else
    echo "❌ Docker not installed"
    exit 1
fi
echo

# Check containers
echo "🐳 Container Status:"
if docker-compose ps | grep parker-flight-app &> /dev/null; then
    CONTAINER_STATUS=$(docker-compose ps parker-flight | tail -1 | awk '{print $6" "$7}')
    echo "✅ Parker Flight container: $CONTAINER_STATUS"
else
    echo "❌ Parker Flight container not running"
    echo "💡 Run: docker-compose up -d"
fi
echo

# Check health endpoints
echo "🏥 Health Check:"
if curl -f http://localhost/health &> /dev/null; then
    echo "✅ Basic health endpoint: $(curl -s http://localhost/health)"
else
    echo "❌ Basic health endpoint failed"
fi

if curl -f http://localhost/api/health &> /dev/null; then
    echo "✅ API health endpoint: Working"
    # Pretty print JSON health response
    echo "📊 Health Details:"
    curl -s http://localhost/api/health | python3 -m json.tool 2>/dev/null || echo "   Raw: $(curl -s http://localhost/api/health)"
else
    echo "❌ API health endpoint failed"
fi
echo

# Check migration service configuration
echo "🔄 Migration Service Status:"
if docker logs parker-flight-app 2>/dev/null | grep -q "Migration Service"; then
    echo "✅ Migration service initialized"
else
    echo "⚠️  Migration service logs not found (normal for fresh deployment)"
fi

# Environment check
echo "🌍 Environment Configuration:"
ENV_VARS=$(docker inspect parker-flight-app 2>/dev/null | grep -E "(VITE_ENVIRONMENT|VITE_ENABLE_MODERN_AUTH|VITE_ENABLE_ONE_TAP)" | head -3)
if [ ! -z "$ENV_VARS" ]; then
    echo "✅ Migration environment variables configured"
    echo "$ENV_VARS" | sed 's/^/   /'
else
    echo "⚠️  Migration environment variables not visible (may be build-time only)"
fi
echo

# Network check
echo "🌐 Network Accessibility:"
if curl -I http://localhost/ &> /dev/null; then
    HTTP_STATUS=$(curl -I http://localhost/ 2>/dev/null | head -1)
    echo "✅ Application accessible: $HTTP_STATUS"
    echo "📱 URL: http://localhost"
else
    echo "❌ Application not accessible on http://localhost"
fi
echo

# Summary
echo "📋 Summary:"
if curl -f http://localhost/health &> /dev/null && docker-compose ps | grep -q "healthy"; then
    echo "🎉 Deployment Status: HEALTHY ✅"
    echo "🚀 Your authentication migration service is ready!"
    echo
    echo "Next steps:"
    echo "1. Visit http://localhost to test the application"
    echo "2. Check migration analytics in browser console"
    echo "3. Configure production environment variables"
    echo "4. Set up SSL certificate for production"
else
    echo "⚠️  Deployment Status: NEEDS ATTENTION"
    echo "💡 Try: docker-compose restart parker-flight"
fi
echo
