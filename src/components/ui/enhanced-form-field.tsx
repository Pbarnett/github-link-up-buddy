/**
 * Enhanced Form Field Components
 * 
 * Provides world-class form field experience with progressive validation,
 * contextual help, and accessibility features
 */

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useFieldValidation } from '@/hooks/useProgressiveValidation';
import { formatErrorForDisplay } from '@/lib/validation/error-messages';

interface EnhancedFormFieldProps {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  progressiveValidation?: any; // ReturnType of useProgressiveValidation
  help?: {
    text: string;
    link?: string;
  };
  success?: {
    text: string;
    show?: boolean;
  };
  className?: string;
  children?: React.ReactNode;
}

export const EnhancedFormField = forwardRef<HTMLInputElement, EnhancedFormFieldProps>(
  ({
    name,
    label,
    description,
    placeholder,
    type = 'text',
    required,
    disabled,
    progressiveValidation,
    help,
    success,
    className,
    children,
    ...props
  }, ref) => {
    // Get progressive validation state if available
    const fieldValidation = progressiveValidation 
      ? useFieldValidation(name, progressiveValidation)
      : null;

    const validation = fieldValidation?.validation;
    const shouldShowValidation = validation?.shouldShow;
    const validationSeverity = validation?.severity;

    // Determine field state styling
    const getFieldStateClasses = () => {
      if (!shouldShowValidation) return '';
      
      switch (validationSeverity) {
        case 'error':
          return 'border-red-500 focus:border-red-500 focus:ring-red-500';
        case 'warning':
          return 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500';
        case 'success':
          return 'border-green-500 focus:border-green-500 focus:ring-green-500';
        default:
          return '';
      }
    };

    // Get validation icon
    const getValidationIcon = () => {
      if (!shouldShowValidation) return null;
      
      switch (validationSeverity) {
        case 'error':
          return <XCircle className="h-4 w-4 text-red-500" />;
        case 'warning':
          return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        case 'success':
          return <CheckCircle className="h-4 w-4 text-green-500" />;
        default:
          return null;
      }
    };

    // Format validation message for display
    const getValidationMessage = () => {
      if (!validation?.error || !shouldShowValidation) return null;
      
      const formatted = formatErrorForDisplay(validation.error);
      return formatted;
    };

    return (
      <FormField
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={cn('space-y-2', className)}>
            {/* Label with required indicator and help */}
            <div className="flex items-center justify-between">
              <FormLabel className="flex items-center gap-2">
                {label}
                {required && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    Required
                  </Badge>
                )}
              </FormLabel>
              
              {help && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 hover:bg-gray-100"
                      >
                        <HelpCircle className="h-3 w-3 text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <div className="space-y-2">
                        <p className="text-sm">{help.text}</p>
                        {help.link && (
                          <Button
                            asChild
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                          >
                            <a 
                              href={help.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              Learn more
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {/* Form Control with validation styling */}
            <FormControl>
              <div className="relative">
                {children || (
                  <Input
                    {...field}
                    {...fieldValidation?.fieldProps}
                    ref={ref}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(
                      'pr-10', // Space for validation icon
                      getFieldStateClasses()
                    )}
                    {...props}
                  />
                )}
                
                {/* Validation icon */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {getValidationIcon()}
                </div>
              </div>
            </FormControl>

            {/* Description */}
            {description && (
              <FormDescription className="text-sm text-gray-600">
                {description}
              </FormDescription>
            )}

            {/* Enhanced validation messages */}
            {shouldShowValidation && validation?.error && (
              <div className={cn(
                'rounded-md p-3 text-sm',
                validationSeverity === 'error' && 'bg-red-50 border border-red-200',
                validationSeverity === 'warning' && 'bg-yellow-50 border border-yellow-200'
              )}>
                <div className="flex items-start gap-2">
                  {getValidationIcon()}
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-gray-900">
                      {validation.error.title}
                    </p>
                    <p className="text-gray-700">
                      {validation.error.message}
                    </p>
                    {validation.error.suggestion && (
                      <p className="text-gray-600 italic">
                        💡 {validation.error.suggestion}
                      </p>
                    )}
                    {validation.error.helpLink && (
                      <Button
                        asChild
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs"
                      >
                        <a 
                          href={validation.error.helpLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          Get help with this
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Success message */}
            {validationSeverity === 'success' && success?.show && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-md p-2">
                <CheckCircle className="h-4 w-4" />
                <span>{success.text || 'Looks good!'}</span>
              </div>
            )}

            {/* Fallback to standard form message */}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

EnhancedFormField.displayName = 'EnhancedFormField';

/**
 * Enhanced Loading Button with progress states
 */
interface EnhancedLoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingState?: {
    currentStage?: { label: string; description?: string };
    progress?: number;
  };
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const EnhancedLoadingButton = forwardRef<HTMLButtonElement, EnhancedLoadingButtonProps>(
  ({ 
    loading = false, 
    loadingState,
    children, 
    disabled, 
    className,
    variant = 'default',
    size = 'default',
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;
    
    return (
      <div className="relative">
        <Button
          ref={ref}
          disabled={isDisabled}
          className={cn(
            'relative overflow-hidden',
            loading && 'text-transparent',
            className
          )}
          variant={variant}
          size={size}
          {...props}
        >
          {children}
          
          {/* Progress bar background */}
          {loading && loadingState?.progress !== undefined && (
            <div 
              className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-500"
              style={{ width: `${loadingState.progress}%` }}
            />
          )}
        </Button>
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-md">
            <div className="flex items-center gap-2 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
              <div className="flex flex-col items-center">
                {loadingState?.currentStage?.label && (
                  <span className="font-medium">
                    {loadingState.currentStage.label}
                  </span>
                )}
                {loadingState?.currentStage?.description && (
                  <span className="text-xs opacity-75">
                    {loadingState.currentStage.description}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

EnhancedLoadingButton.displayName = 'EnhancedLoadingButton';
