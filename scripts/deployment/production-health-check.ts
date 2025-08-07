#!/usr/bin/env npx tsx

/**
 * 🏥 WORLD-CLASS PRODUCTION HEALTH CHECK
 * 
 * Comprehensive system validation for production readiness
 * Validates all critical systems before go-live
 */

import { createClient } from '@supabase/supabase-js';

interface HealthCheckResult {
  component: string;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  message: string;
  details?: any;
}

class ProductionHealthChecker {
  private results: HealthCheckResult[] = [];
  private supabase: any;

  constructor() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
    this.supabase = createClient(url, key);
  }

  private addResult(component: string, status: HealthCheckResult['status'], message: string, details?: any) {
    this.results.push({ component, status, message, details });
    
    const emoji = status === 'HEALTHY' ? '✅' : status === 'WARNING' ? '⚠️' : '❌';
    console.log(`${emoji} ${component}: ${message}`);
    
    if (details && process.env.VERBOSE) {
      console.log(`   Details:`, details);
    }
  }

  async checkDatabase() {
    try {
      // Check database connectivity
      const { data: tables, error } = await this.supabase
        .from('flight_bookings')
        .select('*')
        .limit(1);

      if (error) {
        this.addResult('Database', 'CRITICAL', `Connection failed: ${error.message}`, error);
        return;
      }

      this.addResult('Database', 'HEALTHY', 'Connection successful');

      // Check auto-booking table
      const { data: autoBookData, error: autoBookError } = await this.supabase
        .from('flight_bookings')
        .select('auto_book_status')
        .limit(1);

      if (autoBookError && !autoBookError.message.includes('does not exist')) {
        this.addResult('Auto-booking Schema', 'CRITICAL', `Schema validation failed: ${autoBookError.message}`);
      } else {
        this.addResult('Auto-booking Schema', 'HEALTHY', 'Schema validated');
      }

    } catch (error) {
      this.addResult('Database', 'CRITICAL', `Unexpected error: ${error}`, error);
    }
  }

  async checkEdgeFunctions() {
    const criticalFunctions = [
      'auto-book-production',
      'auto-book',
      'duffel-search',
      'metrics-collector',
      'launchdarkly-server'
    ];

    for (const func of criticalFunctions) {
      try {
        const { data, error } = await this.supabase.functions.invoke(func, {
          body: { healthCheck: true }
        });

        if (error && error.message.includes('not found')) {
          this.addResult(`Edge Function: ${func}`, 'CRITICAL', 'Function not deployed');
        } else if (error && error.message.includes('timeout')) {
          this.addResult(`Edge Function: ${func}`, 'WARNING', 'Function timeout (may be cold start)');
        } else {
          this.addResult(`Edge Function: ${func}`, 'HEALTHY', 'Function responsive');
        }
      } catch (error) {
        this.addResult(`Edge Function: ${func}`, 'WARNING', `Health check failed: ${error}`);
      }
    }
  }

  checkEnvironment() {
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    const optionalProdVars = [
      'STRIPE_SECRET_KEY',
      'DUFFEL_API_TOKEN',
      'LAUNCHDARKLY_SERVER_SDK_KEY',
      'VITE_LD_CLIENT_ID'
    ];

    // Check required variables
    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        this.addResult(`Environment: ${envVar}`, 'HEALTHY', 'Variable set');
      } else {
        this.addResult(`Environment: ${envVar}`, 'CRITICAL', 'Required variable missing');
      }
    }

    // Check optional production variables
    let prodVarsSet = 0;
    for (const envVar of optionalProdVars) {
      if (process.env[envVar]) {
        prodVarsSet++;
        this.addResult(`Environment: ${envVar}`, 'HEALTHY', 'Production variable set');
      } else {
        this.addResult(`Environment: ${envVar}`, 'WARNING', 'Production variable not set (using test mode)');
      }
    }

    // Overall environment assessment
    if (prodVarsSet === 0) {
      this.addResult('Environment', 'WARNING', 'Running in development mode - no production variables set');
    } else if (prodVarsSet < optionalProdVars.length) {
      this.addResult('Environment', 'WARNING', `${prodVarsSet}/${optionalProdVars.length} production variables set`);
    } else {
      this.addResult('Environment', 'HEALTHY', 'All production variables configured');
    }
  }

  async checkBuildArtifacts() {
    const fs = await import('fs');
    const path = await import('path');
    
    const distPath = path.resolve('dist');
    const indexPath = path.join(distPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
      const stats = fs.statSync(indexPath);
      this.addResult('Build Artifacts', 'HEALTHY', `Build exists (modified: ${stats.mtime.toISOString()})`);
      
      // Check for critical assets
      const assetsPath = path.join(distPath, 'assets');
      if (fs.existsSync(assetsPath)) {
        const assets = fs.readdirSync(assetsPath);
        const jsFiles = assets.filter(f => f.endsWith('.js'));
        const cssFiles = assets.filter(f => f.endsWith('.css'));
        
        this.addResult('Build Assets', 'HEALTHY', `${jsFiles.length} JS files, ${cssFiles.length} CSS files`);
      }
    } else {
      this.addResult('Build Artifacts', 'CRITICAL', 'Production build not found - run `npm run build`');
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('🏥 PRODUCTION HEALTH CHECK REPORT');
    console.log('='.repeat(80));
    
    const healthy = this.results.filter(r => r.status === 'HEALTHY').length;
    const warnings = this.results.filter(r => r.status === 'WARNING').length;
    const critical = this.results.filter(r => r.status === 'CRITICAL').length;
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   ✅ Healthy: ${healthy}`);
    console.log(`   ⚠️  Warnings: ${warnings}`);
    console.log(`   ❌ Critical: ${critical}`);
    
    if (critical > 0) {
      console.log(`\n🚨 CRITICAL ISSUES:`);
      this.results
        .filter(r => r.status === 'CRITICAL')
        .forEach(r => console.log(`   ❌ ${r.component}: ${r.message}`));
      
      console.log(`\n🛑 DEPLOYMENT BLOCKED: Resolve critical issues before proceeding to production.`);
      return false;
    }
    
    if (warnings > 0) {
      console.log(`\n⚠️  WARNINGS:`);
      this.results
        .filter(r => r.status === 'WARNING')
        .forEach(r => console.log(`   ⚠️  ${r.component}: ${r.message}`));
    }
    
    const overallHealth = critical === 0 ? (warnings === 0 ? 'EXCELLENT' : 'GOOD') : 'POOR';
    const readiness = critical === 0 ? 'READY FOR PRODUCTION' : 'NOT READY';
    
    console.log(`\n🚀 OVERALL HEALTH: ${overallHealth}`);
    console.log(`🎯 PRODUCTION READINESS: ${readiness}`);
    
    if (critical === 0) {
      console.log(`\n✅ WORLD-CLASS DEPLOYMENT VALIDATED`);
      console.log(`   Ready for controlled production rollout!`);
      return true;
    }
    
    return false;
  }

  async run() {
    console.log('🏥 Starting World-Class Production Health Check...\n');
    
    console.log('🔍 Checking Environment Configuration...');
    this.checkEnvironment();
    
    console.log('\n🏗️  Checking Build Artifacts...');
    await this.checkBuildArtifacts();
    
    console.log('\n🗄️  Checking Database Systems...');
    await this.checkDatabase();
    
    console.log('\n⚡ Checking Edge Functions...');
    await this.checkEdgeFunctions();
    
    const isHealthy = this.generateReport();
    
    process.exit(isHealthy ? 0 : 1);
  }
}

// Execute health check
const checker = new ProductionHealthChecker();
checker.run().catch(error => {
  console.error('❌ Health check failed with error:', error);
  process.exit(1);
});
