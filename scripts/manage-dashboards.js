#!/usr/bin/env node

const path = require('path');

/**
 * Dashboard Management Script for Parker Flight
 * 
 * This script provides Infrastructure as Code (IaC) capabilities for Grafana dashboards:
 * 1. Export existing dashboards to JSON files
 * 2. Import dashboards from JSON files 
 * 3. Validate dashboard configurations
 * 4. Backup and restore dashboard state
 */

import fs from 'fs/promises';
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
const DASHBOARDS_DIR = './monitoring/grafana/dashboards';

class DashboardManager {
  constructor() {
    this.auth = {
      username: GRAFANA_ADMIN_USER,
      password: GRAFANA_ADMIN_PASSWORD
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
        await this.log('success', 'Grafana is healthy and accessible');
        return true;
      }
    } catch (error) {
      await this.log('error', `Grafana health check failed: ${error.message}`);
      return false;
    }
  }

  async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
      await this.log('info', `Created directory: ${dirPath}`);
    }
  }

  async exportAllDashboards() {
    return await this.exportDashboardsToDirectory(DASHBOARDS_DIR);
  }

  async exportDashboardsToDirectory(targetDir) {
    await this.log('info', `📤 Exporting all dashboards to ${targetDir}...`);
    
    try {
      // Get list of all dashboards
      const searchResponse = await axios.get(`${GRAFANA_URL}/api/search?query=&starred=false&tag=`, {
        auth: this.auth
      });

      const dashboards = searchResponse.data.filter(item => item.type === 'dash-db');
      await this.log('info', `Found ${dashboards.length} dashboards to export`);

      await this.ensureDirectoryExists(targetDir);

      const exportedDashboards = [];

      for (const dashboard of dashboards) {
        try {
          // Get full dashboard JSON
          const dashboardResponse = await axios.get(`${GRAFANA_URL}/api/dashboards/uid/${dashboard.uid}`, {
            auth: this.auth
          });

          const dashboardData = dashboardResponse.data
          
          // Clean up dashboard for export (remove runtime fields)
          const cleanDashboard = {
            ...dashboardData.dashboard,
            id: null,
            uid: dashboard.uid,
            version: 1
          };

          // Generate filename based on dashboard title
          const filename = `${dashboard.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${dashboard.uid}.json`;
          const filePath = path.join(targetDir, filename);

          await fs.writeFile(filePath, JSON.stringify(cleanDashboard, null, 2));
          
          exportedDashboards.push({
            title: dashboard.title,
            uid: dashboard.uid,
            filename: filename,
            path: filePath
          });

          await this.log('success', `✅ Exported: ${dashboard.title} → ${filename}`);

        } catch {
          await this.log('error', `Failed to export dashboard ${dashboard.title}: ${error.message}`);
        }
      }

      // Create export manifest
      const manifest = {
        exportDate: new Date().toISOString(),
        grafanaVersion: '10.0.0',
        totalDashboards: exportedDashboards.length,
        dashboards: exportedDashboards
      };

      await fs.writeFile(
        path.join(targetDir, 'export-manifest.json'), 
        JSON.stringify(manifest, null, 2)
      );

      await this.log('success', `🎉 Successfully exported ${exportedDashboards.length} dashboards`);
      return exportedDashboards;

    } catch (error) {
      await this.log('error', `Dashboard export failed: ${error.message}`);
      throw error;
    }
  }

  async importDashboard(filePath) {
    try {
      const dashboardJson = await fs.readFile(filePath, 'utf8');
      const dashboard = JSON.parse(dashboardJson);

      const importPayload = {
        dashboard: dashboard,
        overwrite: true,
        message: `Imported via IaC script at ${new Date().toISOString()}`
      };

      const response = await axios.post(`${GRAFANA_URL}/api/dashboards/db`, importPayload, {
        auth: this.auth,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        await this.log('success', `✅ Imported dashboard: ${dashboard.title}`);
        return {
          success: true,
          dashboard: dashboard.title,
          uid: response.data.uid,
          url: response.data.url
        };
      }

    } catch {
      await this.log('error', `Failed to import dashboard from ${filePath}: ${error.message}`);
      return {
        success: false,
        error: error.message,
        file: filePath
      };
    }
  }

  async importAllDashboards() {
    await this.log('info', '📥 Importing all dashboards from files...');

    try {
      const files = await fs.readdir(DASHBOARDS_DIR);
      const dashboardFiles = files.filter(file => file.endsWith('.json') && file !== 'export-manifest.json');

      await this.log('info', `Found ${dashboardFiles.length} dashboard files to import`);

      const results = [];

      for (const file of dashboardFiles) {
        const filePath = path.join(DASHBOARDS_DIR, file);
        const result = await this.importDashboard(filePath);
        results.push(result);
      }

      const successful = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length

      await this.log('success', `🎉 Import complete: ${successful} successful, ${failed} failed`);
      return results;

    } catch (error) {
      await this.log('error', `Dashboard import failed: ${error.message}`);
      throw error;
    }
  }

  async validateDashboards() {
    await this.log('info', '🔍 Validating dashboard configurations...');

    try {
      const files = await fs.readdir(DASHBOARDS_DIR);
      const dashboardFiles = files.filter(file => file.endsWith('.json') && file !== 'export-manifest.json');

      const validationResults = [];

      for (const file of dashboardFiles) {
        const filePath = path.join(DASHBOARDS_DIR, file);
        
        try {
          const content = await fs.readFile(filePath, 'utf8');
          const dashboard = JSON.parse(content);

          const validation = {
            file: file,
            valid: true,
            issues: []
          };

          // Basic validation checks
          if (!dashboard.title) {
            validation.issues.push('Missing dashboard title');
          }

          if (!dashboard.panels || dashboard.panels.length === 0) {
            validation.issues.push('No panels defined');
          }

          // Check for required fields
          const requiredFields = ['uid', 'title', 'tags', 'timezone'];
          requiredFields.forEach(field => {
            if (!dashboard[field]) {
              validation.issues.push(`Missing required field: ${field}`);
            }
          });

          // Validate panels
          if (dashboard.panels) {
            dashboard.panels.forEach((panel, index) => {
              if (!panel.title) {
                validation.issues.push(`Panel ${index} missing title`);
              }
              if (!panel.type) {
                validation.issues.push(`Panel ${index} missing type`);
              }
            });
          }

          if (validation.issues.length > 0) {
            validation.valid = false;
            await this.log('warn', `⚠️ ${file}: ${validation.issues.length} issues found`);
          } else {
            await this.log('success', `✅ ${file}: Valid`);
          }

          validationResults.push(validation);

        } catch (error) {
          validationResults.push({
            file: file,
            valid: false,
            issues: [`JSON parsing error: ${error.message}`]
          });
          await this.log('error', `❌ ${file}: Invalid JSON`);
        }
      }

      const valid = validationResults.filter(r => r.valid).length
      const invalid = validationResults.filter(r => !r.valid).length

      await this.log('info', `📊 Validation complete: ${valid} valid, ${invalid} invalid dashboards`);
      return validationResults;

    } catch (error) {
      await this.log('error', `Dashboard validation failed: ${error.message}`);
      throw error;
    }
  }

  async backupDashboards() {
    await this.log('info', '💾 Creating dashboard backup...');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = `./backups/dashboards-${timestamp}`;

    await this.ensureDirectoryExists(backupDir);

    // Export all current dashboards to backup directory
    const exported = await this.exportDashboardsToDirectory(backupDir);

    await this.log('success', `💾 Backup created: ${backupDir} (${exported.length} dashboards)`);
    return backupDir;
  }

  async generateDashboardReport() {
    await this.log('info', '📊 Generating dashboard report...');

    try {
      const searchResponse = await axios.get(`${GRAFANA_URL}/api/search?query=&starred=false&tag=`, {
        auth: this.auth
      });

      const dashboards = searchResponse.data.filter(item => item.type === 'dash-db');
      const folders = searchResponse.data.filter(item => item.type === 'dash-folder');

      const report = {
        generatedAt: new Date().toISOString(),
        summary: {
          totalDashboards: dashboards.length,
          totalFolders: folders.length,
          tags: [...new Set(dashboards.flatMap(d => d.tags || []))],
        },
        dashboards: dashboards.map(d => ({
          title: d.title,
          uid: d.uid,
          uri: d.uri,
          url: d.url,
          tags: d.tags || [],
          isStarred: d.isStarred,
          folderTitle: d.folderTitle || 'General'
        })),
        folders: folders.map(f => ({
          title: f.title,
          uid: f.uid,
          uri: f.uri
        }))
      };

      const reportPath = './monitoring/dashboard-report.json';
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

      await this.log('success', `📊 Dashboard report generated: ${reportPath}`);
      
      // Print summary
      console.log('\n📋 DASHBOARD INVENTORY REPORT');
      console.log('=' .repeat(50));
      console.log(`📊 Total Dashboards: ${report.summary.totalDashboards}`);
      console.log(`📁 Total Folders: ${report.summary.totalFolders}`);
      console.log(`🏷️ Tags: ${report.summary.tags.join(', ')}`);
      console.log('\nDashboards:'); 
      report.dashboards.forEach(d => {
        console.log(`  • ${d.title} (${d.folderTitle})`);
      });

      return report;

    } catch (error) {
      await this.log('error', `Report generation failed: ${error.message}`);
      throw error;
    }
  }

  async runCommand(command) {
    const startTime = performance.now();
    
    if (!await this.checkGrafanaHealth()) {
      await this.log('error', 'Grafana is not accessible. Please check your connection.');
      return;
    }

    try {
      switch (command) {
        case 'export':
          await this.exportAllDashboards();
          break;
        case 'import':
          await this.importAllDashboards();
          break;
        case 'validate':
          await this.validateDashboards();
          break;
        case 'backup':
          await this.backupDashboards();
          break;
        case 'report':
          await this.generateDashboardReport();
          break;
        case 'sync':
          await this.log('info', '🔄 Synchronizing dashboards (export → validate → import)...');
          await this.exportAllDashboards();
          await this.validateDashboards();
          await this.importAllDashboards();
          break;
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
    console.log('\n🎯 Parker Flight Dashboard Manager');
    console.log('═'.repeat(50));
    console.log('Usage: node scripts/manage-dashboards.js <command>');
    console.log('\nCommands:');
    console.log('  export    📤 Export all dashboards to JSON files');
    console.log('  import    📥 Import all dashboards from JSON files');
    console.log('  validate  🔍 Validate dashboard configurations');
    console.log('  backup    💾 Create timestamped backup of all dashboards');
    console.log('  report    📊 Generate dashboard inventory report');
    console.log('  sync      🔄 Full sync: export → validate → import');
    console.log('\nExamples:');
    console.log('  node scripts/manage-dashboards.js export');
    console.log('  node scripts/manage-dashboards.js backup');
    console.log('  node scripts/manage-dashboards.js sync');
  }
}

// CLI interface
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const command = process.argv[2];
  
  if (!command) {
    const manager = new DashboardManager();
    manager.showHelp();
    process.exit(1);
  }

  const manager = new DashboardManager();
  manager.runCommand(command).catch(error => {
    console.error('❌ Dashboard management failed:', error);
    process.exit(1);
  });
}

module.exports = { DashboardManager };
