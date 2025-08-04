#!/usr/bin/env tsx

/**
 * IAM Policy Auditor for AWS World-Class Standards Compliance
 * 
 * This script audits IAM policies for least privilege violations:
 * - Wildcard actions (*) 
 * - Wildcard resources (*)
 * - Dangerous permissions
 * - Overly broad access patterns
 */

import { 
  IAMClient, 
  ListPoliciesCommand,
  GetPolicyCommand,
  GetPolicyVersionCommand,
  ListUsersCommand,
  ListRolesCommand,
  ListAttachedUserPoliciesCommand,
  ListAttachedRolePoliciesCommand,
  Policy,
  PolicyVersion
} from '@aws-sdk/client-iam';

interface PolicyViolation {
  type: 'WILDCARD_ACTION' | 'WILDCARD_RESOURCE' | 'DANGEROUS_ACTION' | 'OVERLY_BROAD';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendation: string;
  statement?: any;
}

interface PolicyAuditReport {
  policyName: string;
  policyArn: string;
  policyType: 'AWS' | 'Customer';
  attachedTo: string[];
  violations: PolicyViolation[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendations: string[];
  complianceScore: number;
}

interface AuditSummary {
  totalPolicies: number;
  policiesWithViolations: number;
  criticalViolations: number;
  highViolations: number;
  mediumViolations: number;
  lowViolations: number;
  overallComplianceScore: number;
  topRecommendations: string[];
}

class IAMPolicyAuditor {
  private iamClient: IAMClient;
  private readonly dangerousActions = [
    'iam:*',
    'sts:AssumeRole',
    'kms:*',
    'secretsmanager:*',
    'dynamodb:*',
    's3:*',
    'rds:*',
    'ec2:*',
    'lambda:*',
    'cloudformation:*'
  ];

  private readonly highRiskActions = [
    'iam:CreateRole',
    'iam:DeleteRole', 
    'iam:AttachRolePolicy',
    'iam:DetachRolePolicy',
    'iam:CreateUser',
    'iam:DeleteUser',
    'kms:CreateKey',
    'kms:ScheduleKeyDeletion',
    's3:DeleteBucket',
    'rds:DeleteDBInstance',
    'ec2:TerminateInstances'
  ];

  constructor(region: string = 'us-west-2') {
    this.iamClient = new IAMClient({ region });
  }

  async runFullAudit(): Promise<{ reports: PolicyAuditReport[], summary: AuditSummary }> {
    console.log('🔍 Starting comprehensive IAM policy audit...\n');

    const customPolicies = await this.getAllCustomPolicies();
    const reports: PolicyAuditReport[] = [];

    console.log(`Found ${customPolicies.length} custom policies to audit\n`);

    for (const policy of customPolicies) {
      const report = await this.auditPolicy(policy);
      reports.push(report);
      
      const violationCount = report.violations.length;
      const emoji = violationCount === 0 ? '✅' : violationCount < 3 ? '⚠️' : '❌';
      console.log(`${emoji} ${report.policyName}: ${violationCount} violations (${report.riskLevel})`);
    }

    const summary = this.generateSummary(reports);
    
    console.log('\n📊 Audit Summary:');
    console.log(`Total Policies: ${summary.totalPolicies}`);
    console.log(`Policies with Violations: ${summary.policiesWithViolations}`);
    console.log(`Critical Violations: ${summary.criticalViolations}`);
    console.log(`Overall Compliance Score: ${summary.overallComplianceScore}%`);

    return { reports, summary };
  }

  private async getAllCustomPolicies(): Promise<Policy[]> {
    const policies: Policy[] = [];
    let marker: string | undefined;

    do {
      const command = new ListPoliciesCommand({
        Scope: 'Local', // Only customer managed policies
        Marker: marker,
        MaxItems: 100
      });

      const response = await this.iamClient.send(command);
      if (response.Policies) {
        policies.push(...response.Policies);
      }
      marker = response.Marker;
    } while (marker);

    return policies;
  }

