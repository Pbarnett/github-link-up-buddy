-- Fee metrics quick check script
-- Usage: psql or Supabase SQL editor

-- 1) Last 14 days fee summary
select * from public.fee_metrics_daily order by day desc limit 14;

-- 2) Recent bookings with fee (last 50)
select id,
       created_at,
       (offer_data->'fee_breakdown'->>'threshold_price') as threshold_price,
       (offer_data->'fee_breakdown'->>'actual_price') as actual_price,
       (offer_data->'fee_breakdown'->>'savings') as savings,
       (offer_data->'fee_breakdown'->>'fee_pct') as fee_pct,
       (offer_data->'fee_breakdown'->>'fee_amount_cents') as fee_amount_cents,
       (offer_data->'fee_breakdown'->>'payment_intent_id') as payment_intent_id,
       (offer_data->'fee_breakdown'->>'checkout_session_id') as checkout_session_id
from public.booking_requests
where (offer_data->'fee_breakdown'->>'fee_amount_cents') is not null
order by created_at desc
limit 50;

-- 3) Fee application rate in the last 7 days
select
  sum((offer_data->'fee_breakdown'->>'fee_amount_cents')::int > 0)::int as with_fee,
  count(*) as total,
  case when count(*)>0 then sum((offer_data->'fee_breakdown'->>'fee_amount_cents')::int > 0)::decimal / count(*) else 0 end as rate
from public.booking_requests
where created_at >= now() - interval '7 days';

