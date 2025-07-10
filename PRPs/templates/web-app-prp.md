# Product Requirements Prompt (PRP)
## Web Application Template

> This PRP is optimized for AI agents to implement features with sufficient context and self-validation capabilities to achieve working code through iterative refinement.

---

## 📋 PROJECT OVERVIEW

### Application Identity
```yaml
app_name: "[APPLICATION NAME]"
domain: "[DOMAIN/INDUSTRY]"
version: "1.0.0"
status: "In Development"

description: |
  [COMPREHENSIVE DESCRIPTION OF THE APPLICATION]
  [WHAT IT DOES, WHO IT'S FOR, CORE VALUE PROPOSITION]

tagline: "[SHORT, MEMORABLE DESCRIPTION]"
```

### Business Context
```yaml
problem_statement: |
  [WHAT PROBLEM DOES THIS SOLVE?]
  [WHY IS THIS NEEDED?]

target_users:
  primary:
    - demographic: "[AGE/PROFESSION/INTERESTS]"
    - needs: ["[NEED 1]", "[NEED 2]"]
    - pain_points: ["[PAIN 1]", "[PAIN 2]"]
  
  secondary:
    - demographic: "[DESCRIPTION]"
    - needs: []

market_opportunity: |
  [SIZE OF MARKET]
  [COMPETITIVE LANDSCAPE]
  [UNIQUE DIFFERENTIATORS]

success_metrics:
  - metric: "User Acquisition"
    target: "[NUMBER] users in [TIMEFRAME]"
  - metric: "User Engagement"
    target: "[SPECIFIC MEASUREMENT]"
  - metric: "Performance"
    target: "[LOAD TIME/RESPONSE TIME]"
```

---

## 🎯 FUNCTIONAL REQUIREMENTS

### Core Features
```yaml
feature_1:
  name: "[FEATURE NAME]"
  priority: "MUST HAVE"
  description: |
    [DETAILED DESCRIPTION]
  
  user_stories:
    - "As a [USER TYPE], I want to [ACTION] so that [BENEFIT]"
    - "As a [USER TYPE], I want to [ACTION] so that [BENEFIT]"
  
  acceptance_criteria:
    - "Given [CONTEXT], when [ACTION], then [RESULT]"
    - "The system should [BEHAVIOR]"
    - "Users must be able to [CAPABILITY]"
  
  technical_notes: |
    [IMPLEMENTATION CONSIDERATIONS]
    [API ENDPOINTS NEEDED]
    [DATA STRUCTURES]

feature_2:
  name: "[FEATURE NAME]"
  priority: "MUST HAVE"
  # ... similar structure
```

### User Flows
```yaml
primary_flow:
  name: "[MAIN USER JOURNEY]"
  steps:
    1: "User lands on [PAGE]"
    2: "User [ACTIONS]"
    3: "System [RESPONSE]"
    4: "User [NEXT ACTION]"
  
  success_outcome: "[WHAT SUCCESS LOOKS LIKE]"
  
  error_handling:
    - scenario: "[ERROR CASE]"
      response: "[HOW TO HANDLE]"
```

### Data Model
```yaml
entities:
  User:
    fields:
      - id: "uuid, primary key"
      - email: "string, unique, required"
      - password: "string, hashed, required"
      - profile: "relation to UserProfile"
    
    relations:
      - "has_many: Posts"
      - "has_one: UserProfile"
  
  # Additional entities...

api_endpoints:
  auth:
    - "POST /api/auth/register"
    - "POST /api/auth/login"
    - "POST /api/auth/logout"
    - "GET /api/auth/me"
  
  # Additional endpoints...
```

---

## 🛠️ TECHNICAL SPECIFICATIONS

### Technology Stack
```yaml
frontend:
  framework: "React 18 with TypeScript"
  styling: "Tailwind CSS v3"
  state_management: "Zustand"
  routing: "React Router v6"
  build_tool: "Vite"
  
  key_libraries:
    - "@tanstack/react-query: API state management"
    - "react-hook-form: Form handling"
    - "zod: Schema validation"
    - "framer-motion: Animations"

backend:
  runtime: "Node.js v18+"
  framework: "Express.js"
  language: "TypeScript"
  database: "PostgreSQL 15"
  orm: "Prisma"
  
  key_libraries:
    - "jsonwebtoken: Authentication"
    - "bcrypt: Password hashing"
    - "joi: Validation"
    - "winston: Logging"

infrastructure:
  hosting: "Vercel (frontend) + Railway (backend)"
  cdn: "Cloudflare"
  storage: "AWS S3"
  monitoring: "Sentry"
```

### Architecture Decisions
```yaml
patterns:
  - pattern: "Repository Pattern"
    rationale: "Abstraction over data access"
    implementation: "src/repositories/*"
  
  - pattern: "Service Layer"
    rationale: "Business logic separation"
    implementation: "src/services/*"
  
  - pattern: "DTO Pattern"
    rationale: "Data transfer objects for API"
    implementation: "src/dto/*"

conventions:
  naming:
    - "Components: PascalCase"
    - "Functions: camelCase"
    - "Constants: UPPER_SNAKE_CASE"
    - "Files: kebab-case"
  
  structure:
    - "Feature-based organization"
    - "Shared components in common/"
    - "Business logic in services/"
```

