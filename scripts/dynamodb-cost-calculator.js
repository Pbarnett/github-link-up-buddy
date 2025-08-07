#!/usr/bin/env node

/**
 * DynamoDB Cost Calculator
 * Compares On-Demand vs Provisioned capacity costs
 * 
 * Usage: node scripts/dynamodb-cost-calculator.js
 */

// AWS DynamoDB Pricing (US East 1 - as of 2024)
const PRICING = {
  onDemand: {
    readRequestUnit: 0.25 / 1000000,    // $0.25 per million read requests
    writeRequestUnit: 1.25 / 1000000,   // $1.25 per million write requests
  },
  provisioned: {
    readCapacityUnit: 0.00013,          // $0.00013 per RCU per hour
    writeCapacityUnit: 0.00065,         // $0.00065 per WCU per hour
  }
};

const HOURS_PER_MONTH = 730; // Average hours in a month

class DynamoDBCostCalculator {
  constructor() {
    this.results = {};
  }

  /**
   * Calculate On-Demand costs
   * @param {number} avgReadsPerSecond - Average read requests per second
   * @param {number} avgWritesPerSecond - Average write requests per second
   * @returns {object} Cost breakdown
   */
  calculateOnDemandCosts(avgReadsPerSecond, avgWritesPerSecond) {
    const monthlySeconds = 30 * 24 * 60 * 60; // ~2.6M seconds
    
    const monthlyReads = avgReadsPerSecond * monthlySeconds;
    const monthlyWrites = avgWritesPerSecond * monthlySeconds;
    
    const readCost = monthlyReads * PRICING.onDemand.readRequestUnit;
    const writeCost = monthlyWrites * PRICING.onDemand.writeRequestUnit;
    const totalCost = readCost + writeCost;

    return {
      monthlyReads,
      monthlyWrites,
      readCost,
      writeCost,
      totalCost,
      breakdown: {
        'Read Requests': `${(monthlyReads / 1000000).toFixed(1)}M @ $${PRICING.onDemand.readRequestUnit * 1000000}/M = $${readCost.toFixed(2)}`,
        'Write Requests': `${(monthlyWrites / 1000000).toFixed(1)}M @ $${PRICING.onDemand.writeRequestUnit * 1000000}/M = $${writeCost.toFixed(2)}`
      }
    };
  }

  /**
   * Calculate Provisioned costs with auto-scaling
   * @param {number} baseReadCapacity - Base read capacity units
   * @param {number} baseWriteCapacity - Base write capacity units
   * @param {number} utilizationFactor - Average utilization factor (0.5 = 50%)
   * @returns {object} Cost breakdown
   */
  calculateProvisionedCosts(baseReadCapacity, baseWriteCapacity, utilizationFactor = 0.7) {
    // Calculate average capacity considering auto-scaling
    const avgReadCapacity = baseReadCapacity * (1 + utilizationFactor * 0.3); // Scale up factor
    const avgWriteCapacity = baseWriteCapacity * (1 + utilizationFactor * 0.3);
    
    const readCost = avgReadCapacity * PRICING.provisioned.readCapacityUnit * HOURS_PER_MONTH;
    const writeCost = avgWriteCapacity * PRICING.provisioned.writeCapacityUnit * HOURS_PER_MONTH;
    const totalCost = readCost + writeCost;

    return {
      avgReadCapacity,
      avgWriteCapacity,
      readCost,
      writeCost,
      totalCost,
      breakdown: {
        'Read Capacity': `${avgReadCapacity.toFixed(1)} RCU × $${PRICING.provisioned.readCapacityUnit} × ${HOURS_PER_MONTH}h = $${readCost.toFixed(2)}`,
        'Write Capacity': `${avgWriteCapacity.toFixed(1)} WCU × $${PRICING.provisioned.writeCapacityUnit} × ${HOURS_PER_MONTH}h = $${writeCost.toFixed(2)}`
      }
    };
  }

  /**
   * Calculate GSI costs (same pricing structure as main table)
   * @param {number} baseReadCapacity - GSI base read capacity
   * @param {number} baseWriteCapacity - GSI base write capacity
   * @param {string} billingMode - 'PAY_PER_REQUEST' or 'PROVISIONED'
   * @param {number} avgReadsPerSecond - For on-demand
   * @param {number} avgWritesPerSecond - For on-demand
   * @returns {object} GSI cost breakdown
   */
  calculateGSICosts(baseReadCapacity, baseWriteCapacity, billingMode, avgReadsPerSecond = 0, avgWritesPerSecond = 0) {
    if (billingMode === 'PAY_PER_REQUEST') {
      return this.calculateOnDemandCosts(avgReadsPerSecond, avgWritesPerSecond);
    } else {
      return this.calculateProvisionedCosts(baseReadCapacity, baseWriteCapacity);
    }
  }

