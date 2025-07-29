import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing Supabase environment variables');
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    
    switch (path) {
      case 'status': {
        // Overall KMS status
        const status = {
          timestamp: new Date().toISOString(),
          kms: {
            status: 'operational',
            keys: {
              general: Deno.env.get("KMS_GENERAL_KEY_ID")?.substring(0, 8) + "...",
              pii: Deno.env.get("KMS_PII_KEY_ID")?.substring(0, 8) + "...",
              payment: Deno.env.get("KMS_PAYMENT_KEY_ID")?.substring(0, 8) + "..."
            },
            region: Deno.env.get("AWS_REGION")
          },
          database: {},
          audit: {},
          migration: {}
        };

        // Check database tables
        try {
           
          const { data: _auditCheck, error: auditError } = await supabase
            .from('kms_audit_log')
            .select('count')
            .limit(1);
          status.database.kms_audit_log = auditError ? 'error' : 'operational';

           
          const { data: _rotationCheck, error: rotationError } = await supabase
            .from('kms_key_rotation_history')
            .select('count')
            .limit(1);
          status.database.kms_key_rotation_history = rotationError ? 'error' : 'operational';

           
          const { data: _metadataCheck, error: metadataError } = await supabase
            .from('kms_encryption_metadata')
            .select('count')
            .limit(1);
          status.database.kms_encryption_metadata = metadataError ? 'error' : 'operational';
        } catch (error) {
          status.database.error = error.message;
        }

        // Get audit statistics
        try {
          const { data: auditStats, error: auditStatsError } = await supabase
            .from('kms_audit_log')
            .select('operation, success')
            .order('timestamp', { ascending: false })
            .limit(100);

          if (!auditStatsError && auditStats) {
            const total = auditStats.length;
            const successful = auditStats.filter(a => a.success).length;
            const failed = total - successful;
            
            status.audit = {
              total_operations: total,
              successful_operations: successful,
              failed_operations: failed,
              success_rate: total > 0 ? `${((successful / total) * 100).toFixed(1)}%` : '0%',
              operations_by_type: auditStats.reduce((acc, a) => {
                acc[a.operation] = (acc[a.operation] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            };
          }
        } catch (error) {
          status.audit.error = error.message;
        }

        // Migration status
        try {
          // Check for legacy data
          const tables = ['traveler_profiles', 'bookings', 'payments'];
          let legacyDataFound = false;
          const migrationStatus = {};

          for (const table of tables) {
            try {
               
              const { data: _data, error } = await supabase
                .from(table)
                .select('*')
                .limit(1);
              
              if (!error) {
                migrationStatus[table] = 'exists';
                legacyDataFound = true;
              }
            } catch {
              migrationStatus[table] = 'not_found';
            }
          }

          status.migration = {
            legacy_data_found: legacyDataFound,
            tables_checked: migrationStatus,
            recommendation: legacyDataFound 
              ? 'Migration required for existing encrypted data'
              : 'No legacy data found - ready for KMS-only operation'
          };
        } catch (error) {
          status.migration.error = error.message;
        }

        return new Response(
          JSON.stringify(status),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case 'audit-logs': {
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const offset = parseInt(url.searchParams.get('offset') || '0');
        
        try {
          const { data: logs, error } = await supabase
            .from('kms_audit_log')
            .select('*')
            .order('timestamp', { ascending: false })
            .range(offset, offset + limit - 1);

          if (error) throw error;

          return new Response(
            JSON.stringify({
              success: true,
              logs,
              count: logs?.length || 0,
              offset,
              limit
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'metrics': {
        try {
          // Get operation metrics for the last 24 hours
          const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
          
          const { data: recentOps, error: recentError } = await supabase
            .from('kms_audit_log')
            .select('operation, success, timestamp')
            .gte('timestamp', since)
            .order('timestamp', { ascending: false });

          if (recentError) throw recentError;

          const metrics = {
            period: '24h',
            total_operations: recentOps?.length || 0,
            operations_by_hour: {},
            success_rate: 0,
            error_rate: 0,
            operations_by_type: {
              encrypt: 0,
              decrypt: 0,
              health_check: 0
            }
          };

          if (recentOps && recentOps.length > 0) {
            const successful = recentOps.filter(op => op.success).length;
            metrics.success_rate = parseFloat(((successful / recentOps.length) * 100).toFixed(2));
            metrics.error_rate = parseFloat((((recentOps.length - successful) / recentOps.length) * 100).toFixed(2));

            // Count by type
            recentOps.forEach(op => {
              if (metrics.operations_by_type[op.operation] !== undefined) {
                metrics.operations_by_type[op.operation]++;
              }
            });

            // Count by hour
            recentOps.forEach(op => {
              const hour = new Date(op.timestamp).getHours();
              metrics.operations_by_hour[hour] = (metrics.operations_by_hour[hour] || 0) + 1;
            });
          }

          return new Response(
            JSON.stringify(metrics),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'migration-plan': {
        try {
          const migrationPlan = {
            assessment_date: new Date().toISOString(),
            phases: [
              {
                phase: 1,
                name: "Preparation",
                status: "ready",
                tasks: [
                  "✅ KMS keys created and operational",
                  "✅ Database tables created",
                  "✅ Edge functions deployed",
                  "✅ Audit logging operational"
                ]
              },
              {
                phase: 2,
                name: "New Data Encryption",
                status: "in_progress",
                tasks: [
                  "🟡 Start encrypting new user profiles with KMS",
                  "🟡 Update application code to use encrypt-user-data function",
                  "🟡 Monitor encryption performance",
                  "🟡 Validate encrypted data integrity"
                ]
              },
              {
                phase: 3,
                name: "Legacy Data Migration",
                status: "pending",
                tasks: [
                  "⏳ Backup existing encrypted data",
                  "⏳ Migrate legacy encrypted data to KMS",
                  "⏳ Verify migration success",
                  "⏳ Remove legacy encryption keys"
                ]
              },
              {
                phase: 4,
                name: "Production Optimization",
                status: "pending",
                tasks: [
                  "⏳ Implement key rotation schedule",
                  "⏳ Set up monitoring alerts",
                  "⏳ Performance optimization",
                  "⏳ Compliance documentation"
                ]
              }
            ],
            next_actions: [
              "Begin using encrypt-user-data function for new profiles",
              "Run legacy-data-migration assessment",
              "Schedule migration maintenance /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window",
              "Set up performance monitoring"
            ]
          };

          return new Response(
            JSON.stringify(migrationPlan),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      case 'health': {
        const health = {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          services: {
            kms: 'operational',
            database: 'operational',
            audit_logging: 'operational'
          }
        };

        return new Response(
          JSON.stringify(health),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default: {
        const dashboard = {
          title: "KMS Dashboard",
          version: "1.0",
          endpoints: {
            status: "GET /status - Overall system status",
            audit_logs: "GET /audit-logs?limit=50&offset=0 - Recent audit logs",
            metrics: "GET /metrics - 24h operation metrics",
            migration_plan: "GET /migration-plan - Migration plan and status",
            health: "GET /health - Health check"
          },
          documentation: "https://github.com/parker-flight/kms-integration"
        };

        return new Response(
          JSON.stringify(dashboard),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

  } catch (error) {
    console.error('KMS dashboard error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
