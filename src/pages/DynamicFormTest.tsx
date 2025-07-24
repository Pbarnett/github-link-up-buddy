import * as React from 'react';
import { DynamicFormRenderer } from '@/components/forms/DynamicFormRenderer';
import type { FormConfiguration } from '@/types/dynamic-forms';

// Sample form configuration for testing
const sampleFormConfig: FormConfiguration = {
  id: 'test-form-1',
  name: 'Sample Contact Form',
  description: 'A test form to verify the dynamic forms system',
  version: 1,
  sections: [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      fields: [
        {
          id: 'firstName',
          type: 'text',
          label: 'First Name',
          placeholder: 'Enter your first name',
          validation: {
            required: true,
            minLength: 2,
            maxLength: 50
          }
        },
        {
          id: 'lastName',
          type: 'text',
          label: 'Last Name',
          placeholder: 'Enter your last name',
          validation: {
            required: true,
            minLength: 2,
            maxLength: 50
          }
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email Address',
          placeholder: 'your.email@example.com',
          validation: {
            required: true,
            email: true
          }
        },
        {
          id: 'phone',
          type: 'phone',
          label: 'Phone Number',
          placeholder: '+1 (555) 123-4567',
          validation: {
            required: false
          }
        }
      ]
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Let us know your preferences',
      fields: [
        {
          id: 'country',
          type: 'country-select',
          label: 'Country',
          placeholder: 'Select your country',
          validation: {
            required: true
          }
        },
        {
          id: 'birthDate',
          type: 'date',
          label: 'Date of Birth',
          validation: {
            required: true
          }
        },
        {
          id: 'newsletter',
          type: 'checkbox',
          label: 'Subscribe to newsletter',
          validation: {
            required: false
          }
        },
        {
          id: 'experience',
          type: 'select',
          label: 'Travel Experience',
          placeholder: 'Select your experience level',
          options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Expert', value: 'expert' }
          ],
          validation: {
            required: true
          }
        }
      ]
    }
  ]
};

const DynamicFormTest = () => {
  const handleSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    alert('Form submitted successfully! Check console for data.');
  };

  const handleFieldChange = (fieldId: string, value: unknown) => {
    console.log(`Field ${fieldId} changed:`, value);
  };

  const handleValidationError = (errors: Record<string, string>) => {
    console.log('Validation errors:', errors);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dynamic Forms Test
        </h1>
        <p className="text-gray-600">
          Testing the dynamic forms system with a sample configuration
        </p>
      </div>

      <DynamicFormRenderer
        configuration={sampleFormConfig}
        onSubmit={handleSubmit}
        onFieldChange={handleFieldChange}
        onValidationError={handleValidationError}
        className="bg-white shadow-lg rounded-lg p-6"
      />
    </div>
  );
};

export default DynamicFormTest;