  private async auditPolicy(policy: Policy): Promise<PolicyAuditReport> {
    const policyDocument = await this.getPolicyDocument(policy.Arn!);
    const attachedTo = await this.getAttachmentInfo(policy.Arn!);
    const violations = this.checkPolicyViolations(policyDocument);
    
    const report: PolicyAuditReport = {
      policyName: policy.PolicyName!,
      policyArn: policy.Arn!,
      policyType: 'Customer',
      attachedTo,
      violations,
      riskLevel: this.calculateRiskLevel(violations),
      recommendations: this.generateRecommendations(violations),
      complianceScore: this.calculateComplianceScore(violations)
    };

    return report;
  }

  private async getPolicyDocument(policyArn: string): Promise<any> {
    try {
      const policyResponse = await this.iamClient.send(new GetPolicyCommand({
        PolicyArn: policyArn
      }));

      const versionResponse = await this.iamClient.send(new GetPolicyVersionCommand({
        PolicyArn: policyArn,
        VersionId: policyResponse.Policy?.DefaultVersionId
      }));

      return JSON.parse(decodeURIComponent(versionResponse.PolicyVersion?.Document || '{}'));
    } catch (error) {
      console.error(`Failed to get policy document for ${policyArn}:`, error);
      return {};
    }
  }

  private async getAttachmentInfo(policyArn: string): Promise<string[]> {
    const attachments: string[] = [];

    try {
      // Check user attachments
      const users = await this.iamClient.send(new ListUsersCommand({}));
      for (const user of users.Users || []) {
        const userPolicies = await this.iamClient.send(new ListAttachedUserPoliciesCommand({
          UserName: user.UserName
        }));

        if (userPolicies.AttachedPolicies?.some(p => p.PolicyArn === policyArn)) {
          attachments.push(`User: ${user.UserName}`);
        }
      }

      // Check role attachments
      const roles = await this.iamClient.send(new ListRolesCommand({}));
      for (const role of roles.Roles || []) {
        const rolePolicies = await this.iamClient.send(new ListAttachedRolePoliciesCommand({
          RoleName: role.RoleName
        }));

        if (rolePolicies.AttachedPolicies?.some(p => p.PolicyArn === policyArn)) {
          attachments.push(`Role: ${role.RoleName}`);
        }
      }
    } catch (error) {
      console.error(`Failed to get attachment info for ${policyArn}:`, error);
    }

    return attachments;
  }

  private checkPolicyViolations(policyDocument: any): PolicyViolation[] {
    const violations: PolicyViolation[] = [];

    if (!policyDocument.Statement) {
      return violations;
    }

    const statements = Array.isArray(policyDocument.Statement) 
      ? policyDocument.Statement 
      : [policyDocument.Statement];

    for (const statement of statements) {
      if (statement.Effect !== 'Allow') continue;

      // Check for wildcard actions
      if (statement.Action === '*') {
        violations.push({
          type: 'WILDCARD_ACTION',
          severity: 'CRITICAL',
          description: 'Policy allows all actions (*)',
          recommendation: 'Replace with specific actions required for the use case',
          statement
        });
      }

      // Check for wildcard resources
      if (statement.Resource === '*') {
        violations.push({
          type: 'WILDCARD_RESOURCE',
          severity: 'HIGH',
          description: 'Policy allows access to all resources (*)',
          recommendation: 'Specify exact resource ARNs or use resource patterns',
          statement
        });
      }

      // Check for dangerous actions
      const actions = Array.isArray(statement.Action) ? statement.Action : [statement.Action];
      for (const action of actions) {
        if (this.dangerousActions.some(dangerous => action.includes(dangerous.replace('*', '')))) {
          violations.push({
            type: 'DANGEROUS_ACTION',
            severity: 'HIGH',
            description: `Potentially dangerous action: ${action}`,
            recommendation: 'Review if this broad permission is necessary and add conditions',
            statement
          });
        }

        if (this.highRiskActions.includes(action)) {
          violations.push({
            type: 'DANGEROUS_ACTION',
            severity: 'MEDIUM',
            description: `High-risk action detected: ${action}`,
            recommendation: 'Ensure this action is necessary and add appropriate conditions',
            statement
          });
        }
      }

      // Check for missing conditions on sensitive actions
      if (!statement.Condition && this.containsSensitiveActions(actions)) {
        violations.push({
          type: 'OVERLY_BROAD',
          severity: 'MEDIUM',
          description: 'Sensitive actions without conditions',
          recommendation: 'Add conditions to restrict when/how these actions can be used',
          statement
        });
      }
    }

    return violations;
  }

