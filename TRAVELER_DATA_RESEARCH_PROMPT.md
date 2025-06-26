# ChatGPT Research Prompt: Traveler Data Security & Architecture

**Copy this entire prompt to ChatGPT for comprehensive research:**

---

## Research Brief

I'm building Parker Flight, a flight search and booking application with two main flows:
1. **Manual Search** - Users search flights via Amadeus API and are redirected to airline websites to complete booking (like Google Flights)
2. **Auto-Booking Campaigns** - Users set up automated flight searches that run for 12 months, with actual booking handled through Duffel API when criteria are met

I need comprehensive research on the optimal architecture for handling sensitive traveler data (passports, personal information, payment details) for the NEW auto-booking campaigns feature with maximum security while maintaining excellent user experience.

**Important**: The existing manual search flow works fine and should NOT be migrated or changed. This research is specifically for architecting the new auto-booking feature that requires storing sensitive traveler data.

## Current Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **APIs**: Amadeus (manual), Duffel (auto-booking)
- **Payments**: Stripe
- **Hosting**: Vercel
- **Auth**: Supabase Auth (can migrate to Cognito if needed)

## Core Research Questions

### 1. **Data Separation vs Unification**
**Question**: Should traveler data be shared between manual search and auto-booking flows, or kept separate for security/architectural reasons?

**Research Focus**:
- Security implications of unified vs separated data
- User experience trade-offs (pre-filling search forms vs campaign setup)
- Compliance considerations (PCI, GDPR, CCPA)
- Data consistency challenges
- Different data requirements: search preferences vs booking data

### 2. **Third-Party Secure Storage**
**Question**: Should sensitive traveler data be stored with a third-party service for enhanced security?

**Research Areas**:
- **Stripe Identity**: Cost, security, integration complexity, suitability for flight booking
- **AWS Cognito**: Custom attributes, scalability, compliance, React integration
- **Persona**: Identity verification, document storage, global coverage
- **Auth0**: User management, custom claims, security features
- **Firebase Auth**: Custom claims, security, Google Cloud integration
- **HashiCorp Vault**: Self-hosted security, operational complexity, cost

**Evaluation Criteria**:
- Security certifications (SOC 2, PCI DSS, ISO 27001)
- Data residency and compliance (GDPR, CCPA)
- Integration complexity with React/Supabase
- Cost structure (per user, per verification, storage)
- Disaster recovery and backup capabilities
- Audit logging and access controls

### 3. **Data Minimization & Privacy**
**Question**: What's the optimal balance between data collection and security/privacy?

**Research Focus**:
- Minimum data required for flight search (Amadeus) vs actual booking (Duffel)
- PII that can be collected just-in-time vs stored
- Anonymous flight search vs identified auto-booking campaigns
- Guest search options vs account requirements for campaigns
- Data retention policies
- Right to deletion (GDPR compliance)

### 4. **Payment Data Integration**
**Question**: How should payment methods be securely linked to traveler profiles?

**Research Areas**:
- Stripe Customer objects vs Payment Methods
- Reusable payment methods for 12-month campaigns
- PCI compliance when handling payment + traveler data
- Payment method verification and fraud prevention
- International payment considerations
- Refund and chargeback handling

### 5. **Single Traveler Architecture (MVP)**
**Question**: How should single traveler auto-booking campaigns be architected with future multi-traveler expansion in mind?

**Research Focus**:
- Data structure design that can accommodate future multi-traveler features
- Account-to-traveler relationship modeling (1:1 for now, 1:many later)
- Campaign ownership and traveler profile separation
- Future-proofing data schema for family/group bookings
- API design patterns that can scale to multi-traveler
- User experience considerations for single vs future multi-traveler flows

### 6. **Real-Time Data Requirements**
**Question**: What traveler data needs real-time access vs can be cached/stored?

**Research Areas**:
- Flight booking API response times and data freshness
- Caching strategies for traveler profiles
- Session management for sensitive data
- Auto-booking campaign data synchronization
- Conflict resolution when data changes during booking

### 7. **Disaster Recovery & Business Continuity**
**Question**: How to ensure traveler data availability during outages while maintaining security?

**Research Focus**:
- Backup strategies for encrypted data
- Multi-region data replication
- Failover procedures
- Data recovery testing
- Business continuity during third-party service outages

### 8. **Regulatory Compliance Deep Dive**
**Question**: What are the specific compliance requirements for flight booking data in major markets?

**Research Areas**:
- **GDPR** (EU): Right to portability, deletion, data processing consent
- **CCPA** (California): Data selling restrictions, opt-out rights
- **PCI DSS**: Payment card data handling requirements
- **Travel Industry**: TSA Secure Flight, APIS requirements
- **International**: Data residency laws, cross-border transfer restrictions

### 9. **Performance & Scalability**
**Question**: How do different storage approaches affect application performance at scale?

**Research Focus**:
- API response times for different third-party services
- Caching strategies and cache invalidation
- Database query optimization for encrypted data
- Search and filtering performance on traveler data
- Auto-booking campaign scaling (thousands of concurrent searches)

### 10. **Future-Proofing & Vendor Strategy**
**Question**: How to architect the new auto-booking data storage for long-term success?

**Research Areas**:
- Vendor lock-in risks and mitigation strategies
- API versioning and deprecation policies
- Cost scaling as user base grows
- Data portability requirements
- Service reliability and SLA considerations

## Desired Output Format

Please provide:

### **Executive Summary** (2-3 paragraphs)
- Top recommendation with clear rationale
- Major trade-offs and risks
- Implementation timeline estimate

### **Detailed Analysis** (organized by research question)
- Evidence-based findings for each question
- Specific recommendations with pros/cons
- Cost estimates and scaling projections
- Security risk assessments

### **Architecture Recommendations**
- High-level system architecture diagram (text description)
- Data flow diagrams for both flows (manual search + auto-booking)
- Integration patterns and API design
- Error handling and fallback strategies

### **Implementation Roadmap**
- Phase 1: MVP approach (what to build first for auto-booking campaigns)
- Phase 2: Production-ready (security hardening)
- Phase 3: Scale-up (optimization and advanced features)
- Integration strategy with existing manual search flow

### **Risk Assessment Matrix**
- Security risks and mitigation strategies
- Compliance risks and monitoring requirements
- Operational risks and business continuity plans
- Financial risks and cost optimization strategies

### **Code Examples** (if applicable)
- TypeScript interfaces for recommended data structures
- API integration patterns
- Security implementation examples
- Testing strategies for sensitive data

## Additional Context

**User Base Expectations**: 
- Start with 100-1000 users in first 6 months
- Scale to 10,000+ users within 2 years
- International expansion planned (EU, Canada, Australia)

**Security Posture**: 
- Prefer maximum security even if more complex/expensive
- Plan to pursue SOC 2 certification within 18 months
- Zero tolerance for data breaches

**Development Team**: 
- 2 full-stack developers
- Limited DevOps experience
- Prefer managed services over self-hosted solutions

**Budget Considerations**:
- Can invest in proper security architecture upfront
- Prefer predictable monthly costs over per-transaction fees
- ROI timeline: 12-18 months

Please conduct thorough research using the latest information available and provide actionable recommendations with clear implementation guidance.
