

/**
 * Enhanced Form Components
 * 
 * Enhanced form field components that provide better accessibility, improved UX,
 * and modern patterns following ShadCN documentation best practices.
 */

import * as React from 'react';
type ReactNode = React.ReactNode;
type ChangeEvent<T = Element> = React.ChangeEvent<T>;
type FC<T = {}> = React.FC<T>;

import { cn } from '@/lib/utils'
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'

interface BaseFieldProps {
  label?: string
  description?: string
  required?: boolean
  error?: string
  className?: string
}

/**
 * Enhanced Text Input with better accessibility and validation states
 */
interface TextFieldProps extends BaseFieldPropsProps<typeof Input> {
  value?: string
  onValueChange?: (value: string) => void
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, description, required, error, className, value, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onValueChange?.((e.target as HTMLInputElement).value)
    }

    return (
      <FormItem className={className}>
        {label && (
          <FormLabel className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
            {label}
          </FormLabel>
        )}
        <FormControl>
          <Input
            ref={ref}
            value={value}
            onChange={handleChange}
            aria-invalid={!!error}
            aria-describedby={description ? `${props.id}-description` : undefined}
            {...props}
          />
        </FormControl>
        {description && (
          <FormDescription id={`${props.id}-description`}>
            {description}
          </FormDescription>
        )}
        {error && <FormMessage>{error}</FormMessage>}
      </FormItem>
    )
  }
)
TextField.displayName = 'TextField'

/**
 * Enhanced Select Field with improved accessibility
 */
interface SelectFieldProps extends BaseFieldProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
}

export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
  ({ label, description, required, error, className, value, onValueChange, placeholder, options, ...props }, ref) => {
    return (
      <FormItem className={className}>
        {label && (
          <FormLabel className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
            {label}
          </FormLabel>
        )}
        <Select value={value} onValueChange={onValueChange}>
          <FormControl>
            <SelectTrigger ref={ref} aria-invalid={!!error} {...props}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {description && <FormDescription>{description}</FormDescription>}
        {error && <FormMessage>{error}</FormMessage>}
      </FormItem>
    )
  }
)
SelectField.displayName = 'SelectField'

/**
 * Enhanced Textarea Field
 */
interface TextareaFieldProps extends BaseFieldPropsProps<typeof Textarea> {
  value?: string
  onValueChange?: (value: string) => void
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, description, required, error, className, value, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e)
      onValueChange?.((e.target as HTMLInputElement).value)
    }

    return (
      <FormItem className={className}>
        {label && (
          <FormLabel className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
            {label}
          </FormLabel>
        )}
        <FormControl>
          <Textarea
            ref={ref}
            value={value}
            onChange={handleChange}
            aria-invalid={!!error}
            aria-describedby={description ? `${props.id}-description` : undefined}
            {...props}
          />
        </FormControl>
        {description && (
          <FormDescription id={`${props.id}-description`}>
            {description}
          </FormDescription>
        )}
        {error && <FormMessage>{error}</FormMessage>}
      </FormItem>
    )
  }
)
TextareaField.displayName = 'TextareaField'

/**
 * Enhanced Checkbox Field
 */
interface CheckboxFieldProps extends BaseFieldProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  id?: string
}

export const CheckboxField = forwardRef<HTMLButtonElement, CheckboxFieldProps>(
  ({ label, description, required, error, className, checked, onCheckedChange, id, ...props }, ref) => {
    return (
      <FormItem className={cn("flex flex-row items-start space-x-3 space-y-0", className)}>
        <FormControl>
          <Checkbox
            ref={ref}
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
            aria-invalid={!!error}
            aria-describedby={description ? `${id}-description` : undefined}
            {...props}
          />
        </FormControl>
        <div className="space-y-1 leading-none">
          {label && (
            <FormLabel 
              htmlFor={id}
              className={cn(
                "text-sm font-normal cursor-pointer",
                required && "after:content-['*'] after:ml-0.5 after:text-destructive"
              )}
            >
              {label}
            </FormLabel>
          )}
          {description && (
            <FormDescription id={`${id}-description`}>
              {description}
            </FormDescription>
          )}
        </div>
        {error && <FormMessage>{error}</FormMessage>}
      </FormItem>
    )
  }
)
CheckboxField.displayName = 'CheckboxField'

/**
 * Enhanced Switch Field
 */
interface SwitchFieldProps extends BaseFieldProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  id?: string
}

export const SwitchField = forwardRef<HTMLButtonElement, SwitchFieldProps>(
  ({ label, description, required, error, className, checked, onCheckedChange, id, ...props }, ref) => {
    return (
      <FormItem className={cn("flex flex-row items-center justify-between rounded-lg border p-4", className)}>
        <div className="space-y-0.5">
          {label && (
            <FormLabel 
              htmlFor={id}
              className={cn(
                "text-base cursor-pointer",
                required && "after:content-['*'] after:ml-0.5 after:text-destructive"
              )}
            >
              {label}
            </FormLabel>
          )}
          {description && (
            <FormDescription id={`${id}-description`}>
              {description}
            </FormDescription>
          )}
        </div>
        <FormControl>
          <Switch
            ref={ref}
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
            aria-invalid={!!error}
            aria-describedby={description ? `${id}-description` : undefined}
            {...props}
          />
        </FormControl>
        {error && <FormMessage>{error}</FormMessage>}
      </FormItem>
    )
  }
)
SwitchField.displayName = 'SwitchField'

/**
 * Form Group for organizing related fields
 */
interface FormGroupProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export const FormGroup: FC<FormGroupProps> = ({ title, description, children, className }) => {
  return (
    <fieldset className={cn("space-y-4", className)}>
      {(title || description) && (
        <legend className="contents">
          {title && <h3 className="text-lg font-medium leading-6 text-foreground">{title}</h3>}
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </legend>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </fieldset>
  )
}

/**
 * Form Section with dividers
 */
interface FormSectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  variant?: 'default' | 'bordered' | 'card'
}

export const FormSection: FC<FormSectionProps> = ({ 
  title, 
  description, 
  children, 
  className,
  variant = 'default' 
}) => {
  const sectionClass = cn(
    "space-y-6",
    variant === 'bordered' && "border-t border-border pt-6 first:border-t-0 first:pt-0",
    variant === 'card' && "rounded-lg border bg-card p-6",
    className
  )

  return (
    <section className={sectionClass}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h2 className="text-xl font-semibold leading-6 text-foreground">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}

export {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}