  private containsSensitiveActions(actions: string[]): boolean {
    const sensitivePatterns = ['iam:', 'sts:', 'kms:', 's3:Delete', 'rds:Delete', 'ec2:Terminate'];
    return actions.some(action => 
      sensitivePatterns.some(pattern => action.startsWith(pattern))
    );
  }

  private calculateRiskLevel(violations: PolicyViolation[]): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (violations.some(v => v.severity === 'CRITICAL')) return 'CRITICAL';
    if (violations.some(v => v.severity === 'HIGH')) return 'HIGH';
    if (violations.some(v => v.severity === 'MEDIUM')) return 'MEDIUM';
    return 'LOW';
  }

  private generateRecommendations(violations: PolicyViolation[]): string[] {
    const recommendations = new Set<string>();

    for (const violation of violations) {
      recommendations.add(violation.recommendation);
    }

    // Add general recommendations
    if (violations.length > 0) {
      recommendations.add('Review policy regularly and remove unused permissions');
      recommendations.add('Use AWS IAM Policy Simulator to test policy changes');
      recommendations.add('Consider using AWS managed policies where appropriate');
    }

    return Array.from(recommendations);
  }

  private calculateComplianceScore(violations: PolicyViolation[]): number {
    if (violations.length === 0) return 100;

    const severityWeights = { CRITICAL: 40, HIGH: 25, MEDIUM: 15, LOW: 5 };
    const totalDeductions = violations.reduce((sum, violation) => 
      sum + severityWeights[violation.severity], 0);

    return Math.max(0, 100 - totalDeductions);
  }

  private generateSummary(reports: PolicyAuditReport[]): AuditSummary {
    const totalPolicies = reports.length;
    const policiesWithViolations = reports.filter(r => r.violations.length > 0).length;
    
    let criticalViolations = 0;
    let highViolations = 0;
    let mediumViolations = 0;
    let lowViolations = 0;

    for (const report of reports) {
      for (const violation of report.violations) {
        switch (violation.severity) {
          case 'CRITICAL': criticalViolations++; break;
          case 'HIGH': highViolations++; break;
          case 'MEDIUM': mediumViolations++; break;
          case 'LOW': lowViolations++; break;
        }
      }
    }

    const overallComplianceScore = Math.round(
      reports.reduce((sum, report) => sum + report.complianceScore, 0) / totalPolicies
    );

    const topRecommendations = [
      'Replace wildcard permissions (*) with specific actions and resources',
      'Add appropriate conditions to sensitive IAM actions',
      'Regular review and cleanup of unused policies and permissions',
      'Use AWS managed policies where appropriate',
      'Implement policy validation in CI/CD pipeline'
    ];

    return {
      totalPolicies,
      policiesWithViolations,
      criticalViolations,
      highViolations,
      mediumViolations,
      lowViolations,
      overallComplianceScore,
      topRecommendations
    };
  }

  async generateReport(outputPath?: string): Promise<void> {
    const { reports, summary } = await this.runFullAudit();
    
    const reportData = {
      auditDate: new Date().toISOString(),
      summary,
      detailedReports: reports
    };

    if (outputPath) {
      const fs = await import('fs');
      fs.writeFileSync(outputPath, JSON.stringify(reportData, null, 2));
      console.log(`\n📄 Detailed report saved to: ${outputPath}`);
    }

    // Display critical issues
    const criticalReports = reports.filter(r => r.riskLevel === 'CRITICAL');
    if (criticalReports.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES REQUIRING IMMEDIATE ATTENTION:');
      for (const report of criticalReports) {
        console.log(`\n❌ ${report.policyName}:`);
        const criticalViolations = report.violations.filter(v => v.severity === 'CRITICAL');
        for (const violation of criticalViolations) {
          console.log(`   - ${violation.description}`);
          console.log(`   - Recommendation: ${violation.recommendation}`);
        }
      }
    }
  }
}

// CLI execution
async function main() {
  const outputFile = process.argv.includes('--output') 
    ? process.argv[process.argv.indexOf('--output') + 1] 
    : 'iam-policy-audit-report.json';

  try {
    const auditor = new IAMPolicyAuditor();
    await auditor.generateReport(outputFile);
  } catch (error) {
    console.error('❌ IAM Policy audit failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { IAMPolicyAuditor, PolicyAuditReport, AuditSummary };
