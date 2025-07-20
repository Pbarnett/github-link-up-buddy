import React, { useEffect, useState, useCallback } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle2, 
  AlertCircle, 
  User, 
  CreditCard, 
  Phone, 
  MapPin,
  FileText,
  Award,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useUser } from '@supabase/auth-helpers-react';
import { DatabaseOperations } from '@/lib/supabase/database-operations';
import { cn } from '@/lib/utils';

export interface ProfileField {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
  category: 'basic' | 'contact' | 'travel' | 'payment' | 'verification';
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ProfileCompletenessData {
  completionPercentage: number;
  completedFields: number;
  totalFields: number;
  fields: ProfileField[];
  lastUpdated?: Date;
  tier?: 'basic' | 'complete' | 'verified';
}

interface ProfileCompletenessIndicatorProps {
  data: ProfileCompletenessData;
  onFieldClick?: (fieldId: string) => void;
  showFieldList?: boolean;
  compact?: boolean;
  className?: string;
}

const categoryIcons = {
  basic: User,
  contact: Phone, 
  travel: MapPin,
  payment: CreditCard,
  verification: FileText
};

const categoryLabels = {
  basic: 'Basic Information',
  contact: 'Contact Details', 
  travel: 'Travel Preferences',
  payment: 'Payment Methods',
  verification: 'Identity Verification'
};

export function ProfileCompletenessIndicator({
  data,
  onFieldClick,
  showFieldList = true,
  compact = false,
  className = ''
}: ProfileCompletenessIndicatorProps) {
  const { completionPercentage, completedFields, totalFields, fields, tier = 'basic' } = data;
  
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTierBadge = (tier: string) => {
    const variants = {
      basic: { variant: 'secondary' as const, label: 'Basic Profile' },
      complete: { variant: 'default' as const, label: 'Complete Profile' },
      verified: { variant: 'default' as const, label: 'Verified Profile' }
    };
    
    return variants[tier as keyof typeof variants] || variants.basic;
  };

  const groupedFields = fields.reduce((groups, field) => {
    if (!groups[field.category]) {
      groups[field.category] = [];
    }
    groups[field.category].push(field);
    return groups;
  }, {} as Record<string, ProfileField[]>);

  const incompleteCriticalFields = fields.filter(f => f.required && !f.completed);

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex-1">
          <Progress 
            value={completionPercentage} 
            className="h-2"
            aria-label={`Profile ${completionPercentage}% complete`}
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{completionPercentage}%</span>
          <Badge {...getTierBadge(tier)} className="text-xs">
            {getTierBadge(tier).label}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Profile Completeness
            </CardTitle>
            <CardDescription>
              {completedFields} of {totalFields} fields completed
            </CardDescription>
          </div>
          <Badge {...getTierBadge(tier)}>
            {getTierBadge(tier).label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {completionPercentage}% Complete
            </span>
            {completionPercentage === 100 && (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            )}
          </div>
          
          <Progress 
            value={completionPercentage} 
            className="h-3"
            aria-label={`Profile ${completionPercentage}% complete`}
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Critical Missing Fields Alert */}
        {incompleteCriticalFields.length > 0 && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <span className="font-medium">
                {incompleteCriticalFields.length} required field{incompleteCriticalFields.length !== 1 ? 's' : ''} missing
              </span>
              <div className="mt-1 text-sm">
                Complete these to unlock all features: {incompleteCriticalFields.map(f => f.label).join(', ')}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Completion Benefits */}
        {completionPercentage >= 80 && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <span className="font-medium">Great progress!</span> 
              {completionPercentage === 100 
                ? " Your profile is complete and you have access to all features."
                : ` You're almost there - complete your profile to unlock all features.`
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Field Categories */}
        {showFieldList && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Complete Your Profile
            </h4>
            
            {Object.entries(groupedFields).map(([category, categoryFields]) => {
              const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
              const completedInCategory = categoryFields.filter(f => f.completed).length;
              const totalInCategory = categoryFields.length;
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {completedInCategory}/{totalInCategory}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-2 pl-6">
                    {categoryFields.map((field) => (
                      <div
                        key={field.id}
                        className={`flex items-center justify-between p-2 rounded-md border ${
                          field.completed 
                            ? 'bg-green-50 border-green-200' 
                            : field.required 
                              ? 'bg-amber-50 border-amber-200' 
                              : 'bg-gray-50 border-gray-200'
                        } ${onFieldClick ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
                        onClick={() => onFieldClick?.(field.id)}
                        role={onFieldClick ? 'button' : undefined}
                        tabIndex={onFieldClick ? 0 : undefined}
                        onKeyDown={(e) => {
                          if (onFieldClick && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            onFieldClick(field.id);
                          }
                        }}
                        aria-label={`${field.label} - ${field.completed ? 'completed' : 'incomplete'}${field.required ? ' (required)' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          {field.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className={`h-4 w-4 rounded-full border-2 ${
                              field.required ? 'border-amber-400' : 'border-gray-300'
                            }`} />
                          )}
                          <span className={`text-sm ${
                            field.completed ? 'text-green-800' : 'text-gray-700'
                          }`}>
                            {field.label}
                            {field.required && !field.completed && (
                              <span className="text-amber-600 ml-1">*</span>
                            )}
                          </span>
                        </div>
                        
                        {onFieldClick && !field.completed && (
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            Complete
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        {completionPercentage < 100 && onFieldClick && (
          <div className="pt-4 border-t">
            <Button 
              className="w-full" 
              onClick={() => {
                const nextIncompleteField = fields.find(f => !f.completed);
                if (nextIncompleteField) {
                  onFieldClick(nextIncompleteField.id);
                }
              }}
            >
              Complete Next Step
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
