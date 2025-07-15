Database

Every Supabase project comes with a full Postgres database, a free and open source database which is considered one of the world's most stable and advanced databases.
Features#
Table view#
You don't have to be a database expert to start using Supabase. Our table view makes Postgres as easy to use as a spreadsheet.

Relationships#
Dig into the relationships within your data.
Clone tables#
You can duplicate your tables, just like you would inside a spreadsheet.
The SQL editor#
Supabase comes with a SQL Editor. You can also save your favorite queries to run later!
Additional features#
Supabase extends Postgres with realtime functionality using our Realtime Server.
Every project is a full Postgres database, with postgres level access.
Supabase manages your database backups.
Import data directly from a CSV or excel spreadsheet.
Database backups do not include objects stored via the Storage API, as the database only includes metadata about these objects. Restoring an old backup does not restore objects that have been deleted since then.
Extensions#
To expand the functionality of your Postgres database, you can use extensions.
You can enable Postgres extensions with the click of a button within the Supabase dashboard.
Learn more about all the extensions provided on Supabase.
Terminology#
Postgres or PostgreSQL?#
PostgreSQL the database was derived from the POSTGRES Project, a package written at the University of California at Berkeley in 1986. This package included a query language called "PostQUEL".
In 1994, Postgres95 was built on top of POSTGRES code, adding an SQL language interpreter as a replacement for PostQUEL.
Eventually, Postgres95 was renamed to PostgreSQL to reflect the SQL query capability.
After this, many people referred to it as Postgres since it's less prone to confusion. Supabase is all about simplicity, so we also refer to it as Postgres.
Tips#
Read about resetting your database password here and changing the timezone of your server here.

Connect to your database
Supabase provides multiple methods to connect to your Postgres database, whether you’re working on the frontend, backend, or utilizing serverless functions.

How to connect to your Postgres databases#
How you connect to your database depends on where you're connecting from:
For frontend applications, use the Data API
For Postgres clients, use a connection string
For single sessions (for example, database GUIs) or Postgres native commands (for example, using client applications like pg_dump or specifying connections for replication) use the direct connection string if your environment supports IPv6
For persistent clients, and support for both IPv4 and IPv6, use Supavisor session mode
For temporary clients (for example, serverless or edge functions) use Supavisor transaction mode
Quickstarts#
Prisma
Drizzle
Postgres.js
pgAdmin
PSQL
DBeaver
Metabase
Beekeeper Studio
Data APIs and client libraries#
The Data APIs allow you to interact with your database using REST or GraphQL requests. You can use these APIs to fetch and insert data from the frontend, as long as you have RLS enabled.
REST
GraphQL
For convenience, you can also use the Supabase client libraries, which wrap the Data APIs with a developer-friendly interface and automatically handle authentication:
JavaScript
Flutter
Swift
Python
C#
Kotlin
Direct connection#
The direct connection string connects directly to your Postgres instance. It is ideal for persistent servers, such as virtual machines (VMs) and long-lasting containers. Examples include AWS EC2 machines, Fly.io VMs, and DigitalOcean Droplets.
Direct connections use IPv6 by default. If your environment doesn't support IPv6, use Supavisor session mode or get the IPv4 add-on.
The connection string looks like this:
postgresql://postgres:[YOUR-PASSWORD]@db.apbkobhfnmcqqzqeeqss.supabase.co:5432/postgres
Get your project's direct connection string from your project dashboard by clicking Connect.
Shared pooler#
Every Supabase project includes a free, shared connection pooler. This is ideal for persistent servers when IPv6 is not supported.
Supavisor session mode#
The session mode connection string connects to your Postgres instance via a proxy.
The connection string looks like this:
postgres://postgres.apbkobhfnmcqqzqeeqss:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
Get your project's Session pooler connection string from your project dashboard by clicking Connect.
Supavisor transaction mode#
The transaction mode connection string connects to your Postgres instance via a proxy which serves as a connection pooler. This is ideal for serverless or edge functions, which require many transient connections.
Transaction mode does not support prepared statements. To avoid errors, turn off prepared statements for your connection library.
The connection string looks like this:
postgres://postgres.apbkobhfnmcqqzqeeqss:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
Get your project's Transaction pooler connection string from your project dashboard by clicking Connect.
Dedicated pooler#
For paying customers, we provision a Dedicated Pooler (PgBouncer) that's co-located with your Postgres database. This will require you to connect with IPv6 or, if that's not an option, you can use the IPv4 add-on.
The Dedicated Pooler ensures best performance and latency, while using up more of your project's compute resources. If your network supports IPv6 or you have the IPv4 add-on, we encourage you to use the Dedicated Pooler over the Shared Pooler.
Get your project's Dedicated pooler connection string from your project dashboard by clicking Connect.
PgBouncer always runs in Transaction mode and the current version does not support prepared statement (will be added in a few weeks).
More about connection pooling#
Connection pooling improves database performance by reusing existing connections between queries. This reduces the overhead of establishing connections and improves scalability.
You can use an application-side pooler or a server-side pooler (Supabase automatically provides one called Supavisor), depending on whether your backend is persistent or serverless.
Application-side poolers#
Application-side poolers are built into connection libraries and API servers, such as Prisma, SQLAlchemy, and PostgREST. They maintain several active connections with Postgres or a server-side pooler, reducing the overhead of establishing connections between queries. When deploying to static architecture, such as long-standing containers or VMs, application-side poolers are satisfactory on their own.
Serverside poolers#
Postgres connections are like a WebSocket. Once established, they are preserved until the client (application server) disconnects. A server might only make a single 10 ms query, but needlessly reserve its database connection for seconds or longer.
Serverside-poolers, such as Supabase's Supavisor in transaction mode, sit between clients and the database and can be thought of as load balancers for Postgres connections.

Connecting to the database directly vs using a Connection Pooler
They maintain hot connections with the database and intelligently share them with clients only when needed, maximizing the amount of queries a single connection can service. They're best used to manage queries from auto-scaling systems, such as edge and serverless functions.
Connecting with SSL#
You should connect to your database using SSL wherever possible, to prevent snooping and man-in-the-middle attacks.
You can obtain your connection info and Server root certificate from your application's dashboard:

Resources#
Connection management
Connecting with psql
Importing data into Supabase
Troubleshooting and Postgres connection string FAQs#
Below are answers to common challenges and queries.
What is a “connection refused” error?#
A “Connection refused” error typically means your database isn’t reachable. Ensure your Supabase project is running, confirm your database’s connection string, check firewall settings, and validate network permissions.
What is the “FATAL: Password authentication failed” error?#
This error occurs when your credentials are incorrect. Double-check your username and password from the Supabase dashboard. If the problem persists, reset your database password from the project settings.
How do you connect using IPv4?#
Supabase’s default direct connection supports IPv6 only. To connect over IPv4, consider using the Supavisor session or transaction modes, or a connection pooler (shared or dedicated), which support both IPv4 and IPv6.
How do you choose a connection method?#
Direct connection: Persistent backend services (IPv6 only)
Supavisor session mode: Persistent backend needing IPv4
Supavisor transaction mode: Serverless functions
Shared pooler: General-purpose connections with IPv4 and IPv6
Dedicated pooler: High-performance apps requiring dedicated resources (paid tier)
Where is the Postgres connection string in Supabase?#
Your connection string is located in the Supabase Dashboard. Click the "Connect" button at the top of the page.
Can you use psql with a Supabase database?#
Yes. Use the following command structure, replacing your_connection_string with the string from your Supabase dashboard:
psql "your_connection_string"
Ensure you have psql installed locally before running this command.

Import data into Supabase

You can import data into Supabase in multiple ways. The best method depends on your data size and app requirements.
If you're working with small datasets in development, you can experiment quickly using CSV import in the Supabase dashboard. If you're working with a large dataset in production, you should plan your data import to minimize app latency and ensure data integrity.
How to import data into Supabase#
You have multiple options for importing your data into Supabase:
CSV import via the Supabase dashboard
Bulk import using pgloader
Using the Postgres COPY command
Using the Supabase API
If you're importing a large dataset or importing data into production, plan ahead and prepare your database.
Option 1: CSV import via Supabase dashboard#
Supabase dashboard provides a user-friendly way to import data. However, for very large datasets, this method may not be the most efficient choice, given the size limit is 100MB. It's generally better suited for smaller datasets and quick data imports. Consider using alternative methods like pgloader for large-scale data imports.
Navigate to the relevant table in the Table Editor.
Click on “Insert” then choose "Import Data from CSV" and follow the on-screen instructions to upload your CSV file.
Option 2: Bulk import using pgloader#
pgloader is a powerful tool for efficiently importing data into a Postgres database that supports a wide range of source database engines, including MySQL and MS SQL.
You can use it in conjunction with Supabase by following these steps:
Install pgloader on your local machine or a server. For more info, you can refer to the official pgloader installation page.
$ apt-get install pgloader
Create a configuration file that specifies the source data and the target Supabase database (e.g., config.load).
Here's an example configuration file:
LOAD DATABASE
   FROM sourcedb://USER:PASSWORD@HOST/SOURCE_DB
   INTO postgres://postgres.xxxx:password@xxxx.pooler.supabase.com:6543/postgres
ALTER SCHEMA 'public' OWNER TO 'postgres';
set wal_buffers = '64MB', max_wal_senders = 0, statement_timeout = 0, work_mem to '2GB';
Customize the source and Supabase database URL and options to fit your specific use case:
wal_buffers: This parameter is set to '64MB' to allocate 64 megabytes of memory for write-ahead logging buffers. A larger value can help improve write performance by caching more data in memory before writing it to disk. This can be useful during data import operations to speed up the writing of transaction logs.
max_wal_senders: It is set to 0, to disable replication connections. This is done during the data import process to prevent replication-related conflicts and issues.
statement_timeout: The value is set to 0, which means it's disabled, allowing SQL statements to run without a time limit.
work_mem: It is set to '2GB', allocating 2 GB of memory for query operations. This enhances the performance of complex queries by allowing larger in-memory datasets.
Run pgloader with the configuration file.
pgloader config.load
For databases using the Postgres engine, we recommend using the pg_dump and psql command line tools.
Option 3: Using Postgres copy command#
Read more about Bulk data loading.
Option 4: Using the Supabase API#
The Supabase API allows you to programmatically import data into your tables. You can use various client libraries to interact with the API and perform data import operations. This approach is useful when you need to automate data imports, and it gives you fine-grained control over the process. Refer to our API guide for more details.
When importing data via the Supabase API, it's advisable to refrain from bulk imports. This helps ensure a smooth data transfer process and prevents any potential disruptions.
Read more about Rate Limiting, Resource Allocation, & Abuse Prevention.
Preparing to import data#
Large data imports can affect your database performance. Failed imports can also cause data corruption. Importing data is a safe and common operation, but you should plan ahead if you're importing a lot of data, or if you're working in a production environment.
1. Back up your data#
Backups help you restore your data if something goes wrong. Databases on Pro, Team and Enterprise Plans are automatically backed up on schedule, but you can also take your own backup. See Database Backups for more information.
2. Increase statement timeouts#
By default, Supabase enforces query statement timeouts to ensure fair resource allocation and prevent long-running queries from affecting the overall system. When importing large datasets, you may encounter timeouts. To address this:
Increase the Statement Timeout: You can adjust the statement timeout for your session or connection to accommodate longer-running queries. Be cautious when doing this, as excessively long queries can negatively impact system performance. Read more about Statement Timeouts.
3. Estimate your required disk size#
Large datasets consume disk space. Ensure your Supabase project has sufficient disk capacity to accommodate the imported data. If you know how big your database is going to be, you can manually increase the size in your projects database settings.
Read more about disk management.
4. Disable triggers#
When importing large datasets, it's often beneficial to disable triggers temporarily. Triggers can significantly slow down the import process, especially if they involve complex logic or referential integrity checks. After the import, you can re-enable the triggers.
To disable triggers, use the following SQL commands:
-- Disable triggers on a specific table
ALTER TABLE table_name DISABLE TRIGGER ALL;
-- To re-enable triggers
ALTER TABLE table_name ENABLE TRIGGER ALL;
5. Rebuild indices after data import is complete#
Indexing is crucial for query performance, but building indices while importing a large dataset can be time-consuming. Consider building or rebuilding indices after the data import is complete. This approach can significantly speed up the import process and reduce the overall time required.
To build an index after the data import:
-- Create an index on a table
create index index_name on table_name (column_name);
Read more about Managing Indexes in Postgres.

Securing your data

Supabase helps you control access to your data. With access policies, you can protect sensitive data and make sure users only access what they're allowed to see.
Connecting your app securely#
Supabase allows you to access your database using the auto-generated Data APIs. This speeds up the process of building web apps, since you don't need to write your own backend services to pass database queries and results back and forth.
You can keep your data secure while accessing the Data APIs from the frontend, so long as you:
Turn on Row Level Security (RLS) for your tables
Use your Supabase anon key when you create a Supabase client
Your anon key is safe to expose with RLS enabled, because row access permission is checked against your access policies and the user's JSON Web Token (JWT). The JWT is automatically sent by the Supabase client libraries if the user is logged in using Supabase Auth.
Never expose your service role key on the frontend
Unlike your anon key, your service role key is never safe to expose because it bypasses RLS. Only use your service role key on the backend. Treat it as a secret (for example, import it as a sensitive environment variable instead of hardcoding it).
More information#
Supabase and Postgres provide you with multiple ways to manage security, including but not limited to Row Level Security. See the Access and Security pages for more information:
Row Level Security
Column Level Security
Hardening the Data API
Managing Postgres roles
Managing secrets with Vault


Securing your data

Supabase helps you control access to your data. With access policies, you can protect sensitive data and make sure users only access what they're allowed to see.
Connecting your app securely#
Supabase allows you to access your database using the auto-generated Data APIs. This speeds up the process of building web apps, since you don't need to write your own backend services to pass database queries and results back and forth.
You can keep your data secure while accessing the Data APIs from the frontend, so long as you:
Turn on Row Level Security (RLS) for your tables
Use your Supabase anon key when you create a Supabase client
Your anon key is safe to expose with RLS enabled, because row access permission is checked against your access policies and the user's JSON Web Token (JWT). The JWT is automatically sent by the Supabase client libraries if the user is logged in using Supabase Auth.
Never expose your service role key on the frontend
Unlike your anon key, your service role key is never safe to expose because it bypasses RLS. Only use your service role key on the backend. Treat it as a secret (for example, import it as a sensitive environment variable instead of hardcoding it).
More information#
Supabase and Postgres provide you with multiple ways to manage security, including but not limited to Row Level Security. See the Access and Security pages for more information:
Row Level Security
Column Level Security
Hardening the Data API
Managing Postgres roles
Managing secrets with Vault


Database


Working with your database (basics)


Managing tables, views, and data
Tables and Data

Tables are where you store your data.
Tables are similar to excel spreadsheets. They contain columns and rows.
For example, this table has 3 "columns" (id, name, description) and 4 "rows" of data:
id
name
description
1
The Phantom Menace
Two Jedi escape a hostile blockade to find allies and come across a young boy who may bring balance to the Force.
2
Attack of the Clones
Ten years after the invasion of Naboo, the Galactic Republic is facing a Separatist movement.
3
Revenge of the Sith
As Obi-Wan pursues a new threat, Anakin acts as a double agent between the Jedi Council and Palpatine and is lured into a sinister plan to rule the galaxy.
4
Star Wars
Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station.

There are a few important differences from a spreadsheet, but it's a good starting point if you're new to Relational databases.
Creating tables#
When creating a table, it's best practice to add columns at the same time.

You must define the "data type" of each column when it is created. You can add and remove columns at any time after creating a table.
Supabase provides several options for creating tables. You can use the Dashboard or create them directly using SQL.
We provide a SQL editor within the Dashboard, or you can connect to your database
and run the SQL queries yourself.
Dashboard
SQL
Go to the Table Editor page in the Dashboard.
Click New Table and create a table with the name todos.
Click Save.
Click New Column and create a column with the name task and type text.
Click Save.
When naming tables, use lowercase and underscores instead of spaces (e.g., table_name, not Table Name).
Columns#
You must define the "data type" when you create a column.
Data types#
Every column is a predefined type. Postgres provides many default types, and you can even design your own (or use extensions) if the default types don't fit your needs. You can use any data type that Postgres supports via the SQL editor. We only support a subset of these in the Table Editor in an effort to keep the experience simple for people with less experience with databases.
Show/Hide default data types










































































































































































































































































You can "cast" columns from one type to another, however there can be some incompatibilities between types.
For example, if you cast a timestamp to a date, you will lose all the time information that was previously saved.
Primary keys#
A table can have a "primary key" - a unique identifier for every row of data. A few tips for Primary Keys:
It's recommended to create a Primary Key for every table in your database.
You can use any column as a primary key, as long as it is unique for every row.
It's common to use a uuid type or a numbered identity column as your primary key.
create table movies (
 id bigint generated always as identity primary key
);
In the example above, we have:
created a column called id
assigned the data type bigint
instructed the database that this should be generated always as identity, which means that Postgres will automatically assign a unique number to this column.
Because it's unique, we can also use it as our primary key.
We could also use generated by default as identity, which would allow us to insert our own unique values.
create table movies (
 id bigint generated by default as identity primary key
);
Loading data#
There are several ways to load data in Supabase. You can load data directly into the database or using the APIs.
Use the "Bulk Loading" instructions if you are loading large data sets.
Basic data loading#
SQL
JavaScript
Dart
Swift
Python
Kotlin
insert into movies
 (name, description)
values
 (
   'The Empire Strikes Back',
   'After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda.'
 ),
 (
   'Return of the Jedi',
   'After a daring mission to rescue Han Solo from Jabba the Hutt, the Rebels dispatch to Endor to destroy the second Death Star.'
 );
Bulk data loading#
When inserting large data sets it's best to use PostgreSQL's COPY command.
This loads data directly from a file into a table. There are several file formats available for copying data: text, CSV, binary, JSON, etc.
For example, if you wanted to load a CSV file into your movies table:
"The Empire Strikes Back", "After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda."
"Return of the Jedi", "After a daring mission to rescue Han Solo from Jabba the Hutt, the Rebels dispatch to Endor to destroy the second Death Star."
You would connect to your database directly and load the file with the COPY command:
psql -h DATABASE_URL -p 5432 -d postgres -U postgres \
 -c "\COPY movies FROM './movies.csv';"
Additionally use the DELIMITER, HEADER and FORMAT options as defined in the Postgres COPY docs.
psql -h DATABASE_URL -p 5432 -d postgres -U postgres \
 -c "\COPY movies FROM './movies.csv' WITH DELIMITER ',' CSV HEADER"
If you receive an error FATAL: password authentication failed for user "postgres", reset your database password in the Database Settings and try again.
Joining tables with foreign keys#
Tables can be "joined" together using Foreign Keys.

This is where the "Relational" naming comes from, as data typically forms some sort of relationship.
In our "movies" example above, we might want to add a "category" for each movie (for example, "Action", or "Documentary").
Let's create a new table called categories and "link" our movies table.
create table categories (
 id bigint generated always as identity primary key,
 name text -- category name
);
alter table movies
 add column category_id bigint references categories;
You can also create "many-to-many" relationships by creating a "join" table.
For example if you had the following situations:
You have a list of movies.
A movie can have several actors.
An actor can perform in several movies.
Dashboard
SQL
Schemas#
Tables belong to schemas. Schemas are a way of organizing your tables, often for security reasons.

If you don't explicitly pass a schema when creating a table, Postgres will assume that you want to create the table in the public schema.
We can create schemas for organizing tables. For example, we might want a private schema which is hidden from our API:
create schema private;
Now we can create tables inside the private schema:
create table private.salaries (
 id bigint generated by default as identity primary key,
 salary bigint not null,
 actor_id bigint not null references public.actors
);
Views#
A View is a convenient shortcut to a query. Creating a view does not involve new tables or data. When run, an underlying query is executed, returning its results to the user.
Say we have the following tables from a database of a university:
students
id
name
type
1
Princess Leia
undergraduate
2
Yoda
graduate
3
Anakin Skywalker
graduate

courses
id
title
code
1
Introduction to Postgres
PG101
2
Authentication Theories
AUTH205
3
Fundamentals of Supabase
SUP412

grades
id
student_id
course_id
result
1
1
1
B+
2
1
3
A+
3
2
2
A
4
3
1
A-
5
3
2
A
6
3
3
B-

Creating a view consisting of all the three tables will look like this:
create view transcripts as
   select
       students.name,
       students.type,
       courses.title,
       courses.code,
       grades.result
   from grades
   left join students on grades.student_id = students.id
   left join courses on grades.course_id = courses.id;
grant all on table transcripts to authenticated;
Once done, we can now access the underlying query with:
select * from transcripts;
View security#
By default, views are accessed with their creator's permission ("security definer"). If a privileged role creates a view, others accessing it will use that role's elevated permissions. To enforce row level security policies, define the view with the "security invoker" modifier.
-- alter a security_definer view to be security_invoker
alter view <view name>
set (security_invoker = true);
-- create a view with the security_invoker modifier
create view <view name> with(security_invoker=true) as (
 select * from <some table>
);
When to use views#
Views provide the several benefits:
Simplicity
Consistency
Logical Organization
Security
Simplicity#
As a query becomes more complex, it can be a hassle to call it over and over - especially when we run it regularly. In the example above, instead of repeatedly running:
select
 students.name,
 students.type,
 courses.title,
 courses.code,
 grades.result
from
 grades
 left join students on grades.student_id = students.id
 left join courses on grades.course_id = courses.id;
We can run this instead:
select * from transcripts;
Additionally, a view behaves like a typical table. We can safely use it in table JOINs or even create new views using existing views.
Consistency#
Views ensure that the likelihood of mistakes decreases when repeatedly executing a query. In our example above, we may decide that we want to exclude the course Introduction to Postgres. The query would become:
select
 students.name,
 students.type,
 courses.title,
 courses.code,
 grades.result
