-- Insert Parker Flight Search form configuration

INSERT INTO form_configurations (
  name,
  version,
  status,
  config_data,
  validation_schema,
  ui_schema,
  deployed_at
) VALUES (
  'flight-search-v1',
  1,
  'deployed',
  '{
    "id": "flight-search-v1",
    "name": "Parker Flight Search",
    "title": "Set Up Your Flight Watch",
    "description": "Tell us your flexible travel plans and we will find the perfect flights",
    "version": 1,
    "sections": [
      {
        "id": "departure-airports",
        "title": "Departure Airports",
        "description": "Select all airports you are willing to fly from",
        "fields": [
          {
            "id": "nyc_airports",
            "type": "multi-select",
            "label": "NYC Area Airports",
            "options": [
              { "label": "JFK - John F. Kennedy International", "value": "JFK" },
              { "label": "LGA - LaGuardia Airport", "value": "LGA" },
              { "label": "EWR - Newark Liberty International", "value": "EWR" }
            ],
            "description": "Select any NYC airports you can depart from"
          },
          {
            "id": "other_departure_airport",
            "type": "airport-autocomplete",
            "label": "Other Departure Airport",
            "placeholder": "Add another departure airport",
            "description": "Optional: Add an airport outside NYC area"
          }
        ]
      },
      {
        "id": "destination",
        "title": "Destination",
        "description": "Where do you want to go?",
        "fields": [
          {
            "id": "destination_airport",
            "type": "airport-autocomplete",
            "label": "Destination Airport",
            "placeholder": "Enter destination airport code (e.g., LAX)",
            "validation": { "required": true },
            "description": "3-letter airport code for your destination"
          },
          {
            "id": "destination_other",
            "type": "text",
            "label": "Or City/Country Name",
            "placeholder": "e.g., Los Angeles, Paris, Tokyo",
            "description": "Alternative: Enter city or country name instead"
          }
        ]
      },
      {
        "id": "travel-window",
        "title": "Travel Window",
        "description": "When are you willing to travel?",
        "fields": [
          {
            "id": "earliest_departure",
            "type": "date",
            "label": "Earliest Departure Date",
            "placeholder": "Select earliest date you can leave",
            "validation": { "required": true },
            "description": "The earliest date you are willing to start your trip"
          },
          {
            "id": "latest_departure",
            "type": "date",
            "label": "Latest Departure Date", 
            "placeholder": "Select latest date you can leave",
            "validation": { "required": true },
            "description": "The latest date you are willing to start your trip"
          }
        ]
      },
      {
        "id": "trip-duration",
        "title": "Trip Duration",
        "description": "How long do you want to stay?",
        "fields": [
          {
            "id": "min_duration",
            "type": "number",
            "label": "Minimum Duration (days)",
            "defaultValue": 3,
            "validation": { "required": true, "min": 1, "max": 30 },
            "description": "Shortest trip length you would accept"
          },
          {
            "id": "max_duration",
            "type": "number",
            "label": "Maximum Duration (days)",
            "defaultValue": 7,
            "validation": { "required": true, "min": 1, "max": 30 },
            "description": "Longest trip length you would accept"
          }
        ]
      },
      {
        "id": "budget-preferences",
        "title": "Budget",
        "description": "Set your maximum budget - we will find round-trip, non-stop flights with carry-on included",
        "fields": [
          {
            "id": "max_price",
            "type": "number",
            "label": "Maximum Price (USD)",
            "placeholder": "e.g., 500",
            "defaultValue": 1000,
            "validation": { "required": true, "min": 100, "max": 10000 },
            "description": "Your maximum budget per person - includes round-trip, non-stop flights with carry-on bag"
          }
        ]
      },
      {
        "id": "auto-booking",
        "title": "Auto-Booking (Optional)",
        "description": "Let us automatically book when we find a great deal",
        "fields": [
          {
            "id": "auto_book_enabled",
            "type": "checkbox",
            "label": "Enable Auto-Booking",
            "defaultValue": false,
            "description": "Automatically book flights that match your criteria"
          },
          {
            "id": "preferred_payment_method_id",
            "type": "select",
            "label": "Payment Method",
            "options": [
              { "label": "Select payment method...", "value": "", "disabled": true },
              { "label": "Visa ending in 1234", "value": "pm_card_1234" },
              { "label": "MasterCard ending in 5678", "value": "pm_card_5678" }
            ],
            "conditional": {
              "showWhen": { "field": "auto_book_enabled", "operator": "equals", "value": true }
            },
            "validation": { "required": false },
            "description": "Payment method for automatic bookings"
          }
        ]
      }
    ],
    "metadata": {
      "created": "2025-07-05T00:00:00Z",
      "createdBy": "system",
      "lastModified": "2025-07-05T00:00:00Z",
      "tags": ["flight", "booking", "travel", "parker-flight"]
    }
  }',
  '{
    "type": "object",
    "properties": {
      "nyc_airports": { "type": "array", "items": { "type": "string" } },
      "other_departure_airport": { "type": "string" },
      "destination_airport": { "type": "string", "minLength": 3, "maxLength": 3 },
      "destination_other": { "type": "string" },
      "earliest_departure": { "type": "string", "format": "date" },
      "latest_departure": { "type": "string", "format": "date" },
      "min_duration": { "type": "number", "minimum": 1, "maximum": 30 },
      "max_duration": { "type": "number", "minimum": 1, "maximum": 30 },
      "max_price": { "type": "number", "minimum": 100, "maximum": 10000 },
      "auto_book_enabled": { "type": "boolean" },
      "preferred_payment_method_id": { "type": "string" }
    },
    "required": ["earliest_departure", "latest_departure", "min_duration", "max_duration", "max_price"]
  }',
  '{}',
  NOW()
) ON CONFLICT (name, version) DO UPDATE SET
  config_data = EXCLUDED.config_data,
  validation_schema = EXCLUDED.validation_schema,
  deployed_at = NOW();
