/**
 * Form Analytics Dashboard
 *
 * Displays comprehensive analytics for dynamic forms
 */

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  Calendar,
  CalendarIcon,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  Info,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  Plane,
  PlaneTakeoff,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Shield,
  Trash2,
  Upload,
  User,
  Wifi,
  X,
  XCircle,
  Zap,
  BarChart3,
  Target,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

type FC<T = {}> = React.FC<T>;

interface FormAnalytics {
  form_name: string;
  total_views: number;
  total_submissions: number;
  completion_rate: number;
  abandonment_rate: number;
  avg_completion_time_ms: number;
  date: string;
}

interface FormAnalyticsOverview {
  totalForms: number;
  totalViews: number;
  totalSubmissions: number;
  avgCompletionRate: number;
  avgCompletionTime: number;
}

export const FormAnalyticsDashboard: FC = () => {
  const [analytics, setAnalytics] = useState<FormAnalytics[]>([]);
  const [overview, setOverview] = useState<FormAnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>(
    '7d'
  );

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range based on selected period
      const endDate = new Date();
      const startDate = new Date();

      switch (selectedPeriod) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
      }

      // Fetch analytics data
      const queryResult = supabase
        .from('form_completion_analytics')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: false });

      const { data: analyticsData, error: analyticsError } = await queryResult;

      if (analyticsError) throw analyticsError;

      // Aggregate data by form
      const formAnalytics = (analyticsData || []).reduce(
        (acc: Record<string, FormAnalytics>, curr: FormAnalytics) => {
          const key = curr.form_name;
          if (!acc[key]) {
            acc[key] = {
              form_name: curr.form_name,
              total_views: 0,
              total_submissions: 0,
              completion_rate: 0,
              abandonment_rate: 0,
              avg_completion_time_ms: 0,
              date: curr.date,
            };
          }

          acc[key].total_views += curr.total_views || 0;
          acc[key].total_submissions += curr.total_submissions || 0;

          return acc;
        },
        {}
      );

      // Calculate completion rates
      const forms = Object.values(formAnalytics) as FormAnalytics[];
      forms.forEach((form: FormAnalytics) => {
        if (form.total_views > 0) {
          form.completion_rate =
            (form.total_submissions / form.total_views) * 100;
        }
      });

      const analyticsArray = Object.values(formAnalytics) as FormAnalytics[];
      setAnalytics(analyticsArray);

      // Calculate overview metrics
      const totalViews = analyticsArray.reduce(
        (sum, form) => sum + (form.total_views || 0),
        0
      );
      const totalSubmissions = analyticsArray.reduce(
        (sum, form) => sum + (form.total_submissions || 0),
        0
      );
      const avgCompletionRate =
        totalViews > 0 ? (totalSubmissions / totalViews) * 100 : 0;

      // Calculate weighted average completion time across all forms
      const totalCompletionTime = analyticsArray.reduce((sum, form) => {
        const weight = form.total_submissions || 0;
        return sum + (form.avg_completion_time_ms || 0) * weight;
      }, 0);
      const avgCompletionTime =
        totalSubmissions > 0 ? totalCompletionTime / totalSubmissions : 0;

      setOverview({
        totalForms: analyticsArray.length,
        totalViews,
        totalSubmissions,
        avgCompletionRate,
        avgCompletionTime,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      console.error('Analytics loading error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const getCompletionRateColor = (rate: number): string => {
    if (rate >= 70) return 'text-green-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletionRateBadge = (
    rate: number
  ): 'default' | 'secondary' | 'destructive' => {
    if (rate >= 70) return 'default';
    if (rate >= 50) return 'secondary';
    return 'destructive';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Form Analytics</h1>
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Form Analytics</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={loadAnalytics}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Form Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Monitor form performance and user engagement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border p-1">
            {(['7d', '30d', '90d'] as const).map(period => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="px-3"
              >
                {period === '7d' && 'Last 7 days'}
                {period === '30d' && 'Last 30 days'}
                {period === '90d' && 'Last 90 days'}
              </Button>
            ))}
          </div>
          <Button onClick={loadAnalytics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Forms
                  </p>
                  <p className="text-2xl font-bold">{overview.totalForms}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Views
                  </p>
                  <p className="text-2xl font-bold">
                    {overview.totalViews.toLocaleString()}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Submissions
                  </p>
                  <p className="text-2xl font-bold">
                    {overview.totalSubmissions.toLocaleString()}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Completion Rate
                  </p>
                  <p
                    className={`text-2xl font-bold ${getCompletionRateColor(overview.avgCompletionRate)}`}
                  >
                    {overview.avgCompletionRate.toFixed(1)}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forms">Form Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analytics.length === 0 ? (
              <Card className="col-span-2">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Analytics Data
                  </h3>
                  <p className="text-muted-foreground">
                    Start using the dynamic forms system to see analytics data
                    here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              analytics.map(form => (
                <Card key={form.form_name}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {form.form_name}
                      </CardTitle>
                      <Badge
                        variant={getCompletionRateBadge(form.completion_rate)}
                      >
                        {form.completion_rate.toFixed(1)}% completion
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Views:</span>
                        <span className="font-medium">
                          {form.total_views.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Submissions:
                        </span>
                        <span className="font-medium">
                          {form.total_submissions.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {form.avg_completion_time_ms > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Avg Completion:
                        </span>
                        <span className="font-medium">
                          {formatDuration(form.avg_completion_time_ms)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Performance Comparison</CardTitle>
              <CardDescription>
                Compare completion rates and engagement across all forms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No form data available for the selected period.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analytics.map(form => (
                    <div key={form.form_name} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{form.form_name}</h4>
                        <Badge
                          variant={getCompletionRateBadge(form.completion_rate)}
                        >
                          {form.completion_rate.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(form.completion_rate, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{form.total_views} views</span>
                        <span>{form.total_submissions} submissions</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>
                  AI-powered recommendations for improving form performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.length === 0 ? (
                  <p className="text-muted-foreground">
                    No insights available yet. Start collecting form data to see
                    recommendations.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {analytics.some(form => form.completion_rate < 50) && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Some forms have low completion rates (under 50%).
                          Consider simplifying these forms or reducing the
                          number of required fields.
                        </AlertDescription>
                      </Alert>
                    )}

                    {analytics.some(form => form.completion_rate > 80) && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Great job! Some forms have high completion rates (over
                          80%). Consider using their structure as a template for
                          other forms.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Alert>
                      <Target className="h-4 w-4" />
                      <AlertDescription>
                        Monitor completion rates regularly. Industry average for
                        web forms is around 68%.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common actions for form optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Export Analytics Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Set Up A/B Test
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Analytics Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
