Perfect. I’ll build a full development plan to complete the auto-booking feature for Parker Flight using world-class enterprise standards. This plan will leverage your sophisticated LaunchDarkly and CI/CD setup, and introduce the best infrastructure and coding practices for a GDPR- and US-compliant MVP focused on the US market.

I’ll organize the plan across phases—foundation, functionality, reliability, security/compliance, observability, and rollout—highlighting tooling, standards, and how Warp AI should structure the work.

I’ll let you know once the plan is ready.


# Development Plan for the Warp AI Application (MVP)

## Overview

Warp AI’s platform is poised for a **world-class MVP release**. We already have a strong foundation with two key components:

* **Feature Flag System (LaunchDarkly)** – A comprehensive LaunchDarkly integration is in place, enabling sophisticated feature gating and progressive delivery of new features.
* **CI/CD Pipeline** – A multi-stage, production-grade CI/CD pipeline (via GitHub Actions) automates testing, security scanning, building, and zero-downtime deployments through staging and production.

Building on this foundation, this development plan outlines how to **complete the application’s development** with best practices in mind. We will ensure high quality, scalability, security, and compliance (GDPR and U.S. privacy laws) from day one. The plan is organized into focus areas: feature management, CI/CD & DevOps, security & compliance, infrastructure, quality assurance, and monitoring. Each area includes objectives and best-practice approaches to guide Warp AI’s development team in delivering an enterprise-grade product.

## Goals and Guiding Principles

Our primary goals are to **deliver the MVP for U.S. users** with exceptional quality and prepare the platform for future growth (including eventual EU roll-out). Key guiding principles include:

* **Privacy by Design**: We embed data protection and privacy considerations into the architecture from the start, following “data protection by design and by default”. This means minimizing personal data usage, securing it thoroughly, and ensuring user rights (like data deletion) are respected.
* **Enterprise-Grade Security & Compliance**: All development will adhere to strong security practices (encryption, least privilege, secure coding) and meet regulatory requirements (GDPR readiness, CCPA for California, etc.).
* **Continuous Delivery & Quality**: Leverage our CI/CD pipeline to deliver incremental changes quickly and reliably. Every code change will go through automated tests, security scans, and code review to maintain high quality.
* **Progressive Delivery & Agility**: Use feature flags and progressive rollout strategies to release features safely. This decouples deploys from releases, allowing gradual rollouts, A/B tests, and instant rollbacks if needed. The development process remains agile, enabling frequent but low-risk releases of new functionality.
* **Scalability and Performance**: Design for scale from the MVP stage – ensure the app can handle increasing load, and build with future optimizations (caching, auto-scaling, etc.) in mind.
* **Observability and Feedback**: Implement robust monitoring, logging, and alerting so we have full insight into system health. Quick detection of issues and user feedback loops will enable continuous improvement.

With these principles, Warp AI’s development will not only **meet MVP needs** but also set the stage for a **scalable, secure, and compliant platform** trusted by users. Below, we detail the development plan by focus area.

## 1. Feature Flags & Release Strategy

**Current State:** Warp AI already has an extensive LaunchDarkly feature flag implementation, covering both server-side (Node.js SDK) and client-side (React SDK with hooks). Current flags include: `wallet_ui`, `profile_ui_revamp`, `personalization_greeting`, `flight-search-advanced-filtering`, `flight-search-price-optimization`, and `duffel_live_enabled`. These flags gate major new features (e.g. new wallet interface, profile overhaul, advanced flight search capabilities, integration with Duffel API) and support context-based targeting (by user, region, subscription) and gradual percentage rollouts.

**Plan:** We will leverage and enhance this feature flag system to manage feature releases safely:

* **Progressive Rollouts:** Continue using LaunchDarkly to perform canary releases and gradual percentage rollouts for new features. For each new feature or change, start by toggling it “off” in production (dark launching), then enable for internal team or beta users, then incrementally ramp up to more users. This controlled rollout allows monitoring in real conditions and quick mitigation if issues arise.
* **Targeting & A/B Testing:** Utilize the built-in targeting rules to segment flag rollouts by user attributes (e.g. enable certain features only for premium subscribers or specific regions). Our LaunchDarkly setup supports A/B tests and experiments – we will work with product managers to run experiments (for example, testing the impact of the `flight-search-price-optimization` feature on conversion rates). This data-driven rollout aligns with best practices for feature experimentation and gradual delivery.
* **Kill-Switches & Safe Rollback:** Treat each feature flag as a potential kill-switch. In case a new feature causes problems (e.g. high error rates or user confusion), we can quickly disable that flag to instantly remove the feature without a full deployment rollback. This ensures other unaffected features remain live while isolating the issue. Our CI/CD pipeline also prepares automated rollback artifacts, but using a feature-flag kill-switch is an even faster first line of defense.
* **Flag Management Best Practices:** To maintain an orderly flag system, we will document each flag’s purpose, rollout plan, and owners. Good documentation prevents accidental misuse or deletion of important flags. We’ll also enforce consistent naming conventions (e.g. `feature.category_description`) so that flags are self-explanatory and easy to search. Each flag will be tagged (e.g. “permanent”, “experiment”, “release”) to clarify its lifespan.
* **Flag Lifecycle and Cleanup:** After a feature has been fully launched to 100% of users and deemed stable, we will remove the now-redundant flag from the codebase. This avoids accumulating **“flag debt”** – an overgrowth of stale flags that complicates code. A periodic review (e.g. each sprint or release cycle) will identify flags that can be retired. Removing obsolete flags keeps the configuration clean and ensures we only maintain flags that actively provide value.

By rigorously following these practices, Warp AI can **safely accelerate release cycles**. Feature flags will continue to de-risk deployments (allowing smaller incremental changes and quick toggles) – a known key to reducing release risk. Our approach ensures that new enhancements reach users quickly, with the ability to monitor and control their impact in real-time.

## 2. CI/CD Pipeline and DevOps

**Current State:** Warp AI’s CI/CD pipeline is highly mature and automated. We have a GitHub Actions workflow with six stages: *test* → *security scan* → *build* → *deploy-staging* → *deploy-production* → *rollback*. There is also a specialized production deployment workflow with extra validations. Key features include:

* **Automated Testing:** Comprehensive test suites (unit tests, integration tests, E2E tests) run on every commit/PR. TypeScript type checking and ESLint ensure code quality. We also gather test coverage metrics (via Codecov) to track how well our tests cover the codebase.
* **Security Scanning:** The pipeline integrates security checks – for example, Trivy scans our Docker images for vulnerabilities, and `npm audit` flags any vulnerable dependencies. This “security-first” approach in CI/CD is critical for enterprise-grade software.
* **Infrastructure as Code & Config:** Deployments pull configuration from secure sources (AWS Secrets Manager for secrets, environment-specific config files) so that no sensitive data is hard-coded. We also validate infrastructure pieces (e.g. ensuring AWS KMS keys are available for encryption, Supabase services are up) before deploying.
* **Staging & Production Parity:** We deploy first to a staging environment that mirrors production. Staging allows final validation with production-like data. Only after passing smoke tests and possibly a manual approval do we promote the release to production – ensuring a high degree of confidence. Both front-end (deployed to Vercel) and back-end components (Dockerized Node services, Supabase Edge Functions) go through this staged rollout.
* **Zero-Downtime Deployment:** The pipeline uses blue-green deployment strategies for back-end services, so new versions spin up alongside the old. Production traffic is shifted gradually or during a brief low-traffic window, with health checks confirming the new release is functioning before fully cutting over. This guarantees minimal or no downtime during releases.
* **Monitoring & Auto-Rollback:** After deployment, automated smoke tests and health checks run. If any critical check fails (or if alert thresholds are tripped), the pipeline can trigger the rollback workflow to restore the last known good version. Deployment notifications (e.g. via Slack) keep the team informed of status and outcomes, so any issues are immediately visible.

**Plan:** We will maintain and enhance this CI/CD setup to ensure **fast, reliable, and secure releases**:

* **Continuous Integration Discipline:** Developers will merge code to the main branch frequently and in small increments. Frequent commits and merges mean the CI system can catch integration issues early, and it aligns with CI/CD best practices (“think big, act small” commits). We’ll enforce that all tests and checks pass before any code is merged (branch protection rules), thus maintaining a green main branch.
* **Pipeline Optimization:** We will monitor CI pipeline performance and optimize as needed – for example, caching dependencies, running jobs in parallel, and using build artifacts efficiently. One best practice we follow is to **build artifacts once** (e.g. a production-ready Docker image or compiled bundle) and reuse the same artifact through staging and production deployments. This ensures consistency (the code that passed tests is exactly what goes to prod) and speeds up the pipeline.
* **Enhanced Security Scans:** In addition to Trivy and `npm audit`, we plan to integrate **static application security testing (SAST)** and dependency scanning into CI. For example, enabling GitHub Advanced Security’s CodeQL scans or integrating a tool like SonarQube will help catch security issues in code (e.g. SQL injection, unsafe use of data) before they hit production. We will also schedule regular dependency updates and scans so that vulnerabilities are patched promptly.
* **Infrastructure as Code & Config Management:** We’ll consider managing infrastructure (AWS resources, etc.) with **Infrastructure-as-Code (IaC)** tools (like Terraform or CloudFormation) to maintain reproducible environments and easy environment setup for new developers. All environment-specific configurations will be stored securely and applied via the pipeline, keeping deployments consistent across dev/staging/prod.
* **Progressive Delivery Integration:** Combine CI/CD with our LaunchDarkly flags to achieve true **progressive delivery**. This means even after deploying to production, we might keep new code paths disabled by default and gradually enable via feature flags as described. Our CI process will include steps to set or verify flag statuses in test environments (e.g. for automated E2E tests, ensure certain flags are on). We’ll also automate some rollout actions – for instance, using LaunchDarkly’s API or webhooks to orchestrate canary releases as part of a release runbook.
* **Rollback Drills and Disaster Recovery:** Periodically, we will conduct simulated rollback exercises to ensure the team is confident in using the rollback pipeline and that it remains effective. Similarly, we’ll prepare disaster recovery plans (e.g. how to recover if a deployment and rollback both fail, how to restore from backups if data issues occur). Practicing these scenarios ensures we can meet enterprise uptime requirements even under unexpected failures.
* **Continuous Improvement:** Treat the pipeline as living code – we will gather metrics on build/deploy times, failure rates, flaky tests, etc. and continuously refine the process. Our culture encourages blameless post-mortems for any incident or failed deployment, with lessons feeding back into improving automation or tests. The entire team (developers, DevOps, QA) is involved in CI/CD improvements, reflecting a DevOps culture of shared responsibility.

By doubling down on our CI/CD and DevOps excellence, Warp AI ensures **rapid yet stable releases**. Our approach aligns with industry best practices for CI/CD (frequent commits, automated testing, security-first mindset, artifact reuse, etc.) and positions us to deliver updates to users with high confidence and low risk.

## 3. Security & Compliance (GDPR, CCPA, Data Protection)

**Objective:** Make the application **secure by design** and fully compliant with data protection laws. Although our MVP targets U.S. users only, we will build compliance into the product from the start, anticipating future expansion to Europe. This includes adherence to the EU’s GDPR and relevant U.S. privacy regulations (e.g. California’s CCPA), as well as general best practices for data security.

**Security Best Practices:**

* **Data Encryption:** All sensitive data (personally identifiable information, payment details, etc.) will be encrypted both in transit and at rest. We already utilize AWS KMS-managed keys for encryption; we’ll ensure all databases (e.g. Supabase Postgres) and data stores use strong encryption (AES-256) at rest. In transit, we enforce TLS 1.2+ for all client-server and server-server communications. End-to-end encryption practices greatly reduce risk in case of a breach. Even if attackers intercept data, properly encrypted data appears as gibberish.
* **Secure Authentication & Authorization:** Implement robust authentication (likely Supabase Auth or similar) with options for MFA. Follow the principle of least privilege for user roles and internal services – e.g., ensure that any API keys, database credentials, and third-party integrations have minimal necessary permissions. Secrets are stored in AWS Secrets Manager and never in code. We’ll also add checks in CI to prevent committing secrets accidentally.
* **Secure Coding & Testing:** Developers will be trained in secure coding guidelines (to prevent XSS, SQL injection, etc.) and use frameworks’ security features (like parameterized queries, output encoding). Our testing will include security test cases – for example, attempt common attacks on the web app (CSRF, XSS, SSRF, etc.) to ensure defenses hold. We might incorporate a Dynamic Application Security Testing (DAST) tool or periodic penetration testing by a third party as the product matures.
* **Infrastructure Security:** Harden all servers and services. For instance, Docker containers will be based on minimal base images and regularly updated to patch OS vulnerabilities. We’ll employ AWS security groups or cloud firewalls to restrict network access to only what's needed. If using Vercel and Supabase, we’ll ensure proper security settings in those platforms (e.g., Supabase Row Level Security for data, network restrictions on admin access, etc.). Logging and monitoring will also include security events (e.g., auth failures, odd traffic patterns) with alerts for suspicious activities.

**GDPR Compliance Measures:** (to be implemented even if not immediately needed for US-only launch, to embed privacy by design)

* **Data Inventory & Minimization:** Conduct a data audit to document all personal data we collect and process. Ensure we **collect only the minimum data necessary** for the app’s functionality. For example, if we don’t truly need a user’s date of birth or address for the MVP, we won’t ask for it. Limiting data collection significantly reduces compliance scope and breach risk. We’ll also set data retention policies – the EU recommends keeping personal data only for the shortest duration needed. We will not retain user data indefinitely “just because”; instead, define retention (e.g. log data purged after X months) and implement automated deletion for old data.
* **User Consent and Transparency:** Although our MVP is U.S.-only, it’s good practice to clearly inform users about data usage. We will prepare a comprehensive **Privacy Policy** that details what data we collect, how we use and store it, any third parties involved, cookie usage, and users’ rights. This policy will be easily accessible (likely during signup and via the app menu). For GDPR readiness, we ensure the policy is written in clear language (no jargon) and covers all required disclosures. If/when we include cookies or tracking (e.g. analytics), we will implement a cookie consent banner for EU users in the future, and possibly offer similar opt-outs for U.S. users to be transparent.
* **User Data Rights:** Implement mechanisms to support user rights under GDPR/CCPA. For instance, **Right to Erasure** (“right to be forgotten”) means a user can request deletion of their data. We will build a process (perhaps self-service in the app) to delete a user’s account and personal data upon request. Similarly, support data access requests – users should be able to request a copy of their data we hold. Even if not required by U.S. law for MVP, building this now demonstrates privacy-forward design and makes future compliance easier.
* **Third-Party Data Processors:** Identify all third-party services that handle personal data in our system – e.g. LaunchDarkly (may receive user context keys), Supabase (stores user accounts and profiles), payment processors, etc. For each, ensure they offer a **Data Processing Agreement (DPA)** and comply with GDPR. We will sign DPAs with these providers, which contractually bind them to protect data according to GDPR standards. (LaunchDarkly and Supabase both cater to global clients and offer GDPR compliance features and DPAs.) We will vet new third-party integrations for privacy stance – any vendor must have strong data protection practices.
* **Data Protection Officer & Records:** Given our size (MVP stage), a formal DPO might not be legally required. However, we will assign someone (likely the CTO or a security lead) to be responsible for data protection compliance. This person will maintain records of data processing activities and ensure we follow through on GDPR obligations. If/when we expand to EU markets, we’ll also appoint an EU representative if needed.
* **Privacy by Design in Features:** For every new feature, we will incorporate a **Data Protection Impact Assessment** as needed – essentially, evaluating how the feature might collect or use personal data and mitigating any risks (through minimization, anonymization, additional security, etc.). Privacy isn’t an afterthought but part of our design criteria. For example, if we introduce a personalization feature that uses user behavior data, we’ll ensure it’s strictly necessary and perhaps allow users to opt out of personalized tracking (aligning with future GDPR/CCPA “do not sell/share” opt-out requirements).

**U.S. Compliance (CCPA and beyond):**

* **CCPA Considerations:** The California Consumer Privacy Act applies to certain businesses handling California residents’ data (thresholds include \$25M revenue or 100k consumers data, etc.). While Warp AI as an MVP may be below these thresholds, we aim to implement **CCPA best practices** early. This overlaps with GDPR measures: providing a clear privacy policy, letting users request data deletion or information, and giving a “Do Not Sell My Personal Info” option (though we do not plan to sell data). We will include a section in our privacy policy addressing California residents’ rights, and set up an email or form for CCPA requests, even if optional at first. Demonstrating respect for user privacy builds trust and prepares us for growth into a larger userbase.
* **Other U.S. Regulations:** We will comply with CAN-SPAM Act for any emails (i.e., clear unsubscribe options in marketing emails), COPPA if at any point we allow children under 13 (currently not planned), and Americans with Disabilities Act (ADA) for accessibility (addressed separately below). If our app handles payments, we ensure PCI DSS compliance via our payment provider. Essentially, no U.S. law should be overlooked even as we focus on GDPR; we’ll consult legal experts for a thorough compliance check before launch.

By **integrating security and privacy into development**, Warp AI will not only avoid legal pitfalls but also gain a competitive edge. Users and enterprise customers are more likely to trust a platform that clearly protects their data. Our compliance efforts, such as minimizing data collection and encrypting data throughout, directly contribute to security by reducing the fallout from any breach. Moreover, having response plans for security incidents (breach notification procedures within 72 hours as required by GDPR) ensures we are prepared for the worst-case scenarios. In summary, this plan makes Warp AI **secure and compliant by design**, aligning with both legal standards and ethical best practices in software development.

## 4. Infrastructure & Architecture

**Objective:** Ensure the application’s architecture and infrastructure can support our **current needs and future growth**, following best-in-class architectural practices. We will use modern, scalable cloud infrastructure and follow principles like high availability, fault tolerance, and cost-efficiency. Additionally, we remain open to integrating new infrastructure components if they solve problems or improve the system’s robustness.

**Current Stack Overview:** Warp AI’s stack includes a React front-end (deployed on Vercel), a Node.js back-end (running in Docker, likely on AWS or a container platform), and Supabase (PostgreSQL database, authentication, and Edge Functions for serverless logic). We also integrate with third-party APIs (e.g., Duffel for flight bookings) and use LaunchDarkly for feature flag management. This cloud-native approach allows us to iterate quickly.

**Plan for Architecture & Infrastructure:**

