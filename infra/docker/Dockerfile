# Multi-stage build for optimal image size and security
# Stage 1: Base image with common dependencies
FROM node:18-alpine AS base

# Install security updates and required packages
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Install pnpm globally
RUN npm install -g pnpm@10.11.0

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Stage 2: Dependencies installation
FROM base AS deps

# Copy package files for dependency installation
COPY --chown=nextjs:nodejs package.json pnpm-lock.yaml ./

# Install dependencies (production only)
RUN pnpm install --frozen-lockfile --prod

# Stage 3: Development dependencies and build
FROM base AS build

# Copy package files
COPY --chown=nextjs:nodejs package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies for build)
# Use --no-frozen-lockfile in development to handle package.json changes
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY --chown=nextjs:nodejs . .

# Build arguments for environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_FLAG_FS_V2=true
ARG VITE_STRIPE_PUBLISHABLE_KEY
ARG NODE_ENV=production

# Build the application
RUN pnpm build

# Stage 4: Production runtime
FROM nginx:alpine AS production

# Install security updates and required packages
RUN apk update && apk upgrade && \
    apk add --no-cache curl dumb-init && \
    rm -rf /var/cache/apk/*

# Create non-root user for nginx
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S nginx-user -u 1001 -G nginx-user

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Set proper permissions
RUN chown -R nginx-user:nginx-user /usr/share/nginx/html && \
    chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    chown -R nginx-user:nginx-user /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx-user:nginx-user /var/run/nginx.pid

# Add build info and labels
ARG BUILD_DATE
ARG VERSION=1.5.0
ARG VCS_REF

LABEL org.opencontainers.image.title="Parker Flight" \
      org.opencontainers.image.description="Automated Flight Booking Platform" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.vendor="Parker Flight" \
      org.opencontainers.image.licenses="MIT"

# Switch to non-root user
USER nginx-user

# Expose port (configurable)
ARG PORT=80
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
