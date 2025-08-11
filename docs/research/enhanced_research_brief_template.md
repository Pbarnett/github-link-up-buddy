# Enhanced Research Brief Template: [PROBLEM TITLE]

## 1. Executive Summary

[Brief description of the problem, tech stack, and critical issue. Include impact and urgency.]

**Critical Issue**: [One-sentence description of the core problem]

## 2. Current Status Analysis

### ✅ Working Components:
- [List of functioning aspects]

### ❌ Failing Components:
- [List of broken/failing aspects]

### Core Problem Indicators:
- [Specific symptoms and error patterns observed]

## 3. Complete Code Context

### 3.1 Primary Component/File
```[language]
[Complete relevant code - include full implementations, not snippets]
[CRITICAL: Include ALL imports, exports, type definitions, and complete function implementations]
[Include file paths and directory structure context]
```

### 3.2 Related Dependencies/Components
```[language]
[Any related code that interacts with the primary component]
[Include utility functions, custom hooks, context providers]
[Show complete integration patterns and data flow]
```

### 3.3 Configuration Files
```[language]
[Complete config files - package.json, tsconfig.json, vite.config.ts, etc.]
[Include build scripts, compiler options, module resolution settings]
[Show complete dependency tree with exact versions]
```

### 3.4 Test Cases (Failing Examples)
```[language]
[Complete test files - include setup, mocks, and all test utilities]
[Show BOTH failing tests AND any passing tests for comparison]
[Include test runner configuration and setup files]
[Provide exact error messages and stack traces]
```

### 3.5 File Structure & Organization
```
[Show relevant directory structure]
src/
  components/
    [component-name]/
      index.ts
      Component.tsx
      Component.test.tsx
  utils/
  types/
[Include relative import paths and module organization]
```

### 3.6 Integration Points
```[language]
[Show how this component integrates with:
- Parent components
- State management (Redux, Zustand, Context)
- API calls and data fetching
- Routing and navigation
- External libraries]
```

## 4. Technical Environment Details

### 4.1 Tech Stack & Versions
- **Framework**: [Framework + version]
- **Language**: [Language + version]
- **Key Libraries**: [Library + version for each]
- **Build Tools**: [Build tools + versions]
- **Testing**: [Testing framework + version]

### 4.2 Package Dependencies
```json
{
  "dependencies": {
    "[library]": "[version]"
  },
  "devDependencies": {
    "[library]": "[version]"
  }
}
```

### 4.3 System Environment
- **Operating System**: [OS details]
- **Node.js Version**: [Version]
- **Package Manager**: [npm/yarn/pnpm + version]
- **IDE/Editor**: [If relevant to the problem]

## 5. Detailed Problem Analysis

### 5.1 Architecture Overview
[Explain how the components interact, data flow, and architectural patterns]

### 5.2 Integration Surface Issues
[Identify potential integration points where failures might occur]

### 5.3 Error Patterns & Stack Traces
```
[Complete error messages and stack traces - include ALL variations]
[Browser console errors, terminal build errors, test runner errors]
[Network errors, runtime errors, compilation errors]
[Include timestamps, file paths, and line numbers from errors]
```

### 5.4 Browser/Runtime Environment
- **Browser**: [Chrome/Firefox/Safari + version]
- **Development Tools**: [DevTools network/console output]
- **Build Output**: [Complete build logs and warnings]
- **Runtime Behavior**: [What happens vs what should happen]