  /**
   * Perform comprehensive cost analysis
   * @param {object} scenario - Usage scenario parameters
   */
  analyzeScenario(scenario) {
    const {
      name,
      avgReadsPerSecond,
      avgWritesPerSecond,
      peakReadsPerSecond,
      peakWritesPerSecond,
      consistencyScore, // 0-100, how consistent the traffic is
      predictabilityScore // 0-100, how predictable the traffic is
    } = scenario;

    console.log(`\n📊 SCENARIO: ${name}`);
    console.log(`${'='.repeat(50)}`);
    
    // Calculate On-Demand costs
    const onDemandMain = this.calculateOnDemandCosts(avgReadsPerSecond, avgWritesPerSecond);
    const onDemandGSI = this.calculateOnDemandCosts(avgReadsPerSecond * 0.3, avgWritesPerSecond * 0.1); // Assume 30% reads, 10% writes to GSI
    const onDemandTotal = onDemandMain.totalCost + onDemandGSI.totalCost;

    // Calculate Provisioned costs (base capacity on average + buffer)
    const baseReadCapacity = Math.max(5, Math.ceil(avgReadsPerSecond * 1.2)); // 20% buffer
    const baseWriteCapacity = Math.max(5, Math.ceil(avgWritesPerSecond * 1.2));
    
    const provisionedMain = this.calculateProvisionedCosts(baseReadCapacity, baseWriteCapacity);
    const provisionedGSI = this.calculateProvisionedCosts(
      Math.max(5, Math.ceil(avgReadsPerSecond * 0.3 * 1.2)), 
      Math.max(5, Math.ceil(avgWritesPerSecond * 0.1 * 1.2))
    );
    const provisionedTotal = provisionedMain.totalCost + provisionedGSI.totalCost;

    // Calculate potential savings
    const savings = onDemandTotal - provisionedTotal;
    const savingsPercentage = (savings / onDemandTotal) * 100;

    // Determine recommendation
    let recommendation = 'STAY_ON_DEMAND';
    let confidence = 'Low';
    
    if (consistencyScore >= 70 && predictabilityScore >= 60 && savingsPercentage > 15) {
      recommendation = 'SWITCH_TO_PROVISIONED';
      confidence = 'High';
    } else if (consistencyScore >= 50 && predictabilityScore >= 50 && savingsPercentage > 10) {
      recommendation = 'CONSIDER_PROVISIONED';
      confidence = 'Medium';
    }

    // Display results
    console.log(`\n💰 COST COMPARISON`);
    console.log(`On-Demand Total:    $${onDemandTotal.toFixed(2)}/month`);
    console.log(`  Main Table:       $${onDemandMain.totalCost.toFixed(2)}`);
    console.log(`  UserIndex GSI:    $${onDemandGSI.totalCost.toFixed(2)}`);
    
    console.log(`\nProvisioned Total:  $${provisionedTotal.toFixed(2)}/month`);
    console.log(`  Main Table:       $${provisionedMain.totalCost.toFixed(2)}`);
    console.log(`  UserIndex GSI:    $${provisionedGSI.totalCost.toFixed(2)}`);
    
    console.log(`\n💵 POTENTIAL SAVINGS`);
    console.log(`Monthly Savings:    $${savings.toFixed(2)} (${savingsPercentage.toFixed(1)}%)`);
    console.log(`Annual Savings:     $${(savings * 12).toFixed(2)}`);

    console.log(`\n🎯 RECOMMENDATION: ${recommendation} (${confidence} Confidence)`);
    
    const riskFactors = this.assessRiskFactors(scenario, baseReadCapacity, baseWriteCapacity, peakReadsPerSecond, peakWritesPerSecond);
    console.log(`\n⚠️  RISK ASSESSMENT`);
    riskFactors.forEach(risk => console.log(`  • ${risk}`));

    console.log(`\n📈 TRAFFIC ANALYSIS`);
    console.log(`  Average: ${avgReadsPerSecond} reads/sec, ${avgWritesPerSecond} writes/sec`);
    console.log(`  Peak: ${peakReadsPerSecond} reads/sec, ${peakWritesPerSecond} writes/sec`);
    console.log(`  Consistency Score: ${consistencyScore}/100`);
    console.log(`  Predictability Score: ${predictabilityScore}/100`);

    return {
      scenario: name,
      costs: {
        onDemand: onDemandTotal,
        provisioned: provisionedTotal,
        savings,
        savingsPercentage
      },
      recommendation,
      confidence,
      riskFactors
    };
  }

