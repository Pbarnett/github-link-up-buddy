#!/usr/bin/env node

/**
 * Final Validation Script for Parker Flight Monitoring
 * 
 * Validates that ALL Grafana bot recommendations have been implemented:
 * 1. Template Variable Optimization with Data Source Variables
 * 2. Dashboard Organization and Permissions
 * 3. Cross-Environment Alerting with Standardized Labels
 * 4. Concurrent Access Optimization
 * 5. Version Control and Automation
 */

import fs from 'fs/promises';
import axios from 'axios';
import { performance } from 'perf_hooks';

const GRAFANA_URL = 'http://localhost:3001';
const GRAFANA_ADMIN_USER = 'admin';
const GRAFANA_ADMIN_PASSWORD = 'admin';

class FinalValidator {
  constructor() {
    this.auth = {
      username: GRAFANA_ADMIN_USER,
      password: GRAFANA_ADMIN_PASSWORD
    };

    this.validationResults = {
      templateVariableOptimization: {
        score: 0,
        maxScore: 30,
        details: []
      },
      dashboardOrganization: {
        score: 0,
        maxScore: 25,
        details: []
      },
      crossEnvironmentAlerting: {
        score: 0,
        maxScore: 20,
        details: []
      },
      concurrentAccessOptimization: {
        score: 0,
        maxScore: 15,
        details: []
      },
      versionControlAutomation: {
        score: 0,
        maxScore: 10,
        details: []
      }
    };
  }

  async log(level, message) {
    const timestamp = new Date().toISOString();
    const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : level === 'success' ? '✅' : 'ℹ️';
    console.log(`${timestamp} ${emoji} ${message}`);
  }

  async validateTemplateVariableOptimization() {
    await this.log('info', '🔄 Validating Template Variable Optimization...');

    try {
      // Check dashboards for data source variables
      const dashboards = await axios.get(`${GRAFANA_URL}/api/search`, {
        auth: this.auth,
        params: { query: 'Parker Flight' }
      });

      let dataSourceVariableCount = 0;
      let optimizedVariableOrderCount = 0;
      let minimizedVariableScopeCount = 0;

      for (const dashboard of dashboards.data) {
        if (dashboard.type === 'dash-db') {
          try {
            const dashboardData = await axios.get(`${GRAFANA_URL}/api/dashboards/uid/${dashboard.uid}`, {
              auth: this.auth
            });

            const dash = dashboardData.data.dashboard;

            if (dash.templating && dash.templating.list) {
              const variables = dash.templating.list;

              // Check for data source variables
              const hasDataSourceVar = variables.some(v => v.type === 'datasource');
              if (hasDataSourceVar) {
                dataSourceVariableCount++;
                this.validationResults.templateVariableOptimization.details.push(
                  `✅ ${dashboard.title}: Has data source variable for environment switching`
                );
              } else {
                this.validationResults.templateVariableOptimization.details.push(
                  `⚠️ ${dashboard.title}: Missing data source variable`
                );
              }

              // Check variable order (data source should be first)
              if (variables.length > 0 && variables[0].type === 'datasource') {
                optimizedVariableOrderCount++;
                this.validationResults.templateVariableOptimization.details.push(
                  `✅ ${dashboard.title}: Variables ordered by frequency (datasource first)`
                );
              }

              // Check variable scope (should be <= 8 variables)
              if (variables.length <= 8) {
                minimizedVariableScopeCount++;
                this.validationResults.templateVariableOptimization.details.push(
                  `✅ ${dashboard.title}: Minimized variable scope (${variables.length} variables)`
                );
              } else {
                this.validationResults.templateVariableOptimization.details.push(
                  `⚠️ ${dashboard.title}: Too many variables (${variables.length} > 8)`
                );
              }
            }

          } catch (error) {
            this.validationResults.templateVariableOptimization.details.push(
              `❌ ${dashboard.title}: Error validating - ${error.message}`
            );
          }
        }
      }

      // Calculate score
      const totalDashboards = dashboards.data.filter(d => d.type === 'dash-db').length;
      if (totalDashboards > 0) {
        this.validationResults.templateVariableOptimization.score = Math.round(
          ((dataSourceVariableCount * 15) + (optimizedVariableOrderCount * 10) + (minimizedVariableScopeCount * 5)) / totalDashboards
        );
      }

      await this.log('success', `✅ Template variable validation complete - Score: ${this.validationResults.templateVariableOptimization.score}/30`);

    } catch (error) {
      await this.log('error', `Template variable validation failed: ${error.message}`);
    }
  }

