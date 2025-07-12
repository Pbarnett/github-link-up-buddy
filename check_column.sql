-- Does the column exist?
select column_name
from information_schema.columns
where table_name = 'feature_flags'
  and column_name = 'rollout_percentage';
