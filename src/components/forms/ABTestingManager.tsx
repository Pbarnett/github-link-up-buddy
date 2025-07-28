/**
 * A/B Testing Manager Component
 *
 * Enables creation and management of A/B tests for dynamic forms
 * Part of Phase 3: Advanced Features
 */

import * as React from 'react';
import { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
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
  Pause,
  Phone,
  Plane,
  PlaneTakeoff,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Shield,
  Target,
  TestTube,
  Trash2,
  Upload,
  User,
  Users,
  Wifi,
  X,
  XCircle,
  Zap,
} from 'lucide-react';

type FC<T = {}> = React.FC<T>;

// Additional icons imported above
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Type imports would be used in a full implementation

// Define ABTestConfiguration interface locally since it's not in the types file
interface ABTestConfiguration {
  id?: string;
  name: string;
  description?: string;
  formId: string;
  variants: Array<{
    id: string;
    name: string;
    formConfigId: string;
    trafficPercentage: number;
  }>;
  trafficSplit: number;
  duration: number;
  startDate?: string;
  endDate?: string;
  status?: 'draft' | 'running' | 'paused' | 'completed' | 'failed';
}

interface ABTestingManagerProps {
  formId: string;
  onCreateTest?: (config: ABTestConfiguration) => Promise<void>;
  onUpdateTest?: (
    testId: string,
    updates: Partial<ABTestConfiguration>
  ) => Promise<void>;
  onStartTest?: (testId: string) => Promise<void>;
  onStopTest?: (testId: string) => Promise<void>;
  onViewResults?: (testId: string) => void;
  className?: string;
}

interface ABTestSummary {
  id: string;
  name: string;
  status: 'draft' | 'running' | 'paused' | 'completed' | 'failed';
  variants: Array<{
    id: string;
    name: string;
    formConfigId: string;
    trafficPercentage: number;
  }>;
  metrics: {
    totalViews: number;
    totalSubmissions: number;
    conversionRate: number;
    statSignificance: number;
  };
  startDate?: string;
  endDate?: string;
  duration: number; // days
}

// Mock data for demonstration
const MOCK_AB_TESTS: ABTestSummary[] = [
  {
    id: 'test-1',
    name: 'Flight Search Form Optimization',
    status: 'running',
    variants: [
      {
        id: 'control',
        name: 'Control (Original)',
        formConfigId: 'flight-search-v1',
        trafficPercentage: 50,
      },
      {
        id: 'variant-a',
        name: 'Simplified Form',
        formConfigId: 'flight-search-v2',
        trafficPercentage: 50,
      },
    ],
    metrics: {
      totalViews: 2847,
      totalSubmissions: 1231,
      conversionRate: 43.2,
      statSignificance: 89.4,
    },
    startDate: '2025-01-01',
    duration: 14,
  },
  {
    id: 'test-2',
    name: 'Payment Form Layout Test',
    status: 'completed',
    variants: [
      {
        id: 'control',
        name: 'Single Page',
        formConfigId: 'payment-v1',
        trafficPercentage: 33,
      },
      {
        id: 'variant-a',
        name: 'Two Steps',
        formConfigId: 'payment-v2',
        trafficPercentage: 33,
      },
      {
        id: 'variant-b',
        name: 'Progressive',
        formConfigId: 'payment-v3',
        trafficPercentage: 34,
      },
    ],
    metrics: {
      totalViews: 5432,
      totalSubmissions: 4123,
      conversionRate: 75.9,
      statSignificance: 99.2,
    },
    startDate: '2024-12-15',
    endDate: '2024-12-29',
    duration: 14,
  },
];

// Form variants would be loaded dynamically in a real implementation
// const FORM_VARIANTS: FormConfiguration[] = [...]

