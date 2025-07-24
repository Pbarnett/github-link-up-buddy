#!/usr/bin/env node

import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import EnforcementOpenAIClient from './shared/openai-client.js';
import ConfidenceGating from './shared/confidence-gating.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

class AICodeReviewEnforcement {
  constructor() {
    this.client = new EnforcementOpenAIClient();
    this.gating = new ConfidenceGating();
    this.reportDir = path.join(__dirname, '../../reports/ai-code-review');
    this.results = {
      totalFiles: 0,
      reviewedFiles: 0,
      criticalIssues: 0,
      highIssues: 0,
      mediumIssues: 0,
      suggestions: 0,
      totalCost: 0,
      shouldBlock: false,
      files: []
    };
  }

  async init() {
    // Ensure report directory exists
    await fs.mkdir(this.reportDir, { recursive: true });
    console.log('🤖 AI Code Review Enforcement - Starting Analysis\n');
  }

  async getChangedFiles() {
    try {
      // Check if we're in GitHub Actions or local development
      const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
      
      let command;
      if (isGitHubActions) {
        // In GitHub Actions, compare with base branch
        const baseBranch = process.env.GITHUB_BASE_REF || 'main';
        command = `git diff --name-only origin/${baseBranch}...HEAD`;
      } else {
        // Local development - check staged files or recent commits
        command = 'git diff --cached --name-only';
        const { stdout: staged } = await execAsync(command);
        
        if (!staged.trim()) {
          // No staged files, check last commit
          command = 'git diff --name-only HEAD~1';
        }
      }
      
      const { stdout } = await execAsync(command);
      const files = stdout.trim().split('\n').filter(file => {
        // Only review relevant file types
        return file && (file.endsWith('.ts') || file.endsWith('.tsx') || 
                       file.endsWith('.js') || file.endsWith('.jsx') ||
                       file.endsWith('.vue') || file.endsWith('.py'));
      });
      
      return files;
    } catch (error) {
      console.error('❌ Error retrieving changed files:', error.message);
      return [];
    }
  }

  async getFileDiff(filePath) {
    try {
      const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
      let command;
      
      if (isGitHubActions) {
        const baseBranch = process.env.GITHUB_BASE_REF || 'main';
        command = `git diff origin/${baseBranch}...HEAD -- "${filePath}"`;
      } else {
        command = `git diff --cached -- "${filePath}"`;
        const { stdout: staged } = await execAsync(command);
        
        if (!staged.trim()) {
          command = `git diff HEAD~1 -- "${filePath}"`;
        }
      }
      
      const { stdout } = await execAsync(command);
      return stdout;
    } catch (error) {
      console.warn(`⚠️ Could not get diff for ${filePath}:`, error.message);
      return '';
    }
  }

