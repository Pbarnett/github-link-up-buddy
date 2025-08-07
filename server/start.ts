#!/usr/bin/env tsx

import { startServer } from './api.js';
import { 
  userRegistrations, 
  featureFlagEvaluations, 
  httpRequests,
  applicationErrors,
  safeIncrement 
} from './metrics.js';

const PORT = process.env.METRICS_PORT ? parseInt(process.env.METRICS_PORT) : 5001;

// Initialize some sample metrics for demonstration
function initializeSampleMetrics() {
  console.log('🎯 Initializing sample metrics for monitoring...');
  
  // Simulate some user registrations
  safeIncrement(userRegistrations, { method: 'google', status: 'success' }, 45);
  safeIncrement(userRegistrations, { method: 'email', status: 'success' }, 28);
  safeIncrement(userRegistrations, { method: 'google', status: 'failure' }, 2);
  
  // Simulate feature flag evaluations
  safeIncrement(featureFlagEvaluations, { flag: 'wallet_ui', value: 'true', user_in_rollout: 'yes' }, 12);
  safeIncrement(featureFlagEvaluations, { flag: 'wallet_ui', value: 'false', user_in_rollout: 'no' }, 188);
  safeIncrement(featureFlagEvaluations, { flag: 'profile_ui_revamp', value: 'true', user_in_rollout: 'yes' }, 75);
  
  // Simulate HTTP requests
  safeIncrement(httpRequests, { method: 'GET', endpoint: '/api/profile', status_code: '200' }, 234);
  safeIncrement(httpRequests, { method: 'POST', endpoint: '/api/wallet/add-card', status_code: '200' }, 15);
  safeIncrement(httpRequests, { method: 'GET', endpoint: '/api/feature-flags/wallet_ui', status_code: '200' }, 89);
  safeIncrement(httpRequests, { method: 'GET', endpoint: '/health', status_code: '200' }, 450);
  
  // Simulate some errors
  safeIncrement(applicationErrors, { error_type: 'validation', component: 'frontend', severity: 'warning' }, 5);
  safeIncrement(applicationErrors, { error_type: 'network', component: 'backend', severity: 'critical' }, 1);
  
  console.log('✅ Sample metrics initialized');
}

// Start the metrics server
function main() {
  console.log('🚀 Starting Parker Flight Metrics Server...');
  console.log(`📊 Metrics will be available at http://localhost:${PORT}/metrics`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
  
  // Initialize sample data
  initializeSampleMetrics();
  
  // Start the server
  const server = startServer(PORT);
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('📡 SIGTERM received, shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
  
  process.on('SIGINT', () => {
    console.log('\n📡 SIGINT received, shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
}

// Use ESM approach for detecting if this file is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
