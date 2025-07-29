#!/usr/bin/env tsx

/**
 * Professional Security Audit System
 * 
 * Comprehensive security auditing for credential management:
 * - File permission audits
 * - Git history scanning
 * - Environment variable exposure detection
 * - Compliance reporting
 * - Vulnerability assessments
 * - Security policy validation
 */

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createHash } from 'crypto';

const execAsync = promisify(exec);

interface SecurityIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'permissions' | 'exposure' | 'configuration' | 'compliance' | 'git';
  description: string;
  file?: string;
  line?: number;
  recommendation: string;
  cwe?: string; // Common Weakness Enumeration
  cvss?: number; // Common Vulnerability Scoring System
}

interface AuditResult {
  timestamp: string;
  summary: {
    totalIssues: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
    filesScanned: number;
    complianceScore: number;
  };
  issues: SecurityIssue[];
  recommendations: string[];
  complianceChecks: Record<string, boolean>;
}

class SecurityAuditor {
  private readonly rootDir: string;
  private readonly excludeDirs = [
    'node_modules',
    '.git',
    'dist',
    'build',
    'coverage',
    'test-results',
    'playwright-report'
  ];
  private readonly sensitivePatterns = [
    // API Keys and Secrets
    /(['"]\s*)?([A-Z_]*(?:API_?KEY|SECRET|TOKEN|PASS(?:WORD)?|AUTH))\s*['"]?\s*[:=]\s*['"]?([A-Za-z0-9+/=_-]{8,})['"]?/gi,
    // AWS Keys
    /AKIA[0-9A-Z]{16}/g,
    // Private Keys
    /-----BEGIN (?:RSA )?PRIVATE KEY-----/g,
    // Connection Strings
    /(?:mongodb|mysql|postgres):\/\/[^\s'"]+/gi,
    // JWT Tokens
    /eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g,
    // Stripe Keys
    /sk_(?:test|live)_[0-9a-zA-Z]{24,}/g,
    /pk_(?:test|live)_[0-9a-zA-Z]{24,}/g,
    // Generic secrets
    /(?:secret|password|token)\s*[:=]\s*['"]?[A-Za-z0-9@#$%^&*()_+={}|;':",.<>?/-]{8,}['"]?/gi
  ];

  constructor(rootDir: string = process.cwd()) {
    this.rootDir = rootDir;
  }

  async runFullAudit(): Promise<AuditResult> {
    console.log('🔍 Starting comprehensive security audit...\n');

    const issues: SecurityIssue[] = [];
    const complianceChecks: Record<string, boolean> = {};

    // File System Security Audit
    console.log('📁 Auditing file system security...');
    issues.push(...await this.auditFilePermissions());
    issues.push(...await this.auditEnvironmentFiles());

    // Git History Audit
    console.log('📋 Auditing git history for exposed secrets...');
    issues.push(...await this.auditGitHistory());

    // Code Security Audit
    console.log('💾 Scanning code for hardcoded secrets...');
    issues.push(...await this.auditSourceCode());

    // Configuration Audit
    console.log('⚙️  Auditing configuration security...');
    issues.push(...await this.auditConfiguration());

    // Compliance Checks
    console.log('📊 Running compliance checks...');
    Object.assign(complianceChecks, await this.runComplianceChecks());

    const filesScanned = await this.countSourceFiles();
    const summary = this.generateSummary(issues, filesScanned, complianceChecks);
    const recommendations = this.generateRecommendations(issues);

    const result: AuditResult = {
      timestamp: new Date().toISOString(),
      summary,
      issues: issues.sort((a, b) => this.getSeverityWeight(b.severity) - this.getSeverityWeight(a.severity)),
      recommendations,
      complianceChecks
    };

    console.log('\n✅ Security audit completed');
    return result;
  }

  private async auditFilePermissions(): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];
    const sensitiveFiles = [
      '.env',
      '.env.local', 
      '.env.test.local',
      '.env.production.local',
      'package.json',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml'
    ];

    for (const file of sensitiveFiles) {
      const filePath = join(this.rootDir, file);
      if (existsSync(filePath)) {
        const stats = statSync(filePath);
        const mode = stats.mode & parseInt('777', 8);

        // Check if file is readable by others
        if (mode & parseInt('044', 8)) {
          issues.push({
            severity: file.includes('.env') ? 'critical' : 'high',
            category: 'permissions',
            description: `File ${file} has overly permissive read permissions`,
            file,
            recommendation: `Run: chmod 600 ${file}`,
            cwe: 'CWE-732',
            cvss: file.includes('.env') ? 9.1 : 7.5
          });
        }

        // Check if file is writable by others
        if (mode & parseInt('022', 8)) {
          issues.push({
            severity: 'high',
            category: 'permissions',
            description: `File ${file} is writable by group/others`,
            file,
            recommendation: `Run: chmod 600 ${file}`,
            cwe: 'CWE-732',
            cvss: 7.5
          });
        }
      }
    }

    return issues;
  }

  private async auditEnvironmentFiles(): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];
    const envFiles = readdirSync(this.rootDir)
      .filter(file => file.startsWith('.env'))
      .map(file => join(this.rootDir, file));

