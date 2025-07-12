/**
 * Section Editor Component
 * 
 * Provides editing interface for form sections and their fields
 */

import React, { useState } from 'react';
import { Settings, Trash2, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

import type {
  FormSection,
  FieldConfiguration,
  ValidationRules
} from '@/types/dynamic-forms';

interface SectionEditorProps {
  section: FormSection;
  onUpdate: (updates: Partial<FormSection>) => void;
  onUpdateField: (fieldId: string, updates: Partial<FieldConfiguration>) => void;
  onDeleteField: (fieldId: string) => void;
  readonly?: boolean;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  onUpdate,
  onUpdateField,
  onDeleteField,
  readonly = false
}) => {
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  const toggleFieldExpanded = (fieldId: string) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(fieldId)) {
      newExpanded.delete(fieldId);
    } else {
      newExpanded.add(fieldId);
    }
    setExpandedFields(newExpanded);
  };

  const updateFieldValidation = (fieldId: string, validation: Partial<ValidationRules>) => {
    const field = section.fields.find(f => f.id === fieldId);
    if (field) {
      onUpdateField(fieldId, {
        validation: { ...field.validation, ...validation }
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Section Editor
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Section Properties */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="section-title">Section Title</Label>
            <Input
              id="section-title"
              value={section.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Enter section title"
              disabled={readonly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section-description">Description</Label>
            <Textarea
              id="section-description"
              value={section.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Enter section description"
              disabled={readonly}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section-class">CSS Class</Label>
            <Input
              id="section-class"
              value={section.className || ''}
              onChange={(e) => onUpdate({ className: e.target.value })}
              placeholder="Custom CSS classes"
              disabled={readonly}
            />
          </div>
        </div>

        <Separator />

        {/* Fields */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Fields ({section.fields.length})</h4>
          </div>

          {section.fields.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-4 border-2 border-dashed rounded-lg">
              No fields yet. Add fields from the library.
            </div>
          ) : (
            <div className="space-y-2">
              {section.fields.map((field, index) => (
                <Collapsible
                  key={field.id}
                  open={expandedFields.has(field.id)}
                  onOpenChange={() => toggleFieldExpanded(field.id)}
                >
                  <div className="border rounded-lg">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center gap-2">
                          {expandedFields.has(field.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <span className="font-medium text-sm">{field.label}</span>
                          <Badge variant="outline" className="text-xs">
                            {field.type}
                          </Badge>
                        </div>
                        
                        {!readonly && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteField(field.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="p-3 pt-0 space-y-3 border-t">
                        {/* Basic Properties */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Label</Label>
                            <Input
                              value={field.label}
                              onChange={(e) => onUpdateField(field.id, { label: e.target.value })}
                              className="h-8 text-sm"
                              disabled={readonly}
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label className="text-xs">Placeholder</Label>
                            <Input
                              value={field.placeholder || ''}
                              onChange={(e) => onUpdateField(field.id, { placeholder: e.target.value })}
                              className="h-8 text-sm"
                              disabled={readonly}
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                          <Label className="text-xs">Description</Label>
                          <Textarea
                            value={field.description || ''}
                            onChange={(e) => onUpdateField(field.id, { description: e.target.value })}
                            className="text-sm"
                            rows={2}
                            disabled={readonly}
                          />
                        </div>

                        {/* Validation */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Validation</Label>
                          
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`${field.id}-required`}
                                checked={field.validation?.required || false}
                                onCheckedChange={(checked) => 
                                  updateFieldValidation(field.id, { required: checked as boolean })
                                }
                                disabled={readonly}
                              />
                              <Label htmlFor={`${field.id}-required`} className="text-xs">
                                Required
                              </Label>
                            </div>

                            {(field.type === 'text' || field.type === 'textarea' || field.type === 'password') && (
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <Label className="text-xs">Min Length</Label>
                                  <Input
                                    type="number"
                                    value={field.validation?.minLength || ''}
                                    onChange={(e) => 
                                      updateFieldValidation(field.id, { 
                                        minLength: e.target.value ? parseInt(e.target.value) : undefined 
                                      })
                                    }
                                    className="h-7 text-sm"
                                    disabled={readonly}
                                  />
                                </div>
                                
                                <div className="space-y-1">
                                  <Label className="text-xs">Max Length</Label>
                                  <Input
                                    type="number"
                                    value={field.validation?.maxLength || ''}
                                    onChange={(e) => 
                                      updateFieldValidation(field.id, { 
                                        maxLength: e.target.value ? parseInt(e.target.value) : undefined 
                                      })
                                    }
                                    className="h-7 text-sm"
                                    disabled={readonly}
                                  />
                                </div>
                              </div>
                            )}

                            {(field.type === 'number' || field.type === 'slider') && (
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <Label className="text-xs">Min Value</Label>
                                  <Input
                                    type="number"
                                    value={field.validation?.min || ''}
                                    onChange={(e) => 
                                      updateFieldValidation(field.id, { 
                                        min: e.target.value ? parseFloat(e.target.value) : undefined 
                                      })
                                    }
                                    className="h-7 text-sm"
                                    disabled={readonly}
                                  />
                                </div>
                                
                                <div className="space-y-1">
                                  <Label className="text-xs">Max Value</Label>
                                  <Input
                                    type="number"
                                    value={field.validation?.max || ''}
                                    onChange={(e) => 
                                      updateFieldValidation(field.id, { 
                                        max: e.target.value ? parseFloat(e.target.value) : undefined 
                                      })
                                    }
                                    className="h-7 text-sm"
                                    disabled={readonly}
                                  />
                                </div>
                              </div>
                            )}

                            {field.type === 'text' && (
                              <div className="space-y-1">
                                <Label className="text-xs">Pattern (Regex)</Label>
                                <Input
                                  value={field.validation?.pattern || ''}
                                  onChange={(e) => 
                                    updateFieldValidation(field.id, { pattern: e.target.value })
                                  }
                                  placeholder="Regular expression"
                                  className="h-7 text-sm"
                                  disabled={readonly}
                                />
                              </div>
                            )}

                            <div className="space-y-1">
                              <Label className="text-xs">Custom Error Message</Label>
                              <Input
                                value={field.validation?.message || ''}
                                onChange={(e) => 
                                  updateFieldValidation(field.id, { message: e.target.value })
                                }
                                placeholder="Custom error message"
                                className="h-7 text-sm"
                                disabled={readonly}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Options for select fields */}
                        {(field.type === 'select' || field.type === 'multi-select') && field.options && (
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">Options</Label>
                            <div className="space-y-1">
                              {field.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex gap-2">
                                  <Input
                                    value={option.label}
                                    onChange={(e) => {
                                      const newOptions = [...field.options!];
                                      newOptions[optIndex] = { ...option, label: e.target.value };
                                      onUpdateField(field.id, { options: newOptions });
                                    }}
                                    placeholder="Label"
                                    className="h-7 text-sm"
                                    disabled={readonly}
                                  />
                                  <Input
                                    value={option.value.toString()}
                                    onChange={(e) => {
                                      const newOptions = [...field.options!];
                                      newOptions[optIndex] = { ...option, value: e.target.value };
                                      onUpdateField(field.id, { options: newOptions });
                                    }}
                                    placeholder="Value"
                                    className="h-7 text-sm"
                                    disabled={readonly}
                                  />
                                  {!readonly && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newOptions = field.options!.filter((_, i) => i !== optIndex);
                                        onUpdateField(field.id, { options: newOptions });
                                      }}
                                      className="h-7 w-7 p-0"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                              
                              {!readonly && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newOptions = [
                                      ...field.options!,
                                      { label: 'New Option', value: `option${field.options!.length + 1}` }
                                    ];
                                    onUpdateField(field.id, { options: newOptions });
                                  }}
                                  className="h-7 text-xs"
                                >
                                  Add Option
                                </Button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* CSS Class */}
                        <div className="space-y-1">
                          <Label className="text-xs">CSS Class</Label>
                          <Input
                            value={field.className || ''}
                            onChange={(e) => onUpdateField(field.id, { className: e.target.value })}
                            placeholder="Custom CSS classes"
                            className="h-7 text-sm"
                            disabled={readonly}
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