  async getFileContent(filePath) {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      console.error(`❌ Error reading ${filePath}:`, error.message);
      return '';
    }
  }

  async reviewFile(filePath) {
    console.log(`📋 Reviewing: ${filePath}`);
    
    const diff = await this.getFileDiff(filePath);
    const content = await this.getFileContent(filePath);
    
    if (!content) {
      console.warn(`⚠️ Skipping ${filePath} - could not read content`);
      return null;
    }

    // Load the prompt template
    const promptTemplate = await this.client.getPromptTemplate('code_review', 'review_template');
    if (!promptTemplate) {
      throw new Error('Could not load code review prompt template');
    }

    // Prepare the prompt with context
    const prompt = promptTemplate
      .replace('{DIFF_CONTENT}', diff || 'Full file content (no diff available)')
      .replace('{FILE_CONTEXT}', `File: ${filePath}\nContent length: ${content.length} characters`);

    const messages = [
      {
        role: 'system',
        content: prompt
      },
      {
        role: 'user',
        content: diff ? `Please review these changes in ${filePath}:\n\n${diff}` : 
                       `Please review this file ${filePath}:\n\n${content.substring(0, 8000)}`
      }
    ];

    try {
      const response = await this.client.makeRequest('code_review', messages, {
        maxTokens: 2000,
        structured: true,
        useCache: true,
        temperature: 0.1
      });

      if (response.fallback) {
        console.warn(`⚠️ AI review unavailable for ${filePath}: ${response.reason}`);
        return this.createFallbackReview(filePath, response.reason);
      }

      // Assess confidence
      const assessment = this.gating.assessConfidence(response.content, 'code_review', { filePath, diff });
      
      // Parse the AI response
      let reviewData;
      try {
        reviewData = JSON.parse(response.content);
      } catch (parseError) {
        console.warn(`⚠️ Could not parse structured response for ${filePath}`);
        reviewData = this.createFallbackFromText(response.content);
      }

      // Enhance with metadata
      const fileReview = {
        file: filePath,
        timestamp: new Date().toISOString(),
        model: response.model,
        cost: response.cost,
        confidence: assessment.confidence,
        should_escalate: assessment.shouldEscalate,
        quality_level: assessment.qualityLevel,
        ...reviewData
      };

      // Count issues
      const criticalCount = (reviewData.blocking_issues || []).filter(i => i.severity === 'critical').length;
      const highCount = (reviewData.blocking_issues || []).filter(i => i.severity === 'high').length;
      const mediumCount = (reviewData.blocking_issues || []).filter(i => i.severity === 'medium').length;
      
      this.results.criticalIssues += criticalCount;
      this.results.highIssues += highCount;
      this.results.mediumIssues += mediumCount;
      this.results.suggestions += (reviewData.suggestions || []).length;
      this.results.totalCost += response.cost;

      // Determine if this should block the PR
      if (criticalCount > 0 || (highCount > 0 && assessment.confidence > 0.8)) {
        this.results.shouldBlock = true;
      }

      console.log(`   ✓ Confidence: ${(assessment.confidence * 100).toFixed(1)}%`);
      console.log(`   ✓ Issues: ${criticalCount} critical, ${highCount} high, ${mediumCount} medium`);
      console.log(`   ✓ Cost: $${response.cost.toFixed(6)}\n`);

      return fileReview;

    } catch (error) {
      console.error(`❌ Failed to review ${filePath}:`, error.message);
      return this.createErrorReview(filePath, error.message);
    }
  }

  createFallbackReview(filePath, reason) {
    return {
      file: filePath,
      timestamp: new Date().toISOString(),
      overall_quality: 'unknown',
      confidence_score: 0.3,
      blocking_issues: [],
      suggestions: [{
        category: 'system',
        description: `AI review unavailable: ${reason}. Please conduct manual review.`,
        reasoning: 'Fallback to manual review process'
      }],
      security_notes: [],
      performance_notes: [],
      test_coverage_assessment: 'Could not assess - manual review required',
      summary: `Automated review failed (${reason}). Manual review recommended.`,
      fallback: true
    };
  }

  createFallbackFromText(content) {
    return {
      overall_quality: 'medium',
      confidence_score: 0.5,
      blocking_issues: [],
      suggestions: [{
        category: 'system',
        description: 'Review completed but response format was not structured',
        reasoning: 'Manual parsing of review comments may be needed'
      }],
      security_notes: [],
      performance_notes: [],
      test_coverage_assessment: 'Not assessed in unstructured response',
      summary: content.substring(0, 200) + '...',
      unstructured_response: content
    };
  }

  createErrorReview(filePath, error) {
    return {
      file: filePath,
      timestamp: new Date().toISOString(),
      overall_quality: 'unknown',
      confidence_score: 0.0,
      blocking_issues: [],
      suggestions: [],
      security_notes: [],
      performance_notes: [],
      test_coverage_assessment: 'Error occurred during review',
      summary: `Review failed due to error: ${error}`,
      error: true,
      error_message: error
    };
  }

  async generateReport() {
    const reportPath = path.join(this.reportDir, `review-${Date.now()}.json`);
    const report = {
      ...this.results,
      timestamp: new Date().toISOString(),
      repository: 'github-link-up-buddy',
      branch: process.env.GITHUB_HEAD_REF || 'unknown',
      commit: process.env.GITHUB_SHA || 'unknown'
    };

    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📊 AI Code Review Summary:');
    console.log('═'.repeat(50));
    console.log(`Files Reviewed: ${this.results.reviewedFiles}/${this.results.totalFiles}`);
    console.log(`Critical Issues: ${this.results.criticalIssues}`);
    console.log(`High Priority Issues: ${this.results.highIssues}`);
    console.log(`Medium Priority Issues: ${this.results.mediumIssues}`);
    console.log(`Suggestions: ${this.results.suggestions}`);
    console.log(`Total Cost: $${this.results.totalCost.toFixed(6)}`);
    console.log(`Should Block PR: ${this.results.shouldBlock ? '❌ YES' : '✅ NO'}`);
    console.log('═'.repeat(50));
    console.log(`Report saved: ${reportPath}\n`);

    return report;
  }

  async run() {
    try {
      await this.init();
      
      const changedFiles = await this.getChangedFiles();
      this.results.totalFiles = changedFiles.length;
      
      if (changedFiles.length === 0) {
        console.log('✅ No relevant files to review.');
        return { shouldBlock: false, reason: 'no_files' };
      }

      console.log(`📁 Found ${changedFiles.length} files to review:`);
      changedFiles.forEach(file => console.log(`   • ${file}`));
      console.log('');

      // Review each file
      for (const file of changedFiles) {
        const review = await this.reviewFile(file);
        if (review) {
          this.results.files.push(review);
          this.results.reviewedFiles++;
        }
      }

      // Generate final report
      const report = await this.generateReport();
      
      // Exit with appropriate code
      if (this.results.shouldBlock) {
        console.error('❌ Code review found blocking issues. PR should not be merged.');
        process.exit(1);
      } else {
        console.log('✅ Code review passed. No blocking issues found.');
        process.exit(0);
      }

    } catch (error) {
      console.error('❌ AI Code Review Enforcement failed:', error.message);
      process.exit(1);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const reviewer = new AICodeReviewEnforcement();
  reviewer.run();
}

export default AICodeReviewEnforcement;
