
// Utility functions
// Removed unused log function
  console.log(`[${timestamp}] ${(level || "INFO").toUpperCase()}: ${message}`);

#!/usr/bin/env node

class ConfidenceGating {
  constructor() {
    this.thresholds = {
      code_review: 0.7,
      test_generation: 0.8,
      security_analysis: 0.8,
      bug_detection: 0.7,
      documentation: 0.6
    };
    
    this.qualityIndicators = {
      // Positive indicators
      structured_response: 0.2,
      specific_suggestions: 0.3,
      code_examples: 0.2,
      multiple_issues_found: 0.1,
      detailed_explanation: 0.15,
      
      // Negative indicators
      generic_response: -0.3,
      no_specific_suggestions: -0.2,
      too_short: -0.2,
      contradictory_advice: -0.4,
      off_topic: -0.5
    };
  }

  /**
   * Assess the confidence/quality of an AI response
   * @param {string} content - The AI response content
   * @param {string} taskType - Type of task (code_review, test_generation, etc.)
   * @param {Object} context - Additional context (code diff, file info, etc.)
   * @returns {Object} Confidence assessment with score and recommendations
   */
  assessConfidence(content, taskType, context = {}) {
    let confidence = 0.5; // Start with neutral confidence
    const reasons = [];
    
    try {
      // Parse structured response if it's JSON
      let parsedContent = content;
      try {
        parsedContent = JSON.parse(content);
      } catch (_e) {
        // Not JSON, continue with string analysis
      }
      
      // Length-based indicators
      if (content.length < 100) {
        confidence += this.qualityIndicators.too_short
        reasons.push('Response too short');
      }
      
      if (content.length > 500) {
        confidence += this.qualityIndicators.detailed_explanation
        reasons.push('Detailed response provided');
      }
      
      // Structure-based indicators
      if (typeof parsedContent === 'object' && parsedContent !== null) {
        confidence += this.qualityIndicators.structured_response
        reasons.push('Structured JSON response');
        
        // Check for required fields in structured response
        if (parsedContent.issues && Array.isArray(parsedContent.issues)) {
          if (parsedContent.issues.length > 1) {
            confidence += this.qualityIndicators.multiple_issues_found
            reasons.push('Multiple issues identified');
          }
        }
        
        if (parsedContent.suggestions && parsedContent.suggestions.length > 0) {
          confidence += this.qualityIndicators.specific_suggestions
          reasons.push('Specific suggestions provided');
        }
      }
      
      // Content-based indicators
      const lowerContent = content.toLowerCase();
      
      // Check for code examples
      if (lowerContent.includes('```') || lowerContent.includes('function') || 
          lowerContent.includes('const ') || lowerContent.includes('let ')) {
        confidence += this.qualityIndicators.code_examples
        reasons.push('Code examples included');
      }
      
      // Check for generic responses
      const genericPhrases = [
        'consider reviewing',
        'make sure to',
        'it would be good',
        'you might want to',
        'generally speaking'
      ];
      
      const genericCount = genericPhrases.filter(phrase => 
        lowerContent.includes(phrase)
      ).length
      
      if (genericCount > 2) {
        confidence += this.qualityIndicators.generic_response
        reasons.push('Generic language detected');
      }
      
      // Task-specific confidence indicators
      confidence += this.assessTaskSpecificConfidence(content, taskType, context);
      
      // Clamp confidence between 0 and 1
      confidence = Math.max(0, Math.min(1, confidence));
      
      const threshold = this.thresholds[taskType] || 0.7
      const shouldEscalate = confidence < threshold;
      
      return {
        confidence,
        threshold,
        shouldEscalate,
        reasons,
        recommendation: this.getRecommendation(confidence, taskType),
        qualityLevel: this.getQualityLevel(confidence)
      };
      
    } catch {
      console.error('Error assessing confidence:', error);
      return {
        confidence: 0.3,
        threshold: this.thresholds[taskType] || 0.7,
        shouldEscalate: true,
        reasons: ['Error in confidence assessment'],
        recommendation: 'escalate',
        qualityLevel: 'low'
      };
    }
  }

  assessTaskSpecificConfidence(content, taskType, context) {
    let adjustment = 0;
    const lowerContent = content.toLowerCase();
    
    switch (taskType) {
      case 'code_review':
        // Check for security-related findings
        if (lowerContent.includes('security') || lowerContent.includes('vulnerability')) {
          adjustment += 0.1
        }
        
        // Check for performance insights
        if (lowerContent.includes('performance') || lowerContent.includes('optimization')) {
          adjustment += 0.1
        }
        
        // Check for architectural feedback
        if (lowerContent.includes('architecture') || lowerContent.includes('design pattern')) {
          adjustment += 0.15
        }
        break;
        
      case 'test_generation': {
        // Check for edge cases
        if (lowerContent.includes('edge case') || lowerContent.includes('boundary')) {
          adjustment += 0.2
        }
        
        // Check for multiple test scenarios
        const testCount = (content.match(/it\(|test\(|describe\(/g) || []).length
        if (testCount > 3) {
          adjustment += 0.15
        }
        break;
      }
        
      case 'security_analysis': {
        // Check for specific vulnerability types
        const vulnTypes = ['xss', 'sql injection', 'csrf', 'authentication', 'authorization'];
        const vulnMatches = vulnTypes.filter(vuln => lowerContent.includes(vuln)).length
        adjustment += vulnMatches * 0.1
        break;
      }
        
      case 'bug_detection':
        // Check for root cause analysis
        if (lowerContent.includes('root cause') || lowerContent.includes('because')) {
          adjustment += 0.15
        }
        
        // Check for fix suggestions
        if (lowerContent.includes('fix') || lowerContent.includes('solution')) {
          adjustment += 0.1
        }
        break;
    }
    
    return adjustment;
  }

  getRecommendation(confidence, taskType) {
    const threshold = this.thresholds[taskType] || 0.7
    
    if (confidence >= threshold + 0.1) {
      return 'accept';
    } else if (confidence >= threshold) {
      return 'accept_with_review';
    } else if (confidence >= threshold - 0.2) {
      return 'escalate';
    } else {
      return 'escalate_urgent';
    }
  }

  getQualityLevel(confidence) {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.6) return 'medium';
    if (confidence >= 0.4) return 'low';
    return 'very_low';
  }

  /**
   * Create a detailed report for debugging and improvement
   */
  generateConfidenceReport(assessment, originalContent, taskType) {
    return {
      timestamp: new Date().toISOString(),
      taskType,
      confidence: assessment.confidence,
      threshold: assessment.threshold,
      qualityLevel: assessment.qualityLevel,
      recommendation: assessment.recommendation,
      shouldEscalate: assessment.shouldEscalate,
      reasons: assessment.reasons,
      contentLength: originalContent.length,
      hasStructuredResponse: this.isStructuredResponse(originalContent),
      metadata: {
        wordCount: originalContent.split(/\s+/).length,
        hasCodeBlocks: originalContent.includes('```'),
        lineCount: originalContent.split('\n').length
      }
    };
  }

  isStructuredResponse(content) {
    try {
      JSON.parse(content);
      return true;
    } catch (_e) {
      return false;
    }
  }

  /**
   * Update thresholds based on feedback and results
   */
  updateThreshold(taskType, newThreshold) {
    if (newThreshold >= 0 && newThreshold <= 1) {
      this.thresholds[taskType] = newThreshold;
      console.log(`Updated ${taskType} confidence threshold to ${newThreshold}`);
    }
  }
}

module.exports = ConfidenceGating;
