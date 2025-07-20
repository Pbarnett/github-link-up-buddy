
/**
 * Address Group Field Component
 * 
 * Renders a grouped address input with multiple fields
 */

import * as React from 'react';
type Component<P = {}, S = {}> = React.Component<P, S>;
type FC<T = {}> = React.FC<T>;

import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CountrySelectField } from './CountrySelectField';

interface AddressValue {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddressGroupFieldProps {
  value?: AddressValue;
  onChange: (value: AddressValue) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const AddressGroupField: FC<AddressGroupFieldProps> = ({
  value = {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  },
  onChange,
  disabled = false,
  error,
  className
}) => {
  const handleFieldChange = (field: keyof AddressValue, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <Label className="text-sm font-medium">Address</Label>
      </div>

      {/* Street Address */}
      <div className="space-y-2">
        <Label htmlFor="street" className="text-sm">
          Street Address
        </Label>
        <Input
          id="street"
          value={value.street}
          onChange={(e) => handleFieldChange('street', e.target.value)}
          placeholder="Enter street address"
          disabled={disabled}
          className={cn(error && "border-destructive")}
        />
      </div>

      {/* City and State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm">
            City
          </Label>
          <Input
            id="city"
            value={value.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            placeholder="Enter city"
            disabled={disabled}
            className={cn(error && "border-destructive")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-sm">
            State/Province
          </Label>
          <Input
            id="state"
            value={value.state}
            onChange={(e) => handleFieldChange('state', e.target.value)}
            placeholder="Enter state or province"
            disabled={disabled}
            className={cn(error && "border-destructive")}
          />
        </div>
      </div>

      {/* Zip Code and Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode" className="text-sm">
            ZIP/Postal Code
          </Label>
          <Input
            id="zipCode"
            value={value.zipCode}
            onChange={(e) => handleFieldChange('zipCode', e.target.value)}
            placeholder="Enter ZIP or postal code"
            disabled={disabled}
            className={cn(error && "border-destructive")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm">
            Country
          </Label>
          <CountrySelectField
            value={value.country}
            onChange={(countryCode) => handleFieldChange('country', countryCode)}
            placeholder="Select country"
            disabled={disabled}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};