from
 grades
 left join students on grades.student_id = students.id
 left join courses on grades.course_id = courses.id
where courses.code != 'PG101';
Without a view, we would need to go into every dependent query to add the new rule. This would increase in the likelihood of errors and inconsistencies, as well as introducing a lot of effort for a developer. With views, we can alter just the underlying query in the view transcripts. The change will be applied to all applications using this view.
Logical organization#
With views, we can give our query a name. This is extremely useful for teams working with the same database. Instead of guessing what a query is supposed to do, a well-named view can explain it. For example, by looking at the name of the view transcripts, we can infer that the underlying query might involve the students, courses, and grades tables.
Security#
Views can restrict the amount and type of data presented to a user. Instead of allowing a user direct access to a set of tables, we provide them a view instead. We can prevent them from reading sensitive columns by excluding them from the underlying query.
Materialized views#
A materialized view is a form of view but it also stores the results to disk. In subsequent reads of a materialized view, the time taken to return its results would be much faster than a conventional view. This is because the data is readily available for a materialized view while the conventional view executes the underlying query each time it is called.
Using our example above, a materialized view can be created like this:
create materialized view transcripts as
 select
   students.name,
   students.type,
   courses.title,
   courses.code,
   grades.result
 from
   grades
   left join students on grades.student_id = students.id
   left join courses on grades.course_id = courses.id;
Reading from the materialized view is the same as a conventional view:
select * from transcripts;
Refreshing materialized views#
Unfortunately, there is a trade-off - data in materialized views are not always up to date. We need to refresh it regularly to prevent the data from becoming too stale. To do so:
refresh materialized view transcripts;
It's up to you how regularly refresh your materialized views, and it's probably different for each view depending on its use-case.
Materialized views vs conventional views#
Materialized views are useful when execution times for queries or views are too slow. These could likely occur in views or queries involving multiple tables and billions of rows. When using such a view, however, there should be tolerance towards data being outdated. Some use-cases for materialized views are internal dashboards and analytics.
Creating a materialized view is not a solution to inefficient queries. You should always seek to optimize a slow running query even if you are implementing a materialized view.
Resources#
Official Docs: Create table
Official Docs: Create view
Postgres Tutorial: Create tables
Postgres Tutorial: Add column
Postgres Tutorial: Views


Working With Arrays

Postgres supports flexible array types. These arrays are also supported in the Supabase Dashboard and in the JavaScript API.
Create a table with an array column#
Create a test table with a text array (an array of strings):
Dashboard
SQL
Go to the Table editor page in the Dashboard.
Click New Table and create a table with the name arraytest.
Click Save.
Click New Column and create a column with the name textarray, type text, and select Define as array.
Click Save.
Insert a record with an array value#
Dashboard
SQL
JavaScript
Swift
Python
Go to the Table editor page in the Dashboard.
Select the arraytest table.
Click Insert row and add ["Harry", "Larry", "Moe"].
Click Save.
View the results#
Dashboard
SQL
Go to the Table editor page in the Dashboard.
Select the arraytest table.
You should see:
| id  | textarray               |
| --- | ----------------------- |
| 1   | ["Harry","Larry","Moe"] |
Query array data#
Postgres uses 1-based indexing (e.g., textarray[1] is the first item in the array).
SQL
JavaScript
Swift
To select the first item from the array and get the total length of the array:
SELECT textarray[1], array_length(textarray, 1) FROM arraytest;
returns:
| textarray | array_length |
| --------- | ------------ |
| Harry     | 3            |
Resources#
Supabase JS Client
Supabase - Get started for free
Postgres Arrays


Managing Indexes in PostgreSQL

An index makes your Postgres queries faster. The index is like a "table of contents" for your data - a reference list which allows queries to quickly locate a row in a given table without needing to scan the entire table (which in large tables can take a long time).
Indexes can be structured in a few different ways. The type of index chosen depends on the values you are indexing. By far the most common index type, and the default in Postgres, is the B-Tree. A B-Tree is the generalized form of a binary search tree, where nodes can have more than two children.
Even though indexes improve query performance, the Postgres query planner may not always make use of a given index when choosing which optimizations to make. Additionally indexes come with some overhead - additional writes and increased storage - so it's useful to understand how and when to use indexes, if at all.
Create an index#
Let's take an example table:
create table persons (
 id bigint generated by default as identity primary key,
 age int,
 height int,
 weight int,
 name text,
 deceased boolean
);
All the queries in this guide can be run using the SQL Editor in the Supabase Dashboard, or via psql if you're connecting directly to the database.
We might want to frequently query users based on their age:
select name from persons where age = 32;
Without an index, Postgres will scan every row in the table to find equality matches on age.
You can verify this by doing an explain on the query:
explain select name from persons where age = 32;
Outputs:
Seq Scan on persons  (cost=0.00..22.75 rows=x width=y)
Filter: (age = 32)
To add a simple B-Tree index you can run:
create index idx_persons_age on persons (age);
It can take a long time to build indexes on large datasets and the default behaviour of create index is to lock the table from writes.
Luckily Postgres provides us with create index concurrently which prevents blocking writes on the table, but does take a bit longer to build.
Here is a simplified diagram of the index we just created (note that in practice, nodes actually have more than two children).

You can see that in any large data set, traversing the index to locate a given value can be done in much less operations (O(log n)) than compared to scanning the table one value at a time from top to bottom (O(n)).
Partial indexes#
If you are frequently querying a subset of rows then it may be more efficient to build a partial index. In our example, perhaps we only want to match on age where deceased is false. We could build a partial index:
create index idx_living_persons_age on persons (age)
where deceased is false;
Ordering indexes#
By default B-Tree indexes are sorted in ascending order, but sometimes you may want to provide a different ordering. Perhaps our application has a page featuring the top 10 oldest people. Here we would want to sort in descending order, and include NULL values last. For this we can use:
create index idx_persons_age_desc on persons (age desc nulls last);
Reindexing#
After a while indexes can become stale and may need rebuilding. Postgres provides a reindex command for this, but due to Postgres locks being placed on the index during this process, you may want to make use of the concurrent keyword.
reindex index concurrently idx_persons_age;
Alternatively you can reindex all indexes on a particular table:
reindex table concurrently persons;
Take note that reindex can be used inside a transaction, but reindex [index/table] concurrently cannot.
Index Advisor#
Indexes can improve query performance of your tables as they grow. The Supabase Dashboard offers an Index Advisor, which suggests potential indexes to add to your tables.
For more information on the Index Advisor and its suggestions, see the index_advisor extension.
To use the Dashboard Index Advisor:
Go to the Query Performance page.
Click on a query to bring up the Details side panel.
Select the Indexes tab.
Enable Index Advisor if prompted.
Understanding Index Advisor results#
The Indexes tab shows the existing indexes used in the selected query. Note that indexes suggested in the "New Index Recommendations" section may not be used when you create them. Postgres' query planner may intentionally ignore an available index if it determines that the query will be faster without. For example, on a small table, a sequential scan might be faster than an index scan. In that case, the planner will switch to using the index as the table size grows, helping to future proof the query.
If additional indexes might improve your query, the Index Advisor shows the suggested indexes with the estimated improvement in startup and total costs:
Startup cost is the cost to fetch the first row
Total cost is the cost to fetch all the rows
Costs are in arbitrary units, where a single sequential page read costs 1.0 units.

Querying Joins and Nested tables

The data APIs automatically detect relationships between Postgres tables. Since Postgres is a relational database, this is a very common scenario.
One-to-many joins#
Let's use an example database that stores orchestral_sections and instruments:
Tables
SQL
Orchestral sections
id
name
1
strings
2
woodwinds

Instruments
id
name
section_id
1
violin
1
2
viola
1
3
flute
2
4
oboe
2

The APIs will automatically detect relationships based on the foreign keys:
JavaScript
Dart
Swift
Kotlin
Python
GraphQL
URL
const { data, error } = await supabase.from('orchestral_sections').select(`
 id,
 name,
 instruments ( id, name )
`)
TypeScript types for joins#
supabase-js always returns a data object (for success), and an error object (for unsuccessful requests).
These helper types provide the result types from any query, including nested types for database joins.
Given the following schema with a relation between orchestral sections and instruments:
create table orchestral_sections (
 "id" serial primary key,
 "name" text
);
create table instruments (
 "id" serial primary key,
 "name" text,
 "section_id" int references "orchestral_sections"
);
We can get the nested SectionsWithInstruments type like this:
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'
const sectionsWithInstrumentsQuery = supabase.from('orchestral_sections').select(`
 id,
 name,
 instruments (
   id,
   name
 )
`)
type SectionsWithInstruments = QueryData<typeof sectionsWithInstrumentsQuery>
const { data, error } = await sectionsWithInstrumentsQuery
if (error) throw error
const sectionsWithInstruments: SectionsWithInstruments = data
Many-to-many joins#
The data APIs will detect many-to-many joins. For example, if you have a database which stored teams of users (where each user could belong to many teams):
create table users (
 "id" serial primary key,
 "name" text
);
create table teams (
 "id" serial primary key,
 "team_name" text
);
create table members (
 "user_id" int references users,
 "team_id" int references teams,
 primary key (user_id, team_id)
);
In these cases you don't need to explicitly define the joining table (members). If we wanted to fetch all the teams and the members in each team:
JavaScript
Dart
Swift
Kotlin
Python
GraphQL
URL
const { data, error } = await supabase.from('teams').select(`
 id,
 team_name,
 users ( id, name )
`)
Specifying the ON clause for joins with multiple foreign keys#
For example, if you have a project that tracks when employees check in and out of work shifts:
-- Employees
create table users (
 "id" serial primary key,
 "name" text
);
-- Badge scans
create table scans (
 "id" serial primary key,
 "user_id" int references users,
 "badge_scan_time" timestamp
);
-- Work shifts
create table shifts (
 "id" serial primary key,
 "user_id" int references users,
 "scan_id_start" int references scans, -- clocking in
 "scan_id_end" int references scans, -- clocking out
 "attendance_status" text
);
In this case, you need to explicitly define the join because the joining column on shifts is ambiguous as they are both referencing the scans table.
To fetch all the shifts with scan_id_start and scan_id_end related to a specific scan, use the following syntax:
JavaScript
Dart
Swift
Kotlin
Python
GraphQL
const { data, error } = await supabase.from('shifts').select(
 `
   *,
   start_scan:scans!scan_id_start (
     id,
     user_id,
     badge_scan_time
   ),
  end_scan:scans!scan_id_end (
    id,
    user_id,
    badge_scan_time
   )
 `
)

Managing JSON and unstructured data
Using the JSON data type in Postgres.

Postgres supports storing and querying unstructured data.
JSON vs JSONB#
Postgres supports two types of JSON columns: json (stored as a string) and jsonb (stored as a binary). The recommended type is jsonb for almost all cases.
json stores an exact copy of the input text. Database functions must reparse the content on each execution.
jsonb stores database in a decomposed binary format. While this makes it slightly slower to input due to added conversion overhead, it is significantly faster to process, since no reparsing is needed.
When to use JSON/JSONB#
Generally you should use a jsonb column when you have data that is unstructured or has a variable schema. For example, if you wanted to store responses for various webhooks, you might not know the format of the response when creating the table. Instead, you could store the payload as a jsonb object in a single column.
Don't go overboard with json/jsonb columns. They are a useful tool, but most of the benefits of a relational database come from the ability to query and join structured data, and the referential integrity that brings.
Create JSONB columns#
json/jsonb is just another "data type" for Postgres columns. You can create a jsonb column in the same way you would create a text or int column:
SQL
Dashboard
create table books (
 id serial primary key,
 title text,
 author text,
 metadata jsonb
);
Inserting JSON data#
You can insert JSON data in the same way that you insert any other data. The data must be valid JSON.
SQL
Dashboard
JavaScript
Dart
Swift
Kotlin
Python
insert into books
 (title, author, metadata)
values
 (
   'The Poky Little Puppy',
   'Janette Sebring Lowrey',
   '{"description":"Puppy is slower than other, bigger animals.","price":5.95,"ages":[3,6]}'
 ),
 (
   'The Tale of Peter Rabbit',
   'Beatrix Potter',
   '{"description":"Rabbit eats some vegetables.","price":4.49,"ages":[2,5]}'
 ),
 (
   'Tootle',
   'Gertrude Crampton',
   '{"description":"Little toy train has big dreams.","price":3.99,"ages":[2,5]}'
 ),
 (
   'Green Eggs and Ham',
   'Dr. Seuss',
   '{"description":"Sam has changing food preferences and eats unusually colored food.","price":7.49,"ages":[4,8]}'
 ),
 (
   'Harry Potter and the Goblet of Fire',
   'J.K. Rowling',
   '{"description":"Fourth year of school starts, big drama ensues.","price":24.95,"ages":[10,99]}'
 );
Query JSON data#
Querying JSON data is similar to querying other data, with a few other features to access nested values.
Postgres support a range of JSON functions and operators. For example, the -> operator returns values as jsonb data. If you want the data returned as text, use the ->> operator.
SQL
JavaScript
Swift
Kotlin
Python
Result
select
 title,
 metadata ->> 'description' as description, -- returned as text
 metadata -> 'price' as price,
 metadata -> 'ages' -> 0 as low_age,
 metadata -> 'ages' -> 1 as high_age
from books;
Validating JSON data#
Supabase provides the pg_jsonschema extension that adds the ability to validate json and jsonb data types against JSON Schema documents.
Once you have enabled the extension, you can add a "check constraint" to your table to validate the JSON data:
create table customers (
 id serial primary key,
 metadata json
);
alter table customers
add constraint check_metadata check (
 json_matches_schema(
   '{
       "type": "object",
       "properties": {
           "tags": {
               "type": "array",
               "items": {
                   "type": "string",
                   "maxLength": 16
               }
           }
       }
   }',
   metadata
 )
);
Resources#
Postgres: JSON Functions and Operators
Postgres JSON types


Cascade Deletes

There are 5 options for foreign key constraint deletes:
CASCADE: When a row is deleted from the parent table, all related rows in the child tables are deleted as well.
RESTRICT: When a row is deleted from the parent table, the delete operation is aborted if there are any related rows in the child tables.
SET NULL: When a row is deleted from the parent table, the values of the foreign key columns in the child tables are set to NULL.
SET DEFAULT: When a row is deleted from the parent table, the values of the foreign key columns in the child tables are set to their default values.
NO ACTION: This option is similar to RESTRICT, but it also has the option to be “deferred” to the end of a transaction. This means that other cascading deletes can run first, and then this delete constraint will only throw an error if there is referenced data remaining at the end of the transaction.
These options can be specified when defining a foreign key constraint using the "ON DELETE" clause. For example, the following SQL statement creates a foreign key constraint with the CASCADE option:
alter table child_table
add constraint fk_parent foreign key (parent_id) references parent_table (id)
 on delete cascade;
This means that when a row is deleted from the parent_table, all related rows in the child_table will be deleted as well.
RESTRICT vs NO ACTION#
The difference between NO ACTION and RESTRICT is subtle and can be a bit confusing.
Both NO ACTION and RESTRICT are used to prevent deletion of a row in a parent table if there are related rows in a child table. However, there is a subtle difference in how they behave.
When a foreign key constraint is defined with the option RESTRICT, it means that if a row in the parent table is deleted, the database will immediately raise an error and prevent the deletion of the row in the parent table. The database will not delete, update or set to NULL any rows in the referenced tables.
When a foreign key constraint is defined with the option NO ACTION, it means that if a row in the parent table is deleted, the database will also raise an error and prevent the deletion of the row in the parent table. However unlike RESTRICT, NO ACTION has the option defer the check using INITIALLY DEFERRED. This will only raise the above error if the referenced rows still exist at the end of the transaction.
The difference from RESTRICT is that a constraint marked as NO ACTION INITIALLY DEFERRED is deferred until the end of the transaction, rather than running immediately. If, for example there is another foreign key constraint between the same tables marked as CASCADE, the cascade will occur first and delete the referenced rows, and no error will be thrown by the deferred constraint. Otherwise if there are still rows referencing the parent row by the end of the transaction, an error will be raised just like before. Just like RESTRICT, the database will not delete, update or set to NULL any rows in the referenced tables.
In practice, you can use either NO ACTION or RESTRICT depending on your needs. NO ACTION is the default behavior if you do not specify anything. If you prefer to defer the check until the end of the transaction, use NO ACTION INITIALLY DEFERRED.
Example#
Let's further illustrate the difference with an example. We'll use the following data:
grandparent
id
name
1
Elizabeth

parent
id
name
parent_id
1
Charles
1
2
Diana
1

child
id
name
father
mother
1
William
1
2

To create these tables and their data, we run:
create table grandparent (
 id serial primary key,
 name text
);
create table parent (
 id serial primary key,
 name text,
 parent_id integer references grandparent (id)
   on delete cascade
);
create table child (
 id serial primary key,
 name text,
 father integer references parent (id)
   on delete restrict
);
insert into grandparent
 (id, name)
values
 (1, 'Elizabeth');
insert into parent
 (id, name, parent_id)
values
 (1, 'Charles', 1);
insert into parent
 (id, name, parent_id)
values
 (2, 'Diana', 1);
-- We'll just link the father for now
insert into child
 (id, name, father)
values
 (1, 'William', 1);
RESTRICT#
RESTRICT will prevent a delete and raise an error:
postgres=# delete from grandparent;
ERROR: update or delete on table "parent" violates foreign key constraint "child_father_fkey" on table "child"
DETAIL: Key (id)=(1) is still referenced from table "child".
Even though the foreign key constraint between parent and grandparent is CASCADE, the constraint between child and father is RESTRICT. Therefore an error is raised and no records are deleted.
NO ACTION#
Let's change the child-father relationship to NO ACTION:
alter table child
drop constraint child_father_fkey;
alter table child
add constraint child_father_fkey foreign key (father) references parent (id)
 on delete no action;
We see that NO ACTION will also prevent a delete and raise an error:
postgres=# delete from grandparent;
ERROR: update or delete on table "parent" violates foreign key constraint "child_father_fkey" on table "child"
DETAIL: Key (id)=(1) is still referenced from table "child".
NO ACTION INITIALLY DEFERRED#
We'll change the foreign key constraint between child and father to be NO ACTION INITIALLY DEFERRED:
alter table child
drop constraint child_father_fkey;
alter table child
add constraint child_father_fkey foreign key (father) references parent (id)
 on delete no action initially deferred;
Here you will see that INITIALLY DEFFERED seems to operate like NO ACTION or RESTRICT. When we run a delete, it seems to make no difference:
postgres=# delete from grandparent;
ERROR: update or delete on table "parent" violates foreign key constraint "child_father_fkey" on table "child"
DETAIL: Key (id)=(1) is still referenced from table "child".
But, when we combine it with other constraints, then any other constraints take precedence. For example, let's run the same but add a mother column that has a CASCADE delete:
alter table child
add column mother integer references parent (id)
 on delete cascade;
update child
set mother = 2
where id = 1;
Then let's run a delete on the grandparent table:
postgres=# delete from grandparent;
DELETE 1
postgres=# select * from parent;
id | name | parent_id
----+------+-----------
(0 rows)
postgres=# select * from child;
id | name | father | mother
----+------+--------+--------
(0 rows)
The mother deletion took precedence over the father, and so William was deleted. After William was deleted, there was no reference to “Charles” and so he was free to be deleted, even though previously he wasn't (without INITIALLY DEFERRED).

Managing Enums in Postgres

Enums in Postgres are a custom data type. They allow you to define a set of values (or labels) that a column can hold. They are useful when you have a fixed set of possible values for a column.
Creating enums#
You can define a Postgres Enum using the create type statement. Here's an example:
create type mood as enum (
 'happy',
 'sad',
 'excited',
 'calm'
);
In this example, we've created an Enum called "mood" with four possible values.
When to use enums#
There is a lot of overlap between Enums and foreign keys. Both can be used to define a set of values for a column. However, there are some advantages to using Enums:
Performance: You can query a single table instead of finding the value from a lookup table.
Simplicity: Generally the SQL is easier to read and write.
There are also some disadvantages to using Enums:
Limited Flexibility: Adding and removing values requires modifying the database schema (i.e.: using migrations) rather than adding data to a table.
Maintenance Overhead: Enum types require ongoing maintenance. If your application's requirements change frequently, maintaining enums can become burdensome.
In general you should only use Enums when the list of values is small, fixed, and unlikely to change often. Things like "a list of continents" or "a list of departments" are good candidates for Enums.
Using enums in tables#
To use the Enum in a table, you can define a column with the Enum type. For example:
create table person (
 id serial primary key,
 name text,
 current_mood mood
);
Here, the current_mood column can only have values from the "mood" Enum.
Inserting data with enums#
You can insert data into a table with Enum columns by specifying one of the Enum values:
insert into person
 (name, current_mood)
values
 ('Alice', 'happy');
Querying data with enums#
When querying data, you can filter and compare Enum values as usual:
select *
from person
where current_mood = 'sad';
Managing enums#
You can manage your Enums using the alter type statement. Here are some examples:
Updating enum values#
You can update the value of an Enum column:
update person
set current_mood = 'excited'
where name = 'Alice';
Adding enum values#
To add new values to an existing Postgres Enum, you can use the ALTER TYPE statement. Here's how you can do it:
Let's say you have an existing Enum called mood, and you want to add a new value, content:
alter type mood add value 'content';
Removing enum values#
Even though it is possible, it is unsafe to remove enum values once they have been created. It's better to leave the enum value in place.
Read the Postgres mailing list for more information:
There is no ALTER TYPE DELETE VALUE in Postgres. Even if you delete every occurrence of an Enum value within a table (and vacuumed away those rows), the target value could still exist in upper index pages. If you delete the pg_enum entry you'll break the index.
Getting a list of enum values#
Check your existing Enum values by querying the enum_range function:
select enum_range(null::mood);
Resources#
Official Postgres Docs: Enumerated Types


Database Functions

