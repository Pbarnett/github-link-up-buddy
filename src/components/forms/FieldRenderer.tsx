/**
 * Field Renderer Component
 * 
 * Renders individual form fields based on their type configuration
 * Supports all field types defined in the dynamic forms system
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import type {
  FieldConfiguration,
  FieldRendererProps
} from '@/types/dynamic-forms';

// Field-specific components
import { DateField } from './fields/DateField';
import { DateRangeField } from './fields/DateRangeField';
import { AirportAutocompleteField } from './fields/AirportAutocompleteField';
import { CountrySelectField } from './fields/CountrySelectField';
import { PhoneInputField } from './fields/PhoneInputField';
import { AddressGroupField } from './fields/AddressGroupField';

interface FieldRendererInternalProps extends Omit<FieldRendererProps, 'onChange'> {
  fieldIndex: number;
  sectionIndex: number;
  touched?: boolean;
  isValid?: boolean;
  onChange: (value: unknown) => void;
}

export const FieldRenderer: React.FC<FieldRendererInternalProps> = ({
  field,
  fieldIndex: _fieldIndex,
  sectionIndex: _sectionIndex,
  value,
  error,
  touched: _touched,
  onChange,
  disabled = false,
  isValid: _isValid = true,
  className
}) => {
  // Mark unused parameters as intentionally unused
  void _fieldIndex;
  void _sectionIndex;
  void _touched;
  void _isValid;
  
  const form = useFormContext();

  // Handle special field types that don't need FormField wrapper
  if (field.type === 'section-header') {
    return (
      <div className={cn("form-field-header", className)}>
        <h3 className="text-lg font-semibold text-foreground">
          {field.label}
        </h3>
        {field.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {field.description}
          </p>
        )}
      </div>
    );
  }

  if (field.type === 'divider') {
    return (
      <div className={cn("form-field-divider border-t pt-4 mt-4", className)} />
    );
  }

  // Render regular form field
  return (
    <FormField
      control={form.control}
      name={field.id}
      render={({ field: formField }) => (
        <FormItem className={cn("form-field", className, field.className)}>
          {field.label && field.type !== 'checkbox' && (
            <FormLabel className={cn(
              "form-field-label",
              field.validation?.required && "after:content-['*'] after:text-destructive after:ml-1"
            )}>
              {field.label}
            </FormLabel>
          )}
          
          <FormControl>
            <FieldInput
              field={field}
              formField={formField}
              value={value}
              onChange={onChange}
              disabled={disabled}
              error={error}
            />
          </FormControl>

          {field.description && (
            <FormDescription className="form-field-description">
              {field.description}
            </FormDescription>
          )}

          <FormMessage className="form-field-error" />
        </FormItem>
      )}
    />
  );
};

/**
 * Field Input Component - renders the actual input based on field type
 */
interface FieldInputProps {
  field: FieldConfiguration;
  formField: {
    onChange: (value: unknown) => void;
    value: unknown;
    name: string;
    onBlur: () => void;
  };
  value: unknown;
  onChange: (value: unknown) => void;
  disabled: boolean;
  error?: string;
}

