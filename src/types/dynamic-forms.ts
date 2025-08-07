
/**
 * TypeScript Types for Dynamic Forms System
 *
 * Shared types for form configurations, validation, and rendering
 */

type FormEvent = React.FormEvent;
type _Component<P = {}, S = {}> = React.Component<P, S>;
export interface FormConfiguration {
  id: string;
  name: string;
  description?: string;
  version: number;
  sections: FormSection[];
  integrations?: FormIntegrations;
  stripeConfig?: StripeConfiguration;
  apiKeys?: Record<string, string>;
  piiFields?: string[];
  metadata?: Record<string, unknown>;
  settings?: {
    theme?: string;
    showProgressBar?: boolean;
    allowSave?: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

// Legacy alias for backward compatibility
export type DynamicFormConfig = FormConfiguration;

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfiguration[];
  conditional?: ConditionalLogic;
  className?: string;
}

export interface FieldConfiguration {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  validation?: ValidationRules;
  apiIntegration?: APIIntegration;
  stripeConfig?: StripeFieldConfig;
  conditional?: ConditionalLogic;
  metadata?: Record<string, unknown>;
  className?: string;
  defaultValue?: unknown;
  options?: FieldOption[]; // For select, radio, checkbox fields

  // Field-specific properties
  rows?: number; // For textarea
  autoComplete?: string; // For input fields
  tooltip?: string; // For field tooltips
  defaultCountry?: string; // For phone input
  addressConfig?: {
    includeCity?: boolean;
    includeState?: boolean;
    includeCountry?: boolean;
    includePostalCode?: boolean;
    defaultCountry?: string;
  }; // For address group fields
  accept?: string; // For file upload
  multiple?: boolean; // For file upload
  maxSize?: number; // For file upload
  allowHalf?: boolean; // For rating fields
}

export type FieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'number'
  | 'password'
  | 'textarea'
  | 'url'
  | 'select'
  | 'multi-select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date'
  | 'datetime'
  | 'date-range'
  | 'date-range-flexible'
  | 'airport-autocomplete'
  | 'country-select'
  | 'currency-select'
  | 'stripe-card'
  | 'stripe-payment'
  | 'address-group'
  | 'file-upload'
  | 'slider'
  | 'rating'
  | 'conditional-group'
  | 'section-header'
  | 'divider';

export interface FieldOption {
  label: string;
  value: string | number | boolean;
  description?: string;
  disabled?: boolean;
}

export interface FormIntegrations {
  onSubmit?: APIIntegration;
  onValidation?: APIIntegration;
  webhooks?: APIIntegration[];
}

export interface APIIntegration {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  transformRequest?: string; // Function code as string
  transformResponse?: string; // Function code as string
  securityLevel?: 'low' | 'medium' | 'high';
  timeout?: number;
}

export interface StripeConfiguration {
  publishableKey?: string;
  accountId?: string;
  appearance?: Record<string, unknown>;
  elements?: Record<string, unknown>;
}

export interface StripeFieldConfig {
  appearance?: Record<string, unknown>;
  options?: Record<string, unknown>;
}

export interface ValidationRules {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  step?: number; // For number inputs
  custom?: string; // Custom validation function as string
  message?: string; // Custom error message
}

export interface ConditionalLogic {
  showWhen?: ConditionalRule;
  hideWhen?: ConditionalRule;
  enableWhen?: ConditionalRule;
  disableWhen?: ConditionalRule;
}

export interface ConditionalRule {
  field: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'contains'
    | 'not_contains'
    | 'oneOf'
    | 'notOneOf'
    | 'greater'
    | 'less'
    | 'greaterOrEqual'
    | 'lessOrEqual';
  value: unknown;
}

// Form State Management
export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormContext {
  formState: FormState;
  updateField: (fieldId: string, value: unknown) => void;
  validateField: (fieldId: string) => void;
  setFieldError: (fieldId: string, error: string) => void;
  clearFieldError: (fieldId: string) => void;
  submitForm: () => Promise<void>;
}

// Database Types
export interface FormConfigurationRecord {
  id: string;
  name: string;
  version: number;
  status: 'draft' | 'testing' | 'deployed' | 'archived';
  config_data: FormConfiguration;
  validation_schema: Record<string, unknown>;
  ui_schema: Record<string, unknown>;
  deployment_strategy: 'immediate' | 'canary' | 'blue_green';
  canary_percentage: number;
  rollback_config_id?: string;
  encrypted_config?: string;
  encryption_version: number;
  encryption_key_type: 'PII' | 'PAYMENT';
  created_by: string;
  created_at: string;
  updated_at: string;
  deployed_at?: string;
  archived_at?: string;
}

export interface FormDeployment {
  id: string;
  config_id: string;
  deployed_by: string;
  deployment_strategy: 'immediate' | 'canary' | 'blue_green';
  target_percentage: number;
  user_segment?: {
    criteria: Record<string, unknown>;
    percentage?: number;
  };
  status: 'active' | 'rolled_back' | 'completed';
  metrics: Record<string, unknown>;
  health_check_results: Record<string, unknown>;
  deployed_at: string;
  rolled_back_at?: string;
  completed_at?: string;
}

export interface FormUsageAnalytics {
  id: string;
  config_id: string;
  deployment_id?: string;
  user_id?: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  event_type: 'view' | 'interaction' | 'submit' | 'error' | 'abandon';
  field_id?: string;
  event_data: Record<string, unknown>;
  load_time_ms?: number;
  interaction_time_ms?: number;
  timestamp: string;
}

// API Response Types
export interface FormConfigResponse {
  success: boolean;
  data?: {
    config: FormConfigurationRecord;
    validationResults?: SecurityValidationResult;
  };
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface SecurityValidationResult {
  isSecure: boolean;
  violations: SecurityViolation[];
  recommendations: string[];
}

export interface SecurityViolation {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

export interface ValidationResponse {
  success: boolean;
  isValid: boolean;
  validationResults: SecurityValidationResult;
  performanceMetrics?: PerformanceMetrics;
  suggestions?: string[];
}

export interface PerformanceMetrics {
  estimatedRenderTime: number;
  fieldCount: number;
  sectionCount: number;
  complexityScore: number;
  memoryEstimate: number;
}

// Form Builder Types
export interface FormBuilderState {
  configuration: FormConfiguration;
  selectedSection?: string;
  selectedField?: string;
  isEditing: boolean;
  isDirty: boolean;
  validationResults?: SecurityValidationResult;
}

export interface FieldTemplate {
  type: FieldType;
  label: string;
  description: string;
  icon: string;
  category: 'basic' | 'advanced' | 'payment' | 'special';
  defaultConfig: Partial<FieldConfiguration>;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type FormConfigurationDraft = DeepPartial<FormConfiguration> & {
  name: string;
  sections: FormSection[];
};

// Event Types
export interface FormEvent {
  type: 'field_change' | 'section_change' | 'validation_error' | 'form_submit';
  fieldId?: string;
  sectionId?: string;
  value?: unknown;
  error?: string;
  timestamp: number;
}

// Hooks Return Types
export interface UseFormConfigurationReturn {
  configuration: FormConfiguration | null;
  loading: boolean;
  error: string | null;
  updateConfiguration: (updates: Partial<FormConfiguration>) => Promise<void>;
  deployConfiguration: (options?: DeploymentOptions) => Promise<void>;
  validateConfiguration: () => Promise<SecurityValidationResult>;
}

export interface DeploymentOptions {
  strategy: 'immediate' | 'canary' | 'blue_green';
  percentage?: number;
  userSegment?: {
    criteria: Record<string, unknown>;
    percentage?: number;
  };
}

export interface UseFormStateReturn {
  formState: FormState;
  setValue: (fieldId: string, value: unknown) => void;
  setError: (fieldId: string, error: string) => void;
  clearError: (fieldId: string) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  isFieldVisible: (field: FieldConfiguration) => boolean;
  isFieldEnabled: (field: FieldConfiguration) => boolean;
}

// Component Props Types
export interface DynamicFormRendererProps {
  configId?: string;
  configName?: string;
  configuration?: FormConfiguration;
  onSubmit?: (data: FormSubmissionData) => void | Promise<void>;
  onFieldChange?: (fieldId: string, value: unknown) => void;
  onValidationError?: (errors: Record<string, string>) => void;
  className?: string;
  disabled?: boolean;
  showValidationSummary?: boolean;
}

export interface FormSubmissionData {
  formId: string;
  formName: string;
  data: Record<string, unknown>;
  metadata: {
    submittedAt: string;
    userAgent: string;
    formVersion: number;
    instanceId: string;
    [key: string]: unknown;
  };
}

export interface FieldRendererProps {
  field: FieldConfiguration;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
}

export interface FormBuilderProps {
  initialConfiguration?: FormConfiguration;
  onSave?: (configuration: FormConfiguration) => void;
  onDeploy?: (
    configuration: FormConfiguration,
    options: DeploymentOptions
  ) => void;
  readonly?: boolean;
  showPreview?: boolean;
}

// Analytics Types
export interface FormAnalytics {
  totalViews: number;
  completionRate: number;
  errorRate: number;
  avgCompletionTime: number;
  viewsChange: number;
  completionRateChange: number;
  errorRateChange: number;
  completionTimeChange: number;
  fieldInteractions: FieldInteractionData[];
  abTestResults?: ABTestResult[];
}

export interface FieldInteractionData {
  fieldId: string;
  interactions: number;
  errors: number;
  avgFocusTime: number;
}

export interface ABTestResult {
  variantName: string;
  conversionRate: number;
  confidence: number;
  sampleSize: number;
  isWinner?: boolean;
}

// Export commonly used type unions
export type FormStatus = 'draft' | 'testing' | 'deployed' | 'archived';
export type DeploymentStrategy = 'immediate' | 'canary' | 'blue_green';
export type ValidationSeverity = 'low' | 'medium' | 'high' | 'critical';
export type EventType = 'view' | 'interaction' | 'submit' | 'error' | 'abandon';
