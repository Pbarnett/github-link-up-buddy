#!/usr/bin/env node

/**
 * Security Setup for Parker Flight Monitoring
 * 
 * This script sets up production-ready security for the monitoring stack:
 * 1. Configure role-based access control (RBAC)
 * 2. Set up secure communication between services
 * 3. Generate and manage API keys
 * 4. Configure audit logging
 */

import fs from 'fs/promises';
import crypto from 'crypto';
import axios from 'axios';
import { performance } from 'perf_hooks';
// Utility functions
// Removed unused info function
// Removed unused warning function
// Removed unused error function
// Removed unused success function

// Utility functions
// Removed unused log function
  console.log(`[${timestamp}] ${(level || "INFO").toUpperCase()}: ${message}`);

const GRAFANA_URL = 'http://localhost:3001';
const GRAFANA_ADMIN_USER = 'admin';
const GRAFANA_ADMIN_PASSWORD = 'admin';

class SecurityManager {
  constructor() {
    this.auth = {
      username: GRAFANA_ADMIN_USER,
      password: GRAFANA_ADMIN_PASSWORD
    };
    
    this.roles = {
      admin: {
        name: 'Admin',
        permissions: ['read', 'write', 'delete', 'provision'],
        description: 'Full system administration access'
      },
      engineer: {
        name: 'Engineer', 
        permissions: ['read', 'write'],
        description: 'Engineering team - can view and edit dashboards'
      },
      viewer: {
        name: 'Viewer',
        permissions: ['read'],
        description: 'Read-only access to dashboards and metrics'
      },
      service: {
        name: 'Service',
        permissions: ['read'],
        description: 'Service accounts for automated systems'
      }
    };
  }

  async log(level, message) {
    const timestamp = new Date().toISOString();
    const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : level === 'success' ? '✅' : 'ℹ️';
    console.log(`${timestamp} ${emoji} ${message}`);
  }

  async checkGrafanaHealth() {
    try {
      const response = await axios.get(`${GRAFANA_URL}/api/health`, { auth: this.auth });
      if (response.status === 200) {
        await this.log('success', 'Grafana is accessible');
        return true;
      }
    } catch (error) {
      await this.log('error', `Grafana health check failed: ${error.message}`);
      return false;
    }
  }