---

## 📁 PROJECT STRUCTURE

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── features/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   ├── public/
│   └── [config files]
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── types/
│   ├── prisma/
│   └── [config files]
│
├── shared/
│   └── types/
│
└── [root config files]
```

---

## 🚀 IMPLEMENTATION PLAN

### Phase 1: Foundation Setup
```yaml
tasks:
  - task: "Initialize project structure"
    subtasks:
      - "Set up monorepo with frontend/backend"
      - "Configure TypeScript"
      - "Set up linting and formatting"
      - "Initialize Git with .gitignore"
    
  - task: "Set up development environment"
    subtasks:
      - "Configure environment variables"
      - "Set up database connection"
      - "Configure build tools"
      - "Set up hot reloading"
    
  - task: "Implement base architecture"
    subtasks:
      - "Create folder structure"
      - "Set up routing"
      - "Implement error handling"
      - "Create base components"

validation_criteria:
  - "Project runs without errors"
  - "TypeScript compiles successfully"
  - "Linting passes"
  - "Basic routes accessible"
```

### Phase 2: Core Features
```yaml
tasks:
  - task: "Implement authentication"
    subtasks:
      - "Create auth endpoints"
      - "Implement JWT handling"
      - "Create login/register forms"
      - "Add auth middleware"
    
  - task: "Implement [CORE FEATURE 1]"
    # Detailed subtasks...

validation_criteria:
  - "All auth flows work"
  - "Tests pass with >80% coverage"
  - "No security vulnerabilities"
```

### Phase 3-5: [Additional phases...]

---

## ✅ VALIDATION & TESTING

### Test Strategy
```yaml
unit_tests:
  coverage_target: "80%"
  frameworks:
    frontend: "Vitest + React Testing Library"
    backend: "Jest + Supertest"
  
  focus_areas:
    - "Business logic"
    - "API endpoints"
    - "React components"
    - "Utility functions"

integration_tests:
  coverage_target: "60%"
  focus_areas:
    - "API workflows"
    - "Database operations"
    - "Auth flows"

e2e_tests:
  framework: "Playwright"
  critical_paths:
    - "User registration and login"
    - "Core feature workflows"
    - "Payment processing (if applicable)"
```

### Quality Gates
```yaml
pre_commit:
  - "Linting must pass"
  - "Type checking must pass"
  - "Unit tests must pass"

pre_deployment:
  - "All tests must pass"
  - "Build must succeed"
  - "No high/critical vulnerabilities"
  - "Performance benchmarks met"
```

---

## 🔄 ITERATIVE REFINEMENT LOOPS

### Self-Validation Protocol
After implementing each feature:

1. **Functional Validation**
   - Does it meet all acceptance criteria?
   - Are all user stories satisfied?
   - Is error handling comprehensive?

2. **Technical Validation**
   - Is the code clean and maintainable?
   - Are best practices followed?
   - Is it properly tested?

3. **Performance Validation**
   - Does it meet performance targets?
   - Is it optimized for production?
   - Are there any bottlenecks?

4. **Security Validation**
   - Are inputs validated?
   - Is authentication/authorization correct?
   - Are there any vulnerabilities?

### Iteration Triggers
- Test failures
- Performance issues
- Security vulnerabilities
- User feedback
- Code review findings

---

## 📊 MONITORING & ANALYTICS

```yaml
metrics_to_track:
  performance:
    - "Page load time"
    - "API response time"
    - "Time to interactive"
    - "Core Web Vitals"
  
  user_behavior:
    - "User flows"
    - "Feature usage"
    - "Error rates"
    - "Conversion funnels"
  
  system_health:
    - "Uptime"
    - "Error rates"
    - "Database performance"
    - "Memory usage"

tools:
  - "Google Analytics 4"
  - "Sentry for error tracking"
  - "Datadog for infrastructure"
```

---

## 🚢 DEPLOYMENT

```yaml
environments:
  development:
    url: "http://localhost:3000"
    database: "Local PostgreSQL"
    
  staging:
    url: "https://staging.app.com"
    database: "Staging DB"
    
  production:
    url: "https://app.com"
    database: "Production DB"

ci_cd:
  pipeline:
    - "Run tests"
    - "Build application"
    - "Run security scan"
    - "Deploy to staging"
    - "Run E2E tests"
    - "Deploy to production"
  
  rollback_strategy: |
    [AUTOMATED ROLLBACK PROCEDURE]
```

---

## 📝 DOCUMENTATION REQUIREMENTS

```yaml
required_docs:
  - README.md: "Project overview and setup"
  - API.md: "API endpoint documentation"
  - ARCHITECTURE.md: "System design and decisions"
  - DEPLOYMENT.md: "Deployment procedures"
  - CONTRIBUTING.md: "Development guidelines"

inline_documentation:
  - "JSDoc for all public functions"
  - "Type definitions for all data structures"
  - "Comments for complex logic"
```

---

## 🎯 SUCCESS CRITERIA

The project is considered complete when:
1. All MUST HAVE features are implemented
2. Test coverage exceeds 80%
3. Performance targets are met
4. Security scan shows no critical issues
5. Documentation is complete
6. Deployed to production successfully

---

*This PRP serves as the comprehensive context for AI-driven development. Update it as requirements evolve.*