### 5.5 Debugging Steps Already Taken
- [List of debugging approaches already attempted]
- [Results of each debugging attempt]
- [Code changes tried that didn't work]
- [Alternative libraries or approaches tested]
- [Performance profiling results if applicable]

## 6. Business Context & Constraints

### 6.1 Business Requirements
- [What the component/feature needs to accomplish]
- [User experience expectations]
- [Performance requirements]

### 6.2 Technical Constraints
- [Technology limitations]
- [Performance constraints]
- [Compatibility requirements]

### 6.3 Timeline & Resource Constraints
- [Implementation timeline]
- [Team size and expertise]
- [Budget/resource limitations]

## 7. Research Goals & Questions

### 7.1 Primary Investigation Areas
1. **[Category 1]**
   - [Specific question]
   - [What needs to be researched]

2. **[Category 2]**
   - [Specific question]
   - [What needs to be researched]

### 7.2 Critical Research Questions
1. **[Question 1]**: [Detailed question about root cause]
2. **[Question 2]**: [Question about implementation approach]
3. **[Question 3]**: [Question about best practices]

### 7.3 Secondary Investigation Areas
- [Additional areas to research if primary goals are met]

## 8. Success Criteria & Deliverables

### 8.1 Primary Success Criteria
- [Measurable criteria for success]
- [How to verify the solution works]

### 8.2 Research Deliverables
1. **Root Cause Analysis** - [What needs to be identified]
2. **Solution Implementation** - [What code/changes needed]
3. **Best Practices Guide** - [Documentation needed]
4. **Testing Strategy** - [How to verify and prevent regression]

### 8.3 Validation Matrix
| Test Scenario | Expected Behavior | Current Status |
|---------------|-------------------|----------------|
| [Scenario 1] | [Expected] | [Current result] |
| [Scenario 2] | [Expected] | [Current result] |

## 9. Similar Cases & Prior Art

### 9.1 Known Similar Issues
- [References to similar problems in the community]
- [Stack Overflow questions or GitHub issues]

### 9.2 Related Documentation
- [Official documentation links]
- [Relevant blog posts or articles]

### 9.3 Community Solutions
- [Known workarounds or solutions from community]

## 10. Investigation Methodology

### 10.1 Recommended Research Approach
1. **Phase 1**: [First investigation phase]
2. **Phase 2**: [Second investigation phase]
3. **Phase 3**: [Third investigation phase]

### 10.2 Testing Strategy
- [How to test proposed solutions]
- [Validation criteria for each test]

### 10.3 Fallback Plans
- [Alternative approaches if primary solution fails]
- [Workarounds that could be implemented]

## 11. Additional Context for External LLM

### 11.1 Domain-Specific Knowledge Required
- [Industry-specific concepts the LLM should understand]
- [Technical patterns specific to this domain]
- [Business logic and user workflow context]
- [Data models and entity relationships]

### 11.2 Alternative Approaches to Consider
- [Different technical approaches that might solve the problem]
- [Trade-offs between different solutions]
- [Migration paths from current implementation]
- [Incremental vs complete rewrite options]

### 11.3 Integration Considerations
- [How the solution needs to integrate with existing systems]
- [Backward compatibility requirements]
- [API contracts and data formats]
- [Third-party service dependencies]

### 11.4 Scalability & Maintenance
- [Long-term maintenance considerations]
- [Scalability requirements]
- [Team knowledge transfer needs]
- [Documentation and onboarding requirements]

### 11.5 Critical Missing Information for LLM
**If any of the following are missing, the research quality will be significantly impacted:**

#### Code Completeness
- [ ] All imports and dependencies are shown
- [ ] Complete type definitions and interfaces
- [ ] Full component lifecycle and hooks usage
- [ ] Exact file paths and directory structure
- [ ] All related utility functions and helpers

#### Error Context
- [ ] Complete error messages (not truncated)
- [ ] Full stack traces with line numbers
- [ ] Browser console output
- [ ] Network tab errors (if applicable)
- [ ] Build/compilation errors

#### Environment Details
- [ ] Exact package versions (not just major versions)
- [ ] Node.js and npm/yarn versions
- [ ] Operating system details
- [ ] IDE/editor specific configurations
- [ ] Build tool configurations

#### Testing Context
- [ ] Complete test setup and configuration
- [ ] Mock implementations and test utilities
- [ ] Both passing and failing test examples
- [ ] Test runner output and error messages
- [ ] Coverage reports (if relevant)

#### Data Flow & State
- [ ] How data flows through the application
- [ ] State management patterns in use
- [ ] Props and callback interfaces
- [ ] API response/request formats
- [ ] Database schema (if relevant)

### 11.6 Research Quality Indicators
**The LLM research will be most effective when:**
- Complete working examples can be compared with broken ones
- The exact technical stack versions are known
- Error messages include full stack traces
- The business context and user impact are clear
- Alternative approaches and constraints are documented

### 11.7 Red Flags for Incomplete Prompts
**Research quality will suffer if:**
- Code snippets are truncated with "..." or similar
- Error messages are paraphrased instead of copied exactly
- Package versions are vague ("latest", "^1.0.0" without specifics)
- Only failing tests are shown without working examples
- File structure and import paths are unclear
- Business requirements are vague or missing

## 12. Expected Research Outcomes

### 12.1 Technical Solutions
- **Immediate Fix**: [What needs to be implemented now]
- **Best Practices**: [Patterns to follow going forward]
- **Performance Optimizations**: [How to optimize the solution]

### 12.2 Process Improvements
- **Prevention Strategy**: [How to prevent similar issues]
- **Testing Improvements**: [Better testing approaches]
- **Code Review Guidelines**: [What to look for in reviews]

### 12.3 Knowledge Transfer
- **Documentation Updates**: [What documentation needs updating]
- **Team Training**: [What the team needs to learn]
- **Tools and Automation**: [Tools that could help prevent issues]

---

**Note for LLM Researcher**: This brief provides comprehensive context to enable thorough investigation and solution development without access to the actual codebase. All code examples, error messages, and technical details are included to ensure you have complete information for effective research.

## 13. Research Validation Checklist

### 13.1 Pre-Research Validation
**Before sending to external LLM, verify this prompt includes:**

#### Essential Code Context
- [ ] Complete, untruncated code files
- [ ] All imports, types, and dependencies
- [ ] Exact file paths and directory structure
- [ ] Full test files (both passing and failing)
- [ ] Complete configuration files

#### Complete Error Information
- [ ] Full error messages (copy-pasted, not paraphrased)
- [ ] Complete stack traces with line numbers
- [ ] Browser console output
- [ ] Build/compilation errors
- [ ] Network errors (if applicable)

#### Technical Environment
- [ ] Exact package versions (not ranges)
- [ ] Node.js, npm/yarn versions
- [ ] Operating system details
- [ ] Browser versions
- [ ] Build tool configurations

#### Business Context
- [ ] Clear problem statement
- [ ] User impact description
- [ ] Success criteria
- [ ] Timeline and resource constraints
- [ ] Integration requirements

### 13.2 Post-Research Validation
**Before accepting research findings, verify:**

#### Solution Quality
- [ ] Root cause is clearly identified with technical explanation
- [ ] Proposed solution includes complete, working code
- [ ] Solution addresses all failing test cases
- [ ] Code follows existing patterns and conventions
- [ ] Performance implications are considered

#### Implementation Readiness
- [ ] Implementation steps are clear and actionable
- [ ] Dependencies and prerequisites are identified
- [ ] Potential risks and mitigation strategies are outlined
- [ ] Rollback plan is provided
- [ ] Testing strategy for validation is included

#### Documentation & Knowledge Transfer
- [ ] Best practices and alternative approaches are documented
- [ ] Long-term maintenance considerations are addressed
- [ ] Team knowledge transfer needs are identified
- [ ] Prevention strategies for similar issues are provided

### 13.3 Research Effectiveness Framework

#### High-Quality Research Indicators
- Provides multiple solution approaches with trade-offs
- Includes working code examples that can be directly implemented
- References official documentation and community best practices
- Considers edge cases and error scenarios
- Addresses both immediate fix and long-term architecture

#### Low-Quality Research Warning Signs
- Vague or generic solutions without specific code
- Only addresses symptoms, not root causes
- Ignores existing constraints or requirements
- No consideration of side effects or integration issues
- Missing testing or validation strategies

---

**CRITICAL**: An external LLM without codebase access can only be as effective as the information provided. Incomplete prompts will inevitably lead to incomplete or incorrect solutions. Invest time in creating comprehensive prompts to get high-quality research outcomes.
