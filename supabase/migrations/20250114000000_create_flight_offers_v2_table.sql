-- Create flight_offers_v2 table with enhanced schema for Phase 2
-- This table builds upon the current flight_offers structure with improved pricing, 
-- carry-on fee handling, and additional metadata fields

CREATE TABLE IF NOT EXISTS public.flight_offers_v2 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_request_id UUID NOT NULL,
  
  -- Core flight information (inherited from v1)
  airline VARCHAR(50) NOT NULL,
  carrier_code VARCHAR(10),
  flight_number VARCHAR(20) NOT NULL,
  origin_airport VARCHAR(10),
  destination_airport VARCHAR(10),
  
  -- Flight timing
  departure_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  return_date DATE NOT NULL,
  return_time TIME NOT NULL,
  duration VARCHAR(20) NOT NULL,
  
  -- Enhanced pricing structure (NEW in v2)
  base_price DECIMAL(10,2) NOT NULL,           -- Base price without fees
  carry_on_fee DECIMAL(10,2) NOT NULL DEFAULT 0, -- Explicit carry-on fee
  total_price DECIMAL(10,2) NOT NULL,          -- Total price (base + carry_on_fee)
  
  -- Legacy price field for backward compatibility
  price DECIMAL(10,2) NOT NULL,               -- Same as total_price for v1 compatibility
  
  -- Flight characteristics
  stops INTEGER NOT NULL DEFAULT 0,
  layover_airports TEXT[],
  
  -- Baggage and seating (enhanced from v1)
  baggage_included BOOLEAN NOT NULL DEFAULT FALSE,
  carry_on_included BOOLEAN NOT NULL DEFAULT FALSE, -- NEW: explicit carry-on inclusion
  selected_seat_type VARCHAR(20),               -- AISLE, WINDOW, MIDDLE
  
  -- Booking information
  booking_url TEXT,
  auto_book BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- V2 enhancements
  pricing_transparency VARCHAR(20) NOT NULL DEFAULT 'transparent', -- 'transparent', 'opaque'
  amadeus_offer_id VARCHAR(100),                -- Original Amadeus offer ID for tracking
  offer_score INTEGER,                          -- Scoring from pooling algorithm
  offer_pool VARCHAR(1),                        -- 'A', 'B', 'C' from pooling
  scoring_reasons TEXT[],                       -- Reasons for scoring (JSON-compatible)
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Foreign key constraints
  CONSTRAINT fk_flight_offers_v2_trip_request 
    FOREIGN KEY (trip_request_id) 
    REFERENCES public.trip_requests(id) 
    ON DELETE CASCADE,
    
  -- Constraints for data integrity
  CONSTRAINT check_total_price_calculation 
    CHECK (total_price = base_price + carry_on_fee),
    
  CONSTRAINT check_price_compatibility 
    CHECK (price = total_price),
    
  CONSTRAINT check_positive_prices 
    CHECK (base_price >= 0 AND carry_on_fee >= 0 AND total_price >= 0),
    
  CONSTRAINT check_valid_transparency 
    CHECK (pricing_transparency IN ('transparent', 'opaque')),
    
  CONSTRAINT check_valid_pool 
    CHECK (offer_pool IS NULL OR offer_pool IN ('A', 'B', 'C')),
    
  CONSTRAINT check_valid_seat_type 
    CHECK (selected_seat_type IS NULL OR selected_seat_type IN ('AISLE', 'WINDOW', 'MIDDLE'))
);

-- Create indexes for performance
CREATE INDEX idx_flight_offers_v2_trip_request_id ON public.flight_offers_v2(trip_request_id);
CREATE INDEX idx_flight_offers_v2_departure_date ON public.flight_offers_v2(departure_date);
CREATE INDEX idx_flight_offers_v2_total_price ON public.flight_offers_v2(total_price);
CREATE INDEX idx_flight_offers_v2_airline ON public.flight_offers_v2(airline);
CREATE INDEX idx_flight_offers_v2_pool ON public.flight_offers_v2(offer_pool) WHERE offer_pool IS NOT NULL;
CREATE INDEX idx_flight_offers_v2_score ON public.flight_offers_v2(offer_score) WHERE offer_score IS NOT NULL;
CREATE INDEX idx_flight_offers_v2_amadeus_id ON public.flight_offers_v2(amadeus_offer_id) WHERE amadeus_offer_id IS NOT NULL;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_flight_offers_v2_updated_at 
  BEFORE UPDATE ON public.flight_offers_v2 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add helpful comments
COMMENT ON TABLE public.flight_offers_v2 IS 'Enhanced flight offers table with structured pricing and carry-on fee handling';
COMMENT ON COLUMN public.flight_offers_v2.base_price IS 'Base price without any additional fees';
COMMENT ON COLUMN public.flight_offers_v2.carry_on_fee IS 'Explicit carry-on baggage fee (0 if included)';
COMMENT ON COLUMN public.flight_offers_v2.total_price IS 'Total price including all fees (base_price + carry_on_fee)';
COMMENT ON COLUMN public.flight_offers_v2.pricing_transparency IS 'Whether pricing is transparent or opaque from API';
COMMENT ON COLUMN public.flight_offers_v2.offer_score IS 'Score from the offer pooling algorithm';
COMMENT ON COLUMN public.flight_offers_v2.offer_pool IS 'Pool classification: A (best), B (good), C (acceptable)';
COMMENT ON COLUMN public.flight_offers_v2.scoring_reasons IS 'Array of reasons for the offer score';

