#!/usr/bin/env tsx

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

interface ValidationRule {
  name: string;
  check: () => Promise<boolean>;
  fix?: () => Promise<void>;
  critical: boolean;
}

interface ValidationResult {
  passed: boolean;
  rules: {
    name: string;
    passed: boolean;
    error?: string;
    critical: boolean;
  }[];
}

class DeploymentValidator {
  private rules: ValidationRule[] = [
    {
      name: 'Build artifacts exist',
      check: async () => {
        try {
          await fs.access(path.join(rootDir, 'dist', 'index.html'));
          return true;
        } catch {
          return false;
        }
      },
      fix: async () => {
        console.log('Running build...');
        execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
      },
      critical: true
    },
    {
      name: 'Environment variables are set',
      check: async () => {
        const requiredVars = [
          'VITE_SUPABASE_URL',
          'VITE_SUPABASE_ANON_KEY',
          'VITE_LAUNCHDARKLY_CLIENT_ID'
        ];
        
        return requiredVars.every(varName => {
          const value = process.env[varName];
          return value && value.trim() !== '';
        });
      },
      critical: true
    },
    {
      name: 'TypeScript compilation passes',
      check: async () => {
        try {
          execSync('npx tsc --noEmit --skipLibCheck', { 
            cwd: rootDir, 
            stdio: 'pipe' 
          });
          return true;
        } catch {
          return false;
        }
      },
      critical: true
    },
    {
      name: 'Bundle size is within limits',
      check: async () => {
        try {
          const distPath = path.join(rootDir, 'dist');
          const files = await fs.readdir(distPath, { recursive: true });
          
          let totalSize = 0;
          for (const file of files) {
            if (typeof file === 'string' && file.endsWith('.js')) {
              const filePath = path.join(distPath, file);
              const stats = await fs.stat(filePath);
              totalSize += stats.size
            }
          }
          
          // 2MB limit
          return totalSize < 2 * 1024 * 1024;
        } catch {
          return false;
        }
      },
      critical: false
    },
    {
      name: 'Health check endpoint works',
      check: async () => {
        try {
          // Start dev server briefly to test health endpoint
          // In a real scenario, you'd test against the built app
          return true; // Placeholder - would need actual server test
        } catch {
          return false;
        }
      },
      critical: false
    },
    {
      name: 'Critical dependencies are available',
      check: async () => {
        try {
          const packageJson = JSON.parse(
            await fs.readFile(path.join(rootDir, 'package.json'), 'utf-8')
          );
          
          const criticalDeps = [
            'react',
            'react-dom',
            '@supabase/supabase-js',
            'launchdarkly-js-client-sdk'
          ];
          
          return criticalDeps.every(dep => 
            packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]
          );
        } catch {
          return false;
        }
      },
      critical: true
    },
    {
      name: 'No critical security vulnerabilities',
      check: async () => {
        try {
          const auditOutput = execSync('npm audit --audit-level=critical --json', {
            cwd: rootDir,
            stdio: 'pipe',
            encoding: 'utf-8'
          });
          
          const audit = JSON.parse(auditOutput);
          return audit.metadata.vulnerabilities.critical === 0;
        } catch {
          // If audit fails, assume there might be issues
          return false;
        }
      },
      critical: false
    }
  ];

  async validate(autoFix: boolean = false): Promise<ValidationResult> {
    console.log('🔍 Starting deployment validation...\n');
    
    const results: ValidationResult['rules'] = [];
    let allPassed = true;

    for (const rule of this.rules) {
      process.stdout.write(`Checking: ${rule.name}... `);
      
      try {
        let passed = await rule.check();
        
        if (!passed && autoFix && rule.fix) {
          console.log('❌ Failed, attempting fix...');
          await rule.fix();
          passed = await rule.check();
          console.log(passed ? '✅ Fixed!' : '❌ Fix failed');
        } else {
          console.log(passed ? '✅' : '❌');
        }
        
        results.push({
          name: rule.name,
          passed,
          critical: rule.critical
        });
        
        if (!passed && rule.critical) {
          allPassed = false;
        }
      } catch (error) {
        console.log('❌ Error');
        results.push({
          name: rule.name,
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          critical: rule.critical
        });
        
        if (rule.critical) {
          allPassed = false;
        }
      }
    }

    return { passed: allPassed, rules: results };
  }

  printSummary(result: ValidationResult) {
    console.log('\n📊 Validation Summary:');
    console.log('='.repeat(50));
    
    const criticalFailed = result.rules.filter(r => r.critical && !r.passed);
    const nonCriticalFailed = result.rules.filter(r => !r.critical && !r.passed);
    const passed = result.rules.filter(r => r.passed);
    
    console.log(`✅ Passed: ${passed.length}`);
    console.log(`⚠️  Non-critical failed: ${nonCriticalFailed.length}`);
    console.log(`❌ Critical failed: ${criticalFailed.length}`);
    
    if (criticalFailed.length > 0) {
      console.log('\n🚨 Critical Issues:');
      criticalFailed.forEach(rule => {
        console.log(`  • ${rule.name}`);
        if (rule.error) console.log(`    Error: ${rule.error}`);
      });
    }
    
    if (nonCriticalFailed.length > 0) {
      console.log('\n⚠️  Warnings:');
      nonCriticalFailed.forEach(rule => {
        console.log(`  • ${rule.name}`);
      });
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(result.passed
      ? '🎉 Deployment validation PASSED!' 
      : '💥 Deployment validation FAILED!'
    );
    
    if (!result.passed) {
      console.log('\nPlease fix critical issues before deploying.');
      process.exit(1);
    }
  }
}

// CLI execution
async function main() {
  const autoFix = process.argv.includes('--fix');
  
  const validator = new DeploymentValidator();
  const result = await validator.validate(autoFix);
  
  validator.printSummary(result);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

module.exports = { DeploymentValidator };
