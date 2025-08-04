/**
 * Auto-Booking Card Component
 * Provides UI for configuring and monitoring auto-booking for flight trips
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Plane, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Settings,
  Play,
  Square
} from 'lucide-react';
import { useAutoBoobing, AutoBookingConfig, AutoBookingStatus } from '../hooks/useAutoBoobing';

interface AutoBookingCardProps {
  tripRequestId: string;
  currentBudget?: number;
  currency?: string;
  className?: string;
}

export function AutoBookingCard({ 
  tripRequestId, 
  currentBudget, 
  currency = 'USD',
  className 
}: AutoBookingCardProps) {
  const {
    isEnabled: featureEnabled,
    status,
    config,
    enableAutoBoobing,
    disableAutoBoobing,
    updateConfig,
    refreshStatus,
    canEnableAutoBoobing
  } = useAutoBoobing(tripRequestId);

  const [showConfig, setShowConfig] = useState(false);
  const [tempConfig, setTempConfig] = useState<AutoBookingConfig>({
    enabled: false,
    maxPrice: currentBudget,
    cabinClass: 'economy',
    maxStops: 1,
    bagsRequired: false
  });

  const handleEnableAutoBoobing = async () => {
    const success = await enableAutoBoobing(tripRequestId, tempConfig);
    if (success) {
      setShowConfig(false);
    }
  };

  const handleDisableAutoBoobing = async () => {
    await disableAutoBoobing(tripRequestId);
  };

  const getStatusIcon = (status: AutoBookingStatus['status']) => {
    switch (status) {
      case 'searching':
        return <Plane className="h-4 w-4 animate-spin" />;
      case 'monitoring':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'booking':
        return <Plane className="h-4 w-4 animate-bounce text-orange-600" />;
      case 'booked':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Settings className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: AutoBookingStatus['status']) => {
    const variants = {
      idle: 'secondary',
      searching: 'default',
      monitoring: 'default',
      booking: 'default',
      booked: 'success' as any,
      failed: 'destructive'
    };

    const labels = {
      idle: 'Not Active',
      searching: 'Searching Flights',
      monitoring: 'Monitoring Prices',
      booking: 'Booking in Progress',
      booked: 'Successfully Booked',
      failed: 'Failed'
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {getStatusIcon(status)}
        <span className="ml-2">{labels[status]}</span>
      </Badge>
    );
  };

  const getProgressValue = (status: AutoBookingStatus['status']) => {
    switch (status) {
      case 'searching': return 25;
      case 'monitoring': return 50;
      case 'booking': return 80;
      case 'booked': return 100;
      case 'failed': return 0;
      default: return 0;
    }
  };

  if (!featureEnabled) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-500">
            Auto-Booking
          </CardTitle>
          <CardDescription>
            Feature not available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <AlertTriangle className="h-4 w-4" />
            <span>Auto-booking is currently disabled</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Auto-Booking
            </CardTitle>
            <CardDescription>
              Automatically book when conditions are met
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(status.status)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {config.enabled && status.status !== 'idle' && status.status !== 'failed' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{getProgressValue(status.status)}%</span>
            </div>
            <Progress value={getProgressValue(status.status)} className="h-2" />
          </div>
        )}

        {/* Current Status Info */}
        {config.enabled && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {status.currentPrice && (
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span>
                  Current: {currency} {status.currentPrice}
                </span>
              </div>
            )}
            {config.maxPrice && (
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-600" />
                <span>
                  Max: {currency} {config.maxPrice}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {status.error && (
          <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
            <XCircle className="h-4 w-4" />
            <span>{status.error}</span>
          </div>
        )}

        {/* Configuration Section */}
        {!config.enabled && (
          <div className="space-y-4">
            {!showConfig ? (
              <Button 
                onClick={() => setShowConfig(true)}
                className="w-full"
                disabled={!canEnableAutoBoobing}
              >
                <Play className="h-4 w-4 mr-2" />
                Set Up Auto-Booking
              </Button>
            ) : (
              <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Auto-Booking Settings</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfig(false)}
                  >
                    Cancel
                  </Button>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxPrice">Maximum Price ({currency})</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      value={tempConfig.maxPrice || ''}
                      onChange={(e) => setTempConfig(prev => ({
                        ...prev,
                        maxPrice: parseFloat(e.target.value) || undefined
                      }))}
                      placeholder={currentBudget?.toString() || '0'}
                    />
                    <p className="text-xs text-gray-600">
                      We'll book when we find flights at or below this price
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxStops">Maximum Stops</Label>
                    <select
                      id="maxStops"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={tempConfig.maxStops || 0}
                      onChange={(e) => setTempConfig(prev => ({
                        ...prev,
                        maxStops: parseInt(e.target.value)
                      }))}
                    >
                      <option value={0}>Non-stop only</option>
                      <option value={1}>Up to 1 stop</option>
                      <option value={2}>Up to 2 stops</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="bagsRequired">Checked bags required</Label>
                    <Switch
                      id="bagsRequired"
                      checked={tempConfig.bagsRequired || false}
                      onCheckedChange={(checked) => setTempConfig(prev => ({
                        ...prev,
                        bagsRequired: checked
                      }))}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleEnableAutoBoobing}
                  className="w-full"
                  disabled={!tempConfig.maxPrice}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Auto-Booking
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Active Auto-Booking Controls */}
        {config.enabled && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshStatus}
            >
              Refresh Status
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDisableAutoBoobing}
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Auto-Booking
            </Button>
          </div>
        )}

        {/* Success Message */}
        {status.status === 'booked' && (
          <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
            <CheckCircle className="h-4 w-4" />
            <span>Your flight has been automatically booked!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
