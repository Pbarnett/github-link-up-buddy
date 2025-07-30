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
interface MetricCard {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  status: 'success' | 'warning' | 'error' | 'info';
}

export default function AdminDashboard() {
  const [systemMetrics, setSystemMetrics] = useState<MetricCard[]>([
    {
      title: 'Active Users',
      value: '1,234',
      change: '+12%',
      icon: <Users className="h-4 w-4" />,
      status: 'success',
    },
    {
      title: 'Response Time',
      value: '120ms',
      change: '-5ms',
      icon: <Clock className="h-4 w-4" />,
      status: 'success',
    },
    {
      title: 'Error Rate',
      value: '0.02%',
      change: '-0.01%',
      icon: <AlertCircle className="h-4 w-4" />,
      status: 'success',
    },
    {
      title: 'Uptime',
      value: '99.98%',
      change: '+0.01%',
      icon: <TrendingUp className="h-4 w-4" />,
      status: 'success',
    },
  ]);

  const [deploymentInfo, setDeploymentInfo] = useState({
    version: '1.0.0',
    buildTime: new Date().toISOString(),
    commit: 'abc123f',
    environment: 'production',
    buildSize: '1.4MB',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage Parker Flight application
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor('success')}>
            <Activity className="h-3 w-3 mr-1" />
            System Healthy
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  {metric.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  {metric.change && (
                    <p className="text-xs text-muted-foreground">
                      {metric.change} from last hour
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>API Server</span>
                  {getStatusIcon('success')}
                </div>
                <div className="flex items-center justify-between">
                  <span>Database</span>
                  {getStatusIcon('success')}
                </div>
                <div className="flex items-center justify-between">
                  <span>CDN</span>
                  {getStatusIcon('success')}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5" />
                  Feature Flags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Wallet UI</span>
                  <Badge className={getStatusColor('success')}>ON</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Multi-Traveler</span>
                  <Badge className={getStatusColor('success')}>ON</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Profile V2</span>
                  <Badge className={getStatusColor('success')}>ON</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Build Size</span>
                  <span className="text-sm font-mono">
                    {deploymentInfo.buildSize}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Version</span>
                  <span className="text-sm font-mono">
                    {deploymentInfo.version}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Environment</span>
                  <Badge variant="outline">{deploymentInfo.environment}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <HealthCheck />

          <Card>
            <CardHeader>
              <CardTitle>Service Dependencies</CardTitle>
              <CardDescription>
                Status of external services and integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Supabase Database</div>
                      <div className="text-sm text-muted-foreground">
                        Primary database connection
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor('success')}>Connected</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Flag className="h-5 w-5" />
                    <div>
                      <div className="font-medium">LaunchDarkly</div>
                      <div className="text-sm text-muted-foreground">
                        Feature flag service
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor('success')}>Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Server className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Duffel API</div>
                      <div className="text-sm text-muted-foreground">
                        Flight search and booking
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor('success')}>Available</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Bundle Analysis</CardTitle>
                <CardDescription>
                  Application bundle size and optimization metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Main Bundle</span>
                    <span className="font-mono text-sm">1.4MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vendor Chunk</span>
                    <span className="font-mono text-sm">380KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UI Components</span>
                    <span className="font-mono text-sm">320KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gzipped Total</span>
                    <span className="font-mono text-sm">338KB</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Optimization</span>
                      <span className="text-green-600">26% improvement</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Core Web Vitals and loading performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>First Contentful Paint</span>
                    <Badge className={getStatusColor('success')}>1.2s</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Largest Contentful Paint</span>
                    <Badge className={getStatusColor('success')}>2.1s</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cumulative Layout Shift</span>
                    <Badge className={getStatusColor('success')}>0.01</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Time to Interactive</span>
                    <Badge className={getStatusColor('success')}>2.8s</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Information</CardTitle>
              <CardDescription>
                Current deployment details and build information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Version</label>
                    <div className="font-mono text-sm">
                      {deploymentInfo.version}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Environment</label>
                    <div>
                      <Badge variant="outline">
                        {deploymentInfo.environment}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Build Time</label>
                    <div className="text-sm">
                      {new Date(deploymentInfo.buildTime).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Git Commit</label>
                    <div className="font-mono text-sm">
                      {deploymentInfo.commit}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Build Size</label>
                    <div className="font-mono text-sm">
                      {deploymentInfo.buildSize}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Deployment Status
                    </label>
                    <div>
                      <Badge className={getStatusColor('success')}>
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deployment Actions</CardTitle>
              <CardDescription>
                Manage deployment and monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
                <Button variant="outline">
                  <Server className="h-4 w-4 mr-2" />
                  View Logs
                </Button>
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Performance Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
