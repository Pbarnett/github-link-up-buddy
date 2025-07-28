import * as React from 'react';
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      ab_test_assignments: {
        Row: {
          ab_test_id: string;
          assigned_at: string | null;
          id: string;
          ip_address: unknown | null;
          user_agent: string | null;
          user_id: string | null;
          user_session_id: string;
          variant_id: string;
        };
        Insert: {
          ab_test_id: string;
          assigned_at?: string | null;
          id?: string;
          ip_address?: unknown | null;
          user_agent?: string | null;
          user_id?: string | null;
          user_session_id: string;
          variant_id: string;
        };
        Update: {
          ab_test_id?: string;
          assigned_at?: string | null;
          id?: string;
          ip_address?: unknown | null;
          user_agent?: string | null;
          user_id?: string | null;
          user_session_id?: string;
          variant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ab_test_assignments_ab_test_id_fkey';
            columns: ['ab_test_id'];
            isOneToOne: false;
            referencedRelation: 'ab_tests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ab_test_assignments_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'ab_test_variants';
            referencedColumns: ['id'];
          },
        ];
      };
      ab_test_events: {
        Row: {
          ab_test_id: string;
          assignment_id: string;
          created_at: string | null;
          event_data: Json | null;
          event_type: string;
          id: string;
          variant_id: string;
        };
        Insert: {
          ab_test_id: string;
          assignment_id: string;
          created_at?: string | null;
          event_data?: Json | null;
          event_type: string;
          id?: string;
          variant_id: string;
        };
        Update: {
          ab_test_id?: string;
          assignment_id?: string;
          created_at?: string | null;
          event_data?: Json | null;
          event_type?: string;
          id?: string;
          variant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ab_test_events_ab_test_id_fkey';
            columns: ['ab_test_id'];
            isOneToOne: false;
            referencedRelation: 'ab_tests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ab_test_events_assignment_id_fkey';
            columns: ['assignment_id'];
            isOneToOne: false;
            referencedRelation: 'ab_test_assignments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ab_test_events_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'ab_test_variants';
            referencedColumns: ['id'];
          },
        ];
      };
      ab_test_results: {
        Row: {
          ab_test_id: string;
          avg_time_to_abandon: unknown | null;
          avg_time_to_complete: unknown | null;
          completion_rate: number | null;
          conversion_rate: number | null;
          created_at: string | null;
          date: string;
          form_completions: number;
          form_starts: number;
          form_submissions: number;
          id: string;
          impressions: number;
          start_rate: number | null;
          unique_visitors: number;
          updated_at: string | null;
          variant_id: string;
        };
        Insert: {
          ab_test_id: string;
          avg_time_to_abandon?: unknown | null;
          avg_time_to_complete?: unknown | null;
          completion_rate?: number | null;
          conversion_rate?: number | null;
          created_at?: string | null;
          date?: string;
          form_completions?: number;
          form_starts?: number;
          form_submissions?: number;
          id?: string;
          impressions?: number;
          start_rate?: number | null;
          unique_visitors?: number;
          updated_at?: string | null;
          variant_id: string;
        };
        Update: {
          ab_test_id?: string;
          avg_time_to_abandon?: unknown | null;
          avg_time_to_complete?: unknown | null;
          completion_rate?: number | null;
          conversion_rate?: number | null;
          created_at?: string | null;
          date?: string;
          form_completions?: number;
          form_starts?: number;
          form_submissions?: number;
          id?: string;
          impressions?: number;
          start_rate?: number | null;
          unique_visitors?: number;
          updated_at?: string | null;
          variant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ab_test_results_ab_test_id_fkey';
            columns: ['ab_test_id'];
            isOneToOne: false;
            referencedRelation: 'ab_tests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ab_test_results_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'ab_test_variants';
            referencedColumns: ['id'];
          },
        ];
      };
      ab_test_significance: {
        Row: {
          ab_test_id: string;
          calculated_at: string | null;
          confidence_interval_lower: number | null;
          confidence_interval_upper: number | null;
          control_sample_size: number;
          control_value: number;
          control_variant_id: string;
          difference: number;
          id: string;
          is_significant: boolean;
          metric_name: string;
          p_value: number | null;
          relative_difference: number;
          test_sample_size: number;
          test_value: number;
          test_variant_id: string;
        };
        Insert: {
          ab_test_id: string;
          calculated_at?: string | null;
          confidence_interval_lower?: number | null;
          confidence_interval_upper?: number | null;
          control_sample_size: number;
          control_value: number;
          control_variant_id: string;
          difference: number;
          id?: string;
          is_significant?: boolean;
          metric_name: string;
          p_value?: number | null;
          relative_difference: number;
          test_sample_size: number;
          test_value: number;
          test_variant_id: string;
        };
        Update: {
          ab_test_id?: string;
          calculated_at?: string | null;
          confidence_interval_lower?: number | null;
          confidence_interval_upper?: number | null;
          control_sample_size?: number;
          control_value?: number;
          control_variant_id?: string;
          difference?: number;
          id?: string;
          is_significant?: boolean;
          metric_name?: string;
          p_value?: number | null;
          relative_difference?: number;
          test_sample_size?: number;
          test_value?: number;
          test_variant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ab_test_significance_ab_test_id_fkey';
            columns: ['ab_test_id'];
            isOneToOne: false;
            referencedRelation: 'ab_tests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ab_test_significance_control_variant_id_fkey';
            columns: ['control_variant_id'];
            isOneToOne: false;
            referencedRelation: 'ab_test_variants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ab_test_significance_test_variant_id_fkey';
            columns: ['test_variant_id'];
            isOneToOne: false;
            referencedRelation: 'ab_test_variants';
            referencedColumns: ['id'];
          },
        ];
      };
      ab_test_variants: {
        Row: {
          ab_test_id: string;
          created_at: string | null;
          description: string | null;
          form_configuration: Json;
          id: string;
          is_control: boolean;
          name: string;
          traffic_weight: number;
          updated_at: string | null;
        };
        Insert: {
          ab_test_id: string;
          created_at?: string | null;
          description?: string | null;
          form_configuration: Json;
          id?: string;
          is_control?: boolean;
          name: string;
          traffic_weight?: number;
          updated_at?: string | null;
        };
        Update: {
          ab_test_id?: string;
          created_at?: string | null;
          description?: string | null;
          form_configuration?: Json;
          id?: string;
          is_control?: boolean;
          name?: string;
          traffic_weight?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'ab_test_variants_ab_test_id_fkey';
            columns: ['ab_test_id'];
            isOneToOne: false;
            referencedRelation: 'ab_tests';
            referencedColumns: ['id'];
          },
        ];
      };
      ab_tests: {
        Row: {
          confidence_level: number;
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          end_date: string | null;
          form_id: string;
          id: string;
          minimum_sample_size: number;
          name: string;
          start_date: string | null;
          status: string;
          traffic_allocation: number;
          updated_at: string | null;
          winner_variant_id: string | null;
        };
        Insert: {
          confidence_level?: number;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          end_date?: string | null;
          form_id: string;
          id?: string;
          minimum_sample_size?: number;
          name: string;
          start_date?: string | null;
          status?: string;
          traffic_allocation?: number;
          updated_at?: string | null;
          winner_variant_id?: string | null;
        };
        Update: {
          confidence_level?: number;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          end_date?: string | null;
          form_id?: string;
          id?: string;
          minimum_sample_size?: number;
          name?: string;
          start_date?: string | null;
          status?: string;
          traffic_allocation?: number;
          updated_at?: string | null;
          winner_variant_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'ab_tests_form_id_fkey';
            columns: ['form_id'];
            isOneToOne: false;
            referencedRelation: 'form_configurations';
            referencedColumns: ['id'];
          },
        ];
      };
      ai_activity: {
        Row: {
          action: string;
          agent_id: string;
          created_at: string | null;
          error_details: string | null;
          execution_duration_ms: number | null;
          human_approved: boolean | null;
          id: number;
          result: string | null;
          task_context: Json | null;
          timestamp: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          agent_id: string;
          created_at?: string | null;
          error_details?: string | null;
          execution_duration_ms?: number | null;
          human_approved?: boolean | null;
          id?: number;
          result?: string | null;
          task_context?: Json | null;
          timestamp?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          agent_id?: string;
          created_at?: string | null;
          error_details?: string | null;
          execution_duration_ms?: number | null;
          human_approved?: boolean | null;
          id?: number;
          result?: string | null;
          task_context?: Json | null;
          timestamp?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      auto_booking_requests: {
        Row: {
          created_at: string | null;
          criteria: Json;
          id: string;
          latest_booking_request_id: string | null;
          price_history: Json | null;
          status: string;
          trip_request_id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          criteria: Json;
          id?: string;
          latest_booking_request_id?: string | null;
          price_history?: Json | null;
          status?: string;
          trip_request_id: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          criteria?: Json;
          id?: string;
          latest_booking_request_id?: string | null;
          price_history?: Json | null;
          status?: string;
          trip_request_id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'auto_booking_requests_trip_request_id_fkey';
            columns: ['trip_request_id'];
            isOneToOne: false;
            referencedRelation: 'trip_requests';
            referencedColumns: ['id'];
          },
        ];
      };
      booking_attempts: {
        Row: {
          attempt_timestamp: string;
          created_at: string | null;
          duffel_booking_reference: string | null;
          duffel_offer_id: string | null;
          ended_at: string | null;
          error_message: string | null;
          id: string;
          idempotency_key: string | null;
          started_at: string | null;
          status: string | null;
          stripe_charge_id: string | null;
          trip_request_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          attempt_timestamp?: string;
          created_at?: string | null;
          duffel_booking_reference?: string | null;
          duffel_offer_id?: string | null;
          ended_at?: string | null;
          error_message?: string | null;
          id?: string;
          idempotency_key?: string | null;
          started_at?: string | null;
          status?: string | null;
          stripe_charge_id?: string | null;
          trip_request_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          attempt_timestamp?: string;
          created_at?: string | null;
          duffel_booking_reference?: string | null;
          duffel_offer_id?: string | null;
          ended_at?: string | null;
          error_message?: string | null;
          id?: string;
          idempotency_key?: string | null;
          started_at?: string | null;
          status?: string | null;
          stripe_charge_id?: string | null;
          trip_request_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'booking_attempts_trip_request_id_fkey';
            columns: ['trip_request_id'];
            isOneToOne: false;
            referencedRelation: 'trip_requests';
            referencedColumns: ['id'];
          },
        ];
      };
      booking_requests: {
        Row: {
          attempts: number;
          auto: boolean;
          checkout_session_id: string | null;
          created_at: string;
          duffel_offer_data: Json | null;
          duffel_offer_id: string | null;
          error_message: string | null;
          id: string;
          offer_data: Json;
          offer_id: string;
          payment_captured: boolean;
          processed_at: string | null;
          reminder_scheduled: boolean;
          status: Database['public']['Enums']['booking_request_status'];
          traveler_data: Json | null;
          trip_request_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          attempts?: number;
          auto?: boolean;
          checkout_session_id?: string | null;
          created_at?: string;
          duffel_offer_data?: Json | null;
          duffel_offer_id?: string | null;
          error_message?: string | null;
          id?: string;
          offer_data: Json;
          offer_id: string;
          payment_captured?: boolean;
          processed_at?: string | null;
          reminder_scheduled?: boolean;
          status?: Database['public']['Enums']['booking_request_status'];
          traveler_data?: Json | null;
          trip_request_id?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          attempts?: number;
          auto?: boolean;
          checkout_session_id?: string | null;
          created_at?: string;
          duffel_offer_data?: Json | null;
          duffel_offer_id?: string | null;
          error_message?: string | null;
          id?: string;
          offer_data?: Json;
          offer_id?: string;
          payment_captured?: boolean;
          processed_at?: string | null;
          reminder_scheduled?: boolean;
          status?: Database['public']['Enums']['booking_request_status'];
          traveler_data?: Json | null;
          trip_request_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'booking_requests_offer_id_fkey';
            columns: ['offer_id'];
            isOneToOne: false;
            referencedRelation: 'flight_offers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'booking_requests_trip_request_id_fkey';
            columns: ['trip_request_id'];
            isOneToOne: false;
            referencedRelation: 'trip_requests';
            referencedColumns: ['id'];
          },
        ];
      };
      bookings: {
        Row: {
          amadeus_order_id: string | null;
          booked_at: string;
          booking_attempt_id: string;
          booking_request_id: string | null;
          duffel_order_data: Json | null;
          duffel_order_id: string | null;
          duffel_payment_intent_id: string | null;
          duffel_raw_order: Json | null;
          duffel_status:
            | Database['public']['Enums']['duffel_booking_status']
            | null;
          email_reminder_sent: boolean;
          expires_at: string | null;
          flight_details: Json | null;
          flight_offer_id: string;
          id: string;
          one_hour_email_sent: boolean;
          one_hour_sms_sent: boolean;
          passenger_data: Json | null;
          payment_intent_id: string | null;
          payment_status: string;
          pnr: string | null;
          price: number | null;
          provider: string | null;
          seat_fee: number | null;
          second_reminder_scheduled_at: string | null;
          selected_seat_number: string | null;
          sms_reminder_sent: boolean;
          source: string | null;
          status: Database['public']['Enums']['booking_status_enum'] | null;
          stripe_payment_intent_id: string | null;
          ticket_numbers: Json | null;
          trip_request_id: string;
          user_id: string;
        };
        Insert: {
          amadeus_order_id?: string | null;
          booked_at?: string;
          booking_attempt_id?: string;
          booking_request_id?: string | null;
          duffel_order_data?: Json | null;
          duffel_order_id?: string | null;
          duffel_payment_intent_id?: string | null;
          duffel_raw_order?: Json | null;
          duffel_status?:
            | Database['public']['Enums']['duffel_booking_status']
            | null;
          email_reminder_sent?: boolean;
          expires_at?: string | null;
          flight_details?: Json | null;
          flight_offer_id: string;
          id?: string;
          one_hour_email_sent?: boolean;
          one_hour_sms_sent?: boolean;
          passenger_data?: Json | null;
          payment_intent_id?: string | null;
          payment_status?: string;
          pnr?: string | null;
          price?: number | null;
          provider?: string | null;
          seat_fee?: number | null;
          second_reminder_scheduled_at?: string | null;
          selected_seat_number?: string | null;
          sms_reminder_sent?: boolean;
          source?: string | null;
          status?: Database['public']['Enums']['booking_status_enum'] | null;
          stripe_payment_intent_id?: string | null;
          ticket_numbers?: Json | null;
          trip_request_id: string;
          user_id: string;
        };
        Update: {
          amadeus_order_id?: string | null;
          booked_at?: string;
          booking_attempt_id?: string;
          booking_request_id?: string | null;
          duffel_order_data?: Json | null;
          duffel_order_id?: string | null;
          duffel_payment_intent_id?: string | null;
          duffel_raw_order?: Json | null;
          duffel_status?:
            | Database['public']['Enums']['duffel_booking_status']
            | null;
          email_reminder_sent?: boolean;
          expires_at?: string | null;
          flight_details?: Json | null;
          flight_offer_id?: string;
          id?: string;
          one_hour_email_sent?: boolean;
          one_hour_sms_sent?: boolean;
          passenger_data?: Json | null;
          payment_intent_id?: string | null;
          payment_status?: string;
          pnr?: string | null;
          price?: number | null;
          provider?: string | null;
          seat_fee?: number | null;
          second_reminder_scheduled_at?: string | null;
          selected_seat_number?: string | null;
          sms_reminder_sent?: boolean;
          source?: string | null;
          status?: Database['public']['Enums']['booking_status_enum'] | null;
          stripe_payment_intent_id?: string | null;
          ticket_numbers?: Json | null;
          trip_request_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'bookings_booking_request_id_fkey';
            columns: ['booking_request_id'];
            isOneToOne: false;
            referencedRelation: 'booking_requests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_flight_offer_id_fkey';
            columns: ['flight_offer_id'];
            isOneToOne: false;
            referencedRelation: 'flight_offers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'bookings_trip_request_id_fkey';
            columns: ['trip_request_id'];
            isOneToOne: false;
            referencedRelation: 'trip_requests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fk_bookings_booking_request';
            columns: ['booking_request_id'];
            isOneToOne: false;
            referencedRelation: 'booking_requests';
            referencedColumns: ['id'];
          },
        ];
      };
      campaign_bookings: {
        Row: {
          booking_reference: string | null;
          booking_status: string | null;
          campaign_id: string;
          created_at: string | null;
          currency: string;
          duffel_order_id: string | null;
          exchange_rate_used: number | null;
          flight_details: Json | null;
          id: string;
          original_currency: string | null;
          payment_status: string | null;
          pnr: string | null;
          stripe_payment_intent_id: string | null;
          total_amount: number;
          total_amount_user_currency: number | null;
          updated_at: string | null;
          user_currency: string | null;
          user_id: string;
        };
        Insert: {
          booking_reference?: string | null;
          booking_status?: string | null;
          campaign_id: string;
          created_at?: string | null;
          currency: string;
          duffel_order_id?: string | null;
          exchange_rate_used?: number | null;
          flight_details?: Json | null;
          id?: string;
          original_currency?: string | null;
          payment_status?: string | null;
          pnr?: string | null;
          stripe_payment_intent_id?: string | null;
          total_amount: number;
          total_amount_user_currency?: number | null;
          updated_at?: string | null;
          user_currency?: string | null;
          user_id: string;
        };
        Update: {
          booking_reference?: string | null;
          booking_status?: string | null;
          campaign_id?: string;
          created_at?: string | null;
          currency?: string;
          duffel_order_id?: string | null;
          exchange_rate_used?: number | null;
          flight_details?: Json | null;
          id?: string;
          original_currency?: string | null;
          payment_status?: string | null;
          pnr?: string | null;
          stripe_payment_intent_id?: string | null;
          total_amount?: number;
          total_amount_user_currency?: number | null;
          updated_at?: string | null;
          user_currency?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'campaign_bookings_campaign_id_fkey';
            columns: ['campaign_id'];
            isOneToOne: false;
            referencedRelation: 'campaigns';
            referencedColumns: ['id'];
          },
        ];
      };
      campaigns: {
        Row: {
          bookings_made: number | null;
          cabin_class: string | null;
          converted_max_price: number | null;
          created_at: string | null;
          currency: string | null;
          departure_date_end: string | null;
          departure_date_start: string | null;
          description: string | null;
          destination: string;
          exchange_rate: number | null;
          expires_at: string | null;
          id: string;
          last_searched_at: string | null;
          max_bookings: number | null;
          max_price: number;
          name: string | null;
          next_search_at: string | null;
          origin: string;
          original_currency: string | null;
          payment_method_id: string;
          requires_verification: boolean | null;
          return_date_end: string | null;
          return_date_start: string | null;
          search_frequency_hours: number | null;
          status: string | null;
          traveler_profile_id: string;
          updated_at: string | null;
          user_currency: string | null;
          user_id: string;
          verification_completed_at: string | null;
        };
        Insert: {
          bookings_made?: number | null;
          cabin_class?: string | null;
          converted_max_price?: number | null;
          created_at?: string | null;
          currency?: string | null;
          departure_date_end?: string | null;
          departure_date_start?: string | null;
          description?: string | null;
          destination: string;
          exchange_rate?: number | null;
          expires_at?: string | null;
          id?: string;
          last_searched_at?: string | null;
          max_bookings?: number | null;
          max_price: number;
          name?: string | null;
          next_search_at?: string | null;
          origin: string;
          original_currency?: string | null;
          payment_method_id: string;
          requires_verification?: boolean | null;
          return_date_end?: string | null;
          return_date_start?: string | null;
          search_frequency_hours?: number | null;
          status?: string | null;
          traveler_profile_id: string;
          updated_at?: string | null;
          user_currency?: string | null;
          user_id: string;
          verification_completed_at?: string | null;
        };
        Update: {
          bookings_made?: number | null;
          cabin_class?: string | null;
          converted_max_price?: number | null;
          created_at?: string | null;
          currency?: string | null;
          departure_date_end?: string | null;
          departure_date_start?: string | null;
          description?: string | null;
          destination?: string;
          exchange_rate?: number | null;
          expires_at?: string | null;
          id?: string;
          last_searched_at?: string | null;
          max_bookings?: number | null;
          max_price?: number;
          name?: string | null;
          next_search_at?: string | null;
          origin?: string;
          original_currency?: string | null;
          payment_method_id?: string;
          requires_verification?: boolean | null;
          return_date_end?: string | null;
          return_date_start?: string | null;
          search_frequency_hours?: number | null;
          status?: string | null;
          traveler_profile_id?: string;
          updated_at?: string | null;
          user_currency?: string | null;
          user_id?: string;
          verification_completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'campaigns_payment_method_id_fkey';
            columns: ['payment_method_id'];
            isOneToOne: false;
            referencedRelation: 'payment_methods';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'campaigns_traveler_profile_id_fkey';
            columns: ['traveler_profile_id'];
            isOneToOne: false;
            referencedRelation: 'traveler_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      critical_notification_queue: {
        Row: {
          created_at: string | null;
          error_message: string | null;
          id: string;
          message: Json;
          priority: number | null;
          processed_at: string | null;
          processing_started_at: string | null;
          queue_name: string | null;
          retry_count: number | null;
          scheduled_for: string | null;
        };
        Insert: {
          created_at?: string | null;
          error_message?: string | null;
          id?: string;
          message: Json;
          priority?: number | null;
          processed_at?: string | null;
          processing_started_at?: string | null;
          queue_name?: string | null;
          retry_count?: number | null;
          scheduled_for?: string | null;
        };
        Update: {
          created_at?: string | null;
          error_message?: string | null;
          id?: string;
          message?: Json;
          priority?: number | null;
          processed_at?: string | null;
          processing_started_at?: string | null;
          queue_name?: string | null;
          retry_count?: number | null;
          scheduled_for?: string | null;
        };
        Relationships: [];
      };
      duffel_payment_methods: {
        Row: {
          card_brand: string;
          card_last4: string;
          created_at: string | null;
          duffel_payment_intent_id: string;
          exp_month: number;
          exp_year: number;
          id: string;
          is_active: boolean | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          card_brand: string;
          card_last4: string;
          created_at?: string | null;
          duffel_payment_intent_id: string;
          exp_month: number;
          exp_year: number;
          id?: string;
          is_active?: boolean | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          card_brand?: string;
          card_last4?: string;
          created_at?: string | null;
          duffel_payment_intent_id?: string;
          exp_month?: number;
          exp_year?: number;
          id?: string;
          is_active?: boolean | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      duffel_webhook_events: {
        Row: {
          event_id: string;
          event_type: string;
          id: string;
          order_id: string | null;
          payload: Json;
          processed: boolean | null;
          processed_at: string | null;
          processing_error: string | null;
          received_at: string | null;
        };
        Insert: {
          event_id: string;
          event_type: string;
          id?: string;
          order_id?: string | null;
          payload: Json;
          processed?: boolean | null;
          processed_at?: string | null;
          processing_error?: string | null;
          received_at?: string | null;
        };
        Update: {
          event_id?: string;
          event_type?: string;
          id?: string;
          order_id?: string | null;
          payload?: Json;
          processed?: boolean | null;
          processed_at?: string | null;
          processing_error?: string | null;
          received_at?: string | null;
        };
        Relationships: [];
      };
      error_logs: {
        Row: {
          context: Json | null;
          created_at: string | null;
          environment: string;
          error_message: string;
          error_type: string;
          function_name: string | null;
          id: string;
          resolved: boolean | null;
          resolved_at: string | null;
          resolved_by: string | null;
          severity: string;
          stack_trace: string | null;
          user_id: string | null;
        };
        Insert: {
          context?: Json | null;
          created_at?: string | null;
          environment?: string;
          error_message: string;
          error_type: string;
          function_name?: string | null;
          id?: string;
          resolved?: boolean | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          severity: string;
          stack_trace?: string | null;
          user_id?: string | null;
        };
        Update: {
          context?: Json | null;
          created_at?: string | null;
          environment?: string;
          error_message?: string;
          error_type?: string;
          function_name?: string | null;
          id?: string;
          resolved?: boolean | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          severity?: string;
          stack_trace?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      events: {
        Row: {
          created_at: string | null;
          event_data: Json | null;
          event_type: string;
          id: string;
          ip_address: unknown | null;
          session_id: string | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_data?: Json | null;
          event_type: string;
          id?: string;
          ip_address?: unknown | null;
          session_id?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_data?: Json | null;
          event_type?: string;
          id?: string;
          ip_address?: unknown | null;
          session_id?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      exchange_rates: {
        Row: {
          created_at: string | null;
          from_currency: string;
          id: string;
          last_updated: string | null;
          rate: number;
          to_currency: string;
        };
        Insert: {
          created_at?: string | null;
          from_currency: string;
          id?: string;
          last_updated?: string | null;
          rate: number;
          to_currency: string;
        };
        Update: {
          created_at?: string | null;
          from_currency?: string;
          id?: string;
          last_updated?: string | null;
          rate?: number;
          to_currency?: string;
        };
        Relationships: [];
      };
      feature_flags: {
        Row: {
          created_at: string | null;
          description: string | null;
          enabled: boolean;
          id: string;
          metadata: Json | null;
          name: string;
          rollout_percentage: number | null;
          updated_at: string | null;
          user_segments: string[] | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          enabled?: boolean;
          id?: string;
          metadata?: Json | null;
          name: string;
          rollout_percentage?: number | null;
          updated_at?: string | null;
          user_segments?: string[] | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          enabled?: boolean;
          id?: string;
          metadata?: Json | null;
          name?: string;
          rollout_percentage?: number | null;
          updated_at?: string | null;
          user_segments?: string[] | null;
        };
        Relationships: [];
      };
      flight_matches: {
        Row: {
          created_at: string;
          depart_at: string;
          flight_offer_id: string;
          id: string;
          notified: boolean;
          price: number;
          trip_request_id: string;
        };
        Insert: {
          created_at?: string;
          depart_at: string;
          flight_offer_id: string;
          id?: string;
          notified?: boolean;
          price: number;
          trip_request_id: string;
        };
        Update: {
          created_at?: string;
          depart_at?: string;
          flight_offer_id?: string;
          id?: string;
          notified?: boolean;
          price?: number;
          trip_request_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'flight_matches_flight_offer_id_fkey';
            columns: ['flight_offer_id'];
            isOneToOne: false;
            referencedRelation: 'flight_offers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'flight_matches_trip_request_id_fkey';
            columns: ['trip_request_id'];
            isOneToOne: false;
            referencedRelation: 'trip_requests';
            referencedColumns: ['id'];
          },
        ];
      };
      flight_offers: {
        Row: {
          airline: string;
          auto_book: boolean;
          baggage_included: boolean;
          booking_url: string | null;
          carrier_code: string | null;
          created_at: string;
          departure_date: string;
          departure_time: string;
          destination_airport: string | null;
          duration: string;
          flight_number: string;
          id: string;
          layover_airports: string[] | null;
          origin_airport: string | null;
          price: number;
          provider: string | null;
          return_date: string;
          return_time: string;
          selected_seat_type: string | null;
          stops: number;
          trip_request_id: string;
        };
        Insert: {
          airline: string;
          auto_book?: boolean;
          baggage_included?: boolean;
          booking_url?: string | null;
          carrier_code?: string | null;
          created_at?: string;
          departure_date: string;
          departure_time: string;
          destination_airport?: string | null;
          duration: string;
          flight_number: string;
          id?: string;
          layover_airports?: string[] | null;
          origin_airport?: string | null;
          price: number;
          provider?: string | null;
          return_date: string;
          return_time: string;
          selected_seat_type?: string | null;
          stops?: number;
          trip_request_id: string;
        };
        Update: {
          airline?: string;
          auto_book?: boolean;
          baggage_included?: boolean;
          booking_url?: string | null;
          carrier_code?: string | null;
          created_at?: string;
          departure_date?: string;
          departure_time?: string;
          destination_airport?: string | null;
          duration?: string;
          flight_number?: string;
          id?: string;
          layover_airports?: string[] | null;
          origin_airport?: string | null;
          price?: number;
          provider?: string | null;
          return_date?: string;
          return_time?: string;
          selected_seat_type?: string | null;
          stops?: number;
          trip_request_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'flight_offers_trip_request_id_fkey';
            columns: ['trip_request_id'];
            isOneToOne: false;
            referencedRelation: 'trip_requests';
            referencedColumns: ['id'];
          },
        ];
      };
      flight_offers_v2: {
        Row: {
          bags_included: boolean;
          booking_url: string | null;
          cabin_class: string | null;
          created_at: string;
          depart_dt: string;
          destination_iata: string;
          external_offer_id: string | null;
          id: string;
          mode: string;
          nonstop: boolean;
          origin_iata: string;
          price_carry_on: number | null;
          price_currency: string | null;
          price_total: number;
          raw_offer_payload: Json | null;
          return_dt: string | null;
          seat_pref: string | null;
          trip_request_id: string;
        };
        Insert: {
          bags_included?: boolean;
          booking_url?: string | null;
          cabin_class?: string | null;
          created_at?: string;
          depart_dt: string;
          destination_iata: string;
          external_offer_id?: string | null;
          id?: string;
          mode?: string;
          nonstop: boolean;
          origin_iata: string;
          price_carry_on?: number | null;
          price_currency?: string | null;
          price_total: number;
          raw_offer_payload?: Json | null;
          return_dt?: string | null;
          seat_pref?: string | null;
          trip_request_id: string;
        };
        Update: {
          bags_included?: boolean;
          booking_url?: string | null;
          cabin_class?: string | null;
          created_at?: string;
          depart_dt?: string;
          destination_iata?: string;
          external_offer_id?: string | null;
          id?: string;
          mode?: string;
          nonstop?: boolean;
          origin_iata?: string;
          price_carry_on?: number | null;
          price_currency?: string | null;
          price_total?: number;
          raw_offer_payload?: Json | null;
          return_dt?: string | null;
          seat_pref?: string | null;
          trip_request_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'flight_offers_v2_trip_request_id_fkey';
            columns: ['trip_request_id'];
            isOneToOne: false;
            referencedRelation: 'trip_requests';
            referencedColumns: ['id'];
          },
        ];
      };
      form_ab_test_results: {
        Row: {
          confidence_level: number | null;
          created_at: string | null;
          end_date: string | null;
          form_a_completions: number | null;
          form_a_config_id: string | null;
          form_a_views: number | null;
          form_b_completions: number | null;
          form_b_config_id: string | null;
          form_b_views: number | null;
          id: string;
          is_significant: boolean | null;
          p_value: number | null;
          start_date: string;
          test_name: string;
          updated_at: string | null;
          winner: string | null;
        };
        Insert: {
          confidence_level?: number | null;
          created_at?: string | null;
          end_date?: string | null;
          form_a_completions?: number | null;
          form_a_config_id?: string | null;
          form_a_views?: number | null;
          form_b_completions?: number | null;
          form_b_config_id?: string | null;
          form_b_views?: number | null;
          id?: string;
          is_significant?: boolean | null;
          p_value?: number | null;
          start_date: string;
          test_name: string;
          updated_at?: string | null;
          winner?: string | null;
        };
        Update: {
          confidence_level?: number | null;
          created_at?: string | null;
          end_date?: string | null;
          form_a_completions?: number | null;
          form_a_config_id?: string | null;
          form_a_views?: number | null;
          form_b_completions?: number | null;
          form_b_config_id?: string | null;
          form_b_views?: number | null;
          id?: string;
          is_significant?: boolean | null;
          p_value?: number | null;
          start_date?: string;
          test_name?: string;
          updated_at?: string | null;
          winner?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'form_ab_test_results_form_a_config_id_fkey';
            columns: ['form_a_config_id'];
            isOneToOne: false;
            referencedRelation: 'form_configurations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_ab_test_results_form_b_config_id_fkey';
            columns: ['form_b_config_id'];
            isOneToOne: false;
            referencedRelation: 'form_configurations';
            referencedColumns: ['id'];
          },
        ];
      };
      form_ab_tests: {
        Row: {
          confidence_level: number | null;
          control_config_id: string;
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          id: string;
          minimum_sample_size: number | null;
          name: string;
          results: Json | null;
          start_date: string | null;
          status: string | null;
          success_metric: string;
          traffic_split: number | null;
          updated_at: string | null;
          variant_config_id: string;
          winner_config_id: string | null;
        };
        Insert: {
          confidence_level?: number | null;
          control_config_id: string;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          minimum_sample_size?: number | null;
          name: string;
          results?: Json | null;
          start_date?: string | null;
          status?: string | null;
          success_metric: string;
          traffic_split?: number | null;
          updated_at?: string | null;
          variant_config_id: string;
          winner_config_id?: string | null;
        };
        Update: {
          confidence_level?: number | null;
          control_config_id?: string;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          minimum_sample_size?: number | null;
          name?: string;
          results?: Json | null;
          start_date?: string | null;
          status?: string | null;
          success_metric?: string;
          traffic_split?: number | null;
          updated_at?: string | null;
          variant_config_id?: string;
          winner_config_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'form_ab_tests_control_config_id_fkey';
            columns: ['control_config_id'];
            isOneToOne: false;
            referencedRelation: 'form_configurations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_ab_tests_variant_config_id_fkey';
            columns: ['variant_config_id'];
            isOneToOne: false;
            referencedRelation: 'form_configurations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_ab_tests_winner_config_id_fkey';
            columns: ['winner_config_id'];
            isOneToOne: false;
            referencedRelation: 'form_configurations';
            referencedColumns: ['id'];
          },
        ];
      };
      form_analytics_events: {
        Row: {
          created_at: string | null;
          duration_ms: number | null;
          event_data: Json | null;
          event_type: string;
          field_id: string | null;
          field_type: string | null;
          field_value: string | null;
          form_config_id: string | null;
          form_name: string;
          form_version: number;
          id: string;
          ip_address: unknown | null;
          referrer: string | null;
          session_id: string;
          timestamp_ms: number;
          user_agent: string | null;
          user_id: string | null;
          validation_error: string | null;
        };
        Insert: {
          created_at?: string | null;
          duration_ms?: number | null;
          event_data?: Json | null;
          event_type: string;
          field_id?: string | null;
          field_type?: string | null;
          field_value?: string | null;
          form_config_id?: string | null;
          form_name: string;
          form_version: number;
          id?: string;
          ip_address?: unknown | null;
          referrer?: string | null;
          session_id: string;
          timestamp_ms: number;
          user_agent?: string | null;
          user_id?: string | null;
          validation_error?: string | null;
        };
        Update: {
          created_at?: string | null;
          duration_ms?: number | null;
          event_data?: Json | null;
          event_type?: string;
          field_id?: string | null;
          field_type?: string | null;
          field_value?: string | null;
          form_config_id?: string | null;
          form_name?: string;
          form_version?: number;
          id?: string;
          ip_address?: unknown | null;
          referrer?: string | null;
          session_id?: string;
          timestamp_ms?: number;
          user_agent?: string | null;
          user_id?: string | null;
          validation_error?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'form_analytics_events_form_config_id_fkey';
            columns: ['form_config_id'];
            isOneToOne: false;
            referencedRelation: 'form_configurations';
            referencedColumns: ['id'];
          },
        ];
      };
      form_completion_analytics: {
        Row: {
          abandonment_rate: number | null;
          avg_completion_time_ms: number | null;
          avg_time_to_first_interaction_ms: number | null;
          completion_rate: number | null;
          created_at: string | null;
          date: string;
          error_rate: number | null;
          field_analytics: Json | null;
          form_config_id: string | null;
          form_name: string;
          id: string;
          total_abandons: number | null;
          total_completions: number | null;
          total_starts: number | null;
          total_submissions: number | null;
          total_views: number | null;
          updated_at: string | null;
        };
        Insert: {
          abandonment_rate?: number | null;
          avg_completion_time_ms?: number | null;
          avg_time_to_first_interaction_ms?: number | null;
          completion_rate?: number | null;
          created_at?: string | null;
          date: string;
          error_rate?: number | null;
          field_analytics?: Json | null;
          form_config_id?: string | null;
          form_name: string;
          id?: string;
          total_abandons?: number | null;
          total_completions?: number | null;
          total_starts?: number | null;
          total_submissions?: number | null;
          total_views?: number | null;
          updated_at?: string | null;
        };
        Update: {
          abandonment_rate?: number | null;
          avg_completion_time_ms?: number | null;
          avg_time_to_first_interaction_ms?: number | null;
          completion_rate?: number | null;
          created_at?: string | null;
          date?: string;
          error_rate?: number | null;
          field_analytics?: Json | null;
          form_config_id?: string | null;
          form_name?: string;
          id?: string;
          total_abandons?: number | null;
          total_completions?: number | null;
          total_starts?: number | null;
          total_submissions?: number | null;
          total_views?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'form_completion_analytics_form_config_id_fkey';
            columns: ['form_config_id'];
            isOneToOne: false;
            referencedRelation: 'form_configurations';
            referencedColumns: ['id'];
          },
        ];
      };
      form_config_audit: {
        Row: {
          action: string;
          changed_by: string | null;
          changes: Json | null;
          config_id: string;
          id: string;
          ip_address: unknown | null;
          security_validation: Json | null;
          timestamp: string | null;
          user_agent: string | null;
          validation_errors: Json | null;
          validation_passed: boolean | null;
        };
        Insert: {
          action: string;
          changed_by?: string | null;
          changes?: Json | null;
          config_id: string;
          id?: string;
          ip_address?: unknown | null;
          security_validation?: Json | null;
          timestamp?: string | null;
          user_agent?: string | null;
          validation_errors?: Json | null;
          validation_passed?: boolean | null;
        };
        Update: {
          action?: string;
          changed_by?: string | null;
          changes?: Json | null;
          config_id?: string;
          id?: string;
          ip_address?: unknown | null;
          security_validation?: Json | null;
          timestamp?: string | null;
          user_agent?: string | null;
          validation_errors?: Json | null;
          validation_passed?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'form_config_audit_config_id_fkey';
            columns: ['config_id'];
            isOneToOne: false;
            referencedRelation: 'form_configurations';
            referencedColumns: ['id'];
          },
        ];
      };
      form_configurations: {
        Row: {
          archived_at: string | null;
          canary_percentage: number | null;
          config_data: Json;
          created_at: string | null;
          created_by: string | null;
          deployed_at: string | null;
          deployment_strategy:
            | Database['public']['Enums']['deployment_strategy']
            | null;
          encrypted_config: string | null;
          encryption_key_type: string | null;
          encryption_version: number | null;
          id: string;
          name: string;
          rollback_config_id: string | null;
          status: Database['public']['Enums']['form_status'] | null;
          ui_schema: Json | null;
          updated_at: string | null;
          validation_schema: Json;
          version: number;
        };
        Insert: {
          archived_at?: string | null;
          canary_percentage?: number | null;
          config_data: Json;
          created_at?: string | null;
          created_by?: string | null;
          deployed_at?: string | null;
          deployment_strategy?:
            | Database['public']['Enums']['deployment_strategy']
            | null;
          encrypted_config?: string | null;
          encryption_key_type?: string | null;
          encryption_version?: number | null;
          id?: string;
          name: string;
          rollback_config_id?: string | null;
          status?: Database['public']['Enums']['form_status'] | null;
          ui_schema?: Json | null;
          updated_at?: string | null;
          validation_schema: Json;
          version?: number;
        };
        Update: {
          archived_at?: string | null;
          canary_percentage?: number | null;
          config_data?: Json;
          created_at?: string | null;
          created_by?: string | null;
          deployed_at?: string | null;
          deployment_strategy?:
            | Database['public']['Enums']['deployment_strategy']
            | null;
          encrypted_config?: string | null;
          encryption_key_type?: string | null;
          encryption_version?: number | null;
          id?: string;
          name?: string;
          rollback_config_id?: string | null;
          status?: Database['public']['Enums']['form_status'] | null;
          ui_schema?: Json | null;
          updated_at?: string | null;
          validation_schema?: Json;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'form_configurations_rollback_config_id_fkey';
            columns: ['rollback_config_id'];
            isOneToOne: false;
            referencedRelation: 'form_configurations';
            referencedColumns: ['id'];
          },
        ];
      };
      form_deployments: {
        Row: {
          completed_at: string | null;
          config_id: string;
          deployed_at: string | null;
          deployed_by: string | null;
          deployment_strategy: Database['public']['Enums']['deployment_strategy'];
          health_check_results: Json | null;
          id: string;
          metrics: Json | null;
          rolled_back_at: string | null;
          status: string | null;
          target_percentage: number | null;
          user_segment: Json | null;
        };
        Insert: {
          completed_at?: string | null;
          config_id: string;
          deployed_at?: string | null;
          deployed_by?: string | null;
          deployment_strategy: Database['public']['Enums']['deployment_strategy'];
          health_check_results?: Json | null;
          id?: string;
          metrics?: Json | null;
          rolled_back_at?: string | null;
          status?: string | null;
          target_percentage?: number | null;
          user_segment?: Json | null;
        };
        Update: {
          completed_at?: string | null;
          config_id?: string;
          deployed_at?: string | null;
          deployed_by?: string | null;
          deployment_strategy?: Database['public']['Enums']['deployment_strategy'];
          health_check_results?: Json | null;
          id?: string;
          metrics?: Json | null;
          rolled_back_at?: string | null;
          status?: string | null;
          target_percentage?: number | null;
          user_segment?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'form_deployments_config_id_fkey';
            columns: ['config_id'];
            isOneToOne: false;
            referencedRelation: 'form_configurations';
            referencedColumns: ['id'];
          },
        ];
      };
      form_usage_analytics: {
        Row: {
          config_id: string;
          deployment_id: string | null;
          event_data: Json | null;
          event_type: string;
          field_id: string | null;
          id: string;
          interaction_time_ms: number | null;
          ip_address: unknown | null;
          load_time_ms: number | null;
          session_id: string | null;
          timestamp: string | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          config_id: string;
          deployment_id?: string | null;
          event_data?: Json | null;
          event_type: string;
          field_id?: string | null;
          id?: string;
          interaction_time_ms?: number | null;
          ip_address?: unknown | null;
          load_time_ms?: number | null;
          session_id?: string | null;
          timestamp?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          config_id?: string;
          deployment_id?: string | null;
          event_data?: Json | null;
          event_type?: string;
          field_id?: string | null;
          id?: string;
          interaction_time_ms?: number | null;
          ip_address?: unknown | null;
          load_time_ms?: number | null;
          session_id?: string | null;
          timestamp?: string | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'form_usage_analytics_config_id_fkey';
            columns: ['config_id'];
            isOneToOne: false;
            referencedRelation: 'form_configurations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'form_usage_analytics_deployment_id_fkey';
            columns: ['deployment_id'];
            isOneToOne: false;
            referencedRelation: 'form_deployments';
            referencedColumns: ['id'];
          },
        ];
      };
      form_validation_rules: {
        Row: {
          created_at: string | null;
          description: string | null;
          error_message: string;
          id: string;
          is_active: boolean | null;
          name: string;
          rule_data: Json;
          rule_type: string;
          severity: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          error_message: string;
          id?: string;
          is_active?: boolean | null;
          name: string;
          rule_data: Json;
          rule_type: string;
          severity?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          error_message?: string;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          rule_data?: Json;
          rule_type?: string;
          severity?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      identity_verifications: {
        Row: {
          campaign_id: string | null;
          created_at: string | null;
          id: string;
          purpose: string | null;
          status: string | null;
          stripe_verification_session_id: string;
          traveler_profile_id: string;
          updated_at: string | null;
          user_id: string;
          verification_data: Json | null;
          verified_at: string | null;
        };
        Insert: {
          campaign_id?: string | null;
          created_at?: string | null;
          id?: string;
          purpose?: string | null;
          status?: string | null;
          stripe_verification_session_id: string;
          traveler_profile_id: string;
          updated_at?: string | null;
          user_id: string;
          verification_data?: Json | null;
          verified_at?: string | null;
        };
        Update: {
          campaign_id?: string | null;
          created_at?: string | null;
          id?: string;
          purpose?: string | null;
          status?: string | null;
          stripe_verification_session_id?: string;
          traveler_profile_id?: string;
          updated_at?: string | null;
          user_id?: string;
          verification_data?: Json | null;
          verified_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_identity_verifications_campaign_id';
            columns: ['campaign_id'];
            isOneToOne: false;
            referencedRelation: 'campaigns';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'identity_verifications_traveler_profile_id_fkey';
            columns: ['traveler_profile_id'];
            isOneToOne: false;
            referencedRelation: 'traveler_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      kms_audit_log: {
        Row: {
          error_message: string | null;
          id: string;
          ip_address: unknown | null;
          key_id: string;
          operation: string;
          success: boolean;
          timestamp: string | null;
          user_id: string | null;
        };
        Insert: {
          error_message?: string | null;
          id?: string;
          ip_address?: unknown | null;
          key_id: string;
          operation: string;
          success: boolean;
          timestamp?: string | null;
          user_id?: string | null;
        };
        Update: {
          error_message?: string | null;
          id?: string;
          ip_address?: unknown | null;
          key_id?: string;
          operation?: string;
          success?: boolean;
          timestamp?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      migration_status: {
        Row: {
          completed_at: string | null;
          error_details: string | null;
          failed_records: number | null;
          id: string;
          migrated_records: number | null;
          migration_name: string;
          started_at: string | null;
          status: string;
          total_records: number | null;
        };
        Insert: {
          completed_at?: string | null;
          error_details?: string | null;
          failed_records?: number | null;
          id?: string;
          migrated_records?: number | null;
          migration_name: string;
          started_at?: string | null;
          status?: string;
          total_records?: number | null;
        };
        Update: {
          completed_at?: string | null;
          error_details?: string | null;
          failed_records?: number | null;
          id?: string;
          migrated_records?: number | null;
          migration_name?: string;
          started_at?: string | null;
          status?: string;
          total_records?: number | null;
        };
        Relationships: [];
      };
      notification_deliveries: {
        Row: {
          channel: string;
          created_at: string | null;
          delivered_at: string | null;
          error_message: string | null;
          failed_at: string | null;
          id: string;
          notification_id: string;
          provider_id: string | null;
          provider_response: Json | null;
          retry_count: number | null;
          sent_at: string | null;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          channel: string;
          created_at?: string | null;
          delivered_at?: string | null;
          error_message?: string | null;
          failed_at?: string | null;
          id?: string;
          notification_id: string;
          provider_id?: string | null;
          provider_response?: Json | null;
          retry_count?: number | null;
          sent_at?: string | null;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          channel?: string;
          created_at?: string | null;
          delivered_at?: string | null;
          error_message?: string | null;
          failed_at?: string | null;
          id?: string;
          notification_id?: string;
          provider_id?: string | null;
          provider_response?: Json | null;
          retry_count?: number | null;
          sent_at?: string | null;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_deliveries_notification_id_fkey';
            columns: ['notification_id'];
            isOneToOne: false;
            referencedRelation: 'notifications';
            referencedColumns: ['id'];
          },
        ];
      };
      notification_delivery_log: {
        Row: {
          content: string;
          created_at: string | null;
          delivered_at: string | null;
          error_message: string | null;
          id: string;
          notification_type: string;
          provider: string | null;
          provider_message_id: string | null;
          recipient: string;
          sent_at: string | null;
          status: string;
          subject: string | null;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          delivered_at?: string | null;
          error_message?: string | null;
          id?: string;
          notification_type: string;
          provider?: string | null;
          provider_message_id?: string | null;
          recipient: string;
          sent_at?: string | null;
          status?: string;
          subject?: string | null;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          delivered_at?: string | null;
          error_message?: string | null;
          id?: string;
          notification_type?: string;
          provider?: string | null;
          provider_message_id?: string | null;
          recipient?: string;
          sent_at?: string | null;
          status?: string;
          subject?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      notification_queue: {
        Row: {
          created_at: string | null;
          error_message: string | null;
          id: string;
          message: Json;
          priority: number | null;
          processed_at: string | null;
          processing_started_at: string | null;
          queue_name: string | null;
          retry_count: number | null;
          scheduled_for: string | null;
        };
        Insert: {
          created_at?: string | null;
          error_message?: string | null;
          id?: string;
          message: Json;
          priority?: number | null;
          processed_at?: string | null;
          processing_started_at?: string | null;
          queue_name?: string | null;
          retry_count?: number | null;
          scheduled_for?: string | null;
        };
        Update: {
          created_at?: string | null;
          error_message?: string | null;
          id?: string;
          message?: Json;
          priority?: number | null;
          processed_at?: string | null;
          processing_started_at?: string | null;
          queue_name?: string | null;
          retry_count?: number | null;
          scheduled_for?: string | null;
        };
        Relationships: [];
      };
      notification_templates: {
        Row: {
          active: boolean | null;
          body_html: string | null;
          body_text: string;
          channel: string;
          created_at: string | null;
          id: string;
          language: string | null;
          name: string;
          notification_type: string;
          subject: string | null;
          updated_at: string | null;
          version: number | null;
        };
        Insert: {
          active?: boolean | null;
          body_html?: string | null;
          body_text: string;
          channel: string;
          created_at?: string | null;
          id?: string;
          language?: string | null;
          name: string;
          notification_type: string;
          subject?: string | null;
          updated_at?: string | null;
          version?: number | null;
        };
        Update: {
          active?: boolean | null;
          body_html?: string | null;
          body_text?: string;
          channel?: string;
          created_at?: string | null;
          id?: string;
          language?: string | null;
          name?: string;
          notification_type?: string;
          subject?: string | null;
          updated_at?: string | null;
          version?: number | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          booking_id: string | null;
          booking_request_id: string | null;
          channel: string | null;
          channels: string[] | null;
          content: Json;
          created_at: string;
          data: Json | null;
          id: string;
          is_read: boolean;
          message: string | null;
          payload: Json | null;
          priority: string | null;
          retry_count: number | null;
          scheduled_for: string | null;
          sent_at: string | null;
          status: string | null;
          title: string | null;
          trip_request_id: string | null;
          type: string;
          user_id: string;
        };
        Insert: {
          booking_id?: string | null;
          booking_request_id?: string | null;
          channel?: string | null;
          channels?: string[] | null;
          content?: Json;
          created_at?: string;
          data?: Json | null;
          id?: string;
          is_read?: boolean;
          message?: string | null;
          payload?: Json | null;
          priority?: string | null;
          retry_count?: number | null;
          scheduled_for?: string | null;
          sent_at?: string | null;
          status?: string | null;
          title?: string | null;
          trip_request_id?: string | null;
          type: string;
          user_id: string;
        };
        Update: {
          booking_id?: string | null;
          booking_request_id?: string | null;
          channel?: string | null;
          channels?: string[] | null;
          content?: Json;
          created_at?: string;
          data?: Json | null;
          id?: string;
          is_read?: boolean;
          message?: string | null;
          payload?: Json | null;
          priority?: string | null;
          retry_count?: number | null;
          scheduled_for?: string | null;
          sent_at?: string | null;
          status?: string | null;
          title?: string | null;
          trip_request_id?: string | null;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_notifications_booking_id';
            columns: ['booking_id'];
            isOneToOne: false;
            referencedRelation: 'bookings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_booking_request_id_fkey';
            columns: ['booking_request_id'];
            isOneToOne: false;
            referencedRelation: 'booking_requests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_trip_request_id_fkey';
            columns: ['trip_request_id'];
            isOneToOne: false;
            referencedRelation: 'trip_requests';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          amount: number;
          booking_request_id: string | null;
          checkout_session_id: string | null;
          created_at: string;
          currency: string;
          description: string | null;
          error_message: string | null;
          id: string;
          match_id: string;
          payment_intent_id: string;
          status: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          booking_request_id?: string | null;
          checkout_session_id?: string | null;
          created_at?: string;
          currency?: string;
          description?: string | null;
          error_message?: string | null;
          id?: string;
          match_id: string;
          payment_intent_id: string;
          status?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          booking_request_id?: string | null;
          checkout_session_id?: string | null;
          created_at?: string;
          currency?: string;
          description?: string | null;
          error_message?: string | null;
          id?: string;
          match_id?: string;
          payment_intent_id?: string;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_booking_request_id_fkey';
            columns: ['booking_request_id'];
            isOneToOne: false;
            referencedRelation: 'booking_requests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_match_id_fkey';
            columns: ['match_id'];
            isOneToOne: true;
            referencedRelation: 'flight_matches';
            referencedColumns: ['id'];
          },
        ];
      };
      payment_method_audit: {
        Row: {
          action: string;
          created_at: string | null;
          id: string;
          ip_address: unknown | null;
          new_data: Json | null;
          old_data: Json | null;
          payment_method_id: string | null;
          request_id: string | null;
          user_agent: string | null;
          user_id: string;
        };
        Insert: {
          action: string;
          created_at?: string | null;
          id?: string;
          ip_address?: unknown | null;
          new_data?: Json | null;
          old_data?: Json | null;
          payment_method_id?: string | null;
          request_id?: string | null;
          user_agent?: string | null;
          user_id: string;
        };
        Update: {
          action?: string;
          created_at?: string | null;
          id?: string;
          ip_address?: unknown | null;
          new_data?: Json | null;
          old_data?: Json | null;
          payment_method_id?: string | null;
          request_id?: string | null;
          user_agent?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'payment_method_audit_payment_method_id_fkey';
            columns: ['payment_method_id'];
            isOneToOne: false;
            referencedRelation: 'payment_methods';
            referencedColumns: ['id'];
          },
        ];
      };
      payment_methods: {
        Row: {
          brand: string;
          created_at: string;
          encrypted_card_data: string | null;
          encryption_version: number | null;
          exp_month: number;
          exp_year: number;
          id: string;
          is_default: boolean;
          last4: string;
          nickname: string | null;
          stripe_customer_id: string | null;
          stripe_pm_id: string;
          supported_currencies: string[] | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          brand: string;
          created_at?: string;
          encrypted_card_data?: string | null;
          encryption_version?: number | null;
          exp_month: number;
          exp_year: number;
          id?: string;
          is_default?: boolean;
          last4: string;
          nickname?: string | null;
          stripe_customer_id?: string | null;
          stripe_pm_id: string;
          supported_currencies?: string[] | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          brand?: string;
          created_at?: string;
          encrypted_card_data?: string | null;
          encryption_version?: number | null;
          exp_month?: number;
          exp_year?: number;
          id?: string;
          is_default?: boolean;
          last4?: string;
          nickname?: string | null;
          stripe_customer_id?: string | null;
          stripe_pm_id?: string;
          supported_currencies?: string[] | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          amount: number;
          booking_id: string | null;
          created_at: string;
          currency: string;
          id: string;
          status: Database['public']['Enums']['payment_status_enum'];
          stripe_payment_intent_id: string | null;
          updated_at: string;
        };
        Insert: {
          amount: number;
          booking_id?: string | null;
          created_at?: string;
          currency?: string;
          id?: string;
          status?: Database['public']['Enums']['payment_status_enum'];
          stripe_payment_intent_id?: string | null;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          booking_id?: string | null;
          created_at?: string;
          currency?: string;
          id?: string;
          status?: Database['public']['Enums']['payment_status_enum'];
          stripe_payment_intent_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'payments_booking_id_fkey';
            columns: ['booking_id'];
            isOneToOne: false;
            referencedRelation: 'bookings';
            referencedColumns: ['id'];
          },
        ];
      };
      personalization_events: {
        Row: {
          context: Json | null;
          created_at: string | null;
          event_type: string;
          id: string;
          user_id: string;
        };
        Insert: {
          context?: Json | null;
          created_at?: string | null;
          event_type: string;
          id?: string;
          user_id: string;
        };
        Update: {
          context?: Json | null;
          created_at?: string | null;
          event_type?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'personalization_events_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      phone_verification_attempts: {
        Row: {
          attempts_count: number | null;
          created_at: string | null;
          expires_at: string;
          id: string;
          phone_number: string;
          status: string;
          user_id: string;
          verification_code: string;
          verified_at: string | null;
        };
        Insert: {
          attempts_count?: number | null;
          created_at?: string | null;
          expires_at: string;
          id?: string;
          phone_number: string;
          status?: string;
          user_id: string;
          verification_code: string;
          verified_at?: string | null;
        };
        Update: {
          attempts_count?: number | null;
          created_at?: string | null;
          expires_at?: string;
          id?: string;
          phone_number?: string;
          status?: string;
          user_id?: string;
          verification_code?: string;
          verified_at?: string | null;
        };
        Relationships: [];
      };
      profile_activity_log: {
        Row: {
          activity_details: Json | null;
          activity_type: string;
          completion_score_after: number | null;
          completion_score_before: number | null;
          created_at: string | null;
          id: string;
          ip_address: unknown | null;
          session_id: string | null;
          user_agent: string | null;
          user_id: string;
        };
        Insert: {
          activity_details?: Json | null;
          activity_type: string;
          completion_score_after?: number | null;
          completion_score_before?: number | null;
          created_at?: string | null;
          id?: string;
          ip_address?: unknown | null;
          session_id?: string | null;
          user_agent?: string | null;
          user_id: string;
        };
        Update: {
          activity_details?: Json | null;
          activity_type?: string;
          completion_score_after?: number | null;
          completion_score_before?: number | null;
          created_at?: string | null;
          id?: string;
          ip_address?: unknown | null;
          session_id?: string | null;
          user_agent?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      profile_completion_tracking: {
        Row: {
          completion_percentage: number;
          id: string;
          last_calculated: string | null;
          missing_fields: string[] | null;
          recommendations: Json | null;
          user_id: string;
        };
        Insert: {
          completion_percentage?: number;
          id?: string;
          last_calculated?: string | null;
          missing_fields?: string[] | null;
          recommendations?: Json | null;
          user_id: string;
        };
        Update: {
          completion_percentage?: number;
          id?: string;
          last_calculated?: string | null;
          missing_fields?: string[] | null;
          recommendations?: Json | null;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string | null;
          email: string;
          first_name: string | null;
          id: string;
          last_login_at: string | null;
          last_name: string | null;
          loyalty_tier: string | null;
          next_trip_city: string | null;
          personalization_enabled: boolean | null;
          phone: string | null;
          prefers_email_notifications: boolean | null;
          prefers_sms_notifications: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          first_name?: string | null;
          id: string;
          last_login_at?: string | null;
          last_name?: string | null;
          loyalty_tier?: string | null;
          next_trip_city?: string | null;
          personalization_enabled?: boolean | null;
          phone?: string | null;
          prefers_email_notifications?: boolean | null;
          prefers_sms_notifications?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          first_name?: string | null;
          id?: string;
          last_login_at?: string | null;
          last_name?: string | null;
          loyalty_tier?: string | null;
          next_trip_city?: string | null;
          personalization_enabled?: boolean | null;
          phone?: string | null;
          prefers_email_notifications?: boolean | null;
          prefers_sms_notifications?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      stripe_customers: {
        Row: {
          created_at: string | null;
          id: string;
          stripe_customer_id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          stripe_customer_id: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          stripe_customer_id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      traveler_data_audit: {
        Row: {
          action: string;
          created_at: string | null;
          field_accessed: string | null;
          id: string;
          ip_address: unknown | null;
          new_value: Json | null;
          old_value: Json | null;
          risk_level: string | null;
          session_id: string | null;
          traveler_profile_id: string;
          user_agent: string | null;
          user_id: string;
        };
        Insert: {
          action: string;
          created_at?: string | null;
          field_accessed?: string | null;
          id?: string;
          ip_address?: unknown | null;
          new_value?: Json | null;
          old_value?: Json | null;
          risk_level?: string | null;
          session_id?: string | null;
          traveler_profile_id: string;
          user_agent?: string | null;
          user_id: string;
        };
        Update: {
          action?: string;
          created_at?: string | null;
          field_accessed?: string | null;
          id?: string;
          ip_address?: unknown | null;
          new_value?: Json | null;
          old_value?: Json | null;
          risk_level?: string | null;
          session_id?: string | null;
          traveler_profile_id?: string;
          user_agent?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      traveler_profiles: {
        Row: {
          created_at: string | null;
          date_of_birth: string;
          default_payment_method_id: string | null;
          email: string;
          encryption_version: number | null;
          full_name: string;
          gender: string;
          id: string;
          is_primary: boolean | null;
          is_verified: boolean | null;
          known_traveler_number: string | null;
          last_profile_update: string | null;
          notification_preferences: Json | null;
          passport_country: string | null;
          passport_expiry: string | null;
          passport_number_encrypted: string | null;
          phone: string | null;
          phone_verified: boolean | null;
          profile_completeness_score: number | null;
          stripe_customer_id: string | null;
          travel_preferences: Json | null;
          updated_at: string | null;
          user_id: string;
          verification_level: string | null;
        };
        Insert: {
          created_at?: string | null;
          date_of_birth: string;
          default_payment_method_id?: string | null;
          email: string;
          encryption_version?: number | null;
          full_name: string;
          gender: string;
          id?: string;
          is_primary?: boolean | null;
          is_verified?: boolean | null;
          known_traveler_number?: string | null;
          last_profile_update?: string | null;
          notification_preferences?: Json | null;
          passport_country?: string | null;
          passport_expiry?: string | null;
          passport_number_encrypted?: string | null;
          phone?: string | null;
          phone_verified?: boolean | null;
          profile_completeness_score?: number | null;
          stripe_customer_id?: string | null;
          travel_preferences?: Json | null;
          updated_at?: string | null;
          user_id: string;
          verification_level?: string | null;
        };
        Update: {
          created_at?: string | null;
          date_of_birth?: string;
          default_payment_method_id?: string | null;
          email?: string;
          encryption_version?: number | null;
          full_name?: string;
          gender?: string;
          id?: string;
          is_primary?: boolean | null;
          is_verified?: boolean | null;
          known_traveler_number?: string | null;
          last_profile_update?: string | null;
          notification_preferences?: Json | null;
          passport_country?: string | null;
          passport_expiry?: string | null;
          passport_number_encrypted?: string | null;
          phone?: string | null;
          phone_verified?: boolean | null;
          profile_completeness_score?: number | null;
          stripe_customer_id?: string | null;
          travel_preferences?: Json | null;
          updated_at?: string | null;
          user_id?: string;
          verification_level?: string | null;
        };
        Relationships: [];
      };
      trip_requests: {
        Row: {
          adults: number | null;
          auto_book: boolean;
          auto_book_enabled: boolean;
          baggage_included_required: boolean;
          best_price: number | null;
          budget: number;
          created_at: string;
          departure_airports: string[];
          departure_date: string | null;
          destination_airport: string | null;
          destination_location_code: string;
          duffel_auto_book_enabled: boolean | null;
          earliest_departure: string;
          id: string;
          last_checked_at: string | null;
          latest_departure: string;
          max_duration: number;
          max_price: number | null;
          min_duration: number;
          nonstop_required: boolean;
          origin_location_code: string | null;
          preferred_duffel_payment_method_id: string | null;
          preferred_payment_method_id: string | null;
          return_date: string | null;
          search_mode: string | null;
          traveler_profile_id: string | null;
          user_id: string;
        };
        Insert: {
          adults?: number | null;
          auto_book?: boolean;
          auto_book_enabled?: boolean;
          baggage_included_required?: boolean;
          best_price?: number | null;
          budget: number;
          created_at?: string;
          departure_airports?: string[];
          departure_date?: string | null;
          destination_airport?: string | null;
          destination_location_code: string;
          duffel_auto_book_enabled?: boolean | null;
          earliest_departure: string;
          id?: string;
          last_checked_at?: string | null;
          latest_departure: string;
          max_duration?: number;
          max_price?: number | null;
          min_duration?: number;
          nonstop_required?: boolean;
          origin_location_code?: string | null;
          preferred_duffel_payment_method_id?: string | null;
          preferred_payment_method_id?: string | null;
          return_date?: string | null;
          search_mode?: string | null;
          traveler_profile_id?: string | null;
          user_id: string;
        };
        Update: {
          adults?: number | null;
          auto_book?: boolean;
          auto_book_enabled?: boolean;
          baggage_included_required?: boolean;
          best_price?: number | null;
          budget?: number;
          created_at?: string;
          departure_airports?: string[];
          departure_date?: string | null;
          destination_airport?: string | null;
          destination_location_code?: string;
          duffel_auto_book_enabled?: boolean | null;
          earliest_departure?: string;
          id?: string;
          last_checked_at?: string | null;
          latest_departure?: string;
          max_duration?: number;
          max_price?: number | null;
          min_duration?: number;
          nonstop_required?: boolean;
          origin_location_code?: string | null;
          preferred_duffel_payment_method_id?: string | null;
          preferred_payment_method_id?: string | null;
          return_date?: string | null;
          search_mode?: string | null;
          traveler_profile_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'trip_requests_preferred_duffel_payment_method_id_fkey';
            columns: ['preferred_duffel_payment_method_id'];
            isOneToOne: false;
            referencedRelation: 'duffel_payment_methods';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'trip_requests_traveler_profile_id_fkey';
            columns: ['traveler_profile_id'];
            isOneToOne: false;
            referencedRelation: 'traveler_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_preferences: {
        Row: {
          analytics_consent: boolean | null;
          created_at: string | null;
          distance_unit: string | null;
          email_notifications: boolean | null;
          home_country: string | null;
          id: string;
          marketing_consent: boolean | null;
          preferred_currency: string | null;
          push_notifications: boolean | null;
          sms_notifications: boolean | null;
          temperature_unit: string | null;
          timezone: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          analytics_consent?: boolean | null;
          created_at?: string | null;
          distance_unit?: string | null;
          email_notifications?: boolean | null;
          home_country?: string | null;
          id?: string;
          marketing_consent?: boolean | null;
          preferred_currency?: string | null;
          push_notifications?: boolean | null;
          sms_notifications?: boolean | null;
          temperature_unit?: string | null;
          timezone?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          analytics_consent?: boolean | null;
          created_at?: string | null;
          distance_unit?: string | null;
          email_notifications?: boolean | null;
          home_country?: string | null;
          id?: string;
          marketing_consent?: boolean | null;
          preferred_currency?: string | null;
          push_notifications?: boolean | null;
          sms_notifications?: boolean | null;
          temperature_unit?: string | null;
          timezone?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      auth_health_check: {
        Row: {
          check_time: string | null;
          component: string | null;
          total_users: string | null;
          users_last_24h: string | null;
        };
        Relationships: [];
      };
      booking_attempts_summary: {
        Row: {
          avg_duration_seconds: number | null;
          count: number | null;
          first_attempt: string | null;
          hour: string | null;
          last_attempt: string | null;
          status: string | null;
        };
        Relationships: [];
      };
      booking_monitoring: {
        Row: {
          created_at: string | null;
          departure_date: string | null;
          destination: string | null;
          duffel_booking_reference: string | null;
          duffel_offer_id: string | null;
          id: string | null;
          monitoring_status: string | null;
          origin: string | null;
          status: string | null;
          trip_request_id: string | null;
          updated_at: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'booking_attempts_trip_request_id_fkey';
            columns: ['trip_request_id'];
            isOneToOne: false;
            referencedRelation: 'trip_requests';
            referencedColumns: ['id'];
          },
        ];
      };
      encryption_status_summary: {
        Row: {
          earliest_profile: string | null;
          encryption_version: number | null;
          latest_profile: string | null;
          profile_count: number | null;
          with_passport: number | null;
          without_passport: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      aggregate_daily_form_analytics: {
        Args: { target_date?: string };
        Returns: undefined;
      };
      batch_migrate_to_kms_encryption: {
        Args: { batch_size?: number };
        Returns: {
          migrated_count: number;
          failed_count: number;
          total_remaining: number;
        }[];
      };
      calculate_profile_completeness: {
        Args: { profile_id: string };
        Returns: number;
      };
      check_feature_flag_rollout: {
        Args: { flag_name: string; user_id_param: string };
        Returns: boolean;
      };
      convert_price: {
        Args: { amount: number; from_curr: string; to_curr: string };
        Returns: number;
      };
      create_booking_attempt: {
        Args: {
          p_trip_request_id: string;
          p_offer_id: string;
          p_idempotency_key: string;
          p_passenger_data: Json;
        };
        Returns: string;
      };
      decrypt_passport_number: {
        Args: { encrypted_passport: string };
        Returns: string;
      };
      decrypt_passport_number_legacy: {
        Args: { encrypted_passport: string };
        Returns: string;
      };
      encrypt_passport_number: {
        Args: { passport_number: string };
        Returns: string;
      };
      encrypt_passport_number_legacy: {
        Args: { passport_number: string };
        Returns: string;
      };
      get_active_form_configuration: {
        Args: { form_name: string };
        Returns: {
          id: string;
          name: string;
          version: number;
          config_data: Json;
          validation_schema: Json;
          ui_schema: Json;
          encrypted_config: string;
          deployment_id: string;
        }[];
      };
      get_error_statistics: {
        Args: { days_back?: number };
        Returns: {
          error_type: string;
          error_count: number;
          severity: string;
          latest_occurrence: string;
          resolved_count: number;
        }[];
      };
      get_or_create_stripe_customer: {
        Args: { p_user_id: string };
        Returns: {
          stripe_customer_id: string;
        }[];
      };
      get_passport_number: {
        Args: { profile_id: string };
        Returns: string;
      };
      get_profile_recommendations: {
        Args: { profile_user_id: string };
        Returns: {
          category: string;
          priority: string;
          title: string;
          description: string;
          action: string;
          points_value: number;
        }[];
      };
      get_reminder_candidates: {
        Args: Record<PropertyKey, never>;
        Returns: {
          booking_request_id: string;
          user_id: string;
          phone: string;
          trip_details: Json;
          departure_date: string;
          departure_time: string;
        }[];
      };
      get_user_preferences: {
        Args: { user_uuid: string };
        Returns: {
          preferred_currency: string;
          home_country: string;
          timezone: string;
          email_notifications: boolean;
          sms_notifications: boolean;
          push_notifications: boolean;
        }[];
      };
      handle_trigger_error: {
        Args: { error_context: string; user_id: string; error_detail: string };
        Returns: undefined;
      };
      log_ai_activity: {
        Args: {
          agent_id_param: string;
          action_param: string;
          result_param?: string;
          context_param?: Json;
          duration_ms_param?: number;
          user_id_param?: string;
        };
        Returns: string;
      };
      log_form_usage: {
        Args: {
          p_config_id: string;
          p_user_id?: string;
          p_session_id?: string;
          p_event_type?: string;
          p_field_id?: string;
          p_event_data?: Json;
          p_load_time_ms?: number;
          p_ip_address?: string;
          p_user_agent?: string;
        };
        Returns: string;
      };
      migrate_traveler_profile_to_kms: {
        Args: { profile_id: string };
        Returns: boolean;
      };
      resolve_error: {
        Args: { error_id: string; resolved_by_user?: string };
        Returns: boolean;
      };
      rpc_auto_book_match: {
        Args:
          | { p_booking_request_id: string }
          | {
              p_match_id: string;
              p_payment_intent_id: string;
              p_currency?: string;
            };
        Returns: undefined;
      };
      rpc_complete_duffel_booking: {
        Args: {
          p_attempt_id: string;
          p_duffel_order_id: string;
          p_stripe_payment_intent_id: string;
          p_price: number;
          p_currency: string;
          p_raw_order: Json;
        };
        Returns: Json;
      };
      rpc_create_booking_attempt: {
        Args: { p_trip_request_id: string; p_idempotency_key: string };
        Returns: Json;
      };
      rpc_create_duffel_booking: {
        Args: {
          p_trip_request_id: string;
          p_flight_offer_id: string;
          p_duffel_payment_intent_id: string;
          p_amount: number;
          p_currency?: string;
        };
        Returns: Json;
      };
      rpc_fail_booking_attempt: {
        Args: {
          p_attempt_id: string;
          p_error_message: string;
          p_stripe_refund_id?: string;
        };
        Returns: boolean;
      };
      rpc_update_booking_attempt: {
        Args: {
          p_attempt_id: string;
          p_status: string;
          p_duffel_offer_id?: string;
          p_duffel_order_id?: string;
          p_stripe_payment_intent_id?: string;
          p_total_amount?: number;
          p_error_message?: string;
          p_error_code?: string;
        };
        Returns: boolean;
      };
      rpc_update_duffel_booking: {
        Args: {
          p_booking_id: string;
          p_duffel_order_id: string;
          p_pnr?: string;
          p_ticket_numbers?: Json;
          p_duffel_status?: Database['public']['Enums']['duffel_booking_status'];
          p_raw_order?: Json;
        };
        Returns: boolean;
      };
      rpc_update_duffel_booking_by_order: {
        Args: {
          p_duffel_order_id: string;
          p_pnr?: string;
          p_duffel_status?: Database['public']['Enums']['duffel_booking_status'];
          p_raw_order?: Json;
          p_ticket_numbers?: Json;
        };
        Returns: Json;
      };
      test_rls_policies: {
        Args: Record<PropertyKey, never>;
        Returns: {
          table_name: string;
          policy_name: string;
          test_result: string;
        }[];
      };
      track_form_event: {
        Args: {
          p_form_config_id: string;
          p_form_name: string;
          p_form_version: number;
          p_session_id: string;
          p_event_type: string;
          p_user_id?: string;
          p_event_data?: Json;
          p_field_id?: string;
          p_field_type?: string;
          p_field_value?: string;
          p_validation_error?: string;
          p_duration_ms?: number;
          p_user_agent?: string;
          p_ip_address?: string;
          p_referrer?: string;
        };
        Returns: string;
      };
      update_booking_status: {
        Args: {
          p_attempt_id: string;
          p_status: string;
          p_booking_reference?: string;
          p_error_details?: Json;
        };
        Returns: undefined;
      };
      validate_auth_setup: {
        Args: Record<PropertyKey, never>;
        Returns: {
          check_name: string;
          status: string;
          details: string;
        }[];
      };
      verify_kms_migration: {
        Args: Record<PropertyKey, never>;
        Returns: {
          total_profiles: number;
          legacy_encrypted: number;
          kms_encrypted: number;
          no_passport: number;
        }[];
      };
    };
    Enums: {
      booking_request_status:
        | 'new'
        | 'pending_payment'
        | 'pending_booking'
        | 'processing'
        | 'done'
        | 'failed'
        | 'cancelled';
      booking_status_enum:
        | 'pending'
        | 'booked'
        | 'ticketed'
        | 'failed'
        | 'canceled';
      deployment_strategy: 'immediate' | 'canary' | 'blue_green';
      duffel_booking_status:
        | 'offer_selected'
        | 'payment_authorized'
        | 'order_created'
        | 'ticketed'
        | 'failed'
        | 'cancelled'
        | 'refunded';
      field_type:
        | 'text'
        | 'email'
        | 'phone'
        | 'number'
        | 'password'
        | 'textarea'
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
      form_status: 'draft' | 'testing' | 'deployed' | 'archived';
      payment_status_enum: 'unpaid' | 'pending' | 'paid' | 'failed';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      booking_request_status: [
        'new',
        'pending_payment',
        'pending_booking',
        'processing',
        'done',
        'failed',
        'cancelled',
      ],
      booking_status_enum: [
        'pending',
        'booked',
        'ticketed',
        'failed',
        'canceled',
      ],
      deployment_strategy: ['immediate', 'canary', 'blue_green'],
      duffel_booking_status: [
        'offer_selected',
        'payment_authorized',
        'order_created',
        'ticketed',
        'failed',
        'cancelled',
        'refunded',
      ],
      field_type: [
        'text',
        'email',
        'phone',
        'number',
        'password',
        'textarea',
        'select',
        'multi-select',
        'radio',
        'checkbox',
        'switch',
        'date',
        'datetime',
        'date-range',
        'date-range-flexible',
        'airport-autocomplete',
        'country-select',
        'currency-select',
        'stripe-card',
        'stripe-payment',
        'address-group',
        'file-upload',
        'slider',
        'rating',
        'conditional-group',
        'section-header',
        'divider',
      ],
      form_status: ['draft', 'testing', 'deployed', 'archived'],
      payment_status_enum: ['unpaid', 'pending', 'paid', 'failed'],
    },
  },
} as const;
