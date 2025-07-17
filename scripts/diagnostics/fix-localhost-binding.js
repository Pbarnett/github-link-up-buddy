#!/usr/bin/env node

/**
 * Automated Fix Script for Localhost Binding Issues
 * Applies IPv4 binding fixes to Vite and Express configurations
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class LocalhostBindingFixer {
  constructor() {
    this.projectRoot = process.cwd();
    this.changes = [];
    this.backups = [];
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      warn: '\x1b[33m',
      error: '\x1b[31m',
      success: '\x1b[32m',
      reset: '\x1b[0m'
    };
    
    const prefix = type === 'warn' ? '⚠️' : type === 'error' ? '❌' : type === 'success' ? '✅' : '🔧';
    console.log(`${colors[type]}${prefix} ${message}${colors.reset}`);
  }

  createBackup(filePath) {
    const backupPath = `${filePath}.backup.${Date.now()}`;
    try {
      fs.copyFileSync(filePath, backupPath);
      this.backups.push({ original: filePath, backup: backupPath });
      this.log(`Created backup: ${path.basename(backupPath)}`);
      return backupPath;
    } catch (error) {
      this.log(`Failed to create backup for ${filePath}: ${error.message}`, 'error');
      throw error;
    }
  }

  async fixViteConfig() {
    const viteConfigPath = path.join(this.projectRoot, 'vite.config.ts');
    
    if (!fs.existsSync(viteConfigPath)) {
      this.log('No vite.config.ts found, skipping Vite configuration', 'warn');
      return;
    }

    this.createBackup(viteConfigPath);
    
    let content = fs.readFileSync(viteConfigPath, 'utf8');
    
    // Check if server config already exists
    if (content.includes('server:') && content.includes("host: '127.0.0.1'")) {
      this.log('Vite config already has IPv4 binding - no changes needed');
      return;
    }

    // Pattern to match the defineConfig opening
    const defineConfigPattern = /export default defineConfig\(\s*\{/;
    
    if (!defineConfigPattern.test(content)) {
      this.log('Could not find defineConfig pattern in vite.config.ts', 'error');
      return;
    }

    // Check if server config exists but without correct host
    if (content.includes('server:')) {
      // Update existing server config
      const serverConfigPattern = /server:\s*\{([^}]+)\}/;
      const match = content.match(serverConfigPattern);
      
      if (match) {
        const serverConfig = match[1];
        if (!serverConfig.includes('host:')) {
          // Add host to existing server config
          const newServerConfig = serverConfig.trim() + (serverConfig.trim().endsWith(',') ? '' : ',') + `\n    host: '127.0.0.1'`;
          content = content.replace(serverConfigPattern, `server: {${newServerConfig}}`);
        } else {
          // Update existing host
          content = content.replace(/host:\s*['"][^'"]*['"]/, "host: '127.0.0.1'");
        }
      }
    } else {
      // Add new server config
      content = content.replace(
        defineConfigPattern,
        `export default defineConfig({\n  server: {\n    host: '127.0.0.1',\n    port: 3000\n  },`
      );
    }

    fs.writeFileSync(viteConfigPath, content);
    this.changes.push('Updated vite.config.ts with IPv4 binding');
    this.log('Fixed Vite configuration to bind to 127.0.0.1');
  }

  async fixExpressConfig() {
    const expressConfigPath = path.join(this.projectRoot, 'server', 'api.ts');
    
    if (!fs.existsSync(expressConfigPath)) {
      this.log('No server/api.ts found, skipping Express configuration', 'warn');
      return;
    }

    this.createBackup(expressConfigPath);
    
    let content = fs.readFileSync(expressConfigPath, 'utf8');
    
    // Check if already has IPv4 binding
    if (content.includes("listen(port, '127.0.0.1'")) {
      this.log('Express config already has IPv4 binding - no changes needed');
      return;
    }

    // Pattern to match app.listen calls
    const listenPattern = /app\.listen\(port,\s*\(\) =>/;
    
    if (listenPattern.test(content)) {
      // Replace the listen call to include host
      content = content.replace(
        listenPattern,
        "app.listen(port, '127.0.0.1', () =>"
      );
      
      // Update the console.log message too
      content = content.replace(
        /console\.log\(`Server running on port \$\{port\}`\)/,
        "console.log(`Server running on 127.0.0.1:${port}`)"
      );
      
      fs.writeFileSync(expressConfigPath, content);
      this.changes.push('Updated server/api.ts with IPv4 binding');
      this.log('Fixed Express configuration to bind to 127.0.0.1');
    } else {
      this.log('Could not find app.listen pattern in server/api.ts', 'warn');
    }
  }

  async updatePackageScripts() {
    const packagePath = path.join(this.projectRoot, 'package.json');
    
    if (!fs.existsSync(packagePath)) {
      this.log('No package.json found', 'error');
      return;
    }

    this.createBackup(packagePath);
    
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Add diagnostic and fix scripts
    if (!packageContent.scripts) {
      packageContent.scripts = {};
    }

    const newScripts = {
      'check-localhost': 'node scripts/diagnostics/localhost-binding-check.js',
      'fix-localhost-binding': 'node scripts/diagnostics/fix-localhost-binding.js',
      'dev:safe': 'npm run check-localhost && npm run dev'
    };

    let scriptsAdded = false;
    Object.entries(newScripts).forEach(([key, value]) => {
      if (!packageContent.scripts[key]) {
        packageContent.scripts[key] = value;
        scriptsAdded = true;
      }
    });

    if (scriptsAdded) {
      fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
      this.changes.push('Added diagnostic scripts to package.json');
      this.log('Added new npm scripts for localhost diagnostics');
    } else {
      this.log('Package.json scripts already up to date');
    }
  }

  async setNodeDNSOrder() {
    const nodeOptionsPath = path.join(this.projectRoot, '.env.development');
    
    let envContent = '';
    if (fs.existsSync(nodeOptionsPath)) {
      envContent = fs.readFileSync(nodeOptionsPath, 'utf8');
    }

    // Check if NODE_OPTIONS already set
    if (envContent.includes('NODE_OPTIONS')) {
      if (envContent.includes('--dns-result-order=ipv4first')) {
        this.log('.env.development already has IPv4-first DNS order');
        return;
      }
    }

    if (!envContent.includes('NODE_OPTIONS')) {
      envContent += '\n# Force IPv4-first DNS resolution to avoid IPv6 localhost issues\nNODE_OPTIONS="--dns-result-order=ipv4first"\n';
    } else {
      // Update existing NODE_OPTIONS
      envContent = envContent.replace(
        /NODE_OPTIONS="([^"]*)"/,
        'NODE_OPTIONS="$1 --dns-result-order=ipv4first"'
      );
    }

    fs.writeFileSync(nodeOptionsPath, envContent);
    this.changes.push('Updated .env.development with IPv4-first DNS order');
    this.log('Set NODE_OPTIONS to prefer IPv4 DNS resolution');
  }

  async createStartupWrapper() {
    const wrapperPath = path.join(this.projectRoot, 'scripts', 'dev-wrapper.js');
    
    const wrapperContent = `#!/usr/bin/env node

/**
 * Development Server Wrapper
 * Automatically checks localhost binding before starting servers
 */

