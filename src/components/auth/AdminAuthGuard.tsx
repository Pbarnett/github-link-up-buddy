import * as React from 'react';
import { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser'; // Assuming you have a hook to get the current user
import { AdminPermission, AdminRole } from '@/types/admin.types';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: AdminRole;
  requiredPermissions?: AdminPermission[];
}

const rolePermissions: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    'view_dashboard',
    'view_users',
    'manage_users',
    'view_system_health',
    'manage_feature_flags',
    'view_analytics',
    'manage_settings',
    'view_audit_logs',
    'execute_operations',
  ],
  admin: [
    'view_dashboard',
    'view_users',
    'manage_users',
    'view_system_health',
    'manage_feature_flags',
    'view_analytics',
  ],
  moderator: ['view_dashboard', 'view_users', 'view_system_health'],
  viewer: ['view_dashboard', 'view_system_health', 'view_analytics'],
};

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ 
  children,
  requiredRole,
  requiredPermissions,
 }) => {
  const { user, loading, error } = useCurrentUser(); // Replace with your actual user hook
  const location = useLocation();

  const hasPermissions = useMemo(() => {
    if (!user || !user.role || !rolePermissions[user.role]) return false;

    const userPermissions = rolePermissions[user.role];
    if (requiredRole && user.role !== requiredRole) return false;

    if (requiredPermissions) {
      return requiredPermissions.every(p => userPermissions.includes(p));
    }

    return true; // If no specific permissions are required, role is enough
  }, [user, requiredRole, requiredPermissions]);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (error || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPermissions) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
