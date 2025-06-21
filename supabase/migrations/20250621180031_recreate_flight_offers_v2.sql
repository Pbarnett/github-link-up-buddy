-- Create flight_offers_v2 table with feature flag
-- This table is designed for the new v2 flight search functionality
-- Feature flag allows safe rollout and rollback

CREATE TABLE IF NOT EXISTS "public"."flight_offers_v2" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trip_request_id" "uuid" NOT NULL,
    "offer_data" "jsonb" NOT NULL,
    "price_total" numeric NOT NULL,
    "price_base" numeric,
    "price_currency" "text" DEFAULT 'USD' NOT NULL,
    "carrier_code" "text",
    "flight_number" "text",
    "departure_airport" "text",
    "arrival_airport" "text", 
    "departure_date" "text",
    "departure_time" "text",
    "return_date" "text",
    "return_time" "text",
    "duration" "text",
    "stops" integer DEFAULT 0 NOT NULL,
    "booking_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "flight_search_v2_enabled" boolean DEFAULT false NOT NULL,
    CONSTRAINT "flight_offers_v2_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraint to trip_requests
ALTER TABLE ONLY "public"."flight_offers_v2"
    ADD CONSTRAINT "flight_offers_v2_trip_request_id_fkey" 
    FOREIGN KEY ("trip_request_id") 
    REFERENCES "public"."trip_requests"("id") 
    ON DELETE CASCADE;

-- Create index on trip_request_id for efficient queries
CREATE INDEX "idx_flight_offers_v2_trip_request_id" 
    ON "public"."flight_offers_v2" 
    USING "btree" ("trip_request_id");

-- Create index on feature flag for efficient filtering
CREATE INDEX "idx_flight_offers_v2_enabled" 
    ON "public"."flight_offers_v2" 
    USING "btree" ("flight_search_v2_enabled");

-- Add table owner
ALTER TABLE "public"."flight_offers_v2" OWNER TO "postgres";

-- Add comments for documentation
COMMENT ON TABLE "public"."flight_offers_v2" IS 'Enhanced flight offers table for v2 search functionality with structured pricing and feature flag';
COMMENT ON COLUMN "public"."flight_offers_v2"."offer_data" IS 'Full flight offer data from external API in JSON format';
COMMENT ON COLUMN "public"."flight_offers_v2"."price_total" IS 'Total price including all fees and taxes';
COMMENT ON COLUMN "public"."flight_offers_v2"."price_base" IS 'Base fare price before taxes and fees';
COMMENT ON COLUMN "public"."flight_offers_v2"."flight_search_v2_enabled" IS 'Feature flag to enable/disable v2 flight search functionality';

-- Row Level Security policies (to be configured later)
-- ALTER TABLE "public"."flight_offers_v2" ENABLE ROW LEVEL SECURITY;
