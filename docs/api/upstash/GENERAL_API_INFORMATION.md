Getting Started
Using Upstash API, you can develop applications that can create and manage Upstash products and resources. You can automate everything that you can do in the console. To use developer API, you need to create an API key in the console.
The Developer API is only available to native Upstash accounts. Accounts created via third-party platforms like Vercel or Fly.io are not supported.
​
Create an API key
Log in to the console then in the left menu click the Account > Management API link.
Click the Create API Key button.

Enter a name for your key. You can not use the same name for multiple keys.


You need to download or copy/save your API key. Upstash does not remember or keep your API for security reasons. So if you forget your API key, it becomes useless; you need to create a new one.

You can create multiple keys. It is recommended to use different keys in different applications. By default one user can create up to 37 API keys. If you need more than that, please send us an email at support@upstash.com
​
Deleting an API key
When an API key is exposed (e.g. accidentally shared in a public repository) or not being used anymore; you should delete it. You can delete the API keys in Account > API Keys screen.
​
Roadmap
Role based access: You will be able to create API keys with specific privileges. For example you will be able to create a key with read-only access.
Stats: We will provide reports based on usage of your API keys.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Authentication
x
github
discord
Powered by Mintlify
Authentication
Authentication for the Upstash Developer API
The Upstash API requires API keys to authenticate requests. You can view and manage API keys at the Upstash Console.
Upstash API uses HTTP Basic authentication. You should pass EMAIL and API_KEY as basic authentication username and password respectively.
With a client such as curl, you can pass your credentials with the -u option, as the following example shows:
Copy
Ask AI
curl https://api.upstash.com/v2/redis/database -u EMAIL:API_KEY

Replace EMAIL and API_KEY with your email and API key.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Getting Started
HTTP Status Codes
x
github
discord
Powered by Mintlify
Authentication - Upstash Documentation
HTTP Status Codes
The Upstash API uses the following HTTP Status codes:
Code
Description


200
OK
Indicates that a request completed successfully and the response contains data.
400
Bad Request
Your request is invalid.
401
Unauthorized
Your API key is wrong.
403
Forbidden
The kitten requested is hidden for administrators only.
404
Not Found
The specified kitten could not be found.
405
Method Not Allowed
You tried to access a kitten with an invalid method.
406
Not Acceptable
You requested a format that isn’t JSON.
429
Too Many Requests
You’re requesting too many kittens! Slow down!
500
Internal Server Error
We had a problem with our server. Try again later.
503
Service Unavailable
We’re temporarily offline for maintenance. Please try again later.

Was this page helpful?
Yes
No
Suggest edits
Raise issue
Authentication
Create a Redis Database (Regional - DEPRECATED)
x
github
discord
Powered by Mintlify
HTTP Status Codes - Upstash Documentation
Redis
Create a Redis Database (Regional - DEPRECATED)
This endpoint creates a new regional Redis database. This behaviour is deprecated in favor of Global databases and support for it will be removed in the upcoming releases.
POST
/
v2
/
redis
/
database
Try it
​
Request Parameters
​
name
stringrequired
Name of the database
​
region
stringrequired
Region of the database.\ Options: eu-west-1, us-east-1, us-west-1, ap-northeast-1 or us-central1
​
tls
booleanrequired
Set true to enable tls.
​
Response Parameters
​
database_id
string
ID of the created database
​
database_name
string
Name of the database
​
database_type
string
Type of the database in terms of pricing model(Free, Pay as You Go or Enterprise)
​
region
string
The region where database is hosted
​
port
int
Database port for clients to connect
​
creation_time
int
Creation time of the database as Unix time
​
state
string
State of database (active or deleted)
​
password
string
Password of the database
​
user_email
string
Email or team id of the owner of the database
​
endpoint
string
Endpoint URL of the database
​
tls
boolean
TLS/SSL is enabled or not


curl -X POST \
  https://api.upstash.com/v2/redis/database \
  -u 'EMAIL:API_KEY' \
  -d '{"name":"myredis","region":"eu-west-1","tls": true}'

200 OK
Copy
Ask AI
{
  "database_id": "96ad0856-03b1-4ee7-9666-e81abd0349e1",
  "database_name": "MyRedis",
  "database_type": "Pay as You Go",
  "region": "eu-central-1",
  "port": 30143,
  "creation_time": 1658909671,
  "state": "active",
  "password": "038a8e27c45e43068d5f186085399884",
  "user_email": "example@upstash.com",
  "endpoint": "eu2-sought-mollusk-30143.upstash.io",
  "tls": true,
  "rest_token": "AXW_ASQgOTZhZDA4NTYtMDNiMS00ZWU3LTk2NjYtZTgxYWJkMDM0OWUxMDM4YThlMjdjNDVlNDMwNjhkNWYxODYwODUzOTk4ODQ=",
  "read_only_rest_token": "AnW_ASQgOTZhZDA4NTYtMDNiMS00ZWU3LTk2NjYtZTgxYWJkMDM0OWUx8sbmiEcMm9u7Ks5Qx-kHNiWr_f-iUXSIH8MlziKMnpY="
}
Create a Redis Database (Global)
This endpoint creates a new Redis database.
POST
/
v2
/
redis
/
database
Try it
​
Request Parameters
​
name
stringrequired
Name of the database
​
region
stringdefault:"global"required
Region of the database. Only valid option is global.
​
plan
string
Specifies the fixed plan type for the database. If omitted, the database defaults to either the pay-as-you-go or free plan, based on the account type.
Available options: payg, fixed_250mb, fixed_1gb, fixed_5gb, fixed_10gb, fixed_50gb, fixed_100gb, fixed_500gb.
​
primary_region
stringrequired
Primary Region of the Global Database.
Available regions: us-east-1, us-west-1, us-west-2, eu-west-1, eu-central-1, ap-southeast-1, ap-southeast-2, sa-east-1
​
read_regions
Array<string>
Array of Read Regions of the Database.
Available regions: us-east-1, us-west-1, us-west-2, eu-west-1, eu-central-1, ap-southeast-1, ap-southeast-2, ap-northeast-1, sa-east-1
​
budget
int
Monthly budget of the database
​
Response Parameters
​
database_id
string
ID of the created database
​
database_name
string
Name of the database
​
database_type
string
Type of the database in terms of pricing model(Free, Pay as You Go or Enterprise)
​
region
string
The region where database is hosted
​
port
int
Database port for clients to connect
​
creation_time
int
Creation time of the database as Unix time
​
state
string
State of database (active or deleted)
​
password
string
Password of the database
​
user_email
string
Email or team id of the owner of the database
​
endpoint
string
Endpoint URL of the database
​
tls
boolean
TLS is always enabled for new databases
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Create a Redis Database (Regional - DEPRECATED)
Delete Database
x
github
discord
Powered by Mintlify
Create a Redis Database (Global) - Upstash Documentation
curl -X POST \
  https://api.upstash.com/v2/redis/database \
  -u 'EMAIL:API_KEY' \
  -d '{"name":"myredis", "region":"global", "primary_region":"us-east-1", "read_regions":["us-west-1","us-west-2"], "tls": true}'

200 OK
Copy
Ask AI
{
  "database_id": "93e3a3e-342c-4683-ba75-344c08ae143b",
  "database_name": "global-test",
  "database_type": "Pay as You Go",
  "region": "global",
  "type": "paid",
  "port": 32559,
  "creation_time": 1674596896,
  "state": "active",
  "password": "dd1803832a2746309e118373549e574d",
  "user_email": "support@upstash.com",
  "endpoint": "steady-stud-32559.upstash.io",
  "tls": false,
  "rest_token": "AX8vACQgOTMyY2UyYy00NjgzLWJhNzUtMzQ0YzA4YWUxNDNiZMyYTI3NDYzMDllMTE4MzczNTQ5ZTU3NGQ=",
  "read_only_rest_token": "An8vACQg2UtMzQyYy00NjgzLWJhNzUtMzQ0YzA4YBVsUsyn19xDnTAvjbsiq79GRDrURNLzIYIOk="
}
curl
Python
Go
Copy
Ask AI
curl -X DELETE \
  https://api.upstash.com/v2/redis/database/:id \
  -u 'EMAIL:API_KEY'

200 OK
Copy
Ask AI
"OK"
List Databases
This endpoint list all databases of user.
GET
/
v2
/
redis
/
databases
Try it
​
Response Parameters
​
database_id
string
ID of the database
​
database_name
string
Name of the database
​
database_type
string
Type of the database in terms of pricing model\ Free, Pay as You Go or Enterprise
​
region
string
The region where database is hosted
​
port
int
Database port for clients to connect
​
creation_time
int
Creation time of the database as Unix time
​
state
string
State of database\ active or deleted
​
password
string
Password of the database
​
user_email
string
Email or team id of the owner of the database
​
endpoint
string
Endpoint URL of the database
​
tls
boolean
TLS/SSL is enabled or not
​
rest_token
string
Token for rest based communication with the database
​
read_only_rest_token
string
Read only token for rest based communication with the database
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Delete Database
Get Database
x
github
discord
Powered by Mintlify
List Databases - Upstash Documentation
curl
Python
Go
Copy
Ask AI
curl -X GET \
  https://api.upstash.com/v2/redis/databases \
  -u 'EMAIL:API_KEY'

200 OK
Copy
Ask AI
[
    {
        "database_id": "96ad0856-03b1-4ee7-9666-e81abd0349e1",
        "database_name": "MyRedis",
        "database_type": "Pay as You Go",
        "region": "eu-central-1",
        "port": 30143,
        "creation_time": 1658909671,
        "state": "active",
        "password": "038a8e27c45e43068d5f186085399884",
        "user_email": "example@upstash.com",
        "endpoint": "eu2-sought-mollusk-30143.upstash.io",
        "tls": true,
        "rest_token": "AXW_ASQgOTZhZDA4NTYtMDNiMS00ZWU3LTk2NjYtZTgxYWJkMDM0OWUxMDM4YThlMjdjNDVlNDMwNjhkNWYxODYwODUzOTk4ODQ=",
        "read_only_rest_token": "AnW_ASQgOTZhZDA4NTYtMDNiMS00ZWU3LTk2NjYtZTgxYWJkMDM0OWUx8sbmiEcMm9u7Ks5Qx-kHNiWr_f-iUXSIH8MlziKMnpY="
    }
]
Get Database
This endpoint gets details of a database.
GET
/
v2
/
redis
/
database
/
{id}
Try it
​
Request
​
id
stringrequired
The ID of the database to reset password
​
credentials
string
Set to hide to remove credentials from the response.
​
Response
​
database_id
string
ID of the created database
​
database_name
string
Name of the database
​
database_type
string
Type of the database in terms of pricing model(Free, Pay as You Go or Enterprise)
​
region
string
The region where database is hosted
​
port
int
Database port for clients to connect
​
creation_time
int
Creation time of the database as Unix time
​
state
string
State of database (active or deleted)
​
password
string
Password of the database
​
user_email
string
Email or team id of the owner of the database
​
endpoint
string
Endpoint URL of the database
​
tls
boolean
TLS/SSL is enabled or not
​
rest_token
string
Token for rest based communication with the database
​
read_only_rest_token
string
Read only token for rest based communication with the database
​
db_max_clients
int
Max number of concurrent clients can be opened on this database currently
​
db_max_request_size
int
Max size of a request that will be accepted by the database currently(in bytes)
​
db_disk_threshold
int
Total disk size limit that can be used for the database currently(in bytes)
​
db_max_entry_size
int
Max size of an entry that will be accepted by the database currently(in bytes)
​
db_memory_threshold
int
Max size of a memory the database can use(in bytes)
​
db_daily_bandwidth_limit
int
Max daily bandwidth can be used by the database(in bytes)
​
db_max_commands_per_second
int
Max number of commands can be sent to the database per second
​
db_request_limit
int
Total number of commands can be sent to the database
Was this page helpful?
Yes
No
Suggest edits
Raise issue
List Databases
Get Database Stats
x
github
discord
Powered by Mintlify
Get Database - Upstash Documentation
Redis
Get Database Stats
This endpoint gets detailed stats of a database.
GET
/
v2
/
redis
/
stats
/
{id}
Try it
​
URL Parameters
​
id
stringrequired
The ID of the database
​
Response Parameters
​
connection_count
Object
Show properties
​
keyspace
Object
Show Properties
​
throughput
Object
Show Properties
​
produce_throughput
Object
Show Properties
​
consume_throughput
Object
Show Properties
​
diskusage
Object
Show Properties
​
latencymax
Object
Show Properties
​
latencymin
Object
Show Properties
​
read_latency_mean
Object
Show Properties
​
read_latency_99
Object
Show Properties
​
write_latency_mean
Object
Show Properties
​
write_latency_99
Object
Show Properties
​
hits
Object
Show Properties
​
misses
Object
Show Properties
​
read
Object
Show Properties
​
write
Object
Show Properties
​
dailyrequests
Object
Show Properties
​
dailybandwidth
int
The total daily bandwidth usage (in bytes).
​
bandwidths
Object
Show Properties
​
days
Array<string>
A list of the days of the week for the measurement
​
dailybilling
Object
Show Properties
​
dailyproduce
int
Total number of daily produced commands
​
dailyconsume
int
Total number of daily consumed commands
​
total_monthly_requests
int
The total number of requests made in the current month.
​
total_monthly_read_requests
int
The total number of read requests made in the current month.
​
total_monthly_write_requests
int
The total number of write requests made in the current month.
​
total_monthly_storage
int
The total amount of storage used (in bytes) in the current month.
​
total_monthly_billing
int
Total cost of the database in the current month
​
total_monthly_produce
int
Total number of produce commands in the current month
​
total_monthly_consume
int
Total number of consume commands in the current month
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Get Database
Update Regions (Global)
x
github
discord
Powered by Mintlify
Get Database Stats - Upstash Documentation
curl
Python
Go
Copy
Ask AI
curl -X GET \
  https://api.upstash.com/v2/redis/stats/:id \
  -u 'EMAIL:API_KEY'

