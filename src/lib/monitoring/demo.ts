#!/usr/bin/env node

import { MonitoringOrchestrator } from './monitoring-orchestrator.js';

/**
 * Demo script for Parker Flight Enterprise Monitoring System
 * This demonstrates the complete monitoring infrastructure
 */
async function runMonitoringDemo() {
  console.log('🎬 Starting Parker Flight Enterprise Monitoring Demo...\n');

  const orchestrator = new MonitoringOrchestrator();

  try {
    // Initialize the complete monitoring infrastructure
    await orchestrator.initializeMonitoring();

    // Wait for systems to stabilize
    console.log('\n⏳ Allowing systems to stabilize (30 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Run comprehensive tests
    console.log('\n🧪 Running comprehensive monitoring tests...');
    await orchestrator.testMonitoringSystems();

    // Show current status
    console.log('\n📊 Current monitoring status:');
    const status = await orchestrator.getMonitoringStatus();
    console.log(JSON.stringify(status, null, 2));

    // Keep running for demo purposes
    console.log('\n🔄 Monitoring systems are now running...');
    console.log('Press Ctrl+C to stop the demo and shutdown monitoring systems.');

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Received shutdown signal...');
      await orchestrator.shutdown();
      console.log('👋 Demo completed. Thank you!');
      process.exit(0);
    });

    // Keep the process alive
    await new Promise(() => {});

  } catch (error) {
    console.error('❌ Demo failed:', error);
    await orchestrator.shutdown();
    process.exit(1);
  }
}

// Run the demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMonitoringDemo().catch(console.error);
}

export { runMonitoringDemo };