  /**
   * Assess risk factors for switching to provisioned
   */
  assessRiskFactors(scenario, baseReadCapacity, baseWriteCapacity, peakReads, peakWrites) {
    const risks = [];
    
    const readCapacityRatio = peakReads / baseReadCapacity;
    const writeCapacityRatio = peakWrites / baseWriteCapacity;

    if (readCapacityRatio > 3) {
      risks.push(`High read peak-to-average ratio (${readCapacityRatio.toFixed(1)}x) - may cause throttling`);
    }
    
    if (writeCapacityRatio > 3) {
      risks.push(`High write peak-to-average ratio (${writeCapacityRatio.toFixed(1)}x) - may cause throttling`);
    }

    if (scenario.consistencyScore < 60) {
      risks.push('Low traffic consistency - may lead to over/under-provisioning');
    }

    if (scenario.predictabilityScore < 50) {
      risks.push('Low traffic predictability - difficult to set optimal capacity');
    }

    if (baseReadCapacity > 100 || baseWriteCapacity > 100) {
      risks.push('High base capacity requirements - consider Reserved Capacity for additional savings');
    }

    if (risks.length === 0) {
      risks.push('Low risk - good candidate for Provisioned mode');
    }

    return risks;
  }

  /**
   * Generate recommendations based on application type
   */
  generateApplicationRecommendations(applicationType) {
    const recommendations = {
      'link-management': {
        description: 'GitHub Link Buddy - Link Management Application',
        expectedPattern: 'Bursty usage with quiet periods',
        recommendation: 'Start with On-Demand, monitor for 4 weeks',
        scenarios: [
          {
            name: 'Early Stage (Low Usage)',
            avgReadsPerSecond: 2,
            avgWritesPerSecond: 0.5,
            peakReadsPerSecond: 10,
            peakWritesPerSecond: 3,
            consistencyScore: 40,
            predictabilityScore: 30
          },
          {
            name: 'Growing User Base',
            avgReadsPerSecond: 15,
            avgWritesPerSecond: 3,
            peakReadsPerSecond: 45,
            peakWritesPerSecond: 10,
            consistencyScore: 60,
            predictabilityScore: 55
          },
          {
            name: 'Mature Application',
            avgReadsPerSecond: 50,
            avgWritesPerSecond: 12,
            peakReadsPerSecond: 100,
            peakWritesPerSecond: 25,
            consistencyScore: 75,
            predictabilityScore: 70
          }
        ]
      }
    };

    return recommendations[applicationType];
  }
}

// Main execution
function main() {
  const calculator = new DynamoDBCostCalculator();
  
  console.log('🔍 DynamoDB Cost Analysis for GitHub Link Buddy');
  console.log('=' .repeat(60));

  const appRecommendations = calculator.generateApplicationRecommendations('link-management');
  console.log(`\n📱 APPLICATION TYPE: ${appRecommendations.description}`);
  console.log(`Expected Pattern: ${appRecommendations.expectedPattern}`);
  console.log(`Initial Recommendation: ${appRecommendations.recommendation}`);

  // Analyze different growth scenarios
  const results = appRecommendations.scenarios.map(scenario => 
    calculator.analyzeScenario(scenario)
  );

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📋 SUMMARY & ACTION PLAN');
  console.log('='.repeat(60));

  console.log('\n1. IMMEDIATE ACTIONS:');
  console.log('   ✅ Deploy monitoring CloudFormation template');
  console.log('   ✅ Set up CloudWatch dashboard');
  console.log('   ✅ Enable cost allocation tags');

  console.log('\n2. DATA COLLECTION (2-4 weeks):');
  console.log('   📊 Monitor ConsumedReadCapacityUnits');
  console.log('   📊 Monitor ConsumedWriteCapacityUnits');
  console.log('   📊 Track traffic patterns and consistency');
  console.log('   📊 Analyze peak vs average usage');

  console.log('\n3. DECISION CRITERIA:');
  console.log('   🎯 Switch to Provisioned if:');
  console.log('     • Consistency score > 60%');
  console.log('     • Predictability score > 60%'); 
  console.log('     • Potential savings > 15%');
  console.log('     • Peak-to-average ratio < 3x');

  console.log('\n4. IMPLEMENTATION:');
  console.log('   🚀 Update CloudFormation parameter: BillingMode=PROVISIONED');
  console.log('   🚀 Set appropriate base capacity values');
  console.log('   🚀 Enable auto-scaling (already configured)');
  console.log('   🚀 Monitor for throttling and adjust as needed');

  console.log('\n📞 Need help? Check aws-templates/dynamodb-optimization-analysis.md');
  console.log('🔗 CloudFormation template: aws-templates/dynamodb-optimized-template.yml');
}

// Run the analysis
main();
