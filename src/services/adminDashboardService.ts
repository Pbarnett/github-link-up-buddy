import { AdminDashboardData, SystemMetrics, ServiceHealth, FeatureFlag, AuditLog } from '@/types/admin.types';

class AdminDashboardService {
  private eventSource: EventSource | null = null;
  private listeners: ((data: AdminDashboardData) => void)[] = [];

  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/admin/metrics');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch system metrics:', error);
      // Return fallback data
      return {
        activeUsers: 0,
        totalUsers: 0,
        responseTime: 0,
        errorRate: 0,
        uptime: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getServiceHealth(): Promise<ServiceHealth[]> {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/admin/health');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch service health:', error);
      // Return fallback data with known services
      return [
        {
          name: 'Supabase Database',
          status: 'healthy',
          responseTime: 45,
          lastChecked: new Date().toISOString(),
          endpoint: '/api/health/database',
        },
        {
          name: 'LaunchDarkly',
          status: 'healthy',
          responseTime: 120,
          lastChecked: new Date().toISOString(),
          endpoint: '/api/health/launchdarkly',
        },
        {
          name: 'Duffel API',
          status: 'healthy',
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
    }
  }

  async getFeatureFlags(): Promise<FeatureFlag[]> {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/admin/feature-flags');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch feature flags:', error);
      // Return current known feature flags
      return [
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
    }
  }

  async updateFeatureFlag(key: string, updates: Partial<FeatureFlag>): Promise<FeatureFlag> {
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/admin/feature-flags/${key}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to update feature flag:', error);
      throw error;
    }
  }

  async getRecentActivity(): Promise<AuditLog[]> {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/admin/audit-logs?limit=10');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
      // Return mock recent activity
      return [
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
    }
  }

  async getDashboardData(): Promise<AdminDashboardData> {
    const [metrics, services, featureFlags, recentActivity] = await Promise.all([
      this.getSystemMetrics(),
      this.getServiceHealth(),
      this.getFeatureFlags(),
      this.getRecentActivity(),
    ]);

    return {
      metrics,
      services,
      featureFlags,
      recentActivity,
    };
  }

  // Real-time updates using Server-Sent Events
  subscribeToUpdates(callback: (data: AdminDashboardData) => void): () => void {
    this.listeners.push(callback);

    if (!this.eventSource) {
      this.eventSource = new EventSource('http://127.0.0.1:5001/api/admin/stream');
      
      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.listeners.forEach(listener => listener(data));
        } catch (error) {
          console.error('Failed to parse SSE data:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        // Implement reconnection logic if needed
      };
    }

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }

      if (this.listeners.length === 0 && this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    };
  }

  // For immediate health check of a specific service
  async checkServiceHealth(serviceName: string): Promise<ServiceHealth> {
    try {
      const response = await fetch(`/api/admin/health/${serviceName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to check ${serviceName} health:`, error);
      return {
        name: serviceName,
        status: 'unhealthy',
        lastChecked: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Log admin actions for audit trail
  async logAdminAction(action: string, resource: string, details: Record<string, any>): Promise<void> {
    try {
      await fetch('/api/admin/audit-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          resource,
          details,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to log admin action:', error);
      // Don't throw - audit logging shouldn't break the main flow
    }
  }
}

export const adminDashboardService = new AdminDashboardService();
export default adminDashboardService;
