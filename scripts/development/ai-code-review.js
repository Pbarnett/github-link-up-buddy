#!/usr/bin/env node

/**
 * AI-Powered Code Review Assistant
 * 
 * Uses OpenAI GPT-4.1 mini to review code changes automatically on PRs
 * - Detects logic errors, security issues, performance problems
 * - Suggests architectural improvements  
 * - Explains complex code sections
 * - Cost: ~$0.003 per PR review (~2K tokens)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  model: 'gpt-4.1-mini', // Most cost-effective: $0.40/$1.60 per 1M tokens
  maxTokens: 4000,
  temperature: 0.1, // Low temperature for consistent code analysis
  apiEndpoint: 'https://api.openai.com/v1/chat/completions'
};

/**
 * Main AI Code Review Function
 */
async function runAICodeReview(options = {}) {
  console.log('🤖 AI Code Review Assistant - Starting Analysis');
  console.log('='.repeat(60));
  
  try {
    // Get changed files for review
    const changedFiles = getChangedFiles(options);
    
    if (changedFiles.length === 0) {
      console.log('✅ No code changes detected for review');
      return { success: true, reviews: [] };
    }
    
    console.log(`📁 Analyzing ${changedFiles.length} changed files...`);
    
    // Process files in batches to manage token limits
    const reviews = [];
    const batchSize = 3; // Review 3 files at a time
    
    for (let i = 0; i < changedFiles.length; i += batchSize) {
      const batch = changedFiles.slice(i, i + batchSize);
      const batchReview = await reviewFileBatch(batch);
      reviews.push(...batchReview);
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Generate summary report
    const report = generateReviewReport(reviews);
    saveReviewReport(report);
    
    console.log('\n🎉 AI Code Review Complete!');
    console.log(`📊 Report saved to: ai-code-review-report.json`);
    
    return { success: true, reviews, report };
    
  } catch (error) {
    console.error('❌ AI Code Review failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Get list of changed files for review
 */
function getChangedFiles(options) {
  const { compareWith = 'HEAD~1', includePaths = ['src/', 'scripts/', 'tests/'] } = options;
  
  try {
    // Get diff of changed files
    const diffOutput = execSync(`git diff --name-only ${compareWith}`, { 
      encoding: 'utf8',
      stdio: 'pipe'
    }).trim();
    
    if (!diffOutput) return [];
    
    const allChangedFiles = diffOutput.split('\n');
    
    // Filter for relevant file types and paths
    const relevantFiles = allChangedFiles.filter(file => {
      // Include JavaScript/TypeScript files
      if (!/\.(js|jsx|ts|tsx)$/.test(file)) return false;
      
      // Include files in specified paths
      if (!includePaths.some(path => file.startsWith(path))) return false;
      
      // Exclude certain directories
      if (file.includes('node_modules/') || file.includes('dist/') || file.includes('.next/')) return false;
      
      // Check if file exists (not deleted)
      return fs.existsSync(file);
    });
    
    return relevantFiles;
    
  } catch (error) {
    console.warn('⚠️ Could not get git diff, using current staged files');
    
    // Fallback: get staged files
    try {
      const stagedOutput = execSync('git diff --cached --name-only', { 
        encoding: 'utf8',
        stdio: 'pipe'
      }).trim();
      
      return stagedOutput ? stagedOutput.split('\n').filter(file => 
        /\.(js|jsx|ts|tsx)$/.test(file) && fs.existsSync(file)
      ) : [];
      
    } catch (fallbackError) {
      console.warn('⚠️ Could not get staged files either');
      return [];
    }
  }
}

/**
 * Review a batch of files using OpenAI
 */
async function reviewFileBatch(files) {
  const fileContents = files.map(file => ({
    path: file,
    content: getFileContent(file),
    diff: getFileDiff(file)
  }));
  
  const prompt = createReviewPrompt(fileContents);
  
  try {
    const response = await callOpenAI(prompt);
    return parseReviewResponse(response, files);
  } catch (error) {
    console.warn(`⚠️ Failed to review batch ${files.join(', ')}: ${error.message}`);
    return files.map(file => ({
      file,
      success: false,
      error: error.message,
      issues: [],
      suggestions: []
    }));
  }
}

/**
 * Get file content safely
 */
function getFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Truncate very large files to stay within token limits
    if (content.length > 8000) {
      return content.substring(0, 8000) + '\n\n// ... [file truncated for analysis]';
    }
    
    return content;
  } catch (error) {
    return `// Error reading file: ${error.message}`;
  }
}

/**
 * Get git diff for file
 */
function getFileDiff(filePath) {
  try {
    const diff = execSync(`git diff HEAD~1 -- "${filePath}"`, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    // Truncate large diffs
    if (diff.length > 2000) {
      return diff.substring(0, 2000) + '\n\n// ... [diff truncated]';
    }
    
    return diff;
  } catch (error) {
    return '// No diff available';
  }
}

/**
 * Create AI review prompt
 */
function createReviewPrompt(fileContents) {
  const filesText = fileContents.map(({ path, content, diff }) => `
## File: ${path}

### Current Content:
\`\`\`javascript
${content}
\`\`\`

### Changes (Git Diff):
\`\`\`diff
${diff}
\`\`\`
`).join('\n');

  return `You are an expert code reviewer specializing in JavaScript, TypeScript, and React applications. 

Please review the following code changes and provide:

1. **Critical Issues**: Logic errors, security vulnerabilities, performance problems
2. **Code Quality**: Best practices, maintainability, readability
3. **Architecture**: Suggestions for better structure or patterns
4. **TypeScript**: Type safety improvements
5. **Security**: Potential security risks or improvements

For each issue found, provide:
- Severity: HIGH/MEDIUM/LOW
- Location: file:line (if applicable)
- Description: Clear explanation of the issue
- Suggestion: Specific recommendation to fix

Focus on actionable feedback. If code looks good, say so briefly.

Respond in JSON format:
\`\`\`json
{
  "summary": "Brief overall assessment",
  "totalIssues": 0,
  "files": [
    {
      "path": "file/path",
      "status": "good/issues/critical",
      "issues": [
        {
          "severity": "HIGH|MEDIUM|LOW",
          "type": "logic|security|performance|style|architecture",
          "line": 42,
          "description": "Issue description",
          "suggestion": "How to fix it",
          "example": "Optional: code example"
        }
      ],
      "positives": ["Things done well"],
      "suggestions": ["Improvement suggestions"]
    }
  ]
}
\`\`\`

${filesText}`;
}

/**
 * Call OpenAI API
 */
async function callOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }
  
  const fetch = (await import('node-fetch')).default;
  
  const response = await fetch(CONFIG.apiEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: CONFIG.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert code reviewer. Provide constructive, actionable feedback in JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: CONFIG.maxTokens,
      temperature: CONFIG.temperature
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Parse AI response
 */
function parseReviewResponse(response, files) {
  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : response;
    
    const parsed = JSON.parse(jsonStr);
    
    return files.map(file => {
      const fileReview = parsed.files?.find(f => f.path === file) || {
        path: file,
        status: 'unknown',
        issues: [],
        positives: [],
        suggestions: []
      };
      
      return {
        file,
        success: true,
        ...fileReview,
        estimatedCost: calculateCost(response.length)
      };
    });
    
  } catch (error) {
    console.warn('⚠️ Failed to parse AI response, using fallback');
    return files.map(file => ({
      file,
      success: false,
      error: 'Failed to parse AI response',
      rawResponse: response.substring(0, 500)
    }));
  }
}

/**
 * Calculate estimated API cost
 */
function calculateCost(responseLength) {
  // Rough estimation: ~4 chars per token
  const estimatedTokens = responseLength / 4;
  const inputCost = (estimatedTokens * 0.40) / 1000000; // $0.40 per 1M input tokens
  const outputCost = (estimatedTokens * 1.60) / 1000000; // $1.60 per 1M output tokens
  return inputCost + outputCost;
}

/**
 * Generate review report
 */
function generateReviewReport(reviews) {
  const totalFiles = reviews.length;
  const filesWithIssues = reviews.filter(r => r.issues?.length > 0).length;
  const totalIssues = reviews.reduce((sum, r) => sum + (r.issues?.length || 0), 0);
  const criticalIssues = reviews.reduce((sum, r) => 
    sum + (r.issues?.filter(i => i.severity === 'HIGH').length || 0), 0
  );
  
  const totalCost = reviews.reduce((sum, r) => sum + (r.estimatedCost || 0), 0);
  
  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles,
      filesWithIssues,
      totalIssues,
      criticalIssues,
      estimatedCost: totalCost.toFixed(6)
    },
    reviews,
    recommendations: generateRecommendations(reviews)
  };
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(reviews) {
  const recommendations = [];
  
  const criticalIssues = reviews.flatMap(r => r.issues?.filter(i => i.severity === 'HIGH') || []);
  const securityIssues = reviews.flatMap(r => r.issues?.filter(i => i.type === 'security') || []);
  const performanceIssues = reviews.flatMap(r => r.issues?.filter(i => i.type === 'performance') || []);
  
  if (criticalIssues.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      action: 'Fix Critical Issues',
      description: `Address ${criticalIssues.length} critical issues before merge`,
      files: [...new Set(criticalIssues.map(i => i.file))]
    });
  }
  
  if (securityIssues.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      action: 'Security Review',
      description: `Review ${securityIssues.length} potential security issues`,
      files: [...new Set(securityIssues.map(i => i.file))]
    });
  }
  
  if (performanceIssues.length > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      action: 'Performance Optimization',
      description: `Consider ${performanceIssues.length} performance improvements`,
      files: [...new Set(performanceIssues.map(i => i.file))]
    });
  }
  
  return recommendations;
}