Postgres has built-in support for SQL functions.
These functions live inside your database, and they can be used with the API.
Quick demo#
Getting started#
Supabase provides several options for creating database functions. You can use the Dashboard or create them directly using SQL.
We provide a SQL editor within the Dashboard, or you can connect to your database
and run the SQL queries yourself.
Go to the "SQL editor" section.
Click "New Query".
Enter the SQL to create or replace your Database function.
Click "Run" or cmd+enter (ctrl+enter).
Simple functions#
Let's create a basic Database Function which returns a string "hello world".
create or replace function hello_world() -- 1
returns text -- 2
language sql -- 3
as $$  -- 4
 select 'hello world';  -- 5
$$; --6
Show/Hide Details













When naming your functions, make the name of the function unique as overloaded functions are not supported.
After the Function is created, we have several ways of "executing" the function - either directly inside the database using SQL, or with one of the client libraries.
SQL
JavaScript
Dart
Swift
Kotlin
Python
select hello_world();
Returning data sets#
Database Functions can also return data sets from Tables or Views.
For example, if we had a database with some Star Wars data inside:
Data
SQL
Planets
| id  | name     |
| --- | -------- |
| 1   | Tatooine |
| 2   | Alderaan |
| 3   | Kashyyyk |
People
| id  | name             | planet_id |
| --- | ---------------- | --------- |
| 1   | Anakin Skywalker | 1         |
| 2   | Luke Skywalker   | 1         |
| 3   | Princess Leia    | 2         |
| 4   | Chewbacca        | 3         |
We could create a function which returns all the planets:
create or replace function get_planets()
returns setof planets
language sql
as $$
 select * from planets;
$$;
Because this function returns a table set, we can also apply filters and selectors. For example, if we only wanted the first planet:
SQL
JavaScript
Dart
Swift
Kotlin
Python
select *
from get_planets()
where id = 1;
Passing parameters#
Let's create a Function to insert a new planet into the planets table and return the new ID. Note that this time we're using the plpgsql language.
create or replace function add_planet(name text)
returns bigint
language plpgsql
as $$
declare
 new_row bigint;
begin
 insert into planets(name)
 values (add_planet.name)
 returning id into new_row;
 return new_row;
end;
$$;
Once again, you can execute this function either inside your database using a select query, or with the client libraries:
SQL
JavaScript
Dart
Swift
Kotlin
Python
select * from add_planet('Jakku');
Suggestions#
Database Functions vs Edge Functions#
For data-intensive operations, use Database Functions, which are executed within your database
and can be called remotely using the REST and GraphQL API.
For use-cases which require low-latency, use Edge Functions, which are globally-distributed and can be written in Typescript.
Security definer vs invoker#
Postgres allows you to specify whether you want the function to be executed as the user calling the function (invoker), or as the creator of the function (definer). For example:
create function hello_world()
returns text
language plpgsql
security definer set search_path = ''
as $$
begin
 select 'hello world';
end;
$$;
It is best practice to use security invoker (which is also the default). If you ever use security definer, you must set the search_path.
If you use an empty search path (search_path = ''), you must explicitly state the schema for every relation in the function body (e.g. from public.table).
This limits the potential damage if you allow access to schemas which the user executing the function should not have.
Function privileges#
By default, database functions can be executed by any role. There are two main ways to restrict this:
On a case-by-case basis. Specifically revoke permissions for functions you want to protect. Execution needs to be revoked for both public and the role you're restricting:
revoke execute on function public.hello_world from public;
revoke execute on function public.hello_world from anon;
Restrict function execution by default. Specifically grant access when you want a function to be executable by a specific role.
To restrict all existing functions, revoke execution permissions from both public and the role you want to restrict:
revoke execute on all functions in schema public from public;
revoke execute on all functions in schema public from anon, authenticated;
To restrict all new functions, change the default privileges for both public and the role you want to restrict:
alter default privileges in schema public revoke execute on functions from public;
alter default privileges in schema public revoke execute on functions from anon, authenticated;
You can then regrant permissions for a specific function to a specific role:
grant execute on function public.hello_world to authenticated;
Debugging functions#
You can add logs to help you debug functions. This is especially recommended for complex functions.
Good targets to log include:
Values of (non-sensitive) variables
Returned results from queries
General logging#
To create custom logs in the Dashboard's Postgres Logs, you can use the raise keyword. By default, there are 3 observed severity levels:
log
warning
exception (error level)
create function logging_example(
 log_message text,
 warning_message text,
 error_message text
)
returns void
language plpgsql
as $$
begin
 raise log 'logging message: %', log_message;
 raise warning 'logging warning: %', warning_message;
 -- immediately ends function and reverts transaction
 raise exception 'logging error: %', error_message;
end;
$$;
select logging_example('LOGGED MESSAGE', 'WARNING MESSAGE', 'ERROR MESSAGE');
Error handling#
You can create custom errors with the raise exception keywords.
A common pattern is to throw an error when a variable doesn't meet a condition:
create or replace function error_if_null(some_val text)
returns text
language plpgsql
as $$
begin
 -- error if some_val is null
 if some_val is null then
   raise exception 'some_val should not be NULL';
 end if;
 -- return some_val if it is not null
 return some_val;
end;
$$;
select error_if_null(null);
Value checking is common, so Postgres provides a shorthand: the assert keyword. It uses the following format:
-- throw error when condition is false
assert <some condition>, 'message';
Below is an example
create function assert_example(name text)
returns uuid
language plpgsql
as $$
declare
 student_id uuid;
begin
 -- save a user's id into the user_id variable
 select
   id into student_id
 from attendance_table
 where student = name;
 -- throw an error if the student_id is null
 assert student_id is not null, 'assert_example() ERROR: student not found';
 -- otherwise, return the user's id
 return student_id;
end;
$$;
select assert_example('Harry Potter');
Error messages can also be captured and modified with the exception keyword:
create function error_example()
returns void
language plpgsql
as $$
begin
 -- fails: cannot read from nonexistent table
 select * from table_that_does_not_exist;
 exception
     when others then
         raise exception 'An error occurred in function <function name>: %', sqlerrm;
end;
$$;
Advanced logging#
For more complex functions or complicated debugging, try logging:
Formatted variables
Individual rows
Start and end of function calls
create or replace function advanced_example(num int default 10)
returns text
language plpgsql
as $$
declare
   var1 int := 20;
   var2 text;
begin
   -- Logging start of function
   raise log 'logging start of function call: (%)', (select now());
   -- Logging a variable from a SELECT query
   select
     col_1 into var1
   from some_table
   limit 1;
   raise log 'logging a variable (%)', var1;
   -- It is also possible to avoid using variables, by returning the values of your query to the log
   raise log 'logging a query with a single return value(%)', (select col_1 from some_table limit 1);
   -- If necessary, you can even log an entire row as JSON
   raise log 'logging an entire row as JSON (%)', (select to_jsonb(some_table.*) from some_table limit 1);
   -- When using INSERT or UPDATE, the new value(s) can be returned
   -- into a variable.
   -- When using DELETE, the deleted value(s) can be returned.
   -- All three operations use "RETURNING value(s) INTO variable(s)" syntax
   insert into some_table (col_2)
   values ('new val')
   returning col_2 into var2;
   raise log 'logging a value from an INSERT (%)', var2;
   return var1 || ',' || var2;
exception
   -- Handle exceptions here if needed
   when others then
       raise exception 'An error occurred in function <advanced_example>: %', sqlerrm;
end;
$$;
select advanced_example();
Resources#
Official Client libraries: JavaScript and Flutter
Community client libraries: github.com/supabase-community
Postgres Official Docs: Chapter 9. Functions and Operators
Postgres Reference: CREATE FUNCTION
Deep dive#
Create Database Functions#
Call Database Functions using JavaScript#
Using Database Functions to call an external API#
Database Webhooks
Trigger external payloads on database events.

Database Webhooks allow you to send real-time data from your database to another system whenever a table event occurs.
You can hook into three table events: INSERT, UPDATE, and DELETE. All events are fired after a database row is changed.
Webhooks vs triggers#
Database Webhooks are very similar to triggers, and that's because Database Webhooks are just a convenience wrapper around triggers using the pg_net extension. This extension is asynchronous, and therefore will not block your database changes for long-running network requests.
This video demonstrates how you can create a new customer in Stripe each time a row is inserted into a profiles table:
Creating a webhook#
Create a new Database Webhook in the Dashboard.
Give your Webhook a name.
Select the table you want to hook into.
Select one or more events (table inserts, updates, or deletes) you want to hook into.
Since webhooks are just database triggers, you can also create one from SQL statement directly.
create trigger "my_webhook" after insert
on "public"."my_table" for each row
execute function "supabase_functions"."http_request"(
 'http://host.docker.internal:3000',
 'POST',
 '{"Content-Type":"application/json"}',
 '{}',
 '1000'
);
We currently support HTTP webhooks. These can be sent as POST or GET requests with a JSON payload.
Payload#
The payload is automatically generated from the underlying table record:
type InsertPayload = {
 type: 'INSERT'
 table: string
 schema: string
 record: TableRecord<T>
 old_record: null
}
type UpdatePayload = {
 type: 'UPDATE'
 table: string
 schema: string
 record: TableRecord<T>
 old_record: TableRecord<T>
}
type DeletePayload = {
 type: 'DELETE'
 table: string
 schema: string
 record: null
 old_record: TableRecord<T>
}
Monitoring#
Logging history of webhook calls is available under the net schema of your database. For more info, see the GitHub Repo.
Local development#
When using Database Webhooks on your local Supabase instance, you need to be aware that the Postgres database runs inside a Docker container. This means that localhost or 127.0.0.1 in your webhook URL will refer to the container itself, not your host machine where your application is running.
To target services running on your host machine, use host.docker.internal. If that doesn't work, you may need to use your machine's local IP address instead.
For example, if you want to trigger an edge function when a webhook fires, your webhook URL would be:
http://host.docker.internal:54321/functions/v1/my-function-name
If you're experiencing connection issues with webhooks locally, verify you're using the correct hostname instead of localhost.
Resources#
pg_net: an async networking extension for Postgres


Full Text Search
How to use full text search in PostgreSQL.

Postgres has built-in functions to handle Full Text Search queries. This is like a "search engine" within Postgres.
Preparation#
For this guide we'll use the following example data:
Data
SQL
id
title
author
description
1
The Poky Little Puppy
Janette Sebring Lowrey
Puppy is slower than other, bigger animals.
2
The Tale of Peter Rabbit
Beatrix Potter
Rabbit eats some vegetables.
3
Tootle
Gertrude Crampton
Little toy train has big dreams.
4
Green Eggs and Ham
Dr. Seuss
Sam has changing food preferences and eats unusually colored food.
5
Harry Potter and the Goblet of Fire
J.K. Rowling
Fourth year of school starts, big drama ensues.

Usage#
The functions we'll cover in this guide are:
to_tsvector()#
Converts your data into searchable tokens. to_tsvector() stands for "to text search vector." For example:
select to_tsvector('green eggs and ham');
-- Returns 'egg':2 'green':1 'ham':4
Collectively these tokens are called a "document" which Postgres can use for comparisons.
to_tsquery()#
Converts a query string into tokens to match. to_tsquery() stands for "to text search query."
This conversion step is important because we will want to "fuzzy match" on keywords.
For example if a user searches for eggs, and a column has the value egg, we probably still want to return a match.
Match: @@#
The @@ symbol is the "match" symbol for Full Text Search. It returns any matches between a to_tsvector result and a to_tsquery result.
Take the following example:
SQL
JavaScript
Dart
Swift
Kotlin
Python
select *
from books
where title = 'Harry';
The equality symbol above (=) is very "strict" on what it matches. In a full text search context, we might want to find all "Harry Potter" books and so we can rewrite the
example above:
SQL
JavaScript
Dart
Swift
Kotlin
select *
from books
where to_tsvector(title) @@ to_tsquery('Harry');
Basic full text queries#
Search a single column#
To find all books where the description contain the word big:
SQL
JavaScript
Dart
Swift
Kotlin
Python
Data
select
 *
from
 books
where
 to_tsvector(description)
 @@ to_tsquery('big');
Search multiple columns#
Right now there is no direct way to use JavaScript or Dart to search through multiple columns but you can do it by creating computed columns on the database.
To find all books where description or title contain the word little:
SQL
JavaScript
Dart
Swift
Kotlin
Python
Data
select
 *
from
 books
where
 to_tsvector(description || ' ' || title) -- concat columns, but be sure to include a space to separate them!
 @@ to_tsquery('little');
Match all search words#
To find all books where description contains BOTH of the words little and big, we can use the & symbol:
SQL
JavaScript
Dart
Swift
Kotlin
Python
Data
select
 *
from
 books
where
 to_tsvector(description)
 @@ to_tsquery('little & big'); -- use & for AND in the search query
Match any search words#
To find all books where description contain ANY of the words little or big, use the | symbol:
SQL
JavaScript
Dart
Swift
Kotlin
Python
Data
select
 *
from
 books
where
 to_tsvector(description)
 @@ to_tsquery('little | big'); -- use | for OR in the search query
Notice how searching for big includes results with the word bigger (or biggest, etc).
Partial search#
Partial search is particularly useful when you want to find matches on substrings within your data.
Implementing partial search#
You can use the :* syntax with to_tsquery(). Here's an example that searches for any book titles beginning with "Lit":
select title from books where to_tsvector(title) @@ to_tsquery('Lit:*');
Extending functionality with RPC#
To make the partial search functionality accessible through the API, you can wrap the search logic in a stored procedure.
After creating this function, you can invoke it from your application using the SDK for your platform. Here's an example:
SQL
JavaScript
Dart
Swift
Kotlin
Python
create or replace function search_books_by_title_prefix(prefix text)
returns setof books AS $$
begin
 return query
 select * from books where to_tsvector('english', title) @@ to_tsquery(prefix || ':*');
end;
$$ language plpgsql;
This function takes a prefix parameter and returns all books where the title contains a word starting with that prefix. The :* operator is used to denote a prefix match in the to_tsquery() function.
Handling spaces in queries#
When you want the search term to include a phrase or multiple words, you can concatenate words using a + as a placeholder for space:
select * from search_books_by_title_prefix('Little+Puppy');
Creating indexes#
Now that we have Full Text Search working, let's create an index. This will allow Postgres to "build" the documents preemptively so that they
don't need to be created at the time we execute the query. This will make our queries much faster.
Searchable columns#
Let's create a new column fts inside the books table to store the searchable index of the title and description columns.
We can use a special feature of Postgres called
Generated Columns
to ensure that the index is updated any time the values in the title and description columns change.
SQL
Data
alter table
 books
add column
 fts tsvector generated always as (to_tsvector('english', description || ' ' || title)) stored;
create index books_fts on books using gin (fts); -- generate the index
select id, fts
from books;
Search using the new column#
Now that we've created and populated our index, we can search it using the same techniques as before:
SQL
JavaScript
Dart
Swift
Kotlin
Python
Data
select
 *
from
 books
where
 fts @@ to_tsquery('little & big');
Query operators#
Visit Postgres: Text Search Functions and Operators
to learn about additional query operators you can use to do more advanced full text queries, such as:
Proximity: <->#
The proximity symbol is useful for searching for terms that are a certain "distance" apart.
For example, to find the phrase big dreams, where the a match for "big" is followed immediately by a match for "dreams":
SQL
JavaScript
Dart
Swift
Kotlin
Python
select
 *
from
 books
where
 to_tsvector(description) @@ to_tsquery('big <-> dreams');
We can also use the <-> to find words within a certain distance of each other. For example to find year and school within 2 words of each other:
SQL
JavaScript
Dart
Swift
Kotlin
Python
select
 *
from
 books
where
 to_tsvector(description) @@ to_tsquery('year <2> school');
Negation: !#
The negation symbol can be used to find phrases which don't contain a search term.
For example, to find records that have the word big but not little:
SQL
JavaScript
Dart
Swift
Kotlin
Python
select
 *
from
 books
where
 to_tsvector(description) @@ to_tsquery('big & !little');

Partitioning tables

Table partitioning is a technique that allows you to divide a large table into smaller, more manageable parts called “partitions”.

Each partition contains a subset of the data based on a specified criteria, such as a range of values or a specific condition. Partitioning can significantly improve query performance and simplify data management for large datasets.
Benefits of table partitioning#
Improved query performance: allows queries to target specific partitions, reducing the amount of data scanned and improving query execution time.
Scalability: With partitioning, you can add or remove partitions as your data grows or changes, enabling better scalability and flexibility.
Efficient data management: simplifies tasks such as data loading, archiving, and deletion by operating on smaller partitions instead of the entire table.
Enhanced maintenance operations: can optimize vacuuming and indexing, leading to faster maintenance tasks.
Partitioning methods#
Postgres supports various partitioning methods based on how you want to partition your data. The commonly used methods are:
Range Partitioning: Data is divided into partitions based on a specified range of values. For example, you can partition a sales table by date, where each partition represents a specific time range (e.g., one partition for each month).
List Partitioning: Data is divided into partitions based on a specified list of values. For instance, you can partition a customer table by region, where each partition contains customers from a specific region (e.g., one partition for customers in the US, another for customers in Europe).
Hash Partitioning: Data is distributed across partitions using a hash function. This method provides a way to evenly distribute data among partitions, which can be useful for load balancing. However, it doesn't allow direct querying based on specific values.
Creating partitioned tables#
Let's consider an example of range partitioning for a sales table based on the order date. We'll create monthly partitions to store data for each month:
create table sales (
   id bigint generated by default as identity,
   order_date date not null,
   customer_id bigint,
   amount bigint,
   -- We need to include all the
   -- partitioning columns in constraints:
   primary key (order_date, id)
)
partition by range (order_date);
create table sales_2000_01
	partition of sales
 for values from ('2000-01-01') to ('2000-02-01');
create table sales_2000_02
	partition of sales
	for values from ('2000-02-01') to ('2000-03-01');
To create a partitioned table you append partition by range (<column_name>) to the table creation statement. The column that you are partitioning with must be included in any unique index, which is the reason why we specify a composite primary key here (primary key (order_date, id)).
Querying partitioned tables#
To query a partitioned table, you have two options:
Querying the parent table
Querying specific partitions
Querying the parent table#
When you query the parent table, Postgres automatically routes the query to the relevant partitions based on the conditions specified in the query. This allows you to retrieve data from all partitions simultaneously.
Example:
select *
from sales
where order_date >= '2000-01-01' and order_date < '2000-03-01';
This query will retrieve data from both the sales_2000_01 and sales_2000_02 partitions.
Querying specific partitions#
If you only need to retrieve data from a specific partition, you can directly query that partition instead of the parent table. This approach is useful when you want to target a specific range or condition within a partition.
select *
from sales_2000_02;
This query will retrieve data only from the sales_2000_02 partition.
When to partition your tables#
There is no real threshold to determine when you should use partitions. Partitions introduce complexity, and complexity should be avoided until it's needed. A few guidelines:
If you are considering performance, avoid partitions until you see performance degradation on non-partitioned tables.
If you are using partitions as a management tool, it's fine to create the partitions any time.
If you don't know how you should partition your data, then it's probably too early.
Examples#
Here are simple examples for each of the partitioning types in Postgres.
Range partitioning#
Let's consider a range partitioning example for a table that stores sales data based on the order date. We'll create monthly partitions to store data for each month.
In this example, the sales table is partitioned into two partitions: sales_january and sales_february. The data in these partitions is based on the specified range of order dates:
create table sales (
   id bigint generated by default as identity,
   order_date date not null,
   customer_id bigint,
   amount bigint,
   -- We need to include all the
   -- partitioning columns in constraints:
   primary key (order_date, id)
)
partition by range (order_date);
create table sales_2000_01
	partition of sales
 for values from ('2000-01-01') to ('2000-02-01');
create table sales_2000_02
	partition of sales
	for values from ('2000-02-01') to ('2000-03-01');
List partitioning#
Let's consider a list partitioning example for a table that stores customer data based on their region. We'll create partitions to store customers from different regions.
In this example, the customers table is partitioned into two partitions: customers_americas and customers_asia. The data in these partitions is based on the specified list of regions:
-- Create the partitioned table
create table customers (
   id bigint generated by default as identity,
   name text,
   country text,
   -- We need to include all the
   -- partitioning columns in constraints:
   primary key (country, id)
)
partition by list(country);
create table customers_americas
	partition of customers
	for values in ('US', 'CANADA');
create table customers_asia
	partition of customers
 for values in ('INDIA', 'CHINA', 'JAPAN');
Hash partitioning#
You can use hash partitioning to evenly distribute data.
In this example, the products table is partitioned into two partitions: products_one and products_two. The data is distributed across these partitions using a hash function:
create table products (
   id bigint generated by default as identity,
   name text,
   category text,
   price bigint
)
partition by hash (id);
create table products_one
	partition of products
 for values with (modulus 2, remainder 1);
create table products_two
	partition of products
 for values with (modulus 2, remainder 0);
Other tools#
There are several other tools available for Postgres partitioning, most notably pg_partman. Native partitioning was introduced in Postgres 10 and is generally thought to have better performance.

Connection management
Using your connections resourcefully

Connections#
Every Compute Add-On has a pre-configured direct connection count and Supavisor pool size. This guide discusses ways to observe and manage them resourcefully.
Configuring Supavisor's pool size#
You can change how many database connections Supavisor can manage by altering the pool size in the "Connection pooling configuration" section of the Database Settings:

The general rule is that if you are heavily using the PostgREST database API, you should be conscientious about raising your pool size past 40%. Otherwise, you can commit 80% to the pool. This leaves adequate room for the Authentication server and other utilities.
These numbers are generalizations and depends on other Supabase products that you use and the extent of their usage. The actual values depend on your concurrent peak connection usage. For instance, if you were only using 80 connections in a week period and your database max connections is set to 500, then realistically you could allocate the difference of 420 (minus a reasonable buffer) to service more demand.
Monitoring connections#
Capturing historical usage#
Supabase offers a Grafana Dashboard that records and visualizes over 200 project metrics, including connections. For setup instructions, check the metrics docs.
Its "Client Connections" graph displays connections for both Supavisor and Postgres