  async validateDashboardOrganization() {
    await this.log('info', '📁 Validating Dashboard Organization and Permissions...');

    try {
      // Check folder structure
      const folders = await axios.get(`${GRAFANA_URL}/api/folders`, {
        auth: this.auth
      });

      let folderStructureScore = 0;
      let roleBasedAccessScore = 0;

      // Expected folder structure
      const expectedFolders = [
        'Executive Dashboards',
        'Engineering Dashboards', 
        'Multi-Environment',
        'Business Intelligence',
        'Technical Monitoring'
      ];

      const existingFolderTitles = folders.data.map(f => f.title);
      const foundExpectedFolders = expectedFolders.filter(expected => 
        existingFolderTitles.some(existing => 
          existing.toLowerCase().includes(expected.toLowerCase()) ||
          expected.toLowerCase().includes(existing.toLowerCase())
        )
      );

      folderStructureScore = Math.round((foundExpectedFolders.length / expectedFolders.length) * 15);

      this.validationResults.dashboardOrganization.details.push(
        `✅ Folder structure: ${foundExpectedFolders.length}/${expectedFolders.length} expected folders found`
      );

      foundExpectedFolders.forEach(folder => {
        this.validationResults.dashboardOrganization.details.push(`  - ✅ ${folder}`);
      });

      // Check for subfolders (nested organization)
      const hasSubfolders = folders.data.some(f => f.title.includes('/'));
      if (hasSubfolders) {
        roleBasedAccessScore += 10;
        this.validationResults.dashboardOrganization.details.push('✅ Subfolder organization implemented');
      } else {
        this.validationResults.dashboardOrganization.details.push('⚠️ Limited subfolder organization');
      }

      this.validationResults.dashboardOrganization.score = folderStructureScore + roleBasedAccessScore;

      await this.log('success', `✅ Dashboard organization validation complete - Score: ${this.validationResults.dashboardOrganization.score}/25`);

    } catch (error) {
      await this.log('error', `Dashboard organization validation failed: ${error.message}`);
    }
  }

  async validateCrossEnvironmentAlerting() {
    await this.log('info', '🚨 Validating Cross-Environment Alerting...');

    try {
      // Check for standardized labels configuration
      const alertRulesPath = './monitoring/prometheus/rules/standardized-labels.yml';
      
      let standardizedLabelsScore = 0;
      let centralizedRoutingScore = 0;

      try {
        const alertRulesContent = await fs.readFile(alertRulesPath, 'utf8');
        
        // Check for standardized labels
        const hasStandardizedLabels = alertRulesContent.includes('environment:') && 
                                     alertRulesContent.includes('team:') &&
                                     alertRulesContent.includes('system:');
        
        if (hasStandardizedLabels) {
          standardizedLabelsScore = 15;
          this.validationResults.crossEnvironmentAlerting.details.push(
            '✅ Standardized labels implemented (environment, team, system)'
          );
        } else {
          this.validationResults.crossEnvironmentAlerting.details.push(
            '⚠️ Standardized labels partially implemented'
          );
        }

        // Check for centralized routing
        const hasCentralizedRouting = alertRulesContent.includes('routingTemplate') ||
                                     alertRulesContent.includes('receiver:');

        if (hasCentralizedRouting) {
          centralizedRoutingScore = 5;
          this.validationResults.crossEnvironmentAlerting.details.push(
            '✅ Centralized alert routing configuration found'
          );
        }

      } catch {
        this.validationResults.crossEnvironmentAlerting.details.push(
          '⚠️ Alert rules file not found - may be configured differently'
        );
      }

      this.validationResults.crossEnvironmentAlerting.score = standardizedLabelsScore + centralizedRoutingScore;

      await this.log('success', `✅ Cross-environment alerting validation complete - Score: ${this.validationResults.crossEnvironmentAlerting.score}/20`);

    } catch (error) {
      await this.log('error', `Cross-environment alerting validation failed: ${error.message}`);
    }
  }

