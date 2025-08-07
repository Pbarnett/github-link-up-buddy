# World-Class Script Organization & Automation Framework

This directory contains the core infrastructure for world-class script organization and automated execution in the GitHub Link Buddy project.

## 🎯 Overview

We've implemented an enterprise-grade script automation system that:
- **Organizes 135+ scripts** from chaos into structured categories
- **Automates script execution** based on Git hooks, schedules, and triggers
- **Prevents breaking changes** through non-destructive migration
- **Provides observability** with execution logs, metrics, and reporting
- **Enforces quality** through dependency management and validation

## 📁 Core Components

### 🤖 Script Orchestrator (`orchestrator.js`)
The central automation engine that manages script execution.

**Features:**
- Registry-based script management
- Hook-based triggers (Git events)
- Dependency management
- Environment-aware execution
- Comprehensive logging and metrics

**Usage:**
```bash
# Execute scripts for a trigger
npm run scripts:trigger pre-commit

# Execute specific script
node scripts/_core/orchestrator.js execute testing/unit-runner.sh

# Scan and register new scripts
npm run scripts:scan

# View execution statistics
npm run scripts:stats
```

### 🔄 Script Migrator (`migrate-scripts.js`)
Non-destructive migration utility that safely organizes existing scripts.

**Features:**
- Smart categorization of scripts
- Package.json reference updates
- Backward compatibility via symlinks
- Migration reports and rollback capability

**Usage:**
```bash
# Analyze migration plan
npm run scripts:migrate:analyze

# Execute migration (safe)
npm run scripts:migrate:execute

# Rollback if needed
npm run scripts:migrate:rollback
```

### 🪝 Git Hooks (`hooks/`)
Automated Git hooks that run scripts at appropriate times.

**Features:**
- Pre-commit validation
- Pre-push quality gates
- Post-merge synchronization
- Conventional commit validation

**Usage:**
```bash
# Setup Git hooks
npm run scripts:hooks:setup

# Check hooks status
npm run scripts:hooks:status

# Remove hooks
npm run scripts:hooks:remove
```

### 📊 Registry (`registry.json`)
Metadata store for all registered scripts with execution tracking.

**Schema:**
```json
{
  "version": "1.0.0",
  "scripts": {
    "deployment/prod-deploy.sh": {
      "name": "prod-deploy",
      "category": "deployment",
      "triggers": ["pre-push"],
      "dependencies": ["build/prod-build.sh"],
      "environments": ["production"],
      "executionCount": 42,
      "lastSuccess": true
    }
  }
}
```

## 🗂️ New Directory Structure

Scripts are now organized into logical categories:

```
scripts/
├── _core/                    # Core automation framework
│   ├── orchestrator.js       # Main script orchestrator
│   ├── migrate-scripts.js    # Migration utility
│   ├── registry.json         # Script registry
│   └── hooks/                # Git hooks
├── build/                    # Build and compilation
├── deployment/               # Deployment orchestration
├── testing/                  # Test automation
├── database/                 # Database operations
├── monitoring/               # Observability
├── security/                 # Security and compliance
├── maintenance/              # Maintenance and cleanup
├── development/              # Developer productivity
└── legacy/                   # Legacy scripts (backup)
```

## 🚀 Quick Start

### 1. Complete Script Organization Setup
```bash
npm run scripts:organization:setup
```
This command will:
- Migrate all scripts to organized structure
- Install Git hooks for automation
- Register all scripts in the system

### 2. Check System Status
```bash
npm run scripts:organization:status
```

### 3. View Available Scripts
```bash
npm run scripts:list
```

## 🔧 Migration Process

### Before Migration
- 135+ scripts scattered in root directory
- No automated execution
- Manual script management
- No dependency tracking

### After Migration
- Scripts organized into 8 logical categories
- Automated execution based on triggers
- Git hooks enforce quality gates
- Comprehensive logging and metrics
- Package.json automatically updated
- Backward compatibility maintained

### Migration Safety Features
1. **Non-destructive**: Original scripts copied to `legacy/` directory
2. **Symlinks**: Critical scripts get symlinks for compatibility
3. **Package.json updates**: Script references automatically updated
4. **Rollback capability**: Full rollback to original state
5. **Validation**: Migration success validation