200 OK
Copy
Ask AI
{
  "connection_count": [
    {
      "x": "2023-05-22 10:59:23.426 +0000 UTC",
      "y": 320
    },
    ...
  ],
  "keyspace": [
    {
      "x": "2023-05-22 10:59:23.426 +0000 UTC",
      "y": 344725564
    },
    ...
  ],
  "throughput": [
    {
      "x": "2023-05-22 11:00:23.426 +0000 UTC",
      "y": 181.88333333333333
    },
    ...
  ],
  "produce_throughput": null,
  "consume_throughput": null,
  "diskusage": [
    {
      "x": "2023-05-22 10:59:23.426 +0000 UTC",
      "y": 532362818323
    },
    ...
  ],
  "latencymean": [
Redis
Update Regions (Global)
Update the regions of global database
POST
/
v2
/
redis
/
update-regions
/
{id}
Try it
​
Request
​
id
stringrequired
The ID of your database
​
read_regions
Array<string>required
Array of read regions of the database
Options: us-east-1, us-west-1, us-west-2, eu-west-1, eu-central-1, ap-southeast-1, ap-southeast-2, sa-east-1
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Get Database Stats
Reset Password
x
github
discord
Powered by Mintlify
Update Regions (Global) - Upstash Documentation
curl
Python
Go
Copy
Ask AI
curl -X POST \
  https://api.upstash.com/v2/redis/update-regions/:id \
  -u 'EMAIL:API_KEY' \
  -d '{ "read_regions":["us-west-1"] }'

200 OK
Copy
Ask AI
"OK"
Reset Password
This endpoint updates the password of a database.
POST
/
v2
/
redis
/
reset-password
/
{id}
Try it
​
Request
​
id
stringrequired
The ID of the database to reset password
​
Response
​
database_id
string
ID of the created database
​
database_name
string
Name of the database
​
database_type
string
Type of the database in terms of pricing model\ Free, Pay as You Go or Enterprise
​
region
string
The region where database is hosted
​
port
int
Database port for clients to connect
​
creation_time
int
Creation time of the database as Unix time
​
state
string
State of database\ active or deleted
​
password
string
Password of the database
​
user_email
string
Email or team id of the owner of the database
​
endpoint
string
Endpoint URL of the database
​
tls
boolean
TLS/SSL is enabled or not
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Update Regions (Global)
Rename Database
x
github
discord
Powered by Mintlify
Reset Password - Upstash Documentation
curl
Python
Go
Copy
Ask AI
curl -X POST \
  https://api.upstash.com/v2/redis/reset-password/:id \
  -u 'EMAIL:API_KEY'

200 OK
Copy
Ask AI
{
  "database_id": "96ad0856-03b1-4ee7-9666-e81abd0349e1",
  "cluster_id": "dea1f974",
  "database_name": "MyRedis",
  "database_type": "Pay as You Go",
  "region": "eu-central-1",
  "port": 30143,
  "creation_time": 1658909671,
  "state": "active",
  "password": "49665a1710f3434d8be008aab50f38d2",
  "user_email": "example@upstash.com",
  "endpoint": "eu2-sought-mollusk-30143.upstash.io",
  "tls": true,
  "consistent": false,
  "pool_id": "f886c7f3",
  "rest_token": "AXW_ASQgOTZhZDA4NTYtMDNiMS00ZWU3LTk2NjYtZTgxYWJkMDM0OWUxNDk2NjVhMTcxMGYzNDM0ZDhiZTAwOGFhYjUwZjM4ZDI=",
  "read_only_rest_token": "AnW_ASQgOTZhZDA4NTYtMDNiMS00ZWU3LTk2NjYtZTgxYWJkMDM0OWUxB5sRhCROkPsxozFcDzDgVGRAxUI7UUr0Y6uFB7jMIOI="
}
Redis
Rename Database
This endpoint renames a database.
POST
/
v2
/
redis
/
rename
/
{id}
Try it
​
URL Parameters
​
id
stringrequired
The ID of the database to be renamed
​
Request Parameters
​
name
stringrequired
The new name of the database
​
Response Parameters
​
database_id
string
ID of the created database
​
database_name
string
New name of the database
​
database_type
string
Type of the database in terms of pricing model\ Free, Pay as You Go or Enterprise
​
region
string
The region where database is hosted
​
primary_members
array<string>
List of primary regions in the database cluster
​
all_members
array<string>
List of all regions in the database cluster
​
primary_region
string
Primary region of the database cluster
​
port
int
Database port for clients to connect
​
creation_time
int
Creation time of the database as Unix time
​
budget
int
Allocated budget for database operations
​
state
string
State of database\ active or deleted
​
password
string
Password of the database
​
user_email
string
Email or team id of the owner of the database
​
endpoint
string
Endpoint URL of the database
​
tls
boolean
TLS/SSL is enabled or not
​
eviction
boolean
Whether entry eviction is enabled
​
auto_upgrade
boolean
Automatic upgrade capability status
​
consistent
boolean
Strong consistency mode status
​
reserved_per_region_price
int
Reserved price per region for enterprise plans
​
next_daily_backup_time
int
Unix timestamp of next scheduled backup
​
modifying_state
string
Database state
​
rest_token
string
Full-access REST token
​
read_only_rest_token
string
Read-only REST token
​
db_max_clients
int
Maximum allowed concurrent client connections
​
db_max_request_size
int
Maximum request size in bytes
​
db_resource_size
string
Resource allocation tier
​
db_type
string
Database storage engine type
​
db_disk_threshold
int
Disk storage limit in bytes
​
db_max_entry_size
int
Maximum entry size in bytes
​
db_memory_threshold
int
Memory usage limit in bytes
​
db_conn_idle_timeout
int
Connection idle timeout in nanoseconds
​
db_lua_timeout
int
Lua script execution timeout in nanoseconds
​
db_lua_credits_per_min
int
Lua script execution credits per minute
​
db_store_max_idle
int
Store connection idle timeout in nanoseconds
​
db_max_loads_per_sec
int
Maximum load operations per second
​
db_max_commands_per_second
int
Maximum commands processed per second
​
db_request_limit
int
Maximum allowed requests
​
db_eviction
boolean
Database-level eviction policy status
​
db_acl_enabled
boolean
Access Control List enablement status
​
db_acl_default_user_status
boolean
Default user access status in ACL
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Reset Password
Enable TLS
x
github
discord
Powered by Mintlify
Rename Database - Upstash Documentation
curl
Python
Go
Copy
Ask AI
curl -X POST \
  https://api.upstash.com/v2/redis/rename/:id \
  -u 'EMAIL:API_KEY'
  -d '{"name":"MyRedis_new_name"}'

200 OK
Copy
Ask AI
{
  "database_id": 96ad0856-03b1-4ee7-9666-e81abd0349e1,
  "database_name": "MyRedis_new_name",
  "database_type": "Pay as You Go",
  "region": "global",
  "type": "paid",
  "primary_members": [
    "eu-central-1"
  ],
  "all_members": [
    "eu-central-1"
  ],
  "primary_region": "eu-central-1",
  "port": 6379,
  "creation_time": 1727087321,
  "budget": 100,
  "state": "active",
  "password": “***”,
  "user_email": “a**@upstash.com",
  "endpoint": “all-foxe-22421.upstash.io",
  "tls": true,
  "eviction": true,
  "auto_upgrade": false,
  "consistent": false,
  "reserved_per_region_price": 0,
  "next_daily_backup_time": 1741120356,
  "modifying_state": "",
  "rest_token": “***”,
  "read_only_rest_token": “***”,
  "db_max_clients": 1000,
  "db_max_request_size": 1048576,
  "db_resource_size": "L",
  "db_type": "pebble",
  "db_disk_threshold": 107374182400,
  "db_max_entry_size": 104857600,
  "db_memory_threshold": 3221225472,
  "db_conn_idle_timeout": 21600000000000,
  "db_lua_timeout": 250000000,
  "db_lua_credits_per_min": 10000000000,
  "db_store_max_idle": 900000000000,
  "db_max_loads_per_sec": 1000000,
  "db_max_commands_per_second": 1000,
  "db_request_limit": 9223372036854776000,
  "db_eviction": true,
  "db_acl_enabled": "false",
  "db_acl_default_user_status": "true"
}

Redis
Rename Database
This endpoint renames a database.
POST
/
v2
/
redis
/
rename
/
{id}
Try it
​
URL Parameters
​
id
stringrequired
The ID of the database to be renamed
​
Request Parameters
​
name
stringrequired
The new name of the database
​
Response Parameters
​
database_id
string
ID of the created database
​
database_name
string
New name of the database
​
database_type
string
Type of the database in terms of pricing model\ Free, Pay as You Go or Enterprise
​
region
string
The region where database is hosted
​
primary_members
array<string>
List of primary regions in the database cluster
​
all_members
array<string>
List of all regions in the database cluster
​
primary_region
string
Primary region of the database cluster
​
port
int
Database port for clients to connect
​
creation_time
int
Creation time of the database as Unix time
​
budget
int
Allocated budget for database operations
​
state
string
State of database\ active or deleted
​
password
string
Password of the database
​
user_email
string
Email or team id of the owner of the database
​
endpoint
string
Endpoint URL of the database
​
tls
boolean
TLS/SSL is enabled or not
​
eviction
boolean
Whether entry eviction is enabled
​
auto_upgrade
boolean
Automatic upgrade capability status
​
consistent
boolean
Strong consistency mode status
​
reserved_per_region_price
int
Reserved price per region for enterprise plans
​
next_daily_backup_time
int
Unix timestamp of next scheduled backup
​
modifying_state
string
Database state
​
rest_token
string
Full-access REST token
​
read_only_rest_token
string
Read-only REST token
​
db_max_clients
int
Maximum allowed concurrent client connections
​
db_max_request_size
int
Maximum request size in bytes
​
db_resource_size
string
Resource allocation tier
​
db_type
string
Database storage engine type
​
db_disk_threshold
int
Disk storage limit in bytes
​
db_max_entry_size
int
Maximum entry size in bytes
​
db_memory_threshold
int
Memory usage limit in bytes
​
db_conn_idle_timeout
int
Connection idle timeout in nanoseconds
​
db_lua_timeout
int
Lua script execution timeout in nanoseconds
​
db_lua_credits_per_min
int
Lua script execution credits per minute
​
db_store_max_idle
int
Store connection idle timeout in nanoseconds
​
db_max_loads_per_sec
int
Maximum load operations per second
​
db_max_commands_per_second
int
Maximum commands processed per second
​
db_request_limit
int
Maximum allowed requests
​
db_eviction
boolean
Database-level eviction policy status
​
db_acl_enabled
boolean
Access Control List enablement status
​
db_acl_default_user_status
boolean
Default user access status in ACL
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Reset Password
Enable TLS
x
github
discord
Powered by Mintlify
Rename Database - Upstash Documentation
Redis
Enable TLS
This endpoint enables tls on a database.
POST
/
v2
/
redis
/
enable-tls
/
{id}
Try it
​
URL Parameters
​
id
stringrequired
The ID of the database to rename
​
Response Parameters
​
database_id
string
ID of the created database
​
database_name
string
Name of the database
​
database_type
string
Type of the database in terms of pricing model\ Free, Pay as You Go or Enterprise
​
region
string
The region where database is hosted
​
port
int
Database port for clients to connect
​
creation_time
int
Creation time of the database as Unix time
​
state
string
State of database\ active or deleted
​
password
string
Password of the database
​
user_email
string
Email or team id of the owner of the database
​
endpoint
string
Endpoint URL of the database
​
tls
boolean
TLS/SSL is enabled or not
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Rename Database
Enable Eviction
x
github
discord
Powered by Mintlify
Enable TLS - Upstash Documentation
curl
Python
Go
Copy
Ask AI
curl -X POST \
  https://api.upstash.com/v2/redis/enable-tls/:id \
  -u 'EMAIL:API_KEY'

200 OK
Copy
Ask AI
{
  "database_id": "96ad0856-03b1-4ee7-9666-e81abd0349e1",
  "cluster_id": "dea1f974",
  "database_name": "MyRedis",
  "database_type": "Pay as You Go",
  "region": "eu-central-1",
  "port": 30143,
  "creation_time": 1658909671,
  "state": "active",
  "password": "49665a1710f3434d8be008aab50f38d2",
  "user_email": "example@upstash.com",
  "endpoint": "eu2-sought-mollusk-30143.upstash.io",
  "tls": true,
}
Redis
Enable Eviction
This endpoint enables eviction for given database.
POST
/
v2curl
Python
Go
Copy
Ask AI
curl -X POST \
  https://api.upstash.com/v2/redis/enable-eviction/:id \
  -u 'EMAIL:API_KEY'

200 OK
Copy
Ask AI
"OK"
curl
Python
Go
Copy
Ask AI
curl -X POST \
  https://api.upstash.com/v2/redis/disable-eviction/:id \
  -u 'EMAIL:API_KEY'

200 OK
Copy
Ask AI
"OK"
curl
Python
Go
Copy
Ask AI
curl -X POST \
  https://api.upstash.com/v2/redis/enable-autoupgrade/:id \
  -u 'EMAIL:API_KEY'

200 OK
Copy
Ask AI
"OK"

/
redis
/
enable-eviction
/
{id}
Try it
​
URL Parameters
​
id
stringrequired
The ID of the database to enable eviction
Disable Auto Upgrade
This endpoint disables Auto Upgrade for given database.
POST
/
v2
/
redis
/
disable-autoupgrade
/
{id}
Try it
​
URL Parameters
​
id
stringrequired
The ID of the database to disable auto upgrade
Enable Auto Upgrade
This endpoint enables Auto Upgrade for given database.
POST
/
v2
/
redis
/
enable-autoupgrade
/
{id}
Try it
​
URL Parameters
​
id
stringrequired
The ID of the database to enable auto upgrade
curl
Python
Go
Copy
Ask AI
curl -X POST \
  https://api.upstash.com/v2/redis/enable-autoupgrade/:id \
  -u 'EMAIL:API_KEY'

200 OK
Copy
Ask AI
"OK"
Move To Team
This endpoint moves database under a target team
POST
/
v2
/
redis
/
move-to-team
Try it
​
URL Parameters
​
team_id
stringrequired
The ID of the target team
​
database_id
stringrequired
The ID of the database to be moved
curl
Python
Go
Copy
Ask AI
curl -X POST \
  https://api.upstash.com/v2/redis/move-to-team \
  -u 'EMAIL:API_KEY' \
  -d '{"team_id": "6cc32556-0718-4de5-b69c-b927693f9282","database_id": "67b6af16-acb2-4f00-9e38-f6cb9bee800d"}'
Change Database Plan
This endpoint changes the plan of a Redis database.
POST
/
v2
/
redis
/
change-plan
/
{id}
Try it
​
URL Parameters
​
id
stringrequired
The ID of the database whose plan will be changed.
​
Request Parameters
​
plan_name
stringrequired
The new plan for the database.
Available options: payg, fixed_250mb, fixed_1gb, fixed_5gb, fixed_10gb, fixed_50gb, fixed_100gb, fixed_500gb
​
auto_upgrade
boolean
(Optional) Whether to enable automatic upgrade for the database.
​
prod_pack_enabled
boolean
(Optional) Whether to enable the production pack for the database.
Note: If you do not want to change auto_upgrade or prod_pack_enabled, simply omit those fields from the request payload.
curl
Python
Go
Copy
Ask AI
curl -X POST \
  https://api.upstash.com/v2/redis/change-plan/:id \
  -u 'EMAIL:API_KEY' \
  -d '{"plan_name": "fixed_1gb", "auto_upgrade": true, "prod_pack_enabled": false}'

200 OK
Copy
Ask AI
"OK"
Update Database Budget
This endpoint updates the monthly budget of a Redis database.
PATCH
/
v2
/
redis
/
update-budget
/
{id}
Try it
​
URL Parameters
​
id
stringrequired
The ID of the database whose budget will be updated.
​
Request Parameters
​
budget
intrequired
The new monthly budget for the database.
curl
Python
Go
Copy
Ask AI
curl -X PATCH \
  https://api.upstash.com/v2/redis/update-budget/:id \
  -u 'EMAIL:API_KEY' \
  -d '{"budget": 200}'

200 OK
Copy
Ask AI
"OK"
Create Backup
This endpoint creates a backup for a Redis database.
POST
/
v2
/
redis
/
create-backup
/
{id}
Try it
​
URL Parameters
​
id
stringrequired
The ID of the Redis database
​
Request Parameters
​
name
stringrequired
Name of the backup
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Update Database Budget
Delete Backup
x
github
discord
Powered by Mintlify
Create Backup - Upstash Documentation
curl
Python
Go
Copy
Ask AI
curl -X POST \
  https://api.upstash.com/v2/redis/create-backup/{id} \
  -u 'EMAIL:API_KEY' \
  -d '{"name" : "backup_name"}'

200 OK
Copy
Ask AI
"OK"
curl
Python
Go
Copy
Ask AI
curl -X POST \
  https://api.upstash.com/v2/redis/restore-backup/{id} \
  -u 'EMAIL:API_KEY' 
  -d '{"backup_id" : "backup_id"}'

200 OK
Copy
Ask AI
"OK"
curl
Python
Go
Copy
Ask AI
curl -X GET \
  https://api.upstash.com/v2/redis/list-backup/{id} \
  -u 'EMAIL:API_KEY'

200 OK
Copy
Ask AI
[
  {
    "database_id":"6gceaafd-9627-4fa5-8g71-b3359g19a5g4",
    "customer_id":"customer_id",
    "name":"test2",
    "backup_id":"1768e55b-c137-4339-b46e-449dcd33a62e",
    "creation_time":1720186545,
    "state":"completed",
    "backup_size":0,
    "daily_backup":"false",
    "hourly_backup":"false"
  },
  {
    "database_id":"6gceaafd-9627-4fa5-8g71-b3359g19a5g4",
    "customer_id":"customer_id",
    "name":"test1",
    "backup_id":"39310b84-21b3-45c3-5318-403553a2466d",
    "creation_time":1720096600,
    "state":"completed",
    "backup_size":0,
    "daily_backup":"false",
    "hourly_backup":"false"
  }
]
curl
Python
Go
Copy
Ask AI
curl -X PATCH \
  https://api.upstash.com/v2/redis/enable-dailybackup/{id} \
  -u 'EMAIL:API_KEY'

200 OK
Copy
Ask AI
"OK"
Backup
Disable Daily Backup
This endpoint disables daily backup for a Redis database.
PATCH
/
v2
/
redis
/
disable-dailybackup
/
{id}
Try it
​
URL Parameters
​
id
stringrequired
The ID of the Redis database
curl
Python
Go
Copy
Ask AI
curl -X PATCH \
  https://api.upstash.com/v2/redis/disable-dailybackup/{id} \
  -u 'EMAIL:API_KEY'

200 OK
Copy
Ask AI
"OK"
Overall
Redis® API Compatibility
Upstash supports Redis client protocol up to version 6.2. We are also gradually adding changes introduced in versions 7.0 and 7.2, such as EXPIRETIME, LMPOP, ZINTERCARD and EVAL_RO.
The following table shows the most recent list of the supported Redis commands:
Feature
Supported?
Supported Commands
String
✅
APPEND - DECR - DECRBY - GET - GETDEL - GETEX - GETRANGE - GETSET - INCR - INCRBY - INCRBYFLOAT - MGET - MSET - MSETNX - PSETEX - SET - SETEX - SETNX - SETRANGE - STRLEN
Bitmap
✅
BITCOUNT - BITFIELD - BITFIELD_RO - BITOP - BITPOS - GETBIT - SETBIT
Hash
✅
HDEL - HEXISTS - HGET - HGETALL - HINCRBY - HINCRBYFLOAT - HKEYS - HLEN - HMGET - HMSET - HSCAN - HSET - HSETNX - HSTRLEN - HRANDFIELD - HVALS
List
✅
BLMOVE - BLMPOP - BLPOP - BRPOP - BRPOPLPUSH - LINDEX - LINSERT - LLEN - LMOVE - LMPOP - LPOP - LPOS - LPUSH - LPUSHX - LRANGE - LREM - LSET - LTRIM - RPOP - RPOPLPUSH - RPUSH - RPUSHX
Set
✅
SADD - SCARD - SDIFF - SDIFFSTORE - SINTER - SINTERCARD - SINTERSTORE - SISMEMBER - SMEMBERS - SMISMEMBER - SMOVE - SPOP - SRANDMEMBER - SREM - SSCAN - SUNION - SUNIONSTORE
SortedSet
✅
BZMPOP - BZPOPMAX - BZPOPMIN - ZADD - ZCARD - ZCOUNT - ZDIFF - ZDIFFSTORE - ZINCRBY - ZINTER - ZINTERCARD - ZINTERSTORE - ZLEXCOUNT - ZMPOP - ZMSCORE - ZPOPMAX - ZPOPMIN - ZRANDMEMBER - ZRANGE - ZRANGESTORE - ZRANGEBYLEX - ZRANGEBYSCORE - ZRANK - ZREM - ZREMRANGEBYLEX - ZREMRANGEBYRANK - ZREMRANGEBYSCORE - ZREVRANGE - ZREVRANGEBYLEX - ZREVRANGEBYSCORE - ZREVRANK - ZSCAN - ZSCORE - ZUNION - ZUNIONSTORE
Geo
✅
GEOADD - GEODIST - GEOHASH - GEOPOS - GEORADIUS - GEORADIUS_RO - GEORADIUSBYMEMBER - GEORADIUSBYMEMBER_RO - GEOSEARCH - GEOSEARCHSTORE
HyperLogLog
✅
PFADD - PFCOUNT - PFMERGE
Scripting
✅
EVAL - EVALSHA - EVAL_RO - EVALSHA_RO - SCRIPT EXISTS - SCRIPT LOAD - SCRIPT FLUSH
Pub/Sub
✅
SUBSCRIBE - PSUBSCRIBE - UNSUBSCRIBE - PUNSUBSCRIBE - PUBLISH - PUBSUB
Transactions
✅
DISCARD - EXEC - MULTI - UNWATCH - WATCH
Generic
✅
COPY - DEL - DUMP - EXISTS - EXPIRE - EXPIREAT - EXPIRETIME - KEYS - PERSIST - PEXPIRE - PEXPIREAT - PEXPIRETIME - PTTL - RANDOMKEY - RENAME - RENAMENX - RESTORE - SCAN - TOUCH - TTL - TYPE - UNLINK
Connection
✅
AUTH - HELLO - ECHO - PING - QUIT - RESET - SELECT
Server
✅
ACL(*) - DBSIZE - FLUSHALL - FLUSHDB - MONITOR - TIME
JSON
✅
JSON.ARRAPPEND - JSON.ARRINSERT - JSON.ARRINDEX - JSON.ARRLEN - JSON.ARRPOP - JSON.ARRTRIM - JSON.CLEAR - JSON.DEL - JSON.FORGET - JSON.GET - JSON.MERGE - JSON.MGET - JSON.MSET - JSON.NUMINCRBY - JSON.NUMMULTBY - JSON.OBJKEYS - JSON.OBJLEN - JSON.RESP - JSON.SET - JSON.STRAPPEND - JSON.STRLEN - JSON.TOGGLE - JSON.TYPE
Streams
✅
XACK - XADD - XAUTOCLAIM - XCLAIM - XDEL - XGROUP - XINFO GROUPS - XINFO CONSUMERS - XLEN - XPENDING - XRANGE - XREAD - XREADGROUP - XREVRANGE - XTRIM
Cluster
❌



We run command integration tests from following Redis clients after each code change and also periodically:
Node-Redis Command Tests
Jedis Command Tests
Lettuce Command Tests
Go-Redis Command Tests
Redis-py Command Tests
Use Cases
The data store behind Upstash is compatible with almost all Redis® API. So you can use Upstash for the Redis®’ popular use cases such as:
General caching
Session caching
Leaderboards
Queues
Usage metering (counting)
Content filtering
Check Salvatore’s blog post. You can find lots of similar articles about the common use cases of Redis.
​
Key Value Store and Caching for Next.js Application
Next.js is increasingly becoming the preferred method for developing dynamic and fast web applications in an agile manner. It owes its popularity to its server-side rendering capabilities and API routes supported by serverless functions, including Vercel serverless and edge functions. Upstash Redis is a great fit with Next.js applications due to its serverless model and its REST-based APIs. The REST API plays a critical role in enabling access from edge functions while also addressing connection issues in serverless functions.
Check the blog post: Speed up your Next.js application with Redis
​
Redis for Vercel Functions
Vercel stands out as one of the most popular cloud platform for web developers, offering continuous integration, deployment, CDN and serverless functions. However, when it comes to databases, you’ll need to rely on external data services to support dynamic applications.
That’s where Upstash comes into play as one of the most favored data solutions within the Vercel platform. Here are some reasons that contribute to Upstash’s popularity in the Vercel ecosystem:
No connection problems thanks to Upstash SDK built on Upstash REST API.
Edge runtime does not allow TCP based connections. You can not use regular Redis clients. Upstash SDK works on edge runtimes without a problem.
Upstash has a Vercel add on where you can easily integrate Upstash to your Vercel projects.
​
Storage For Lambda Functions (FaaS)
People use Lambda functions for various reasons, with one of the primary advantages being their cost-effectiveness – you only pay for what you actually use, which is great. However, when it comes to needing a storage layer, AWS recommends DynamoDB. DynamoDB does offer a serverless mode, which sounds promising until you encounter its latency when connecting and operating within Lambda Functions. Unfortunately, DynamoDB’s latency may not be ideal for Lambda Functions, where every second of latency can have a significant impact on costs. At this point, AWS suggests using ElastiCache for low-latency data storage, which is also a Redis® cache as a service – a positive aspect. However, it’s worth noting that ElastiCache is not serverless, and you have to pay based on what you provision, rather than what you use. To be honest, the pricing may not be the most budget-friendly option. This leaves you with two alternatives:
DynamoDB: Serverless but high latency
ElastiCache: Low latency but not serverless.
Until you meet the Upstash. Our sole mission is to provide a Redis® API compatible database that you love in the serverless model. In Upstash, you pay per the number of requests you have sent to your database. So if you are not using the database you pay almost nothing. (Almost, because we charge for the storage. It is a very low amount but still it is there.)
We believe that Upstash is the best storage for your Lambda Functions because:
Serverless just like Lambda functions itself
Designed for low latency data access
The lovely simple Redis® API
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Changelog
Compare
xdd
github
discord
Powered by Mintlify
Use Cases - Upstash Documentation
Global Database
In the global database, the replicas are distributed across multiple regions around the world. The clients are routed to the nearest region. This helps with minimizing latency for use cases where users can be anywhere in the world.
​
Primary Region and Read Regions
The Upstash Global database is structured with a Primary Region and multiple Read Regions. When a write command is issued, it is initially sent and processed at the Primary Region. The write operation is then replicated to all the Read Regions, ensuring data consistency across the database.
On the other hand, when a read command is executed, it is directed to the nearest Read Region to optimize response time. By leveraging the Global database’s distributed architecture, read operations can be performed with reduced latency, as data retrieval occurs from the closest available Read Region.
The Global database’s design thus aids in minimizing read operation latency by efficiently distributing data across multiple regions and enabling requests to be processed from the nearest Read Region.
User selects a single primary region and multiple read regions. For the best performance, you should select the primary region in the same location where your writes happen. Select the read regions where your clients that read the Redis located. You may have your database with a single primary region but no read regions which would be practically same with a single region (regional) database. You can add or remove regions on a running Redis database.
Here the list of regions currently supported:
AWS US-East-1 North Virginia
AWS US-East-2 Ohio
AWS US-West-1 North California
AWS US-West-2 Oregon
AWS EU-West-1 Ireland
AWS EU-West-2 London
AWS EU-Central-1 Frankfurt
AWS AP-South-1 Mumbai
AWS AP-SouthEast-1 Singapore
AWS AP-SouthEast-2 Sydney
AWS AP-NorthEast-1 Japan
AWS SA-East-1 São Paulo

In our internal tests, we see the following latencies (99th percentile):
Read latency from the same region <1ms
Write latency from the same region <5ms
Read/write latency from the same continent <50ms

​
Architecture
In the multi region architecture, each key is owned by a primary replica which is located at the region that you choose as primary region. Read replicas become the backups of the primary for the related keys. The primary replica processes the writes, then propagates them to the read replicas. Read requests are processed by all replicas, this means you can read a value from any of the replicas. This model gives a better write consistency and read scalability.
Each replica employs a failure detector to track the liveness of the primary replica. When the primary replica fails for a reason, read replicas start a new leader election round and elect a new leader (primary). This is the only unavailability window for the cluster where your requests can be blocked for a short period of time.
Global Database is designed to optimize the latency of READ operations. It may not be a good choice if your use case is WRITE heavy.
​
Use Cases
Edge functions: Edge computing (Cloudflare workers, Fastly Compute) is becoming a popular way of building globally fast applications. But there are limited data solutions accessible from edge functions. Upstash Global Database is accessible from Edge functions with the REST API. Low latency from all edge locations makes it a perfect solution for Edge functions
Multi region serverless architectures: You can run your AWS Lambda function in multiple regions to lower global latency. Vercel/Netlify functions can be run in different regions. Upstash Global database provides low latency data wherever your serverless functions are.
Web/mobile use cases where you need low latency globally. Thanks to the read only REST API, you can access Redis from your web/mobile application directly. In such a case, Global Database will help to lower the latency as you can expect the clients from anywhere.
​
High Availability and Disaster Recovery
Although the main motivation behind the Global Database is to provide low latency; it also makes your database resilient to region wide failures. When a region is not available, your requests are routed to another region; so your database remains available.
​
Consistency
Global Database is an eventually consistent database. The write request returns after the primary replica processes the operation. Write operation is replicated to read replicas asynchronously. Read requests can be served by any replica, which gives better horizontal scalability but also means a read request may return a stale value while a write operation for the same key is being propagated to read replicas.
In case of cluster wide failures like network partitioning (split brain); periodically running anti entropy jobs resolve the conflicts using LWW algorithms and converge the replicas to the same state.
​
Upgrade from Regional to Global
Currently, we do not support auto-upgrade from regional to global database. You can export data from your old database and import into the global database.
​
Pricing
Global Database charges $0.2 per 100K commands. The write commands are replicated to all read regions in addition to primary region so the replications are counted as commands. For example, if you have 1 primary 1 read region, 100K writes will cost $0.4 ($0.2 x 2). You can use Global Database in the free tier too. Free usage is limited with max one read region.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Koyeb
REST API
x
github
discord
Powered by Mintlify
Global Database - Upstash Documentation
REST API
REST API enables you to access your Upstash database using REST.
​
Get Started
If you do not have a database already, follow these steps to create one.
In the Upstash Console, select your database. Then, in the database page, you will see the section that includes the endpoint URL and token details. When you hover over the Endpoint or Token / Readonly Token fields, copy button will appear for each. You can click it to easily copy the values you need for your connection.
Copy the HTTPS for REST URL and the Token for authorization. Send an HTTP SET request to the provided URL by adding an Authorization: Bearer $TOKEN header like below: (See the sample command with your credentials in the cURL tab of Connection section)
Copy
Ask AI
curl https://us1-merry-cat-32748.upstash.io/set/foo/bar \
 -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934"

The above script executes a SET foo bar command. It will return a JSON response:
Copy
Ask AI
{ "result": "OK" }

You can also set the token as _token request parameter as below:
Copy
Ask AI
curl https://us1-merry-cat-32748.upstash.io/set/foo/bar?_token=2553feg6a2d9842h2a0gcdb5f8efe9934

​
API Semantics
Upstash REST API follows the same convention with Redis Protocol. Give the command name and parameters in the same order as Redis protocol by separating them with a /.
Copy
Ask AI
curl REST_URL/COMMAND/arg1/arg2/../argN

Here are some examples:
SET foo bar -> REST_URL/set/foo/bar
SET foo bar EX 100 -> REST_URL/set/foo/bar/EX/100
GET foo -> REST_URL/get/foo
MGET foo1 foo2 foo3 -> REST_URL/mget/foo1/foo2/foo3
HGET employee:23381 salary -> REST_URL/hget/employee:23381/salary
ZADD teams 100 team-x 90 team-y -> REST_URL/zadd/teams/100/team-x/90/team-y
​
JSON or Binary Value
To post a JSON or a binary value, you can use an HTTP POST request and set value as the request body:
Copy
Ask AI
curl -X POST -d '$VALUE' https://us1-merry-cat-32748.upstash.io/set/foo \
 -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934"

In the example above, $VALUE sent in request body is appended to the command as REST_URL/set/foo/$VALUE.
Please note that when making a POST request to the Upstash REST API, the request body is appended as the last parameter of the Redis command. If there are additional parameters in the Redis command after the value, you should include them as query parameters in the request:
Copy
Ask AI
curl -X POST -d '$VALUE' https://us1-merry-cat-32748.upstash.io/set/foo?EX=100 \
 -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934"

Above command is equivalent to REST_URL/set/foo/$VALUE/EX/100.
​
POST Command in Body
Alternatively, you can send the whole command in the request body as a single JSON array. Array’s first element must be the command name and command parameters should be appended next to each other in the same order as Redis protocol.
Copy
Ask AI
curl -X POST -d '[COMMAND, ARG1, ARG2,.., ARGN]' REST_URL

For example, Redis command SET foo bar EX 100 can be sent inside the request body as:
Copy
Ask AI
curl -X POST -d '["SET", "foo", "bar", "EX", 100]' https://us1-merry-cat-32748.upstash.io \
 -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934"

​
HTTP Codes
200 OK: When request is accepted and successfully executed.
400 Bad Request: When there’s a syntax error, an invalid/unsupported command is sent or command execution fails.
401 Unauthorized: When authentication fails; auth token is missing or invalid.
405 Method Not Allowed: When an unsupported HTTP method is used. Only HEAD, GET, POST and PUT methods are allowed.
​
Response
REST API returns a JSON response by default. When command execution is successful, response JSON will have a single result field and its value will contain the Redis response. It can be either;
a null value
Copy
Ask AI
{ "result": null }

an integer
Copy
Ask AI
{ "result": 137 }

a string
Copy
Ask AI
{ "result": "value" }

an array value:
Copy
Ask AI
{ "result": ["value1", null, "value2"] }

If command is rejected or fails, response JSON will have a single error field with a string value explaining the failure:
Copy
Ask AI
{"error":"WRONGPASS invalid password"}

{"error":"ERR wrong number of arguments for 'get' command"}

​
Base64 Encoded Responses
If the response contains an invalid utf-8 character, it will be replaced with a � (Replacement character U+FFFD). This can happen when you are using binary operations like BITOP NOT etc.
If you prefer the raw response in base64 format, you can achieve this by setting the Upstash-Encoding header to base64. In this case, all strings in the response will be base64 encoded, except for the “OK” response.
Copy
Ask AI
curl https://us1-merry-cat-32748.upstash.io/SET/foo/bar \
 -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934" \
 -H "Upstash-Encoding: base64"

# {"result":"OK"}

curl https://us1-merry-cat-32748.upstash.io/GET/foo \
 -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934" \
 -H "Upstash-Encoding: base64"

# {"result":"YmFy"}

​
RESP2 Format Responses
REST API returns a JSON response by default and the response content type is set to application/json.
If you prefer the binary response in RESP2 format, you can achieve this by setting the Upstash-Response-Format header to resp2. In this case, the response content type is set to application/octet-stream and the raw response is returned as binary similar to a TCP-based Redis client.
The default value for this option is json. Any format other than json and resp2 is not allowed and will result in a HTTP 400 Bad Request.
This option is not applicable to /multi-exec transactions endpoint, as it only returns response in JSON format. Additionally, setting the Upstash-Encoding header to base64 is not permitted when the Upstash-Response-Format is set to resp2 and will result in a HTTP 400 Bad Request.
Copy
Ask AI
curl https://us1-merry-cat-32748.upstash.io/SET/foo/bar \
 -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934" \
 -H "Upstash-Reponse-Format: resp2"

# +OK\r\n

curl https://us1-merry-cat-32748.upstash.io/GET/foo \
 -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934" \
 -H "Upstash-Reponse-Format: resp2"

# $3\r\nbar\r\n

​
Pipelining
Upstash REST API provides support for command pipelining, allowing you to send multiple commands as a batch instead of sending them individually and waiting for responses. With the pipeline API, you can include several commands in a single HTTP request, and the response will be a JSON array. Each item in the response array corresponds to the result of a command in the same order as they were included in the pipeline.
API endpoint for command pipelining is /pipeline. Pipelined commands should be send as a two dimensional JSON array in the request body, each row containing name of the command and its arguments.
Request syntax:
Copy
Ask AI
curl -X POST https://us1-merry-cat-32748.upstash.io/pipeline \
 -H "Authorization: Bearer $TOKEN" \
 -d '
    [
      ["CMD_A", "arg0", "arg1", ..., "argN"],
      ["CMD_B", "arg0", "arg1", ..., "argM"],
      ...
    ]
    '

Response syntax:
Copy
Ask AI
[{"result":"RESPONSE_A"},{"result":"RESPONSE_B"},{"error":"ERR ..."}, ...]

Execution of the pipeline is not atomic. Even though each command in the pipeline will be executed in order, commands sent by other clients can interleave with the pipeline. Use transactions API instead if you need atomicity.
For example you can write the curl command below to send following Redis commands using pipeline:
Copy
Ask AI
SET key1 valuex
SETEX key2 13 valuez
INCR key1
ZADD myset 11 item1 22 item2

Copy
Ask AI
curl -X POST https://us1-merry-cat-32748.upstash.io/pipeline \
 -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934" \
 -d '
    [
      ["SET", "key1", "valuex"],
      ["SETEX", "key2", 13, "valuez"],
      ["INCR", "key1"],
      ["ZADD", "myset", 11, "item1", 22, "item2"]
    ]
    '

And pipeline response will be:
Copy
Ask AI
[
  { "result": "OK" },
  { "result": "OK" },
  { "error": "ERR value is not an int or out of range" },
  { "result": 2 }
]

You can use pipelining when;
You need more throughput, since pipelining saves from multiple round-trip times. (But beware that latency of each command in the pipeline will be equal to the total latency of the whole pipeline.)
Your commands are independent of each other, response of a former command is not needed to submit a subsequent command.
​
Transactions
Upstash REST API supports transactions to execute multiple commands atomically. With transactions API, several commands are sent using a single HTTP request, and a single JSON array response is returned. Each item in the response array corresponds to the command in the same order within the transaction.
API endpoint for transaction is /multi-exec. Transaction commands should be send as a two dimensional JSON array in the request body, each row containing name of the command and its arguments.
Request syntax:
Copy
Ask AI
curl -X POST https://us1-merry-cat-32748.upstash.io/multi-exec \
 -H "Authorization: Bearer $TOKEN" \
 -d '
    [
      ["CMD_A", "arg0", "arg1", ..., "argN"],
      ["CMD_B", "arg0", "arg1", ..., "argM"],
      ...
    ]
    '

Response syntax:
In case when transaction is successful, multiple responses corresponding to each command is returned in json as follows:
Copy
Ask AI
[{"result":"RESPONSE_A"},{"result":"RESPONSE_B"},{"error":"ERR ..."}, ...]

If transaction is discarded as a whole, a single error is returned in json as follows:
Copy
Ask AI
{ "error": "ERR ..." }

A transaction might be discarded in following cases:
There is a syntax error on the transaction request.
At least one of the commands is unsupported.
At least one of the commands exceeds the max request size.
At least one of the commands exceeds the daily request limit.
Note that a command may still fail even if it is a supported and valid command. In that case, all commands will be executed. Upstash Redis will not stop the processing of commands. This is to provide same semantics with Redis when there are errors inside a transaction.
Example:
You can write the curl command below to send following Redis commands using REST transaction API:
Copy
Ask AI
MULTI
SET key1 valuex
SETEX key2 13 valuez
INCR key1
ZADD myset 11 item1 22 item2
EXEC

Copy
Ask AI
curl -X POST https://us1-merry-cat-32748.upstash.io/multi-exec \
 -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934" \
 -d '
    [
      ["SET", "key1", "valuex"],
      ["SETEX", "key2", 13, "valuez"],
      ["INCR", "key1"],
      ["ZADD", "myset", 11, "item1", 22, "item2"]
    ]
    '

And transaction response will be:
Copy
Ask AI
[
  { "result": "OK" },
  { "result": "OK" },
  { "error": "ERR value is not an int or out of range" },
  { "result": 2 }
]

​
Monitor Command
Upstash REST API provides Redis MONITOR command using Server Send Events mechanism. API endpoint is /monitor.
Copy
Ask AI
curl -X POST https://us1-merry-cat-32748.upstash.io/monitor \
  -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934" \
  -H "Accept:text/event-stream"

This request will listen for Redis monitor events and incoming data will be received as:
Copy
Ask AI
data: "OK"
data: 1721284005.242090 [0 0.0.0.0:0] "GET" "k"
data: 1721284008.663811 [0 0.0.0.0:0] "SET" "k" "v"
data: 1721284025.561585 [0 0.0.0.0:0] "DBSIZE"
data: 1721284030.601034 [0 0.0.0.0:0] "KEYS" "*"

​
Subscribe & Publish Commands
Simiar to MONITOR command, Upstash REST API provides Redis SUBSCRIBE and PUBLISH commands. The SUBSCRIBE endpoint works using
Server Send Events mechanism. API endpoints are /subscribe and /publish
Following request will subscribe to a channel named chat:
Copy
Ask AI
curl -X POST https://us1-merry-cat-32748.upstash.io/subscribe/chat \
  -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934" \
  -H "Accept:text/event-stream"

Following request will publish to a channel named chat:
Copy
Ask AI
curl -X POST https://us1-merry-cat-32748.upstash.io/publish/chat/hello \
  -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934"

The subscriber will receive incoming messages as:
Copy
Ask AI
data: subscribe,chat,1
data: message,chat,hello
data: message,chat,how are you today?

​
Security and Authentication
You need to add a header to your API requests as Authorization: Bearer $TOKEN or set the token as a url parameter _token=$TOKEN.
Copy
Ask AI
curl -X POST https://us1-merry-cat-32748.upstash.io/info \
  -H "Authorization: Bearer 2553feg6a2d9842h2a0gcdb5f8efe9934"

OR
Copy
Ask AI
curl -X POST https://us1-merry-cat-32748.upstash.io/info?_token=2553feg6a2d9842h2a0gcdb5f8efe9934

Upstash by default provides two separate access tokens per database: “Standard” and “Read Only”.
Standard token has full privilege over the database, can execute any command.
Read Only token permits access to the read commands only. Some powerful read commands (e.g. SCAN, KEYS) are also restricted with read only token. It makes sense to use Read Only token when you access Upstash Redis from web and mobile clients where the token is exposed to public.
You can get/copy the tokens by clicking copy button next to UPSTASH_REDIS_REST_TOKEN in REST API section of the console. For the Read Only token, just enable the “Read-Only Token” switch.

Do not expose your Standard token publicly. Standard token has full privilege over the database. You can expose the Read Only token as it has access to read commands only. You can revoke both Standard and Read Only tokens by resetting password of your database.
​
REST Token for ACL Users
In addition to the tokens provided by default, you can create REST tokens for the users created via ACL SETUSER command. Upstash provides a custom ACL subcommand to generate REST tokens: ACL RESTTOKEN. It expects two arguments; username and user’s password. And returns the REST token for the user as a string response.
Copy
Ask AI
ACL RESTTOKEN <username> <password>
    Generate a REST token for the specified username & password.
    Token will have the same permissions with the user.

You can execute ACL RESTTOKEN command via redis-cli:
Copy
Ask AI
redis-cli> ACL RESTTOKEN default 35fedg8xyu907d84af29222ert
"AYNgAS2553feg6a2d9842h2a0gcdb5f8efe9934DQ="

Or via CLI on the Upstash console:

If the user doesn’t exist or password doesn’t match then an error will be returned.
Copy
Ask AI
redis-cli> ACL RESTTOKEN upstash fakepass
(error) ERR Wrong password or user "upstash" does not exist

​
Redis Protocol vs REST API
​
REST API Pros
If you want to access to Upstash database from an environment like CloudFlare Workers, WebAssembly, Fastly Compute@Edge then you can not use Redis protocol as it is based on TCP. You can use REST API in those environments.
REST API is request (HTTP) based where Redis protocol is connection based. If you are running serverless functions (AWS Lambda etc), you may need to manage the Redis client’s connections. REST API does not have such an issue.
Redis protocol requires Redis clients. On the other hand, REST API is accessible with any HTTP client.
​
Redis Protocol Pros
If you have legacy code that relies on Redis clients, the Redis protocol allows you to utilize Upstash without requiring any modifications to your code.
By leveraging the Redis protocol, you can take advantage of the extensive Redis ecosystem. For instance, you can seamlessly integrate your Upstash database as a session cache for your Express application.
​
REST API vs GraphQL API
The REST API generally exhibits lower latency compared to the GraphQL API. In the case of the REST API, direct access to the database is established. However, with the GraphQL API, a proxy layer is present, responsible for accepting connections and translating GraphQL queries into the Redis protocol.
If you do not have a specific GraphQL use case, we recommend REST API instead of GraphQL API. We plan to deprecate the GraphQL API in future releases.
​
Cost and Pricing
Upstash pricing is based on per command/request. So the same pricing listed in our pricing applies to your REST calls too.
​
Metrics and Monitoring
In the current version, we do not expose any metrics specific to API calls in the console. But the metrics of the database backing the API should give a good summary about the performance of your APIs.
​
REST - Redis API Compatibility
Feature
REST Support?
Notes
String
✅


Bitmap
✅


Hash
✅


List
✅
Blocking commands (BLPOP - BRPOP - BRPOPLPUSH) are not supported.
Set
✅


SortedSet
✅
Blocking commands (BZPOPMAX - BZPOPMIN) are not supported.
Geo
✅


HyperLogLog
✅


Transactions
✅
WATCH/UNWATCH/DISCARD are not supported
Generic
✅


Server
✅


Scripting
✅


Pub/Sub
⚠️
Only PUBLISH and PUBSUB are supported.
Connection
⚠️
Only PING and ECHO are supported.
JSON
✅


Streams
✅
Supported, except blocking versions of XREAD and XREADGROUP.
Cluster
❌



Was this page helpful?
Yes
No
Suggest edits
Raise issue
Global Database
Backup/Restore
x
github
discord
Powered by Mintlify
REST API - Upstash Documentation
Backup/Restore
You can create a manual backup of your database and restore that backup to any of your databases. Both backup and restore operations require that your database is in one of the AWS regions.
Additionally, you can utilize the daily backup feature to automatically create backups of your database on a daily basis.
​
Create A Manual Backup
To create a manual backup of your database:
Go to the database details page and navigate to the Backups tab

Click on the Backup button and fill in a name for your backup. Your backup name must be unique.
Then click on the Create button.

During the process of creating a backup for your database, it is important to note that your database will be temporarily locked, which means these operations will be unavailable during this time:
Create Database Backup
Enable TLS
Move Database to Team
Restore Database Backup
Update Eviction
Update Password
Delete Database

​
Restore A Backup
To restore a backup that was created from your current database, follow the steps below:
Go to the database details page and navigate to the Backups tab
Click on the Restore button next to the backup record listed.

Click on Restore. Be aware of the fact that your target database will be flushed with this operation.

​
Restore A Backup From Another Database
To restore a backup that was created from one of your databases other than the current one, follow the steps below:
Go to the database details page and navigate to the Backups tab
Click on the Restore... button

Select the source database, referring to the database from which the backup was generated.
Select the backup record that you want to restore to the current database.
Click on Start Restore. Be aware of the fact that your target database will be flushed with this operation.

​
Enable Daily Automated Backup
To enable daily automated backup for your database:
Go to the database details page and navigate to the Backups tab

Enable the switch next to the Daily Backup
Click on Enable
​
Disable Daily Automated Backup
To disable the daily automated backup for your database, please follow the steps below:
Go to the database details page and navigate to the Backups tab

Disable the switch next to the Daily Backup
Click on Disable

Was this page helpful?
Yes
No
Suggest edits
Raise issue
REST API
Durable Storage
x
github
discord
Powered by Mintlify
Backup/Restore - Upstash Documentation
Durable Storage
This article explains the persistence provided by Upstash databases.
In Upstash, persistence is always enabled, setting it apart from other Redis offerings. Every write operation is consistently stored in both memory and the block storage provided by cloud providers, such as AWS’s EBS. This dual storage approach ensures data durability. Read operations are optimized to first check if the data exists in memory, facilitating faster access. If the data is not in memory, it is retrieved from disk. This combination of memory and disk storage in Upstash guarantees reliable data access and maintains data integrity, even during system restarts or failures.
​
Multi Tier Storage
Upstash keeps your data both in memory and disk. This design provides:
Data safety with persistent storage
Low latency with in memory access
Price flexibility by using memory only for active data
In Upstash, an entry in memory is evicted if it remains idle, meaning it has not been accessed for an extended period. It’s important to note that eviction does not result in data loss since the entry is still stored in the block storage. When a read operation occurs for an evicted entry, it is efficiently reloaded from the block storage back into memory, ensuring fast access to the data. This eviction mechanism in Upstash optimizes memory usage by prioritizing frequently accessed data while maintaining the ability to retrieve less frequently accessed data when needed.

Can I use Upstash as a database?
Definitely, yes. Some users are worried that Redis data will be lost when a server crashes. This is not the case for Upstash thanks to Durable Storage. Data is reloaded to memory from block storage in case of a server crash. Moreover, except for the free tier, all paid tier databases provide extra redundancy by replicating data to multiple instances.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Backup/Restore
Replication
x
github
discord
Powered by Mintlify
Durable Storage - Upstash Documentation
Replication
Replication is enabled for all paid Upstash databases. The data is replicated to multiple instances. Replication provides you high availability and better scalability.
​
High Availability
Replication makes your database resilient to failures because even one of the replicas is not available, your database continues to work.
There are two types of replicas in Upstash Redis: primary replicas and read replicas. Primary replicas handle both reads and writes, while read replicas are used only for reads.
In all subscription plans, primary replicas are highly available with multiple replicas to ensure that even if one fails, your database continues to function.
If a read replica fails, your database remains operational, and you can still read from the primary replicas, though with higher latency. When Prod Pack is enabled, read replicas are also highly available. This ensures that if one read replica fails, you can read from another read replica in the same region without any additional latency.
​
Better Scalability
In a replicated database, your requests are evenly distributed among the replicas using a round-robin approach. As your throughput requirements grow, additional replicas can be added to the cluster to handle the increased workload and maintain high performance. This scalability feature ensures that your database can effectively meet the demands of high throughput scenarios.
​
Architecture
We use the single leader replication model. Each key is owned by a leader replica and other replicas become the backups of the leader. Writes on a key are processed by the leader replica first then propagated to backup replicas. Reads can be performed from any replica. This model gives a better write consistency and read scalability.
​
Consistency
Each replica in the cluster utilizes a failure detector to monitor the status of the leader replica. In the event that the leader replica fails, the remaining replicas initiate a new leader election process to select a new leader. During this leader election round, which is the only unavailability window for the cluster, there may be a short period of time where your requests can be temporarily blocked.
However, once a new leader is elected, normal operations resume, ensuring the continued availability of the cluster. This mechanism ensures that any potential unavailability caused by leader failure is minimized, and the cluster can quickly recover and resume processing requests.
Checkout Read Your Writes for more details on how to achieve RYW consistency.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Durable Storage
Eviction
x
github
discord
Powered by Mintlify
Replication - Upstash Documentation
Features
Eviction
By default eviction is disabled, and Upstash Redis will reject write operations once the maximum data size limit has been reached. However, if you are utilizing Upstash Redis as a cache, you have the option to enable eviction. Enabling eviction allows older data to be automatically removed from the cache (including Durable Storage) when the maximum size limit is reached. This ensures that the cache remains within the allocated size and can make room for new data to be stored. Enabling eviction is particularly useful when the cache is intended to store frequently changing or temporary data, allowing the cache to adapt to evolving data needs while maintaining optimal performance.
You can enable eviction by checking Eviction checkbox while creating a new database:

Or for an existing database by clicking Enable in Configuration/Eviction box in the database details page:

Upstash currently uses a single eviction algorithm, called optimistic-volatile, which is a combination of volatile-random and allkeys-random eviction policies available in the original Redis.
Initially, Upstash employs random sampling to select keys for eviction, giving priority to keys marked with a TTL (expire field). If there is a shortage of volatile keys or they are insufficient to create space, additional non-volatile keys are randomly chosen for eviction. In future releases, Upstash plans to introduce more eviction policies, offering users a wider range of options to customize the eviction behavior according to their specific needs.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Replication
Security
x
github
discord
Powered by Mintlify
Eviction - Upstash Documentation
Features
Security
Upstash has a set of features to help you secure your data. We will list them and at the end of the section we will list the best practices to improve security of database.
​
TLS
TLS is an optional feature which you can enable while creating your database. Once TLS is enabled, the data transfer between the client and database is encrypted. TLS is always enabled on Upstash Redis databases.
​
Redis ACL
With Redis ACL, you can improve security by restricting a user’s access to commands and keys, so that untrusted clients have no access and trusted clients have just the minimum required access level to the database. Moreover it improves operational safety, so that clients or users accessing Redis are not allowed to damage the data or the configuration due to errors or mistakes. Check Redis ACL documentation. If you are using the REST API, you can still benefit from ACLs as explained here
​
Database Credentials
When you create a database, a secure password is generated. Upstash keeps the password encrypted. Use environment variables or your provider’s secret management system (e.g. AWS Secrets Manager, Vercel Secrets) to keep them. Do not use them hardcoded in your code. If your password is leaked, reset the password using Upstash console.
​
Encryption at Rest
Encryption at REST encrypts the block storage where your data is persisted and stored. It is available with Prod Pack add-on.
​
Application Level Encryption
Client side encryption can be used to encrypt data through application lifecycle. Client-side encryption is used to help protect data in use. This comes with some limitations. Operations that must operate on the data, such as increments, comparisons, and searches will not function properly. You can write client-side encryption logic directly in your own application or use functions built into clients such as the Java Lettuce cipher codec. We have plans to support encryption in our SDKs.
​
IP Allowlisting
We can restrict the access to your database to a set of IP addresses which will have access to your database. This is quite a strong way to secure your database, but it has some limitations. For example you can not know the IP addresses in serverless platforms such AWS Lambda and Vercel functions.
​
VPC Peering
VPC Peering enables you to connect to Upstash from your own VPC using private IP. Database will not be accessible from the public network. Database and your application can run in the same subnet which also minimizes data transfer costs. VPC Peering is only available for Pro databases.
​
Private Link
AWS Private link provides private connectivity between Upstash Database and your Redis client inside AWS infrastructure. Private link is only available for Pro databases.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Eviction
Consistency
x
github
discord
Powered by Mintlify
Security - Upstash Documentation

Features
Consistency
Upstash utilizes a leader-based replication mechanism. Under this mechanism, each key is assigned to a leader replica, which is responsible for handling write operations on that key. The remaining replicas serve as backups to the leader. When a write operation is performed on a key, it is initially processed by the leader replica and then asynchronously propagated to the backup replicas. This ensures that data consistency is maintained across the replicas. Reads can be performed from any replica.
Each replica employs a failure detector to track liveness of the leader replica. When the leader replica fails for a reason, remaining replicas start a new leader election round and elect a new leader. This is the only unavailability window for the cluster where write your requests can be blocked for a short period of time. Also in case of cluster wide failures like network partitioning (split brain); periodically running anti entropy jobs resolve the conflicts using Last-Writer-Wins algorithm and converge the replicas to the same state.
This model gives a better write consistency and read scalability but can provide only Eventual Consistency. Additionally you can achieve Causal Consistency (Read-Your-Writes, Monotonic-Reads, Monotonic-Writes and Writes-Follow-Reads guarantees) for a single Redis connection. (A TCP connection forms a session between client and server).
Checkout Read Your Writes for more details on how to achieve RYW consistency.
Checkout Replication for more details on Replication mechanism.
Previously, Upstash supported Strong Consistency mode for the single region databases. We decided to deprecate this feature because its effect on latency started to conflict with the performance expectations of Redis use cases. Also we are gradually moving to CRDT based Redis data structures, which will provide Strong Eventual Consistency.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Security
Auto Upgrade
x
github
discord
Powered by Mintlify
Consistency - Upstash Documentation
Features
Auto Upgrade
By default, Upstash will apply usage limits based on your current plan. When you reach these limits, behavior depends on the specific limit type - bandwidth limits will stop your traffic, while storage limits will reject new write operations. However, Upstash offers an Auto Upgrade feature that automatically upgrades your database to the next higher plan when you reach your usage limits, ensuring uninterrupted service.
Auto Upgrade is particularly useful for applications with fluctuating or growing workloads, as it prevents service disruptions during high-traffic periods or when your data storage needs expand beyond your current plan. This feature allows your database to automatically scale with your application’s demands without requiring manual intervention.
​
How Auto Upgrade Works
When enabled:
For bandwidth limits: Instead of stopping your traffic when you reach the bandwidth limit, your database will automatically upgrade to the next plan to accommodate the increased traffic.
For storage limits: Instead of rejecting write operations when you reach maximum data size, your database will upgrade to a plan with larger storage capacity.
​
Managing Auto Upgrade
You can enable Auto Upgrade by checking the Auto Upgrade checkbox while creating a new database:

Typescript
Get Started
@upstash/redis is written in Deno and can be imported from deno.land
Copy
Ask AI
import { Redis } from "https://deno.land/x/upstash_redis/mod.ts";


We transpile the package into an npm compatible package as well:
Copy
Ask AI
npm install @upstash/redis


Copy
Ask AI
yarn add @upstash/redis


Copy
Ask AI
pnpm add @upstash/redis


​
Basic Usage:
Copy
Ask AI
import { Redis } from "@upstash/redis"


const redis = new Redis({
  url: <UPSTASH_REDIS_REST_URL>,
  token: <UPSTASH_REDIS_REST_TOKEN>,
})


// string
await redis.set('key', 'value');
let data = await redis.get('key');
console.log(data)


await redis.set('key2', 'value2', {ex: 1});


// sorted set
await redis.zadd('scores', { score: 1, member: 'team1' })
data = await redis.zrange('scores', 0, 100 )
console.log(data)


// list
await redis.lpush('elements', 'magnesium')
data = await redis.lrange('elements', 0, 100 )
console.log(data)


// hash
await redis.hset('people', {name: 'joe'})
data = await redis.hget('people', 'name' )
console.log(data)


// sets
await redis.sadd('animals', 'cat')
data  = await redis.spop('animals', 1)
console.log(data)


Was this page helpful?
Yes
No
Suggest edits
Raise issue
Overview
Overview
x
github
discord
Powered by Mintlify
Get Started - Upstash Documentation
Commands
Overview
Available Commands in @upstash/redis
Auth
ECHO
Echo the given string.
PING
Ping the server.
Bitmap
BITCOUNT
Count set bits in a string.
BITOP
Perform bitwise operations between strings.
BITPOS
Find first bit set or clear in a string.
GETBIT
Returns the bit value at offset in the string value stored at key.
SETBIT
Sets or clears the bit at offset in the string value stored at key.
Generic
DEL
Delete one or multiple keys.
EXISTS
Determine if a key exists.
EXPIRE
Set a key’s time to live in seconds.
EXPIREAT
Set the expiration for a key as a UNIX timestamp.
KEYS
Find all keys matching the given pattern.
PERSIST
Remove the expiration from a key.
PEXPIRE
Set a key’s time to live in milliseconds.
PEXPIREAT
Set the expiration for a key as a UNIX timestamp specified in milliseconds.
PTTL
Get the time to live for a key in milliseconds.
RANDOMKEY
Return a random key from the keyspace.
RENAME
Rename a key.
RENAMENX
Rename a key, only if the new key does not exist.
SCAN
Incrementally iterate the keys space.
TOUCH
Alters the last access time of a key(s). Returns the number of existing keys specified.
TTL
Get the time to live for a key.
TYPE
Determine the type stored at key.
UNLINK
Delete one or more keys.
Hash
HDEL
HEXISTS
HEXPIRE
HEXPIREAT
HEXPIRETIME
HGET
HGETALL
HINCRBY
HINCRBYFLOAT
HKEYS
HLEN
HMGET
HPERSIST
HPEXPIRE
HPEXPIREAT
HPEXPIRETIME
HPTTL
HRANDFIELD
HSCAN
HSET
HSETNX
HSTRLEN
HTTL
HVALS
JSON
ARRAPPEND
ARRINDEX
ARRINSERT
ARRLEN
ARRPOP
ARRTRIM
CLEAR
DEL
FORGET
GET
MGET
MSET
MERGE
NUMINCRBY
NUMMULTBY
OBJKEYS
OBJLEN
SET
STRAPPEND
STRLEN
TOGGLE
TYPE
List
LINDEX
LINSERT
LLEN
LMOVE
LPOP
LPOS
LPUSH
LPUSHX
LRANGE
LREM
LSET
LTRIM
RPOP
RPUSH
RPUSHX
PubSub
PUBLISH
Publish messages to many clients
Scripts
EVAL
EVAL_RO
EVALSHA
EVALSHA_RO
SCRIPT EXISTS
SCRIPT FLUSH
SCRIPT LOAD
Server
DBSIZE
FLUSHALL
FLUSHDB
Set
SADD
SCARD
SDIFF
SDIFFSTORE
SINTER
SINTERSTORE
SISMEMBER
SMEMBERS
SMISMEMBER
SMOVE
SPOP
SRANDMEMBER
SREM
SSCAN
SUNION
SUNIONSTORE
Sorted Set
ZADD
ZCARD
ZCOUNT
ZDIFFSTORE
ZINCRBY
ZINTERSTORE
ZLEXCOUNT
ZMSCORE
ZPOPMAX
ZPOPMIN
ZRANGE
ZRANK
ZREM
ZREMRANGEBYLEX
ZREMRANGEBYRANK
ZREMRANGEBYSCORE
ZREVRANK
ZSCAN
ZSCORE
ZUNIONSTORE
Stream
XADD
Appends a new entry to a stream.
XRANGE
Return a range of elements in a stream, with IDs matching the specified IDs interval.
String
APPEND
Append a value to a string stored at key.
DECR
Decrement the integer value of a key by one.
DECRBY
Decrement the integer value of a key by the given number.
GET
Get the value of a key.
GETDEL
Get the value of a key and delete the key.
GETRANGE
Get a substring of the string stored at a key.
GETSET
Set the string value of a key and return its old value.
INCR
Increment the integer value of a key by one.
INCRBY
Increment the integer value of a key by the given amount.
INCRBYFLOAT
Increment the float value of a key by the given amount.
MGET
Get the values of all the given keys.
MSET
Set multiple keys to multiple values.
MSETNX
Set multiple keys to multiple values, only if none of the keys exist.
SET
Set the string value of a key.
SETRANGE
Overwrite part of a string at key starting at the specified offset.
STRLEN
Get the length of the value stored in a key.
Transactions
TRANSACTION
Run multiple commands in a transaction.
Was this page helpful?
Yes
No
Suggest edits
Typescript
Deployment
We support various platforms, such as nodejs, cloudflare and fastly. Platforms differ slightly when it comes to environment variables and their fetch api. Please use the correct import when deploying to special platforms.
​
Node.js / Browser
Examples: Vercel, Netlify, AWS Lambda
If you are running on nodejs you can set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN as environment variable and create a redis instance like this:
Copy
Ask AI
import { Redis } from "@upstash/redis"


const redis = new Redis({
  url: <UPSTASH_REDIS_REST_URL>,
  token: <UPSTASH_REDIS_REST_TOKEN>,
})


// or load directly from env
const redis = Redis.fromEnv()

If you are running on nodejs v17 and earlier, fetch will not be natively supported. Platforms like Vercel, Netlify, Deno, Fastly etc. provide a polyfill for you. But if you are running on bare node, you need to either specify a polyfill yourself or change the import path slightly:
Copy
Ask AI
import { Redis } from "@upstash/redis/with-fetch";

Code example
​
Cloudflare Workers
Cloudflare handles environment variables differently than Node.js. Please add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN using wrangler secret put ... or in the cloudflare dashboard.
Afterwards you can create a redis instance:
Copy
Ask AI
import { Redis } from "@upstash/redis/cloudflare"


const redis = new Redis({
  url: <UPSTASH_REDIS_REST_URL>,
  token: <UPSTASH_REDIS_REST_TOKEN>,
})




// or load directly from global env


// service worker
const redis = Redis.fromEnv()




// module worker
export default {
  async fetch(request: Request, env: Bindings) {
    const redis = Redis.fromEnv(env)
    // ...
  }
}

Code example
Code example typescript
Code example Wrangler 1
Documentation
​
Fastly
Fastly introduces a concept called backend. You need to configure a backend in your fastly.toml. An example can be found here. Until the fastly api stabilizes we recommend creating an instance manually:
Copy
Ask AI
import { Redis } from "@upstash/redis/fastly"


const redis = new Redis({
  url: <UPSTASH_REDIS_REST_URL>,
  token: <UPSTASH_REDIS_REST_TOKEN>,
  backend: <BACKEND_NAME>,
})

Code example
Documentation
​
Deno
Examples: Deno Deploy, Netlify Edge
Copy
Ask AI
import { Redis } from "https://deno.land/x/upstash_redis/mod.ts"


const redis = new Redis({
  url: <UPSTASH_REDIS_REST_URL>,
  token: <UPSTASH_REDIS_REST_TOKEN>,
})


// or
const redis = Redis.fromEnv();
Pipeline & Transaction
​
Pipeline
Pipelining commands allows you to send a single http request with multiple commands. Keep in mind, that the execution of pipelines is not atomic and the execution of other commands can interleave.
Copy
Ask AI
import { Redis } from "@upstash/redis";


const redis = new Redis({
  /* auth */
});


const p = redis.pipeline();


// Now you can chain multiple commands to create your pipeline:


p.set("key", 2);
p.incr("key");


// or inline:
p.hset("key2", "field", { hello: "world" }).hvals("key2");


// Execute the pipeline once you are done building it:
// `exec` returns an array where each element represents the response of a command in the pipeline.
// You can optionally provide a type like this to get a typed response.
const res = await p.exec<[Type1, Type2, Type3]>();


For more information about pipelines using REST see here.
If you wish to benefit from pipeline automatically, you can simply enable auto-pipelining to make your redis client handle the commands in batches in the background. See the Auto-pipelining page.
​
Transaction
Remember that the pipeline is able to send multiple commands at once but can’t execute them atomically. With transactions, you can make the commands execute atomically.
Copy
Ask AI
import { Redis } from "@upstash/redis";


const redis = new Redis({
  /* auth */
});


const p = redis.multi();


p.set("key", 2);
p.incr("key");


// or inline:
p.hset("key2", "field", { hello: "world" }).hvals("key2");


// execute the transaction
const res = await p.exec<[Type1, Type2, Type3]>();


Was this page helpful?
Yes
No
Suggest edits
Raise issue
Deployment
Auto-Pipelining
x
github
discord
Powered by Mintlify
Pipeline & Transaction - Upstash Documentation



Or for an existing database by clicking Enable in the Configuration/Auto Upgrade box in the database details page:

Was this page helpful?
Yes
No
Suggest edits
Raise issue
Consistency
Overview
x
github
discord
Powered by Mintlify
Auto Upgrade - Upstash Documentation
Auto-Pipelining
​
Auto Pipelining
Auto pipelining allows you to use the Redis client as usual while in the background it tries to send requests in batches whenever possible.
In a nutshell, the client will accumulate commands in a pipeline and wait for a short amount of time for more commands to arrive. When there are no more commands, it will execute them as a batch.
To enable the feature, simply pass enableAutoPipelining: true when creating the Redis client:
Redis
fromEnv
Copy
Ask AI
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv({
  latencyLogging: false,
  enableAutoPipelining: true
});

This is especially useful in cases when we want to make async requests or when we want to make requests in batches.
Copy
Ask AI
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv({
  latencyLogging: false,
  enableAutoPipelining: true
});

// async call to redis. Not executed right away, instead
// added to the pipeline
redis.hincrby("Brooklyn", "visited", 1);

// making requests in batches
const brooklynInfo = Promise.all([
  redis.hget("Brooklyn", "coordinates"),
  redis.hget("Brooklyn", "population")
]);

// when we call await, the three commands are executed
// as a pipeline automatically. A single PIPELINE command
// is executed instead of three requests and the results
// are returned:
const [ coordinates, population ] = await brooklynInfo;

The benefit of auto pipelining is that it reduces the number of HTTP requests made like pipelining and transaction while being extremely simple to enable and use. It’s especially useful in cases like Vercel Edge and Cloudflare Workers, where the number of simultaneous requests is limited by 6.
To learn more about how auto pipelining can be utilized in a project, see the auto-pipeline example project under upstash-redis repository
​
How it Works
For auto pipeline to work, the client keeps an active pipeline and adds incoming commands to this pipeline. After the command is added to the pipeline, execution of the pipeline is delayed by releasing the control of the Node thread.
The pipeline executes when one of these two conditions are met: No more commands are being added or at least one of the commands added is being ‘awaited’.
This means that if you are awaiting every time you run a command, you won’t benefit much from auto pipelining since each await will trigger a pipeline:
Copy
Ask AI
const foo = await redis.get("foo") // makes a PIPELINE call
const bar = await redis.get("bar") // makes another PIPELINE call

In these cases, we suggest using Promise.all:
Copy
Ask AI
// makes a single PIPELINE call:
const [ foo, bar ] = await Promise.all([
  redis.get("foo"),
  redis.get("bar")
])

In addition to resulting in a single PIPELINE call, the commands in Promise.all are executed in the order they are written!
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Pipeline & Transaction
Advanced
x
github
discord
Powered by Mintlify
Auto-Pipelining - Upstash Documentation
Typescript
Advanced
​
Disable automatic serialization
Your data is (de)serialized as json by default. This works for most use cases but you can disable it if you want:
Copy
Ask AI
const redis = new Redis({
  // ...
  automaticDeserialization: false,
});

// or
const redis = Redis.fromEnv({
  automaticDeserialization: false,
});

This probably breaks quite a few types, but it’s a first step in that direction. Please report bugs and broken types here.
​
Keep-Alive
@upstash/redis optimizes performance by reusing connections wherever possible, reducing latency. This is achieved by keeping the client in memory instead of reinitializing it with each new function invocation. As a result, when a hot lambda function receives a new request, it uses the already initialized client, allowing for the reuse of existing connections to Upstash.
This functionality is enabled by default.
​
Request Timout
You can configure the SDK so that it will throw an error if the request takes longer than a specified time.
You can achieve this using the signal parameter like this:
Copy
Ask AI
try {
  const redis = new Redis({
    url: "<UPSTASH_REDIS_REST_URL>",
    token: "<UPSTASH_REDIS_REST_TOKEN>",
    // set a timeout of 1 second
    signal: () => AbortSignal.timeout(1000),
  });
} catch (error) {
  if (error.name === "AbortError") {
    console.error("Request timed out");
  } else {
    console.error("An error occurred:", error);
  }
}

Was this page helpful?
Yes
No
Suggest edits
Raise issue
Auto-Pipelining
Retries
x
github
discord
Powered by Mintlify
Advanced - Upstash Documentation
Typescript
Retries
By default @upstash/redis will retry sending you request when network errors occur. It will retry 5 times with a backoff of (retryCount) => Math.exp(retryCount) * 50 milliseconds.
You can customize this in the Redis constructor:
Copy
Ask AI
new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
  retry: {
    retries: 5,
    backoff: (retryCount) => Math.exp(retryCount) * 50,
  },
});