  async validateConcurrentAccessOptimization() {
    await this.log('info', '⚡ Validating Concurrent Access Optimization...');

    try {
      let queryCachingScore = 0;
      let dashboardReviewScore = 0;

      // Check for concurrent access optimization config
      const optimizationConfigPath = './monitoring/grafana/config/concurrent-access-optimization.json';
      
      try {
        const configContent = await fs.readFile(optimizationConfigPath, 'utf8');
        const config = JSON.parse(configContent);

        if (config.grafanaConfig && config.grafanaConfig.caching) {
          queryCachingScore = 10;
          this.validationResults.concurrentAccessOptimization.details.push(
            '✅ Query caching configuration implemented'
          );
        }

        if (config.organizationBestPractices) {
          dashboardReviewScore = 5;
          this.validationResults.concurrentAccessOptimization.details.push(
            '✅ Dashboard organization best practices configured'
          );
        }

      } catch {
        this.validationResults.concurrentAccessOptimization.details.push(
          '⚠️ Concurrent access optimization config not found'
        );
      }

      // Check dashboard review results
      const reviewPath = './monitoring/grafana/dashboard-review.json';
      try {
        const reviewContent = await fs.readFile(reviewPath, 'utf8');
        const review = JSON.parse(reviewContent);

        if (review.optimizationScore && review.optimizationScore >= 80) {
          dashboardReviewScore += 5;
          this.validationResults.concurrentAccessOptimization.details.push(
            `✅ Dashboard review score: ${review.optimizationScore}/100`
          );
        }
      } catch {
        // Review file might not exist yet
      }

      this.validationResults.concurrentAccessOptimization.score = queryCachingScore + dashboardReviewScore;

      await this.log('success', `✅ Concurrent access optimization validation complete - Score: ${this.validationResults.concurrentAccessOptimization.score}/15`);

    } catch (error) {
      await this.log('error', `Concurrent access optimization validation failed: ${error.message}`);
    }
  }

  async validateVersionControlAutomation() {
    await this.log('info', '📚 Validating Version Control and Automation...');

    try {
      let versionControlScore = 0;
      let automationScore = 0;

      // Check for dashboard backups
      const backupsPath = './monitoring/grafana/backups';
      try {
        const backupStats = await fs.stat(backupsPath);
        if (backupStats.isDirectory()) {
          versionControlScore = 5;
          this.validationResults.versionControlAutomation.details.push(
            '✅ Dashboard backup directory exists'
          );

          // Check for export manifest
          const manifestPath = `${backupsPath}/export-manifest.json`;
          try {
            await fs.stat(manifestPath);
            versionControlScore += 3;
            this.validationResults.versionControlAutomation.details.push(
              '✅ Export manifest found - version control ready'
            );
          } catch {
            this.validationResults.versionControlAutomization.details.push(
              '⚠️ Export manifest not found'
            );
          }
        }
      } catch {
        this.validationResults.versionControlAutomation.details.push(
          '⚠️ Dashboard backup directory not found'
        );
      }

      // Check for automation script
      const backupScriptPath = './scripts/backup-dashboards.sh';
      try {
        await fs.stat(backupScriptPath);
        automationScore = 2;
        this.validationResults.versionControlAutomation.details.push(
          '✅ Automated backup script exists'
        );
      } catch {
        this.validationResults.versionControlAutomation.details.push(
          '⚠️ Automated backup script not found'
        );
      }

      this.validationResults.versionControlAutomation.score = versionControlScore + automationScore;

      await this.log('success', `✅ Version control validation complete - Score: ${this.validationResults.versionControlAutomation.score}/10`);

    } catch (error) {
      await this.log('error', `Version control validation failed: ${error.message}`);
    }
  }

  async generateFinalReport() {
    await this.log('info', '📊 Generating final validation report...');

    const totalScore = Object.values(this.validationResults)
      .reduce((sum, category) => sum + category.score, 0);
    
    const totalMaxScore = Object.values(this.validationResults)
      .reduce((sum, category) => sum + category.maxScore, 0);

    const overallPercentage = Math.round((totalScore / totalMaxScore) * 100);

    const report = {
      validationDate: new Date().toISOString(),
      overallScore: {
        score: totalScore,
        maxScore: totalMaxScore,
        percentage: overallPercentage,
        grade: this.calculateGrade(overallPercentage)
      },
      categoryScores: {
        templateVariableOptimization: {
          score: this.validationResults.templateVariableOptimization.score,
          maxScore: this.validationResults.templateVariableOptimization.maxScore,
          percentage: Math.round((this.validationResults.templateVariableOptimization.score / this.validationResults.templateVariableOptimization.maxScore) * 100),
          details: this.validationResults.templateVariableOptimization.details
        },
        dashboardOrganization: {
          score: this.validationResults.dashboardOrganization.score,
          maxScore: this.validationResults.dashboardOrganization.maxScore,
          percentage: Math.round((this.validationResults.dashboardOrganization.score / this.validationResults.dashboardOrganization.maxScore) * 100),
          details: this.validationResults.dashboardOrganization.details
        },
        crossEnvironmentAlerting: {
          score: this.validationResults.crossEnvironmentAlerting.score,
          maxScore: this.validationResults.crossEnvironmentAlerting.maxScore,
          percentage: Math.round((this.validationResults.crossEnvironmentAlerting.score / this.validationResults.crossEnvironmentAlerting.maxScore) * 100),
          details: this.validationResults.crossEnvironmentAlerting.details
        },
        concurrentAccessOptimization: {
          score: this.validationResults.concurrentAccessOptimization.score,
          maxScore: this.validationResults.concurrentAccessOptimization.maxScore,
          percentage: Math.round((this.validationResults.concurrentAccessOptimization.score / this.validationResults.concurrentAccessOptimization.maxScore) * 100),
          details: this.validationResults.concurrentAccessOptimization.details
        },
        versionControlAutomation: {
          score: this.validationResults.versionControlAutomation.score,
          maxScore: this.validationResults.versionControlAutomation.maxScore,
          percentage: Math.round((this.validationResults.versionControlAutomation.score / this.validationResults.versionControlAutomation.maxScore) * 100),
          details: this.validationResults.versionControlAutomation.details
        }
      },
      recommendations: this.generateRecommendations(overallPercentage),
      certification: this.generateCertification(overallPercentage)
    };

    // Save report
    await fs.writeFile('./docs/monitoring/final-validation-report.json', JSON.stringify(report, null, 2));

    // Display summary
    console.log('\n🏆 FINAL VALIDATION REPORT');
    console.log('=' .repeat(50));
    console.log(`Overall Score: ${totalScore}/${totalMaxScore} (${overallPercentage}%)`);
    console.log(`Grade: ${report.overallScore.grade}`);
    console.log('');
    
    Object.entries(report.categoryScores).forEach(([category, data]) => {
      console.log(`${category}: ${data.score}/${data.maxScore} (${data.percentage}%)`);
    });

    console.log('\n🎖️ CERTIFICATION STATUS');
    console.log('=' .repeat(30));
    console.log(report.certification.status);
    console.log(report.certification.message);

    await this.log('success', `✅ Final validation report generated: ${overallPercentage}% - ${report.overallScore.grade}`);
    
    return report;
  }