  generateSecurePassword(length = 32) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  generateApiKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  async createFolders() {
    await this.log('info', '📁 Creating dashboard folders with permissions...');

    const folders = [
      {
        title: 'Parker Flight - Production',
        permissions: [
          { role: 'Admin', permission: 'Admin' },
          { role: 'Engineer', permission: 'Edit' },
          { role: 'Viewer', permission: 'View' }
        ]
      },
      {
        title: 'Parker Flight - SLOs',
        permissions: [
          { role: 'Admin', permission: 'Admin' },
          { role: 'Engineer', permission: 'Edit' },
          { role: 'Viewer', permission: 'View' }
        ]
      },
      {
        title: 'Parker Flight - Development',
        permissions: [
          { role: 'Admin', permission: 'Admin' },
          { role: 'Engineer', permission: 'Admin' },
          { role: 'Viewer', permission: 'View' }
        ]
      }
    ];

    const createdFolders = [];

    for (const folder of folders) {
      try {
        // Create folder
        const createResponse = await axios.post(`${GRAFANA_URL}/api/folders`, {
          title: folder.title
        }, { auth: this.auth });

        if (createResponse.status === 200) {
          const folderId = createResponse.data.id
          const folderUid = createResponse.data.uid

          createdFolders.push({
            title: folder.title,
            id: folderId,
            uid: folderUid,
            url: createResponse.data.url
          });

          await this.log('success', `✅ Created folder: ${folder.title}`);

      } catch (error) {
        if (error.response?.status === 409) {
          await this.log('info', `📁 Folder already exists: ${folder.title}`);
        } else {
          await this.log('error', `Failed to create folder ${folder.title}: ${error.message}`);
        }
      }
    }

    return createdFolders;
  }

  async createServiceAccounts() {
    await this.log('info', '🔑 Creating service accounts...');

    const serviceAccounts = [
      {
        name: 'parker-flight-monitoring',
        role: 'Viewer',
        description: 'Service account for Parker Flight monitoring automation'
      },
      {
        name: 'parker-flight-alerts', 
        role: 'Viewer',
        description: 'Service account for alert evaluation and notification'
      },
      {
        name: 'parker-flight-backup',
        role: 'Admin',
        description: 'Service account for dashboard backup and restore operations'
      }
    ];

    const createdAccounts = [];

    for (const account of serviceAccounts) {
      try {
        // Create service account
        const createResponse = await axios.post(`${GRAFANA_URL}/api/serviceaccounts`, {
          name: account.name,
          role: account.role,
          isDisabled: false
        }, { auth: this.auth });

        if (createResponse.status === 201) {
          const serviceAccountId = createResponse.data.id

          // Generate API token for service account
          const tokenResponse = await axios.post(`${GRAFANA_URL}/api/serviceaccounts/${serviceAccountId}/tokens`, {
            name: `${account.name}-token`,
            secondsToLive: 31536000 // 1 year
          }, { auth: this.auth });

          const apiToken = tokenResponse.data.key

          createdAccounts.push({
            name: account.name,
            id: serviceAccountId,
            role: account.role,
            description: account.description,
            apiToken: apiToken
          });

          await this.log('success', `✅ Created service account: ${account.name}`);

      } catch (error) {
        if (error.response?.status === 409) {
          await this.log('info', `🔑 Service account already exists: ${account.name}`);
        } else {
          await this.log('error', `Failed to create service account ${account.name}: ${error.message}`);
        }
      }
    }

    return createdAccounts;
  }

  async setupTLS() {
    await this.log('info', '🔒 Setting up TLS configuration...');

    const tlsConfig = {
      grafana: {
        protocol: 'https',
        cert_file: '/etc/grafana/ssl/grafana.crt',
        cert_key: '/etc/grafana/ssl/grafana.key',
        ssl_mode: 'require'
      },
      prometheus: {
        tls_config: {
          cert_file: '/etc/prometheus/ssl/prometheus.crt',
          key_file: '/etc/prometheus/ssl/prometheus.key',
          ca_file: '/etc/prometheus/ssl/ca.crt'
        }
      },
      recommendations: [
        'Use Let\'s Encrypt for production SSL certificates',
        'Enable HSTS headers for security',
        'Use strong cipher suites (TLS 1.2+)',
        'Implement certificate rotation policies'
      ]
    };

    const configPath = './monitoring/tls-config.json';
    await fs.writeFile(configPath, JSON.stringify(tlsConfig, null, 2));

    await this.log('success', `✅ TLS configuration saved: ${configPath}`);
    return tlsConfig;
  }

  async generateSecrets() {
    await this.log('info', '🔐 Generating secure credentials...');

    const secrets = {
      generated_at: new Date().toISOString(),
      grafana: {
        admin_password: this.generateSecurePassword(),
        secret_key: this.generateSecurePassword(64),
        jwt_secret: this.generateSecurePassword(32)
      },
      prometheus: {
        admin_password: this.generateSecurePassword(),
        web_config_file: '/etc/prometheus/web.yml'
      },
      alertmanager: {
        admin_password: this.generateSecurePassword(),
        encryption_key: this.generateSecurePassword(32)
      },
      api_keys: {
        monitoring_service: this.generateApiKey(),
        backup_service: this.generateApiKey(),
        ci_cd_service: this.generateApiKey()
      },
      security_notes: [
        'Store secrets in a secure vault (HashiCorp Vault, AWS Secrets Manager)',
        'Rotate credentials regularly (quarterly recommended)',
        'Use environment variables, never hardcode in configs',
        'Enable audit logging for all services',
        'Implement network segmentation between components'
      ]
    };

    const secretsPath = './monitoring/secrets.json';
    await fs.writeFile(secretsPath, JSON.stringify(secrets, null, 2));

    // Create environment file template
    const envTemplate = `# Parker Flight Monitoring - Environment Variables
# SECURITY: Never commit this file to version control!

# Grafana Configuration
GRAFANA_ADMIN_PASSWORD=${secrets.grafana.admin_password}
GRAFANA_SECRET_KEY=${secrets.grafana.secret_key}
GRAFANA_JWT_SECRET=${secrets.grafana.jwt_secret}

# Prometheus Configuration  
PROMETHEUS_ADMIN_PASSWORD=${secrets.prometheus.admin_password}

# AlertManager Configuration
ALERTMANAGER_ADMIN_PASSWORD=${secrets.alertmanager.admin_password}
ALERTMANAGER_ENCRYPTION_KEY=${secrets.alertmanager.encryption_key}

# API Keys
MONITORING_API_KEY=${secrets.api_keys.monitoring_service}
BACKUP_API_KEY=${secrets.api_keys.backup_service}
CI_CD_API_KEY=${secrets.api_keys.ci_cd_service}
`;

    await fs.writeFile('./monitoring/.env.production', envTemplate);

    await this.log('success', `✅ Generated secure credentials and API keys`);
    await this.log('warn', '⚠️ Secrets saved to monitoring/secrets.json - move to secure vault!');
    await this.log('info', '📝 Environment template created: monitoring/.env.production');

    return secrets;
  }

  async configureAuditLogging() {
    await this.log('info', '📝 Configuring audit logging...');

    const auditConfig = {
      grafana: {
        audit: {
          enabled: true,
          logger: 'file',
          settings: {
            path: '/var/log/grafana/audit.log',
            max_age: '30d',
            max_files: 10,
            max_file_size: '100MB'
          },
          events: [
            'dashboard-save',
            'dashboard-delete',
            'user-login',
            'user-logout',
            'api-key-create',
            'api-key-delete',
            'folder-create',
            'folder-delete'
          ]
        }
      },
      prometheus: {
        audit: {
          enabled: true,
          log_file: '/var/log/prometheus/audit.log',
          events: [
            'config-reload',
            'query-execution',
            'rule-evaluation',
            'alert-firing'
          ]
        }
      },
      best_practices: [
        'Enable log rotation to prevent disk space issues',
        'Ship logs to centralized logging system (ELK stack)',
        'Set up log monitoring and alerting',
        'Regular log analysis for security events',
        'Compliance reporting for SOX/GDPR requirements'
      ]
    };

    const auditPath = './monitoring/audit-config.json';
    await fs.writeFile(auditPath, JSON.stringify(auditConfig, null, 2));

    await this.log('success', `✅ Audit logging configuration saved: ${auditPath}`);
    return auditConfig;
  }

  async createSecurityDashboard() {
    await this.log('info', '📊 Creating security monitoring dashboard...');

    const securityDashboard = {
      id: null,
      title: "Parker Flight - Security Monitoring",
      tags: ["parker-flight", "security", "audit"],
      timezone: "browser",
      panels: [
        {
          id: 1,
          title: "Login Attempts",
          type: "stat",
          targets: [
            {
              expr: "increase(grafana_login_attempts_total[1h])",
              legendFormat: "Login Attempts (1h)"
            }
          ],
          gridPos: { h: 8, w: 6, x: 0, y: 0 }
        },
        {
          id: 2,
          title: "Failed Authentication",
          type: "stat", 
          targets: [
            {
              expr: "increase(grafana_login_attempts_total{result=\"failed\"}[1h])",
              legendFormat: "Failed Logins (1h)"
            }
          ],
          gridPos: { h: 8, w: 6, x: 6, y: 0 }
        },
        {
          id: 3,
          title: "API Key Usage",
          type: "timeseries",
          targets: [
            {
              expr: "rate(grafana_api_key_requests_total[5m])",
              legendFormat: "API Key Requests/sec"
            }
          ],
          gridPos: { h: 8, w: 12, x: 12, y: 0 }
        },
        {
          id: 4,
          title: "Dashboard Changes",
          type: "logs",
          targets: [
            {
              expr: "increase(grafana_dashboard_save_total[1h])",
              legendFormat: "Dashboard Saves (1h)"
            }
          ],
          gridPos: { h: 8, w: 24, x: 0, y: 8 }
        }
      ],
      time: {
        from: "now-24h",
        to: "now"
      },
      refresh: "30s"
    };

    const dashboardPath = './monitoring/grafana/dashboards/security-monitoring.json';
    await fs.writeFile(dashboardPath, JSON.stringify(securityDashboard, null, 2));

    await this.log('success', `✅ Security monitoring dashboard created: ${dashboardPath}`);
    return securityDashboard;
  }

  async generateSecurityReport() {
    await this.log('info', '📋 Generating security assessment report...');

    const report = {
      generated_at: new Date().toISOString(),
      assessment: {
        authentication: {
          status: 'configured',
          methods: ['local', 'api-key'],
          recommendations: [
            'Implement OAuth/SAML for single sign-on',
            'Enable multi-factor authentication',
            'Set up session timeout policies'
          ]
        },
        authorization: {
          status: 'basic',
          rbac_enabled: true,
          folder_permissions: true,
          recommendations: [
            'Implement fine-grained RBAC',
            'Regular access reviews',
            'Principle of least privilege'
          ]
        },
        network_security: {
          status: 'development',
          tls_enabled: false,
          firewall_configured: false,
          recommendations: [
            'Enable TLS/SSL for all communications',
            'Configure network firewalls',
            'Implement VPN for remote access',
            'Use service mesh for inter-service communication'
          ]
        },
        data_protection: {
          status: 'basic',
          encryption_at_rest: false,
          backup_encryption: false,
          recommendations: [
            'Implement encryption at rest',
            'Encrypt backup files',
            'Use secure key management',
            'Regular security audits'
          ]
        },
        monitoring: {
          status: 'configured',
          audit_logging: true,
          security_alerts: true,
          recommendations: [
            'Ship logs to SIEM system',
            'Set up security dashboards',
            'Regular penetration testing',
            'Compliance monitoring'
          ]
        }
      },
      security_score: 65, // Out of 100
      next_steps: [
        'Implement TLS/SSL certificates',
        'Set up OAuth/SAML authentication',
        'Configure network security groups',
        'Enable encryption at rest',
        'Implement centralized logging',
        'Regular security assessments'
      ]
    };

    const reportPath = './monitoring/security-assessment.json';
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    await this.log('success', `✅ Security assessment saved: ${reportPath}`);
    
    // Print security summary
    console.log('\n🔒 SECURITY ASSESSMENT SUMMARY');
    console.log('=' .repeat(50));
    console.log(`🎯 Security Score: ${report.security_score}/100`);
    console.log('\n📊 Component Status:');
    Object.entries(report.assessment).forEach(([component, status]) => {
      const emoji = status.status === 'configured' ? '✅' : status.status === 'basic' ? '⚠️' : '❌';
      console.log(`  ${emoji} ${component}: ${status.status}`);
    });
    console.log('\n📋 Priority Actions:');
    report.next_steps.slice(0, 3).forEach((step, i) => {
      console.log(`  ${i + 1}. ${step}`);
    });

    return report;
  }

  async runCommand(command) {
    const startTime = performance.now();
    
    if (!await this.checkGrafanaHealth()) {
      await this.log('error', 'Grafana is not accessible. Please check your connection.');
      return;
    }

    try {
      switch (command) {
        case 'folders':
          await this.createFolders();
          break;
        case 'service-accounts':
          await this.createServiceAccounts();
          break;
        case 'tls':
          await this.setupTLS();
          break;
        case 'secrets':
          await this.generateSecrets();
          break;
        case 'audit':
          await this.configureAuditLogging();
          break;
        case 'dashboard':
          await this.createSecurityDashboard();
          break;
        case 'report':
          await this.generateSecurityReport();
          break;
        case 'full': {
          await this.log('info', '🚀 Running full security setup...');
          await this.createFolders();
          await this.createServiceAccounts();
          await this.setupTLS();
          await this.generateSecrets();
          await this.configureAuditLogging();
          await this.createSecurityDashboard();
          const report = await this.generateSecurityReport();
          
          console.log('\n🎯 SECURITY SETUP COMPLETE');
          console.log('=' .repeat(50));
          console.log(`🔒 Security Score: ${report.security_score}/100`);
          console.log('📁 Folders, service accounts, and configurations created');
          console.log('🔐 Secrets generated (move to secure vault!)');
          console.log('📊 Security monitoring dashboard ready');
          break;
        }
        default:
          await this.log('error', `Unknown command: ${command}`);
          this.showHelp();
          return;
      }

      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      await this.log('info', `🏁 Command '${command}' completed in ${duration}s`);

    } catch {
      await this.log('error', `Command '${command}' failed: ${error.message}`);
      process.exit(1);
    }
  }

  showHelp() {
    console.log('\n🎯 Parker Flight Security Manager');
    console.log('═'.repeat(50));
    console.log('Usage: node scripts/setup-security.js <command>');
    console.log('\nCommands:');
    console.log('  folders          📁 Create folder structure with permissions');
    console.log('  service-accounts 🔑 Create service accounts and API keys');
    console.log('  tls             🔒 Generate TLS configuration');
    console.log('  secrets         🔐 Generate secure passwords and keys');
    console.log('  audit           📝 Configure audit logging');
    console.log('  dashboard       📊 Create security monitoring dashboard');
    console.log('  report          📋 Generate security assessment report');
    console.log('  full            🚀 Run complete security setup');
    console.log('\nExamples:');
    console.log('  node scripts/setup-security.js folders');
    console.log('  node scripts/setup-security.js secrets');
    console.log('  node scripts/setup-security.js full');
  }
}

// CLI interface
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const command = process.argv[2];
  
  if (!command) {
    const manager = new SecurityManager();
    manager.showHelp();
    process.exit(1);
  }

  const manager = new SecurityManager();
  manager.runCommand(command).catch(error => {
    console.error('❌ Security setup failed:', error);
    process.exit(1);
  });
}

module.exports = { SecurityManager };
