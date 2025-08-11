import express from 'express';
import { register } from './metrics';
import fs from 'fs';
import path from 'path';

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

// Business rules config endpoint (serves static public config in dev)
app.get('/api/business-rules/config', (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'config', 'business-rules.json');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'business-rules.json not found' });
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(raw);
    res.setHeader('Cache-Control', 'no-cache');
    return res.json(json);
  } catch (err) {
    console.error('Failed to read business-rules.json', err);
    return res.status(500).json({ error: 'Failed to load business rules config' });
  }
});

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Parker Flight API Server', version: '1.0.0' });
});

export function startServer(port: number) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
  return server;
}

export default app;
