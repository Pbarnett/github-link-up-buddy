# Warp Workflow Setup Complete ✅

## Daily Usage

### Context Refresh (Start of every new Warp session)
```
Context refresh (2025-07-12):
Authoritative file list is .warp_file_overview.txt.  
• Never recreate files listed there.
```

### After pulls, merges, or refactors
```bash
npm run warp-refresh
git add .warp_file_overview.txt
git commit -m "chore: warp manifest (2025-07-12)"
```

## What's Been Set Up

### ✅ File Overview System
- **Script**: `npm run warp-refresh` generates `.warp_file_overview.txt`
- **Purpose**: Authoritative file list for Warp and teammates
- **Location**: `.warp_file_overview.txt` (version controlled)

### ✅ Import Validation
- **ESLint Plugin**: `eslint-plugin-import` installed
- **Rule**: `import/no-unresolved` catches phantom imports
- **Config**: `.eslintrc.json` with import validation

### ✅ Path Aliases (Unambiguous)
- **TypeScript**: Enhanced `tsconfig.json` with specific aliases
- **Vite**: Matching `vite.config.ts` aliases
- **Aliases**:
  - `@/*` → `src/*`
  - `@/services/*` → `src/services/*`
  - `@/components/*` → `src/components/*`
  - `@/hooks/*` → `src/hooks/*`
  - `@/contexts/*` → `src/contexts/*`
  - `@/types/*` → `src/types/*`
  - `@/utils/*` → `src/utils/*`

### ✅ Documentation
- **Overview**: `docs/repo_overview.md` with naming conventions
- **Naming Patterns**:
  - `use*` = React hook
  - `*Service` = Network API wrapper
  - `*.edge.ts` = Edge-function client
  - `*Form.tsx` = Form components
  - `*Context.tsx` = React context providers

### ✅ Barrel Files
- **Services API**: `src/services/api/index.ts`
- **Services**: `src/services/index.ts`
- **Purpose**: Clean imports like `@/services/api`

## Task Template

When starting any task, use this template:

```
[Your task description here]

Sanity-check:
1. List the exact paths you'll touch.
2. `test -f <path>` each one.
3. If any path is missing, STOP and ask me.
```

## Key Benefits

1. **No Phantom Files**: ESLint catches unresolved imports
2. **Consistent Paths**: Aliases eliminate path ambiguity
3. **Shared Context**: Team uses same file manifest
4. **Clear Naming**: Conventions documented for AI assistance
5. **Organized Imports**: Barrel files for cleaner code structure

## Next Steps

- Use the context refresh message at the start of each Warp session
- Run `npm run warp-refresh` after any significant file changes
- Follow the sanity-check pattern for complex tasks
- Keep documentation updated as the codebase evolves
