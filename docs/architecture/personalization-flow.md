# Personalization Data Flow Architecture

## Overview
This document outlines the data flow for Parker Flight's personalization feature, designed for legal review and compliance validation.

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend (React)
    participant EF as Edge Function
    participant DB as Supabase DB
    participant LD as LaunchDarkly
    participant AN as Analytics

    U->>FE: Login/Visit Dashboard
    FE->>LD: Check feature flag
    LD-->>FE: Feature enabled/disabled
    
    alt Feature Enabled
        FE->>EF: Request personalization data
        EF->>DB: Query profiles table
        DB-->>EF: Return user data (first_name, next_trip_city)
        EF-->>FE: JSON response
        FE->>FE: Render personalized greeting
        FE->>AN: Track "greeting_shown" event
    else Feature Disabled
        FE->>FE: Render generic greeting
    end

    Note over U,AN: All personal data stays within Supabase<br/>No external data sharing
```

## Data Elements

### Input Data
- **User ID**: UUID from authentication
- **First Name**: Optional, from profiles table
- **Next Trip City**: Optional, from profiles table  
- **Personalization Enabled**: Boolean flag for user opt-out

### Output Data
- **Personalized Greeting**: String rendered in UI
- **Analytics Events**: Aggregated, non-PII metrics

## Privacy Safeguards

### Data Minimization
- Only first name and next trip city used
- No behavioral tracking or profiling
- No external API calls with personal data

### User Control
- Opt-out toggle in user preferences
- Feature flag for instant disable
- No data retention beyond session

### Compliance Features
- GDPR Article 6 lawful basis: Legitimate interest
- CCPA compliance with opt-out mechanism
- No data sale or sharing with third parties

## Security Measures

### Data Protection
- All data encrypted in transit (HTTPS)
- Supabase RLS policies enforce access control
- No personal data in client-side logs

### Access Control
- Edge function validates user authentication
- Database queries scoped to authenticated user
- Analytics data pseudonymized

## Rollback Capability

### Instant Disable
- LaunchDarkly feature flag can disable instantly
- No cached personal data persists
- Graceful degradation to generic experience

### Data Cleanup
- Session data cleared on logout
- No permanent client-side storage
- Database data remains for account functionality

---

**Review Required**: Legal team sign-off needed before Beta launch (Day 12)
**Last Updated**: [DATE]
**Document Owner**: Tech Lead
