# Docker Deployment Guide for Enhanced AWS SDK Integration

This guide provides comprehensive instructions for deploying the Enhanced AWS SDK integration using Docker containers.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Configuration](#environment-configuration)
4. [Docker Services](#docker-services)
5. [Deployment Commands](#deployment-commands)
6. [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)
7. [Production Deployment](#production-deployment)
8. [Security Best Practices](#security-best-practices)

## Prerequisites

### Required Software

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Node.js**: Version 18 or higher (for local development)

### Installation

#### macOS
```bash
# Using Homebrew
brew install docker docker-compose

# Or download Docker Desktop
# https://docs.docker.com/desktop/mac/install/
```

#### Ubuntu/Debian
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Windows
Download and install Docker Desktop from the [official website](https://docs.docker.com/desktop/windows/install/).

### AWS Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured (optional, for local testing)
- KMS keys created (or use our CloudFormation template)

## Quick Start

### 1. Clone and Setup

```bash
git clone <your-repository>
cd github-link-up-buddy
```

### 2. Configure Environment

```bash
# Copy the Docker environment template
cp .env.docker .env

# Edit the .env file with your AWS credentials and settings
nano .env
```

### 3. Deploy Everything

```bash
# Run the complete deployment workflow
chmod +x scripts/docker-deploy.cjs
node scripts/docker-deploy.cjs full-deploy
```

This single command will:
- Build all Docker images
- Start the core services
- Run AWS infrastructure deployment
- Setup CloudWatch monitoring
- Run integration tests
- Show service status

## Environment Configuration

### Required Environment Variables

Edit your `.env` file with the following required variables:

```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# KMS Key Aliases (will be created if they don't exist)
KMS_GENERAL_ALIAS=alias/parker-flight-general-production
KMS_PII_ALIAS=alias/parker-flight-pii-production
KMS_PAYMENT_ALIAS=alias/parker-flight-payment-production

# Monitoring (optional)
ALERT_EMAIL=your-email@example.com
```

### Optional Configuration

```bash
# Performance tuning
MAX_SOCKETS=50
CONNECTION_TIMEOUT=5000
SOCKET_TIMEOUT=30000

# Multi-region setup
MULTI_REGION_ENABLED=true
BACKUP_REGIONS=us-west-2,eu-west-1,ap-southeast-1
FAILOVER_STRATEGY=latency

# Application settings
APPLICATION_NAME=Parker Flight
SERVICE_NAME=KMS Encryption Service
```

## Docker Services

The Docker Compose configuration includes several specialized services:

### Core Services

#### `aws-sdk-backend`
- **Purpose**: Main enhanced AWS SDK integration service
- **Port**: 3000 (configurable via `HOST_PORT`)
- **Health Check**: KMS connectivity validation
- **Resources**: 512MB RAM limit, 0.5 CPU

### Deployment Services (Profiles)

#### `deployment-runner`
- **Purpose**: Runs AWS infrastructure deployment
- **Profile**: `deployment`
- **Usage**: Creates KMS keys, IAM roles, policies

#### `monitoring-setup`
- **Purpose**: Configures CloudWatch monitoring and alarms
- **Profile**: `monitoring`
- **Usage**: Sets up dashboards, metrics, and SNS alerts

#### `integration-tests`
- **Purpose**: Runs comprehensive integration tests
- **Profile**: `testing`
- **Usage**: Validates the entire deployment

#### `aws-cli`
- **Purpose**: AWS CLI utilities container
- **Profile**: `deployment`
- **Usage**: AWS operations and debugging

## Deployment Commands

### Basic Commands

```bash
# Build Docker images
node scripts/docker-deploy.cjs build

# Start core services
node scripts/docker-deploy.cjs start

# Stop all services
node scripts/docker-deploy.cjs stop

# Show service status
node scripts/docker-deploy.cjs status

# View logs (follow mode)
node scripts/docker-deploy.cjs logs
```

### Advanced Commands

```bash
# Rebuild images (no cache)
node scripts/docker-deploy.cjs rebuild

# Restart services
node scripts/docker-deploy.cjs restart

# Run AWS deployment only
node scripts/docker-deploy.cjs deploy

# Setup monitoring only
node scripts/docker-deploy.cjs monitoring

# Run tests only
node scripts/docker-deploy.cjs test

# Complete cleanup
node scripts/docker-deploy.cjs cleanup
```

### Manual Docker Compose Commands

For more control, you can use Docker Compose directly:

```bash
# Start specific services
docker-compose -f docker-compose.aws-sdk.yml up -d aws-sdk-backend

# Run deployment with specific profile
docker-compose -f docker-compose.aws-sdk.yml --profile deployment run --rm deployment-runner

# View logs for specific service
docker-compose -f docker-compose.aws-sdk.yml logs -f aws-sdk-backend

# Scale services
docker-compose -f docker-compose.aws-sdk.yml up -d --scale aws-sdk-backend=3
```

## Monitoring and Troubleshooting

### Health Checks

All services include health checks that verify:
- Container is running
- Application is responding
- AWS connectivity is working
- KMS keys are accessible

```bash
# Check health status
docker-compose -f docker-compose.aws-sdk.yml ps

# View health check logs
docker inspect parker-flight-aws-sdk --format='{{json .State.Health}}'
```

### Log Management

```bash
# View all logs
node scripts/docker-deploy.cjs logs

# View specific service logs
docker-compose -f docker-compose.aws-sdk.yml logs aws-sdk-backend

# Follow logs in real-time
docker-compose -f docker-compose.aws-sdk.yml logs -f aws-sdk-backend

# View logs with timestamps
docker-compose -f docker-compose.aws-sdk.yml logs -t aws-sdk-backend
```

### Common Issues

#### 1. AWS Credentials Issues
```bash
# Check if AWS credentials are configured
docker-compose -f docker-compose.aws-sdk.yml exec aws-sdk-backend aws sts get-caller-identity

# Check environment variables
docker-compose -f docker-compose.aws-sdk.yml exec aws-sdk-backend printenv | grep AWS
```

#### 2. KMS Access Issues
```bash
# Test KMS connectivity
docker-compose -f docker-compose.aws-sdk.yml exec aws-sdk-backend \
  node -e "require('./config/aws-sdk-enhanced.config.js').validate()"

# List available KMS keys
docker-compose -f docker-compose.aws-sdk.yml exec aws-sdk-backend \
  aws kms list-aliases --region us-east-1
```

#### 3. Container Health Issues
```bash
# Check container status
docker ps -a

# Inspect container logs
docker logs parker-flight-aws-sdk

# Execute shell in container
docker exec -it parker-flight-aws-sdk sh
```

### Performance Monitoring

```bash
# Monitor resource usage
docker stats

# View detailed container information
docker inspect parker-flight-aws-sdk

# Monitor network traffic
docker network ls
docker network inspect parker-flight-network
```

## Production Deployment

### Environment-Specific Configurations

#### Development
```bash
# .env.development
NODE_ENV=development
AWS_SDK_LOG_LEVEL=debug
ENABLE_DETAILED_METRICS=false
MULTI_REGION_ENABLED=false
```

#### Staging
```bash
# .env.staging
NODE_ENV=staging
AWS_SDK_LOG_LEVEL=info
ENABLE_DETAILED_METRICS=true
MULTI_REGION_ENABLED=true
BACKUP_REGIONS=us-west-2
```

#### Production
```bash
# .env.production
NODE_ENV=production
AWS_SDK_LOG_LEVEL=warn
ENABLE_DETAILED_METRICS=true
MULTI_REGION_ENABLED=true
BACKUP_REGIONS=us-west-2,eu-west-1,ap-southeast-1
CREDENTIAL_SOURCE=instance-metadata  # Use IAM roles
```

### Production Deployment Steps

1. **Prepare Environment**
   ```bash
   # Create production environment file
   cp .env.docker .env.production
   # Edit with production settings
   ```

2. **Deploy Infrastructure**
   ```bash
   # Set environment
   export NODE_ENV=production
   
   # Run deployment
   node scripts/docker-deploy.cjs full-deploy
   ```

3. **Configure Load Balancer**
   ```bash
   # Example Nginx configuration
   # Proxy requests to localhost:3000
   ```

4. **Setup Process Management**
   ```bash
   # Use Docker Swarm, Kubernetes, or systemd
   # for container orchestration
   ```

### Scaling Considerations

```bash
# Scale horizontally
docker-compose -f docker-compose.aws-sdk.yml up -d --scale aws-sdk-backend=3

# Configure load balancing
# Use nginx, HAProxy, or AWS ALB
```

## Security Best Practices

### Container Security

1. **Non-root User**
   - All containers run as non-root user `nodejs`
   - File permissions are properly set

2. **Resource Limits**
   - Memory and CPU limits are enforced
   - Prevents resource exhaustion

3. **Network Security**
   - Containers use isolated network
   - Only necessary ports are exposed

### AWS Security

1. **IAM Roles** (Recommended for Production)
   ```bash
   # Use IAM roles instead of access keys
   CREDENTIAL_SOURCE=instance-metadata
   # Remove AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
   ```

2. **KMS Key Policies**
   - Restrict access to necessary principals
   - Use encryption context for additional security

3. **Monitoring**
   - Enable CloudTrail for audit logging
   - Monitor CloudWatch for unusual activity

### Environment Security

```bash
# Secure .env file
chmod 600 .env

# Use Docker secrets for sensitive data (Docker Swarm)
echo "your-secret" | docker secret create aws_secret_key -

# Use Kubernetes secrets (if using k8s)
kubectl create secret generic aws-credentials \
  --from-literal=access-key-id=your-key \
  --from-literal=secret-access-key=your-secret
```

## Advanced Configuration

### Custom Health Checks

```yaml
# In docker-compose.aws-sdk.yml
healthcheck:
  test: ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Resource Optimization

```yaml
# Optimize for your workload
deploy:
  resources:
    limits:
      memory: 1G      # Increase for high throughput
      cpus: '1.0'     # Increase for CPU-intensive operations
    reservations:
      memory: 512M
      cpus: '0.5'
```

### Logging Configuration

```yaml
# Configure log rotation
logging:
  driver: "json-file"
  options:
    max-size: "50m"     # Increase for verbose logging
    max-file: "5"       # Keep more log files
```

## Troubleshooting Guide

### Debug Mode

```bash
# Enable debug logging
export AWS_SDK_LOG_LEVEL=debug
node scripts/docker-deploy.cjs start

# Run with verbose output
docker-compose -f docker-compose.aws-sdk.yml up --build
```

### Common Solutions

1. **Out of Memory**
   ```bash
   # Increase memory limits
   # Edit docker-compose.aws-sdk.yml
   memory: 1G
   ```

2. **Slow Performance**
   ```bash
   # Increase connection pool
   MAX_SOCKETS=100
   CONNECTION_TIMEOUT=3000
   ```

3. **Network Issues**
   ```bash
   # Check network connectivity
   docker-compose -f docker-compose.aws-sdk.yml exec aws-sdk-backend ping aws.amazon.com
   ```

## Support

For issues and support:

1. Check the [troubleshooting section](#monitoring-and-troubleshooting)
2. Review container logs: `node scripts/docker-deploy.cjs logs`
3. Validate configuration: `node scripts/docker-deploy.cjs test`
4. Refer to the [main documentation](enhanced-aws-sdk-usage-examples.md)

## Next Steps

After successful deployment:

1. **Monitor CloudWatch Dashboard** - Check metrics and alarms
2. **Review Logs** - Ensure no errors in application logs
3. **Test Failover** - Verify multi-region functionality
4. **Performance Tuning** - Adjust resource limits based on usage
5. **Security Review** - Implement additional security measures for production
