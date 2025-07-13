/**
 * Form Section Component
 * 
 * Renders a section of form fields with optional conditional logic
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import type {
  FormSection as FormSectionType,
  FieldConfiguration,
  FormState
} from '@/types/dynamic-forms';

import { FieldRenderer } from './FieldRenderer';

interface FormSectionProps {
  section: FormSectionType;
  sectionIndex: number;
  formState: FormState;
  onFieldChange: (fieldId: string, value: unknown) => void;
  isFieldVisible: (field: FieldConfiguration) => boolean;
  isFieldEnabled: (field: FieldConfiguration) => boolean;
  disabled?: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({
  section,
  sectionIndex,
  formState,
  onFieldChange,
  isFieldVisible,
  isFieldEnabled,
  disabled = false
}) => {
  // Get visible fields for this section
  const visibleFields = section.fields.filter(field => isFieldVisible(field));

  // Don't render section if no visible fields
  if (visibleFields.length === 0) {
    return null;
  }

  // Determine section layout based on field types and count
  const hasMultipleColumns = visibleFields.length > 2 && 
    visibleFields.every(field => 
      ['text', 'email', 'phone', 'number', 'select', 'date'].includes(field.type)
    );

  return (
    <Card className={cn(
      "form-section",
      section.className,
      disabled && "opacity-60"
    )}>
      {/* Section Header */}
      {(section.title || section.description) && (
        <CardHeader className="pb-4">
          {section.title && (
            <CardTitle className="text-lg font-semibold">
              {section.title}
            </CardTitle>
          )}
          {section.description && (
            <CardDescription className="text-sm text-muted-foreground">
              {section.description}
            </CardDescription>
          )}
        </CardHeader>
      )}

      <CardContent className="space-y-4">
        {/* Section Fields */}
        <div className={cn(
          "form-section-fields",
          hasMultipleColumns && "grid grid-cols-1 md:grid-cols-2 gap-4",
          !hasMultipleColumns && "space-y-4"
        )}>
          {visibleFields.map((field, fieldIndex) => (
            <FieldRenderer
              key={field.id}
              field={field}
              fieldIndex={fieldIndex}
              sectionIndex={sectionIndex}
              value={formState.values[field.id]}
              error={formState.errors[field.id]}
              touched={formState.touched[field.id]}
              onChange={(value) => onFieldChange(field.id, value)}
              disabled={disabled || !isFieldEnabled(field)}
              isValid={formState.isValid}
            />
          ))}
        </div>

        {/* Section Separator */}
        {sectionIndex < 2 && (
          <div className="pt-4">
            <Separator />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormSection;
