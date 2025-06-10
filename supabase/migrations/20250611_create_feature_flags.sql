create table feature_flags (key text primary key, value jsonb default '{}', updated_at timestamptz default now());
insert into feature_flags(key,value) values ('auto_booking_v2','{"enabled":false}');