* **Scalable Cloud Hosting:** Continue leveraging cloud services for scalability. Our front-end on Vercel auto-scales to meet traffic demands, and our back-end can be hosted on AWS (using ECS/EKS for containers or another serverless platform). Ensure that the production deployment is multi-zone for high availability – e.g., if using AWS ECS, run tasks in multiple availability zones; if using serverless (Supabase Edge Functions or Vercel serverless), those are inherently managed across regions. For the database (Supabase Postgres), consider enabling high-availability mode or read replicas if supported, and schedule regular backups. We might not need multi-region deployment at MVP, but our design should not preclude adding regions later (especially if expanding to EU users, a European hosting region might be needed for GDPR data locality).
* **Microservices and Modularity:** As features grow, keep an eye on modularizing the architecture. For now, a “modular monolith” or a small set of services is manageable. But we will design our codebase with clear domain boundaries (e.g. separate modules for “Flights Search,” “Booking/Payments,” “User Profile”) and well-defined APIs between them. This way, if we need to split out a microservice (say, a dedicated service for the flight search engine or for payment processing), it’s a straightforward evolution. The use of Supabase Edge Functions suggests we are already isolating some functionality as serverless functions – we’ll continue to use that for tasks that fit serverless (like scheduled jobs, webhooks processing, etc.).
* **API Design and Integration:** Ensure our internal and external API usage follows best practices. For any internal APIs (between front-end and back-end), use REST or GraphQL with proper versioning and input validation. For third-party APIs like Duffel, implement circuit breakers and graceful degradation – e.g., if the Duffel service is down or slow, our app should handle it (perhaps by showing an error message to users or retrying later) rather than crashing. We can use feature flags (like `duffel_live_enabled`) to toggle integration points – if Duffel has an outage, we could quickly switch off related features via the flag to maintain core app stability.
* **New Infrastructure Considerations:** We remain open to adding infrastructure that enhances our platform. Some possibilities:

  * *Content Delivery Network (CDN):* To improve performance for users across the U.S. (and eventually globally), use a CDN for serving static assets (Vercel has this built-in for front-end). As we add user-generated content or larger media, a CDN (or Supabase Storage’s CDN capabilities) will be employed.
  * *Search/Indexing Service:* If our flight search needs advanced querying or if we introduce search for other data, we might integrate a search service (like Elasticsearch or an Algolia service).
  * *Caching Layer:* For frequently accessed data (flight listings, user preferences), consider an in-memory cache like Redis. This can speed up the app and reduce load on the DB. We would integrate Redis (possibly AWS ElastiCache or Upstash for serverless Redis) if performance tests show a benefit.
  * *Message Queue/Event Bus:* As the system grows, a message queue (like AWS SQS, RabbitMQ, or a Kafka service) might be introduced to decouple components and handle asynchronous tasks (e.g., sending confirmation emails, processing analytics events). For MVP, we might not need it, but we will design modules to allow plugging in a queue easily later.
  * *Infrastructure Monitoring:* Deploying an **APM (Application Performance Monitoring)** tool such as Datadog, New Relic, or an open-source alternative (like Prometheus/Grafana stack) can be considered part of infrastructure. This would give deep visibility into performance (response times, database query timings, external API calls) and help in capacity planning.
* **High Availability & Fault Tolerance:** Our plan includes strategies to avoid single points of failure. For example, ensure multiple instances for each service in production (so if one instance goes down, others handle traffic). Use health checks and auto-restart policies for containers. Implement graceful error handling at the application level – e.g., if the database is momentarily unreachable, the app should queue requests or show a friendly error rather than just crash. We’ll also use timeouts and retries for network calls to handle transient issues gracefully.
* **Cost Management:** As an enterprise-grade system, efficiency is important. We will monitor infrastructure usage (CPU/memory of servers, database load, etc.) and right-size our resources. Utilize auto-scaling to handle spikes but also scale down in low usage periods to save cost. Using serverless functions for certain tasks helps cost to scale with usage. We’ll also set budgets/alerts on cloud spending to catch any unexpected cost overruns (e.g. a bug causing an infinite loop and cloud function spam).

Overall, our infrastructure plan is about being **cloud smart**: using managed services where possible to reduce ops burden, but also ensuring we have the controls to meet enterprise requirements (security, reliability, performance). By designing the architecture with modularity and scalability in mind, Warp AI can smoothly grow from MVP to a much larger system without needing a drastic overhaul. Each new infrastructure component will be evaluated for its ROI and introduced when it becomes necessary to maintain our high standards.

## 5. Testing & Quality Assurance

**Objective:** Uphold a **culture of quality** through rigorous testing practices and QA processes. While our CI pipeline already runs automated tests, we will expand our testing approach to cover all aspects of the application (functionality, performance, security, usability) and ensure that best practices are followed at every stage of development.

**Testing Strategy:**

* **Automated Test Coverage:** Continue to invest in a broad automated test suite. For unit tests, ensure critical business logic (e.g. fare calculations, booking workflows) has near-100% coverage. For integration tests, simulate interactions between components (e.g., test a full flight search query hitting our backend and getting expected results from the Duffel API stubbed). E2E tests will run against the staging environment, using tools like Playwright or Cypress to simulate user flows (searching a flight, adding to wallet, etc.). We will maintain these tests as features evolve. The CI pipeline’s test stage will remain the gatekeeper for code quality – no code goes live without passing all tests.
* **Test Environments & Data:** Utilize ephemeral test environments if possible (e.g., Vercel and Supabase allow spinning up branches or test instances). For each pull request, we could create a temporary environment for QA to verify new features in isolation. Manage test data carefully: we’ll have seeded databases for testing with fake data (so we don’t use any production data in tests, aiding compliance too).
* **Performance Testing:** As part of QA, incorporate performance and load testing. We have used Apache Bench for basic load tests; we will expand this using tools like JMeter or k6 to simulate realistic load scenarios. For example, simulate hundreds of concurrent flight searches and bookings to see how the system holds up. This will help identify bottlenecks (maybe the flight search algorithm or an external API rate limit). Performance budgets will be set (e.g., search response should be under 2 seconds at X load) and we’ll optimize the code or scale infrastructure to meet these goals. Doing this before launch ensures a smooth user experience even under heavy usage.
* **Accessibility and Usability Testing:** Ensuring compliance also means the app should be accessible (WCAG 2.1 standards) and user-friendly. We will conduct accessibility audits on the front-end (using tools like Lighthouse or axe-core to catch issues like poor screen reader support or insufficient color contrast). Any issues will be fixed to make the app usable by people with disabilities, aligning with ADA guidelines. Additionally, do usability testing sessions (even if informal) to get feedback on the new UI components (wallet UI, profile revamp) – this isn’t strictly “compliance,” but it’s a best practice to refine user experience and reduce friction.
* **Manual QA and UAT:** In addition to automation, our QA team (or designated testers) will perform manual testing focusing on exploratory and edge-case scenarios that automated tests might miss. Before each release, do a structured **User Acceptance Testing (UAT)** session in the staging environment with product stakeholders. This helps catch any UX issues or last-minute bugs. We’ll use feature flags to enable or disable features during UAT easily, allowing testers to compare new vs old functionalities.
* **Regression Testing:** Every new feature or code change has the potential to affect existing functionality. We will maintain a regression test suite (largely automated) that covers all core user journeys. Before each production deployment (especially major ones), run full regression tests either in CI or in staging to ensure nothing has broken unexpectedly. Our feature flag approach helps here too – since new features can be off by default, regression tests can run with all flags off (production state) and then with flags on (new features) to compare outcomes.
* **QA in CI/CD Workflow:** We will integrate QA steps into the pipeline where feasible. For instance, after deploying to staging, the pipeline could trigger a suite of smoke tests or run a headless browser to simulate basic user actions. We’ll also incorporate linting and static analysis for quality (already doing TS and ESLint) to maintain code consistency and catch potential issues early. By the time code is deployed, it has passed through multiple gates of quality checks.

By treating quality as everyone’s responsibility and using a mix of **automated and manual testing techniques**, Warp AI will maintain a high standard of reliability and polish. This multi-layered QA approach – unit tests, integration tests, performance tests, accessibility checks, and UAT – ensures that we catch issues in-house before our users do. Ultimately, robust QA processes save time and protect our reputation, as we deliver a smooth, bug-free experience to end users.

## 6. Monitoring, Logging, and Observability

**Objective:** Achieve comprehensive **observability** into the application’s behavior in production. We want to detect issues early, diagnose problems quickly, and gather metrics that guide performance tuning and product decisions. In line with enterprise standards, we will implement a monitoring and logging stack that covers the **three pillars of observability: logs, metrics, and traces**.

**Monitoring & Alerting:**

* **Application Metrics:** We will collect key metrics from all parts of the system – e.g., request throughput, response times, error rates for the API, user interactions on front-end, database query performance, external API latency (Duffel response times), etc. These metrics will be visualized on dashboards (using tools like Datadog, Grafana Cloud, or New Relic). We will define SLOs (Service Level Objectives) such as “95% of flight search requests complete under 2s” and monitor these. Alerts will be set up on critical metrics: for instance, alert the on-call developer if error rate spikes above a threshold or if response time slows beyond a point. This proactive alerting ensures we’re immediately aware of production issues and can respond before users are severely impacted.
* **Centralized Logging:** Implement a centralized log management solution. Instead of logs just sitting on individual servers, all logs (from front-end, back-end, and possibly Supabase logs) should stream to a central system (like Elastic Stack/ELK, Datadog Logs, or CloudWatch). We will log important events with context – including errors, warnings, as well as key business events (e.g., booking success/failure, payment transactions). Logs need to be structured (JSON format with consistent fields for user ID, request ID, etc.) to allow efficient searching and correlation. This way, if a problem occurs (e.g., a user reports a bug at 3:00 PM), we can easily query logs around that time/user to diagnose. We also ensure sensitive data is **never logged** (to stay compliant); logs may contain user IDs or feature flag states but not passwords or personal details.
* **Distributed Tracing:** We will introduce tracing to follow a request’s path through our system. Using OpenTelemetry or an APM solution, instrument the code so that when a user triggers an action, we can trace it from the front-end, through the Node backend, to the database or external API and back. This helps identify bottlenecks – e.g., if a transaction is slow, the trace might show it spent 500ms in the Duffel API call. Tracing is invaluable for debugging complex issues in a distributed architecture, giving us insight into where time is spent or where failures occur across service boundaries. We will start with tracing key flows like “search flights” and “book flight”, and gradually expand.
* **Real-Time Monitoring of Feature Rollouts:** Given our heavy use of feature flags, we will also monitor the impact of enabling any flag. For example, when we ramp up the `flight-search-advanced-filtering` flag to 50% of users, we will watch metrics like search API response time and conversion rate. LaunchDarkly offers some flag analytics; we can integrate those or simply use our metrics dashboards to compare before/after. If any anomaly is detected, we can pause or rollback the rollout. This tight feedback loop for feature releases ensures safe progressive delivery.
* **User Experience Monitoring:** In addition to backend metrics, consider front-end monitoring. Use a tool to capture front-end errors (e.g., Sentry for error tracking in React) so that JavaScript errors in users’ browsers are reported to us. Also track front-end performance (Time to Interactive, API call timings) to catch if certain users (maybe on a certain browser or network) have a degraded experience. This client-side observability complements server-side monitoring for a full picture.

**Incident Response:**

* Establish an on-call rotation for engineers to respond to after-hours alerts (for enterprise readiness). Define clear runbooks for common incidents – e.g., what to do if the database CPU spikes, or if the external API is down (which feature flag to toggle, etc.). Team members will be trained on using the monitoring tools to quickly pinpoint issues.
* We will also implement a status page (even if internal at first) to track system status. This can be user-facing in the future to communicate outages or maintenance.

By building strong observability now, we ensure that as our user base grows, we can maintain reliability. **Logs, metrics, and traces** together give us a 360° view of the system, enabling data-driven improvements and rapid troubleshooting. This operational maturity is a hallmark of enterprise-grade services and will help Warp AI deliver on its uptime and performance promises.

## 7. Performance & Scalability

**Objective:** Proactively address performance and scalability so that the application remains fast and stable as usage grows. We will continuously optimize our code and queries, and use scalable infrastructure techniques to handle increasing load without compromising user experience.

* **Capacity Planning:** Based on MVP projections (number of users, expected daily searches/bookings), we’ll estimate the load on each component (front-end, back-end, database). Even if MVP usage is modest, we plan for 10x growth scenarios. For example, if we expect 1000 users initially, we’ll ask: can the system handle 10,000 users? This guides us to identify any current bottlenecks (perhaps certain queries or processes that wouldn’t scale linearly). Using the metrics from our monitoring setup, we’ll observe resource utilization and tune limits (like adjust the number of Node worker threads or DB connection pool size) accordingly.
* **Database Optimization:** Since Supabase uses Postgres, we will analyze query performance and add indexes where needed. For instance, if flight search queries filter by certain columns (destination, date, price), ensure we have proper indexing on those fields. Use EXPLAIN plans to optimize any slow query. If high read traffic becomes an issue, consider read replicas or caching layers for hot data (as noted in Infrastructure section). We’ll also enforce efficient data models – avoid overly complex joins or large data transfers. Partitioning large tables or archiving old data are strategies we might use as data scales.
* **Backend Performance:** Profile the Node.js backend to find slow spots. This could involve using profilers or APM to see if CPU or memory heavy tasks exist. We will optimize algorithms (for example, if we have any custom price optimization logic, ensure it’s efficient). Also manage external calls smartly: calls to third-party APIs should be done in parallel when possible (e.g., if fetching data from two different endpoints, do it concurrently). Implement request timeouts so that any slow external dependency doesn’t hang our responses. Leverage asynchronous processing: for non-critical tasks (like sending a confirmation email), do it out-of-band (using queues or background jobs) so the user-facing request isn’t slowed.
* **Front-End Performance:** Optimize React app for fast load and render. Use code-splitting to keep initial bundle small (Vercel/Next.js helps with this). Optimize images and assets (maybe using next/image or similar). Implement caching strategies on the front-end (service workers or HTTP caching for static resources). Ensure that personalized greeting or other dynamic parts are not blocking main content. We’ll also test on various devices and network speeds to ensure the app remains snappy (especially important for mobile users).
* **Load Testing & Tuning:** Continue to regularly run load tests as we add features. After each major addition (like after integrating the new wallet UI), run a load test scenario simulating real usage mix (e.g., X% of users searching flights, Y% managing profiles simultaneously). Use the results to identify at what point the system breaks or slows. This helps us decide scaling strategies – maybe we need to increase the number of app server instances at 80% CPU, or perhaps the DB hits maximum connections at a certain user count and we need to upgrade its tier. By discovering these inflection points early, we can adjust our infrastructure or code before hitting them in production.
* **Gradual Scalability:** Use our feature flags to manage any performance-heavy feature. For instance, if `flight-search-advanced-filtering` adds a heavy database query, we might roll it out gradually and monitor database load as we increase usage. If we see performance degradation, we can pause at 50% rollout and optimize the query or add an index, then resume. This ties in with progressive delivery, ensuring performance issues can be caught on a subset of users.
* **Stress and Failover Testing:** Perform stress tests and chaos engineering experiments to test the system’s resilience. For example, simulate what happens if the database is unreachable for 1 minute – does the app queue requests and recover gracefully? Or simulate heavy load beyond our max – do we fail gracefully with proper error messages? We might use tools like locust or k6 to overwhelm the system, and possibly a chaos tool to drop connections, then see how our auto-scaling and error handling react. These tests can reveal weaknesses in error handling or scaling config which we will fix.

By treating performance as a first-class concern, Warp AI will ensure **fast response times and a smooth experience** even as user count grows. Scalability planning now means we can avoid firefighting later. Our combination of load testing, code optimization, and smart scaling (both vertical and horizontal) will keep the app responsive under expected loads, and give us a cushion for unexpected spikes (like a sudden influx of new users from a promotion). Enterprise-grade performance is thus baked into our development process.

## 8. Documentation and Team Processes

**Objective:** Maintain excellent documentation and team processes to sustain development velocity and onboarding as the project grows. World-class engineering organizations place heavy emphasis on knowledge sharing and clear process – we will do the same to ensure Warp AI’s development is sustainable and maintainable in the long term.

* **Technical Documentation:** We will create and regularly update documentation for the codebase and system. This includes a **README or developer guide** covering how to set up the development environment, how to deploy, how feature flags are used, etc. Additionally, key architectural decisions will be captured in ADRs (Architecture Decision Records) or a wiki – e.g., documenting why we chose Supabase, how the CI/CD pipeline is designed, data models, etc. For complex modules like “flight search optimization algorithm,” we’ll write docs explaining their design and usage. This ensures any developer (current or future) can quickly understand the system and follow the established patterns.
* **Runbooks/Playbooks:** For operations, prepare runbooks for common tasks and incidents. E.g., “How to perform a rollback manually,” “Steps to rotate credentials,” “Procedure to on-board a new feature flag.” These will be accessible to the team, so when an incident hits at 2 AM or a new engineer joins, they have clear, step-by-step guides to follow.
* **Coding Standards & Code Review:** Define coding style guidelines (we mostly enforce via linting and prettier, but also conventions about how to structure components or APIs). Have a strong code review culture: every PR should be reviewed by at least one other engineer for quality, correctness, and adherence to these standards. We will use PR templates to remind developers to consider security, performance, and compliance in each change (e.g., a checklist item: “Are all data fields handled in this PR compliant with privacy guidelines?”).
* **Agile Process:** Continue using an iterative development process (Scrum or Kanban). We’ll maintain a well-groomed product backlog and plan sprints (if Scrum) to deliver incremental improvements. Feature flagging actually makes agile easier, as we can merge incomplete features guarded by flags without affecting production. We will practice continuous refinement – regularly review what went well or could improve in our development & release process (retrospectives). This ties back to the CI/CD best practice of creating a culture of continuous improvement.
* **Team Training:** Invest in team knowledge. Arrange internal sessions on topics like GDPR compliance (so all developers know the importance of, say, not logging personal data), security best practices, or how to use LaunchDarkly effectively. Keeping the team’s skills up-to-date is crucial for maintaining high standards. We may also certify team members on relevant areas (for example, get someone certified as AWS Solutions Architect if they handle our AWS infra, or have someone do a GDPR data protection course). According to GDPR MVP guidelines, **88% of breaches are caused by human error** – training helps minimize such mistakes.
* **Customer Support & Feedback Loop:** Even in MVP, we should set up a channel for user feedback and support. This is more product process, but it feeds into development – e.g., if users report bugs or confusion, we log those tickets and address them. Ensure we have a mechanism (like Intercom or support email) and that the dev team regularly reviews feedback. This ties into quality and continuous improvement, and for enterprise standards, having good support processes is key.

By documenting our work and following strong team processes, we **future-proof** the development of Warp AI. New developers can be on-boarded quickly with minimal disruption. Knowledge won’t be lost if a team member leaves or if we take on a new challenge after MVP. Moreover, an enterprise-grade product is not just the code – it’s the entire ecosystem of documentation, processes, and people enablement. We recognize that and build it into our plan.

## 9. Launch Plan and Future Steps

Finally, we outline the plan to **launch the MVP for U.S. users** and the steps beyond MVP to continuously improve and expand:

* **MVP Launch Readiness:** Before launch, perform a final compliance review (ensure privacy policy and terms of service are ready and legally vetted), do one more full regression test in production-like conditions, and double-check all security settings (e.g., remove any test accounts or default passwords, confirm that only necessary ports are open). We will also ensure monitoring alerts are tuned appropriately for the launch (so we aren’t flooded with false alarms, but real issues will page us). Feature flags for MVP features will be set to the desired state (some features might remain off at launch if not fully tested – which is fine, they can go live later without a redeploy).
* **Gradual Ramp and Monitoring:** If possible, do a **soft launch** – release the app to a small set of users first (e.g., an invite-only beta or a specific region) and monitor closely. This can act as a production canary. If metrics look good and no major issues, scale up to full U.S. audience. Continue to leverage LaunchDarkly for any post-launch adjustments (for example, if a surge of traffic hits and something becomes unstable, temporarily toggle off non-critical features to reduce load).
* **Post-Launch Monitoring and Support:** In the initial days/weeks after launch, have an enhanced monitoring schedule – engineers should closely watch the dashboards and error logs for any sign of issues not caught in testing. Quickly respond to user-reported issues with patches or flag toggles. LaunchDarkly allows real-time config changes, which we’ll use as needed for hotfixes (backed by actual code fixes via CI pipeline as soon as possible).
* **GDPR and Global Rollout Prep:** Even though MVP is U.S.-only, we will use this period to iron out any compliance processes. For instance, test our data deletion process with a dummy account to ensure it works. Complete any necessary filings or assessments if planning to go to EU (like self-certifying under Privacy Shield replacement when needed). When we decide to expand to Europe, our infrastructure is ready (perhaps deploying a EU data instance if required) and our practices (consent management, etc.) are already in place, requiring minimal adjustments.
* **Future Feature Development:** After MVP launch, we’ll continue the same development cycle for new features or improvements. Each new feature will be feature-flagged, tested thoroughly, and rolled out progressively. We’ll maintain the high bar for CI/CD and QA so that even as we add major functionalities (say, additional travel services or AI-driven recommendations by “Warp AI”), the platform remains stable and users experience seamless updates.
* **Scaling Organization and Process:** As Warp AI grows, the development plan will evolve. We might split into multiple scrum teams focusing on different domains (e.g., “Search Team”, “Booking Team”), in which case we’ll ensure cross-team coordination (guild meetings for shared concerns like architecture, weekly syncs for deployment timing, etc.). We will also periodically revisit our tools – for example, evaluating if our feature flagging needs to incorporate additional analytics, or if our CI system needs to handle more parallel jobs as the codebase grows. The idea is to continuously adopt **best-in-class practices** as they emerge (keeping an eye on industry trends in DevOps, security, and software design).

