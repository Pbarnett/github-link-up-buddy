type FC<T = {}> = React.FC<T>;
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LaunchDarklyService from '@/lib/featureFlags/launchDarklyService';

// Known flag definitions for development
const KNOWN_FLAGS = {
  // Core feature flags
  personalization_greeting: {
    type: 'boolean',
    default: false,
    description: 'Enable personalized greeting messages',
  },
  show_opt_out_banner: {
    type: 'boolean',
    default: false,
    description: 'Show opt-out banner for data collection',
  },
  profile_ui_revamp: {
    type: 'boolean',
    default: false,
    description: 'Enable new profile UI design',
  },
  wallet_ui: {
    type: 'boolean',
    default: false,
    description: 'Enable wallet interface and functionality',
  },
  enhanced_launchdarkly_resilience: {
    type: 'boolean',
    default: false,
    description: 'Enable enhanced LaunchDarkly resilience features',
  },
  // Additional flags that may be added
  payment_methods_v2: {
    type: 'boolean',
    default: false,
    description: 'Enable new payment methods interface',
  },
  ai_recommendations: {
    type: 'boolean',
    default: false,
    description: 'Enable AI-powered travel recommendations',
  },
  dark_mode: {
    type: 'boolean',
    default: false,
    description: 'Enable dark mode theme',
  },
  beta_features: {
    type: 'boolean',
    default: false,
    description: 'Enable beta features for testing',
  },
};

type FlagValue = boolean | string | number;

interface FlagOverride {
  key: string;
  value: FlagValue;
  type: 'boolean' | 'string' | 'number';
  description?: string;
}

interface FlagOverridePanelProps {
  className?: string;
}