The exact type definition can be found here.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Advanced
Troubleshooting
x
github
discord
Powered by Mintlify
Retries - Upstash Documentation
Troubleshooting
​
ReferenceError: fetch is not defined
​
Problem
If you are running on nodejs v17 and earlier, fetch will not be natively supported. Platforms like Vercel, Netlify, Deno, Fastly etc. provide a polyfill for you. But if you are running on bare node, you need to add a polyfill.
​
Solution
Copy
Ask AI
npm i isomorphic-fetch

Copy
Ask AI
import { Redis } from "@upstash/redis";
import "isomorphic-fetch";

const redis = new Redis({
  /*...*/
});

​
Hashed Response
The response from a server is not what you expect but looks like a hash?
Copy
Ask AI
await redis.set("key", "value");
const data = await redis.get("key");
console.log(data);

// dmFsdWU=

​
Problem
By default @upstash/redis will request responses from the server to be base64 encoded. This is to prevent issues with some edge cases when storing data where the http response fails to be deserialized using res.json()
This solves the problem for almost all edge cases, but it can cause new issues.
​
Solution
You can disable this behavior by setting responseEncoding to false in the options.
Copy
Ask AI
const redis = new Redis({
  // ...
  responseEncoding: false,
});

This should no longer be necessary, but if you are still experiencing issues with this, please let us know:
Discord
X
GitHub
​
Large numbers are returned as string
You are trying to load a large number and it is returned as a string instead.
Copy
Ask AI
await redis.set("key", "101600000000150081467");
const res = await redis("get");