### Conclusion

This development plan ensures that Warp AI’s MVP will be built and delivered with **best practices at every level** – from code to infrastructure to process. We have harnessed robust feature flagging for safe feature rollout, a cutting-edge CI/CD pipeline for rapid delivery, and we’re embedding privacy, security, and quality into the DNA of the product. By following this plan, Warp AI will not only meet the current needs for a U.S.-only launch, but also establish the foundation required to scale into a **world-class, enterprise-grade platform**. We will deliver value to users quickly and confidently, while safeguarding their data and trust. With no hard deadline pressuring us, we will execute this plan diligently and iteratively, making adjustments as we learn. The end result will be an application that stands on par with the best in the industry in terms of reliability, compliance, and user experience – truly **“world-class”** in every sense.

**Sources:**

* GDPR Compliance Checklist for MVP Apps
* GDPR Compliance for US Companies
* LaunchDarkly Best Practices – Progressive Delivery & CI/CD
* Observability Best Practices – Three Pillars
* Feature Flags Best Practices – Avoiding Flag Debt
* CI/CD and DevOps Best Practices


Understood. I’ll now produce a technically detailed implementation guide optimized for execution by an LLM with access to the full codebase. It will include exact instructions, architectural patterns, expected file paths, integration constraints, and feature-flagged rollout behaviors. This will allow the receiving LLM to safely, autonomously, and incrementally implement all critical pieces of the system to enterprise-grade standards.

I’ll notify you when the full implementation specification is ready.


# Technical Implementation Plan for Parker Flight Auto-Booking Pipeline

## Overview and Guiding Principles

This plan describes a step-by-step implementation of Parker Flight’s end-to-end auto-booking pipeline. It covers each stage from flight search through booking confirmation, including new infrastructure integration (Redis, background jobs) and feature-flagged rollout. Emphasis is placed on **file-level changes**, code patterns, and rigorous compliance with safety, observability, and privacy requirements. All new code will be deployed behind LaunchDarkly feature flags so it can be enabled gradually for testing and rolled back instantly if needed. Security and privacy best practices (GDPR “privacy by design” principles like data minimization and pseudonymization) are embedded throughout the development. The goal is a robust, **production-grade** system that an LLM agent (Warp AI) can implement incrementally with high confidence.

Below, we break down the implementation by pipeline stage, followed by cross-cutting requirements (feature flags, schema changes, concurrency, testing, monitoring, CI/CD, and compliance):

## Trip Search Stage Implementation

The **Trip Search** stage initiates the pipeline by finding flight options for a user’s trip criteria. This typically involves an **Edge Function** in Supabase (Deno/TypeScript) that queries external APIs (Amadeus or Duffel) and stores results in the database:

* **File:** Create or update `supabase/functions/flight-search.ts` (or similar). Implement an HTTP-triggered Edge Function that accepts a `tripRequestId` and optional filters (e.g. max price). This function will use the Amadeus API or Duffel offers search. For example, use the provided Amadeus integration (`searchFlightOffers` function) or a DuffelService method (`searchOffers`) to fetch flight offers. Ensure proper error handling and logging around the API call (catch network errors, API errors, etc.).
* **Database:** Insert the retrieved offers into a `flight_offers` table (e.g. `flight_offers_v2`). The code should map API fields to our schema (price, cabin, routes, etc.) as seen in the existing code scaffold. Use parameterized queries via Supabase JS client (already imported in the Edge Function template) to securely insert data. Include the `trip_request_id` foreign key so offers link back to the user’s request.
* **Business Logic:** If the auto-booking feature is **enabled** for this trip (check a flag or a field on the trip request), immediately proceed to the Offer Generation step (e.g. call a follow-up function or queue a background task – see below). If auto-book is **off**, simply store offers for manual user selection. The feature flag gating ensures we don’t impact the current flow for users without the new feature.
* **Feature Flag Use:** At the top of the function (or in the caller), check LaunchDarkly flag (e.g. `auto_booking_enabled`) for this user/environment. For example, use the LaunchDarkly SDK on the **front-end** to decide whether to invoke the new auto-booking search endpoint or the old one. Additionally, as a safety check, the backend can verify a flag via LaunchDarkly’s Node SDK or a config table. (In current code, a `feature_flags` table is read for flags, but we will migrate to LaunchDarkly for dynamic control).
* **Error Handling:** Implement robust error handling. If the flight search API fails or returns no results, log the issue and update the `trip_requests` record (e.g. mark status = "NO\_OFFERS" or store the error message for review). Do not proceed further in the pipeline for that request. All errors should be captured with context (tripRequestId, user) in Sentry for alerting.
* **Testing:** Write **unit tests** for this function by mocking the external API response. For example, simulate an Amadeus response JSON and ensure the function inserts the correct rows. Also test edge cases: no flights found, API timeout, etc. Use Supabase’s recommended testing approach (e.g. run the function locally with `supabase functions serve` and use a testing framework to hit the endpoint). We will include these in the Testing section below.

## Offer Generation Stage Implementation

In the **Offer Generation** stage, the system selects or prepares a specific flight offer to book from the search results:

* **Offer Selection Logic:** Implement logic to pick the “best” offer according to user preferences or the lowest price. This can be done immediately after inserting offers. For example, after the search function stores offers, identify the top offer within the user’s budget or meeting criteria (nonstop, etc.). This could be done in the Edge Function or via a Postgres query (e.g. an SQL `MIN(price_total)` on the inserted offers for that trip\_request).
* **File:** If separating concerns, create a helper module (e.g. `supabase/functions/lib/offer-selection.ts`) with a function `selectBestOffer(tripRequestId)` that queries the `flight_offers` table for that request and returns the best offer record. This keeps selection logic testable independently. Alternatively, integrate this in the search function after storing offers.
* **Marking Selected Offer:** Once an offer is chosen for auto-booking, update the database to mark it. For instance, add a column `selected_offer_id` on `trip_requests` or create a new table `auto_booking_offers` that stores `trip_request_id` and the chosen `offer_id`. This persistent record ensures the monitoring/booking stages know which offer to act on.
* **Feature Flag Gating:** Guard this entire selection-and-next-step under the feature flag. If the flag is off, do not auto-select an offer (leave it for user). If on, proceed. This could be as simple as: `if (!autoBookingEnabled) return;` right after storing offers.
* **Code Pattern – Queue Next Step:** At this point, trigger the **Monitoring/Booking** flow. We don’t want to block the HTTP request waiting for booking (which could take time). Instead, enqueue the next stage:

  * If using **Redis queues**, push a job like `{tripRequestId, offerId}` into a Redis list or stream. For example, use an **Upstash Redis** REST call (ideal for serverless) to POST the job data. Alternatively, invoke a background Edge Function via Supabase’s pg\_net/pg\_cron as described later.
  * If using **Supabase Edge Function Chaining**, we could call another function (like `bookingProcessor`) asynchronously. Supabase doesn’t have a built-in async task queue, so the recommended approach is either the cron/pg\_net or an external worker. We will outline both in the Monitoring Loop section.
* **Testing:** Write unit tests for `selectBestOffer` logic by inserting sample offers into a test DB (or mocking the DB calls) and asserting the correct offer is chosen. Also test that if no offer meets criteria (e.g. all above budget), the function handles it (could keep the trip request in a “waiting” state for monitoring).

## Monitoring Loop Implementation (Pricing/Availability Monitoring)

The **Monitoring Loop** continuously checks for an ideal booking opportunity and triggers the booking when conditions are met. This is critical for “auto-book when price drops below X” or to ensure an offer is still available before booking:

* **Background Job:** Implement a **scheduled background process** that wakes up periodically to evaluate pending auto-booking requests. We will use **Supabase pg\_cron** for scheduling combined with an Edge Function to handle logic. Supabase supports the `pg_cron` Postgres extension and `pg_net` to call HTTP endpoints on schedule.

  * **Cron Schedule:** Decide an interval (e.g. every 10 minutes or 1 hour) for the check. Create a cron job in a migration or via the Supabase dashboard:

    ```sql
    select cron.schedule('auto_booking_check', '*/10 * * * *', $$ 
      select net.http_post(
        url := '<EDGE_FUNCTION_URL>',
        headers := jsonb_build_object('Authorization', 'Bearer <SERVICE_ROLE_KEY>'),
        body := json_build_object('action','monitor').to_jsonb()
      );
    $$);
    ```

    This calls our edge function at the interval. (Store URL and auth in Vault secrets for security as shown in Supabase docs.)
  * **Edge Function:** Create `supabase/functions/auto-book-monitor.ts`. This function, when invoked (by cron or manually), will:

    1. Query the database for all `trip_requests` that are in an “auto-book pending” state (e.g. a boolean flag `auto_book = true` and `status = 'PENDING'` and maybe not expired/cancelled).
    2. For each pending request, retrieve the latest or selected flight offer (from previous search results) or perform a fresh search if we want continuous price updates. A strategy:

       * **Option A:** Re-run the flight search each time to get up-to-date pricing (ensures catching price drops/new flights). This means calling the same API as the Trip Search stage, but perhaps with fewer results or specific date range. Insert new offers if found and update the `flight_offers` table.
       * **Option B:** Use a stored selected offer and call an API to refresh its price/availability. E.g., Duffel offers expire after a short time, but one can call Duffel’s `GET /air/offers/{id}` to check if it’s still bookable. For Amadeus, likely we must do a new search. We can combine approaches: if an offer was selected, first check if it’s still valid; if expired or price changed beyond threshold, do a new search for alternatives.
    3. If the monitoring finds an offer now meets the booking criteria (e.g. price <= user’s max, or simply the first available if user opted “book the best”), then proceed to Booking stage for that trip (call the booking function with the offer).
    4. If no suitable offer yet, simply log the check and leave the trip in pending status for next cycle.
* **Concurrency Control:** Use **Redis locking** to avoid multiple workers booking the same trip. For example, when the monitor function decides to book a trip, it should acquire a lock like `lock:trip:<tripRequestId>` in Redis. Use an atomic SETNX (set-if-not-exists) with expiration (e.g. 30 seconds):

  ```ts
  const lockKey = `trip_lock_${tripRequestId}`;
  const lockAcquired = await redis.set(lockKey, "1", { NX: true, PX: 30000 });
  if (!lockAcquired) {
    console.log(`Trip ${tripRequestId} is already being processed by another worker.`);
    continue;
  }
  // ...perform booking...
  await redis.del(lockKey);
  ```

  This ensures only one instance proceeds to book even if the cron function overlaps or multiple instances run.
* **Progressive Rollout:** The monitoring loop is part of the auto-book pipeline and thus under the same feature flag. The cron job creation itself can be gated by environment/flag (e.g. only enable the cron schedule in staging or for internal projects first). LaunchDarkly can also target specific users or environments – for example, only users with a certain email domain get the auto-booking (internal testing). We will use LaunchDarkly’s progressive rollout to slowly increase the percentage of users with `auto_booking_enabled` as we gain confidence.
* **Testing:** Write **integration tests** for the monitoring logic. For instance, simulate a scenario where a trip is pending auto-book, mock the search results across two cycles (initially above budget, later below budget) and assert that booking gets triggered on the second cycle. This can be done by calling the monitor function in a test with a fake repository or by using a testing DB with known data. Additionally, test the Redis lock behavior by calling the function concurrently in tests (or simulate by calling lock function twice) to ensure double-booking is prevented.

## Booking Stage Implementation

The **Booking** stage executes the actual flight booking (ticket purchase) once an offer is selected and approved. This interacts with Duffel’s Order API (or equivalent in Amadeus if used). Key steps:

* **File/Function:** Implement an Edge Function (or reuse the monitor function) to perform booking. We can create `supabase/functions/auto-book-execute.ts` containing a `bookOffer(tripRequestId, offerId)` function. This function will:

  1. Retrieve necessary data: the flight offer details (either from our DB or by calling Duffel’s GET offer to ensure it’s bookable) and the traveler’s personal information required for booking. Traveler info may come from the user’s profile or a separate passengers table. Ensure we have passenger names, birth dates, and contact info. **Do not log** sensitive details like full names or DOB in plaintext logs (mask or omit them in console logs to protect PII).
  2. Charge Payment: Before calling the external booking API, handle payment via **Stripe**. Using Stripe’s API (server-side), create a Payment Intent for the trip’s price. If we have a saved payment method (the user likely provided a card ahead of time for auto-booking), confirm the Payment Intent. Ensure to use Stripe’s **idempotency key** as well (e.g. use `tripRequestId` or a generated booking attempt UUID as the idempotency key for Stripe) to avoid double charges on retries. If payment fails, log the error, mark booking as failed (`status = FAILED_PAYMENT`), send the user a notification (e.g. email saying “Payment failed, we could not book your flight”), and do not call the flight API. This error path should be captured in Sentry and trigger an alert to the team.
  3. Call Duffel (or Amadeus) Order API to create the booking. Use the **DuffelService** class already scaffolded in the codebase. For example:

     ```ts
     const duffel = createDuffelService();
     const order = await duffel.createOrder(offerId, passengers, totalAmount, currency, idempotencyKey);
     ```

     Here, `passengers` is an array of passenger objects with name, DOB, etc., `totalAmount` and `currency` from the offer, and `idempotencyKey` a unique value (use the same one as Stripe charge or a new UUID) to prevent duplicate bookings if retried. The DuffelService’s `createOrder` method includes robust error handling and will throw a `DuffelApiError` for known issues (e.g. offer expired, insufficient balance).
  4. Handle booking response: If successful, the returned `order` object will contain a `booking_reference` or PNR. Store the booking in our database:

     * Create a new `bookings` table entry (see Schema changes below) with fields like `user_id`, `trip_request_id`, `provider_order_id` (Duffel order ID), `booking_reference`, `price`, etc. Save minimal PII – we can reference the passenger via user\_id or a passenger\_id if we have a separate passengers table. **Encrypt** any sensitive data we must store (for example, if storing passenger names or ticket numbers, consider using Postgres PGCrypto or Supabase’s Vault for encryption at rest).
     * Update the `trip_requests` record status to “BOOKED” and link it to the booking record (e.g. set `booked_order_id`).
     * Release any Redis lock for this trip (if we set one).
  5. If the booking API call fails, implement retry logic and error categorization:

     * The DuffelService already has retry for transient errors (HTTP 500s, network issues) with exponential backoff. It also surfaces specific conditions – e.g., if the offer expired (DuffelApiError where `isOfferExpired` is true), we can respond by marking the current offer invalid and perhaps trigger the monitoring loop to search again immediately. In such a case, update the DB (maybe mark that offer as expired) and schedule a new search (you could even call the search function directly for a quick retry).
     * If the error is a client error (4xx) that is not recoverable (e.g. passenger info invalid), log it and mark the trip as failed (`status = FAILED`). Notify the user (perhaps prompt them to contact support or update info). Do **not** keep retrying in a tight loop for client errors.
     * Make sure all failures are logged to Sentry with enough info (but scrub PII) for developers to debug.
* **Feature Flag:** The actual booking execution is the riskiest part, so ensure it only runs when the feature flag is enabled for that user. If somehow this function is invoked for an unauthorized user (e.g. by manual call), double-check the flag or user role before proceeding to charge and book.
* **Testing:** Use **sandbox/test modes** for external APIs to test this stage end-to-end. For Duffel, use the test API token (the `createDuffelService()` will pick up `DUFFEL_API_TOKEN_TEST` for non-live environment). For Stripe, use test keys. Write **integration tests** that simulate a booking: e.g., feed a dummy offerId and dummy passenger into a stubbed DuffelService that returns a fake order, and assert the DB is updated correctly. Also test failure paths: simulate DuffelApiError for expired offer and ensure the code marks the offer for retry and does not charge the card twice. Use idempotency keys in tests to assert that retrying the function doesn’t double-book or double-charge (you can call the booking function twice with the same inputs and verify the second attempt short-circuits or results in no action because state was updated or Duffel returns duplicate error).

## Communications Stage Implementation

Once a booking is completed, the **Communications** stage sends confirmations to the user and any necessary internal notifications:

* **Email Confirmation:** Utilize the existing **Resend email service integration** (as seen in `lib/resend.ts`) to send a booking confirmation email. We will create an email template for the itinerary and confirmation details:

  * **Template:** e.g. "Your flight is booked: \[Flight details, dates, booking ref]." Use HTML and plain text (Resend supports both) with no sensitive personal data beyond what the user provided (it’s going to the user themselves). Include the booking reference and a summary of the trip (airline, flight numbers, departure/arrival times, price charged).
  * **Attachment:** If available, attach the e-ticket PDF or booking confirmation from the provider. Duffel’s API might not provide a ticket PDF immediately, but it does return a booking reference which can be used to retrieve the ticket. This could be a future enhancement; for now, a text reference is sufficient.
  * **Implementation:** Call the `sendEmail()` function from `resend.ts`. That module already queues and retries emails with a circuit breaker for reliability. For example:

    ```ts
    await sendEmail({
      to: user.email,
      subject: "✈️ Your Parker Flight booking is confirmed!",
      html: renderBookingHtml(user, order),
      text: renderBookingText(user, order)
    });
    ```

    This will enqueue the email and return a Promise that resolves when sending is done (or failed after retries). Since `sendEmail()` is already non-blocking (using an internal queue and processing loop), we can call it and not worry about delaying the response too much. However, we might still want to trigger communications in a **fire-and-forget** manner so that even if email sending takes time or fails, it doesn’t undo the booking. In practice, sending an email can be decoupled completely: e.g., have the booking function insert a record into a `notifications` table (with user, type=BOOKING\_CONFIRMATION, data=orderID) and have another background job or database trigger that picks it up to send email. This level of decoupling increases reliability (so booking success isn’t tied to email success). Given time, we can implement a simple approach now (direct call to sendEmail) and consider a notifications service later.
  * **Logging & Retry:** The `resend.ts` already logs errors and will retry sending up to 3 times with backoff. If the email ultimately fails, it logs a detailed error with context. We should monitor these logs. If needed, we could add a LaunchDarkly flag to disable emails or switch providers quickly (but likely not necessary if using one robust provider).