/**
 * Save review report
 */
function saveReviewReport(report) {
  const reportPath = 'ai-code-review-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Also create a human-readable summary
  const summaryPath = 'ai-code-review-summary.md';
  const summary = createMarkdownSummary(report);
  fs.writeFileSync(summaryPath, summary);
}

/**
 * Create markdown summary
 */
function createMarkdownSummary(report) {
  const { summary, reviews, recommendations } = report;
  
  return `# 🤖 AI Code Review Report

**Generated:** ${new Date(report.timestamp).toLocaleString()}  
**Cost:** ~$${summary.estimatedCost} (GPT-4.1 mini)

## 📊 Summary

- **Files Reviewed:** ${summary.totalFiles}
- **Files with Issues:** ${summary.filesWithIssues}
- **Total Issues:** ${summary.totalIssues}
- **Critical Issues:** ${summary.criticalIssues}

## 🚨 Recommendations

${recommendations.map(rec => `
### ${rec.priority === 'HIGH' ? '🔴' : '🟡'} ${rec.action}
${rec.description}

**Files:** ${rec.files.join(', ')}
`).join('\n')}

## 📁 File Reviews

${reviews.map(review => `
### ${review.file}
**Status:** ${review.status === 'good' ? '✅' : review.status === 'critical' ? '🔴' : '⚠️'} ${review.status}

${review.issues?.length > 0 ? `
**Issues Found:**
${review.issues.map(issue => `
- **${issue.severity}** (${issue.type}): ${issue.description}
  ${issue.suggestion ? `*Suggestion: ${issue.suggestion}*` : ''}
`).join('')}` : ''}

${review.positives?.length > 0 ? `
**Good Practices:**
${review.positives.map(p => `- ${p}`).join('\n')}
` : ''}
`).join('\n')}

---
*AI Code Review Assistant - Keeping your code quality high! 🚀*
`;
}

/**
 * CLI Interface
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--compare-with' && args[i + 1]) {
      options.compareWith = args[++i];
    } else if (arg === '--help') {
      console.log(`
AI Code Review Assistant

Usage:
  node scripts/development/ai-code-review.js [options]

Options:
  --compare-with <ref>    Compare with git ref (default: HEAD~1)
  --help                  Show this help

Environment Variables:
  OPENAI_API_KEY         Required: Your OpenAI API key

Examples:
  node scripts/development/ai-code-review.js
  node scripts/development/ai-code-review.js --compare-with main
  node scripts/development/ai-code-review.js --compare-with HEAD~3
`);
      process.exit(0);
    }
  }
  
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable is required');
    console.log('Get your API key from: https://platform.openai.com/api-keys');
    process.exit(1);
  }
  
  // Run the review
  runAICodeReview(options)
    .then(result => {
      if (result.success) {
        console.log(`\n✅ AI Code Review completed successfully!`);
        if (result.report?.summary.criticalIssues > 0) {
          console.log(`🚨 Found ${result.report.summary.criticalIssues} critical issues - please review!`);
          process.exit(1); // Fail CI if critical issues found
        }
      } else {
        console.error('❌ AI Code Review failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { runAICodeReview };
