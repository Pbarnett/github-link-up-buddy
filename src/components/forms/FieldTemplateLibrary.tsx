/**
 * Field Template Library Component
 * 
 * Provides a library of field templates for form building
 */

import React, { useState } from 'react';
import { 
  Type, Mail, Phone, Hash, Calendar, MapPin, List, 
  CheckSquare, ToggleLeft, SlidersHorizontal, Star, Upload, 
  Plane, Globe, CreditCard, Minus, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import type { FieldTemplate, FieldType } from '@/types/dynamic-forms';

interface FieldTemplateLibraryProps {
  onFieldSelect: (template: FieldTemplate) => void;
  disabled?: boolean;
}

// Field template definitions
const fieldTemplates: FieldTemplate[] = [
  // Basic Fields
  {
    type: 'text',
    label: 'Text Input',
    description: 'Single line text input',
    icon: 'Type',
    category: 'basic',
    defaultConfig: {
      placeholder: 'Enter text...',
      validation: { required: false }
    }
  },
  {
    type: 'textarea',
    label: 'Text Area',
    description: 'Multi-line text input',
    icon: 'FileText',
    category: 'basic',
    defaultConfig: {
      placeholder: 'Enter text...',
      validation: { required: false }
    }
  },
  {
    type: 'email',
    label: 'Email',
    description: 'Email address input',
    icon: 'Mail',
    category: 'basic',
    defaultConfig: {
      placeholder: 'Enter email address',
      validation: { required: false, email: true }
    }
  },
  {
    type: 'phone',
    label: 'Phone',
    description: 'Phone number input',
    icon: 'Phone',
    category: 'basic',
    defaultConfig: {
      placeholder: 'Enter phone number',
      validation: { required: false, phone: true }
    }
  },
  {
    type: 'number',
    label: 'Number',
    description: 'Numeric input',
    icon: 'Hash',
    category: 'basic',
    defaultConfig: {
      placeholder: 'Enter number',
      validation: { required: false }
    }
  },
  {
    type: 'password',
    label: 'Password',
    description: 'Password input',
    icon: 'Type',
    category: 'basic',
    defaultConfig: {
      placeholder: 'Enter password',
      validation: { required: false, minLength: 8 }
    }
  },

  // Selection Fields
  {
    type: 'select',
    label: 'Select',
    description: 'Dropdown selection',
    icon: 'List',
    category: 'basic',
    defaultConfig: {
      placeholder: 'Select an option',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ],
      validation: { required: false }
    }
  },
  {
    type: 'multi-select',
    label: 'Multi Select',
    description: 'Multiple selection dropdown',
    icon: 'List',
    category: 'basic',
    defaultConfig: {
      placeholder: 'Select multiple options',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ],
      validation: { required: false }
    }
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    description: 'Single checkbox',
    icon: 'CheckSquare',
    category: 'basic',
    defaultConfig: {
      validation: { required: false }
    }
  },
  {
    type: 'switch',
    label: 'Switch',
    description: 'Toggle switch',
    icon: 'ToggleLeft',
    category: 'basic',
    defaultConfig: {
      validation: { required: false }
    }
  },

  // Date Fields
  {
    type: 'date',
    label: 'Date',
    description: 'Date picker',
    icon: 'Calendar',
    category: 'advanced',
    defaultConfig: {
      placeholder: 'Select date',
      validation: { required: false }
    }
  },
  {
    type: 'datetime',
    label: 'Date & Time',
    description: 'Date and time picker',
    icon: 'Calendar',
    category: 'advanced',
    defaultConfig: {
      placeholder: 'Select date and time',
      validation: { required: false }
    }
  },
  {
    type: 'date-range',
    label: 'Date Range',
    description: 'Date range picker',
    icon: 'Calendar',
    category: 'advanced',
    defaultConfig: {
      placeholder: 'Select date range',
      validation: { required: false }
    }
  },
  {
    type: 'date-range-flexible',
    label: 'Flexible Date Range',
    description: 'Date range with flexible option',
    icon: 'Calendar',
    category: 'advanced',
    defaultConfig: {
      placeholder: 'Select date range or flexible',
      validation: { required: false }
    }
  },

  // Specialized Fields
  {
    type: 'airport-autocomplete',
    label: 'Airport Search',
    description: 'Airport autocomplete',
    icon: 'Plane',
    category: 'special',
    defaultConfig: {
      placeholder: 'Search airports...',
      validation: { required: false },
      apiIntegration: {
        endpoint: '/api/airports',
        method: 'GET'
      }
    }
  },
  {
    type: 'country-select',
    label: 'Country',
    description: 'Country selector',
    icon: 'Globe',
    category: 'special',
    defaultConfig: {
      placeholder: 'Select country',
      validation: { required: false }
    }
  },
  {
    type: 'address-group',
    label: 'Address',
    description: 'Full address input group',
    icon: 'MapPin',
    category: 'special',
    defaultConfig: {
      validation: { required: false }
    }
  },
  {
    type: 'slider',
    label: 'Slider',
    description: 'Range slider',
    icon: 'Slider',
    category: 'advanced',
    defaultConfig: {
      validation: { required: false, min: 0, max: 100 }
    }
  },
  {
    type: 'rating',
    label: 'Rating',
    description: 'Star rating input',
    icon: 'Star',
    category: 'advanced',
    defaultConfig: {
      validation: { required: false, min: 1, max: 5 }
    }
  },
  {
    type: 'file-upload',
    label: 'File Upload',
    description: 'File upload input',
    icon: 'Upload',
    category: 'advanced',
    defaultConfig: {
      placeholder: 'Choose file...',
      validation: { required: false }
    }
  },

  // Payment Fields
  {
    type: 'stripe-card',
    label: 'Credit Card',
    description: 'Stripe card input',
    icon: 'CreditCard',
    category: 'payment',
    defaultConfig: {
      validation: { required: false },
      stripeConfig: {
        appearance: { theme: 'stripe' }
      }
    }
  },

  // Layout Fields
  {
    type: 'section-header',
    label: 'Section Header',
    description: 'Section title and description',
    icon: 'Type',
    category: 'basic',
    defaultConfig: {
      description: 'Section description'
    }
  },
  {
    type: 'divider',
    label: 'Divider',
    description: 'Visual separator',
    icon: 'Minus',
    category: 'basic',
    defaultConfig: {}
  }
];

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Type,
  Mail,
  Phone,
  Hash,
  Calendar,
  MapPin,
  List,
  CheckSquare,
  ToggleLeft,
  Slider: SlidersHorizontal,
  Star,
  Upload,
  Plane,
  Globe,
  CreditCard,
  Minus,
  FileText
};

export const FieldTemplateLibrary: React.FC<FieldTemplateLibraryProps> = ({
  onFieldSelect,
  disabled = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter templates
  const filteredTemplates = fieldTemplates.filter(template => {
    const matchesSearch = template.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(fieldTemplates.map(t => t.category)))];

  const handleFieldSelect = (template: FieldTemplate) => {
    if (!disabled) {
      onFieldSelect(template);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Field Library</CardTitle>
        
        {/* Search */}
        <Input
          placeholder="Search fields..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-3 space-y-2">
        {disabled && (
          <div className="text-center text-sm text-muted-foreground mb-4 p-2 bg-muted rounded">
            Select a section first to add fields
          </div>
        )}

        {filteredTemplates.map(template => {
          const IconComponent = iconMap[template.icon];
          
          return (
            <Button
              key={`${template.type}-${template.label}`}
              variant="outline"
              className={cn(
                "w-full h-auto p-3 justify-start text-left",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleFieldSelect(template)}
              disabled={disabled}
            >
              <div className="flex items-start gap-3 w-full">
                {IconComponent && (
                  <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{template.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {template.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}

        {filteredTemplates.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-4">
            No fields found matching your search.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
