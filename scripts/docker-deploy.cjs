#!/usr/bin/env node

/**
 * Docker Deployment Script for Enhanced AWS SDK Integration
 * 
 * Provides Docker-based deployment automation including:
 * - Container building and management
 * - Environment validation
 * - Service orchestration
 * - Health monitoring
 * - Log management
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class DockerDeployment {
  constructor() {
    this.composeFile = 'docker-compose.aws-sdk.yml';
    this.envFile = '.env';
    this.profiles = {
      core: ['aws-sdk-backend'],
      deployment: ['deployment-runner', 'aws-cli'],
      monitoring: ['monitoring-setup'],
      testing: ['integration-tests'],
    };
  }

  /**
   * Log with timestamp
   */
  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    console.log(formattedMessage);
    
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }

  /**
   * Execute shell command with proper error handling
   */
  exec(command, options = {}) {
    try {
      this.log('debug', `Executing: ${command}`);
      const result = execSync(command, { 
        stdio: 'inherit', 
        encoding: 'utf8',
        ...options 
      });
      return result;
    } catch (error) {
      this.log('error', `Command failed: ${command}`, { 
        code: error.status,
        signal: error.signal,
        stderr: error.stderr 
      });
      throw error;
    }
  }

  /**
   * Check if Docker is available
   */
  checkDockerAvailable() {
    try {
      this.exec('docker --version', { stdio: 'pipe' });
      this.exec('docker-compose --version', { stdio: 'pipe' });
      this.log('info', '✅ Docker and Docker Compose are available');
      return true;
    } catch (error) {
      this.log('error', '❌ Docker or Docker Compose not available');
      console.log('\nPlease install Docker and Docker Compose:');
      console.log('- Docker: https://docs.docker.com/get-docker/');
      console.log('- Docker Compose: https://docs.docker.com/compose/install/');
      return false;
    }
  }

  /**
   * Validate environment configuration
   */
  validateEnvironment() {
    this.log('info', '🔍 Validating environment configuration...');
    
    // Check if .env file exists
    if (!fs.existsSync(this.envFile)) {
      this.log('warn', `⚠️  Environment file ${this.envFile} not found`);
      
      if (fs.existsSync('.env.docker')) {
        this.log('info', '📋 Copying .env.docker to .env');
        fs.copyFileSync('.env.docker', this.envFile);
      } else {
        this.log('error', '❌ No environment configuration found');
        console.log('\nPlease create a .env file with your configuration:');
        console.log('1. Copy .env.docker to .env');
        console.log('2. Update the AWS credentials and other settings');
        return false;
      }
    }

    // Validate Docker Compose file
    if (!fs.existsSync(this.composeFile)) {
      this.log('error', `❌ Docker Compose file ${this.composeFile} not found`);
      return false;
    }

    // Validate Docker Compose configuration
    try {
      this.exec(`docker-compose -f ${this.composeFile} config`, { stdio: 'pipe' });
      this.log('info', '✅ Docker Compose configuration is valid');
    } catch (error) {
      this.log('error', '❌ Docker Compose configuration validation failed');
      return false;
    }

    return true;
  }

  /**
   * Build Docker images
   */
  buildImages(rebuild = false) {
    this.log('info', '🏗️  Building Docker images...');
    
    const buildCommand = rebuild ? 
      `docker-compose -f ${this.composeFile} build --no-cache` :
      `docker-compose -f ${this.composeFile} build`;
    
    try {
      this.exec(buildCommand);
      this.log('info', '✅ Docker images built successfully');
    } catch (error) {
      this.log('error', '❌ Failed to build Docker images');
      throw error;
    }
  }

  /**
   * Start services
   */
  startServices(profiles = ['core']) {
    this.log('info', '🚀 Starting services...', { profiles });
    
    const services = profiles.flatMap(profile => this.profiles[profile] || []);
    const profileArgs = profiles.map(p => `--profile ${p}`).join(' ');
    
    try {
      if (services.length > 0) {
        this.exec(`docker-compose -f ${this.composeFile} ${profileArgs} up -d ${services.join(' ')}`);
      } else {
        this.exec(`docker-compose -f ${this.composeFile} up -d`);
      }
      
      this.log('info', '✅ Services started successfully');
      
      // Wait for services to be healthy
      this.waitForHealthy(services);
      
    } catch (error) {
      this.log('error', '❌ Failed to start services');
      throw error;
    }
  }

  /**
   * Stop services
   */
  stopServices(profiles = []) {
    this.log('info', '🛑 Stopping services...');
    
    try {
      if (profiles.length > 0) {
        const profileArgs = profiles.map(p => `--profile ${p}`).join(' ');
        this.exec(`docker-compose -f ${this.composeFile} ${profileArgs} down`);
      } else {
        this.exec(`docker-compose -f ${this.composeFile} down`);
      }
      
      this.log('info', '✅ Services stopped successfully');
    } catch (error) {
      this.log('error', '❌ Failed to stop services');
      throw error;
    }
  }

  /**
   * Wait for services to be healthy
   */
  waitForHealthy(services, timeoutSeconds = 120) {
    this.log('info', '⏳ Waiting for services to be healthy...');
    
    const startTime = Date.now();
    const timeout = timeoutSeconds * 1000;
    
    while (Date.now() - startTime < timeout) {
      try {
        const status = this.exec(
          `docker-compose -f ${this.composeFile} ps --format json`,
          { stdio: 'pipe' }
        );
        
        const containers = status.split('\n')
          .filter(line => line.trim())
          .map(line => JSON.parse(line))
          .filter(container => services.some(service => container.Service === service));
        
        const allHealthy = containers.every(container => 
          container.State === 'running' && 
          (container.Health === 'healthy' || !container.Health)
        );
        
        if (allHealthy) {
          this.log('info', '✅ All services are healthy');
          return true;
        }
        
        // Wait before checking again
        await new Promise(resolve => setTimeout(resolve, 5000));
        
      } catch (error) {
        // Continue waiting
      }
    }
    
    this.log('warn', '⚠️  Timeout waiting for services to be healthy');
    return false;
  }

  /**
   * Show service status
   */
  showStatus() {
    this.log('info', '📊 Service Status:');
    
    try {
      this.exec(`docker-compose -f ${this.composeFile} ps`);
    } catch (error) {
      this.log('error', '❌ Failed to get service status');
    }
  }

  /**
   * Show logs
   */
  showLogs(services = [], follow = false) {
    const serviceArgs = services.length > 0 ? services.join(' ') : '';
    const followFlag = follow ? '-f' : '';
    
    try {
      this.exec(`docker-compose -f ${this.composeFile} logs ${followFlag} ${serviceArgs}`);
    } catch (error) {
      this.log('error', '❌ Failed to show logs');
    }
  }

  /**
   * Run deployment
   */
  async deploy() {
    this.log('info', '🚀 Starting Docker deployment...');
    
    try {
      // Run deployment in container
      this.exec(`docker-compose -f ${this.composeFile} --profile deployment run --rm deployment-runner`);
      this.log('info', '✅ Deployment completed successfully');
      
    } catch (error) {
      this.log('error', '❌ Deployment failed');
      throw error;
    }
  }

  /**
   * Run monitoring setup
   */
  async setupMonitoring() {
    this.log('info', '📊 Setting up monitoring...');
    
    try {
      this.exec(`docker-compose -f ${this.composeFile} --profile monitoring run --rm monitoring-setup`);
      this.log('info', '✅ Monitoring setup completed');
      
    } catch (error) {
      this.log('error', '❌ Monitoring setup failed');
      throw error;
    }
  }

  /**
   * Run tests
   */
  async runTests() {
    this.log('info', '🧪 Running integration tests...');
    
    try {
      this.exec(`docker-compose -f ${this.composeFile} --profile testing run --rm integration-tests`);
      this.log('info', '✅ Tests completed successfully');
      
    } catch (error) {
      this.log('error', '❌ Tests failed');
      throw error;
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(volumes = false) {
    this.log('info', '🧹 Cleaning up resources...');
    
    try {
      // Stop all services
      this.exec(`docker-compose -f ${this.composeFile} down`);
      
      // Remove volumes if requested
      if (volumes) {
        this.exec(`docker-compose -f ${this.composeFile} down -v`);
      }
      
      // Remove unused images
      this.exec('docker image prune -f');
      
      this.log('info', '✅ Cleanup completed');
      
    } catch (error) {
      this.log('error', '❌ Cleanup failed');
    }
  }

  /**
   * Main deployment workflow
   */
  async main(command) {
    console.log(`
🐳 Enhanced AWS SDK Docker Deployment
====================================
`);

    // Check prerequisites
    if (!this.checkDockerAvailable()) {
      process.exit(1);
    }

    if (!this.validateEnvironment()) {
      process.exit(1);
    }

    try {
      switch (command) {
        case 'build':
          this.buildImages();
          break;
          
        case 'rebuild':
          this.buildImages(true);
          break;
          
        case 'start':
          this.buildImages();
          this.startServices(['core']);
          this.showStatus();
          break;
          
        case 'stop':
          this.stopServices();
          break;
          
        case 'restart':
          this.stopServices();
          this.buildImages();
          this.startServices(['core']);
          this.showStatus();
          break;
          
        case 'deploy':
          this.buildImages();
          await this.deploy();
          break;
          
        case 'monitoring':
          this.buildImages();
          await this.setupMonitoring();
          break;
          
        case 'test':
          this.buildImages();
          await this.runTests();
          break;
          
        case 'logs':
          this.showLogs([], true);
          break;
          
        case 'status':
          this.showStatus();
          break;
          
        case 'cleanup':
          this.cleanup(true);
          break;
          
        case 'full-deploy':
          this.buildImages();
          this.startServices(['core']);
          await this.deploy();
          await this.setupMonitoring();
          await this.runTests();
          this.showStatus();
          break;
          
        default:
          console.log(`
Usage: node scripts/docker-deploy.cjs <command>

Commands:
  build        - Build Docker images
  rebuild      - Rebuild Docker images (no cache)
  start        - Start core services
  stop         - Stop all services
  restart      - Restart core services
  deploy       - Run AWS deployment
  monitoring   - Setup CloudWatch monitoring
  test         - Run integration tests
  logs         - Show and follow logs
  status       - Show service status
  cleanup      - Stop services and cleanup resources
  full-deploy  - Complete deployment workflow

Examples:
  node scripts/docker-deploy.cjs start
  node scripts/docker-deploy.cjs full-deploy
  node scripts/docker-deploy.cjs logs
          `);
          break;
      }
      
    } catch (error) {
      this.log('error', '❌ Command failed', error);
      process.exit(1);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const deployment = new DockerDeployment();
  const command = process.argv[2];
  
  deployment.main(command).catch(error => {
    console.error('Critical deployment error:', error);
    process.exit(1);
  });
}

module.exports = DockerDeployment;