// "101600000000150081467"

​
Problem
Javascript can not handle numbers larger than 2^53 -1 safely and would return wrong results when trying to deserialize them. In these cases the default deserializer will return them as string instead. This might cause a mismatch with your custom types.
​
Solution
Please be aware that this is a limitation of javascript and take special care when handling large numbers.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Retries
Developing or Testing
x
github
discord
Powered by Mintlify
Troubleshooting - Upstash DDeveloping or Testing
When developing or testing your application, you might not want or can not use Upstash over the internet. In this case, you can use a community project called Serverless Redis HTTP (SRH) created by Scott Hiett.
SRH is a Redis proxy and connection pooler that uses HTTP rather than the Redis binary protocol. The aim of this project is to be entirely compatible with Upstash, and work with any Upstash supported Redis version.
We are working with Scott together to keep SRH up to date with the latest Upstash features.
​
Use cases for SRH:
For usage in your CI pipelines, creating Upstash databases is tedious, or you have lots of parallel runs.
See Using in GitHub Actions on how to quickly get SRH setup for this context.
For usage inside of Kubernetes, or any network whereby the Redis server is not exposed to the internet.
See Using in Docker Compose for the various setup options directly using the Docker Container.
For local development environments, where you have a local Redis server running, or require offline access.
See Using the Docker Command, or Using Docker Compose.
​
Setting up SRH
​
Via Docker command
If you have a locally running Redis server, you can simply start an SRH container that connects to it. In this example, SRH will be running on port 8080.
Copy
Ask AI
docker run \
    -it -d -p 8080:80 --name srh \
    -e SRH_MODE=env \
    -e SRH_TOKEN=your_token_here \
    -e SRH_CONNECTION_STRING="redis://your_server_here:6379" \
    hiett/serverless-redis-http:latest

