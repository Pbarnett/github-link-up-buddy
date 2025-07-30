import cluster from 'node:cluster';
import os from 'node:os';
import process from 'node:process';
import { startServer } from './api.js';

const numCPUs = os.cpus().length;

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

  // Graceful shutdown logic
  const gracefulShutdown = (signal: string) => {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);
    // Disconnect all workers
    for (const id in cluster.workers) {
        cluster.workers[id].disconnect();
    }
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
