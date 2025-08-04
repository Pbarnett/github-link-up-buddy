import cluster from 'node:cluster';
import os from 'node:os';
import process from 'node:process';
import { startServer } from './api.js';
import EnhancedAWSSetup from '../src/lib/aws-sdk-enhanced';

const numCPUs = os.cpus().length;

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

// Initialize Enhanced AWS Services
  (async () => {
    try {
      const environment = process.env.NODE_ENV || 'development';
      const isProduction = environment === 'production';
      
      await EnhancedAWSSetup.initialize({
        environment,
        warmupSecrets: isProduction, // Only warmup in production
        enableMonitoring: true
      });
      console.log('✅ Enhanced AWS Services initialized');

      // Fork workers.
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
    } catch (error) {
      console.error('❌ Failed to initialize Enhanced AWS Services:', error);
      process.exit(1);
    }
  })();

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

  // Graceful shutdown logic
  const gracefulShutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);
    // Disconnect all workers
    for (const id in cluster.workers) {
        cluster.workers[id].disconnect();
    }
    await EnhancedAWSSetup.shutdown();
    process.exit(0);
  };

  // Handlers for different shutdown signals
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

} else {
  const server = startServer(5001);
  console.log(`Worker ${process.pid} started`);

  process.on('disconnect', () => {
      console.log(`Worker ${process.pid} disconnecting...`);
      server.close(() => {
          console.log(`Worker ${process.pid} shutdown complete.`);
          process.exit(0);
      });
  });
}

// Before exit handler for cleanup
process.on('beforeExit', (code) => {
  console.log(`Process beforeExit event with code: ${code}`);
  // Add any final cleanup logic here
});
