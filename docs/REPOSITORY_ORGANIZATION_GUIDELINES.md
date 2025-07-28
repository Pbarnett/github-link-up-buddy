# Repository Organization Guidelines

**🎯 Purpose**: This document serves as the master reference for maintaining perfect organization in the `github-link-up-buddy` repository. Warp and all contributors must consult this document before creating new files or folders to ensure consistent structure.

---

## 📁 Directory Structure & File Placement Rules

### Root Directory (`/`)
**Contents**: Configuration files, essential documentation, and project metadata only
- `README.md` - Main project overview
- `package.json`, `package-lock.json` - Dependencies
- Configuration files: `.env*`, `tsconfig.json`, `vite.config.ts`, etc.
- Git files: `.gitignore`, `.github/`
- License and legal files

**Rule**: No source code, documentation, or scripts in root except essential project files.

### Source Code (`src/`)
**Purpose**: All application source code organized by feature/module
```
src/
├── components/          # Reusable UI components
├── pages/              # Route/page components
├── services/           # Business logic and API calls
├── utils/              # Helper functions and utilities
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── stores/             # State management (Redux, Zustand, etc.)
├── adapters/           # External service adapters
├── api/                # API route handlers
├── assets/             # Static assets (images, icons, etc.)
└── tests/              # Test files mirroring src structure
```

**Placement Rules**:
- New features go in appropriate subdirectory based on type
- Mirror directory structure in `src/tests/`
- Use kebab-case for all filenames
- Group related files in feature-specific subdirectories

### Tests (`tests/`)
**Purpose**: All test files organized by test type and component structure
```
tests/
├── unit/               # Unit tests mirroring src/ structure
├── integration/        # Integration tests
├── e2e/               # End-to-end tests
├── fixtures/          # Test data and mocks
├── utils/             # Testing utilities
└── setup/             # Test configuration and setup
```

**Placement Rules**:
- Unit tests must mirror `src/` directory structure exactly
- Integration tests grouped by feature or workflow
- E2E tests organized by user journey
- All test files end with `.test.ts` or `.spec.ts`

### Documentation (`docs/`)
**Purpose**: All project documentation organized by category and purpose
```
docs/
├── architecture/       # System design and architecture docs
├── user-profile/       # User profile feature documentation
├── LaunchDarkly Documentation/  # Feature flag documentation
├── research/          # Research documents and findings
├── development/       # Development guides and playbooks
├── deployment/        # Deployment and infrastructure docs
├── api/              # API documentation
└── guides/           # User guides and tutorials
```

**Placement Rules**:
- **Development docs**: `docs/development/` (playbooks, guides, standards)
- **Feature docs**: `docs/[feature-name]/` (user-profile, wallet, etc.)
- **Architecture docs**: `docs/architecture/` (system design, flows)
- **Research docs**: `docs/research/` (investigations, analysis)
- **API docs**: `docs/api/` (endpoints, schemas, examples)
- **Deployment docs**: `docs/deployment/` (infrastructure, CI/CD)

### Scripts (`scripts/`)
**Purpose**: Automation and utility scripts organized by function
```
scripts/
├── enforcement/       # Code quality and organization enforcement
├── analytics/         # Analytics and reporting scripts
├── deployment/        # Deployment and CI/CD scripts
├── database/          # Database migration and setup scripts
├── testing/           # Test runner and coverage scripts
├── performance/       # Performance monitoring scripts
└── utils/             # General utility scripts
```

**Placement Rules**:
- Group by primary function/purpose
- Use descriptive filenames with action verbs
- Include `.sh` extension for shell scripts
- Document usage in script comments

### Database (`database/`)
**Purpose**: Database-related files and migrations
```
database/
├── migrations/        # Database migration scripts
├── seeds/            # Database seed data
├── schemas/          # Database schema definitions
└── functions/        # Database functions and triggers
```

### Infrastructure (`infra/`)
**Purpose**: Infrastructure as code and deployment configurations
```
infra/
├── terraform/        # Terraform configurations
├── docker/           # Docker configurations
├── kubernetes/       # K8s manifests
└── monitoring/       # Monitoring configurations
```

---

## 🏷️ Naming Conventions

### Files
- **General rule**: Use kebab-case for all filenames
- **Examples**: `user-profile-service.ts`, `payment-flow.md`, `test-utils.ts`
- **Components**: PascalCase for React components: `UserProfile.tsx`
- **Tests**: End with `.test.ts` or `.spec.ts`

