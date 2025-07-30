export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  lastLogin?: string;
  createdAt: string;
}

export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'viewer';

export type AdminPermission = 
  | 'view_dashboard'
  | 'view_users'
  | 'manage_users'
  | 'view_system_health'
  | 'manage_feature_flags'
  | 'view_analytics'
  | 'manage_settings'
  | 'view_audit_logs'
  | 'execute_operations';

export interface SystemMetrics {
  activeUsers: number;
  totalUsers: number;
  responseTime: number;
  errorRate: number;
  uptime: number;
  timestamp: string;
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  lastChecked: string;
  endpoint?: string;
  errorMessage?: string;
}

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  environments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface AdminDashboardData {
  metrics: SystemMetrics;
  services: ServiceHealth[];
  featureFlags: FeatureFlag[];
  recentActivity: AuditLog[];
}