const FieldInput: React.FC<FieldInputProps> = ({
  field,
  formField,
  value,
  onChange,
  disabled,
  error
}) => {
  const handleChange = (newValue: unknown) => {
    formField.onChange(newValue);
    onChange(newValue);
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
      return (
        <Input
          name={formField.name}
          onBlur={formField.onBlur}
          value={typeof value === 'string' || typeof value === 'number' ? value : ''}
          type={field.type === 'number' ? 'number' : field.type}
          placeholder={field.placeholder}
          disabled={disabled}
          onChange={(e) => handleChange(
            field.type === 'number' ? Number(e.target.value) : e.target.value
          )}
          className={cn(error && "border-destructive")}
        />
      );

    case 'textarea':
      return (
        <Textarea
          name={formField.name}
          onBlur={formField.onBlur}
          value={typeof value === 'string' ? value : ''}
          placeholder={field.placeholder}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.value)}
          className={cn(error && "border-destructive")}
          rows={4}
        />
      );

    case 'select':
      return (
        <Select
          onValueChange={handleChange}
          value={typeof value === 'string' ? value : ''}
          disabled={disabled}
        >
          <SelectTrigger className={cn(error && "border-destructive")}>
            <SelectValue placeholder={field.placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem 
                key={option.value.toString()} 
                value={option.value.toString()}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'checkbox':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            name={formField.name}
            onBlur={formField.onBlur}
            checked={typeof value === 'boolean' ? value : false}
            onCheckedChange={handleChange}
            disabled={disabled}
            className={cn(error && "border-destructive")}
          />
          {field.label && (
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {field.label}
            </label>
          )}
        </div>
      );

    case 'switch':
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={typeof value === 'boolean' ? value : false}
            onCheckedChange={handleChange}
            disabled={disabled}
          />
          {field.label && (
            <label className="text-sm font-medium leading-none">
              {field.label}
            </label>
          )}
        </div>
      );

    case 'slider':
      return (
        <div className="space-y-2">
          <Slider
            value={[typeof value === 'number' ? value : (field.validation?.min || 0)]}
            onValueChange={(values) => handleChange(values[0])}
            max={field.validation?.max || 100}
            min={field.validation?.min || 0}
            step={1}
            disabled={disabled}
            className={cn(error && "border-destructive")}
          />
          <div className="text-sm text-muted-foreground text-center">
            {typeof value === 'number' ? value : (field.validation?.min || 0)}
          </div>
        </div>
      );

    case 'phone':
      return (
        <PhoneInputField
          value={typeof value === 'string' ? value : ''}
          onChange={handleChange}
          placeholder={field.placeholder}
          disabled={disabled}
          error={error}
        />
      );

    case 'date':
      return (
        <DateField
          value={typeof value === 'string' ? value : ''}
          onChange={handleChange}
          placeholder={field.placeholder}
          disabled={disabled}
          error={error}
        />
      );

    case 'date-range':
    case 'date-range-flexible':
      return (
        <DateRangeField
          value={value}
          onChange={handleChange}
          placeholder={field.placeholder}
          disabled={disabled}
          error={error}
          flexible={field.type === 'date-range-flexible'}
        />
      );

    case 'airport-autocomplete':
      return (
        <AirportAutocompleteField
          value={value}
          onChange={handleChange}
          placeholder={field.placeholder}
          disabled={disabled}
          error={error}
          apiIntegration={field.apiIntegration}
        />
      );

    case 'country-select':
      return (
        <CountrySelectField
          value={typeof value === 'string' ? value : ''}
          onChange={handleChange}
          placeholder={field.placeholder}
          disabled={disabled}
          error={error}
        />
      );

    case 'address-group':
      return (
        <AddressGroupField
          value={value}
          onChange={handleChange}
          disabled={disabled}
          error={error}
        />
      );

    case 'multi-select':
      return (
        <div className="space-y-2">
          {field.options?.map((option) => (
            <div key={option.value.toString()} className="flex items-center space-x-2">
              <Checkbox
                checked={Array.isArray(value) && value.includes(option.value)}
                onCheckedChange={(checked) => {
                  const currentValues = Array.isArray(value) ? value : [];
                  if (checked) {
                    handleChange([...currentValues, option.value]);
                  } else {
                    handleChange(currentValues.filter(v => v !== option.value));
                  }
                }}
                disabled={disabled || option.disabled}
              />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      );

    case 'radio':
      return (
        <RadioGroup
          value={value?.toString()}
          onValueChange={handleChange}
          disabled={disabled}
        >
          {field.options?.map((option) => (
            <div key={option.value.toString()} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value.toString()}
                disabled={option.disabled}
              />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {option.label}
              </label>
            </div>
          ))}
        </RadioGroup>
      );

    case 'rating':
      return (
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              type="button"
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${
                typeof value === 'number' && value >= star
                  ? 'text-yellow-500 hover:text-yellow-600'
                  : 'text-gray-300 hover:text-gray-400'
              }`}
              onClick={() => handleChange(star)}
              disabled={disabled}
            >
              ⭐
            </Button>
          ))}
          {typeof value === 'number' && value > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">
              {value} of 5 stars
            </span>
          )}
        </div>
      );

    default:
      // Fallback to text input for unknown types
      console.warn(`Unknown field type: ${field.type}. Falling back to text input.`);
      return (
        <Input
          name={formField.name}
          onBlur={formField.onBlur}
          value={typeof value === 'string' ? value : ''}
          placeholder={field.placeholder}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.value)}
          className={cn(error && "border-destructive")}
        />
      );
  }
};

export default FieldRenderer;
