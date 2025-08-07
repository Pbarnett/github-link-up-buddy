import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const exchangeRateApiKey = Deno.env.get("EXCHANGE_RATE_API_KEY"); // Get from exchangerate-api.com or similar

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ExchangeRateRequest {
  from_currency: string;
  to_currency: string;
}

interface HistoricalRatesRequest {
  from_currency: string;
  to_currency: string;
  days: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const jwt = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const endpoint = url.pathname.split('/').pop();

    switch (endpoint) {
      case 'exchange-rate':
        if (req.method === 'POST') {
          return await handleGetExchangeRate(await req.json());
        }
        break;
      
      case 'historical-rates':
        if (req.method === 'POST') {
          return await handleGetHistoricalRates(await req.json());
        }
        break;
      
      case 'supported-currencies':
        if (req.method === 'GET') {
          return handleGetSupportedCurrencies();
        }
        break;
      
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown endpoint' }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Currency service error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function handleGetExchangeRate(requestData: ExchangeRateRequest) {
  const { from_currency, to_currency } = requestData;

  if (!from_currency || !to_currency) {
    return new Response(
      JSON.stringify({ error: 'Missing currency parameters' }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // If same currency, return 1.0
  if (from_currency === to_currency) {
    return new Response(
      JSON.stringify({ rate: 1.0, last_updated: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Try to get cached rate first (valid for 1 hour)
    const cachedRate = await getCachedExchangeRate(from_currency, to_currency);
    if (cachedRate) {
      return new Response(
        JSON.stringify(cachedRate),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch fresh rate from external API
    const rate = await fetchExchangeRateFromAPI(from_currency, to_currency);
    
    // Cache the rate
    await cacheExchangeRate(from_currency, to_currency, rate);

    return new Response(
      JSON.stringify({ rate, last_updated: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error getting exchange rate:', error);
    
    // Try to get last known rate as fallback
    const fallbackRate = await getLastKnownRate(from_currency, to_currency);
    if (fallbackRate) {
      return new Response(
        JSON.stringify({ 
          rate: fallbackRate.rate, 
          last_updated: fallbackRate.last_updated,
          note: 'Fallback rate used due to API unavailability'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Ultimate fallback to 1.0 (not ideal but prevents total failure)
    return new Response(
      JSON.stringify({ 
        rate: 1.0, 
        last_updated: new Date().toISOString(),
        error: 'Unable to fetch exchange rate, using fallback'
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

async function handleGetHistoricalRates(requestData: HistoricalRatesRequest) {
  const { from_currency, to_currency, days } = requestData;

  if (!from_currency || !to_currency) {
    return new Response(
      JSON.stringify({ error: 'Missing currency parameters' }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Get historical rates from our database
    const { data: rates, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .eq('from_currency', from_currency)
      .eq('to_currency', to_currency)
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify(rates || []),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error getting historical rates:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch historical rates' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

function handleGetSupportedCurrencies() {
  const supportedCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', regions: ['US'] },
    { code: 'EUR', name: 'Euro', symbol: '€', regions: ['DE', 'FR', 'IT', 'ES'] },
    { code: 'GBP', name: 'British Pound', symbol: '£', regions: ['GB'] },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', regions: ['CA'] },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', regions: ['AU'] },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', regions: ['JP'] },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', regions: ['CH'] },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', regions: ['SE'] },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', regions: ['NO'] },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr', regions: ['DK'] },
  ];

  return new Response(
    JSON.stringify({ currencies: supportedCurrencies }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function getCachedExchangeRate(fromCurrency: string, toCurrency: string) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from('exchange_rates')
    .select('rate, last_updated')
    .eq('from_currency', fromCurrency)
    .eq('to_currency', toCurrency)
    .gte('last_updated', oneHourAgo)
    .order('last_updated', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    rate: data.rate,
    last_updated: data.last_updated
  };
}

async function fetchExchangeRateFromAPI(fromCurrency: string, toCurrency: string): Promise<number> {
  if (exchangeRateApiKey) {
    // Use exchangerate-api.com (or similar service)
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/pair/${fromCurrency}/${toCurrency}`
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.conversion_rate;
    }
  }

  // Fallback to free API (with rate limits)
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.rates[toCurrency] || 1.0;
    }
  } catch (error) {
    console.warn('Fallback exchange rate API failed:', error);
  }

  // Another fallback option using fixer.io free tier
  try {
    const response = await fetch(
      `https://api.fixer.io/latest?base=${fromCurrency}&symbols=${toCurrency}`
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.rates[toCurrency] || 1.0;
    }
  } catch (error) {
    console.warn('Fixer.io API failed:', error);
  }

  throw new Error('All exchange rate APIs unavailable');
}

async function cacheExchangeRate(fromCurrency: string, toCurrency: string, rate: number) {
  try {
    const { error } = await supabase
      .from('exchange_rates')
      .upsert({
        from_currency: fromCurrency,
        to_currency: toCurrency,
        rate: rate,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: 'from_currency,to_currency'
      });

    if (error) {
      console.error('Failed to cache exchange rate:', error);
    }
  } catch (error) {
    console.error('Error caching exchange rate:', error);
  }
}

async function getLastKnownRate(fromCurrency: string, toCurrency: string) {
  const { data, error } = await supabase
    .from('exchange_rates')
    .select('rate, last_updated')
    .eq('from_currency', fromCurrency)
    .eq('to_currency', toCurrency)
    .order('last_updated', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}
