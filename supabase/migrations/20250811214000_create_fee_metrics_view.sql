-- Create daily fee metrics view for booking_requests
-- Shows daily total fee, average savings, fee application rate

create or replace view public.fee_metrics_daily as
select
  date(created_at) as day,
  sum(coalesce((offer_data->'fee_breakdown'->>'fee_amount_cents')::int, 0)) as fee_cents_sum,
  avg(nullif((offer_data->'fee_breakdown'->>'savings')::numeric, null)) as avg_savings,
  count(*) filter (where coalesce((offer_data->'fee_breakdown'->>'fee_amount_cents')::int, 0) > 0) as with_fee_count,
  count(*) as total_count,
  case when count(*) > 0 then
    (count(*) filter (where coalesce((offer_data->'fee_breakdown'->>'fee_amount_cents')::int, 0) > 0))::decimal / count(*)
  else 0 end as fee_application_rate
from public.booking_requests
group by 1
order by 1 desc;