### Directories
- **General rule**: Use kebab-case for directory names
- **Examples**: `user-profile/`, `payment-gateway/`, `feature-flags/`
- **Exception**: Existing directories with different conventions (maintain consistency)

### Variables & Functions
- **Variables**: camelCase - `userProfile`, `isAuthenticated`
- **Functions**: camelCase - `calculateCompleteness()`, `validateProfile()`
- **Classes**: PascalCase - `UserProfileService`, `PaymentProcessor`
- **Constants**: UPPER_SNAKE_CASE - `API_BASE_URL`, `MAX_RETRY_COUNT`

---

## 📝 Documentation Standards

### Required Documentation for New Features
1. **README Updates**: Update main README.md with new feature overview
2. **Feature Documentation**: Create detailed docs in `docs/[feature-name]/`
3. **API Documentation**: Update API docs if endpoints are added
4. **Architecture Documentation**: Update architecture docs if system design changes

### Documentation File Types
- **Guides**: Step-by-step instructions (`SETUP_GUIDE.md`)
- **References**: Technical specifications (`API_REFERENCE.md`)
- **Playbooks**: Development workflows (`DEVELOPMENT_PLAYBOOK.md`)
- **Standards**: Guidelines and conventions (`CODING_STANDARDS.md`)

---

## 🚀 File Placement Decision Tree

### When Adding New Files, Ask:

1. **Is this source code?** → Place in `src/[appropriate-subdirectory]/`
2. **Is this a test?** → Place in `tests/[test-type]/[mirrored-src-structure]/`
3. **Is this documentation?** → Place in `docs/[category]/`
4. **Is this a script?** → Place in `scripts/[function]/`
5. **Is this a database file?** → Place in `database/[type]/`
6. **Is this infrastructure?** → Place in `infra/[tool]/`
7. **Is this a configuration file?** → Place in root `/` or appropriate config directory

### Quick Reference for Common Files:
- **New React component** → `src/components/`
- **New API endpoint** → `src/api/`
- **New service/business logic** → `src/services/`
- **New utility function** → `src/utils/`
- **New feature documentation** → `docs/[feature-name]/`
- **New test file** → `tests/unit/[mirrored-src-path]/`
- **New enforcement script** → `scripts/enforcement/`
- **New deployment script** → `scripts/deployment/`
- **New database migration** → `database/migrations/`

---

## 🔍 Warp Integration Instructions

### For Warp AI Assistant:
1. **Always consult this document** before creating new files or directories
2. **Follow the decision tree** to determine correct placement
3. **Use the naming conventions** specified in this document
4. **Update this document** if new patterns or directories are needed
5. **Maintain consistency** with existing structure

### File Creation Checklist:
- [ ] File placed in correct directory according to guidelines
- [ ] Filename follows naming conventions
- [ ] Related documentation updated if needed
- [ ] Tests created in mirrored structure if applicable
- [ ] README updated if feature-level change

---

## 📊 Maintenance & Updates

### Regular Reviews:
- **Monthly**: Review and update directory structure if needed
- **Per Feature**: Update guidelines when new patterns emerge
- **Per Release**: Ensure documentation reflects current state

### Guidelines Evolution:
- Update this document when new file types or patterns are introduced
- Maintain backward compatibility with existing structure
- Document any changes in git commit messages

---

## 📖 Quick Reference Summary

| File Type | Location | Naming | Example |
|-----------|----------|---------|---------|
| React Component | `src/components/` | PascalCase | `UserProfile.tsx` |
| Service Logic | `src/services/` | kebab-case | `user-profile-service.ts` |
| API Endpoint | `src/api/` | kebab-case | `user-profile-api.ts` |
| Unit Test | `tests/unit/[mirror-src]/` | kebab-case + `.test.ts` | `user-profile-service.test.ts` |
| Feature Docs | `docs/[feature]/` | UPPER_SNAKE_CASE | `USER_PROFILE_GUIDE.md` |
| Development Docs | `docs/development/` | UPPER_SNAKE_CASE | `DEVELOPMENT_PLAYBOOK.md` |
| Deployment Script | `scripts/deployment/` | kebab-case + `.sh` | `deploy-production.sh` |
| Database Migration | `database/migrations/` | timestamp + kebab-case | `20240101_add_user_profile.sql` |

---

**📌 Remember**: This document is the single source of truth for repository organization. When in doubt, refer to this guide and update it as the project evolves.
