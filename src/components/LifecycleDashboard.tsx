import * as React from 'react';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createCustomerLifecycleManager } from '@/lib/stripe/customerLifecycleManager';
const LifecycleDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    inactiveCustomers: 0,
    anonymizedCustomers: 0,
    recentActions: [] as Record<string, any>[],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const manager = createCustomerLifecycleManager();
        const stats = await manager.getLifecycleStats();
        setStats(stats);
      } catch (error) {
        console.error('Failed to fetch lifecycle stats:', error);
      }
    };

    fetchStats();
  }, []);

  const activePercentage =
    stats.totalCustomers > 0
      ? ((stats.totalCustomers - stats.inactiveCustomers) /
          stats.totalCustomers) *
        100
      : 0;
  const inactivePercentage =
    stats.totalCustomers > 0
      ? (stats.inactiveCustomers / stats.totalCustomers) * 100
      : 0;
  const anonymizedPercentage =
    stats.totalCustomers > 0
      ? (stats.anonymizedCustomers / stats.totalCustomers) * 100
      : 0;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Lifecycle Management</CardTitle>
        </CardHeader>
        <CardContent>
          <h5 className="text-lg font-semibold mb-4">Overview</h5>
          <ul className="space-y-2 mb-6">
            <li>Total Customers: {stats.totalCustomers}</li>
            <li>Inactive Customers: {stats.inactiveCustomers}</li>
            <li>Anonymized Customers: {stats.anonymizedCustomers}</li>
          </ul>

          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-green-600">Active</span>
                <span className="text-sm">{activePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={activePercentage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-yellow-600">Inactive</span>
                <span className="text-sm">
                  {inactivePercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={inactivePercentage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-red-600">Anonymized</span>
                <span className="text-sm">
                  {anonymizedPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={anonymizedPercentage} className="h-2" />
            </div>
          </div>

          <h5 className="text-lg font-semibold mb-4">
            Recent Lifecycle Actions
          </h5>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Performed At</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentActions.map((action, index) => (
                <TableRow key={index}>
                  <TableCell>{action.action}</TableCell>
                  <TableCell>{action.performed_at}</TableCell>
                  <TableCell>{action.user_id}</TableCell>
                  <TableCell>{action.customer_id}</TableCell>
                  <TableCell>
                    <pre className="text-xs">
                      {JSON.stringify(action.metadata, null, 2)}
                    </pre>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LifecycleDashboard;
