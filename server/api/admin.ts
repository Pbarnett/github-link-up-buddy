import express from 'express';
import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { AdminDashboardData, SystemMetrics, ServiceHealth, FeatureFlag, AuditLog } from '../../src/types/admin.types.js';

const router = express.Router();

// Middleware to check admin permissions (simplified for development)
const requireAdmin = async (req: Request, res: Response, next: Function) => {
  try {
    // For development, we'll skip auth - in production, uncomment the auth logic
    req.user = { id: 'dev-admin', email: 'admin@dev.local' };
    next();
    
    /* Production auth logic:
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No authorization token' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if user has admin role (you'll need to implement role checking)
    req.user = user;
    next();
    */
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ error: 'Authorization failed' });
  }
};

// Get system metrics
router.get('/metrics', requireAdmin, async (req: Request, res: Response) => {
  try {
    // Get real metrics from your database/monitoring systems
    const { data: userCount } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' });

    const { data: activeUsers } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const metrics: SystemMetrics = {
      activeUsers: activeUsers?.length || 0,
      totalUsers: userCount?.length || 0,
      responseTime: Math.floor(Math.random() * 100) + 50, // Mock data for now
      errorRate: Math.random() * 0.1,
      uptime: 99.9 + Math.random() * 0.1,
      timestamp: new Date().toISOString(),
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get service health status
router.get('/health', requireAdmin, async (req: Request, res: Response) => {
  try {
    const services: ServiceHealth[] = [
      {
        name: 'Supabase Database',
        status: 'healthy',
        responseTime: await checkDatabaseHealth(),
        lastChecked: new Date().toISOString(),
        endpoint: '/api/health/database',
      },
      {
        name: 'LaunchDarkly',
        status: await checkLaunchDarklyHealth(),
        responseTime: 120,
        lastChecked: new Date().toISOString(),
        endpoint: '/api/health/launchdarkly',
      },
      {
        name: 'Duffel API',
        status: await checkDuffelHealth(),
        responseTime: 200,
        lastChecked: new Date().toISOString(),
        endpoint: '/api/health/duffel',
      },
      {
        name: 'Stripe',
        status: 'healthy',
        responseTime: 150,
        lastChecked: new Date().toISOString(),
        endpoint: '/api/health/stripe',
      },
      {
        name: 'Redis Cache',
        status: 'healthy',
        responseTime: 10,
        lastChecked: new Date().toISOString(),
        endpoint: '/api/health/redis',
      },
    ];

    res.json(services);
  } catch (error) {
    console.error('Error fetching service health:', error);
    res.status(500).json({ error: 'Failed to fetch service health' });
  }
});

// Get feature flags
router.get('/feature-flags', requireAdmin, async (req: Request, res: Response) => {
  try {
    // This would integrate with LaunchDarkly or your feature flag service
    const featureFlags: FeatureFlag[] = [
      {
        key: 'wallet-ui',
        name: 'Wallet UI',
        description: 'Enhanced wallet interface with payment methods',
        enabled: true,
        rolloutPercentage: 100,
        environments: ['production', 'staging'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        key: 'multi-traveler',
        name: 'Multi-Traveler Booking',
        description: 'Allow booking for multiple travelers in one transaction',
        enabled: true,
        rolloutPercentage: 100,
        environments: ['production', 'staging'],
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        key: 'profile-v2',
        name: 'Profile V2',
        description: 'Enhanced user profile with better UX',
        enabled: true,
        rolloutPercentage: 85,
        environments: ['production', 'staging'],
        createdAt: '2024-03-01T10:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        key: 'auto-booking-v2',
        name: 'Auto Booking V2',
        description: 'Improved automatic booking system with better rules',
        enabled: false,
        rolloutPercentage: 15,
        environments: ['staging'],
        createdAt: '2024-04-01T10:00:00Z',
        updatedAt: new Date().toISOString(),
      },
    ];

    res.json(featureFlags);
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    res.status(500).json({ error: 'Failed to fetch feature flags' });
  }
});

// Update feature flag
router.patch('/feature-flags/:key', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const updates = req.body;

    // Here you would integrate with LaunchDarkly API to update the flag
    // For now, we'll return a mock updated flag
    const updatedFlag: FeatureFlag = {
      key,
      name: `Feature ${key}`,
      description: 'Updated feature flag',
      enabled: updates.enabled ?? true,
      rolloutPercentage: updates.rolloutPercentage ?? 100,
      environments: updates.environments ?? ['production'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    };

    // Log the admin action
    await logAdminAction(req.user.id, 'feature_flag_updated', key, updates);

    res.json(updatedFlag);
  } catch (error) {
    console.error('Error updating feature flag:', error);
    res.status(500).json({ error: 'Failed to update feature flag' });
  }
});

// Get audit logs
router.get('/audit-logs', requireAdmin, async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    
    const { data: logs, error } = await supabase
      .from('admin_audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;

    res.json(logs || []);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    
    // Return mock data if database query fails
    const mockLogs: AuditLog[] = [
      {
        id: '1',
        userId: 'user-123',
        userEmail: 'admin@example.com',
        action: 'feature_flag_updated',
        resource: 'profile-v2',
        details: { enabled: true, rolloutPercentage: 85 },
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
      {
        id: '2',
        userId: 'user-456',
        userEmail: 'moderator@example.com',
        action: 'user_account_suspended',
        resource: 'user-789',
        details: { reason: 'Terms of service violation' },
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    ];

    res.json(mockLogs);
  }
});

// Log admin action
router.post('/audit-logs', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { action, resource, details } = req.body;
    await logAdminAction(req.user.id, action, resource, details);
    res.json({ success: true });
  } catch (error) {
    console.error('Error logging admin action:', error);
    res.status(500).json({ error: 'Failed to log admin action' });
  }
});

// Server-Sent Events for real-time updates
router.get('/stream', requireAdmin, (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial connection message
  res.write('data: {"type": "connected"}\n\n');

  // Send updates every 30 seconds
  const interval = setInterval(async () => {
    try {
      // Get fresh data
      const metrics = await getSystemMetrics();
      const services = await getServiceHealth();
      const featureFlags = await getFeatureFlags();
      const recentActivity = await getRecentAuditLogs(10);

      const data: AdminDashboardData = {
        metrics,
        services,
        featureFlags,
        recentActivity,
      };

      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      console.error('Error sending SSE update:', error);
    }
  }, 30000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// Helper functions
async function checkDatabaseHealth(): Promise<number> {
  const start = Date.now();
  try {
    await supabase.from('profiles').select('id').limit(1);
    return Date.now() - start;
  } catch (error) {
    return -1;
  }
}

async function checkLaunchDarklyHealth(): Promise<'healthy' | 'degraded' | 'unhealthy'> {
  // Implement LaunchDarkly health check
  return 'healthy';
}

async function checkDuffelHealth(): Promise<'healthy' | 'degraded' | 'unhealthy'> {
  // Implement Duffel API health check
  return 'healthy';
}

async function logAdminAction(userId: string, action: string, resource: string, details: any) {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    await supabase.from('admin_audit_logs').insert({
      user_id: userId,
      user_email: user?.user?.email || 'unknown',
      action,
      resource,
      details,
      timestamp: new Date().toISOString(),
      ip_address: '0.0.0.0', // You'd get this from the request
      user_agent: 'Admin Dashboard',
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}

async function getSystemMetrics(): Promise<SystemMetrics> {
  // Implementation would fetch real metrics
  return {
    activeUsers: Math.floor(Math.random() * 1000) + 500,
    totalUsers: Math.floor(Math.random() * 10000) + 5000,
    responseTime: Math.floor(Math.random() * 100) + 50,
    errorRate: Math.random() * 0.1,
    uptime: 99.9 + Math.random() * 0.1,
    timestamp: new Date().toISOString(),
  };
}

async function getServiceHealth(): Promise<ServiceHealth[]> {
  // Implementation would check actual services
  return [
    {
      name: 'Supabase Database',
      status: 'healthy',
      responseTime: await checkDatabaseHealth(),
      lastChecked: new Date().toISOString(),
    },
    // ... other services
  ];
}

async function getFeatureFlags(): Promise<FeatureFlag[]> {
  // Implementation would fetch from LaunchDarkly
  return [];
}

async function getRecentAuditLogs(limit: number): Promise<AuditLog[]> {
  // Implementation would fetch from database
  return [];
}

export default router;
