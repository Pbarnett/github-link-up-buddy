# CORS Configuration Audit Report

## Executive Summary

**Date**: January 17, 2025  
**Scope**: All Supabase Edge Functions in `/supabase/functions/`  
**Total Functions Examined**: 80+ functions  
**Status**: ⚠️ **Inconsistent CORS implementation with security gaps**

## Current State Analysis

### 1. Existing CORS Utility

A shared CORS utility exists at `/supabase/functions/_shared/cors.ts`:

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}
```

### 2. Usage Patterns Identified

#### Pattern A: Using Shared CORS Utility (Minimal Usage)
- **Functions**: Very few functions import from `_shared/cors.ts`
- **Status**: ✅ Consistent but underutilized

#### Pattern B: Inline CORS Headers (Most Common)
- **Functions**: 70+ functions define their own CORS headers
- **Example**:
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
```

#### Pattern C: Inconsistent Header Variations
- **Issue**: Different functions use different header combinations
- **Examples**:
  - Some include `x-client-info, apikey` (Supabase-specific)
  - Others only include `Content-Type, Authorization`
  - Methods vary: some include all HTTP methods, others are restrictive

### 3. Critical Issues Identified

#### 🔴 **High Priority Issues**

1. **Production Security Risk**
   - All functions use `'Access-Control-Allow-Origin': '*'`
   - No environment-based origin restrictions
   - Allows any domain to call our APIs

2. **Missing Required Headers**
   - Many functions missing `x-client-info` and `apikey` headers
   - These are required for proper Supabase authentication
   - Could cause authentication failures

3. **Inconsistent OPTIONS Handling**
   - Some functions handle preflight requests correctly
   - Others may be missing OPTIONS method support
   - Inconsistent response patterns

#### 🟡 **Medium Priority Issues**

1. **Code Duplication**
   - 70+ functions redefine the same CORS headers
   - Maintenance burden when changes needed
   - Potential for introducing inconsistencies

2. **Missing Headers in Responses**
   - Not all error responses include CORS headers
   - Could cause client-side CORS errors on failures

### 4. Security Implications

#### Current State
- **Development**: Works fine with `origin: '*'`
- **Production**: Major security vulnerability
- **Risk**: Any website can call our APIs directly

#### Required for Production
- Origin whitelist: `https://parkerflight.com`, `https://staging.parkerflight.com`
- Environment-based configuration
- Proper error handling with CORS headers

## Recommended Actions

### Phase 1: Immediate (This Task)
1. ✅ **Enhance Shared CORS Utility**
   - Add environment-based origin configuration
   - Include all required Supabase headers
   - Add proper TypeScript types

2. ✅ **Create Migration Plan**
   - Document current inconsistencies
   - Prepare standardized implementation approach

### Phase 2: Systematic Migration (Future Tasks)
1. **High-Impact Functions First**
   - Migrate wallet and profile functions
   - Focus on user-facing APIs
   - Ensure authentication flows work

2. **Batch Migration**
   - Convert 5-10 functions at a time
   - Test each batch thoroughly
   - Monitor for regressions

### Phase 3: Production Hardening (Task 5.3b)
1. **Environment-Based Origins**
   - Development: `http://localhost:5173`
   - Staging: `https://staging.parkerflight.com`
   - Production: `https://parkerflight.com`

2. **Security Headers**
   - Add `Strict-Transport-Security`
   - Consider `X-Frame-Options`
   - Implement proper CSP if needed

## Implementation Plan

### Enhanced CORS Utility Structure
```typescript
// _shared/cors.ts
interface CORSOptions {
  environment?: 'development' | 'staging' | 'production';
  additionalHeaders?: string[];
  methods?: string[];
}

export function getCORSHeaders(options?: CORSOptions): Record<string, string>
export function handleCORSPreflight(request: Request): Response | null
export function addCORSHeaders(response: Response): Response
```

### Migration Strategy
1. **Phase 1**: Create enhanced utility (this task)
2. **Phase 2**: Migrate critical functions (tasks 3.x, 4.x)
3. **Phase 3**: Production security lockdown (task 5.3b)

## Risk Assessment

### Current Risk Level: **HIGH**
- Production security vulnerability
- Potential authentication failures
- Inconsistent error handling

### Post-Migration Risk Level: **LOW**
- Standardized implementation
- Environment-appropriate security
- Consistent error handling

## Success Metrics

### Immediate (Post-Task 2.1)
- [ ] Enhanced CORS utility created
- [ ] Migration plan documented
- [ ] Zero regression in existing functionality

### Long-term (Post-Phase 3)
- [ ] All functions use shared CORS utility
- [ ] Production origin restrictions in place
- [ ] Zero CORS-related errors in logs

## Conclusion

The current CORS implementation is functional for development but has significant security and maintainability issues. The shared utility exists but is underutilized. This task will enhance the utility and prepare for systematic migration across all functions.

**Next Steps**: Implement enhanced CORS utility with environment-based configuration while maintaining backward compatibility.
