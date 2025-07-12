-- Seed script for dynamic forms demo
-- Insert sample form configurations

-- Parker Flight Search Form Configuration (Travel Window Approach)
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
        "description": "Select all airports you're willing to fly from",
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
            "description": "The earliest date you're willing to start your trip"
          },
          {
            "id": "latest_departure",
            "type": "date",
            "label": "Latest Departure Date", 
            "placeholder": "Select latest date you can leave",
            "validation": { "required": true },
            "description": "The latest date you're willing to start your trip"
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
            "description": "Shortest trip length you'd accept"
          },
          {
            "id": "max_duration",
            "type": "number",
            "label": "Maximum Duration (days)",
            "defaultValue": 7,
            "validation": { "required": true, "min": 1, "max": 30 },
            "description": "Longest trip length you'd accept"
          }
        ]
      },
      {
        "id": "budget-preferences",
        "title": "Budget & Preferences",
        "description": "Set your budget and flight preferences",
        "fields": [
          {
            "id": "max_price",
            "type": "number",
            "label": "Maximum Price (USD)",
            "placeholder": "e.g., 500",
            "defaultValue": 1000,
            "validation": { "required": true, "min": 100, "max": 10000 },
            "description": "Your maximum budget per person, including bags and fees"
          },
          {
            "id": "nonstop_required",
            "type": "checkbox",
            "label": "Direct flights only",
            "defaultValue": true,
            "description": "Only show non-stop flights (recommended)"
          },
          {
            "id": "baggage_included_required",
            "type": "checkbox",
            "label": "Include carry-on bag in price",
            "defaultValue": false,
            "description": "Ensure carry-on bag fee is included in the total price"
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
          },
          {
            "id": "auto_book_consent",
            "type": "checkbox",
            "label": "I authorize Parker Flight to automatically book flights matching my criteria using my selected payment method",
            "conditional": {
              "showWhen": { "field": "auto_book_enabled", "operator": "equals", "value": true }
            },
            "validation": { "required": false },
            "description": "Required for auto-booking functionality"
          }
        ]
      }
    ],
    "metadata": {
      "created": "2025-07-05T00:00:00Z",
      "createdBy": "system",
      "lastModified": "2025-07-05T00:00:00Z",
      "tags": ["flight", "booking", "travel"]
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
      "nonstop_required": { "type": "boolean" },
      "baggage_included_required": { "type": "boolean" },
      "auto_book_enabled": { "type": "boolean" },
      "preferred_payment_method_id": { "type": "string" },
      "auto_book_consent": { "type": "boolean" }
    },
    "required": ["earliest_departure", "latest_departure", "min_duration", "max_duration", "max_price"],
    "anyOf": [
      { "required": ["destination_airport"] },
      { "required": ["destination_other"] }
    ]
  }',
  '{}',
  NOW()
),
(
  'payment-setup-v1',
  1,
  'deployed',
  '{
    "id": "payment-setup-v1",
    "name": "Payment Method Setup",
    "title": "Add Payment Method",
    "description": "Securely add a payment method to your account",
    "version": 1,
    "sections": [
      {
        "id": "payment-details",
        "title": "Payment Information",
        "fields": [
          {
            "id": "cardholder-name",
            "type": "text",
            "label": "Cardholder Name",
            "placeholder": "Name as it appears on card",
            "validation": { "required": true, "minLength": 2 }
          },
          {
            "id": "card-number",
            "type": "text",
            "label": "Card Number",
            "placeholder": "1234 5678 9012 3456",
            "validation": { 
              "required": true,
              "pattern": "^[0-9]{13,19}$",
              "message": "Please enter a valid card number"
            }
          },
          {
            "id": "expiry-date",
            "type": "text",
            "label": "Expiry Date",
            "placeholder": "MM/YY",
            "validation": { 
              "required": true,
              "pattern": "^(0[1-9]|1[0-2])\\/([0-9]{2})$",
              "message": "Please enter expiry date in MM/YY format"
            }
          },
          {
            "id": "cvv",
            "type": "password",
            "label": "CVV",
            "placeholder": "123",
            "validation": { 
              "required": true,
              "pattern": "^[0-9]{3,4}$",
              "message": "Please enter a valid CVV"
            }
          }
        ]
      },
      {
        "id": "billing-address",
        "title": "Billing Address",
        "fields": [
          {
            "id": "address-line-1",
            "type": "text",
            "label": "Address Line 1",
            "placeholder": "123 Main St",
            "validation": { "required": true }
          },
          {
            "id": "address-line-2",
            "type": "text",
            "label": "Address Line 2",
            "placeholder": "Apt 4B (optional)"
          },
          {
            "id": "city",
            "type": "text",
            "label": "City",
            "placeholder": "New York",
            "validation": { "required": true }
          },
          {
            "id": "country",
            "type": "country-select",
            "label": "Country",
            "validation": { "required": true }
          },
          {
            "id": "postal-code",
            "type": "text",
            "label": "Postal Code",
            "placeholder": "10001",
            "validation": { "required": true }
          }
        ]
      }
    ],
    "metadata": {
      "created": "2025-07-05T00:00:00Z",
      "createdBy": "system",
      "lastModified": "2025-07-05T00:00:00Z",
      "tags": ["payment", "billing", "setup"]
    }
  }',
  '{
    "type": "object",
    "properties": {
      "cardholder-name": { "type": "string", "minLength": 2 },
      "card-number": { "type": "string", "pattern": "^[0-9]{13,19}$" },
      "expiry-date": { "type": "string", "pattern": "^(0[1-9]|1[0-2])\\/([0-9]{2})$" },
      "cvv": { "type": "string", "pattern": "^[0-9]{3,4}$" },
      "address-line-1": { "type": "string", "minLength": 1 },
      "address-line-2": { "type": "string" },
      "city": { "type": "string", "minLength": 1 },
      "country": { "type": "string", "minLength": 2 },
      "postal-code": { "type": "string", "minLength": 1 }
    },
    "required": ["cardholder-name", "card-number", "expiry-date", "cvv", "address-line-1", "city", "country", "postal-code"]
  }',
  '{}',
  NOW()
),
(
  'customer-survey-v1',
  1,
  'deployed',
  '{
    "id": "customer-survey-v1",
    "name": "Travel Preferences Survey",
    "title": "Help Us Improve Your Experience",
    "description": "Share your travel preferences to get personalized recommendations",
    "version": 1,
    "sections": [
      {
        "id": "travel-habits",
        "title": "Travel Habits",
        "fields": [
          {
            "id": "travel-frequency",
            "type": "select",
            "label": "How often do you travel?",
            "options": [
              { "label": "Monthly", "value": "monthly" },
              { "label": "Quarterly", "value": "quarterly" },
              { "label": "Annually", "value": "annually" },
              { "label": "Rarely", "value": "rarely" }
            ],
            "validation": { "required": true }
          },
          {
            "id": "travel-purpose",
            "type": "multi-select",
            "label": "What do you usually travel for?",
            "options": [
              { "label": "Business", "value": "business" },
              { "label": "Leisure", "value": "leisure" },
              { "label": "Family visits", "value": "family" },
              { "label": "Events", "value": "events" }
            ],
            "validation": { "required": true }
          },
          {
            "id": "budget-range",
            "type": "slider",
            "label": "Typical flight budget (USD)",
            "validation": { "min": 100, "max": 5000 },
            "defaultValue": 500
          }
        ]
      },
      {
        "id": "preferences",
        "title": "Your Preferences",
        "fields": [
          {
            "id": "notification-preference",
            "type": "radio",
            "label": "How would you like to receive updates?",
            "options": [
              { "label": "Email only", "value": "email" },
              { "label": "SMS only", "value": "sms" },
              { "label": "Both email and SMS", "value": "both" },
              { "label": "No notifications", "value": "none" }
            ],
            "validation": { "required": true }
          },
          {
            "id": "experience-rating",
            "type": "rating",
            "label": "Rate your current booking experience",
            "validation": { "required": true }
          },
          {
            "id": "feedback",
            "type": "textarea",
            "label": "Additional feedback (optional)",
            "placeholder": "Tell us what you love or what we could improve..."
          }
        ]
      }
    ],
    "metadata": {
      "created": "2025-07-05T00:00:00Z",
      "createdBy": "system",
      "lastModified": "2025-07-05T00:00:00Z",
      "tags": ["survey", "feedback", "preferences"]
    }
  }',
  '{
    "type": "object",
    "properties": {
      "travel-frequency": { "type": "string", "enum": ["monthly", "quarterly", "annually", "rarely"] },
      "travel-purpose": { "type": "array", "items": { "type": "string" } },
      "budget-range": { "type": "number", "minimum": 100, "maximum": 5000 },
      "notification-preference": { "type": "string", "enum": ["email", "sms", "both", "none"] },
      "experience-rating": { "type": "number", "minimum": 1, "maximum": 5 },
      "feedback": { "type": "string" }
    },
    "required": ["travel-frequency", "travel-purpose", "notification-preference", "experience-rating"]
  }',
  '{}',
  NOW()
);
