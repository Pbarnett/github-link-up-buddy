#!/usr/bin/env node

/**
 * Script Orchestrator - World-Class Script Automation Framework
 * 
 * This is the central orchestrator that manages automated script execution
 * based on triggers, schedules, and dependencies.
 * 
 * Features:
 * - Registry-based script management
 * - Hook-based triggers (git events)
 * - Schedule-based execution (cron-like)
 * - Context-aware execution
 * - Dependency management
 * - Execution logging and monitoring
 */

import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCRIPTS_ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(__dirname, 'registry.json');
const LOG_DIR = path.join(SCRIPTS_ROOT, '_core', 'logs');

class ScriptOrchestrator {
  constructor() {
    this.registry = null;
    this.isRunning = false;
  }

  async init() {
    // Ensure log directory exists
    await fs.mkdir(LOG_DIR, { recursive: true });
    
    // Load script registry
    await this.loadRegistry();
    
    // Set up signal handlers for graceful shutdown
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
    
    this.log('info', 'Script Orchestrator initialized');
  }

  async loadRegistry() {
    try {
      const registryData = await fs.readFile(REGISTRY_PATH, 'utf8');
      this.registry = JSON.parse(registryData);
      this.log('info', `Loaded ${Object.keys(this.registry.scripts).length} scripts from registry`);
    } catch (error) {
      this.log('error', `Failed to load registry: ${error.message}`);
      // Create empty registry if file doesn't exist
      this.registry = {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        scripts: {}
      };
      await this.saveRegistry();
    }
  }

  async saveRegistry() {
    try {
      this.registry.lastUpdated = new Date().toISOString();
      await fs.writeFile(REGISTRY_PATH, JSON.stringify(this.registry, null, 2));
      this.log('info', 'Registry saved successfully');
    } catch (error) {
      this.log('error', `Failed to save registry: ${error.message}`);
    }
  }

  async registerScript(scriptPath, metadata) {
    const scriptId = path.relative(SCRIPTS_ROOT, scriptPath).replace(/\\/g, '/');
    
    this.registry.scripts[scriptId] = {
      ...metadata,
      path: scriptPath,
      registeredAt: new Date().toISOString(),
      lastExecuted: null,
      executionCount: 0
    };

    await this.saveRegistry();
    this.log('info', `Registered script: ${scriptId}`);
  }

  async executeScript(scriptId, context = {}) {
    const scriptInfo = this.registry.scripts[scriptId];
    if (!scriptInfo) {
      this.log('error', `Script not found in registry: ${scriptId}`);
      return false;
    }

    // Check if script should run in current environment
    if (scriptInfo.environments && scriptInfo.environments.length > 0) {
      const currentEnv = process.env.NODE_ENV || 'development';
      if (!scriptInfo.environments.includes(currentEnv)) {
        this.log('info', `Skipping ${scriptId} - not for environment: ${currentEnv}`);
        return true;
      }
    }

    // Execute dependencies first
    if (scriptInfo.dependencies) {
      for (const dep of scriptInfo.dependencies) {
        const success = await this.executeScript(dep, context);
        if (!success) {
          this.log('error', `Dependency failed for ${scriptId}: ${dep}`);
          return false;
        }
      }
    }

    this.log('info', `Executing script: ${scriptId}`);
    const startTime = Date.now();

    try {
      const success = await this.runScript(scriptInfo.path, scriptInfo.timeout || 300000);
      const duration = Date.now() - startTime;

      // Update execution stats
      scriptInfo.lastExecuted = new Date().toISOString();
      scriptInfo.executionCount++;
      scriptInfo.lastDuration = duration;
      scriptInfo.lastSuccess = success;

      await this.saveRegistry();

      this.log(success ? 'info' : 'error', 
        `Script ${scriptId} ${success ? 'completed' : 'failed'} in ${duration}ms`);

      return success;
    } catch (error) {
      this.log('error', `Script execution error for ${scriptId}: ${error.message}`);
      return false;
    }
  }