export const ABTestingManager: FC<ABTestingManagerProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCreateTest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUpdateTest,
  onStartTest,
  onStopTest,
  onViewResults,
  className,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tests, setTests] = useState<ABTestSummary[]>(MOCK_AB_TESTS);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Get status color and icon
  const getStatusDisplay = (status: ABTestSummary['status']) => {
    switch (status) {
      case 'running':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <Play className="h-3 w-3" />,
          label: 'Running',
        };
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <CheckCircle className="h-3 w-3" />,
          label: 'Completed',
        };
      case 'paused':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Pause className="h-3 w-3" />,
          label: 'Paused',
        };
      case 'draft':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Settings className="h-3 w-3" />,
          label: 'Draft',
        };
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="h-3 w-3" />,
          label: 'Failed',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Settings className="h-3 w-3" />,
          label: 'Unknown',
        };
    }
  };

  // Get significance level color
  const getSignificanceColor = (significance: number) => {
    if (significance >= 95) return 'text-green-600';
    if (significance >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Handle test actions
  const handleStartTest = async (testId: string) => {
    if (onStartTest) {
      await onStartTest(testId);
    }
    // Update local state
    setTests(prev =>
      prev.map(test =>
        test.id === testId ? { ...test, status: 'running' as const } : test
      )
    );
  };

  const handleStopTest = async (testId: string) => {
    if (onStopTest) {
      await onStopTest(testId);
    }
    // Update local state
    setTests(prev =>
      prev.map(test =>
        test.id === testId ? { ...test, status: 'paused' as const } : test
      )
    );
  };

  return (
    <div className={cn('ab-testing-manager', className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">A/B Testing</h2>
            <p className="text-muted-foreground">
              Create and manage A/B tests for your dynamic forms
            </p>
          </div>

          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <TestTube className="h-4 w-4 mr-2" />
            New Test
          </Button>
        </div>

        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Tests
                </CardTitle>
                <TestTube className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tests.filter(t => t.status === 'running').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {tests.filter(t => t.status === 'paused').length} paused
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tests
                    .reduce((acc, test) => acc + test.metrics.totalViews, 0)
                    .toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all tests
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Conversion
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                    tests.reduce(
                      (acc, test) => acc + test.metrics.conversionRate,
                      0
                    ) / tests.length
                  ).toFixed(1)}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  Best:{' '}
                  {Math.max(
                    ...tests.map(t => t.metrics.conversionRate)
                  ).toFixed(1)}
                  %
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Significance
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tests.filter(t => t.metrics.statSignificance >= 95).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tests with 95%+ confidence
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Test List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Tests</h3>

            {tests.map(test => {
              const statusDisplay = getStatusDisplay(test.status);

              return (
                <Card
                  key={test.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-lg">{test.name}</h4>
                          <Badge
                            variant="outline"
                            className={cn(
                              'flex items-center gap-1',
                              statusDisplay.color
                            )}
                          >
                            {statusDisplay.icon}
                            {statusDisplay.label}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Views</p>
                            <p className="font-semibold">
                              {test.metrics.totalViews.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Submissions</p>
                            <p className="font-semibold">
                              {test.metrics.totalSubmissions.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Conversion Rate
                            </p>
                            <p className="font-semibold">
                              {test.metrics.conversionRate}%
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Significance
                            </p>
                            <p
                              className={cn(
                                'font-semibold',
                                getSignificanceColor(
                                  test.metrics.statSignificance
                                )
                              )}
                            >
                              {test.metrics.statSignificance}%
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {test.variants.map(variant => (
                            <Badge
                              key={variant.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {variant.name} ({variant.trafficPercentage}%)
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {test.status === 'running' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStopTest(test.id)}
                          >
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </Button>
                        )}

                        {(test.status === 'paused' ||
                          test.status === 'draft') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartTest(test.id)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewResults?.(test.id)}
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Results
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Test Results Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a test to view detailed results and analytics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>A/B Testing Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="default-duration">
                    Default Test Duration (days)
                  </Label>
                  <Input
                    id="default-duration"
                    type="number"
                    defaultValue="14"
                  />
                </div>
                <div>
                  <Label htmlFor="min-sample-size">Minimum Sample Size</Label>
                  <Input
                    id="min-sample-size"
                    type="number"
                    defaultValue="1000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="significance-threshold">
                  Significance Threshold
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="significance-threshold"
                    min={80}
                    max={99}
                    step={1}
                    defaultValue={[95]}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12">95%</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="auto-stop" />
                <Label htmlFor="auto-stop">
                  Auto-stop tests when significance threshold is reached
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="email-notifications" />
                <Label htmlFor="email-notifications">
                  Email notifications for test results
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ABTestingManager;