* **User Notifications (Front-end):** In addition to email, update the front-end state for the user: e.g., when the user opens their dashboard, they should see the trip marked as booked. This will happen naturally if we update the `trip_requests.status` to BOOKED and expose that via our API or Supabase subscription. If using Supabase’s real-time features, the front-end could get a real-time update. Otherwise, ensure the next fetch of trips shows the updated status and booking details.
* **Internal Alerts:** Optionally, send an internal alert for important events. For example, if a booking was made for a high-value trip or any booking for analytics, we might push an event to Slack or an admin email. This could be done via another integration (webhook or email to ops). LaunchDarkly could also be used to trigger internal test alerts when a booking happens during rollout (to closely monitor initial bookings).
* **Privacy Consideration:** Ensure that email content does not inadvertently leak personal data beyond necessity. For instance, do not include full passport numbers or payment info in emails. A booking confirmation typically contains names and flight details which is fine since it goes to the authenticated user’s email. Just be cautious if sending any CC to third parties (likely not in this case).
* **Testing:** Write an **integration test** for the communications stage by simulating a booking in a test environment and verifying that `sendEmail` was called with correct parameters. This can be done by injecting a mock for `sendEmail` in tests. Also verify that the email content functions (`renderBookingHtml`) produce the expected content given a sample order. For end-to-end testing, in a staging environment we can allow actual emails to be sent to a test inbox and manually verify the formatting.

## Cleanup Stage Implementation

The **Cleanup** stage involves post-booking clean-up of data and resources, as well as periodic maintenance tasks to keep the system healthy and compliant:

* **Release Holds/Temporary Reservations:** If our pipeline implemented any “hold” on an offer or payment that needs explicit release when we decide not to book, handle that here. For example, if using Amadeus and we had reserved an offer, we’d cancel it if not booked. In our Duffel integration, we didn’t create an order until booking, so no hold to release. However, Duffel offers expire on their own (usually in minutes). To be safe, if an offer was selected but ultimately not used (user canceled auto-book or it expired), consider explicitly invalidating it:

  * For Duffel, one could call `DuffelService.cancelOrder()` if an order was created and needs cancellation (there is a cancel endpoint shown in DuffelService). If we had created an **order** and need to void it (e.g. user refund scenario), we could use that. If no order was created, no action needed for Duffel.
  * For other APIs or future features: ensure any locks or pending actions are cleaned.
* **Database Cleanup:** Implement periodic removal or archiving of stale data:

  * **Expired Offers:** Flight offers stored in `flight_offers` that are expired (past their `expires_at` or offers older than e.g. 24 hours if not booked) should be deleted or archived regularly. We can create a nightly cron job (using pg\_cron) to delete old offers for which `trip_request.status` is not BOOKED. This keeps the DB lean and removes possibly sensitive data (pricing details) that are no longer needed.
  * **Failed/Cancelled Requests:** For trip requests that ended in failure or were canceled by the user, consider cleaning up related data after some time. For example, if a user cancels an auto-book request, we can remove any associated offers immediately and mark the request canceled.
  * **Personal Data Retention:** To align with GDPR data minimization, plan to delete or anonymize personal data when it’s no longer needed. For instance, after a trip’s travel date has passed by some period, consider removing PII like passenger names from our records (we might keep aggregate stats but not personal info). We can implement a scheduled job to do this. Alternatively, use **pgsodium** or Supabase’s Vault to encrypt PII so that even if kept, it’s protected (and deletable by dropping keys).
* **Logs and Audit Trails:** Ensure that any temporary debug logs (especially those containing sensitive info) are either removed or properly secured after debugging is done. Use log retention policies for our system logs. For example, configure log retention to 30 or 90 days maximum, which minimizes long-term exposure of personal data in logs in compliance with regulations.
* **Resource Cleanup:** If we introduced any background worker processes or external services (like a Node worker for queue), ensure they gracefully handle no-longer-needed tasks:

  * If a trip got booked or canceled, we should remove any pending jobs related to it. For instance, if using a Redis queue, we might store job IDs and remove them. If using the pg\_cron approach with a single scheduler, it checks the status anyway, so a completed trip will simply be skipped. We should still mark the trip as completed so that it’s filtered out.
  * Clear Redis keys that are no longer needed. E.g., if we set a lock or stored some interim data in Redis (like last checked price), consider removing those keys when done to free memory.
* **Testing:** For cleanup tasks, create unit tests for any functions that filter/delete data. For example, a test for the “delete expired offers” SQL or function – insert some dummy offers with old timestamps, run the cleanup, and assert they are gone while newer ones remain. Testing scheduled jobs is trickier but we can simulate by invoking the underlying function directly. We should also test that canceling an auto-booking mid-way (if that feature exists for users) indeed stops the pipeline: e.g., set a trip\_request to canceled and ensure the monitor loop skips it and perhaps cleans any offers.
* **Compliance Checks:** Verify that our cleanup processes align with **GDPR Article 17 (Right to be forgotten)** – if a user requests account deletion, we should immediately remove personal data. This likely means deleting their trip requests, bookings, and any related records. We should implement an admin function or script for this as part of user account deletion, rather than an automatic cron, but it’s worth noting. Make sure backups or analytics data derived from user data are also handled appropriately (beyond scope of this implementation, but mention in documentation for completeness).

## Feature Flags for Progressive Rollout

We will use **LaunchDarkly feature flags** to introduce the auto-booking pipeline safely and gradually:

* **Flag Design:** Create a boolean flag, e.g. `auto_booking_pipeline_enabled`. In LaunchDarkly’s dashboard, provide a clear description (e.g. “Enables the automated flight booking pipeline for users”). Following LaunchDarkly best practices, use a naming convention that clearly indicates scope and effect. For example, prefix with service or feature area if needed: `backend.autoBooking` or similar, and a description of what turning it on does. Avoid vague names. Also consider a separate **kill-switch flag** (`auto_booking_disable_all`) if we want an easy override to shut it off independently of the rollout percentage.
* **Targeting Rules:** Initially target **internal users** only. For example, use LaunchDarkly targeting to enable the flag for certain user emails (e.g. team members) or a test segment. This allows testing in production with real data safely. Once confidence is gained, perform a **progressive rollout**: e.g., enable to 5% of users, then 20%, 50%, etc., using LaunchDarkly’s built-in progressive rollout scheduling. We can also restrict by region or other attributes if needed (for instance, perhaps roll out in one country first to ensure compliance and then others).
* **Flag Implementation in Code:**

  * On the **front-end (React)**: Integrate LaunchDarkly’s JavaScript SDK. Use it to conditionally show the UI for auto-booking. For example, if the flag is off, the UI might only allow manual booking. If on, show options like “Auto-book this trip for me” (which triggers our new pipeline). Also, use the flag to decide which API endpoints the front-end calls. E.g., when user submits a trip request with auto-book enabled, call the new auto-book endpoint/flow. This way, even if the backend code is deployed, it won’t be invoked unless the front-end is flagged on for that user.
  * On the **backend (Edge Functions)**: Since some of our pipeline runs server-side (monitoring, etc.), we will double-check the flag server-side for safety. We have two approaches:

    1. **LaunchDarkly Server SDK:** We could initialize LaunchDarkly SDK in our Node environment (for background worker) or possibly within Deno functions (LaunchDarkly doesn’t officially support Deno, so we might have to use their HTTP API). However, calling out to LaunchDarkly on each function invocation may add latency.
    2. **Proxy via Database Flag:** Simpler: maintain a `feature_flags` table as was in code (or Supabase config). For instance, when we enable the flag for certain users, we also insert a record in `feature_flags` or set a field on the user’s profile (like `auto_book_enabled=true`). The Edge Function can read that. This is less dynamic but ensures the agent has a quick way to check. We can write a script to sync LaunchDarkly targeting (for our internal users) into this table for initial testing. Since ultimately we want full LaunchDarkly control, a better solution is to incorporate a LaunchDarkly **client-side check** only (i.e., trust the front-end to call new pipeline only when flag is on). The risk is minimal if the endpoints are secure, but for belt-and-suspenders, an extra server check is fine.
  * **Cleanup of Flags:** Mark the flag as temporary. Plan to remove the feature flag once the feature is fully launched and stable, to avoid long-term maintenance of dead flags. We should tag the flag in LaunchDarkly as *temporary/cleanup* and create a task to remove flag logic after rollout.
* **Monitoring via Flags:** Use LaunchDarkly’s flag insights and events to monitor flag usage. We can emit custom events (or just watch metrics like how many times the new pipeline is invoked – perhaps funnel that into Datadog). LaunchDarkly also provides an **audit log** of flag changes – ensure that only authorized team members can toggle this critical flag (use LaunchDarkly roles).
* **Kill Switch:** In case of any severe issue, turning the flag **off** globally will revert all users to the old behavior immediately (since front-end won’t trigger auto-book and backend double-checks flag). This decouples risk from deploys – we can deploy the code in off state (dark launch) and turn it on when ready. If anything goes wrong, just toggle off (much faster than a full rollback deploy).
* **Testing Flags:** In staging, test the flag gating thoroughly: e.g., confirm that when flag is off, no new tables are written to and old logic remains, and when on, new logic kicks in. Use LaunchDarkly’s ability to target by user to simulate different scenarios side by side in testing.

## Database Schema and Migration Changes

Implementing the pipeline requires changes to the **Supabase Postgres schema**. All changes will be done via SQL migration files (ensuring we follow Supabase migration best practices and enabling RLS on new tables):

* **Trip Requests Table:** Modify the existing `trip_requests` (or equivalent) table:

  * Add a boolean `auto_book_enabled` (default false) to indicate if the user opted into auto-booking for that request.
  * Add a status field or extend it (if not already) to include states like 'PENDING', 'BOOKED', 'FAILED', 'CANCELLED'. This will track the pipeline progress.
  * Optionally add `selected_offer_id` (UUID referencing `flight_offers`) to link the chosen offer (if using that approach).
  * If needed, add `max_price` or other criteria fields (if users set a max willing price or other auto-book conditions not already in trip\_requests).
  * Ensure to write a migration SQL for this (with default values, etc.). Example snippet:

    ```sql
    alter table public.trip_requests
      add column auto_book_enabled boolean not null default false,
      add column auto_book_status text check (auto_book_status in ('PENDING','BOOKED','FAILED','CANCELLED')) default 'PENDING',
      add column selected_offer_id uuid references flight_offers(id);
    ```

    and similarly any other fields needed. Include comments in the migration for clarity.