​
Via Docker Compose
If you wish to run in Kubernetes, this should contain all the basics would need to set that up. However, be sure to read the Configuration Options, because you can create a setup whereby multiple Redis servers are proxied.
Copy
Ask AI
version: "3"
services:
  redis:
    image: redis
    ports:
      - "6379:6379"
  serverless-redis-http:
    ports:
      - "8079:80"
    image: hiett/serverless-redis-http:latest
    environment:
      SRH_MODE: env
      SRH_TOKEN: example_token
      SRH_CONNECTION_STRING: "redis://redis:6379" # Using `redis` hostname since they're in the same Docker network.

​
In GitHub Actions
SRH works nicely in GitHub Actions because you can run it as a container in a job’s services. Simply start a Redis server, and then SRH alongside it. You don’t need to worry about a race condition of the Redis instance not being ready, because SRH doesn’t create a Redis connection until the first command comes in.
Copy
Ask AI
name: Test @upstash/redis compatibility
on:
  push:
  workflow_dispatch:

env:
  SRH_TOKEN: example_token

jobs:
  container-job:
    runs-on: ubuntu-latest
    container: denoland/deno
    services:
      redis:
        image: redis/redis-stack-server:6.2.6-v6 # 6.2 is the Upstash compatible Redis version
      srh:
        image: hiett/serverless-redis-http:latest
        env:
          SRH_MODE: env # We are using env mode because we are only connecting to one server.
          SRH_TOKEN: ${{ env.SRH_TOKEN }}
          SRH_CONNECTION_STRING: redis://redis:6379

    steps:
      # You can place your normal testing steps here. In this example, we are running SRH against the upstash/upstash-redis test suite.
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          repository: upstash/upstash-redis

      - name: Run @upstash/redis Test Suite
        run: deno test -A ./pkg
        env:
          UPSTASH_REDIS_REST_URL: http://srh:80
          UPSTASH_REDIS_REST_TOKEN: ${{ env.SRH_TOKEN }}

