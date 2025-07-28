For a flight booking application handling flight search caching, user sessions, and background job queues in Redis, you can consider the following optimal configuration:
Use Redis as a cache for flight search results to enhance performance by storing frequently accessed data.
Utilize Redis for user session management to maintain session data securely and efficiently.
Employ Redis Lists or Streams for managing background job queues to ensure reliable task processing.
By configuring Redis with suitable eviction policies, persistence options, and adequate memory allocation based on the workload requirements of these components, you can achieve optimal performance and scalability for your flight booking application.
For more details on Redis configurations and best practices, you can refer to the Redis documentation at Redis Configuration Documentation.
For caching flight data that varies in size and frequency in Redis, you can configure memory management by setting the maxmemory directive to specify the maximum memory to use for the cache data. You can use the following guidelines:
Set maxmemory in the redis.conf file or at runtime using CONFIG SET to limit memory usage.
Tailor the maxmemory-policy to suit your needs - consider using allkeys-lru or other eviction policies based on your caching requirements.
Regularly monitor memory usage to avoid OOM (Out of Memory) issues; maintain approximately 20% free memory beyond maxmemory.
For detailed guidance on Redis memory management and cache configuration, refer to the Redis documentation at Key Eviction.

For session data and cached flight results that require durability in Redis, it is recommended to use AOF (Append Only File) persistence settings. AOF logs every write operation, providing greater data protection and durability compared to RDB snapshots, especially for critical data like user sessions and cached flight results.

For more detailed guidance on Redis persistence settings, you can refer to the Redis documentation at Redis Persistence.

For caching flight search results with complex filtering (price, airline, duration, stops) in Redis, you can use a combination of Redis data structures to achieve optimal performance:

Redis Hashes can be utilized to store each flight's details as fields within a hash, allowing easy retrieval of specific details like price, airline, duration, and stops.

Redis Sets can be used to store unique flight IDs based on different filtering criteria such as price ranges, airlines, or stoppage counts.

Redis Sorted Sets can help in storing sorted flight IDs based on specific attributes like price, allowing efficient range queries.

By leveraging these data structures effectively, you can implement caching for flight search results with complex filtering requirements in Redis.

For more information on Redis data structures and their usage, you can refer to the Redis documentation at Redis Data Structures.


For structuring Redis keys for user sessions, flight search cache, and payment processing state to avoid key collisions and ensure efficient lookups:

Use specific patterns incorporating identifiers and categories like "sessions:userid", "flight:flightid", "payment:transaction_id".
Avoid very long keys for efficiency; prefer meaningful keys like "user:1000:session" over overly short keys.
Utilize Redis data structures like Hashes for storing detailed user session data, flight search cache results, and payment processing state.
Consider using unique prefixes for each category to group related keys together.
Ensure keys are organized logically and semantically to facilitate easy retrieval and efficient operations.
For more details on Redis key structuring best practices, you can refer to the Redis documentation on Keyspace.
To implement a job queue for background flight booking confirmations and email notifications in Redis, you can use Redis Lists or Redis Streams. These data structures are suitable for managing queues efficiently in Redis. By pushing messages into the list or stream and processing them by your worker processes, you can achieve a reliable job queue system for handling flight booking confirmations and email notifications.

For more information on Redis patterns and data structures, you can refer to the Redis documentation at Redis Patterns.

To tune Redis for optimal performance when caching API responses from flight booking services, you can focus on the following configuration parameters:

Maxmemory: Set the maximum memory available for cache data storage.
Maxmemory-policy: Choose an eviction policy like allkeys-lru to manage memory when reaching maxmemory.
Persistence: Configure AOF for durability of cached data.
Data Structures: Utilize appropriate structures like Hashes for storing detailed responses efficiently.
By adjusting these parameters according to your caching needs, you can enhance performance and reliability for caching flight booking API responses in Redis.

For more details on Redis configuration and best practices, you can refer to the Redis documentation at Redis Configuration Documentation.

To implement Redis key expiration strategies for different data types:

For short-lived flight search results, set a shorter expiry using the EXPIRE command when storing the data.
For medium-lived user sessions, consider using a moderate TTL either during data insertion or via a background process.
For long-lived user preferences, utilize a longer expiry strategy, ensuring data remains valid over an extended period.
For frequently accessed flight data with complex filtering requirements, consider using a combination of Redis data structures like Hashes for storing flight details and Sets for unique identifiers based on filtering criteria. Leveraging Sorted Sets can aid in efficient range queries, providing optimal performance for your use case.

For more insights on Redis key expiration and performance best practices, refer to the Redis documentation: Redis Key Expiration and Redis Data Structures.

• "What's the recommended Redis connection pooling strategy for a Node.js application handling concurrent flight searches and user sessions?"
For a Node.js application handling concurrent flight searches and user sessions, it is recommended to use a connection pooling strategy with Redis. This strategy involves creating a pool of connections to Redis to efficiently handle concurrent operations without the overhead of establishing a new connection for each request.

By implementing connection pooling, you can manage multiple client connections to Redis effectively, improving performance and resource utilization for handling flight searches and user sessions in your Node.js application.

For more information on Redis connection pooling strategies, you can refer to the Redis documentation at Redis Connection Pooling.

Scaling an Express Application with Redis as a Session Storenode-redis guide (JavaScript)Node.js client for RedisAvailable to Promise in Real-time Inventory Using RedisWelcome to the Node.js Crash Course
• "How should I handle Redis connection failures and implement retry logic for critical operations like session management and payment processing?"
Redis clients usually provide retry mechanisms for handling connection failures. When a connection to a Redis database cannot be established, the client library can be configured to retry connections using parameters like exponential backoff strategies. Clients like redis-py, from version 6.0.0 onwards, automatically retry failed commands. You can customize the retry behavior by using the Retry class to set the number of retry attempts and backoff strategies.

For critical operations like session management and payment processing in Redis, it's recommended to rely on the retry mechanisms available in the Redis client library rather than implementing custom retry logic in the application code.

You can refer to the Redis documentation and your specific client library's documentation for more details on setting up and customizing retry mechanisms in Redis clients.

For further insights, you can check the Redis documentation on Redis Retry Strategies for production usage guidance.

How to Manage Client Reconnections in case of Errors with redis-pyDevelop highly available and resilient apps with Redis Cloud
• "What Redis connection timeout and keepalive settings work best for web applications with variable traffic patterns?"
For web applications with variable traffic patterns, it is recommended to set appropriate Redis connection timeout and keepalive settings to ensure optimal performance and reliability. You can follow these best practices:

Connection Timeout: Configure an appropriate connection timeout value to manage the duration for establishing a connection with Redis. Setting a timeout helps prevent potential delays or bottlenecks in handling requests, especially during peak traffic periods. A common value for connection timeout can be around 1-3 seconds, depending on your application's requirements.

Keepalive Settings: Enable TCP keepalive messages to maintain the connectivity between the web application and Redis server. This ensures that idle connections are not abruptly closed due to inactivity, enhancing the overall stability of the connection. Adjust the keepalive interval based on your network environment and expected traffic patterns. Typical values range from 30 seconds to a few minutes.

By optimizing the connection timeout and keepalive settings in Redis for web applications with variable traffic patterns, you can enhance responsiveness and maintain a reliable connection infrastructure.

For further details on performance tuning and best practices in Redis, you can refer to the Redis documentation on Performance Tuning Best Practices.

Size a Redis Cloud databasenode-redis guide (JavaScript)Best practices
• "How do I properly configure Redis AUTH and access control for a production application handling sensitive user data and payment information?"
To properly configure Redis AUTH and access control for a production application handling sensitive user data and payment information, follow these steps:

Use Strong Redis Passwords: Ensure to use strong passwords to authenticate users to prevent brute force password guessing attacks.
Deactivate Default User Access: Disable the default user access to enforce secure authentication.
Configure Transport Layer Security (TLS): Implement TLS protocols to enhance security and compliance.
Enable Client Certificate Authentication: Utilize client certificate authentication to allow only authorized hosts to access the database.
Access Control List (ACL): Define user roles and Redis ACLs to manage database access effectively.
Require HTTPS for API Endpoints: Enable HTTPS for API endpoints to secure data transmission.
Customize ACL for Role-Based Access: Use role-based ACLs for LDAP authentication if applicable.
For detailed guidance on security practices and configuration for Redis, refer to the Redis documentation on Recommended Security Practices.

Recommended security practicesConfigure database settingsEnable Role-based access control
• "What Redis security features should I enable for a multi-tenant flight booking application (ACLs, TLS, protected mode)?"
For a multi-tenant flight booking application in Redis, you should enable the following security features:

Access Control Lists (ACLs): Implement role-based access control to restrict access based on user roles and permissions, ensuring data isolation between different tenants.
Transport Layer Security (TLS): Enable TLS to encrypt data in transit, enhancing communication security between clients and the Redis server.
Protected Mode: Consider enabling Protected Mode to prevent unauthorized external access to Redis instances, safeguarding against unauthorized connections.
By configuring these security features, you can enhance the overall security posture of your multi-tenant flight booking application in Redis.

For more information on Redis security best practices, you can refer to the Redis documentation on Recommended Security Practices.

SecuritySecurity
• "How should I secure Redis communication between application containers in a Docker environment?"
To secure Redis communication between application containers in a Docker environment, follow these steps:

Use Docker Networking: Utilize Docker's networking features to create a private network for your containers running Redis and application services.

Container Isolation: Ensure that only necessary containers can access the Redis container by setting up proper network configurations and access controls.

Restrict Redis Port: Limit access to the Redis port within the Docker network to prevent unauthorized external connections.

Enable Redis Authentication: Implement Redis authentication using the requirepass option to add an additional layer of security.

Encrypt Communication: Consider using TLS encryption for securing data in transit between Docker containers and Redis.

By implementing these measures, you can enhance the security of Redis communication within a Docker environment.

For detailed guidance on securing Redis connections in various environments, you can refer to the Redis documentation on Recommended Security Practices.

Orchestration
• "What Redis metrics should I monitor for a flight booking application (memory usage, hit rates, connection counts, slow queries)?"
For monitoring a flight booking application in Redis, you should focus on the following key metrics:

Memory Usage: Monitor memory utilization to ensure efficient memory management and avoid potential out-of-memory issues.
Cache Hit Rates: Track cache hit rates to evaluate the effectiveness of caching strategies and optimize performance.
Connection Counts: Monitor database connections to handle concurrent operations efficiently and detect any connection-related issues.
Latency: Keep an eye on query response times to identify slow queries and optimize database performance.
By monitoring these metrics, you can ensure the smooth operation and optimal performance of your flight booking application in Redis.

For further details on monitoring Redis metrics, you can refer to the Redis documentation on Redis Monitoring.

Redis Software Developer Observability PlaybookRedis Enterprise Software observability and monitoring guidanceRedis Enterprise Software observability and monitoring guidanceSize a Redis Cloud database
• "How do I configure Redis logging and monitoring to integrate with Prometheus and Grafana for application observability?"
To configure Redis logging and monitoring for integration with Prometheus and Grafana for application observability:

Enable the Prometheus endpoint in your Redis Cloud subscription on port 8070.
Configure your Prometheus server to scrape metrics from the Redis Cloud Prometheus endpoint.
Use Grafana to visualize and analyze the collected Redis Cloud metrics.
Ensure Redis Cloud Pro access for VPC peering or Private Service Connect.
Monitor core cluster resources like memory utilization, CPU usage, database connections, and key database performance indicators.
Utilize Redis Enterprise Software's observability and monitoring guidance for performance insights.
For detailed information on integrating Redis with Prometheus and Grafana for monitoring and observability, refer to the Redis documentation provided through the link: Redis Enterprise Software observability and monitoring guidance.

Prometheus and Grafana with Redis Enterprise SoftwareReal-time metricsRedis Enterprise Software observability and monitoring guidanceRedis Enterprise Software observability and monitoring guidance
• "What Redis commands help diagnose performance issues and memory usage patterns in production?"
To diagnose performance issues and memory usage patterns in production, you can use various Redis commands:

INFO Command: Utilize INFO command to retrieve comprehensive information about the Redis server, including memory usage, connected clients, and more.

CONFIG GET maxmemory Command: Check the configured maximum memory limit using CONFIG GET maxmemory.

INFO clients Command: Monitor client connections with INFO clients to ensure client concurrency and detect any anomalies.

INFO stats Command: Retrieve statistics on various aspects like cache hit/miss ratio, evicted keys, keyspace size, and workload using INFO stats.

By leveraging these commands, you can gain insights into Redis performance metrics, memory utilization, and connection statistics in a production environment.

For more details on monitoring and optimizing Redis performance, refer to the Redis documentation on Getting Redis Statistics.

Optimizing RedisRedis troubleshooting pocket guideMove from Development to Production with Redis Query EngineMove from Development to Production with Redis Query EngineOptimize clusters
• "Should I use Redis Sentinel or Redis Cluster for a flight booking application, and what are the trade-offs for session storage and caching?"
For a flight booking application, the choice between Redis Sentinel and Redis Cluster depends on your requirements:

Redis Sentinel: Use Redis Sentinel for high availability and failover handling. It ensures session storage and caching can continue even if some Redis nodes fail. Sentinel manages multiple Redis instances, providing automated failover and monitoring.

Redis Cluster: Opt for Redis Cluster for horizontal scalability and partitioning of data across multiple nodes. It offers better performance for large-scale applications but might have more complexity in setup compared to Sentinel.

Considerations:

Session Storage: Redis Sentinel ensures high availability for critical session data, guaranteeing continuous access under node failures.
Caching: If caching needs to scale across many nodes, Redis Cluster is suitable for distributing data and providing high throughput.
Evaluate based on your scalability and failover needs to determine the best choice between Redis Sentinel and Redis Cluster for session storage and caching in your flight booking application.

For further details, refer to the Redis documentation on Redis Sentinel and Redis Cluster.

Redis Anti-Patterns Every Developer Should AvoidScaling an Express Application with Redis as a Session StoreHow to use Redis for API Gateway CachingWelcome to the Node.js Crash CourseManaging Success with Redis
• "How do I configure Redis replication for read-heavy workloads like flight search result caching?"
To configure Redis replication for read-heavy workloads like flight search result caching, you can set up Redis replication using Redis Sentinel or Redis Cluster:

Redis Sentinel: Ideal for ensuring high availability and failover handling in read-heavy scenarios. Sentinel monitors Redis instances and performs failover if necessary, ensuring continuous service.

Redis Cluster: Suitable for horizontal scalability and distributing data across multiple nodes, beneficial for large-scale read-heavy workloads. It provides higher performance but may involve more complexity in setup compared to Sentinel.

Considerations:

For critical read-heavy workloads like flight search result caching, Redis Sentinel can provide robust failover capabilities to maintain uninterrupted access.
If scalability and distribution are crucial for handling increased read requests, Redis Cluster offers partitioning advantages.
Evaluate based on your specific workload requirements to determine whether Redis Sentinel or Redis Cluster is the best fit for configuring Redis replication for read-heavy workloads like flight search result caching.

For detailed information, refer to the Redis documentation on Redis Sentinel and Redis Cluster.

Move from Development to Production with Redis Query EngineUse RedisBest practices for scalable Redis Query EngineConfigure the query performance factor for Redis Query Engine in Redis Enterprise
• "What's the Redis backup and recovery strategy for preserving user sessions and cached data during maintenance?"
To create a Redis backup and recovery strategy for preserving user sessions and cached data during maintenance, follow these steps:

Backups:
Regularly perform Redis RDB snapshots using the SAVE or BGSAVE commands to create backup files of your data.
Consider enabling AOF (Append-Only File) for continuous backup and data recovery in case of crashes.
Store backup files securely in a separate location to prevent data loss.
Recovery:
In case of maintenance or data loss, restore data from backups using the RESTORE command or by restarting Redis with the backup file.
Use Redis replication to maintain data availability across multiple instances for failover scenarios.
By implementing a robust backup strategy with periodic snapshots and enabling AOF, you can ensure data preservation and quick recovery during maintenance operations to safeguard user sessions and cached data.

For more details on Redis backup and recovery strategies, you can refer to the Redis documentation on Persistence.

Configure databasesImport Data into Redis2.0 Introduction to Persistence and DurabilityUse Redis
• "How should I configure Redis for local development vs production environments with different data retention and memory limits?"
To configure Redis for local development vs. production environments with different data retention and memory limits, follow these guidelines:

Local Development:
Data Retention: In local development, you can use smaller data retention periods to facilitate testing and development iterations. Set shorter expiration times for keys or use smaller memory limits to manage data volumes efficiently during development.
Memory Limits: Adjust memory limits based on the available resources on the local development environment. Use lower memory settings to allocate sufficient resources for testing without impacting system performance.
Production Environment:
Data Retention: In production, define appropriate data retention strategies based on your application's requirements. Set longer expiration times for keys or implement key eviction policies to manage data effectively over time.
Memory Limits: Allocate higher memory limits for Redis in the production environment to accommodate larger datasets and ensure optimal performance under varying workloads.
By adapting data retention periods and memory limits according to the specific needs of each environment, you can optimize Redis for local development and production environments effectively.

For further details on Redis configuration best practices, refer to the Redis documentation on Redis Configuration Documentation.

Configure databasesMove from Development to Production with Redis Query EngineMove from Development to Production with Redis Query Engine
• "What's the best way to mock Redis operations in tests while ensuring the mocking accurately reflects Redis behavior?"
To mock Redis operations in tests while ensuring accurate reflection of Redis behavior, consider using libraries like fakeredis, ioredis-mock, or sinon with proxyquire. These tools enable emulation of Redis commands and responses within the testing environment, closely simulating Redis behavior for reliable testing. By utilizing these libraries, you can mock Redis interactions effectively, ensuring test accuracy and consistency with Redis functionality.

For further details on mocking Redis operations in tests, you can refer to the respective documentation for the libraries mentioned above.

Move from Development to Production with Redis Query EngineMove from Development to Production with Redis Query Engine
• "How do I set up Redis in Docker for development with proper data persistence and easy reset capabilities?"
To set up Redis in Docker for development with proper data persistence and easy reset capabilities, follow these steps:

Install Docker: Ensure Docker is installed on your operating system by downloading it from the official Docker website.

Pull Redis Image: Use the following command in a terminal to pull the Redis Docker image:

   docker pull redis/redis-stack-server:latest
Copy code
Run Redis Stack Container: Once the Redis image is downloaded, run the container with Redis Stack capabilities:
   docker run -d --name redisstack -p 6379:6379 redis/redis-stack-server:latest
Copy code
Load Sample Data: Load sample data into Redis using the provided data loader script:
   npm run load all > node src/utils/dataloader.js -- "all"
Copy code
Access Redis CLI: Open another terminal window and run the redis-cli executable in the Docker container to interact with Redis and enter necessary commands.
By following these steps, you can have Redis set up in Docker for development with data persistence and easy reset capabilities.

For more detailed information, you can refer to the Redis documentation on How to Install Redis on Docker.

Orchestration
1. Which Redis modules do we actually need? • The config loads RedisBloom, RediSearch, RedisJSON, and RedisTimeSeries • Are all of these necessary for our flight booking use case?
For a flight booking use case, the Redis modules you mentioned are relevant:
RedisBloom: Useful for probabilistic data structures like HyperLogLog and Bloom Filters, beneficial for analytics and filtering large datasets.
RediSearch: Ideal for implementing full-text search capabilities, enhancing search functionality for flight data and queries.
RedisJSON: Enables storing, updating, and querying JSON documents in Redis, suitable for managing structured data efficiently.
RedisTimeSeries: Designed for working with time-series data, suitable for recording timestamps and analyzing temporal patterns in flight booking data.
These modules cater to different aspects of your use case, providing features essential for flight booking applications such as search, data storage, analytics, and time-series management.
For further details on these Redis modules and their functionalities, you can refer to the Redis documentation linked here.
Redis ExtensibilityRedis Enterprise Software release notes 7.4.2-169 (May 2024)Redis Enterprise Software release notes 6.2.18-49 (October 2022)
2. RediSearch configuration optimization: • Current search-workers is set to 0 - should this be increased for better query performance? • What's the optimal search-max-search-results limit for flight search results? • Should we enable search-partial-indexed-docs for flight data updates?
To optimize RediSearch configuration for a flight booking application:
Adjust Search-Workders: Consider increasing search-workers from 0 to distribute query processing and improve performance.
Optimal Search-Max-Search-Results: Determine the optimal search-max-search-results limit based on the expected number of flight search results to balance performance and resource usage effectively.
Enable Search-Partial-Indexed-Docs: Evaluate enabling search-partial-indexed-docs for flight data updates to enhance query speed while indexing documents partially.
By fine-tuning these RediSearch configurations, you can improve query performance and efficiency for flight search operations.
For more guidance on RediSearch optimization, refer to the Redis documentation for RediSearch configuration details.
For detailed information on RediSearch configurations and best practices, you can refer to the Redis documentation on RediSearch Configuration.
Search and queryRediSearch 1.4 release notesRediSearch 1.0 release notesRediSearch 2.0 release notes
3. Time Series module usage: • Do we need RedisTimeSeries for tracking flight price changes over time? • What should ts-retention-policy be set to for price history data? • Should we use ts-compaction-policy for flight pricing analytics?
To track flight price changes over time using the RedisTimeSeries module:
RedisTimeSeries Usage: RedisTimeSeries is suitable for tracking flight price changes over time, allowing efficient management and analysis of time-series data.
ts-retention-policy: Set ts-retention-policy based on the desired retention period for price history data. Choose a retention policy that aligns with the duration of data you need to retain for flight pricing analysis.
ts-compaction-policy: Consider utilizing ts-compaction-policy for flight pricing analytics to optimize storage and performance by managing data compaction strategies efficiently.
By leveraging RedisTimeSeries functionalities and configuring appropriate retention and compaction policies, you can effectively track and analyze flight price changes over time.
For more details on RedisTimeSeries usage and configuration, refer to the Redis documentation on RedisTimeSeries Module.
Redis Time SeriesUse casesTime seriesBuilding an AI-Powered Video Q&A Application with Redis and LangChain
4. Bloom Filter configuration: • What's the optimal bf-error-rate for flight search result filtering? • How should we size bf-initial-size based on our flight inventory?
For Bloom Filter configuration in your flight search application:
Optimal bf-error-rate: The recommended bf-error-rate for flight search result filtering is generally set to 0.001 to maintain a low false positive rate while conserving memory efficiently.
Sizing bf-initial-size: Determine the bf-initial-size based on the estimated number of unique items in your flight inventory. It is crucial to size it appropriately to avoid under or over-provisioning memory resources for your Bloom Filter.
For more details on configuring Bloom Filters in Redis for flight search applications, you can refer to the Redis documentation on Bloom Filters.
Preventing Duplicate Checkins with RedisConfiguration ParametersBloom filter
. Search engine performance tuning: • Should we increase search-timeout from 500ms for complex flight queries? • What's the right search-max-doctablesize for our flight database size? • Should we adjust search-gc-scan-size for better memory management?
Sorry, I only answer questions about Redis.
Best practices for scalable Redis Query EngineHow to improve the performance of searches over large datasets?Redis Stack 6.2.6 release notesAdvanced capabilities
6. Indexing optimization: • What search-bg-index-sleep-gap works best for real-time flight data updates? • Should we enable search-fork-gc-* settings for large flight datasets?
To optimize indexing for real-time flight data updates in Redis:
Search-bg-index-sleep-gap: Adjust search-bg-index-sleep-gap to balance between real-time updates and indexing efficiency, setting a value that suits the frequency of data updates for optimal performance.
Enable search-fork-gc-* settings: Evaluate enabling search-fork-gc-* settings for large flight datasets to enhance garbage collection processes and memory management for improved performance.
Fine-tuning these settings can enhance indexing performance and memory utilization for efficient handling of real-time flight data updates in Redis.
For further details on indexing optimization in Redis, you can refer to the Redis documentation on Indexes and Performance.
Index management best practices for Redis Query EngineRedis Stack 6.2.6 release notesIndex management best practices for Redis Query EngineBest practices for scalable Redis Query Engine
7. Command category restrictions: • Which command categories (search, json, timeseries, bloom) should different user roles have access to? • How to implement proper ACLs for flight booking vs admin operations?
To implement proper ACLs for flight booking vs admin operations based on the new Redis 8 ACL categories:
User Roles Access:
Flight Booking: Users handling flight booking operations may need access to commands in the search, json, and timeseries categories for search functionality, JSON data operations, and time-series data processing.
Admin Operations: Admin roles typically require broader access, including commands from categories like search, json, timeseries, bloom, cuckoo, topk, cms, and tdigest for managing various data structures efficiently.
ACL Implementation:
Define ACL rules granting specific categories' access based on user roles.
Example:
Flight booking role ACL: +@search +@json +@timeseries
Admin role ACL: +@search +@json +@timeseries +@bloom +@cuckoo +@topk +@cms +@tdigest
By configuring ACL rules with appropriate category access for each user role, you can ensure secure and effective management of Redis commands for flight booking and admin operations.
For more information on Redis ACL categories and configurations in Redis 8, you can refer to the Redis documentation on Redis 8.0 Release Notes.
Redis Open Source 8.0 release notesACLConfigure permissions with Redis ACLsOverview of Redis ACLs in Redis Enterprise Software
8. Module-specific security: • Any security considerations for exposing RediSearch endpoints? • Should JSON operations be restricted to specific users?
To address module-specific security considerations in Redis:
Security for RediSearch Endpoints:
When exposing RediSearch endpoints, ensure secure access control mechanisms are in place.
Implement proper authentication and authorization protocols to limit access to authorized users or services.
Consider encrypting communication channels and following best practices for endpoint security.
Restricting JSON Operations:
Evaluate restricting JSON operations to specific users based on the principle of least privilege.
Implement Role-Based Access Control (RBAC) to define permissions for JSON operations.
Utilize Redis ACL categories to control access to JSON commands based on user roles.
By implementing targeted security measures for RediSearch endpoints and JSON operations, you can enhance the overall security posture of your Redis deployment.
For more information on securing Redis modules and implementing proper access controls, you can refer to the Redis documentation on Recommended Security Practices.
Security
9. Monitoring and observability: • What metrics should we track for each loaded module? • How to monitor search query performance and bloom filter effectiveness?
To monitor Redis modules effectively, track specific metrics for each loaded module:
RedisBloom:
Monitor false positive rates and memory consumption to assess Bloom filter effectiveness.
RediSearch:
Track query response times, indexing performance, and memory usage for search query performance monitoring.
To monitor search query performance and Bloom filter effectiveness:
For search query performance: Monitor query response times, search throughput, and cache hit rates to optimize search operations.
For Bloom filter effectiveness: Keep an eye on false positive rates and memory utilization to evaluate the accuracy and efficiency of the Bloom filter.
For further details on monitoring Redis modules and optimizing performance, you can refer to the Redis documentation on Module Monitoring.
5.0 Introduction to ObservabilityMetrics and alerts for monitoring v1Datadog with Redis EnterpriseRedis Enterprise Software observability and monitoring guidanceRedis Enterprise Software observability and monitoring guidance
10. Configuration validation: ◦ Are there any conflicting settings between modules? ◦ What's the memory overhead of loading all these modules?
To address your questions:
Conflicting Settings between Modules:
Ensure compatibility and avoid conflicts by analyzing module configurations against each other.
Verify configurations that may overlap or contradict in functionalities to prevent inconsistencies.
Memory Overhead of Loading Modules:
Calculate the cumulative memory consumption of all loaded modules.
Consider the memory requirements of individual modules and their combined impact on system resources.
For detailed information on configuration validation and memory overhead assessment when loading multiple Redis modules, refer to the Redis documentation for Redis Enterprise or Redis Software corresponding to your deployment version.
You can explore the Redis documentation for further insights on handling conflicting module settings and estimating memory overhead when utilizing multiple Redis modules efficiently.
Redis Question 1: "What's the recommended search-timeout value in Redis for flight search queries that might involve complex filtering across multiple fields like price, airline, and departure time?" Redis Question 2: "For a Redis database storing approximately 50,000 flight records, what should search-max-doctablesize be set to for optimal memory usage?" Redis Question 3: "When using Redis with frequent flight data updates, should I adjust search-gc-scan-size from the default 100, and what's the impact on Redis memory management?" These are now specifically about Redis configuration parameters and their impact on Redis performance, rather than general application performance questions.
Your question is too long, please refine it
Your request has been interrupted
Redis Question 1: "What's the recommended search-timeout value in Redis for flight search queries that might involve complex filtering across multiple fields like price, airline, and departure time?"
To optimize Redis search queries for flights with complex filtering, consider increasing the search-timeout value to accommodate the processing of intricate queries involving multiple fields like price, airline, and departure time efficiently. By adjusting the search-timeout, you can ensure that the search operations have adequate time to execute complex filters without being prematurely terminated.
For more information on optimizing search queries and Redis configuration, you can refer to the Redis documentation on Search Concepts.
Search conceptsQuerying the Movie DatasetHow to use Redis for Transaction risk scoringInternal design
Redis Question 2: "For a Redis database storing approximately 50,000 flight records, what should search-max-doctablesize be set to for optimal memory usage?"
To optimize memory usage for a Redis database storing approximately 50,000 flight records, you can set search-max-doctablesize to a value that suits your data volume efficiently. Considering the size of your dataset, adjusting search-max-doctablesize to a value that aligns with the number of documents can help optimize memory consumption.
For further details on Redis configuration parameters and memory optimization for search operations, you can refer to the Redis documentation on Configuration Parameters.
Is maxmemory the Maximum Value of Used Memory?1.5 Initial TuningRedis configurationRedis FAQ
3: "When using Redis with frequent flight data updates, should I adjust search-gc-scan-size from the default 100, and what's the impact on Redis memory management?" These are now specifically about Redis configuration parameters and their impact on Redis performance, rather than general application performance questions.
To optimize Redis performance with frequent flight data updates, consider adjusting the search-gc-scan-size parameter from the default 100 to enhance Redis memory management. Adapting this parameter affects the internal garbage collection for index cleanup, potentially impacting memory usage efficiency based on the bulk size configured for cleaning up indexes.
For more insights on Redis configuration parameters and their influence on performance, you can refer to the Redis documentation on Configuration Parameters.




Key eviction
Overview of Redis key eviction policies (LRU, LFU, etc.)
Redis is commonly used as a cache to speed up read accesses to a slower server or database. Since cache entries are copies of persistently-stored data, it is usually safe to evict them when the cache runs out of memory (they can be cached again in the future if necessary).
Redis lets you specify an eviction policy to evict keys automatically when the size of the cache exceeds a set memory limit. Whenever a client runs a new command that adds more data to the cache, Redis checks the memory usage. If it is greater than the limit, Redis evicts keys according to the chosen eviction policy until the total memory used is back below the limit.
Note that when a command adds a lot of data to the cache (for example, a big set intersection stored into a new key), this might temporarily exceed the limit by a large amount.
The sections below explain how to configure the memory limit for the cache and also describe the available eviction policies and when to use them.
Using the maxmemory configuration directive 
The maxmemory configuration directive specifies the maximum amount of memory to use for the cache data. You can set maxmemory with the redis.conf file at startup time. For example, to configure a memory limit of 100 megabytes, you can use the following directive inside redis.conf:
maxmemory 100mb

You can also use CONFIG SET to set maxmemory at runtime using redis-cli:
> CONFIG SET maxmemory 100mb

Set maxmemory to zero to specify that you don't want to limit the memory for the dataset. This is the default behavior for 64-bit systems, while 32-bit systems use an implicit memory limit of 3GB.
When the size of your cache exceeds the limit set by maxmemory, Redis will enforce your chosen eviction policy to prevent any further growth of the cache.
Setting maxmemory for a replicated or persisted instance 
If you are using replication or persistence for a server, Redis will use some RAM as a buffer to store the set of updates waiting to be written to the replicas or AOF files. The memory used by this buffer is not included in the total that is compared to maxmemory to see if eviction is required.
This is because the key evictions themselves generate updates that must be added to the buffer. If the updates were counted among the used memory then in some circumstances, the memory saved by evicting keys would be immediately used up by the update data added to the buffer. This, in turn, would trigger even more evictions and the resulting feedback loop could evict many items from the cache unnecessarily.
If you are using replication or persistence, we recommend that you set maxmemory to leave a little RAM free to store the buffers. Note that this is not necessary for the noeviction policy (see the section below for more information about eviction policies).
The INFO command returns a mem_not_counted_for_evict value in the memory section (you can use the INFO memory option to see just this section). This is the amount of memory currently used by the buffers. Although the exact amount will vary, you can use it to estimate how much to subtract from the total available RAM before setting maxmemory.
Eviction policies 
Use the maxmemory-policy configuration directive to select the eviction policy you want to use when the limit set by maxmemory is reached.
The following policies are available:
noeviction: Keys are not evicted but the server will return an error when you try to execute commands that cache new data. If your database uses replication then this condition only applies to the primary database. Note that commands that only read existing data still work as normal.
allkeys-lru: Evict the least recently used (LRU) keys.
allkeys-lfu: Evict the least frequently used (LFU) keys.
allkeys-random: Evict keys at random.
volatile-lru: Evict the least recently used keys that have the expire field set to true.
volatile-lfu: Evict the least frequently used keys that have the expire field set to true.
volatile-random: Evict keys at random only if they have the expire field set to true.
volatile-ttl: Evict keys with the expire field set to true that have the shortest remaining time-to-live (TTL) value.
The volatile-xxx policies behave like noeviction if no keys have the expire field set to true, or for volatile-ttl, if no keys have a time-to-live value set.
You should choose an eviction policy that fits the way your app accesses keys. You may be able to predict the access pattern in advance but you can also use information from the INFO command at runtime to check or improve your choice of policy (see Using the INFO command below for more information).
As a rule of thumb:
Use allkeys-lru when you expect that a subset of elements will be accessed far more often than the rest. This is a very common case according to the Pareto principle, so allkeys-lru is a good default option if you have no reason to prefer any others.
Use allkeys-random when you expect all keys to be accessed with roughly equal frequency. An example of this is when your app reads data items in a repeating cycle.
Use volatile-ttl if your code can estimate which keys are good candidates for eviction and assign short TTLs to them. Note also that if you make good use of key expiration, then you are less likely to run into the cache memory limit because keys will often expire before they need to be evicted.
The volatile-lru and volatile-random policies are mainly useful when you want to use a single Redis instance for both caching and for a set of persistent keys. However, you should consider running two separate Redis instances in a case like this, if possible.
Also note that setting an expire value for a key costs memory, so a policy like allkeys-lru is more memory efficient since it doesn't need an expire value to operate.
Using the INFO command 
The INFO command provides several pieces of data that are useful for checking the performance of your cache. In particular, the INFO stats section includes two important entries, keyspace_hits (the number of times keys were successfully found in the cache) and keyspace_misses (the number of times a key was requested but was not in the cache). The calculation below gives the percentage of attempted accesses that were satisfied from the cache:
keyspace_hits / (keyspace_hits + keyspace_misses) * 100

Check that this is roughly equal to what you would expect for your app (naturally, a higher percentage indicates better cache performance).
Note:
When the EXISTS command reports that a key is absent then this is counted as a keyspace miss.
If the percentage of hits is lower than expected, then this might mean you are not using the best eviction policy. For example, if you believe that a small subset of "hot" data (that will easily fit into the cache) should account for about 75% of accesses, you could reasonably expect the percentage of keyspace hits to be around 75%. If the actual percentage is lower, check the value of evicted_keys (also returned by INFO stats). A high proportion of evictions would suggest that the wrong keys are being evicted too often by your chosen policy (so allkeys-lru might be a good option here). If the value of evicted_keys is low and you are using key expiration, check expired_keys to see how many keys have expired. If this number is high, you might be using a TTL that is too low or you are choosing the wrong keys to expire and this is causing keys to disappear from the cache before they should.
Other useful pieces of information returned by INFO include:
used_memory_dataset: (memory section) The amount of memory used for cached data. If this is greater than maxmemory, then the difference is the amount by which maxmemory has been exceeded.
current_eviction_exceeded_time: (stats section) The time since the cache last started to exceed maxmemory.
commandstats section: Among other things, this reports the number of times each command issued to the server has been rejected. If you are using noeviction or one of the volatile_xxx policies, you can use this to find which commands are being stopped by the maxmemory limit and how often it is happening.
Approximated LRU algorithm 
The Redis LRU algorithm uses an approximation of the least recently used keys rather than calculating them exactly. It samples a small number of keys at random and then evicts the ones with the longest time since last access.
From Redis 3.0 onwards, the algorithm also tracks a pool of good candidates for eviction. This improves the performance of the algorithm, making it a close approximation to a true LRU algorithm.
You can tune the performance of the algorithm by changing the number of samples to check before every eviction with the maxmemory-samples configuration directive:
maxmemory-samples 5

The reason Redis does not use a true LRU implementation is because it costs more memory. However, the approximation is virtually equivalent for an application using Redis. This figure compares the LRU approximation used by Redis with true LRU.

The test to generate the above graphs filled a Redis server with a given number of keys. The keys were accessed from the first to the last. The first keys are the best candidates for eviction using an LRU algorithm. Later more 50% of keys are added, in order to force half of the old keys to be evicted.
You can see three kind of dots in the graphs, forming three distinct bands.
The light gray band are objects that were evicted.
The gray band are objects that were not evicted.
The green band are objects that were added.
In a theoretical LRU implementation we expect that, among the old keys, the first half will be expired. The Redis LRU algorithm will instead only probabilistically expire the older keys.
As you can see Redis 3.0 does a better job with 5 samples compared to Redis 2.8, however most objects that are among the latest accessed are still retained by Redis 2.8. Using a sample size of 10 in Redis 3.0 the approximation is very close to the theoretical performance of Redis 3.0.
Note that LRU is just a model to predict how likely a given key will be accessed in the future. Moreover, if your data access pattern closely resembles the power law, most of the accesses will be in the set of keys the LRU approximated algorithm can handle well.
In simulations we found that using a power law access pattern, the difference between true LRU and Redis approximation were minimal or non-existent.
However you can raise the sample size to 10 at the cost of some additional CPU usage to closely approximate true LRU, and check if this makes a difference in your cache misses rate.
To experiment in production with different values for the sample size by using the CONFIG SET maxmemory-samples <count> command, is very simple.
LFU eviction 
Starting with Redis 4.0, the Least Frequently Used eviction mode is available. This mode may work better (provide a better hits/misses ratio) in certain cases. In LFU mode, Redis will try to track the frequency of access of items, so the ones used rarely are evicted. This means the keys used often have a higher chance of remaining in memory.
To configure the LFU mode, the following policies are available:
volatile-lfu Evict using approximated LFU among the keys with an expire set.
allkeys-lfu Evict any key using approximated LFU.
LFU is approximated like LRU: it uses a probabilistic counter, called a Morris counter to estimate the object access frequency using just a few bits per object, combined with a decay period so that the counter is reduced over time. At some point we no longer want to consider keys as frequently accessed, even if they were in the past, so that the algorithm can adapt to a shift in the access pattern.
That information is sampled similarly to what happens for LRU (as explained in the previous section of this documentation) to select a candidate for eviction.
However unlike LRU, LFU has certain tunable parameters: for example, how fast should a frequent item lower in rank if it gets no longer accessed? It is also possible to tune the Morris counters range to better adapt the algorithm to specific use cases.
By default Redis is configured to:
Saturate the counter at, around, one million requests.
Decay the counter every one minute.
Those should be reasonable values and were tested experimentally, but the user may want to play with these configuration settings to pick optimal values.
Instructions about how to tune these parameters can be found inside the example redis.conf file in the source distribution. Briefly, they are:
lfu-log-factor 10
lfu-decay-time 1

The decay time is the obvious one, it is the amount of minutes a counter should be decayed, when sampled and found to be older than that value. A special value of 0 means: we will never decay the counter.
The counter logarithm factor changes how many hits are needed to saturate the frequency counter, which is just in the range 0-255. The higher the factor, the more accesses are needed to reach the maximum. The lower the factor, the better is the resolution of the counter for low accesses, according to the following table:
+--------+------------+------------+------------+------------+------------+
| factor | 100 hits   | 1000 hits  | 100K hits  | 1M hits    | 10M hits   |
+--------+------------+------------+------------+------------+------------+
| 0      | 104        | 255        | 255        | 255        | 255        |
+--------+------------+------------+------------+------------+------------+
| 1      | 18         | 49         | 255        | 255        | 255        |
+--------+------------+------------+------------+------------+------------+
| 10     | 10         | 18         | 142        | 255        | 255        |
+--------+------------+------------+------------+------------+------------+
| 100    | 8          | 11         | 49         | 143        | 255        |
+--------+------------+------------+------------+------------+------------+

So basically the factor is a trade off between better distinguishing items with low accesses VS distinguishing items with high accesses. More information is available in the example redis.conf file.
RATE THIS PAGE
★★★★★

Redis persistence
How Redis writes data to disk
Redis Open Source

Persistence refers to the writing of data to durable storage, such as a solid-state disk (SSD). Redis provides a range of persistence options. These include:
RDB (Redis Database): RDB persistence performs point-in-time snapshots of your dataset at specified intervals.
AOF (Append Only File): AOF persistence logs every write operation received by the server. These operations can then be replayed again at server startup, reconstructing the original dataset. Commands are logged using the same format as the Redis protocol itself.
No persistence: You can disable persistence completely. This is sometimes used when caching.
RDB + AOF: You can also combine both AOF and RDB in the same instance.
If you'd rather not think about the tradeoffs between these different persistence strategies, you may want to consider Redis Enterprise's persistence options, which can be pre-configured using a UI.
To learn more about how to evaluate your Redis persistence strategy, read on.
RDB advantages 
RDB is a very compact single-file point-in-time representation of your Redis data. RDB files are perfect for backups. For instance you may want to archive your RDB files every hour for the latest 24 hours, and to save an RDB snapshot every day for 30 days. This allows you to easily restore different versions of the data set in case of disasters.
RDB is very good for disaster recovery, being a single compact file that can be transferred to far data centers, or onto Amazon S3 (possibly encrypted).
RDB maximizes Redis performances since the only work the Redis parent process needs to do in order to persist is forking a child that will do all the rest. The parent process will never perform disk I/O or alike.
RDB allows faster restarts with big datasets compared to AOF.
On replicas, RDB supports partial resynchronizations after restarts and failovers.
RDB disadvantages 
RDB is NOT good if you need to minimize the chance of data loss in case Redis stops working (for example after a power outage). You can configure different save points where an RDB is produced (for instance after at least five minutes and 100 writes against the data set, you can have multiple save points). However you'll usually create an RDB snapshot every five minutes or more, so in case of Redis stopping working without a correct shutdown for any reason you should be prepared to lose the latest minutes of data.
RDB needs to fork() often in order to persist on disk using a child process. fork() can be time consuming if the dataset is big, and may result in Redis stopping serving clients for some milliseconds or even for one second if the dataset is very big and the CPU performance is not great. AOF also needs to fork() but less frequently and you can tune how often you want to rewrite your logs without any trade-off on durability.
AOF advantages 
Using AOF Redis is much more durable: you can have different fsync policies: no fsync at all, fsync every second, fsync at every query. With the default policy of fsync every second, write performance is still great. fsync is performed using a background thread and the main thread will try hard to perform writes when no fsync is in progress, so you can only lose one second worth of writes.
The AOF log is an append-only log, so there are no seeks, nor corruption problems if there is a power outage. Even if the log ends with a half-written command for some reason (disk full or other reasons) the redis-check-aof tool is able to fix it easily.
Redis is able to automatically rewrite the AOF in background when it gets too big. The rewrite is completely safe as while Redis continues appending to the old file, a completely new one is produced with the minimal set of operations needed to create the current data set, and once this second file is ready Redis switches the two and starts appending to the new one.
AOF contains a log of all the operations one after the other in an easy to understand and parse format. You can even easily export an AOF file. For instance even if you've accidentally flushed everything using the FLUSHALL command, as long as no rewrite of the log was performed in the meantime, you can still save your data set just by stopping the server, removing the latest command, and restarting Redis again.
AOF disadvantages 
AOF files are usually bigger than the equivalent RDB files for the same dataset.
AOF can be slower than RDB depending on the exact fsync policy. In general with fsync set to every second performance is still very high, and with fsync disabled it should be exactly as fast as RDB even under high load. Still RDB is able to provide more guarantees about the maximum latency even in the case of a huge write load.
Redis < 7.0
AOF can use a lot of memory if there are writes to the database during a rewrite (these are buffered in memory and written to the new AOF at the end).
All write commands that arrive during rewrite are written to disk twice.
Redis could freeze writing and fsyncing these write commands to the new AOF file at the end of the rewrite.
Ok, so what should I use? 
The general indication you should use both persistence methods is if you want a degree of data safety comparable to what PostgreSQL can provide you.
If you care a lot about your data, but still can live with a few minutes of data loss in case of disasters, you can simply use RDB alone.
There are many users using AOF alone, but we discourage it since to have an RDB snapshot from time to time is a great idea for doing database backups, for faster restarts, and in the event of bugs in the AOF engine.
The following sections will illustrate a few more details about the two persistence models.
Snapshotting 
By default Redis saves snapshots of the dataset on disk, in a binary file called dump.rdb. You can configure Redis to have it save the dataset every N seconds if there are at least M changes in the dataset, or you can manually call the SAVE or BGSAVE commands.
For example, this configuration will make Redis automatically dump the dataset to disk every 60 seconds if at least 1000 keys changed:
save 60 1000

This strategy is known as snapshotting.
How it works 
Whenever Redis needs to dump the dataset to disk, this is what happens:
Redis forks. We now have a child and a parent process.
The child starts to write the dataset to a temporary RDB file.
When the child is done writing the new RDB file, it replaces the old one.
This method allows Redis to benefit from copy-on-write semantics.
Append-only file 
Snapshotting is not very durable. If your computer running Redis stops, your power line fails, or you accidentally kill -9 your instance, the latest data written to Redis will be lost. While this may not be a big deal for some applications, there are use cases for full durability, and in these cases Redis snapshotting alone is not a viable option.
The append-only file is an alternative, fully-durable strategy for Redis. It became available in version 1.1.
You can turn on the AOF in your configuration file:
appendonly yes

From now on, every time Redis receives a command that changes the dataset (e.g. SET) it will append it to the AOF. When you restart Redis it will re-play the AOF to rebuild the state.
Since Redis 7.0.0, Redis uses a multi part AOF mechanism. That is, the original single AOF file is split into base file (at most one) and incremental files (there may be more than one). The base file represents an initial (RDB or AOF format) snapshot of the data present when the AOF is rewritten. The incremental files contains incremental changes since the last base AOF file was created. All these files are put in a separate directory and are tracked by a manifest file.
Log rewriting 
The AOF gets bigger and bigger as write operations are performed. For example, if you are incrementing a counter 100 times, you'll end up with a single key in your dataset containing the final value, but 100 entries in your AOF. 99 of those entries are not needed to rebuild the current state.
The rewrite is completely safe. While Redis continues appending to the old file, a completely new one is produced with the minimal set of operations needed to create the current data set, and once this second file is ready Redis switches the two and starts appending to the new one.
So Redis supports an interesting feature: it is able to rebuild the AOF in the background without interrupting service to clients. Whenever you issue a BGREWRITEAOF, Redis will write the shortest sequence of commands needed to rebuild the current dataset in memory. If you're using the AOF with Redis 2.2 you'll need to run BGREWRITEAOF from time to time. Since Redis 2.4 is able to trigger log rewriting automatically (see the example configuration file for more information).
Since Redis 7.0.0, when an AOF rewrite is scheduled, the Redis parent process opens a new incremental AOF file to continue writing. The child process executes the rewrite logic and generates a new base AOF. Redis will use a temporary manifest file to track the newly generated base file and incremental file. When they are ready, Redis will perform an atomic replacement operation to make this temporary manifest file take effect. In order to avoid the problem of creating many incremental files in case of repeated failures and retries of an AOF rewrite, Redis introduces an AOF rewrite limiting mechanism to ensure that failed AOF rewrites are retried at a slower and slower rate.
How durable is the append only file? 
You can configure how many times Redis will fsync data on disk. There are three options:
appendfsync always: fsync every time new commands are appended to the AOF. Very very slow, very safe. Note that the commands are appended to the AOF after a batch of commands from multiple clients or a pipeline are executed, so it means a single write and a single fsync (before sending the replies).
appendfsync everysec: fsync every second. Fast enough (since version 2.4 likely to be as fast as snapshotting), and you may lose 1 second of data if there is a disaster.
appendfsync no: Never fsync, just put your data in the hands of the Operating System. The faster and less safe method. Normally Linux will flush data every 30 seconds with this configuration, but it's up to the kernel's exact tuning.
The suggested (and default) policy is to fsync every second. It is both fast and relatively safe. The always policy is very slow in practice, but it supports group commit, so if there are multiple parallel writes Redis will try to perform a single fsync operation.
What should I do if my AOF gets truncated? 
It is possible the server crashed while writing the AOF file, or the volume where the AOF file is stored was full at the time of writing. When this happens the AOF still contains consistent data representing a given point-in-time version of the dataset (that may be old up to one second with the default AOF fsync policy), but the last command in the AOF could be truncated. The latest major versions of Redis will be able to load the AOF anyway, just discarding the last non well formed command in the file. In this case the server will emit a log like the following:
* Reading RDB preamble from AOF file...
* Reading the remaining AOF tail...
# !!! Warning: short read while loading the AOF file !!!
# !!! Truncating the AOF at offset 439 !!!
# AOF loaded anyway because aof-load-truncated is enabled

You can change the default configuration to force Redis to stop in such cases if you want, but the default configuration is to continue regardless of the fact the last command in the file is not well-formed, in order to guarantee availability after a restart.
Older versions of Redis may not recover, and may require the following steps:
Make a backup copy of your AOF file.
Fix the original file using the redis-check-aof tool that ships with Redis:
$ redis-check-aof --fix <filename>


Optionally use diff -u to check what is the difference between two files.
Restart the server with the fixed file.
What should I do if my AOF gets corrupted? 
If the AOF file is not just truncated, but corrupted with invalid byte sequences in the middle, things are more complex. Redis will complain at startup and will abort:
* Reading the remaining AOF tail...
# Bad file format reading the append only file: make a backup of your AOF file, then use ./redis-check-aof --fix <filename>

The best thing to do is to run the redis-check-aof utility, initially without the --fix option, then understand the problem, jump to the given offset in the file, and see if it is possible to manually repair the file: The AOF uses the same format of the Redis protocol and is quite simple to fix manually. Otherwise it is possible to let the utility fix the file for us, but in that case all the AOF portion from the invalid part to the end of the file may be discarded, leading to a massive amount of data loss if the corruption happened to be in the initial part of the file.
How it works 
Log rewriting uses the same copy-on-write trick already in use for snapshotting. This is how it works:
Redis >= 7.0
Redis forks, so now we have a child and a parent process.
The child starts writing the new base AOF in a temporary file.
The parent opens a new increments AOF file to continue writing updates. If the rewriting fails, the old base and increment files (if there are any) plus this newly opened increment file represent the complete updated dataset, so we are safe.
When the child is done rewriting the base file, the parent gets a signal, and uses the newly opened increment file and child generated base file to build a temp manifest, and persist it.
Profit! Now Redis does an atomic exchange of the manifest files so that the result of this AOF rewrite takes effect. Redis also cleans up the old base file and any unused increment files.
Redis < 7.0
Redis forks, so now we have a child and a parent process.
The child starts writing the new AOF in a temporary file.
The parent accumulates all the new changes in an in-memory buffer (but at the same time it writes the new changes in the old append-only file, so if the rewriting fails, we are safe).
When the child is done rewriting the file, the parent gets a signal, and appends the in-memory buffer at the end of the file generated by the child.
Now Redis atomically renames the new file into the old one, and starts appending new data into the new file.
How I can switch to AOF, if I'm currently using dump.rdb snapshots? 
If you want to enable AOF in a server that is currently using RDB snapshots, you need to convert the data by enabling AOF via CONFIG command on the live server first.
IMPORTANT: not following this procedure (e.g. just changing the config and restarting the server) can result in data loss!
Redis >= 2.2
Preparations:
Make a backup of your latest dump.rdb file.
Transfer this backup to a safe place.
Switch to AOF on live database:
Enable AOF: redis-cli config set appendonly yes
Optionally disable RDB: redis-cli config set save ""
Make sure writes are appended to the append only file correctly.
IMPORTANT: Update your redis.conf (potentially through CONFIG REWRITE) and ensure that it matches the configuration above. If you forget this step, when you restart the server, the configuration changes will be lost and the server will start again with the old configuration, resulting in a loss of your data.
Next time you restart the server:
Before restarting the server, wait for AOF rewrite to finish persisting the data. You can do that by watching INFO persistence, waiting for aof_rewrite_in_progress and aof_rewrite_scheduled to be 0, and validating that aof_last_bgrewrite_status is ok.
After restarting the server, check that your database contains the same number of keys it contained previously.
Redis 2.0
Make a backup of your latest dump.rdb file.
Transfer this backup into a safe place.
Stop all the writes against the database!
Issue a redis-cli BGREWRITEAOF. This will create the append only file.
Stop the server when Redis finished generating the AOF dump.
Edit redis.conf end enable append only file persistence.
Restart the server.
Make sure that your database contains the same number of keys it contained before the switch.
Make sure that writes are appended to the append only file correctly.
Interactions between AOF and RDB persistence 
Redis >= 2.4 makes sure to avoid triggering an AOF rewrite when an RDB snapshotting operation is already in progress, or allowing a BGSAVE while the AOF rewrite is in progress. This prevents two Redis background processes from doing heavy disk I/O at the same time.
When snapshotting is in progress and the user explicitly requests a log rewrite operation using BGREWRITEAOF the server will reply with an OK status code telling the user the operation is scheduled, and the rewrite will start once the snapshotting is completed.
In the case both AOF and RDB persistence are enabled and Redis restarts the AOF file will be used to reconstruct the original dataset since it is guaranteed to be the most complete.
Backing up Redis data 
Before starting this section, make sure to read the following sentence: Make Sure to Backup Your Database. Disks break, instances in the cloud disappear, and so forth: no backups means huge risk of data disappearing into /dev/null.
Redis is very data backup friendly since you can copy RDB files while the database is running: the RDB is never modified once produced, and while it gets produced it uses a temporary name and is renamed into its final destination atomically using rename(2) only when the new snapshot is complete.
This means that copying the RDB file is completely safe while the server is running. This is what we suggest:
Create a cron job in your server creating hourly snapshots of the RDB file in one directory, and daily snapshots in a different directory.
Every time the cron script runs, make sure to call the find command to make sure too old snapshots are deleted: for instance you can take hourly snapshots for the latest 48 hours, and daily snapshots for one or two months. Make sure to name the snapshots with date and time information.
At least one time every day make sure to transfer an RDB snapshot outside your data center or at least outside the physical machine running your Redis instance.
Backing up AOF persistence 
If you run a Redis instance with only AOF persistence enabled, you can still perform backups. Since Redis 7.0.0, AOF files are split into multiple files which reside in a single directory determined by the appenddirname configuration. During normal operation all you need to do is copy/tar the files in this directory to achieve a backup. However, if this is done during a rewrite, you might end up with an invalid backup. To work around this you must disable AOF rewrites during the backup:
Turn off automatic rewrites with
CONFIG SET auto-aof-rewrite-percentage 0
Make sure you don't manually start a rewrite (using BGREWRITEAOF) during this time.
Check there's no current rewrite in progress using
INFO persistence
and verifying aof_rewrite_in_progress is 0. If it's 1, then you'll need to wait for the rewrite to complete.
Now you can safely copy the files in the appenddirname directory.
Re-enable rewrites when done:
CONFIG SET auto-aof-rewrite-percentage <prev-value>
Note: If you want to minimize the time AOF rewrites are disabled you may create hard links to the files in appenddirname (in step 3 above) and then re-enable rewrites (step 4) after the hard links are created. Now you can copy/tar the hardlinks and delete them when done. This works because Redis guarantees that it only appends to files in this directory, or completely replaces them if necessary, so the content should be consistent at any given point in time.
Note: If you want to handle the case of the server being restarted during the backup and make sure no rewrite will automatically start after the restart you can change step 1 above to also persist the updated configuration via CONFIG REWRITE. Just make sure to re-enable automatic rewrites when done (step 4) and persist it with another CONFIG REWRITE.
Prior to version 7.0.0 backing up the AOF file can be done simply by copying the aof file (like backing up the RDB snapshot). The file may lack the final part but Redis will still be able to load it (see the previous sections about truncated AOF files).
Disaster recovery 
Disaster recovery in the context of Redis is basically the same story as backups, plus the ability to transfer those backups in many different external data centers. This way data is secured even in the case of some catastrophic event affecting the main data center where Redis is running and producing its snapshots.
We'll review the most interesting disaster recovery techniques that don't have too high costs.
Amazon S3 and other similar services are a good way for implementing your disaster recovery system. Simply transfer your daily or hourly RDB snapshot to S3 in an encrypted form. You can encrypt your data using gpg -c (in symmetric encryption mode). Make sure to store your password in many different safe places (for instance give a copy to the most important people of your organization). It is recommended to use multiple storage services for improved data safety.
Transfer your snapshots using SCP (part of SSH) to far servers. This is a fairly simple and safe route: get a small VPS in a place that is very far from you, install ssh there, and generate a ssh client key without passphrase, then add it in the authorized_keys file of your small VPS. You are ready to transfer backups in an automated fashion. Get at least two VPS in two different providers for best results.
It is important to understand that this system can easily fail if not implemented in the right way. At least, make absolutely sure that after the transfer is completed you are able to verify the file size (that should match the one of the file you copied) and possibly the SHA1 digest, if you are using a VPS.
You also need some kind of independent alert system if the transfer of fresh backups is not working for some reason.
Redis data types
Overview of data types supported by Redis
Redis is a data structure server. At its core, Redis provides a collection of native data types that help you solve a wide variety of problems, from caching to queuing to event processing. Below is a short description of each data type, with links to broader overviews and command references. Each overview includes a comprehensive tutorial with code samples.
Data types 
Redis Open Source implements the following data types:
String
Hash
List
Set
Sorted set
Vector set
Stream
Bitmap
Bitfield
Geospatial
JSON
Probabilistic data types
Time series
Strings 
Redis strings are the most basic Redis data type, representing a sequence of bytes. For more information, see:
Overview of Redis strings
Redis string command reference
Lists 
Redis lists are lists of strings sorted by insertion order. For more information, see:
Overview of Redis lists
Redis list command reference
Sets 
Redis sets are unordered collections of unique strings that act like the sets from your favorite programming language (for example, Java HashSets, Python sets, and so on). With a Redis set, you can add, remove, and test for existence in O(1) time (in other words, regardless of the number of set elements). For more information, see:
Overview of Redis sets
Redis set command reference
Hashes 
Redis hashes are record types modeled as collections of field-value pairs. As such, Redis hashes resemble Python dictionaries, Java HashMaps, and Ruby hashes. For more information, see:
Overview of Redis hashes
Redis hashes command reference
Sorted sets 
Redis sorted sets are collections of unique strings that maintain order by each string's associated score. For more information, see:
Overview of Redis sorted sets
Redis sorted set command reference
Vector sets 
Redis vector sets are a specialized data type designed for managing high-dimensional vector data, enabling fast and efficient vector similarity search within Redis. Vector sets are optimized for use cases involving machine learning, recommendation systems, and semantic search, where each vector represents a data point in multi-dimensional space. Vector sets supports the HNSW (hierarchical navigable small world) algorithm, allowing you to store, index, and query vectors based on the cosine similarity metric. With vector sets, Redis provides native support for hybrid search, combining vector similarity with structured filters. For more information, see:
Overview of Redis vector sets
Redis vector set command reference
Streams 
A Redis stream is a data structure that acts like an append-only log. Streams help record events in the order they occur and then syndicate them for processing. For more information, see:
Overview of Redis Streams
Redis Streams command reference
Geospatial indexes 
Redis geospatial indexes are useful for finding locations within a given geographic radius or bounding box. For more information, see:
Overview of Redis geospatial indexes
Redis geospatial indexes command reference
Bitmaps 
Redis bitmaps let you perform bitwise operations on strings. For more information, see:
Overview of Redis bitmaps
Redis bitmap command reference
Bitfields 
Redis bitfields efficiently encode multiple counters in a string value. Bitfields provide atomic get, set, and increment operations and support different overflow policies. For more information, see:
Overview of Redis bitfields
The BITFIELD command.
JSON 
Redis JSON provides structured, hierarchical arrays and key-value objects that match the popular JSON text file format. You can import JSON text into Redis objects and access, modify, and query individual data elements. For more information, see:
Overview of Redis JSON
JSON command reference
Probabilistic data types 
These data types let you gather and calculate statistics in a way that is approximate but highly efficient. The following types are available:
HyperLogLog
Bloom filter
Cuckoo filter
t-digest
Top-K
Count-min sketch
HyperLogLog 
The Redis HyperLogLog data structures provide probabilistic estimates of the cardinality (i.e., number of elements) of large sets. For more information, see:
Overview of Redis HyperLogLog
Redis HyperLogLog command reference
Bloom filter 
Redis Bloom filters let you check for the presence or absence of an element in a set. For more information, see:
Overview of Redis Bloom filters
Bloom filter command reference
Cuckoo filter 
Redis Cuckoo filters let you check for the presence or absence of an element in a set. They are similar to Bloom filters but with slightly different trade-offs between features and performance. For more information, see:
Overview of Redis Cuckoo filters
Cuckoo filter command reference
t-digest 
Redis t-digest structures estimate percentiles from a stream of data values. For more information, see:
Redis t-digest overview
t-digest command reference
Top-K 
Redis Top-K structures estimate the ranking of a data point within a stream of values. For more information, see:
Redis Top-K overview
Top-K command reference
Count-min sketch 
Redis Count-min sketch estimate the frequency of a data point within a stream of values. For more information, see:
Redis Count-min sketch overview
Count-min sketch command reference
Time series 
Redis time series structures let you store and query timestamped data points. For more information, see:
Redis time series overview
Count-min sketch command reference


Keys and values
Managing keys in Redis: Key expiration, scanning, altering and querying the key space
Every data object that you store in a Redis database has its own unique key. The key is a string that you pass to Redis commands to retrieve the corresponding object or modify its data. The data object associated with a particular key is known as the value and the two together are known as as key-value pair.
Content of keys 
A key is typically a textual name that has some meaning within your data model. Unlike variable names in a programming language, Redis keys have few restrictions on their format, so keys with whitespace or punctuation characters are mostly fine (for example, "1st Attempt", or "% of price in $"). Redis doesn't support namespaces or other categories for keys, so you must take care to avoid name collisions. However, there is a convention for using the colon ":" character to split keys into sections (for example, "person:1", "person:2", "office:London", "office:NewYork:1"). You can use this as a simple way to collect keys together into categories.
Although keys are usually textual, Redis actually implements binary-safe keys, so you can use any sequence of bytes as a valid key, such as a JPEG file or a struct value from your app. The empty string is also a valid key in Redis.
There are also a few other things to bear in mind about keys:
Very long keys are not a good idea. For instance, a key of 1024 bytes is a bad idea not only memory-wise, but also because the lookup of the key in the dataset may require several costly key-comparisons. Even when the task at hand is to match the existence of a large value, hashing it (for example with SHA1) is a better idea, especially from the perspective of memory and bandwidth.
Very short keys are often not a good idea. There is little point in writing "u1000flw" as a key if you can instead write "user:1000:followers". The latter is more readable and the added space is minor compared to the space used by the key object itself and the value object. While short keys will obviously consume a bit less memory, your job is to find the right balance.
Try to stick with a schema. For instance "object-type:id" is a good idea, as in "user:1000". Dots or dashes are often used for multi-word fields, as in "comment:4321:reply.to" or "comment:4321:reply-to".
The maximum allowed key size is 512 MB.
Hashtags 
Redis uses hashing to retrieve the value associated with a key in a highly efficient way. Hashing involves combining the raw byte values from the key to produce an integer index number. The index is then used to locate the hash slot where the value for the key is stored.
Normally, the whole key is used to calculate the hash index, but there are some situations where you need to hash only a part of the key. You can select the section of the key you want to hash using a pair of curly braces {...} to create a hashtag. For example, the keys person:1 and person:2 produce different hash indices but {person}:1 and {person}:2 produce the same index because only the person hashtag section in the braces is used for the hash calculation.
A common use of hashtags is to allow multi-key operations with a clustered database (see Database clustering for more information). Redis doesn't allow most multi-key operations in a clustered database unless all the keys produce the same hash index. For example, the SINTER command finds the intersection of two different set values. This means that the command
SINTER group:1 group:2

won't work with a clustered database but
SINTER {group}:1 {group}:2

will work because the hashtag ensures the two keys produce the same hash index.
Note that although hashtags are useful in certain cases, you shouldn't make a habit of using them generally. If you have too many keys mapped to the same hash slot then this will eventually harm the performance of your database. See Database clustering for more information about how to use hashtags.
Altering and querying the key space 
There are commands that are not defined on particular types, but are useful in order to interact with the space of keys, and thus, can be used with keys of any type.
For example the EXISTS command returns 1 or 0 to signal if a given key exists or not in the database, while the DEL command deletes a key and associated value, whatever the value is.
> set mykey hello
OK
> exists mykey
(integer) 1
> del mykey
(integer) 1
> exists mykey
(integer) 0

From the examples you can also see how DEL itself returns 1 or 0 depending on whether the key was removed (it existed) or not (there was no such key with that name).
There are many key space related commands, but the above two are the essential ones together with the TYPE command, which returns the kind of value stored at the specified key:
> set mykey x
OK
> type mykey
string
> del mykey
(integer) 1
> type mykey
none

Key expiration 
Before moving on, we should look at an important Redis feature that works regardless of the type of value you're storing: key expiration. Key expiration lets you set a timeout for a key, also known as a "time to live", or "TTL". When the time to live elapses, the key is automatically destroyed.
A few important notes about key expiration:
They can be set both using seconds or milliseconds precision.
However the expire time resolution is always 1 millisecond.
Information about expires are replicated and persisted on disk, the time virtually passes when your Redis server remains stopped (this means that Redis saves the date at which a key will expire).
Use the EXPIRE command to set a key's expiration:
> set key some-value
OK
> expire key 5
(integer) 1
> get key (immediately)
"some-value"
> get key (after some time)
(nil)

The key vanished between the two GET calls, since the second call was delayed more than 5 seconds. In the example above we used EXPIRE in order to set the expire (it can also be used in order to set a different expire to a key already having one, like PERSIST can be used in order to remove the expire and make the key persistent forever). However we can also create keys with expires using other Redis commands. For example using SET options:
> set key 100 ex 10
OK
> ttl key
(integer) 9

The example above sets a key with the string value 100, having an expire of ten seconds. Later the TTL command is called in order to check the remaining time to live for the key.
In order to set and check expires in milliseconds, check the PEXPIRE and the PTTL commands, and the full list of SET options.
Navigating the keyspace 
Scan 
To incrementally iterate over the keys in a Redis database in an efficient manner, you can use the SCAN command.
Since SCAN allows for incremental iteration, returning only a small number of elements per call, it can be used in production without the downside of commands like KEYS or SMEMBERS that may block the server for a long time (even several seconds) when called against big collections of keys or elements.
However while blocking commands like SMEMBERS are able to provide all the elements that are part of a Set in a given moment. The SCAN family of commands only offer limited guarantees about the returned elements since the collection that we incrementally iterate can change during the iteration process.
Keys 
Another way to iterate over the keyspace is to use the KEYS command, but this approach should be used with care, since KEYS will block the Redis server until all keys are returned.
Warning: consider KEYS as a command that should only be used in production environments with extreme care.
KEYS may ruin performance when it is executed against large databases. This command is intended for debugging and special operations, such as changing your keyspace layout. Don't use KEYS in your regular application code. If you're looking for a way to find keys in a subset of your keyspace, consider using SCAN or sets.
Supported glob-style patterns:
h?llo matches hello, hallo and hxllo
h*llo matches hllo and heeeello
h[ae]llo matches hello and hallo, but not hillo
h[^e]llo matches hallo, hbllo, ... but not hello
h[a-b]llo matches hallo and hbllo
Use \ to escape special characters if you want to match them verbatim.
Coding patterns
Novel patterns for working with Redis data structures
The following documents describe some novel development patterns you can use with Redis.
Bulk loading
Writing data in bulk using the Redis protocol
Distributed Locks with Redis
A distributed lock pattern with Redis
Secondary indexing
Building secondary indexes in Redis
Redis patterns example

Bulk loading
Writing data in bulk using the Redis protocol
Bulk loading is the process of loading Redis with a large amount of pre-existing data. Ideally, you want to perform this operation quickly and efficiently. This document describes some strategies for bulk loading data in Redis.
Bulk loading using the Redis protocol 
Using a normal Redis client to perform bulk loading is not a good idea for a few reasons: the naive approach of sending one command after the other is slow because you have to pay for the round trip time for every command. It is possible to use pipelining, but for bulk loading of many records you need to write new commands while you read replies at the same time to make sure you are inserting as fast as possible.
Only a small percentage of clients support non-blocking I/O, and not all the clients are able to parse the replies in an efficient way in order to maximize throughput. For all of these reasons the preferred way to mass import data into Redis is to generate a text file containing the Redis protocol, in raw format, in order to call the commands needed to insert the required data.
For instance if I need to generate a large data set where there are billions of keys in the form: `keyN -> ValueN' I will create a file containing the following commands in the Redis protocol format:
SET Key0 Value0
SET Key1 Value1
...
SET KeyN ValueN

Once this file is created, the remaining action is to feed it to Redis as fast as possible. In the past the way to do this was to use the netcat with the following command:
(cat data.txt; sleep 10) | nc localhost 6379 > /dev/null

However this is not a very reliable way to perform mass import because netcat does not really know when all the data was transferred and can't check for errors. In 2.6 or later versions of Redis the redis-cli utility supports a new mode called pipe mode that was designed in order to perform bulk loading.
Using the pipe mode the command to run looks like the following:
cat data.txt | redis-cli --pipe

That will produce an output similar to this:
All data transferred. Waiting for the last reply...
Last reply received from server.
errors: 0, replies: 1000000

The redis-cli utility will also make sure to only redirect errors received from the Redis instance to the standard output.
Generating Redis Protocol 
The Redis protocol is extremely simple to generate and parse, and is Documented here. However in order to generate protocol for the goal of bulk loading you don't need to understand every detail of the protocol, but just that every command is represented in the following way:
*<args><cr><lf>
$<len><cr><lf>
<arg0><cr><lf>
<arg1><cr><lf>
...
<argN><cr><lf>

Where <cr> means "\r" (or ASCII character 13) and <lf> means "\n" (or ASCII character 10).
For instance the command SET key value is represented by the following protocol:
*3<cr><lf>
$3<cr><lf>
SET<cr><lf>
$3<cr><lf>
key<cr><lf>
$5<cr><lf>
value<cr><lf>

Or represented as a quoted string:
"*3\r\n$3\r\nSET\r\n$3\r\nkey\r\n$5\r\nvalue\r\n"

The file you need to generate for bulk loading is just composed of commands represented in the above way, one after the other.
The following Ruby function generates valid protocol:
def gen_redis_proto(*cmd)
    proto = ""
    proto << "*"+cmd.length.to_s+"\r\n"
    cmd.each{|arg|
        proto << "$"+arg.to_s.bytesize.to_s+"\r\n"
        proto << arg.to_s+"\r\n"
    }
    proto
end

puts gen_redis_proto("SET","mykey","Hello World!").inspect

Using the above function it is possible to easily generate the key value pairs in the above example, with this program:
(0...1000).each{|n|
    STDOUT.write(gen_redis_proto("SET","Key#{n}","Value#{n}"))
}

We can run the program directly in pipe to redis-cli in order to perform our first mass import session.
$ ruby proto.rb | redis-cli --pipe
All data transferred. Waiting for the last reply...
Last reply received from server.
errors: 0, replies: 1000

How the pipe mode works under the hood 
The magic needed inside the pipe mode of redis-cli is to be as fast as netcat and still be able to understand when the last reply was sent by the server at the same time.
This is obtained in the following way:
redis-cli --pipe tries to send data as fast as possible to the server.
At the same time it reads data when available, trying to parse it.
Once there is no more data to read from stdin, it sends a special ECHO command with a random 20 byte string: we are sure this is the latest command sent, and we are sure we can match the reply checking if we receive the same 20 bytes as a bulk reply.
Once this special final command is sent, the code receiving replies starts to match replies with these 20 bytes. When the matching reply is reached it can exit with success.
Using this trick we don't need to parse the protocol we send to the server in order to understand how many commands we are sending, but just the replies.
However while parsing the replies we take a counter of all the replies parsed so that at the end we are able to tell the user the amount of commands transferred to the server by the mass insert session.
Distributed Locks with Redis
A distributed lock pattern with Redis
Distributed locks are a very useful primitive in many environments where different processes must operate with shared resources in a mutually exclusive way.
There are a number of libraries and blog posts describing how to implement a DLM (Distributed Lock Manager) with Redis, but every library uses a different approach, and many use a simple approach with lower guarantees compared to what can be achieved with slightly more complex designs.
This page describes a more canonical algorithm to implement distributed locks with Redis. We propose an algorithm, called Redlock, which implements a DLM which we believe to be safer than the vanilla single instance approach. We hope that the community will analyze it, provide feedback, and use it as a starting point for the implementations of more complex or alternative designs.
Implementations 
Before describing the algorithm, here are a few links to implementations already available that can be used for reference.
Redlock-rb (Ruby implementation). There is also a fork of Redlock-rb that adds a gem for easy distribution.
RedisQueuedLocks (Ruby implementation).
Redlock-py (Python implementation).
Pottery (Python implementation).
Aioredlock (Asyncio Python implementation).
RedisMutex (PHP implementation with both Redis extension and Predis library clients support).
Redlock-php (PHP implementation).
cheprasov/php-redis-lock (PHP library for locks).
rtckit/react-redlock (Async PHP implementation).
Redsync (Go implementation).
Redisson (Java implementation).
Redis::DistLock (Perl implementation).
Redlock-cpp (C++ implementation).
Redis-plus-plus (C++ implementation).
Redlock-cs (C#/.NET implementation).
RedLock.net (C#/.NET implementation). Includes async and lock extension support.
Redlock4Net (C# .NET implementation).
node-redlock (NodeJS implementation). Includes support for lock extension.
Deno DLM (Deno implementation)
Rslock (Rust implementation). Includes async and lock extension support.
Safety and Liveness Guarantees 
We are going to model our design with just three properties that, from our point of view, are the minimum guarantees needed to use distributed locks in an effective way.
Safety property: Mutual exclusion. At any given moment, only one client can hold a lock.
Liveness property A: Deadlock free. Eventually it is always possible to acquire a lock, even if the client that locked a resource crashes or gets partitioned.
Liveness property B: Fault tolerance. As long as the majority of Redis nodes are up, clients are able to acquire and release locks.
Why Failover-based Implementations Are Not Enough 
To understand what we want to improve, let’s analyze the current state of affairs with most Redis-based distributed lock libraries.
The simplest way to use Redis to lock a resource is to create a key in an instance. The key is usually created with a limited time to live, using the Redis expires feature, so that eventually it will get released (property 2 in our list). When the client needs to release the resource, it deletes the key.
Superficially this works well, but there is a problem: this is a single point of failure in our architecture. What happens if the Redis master goes down? Well, let’s add a replica! And use it if the master is unavailable. This is unfortunately not viable. By doing so we can’t implement our safety property of mutual exclusion, because Redis replication is asynchronous.
There is a race condition with this model:
Client A acquires the lock in the master.
The master crashes before the write to the key is transmitted to the replica.
The replica gets promoted to master.
Client B acquires the lock to the same resource A already holds a lock for. SAFETY VIOLATION!
Sometimes it is perfectly fine that, under special circumstances, for example during a failure, multiple clients can hold the lock at the same time. If this is the case, you can use your replication based solution. Otherwise we suggest to implement the solution described in this document.
Correct Implementation with a Single Instance 
Before trying to overcome the limitation of the single instance setup described above, let’s check how to do it correctly in this simple case, since this is actually a viable solution in applications where a race condition from time to time is acceptable, and because locking into a single instance is the foundation we’ll use for the distributed algorithm described here.
To acquire the lock, the way to go is the following:
   SET resource_name my_random_value NX PX 30000

The command will set the key only if it does not already exist (NX option), with an expire of 30000 milliseconds (PX option). The key is set to a value “my_random_value”. This value must be unique across all clients and all lock requests.
Basically the random value is used in order to release the lock in a safe way, with a script that tells Redis: remove the key only if it exists and the value stored at the key is exactly the one I expect to be. This is accomplished by the following Lua script:
if redis.call("get",KEYS[1]) == ARGV[1] then
    return redis.call("del",KEYS[1])
else
    return 0
end

This is important in order to avoid removing a lock that was created by another client. For example a client may acquire the lock, get blocked performing some operation for longer than the lock validity time (the time at which the key will expire), and later remove the lock, that was already acquired by some other client. Using just DEL is not safe as a client may remove another client's lock. With the above script instead every lock is “signed” with a random string, so the lock will be removed only if it is still the one that was set by the client trying to remove it.
What should this random string be? We assume it’s 20 bytes from /dev/urandom, but you can find cheaper ways to make it unique enough for your tasks. For example a safe pick is to seed RC4 with /dev/urandom, and generate a pseudo random stream from that. A simpler solution is to use a UNIX timestamp with microsecond precision, concatenating the timestamp with a client ID. It is not as safe, but probably sufficient for most environments.
The "lock validity time" is the time we use as the key's time to live. It is both the auto release time, and the time the client has in order to perform the operation required before another client may be able to acquire the lock again, without technically violating the mutual exclusion guarantee, which is only limited to a given window of time from the moment the lock is acquired.
So now we have a good way to acquire and release the lock. With this system, reasoning about a non-distributed system composed of a single, always available, instance, is safe. Let’s extend the concept to a distributed system where we don’t have such guarantees.
The Redlock Algorithm 
In the distributed version of the algorithm we assume we have N Redis masters. Those nodes are totally independent, so we don’t use replication or any other implicit coordination system. We already described how to acquire and release the lock safely in a single instance. We take for granted that the algorithm will use this method to acquire and release the lock in a single instance. In our examples we set N=5, which is a reasonable value, so we need to run 5 Redis masters on different computers or virtual machines in order to ensure that they’ll fail in a mostly independent way.
In order to acquire the lock, the client performs the following operations:
It gets the current time in milliseconds.
It tries to acquire the lock in all the N instances sequentially, using the same key name and random value in all the instances. During step 2, when setting the lock in each instance, the client uses a timeout which is small compared to the total lock auto-release time in order to acquire it. For example if the auto-release time is 10 seconds, the timeout could be in the ~ 5-50 milliseconds range. This prevents the client from remaining blocked for a long time trying to talk with a Redis node which is down: if an instance is not available, we should try to talk with the next instance ASAP.
The client computes how much time elapsed in order to acquire the lock, by subtracting from the current time the timestamp obtained in step 1. If and only if the client was able to acquire the lock in the majority of the instances (at least 3), and the total time elapsed to acquire the lock is less than lock validity time, the lock is considered to be acquired.
If the lock was acquired, its validity time is considered to be the initial validity time minus the time elapsed, as computed in step 3.
If the client failed to acquire the lock for some reason (either it was not able to lock N/2+1 instances or the validity time is negative), it will try to unlock all the instances (even the instances it believed it was not able to lock).
Is the Algorithm Asynchronous? 
The algorithm relies on the assumption that while there is no synchronized clock across the processes, the local time in every process updates at approximately at the same rate, with a small margin of error compared to the auto-release time of the lock. This assumption closely resembles a real-world computer: every computer has a local clock and we can usually rely on different computers to have a clock drift which is small.
At this point we need to better specify our mutual exclusion rule: it is guaranteed only as long as the client holding the lock terminates its work within the lock validity time (as obtained in step 3), minus some time (just a few milliseconds in order to compensate for clock drift between processes).
This paper contains more information about similar systems requiring a bound clock drift: Leases: an efficient fault-tolerant mechanism for distributed file cache consistency.
Retry on Failure 
When a client is unable to acquire the lock, it should try again after a random delay in order to try to desynchronize multiple clients trying to acquire the lock for the same resource at the same time (this may result in a split brain condition where nobody wins). Also the faster a client tries to acquire the lock in the majority of Redis instances, the smaller the window for a split brain condition (and the need for a retry), so ideally the client should try to send the SET commands to the N instances at the same time using multiplexing.
It is worth stressing how important it is for clients that fail to acquire the majority of locks, to release the (partially) acquired locks ASAP, so that there is no need to wait for key expiry in order for the lock to be acquired again (however if a network partition happens and the client is no longer able to communicate with the Redis instances, there is an availability penalty to pay as it waits for key expiration).
Releasing the Lock 
Releasing the lock is simple, and can be performed whether or not the client believes it was able to successfully lock a given instance.
Safety Arguments 
Is the algorithm safe? Let's examine what happens in different scenarios.
To start let’s assume that a client is able to acquire the lock in the majority of instances. All the instances will contain a key with the same time to live. However, the key was set at different times, so the keys will also expire at different times. But if the first key was set at worst at time T1 (the time we sample before contacting the first server) and the last key was set at worst at time T2 (the time we obtained the reply from the last server), we are sure that the first key to expire in the set will exist for at least MIN_VALIDITY=TTL-(T2-T1)-CLOCK_DRIFT. All the other keys will expire later, so we are sure that the keys will be simultaneously set for at least this time.
During the time that the majority of keys are set, another client will not be able to acquire the lock, since N/2+1 SET NX operations can’t succeed if N/2+1 keys already exist. So if a lock was acquired, it is not possible to re-acquire it at the same time (violating the mutual exclusion property).
However we want to also make sure that multiple clients trying to acquire the lock at the same time can’t simultaneously succeed.
If a client locked the majority of instances using a time near, or greater, than the lock maximum validity time (the TTL we use for SET basically), it will consider the lock invalid and will unlock the instances, so we only need to consider the case where a client was able to lock the majority of instances in a time which is less than the validity time. In this case for the argument already expressed above, for MIN_VALIDITY no client should be able to re-acquire the lock. So multiple clients will be able to lock N/2+1 instances at the same time (with "time" being the end of Step 2) only when the time to lock the majority was greater than the TTL time, making the lock invalid.
Liveness Arguments 
The system liveness is based on three main features:
The auto release of the lock (since keys expire): eventually keys are available again to be locked.
The fact that clients, usually, will cooperate removing the locks when the lock was not acquired, or when the lock was acquired and the work terminated, making it likely that we don’t have to wait for keys to expire to re-acquire the lock.
The fact that when a client needs to retry a lock, it waits a time which is comparably greater than the time needed to acquire the majority of locks, in order to probabilistically make split brain conditions during resource contention unlikely.
However, we pay an availability penalty equal to TTL time on network partitions, so if there are continuous partitions, we can pay this penalty indefinitely. This happens every time a client acquires a lock and gets partitioned away before being able to remove the lock.
Basically if there are infinite continuous network partitions, the system may become not available for an infinite amount of time.
Performance, Crash Recovery and fsync 
Many users using Redis as a lock server need high performance in terms of both latency to acquire and release a lock, and number of acquire / release operations that it is possible to perform per second. In order to meet this requirement, the strategy to talk with the N Redis servers to reduce latency is definitely multiplexing (putting the socket in non-blocking mode, send all the commands, and read all the commands later, assuming that the RTT between the client and each instance is similar).
However there is another consideration around persistence if we want to target a crash-recovery system model.
Basically to see the problem here, let’s assume we configure Redis without persistence at all. A client acquires the lock in 3 of 5 instances. One of the instances where the client was able to acquire the lock is restarted, at this point there are again 3 instances that we can lock for the same resource, and another client can lock it again, violating the safety property of exclusivity of lock.
If we enable AOF persistence, things will improve quite a bit. For example we can upgrade a server by sending it a SHUTDOWN command and restarting it. Because Redis expires are semantically implemented so that time still elapses when the server is off, all our requirements are fine. However everything is fine as long as it is a clean shutdown. What about a power outage? If Redis is configured, as by default, to fsync on disk every second, it is possible that after a restart our key is missing. In theory, if we want to guarantee the lock safety in the face of any kind of instance restart, we need to enable fsync=always in the persistence settings. This will affect performance due to the additional sync overhead.
However things are better than they look like at a first glance. Basically, the algorithm safety is retained as long as when an instance restarts after a crash, it no longer participates to any currently active lock. This means that the set of currently active locks when the instance restarts were all obtained by locking instances other than the one which is rejoining the system.
To guarantee this we just need to make an instance, after a crash, unavailable for at least a bit more than the max TTL we use. This is the time needed for all the keys about the locks that existed when the instance crashed to become invalid and be automatically released.
Using delayed restarts it is basically possible to achieve safety even without any kind of Redis persistence available, however note that this may translate into an availability penalty. For example if a majority of instances crash, the system will become globally unavailable for TTL (here globally means that no resource at all will be lockable during this time).
Making the algorithm more reliable: Extending the lock 
If the work performed by clients consists of small steps, it is possible to use smaller lock validity times by default, and extend the algorithm implementing a lock extension mechanism. Basically the client, if in the middle of the computation while the lock validity is approaching a low value, may extend the lock by sending a Lua script to all the instances that extends the TTL of the key if the key exists and its value is still the random value the client assigned when the lock was acquired.
The client should only consider the lock re-acquired if it was able to extend the lock into the majority of instances, and within the validity time (basically the algorithm to use is very similar to the one used when acquiring the lock).
However this does not technically change the algorithm, so the maximum number of lock reacquisition attempts should be limited, otherwise one of the liveness properties is violated.
Disclaimer about consistency 
Please consider thoroughly reviewing the Analysis of Redlock section at the end of this page. Martin Kleppman's article and antirez's answer to it are very relevant. If you are concerned about consistency and correctness, you should pay attention to the following topics:
You should implement fencing tokens. This is especially important for processes that can take significant time and applies to any distributed locking system. Extending locks' lifetime is also an option, but don´t assume that a lock is retained as long as the process that had acquired it is alive.
Redis is not using monotonic clock for TTL expiration mechanism. That means that a wall-clock shift may result in a lock being acquired by more than one process. Even though the problem can be mitigated by preventing admins from manually setting the server's time and setting up NTP properly, there's still a chance of this issue occurring in real life and compromising consistency.


Secondary indexing
Building secondary indexes in Redis
Redis is not exactly a key-value store, since values can be complex data structures. However it has an external key-value shell: at API level data is addressed by the key name. It is fair to say that, natively, Redis only offers primary key access. However since Redis is a data structures server, its capabilities can be used for indexing, in order to create secondary indexes of different kinds, including composite (multi-column) indexes.
This document explains how it is possible to create indexes in Redis using the following data structures:
Hashes and JSON documents, using a variety of field types; used in conjunction with the Redis query engine.
Sorted sets to create secondary indexes by ID or other numerical fields.
Sorted sets with lexicographical ranges for creating more advanced secondary indexes, composite indexes and graph traversal indexes.
Sets for creating random indexes.
Lists for creating simple iterable indexes and last N items indexes.
Time series with labels.
Implementing and maintaining indexes with Redis is an advanced topic, so most users that need to perform complex queries on data should understand if they are better served by a relational store. However often, especially in caching scenarios, there is the explicit need to store indexed data into Redis in order to speedup common queries which require some form of indexing in order to be executed.
Hashes and JSON indexes 
The Redis query engine provides capabilities to index and query both hash and JSON keys using a variety of field types:
TEXT
TAG
NUMERIC
GEO
VECTOR
GEOSHAPE
Once hash or JSON keys have been indexed using the FT.CREATE command, all keys that use the prefix defined in the index can be queried using the FT.SEARCH and FT.AGGREGATE commands.
For more information on creating hash and JSON indexes, see the following pages.
Hash indexes
JSON indexes
Simple numerical indexes with sorted sets 
The simplest secondary index you can create with Redis is by using the sorted set data type, which is a data structure representing a set of elements ordered by a floating point number which is the score of each element. Elements are ordered from the smallest to the highest score.
Since the score is a double precision float, indexes you can build with vanilla sorted sets are limited to things where the indexing field is a number within a given range.
The two commands to build these kind of indexes are ZADD and ZRANGE with the BYSCORE argument to respectively add items and retrieve items within a specified range.
For instance, it is possible to index a set of person names by their age by adding element to a sorted set. The element will be the name of the person and the score will be the age.
ZADD myindex 25 Manuel
ZADD myindex 18 Anna
ZADD myindex 35 Jon
ZADD myindex 67 Helen

In order to retrieve all persons with an age between 20 and 40, the following command can be used:
ZRANGE myindex 20 40 BYSCORE
1) "Manuel"
2) "Jon"

By using the WITHSCORES option of ZRANGE it is also possible to obtain the scores associated with the returned elements.
The ZCOUNT command can be used in order to retrieve the number of elements within a given range, without actually fetching the elements, which is also useful, especially given the fact the operation is executed in logarithmic time regardless of the size of the range.
Ranges can be inclusive or exclusive, please refer to the ZRANGE command documentation for more information.
Note: Using the ZRANGE with the BYSCORE and REV arguments, it is possible to query a range in reversed order, which is often useful when data is indexed in a given direction (ascending or descending) but we want to retrieve information the other way around.
Use object IDs as associated values 
In the above example we associated names to ages. However in general we may want to index some field of an object which is stored elsewhere. Instead of using the sorted set value directly to store the data associated with the indexed field, it is possible to store just the ID of the object.
For example I may have Redis hashes representing users. Each user is represented by a single key, directly accessible by ID:
HMSET user:1 id 1 username antirez ctime 1444809424 age 38
HMSET user:2 id 2 username maria ctime 1444808132 age 42
HMSET user:3 id 3 username jballard ctime 1443246218 age 33

If I want to create an index in order to query users by their age, I could do:
ZADD user.age.index 38 1
ZADD user.age.index 42 2
ZADD user.age.index 33 3

This time the value associated with the score in the sorted set is the ID of the object. So once I query the index with ZRANGE with the BYSCORE argument, I'll also have to retrieve the information I need with HGETALL or similar commands. The obvious advantage is that objects can change without touching the index, as long as we don't change the indexed field.
In the next examples we'll almost always use IDs as values associated with the index, since this is usually the more sounding design, with a few exceptions.
Update simple sorted set indexes 
Often we index things which change over time. In the above example, the age of the user changes every year. In such a case it would make sense to use the birth date as index instead of the age itself, but there are other cases where we simply want some field to change from time to time, and the index to reflect this change.
The ZADD command makes updating simple indexes a very trivial operation since re-adding back an element with a different score and the same value will simply update the score and move the element at the right position, so if the user antirez turned 39 years old, in order to update the data in the hash representing the user, and in the index as well, we need to execute the following two commands:
HSET user:1 age 39
ZADD user.age.index 39 1

The operation may be wrapped in a MULTI/EXEC transaction in order to make sure both fields are updated or none.
Turn multi-dimensional data into linear data 
Indexes created with sorted sets are able to index only a single numerical value. Because of this you may think it is impossible to index something which has multiple dimensions using this kind of indexes, but actually this is not always true. If you can efficiently represent something multi-dimensional in a linear way, they it is often possible to use a simple sorted set for indexing.
For example the Redis geo indexing API uses a sorted set to index places by latitude and longitude using a technique called Geo hash. The sorted set score represents alternating bits of longitude and latitude, so that we map the linear score of a sorted set to many small squares in the earth surface. By doing an 8+1 style center plus neighborhoods search it is possible to retrieve elements by radius.
Limits of the score 
Sorted set elements scores are double precision floats. It means that they can represent different decimal or integer values with different errors, because they use an exponential representation internally. However what is interesting for indexing purposes is that the score is always able to represent without any error numbers between -9007199254740992 and 9007199254740992, which is -/+ 2^53.
When representing much larger numbers, you need a different form of indexing that is able to index numbers at any precision, called a lexicographical index.
Time series indexes 
When you create a new time series using the TS.CREATE command, you can associate one or more LABELS with it. Each label is a name-value pair, where the both name and value are text. Labels serve as a secondary index that allows you to execute queries on groups of time series keys using various time series commands.
See the time series quickstart guide for an example of creating a time series with a label.
The TS.MGET, TS.MRANGE, and TS.MREVRANGE commands operate on multiple time series based on specified labels or using a label-related filter expression. The TS.QUERYINDEX command returns all time series keys matching a given label-related filter expression.
Lexicographical indexes 
Redis sorted sets have an interesting property. When elements are added with the same score, they are sorted lexicographically, comparing the strings as binary data with the memcmp() function.
For people that don't know the C language nor the memcmp function, what it means is that elements with the same score are sorted comparing the raw values of their bytes, byte after byte. If the first byte is the same, the second is checked and so forth. If the common prefix of two strings is the same then the longer string is considered the greater of the two, so "foobar" is greater than "foo".
There are commands such as ZRANGE and ZLEXCOUNT that are able to query and count ranges in a lexicographically fashion, assuming they are used with sorted sets where all the elements have the same score.
This Redis feature is basically equivalent to a b-tree data structure which is often used in order to implement indexes with traditional databases. As you can guess, because of this, it is possible to use this Redis data structure in order to implement pretty fancy indexes.
Before we dive into using lexicographical indexes, let's check how sorted sets behave in this special mode of operation. Since we need to add elements with the same score, we'll always use the special score of zero.
ZADD myindex 0 baaa
ZADD myindex 0 abbb
ZADD myindex 0 aaaa
ZADD myindex 0 bbbb

Fetching all the elements from the sorted set immediately reveals that they are ordered lexicographically.
ZRANGE myindex 0 -1
1) "aaaa"
2) "abbb"
3) "baaa"
4) "bbbb"

Now we can use ZRANGE with the BYLEX argument in order to perform range queries.
ZRANGE myindex [a (b BYLEX
1) "aaaa"
2) "abbb"

Note that in the range queries we prefixed the min and max elements identifying the range with the special characters [ and (. This prefixes are mandatory, and they specify if the elements of the range are inclusive or exclusive. So the range [a (b means give me all the elements lexicographically between a inclusive and b exclusive, which are all the elements starting with a.
There are also two more special characters indicating the infinitely negative string and the infinitely positive string, which are - and +.
ZRANGE myindex [b + BYLEX
1) "baaa"
2) "bbbb"

That's it basically. Let's see how to use these features to build indexes.
A first example: completion 
An interesting application of indexing is completion. Completion is what happens when you start typing your query into a search engine: the user interface will anticipate what you are likely typing, providing common queries that start with the same characters.
A naive approach to completion is to just add every single query we get from the user into the index. For example if the user searches banana we'll just do:
ZADD myindex 0 banana

And so forth for each search query ever encountered. Then when we want to complete the user input, we execute a range query using ZRANGE with the BYLEX argument. Imagine the user is typing "bit" inside the search form, and we want to offer possible search keywords starting for "bit". We send Redis a command like that:
ZRANGE myindex "[bit" "[bit\xff" BYLEX

Basically we create a range using the string the user is typing right now as start, and the same string plus a trailing byte set to 255, which is \xff in the example, as the end of the range. This way we get all the strings that start for the string the user is typing.
Note that we don't want too many items returned, so we may use the LIMIT option in order to reduce the number of results.
Add frequency into the mix 
The above approach is a bit naive, because all the user searches are the same in this way. In a real system we want to complete strings according to their frequency: very popular searches will be proposed with a higher probability compared to search strings typed very rarely.
In order to implement something which depends on the frequency, and at the same time automatically adapts to future inputs, by purging searches that are no longer popular, we can use a very simple streaming algorithm.
To start, we modify our index in order to store not just the search term, but also the frequency the term is associated with. So instead of just adding banana we add banana:1, where 1 is the frequency.
ZADD myindex 0 banana:1

We also need logic in order to increment the index if the search term already exists in the index, so what we'll actually do is something like that:
ZRANGE myindex "[banana:" + BYLEX LIMIT 0 1
1) "banana:1"

This will return the single entry of banana if it exists. Then we can increment the associated frequency and send the following two commands:
ZREM myindex 0 banana:1
ZADD myindex 0 banana:2

Note that because it is possible that there are concurrent updates, the above three commands should be send via a Lua script instead, so that the Lua script will atomically get the old count and re-add the item with incremented score.
So the result will be that, every time a user searches for banana we'll get our entry updated.
There is more: our goal is to just have items searched very frequently. So we need some form of purging. When we actually query the index in order to complete the user input, we may see something like that:
ZRANGE myindex "[banana:" + BYLEX LIMIT 0 10
1) "banana:123"
2) "banaooo:1"
3) "banned user:49"
4) "banning:89"

Apparently nobody searches for "banaooo", for example, but the query was performed a single time, so we end presenting it to the user.
This is what we can do. Out of the returned items, we pick a random one, decrement its score by one, and re-add it with the new score. However if the score reaches 0, we simply remove the item from the list. You can use much more advanced systems, but the idea is that the index in the long run will contain top searches, and if top searches will change over the time it will adapt automatically.
A refinement to this algorithm is to pick entries in the list according to their weight: the higher the score, the less likely entries are picked in order to decrement its score, or evict them.
Normalize strings for case and accents 
In the completion examples we always used lowercase strings. However reality is much more complex than that: languages have capitalized names, accents, and so forth.
One simple way do deal with this issues is to actually normalize the string the user searches. Whatever the user searches for "Banana", "BANANA" or "Ba'nana" we may always turn it into "banana".
However sometimes we may like to present the user with the original item typed, even if we normalize the string for indexing. In order to do this, what we do is to change the format of the index so that instead of just storing term:frequency we store normalized:frequency:original like in the following example:
ZADD myindex 0 banana:273:Banana

Basically we add another field that we'll extract and use only for visualization. Ranges will always be computed using the normalized strings instead. This is a common trick which has multiple applications.
Add auxiliary information in the index 
When using a sorted set in a direct way, we have two different attributes for each object: the score, which we use as an index, and an associated value. When using lexicographical indexes instead, the score is always set to 0 and basically not used at all. We are left with a single string, which is the element itself.
Like we did in the previous completion examples, we are still able to store associated data using separators. For example we used the colon in order to add the frequency and the original word for completion.
In general we can add any kind of associated value to our indexing key. In order to use a lexicographical index to implement a simple key-value store we just store the entry as key:value:
ZADD myindex 0 mykey:myvalue

And search for the key with:
ZRANGE myindex [mykey: + BYLEX LIMIT 0 1
1) "mykey:myvalue"

Then we extract the part after the colon to retrieve the value. However a problem to solve in this case is collisions. The colon character may be part of the key itself, so it must be chosen in order to never collide with the key we add.
Since lexicographical ranges in Redis are binary safe you can use any byte or any sequence of bytes. However if you receive untrusted user input, it is better to use some form of escaping in order to guarantee that the separator will never happen to be part of the key.
For example if you use two null bytes as separator "\0\0", you may want to always escape null bytes into two bytes sequences in your strings.
Numerical padding 
Lexicographical indexes may look like good only when the problem at hand is to index strings. Actually it is very simple to use this kind of index in order to perform indexing of arbitrary precision numbers.
In the ASCII character set, digits appear in the order from 0 to 9, so if we left-pad numbers with leading zeroes, the result is that comparing them as strings will order them by their numerical value.
ZADD myindex 0 00324823481:foo
ZADD myindex 0 12838349234:bar
ZADD myindex 0 00000000111:zap

ZRANGE myindex 0 -1
1) "00000000111:zap"
2) "00324823481:foo"
3) "12838349234:bar"

We effectively created an index using a numerical field which can be as big as we want. This also works with floating point numbers of any precision by making sure we left pad the numerical part with leading zeroes and the decimal part with trailing zeroes like in the following list of numbers:
   01000000000000.11000000000000
    01000000000000.02200000000000
    00000002121241.34893482930000
    00999999999999.00000000000000

Use numbers in binary form 
Storing numbers in decimal may use too much memory. An alternative approach is just to store numbers, for example 128 bit integers, directly in their binary form. However for this to work, you need to store the numbers in big endian format, so that the most significant bytes are stored before the least significant bytes. This way when Redis compares the strings with memcmp(), it will effectively sort the numbers by their value.
Keep in mind that data stored in binary format is less observable for debugging, harder to parse and export. So it is definitely a trade off.
Composite indexes 
So far we explored ways to index single fields. However we all know that SQL stores are able to create indexes using multiple fields. For example I may index products in a very large store by room number and price.
I need to run queries in order to retrieve all the products in a given room having a given price range. What I can do is to index each product in the following way:
ZADD myindex 0 0056:0028.44:90
ZADD myindex 0 0034:0011.00:832

Here the fields are room:price:product_id. I used just four digits padding in the example for simplicity. The auxiliary data (the product ID) does not need any padding.
With an index like that, to get all the products in room 56 having a price between 10 and 30 dollars is very easy. We can just run the following command:
ZRANGE myindex [0056:0010.00 [0056:0030.00 BYLEX

The above is called a composed index. Its effectiveness depends on the order of the fields and the queries I want to run. For example the above index cannot be used efficiently in order to get all the products having a specific price range regardless of the room number. However I can use the primary key in order to run queries regardless of the price, like give me all the products in room 44.
Composite indexes are very powerful, and are used in traditional stores in order to optimize complex queries. In Redis they could be useful both to implement a very fast in-memory Redis index of something stored into a traditional data store, or in order to directly index Redis data.
Update lexicographical indexes 
The value of the index in a lexicographical index can get pretty fancy and hard or slow to rebuild from what we store about the object. So one approach to simplify the handling of the index, at the cost of using more memory, is to also take alongside to the sorted set representing the index a hash mapping the object ID to the current index value.
So for example, when we index we also add to a hash:
MULTI
ZADD myindex 0 0056:0028.44:90
HSET index.content 90 0056:0028.44:90
EXEC

This is not always needed, but simplifies the operations of updating the index. In order to remove the old information we indexed for the object ID 90, regardless of the current fields values of the object, we just have to retrieve the hash value by object ID and ZREM it in the sorted set view.
Represent and query graphs using a hexastore 
One cool thing about composite indexes is that they are handy in order to represent graphs, using a data structure which is called Hexastore.
The hexastore provides a representation for relations between objects, formed by a subject, a predicate and an object. A simple relation between objects could be:
antirez is-friend-of matteocollina

In order to represent this relation I can store the following element in my lexicographical index:
ZADD myindex 0 spo:antirez:is-friend-of:matteocollina

Note that I prefixed my item with the string spo. It means that the item represents a subject,predicate,object relation.
In can add 5 more entries for the same relation, but in a different order:
ZADD myindex 0 sop:antirez:matteocollina:is-friend-of
ZADD myindex 0 ops:matteocollina:is-friend-of:antirez
ZADD myindex 0 osp:matteocollina:antirez:is-friend-of
ZADD myindex 0 pso:is-friend-of:antirez:matteocollina
ZADD myindex 0 pos:is-friend-of:matteocollina:antirez

Now things start to be interesting, and I can query the graph in many different ways. For example, who are all the people antirez is friend of?
ZRANGE myindex "[spo:antirez:is-friend-of:" "[spo:antirez:is-friend-of:\xff" BYLEX
1) "spo:antirez:is-friend-of:matteocollina"
2) "spo:antirez:is-friend-of:wonderwoman"
3) "spo:antirez:is-friend-of:spiderman"

Or, what are all the relationships antirez and matteocollina have where the first is the subject and the second is the object?
ZRANGE myindex "[sop:antirez:matteocollina:" "[sop:antirez:matteocollina:\xff" BYLEX
1) "sop:antirez:matteocollina:is-friend-of"
2) "sop:antirez:matteocollina:was-at-conference-with"
3) "sop:antirez:matteocollina:talked-with"

By combining different queries, I can ask fancy questions. For example: Who are all my friends that, like beer, live in Barcelona, and matteocollina consider friends as well? To get this information I start with an spo query to find all the people I'm friend with. Then for each result I get I perform an spo query to check if they like beer, removing the ones for which I can't find this relation. I do it again to filter by city. Finally I perform an ops query to find, of the list I obtained, who is considered friend by matteocollina.
Make sure to check Matteo Collina's slides about Levelgraph in order to better understand these ideas.
Multi-dimensional indexes 
A more complex type of index is an index that allows you to perform queries where two or more variables are queried at the same time for specific ranges. For example I may have a data set representing persons age and salary, and I want to retrieve all the people between 50 and 55 years old having a salary between 70000 and 85000.
This query may be performed with a multi column index, but this requires us to select the first variable and then scan the second, which means we may do a lot more work than needed. It is possible to perform these kinds of queries involving multiple variables using different data structures. For example, multi-dimensional trees such as k-d trees or r-trees are sometimes used. Here we'll describe a different way to index data into multiple dimensions, using a representation trick that allows us to perform the query in a very efficient way using Redis lexicographical ranges.
Let's say we have points in the space, which represent our data samples, where x and y are our coordinates. The max value of both variables is 400.
In the next figure, the blue box represents our query. We want all the points where x is between 50 and 100, and where y is between 100 and 300.

In order to represent data that makes these kinds of queries fast to perform, we start by padding our numbers with 0. So for example imagine we want to add the point 10,25 (x,y) to our index. Given that the maximum range in the example is 400 we can just pad to three digits, so we obtain:
x = 010
y = 025

Now what we do is to interleave the digits, taking the leftmost digit in x, and the leftmost digit in y, and so forth, in order to create a single number:
001205

This is our index, however in order to more easily reconstruct the original representation, if we want (at the cost of space), we may also add the original values as additional columns:
001205:10:25

Now, let's reason about this representation and why it is useful in the context of range queries. For example let's take the center of our blue box, which is at x=75 and y=200. We can encode this number as we did earlier by interleaving the digits, obtaining:
027050

What happens if we substitute the last two digits respectively with 00 and 99? We obtain a range which is lexicographically continuous:
027000 to 027099

What this maps to is to a square representing all values where the x variable is between 70 and 79, and the y variable is between 200 and 209. To identify this specific area, we can write random points in that interval.

So the above lexicographic query allows us to easily query for points in a specific square in the picture. However the square may be too small for the box we are searching, so that too many queries are needed. So we can do the same but instead of replacing the last two digits with 00 and 99, we can do it for the last four digits, obtaining the following range:
020000 029999

This time the range represents all the points where x is between 0 and 99 and y is between 200 and 299. Drawing random points in this interval shows us this larger area.

So now our area is too big for our query, and still our search box is not completely included. We need more granularity, but we can easily obtain it by representing our numbers in binary form. This time, when we replace digits instead of getting squares which are ten times bigger, we get squares which are just two times bigger.
Our numbers in binary form, assuming we need just 9 bits for each variable (in order to represent numbers up to 400 in value) would be:
x = 75  -> 001001011
y = 200 -> 011001000

So by interleaving digits, our representation in the index would be:
000111000011001010:75:200

Let's see what are our ranges as we substitute the last 2, 4, 6, 8, ... bits with 0s ad 1s in the interleaved representation:
2 bits: x between 74 and 75, y between 200 and 201 (range=2)
4 bits: x between 72 and 75, y between 200 and 203 (range=4)
6 bits: x between 72 and 79, y between 200 and 207 (range=8)
8 bits: x between 64 and 79, y between 192 and 207 (range=16)

And so forth. Now we have definitely better granularity! As you can see substituting N bits from the index gives us search boxes of side 2^(N/2).
So what we do is check the dimension where our search box is smaller, and check the nearest power of two to this number. Our search box was 50,100 to 100,300, so it has a width of 50 and a height of 200. We take the smaller of the two, 50, and check the nearest power of two which is 64. 64 is 2^6, so we would work with indexes obtained replacing the latest 12 bits from the interleaved representation (so that we end replacing just 6 bits of each variable).
However single squares may not cover all our search, so we may need more. What we do is to start with the left bottom corner of our search box, which is 50,100, and find the first range by substituting the last 6 bits in each number with 0. Then we do the same with the right top corner.
With two trivial nested for loops where we increment only the significant bits, we can find all the squares between these two. For each square we convert the two numbers into our interleaved representation, and create the range using the converted representation as our start, and the same representation but with the latest 12 bits turned on as end range.
For each square found we perform our query and get the elements inside, removing the elements which are outside our search box.
Turning this into code is simple. Here is a Ruby example:
def spacequery(x0,y0,x1,y1,exp)
    bits=exp*2
    x_start = x0/(2**exp)
    x_end = x1/(2**exp)
    y_start = y0/(2**exp)
    y_end = y1/(2**exp)
    (x_start..x_end).each{|x|
        (y_start..y_end).each{|y|
            x_range_start = x*(2**exp)
            x_range_end = x_range_start | ((2**exp)-1)
            y_range_start = y*(2**exp)
            y_range_end = y_range_start | ((2**exp)-1)
            puts "#{x},#{y} x from #{x_range_start} to #{x_range_end}, y from #{y_range_start} to #{y_range_end}"

            # Turn it into interleaved form for ZRANGE query.
            # We assume we need 9 bits for each integer, so the final
            # interleaved representation will be 18 bits.
            xbin = x_range_start.to_s(2).rjust(9,'0')
            ybin = y_range_start.to_s(2).rjust(9,'0')
            s = xbin.split("").zip(ybin.split("")).flatten.compact.join("")
            # Now that we have the start of the range, calculate the end
            # by replacing the specified number of bits from 0 to 1.
            e = s[0..-(bits+1)]+("1"*bits)
            puts "ZRANGE myindex [#{s} [#{e} BYLEX"
        }
    }
end

spacequery(50,100,100,300,6)

While non immediately trivial this is a very useful indexing strategy that in the future may be implemented in Redis in a native way. For now, the good thing is that the complexity may be easily encapsulated inside a library that can be used in order to perform indexing and queries. One example of such library is Redimension, a proof of concept Ruby library which indexes N-dimensional data inside Redis using the technique described here.
Multi-dimensional indexes with negative or floating point numbers 
The simplest way to represent negative values is just to work with unsigned integers and represent them using an offset, so that when you index, before translating numbers in the indexed representation, you add the absolute value of your smaller negative integer.
For floating point numbers, the simplest approach is probably to convert them to integers by multiplying the integer for a power of ten proportional to the number of digits after the dot you want to retain.
Non-range indexes 
So far we checked indexes which are useful to query by range or by single item. However other Redis data structures such as Sets or Lists can be used in order to build other kind of indexes. They are very commonly used but maybe we don't always realize they are actually a form of indexing.
For instance I can index object IDs into a Set data type in order to use the get random elements operation via SRANDMEMBER in order to retrieve a set of random objects. Sets can also be used to check for existence when all I need is to test if a given item exists or not or has a single boolean property or not.
Similarly lists can be used in order to index items into a fixed order. I can add all my items into a Redis list and rotate the list with RPOPLPUSH using the same key name as source and destination. This is useful when I want to process a given set of items again and again forever in the same order. Think of an RSS feed system that needs to refresh the local copy periodically.
Another popular index often used with Redis is a capped list, where items are added with LPUSH and trimmed with LTRIM, in order to create a view with just the latest N items encountered, in the same order they were seen.
Index inconsistency 
Keeping the index updated may be challenging, in the course of months or years it is possible that inconsistencies are added because of software bugs, network partitions or other events.
Different strategies could be used. If the index data is outside Redis read repair can be a solution, where data is fixed in a lazy way when it is requested. When we index data which is stored in Redis itself the SCAN family of commands can be used in order to verify, update or rebuild the index from scratch, incrementally.
Redis patterns example
Learn several Redis patterns by building a Twitter clone
This article describes the design and implementation of a very simple Twitter clone written using PHP with Redis as the only database. The programming community has traditionally considered key-value stores as a special purpose database that couldn't be used as a drop-in replacement for a relational database for the development of web applications. This article will try to show that Redis data structures on top of a key-value layer are an effective data model to implement many kinds of applications.
Note: the original version of this article was written in 2009 when Redis was released. It was not exactly clear at that time that the Redis data model was suitable to write entire applications. Now after 5 years there are many cases of applications using Redis as their main store, so the goal of the article today is to be a tutorial for Redis newcomers. You'll learn how to design a simple data layout using Redis, and how to apply different data structures.
Our Twitter clone, called Retwis, is structurally simple, has very good performance, and can be distributed among any number of web and Redis servers with little efforts. View the Retwis source code.
I used PHP for the example because of its universal readability. The same (or better) results can be obtained using Ruby, Python, Erlang, and so on. A few clones exist (however not all the clones use the same data layout as the current version of this tutorial, so please, stick with the official PHP implementation for the sake of following the article better).
Retwis-RB is a port of Retwis to Ruby and Sinatra written by Daniel Lucraft.
Retwis-J is a port of Retwis to Java, using the Spring Data Framework, written by Costin Leau. Its source code can be found on GitHub, and there is comprehensive documentation available at springsource.org.
What is a key-value store? 
The essence of a key-value store is the ability to store some data, called a value, inside a key. The value can be retrieved later only if we know the specific key it was stored in. There is no direct way to search for a key by value. In some sense, it is like a very large hash/dictionary, but it is persistent, i.e. when your application ends, the data doesn't go away. So, for example, I can use the command SET to store the value bar in the key foo:
SET foo bar

Redis stores data permanently, so if I later ask "What is the value stored in key foo?" Redis will reply with bar:
GET foo => bar

Other common operations provided by key-value stores are DEL, to delete a given key and its associated value, SET-if-not-exists (called SETNX on Redis), to assign a value to a key only if the key does not already exist, and INCR, to atomically increment a number stored in a given key:
SET foo 10
INCR foo => 11
INCR foo => 12
INCR foo => 13

Atomic operations 
There is something special about INCR. You may wonder why Redis provides such an operation if we can do it ourselves with a bit of code? After all, it is as simple as:
x = GET foo
x = x + 1
SET foo x

The problem is that incrementing this way will work as long as there is only one client working with the key foo at one time. See what happens if two clients are accessing this key at the same time:
x = GET foo (yields 10)
y = GET foo (yields 10)
x = x + 1 (x is now 11)
y = y + 1 (y is now 11)
SET foo x (foo is now 11)
SET foo y (foo is now 11)

Something is wrong! We incremented the value two times, but instead of going from 10 to 12, our key holds 11. This is because the increment done with GET / increment / SET is not an atomic operation. Instead the INCR provided by Redis, Memcached, ..., are atomic implementations, and the server will take care of protecting the key during the time needed to complete the increment in order to prevent simultaneous accesses.
What makes Redis different from other key-value stores is that it provides other operations similar to INCR that can be used to model complex problems. This is why you can use Redis to write whole web applications without using another database like an SQL database, and without going crazy.
Beyond key-value stores: lists 
In this section we will see which Redis features we need to build our Twitter clone. The first thing to know is that Redis values can be more than strings. Redis supports Lists, Sets, Hashes, Sorted Sets, Bitmaps, and HyperLogLog types as values, and there are atomic operations to operate on them so we are safe even with multiple accesses to the same key. Let's start with Lists:
LPUSH mylist a (now mylist holds 'a')
LPUSH mylist b (now mylist holds 'b','a')
LPUSH mylist c (now mylist holds 'c','b','a')

LPUSH means Left Push, that is, add an element to the left (or to the head) of the list stored in mylist. If the key mylist does not exist it is automatically created as an empty list before the PUSH operation. As you can imagine, there is also an RPUSH operation that adds the element to the right of the list (on the tail). This is very useful for our Twitter clone. User updates can be added to a list stored in username:updates, for instance.
There are operations to get data from Lists, of course. For instance, LRANGE returns a range from the list, or the whole list.
LRANGE mylist 0 1 => c,b

LRANGE uses zero-based indexes - that is the first element is 0, the second 1, and so on. The command arguments are LRANGE key first-index last-index. The last-index argument can be negative, with a special meaning: -1 is the last element of the list, -2 the penultimate, and so on. So, to get the whole list use:
LRANGE mylist 0 -1 => c,b,a

Other important operations are LLEN that returns the number of elements in the list, and LTRIM that is like LRANGE but instead of returning the specified range trims the list, so it is like Get range from mylist, Set this range as new value but does so atomically.
The Set data type 
Currently we don't use the Set type in this tutorial, but since we use Sorted Sets, which are kind of a more capable version of Sets, it is better to start introducing Sets first (which are a very useful data structure per se), and later Sorted Sets.
There are more data types than just Lists. Redis also supports Sets, which are unsorted collections of elements. It is possible to add, remove, and test for existence of members, and perform the intersection between different Sets. Of course it is possible to get the elements of a Set. Some examples will make it more clear. Keep in mind that SADD is the add to set operation, SREM is the remove from set operation, SISMEMBER is the test if member operation, and SINTER is the perform intersection operation. Other operations are SCARD to get the cardinality (the number of elements) of a Set, and SMEMBERS to return all the members of a Set.
SADD myset a
SADD myset b
SADD myset foo
SADD myset bar
SCARD myset => 4
SMEMBERS myset => bar,a,foo,b

Note that SMEMBERS does not return the elements in the same order we added them since Sets are unsorted collections of elements. When you want to store in order it is better to use Lists instead. Some more operations against Sets:
SADD mynewset b
SADD mynewset foo
SADD mynewset hello
SINTER myset mynewset => foo,b

SINTER can return the intersection between Sets but it is not limited to two Sets. You may ask for the intersection of 4,5, or 10000 Sets. Finally let's check how SISMEMBER works:
SISMEMBER myset foo => 1
SISMEMBER myset notamember => 0

The Sorted Set data type 
Sorted Sets are similar to Sets: collection of elements. However in Sorted Sets each element is associated with a floating point value, called the element score. Because of the score, elements inside a Sorted Set are ordered, since we can always compare two elements by score (and if the score happens to be the same, we compare the two elements as strings).
Like Sets in Sorted Sets it is not possible to add repeated elements, every element is unique. However it is possible to update an element's score.
Sorted Set commands are prefixed with Z. The following is an example of Sorted Sets usage:
ZADD zset 10 a
ZADD zset 5 b
ZADD zset 12.55 c
ZRANGE zset 0 -1 => b,a,c

In the above example we added a few elements with ZADD, and later retrieved the elements with ZRANGE. As you can see the elements are returned in order according to their score. In order to check if a given element exists, and also to retrieve its score if it exists, we use the ZSCORE command:
ZSCORE zset a => 10
ZSCORE zset non_existing_element => NULL

Sorted Sets are a very powerful data structure, you can query elements by score range, lexicographically, in reverse order, and so forth. To know more please check the Sorted Set sections in the official Redis commands documentation.
The Hash data type 
This is the last data structure we use in our program, and is extremely easy to grasp since there is an equivalent in almost every programming language out there: Hashes. Redis Hashes are basically like Ruby or Python hashes, a collection of fields associated with values:
HMSET myuser name Salvatore surname Sanfilippo country Italy
HGET myuser surname => Sanfilippo

HMSET can be used to set fields in the hash, that can be retrieved with HGET later. It is possible to check if a field exists with HEXISTS, or to increment a hash field with HINCRBY and so forth.
Hashes are the ideal data structure to represent objects. For example we use Hashes in order to represent Users and Updates in our Twitter clone.
Okay, we just exposed the basics of the Redis main data structures, we are ready to start coding!
Prerequisites 
If you haven't downloaded the Retwis source code already please grab it now. It contains a few PHP files, and also a copy of Predis, the PHP client library we use in this example.
Another thing you probably want is a working Redis server. Just get the source, build with make, run with ./redis-server, and you're ready to go. No configuration is required at all in order to play with or run Retwis on your computer.
Data layout 
When working with a relational database, a database schema must be designed so that we'd know the tables, indexes, and so on that the database will contain. We don't have tables in Redis, so what do we need to design? We need to identify what keys are needed to represent our objects and what kind of values these keys need to hold.
Let's start with Users. We need to represent users, of course, with their username, userid, password, the set of users following a given user, the set of users a given user follows, and so on. The first question is, how should we identify a user? Like in a relational DB, a good solution is to identify different users with different numbers, so we can associate a unique ID with every user. Every other reference to this user will be done by id. Creating unique IDs is very simple to do by using our atomic INCR operation. When we create a new user we can do something like this, assuming the user is called "antirez":
INCR next_user_id => 1000
HMSET user:1000 username antirez password p1pp0

Note: you should use a hashed password in a real application, for simplicity we store the password in clear text.
We use the next_user_id key in order to always get a unique ID for every new user. Then we use this unique ID to name the key holding a Hash with user's data. This is a common design pattern with key-values stores! Keep it in mind. Besides the fields already defined, we need some more stuff in order to fully define a User. For example, sometimes it can be useful to be able to get the user ID from the username, so every time we add a user, we also populate the users key, which is a Hash, with the username as field, and its ID as value.
HSET users antirez 1000

This may appear strange at first, but remember that we are only able to access data in a direct way, without secondary indexes. It's not possible to tell Redis to return the key that holds a specific value. This is also our strength. This new paradigm is forcing us to organize data so that everything is accessible by primary key, speaking in relational DB terms.
Followers, following, and updates 
There is another central need in our system. A user might have users who follow them, which we'll call their followers. A user might follow other users, which we'll call a following. We have a perfect data structure for this. That is... Sets. The uniqueness of Sets elements, and the fact we can test in constant time for existence, are two interesting features. However what about also remembering the time at which a given user started following another one? In an enhanced version of our simple Twitter clone this may be useful, so instead of using a simple Set, we use a Sorted Set, using the user ID of the following or follower user as element, and the unix time at which the relation between the users was created, as our score.
So let's define our keys:
followers:1000 => Sorted Set of uids of all the followers users
following:1000 => Sorted Set of uids of all the following users

We can add new followers with:
ZADD followers:1000 1401267618 1234 => Add user 1234 with time 1401267618

Another important thing we need is a place where we can add the updates to display in the user's home page. We'll need to access this data in chronological order later, from the most recent update to the oldest, so the perfect kind of data structure for this is a List. Basically every new update will be LPUSHed in the user updates key, and thanks to LRANGE, we can implement pagination and so on. Note that we use the words updates and posts interchangeably, since updates are actually "little posts" in some way.
posts:1000 => a List of post ids - every new post is LPUSHed here.

This list is basically the User timeline. We'll push the IDs of her/his own posts, and, the IDs of all the posts of created by the following users. Basically, we'll implement a write fanout.
Authentication 
OK, we have more or less everything about the user except for authentication. We'll handle authentication in a simple but robust way: we don't want to use PHP sessions, as our system must be ready to be distributed among different web servers easily, so we'll keep the whole state in our Redis database. All we need is a random unguessable string to set as the cookie of an authenticated user, and a key that will contain the user ID of the client holding the string.
We need two things in order to make this thing work in a robust way. First: the current authentication secret (the random unguessable string) should be part of the User object, so when the user is created we also set an auth field in its Hash:
HSET user:1000 auth fea5e81ac8ca77622bed1c2132a021f9

Moreover, we need a way to map authentication secrets to user IDs, so we also take an auths key, which has as value a Hash type mapping authentication secrets to user IDs.
HSET auths fea5e81ac8ca77622bed1c2132a021f9 1000

In order to authenticate a user we'll do these simple steps (see the login.php file in the Retwis source code):
Get the username and password via the login form.
Check if the username field actually exists in the users Hash.
If it exists we have the user id, (i.e. 1000).
Check if user:1000 password matches, if not, return an error message.
Ok authenticated! Set "fea5e81ac8ca77622bed1c2132a021f9" (the value of user:1000 auth field) as the "auth" cookie.
This is the actual code:
include("retwis.php");

# Form sanity checks
if (!gt("username") || !gt("password"))
    goback("You need to enter both username and password to login.");

# The form is ok, check if the username is available
$username = gt("username");
$password = gt("password");
$r = redisLink();
$userid = $r->hget("users",$username);
if (!$userid)
    goback("Wrong username or password");
$realpassword = $r->hget("user:$userid","password");
if ($realpassword != $password)
    goback("Wrong username or password");

# Username / password OK, set the cookie and redirect to index.php
$authsecret = $r->hget("user:$userid","auth");
setcookie("auth",$authsecret,time()+3600*24*365);
header("Location: index.php");

This happens every time a user logs in, but we also need a function isLoggedIn in order to check if a given user is already authenticated or not. These are the logical steps preformed by the isLoggedIn function:
Get the "auth" cookie from the user. If there is no cookie, the user is not logged in, of course. Let's call the value of the cookie <authcookie>.
Check if <authcookie> field in the auths Hash exists, and what the value (the user ID) is (1000 in the example).
In order for the system to be more robust, also verify that user:1000 auth field also matches.
OK the user is authenticated, and we loaded a bit of information in the $User global variable.
The code is simpler than the description, possibly:
function isLoggedIn() {
    global $User, $_COOKIE;

    if (isset($User)) return true;

    if (isset($_COOKIE['auth'])) {
        $r = redisLink();
        $authcookie = $_COOKIE['auth'];
        if ($userid = $r->hget("auths",$authcookie)) {
            if ($r->hget("user:$userid","auth") != $authcookie) return false;
            loadUserInfo($userid);
            return true;
        }
    }
    return false;
}

function loadUserInfo($userid) {
    global $User;

    $r = redisLink();
    $User['id'] = $userid;
    $User['username'] = $r->hget("user:$userid","username");
    return true;
}

Having loadUserInfo as a separate function is overkill for our application, but it's a good approach in a complex application. The only thing that's missing from all the authentication is the logout. What do we do on logout? That's simple, we'll just change the random string in user:1000 auth field, remove the old authentication secret from the auths Hash, and add the new one.
Important: the logout procedure explains why we don't just authenticate the user after looking up the authentication secret in the auths Hash, but double check it against user:1000 auth field. The true authentication string is the latter, while the auths Hash is just an authentication field that may even be volatile, or, if there are bugs in the program or a script gets interrupted, we may even end with multiple entries in the auths key pointing to the same user ID. The logout code is the following (logout.php):
include("retwis.php");

if (!isLoggedIn()) {
    header("Location: index.php");
    exit;
}

$r = redisLink();
$newauthsecret = getrand();
$userid = $User['id'];
$oldauthsecret = $r->hget("user:$userid","auth");

$r->hset("user:$userid","auth",$newauthsecret);
$r->hset("auths",$newauthsecret,$userid);
$r->hdel("auths",$oldauthsecret);

header("Location: index.php");

That is just what we described and should be simple to understand.
Updates 
Updates, also known as posts, are even simpler. In order to create a new post in the database we do something like this:
INCR next_post_id => 10343
HMSET post:10343 user_id $owner_id time $time body "I'm having fun with Retwis"

As you can see each post is just represented by a Hash with three fields. The ID of the user owning the post, the time at which the post was published, and finally, the body of the post, which is, the actual status message.
After we create a post and we obtain the post ID, we need to LPUSH the ID in the timeline of every user that is following the author of the post, and of course in the list of posts of the author itself (everybody is virtually following herself/himself). This is the file post.php that shows how this is performed:
include("retwis.php");

if (!isLoggedIn() || !gt("status")) {
    header("Location:index.php");
    exit;
}

$r = redisLink();
$postid = $r->incr("next_post_id");
$status = str_replace("\n"," ",gt("status"));
$r->hmset("post:$postid","user_id",$User['id'],"time",time(),"body",$status);
$followers = $r->zrange("followers:".$User['id'],0,-1);
$followers[] = $User['id']; /* Add the post to our own posts too */

foreach($followers as $fid) {
    $r->lpush("posts:$fid",$postid);
}
# Push the post on the timeline, and trim the timeline to the
# newest 1000 elements.
$r->lpush("timeline",$postid);
$r->ltrim("timeline",0,1000);

header("Location: index.php");

The core of the function is the foreach loop. We use ZRANGE to get all the followers of the current user, then the loop will LPUSH the push the post in every follower timeline List.
Note that we also maintain a global timeline for all the posts, so that in the Retwis home page we can show everybody's updates easily. This requires just doing an LPUSH to the timeline List. Let's face it, aren't you starting to think it was a bit strange to have to sort things added in chronological order using ORDER BY with SQL? I think so.
There is an interesting thing to notice in the code above: we used a new command called LTRIM after we perform the LPUSH operation in the global timeline. This is used in order to trim the list to just 1000 elements. The global timeline is actually only used in order to show a few posts in the home page, there is no need to have the full history of all the posts.
Basically LTRIM + LPUSH is a way to create a capped collection in Redis.
Paginating updates 
Now it should be pretty clear how we can use LRANGE in order to get ranges of posts, and render these posts on the screen. The code is simple:
function showPost($id) {
    $r = redisLink();
    $post = $r->hgetall("post:$id");
    if (empty($post)) return false;

    $userid = $post['user_id'];
    $username = $r->hget("user:$userid","username");
    $elapsed = strElapsed($post['time']);
    $userlink = "<a class=\"username\" href=\"profile.php?u=".urlencode($username)."\">".utf8entities($username)."</a>";

    echo('<div class="post">'.$userlink.' '.utf8entities($post['body'])."<br>");
    echo('<i>posted '.$elapsed.' ago via web</i></div>');
    return true;
}

function showUserPosts($userid,$start,$count) {
    $r = redisLink();
    $key = ($userid == -1) ? "timeline" : "posts:$userid";
    $posts = $r->lrange($key,$start,$start+$count);
    $c = 0;
    foreach($posts as $p) {
        if (showPost($p)) $c++;
        if ($c == $count) break;
    }
    return count($posts) == $count+1;
}

showPost will simply convert and print a Post in HTML while showUserPosts gets a range of posts and then passes them to showPosts.
Note: LRANGE is not very efficient if the list of posts start to be very big, and we want to access elements which are in the middle of the list, since Redis Lists are backed by linked lists. If a system is designed for deep pagination of million of items, it is better to resort to Sorted Sets instead.
Following users 
It is not hard, but we did not yet check how we create following / follower relationships. If user ID 1000 (antirez) wants to follow user ID 5000 (pippo), we need to create both a following and a follower relationship. We just need to ZADD calls:
   ZADD following:1000 5000
    ZADD followers:5000 1000

Note the same pattern again and again. In theory with a relational database, the list of following and followers would be contained in a single table with fields like following_id and follower_id. You can extract the followers or following of every user using an SQL query. With a key-value DB things are a bit different since we need to set both the 1000 is following 5000 and 5000 is followed by 1000 relations. This is the price to pay, but on the other hand accessing the data is simpler and extremely fast. Having these things as separate sets allows us to do interesting stuff. For example, using ZINTERSTORE we can have the intersection of following of two different users, so we may add a feature to our Twitter clone so that it is able to tell you very quickly when you visit somebody else's profile, "you and Alice have 34 followers in common", and things like that.
You can find the code that sets or removes a following / follower relation in the follow.php file.
Making it horizontally scalable 
Gentle reader, if you read till this point you are already a hero. Thank you. Before talking about scaling horizontally it is worth checking performance on a single server. Retwis is extremely fast, without any kind of cache. On a very slow and loaded server, an Apache benchmark with 100 parallel clients issuing 100000 requests measured the average pageview to take 5 milliseconds. This means you can serve millions of users every day with just a single Linux box, and this one was monkey ass slow... Imagine the results with more recent hardware.
However you can't go with a single server forever, how do you scale a key-value store?
Retwis does not perform any multi-keys operation, so making it scalable is simple: you may use client-side sharding, or something like a sharding proxy like Twemproxy, or the upcoming Redis Cluster.
To know more about those topics please read our documentation about sharding. However, the point here to stress is that in a key-value store, if you design with care, the data set is split among many independent small keys. To distribute those keys to multiple nodes is more straightforward and predictable compared to using a semantically more complex database system.
Redis data types
Overview of data types supported by Redis
Redis is a data structure server. At its core, Redis provides a collection of native data types that help you solve a wide variety of problems, from caching to queuing to event processing. Below is a short description of each data type, with links to broader overviews and command references. Each overview includes a comprehensive tutorial with code samples.
Data types 
Redis Open Source implements the following data types:
String
Hash
List
Set
Sorted set
Vector set
Stream
Bitmap
Bitfield
Geospatial
JSON
Probabilistic data types
Time series
Strings 
Redis strings are the most basic Redis data type, representing a sequence of bytes. For more information, see:
Overview of Redis strings
Redis string command reference
Lists 
Redis lists are lists of strings sorted by insertion order. For more information, see:
Overview of Redis lists
Redis list command reference
Sets 
Redis sets are unordered collections of unique strings that act like the sets from your favorite programming language (for example, Java HashSets, Python sets, and so on). With a Redis set, you can add, remove, and test for existence in O(1) time (in other words, regardless of the number of set elements). For more information, see:
Overview of Redis sets
Redis set command reference
Hashes 
Redis hashes are record types modeled as collections of field-value pairs. As such, Redis hashes resemble Python dictionaries, Java HashMaps, and Ruby hashes. For more information, see:
Overview of Redis hashes
Redis hashes command reference
Sorted sets 
Redis sorted sets are collections of unique strings that maintain order by each string's associated score. For more information, see:
Overview of Redis sorted sets
Redis sorted set command reference
Vector sets 
Redis vector sets are a specialized data type designed for managing high-dimensional vector data, enabling fast and efficient vector similarity search within Redis. Vector sets are optimized for use cases involving machine learning, recommendation systems, and semantic search, where each vector represents a data point in multi-dimensional space. Vector sets supports the HNSW (hierarchical navigable small world) algorithm, allowing you to store, index, and query vectors based on the cosine similarity metric. With vector sets, Redis provides native support for hybrid search, combining vector similarity with structured filters. For more information, see:
Overview of Redis vector sets
Redis vector set command reference
Streams 
A Redis stream is a data structure that acts like an append-only log. Streams help record events in the order they occur and then syndicate them for processing. For more information, see:
Overview of Redis Streams
Redis Streams command reference
Geospatial indexes 
Redis geospatial indexes are useful for finding locations within a given geographic radius or bounding box. For more information, see:
Overview of Redis geospatial indexes
Redis geospatial indexes command reference
Bitmaps 
Redis bitmaps let you perform bitwise operations on strings. For more information, see:
Overview of Redis bitmaps
Redis bitmap command reference
Bitfields 
Redis bitfields efficiently encode multiple counters in a string value. Bitfields provide atomic get, set, and increment operations and support different overflow policies. For more information, see:
Overview of Redis bitfields
The BITFIELD command.
JSON 
Redis JSON provides structured, hierarchical arrays and key-value objects that match the popular JSON text file format. You can import JSON text into Redis objects and access, modify, and query individual data elements. For more information, see:
Overview of Redis JSON
JSON command reference
Probabilistic data types 
These data types let you gather and calculate statistics in a way that is approximate but highly efficient. The following types are available:
HyperLogLog
Bloom filter
Cuckoo filter
t-digest
Top-K
Count-min sketch
HyperLogLog 
The Redis HyperLogLog data structures provide probabilistic estimates of the cardinality (i.e., number of elements) of large sets. For more information, see:
Overview of Redis HyperLogLog
Redis HyperLogLog command reference
Bloom filter 
Redis Bloom filters let you check for the presence or absence of an element in a set. For more information, see:
Overview of Redis Bloom filters
Bloom filter command reference
Cuckoo filter 
Redis Cuckoo filters let you check for the presence or absence of an element in a set. They are similar to Bloom filters but with slightly different trade-offs between features and performance. For more information, see:
Overview of Redis Cuckoo filters
Cuckoo filter command reference
t-digest 
Redis t-digest structures estimate percentiles from a stream of data values. For more information, see:
Redis t-digest overview
t-digest command reference
Top-K 
Redis Top-K structures estimate the ranking of a data point within a stream of values. For more information, see:
Redis Top-K overview
Top-K command reference
Count-min sketch 
Redis Count-min sketch estimate the frequency of a data point within a stream of values. For more information, see:
Redis Count-min sketch overview
Count-min sketch command reference
Time series 
Redis time series structures let you store and query timestamped data points. For more information, see:
Redis time series overview
Count-min sketch command reference
Adding extensions 
To extend the features provided by the included data types, use one of these options:
Write your own custom server-side functions in Lua.
Write your own Redis module using the modules API or check out the community-supported modules.
Key eviction
Overview of Redis key eviction policies (LRU, LFU, etc.)
Redis is commonly used as a cache to speed up read accesses to a slower server or database. Since cache entries are copies of persistently-stored data, it is usually safe to evict them when the cache runs out of memory (they can be cached again in the future if necessary).
Redis lets you specify an eviction policy to evict keys automatically when the size of the cache exceeds a set memory limit. Whenever a client runs a new command that adds more data to the cache, Redis checks the memory usage. If it is greater than the limit, Redis evicts keys according to the chosen eviction policy until the total memory used is back below the limit.
Note that when a command adds a lot of data to the cache (for example, a big set intersection stored into a new key), this might temporarily exceed the limit by a large amount.
The sections below explain how to configure the memory limit for the cache and also describe the available eviction policies and when to use them.
Using the maxmemory configuration directive 
The maxmemory configuration directive specifies the maximum amount of memory to use for the cache data. You can set maxmemory with the redis.conf file at startup time. For example, to configure a memory limit of 100 megabytes, you can use the following directive inside redis.conf:
maxmemory 100mb

You can also use CONFIG SET to set maxmemory at runtime using redis-cli:
> CONFIG SET maxmemory 100mb

Set maxmemory to zero to specify that you don't want to limit the memory for the dataset. This is the default behavior for 64-bit systems, while 32-bit systems use an implicit memory limit of 3GB.
When the size of your cache exceeds the limit set by maxmemory, Redis will enforce your chosen eviction policy to prevent any further growth of the cache.
Setting maxmemory for a replicated or persisted instance 
If you are using replication or persistence for a server, Redis will use some RAM as a buffer to store the set of updates waiting to be written to the replicas or AOF files. The memory used by this buffer is not included in the total that is compared to maxmemory to see if eviction is required.
This is because the key evictions themselves generate updates that must be added to the buffer. If the updates were counted among the used memory then in some circumstances, the memory saved by evicting keys would be immediately used up by the update data added to the buffer. This, in turn, would trigger even more evictions and the resulting feedback loop could evict many items from the cache unnecessarily.
If you are using replication or persistence, we recommend that you set maxmemory to leave a little RAM free to store the buffers. Note that this is not necessary for the noeviction policy (see the section below for more information about eviction policies).
The INFO command returns a mem_not_counted_for_evict value in the memory section (you can use the INFO memory option to see just this section). This is the amount of memory currently used by the buffers. Although the exact amount will vary, you can use it to estimate how much to subtract from the total available RAM before setting maxmemory.
Eviction policies 
Use the maxmemory-policy configuration directive to select the eviction policy you want to use when the limit set by maxmemory is reached.
The following policies are available:
noeviction: Keys are not evicted but the server will return an error when you try to execute commands that cache new data. If your database uses replication then this condition only applies to the primary database. Note that commands that only read existing data still work as normal.
allkeys-lru: Evict the least recently used (LRU) keys.
allkeys-lfu: Evict the least frequently used (LFU) keys.
allkeys-random: Evict keys at random.
volatile-lru: Evict the least recently used keys that have the expire field set to true.
volatile-lfu: Evict the least frequently used keys that have the expire field set to true.
volatile-random: Evict keys at random only if they have the expire field set to true.
volatile-ttl: Evict keys with the expire field set to true that have the shortest remaining time-to-live (TTL) value.
The volatile-xxx policies behave like noeviction if no keys have the expire field set to true, or for volatile-ttl, if no keys have a time-to-live value set.
You should choose an eviction policy that fits the way your app accesses keys. You may be able to predict the access pattern in advance but you can also use information from the INFO command at runtime to check or improve your choice of policy (see Using the INFO command below for more information).
As a rule of thumb:
Use allkeys-lru when you expect that a subset of elements will be accessed far more often than the rest. This is a very common case according to the Pareto principle, so allkeys-lru is a good default option if you have no reason to prefer any others.
Use allkeys-random when you expect all keys to be accessed with roughly equal frequency. An example of this is when your app reads data items in a repeating cycle.
Use volatile-ttl if your code can estimate which keys are good candidates for eviction and assign short TTLs to them. Note also that if you make good use of key expiration, then you are less likely to run into the cache memory limit because keys will often expire before they need to be evicted.
The volatile-lru and volatile-random policies are mainly useful when you want to use a single Redis instance for both caching and for a set of persistent keys. However, you should consider running two separate Redis instances in a case like this, if possible.
Also note that setting an expire value for a key costs memory, so a policy like allkeys-lru is more memory efficient since it doesn't need an expire value to operate.
Using the INFO command 
The INFO command provides several pieces of data that are useful for checking the performance of your cache. In particular, the INFO stats section includes two important entries, keyspace_hits (the number of times keys were successfully found in the cache) and keyspace_misses (the number of times a key was requested but was not in the cache). The calculation below gives the percentage of attempted accesses that were satisfied from the cache:
keyspace_hits / (keyspace_hits + keyspace_misses) * 100

Check that this is roughly equal to what you would expect for your app (naturally, a higher percentage indicates better cache performance).
Note:
When the EXISTS command reports that a key is absent then this is counted as a keyspace miss.
If the percentage of hits is lower than expected, then this might mean you are not using the best eviction policy. For example, if you believe that a small subset of "hot" data (that will easily fit into the cache) should account for about 75% of accesses, you could reasonably expect the percentage of keyspace hits to be around 75%. If the actual percentage is lower, check the value of evicted_keys (also returned by INFO stats). A high proportion of evictions would suggest that the wrong keys are being evicted too often by your chosen policy (so allkeys-lru might be a good option here). If the value of evicted_keys is low and you are using key expiration, check expired_keys to see how many keys have expired. If this number is high, you might be using a TTL that is too low or you are choosing the wrong keys to expire and this is causing keys to disappear from the cache before they should.
Other useful pieces of information returned by INFO include:
used_memory_dataset: (memory section) The amount of memory used for cached data. If this is greater than maxmemory, then the difference is the amount by which maxmemory has been exceeded.
current_eviction_exceeded_time: (stats section) The time since the cache last started to exceed maxmemory.
commandstats section: Among other things, this reports the number of times each command issued to the server has been rejected. If you are using noeviction or one of the volatile_xxx policies, you can use this to find which commands are being stopped by the maxmemory limit and how often it is happening.
Approximated LRU algorithm 
The Redis LRU algorithm uses an approximation of the least recently used keys rather than calculating them exactly. It samples a small number of keys at random and then evicts the ones with the longest time since last access.
From Redis 3.0 onwards, the algorithm also tracks a pool of good candidates for eviction. This improves the performance of the algorithm, making it a close approximation to a true LRU algorithm.
You can tune the performance of the algorithm by changing the number of samples to check before every eviction with the maxmemory-samples configuration directive:
maxmemory-samples 5

The reason Redis does not use a true LRU implementation is because it costs more memory. However, the approximation is virtually equivalent for an application using Redis. This figure compares the LRU approximation used by Redis with true LRU.

The test to generate the above graphs filled a Redis server with a given number of keys. The keys were accessed from the first to the last. The first keys are the best candidates for eviction using an LRU algorithm. Later more 50% of keys are added, in order to force half of the old keys to be evicted.
You can see three kind of dots in the graphs, forming three distinct bands.
The light gray band are objects that were evicted.
The gray band are objects that were not evicted.
The green band are objects that were added.
In a theoretical LRU implementation we expect that, among the old keys, the first half will be expired. The Redis LRU algorithm will instead only probabilistically expire the older keys.
As you can see Redis 3.0 does a better job with 5 samples compared to Redis 2.8, however most objects that are among the latest accessed are still retained by Redis 2.8. Using a sample size of 10 in Redis 3.0 the approximation is very close to the theoretical performance of Redis 3.0.
Note that LRU is just a model to predict how likely a given key will be accessed in the future. Moreover, if your data access pattern closely resembles the power law, most of the accesses will be in the set of keys the LRU approximated algorithm can handle well.
In simulations we found that using a power law access pattern, the difference between true LRU and Redis approximation were minimal or non-existent.
However you can raise the sample size to 10 at the cost of some additional CPU usage to closely approximate true LRU, and check if this makes a difference in your cache misses rate.
To experiment in production with different values for the sample size by using the CONFIG SET maxmemory-samples <count> command, is very simple.
LFU eviction 
Starting with Redis 4.0, the Least Frequently Used eviction mode is available. This mode may work better (provide a better hits/misses ratio) in certain cases. In LFU mode, Redis will try to track the frequency of access of items, so the ones used rarely are evicted. This means the keys used often have a higher chance of remaining in memory.
To configure the LFU mode, the following policies are available:
volatile-lfu Evict using approximated LFU among the keys with an expire set.
allkeys-lfu Evict any key using approximated LFU.
LFU is approximated like LRU: it uses a probabilistic counter, called a Morris counter to estimate the object access frequency using just a few bits per object, combined with a decay period so that the counter is reduced over time. At some point we no longer want to consider keys as frequently accessed, even if they were in the past, so that the algorithm can adapt to a shift in the access pattern.
That information is sampled similarly to what happens for LRU (as explained in the previous section of this documentation) to select a candidate for eviction.
However unlike LRU, LFU has certain tunable parameters: for example, how fast should a frequent item lower in rank if it gets no longer accessed? It is also possible to tune the Morris counters range to better adapt the algorithm to specific use cases.
By default Redis is configured to:
Saturate the counter at, around, one million requests.
Decay the counter every one minute.
Those should be reasonable values and were tested experimentally, but the user may want to play with these configuration settings to pick optimal values.
Instructions about how to tune these parameters can be found inside the example redis.conf file in the source distribution. Briefly, they are:
lfu-log-factor 10
lfu-decay-time 1

The decay time is the obvious one, it is the amount of minutes a counter should be decayed, when sampled and found to be older than that value. A special value of 0 means: we will never decay the counter.
The counter logarithm factor changes how many hits are needed to saturate the frequency counter, which is just in the range 0-255. The higher the factor, the more accesses are needed to reach the maximum. The lower the factor, the better is the resolution of the counter for low accesses, according to the following table:
+--------+------------+------------+------------+------------+------------+
| factor | 100 hits   | 1000 hits  | 100K hits  | 1M hits    | 10M hits   |
+--------+------------+------------+------------+------------+------------+
| 0      | 104        | 255        | 255        | 255        | 255        |
+--------+------------+------------+------------+------------+------------+
| 1      | 18         | 49         | 255        | 255        | 255        |
+--------+------------+------------+------------+------------+------------+
| 10     | 10         | 18         | 142        | 255        | 255        |
+--------+------------+------------+------------+------------+------------+
| 100    | 8          | 11         | 49         | 143        | 255        |
+--------+------------+------------+------------+------------+------------+

So basically the factor is a trade off between better distinguishing items with low accesses VS distinguishing items with high accesses. More information is available in the example redis.conf file.
Redis pipelining
How to optimize round-trip times by batching Redis commands
Redis pipelining is a technique for improving performance by issuing multiple commands at once without waiting for the response to each individual command. Pipelining is supported by most Redis clients. This document describes the problem that pipelining is designed to solve and how pipelining works in Redis.
Request/Response protocols and round-trip time (RTT) 
Redis is a TCP server using the client-server model and what is called a Request/Response protocol.
This means that usually a request is accomplished with the following steps:
The client sends a query to the server, and reads from the socket, usually in a blocking way, for the server response.
The server processes the command and sends the response back to the client.
So for instance a four commands sequence is something like this:
Client: INCR X
Server: 1
Client: INCR X
Server: 2
Client: INCR X
Server: 3
Client: INCR X
Server: 4
Clients and Servers are connected via a network link. Such a link can be very fast (a loopback interface) or very slow (a connection established over the Internet with many hops between the two hosts). Whatever the network latency is, it takes time for the packets to travel from the client to the server, and back from the server to the client to carry the reply.
This time is called RTT (Round Trip Time). It's easy to see how this can affect performance when a client needs to perform many requests in a row (for instance adding many elements to the same list, or populating a database with many keys). For instance if the RTT time is 250 milliseconds (in the case of a very slow link over the Internet), even if the server is able to process 100k requests per second, we'll be able to process at max four requests per second.
If the interface used is a loopback interface, the RTT is much shorter, typically sub-millisecond, but even this will add up to a lot if you need to perform many writes in a row.
Fortunately there is a way to improve this use case.
Redis Pipelining 
A Request/Response server can be implemented so that it is able to process new requests even if the client hasn't already read the old responses. This way it is possible to send multiple commands to the server without waiting for the replies at all, and finally read the replies in a single step.
This is called pipelining, and is a technique widely in use for many decades. For instance many POP3 protocol implementations already support this feature, dramatically speeding up the process of downloading new emails from the server.
Redis has supported pipelining since its early days, so whatever version you are running, you can use pipelining with Redis. This is an example using the raw netcat utility:
$ (printf "PING\r\nPING\r\nPING\r\n"; sleep 1) | nc localhost 6379

+PONG

+PONG

+PONG

This time we don't pay the cost of RTT for every call, but just once for the three commands.
To be explicit, with pipelining the order of operations of our very first example will be the following:
Client: INCR X
Client: INCR X
Client: INCR X
Client: INCR X
Server: 1
Server: 2
Server: 3
Server: 4
IMPORTANT NOTE: While the client sends commands using pipelining, the server will be forced to queue the replies, using memory. So if you need to send a lot of commands with pipelining, it is better to send them as batches each containing a reasonable number, for instance 10k commands, read the replies, and then send another 10k commands again, and so forth. The speed will be nearly the same, but the additional memory used will be at most the amount needed to queue the replies for these 10k commands.
It's not just a matter of RTT 
Pipelining is not just a way to reduce the latency cost associated with the round trip time, it actually greatly improves the number of operations you can perform per second in a given Redis server. This is because without using pipelining, serving each command is very cheap from the point of view of accessing the data structures and producing the reply, but it is very costly from the point of view of doing the socket I/O. This involves calling the read() and write() syscall, that means going from user land to kernel land. The context switch is a huge speed penalty.
When pipelining is used, many commands are usually read with a single read() system call, and multiple replies are delivered with a single write() system call. Consequently, the number of total queries performed per second initially increases almost linearly with longer pipelines, and eventually reaches 10 times the baseline obtained without pipelining, as shown in this figure.

A real world code example 
In the following benchmark we'll use the Redis Ruby client, supporting pipelining, to test the speed improvement due to pipelining:
require 'rubygems'

require 'redis'



def bench(descr)

 start = Time.now

 yield

 puts "#{descr} #{Time.now - start} seconds"

end



def without_pipelining

 r = Redis.new

 10_000.times do

   r.ping

 end

end



def with_pipelining

 r = Redis.new

 r.pipelined do |rp|

   10_000.times do

     rp.ping

   end

 end

end



bench('without pipelining') do

 without_pipelining

end

bench('with pipelining') do

 with_pipelining

end

Running the above simple script yields the following figures on my Mac OS X system, running over the loopback interface, where pipelining will provide the smallest improvement as the RTT is already pretty low:
without pipelining 1.185238 seconds
with pipelining 0.250783 seconds

As you can see, using pipelining, we improved the transfer by a factor of five.
Pipelining vs Scripting 
Using Redis scripting, available since Redis 2.6, a number of use cases for pipelining can be addressed more efficiently using scripts that perform a lot of the work needed at the server side. A big advantage of scripting is that it is able to both read and write data with minimal latency, making operations like read, compute, write very fast (pipelining can't help in this scenario since the client needs the reply of the read command before it can call the write command).
Sometimes the application may also want to send EVAL or EVALSHA commands in a pipeline. This is entirely possible and Redis explicitly supports it with the SCRIPT LOAD command (it guarantees that EVALSHA can be called without the risk of failing).
Appendix: Why are busy loops slow even on the loopback interface? 
Even with all the background covered in this page, you may still wonder why a Redis benchmark like the following (in pseudo code), is slow even when executed in the loopback interface, when the server and the client are running in the same physical machine:
FOR-ONE-SECOND:

   Redis.SET("foo","bar")

END

After all, if both the Redis process and the benchmark are running in the same box, isn't it just copying messages in memory from one place to another without any actual latency or networking involved?
The reason is that processes in a system are not always running, actually it is the kernel scheduler that lets the process run. So, for instance, when the benchmark is allowed to run, it reads the reply from the Redis server (related to the last command executed), and writes a new command. The command is now in the loopback interface buffer, but in order to be read by the server, the kernel should schedule the server process (currently blocked in a system call) to run, and so forth. So in practical terms the loopback interface still involves network-like latency, because of how the kernel scheduler works.
Basically a busy loop benchmark is the silliest thing that can be done when metering performances on a networked server. The wise thing is just avoiding benchmarking in this way.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Request/Response protocols and round-trip time (RTT)
Redis Pipelining
It's not just a matter of RTT
A real world code example
Pipelining vs Scripting
Appendix: Why are busy loops slow even on the loopback interface?
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Production usage
Get your redis-py app ready for production
This guide offers recommendations to get the best reliability and performance in your production environment.
Checklist 
Each item in the checklist below links to the section for a recommendation. Use the checklist icons to record your progress in implementing the recommendations.
     ❌     ✅     🔍     ∅ Client-side caching
     ❌     ✅     🔍     ∅ Retries
     ❌     ✅     🔍     ∅ Health checks
     ❌     ✅     🔍     ∅ Exception handling
     ❌     ✅     🔍     ∅ Timeouts
✅ = 0/5, ❌ = 5/5, 🔍 = 0/5
(∅ = 0/0)
Recommendations 
The sections below offer recommendations for your production environment. Some of them may not apply to your particular use case.
Client-side caching 
Client-side caching involves storing the results from read-only commands in a local cache. If the same command is executed again later, the results can be obtained from the cache, without contacting the server. This improves command execution time on the client, while also reducing network traffic and server load. See Connect using client-side caching for more information and example code.
Retries 
Redis connections and commands can often fail due to transient problems, such as temporary network outages or timeouts. When this happens, the operation will generally succeed after a few attempts, despite failing the first time.
redis-py can retry commands automatically when errors occur. From version 6.0.0 onwards, the default behavior is to attempt a failed command three times. The timing between successive attempts is calculated using exponential backoff with some random "jitter" added to avoid two or more connections retrying commands in sync with each other.
You can override the default behavior using an instance of the Retry class to specify the number of times to retry after a failure along with your own choice of backoff strategy. Pass the Retry object in the retry parameter when you connect. For example, the connection in the code below uses an exponential backoff strategy (without jitter) that will make eight repeated attempts after a failure:
from redis.backoff import ExponentialBackoff

from redis.retry import Retry



# Run 8 retries with exponential backoff strategy.

retry = Retry(ExponentialBackoff(), 8)



r = Redis(

 retry=retry,

   .

   .

)

A retry is triggered when a command throws any exception listed in the supported_errors attribute of the Retry class. By default, the list only includes ConnectionError and TimeoutError, but you can set your own choice of exceptions when you create the instance:
# Only retry after a `TimeoutError`.

retry = Retry(ExponentialBackoff(), 3, supported_errors=(TimeoutError,))

You can also add extra exceptions to the default list using the retry_on_error parameter when you connect:
# Add `BusyLoadingError` to the default list of exceptions.

from redis.exceptions import (

  BusyLoadingError,

)

   .

   .



r = Redis(

 retry=retry,

 retry_on_error=[BusyLoadingError],

   .

   .

)

For a connection to a Redis cluster, you can specify a retry instance, but the list of exceptions is not configurable and is always set to TimeoutError, ConnectionError, and ClusterDownError.
Health checks 
If your code doesn't access the Redis server continuously then it might be useful to make a "health check" periodically (perhaps once every few seconds) to verify that the connection is working. Set the health_check_interval parameter during a connection (with either Redis or ConnectionPool) to specify an integer number of seconds. If the connection remains idle for longer than this interval, it will automatically issue a PING command and check the response before continuing with any client commands.
# Issue a health check if the connection is idle for longer

# than three seconds.

r = Redis(

 health_check_interval = 3,

   .

   .

)

Health checks help to detect problems as soon as possible without waiting for a user to report them. Note that health checks, like other commands, will be retried using the strategy that you specified for the connection.
Exception handling 
Redis handles many errors using return values from commands, but there are also situations where exceptions can be thrown. In production code, you should handle exceptions wherever they can occur.
Import the exceptions you need to check from the redis.exceptions module. The list below describes some of the most common exceptions.
ConnectionError: Thrown when a connection attempt fails (for example, when connection parameters are invalid or the server is unavailable) and sometimes when a health check fails. There is also a subclass, AuthenticationError, specifically for authentication failures.
ResponseError: Thrown when you attempt an operation that has no valid response. Examples include executing a command on the wrong type of key (as when you try an 'LPUSH' command on a string key), creating an index with a name that already exists, and using an invalid ID for a stream entry.
TimeoutError: Thrown when a timeout persistently happens for a command, despite any retries.
WatchError: Thrown when a watched key is modified during a transaction.
Timeouts 
After you issue a command or a connection attempt, the client will wait for a response from the server. If the server doesn't respond within a certain time limit, the client will throw a TimeoutError. By default, the timeout happens after 10 seconds for both connections and commands, but you can set your own timeouts using the socket_connect_timeout and socket_timeout parameters when you connect:
# Set a 15-second timeout for connections and a

# 5-second timeout for commands.

r = Redis(

 socket_connect_timeout=15,

 socket_timeout=5,

   .

   .

)

Take care to set the timeouts to appropriate values for your use case. If you use timeouts that are too short, then redis-py might retry commands that would have succeeded if given more time. However, if the timeouts are too long, your app might hang unnecessarily while waiting for a response that will never arrive.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Checklist
Recommendations
Client-side caching
Retries
Health checks
Exception handling
Timeouts
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Performance Tuning Best Practices
Redis Enterprise Software
Redis Cloud
Redis CE and Stack
performance
Last updated 18, Apr 2024
Question
In this article, you can find best practices for operating a Redis Enterprise database. Some recommendations are also good for a Redis Community deployment, especially when dealing with the suitable data types and commands, keeping an eye on command complexity.
Redis Commands
Check the slow log for EVALSHA, HGETALL, HMGET, MGET, and all types of SCAN commands. Lower the slow log threshold to capture more slow commands. You can configure the threshold using CONFIG SET slowlog-log-slower-than <THRESHOLD_MICROSECONDS>
Avoid the KEYS command, which does a scan of the entire keyspace.
Take into account MGET commands when calculating the true ops/s. E.g. MGET of 10 keys at 32k ops/s would equate to 320k ops/s.
Hot and Big Keys
Verify the size of keys using redis-cli --bigkeys and redis-cli --hotkeys(it works only with non-CRDB databases). With high CPU usage caused by operations on a huge key (such as scans), sharding won't help. Large keys can be split into smaller ones to ease the load
The recommendation is also to limit the size of the range, either command (ZREVRANGE, ZRANGE, ZREVRANGEBYSCORE etc.) will be fine, just don't perform full range (0 -1). The more the range can be limited the better. Then on large sets, we recommend using ZRANGE (or other range scanning commands) with a defined range and not a full scan
If possible, avoid unbounded LRANGE calls: they can generate high latency. Use a range. If it's a time series it can be treated more efficiently in a different data structure.
Deletion
Delete huge keys using the asynchronous UNLINK rather than the synchronous DEL.
To perform massive key deletion in Redis without impacting performance, use either redis-cli or Redis Insight with bulk actions. Using redis-cli, you can indicate a pattern and make sure you:
Use -i option so you don’t block the execution of the shard
Use UNLINK, so you execute tasks in the background
 -i <interval>      
    When -r is used, waits <interval> seconds per command.                     
    It is possible to specify sub-second times like -i 0.1.

Copy code
So an example using the command would be:
redis-cli -p <PORT> --scan --pattern city:* -i 0.01 | xargs redis-cli -p <PORT> unlink

Copy code
Alternatively, it is possible to use xargs with the -L option (max lines) to reduce the chance of blocking the service for other commands.
man xargs

[...]

-L number   Call utility for every number non-empty lines read.

Copy code
Redis Insight has a "BULK ACTIONS" tab and it has the option to Delete Keys.
In the “Find keys” form field it is possible to provide a pattern
Click on “DRY RUN” button
The Preview Pane returns a list of keys that will UNLINK
Click on 'EXECUTE' button to perform the deletion of keys
Persistence and Backups
Non-replicated databases may cause delays when backups are executed or persistence (AOF/snapshots) is enabled. Replicated databases resolve the side effect, backup is collected on replica shards. The same behavior applies to persistence.
LUA scripts
Verify LUA scripts do not keep the state machine busy with long executions. Check metric "Other cmds", which means anything but commands, like non-read/write commands taking place. For example, auth/ping/eval/evalsha/type commands.
Scalability and shards placement
Scale-up. Reshard the database so to take advantage of multiple cores. Keep the single proxy policy if the shards are in the same node.
Scale-out. Redistribute shards across nodes if the CPUs are hogged (if the database is not clustered, make sure operations are cluster-safe).
Optimize shard placement using the corresponding REST API endpoint and evaluate the recommendations for a given database.
DMC proxy scaling. If a database has shards on multiple nodes, consider also changing the proxy policy (all-master-shards), so the DMC proxy can also scale.
Configure and benchmark a different number of threads for the DMC proxy (max_threads) to make sure the proxy does not represent a bottleneck.
Check if shards are balanced: unbalancing may be caused by nodes having different characteristics. The use of hashing policies or huge keys can cause unbalancing, too.
Resources
Check for AOF errors in slave shard logs: that implies a slow disk. The Management UI can also report "Unable to write to disk due to reaching disk I/O limit" on the nodes summary page. The alert is about the disk I/O limit, not the storage limit. The disk may not be full but cannot keep up its speed. This may happen, for instance, if all the shards in a node have persistence via AOF enabled. It has something to do with the underlying hardware.
Use logtop to capture spikes caused by any heavy command together with slow log analysis
Make sure swapping is disabled. Linux systems may swap memory even if the box isn’t low on memory (especially with a high swappiness value)
Low memory can also cause costly evictions. Massive key eviction can cause latency spikes as the database must release the memory. This may happen if the cluster is low on memory and the eviction policy is configured for volatile-lru or simply because the massive amount of keys was set with EXPIRE
Redis Enterprise Active-Active databases now support the MEMORY USAGE command from version 6.2.18, which simplifies troubleshooting and lets applications detect anomalous behavior and dangerous trends.
Network Latency
Check if the master shard and endpoint are located on the different nodes, which also might increase the latency (best if all master shards are close to the proxy)
Are the client and database on the same VPC or a different VPC with peering? Both running in the same VPC could help multiply the number of packets per second.
Connection pooling
It is always recommended to use connection pooling. Otherwise, each request will open a new connection. This exposes many possible momentary problems that could prevent the opening of the connection. In addition, opening and closing connections cause additional overhead.
A few connections will serve all the requests using connection pooling and will not close after each request. This eliminates the problems above and will ensure better performance because no time will be wasted on opening and closing connections.
Redis Enterprise keeps connections open forever unless clients close them or don't reply to TCP keep-alive messages. Idle connections that do not answer keepalives for 5 consecutive minutes are closed: Redis Enterprise assumes that clients closed their connections. Verifying the number of active connections is possible using the CLIENT LIST command.
If using a pool, you may need to increase the minimum number of connections in the pool so no new thread creation will delay operations on the client. If not using a pool, evaluate using it.
Examples of clients supporting connection pooling:
redis-py
jedis
Not all the clients make the connection pooling feature available: StackExchange, as an example, multiplexes a single connection.
Pipelining
Using client pipelining, it is possible to save on round-trip time by packing multiple commands in batches. In addition to reducing the cumulative latency of multiple commands down to the latency of the batches, fewer socket read operations are needed to read the incoming messages, thus saving on system calls and reducing the overall latency. Read more in the documentation.
Uneven load is observed on different shards
Having more shards for a database to exploit parallelism offered by multiple cores is possible, but it may not always help. There could be a few reasons for having a hot shard. One is that there is a big key or keys on that shard. To find that, you can run the redis-cli command with --bigkeys flag.
redis-cli -h <hostname> -p <port> -a <password> --bigkeys

Copy code
You could also have a hot key. To identify that, you could run the MONITOR command for a very short monitor period of time (a few seconds) in a low-traffic period. Please note that this command is dangerous and can affect latency. Please run it for a very short period of time and test it out first on a dev DB or other low-traffic non-production DB. Read more about the MONITOR command.
Recommendations
How can I perform massive key deletion in Redis without impacting performance?
What Are the Impacts of the Redis Expiration Algorithm?
How to Troubleshoot Latency Issues?
What needs to be checked before resharding a Redis Enterprise database?
Is maxmemory the Maximum Value of Used Memory?
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
           All products           Redis Enterprise           Redis Cloud           Redis CE and Stack           Redis Insight           Redis Enterprise for K8s           Redis Data Integration           Client Libraries         
ESC

Recommended security practices
Redis Enterprise Software

Deployment security 
When deploying Redis Enterprise Software to production, we recommend the following practices:
Deploy Redis Enterprise inside a trusted network: Redis Enterprise is database software and should be deployed on a trusted network not accessible to the public internet. Deploying Redis Enterprise in a trusted network reduces the likelihood that someone can obtain unauthorized access to your data or the ability to manage your database configuration.
Implement anti-virus exclusions: To ensure that anti-virus solutions that scan files or intercept processes to protect memory do not interfere with Redis Enterprise software, you should ensure that anti-virus exclusions are implemented across all nodes in their Redis Enterprise cluster in a consistent policy. This helps ensure that anti-virus software does not impact the availability of your Redis Enterprise cluster.
If you are replacing your existing antivirus solution or installing/supporting Redis Enterprise, make sure that the below paths are excluded:
Note:
For antivirus solutions that intercept processes, binary files may have to be excluded directly depending on the requirements of your anti-virus vendor.


Path
Description
/opt/redislabs
Main installation directory for all Redis Enterprise Software binaries
/opt/redislabs/bin
Binaries for all the utilities for command line access and managements such as "rladmin" or "redis-cli"
/opt/redislabs/config
System configuration files
/opt/redislabs/lib
System library files
/opt/redislabs/sbin
System binaries for tweaking provisioning


Send logs to a remote logging server: Redis Enterprise is configured to send logs by default to syslog. To send these logs to a remote logging server you must configure syslog based the requirements of the remote logging server vendor. Remote logging helps ensure that the logs are not deleted so that you can rotate the logs to prevent your server disk from filling up.
Deploy clusters with an odd number of 3 or more nodes: Redis is an available and partition-tolerant database. We recommend that Redis Enterprise be deployed in a cluster of an odd number of 3 or more nodes so that you are able to successfully failover in the event of a failure.
Reboot nodes in a sequence rather than all at once: It is best practice to frequently maintain reboot schedules. If you reboot too many servers at once, it is possible to cause a quorum failure that results in loss of availability of the database. We recommend that rebooting be done in a phased manner so that quorum is not lost. For example, to maintain quorum in a 3 node cluster, at least 2 nodes must be up at all times. Only one server should be rebooted at any given time to maintain quorum.
Implement client-side encryption: Client-side encryption, or the practice of encrypting data within an application before storing it in a database, such as Redis, is the most widely adopted method to achieve encryption in memory. Redis is an in-memory database and stores data in-memory. If you require encryption in memory, better known as encryption in use, then client side encryption may be the right solution for you. Please be aware that database functions that need to operate on data — such as simple searching functions, comparisons, and incremental operations — don’t work with client-side encryption.
Cluster security 
Control the level of access to your system: Redis Enterprise lets you decide which users can access the cluster, which users can access databases, and which users can access both. We recommend preventing database users from accessing the cluster. See Access control for more information.
Enable LDAP authentication: If your organization uses the Lightweight Directory Access Protocol (LDAP), we recommend enabling Redis Enterprise Software support for role-based LDAP authentication.
Require HTTPS for API endpoints: Redis Enterprise comes with a REST API to help automate tasks. This API is available in both an encrypted and unencrypted endpoint for backward compatibility. You can disable the unencrypted endpoint with no loss in functionality.
Database security 
Redis Enterprise offers several database security controls to help protect your data against unauthorized access and to improve the operational security of your database. The following section details configurable security controls available for implementation.
Use strong Redis passwords: A frequent recommendation in the security industry is to use strong passwords to authenticate users. This helps to prevent brute force password guessing attacks against your database. Its important to check that your password aligns with your organizations security policy.
Deactivate default user access: Redis Enterprise comes with a "default" user for backwards compatibility with applications designed with versions of Redis prior to Redis Enterprise 6. The default user is turned on by default. This allows you to access the database without specifying a username and only using a shared secret. For applications designed to use access control lists, we recommend that you deactivate default user access.
Configure Transport Layer Security (TLS): Similar to the control plane, you can also configure TLS protocols to help support your security and compliance needs.
Enable client certificate authentication: To prevent unauthorized access to your data, Redis Enterprise databases support the TLS protocol, which includes authentication and encryption. Client certificate authentication can be used to ensure only authorized hosts can access the database.
Install trusted certificates: Redis implements self-signed certificates for the database proxy and replication service, but many organizations prefer to use their own certificates.
Configure and verify database backups: Implementing a disaster recovery strategy is an important part of data security. Redis Enterprise supports database backups to many destinations.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Deployment security
Cluster security
Database security
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Redis Enterprise Software observability and monitoring guidance
Using monitoring and observability with Redis Enterprise
Introduction 
This document provides observability and monitoring guidance for developers running applications that connect to Redis Enterprise. In particular, this guide focuses on the systems and resources that are most likely to impact the performance of your application.
The screenshot below shows a dashboard with relevant statistics for a node:
To effectively monitor a Redis Enterprise cluster you need to observe core cluster resources and key database performance indicators as described in the following sections for this guide.
Core cluster resources include:
Memory utilization
CPU utilization
Database connections
Network traffic
Synchronization
Key database performance indicators include:
Latency
Cache hit rate
Key eviction rate
Proxy Performance
Dashboard showing an overview of cluster metrics:
In addition to manually monitoring these resources and indicators, it is best practice to set up alerts.
Core cluster resource monitoring 
Redis Enterprise version 7.8.2 introduces a preview of the new metrics stream engine that exposes the v2 Prometheus scraping endpoint at https://<IP>:8070/v2. This new engine exports all time-series metrics to external monitoring tools such as Grafana, DataDog, NewRelic, and Dynatrace using Prometheus.
The new engine enables real-time monitoring, including full monitoring during maintenance operations, providing full visibility into performance during events such as shards' failovers and scaling operations. See Monitoring with metrics and alerts for more details.
If you are already using the existing scraping endpoint for integration, follow this guide to transition and try the new engine. You can scrape both existing and new endpoints simultaneously, which lets you create advanced dashboards and transition smoothly.
Memory 
Every Redis Enterprise database has a maximum configured memory limit to ensure isolation in a multi-database cluster.
Metric name
Definition
Unit
Memory usage percentage metric
Percentage of used memory relative to the configured memory limit for a given database
Percentage

Dashboard displaying high-level cluster metrics - Cluster Dashboard
Thresholds 
The appropriate memory threshold depends on how the application is using Redis.
Caching workloads, which permit Redis to evict keys, can safely use 100% of available memory.
Non-caching workloads do not permit key eviction and should be closely monitored as soon as memory usage reaches 80%.
Caching workloads 
For applications using Redis solely as a cache, you can safely let the memory usage reach 100% as long as you have an eviction policy in place. This will ensure that Redis can evict keys while continuing to accept new writes.
Note: Eviction will increase write command latency as Redis has to cleanup the memory/objects before accepting a new write to prevent OOM when memory usage is at 100%.
While your Redis database is using 100% of available memory in a caching context, it's still important to monitor performance. The key performance indicators include:
Latency
Cache hit ratio
Evicted keys
Read latency 
Latency has two important definitions, depending on context:
In the context of Redis itself, latency is the time it takes for Redis to respond to a request. The Latency section below provides a broader discussion of this metric.
In the context of your application, Latency is the time it takes for the application to process a request. This will include the time it takes to execute both reads and writes to Redis, as well as calls to other databases and services. Note that its possible for Redis to report low latency while the application is experiencing high latency. This may indicate a low cache hit ratio, ultimately caused by insufficient memory.
You need to monitor both application-level and Redis-level latency to diagnose caching performance issues in production.
Cache hit ratio and eviction 
Cache hit ratio is the percentage of read requests that Redis serves successfully. Eviction rate is the rate at which Redis evicts keys from the cache. These metrics are sometimes inversely correlated: a high eviction rate may cause a low cache hit ratio if too many frequently-used keys are being evicted.
If the Redis server is empty, the hit ratio will be 0%. As the application runs and the fills the cache, the hit ratio will increase.
When the entire cached working set fits in memory, the cache hit ratio will reach close to 100% while the percent of used memory will remain below 100%.
When the working set cannot fit in memory, the eviction policy will start to evict keys. It is important to choose a policy that generally evicts rarely-used keys to keep the cache hit ratio as high as possible.
In both cases, keys will may be manually invalidated by the application or evicted through the uses of TTLs (time-to-live) and an eviction policy.
The ideal cache hit ratio depends on the application, but generally, the ratio should be greater than 50%. Low hit ratios coupled with high numbers of object evictions may indicate that your cache is too small. This can cause thrashing on the application side, a scenario where the cache is constantly being invalidated.
This means that when your Redis database is using 100% of available memory, you need to measure the rate of key evictions.
An acceptable rate of key evictions depends on the total number of keys in the database and the measure of application-level latency. If application latency is high, check to see that key evictions have not increased.
Eviction policies 
Name
Description
noeviction
New values aren’t saved when memory limit is reached. When a database uses replication, this applies to the primary database
allkeys-lru
Keeps most recently used keys; removes least recently used (LRU) keys
allkeys-lfu
Keeps frequently used keys; removes least frequently used (LFU) keys
volatile-lru
Removes least recently used keys with the expire field set to true.
volatile-lfu
Removes least frequently used keys with the expire field set to true.
allkeys-random
Randomly removes keys to make space for the new data added.
volatile-random
Randomly removes keys with expire field set to true.
volatile-ttl
Removes keys with expire field set to true and the shortest remaining time-to-live (TTL) value.

Eviction policy guidelines 
Use the allkeys-lru policy when you expect a power-law distribution in the popularity of your requests. That is, you expect a subset of elements will be accessed far more often than the rest. This is a good policy to choose if you are unsure.
Use the allkeys-random if you have a cyclic access where all the keys are scanned continuously, or when you expect the distribution to be uniform.
Use the volatile-ttl if you want to be able to provide hints to Redis about what are good candidates for expiration by using different TTL values when you create your cache objects.
The volatile-lru and volatile-random policies are mainly useful when you want to use a single instance for both caching and to have a set of persistent keys. However it is usually a better idea to run two Redis instances to solve such a problem.
Note: Setting an expire value to a key costs memory, so using a policy like allkeys-lru is more memory efficient because there is no need for an expire configuration for the key to be evicted under memory pressure.
Non-caching workloads 
If no eviction policy is enabled, then Redis will stop accepting writes when memory usage reaches 100%. Therefore, for non-caching workloads, it is best practice to configure an alert at 80% memory usage. After your database reaches this 80% threshold, you should closely review the rate of memory usage growth.
Troubleshooting 
Issue
Possible causes
Remediation
Redis memory usage has reached 100%
This may indicate an insufficient Redis memory limit for your application's workload
For non-caching workloads (where eviction is unacceptable), immediately increase the memory limit for the database. You can accomplish this through the Redis Enterprise console or its API. Alternatively, you can contact Redis support to assist. For caching workloads, you need to monitor performance closely. Confirm that you have an eviction policy in place. If your application's performance starts to degrade, you may need to increase the memory limit, as described above.
Redis has stopped accepting writes
Memory is at 100% and no eviction policy is in place
Increase the database's total amount of memory. If this is for a caching workload, consider enabling an eviction policy. In addition, you may want to determine whether the application can set a reasonable TTL (time-to-live) on some or all of the data being written to Redis.
Cache hit ratio is steadily decreasing
The application's working set size may be steadily increasing. Alternatively, the application may be misconfigured (for example, generating more than one unique cache key per cached item.)
If the working set size is increasing, consider increasing the memory limit for the database. If the application is misconfigured, review the application's cache key generation logic.

CPU 
Redis Enterprise provides several CPU metrics:
Metric name
Definition
Unit
Shard CPU
CPU time portion spent by database shards as a percentage
up to 100% per shard
Proxy CPU
CPU time portion spent by the cluster's proxy(s) as a percentage
100% per proxy thread
Node CPU (User and System)
CPU time portion spent by all user-space and kernel-level processesas a Percentage
100% per node CPU

To understand CPU metrics, it's worth recalling how a Redis Enterprise cluster is organized. A cluster consists of one or more nodes. Each node is a VM (or cloud compute instance) or a bare-metal server.
A database is a set of processes, known as shards, deployed across the nodes of a cluster.
In the dashboard, shard CPU is the CPU utilization of the processes that make up the database. When diagnosing performance issues, start by looking at shard CPU.
Dashboard displaying CPU usage - Database Dashboard
Thresholds 
In general, we define high CPU as any CPU utilization above 80% of total capacity.
Shard CPU should remain below 80%. Shards are single-threaded, so a shard CPU of 100% means that the shard is fully utilized.
Display showing Proxy CPU usage - Proxy Dashboard
Proxy CPU should remain below 80% of total capacity. The proxy is a multi-threaded process that handles client connections and forwards requests to the appropriate shard. Because the total number of proxy threads is configurable, the proxy CPU may exceed 100%. A proxy configured with 6 threads can reach 600% CPU utilization, so in this case, keeping utilization below 80% means keeping the total proxy CPU usage below 480%.
Dashboard displaying an ensemble of Node CPU usage data - Node Dashboard
Node CPU should also remain below 80% of total capacity. As with the proxy, the node CPU is variable depending on the CPU capacity of the node. You will need to calibrate your alerting based on the number of cores in your nodes.
Troubleshooting 
High CPU utilization has multiple possible causes. Common causes include an under-provisioned cluster, excess inefficient Redis operations, and hot master shards.
Issue
Possible causes
Remediation
High CPU utilization across all shards of a database
This usually indicates that the database is under-provisioned in terms of number of shards. A secondary cause may be that the application is running too many inefficient Redis operations.
You can detect slow Redis operations by enabling the slow log in the Redis Enterprise UI. First, rule out inefficient Redis operations as the cause of the high CPU utilization. The Latency section below includes a broader discussion of this metric in the context of your application. If inefficient Redis operations are not the cause, then increase the number of shards in the database.
High CPU utilization on a single shard, with the remaining shards having low CPU utilization
This usually indicates a master shard with at least one hot key. Hot keys are keys that are accessed extremely frequently (for example, more than 1000 times per second).
Hot key issues generally cannot be resolved by increasing the number of shards. To resolve this issue, see the section on Hot keys below.
High Proxy CPU
There are several possible causes of high proxy CPU. First, review the behavior of connections to the database. Frequent cycling of connections, especially with TLS is enabled, can cause high proxy CPU utilization. This is especially true when you see more than 100 connections per second per thread. Such behavior is almost always a sign of a misbehaving application. Review the total number of operations per second against the cluster. If you see more than 50k operations per second per thread, you may need to increase the number of proxy threads.
In the case of high connection cycling, review the application's connection behavior. In the case of high operations per second, increase the number of proxy threads.
High Node CPU
You will typically detect high shard or proxy CPU utilization before you detect high node CPU utilization. Use the remediation steps above to address high shard and proxy CPU utilization. In spite of this, if you see high node CPU utilization, you may need to increase the number of nodes in the cluster.
Consider increasing the number of nodes in the cluster and the rebalancing the shards across the new nodes. This is a complex operation and you should do it with the help of Redis support.
High System CPU
Most of the issues above will reflect user-space CPU utilization. However, if you see high system CPU utilization, this may indicate a problem at the network or storage level.
Review network bytes in and network bytes out to rule out any unexpected spikes in network traffic. You may need perform some deeper network diagnostics to identify the cause of the high system CPU utilization. For example, with high rates of packet loss, you may need to review network configurations or even the network hardware.

Connections 
The Redis Enterprise database dashboard indicates the total number of connections to the database.
You should monitor this connection count metric with both a minimum and maximum number of connections in mind. Based on the number of application instances connecting to Redis (and whether your application uses connection pooling), you should have a rough idea of the minimum and maximum number of connections you expect to see for any given database. This number should remain relatively constant over time.
Troubleshooting 
Issue
Possible causes
Remediation
Fewer connections to Redis than expected
The application may not be connecting to the correct Redis database. There may be a network partition between the application and the Redis database.
Confirm that the application can successfully connect to Redis. This may require consulting the application logs or the application's connection configuration.
Connection count continues to grow over time
Your application may not be releasing connections. The most common of such a connection leak is a manually implemented connection pool or a connection pool that is not properly configured.
Review the application's connection configuration
Erratic connection counts (for example, spikes and drops)
Application misbehavior (thundering herds, connection cycling, or networking issues)
Review the application logs and network traffic to determine the cause of the erratic connection counts.

Dashboard displaying connections - Database Dashboard
Network ingress/egress 
The network ingress/egress panel shows the amount of data being sent to and received from the database. Large spikes in network traffic can indicate that the cluster is under-provisioned or that the application is reading and/or writing unusually large keys. A correlation between high network traffic and high CPU utilization may indicate a large key scenario.
Unbalanced database endpoint 
One possible cause of network traffic spikes is that the database endpoint is not located on the same node as the master shards. In addition to added network latency, if data plane internode encryption is enabled, CPU consumption can increase as well.
One solution is to use the optimal shard placement and proxy policy to ensure endpoints are collocated on nodes hosting master shards. If you need to restore balance (for example, after node failure) you can manually failover shard(s) with the rladmin cli tool.
Extreme network traffic utilization may approach the limits of the underlying network infrastructure. In this case, the only remediation is to add more nodes to the cluster and scale the database's shards across them.
Synchronization 
In Redis Enterprise, geographically-distributed synchronization is based on Conflict-free replicated data types (CRDT) technology. The Redis Enterprise implementation of CRDT is called an Active-Active database (formerly known as CRDB). With Active-Active databases, applications can read and write to the same data set from different geographical locations seamlessly and with low latency, without changing the way the application connects to the database.
An Active-Active architecture is a data resiliency architecture that distributes the database information over multiple data centers using independent and geographically distributed clusters and nodes. It is a network of separate processing nodes, each having access to a common replicated database such that all nodes can participate in a common application ensuring local low latency with each region being able to run in isolation.
To achieve consistency between participating clusters, Redis Active-Active synchronization uses a process called the syncer.
The syncer keeps a replication backlog, which stores changes to the dataset that the syncer sends to other participating clusters. The syncer uses partial syncs to keep replicas up to date with changes, or a full sync in the event a replica or primary is lost.
Dashboard displaying connection metrics between zones - Synchronization Dashboard
CRDT provides three fundamental benefits over other geo-distributed solutions:
It offers local latency on read and write operations, regardless of the number of geo-replicated regions and their distance from each other.
It enables seamless conflict resolution (“conflict-free”) for simple and complex data types like those of Redis core.
Even if most of the geo-replicated regions in a CRDT database (for example, 3 out of 5) are down, the remaining geo-replicated regions are uninterrupted and can continue to handle read and write operations, ensuring business continuity.
Database performance indicators 
There are several key performance indicators that report your database's performance against your application's workload:
Latency
Cache hit rate
Key eviction rate
Latency 
Latency is the time it takes for Redis to respond to a request. Redis Enterprise measures latency from the first byte received by the proxy to the last byte sent in the command's response.
An adequately provisioned Redis database running efficient Redis operations will report an average latency below 1 millisecond. In fact, it's common to measure latency in terms of microseconds. Businesses regularly achieve, and sometimes require, average latencies of 400-600 microseconds.
Dashboard display of latency metrics - Database Dashboard
The metrics distinguish between read and write latency. Understanding whether high latency is due to read or writes can help you to isolate the underlying issue.
Note that these latency metrics do not include network round trip time or application-level serialization, which is why it's essential to measure request latency at the application, as well.
Display showing a noticeable spike in latency
Troubleshooting 
Here are some possible causes of high database latency. Note that high database latency is just one of the reasons why application latency might be high. Application latency can be caused by a variety of factors, including a low cache hit rate.
Issue
Possible causes
Remediation
Slow database operations
Confirm that there are no excessive slow operations in the Redis slow log.
If possible, reduce the number of slow operations being sent to the database.
If this not possible, consider increasing the number of shards in the database.
Increased traffic to the database
Review the network traffic and the database operations per second chart to determine if increased traffic is causing the latency.
If the database is underprovisioned due to increased traffic, consider increasing the number of shards in the database.
Insufficient CPU
Check to see if the CPU utilization is increasing.
Confirm that slow operations are not causing the high CPU utilization. If the high CPU utilization is due to increased load, consider adding shards to the database.

Cache hit rate 
Cache hit rate is the percentage of all read operations that return a response. Note: Cache hit rate is a composite statistic that is computed by dividing the number of read hits by the total number of read operations. When an application tries to read a key that exists, this is known as a cache hit. Alternatively, when an application tries to read a key that does not exist, this is knows as a cache miss.
For caching workloads, the cache hit rate should generally be above 50%, although the exact ideal cache hit rate can vary greatly depending on the application and depending on whether the cache is already populated.
Dashboard showing the cache hit ratio along with read/write misses - Database Dashboard
Note: Redis Enterprise actually reports four different cache hit / miss metrics. These are defined as follows:
Metric name
Definition
bdb_read_hits
The number of successful read operations
bdb_read_misses
The number of read operations returning null
bdb_write_hits
The number of write operations against existing keys
bdb_write_misses
The number of write operations that create new keys

Troubleshooting 
Cache hit rate is usually only relevant for caching workloads. Eviction will begin after the database approaches its maximum memory capacity.
A high or increasing rate of evictions will negatively affect database latency, especially if the rate of necessary key evictions exceeds the rate of new key insertions.
See the Cache hit ratio and eviction section for tips on troubleshooting cache hit rate.
Key eviction rate 
They key eviction rate is rate at which objects are being evicted from the database. See eviction policy for a discussion of key eviction and its relationship with memory usage.
Dashboard displaying object evictions - Database Dashboard
Proxy performance 
Redis Enterprise Software provides high-performance data access through a proxy process that manages and optimizes access to shards within the cluster. Each node contains a single proxy process. Each proxy can be active and take incoming traffic or it can be passive and wait for failovers.
Proxy policies 
Policy
Description
Single
There is only a single proxy that is bound to the database. This is the default database configuration and preferable in most use cases.
All Master Shards
There are multiple proxies that are bound to the database, one on each node that hosts a database master shard. This mode fits most use cases that require multiple proxies.
All Nodes
There are multiple proxies that are bound to the database, one on each node in the cluster, regardless of whether or not there is a shard from this database on the node. This mode should be used only in special cases, such as using a load balancer.

Dashboard displaying proxy thread activity - Proxy Thread Dashboard
If you need to, you can tune the number of proxy threads using the rladmin tune proxy command to make the proxy use more CPU cores. Cores used by the proxy won't be available for Redis, therefore we need to take into account the number of Redis nodes on the host and the total number of available cores.
The command has a few parameters you can use to set a new number of proxy cores:
id|all - you can either tune a specific proxy by its id, or all proxies.
mode - determines whether or not the proxy can automatically adjust the number of threads depending on load.
threads and max_threads - determine the initial number of threads created on startup, and the maximum number of threads allowed.
scale_threshold - determines the CPU utilization threshold that triggers spawning new threads. This CPU utilization level needs to be maintained for at least scale_duration seconds before automatic scaling is performed.
The following table indicates ideal proxy thread counts for the specified environments.
Total Cores
Redis (ROR)
Redis on Flash (ROF)
1
1
1
4
3
3
8
5
3
12
8
4
16
10
5
32
24
10
64/96
32
20
128
32
32

Data access anti-patterns 
There are three data access patterns that can limit the performance of your Redis database:
Slow operations
Hot keys
Large keys
This section defines each of these patterns and describes how to diagnose and mitigate them.
Slow operations 
Slow operations are operations that take longer than a few milliseconds to complete.
Not all Redis operations are equally efficient. The most efficient Redis operations are O(1) operations; that is, they have a constant time complexity. Example of such operations include GET, SET, SADD, and HSET.
These constant time operations are unlikely to cause high CPU utilization. Note: Even so, it's still possible for a high rate of constant time operations to overwhelm an underprovisioned database.
Other Redis operations exhibit greater levels of time complexity. O(n) (linear time) operations are more likely to cause high CPU utilization. Examples include HGETALL, SMEMBERS, and LREM. These operations are not necessarily problematic, but they can be if executed against data structures holding a large number of elements (for example, a list with 1 million elements).
However, the KEYS command should almost never be run against a production system, since returning a list of all keys in a large Redis database can cause significant slowdowns and block other operations. If you need to scan the keyspace, especially in a production cluster, always use the SCAN command instead.
Troubleshooting 
The best way to discover slow operations is to view the slow log. The slow log is available in the Redis Enterprise and Redis Cloud consoles:
Redis Enterprise slow log docs
Redis Cloud slow log docs
Redis Cloud dashboard showing slow database operations
Issue
Remediation
The KEYS command shows up in the slow log
Find the application that issues the KEYS command and replace it with a SCAN command. In an emergency situation, you can alter the ACLs for the database user so that Redis will reject the KEYS command altogether.
The slow log shows a significant number of slow, O(n) operations
If these operations are being issued against large data structures, then the application may need to be refactored to use more efficient Redis commands.
The slow logs contains only O(1) commands, and these commands are taking several milliseconds or more to complete
This likely indicates that the database is underprovisioned. Consider increasing the number of shards and/or nodes.

Hot keys 
A hot key is a key that is accessed extremely frequently (for example, thousands of times a second or more).
Each key in Redis belongs to one, and only one, shard. For this reason, a hot key can cause high CPU utilization on that one shard, which can increase latency for all other operations.
Troubleshooting 
You may suspect that you have a hot key if you see high CPU utilization on a single shard. There are two main way to identify hot keys: using the Redis CLI and sampling the operations against Redis.
To use the Redis CLI to identify hot keys:
First confirm that you have enough available memory to enable an eviction policy.
Next, enable the LFU (least-frequently used) eviction policy on the database.
Finally, run redis-cli --hotkeys
You may also identify hot keys by sampling the operations against Redis. You can use do this by running the MONITOR command against the high CPU shard. Because this is a potentially high-impact operation, you should only use this technique as a secondary option. For mission-critical databases, consider contacting Redis support for assistance.
Remediation 
After you discover a hot key, you need to find a way to reduce the number of operations against it. This means getting an understanding of the application's access pattern and the reasons for such frequent access.
If the hot key operations are read-only, consider implementing an application-local cache so that fewer read requests are sent to Redis. For example, even a local cache that expires every 5 seconds can entirely eliminate a hot key issue.
Large keys 
Large keys are keys that are hundreds of kilobytes or larger. High network traffic and high CPU utilization can be caused by large keys.
Troubleshooting 
To identify large keys, you can sample the keyspace using the Redis CLI.
Run redis-cli --memkeys against your database to sample the keyspace in real time and potentially identify the largest keys in your database.
Remediation 
Addressing a large key issue requires understanding why the application is creating large keys in the first place. As such, it's difficult to provide general advice to solving this issue. Resolution often requires a change to the application's data model or the way it interacts with Redis.
Alerting 
The Redis Enterprise observability package includes a suite of alerts and their associated tests for use with Prometheus. Note: Not all the alerts are appropriate for all environments; for example, installations that do not use persistence have no need for storage alerts.
The alerts are packaged with a series of tests that validate the individual triggers. You can use these tests to validate your modifications to these alerts for specific environments and use cases.
To use these alerts, install Prometheus Alertmanager. For a comprehensive guide to alerting with Prometheus and Grafana, see the Grafana blog post on the subject.
Configure Prometheus 
To configure Prometheus for alerting, open the prometheus.yml configuration file.
Uncomment the Alertmanager section of the file. The following configuration starts Alertmanager and instructs it to listen on its default port of 9093.
# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

The Rule file section of the config file instructs Alertmanager to read specific rules files. If you pasted the alerts.yml file into /etc/prometheus then the following configuration would be required.
# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  - "error_rules.yml"
  - "alerts.yml"

After you've done this, restart Prometheus.
The built-in configuration, error_rules.yml, has a single alert: Critical Connection Exception. If you open the Prometheus console, by default located at port 9090, and select the Alert tab, you will see this alert, as well as the alerts in any other file you have included as a rules file.

The following is a list of alerts contained in the alerts.yml file. There are several points to consider:
Not all Redis Enterprise deployments export all metrics
Most metrics only alert if the specified trigger persists for a given duration
List of alerts 
Description
Trigger
Average latency has reached a warning level
round(bdb_avg_latency * 1000) > 1
Average latency has reached a critical level indicating system degradation
round(bdb_avg_latency * 1000) > 4
Absence of any connection indicates improper configuration or firewall issue
bdb_conns < 1
A flood of connections has occurred that will impact normal operations
bdb_conns > 64000
Absence of any requests indicates improperly configured clients
bdb_total_req < 1
Excessive number of client requests indicates configuration and/or programmatic issues
bdb_total_req > 1000000
The database in question will soon be unable to accept new data
round((bdb_used_memory/bdb_memory_limit) * 100) > 98
The database in question will be unable to accept new data in two hours
round((bdb_used_memory/bdb_memory_limit) ** 100) < 98 and (predict_linear(bdb_used_memory[15m], 2 ** 3600) / bdb_memory_limit) > 0.3 and round(predict_linear(bdb_used_memory[15m], 2 * 3600)/bdb_memory_limit) > 0.98
Database read operations are failing to find entries more than 50% of the time
(100 * bdb_read_hits)/(bdb_read_hits + bdb_read_misses) < 50
In situations where TTL values are not set this indicates a problem
bdb_evicted_objects > 1
Replication between nodes is not in a satisfactory state
bdb_replicaof_syncer_status > 0
Record synchronization between nodes is not in a satisfactory state
bdb_crdt_syncer_status > 0
The amount by which replication lags behind events is worrisome
bdb_replicaof_syncer_local_ingress_lag_time > 500
The amount by which object replication lags behind events is worrisome
bdb_crdt_syncer_local_ingress_lag_time > 500
The number of active nodes is less than expected
count(node_up) != 3
Persistent storage will soon be exhausted
round((node_persistent_storage_free/node_persistent_storage_avail) * 100) <= 5
Ephemeral storage will soon be exhausted
round((node_ephemeral_storage_free/node_ephemeral_storage_avail) * 100) <= 5
The node in question is close to running out of memory
round((node_available_memory/node_free_memory) * 100) <= 15
The node in question has exceeded expected levels of CPU usage
round((1 - node_cpu_idle) * 100) >= 80
The shard in question is not reachable
redis_up == 0
The master shard is not reachable
floor(redis_master_link_status{role="slave"}) < 1
The shard in question has exceeded expected levels of CPU usage
redis_process_cpu_usage_percent >= 80
The master shard has exceeded expected levels of CPU usage
redis_process_cpu_usage_percent{role="master"} > 0.75 and redis_process_cpu_usage_percent{role="master"} > on (bdb) group_left() (avg by (bdb)(redis_process_cpu_usage_percent{role="master"}) + on(bdb) 1.2 * stddev by (bdb) (redis_process_cpu_usage_percent{role="master"}))
The shard in question has an unhealthily high level of connections
redis_connected_clients > 500

Appendix A: Grafana Dashboards 
Grafana dashboards are available for Redis Enterprise Software and Redis Cloud deployments.
These dashboards come in three styles, which may be used together to provide a full picture of your deployment.
Classic dashboards provide detailed information about the cluster, nodes, and individual databases.
Basic dashboards provide a high-level overviews of the various cluster components.
Extended dashboards. These require a third-party library to perform ReST calls.
There are also two workflow dashboards for Redis Enterprise software that provide drill-down functionality.
Software 
Basic
Extended
Classic
Workflow 
Database
Node
Cloud 
Basic
Extended
Note: - The 'workflow' dashboards are intended to be used as a package. Therefore they should all be installed, as they contain links to the other dashboards in the group permitting rapid navigation between the overview and the drill-down views.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Introduction
Core cluster resource monitoring
Memory
Thresholds
Caching workloads
Read latency
Cache hit ratio and eviction
Eviction policies
Eviction policy guidelines
Non-caching workloads
Troubleshooting
CPU
Thresholds
Troubleshooting
Connections
Troubleshooting
Network ingress/egress
Synchronization
Database performance indicators
Latency
Troubleshooting
Cache hit rate
Troubleshooting
Key eviction rate
Proxy performance
Proxy policies
Data access anti-patterns
Slow operations
Troubleshooting
Hot keys
Troubleshooting
Remediation
Large keys
Troubleshooting
Remediation
Alerting
Configure Prometheus
List of alerts
Appendix A: Grafana Dashboards
Software
Workflow
Cloud
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

5.2 Getting Redis Statistics
Change into the observability-stats directory.
Requirements
•docker
•docker-compose
•internet connection
Starting Environment
$ docker-compose up -d
Connect to the Environment
In a terminal run this command to get a shell prompt inside the running Docker container:
$ docker-compose exec redis_stats bash
Generate load
A simple way to to generate some load is to open another terminal and run:
$ docker-compose exec redis_stats redis-benchmark
Info
Since most of the stats data comes from the INFO command you should first run this to view that there.
$ redis-cli INFO
Try piping this output to a file.
Memory usage
Since we generally recommend setting the maxmemory size, it is possible to calculate the percentage of memory in use and alert based on results of the maxmemory configuration value and the used_memory stat.
First set the maxmemory.
$ redis-cli config set maxmemory 100000
Then you can pull the two data points to see how that could be used to calculate memory usage.
$ redis-cli INFO | grep used_memory:
$ redis-cli CONFIG GET maxmemory
Client data
You can pull the clients section of the INFO command
$ redis-cli info clients
or maybe a particular metric you would want to track:
$ redis-cli info clients | grep connected_clients
Stats section
Use redis-cli to list the full 'stats' section.
Hit ratio
A cache hit/miss ratio could be generated using two data points in the stats section.
$ redis-cli INFO stats | grep keyspace
Evicted keys
Eviction occurs when Redis has reached its maximum memory and maxmemory-policy in redis.conf is set to something other than volatile-lru.
$ redis-cli INFO stats | grep evicted_keys
Keyspace
The following data could be used for graphing the size of the keyspace as a quick drop or spike in the number of keys is a good indicator of issues.
$ redis-cli INFO keyspace
Workload (connections received, commands processed)
The following stats are a good indicator of workload on the Redis server.
$ redis-cli INFO stats | egrep "^total_"

Last updated on May 12, 2025
Previous
5.1 Data points in Redis
Next
5.3 Identifying Issues
On this page







TrustPrivacyTerms of useLegal notices
USE CASES
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
INDUSTRIES
Financial ServicesGamingHealthcareRetailAll industries
COMPARE
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
COMPANY
Mission & valuesLeadershipCareersNews
CONNECT
CommunityEvents & webinarsNews
PARTNERS
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
SUPPORT
Professional servicesSupport

High availability with Redis Sentinel
High availability for non-clustered Redis
Redis Open Source

Redis Sentinel provides high availability for Redis when not using Redis Cluster.
Redis Sentinel also provides other collateral tasks such as monitoring, notifications and acts as a configuration provider for clients.
This is the full list of Sentinel capabilities at a macroscopic level (i.e. the big picture):
Monitoring. Sentinel constantly checks if your master and replica instances are working as expected.
Notification. Sentinel can notify the system administrator, or other computer programs, via an API, that something is wrong with one of the monitored Redis instances.
Automatic failover. If a master is not working as expected, Sentinel can start a failover process where a replica is promoted to master, the other additional replicas are reconfigured to use the new master, and the applications using the Redis server are informed about the new address to use when connecting.
Configuration provider. Sentinel acts as a source of authority for clients service discovery: clients connect to Sentinels in order to ask for the address of the current Redis master responsible for a given service. If a failover occurs, Sentinels will report the new address.
Sentinel as a distributed system 
Redis Sentinel is a distributed system:
Sentinel itself is designed to run in a configuration where there are multiple Sentinel processes cooperating together. The advantage of having multiple Sentinel processes cooperating are the following:
Failure detection is performed when multiple Sentinels agree about the fact a given master is no longer available. This lowers the probability of false positives.
Sentinel works even if not all the Sentinel processes are working, making the system robust against failures. There is no fun in having a failover system which is itself a single point of failure, after all.
The sum of Sentinels, Redis instances (masters and replicas) and clients connecting to Sentinel and Redis, are also a larger distributed system with specific properties. In this document concepts will be introduced gradually starting from basic information needed in order to understand the basic properties of Sentinel, to more complex information (that are optional) in order to understand how exactly Sentinel works.
Sentinel quick start 
Obtaining Sentinel 
The current version of Sentinel is called Sentinel 2. It is a rewrite of the initial Sentinel implementation using stronger and simpler-to-predict algorithms (that are explained in this documentation).
A stable release of Redis Sentinel is shipped since Redis 2.8.
New developments are performed in the unstable branch, and new features sometimes are back ported into the latest stable branch as soon as they are considered to be stable.
Redis Sentinel version 1, shipped with Redis 2.6, is deprecated and should not be used.
Running Sentinel 
If you are using the redis-sentinel executable (or if you have a symbolic link with that name to the redis-server executable) you can run Sentinel with the following command line:
redis-sentinel /path/to/sentinel.conf

Otherwise you can use directly the redis-server executable starting it in Sentinel mode:
redis-server /path/to/sentinel.conf --sentinel

Both ways work the same.
However it is mandatory to use a configuration file when running Sentinel, as this file will be used by the system in order to save the current state that will be reloaded in case of restarts. Sentinel will simply refuse to start if no configuration file is given or if the configuration file path is not writable.
Sentinels by default run listening for connections to TCP port 26379, so for Sentinels to work, port 26379 of your servers must be open to receive connections from the IP addresses of the other Sentinel instances. Otherwise Sentinels can't talk and can't agree about what to do, so failover will never be performed.
Fundamental things to know about Sentinel before deploying 
You need at least three Sentinel instances for a robust deployment.
The three Sentinel instances should be placed into computers or virtual machines that are believed to fail in an independent way. So for example different physical servers or Virtual Machines executed on different availability zones.
Sentinel + Redis distributed system does not guarantee that acknowledged writes are retained during failures, since Redis uses asynchronous replication. However there are ways to deploy Sentinel that make the window to lose writes limited to certain moments, while there are other less secure ways to deploy it.
You need Sentinel support in your clients. Popular client libraries have Sentinel support, but not all.
There is no HA setup which is safe if you don't test from time to time in development environments, or even better if you can, in production environments, if they work. You may have a misconfiguration that will become apparent only when it's too late (at 3am when your master stops working).
Sentinel, Docker, or other forms of Network Address Translation or Port Mapping should be mixed with care: Docker performs port remapping, breaking Sentinel auto discovery of other Sentinel processes and the list of replicas for a master. Check the section about Sentinel and Docker later in this document for more information.
Configuring Sentinel 
The Redis source distribution contains a file called sentinel.conf that is a self-documented example configuration file you can use to configure Sentinel, however a typical minimal configuration file looks like the following:
sentinel monitor mymaster 127.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 60000
sentinel failover-timeout mymaster 180000
sentinel parallel-syncs mymaster 1

sentinel monitor resque 192.168.1.3 6380 4
sentinel down-after-milliseconds resque 10000
sentinel failover-timeout resque 180000
sentinel parallel-syncs resque 5

You only need to specify the masters to monitor, giving to each separated master (that may have any number of replicas) a different name. There is no need to specify replicas, which are auto-discovered. Sentinel will update the configuration automatically with additional information about replicas (in order to retain the information in case of restart). The configuration is also rewritten every time a replica is promoted to master during a failover and every time a new Sentinel is discovered.
The example configuration above basically monitors two sets of Redis instances, each composed of a master and an undefined number of replicas. One set of instances is called mymaster, and the other resque.
The meaning of the arguments of sentinel monitor statements is the following:
sentinel monitor <master-name> <ip> <port> <quorum>

For the sake of clarity, let's check line by line what the configuration options mean:
The first line is used to tell Redis to monitor a master called mymaster, that is at address 127.0.0.1 and port 6379, with a quorum of 2. Everything is pretty obvious but the quorum argument:
The quorum is the number of Sentinels that need to agree about the fact the master is not reachable, in order to really mark the master as failing, and eventually start a failover procedure if possible.
However the quorum is only used to detect the failure. In order to actually perform a failover, one of the Sentinels need to be elected leader for the failover and be authorized to proceed. This only happens with the vote of the majority of the Sentinel processes.
So for example if you have 5 Sentinel processes, and the quorum for a given master set to the value of 2, this is what happens:
If two Sentinels agree at the same time about the master being unreachable, one of the two will try to start a failover.
If there are at least a total of three Sentinels reachable, the failover will be authorized and will actually start.
In practical terms this means during failures Sentinel never starts a failover if the majority of Sentinel processes are unable to talk (aka no failover in the minority partition).
Other Sentinel options 
The other options are almost always in the form:
sentinel <option_name> <master_name> <option_value>

And are used for the following purposes:
down-after-milliseconds is the time in milliseconds an instance should not be reachable (either does not reply to our PINGs or it is replying with an error) for a Sentinel starting to think it is down.
parallel-syncs sets the number of replicas that can be reconfigured to use the new master after a failover at the same time. The lower the number, the more time it will take for the failover process to complete, however if the replicas are configured to serve old data, you may not want all the replicas to re-synchronize with the master at the same time. While the replication process is mostly non blocking for a replica, there is a moment when it stops to load the bulk data from the master. You may want to make sure only one replica at a time is not reachable by setting this option to the value of 1.
Additional options are described in the rest of this document and documented in the example sentinel.conf file shipped with the Redis distribution.
Configuration parameters can be modified at runtime:
Master-specific configuration parameters are modified using SENTINEL SET.
Global configuration parameters are modified using SENTINEL CONFIG SET.
See the Reconfiguring Sentinel at runtime section for more information.
Example Sentinel deployments 
Now that you know the basic information about Sentinel, you may wonder where you should place your Sentinel processes, how many Sentinel processes you need and so forth. This section shows a few example deployments.
We use ASCII art in order to show you configuration examples in a graphical format, this is what the different symbols means:
+--------------------+
| This is a computer |
| or VM that fails   |
| independently. We  |
| call it a "box"    |
+--------------------+

We write inside the boxes what they are running:
+-------------------+
| Redis master M1   |
| Redis Sentinel S1 |
+-------------------+

Different boxes are connected by lines, to show that they are able to talk:
+-------------+               +-------------+
| Sentinel S1 |---------------| Sentinel S2 |
+-------------+               +-------------+

Network partitions are shown as interrupted lines using slashes:
+-------------+                +-------------+
| Sentinel S1 |------ // ------| Sentinel S2 |
+-------------+                +-------------+

Also note that:
Masters are called M1, M2, M3, ..., Mn.
Replicas are called R1, R2, R3, ..., Rn (R stands for replica).
Sentinels are called S1, S2, S3, ..., Sn.
Clients are called C1, C2, C3, ..., Cn.
When an instance changes role because of Sentinel actions, we put it inside square brackets, so [M1] means an instance that is now a master because of Sentinel intervention.
Note that we will never show setups where just two Sentinels are used, since Sentinels always need to talk with the majority in order to start a failover.
Example 1: just two Sentinels, DON'T DO THIS 
+----+         +----+
| M1 |---------| R1 |
| S1 |         | S2 |
+----+         +----+

Configuration: quorum = 1

In this setup, if the master M1 fails, R1 will be promoted since the two Sentinels can reach agreement about the failure (obviously with quorum set to 1) and can also authorize a failover because the majority is two. So apparently it could superficially work, however check the next points to see why this setup is broken.
If the box where M1 is running stops working, also S1 stops working. The Sentinel running in the other box S2 will not be able to authorize a failover, so the system will become not available.
Note that a majority is needed in order to order different failovers, and later propagate the latest configuration to all the Sentinels. Also note that the ability to failover in a single side of the above setup, without any agreement, would be very dangerous:
+----+           +------+
| M1 |----//-----| [M1] |
| S1 |           | S2   |
+----+           +------+

In the above configuration we created two masters (assuming S2 could failover without authorization) in a perfectly symmetrical way. Clients may write indefinitely to both sides, and there is no way to understand when the partition heals what configuration is the right one, in order to prevent a permanent split brain condition.
So please deploy at least three Sentinels in three different boxes always.
Example 2: basic setup with three boxes 
This is a very simple setup, that has the advantage to be simple to tune for additional safety. It is based on three boxes, each box running both a Redis process and a Sentinel process.
      +----+
       | M1 |
       | S1 |
       +----+
          |
+----+    |    +----+
| R2 |----+----| R3 |
| S2 |         | S3 |
+----+         +----+

Configuration: quorum = 2

If the master M1 fails, S2 and S3 will agree about the failure and will be able to authorize a failover, making clients able to continue.
In every Sentinel setup, as Redis uses asynchronous replication, there is always the risk of losing some writes because a given acknowledged write may not be able to reach the replica which is promoted to master. However in the above setup there is a higher risk due to clients being partitioned away with an old master, like in the following picture:
        +----+
         | M1 |
         | S1 | <- C1 (writes will be lost)
         +----+
            |
            /
            /
+------+    |    +----+
| [M2] |----+----| R3 |
| S2   |         | S3 |
+------+         +----+

In this case a network partition isolated the old master M1, so the replica R2 is promoted to master. However clients, like C1, that are in the same partition as the old master, may continue to write data to the old master. This data will be lost forever since when the partition will heal, the master will be reconfigured as a replica of the new master, discarding its data set.
This problem can be mitigated using the following Redis replication feature, that allows to stop accepting writes if a master detects that it is no longer able to transfer its writes to the specified number of replicas.
min-replicas-to-write 1
min-replicas-max-lag 10

With the above configuration (please see the self-commented redis.conf example in the Redis distribution for more information) a Redis instance, when acting as a master, will stop accepting writes if it can't write to at least 1 replica. Since replication is asynchronous not being able to write actually means that the replica is either disconnected, or is not sending us asynchronous acknowledges for more than the specified max-lag number of seconds.
Using this configuration, the old Redis master M1 in the above example, will become unavailable after 10 seconds. When the partition heals, the Sentinel configuration will converge to the new one, the client C1 will be able to fetch a valid configuration and will continue with the new master.
However there is no free lunch. With this refinement, if the two replicas are down, the master will stop accepting writes. It's a trade off.
Example 3: Sentinel in the client boxes 
Sometimes we have only two Redis boxes available, one for the master and one for the replica. The configuration in the example 2 is not viable in that case, so we can resort to the following, where Sentinels are placed where clients are:
           +----+         +----+
            | M1 |----+----| R1 |
            |    |    |    |    |
            +----+    |    +----+
                      |
         +------------+------------+
         |            |            |
         |            |            |
      +----+        +----+      +----+
      | C1 |        | C2 |      | C3 |
      | S1 |        | S2 |      | S3 |
      +----+        +----+      +----+

      Configuration: quorum = 2

In this setup, the point of view Sentinels is the same as the clients: if a master is reachable by the majority of the clients, it is fine. C1, C2, C3 here are generic clients, it does not mean that C1 identifies a single client connected to Redis. It is more likely something like an application server, a Rails app, or something like that.
If the box where M1 and S1 are running fails, the failover will happen without issues, however it is easy to see that different network partitions will result in different behaviors. For example Sentinel will not be able to setup if the network between the clients and the Redis servers is disconnected, since the Redis master and replica will both be unavailable.
Note that if C3 gets partitioned with M1 (hardly possible with the network described above, but more likely possible with different layouts, or because of failures at the software layer), we have a similar issue as described in Example 2, with the difference that here we have no way to break the symmetry, since there is just a replica and master, so the master can't stop accepting queries when it is disconnected from its replica, otherwise the master would never be available during replica failures.
So this is a valid setup but the setup in the Example 2 has advantages such as the HA system of Redis running in the same boxes as Redis itself which may be simpler to manage, and the ability to put a bound on the amount of time a master in the minority partition can receive writes.
Example 4: Sentinel client side with less than three clients 
The setup described in the Example 3 cannot be used if there are less than three boxes in the client side (for example three web servers). In this case we need to resort to a mixed setup like the following:
           +----+         +----+
            | M1 |----+----| R1 |
            | S1 |    |    | S2 |
            +----+    |    +----+
                      |
               +------+-----+
               |            |
               |            |
            +----+        +----+
            | C1 |        | C2 |
            | S3 |        | S4 |
            +----+        +----+

      Configuration: quorum = 3

This is similar to the setup in Example 3, but here we run four Sentinels in the four boxes we have available. If the master M1 becomes unavailable the other three Sentinels will perform the failover.
In theory this setup works removing the box where C2 and S4 are running, and setting the quorum to 2. However it is unlikely that we want HA in the Redis side without having high availability in our application layer.
Sentinel, Docker, NAT, and possible issues 
Docker uses a technique called port mapping: programs running inside Docker containers may be exposed with a different port compared to the one the program believes to be using. This is useful in order to run multiple containers using the same ports, at the same time, in the same server.
Docker is not the only software system where this happens, there are other Network Address Translation setups where ports may be remapped, and sometimes not ports but also IP addresses.
Remapping ports and addresses creates issues with Sentinel in two ways:
Sentinel auto-discovery of other Sentinels no longer works, since it is based on hello messages where each Sentinel announce at which port and IP address they are listening for connection. However Sentinels have no way to understand that an address or port is remapped, so it is announcing an information that is not correct for other Sentinels to connect.
Replicas are listed in the INFO output of a Redis master in a similar way: the address is detected by the master checking the remote peer of the TCP connection, while the port is advertised by the replica itself during the handshake, however the port may be wrong for the same reason as exposed in point 1.
Since Sentinels auto detect replicas using masters INFO output information, the detected replicas will not be reachable, and Sentinel will never be able to failover the master, since there are no good replicas from the point of view of the system, so there is currently no way to monitor with Sentinel a set of master and replica instances deployed with Docker, unless you instruct Docker to map the port 1:1.
For the first problem, in case you want to run a set of Sentinel instances using Docker with forwarded ports (or any other NAT setup where ports are remapped), you can use the following two Sentinel configuration directives in order to force Sentinel to announce a specific set of IP and port:
sentinel announce-ip <ip>
sentinel announce-port <port>

Note that Docker has the ability to run in host networking mode (check the --net=host option for more information). This should create no issues since ports are not remapped in this setup.
IP Addresses and DNS names 
Older versions of Sentinel did not support host names and required IP addresses to be specified everywhere. Starting with version 6.2, Sentinel has optional support for host names.
This capability is disabled by default. If you're going to enable DNS/hostnames support, please note:
The name resolution configuration on your Redis and Sentinel nodes must be reliable and be able to resolve addresses quickly. Unexpected delays in address resolution may have a negative impact on Sentinel.
You should use hostnames everywhere and avoid mixing hostnames and IP addresses. To do that, use replica-announce-ip <hostname> and sentinel announce-ip <hostname> for all Redis and Sentinel instances, respectively.
Enabling the resolve-hostnames global configuration allows Sentinel to accept host names:
As part of a sentinel monitor command
As a replica address, if the replica uses a host name value for replica-announce-ip
Sentinel will accept host names as valid inputs and resolve them, but will still refer to IP addresses when announcing an instance, updating configuration files, etc.
Enabling the announce-hostnames global configuration makes Sentinel use host names instead. This affects replies to clients, values written in configuration files, the REPLICAOF command issued to replicas, etc.
This behavior may not be compatible with all Sentinel clients, that may explicitly expect an IP address.
Using host names may be useful when clients use TLS to connect to instances and require a name rather than an IP address in order to perform certificate ASN matching.
A quick tutorial 
In the next sections of this document, all the details about Sentinel API, configuration and semantics will be covered incrementally. However for people that want to play with the system ASAP, this section is a tutorial that shows how to configure and interact with 3 Sentinel instances.
Here we assume that the instances are executed at port 5000, 5001, 5002. We also assume that you have a running Redis master at port 6379 with a replica running at port 6380. We will use the IPv4 loopback address 127.0.0.1 everywhere during the tutorial, assuming you are running the simulation on your personal computer.
The three Sentinel configuration files should look like the following:
port 5000
sentinel monitor mymaster 127.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 60000
sentinel parallel-syncs mymaster 1

The other two configuration files will be identical but using 5001 and 5002 as port numbers.
A few things to note about the above configuration:
The master set is called mymaster. It identifies the master and its replicas. Since each master set has a different name, Sentinel can monitor different sets of masters and replicas at the same time.
The quorum was set to the value of 2 (last argument of sentinel monitor configuration directive).
The down-after-milliseconds value is 5000 milliseconds, that is 5 seconds, so masters will be detected as failing as soon as we don't receive any reply from our pings within this amount of time.
Once you start the three Sentinels, you'll see a few messages they log, like:
+monitor master mymaster 127.0.0.1 6379 quorum 2

This is a Sentinel event, and you can receive this kind of events via Pub/Sub if you SUBSCRIBE to the event name as specified later in Pub/Sub Messages section.
Sentinel generates and logs different events during failure detection and failover.
Asking Sentinel about the state of a master 
The most obvious thing to do with Sentinel to get started, is check if the master it is monitoring is doing well:
$ redis-cli -p 5000
127.0.0.1:5000> sentinel master mymaster
 1) "name"
 2) "mymaster"
 3) "ip"
 4) "127.0.0.1"
 5) "port"
 6) "6379"
 7) "runid"
 8) "953ae6a589449c13ddefaee3538d356d287f509b"
 9) "flags"
10) "master"
11) "link-pending-commands"
12) "0"
13) "link-refcount"
14) "1"
15) "last-ping-sent"
16) "0"
17) "last-ok-ping-reply"
18) "735"
19) "last-ping-reply"
20) "735"
21) "down-after-milliseconds"
22) "5000"
23) "info-refresh"
24) "126"
25) "role-reported"
26) "master"
27) "role-reported-time"
28) "532439"
29) "config-epoch"
30) "1"
31) "num-slaves"
32) "1"
33) "num-other-sentinels"
34) "2"
35) "quorum"
36) "2"
37) "failover-timeout"
38) "60000"
39) "parallel-syncs"
40) "1"

As you can see, it prints a number of information about the master. There are a few that are of particular interest for us:
num-other-sentinels is 2, so we know the Sentinel already detected two more Sentinels for this master. If you check the logs you'll see the +sentinel events generated.
flags is just master. If the master was down we could expect to see s_down or o_down flag as well here.
num-slaves is correctly set to 1, so Sentinel also detected that there is an attached replica to our master.
In order to explore more about this instance, you may want to try the following two commands:
SENTINEL replicas mymaster
SENTINEL sentinels mymaster

The first will provide similar information about the replicas connected to the master, and the second about the other Sentinels.
Obtaining the address of the current master 
As we already specified, Sentinel also acts as a configuration provider for clients that want to connect to a set of master and replicas. Because of possible failovers or reconfigurations, clients have no idea about who is the currently active master for a given set of instances, so Sentinel exports an API to ask this question:
127.0.0.1:5000> SENTINEL get-master-addr-by-name mymaster
1) "127.0.0.1"
2) "6379"

Testing the failover 
At this point our toy Sentinel deployment is ready to be tested. We can just kill our master and check if the configuration changes. To do so we can just do:
redis-cli -p 6379 DEBUG sleep 30

This command will make our master no longer reachable, sleeping for 30 seconds. It basically simulates a master hanging for some reason.
If you check the Sentinel logs, you should be able to see a lot of action:
Each Sentinel detects the master is down with an +sdown event.
This event is later escalated to +odown, which means that multiple Sentinels agree about the fact the master is not reachable.
Sentinels vote a Sentinel that will start the first failover attempt.
The failover happens.
If you ask again what is the current master address for mymaster, eventually we should get a different reply this time:
127.0.0.1:5000> SENTINEL get-master-addr-by-name mymaster
1) "127.0.0.1"
2) "6380"

So far so good... At this point you may jump to create your Sentinel deployment or can read more to understand all the Sentinel commands and internals.
Sentinel API 
Sentinel provides an API in order to inspect its state, check the health of monitored masters and replicas, subscribe in order to receive specific notifications, and change the Sentinel configuration at run time.
By default Sentinel runs using TCP port 26379 (note that 6379 is the normal Redis port). Sentinels accept commands using the Redis protocol, so you can use redis-cli or any other unmodified Redis client in order to talk with Sentinel.
It is possible to directly query a Sentinel to check what is the state of the monitored Redis instances from its point of view, to see what other Sentinels it knows, and so forth. Alternatively, using Pub/Sub, it is possible to receive push style notifications from Sentinels, every time some event happens, like a failover, or an instance entering an error condition, and so forth.
Sentinel commands 
The SENTINEL command is the main API for Sentinel. The following is the list of its subcommands (minimal version is noted for where applicable):
SENTINEL CONFIG GET <name> (>= 6.2) Get the current value of a global Sentinel configuration parameter. The specified name may be a wildcard, similar to the Redis CONFIG GET command.
SENTINEL CONFIG SET <name> <value> (>= 6.2) Set the value of a global Sentinel configuration parameter.
SENTINEL CKQUORUM <master name> Check if the current Sentinel configuration is able to reach the quorum needed to failover a master, and the majority needed to authorize the failover. This command should be used in monitoring systems to check if a Sentinel deployment is ok.
SENTINEL FLUSHCONFIG Force Sentinel to rewrite its configuration on disk, including the current Sentinel state. Normally Sentinel rewrites the configuration every time something changes in its state (in the context of the subset of the state which is persisted on disk across restart). However sometimes it is possible that the configuration file is lost because of operation errors, disk failures, package upgrade scripts or configuration managers. In those cases a way to force Sentinel to rewrite the configuration file is handy. This command works even if the previous configuration file is completely missing.
SENTINEL FAILOVER <master name> Force a failover as if the master was not reachable, and without asking for agreement to other Sentinels (however a new version of the configuration will be published so that the other Sentinels will update their configurations).
SENTINEL GET-MASTER-ADDR-BY-NAME <master name> Return the ip and port number of the master with that name. If a failover is in progress or terminated successfully for this master it returns the address and port of the promoted replica.
SENTINEL INFO-CACHE (>= 3.2) Return cached INFO output from masters and replicas.
SENTINEL IS-MASTER-DOWN-BY-ADDR Check if the master specified by ip:port is down from current Sentinel's point of view. This command is mostly for internal use.
SENTINEL MASTER <master name> Show the state and info of the specified master.
SENTINEL MASTERS Show a list of monitored masters and their state.
SENTINEL MONITOR Start Sentinel's monitoring. Refer to the Reconfiguring Sentinel at Runtime section for more information.
SENTINEL MYID (>= 6.2) Return the ID of the Sentinel instance.
SENTINEL PENDING-SCRIPTS This command returns information about pending scripts.
SENTINEL REMOVE Stop Sentinel's monitoring. Refer to the Reconfiguring Sentinel at Runtime section for more information.
SENTINEL REPLICAS <master name> (>= 5.0) Show a list of replicas for this master, and their state.
SENTINEL SENTINELS <master name> Show a list of sentinel instances for this master, and their state.
SENTINEL SET Set Sentinel's monitoring configuration. Refer to the Reconfiguring Sentinel at Runtime section for more information.
SENTINEL SIMULATE-FAILURE (crash-after-election|crash-after-promotion|help) (>= 3.2) This command simulates different Sentinel crash scenarios.
SENTINEL RESET <pattern> This command will reset all the masters with matching name. The pattern argument is a glob-style pattern. The reset process clears any previous state in a master (including a failover in progress), and removes every replica and sentinel already discovered and associated with the master.
For connection management and administration purposes, Sentinel supports the following subset of Redis' commands:
ACL (>= 6.2) This command manages the Sentinel Access Control List. For more information refer to the ACL documentation page and the Sentinel Access Control List authentication.
AUTH (>= 5.0.1) Authenticate a client connection. For more information refer to the AUTH command and the Configuring Sentinel instances with authentication section.
CLIENT This command manages client connections. For more information refer to its subcommands' pages.
COMMAND (>= 6.2) This command returns information about commands. For more information refer to the COMMAND command and its various subcommands.
HELLO (>= 6.0) Switch the connection's protocol. For more information refer to the HELLO command.
INFO Return information and statistics about the Sentinel server. For more information see the INFO command.
PING This command simply returns PONG.
ROLE This command returns the string "sentinel" and a list of monitored masters. For more information refer to the ROLE command.
SHUTDOWN Shut down the Sentinel instance.
Lastly, Sentinel also supports the SUBSCRIBE, UNSUBSCRIBE, PSUBSCRIBE and PUNSUBSCRIBE commands. Refer to the Pub/Sub Messages section for more details.
Reconfiguring Sentinel at Runtime 
Starting with Redis version 2.8.4, Sentinel provides an API in order to add, remove, or change the configuration of a given master. Note that if you have multiple sentinels you should apply the changes to all to your instances for Redis Sentinel to work properly. This means that changing the configuration of a single Sentinel does not automatically propagate the changes to the other Sentinels in the network.
The following is a list of SENTINEL subcommands used in order to update the configuration of a Sentinel instance.
SENTINEL MONITOR <name> <ip> <port> <quorum> This command tells the Sentinel to start monitoring a new master with the specified name, ip, port, and quorum. It is identical to the sentinel monitor configuration directive in sentinel.conf configuration file, with the difference that you can't use a hostname in as ip, but you need to provide an IPv4 or IPv6 address.
SENTINEL REMOVE <name> is used in order to remove the specified master: the master will no longer be monitored, and will totally be removed from the internal state of the Sentinel, so it will no longer listed by SENTINEL masters and so forth.
SENTINEL SET <name> [<option> <value> ...] The SET command is very similar to the CONFIG SET command of Redis, and is used in order to change configuration parameters of a specific master. Multiple option / value pairs can be specified (or none at all). All the configuration parameters that can be configured via sentinel.conf are also configurable using the SET command.
The following is an example of SENTINEL SET command in order to modify the down-after-milliseconds configuration of a master called objects-cache:
SENTINEL SET objects-cache-master down-after-milliseconds 1000

As already stated, SENTINEL SET can be used to set all the configuration parameters that are settable in the startup configuration file. Moreover it is possible to change just the master quorum configuration without removing and re-adding the master with SENTINEL REMOVE followed by SENTINEL MONITOR, but simply using:
SENTINEL SET objects-cache-master quorum 5

Note that there is no equivalent GET command since SENTINEL MASTER provides all the configuration parameters in a simple to parse format (as a field/value pairs array).
Starting with Redis version 6.2, Sentinel also allows getting and setting global configuration parameters which were only supported in the configuration file prior to that.
SENTINEL CONFIG GET <name> Get the current value of a global Sentinel configuration parameter. The specified name may be a wildcard, similar to the Redis CONFIG GET command.
SENTINEL CONFIG SET <name> <value> Set the value of a global Sentinel configuration parameter.
Global parameters that can be manipulated include:
resolve-hostnames, announce-hostnames. See IP addresses and DNS names.
announce-ip, announce-port. See Sentinel, Docker, NAT, and possible issues.
sentinel-user, sentinel-pass. See Configuring Sentinel instances with authentication.
Adding or removing Sentinels 
Adding a new Sentinel to your deployment is a simple process because of the auto-discover mechanism implemented by Sentinel. All you need to do is to start the new Sentinel configured to monitor the currently active master. Within 10 seconds the Sentinel will acquire the list of other Sentinels and the set of replicas attached to the master.
If you need to add multiple Sentinels at once, it is suggested to add it one after the other, waiting for all the other Sentinels to already know about the first one before adding the next. This is useful in order to still guarantee that majority can be achieved only in one side of a partition, in the chance failures should happen in the process of adding new Sentinels.
This can be easily achieved by adding every new Sentinel with a 30 seconds delay, and during absence of network partitions.
At the end of the process it is possible to use the command SENTINEL MASTER mastername in order to check if all the Sentinels agree about the total number of Sentinels monitoring the master.
Removing a Sentinel is a bit more complex: Sentinels never forget already seen Sentinels, even if they are not reachable for a long time, since we don't want to dynamically change the majority needed to authorize a failover and the creation of a new configuration number. So in order to remove a Sentinel the following steps should be performed in absence of network partitions:
Stop the Sentinel process of the Sentinel you want to remove.
Send a SENTINEL RESET * command to all the other Sentinel instances (instead of * you can use the exact master name if you want to reset just a single master). One after the other, waiting at least 30 seconds between instances.
Check that all the Sentinels agree about the number of Sentinels currently active, by inspecting the output of SENTINEL MASTER mastername of every Sentinel.
Removing the old master or unreachable replicas 
Sentinels never forget about replicas of a given master, even when they are unreachable for a long time. This is useful, because Sentinels should be able to correctly reconfigure a returning replica after a network partition or a failure event.
Moreover, after a failover, the failed over master is virtually added as a replica of the new master, this way it will be reconfigured to replicate with the new master as soon as it will be available again.
However sometimes you want to remove a replica (that may be the old master) forever from the list of replicas monitored by Sentinels.
In order to do this, you need to send a SENTINEL RESET mastername command to all the Sentinels: they'll refresh the list of replicas within the next 10 seconds, only adding the ones listed as correctly replicating from the current master INFO output.
Pub/Sub messages 
A client can use a Sentinel as a Redis-compatible Pub/Sub server (but you can't use PUBLISH) in order to SUBSCRIBE or PSUBSCRIBE to channels and get notified about specific events.
The channel name is the same as the name of the event. For instance the channel named +sdown will receive all the notifications related to instances entering an SDOWN (SDOWN means the instance is no longer reachable from the point of view of the Sentinel you are querying) condition.
To get all the messages simply subscribe using PSUBSCRIBE *.
The following is a list of channels and message formats you can receive using this API. The first word is the channel / event name, the rest is the format of the data.
Note: where instance details is specified it means that the following arguments are provided to identify the target instance:
<instance-type> <name> <ip> <port> @ <master-name> <master-ip> <master-port>

The part identifying the master (from the @ argument to the end) is optional and is only specified if the instance is not a master itself.
+reset-master <instance details> -- The master was reset.
+slave <instance details> -- A new replica was detected and attached.
+failover-state-reconf-slaves <instance details> -- Failover state changed to reconf-slaves state.
+failover-detected <instance details> -- A failover started by another Sentinel or any other external entity was detected (An attached replica turned into a master).
+slave-reconf-sent <instance details> -- The leader sentinel sent the REPLICAOF command to this instance in order to reconfigure it for the new replica.
+slave-reconf-inprog <instance details> -- The replica being reconfigured showed to be a replica of the new master ip:port pair, but the synchronization process is not yet complete.
+slave-reconf-done <instance details> -- The replica is now synchronized with the new master.
-dup-sentinel <instance details> -- One or more sentinels for the specified master were removed as duplicated (this happens for instance when a Sentinel instance is restarted).
+sentinel <instance details> -- A new sentinel for this master was detected and attached.
+sdown <instance details> -- The specified instance is now in Subjectively Down state.
-sdown <instance details> -- The specified instance is no longer in Subjectively Down state.
+odown <instance details> -- The specified instance is now in Objectively Down state.
-odown <instance details> -- The specified instance is no longer in Objectively Down state.
+new-epoch <instance details> -- The current epoch was updated.
+try-failover <instance details> -- New failover in progress, waiting to be elected by the majority.
+elected-leader <instance details> -- Won the election for the specified epoch, can do the failover.
+failover-state-select-slave <instance details> -- New failover state is select-slave: we are trying to find a suitable replica for promotion.
no-good-slave <instance details> -- There is no good replica to promote. Currently we'll try after some time, but probably this will change and the state machine will abort the failover at all in this case.
selected-slave <instance details> -- We found the specified good replica to promote.
failover-state-send-slaveof-noone <instance details> -- We are trying to reconfigure the promoted replica as master, waiting for it to switch.
failover-end-for-timeout <instance details> -- The failover terminated for timeout, replicas will eventually be configured to replicate with the new master anyway.
failover-end <instance details> -- The failover terminated with success. All the replicas appears to be reconfigured to replicate with the new master.
switch-master <master name> <oldip> <oldport> <newip> <newport> -- The master new IP and address is the specified one after a configuration change. This is the message most external users are interested in.
+tilt -- Tilt mode entered.
-tilt -- Tilt mode exited.
Handling of -BUSY state 
The -BUSY error is returned by a Redis instance when a Lua script is running for more time than the configured Lua script time limit. When this happens before triggering a fail over Redis Sentinel will try to send a SCRIPT KILL command, that will only succeed if the script was read-only.
If the instance is still in an error condition after this try, it will eventually be failed over.
Replicas priority 
Redis instances have a configuration parameter called replica-priority. This information is exposed by Redis replica instances in their INFO output, and Sentinel uses it in order to pick a replica among the ones that can be used in order to failover a master:
If the replica priority is set to 0, the replica is never promoted to master.
Replicas with a lower priority number are preferred by Sentinel.
For example if there is a replica S1 in the same data center of the current master, and another replica S2 in another data center, it is possible to set S1 with a priority of 10 and S2 with a priority of 100, so that if the master fails and both S1 and S2 are available, S1 will be preferred.
For more information about the way replicas are selected, please check the Replica selection and priority section of this documentation.
Sentinel and Redis authentication 
When the master is configured to require authentication from clients, as a security measure, replicas need to also be aware of the credentials in order to authenticate with the master and create the master-replica connection used for the asynchronous replication protocol.
Redis Access Control List authentication 
Starting with Redis 6, user authentication and permission is managed with the Access Control List (ACL).
In order for Sentinels to connect to Redis server instances when they are configured with ACL, the Sentinel configuration must include the following directives:
sentinel auth-user <master-name> <username>
sentinel auth-pass <master-name> <password>

Where <username> and <password> are the username and password for accessing the group's instances. These credentials should be provisioned on all of the group's Redis instances with the minimal control permissions. For example:
127.0.0.1:6379> ACL SETUSER sentinel-user ON >somepassword allchannels +multi +slaveof +ping +exec +subscribe +config|rewrite +role +publish +info +client|setname +client|kill +script|kill

Redis password-only authentication 
Until Redis 6, authentication is achieved using the following configuration directives:
requirepass in the master, in order to set the authentication password, and to make sure the instance will not process requests for non authenticated clients.
masterauth in the replicas in order for the replicas to authenticate with the master in order to correctly replicate data from it.
When Sentinel is used, there is not a single master, since after a failover replicas may play the role of masters, and old masters can be reconfigured in order to act as replicas, so what you want to do is to set the above directives in all your instances, both masters and replicas.
This is also usually a sane setup since you don't want to protect data only in the master, having the same data accessible in the replicas.
However, in the uncommon case where you need a replica that is accessible without authentication, you can still do it by setting up a replica priority of zero, to prevent this replica from being promoted to master, and configuring in this replica only the masterauth directive, without using the requirepass directive, so that data will be readable by unauthenticated clients.
In order for Sentinels to connect to Redis server instances when they are configured with requirepass, the Sentinel configuration must include the sentinel auth-pass directive, in the format:
sentinel auth-pass <master-name> <password>

Configuring Sentinel instances with authentication 
Sentinel instances themselves can be secured by requiring clients to authenticate via the AUTH command. Starting with Redis 6.2, the Access Control List (ACL) is available, whereas previous versions (starting with Redis 5.0.1) support password-only authentication.
Note that Sentinel's authentication configuration should be applied to each of the instances in your deployment, and all instances should use the same configuration. Furthermore, ACL and password-only authentication should not be used together.
Sentinel Access Control List authentication 
The first step in securing a Sentinel instance with ACL is preventing any unauthorized access to it. To do that, you'll need to disable the default superuser (or at the very least set it up with a strong password) and create a new one and allow it access to Pub/Sub channels:
127.0.0.1:5000> ACL SETUSER admin ON >admin-password allchannels +@all
OK
127.0.0.1:5000> ACL SETUSER default off
OK

The default user is used by Sentinel to connect to other instances. You can provide the credentials of another superuser with the following configuration directives:
sentinel sentinel-user <username>
sentinel sentinel-pass <password>

Where <username> and <password> are the Sentinel's superuser and password, respectively (e.g. admin and admin-password in the example above).
Lastly, for authenticating incoming client connections, you can create a Sentinel restricted user profile such as the following:
127.0.0.1:5000> ACL SETUSER sentinel-user ON >user-password -@all +auth +client|getname +client|id +client|setname +command +hello +ping +role +sentinel|get-master-addr-by-name +sentinel|master +sentinel|myid +sentinel|replicas +sentinel|sentinels +sentinel|masters

Refer to the documentation of your Sentinel client of choice for further information.
Sentinel password-only authentication 
To use Sentinel with password-only authentication, add the requirepass configuration directive to all your Sentinel instances as follows:
requirepass "your_password_here"

When configured this way, Sentinels will do two things:
A password will be required from clients in order to send commands to Sentinels. This is obvious since this is how such configuration directive works in Redis in general.
Moreover the same password configured to access the local Sentinel, will be used by this Sentinel instance in order to authenticate to all the other Sentinel instances it connects to.
This means that you will have to configure the same requirepass password in all the Sentinel instances. This way every Sentinel can talk with every other Sentinel without any need to configure for each Sentinel the password to access all the other Sentinels, that would be very impractical.
Before using this configuration, make sure your client library can send the AUTH command to Sentinel instances.
Sentinel clients implementation 

Sentinel requires explicit client support, unless the system is configured to execute a script that performs a transparent redirection of all the requests to the new master instance (virtual IP or other similar systems). The topic of client libraries implementation is covered in the document Sentinel clients guidelines.
More advanced concepts 
In the following sections we'll cover a few details about how Sentinel works, without resorting to implementation details and algorithms that will be covered in the final part of this document.
SDOWN and ODOWN failure state 
Redis Sentinel has two different concepts of being down, one is called a Subjectively Down condition (SDOWN) and is a down condition that is local to a given Sentinel instance. Another is called Objectively Down condition (ODOWN) and is reached when enough Sentinels (at least the number configured as the quorum parameter of the monitored master) have an SDOWN condition, and get feedback from other Sentinels using the SENTINEL is-master-down-by-addr command.
From the point of view of a Sentinel an SDOWN condition is reached when it does not receive a valid reply to PING requests for the number of seconds specified in the configuration as is-master-down-after-milliseconds parameter.
An acceptable reply to PING is one of the following:
PING replied with +PONG.
PING replied with -LOADING error.
PING replied with -MASTERDOWN error.
Any other reply (or no reply at all) is considered non valid. However note that a logical master that advertises itself as a replica in the INFO output is considered to be down.
Note that SDOWN requires that no acceptable reply is received for the whole interval configured, so for instance if the interval is 30000 milliseconds (30 seconds) and we receive an acceptable ping reply every 29 seconds, the instance is considered to be working.
SDOWN is not enough to trigger a failover: it only means a single Sentinel believes a Redis instance is not available. To trigger a failover, the ODOWN state must be reached.
To switch from SDOWN to ODOWN no strong consensus algorithm is used, but just a form of gossip: if a given Sentinel gets reports that a master is not working from enough Sentinels in a given time range, the SDOWN is promoted to ODOWN. If this acknowledge is later missing, the flag is cleared.
A more strict authorization that uses an actual majority is required in order to really start the failover, but no failover can be triggered without reaching the ODOWN state.
The ODOWN condition only applies to masters. For other kind of instances Sentinel doesn't require to act, so the ODOWN state is never reached for replicas and other sentinels, but only SDOWN is.
However SDOWN has also semantic implications. For example a replica in SDOWN state is not selected to be promoted by a Sentinel performing a failover.
Sentinels and replicas auto discovery 
Sentinels stay connected with other Sentinels in order to reciprocally check the availability of each other, and to exchange messages. However you don't need to configure a list of other Sentinel addresses in every Sentinel instance you run, as Sentinel uses the Redis instances Pub/Sub capabilities in order to discover the other Sentinels that are monitoring the same masters and replicas.
This feature is implemented by sending hello messages into the channel named __sentinel__:hello.
Similarly you don't need to configure what is the list of the replicas attached to a master, as Sentinel will auto discover this list querying Redis.
Every Sentinel publishes a message to every monitored master and replica Pub/Sub channel __sentinel__:hello, every two seconds, announcing its presence with ip, port, runid.
Every Sentinel is subscribed to the Pub/Sub channel __sentinel__:hello of every master and replica, looking for unknown sentinels. When new sentinels are detected, they are added as sentinels of this master.
Hello messages also include the full current configuration of the master. If the receiving Sentinel has a configuration for a given master which is older than the one received, it updates to the new configuration immediately.
Before adding a new sentinel to a master a Sentinel always checks if there is already a sentinel with the same runid or the same address (ip and port pair). In that case all the matching sentinels are removed, and the new added.
Sentinel reconfiguration of instances outside the failover procedure 
Even when no failover is in progress, Sentinels will always try to set the current configuration on monitored instances. Specifically:
Replicas (according to the current configuration) that claim to be masters, will be configured as replicas to replicate with the current master.
Replicas connected to a wrong master, will be reconfigured to replicate with the right master.
For Sentinels to reconfigure replicas, the wrong configuration must be observed for some time, that is greater than the period used to broadcast new configurations.
This prevents Sentinels with a stale configuration (for example because they just rejoined from a partition) will try to change the replicas configuration before receiving an update.
Also note how the semantics of always trying to impose the current configuration makes the failover more resistant to partitions:
Masters failed over are reconfigured as replicas when they return available.
Replicas partitioned away during a partition are reconfigured once reachable.
The important lesson to remember about this section is: Sentinel is a system where each process will always try to impose the last logical configuration to the set of monitored instances.
Replica selection and priority 
When a Sentinel instance is ready to perform a failover, since the master is in ODOWN state and the Sentinel received the authorization to failover from the majority of the Sentinel instances known, a suitable replica needs to be selected.
The replica selection process evaluates the following information about replicas:
Disconnection time from the master.
Replica priority.
Replication offset processed.
Run ID.
A replica that is found to be disconnected from the master for more than ten times the configured master timeout (down-after-milliseconds option), plus the time the master is also not available from the point of view of the Sentinel doing the failover, is considered to be not suitable for the failover and is skipped.
In more rigorous terms, a replica whose the INFO output suggests it has been disconnected from the master for more than:
(down-after-milliseconds * 10) + milliseconds_since_master_is_in_SDOWN_state

Is considered to be unreliable and is disregarded entirely.
The replica selection only considers the replicas that passed the above test, and sorts it based on the above criteria, in the following order.
The replicas are sorted by replica-priority as configured in the redis.conf file of the Redis instance. A lower priority will be preferred.
If the priority is the same, the replication offset processed by the replica is checked, and the replica that received more data from the master is selected.
If multiple replicas have the same priority and processed the same data from the master, a further check is performed, selecting the replica with the lexicographically smaller run ID. Having a lower run ID is not a real advantage for a replica, but is useful in order to make the process of replica selection more deterministic, instead of resorting to select a random replica.
In most cases, replica-priority does not need to be set explicitly so all instances will use the same default value. If there is a particular fail-over preference, replica-priority must be set on all instances, including masters, as a master may become a replica at some future point in time - and it will then need the proper replica-priority settings.
A Redis instance can be configured with a special replica-priority of zero in order to be never selected by Sentinels as the new master. However a replica configured in this way will still be reconfigured by Sentinels in order to replicate with the new master after a failover, the only difference is that it will never become a master itself.
Algorithms and internals 
In the following sections we will explore the details of Sentinel behavior. It is not strictly needed for users to be aware of all the details, but a deep understanding of Sentinel may help to deploy and operate Sentinel in a more effective way.
Quorum 
The previous sections showed that every master monitored by Sentinel is associated to a configured quorum. It specifies the number of Sentinel processes that need to agree about the unreachability or error condition of the master in order to trigger a failover.
However, after the failover is triggered, in order for the failover to actually be performed, at least a majority of Sentinels must authorize the Sentinel to failover. Sentinel never performs a failover in the partition where a minority of Sentinels exist.
Let's try to make things a bit more clear:
Quorum: the number of Sentinel processes that need to detect an error condition in order for a master to be flagged as ODOWN.
The failover is triggered by the ODOWN state.
Once the failover is triggered, the Sentinel trying to failover is required to ask for authorization to a majority of Sentinels (or more than the majority if the quorum is set to a number greater than the majority).
The difference may seem subtle but is actually quite simple to understand and use. For example if you have 5 Sentinel instances, and the quorum is set to 2, a failover will be triggered as soon as 2 Sentinels believe that the master is not reachable, however one of the two Sentinels will be able to failover only if it gets authorization at least from 3 Sentinels.
If instead the quorum is configured to 5, all the Sentinels must agree about the master error condition, and the authorization from all Sentinels is required in order to failover.
This means that the quorum can be used to tune Sentinel in two ways:
If a quorum is set to a value smaller than the majority of Sentinels we deploy, we are basically making Sentinel more sensitive to master failures, triggering a failover as soon as even just a minority of Sentinels is no longer able to talk with the master.
If a quorum is set to a value greater than the majority of Sentinels, we are making Sentinel able to failover only when there are a very large number (larger than majority) of well connected Sentinels which agree about the master being down.
Configuration epochs 
Sentinels require to get authorizations from a majority in order to start a failover for a few important reasons:
When a Sentinel is authorized, it gets a unique configuration epoch for the master it is failing over. This is a number that will be used to version the new configuration after the failover is completed. Because a majority agreed that a given version was assigned to a given Sentinel, no other Sentinel will be able to use it. This means that every configuration of every failover is versioned with a unique version. We'll see why this is so important.
Moreover Sentinels have a rule: if a Sentinel voted another Sentinel for the failover of a given master, it will wait some time to try to failover the same master again. This delay is the 2 * failover-timeout you can configure in sentinel.conf. This means that Sentinels will not try to failover the same master at the same time, the first to ask to be authorized will try, if it fails another will try after some time, and so forth.
Redis Sentinel guarantees the liveness property that if a majority of Sentinels are able to talk, eventually one will be authorized to failover if the master is down.
Redis Sentinel also guarantees the safety property that every Sentinel will failover the same master using a different configuration epoch.
Configuration propagation 
Once a Sentinel is able to failover a master successfully, it will start to broadcast the new configuration so that the other Sentinels will update their information about a given master.
For a failover to be considered successful, it requires that the Sentinel was able to send the REPLICAOF NO ONE command to the selected replica, and that the switch to master was later observed in the INFO output of the master.
At this point, even if the reconfiguration of the replicas is in progress, the failover is considered to be successful, and all the Sentinels are required to start reporting the new configuration.
The way a new configuration is propagated is the reason why we need that every Sentinel failover is authorized with a different version number (configuration epoch).
Every Sentinel continuously broadcast its version of the configuration of a master using Redis Pub/Sub messages, both in the master and all the replicas. At the same time all the Sentinels wait for messages to see what is the configuration advertised by the other Sentinels.
Configurations are broadcast in the __sentinel__:hello Pub/Sub channel.
Because every configuration has a different version number, the greater version always wins over smaller versions.
So for example the configuration for the master mymaster start with all the Sentinels believing the master is at 192.168.1.50:6379. This configuration has version 1. After some time a Sentinel is authorized to failover with version 2. If the failover is successful, it will start to broadcast a new configuration, let's say 192.168.1.50:9000, with version 2. All the other instances will see this configuration and will update their configuration accordingly, since the new configuration has a greater version.
This means that Sentinel guarantees a second liveness property: a set of Sentinels that are able to communicate will all converge to the same configuration with the higher version number.
Basically if the net is partitioned, every partition will converge to the higher local configuration. In the special case of no partitions, there is a single partition and every Sentinel will agree about the configuration.
Consistency under partitions 
Redis Sentinel configurations are eventually consistent, so every partition will converge to the higher configuration available. However in a real-world system using Sentinel there are three different players:
Redis instances.
Sentinel instances.
Clients.
In order to define the behavior of the system we have to consider all three.
The following is a simple network where there are 3 nodes, each running a Redis instance, and a Sentinel instance:
           +-------------+
            | Sentinel 1  |----- Client A
            | Redis 1 (M) |
            +-------------+
                    |
                    |
+-------------+     |          +------------+
| Sentinel 2  |-----+-- // ----| Sentinel 3 |----- Client B
| Redis 2 (S) |                | Redis 3 (M)|
+-------------+                +------------+

In this system the original state was that Redis 3 was the master, while Redis 1 and 2 were replicas. A partition occurred isolating the old master. Sentinels 1 and 2 started a failover promoting Sentinel 1 as the new master.
The Sentinel properties guarantee that Sentinel 1 and 2 now have the new configuration for the master. However Sentinel 3 has still the old configuration since it lives in a different partition.
We know that Sentinel 3 will get its configuration updated when the network partition will heal, however what happens during the partition if there are clients partitioned with the old master?
Clients will be still able to write to Redis 3, the old master. When the partition will rejoin, Redis 3 will be turned into a replica of Redis 1, and all the data written during the partition will be lost.
Depending on your configuration you may want or not that this scenario happens:
If you are using Redis as a cache, it could be handy that Client B is still able to write to the old master, even if its data will be lost.
If you are using Redis as a store, this is not good and you need to configure the system in order to partially prevent this problem.
Since Redis is asynchronously replicated, there is no way to totally prevent data loss in this scenario, however you can bound the divergence between Redis 3 and Redis 1 using the following Redis configuration option:
min-replicas-to-write 1
min-replicas-max-lag 10

With the above configuration (please see the self-commented redis.conf example in the Redis distribution for more information) a Redis instance, when acting as a master, will stop accepting writes if it can't write to at least 1 replica. Since replication is asynchronous not being able to write actually means that the replica is either disconnected, or is not sending us asynchronous acknowledges for more than the specified max-lag number of seconds.
Using this configuration the Redis 3 in the above example will become unavailable after 10 seconds. When the partition heals, the Sentinel 3 configuration will converge to the new one, and Client B will be able to fetch a valid configuration and continue.
In general Redis + Sentinel as a whole are an eventually consistent system where the merge function is last failover wins, and the data from old masters are discarded to replicate the data of the current master, so there is always a window for losing acknowledged writes. This is due to Redis asynchronous replication and the discarding nature of the "virtual" merge function of the system. Note that this is not a limitation of Sentinel itself, and if you orchestrate the failover with a strongly consistent replicated state machine, the same properties will still apply. There are only two ways to avoid losing acknowledged writes:
Use synchronous replication (and a proper consensus algorithm to run a replicated state machine).
Use an eventually consistent system where different versions of the same object can be merged.
Redis currently is not able to use any of the above systems, and is currently outside the development goals. However there are proxies implementing solution "2" on top of Redis stores such as SoundCloud Roshi, or Netflix Dynomite.
Sentinel persistent state 
Sentinel state is persisted in the sentinel configuration file. For example every time a new configuration is received, or created (leader Sentinels), for a master, the configuration is persisted on disk together with the configuration epoch. This means that it is safe to stop and restart Sentinel processes.
TILT mode 
Redis Sentinel is heavily dependent on the computer time: for instance in order to understand if an instance is available it remembers the time of the latest successful reply to the PING command, and compares it with the current time to understand how old it is.
However if the computer time changes in an unexpected way, or if the computer is very busy, or the process blocked for some reason, Sentinel may start to behave in an unexpected way.
The TILT mode is a special "protection" mode that a Sentinel can enter when something odd is detected that can lower the reliability of the system. The Sentinel timer interrupt is normally called 10 times per second, so we expect that more or less 100 milliseconds will elapse between two calls to the timer interrupt.
What a Sentinel does is to register the previous time the timer interrupt was called, and compare it with the current call: if the time difference is negative or unexpectedly big (2 seconds or more) the TILT mode is entered (or if it was already entered the exit from the TILT mode postponed).
When in TILT mode the Sentinel will continue to monitor everything, but:
It stops acting at all.
It starts to reply negatively to SENTINEL is-master-down-by-addr requests as the ability to detect a failure is no longer trusted.
If everything appears to be normal for 30 second, the TILT mode is exited.
In the Sentinel TILT mode, if we send the INFO command, we could get the following response:
$ redis-cli -p 26379
127.0.0.1:26379> info
(Other information from Sentinel server skipped.)

# Sentinel
sentinel_masters:1
sentinel_tilt:0
sentinel_tilt_since_seconds:-1
sentinel_running_scripts:0
sentinel_scripts_queue_length:0
sentinel_simulate_failure_flags:0
master0:name=mymaster,status=ok,address=127.0.0.1:6379,slaves=0,sentinels=1

The field "sentinel_tilt_since_seconds" indicates how many seconds the Sentinel already is in the TILT mode. If it is not in TILT mode, the value will be -1.
Note that in some ways TILT mode could be replaced using the monotonic clock API that many kernels offer. However it is not still clear if this is a good solution since the current system avoids issues in case the process is just suspended or not executed by the scheduler for a long time.
A note about the word slave used in this man page: Starting with Redis 5, if not for backward compatibility, the Redis project no longer uses the word slave. Unfortunately in this command the word slave is part of the protocol, so we'll be able to remove such occurrences only when this API will be naturally deprecated.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Sentinel as a distributed system
Sentinel quick start
Obtaining Sentinel
Running Sentinel
Fundamental things to know about Sentinel before deploying
Configuring Sentinel
Other Sentinel options
Example Sentinel deployments
Sentinel, Docker, NAT, and possible issues
IP Addresses and DNS names
A quick tutorial
Asking Sentinel about the state of a master
Obtaining the address of the current master
Testing the failover
Sentinel API
Sentinel commands
Reconfiguring Sentinel at Runtime
Adding or removing Sentinels
Removing the old master or unreachable replicas
Pub/Sub messages
Handling of -BUSY state
Replicas priority
Sentinel and Redis authentication
Redis Access Control List authentication
Redis password-only authentication
Configuring Sentinel instances with authentication
Sentinel Access Control List authentication
Sentinel password-only authentication
Sentinel clients implementation
More advanced concepts
SDOWN and ODOWN failure state
Sentinels and replicas auto discovery
Sentinel reconfiguration of instances outside the failover procedure
Replica selection and priority
Algorithms and internals
Quorum
Configuration epochs
Configuration propagation
Consistency under partitions
Sentinel persistent state
TILT mode
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Redis persistence
How Redis writes data to disk
Redis Open Source

Persistence refers to the writing of data to durable storage, such as a solid-state disk (SSD). Redis provides a range of persistence options. These include:
RDB (Redis Database): RDB persistence performs point-in-time snapshots of your dataset at specified intervals.
AOF (Append Only File): AOF persistence logs every write operation received by the server. These operations can then be replayed again at server startup, reconstructing the original dataset. Commands are logged using the same format as the Redis protocol itself.
No persistence: You can disable persistence completely. This is sometimes used when caching.
RDB + AOF: You can also combine both AOF and RDB in the same instance.
If you'd rather not think about the tradeoffs between these different persistence strategies, you may want to consider Redis Enterprise's persistence options, which can be pre-configured using a UI.
To learn more about how to evaluate your Redis persistence strategy, read on.
RDB advantages 
RDB is a very compact single-file point-in-time representation of your Redis data. RDB files are perfect for backups. For instance you may want to archive your RDB files every hour for the latest 24 hours, and to save an RDB snapshot every day for 30 days. This allows you to easily restore different versions of the data set in case of disasters.
RDB is very good for disaster recovery, being a single compact file that can be transferred to far data centers, or onto Amazon S3 (possibly encrypted).
RDB maximizes Redis performances since the only work the Redis parent process needs to do in order to persist is forking a child that will do all the rest. The parent process will never perform disk I/O or alike.
RDB allows faster restarts with big datasets compared to AOF.
On replicas, RDB supports partial resynchronizations after restarts and failovers.
RDB disadvantages 
RDB is NOT good if you need to minimize the chance of data loss in case Redis stops working (for example after a power outage). You can configure different save points where an RDB is produced (for instance after at least five minutes and 100 writes against the data set, you can have multiple save points). However you'll usually create an RDB snapshot every five minutes or more, so in case of Redis stopping working without a correct shutdown for any reason you should be prepared to lose the latest minutes of data.
RDB needs to fork() often in order to persist on disk using a child process. fork() can be time consuming if the dataset is big, and may result in Redis stopping serving clients for some milliseconds or even for one second if the dataset is very big and the CPU performance is not great. AOF also needs to fork() but less frequently and you can tune how often you want to rewrite your logs without any trade-off on durability.
AOF advantages 
Using AOF Redis is much more durable: you can have different fsync policies: no fsync at all, fsync every second, fsync at every query. With the default policy of fsync every second, write performance is still great. fsync is performed using a background thread and the main thread will try hard to perform writes when no fsync is in progress, so you can only lose one second worth of writes.
The AOF log is an append-only log, so there are no seeks, nor corruption problems if there is a power outage. Even if the log ends with a half-written command for some reason (disk full or other reasons) the redis-check-aof tool is able to fix it easily.
Redis is able to automatically rewrite the AOF in background when it gets too big. The rewrite is completely safe as while Redis continues appending to the old file, a completely new one is produced with the minimal set of operations needed to create the current data set, and once this second file is ready Redis switches the two and starts appending to the new one.
AOF contains a log of all the operations one after the other in an easy to understand and parse format. You can even easily export an AOF file. For instance even if you've accidentally flushed everything using the FLUSHALL command, as long as no rewrite of the log was performed in the meantime, you can still save your data set just by stopping the server, removing the latest command, and restarting Redis again.
AOF disadvantages 
AOF files are usually bigger than the equivalent RDB files for the same dataset.
AOF can be slower than RDB depending on the exact fsync policy. In general with fsync set to every second performance is still very high, and with fsync disabled it should be exactly as fast as RDB even under high load. Still RDB is able to provide more guarantees about the maximum latency even in the case of a huge write load.
Redis < 7.0
AOF can use a lot of memory if there are writes to the database during a rewrite (these are buffered in memory and written to the new AOF at the end).
All write commands that arrive during rewrite are written to disk twice.
Redis could freeze writing and fsyncing these write commands to the new AOF file at the end of the rewrite.
Ok, so what should I use? 
The general indication you should use both persistence methods is if you want a degree of data safety comparable to what PostgreSQL can provide you.
If you care a lot about your data, but still can live with a few minutes of data loss in case of disasters, you can simply use RDB alone.
There are many users using AOF alone, but we discourage it since to have an RDB snapshot from time to time is a great idea for doing database backups, for faster restarts, and in the event of bugs in the AOF engine.
The following sections will illustrate a few more details about the two persistence models.
Snapshotting 
By default Redis saves snapshots of the dataset on disk, in a binary file called dump.rdb. You can configure Redis to have it save the dataset every N seconds if there are at least M changes in the dataset, or you can manually call the SAVE or BGSAVE commands.
For example, this configuration will make Redis automatically dump the dataset to disk every 60 seconds if at least 1000 keys changed:
save 60 1000

This strategy is known as snapshotting.
How it works 
Whenever Redis needs to dump the dataset to disk, this is what happens:
Redis forks. We now have a child and a parent process.
The child starts to write the dataset to a temporary RDB file.
When the child is done writing the new RDB file, it replaces the old one.
This method allows Redis to benefit from copy-on-write semantics.
Append-only file 
Snapshotting is not very durable. If your computer running Redis stops, your power line fails, or you accidentally kill -9 your instance, the latest data written to Redis will be lost. While this may not be a big deal for some applications, there are use cases for full durability, and in these cases Redis snapshotting alone is not a viable option.
The append-only file is an alternative, fully-durable strategy for Redis. It became available in version 1.1.
You can turn on the AOF in your configuration file:
appendonly yes

From now on, every time Redis receives a command that changes the dataset (e.g. SET) it will append it to the AOF. When you restart Redis it will re-play the AOF to rebuild the state.
Since Redis 7.0.0, Redis uses a multi part AOF mechanism. That is, the original single AOF file is split into base file (at most one) and incremental files (there may be more than one). The base file represents an initial (RDB or AOF format) snapshot of the data present when the AOF is rewritten. The incremental files contains incremental changes since the last base AOF file was created. All these files are put in a separate directory and are tracked by a manifest file.
Log rewriting 
The AOF gets bigger and bigger as write operations are performed. For example, if you are incrementing a counter 100 times, you'll end up with a single key in your dataset containing the final value, but 100 entries in your AOF. 99 of those entries are not needed to rebuild the current state.
The rewrite is completely safe. While Redis continues appending to the old file, a completely new one is produced with the minimal set of operations needed to create the current data set, and once this second file is ready Redis switches the two and starts appending to the new one.
So Redis supports an interesting feature: it is able to rebuild the AOF in the background without interrupting service to clients. Whenever you issue a BGREWRITEAOF, Redis will write the shortest sequence of commands needed to rebuild the current dataset in memory. If you're using the AOF with Redis 2.2 you'll need to run BGREWRITEAOF from time to time. Since Redis 2.4 is able to trigger log rewriting automatically (see the example configuration file for more information).
Since Redis 7.0.0, when an AOF rewrite is scheduled, the Redis parent process opens a new incremental AOF file to continue writing. The child process executes the rewrite logic and generates a new base AOF. Redis will use a temporary manifest file to track the newly generated base file and incremental file. When they are ready, Redis will perform an atomic replacement operation to make this temporary manifest file take effect. In order to avoid the problem of creating many incremental files in case of repeated failures and retries of an AOF rewrite, Redis introduces an AOF rewrite limiting mechanism to ensure that failed AOF rewrites are retried at a slower and slower rate.
How durable is the append only file? 
You can configure how many times Redis will fsync data on disk. There are three options:
appendfsync always: fsync every time new commands are appended to the AOF. Very very slow, very safe. Note that the commands are appended to the AOF after a batch of commands from multiple clients or a pipeline are executed, so it means a single write and a single fsync (before sending the replies).
appendfsync everysec: fsync every second. Fast enough (since version 2.4 likely to be as fast as snapshotting), and you may lose 1 second of data if there is a disaster.
appendfsync no: Never fsync, just put your data in the hands of the Operating System. The faster and less safe method. Normally Linux will flush data every 30 seconds with this configuration, but it's up to the kernel's exact tuning.
The suggested (and default) policy is to fsync every second. It is both fast and relatively safe. The always policy is very slow in practice, but it supports group commit, so if there are multiple parallel writes Redis will try to perform a single fsync operation.
What should I do if my AOF gets truncated? 
It is possible the server crashed while writing the AOF file, or the volume where the AOF file is stored was full at the time of writing. When this happens the AOF still contains consistent data representing a given point-in-time version of the dataset (that may be old up to one second with the default AOF fsync policy), but the last command in the AOF could be truncated. The latest major versions of Redis will be able to load the AOF anyway, just discarding the last non well formed command in the file. In this case the server will emit a log like the following:
* Reading RDB preamble from AOF file...
* Reading the remaining AOF tail...
# !!! Warning: short read while loading the AOF file !!!
# !!! Truncating the AOF at offset 439 !!!
# AOF loaded anyway because aof-load-truncated is enabled

You can change the default configuration to force Redis to stop in such cases if you want, but the default configuration is to continue regardless of the fact the last command in the file is not well-formed, in order to guarantee availability after a restart.
Older versions of Redis may not recover, and may require the following steps:
Make a backup copy of your AOF file.
Fix the original file using the redis-check-aof tool that ships with Redis:
$ redis-check-aof --fix <filename>


Optionally use diff -u to check what is the difference between two files.
Restart the server with the fixed file.
What should I do if my AOF gets corrupted? 
If the AOF file is not just truncated, but corrupted with invalid byte sequences in the middle, things are more complex. Redis will complain at startup and will abort:
* Reading the remaining AOF tail...
# Bad file format reading the append only file: make a backup of your AOF file, then use ./redis-check-aof --fix <filename>

The best thing to do is to run the redis-check-aof utility, initially without the --fix option, then understand the problem, jump to the given offset in the file, and see if it is possible to manually repair the file: The AOF uses the same format of the Redis protocol and is quite simple to fix manually. Otherwise it is possible to let the utility fix the file for us, but in that case all the AOF portion from the invalid part to the end of the file may be discarded, leading to a massive amount of data loss if the corruption happened to be in the initial part of the file.
How it works 
Log rewriting uses the same copy-on-write trick already in use for snapshotting. This is how it works:
Redis >= 7.0
Redis forks, so now we have a child and a parent process.
The child starts writing the new base AOF in a temporary file.
The parent opens a new increments AOF file to continue writing updates. If the rewriting fails, the old base and increment files (if there are any) plus this newly opened increment file represent the complete updated dataset, so we are safe.
When the child is done rewriting the base file, the parent gets a signal, and uses the newly opened increment file and child generated base file to build a temp manifest, and persist it.
Profit! Now Redis does an atomic exchange of the manifest files so that the result of this AOF rewrite takes effect. Redis also cleans up the old base file and any unused increment files.
Redis < 7.0
Redis forks, so now we have a child and a parent process.
The child starts writing the new AOF in a temporary file.
The parent accumulates all the new changes in an in-memory buffer (but at the same time it writes the new changes in the old append-only file, so if the rewriting fails, we are safe).
When the child is done rewriting the file, the parent gets a signal, and appends the in-memory buffer at the end of the file generated by the child.
Now Redis atomically renames the new file into the old one, and starts appending new data into the new file.
How I can switch to AOF, if I'm currently using dump.rdb snapshots? 
If you want to enable AOF in a server that is currently using RDB snapshots, you need to convert the data by enabling AOF via CONFIG command on the live server first.
IMPORTANT: not following this procedure (e.g. just changing the config and restarting the server) can result in data loss!
Redis >= 2.2
Preparations:
Make a backup of your latest dump.rdb file.
Transfer this backup to a safe place.
Switch to AOF on live database:
Enable AOF: redis-cli config set appendonly yes
Optionally disable RDB: redis-cli config set save ""
Make sure writes are appended to the append only file correctly.
IMPORTANT: Update your redis.conf (potentially through CONFIG REWRITE) and ensure that it matches the configuration above. If you forget this step, when you restart the server, the configuration changes will be lost and the server will start again with the old configuration, resulting in a loss of your data.
Next time you restart the server:
Before restarting the server, wait for AOF rewrite to finish persisting the data. You can do that by watching INFO persistence, waiting for aof_rewrite_in_progress and aof_rewrite_scheduled to be 0, and validating that aof_last_bgrewrite_status is ok.
After restarting the server, check that your database contains the same number of keys it contained previously.
Redis 2.0
Make a backup of your latest dump.rdb file.
Transfer this backup into a safe place.
Stop all the writes against the database!
Issue a redis-cli BGREWRITEAOF. This will create the append only file.
Stop the server when Redis finished generating the AOF dump.
Edit redis.conf end enable append only file persistence.
Restart the server.
Make sure that your database contains the same number of keys it contained before the switch.
Make sure that writes are appended to the append only file correctly.
Interactions between AOF and RDB persistence 
Redis >= 2.4 makes sure to avoid triggering an AOF rewrite when an RDB snapshotting operation is already in progress, or allowing a BGSAVE while the AOF rewrite is in progress. This prevents two Redis background processes from doing heavy disk I/O at the same time.
When snapshotting is in progress and the user explicitly requests a log rewrite operation using BGREWRITEAOF the server will reply with an OK status code telling the user the operation is scheduled, and the rewrite will start once the snapshotting is completed.
In the case both AOF and RDB persistence are enabled and Redis restarts the AOF file will be used to reconstruct the original dataset since it is guaranteed to be the most complete.
Backing up Redis data 
Before starting this section, make sure to read the following sentence: Make Sure to Backup Your Database. Disks break, instances in the cloud disappear, and so forth: no backups means huge risk of data disappearing into /dev/null.
Redis is very data backup friendly since you can copy RDB files while the database is running: the RDB is never modified once produced, and while it gets produced it uses a temporary name and is renamed into its final destination atomically using rename(2) only when the new snapshot is complete.
This means that copying the RDB file is completely safe while the server is running. This is what we suggest:
Create a cron job in your server creating hourly snapshots of the RDB file in one directory, and daily snapshots in a different directory.
Every time the cron script runs, make sure to call the find command to make sure too old snapshots are deleted: for instance you can take hourly snapshots for the latest 48 hours, and daily snapshots for one or two months. Make sure to name the snapshots with date and time information.
At least one time every day make sure to transfer an RDB snapshot outside your data center or at least outside the physical machine running your Redis instance.
Backing up AOF persistence 
If you run a Redis instance with only AOF persistence enabled, you can still perform backups. Since Redis 7.0.0, AOF files are split into multiple files which reside in a single directory determined by the appenddirname configuration. During normal operation all you need to do is copy/tar the files in this directory to achieve a backup. However, if this is done during a rewrite, you might end up with an invalid backup. To work around this you must disable AOF rewrites during the backup:
Turn off automatic rewrites with
CONFIG SET auto-aof-rewrite-percentage 0
Make sure you don't manually start a rewrite (using BGREWRITEAOF) during this time.
Check there's no current rewrite in progress using
INFO persistence
and verifying aof_rewrite_in_progress is 0. If it's 1, then you'll need to wait for the rewrite to complete.
Now you can safely copy the files in the appenddirname directory.
Re-enable rewrites when done:
CONFIG SET auto-aof-rewrite-percentage <prev-value>
Note: If you want to minimize the time AOF rewrites are disabled you may create hard links to the files in appenddirname (in step 3 above) and then re-enable rewrites (step 4) after the hard links are created. Now you can copy/tar the hardlinks and delete them when done. This works because Redis guarantees that it only appends to files in this directory, or completely replaces them if necessary, so the content should be consistent at any given point in time.
Note: If you want to handle the case of the server being restarted during the backup and make sure no rewrite will automatically start after the restart you can change step 1 above to also persist the updated configuration via CONFIG REWRITE. Just make sure to re-enable automatic rewrites when done (step 4) and persist it with another CONFIG REWRITE.
Prior to version 7.0.0 backing up the AOF file can be done simply by copying the aof file (like backing up the RDB snapshot). The file may lack the final part but Redis will still be able to load it (see the previous sections about truncated AOF files).
Disaster recovery 
Disaster recovery in the context of Redis is basically the same story as backups, plus the ability to transfer those backups in many different external data centers. This way data is secured even in the case of some catastrophic event affecting the main data center where Redis is running and producing its snapshots.
We'll review the most interesting disaster recovery techniques that don't have too high costs.
Amazon S3 and other similar services are a good way for implementing your disaster recovery system. Simply transfer your daily or hourly RDB snapshot to S3 in an encrypted form. You can encrypt your data using gpg -c (in symmetric encryption mode). Make sure to store your password in many different safe places (for instance give a copy to the most important people of your organization). It is recommended to use multiple storage services for improved data safety.
Transfer your snapshots using SCP (part of SSH) to far servers. This is a fairly simple and safe route: get a small VPS in a place that is very far from you, install ssh there, and generate a ssh client key without passphrase, then add it in the authorized_keys file of your small VPS. You are ready to transfer backups in an automated fashion. Get at least two VPS in two different providers for best results.
It is important to understand that this system can easily fail if not implemented in the right way. At least, make absolutely sure that after the transfer is completed you are able to verify the file size (that should match the one of the file you copied) and possibly the SHA1 digest, if you are using a VPS.
You also need some kind of independent alert system if the transfer of fresh backups is not working for some reason.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
RDB advantages
RDB disadvantages
AOF advantages
AOF disadvantages
Ok, so what should I use?
Snapshotting
How it works
Append-only file
Log rewriting
How durable is the append only file?
What should I do if my AOF gets truncated?
What should I do if my AOF gets corrupted?
How it works
How I can switch to AOF, if I'm currently using dump.rdb snapshots?
Interactions between AOF and RDB persistence
Backing up Redis data
Backing up AOF persistence
Disaster recovery
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Redis persistence
How Redis writes data to disk
Redis Open Source

Persistence refers to the writing of data to durable storage, such as a solid-state disk (SSD). Redis provides a range of persistence options. These include:
RDB (Redis Database): RDB persistence performs point-in-time snapshots of your dataset at specified intervals.
AOF (Append Only File): AOF persistence logs every write operation received by the server. These operations can then be replayed again at server startup, reconstructing the original dataset. Commands are logged using the same format as the Redis protocol itself.
No persistence: You can disable persistence completely. This is sometimes used when caching.
RDB + AOF: You can also combine both AOF and RDB in the same instance.
If you'd rather not think about the tradeoffs between these different persistence strategies, you may want to consider Redis Enterprise's persistence options, which can be pre-configured using a UI.
To learn more about how to evaluate your Redis persistence strategy, read on.
RDB advantages 
RDB is a very compact single-file point-in-time representation of your Redis data. RDB files are perfect for backups. For instance you may want to archive your RDB files every hour for the latest 24 hours, and to save an RDB snapshot every day for 30 days. This allows you to easily restore different versions of the data set in case of disasters.
RDB is very good for disaster recovery, being a single compact file that can be transferred to far data centers, or onto Amazon S3 (possibly encrypted).
RDB maximizes Redis performances since the only work the Redis parent process needs to do in order to persist is forking a child that will do all the rest. The parent process will never perform disk I/O or alike.
RDB allows faster restarts with big datasets compared to AOF.
On replicas, RDB supports partial resynchronizations after restarts and failovers.
RDB disadvantages 
RDB is NOT good if you need to minimize the chance of data loss in case Redis stops working (for example after a power outage). You can configure different save points where an RDB is produced (for instance after at least five minutes and 100 writes against the data set, you can have multiple save points). However you'll usually create an RDB snapshot every five minutes or more, so in case of Redis stopping working without a correct shutdown for any reason you should be prepared to lose the latest minutes of data.
RDB needs to fork() often in order to persist on disk using a child process. fork() can be time consuming if the dataset is big, and may result in Redis stopping serving clients for some milliseconds or even for one second if the dataset is very big and the CPU performance is not great. AOF also needs to fork() but less frequently and you can tune how often you want to rewrite your logs without any trade-off on durability.
AOF advantages 
Using AOF Redis is much more durable: you can have different fsync policies: no fsync at all, fsync every second, fsync at every query. With the default policy of fsync every second, write performance is still great. fsync is performed using a background thread and the main thread will try hard to perform writes when no fsync is in progress, so you can only lose one second worth of writes.
The AOF log is an append-only log, so there are no seeks, nor corruption problems if there is a power outage. Even if the log ends with a half-written command for some reason (disk full or other reasons) the redis-check-aof tool is able to fix it easily.
Redis is able to automatically rewrite the AOF in background when it gets too big. The rewrite is completely safe as while Redis continues appending to the old file, a completely new one is produced with the minimal set of operations needed to create the current data set, and once this second file is ready Redis switches the two and starts appending to the new one.
AOF contains a log of all the operations one after the other in an easy to understand and parse format. You can even easily export an AOF file. For instance even if you've accidentally flushed everything using the FLUSHALL command, as long as no rewrite of the log was performed in the meantime, you can still save your data set just by stopping the server, removing the latest command, and restarting Redis again.
AOF disadvantages 
AOF files are usually bigger than the equivalent RDB files for the same dataset.
AOF can be slower than RDB depending on the exact fsync policy. In general with fsync set to every second performance is still very high, and with fsync disabled it should be exactly as fast as RDB even under high load. Still RDB is able to provide more guarantees about the maximum latency even in the case of a huge write load.
Redis < 7.0
AOF can use a lot of memory if there are writes to the database during a rewrite (these are buffered in memory and written to the new AOF at the end).
All write commands that arrive during rewrite are written to disk twice.
Redis could freeze writing and fsyncing these write commands to the new AOF file at the end of the rewrite.
Ok, so what should I use? 
The general indication you should use both persistence methods is if you want a degree of data safety comparable to what PostgreSQL can provide you.
If you care a lot about your data, but still can live with a few minutes of data loss in case of disasters, you can simply use RDB alone.
There are many users using AOF alone, but we discourage it since to have an RDB snapshot from time to time is a great idea for doing database backups, for faster restarts, and in the event of bugs in the AOF engine.
The following sections will illustrate a few more details about the two persistence models.
Snapshotting 
By default Redis saves snapshots of the dataset on disk, in a binary file called dump.rdb. You can configure Redis to have it save the dataset every N seconds if there are at least M changes in the dataset, or you can manually call the SAVE or BGSAVE commands.
For example, this configuration will make Redis automatically dump the dataset to disk every 60 seconds if at least 1000 keys changed:
save 60 1000

This strategy is known as snapshotting.
How it works 
Whenever Redis needs to dump the dataset to disk, this is what happens:
Redis forks. We now have a child and a parent process.
The child starts to write the dataset to a temporary RDB file.
When the child is done writing the new RDB file, it replaces the old one.
This method allows Redis to benefit from copy-on-write semantics.
Append-only file 
Snapshotting is not very durable. If your computer running Redis stops, your power line fails, or you accidentally kill -9 your instance, the latest data written to Redis will be lost. While this may not be a big deal for some applications, there are use cases for full durability, and in these cases Redis snapshotting alone is not a viable option.
The append-only file is an alternative, fully-durable strategy for Redis. It became available in version 1.1.
You can turn on the AOF in your configuration file:
appendonly yes

From now on, every time Redis receives a command that changes the dataset (e.g. SET) it will append it to the AOF. When you restart Redis it will re-play the AOF to rebuild the state.
Since Redis 7.0.0, Redis uses a multi part AOF mechanism. That is, the original single AOF file is split into base file (at most one) and incremental files (there may be more than one). The base file represents an initial (RDB or AOF format) snapshot of the data present when the AOF is rewritten. The incremental files contains incremental changes since the last base AOF file was created. All these files are put in a separate directory and are tracked by a manifest file.
Log rewriting 
The AOF gets bigger and bigger as write operations are performed. For example, if you are incrementing a counter 100 times, you'll end up with a single key in your dataset containing the final value, but 100 entries in your AOF. 99 of those entries are not needed to rebuild the current state.
The rewrite is completely safe. While Redis continues appending to the old file, a completely new one is produced with the minimal set of operations needed to create the current data set, and once this second file is ready Redis switches the two and starts appending to the new one.
So Redis supports an interesting feature: it is able to rebuild the AOF in the background without interrupting service to clients. Whenever you issue a BGREWRITEAOF, Redis will write the shortest sequence of commands needed to rebuild the current dataset in memory. If you're using the AOF with Redis 2.2 you'll need to run BGREWRITEAOF from time to time. Since Redis 2.4 is able to trigger log rewriting automatically (see the example configuration file for more information).
Since Redis 7.0.0, when an AOF rewrite is scheduled, the Redis parent process opens a new incremental AOF file to continue writing. The child process executes the rewrite logic and generates a new base AOF. Redis will use a temporary manifest file to track the newly generated base file and incremental file. When they are ready, Redis will perform an atomic replacement operation to make this temporary manifest file take effect. In order to avoid the problem of creating many incremental files in case of repeated failures and retries of an AOF rewrite, Redis introduces an AOF rewrite limiting mechanism to ensure that failed AOF rewrites are retried at a slower and slower rate.
How durable is the append only file? 
You can configure how many times Redis will fsync data on disk. There are three options:
appendfsync always: fsync every time new commands are appended to the AOF. Very very slow, very safe. Note that the commands are appended to the AOF after a batch of commands from multiple clients or a pipeline are executed, so it means a single write and a single fsync (before sending the replies).
appendfsync everysec: fsync every second. Fast enough (since version 2.4 likely to be as fast as snapshotting), and you may lose 1 second of data if there is a disaster.
appendfsync no: Never fsync, just put your data in the hands of the Operating System. The faster and less safe method. Normally Linux will flush data every 30 seconds with this configuration, but it's up to the kernel's exact tuning.
The suggested (and default) policy is to fsync every second. It is both fast and relatively safe. The always policy is very slow in practice, but it supports group commit, so if there are multiple parallel writes Redis will try to perform a single fsync operation.
What should I do if my AOF gets truncated? 
It is possible the server crashed while writing the AOF file, or the volume where the AOF file is stored was full at the time of writing. When this happens the AOF still contains consistent data representing a given point-in-time version of the dataset (that may be old up to one second with the default AOF fsync policy), but the last command in the AOF could be truncated. The latest major versions of Redis will be able to load the AOF anyway, just discarding the last non well formed command in the file. In this case the server will emit a log like the following:
* Reading RDB preamble from AOF file...
* Reading the remaining AOF tail...
# !!! Warning: short read while loading the AOF file !!!
# !!! Truncating the AOF at offset 439 !!!
# AOF loaded anyway because aof-load-truncated is enabled

You can change the default configuration to force Redis to stop in such cases if you want, but the default configuration is to continue regardless of the fact the last command in the file is not well-formed, in order to guarantee availability after a restart.
Older versions of Redis may not recover, and may require the following steps:
Make a backup copy of your AOF file.
Fix the original file using the redis-check-aof tool that ships with Redis:
$ redis-check-aof --fix <filename>


Optionally use diff -u to check what is the difference between two files.
Restart the server with the fixed file.
What should I do if my AOF gets corrupted? 
If the AOF file is not just truncated, but corrupted with invalid byte sequences in the middle, things are more complex. Redis will complain at startup and will abort:
* Reading the remaining AOF tail...
# Bad file format reading the append only file: make a backup of your AOF file, then use ./redis-check-aof --fix <filename>

The best thing to do is to run the redis-check-aof utility, initially without the --fix option, then understand the problem, jump to the given offset in the file, and see if it is possible to manually repair the file: The AOF uses the same format of the Redis protocol and is quite simple to fix manually. Otherwise it is possible to let the utility fix the file for us, but in that case all the AOF portion from the invalid part to the end of the file may be discarded, leading to a massive amount of data loss if the corruption happened to be in the initial part of the file.
How it works 
Log rewriting uses the same copy-on-write trick already in use for snapshotting. This is how it works:
Redis >= 7.0
Redis forks, so now we have a child and a parent process.
The child starts writing the new base AOF in a temporary file.
The parent opens a new increments AOF file to continue writing updates. If the rewriting fails, the old base and increment files (if there are any) plus this newly opened increment file represent the complete updated dataset, so we are safe.
When the child is done rewriting the base file, the parent gets a signal, and uses the newly opened increment file and child generated base file to build a temp manifest, and persist it.
Profit! Now Redis does an atomic exchange of the manifest files so that the result of this AOF rewrite takes effect. Redis also cleans up the old base file and any unused increment files.
Redis < 7.0
Redis forks, so now we have a child and a parent process.
The child starts writing the new AOF in a temporary file.
The parent accumulates all the new changes in an in-memory buffer (but at the same time it writes the new changes in the old append-only file, so if the rewriting fails, we are safe).
When the child is done rewriting the file, the parent gets a signal, and appends the in-memory buffer at the end of the file generated by the child.
Now Redis atomically renames the new file into the old one, and starts appending new data into the new file.
How I can switch to AOF, if I'm currently using dump.rdb snapshots? 
If you want to enable AOF in a server that is currently using RDB snapshots, you need to convert the data by enabling AOF via CONFIG command on the live server first.
IMPORTANT: not following this procedure (e.g. just changing the config and restarting the server) can result in data loss!
Redis >= 2.2
Preparations:
Make a backup of your latest dump.rdb file.
Transfer this backup to a safe place.
Switch to AOF on live database:
Enable AOF: redis-cli config set appendonly yes
Optionally disable RDB: redis-cli config set save ""
Make sure writes are appended to the append only file correctly.
IMPORTANT: Update your redis.conf (potentially through CONFIG REWRITE) and ensure that it matches the configuration above. If you forget this step, when you restart the server, the configuration changes will be lost and the server will start again with the old configuration, resulting in a loss of your data.
Next time you restart the server:
Before restarting the server, wait for AOF rewrite to finish persisting the data. You can do that by watching INFO persistence, waiting for aof_rewrite_in_progress and aof_rewrite_scheduled to be 0, and validating that aof_last_bgrewrite_status is ok.
After restarting the server, check that your database contains the same number of keys it contained previously.
Redis 2.0
Make a backup of your latest dump.rdb file.
Transfer this backup into a safe place.
Stop all the writes against the database!
Issue a redis-cli BGREWRITEAOF. This will create the append only file.
Stop the server when Redis finished generating the AOF dump.
Edit redis.conf end enable append only file persistence.
Restart the server.
Make sure that your database contains the same number of keys it contained before the switch.
Make sure that writes are appended to the append only file correctly.
Interactions between AOF and RDB persistence 
Redis >= 2.4 makes sure to avoid triggering an AOF rewrite when an RDB snapshotting operation is already in progress, or allowing a BGSAVE while the AOF rewrite is in progress. This prevents two Redis background processes from doing heavy disk I/O at the same time.
When snapshotting is in progress and the user explicitly requests a log rewrite operation using BGREWRITEAOF the server will reply with an OK status code telling the user the operation is scheduled, and the rewrite will start once the snapshotting is completed.
In the case both AOF and RDB persistence are enabled and Redis restarts the AOF file will be used to reconstruct the original dataset since it is guaranteed to be the most complete.
Backing up Redis data 
Before starting this section, make sure to read the following sentence: Make Sure to Backup Your Database. Disks break, instances in the cloud disappear, and so forth: no backups means huge risk of data disappearing into /dev/null.
Redis is very data backup friendly since you can copy RDB files while the database is running: the RDB is never modified once produced, and while it gets produced it uses a temporary name and is renamed into its final destination atomically using rename(2) only when the new snapshot is complete.
This means that copying the RDB file is completely safe while the server is running. This is what we suggest:
Create a cron job in your server creating hourly snapshots of the RDB file in one directory, and daily snapshots in a different directory.
Every time the cron script runs, make sure to call the find command to make sure too old snapshots are deleted: for instance you can take hourly snapshots for the latest 48 hours, and daily snapshots for one or two months. Make sure to name the snapshots with date and time information.
At least one time every day make sure to transfer an RDB snapshot outside your data center or at least outside the physical machine running your Redis instance.
Backing up AOF persistence 
If you run a Redis instance with only AOF persistence enabled, you can still perform backups. Since Redis 7.0.0, AOF files are split into multiple files which reside in a single directory determined by the appenddirname configuration. During normal operation all you need to do is copy/tar the files in this directory to achieve a backup. However, if this is done during a rewrite, you might end up with an invalid backup. To work around this you must disable AOF rewrites during the backup:
Turn off automatic rewrites with
CONFIG SET auto-aof-rewrite-percentage 0
Make sure you don't manually start a rewrite (using BGREWRITEAOF) during this time.
Check there's no current rewrite in progress using
INFO persistence
and verifying aof_rewrite_in_progress is 0. If it's 1, then you'll need to wait for the rewrite to complete.
Now you can safely copy the files in the appenddirname directory.
Re-enable rewrites when done:
CONFIG SET auto-aof-rewrite-percentage <prev-value>
Note: If you want to minimize the time AOF rewrites are disabled you may create hard links to the files in appenddirname (in step 3 above) and then re-enable rewrites (step 4) after the hard links are created. Now you can copy/tar the hardlinks and delete them when done. This works because Redis guarantees that it only appends to files in this directory, or completely replaces them if necessary, so the content should be consistent at any given point in time.
Note: If you want to handle the case of the server being restarted during the backup and make sure no rewrite will automatically start after the restart you can change step 1 above to also persist the updated configuration via CONFIG REWRITE. Just make sure to re-enable automatic rewrites when done (step 4) and persist it with another CONFIG REWRITE.
Prior to version 7.0.0 backing up the AOF file can be done simply by copying the aof file (like backing up the RDB snapshot). The file may lack the final part but Redis will still be able to load it (see the previous sections about truncated AOF files).
Disaster recovery 
Disaster recovery in the context of Redis is basically the same story as backups, plus the ability to transfer those backups in many different external data centers. This way data is secured even in the case of some catastrophic event affecting the main data center where Redis is running and producing its snapshots.
We'll review the most interesting disaster recovery techniques that don't have too high costs.
Amazon S3 and other similar services are a good way for implementing your disaster recovery system. Simply transfer your daily or hourly RDB snapshot to S3 in an encrypted form. You can encrypt your data using gpg -c (in symmetric encryption mode). Make sure to store your password in many different safe places (for instance give a copy to the most important people of your organization). It is recommended to use multiple storage services for improved data safety.
Transfer your snapshots using SCP (part of SSH) to far servers. This is a fairly simple and safe route: get a small VPS in a place that is very far from you, install ssh there, and generate a ssh client key without passphrase, then add it in the authorized_keys file of your small VPS. You are ready to transfer backups in an automated fashion. Get at least two VPS in two different providers for best results.
It is important to understand that this system can easily fail if not implemented in the right way. At least, make absolutely sure that after the transfer is completed you are able to verify the file size (that should match the one of the file you copied) and possibly the SHA1 digest, if you are using a VPS.
You also need some kind of independent alert system if the transfer of fresh backups is not working for some reason.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
RDB advantages
RDB disadvantages
AOF advantages
AOF disadvantages
Ok, so what should I use?
Snapshotting
How it works
Append-only file
Log rewriting
How durable is the append only file?
What should I do if my AOF gets truncated?
What should I do if my AOF gets corrupted?
How it works
How I can switch to AOF, if I'm currently using dump.rdb snapshots?
Interactions between AOF and RDB persistence
Backing up Redis data
Backing up AOF persistence
Disaster recovery
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

How can I install Redis on Docker?
Redis CE and Stack
installation
docker
Last updated 02, May 2024
Question
How can I install Redis on Docker?
Answer
Follow the recommendations for installing Redis Community Edition in the documentation. However, we recommend the installation of Redis Stack to gain access to the modeling capabilities using the JSON data type, to have the ability to search and query your data, use Redis as a vector database, as a time series database, resolve problems using the probabilistic data structures, and more.
To install Redis Stack using Docker, follow the steps in the documentation, also reported here.
Install Docker
First, make sure you have Docker installed on your operating system. You can download and install Docker from the official Docker website.
Pull the Redis image
Open a terminal or command prompt and run the following command to pull the Redis Docker image:
docker pull redis/redis-stack-server:latest

Copy code
This will download the latest Redis image from the Docker Hub.
Run the Redis Stack container
Once the image is downloaded, run the following command to start a Redis container (if the image hasn't been downloaded, the command will perform the download and create the container all at once). At this stage, you can specify the map the server port to a different one (replace 6379:6379 with the desired port, MY_PORT:6379)
docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest

Copy code
This command creates and starts a container named "my-redis" using the Redis image. The container will run in the background.
Verify the installation
You can check if the Redis container is running by executing the following command:
docker ps

Copy code
If the container is running, you will see it listed along with other information. That's it! You have now installed Redis Stack using Docker. During container creation, you can connect to the Redis server using the specified Redis port (6379 is the usual default if otherwise specified).
References
Run Redis Stack on Docker
Recommendations
How to connect to Redis in a C# .NET project using the NRedisStack client library
Can I use Redis as a Vector Database?
What is Redis Stack?
How to Migrate an on-premise CRDB to Redis Cloud CRDB?
TLS connection failure using redis-cli
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
           All products           Redis Enterprise           Redis Cloud           Redis CE and Stack           Redis Insight           Redis Enterprise for K8s           Redis Data Integration           Client Libraries         
ESC

Redis Enterprise Software release notes 7.8.6-60 (April 2025)
Bug fixes for an LDAP connection issue caused by setting LDAP bind credentials that include < in the Cluster Manager UI and an issue where migrated shards can appear stuck on multiple nodes. Deprecated required_version in the bootstrap cluster API.
Redis Enterprise Software

This is a maintenance release for ​​Redis Enterprise Software version 7.8.6.
Highlights 
This version offers:
Bug fixes for an LDAP connection issue caused by setting LDAP bind credentials that include < in the Cluster Manager UI and an issue where migrated shards can appear stuck on multiple nodes.
New in this release 
Redis database versions 
Redis Software version 7.8.6 includes three Redis database versions: 7.4, 7.2, and 6.2.
The default Redis database version is 7.4.
Redis module feature sets 
Redis Software comes packaged with several modules. As of version 7.8.2, Redis Software includes three feature sets, compatible with different Redis database versions.
The following table shows which Redis modules are compatible with each Redis database version included in this release.
Redis database version
Compatible Redis modules
7.4
RediSearch 2.10
RedisJSON 2.8
RedisTimeSeries 1.12
RedisBloom 2.8
7.2
RediSearch 2.8
RedisJSON 2.6
RedisTimeSeries 1.10
RedisBloom 2.6
6.2
RediSearch 2.6
RedisJSON 2.4
RedisTimeSeries 1.8
RedisBloom 2.4
RedisGraph v2.101

RedisGraph end-of-life has been announced and will be removed in a future release. See the RedisGraph end-of-life announcement for more details.
Resolved issues 
RS155783: Fixed an issue where using the special character < when setting LDAP bind credentials in the Cluster Manager UI caused LDAP connection failures.
RS144215: Fixed an issue where a shard's status might not update correctly after migration, causing it to appear stuck on multiple nodes even if the migration completed successfully.
Version changes 
Deprecations 
API deprecations 
Deprecated the required_version option for the bootstrap cluster API.
Supported platforms 
The following table provides a snapshot of supported platforms as of this Redis Software release. See the supported platforms reference for more details about operating system compatibility.
✅ Supported – The platform is supported for this version of Redis Software and Redis Stack modules.
⚠️ Deprecation warning – The platform is still supported for this version of Redis Software, but support will be removed in a future release.
Redis Software
major versions
7.8
7.4
7.2
6.4
6.2
Release date
Nov 2024
Feb 2024
Aug 2023
Feb 2023
Aug 2021
End-of-life date
Determined after
next major release
Nov 2026
Feb 2026
Aug 2025
Feb 2025
Platforms










RHEL 9 &
compatible distros1
✅
✅
–
–
–
RHEL 9
FIPS mode5
✅
–
–
–
–
RHEL 8 &
compatible distros1
✅
✅
✅
✅
✅
RHEL 7 &
compatible distros1
–
–
⚠️
✅
✅
Ubuntu 22.042
✅
–
–
–
–
Ubuntu 20.042
✅
✅
✅
✅
–
Ubuntu 18.042
–
⚠️
⚠️
✅
✅
Ubuntu 16.042
–
–
⚠️
✅
✅
Amazon Linux 2
✅
✅
✅
✅
–
Amazon Linux 1
–
–
✅
✅
✅
Kubernetes3
✅
✅
✅
✅
✅
Docker4
✅
✅
✅
✅
✅


The RHEL-compatible distributions CentOS, CentOS Stream, Alma, and Rocky are supported if they have full RHEL compatibility. Oracle Linux running the Red Hat Compatible Kernel (RHCK) is supported, but the Unbreakable Enterprise Kernel (UEK) is not supported.
The server version of Ubuntu is recommended for production installations. The desktop version is only recommended for development deployments.
See the Redis Enterprise for Kubernetes documentation for details about support per version and Kubernetes distribution.
Docker images of Redis Software are certified for development and testing only.
Supported only if FIPS was enabled during RHEL installation to ensure FIPS compliance.
Downloads 
The following table shows the SHA256 checksums for the available packages:
Package
SHA256 checksum (7.8.6-60 April release)
Ubuntu 20
490a54371f3f958991079bec5a350297d62c12f5820fceb821fe0caf7a33945e
Ubuntu 22
e28c4c59771078ce5cc16043e676f24b37428174bc927f69e44eb688e861ebd1
Red Hat Enterprise Linux (RHEL) 8
2315099f7c41a0113dd2e4de8914c264366018140f42645b874560ccc04c60c3
Red Hat Enterprise Linux (RHEL) 9
a76e61d02bc5b1d86afe0cd97939a762ce2e9f91d10b70f6f6dbe34efe4cc81d
Amazon Linux 2
6c8d2b3266ff99b4acef7632555e9cd44d7642f6d2cd703143c5ae7106677107

Known issues 
RS131972: Creating an ACL that contains a line break in the Cluster Manager UI can cause shard migration to fail due to ACL errors.
Known limitations 
Upload modules before OS upgrade 
If the cluster contains any databases that use modules, you must upload module packages for the target OS version to a node in the existing cluster before you upgrade the cluster's operating system.
See Upgrade a cluster's operating system for detailed upgrade instructions.
New Cluster Manager UI limitations 
The following legacy UI features are not yet available in the new Cluster Manager UI:
Purge an Active-Active instance.
Use crdb-cli crdb purge-instance instead.
Search and export the log.
RedisGraph prevents upgrade to RHEL 9 
You cannot upgrade from a prior RHEL version to RHEL 9 if the Redis Software cluster contains a RedisGraph module, even if unused by any database. The RedisGraph module has reached End-of-Life and is completely unavailable in RHEL 9.
Query results might include hash keys with lazily expired fields 
If one or more fields of a hash key expire after an FT.SEARCH or FT.AGGREGATE query begins, Redis does not account for these lazily expired fields. As a result, keys with expired fields might still be included in the query results, leading to potentially incorrect or inconsistent results.
Security 
Open source Redis security fixes compatibility 
As part of Redis's commitment to security, Redis Software implements the latest security fixes available with open source Redis. Redis Software has already included the fixes for the relevant CVEs.
Some CVEs announced for open source Redis do not affect Redis Software due to different or additional functionality available in Redis Software that is not available in open source Redis.
Redis Software 7.8.6-60 supports open source Redis 7.4, 7.2, and 6.2. Below is the list of open source Redis CVEs fixed by version.
Redis 7.4.x:
(CVE-2025-21605) An unauthenticated client can cause unlimited growth of output buffers until the server runs out of memory or is terminated, which can lead to denial-of-service.
Redis 7.2.x:
(CVE-2025-21605) An unauthenticated client can cause unlimited growth of output buffers until the server runs out of memory or is terminated, which can lead to denial-of-service.
(CVE-2024-31449) An authenticated user may use a specially crafted Lua script to trigger a stack buffer overflow in the bit library, which may potentially lead to remote code execution.
(CVE-2024-31228) An authenticated user can trigger a denial-of-service by using specially crafted, long string match patterns on supported commands such as KEYS, SCAN, PSUBSCRIBE, FUNCTION LIST, COMMAND LIST, and ACL definitions. Matching of extremely long patterns may result in unbounded recursion, leading to stack overflow and process crashes.
(CVE-2023-41056) In some cases, Redis may incorrectly handle resizing of memory buffers, which can result in incorrect accounting of buffer sizes and lead to heap overflow and potential remote code execution.
(CVE-2023-41053) Redis does not correctly identify keys accessed by SORT_RO and, as a result, may grant users executing this command access to keys that are not explicitly authorized by the ACL configuration. (Redis 7.2.1)
Redis 7.0.x:
(CVE-2024-31449) An authenticated user may use a specially crafted Lua script to trigger a stack buffer overflow in the bit library, which may potentially lead to remote code execution.
(CVE-2024-31228) An authenticated user can trigger a denial-of-service by using specially crafted, long string match patterns on supported commands such as KEYS, SCAN, PSUBSCRIBE, FUNCTION LIST, COMMAND LIST, and ACL definitions. Matching of extremely long patterns may result in unbounded recursion, leading to stack overflow and process crashes.
(CVE-2023-41056) In some cases, Redis may incorrectly handle resizing of memory buffers, which can result in incorrect accounting of buffer sizes and lead to heap overflow and potential remote code execution.
(CVE-2023-41053) Redis does not correctly identify keys accessed by SORT_RO and, as a result, may grant users executing this command access to keys that are not explicitly authorized by the ACL configuration. (Redis 7.0.13)
(CVE-2023-36824) Extracting key names from a command and a list of arguments may, in some cases, trigger a heap overflow and result in reading random heap memory, heap corruption, and potentially remote code execution. Specifically: using COMMAND GETKEYS* and validation of key names in ACL rules. (Redis 7.0.12)
(CVE-2023-28856) Authenticated users can use the HINCRBYFLOAT command to create an invalid hash field that will crash Redis on access. (Redis 7.0.11)
(CVE-2023-28425) Specially crafted MSETNX commands can lead to assertion and denial-of-service. (Redis 7.0.10)
(CVE-2023-25155) Specially crafted SRANDMEMBER, ZRANDMEMBER, and HRANDFIELD commands can trigger an integer overflow, resulting in a runtime assertion and termination of the Redis server process. (Redis 7.0.9)
(CVE-2023-22458) Integer overflow in the Redis HRANDFIELD and ZRANDMEMBER commands can lead to denial-of-service. (Redis 7.0.8)
(CVE-2022-36021) String matching commands (like SCAN or KEYS) with a specially crafted pattern to trigger a denial-of-service attack on Redis can cause it to hang and consume 100% CPU time. (Redis 7.0.9)
(CVE-2022-35977) Integer overflow in the Redis SETRANGE and SORT/SORT_RO commands can drive Redis to OOM panic. (Redis 7.0.8)
(CVE-2022-35951) Executing an XAUTOCLAIM command on a stream key in a specific state, with a specially crafted COUNT argument, may cause an integer overflow, a subsequent heap overflow, and potentially lead to remote code execution. The problem affects Redis versions 7.0.0 or newer. (Redis 7.0.5)
(CVE-2022-31144) A specially crafted XAUTOCLAIM command on a stream key in a specific state may result in heap overflow and potentially remote code execution. The problem affects Redis versions 7.0.0 or newer. (Redis 7.0.4)
(CVE-2022-24834) A specially crafted Lua script executing in Redis can trigger a heap overflow in the cjson and cmsgpack libraries, and result in heap corruption and potentially remote code execution. The problem exists in all versions of Redis with Lua scripting support, starting from 2.6, and affects only authenticated and authorized users. (Redis 7.0.12)
(CVE-2022-24736) An attacker attempting to load a specially crafted Lua script can cause NULL pointer dereference which will result in a crash of the redis-server process. This issue affects all versions of Redis. (Redis 7.0.0)
(CVE-2022-24735) By exploiting weaknesses in the Lua script execution environment, an attacker with access to Redis can inject Lua code that will execute with the (potentially higher) privileges of another Redis user. (Redis 7.0.0)
Redis 6.2.x:
(CVE-2025-21605) An unauthenticated client can cause unlimited growth of output buffers until the server runs out of memory or is terminated, which can lead to denial-of-service.
(CVE-2024-31449) An authenticated user may use a specially crafted Lua script to trigger a stack buffer overflow in the bit library, which may potentially lead to remote code execution.
(CVE-2024-31228) An authenticated user can trigger a denial-of-service by using specially crafted, long string match patterns on supported commands such as KEYS, SCAN, PSUBSCRIBE, FUNCTION LIST, COMMAND LIST, and ACL definitions. Matching of extremely long patterns may result in unbounded recursion, leading to stack overflow and process crashes.
(CVE-2023-28856) Authenticated users can use the HINCRBYFLOAT command to create an invalid hash field that will crash Redis on access. (Redis 6.2.12)
(CVE-2023-25155) Specially crafted SRANDMEMBER, ZRANDMEMBER, and HRANDFIELD commands can trigger an integer overflow, resulting in a runtime assertion and termination of the Redis server process. (Redis 6.2.11)
(CVE-2023-22458) Integer overflow in the Redis HRANDFIELD and ZRANDMEMBER commands can lead to denial-of-service. (Redis 6.2.9)
(CVE-2022-36021) String matching commands (like SCAN or KEYS) with a specially crafted pattern to trigger a denial-of-service attack on Redis can cause it to hang and consume 100% CPU time. (Redis 6.2.11)
(CVE-2022-35977) Integer overflow in the Redis SETRANGE and SORT/SORT_RO commands can drive Redis to OOM panic. (Redis 6.2.9)
(CVE-2022-24834) A specially crafted Lua script executing in Redis can trigger a heap overflow in the cjson and cmsgpack libraries, and result in heap corruption and potentially remote code execution. The problem exists in all versions of Redis with Lua scripting support, starting from 2.6, and affects only authenticated and authorized users. (Redis 6.2.13)
(CVE-2022-24736) An attacker attempting to load a specially crafted Lua script can cause NULL pointer dereference which will result in a crash of the redis-server process. This issue affects all versions of Redis. (Redis 6.2.7)
(CVE-2022-24735) By exploiting weaknesses in the Lua script execution environment, an attacker with access to Redis can inject Lua code that will execute with the (potentially higher) privileges of another Redis user. (Redis 6.2.7)
(CVE-2021-41099) Integer to heap buffer overflow handling certain string commands and network payloads, when proto-max-bulk-len is manually configured to a non-default, very large value. (Redis 6.2.6)
(CVE-2021-32762) Integer to heap buffer overflow issue in redis-cli and redis-sentinel parsing large multi-bulk replies on some older and less common platforms. (Redis 6.2.6)
(CVE-2021-32761) An integer overflow bug in Redis version 2.2 or newer can be exploited using the BITFIELD command to corrupt the heap and potentially result with remote code execution. (Redis 6.2.5)
(CVE-2021-32687) Integer to heap buffer overflow with intsets, when set-max-intset-entries is manually configured to a non-default, very large value. (Redis 6.2.6)
(CVE-2021-32675) Denial Of Service when processing RESP request payloads with a large number of elements on many connections. (Redis 6.2.6)
(CVE-2021-32672) Random heap reading issue with Lua Debugger. (Redis 6.2.6)
(CVE-2021-32628) Integer to heap buffer overflow handling ziplist-encoded data types, when configuring a large, non-default value for hash-max-ziplist-entries, hash-max-ziplist-value, zset-max-ziplist-entries or zset-max-ziplist-value. (Redis 6.2.6)
(CVE-2021-32627) Integer to heap buffer overflow issue with streams, when configuring a non-default, large value for proto-max-bulk-len and client-query-buffer-limit. (Redis 6.2.6)
(CVE-2021-32626) Specially crafted Lua scripts may result with Heap buffer overflow. (Redis 6.2.6)
(CVE-2021-32625) An integer overflow bug in Redis version 6.0 or newer can be exploited using the STRALGO LCS command to corrupt the heap and potentially result with remote code execution. This is a result of an incomplete fix by CVE-2021-29477. (Redis 6.2.4)
(CVE-2021-29478) An integer overflow bug in Redis 6.2 could be exploited to corrupt the heap and potentially result with remote code execution. The vulnerability involves changing the default set-max-intset-entries configuration value, creating a large set key that consists of integer values and using the COPY command to duplicate it. The integer overflow bug exists in all versions of Redis starting with 2.6, where it could result with a corrupted RDB or DUMP payload, but not exploited through COPY (which did not exist before 6.2). (Redis 6.2.3)
(CVE-2021-29477) An integer overflow bug in Redis version 6.0 or newer could be exploited using the STRALGO LCS command to corrupt the heap and potentially result in remote code execution. The integer overflow bug exists in all versions of Redis starting with 6.0. (Redis 6.2.3)
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Highlights
New in this release
Redis database versions
Redis module feature sets
Resolved issues
Version changes
Deprecations
Supported platforms
Downloads
Known issues
Known limitations


Security


TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Redis Time Series
RedisTimeseries is a Redis module that enhances your experience managing time-series data with Redis. It simplifies the use of Redis for time-series use cases such as internet of things (IoT) data, stock prices, and telemetry. With Redis Time Series, you can ingest and query millions of samples and events at the speed of Redis. Advanced tooling such as downsampling and aggregation ensure a small memory footprint without impacting performance. Use a variety of queries for visualization and monitoring with built-in connectors to popular monitoring tools like Grafana, Prometheus, and Telegraf.
Step 1. Register and subscribe#
Follow this link to register and subscribe to Redis Cloud

Step 2. Create a database with Redis Time Series Module#

Step 3. Connect to a database#
Follow this link to know how to connect to a database
Step 4. Getting Started with Redis Time Series#
This section will walk you through using some basic RedisTimeseries commands. You can run them from the Redis command-line interface (redis-cli) or use the CLI available in RedisInsight. (See part 2 of this tutorial to learn more about using the RedisInsight CLI.) Using a basic air-quality dataset, we will show you how to:
•Create a new time series
•Add a new sample to the list of series
•Query a range across one or multiple time series

Create a new time series
Let’s create a time series representing air quality dataset measurements. To interact with Redis Time Series you will most often use the TS.RANGE command, but here you will create a time series per measurement using the TS.CREATE command. Once created, all the measurements will be sent using TS.ADD.
The sample command below creates a time series and populates it with three entries:
>> TS.CREATE ts:carbon_monoxide
>> TS.CREATE ts:relative_humidity
>> TS.CREATE ts:temperature RETENTION 60 LABELS sensor_id 2 area_id 32
In the above example, ts:carbon_monoxide, ts:relative_humidity and ts:temperature are key names. We are creating a time series with two labels (sensor_id and area_id are the fields with values 2 and 32 respectively) and a retention window of 60 milliseconds:
Add a new sample data to the time series
Let’s start to add samples into the keys that will be automatically created using this command:
>> TS.ADD ts:carbon_monoxide 1112596200 2.4
>> TS.ADD ts:relative_humidity 1112596200 18.3
>> TS.ADD ts:temperature 1112599800 28.3
>> TS.ADD ts:carbon_monoxide 1112599800 2.1
>> TS.ADD ts:relative_humidity 1112599800 13.5
>> TS.ADD ts:temperature 1112603400 28.5
>> TS.ADD ts:carbon_monoxide 1112603400 2.2
>> TS.ADD ts:relative_humidity 1112603400 13.1
>> TS.ADD ts:temperature 1112607000 28.7
Querying the sample
Now that you have sample data in your time series, you’re ready to ask questions such as:
“How do I get the last sample?”
TS.GET is used to get the last sample. The returned array will contain the last sample timestamp followed by the last sample value, when the time series contains data:
>> TS.GET ts:temperature
1) (integer) 1112607000
2) "28.7"
“How do I get the last sample matching the specific filter?”
TS.MGET is used to get the last samples matching the specific filter:
>> TS.MGET FILTER area_id=32
1) 1) "ts:temperature"
   2) (empty list or set)
   3) 1) (integer) 1112607000
      2) "28.7"
“How do I get the sample with labels matching the specific filter?”
>> TS.MGET WITHLABELS FILTER area_id=32
1) 1) "ts:temperature"
   2) 1) 1) "sensor_id"
         2) "2"
      2) 1) "area_id"
         2) "32"
   3) 1) (integer) 1112607000
      2) "28.7"
Query a range across one or more time series
TS.RANGE is used to query a range in forward directions while TS.REVRANGE is used to query a range in reverse directions, They let you answer such questions as:
“How do I get the sample for a time range?”
>> TS.RANGE ts:carbon_monoxide 1112596200 1112603400
1) 1) (integer) 1112596200
   2) "2.4"
2) 1) (integer) 1112599800
   2) "2.1"
3) 1) (integer) 1112603400
   2) "2.2"
Aggregation
You can use various aggregation types such as avg, sum, min, max, range, count, first, last etc. The example below example shows how to use “avg” aggregation type to answer such questions as:
“How do I get the sample for a time range on some aggregation rule?”
>> TS.RANGE ts:carbon_monoxide 1112596200 1112603400 AGGREGATION avg 2
1) 1) (integer) 1112596200
   2) "2.4"
2) 1) (integer) 1112599800
   2) "2.1"
3) 1) (integer) 1112603400
   2) "2.2"
Next Steps#
•Learn more about Redis Time Series in the Quickstart tutorial.
Join Redis University
Get Started with Redis Cloud
Go from sign up to production in less than 2 hours with Redis Cloud. This path walks you through the process step-by-step...
Get started

Last updated on Jan 31, 2025
On this page
Step 1. Register and subscribe
Step 2. Create a database with Redis Time Series Module
Step 3. Connect to a database
Step 4. Getting Started with Redis Time Series
Next Steps







TrustPrivacyTerms of useLegal notices
USE CASES
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
INDUSTRIES
Financial ServicesGamingHealthcareRetailAll industries
COMPARE
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
COMPANY
Mission & valuesLeadershipCareersNews
CONNECT
CommunityEvents & webinarsNews
PARTNERS
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
SUPPORT
Professional servicesSupport

Bloom filter
Bloom filters are a probabilistic data structure that checks for presence of an item in a set
A Bloom filter is a probabilistic data structure in Redis Open Source that enables you to check if an element is present in a set using a very small memory space of a fixed size.
Instead of storing all the items in a set, a Bloom Filter stores only the items' hashed representations, thus sacrificing some precision. The trade-off is that Bloom Filters are very space-efficient and fast.
A Bloom filter can guarantee the absence of an item from a set, but it can only give an estimation about its presence. So when it responds that an item is not present in a set (a negative answer), you can be sure that indeed is the case. But one out of every N positive answers will be wrong. Even though it looks unusual at first glance, this kind of uncertainty still has its place in computer science. There are many cases out there where a negative answer will prevent more costly operations, for example checking if a username has been taken, if a credit card has been reported as stolen, if a user has already seen an ad and much more.
Use cases 
Financial fraud detection (finance)
This application answers the question, "Has the user paid from this location before?", thus checking for suspicious activity in their users' shopping habits.
Use one Bloom filter per user, checked for every transaction. Provide an extremely fast response (local latency). Replicate in different regions in case the user moves. Prevent decreasing performance with scale.
Using the Redis Bloom filter for this type of application provides these benefits:
Fast transaction completion
Decreased possibility for transaction to break in case of network partitions (connection needs to be kept open for a shorter time)
Extra layer of security for both credit card owners and retailers
Other questions a Bloom filter can help answer in the finance industry are:
Has the user ever made purchases in this category of products/services?
Do I need to skip some security steps when the user is buying with a vetted online shop (big retailers like Amazon, Apple app store...)?
Has this credit card been reported as lost/stolen? An additional benefit of using a Bloom filter in the last case is that financial organizations can exchange their lists of stolen/blocked credit card numbers without revealing the numbers themselves.
Ad placement (retail, advertising)
This application answers these questions:
Has the user already seen this ad?
Has the user already bought this product?
Use a Bloom filter for every user, storing all bought products. The recommendation engine suggests a new product and checks if the product is in the user's Bloom filter.
If no, the ad is shown to the user and is added to the Bloom filter.
If yes, the process restarts and repeats until it finds a product that is not present in the filter.
Using the Redis Bloom filter for this type of application provides these benefits:
Cost efficient way to a customized near real-time experience
No need to invest in expensive infrastructure
Check if a username is taken (SaaS, content publishing platforms)
This application answers this question: Has this username/email/domain name/slug already been used?
Use a Bloom filter for every username that has signed up. A new user types in the desired username. The app checks if the username exists in the Bloom filter.
If no, the user is created and the username is added to the Bloom filter.
If yes, the app can decide to either check the main database or reject the username.
The query time stays the same at scale.
Using the Redis Bloom filter for this type of application provides these benefits:
Very fast and efficient way to do a common operation
No need to invest in expensive infrastructure
Example 
Consider a bike manufacturer that makes a million different kinds of bikes and you'd like to avoid using a duplicate model name in new models. A Bloom filter can be used to detect duplicates. In the example that follows, you'll create a filter with space for a million entries and with a 0.1% error rate. Add one model name and check if it exists. Then add multiple model names and check if they exist.
>_ Redis CLI
> BF.RESERVE bikes:models 0.001 1000000

OK

> BF.ADD bikes:models "Smoky Mountain Striker"

(integer) 1

> BF.EXISTS bikes:models "Smoky Mountain Striker"

(integer) 1

> BF.MADD bikes:models "Rocky Mountain Racer" "Cloudy City Cruiser" "Windy City Wippet"

1) (integer) 1

2) (integer) 1

3) (integer) 1

> BF.MEXISTS bikes:models "Rocky Mountain Racer" "Cloudy City Cruiser" "Windy City Wippet"

1) (integer) 1

2) (integer) 1

3) (integer) 1
PythonNode.jsJava-SyncGoC#
Note: there is always a chance that even with just a few items, there could be a false positive, meaning an item could "exist" even though it has not been explicitly added to the Bloom filter. For a more in depth understanding of the probabilistic nature of a Bloom filter, check out the blog posts linked at the bottom of this page.
Reserving Bloom filters 
With the Redis Bloom filter, most of the sizing work is done for you:
BF.RESERVE {key} {error_rate} {capacity} [EXPANSION expansion] [NONSCALING]

1. False positives rate (error_rate) 
The rate is a decimal value between 0 and 1. For example, for a desired false positive rate of 0.1% (1 in 1000), error_rate should be set to 0.001.
2. Expected capacity (capacity) 
This is the number of items you expect having in your filter in total and is trivial when you have a static set but it becomes more challenging when your set grows over time. It's important to get the number right because if you oversize - you'll end up wasting memory. If you undersize, the filter will fill up and a new one will have to be stacked on top of it (sub-filter stacking). In the cases when a filter consists of multiple sub-filters stacked on top of each other latency for adds stays the same, but the latency for presence checks increases. The reason for this is the way the checks work: a regular check would first be performed on the top (latest) filter and if a negative answer is returned the next one is checked and so on. That's where the added latency comes from.
3. Scaling (EXPANSION) 
Adding an item to a Bloom filter never fails due to the data structure "filling up". Instead, the error rate starts to grow. To keep the error close to the one set on filter initialization, the Bloom filter will auto-scale, meaning, when capacity is reached, an additional sub-filter will be created.
The size of the new sub-filter is the size of the last sub-filter multiplied by EXPANSION. If the number of items to be stored in the filter is unknown, we recommend that you use an expansion of 2 or more to reduce the number of sub-filters. Otherwise, we recommend that you use an expansion of 1 to reduce memory consumption. The default expansion value is 2.
The filter will keep adding more hash functions for every new sub-filter in order to keep your desired error rate.
Maybe you're wondering "Why would I create a smaller filter with a high expansion rate if I know I'm going to scale anyway?"; the answer is: for cases where you need to keep many filters (let's say a filter per user, or per product) and most of them will stay small, but some with more activity will have to scale.
4. NONSCALING 
If you know you're not going to scale use the NONSCALING flag because that way the filter will use one hash function less. Just remember that if you ever do reach the initially assigned capacity - your error rate will start to grow.
Total size of a Bloom filter 
The actual memory used by a Bloom filter is a function of the chosen error rate:
The optimal number of hash functions is ceil(-ln(error_rate) / ln(2)).
The required number of bits per item, given the desired error_rate and the optimal number of hash functions, is -ln(error_rate) / ln(2)^2. Hence, the required number of bits in the filter is capacity * -ln(error_rate) / ln(2)^2.
1% error rate requires 7 hash functions and 9.585 bits per item.
0.1% error rate requires 10 hash functions and 14.378 bits per item.
0.01% error rate requires 14 hash functions and 19.170 bits per item.
Just as a comparison, when using a Redis set for membership testing the memory needed is:
memory_with_sets = capacity*(192b + value)

For a set of IP addresses, for example, we would have around 40 bytes (320 bits) per item - considerably higher than the 19.170 bits we need for a Bloom filter with a 0.01% false positives rate.
Bloom vs. Cuckoo filters 
Bloom filters typically exhibit better performance and scalability when inserting items (so if you're often adding items to your dataset, then a Bloom filter may be ideal). Cuckoo filters are quicker on check operations and also allow deletions.
Performance 
Insertion in a Bloom filter is O(K), where k is the number of hash functions.
Checking for an item is O(K) or O(K*n) for stacked filters, where n is the number of stacked filters.
Academic sources 
Space/Time Trade-offs in Hash Coding with Allowable Errors by Burton H. Bloom.
Scalable Bloom Filters
References 
Webinars 
Probabilistic Data Structures - The most useful thing in Redis you probably aren't using
Blog posts 
RedisBloom Quick Start Tutorial
Developing with Bloom Filters
RedisBloom on Redis Enterprise
Probably and No: Redis, RedisBloom, and Bloom Filters
RedisBloom – Bloom Filter Datatype for Redis
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Use cases
Example
Reserving Bloom filters


Total size of a Bloom filter
Bloom vs. Cuckoo filters
Performance
Academic sources
References
Webinars
Blog posts
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Indexing
How to index and search JSON documents
In addition to indexing Redis hashes, Redis Open Source can also index JSON documents.
Create index with JSON schema 
When you create an index with the FT.CREATE command, include the ON JSON keyword to index any existing and future JSON documents stored in the database.
To define the SCHEMA, you can provide JSONPath expressions. The result of each JSONPath expression is indexed and associated with a logical name called an attribute (previously known as a field). You can use these attributes in queries.
Note:
Note: attribute is optional for FT.CREATE.
Use the following syntax to create a JSON index:
FT
For example, this command creates an index that indexes the name, description, price, and image vector embedding of each JSON document that represents an inventory item:
.
See Index limitations for more details about JSON index SCHEMA restrictions.
Add JSON documents 
After you create an index, Redis automatically indexes any existing, modified, or newly created JSON documents stored in the database. For existing documents, indexing runs asynchronously in the background, so it can take some time before the document is available. Modified and newly created documents are indexed synchronously, so the document will be available by the time the add or modify command finishes.
You can use any JSON write command, such as JSON.SET and JSON.ARRAPPEND, to create or modify JSON documents.
The following examples use these JSON documents to represent individual inventory items.
Item 1 JSON document:
{

 "name": "Noise-cancelling Bluetooth headphones",

 "description": "Wireless Bluetooth headphones with noise-cancelling technology",

 "connection": {

   "wireless": true,

   "type": "Bluetooth"

 },

 "price": 99.98,

 "stock": 25,

 "colors": [

   "black",

   "silver"

 ],

 "embedding": [0.87, -0.15, 0.55, 0.03]

}

Item 2 JSON document:
{

 "name": "Wireless earbuds",

 "description": "Wireless Bluetooth in-ear headphones",

 "connection": {

   "wireless": true,

   "type": "Bluetooth"

 },

 "price": 64.99,

 "stock": 17,

 "colors": [

   "black",

   "white"

 ],

 "embedding": [-0.7, -0.51, 0.88, 0.14]

}

Use JSON.SET to store these documents in the database:
127.0.0.1:6379> JSON.SET item:1 $ '{"name":"Noise-cancelling Bluetooth headphones","description":"Wireless Bluetooth headphones with noise-cancelling technology","connection":{"wireless":true,"type":"Bluetooth"},"price":99.98,"stock":25,"colors":["black","silver"],"embedding":[0.87,-0.15,0.55,0.03]}'

"OK"

127.0.0.1:6379> JSON.SET item:2 $ '{"name":"Wireless earbuds","description":"Wireless Bluetooth in-ear headphones","connection":{"wireless":true,"type":"Bluetooth"},"price":64.99,"stock":17,"colors":["black","white"],"embedding":[-0.7,-0.51,0.88,0.14]}'

"OK"

Because indexing is synchronous in this case, the documents will be available on the index as soon as the JSON.SET command returns. Any subsequent queries that match the indexed content will return the document.
Search the index 
To search the index for JSON documents, use the FT.SEARCH command. You can search any attribute defined in the SCHEMA.
For example, use this query to search for items with the word "earbuds" in the name:
127.0.0.1:6379> FT.SEARCH itemIdx '@name:(earbuds)'

1) "1"

2) "item:2"

3) 1) "$"

  2) "{\"name\":\"Wireless earbuds\",\"description\":\"Wireless Bluetooth in-ear headphones\",\"connection\":{\"wireless\":true,\"connection\":\"Bluetooth\"},\"price\":64.99,\"stock\":17,\"colors\":[\"black\",\"white\"],\"embedding\":[-0.7,-0.51,0.88,0.14]}"

This query searches for all items that include "bluetooth" and "headphones" in the description:
127.0.0.1:6379> FT.SEARCH itemIdx '@description:(bluetooth headphones)'

1) "2"

2) "item:1"

3) 1) "$"

  2) "{\"name\":\"Noise-cancelling Bluetooth headphones\",\"description\":\"Wireless Bluetooth headphones with noise-cancelling technology\",\"connection\":{\"wireless\":true,\"type\":\"Bluetooth\"},\"price\":99.98,\"stock\":25,\"colors\":[\"black\",\"silver\"], \"embedding\":[0.87,-0.15,0.55,0.03]}"

4) "item:2"

5) 1) "$"

  2) "{\"name\":\"Wireless earbuds\",\"description\":\"Wireless Bluetooth in-ear headphones\",\"connection\":{\"wireless\":true,\"connection\":\"Bluetooth\"},\"price\":64.99,\"stock\":17,\"colors\":[\"black\",\"white\"],\"embedding\":[-0.7,-0.51,0.88,0.14]}"

Now search for Bluetooth headphones with a price less than 70:
127.0.0.1:6379> FT.SEARCH itemIdx '@description:(bluetooth headphones) @price:[0 70]'

1) "1"

2) "item:2"

3) 1) "$"

  2) "{\"name\":\"Wireless earbuds\",\"description\":\"Wireless Bluetooth in-ear headphones\",\"connection\":{\"wireless\":true,\"connection\":\"Bluetooth\"},\"price\":64.99,\"stock\":17,\"colors\":[\"black\",\"white\"],\"embedding\":[-0.7,-0.51,0.88,0.14]}"

And lastly, search for the Bluetooth headphones that are most similar to an image whose embedding is [1.0, 1.0, 1.0, 1.0]:
127.0.0.1:6379> FT.SEARCH itemIdx '@description:(bluetooth headphones)=>[KNN 2 @embedding $blob]' PARAMS 2 blob \x01\x01\x01\x01 DIALECT 2

1) "2"

2) "item:1"

3) 1) "__embedding_score"

  2) "1.08280003071"

  1) "$"

  2) "{\"name\":\"Noise-cancelling Bluetooth headphones\",\"description\":\"Wireless Bluetooth headphones with noise-cancelling technology\",\"connection\":{\"wireless\":true,\"type\":\"Bluetooth\"},\"price\":99.98,\"stock\":25,\"colors\":[\"black\",\"silver\"],\"embedding\":[0.87,-0.15,0.55,0.03]}"

2) "item:2"

3) 1) "__embedding_score"

  2) "1.54409992695"

  3) "$"

  4) "{\"name\":\"Wireless earbuds\",\"description\":\"Wireless Bluetooth in-ear headphones\",\"connection\":{\"wireless\":true,\"connection\":\"Bluetooth\"},\"price\":64.99,\"stock\":17,\"colors\":[\"black\",\"white\"],\"embedding\":[-0.7,-0.51,0.88,0.14]}"

For more information about search queries, see Search query syntax.
Note:
FT.SEARCH queries require attribute modifiers. Don't use JSONPath expressions in queries because the query parser doesn't fully support them.
Index JSON arrays as TAG 
The preferred method for indexing a JSON field with multivalued terms is using JSON arrays. Each value of the array is indexed, and those values must be scalars. If you want to index string or boolean values as TAGs within a JSON array, use the JSONPath wildcard operator.
To index an item's list of available colors, specify the JSONPath $.colors.* in the SCHEMA definition during index creation:
.
Now you can search for silver headphones:
127.0.0.1:6379> FT.SEARCH itemIdx2 "@colors:{silver} (@name:(headphones)|@description:(headphones))"

1) "1"

2) "item:1"

3) 1) "$"

  2) "{\"name\":\"Noise-cancelling Bluetooth headphones\",\"description\":\"Wireless Bluetooth headphones with noise-cancelling technology\",\"connection\":{\"wireless\":true,\"type\":\"Bluetooth\"},\"price\":99.98,\"stock\":25,\"colors\":[\"black\",\"silver\"]}"

Index JSON arrays as TEXT 
Starting with RediSearch v2.6.0, full text search can be done on an array of strings or on a JSONPath leading to multiple strings.
If you want to index multiple string values as TEXT, use either a JSONPath leading to a single array of strings, or a JSONPath leading to multiple string values, using JSONPath operators such as wildcard, filter, union, array slice, and/or recursive descent.
To index an item's list of available colors, specify the JSONPath $.colors in the SCHEMA definition during index creation:
.
127.0.0.1:6379> JSON.SET item:3 $ '{"name":"True Wireless earbuds","description":"True Wireless Bluetooth in-ear headphones","connection":{"wireless":true,"type":"Bluetooth"},"price":74.99,"stock":20,"colors":["red","light blue"]}'

"OK"

Now you can do full text search for light colored headphones:
127.0.0.1:6379> FT.SEARCH itemIdx3 '@colors:(white|light) (@name|description:(headphones))' RETURN 1 $.colors

1) (integer) 2

2) "item:2"

3) 1) "$.colors"

  2) "[\"black\",\"white\"]"

4) "item:3"

5) 1) "$.colors"

  2) "[\"red\",\"light blue\"]"

Limitations 
When a JSONPath may lead to multiple values and not only to a single array, e.g., when a JSONPath contains wildcards, etc., specifying SLOP or INORDER in FT.SEARCH will return an error, since the order of the values matching the JSONPath is not well defined, leading to potentially inconsistent results.
For example, using a JSONPath such as $..b[*] on a JSON value such as
{


  "a": [


     {"b": ["first first", "first second"]},


     {"c":


        {"b": ["second first", "second second"]}},


     {"b": ["third first", "third second"]}


  ]


}


may match values in various orderings, depending on the specific implementation of the JSONPath library being used.
Since SLOP and INORDER consider relative ordering among the indexed values, and results may change in future releases, an error will be returned.
When JSONPath leads to multiple values:
String values are indexed
null values are skipped
Any other value type will cause an indexing failure
SORTBY only sorts by the first value
No HIGHLIGHT and SUMMARIZE support
RETURN of a Schema attribute, whose JSONPath leads to multiple values, returns only the first value (as a JSON String)
If a JSONPath is specified by the RETURN, instead of a Schema attribute, all values are returned (as a JSON String)
Handling phrases in different array slots: 
When indexing, a predefined delta is used to increase positional offsets between array slots for multiple text values. This delta controls the level of separation between phrases in different array slots (related to the SLOP parameter of FT.SEARCH). This predefined value is set by the configuration parameter MULTI_TEXT_SLOP (at module load-time). The default value is 100.
Index JSON arrays as NUMERIC 
Starting with RediSearch v2.6.1, search can be done on an array of numerical values or on a JSONPath leading to multiple numerical values.
If you want to index multiple numerical values as NUMERIC, use either a JSONPath leading to a single array of numbers, or a JSONPath leading to multiple numbers, using JSONPath operators such as wildcard, filter, union, array slice, and/or recursive descent.
For example, add to the item's list the available max_level of volume (in decibels):
127.0.0.1:6379> JSON.SET item:1 $ '{"name":"Noise-cancelling Bluetooth headphones","description":"Wireless Bluetooth headphones with noise-cancelling technology","connection":{"wireless":true,"type":"Bluetooth"},"price":99.98,"stock":25,"colors":["black","silver"], "max_level":[60, 70, 80, 90, 100]}'

OK



127.0.0.1:6379> JSON.SET item:2 $ '{"name":"Wireless earbuds","description":"Wireless Bluetooth in-ear headphones","connection":{"wireless":true,"type":"Bluetooth"},"price":64.99,"stock":17,"colors":["black","white"], "max_level":[80, 100, 120]}'

OK



127.0.0.1:6379> JSON.SET item:3 $ '{"name":"True Wireless earbuds","description":"True Wireless Bluetooth in-ear headphones","connection":{"wireless":true,"type":"Bluetooth"},"price":74.99,"stock":20,"colors":["red","light blue"], "max_level":[90, 100, 110, 120]}'

OK

To index the max_level array, specify the JSONPath $.max_level in the SCHEMA definition during index creation:
127.0.0.1:6379> FT.CREATE itemIdx4 ON JSON PREFIX 1 item: SCHEMA $.max_level AS dB NUMERIC

OK

You can now search for headphones with specific max volume levels, for example, between 70 and 80 (inclusive), returning items with at least one value in their max_level array, which is in the requested range:
127.0.0.1:6379> FT.SEARCH itemIdx4 '@dB:[70 80]'

1) (integer) 2

2) "item:1"

3) 1) "$"

  2) "{\"name\":\"Noise-cancelling Bluetooth headphones\",\"description\":\"Wireless Bluetooth headphones with noise-cancelling technology\",\"connection\":{\"wireless\":true,\"type\":\"Bluetooth\"},\"price\":99.98,\"stock\":25,\"colors\":[\"black\",\"silver\"],\"max_level\":[60,70,80,90,100]}"

4) "item:2"

5) 1) "$"

  2) "{\"name\":\"Wireless earbuds\",\"description\":\"Wireless Bluetooth in-ear headphones\",\"connection\":{\"wireless\":true,\"type\":\"Bluetooth\"},\"price\":64.99,\"stock\":17,\"colors\":[\"black\",\"white\"],\"max_level\":[80,100,120]}"

You can also search for items with all values in a specific range. For example, all values are in the range [90, 120] (inclusive):
127.0.0.1:6379> FT.SEARCH itemIdx4 '-@dB:[-inf (90] -@dB:[(120 +inf]'

1) (integer) 1

2) "item:3"

3) 1) "$"

  2) "{\"name\":\"True Wireless earbuds\",\"description\":\"True Wireless Bluetooth in-ear headphones\",\"connection\":{\"wireless\":true,\"type\":\"Bluetooth\"},\"price\":74.99,\"stock\":20,\"colors\":[\"red\",\"light blue\"],\"max_level\":[90,100,110,120]}"

Limitations 
When JSONPath leads to multiple numerical values:
Numerical values are indexed
null values are skipped
Any other value type will cause an indexing failure
Index JSON arrays as GEO and GEOSHAPE 
You can use GEO and GEOSHAPE fields to store geospatial data, such as geographical locations and geometric shapes. See Geospatial indexing to learn how to use these schema types and see the Geospatial reference page for an introduction to their format and usage.
Index JSON arrays as VECTOR 
Starting with RediSearch 2.6.0, you can index a JSONPath leading to an array of numeric values as a VECTOR type in the index schema.
For example, assume that your JSON items include an array of vector embeddings, where each vector represents an image of a product. To index these vectors, specify the JSONPath $.embedding in the schema definition during index creation:
127.0.0.1:6379> FT.CREATE itemIdx5 ON JSON PREFIX 1 item: SCHEMA $.embedding AS embedding VECTOR FLAT 6 DIM 4 DISTANCE_METRIC L2 TYPE FLOAT32

OK

127.0.0.1:6379> JSON.SET item:1 $ '{"name":"Noise-cancelling Bluetooth headphones","description":"Wireless Bluetooth headphones with noise-cancelling technology","price":99.98,"stock":25,"colors":["black","silver"],"embedding":[0.87,-0.15,0.55,0.03]}'

OK

127.0.0.1:6379> JSON.SET item:2 $ '{"name":"Wireless earbuds","description":"Wireless Bluetooth in-ear headphones","price":64.99,"stock":17,"colors":["black","white"],"embedding":[-0.7,-0.51,0.88,0.14]}'

OK

Now you can search for the two headphones that are most similar to the image embedding by using vector search KNN query. (Note that the vector queries are supported as of dialect 2.) For example:
127.0.0.1:6379> FT.SEARCH itemIdx5 '*=>[KNN 2 @embedding $blob AS dist]' SORTBY dist PARAMS 2 blob \x01\x01\x01\x01 DIALECT 2

1) (integer) 2

2) "item:1"

3) 1) "dist"

  2) "1.08280003071"

  3) "$"

  4) "{\"name\":\"Noise-cancelling Bluetooth headphones\",\"description\":\"Wireless Bluetooth headphones with noise-cancelling technology\",\"price\":99.98,\"stock\":25,\"colors\":[\"black\",\"silver\"],\"embedding\":[0.87,-0.15,0.55,0.03]}"

4) "item:2"

5) 1) "dist"

  2) "1.54409992695"

  3) "$"

  4) "{\"name\":\"Wireless earbuds\",\"description\":\"Wireless Bluetooth in-ear headphones\",\"price\":64.99,\"stock\":17,\"colors\":[\"black\",\"white\"],\"embedding\":[-0.7,-0.51,0.88,0.14]}"

If you want to index multiple numeric arrays as VECTOR, use a JSONPath leading to multiple numeric arrays using JSONPath operators such as wildcard, filter, union, array slice, and/or recursive descent.
For example, assume that your JSON items include an array of vector embeddings, where each vector represents a different image of the same product. To index these vectors, specify the JSONPath $.embeddings[*] in the schema definition during index creation:
127.0.0.1:6379> FT.CREATE itemIdx5 ON JSON PREFIX 1 item: SCHEMA $.embeddings[*] AS embeddings VECTOR FLAT 6 DIM 4 DISTANCE_METRIC L2 TYPE FLOAT32

OK

127.0.0.1:6379> JSON.SET item:1 $ '{"name":"Noise-cancelling Bluetooth headphones","description":"Wireless Bluetooth headphones with noise-cancelling technology","price":99.98,"stock":25,"colors":["black","silver"],"embeddings":[[0.87,-0.15,0.55,0.03]]}'

OK

127.0.0.1:6379> JSON.SET item:2 $ '{"name":"Wireless earbuds","description":"Wireless Bluetooth in-ear headphones","price":64.99,"stock":17,"colors":["black","white"],"embeddings":[[-0.7,-0.51,0.88,0.14],[-0.8,-0.15,0.33,-0.01]]}'

OK

Important note:
Unlike the case with the NUMERIC type, setting a static path such as $.embedding in the schema for the VECTOR type does not allow you to index multiple vectors stored under that field. Hence, if you set $.embedding as the path to the index schema, specifying an array of vectors in the embedding field in your JSON will cause an indexing failure.
Now you can search for the two headphones that are most similar to an image embedding by using vector search KNN query. (Note that the vector queries are supported as of dialect 2.) The distance between a document to the query vector is defined as the minimum distance between the query vector to a vector that matches the JSONPath specified in the schema. For example:
127.0.0.1:6379> FT.SEARCH itemIdx5 '*=>[KNN 2 @embeddings $blob AS dist]' SORTBY dist PARAMS 2 blob \x01\x01\x01\x01 DIALECT 2

1) (integer) 2

2) "item:2"

3) 1) "dist"

  2) "0.771500051022"

  3) "$"

  4) "{\"name\":\"Wireless earbuds\",\"description\":\"Wireless Bluetooth in-ear headphones\",\"price\":64.99,\"stock\":17,\"colors\":[\"black\",\"white\"],\"embeddings\":[[-0.7,-0.51,0.88,0.14],[-0.8,-0.15,0.33,-0.01]]}"

4) "item:1"

5) 1) "dist"

  2) "1.08280003071"

  3) "$"

  4) "{\"name\":\"Noise-cancelling Bluetooth headphones\",\"description\":\"Wireless Bluetooth headphones with noise-cancelling technology\",\"price\":99.98,\"stock\":25,\"colors\":[\"black\",\"silver\"],\"embeddings\":[[0.87,-0.15,0.55,0.03]]}"

Note that 0.771500051022 is the L2 distance between the query vector and [-0.8,-0.15,0.33,-0.01], which is the second element in the embedding array, and it is lower than the L2 distance between the query vector and [-0.7,-0.51,0.88,0.14], which is the first element in the embedding array.
For more information on vector similarity syntax, see Vector fields.
Index JSON objects 
You cannot index JSON objects. FT.CREATE will return an error if the JSONPath expression returns an object.
To index the contents of a JSON object, you need to index the individual elements within the object in separate attributes.
For example, to index the connection JSON object, define the $.connection.wireless and $.connection.type fields as separate attributes when you create the index:
127.0.0.1:6379> FT.CREATE itemIdx3 ON JSON SCHEMA $.connection.wireless AS wireless TAG $.connection.type AS connectionType TEXT

"OK"

After you create the new index, you can search for items with the wireless TAG set to true:
127.0.0.1:6379> FT.SEARCH itemIdx3 '@wireless:{true}'

1) "2"

2) "item:2"

3) 1) "$"

  2) "{\"name\":\"Wireless earbuds\",\"description\":\"Wireless Bluetooth in-ear headphones\",\"connection\":{\"wireless\":true,\"connection\":\"Bluetooth\"},\"price\":64.99,\"stock\":17,\"colors\":[\"black\",\"white\"]}"

4) "item:1"

5) 1) "$"

  2) "{\"name\":\"Noise-cancelling Bluetooth headphones\",\"description\":\"Wireless Bluetooth headphones with noise-cancelling technology\",\"connection\":{\"wireless\":true,\"type\":\"Bluetooth\"},\"price\":99.98,\"stock\":25,\"colors\":[\"black\",\"silver\"]}"

You can also search for items with a Bluetooth connection type:
127.0.0.1:6379> FT.SEARCH itemIdx3 '@connectionType:(bluetooth)'

1) "2"

2) "item:1"

3) 1) "$"

  2) "{\"name\":\"Noise-cancelling Bluetooth headphones\",\"description\":\"Wireless Bluetooth headphones with noise-cancelling technology\",\"connection\":{\"wireless\":true,\"type\":\"Bluetooth\"},\"price\":99.98,\"stock\":25,\"colors\":[\"black\",\"silver\"]}"

4) "item:2"

5) 1) "$"

  2) "{\"name\":\"Wireless earbuds\",\"description\":\"Wireless Bluetooth in-ear headphones\",\"connection\":{\"wireless\":true,\"type\":\"Bluetooth\"},\"price\":64.99,\"stock\":17,\"colors\":[\"black\",\"white\"]}"

Field projection 
FT.SEARCH returns the entire JSON document by default. If you want to limit the returned search results to specific attributes, you can use field projection.
Return specific attributes 
When you run a search query, you can use the RETURN keyword to specify which attributes you want to include in the search results. You also need to specify the number of fields to return.
For example, this query only returns the name and price of each set of headphones:
127.0.0.1:6379> FT.SEARCH itemIdx '@description:(headphones)' RETURN 2 name price

1) "2"

2) "item:1"

3) 1) "name"

  2) "Noise-cancelling Bluetooth headphones"

  3) "price"

  4) "99.98"

4) "item:2"

5) 1) "name"

  2) "Wireless earbuds"

  3) "price"

  4) "64.99"

Project with JSONPath 
You can use JSONPath expressions in a RETURN statement to extract any part of the JSON document, even fields that were not defined in the index SCHEMA.
For example, the following query uses the JSONPath expression $.stock to return each item's stock in addition to the name and price attributes.
127.0.0.1:6379> FT.SEARCH itemIdx '@description:(headphones)' RETURN 3 name price $.stock

1) "2"

2) "item:1"

3) 1) "name"

  2) "Noise-cancelling Bluetooth headphones"

  3) "price"

  4) "99.98"

  5) "$.stock"

  6) "25"

4) "item:2"

5) 1) "name"

  2) "Wireless earbuds"

  3) "price"

  4) "64.99"

  5) "$.stock"

  6) "17"

Note that the returned property name is the JSONPath expression itself: "$.stock".
You can use the AS option to specify an alias for the returned property:
127.0.0.1:6379> FT.SEARCH itemIdx '@description:(headphones)' RETURN 5 name price $.stock AS stock

1) "2"

2) "item:1"

3) 1) "name"

  2) "Noise-cancelling Bluetooth headphones"

  3) "price"

  4) "99.98"

  5) "stock"

  6) "25"

4) "item:2"

5) 1) "name"

  2) "Wireless earbuds"

  3) "price"

  4) "64.99"

  5) "stock"

  6) "17"

This query returns the field as the alias "stock" instead of the JSONPath expression "$.stock".
Highlight search terms 
You can highlight relevant search terms in any indexed TEXT attribute.
For FT.SEARCH, you have to explicitly set which attributes you want highlighted after the RETURN and HIGHLIGHT parameters.
Use the optional TAGS keyword to specify the strings that will surround (or highlight) the matching search terms.
For example, highlight the word "bluetooth" with bold HTML tags in item names and descriptions:
127.0.0.1:6379> FT.SEARCH itemIdx '(@name:(bluetooth))|(@description:(bluetooth))' RETURN 3 name description price HIGHLIGHT FIELDS 2 name description TAGS '<b>' '</b>'

1) "2"

2) "item:1"

3) 1) "name"

  2) "Noise-cancelling <b>Bluetooth</b> headphones"

  3) "description"

  4) "Wireless <b>Bluetooth</b> headphones with noise-cancelling technology"

  5) "price"

  6) "99.98"

4) "item:2"

5) 1) "name"

  2) "Wireless earbuds"

  3) "description"

  4) "Wireless <b>Bluetooth</b> in-ear headphones"

  5) "price"

  6) "64.99"

Aggregate with JSONPath 
You can use aggregation to generate statistics or build facet queries.
The LOAD option accepts JSONPath expressions. You can use any value in the pipeline, even if the value is not indexed.
This example uses aggregation to calculate a 10% price discount for each item and sorts the items from least expensive to most expensive:
127.0.0.1:6379> FT.AGGREGATE itemIdx '*' LOAD 4 name $.price AS originalPrice APPLY '@originalPrice - (@originalPrice * 0.10)' AS salePrice SORTBY 2 @salePrice ASC

1) "2"

2) 1) "name"

  2) "Wireless earbuds"

  3) "originalPrice"

  4) "64.99"

  5) "salePrice"

  6) "58.491"

3) 1) "name"

  2) "Noise-cancelling Bluetooth headphones"

  3) "originalPrice"

  4) "99.98"

  5) "salePrice"

  6) "89.982"

Note:
FT.AGGREGATE queries require attribute modifiers. Don't use JSONPath expressions in queries, except with the LOAD option, because the query parser doesn't fully support them.
Index missing or empty values 
As of v2.10, you can search for missing properties, that is, properties that do not exist in a given document, using the INDEXMISSING option to FT.CREATE in conjunction with the ismissing query function with FT.SEARCH. You can also search for existing properties with no value (i.e., empty) using the INDEXEMPTY option with FT.CREATE. Both query types require DIALECT 2. Examples below:
JSON.SET key:1 $ '{"propA": "foo"}'
JSON.SET key:2 $ '{"propA": "bar", "propB":"abc"}'
FT.CREATE idx ON JSON PREFIX 1 key: SCHEMA $.propA AS propA TAG $.propB AS propB TAG INDEXMISSING

> FT.SEARCH idx 'ismissing(@propB)' DIALECT 2
1) "1"
2) "key:1"
3) 1) "$"
   2) "{\"propA\":\"foo\"}"

JSON.SET key:1 $ '{"propA": "foo", "propB":""}'
JSON.SET key:2 $ '{"propA": "bar", "propB":"abc"}'
FT.CREATE idx ON JSON PREFIX 1 key: SCHEMA $.propA AS propA TAG $.propB AS propB TAG INDEXEMPTY

> FT.SEARCH idx '@propB:{""}' DIALECT 2
1) "1"
2) "key:1"
3) 1) "$"
   2) "{\"propA\":\"foo\",\"propB\":\"\"}"

Index limitations 
Schema mapping 
During index creation, you need to map the JSON elements to SCHEMA fields as follows:
Strings as TEXT, TAG, or GEO.
Numbers as NUMERIC.
Booleans as TAG.
JSON array
Array of strings as TAG or TEXT.
Array of numbers as NUMERIC or VECTOR.
Array of geo coordinates as GEO.
null values in such arrays are ignored.
You cannot index JSON objects. Index the individual elements as separate attributes instead.
null values are ignored.
Sortable tags 
If you create an index for JSON documents with a JSONPath leading to an array or to multiple values, only the first value is considered by the sort.
Schema definition
How to define the schema of an index.
Field and type options
Available field types and options.
Geospatial indexing
Options for indexing geospatial data
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Create index with JSON schema
Add JSON documents
Search the index
Index JSON arrays as TAG
Index JSON arrays as TEXT
Limitations
Handling phrases in different array slots:
Index JSON arrays as NUMERIC
Limitations
Index JSON arrays as GEO and GEOSHAPE
Index JSON arrays as VECTOR
Index JSON objects
Field projection
Return specific attributes
Project with JSONPath
Highlight search terms
Aggregate with JSONPath
Index missing or empty values
Index limitations
Schema mapping
Sortable tags
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Redis Open Source 8.0 release notes
Redis Open Source 8.0 release notes.


Redis Open Source 8.0.3 (July 2025) 
Update urgency: SECURITY: There are security fixes in the release.
Security fixes 
(CVE-2025-32023) Fix out-of-bounds write in HyperLogLog commands
(CVE-2025-48367) Retry accepting other connections even if the accepted connection reports an error
New Features 
#14065 VSIM: Add new WITHATTRIBS option to return the JSON attribute associated with an element
Bug fixes 
#14085 A short read may lead to an exit() on a replica
#14092 db->expires is not defragmented
Redis Open Source 8.0.2 (May 2025) 
Update urgency: SECURITY: There are security fixes in the release.
Security fixes 
(CVE-2025-27151) redis-check-aof may lead to stack overflow and potential RCE
Bug fixes 
#14081 Cron-based timers run twice as fast when active defrag is enabled.
Other general improvements 
#14048 LOLWUT improvements for Redis 8.
Redis Open Source 8.0.1 (May 2025) 
Update urgency: MODERATE: Plan an upgrade of the server, but it's not urgent.
Performance and resource utilization improvements 
#13959 Vector sets - faster VSIM FILTER parsing.
Bug fixes 
#QE6083 Query Engine - revert default policy search-on-timeout to RETURN.
#QE6050 Query Engine - @__key on FT.AGGREGATE used as reserved field name preventing access to Redis keyspace.
#QE6077 Query Engine - crash when calling FT.CURSOR DEL while reading from the CURSOR.
Notes 
Fixed incorrect text in the license files.
Redis Open Source 8.0.0 (May 2025) 
This is the General Availability release of Redis Open Source 8.0.
Redis 8.0 deprecates previous Redis and Redis Stack versions.
Stand alone RediSearch, RedisJSON, RedisTimeSeries, and RedisBloom modules are no longer needed as they are now part of Redis.
Major changes compared to 7.4.2 
Name change: Redis Community Edition is now Redis Open Source
License change: licensed under your choice of
(a) the Redis Source Available License 2.0 (RSALv2); or
(b) the Server Side Public License v1 (SSPLv1); or
(c) the GNU Affero General Public License (AGPLv3)
Redis Query Engine and 8 new data structures are now an integral part of Redis 8.
(1) Redis Query Engine, which now supports both horizontal and vertical scaling for search, query, and vector workloads.
(2) JSON, a queryable JSON document data type.
(3) Time series.
(4-8) Five probabilistic data structures: Bloom filter, Cuckoo filter, Count-min sketch, Top-k, and t-digest.
(9) Vector set [preview], a data structure designed for vector similarity search, inspired by sorted set.
These nine components are included in all binary distributions.
See the build instructions for information about building from source code.
New configuration file: redis-full.conf, loads Redis with all components, and contains new configuration parameters for Redis Query Engine and the new data structures.
New ACL categories: @search, @json, @timeseries, @bloom, @cuckoo, @cms, @topk, and @tdigest commands are also included in the existing ACL categories such as @read and @write. See below for information about potentially breaking changes.
More than 30 performance and resource utilization improvements.
A new I/O threading implementation, which enables throughput increase on multi-core environments (set with the io-threads configuration parameter).
An improved replication mechanism that is more performant and robust.
New hash commands: HGETDEL, HGETEX, and HSETEX
For more details, see the release notes for the 8.0-M01, 8.0-M02, 8.0-M03, 8.0-M04, and 8.0-RC1 releases of Redis Open Source.
Binary distributions 
Alpine and Debian Docker images
Install using snap
Install using brew
Install using RPM
Install using Debian APT
Redis 8.0.0 was tested on the following operating systems 
Ubuntu 20.04 (Focal Fossa), 22.04 (Jammy Jellyfish), and 24.04 (Noble Numbat).
Rocky Linux 8.10 and 9.5.
AlmaLinux 8.10 and 9.5.
Debian 11 (Bullseye) and 12 (Bookworm).
macOS 13 (Ventura), 14 (Sonoma), and 15 (Sequoia).
Supported upgrade paths (by replication or persistence) 
From previous Redis versions without modules.
From previous Redis versions with modules (RediSearch, RedisJSON, RedisTimeSeries, RedisBloom).
From Redis Stack 7.2 or 7.4.
Security fixes (compared to 8.0-RC1) 
(CVE-2025-21605) An unauthenticated client can cause an unlimited growth of output buffers
Bug fixes (compared to 8.0-RC1) 
#13966, #13932 CLUSTER SLOTS - TLS port update not reflected.
#13958 XTRIM, XADD - incorrect lag due to trimming stream.
#13931 HGETEX - wrong order of keyspace notifications.
Potentially breaking changes to ACLs 
Note:
The following content is relevant to all Redis distributions (RS, RC, and ROS).
Redis 8 includes Redis Query Engine, as well as JSON, time series, Bloom filter, cuckoo filter, top-k, count-min sketch, and t-digest data types. The integration of these features into Redis also comes with improvements to Redis ACL rules.
Warning:
These ACL changes may introduce breaking changes for some users, which must be analyzed carefully.
Extension to the existing ACL categories 
Before Redis 8, the existing ACL categories @read, @write, @dangerous, @admin, @slow, and @fast did not include commands for the Redis Query Engine and the JSON, time series, and probabilistic data structures.
Starting with Redis 8, Redis includes all Query Engine, JSON, time series, Bloom filter, cuckoo filter, top-k, count-min sketch, and t-digest commands in these existing ACL categories.
As a result:
Existing ACL rules such as +@read +@write will allow access to more commands than in previous versions of Redis. Here are some examples:
A user with +@read access will be able to execute FT.SEARCH.
A user with +@write access will be able to execute JSON.SET.
ACL rules such as +@all -@write will allow access to fewer commands than previous versions of Redis. For example:
A user with +@all -@write will not be able to execute JSON.SET.
Note that the @all category did not change, as it always included all the commands.
Additionally, ACL rules such as +@read +JSON.GET can now be simplified as +@read because JSON.GET is included in the @read category.
Who is affected by this change? 
Users who currently use the Redis Query Engine and/or the JSON, time series, or probabilistic data structures, and use custom ACL rules.
You should reanalyze your ACL rules to make sure they are aligned with your security and access control requirements.
Redis 8 introduces the following data structure and processing engine ACL categories. 
New ACL commands category names
Included commands
search
All Redis Query Engine commands
json
All JSON commands
timeseries
All time series commands
bloom
All Bloom filter commands
cuckoo
All cuckoo filter commands
topk
All top-k commands
cms
All count-min sketch commands
tdigest
All t-digest commands

You can use these new categories in your ACL rules.
Time series notes 
The following time series commands retrieve data from all keys that match a given filter expression: TS.MGET, TS.MRANGE, and TS.MREVRANGE.
There can be a case where a user may have to only some of the matching keys. In such cases, the command’s result is an error message: “current user doesn't have read permission to one or more keys that match the specified filter”.
On the other hand, TS.QUERYINDEX does not require @read access to the keys that match the specified filter, as it accesses only time series metadata (name and labels) and not content (measurements).
Redis Query Engine notes 
The following Redis Query Engine commands may retrieve data from all keys that match the prefixes defined in the index (that is, all indexed documents, per-index):
FT.SEARCH
FT.AGGREGATE (may be followed by FT.CURSOR)
FT.PROFILE
Only ACL users with access to a superset of the key prefixes defined during index creation can create, modify, or read the index. For example, a user with the key ACL pattern h:* can create an index with keys prefixed by h:* or h:p*, but not keys prefixed by h*, k:*, or k*, because these prefixes may involve keys to which the user does not have access.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Redis Open Source 8.0.3 (July 2025)
Security fixes
New Features
Bug fixes
Redis Open Source 8.0.2 (May 2025)
Security fixes
Bug fixes
Other general improvements
Redis Open Source 8.0.1 (May 2025)
Performance and resource utilization improvements
Bug fixes
Notes
Redis Open Source 8.0.0 (May 2025)
Major changes compared to 7.4.2
Binary distributions
Redis 8.0.0 was tested on the following operating systems
Supported upgrade paths (by replication or persistence)
Security fixes (compared to 8.0-RC1)
Bug fixes (compared to 8.0-RC1)
Redis 8 introduces the following data structure and processing engine ACL categories.
Time series notes
Redis Query Engine notes
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Search concepts
Details about query syntax, aggregation, scoring, and other search and query options
Redis Open Source supports the following Redis Query Engine features. This article provides you an overview.
Indexing features 
Secondary indexing
Vector indexing
Index on JSON documents
Full-text indexing of multiple fields in a document
Incremental indexing without performance loss
Document deletion and updating with index garbage collection
Query features 
Multi-field queries
Query on JSON documents
Aggregation
Boolean queries with AND, OR, and NOT operators between subqueries
Optional query clauses
Retrieval of full document contents or only their IDs
Exact phrase search and slop-based search
Numeric filters and ranges
Geo-filtering using Redis geo commands
Vector search
Key and field expiration behavior
Full-text search features 
Prefix-based searches
Field weights
Auto-complete and fuzzy prefix suggestions
Stemming-based query expansion for many languages using Snowball
Support for custom functions for query expansion and scoring (see Extensions)
Unicode support (UTF-8 input required)
Document ranking
Cluster support 
The Redis Query Engine features of Redis Open Source are also available for distributed databases that can scale to billions of documents and hundreds of servers.
Supported platforms 
Redis Open Source is developed and tested on Linux and macOS on x86_64 CPUs.
Atom CPUs are not supported.

Aggregations
Groupings, projections, and aggregation functions
FT.AGGREGATE order of operations
Order of operations for the FT.AGGREGATE command
Autocomplete with Redis
Learn how to use the autocomplete feature of Redis for efficient prefix-based suggestion retrieval.
Stop words
Stop words support
Tokenization
Controlling text tokenization and escaping
Query dialects
Learn how to use query dialects
Query syntax
Learn how to use query syntax
Sorting by indexed fields
Support for sorting query results
Tag fields
How to use tag fields for exact match searches and high-performance filtering
Highlighting
Highlighting full-text results
Key and field expiration behavior
How the Redis Query Engine handles expiring keys and hash fields
Scoring documents
Full-text scoring functions
Stemming
Stemming support
Synonym support
Details on synonym support with Redis Open Source
Spellchecking
Query spelling correction support
Geospatial
Learn how to use geospatial fields and perform geospatial queries in Redis
Phonetic matching
Details about phonetic matching capabilities
Chinese support
Chinese support for searching and querying in Redis Open Source
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Indexing features
Query features
Full-text search features
Cluster support
Supported platforms
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Configuration parameters
Redis Query Engine can be tuned through multiple configuration parameters. Some of these parameters can only be set at load-time, while other parameters can be set either at load-time or at run-time.
Note:
As of Redis 8 in Redis Open Source (Redis 8), configuration parameters for the time series data structure are now set in the following ways:
At load time via your redis.conf file.
At run time (where applicable) using the CONFIG SET command.
Also, Redis 8 persists RQE configuration parameters just like any other configuration parameters (e.g., using the CONFIG REWRITE command).
RQE configuration parameters 
The following table summarizes which configuration parameters can be set at run-time, and compatibility with Redis Software and Redis Cloud.
Parameter name
(version < 8.0)
Parameter name
(version ≥ 8.0)
Run-time
Redis
Software
Redis
Cloud
BG_INDEX_SLEEP_GAP
search-bg-index-sleep-gap
⬜




CONCURRENT_WRITE_MODE
search-concurrent-write-mode
✅
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
CONN_PER_SHARD
search-conn-per-shard
✅




CURSOR_MAX_IDLE
search-cursor-max-idle
✅
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
CURSOR_READ_SIZE
search-cursor-read-size
✅
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
CURSOR_REPLY_THRESHOLD
search-cursor-reply-threshold
✅




DEFAULT_DIALECT
search-default-dialect
✅
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
EXTLOAD
search-ext-load
⬜
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
FORK_GC_CLEAN_THRESHOLD
search-fork-gc-clean-threshold
✅
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
FORK_GC_RETRY_INTERVAL
search-fork-gc-retry-interval
✅
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
FORK_GC_RUN_INTERVAL
search-fork-gc-run-interval
✅
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
FORKGC_SLEEP_BEFORE_EXIT
search-fork-gc-sleep-before-exit
✅




FRISOINI
search-friso-ini
⬜
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
GC_POLICY
There is no matching CONFIG parameter.
⬜
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
GCSCANSIZE
search-gc-scan-size
⬜
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
INDEX_CURSOR_LIMIT
search-index-cursor-limit
⬜




INDEX_THREADS
search-index-threads
⬜




MAXAGGREGATERESULTS
search-max-aggregate-results
✅
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
MAXDOCTABLESIZE
search-max-doctablesize
⬜
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
MAXEXPANSIONS
search-max-expansions
✅




MAXPREFIXEXPANSIONS
search-max-prefix-expansions
✅
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
MAXSEARCHRESULTS
search-max-search-results
✅
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
MIN_OPERATION_WORKERS
search-min-operation-workers
✅




MIN_PHONETIC_TERM_LEN
search-min-phonetic-term-len
✅




MINPREFIX
search-min-prefix
✅
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
MINSTEMLEN
search-min-stem-len
✅
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
MULTI_TEXT_SLOP
search-multi-text-slop
⬜




NO_MEM_POOLS
search-no-mem-pools
⬜




NOGC
search-no-gc
⬜
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
ON_TIMEOUT
search-on-timeout
✅
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
PARTIAL_INDEXED_DOCS
search-partial-indexed-docs
⬜
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
RAW_DOCID_ENCODING
search-raw-docid-encoding
⬜




SEARCH_THREADS
search-threads
⬜




TIERED_HNSW_BUFFER_LIMIT
search-tiered-hnsw-buffer-limit
⬜




TIMEOUT
search-timeout
✅
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
TOPOLOGY_VALIDATION_TIMEOUT
search-topology-validation-timeout
✅




UNION_ITERATOR_HEAP
search-union-iterator-heap
✅
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
UPGRADE_INDEX
search-upgrade-index
⬜
✅ Supported


✅ Flexible & Annual
❌ Free & Fixed
VSS_MAX_RESIZE
search-vss-max-resize
✅




WORKERS_PRIORITY_BIAS_THRESHOLD
search-workers-priority-bias-threshold
⬜




WORKERS
search-workers
✅




OSS_GLOBAL_PASSWORD
Deprecated in v8.0.0. Replace with the masterauth password.
⬜
✅ Supported


❌ Flexible & Annual
❌ Free & Fixed
MT_MODE
Deprecated in v8.0.0. Use search-workers.
⬜




PRIVILEGED_THREADS_NUM
Deprecated in v8.0.0. Use search-workers-priority-bias-threshold.
⬜




WORKER_THREADS
Deprecated in v8.0.0. Use search-min-operation-workers.
⬜




SAFEMODE
Deprecated in v1.6.0. This is now the default setting.
⬜




FORK_GC_CLEAN_NUMERIC_EMPTY_NODES
Deprecated in v8.0.0.
⬜





Note:
Parameter names for Redis Open Source versions < 8.0, while deprecated, will still be supported in Redis 8.

search-bg-index-sleep-gap 
The number of iterations to run while performing background indexing before usleep(1) (sleep for 1 microsecond) is called, ensuring that Redis can process other commands.
Type: integer
Valid range: [1 .. 4294967295]
Default: 100
search-concurrent-write-mode 
If enabled, the tokenization of write queries will be performed concurrently.
Type: boolean
Default: FALSE
search-conn-per-shard 
The number of connections to each shard in a cluster. If 0, the number of connections is set to search-workers + 1.
Type: integer
Valid range: [0 .. 9,223,372,036,854,775,807]
Default: 0
search-cursor-max-idle 
The maximum idle time (in ms) that can be set to the cursor api.
Type: integer
Valid range: [0 .. 9,223,372,036,854,775,807]
Default: 300000
search-cursor-read-size 
Type: integer
Default: 1000
search-cursor-reply-threshold 
The maximum number of replies to accumulate before triggering _FT.CURSOR READ on the shards.
Type: integer
Valid range: [1 .. 9,223,372,036,854,775,807]
Default: 1
search-default-dialect 
The default DIALECT to be used by FT.CREATE, FT.AGGREGATE, FT.EXPLAIN, FT.EXPLAINCLI, and FT.SPELLCHECK. See Query dialects for more information.
Default: 1
search-ext-load 
If present, Redis will try to load an extension dynamic library from the specified file path. See Extensions for details.
Type: string
Default: not set
search-fork-gc-clean-numeric-empty-nodes 
Clean empty nodes from numeric tree.
Type: boolean
Default: TRUE
search-fork-gc-clean-threshold 
The fork GC will only start to clean when the number of uncleaned documents exceeds this threshold, otherwise it will skip this run.
Type: integer
Valid range: [1 .. 9,223,372,036,854,775,807]
Default: 100
search-fork-gc-retry-interval 
Interval (in seconds) in which Redis will retry to run fork GC in case of a failure. This setting can only be combined with the search-gc-policy FORK setting.
Type: integer
Valid range: [1 .. 9,223,372,036,854,775,807]
Default: 5
search-fork-gc-run-interval 
Interval (in seconds) between two consecutive fork GC runs. This setting can only be combined with the search-gc-policy FORK setting.
Type: integer
Valid range: [1 .. 9,223,372,036,854,775,807]
Default: 30
search-fork-gc-sleep-before-exit 
The number of seconds for the fork GC to sleep before exit. This value should always be set to 0 except when testing.
Type: integer
Valid range: [1 .. 9,223,372,036,854,775,807]
Default: 0
search-friso-ini 
If present, load the custom Chinese dictionary from the specified path. See Using custom dictionaries for more details.
Type: string
Default: not set
GC_POLICY 
The garbage collection policy. The two supported policies are:
FORK: uses a forked thread for garbage collection (v1.4.1 and above). This is the default GC policy since v1.6.1 and is ideal for general purpose workloads.
LEGACY: uses a synchronous, in-process fork. This is ideal for read-heavy and append-heavy workloads with very few updates/deletes. Deprecated in v2.6.0.
Note: When GC_POLICY is set to FORK, it can be combined with the search-fork-gc-run-interval and search-fork-gc-retry-interval settings.
Type: string
Valid values: FORK or DEFAULT
Default: FORK
search-gc-scan-size 
The bulk size of the internal GC used for cleaning up indexes.
Type: integer
Valid range: [1 .. 9,223,372,036,854,775,807]
Redis Open Source default: 100
Redis Software default: -1 (unlimited)
Redis Cloud defaults:
Flexible & Annual: -1 (unlimited)
Free & Fixed: 10000
search-index-cursor-limit 
Added in v2.10.8.
The maximum number of cursors that can be opened, per shard, at any given time. Cursors can be opened by the user via FT.AGGREGATE WITHCURSOR. Cursors are also opened internally by the RQE for long-running queries. Once INDEX_CURSOR_LIMIT is reached, any further attempts to open a cursor will result in an error.
Notes:
Caution should be used in modifying this parameter. Every open cursor results in additional memory usage.
Cursor usage should be regulated first by use of FT.CURSOR DEL and/or MAXIDLE prior to modifying INDEX_CURSOR_LIMIT
See Cursor API for more details.
Type: integer
Default: 128
search-max-aggregate-results 
The maximum number of results to be returned by the FT.AGGREGATE command if LIMIT is used.
Type: integer
Valid range: [1 .. 9,223,372,036,854,775,807]
Redis Open Source default: -1 (unlimited)
Redis Software default: -1 (unlimited)
Redis Cloud defaults:
Flexible & Annual: -1 (unlimited)
Free & Fixed: 10000
search-max-doctablesize 
The maximum size of the internal hash table used for storing documents. Note: this configuration option doesn't limit the number of documents that can be stored. It only affects the hash table internal array maximum size. Decreasing this property can decrease the memory overhead in cases where the index holds a small number of documents that are constantly updated.
Type: integer
Valid range: [1 .. 18,446,744,073,709,551,615]
Default: 1000000
search-max-expansions 
This parameter is an alias for search-max-prefix-expansions.
search-max-prefix-expansions 
The maximum number of expansions allowed for query prefixes. The maximum number of expansions allowed for query prefixes. Setting it too high can cause performance issues. If search-max-prefix-expansions is reached, the query will continue with the first acquired results. The configuration is applicable for all affix queries including prefix, suffix, and infix (contains) queries.
Type: integer
Valid range: [1 .. 9,223,372,036,854,775,807]
Default: 200
search-max-search-results 
The maximum number of results to be returned by the FT.SEARCH command if LIMIT is used. Set it to -1 to remove the limit.
Type: integer
Valid range: [1 .. 9,223,372,036,854,775,807]
Redis Open Source default: 1000000
Redis Software default: 1000000
Redis Cloud defaults:
Flexible & Annual: 1000000
Free & Fixed: 10000
search-min-operation-workers 
The number of worker threads to use for background tasks when the server is in an operation event.
Type: integer
Valid range: [0 .. 8192]
Default: 4
search-min-phonetic-term-len 
The minimum length of term to be considered for phonetic matching.
Type: integer
Valid range: [1 .. 9,223,372,036,854,775,807]
Default: 3
search-min-prefix 
The minimum number of characters allowed for prefix queries (for example, hel*). Setting it to 1 can reduce performance.
Type: integer
Valid range: [1 .. 9,223,372,036,854,775,807]
Default: 2
search-min-stem-len 
The minimum word length to stem. Setting it lower than 4 can reduce performance.
Type: integer
Valid range: [2 .. 4,294,967,295]
Redis Open Source default: 4
Redis Software and Redis Cloud default: 2
search-multi-text-slop 
Set the delta that is used to increase positional offsets between array slots for multi text values. This will allow you to control the level of separation between phrases in different array slots; related to the SLOP parameter of FT.SEARCH command.
Type: integer
Valid range: [0 .. 4,294,967,295]
Default: 100
search-no-mem-pools 
Set RQE to run without memory pools.
Type: boolean
Default: FALSE
search-no-gc 
If set to TRUE, garbage collection is disabled for all indexes.
Type: boolean
Default: FALSE
search-on-timeout 
The response policy for queries that exceed the search-timeout setting can be one of the following:
RETURN: this policy will return the top results accumulated by the query until it timed out.
FAIL: will return an error when the query exceeds the timeout value.
Type: string
Valid values: RETURN, FAIL
Default: RETURN
search-partial-indexed-docs 
Added in v2.0.0.
Enable/disable the Redis command filter. The filter optimizes partial updates of hashes and may avoid re-indexing the hash if changed fields are not part of the schema.
The Redis command filter will be executed upon each Redis command. Though the filter is optimized, this will introduce a small increase in latency on all commands.
This configuration is best used with partially indexed documents where the non-indexed fields are updated frequently.
Type: integer
Valid values: 0 (false), 1 (true)
Default: 0
search-raw-docid-encoding 
Disable compression for DocID inverted indexes to boost CPU performance.
Type: boolean
Default: FALSE
search-threads 
Sets the number of search threads in the coordinator thread pool.
Type: integer
search-tiered-hnsw-buffer-limit 
Used for setting the buffer limit threshold for vector tiered HNSW indexes. If Redis is using WORKERS for indexing, and the number of vectors waiting in the buffer to be indexed exceeds this limit, new vectors are inserted directly into HNSW.
Type: integer
Valid range: [0 .. 9,223,372,036,854,775,807]
Default: 1024
search-timeout 
The maximum amount of time in milliseconds that a search query is allowed to run. If this time is exceeded, Redis returns the top results accumulated so far, or an error depending on the policy set with search-on-timeout. The timeout can be disabled by setting it to 0.
Notes:
search-timeout refers to query time only.
Parsing the query is not counted towards search-timeout.
If search-timeout was not reached during the search, finalizing operations such as loading document content or reducers continue.
Type: integer
Value range: [1 .. 9,223,372,036,854,775,807]
Redis Open Source default: 500
Redis Software default: 500
Redis Cloud defaults:
Flexible & Annual: 500
Free & Fixed: 100
search-topology-validation-timeout 
Sets the timeout in milliseconds for topology validation. After this timeout, any pending requests will be processed, even if the topology is not fully connected. A value of 0 means no timeout.
Type: integer
Valid range: [1 .. 9,223,372,036,854,775,807]
Default: 30000
search-union-iterator-heap 
The minimum number of iterators in a union at which the iterator will switch to a heap based implementation.
Type: integer
Valid range: [1 .. 9,223,372,036,854,775,807]
Default: 20
search-upgrade-index 
Relevant only when loading an v1.x RDB file. Specify the argument for upgrading the index. This configuration setting is a special configuration option introduced to upgrade indexes from v1.x RQE versions, otherwise known as legacy indexes. This configuration option needs to be given for each legacy index, followed by the index name and all valid options for the index description (also referred to as the ON arguments for following hashes) as described on FT.CREATE command page.
Type: string
Default: there is no default for index name, and the other arguments have the same defaults as with the FT.CREATE command.
Example
search-upgrade-index idx PREFIX 1 tt LANGUAGE french LANGUAGE_FIELD MyLang SCORE 0.5 SCORE_FIELD MyScore
    PAYLOAD_FIELD MyPayload UPGRADE_INDEX idx1

Notes:
If the RDB file does not contain a legacy index that's specified in the configuration, a warning message will be added to the log file, and loading will continue.
If the RDB file contains a legacy index that wasn't specified in the configuration, loading will fail and the server won't start.
search-vss-max-resize 
Added in v2.4.8.
The maximum memory resize (in bytes) for vector indexes. The maximum memory resize (in bytes) for vector indexes. This value will override default memory limits if you need to allow for a large BLOCK_SIZE.
Type: integer
Valid range: [0 .. 4,294,967,295]
Default: 0
search-workers-priority-bias-threshold 
The number of high priority tasks to be executed at any given time by the worker thread pool before executing low priority tasks. After this number of high priority tasks are being executed, the worker thread pool will execute high and low priority tasks alternately.
Type: integer
Valid range: [1 .. 9,223,372,036,854,775,807]
Default: 1
search-workers 
The number of worker threads to use for query processing and background tasks.
Type: integer
Valid range: [0 .. 8192]
Default: 0
Set configuration parameters at module load-time (deprecated) 
These methods are deprecated beginning with Redis 8.
Setting configuration parameters at load-time is done by appending arguments after the --loadmodule argument when starting a server from the command line, or after the loadmodule directive in a Redis config file. For example:
In redis.conf:
loadmodule ./redisearch.so [OPT VAL]...

From the Redis CLI, using the MODULE LOAD command:
127.0.0.6379> MODULE LOAD redisearch.so [OPT VAL]...

From the command line:
$ redis-server --loadmodule ./redisearch.so [OPT VAL]...

Set configuration parameters at run-time (for supported parameters, deprecated) 
These methods are deprecated beginning with Redis 8.
RQE exposes the FT.CONFIG endpoint to allow for the setting and retrieval of configuration parameters at run-time.
To set the value of a configuration parameter at run-time (for supported parameters), simply run:
FT.CONFIG SET OPT1 VAL1

Similarly, you can retrieve current configuration parameter values using:
FT.CONFIG GET OPT1

FT.CONFIG GET *

Values set using FT.CONFIG SET are not persisted after server restart.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
RQE configuration parameters
search-bg-index-sleep-gap
search-concurrent-write-mode
search-conn-per-shard
search-cursor-max-idle
search-cursor-read-size
search-cursor-reply-threshold
search-default-dialect
search-ext-load
search-fork-gc-clean-numeric-empty-nodes
search-fork-gc-clean-threshold
search-fork-gc-retry-interval
search-fork-gc-run-interval
search-fork-gc-sleep-before-exit
search-friso-ini
GC_POLICY
search-gc-scan-size
search-index-cursor-limit
search-max-aggregate-results
search-max-doctablesize
search-max-expansions
search-max-prefix-expansions
search-max-search-results
search-min-operation-workers
search-min-phonetic-term-len
search-min-prefix
search-min-stem-len
search-multi-text-slop
search-no-mem-pools
search-no-gc
search-on-timeout
search-partial-indexed-docs
search-raw-docid-encoding
search-threads
search-tiered-hnsw-buffer-limit
search-timeout
search-topology-validation-timeout
search-union-iterator-heap
search-upgrade-index
search-vss-max-resize
search-workers-priority-bias-threshold
search-workers
Set configuration parameters at module load-time (deprecated)
Set configuration parameters at run-time (for supported parameters, deprecated)
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC


