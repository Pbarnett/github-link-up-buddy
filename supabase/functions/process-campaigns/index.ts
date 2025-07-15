import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { stripe } from "../lib/stripe.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const duffelToken = Deno.env.get("DUFFEL_ACCESS_TOKEN");

if (!supabaseUrl || !supabaseServiceRoleKey || !duffelToken) {
  throw new Error("Missing required environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface FlightOffer {
  id: string;
  total_amount: string;
  total_currency: string;
  slices: Array<{
    segments: Array<{
      origin: { iata_code: string };
      destination: { iata_code: string };
      departing_at: string;
      arriving_at: string;
      marketing_carrier: { name: string; iata_code: string };
      flight_number: string;
    }>;
  }>;
}

interface DuffelSearchResponse {
  data: FlightOffer[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // This function should only be called by cron job or service role
    const authHeader = req.headers.get("Authorization");
    const isServiceRole = authHeader?.includes('service_role');
    
    if (!isServiceRole) {
      return new Response(JSON.stringify({ error: 'Unauthorized - Service role required' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log('Starting campaign processing...');
    
    // Get campaigns that are ready for processing
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select(`
        *,
        traveler_profiles (
          full_name,
          date_of_birth,
          gender,
          email,
          phone,
          passport_number_encrypted,
          passport_country,
          passport_expiry
        ),
        payment_methods (
          stripe_customer_id,
          stripe_payment_method_id,
          last4,
          brand
        )
      `)
      .eq('status', 'active')
      .lt('next_search_at', new Date().toISOString())
      .lt('expires_at', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()); // Not expired

    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError);
      throw campaignsError;
    }

    console.log(`Found ${campaigns?.length || 0} campaigns to process`);

    const results = [];
    
    for (const campaign of campaigns || []) {
      try {
        const result = await processCampaign(campaign);
        results.push(result);
        
        // Update next search time
        await supabase
          .from('campaigns')
          .update({
            next_search_at: new Date(Date.now() + campaign.search_frequency_hours * 60 * 60 * 1000).toISOString(),
            last_searched_at: new Date().toISOString()
          })
          .eq('id', campaign.id);

      } catch (error) {
        console.error(`Error processing campaign ${campaign.id}:`, error);
        results.push({
          campaign_id: campaign.id,
          success: false,
          error: error.message
        });
      }
    }

    return new Response(JSON.stringify({
      processed: results.length,
      results
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Campaign processing error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

async function processCampaign(campaign: {
  id: string;
  origin: string;
  destination: string;
  max_price: number;
  currency: string;
  max_bookings: number;
  departure_date_start?: string;
  return_date_start?: string;
  cabin_class?: string;
  user_id: string;
  traveler_profiles: {
    full_name: string;
    date_of_birth: string;
    gender: string;
    email: string;
    phone: string;
    passport_number_encrypted?: string;
    passport_country?: string;
    passport_expiry?: string;
  };
  payment_methods: {
    stripe_customer_id: string;
    stripe_payment_method_id: string;
  };
  [key: string]: unknown;
}) {
  console.log(`Processing campaign ${campaign.id}: ${campaign.origin} to ${campaign.destination}`);

  // 1. Search for flights using Duffel API
  const offers = await searchFlights(campaign);
  
  if (!offers || offers.length === 0) {
    return {
      campaign_id: campaign.id,
      success: true,
      action: 'no_offers_found',
      message: 'No flights found matching criteria'
    };
  }

  // 2. Filter offers by price criteria
  const validOffers = offers.filter(offer => {
    const price = parseFloat(offer.total_amount);
    return price <= campaign.max_price && offer.total_currency === campaign.currency;
  });

  if (validOffers.length === 0) {
    return {
      campaign_id: campaign.id,
      success: true,
      action: 'no_valid_offers',
      message: `Found ${offers.length} offers but none under max price of ${campaign.max_price} ${campaign.currency}`
    };
  }

  // 3. Select best offer (cheapest)
  const bestOffer = validOffers.reduce((best, current) => {
    return parseFloat(current.total_amount) < parseFloat(best.total_amount) ? current : best;
  });

  console.log(`Found valid offer: ${bestOffer.total_amount} ${bestOffer.total_currency}`);

  // 4. Check if user hasn't reached max bookings for this campaign
  const { data: existingBookings } = await supabase
    .from('campaign_bookings')
    .select('id')
    .eq('campaign_id', campaign.id);

  if (existingBookings && existingBookings.length >= campaign.max_bookings) {
    // Mark campaign as completed
    await supabase
      .from('campaigns')
      .update({ status: 'completed' })
      .eq('id', campaign.id);

    return {
      campaign_id: campaign.id,
      success: true,
      action: 'campaign_completed',
      message: 'Campaign reached maximum bookings'
    };
  }

  // 5. Attempt to book the flight
  try {
    const bookingResult = await bookFlight(campaign, bestOffer);
    
    // 6. Update campaign booking count
    await supabase
      .from('campaigns')
      .update({
        bookings_made: (existingBookings?.length || 0) + 1,
        status: (existingBookings?.length || 0) + 1 >= campaign.max_bookings ? 'completed' : 'active'
      })
      .eq('id', campaign.id);

    return {
      campaign_id: campaign.id,
      success: true,
      action: 'booking_created',
      booking_id: bookingResult.booking_id,
      amount: bestOffer.total_amount,
      currency: bestOffer.total_currency
    };

  } catch (bookingError) {
    console.error('Booking failed:', bookingError);
    return {
      campaign_id: campaign.id,
      success: false,
      action: 'booking_failed',
      error: bookingError.message
    };
  }
}

async function searchFlights(campaign: {
  origin: string;
  destination: string;
  departure_date_start?: string;
  return_date_start?: string;
  cabin_class?: string;
}): Promise<FlightOffer[]> {
  // Build search request for Duffel
  const searchRequest = {
    data: {
      slices: [
        {
          origin: campaign.origin,
          destination: campaign.destination,
          departure_date: campaign.departure_date_start || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ],
      passengers: [
        {
          type: "adult"
        }
      ],
      cabin_class: campaign.cabin_class
    }
  };

  // Add return slice if it's a round trip
  if (campaign.return_date_start) {
    searchRequest.data.slices.push({
      origin: campaign.destination,
      destination: campaign.origin,
      departure_date: campaign.return_date_start
    });
  }

  const response = await fetch('https://api.duffel.com/air/offer_requests', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${duffelToken}`,
      'Content-Type': 'application/json',
      'Duffel-Version': 'v1'
    },
    body: JSON.stringify(searchRequest)
  });

  if (!response.ok) {
    throw new Error(`Duffel search failed: ${response.statusText}`);
  }

  const searchResult = await response.json();
  
  // Get offers from the offer request
  const offersResponse = await fetch(`https://api.duffel.com/air/offers?offer_request_id=${searchResult.data.id}`, {
    headers: {
      'Authorization': `Bearer ${duffelToken}`,
      'Duffel-Version': 'v1'
    }
  });

  if (!offersResponse.ok) {
    throw new Error(`Duffel offers fetch failed: ${offersResponse.statusText}`);
  }

  const offersResult: DuffelSearchResponse = await offersResponse.json();
  return offersResult.data || [];
}

async function bookFlight(campaign: {
  id: string;
  user_id: string;
  traveler_profiles: {
    full_name: string;
    date_of_birth: string;
    gender: string;
    email: string;
    phone: string;
    passport_number_encrypted?: string;
    passport_country?: string;
    passport_expiry?: string;
  };
  payment_methods: {
    stripe_customer_id: string;
    stripe_payment_method_id: string;
  };
}, offer: FlightOffer) {
  console.log(`Attempting to book flight for campaign ${campaign.id}`);

  // 1. First charge the payment method
  const paymentResult = await chargePayment(campaign, offer);
  
  if (!paymentResult.success) {
    throw new Error(`Payment failed: ${paymentResult.error}`);
  }

  try {
    // 2. Create Duffel order
    const travelerProfile = campaign.traveler_profiles;
    
    // Decrypt passport number if available
    let passportNumber = null;
    if (travelerProfile.passport_number_encrypted) {
      const { data: decryptedPassport } = await supabase
        .rpc('decrypt_passport_number', { encrypted_passport: travelerProfile.passport_number_encrypted });
      passportNumber = decryptedPassport;
    }

    const orderRequest = {
      data: {
        selected_offers: [offer.id],
        payments: [
          {
            type: "balance",
            amount: offer.total_amount,
            currency: offer.total_currency
          }
        ],
        passengers: [
          {
            id: offer.slices[0].segments[0].passengers?.[0]?.id || "passenger_1",
            title: getTitle(travelerProfile.gender),
            gender: travelerProfile.gender.toLowerCase(),
            given_name: getFirstName(travelerProfile.full_name),
            family_name: getLastName(travelerProfile.full_name),
            born_on: travelerProfile.date_of_birth,
            email: travelerProfile.email,
            phone_number: travelerProfile.phone,
            ...(passportNumber && {
              identity_documents: [
                {
                  unique_identifier: passportNumber,
                  issuing_country_code: travelerProfile.passport_country,
                  expires_on: travelerProfile.passport_expiry,
                  document_type: "passport"
                }
              ]
            })
          }
        ]
      }
    };

    const orderResponse = await fetch('https://api.duffel.com/air/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${duffelToken}`,
        'Content-Type': 'application/json',
        'Duffel-Version': 'v1'
      },
      body: JSON.stringify(orderRequest)
    });

    if (!orderResponse.ok) {
      // If booking fails, refund the payment
      await stripe.refunds.create({
        payment_intent: paymentResult.payment_intent_id
      });
      
      const errorText = await orderResponse.text();
      throw new Error(`Duffel booking failed: ${errorText}`);
    }

    const orderResult = await orderResponse.json();
    const order = orderResult.data;

    // 3. Save booking to database
    const { data: booking, error: bookingError } = await supabase
      .from('campaign_bookings')
      .insert({
        campaign_id: campaign.id,
        user_id: campaign.user_id,
        duffel_order_id: order.id,
        stripe_payment_intent_id: paymentResult.payment_intent_id,
        pnr: order.booking_reference,
        total_amount: parseFloat(offer.total_amount),
        currency: offer.total_currency,
        booking_reference: order.booking_reference,
        booking_status: 'confirmed',
        payment_status: 'paid',
        flight_details: {
          offer: offer,
          order: order
        }
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Database booking save failed:', bookingError);
      // Consider refunding here as well
    }

    // 4. Send confirmation email (optional - implement as needed)
    await sendBookingConfirmation(campaign, booking, order);

    console.log(`Successfully booked flight ${order.booking_reference} for campaign ${campaign.id}`);
    
    return {
      booking_id: booking.id,
      duffel_order_id: order.id,
      pnr: order.booking_reference
    };

  } catch (error) {
    // If order creation failed, refund the payment
    await stripe.refunds.create({
      payment_intent: paymentResult.payment_intent_id
    });
    throw error;
  }
}

async function chargePayment(campaign: {
  id: string;
  user_id: string;
  payment_methods: {
    stripe_customer_id: string;
    stripe_payment_method_id: string;
  };
}, offer: FlightOffer) {
  try {
    const paymentMethod = campaign.payment_methods;
    const amount = Math.round(parseFloat(offer.total_amount) * 100); // Convert to cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: offer.total_currency.toLowerCase(),
      customer: paymentMethod.stripe_customer_id,
      payment_method: paymentMethod.stripe_payment_method_id,
      confirm: true,
      off_session: true, // Indicates this is for a saved payment method
      metadata: {
        campaign_id: campaign.id,
        duffel_offer_id: offer.id,
        user_id: campaign.user_id
      }
    });

    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        payment_intent_id: paymentIntent.id
      };
    } else {
      return {
        success: false,
        error: `Payment failed with status: ${paymentIntent.status}`
      };
    }

  } catch (error) {
    console.error('Payment charging error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function sendBookingConfirmation(_campaign: unknown, booking: { id: string }) {
  // TODO: Implement email sending using your preferred email service
  // This could use the existing send-booking-confirmation function
  console.log(`Booking confirmation should be sent for booking ${booking.id}`);
}

// Helper functions
function getTitle(gender: string): string {
  return gender === 'MALE' ? 'mr' : gender === 'FEMALE' ? 'ms' : 'mx';
}

function getFirstName(fullName: string): string {
  return fullName.split(' ')[0];
}

function getLastName(fullName: string): string {
  const parts = fullName.split(' ');
  return parts.length > 1 ? parts.slice(1).join(' ') : parts[0];
}