A huge thanks goes out to Scott for creating this project, and for his continued efforts to keep it up to date with Upstash.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Troubleshooting
Overview
x
github
discord
Powered by Mintlify
Developing or Testing - Upstash Documentation
Connect Your Client
Upstash works with Redis® API, that means you can use any Redis client with Upstash. At the Redis Clients page you can find the list of Redis clients in different languages.
Probably, the easiest way to connect to your database is to use redis-cli. Because it is already covered in Getting Started, we will skip it here.
​
Database
After completing the getting started guide, you will see the database page as below:

The information required for Redis clients is displayed here as Endpoint, Port and Password. Also when you click on Clipboard button on Connect to your database section, you can copy the code that is required for your client.
Below, we will provide examples from popular Redis clients, but the information above should help you configure all Redis clients similarly.
TLS is enabled by default for all Upstash Redis databases. It’s not possible to disable it.
​
upstash-redis
Because upstash-redis is HTTP based, we recommend it for Serverless functions. Other TCP based clients can cause connection problems in highly concurrent use cases.
Library: upstash-redis
Example:
Copy
Ask AI
import { Redis } from '@upstash/redis';

const redis = new Redis({ url: 'UPSTASH_REDIS_REST_URL', token: 'UPSTASH_REDIS_REST_TOKEN' });

