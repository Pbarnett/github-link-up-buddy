export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      booking_requests: {
        Row: {
          attempts: number
          auto: boolean
          checkout_session_id: string | null
          created_at: string
          error: string | null
          id: string
          offer_data: Json
          offer_id: string
          processed_at: string | null
          status: Database["public"]["Enums"]["booking_request_status"]
          traveler_data: Json | null
          user_id: string
        }
        Insert: {
          attempts?: number
          auto?: boolean
          checkout_session_id?: string | null
          created_at?: string
          error?: string | null
          id?: string
          offer_data: Json
          offer_id: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["booking_request_status"]
          traveler_data?: Json | null
          user_id: string
        }
        Update: {
          attempts?: number
          auto?: boolean
          checkout_session_id?: string | null
          created_at?: string
          error?: string | null
          id?: string
          offer_data?: Json
          offer_id?: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["booking_request_status"]
          traveler_data?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "flight_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booked_at: string
          flight_offer_id: string
          id: string
          trip_request_id: string
          user_id: string
        }
        Insert: {
          booked_at?: string
          flight_offer_id: string
          id?: string
          trip_request_id: string
          user_id: string
        }
        Update: {
          booked_at?: string
          flight_offer_id?: string
          id?: string
          trip_request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_flight_offer_id_fkey"
            columns: ["flight_offer_id"]
            isOneToOne: false
            referencedRelation: "flight_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_trip_request_id_fkey"
            columns: ["trip_request_id"]
            isOneToOne: false
            referencedRelation: "trip_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_matches: {
        Row: {
          created_at: string
          depart_at: string
          flight_offer_id: string
          id: string
          notified: boolean
          price: number
          trip_request_id: string
        }
        Insert: {
          created_at?: string
          depart_at: string
          flight_offer_id: string
          id?: string
          notified?: boolean
          price: number
          trip_request_id: string
        }
        Update: {
          created_at?: string
          depart_at?: string
          flight_offer_id?: string
          id?: string
          notified?: boolean
          price?: number
          trip_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flight_matches_flight_offer_id_fkey"
            columns: ["flight_offer_id"]
            isOneToOne: false
            referencedRelation: "flight_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flight_matches_trip_request_id_fkey"
            columns: ["trip_request_id"]
            isOneToOne: false
            referencedRelation: "trip_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_offers: {
        Row: {
          airline: string
          created_at: string
          departure_date: string
          departure_time: string
          duration: string
          flight_number: string
          id: string
          price: number
          return_date: string
          return_time: string
          trip_request_id: string
        }
        Insert: {
          airline: string
          created_at?: string
          departure_date: string
          departure_time: string
          duration: string
          flight_number: string
          id?: string
          price: number
          return_date: string
          return_time: string
          trip_request_id: string
        }
        Update: {
          airline?: string
          created_at?: string
          departure_date?: string
          departure_time?: string
          duration?: string
          flight_number?: string
          id?: string
          price?: number
          return_date?: string
          return_time?: string
          trip_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flight_offers_trip_request_id_fkey"
            columns: ["trip_request_id"]
            isOneToOne: false
            referencedRelation: "trip_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          booking_request_id: string | null
          created_at: string
          id: string
          is_read: boolean
          payload: Json | null
          type: string
          user_id: string
        }
        Insert: {
          booking_request_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          payload?: Json | null
          type: string
          user_id: string
        }
        Update: {
          booking_request_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          payload?: Json | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_booking_request_id_fkey"
            columns: ["booking_request_id"]
            isOneToOne: false
            referencedRelation: "booking_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          booking_request_id: string | null
          checkout_session_id: string | null
          created_at: string
          currency: string
          description: string | null
          error_message: string | null
          id: string
          match_id: string
          payment_intent_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          booking_request_id?: string | null
          checkout_session_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          error_message?: string | null
          id?: string
          match_id: string
          payment_intent_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          booking_request_id?: string | null
          checkout_session_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          error_message?: string | null
          id?: string
          match_id?: string
          payment_intent_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_booking_request_id_fkey"
            columns: ["booking_request_id"]
            isOneToOne: false
            referencedRelation: "booking_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "flight_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          brand: string
          created_at: string
          exp_month: number
          exp_year: number
          id: string
          is_default: boolean
          last4: string
          nickname: string | null
          stripe_customer_id: string | null
          stripe_pm_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          brand: string
          created_at?: string
          exp_month: number
          exp_year: number
          id?: string
          is_default?: boolean
          last4: string
          nickname?: string | null
          stripe_customer_id?: string | null
          stripe_pm_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string
          created_at?: string
          exp_month?: number
          exp_year?: number
          id?: string
          is_default?: boolean
          last4?: string
          nickname?: string | null
          stripe_customer_id?: string | null
          stripe_pm_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trip_requests: {
        Row: {
          auto_book_enabled: boolean
          budget: number
          created_at: string
          departure_airports: string[]
          destination_airport: string | null
          earliest_departure: string
          id: string
          last_checked_at: string | null
          latest_departure: string
          max_duration: number
          max_price: number | null
          min_duration: number
          preferred_payment_method_id: string | null
          user_id: string
        }
        Insert: {
          auto_book_enabled?: boolean
          budget: number
          created_at?: string
          departure_airports?: string[]
          destination_airport?: string | null
          earliest_departure: string
          id?: string
          last_checked_at?: string | null
          latest_departure: string
          max_duration?: number
          max_price?: number | null
          min_duration?: number
          preferred_payment_method_id?: string | null
          user_id: string
        }
        Update: {
          auto_book_enabled?: boolean
          budget?: number
          created_at?: string
          departure_airports?: string[]
          destination_airport?: string | null
          earliest_departure?: string
          id?: string
          last_checked_at?: string | null
          latest_departure?: string
          max_duration?: number
          max_price?: number | null
          min_duration?: number
          preferred_payment_method_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_reminder_candidates: {
        Args: Record<PropertyKey, never>
        Returns: {
          booking_request_id: string
          user_id: string
          phone: string
          trip_details: Json
          departure_date: string
          departure_time: string
        }[]
      }
      rpc_auto_book_match: {
        Args: {
          p_match_id: string
          p_payment_intent_id: string
          p_currency?: string
        }
        Returns: Record<string, unknown>
      }
    }
    Enums: {
      booking_request_status:
        | "new"
        | "pending_payment"
        | "pending_booking"
        | "processing"
        | "done"
        | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_request_status: [
        "new",
        "pending_payment",
        "pending_booking",
        "processing",
        "done",
        "failed",
      ],
    },
  },
} as const
