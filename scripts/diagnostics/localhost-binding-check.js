#!/usr/bin/env node

/**
 * Localhost Binding Diagnostic Script
 * Detects and warns about IPv6/IPv4 localhost binding issues
 */

import { execSync } from 'child_process';
import { promisify } from 'util';
import net from 'net';
import dns from 'dns';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dnsLookup = promisify(dns.lookup);

class LocalhostDiagnostics {
  constructor() {
    this.results = {
      platform: os.platform(),
      nodeVersion: process.version,
      ipv4Available: false,
      ipv6Available: false,
      localhostResolution: null,
      warnings: [],
      recommendations: []
    };
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',    // cyan
      warn: '\x1b[33m',    // yellow
      error: '\x1b[31m',   // red
      success: '\x1b[32m', // green
      reset: '\x1b[0m'
    };
    
    const prefix = type === 'warn' ? '⚠️' : type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${colors[type]}${prefix} ${message}${colors.reset}`);
  }

  async checkIPv4Loopback() {
    try {
      const result = execSync('ping -c 1 -W 1000 127.0.0.1', { encoding: 'utf8', stdio: 'pipe' });
      this.results.ipv4Available = result.includes('1 packets received');
      if (this.results.ipv4Available) {
        this.log('IPv4 loopback (127.0.0.1) is working');
      }
    } catch (error) {
      this.results.ipv4Available = false;
      this.log('IPv4 loopback (127.0.0.1) is not working', 'error');
      this.results.warnings.push('IPv4 loopback connectivity is broken');
    }
  }

  async checkIPv6Loopback() {
    try {
      const result = execSync('ping -c 1 -W 1000 ::1', { encoding: 'utf8', stdio: 'pipe' });
      this.results.ipv6Available = result.includes('1 packets received');
      if (this.results.ipv6Available) {
        this.log('IPv6 loopback (::1) is working');
      }
    } catch (error) {
      this.results.ipv6Available = false;
      this.log('IPv6 loopback (::1) is not working', 'warn');
      this.results.warnings.push('IPv6 loopback connectivity is broken');
    }
  }

  async checkLocalhostResolution() {
    try {
      const addresses = await dnsLookup('localhost', { all: true });
      this.results.localhostResolution = addresses;
      
      this.log(`Localhost resolves to: ${addresses.map(a => `${a.address} (${a.family})`).join(', ')}`);
      
      // Check for IPv6 preference
      const ipv6First = addresses[0]?.family === 6;
      if (ipv6First && !this.results.ipv6Available) {
        this.log('⚠️ Localhost resolves to IPv6 first, but IPv6 loopback is broken!', 'warn');
        this.results.warnings.push('Localhost prefers IPv6 but IPv6 connectivity is broken');
        this.results.recommendations.push('Configure servers to bind to 127.0.0.1 (IPv4) explicitly');
      }
    } catch (error) {
      this.log(`Failed to resolve localhost: ${error.message}`, 'error');
      this.results.warnings.push('Localhost DNS resolution failed');
    }
  }

  async checkRunningServers() {
    try {
      const lsofOutput = execSync('lsof -i -P -n | grep LISTEN | grep -E "(3000|5001|8080)"', { 
        encoding: 'utf8', 
        stdio: 'pipe' 
      });
      
      if (lsofOutput.trim()) {
        this.log('Development servers currently running:');
        const lines = lsofOutput.trim().split('\n');
        
        lines.forEach(line => {
          const match = line.match(/(\w+)\s+\d+.*?IPv([46])\s+.*?TCP\s+([^:]+):(\d+)/);
          if (match) {
            const [, process, ipVersion, host, port] = match;
            const bindingType = ipVersion === '6' ? 'IPv6' : 'IPv4';
            const hostDisplay = host === '*' ? 'all interfaces' : host;
            
            this.log(`  ${process} on port ${port}: ${bindingType} (${hostDisplay})`);
            
            // Check for potentially problematic bindings
            if (ipVersion === '6' && host === '*' && !this.results.ipv6Available) {
              this.log(`    ⚠️ This server is bound to IPv6 but IPv6 loopback is broken!`, 'warn');
              this.results.warnings.push(`Server on port ${port} bound to IPv6 but IPv6 connectivity broken`);
            }
          }
        });
      } else {
        this.log('No development servers currently running on common ports');
      }
    } catch (error) {
      // No servers running, which is fine
      this.log('No development servers detected');
    }
  }

  async testConnectivity(host, port) {
    return new Promise((resolve) => {
      const client = net.createConnection({ host, port, timeout: 1000 }, () => {
        client.destroy();
        resolve(true);
      });
      
      client.on('error', () => resolve(false));
      client.on('timeout', () => {
        client.destroy();
        resolve(false);
      });
    });
  }

  async checkPlatformSpecificIssues() {
    if (this.results.platform === 'darwin') {
      this.log('Running on macOS - checking for known IPv6 issues...');
      
      // Check macOS version
      try {
        const version = execSync('sw_vers -productVersion', { encoding: 'utf8' }).trim();
        this.log(`macOS version: ${version}`);
        
        // Known issues with certain macOS versions
        const majorVersion = parseInt(version.split('.')[0]);
        if (majorVersion >= 14) {
          this.log('macOS 14+ detected - may have IPv6 localhost resolution issues', 'warn');
          this.results.recommendations.push('Consider using explicit IPv4 binding (127.0.0.1)');
        }
      } catch (error) {
        this.log('Could not detect macOS version', 'warn');
      }
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 LOCALHOST BINDING DIAGNOSTIC REPORT');
    console.log('='.repeat(60));
    
    console.log(`Platform: ${this.results.platform}`);
    console.log(`Node.js: ${this.results.nodeVersion}`);
    console.log(`IPv4 Loopback: ${this.results.ipv4Available ? '✅ Working' : '❌ Broken'}`);
    console.log(`IPv6 Loopback: ${this.results.ipv6Available ? '✅ Working' : '❌ Broken'}`);
    
    if (this.results.localhostResolution) {
      console.log(`Localhost Resolution: ${this.results.localhostResolution.map(a => `${a.address} (IPv${a.family})`).join(', ')}`);
    }
    
    if (this.results.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.results.warnings.forEach(warning => console.log(`  • ${warning}`));
    }
    
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      this.results.recommendations.forEach(rec => console.log(`  • ${rec}`));
    }
    
    console.log('\n' + '='.repeat(60));
    
    // Return overall health status
    const hasIssues = this.results.warnings.length > 0;
    return !hasIssues;
  }

  async runDiagnostics() {
    this.log('🔍 Starting localhost binding diagnostics...\n');
    
    await this.checkIPv4Loopback();
    await this.checkIPv6Loopback();
    await this.checkLocalhostResolution();
    await this.checkRunningServers();
    await this.checkPlatformSpecificIssues();
    
    const isHealthy = this.generateReport();
    
    if (!isHealthy) {
      this.log('\n🔧 To fix these issues, run: npm run fix-localhost-binding', 'warn');
      process.exit(1);
    } else {
      this.log('\n✅ Localhost binding looks healthy!', 'success');
    }
  }
}

// Run diagnostics if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const diagnostics = new LocalhostDiagnostics();
  diagnostics.runDiagnostics().catch(error => {
    console.error('❌ Diagnostic failed:', error.message);
    process.exit(1);
  });
}

export default LocalhostDiagnostics;
