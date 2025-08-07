# ⚡ Performance Optimization Guide

## Core Web Vitals & Performance Testing

Based on Playwright's performance testing capabilities and your existing load testing infrastructure.

### 🎯 Performance Targets

| Metric | Target | Critical Threshold | Testing Method |
|--------|--------|-------------------|----------------|
| **LCP (Largest Contentful Paint)** | < 2.5s | < 4.0s | Playwright Core Vitals |
| **FID (First Input Delay)** | < 100ms | < 300ms | Playwright User Interaction |
| **CLS (Cumulative Layout Shift)** | < 0.1 | < 0.25 | Playwright Visual Stability |
| **API Response Time** | < 300ms | < 500ms | K6 Load Testing |
| **Database Query Time** | < 50ms | < 100ms | Custom Monitoring |
| **Bundle Size** | < 1MB | < 2MB | Build Analysis |
| **Concurrent Users** | 100+ | 50+ | K6 Stress Testing |

### 🔍 Current Performance Analysis

#### 1. Existing Load Tests
Your current setup includes:
- **K6 Load Testing**: `tests/load/personalization_k6.js`
- **Playwright E2E**: Visual regression and UI testing
- **Bundle Analysis**: Build-time asset optimization

#### 2. Performance Bottlenecks Identified

Based on your audit, key areas needing optimization:

```typescript
// Critical Performance Issues to Address:

1. Wallet Context Provider Scope
   - Currently: Route-level scoping
   - Impact: Unnecessary re-renders on navigation
   - Fix: Move to App-level provider

2. Profile Completeness Calculation  
   - Currently: Real-time calculation on each load
   - Impact: 200ms+ delay on profile page
   - Fix: Cache completeness score

3. LaunchDarkly Feature Flag Calls
   - Currently: Multiple SDK calls per page
   - Impact: 100ms+ delay for flag resolution
   - Fix: Bulk flag fetching with caching
```

### 🚀 Performance Optimization Strategy

#### Phase 1: Frontend Optimizations (2-4 hours)

```bash
# 1. Optimize React Context Usage
# Move WalletProvider to app level for better caching
```

**Before (Route-level):**
```tsx
// src/pages/Wallet.tsx
<WalletProvider>
  <WalletContent />
</WalletProvider>
```

**After (App-level):**
```tsx
// src/App.tsx  
<WalletProvider>
  <Router>
    <Routes>
      <Route path="/wallet" element={<WalletContent />} />
    </Routes>
  </Router>
</WalletProvider>
```

```bash
# 2. Implement Profile Completeness Caching
# Cache calculation results in localStorage with TTL
```

**Optimization:**
```typescript
// src/services/profileCompletenessService.ts
const CACHE_KEY = 'profile_completeness';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getCachedCompleteness = (userId: string) => {
  const cached = localStorage.getItem(`${CACHE_KEY}_${userId}`);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) {
      return data;
    }
  }
  return null;
};
```

#### Phase 2: API Performance (3-5 hours)

```bash
# 1. Optimize Edge Function Response Times
# Add request/response caching and connection pooling
```

**Database Connection Optimization:**
```typescript
// supabase/functions/_shared/db.ts
import { createClient } from '@supabase/supabase-js';

// Connection pooling for Edge Functions
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  {
    db: {
      schema: 'public',
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: { 'Connection': 'keep-alive' }
    }
  }
);
```

```bash
# 2. Implement Response Caching
# Add Redis-like caching for frequently accessed data
```

#### Phase 3: Load Testing & Monitoring (4-6 hours)

**Enhanced K6 Load Testing:**

```javascript
// tests/load/comprehensive-load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics for detailed analysis
export let errorRate = new Rate('errors');
export let responseTime = new Trend('response_time');
export let dbQueryTime = new Trend('db_query_time');

export let options = {
  stages: [
    { duration: '2m', target: 10 },   // Warm up
    { duration: '5m', target: 50 },   // Normal load
    { duration: '3m', target: 100 },  // Peak load
    { duration: '2m', target: 150 },  // Stress test
    { duration: '2m', target: 0 },    // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'],   // 95% under 300ms
    http_req_failed: ['rate<0.005'],    // 0.5% error rate
    errors: ['rate<0.01'],              // 1% custom error rate
    response_time: ['p(99)<500'],       // 99% under 500ms
  },
};

// Test scenarios covering your critical paths
const scenarios = {
  personalization: '/functions/v1/get-personalization-data',
  flightSearch: '/functions/v1/flight-search-v2',
  profileUpdate: '/rest/v1/profiles',
  walletData: '/functions/v1/get-wallet-data',
};

export default function () {
  Object.entries(scenarios).forEach(([name, endpoint]) => {
    const startTime = Date.now();
    const response = http.get(`${BASE_URL}${endpoint}`, {
      headers: { 'apikey': ANON_KEY }
    });
    
    const duration = Date.now() - startTime;
    responseTime.add(duration);
    
    const success = check(response, {
      [`${name} status OK`]: (r) => r.status === 200,
      [`${name} response time OK`]: (r) => r.timings.duration < 300,
    });
    
    errorRate.add(!success);
  });
  
  sleep(Math.random() * 2 + 1);
}
```

