import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Server,
  BarChart3,
  Download
} from 'lucide-react';
import { useDatabaseAnalytics } from '@/lib/database/analytics';
import { getConnectionPool } from '@/lib/database/connection-pool';
import { DatabaseOperations } from '@/lib/supabase/database-operations';

interface ConnectionPoolStats {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  waitingQueries: number;
  utilization: number;
}

export function DatabaseDashboard() {
  const analytics = useDatabaseAnalytics();
  const [snapshot, setSnapshot] = useState(analytics.getSnapshot());
  const [healthReport, setHealthReport] = useState(analytics.getHealthReport());
  const [connectionHealth, setConnectionHealth] = useState<any>(null);
  const [poolStats, setPoolStats] = useState<ConnectionPoolStats | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Refresh data
  const refreshData = async () => {
    const newSnapshot = analytics.getSnapshot();
    const newHealthReport = analytics.getHealthReport();
    const newConnectionHealth = await DatabaseOperations.healthCheck();
    
    setSnapshot(newSnapshot);
    setHealthReport(newHealthReport);
    setConnectionHealth(newConnectionHealth);

    // Get connection pool stats
    const pool = getConnectionPool();
    if (pool.isEnabled) {
      const stats = pool.getStats();
      setPoolStats({
        totalConnections: stats.total,
        activeConnections: stats.active,
        idleConnections: stats.idle,
        waitingQueries: stats.waiting,
        utilization: stats.total > 0 ? (stats.active / stats.total) * 100 : 0
      });
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    refreshData();
    
    if (isAutoRefresh) {
      const interval = setInterval(refreshData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, isAutoRefresh]);

  // Return statement ensures all code paths return a value
  if (!snapshot) {
    return <div>Loading...</div>;
  }

  // Export functionality
  const handleExportMetrics = (format: 'json' | 'csv') => {
    const data = analytics.exportMetrics(format);
    const blob = new Blob([data], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `database-metrics-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Database Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor database performance, connections, and query analytics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          >
            <Activity className={`h-4 w-4 mr-2 ${isAutoRefresh ? 'animate-pulse' : ''}`} />
            {isAutoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => refreshData()}>
            Refresh Now
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Health</CardTitle>
            <div className={getStatusColor(healthReport.status)}>
              {getStatusIcon(healthReport.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{healthReport.status}</div>
            <p className="text-xs text-muted-foreground">
              {connectionHealth?.latency ? `${connectionHealth.latency}ms latency` : 'Checking...'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{snapshot.totalQueries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(snapshot.averageQueryTime)}ms</div>
            <p className="text-xs text-muted-foreground">
              {snapshot.slowQueries.length} slow queries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{snapshot.errorRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {snapshot.totalQueries - Math.round(snapshot.totalQueries * snapshot.errorRate / 100)} successful
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="slow-queries">Slow Queries</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Health Report */}
          <Card>
            <CardHeader>
              <CardTitle>Health Report</CardTitle>
              <CardDescription>Current database health status and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={healthReport.status === 'healthy' ? 'default' : 
                          healthReport.status === 'warning' ? 'secondary' : 'destructive'}
                >
                  {healthReport.status.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Overall system status
                </span>
              </div>

              {healthReport.issues.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Issues Detected:</h4>
                  <ul className="text-sm space-y-1">
                    {healthReport.issues.map((issue, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <AlertTriangle className="h-3 w-3 text-yellow-500" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                <ul className="text-sm space-y-1">
                  {healthReport.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Top Tables */}
          <Card>
            <CardHeader>
              <CardTitle>Most Active Tables</CardTitle>
              <CardDescription>Tables with the highest query volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {snapshot.topTables.slice(0, 5).map((table, index) => (
                  <div key={table.table} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <div className="font-medium">{table.table}</div>
                        <div className="text-sm text-muted-foreground">
                          {table.count} queries
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{Math.round(table.avgDuration)}ms</div>
                      <div className="text-sm text-muted-foreground">avg response</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connection Pool Status</CardTitle>
              <CardDescription>Connection pool utilization and health</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {poolStats ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <div className="text-2xl font-bold">{poolStats.totalConnections}</div>
                      <p className="text-xs text-muted-foreground">Total Connections</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{poolStats.activeConnections}</div>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{poolStats.idleConnections}</div>
                      <p className="text-xs text-muted-foreground">Idle</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{poolStats.waitingQueries}</div>
                      <p className="text-xs text-muted-foreground">Waiting</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Pool Utilization</span>
                      <span>{poolStats.utilization.toFixed(1)}%</span>
                    </div>
                    <Progress value={poolStats.utilization} />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Connection Pool Usage</span>
                      <span>{snapshot.connectionPoolUtilization.toFixed(1)}%</span>
                    </div>
                    <Progress value={snapshot.connectionPoolUtilization} />
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Connection pool is not enabled</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Table Analytics</CardTitle>
              <CardDescription>Detailed performance metrics by table</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {snapshot.topTables.map((table) => (
                  <div key={table.table} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{table.table}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTable(table.table)}
                      >
                        View Details
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium">{table.count}</div>
                        <div className="text-muted-foreground">Queries</div>
                      </div>
                      <div>
                        <div className="font-medium">{Math.round(table.avgDuration)}ms</div>
                        <div className="text-muted-foreground">Avg Response</div>
                      </div>
                      <div>
                        <div className="font-medium">
                          {((table.count / snapshot.totalQueries) * 100).toFixed(1)}%
                        </div>
                        <div className="text-muted-foreground">Of Total</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slow-queries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Slow Queries</CardTitle>
              <CardDescription>Queries taking longer than 1 second to execute</CardDescription>
            </CardHeader>
            <CardContent>
              {snapshot.slowQueries.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">No slow queries detected!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {snapshot.slowQueries.map((query) => (
                    <div key={query.queryId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{query.operation.toUpperCase()}</Badge>
                          <span className="font-medium">{query.table}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-600">{query.duration}ms</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(query.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      {query.error && (
                        <div className="text-sm text-red-600 bg-red-50 rounded p-2">
                          {query.error}
                        </div>
                      )}
                      {query.userId && (
                        <div className="text-xs text-muted-foreground">
                          User: {query.userId}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>Export database analytics for external analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button 
                  onClick={() => handleExportMetrics('json')}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export as JSON</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleExportMetrics('csv')}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export as CSV</span>
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Export includes:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Query performance metrics</li>
                  <li>Error rates and retry counts</li>
                  <li>Connection pool utilization</li>
                  <li>User activity patterns</li>
                  <li>Table usage statistics</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
