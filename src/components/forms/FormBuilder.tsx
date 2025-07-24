/**
 * Form Builder Component
 *
 * Admin interface for creating and editing dynamic form configurations
 */

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type {
  FormConfiguration,
  FormBuilderProps,
  FormSection,
  FieldConfiguration,
  FieldTemplate,
  SecurityValidationResult,
  SecurityViolation,
} from '@/types/dynamic-forms';

type FC<T = {}> = React.FC<T>;
type _Component<P = {}, S = {}> = React.Component<P, S>;
import { useFormStore } from '@/stores/useFormStore';
import { DynamicFormRenderer } from './DynamicFormRenderer';
import { FieldTemplateLibrary } from './FieldTemplateLibrary';
import { SectionEditor } from './SectionEditor';

export const FormBuilder: FC<FormBuilderProps> = ({
  initialConfiguration,
  onSave,
  onDeploy,
  readonly = false,
  showPreview = true,
}) => {
  const [configuration, setConfiguration] = useState<FormConfiguration>(
    initialConfiguration || {
      id: crypto.randomUUID(),
      name: '',
      version: 1,
      sections: [],
    }
  );

  const [activeTab, setActiveTab] = useState('builder');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [validationResults, setValidationResults] =
    useState<SecurityValidationResult | null>(null);

  const { validateConfiguration, loading, errors } = useFormStore();

  // Mark as dirty when configuration changes
  useEffect(() => {
    if (initialConfiguration) {
      setIsDirty(
        JSON.stringify(configuration) !== JSON.stringify(initialConfiguration)
      );
    } else {
      setIsDirty(
        configuration.name !== '' || configuration.sections.length > 0
      );
    }
  }, [configuration, initialConfiguration]);

  // Update configuration
  const updateConfiguration = (updates: Partial<FormConfiguration>) => {
    setConfiguration(prev => ({ ...prev, ...updates }));
  };

  // Add new section
  const addSection = () => {
    const newSection: FormSection = {
      id: `section_${Date.now()}`,
      title: 'New Section',
      description: '',
      fields: [],
    };

    setConfiguration(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    setSelectedSection(newSection.id);
  };

  // Update section
  const updateSection = (sectionId: string, updates: Partial<FormSection>) => {
    setConfiguration(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    }));
  };

  // Delete section
  const deleteSection = (sectionId: string) => {
    setConfiguration(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId),
    }));
    if (selectedSection === sectionId) {
      setSelectedSection(null);
    }
  };

  // Add field to section
  const addFieldToSection = (
    sectionId: string,
    fieldTemplate: FieldTemplate
  ) => {
    const newField: FieldConfiguration = {
      id: `field_${Date.now()}`,
      type: fieldTemplate.type,
      label: fieldTemplate.label,
      ...fieldTemplate.defaultConfig,
    };

    updateSection(sectionId, {
      fields: [
        ...(configuration.sections.find(s => s.id === sectionId)?.fields || []),
        newField,
      ],
    });
  };

  // Update field
  const updateField = (
    sectionId: string,
    fieldId: string,
    updates: Partial<FieldConfiguration>
  ) => {
    const section = configuration.sections.find(s => s.id === sectionId);
    if (!section) return;

    updateSection(sectionId, {
      fields: section.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    });
  };

  // Delete field
  const deleteField = (sectionId: string, fieldId: string) => {
    const section = configuration.sections.find(s => s.id === sectionId);
    if (!section) return;

    updateSection(sectionId, {
      fields: section.fields.filter(field => field.id !== fieldId),
    });
  };

  // Validate configuration
  const handleValidate = async () => {
    if (configuration.name && configuration.sections.length > 0) {
      const results = await validateConfiguration(configuration);
      setValidationResults(results);
    }
  };

  // Save configuration
  const handleSave = () => {
    if (onSave) {
      onSave(configuration);
    }
  };

  // Deploy configuration
  const handleDeploy = () => {
    if (onDeploy) {
      onDeploy(configuration, { strategy: 'immediate' });
    }
  };

  const selectedSectionData = configuration.sections.find(
    s => s.id === selectedSection
  );

  return (
    <div className="form-builder h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Form Builder
            </h1>
            <p className="text-sm text-muted-foreground">
              Create and edit dynamic form configurations
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isDirty && (
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-700 border-orange-200"
              >
                Unsaved Changes
              </Badge>
            )}

            {!readonly && (
              <>
                <Button
                  variant="outline"
                  onClick={handleValidate}
                  disabled={loading.validation}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Validate
                </Button>

                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={!isDirty}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>

                <Button
                  onClick={handleDeploy}
                  disabled={
                    !configuration.name || configuration.sections.length === 0
                  }
                >
                  Deploy
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
            <TabsTrigger
              value="builder"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Builder
            </TabsTrigger>
            {showPreview && (
              <TabsTrigger
                value="preview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
            )}
            <TabsTrigger
              value="settings"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Builder Tab */}
          <TabsContent value="builder" className="flex-1 mt-0 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full p-4">
              {/* Field Library */}
              <div className="lg:col-span-1">
                <FieldTemplateLibrary
                  onFieldSelect={template => {
                    if (selectedSection) {
                      addFieldToSection(selectedSection, template);
                    }
                  }}
                  disabled={!selectedSection}
                />
              </div>

              {/* Form Structure */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Form Structure</h3>
                  {!readonly && (
                    <Button variant="outline" size="sm" onClick={addSection}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {configuration.sections.map(section => (
                    <Card
                      key={section.id}
                      className={cn(
                        'cursor-pointer transition-colors',
                        selectedSection === section.id && 'ring-2 ring-primary'
                      )}
                      onClick={() => setSelectedSection(section.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            {section.title}
                          </CardTitle>
                          {!readonly && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation();
                                deleteSection(section.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {section.description && (
                          <p className="text-sm text-muted-foreground">
                            {section.description}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          {section.fields.length} field
                          {section.fields.length !== 1 ? 's' : ''}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {configuration.sections.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No sections yet. Add a section to get started.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section Editor */}
              <div className="lg:col-span-1">
                {selectedSectionData ? (
                  <SectionEditor
                    section={selectedSectionData}
                    onUpdate={updates =>
                      updateSection(selectedSectionData.id, updates)
                    }
                    onUpdateField={(fieldId, updates) =>
                      updateField(selectedSectionData.id, fieldId, updates)
                    }
                    onDeleteField={fieldId =>
                      deleteField(selectedSectionData.id, fieldId)
                    }
                    readonly={readonly}
                  />
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center text-muted-foreground">
                        <p>
                          Select a section to edit its properties and fields.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          {showPreview && (
            <TabsContent value="preview" className="flex-1 mt-0 overflow-auto">
              <div className="p-4">
                {configuration.sections.length > 0 ? (
                  <DynamicFormRenderer
                    configuration={configuration}
                    onSubmit={data =>
                      console.log('Preview form submitted:', data)
                    }
                    showValidationSummary={true}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Add sections and fields to see the preview.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          )}

          {/* Settings Tab */}
          <TabsContent value="settings" className="flex-1 mt-0 overflow-auto">
            <div className="p-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Form Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="form-name">Form Name</Label>
                    <Input
                      id="form-name"
                      value={configuration.name}
                      onChange={e =>
                        updateConfiguration({
                          name: (e.target as HTMLInputElement).value,
                        })
                      }
                      placeholder="Enter form name"
                      disabled={readonly}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="form-version">Version</Label>
                    <Input
                      id="form-version"
                      type="number"
                      value={configuration.version}
                      onChange={e =>
                        updateConfiguration({
                          version: parseInt(
                            (e.target as HTMLInputElement).value
                          ),
                        })
                      }
                      disabled={readonly}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Validation Results */}
              {validationResults && (
                <Card>
                  <CardHeader>
                    <CardTitle>Validation Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {validationResults.isSecure ? (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Form configuration is valid and secure.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <p>Form configuration has validation issues:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {validationResults.violations.map(
                                (
                                  violation: SecurityViolation,
                                  index: number
                                ) => (
                                  <li key={index} className="text-sm">
                                    {violation.message}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Errors */}
              {errors.configuration && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.configuration}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
