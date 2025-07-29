/**
 * Form State Debugger
 * 
 * Advanced debugging tool for form development with real-time state inspection,
 * validation tracking, and performance monitoring
 */

import React, { useState, useEffect, useRef } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bug, 
  Eye, 
  EyeOff, 
  Copy, 
  Download, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity
} from 'lucide-react';

interface FormStateDebuggerProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  validationState?: any; // From useProgressiveValidation
  loadingStates?: any; // From useLoadingStates
  retryStates?: any; // From retry system
  enabled?: boolean;
  position?: 'floating' | 'inline';
  minimized?: boolean;
}

interface ValidationEvent {
  timestamp: number;
  field: string;
  value: any;
  error?: string;
  isValid: boolean;
}

interface PerformanceMetrics {
  renderCount: number;
  validationTime: number;
  lastRenderTime: number;
  averageRenderTime: number;
}

export function FormStateDebugger<T extends FieldValues>({
  form,
  validationState,
  loadingStates,
  retryStates,
  enabled = process.env.NODE_ENV === 'development',
  position = 'floating',
  minimized: initialMinimized = true,
}: FormStateDebuggerProps<T>) {
  const [isVisible, setIsVisible] = useState(enabled);
  const [minimized, setMinimized] = useState(initialMinimized);
  const [validationEvents, setValidationEvents] = useState<ValidationEvent[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    validationTime: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
  });

  const renderStartTime = useRef<number>(0);
  const renderTimes = useRef<number[]>([]);

  // Track render performance
  useEffect(() => {
    renderStartTime.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      renderTimes.current.push(renderTime);
      
      // Keep only last 100 render times
      if (renderTimes.current.length > 100) {
        renderTimes.current = renderTimes.current.slice(-100);
      }

      setPerformanceMetrics(prev => ({
        renderCount: prev.renderCount + 1,
        validationTime: prev.validationTime,
        lastRenderTime: renderTime,
        averageRenderTime: renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length,
      }));
    };
  });

  // Track validation events
  useEffect(() => {
    if (!form.formState.errors) return;

    const errors = form.formState.errors;
    const values = form.getValues();

    Object.entries(errors).forEach(([field, error]) => {
      const event: ValidationEvent = {
        timestamp: Date.now(),
        field,
        value: values[field],
        error: error?.message as string,
        isValid: false,
      };

      setValidationEvents(prev => [event, ...prev.slice(0, 49)]); // Keep last 50 events
    });
  }, [form.formState.errors, form]);

  // Export debug data
  const exportDebugData = () => {
    const debugData = {
      timestamp: new Date().toISOString(),
      formState: form.formState,
      formValues: form.getValues(),
      validationState,
      loadingStates,
      retryStates,
      validationEvents,
      performanceMetrics,
    };

    const blob = new Blob([JSON.stringify(debugData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-debug-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy debug data to clipboard
  const copyDebugData = async () => {
    const debugData = {
      formState: form.formState,
      formValues: form.getValues(),
      validationState,
      performanceMetrics,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(debugData, null, 2));
      // Could show a toast here
    } catch (error) {
      console.error('Failed to copy debug data:', error);
    }
  };

  // Clear validation events
  const clearValidationEvents = () => {
    setValidationEvents([]);
  };

  if (!enabled || !isVisible) {
    return enabled ? (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700"
        size="sm"
      >
        <Bug className="h-4 w-4" />
      </Button>
    ) : null;
  }

  const containerClasses = position === 'floating'
    ? "fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] shadow-2xl"
    : "w-full max-w-4xl mx-auto mt-8";

  return (
    <Card className={containerClasses}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bug className="h-4 w-4 text-purple-600" />
            Form Debugger
            <Badge variant="outline" className="text-xs">
              {form.formState.isValid ? 'Valid' : 'Invalid'}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              onClick={() => setMinimized(!minimized)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              {minimized ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <XCircle className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!minimized && (
        <CardContent className="pt-0">
          <Tabs defaultValue="state" className="w-full">
            <TabsList className="grid w-full grid-cols-5 text-xs">
              <TabsTrigger value="state">State</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
              <TabsTrigger value="loading">Loading</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="state" className="mt-4 max-h-64 overflow-y-auto">
              <div className="space-y-3">
                <FormStateSection
                  title="Form State"
                  data={form.formState}
                  highlight={['isValid', 'isDirty', 'isSubmitting']}
                />
                <FormStateSection
                  title="Form Values"
                  data={form.getValues()}
                  collapsible
                />
                {form.formState.errors && Object.keys(form.formState.errors).length > 0 && (
                  <FormStateSection
                    title="Errors"
                    data={form.formState.errors}
                    highlight={['message']}
                    variant="error"
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="validation" className="mt-4 max-h-64 overflow-y-auto">
              <div className="space-y-3">
                {validationState && (
                  <FormStateSection
                    title="Validation State"
                    data={validationState}
                    highlight={['hasAttemptedSubmit', 'isSubmitting']}
                  />
                )}
                <div className="text-xs text-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Field States:</span>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs bg-green-50">
                        <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                        Valid
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-red-50">
                        <XCircle className="h-3 w-3 mr-1 text-red-600" />
                        Invalid
                      </Badge>
                    </div>
                  </div>
                  {Object.entries(form.formState.touchedFields).map(([field, touched]) => (
                    <div key={field} className="flex items-center justify-between py-1">
                      <span className="font-mono">{field}</span>
                      <div className="flex items-center gap-2">
                        {touched && <Badge variant="outline" className="text-xs">Touched</Badge>}
                        {form.formState.errors[field] ? (
                          <XCircle className="h-3 w-3 text-red-500" />
                        ) : (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="loading" className="mt-4 max-h-64 overflow-y-auto">
              <div className="space-y-3">
                {loadingStates && (
                  <FormStateSection
                    title="Loading Operations"
                    data={loadingStates.operations}
                    highlight={['isLoading', 'progress', 'currentStage']}
                  />
                )}
                {retryStates && (
                  <FormStateSection
                    title="Retry States"
                    data={retryStates}
                    highlight={['failures', 'state']}
                    variant="warning"
                  />
                )}
                {(!loadingStates && !retryStates) && (
                  <div className="text-xs text-gray-500 text-center py-4">
                    No loading or retry state available
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-4 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Validation Events</span>
                  <Button
                    onClick={clearValidationEvents}
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
                {validationEvents.length === 0 ? (
                  <div className="text-xs text-gray-500 text-center py-4">
                    No validation events yet
                  </div>
                ) : (
                  validationEvents.map((event, index) => (
                    <div
                      key={index}
                      className="p-2 rounded border text-xs bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-medium">{event.field}</span>
                        <span className="text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.isValid ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span className="flex-1 truncate">
                          {event.error || 'Valid'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-4 max-h-64 overflow-y-auto">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-2 rounded border bg-blue-50">
                    <div className="flex items-center gap-1 mb-1">
                      <Activity className="h-3 w-3 text-blue-600" />
                      <span className="font-medium">Renders</span>
                    </div>
                    <div className="text-lg font-mono">{performanceMetrics.renderCount}</div>
                  </div>
                  <div className="p-2 rounded border bg-green-50">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="h-3 w-3 text-green-600" />
                      <span className="font-medium">Avg Render</span>
                    </div>
                    <div className="text-lg font-mono">
                      {performanceMetrics.averageRenderTime.toFixed(2)}ms
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  <div>Last render: {performanceMetrics.lastRenderTime.toFixed(2)}ms</div>
                  <div>Total validation time: {performanceMetrics.validationTime}ms</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-4 pt-3 border-t">
            <Button
              onClick={copyDebugData}
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
            <Button
              onClick={exportDebugData}
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// Helper component for displaying form state sections
interface FormStateSectionProps {
  title: string;
  data: any;
  highlight?: string[];
  collapsible?: boolean;
  variant?: 'default' | 'error' | 'warning';
}

function FormStateSection({ 
  title, 
  data, 
  highlight = [], 
  collapsible = false, 
  variant = 'default' 
}: FormStateSectionProps) {
  const [collapsed, setCollapsed] = useState(collapsible);

  const variantClasses = {
    default: 'bg-gray-50 border-gray-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
  };

  return (
    <div className={`p-2 rounded border text-xs ${variantClasses[variant]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{title}</span>
        {collapsible && (
          <Button
            onClick={() => setCollapsed(!collapsed)}
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
          >
            {collapsed ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          </Button>
        )}
      </div>
      {!collapsed && (
        <pre className="whitespace-pre-wrap font-mono text-xs overflow-x-auto">
          {typeof data === 'object' 
            ? JSON.stringify(data, (key, value) => {
                // Highlight specific keys
                if (highlight.includes(key)) {
                  return `🔸 ${value}`;
                }
                return value;
              }, 2)
            : String(data)
          }
        </pre>
      )}
    </div>
  );
}
