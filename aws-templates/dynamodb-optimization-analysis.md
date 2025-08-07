# DynamoDB Capacity Mode Optimization Analysis

## Current Configuration
- **Table**: `github-link-buddy-links-{environment}`
- **Billing Mode**: PAY_PER_REQUEST (On-Demand)
- **Type**: Global Table (Multi-region)
- **GSI**: UserIndex with ALL projection

## Decision Framework

### When to Stay with On-Demand (PAY_PER_REQUEST)
✅ **Keep On-Demand if**:
- Traffic is unpredictable or highly variable
- New application with unknown usage patterns
- Development/testing environments
- Intermittent usage patterns
- Traffic spikes are common and unpredictable
- You prioritize operational simplicity over cost

### When to Switch to Provisioned
💰 **Switch to Provisioned if**:
- Consistent, predictable traffic patterns (>60% utilization consistency)
- Steady baseline load with gradual growth
- Cost optimization is a priority
- Traffic patterns show regular daily/weekly cycles
- Average capacity utilization > 50%

## Cost Analysis Framework

### Step 1: Collect Metrics (2-4 weeks)
Monitor these CloudWatch metrics:
- `ConsumedReadCapacityUnits`
- `ConsumedWriteCapacityUnits`
- `ProvisionedThroughputExceededException` (throttles)
- `ThrottledRequests`

### Step 2: Calculate Potential Savings
```
On-Demand Cost = (Monthly Read Requests × $0.25/1M) + (Monthly Write Requests × $1.25/1M)
Provisioned Cost = (Read Capacity × $0.00013/hour × 730) + (Write Capacity × $0.00065/hour × 730)
```

### Step 3: Decision Criteria
- **High Confidence Switch**: >70% predictability, >60% consistent utilization
- **Consider Switch**: 50-70% predictability, >40% consistent utilization  
- **Stay On-Demand**: <50% predictability or highly variable traffic

## Recommendations for Your Use Case

### GitHub Link Buddy Application
Based on the application type (link management):
- **Traffic Pattern**: Likely bursty (users checking/adding links)
- **Usage**: May have quiet periods and active periods
- **Growth Stage**: Appears to be early-stage application

**Initial Recommendation**: Stay with On-Demand initially, but implement monitoring to gather data.

## Implementation Strategy

### Phase 1: Add Monitoring (Immediate)
1. Deploy monitoring CloudFormation template
2. Set up CloudWatch alarms
3. Enable cost allocation tags

### Phase 2: Data Collection (2-4 weeks)
1. Monitor traffic patterns
2. Analyze peak vs. average usage
3. Calculate cost projections

### Phase 3: Decision & Migration (If warranted)
1. Make data-driven decision
2. Implement gradual migration if switching
3. Set up auto-scaling for provisioned mode

## Risk Considerations

### Switching to Provisioned Risks:
- Under-provisioning leads to throttling
- Over-provisioning increases costs
- More complex to manage
- Need to monitor and adjust capacity

### Staying with On-Demand Risks:
- Higher per-request costs for predictable workloads
- Potential for bill shock during traffic spikes
- Less cost predictability

## Global Table Considerations

Your Global Table setup adds complexity:
- Both regions need capacity planning if switching to Provisioned
- Cross-region replication affects capacity calculations
- Consider different billing modes per region based on regional usage patterns
