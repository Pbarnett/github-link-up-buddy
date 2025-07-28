#!/usr/bin/env node

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
    console.log(`Development server exited with code ${code}`);
    process.exit(code);
  });
}

startDevelopment().catch(error => {
  console.error('Failed to start development environment:', error);
  process.exit(1);
});
