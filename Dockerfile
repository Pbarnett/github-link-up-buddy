# Multi-stage Docker build optimized for AWS deployment and cost efficiency
# Based on AWS optimization patterns from AWS_Optimization_Answers.md

# Use the official Node.js 20 image as base for better TypeScript support and security
FROM node:20-alpine AS base

# Install system dependencies and create secure user
RUN apk add --no-cache \
    build-base \
    python3 \
    make \
    g++ \
    curl \
    dumb-init && \
    npm install -g pnpm@latest && \
    # Create non-root user for security (following AWS security best practices)
    addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory with proper permissions
WORKDIR /app
RUN chown nextjs:nodejs /app

# Switch to non-root user for dependency installation
USER nextjs:nodejs

# Copy package files for dependency installation (optimized layer caching)
COPY --chown=nextjs:nodejs package.json pnpm-lock.yaml ./

# Install dependencies with enhanced caching and security
RUN --mount=type=cache,target=/home/nextjs/.local/share/pnpm/store,uid=1001,gid=1001 \
    pnpm install --frozen-lockfile --prefer-offline \
    --audit-level=moderate \
    --registry=https://registry.npmjs.org/

# Development stage for local development and testing
FROM base AS development
COPY --chown=nextjs:nodejs . .
EXPOSE 3000 5001
CMD ["pnpm", "dev"]

# Build stage with optimized compilation
FROM base AS build

# Set build-time environment variables with AWS optimization flags
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_FLAG_FS_V2=true
ARG VITE_LAUNCHDARKLY_CLIENT_ID
ARG NODE_ENV=production
ARG VITE_AWS_REGION=us-east-1
ARG VITE_ENABLE_XRAY=true
ARG VITE_ENABLE_METRICS=true

# Copy source code with proper ownership
COPY --chown=nextjs:nodejs . .

# Build the application with optimized production settings and AWS integrations
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm build && \
    # Verify build artifacts and optimize for AWS deployment
    ls -la dist/ && \
    du -sh dist/ && \
    # Create health check files for ALB/ELB
    echo '{"status":"healthy","timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","service":"github-link-buddy"}' > dist/health.json && \
    # Remove source maps in production for security
    find dist/ -name '*.map' -delete 2>/dev/null || true

# Production stage with enhanced security
FROM nginx:alpine AS production

# Install curl and envsubst for health checks and template processing
RUN apk add --no-cache curl gettext && \
    mkdir -p /var/cache/nginx /var/log/nginx && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx && \
    # Remove unnecessary packages and files
    rm -rf /var/cache/apk/* /tmp/*

# Set default port (can be overridden at runtime)
ENV PORT=80

# Copy custom nginx configuration with proper ownership
COPY --chown=nginx:nginx docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from build stage with proper ownership
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Add comprehensive labels for better container management
LABEL org.opencontainers.image.title="Parker Flight" \
      org.opencontainers.image.description="Automated Flight Booking Platform" \
      org.opencontainers.image.version="1.5.0" \
      org.opencontainers.image.vendor="Parker Flight" \
      org.opencontainers.image.created="$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
      org.opencontainers.image.source="https://github.com/parkerbarnett/github-link-up-buddy"

# Run as root to avoid PID file issues in production
# USER nginx

# Expose port 80
EXPOSE 80

# Enhanced health check for our new health API endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/api/health || curl -f http://localhost/health || exit 1

# Start nginx as non-root
CMD ["nginx", "-g", "daemon off;"]