* **Flight Offers Table:** If not already present, create a `flight_offers` table (or use the existing `flight_offers_v2` as referenced in the code):

  * This table stores offers returned from search. Ensure it has an `id` (UUID), `trip_request_id` FK, price, currency, whether bags included, cabin, etc (as per code interface). Include `external_offer_id` (e.g. Duffel or Amadeus offer ID) and an JSON `raw_offer_payload` to store the full offer for future reference.
  * If this table doesn’t exist yet, create it with **RLS enabled** (since it contains potentially sensitive info about flights the user is considering). We would allow only the requesting user to select their offers. For instance, an RLS policy: `USING ( auth.uid() = trips.user_id AND trips.id = trip_request_id )` ensuring a user only sees offers for their trip requests. (This assumes we can join flight\_offers to trip\_requests and then to the user's id.)
  * Add an index on `trip_request_id` for performance since we’ll query offers per request often.
  * RLS Policy example (to include in migration):

    ```sql
    alter table public.flight_offers enable row level security;
    create policy "Offer owner can view" on public.flight_offers
      for select using (
        exists (
          select 1 from public.trip_requests t 
          where t.id = flight_offers.trip_request_id 
            and t.user_id = auth.uid()
        )
      );
    create policy "Offer insertion by owner" on public.flight_offers
      for insert with check (
        new.trip_request_id in (select id from public.trip_requests where user_id = auth.uid())
      );
    ```

    This ensures users (authenticated role) can insert offers tied to their own trip\_request and read them. Adjust as needed if using a service role in functions (the function will bypass RLS with service key anyway, which is acceptable for insertion; for selection on client side, RLS is crucial).
* **Bookings Table:** Create a new table `bookings` to record confirmed bookings:

  * Columns: `id UUID PK`, `trip_request_id` FK, `user_id` FK (denormalize user for quick access), `provider` (text, e.g. 'DUFFEL'), `provider_order_id` (text or UUID for Duffel’s order id), `booking_reference` (PNR), `price` and `currency`, `created_at timestamptz default now()`, `status` (in case we allow cancellations or changes; statuses might be 'CONFIRMED', 'CANCELLED', etc.).
  * **PII Columns:** If we need to store passenger details (names, etc.) in the booking, consider separating them or encrypting. Ideally, we avoid storing full DOB or passport numbers. We might store passenger names for reference, but since the user themselves is likely the traveler, we could rely on the user's profile for name. To be safe, any additional passenger info can be stored in a separate table `booking_passengers` if multiple passengers per booking (with minimal info like name, and link to booking\_id). That table should also have RLS (only owner can select).
  * **RLS:** Enable RLS on `bookings` and allow only the owner to `SELECT` their bookings. E.g. `USING (user_id = auth.uid())` for select. Inserts will be done by server (service role), but we can still add an insert policy that only allows if `new.user_id = auth.uid()` for sanity when inserting via user context (though in practice insertion is by service key).
  * Add appropriate indexes (on user\_id, trip\_request\_id).
  * Migration SQL example:

    ```sql
    create table public.bookings (
      id uuid primary key default gen_random_uuid(),
      trip_request_id uuid references public.trip_requests(id),
      user_id uuid references auth.users(id),
      provider text not null,
      provider_order_id text not null,
      booking_reference text,
      price numeric,
      currency text,
      status text default 'CONFIRMED',
      created_at timestamptz default now()
    );
    alter table public.bookings enable row level security;
    create policy "Booking owner can view" on public.bookings
      for select using (user_id = auth.uid());
    create policy "Users can insert own booking" on public.bookings
      for insert with check (user_id = auth.uid());
    ```

    The insert policy allows a user (if ever inserting via client, which is unlikely) to create only their own bookings. Our server functions using service role bypass RLS, but this policy is harmless and adds defense in depth.
* **Other Tables:** If not already in place, consider a `passengers` table for storing traveler info (especially if users can save multiple traveler profiles). This might include `user_id` (owner), `first_name`, `last_name`, `DOB`, etc. If we have it, the auto-booking function can pull from here. Apply strict RLS (only owner can select/update their passengers). Encrypt DOB or other sensitive fields if needed. If not implementing now, ensure the booking function collects needed info via the user’s input and does not persist more than necessary.
* **Audit & Logs Table:** (Optional) Create an `auto_booking_audit` table to log pipeline events for debugging (trip\_id, event, timestamp, message). This can be useful for troubleshooting with the LLM agent – it could write into it at each stage. However, since we have external logging (Sentry, etc.), and to avoid storing PII in DB logs, we might skip a DB audit in favor of external logs.
* **Migration Process:** Each schema change will be scripted in a migration file. We follow Supabase guidelines: use a timestamped filename and include comments on purpose of migration. Ensure to **enable RLS on any new table** before inserting any data. Also ensure all policies cover both `authenticated` and `anon` roles appropriately (most tables here require auth, so use `TO authenticated` in policies; no anon access).
* **Testing Migrations:** After writing migrations, run them in a local or testing Supabase instance to verify they apply cleanly. Also, test that the RLS policies work by trying to read/write as different users. For example, after migration, write a small test that user A cannot see user B’s bookings (attempt a select as A on B’s data and expect 0 results).
* **Security Note:** By enforcing RLS on all new tables and ensuring policies are correctly set (one policy per operation and role as needed), we add a strong security layer. Even if a bug in our API occurred, the DB would prevent unauthorized data access at the lowest level. This is an important compliance measure and follows Supabase best practices.

## Concurrency and Scheduling (Redis Locking & Background Jobs)

To manage concurrency and long-running tasks, we integrate **Redis for locking** and use **background job scheduling** patterns:

* **Redis Integration:** We introduce Redis both as a **lock manager** and optionally as a simple job queue. We recommend using a hosted Redis service like **Upstash**, which is optimized for serverless environments and provides a REST API. This avoids persistent connections issues in edge functions. We will store the Upstash Redis URL/credentials as environment variables or in Supabase Vault (never in code).

  * **Locking:** As described in the Monitoring Loop section, use a Redis key per critical section (like per trip booking) to prevent race conditions. The pattern (SET key NX PX) ensures only one instance gets the lock. We also ensure to release the lock (DEL key) after the critical section. In case the function crashes or times out, the lock will auto-expire after the PX (expire) time to avoid deadlock.
  * **Queue (if needed):** For a more decoupled design, we could use a Redis list or stream as a message queue. E.g., push a message `{"tripRequestId": "...", "action": "book"}` onto a list. Then have a separate **worker** process (could be another Edge Function invoked via cron or a small dedicated Node script) that pops messages and processes them. Given Supabase Edge Functions cannot run indefinitely listening to Redis, a straightforward approach is to stick with the cron calling the monitor which then directly calls booking. That is acceptable for this use-case frequency. If scale grows, we might deploy a Node microservice (e.g. using BullMQ for Redis) to handle a high volume of background jobs reliably.
  * **State Caching:** We may also use Redis to cache intermediate state if needed (for instance, storing last price seen to compare on next iteration, or storing a partial result if a multi-step process). But caution: any cached personal data in Redis should be ephemeral and cleared. Since our pipeline is relatively quick (search to booking in maybe a day or two max), we might not need extensive caching beyond what’s in Postgres.
* **Background Task Patterns:** We leverage **Supabase pg\_cron** for scheduling periodic tasks as described. Cron is ideal for regular checks (monitoring, nightly cleanup). For on-demand asynchronous tasks (like “trigger booking right after search”), we have a few options:

  * Use **pg\_net + pg\_cron’s scheduling with `NOW()`**: Supabase’s cron can schedule one-off tasks by creating a cron job that runs once. For example, after search, you could schedule a cron job 5 minutes later to check that trip (though managing one-off cron entries could become complex).
  * Use **notifies/triggers**: Supabase could emit a Postgres NOTIFY on certain inserts (like new trip\_request) and have a dedicated function listening. However, Edge Functions don’t directly support persistent listeners. Another approach is to use Supabase’s **Realtime** on the client to trigger something – not ideal for server tasks.
  * **Direct Invocation**: Simpler, as implemented above, after search selection we directly invoke the booking logic (either by HTTP call or same function continues). This is synchronous but we can make the HTTP call asynchronously. For example, the search function could do:

    ```ts
    fetch('<AUT_BOOK_ENDPOINT>', { method:'POST', body: JSON.stringify({tripId}) });
    ```

    without awaiting it, so it triggers the next step in background. This is a trick to offload work but needs careful error handling (we might not catch its errors). A more controlled method is to insert a row in a “jobs” table and let the monitor pick it up momentarily.
  * Given that we have the monitor running frequently, it might be acceptable that after an initial search, we simply let the monitor loop pick up the request on the next run (within 10 minutes). If we want immediate action, we can manually call the booking function in the search function if criteria met. This introduces a slight coupling but ensures fastest response (e.g. if an offer is well under budget, why wait 10 minutes?). To compromise, we can design the monitoring function such that it can be invoked directly for a specific trip. For instance, after selecting an offer, call `auto-book-monitor` function with a payload to specifically process that trip immediately (this would do one pass for that trip).
* **Rate Limiting and Throttling:** Ensure that our background loops don’t overwhelm external APIs or our system:

  * The flight search API likely has rate limits. Our monitor should possibly stagger searches. If we have many concurrent auto-book requests, hitting all at once could be an issue. We can mitigate by limiting how many requests we process per cron invocation (e.g. process 5 trips per minute window). If more, either queue them or increase frequency. This can be adjusted as needed.
  * We might implement a simple rate-limit check using Redis: e.g., a counter of API calls per minute and skip or delay if above threshold (Upstash example code and LaunchDarkly or config to adjust if needed).
* **Cron Job Management:** Document the cron schedules and provide a way to adjust or disable them in emergencies:

  * For example, if we set cron jobs via migration, include a way to drop or update them. In LaunchDarkly, we can’t directly toggle cron, but we could put conditional logic in the function that checks a “cron\_enabled” flag and exits immediately if false (as a kill switch for the monitor loop). Alternatively, maintain a config in DB to turn off background tasks if needed. This is an extra safety net.
  * Use descriptive names for cron jobs (like 'auto\_booking\_check' as above) so it’s clear in the DB what they do (they appear in the `cron.job` table).
* **Testing Concurrency:** Simulate concurrent booking attempts in a test environment. E.g., have two instances (threads or function calls) try to book the same trip simultaneously, and verify that one gets the Redis lock and the other aborts gracefully. This ensures our locking works. Also test that the lock expires if something goes wrong (simulate a function crash by not releasing lock and ensure after TTL the other can proceed).
* **Job Failure Handling:** If a background job (monitor or booking) fails due to an exception, it will be logged in Supabase function logs and captured by Sentry. We should ensure the state in DB remains consistent (e.g., if booking failed mid-way, we have a status for that). The next cron run could retry or we might require manual intervention depending on failure type. Perhaps use a retry count field in DB for a trip, and don’t retry infinitely to avoid looping on a permanent error. Given our manual attention during rollout, we can handle these case-by-case, but it’s good to note for future improvement (maybe an exponential backoff for retries stored in DB).

In summary, **Redis** will give us the necessary synchronization primitive for safety, and **pg\_cron** provides a reliable scheduler within our stack for the monitoring and cleanup tasks, without requiring an external job runner. This approach aligns with the serverless architecture and ensures we don’t need a constantly running server process (scaling down complexity).

## Testing and Quality Assurance

We will pursue comprehensive testing at multiple levels to ensure the pipeline’s reliability and safety. The testing strategy includes **unit tests**, **integration tests**, and **end-to-end (E2E) tests**:

* **Unit Testing (Function-Level):** For each functional unit (search, select offer, book, send email, etc.), write unit tests:

  * Use a testing framework like Jest (for Node context) or Deno’s built-in test runner for Edge Functions. We can structure our code to separate pure functions from the HTTP layer to facilitate testing. For example, factor out `searchOffers(params)` logic into a module that can be imported and tested without HTTP.
  * **Mock External Services:** Use dummy implementations or libraries like `nock` (for Node) to simulate HTTP responses from APIs. For Deno, we might provide our own fake fetch in the test environment. Ensure our code allows injecting a custom fetch or client for test purposes (dependency injection can make this easier).
  * Test all branches: success and various failures (e.g., API returns error, Stripe charge fails, Duffel returns expired offer error, email throws exception, etc.). Each test should assert that the function handles the scenario as expected (e.g., returns correct error code, or sets proper DB state).
  * Example: Testing booking function:

    * Arrange: create a fake trip\_request and flight\_offer in an in-memory SQLite or a test schema (Supabase provides a `supabase test` option, or use a test transaction).
    * Stub `duffel.createOrder` to return a known order or throw a DuffelApiError depending on test case.
    * Stub Stripe API calls (perhaps by a Stripe library’s testmode or by mocking the function that creates payment intent).
    * Act: call our `bookOffer()` function.
    * Assert: check that a booking record was inserted when expected, that the trip\_request status updated, that on error the status marked failed and no booking record inserted, etc.
* **Integration Testing (Database & Services):** These tests exercise multiple components together in a controlled environment:

  * We can spin up a local Postgres (Supabase) instance with the migrations applied, and use the **Supabase CLI** to run functions locally. Then write tests that call the HTTP endpoints (e.g., using fetch or supertest) as if we were a client, verifying the end-to-end behavior through database checks.
  * Alternatively, run tests in a staging environment pointing to test API keys for Stripe/Duffel. For instance, use Duffel sandbox: we can actually perform a test booking (Duffel will not charge money in test mode and issues dummy tickets). This would be a full integration test of our pipeline. We should automate this if possible, but even a manual test on staging prior to rollout is essential.
  * Integration test example scenario:

    1. Create a new trip\_request in the test DB with `auto_book_enabled=true` and some criteria.
    2. Invoke the flight search function (either by calling the HTTP endpoint or directly if easier).
    3. Simulate the monitor loop running (or call the booking function directly if an offer is ready).
    4. Verify that at the end, a booking entry exists and an email was (at least attempted to be) sent.
    5. Also verify idempotency: run the booking step again with the same trip (it should detect already booked and not double-create).
  * Use a clean database state for each test to avoid interferences. Tools like `supabase reset` (with Snaplet or so) might help, or wrap tests in transactions that rollback.
* **End-to-End Testing (User Journeys):** Use a browser automation tool (like **Cypress** or **Playwright**) to simulate actual user behavior on the front-end against a staging environment:

  * Write a test where a user fills out a flight search form, enables "auto-book my trip", enters payment details (Stripe test card), and submits.
  * The E2E test then polls or waits for some indication of booking (maybe the UI changes to “Booked!” or an email is received in a test inbox).
  * Verify that the user’s trip is marked booked in the UI and that a confirmation email was received (many email APIs like Resend have webhooks or you can use a service like Mailosaur for testing emails). Alternatively, configure the test environment to send emails to a fake SMTP that our test can inspect.
  * These tests ensure the whole pipeline works in concert: front-end flag gating, back-end processing, and user communication.
* **Test Coverage:** Aim for high coverage on critical business logic. Especially focus on:

  * Offer selection algorithms (no edge case should pick the wrong flight).
  * Financial transactions (charging the correct amount, exactly once).
  * Security checks (ensure that if a user without permission tries something, they are forbidden – e.g., if someone tried to call our auto-book endpoint for a trip that isn’t theirs, RLS and auth logic should prevent it).
  * Error scenarios that could impact users (like partial failures). For example, simulate a case where payment succeeds but booking fails – our system should handle refunding or notifying properly. (In practice, if Duffel fails after payment success, we might need to refund via Stripe – we should add logic for that: if createOrder throws after a payment capture, we call Stripe to refund the PaymentIntent. Write a test for this flow too).
* **CI Integration:** Incorporate tests into the CI pipeline (GitHub Actions):

  * Include jobs for unit tests (running quickly on every push) and perhaps nightly integration tests (which might call external APIs and thus be slower or require API keys). We can use environment secrets in CI for test API keys to run those integration tests safely.
  * Define separate steps in the workflow: e.g., `npm run test:unit` and `npm run test:integration`. For integration tests that use a database, perhaps start a ephemeral Postgres service in CI or use Supabase’s test harness.
  * Set up **reporting**: collect coverage reports, fail the build if coverage drops below a threshold.
* **Manual and Beta Testing:** In addition to automated tests, we will do a closed beta with internal users (enabled via feature flag). They will use the feature in real-world scenarios and we will gather feedback and monitor for any issues not caught by tests (e.g., unusual data from APIs, or UI/UX issues).
* **Test Data Management:** Use strictly **test data** in any environment connected to real APIs: e.g., use a dedicated Stripe test account and Duffel test mode. Ensure no real credit cards or live bookings happen during testing. This protects users and avoids costs. Mark any test bookings clearly (Duffel allows adding metadata – we set `metadata.testing = true` for example – see the createOrder where we include `integration_version`).
* **GDPR and Privacy Testing:** It’s easy to overlook, but we should also test our compliance features. For instance:

  * Create a dummy user with some data, then simulate a “delete user” action (perhaps directly via SQL or an admin API if available) and run our cleanup to ensure their bookings and personal data are removed.
  * Verify that we are not inadvertently logging sensitive info: scan through logs in testing to confirm (this can be manual). For example, after a test run, search the function logs for occurrences of email addresses or names. Our logging should have redacted or none of that. This can even be automated with a script that checks log outputs for PII patterns.
* **Performance Testing:** While not explicitly requested, consider testing the performance of the pipeline: E.g., how long from search to booking completion on average. We can simulate a batch of requests to see if any part is a bottleneck. The monitoring loop interval is a factor in booking speed; if users expect booking within minutes of finding a price, ensure our default interval meets that (or adjust with on-demand triggers). We can adjust after initial rollout based on performance metrics.
* **Security Testing:** Use tools or scripts to test common security issues:

  * Ensure that without proper auth, none of the endpoints do anything (Supabase functions by default require an auth token or anon key – verify RLS prevents data leaks).
  * Try to access another user’s trip by altering IDs in requests to confirm access is denied.
  * Consider running an automated vulnerability scan (some CI integration or using OWASP ZAP against the dev deployment) to catch any obvious holes.

By implementing this multi-layer testing strategy, we ensure that when the feature flag is gradually turned on, the functionality has been vetted thoroughly, reducing the risk of failures in production.

## Logging, Alerting, and Monitoring

To achieve **maximum observability**, we will implement comprehensive logging and integrate with monitoring tools (OpenTelemetry, Sentry, Datadog):

* **Structured Logging:** All server-side stages will emit structured logs for key events. Use consistent log formats (JSON if possible) with fields like `tripRequestId`, `stage`, `level`, `message`. For example:

  ```ts
  console.log(JSON.stringify({
    level: 'info',
    stage: 'booking',
    tripRequestId,
    msg: 'Booking succeeded',
    orderId: order.id
  }));
  ```

  Supabase Edge Functions automatically capture `console.log` output. By structuring it, we can later feed these logs to Datadog or another aggregator for analysis. (Supabase provides log retrieval; we can also set up Logflare or Datadog log ingestion.)
* **Sensitive Data in Logs:** **Never log PII or payment data in plaintext.** Scrub or omit such fields. For instance, do not log full passenger names or emails – or if needed, log only a hash or an ID. In our code, ensure any `console.error` printing caught exceptions will not dump entire objects that may contain PII. For example, our email sending error logs currently print `emailData` which includes recipient email – we might want to remove or mask the `to` field in that log to be safe. We can modify that to log only the domain or a masked version of the email.
* **Sentry Integration:** Use **Sentry** for error tracking and performance monitoring:

  * Initialize Sentry in each Edge Function (as per Supabase docs) using the Deno SDK. Set the DSN via env variable. Configure Sentry to capture exceptions (we can wrap our main handler in a try/catch that calls `Sentry.captureException(e)` as shown in the docs).
  * Attach context to errors: for example, Sentry tags for `tripRequestId`, feature flag status, environment (staging/prod). This will help diagnosing issues quickly. The example shows tagging region and execution\_id (Supabase-specific); we can add our own tags similarly.
  * Enable Sentry’s performance tracing for functions if possible. The Deno SDK supports setting a `tracesSampleRate`. We can capture the execution time of each stage and even nest spans (for example, one span for "flight search API call", another for "DB insert", etc.). This might require the full OpenTelemetry setup, but as a simpler approach, Sentry can record the function invocation duration as a transaction if configured.
  * Set up Sentry Alerts: define alert rules (e.g., if any **booking failure** error occurs, notify engineering Slack/email immediately; if error rate > X in an hour, flag regression).
* **Datadog Integration:** Leverage Datadog for metrics and possibly traces:

  * We can send custom metrics to Datadog via their API or using OpenTelemetry exporters. Key metrics might include: number of auto-bookings attempted, number succeeded, number failed, time from request to booking, etc. These help measure the feature’s performance and business value.
  * If we deploy a Node service (for background tasks), we can run the Datadog APM agent there to automatically capture metrics and traces. For serverless functions, Datadog has a Lambda/Edge integration, but in Supabase’s case, we might rely on custom metrics.
  * Logs: We can set up a log forwarding from Supabase to Datadog (Supabase can integrate with third-party logging by APIs). If that’s not straightforward, we could consider using the `datadog-metrics` npm package to send events within the function (though that might add overhead in each run). A better approach is likely to export logs to a storage or queue and have a separate process ship them.
  * Create Datadog **dashboards** for the pipeline: e.g., a graph of bookings per day, failure rate, average price booked, etc. Also, a dashboard for system health: e.g., function invocation count and duration (Supabase might expose some metrics, or we gather via logs).
  * Set up **Datadog monitors**: e.g., alert if the booking failure rate goes above 5%, or if no bookings have succeeded in X time (which could indicate a breakage), or if the monitor function hasn’t run (maybe track logs/metrics to ensure cron jobs are firing).
* **OpenTelemetry Tracing:** To get end-to-end traces across the system (from front-end to back-end):

  * On the React front-end, use an OpenTelemetry JS client or simply use Sentry’s performance monitoring to mark the user action. It can pass a trace ID along when calling the API (maybe via a header).
  * In the Edge Function, if we capture the incoming trace ID (or some correlation ID), we can continue the trace. Since full OpenTelemetry setup in Deno might be complex, a simpler method: generate our own **correlation ID** for each auto-booking pipeline instance (could be the `booking_attempt_id` UUID we pass to Duffel). Include this ID in all log messages and in Sentry breadcrumbs. This way, even if we can’t have a single distributed trace view, we can search logs/Sentry by that ID to piece together the journey.
  * If time permits, explore OpenTelemetry SDK for Node in the background worker (if any) and use a collector to view traces. But initial focus should be Sentry which already gives us stack traces and some performance data.
* **Monitoring Cron & Queue:** We should monitor that our background processes are running as expected:

  * The `auto-book-monitor` function should log when it runs and how many requests it processed. If we notice it not running (e.g., no log entry in X minutes), that’s an issue. We can set an alert for “no cron execution in last 15 minutes” (maybe by a heartbeat metric). One way is to have the function update a `last_run` timestamp in a metadata table or even ping a Datadog heartbeat monitor.
  * Similarly, ensure any external worker is monitored (if we had one, we’d use something like PM2 or a simple uptime check).
* **Analytics:** From a product perspective, we might track usage: how many users enabled auto-book, how many bookings made automatically, savings, etc. This could be done via an analytics service or simply by querying our DB and logs. Not a part of observability per se, but worth noting we will gather these stats (and ensure any analytics also comply with privacy).
* **Audit Logging:** For security, keep an audit of important actions:

  * We can rely on Sentry for errors and Datadog for metrics, but for actions like “booking confirmed for trip X for user Y”, we might want that recorded in a durable place (database or at least retained logs). Possibly the `bookings` table itself suffices as an audit of bookings.
  * LaunchDarkly toggles are tracked by LaunchDarkly’s own audit log (who toggled when) – no need to duplicate that, just ensure the team reviews it after changes.
* **Retention and Privacy:** Configure log retention according to compliance:

  * If using Datadog, set logs retention to a reasonable period (e.g., 15 days for detailed logs, or sanitize them) to minimize long-term storage of user data in logs.
  * We might also use log redaction features (Datadog allows defining patterns to hash or remove). For example, set rules to redact anything that looks like an email or credit card number from any logs that might slip through.
  * In Sentry, enable PII scrubbing. Sentry SDK by default will sanitize things like credit card numbers and passwords. We should double-check and add any custom field (e.g., if we send user name or email as context, mark those as sensitive so Sentry doesn’t store them unless we allow). Sentry’s data scrubbing settings should be configured to be safe by default (remove any values that match common PII patterns).
* **Alerting Strategy:** Summarizing key alerts to set up:

  * **On-call Alert** for any unhandled exception in booking stage (since that could affect purchases). This can be via Sentry (set up a high-severity alert for errors in the booking function).
  * **Payment failures**: alert if we see more than e.g. 3 payment failures in a day (could indicate a Stripe issue or user issues).
  * **Offer not found**: if our pipeline frequently can’t find offers for auto-book requests (could alert product team that user criteria too strict or supply issue).
  * **Latency issues**: if booking process takes too long (maybe > some threshold), log it. Possibly send that to an APM to see where the delay is (external API vs our processing).
  * **Security alerts**: any suspicious behavior (like multiple booking failures that could hint at fraud or a bug). Also monitor admin logs (if any admin toggles something or uses service key in an unusual way – though that’s more on Supabase if someone leaked service key, etc.).
* **Dashboard for Ops:** Create a simple “Auto-Booking Ops” dashboard that shows active auto-book requests, their statuses, and recent activity. This could be a read-only page in our admin or simply a set of SQL queries we can run. During rollout, engineers can watch this to verify everything is functioning. (E.g., query trip\_requests where auto\_book\_enabled to see how many are pending vs booked vs failed.)
* **Feedback Loop:** Use the logs and metrics we gather to iterate. For example, if logs show many “offer expired” errors, maybe we need to shorten the monitor interval or book faster. If we see “payment declined” often, maybe notify users earlier about updating their card.

By implementing these measures, we ensure that once the feature is live, we have full visibility into its operation and can quickly respond to any issues, fulfilling the “maximum safety and observability” goal.

## CI/CD Pipeline Integration

Our CI/CD (GitHub Actions) process will be updated to accommodate the new auto-booking components and ensure safe deployments:

* **Continuous Integration (CI):** On each pull request and merge to main, the CI pipeline will run:

  1. **Linters/Formatters:** Run ESLint, Prettier, etc., on the new code (Edge Functions and any front-end code) to maintain code quality.
  2. **Type Checking:** Ensure TypeScript passes type checks across the repo, including the new functions.
  3. **Unit Tests:** Execute the full unit test suite. All new tests (for each pipeline stage function) must pass. Set up coverage enforcement as noted.
  4. **Integration Tests:** Possibly run a subset of integration tests in CI (maybe those that can run quickly with mocks). For full integration (with external API calls), it might be best to run those nightly or on a specific trigger, not every push (to avoid hitting API limits). We can have a separate workflow for nightly full integration tests using a staging environment.
  5. **Static Security Analysis:** Incorporate any security scanners (like DependaBot for dependency vulns, maybe ESLint security rules, or a tool like Snyk) to catch common issues early. This is especially relevant since we handle payments and personal data.
* **Continuous Deployment (CD):** Once changes are merged:

  * **Migrations Deployment:** Use Supabase migration workflow. For example, if we push to main, a GitHub Action can run `supabase db push` or apply the SQL migrations to the production database. This should happen before the new code is live to avoid runtime errors (we will deploy code with feature off, but still good to have DB ready). We must ensure backward compatibility: adding columns and tables is fine (non-breaking), but if we ever changed existing schema, we’d do it in a backward-compatible way given the flag (e.g., keep old columns until feature fully migrated).
  * **Edge Functions Deployment:** After database is migrated, deploy the new/updated Edge Functions. Supabase CLI can deploy functions with `supabase functions deploy <name>`. We will script this in CI for each function we created or changed. E.g., `supabase functions deploy flight-search`, `... deploy auto-book-monitor`, etc. Alternatively, since Supabase might not allow selective deployment easily, we can deploy all functions or use their container deploy mechanism. We should only deploy to production on code merges that have passed tests and possibly after staging verification.
  * **Front-End Deployment:** The React app (if any changes for feature) will be built and deployed (perhaps to Vercel or Netlify or S3 depending on Parker’s setup). Ensure that the LaunchDarkly client ID for production is configured and the app is initializing it early (so flag checks are ready).
  * **Environment Config:** Update environment variables for new services:

    * Add `REDIS_URL` (Upstash endpoint) and any auth token to the environment (as secrets in GitHub Actions and in Supabase Function environment config).
    * Add LaunchDarkly SDK keys (for front-end, a client-side ID; for backend, a server SDK key if used). These must be kept secret (the client-side ID is okay to expose in front-end code, but the server secret is not).
    * Ensure `STRIPE_API_KEY` (test and live) are present in the environments where needed.
    * Ensure `SENTRY_DSN` is set for functions to send logs.
    * All secrets should be managed via the platform’s secure storage (Supabase has a secrets manager for functions or we use environment variables configured via CLI).
  * **Feature Flag Defaults:** On initial deploy, the LaunchDarkly flag should be off for all users (so it’s effectively dark). Our code expects it that way. Verify that the default rule in LaunchDarkly is set to false in production. We can have it true in staging (for easier testing).
  * **Post-Deploy Checks:** After deployment, run a quick smoke test:

    * Possibly trigger a known test trip through the pipeline in a non-production environment or with a test user in production (if allowed) to ensure everything is wired correctly.
    * Verify that migrations applied (e.g., the new tables exist in prod).
    * Verify that functions are responding (Supabase function health-check endpoints).
* **Rollbacks:** Our primary rollback mechanism is the feature flag (turn off if something goes wrong). However, we also plan for code rollbacks:

  * If a severe bug is found that can’t be mitigated by the flag (e.g., it affected even flag-off behavior, or a migration issue), we should be ready to roll back the deployment. In GitHub Actions, keep the ability to deploy a previous commit’s functions or DB state:

    * Maintain backward-compatible migrations: Since we add columns and tables, rolling back code to before those exist is fine (old code just doesn’t use new tables; the presence of extra tables is harmless).
    * If we had a migration that changed behavior (none planned that break old flows), we’d need a rollback migration. We can prepare `down` scripts for complex changes if necessary.
  * Version control: Tag releases so we can quickly checkout a last known good state. Possibly have a GitHub Action to deploy a specific git tag to Supabase if needed.
  * In LaunchDarkly, if we needed to **hotfix** something, one strategy could be to use a second flag to toggle a sub-feature. But ideally, we handle via code fix and redeploy behind the main flag.
* **Staging Environment:** It’s implied but worth stating: use a staging Supabase project for testing. The CI/CD could deploy to staging on every merge to a develop branch, for instance, run tests, and then deploy to prod on main. If Parker Flight doesn’t have separate staging infra, we can simulate it by using the flag to simulate staging (like enabling for internal users as “staging”). But a separate Supabase instance would be safer. Given GDPR, perhaps have staging data anonymized.
* **GitHub Actions Workflows:** We will create or update YAML files:

  * `ci.yml` for running tests on PRs.
  * `deploy.yml` for deploying migrations and functions. This might trigger on push to main. Steps might include:

    * Checkout code.
    * Set up Supabase CLI (install it).
    * Authenticate (using a service token for the Supabase project – store it in GitHub secrets).
    * Run `supabase db migrate` or `supabase db push` to apply migrations. Use caution: ensure the migration is run in a transaction or with `SAFE` migrations if possible. Supabase migrations are typically safe if written correctly.
    * Run `supabase functions deploy --project-ref $PROJECT_REF --no-verify-jwt` for each function. Alternatively, build a Docker container with the Edge Functions if Supabase requires (as of now CLI can deploy from local files).
    * Possibly clear Edge Function cache if needed (Supabase might cache function instances; not usually an issue on deploy).
    * Invalidate any front-end cache if needed (e.g., if we use a CDN for the React app, purge it).
    * Post a success status or in case of failure, alert the team (we can integrate Slack notifications in the workflow for deployment status).
  * Also include a manual trigger (workflow\_dispatch) for emergency deploy or rollback if needed.
* **Dependency Management:** Ensure our `package.json` includes any new dependencies (e.g. LaunchDarkly SDK, Redis client, etc.) and that those are installed in CI environment. Since Edge Functions run in Deno, adding NPM deps (like `npm:resend` and potentially `npm:launchdarkly-node-sdk`) is done via dynamic imports. We should test that in staging (Deno can import npm packages now, which Supabase supports). The CI should run a build or bundling step if required by Supabase (Supabase might not require bundling – it handles TS directly).
* **Linting/Formatting**: Adhere to any existing lint rules. For example, if there’s an ESLint config that forbids console logs in front-end, we may allow them in backend. Possibly mark our debug logs appropriately or use a logger library which can be configured per environment.
* **Secrets in CI:** Double-check that no secrets are logged in CI output. Use GitHub’s masking for known secret values. When running tests that use keys, ensure output doesn’t print them. Usually, printing env variables is not done, but be mindful if any error dumps them.
* **Continuous Improvement:** Add the new pipeline components to our **monitoring of CI** – e.g., if tests for auto-booking start failing frequently, that should block deployments. We treat those tests as gatekeepers for quality.
* **Documentation and Runbooks:** As part of CI/CD, update README or internal docs for how to deploy, how to manage flags, etc. If an LLM agent or developers are to operate this, they should have clear instructions (maybe an `ops.md` with steps to toggle flags or run migrations). This isn’t code, but including it ensures maintainability.

In summary, CI/CD will ensure that our auto-booking pipeline is delivered to production in a controlled, reversible manner. Every change will be tested and feature-flagged, and deployments can be frequent (since the feature is off until ready, we can merge incremental progress without affecting users). This aligns with trunk-based development and feature flag best practices, enabling rapid yet safe iteration.

## Security, Privacy, and Compliance Considerations

Throughout the implementation, we must uphold **GDPR and U.S. privacy laws**, as well as general best security practices. Here we consolidate these considerations:

* **Data Minimization:** Collect and store only data necessary for the booking. For example, we need passenger name and DOB to book a flight, but we do **not** need to store the passenger’s passport number or other extraneous info in our system. We should avoid storing any sensitive personal data that we didn’t explicitly plan for. If in future we handle passport or TSA information, treat it with highest security (encrypted at rest and in transit).
* **Personal Data Handling:** All personal identifiable information (PII) must be protected:

  * **In Transit:** Supabase and our APIs are all HTTPS, which covers data in transit. Ensure Stripe and Duffel SDKs use HTTPS (they do by default).
  * **At Rest:** Enable encryption for sensitive fields. Supabase allows column-level encryption (via extensions like pgcrypto or pgsodium). For instance, if we store a passenger’s DOB or phone, consider encrypting those columns with a key that only the server knows (we can use Supabase’s Vault or a fixed key from env). Or store hashed values if we only need to compare, though likely we need actual values for bookings, so encryption is better.
  * **In Logs:** Do not log personal data. This was emphasized before – implement scrubbing of logs and short retention. According to GDPR, logs that contain personal data should be encrypted or anonymized. We can comply by either not logging PII at all (ideal) or by storing logs in an encrypted store (if logs go to Datadog, ensure their storage is encrypted at rest and access is restricted).
  * **Retention:** Implement retention policies: e.g., auto-delete or anonymize user’s trip and booking data after a certain period post-travel (unless needed for legal or user reference). A possible policy: 1 year after trip completion, purge PII (keep maybe high-level stats). This needs alignment with business needs and is something to document and possibly automate with a cron job (as noted in Cleanup).
  * **User Rights:** Ensure we can fulfill user rights such as deletion and data export:

    * Deletion: If a user requests account deletion, we must delete their trip\_requests, flight\_offers, bookings, etc. Because data is spread across tables, consider a Supabase Edge Function to handle this by user ID. And remove from third-party systems: e.g. if their data was sent to Duffel (the airline will have it, which is outside our system’s immediate control – in GDPR terms, the airline via Duffel might be another controller; our privacy policy should clarify that). At least within our DB and logs, wipe it.
    * Access/Export: We should be able to retrieve what data we have on a user if they ask. With our structured DB, that’s feasible (just gather their records). Possibly an admin query or function can output JSON for them.
* **Consent and Transparency:** Users must explicitly opt-in for auto-booking (which they do by toggling that feature per trip, presumably). Ensure that in the UI we explain what that means: that their provided payment will be charged automatically and their personal data will be used to book a ticket on their behalf. This covers informed consent for using their data in this way. For GDPR, that likely falls under contract fulfillment or consent. For U.S. (CCPA), ensure it’s covered in privacy policy and allow opt-out (not sell data, etc., which we don’t).
* **Payment Security:** We rely on **Stripe** for handling credit card data, which keeps us out of PCI-DSS scope largely. Never store raw card numbers or CVC in our database or logs. We should only store Stripe’s payment method IDs or customer IDs. Those are not sensitive by themselves (they can’t be used outside our Stripe account). Even so, protect Stripe secret keys and do not expose them. The Stripe webhooks (if any, e.g. if using webhook to confirm payment events) should be secured with signing secret. Likely for auto-book we might not need webhooks if we confirm synchronously.
* **API Keys and Secrets:** Secure all API keys (Duffel, Amadeus, LaunchDarkly, Resend) via environment variables. In the code or config:

  * Do not commit secrets to Git. Check that no secret is present in the code snippet (the DuffelService uses `Deno.env.get`, which is correct).
  * Use Supabase Vault for storing secrets used in SQL (like the cron job HTTP auth header uses anon key stored in Vault). We have done that for cron scheduling.
  * Rotate keys if needed and update env securely (have a documented process).
* **Row-Level Security (RLS):** As detailed, we enabled RLS on new tables. This is a crucial security layer. Test the policies to ensure no data leakage. For example, try to craft a request for another user’s data via the API – it should return nothing. This guards against both programming mistakes on the client and malicious attempts.
* **LaunchDarkly Safeguards:** Treat feature flags that can alter data flow as sensitive:

  * Ensure only authorized personnel can toggle `auto_booking_pipeline_enabled` in production (LaunchDarkly has role-based access – we can restrict who can edit prod flags).
  * Use flag prerequisites or multiple flags if needed to avoid accidental full enable. For instance, one technique is to have a kill-switch flag that always evaluated and needs to be ON for anything to happen. That way two things have to be wrong for an accidental enable. But this might overcomplicate; careful permission and using the scheduling for rollout is probably enough.
* **Third-Party Compliance:** We must ensure that using Duffel/Amadeus and sending them user data (names, etc.) is covered under our privacy policy and their GDPR compliance (Duffel is GDPR compliant as a processor for travel data, we should verify that in their documentation). Similarly, Resend and LaunchDarkly are processors of data (emails, feature usage) – ensure Data Processing Addendums are in place with them if needed.
* **Jurisdiction and Data Residency:** Supabase likely hosts data in U.S. by default (for our project, unless we chose EU). If we have EU users, storing their personal data in U.S. might require Standard Contractual Clauses, etc. This is more of a legal config; technically, if needed, we could host EU user data in an EU Supabase project. But given no instruction on splitting, we proceed with the assumption that current setup is acceptable and disclosed to users.
* **Encryption:** Consider enabling the `pgcrypto` or `pgsodium` extension for field encryption. For example, if we want to encrypt DOB in database so that even a DB leak doesn’t expose it, we can use a symmetric key. We then decrypt in our function when needed. Key management becomes an issue – storing the key in Supabase Vault is one option or as an env var. We should weigh this. Perhaps for now, not implementing field encryption but relying on RLS and overall DB security (Supabase manages the DB and encryption at rest on the cloud likely). However, if storing any particularly sensitive info or large volumes of PII, encryption at application level would be ideal. Mark this as a future improvement and possibly implement it for at least DOB and phone.
* **Open Web Security Best Practices:** Follow OWASP best practices in our code:

  * Validate all inputs from the user. E.g., trip request inputs (dates, airports) should be validated on front-end and back-end (the Edge Function should validate that the IATA codes are of correct format, dates are in future, etc., to prevent any weird injection or errors).
  * Use parameterized queries (Supabase does this under the hood with its client, but if we ever use raw SQL, parameterize to avoid SQL injection).
  * **Authentication & Authorization:** Ensure all Edge Function endpoints enforce auth where needed. By default, Supabase Edge Functions require an `Authorization` header with the anon or service key. For user-initiated ones, we’ll pass the user’s JWT (supabase-js does this automatically if we use the JS client on frontend). Verify that in production, hitting those endpoints without auth fails. Also ensure our supabase policies align with these – for instance, our functions run with service role (full access), which is fine to perform actions, but the user cannot directly call a function to e.g. book someone else’s trip because they’d need the tripRequestId which they wouldn’t have unless it’s theirs.
  * **Preventing Abuse:** Rate-limit critical endpoints to prevent misuse or excessive cost:

    * For instance, an attacker could spam our flight search function with various queries to exhaust Duffel/Amadeus quotas. Implement a basic rate limit per user for search requests (maybe X searches per minute). This can be done using Redis as well (increment a counter for user IP or ID). LaunchDarkly could also be used to quickly disable a user’s access if needed (like an operational flag).
    * The auto-booking feature itself is not likely to be abused by users (since it’s for their benefit and costs them money), but someone could maliciously create many fake accounts and auto-book to cause chaos. To mitigate: ensure email verification on account creation (Supabase Auth probably handles that), and possibly require a valid payment method on file before enabling auto-book (which inherently limits spam due to cost).
  * **Error Messages:** Don’t expose internal details in errors that go to users. E.g., if booking fails, we might tell the user “Booking failed due to payment issue” but not expose stack traces or system details. Internal logs (Sentry) will have the technical info. This prevents leaking info that could help an attacker or confuse a user.
* **GDPR Documentation:** Document our data flows in our GDPR Article 30 records (if required) – e.g., data goes to airlines via Duffel (purpose: travel booking, lawful basis: contract), etc. This is beyond coding, but important for compliance if audited. Also, enable Privacy by Design in any future changes: always consider these principles whenever adding a new data field or external integration.
* **Cookies & Tracking:** Not directly mentioned, but if our front-end uses any tracking or cookies (LaunchDarkly might use a cookie or localStorage to store user context for flag eval), ensure our site’s privacy notice covers that. LaunchDarkly is just feature gating, likely minimal impact.
* **PCI Compliance:** Using Stripe shifts most compliance to them. We should still do annual security reviews. Possibly ensure our Stripe account is set to require 3D Secure when needed (for auto charges, 3D Secure might not be possible because it’s unsupervised; we may need to attest to Stripe that we have user consent for these charges).
* **Audit Logs for Security Events:** Supabase logs access to the database. We might want to specifically log any administrative access or use of service role outside intended context. But since we primarily run with service role in functions, that’s expected. If there’s an admin panel for support to book on behalf of user, log those actions (not in scope here, but good to note).
* **Penetration Testing:** After implementation and before full rollout, consider a pen-test or at least a thorough code review for security by another engineer or using an automated tool (like an OWASP ZAP scan for the web app, and static analysis for the backend).
* **Compliance with US Privacy Laws:** Apart from GDPR, laws like CCPA give users rights to access/delete data (similar to GDPR) and to opt out of sale (we don’t sell data). Ensure our privacy policy is up to date and that we have a mechanism to handle “Do Not Sell” signals (likely not relevant as we don’t sell). If we ever share data with partners (maybe sending names to airlines counts as necessary service, not sale).
* **HIPAA (unlikely relevant)**: Not applicable unless we handle health data (we don’t).
* **COPPA (children)**: Unlikely, unless minors use the platform. If we allow child travelers, we might gather their DOB (which indicates a minor). That’s not personal data of the user (the parent likely), but we should handle minor data carefully. Likely not directly an issue here beyond data minimization and consent by guardian (if a user is booking for a child, by entering their info the guardian is consenting).
* **Error Recovery:** From a safety perspective, if something goes wrong (bug or downtime), ensure the user is not left in a bad state:

  * If our system goes down after charging card but before booking, the monitor should detect no booking and try again or refund. We mentioned possibly refunding if booking fails after payment – implement that to avoid taking money without ticket.
  * If a booking fails, ensure the user is notified to avoid them thinking it’s booked when it’s not (so they can take action).
  * Build idempotency such that even if the Edge Function is invoked twice (Supabase may retry on failure), we don’t double-book or double-charge (using idempotency keys in Stripe and Duffel as we did).
* **Team Training:** Ensure the team (or the LLM agent operators) are aware of these practices. For example, developers must not log sensitive data during debugging either, or if they do, they must remove it. Given Warp AI will autonomously implement, we encode these rules in its logic as above. Human oversight should review code diffs to ensure no obvious security slip (like printing a password or leaving a test flag on).
* **Confidentiality:** Make sure any data in memory is not persisted inadvertently. For example, if using any upstream libraries, ensure they don’t send data to third parties we don’t intend (some SDKs have telemetry; LaunchDarkly and Sentry do send usage data by design, which is okay as they are expected, but e.g. be careful with any free Redis on insecure config – we use Upstash with TLS (use `rediss://` URL) so data in transit to Redis is encrypted, and set a strong access token).
* **Incident Response:** Establish what happens if something goes wrong (though not directly part of coding):

  * If a bug caused wrongful bookings or data leak, have a plan (which likely means disabling the feature flag, notifying affected users if data was leaked per GDPR within 72 hours, and fixing the issue).
  * Use the monitoring set up to quickly catch incidents (Sentry alerts, etc., as discussed).

By rigorously applying these security and privacy practices, we fulfill legal requirements (GDPR, CCPA) and protect users’ data and funds. The implementation will not be deemed complete until a security review checklist is passed. This ensures the auto-booking system is not only powerful and observable but also trustworthy and compliant **by design**.


Understood. I’ll now produce a detailed, code-level implementation guide structured for an LLM with full codebase access. It will include explicit file and function references, necessary Supabase migrations, LaunchDarkly flag specifications, Redis lock usage, monitoring loop structure, booking orchestration logic, test coverage criteria, and CI/CD triggers.

All content will be framed so that the executing LLM can implement correctly and flawlessly without additional instruction.

I'll let you know as soon as the full implementation blueprint is ready.


# Parker Flight Auto-Booking Pipeline Implementation Guide

This guide provides a step-by-step blueprint to implement the **auto-booking pipeline** in Parker Flight. It is written for an LLM agent with full codebase access, detailing exact file changes, code scaffolds, database migrations, and best practices for a world-class implementation. All steps are gated behind a LaunchDarkly feature flag for safe rollout.

## Step 1: LaunchDarkly Feature Flag Configuration

**Feature Flag:** Create a new LaunchDarkly feature flag named `auto_booking_pipeline_enabled`. This flag will gate all auto-booking logic. In the codebase, initialize the LaunchDarkly SDK (using the server-side Node SDK) with the environment's SDK key, ensuring the client is a singleton. Use the flag to conditionally execute the pipeline:

* **Flag Evaluation:** After SDK initialization (and waiting for readiness), call `client.variation('auto_booking_pipeline_enabled', userContext, false)` to check if the pipeline is enabled. The `userContext` can include the user or environment key (e.g., targeting internal users or staging environment first). If the flag returns `false`, the auto-booking functions should **no-op** (do nothing or return immediately), ensuring the pipeline is completely disabled when the flag is off.

* **Usage in Code:** For example, in an Edge Function handler (or any relevant module), wrap the main logic:

  ```ts
  if (!(await ldClient.variation('auto_booking_pipeline_enabled', { key: userId }, false))) {
      console.log('Auto-booking pipeline disabled via LaunchDarkly');
      return { status: 202, body: 'Feature disabled' };
  }
  // ... proceed with auto-booking logic if enabled
  ```

  This ensures no booking actions occur unless the feature flag is on. The flag will serve as a **kill-switch** for rapid rollback.

* **Flag Rollout:** Configure the flag in LaunchDarkly to target only test/staging environments or specific user segments initially. For example, enable it for internal QA accounts or a small percentage of users, and keep it off globally until ready for production launch.

## Step 2: Database Schema and Migration Changes

Create a new database migration to support the auto-booking pipeline. This will include new tables for tracking flight offers and bookings, plus all necessary **RLS (Row-Level Security)** policies for compliance and security.

**Migration File:** `supabase/migrations/<timestamp>_auto_booking_pipeline.sql` (exact timestamp per your migration naming conventions).

**Tables to Add/Modify:**

* **Offers/Requests Table:** (if not existing) to store flight search results (offers) awaiting booking. For example:

  ```sql
  -- Table to store flight offers generated from searches
  CREATE TABLE IF NOT EXISTS public.flight_offers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) NOT NULL,
      offer_id TEXT UNIQUE NOT NULL,       -- Duffel offer id
      expires_at TIMESTAMPTZ NOT NULL,     -- offer expiration from Duffel
      price_currency TEXT,
      price_amount NUMERIC,
      status TEXT NOT NULL DEFAULT 'pending',  -- e.g. 'pending', 'booking', 'booked', 'failed', 'expired'
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
  );
  ```

  This table tracks each offer returned from Duffel that might be auto-booked. The `status` field will be updated as the pipeline progresses (pending -> booking -> booked, etc.).

* **Bookings Table:** to store finalized booking records (tickets):

  ```sql
  CREATE TABLE IF NOT EXISTS public.flight_bookings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      offer_id TEXT REFERENCES public.flight_offers(offer_id) ON DELETE SET NULL,
      user_id UUID REFERENCES auth.users(id) NOT NULL,
      order_id TEXT,              -- Duffel order ID (after booking)
      payment_intent_id TEXT,     -- Stripe PaymentIntent ID if used
      booked_at TIMESTAMPTZ,      -- timestamp of successful booking
      status TEXT NOT NULL DEFAULT 'booked',  -- e.g. 'booked', 'cancelled'
      created_at TIMESTAMPTZ DEFAULT now()
  );
  ```

  Alternatively, you may use a single table with a comprehensive state machine, but separating offers and bookings can simplify logic (offers for pre-booking data, bookings for confirmed tickets).

**RLS Policies:** Enable Row Level Security on these tables and create policies:

```sql
-- Enable RLS
ALTER TABLE public.flight_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flight_bookings ENABLE ROW LEVEL SECURITY;

-- Policy: allow each user to view their own offers
CREATE POLICY "Offer owner read" ON public.flight_offers
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: allow each user to insert an offer for themselves
CREATE POLICY "Offer owner insert" ON public.flight_offers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: allow each user to update status of their own offer (if needed)
CREATE POLICY "Offer owner update" ON public.flight_offers
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Similar policies for flight_bookings:
CREATE POLICY "Booking owner read" ON public.flight_bookings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Booking owner insert" ON public.flight_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- (Updates to bookings by end users are not expected; bookings are mostly written by the system.)

-- Service-role access: allow backend (Edge Function with service key) full access
CREATE POLICY "Offers service access" ON public.flight_offers
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Bookings service access" ON public.flight_bookings
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
```

These policies ensure that *authenticated users* can only see and modify their own records, while the server (using the `service_role` key in Edge Functions) can access and update records as needed for the pipeline. The service-role policies are crucial for the monitoring job to update statuses and create bookings on behalf of users.

**Sensitive Data Handling:** If passenger personal data (names, birthdates, etc.) needs to be stored (e.g., to send to Duffel for booking), consider one of:

* Storing them in separate columns in `flight_offers` or a new `passengers` table, and **encrypting** those fields using PostgreSQL encryption functions or Supabase Vault for secrets.
* Minimizing retention: store only what is necessary to complete booking and then delete or anonymize after booking to comply with GDPR data minimization principles. For instance, retain only last4 of payment or PNR code after booking, not full passport numbers, etc.

**Compliance Note:** All data is encrypted at rest by Supabase automatically and transmitted over TLS. By using RLS and restricting access to personal data, we ensure compliance with privacy regulations. Additionally, implement a data retention policy: e.g., auto-delete or anonymize old offers that expired or were completed after a certain period, to honor GDPR's data minimization and right-to-be-forgotten.

## Step 3: Stripe Payment Integration

Integrate Stripe for payment handling to achieve PCI compliance and ensure secure payment processing:

* **Stripe Setup:** Use the existing Stripe API module (if present in the codebase) or install Stripe’s Node.js SDK. Retrieve the Stripe secret key from environment configuration. The LLM agent should ensure environment variables (e.g., `STRIPE_SECRET_KEY`) are available to the functions that handle payments (do **not** hardcode keys).

* **Payment Flow:** When a flight offer is generated and the user opts for auto-booking, create a Stripe PaymentIntent for the total price:

  * **Authorization (Hold):** Create the PaymentIntent with `capture_method='manual'` if you plan to **authorize now and capture later** at booking time. This will place a hold on the user's card for the amount. Store the `payment_intent_id` in the `flight_offers` record for reference.
  * **Immediate Charge:** Alternatively, if auto-booking is confirmed immediately, you can charge (capture) at once. However, best practice is to authorize and capture only after the booking is successfully confirmed with the airline (to avoid charging for failed bookings).

  Example code (within an Edge Function handling offer creation):

  ```ts
  const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(priceAmount * 100), // in cents
      currency: priceCurrency,
      payment_method_types: ['card'],
      capture_method: 'manual',  // authorize now, capture later
      metadata: { offer_id: offerId, user_id: userId }
  });
  // Store paymentIntent.id in DB for later capture
  ```

  Ensure to handle Stripe exceptions and log them appropriately.

* **Launching Booking (Capture Payment):** In the booking step (Step 6), once ready to confirm the booking:

  * Confirm the PaymentIntent (if not already confirmed) and capture the funds via `stripe.paymentIntents.capture(paymentIntentId)`. This will charge the user’s card. Use the Stripe idempotency key or PaymentIntent reuse to avoid double-charging in case of retries.
  * If the Stripe charge fails, mark the booking as failed and do not call Duffel to create the order. If it succeeds, proceed to Duffel booking.

* **Stripe Webhooks:** Set up a Stripe webhook handler (e.g., `supabase/functions/stripe-webhook.ts`) to listen for asynchronous payment events (optional but recommended). For example, listen for `payment_intent.succeeded` or `payment_intent.payment_failed` events as a fallback to catch any delayed outcomes. This ensures the system can react if a payment capture succeeds after a slight delay or fails unexpectedly. (Remember to secure the webhook endpoint and verify Stripe signatures.)

Using Stripe offloads sensitive credit card handling to a PCI-compliant provider. **No raw card data** should ever be stored on our servers – we only store the PaymentIntent ID and perhaps a customer ID or token. This aligns with enterprise security standards (e.g., Upstash’s own policy is to use Stripe and not store card details on their servers).

## Step 4: Duffel API Integration for Flight Offers and Bookings

Utilize the Duffel API (via their SDK or direct HTTP calls) for flight search, offers, and booking. The LLM agent should modify or create modules to interface with Duffel:

* **API Access:** Ensure the Duffel API access token is stored securely (e.g., in an environment variable `DUFFEL_ACCESS_TOKEN`). Do **not** commit it in code. If using Supabase Edge Functions, store it via the Supabase secrets manager (Vault) and load it via `Deno.env.get()`.

* **Flight Search & Offer Creation:** When a user searches for flights (likely via an existing endpoint), the system should call Duffel to fetch flight offers. This can be done by creating an Offer Request and then retrieving Offers:

  * Use Duffel’s JavaScript client: e.g.

    ```ts
    import { Duffel } from '@duffel/api';
    const duffel = new Duffel({ token: Deno.env.get('DUFFEL_ACCESS_TOKEN')! });
    // 1. Create an offer request
    const offerReq = await duffel.offerRequests.create({
       slices: [ { origin, destination, departure_date } ],
       passengers: [ { type: 'adult' } ]
    });
    // 2. Retrieve offers for that request
    const offers = await duffel.offers.list({ offer_request_id: offerReq.data.id });
    ```

    Parse the returned offers and pick the best or the selected one by the user. Save the chosen offer to the `flight_offers` table:

    ```ts
    await supabase.from('flight_offers').insert({
       user_id: userId,
       offer_id: chosenOffer.id,
       expires_at: chosenOffer.expires_at,
       price_currency: chosenOffer.total_currency,
       price_amount: chosenOffer.total_amount,
       status: 'pending'
    });
    ```

    The `expires_at` from Duffel is crucial, as it tells us how long the offer is valid (usually \~30 minutes). Also store any other info needed for booking (e.g., slice IDs, passenger counts) either in separate fields or a JSONB column.

* **Order (Booking) Creation:** To actually book the flight, call Duffel’s Orders API. Duffel requires the `offer_id`, payment, and passenger details to create an order:

  * Prepare passenger data. Use the info collected from the user (names, DOB, etc.). Duffel may require a *passengers* array with each passenger’s details (name, gender, born\_on, etc.) and *payments* info.

  * Call the create order API. For example (pseudo-code):

    ```ts
    const order = await duffel.orders.create({
      offer_id: offerId,
      passengers: [ { id: passengerId, title, gender, given_name, family_name, born_on } ],
      payments: [ 
        {
          type: 'balance', 
          amount: chosenOffer.total_amount, 
          currency: chosenOffer.total_currency 
        } 
      ]
      // The 'payments' field tells Duffel how you will pay for the order.
      // 'balance' uses Duffel's pay-as-you-go balance or Duffel Payments system.
      // Alternatively, if using Duffel Payments with a card, this would include card token.
    });
    ```

    If you use **Duffel Payments** (optional), you might provide payment card details or a token; however, since we use Stripe for user payment, the simplest approach is to use Duffel’s balance payment (i.e., Parker Flight maintains a balance or credit card on Duffel’s side).

    **Important:** Wrap the Duffel order creation in error handling and idempotency (discussed in Step 7). If Duffel returns an error (e.g., offer expired or price changed), catch it, record the failure, and possibly notify the user.

  * On success, Duffel returns an Order object with an `order_id` (store this in `flight_bookings.order_id`), booking reference, eticket details, etc. Update the DB: set the `flight_offers.status = 'booked'`, create a row in `flight_bookings` with status 'booked', and fill relevant data (order\_id, booked\_at timestamp, etc.).

  * If the offer expired or booking failed (Duffel can return specific error messages), update status to 'failed' or 'expired' accordingly. This will signal the monitoring loop (and user interface) that no booking occurred. All failures should be logged and sent to Sentry for debugging (see Step 8).

**Note:** The Duffel client will throw exceptions for HTTP errors; ensure the LLM agent writes try/catch blocks around `orders.create`. Use Duffel’s `error.meta.request_id` in logs to assist in debugging with Duffel support if needed.

## Step 5: Edge Function for Flight Search and Offer Generation

**File:** `supabase/functions/flight-search.ts` (for example). This function will handle the *flight search → offer generation* part of the pipeline.

**Trigger:** Likely an HTTP invocation from the client when the user initiates a search or when they request an auto-book.

**Implementation:**

1. **Feature Flag Check:** At the top, check `auto_booking_pipeline_enabled`. If disabled, consider either:

   * A) Return a response indicating the feature is unavailable (if the front-end should handle it gracefully).
   * B) Or proceed with just searching flights but not auto-booking (maybe degrade to manual booking mode). Decide based on product requirements. For safety, it's fine to simply abort when off.