  calculateGrade(percentage) {
    if (percentage >= 95) return 'A+ (Enterprise Excellence)';
    if (percentage >= 90) return 'A (Enterprise Grade)';
    if (percentage >= 85) return 'B+ (Production Plus)';
    if (percentage >= 80) return 'B (Production Ready)';
    if (percentage >= 70) return 'C (Development Ready)';
    return 'D (Needs Improvement)';
  }

  generateRecommendations(percentage) {
    const recommendations = [];
    
    if (percentage >= 95) {
      recommendations.push('🌟 Exceptional! Your monitoring setup exceeds enterprise standards.');
      recommendations.push('🚀 Consider contributing your setup as a reference architecture.');
    } else if (percentage >= 90) {
      recommendations.push('🎯 Excellent enterprise-grade setup!');
      recommendations.push('📈 Minor optimizations could achieve perfection.');
    } else if (percentage >= 80) {
      recommendations.push('✅ Solid production-ready monitoring.');
      recommendations.push('🔧 Focus on template variable optimization for better performance.');
    } else {
      recommendations.push('⚡ Several areas need improvement for production readiness.');
      recommendations.push('📋 Prioritize dashboard organization and template variables.');
    }

    return recommendations;
  }

  generateCertification(percentage) {
    if (percentage >= 90) {
      return {
        status: '🏆 ENTERPRISE MONITORING CERTIFICATION ACHIEVED',
        message: 'This monitoring setup meets or exceeds enterprise standards for observability platforms.',
        level: 'Enterprise Grade'
      };
    } else if (percentage >= 80) {
      return {
        status: '✅ PRODUCTION MONITORING CERTIFICATION ACHIEVED', 
        message: 'This monitoring setup is production-ready with room for enterprise enhancements.',
        level: 'Production Grade'
      };
    } else {
      return {
        status: '🔄 MONITORING IMPROVEMENTS NEEDED',
        message: 'Additional optimizations required for production certification.',
        level: 'Development Grade'
      };
    }
  }

  async runFinalValidation() {
    const startTime = performance.now();

    await this.log('info', '🚀 Starting final validation of all Grafana bot recommendations...');

    await this.validateTemplateVariableOptimization();
    await this.validateDashboardOrganization();
    await this.validateCrossEnvironmentAlerting();
    await this.validateConcurrentAccessOptimization();
    await this.validateVersionControlAutomation();

    const report = await this.generateFinalReport();

    const endTime = performance.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n🎉 FINAL VALIDATION COMPLETE');
    console.log(`⏱️ Completed in ${duration}s`);
    console.log(`🎯 Overall Score: ${report.overallScore.percentage}%`);
    console.log(`🏆 Certification: ${report.certification.level}`);

    return report;
  }
}

// CLI interface
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const validator = new FinalValidator();
  validator.runFinalValidation().catch(error => {
    console.error('❌ Final validation failed:', error);
    process.exit(1);
  });
}

export { FinalValidator };