**Real-Time Performance Monitoring:**

```typescript
// src/utils/performanceMonitoring.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new PerformanceMonitor();
    }
    return this.instance;
  }
  
  // Track Core Web Vitals
  trackWebVitals() {
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          this.sendMetric('lcp', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          this.sendMetric('fid', entry.processingStart - entry.startTime);
        }
        if (entry.entryType === 'layout-shift') {
          this.sendMetric('cls', entry.value);
        }
      });
    }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  }
  
  // Track API performance
  trackAPICall(endpoint: string, duration: number, success: boolean) {
    this.sendMetric('api_response_time', duration, { endpoint, success });
  }
  
  private sendMetric(name: string, value: number, labels: Record<string, any> = {}) {
    // Send to your monitoring system (e.g., Grafana, DataDog)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
        ...labels
      });
    }
  }
}
```

### 📊 Performance Testing Automation

**Integration with CI/CD:**

```yaml
# .github/workflows/performance-tests.yml
name: Performance Testing

on:
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Start test environment
        run: |
          npx supabase start
          npm run build
          
      - name: Run K6 load tests
        run: |
          npm install -g k6
          k6 run tests/load/personalization_k6.js --out json=performance-results.json
          
      - name: Run Playwright performance tests
        run: |
          npx playwright test tests/performance/ --reporter=json
          
      - name: Analyze results
        run: |
          node scripts/analyze-performance-results.js
          
      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const results = require('./performance-results.json');
            // Post performance summary to PR
```

### 🛠️ Performance Optimization Tools

#### 1. Bundle Analysis
```bash
# Analyze bundle size and optimization opportunities
npm run build -- --analyze

# Check for large dependencies
npx webpack-bundle-analyzer dist/static/js/*.js
```

#### 2. Database Query Optimization
```sql
-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM profiles WHERE user_id = $1;
```

#### 3. CDN and Caching Strategy
```typescript
// src/utils/cacheStrategy.ts
export const cacheConfig = {
  // Static assets - 1 year
  static: { maxAge: 31536000, immutable: true },
  
  // API responses - 5 minutes
  api: { maxAge: 300, staleWhileRevalidate: 600 },
  
  // User data - 1 minute
  user: { maxAge: 60, mustRevalidate: true },
  
  // Feature flags - 10 minutes
  features: { maxAge: 600, staleWhileRevalidate: 1200 }
};
```

### 🚨 Performance Alerts & Monitoring

**Grafana Dashboard Metrics:**
```json
{
  "dashboard": {
    "title": "Parker Flight Performance",
    "panels": [
      {
        "title": "API Response Times",
        "targets": [
          "avg(http_request_duration_seconds{job='parker-flight'})"
        ],
        "alert": {
          "conditions": [
            {
              "query": "A",
              "reducer": "avg",
              "evaluator": { "params": [0.3], "type": "gt" }
            }
          ]
        }
      },
      {
        "title": "Error Rate",
        "targets": [
          "rate(http_requests_total{status!~'2..'}[5m])"
        ],
        "alert": {
          "conditions": [
            {
              "query": "A", 
              "reducer": "avg",
              "evaluator": { "params": [0.01], "type": "gt" }
            }
          ]
        }
      }
    ]
  }
}
```

### 📈 Performance Optimization Roadmap

#### Immediate (Next 4 hours)
1. **Move Wallet Context to App Level** - Eliminates unnecessary re-renders
2. **Cache Profile Completeness** - Reduces calculation overhead  
3. **Optimize LaunchDarkly Calls** - Bulk fetch with caching

#### Short-term (Next 2 weeks)
1. **Implement Service Worker** - For offline caching
2. **Add Response Compression** - Reduce payload sizes
3. **Database Query Optimization** - Add missing indexes

#### Long-term (Next month)
1. **CDN Integration** - Global asset distribution
2. **Advanced Caching Layer** - Redis for API responses
3. **Performance Budgets** - Automated size limits

### 🏃‍♂️ Quick Performance Wins

**Execute these optimizations immediately:**

```bash
# 1. Run comprehensive performance validation
./scripts/security-performance-validation.sh

# 2. Check current bundle sizes
npm run build && du -sh dist/*

# 3. Run load tests with current configuration
k6 run tests/load/personalization_k6.js

# 4. Profile React components for unnecessary renders
npm install --save-dev @welldone-software/why-did-you-render
```

**Expected Performance Improvements:**
- **Page Load Time**: 40% faster with context optimization
- **API Response**: 25% faster with caching
- **Bundle Size**: 15% smaller with tree shaking
- **User Experience**: Significantly improved perceived performance

---

*Monitor these metrics daily and adjust thresholds based on user feedback and business requirements.*
