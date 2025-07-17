import express from 'express';
import { register } from './metrics';

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Parker Flight API Server', version: '1.0.0' });
});

export function startServer(port: number) {
  const server = app.listen(port, '127.0.0.1', () => {
    console.log(`Server running on 127.0.0.1:${port}`);
  });
  
  return server;
}

export default app;
