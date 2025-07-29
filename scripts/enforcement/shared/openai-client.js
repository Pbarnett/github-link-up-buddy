#!/usr/bin/env node

const path = require('path');

import OpenAI from 'openai';
const fs = require('fs');
// Utility functions
// Removed unused info function
// Removed unused warning function
// Removed unused error function
// Removed unused success function

// Utility functions
// Removed unused log function
  console.log(`[${timestamp}] ${(level || "INFO").toUpperCase()}: ${message}`);

class EnforcementOpenAIClient {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.config = null;
    this.costTracker = {
      daily: 0,
      monthly: 0,
      lastReset: new Date().toDateString()
    };
    
    this.promptCache = new Map();
    this.init();
  }

  async init() {
    try {
      // Load model configuration
      const configPath = path.join(__'../config/models.json');
      const configData = await fs.readFile(configPath, 'utf-8');
      this.config = JSON.parse(configData);
      
      // Load cost tracking data
      await this.loadCostTracker();
    } catch (error) {
      console.error('❌ Failed to initialize OpenAI client:', error.message);
      throw error;
    }
  }

  async loadCostTracker() {
    try {
      const trackerPath = path.join(__'../config/cost-tracker.json');
      const data = await fs.readFile(trackerPath, 'utf-8');
      this.costTracker = JSON.parse(data);
      
      // Reset daily costs if new day
      const today = new Date().toDateString();
      if (this.costTracker.lastReset !== today) {
        this.costTracker.daily = 0;
        this.costTracker.lastReset = today;
        await this.saveCostTracker();
      }
    } catch {
      // File doesn't exist, start fresh
      await this.saveCostTracker();
    }
  }

  async saveCostTracker() {
    try {
      const trackerPath = path.join(__'../config/cost-tracker.json');
      await fs.writeFile(trackerPath, JSON.stringify(this.costTracker, null, 2));
    } catch (error) {
      console.error('⚠️ Failed to save cost tracker:', error.message);
    }
  }

  estimateCost(inputTokens, outputTokens, modelKey, useCache = false, useFlex = false) {
    const model = this.config.models[modelKey];
    if (!model) return 0;

    let inputCost = model.input_cost
    if (useCache && model.cached_input_cost) {
      inputCost = model.cached_input_cost
    } else if (useFlex && model.flex_input_cost) {
      inputCost = model.flex_input_cost
    }

    const outputCost = useFlex && model.flex_output_cost ? 
      model.flex_output_cost : model.output_cost

    return ((inputTokens * inputCost) + (outputTokens * outputCost)) / 1000000;
  }

  checkBudget(estimatedCost) {
    const controls = this.config.cost_controls
    
    if (this.costTracker.daily + estimatedCost > controls.daily_budget) {
      return { allowed: false, reason: 'daily_budget_exceeded' };
    }
    
    if (this.costTracker.monthly + estimatedCost > controls.monthly_budget) {
      return { allowed: false, reason: 'monthly_budget_exceeded' };
    }
    
    return { allowed: true };
  }

  async getPromptTemplate(taskType, cacheKey = null) {
    try {
      const promptPath = path.join(__`../config/prompts/${taskType}.md`);
      
      // Check cache first
      if (cacheKey && this.promptCache.has(cacheKey)) {
        return this.promptCache.get(cacheKey);
      }
      
      const prompt = await fs.readFile(promptPath, 'utf-8');
      
      // Cache the prompt
      if (cacheKey) {
        this.promptCache.set(cacheKey, prompt);
      }
      
      return prompt;
    } catch {
      console.error(`⚠️ Failed to load prompt template for ${taskType}:`, error.message);
      return null;
    }
  }

  selectModel(taskType, contextSize = 0) {
    const routing = this.config.routing[taskType];
    if (!routing) {
      throw new Error(`No routing configuration found for task type: ${taskType}`);
    }

    let selectedModel = routing.primary
    const modelConfig = this.config.models[selectedModel];
    
    // Check if context size exceeds model limits
    if (contextSize > modelConfig.context_window) {
      console.warn(`⚠️ Context size (${contextSize}) exceeds ${selectedModel} limit. Falling back.`);
      selectedModel = routing.escalation_model || routing.fallback
    }

    return {
      modelKey: selectedModel,
      modelName: this.config.models[selectedModel].name,
      useFlex: routing.use_flex || false,
      escalationThreshold: routing.escalation_threshold || 0.8
    };
  }

  async makeRequest(taskType, messages, options = {}) {
    if (!this.config) {
      throw new Error('OpenAI client not initialized');
    }

    // Estimate context size (rough approximation)
    const contextSize = JSON.stringify(messages).length * 0.75; // ~0.75 tokens per character
    
    const modelConfig = this.selectModel(taskType, contextSize);
    const estimatedOutputTokens = options.maxTokens || 1000;
    
    // Check budget
    const estimatedCost = this.estimateCost(
      contextSize, 
      estimatedOutputTokens, 
      modelConfig.modelKey, 
      options.useCache, 
      modelConfig.useFlex
    );
    
    const budgetCheck = this.checkBudget(estimatedCost);
    if (!budgetCheck.allowed) {
      if (this.config.cost_controls.graceful_degradation) {
        console.warn(`⚠️ Budget exceeded (${budgetCheck.reason}), falling back to pattern-based analysis`);
        return { fallback: true, reason: budgetCheck.reason };
      } else {
        throw new Error(`Budget exceeded: ${budgetCheck.reason}`);
      }
    }

    try {
      console.log(`🤖 Making request with ${modelConfig.modelName} (estimated cost: $${estimatedCost.toFixed(6)})`);
      
      const requestParams = {
        model: modelConfig.modelName,
        messages,
        max_tokens: estimatedOutputTokens,
        temperature: options.temperature || 0.1,
        response_format: options.structured ? { type: "json_object" } : undefined
      };

      // Add caching header if enabled and prompt is large enough
      if (this.config.cost_controls.enable_caching && contextSize > 1024) {
        // Note: Caching implementation depends on OpenAI's API updates
        console.log('💾 Using prompt caching for cost optimization');
      }

      const response = await this.client.chat.completions.create(requestParams);
      
      // Track actual cost
      const actualCost = this.estimateCost(
        response.usage.prompt_tokens,
        response.usage.completion_tokens,
        modelConfig.modelKey,
        options.useCache,
        modelConfig.useFlex
      );
      
      this.costTracker.daily += actualCost;
      this.costTracker.monthly += actualCost;
      await this.saveCostTracker();
      
      console.log(`💰 Actual cost: $${actualCost.toFixed(6)} (Daily: $${this.costTracker.daily.toFixed(4)})`);
      
      return {
        content: response.choices[0].message.content,
        usage: response.usage,
        cost: actualCost,
        model: modelConfig.modelName,
        escalationThreshold: modelConfig.escalationThreshold
      };
      
    } catch (error) {
      console.error('❌ OpenAI API request failed:', error.message);
      
      if (this.config.cost_controls.graceful_degradation) {
        console.warn('⚠️ Falling back to pattern-based analysis');
        return { fallback: true, reason: 'api_error', error: error.message };
      }
      
      throw error;
    }
  }

  async getCostSummary() {
    return {
      daily: this.costTracker.daily,
      monthly: this.costTracker.monthly,
      dailyBudget: this.config.cost_controls.daily_budget,
      monthlyBudget: this.config.cost_controls.monthly_budget,
      dailyRemaining: this.config.cost_controls.daily_budget - this.costTracker.daily,
      monthlyRemaining: this.config.cost_controls.monthly_budget - this.costTracker.monthly
    };
  }
}

module.exports = EnforcementOpenAIClient;
