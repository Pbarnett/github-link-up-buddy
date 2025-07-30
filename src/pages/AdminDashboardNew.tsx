import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Database,
  Flag,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  ShieldCheck,
  Settings,
  BookOpen,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { AdminDashboardData, ServiceHealth, FeatureFlag } from '@/types/admin.types';
import adminDashboardService from '@/services/adminDashboardService';

const MetricCard: React.FC<{ title: string; value: string | number; change?: string; icon: React.ReactNode; status: string; }> = ({ title, value, change, icon, status }) => {
  const statusColor = {
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
    info: 'text-blue-500',
  }[status] || 'text-gray-500';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${statusColor}`}>{change} from last hour</p>
        )}
      </CardContent>
    </Card>
  );
};

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const initialData = await adminDashboardService.getDashboardData();
        setData(initialData);
      } catch (error) {
        toast({
          title: 'Error fetching dashboard data',
          description: (error as Error).message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const unsubscribe = adminDashboardService.subscribeToUpdates((newData) => {
      setData(newData);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleToggleFlag = async (flag: FeatureFlag) => {
    try {
      const updatedFlag = await adminDashboardService.updateFeatureFlag(flag.key, { enabled: !flag.enabled });
      setData(prevData => {
        if (!prevData) return null;
        return {
          ...prevData,
          featureFlags: prevData.featureFlags.map(f => f.key === updatedFlag.key ? updatedFlag : f),
        };
      });
      toast({
        title: `Feature flag '${updatedFlag.name}' ${updatedFlag.enabled ? 'enabled' : 'disabled'}`,
      });
      adminDashboardService.logAdminAction('feature_flag_toggled', updatedFlag.key, { enabled: updatedFlag.enabled });
    } catch (error) {
      toast({
        title: 'Error updating feature flag',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unhealthy':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'unhealthy':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading admin dashboard...</div>;
  }
  
  if (!data) {
    return <div className="flex justify-center items-center h-screen">Could not load admin data.</div>;
  }

  const { metrics, services, featureFlags, recentActivity } = data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-blue-500" />
            World-Class Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Central hub for monitoring, managing, and securing the Parker Flight application.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor('healthy')}>
            <Activity className="h-3 w-3 mr-1" />
            System Healthy
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="system_health">System Health</TabsTrigger>
          <TabsTrigger value="feature_flags">Feature Flags</TabsTrigger>
          <TabsTrigger value="audit_logs">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard title="Active Users" value={metrics.activeUsers} change={"+12%"} icon={<Users className="h-4 w-4" />} status="success" />
            <MetricCard title="Total Users" value={metrics.totalUsers} change={"+3%"} icon={<Users className="h-4 w-4" />} status="info" />
            <MetricCard title="Response Time" value={`${metrics.responseTime}ms`} change={'-5ms'} icon={<Clock className="h-4 w-4" />} status="success" />
            <MetricCard title="Error Rate" value={`${metrics.errorRate}%`} change={'-0.01%'} icon={<AlertCircle className="h-4 w-4" />} status="success" />
            <MetricCard title="Uptime" value={`${metrics.uptime}%`} change={'+0.01%'} icon={<TrendingUp className="h-4 w-4" />} status="success" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Service Status and Quick Actions combined */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Live Service Status
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {services.map(service => (
                  <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                        {getStatusIcon(service.status)}
                        <span className="font-semibold">{service.name}</span>
                    </div>
                    <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Operational Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                  <Button variant="outline">User Management</Button>
                  <Button variant="outline">Run Diagnostics</Button>
                  <Button variant="outline">View System Logs</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system_health" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(service => (
                    <Card key={service.name}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                {service.name}
                                {getStatusIcon(service.status)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Response Time: {service.responseTime || 'N/A'} ms</p>
                            <p>Last Checked: {new Date(service.lastChecked).toLocaleString()}</p>
                            {service.errorMessage && <p className="text-red-500">Error: {service.errorMessage}</p>}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>

        <TabsContent value="feature_flags" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Feature Flag Management</CardTitle>
                <CardDescription>Toggle features on and off in real-time.</CardDescription>
              </CardHeader>
              <CardContent>
                {featureFlags.map(flag => (
                  <div key={flag.key} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                    <div>
                        <h4 className="font-semibold">{flag.name}</h4>
                        <p className="text-sm text-muted-foreground">{flag.description}</p>
                    </div>
                    <Switch 
                        checked={flag.enabled}
                        onCheckedChange={() => handleToggleFlag(flag)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="audit_logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Admin Activity</CardTitle>
                <CardDescription>Track significant actions taken by administrators.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recentActivity.map(log => (
                      <li key={log.id} className="flex items-center justify-between p-2 border rounded-lg">
                          <div>
                              <p><span className="font-semibold">{log.userEmail}</span> performed action: <span className="font-mono">{log.action}</span></p>
                              <p className="text-sm text-muted-foreground">Resource: {log.resource}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
                      </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