const { spawn } = require('child_process');
const LocalhostDiagnostics = require('./diagnostics/localhost-binding-check');

async function startDevelopment() {
  console.log('🚀 Starting development environment with localhost binding checks...');
  
  // Run diagnostics first
  const diagnostics = new LocalhostDiagnostics();
  
  try {
    await diagnostics.runDiagnostics();
    console.log('✅ Localhost binding checks passed!');
  } catch (error) {
    console.error('❌ Localhost binding issues detected. Please run: npm run fix-localhost-binding');
    process.exit(1);
  }
  
  // Start the development server
  const devProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--dns-result-order=ipv4first'
    }
  });
  
  devProcess.on('close', (code) => {
    console.log(\`Development server exited with code \${code}\`);
    process.exit(code);
  });
}

startDevelopment().catch(error => {
  console.error('Failed to start development environment:', error);
  process.exit(1);
});
`;

    fs.writeFileSync(wrapperPath, wrapperContent);
    fs.chmodSync(wrapperPath, '755');
    this.changes.push('Created development server wrapper script');
    this.log('Created safe development server wrapper');
  }

  async applyFixes() {
    this.log('🔧 Starting automated localhost binding fixes...\n');
    
    try {
      await this.fixViteConfig();
      await this.fixExpressConfig();
      await this.updatePackageScripts();
      await this.setNodeDNSOrder();
      await this.createStartupWrapper();
      
      this.log('\n✅ All fixes applied successfully!', 'success');
      
      if (this.changes.length > 0) {
        this.log('\n📋 Changes made:');
        this.changes.forEach(change => this.log(`  • ${change}`));
      }
      
      if (this.backups.length > 0) {
        this.log('\n💾 Backups created:');
        this.backups.forEach(backup => this.log(`  • ${path.basename(backup.backup)}`));
      }
      
      this.log('\n🎉 Next steps:', 'success');
      this.log('  1. Run: npm run check-localhost');
      this.log('  2. Start dev server with: npm run dev:safe');
      this.log('  3. Or use regular: npm run dev');
      
    } catch (error) {
      this.log(`\n❌ Fix failed: ${error.message}`, 'error');
      this.log('Restoring backups...');
      this.restoreBackups();
      process.exit(1);
    }
  }

  restoreBackups() {
    this.backups.forEach(backup => {
      try {
        fs.copyFileSync(backup.backup, backup.original);
        fs.unlinkSync(backup.backup);
        this.log(`Restored ${backup.original}`);
      } catch (error) {
        this.log(`Failed to restore ${backup.original}: ${error.message}`, 'error');
      }
    });
  }
}

// Run fixes if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const fixer = new LocalhostBindingFixer();
  fixer.applyFixes().catch(error => {
    console.error('❌ Fix script failed:', error.message);
    process.exit(1);
  });
}

export default LocalhostBindingFixer;