Observing live connections#
pg_stat_activity is a special view that keeps track of processes being run by your database, including live connections. It's particularly useful for determining if idle clients are hogging connection slots.
Query to get all live connections:
SELECT
 pg_stat_activity.pid as connection_id,
 ssl,
 datname as database,
 usename as connected_role,
 application_name,
 client_addr as IP,
 query,
 query_start,
 state,
 backend_start
FROM pg_stat_ssl
JOIN pg_stat_activity
ON pg_stat_ssl.pid = pg_stat_activity.pid;
Interpreting the query:
Column
Description
connection_id
connection id
ssl
Indicates if SSL is in use
database
Name of the connected database (usually postgres)
usename
Role of the connected user
application_name
Name of the connecting application
client_addr
IP address of the connecting server
query
Last query executed by the connection
query_start
Time when the last query was executed
state
Querying state: active or idle
backend_start
Timestamp of the connection's establishment

The username can be used to identify the source:
Role
API/Tool
supabase_admin
Used by Supabase for monitoring and by Realtime
authenticator
Data API (PostgREST)
supabase_auth_admin
Auth
supabase_storage_admin
Storage
supabase_replication_admin
Synchronizes Read Replicas
postgres
Supabase Dashboard and External Tools (e.g., Prisma, SQLAlchemy, PSQL...)
Custom roles defined by user
External Tools (e.g., Prisma, SQLAlchemy, PSQL...)


Row Level Security
Secure your data using Postgres Row Level Security.

When you need granular authorization rules, nothing beats Postgres's Row Level Security (RLS).
Row Level Security in Supabase#
Supabase allows convenient and secure data access from the browser, as long as you enable RLS.
RLS must always be enabled on any tables stored in an exposed schema. By default, this is the public schema.
RLS is enabled by default on tables created with the Table Editor in the dashboard. If you create one in raw SQL or with the SQL editor, remember to enable RLS yourself:
alter table <schema_name>.<table_name>
enable row level security;
RLS is incredibly powerful and flexible, allowing you to write complex SQL rules that fit your unique business needs. RLS can be combined with Supabase Auth for end-to-end user security from the browser to the database.
RLS is a Postgres primitive and can provide "defense in depth" to protect your data from malicious actors even when accessed through third-party tooling.
Policies#
Policies are Postgres's rule engine. Policies are easy to understand once you get the hang of them. Each policy is attached to a table, and the policy is executed every time a table is accessed.
You can just think of them as adding a WHERE clause to every query. For example a policy like this ...
create policy "Individuals can view their own todos."
on todos for select
using ( (select auth.uid()) = user_id );
.. would translate to this whenever a user tries to select from the todos table:
select *
from todos
where auth.uid() = todos.user_id;
-- Policy is implicitly added.
Enabling Row Level Security#
You can enable RLS for any table using the enable row level security clause:
alter table "table_name" enable row level security;
Once you have enabled RLS, no data will be accessible via the API when using the public anon key, until you create policies.
Authenticated and unauthenticated roles#
Supabase maps every request to one of the roles:
anon: an unauthenticated request (the user is not logged in)
authenticated: an authenticated request (the user is logged in)
These are actually Postgres Roles. You can use these roles within your Policies using the TO clause:
create policy "Profiles are viewable by everyone"
on profiles for select
to authenticated, anon
using ( true );
-- OR
create policy "Public profiles are viewable only by authenticated users"
on profiles for select
to authenticated
using ( true );
Anonymous user vs the anon key
Using the anon Postgres role is different from an anonymous user in Supabase Auth. An anonymous user assumes the authenticated role to access the database and can be differentiated from a permanent user by checking the is_anonymous claim in the JWT.
Creating policies#
Policies are SQL logic that you attach to a Postgres table. You can attach as many policies as you want to each table.
Supabase provides some helpers that simplify RLS if you're using Supabase Auth. We'll use these helpers to illustrate some basic policies:
SELECT policies#
You can specify select policies with the using clause.
Let's say you have a table called profiles in the public schema and you want to enable read access to everyone.
-- 1. Create table
create table profiles (
 id uuid primary key,
 user_id references auth.users,
 avatar_url text
);
-- 2. Enable RLS
alter table profiles enable row level security;
-- 3. Create Policy
create policy "Public profiles are visible to everyone."
on profiles for select
to anon         -- the Postgres Role (recommended)
using ( true ); -- the actual Policy
Alternatively, if you only wanted users to be able to see their own profiles:
create policy "User can see their own profile only."
on profiles
for select using ( (select auth.uid()) = user_id );
INSERT policies#
You can specify insert policies with the with check clause. The with check expression ensures that any new row data adheres to the policy constraints.
Let's say you have a table called profiles in the public schema and you only want users to be able to create a profile for themselves. In that case, we want to check their User ID matches the value that they are trying to insert:
-- 1. Create table
create table profiles (
 id uuid primary key,
 user_id uuid references auth.users,
 avatar_url text
);
-- 2. Enable RLS
alter table profiles enable row level security;
-- 3. Create Policy
create policy "Users can create a profile."
on profiles for insert
to authenticated                          -- the Postgres Role (recommended)
with check ( (select auth.uid()) = user_id );      -- the actual Policy
UPDATE policies#
You can specify update policies by combining both the using and with check expressions.
The using clause represents the condition that must be true for the update to be allowed, and with check clause ensures that the updates made adhere to the policy constraints.
Let's say you have a table called profiles in the public schema and you only want users to be able to update their own profile.
You can create a policy where the using clause checks if the user owns the profile being updated. And the with check clause ensures that, in the resultant row, users do not change the user_id to a value that is not equal to their User ID, maintaining that the modified profile still meets the ownership condition.
-- 1. Create table
create table profiles (
 id uuid primary key,
 user_id uuid references auth.users,
 avatar_url text
);
-- 2. Enable RLS
alter table profiles enable row level security;
-- 3. Create Policy
create policy "Users can update their own profile."
on profiles for update
to authenticated                    -- the Postgres Role (recommended)
using ( (select auth.uid()) = user_id )       -- checks if the existing row complies with the policy expression
with check ( (select auth.uid()) = user_id ); -- checks if the new row complies with the policy expression
If no with check expression is defined, then the using expression will be used both to determine which rows are visible (normal USING case) and which new rows will be allowed to be added (WITH CHECK case).
To perform an UPDATE operation, a corresponding SELECT policy is required. Without a SELECT policy, the UPDATE operation will not work as expected.
DELETE policies#
You can specify delete policies with the using clause.
Let's say you have a table called profiles in the public schema and you only want users to be able to delete their own profile:
-- 1. Create table
create table profiles (
 id uuid primary key,
 user_id uuid references auth.users,
 avatar_url text
);
-- 2. Enable RLS
alter table profiles enable row level security;
-- 3. Create Policy
create policy "Users can delete a profile."
on profiles for delete
to authenticated                     -- the Postgres Role (recommended)
using ( (select auth.uid()) = user_id );      -- the actual Policy
Views#
Views bypass RLS by default because they are usually created with the postgres user. This is a feature of Postgres, which automatically creates views with security definer.
In Postgres 15 and above, you can make a view obey the RLS policies of the underlying tables when invoked by anon and authenticated roles by setting security_invoker = true.
create view <VIEW_NAME>
with(security_invoker = true)
as select <QUERY>
In older versions of Postgres, protect your views by revoking access from the anon and authenticated roles, or by putting them in an unexposed schema.
Helper functions#
Supabase provides some helper functions that make it easier to write Policies.
auth.uid()#
Returns the ID of the user making the request.
auth.jwt()#
Not all information present in the JWT should be used in RLS policies. For instance, creating an RLS policy that relies on the user_metadata claim can create security issues in your application as this information can be modified by authenticated end users.
Returns the JWT of the user making the request. Anything that you store in the user's raw_app_meta_data column or the raw_user_meta_data column will be accessible using this function. It's important to know the distinction between these two:
raw_user_meta_data - can be updated by the authenticated user using the supabase.auth.update() function. It is not a good place to store authorization data.
raw_app_meta_data - cannot be updated by the user, so it's a good place to store authorization data.
The auth.jwt() function is extremely versatile. For example, if you store some team data inside app_metadata, you can use it to determine whether a particular user belongs to a team. For example, if this was an array of IDs:
create policy "User is in team"
on my_table
to authenticated
using ( team_id in (select auth.jwt() -> 'app_metadata' -> 'teams'));
Keep in mind that a JWT is not always "fresh". In the example above, even if you remove a user from a team and update the app_metadata field, that will not be reflected using auth.jwt() until the user's JWT is refreshed.
Also, if you are using Cookies for Auth, then you must be mindful of the JWT size. Some browsers are limited to 4096 bytes for each cookie, and so the total size of your JWT should be small enough to fit inside this limitation.
MFA#
The auth.jwt() function can be used to check for Multi-Factor Authentication. For example, you could restrict a user from updating their profile unless they have at least 2 levels of authentication (Assurance Level 2):
create policy "Restrict updates."
on profiles
as restrictive
for update
to authenticated using (
 (select auth.jwt()->>'aal') = 'aal2'
);
Bypassing Row Level Security#
Supabase provides special "Service" keys, which can be used to bypass RLS. These should never be used in the browser or exposed to customers, but they are useful for administrative tasks.
Supabase will adhere to the RLS policy of the signed-in user, even if the client library is initialized with a Service Key.
You can also create new Postgres Roles which can bypass Row Level Security using the "bypass RLS" privilege:
alter role "role_name" with bypassrls;
This can be useful for system-level access. You should never share login credentials for any Postgres Role with this privilege.
RLS performance recommendations#
Every authorization system has an impact on performance. While row level security is powerful, the performance impact is important to keep in mind. This is especially true for queries that scan every row in a table - like many select operations, including those using limit, offset, and ordering.
Based on a series of tests, we have a few recommendations for RLS:
Add indexes#
Make sure you've added indexes on any columns used within the Policies which are not already indexed (or primary keys). For a Policy like this:
create policy "rls_test_select" on test_table
to authenticated
using ( (select auth.uid()) = user_id );
You can add an index like:
create index userid
on test_table
using btree (user_id);
Benchmarks#
Test
Before (ms)
After (ms)
% Improvement
Change
test1-indexed
171
< 0.1
99.94%






Call functions with select#
You can use select statement to improve policies that use functions. For example, instead of this:
create policy "rls_test_select" on test_table
to authenticated
using ( auth.uid() = user_id );
You can do:
create policy "rls_test_select" on test_table
to authenticated
using ( (select auth.uid()) = user_id );
This method works well for JWT functions like auth.uid() and auth.jwt() as well as security definer Functions. Wrapping the function causes an initPlan to be run by the Postgres optimizer, which allows it to "cache" the results per-statement, rather than calling the function on each row.
You can only use this technique if the results of the query or function do not change based on the row data.
Benchmarks#
Test
Before (ms)
After (ms)
% Improvement
Change
test2a-wrappedSQL-uid
179
9
94.97%





test2b-wrappedSQL-isadmin
11,000
7
99.94%





test2c-wrappedSQL-two-functions
11,000
10
99.91%





test2d-wrappedSQL-sd-fun
178,000
12
99.993%





test2e-wrappedSQL-sd-fun-array
173000
16
99.991%






Add filters to every query#
Policies are "implicit where clauses," so it's common to run select statements without any filters. This is a bad pattern for performance. Instead of doing this (JS client example):
const { data } = supabase
 .from('table')
 .select()
You should always add a filter:
const { data } = supabase
 .from('table')
 .select()
 .eq('user_id', userId)
Even though this duplicates the contents of the Policy, Postgres can use the filter to construct a better query plan.
Benchmarks#
Test
Before (ms)
After (ms)
% Improvement
Change
test3-addfilter
171
9
94.74%






Use security definer functions#
A "security definer" function runs using the same role that created the function. This means that if you create a role with a superuser (like postgres), then that function will have bypassrls privileges. For example, if you had a policy like this:
create policy "rls_test_select" on test_table
to authenticated
using (
 exists (
   select 1 from roles_table
   where (select auth.uid()) = user_id and role = 'good_role'
 )
);
We can instead create a security definer function which can scan roles_table without any RLS penalties:
create function private.has_good_role()
returns boolean
language plpgsql
security definer -- will run as the creator
as $$
begin
 return exists (
   select 1 from roles_table
   where (select auth.uid()) = user_id and role = 'good_role'
 );
