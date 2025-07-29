import * as React from 'react';
import { ReactNode } from 'react';
import { useCallback, useContext } from 'react';
export interface FormAnalyticsEvent {
  eventType:
    | 'form_start'
    | 'form_submit'
    | 'form_error'
    | 'field_change'
    | 'field_blur';
  formId: string;
  fieldName?: string;
  value?: string;
  error?: string;
  timestamp: number;
}

interface FormAnalyticsContextType {
  trackEvent: (event: Omit<FormAnalyticsEvent, 'timestamp'>) => void;
  isEnabled: boolean;
}

const FormAnalyticsContext = React.createContext<
  FormAnalyticsContextType | undefined
>(undefined);

interface FormAnalyticsProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export function FormAnalyticsProvider({
  children,
  enabled = true,
}: FormAnalyticsProviderProps) {
  const trackEvent = useCallback(
    (event: Omit<FormAnalyticsEvent, 'timestamp'>) => {
      if (!enabled) return;

      const fullEvent: FormAnalyticsEvent = {
        ...event,
        timestamp: Date.now(),
      };

      // In a real implementation, this would send to an analytics service
      console.log('Form Analytics Event:', fullEvent);
    },
    [enabled]
  );

  const value: FormAnalyticsContextType = {
    trackEvent,
    isEnabled: enabled,
  };

  return (
    <FormAnalyticsContext.Provider value={value}>
      {children}
    </FormAnalyticsContext.Provider>
  );
}

export function useFormAnalytics() {
  const context = useContext(FormAnalyticsContext);
  if (context === undefined) {
    throw new Error(
      'useFormAnalytics must be used within a FormAnalyticsProvider'
    );
  }
  return context;
}