  async runScript(scriptPath, timeout = 300000) {
    return new Promise((resolve) => {
      const ext = path.extname(scriptPath);
      let command, args;

      switch (ext) {
        case '.js':
        case '.mjs':
          command = 'node';
          args = [scriptPath];
          break;
        case '.ts':
          command = 'tsx';
          args = [scriptPath];
          break;
        case '.sh':
          command = 'bash';
          args = [scriptPath];
          break;
        case '.py':
          command = 'python3';
          args = [scriptPath];
          break;
        default:
          this.log('error', `Unsupported script type: ${ext}`);
          resolve(false);
          return;
      }

      const child = spawn(command, args, {
        cwd: SCRIPTS_ROOT,
        stdio: ['inherit', 'pipe', 'pipe'],
        env: { ...process.env }
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      const timer = setTimeout(() => {
        child.kill('SIGTERM');
        this.log('error', `Script timeout: ${scriptPath}`);
      }, timeout);

      child.on('close', (code) => {
        clearTimeout(timer);
        
        if (stdout) this.log('info', `STDOUT: ${stdout.trim()}`);
        if (stderr) this.log('error', `STDERR: ${stderr.trim()}`);

        resolve(code === 0);
      });

      child.on('error', (error) => {
        clearTimeout(timer);
        this.log('error', `Spawn error: ${error.message}`);
        resolve(false);
      });
    });
  }

  async executeByTrigger(trigger, context = {}) {
    const scriptsToRun = Object.entries(this.registry.scripts)
      .filter(([_, script]) => script.triggers && script.triggers.includes(trigger))
      .sort(([_, a], [__, b]) => (a.priority || 0) - (b.priority || 0));

    this.log('info', `Executing ${scriptsToRun.length} scripts for trigger: ${trigger}`);

    const results = [];
    for (const [scriptId, _] of scriptsToRun) {
      const success = await this.executeScript(scriptId, context);
      results.push({ scriptId, success });
    }

    const failedCount = results.filter(r => !r.success).length;
    this.log('info', 
      `Trigger ${trigger} completed: ${results.length - failedCount}/${results.length} successful`);

    return failedCount === 0;
  }

  async scanAndRegisterScripts() {
    this.log('info', 'Scanning for unregistered scripts...');
    
    const scriptDirs = [
      'build', 'deployment', 'testing', 'database', 
      'monitoring', 'security', 'maintenance', 'development'
    ];

    let registered = 0;

    for (const dir of scriptDirs) {
      const dirPath = path.join(SCRIPTS_ROOT, dir);
      try {
        const files = await fs.readdir(dirPath, { recursive: true });
        
        for (const file of files) {
          if (this.isExecutableScript(file)) {
            const fullPath = path.join(dirPath, file);
            const scriptId = path.relative(SCRIPTS_ROOT, fullPath).replace(/\\/g, '/');
            
            if (!this.registry.scripts[scriptId]) {
              // Auto-register with basic metadata
              await this.registerScript(fullPath, {
                name: path.basename(file, path.extname(file)),
                category: dir,
                description: `Auto-registered ${dir} script`,
                autoRegistered: true
              });
              registered++;
            }
          }
        }
      } catch (error) {
        this.log('warn', `Could not scan directory ${dir}: ${error.message}`);
      }
    }

    this.log('info', `Auto-registered ${registered} new scripts`);
  }

  isExecutableScript(filename) {
    const exts = ['.js', '.mjs', '.ts', '.sh', '.py'];
    return exts.some(ext => filename.endsWith(ext));
  }

  async log(level, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    console.log(logMessage);

    // Also write to log file
    try {
      const logFile = path.join(LOG_DIR, `orchestrator-${new Date().toISOString().split('T')[0]}.log`);
      await fs.appendFile(logFile, logMessage + '\n');
    } catch (error) {
      // Ignore log file errors to prevent recursive issues
    }
  }

  async shutdown() {
    this.log('info', 'Shutting down Script Orchestrator...');
    this.isRunning = false;
    process.exit(0);
  }

  async getStats() {
    const scripts = Object.values(this.registry.scripts);
    return {
      totalScripts: scripts.length,
      executedScripts: scripts.filter(s => s.executionCount > 0).length,
      totalExecutions: scripts.reduce((sum, s) => sum + (s.executionCount || 0), 0),
      averageExecutionTime: scripts
        .filter(s => s.lastDuration)
        .reduce((sum, s) => sum + s.lastDuration, 0) / scripts.filter(s => s.lastDuration).length || 0
    };
  }
}

// CLI Interface
async function main() {
  const orchestrator = new ScriptOrchestrator();
  await orchestrator.init();

  const [, , command, ...args] = process.argv;

  switch (command) {
    case 'trigger':
      if (args[0]) {
        const success = await orchestrator.executeByTrigger(args[0]);
        process.exit(success ? 0 : 1);
      } else {
        console.error('Usage: orchestrator.js trigger <trigger-name>');
        process.exit(1);
      }
      break;

    case 'execute':
      if (args[0]) {
        const success = await orchestrator.executeScript(args[0]);
        process.exit(success ? 0 : 1);
      } else {
        console.error('Usage: orchestrator.js execute <script-id>');
        process.exit(1);
      }
      break;

    case 'scan':
      await orchestrator.scanAndRegisterScripts();
      break;

    case 'stats':
      const stats = await orchestrator.getStats();
      console.log(JSON.stringify(stats, null, 2));
      break;

    case 'list':
      const scripts = Object.keys(orchestrator.registry.scripts);
      scripts.forEach(script => console.log(script));
      break;

    default:
      console.log('Script Orchestrator - World-Class Script Automation');
      console.log('');
      console.log('Commands:');
      console.log('  trigger <name>    Execute scripts for trigger');
      console.log('  execute <id>      Execute specific script');
      console.log('  scan             Scan and register scripts');
      console.log('  stats            Show execution statistics');
      console.log('  list             List all registered scripts');
      break;
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  main().catch(console.error);
}

export default ScriptOrchestrator;