2. **Parse Input:** Accept search parameters (origin, destination, dates, passenger info, etc.) from the request body.

3. **Call Duffel Search:** Use Duffel API to perform the flight search and get offers (as outlined in Step 4). Possibly use Duffel’s Offer Requests API:

   * Create an offer request with given criteria.
   * Poll or retrieve offers synchronously (Duffel might return them immediately in the response or via subsequent call).

4. **Select Offer:** Apply any business logic to choose the best offer (e.g., cheapest or fastest) or parse the list for user selection. If this is an auto-book scenario without user input, you might pre-select the top offer.

5. **Payment Preparation:** Create a Stripe PaymentIntent (Step 3) if you intend to immediately secure payment. This ensures the user has provided payment info and the funds are reserved for booking. If the user hasn’t provided payment details yet, you might instead return the offer to the front-end for confirmation along with a client-side payment collection flow.

6. **Database Write:** Insert the offer and related info into `flight_offers` table (status 'pending'). Include references to PaymentIntent (if created) and set `expires_at` from Duffel so the system knows the deadline.

7. **Response:** Return the offer details (flight itinerary, price, expiration time) to the client. **Do not** return sensitive internal IDs or PaymentIntent secrets; just enough for user confirmation UI if needed. For example:

   ```json
   {
     "offer_id": "...",
     "itinerary": { ... },
     "price": 123.45,
     "expires_at": "2025-08-01T12:00:00Z"
   }
   ```

   The client can show a countdown until `expires_at` to inform the user.

