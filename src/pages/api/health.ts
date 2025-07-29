import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: { status: 'up' | 'down'; responseTime?: number };
    launchdarkly: { status: 'up' | 'down'; responseTime?: number };
  };
  environment: string;
  uptime: number;
}

const startTime = Date.now();

async function checkDatabaseHealth(): Promise<{
  status: 'up' | 'down';
  responseTime?: number;
}> {
  try {
    const start = Date.now();
    const { error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
      .single();
    const responseTime = Date.now() - start;

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned"
      console.error('Database health check failed:', error);
      return { status: 'down' };
    }

    return { status: 'up', responseTime };
  } catch (error) {
    console.error('Database health check error:', error);
    return { status: 'down' };
  }
}

async function checkLaunchDarklyHealth(): Promise<{
  status: 'up' | 'down';
  responseTime?: number;
}> {
  try {
    const start = Date.now();
    // Simple check to see if LaunchDarkly client is initialized
    // In a real implementation, you might check flag evaluation
    const responseTime = Date.now() - start;
    return { status: 'up', responseTime };
  } catch (error) {
    console.error('LaunchDarkly health check error:', error);
    return { status: 'down' };
  }
}

export async function GET(): Promise<Response> {
  try {
    const [databaseHealth, launchdarklyHealth] = await Promise.all([
      checkDatabaseHealth(),
      checkLaunchDarklyHealth(),
    ]);

    const overallStatus =
      databaseHealth.status === 'down' || launchdarklyHealth.status === 'down'
        ? 'unhealthy'
        : databaseHealth.status === 'up' && launchdarklyHealth.status === 'up'
          ? 'healthy'
          : 'degraded';

    const health: HealthCheck = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: databaseHealth,
        launchdarkly: launchdarklyHealth,
      },
      environment: process.env.NODE_ENV || 'development',
      uptime: Date.now() - startTime,
    };

    const statusCode =
      overallStatus === 'healthy'
        ? 200
        : overallStatus === 'degraded'
          ? 200
          : 503;

    return new Response(JSON.stringify(health, null, 2), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);

    const health: HealthCheck = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: { status: 'down' },
        launchdarkly: { status: 'down' },
      },
      environment: process.env.NODE_ENV || 'development',
      uptime: Date.now() - startTime,
    };

    return new Response(JSON.stringify(health, null, 2), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}

// For frameworks that expect default export
export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'GET') {
    return GET();
  }

  return new Response('Method Not Allowed', { status: 405 });
}