end;
$$;
-- Update our policy to use this function:
create policy "rls_test_select"
on test_table
to authenticated
using ( private.has_good_role() );
Security-definer functions should never be created in a schema in the "Exposed schemas" inside your API settings`.
Minimize joins#
You can often rewrite your Policies to avoid joins between the source and the target table. Instead, try to organize your policy to fetch all the relevant data from the target table into an array or set, then you can use an IN or ANY operation in your filter.
For example, this is an example of a slow policy which joins the source test_table to the target team_user:
create policy "rls_test_select" on test_table
to authenticated
using (
 (select auth.uid()) in (
   select user_id
   from team_user
   where team_user.team_id = team_id -- joins to the source "test_table.team_id"
 )
);
We can rewrite this to avoid this join, and instead select the filter criteria into a set:
create policy "rls_test_select" on test_table
to authenticated
using (
 team_id in (
   select team_id
   from team_user
   where user_id = (select auth.uid()) -- no join
 )
);
In this case you can also consider using a security definer function to bypass RLS on the join table:
If the list exceeds 1000 items, a different approach may be needed or you may need to analyze the approach to ensure that the performance is acceptable.
Benchmarks#
Test
Before (ms)
After (ms)
% Improvement
Change
test5-fixed-join
9,000
20
99.78%






Specify roles in your policies#
Always use the Role of inside your policies, specified by the TO operator. For example, instead of this query:
create policy "rls_test_select" on rls_test
using ( auth.uid() = user_id );
Use:
create policy "rls_test_select" on rls_test
to authenticated
using ( (select auth.uid()) = user_id );
This prevents the policy ( (select auth.uid()) = user_id ) from running for any anon users, since the execution stops at the to authenticated step.
Benchmarks#
Test
Before (ms)
After (ms)
% Improvement
Change
test6-To-role
170
< 0.1
99.78%






More resources#
Testing your database
Row Level Security and Supabase Auth
RLS Guide and Best Practices
Community repo on testing RLS using pgTAP and dbdev


Column Level Security

PostgreSQL's Row Level Security (RLS) gives you granular control over who can access rows of data. However, it doesn't give you control over which columns they can access within rows. Sometimes you want to restrict access to specific columns in your database. Column Level Privileges allows you to do just that.
This is an advanced feature. We do not recommend using column-level privileges for most users. Instead, we recommend using RLS policies in combination with a dedicated table for handling user roles.
Restricted roles cannot use the wildcard operator (*) on the affected table. Instead of using SELECT * FROM <restricted_table>; or its API equivalent, you must specify the column names explicitly.
Policies at the row level#
Policies in Row Level Security (RLS) are used to restrict access to rows in a table. Think of them like adding a WHERE clause to every query.
For example, let's assume you have a posts table with the following columns:
id
user_id
title
content
created_at
updated_at
You can restrict updates to just the user who created it using RLS, with the following policy:
create policy "Allow update for owners" on posts for
update
 using ((select auth.uid()) = user_id);
However, this gives the post owner full access to update the row, including all of the columns.
Privileges at the column level#
To restrict access to columns, you can use Privileges.
There are two types of privileges in Postgres:
table-level: Grants the privilege on all columns in the table.
column-level Grants the privilege on a specific column in the table.
You can have both types of privileges on the same table. If you have both, and you revoke the column-level privilege, the table-level privilege will still be in effect.
By default, our table will have a table-level UPDATE privilege, which means that the authenticated role can update all the columns in the table.
revoke
update
 on table public.posts
from
 authenticated;
grant
update
 (title, content) on table public.posts to authenticated;
In the above example, we are revoking the table-level UPDATE privilege from the authenticated role and granting a column-level UPDATE privilege on just the title and content columns.
If we want to restrict access to updating the title column:
revoke
update
 (title) on table public.posts
from
 authenticated;
This time, we are revoking the column-level UPDATE privilege of the title column from the authenticated role. We didn't need to revoke the table-level UPDATE privilege because it's already revoked.
Manage column privileges in the Dashboard#
Column-level privileges are a powerful tool, but they're also quite advanced and in many cases, not the best fit for common access control needs. For that reason, we've intentionally moved the UI for this feature under the Feature Preview section in the dashboard.
You can view and edit the privileges in the Supabase Studio.

Manage column privileges in migrations#
While you can manage privileges directly from the Dashboard, as your project grows you may want to manage them in your migrations. Read about database migrations in the Local Development guide.
1
Create a migration file
To get started, generate a new migration to store the SQL needed to create your table along with row and column-level privileges.
supabase migration new create_posts_table
2
Add the SQL to your migration file
This creates a new migration: supabase/migrations/<timestamp>
_create_posts_table.sql.
To that file, add the SQL to create this posts table with row and column-level privileges.
create table
posts (
id bigint primary key generated always as identity,
user_id text,
title text,
content text,
created_at timestamptz default now()
updated_at timestamptz default now()
);
-- Add row-level security
create policy "Allow update for owners" on posts for
update
using ((select auth.uid()) = user_id);
-- Add column-level security
revoke
update
(title) on table public.posts
from
authenticated;
Considerations when using column-level privileges#
If you turn off a column privilege you won't be able to use that column at all.
All operations (insert, update, delete) as well as using select * will fail.


Hardening the Data API

Your database's auto-generated Data API exposes the public schema by default. You can change this to any schema in your database, or even disable the Data API completely.
Any tables that are accessible through the Data API must have Row Level Security enabled. Row Level Security (RLS) is enabled by default when you create tables from the Supabase Dashboard. If you create a table using the SQL editor or your own SQL client or migration runner, youmust enable RLS yourself.
Shared responsibility#
Your application's security is your responsibility as a developer. This includes RLS, falling under the Shared Responsibility model. To help you:
Supabase sends daily emails warning of any tables that are exposed to the Data API which do not have RLS enabled.
Supabase provides a Security Advisor and other tools in the Supabase Dashboard to fix any issues.
Private schemas#
We highly recommend creating a private schema for storing tables that you do not want to expose via the Data API. These tables can be accessed via Supabase Edge Functions or any other serverside tool. In this model, you should implement your security model in your serverside code. Although it's not required, we still recommend enabling RLS for private tables and then connecting to your database using a Postgres role with bypassrls privileges.
Managing the public schema#
If your public schema is used by other tools as a default space, you might want to lock down this schema. This helps prevent accidental exposure of data that's automatically added to public.
There are two levels of security hardening for the Data API:
Disabling the Data API entirely. This is recommended if you never need to access your database via Supabase client libraries or the REST and GraphQL endpoints.
Removing the public schema from the Data API and replacing it with a custom schema (such as api).
Disabling the Data API#
You can disable the Data API entirely if you never intend to use the Supabase client libraries or the REST and GraphQL data endpoints. For example, if you only access your database via a direct connection on the server, disabling the Data API gives you the greatest layer of protection.
Go to API Settings in the Supabase Dashboard.
Under Data API Settings, toggle Enable Data API off.
Exposing a custom schema instead of public#
If you want to use the Data API but with increased security, you can expose a custom schema instead of public. By not using public, which is often used as a default space and has laxer default permissions, you get more conscious control over your exposed data.
Any data, views, or functions that should be exposed need to be deliberately put within your custom schema (which we will call api), rather than ending up there by default.
Step 1: Remove public from exposed schemas#
Go to API Settings in the Supabase Dashboard.
Under Data API Settings, remove public from Exposed schemas. Also remove public from Extra search path.
Click Save.
Go to Database Extensions and disable the pg_graphql extension.
Step 2: Create an api schema and expose it#
Connect to your database. You can use psql, the Supabase SQL Editor, or the Postgres client of your choice.
Create a new schema named api:
create schema if not exists api;
Grant the anon and authenticated roles usage on this schema.
grant usage on schema api to anon, authenticated;
Go to API Settings in the Supabase Dashboard.
Under Data API Settings, add api to Exposed schemas. Make sure it is the first schema in the list, so that it will be searched first by default.
Under these new settings, anon and authenticated can execute functions defined in the api schema, but they have no automatic permissions on any tables. On a table-by-table basis, you can grant them permissions. For example:
grant select on table api.<your_table> to anon;
grant select, insert, update, delete on table api.<your_table> to authenticated;
Custom Claims & Role-based Access Control (RBAC)

Custom Claims are special attributes attached to a user that you can use to control access to portions of your application. For example:
{
 "user_role": "admin",
 "plan": "TRIAL",
 "user_level": 100,
 "group_name": "Super Guild!",
 "joined_on": "2022-05-20T14:28:18.217Z",
 "group_manager": false,
 "items": ["toothpick", "string", "ring"]
}
To implement Role-Based Access Control (RBAC) with custom claims, use a Custom Access Token Auth Hook. This hook runs before a token is issued. You can use it to add additional claims to the user's JWT.
This guide uses the Slack Clone example to demonstrate how to add a user_role claim and use it in your Row Level Security (RLS) policies.
Create a table to track user roles and permissions#
In this example, you will implement two user roles with specific permissions:
moderator: A moderator can delete all messages but not channels.
admin: An admin can delete all messages and channels.
-- Custom types
create type public.app_permission as enum ('channels.delete', 'messages.delete');
create type public.app_role as enum ('admin', 'moderator');
-- USER ROLES
create table public.user_roles (
 id        bigint generated by default as identity primary key,
 user_id   uuid references auth.users on delete cascade not null,
 role      app_role not null,
 unique (user_id, role)
);
comment on table public.user_roles is 'Application roles for each user.';
-- ROLE PERMISSIONS
create table public.role_permissions (
 id           bigint generated by default as identity primary key,
 role         app_role not null,
 permission   app_permission not null,
 unique (role, permission)
);
comment on table public.role_permissions is 'Application permissions for each role.';
For the full schema, see the example application on GitHub.
You can now manage your roles and permissions in SQL. For example, to add the mentioned roles and permissions from above, run:
insert into public.role_permissions (role, permission)
values
 ('admin', 'channels.delete'),
 ('admin', 'messages.delete'),
 ('moderator', 'messages.delete');
Create Auth Hook to apply user role#
The Custom Access Token Auth Hook runs before a token is issued. You can use it to edit the JWT.
PL/pgSQL (best performance)
-- Create the auth hook function
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
 declare
   claims jsonb;
   user_role public.app_role;
 begin
   -- Fetch the user role in the user_roles table
   select role into user_role from public.user_roles where user_id = (event->>'user_id')::uuid;
   claims := event->'claims';
   if user_role is not null then
     -- Set the claim
     claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
   else
     claims := jsonb_set(claims, '{user_role}', 'null');
   end if;
   -- Update the 'claims' object in the original event
   event := jsonb_set(event, '{claims}', claims);
   -- Return the modified or original event
   return event;
 end;
$$;
grant usage on schema public to supabase_auth_admin;
grant execute
 on function public.custom_access_token_hook
 to supabase_auth_admin;
revoke execute
 on function public.custom_access_token_hook
 from authenticated, anon, public;
grant all
 on table public.user_roles
to supabase_auth_admin;
revoke all
 on table public.user_roles
 from authenticated, anon, public;
create policy "Allow auth admin to read user roles" ON public.user_roles
as permissive for select
to supabase_auth_admin
using (true)
Enable the hook#
In the dashboard, navigate to Authentication > Hooks (Beta) and select the appropriate Postgres function from the dropdown menu.
When developing locally, follow the local development instructions.
To learn more about Auth Hooks, see the Auth Hooks docs.
Accessing custom claims in RLS policies#
To utilize Role-Based Access Control (RBAC) in Row Level Security (RLS) policies, create an authorize method that reads the user's role from their JWT and checks the role's permissions:
create or replace function public.authorize(
 requested_permission app_permission
)
returns boolean as $$
declare
 bind_permissions int;
 user_role public.app_role;
begin
 -- Fetch user role once and store it to reduce number of calls
 select (auth.jwt() ->> 'user_role')::public.app_role into user_role;
 select count(*)
 into bind_permissions
 from public.role_permissions
 where role_permissions.permission = requested_permission
   and role_permissions.role = user_role;
 return bind_permissions > 0;
end;
$$ language plpgsql stable security definer set search_path = '';
You can read more about using functions in RLS policies in the RLS guide.
You can then use the authorize method within your RLS policies. For example, to enable the desired delete access, you would add the following policies:
create policy "Allow authorized delete access" on public.channels for delete to authenticated using ( (SELECT authorize('channels.delete')) );
create policy "Allow authorized delete access" on public.messages for delete to authenticated using ( (SELECT authorize('messages.delete')) );
Accessing custom claims in your application#
The auth hook will only modify the access token JWT but not the auth response. Therefore, to access the custom claims in your application, e.g. your browser client, or server-side middleware, you will need to decode the access_token JWT on the auth session.
In a JavaScript client application you can for example use the jwt-decode package:
import { jwtDecode } from 'jwt-decode'
const { subscription: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
 if (session) {
   const jwt = jwtDecode(session.access_token)
   const userRole = jwt.user_role
 }
})
For server-side logic you can use packages like express-jwt, koa-jwt, PyJWT, dart_jsonwebtoken, Microsoft.AspNetCore.Authentication.JwtBearer, etc.
Conclusion#
You now have a robust system in place to manage user roles and permissions within your database that automatically propagates to Supabase Auth.
More resources#
Auth Hooks
Row Level Security
RLS Functions
Next.js Slack Clone Example


Postgres Roles
Managing access to your Postgres database and configuring permissions.

Postgres manages database access permissions using the concept of roles. Generally you wouldn't use these roles for your own application - they are mostly for configuring system access to your database. If you want to configure application access, then you should use Row Level Security (RLS). You can also implement Role-based Access Control on top of RLS.
Users vs roles#
In Postgres, roles can function as users or groups of users. Users are roles with login privileges, while groups (also known as role groups) are roles that don't have login privileges but can be used to manage permissions for multiple users.
Creating roles#
You can create a role using the create role command:
create role "role_name";
Creating users#
Roles and users are essentially the same in Postgres, however if you want to use password-logins for a specific role, then you can use WITH LOGIN PASSWORD:
create role "role_name" with login password 'extremely_secure_password';
Passwords#
Your Postgres database is the core of your Supabase project, so it's important that every role has a strong, secure password at all times. Here are some tips for creating a secure password:
Use a password manager to generate it.
Make a long password (12 characters at least).
Don't use any common dictionary words.
Use both upper and lower case characters, numbers, and special symbols.
Special symbols in passwords#
If you use special symbols in your Postgres password, you must remember to percent-encode your password later if using the Postgres connection string, for example, postgresql://postgres.projectref:p%3Dword@aws-0-us-east-1.pooler.supabase.com:6543/postgres
Changing your project password#
When you created your project you were also asked to enter a password. This is the password for the postgres role in your database. You can update this from the Dashboard under the database settings page. You should never give this to third-party service unless you absolutely trust them. Instead, we recommend that you create a new user for every service that you want to give access too. This will also help you with debugging - you can see every query that each role is executing in your database within pg_stat_statements.
Changing the password does not result in any downtime. All connected services, such as PostgREST, PgBouncer, and other Supabase managed services, are automatically updated to use the latest password to ensure availability. However, if you have any external services connecting to the Supabase database using hardcoded username/password credentials, a manual update will be required.
Granting permissions#
Roles can be granted various permissions on database objects using the GRANT command. Permissions include SELECT, INSERT, UPDATE, and DELETE. You can configure access to almost any object inside your database - including tables, views, functions, and triggers.
Revoking permissions#
Permissions can be revoked using the REVOKE command:
REVOKE permission_type ON object_name FROM role_name;
Role hierarchy#
Roles can be organized in a hierarchy, where one role can inherit permissions from another. This simplifies permission management, as you can define permissions at a higher level and have them automatically apply to all child roles.
Role inheritance#
To create a role hierarchy, you first need to create the parent and child roles. The child role will inherit permissions from its parent. Child roles can be added using the INHERIT option when creating the role:
create role "child_role_name" inherit "parent_role_name";
Preventing inheritance#
In some cases, you might want to prevent a role from having a child relationship (typically superuser roles). You can prevent inheritance relations using NOINHERIT:
alter role "child_role_name" noinherit;
Supabase roles#
Postgres comes with a set of predefined roles. Supabase extends this with a default set of roles which are configured on your database when you start a new project:
postgres#
The default Postgres role. This has admin privileges.
anon#
For unauthenticated, public access. This is the role which the API (PostgREST) will use when a user is not logged in.
authenticator#
A special role for the API (PostgREST). It has very limited access, and is used to validate a JWT and then
"change into" another role determined by the JWT verification.
authenticated#
For "authenticated access." This is the role which the API (PostgREST) will use when a user is logged in.
service_role#
For elevated access. This role is used by the API (PostgREST) to bypass Row Level Security.
supabase_auth_admin#
Used by the Auth middleware to connect to the database and run migration. Access is scoped to the auth schema.
supabase_storage_admin#
Used by the Auth middleware to connect to the database and run migration. Access is scoped to the storage schema.
dashboard_user#
For running commands via the Supabase UI.
supabase_admin#
An internal role Supabase uses for administrative tasks, such as running upgrades and automations.
Resources#
Official Postgres docs: Database Roles
Official Postgres docs: Role Membership
Official Postgres docs: Function Permissions


Custom Roles
Learn about using custom roles with storage schema

In this guide, you will learn how to create and use custom roles with Storage to manage role-based access to objects and buckets. The same approach can be used to use custom roles with any other Supabase service.
Supabase Storage uses the same role-based access control system as any other Supabase service using RLS (Row Level Security).
Create a custom role#
Let's create a custom role manager to provide full read access to a specific bucket. For a more advanced setup, see the RBAC Guide.
create role 'manager';
-- Important to grant the role to the authenticator and anon role
grant manager to authenticator;
grant anon to manager;
Create a policy#
Let's create a policy that gives full read permissions to all objects in the bucket teams for the manager role.
create policy "Manager can view all files in the bucket 'teams'"
on storage.objects
for select
to manager
using (
bucket_id = 'teams'
);
Test the policy#
To impersonate the manager role, you will need a valid JWT token with the manager role.
You can quickly create one using the jsonwebtoken library in Node.js.
Signing a new JWT requires your JWT_SECRET. You must store this secret securely. Never expose it in frontend code, and do not check it into version control.
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'your-jwt-secret' // You can find this in your Supabase project settings under API. Store this securely.
const USER_ID = '' // the user id that we want to give the manager role
const token = jwt.sign({ role: 'manager', sub: USER_ID }, JWT_SECRET, {
 expiresIn: '1h',
})
Now you can use this token to access the Storage API.
const { StorageClient } = require('@supabase/storage-js')
const PROJECT_URL = 'https://your-project-id.supabase.co/storage/v1'
const storage = new StorageClient(PROJECT_URL, {
 authorization: `Bearer ${token}`,
})
await storage.from('teams').list()

Vault
Managing secrets in Postgres.

Vault is a Postgres extension and accompanying Supabase UI that makes it safe and easy to store encrypted secrets and other data in your database. This opens up a lot of possibilities to use Postgres in ways that go beyond what is available in a stock distribution.
Under the hood, the Vault is a table of Secrets that are stored using Authenticated Encryption on disk. They are then available in decrypted form through a Postgres view so that the secrets can be used by applications from SQL. Because the secrets are stored on disk encrypted and authenticated, any backups or replication streams also preserve this encryption in a way that can't be decrypted or forged.
Supabase provides a dashboard UI for the Vault that makes storing secrets easy. Click a button, type in your secret, and save.
You can use Vault to store secrets - everything from Environment Variables to API Keys. You can then use these secrets anywhere in your database: Postgres Functions, Triggers, and Webhooks. From a SQL perspective, accessing secrets is as easy as querying a table (or in this case, a view). The underlying secrets tables will be stored in encrypted form.
Using Vault#
You can manage secrets from the UI or using SQL.
Adding secrets#
There is also a handy function for creating secrets called vault.create_secret():
select vault.create_secret('my_s3kre3t');
The function returns the UUID of the new secret.
Show Result
Secrets can also have an optional unique name and an optional description. These are also arguments to vault.create_secret():
select vault.create_secret('another_s3kre3t', 'unique_name', 'This is the description');
Show Result
Viewing secrets#
If you look in the vault.secrets table, you will see that your data is stored encrypted. To decrypt the data, there is an automatically created view vault.decrypted_secrets. This view will decrypt secret data on the fly:
select *
from vault.decrypted_secrets
order by created_at desc
limit 3;
Show Result
Notice how this view has a decrypted_secret column that contains the decrypted secrets. Views are not stored on disk, they are only run at query time, so the secret remains encrypted on disk, and in any backup dumps or replication streams.
You should ensure that you protect access to this view with the appropriate SQL privilege settings at all times, as anyone that has access to the view has access to decrypted secrets.
Updating secrets#
A secret can be updated with the vault.update_secret() function, this function makes updating secrets easy, just provide the secret UUID as the first argument, and then an updated secret, updated optional unique name, or updated description:
select
 vault.update_secret(
   '7095d222-efe5-4cd5-b5c6-5755b451e223',
   'n3w_upd@ted_s3kret',
   'updated_unique_name',
   'This is the updated description'
 );
Show Result
Deep dive#
As we mentioned, Vault uses Transparent Column Encryption (TCE) to store secrets in an authenticated encrypted form. There are some details around that you may be curious about. What does authenticated mean? Where is the encryption key stored? This section explains those details.
Authenticated encryption with associated data#
The first important feature of TCE is that it uses an Authenticated Encryption with Associated Data encryption algorithm (based on libsodium).
Encryption key location#
Authenticated Encryption means that in addition to the data being encrypted, it is also signed so that it cannot be forged. You can guarantee that the data was encrypted by someone you trust, which you wouldn't get with encryption alone. The decryption function verifies that the signature is valid before decrypting the value.
Associated Data means that you can include any other columns from the same row as part of the signature computation. This doesn't encrypt those other columns - rather it ensures that your encrypted value is only associated with columns from that row. If an attacker were to copy an encrypted value from another row to the current one, the signature would be rejected (assuming you used a unique column in the associated data).
Another important feature is that the encryption key is never stored in the database alongside the encrypted data. Even if an attacker can capture a dump of your entire database, they will see only encrypted data, never the encryption key itself.
This is an important safety precaution - there is little value in storing the encryption key in the database itself as this would be like locking your front door but leaving the key in the lock! Storing the key outside the database fixes this issue.
Where is the key stored? Supabase creates and manages the encryption key in our secured backend systems. We keep this key safe and separate from your data. You remain in control of your key - a separate API endpoint is available that you can use to access the key if you want to decrypt your data outside of Supabase.
Which roles should have access to the vault.secrets table should be carefully considered. There are two ways to grant access, the first is that the postgres user can explicitly grant access to the vault table itself.
Resources#
Read more about Supabase Vault in the blog post
Supabase Vault on GitHub
Column Encryption


Roles, superuser access and unsupported operations

Supabase provides the default postgres role to all instances deployed. Superuser access is not given as it allows destructive operations to be performed on the database.
To ensure you are not impacted by this, additional privileges are granted to the postgres user to allow it to run some operations that are normally restricted to superusers.
However, this does mean that some operations, that typically require superuser privileges, are not available on Supabase. These are documented below:
Unsupported operations#
CREATE SUBSCRIPTION
CREATE EVENT TRIGGER
COPY ... FROM PROGRAM
ALTER USER ... WITH SUPERUSER
Database configuration
Updating the default configuration for your Postgres database.

Postgres provides a set of sensible defaults for you database size. In some cases, these defaults can be updated. We do not recommend changing these defaults unless you know what you're doing.
Timeouts#
See the Timeouts section.
Statement optimization#
All Supabase projects come with the pg_stat_statements extension installed, which tracks planning and execution statistics for all statements executed against it. These statistics can be used in order to diagnose the performance of your project.
This data can further be used in conjunction with the explain functionality of Postgres to optimize your usage.
Managing timezones#
Every hosted Supabase database is set to UTC timezone by default. We strongly recommend keeping it this way, even if your users are in a different location. This is because it makes it much easier to calculate differences between timezones if you adopt the mental model that everything in your database is in UTC time.
On self-hosted databases, the timezone defaults to your local timezone. We recommend changing this to UTC for the same reasons.
Change timezone#
SQL
alter database postgres
set timezone to 'America/New_York';
Full list of timezones#
Get a full list of timezones supported by your database. This will return the following columns:
name: Time zone name
abbrev: Time zone abbreviation
utc_offset: Offset from UTC (positive means east of Greenwich)
is_dst: True if currently observing daylight savings
SQL
select name, abbrev, utc_offset, is_dst
from pg_timezone_names()
order by name;
Search for a specific timezone#
Use ilike (case insensitive search) to find specific timezones.
SQL
select *
from pg_timezone_names()
where name ilike '%york%';

Query Optimization
Choosing indexes to improve your query performance.

When working with Postgres, or any relational database, indexing is key to improving query performance. Aligning indexes with common query patterns can speed up data retrieval by an order of magnitude.
This guide is intended to:
help identify parts of a query that have the potential to be improved by indexes
introduce tooling to help identify useful indexes
This is not a comprehensive resource, but rather a helpful starting point for your optimization journey.
If you're new to query optimization, you may be interested in index_advisor, our tool for automatically detecting indexes that improve performance on a given query.
Example query#
Consider the following example query that retrieves customer names and purchase dates from two tables:
select
 a.name,
 b.date_of_purchase
from
 customers as a
 join orders as b on a.id = b.customer_id
where a.sign_up_date > '2023-01-01' and b.status = 'shipped'
order by b.date_of_purchase
limit 10;
In this query, there are several parts that indexes could likely help in optimizing the performance:
where clause:#
The where clause filters rows based on certain conditions, and indexing the columns involved can improve this process:
a.sign_up_date: If filtering by sign_up_date is common, indexing this column can speed up the query.
b.status: Indexing the status may be beneficial if the column has diverse values.
create index idx_customers_sign_up_date on customers (sign_up_date);
create index idx_orders_status on orders (status);
join columns#
Indexes on the columns used for joining tables can help Postgres avoid scanning tables in their entirety when connecting tables.
Indexing a.id and b.customer_id would likely improve the performance of the join in this query.
Note that if a.id is the primary key of the customers table it is already indexed
create index idx_orders_customer_id on orders (customer_id);
order by clause#
Sorting can also be optimized by indexing:
An index on b.date_of_purchase can improve the sorting process, and is particularly beneficial when a subset of rows is being returned with a limit clause.
create index idx_orders_date_of_purchase on orders (date_of_purchase);
Key concepts#
Here are some concepts and tools to keep in mind to help you identify the best index for the job, and measure the impact that your index had:
Analyze the query plan#
Use the explain command to understand the query's execution. Look for slow parts, such as Sequential Scans or high cost numbers. If creating an index does not reduce the cost of the query plan, remove it.
For example:
explain select * from customers where sign_up_date > 25;
Use appropriate index types#
Postgres offers various index types like B-tree, Hash, GIN, etc. Select the type that best suits your data and query pattern. Using the right index type can make a significant difference. For example, using a BRIN index on a field that always increases and lives within a table that updates infrequently - like created_at on an orders table - routinely results in indexes that are +10x smaller than the equivalent default B-tree index. That translates into better scalability.
create index idx_orders_created_at ON customers using brin(created_at);
Partial indexes#
For queries that frequently target a subset of data, a partial index could be faster and smaller than indexing the entire column. A partial index contains a where clause to filter the values included in the index. Note that a query's where clause must match the index for it to be used.
create index idx_orders_status on orders (status)
where status = 'shipped';
Composite indexes#
If filtering or joining on multiple columns, a composite index prevents Postgres from referring to multiple indexes when identifying the relevant rows.
create index idx_customers_sign_up_date_priority on customers (sign_up_date, priority);
Over-Indexing#
Avoid the urge to index columns you operate on infrequently. While indexes can speed up reads, they also slow down writes, so it's important to balance those factors when making indexing decisions.
Statistics#
Postgres maintains a set of statistics about the contents of your tables. Those statistics are used by the query planner to decide when it's is more efficient to use an index vs scanning the entire table. If the collected statistics drift too far from reality, the query planner may make poor decisions. To avoid this risk, you can periodically analyze tables.
analyze customers;

By following this guide, you'll be able to discern where indexes can optimize queries and enhance your Postgres performance. Remember that each database is unique, so always consider the specific context and use case of your queries.

Performance and Security Advisors
Check your database for performance and security issues

You can use the Database Performance and Security Advisors to check your database for issues such as missing indexes and improperly set-up RLS policies.
Using the Advisors#
In the dashboard, navigate to Security Advisor and Performance Advisor under Database. The advisors run automatically. You can also manually rerun them after you've resolved issues.
Available checks#
0001 unindexed foreign keys
0002 auth users exposed
0003 auth rls initplan
0004 no primary key
0005 unused index
0006 multiple permissive policies
0007 policy exists rls disabled
0008 rls enabled no policy
0009 duplicate index
0010 security definer view
0011 function search path mutable
0012 auth allow anonymous sign ins
0013 rls disabled in public
0014 extension in public
0015 rls references user metadata
0016 materialized view in api
0017 foreign table in api
0018 unsupported reg types
0019 insecure queue exposed in api
0020 table bloat
0021 fkey to auth unique
Level: INFO
Rationale#
In relational databases, indexing foreign key columns is a standard practice for improving query performance. Indexing these columns is recommended in most cases because it improves query join performance along a declared relationship.
What is a Foreign Key?#
A foreign key is a constraint on a column (or set of columns) that enforces a relationship between two tables. For example, a foreign key from book.author_id to author.id enforces that every value in book.author_id exists in author.id. Once the foriegn key is declared, it is not possible to insert a value into book.author_id that does not exist in author.id. Similarly, Postgres will not allow us to delete a value from author.id that is referenced by book.author_id. This concept is known as referential integrity.
Why Index Foreign Key Columns?#
Given that foreign keys define relationships among tables, it is common to use foreign key columns in join conditions when querying the database. Adding an index to the columns making up the foreign key improves the performance of those joins and reduces database resource consumption.
select
   book.id,
   book.title,
   author.name
from
   book
   join author
       -- Both sides of the following condition should be indexed
       -- for best performance
       on book.author_id = author.id
How to Resolve#
Given a table:
create table book (
   id serial primary key,
   title text not null,
   author_id int references author(id) -- this defines the foreign key
);
To apply the best practice of indexing foreign keys, an index is needed on the book.author_id column. We can create that index using:
create index ix_book_author_id on book(author_id);
In this case we used the default B-tree index type. Be sure to choose an index type that is appropriate for the data types and use case when working with your own tables.
Example#
Let's look at a practical example involving two tables: order_item and customer, where order_item references customer.
Given the schema:
create table customer (
   id serial primary key,
   name text not null
);
create table order_item (
   id serial primary key,
   order_date date not null,
   customer_id integer not null references customer (id)
);
We expect the tables to be joined on the condition
customer.id = order_item.customer_id
As in:
select
   customer.name,
   order_item.order_date
from
   customer
   join order_item
       on customer.id = order_item.customer_id
Using Postgres' "explain plan" functionality, we can see how its query planner expects to execute the query.
Hash Join  (cost=38.58..74.35 rows=2040 width=36)
 Hash Cond: (order_item.customer_id = customer.id)
 ->  Seq Scan on order_item  (cost=0.00..30.40 rows=2040 width=8)
 ->  Hash  (cost=22.70..22.70 rows=1270 width=36)
       ->  Seq Scan on customer  (cost=0.00..22.70 rows=1270 width=36)
Notice that the condition order_item.customer_id = customer.id is being serviced by a Seq Scan, a sequential scan across the order_items table. That means Postgres intends to sequentially iterate over each row in the table to identify the value of customer_id.
Next, if we index order_item.customer_id and recompute the query plan:
create index ix_order_item_customer_id on order_item(customer_id);
explain
select
   customer.name,
   order_item.order_date
from
   customer
   join order_item
       on customer.id = order_item.customer_id
We get the query plan:
Hash Join  (cost=38.58..74.35 rows=2040 width=36)
 Hash Cond: (order_item.customer_id = customer.id)
 ->  Seq Scan on order_item  (cost=0.00..30.40 rows=2040 width=8)
 ->  Hash  (cost=22.70..22.70 rows=1270 width=36)
       ->  Seq Scan on customer  (cost=0.00..22.70 rows=1270 width=36)
Note that nothing changed.
We get an identical result because Postgres' query planner is clever enough to know that a Seq Scan over an empty table is extremely fast, so theres no reason for it to reach out to an index. As more rows are inserted into the order_item table the tradeoff between sequentially scanning and retriving the index steadily tip in favor of the index. Rather than manually finding this inflection point, we can hint to the query planner that we'd like to use indexes by disabling sequentials scans except where they are the only available option. To provides that hint we can use:
set local enable_seqscan = off;
With that change:
set local enable_seqscan = off;
explain
select
   customer.name,
   order_item.order_date
from
   customer
   join order_item
       on customer.id = order_item.customer_id
We get the query plan:
Hash Join  (cost=79.23..159.21 rows=2040 width=36)
 Hash Cond: (order_item.customer_id = customer.id)
 ->  Index Scan using ix_order_item_customer_id on order_item  (cost=0.15..74.75 rows=2040 width=8)
 ->  Hash  (cost=63.20..63.20 rows=1270 width=36)
       ->  Index Scan using customer_pkey on customer  (cost=0.15..63.20 rows=1270 width=36)
The new plan services the order_item.customer_id = customer.id join condition using an Index Scan on ix_order_item_customer_id which is far more efficient at scale.

Customizing Postgres configs

Each Supabase project is a pre-configured Postgres cluster. You can override some configuration settings to suit your needs. This is an advanced topic, and we don't recommend touching these settings unless it is necessary.
Customizing Postgres configurations provides advanced control over your database, but inappropriate settings can lead to severe performance degradation or project instability.
Viewing settings#
To list all Postgres settings and their descriptions, run:
select * from pg_settings;
Configurable settings#
User-context settings#
The pg_settings table's context column specifies the requirements for changing a setting. By default, those with a user context can be changed at the role or database level with SQL.
To list all user-context settings, run:
select * from pg_settings where context = 'user';
As an example, the statement_timeout setting can be altered:
alter database "postgres" set "statement_timeout" TO '60s';
To verify the change, execute:
show "statement_timeout";
Superuser settings#
Some settings can only be modified by a superuser. Supabase pre-enables the supautils extension, which allows the postgres role to retain certain superuser privileges. It enables modification of the below reserved configurations at the role level:
Setting
Description
auto_explain.log_min_duration
Logs query plans taking longer than this duration.
auto_explain.log_nested_statements
Log nested statements' plans.
log_min_messages
Minimum severity level of messages to log.
pg_net.ttl
Sets how long the pg_net extension saves responses
pg_net.batch_size
Sets how many requests the pg_net extension can make per second
pgaudit.*
Configures the PGAudit extension. The log_parameter is still restricted to protect secrets
pgrst.*
PostgREST settings
plan_filter.*
Configures the pg_plan_filter extension
session_replication_role
Sets the session's behavior for triggers and rewrite rules.
track_io_timing
Collects timing statistics for database I/O activity.

For example, to enable log_nested_statements for the postgres role, execute:
alter role "postgres" set "auto_explain.log_nested_statements" to 'on';
To view the change:
select
 rolname,
 rolconfig
from pg_roles
where rolname = 'postgres';
CLI configurable settings#
While many Postgres parameters are configurable directly, some configurations can be changed with the Supabase CLI at the system level.
CLI changes permanently overwrite default settings, so reset all and set to default commands won't revert to the original values.
In order to overwrite the default settings, you must have Owner or Administrator privileges within your organizations.
CLI supported parameters#
If a setting you need is not yet configurable, share your use case with us! Let us know what setting you'd like to control, and we'll consider adding support in future updates.
The following parameters are available for overrides:
effective_cache_size
logical_decoding_work_mem (CLI only)
maintenance_work_mem
max_connections (CLI only)
max_locks_per_transaction (CLI only)
max_parallel_maintenance_workers
max_parallel_workers_per_gather
max_parallel_workers
max_replication_slots (CLI only)
max_slot_wal_keep_size (CLI only)
max_standby_archive_delay (CLI only)
max_standby_streaming_delay (CLI only)
max_wal_size (CLI only)
max_wal_senders (CLI only)
max_worker_processes (CLI only)
session_replication_role
shared_buffers (CLI only)
statement_timeout
track_activity_query_size
track_commit_timestamp
wal_keep_size (CLI only)
wal_sender_timeout (CLI only)
work_mem
Managing Postgres configuration with the CLI#
To start:
Install Supabase CLI 1.69.0+.
Log in to your Supabase account using the CLI.
To update Postgres configurations, use the postgres config command:
supabase --experimental \
--project-ref <project-ref> \
postgres-config update --config shared_buffers=250MB
By default, the CLI will merge any provided config overrides with any existing ones. The --replace-existing-overrides flag can be used to instead force all existing overrides to be replaced with the ones being provided:
supabase --experimental \
--project-ref <project-ref> \
postgres-config update --config max_parallel_workers=3 \
--replace-existing-overrides
To delete specific configuration overrides, use the postgres-config delete command:
supabase --experimental \
--project-ref <project-ref> \
postgres-config delete --config shared_buffers,work_mem
By default, changing the configuration, whether by updating or deleting, causes the database and all associated read replicas to restart. You can use the --no-restart flag to prevent this behavior, and attempt to reload the updated configuration without a restart. Refer to the Postgres documentation to determine if a given parameter can be reloaded without a restart.
Read Replicas and Custom Config
Postgres requires several parameters to be synchronized between the Primary cluster and Read Replicas.
By default, Supabase ensures that this propagation is executed correctly. However, if the --no-restart behavior is used in conjunction with parameters that cannot be reloaded without a restart, the user is responsible for ensuring that both the primaries and the read replicas get restarted in a timely manner to ensure a stable running state. Leaving the configuration updated, but not utilized (via a restart) in such a case can result in read replica failure if the primary, or a read replica, restarts in isolation (e.g. due to an out-of-memory event, or hardware failure).
supabase --experimental \
--project-ref <project-ref> \
postgres-config delete --config shared_buffers --no-restart
Resetting to default config#
To reset a setting to its default value at the database level:
-- reset a single setting at the database level
alter database "postgres" set "<setting_name>" to default;
-- reset all settings at the database level
alter database "postgres" reset all;
For role level configurations, you can run:
alter role "<role_name>" set "<setting_name>" to default;
Considerations#
Changes through the CLI might restart the database causing momentary disruption to existing database connections; in most cases this should not take more than a few seconds. However, you can use the --no-restart flag to bypass the restart and keep the connections intact. Keep in mind that this depends on the specific configuration changes you're making. if the change requires a restart, using the --no-restart flag will prevent the restart but you won't see those changes take effect until a restart is manually triggered. Additionally, some parameters are required to be the same on Primary and Read Replicas; not restarting in these cases can result in read replica failure if the Primary/Read Replicas restart in isolation.
Custom Postgres Config will always override the default optimizations generated by Supabase. When changing compute add-ons, you should also review and update your custom Postgres Config to ensure they remain compatible and effective with the updated compute.
Some parameters (e.g. wal_keep_size) can increase disk utilization, triggering disk expansion, which in turn can lead to increases in your bill.
Timeouts
Extend database timeouts to execute longer transactions

Dashboard and Client queries have a max-configurable timeout of 60 seconds. For longer transactions, use Supavisor or direct connections.
Change Postgres timeout#
You can change the Postgres timeout at the:
Session level
Function level
Global level
Role level
Session level#
Session level settings persist only for the duration of the connection.
Set the session timeout by running:
set statement_timeout = '10min';
Because it applies to sessions only, it can only be used with connections through Supavisor in session mode (port 5432) or a direct connection. It cannot be used in the Dashboard, with the Supabase Client API, nor with Supavisor in Transaction mode (port 6543).
This is most often used for single, long running, administrative tasks, such as creating an HSNW index. Once the setting is implemented, you can view it by executing:
SHOW statement_timeout;
See the full guide on changing session timeouts.
Function level#
This works with the Database REST API when called from the Supabase client libraries:
create or replace function myfunc()
returns void as $$
select pg_sleep(3); -- simulating some long-running process
$$
language sql
set statement_timeout TO '4s'; -- set custom timeout
This is mostly for recurring functions that need a special exemption for runtimes.
Role level#
This sets the timeout for a specific role.
The default role timeouts are:
anon: 3s
authenticated: 8s
service_role: none (defaults to the authenticator role's 8s timeout if unset)
postgres: none (capped by default global timeout to be 2min)
Run the following query to change a role's timeout:
alter role example_role set statement_timeout = '10min'; -- could also use seconds '10s'
If you are changing the timeout for the Supabase Client API calls, you will need to reload PostgREST to reflect the timeout changes by running the following script:
NOTIFY pgrst, 'reload config';
Unlike global settings, the result cannot be checked with SHOW statement_timeout. Instead, run:
select
 rolname,
 rolconfig
from pg_roles
where
 rolname in (
   'anon',
   'authenticated',
   'postgres',
   'service_role'
   -- ,<ANY CUSTOM ROLES>
 );
Global level#
This changes the statement timeout for all roles and sessions without an explicit timeout already set.
alter database postgres set statement_timeout TO '4s';
Check if your changes took effect:
show statement_timeout;
Although not necessary, if you are uncertain if a timeout has been applied, you can run a quick test:
create or replace function myfunc()
returns void as $$
 select pg_sleep(601); -- simulating some long-running process
$$
language sql;
Identifying timeouts#
The Supabase Dashboard contains tools to help you identify timed-out and long-running queries.
Using the Logs Explorer#
Go to the Logs Explorer, and run the following query to identify timed-out events (statement timeout) and queries that successfully run for longer than 10 seconds (duration).
select
 cast(postgres_logs.timestamp as datetime) as timestamp,
 event_message,
 parsed.error_severity,
 parsed.user_name,
 parsed.query,
 parsed.detail,
 parsed.hint,
 parsed.sql_state_code,
 parsed.backend_type
from
 postgres_logs
 cross join unnest(metadata) as metadata
 cross join unnest(metadata.parsed) as parsed
where
 regexp_contains(event_message, 'duration|statement timeout')
 -- (OPTIONAL) MODIFY OR REMOVE
 and parsed.user_name = 'authenticator' -- <--------CHANGE
order by timestamp desc
limit 100;
Using the Query Performance page#
Go to the Query Performance page and filter by relevant role and query speeds. This only identifies slow-running but successful queries. Unlike the Log Explorer, it does not show you timed-out queries.
Understanding roles in logs#
Each API server uses a designated user for connecting to the database:
Role
API/Tool
supabase_admin
Used by Realtime and for project configuration
authenticator
PostgREST
supabase_auth_admin
Auth
supabase_storage_admin
Storage
supabase_replication_admin
Synchronizes Read Replicas
postgres
Supabase Dashboard and External Tools (e.g., Prisma, SQLAlchemy, PSQL...)
Custom roles
External Tools (e.g., Prisma, SQLAlchemy, PSQL...)

Filter by the parsed.user_name field to only retrieve logs made by specific users:
-- find events based on role/server
... query
where
 -- find events from the relevant role
 parsed.user_name = '<ROLE>'

Debugging and monitoring

Database performance is a large topic and many factors can contribute. Some of the most common causes of poor performance include:
An inefficiently designed schema
Inefficiently designed queries
A lack of indexes causing slower than required queries over large tables
Unused indexes causing slow INSERT, UPDATE and DELETE operations
Not enough compute resources, such as memory, causing your database to go to disk for results too often
Lock contention from multiple queries operating on highly utilized tables
Large amount of bloat on your tables causing poor query planning
You can examine your database and queries for these issues using either the Supabase CLI or SQL.
Using the CLI#
The Supabase CLI comes with a range of tools to help inspect your Postgres instances for potential issues. The CLI gets the information from Postgres internals. Therefore, most tools provided are compatible with any Postgres databases regardless if they are a Supabase project or not.
You can find installation instructions for the the Supabase CLI here.
The inspect db command#
The inspection tools for your Postgres database are under then inspect db command. You can get a full list of available commands by running supabase inspect db help.
$ supabase inspect db help
Tools to inspect your Supabase database
Usage:
 supabase inspect db [command]
Available Commands:
 bloat                Estimates space allocated to a relation that is full of dead tuples
 blocking             Show queries that are holding locks and the queries that are waiting for them to be released
 cache-hit            Show cache hit rates for tables and indices
...
Connect to any Postgres database#
Most inspection commands are Postgres agnostic. You can run inspection routines on any Postgres database even if it is not a Supabase project by providing a connection string via --db-url.
For example you can connect to your local Postgres instance:
supabase --db-url postgresql://postgres:postgres@localhost:5432/postgres inspect db bloat
Connect to a Supabase instance#
Working with Supabase, you can link the Supabase CLI with your project:
supabase link --project-ref <project-id>
Then the CLI will automatically connect to your Supabase project whenever you are in the project folder and you no longer need to provide —db-url.
Inspection commands#
Below are the db inspection commands provided, grouped by different use cases.
Some commands might require pg_stat_statements to be enabled or a specific Postgres version to be used.
Disk storage#
These commands are handy if you are running low on disk storage:
bloat - estimates the amount of wasted space
vacuum-stats - gives information on waste collection routines
table-record-counts - estimates the number of records per table
table-sizes - shows the sizes of tables
index-sizes - shows the sizes of individual index
table-index-sizes - shows the sizes of indexes for each table
Query performance#
The commands below are useful if your Postgres database consumes a lot of resources like CPU, RAM or Disk IO. You can also use them to investigate slow queries.
cache-hit - shows how efficient your cache usage is overall
unused-indexes - shows indexes with low index scans
index-usage - shows information about the efficiency of indexes
seq-scans - show number of sequential scans recorded against all tables
long-running-queries - shows long running queries that are executing right now
outliers - shows queries with high execution time but low call count and queries with high proportion of execution time spent on synchronous I/O
Locks#
locks - shows statements which have taken out an exclusive lock on a relation
blocking - shows statements that are waiting for locks to be released
Connections#
role-connections - shows number of active connections for all database roles (Supabase-specific command)
replication-slots - shows information about replication slots on the database
Notes on pg_stat_statements#
Following commands require pg_stat_statements to be enabled: calls, locks, cache-hit, blocking, unused-indexes, index-usage, bloat, outliers, table-record-counts, replication-slots, seq-scans, vacuum-stats, long-running-queries.
When using pg_stat_statements also take note that it only stores the latest 5,000 statements. Moreover, consider resetting the analysis after optimizing any queries by running select pg_stat_statements_reset();
Learn more about pg_stats here.
Using SQL#
If you're seeing an insufficient privilege error when viewing the Query Performance page from the dashboard, run this command:
$ grant pg_read_all_stats to postgres;
Postgres cumulative statistics system#
Postgres collects data about its own operations using the cumulative statistics system. In addition to this, every Supabase project has the pg_stat_statements extension enabled by default. This extension records query execution performance details and is the best way to find inefficient queries. This information can be combined with the Postgres query plan analyzer to develop more efficient queries.
Here are some example queries to get you started.
Most frequently called queries#
select
 auth.rolname,
 statements.query,
 statements.calls,
 -- -- Postgres 13, 14, 15
 statements.total_exec_time + statements.total_plan_time as total_time,
 statements.min_exec_time + statements.min_plan_time as min_time,
 statements.max_exec_time + statements.max_plan_time as max_time,
 statements.mean_exec_time + statements.mean_plan_time as mean_time,
 -- -- Postgres <= 12
 -- total_time,
 -- min_time,
 -- max_time,
 -- mean_time,
 statements.rows / statements.calls as avg_rows
from
 pg_stat_statements as statements
 inner join pg_authid as auth on statements.userid = auth.oid
order by statements.calls desc
limit 100;
This query shows:
query statistics, ordered by the number of times each query has been executed
the role that ran the query
the number of times it has been called
the average number of rows returned
the cumulative total time the query has spent running
the min, max and mean query times.
This provides useful information about the queries you run most frequently. Queries that have high max_time or mean_time times and are being called often can be good candidates for optimization.
Slowest queries by execution time#
select
 auth.rolname,
 statements.query,
 statements.calls,
 -- -- Postgres 13, 14, 15
 statements.total_exec_time + statements.total_plan_time as total_time,
 statements.min_exec_time + statements.min_plan_time as min_time,
 statements.max_exec_time + statements.max_plan_time as max_time,
 statements.mean_exec_time + statements.mean_plan_time as mean_time,
 -- -- Postgres <= 12
 -- total_time,
 -- min_time,
 -- max_time,
 -- mean_time,
 statements.rows / statements.calls as avg_rows
from
 pg_stat_statements as statements
 inner join pg_authid as auth on statements.userid = auth.oid
order by max_time desc
limit 100;
This query will show you statistics about queries ordered by the maximum execution time. It is similar to the query above ordered by calls, but this one highlights outliers that may have high executions times. Queries which have high or mean execution times are good candidates for optimization.
Most time consuming queries#
select
 auth.rolname,
 statements.query,
 statements.calls,
 statements.total_exec_time + statements.total_plan_time as total_time,
 to_char(
   (
     (statements.total_exec_time + statements.total_plan_time) / sum(
       statements.total_exec_time + statements.total_plan_time
     ) over ()
   ) * 100,
   'FM90D0'
 ) || '%' as prop_total_time
from
 pg_stat_statements as statements
 inner join pg_authid as auth on statements.userid = auth.oid
order by total_time desc
limit 100;
This query will show you statistics about queries ordered by the cumulative total execution time. It shows the total time the query has spent running as well as the proportion of total execution time the query has taken up.
Queries which are the most time consuming are not necessarily bad, you may have a very efficient and frequently ran queries that end up taking a large total % time, but it can be useful to help spot queries that are taking up more time than they should.
Hit rate#
Generally for most applications a small percentage of data is accessed more regularly than the rest. To make sure that your regularly accessed data is available, Postgres tracks your data access patterns and keeps this in its shared_buffers cache.
Applications with lower cache hit rates generally perform more poorly since they have to hit the disk to get results rather than serving them from memory. Very poor hit rates can also cause you to burst past your Disk IO limits causing significant performance issues.
You can view your cache and index hit rate by executing the following query:
select
 'index hit rate' as name,
 (sum(idx_blks_hit)) / nullif(sum(idx_blks_hit + idx_blks_read), 0) * 100 as ratio
from pg_statio_user_indexes
union all
select
 'table hit rate' as name,
 sum(heap_blks_hit) / nullif(sum(heap_blks_hit) + sum(heap_blks_read), 0) * 100 as ratio
from pg_statio_user_tables;
This shows the ratio of data blocks fetched from the Postgres shared_buffers cache against the data blocks that were read from disk/OS cache.
If either of your index or table hit rate are < 99% then this can indicate your compute plan is too small for your current workload and you would benefit from more memory. Upgrading your compute is easy and can be done from your project dashboard.
Optimizing poor performing queries#
Postgres has built in tooling to help you optimize poorly performing queries. You can use the query plan analyzer on any expensive queries that you have identified:
explain analyze <query-statement-here>;
When you include analyze in the explain statement, the database attempts to execute the query and provides a detailed query plan along with actual execution times. So, be careful using explain analyze with insert/update/delete queries, because the query will actually run, and could have unintended side-effects.
If you run just explain without the analyze keyword, the database will only perform query planning without actually executing the query. This approach can be beneficial when you want to inspect the query plan without affecting the database or if you encounter timeouts in your queries.
Using the query plan analyzer to optimize your queries is a large topic, with a number of online resources available:
Official docs.
The Art of PostgreSQL.
Postgres Wiki.
Enterprise DB.
You can pair the information available from pg_stat_statements with the detailed system metrics available via your metrics endpoint to better understand the behavior of your DB and the queries you're executing against it.

Debugging performance issues
Debug slow-running queries using the Postgres execution planner.

explain() is a method that provides the Postgres EXPLAIN execution plan of a query. It is a powerful tool for debugging slow queries and understanding how Postgres will execute a given query. This feature is applicable to any query, including those made through rpc() or write operations.
Enabling explain()#
explain() is disabled by default to protect sensitive information about your database structure and operations. We recommend using explain() in a non-production environment. Run the following SQL to enable explain():
-- enable explain
alter role authenticator
set pgrst.db_plan_enabled to 'true';
-- reload the config
notify pgrst, 'reload config';
Using explain()#
To get the execution plan of a query, you can chain the explain() method to a Supabase query:
const { data, error } = await supabase
 .from('instruments')
 .select()
 .explain()
Example data#
To illustrate, consider the following setup of a instruments table:
create table instruments (
 id int8 primary key,
 name text
);
insert into books
 (id, name)
values
 (1, 'violin'),
 (2, 'viola'),
 (3, 'cello');
Expected response#
The response would typically look like this:
Aggregate  (cost=33.34..33.36 rows=1 width=112)
 ->  Limit  (cost=0.00..18.33 rows=1000 width=40)
       ->  Seq Scan on instruments  (cost=0.00..22.00 rows=1200 width=40)
By default, the execution plan is returned in TEXT format. However, you can also retrieve it as JSON by specifying the format parameter.
Production use with pre-request protection#
If you need to enable explain() in a production environment, ensure you protect your database by restricting access to the explain() feature. You can do so by using a pre-request function that filters requests based on the IP address:
create or replace function filter_plan_requests()
returns void as $$
declare
 headers   json := current_setting('request.headers', true)::json;
 client_ip text := coalesce(headers->>'cf-connecting-ip', '');
 accept    text := coalesce(headers->>'accept', '');
 your_ip   text := '123.123.123.123'; -- replace this with your IP
begin
 if accept like 'application/vnd.pgrst.plan%' and client_ip != your_ip then
   raise insufficient_privilege using
     message = 'Not allowed to use application/vnd.pgrst.plan';
 end if;
end; $$ language plpgsql;
alter role authenticator set pgrst.db_pre_request to 'filter_plan_requests';
notify pgrst, 'reload config';
Replace '123.123.123.123' with your actual IP address.
Disabling explain#
To disable the explain() method after use, execute the following SQL commands:
-- disable explain
alter role authenticator
set pgrst.db_plan_enabled to 'false';
-- if you used the above pre-request
alter role authenticator
set pgrst.db_pre_request to '';
-- reload the config
notify pgrst, 'reload config';
upavisor
Troubleshooting Supavisor errors

Supavisor logs are available under Pooler Logs in the Dashboard. The following are common errors and their solutions:
Error Type
Description
Resolution Link
Max client connections reached
This error happens when the number of connections to Supavisor is more than the allowed limit of your compute add-on.
Follow this guide to resolve.
Connection failed {:error, :eaddrnotavail} to 'db.xxx.supabase.co':5432
Supavisor cannot connect to the customer database. This is usually caused if the target database is unable to respond.
N/A
Connection failed {:error, :nxdomain} to 'db.xxx.supabase.co':5432
Supavisor cannot connect to the customer database. This is usually caused if the target database is unable to respond.
N/A
Connection closed when state was authentication
This error happens when either the database doesn’t exist or if the user doesn't have the right credentials.
N/A
Subscribe error: {:error, :worker_not_found}
This log event is emitted when the client tries to connect to the database, but Supavisor does not have the necessary information to route the connection. Try reconnecting to the database as it can take some time for the project information to propagate to Supavisor.
N/A
Subscribe error: {:error, {:badrpc, {:error, {:erpc, :timeout}}}}
This is a timeout error when the communication between different Supavisor nodes takes longer than expected. Try reconnecting to the database.
N/A
Terminating with reason :client_termination when state was :busy
This error happens when the client terminates the connection before the connection with the database is completed.
N/A
Error: received invalid response to GSSAPI negotiation: S
This error happens due to gssencmode parameter not set to disabled.
Follow this guide to resolve.


Replication and change data capture

Replication is the process of copying changes from your database to another location. It's also referred to as change data capture (CDC): capturing all the changes that occur to your data.
Use cases#
You might use replication for:
Analytics and Data Warehousing: Replicate your operational database to analytics platforms like BigQuery for complex analysis without impacting your application's performance.
Data Integration: Keep your data synchronized across different systems and services in your tech stack.
Backup and Disaster Recovery: Maintain up-to-date copies of your data in different locations.
Read Scaling: Distribute read operations across multiple database instances to improve performance.
Replication in Postgres#
Postgres comes with built-in support for replication via publications and replication slots. Refer to the Concepts and terms section to learn how replication works.
Setting up and monitoring replication in Supabase#
Setting up replication
Monitoring replication
If you want to set up a read replica, see Read Replicas instead. If you want to sync your data in real time to a client such as a browser or mobile app, see Realtime instead.
Concepts and terms#
Write-Ahead Log (WAL)#
Postgres uses a system called the Write-Ahead Log (WAL) to manage changes to the database. As you make changes, they are appended to the WAL (which is a series of files (also called "segments"), where the file size can be specified). Once one segment is full, Postgres will start appending to a new segment. After a period of time, a checkpoint occurs and Postgres synchronizes the WAL with your database. Once the checkpoint is complete, then the WAL files can be removed from disk and free up space.
Logical replication and WAL#
Logical replication is a method of replication where Postgres uses the WAL files and transmit those changes to another Postgres database, or a system that supports reading WAL files.
LSN#
LSN is a Log Sequence Number that is used to identify the position of a WAL file in the WAL directory. It is often used to determine the progress of replication in subscribers and calculate the lag of a replication slot.
Logical replication architecture#
When setting up logical replication, three key components are involved:
publication - A set of tables on your primary database that will be published
replication slot - A slot used for replicating the data from a single publication. The slot, when created, will specify the output format of the changes
subscription - A subscription is created from an external system (i.e. another Postgres database) and must specify the name of the publication. If you do not specify a replication slot, one is automatically created
Logical replication output format#
Logical replication is typically output in 2 forms, pgoutput and wal2json. The output method is how Postgres sends changes to any active replication slot.
Logical replication configuration#
When using logical replication, Postgres is then configured to keep WAL files around for longer than it needs them. If the files are removed too quickly, then your replication slot will become inactive and, if the database receives a large number of changes in a short time, then the replication slot can become lost as it was not able to keep up.
In order to mitigate this, Postgres has many options and settings that can be tweaked to manage the WAL usage effectively. Not all of these settings are user configurable as they can impact the stability of your database. For those that are, these should be considered as advanced configuration and not changed without understanding that they can cause additional disk space and resources to be used, as well as incur additional costs.
Setting
Description
User-facing
Default
max_replication_slots
Max count of replication slots allowed
No


wal_keep_size
Minimum size of WAL files to keep for replication
No


max_slot_wal_keep_size
Max WAL size that can be reserved by replication slots
No


checkpoint_timeout
Max time between WAL checkpoints
No




Monitoring replication

Monitoring replication lag is important and there are 3 ways to do this:
Dashboard - Under the Reports of the dashboard, you can view the replication lag of your project
Database -
pg_stat_subscription (subscriber) - if PID is null, then the subscription is not active
pg_stat_subscription_stats - look here for error_count to see if there were issues applying or syncing (if yes, check the logs for why)
pg_replication_slots - use this to check if the slot is active and you can also calculate the lag from here
Metrics - Using the prometheus endpoint for your project
replication_slots_max_lag_bytes - this is the more important one
pg_stat_replication_replay_lag - lag to replay WAL files from the source DB on the target DB (throttled by disk or high activity)
pg_stat_replication_send_lag - lag in sending WAL files from the source DB (a high lag means that the publisher is not being asked to send new WAL files OR a network issues)
Primary#
Replication status and lag#
The pg_stat_replication table shows the status of any replicas connected to the primary database.
select pid, application_name, state, sent_lsn, write_lsn, flush_lsn, replay_lsn, sync_state
from pg_stat_replication;
Replication slot status#
A replication slot can be in one of three states:
active - The slot is active and is receiving data
inactive - The slot is not active and is not receiving data
lost - The slot is lost and is not receiving data
The state can be checked using the pg_replication_slots table:
select slot_name, active, state from pg_replication_slots;
WAL size#
The WAL size can be checked using the pg_ls_waldir() function:
select * from pg_ls_waldir();
Check LSN#
select pg_current_wal_lsn();
Subscriber#
Subscription status#
The pg_subscription table shows the status of any subscriptions on a replica and the pg_subscription_rel table shows the status of each table within a subscription.
The srsubstate column in pg_subscription_rel can be one of the following:
i - Initializing - The subscription is being initialized
d - Data Synchronizing - The subscription is synchronizing data for the first time (i.e. doing the initial copy)
s - Synchronized - The subscription is synchronized
r - Replicating - The subscription is replicating data
SELECT
   sub.subname AS subscription_name,
   relid::regclass AS table_name,
   srel.srsubstate AS replication_state,
   CASE srel.srsubstate
       WHEN 'i' THEN 'Initializing'
       WHEN 'd' THEN 'Data Synchronizing'
       WHEN 's' THEN 'Synchronized'
       WHEN 'r' THEN 'Replicating'
       ELSE 'Unknown'
   END AS state_description,
   srel.srsyncedlsn AS last_synced_lsn
FROM
   pg_subscription sub
JOIN
   pg_subscription_rel srel ON sub.oid = srel.srsubid
ORDER BY
   table_name;
Check LSN#
select pg_last_wal_replay_lsn();

Cron
Schedule Recurring Jobs with Cron Syntax in Postgres

Supabase Cron is a Postgres Module that simplifies scheduling recurring Jobs with cron syntax and monitoring Job runs inside Postgres.
Cron Jobs can be created via SQL or the Integrations -> Cron interface inside the Dashboard, and can run anywhere from every second to once a year depending on your use case.

Every Job can run SQL snippets or database functions with zero network latency or make an HTTP request, such as invoking a Supabase Edge Function, with ease.
For best performance, we recommend no more than 8 Jobs run concurrently. Each Job should run no more than 10 minutes.
How does Cron work?#
Under the hood, Supabase Cron uses the pg_cron Postgres database extension which is the scheduling and execution engine for your Jobs.
The extension creates a cron schema in your database and all Jobs are stored on the cron.job table. Every Job's run and its status is recorded on the cron.job_run_details table.
The Supabase Dashboard provides and interface for you to schedule Jobs and monitor Job runs. You can also do the same with SQL.

What is pg_cron?
pg_cron is a simple cron-based job scheduler for PostgreSQL (10 or higher) that runs inside the database as an extension. It uses the same syntax as regular cron, but it allows you to schedule PostgreSQL commands directly from the database. You can also use '[1-59] seconds' to schedule a job based on an interval.
pg_cron also allows you using '$' to indicate last day of the month.
-- Delete old data on Saturday at 3:30am (GMT)
SELECT cron.schedule('30 3 * * 6', $$DELETE FROM events WHERE event_time < now() - interval '1 week'$$);
 schedule
----------
       42

-- Vacuum every day at 10:00am (GMT)
SELECT cron.schedule('nightly-vacuum', '0 10 * * *', 'VACUUM');
 schedule
----------
       43

-- Change to vacuum at 3:00am (GMT)
SELECT cron.schedule('nightly-vacuum', '0 3 * * *', 'VACUUM');
 schedule
----------
       43

-- Stop scheduling jobs
SELECT cron.unschedule('nightly-vacuum' );
 unschedule 
------------
 t

SELECT cron.unschedule(42);
 unschedule
------------
          t

-- Vacuum every Sunday at 4:00am (GMT) in a database other than the one pg_cron is installed in
SELECT cron.schedule_in_database('weekly-vacuum', '0 4 * * 0', 'VACUUM', 'some_other_database');
 schedule
----------
       44

-- Call a stored procedure every 5 seconds
SELECT cron.schedule('process-updates', '5 seconds', 'CALL process_updates()');

-- Process payroll at 12:00 of the last day of each month
SELECT cron.schedule('process-payroll', '0 12 $ * *', 'CALL process_payroll()');
pg_cron can run multiple jobs in parallel, but it runs at most one instance of a job at a time. If a second run is supposed to start before the first one finishes, then the second run is queued and started as soon as the first run completes.
The schedule uses the standard cron syntax, in which * means "run every time period", and a specific number means "but only at this time":
┌───────────── min (0 - 59)
 │ ┌────────────── hour (0 - 23)
 │ │ ┌─────────────── day of month (1 - 31) or last day of the month ($)
 │ │ │ ┌──────────────── month (1 - 12)
 │ │ │ │ ┌───────────────── day of week (0 - 6) (0 to 6 are Sunday to
 │ │ │ │ │                  Saturday, or use names; 7 is also Sunday)
 │ │ │ │ │
 │ │ │ │ │
 * * * * *

An easy way to create a cron schedule is: crontab.guru.
The code in pg_cron that handles parsing and scheduling comes directly from the cron source code by Paul Vixie, hence the same options are supported.
Installing pg_cron
Install on Red Hat, CentOS, Fedora, Amazon Linux with PostgreSQL 16 using PGDG:
# Install the pg_cron extension
sudo yum install -y pg_cron_16
Install on Debian, Ubuntu with PostgreSQL 16 using apt.postgresql.org:
# Install the pg_cron extension
sudo apt-get -y install postgresql-16-cron
You can also install pg_cron by building it from source:
git clone https://github.com/citusdata/pg_cron.git
cd pg_cron
# Ensure pg_config is in your path, e.g.
export PATH=/usr/pgsql-16/bin:$PATH
make && sudo PATH=$PATH make install
Setting up pg_cron
To start the pg_cron background worker when PostgreSQL starts, you need to add pg_cron to shared_preload_libraries in postgresql.conf. Note that pg_cron does not run any jobs as a long a server is in hot standby mode, but it automatically starts when the server is promoted.
# add to postgresql.conf

# required to load pg_cron background worker on start-up
shared_preload_libraries = 'pg_cron'

By default, the pg_cron background worker expects its metadata tables to be created in the "postgres" database. However, you can configure this by setting the cron.database_name configuration parameter in postgresql.conf.
# add to postgresql.conf

# optionally, specify the database in which the pg_cron background worker should run (defaults to postgres)
cron.database_name = 'postgres'

pg_cron may only be installed to one database in a cluster. If you need to run jobs in multiple databases, use cron.schedule_in_database().
Previously pg_cron could only use GMT time, but now you can adapt your time by setting cron.timezone in postgresql.conf.
# add to postgresql.conf

# optionally, specify the timezone in which the pg_cron background worker should run (defaults to GMT). E.g:
cron.timezone = 'PRC'

After restarting PostgreSQL, you can create the pg_cron functions and metadata tables using CREATE EXTENSION pg_cron.
-- run as superuser:
CREATE EXTENSION pg_cron;

-- optionally, grant usage to regular users:
GRANT USAGE ON SCHEMA cron TO marco;
Ensuring pg_cron can start jobs
Important: By default, pg_cron uses libpq to open a new connection to the local database, which needs to be allowed by pg_hba.conf. It may be necessary to enable trust authentication for connections coming from localhost in for the user running the cron job, or you can add the password to a .pgpass file, which libpq will use when opening a connection.
You can also use a unix domain socket directory as the hostname and enable trust authentication for local connections in pg_hba.conf, which is normally safe:
# Connect via a unix domain socket:
cron.host = '/tmp'

# Can also be an empty string to look for the default directory:
cron.host = ''

Alternatively, pg_cron can be configured to use background workers. In that case, the number of concurrent jobs is limited by the max_worker_processes setting, so you may need to raise that.
# Schedule jobs via background workers instead of localhost connections
cron.use_background_workers = on
# Increase the number of available background workers from the default of 8
max_worker_processes = 20

For security, jobs are executed in the database in which the cron.schedule function is called with the same permissions as the current user. In addition, users are only able to see their own jobs in the cron.job table.
-- View active jobs
select * from cron.job;
Viewing job run details
You can view the status of running and recently completed job runs in the cron.job_run_details:
select * from cron.job_run_details order by start_time desc limit 5;
┌───────┬───────┬─────────┬──────────┬──────────┬───────────────────┬───────────┬──────────────────┬───────────────────────────────┬───────────────────────────────┐
│ jobid │ runid │ job_pid │ database │ username │      command      │  status   │  return_message  │          start_time           │           end_time            │
├───────┼───────┼─────────┼──────────┼──────────┼───────────────────┼───────────┼──────────────────┼───────────────────────────────┼───────────────────────────────┤
│    10 │  4328 │    2610 │ postgres │ marco    │ select process()  │ succeeded │ SELECT 1         │ 2023-02-07 09:30:00.098164+01 │ 2023-02-07 09:30:00.130729+01 │
│    10 │  4327 │    2609 │ postgres │ marco    │ select process()  │ succeeded │ SELECT 1         │ 2023-02-07 09:29:00.015168+01 │ 2023-02-07 09:29:00.832308+01 │
│    10 │  4321 │    2603 │ postgres │ marco    │ select process()  │ succeeded │ SELECT 1         │ 2023-02-07 09:28:00.011965+01 │ 2023-02-07 09:28:01.420901+01 │
│    10 │  4320 │    2602 │ postgres │ marco    │ select process()  │ failed    │ server restarted │ 2023-02-07 09:27:00.011833+01 │ 2023-02-07 09:27:00.72121+01  │
│     9 │  4320 │    2602 │ postgres │ marco    │ select do_stuff() │ failed    │ job canceled     │ 2023-02-07 09:26:00.011833+01 │ 2023-02-07 09:26:00.22121+01  │
└───────┴───────┴─────────┴──────────┴──────────┴───────────────────┴───────────┴──────────────────┴───────────────────────────────┴───────────────────────────────┘
(10 rows)
The records in cron.job_run_details are not cleaned automatically, but every user that can schedule cron jobs also has permission to delete their own cron.job_run_details records.
Especially when you have jobs that run every few seconds, it can be a good idea to clean up regularly, which can easily be done using pg_cron itself:
-- Delete old cron.job_run_details records of the current user every day at noon
SELECT  cron.schedule('delete-job-run-details', '0 12 * * *', $$DELETE FROM cron.job_run_details WHERE end_time < now() - interval '7 days'$$);
If you do not want to use cron.job_run_details at all, then you can add cron.log_run = off to postgresql.conf.
Extension settings
The pg_cron extension supports the following configuration parameters:
Setting
Default
Description
cron.database_name
postgres
Database in which the pg_cron background worker should run.
cron.enable_superuser_jobs
on
Allow jobs to be scheduled as superusers.
cron.host
localhost
Hostname to connect to postgres.
cron.launch_active_jobs
on
When off, disables all active jobs without requiring a server restart
cron.log_min_messages
WARNING
log_min_messages for the launcher bgworker.
cron.log_run
on
Log all run details in thecron.job_run_details table.
cron.log_statement
on
Log all cron statements prior to execution.
cron.max_running_jobs
32
Maximum number of jobs that can be running at the same time.
cron.timezone
GMT
Timezone in which the pg_cron background worker should run.
cron.use_background_workers
off
Use background workers instead of client connections.

Changing settings
To view setting configurations, run:
SELECT * FROM pg_settings WHERE name LIKE 'cron.%';
Setting can be changed in the postgresql.conf file or with the below command:
ALTER SYSTEM SET cron.<parameter> TO '<value>';
cron.log_min_messages and cron.launch_active_jobs have a setting context of sighup. They can be finalized by executing SELECT pg_reload_conf();.
All the other settings have a postmaster context and only take effect after a server restart.
Example use cases
Articles showing possible ways of using pg_cron:
Auto-partitioning using pg_partman
Computing rollups in an analytical dashboard
Deleting old data, vacuum
Feeding cats
Routinely invoking a function
Postgres as a cron server
Managed services
The following table keeps track of which of the major managed Postgres services support pg_cron.
Service
Supported
Aiven
✔️
Alibaba Cloud
✔️
Amazon RDS
✔️
Azure
✔️
Crunchy Bridge
✔️
DigitalOcean
✔️
Google Cloud
✔️
Heroku
❌
Instaclustr
✔️
Neon
✔️
ScaleGrid
✔️
Scaleway
✔️
Supabase
✔️
Tembo
✔️
YugabyteDB
✔️

Quickstart

Job names are case sensitive and cannot be edited once created.
Attempting to create a second Job with the same name (and case) will overwrite the first Job.
Schedule a job#
Dashboard
SQL
Go to the Jobs section to schedule your first Job.
Click on Create job button or navigate to the new Cron Job form here.
Name your Cron Job.
Choose a schedule for your Job by inputting cron syntax (refer to the syntax chart in the form) or natural language.
Input SQL snippet or select a Database function, HTTP request, or Supabase Edge Function.

Cron syntax
You can input seconds for your Job schedule interval as long as you're on Postgres version 15.1.1.61 or later.
Edit a job#
Dashboard
SQL
Go to the Jobs section and find the Job you'd like to edit.
Click on the three vertical dots menu on the right side of the Job and click Edit cron job.
Make your changes and then click Save cron job.

Activate/Deactivate a job#
Dashboard
SQL
Go to the Jobs section and find the Job you'd like to unschedule.
Toggle the Active/Inactive switch next to Job name.

Unschedule a job#
Dashboard
SQL
Go to the Jobs section and find the Job you'd like to delete.
Click on the three vertical dots menu on the right side of the Job and click Delete cron job.
Confirm deletion by entering the Job name.

Inspecting job runs#
Dashboard
SQL
Go to the Jobs section and find the Job you want to see the runs of.
Click on the History button next to the Job name.

Examples#
Delete data every week#
Delete old data every Saturday at 3:30AM (GMT):
select cron.schedule (
 'saturday-cleanup', -- name of the cron job
 '30 3 * * 6', -- Saturday at 3:30AM (GMT)
 $$ delete from events where event_time < now() - interval '1 week' $$
);
Run a vacuum every day#
Vacuum every day at 3:00AM (GMT):
select cron.schedule('nightly-vacuum', '0 3 * * *', 'VACUUM');
Call a database function every 5 minutes#
Create a hello_world() database function and then call it every 5 minutes:
select cron.schedule('call-db-function', '*/5 * * * *', 'SELECT hello_world()');
Call a database stored procedure#
To use a stored procedure, you can call it like this:
select cron.schedule('call-db-procedure', '*/5 * * * *', 'CALL my_procedure()');
Invoke Supabase Edge Function every 30 seconds#
Make a POST request to a Supabase Edge Function every 30 seconds:
select
 cron.schedule(
   'invoke-function-every-half-minute',
   '30 seconds',
   $$
   select
     net.http_post(
         url:='https://project-ref.supabase.co/functions/v1/function-name',
         headers:=jsonb_build_object('Content-Type','application/json', 'Authorization', 'Bearer ' || 'YOUR_ANON_KEY'),
         body:=jsonb_build_object('time', now() ),
         timeout_milliseconds:=5000
     ) as request_id;
   $$
 );
This requires the pg_net extension to be enabled.
Caution: Scheduling system maintenance#
Be extremely careful when setting up Jobs for system maintenance tasks as they can have unintended consequences.
For instance, scheduling a command to terminate idle connections with pg_terminate_backend(pid) can disrupt critical background processes like nightly backups. Often, there is an existing Postgres setting, such as idle_session_timeout, that can perform these common maintenance tasks without the risk.
Reach out to Supabase Support if you're unsure if that applies to your use case.

Install

Install the Supabase Cron Postgres Module to begin scheduling recurring Jobs.
Dashboard
SQL
Go to the Cron Postgres Module under Integrations in the Dashboard.
Enable the pg_cron extension.
Uninstall#
Uninstall Supabase Cron by disabling the pg_cron extension:
drop extension if exists pg_cron;
Disabling the pg_cron extension will permanently delete all Jobs.

Subscribing to Database Changes
Listen to database changes in real-time from your website or application.

You can use Supabase to subscribe to real-time database changes. There are two options available:
Broadcast. This is the recommended method for scalability and security.
Postgres Changes. This is a simpler method. It requires less setup, but does not scale as well as Broadcast.
Using Broadcast#
To automatically send messages when a record is created, updated, or deleted, we can attach a Postgres trigger to any table. Supabase Realtime provides a realtime.broadcast_changes() function which we can use in conjunction with a trigger. This function will use a private channel and needs broadcast authorization RLS policies to be met.
Broadcast authorization#
Realtime Authorization is required for receiving Broadcast messages. This is an example of a policy that allows authenticated users to listen to messages from topics:
create policy "Authenticated users can receive broadcasts"
on "realtime"."messages"
for select
to authenticated
using ( true );
Create a trigger function#
Let's create a function that we can call any time a record is created, updated, or deleted. This function will make use of some of Postgres's native trigger variables. For this example, we want to have a topic with the name topic:<record id> to which we're going to broadcast events.
create or replace function public.your_table_changes()
returns trigger
security definer
language plpgsql
as $$
begin
 perform realtime.broadcast_changes(
   'topic:' || coalesce(NEW.topic, OLD.topic) ::text, -- topic - the topic to which we're broadcasting
   TG_OP,                                             -- event - the event that triggered the function
   TG_OP,                                             -- operation - the operation that triggered the function
   TG_TABLE_NAME,                                     -- table - the table that caused the trigger
   TG_TABLE_SCHEMA,                                   -- schema - the schema of the table that caused the trigger
   NEW,                                               -- new record - the record after the change
   OLD                                                -- old record - the record before the change
 );
 return null;
end;
$$;
Create a trigger#
Let's set up a trigger so the function is executed after any changes to the table.
create trigger handle_your_table_changes
after insert or update or delete
on public.your_table
for each row
execute function your_table_changes ();
Listening on client side#
Finally, on the client side, listen to the topic topic:<record_id> to receive the events. Remember to set the channel as a private channel, since realtime.broadcast_changes uses Realtime Authorization.
const gameId = 'id'
await supabase.realtime.setAuth() // Needed for Realtime Authorization
const changes = supabase
 .channel(`topic:${gameId}`, {
   config: { private: true },
 })
 .on('broadcast', { event: 'INSERT' }, (payload) => console.log(payload))
 .on('broadcast', { event: 'UPDATE' }, (payload) => console.log(payload))
 .on('broadcast', { event: 'DELETE' }, (payload) => console.log(payload))
 .subscribe()
Using Postgres Changes#
Postgres Changes are simple to use, but have some limitations as your application scales. We recommend using Broadcast for most use cases.
Enable Postgres Changes#
You'll first need to create a supabase_realtime publication and add your tables (that you want to subscribe to) to the publication:
begin;
-- remove the supabase_realtime publication
drop
 publication if exists supabase_realtime;
-- re-create the supabase_realtime publication with no tables
create publication supabase_realtime;
commit;
-- add a table called 'messages' to the publication
-- (update this to match your tables)
alter
 publication supabase_realtime add table messages;
Streaming inserts#
You can use the INSERT event to stream all new rows.
const channel = supabase
 .channel('schema-db-changes')
 .on(
   'postgres_changes',
   {
     event: 'INSERT',
     schema: 'public',
   },
   (payload) => console.log(payload)
 )
 .subscribe()
Streaming updates#
You can use the UPDATE event to stream all updated rows.
const channel = supabase
 .channel('schema-db-changes')
 .on(
   'postgres_changes',
   {
     event: 'UPDATE',
     schema: 'public',
   },
   (payload) => console.log(payload)
 )
 .subscribe()

Supabase Queues
Durable Message Queues with Guaranteed Delivery in Postgres

Supabase Queues is a Postgres-native durable Message Queue system with guaranteed delivery built on the pgmq database extension. It offers developers a seamless way to persist and process Messages in the background while improving the resiliency and scalability of their applications and services.
Queues couples the reliability of Postgres with the simplicity Supabase's platform and developer experience, enabling developers to manage Background Tasks with zero configuration.
Features#
Postgres Native
Built on top of the pgmq database extension, create and manage Queues with any Postgres tooling.
Guaranteed Message Delivery
Messages added to Queues are guaranteed to be delivered to your consumers.
Exactly Once Message Delivery
A Message is delivered exactly once to a consumer within a customizable visibility window.
Message Durability and Archival
Messages are stored in Postgres and you can choose to archive them for analytical or auditing purposes.
Granular Authorization
Control client-side consumer access to Queues with API permissions and Row Level Security (RLS) policies.
Queue Management and Monitoring
Create, manage, and monitor Queues and Messages in the Supabase Dashboard.
Quickstart
Learn how to use Supabase Queues to add and read messages

This guide is an introduction to interacting with Supabase Queues via the Dashboard and official client library. Check out Queues API Reference for more details on our API.
Concepts#
Supabase Queues is a pull-based Message Queue consisting of three main components: Queues, Messages, and Queue Types.
Pull-Based Queue#
A pull-based Queue is a Message storage and delivery system where consumers actively fetch Messages when they're ready to process them - similar to constantly refreshing a webpage to display the latest updates. Our pull-based Queues process Messages in a First-In-First-Out (FIFO) manner without priority levels.
Message#
A Message in a Queue is a JSON object that is stored until a consumer explicitly processes and removes it, like a task waiting in a to-do list until someone checks and completes it.
Queue types#
Supabase Queues offers three types of Queues:
Basic Queue: A durable Queue that stores Messages in a logged table.
Unlogged Queue: A transient Queue that stores Messages in an unlogged table for better performance but may result in loss of Queue Messages.
Partitioned Queue (Coming Soon): A durable and scalable Queue that stores Messages in multiple table partitions for better performance.
Create Queues#
To get started, navigate to the Supabase Queues Postgres Module under Integrations in the Dashboard and enable the pgmq extension.
pgmq extension is available in Postgres version 15.6.1.143 or later.

On the Queues page:
Click Add a new queue button
If you've already created a Queue click the Create a queue button instead.
Name your queue
Queue names can only be lowercase and hyphens and underscores are permitted.
Select your Queue Type

What happens when you create a queue?#
Every new Queue creates two tables in the pgmq schema. These tables are pgmq.q_<queue_name> to store and process active messages and pgmq.a_<queue_name> to store any archived messages.
A "Basic Queue" will create pgmq.q_<queue_name> and pgmq.a_<queue_name> tables as logged tables.
However, an "Unlogged Queue" will create pgmq.q_<queue_name> as an unlogged table for better performance while sacrificing durability. The pgmq.a_<queue_name> table will still be created as a logged table so your archived messages remain safe and secure.
Expose Queues to client-side consumers#
Queues, by default, are not exposed over Supabase Data API and are only accessible via Postgres clients.
However, you may grant client-side consumers access to your Queues by enabling the Supabase Data API and granting permissions to the Queues API, which is a collection of database functions in the pgmq_public schema that wraps the database functions in the pgmq schema.
This is to prevent direct access to the pgmq schema and its tables (RLS is not enabled by default on any tables) and database functions.
To get started, navigate to the Queues Settings page and toggle on “Expose Queues via PostgREST”. Once enabled, Supabase creates and exposes a pgmq_public schema containing database function wrappers to a subset of pgmq's database functions.

Enable RLS on your tables in pgmq schema#
For security purposes, you must enable Row Level Security (RLS) on all Queue tables (all tables in pgmq schema that begin with q_) if the Data API is enabled.
You’ll want to create RLS policies for any Queues you want your client-side consumers to interact with.

Grant permissions to pgmq_public database functions#
On top of enabling RLS and writing RLS policies on the underlying Queue tables, you must grant the correct permissions to the pgmq_public database functions for each Data API role.
The permissions required for each Queue API database function:
Operations
Permissions Required
send send_batch
Select Insert
read pop
Select Update
archive delete
Select Delete

To manage your queue permissions, click on the Queue Settings button.

Then enable the required roles permissions.

postgres and service_role roles should never be exposed client-side.
Enqueueing and dequeueing messages#
Once your Queue has been created, you can begin enqueueing and dequeueing Messages.
Here's a TypeScript example using the official Supabase client library:
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'supabaseURL'
const supabaseKey = 'supabaseKey'
const supabase = createClient(supabaseUrl, supabaseKey)
const QueuesTest: React.FC = () => {
 //Add a Message
 const sendToQueue = async () => {
   const result = await supabase.schema('pgmq_public').rpc('send', {
     queue_name: 'foo',
     message: { hello: 'world' },
     sleep_seconds: 30,
   })
   console.log(result)
 }
 //Dequeue Message
 const popFromQueue = async () => {
   const result = await supabase.schema('pgmq_public').rpc('pop', { queue_name: 'foo' })
   console.log(result)
 }
 return (
   <div className="p-6">
     <h2 className="text-2xl font-bold mb-4">Queue Test Component</h2>
     <button
       onClick={sendToQueue}
       className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
     >
       Add Message
     </button>
     <button
       onClick={popFromQueue}
       className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
     >
       Pop Message
     </button>
   </div>
 )
}
export default QueuesTest

PGMQ Extension

pgmq is a lightweight message queue built on Postgres.
Features#
Lightweight - No background worker or external dependencies, just Postgres functions packaged in an extension
"exactly once" delivery of messages to a consumer within a visibility timeout
API parity with AWS SQS and RSMQ
Messages stay in the queue until explicitly removed
Messages can be archived, instead of deleted, for long-term retention and replayability
Enable the extension#
create extension pgmq;
Usage #
Queue management#
create#
Create a new queue.
pgmq.create(queue_name text)
returns void
Parameters:
Parameter
Type
Description
queue_name
text
The name of the queue

Example:
select from pgmq.create('my_queue');
create
--------
create_unlogged#
Creates an unlogged table. This is useful when write throughput is more important than durability.
See Postgres documentation for unlogged tables for more information.
pgmq.create_unlogged(queue_name text)
returns void
Parameters:
Parameter
Type
Description
queue_name
text
The name of the queue

Example:
select pgmq.create_unlogged('my_unlogged');
create_unlogged
-----------------

detach_archive#
Drop the queue's archive table as a member of the PGMQ extension. Useful for preventing the queue's archive table from being drop when drop extension pgmq is executed.
This does not prevent the further archives() from appending to the archive table.
pgmq.detach_archive(queue_name text)
Parameters:
Parameter
Type
Description
queue_name
text
The name of the queue

Example:
select * from pgmq.detach_archive('my_queue');
detach_archive
----------------

drop_queue#
Deletes a queue and its archive table.
pgmq.drop_queue(queue_name text)
returns boolean
Parameters:
Parameter
Type
Description
queue_name
text
The name of the queue

Example:
select * from pgmq.drop_queue('my_unlogged');
drop_queue
------------
t
Sending messages#
send#
Send a single message to a queue.
pgmq.send(
   queue_name text,
   msg jsonb,
   delay integer default 0
)
returns setof bigint
Parameters:
Parameter
Type
Description
queue_name
text
The name of the queue
msg
jsonb
The message to send to the queue
delay
integer
Time in seconds before the message becomes visible. Defaults to 0.

Example:
select * from pgmq.send('my_queue', '{"hello": "world"}');
send
------
   4

send_batch#
Send 1 or more messages to a queue.
pgmq.send_batch(
   queue_name text,
   msgs jsonb[],
   delay integer default 0
)
returns setof bigint
Parameters:
Parameter
Type
Description
queue_name
text
The name of the queue
msgs
jsonb[]
Array of messages to send to the queue
delay
integer
Time in seconds before the messages becomes visible. Defaults to 0.

select * from pgmq.send_batch(
   'my_queue',
   array[
     '{"hello": "world_0"}'::jsonb,
     '{"hello": "world_1"}'::jsonb
   ]
);
send_batch
------------
         1
         2

Reading messages#
read#
Read 1 or more messages from a queue. The VT specifies the delay in seconds between reading and the message becoming invisible to other consumers.
pgmq.read(
   queue_name text,
   vt integer,
   qty integer
)
returns setof pgmq.message_record
Parameters:
Parameter
Type
Description
queue_name
text
The name of the queue
vt
integer
Time in seconds that the message become invisible after reading
qty
integer
The number of messages to read from the queue. Defaults to 1

Example:
select * from pgmq.read('my_queue', 10, 2);
msg_id | read_ct |          enqueued_at          |              vt               |       message
--------+---------+-------------------------------+-------------------------------+----------------------
     1 |       1 | 2023-10-28 19:14:47.356595-05 | 2023-10-28 19:17:08.608922-05 | {"hello": "world_0"}
     2 |       1 | 2023-10-28 19:14:47.356595-05 | 2023-10-28 19:17:08.608974-05 | {"hello": "world_1"}
(2 rows)

read_with_poll#
Same as read(). Also provides convenient long-poll functionality.
When there are no messages in the queue, the function call will wait for max_poll_seconds in duration before returning.
If messages reach the queue during that duration, they will be read and returned immediately.
pgmq.read_with_poll(
   queue_name text,
   vt integer,
   qty integer,
   max_poll_seconds integer default 5,
   poll_interval_ms integer default 100
)
returns setof pgmq.message_record
Parameters:
Parameter
Type
Description
queue_name
text
The name of the queue
vt
integer
Time in seconds that the message become invisible after reading.
qty
integer
The number of messages to read from the queue. Defaults to 1.
max_poll_seconds
integer
Time in seconds to wait for new messages to reach the queue. Defaults to 5.
poll_interval_ms
integer
Milliseconds between the internal poll operations. Defaults to 100.

Example:
select * from pgmq.read_with_poll('my_queue', 1, 1, 5, 100);
msg_id | read_ct |          enqueued_at          |              vt               |      message
--------+---------+-------------------------------+-------------------------------+--------------------
     1 |       1 | 2023-10-28 19:09:09.177756-05 | 2023-10-28 19:27:00.337929-05 | {"hello": "world"}

pop#
Reads a single message from a queue and deletes it upon read.
Note: utilization of pop() results in at-most-once delivery semantics if the consuming application does not guarantee processing of the message.
pgmq.pop(queue_name text)
returns setof pgmq.message_record
Parameters:
Parameter
Type
Description
queue_name
text
The name of the queue

Example:
pgmq=# select * from pgmq.pop('my_queue');
msg_id | read_ct |          enqueued_at          |              vt               |      message
--------+---------+-------------------------------+-------------------------------+--------------------
     1 |       2 | 2023-10-28 19:09:09.177756-05 | 2023-10-28 19:27:00.337929-05 | {"hello": "world"}

Deleting/Archiving messages#
delete (single)#
Deletes a single message from a queue.
pgmq.delete (queue_name text, msg_id: bigint)
returns boolean
Parameters:
Parameter
Type
Description
queue_name
text
The name of the queue
msg_id
bigint
Message ID of the message to delete

Example:
select pgmq.delete('my_queue', 5);
delete
--------
t

delete (batch)#
Delete one or many messages from a queue.
pgmq.delete (queue_name text, msg_ids: bigint[])
returns setof bigint
Parameters:
Parameter
Type
Description
queue_name
text
The name of the queue
msg_ids
bigint[]
Array of message IDs to delete

Examples:
Delete two messages that exist.
select * from pgmq.delete('my_queue', array[2, 3]);
delete
--------
     2
     3
Delete two messages, one that exists and one that does not. Message 999 does not exist.
select * from pgmq.delete('my_queue', array[6, 999]);
delete
--------
     6

purge_queue#
Permanently deletes all messages in a queue. Returns the number of messages that were deleted.
purge_queue(queue_name text)
returns bigint
Parameters:
Parameter
Type
Description
queue_name
text
The name of the queue

Example:
Purge the queue when it contains 8 messages;
select * from pgmq.purge_queue('my_queue');
purge_queue
-------------
          8

archive (single)#
Removes a single requested message from the specified queue and inserts it into the queue's archive.
pgmq.archive(queue_name text, msg_id bigint)
returns boolean
Parameters:
Parameter
Type
Description
queue_name
text
The name of the queue
msg_id
bigint
Message ID of the message to archive

Returns
Boolean value indicating success or failure of the operation.
Example; remove message with ID 1 from queue my_queue and archive it:
select * from pgmq.archive('my_queue', 1);
archive
---------
      t

archive (batch)#
Deletes a batch of requested messages from the specified queue and inserts them into the queue's archive.
Returns an array of message ids that were successfully archived.
pgmq.archive(queue_name text, msg_ids bigint[])
RETURNS SETOF bigint
Parameters:
Parameter
Type
Description
queue_name
text
The name of the queue
msg_ids
bigint[]
Array of message IDs to archive

Examples:
Delete messages with ID 1 and 2 from queue my_queue and move to the archive.
select * from pgmq.archive('my_queue', array[1, 2]);
archive
---------
      1
      2
Delete messages 4, which exists and 999, which does not exist.
select * from pgmq.archive('my_queue', array[4, 999]);
archive
---------
      4

Utilities#
set_vt#
Sets the visibility timeout of a message to a specified time duration in the future. Returns the record of the message that was updated.
pgmq.set_vt(
   queue_name text,
   msg_id bigint,
   vt_offset integer
)
returns pgmq.message_record
Parameters:
Parameter
Type
Description
queue_name
text
The name of the queue
msg_id
bigint
ID of the message to set visibility time
vt_offset
integer
Duration from now, in seconds, that the message's VT should be set to

Example:
Set the visibility timeout of message 1 to 30 seconds from now.
select * from pgmq.set_vt('my_queue', 11, 30);
msg_id | read_ct |          enqueued_at          |              vt               |       message
--------+---------+-------------------------------+-------------------------------+----------------------
    1 |       0 | 2023-10-28 19:42:21.778741-05 | 2023-10-28 19:59:34.286462-05 | {"hello": "world_0"}

list_queues#
List all the queues that currently exist.
list_queues()
RETURNS TABLE(
   queue_name text,
   created_at timestamp with time zone,
   is_partitioned boolean,
   is_unlogged boolean
)
Example:
select * from pgmq.list_queues();
     queue_name      |          created_at           | is_partitioned | is_unlogged
----------------------+-------------------------------+----------------+-------------
my_queue             | 2023-10-28 14:13:17.092576-05 | f              | f
my_partitioned_queue | 2023-10-28 19:47:37.098692-05 | t              | f
my_unlogged          | 2023-10-28 20:02:30.976109-05 | f              | t

metrics#
Get metrics for a specific queue.
pgmq.metrics(queue_name: text)
returns table(
   queue_name text,
   queue_length bigint,
   newest_msg_age_sec integer,
   oldest_msg_age_sec integer,
   total_messages bigint,
   scrape_time timestamp with time zone
)
Parameters:
Parameter
Type
Description
queue_name
text
The name of the queue

Returns:
| Attribute | Type | Description |
| :------------------- | :------------------------- | :------------------------------------------------------------------------ | -------------------------------------------------- |
| queue_name | text | The name of the queue |
| queue_length | bigint | Number of messages currently in the queue |
| newest_msg_age_sec | integer | null | Age of the newest message in the queue, in seconds |
| oldest_msg_age_sec | integer | null | Age of the oldest message in the queue, in seconds |
| total_messages | bigint | Total number of messages that have passed through the queue over all time |
| scrape_time | timestamp with time zone | The current timestamp |
Example:
select * from pgmq.metrics('my_queue');
queue_name | queue_length | newest_msg_age_sec | oldest_msg_age_sec | total_messages |          scrape_time
------------+--------------+--------------------+--------------------+----------------+-------------------------------
my_queue   |           16 |               2445 |               2447 |             35 | 2023-10-28 20:23:08.406259-05

metrics_all#
Get metrics for all existing queues.
pgmq.metrics_all()
RETURNS TABLE(
   queue_name text,
   queue_length bigint,
   newest_msg_age_sec integer,
   oldest_msg_age_sec integer,
   total_messages bigint,
   scrape_time timestamp with time zone
)
Returns:
| Attribute | Type | Description |
| :------------------- | :------------------------- | :------------------------------------------------------------------------ | -------------------------------------------------- |
| queue_name | text | The name of the queue |
| queue_length | bigint | Number of messages currently in the queue |
| newest_msg_age_sec | integer | null | Age of the newest message in the queue, in seconds |
| oldest_msg_age_sec | integer | null | Age of the oldest message in the queue, in seconds |
| total_messages | bigint | Total number of messages that have passed through the queue over all time |
| scrape_time | timestamp with time zone | The current timestamp |
select * from pgmq.metrics_all();
     queue_name      | queue_length | newest_msg_age_sec | oldest_msg_age_sec | total_messages |          scrape_time
----------------------+--------------+--------------------+--------------------+----------------+-------------------------------
my_queue             |           16 |               2563 |               2565 |             35 | 2023-10-28 20:25:07.016413-05
my_partitioned_queue |            1 |                 11 |                 11 |              1 | 2023-10-28 20:25:07.016413-05
my_unlogged          |            1 |                  3 |                  3 |              1 | 2023-10-28 20:25:07.016413-05
Types#
message_record#
The complete representation of a message in a queue.
Attribute Name
Type
Description
msg_id
bigint
Unique ID of the message
read_ct
bigint
Number of times the message has been read. Increments on read().
enqueued_at
timestamp with time zone
time that the message was inserted into the queue
vt
timestamp with time zone
Timestamp when the message will become available for consumers to read
message
jsonb
The message payload

Example:
msg_id | read_ct |          enqueued_at          |              vt               |      message
--------+---------+-------------------------------+-------------------------------+--------------------
     1 |       1 | 2023-10-28 19:06:19.941509-05 | 2023-10-28 19:06:27.419392-05 | {"hello": "world"}
Resources#
Official Docs: pgmq/api