8. **Launch Monitor:** In some designs, the monitor (Step 6) will automatically pick up this new offer. If immediate booking is desired (truly “auto”-booking), you might also directly trigger the booking logic here (though typically we let the monitor cron handle it to allow some delay or conditions). Ensure not to duplicate booking both here and in the monitor.

**Concurrency Consideration:** Because this function might be called by many users, ensure any heavy operations (Duffel API calls) are awaited properly. Also, restrict or rate-limit how many searches a single user can trigger (to avoid abuse or excessive cost). You could integrate a simple rate-limit using Upstash Redis (increment a counter for searches per user and check) or use Supabase’s rate limiting if available.

## Step 6: Edge Function for Monitoring & Auto-Booking (Cron)

**File:** `supabase/functions/auto-book-monitor.ts`. This function runs on a schedule (e.g., every 5 minutes) to check pending offers and execute bookings.

**Scheduling with pg\_cron:** Use Supabase’s pg\_cron to schedule this function. In the migration SQL, add a job after creating the function:

```sql
-- Store secure function call info in Vault (executed once)
SELECT vault.create_secret('https://<project>.supabase.co', 'project_url');
SELECT vault.create_secret('<SUPABASE_ANON_KEY>', 'anon_key');

-- Schedule the auto-book monitor function to run every 5 minutes
SELECT cron.schedule(
  'auto_book_monitor_job',               -- job name
  '*/5 * * * *',                         -- cron expression: every 5 minutes
  $$
    SELECT net.http_post(
      url    := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/auto-book-monitor',
      headers:= jsonb_build_object(
                  'Content-Type', 'application/json',
                  'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
                ),
      body   := '{}'::jsonb  -- pass an empty JSON payload
    );
  $$ 
);
```

This uses `pg_net` to make an HTTP POST to the Edge Function. The URL and anon key are securely fetched from Vault (as shown in Supabase docs). Every 5 minutes, the database will invoke our `auto-book-monitor` function.

**Monitor Logic in `auto-book-monitor.ts`:**

1. **Acquire Global Lock (Optional):** To ensure only one instance runs at a time (in case of overlapping schedules or manual triggers), implement a **distributed lock**. Use Upstash Redis for this:

   * Attempt to set a Redis key like `auto_book_monitor_lock` with NX (if not exists) and an expiry (e.g., 4 minutes to cover the function run time). If the key already exists, it means a previous monitor run is still in progress; in that case, this invocation should exit to avoid concurrency overlap.
   * For example:

     ```ts
     import { Redis } from "@upstash/redis";
     const redis = Redis.fromEnv();
     const lockKey = "locks:auto_book_monitor";
     const acquired = await redis.set(lockKey, "1", { nx: true, ex: 240 });  // 240s = 4 minutes
     if (!acquired) {
       console.log("Another monitor is running, exiting.");
       return { status: 202, body: "Locked" };
     }
     // proceed if lock acquired
     ```

     This lock ensures mutual exclusion for the critical section. (Using the upstash/lock library is another option for a robust locking pattern with automatic lease renewal, but the above simple NX key is sufficient for short jobs.)

2. **Fetch Pending Offers:** Query the `flight_offers` table for offers that are still `status='pending'` (or 'pending' or 'offer\_created' depending on your naming) and need booking:

   * Prioritize those whose `expires_at` is approaching or just all pending ones each run. For example,

     ```ts
     const { data: offersToBook } = await supabase.from('flight_offers')
       .select('*')
       .eq('status', 'pending');
     ```

     If the table is large, filter by `expires_at <= now() + interval '5 minutes'` to catch those expiring soon.

