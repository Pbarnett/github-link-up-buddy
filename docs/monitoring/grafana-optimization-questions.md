# 🤖 Questions for Grafana Bot - Monitoring Setup Optimization

## 📊 Dashboard Performance Optimization

### Question 1: Multi-Dashboard Performance
"We have 12 production dashboards including business KPIs, multi-environment comparisons, and SLO monitoring. What are the best practices for optimizing dashboard loading performance and query efficiency when users navigate between multiple dashboards frequently?"

### Question 2: Template Variable Optimization
"Our dashboards use template variables for environment selection ($env, $environment) and time ranges. How can we optimize these variables to reduce query load and improve user experience when switching between environments?"

### Question 3: Query Caching Strategy
"For our multi-environment setup with development, staging, and production Prometheus instances, what's the optimal caching strategy to reduce redundant queries while ensuring real-time data freshness for critical business metrics?"

## 🌍 Multi-Environment Data Architecture

### Question 4: Prometheus Federation Setup
"We're running separate Prometheus instances for dev/staging/production environments. Should we implement Prometheus federation to centralize data collection, or maintain separate instances? What are the trade-offs for our business KPI correlation needs?"

### Question 5: Cross-Environment Alerting
"How can we configure alerting rules that can compare metrics across environments (e.g., alert when production error rate exceeds staging by X%) without creating alert rule duplication?"

### Question 6: Data Retention Policies
"What retention policies do you recommend for different environment types? Production needs long-term business trend analysis, while dev environments could have shorter retention. How should we configure this optimally?"

## 💼 Business KPI Dashboard Excellence

### Question 7: Executive Dashboard Visualization
"Our executive dashboard shows revenue correlation with system health. What visualization types and dashboard layout patterns work best for C-level executives who need quick business health insights?"

### Question 8: Real-time Business Metrics
"We're correlating technical metrics (latency, errors) with business KPIs (revenue, user engagement). What's the most efficient way to calculate and display these correlations in real-time without impacting dashboard performance?"

### Question 9: Business Alerting Strategy
"How should we configure business metric alerts (revenue drops, user engagement issues) to provide actionable insights to both technical and business teams without alert fatigue?"

## 🚨 Advanced Alerting & Notification

### Question 10: Alert Flapping Prevention
"With multiple environments and business correlations, how can we prevent alert flapping when metrics oscillate around thresholds, especially for business-critical alerts that affect executive visibility?"

### Question 11: Environment-Aware Alert Routing
"What's the best way to route alerts based on environment and severity? For example, production critical alerts to executives + engineers, but staging warnings only to engineers?"

### Question 12: Alert Dependency Management
"How can we implement alert dependencies where downstream alerts are suppressed when upstream issues are detected (e.g., suppress business metric alerts when underlying infrastructure fails)?"

## ⚡ Resource & Performance Optimization

### Question 13: Resource Planning
"For our monitoring stack serving 12 dashboards with real-time business correlations and multi-environment data, what are the recommended resource allocations for Grafana and Prometheus instances?"

### Question 14: Concurrent Access Optimization
"Our dashboards will be accessed by executives, engineers, and operations teams simultaneously. How should we optimize Grafana configuration for high concurrent access without performance degradation?"

### Question 15: Dashboard Organization Strategy
"With business, technical, and multi-environment dashboards, what folder structure and permission model works best for different user types (executives, engineers, ops teams)?"

## 🔄 Scalability & High Availability

### Question 16: Monitoring Stack Scaling
"As our application grows, how should we prepare our monitoring infrastructure for horizontal scaling? What components should scale first, and what are the key bottlenecks to watch?"

### Question 17: High Availability Setup
"What's the recommended HA configuration for our monitoring stack to ensure business dashboard availability during infrastructure issues?"

### Question 18: Backup & Disaster Recovery
"How should we implement automated dashboard backup, versioning, and disaster recovery for our business-critical monitoring setup?"

## 📈 Advanced Monitoring Patterns

### Question 19: Anomaly Detection Integration
"Are there Grafana plugins or patterns you recommend for implementing basic anomaly detection on our business metrics to proactively identify issues before they impact KPIs?"

### Question 20: Custom Panel Development
"For our unique business KPI correlations, when should we consider developing custom Grafana panels versus using existing visualizations with advanced queries?"

---

## 🎯 Priority Questions

If the Grafana bot can only answer a few questions, these are our **top 5 priorities**:

1. **Multi-Dashboard Performance Optimization** (Question 1)
2. **Business KPI Visualization Best Practices** (Question 7)
3. **Multi-Environment Data Architecture** (Question 4)
4. **Resource Planning for Scale** (Question 13)
5. **Alert Flapping Prevention** (Question 10)

These answers would help us take our monitoring setup from "production-ready" to "enterprise-optimized" with proven best practices from the Grafana community.
