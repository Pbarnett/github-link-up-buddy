/**
 * Form Analytics Tracking Hook
 *
 * Tracks form interactions and performance metrics
 */

import { useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { FormConfiguration } from '@/types/dynamic-forms';

interface FormAnalyticsConfig {
  formConfig: FormConfiguration;
  sessionId: string;
  userId?: string;
}

interface AnalyticsEvent {
  type:
    | 'form_view'
    | 'field_interaction'
    | 'field_error'
    | 'form_submit'
    | 'form_abandon';
  fieldId?: string;
  fieldType?: string;
  fieldValue?: string;
  validationError?: string;
  duration?: number;
  eventData?: Record<string, unknown>;
}

export const useFormAnalytics = ({
  formConfig,
  sessionId,
  userId,
}: FormAnalyticsConfig) => {
  const startTime = useRef<number>(Date.now());
  const fieldStartTimes = useRef<Record<string, number>>({});
  const hasTrackedView = useRef<boolean>(false);

  // Queue events locally when network fails
  const queueEventLocally = useCallback(
    (eventPayload: Record<string, unknown>) => {
      try {
        const queue = JSON.parse(
          localStorage.getItem('pf_analytics_queue') || '[]'
        );
        queue.push({
          ...eventPayload,
          queued_at: Date.now(),
        });
        // Keep only last 100 events to prevent storage bloat
        localStorage.setItem(
          'pf_analytics_queue',
          JSON.stringify(queue.slice(-100))
        );
      } catch (error) {
        console.warn('Failed to queue analytics event locally:', error);
      }
    },
    []
  );

  const trackEvent = useCallback(
    async (event: AnalyticsEvent) => {
      if (!formConfig) return;

      const eventPayload = {
        p_form_config_id: formConfig.id,
        p_form_name: formConfig.name,
        p_form_version: formConfig.version || 1,
        p_session_id: sessionId,
        p_user_id: userId || null,
        p_event_type: event.type,
        p_event_data: event.eventData || {},
        p_field_id: event.fieldId || null,
        p_field_type: event.fieldType || null,
        p_field_value: event.fieldValue || null,
        p_validation_error: event.validationError || null,
        p_duration_ms: event.duration || null,
        p_user_agent: navigator.userAgent,
        p_ip_address: null, // Will be populated by server
        p_referrer: document.referrer || null,
      };

      // Retry logic with exponential backoff
      let attempt = 0;
      const maxRetries = 2; // Maximum retry attempts (total attempts = maxRetries + 1)

      while (attempt <= maxRetries) {
        try {
          const { error } = await supabase.rpc(
            'track_form_event',
            eventPayload
          );

          if (error) {
            throw error;
          }

          // Success - break out of retry loop
          break;
        } catch (error: unknown) {
          if (attempt >= maxRetries) {
            // Final failure - queue locally for later retry
            console.warn(
              'Analytics tracking failed after retries, queuing locally:',
              error
            );
            queueEventLocally(eventPayload);
            break;
          }

          attempt++;

          // Wait before retry (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    },
    [formConfig, sessionId, userId, queueEventLocally]
  );

  // Track form view on mount
  useEffect(() => {
    if (!hasTrackedView.current && formConfig) {
      trackEvent({
        type: 'form_view',
      });
      hasTrackedView.current = true;
    }
  }, [formConfig, trackEvent]);

  // Track form abandon on unmount
  useEffect(() => {
    return () => {
      if (hasTrackedView.current) {
        trackEvent({
          type: 'form_abandon',
          duration: Date.now() - startTime.current,
        });
      }
    };
  }, [trackEvent]);

  const trackFieldInteraction = useCallback(
    (fieldId: string, fieldType: string) => {
      fieldStartTimes.current[fieldId] = Date.now();
      trackEvent({
        type: 'field_interaction',
        fieldId,
        fieldType,
      });
    },
    [trackEvent]
  );

  const trackFieldError = useCallback(
    (fieldId: string, fieldType: string, error: string) => {
      trackEvent({
        type: 'field_error',
        fieldId,
        fieldType,
        validationError: error,
      });
    },
    [trackEvent]
  );

  const trackFieldValue = useCallback(
    (fieldId: string, fieldType: string, value: string) => {
      const fieldStartTime = fieldStartTimes.current[fieldId];
      const duration = fieldStartTime ? Date.now() - fieldStartTime : undefined;

      trackEvent({
        type: 'field_interaction',
        fieldId,
        fieldType,
        fieldValue: value,
        duration,
      });
    },
    [trackEvent]
  );

  const trackFormSubmit = useCallback(
    (formData: Record<string, unknown>) => {
      const totalDuration = Date.now() - startTime.current;
      trackEvent({
        type: 'form_submit',
        duration: totalDuration,
        eventData: {
          fieldCount: Object.keys(formData).length,
          completedFields: Object.keys(formData).filter(
            key => formData[key] !== undefined && formData[key] !== ''
          ).length,
        },
      });
    },
    [trackEvent]
  );

  return {
    trackFieldInteraction,
    trackFieldError,
    trackFieldValue,
    trackFormSubmit,
    trackEvent,
  };
};

/**
 * Generate a unique session ID for analytics tracking
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Hook to generate and maintain session ID
 */
export const useSessionId = (): string => {
  const sessionId = useRef<string>();

  if (!sessionId.current) {
    sessionId.current = generateSessionId();
  }

  return sessionId.current;
};