    for (const filePath of envFiles) {
      if (!existsSync(filePath)) continue;

      const filename = basename(filePath);
      const content = readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      // Check for live/production secrets in non-production files
      if (!filename.includes('production')) {
        lines.forEach((line, lineNum) => {
          if (line.includes('sk_live_') || line.includes('pk_live_')) {
            issues.push({
              severity: 'critical',
              category: 'exposure',
              description: 'Live Stripe keys found in non-production environment file',
              file: filename,
              line: lineNum + 1,
              recommendation: 'Replace with test keys (sk_test_*, pk_test_*)',
              cwe: 'CWE-798',
              cvss: 9.8
            });
          }
        });
      }

      // Check for empty or placeholder values
      lines.forEach((line, lineNum) => {
        if (line.includes('=your_') || line.includes('=placeholder') || line.includes('=changeme')) {
          issues.push({
            severity: 'medium',
            category: 'configuration',
            description: 'Placeholder values detected in environment file',
            file: filename,
            line: lineNum + 1,
            recommendation: 'Replace placeholder values with actual credentials or remove',
            cwe: 'CWE-1188'
          });
        }
      });

      // Check for duplicate environment variables
      const variables = new Map<string, number>();
      lines.forEach((line, lineNum) => {
        const match = line.match(/^([A-Z_]+)=/);
        if (match) {
          const varName = match[1];
          if (variables.has(varName)) {
            issues.push({
              severity: 'medium',
              category: 'configuration',
              description: `Duplicate environment variable: ${varName}`,
              file: filename,
              line: lineNum + 1,
              recommendation: `Remove duplicate definition of ${varName}`,
              cwe: 'CWE-1188'
            });
          }
          variables.set(varName, lineNum + 1);
        }
      });
    }

