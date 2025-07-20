# Use the official Node.js 18 image as base
FROM node:18-alpine AS base

# Install pnpm globally and setup build dependencies
RUN apk add --no-cache \
    build-base \
    python3 \
    make \
    g++ && \
    npm install -g pnpm@latest && \
    # Create non-root user for security
    addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files for dependency installation (better layer caching)
COPY --chown=nextjs:nodejs package.json pnpm-lock.yaml ./

# Install dependencies with frozen lockfile for reproducible builds
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline

# Copy source code with proper ownership
COPY --chown=nextjs:nodejs . .

# Build stage
FROM base AS build

# Set build-time environment variables for Vite
ARG VITE_SUPABASE_URL=https://bbonngdyfyfjqfhvoljl.supabase.co
ARG VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib25uZ2R5ZnlmanFmaHZvbGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNTE5NTQsImV4cCI6MjA2MjgyNzk1NH0.qoXypUh-SemZwFjTyONGztNbhoowqLMiKSRKgA7fRR0
ARG VITE_FLAG_FS_V2=true

# Build the application with environment variables
RUN pnpm build

# Production stage with enhanced security
FROM nginx:alpine AS production

# Install curl for health checks, create directories, and apply security hardening in single layer
RUN apk add --no-cache curl && \
    mkdir -p /var/cache/nginx /var/log/nginx && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx && \
    # Remove unnecessary packages and files
    rm -rf /var/cache/apk/* /tmp/* && \
    # Create non-root user for better security
    addgroup -g 101 -S nginx-group && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx-group nginx-user

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

# Security: Switch to non-root user
USER nginx

# Expose port 80
EXPOSE 80

# Enhanced health check with timeout and proper user
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Start nginx as non-root
CMD ["nginx", "-g", "daemon off;"]