export const FlagOverridePanel: FC<FlagOverridePanelProps> = ({
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [overrides, setOverrides] = useState<FlagOverride[]>([]);
  const [newFlagKey, setNewFlagKey] = useState('');
  const [newFlagValue, setNewFlagValue] = useState('');
  const [newFlagType, setNewFlagType] = useState<
    'boolean' | 'string' | 'number'
  >('boolean');
  const [importData, setImportData] = useState('');
  const [showImport, setShowImport] = useState(false);

  const loadOverrides = useCallback(() => {
    const savedOverrides: FlagOverride[] = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('launchDarkly_override_')) {
          const flagKey = key.replace('launchDarkly_override_', '');
          const value = localStorage.getItem(key);
          if (value !== null) {
            try {
              const parsedValue = JSON.parse(value);
              const flagInfo = KNOWN_FLAGS[flagKey as keyof typeof KNOWN_FLAGS];
              savedOverrides.push({
                key: flagKey,
                value: parsedValue,
                type: (flagInfo?.type || inferType(parsedValue)) as
                  | 'string'
                  | 'number'
                  | 'boolean',
                description: flagInfo?.description,
              });
            } catch (_e) {
              console.warn(`Invalid override value for ${flagKey}:`, value);
            }
          }
        }
      });
    }
    setOverrides(savedOverrides);
  }, []);

  // Load existing overrides on component mount
  useEffect(() => {
    loadOverrides();
  }, [loadOverrides]);

  const inferType = (value: unknown): 'boolean' | 'string' | 'number' => {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    return 'string';
  };

  const addOverride = () => {
    if (!newFlagKey.trim()) return;

    let processedValue: FlagValue;
    switch (newFlagType) {
      case 'boolean':
        processedValue = newFlagValue.toLowerCase() === 'true';
        break;
      case 'number':
        processedValue = parseFloat(newFlagValue) || 0;
        break;
      default:
        processedValue = newFlagValue;
    }

    const flagInfo = KNOWN_FLAGS[newFlagKey as keyof typeof KNOWN_FLAGS];
    LaunchDarklyService.setDeveloperOverride(newFlagKey, processedValue);

    const newOverride: FlagOverride = {
      key: newFlagKey,
      value: processedValue,
      type: newFlagType,
      description: flagInfo?.description,
    };

    setOverrides(prev => [
      ...prev.filter(o => o.key !== newFlagKey),
      newOverride,
    ]);
    setNewFlagKey('');
    setNewFlagValue('');
    setNewFlagType('boolean');
  };

  const removeOverride = (key: string) => {
    LaunchDarklyService.clearDeveloperOverride(key);
    setOverrides(prev => prev.filter(o => o.key !== key));
  };

  const updateOverride = (key: string, value: FlagValue) => {
    LaunchDarklyService.setDeveloperOverride(key, value);
    setOverrides(prev => prev.map(o => (o.key === key ? { ...o, value } : o)));
  };

  const clearAllOverrides = () => {
    LaunchDarklyService.clearAllDeveloperOverrides();
    setOverrides([]);
  };

  const exportOverrides = () => {
    const exportData = overrides.reduce(
      (acc, override) => {
        acc[override.key] = override.value;
        return acc;
      },
      {} as Record<string, FlagValue>
    );

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flag-overrides.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importOverrides = () => {
    try {
      const data = JSON.parse(importData);
      Object.entries(data).forEach(([key, value]) => {
        LaunchDarklyService.setDeveloperOverride(key, value as FlagValue);
      });
      loadOverrides();
      setImportData('');
      setShowImport(false);
    } catch (_e) {
      alert('Invalid JSON format');
    }
  };

  const addKnownFlag = (flagKey: string) => {
    const flagInfo = KNOWN_FLAGS[flagKey as keyof typeof KNOWN_FLAGS];
    if (flagInfo) {
      LaunchDarklyService.setDeveloperOverride(flagKey, flagInfo.default);
      loadOverrides();
    }
  };

  const toggleBooleanFlag = (key: string, currentValue: boolean) => {
    updateOverride(key, !currentValue);
  };

  // Only show in development mode
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="mb-2 shadow-lg bg-background border-2 border-orange-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Feature Flags
            {overrides.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {overrides.length}
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Card className="w-96 shadow-lg border-2 border-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                LaunchDarkly Dev Tools
              </CardTitle>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Development mode only. Override feature flags for testing.
                </AlertDescription>
              </Alert>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Current Overrides */}
              {overrides.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Active Overrides
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllOverrides}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {overrides.map(override => (
                      <div
                        key={override.key}
                        className="p-3 bg-muted rounded border"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-sm">
                            {override.key}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOverride(override.key)}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        {override.description && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {override.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2">
                          {override.type === 'boolean' ? (
                            <Switch
                              checked={override.value as boolean}
                              onCheckedChange={_checked =>
                                toggleBooleanFlag(
                                  override.key,
                                  override.value as boolean
                                )
                              }
                            />
                          ) : (
                            <Input
                              value={String(override.value)}
                              onChange={e =>
                                updateOverride(
                                  override.key,
                                  override.type === 'number'
                                    ? parseFloat(
                                        (e.target as HTMLInputElement).value
                                      ) || 0
                                    : (e.target as HTMLInputElement).value
                                )
                              }
                              className="h-8 text-sm"
                            />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {override.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Override */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Add Override</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Flag key"
                    value={newFlagKey}
                    onChange={e =>
                      setNewFlagKey((e.target as HTMLInputElement).value)
                    }
                    className="flex-1"
                  />
                  <Select
                    value={newFlagType}
                    onValueChange={(value: 'boolean' | 'string' | 'number') =>
                      setNewFlagType(value)
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boolean">Bool</SelectItem>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder={
                      newFlagType === 'boolean' ? 'true/false' : 'Value'
                    }
                    value={newFlagValue}
                    onChange={e =>
                      setNewFlagValue((e.target as HTMLInputElement).value)
                    }
                    className="flex-1"
                  />
                  <Button onClick={addOverride} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Known Flags */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Known Flags</Label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {Object.entries(KNOWN_FLAGS).map(([key, info]) => {
                    const isOverridden = overrides.some(o => o.key === key);
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-xs truncate">
                            {key}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {info.description}
                          </div>
                        </div>
                        {!isOverridden && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addKnownFlag(key)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Import/Export */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportOverrides}
                  disabled={overrides.length === 0}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImport(!showImport)}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Import
                </Button>
              </div>

              {showImport && (
                <div className="space-y-2">
                  <Label className="text-sm">Import JSON</Label>
                  <Textarea
                    placeholder='{"flag_key": true, "another_flag": "value"}'
                    value={importData}
                    onChange={e =>
                      setImportData((e.target as HTMLInputElement).value)
                    }
                    className="h-20 text-sm font-mono"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={importOverrides}
                      size="sm"
                      className="flex-1"
                    >
                      Import
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowImport(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Warning */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Changes take effect immediately. Refresh page to clear all
                  overrides.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FlagOverridePanel;