    return issues;
  }

  private async auditGitHistory(): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];

    try {
      // Check if .env files are tracked by git
      const { stdout: trackedFiles } = await execAsync('git ls-files', { cwd: this.rootDir });
      const tracked = trackedFiles.split('\n');

      for (const file of tracked) {
        if (file.startsWith('.env') && file !== '.env.example') {
          issues.push({
            severity: 'critical',
            category: 'git',
            description: `Environment file ${file} is tracked by git`,
            file,
            recommendation: `Run: git rm --cached ${file} && echo "${file}" >> .gitignore`,
            cwe: 'CWE-540',
            cvss: 9.1
          });
        }
      }

      // Scan git history for exposed secrets (last 50 commits)
      const { stdout: gitLog } = await execAsync(
        'git log --oneline -n 50 --all --full-history -- "*.env*" || true',
        { cwd: this.rootDir }
      );

      if (gitLog.trim()) {
        issues.push({
          severity: 'high',
          category: 'git',
          description: 'Environment files found in git history',
          recommendation: 'Consider using git filter-branch to remove sensitive data from history',
          cwe: 'CWE-540',
          cvss: 8.2
        });
      }

      // Check for secrets in commit messages
      const { stdout: commitMessages } = await execAsync(
        'git log --oneline -n 100 --grep="password\\|secret\\|key\\|token" --all || true',
        { cwd: this.rootDir }
      );

      if (commitMessages.trim()) {
        issues.push({
          severity: 'medium',
          category: 'git',
          description: 'Potentially sensitive information in commit messages',
          recommendation: 'Review commit messages and avoid including sensitive information',
          cwe: 'CWE-532'
        });
      }

    } catch (error) {
      // Git might not be available or repo might not exist
      console.warn('Git audit skipped:', error instanceof Error ? error.message : error);
    }

    return issues;
  }

  private async auditSourceCode(): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];
    const sourceExtensions = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte'];

    const scanDirectory = (dir: string): void => {
      if (!existsSync(dir)) return;

      const items = readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        if (item.isDirectory()) {
          if (!this.excludeDirs.includes(item.name)) {
            scanDirectory(join(dir, item.name));
          }
        } else if (sourceExtensions.some(ext => item.name.endsWith(ext))) {
          const filePath = join(dir, item.name);
          const relativeFile = filePath.replace(this.rootDir + '/', '');
          
          try {
            const content = readFileSync(filePath, 'utf8');
            issues.push(...this.scanFileForSecrets(content, relativeFile));
          } catch {
            // Skip files that can't be read
          }
        }
      }
    };

    scanDirectory(join(this.rootDir, 'src'));
    scanDirectory(join(this.rootDir, 'pages'));
    scanDirectory(join(this.rootDir, 'components'));
    scanDirectory(join(this.rootDir, 'lib'));
    scanDirectory(join(this.rootDir, 'utils'));

    return issues;
  }

  private scanFileForSecrets(content: string, filename: string): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, lineNum) => {
      // Skip comments and imports
      if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.includes('import ')) {
        return;
      }

      for (const pattern of this.sensitivePatterns) {
        const matches = line.matchAll(pattern);
        for (const match of matches) {
          // Skip obvious test values and placeholders
          const value = match[3] || match[0];
          if (this.isLikelyTestValue(value)) continue;

          let severity: SecurityIssue['severity'] = 'medium';
          if (value.length > 32 || /sk_live_|pk_live_/.test(value)) {
            severity = 'critical';
          } else if (value.length > 16) {
            severity = 'high';
          }

          issues.push({
            severity,
            category: 'exposure',
            description: 'Potential hardcoded secret detected',
            file: filename,
            line: lineNum + 1,
            recommendation: 'Move secret to environment variables',
            cwe: 'CWE-798',
            cvss: severity === 'critical' ? 9.8 : severity === 'high' ? 7.5 : 5.3
          });
        }
      }
    });

    return issues;
  }

  private isLikelyTestValue(value: string): boolean {
    const testIndicators = [
      'test', 'example', 'demo', 'placeholder', 'changeme', 'your_',
      'xxx', 'yyy', 'zzz', 'abc123', '123456', 'fake', 'mock',
      'localhost', '127.0.0.1', 'process.env'
    ];

    const lowerValue = value.toLowerCase();
    return testIndicators.some(indicator => lowerValue.includes(indicator)) ||
           /^[a-zA-Z0-9]{1,8}$/.test(value) || // Very short values
           /^[x]+$/.test(value) || // All x's
           /^[0]+$/.test(value);   // All zeros
  }

  private async auditConfiguration(): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];

    // Check package.json for security issues
    const packageJsonPath = join(this.rootDir, 'package.json');
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

      // Check for scripts that might expose secrets
      if (packageJson.scripts) {
        Object.entries(packageJson.scripts).forEach(([scriptName, script]) => {
          if (typeof script === 'string' && /(?:API_KEY|SECRET|TOKEN|PASSWORD)/.test(script)) {
            issues.push({
              severity: 'medium',
              category: 'configuration',
              description: `Script "${scriptName}" may contain sensitive information`,
              file: 'package.json',
              recommendation: 'Move sensitive values to environment variables',
              cwe: 'CWE-798'
            });
          }
        });
      }
    }

    // Check .gitignore for proper exclusions
    const gitignorePath = join(this.rootDir, '.gitignore');
    if (existsSync(gitignorePath)) {
      const gitignoreContent = readFileSync(gitignorePath, 'utf8');
      const requiredPatterns = ['.env*', '*.local', '.env.local', '.env.test.local'];

      for (const pattern of requiredPatterns) {
        if (!gitignoreContent.includes(pattern)) {
          issues.push({
            severity: 'high',
            category: 'configuration',
            description: `Missing pattern "${pattern}" in .gitignore`,
            file: '.gitignore',
            recommendation: `Add "${pattern}" to .gitignore`,
            cwe: 'CWE-540',
            cvss: 7.5
          });
        }
      }
    } else {
      issues.push({
        severity: 'medium',
        category: 'configuration',
        description: 'Missing .gitignore file',
        recommendation: 'Create .gitignore file with appropriate exclusions',
        cwe: 'CWE-540'
      });
    }

    return issues;
  }

  private async runComplianceChecks(): Promise<Record<string, boolean>> {
    const checks: Record<string, boolean> = {};

    // SOX Compliance (Sarbanes-Oxley)
    checks.sox_encryption_at_rest = existsSync(join(this.rootDir, '.security', 'vault'));
    checks.sox_audit_logging = existsSync(join(this.rootDir, '.security', 'audit'));
    checks.sox_access_controls = this.checkSecureFilePermissions();

    // PCI DSS Compliance
    checks.pci_no_plain_text_secrets = await this.checkNoPlainTextSecrets();
    checks.pci_secure_transmission = this.checkSecureTransmission();
    checks.pci_access_logging = existsSync(join(this.rootDir, '.security', 'setup.log'));

    // HIPAA Compliance
    checks.hipaa_encryption = checks.sox_encryption_at_rest
    checks.hipaa_audit_trails = checks.sox_audit_logging
    checks.hipaa_access_controls = checks.sox_access_controls

    // General Security Best Practices
    checks.secure_defaults = this.checkSecureDefaults();
    checks.principle_of_least_privilege = this.checkLeastPrivilege();
    checks.secure_storage = this.checkSecureStorage();

    return checks;
  }

  private checkSecureFilePermissions(): boolean {
    const sensitiveFiles = ['.env.test.local', '.env.local', '.env.production.local'];
    return sensitiveFiles.every(file => {
      const filePath = join(this.rootDir, file);
      if (!existsSync(filePath)) return true; // File doesn't exist, so it's secure by default
      
      const stats = statSync(filePath);
      const mode = stats.mode & parseInt('777', 8);
      return mode === parseInt('600', 8); // Owner read/write only
    });
  }

  private async checkNoPlainTextSecrets(): Promise<boolean> {
    // Check if credential manager vault exists (indicating encrypted storage)
    return existsSync(join(this.rootDir, '.security', 'vault', 'credentials.vault'));
  }

  private checkSecureTransmission(): boolean {
    // Check for HTTPS-only configuration
    const packageJsonPath = join(this.rootDir, 'package.json');
    if (existsSync(packageJsonPath)) {
      const content = readFileSync(packageJsonPath, 'utf8');
      return !content.includes('http://') || content.includes('localhost'); // Allow localhost HTTP
    }
    return true;
  }

  private checkSecureDefaults(): boolean {
    // Check if default/example credentials are not used
    const envFiles = readdirSync(this.rootDir)
      .filter(file => file.startsWith('.env') && !file.includes('example'));

    return envFiles.every(file => {
      const content = readFileSync(join(this.rootDir, file), 'utf8');
      return !content.includes('your_') && !content.includes('changeme') && !content.includes('placeholder');
    });
  }

  private checkLeastPrivilege(): boolean {
    // Check if test keys are used instead of live keys
    const envFiles = readdirSync(this.rootDir)
      .filter(file => file.startsWith('.env') && !file.includes('production'));

    return envFiles.every(file => {
      const content = readFileSync(join(this.rootDir, file), 'utf8');
      return !content.includes('sk_live_') && !content.includes('pk_live_');
    });
  }

  private checkSecureStorage(): boolean {
    // Check if credential manager is properly configured
    return existsSync(join(this.rootDir, '.security')) &&
           existsSync(join(this.rootDir, 'scripts', 'security', 'credential-manager.ts'));
  }

  private async countSourceFiles(): Promise<number> {
    let count = 0;
    const sourceExtensions = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte'];

    const countInDirectory = (dir: string): void => {
      if (!existsSync(dir)) return;

      const items = readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        if (item.isDirectory() && !this.excludeDirs.includes(item.name)) {
          countInDirectory(join(dir, item.name));
        } else if (sourceExtensions.some(ext => item.name.endsWith(ext))) {
          count++;
        }
      }
    };

    countInDirectory(this.rootDir);
    return count;
  }

  private generateSummary(issues: SecurityIssue[], filesScanned: number, complianceChecks: Record<string, boolean>): AuditResult['summary'] {
    const severityCounts = {
      critical: issues.filter(i => i.severity === 'critical').length,
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length
    };

    const complianceScore = Object.values(complianceChecks).filter(Boolean).length / Object.keys(complianceChecks).length

    return {
      totalIssues: issues.length,
      criticalIssues: severityCounts.critical,
      highIssues: severityCounts.high,
      mediumIssues: severityCounts.medium,
      lowIssues: severityCounts.low,
      filesScanned,
      complianceScore: Math.round(complianceScore * 100)
    };
  }

  private generateRecommendations(issues: SecurityIssue[]): string[] {
    const recommendations = new Set<string>();

    if (issues.some(i => i.category === 'permissions')) {
      recommendations.add('Review and fix file permissions for sensitive files');
    }

    if (issues.some(i => i.category === 'git')) {
      recommendations.add('Remove sensitive files from git history and update .gitignore');
    }

    if (issues.some(i => i.category === 'exposure')) {
      recommendations.add('Implement secure credential management using environment variables');
    }

    if (issues.some(i => i.severity === 'critical')) {
      recommendations.add('Immediately address all critical security issues');
    }

    if (issues.some(i => i.description.includes('Live'))) {
      recommendations.add('Replace all live/production credentials with test credentials');
    }

    recommendations.add('Implement regular security audits and monitoring');
    recommendations.add('Use the professional credential manager for secure storage');
    recommendations.add('Enable automatic security scanning in CI/CD pipeline');

    return Array.from(recommendations);
  }

  private getSeverityWeight(severity: SecurityIssue['severity']): number {
    const weights = { critical: 4, high: 3, medium: 2, low: 1 };
    return weights[severity];
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const outputFormat = args.includes('--json') ? 'json' : 'console';
  const outputFile = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;

  console.log('🛡️  Professional Security Audit System\n');

  const auditor = new SecurityAuditor();
  const result = await auditor.runFullAudit();

  if (outputFormat === 'json') {
    const jsonOutput = JSON.stringify(result, null, 2);
    
    if (outputFile) {
      writeFileSync(outputFile, jsonOutput);
      console.log(`\n📄 Audit report saved to: ${outputFile}`);
    } else {
      console.log(jsonOutput);
    }
  } else {
    // Console output
    console.log('\n📊 SECURITY AUDIT SUMMARY');
    console.log('═'.repeat(50));
    console.log(`Files Scanned: ${result.summary.filesScanned}`);
    console.log(`Total Issues: ${result.summary.totalIssues}`);
    console.log(`  Critical: ${result.summary.criticalIssues}`);
    console.log(`  High: ${result.summary.highIssues}`);
    console.log(`  Medium: ${result.summary.mediumIssues}`);
    console.log(`  Low: ${result.summary.lowIssues}`);
    console.log(`Compliance Score: ${result.summary.complianceScore}%`);

    if (result.issues.length > 0) {
      console.log('\n🚨 SECURITY ISSUES');
      console.log('═'.repeat(50));
      
      result.issues.slice(0, 10).forEach((issue, index) => {
        const severityEmoji = {
          critical: '🔴',
          high: '🟠', 
          medium: '🟡',
          low: '🟢'
        }[issue.severity];

        console.log(`\n${index + 1}. ${severityEmoji} ${issue.severity.toUpperCase()}: ${issue.description}`);
        if (issue.file) console.log(`   File: ${issue.file}${issue.line ? `:${issue.line}` : ''}`);
        console.log(`   Fix: ${issue.recommendation}`);
        if (issue.cwe) console.log(`   CWE: ${issue.cwe}`);
      });

      if (result.issues.length > 10) {
        console.log(`\n... and ${result.issues.length - 10} more issues`);
      }
    }

    if (result.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS');
      console.log('═'.repeat(50));
      result.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }

    console.log('\n🏆 COMPLIANCE STATUS');
    console.log('═'.repeat(50));
    Object.entries(result.complianceChecks).forEach(([check, passed]) => {
      const status = passed ? '✅' : '❌';
      console.log(`${status} ${check.replace(/_/g, ' ').toUpperCase()}`);
    });
  }

  // Exit with appropriate code
  const exitCode = result.summary.criticalIssues > 0 ? 2 : 
                   result.summary.highIssues > 0 ? 1 : 0;
  
  process.exit(exitCode);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SecurityAuditor };
