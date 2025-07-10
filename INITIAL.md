# Project Initialization Template
## Context Engineering Entry Point
## Created by Gregory Reeves, Inkwell Technology Studios

When Claude Code receives a request to build an app, use this template to gather comprehensive context and generate a Product Requirements Prompt (PRP).

---

## 🎯 PROJECT VISION

### Basic Information
```yaml
project:
  name: "[TO BE DETERMINED]"
  type: "[web|mobile|desktop|api|cli|library]"
  description: |
    [USER'S DESCRIPTION]
  
  primary_goal: |
    [EXTRACT FROM USER INPUT]
  
  success_metrics:
    - [METRIC 1]
    - [METRIC 2]
    - [METRIC 3]
```

### User Context
```yaml
user_profile:
  technical_level: "[beginner|intermediate|advanced]"
  preferences:
    - programming_languages: []
    - frameworks: []
    - deployment_targets: []
  
  constraints:
    - time: "[deadline or timeframe]"
    - budget: "[if mentioned]"
    - technical: "[any limitations]"
    - regulatory: "[compliance needs]"
```

---

## 🔍 REQUIREMENTS EXTRACTION

### Feature Analysis (MoSCoW)
```yaml
must_have:
  - feature: "[FEATURE]"
    user_story: "As a [USER], I want [FEATURE] so that [BENEFIT]"
    acceptance_criteria:
      - "[CRITERIA 1]"
      - "[CRITERIA 2]"
    priority: 1

should_have:
  - feature: "[FEATURE]"
    user_story: "[USER STORY]"
    acceptance_criteria: []
    priority: 2

could_have:
  - feature: "[FEATURE]"
    user_story: "[USER STORY]"
    acceptance_criteria: []
    priority: 3

wont_have:
  - "[EXPLICITLY EXCLUDED FEATURE]"
  - "[OUT OF SCOPE ITEM]"
```

### Non-Functional Requirements
```yaml
performance:
  - response_time: "[TARGET]"
  - concurrent_users: "[NUMBER]"
  - data_volume: "[SIZE]"

security:
  - authentication: "[METHOD]"
  - authorization: "[RBAC/ABAC/etc]"
  - data_protection: "[ENCRYPTION/etc]"

usability:
  - accessibility: "[WCAG LEVEL]"
  - browser_support: []
  - mobile_responsiveness: "[YES/NO]"

scalability:
  - initial_users: "[NUMBER]"
  - growth_projection: "[TIMELINE]"
  - infrastructure: "[CLOUD/ON-PREMISE]"
```

---

## 🏗️ TECHNICAL DECISIONS

### Technology Stack Selection
```yaml
evaluation_matrix:
  criteria:
    - fit_for_purpose: weight: 30
    - performance: weight: 20
    - scalability: weight: 20
    - maintainability: weight: 15
    - community_support: weight: 10
    - learning_curve: weight: 5

frontend:
  options:
    - name: "[FRAMEWORK]"
      scores: {}
      rationale: "[WHY]"
  
  selected: "[CHOSEN FRAMEWORK]"
  justification: "[DETAILED REASONING]"

backend:
  options: []
  selected: "[CHOSEN STACK]"
  justification: "[REASONING]"

database:
  options: []
  selected: "[CHOSEN DB]"
  justification: "[REASONING]"

infrastructure:
  hosting: "[PLATFORM]"
  ci_cd: "[TOOLS]"
  monitoring: "[SERVICES]"
```

### Architecture Pattern
```yaml
pattern: "[MVC|MVVM|Microservices|Serverless|etc]"
rationale: |
  [WHY THIS PATTERN FITS]

components:
  - name: "[COMPONENT]"
    responsibility: "[WHAT IT DOES]"
    interfaces: []
    dependencies: []
```

---

## 📐 PROJECT STRUCTURE

### Directory Layout
```
project-root/
├── .claude/                 # AI context
├── src/
│   ├── [STRUCTURE BASED ON STACK]
├── tests/
├── docs/
├── scripts/
└── [ADDITIONAL DIRS]
```

### Development Workflow
```yaml
git_workflow:
  branching_strategy: "[git-flow|github-flow|custom]"
  commit_conventions: "[conventional|custom]"
  pr_process: "[DESCRIPTION]"

quality_gates:
  - linting: "[TOOLS]"
  - testing: "[FRAMEWORK]"
  - coverage: "[MINIMUM %]"
  - security_scan: "[TOOLS]"
```

---

## 🚀 IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1)
- [ ] Project setup and configuration
- [ ] Development environment
- [ ] Basic CI/CD pipeline
- [ ] Core dependencies

### Phase 2: Core Features (Week 2-3)
- [ ] [FEATURE 1]
- [ ] [FEATURE 2]
- [ ] [FEATURE 3]

### Phase 3: Integration (Week 4)
- [ ] API integration
- [ ] Database connectivity
- [ ] Authentication system

### Phase 4: Polish (Week 5)
- [ ] UI/UX refinement
- [ ] Performance optimization
- [ ] Error handling
- [ ] Documentation

### Phase 5: Deployment (Week 6)
- [ ] Production configuration
- [ ] Deployment pipeline
- [ ] Monitoring setup
- [ ] Launch preparation

---

## ✅ VALIDATION CHECKPOINTS

### After Each Phase
```yaml
validation:
  code_quality:
    - linting_passes: true
    - no_type_errors: true
    - test_coverage: ">80%"
  
  functionality:
    - all_tests_pass: true
    - manual_testing_complete: true
    - user_acceptance: true
  
  performance:
    - load_time: "<2s"
    - api_response: "<200ms"
    - memory_usage: "optimal"
```

---

## 🎬 NEXT STEPS

1. **Generate PRP**: Create comprehensive Product Requirements Prompt
2. **Validate Understanding**: Confirm interpretation with user
3. **Begin Implementation**: Start with Phase 1
4. **Iterate**: Use validation checkpoints to ensure quality

---

## 📝 NOTES FOR CLAUDE CODE

When processing this template:
1. Extract all possible information from user input
2. Make reasonable assumptions where needed
3. Ask for clarification on critical decisions
4. Generate a comprehensive PRP before starting
5. Follow the implementation roadmap systematically
6. Validate at each checkpoint
7. Maintain context continuity throughout

Remember: "The delicate art and science of filling the context window with just the right information for the next step."