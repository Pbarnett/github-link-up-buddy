/**
 * Form Analytics Integration Demo
 * 
 * This demonstrates the complete integration between:
 * - DynamicFormRenderer (with analytics tracking)
 * - FormAnalyticsDashboard (displaying analytics data)
 * - useFormAnalytics hook (collecting form interaction data)
 */

import React from 'react';
import { FormAnalyticsDashboard } from '../components/forms/analytics/FormAnalyticsDashboard';
import { DynamicFormRenderer } from '../components/forms/DynamicFormRenderer';

// Sample form configuration for demonstration
const sampleFormConfig = {
  id: 'demo-form-001',
  name: 'User Registration Form',
  version: 1,
  sections: [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Please provide your basic information',
      fields: [
        {
          id: 'firstName',
          type: 'text' as const,
          label: 'First Name',
          validation: { required: true, minLength: 2 }
        },
        {
          id: 'lastName', 
          type: 'text' as const,
          label: 'Last Name',
          validation: { required: true, minLength: 2 }
        },
        {
          id: 'email',
          type: 'email' as const,
          label: 'Email Address',
          validation: { required: true, pattern: '^[^@]+@[^@]+\\.[^@]+$' }
        }
      ]
    },
    {
      id: 'preferences',
      title: 'Preferences',
      fields: [
        {
          id: 'newsletter',
          type: 'checkbox' as const,
          label: 'Subscribe to newsletter',
          defaultValue: false
        },
        {
          id: 'interests',
          type: 'multi-select' as const,
          label: 'Areas of Interest',
          options: [
            { value: 'tech', label: 'Technology' },
            { value: 'design', label: 'Design' },
            { value: 'business', label: 'Business' }
          ]
        }
      ]
    }
  ]
};

export const FormAnalyticsDemo: React.FC = () => {
  const handleFormSubmit = async (data: any) => {
    console.log('Form submitted with data:', data);
    // In a real app, this would submit to your backend
    alert('Form submitted successfully! Check the analytics dashboard to see tracking data.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Form Analytics Integration Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            This demo shows the complete integration between dynamic forms and analytics tracking. 
            Fill out the form below and see how interactions are tracked in the analytics dashboard.
          </p>
        </div>

        {/* Split view: Form on left, Analytics on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Form Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Dynamic Form with Analytics
              </h2>
              <p className="text-gray-600">
                This form automatically tracks:
              </p>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Form views when the form loads</li>
                <li>Field interactions when users focus/interact with fields</li>
                <li>Field errors when validation fails</li>
                <li>Form submissions with completion metrics</li>
                <li>Form abandonment when users leave</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <DynamicFormRenderer
                configuration={sampleFormConfig}
                onSubmit={handleFormSubmit}
                onFieldChange={(fieldId, value) => {
                  console.log(`Field ${fieldId} changed to:`, value);
                }}
                onValidationError={(errors) => {
                  console.log('Validation errors:', errors);
                }}
                className="space-y-4"
              />
            </div>
          </div>

          {/* Analytics Dashboard Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Analytics Dashboard
              </h2>
              <p className="text-gray-600">
                Real-time analytics and insights from form interactions:
              </p>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Form completion rates and abandonment metrics</li>
                <li>Field-level interaction tracking</li>
                <li>Performance insights and recommendations</li>
                <li>Comparative analysis across different time periods</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border">
              <FormAnalyticsDashboard />
            </div>
          </div>
        </div>

        {/* Integration Details */}
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Integration Architecture
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                🎯 Analytics Hook
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                <code>useFormAnalytics</code> provides automatic tracking capabilities:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Session-based tracking</li>
                <li>• Automatic form view detection</li>
                <li>• Field interaction monitoring</li>
                <li>• Error and submission tracking</li>
                <li>• Offline queue with retry logic</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                📝 Form Renderer
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                <code>DynamicFormRenderer</code> integrates analytics seamlessly:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Automatic session ID generation</li>
                <li>• Field change event tracking</li>
                <li>• Validation error tracking</li>
                <li>• Form submission analytics</li>
                <li>• Zero-config analytics integration</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                📊 Analytics Dashboard
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                <code>FormAnalyticsDashboard</code> visualizes the collected data:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Real-time metrics and KPIs</li>
                <li>• Time-based filtering (7d, 30d, 90d)</li>
                <li>• Performance comparisons</li>
                <li>• AI-powered insights</li>
                <li>• Actionable recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAnalyticsDemo;
