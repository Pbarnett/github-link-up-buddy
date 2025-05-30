// TODO: Regenerate types from schema after migrations are stable.
/** Collapse the recursive Json union to `unknown` to prevent TS recursion errors */
export type Json = unknown;

export type Database = {
  public: {
    Tables: {
      booking_requests: {
        Row: {
          attempts: number
          auto: boolean
          created_at: string
          // error: string | null // Removed: superseded by error_message
          error_message?: string | null // Added
          id: string // Assuming this is UUID, represented as string
          offer_data: Json
          offer_id: string
          processed_at: string | null
          status: string
          trip_request_id?: string | null // Added: UUID FK
          updated_at?: string // Added: TIMESTAMPTZ
          user_id: string // Assuming this is UUID
        }
        Insert: {
          attempts?: number
          auto?: boolean
          created_at?: string
          // error?: string | null // Removed
          error_message?: string | null // Added
          id?: string // Assuming UUID
          offer_data: Json
          offer_id: string
          processed_at?: string | null
          status?: string
          trip_request_id?: string | null // Added
          updated_at?: string // Added
          user_id: string // Assuming UUID
        }
        Update: {
          attempts?: number
          auto?: boolean
          created_at?: string
          // error?: string | null // Removed
          error_message?: string | null // Added
          id?: string // Assuming UUID
          offer_data?: Json
          offer_id?: string
          processed_at?: string | null
          status?: string
          trip_request_id?: string | null // Added
          updated_at?: string // Added
          user_id?: string // Assuming UUID
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "flight_offers" // Assuming flight_offers.id is string (UUID or text)
            referencedColumns: ["id"]
          },
          { // Added Relationship for trip_request_id
            foreignKeyName: "booking_requests_trip_request_id_fkey"
            columns: ["trip_request_id"]
            isOneToOne: false
            referencedRelation: "trip_requests"
            referencedColumns: ["id"] // Assuming trip_requests.id is string (UUID)
          }
        ]
      }
      bookings: {
        Row: {
          booked_at: string
          booking_request_id?: string | null // Added: UUID FK
          flight_details?: Json // Added: JSONB
          // flight_offer_id: string // Assuming superseded by booking_request_id logic
          id: string // Assuming this is UUID, represented as string
          price?: number // Added: NUMERIC
          source?: string // Added
          status?: string // Added
          trip_request_id: string // Assuming UUID FK
          user_id: string // Assuming UUID
        }
        Insert: {
          booked_at?: string
          booking_request_id?: string | null // Added
          flight_details?: Json // Added
          // flight_offer_id: string
          id?: string // Assuming UUID
          price?: number // Added
          source?: string // Added
          status?: string // Added
          trip_request_id: string // Assuming UUID
          user_id: string // Assuming UUID
        }
        Update: {
          booked_at?: string
          booking_request_id?: string | null // Added
          flight_details?: Json // Added
          // flight_offer_id?: string
          id?: string // Assuming UUID
          price?: number // Added
          source?: string // Added
          status?: string // Added
          trip_request_id?: string // Assuming UUID
          user_id?: string // Assuming UUID
        }
        Relationships: [
          // { // Assuming this FK is removed or managed via booking_request_id -> offer_data
          //   foreignKeyName: "bookings_flight_offer_id_fkey"
          //   columns: ["flight_offer_id"]
          //   isOneToOne: false
          //   referencedRelation: "flight_offers"
          //   referencedColumns: ["id"]
          // },
          {
            foreignKeyName: "bookings_trip_request_id_fkey"
            columns: ["trip_request_id"]
            isOneToOne: false
            referencedRelation: "trip_requests"
            referencedColumns: ["id"] // Assuming trip_requests.id is string (UUID)
          },
          { // Added Relationship for booking_request_id
            foreignKeyName: "bookings_booking_request_id_fkey"
            columns: ["booking_request_id"]
            isOneToOne: false // Can be one-to-one if a booking_request results in only one booking
            referencedRelation: "booking_requests"
            referencedColumns: ["id"] // Assuming booking_requests.id is string (UUID)
          }
        ]
      }
      flight_matches: { // Assuming no changes here as per prompt, but IDs would be string for UUIDs
        Row: {
          created_at: string
          depart_at: string
          flight_offer_id: string // Assuming UUID
          id: string // Assuming UUID
          notified: boolean
          price: number
          trip_request_id: string // Assuming UUID
        }
        Insert: {
          created_at?: string
          depart_at: string
          flight_offer_id: string // Assuming UUID
          id?: string // Assuming UUID
          notified?: boolean
          price: number
          trip_request_id: string // Assuming UUID
        }
        Update: {
          created_at?: string
          depart_at?: string
          flight_offer_id?: string // Assuming UUID
          id?: string // Assuming UUID
          notified?: boolean
          price?: number
          trip_request_id?: string // Assuming UUID
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
      flight_offers: { // Assuming no changes here as per prompt, but IDs would be string for UUIDs
        Row: {
          airline: string
          created_at: string
          departure_date: string
          departure_time: string
          duration: string
          flight_number: string
          id: string // Assuming UUID
          price: number
          return_date: string
          return_time: string
          trip_request_id: string // Assuming UUID
        }
        Insert: {
          airline: string
          created_at?: string
          departure_date: string
          departure_time: string
          duration: string
          flight_number: string
          id?: string // Assuming UUID
          price: number
          return_date: string
          return_time: string
          trip_request_id: string // Assuming UUID
        }
        Update: {
          airline?: string
          created_at?: string
          departure_date?: string
          departure_time?: string
          duration?: string
          flight_number?: string
          id?: string // Assuming UUID
          price?: number
          return_date?: string
          return_time?: string
          trip_request_id?: string // Assuming UUID
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
          created_at: string
          data?: Json | null // Added: JSONB
          id: string // Assuming UUID
          is_read: boolean
          message?: string // Added
          // payload: Json | null // Removed
          trip_request_id?: string | null // Added: UUID FK
          type: string
          user_id: string // Assuming UUID
        }
        Insert: {
          created_at?: string
          data?: Json | null // Added
          id?: string // Assuming UUID
          is_read?: boolean
          message?: string // Added
          // payload?: Json | null // Removed
          trip_request_id?: string | null // Added
          type: string
          user_id: string // Assuming UUID
        }
        Update: {
          created_at?: string
          data?: Json | null // Added
          id?: string // Assuming UUID
          is_read?: boolean
          message?: string // Added
          // payload?: Json | null // Removed
          trip_request_id?: string | null // Added
          type?: string
          user_id?: string // Assuming UUID
        }
        Relationships: [
            { // Added Relationship for trip_request_id
            foreignKeyName: "notifications_trip_request_id_fkey"
            columns: ["trip_request_id"]
            isOneToOne: false
            referencedRelation: "trip_requests"
            referencedColumns: ["id"] // Assuming trip_requests.id is string (UUID)
          }
        ]
      }
      orders: { // Assuming booking_request_id becomes string (UUID)
        Row: {
          amount: number
          booking_request_id: string | null // Assuming UUID
          checkout_session_id: string | null
          created_at: string
          currency: string
          description: string | null
          error_message: string | null
          id: string // Assuming UUID
          match_id: string // Assuming UUID
          payment_intent_id: string
          status: string | null
          updated_at: string | null
          user_id: string // Assuming UUID
        }
        Insert: {
          amount: number
          booking_request_id?: string | null // Assuming UUID
          checkout_session_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          error_message?: string | null
          id?: string // Assuming UUID
          match_id: string // Assuming UUID
          payment_intent_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string // Assuming UUID
        }
        Update: {
          amount?: number
          booking_request_id?: string | null // Assuming UUID
          checkout_session_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          error_message?: string | null
          id?: string // Assuming UUID
          match_id?: string // Assuming UUID
          payment_intent_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string // Assuming UUID
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
      payment_methods: { // Assuming no changes here as per prompt, but IDs would be string for UUIDs
        Row: {
          brand: string
          created_at: string
          exp_month: number
          exp_year: number
          id: string // Assuming UUID
          is_default: boolean
          last4: string
          nickname: string | null
          stripe_pm_id: string
          updated_at: string
          user_id: string // Assuming UUID
        }
        Insert: {
          brand: string
          created_at?: string
          exp_month: number
          exp_year: number
          id?: string // Assuming UUID
          is_default?: boolean
          last4: string
          nickname?: string | null
          stripe_pm_id: string
          updated_at?: string
          user_id: string // Assuming UUID
        }
        Update: {
          brand?: string
          created_at?: string
          exp_month?: number
          exp_year?: number
          id?: string // Assuming UUID
          is_default?: boolean
          last4?: string
          nickname?: string | null
          stripe_pm_id?: string
          updated_at?: string
          user_id?: string // Assuming UUID
        }
        Relationships: []
      }
      trip_requests: {
        Row: {
          // auto_book_enabled: boolean // Removed: Renamed to auto_book
          auto_book?: boolean // Added: Renamed from auto_book_enabled
          budget: number | null // Changed to allow NULL based on some test cases
          created_at: string
          departure_airports?: string[] // Kept as is
          departure_date?: string | null // Added: DATE
          destination_airport?: string | null // Kept as is
          destination_location_code?: string | null // Added
          earliest_departure?: string // Kept as is, type could be DATE or TIMESTAMPTZ string
          id: string // Assuming UUID
          last_checked_at: string | null
          latest_departure?: string // Kept as is, type could be DATE or TIMESTAMPTZ string
          max_duration?: number // Kept as is
          max_price?: number | null // Kept as is
          min_duration?: number // Kept as is
          origin_location_code?: string | null // Added
          preferred_payment_method_id: string | null
          return_date?: string | null // Added: DATE
          user_id: string // Assuming UUID
          adults?: number // Added
          best_price?: number | null // Added based on scheduler logic
          updated_at?: string // Added based on scheduler logic
        }
        Insert: {
          // auto_book_enabled?: boolean // Removed
          auto_book?: boolean // Added
          budget?: number | null // Changed
          created_at?: string
          departure_airports?: string[]
          departure_date?: string | null // Added
          destination_airport?: string | null
          destination_location_code?: string | null // Added
          earliest_departure?: string
          id?: string // Assuming UUID
          last_checked_at?: string | null
          latest_departure?: string
          max_duration?: number
          max_price?: number | null
          min_duration?: number
          origin_location_code?: string | null // Added
          preferred_payment_method_id?: string | null
          return_date?: string | null // Added
          user_id: string // Assuming UUID
          adults?: number // Added
          best_price?: number | null // Added
          updated_at?: string // Added
        }
        Update: {
          // auto_book_enabled?: boolean // Removed
          auto_book?: boolean // Added
          budget?: number | null // Changed
          created_at?: string
          departure_airports?: string[]
          departure_date?: string | null // Added
          destination_airport?: string | null
          destination_location_code?: string | null // Added
          earliest_departure?: string
          id?: string // Assuming UUID
          last_checked_at?: string | null
          latest_departure?: string
          max_duration?: number
          max_price?: number | null
          min_duration?: number
          origin_location_code?: string | null // Added
          preferred_payment_method_id?: string | null
          return_date?: string | null // Added
          user_id?: string // Assuming UUID
          adults?: number // Added
          best_price?: number | null // Added
          updated_at?: string // Added
        }
        Relationships: [] // Assuming no new FKs added directly to trip_requests in this change
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      rpc_auto_book_match: {
        Args: { // Updated Args
          p_booking_request_id: string // Changed from p_match_id, type string for UUID
        }
        Returns: Record<string, unknown> // Assuming VOID or simple status return
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