(async () => {
  try {
    const data = await redis.get('key');
    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();

​
Node.js
Library: ioredis
Example:
Copy
Ask AI
const Redis = require("ioredis");

let client = new Redis("rediss://:YOUR_PASSWORD@YOUR_ENDPOINT:YOUR_PORT");
await client.set("foo", "bar");
let x = await client.get("foo");
console.log(x);

​
Python
Library: redis-py
Example:
Copy
Ask AI
import redis
r = redis.Redis(
host= 'YOUR_ENDPOINT',
port= 'YOUR_PORT',
password= 'YOUR_PASSWORD', 
ssl=True)
r.set('foo','bar')
print(r.get('foo'))

​
Java
Library: jedis
Example:
Copy
Ask AI
Jedis jedis = new Jedis("YOUR_ENDPOINT", "YOUR_PORT", true);
jedis.auth("YOUR_PASSWORD");
jedis.set("foo", "bar");
String value = jedis.get("foo");
System.out.println(value);

​
Go
Library: redigo
Example:
Copy
Ask AI
func main() {
  c, err := redis.Dial("tcp", "YOUR_ENDPOINT:YOUR_PORT", redis.DialUseTLS(true))
  if err != nil {
      panic(err)
  }

  _, err = c.Do("AUTH", "YOUR_PASSWORD")
  if err != nil {
      panic(err)
  }

  _, err = c.Do("SET", "foo", "bar")
  if err != nil {
      panic(err)
  }

  value, err := redis.String(c.Do("GET", "foo"))
  if err != nil {
      panic(err)
  }

  println(value)
}

Was this page helpful?
Yes
No
Suggest edits
Raise issue
Ratelimiting Algorithms
Connect with upstash-redis
x
github
discord
Powered by Mintlify
Connect Your Client - Upstash Documentation
ocumentation
How To
Connect with upstash-redis
upstash-redis is an HTTP/REST based Redis client built on top of Upstash REST API. For more information, refer to the documentation of Upstash redis client (TypeScript & Python).
It is the only connectionless (HTTP based) Redis client and designed for:
Serverless functions (AWS Lambda …)
Cloudflare Workers (see the example)
Fastly Compute@Edge
Next.js, Jamstack …
Client side web/mobile applications
WebAssembly
and other environments where HTTP is preferred over TCP.
See the list of APIs supported.
​
Quick Start
​
Install
Copy
Ask AI
npm install @upstash/redis

​
Usage
Copy
Ask AI
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "UPSTASH_REDIS_REST_URL",
  token: "UPSTASH_REDIS_REST_TOKEN",
});

(async () => {
  try {
    const data = await redis.get("key");
    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();

If you define UPSTASH_REDIS_REST_URL andUPSTASH_REDIS_REST_TOKEN environment variables, you can load them automatically.
Copy
Ask AI
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv()(async () => {
  try {
    const data = await redis.get("key");
    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();

Was this page helpful?
Yes
No
Suggest edits
Raise issue
Connect Your Client
Upgrade Your Database
x
github
discord
Powered by Mintlify
Connect with upstash-redis - Upstash Documentation
Upgrade Your Database
Free tier has followings restrictions:
Max 500K commands per month
Max 256MB data size
One free database per account
If you think your database is close to reaching any of these limits, we recommend you to upgrade to pay-as-you-go plan which includes:
No limit on requests per day
Data size up to 100 GB
To upgrade your database, you need to have a payment method. You can add a payment method as described here. After you add a payment method, Upstash restarts your database and your new database starts with the pay-as-you-go plan.
isten Keyspace Notifications
Upstash allows you to listen for keyspace notifications over pubsub channels to receive events for changes over the keys.
For each event that occurs, two kinds of events are fired over the corresponding pubsub channels:
A keyspace event that will use the pubsub channel for the key, possibly containing other events for the same key
A keyevent event that will use the pubsub channel for the event, possibly containing other events for the different keys
The channel names and their content are of the form:
__keyspace@0__:keyname channel with the values of the event names for the keyspace notifications
__keyevent@0__:eventname channel with the values of the key names for the keyevent notifications
​
Enabling Notifications
By default, all keyspace and keyevent notifications are off. To enable it, you can use the CONFIG SET command, and set the notify-keyspace-events options to one of the appropriate flags described below.
Each keyspace and keyevent notification fired might have an effect on the latency of the commands as the events are delivered to the listening clients and cluster members for multi-replica deployments. Therefore, it is advised to only enable the minimal subset of the notifications that are needed.
Flag
Description
K
Keyspace events
E
Keyevent events
g
Generic command events
$
String command events
l
List command events
s
Set command events
h
Hash command events
z
Sorted set command events
t
Stream command events
d
Module(JSON) command events
x
Expiration events
e
Eviction events
m
Key miss events
n
New key events
A
Alias for g$lshztxed

At least one of the K or E flags must be present in the option value.
For example, you can use the following command to receive keyspace notifications only for the hash commands:
cURL
redis-cli
Copy
Ask AI
curl -X POST \
    -d '["CONFIG", "SET", "notify-keyspace-events", "Kh"]' \
    -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
    $UPSTASH_REDIS_REST_URL

You can listen for all the channels using redis-cli to test the effect of the above command:
Copy
Ask AI
redis-cli --tls -u $UPSTASH_REDIS_CLI_URL --csv psubscribe '__key*__:*'

​
Disabling Notifications
You can reuse the CONFIG SET command and set notify-keyspace-events option to empty string to disable all keyspace and keyevent notifications.
cURL
redis-cli
Copy
Ask AI
curl -X POST \
    -d '["CONFIG", "SET", "notify-keyspace-events", ""]' \
    -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
    $UPSTASH_REDIS_REST_URL

​
Checking Notification Configuration
CONFIG GET command can be used the get the current value of the notify-keyspace-events option to see the active keyspace and keyevent notifications configuration.
cURL
redis-cli
Copy
Ask AI
curl -X POST \
    -d '["CONFIG", "GET", "notify-keyspace-events"]' \
    -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
    $UPSTASH_REDIS_REST_URL

Was this page helpful?
Yes
No
Suggest edits
Raise issue
Import/Export Data
Use IP Allowlist
x
github
discord
Powered by Mintlify
Listen Keyspace Notifications - Upstash Documentation
How To
Use IP Allowlist
IP Allowlist is available on all plans except for the free plan.
IP Allowlist can be used to restrict which IP addresses are permitted to access your database by comparing a connection’s address with predefined CIDR blocks. This feature enhances database security by allowing connections only from specified IP addresses. For example if you have dedicated production servers with static IP addresses, enabling IP allowlist blocks connections from other addresses.

​
Enabling IP Allowlist
By default, any IP address can be used to connect to your database. You must add at least one IP range to enable the allowlist. You can manage added IP ranges in the Configuration section on the database details page. You can either provide
IPv4 address, e.g. 37.237.15.43
CIDR block, e.g. 181.49.172.0/24
Currently, IP Allowlist only supports IPv4 addresses.
You can use more than one range to allow multiple clients. Meeting the criteria of just one is enough to establish a connection.
It may take a few minutes for changes to propagate.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Listen Keyspace Notifications
Read Your Writes
x
github
discord
Powered by Mintlify
Use IP Allowlist - Upstash Documentation
Read Your Writes
The “Read Your Writes” feature in Upstash Redis ensures that write operations are completed before subsequent read operations occur, maintaining data consistency in your application.
​
How It Works
All write operations happen on the primary member and take time to propagate to the read replicas. Imagine that a client attempts to read an item immediately after it’s written. The read may go to a replica that hasn’t synced with the primary yet, resulting in stale data being returned.
RYW consistency solves this by returning a sync token after each request, which indicates the primary member’s state. In the next request, this sync token ensures the read replica syncs up to that token before serving the read.
So, the sync token acts as a checkpoint, ensuring that any read operations following a write reflect the most recent changes, even if they are served by a read replica.
Management of the sync token is handled automatically by the official Typescript (version 1.34.0 and later) and Python (version 1.2.0 and later) SDKs of Upstash. When you initialize a Redis client with these SDKs, the writes made by that client will be respected during subsequent reads from the same client.
For REST users, you can achieve similar behavior by using the upstash-sync-token header. Each time you make a request, save the value of the upstash-sync-token header from the response and pass it in the upstash-sync-token header of your next request. This ensures that subsequent reads reflect the writes.
​
Cross-Client Synchronization
Imagine that you are writing some key to Redis and then you read the same key from a different Redis client instance. In this case, the second client’s read request may not reflect the write made by the first client, as the sync tokens are updated independently in the two clients.
Consider these two example functions, each representing separate API endpoints:
Copy
Ask AI
export const writeRequest = async () => {
  const redis = Redis.fromEnv();
  const randomKey = nanoid();
  await redis.set(randomKey, "value");
  return randomKey;
};

export const readRequest = async (randomKey: string) => {
  const redis = Redis.fromEnv();
  const value = await redis.get(randomKey);
  return value;
};

If these functions are called in sequence, they will create two separate clients:
Copy
Ask AI
const randomKey = await writeRequest();
await readRequest(randomKey);

As explained above, in rare cases, one of your read replicas can serve the read request before it receives the write update from the primary replica. To avoid this, if you are using @upstash/redis version 1.34.1 or later, you can pass the readYourWritesSyncToken from the first client to the second:
Copy
Ask AI
export const writeRequest = async () => {
  const redis = Redis.fromEnv();
  const randomKey = nanoid();
  await redis.set(randomKey, "value");

  // Get the token **after** making the write
  const token = redis.readYourWritesSyncToken;
  return { randomKey, token };
};

export const readRequest = async (
  randomKey: string,
  token: string | undefined
) => {
  const redis = Redis.fromEnv();

  // Set the token **before** making the read
  redis.readYourWritesSyncToken = token;

  const value = await redis.get(randomKey);
  return value;
};

const { randomKey, token } = await writeRequest();
await readRequest(randomKey, token);

Remember to get the sync token after the write request is completed, as the session token changes with each request.
For REST users or the Upstash Python SDK, a similar approach can be used. In Python, use Redis._sync_token instead of readYourWritesSyncToken.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Use IP Allowlist
Migrate Regional to Global Database
x
github
discord
Powered by Mintlify
Read Your Writes - Upstash Documentation
Migrate Regional to Global Database
This guide will help you migrate your data from a regional Upstash Redis database to a global database. If your database is Upstash Regional, we strongly recommend you to migrate to Upstash Redis Global. Our Regional Redis databases are legacy and deprecated.
​
Why Migrate?
New infrastructure, more modern and more secure
Upstash Global is SOC-2 and HIPAA compatible
Enhanced feature set: New features are only made available on Upstash Global
Ability to add/remove read regions on the go
Better performance as per our benchmarks
​
Prerequisites
Before starting the migration, make sure you have:
An existing regional Upstash Redis database (source)
A new global Upstash Redis database (destination)
Access to both databases’ credentials (connection strings, passwords)
​
Migration Process
There are several official ways to migrate your data:
If you are using RBAC, please note that they are not migrated automatically. You need to redefine ACL users for new the global database after migration.
​
1. Using Backup/Restore (Recommended for AWS Regional Databases)
If your regional database is hosted in AWS, you can use Upstash’s backup/restore feature:
Create a backup of your regional database:
Go to your regional database details page
Navigate to the Backups tab
Click the Backup button
Provide a unique name for your backup
Wait for the backup process to complete
During backup creation, some database operations will be temporarily unavailable.
Restore the backup to your global database:
Go to your global database details page
Navigate to the Backups tab
Click Restore...
Select your regional database as the source
Select the backup you created
Click Start Restore
The restore operation will flush (delete) all existing data in your (destination) global database before restoring the backup.
​
2. Using Upstash Console Migration Wizard
The easiest way to migrate your data is using the Upstash Console’s built-in migration wizard:
Go to Upstash Console
In the database list page, click the Import button
Select your source (regional) database
Select your destination (global) database
Follow the wizard instructions to complete the migration
Note: The destination database will be flushed before migration starts.
​
3. Using upstash-redis-dump
Another reliable method is using the official upstash-redis-dump tool:
Install upstash-redis-dump:
Copy
Ask AI
go install github.com/upstash/upstash-redis-dump@latest


Export data from regional database:
Copy
Ask AI
upstash-redis-dump -db 0 -host YOUR_REGIONAL_HOST -port YOUR_DATABASE_PORT -pass YOUR_PASSWORD -tls > redis.dump


Import data to global database:
Copy
Ask AI
redis-cli --tls -u redis://YOUR_PASSWORD@YOUR_REGIONAL_HOST:6379 --pipe < redis.dump


​
Verification
After migration, verify your data:
Compare key counts in both databases
Sample test some keys to ensure data integrity
​
Post-Migration Steps
Update your application configuration to use the new Global database URL
Test your application thoroughly with the new database
Monitor performance and consistency across regions
Keep the regional database as backup for a few days
Once verified, you can safely delete the regional database
​
Need Help?
If you encounter any issues during migration, please contact Upstash support via chat, support@upstash.com or visit our Discord community for assistance.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Read Your Writes
DrizzleORM
x
github
discord
Powered by Mintlify
Migrate Regional to Global Database - Upstash Documentation
Supabase Functions
The below is an example for a Redis counter that stores a hash of Supabase function invocation count per region.
​
Redis database setup
Create a Redis database using the Upstash Console or Upstash CLI.
Select the Global type to minimize the latency from all edge locations. Copy the UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to your .env file.
You’ll find them under Details > REST API > .env.
Copy
Ask AI
cp supabase/functions/upstash-redis-counter/.env.example supabase/functions/upstash-redis-counter/.env

​
Code
Make sure you have the latest version of the Supabase CLI installed.
Create a new function in your project:
Copy
Ask AI
supabase functions new upstash-redis-counter

And add the code to the index.ts file:
index.ts
Copy
Ask AI
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Redis } from "https://deno.land/x/upstash_redis@v1.19.3/mod.ts";
console.log(`Function "upstash-redis-counter" up and running!`);
serve(async (_req) => {
  try {
    const redis = new Redis({
      url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
      token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
    });
    const deno_region = Deno.env.get("DENO_REGION");
    if (deno_region) {
      // Increment region counter
      await redis.hincrby("supa-edge-counter", deno_region, 1);
    } else {
      // Increment localhost counter
      await redis.hincrby("supa-edge-counter", "localhost", 1);
    }
    // Get all values
    const counterHash: Record<string, number> | null = await redis.hgetall(
      "supa-edge-counter"
    );
    const counters = Object.entries(counterHash!)
      .sort(([, a], [, b]) => b - a) // sort desc
      .reduce(
        (r, [k, v]) => ({
          total: r.total + v,
          regions: { ...r.regions, [k]: v },
        }),
        {
          total: 0,
          regions: {},
        }
      );
    return new Response(JSON.stringify({ counters }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200,
    });
  }
});

​
Run locally
Copy
Ask AI
supabase start
supabase functions serve upstash-redis-counter --no-verify-jwt --env-file supabase/functions/upstash-redis-counter/.env

Navigate to http://localhost:54321/functions/v1/upstash-redis-counter.
​
Deploy
Copy
Ask AI
supabase functions deploy upstash-redis-counter --no-verify-jwt
supabase secrets set --env-file supabase/functions/upstash-redis-counter/.env

Was this page helpful?
Yes
No
Suggest edits
Raise issue
DigitalOcean
Deno Deploy
x
github
discord
Powered by Mintlify
Supabase Functions - Upstash Documentation
App Router
GitHub Repository
You can find the project source code on GitHub.
​
Project Setup
Let’s create a new Next.js application with App Router and install @upstash/redis package.
Copy
Ask AI
npx create-next-app@latest
cd my-app
npm install @upstash/redis

​
Database Setup
Create a Redis database using Upstash Console or Upstash CLI and copy the UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN into your .env file.
.env
Copy
Ask AI
UPSTASH_REDIS_REST_URL=<YOUR_URL>
UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>

​
Home Page Setup
Update /app/page.tsx:
/app/page.tsx
Copy
Ask AI
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function Home() {
  const count = await redis.incr("counter");
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Counter: {count}</h1>
    </div>
  )
}

​
Run & Deploy
Run the app locally with npm run dev, check http://localhost:3000/
Deploy your app with vercel
You can also integrate your Vercel projects with Upstash using Vercel Integration module. Check this article.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
Pages Router
Pages Router
x
github
discord
Powered by Mintlify
App Router - Upstash Documentation
Pages Router
GitHub Repository
You can find the project source code on GitHub.
​
Project Setup
Let’s create a new Next.js application with Pages Router and install @upstash/redis package.
Copy
Ask AI
npx create-next-app@latest
cd my-app
npm install @upstash/redis

​
Database Setup
Create a Redis database using Upstash Console or Upstash CLI and copy the UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN into your .env file.
.env
Copy
Ask AI
UPSTASH_REDIS_REST_URL=<YOUR_URL>
UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>

​
Home Page Setup
Update /pages/index.tsx:
/pages/index.tsx
Copy
Ask AI
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const getServerSideProps = (async () => {
  const count = await redis.incr("counter");
  return { props: { count } }
}) satisfies GetServerSideProps<{ count: number }>

export default function Home({
  count,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Counter: {count}</h1>
    </div>
  )
}

​
Run & Deploy
Run the app locally with npm run dev, check http://localhost:3000/
Deploy your app with vercel
You can also integrate your Vercel projects with Upstash using Vercel Integration module. Check this article.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
App Router
SST v2
x
github
discord
Powered by Mintlify
Pages Router - Upstash Documentation
ECHO
Returns a message back to you. Useful for debugging the connection.
Example
Copy
Ask AI
const response = await redis.echo("hello world");
console.log(response); // "hello world"
PING
Send a ping to the server and get a response if the server is alive.
​
Arguments
No arguments
​
Response
PONG
Example
Copy
Ask AI
const response = await redis.ping();
console.log(response); // "PONG"
BITCOUNT
Count the number of set bits.
The BITCOUNT command in Redis is used to count the number of set bits (bits with a value of 1) in a range of bytes within a key that is stored as a binary string. It is primarily used for bit-level operations on binary data stored in Redis.
​
Arguments
​
key
stringrequired
The key to get.
​
start
integer
Specify the range of bytes within the binary string to count the set bits. If not provided, it counts set bits in the entire string.
Either specify both start and end or neither.
​
end
integer
Specify the range of bytes within the binary string to count the set bits. If not provided, it counts set bits in the entire string.
Either specify both start and end or neither.
​
Response
The number of set bits in the specified range.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
PING
BITOP
x
github
discord
Powered by Mintlify
BITCOUNT - Upstash Documentation
Example
With Range
Copy
Ask AI
const bits = await redis.bitcount(key);
BITPOS
Find the position of the first set or clear bit (bit with a value of 1 or 0) in a Redis string key.
​
Arguments
​
key
stringrequired
The key to search in.
​
bit
0 | 1required
The key to store the result of the operation in.
​
start
number
The index to start searching at.
​
end
number
The index to stop searching at.
​
Response
The index of the first occurrence of the bit in the string.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
BITOP
GETBIT
x
github
discord
Powered by Mintlify
BITPOS - Upstash Documentation
Example
With Range
Copy
Ask AI
await redis.bitpos("key", 1);
GETBIT
Retrieve a single bit.
​
Arguments
​
key
stringrequired
The key of the bitset
​
offset
integerrequired
Specify the offset at which to get the bit.
​
Response
The bit value stored at offset.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
BITPOS
SETBIT
x
github
discord
Powered by Mintlify
GETBIT - Upstash Documentation
Example
Copy
Ask AI
const bit = await redis.getbit(key, 4);
Bitmap
SETBIT
Set a single bit in a string.
​
Arguments
​
key
stringrequired
The key of the bitset
​
offset
integerrequired
Specify the offset at which to set the bit.
​
value
0 | 1required
The bit to set
​
Response
The original bit value stored at offset.
Was this page helpful?
Yes
No
Suggest edits
Raise issue
GETBIT
DEL
x
github
discord
Powered by Mintlify
SETBIT - Upstash Documentation
Example
Copy
Ask AI
const originalBit = await redis.setbit(key, 4, 1);
DEL
Removes the specified keys. A key is ignored if it does not exist.
​
Arguments
​
keys
...string[]required
One or more keys to remove.
​
Response
The number of keys that were removed.
Basic
Array
Copy
Ask AI
await redis.del("key1", "key2");
Basic
Array
Copy
Ask AI
// in case you have an array of keys
const keys = ["key1", "key2"];
await redis.del(...keys)


Generic
EXISTS
Check if a key exists.
​
Arguments
​
keys
...string[]required
One or more keys to check.
​
Response
The number of keys that exist
Example
Copy
Ask AI
await redis.set("key1", "value1")
await redis.set("key2", "value2")
const keys = await redis.exists("key1", "key2", "key3");
console.log(keys) // 2
Generic
EXPIRE
Sets a timeout on key. The key will automatically be deleted.
​
Arguments
​
key
stringrequired
The key to set the timeout on.
​
seconds
integer
How many seconds until the key should be deleted.
​
Response
1 if the timeout was set, 0 otherwise
Example
Copy
Ask AI
await redis.set("mykey", "Hello");
await redis.expire("mykey", 10);
Generic
EXPIREAT
Sets a timeout on key. The key will automatically be deleted.
​
Arguments
​
key
stringrequired
The key to set the timeout on.
​
unix
integer
A unix timestamp in seconds at which point the key will expire.
​
Response
1 if the timeout was set, 0 otherwise
Example
Copy
Ask AI
await redis.set("mykey", "Hello");
const tenSecondsFromNow = Math.floor(Date.now() / 1000) + 10;
await redis.expireat("mykey", tenSecondsFromNow);
Generic
KEYS
Returns all keys matching pattern.
This command may block the DB for a long time, depending on its size. We advice against using it in production. Use SCAN instead.
​
Arguments
​
match
stringrequired
A glob-style pattern. Use * to match all keys.
​
Response
Array of keys matching the pattern.
Example
Match All
Copy
Ask AI
const keys = await redis.keys("prefix*");


Generic
PERSIST
Remove any timeout set on the key.
​
Arguments
​
key
stringrequired
The key to persist
​
Response
1 if the timeout was removed, 0 if key does not exist or does not have an associated timeout.
Example
Copy
Ask AI
await redis.persist(key);
Generic
PEXPIRE
Sets a timeout on key. After the timeout has expired, the key will automatically be deleted.
​
Arguments
​
key
stringrequired
The key to expire.
​
milliseconds
integer
The number of milliseconds until the key expires.
​
Response
1 if the timeout was applied, 0 if key does not exist.
Example
Copy
Ask AI
await redis.pexpire(key, 60_000); // 1 minute

Generic
Json
JSON.ARRAPPEND
Append values to the array at path in the JSON document at key.
To specify a string as an array value to append, wrap the quoted string with an additional set of single quotes. Example: ‘“silver”’.
​
Arguments
​
key
stringrequired
The key of the json entry.
​
path
stringdefault:"$"
The path of the array.
​
value
...TValue[]required
One or more values to append to the array.
​
Response
The length of the array after the appending.
Example
Copy
Ask AI
await redis.json.arrappend("key", "$.path.to.array", "a");