3. **Iterate & Book:** For each pending offer:

   * (Feature flag check: The monitor function should also respect the `auto_booking_pipeline_enabled` flag. If the flag is off, the monitor can skip processing entirely or early exit. Alternatively, the cron job itself could be created/enabled only when the flag is on, but it's safer to double-check the flag in code.)

   * Update status to 'booking' (possibly optimistically) to mark that this offer is being processed. This can prevent another monitor iteration from picking it up simultaneously. Example:

     ```ts
     await supabase.from('flight_offers')
       .update({ status: 'booking', updated_at: 'now()' })
       .eq('id', offer.id)
       .eq('status', 'pending');  // only update if still pending, to avoid race
     ```

     Using the `eq('status','pending')` in the update acts as a check that ensures we only claim it if it's still pending (helps in race conditions).

   * Retrieve necessary details: passenger info, paymentIntent ID, etc (likely you stored them in `flight_offers` or can join with other tables). If any required info is missing, log error and skip.

   * **Payment Capture:** If using the two-phase payment approach:

     * Confirm & capture the PaymentIntent via Stripe API:

       ```ts
       await stripe.paymentIntents.capture(offer.payment_intent_id);
       ```

       Handle errors: if capture fails, update `flight_offers.status = 'failed'` and possibly notify user (via email or push).
       If success, proceed.

   * **Duffel Booking:** Call Duffel Orders API to create the order (see Step 4). Pass the `offer.offer_id` and passenger details. Use idempotency safeguards:

     * Generate an idempotency key (e.g., use the `flight_offers.id` or `offer.offer_id` as a natural idempotency key) when calling Duffel. If using their SDK, you might set an `Idempotency-Key` header via their client config or do manual fetch with that header. This prevents duplicate bookings if the function accidentally retries the same call.
     * **Retry Logic:** Wrap the Duffel call in a retry mechanism for transient errors (e.g., network issues). Use an exponential backoff strategy but **avoid** retrying if Duffel responded with a definitive error (like "offer expired" or payment declined). Those cases are non-retryable logic errors. For network timeouts or 5xx errors, you can safely retry once or twice. Ensure idempotency key is in place to avoid creating two orders on a successful retry.

   * **Update Database:** On successful booking:

     * Insert a row into `flight_bookings` with `user_id`, `offer_id`, `order_id` (from Duffel’s response), `status='booked'`, `booked_at = now()`.
     * Update the corresponding `flight_offers.status = 'booked'` (and perhaps store a reference to the booking record or order ID).
     * If the Duffel order response includes e-ticket or PNR information, store it in the booking record (or a related table) for later retrieval by the user.

   * On failure (exception or Duffel error):

     * Update `flight_offers.status = 'failed'` (or 'expired' if Duffel indicates the offer was expired).
     * If payment was captured but booking failed (this is rare if using Duffel’s balance payment; if using Duffel Payments with card token, you might not capture via Stripe until after Duffel confirms booking to avoid this scenario), you may need to issue a refund via Stripe to avoid charging the user without a booking. Stripe refunds can be done by `stripe.refunds.create({ payment_intent: offer.payment_intent_id })` if needed.
     * Log detailed error info to Sentry (with context like offer ID, Duffel error message).

   * **Communication:** For each booked offer, trigger communications:

     * Send a confirmation email to the user with their itinerary and confirmation number. You can use a service like Resend or SMTP via an Edge Function. (If using an external email service, ensure API keys are configured and do not log PII in the request.)
     * Update any analytics or tracking (maybe insert a log into an `analytics_events` table, or send an event to an analytics system indicating a booking happened).

4. **Release Lock:** After processing all offers, release the Redis lock:

   ```ts
   await redis.del(lockKey);
   ```

   (If you used the `@upstash/lock` library’s Lock object, call `lock.release()`.)

5. **Return Result:** The function can return a summary of actions, but since it’s cron-triggered, the result is mostly for logging. You might return something like `{ status: 200, body: 'Processed X offers' }`.

**Cron Idempotency & Overlap:** The monitor job runs frequently, so design it to handle cases where an offer might be picked up slightly late or twice:

* Thanks to status updates and the lock, an offer shouldn’t be double-processed. But if the cron overlaps or runs slower than interval, your lock prevents concurrent runs. In case a previous run is still going when the next triggers, it will safely exit due to the lock, as implemented above.
* Ensure one monitor run can handle multiple offers if many come in within a 5-minute window. If processing many bookings might exceed the 5-minute interval, consider either shortening the interval or processing only a limited number per run and leaving the rest for next run (with a clear strategy to not starve some offers).

**Accuracy:** Always check `expires_at`. If an offer is found to be expired (e.g., now > expires\_at) before booking, mark it expired and skip calling Duffel. This avoids sending invalid requests and keeps data accurate.

## Step 7: Concurrency Control and Idempotency

Building an enterprise-grade pipeline requires careful handling of concurrency and duplicate execution:

* **Distributed Locks:** As discussed, use Redis (Upstash) to synchronize the monitor job and potentially other critical sections. The `SETNX` pattern with expiration ensures atomic lock acquisition. For per-offer locking (if needed when processing in parallel), you could lock on a key like `lock:offer:<offer_id>` while booking that specific offer, to prevent two processes from booking the same offer simultaneously. This might be relevant if you allow manual booking and auto-booking to race, but generally the system design should avoid two different processes acting on one offer.

* **Database Constraints:** Add unique constraints where appropriate to avoid duplicates:

  * `flight_offers.offer_id` was defined UNIQUE, so you cannot insert the same Duffel offer twice.
  * You might also add a unique constraint on `flight_bookings.order_id` to avoid duplicating an order record.
  * Consider using the database to track idempotency: e.g., have an `idempotency_key` column on `flight_bookings` and ensure uniqueness. The pipeline can generate a UUID for each booking attempt and store it before calling external APIs.

* **Idempotent External Calls:** Use idempotency keys for Stripe and Duffel:

  * Stripe: When creating or capturing PaymentIntents, you can supply an `idempotency_key` in the options to ensure retrying the request won’t duplicate the charge.
  * Duffel: The Duffel API allows an `Idempotency-Key` header on requests. Configure the Duffel SDK or HTTP client to send a consistent key for a given offer’s booking. For example, use the `flight_offers.id` (UUID) as the key for creating the order. If a retry occurs, Duffel will return the same order or indicate the prior request was successful, preventing double bookings.

* **Retry & Backoff:** Implement retries with care:

  * Only retry on transient errors (network failure, 5xx from Duffel). Use a small number of attempts (e.g., 3) with exponential backoff (e.g., 1s, 3s, 5s).
  * Avoid retry loops on user-triggered functions (like search) to keep latency low; those should fail fast and let the user retry manually if needed.
  * The monitor function can attempt a retry on booking if a network glitch occurs, but ensure it does not loop indefinitely. Log all retry attempts.

* **Concurrency Safety in Code:** If the codebase is Node.js and uses promises/async, ensure that any shared resources (like global variables or caches) are protected. In our Edge Function context (Deno), each invocation is isolated, so global state is less of an issue, but if any in-memory caching is done, be cautious of race conditions.

* **Testing for Race Conditions:** Write tests simulating two parallel processes trying to book the same offer to ensure our locking and checks prevent double booking (the expected result is only one succeeds and the other aborts).

## Step 8: Logging and Observability Setup

Implement comprehensive logging and monitoring for the pipeline:

* **Structured Logging:** In each function (search, monitor, etc.), use structured logs that include identifiers like `offer_id`, `user_id`, and operation type. For example:

  ```ts
  console.log(JSON.stringify({ level: 'info', event: 'offer_created', offer_id, user_id, price }));
  ```

  This makes it easier to filter logs for a specific booking pipeline in services like Datadog or CloudWatch. Stick to JSON or consistent key=value logs if possible.

* **Sensitive Data Scrubbing:** **Never log PII** or sensitive info. Mask or omit passenger names, emails, payment details from logs. For instance, log `offer_id` and not the passenger name. If logging errors that may contain such info, sanitize the message (e.g., Duffel errors might include the passenger name if mis-formatted – handle such cases).

* **Exception Tracking (Sentry):** Integrate Sentry using its Deno SDK for Edge Functions. In the Edge Functions, initialize Sentry with the DSN (from env) and wrap the main handler logic in a try/catch that reports exceptions:

  ```ts
  import * as Sentry from "https://deno.land/x/sentry@<version>/mod.ts";
  Sentry.init({ dsn: Deno.env.get('SENTRY_DSN'), release: 'auto-booking-pipeline@1.0.0' /* etc */ });
  ```

  In the catch block:

  ```ts
  } catch (error) {
    console.error(error);  // still log to console
    Sentry.captureException(error);
    return { status: 500, body: "Internal error" };
  }
  ```

  This ensures any unexpected errors in the pipeline (Duffel API failures, coding bugs, etc.) generate alerts. Tag Sentry events with context like `offer_id` and environment (`SB_REGION`, etc. as shown in Supabase docs).

* **Performance Monitoring:** Use Sentry’s performance tracing or LaunchDarkly’s observability (if integrated) to measure latency of key operations (search, booking). Also, log timing info manually: e.g., record the start and end time of Duffel API calls and compute duration. This helps identify slow points (like if Duffel’s API latency is high or Stripe operations are slow).

* **Datadog Integration:** If the project uses Datadog for metrics, consider emitting custom metrics:

  * Number of searches, number of successful bookings, number of booking failures.
  * You can use Datadog’s HTTP API to send events or metrics from the Edge Function (requires an API key, treat it as secret). Alternatively, if logs are forwarded to Datadog, use log-based metrics.
  * Example: `console.log("METRIC#auto_bookings.success:1|c")` (Datadog can parse custom metric formats from logs if configured).

* **Analytics and Auditing:** Insert records into an audit or analytics table for important events (especially for compliance):

  * For instance, a `booking_audits` table where you log `user_id`, `offer_id`, action (`"BOOKED"` or `"FAILED"`), timestamp, and a message or error code. Ensure this table has strict RLS (maybe only service role can read, to preserve privacy).
  * This provides an internal ledger of what happened, useful for debugging and for any future audits (e.g., proving that a booking was made automatically with user consent).

* **Alerting:** Set up alerts for anomalies:

  * For example, if `booking_failed` events occur, or the monitor function throws exceptions, have Sentry or Datadog trigger alerts to the dev team.
  * If using LaunchDarkly, consider a flag trigger: LaunchDarkly can send an alert if a flag is toggled off unexpectedly (which you might do in an emergency). Ensure team knows that turning the flag off is the primary emergency rollback mechanism.

## Step 9: Testing Strategy (Unit, Integration, E2E)

Design a comprehensive test suite to ensure the pipeline works as expected and is robust against regressions:

* **Unit Tests:** For each module and function:

  * **Edge Functions:** Use Deno’s built-in testing (`Deno.test`) or a Node test runner if code is portable. Since Edge Functions run in Deno, you can use `deno test` locally. Write tests for helper functions (e.g., price formatting, offer selection logic, lock acquisition logic).
  * **Flag Logic:** Write a unit test for the LaunchDarkly gating. For example, mock the LaunchDarkly client to return `true` or `false` and assert that when false, the function returns early without side effects. This ensures **flag-based coverage**: one test covers the path when feature is enabled, another when disabled.
  * **Duffel API mocks:** For unit tests, do not call the real Duffel API. Instead, mock `duffel.offers.list` and `duffel.orders.create`. The LLM agent can either use dependency injection (pass in a Duffel client instance to the function) or monkey-patch the module in tests. Simulate responses: e.g., Duffel offers list returns a fake offer, orders.create returns a fake order confirmation. Test handling of responses and errors (throw an error in the mock to simulate Duffel error and verify the code marks status failed as expected).
  * **Stripe mocks:** Similarly, simulate Stripe’s responses (PaymentIntent creation and capture). Ensure the code responds correctly (e.g., throws on capture failure).

* **Integration Tests:** These tests run the whole pipeline in a controlled environment (e.g., staging or using test keys):

  * Use Duffel **test mode** (Duffel provides test API keys and a sandbox environment). Similarly use Stripe test mode keys.
  * Write a test that triggers the `flight-search` function with sample input and then triggers (or waits for) the `auto-book-monitor` to run, and finally checks the database for a `flight_bookings` record.
  * You can run the monitor function manually in tests (call the handler directly) instead of waiting for cron.
  * Confirm that: the booking was successful (status updated), PaymentIntent was captured (check via Stripe API with test key for a charge), and Duffel order was created (using test environment calls or the response from the stubbed Duffel client).
  * Test edge scenarios: expired offer (simulate an offer that expires very soon, and advance time or call monitor after expiry to see it marks as expired), payment failure (simulate Stripe throwing an error on capture), Duffel price change (simulate Duffel returning an error indicating the price is no longer valid, ensure system handles gracefully).

* **E2E Tests:** If possible, run a full end-to-end test in a staging environment:

  * With the flag on in staging, trigger an actual search and booking using dummy passenger data. Perhaps have Duffel book a real test flight (Duffel test mode doesn’t create real tickets, but returns a realistic confirmation). Verify the user receives a confirmation email (use a test email or a faux SMTP capture).
  * Include front-end if applicable: e.g., use Playwright or Cypress to simulate a user search, auto-book opt-in, and then verify a "success" message appears and the DB has the record.
  * Ensure cleanup after tests: void any PaymentIntents or cancel Duffel orders if possible (Duffel might not allow cancel in test easily, but since it's test mode it’s fine).

* **LaunchDarkly Flag Test:** It’s crucial to test that toggling the flag truly enables/disables the pipeline:

  * In staging, set `auto_booking_pipeline_enabled = false`. Run a search and ensure no booking is made (the offer might still be saved, but monitor should skip it). Then set flag true and run again, now booking should happen. This double-run ensures the flag effectively gates the flow.

* **Coverage Expectations:** Aim for high coverage on the pipeline modules, especially the critical path of booking execution. The flag gating logic should be covered in tests both on and off. Additionally, tests for RLS can be included: e.g., attempt to read another user’s offer with RLS (simulate by using an API call with a user’s JWT) to confirm it’s forbidden – this ensures our policies are correct.

* **CI Integration:** Configure the CI/CD (GitHub Actions or similar) to run all the above tests on each push. Use a test database (or the Supabase CLI with a local instance) for running migration and tests in isolation. Also run `supabase db diff` or similar to verify migrations apply cleanly.

## Step 10: CI/CD Deployment and Rollout Plan

Incorporate the auto-booking pipeline into the continuous deployment workflow with careful rollout controls:

* **Feature Branch and Merge:** Develop the feature in a separate branch. Ensure all tests (including new ones) pass in CI. When merging to `main` (or deploying branch), the code for the pipeline will go live but **latent** (inactive by flag).

* **Migrations in CI:** When deploying, include a step to apply the new database migrations. For Supabase, you might use `supabase db push` or run the SQL scripts. Ensure the migrations are run on staging and production in the correct order. The `cron.schedule` for the monitor will be set up by the migration, but consider wrapping it in the LaunchDarkly flag as well:

  * You might choose not to create the cron job in production until the feature is enabled. One strategy: conditionally run the cron setup SQL only on staging for initial testing. However, since the flag will prevent the function from doing anything, it is generally safe to schedule it even if flag is off (the function will exit quickly). If you're very cautious, you can leave the cron job out initially and create it via a migration only when ready to activate.

* **Environment Configuration:** Update environment variables in CI for production/staging:

  * `LAUNCHDARKLY_SDK_KEY` (for server-side SDK in the functions if used).
  * `STRIPE_SECRET_KEY` (test key in staging, live key in prod).
  * `DUFFEL_ACCESS_TOKEN` (test vs live).
  * `SENTRY_DSN`, `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for Redis, etc.
  * These should be stored in the platform’s secret manager. For Supabase, use the `supabase secrets set` command to set them, and commit no secrets to repo.

* **Staging Deployment:** Deploy to a staging environment first. Enable `auto_booking_pipeline_enabled` **only in staging** LaunchDarkly environment (LaunchDarkly supports different values per environment). This allows testing the feature end-to-end without affecting real users.

* **Dark Launch in Production:** Deploy the code and migrations to production with the flag still **off**. This is a dark launch – code is live but dormant. Monitor logs and performance to ensure nothing unexpected is happening (with the flag off, the pipeline should not run; verify that no monitor jobs are doing work except perhaps logging "feature disabled").

* **Gradual Rollout:** When ready, turn on the flag for a small subset in production:

  * Perhaps enable for internal users first (by user ID targeting).
  * Then enable for, say, 5% of real users or a specific beta group. Because the pipeline involves payments and real bookings, you might choose a small cohort or even one-by-one manual enablement for first few bookings to observe behavior.
  * Use LaunchDarkly’s metrics and events: ensure that flag change does not cause errors (Sentry should remain quiet or only log expected minor issues).

* **Monitoring During Rollout:** Closely watch Sentry and logs when the feature is enabled in prod for the first time. Also monitor external systems: Stripe (no unusual charges or declines spikes) and Duffel (check their dashboard for any errors or rate limit warnings).

* **Rollback Plan:** If any critical issue arises, immediately disable `auto_booking_pipeline_enabled` in LaunchDarkly for all users. This instantaneous kill-switch ensures no further bookings will be attempted by the system. The code will remain deployed, but dormant. You should also:

  * Cancel any in-progress cron jobs if they are stuck (the cron will still call the function, but the function will exit early due to flag off).
  * Fix the issue or revert the code if needed. Since the flag is off, you have time to patch without user impact.
  * If necessary, you can also use CI to roll back to a previous deployment, but often just turning off the flag is sufficient to stop the behavior while leaving other new code intact.

* **LaunchDarkly Metrics:** Use LaunchDarkly’s built-in metrics/experimentation features if set up. For example, track a custom metric “Booking Success Rate” correlated with the flag. This can help decide when the feature is stable enough to roll out 100%.

* **Full Launch:** Once confidence is high (no errors in Sentry, successful bookings processed), enable the flag for 100% of users. Keep the flag in place even after full rollout for a cooldown period (in case quick disable is needed if something unexpected comes up). Eventually, once the feature has proven stable, you can plan to remove the flag and related conditional code as part of a future cleanup (and deprecate the dark launch logic).

* **CI Checks for Flag Usage:** Ensure that in CI, there are tests or lint rules to catch if the flag is accidentally being ignored in new code. All new auto-booking logic should reference the flag (we’ve done so in each function). This avoids partial activation.

## Step 11: Security and Privacy Compliance

Throughout the implementation, adhere to security best practices and legal compliance (GDPR, CCPA, etc.):

* **Data Minimization:** Only store data that is necessary for the booking. For instance, do not store full credit card numbers (Stripe handles that). Limit what passenger info is stored; if you only need it to send to Duffel and email the user, you might not need to persist it long-term. Consider purging or anonymizing sensitive personal data after use. For example, after a flight date passes, you could remove passport numbers or even delete the booking record (or at least scrub PII) unless needed for business analytics.

* **Encryption:** For any sensitive fields (personal info, payment references), use encryption at rest. Supabase’s database is encrypted by default at the disk level. For additional application-layer encryption, you could use the `pgcrypto` Postgres extension or store data in Supabase Vault (which keeps secrets encrypted). If regulations demand, encrypt data like passenger contact info in the table using `PGP_SYM_ENCRYPT()` with a key from an env var.

* **Access Control:** RLS policies (as set up) ensure users can’t access others’ data. Also, ensure all Supabase RPC or function calls that modify data use the appropriate role:

  * The Edge Functions should use the service role JWT (so they bypass RLS only as intended and can perform system actions). Ensure the service\_role key is kept secret and only used server-side.
  * If any part of the pipeline is exposed via a client (e.g., maybe flight search is open to client with user JWT), double-check that queries are limited to that user’s data (our policies cover that).

* **Audit Logging:** Maintain an audit trail of bookings (as mentioned in Logging section). This not only helps debugging but also compliance audits. For example, if a user disputes an automatic charge, you can show a log "User X enabled auto-book for flight Y on date Z, system booked on date W."

* **User Consent:** Ensure the front-end flow clearly obtains user consent for auto-booking (especially if auto-charge is happening). This might be out of scope for the code implementation, but as a note: have a checkbox or similar that user agrees to book automatically and charge their card. Store this consent (could be a boolean in the `flight_offers` table like `user_auto_confirmed TRUE`).

* **GDPR Compliance:** Implement the ability to delete user data:

  * If a user requests account deletion, all their flight\_offers and flight\_bookings should be deleted. Set up a cascade or a scheduled job to scrub those upon deletion. Since we link to `auth.users`, if using Supabase Auth, consider using ON DELETE CASCADE on those foreign keys or listen to auth user deletion events.
  * Remove personal identifiers when not needed. For instance, instead of storing full DOB in plain text, you might just store age or nothing at all after booking is done.

* **PII in Third Parties:** Be mindful of what data you send to third-party APIs:

  * Duffel will receive PII (passenger names, etc.). Ensure Duffel is a compliant processor (Duffel’s GDPR compliance should be checked). Use their data handling features if available.
  * Stripe handles payment info; we already avoid storing card data ourselves, using Stripe ensures PCI compliance and strong security.
  * LaunchDarkly gets user context (we might use user ID or an anonymous context for the flag). Do not send highly sensitive info to LaunchDarkly context; user key or a segment flag is fine (LaunchDarkly is GDPR-compliant but still minimize context data).

* **Secure Secrets:** All API keys (Stripe, Duffel, LaunchDarkly, Sentry DSN, Redis URL/token) must be stored securely. In Supabase, use `supabase secrets` (which back these by a secure store). The code should access them via `Deno.env.get()` and never log them. In CI, ensure these secrets are added to the production environment config.

* **Code Security:** The LLM agent should also implement any linting or scanning as part of CI (if not already) – e.g., run `supabase audit` or other tools to catch vulnerabilities.

  * Ensure no SQL injection is possible in our queries (using Supabase client library protects against that).
  * Validate inputs in the search function (e.g., origin/destination should be IATA codes or known format, to prevent any malicious input).
  * Use HTTPS for all external requests (by default Stripe and Duffel libs use HTTPS endpoints).

* **Compliance Documentation:** Update your privacy policy or documentation to reflect this feature if needed (for example, stating that you will store personal data needed to book flights and share with airline partners through Duffel, etc.). From a code perspective, include comments and maybe internal README notes about data flows, to aid future reviews or audits.

* **Regulatory Checks:** If any specific US regulations (like DOT or TSA data handling rules for passenger info) apply, ensure to follow those. For example, Secure Flight data (TSA) might require capturing gender and DOB – our pipeline should ensure these are collected and passed correctly. Also, if storing TSA info, treat it as sensitive.

Finally, after implementing all steps above, the LLM agent should have a complete, testable, and secure auto-booking pipeline. By following this guide literally, the agent will produce code and configuration that aligns with enterprise standards: feature-flagged for safe rollout, thoroughly logged and monitored, safe in concurrent scenarios, and compliant with data security regulations.
