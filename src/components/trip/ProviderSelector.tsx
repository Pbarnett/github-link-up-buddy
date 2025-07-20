
/**
 * @file Provider selector component for choosing flight search providers
 * Battle-tested approach with feature flags and user preferences
 */

import * as React from 'react';
type FC<T = {}> = React.FC<T>;

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Info, Zap, Globe, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type FlightProvider = 'amadeus' | 'duffel' | 'both';

export interface ProviderSelectorProps {
  selectedProvider: FlightProvider;
  onProviderChange: (provider: FlightProvider) => void;
  disabled?: boolean;
  showDescription?: boolean;
  className?: string;
}

const providerInfo = {
  amadeus: {
    name: 'Amadeus',
    description: 'External booking - redirects to airline websites',
    features: ['Wide airline coverage', 'External checkout', 'Quick search'],
    icon: <Globe className="h-4 w-4" />,
    badge: 'External',
    badgeVariant: 'secondary' as const
  },
  duffel: {
    name: 'Duffel',
    description: 'Direct booking - book instantly with saved traveler info',
    features: ['Instant booking', 'Auto-booking support', 'Saved payment methods'],
    icon: <Zap className="h-4 w-4" />,
    badge: 'Direct',
    badgeVariant: 'default' as const
  },
  both: {
    name: 'Both Providers',
    description: 'Search both sources for the best deals and options',
    features: ['Maximum coverage', 'Best pricing', 'More options'],
    icon: <Clock className="h-4 w-4" />,
    badge: 'Recommended',
    badgeVariant: 'default' as const
  }
};

export const ProviderSelector: FC<ProviderSelectorProps> = ({
  selectedProvider,
  onProviderChange,
  disabled = false,
  showDescription = true,
  className = ''
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Flight Search Provider
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <RadioGroup
          value={selectedProvider}
          onValueChange={(value) => onProviderChange(value as FlightProvider)}
          disabled={disabled}
          className="space-y-4"
        >
          {Object.entries(providerInfo).map(([key, info]) => (
            <div
              key={key}
              className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
                selectedProvider === key
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <RadioGroupItem
                value={key}
                id={key}
                className="mt-1"
                disabled={disabled}
              />
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor={key} className="flex items-center gap-2 font-medium cursor-pointer">
                    {info.icon}
                    {info.name}
                  </Label>
                  <Badge variant={info.badgeVariant}>{info.badge}</Badge>
                </div>
                
                {showDescription && (
                  <>
                    <p className="text-sm text-gray-600">{info.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {info.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </RadioGroup>
        
        {showDescription && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-start gap-2 text-xs text-gray-600">
                    <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Tip:</strong> Choose "Both Providers" for maximum flight options and competitive pricing. 
                      Auto-booking is only available with Duffel provider.
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="max-w-xs">
                    <p className="text-sm">
                      Amadeus provides wider coverage but requires external booking.
                      Duffel enables instant booking and auto-booking features.
                      Both providers gives you the best of both worlds.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Compact version for inline use in forms
 */
export const ProviderSelectorCompact: FC<ProviderSelectorProps> = ({
  selectedProvider,
  onProviderChange,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium">Search Provider</Label>
      <RadioGroup
        value={selectedProvider}
        onValueChange={(value) => onProviderChange(value as FlightProvider)}
        disabled={disabled}
        className="flex flex-row space-x-4"
      >
        {Object.entries(providerInfo).map(([key, info]) => (
          <div key={key} className="flex items-center space-x-2">
            <RadioGroupItem
              value={key}
              id={`compact-${key}`}
              disabled={disabled}
            />
            <Label
              htmlFor={`compact-${key}`}
              className="flex items-center gap-1 text-sm cursor-pointer"
            >
              {info.icon}
              {info.name}
              <Badge variant={info.badgeVariant} className="text-xs">
                {info.badge}
              </Badge>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ProviderSelector;
