

/**
 * Dynamic Field Renderer
 *
 * Renders individual form fields based on their configuration
 * Supports all field types and handles conditional logic
 */

type FC<T = {}> = React.FC<T>;

import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,

import type {
  FieldConfiguration,
  FormConfiguration,

// Import specialized field components
./DateField';
./DateRangeField';
./AirportAutocompleteField';
./CountrySelectField';
./PhoneInputField';
./AddressGroupField';

export interface DynamicFieldRendererProps {
  /** Field configuration */
  field: FieldConfiguration;
  /** Current field value */
  value?: unknown;
  /** Field change handler */
  onChange: (value: unknown) => void;
  /** Field blur handler */
  onBlur?: () => void;
  /** Validation error message */
  error?: string;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Whether field is required */
  required?: boolean;
  /** Form configuration for context */
  config?: FormConfiguration;
  /** Full form data for conditional logic */
  formData?: Record<string, unknown>;
  /** Additional CSS classes */
  className?: string;
}

export const DynamicFieldRenderer: FC<DynamicFieldRendererProps> = ({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  config: _config,
  formData: _formData,
  className,
}) => {
  const form = useFormContext();

  // Compute field state
  const fieldState = useMemo(() => {
    const isRequired = required || field.validation?.required || false;
    const isDisabled = disabled || false;
    const hasError = Boolean(error);

    return {
      isRequired,
      isDisabled,
      hasError,
    };
  }, [required, field.validation?.required, disabled, error]);

  // Handle field change with validation
  const handleChange = useCallback(
    (newValue: unknown) => {
      onChange(newValue);

      // Clear error state when user starts typing (for better UX)
      if (error && form?.clearErrors) {
        form.clearErrors(field.id);
      }
    },
    [onChange, error, form, field.id]
  );

  // Render the actual field input
  const renderFieldInput = useCallback(() => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'url':
        return (
          <Input
            value={(value as string) || ''}
            onChange={e => handleChange((e.target as HTMLInputElement).value)}
            onBlur={onBlur}
            disabled={fieldState.isDisabled}
            className={cn(
              error && 'border-destructive focus:border-destructive',
              field.className
            )}
            type={field.type}
            placeholder={field.placeholder}
            autoComplete={getAutoCompleteValue(field)}
          />
        );

      case 'number':
        return (
          <Input
            value={(value as string) || ''}
            onBlur={onBlur}
            disabled={fieldState.isDisabled}
            className={cn(
              error && 'border-destructive focus:border-destructive',
              field.className
            )}
            type="number"
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            step={field.validation?.step || 1}
            onChange={e =>
              handleChange(
                (e.target as HTMLInputElement).value
                  ? Number((e.target as HTMLInputElement).value)
                  : undefined
              )
            }
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={(value as string) || ''}
            onChange={e => handleChange((e.target as HTMLInputElement).value)}
            onBlur={onBlur}
            disabled={fieldState.isDisabled}
            className={cn(
              error && 'border-destructive focus:border-destructive',
              field.className
            )}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
          />
        );

      case 'select':
        return (
          <Select
            value={value?.toString() || ''}
            onValueChange={handleChange}
            disabled={fieldState.isDisabled}
          >
            <SelectTrigger className={cn(error && 'border-destructive')}>
              <SelectValue
                placeholder={field.placeholder || 'Select an option'}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem
                  key={option.value.toString()}
                  value={option.value.toString()}
                  disabled={option.disabled}
                >
                  {option.label}
                  {option.description && (
                    <span className="text-xs text-muted-foreground block">
                      {option.description}
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multi-select':
        return (
          <MultiSelectField
            options={field.options || []}
            value={(value as unknown[]) || []}
            onChange={handleChange}
            placeholder={field.placeholder}
            disabled={fieldState.isDisabled}
            error={error}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            value={value?.toString() || ''}
            onValueChange={handleChange}
            disabled={fieldState.isDisabled}
            className="flex flex-col space-y-2"
          >
            {field.options?.map(option => (
              <div
                key={option.value.toString()}
                className="flex items-center space-x-2"
              >
                <RadioGroupItem
                  value={option.value.toString()}
                  id={`${field.id}-${option.value}`}
                  disabled={option.disabled}
                />
                <Label
                  htmlFor={`${field.id}-${option.value}`}
                  className={cn(
                    'text-sm font-medium leading-none',
                    'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  )}
                >
                  {option.label}
                  {option.description && (
                    <span className="text-xs text-muted-foreground block font-normal">
                      {option.description}
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={Boolean(value)}
              onCheckedChange={handleChange}
              disabled={fieldState.isDisabled}
              className={cn(error && 'border-destructive')}
            />
            {field.label && (
              <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {field.label}
              </Label>
            )}
          </div>
        );

      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={Boolean(value)}
              onCheckedChange={handleChange}
              disabled={fieldState.isDisabled}
            />
            {field.label && (
              <Label className="text-sm font-medium leading-none">
                {field.label}
              </Label>
            )}
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-3">
            <Slider
              value={[(value as number) || field.validation?.min || 0]}
              onValueChange={values => handleChange(values[0])}
              max={field.validation?.max || 100}
              min={field.validation?.min || 0}
              step={field.validation?.step || 1}
              disabled={fieldState.isDisabled}
              className={cn(error && 'border-destructive')}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{field.validation?.min || 0}</span>
              <Badge variant="secondary">
                {(value as number) || field.validation?.min || 0}
              </Badge>
              <span>{field.validation?.max || 100}</span>
            </div>
          </div>
        );

      case 'date':
        return (
          <DateField
            value={value as string}
            onChange={handleChange as (newValue: string) => void}
            placeholder={field.placeholder}
            disabled={fieldState.isDisabled}
            error={error}
          />
        );

      case 'date-range':
      case 'date-range-flexible':
        return (
          <DateRangeField
            value={value as Record<string, unknown>}
            onChange={handleChange}
            placeholder={field.placeholder}
            disabled={fieldState.isDisabled}
            error={error}
            flexible={field.type === 'date-range-flexible'}
          />
        );

      case 'phone':
        return (
          <PhoneInputField
            value={value as string}
            onChange={handleChange as (newValue: string) => void}
            placeholder={field.placeholder}
            disabled={fieldState.isDisabled}
            error={error}
          />
        );

      case 'airport-autocomplete':
        return (
          <AirportAutocompleteField
            value={
              value as {
                code: string;
                name: string;
                city?: string;
                country?: string;
              }
            }
            onChange={handleChange}
            placeholder={field.placeholder}
            disabled={fieldState.isDisabled}
            error={error}
            apiIntegration={field.apiIntegration}
          />
        );

      case 'country-select':
        return (
          <CountrySelectField
            value={value as string}
            onChange={handleChange}
            placeholder={field.placeholder}
            disabled={fieldState.isDisabled}
            error={error}
          />
        );

      case 'address-group':
        return (
          <AddressGroupField
            value={
              value as {
                street: string;
                city: string;
                state: string;
                zipCode: string;
                country: string;
              }
            }
            onChange={handleChange}
            disabled={fieldState.isDisabled}
            error={error}
          />
        );

      case 'file-upload':
        return (
          <FileUploadField
            value={value as FileList | null}
            onChange={handleChange}
            disabled={fieldState.isDisabled}
            error={error}
            accept={field.accept}
            multiple={field.multiple}
            maxSize={field.maxSize}
          />
        );

      case 'rating':
        return (
          <RatingField
            value={value as number}
            onChange={handleChange}
            disabled={fieldState.isDisabled}
            max={field.validation?.max || 5}
            allowHalf={field.allowHalf}
          />
        );

      default:
        console.warn(
          `Unknown field type: ${field.type}. Falling back to text input.`
        );
        return (
          <Input
            value={(value as string) || ''}
            onChange={e => handleChange((e.target as HTMLInputElement).value)}
            onBlur={onBlur}
            disabled={fieldState.isDisabled}
            className={cn(
              error && 'border-destructive focus:border-destructive',
              field.className
            )}
            placeholder={field.placeholder}
          />
        );
    }
  }, [field, value, handleChange, onBlur, fieldState, error]);

  // Handle special field types that don't need FormField wrapper
  if (field.type === 'section-header') {
    return (
      <div className={cn('form-field-header py-4', className)}>
        <h3 className="text-lg font-semibold text-foreground">{field.label}</h3>
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
      <div
        className={cn('form-field-divider border-t pt-4 mt-6 mb-2', className)}
      />
    );
  }

  // For checkbox and switch, don't show separate label
  const showLabel = field.label && !['checkbox', 'switch'].includes(field.type);

  return (
    <FormField
      control={form?.control}
      name={field.id}
      render={() => (
        <FormItem className={cn('form-field', className, field.className)}>
          {showLabel && (
            <FormLabel
              className={cn(
                'form-field-label',
                fieldState.isRequired &&
                  "after:content-['*'] after:text-destructive after:ml-1"
              )}
            >
              {field.label}
              {field.tooltip && (
                <span
                  className="ml-1 text-xs text-muted-foreground"
                  title={field.tooltip}
                >
                  ⓘ
                </span>
              )}
            </FormLabel>
          )}

          <FormControl>{renderFieldInput()}</FormControl>

          {field.description && (
            <FormDescription className="form-field-description">
              {field.description}
            </FormDescription>
          )}

          {error && (
            <FormMessage className="form-field-error">{error}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

// Helper function to get appropriate autocomplete value
const getAutoCompleteValue = (field: FieldConfiguration): string => {
  switch (field.type) {
    case 'email':
      return 'email';
    case 'password':
      return field.id === 'current-password'
        ? 'current-password'
        : 'new-password';
    default:
      return field.autoComplete || 'off';
  }
};

// Multi-select field component
interface SelectOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
}

const MultiSelectField: FC<{
  options: SelectOption[];
  value: unknown[];
  onChange: (value: unknown[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}> = ({ options, value, onChange, placeholder, disabled, error }) => {
  const handleToggle = (optionValue: unknown) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'border rounded-md p-3 min-h-[40px]',
          error && 'border-destructive',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {value.length === 0 ? (
          <span className="text-muted-foreground text-sm">
            {placeholder || 'Select options...'}
          </span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {value.map(selectedValue => {
              const option = options.find(opt => opt.value === selectedValue);
              return (
                <Badge
                  key={String(selectedValue)}
                  variant="secondary"
                  className="text-xs"
                >
                  {option?.label || String(selectedValue)}
                  <button
                    type="button"
                    onClick={() => handleToggle(selectedValue)}
                    className="ml-1 hover:text-destructive"
                    disabled={disabled}
                  >
                    ×
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
        {options.map(option => (
          <div
            key={String(option.value)}
            className="flex items-center space-x-2"
          >
            <Checkbox
              checked={value.includes(option.value)}
              onCheckedChange={() => handleToggle(option.value)}
              disabled={disabled || option.disabled}
            />
            <Label className="text-sm">{option.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

// File upload field component (placeholder)
const FileUploadField: FC<{
  value?: FileList | null;
  onChange: (value: FileList | null) => void;
  disabled?: boolean;
  error?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}> = ({
  value: _value,
  onChange,
  disabled,
  error: _error,
  accept,
  multiple,
  maxSize,
}) => {
  return (
    <div className="border-2 border-dashed rounded-lg p-6 text-center">
      <Input
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={e => onChange(e.target.files)}
        className="hidden"
        id="file-upload"
      />
      <Label htmlFor="file-upload" className="cursor-pointer">
        <div className="text-sm text-muted-foreground">
          Click to upload files
          {maxSize && <div>Max size: {maxSize}MB</div>}
        </div>
      </Label>
    </div>
  );
};

// Rating field component (placeholder)
const RatingField: FC<{
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  max?: number;
  allowHalf?: boolean;
}> = ({ value, onChange, disabled, max = 5, allowHalf: _allowHalf }) => {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          disabled={disabled}
          className={cn(
            'text-2xl transition-colors',
            (value || 0) > i ? 'text-yellow-400' : 'text-gray-300',
            !disabled && 'hover:text-yellow-300'
          )}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default DynamicFieldRenderer;
