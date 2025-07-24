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
          id: string;
          trip_request_id: string | null;
        };
        Insert: {
          attempt_timestamp?: string;
          id?: string;
          trip_request_id?: string | null;
        };
        Update: {
          attempt_timestamp?: string;
          id?: string;
          trip_request_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'booking_attempts_trip_request_id_fkey';
            columns: ['trip_request_id'];
            isOneToOne: true;
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
          email_reminder_sent: boolean;
          flight_details: Json | null;
          flight_offer_id: string;
          id: string;
          one_hour_email_sent: boolean;
          one_hour_sms_sent: boolean;
          payment_intent_id: string | null;
          payment_status: string;
          pnr: string | null;
          price: number | null;
          seat_fee: number | null;
          second_reminder_scheduled_at: string | null;
          selected_seat_number: string | null;
          sms_reminder_sent: boolean;
          source: string | null;
          status: Database['public']['Enums']['booking_status_enum'] | null;
          trip_request_id: string;
          user_id: string;
        };
        Insert: {
          amadeus_order_id?: string | null;
          booked_at?: string;
          booking_attempt_id?: string;
          booking_request_id?: string | null;
          email_reminder_sent?: boolean;
          flight_details?: Json | null;
          flight_offer_id: string;
          id?: string;
          one_hour_email_sent?: boolean;
          one_hour_sms_sent?: boolean;
          payment_intent_id?: string | null;
          payment_status?: string;
          pnr?: string | null;
          price?: number | null;
          seat_fee?: number | null;
          second_reminder_scheduled_at?: string | null;
          selected_seat_number?: string | null;
          sms_reminder_sent?: boolean;
          source?: string | null;
          status?: Database['public']['Enums']['booking_status_enum'] | null;
          trip_request_id: string;
          user_id: string;
        };
        Update: {
          amadeus_order_id?: string | null;
          booked_at?: string;
          booking_attempt_id?: string;
          booking_request_id?: string | null;
          email_reminder_sent?: boolean;
          flight_details?: Json | null;
          flight_offer_id?: string;
          id?: string;
          one_hour_email_sent?: boolean;
          one_hour_sms_sent?: boolean;
          payment_intent_id?: string | null;
          payment_status?: string;
          pnr?: string | null;
          price?: number | null;
          seat_fee?: number | null;
          second_reminder_scheduled_at?: string | null;
          selected_seat_number?: string | null;
          sms_reminder_sent?: boolean;
          source?: string | null;
          status?: Database['public']['Enums']['booking_status_enum'] | null;
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
      feature_flags: {
        Row: {
          created_at: string | null;
          description: string | null;
          enabled: boolean;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          enabled?: boolean;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          enabled?: boolean;
          id?: string;
          name?: string;
          updated_at?: string | null;
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
          cabin_class: string | null;
          created_at: string;
          depart_dt: string;
          destination_iata: string;
          id: string;
          mode: string;
          nonstop: boolean;
          origin_iata: string;
          price_carry_on: number | null;
          price_currency: string | null;
          price_total: number;
          return_dt: string | null;
          seat_pref: string | null;
          trip_request_id: string;
        };
        Insert: {
          bags_included?: boolean;
          cabin_class?: string | null;
          created_at?: string;
          depart_dt: string;
          destination_iata: string;
          id?: string;
          mode?: string;
          nonstop: boolean;
          origin_iata: string;
          price_carry_on?: number | null;
          price_currency?: string | null;
          price_total: number;
          return_dt?: string | null;
          seat_pref?: string | null;
          trip_request_id: string;
        };
        Update: {
          bags_included?: boolean;
          cabin_class?: string | null;
          created_at?: string;
          depart_dt?: string;
          destination_iata?: string;
          id?: string;
          mode?: string;
          nonstop?: boolean;
          origin_iata?: string;
          price_carry_on?: number | null;
          price_currency?: string | null;
          price_total?: number;
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
      notifications: {
        Row: {
          booking_id: string | null;
          booking_request_id: string | null;
          channel: string | null;
          created_at: string;
          data: Json | null;
          id: string;
          is_read: boolean;
          message: string | null;
          payload: Json | null;
          retry_count: number | null;
          sent_at: string | null;
          status: string | null;
          trip_request_id: string | null;
          type: string;
          user_id: string;
        };
        Insert: {
          booking_id?: string | null;
          booking_request_id?: string | null;
          channel?: string | null;
          created_at?: string;
          data?: Json | null;
          id?: string;
          is_read?: boolean;
          message?: string | null;
          payload?: Json | null;
          retry_count?: number | null;
          sent_at?: string | null;
          status?: string | null;
          trip_request_id?: string | null;
          type: string;
          user_id: string;
        };
        Update: {
          booking_id?: string | null;
          booking_request_id?: string | null;
          channel?: string | null;
          created_at?: string;
          data?: Json | null;
          id?: string;
          is_read?: boolean;
          message?: string | null;
          payload?: Json | null;
          retry_count?: number | null;
          sent_at?: string | null;
          status?: string | null;
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
      payment_methods: {
        Row: {
          brand: string;
          created_at: string;
          exp_month: number;
          exp_year: number;
          id: string;
          is_default: boolean;
          last4: string;
          nickname: string | null;
          stripe_customer_id: string | null;
          stripe_pm_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          brand: string;
          created_at?: string;
          exp_month: number;
          exp_year: number;
          id?: string;
          is_default?: boolean;
          last4: string;
          nickname?: string | null;
          stripe_customer_id?: string | null;
          stripe_pm_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          brand?: string;
          created_at?: string;
          exp_month?: number;
          exp_year?: number;
          id?: string;
          is_default?: boolean;
          last4?: string;
          nickname?: string | null;
          stripe_customer_id?: string | null;
          stripe_pm_id?: string;
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
      profiles: {
        Row: {
          created_at: string | null;
          email: string;
          first_name: string | null;
          id: string;
          last_name: string | null;
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
          last_name?: string | null;
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
          last_name?: string | null;
          phone?: string | null;
          prefers_email_notifications?: boolean | null;
          prefers_sms_notifications?: boolean | null;
          updated_at?: string | null;
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
          earliest_departure: string;
          id: string;
          last_checked_at: string | null;
          latest_departure: string;
          max_duration: number;
          max_price: number | null;
          min_duration: number;
          nonstop_required: boolean;
          origin_location_code: string | null;
          preferred_payment_method_id: string | null;
          return_date: string | null;
          search_mode: string | null;
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
          earliest_departure: string;
          id?: string;
          last_checked_at?: string | null;
          latest_departure: string;
          max_duration?: number;
          max_price?: number | null;
          min_duration?: number;
          nonstop_required?: boolean;
          origin_location_code?: string | null;
          preferred_payment_method_id?: string | null;
          return_date?: string | null;
          search_mode?: string | null;
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
          earliest_departure?: string;
          id?: string;
          last_checked_at?: string | null;
          latest_departure?: string;
          max_duration?: number;
          max_price?: number | null;
          min_duration?: number;
          nonstop_required?: boolean;
          origin_location_code?: string | null;
          preferred_payment_method_id?: string | null;
          return_date?: string | null;
          search_mode?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
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
      payment_status_enum: 'unpaid' | 'pending' | 'paid' | 'failed';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
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
      payment_status_enum: ['unpaid', 'pending', 'paid', 'failed'],
    },
  },
} as const;
