# Traveler Data Architecture for Auto-Booking Campaigns

## Executive Summary

Parker Flight is implementing a critical auto-booking campaign feature that requires secure storage and handling of sensitive traveler data for up to 12 months. This document outlines a security-first architecture that balances maximum security with optimal user experience while ensuring regulatory compliance.

### Challenge
The auto-booking feature must store personal information and payment methods to automatically book flights via the Duffel API. This contrasts with the existing manual search flow, which remains stateless and handles no sensitive data.

### Solution Architecture
A **hybrid security-first architecture** that:
- **Separates concerns**: Manual search remains stateless; auto-booking handles all sensitive data in isolated, hardened systems.
- **Tokenizes payment data**: All card information stored via Stripe's PCI-compliant vault
- **Encrypts personal data**: Application-level encryption for all PII in Supabase PostgreSQL
- **Unifies user experience**: Single traveler profile reusable across both flows with proper consent
- **Implements zero-trust**: Every data access point secured with encryption, authentication, and audit logging

### Key Technical Decisions
1. **Supabase PostgreSQL** with Row-Level Security for core data storage
2. **Stripe tokenization** for all payment method storage (zero raw card data)
3. **Application-level AES-256-GCM encryption** for passport numbers and sensitive PII
4. **Duffel API** for flight booking with just-in-time data transmission
5. **Optional identity verification** via Stripe Identity or Persona for high-value transactions

### Compliance Framework
- **GDPR/CCPA**: Data minimization, user rights (access, deletion, portability), explicit consent
- **PCI DSS**: SAQ-A compliance via Stripe tokenization, no card data storage
- **SOC 2 Type II**: Target certification within 18 months with continuous monitoring
- **Travel regulations**: TSA Secure Flight and APIS compliance for international bookings

### Implementation Timeline
- **Phase 1 (0-3 months)**: ✅ **COMPLETED** - MVP with basic secure storage and single-traveler campaigns
- **Phase 2 (3-12 months)**: 🚧 **IN PROGRESS** - Production hardening, compliance preparation, security audits
- **Phase 3 (12-18 months)**: 📋 **PLANNED** - Multi-traveler support, international expansion, enterprise features

### Phase 1 Completion Status (June 2025)
All Phase 1 objectives have been successfully implemented:
- ✅ Core database schema with encryption and RLS
- ✅ Secure traveler profile management with AES-256 encryption
- ✅ Payment tokenization via Stripe (PCI DSS SAQ-A compliant)
- ✅ Campaign management and auto-booking engine
- ✅ Comprehensive audit logging system
- ✅ Row Level Security and JWT authentication
- ✅ Duffel API integration for flight booking
- ✅ Production-ready Edge Functions deployed

### Phase 2 Implementation Progress (June 2025)
Key Phase 2 features have been implemented:
- ✅ **Identity Verification System** - Stripe Identity integration for high-value bookings
- ✅ **Multi-Currency Support** - Exchange rate caching and international pricing
- ✅ **Security Audit Completed** - Comprehensive security assessment with Grade A
- ✅ **SOC 2 Preparation Plan** - Roadmap for Type I certification by December 2025
- 🚧 **Enhanced Rate Limiting** - In progress for API endpoints
- 🚧 **SIEM Integration** - Security monitoring enhancement planned
- 📋 **Penetration Testing** - Scheduled for Q3 2025
- 📋 **Policy Documentation** - Formal security policies in development

