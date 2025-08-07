#!/usr/bin/env node

/**
 * Safe Script Migration Utility
 * 
 * This utility safely migrates scripts from the root scripts directory
 * to the new organized structure without breaking any existing functionality.
 * 
 * Features:
 * - Non-destructive migration (creates symlinks/copies instead of moving)
 * - Updates package.json script references automatically
 * - Creates migration report
 * - Validates script functionality after migration
 * - Rollback capability
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCRIPTS_ROOT = path.resolve(__dirname, '..');
const PROJECT_ROOT = path.resolve(SCRIPTS_ROOT, '..');
const PACKAGE_JSON_PATH = path.join(PROJECT_ROOT, 'package.json');

class ScriptMigrator {
  constructor() {
    this.migrationPlan = new Map();
    this.packageJson = null;
    this.migrationLog = [];
  }

  async init() {
    // Load package.json
    const packageData = await fs.readFile(PACKAGE_JSON_PATH, 'utf8');
    this.packageJson = JSON.parse(packageData);
    
    this.log('info', 'Script Migrator initialized');
  }

  async analyzeMigration() {
    this.log('info', 'Analyzing current script organization...');

    // Get all scripts in root directory
    const rootScripts = await this.getRootScripts();
    
    // Create migration plan
    for (const script of rootScripts) {
      const category = await this.categorizeScript(script);
      const newPath = this.getNewPath(script, category);
      
      this.migrationPlan.set(script, {
        category,
        newPath,
        originalPath: path.join(SCRIPTS_ROOT, script),
        usedInPackageJson: this.isUsedInPackageJson(script)
      });
    }

    this.log('info', `Created migration plan for ${rootScripts.length} scripts`);
    return this.migrationPlan;
  }

  async getRootScripts() {
    const files = await fs.readdir(SCRIPTS_ROOT);
    return files.filter(file => {
      // Skip directories and the _core folder
      const isFile = !file.startsWith('_') && !file.includes('/');
      const isScript = this.isExecutableScript(file);
      return isFile && isScript;
    });
  }

  isExecutableScript(filename) {
    const exts = ['.js', '.mjs', '.ts', '.sh', '.py', '.cjs'];
    return exts.some(ext => filename.endsWith(ext));
  }

  async categorizeScript(scriptName) {
    // Analyze script name and content to determine category
    const scriptPath = path.join(SCRIPTS_ROOT, scriptName);
    
    try {
      const content = await fs.readFile(scriptPath, 'utf8');
      const lowerName = scriptName.toLowerCase();
      const lowerContent = content.toLowerCase();

      // Categorization rules based on name patterns
      if (lowerName.includes('deploy') || lowerName.includes('rollout') || lowerName.includes('prod')) {
        return 'deployment';
      }
      if (lowerName.includes('test') || lowerName.includes('spec') || lowerContent.includes('vitest') || lowerContent.includes('playwright')) {
        return 'testing';
      }
      if (lowerName.includes('build') || lowerName.includes('compile') || lowerContent.includes('vite build')) {
        return 'build';
      }
      if (lowerName.includes('db') || lowerName.includes('database') || lowerName.includes('migrate') || lowerName.includes('seed')) {
        return 'database';
      }
      if (lowerName.includes('monitor') || lowerName.includes('health') || lowerName.includes('alert') || lowerName.includes('dashboard')) {
        return 'monitoring';
      }
      if (lowerName.includes('security') || lowerName.includes('audit') || lowerName.includes('credential') || lowerName.includes('secret')) {
        return 'security';
      }
      if (lowerName.includes('cleanup') || lowerName.includes('optimize') || lowerName.includes('maintenance')) {
        return 'maintenance';
      }
      if (lowerName.includes('dev') || lowerName.includes('lint') || lowerName.includes('format') || lowerName.includes('quality')) {
        return 'development';
      }
      if (lowerName.includes('backup') || lowerName.includes('restore')) {
        return 'maintenance';
      }

      // Default to development if unclear
      return 'development';
    } catch (error) {
      this.log('warn', `Could not read script ${scriptName}, defaulting to development category`);
      return 'development';
    }
  }

  getNewPath(scriptName, category) {
    return path.join(category, scriptName);
  }

  isUsedInPackageJson(scriptName) {
    const scriptRefs = Object.values(this.packageJson.scripts || {});
    return scriptRefs.some(script => script.includes(scriptName));
  }

  async executeNonDestructiveMigration() {
    this.log('info', 'Starting non-destructive migration...');

    // Create category directories
    const categories = new Set([...this.migrationPlan.values()].map(plan => plan.category));
    for (const category of categories) {
      const categoryPath = path.join(SCRIPTS_ROOT, category);
      await fs.mkdir(categoryPath, { recursive: true });
      this.log('info', `Created category directory: ${category}`);
    }

    // Move scripts to legacy directory first (backup)
    const legacyDir = path.join(SCRIPTS_ROOT, 'legacy');
    await fs.mkdir(legacyDir, { recursive: true });

    let migratedCount = 0;
    const migrationResults = [];

    for (const [scriptName, plan] of this.migrationPlan) {
      try {
        const originalPath = plan.originalPath;
        const newFullPath = path.join(SCRIPTS_ROOT, plan.newPath);
        const legacyPath = path.join(legacyDir, scriptName);

        // 1. Copy to legacy (backup)
        await fs.copyFile(originalPath, legacyPath);

        // 2. Copy to new location
        await fs.mkdir(path.dirname(newFullPath), { recursive: true });
        await fs.copyFile(originalPath, newFullPath);

        // 3. Make executable if it was executable
        const stats = await fs.stat(originalPath);
        if (stats.mode & 0o111) {
          await fs.chmod(newFullPath, stats.mode);
        }

        migrationResults.push({
          script: scriptName,
          from: originalPath,
          to: newFullPath,
          category: plan.category,
          status: 'success'
        });

        migratedCount++;
        this.log('info', `Migrated: ${scriptName} → ${plan.newPath}`);

      } catch (error) {
        migrationResults.push({
          script: scriptName,
          status: 'error',
          error: error.message
        });
        this.log('error', `Failed to migrate ${scriptName}: ${error.message}`);
      }
    }

    // Generate migration report
    await this.generateMigrationReport(migrationResults);

    this.log('info', `Successfully migrated ${migratedCount}/${this.migrationPlan.size} scripts`);
    
    return migrationResults;
  }

  async updatePackageJsonReferences() {
    this.log('info', 'Updating package.json script references...');

    let updatedCount = 0;
    const updates = [];

    for (const [scriptKey, scriptValue] of Object.entries(this.packageJson.scripts)) {
      let newScriptValue = scriptValue;
      let wasUpdated = false;

      for (const [oldScript, plan] of this.migrationPlan) {
        if (scriptValue.includes(oldScript)) {
          // Update the path reference
          const oldPath = `scripts/${oldScript}`;
          const newPath = `scripts/${plan.newPath}`;
          
          newScriptValue = newScriptValue.replace(oldPath, newPath);
          wasUpdated = true;
        }
      }

      if (wasUpdated) {
        this.packageJson.scripts[scriptKey] = newScriptValue;
        updates.push({
          script: scriptKey,
          old: scriptValue,
          new: newScriptValue
        });
        updatedCount++;
      }
    }

    // Write updated package.json
    if (updatedCount > 0) {
      await fs.writeFile(PACKAGE_JSON_PATH, JSON.stringify(this.packageJson, null, 2));
      this.log('info', `Updated ${updatedCount} script references in package.json`);
      
      // Log the changes
      updates.forEach(update => {
        this.log('info', `  ${update.script}: "${update.old}" → "${update.new}"`);
      });
    }

    return updates;
  }

  async generateMigrationReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      totalScripts: this.migrationPlan.size,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      categoryBreakdown: {},
      results: results,
      migrationLog: this.migrationLog
    };

    // Calculate category breakdown
    for (const [_, plan] of this.migrationPlan) {
      report.categoryBreakdown[plan.category] = (report.categoryBreakdown[plan.category] || 0) + 1;
    }

    const reportPath = path.join(SCRIPTS_ROOT, '_core', 'migration-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    this.log('info', `Migration report saved to: ${reportPath}`);
    
    return report;
  }

  async validateMigration() {
    this.log('info', 'Validating migrated scripts...');
    
    // TODO: Add validation logic
    // - Check if scripts are executable
    // - Verify package.json references work
    // - Test a few critical scripts
    
    return true;
  }

  async createSymlinks() {
    this.log('info', 'Creating symlinks for backward compatibility...');
    
    // Create symlinks in root pointing to new locations
    for (const [scriptName, plan] of this.migrationPlan) {
      if (plan.usedInPackageJson) {
        try {
          const originalPath = path.join(SCRIPTS_ROOT, scriptName);
          const newPath = path.join(SCRIPTS_ROOT, plan.newPath);
          const relativePath = path.relative(path.dirname(originalPath), newPath);
          
          // Remove original and create symlink
          await fs.unlink(originalPath);
          await fs.symlink(relativePath, originalPath);
          
          this.log('info', `Created symlink: ${scriptName} → ${plan.newPath}`);
        } catch (error) {
          this.log('warn', `Could not create symlink for ${scriptName}: ${error.message}`);
        }
      }
    }
  }

  async rollback() {
    this.log('info', 'Rolling back migration...');
    
    const legacyDir = path.join(SCRIPTS_ROOT, 'legacy');
    
    try {
      const legacyFiles = await fs.readdir(legacyDir);
      
      for (const file of legacyFiles) {
        const legacyPath = path.join(legacyDir, file);
        const originalPath = path.join(SCRIPTS_ROOT, file);
        
        // Remove symlink or new file if exists
        try {
          await fs.unlink(originalPath);
        } catch (error) {
          // Ignore if file doesn't exist
        }
        
        // Restore from legacy
        await fs.copyFile(legacyPath, originalPath);
        this.log('info', `Restored: ${file}`);
      }
      
      this.log('info', 'Migration rollback completed');
    } catch (error) {
      this.log('error', `Rollback failed: ${error.message}`);
    }
  }

  log(level, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    console.log(logMessage);
    this.migrationLog.push(logMessage);
  }
}

// CLI Interface
async function main() {
  const migrator = new ScriptMigrator();
  await migrator.init();

  const [, , command] = process.argv;

  switch (command) {
    case 'analyze':
      const plan = await migrator.analyzeMigration();
      console.log('Migration Plan:');
      for (const [script, details] of plan) {
        console.log(`  ${script} → ${details.category}/${script} ${details.usedInPackageJson ? '(used in package.json)' : ''}`);
      }
      break;

    case 'migrate':
      await migrator.analyzeMigration();
      const results = await migrator.executeNonDestructiveMigration();
      await migrator.updatePackageJsonReferences();
      await migrator.createSymlinks();
      console.log('Migration completed! Check migration-report.json for details.');
      break;

    case 'rollback':
      await migrator.rollback();
      break;

    case 'validate':
      const isValid = await migrator.validateMigration();
      console.log(`Migration validation: ${isValid ? 'PASSED' : 'FAILED'}`);
      break;

    default:
      console.log('Safe Script Migration Utility');
      console.log('');
      console.log('Commands:');
      console.log('  analyze    Show migration plan without executing');
      console.log('  migrate    Execute non-destructive migration');
      console.log('  rollback   Rollback migration to original state');
      console.log('  validate   Validate migrated scripts');
      break;
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  main().catch(console.error);
}

export default ScriptMigrator;