## 📈 Automated Execution

### Git Hook Triggers
Scripts automatically run on:
- **pre-commit**: Linting, formatting, quick tests
- **pre-push**: Comprehensive tests, security scans
- **post-merge**: Dependency updates, cache clearing
- **post-checkout**: Branch-specific setup
- **commit-msg**: Commit message validation

### Manual Triggers
```bash
# Deployment workflows
npm run scripts:trigger deploy

# Maintenance tasks
npm run scripts:trigger maintenance

# Security audits
npm run scripts:trigger security-audit
```

### Scheduled Execution
Scripts can be scheduled using the registry:
```json
{
  "schedule": "0 2 * * *",  // Daily at 2 AM
  "triggers": ["scheduled"]
}
```

## 📊 Monitoring & Observability

### Execution Logs
All script executions are logged with:
- Start/end timestamps
- Success/failure status
- Output capture
- Performance metrics

### Statistics Dashboard
```bash
npm run scripts:stats
```

Shows:
- Total scripts registered
- Execution success rates
- Average execution times
- Category breakdown

### Migration Reports
Detailed reports saved to `_core/migration-report.json` include:
- Scripts migrated per category
- Package.json changes
- Success/failure breakdown
- Performance metrics

## 🔒 Quality Gates

### Pre-commit Hooks
- Code formatting (Prettier)
- Linting (ESLint)
- Type checking (TypeScript)
- Unit tests (fast subset)

### Pre-push Hooks
- Full test suite
- Security scanning
- Build verification
- Dependency audit

### Script Dependencies
Scripts can declare dependencies:
```json
{
  "dependencies": ["build/prod-build.sh", "testing/unit-tests.sh"],
  "timeout": 300,
  "retry": 3
}
```

## 🛠️ Development Workflow

### Adding New Scripts
1. Create script in appropriate category directory
2. Run `npm run scripts:scan` to register
3. Define triggers and dependencies in registry
4. Test with `npm run scripts:trigger <trigger-name>`

### Modifying Existing Scripts
1. Edit script in categorized location
2. Update metadata in registry if needed
3. Test execution with orchestrator

### Debugging Script Issues
1. Check logs in `_core/logs/`
2. Run with verbose output: `npm run scripts:orchestrator execute <script> --verbose`
3. Validate registry with: `npm run scripts:migrate:validate`

## 🚨 Troubleshooting

### Common Issues

**Scripts not executing:**
- Check if registered: `npm run scripts:list`
- Verify triggers: Check registry.json
- Check logs: `_core/logs/orchestrator-*.log`

**Migration failed:**
- Rollback: `npm run scripts:migrate:rollback`
- Check report: `_core/migration-report.json`
- Re-run: `npm run scripts:migrate:execute`

**Git hooks not working:**
- Reinstall: `npm run scripts:hooks:setup`
- Check status: `npm run scripts:hooks:status`
- Verify permissions: Scripts should be executable

### Recovery Procedures

**Complete rollback:**
```bash
npm run scripts:migrate:rollback
npm run scripts:hooks:remove
# Manually restore original scripts from legacy/ if needed
```

**Fresh setup:**
```bash
rm -rf scripts/_core/logs/
rm scripts/_core/registry.json
npm run scripts:organization:setup
```

## 📚 Additional Resources

- [Repository Organization Guidelines](../../docs/REPOSITORY_ORGANIZATION_GUIDELINES.md)
- [Package.json Script Reference](../../package.json)
- [Git Hooks Documentation](./_core/hooks/)
- [Migration Reports](./_core/migration-report.json)

## 🎉 Benefits Achieved

✅ **Organization**: 135+ scripts organized into logical categories  
✅ **Automation**: Scripts run automatically on Git events  
✅ **Quality**: Pre-commit and pre-push quality gates  
✅ **Observability**: Comprehensive logging and metrics  
✅ **Reliability**: Dependency management and error handling  
✅ **Safety**: Non-destructive migration with rollback  
✅ **Maintainability**: Clear structure and documentation  
✅ **Developer Experience**: Simple commands for complex workflows  

This system transforms script management from **chaotic manual execution** to **world-class automated orchestration**! 🚀