### Risk Mitigation
Comprehensive security controls including encrypted backups, disaster recovery procedures, vendor SLA management, and continuous monitoring to achieve "zero tolerance for data breaches."

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Data Flow  Security](#data-flow--security)
3. [Storage Strategy](#storage-strategy)
4. [Compliance Framework](#compliance-framework)
5. [Implementation Roadmap](#implementation-roadmap)
6. [Risk Assessment](#risk-assessment)
7. [Performance  Scalability](#performance-scalability)
8. [Disaster Recovery](#disaster-recovery)
9. [Code Examples](#code-examples)
10. [Conclusion](#conclusion)
11. [Appendix: Detailed Analysis](#appendix-detailed-analysis)

---

## Introduction

This document outlines the data architecture for managing traveler data within the auto-booking campaigns feature. It focuses on secure data handling, storage practices, and integration with other system components.

## Objectives

- Securely manage and store traveler personal and payment information
- Ensure compliance with regulatory standards (e.g., GDPR, PCI-DSS)
- Provide scalability to support future feature expansions such as multi-traveler support
- Offer robustness through real-time processing and high availability

## Data Flow

1. **Data Collection**
   - **Input**: Traveler information collected through frontend web forms
   - **Validation**: Client-side validation to ensure correct data format before submission

2. **Data Transfer**
   - **Encryption**: All data in transit must be encrypted using TLS 1.2 or higher
   - **API Gateway**: Use API Gateway to handle requests and apply throttling, caching, and validation

3. **Data Processing**
   - **Service Layer**: Utilize microservices to manage data processing, such as data normalization and enrichment
   - **Queue System**: Implement a queuing system like Kafka for asynchronous processing and real-time updates

4. **Data Storage**
   - **Database**: Use a relational database (e.g., PostgreSQL) to store structured traveler data
   - **Separation**: Payment information must be stored separately from personal data
   - **Encryption**: Data at rest must be encrypted using AES-256
   
5. **Data Access and Control**
   - **Authentication**: Require JWT tokens for API access
   - **Authorization**: Implement role-based access control (RBAC) for fine-grained permissions

6. **Data Security and Privacy**
   - **Anonymization**: Anonymize personal data used in analytics
   - **Backup**: Regular automated backups with disaster recovery plans
   - **Monitoring**: Continuous monitoring for suspicious activities

7. **Compliance and Governance**
   - **GDPR Alignment**: Include mechanisms for data erasure and subject access requests (SARs)
   - **PCI-DSS Compliance**: Follow best practices for handling payment information

## Future Directions

- Explore third-party secure data storage solutions for payment handling
- Implement support for multi-traveler campaigns with minimal data replication
- Employ machine learning to enhance real-time decision making

## Conclusion

The architecture outlined ensures a robust, compliant, and scalable approach to managing and protecting traveler data within the auto-booking campaigns, paving the way for seamless integration and future growth.


Traveler Data Architecture for Auto-Booking Campaigns

Executive Summary
Overview: Parker Flight is introducing a new Auto-Booking Campaigns feature that will require storing sensitive traveler data (personal information, passport details, payment methods) to automatically book flights via the Duffel API. The existing Manual Search flow (using Amadeus and redirecting users to airlines for booking) does not handle sensitive data and will remain unchanged. The challenge is to design an optimal architecture for the auto-booking feature that achieves maximum security for traveler data while maintaining an excellent user experience, given Parker’s small team and preference for managed services. Top Recommendation: Implement a hybrid architecture that keeps the two flows logically separated for security, but shares a unified traveler profile for user convenience. In practice, this means storing traveler profile data in a secure manner (encrypted in the database or using a privacy vault) and leveraging third-party services for the most sensitive elements. For example, payment card details should never be stored in Supabase, but instead managed via Stripe’s tokenization (Stripe Customer and Payment Method objects). Traveler personal data (name, DOB, contact info, passport number, etc.) can be stored in Parker’s database with strong encryption and access controls, or offloaded to a specialized data vault service for extra security. By keeping manual search stateless (no PII stored) and isolating stored PII to the auto-booking system, Parker can minimize the security impact of a breach and reduce compliance scope. At the same time, unifying the traveler profile (with user consent) across manual and auto flows allows pre-filling information for convenience, avoiding duplicate data entry and improving UX. Security & Compliance: The recommended architecture emphasizes a “zero trust” approach to sensitive data. All PII is handled under strict controls: encryption at rest and in transit, tokenization of the most sensitive fields, and role-based access so that only authorized processes can access decrypted data. This approach aligns with GDPR’s data minimization principle – collect and retain only what is necessary for booking – and ensures readiness for SOC 2, PCI DSS, and privacy regulations. For instance, only the minimum traveler info required for booking (official name, date of birth, gender, contact info, and travel document number as needed) will be stored, and it will be retained only as long as needed to service active campaigns or fulfill legal obligations. Users will have full control over their data (consent, the ability to view/delete profiles, etc.), addressing GDPR/CCPA rights. User Experience: Despite the heavy security measures, the design aims to keep the UX seamless. Users will enter their traveler details and payment info once when setting up an auto-booking campaign, and Parker Flight will securely reuse those for any bookings over the 12-month period. Unified profiles mean that if a user has provided details for auto-booking, future manual searches or other features can pre-fill forms (with user permission), creating a smooth experience. Conversely, users who prefer not to save data can opt for “just-in-time” data entry (with trade-offs in automation). The system will also provide transparency – e.g. informing users why certain data is needed (compliance with airline Secure Flight, TSA, etc.) and how it’s protected. Trade-offs and Risks: The recommended solution balances security vs. complexity. Storing data with maximum security (encryption, vaults, third-party verifications) adds development and operational complexity, but greatly reduces breach risk and builds user trust. The main trade-offs include cost (third-party services like Persona or Auth0 add monthly fees), development effort (integrating new services, managing encryption keys), and potential performance impacts (extra encryption/decryption steps or API calls). These are deemed acceptable given Parker’s “zero tolerance for data breaches” stance and intention to pursue SOC 2 compliance. The architecture avoids migrating away from Supabase (no need to introduce Cognito/Auth0 for core auth if Supabase is sufficient), thereby reducing disruption, but it augments Supabase with additional security layers. Key risks include misconfiguring security controls or third-party dependency outages; the plan incorporates mitigation strategies like thorough testing, backups, monitoring, and fallback procedures. Implementation Timeline: A phased roadmap (detailed below) is proposed over ~12–18 months to incrementally build and harden the system:
Phase 1 (Next 2–3 months): Implement the MVP of auto-booking with basic secure storage (Supabase with encryption for PII, Stripe for payments) – enabling core functionality for single-traveler campaigns.
Phase 2 (3–9 months): Hardening and compliance – integrate additional security services (e.g. optional identity verification via Stripe Identity/Persona), implement rigorous access controls, conduct security audits, and prepare policies for SOC 2, GDPR, etc.
Phase 3 (9–18 months): Scaling and feature expansion – optimize performance for thousands of users, introduce multi-traveler support, refine disaster recovery, and ensure the architecture scales cost-effectively as the user base grows to 10k+ internationally.
Overall, this approach offers a secure, compliant, and user-friendly foundation for Parker Flight’s new auto-booking feature. It safeguards sensitive traveler information through modern best practices (encryption, tokenization, third-party vaults), leverages proven managed services (Supabase, Stripe, Duffel) where possible, and keeps the user experience streamlined by avoiding unnecessary data entry or disruptions.
Detailed Analysis by Key Questions
1. Data Separation vs. Unification of Traveler Data
Key Question: Should traveler data be shared between the manual search and auto-booking flows, or kept separate for security/architectural reasons? Recommendation: Logically separate sensitive data used in auto-booking from the manual search flow, but maintain a unified traveler profile where appropriate. In practice, this means the manual search feature can remain stateless and not access any stored PII (maintaining its current architecture), while the auto-booking feature will use its own secure data stores for traveler info. However, both flows can reference a common “Traveler Profile” entity for a user, so that information (like name, DOB, etc.) entered for auto-booking can be reused (with consent) to pre-fill forms in the manual flow for convenience. This achieves a balance: compartmentalization for security and unification for user experience. Security Implications: Separating the data contexts limits the impact of a breach. If the manual search front-end or Amadeus integration were compromised, it wouldn’t expose sensitive PII, since that flow doesn’t handle stored traveler data. Conversely, the auto-booking backend containing PII can be isolated and hardened. This follows the principle of “least privilege” – only the auto-booking system should have access to traveler PII, not the entire app. In large-scale secure architectures, it’s common to isolate sensitive data in a dedicated service or database. For example, one case study separated a credit-score microservice with its own encrypted database to limit exposure of that sensitive info. Parker Flight can apply a similar pattern: treat traveler PII storage/processing as a separate concern (even if using the same Supabase database, use separate tables, stricter Row-Level Security policies, etc., for that data). User Experience Trade-offs: A unified traveler profile means the user only enters data once. This greatly enhances UX – e.g. if a user has saved their passport and traveler details for an auto-booking campaign, a future manual search could auto-fill passenger name and maybe even redirect them to an airline with fewer inputs needed. Pre-filling forms reduces friction and encourages users to try the new feature. On the other hand, a fully separated approach (no shared data) would require users to re-enter personal details for each booking, hurting UX. Our recommendation avoids that redundancy. We will need to clearly ask user consent to use their stored data for other flows, in line with privacy best practices – e.g. “Save my traveler profile for future bookings” option on input forms. Compliance Considerations: Unified vs separate storage also has compliance implications:
GDPR/CCPA: If data is unified, we must ensure that any personal data collected for one purpose (auto-booking) is not repurposed without consent for another (manual booking). The solution is to obtain explicit user consent to use stored profiles for convenience in other flows. Additionally, having a single unified profile per user can simplify fulfilling data subject requests (one place to look for all personal data of a user). If data were scattered in completely separate silos, responding to a deletion or export request would be more complex.
PCI DSS: Payment data should be strictly isolated regardless. Even if other traveler info is unified, payment credentials should not be broadly accessible across systems. The architecture ensures payment details remain with Stripe (which is PCI Level 1 certified), thus outside of Parker’s direct data store scope.
TSA Secure Flight / APIS: Both manual and auto flows might involve entering Secure Flight data (name, DOB, gender) for ticketing. If the user does a manual search and then is handed off to an airline site, Parker Flight doesn’t need to store that data at all. But for auto-booking, Parker must store and transmit it to Duffel/airlines. By unifying the profile, we ensure consistency (the Secure Flight info used is the same in both flows), reducing the chance of errors (e.g., name mismatch). This is important because airlines and governments require accurate, consistent data for travelers.
Data Consistency Challenges: If data is unified, any updates to a profile should reflect everywhere. This is manageable since Parker can have a single “traveler_profiles” table. For example, if a user updates their passport number (perhaps it expired and they got a new one), the updated info should be used for all future bookings, manual or auto. We need processes to handle such changes in real-time for auto-booking campaigns: e.g., if a campaign is running and the profile changes, ensure the next booking uses the new data. A potential solution is versioning the traveler profile on campaigns – store a reference to the profile, and always fetch the latest when executing a booking, unless a booking is mid-process. Careful data synchronization logic will be necessary to avoid using stale data. On the flip side, if we kept data entirely separate per campaign, consistency is easier (data is fixed for that campaign) but then user would have to update multiple places for a global change – not ideal. Integration Complexity: Sharing traveler data between flows is not very complex technically, as long as we design a clear data model. We likely have:
Users (already in Supabase Auth).
TravelerProfile (new table for PII, one-to-one with User for now).
Possibly in future TravelerProfile one-to-many with User (for multi-traveler support – see section 5).
Campaigns linking to a TravelerProfile (for auto-booking).
For the manual flow, we actually might not need to persist anything – but if we want to prefill forms, the front-end can fetch the TravelerProfile of the logged-in user and populate the search form (e.g., number of travelers =1, and perhaps provide a quick way to use the stored name/DOB if needed on the airline site). Since manual booking ultimately redirects away, it might not directly use the stored data beyond the UI convenience.
In summary, keep the implementations decoupled but not siloed:
The manual search feature can remain a lightweight front-end integration with Amadeus, with no backend dependency on PII.
The auto-booking feature will have its own secure backend processes (cron jobs or triggers that run searches and create bookings). This backend accesses the traveler profile data as needed.
Both features link at the user/profile level. This means, for example, a user’s profile page in Parker could show their saved traveler info and saved payment methods which apply to auto-booking, but the manual search page doesn’t necessarily need any changes except perhaps a checkbox like “Use my saved traveler info” if we want to auto-fill some things.
By doing this, Parker Flight achieves security compartmentalization (the sensitive data is only in the auto-booking subsystem) and UX consistency (a single source of truth for user info that can be used wherever appropriate). This approach is in line with industry practice where PII might reside in a central profile store but is only pulled into systems that truly need it. It also aligns with Privacy by Design principles – limit usage of PII to stated purposes and keep it well-contained.
2. Third-Party Secure Storage of Sensitive Data
Key Question: Should sensitive traveler data (personal info, IDs, documents, etc.) be stored with a third-party service for enhanced security, instead of in our own database? If so, which service (Stripe Identity, AWS Cognito, Persona, Auth0, Firebase Auth, HashiCorp Vault, etc.) is most suitable? Recommendation: Use third-party services strategically for the most sensitive pieces of data (especially payment info and identity verification), while keeping core traveler profile data in our own database with strong encryption. This hybrid approach leverages the strengths of external providers (compliance certifications, built-in security features) without overly complicating our architecture or creating vendor lock-in for everything. Specifically:
Payment Cards: Stripe (with Stripe.js Elements or Checkout) should handle all credit card data. Parker Flight should not store any raw card numbers or CVV in Supabase – only store Stripe’s customer and payment method IDs, plus perhaps last4 and card brand for display. Stripe, as a PCI DSS Level 1 service provider, will store and tokenize the card data on our behalf. This completely removes Parker’s database from PCI scope aside from protecting the Stripe tokens.
Personal IDs / Documents: If verifying identity or storing passport scans, consider a service like Stripe Identity or Persona. These services can capture government ID documents and selfies, verify them, and return a verification status or extracted data. Importantly, Stripe Identity stores the raw verification data on Stripe’s systems (by default for 3 years) so that it “never touches your systems”. This reduces our compliance burden and risk since we wouldn’t store passport images or numbers ourselves beyond what’s strictly needed for booking. Persona similarly can store PII and offers a secure vault for documents, with fine-grained consent and global coverage for ID types. For an initial MVP, Parker might not need full ID verification, but as we scale or if fraud becomes a concern, integrating one of these can add trust (e.g., verify high-value travelers or those storing payment methods for long periods).
User Authentication and Profile Storage: Parker already uses Supabase Auth backed by Postgres. Migrating to a whole new auth system (like AWS Cognito or Auth0) solely to store some extra profile data is not necessary. Supabase Auth is working, and Supabase itself offers Row Level Security and the ability to add custom attributes or link tables for user profiles. We recommend sticking with Supabase for core user accounts and profile data storage (names, DOB, passport numbers, etc.), but augmenting it with encryption. Supabase’s security features (SOC2 compliance, encryption at rest, daily backups) are solid. It allows storing sensitive info as long as we encrypt at application-level for extra safety (Supabase even notes that extremely sensitive fields like access tokens can be encrypted client-side before storing). If we later find Supabase limiting, we could migrate to a specialized user management service, but currently this would add complexity with little benefit. (Notably, AWS Cognito or Auth0 could store custom user metadata like passport number, but they won’t magically make it more secure than a well-configured Postgres with encryption – and they introduce new integration work and costs).
Evaluation of Specific Third-Party Options:
Stripe Identity: Ideal for verifying that a traveler’s government ID is real and matching their identity. Could be used if Parker Flight wants to ensure a user is who they claim (e.g., to prevent a fraudster from using stolen card + fake name). Stripe Identity will handle document storage and verification; it charges per verification (exact pricing depends on volume/type, roughly ~$1.50 per ID check) and stores data up to 3 years by default. Integration is fairly straightforward (JavaScript flow to capture ID). It’s a good add-on for security but not a storage solution for day-to-day booking data (it’s geared toward one-time identity checks, not retrieving passport info to book a flight).
AWS Cognito: Provides user pools with profile attributes and secure scalable auth. It has benefits like built-in MFA and integration with AWS services. It’s inexpensive (free for 50k MAUs, then ~$0.005 per user) and HIPAA/GDPR compliant under AWS. However, using Cognito would likely replace or duplicate what Supabase Auth does. It could store custom attributes (passport, etc.) securely, but accessing those from our Node/Edge Functions is similar to reading from our own DB. Cognito doesn’t provide out-of-the-box document storage or advanced PII handling – we would still be responsible for encrypting sensitive fields. Given that migrating auth systems can be complex (and the user clarified they are not migrating from Supabase at this time), Cognito is likely not necessary. We can achieve similar results within Supabase by using encrypted fields and RLS policies.
Persona: A dedicated identity verification and PII vault service. Persona’s platform can verify IDs, run KYC checks, and crucially, it can store the personal data (including document images) in a hosted vault. It offers a global reach (many ID types, languages) and strong compliance (SOC 2, ISO 27001, GDPR-ready with data residency options). Persona’s pricing has a minimum ~$250/month (includes ~166 verifications, then ~$1.5 each). Persona could be used to store traveler info in a hosted vault, retrieving it via API when needed. For instance, Parker could create a Persona record for each traveler containing their passport number, etc., and only store a reference ID in our DB. Persona would then return the data when needed (with proper authorization). This would minimize PII in our system at the cost of added API calls and vendor dependency. Integration complexity is moderate – we’d need to sync data to Persona and back. Given the early stage, a full Persona integration might be overkill unless we specifically need their verification workflows. But it is a strong option if we decide not to hold passport numbers in our DB at all.
Auth0: A mature user management service with many security features (MFA, anomaly detection, etc.). Auth0 can store user profile metadata and even sensitive fields in a protected way (you can mark fields as encrypted). It also has built-in breach detection and SOC2 compliance. However, like Cognito, using Auth0 means switching auth or running it in parallel with Supabase, which complicates things. Auth0 pricing for B2C apps can become significant at scale (for ~10k users, it might run a few hundred dollars per month depending on plan). Auth0 shines if we needed advanced user login features or enterprise SSO, which isn’t a current requirement. For storing traveler data, Auth0 would still essentially be a database for us, with similar encryption needs. Therefore, not recommended to move to Auth0 solely for PII storage, though we can draw inspiration from its security practices (and possibly use Auth0 Rules or Actions if integrating with Persona/Stripe Identity).
Firebase Auth (Google): Similar trade-offs as Auth0/Cognito – it handles authentication and basic profile info but not complex PII storage. We could use Firebase to store some custom claims or use Firestore for profiles, but that’s effectively another database with encryption. This would also duplicate our stack (Supabase vs Firebase). Unless Parker was already on Firebase, there’s no strong reason to introduce it now just for data storage. Supabase already covers this area in our stack.
HashiCorp Vault: Vault is an open-source secrets management tool that can be used as a secure KV storage for sensitive data. If self-hosted, it’s very powerful but requires significant DevOps effort to run reliably (cluster management, unsealing procedures, etc.). There are managed versions (HCP Vault, starting ~$360/month for production clusters). Vault excels at storing small secrets (API keys, encryption keys, passwords) and can also store PII with access control and audit logging. We could use Vault’s transit encryption API to encrypt/decrypt data on the fly or store actual PII values and retrieve them via API calls. The advantages: Vault provides hardware-grade security (can integrate with HSMs, has robust audit trails) and helps enforce zero trust (our database could store just a token or encrypted blob, and Vault holds the key or data). The disadvantages: introducing Vault adds complexity that our 2-developer team may struggle to maintain. It’s essentially another service to deploy and monitor. Given our preference for managed solutions and minimal DevOps, Vault might be more than we need initially. It’s something to consider as we approach enterprise scale or SOC 2 audit – for instance, using Vault to manage encryption keys that our app uses to encrypt PII in Postgres, or to store particularly sensitive fields (like SSNs or passport scans) that we don’t want in Postgres at all.
Security Certifications and Compliance: When trusting a third-party, we must ensure they meet top security standards:
Stripe, AWS (Cognito), Auth0, Firebase are all SOC 2 Type II and ISO 27001 certified, with GDPR compliance programs and in many cases PCI DSS compliant infrastructure for relevant data (Stripe certainly is PCI DSS Level 1).
Persona and Stripe Identity handle government IDs and have to comply with data protection laws (Persona is also SOC 2 certified and offers EU data center options; Stripe Identity leverages Stripe’s secure infrastructure).
HashiCorp Vault (self-hosted) would put compliance responsibility on us; HCP Vault offers SOC2 and FedRAMP compliance in their cloud offering.
We should also consider data residency: If Parker Flight expands to EU, storing EU customer PII might need EU-based data storage or proper cross-border transfer safeguards. Many third-party options (Auth0, Persona, etc.) allow choosing region or have EU hosting. Supabase offers hosting in multiple regions – we could choose an EU Supabase project if needed or at least ensure our project’s data is in a region covered by our privacy policy. Stripe Identity data is processed in the US (which might be a consideration for EU customers – though Stripe will act as a processor under standard contractual clauses likely). These details must be addressed in our privacy compliance plan. Integration Complexity with React/Supabase:
Stripe (Payments & Identity): Stripe Payment integration with React is well-documented (using Stripe Elements or Checkout). Stripe Identity has a React SDK for the front-end capture. So these are moderate effort but well-supported by docs.
AWS Cognito: Would require using AWS Amplify or calling Cognito APIs from our React app, and migrating user accounts – high effort for arguably little gain.
Persona: Provides a React widget for verification flows and a REST API for server side. Initial setup is some work (especially managing webhooks for verification completion), but manageable.
Auth0/Firebase: Both have React SDKs for auth, but migrating would be significant if we abandon Supabase Auth. If used in parallel just for PII, it’d be awkward.
Vault: No direct React integration (since it’s backend), but we’d integrate at the server level. For example, a Supabase Edge Function could call Vault to fetch a passport number before calling Duffel.
Cost Structure Considerations: We need to weigh fixed vs per-use costs:
Stripe Identity: Pay-per-verification, no monthly fee. Could get expensive if verifying every user (e.g. 1000 verifications ≈ $1.5k). But we might only verify in cases of high risk or optional user opt-in.
Persona: Starts ~$250/mo plus overages. Good if we regularly verify IDs or store data there; otherwise, it’s a hefty minimum cost.
Auth0: Free tier for ~1000 MAUs, then paid tier (could be ~$100-200/month for 5-10k users on the “Essentials” plan). Not per user but tiered.
Cognito: Extremely low cost for our scale (likely a few dollars a month at most for 1000 users, maybe $50 for 10k), but again it duplicates what we have.
Vault: If self-hosted, cost is just the infra (maybe $50-100/month on a small server plus our time). HCP Vault would be ~$360+/month which is high for a small startup.
Supabase: We’re already paying for it. Storing more data there (even if encrypted) might increase our database size, but text data like passports is negligible in size. Supabase pricing is mainly based on rows and bandwidth – 10k users with one profile each is trivial. The main cost factor is ensuring we’re on a plan that allows encryption libraries or Edge Functions for processing.
Disaster Recovery & Backup: Third-party storage can improve DR: if our database goes down, data stored in Stripe/Persona/etc. is still safe on their side. For example, if we only store a Stripe customer ID, we can retrieve payment methods from Stripe even if our DB is lost (assuming we can identify the user’s Stripe ID from another source like Auth). However, relying on many external services means we need to handle each one’s outages gracefully (see section 7). Also, backup capabilities vary:
Stripe/Persona/Auth0 have their own backups and redundancy (we trust them to not lose data).
If we store data in Supabase, we rely on Supabase backups (daily automated backups are available). We should also periodically export critical data in encrypted form to an offsite storage as an extra backup, especially if it’s encrypted such that even Supabase staff cannot read it.
Vault (if used) would need its own backup strategy (for self-hosted, snapshot the storage backend, etc.).
Audit Logging and Access Controls: One advantage of some third-party solutions is built-in audit logs. For instance, Auth0 logs all user profile access, Persona logs each time data is accessed or a verification is done. If we store everything ourselves, we need to implement detailed logging of who accessed PII (for SOC2, we’ll need that). Supabase’s Postgres can log queries, and we can create our own audit trail table (e.g., each time a traveler profile is read for booking, log user ID, timestamp). Vault has audit logging of secrets access out of the box. These logs are important for detecting misuse or unauthorized access. We should evaluate if any third-party can simplify compliance here:
Using Stripe for cards automatically gives us Stripe’s audit trail of payments and card addition.
Using Persona for PII could mean we leverage their audit capabilities and just fetch when needed with an API key (so only our server with the key can fetch, and each fetch is logged by Persona).
Conclusion for #2: We will not migrate off Supabase, but we will augment it:
Keep using Supabase/Postgres for traveler profiles, but encrypt sensitive fields (we can use Postgres pgcrypto or application-level encryption).
Offload payment data to Stripe (only store tokens).
Consider using Persona or Stripe Identity for optional identity verification (not storing more data, but ensuring authenticity).
Possibly use a lightweight vault or secrets manager for encryption keys or the most sensitive pieces (for example, using AWS KMS to manage encryption keys that encrypt our DB fields, or using an open-source Vault for storing passport numbers if we decide not to put them in Postgres at all).
This approach ensures maximum security by utilizing specialized storage for what those services do best, while keeping our architecture manageable. By using tokenization and encryption, even the data we keep in Supabase will be low-value if breached (e.g., tokens instead of raw PII). Our systems will be descoped in many areas: e.g., Stripe’s vaulting of cards reduces PCI scope, a data privacy vault would reduce PII exposure in our systems. Overall, third-party secure storage is a key part of our security posture, used in a targeted way to bolster (not replace) our own data store. (Additional note, addressing the user’s follow-up: Currently, Parker Flight should avoid storing any raw payment details or full PII in Supabase if possible. The best approach is to rely on Stripe to store payment information (via tokenization) and to use Duffel only as a transient conduit for booking (Duffel will not store our traveler PII long-term except as part of booking records). For traveler personal data like passport info, if we can leverage Duffel’s systems or only send that data when booking without storing it, that would be ideal – however, because our auto-booking is asynchronous, we likely must store it. In that case, storing it encrypted in Supabase or using a vault is critical. In summary: Store minimal PII in our DB, and delegate storage to Stripe/Duffel where feasible, as detailed above.)
3. Data Minimization & Privacy
Key Question: What is the optimal balance between collecting the data needed for flight bookings and protecting user privacy? In other words, how can we minimize the data we store (and for how long) while still providing the service (especially auto-booking)? Principle: Adopt a Data Minimization strategy – collect, process, and retain only the minimum personal data necessary for the stated purpose (booking flights). This aligns with GDPR’s core principles and is simply good security practice: the less sensitive data you hold, the lower the risk of misuse or breach. For Parker Flight, this means:
Only Required Data for Booking: Determine the exact data fields needed to book a flight via Amadeus (for manual flow) and Duffel (for auto). For flight search (Amadeus), typically no personal info is needed – just trip details (dates, airports, number of passengers by type). We should allow searching without any PII. For booking via Duffel, required fields are full name, date of birth, gender, contact info (email, phone). Optionally, certain destinations or airlines may require passport number, expiry, nationality at booking time (especially international flights for APIS – Advance Passenger Information System). We will confirm Duffel’s requirements; if passport info is not required at booking, we can choose to not collect it upfront, thereby reducing PII stored. Instead, we could let the traveler provide passport details later during check-in on the airline’s site (like many OTAs do). However, if we aim for a fully automated experience even for international flights, we might collect passport details to input during booking if needed. Plan: Start by collecting only name, DOB, gender, email, phone (the essentials for ticketing and Secure Flight). Add passport number and nationality only if an auto-booking campaign includes an international flight or if required by Duffel’s API for those flights. This could be a conditional field – for example, if user sets a campaign for a domestic US flight, we don’t ask for passport. If they set one for US to Europe, we then request passport details.
Just-in-Time Data Collection: Where possible, collect PII at the latest point in time rather than far in advance. For manual search, since the user goes to the airline to book, Parker doesn’t need to collect anything (the airline will collect traveler details at booking on their site). For auto-booking, we have to collect in advance because the user might be offline when the booking triggers. But we could consider a hybrid: notify user when a flight deal is found and require them to confirm with their info. This would be more private (no storage), but it defeats the “automated” purpose and introduces delay, likely losing the fare. So for auto-booking, just-in-time isn’t feasible; we need the data beforehand to act autonomously. Therefore, we focus on minimizing retention instead:
Retention Limits: Only keep sensitive data for as long as the user is using the service. For example, if a user cancels an auto-booking campaign or it expires after 12 months, we should securely delete the stored traveler PII (or at least highly sensitive fields like passport number) unless there’s a reason to keep it (such as record-keeping or an upcoming booked flight). We can implement an automatic purge: e.g., 30 days after a campaign ends (or after a booked travel date passes), anonymize or delete associated PII. The idea is to not hoard data “just in case.” GDPR’s storage limitation principle requires that personal data be kept no longer than necessary for its purpose.
Guest/Anonymous Usage: Continue to allow non-logged-in users to use manual flight search without providing any personal info. Perhaps even allow setting up a one-time fare alert or viewing deals without full account creation, to minimize collected data. However, auto-booking inherently requires an account and saved details (since it’s proactive on user’s behalf). We could consider a “guest booking” where a user doesn’t create a full account but still enters details for a one-off campaign, but that’s essentially the same as collecting their data (just not saving account credentials). Likely not practical; it’s better to require sign-up for auto-booking and focus on securing that data properly.
Optional Data vs Required: Only mark fields as required if absolutely needed for booking. For instance, travel preferences (meal preference, seating, etc.) could be part of profile but are not required to book a ticket – those can be optional and not stored if user doesn’t want to. Similarly, we shouldn’t ask for things like TSA PreCheck/Known Traveler numbers, frequent flyer numbers, or middle name unless needed. We can store those if provided (to offer added value to user by auto-applying them to bookings), but emphasize they’re optional and encrypted.
Avoid Collecting Sensitive Personal Data beyond travel needs. For example, never ask for social security numbers, driver’s license numbers, or financial info beyond what Stripe handles. We also avoid any irrelevant data like physical addresses (not needed for flight booking, except billing address which Stripe handles during payment). Minimizing categories of data keeps us out of scope of certain regulations (e.g., we won’t touch health data or such).
Anonymous vs Identified Flows: Parker should maintain the ability for a user to explore flights anonymously (no login) for the manual search – much like Google Flights or Kayak allow searching without accounts. Only when they want to save preferences or set up auto-booking do we require identification. This respects privacy by not forcing account creation for basic use. For auto-booking campaigns, they must be identified (we need to tie to a user account to charge them and store criteria). Within auto-booking, we might allow some pseudonymization internally: for instance, in our database, the campaign can reference a user ID and a traveler ID, but those don’t need to be actual name in plaintext – the name is stored in the traveler profile, perhaps encrypted. In other words, internally we use numeric or random IDs to link things, so someone browsing the DB or logs can’t immediately see “John Doe’s passport is X” without going through decryption. Data Protection Techniques: We will employ techniques like pseudonymization and tokenization for stored data. For example, rather than storing a raw passport number, we could store a token or a hash of it for reference and keep the actual number encrypted separately. This way, if there’s no need to actually retrieve the passport number until booking, we hold it in a secure vault and just mark that one is on file. Another example: we don’t need to store the full credit card – just a token that represents it (Stripe’s PaymentMethod ID serves this role, effectively a token). Right to Deletion and Portability: From day one, design the system so we can delete a user’s data upon request. This means all personal data should be tied to the user ID and removable via a script or function that scrubs all tables (traveler profiles, campaign history, etc.) except perhaps data we’re obliged to keep (like transaction records for financial compliance). We should document what we retain (e.g., we might keep booking records minus personal info for accounting). GDPR also gives users the right to data portability – we should be able to export a user’s profile in a common format if they ask. Since our dataset per user is relatively small (profile fields and list of bookings/campaigns), that’s feasible via a JSON export or similar. Encryption and Privacy: To maximize privacy, we will encrypt PII fields so that even if our database is compromised or an admin is nosy, the data isn’t directly readable. This is beyond what GDPR explicitly requires, but it’s a recommended safeguard (and will be expected for SOC 2 as well). Encryption supports privacy by keeping data confidential and thereby reducing harm if a breach occurs (also some laws consider encrypted data not “personal data” if the key isn’t compromised). We will use strong encryption (AES-256 or similar) for fields like passport_number, possibly date_of_birth (though DOB might be needed for searching fare categories but typically not – you search by age category, not exact DOB). Names might not be encrypted if we need to do fuzzy matching or display them, but we could encrypt them too and just decrypt at use. There’s a performance trade-off, but since these are short text fields accessed infrequently (only when booking or viewing profile), it’s fine. Booking without an Account (Guest booking): Could we allow someone to set an auto-book without making an account, by providing all details and payment up front? Technically possible (store data temporarily, run campaign, then discard). However, it complicates managing changes or cancellations, and we couldn’t charge a user without some persistent identifier (unless we charge up front which doesn’t make sense for an unfulfilled booking). It’s safer to require accounts for campaigns. We will focus on providing clear privacy info during sign-up so users know their data is safe with us. Possibly, an alternative is a social login (Login with Google etc.), but that doesn’t solve PII storage; it just outsources authentication. Data Auditing: Part of minimization is knowing what we have and why. We should maintain a data inventory (even if simple) listing all personal data fields we store and mapping them to their purpose and retention. For example: Full Name – used for flight booking (airline requirement), stored encrypted in traveler_profiles table, deleted upon user deletion. This will help enforce that we’re not collecting extraneous data and will be useful for compliance audits. Privacy by Default UX: Ensure that features like marketing communications or data sharing are opt-in. E.g., if we ever wanted to share user data with airline partners or use it for promotions, we’d need separate consent. But at MVP stage, we’re not doing that. We explicitly use the data only for booking the user’s requested flights. As the AltexSoft travel GDPR article noted, consent should be specific – if we get data to book a flight, we can’t automatically use it for marketing later without additional consent. So Parker Flight’s privacy policy and UX will reflect that: “We collect X, Y, Z to book flights on your behalf. We will not use this info for other purposes unless you opt in (e.g., to receive travel deals newsletters, etc.).” Conclusion for #3: Parker Flight’s minimum necessary data for auto-booking will be:
Traveler’s full name (as on ID/ticket),
Date of birth (for fare rules and Secure Flight),
Gender (required by TSA Secure Flight),
Contact info (email and phone, required by airlines for contact and by Duffel for ticket issuance),
Payment token (Stripe customer/method ID – not the card number itself),
Passport details only if needed (for international trips; if required, likely: passport number, issuing country, expiration date).
Optionally, frequent flyer number and known traveler number (TSA Pre) if user provides, to pass to airline – these aren’t sensitive in the same way, but still personal data to handle carefully (store encrypted, since a FF number could reveal travel history).
We will avoid everything else. By not over-collecting and by purging data when it’s no longer needed, we adhere to privacy regulations and significantly cut down our risk exposure. This strategy is echoed by experts: “Reducing the amount of data collected decreases the possibility of misuse or breaches, coinciding with the data minimization principle.”.
4. Payment Data Integration
Key Question: How should payment methods be securely linked to traveler profiles for use in auto-booking campaigns? We need to support storing a payment method for up to 12 months of potential use, ensure PCI compliance, handle charges, and deal with fraud, international payments, refunds, etc. Secure Payment Architecture: Parker Flight will implement a tokenized payment system using Stripe:
Each user who wants to set up an auto-booking campaign must provide a payment method (credit/debit card) up front. We will integrate Stripe to collect this card information either via Stripe Elements (card input fields) or Stripe Checkout. In both cases, the card data goes directly to Stripe’s servers (through the client SDK), and we receive a Payment Method token (ID) – meaning we do not see or store raw card numbers.
We create a Stripe Customer object for each Parker Flight user (likely at account creation or at first saved card). This customer ID is stored in our Supabase (this is not sensitive – it’s just an ID reference). All payment methods the user adds will be attached to their Stripe Customer. This allows reusing methods and tracking history.
When a user sets up a campaign, they choose one of their saved payment methods (or add a new one). We store the Payment Method ID (pm_xxx) and possibly the last4 and card brand for display in their settings. The Payment Method ID is essentially a token representing the card in Stripe’s vault. Using tokenization like this is a common PCI compliance strategy: sensitive card data is replaced with a token, and the real card info is stored securely in a PCI-compliant vault (Stripe).
Stripe is a Level 1 PCI Service Provider, which means by using their APIs in the recommended way, Parker Flight’s own PCI burden is minimal. Likely we fall under PCI DSS SAQ A or A-EP (since card data never touches our servers, or only via JS in the browser). We should still follow best practices: serve our pages over TLS (we do, on Vercel), and never log or transmit card data in plaintext.
Reusable Payment Methods for 12-Month Campaigns: We will use Stripe’s Setup Intent flow to save a card for future “off-session” usage. Specifically, when a user enters a card for auto-booking, we create a Stripe SetupIntent with usage=off_session so that any required 3D Secure (SCA) authentication happens upfront. Once the SetupIntent is confirmed (the user’s bank might prompt them to approve if needed), the card is saved to the customer with the ability to charge it later without the user present. This is crucial for compliance with PSD2 (European SCA laws) – it gets the necessary authentication now for future charges. It reduces the chance of a payment failing later due to issuer requiring authentication. We schedule charges as needed:
When our system finds a flight that meets the campaign criteria, it will create a Payment Intent in Stripe to charge the user’s saved card. This Payment Intent will be made with customer=<ID>, payment_method=<ID>, and off_session=true (which tells Stripe to attempt the charge without user interaction). If SCA was handled at setup, the charge should succeed silently. If by chance it requires further auth (rare if setup was done, but can happen if high amount or issuer policy), Stripe can throw an authentication_required error. We should handle that: maybe notify the user to authenticate via a link, but that defeats immediate booking. We might decide to either (a) only allow auto-booking for cards that support off-session (after a successful SetupIntent, this is usually guaranteed), or (b) in case of failure, hold the reservation for a short period while user authenticates. Duffel does allow holding orders briefly if needed (they have a concept of “pay later” perhaps). We need to explore Duffel’s hold capability. If Duffel’s “create order” must be paid immediately, we can’t delay. So likely we’ll ensure the card is good to charge.
Linking to Traveler Profiles: In our database, we might have a table payment_methods storing:
user_id, stripe_customer_id, stripe_payment_method_id, last4, brand, maybe cardholder name if we want (though we can get that from traveler profile name).
We link a campaign to a specific payment_method record (so campaigns know which card to charge). Alternatively, we just link to the user and assume the user’s default payment method is used; but better to explicitly store which method for each campaign in case the user has multiple cards for different campaigns.
Storing a Stripe Customer ID on the user profile is a good practice – it’s not sensitive and allows retrieving all their payment methods from Stripe if needed.
Fraud Prevention: Stripe provides Radar, its fraud prevention toolset, by default. We should enable Radar rules especially since auto-booking might look like unusual transactions (card-not-present, maybe months after saving card, possibly in foreign currency if booking international flights). Radar can be configured to allow such transactions because the user performed 3D Secure at setup (which is a strong signal). We can also collect billing address or CVC at setup to strengthen the token (Stripe can include that data for fraud checks). We won’t store that info ourselves, but Stripe uses it. Additionally, since flights are a known legitimate purchase user opted into, fraud risk is low from the user side – however, we must ensure no one else can trigger a charge except our system under correct conditions. That means securing the backend that initiates PaymentIntents (Edge Functions should validate campaign triggers properly). Also, we should implement some limits or notifications: e.g., if a campaign will charge above a certain amount (maybe user set criteria like “book if price < $500”, but what if taxes cause $520?), we should either respect the limit strictly or require reconfirmation for larger charges. This is more a UX policy but relates to avoiding disputes (“I didn’t expect $550 charge!”). International Payments: Parker Flight will support users from multiple regions and flights in various currencies. Stripe can handle multi-currency – we just specify the currency when creating the PaymentIntent. We have two approaches:
Charge all users in a single currency (e.g., USD) and have them bear conversion on their card. Not great for non-US users.
Charge in the currency of the flight fare. If Duffel gives us fares in, say, EUR for a Europe trip, we might charge the user in EUR. Stripe can route to their card networks accordingly (the user’s bank will convert if the card is not a EUR card). We should create Stripe PaymentIntents in the currency that matches the fare to avoid us doing conversion. Stripe supports many currencies (for a given account depending on your banking setup). We may need to enable multi-currency on our Stripe account and possibly hold multiple currency balances or use Stripe’s FX. This is a complexity to plan for as we expand. Alternatively, we could always charge in USD and use Stripe’s conversion rates if needed, but that might not be optimal for user.
Also consider that if Parker Flight is not going to mark up fares, it might just charge exactly the fare amount (plus our fee if any). This means potentially small amounts to big amounts, varying.
Refunds and Chargebacks:
Refunds: If a booked flight is canceled or fails to ticket, or the user is entitled to a refund (like airline refund or within a free cancellation window), our system will need to process that. Since we charge the user via Stripe, we should also issue refunds via Stripe API to return money to their card. We must track the Stripe PaymentIntent IDs and Duffel Order IDs together. E.g., store in DB that campaign X booking on date Y resulted in Stripe charge Z and Duffel order O. If a cancellation happens, we retrieve that mapping to refund Z via Stripe and cancel O via Duffel.
Chargebacks: A user might dispute a charge if they forgot about the campaign or feel it was unauthorized. To mitigate this, we should send a confirmation email immediately when an auto-book occurs, detailing the flight and amount, so they’re informed. Also, in our terms, clearly explain the auto-charge. If a chargeback happens, Stripe will notify us, and we’ll have to respond through Stripe’s interface, providing evidence (e.g. user agreed to terms, and flight ticket was provided). Too many chargebacks are bad (Stripe could fine or cancel us), so user education and maybe requiring agreement each campaign are important.
Possibly require the user to maintain a payment method on file with updated expiry. If a card expires during the 12-month campaign, Stripe will decline. We can proactively email users before card expiry (Stripe provides the expiry date for the token) to update their card to avoid missing a booking.
PCI Compliance: By using Stripe Elements or Checkout and not touching raw PAN (Primary Account Number), Parker Flight will be largely out of scope of PCI or at least in the simplest category. We should still complete a PCI SAQ (Self-Assessment Questionnaire) likely SAQ A (since we have no card data on our server or maybe SAQ A-EP if the site is more involved). This basically means:
Our website has to be secure and not tampered with (to ensure Stripe’s JS isn’t modified by an attacker to steal cards – hosting on Vercel with good practices helps, also using Subresource Integrity for Stripe JS if possible).
We don’t store or log card data accidentally. We should double-check that we never log the PaymentMethod ID along with any sensitive info like full name in the same context publicly (though PaymentMethod ID alone is fine).
Keep our Stripe API keys secure (in environment variables, not in front-end).
If necessary for user convenience, we might implement card auto-updates: Stripe has a feature to auto-update saved cards when banks issue new numbers (via network tokens). That’s helpful to keep payment valid throughout a year.
Payment Method Verification:
We already discussed using SetupIntent to verify and handle SCA. Additionally, we might perform a test authorization – Stripe by default can do a $0 or $1 auth when saving a card to verify it’s valid. This prevents situations where a user enters a wrong card or one with no funds – better to catch that at setup rather than at booking time.
For fraud: We should ensure the cardholder name matches the traveler’s name if possible, or at least encourage it. Many airlines require that the payment card owner can be different from traveler, that’s fine, but mismatches might indicate fraud (e.g., using someone else’s card). We might log a warning if card name != traveler name and maybe require additional verification in those cases (or disallow if we want to be strict). This is a business decision; many legit cases of buying tickets for others exist, so we likely allow it. But if we were concerned, we could incorporate something like 3D Secure for every charge by setting require_confirmation etc., but that hurts UX.
We’ll rely on Stripe’s fraud detection primarily. Possibly also watch for unusual booking patterns (multiple cards on one account failing, etc.).
Consent for Charges: When user saves a card and starts a campaign, we must get their explicit consent that “this card will be charged automatically up to [some amount or rule] over the next 12 months whenever a flight meeting your criteria is found.” This could be in our UI and terms. It’s both ethical and probably required by card network rules for recurring/off-session transactions (they usually require notifying cardholders of the agreement to future charges). Storing Payment + Traveler Data together: We should be careful about linking payment info to PII. For instance, avoid storing full card details with personal details. With our approach, we only store tokens plus maybe last4 (not sensitive). So even if someone got access to our traveler profile database, they don’t automatically get card numbers. They might get Stripe customer IDs, but those are useless without our secret key. This separation is good for PCI and privacy. Essentially we are tokenizing payment data completely. In summary:
Parker Flight will use Stripe Customer objects to manage payment methods and link them to user profiles (one Stripe customer per user).
Each auto-booking campaign will reference a Payment Method token (Stripe PM ID) that has been set up for off-session charges.
We ensure PCI compliance by not handling raw card data and using Stripe’s secure vault and tokenization. As noted in security resources, tokenization in payments “replaces sensitive card details with tokens, reducing the risk of storing sensitive info”.
We implement fraud prevention via Stripe Radar and SCA where appropriate, and handle refunds/chargebacks properly via Stripe’s APIs and policies.
This setup is scalable to thousands of users: Stripe can easily handle it, and it keeps our system free from heavy PCI scope so we can focus on core functionality.
5. Single-Traveler (MVP) Architecture with Future Multi-Traveler Support
Key Question: How to design the data structures and relationships for auto-booking campaigns assuming a single traveler per user now, but accommodating multi-traveler (family or group bookings) in the future? What about account ownership vs additional travelers, permissions, etc.? MVP (Single Traveler) Design: Initially, we can assume each Parker Flight user account corresponds to one primary traveler (the user themselves). Our data model can reflect that:
users table (from Supabase Auth) – one per login.
traveler_profiles table – one-to-one with users (for now). Contains personal info like name, DOB, etc. (encrypted as needed). This is the primary traveler for that account.
campaigns table – each campaign row links to the user_id (and thus implicitly to that user’s traveler_profile) or directly to traveler_profile_id (since it’s one-to-one, either is fine). It also links to a payment_method_id for the campaign (as discussed).
In the single-traveler MVP, whenever we need traveler details for a booking, we use the profile associated with the campaign’s user.
Designing for Multi-Traveler Expansion: We should modify the above such that traveler_profiles is one-to-many with users. That means a user (account) can have multiple traveler profiles under it. For now, if we know it’s 1:1, we still implement it as a separate table (not merge with users table), because separating it now makes expansion easier. The schema might look like:
sql
Copy
Table users { id (uuid), email, etc. } 
Table traveler_profiles { id (uuid), user_id (fk to users), full_name, dob, passport_no, ... , is_primary (bool) }
Table campaigns { id, user_id (fk users), traveler_profile_id (fk traveler_profiles), criteria, payment_method_id, ... }
For MVP, each user will have exactly one traveler_profile which is their own. traveler_profile_id in campaigns will point to that. When we add multi-traveler, a user could have, say, profile A (self), profile B (spouse), profile C (child). Then a campaign could reference one of those profiles (if booking just one person), or potentially multiple if we allow multi-passenger booking in one campaign. Planning for Group Bookings: Eventually, we may want to allow a campaign that books, say, 2 seats whenever a deal appears (for example, a couple’s trip). This complicates the model: a campaign might have multiple traveler IDs associated. We’d need a join table, e.g., campaign_travelers (campaign_id, traveler_profile_id). For now, we keep it simple (one campaign = one traveler), but we make sure not to bake in assumptions that break later. For example, when searching flights via Duffel, currently we will search for 1 passenger. In future, we want to search for N passengers. Our code can be written with that in mind (e.g., passenger count is a parameter, even if now it’s always 1). Account Holder vs Additional Travelers: The primary user account will be considered the account owner who can add/edit traveler profiles (like a family manager or a corporate travel manager). Additional travelers in the profile list do not have separate logins (in this model) – they are essentially sub-records managed by the primary user. For example, a parent could add their spouse and kids as traveler profiles under their account. We must consider consent and privacy: the account owner should ideally have permission from those individuals to store their data and book on their behalf. Our terms should mention that if you store someone else’s data, you have authorization to do so (especially for minors, a parent can consent). Permissions & Data Sharing: In the future, we could allow users to share access or delegate. E.g., a corporate scenario: one user (travel manager) can manage profiles of employees, or invite employees to have their own login but link to the company account. That’s more complex (involves roles and linking accounts to an organization). Possibly out of scope initially, but our data model could accommodate by having a traveler_profile optionally associated with a different user (i.e., profile belongs to company account but has an email of traveler who could claim it). For now, we keep it simple: traveler_profiles belong strictly to the user that created them. Data Schema Future-Proofing: Ensure fields cover multiple travelers:
Perhaps add a field for relationship or label (like “self”, “daughter”, “colleague”) to the traveler_profile to help the account owner manage. Not necessary, but nice.
Include fields for minor travelers (if needed, maybe not separate fields but note that if DOB indicates <18, airlines treat them differently). Duffel’s API required specifying when an infant is attached to an adult – so in multi-traveler booking, we’ll have to indicate that relationship. Our data model could include an infant_of reference if needed, or we just handle it at booking time by matching an infant profile to an adult.
We might consider a “profile link” if in future one traveler profile could be shared between accounts (e.g., a husband and wife each have Parker accounts but want to share each other’s info). That is edge-case and can be handled later (like allow copying or inviting).
API Design Considerations:
We should design our API endpoints for creating campaigns etc. in a way that isn’t hardcoded to a single traveler. For instance, an endpoint POST /campaigns might take a traveler_profile_id parameter (currently the front-end will always send the one profile ID, but later it could send multiple IDs if we extend it).
Similarly, if we have an endpoint to update traveler profiles, it should handle multiple profiles. For MVP, maybe the UI just has a “My Info” page. In future, it might have “Manage Travelers” with CRUD operations for each traveler.
The data returned from APIs (like GET profile) should be structured to handle an array of travelers even if currently it’s length 1.
User Experience for Multi-Traveler: Planning ahead:
In the app UI, eventually have a section “Travelers” where a user can add family members or others. For now, we can internally support multiple but maybe not expose it – or we could even quietly allow it if it’s easy (since the table supports it, we could let power users add another traveler).
When creating a campaign in future, user would pick which traveler(s) the campaign is for. They might also choose to name the campaign (like “Hawaii Trip for Mom and Dad”).
For group bookings: We have to gather each traveler’s info. If they’re stored as profiles, easy. We also should consider storing group preferences – like seat together. But since we likely always book them in one order, the airline will seat them together if seats are available or allow selection together.
Consent and Minor Data: If user adds a minor’s details, we should treat it carefully under privacy laws (COPPA if under 13 in US, GDPR parental consent for under 16, etc.). Since the parent is providing it, presumably they consent. But our privacy policy should mention that we assume the account owner has authority to provide another person’s data. Corporate scenario: the company likely has employee consent via internal policy. Corporate/Delegate booking: Possibly allow an arrangement where an executive’s assistant can have their own login but manage the executive’s profile and book on their behalf. This implies a delegation system (user A can act for user B). That’s beyond MVP, but if ever needed, our data model could either:
share traveler_profile between two users (so assistant’s account has access to exec’s profile), or
have an organization concept that both belong to.
This gets complex, but at least our separate traveler_profile entity gives us flexibility to attach it to something other than a single user if needed (we could have an owner_id and maybe an org_id).
Scaling Data Model: A single user with multiple profiles and multiple campaigns should be fine on performance – these are small tables (even with 10k users, even if each had 5 profiles, that’s 50k profiles – trivial for Postgres with proper indexing). Queries to fetch a user’s profiles or their campaigns join to profiles will be fast (indexed by user_id). Example Code (TypeScript interfaces) – demonstrating how we might define this:
ts
Copy
interface TravelerProfile {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth: string;  // stored as ISO string
  gender: "M" | "F" | "X";
  passportNumber?: string; // optional, encrypted in DB
  passportCountry?: string;
  passportExpiry?: string;
  email: string;   // contact info
  phone: string;
  // possibly frequent flyer numbers, etc, optional
}

interface Campaign {
  id: string;
  userId: string;
  travelerProfileId: string;
  origin: string;
  destination: string;
  maxPrice: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: "active" | "booked" | "expired" | "cancelled";
  paymentMethodId: string;
  createdAt: string;
  // criteria like weekdays, airlines to include/exclude, etc.
}
In the future:
ts
Copy
interface Campaign {
  ...,
  travelerProfileIds: string[]; // could use an array to allow multiple travelers
  // (or a separate data structure CampaignPassenger linking to traveler profiles)
}
But relational DB would use a join table as mentioned. Backend Logic: For single traveler, booking logic takes one traveler’s data to Duffel. For multi, it would iterate through travelerProfiles for that campaign, build the passenger list for the API call. Duffel requires linking infant to adult by ID, which we can handle by ensuring profiles have an age (from DOB) and if <2 years, we prompt for which adult is guardian. Spotnana example (an enterprise travel platform) shows how multi-passenger bookings are managed: they let an arranger add up to six travelers on one itinerary, and behind the scenes they create separate PNRs per traveler while linking them. For Parker, we might not separate PNRs (we’d likely book all in one order if airline allows). But it highlights the complexity: loyalty benefits per traveler, etc. We’d need to store each traveler’s frequent flyer info and apply it. Phase-wise approach:
Phase 1: Implement data model as if multi-traveler is possible, but limit UI to one profile per user. Test that extensively.
Phase 3: When scaling, introduce UI for additional profiles and allow multi-traveler campaigns. This will require updating the search and booking code, which we plan for.
By designing the schema now to be extensible, we avoid painful migrations later. The key is the separate traveler_profile table and campaign linkage by traveler. With that in place, adding more travelers is mostly UI and some logic, not a fundamental DB redesign. In summary, our architecture will treat traveler data as a first-class entity decoupled from the user and campaign, which is a forward-looking design. This matches industry practices where centralized traveler profile management is used by agencies/TMCs to book for multiple people easily. Business Travel News noted that minimal profile data should include “official names, travel document numbers, DOB, email and ideally payment information” – in our case, we store those per traveler profile, and payment info is stored per user (or potentially per profile if needed). This setup will serve both current needs and future expansion to multi-traveler scenarios.
6. Real-Time Data Requirements
Key Question: Which traveler data (or related data) needs real-time access during the booking process versus what can be cached or stored? How do we ensure data is fresh when a booking triggers, given the potential delay (campaign could run for months)? Real-Time vs Cached Data:
Traveler Profile Data: This data (name, DOB, etc.) is relatively static for each user. It does not change frequently (a user’s name, DOB won’t change; passport number might change on renewal but that’s infrequent). We can safely store this in our database and use it when needed. There’s no external source of truth we need to fetch from in real-time; the profile itself is the source. Therefore, we do not need to fetch traveler PII in real-time from elsewhere every time we book – using the stored profile is fine, as long as we have the latest updates the user made. The main thing is ensuring we use an updated profile if the user changed it. We will handle this by always querying the database for the latest info at the moment of booking (no long-lived cache in memory beyond maybe the scope of a single function execution).
In practice, our booking function (Edge Function or serverless job) will retrieve the traveler_profile record at runtime, use it to fill Duffel’s order request, and that’s it. The latency for that DB call is minimal (a few milliseconds).
We could cache traveler data in memory if we do thousands of bookings per minute and want to reduce DB load, but that’s unlikely (bookings are triggered by rare events, not constant). And caching PII in memory could risk staleness if user updates. So, simplest is to query fresh from DB each time.
Payment Data: Similar to profile data, we have it stored as a Stripe token. We will fetch needed payment info just-in-time. Actually, we might not need to “fetch” anything – we store the Stripe PaymentMethod ID in the campaign, and at booking time we use it to create a charge. We might retrieve from our DB the payment_method_id; that is instantaneous. There’s no need to call Stripe to re-validate the card each time (though we might want to ensure it hasn’t been removed or expired – Stripe will tell us if charge fails).
We can consider a periodic check (maybe monthly) to ensure saved payment methods are still valid (Stripe’s API can retrieve a PaymentMethod’s exp_month/exp_year and we can warn user if it will expire before campaign ends).
But at booking time, we just attempt the charge. If it fails (card expired, etc.), that is an edge case where we might notify the user and possibly hold the booking if possible for a short window. Ideally, we proactively prevent that by monitoring expirations.
Flight Search Data: This is highly dynamic and needs real-time access. The availability and price of flights can change multiple times a day. For auto-booking, Parker likely will run periodic searches via Duffel’s API. We cannot rely on cached flight data for any serious length of time – an offer is only valid for a short window (offers can get stale “fairly quickly” and must be refreshed before booking). So our system likely does something like: every X hours (or via Duffel’s webhooks if they have any for price drops), we perform a live search (Offer Request) for each active campaign’s criteria. Then if we find a suitable offer, we immediately retrieve the latest offer from Duffel (to ensure price is up-to-date) and proceed to booking. This portion is very real-time: we should not use an old cached price from earlier in the day. Thus, flight data will always be fetched live from the API at time of need. We might do some caching of search results short-term to avoid hitting API too often (e.g., if two campaigns have identical criteria, we could share an Offer Request result), but given personalization, that’s not required initially.
Duffel API Responses: When we create an order (booking) through Duffel, the returned data (e.g., booking reference, e-ticket number) should be stored. We should treat that as authoritative and store it in our database for the user’s reference (and possible future modifications or cancellations). That data can be cached in our DB because it’s final for that booking. If the user wants to see their booking status in our app, we show from DB. If we need to check for changes (like flight time changes or cancellations by airline), we might call Duffel’s API for updates or rely on webhooks/notifications from Duffel. But that’s beyond initial scope.
Caching Strategies for Traveler Profiles: Since traveler profiles don’t need external sync, caching is mainly an internal performance consideration. As user count grows, reading a profile (small row) from Postgres is extremely fast, so no big issue. If we were to scale to millions of reads per minute (unlikely), we’d consider an in-memory cache or a read replica for the DB. Supabase could handle increased read load or we use their caching (they have an option to cache queries at edge). For now, we can keep it simple with direct queries. Session Management for Sensitive Data: Ensure that when traveler data is accessed in a user session (e.g., a user viewing or editing their profile on the front-end), we don’t expose it unnecessarily. We’ll fetch it via secure API call, display it, and not store it client-side beyond the session. Possibly avoid caching it in browser localStorage or such, to minimize exposure if device is compromised. Each time the user visits their profile page, fetch fresh from server (with JWT auth). This is fine because it’s not a heavy operation and ensures they see the latest info. Auto-Booking Synchronization: Suppose a user updates their traveler profile (say new passport number) while a background search is running. We need to handle the possibility that the search might find a deal right at that moment. If our process fetches the profile slightly before the user’s change is saved, there’s a slight chance it uses old info. This is a rare race condition. To mitigate:
We can implement a simple lock or check: when a profile is being updated by the user, maybe pause or queue any booking action for a second. But given the low probability and low impact (if passport number was updated and we booked with the old one, the user can still travel if old passport is valid or they may need to update at check-in – not ideal, but not catastrophic).
We can also design the booking function to always double-check critical fields. For example, after a booking is made, if the user had updated something, they might contact support. Ideally, we avoid any mis-bookings: so perhaps a simpler approach is to prevent updates at the exact booking moment. This is hard in distributed systems without heavy locking. However, given bookings won’t happen very frequently, the chance of collision is extremely low. We’ll note this as a potential issue but not over-engineer a solution now.
Data Freshness:
Payment Data Freshness: If user removes or changes their card, ensure campaigns are updated to use an active card. If a user has one card and they delete it or it expires, we should deactivate their campaigns or prompt for a new card, otherwise a trigger would fail to charge. So the system should listen to such events (e.g., user deletes a payment method in our app – in response, mark campaigns as “action required” or use a backup payment if provided).
Profile Freshness: If user changes name (maybe a legal name change) or renews passport, that should be reflected. Possibly send a reminder to update passport expiry if we know it’s coming up (if passport expired, booking might fail or not be accepted by airline).
Offer/Price Freshness: As noted, handle by retrieving the latest offer from Duffel right before booking. The workflow: search offers -> identify best offer -> call Duffel “get offer by id” to refresh -> then call “create order”. Duffel ensures price is current at order creation (or it errors if price changed, in which case we could decide to take new price or abort depending on user’s criteria strictness).
Real-Time vs Eventually Consistent Data:
Most of our data is strongly consistent (in our Postgres, with transactions).
The only eventually consistent part might be updates from third parties: e.g., after booking, if an airline updates a flight time, Duffel might allow retrieving updated order details via API or send a webhook. We should decide if we handle that in real-time (listen to Duffel’s notifications for changes) and update our records or notify users. That’s more operational, but important for user experience (they’d want to know if their flight time changed). This ventures into after-booking servicing, which we might not fully automate initially beyond maybe an email with booking reference. Perhaps in Phase 3, implement a sync for such changes.
In-Memory or Edge Caching of PII: Likely avoid caching PII at edge nodes due to sensitivity. We might use edge caching for static content or public data (like airport lists, etc.), but not for personal details. If we did, we’d have to ensure the caches are private per user (like HTTP caching with auth can be tricky). Better to just fetch from origin DB with proper auth each time for personal data. Auto-Booking Campaign Data: The criteria for campaigns (destination, price, etc.) can be stored in DB and doesn’t change unless user edits it. We can load all campaigns into memory for processing if needed (e.g., a cron job loads criteria to run searches). But if there are thousands, we’d likely iterate rather than hold all at once. We can also use Supabase Edge Functions with scheduled triggers (Supabase has a beta “Cron” feature) to handle periodic searches. In that case, each invocation could query active campaigns from the DB. If performance becomes an issue at scale, we might introduce a cache or a message queue, but not needed initially. Data Conflict Example: If Parker had multiple systems writing traveler data (say a mobile app and web at same time), conflict could happen, but since there’s just our backend, last write wins. Summary: Traveler and payment data does not require external real-time fetch; it can be securely stored and considered the source of truth, accessed on-demand. The flight availability and offer info are the parts that require real-time API calls and cannot be cached for long. By segregating these concerns, we ensure up-to-date info where it matters (flight pricing) and reliable stored info for personal data. This approach ensures that when a booking triggers, the system has immediate access to all needed traveler info in our database (quickly decrypting if necessary) and can feed it to Duffel without delay, while the flight details themselves are freshly obtained so the order can go through successfully.
7. Disaster Recovery & Business Continuity
Key Question: How can we ensure traveler data and booking capabilities remain available during outages or disasters, without compromising security? In other words, what are our backup, replication, and failover strategies for critical data, and how do we handle downtime of third-party services (Stripe, Duffel, etc.) to continue operations? Data Backup & Recovery:
Supabase (Postgres) Data: Supabase automatically backs up the database daily and supports point-in-time recovery for paid plans. We will schedule regular backups of our own as well (perhaps a nightly export of key tables like traveler_profiles and campaigns, encrypted and stored in a secure off-site location like AWS S3). These backups should be encrypted with a strong key, so even backup storage compromise doesn’t expose PII. Having our own backup ensures we can restore data even if Supabase has an extended outage or worst-case scenario loss (though unlikely given their infrastructure).
Encryption Keys: If we encrypt data with our own keys (outside of Supabase’s control), those keys become critical to backup too. We should store encryption keys securely in a secrets manager (like AWS KMS or even 1Password or Vault if used) and have a copy offline. We might use an HSM/KMS for production keys so that even we don’t directly handle raw keys often.
Multi-Region Replication: Supabase itself is typically single-region per project. To improve availability for international users and DR, we might consider replicating data to another region. However, multi-region writes are complex. A simpler approach is to have a read replica in another region for DR (not for active traffic, but to promote if primary fails). Supabase doesn’t yet offer multi-region active-active, but we could set up a logical replication to another database ourselves if needed for continuity. Given our scale in first 6-12 months (a few hundred or thousand users), a total DB outage is probably acceptable for a short period (maybe we can tolerate being down for a few hours worst-case, though we prefer not to). But since we “prefer maximum security even if expensive,” maybe we also want high availability.
We could mitigate downtime risk by choosing a reliable cloud (Supabase likely runs on AWS or GCP under the hood with redundancy in a region). For multi-region, another strategy is to have an export of data such that we could spin up a minimal service to allow emergency booking or data access. For example, keep a recent backup that we can load into a local Postgres or alternate service if Supabase is down, to retrieve traveler info if needed. This is heavy and would require quick devops skill at a stressful moment, so maybe not practical for a small team unless this becomes automated.
Vault/Third-Party Data: If we use a third-party vault for PII (like Skyflow or Persona), we rely on their backups. We should clarify in contract their RPO/RTO (Recovery Point and Time Objectives). For example, Skyflow likely replicates data across zones. If that service is down, our data stored there could be temporarily inaccessible – we might want a contingency to read from a local cache. One approach: if we store passport number in a vault, maybe also store a copy encrypted in our DB as fallback (two layers). But that can defeat the purpose of vault if done poorly. Alternatively, accept that in a vault outage, international bookings might fail (rare, and we notify users).
Stripe: Stripe’s data (customers, payment methods, transactions) is highly available and backed up by Stripe. We don’t back that up ourselves, but we do store reference IDs. If Stripe were to lose data (extremely unlikely), we might lose the ability to charge – but Stripe hasn’t had that kind of failure historically. The main continuity issue is if Stripe’s API is down at the moment we need to charge or verify something.
Failover Procedures:
Application Failover: If Vercel (hosting) or Supabase (DB) goes down in our primary region, we should have a plan. Possibly keep a static emergency page to communicate to users if core service is down. For auto-booking specifically, if our backend is down, we could miss deals. Perhaps implement a graceful degradation: if our search job fails to run at its scheduled time due to outage, run it as soon as service is restored and see if any deal was missed in the gap (maybe by checking if current prices are still low). We may miss some ephemeral deals, unfortunately, but that’s acceptable in a major outage scenario.
Multi-Cloud Option: In the long run, consider an architecture where if Supabase is down, we have a parallel system on AWS ready. This might involve using something like Hasura or a read-replica such that queries can be done from a secondary. But implementing multi-cloud for a small team is complex. Alternatively, trust Supabase’s SLA and focus on quick recovery if something happens.
Testing Recovery: We will regularly test restoring from backup in a staging environment to ensure our backup files are valid and we know the steps to recover. Also test the encryption key recovery process (e.g., simulate losing the environment and recovering keys from secure storage).
Third-Party Service Outages & Business Continuity:
Stripe Outage: Stripe has high uptime, but if Stripe is down at a critical moment (cannot create PaymentIntent), what do we do? If we cannot charge the user, we cannot finalize the flight booking (since Duffel said “You should charge the customer yourself before creating the order”). Options:
Hold the reservation: Duffel offers a “hold and pay later” feature (they have guides on holding orders). We could, in an outage scenario, attempt to hold the booking (reserve seats) and then commit payment once Stripe is back. Duffel’s “holding order” allows up to a time-limit to pay. This requires implementing that flow as a fallback: i.e., create the order in Duffel with “pay later” (if supported), then queue the payment and order confirmation for later. This ensures the user doesn’t lose the seat. However, not all airlines allow holds, and it may require additional fees or guarantees.
Skip booking: Alternatively, if Stripe is down, we might skip that booking attempt (or keep checking until Stripe is back, but the fare might be gone). This is not great for user, but how often is Stripe fully down? Very rare.
Charge via backup gateway: If we had another payment provider integrated as backup (e.g., PayPal or Braintree), theoretically we could try charging through them. But that doubles integration and compliance effort. Not worth at startup stage.
We should at least detect Stripe failure and notify user: “We found a flight but couldn’t book due to a payment service outage. We will retry shortly.” And ensure we do retry when possible.
Duffel Outage: If Duffel’s API is down or airlines systems are down, we cannot book or search. For short outages, simply try again later. Business continuity plan for extended Duffel outage:
Possibly have a backup content source (e.g., use Amadeus instant booking API or another GDS as a fallback). That’s probably too complex initially. It might be acceptable to pause auto-booking during Duffel downtime. We’d notify users if it’s prolonged.
Duffel being down means we can’t even search for deals. We could consider if our manual search Amadeus API could be leveraged to detect deals as a backup (Amadeus could search flights too), but booking via Amadeus is not trivial without redirect.
Another approach: if we find a deal price via Amadeus or cached data and Duffel is down, we might send an alert to user to book manually. It’s not “auto” but better than missing it entirely. So as a last resort, we can inform the user of the flight and perhaps provide a deep link to airline or google flights. This maintains some value to the user even when automation fails.
Supabase Outage: If our database or functions are down, basically our whole service is down. We can’t run searches or store results. The continuity plan might simply be: wait for restore and then resume. For truly critical operations like ongoing bookings, we might consider using an external job scheduler that’s independent. For instance, instead of relying on Supabase cron, use a separate AWS Lambda triggered by CloudWatch events or a small EC2 that runs a cron job. That way if Supabase is down, maybe that external job could still fetch pending campaigns from a read replica or cache. But if the DB is down, it can’t get campaigns either. We could maintain a redundant campaign list somewhere but that’s duplicative.
Realistically, partial outages can be mitigated if we decouple pieces. E.g., if the DB is the only thing down but our function environment is up, not much we can do because data is inaccessible. If our static site is up but backend down, user might see stale data or error – we should show a friendly error in the app if it can’t fetch data (like “service temporarily unavailable”).
Business Continuity for Data Access: During a long outage, users might worry about their data or upcoming bookings. We should have an emergency way to contact users if needed (like having their email list in a backup to send a message if system down). As part of sign-up, we gather email which we can use via an external email service even if our main system is down (assuming we have access to that contact info externally – maybe keep an export of user emails in our support system or so).
Disaster Scenarios and Response:
Data Breach: Not exactly outage, but continuity issue – if a breach happens, we might need to take systems offline and recover from clean backup or rotate keys (discussed in Risk section). Having backups helps to restore a known-good state if needed. Also having a IR plan to communicate to users, etc.
Major Cloud Outage (region-wide): If AWS us-east-1 (for example) has an outage and that’s where Supabase project is, we could be down. If possible, have ability to spin up in another region quickly. Supabase might handle by restoring backups to a new region if they deem it long outage. We should inquire on their DR strategy.
Testing & Monitoring:
Set up monitoring for key services: Ping Supabase DB, Stripe API, Duffel API, etc. If any go down (or certain API calls fail), alert devs. For user transparency, we could have a status page or at least update via Twitter/ email if something big is happening (“Stripe service disruption, auto-bookings may be delayed”).
Conduct fire drills: e.g., simulate Stripe being unreachable and see if our booking logic appropriately handles it (does it crash or skip or retry?).
High Availability vs Security: Sometimes HA strategies (like replicating data across many systems) can conflict with security (more copies = more attack surface). We balance by ensuring all backups and replicas are encrypted and access-controlled. Also, in line with data minimization, we don't keep data in more places than necessary. We likely won’t do live multi-region replication until needed because that doubles data locations. But for critical data, a secure backup in a second region is a good compromise. In conclusion, Parker Flight’s disaster recovery plan will include:
Daily encrypted backups of the database (with more frequent, e.g., hourly incremental backups if feasible, to minimize data loss window).
Secure storage of backups and keys in multiple locations (to survive a single point failure).
Runbook for restoration (document steps to restore DB from backup, re-deploy environment, re-point services).
Monitoring third-party outages and implementing fallback procedures like Duffel hold or user notifications if payment/booking can’t proceed immediately.
Communication plan to inform users of any prolonged downtime or data incidents (transparency is important for retaining trust, especially since we hold sensitive info).
By having these measures, we aim for near-continuous availability of critical functions. Even under adverse events, traveler data should remain safe (due to backups/encryption) and available within a reasonable time. For example, even if our primary systems go down, we know the data is backed up and can be restored, ensuring continuity of the business in the long run.
8. Regulatory Compliance Deep Dive
Key Question: What specific compliance requirements apply to Parker Flight’s handling of traveler data and payment information in major markets, and how can we meet them? We examine GDPR (EU), CCPA (California), PCI DSS (payments), and travel-specific regulations (TSA Secure Flight, APIS, etc.), as well as any data residency laws for international expansion. GDPR (EU) – General Data Protection Regulation: If we have users in the EU (which is planned), GDPR likely applies because we’ll be processing EU residents’ personal data (names, DOB, etc.). Key obligations:
Lawful Basis & Consent: We must have a lawful basis to process personal data. For Parker Flight, the primary basis is “performance of a contract” (the user asks us to book flights, we must process their data to do so). Consent is also relevant for optional things (like if we want to send marketing or share data). We’ll ensure our Terms of Service and Privacy Policy clearly outline what data we collect and that by using the auto-booking, they agree we process it for booking. Explicit consent might be obtained for particularly sensitive info (e.g., passport details) just to be safe, even if contract basis covers it.
Data Subject Rights: As mentioned, EU users can request access to their data, correction, deletion, restriction of processing, and data portability. Parker must implement processes to respond to these quickly (within 30 days typically). We will provide either self-service (like ability to delete account in profile settings which triggers deletion of all personal data) or a support channel to handle requests manually. Given “Zero tolerance for breaches”, we likely lean on being very user-friendly in privacy.
Right to be Forgotten: Upon request, delete all of a user’s personal data, unless we’re legally required to keep some (e.g., transaction records for accounting). We might anonymize records of bookings (so we keep stats but not identifiable to person). This will be implemented via deletion routines in our DB (ensuring also to delete data stored in third parties: e.g., delete Stripe customer or at least detach their card, and if we stored data in Persona or others, delete that via their API).
Data Portability: If a user asks for their data, we should provide it in a common format (JSON or CSV listing their campaigns and profile info). This likely won’t be requested often, but it’s straightforward to implement export.
Data Processing & Contracts: We need a Data Processing Agreement (DPA) with any sub-processors who handle EU personal data. For instance, Supabase, Stripe, Duffel, etc., should be GDPR-compliant and have DPAs available. We must ensure those are in place (Supabase offers a DPA, Stripe does too, etc.). Also, if data is transferred outside the EU (e.g., Supabase US servers), we need standard contractual clauses or ensure the provider participates in EU-US frameworks.
Privacy by Design/Default: We’ve incorporated this in architecture (minimization, encryption, etc.). We should also conduct a DPIA (Data Protection Impact Assessment) because we are handling sensitive personal data (IDs, potentially) and doing automated decision/processing (auto-booking might be considered automated processing, though it’s user-triggered logic). A DPIA basically documents our data flows, risks, and mitigations (much of which this research covers).
Breach Notification: If a data breach occurs involving EU users’ data, we must notify the relevant EU supervisory authority within 72 hours and possibly the affected users, unless the data was encrypted and unintelligible to attackers (which might exempt notification in some cases). Our plan to encrypt PII could reduce breach impact, but we’d still likely be transparent.
Data Minimization and Purpose Limitation: We addressed this – only using data for the booking purpose and not repurposing it without consent. We should not store data longer than needed (storage limitation) – e.g., consider deleting accounts that have been inactive for years (with notice).
Appointment of DPO: Not strictly required unless we process special categories on large scale or do large-scale monitoring. We likely don’t need a formal Data Protection Officer at <10k users, but aiming for SOC2 might mean we designate someone (one of the founders maybe) to oversee security/privacy.
CCPA/CPRA (California): For California residents, similar rights apply:
Right to know what data we collect and why, right to request deletion, right to opt-out of “sale” of data. We will have a privacy policy section addressing CCPA explicitly. Parker Flight does not sell personal data, and we should state that clearly (and thus opt-out of sale is not applicable except if we ever share data with partners for marketing, which we do not intend to).
If we use personal data for any beyond the immediate service, California users can opt-out. For example, if we had referral deals with airlines that involve sharing user data, we'd treat that carefully.
We should provide at least an email or form for California users to exercise rights (similar to GDPR approach). Possibly a “Do Not Sell or Share My Personal Information” link in the footer to be safe (even if we don’t sell, some interpret sharing with service providers as “share” which CPRA covers; but service providers like Stripe or Duffel are exempt as they are necessary for service).
We might need to honor “global privacy control” signals (a browser setting for opt-out) – this is a new requirement in California; if a user has it enabled, we should treat it as an opt-out of sale/tracking. Because we aren’t doing behavioral advertising, this is minor.
PCI DSS (Payment Card Industry Data Security Standard): Since we handle credit card payments, we must adhere to PCI DSS requirements. But importantly, by using Stripe as our payment processor and not storing card numbers ourselves, we dramatically reduce our scope. Stripe’s integration allows us to qualify for SAQ A (assuming we either use Stripe Checkout or a well-integrated Elements + tokenization solution). SAQ A is the simplest PCI self-assessment which is basically: maintain PCI compliant hosting (Vercel likely is, plus using TLS), don’t store card data, have proper policies. We should:
Ensure all card entry forms are served securely and provided by Stripe’s library.
Never log sensitive auth data (like if we did get a card token, that’s fine to log the token ID, but not the PAN or anything).
Have an incident response plan for card data (if somehow card data did leak, which is unlikely since we don’t have it).
Possibly get an Attestation of Compliance via Stripe’s guidance to show partners if needed in future (for SOC2, they’ll check PCI compliance for the part we do).
Our Stripe setup itself: keep API keys secure, use role-based access on Stripe dashboard, etc.
Travel Industry Regulations:
TSA Secure Flight (U.S.): Airlines flying from/within the US are required to collect Secure Flight info (full name matching government ID, date of birth, gender, and redress number if available) and transmit to TSA before flight. Parker Flight, as an agent, must ensure this data is collected and passed to the airline (through Duffel). Duffel’s API already requires name, DOB, gender for bookings, which covers Secure Flight. Redress number is not mentioned but we could include it if user provides (maybe as part of profile if they have one, optional). TSA also mandates a privacy notice is shown when collecting Secure Flight data. We should include a notice like: “Your Secure Flight information is collected pursuant to 49 U.S.C. 114, 49 U.S.C. 44901 and following... and will be transmitted to the U.S. Transportation Security Administration for watchlist screening.” Airlines usually include this. We might include it in a tooltip or terms when user enters such data, as Duffel’s guide hints at “important legal notices” to display during checkout.
APIS (Advanced Passenger Information System): Many countries require airlines to collect passport details for international flights (passport number, country, DOB, gender, etc.) and transmit before arrival. If Duffel’s booking flow needs these, we must collect and send them. If not needed at booking, the traveler might provide at check-in. But to be safe, Parker should be prepared to handle APIS. This means storing passport info (number, expiry, nationality) as part of profile for international campaigns. Ensure this data is transmitted securely and not used beyond the flight requirements.
GDPR on Passenger Name Records (PNR): The EU has PNR agreements for transferring passenger data to authorities for security. This affects airlines, but as a booking agent, Parker might indirectly handle that data. We should just ensure we provide airlines what they need and protect it on our side.
Local Data Residency Laws: Some countries require that personal data of their citizens stays within their borders or similar. For example, if we have customers in Australia or Canada, generally using global cloud with proper compliance is fine, but if we target markets like China or Russia, there are strict data localization laws (likely out of scope for now). If EU expansion is serious, we might host an EU instance of our backend to store EU user data in EU. Supabase allows choosing region (we could create a project in Europe). Or we might eventually segregate by region (which complicates global campaigns, but usually each user belongs to one region).
SOC 2 compliance: While not a law, Parker plans to get SOC 2 in ~18 months. Many of the above practices (encryption, access control, audit logging, incident response, vendor management) are required for SOC 2. We will implement them early to be prepared. For instance, ensure we log access to sensitive data (for SOC2 Security criteria), have continuous monitoring (via something like Vanta or Drata perhaps, as Supabase themselves used Vanta).
ISO 27001: If we consider international business clients, having ISO certification might come up. Our measures (similar to SOC2) align with ISO controls as well.
Special Considerations:
Minors’ data: If we store children’s data for family bookings, GDPR treats children’s data with extra sensitivity, and COPPA in US requires parental consent for under 13. We will only allow that data via the parent account which implies consent. We won’t market to kids, etc.
Accessibility (not exactly privacy, but regulatory-ish): We should ensure our app is accessible (ADA compliance for our US customers, etc.) – not asked, but important for broad user base.
Travel Document Handling: If we ever scan passports (maybe not planned, but if using Stripe Identity or similar to auto-fill passport info), we must treat those scans as highly sensitive and ideally not store them ourselves. Just mention because passport scans fall under ID data that is often protected (like in EU, government ID numbers can be considered sensitive PII, requiring extra protection). Conclusion for #8: Parker Flight will implement a compliance framework that addresses these regulations:
A robust privacy policy and user consent flows (clear communication why data is needed, allow opt-in for anything secondary).
Technical measures like encryption and pseudonymization to protect data (supports GDPR’s integrity/confidentiality requirement).
Organizational measures: training developers on data handling, restricting access (only 2 devs now, but maintain least privilege on production data).
Documentation: maintain records of processing activities (GDPR Art.30) – basically document what data we have and our purposes (this report is a good start).
Work with partners (Duffel, airlines) to ensure any data transfers are protected (likely Duffel’s terms cover Secure Flight etc., but if we integrate directly with airlines later, we’d need agreements).
Achieve PCI compliance and ideally get an attestation to prove it (should be straightforward via Stripe usage).
Prepare for SOC 2 by establishing policies and monitoring compliance continuously (like regular access reviews, vulnerability scans, etc., some of which Supabase and Vercel handle under the hood, but we need to manage app-level).
Regulatory compliance is not a one-time thing; we will continuously update our practices as laws evolve (for instance, more states adopting privacy laws similar to CCPA, etc.). By prioritizing data security and privacy from the start, Parker Flight will be in a strong position to meet these obligations and build trust with international users. As an example, being transparent and limiting use of personal data can turn compliance into a business advantage (users feel safer). We recall that travel companies must not only obey these laws but also preserve customer trust – a breach or violation could have severe reputational damage in travel where trust is key to customers handing over their personal preferences and documents.
9. Performance & Scalability
Key Question: How will different data storage approaches affect application performance at scale, and what strategies ensure the app remains fast as the user base and usage grows? We consider database query performance, encryption overhead, caching, and the scaling of auto-booking searches to thousands of concurrent campaigns. Database Performance (Supabase/Postgres):
With encryption: If we encrypt certain fields (passport number, etc.), queries filtering by those fields (e.g., searching traveler by passport) can’t use index (since encrypted data is essentially random). But we rarely need to query by those fields. Most queries are by user_id or campaign_id which can be indexed normally. So encryption won’t significantly affect performance for our use cases. We might incur a small CPU cost to decrypt when reading data. But this is negligible given the data sizes (a few hundred bytes of text) and modern hardware. Postgres pgcrypto or application-level AES decryption can easily handle thousands of ops/sec. For example, decrypting 1000 profiles for 1000 bookings is trivial (likely <0.1s total). Thus, security measures like encryption shouldn’t noticeably degrade performance with our scale.
Query optimization: We will add indexes on critical fields: user_id on traveler_profiles (to fetch a user’s profile quickly), user_id on campaigns (to list a user’s campaigns), maybe a composite index on (user_id, status) on campaigns for quick filtering. Also, if we have to query campaigns by criteria (maybe to find all active ones to run search), we might index status or next_run_time.
Supabase can handle 10k users and related data easily on a moderate tier. The main load might come from frequent flight searches, not from user data queries. Those searches will likely be more API-call-bound than DB-bound.
Scaling Auto-Booking Searches:
If we have, say, 5,000 active campaigns, how do we perform searches? We might do them serially or in batches. We can’t hammer Duffel with 5000 simultaneous requests. Possibly we’ll stagger them (maybe a rolling schedule, some every minute). Duffel might also allow a bulk search for multiple passengers or multiple criteria – but likely not. We might implement an internal queue system: e.g., every 10 minutes, process X campaigns. If each search call takes ~1-2 seconds and we do it sequentially, 5000 could take hours, so we must parallelize to some degree. Supabase Edge Functions can run in parallel up to some limit. Alternatively, we consider moving the search scheduler to a separate service (like a small Node server or AWS Lambda that can fan out requests).
We might use caching for certain data to reduce API calls: e.g., if many users are interested in flights from NYC to LAX, we could do one search and feed results to all relevant campaigns. However, since criteria might include price thresholds and dates, it might not overlap perfectly. But we can optimize: If two campaigns have identical criteria, only do one search. This suggests possibly having a normalized “search request queue” keyed by route/date range. This is an advanced optimization that can come in Phase 3 if needed.
Another performance aspect is the result handling: Duffel might return a lot of offers per search. We need to filter them against user’s criteria (price etc.). Doing that in our code is fine, but consider memory and CPU if we process many results. Possibly using streaming or pagination from Duffel so we don’t retrieve too many unwanted offers.
Caching Strategy:
Flight data caching: Could we cache some flight prices to avoid repeated searches? Flight prices change so often that caching more than a few minutes is not useful. We might cache the result of a campaign’s search for a short interval (e.g., if we poll every hour, no need to run twice within minutes unless triggered). But basically, treat Duffel as the live source each cycle.
Traveler data caching: Not needed, as discussed (just query directly).
Destination/airports data: We might cache static data like airport names, etc., but that’s minor and can even be hardcoded or stored in Supabase as read-only.
Session caching: Perhaps use an in-memory store (Redis or Supabase’s in-memory if any) for ephemeral session data, but since we are mostly stateless (JWT for auth, no heavy session state), not needed.
Concurrency and Throughput:
The design should ensure that the system can handle multiple bookings at the same time. Stripe and Duffel calls are external and can be done concurrently up to their rate limits. We should monitor Duffel’s API rate limit. If needed, coordinate calls (like don't exceed X requests per second).
We might consider using a job queue for booking tasks (something like if a deal is found, push a job to a queue to process booking so it can be retried or done asynchronously). This ensures if one booking fails or takes time, it doesn’t block others. There are cloud queue services (AWS SQS or even using Postgres advisory locks or Supabase’s background job if any).
Edge Functions vs Dedicated Worker: Supabase Edge Functions are good for short tasks (and are serverless, triggered by events or HTTP). For long-running background scanning, we might use the new Supabase Cron (which triggers a function on schedule) or a separate worker service. We need to ensure the environment can handle the volume. Possibly by Phase 3, we run a dedicated worker on a VM or container that continuously scans and triggers bookings (this might be simpler to manage control flow than pure serverless if tasks become complex).
Search and Filtering Performance on Traveler Data: If we eventually allow users to search their past bookings or filter profiles (small scale), our data volume is low enough that normal queries suffice. Even at 10k users with say 20k bookings total, searching that with proper indexes is fine. If an admin interface needed to search by name or email, we’d add index (though names encrypted would need separate approach, maybe we store a hash of name for search or ask user to input exact match to decrypt and compare). Encrypted Data Performance:
If we use a technique like deterministic encryption for certain fields (meaning same input yields same ciphertext, allowing equality checks), that could let us index or query by those fields (e.g., to avoid duplicates of passport number). Tools like Skyflow mention “polymorphic encryption” to allow some operations on encrypted data. We might not need that complexity now. But just to note, if performance or search on encrypted fields ever needed, deterministic encryption or tokenization would be the way.
The overhead of encryption at scale: If every booking requires decrypting, say, 5 fields (name, dob, passport, email, phone), and each decryption is maybe 0.1 millisecond, doing 1000 bookings is 1000 * 5 * 0.1 ms = 500 ms, negligible. Network calls to Stripe/Duffel are far more significant (tens to hundreds of ms each). So our bottleneck is external APIs, not local crypto.
Auto-Booking Campaign Scaling:
We anticipate up to thousands of concurrent campaigns checking for deals. If each campaign is one search per day or hour, that’s thousands of external calls per day/hour which is manageable. If it’s per minute, then it's an issue. We likely won’t check every minute unless user specifies high frequency (maybe we allow user to pick frequency or have some intelligent event-driven triggers).
Perhaps integrate with flight price monitoring APIs that push alerts (some platforms exist) rather than polling strictly, but Duffel likely requires polling. Could consider integrating Google Flights or Skyscanner APIs as alternative triggers in future if needed for scale.
Front-end Performance: Not asked, but as user base grows internationally, ensure our CDN (Vercel) serves quickly, and things like loading user’s profile is quick (likely, yes, just a few fields). We should lazy-load heavy things (e.g., if we had maps or analytics, ensure those don’t block). Vertical vs Horizontal scaling: Supabase is vertically scaled by choosing bigger instance or more read replicas. Stripe and Duffel scale on their side (they handle multi-tenant scaling). Our stateless functions can be scaled horizontally (serverless adds more instances under load automatically in Vercel). The key stateful part is the database. If usage spikes, we upgrade the DB instance or add a read replica. Also, optimizing queries and using caching for any expensive query results (but we don't have heavy analytical queries or anything). Cost implications: We should also consider that performance choices affect cost: e.g., doing 1000 searches per hour might incur Duffel API cost (if they charge per search or per booking – I think Duffel charges per booking a fee, not sure if per search). Also, running lots of serverless invocations might cost (Supabase might charge per CPU-time usage).
We can optimize cost by bundling tasks (e.g., one function handles multiple campaigns sequentially to reduce overhead per invocation).
Also by shutting down campaigns that are unlikely to succeed (like if user criteria is unrealistic, maybe we notify them or adjust frequency).
Cache Invalidation: If we ever cache profile data or search results, ensure to invalidate when data changes:
Profile cache invalidated on profile edit (straightforward).
Price cache invalidated on a certain time or new search event.
Likely we lean towards not caching critical dynamic info, and for static, invalidation is easy (like if we cached an airport list, it rarely changes, maybe update occasionally).
Scaling to 10,000+ users in 2 years:
10k users with perhaps 2k active campaigns concurrently is not a massive scale in terms of data (our DB is small). The challenge is external API usage, but that’s manageable with a robust job system and maybe some clever grouping of searches.
We should be mindful of any rate limits (Duffel might limit requests per minute; we may need to queue or batch to respect that).
If one day we had 100k users and 20k campaigns, we might need to invest in more sophisticated scheduling or more parallelism, but the architecture (separating the search/booking processing from main web app) would handle that.
Monitoring Performance: We will set up monitoring for:
Query performance (maybe log slow queries > 100ms).
External API latency (to detect if, say, Duffel calls are slowing down).
Resource usage: DB CPU/memory, function invocation counts, etc. This way we can scale up before hitting limits (Supabase has dashboards, Vercel provides function invocation metrics).
Also monitor user-facing performance – ensure encryption or network overhead isn’t causing any noticeable slowdowns in UI interactions.
In summary for performance:
Using third-party storage (Stripe/Persona) calls introduces some latency (e.g., if we had to call Persona API to get a passport number at booking time, that’s an external call that could add maybe 100-200ms). That’s acceptable compared to overall booking transaction time (which might be several seconds with payment and ticketing). But to minimize points of failure, we prefer data we need immediately (like passenger info) to be in our DB or memory at booking execution, not require another network call.
Thus, if using a vault, maybe fetch needed data right when the search triggers a potential booking, so by the time we confirm booking we have it ready.
At the scale of operations, our choices of unified vs separate data storage have minimal impact on performance; it’s more about security. The unified approach (one DB) actually is simplest and fastest for lookups. A separated approach (like storing PII in an external vault) could add minor latency and complexity, but still likely within acceptable range (especially if using local caches or if vault is high-performance).
The design aims to keep the critical path lean: One database read + calls to Stripe and Duffel for a booking. This should remain efficient at our target scale.
10. Future-Proofing & Vendor Strategy
Key Question: How do we architect the auto-booking data storage and integrations to avoid vendor lock-in and to handle future migrations or changes (e.g., if we outgrow a service or if APIs upgrade)? Avoiding Vendor Lock-In:
Supabase (Postgres): We chose Postgres as the core data store, which is an open standard relational DB. If for any reason we needed to move off Supabase (say self-host Postgres or move to AWS RDS), we can export the database and import elsewhere fairly easily. Supabase being basically vanilla Postgres means low lock-in – our SQL schemas and data are portable. To prepare, we should not use too many Supabase-specific features beyond what’s standard (RLS policies are Postgres standard, they’ll carry over; maybe storage and auth would require some rework, but manageable).
Stripe: Lock-in with Stripe is moderate – migrating payment providers (to say Braintree or Adyen) would require users to re-enter cards or some token migration if supported. Stripe has high switching costs mainly because customers’ saved payment methods are in their vault. However, Stripe is industry-leading and if we’re satisfied, lock-in is not a concern short-term. If needed, we could maintain parallel integration with another provider and slowly migrate customers (some providers can import Stripe tokens with user consent). To future-proof, we keep our payment integration logic abstracted (e.g., through a repository or service class) so that replacing Stripe’s implementation is at least isolated to one module.
Duffel (Flights API): Relying on Duffel means if Duffel changes pricing or service quality, we might want alternatives (like directly with GDS or use another API like Amadeus’s full booking API or TravelPerk, etc.). We should design our booking interface in a way that Duffel is a pluggable provider. E.g., have a layer of code like FlightBookingService with methods searchFlights(criteria) and bookOffer(offerId, passengerInfo, paymentInfo) which currently call Duffel, but could be adapted to another supplier’s API. Also, keep an eye on Duffel’s API versioning – ensure we use an up-to-date version and are ready to adapt when they deprecate older versions. They likely notify well in advance. We can mitigate risk by not using extremely proprietary features that others don’t have – stick to core booking flow that any provider would support.
Vault/PII Service: If we adopt something like Persona or Skyflow, ensure data portability: e.g., Persona likely allows exporting your data. But if we only store encrypted data in Postgres, we hold the keys so it’s portable. The main point is not to get stuck if, say, Persona’s pricing goes up drastically. One way to be safe is to encapsulate interactions – e.g., have a PIIStorage interface in our code that either calls Persona API or reads from our DB depending on config. Then switching is a config change + migration script.
Auth Provider: If we stick with Supabase Auth, that’s fine. If we ever needed to move to Cognito/Auth0, we should plan how to migrate user accounts (we’d have to migrate password hashes or require password reset). Not trivial, but doable. The best approach is to choose a stable solution upfront (Supabase Auth is basically standard email/password and OAuth, which is fine).
Integrations (Stripe, etc.): Use official SDKs or well-documented APIs to avoid hacks that break easily. Also, do not embed secret business logic in one vendor’s system (e.g., avoid writing a ton of logic in Auth0 rules or Stripe webhooks such that moving away loses that logic).
We also keep track of all external touchpoints: Payment, Identity, Flights. If any vendor changes terms or we outgrow them (cost or features), we should have a plan:
e.g., if hitting Stripe’s volume where maybe a direct payment processor is cheaper, or if we need more payment methods (PayPal, etc.), we might integrate an additional provider.
API Versioning and Deprecation:
Stripe: Very stable API, backward compatible changes usually. When they do changes, they allow versioning per account (you can stay on old version until you upgrade). We will periodically update to latest API version in Stripe dashboard and test.
Duffel: Being a younger platform, could evolve. We must follow their developer updates. Possibly subscribe to their changelog or use their API via an official SDK that is updated. Write our code to handle gracefully if new fields appear or if some fields deprecated.
Supabase: It’s evolving (especially their Edge functions, etc.) but as long as the database (Postgres) remains consistent, our core data is fine. Keep Supabase CLI and libraries updated to benefit from improvements (especially security patches).
Front-end Dependencies: Upgrading React/TypeScript and library versions to stay current helps future-proof the front-end, though unrelated to data storage, it is part of maintainability.
Cost Scaling and Budget:
As user base grows to 10k+, costs of these services will increase:
Supabase pricing goes up with database size and bandwidth, but likely still manageable (maybe a few hundred $ per month at moderate scale).
Stripe costs scale with transaction volume (they take a cut of each booking payment ~2.9% + $0.30 typically). That’s not a fixed cost but directly from revenue, so that’s fine (should be built into our margin or fee).
Duffel’s model: They charge per booking (I think $10 per booking or a commission). We must incorporate that into our finances. At scale, if we do thousands of bookings, maybe we negotiate rates or consider direct airline connections. But short-term, factor that cost in (maybe passed to user or in our fee).
Persona/Stripe Identity: If we verify every user, at 10k users, Persona cost could be ~$1250/mo (if using it). We might choose to verify only some users to control cost.
Vault: If using HCP Vault at $360/mo, that’s fine if we need it, but maybe not needed if our encryption suffices. Keep an eye that adding many services each with monthly cost can add up.
Auth0/Cognito: Not using for now, but Auth0 at 10k MAU might be a few hundred per month if we had gone that way.
We will periodically reevaluate if the services still provide ROI. For instance, if Supabase meets needs up to 100k users, great. If not, maybe moving to our own Postgres on cloud could cut cost or give more control. But managing DB ourselves means more DevOps, which we prefer to avoid until needed.
Data Portability Requirements:
From GDPR perspective, if a user asks to transfer data to another service, we should be able to provide it in a structured format. This is more a feature than architecture, but being organized in our data model makes it easier.
If Parker Flight ever needed to migrate all user data to a new system (say if we acquired or merge systems), having it in an exportable relational format is good. We might consider writing migration scripts (e.g., to move from Supabase to another Postgres) and test them in staging to ensure we can do it without much downtime.
Also, designing stateless front-end and API-driven architecture means if backend tech changes (like moving from Supabase functions to an AWS microservice), front-end can remain same by pointing to new API endpoints.
Reliability & SLAs:
Choose vendors with strong reliability and SLAs to reduce chances of needing to migrate. Stripe and Auth0 have good track records. Supabase is newer but so far reliable and with SOC2. We can consider an SLA: Supabase’s pro plans likely have an uptime guarantee; if not enough, we might step up to an enterprise plan or self-host to get control.
Always have a plan B: e.g., if Supabase had a critical issue, could we temporarily use a read-only backup for critical reads? For Stripe, if they had a long outage (rare), have a communication plan to users or maybe ability to collect card later.
Development Workflow and Flexibility:
Use Infrastructure-as-Code or configuration management for resources so migrating or replicating is easier. For example, script the creation of Supabase schema so we can spin up a new environment quickly. Use Stripe API for setting up webhooks or products if needed (so that can be redone in a new account).
Keep secrets in a vault or config management, not hardcoded, so that switching keys (to a new vendor’s keys) is just config change, not code change.
Emerging Tech and Trends:
Maybe in a couple years, new solutions (like improved privacy-preserving databases or new travel APIs) appear. If we remain modular, we can adopt them. For instance, if IATA introduces a new standard API that covers multiple airlines directly (bypassing Duffel), we could integrate it if beneficial.
Or if regulations require data localization, we might deploy separate instances (e.g., an EU-only instance). Designing our system to support multi-tenancy or multiple deployments under one umbrella might be needed (like distinct DB for EU, but maybe share codebase). Ensure code can handle that by not hardcoding things like region-specific logic beyond config.
Overall, by following encapsulation and modular design, Parker’s system will remain flexible. For each major component (Auth, Data storage, Payment, Booking API, PII vault), we aim to:
Abstract interactions behind an interface in code.
Document what would be needed to swap it out.
Keep exports/backups of data from that vendor regularly.
For example, we might do a quarterly export of all user profiles to CSV (encrypted) as a contingency. Or maintain a script to re-create Stripe customers if needed on another platform (though card data might require user re-entry). As an illustrative case: if Parker soared and decided to become an accredited travel agent connecting directly to airline systems (bypassing Duffel to save costs), the system we build now should let us plug that in. We’d essentially replace the FlightBookingService implementation: instead of calling Duffel’s REST, maybe use Amadeus’s direct booking API or a GDS system. The rest of the app (data model: campaigns, travelers) remains same. So user experience doesn’t break during such a migration. Vendor Lock-In Risk Summary: We minimize lock-in by not tying ourselves to one provider for critical functionality that we can’t replicate. The areas of highest potential lock-in are:
Payment (Stripe) – mitigated by using open token standards? (some support network tokens that can port, but not trivial). We accept some lock-in here because switching payment provider is uncommon and Stripe is very established. If needed, run both old and new in parallel for a transition.
Identity verification – easy to switch as it’s usually one-off checks; just don’t prepay huge contracts beyond need.
Database – minimal lock-in due to open tech.
Auth – staying with open source (Supabase) is less lock-in than proprietary (Auth0).
Code – ensure our own code is well-structured to adjust to changes.
To cement future-proofing, we will also keep an eye on our contracts and SLAs with vendors. For instance, ensure we’re not stuck in a long contract with some minimum spend that outpaces our growth (particularly relevant for Persona which often has contracts). We prefer pay-as-you-go models initially for flexibility. Finally, consider scenarios requiring migration:
If Supabase pricing or service becomes unfavorable, an alternate is self-hosted Postgres or another DB (MySQL, etc.). But moving to a different DB engine would require data migration and query changes – we avoid by sticking to Postgres (which is widely supported).
If a vendor discontinues a feature we rely on (e.g., say Stripe discontinued Stripe Identity, unlikely but hypothetically), we have alternatives (Persona, Trulioo, etc.). Because we aren’t building our entire logic inside one vendor’s ecosystem, we can switch if needed.
By being proactive in architecture now, Parker Flight’s system will remain robust against changes and will be easier to maintain and evolve. In software architecture, loose coupling and high cohesion are key: our system components should be as independent as possible. This way, future changes (whether due to scaling, new regulations, or switching providers) can be implemented in one part without rewriting the entire system.
Architecture Recommendations
High-Level System Architecture
Overview: The Parker Flight system will be composed of several integrated components, each with a clear responsibility, and with security controls at each boundary. Below is a text-based "architecture diagram" description of the components and their interactions:
Frontend: A React + TypeScript single-page app (SPA) served via Vercel. This handles all user interactions. It communicates with backend services through secure HTTPS calls (and WebSockets if using Supabase’s real-time, though not essential here). The front-end never directly handles sensitive data storage – instead, it uses third-party SDKs for extremely sensitive inputs (e.g., Stripe Elements for card entry, which sends data straight to Stripe). It stores JWT tokens for auth (from Supabase Auth) to authenticate API calls. Key front-end responsibilities:
Collect user inputs for search criteria, traveler details, etc., and send to backend API.
Display search results (for manual flow) fetched from Amadeus (likely via our backend or directly from front-end if Amadeus provides a client-side safe endpoint).
Provide UIs for managing traveler profiles and payment methods. For example, a “My Profile” page where the user can add/edit personal info (calls our backend endpoints which in turn store in DB) and a “Payment Methods” page where a user adds a card (which invokes Stripe’s UI).
Initiate auto-booking campaign creation (sends criteria and references to chosen traveler profile + payment method to backend).
Receive live feedback or notifications (maybe via WebSocket or polling) about booking events (e.g., “Your flight to X was booked!”).
Ensure no PII or card data lingers in front-end storage beyond necessary (e.g., don't keep passport number in a Redux store unencrypted).
Backend: Built primarily on Supabase (PostgreSQL + Edge Functions).
Database (PostgreSQL via Supabase): Stores persistent data – user accounts, traveler profiles, campaigns, etc. Supabase Auth sits on this (managing user credentials and sessions). We enable Row Level Security so that each user can only access their own data. For example, traveler_profiles table will have a policy: user_id must match logged-in user’s ID for any select/update. Sensitive fields in the DB (like passport numbers, paymentMethod tokens) are encrypted at rest (via Postgres pgcrypto or stored as tokens). The DB is encrypted at disk level by Supabase anyway, but we add another layer for specific columns.
Backend Functions/Services: We’ll use Supabase Edge Functions (which are essentially serverless functions running on Deno, close to our DB) for our API endpoints and background tasks. These functions form the backend API that the frontend calls. E.g., functions for:
Creating/updating traveler profile
Creating a campaign (which will store criteria and perhaps schedule searches)
Webhook handlers (Stripe webhooks for payment events, Duffel webhooks if any for booking updates)
A scheduled function (via Supabase Cron or external trigger) to run flight searches for active campaigns.
These functions run with service role access to the DB (bypassing RLS internally but we’ll implement checks in code).
Stripe Integration: No separate server needed, we integrate via the Edge Functions using Stripe’s SDK or REST calls. For example, a function addPaymentMethod might create a Stripe customer (if not exists) and generate a Setup Intent, returning client secret to frontend. A webhook function will listen for Stripe events (like a charge succeeded or failed) to update campaign status or send notifications. Parker’s backend does not store card data; it only stores Stripe IDs and uses them to make PaymentIntent calls for charges.
Duffel Integration: The backend functions will call Duffel’s API for searching and booking:
A scheduled job might call GET /air/offers?criteria... to search.
A booking function will call POST /air/orders with passenger info and payment confirmation (Duffel may require a payment token or confirmation that we’ve paid – as per docs, we charge ourselves then confirm the order).
Duffel API keys will be stored securely in environment variables of the functions.
If Duffel provides webhooks (e.g., order ticketed or flight change), we’d set up a function to receive those.
Amadeus API (Manual search): This is read-only flight search. Possibly the frontend could call Amadeus directly for flights since no PII is involved – but Amadeus might need an API key not exposable to public. Safer to proxy via an Edge Function. So front-end calls our /searchFlights endpoint with query, the function calls Amadeus API and returns results. Since manual search doesn’t store anything, it’s straightforward.
Supabase Storage (if needed): Supabase includes an S3-like storage. We might use it for storing documents if we ever upload any (e.g., if user wanted to upload a passport scan for convenience, though that’s sensitive – better to avoid storing unless encrypted heavily). For now, probably not used.
Third-Party Services:
Stripe: Handles payment info and processing. The architecture: Frontend uses Stripe Elements to get a PaymentMethod token. Our backend stores the token and can create PaymentIntents to charge it. Also, Stripe sends webhook events to our backend (we’ll set up an endpoint like /stripeWebhook) about payments, which we use for confirmation or error handling. Data flow example: User adds card on frontend -> Stripe sends token to backend -> backend attaches to customer -> later, backend triggers charge -> Stripe processes and sends confirmation event -> backend receives and marks booking as paid.
Duffel: Provides the interface to airlines. We communicate with Duffel exclusively from backend functions (never directly from the client, since that requires our API key and also we might want to combine data from our DB). Data flow: Backend calls Duffel to search -> receives offers -> possibly filters them -> triggers booking -> sends PII and gets an order confirmation back -> stores booking details. If a booking is made, the backend likely also immediately charges via Stripe and only on success finalizes the Duffel order (to avoid issuing ticket without payment).
Supabase Auth: Though part of Supabase, treat it as a service. It manages user signups, logins, and issues JWTs. We might integrate social logins via it. It stores minimal user data (email, hashed password). Our traveler_profiles are linked by user_id (the UUID from Auth).
Optional: Persona or Stripe Identity if we integrate identity verification. That would involve the frontend launching a verification flow (via their widget), and the result is sent to our backend (webhook or direct). Parker then knows the verification status. This doesn’t heavily affect architecture but sits as an auxiliary component for risk management.
Security Architecture and Data Flow Protections:
All front-end to backend communication is over HTTPS with JWT auth. Supabase Edge Functions will validate the JWT on protected routes (they come with context of the user if using Supabase’s middleware).
Network segregation: The database is not directly exposed to the internet (only via Supabase endpoints with auth). The Edge Functions run in a secure environment close to the DB for low latency and are authenticated to it.
Encryption in transit: Using TLS everywhere (which is default for these services).
Encryption at rest: Supabase DB and Storage encrypted by default. Additional encryption of particularly sensitive fields at application level.
Secrets management: API keys for Stripe, Duffel, etc. stored in environment config of the functions (Supabase provides secure secret storage for functions). These are not exposed to users. We restrict who (which team members) can access these config values.
Data Flow Diagrams for Both Flows:
Manual Search Flow:
User on frontend enters search parameters (from, to, dates, etc.).
Frontend sends request to our Search API (Edge Function) with those parameters.
The Search function calls Amadeus Flights API (or possibly Duffel’s search if we unify on one API) and gets flight offers.
Search function returns the results to frontend. (We might do minimal processing, e.g., formatting or caching).
User sees list of flights and selects one; since booking is external, we provide a deep link or redirect to the airline’s site or a travel agent site (Amadeus typically provides a booking link or we construct one).
The user completes booking outside Parker Flight. (We might optionally track if they clicked out – but no personal data involved).
Note: No traveler PII is needed in this flow. If user is logged in and has a profile, we could prefill or recommend using their saved info at airline, but since redirect likely goes to an airline form, we can’t auto-fill that for them (unless using some affiliate integration). At most, we show a pop-up “Remember to book under the same name: John Doe” for consistency.
Auto-Booking Campaign Flow:
Setup Phase (user creates a campaign):
User navigates to “Create Auto-Booking Campaign” in frontend. If they haven’t saved a traveler profile or payment, they’ll be prompted to do so.
Traveler Profile Creation: User enters personal details (name, DOB, etc.) in a secure form. On submit, front-end calls backend API (Edge Function) e.g. /createProfile with that data. The function, after verifying JWT, encrypts fields as needed and inserts into traveler_profiles with link to user_id. Returns success.
Payment Method Setup: User enters card info via Stripe Elements on front-end. Stripe JS sends card data to Stripe, gets a token (PaymentMethod id). Option A: front-end sends that ID to our backend /saveCard function; Option B: we use Stripe’s SetupIntent from backend and front-end just handles the 3DS popup. Either way, the result is a verified PaymentMethod attached to a Stripe Customer. Our DB stores the PaymentMethod ID and perhaps marks it as default for user.
User enters campaign criteria: origin, destination (or region), date range or frequency, maximum price, cabin class, etc., plus selects which traveler (if only one, that’s auto) and which payment method to use.
Frontend calls backend /createCampaign with criteria, traveler_profile_id, payment_method_id. Backend function records this in campaigns table (status = active, next_run = now or a schedule, etc.).
Backend might immediately trigger a search (or schedule it soon) to confirm everything is set.
User sees the campaign listed in their dashboard (e.g., “Trip to Hawaii up to $400 – active”).
Automated Search & Booking Phase:
A scheduler (could be Supabase Cron, running e.g. every hour) invokes the Campaign Processor function.
The Campaign Processor fetches all active campaigns due for a search (maybe those not searched in last X hours).
For each (or in batches), it calls Duffel’s Offers API to search flights corresponding to that campaign’s criteria (dates might be flexible – we might search a range or specific day). It includes in the search the passenger mix (adult, etc.), which it knows from traveler profile (DOB -> age category).
Duffel returns offers (with prices, times, etc.). The function filters these results: find any that meet the user’s criteria (price below threshold, correct stops or airlines if we allow filtering those).
If none qualify, mark the campaign as checked (and schedule next check).
If one or more offers qualify, pick the best one (e.g., cheapest or best match).
Booking transaction begins: The function now calls Stripe to charge the user:
Create a PaymentIntent for the price amount (plus our fee if any) on the stored payment method (off-session).
If the charge succeeds (immediate confirmation), proceed. If it requires action (unlikely due to prior setup but possible), we have a decision: either fail the auto-book (and maybe notify user to add a card or enable 3DS) or attempt hold. For MVP, likely fail with notification.
With payment confirmed (or at least initiated), call Duffel Order API to book the flight. Provide passenger details from traveler profile (name, DOB, gender, contact) and payment info. Duffel might not need the card info since we pay via Duffel balance or we confirm ticket issuance since we charged the user directly per their model.
Duffel responds with a successful order (including airline PNR/booking reference)
duffel.com
.
Our function stores the booking info in a bookings table (or updates the campaign record with a "booked" status, storing flight details, PNR, etc.).
The function likely also sends out notifications: an email to user with itinerary and reference, maybe a push notification on front-end (if they’re online).
Mark campaign as fulfilled (or if it was one-time, mark as completed; if campaign is supposed to continue looking for another trip - probably not, likely one booking and done unless user created an open-ended campaign).
If Stripe charge later fails (e.g., we charged but then had to refund because booking failed), handle accordingly – ideally we charge only after booking is confirmed or vice versa. (We might do Duffel hold-> Stripe charge-> then finalize Duffel order).
In case of partial failure (charge succeeded, Duffel booking failed due to price change or seat sold out), we must void/refund the charge and notify user. That error handling needs to be robust: Duffel likely has idempotency or error returns we can catch.
The whole booking flow should be transactional to the extent possible: either all steps succeed or we rollback (cancel ticket or refund if one step fails). Implementing compensation steps (like refund on failure) is important.
Post-Booking:
We maintain a record of the booking for the user to view. They might use Parker to view their e-ticket information or to cancel if supported. Canceling a booking could be via Duffel API if within allowed time, and we’d process refund via Stripe accordingly.
Also, if auto campaigns remain active (maybe user wanted multiple trips, or the campaign is “find me a deal every quarter” – not sure if that’s in scope), it could continue.
The user can also manually terminate a campaign (via front-end -> API to delete campaign -> backend stops searching and wipes any stored triggers for it).
Integration Patterns and API Design:
We mostly follow RESTful API patterns for our backend functions (or RPC style via functions since Supabase functions are like RPC endpoints).
Each external integration is abstracted:
Stripe: use Stripe’s official libraries in Node context for ease and built-in handling. Keep the Stripe secret in server, only publish public key to front-end for Elements.
Duffel: maybe use Duffel’s SDK if available, or direct HTTPS calls with our auth token. Possibly implement retry logic for robustness (if an API call fails due network).
Amadeus: They have an SDK too, but likely just a GET with query params for flight offers (bearing in mind rate limits).
Use webhooks to handle asynchronous events from Stripe and Duffel. E.g., Stripe webhook “payment_failed” could mark campaign back to active so it might try again or notify user to update card.
If we integrate Persona or Stripe Identity, those will follow a similar pattern: user verification session -> webhook with result -> update user profile status (like verified=true).
Error Handling & Fallbacks:
At each step of booking:
If payment fails: mark campaign as payment error, notify user (so they can update card), do not attempt booking.
If Duffel booking fails: (due to fare gone, or API error), we have charged the user already in our current flow which is not ideal. So better approach: hold booking first if possible, or at least ensure availability. Perhaps use Duffel’s offer hold feature: They have a “hold order and pay later” option. If we use that: we reserve seats -> then charge card -> then confirm order by paying Duffel. That sequence prevents charging for something unbookable. We’ll explore that. If not holding, then if booking fails after charge, we immediately refund via Stripe and inform user (and maybe keep campaign active to try again).
If notification fails: If an email fails to send, it’s not critical to booking, but we should retry or have support follow up. We can use a reliable email service (SendGrid, etc.) with retry logic.
Fallback Strategies:
If auto-book fails, as mentioned, maybe offer the user the deal manually: e.g., “We couldn’t auto-book, here’s a link to book it yourself since price is $X right now.” This at least gives user a chance.
If a third-party outage (Stripe/Duffel) prevents booking at that moment, implement a retry loop: e.g., try booking again a few minutes later up until a deadline (since flights won’t hold price long). Or at least don’t immediately cancel campaign; maybe wait for service to return. We can incorporate a check: if Duffel API call fails due to network, catch it and schedule a retry within 5 minutes.
Security in Architecture Diagram terms:
Users authenticate via Supabase (which issues JWT). That JWT is sent with each request to our Edge Functions, which verify it. Also for high-risk actions (like adding payment or deleting account) we might implement additional verification (maybe re-auth or email confirmation) to prevent account hijack issues.
Internal services (Edge Functions to DB) communicate in a secure internal network environment (Supabase handles this; Edge Functions have direct access to DB with a service role).
All write actions have appropriate validation: e.g., traveler profile input validated (no script injection, etc.), though primarily it’s just text fields – but still, use parameterized queries or ORM to avoid SQL injection. Supabase likely uses a safe interface.
We will log important events (profile created, campaign created, booking made) in an audit log table for security monitoring.
In essence, the architecture is a hub-and-spoke model with our Postgres database as the central hub (the single source of truth for user data and state), and various spokes: the front-end app for UI, Stripe for payments, Duffel/Amadeus for flights, and possibly an identity service. The backend functions are the orchestrators that connect these pieces, enforce business logic, and maintain security checks. This architecture ensures that at no point is sensitive data exposed unnecessarily:
Payment data goes from front-end to Stripe without touching our servers in plaintext.
Personal data goes from front-end to our backend over TLS and straight into an encrypted database field.
When we need to use PII (booking), it goes from our secure DB to Duffel over TLS. We trust Duffel as a processor (Duffel’s compliance: likely PCI and GDPR compliant as a travel intermediary; we should have an agreement with them too).
We maintain clear boundaries so if a component is compromised (say front-end code via XSS), the blast radius is limited (cannot directly retrieve all PII without proper auth and encryption).
The architecture is also scalable: each component can scale independently:
The front-end is CDN-distributed (Vercel) and can handle growing traffic.
Edge Functions can scale horizontally on Supabase (within limits; if needed, we could move heavy background tasks to a more scalable environment like AWS).
The database can be upgraded to larger instances or cluster if needed.
Stripe and Duffel services inherently handle scaling on their side.
Implementation Roadmap
Breaking the implementation into phases ensures we deliver a working product early (MVP) and then enhance security and features progressively: Phase 1: MVP (Next 2-3 months) – Focus on getting the auto-booking feature basically working for a single traveler with core security:
Core Data Structures & Basic Security:
Set up Supabase project, define the schema: users, traveler_profiles, campaigns, payment_methods, bookings (if separate). Enable RLS policies so that users can only see their data.
Implement server-side encryption for at least passport number and paymentMethod ID if storing (though PM ID not sensitive, so mostly passport or other PII fields). In MVP, we might skip encrypting less sensitive fields to reduce initial complexity, but ensure the design allows adding that.
Basic Supabase Auth configuration (email/password, perhaps magic link login for simplicity and security).
Frontend MVP:
Pages: Signup/Login, Manual Search page (using Amadeus API results), Auto-Booking Campaign page (to create campaigns), Profile page (to input traveler details), Payment page (to add card).
Integrate Stripe Elements for card collection. On front-end, get PaymentMethod token.
Use simple UI forms for inputs, with client-side validation (e.g., valid date formats).
Backend MVP:
Edge Function for searching flights (calls Duffel or Amadeus for testing – might use Duffel for search to not integrate two different APIs at first).
Functions for CRUD on traveler_profile (create, maybe update).
Function to save payment method (calls Stripe API to attach PaymentMethod to a Customer).
Function to create campaign (inserts row, schedules it).
A basic scheduler mechanism: Perhaps initially use a workaround since Supabase Cron might be new – we can simulate a scheduler by having an Edge Function that runs when called, and call it via an external cron (like a GitHub Action or simple AWS Lambda triggered on schedule) to avoid complexity. Or use Supabase’s experimental cron if available.
The campaign processing function: retrieve campaigns, call Duffel’s search (we might integrate Duffel’s API fully now: get an API key, etc.), apply criteria logic, choose an offer, call Duffel order, call Stripe charge. For MVP, possibly target a known route to test (or use Duffel’s sandbox which might not do real charges).
Integrate SendGrid (or similar) for transactional emails (send user confirmation when booked, etc.).
Testing & Hardening MVP:
Write unit tests for critical functions (simulate a campaign trigger).
Do a test booking in a non-production environment (maybe using Duffel sandbox and Stripe test mode) to ensure the end-to-end works: user -> saved details -> triggered search -> “book” a dummy flight -> see result.
Ensure logs are capturing what’s needed and no sensitive info is printed.
Perform basic security tests (try to access another user’s data via API, ensure RLS prevents it).
Deliverable of Phase 1: A working Parker Flight system that can:
Let a user sign up, enter their traveler info and card, set a campaign (even if just for a near date for testing), and automatically simulate booking a flight (maybe using a test environment).
Manual search still works as before (likely unchanged or improved slightly).
This MVP might be limited: e.g., might only support one specific currency (USD), assume one passenger adult, not handle all edge cases (like booking failures gracefully), but proves the concept.
Phase 2: Production-ready & Security Hardening (3-9 months) – Focus on making the system robust, secure, and compliant for real users:
Complete Security Enhancements:
Encrypt all personal data fields that we identified (using a proven library or pgcrypto). Implement key management (e.g., store encryption key in Supabase function env or use KMS). Rotate keys if necessary (design a plan for rotation, maybe not needed yet but have the ability).
Implement more fine-grained access control: e.g., ensure even within a user account, a non-privileged context can’t do certain things (this matters only if we had roles, which we don’t currently aside from user vs admin).
Set up logging and alerting for security events. Possibly integrate with a service like Sentry for error monitoring and a SIEM for security logs (if aiming for SOC2).
Conduct a threat modeling session and address any findings (for example, ensure protection against XSS, CSRF (if any form posts, though mostly API so use proper headers), SQL injection (use query parameters), etc.).
Penetration Test: Perhaps hire an external auditor or use automated tools to scan for vulnerabilities. Fix issues found.
Prepare documentation/policies needed for SOC2: access control policy, incident response plan, etc. (These don’t affect code but are tasks in this phase given 18-month SOC2 goal).
Compliance Features:
Add GDPR-related features: account deletion function that truly deletes (or anonymizes) all personal data. A way for users to request their data (maybe a simple “Export my data” button that emails them a JSON).
Update the UI and flows with proper consent notices (e.g., cookie consent if we use any tracking, explicit checkbox for agreeing to terms/privacy at sign-up, a notice when entering Secure Flight info as mentioned).
Ensure we have DPAs in place with all processors (Supabase, Stripe, Duffel, etc.) and document data flows for compliance records.
Reliability & DR:
Move the scheduler to a more reliable setup if needed: possibly deploy a small worker (Node script) on AWS that wakes up and triggers the function for searches, to reduce dependency on Supabase’s scheduler.
Implement backups: automated dumps of the database to secure storage. Perhaps use Supabase’s point-in-time restore in testing to verify it.
Create a read replica or at least have a plan if the DB gets heavy read load (Supabase offers read replicas on higher tiers).
Write runbooks for common incidents (Stripe down, etc.) and test our system’s behavior by simulating (maybe temporarily disable network to Stripe in a dev environment and see fallback).
Feature Improvements:
Expand campaign criteria options (if initially basic, maybe now include filtering by airlines, time flexibility).
Implement multi-currency support if needed (detect currency of route or user and handle it).
Add support for international flights properly: collect passport info when needed. Perhaps integrate a library for validating passport formats by country.
Minor traveler support: allow user to specify if traveler is child (<18) so that the search uses correct passenger type (Duffel requires age for minors).
Possibly integrate an identity verification for an extra layer if we deem it necessary (maybe optional “verify identity” button that uses Stripe Identity to reduce fraud for high-value bookings).
Add an admin interface (even simple) so admins (us) can see all campaigns, bookings, and manually intervene or assist if something goes wrong. This is important for operations (e.g., refund a booking or restart a failed campaign).
Performance Optimizations:
If we notice any slowness, address it. Maybe implement caching of frequent search results across users if feasible.
Scale up infrastructure as needed (e.g., move from Supabase free/dev tier to a prod tier with more resources).
Use CDN or edge caching for static responses (maybe cache popular flight searches for not logged-in usage to reduce API calls).
Go Live and Monitoring:
By end of Phase 2, aim to launch to real users (starting with the initial 100-1000 user goal).
Set up monitoring dashboards (Supabase analytics, Stripe dashboards for payments, etc.) and alerting (e.g., get alerted if any booking fails or error rates spike).
Start security audits for SOC2 readiness, which might take a few months of evidence collection.
Phase 3: Scale-Up & Advanced Features (9-18+ months) – After initial production, focus on scaling and expanding capabilities (multi-traveler, corporate, etc.):
Multi-Traveler Implementation:
Enable the UI for managing multiple traveler profiles per account. Allow adding additional profiles (spouse, child, etc.), with appropriate input fields (relationship maybe, and possibly separate contact info if needed).
Modify campaign creation to allow selecting one of the saved travelers (for group bookings in the future, possibly allow selecting multiple travelers in one campaign).
Update the booking logic to handle multiple passengers: the search API call to Duffel would include multiple passengers with their types/ages, and booking call would include multiple travelers’ info. Ensure the logic assigns infant to adult if applicable (maybe simply: if any infant profile, pair with first adult).
Test group bookings thoroughly on Duffel (some airlines might price differently or require all in one PNR).
Implement UI changes like displaying all travelers on a booking confirmation.
Add any necessary permission flows if later, e.g., share a campaign with someone or allow another user to manage your profiles (optional advanced feature).
Corporate/Team Accounts (if pursued):
Introduce an “organization” concept where one account can invite others or book on their behalf. This might require more substantial changes (role field, linking users to org, etc.).
Possibly skip unless business model needs it, because that’s a big expansion.
Optimization:
If number of campaigns is very high, consider optimizing search dispatch: e.g., cluster campaigns by route and do one search to cover many. This could drastically cut API calls. Implement a caching layer for search results keyed by route+date, so you don’t call Duffel 100 times for 100 users wanting NYC-LON similar dates.
Improve campaign scheduling: could move from simple periodic polling to an event-driven model. For example, maybe use price tracking APIs or connect to Duffel’s notifications if any (maybe Duffel or an underlying GDS can push when price drops? Not sure if available).
Fine-tune DB: partition data if needed (e.g., huge logs or old campaigns could be archived so main tables remain small).
Continue to scale infrastructure: at 10k users, maybe a larger db instance; at 100k, might consider sharding or at least more read replicas. But likely not needed at 10k.
Cost Optimization:
Revisit third-party usage costs: e.g., if Persona integration not used often, maybe drop it. Or negotiate volume discounts (Stripe will give better rates at scale, Duffel perhaps too).
If Vault (HCP) used and expensive, evaluate if we can self-host or if simpler approach suffices.
Optimize Stripe charges grouping if possible (though each booking separate is standard).
Continuous Security & Compliance:
By this time, aim to finalize SOC 2 Type I and start Type II audit. Implement any controls or automation needed (like log reviews, regular risk assessments).
Possibly pursue additional certifications if needed (ISO 27001 if enterprise clients demand).
Adapt to new privacy laws (e.g., more US states, or India’s PDP, etc.) as we expand regions.
Ensure our data deletion and consent processes scale (e.g., automated deletion for inactive users after X years to reduce liability).
User Feedback & Advanced Features:
Gather user feedback on auto-booking: add features like the ability to pause campaigns, or set more complex rules (like “book at most 2 trips per year”).
Add a feature for refunds or rebooking in-app if user cancels (maybe integrate Duffel’s cancel order API).
Possibly integrate travel insurance offerings or other upsells (which adds data flows, but interesting).
If we expand to hotel or other travel, that would be new verticals but with similar architecture patterns.
Migration Strategy if Changing Approaches:
If we decide to switch something fundamental (like replace Duffel with another provider): write migration scripts to port existing data (e.g., old Duffel offer IDs wouldn’t carry over, but we mostly just store bookings and maybe keep Duffel order IDs for reference).
If moving off Supabase: spin up new Postgres, import backup, point new backend to it. Because of how we structured, the downtime could be just maintenance window.
If switching auth provider: perhaps run them in parallel and gradually migrate logins (like when user logs in, create account on new system and then flip once most active users moved).
These migrations are complex but planning and isolating components as we have makes them doable with minimal user disruption.
The roadmap ensures we first build the essentials (Phase 1), then fortify and polish (Phase 2), and finally expand and optimize (Phase 3). Each phase yields a working product with incremental improvements, aligning with the expected growth of users and required security posture over 18 months.
## Risk Assessment

This section provides a comprehensive analysis of security, operational, and compliance risks associated with Parker Flight's traveler data architecture, along with specific mitigation strategies.

### Risk Framework

We assess risks across four critical dimensions:
- **Security**: Data protection, unauthorized access, breaches
- **Compliance**: Regulatory violations, legal penalties
- **Operational**: System availability, performance, business continuity
- **Financial**: Cost overruns, fraud losses, vendor changes

Each risk is evaluated on:
- **Impact**: Low/Medium/High business impact
- **Likelihood**: Low/Medium/High probability of occurrence
- **Mitigation Strategy**: Specific controls and preventive measures

### Risk Assessment Matrix

| Risk Category | Risk | Impact | Likelihood | Mitigation Strategy |
|---------------|------|--------|------------|--------------------|
| **Security** | Data breach of PII | High | Medium | Encrypt PII, strict access controls, monitoring, timely patches |
| **Security** | Account takeover | Medium | Medium | MFA support, monitor logins, secure password policies |
| **Security** | Third-party breach | Medium | Low | Choose reputable providers, DPAs, data minimization |
| **Security** | Insider threat | Medium | Low | Audit logs, least privilege, production access controls |
| **Security** | Denial of Service | Medium | Medium | DDoS protection, rate limiting, auth requirements |
| **Compliance** | GDPR non-compliance | High | Low-Med | Privacy practices, user rights features, legal review |
| **Compliance** | PCI non-compliance | High | Low | Stripe tokenization, PCI DSS audits |
| **Compliance** | Data residency issues | Medium | Low | EU hosting options, standard clauses |
| **Operational** | System outage | Med-High | Medium | Backups, multi-region plan, monitoring, DR procedures |
| **Operational** | Third-party outage | Medium | Medium | Retries/holds, user notifications, backup providers |
| **Operational** | Performance bottleneck | Medium | Medium | Load testing, infrastructure scaling, query optimization |
| **Operational** | Integration failures | Medium | Medium | Monitor API changes, resilient code, graceful failures |
| **Financial** | Fraudulent bookings | Medium | Medium | Stripe Radar, identity verification, clear communication |
| **Financial** | Cost overrun | Medium | Medium | Budget alerts, scalable usage, periodic reviews |
| **Financial** | Vendor price increases | Medium | Low | Alternative providers, negotiation, revenue scaling |

### Detailed Security Risks:
Data Breach (PII leak by hacker attack): Impact: Very high (loss of user trust, legal penalties). Likelihood: Moderate (we are a target due to sensitive data). Mitigations: Strong encryption of PII (breach won’t reveal plaintext), strict access controls (RLS, least privilege), regular security testing, up-to-date dependencies, WAF in front of endpoints (Supabase might have basic protections, we could add Cloudflare if needed).
Account Takeover (user credentials stolen or weak): Impact: Individual user impact high (their data misused). Likelihood: Moderate (phishing or reused passwords). Mitigations: Encourage strong passwords and offer MFA (Supabase Auth supports OTP MFA). Monitor for suspicious logins. Possibly integrate “Have I Been Pwned” checks for leaked passwords on signup.
Insider Threat: (Though team is 2 now, in future could be more) Impact: Medium to high. Mitigations: Use audit logs for data access, limit who can access production DB (maybe only through a bastion with logging). Use separate accounts/roles for dev vs prod in Supabase.
Third-Party Breach: e.g., Stripe or Duffel gets breached. Impact: If Stripe breached, card data could leak (but they are extremely secure and PCI regulated) – outside our control but could lead to fraud, which Stripe would handle by card replacements. Duffel breach might expose travel plans – ensure our contracts and their security posture (they likely have their own compliance). Mitigation: choose reputable, compliant providers (which we did), and have DPAs to ensure they are liable to protect data. Also don’t send more data than needed (principle of minimization extends to data we give Duffel or Stripe too).
Denial of Service (DoS) attack: Impact: Downtime and inability to serve users, maybe missed bookings. Mitigation: Supabase and Vercel have DDoS protections (Supabase uses Cloudflare, etc.). We can also implement basic rate limiting on our endpoints to thwart brute-force or spam. For auto-book, since triggers are internal, DoS mainly would be web traffic. We ensure heavy actions require auth so randoms can’t abuse our APIs easily.
Compliance Risks:
GDPR Non-compliance: e.g., failing to delete data on request or data being processed without proper consent. Impact: Fines up to 4% of global turnover, user lawsuits. Mitigation: Implement requests handling, clear privacy notices, get legal counsel to review policies. Keep only needed data so scope is limited.
PCI Non-compliance: If we inadvertently handled card data insecurely, we could be fined or lose ability to process payments. Mitigation: Strictly use Stripe’s recommended integration. Do annual PCI self-assessment. Never handle PAN in our code/storage (which we won’t).
Data residency issues: If we have EU users and store data in US without proper measures, could violate laws after Schrems II. Mitigation: Use providers with EU options or standard clauses. Possibly host EU user data in EU region if necessary in future.
Regulatory changes: Privacy laws evolving (like new US states). Impact: If we don't adapt, we could face penalties or lawsuits. Mitigation: Stay updated via counsel or industry groups. The architecture with flexibility to delete and track data will help comply with any new “Right X”.
Operational Risks:
System Outage (downtime due to bug or infra issue): Impact: Missed bookings, unhappy users, refund hassle if partial bookings. Likelihood: Moderate, especially early on. Mitigation: Use managed services with high uptime (Supabase, etc.), implement DR (backups, maybe redundant job processing). Test failover scenarios. Have on-call arrangement even in small team (get alerts, fix quickly).
Scaling issues (performance bottlenecks at peak): Impact: Slower response, possibly missing time-sensitive booking windows. Mitigation: Performance testing as user count grows, add resources or optimize queries accordingly. Use auto-scaling where possible (Vercel auto-scales edge functions).
Integration Failures (API changes or errors): Impact: If Duffel changes API and our code breaks, bookings could fail. Mitigation: Monitor deprecation notices, allocate time for updates. Build resilience in code (like wrap external calls in try-catch and fail gracefully).
Human error in operations: e.g., deploying a bad code update that cancels campaigns accidentally. Mitigation: Use CI/CD with testing, possibly feature flags for risky changes. Keep the ability to rollback quickly (deploy system that can revert).
Business continuity in crises: e.g., if one developer is unavailable. Mitigation: Document critical procedures (how to restart the system, how to access backups). Possibly cross-train another person or have external support options through vendors.
Financial Risks:
Unexpected cloud costs: e.g., if a bug causes infinite loop calls to Duffel or lots of data egress. Impact: Could burn budget. Mitigation: Set budget alerts on all services. For example, use Stripe’s cost dashboard, Supabase spending caps if any, monitor Duffel usage (maybe they have usage caps).
Chargebacks / Fraud losses: If someone abused stolen cards on our platform, or users dispute charges en masse, we could owe money. Mitigation: Use Stripe Radar to catch fraudulent cards. Possibly restrict auto-booking to verified users or small initial transactions to build trust. Also, maintain a reserve or insurance for chargebacks if that becomes significant.
Low adoption of paid features / ROI delay: If we invested in expensive security or tools but user growth is slow, might strain finances. Mitigation: Use scalable pricing (most services are pay-as-you-go which helps). We can downgrade or turn off things like Persona if not used. Plan budget for security as part of cost of doing business in travel.
Vendor price increases: If a service significantly raises price (maybe Supabase changing pricing model or Duffel increasing fees). Mitigation: Have alternatives researched (e.g., could move to self-host DB or to other flight API) and negotiate if possible. Also, revenue should grow with usage to offset some costs.
We can summarize some of these in a matrix form:
Risk	Impact	Likelihood	Mitigation
Data breach of PII	High	Medium	Encrypt PII, strict access, monitoring, timely patches.
Non-compliance (GDPR/CCPA)	High	Low-Med	Strong privacy practices, user rights features, legal review.
Payment data compromise	High	Low	Use Stripe tokenization, PCI DSS compliance audits.
Outage of core systems	Med-High	Medium	Backups, multi-region plan, status monitoring, DR drills.
Third-party service outage	Medium	Medium	Implement retries/holds, notify users, possibly backup provider if feasible.
Performance bottleneck	Medium	Medium	Load testing, scale infrastructure, optimize queries, caching where applicable.
User account takeover	Medium	Medium	MFA support, monitor logins, secure password policies.
Fraudulent bookings/chargebacks	Medium	Medium	Stripe Radar, identity verification for suspicious cases, clear user communication on charges.
Vendor lock-in or change	Medium	Low	Modular design to swap providers, data export routines.
Cost overrun	Medium	Medium	Budget alerts, scalable usage, periodic cost reviews, optimize API usage.
Loss of key personnel	Medium	Low	Document systems, use managed services, perhaps involve external advisors for backup.

Each risk is continuously monitored and has an owner (likely the CTO/lead dev, given small team). Regular reviews of these risks will be part of our project management, especially security and compliance ones (as required by SOC2).
Code Examples (selected scenarios)
To illustrate some recommended implementations, here are a few simplified TypeScript (or SQL) examples:
TypeScript interface for Traveler Profile (with encryption):
ts
Copy
interface TravelerProfile {
  id: string;
  userId: string;
  fullName: string;       // plaintext or maybe encrypted data denoted by some type
  dateOfBirth: string;    // e.g. "1990-05-15"
  gender: "M"|"F"|"X";
  passportNumberEnc?: string;  // encrypted blob if stored
  passportCountry?: string;
  passportExpiry?: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}
We might handle encryption by storing passportNumberEnc and perhaps also store a hash for quick equality check or not at all unless needed.
Example Supabase RLS policy (SQL) to ensure users only access their data:
sql
Copy
-- On traveler_profiles table:
CREATE POLICY "Allow user to read own profile" 
  ON "public"."traveler_profiles"
  FOR SELECT USING ( user_id = auth.uid() );

CREATE POLICY "Allow user to modify own profile" 
  ON "public"."traveler_profiles"
  FOR UPDATE USING ( user_id = auth.uid() );
(Supabase’s auth.uid() gives the JWT’s user ID.)
Stripe payment integration snippet (Node/TypeScript):
ts
Copy
import Stripe from 'stripe';
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

// When adding a new card:
const paymentMethod = await stripe.paymentMethods.create({
  type: 'card',
  card: { token: tokenFromFrontend }  // tokenFromFrontend is the ID from Stripe Elements
});
// Attach to customer:
await stripe.paymentMethods.attach(paymentMethod.id, { customer: customerId });
// Optionally set as default:
await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: paymentMethod.id } });
// Save paymentMethod.id in our DB for reference
In practice, we’d likely use stripe.setupIntents on the frontend, but above is conceptual.
Duffel booking API call example (pseudo-code):
ts
Copy
const offerId = chosenOffer.id;
const passengers = [{
  id: offerPassengerId,  // from Duffel offer, mapping one of the passengers
  title: "Mr",
  gender: traveler.gender === 'M' ? 'male' : 'female',
  given_name: firstName(traveler.fullName),
  family_name: lastName(traveler.fullName),
  born_on: traveler.dateOfBirth,
  email: traveler.email,
  phone_number: traveler.phone
}];
// If passport needed:
if (traveler.passportNumber) {
  passengers[0].identity_documents = [{
    unique_identifier: traveler.passportNumber,
    issuing_country_code: traveler.passportCountry,
    expires_on: traveler.passportExpiry,
    document_type: "passport"
  }];
}
const payment = { 
  type: "balance",  // assume we prepaid Duffel or post-pay (since we charged user)
  amount: offer.total_amount,
  currency: offer.total_currency
};
const order = await duffel.orders.create({
  selected_offers: [offerId],
  payments: [ payment ],
  passengers: passengers
});
(Note: Duffel’s actual API might differ; their docs say you provide passengers with details and payment info.)
Encryption/Decryption usage:
If using a library like crypto in Node for AES:
ts
Copy
import * as crypto from 'crypto';
const ALGO = 'aes-256-gcm';
function encrypt(text: string): { iv: string, content: string, tag: string } {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const tag = cipher.getAuthTag().toString('base64');
  return { iv: iv.toString('base64'), content: encrypted, tag };
}
function decrypt(encryptedObj: { iv: string, content: string, tag: string }): string {
  const decipher = crypto.createDecipheriv(ALGO, ENCRYPTION_KEY, Buffer.from(encryptedObj.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(encryptedObj.tag, 'base64'));
  let dec = decipher.update(encryptedObj.content, 'base64', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}
// Usage:
const encryptedPassport = encrypt(traveler.passportNumber);
// store encryptedPassport as JSON or separate fields in DB.
const original = decrypt(encryptedPassport);
In production, we’d handle binary properly and store perhaps concatenated iv:content:tag in one field or separate columns. Also, key management (ENCRYPTION_KEY stored in env, possibly rotated).
Testing strategy for sensitive flows:
We will write integration tests for the booking flow:
Simulate creating a campaign with a test user, stub Duffel API with a known response (or use Duffel’s test mode if they have).
Assert that after our booking function runs, a booking record exists with expected data, the Stripe charge was attempted, etc.
Use Stripe’s test webhooks to simulate payment success/failure and verify our webhook handler logic (e.g., ensure a failed payment sets the right status).
Also test edge cases: price just above threshold (should not book), invalid card (should mark error), etc.
Finally, as a note in code, we will ensure to not log any PII or secrets. For example, when logging events, use booking IDs or user IDs, not full names or card numbers. This keeps logs safe if ever exposed. Use placeholders if needed (e.g., log "booking attempt for user 123 for offer ABC").

---

## Conclusion

Parker Flight's traveler data architecture represents a comprehensive, security-first approach to handling sensitive personal and payment information for auto-booking campaigns. This document has outlined a battle-tested framework that balances maximum security with optimal user experience while ensuring regulatory compliance across multiple jurisdictions.

### Key Architectural Decisions

The recommended hybrid architecture delivers on all critical requirements:

1. **Security Excellence**: Through application-level encryption (AES-256-GCM), payment tokenization via Stripe, and zero-trust access controls, we achieve military-grade protection for all sensitive data

2. **Regulatory Compliance**: The framework addresses GDPR, CCPA, PCI DSS, and travel-specific regulations (TSA Secure Flight, APIS) with built-in data minimization, user rights, and audit capabilities

3. **Scalable Performance**: The architecture scales from hundreds to tens of thousands of users through proven cloud infrastructure (Supabase, Stripe, Duffel) with performance optimization strategies

4. **Business Continuity**: Comprehensive disaster recovery, vendor diversification, and failover procedures ensure 99.9%+ uptime for critical booking operations

5. **Future-Proofing**: Modular design prevents vendor lock-in and enables seamless expansion to multi-traveler support, international markets, and enterprise features

### Risk Mitigation Summary

Our comprehensive risk assessment identified and addressed all major threat vectors:
- **Data Security**: Multi-layer encryption, strict access controls, continuous monitoring
- **Compliance**: Legal framework adherence, privacy-by-design implementation
- **Operational**: Redundancy planning, performance optimization, vendor management
- **Financial**: Fraud prevention, cost controls, revenue protection

### Implementation Confidence

The phased 18-month roadmap ensures reliable delivery:
- **Phase 1 (0-3 months)**: MVP with core security - proven achievable
- **Phase 2 (3-12 months)**: Production hardening and compliance - industry standard timeline
- **Phase 3 (12-18+ months)**: Scale and advanced features - competitive advantage

### Competitive Advantage

This architecture positions Parker Flight as a leader in travel technology security:
- **Trust**: Bank-level security builds customer confidence
- **Compliance**: Proactive regulatory adherence enables global expansion
- **Reliability**: Enterprise-grade infrastructure ensures consistent service
- **Innovation**: Flexible foundation supports rapid feature development

### Success Metrics

The architecture's success will be measured by:
- **Zero data breaches** (primary security objective)
- **SOC 2 Type II certification** within 18 months
- **99.9% system uptime** for booking operations
- **Sub-3-second booking execution** times
- **100% regulatory compliance** across all markets

### Final Recommendation

This traveler data architecture provides Parker Flight with a world-class foundation for secure, compliant, and scalable auto-booking operations. The combination of proven technologies, comprehensive security measures, and flexible design ensures both immediate success and long-term competitive advantage in the travel technology market.

The investment in security and compliance infrastructure, while substantial, is essential for building customer trust and enabling international expansion. The architecture's modular design and vendor diversification strategies protect against technological obsolescence and ensure sustainable growth.

With this foundation, Parker Flight is positioned to become a trusted leader in automated travel booking while maintaining the highest standards of data protection and regulatory compliance.

---

## Appendix: Detailed Analysis

### A. Compliance Checklists

#### GDPR Compliance Checklist
- [ ] **Lawful Basis Documentation**: Contract performance for booking services
- [ ] **Data Subject Rights Implementation**:
  - [ ] Right of access (user profile export)
  - [ ] Right to rectification (profile editing)
  - [ ] Right to erasure (account deletion with full data purging)
  - [ ] Right to data portability (JSON export functionality)
  - [ ] Right to object (campaign cancellation)
- [ ] **Privacy by Design Implementation**:
  - [ ] Data minimization (collect only booking-essential data)
  - [ ] Purpose limitation (use data only for stated booking purposes)
  - [ ] Storage limitation (automatic deletion after campaign completion)
- [ ] **Technical Measures**:
  - [ ] Encryption at rest (AES-256 for PII fields)
  - [ ] Encryption in transit (TLS 1.3 for all communications)
  - [ ] Access controls (Row-Level Security in database)
- [ ] **Organizational Measures**:
  - [ ] Data Processing Agreement with all vendors
  - [ ] Privacy Impact Assessment completion
  - [ ] Breach notification procedures (72-hour requirement)
  - [ ] Regular compliance audits

#### PCI DSS Compliance Checklist (SAQ-A)
- [ ] **Secure Network**:
  - [ ] TLS 1.2+ for all cardholder data transmission
  - [ ] No storage of cardholder data in Parker systems
- [ ] **Tokenization Implementation**:
  - [ ] Stripe Elements integration for card collection
  - [ ] PaymentMethod tokens only stored in Parker database
  - [ ] No logging of card numbers or security codes
- [ ] **Access Controls**:
  - [ ] Unique access credentials for all personnel
  - [ ] Restricted access to Stripe dashboard
  - [ ] Regular access reviews and updates
- [ ] **Security Testing**:
  - [ ] Annual vulnerability scans
  - [ ] PCI SAQ-A completion and validation
  - [ ] Security policy documentation and training

#### CCPA/CPRA Compliance Checklist
- [ ] **Consumer Rights Implementation**:
  - [ ] Right to know (clear privacy policy)
  - [ ] Right to delete (same as GDPR erasure)
  - [ ] Right to opt-out of sale (N/A - no data sales)
- [ ] **Privacy Policy Requirements**:
  - [ ] Categories of personal information collected
  - [ ] Business purposes for collection
  - [ ] Third parties with whom data is shared
  - [ ] Consumer rights and exercise methods
- [ ] **Technical Implementation**:
  - [ ] "Do Not Sell" link in website footer
  - [ ] Global Privacy Control signal recognition
  - [ ] Consumer request verification procedures

### B. Vendor Security Assessment

#### Supabase Security Profile
- **Certifications**: SOC 2 Type II, ISO 27001
- **Data Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Access Controls**: Row-Level Security, JWT authentication
- **Backup Strategy**: Daily automated backups, point-in-time recovery
- **Monitoring**: Real-time alerting, audit logging
- **Compliance**: GDPR compliant with EU hosting options

#### Stripe Security Profile
- **Certifications**: PCI DSS Level 1, SOC 1/2, ISO 27001
- **Data Protection**: Tokenization, fraud detection (Radar)
- **Geographic Coverage**: Global compliance, local acquiring
- **Reliability**: 99.99% uptime SLA
- **Integration Security**: Elements SDK, webhook signature validation

#### Duffel Security Profile
- **Industry Standards**: IATA certified, GDS connectivity
- **Data Handling**: Secure API, limited data retention
- **Reliability**: Multi-airline redundancy, 99.9% uptime
- **Compliance**: Travel industry regulations (APIS, Secure Flight)
- **Support**: 24/7 technical support, dedicated account management

### C. Cost Analysis and Projections

#### Phase 1 Costs (MVP - 3 months)
| Service | Monthly Cost | Annual Cost | Notes |
|---------|-------------|-------------|-------|
| Supabase Pro | $25 | $300 | Includes database, auth, functions |
| Stripe | 2.9% + $0.30 | Variable | Per transaction fee |
| Duffel | $10 per booking | Variable | Commission-based pricing |
| Vercel Pro | $20 | $240 | Frontend hosting |
| SendGrid | $15 | $180 | Transactional emails |
| **Total Fixed** | **$60** | **$720** | Excluding transaction fees |

#### Phase 2 Costs (Production - 12 months)
| Service | Monthly Cost | Annual Cost | Scaling Factor |
|---------|-------------|-------------|----------------|
| Supabase Pro | $100 | $1,200 | 1,000+ active users |
| Security Tools | $200 | $2,400 | Monitoring, scanning |
| Compliance Audit | - | $15,000 | SOC 2 Type I preparation |
| Identity Verification | $250 | $3,000 | Optional Persona integration |
| **Total Fixed** | **$550** | **$21,600** | Production-ready infrastructure |

#### Phase 3 Costs (Scale - 18+ months)
| Service | Monthly Cost | Annual Cost | 10,000+ Users |
|---------|-------------|-------------|---------------|
| Infrastructure | $500 | $6,000 | Scaled database, CDN |
| Compliance | $400 | $4,800 | SOC 2 Type II, ongoing audits |
| Advanced Features | $300 | $3,600 | Multi-traveler, analytics |
| **Total Fixed** | **$1,200** | **$14,400** | Enterprise-scale operation |

### D. Technical Specifications

#### Database Schema (PostgreSQL)
```sql
-- Core user management
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Traveler profiles with encryption
CREATE TABLE traveler_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('M', 'F', 'X')),
  passport_number_enc TEXT, -- AES-256 encrypted
  passport_country TEXT,
  passport_expiry DATE,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment method references (Stripe tokens only)
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_payment_method_id TEXT NOT NULL,
  last4 TEXT,
  brand TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-booking campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  traveler_profile_id UUID REFERENCES traveler_profiles(id),
  payment_method_id UUID REFERENCES payment_methods(id),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date_start DATE,
  departure_date_end DATE,
  return_date_start DATE,
  return_date_end DATE,
  max_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  cabin_class TEXT DEFAULT 'economy',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking records
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  duffel_order_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  pnr TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  booking_status TEXT DEFAULT 'confirmed',
  flight_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logging
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### API Endpoint Specifications

**Authentication**: All endpoints require JWT token via `Authorization: Bearer <token>`

**Core Endpoints**:
- `GET /api/profile` - Retrieve user's traveler profile
- `POST /api/profile` - Create/update traveler profile
- `DELETE /api/profile` - Delete profile (GDPR compliance)
- `GET /api/campaigns` - List user's campaigns
- `POST /api/campaigns` - Create new campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Cancel campaign
- `GET /api/bookings` - List user's bookings
- `POST /api/payment-methods` - Add payment method
- `DELETE /api/payment-methods/:id` - Remove payment method

**Webhook Endpoints**:
- `POST /api/webhooks/stripe` - Stripe payment events
- `POST /api/webhooks/duffel` - Duffel booking updates

### E. Success Metrics and KPIs

#### Security Metrics
- **Data Breach Incidents**: Target 0 (critical)
- **Failed Login Attempts**: Monitor for brute force
- **API Error Rates**: <0.1% for authentication failures
- **Encryption Coverage**: 100% of PII fields
- **Vulnerability Scan Results**: 0 high/critical findings

#### Performance Metrics
- **API Response Time**: <200ms for read operations, <500ms for writes
- **Booking Execution Time**: <3 seconds end-to-end
- **System Uptime**: 99.9% monthly availability
- **Database Query Performance**: <50ms for indexed queries
- **Third-party API Latency**: Monitor Stripe/Duffel response times

#### Compliance Metrics
- **Data Subject Request Response Time**: <30 days (GDPR requirement)
- **Consent Collection Rate**: 100% for new users
- **Data Retention Policy Compliance**: Automated cleanup metrics
- **Audit Log Completeness**: 100% coverage of sensitive operations
- **Vendor Compliance Status**: Quarterly review of all DPAs

#### Business Metrics
- **User Adoption Rate**: Target 1,000 users in 6 months
- **Campaign Success Rate**: >80% successful bookings when deals found
- **Customer Satisfaction**: >4.5/5 rating on security/trust
- **Revenue Per User**: Track booking value vs. infrastructure costs
- **Chargeback Rate**: <0.5% of all transactions

This comprehensive appendix provides the detailed implementation guidance needed to execute the traveler data architecture successfully while maintaining the highest standards of security, compliance, and performance.
