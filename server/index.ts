import { startServer } from './api';

const server = startServer(5001);

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

// Prevent the process from exiting
setInterval(() => {
  // Keep alive - this will run every 30 seconds
}, 30000);
