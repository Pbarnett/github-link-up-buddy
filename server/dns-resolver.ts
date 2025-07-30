/**
 * Custom DNS resolver with enhanced configuration and monitoring
 * Following Node.js v24.4.1 DNS best practices
 */

import dns from 'node:dns';
import { publishMetrics } from './diagnostics.js';

// Custom DNS resolver with production-ready configuration
export class CustomDNSResolver {
  private resolver: dns.Resolver;
  private resolveCount = 0;
  private errorCount = 0;

  constructor() {
    this.resolver = new dns.Resolver({
      timeout: 5000, // 5 second timeout
      tries: 3 // Try 3 times before giving up
    });

    // Configure DNS servers for better reliability
    // Using CloudFlare (1.1.1.1) and Google (8.8.8.8) as fallbacks
    this.resolver.setServers([
      '1.1.1.1',
      '1.0.0.1',
      '8.8.8.8',
      '8.8.4.4'
    ]);

    // Set up metrics publishing
    this.setupMetrics();
  }

  private setupMetrics() {
    // Publish DNS metrics every 30 seconds
    setInterval(() => {
      publishMetrics({
        type: 'counter',
        name: 'dns_resolve_total',
        value: this.resolveCount,
        timestamp: new Date().toISOString()
      });

      publishMetrics({
        type: 'counter',
        name: 'dns_error_total',
        value: this.errorCount,
        timestamp: new Date().toISOString()
      });

      publishMetrics({
        type: 'gauge',
        name: 'dns_success_rate',
        value: this.resolveCount > 0 ? (this.resolveCount - this.errorCount) / this.resolveCount : 1,
        timestamp: new Date().toISOString()
      });
    }, 30000);
  }

  async resolve4(hostname: string, options?: dns.ResolveOptions): Promise<string[] | dns.RecordWithTtl[]> {
    const startTime = Date.now();
    this.resolveCount++;

    try {
      const result = await new Promise<string[] | dns.RecordWithTtl[]>((resolve, reject) => {
        this.resolver.resolve4(hostname, options || {}, (err, addresses) => {
          if (err) {
            reject(err);
          } else {
            resolve(addresses);
          }
        });
      });

      const duration = Date.now() - startTime;
      publishMetrics({
        type: 'histogram',
        name: 'dns_resolve_duration_ms',
        value: duration,
        labels: { hostname, type: 'A' },
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (error) {
      this.errorCount++;
      const duration = Date.now() - startTime;
      
      publishMetrics({
        type: 'histogram',
        name: 'dns_resolve_duration_ms',
        value: duration,
        labels: { hostname, type: 'A', error: 'true' },
        timestamp: new Date().toISOString()
      });

      throw error;
    }
  }

  async resolve6(hostname: string, options?: dns.ResolveOptions): Promise<string[] | dns.RecordWithTtl[]> {
    const startTime = Date.now();
    this.resolveCount++;

    try {
      const result = await new Promise<string[] | dns.RecordWithTtl[]>((resolve, reject) => {
        this.resolver.resolve6(hostname, options || {}, (err, addresses) => {
          if (err) {
            reject(err);
          } else {
            resolve(addresses);
          }
        });
      });

      const duration = Date.now() - startTime;
      publishMetrics({
        type: 'histogram',
        name: 'dns_resolve_duration_ms',
        value: duration,
        labels: { hostname, type: 'AAAA' },
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (error) {
      this.errorCount++;
      const duration = Date.now() - startTime;
      
      publishMetrics({
        type: 'histogram',
        name: 'dns_resolve_duration_ms',
        value: duration,
        labels: { hostname, type: 'AAAA', error: 'true' },
        timestamp: new Date().toISOString()
      });

      throw error;
    }
  }

  async resolveMx(hostname: string): Promise<dns.MxRecord[]> {
    const startTime = Date.now();
    this.resolveCount++;

    try {
      const result = await new Promise<dns.MxRecord[]>((resolve, reject) => {
        this.resolver.resolveMx(hostname, (err, addresses) => {
          if (err) {
            reject(err);
          } else {
            resolve(addresses);
          }
        });
      });

      const duration = Date.now() - startTime;
      publishMetrics({
        type: 'histogram',
        name: 'dns_resolve_duration_ms',
        value: duration,
        labels: { hostname, type: 'MX' },
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (error) {
      this.errorCount++;
      const duration = Date.now() - startTime;
      
      publishMetrics({
        type: 'histogram',
        name: 'dns_resolve_duration_ms',
        value: duration,
        labels: { hostname, type: 'MX', error: 'true' },
        timestamp: new Date().toISOString()
      });

      throw error;
    }
  }

  async resolveTxt(hostname: string): Promise<string[][]> {
    const startTime = Date.now();
    this.resolveCount++;

    try {
      const result = await new Promise<string[][]>((resolve, reject) => {
        this.resolver.resolveTxt(hostname, (err, records) => {
          if (err) {
            reject(err);
          } else {
            resolve(records);
          }
        });
      });

      const duration = Date.now() - startTime;
      publishMetrics({
        type: 'histogram',
        name: 'dns_resolve_duration_ms',
        value: duration,
        labels: { hostname, type: 'TXT' },
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (error) {
      this.errorCount++;
      const duration = Date.now() - startTime;
      
      publishMetrics({
        type: 'histogram',
        name: 'dns_resolve_duration_ms',
        value: duration,
        labels: { hostname, type: 'TXT', error: 'true' },
        timestamp: new Date().toISOString()
      });

      throw error;
    }
  }

  cancel() {
    this.resolver.cancel();
  }

  getStats() {
    return {
      resolveCount: this.resolveCount,
      errorCount: this.errorCount,
      successRate: this.resolveCount > 0 ? (this.resolveCount - this.errorCount) / this.resolveCount : 1
    };
  }
}

// Export a singleton instance
export const customDNSResolver = new CustomDNSResolver();

// Enhanced DNS lookup with fallback mechanism
export async function enhancedDNSLookup(
  hostname: string, 
  options: { family?: 4 | 6; all?: boolean } = {}
): Promise<{ address: string; family: 4 | 6 } | { address: string; family: 4 | 6 }[]> {
  const startTime = Date.now();
  
  try {
    const result = await new Promise<{ address: string; family: 4 | 6 } | { address: string; family: 4 | 6 }[]>((resolve, reject) => {
      dns.lookup(hostname, options, (err, address, family) => {
        if (err) {
          reject(err);
        } else if (options.all) {
          resolve(address as { address: string; family: 4 | 6 }[]);
        } else {
          resolve({ address: address as string, family: family as 4 | 6 });
        }
      });
    });

    const duration = Date.now() - startTime;
    publishMetrics({
      type: 'histogram',
      name: 'dns_lookup_duration_ms',
      value: duration,
      labels: { hostname, family: options.family?.toString() || 'any' },
      timestamp: new Date().toISOString()
    });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    publishMetrics({
      type: 'histogram',
      name: 'dns_lookup_duration_ms',
      value: duration,
      labels: { hostname, family: options.family?.toString() || 'any', error: 'true' },
      timestamp: new Date().toISOString()
    });

    throw error;
  }
}
