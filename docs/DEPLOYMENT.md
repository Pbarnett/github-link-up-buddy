# Parker Flight - Docker Deployment Guide

This guide covers the comprehensive Docker deployment system for Parker Flight, including production deployment, monitoring, and troubleshooting.

## Table of Contents

- [Quick Start](#quick-start)
- [Deployment Script Features](#deployment-script-features)
- [Usage Examples](#usage-examples)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Production Best Practices](#production-best-practices)

## Quick Start

### Prerequisites

Before deploying, ensure you have:

1. **Docker & Docker Compose** installed and running
2. **Node.js 20+** and **pnpm** (for TypeScript validation)
3. **Environment file**: `.env.production` with all required variables
4. **Repository access**: Ensure you're in the correct project directory

### Standard Deployment

```bash
# Basic deployment (default)
./scripts/deploy.sh

# Or explicitly
./scripts/deploy.sh deploy
```

This will:
- ✅ Validate prerequisites
- ✅ Run TypeScript checks
- ✅ Create backups
- ✅ Build Docker image
- ✅ Deploy with zero downtime
- ✅ Perform health checks
- ✅ Clean up old resources
- ✅ Show deployment status

## Deployment Script Features

### Core Features

- **Zero-downtime deployment**: Rolling updates without service interruption
- **TypeScript validation**: Pre-deployment code validation and linting
- **Health checks**: Comprehensive application health monitoring
- **Automatic backups**: Environment and container backups before deployment
- **Rollback capability**: Quick rollback to previous working version
- **Comprehensive logging**: Timestamped logs saved to `deployment.log`
- **Resource cleanup**: Automatic cleanup of old Docker images and volumes

### Command Line Options

```bash
./scripts/deploy.sh [OPTIONS] [COMMAND]
```

#### Available Commands

| Command | Description |
|---------|-------------|
| `deploy` | Deploy the application (default) |
| `rollback` | Rollback to previous version |
| `status` | Show current deployment status |
| `logs` | Show live application logs |
| `stop` | Stop the application |
| `restart` | Restart the application |
| `validate` | Run validation checks only |

#### Available Options

| Option | Description |
|--------|-------------|
| `--skip-typescript` | Skip TypeScript validation |
| `--skip-healthcheck` | Skip health checks |
| `--enable-monitoring` | Enable monitoring stack |
| `--verbose` | Enable verbose output |
| `--force-rebuild` | Force rebuild without cache |
| `--no-cleanup` | Don't cleanup old images |
| `-h, --help` | Show help message |

## Usage Examples

### Development Scenarios

```bash
# Quick deployment without TypeScript checks
./scripts/deploy.sh --skip-typescript deploy

# Verbose deployment with monitoring
./scripts/deploy.sh --verbose --enable-monitoring deploy

# Force rebuild (useful after dependency changes)
./scripts/deploy.sh --force-rebuild deploy

# Validate code without deploying
./scripts/deploy.sh validate
```

### Production Scenarios

```bash
# Production deployment with all checks
./scripts/deploy.sh deploy

# Production deployment with monitoring
./scripts/deploy.sh --enable-monitoring deploy

# Emergency rollback
./scripts/deploy.sh rollback

# Check deployment status
./scripts/deploy.sh status
```

### Troubleshooting Scenarios

```bash
# Deployment with verbose logging
./scripts/deploy.sh --verbose deploy

# Skip health checks if endpoint is not ready
./scripts/deploy.sh --skip-healthcheck deploy

# Force rebuild and skip cleanup for debugging
./scripts/deploy.sh --force-rebuild --no-cleanup deploy
```

## Configuration

### Environment Variables

Ensure your `.env.production` file contains all required variables:

```bash
# Required environment variables
NODE_ENV=production
PORT=80

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Feature Flags
VITE_FLAG_FS_V2=true

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Additional production variables...
```

### Docker Configuration

The deployment uses these Docker configurations:

- **Main service**: `docker-compose.yml`
- **Monitoring** (optional): `docker-compose.monitoring.yml`
- **Health check**: `/health` endpoint on port 80
- **Resource limits**: Defined in docker-compose.yml

### TypeScript Configuration

The script validates TypeScript using:

- **Compiler check**: `pnpm run tsc --noEmit`
- **Linting**: `pnpm run lint --max-warnings=0` (if available)
- **Dependencies**: Auto-installs if `node_modules` missing

## Troubleshooting

### Common Issues and Solutions

#### 1. TypeScript Validation Errors

```bash
# Error: TypeScript compilation failed
# Solution: Fix TypeScript errors or skip validation
./scripts/deploy.sh --skip-typescript deploy
```

#### 2. Health Check Failures

```bash
# Error: Health check failed after 30 attempts
# Solution: Check logs and skip health check temporarily
./scripts/deploy.sh --skip-healthcheck deploy
./scripts/deploy.sh logs  # Check application logs
```

#### 3. Build Failures

```bash
# Error: Docker build failed
# Solution: Force rebuild and check environment
./scripts/deploy.sh --force-rebuild --verbose deploy
```

#### 4. Environment Issues

```bash
# Error: .env.production not found
# Solution: Create environment file
cp .env.example .env.production
# Edit .env.production with production values
```

#### 5. Port Conflicts

```bash
# Error: Port 80 already in use
# Solution: Stop existing containers
docker-compose down
./scripts/deploy.sh deploy
```

### Emergency Procedures

#### Quick Rollback

```bash
# Immediate rollback to previous version
./scripts/deploy.sh rollback

# Check rollback status
./scripts/deploy.sh status
```

#### Force Stop and Clean Restart

```bash
# Stop everything
./scripts/deploy.sh stop

# Clean deployment
docker system prune -f
./scripts/deploy.sh --force-rebuild deploy
```

### Monitoring and Logs

#### Real-time Monitoring

```bash
# Live application logs
./scripts/deploy.sh logs

# Container status
./scripts/deploy.sh status

# Resource usage
docker stats

# Health check
curl http://localhost/health
```

#### Log Analysis

```bash
# Deployment logs
tail -f deployment.log

# Container-specific logs
docker-compose logs -f parker-flight

# System logs
docker system events
```

## Production Best Practices

### Pre-deployment Checklist

- [ ] Environment variables are up-to-date
- [ ] TypeScript compilation passes
- [ ] Tests pass (run `pnpm test` if available)
- [ ] Dependencies are updated and secure
- [ ] Backup strategy is in place
- [ ] Monitoring is configured

### Deployment Strategy

1. **Staging deployment**: Test in staging environment first
2. **Off-peak deployment**: Deploy during low-traffic periods
3. **Health monitoring**: Monitor application health post-deployment
4. **Rollback readiness**: Keep rollback plan ready

### Monitoring Setup

```bash
# Enable monitoring stack
./scripts/deploy.sh --enable-monitoring deploy

# Monitor key metrics:
# - Application response time
# - Error rates
# - Resource usage
# - Health check status
```

### Security Considerations

- Keep environment variables secure and up-to-date
- Regularly update Docker images and dependencies
- Use the security scanning feature if available
- Monitor for vulnerabilities using `trivy` (auto-enabled if installed)

### Performance Optimization

- Use `--no-cleanup` sparingly to avoid disk space issues
- Regular cleanup: `docker system prune -f`
- Monitor resource usage and adjust limits as needed
- Consider load balancing for high-traffic scenarios

## Files and Structure

```
scripts/
├── deploy.sh          # Main deployment script
├── build.sh           # Docker build script
backups/               # Automatic backups directory
deployment.log         # Deployment logs
docker-compose.yml     # Main Docker configuration
docker-compose.monitoring.yml  # Monitoring stack (optional)
.env.production       # Production environment variables
```

## Support and Maintenance

### Regular Maintenance

- Review deployment logs regularly
- Update environment variables as needed
- Clean up old Docker images: `docker image prune -f`
- Monitor disk space usage
- Update dependencies regularly

### Getting Help

- Check deployment logs: `deployment.log`
- Use verbose mode: `--verbose`
- Run validation only: `validate`
- Check application status: `status`

---

## Changelog

### Version 2.0 Features

- ✅ Enhanced TypeScript validation
- ✅ Comprehensive health checks  
- ✅ Advanced logging system
- ✅ Command-line argument parsing
- ✅ Monitoring stack support
- ✅ Improved error handling
- ✅ Resource cleanup options
- ✅ Backup and rollback system

For additional support or feature requests, please check the project documentation or create an issue in the repository.
