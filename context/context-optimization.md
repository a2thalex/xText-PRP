# Context Window Optimization Guide
## Maximizing Efficiency in AI-Driven Development

Based on Andrej Karpathy's principle: "The delicate art and science of filling the context window with just the right information for the next step."

---

## 🧠 Context Window as RAM

### The LLM Operating System Metaphor
```
┌─────────────────────────────────────┐
│          LLM (CPU)                  │
│  ┌─────────────────────────────┐   │
│  │   Context Window (RAM)       │   │
│  │  ┌─────────────────────┐    │   │
│  │  │  Active Task Context │    │   │
│  │  ├─────────────────────┤    │   │
│  │  │  Relevant Code       │    │   │
│  │  ├─────────────────────┤    │   │
│  │  │  Project Structure   │    │   │
│  │  ├─────────────────────┤    │   │
│  │  │  Recent Decisions    │    │   │
│  │  └─────────────────────┘    │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
         ↓                ↑
    External Storage (Disk)
    - Full codebase
    - Documentation
    - Previous contexts
```

---

## 📊 Context Priority Levels

### Priority 1: Critical (Must Have)
```yaml
current_task:
  - Task description and requirements
  - Acceptance criteria
  - Direct dependencies
  - Error context (if debugging)

immediate_code_context:
  - File being modified
  - Interfaces it implements
  - Functions it calls
  - Data structures used
```

### Priority 2: Important (Should Have)
```yaml
project_context:
  - Technology stack decisions
  - Architectural patterns
  - Naming conventions
  - Project structure

related_code:
  - Parent components/classes
  - Sibling modules
  - Shared utilities
  - Type definitions
```

### Priority 3: Helpful (Nice to Have)
```yaml
historical_context:
  - Previous similar implementations
  - Past decisions and rationale
  - Common patterns in codebase
  - Team preferences

documentation:
  - API documentation
  - Library usage examples
  - Best practices
  - Comments and notes
```

---

## 🔄 Dynamic Context Management

### Context Loading Strategy
```typescript
class ContextManager {
  private maxTokens = 100000; // Example limit
  private usedTokens = 0;
  
  loadContext(task: Task): Context {
    const context = new Context();
    
    // Priority 1: Always load
    context.add(this.getTaskContext(task));
    context.add(this.getCurrentFileContext(task.file));
    
    // Priority 2: Load if space available
    if (this.hasSpace(30000)) {
      context.add(this.getProjectContext());
      context.add(this.getRelatedCode(task));
    }
    
    // Priority 3: Load if lots of space
    if (this.hasSpace(50000)) {
      context.add(this.getHistoricalContext(task));
      context.add(this.getDocumentation(task));
    }
    
    return context;
  }
  
  pruneContext(context: Context): Context {
    // Remove completed task details
    context.remove('completed_tasks');
    
    // Summarize long discussions
    context.summarize('previous_conversation');
    
    // Archive old code versions
    context.archive('superseded_code');
    
    return context;
  }
}
```

---

## 📋 Context Templates by Task Type

### Feature Implementation Context
```yaml
context_structure:
  task_definition:
    - User story
    - Acceptance criteria
    - Technical requirements
  
  code_context:
    - Feature directory structure
    - API endpoints involved
    - Database schema
    - Frontend components
  
  patterns:
    - Similar features in codebase
    - Established patterns
    - Style guidelines
```

### Bug Fixing Context
```yaml
context_structure:
  error_information:
    - Error message
    - Stack trace
    - Steps to reproduce
    - Expected vs actual behavior
  
  debugging_context:
    - Relevant code sections
    - Recent changes
    - Related test cases
    - System state
  
  investigation:
    - Similar past issues
    - Potential causes
    - Debugging strategies
```

### Refactoring Context
```yaml
context_structure:
  current_state:
    - Code to refactor
    - Dependencies
    - Test coverage
    - Performance metrics
  
  target_state:
    - Desired structure
    - New patterns
    - Migration strategy
    - Rollback plan
  
  constraints:
    - Backward compatibility
    - Performance requirements
    - Time limitations
```

---

## 🎯 Context Optimization Strategies

### 1. Just-In-Time Loading
```typescript
// Load context only when needed
async function implementFeature(feature: Feature) {
  // Start with minimal context
  let context = await loadCoreContext(feature);
  
  // Load additional context as needed
  if (feature.requiresAuth) {
    context = await addAuthContext(context);
  }
  
  if (feature.requiresDatabase) {
    context = await addDatabaseContext(context);
  }
  
  return context;
}
```

### 2. Context Compression
```typescript
// Summarize verbose content
function compressContext(context: string): string {
  // Extract key information
  const compressed = {
    decisions: extractDecisions(context),
    codeChanges: summarizeChanges(context),
    nextSteps: identifyNextSteps(context)
  };
  
  return formatCompressed(compressed);
}
```

### 3. Context Caching
```typescript
// Cache frequently used context
class ContextCache {
  private cache = new Map<string, Context>();
  
  get(key: string): Context | null {
    const cached = this.cache.get(key);
    if (cached && !this.isStale(cached)) {
      return cached;
    }
    return null;
  }
  
  set(key: string, context: Context): void {
    this.cache.set(key, {
      ...context,
      timestamp: Date.now()
    });
  }
}
```

---

## 📊 Context Window Budget

### Token Allocation Guide
```yaml
token_budget: 100000  # Example

allocation:
  system_prompt: 5000      # 5%
  task_context: 10000      # 10%
  code_context: 40000      # 40%
  project_info: 20000      # 20%
  examples: 15000          # 15%
  buffer: 10000            # 10%

rules:
  - Never exceed 90% capacity
  - Keep 10% buffer for output
  - Prioritize recent/relevant
  - Summarize when possible
```

### Context Size Monitoring
```typescript
function monitorContextSize(context: Context): ContextMetrics {
  return {
    totalTokens: countTokens(context),
    breakdown: {
      code: countTokens(context.code),
      docs: countTokens(context.docs),
      conversation: countTokens(context.chat)
    },
    efficiency: calculateEfficiency(context),
    recommendations: suggestOptimizations(context)
  };
}
```

---

## 🔧 Practical Implementation

### Context Window Manager Script
```typescript
// context-manager.ts
export class AppBuilderContextManager {
  private phases = ['init', 'planning', 'implementation', 'testing', 'deployment'];
  private currentPhase = 0;
  
  getContextForPhase(): Context {
    const phase = this.phases[this.currentPhase];
    
    switch(phase) {
      case 'init':
        return this.loadInitContext();
      case 'planning':
        return this.loadPlanningContext();
      case 'implementation':
        return this.loadImplementationContext();
      case 'testing':
        return this.loadTestingContext();
      case 'deployment':
        return this.loadDeploymentContext();
    }
  }
  
  private loadInitContext(): Context {
    return {
      templates: ['INITIAL.md'],
      examples: ['similar-projects'],
      focus: 'requirements-gathering'
    };
  }
  
  private loadImplementationContext(): Context {
    return {
      currentCode: true,
      testCases: true,
      apiDocs: true,
      previousImplementations: false, // Save space
      detailedHistory: false // Save space
    };
  }
}
```

---

## 📈 Performance Patterns

### Efficient Context Queries
```typescript
// Bad: Loading everything
const context = await loadAllProjectFiles();

// Good: Loading what's needed
const context = await loadContext({
  files: ['src/feature.ts', 'src/feature.]test.ts'],
  patterns: ['similar-features/*.ts'],
  docs: ['API.md#feature-section']
});
```

### Context Reuse
```typescript
// Store context between related tasks
class ContextSession {
  private sessionContext: Context;
  
  async executeTaskSeries(tasks: Task[]) {
    // Load base context once
    this.sessionContext = await loadBaseContext();
    
    for (const task of tasks) {
      // Add task-specific context
      const taskContext = {
        ...this.sessionContext,
        ...await loadTaskContext(task)
      };
      
      await executeTask(task, taskContext);
      
      // Update session context with results
      this.updateSessionContext(task.results);
    }
  }
}
```

---

## 🎯 Context Quality Metrics

### Measuring Context Effectiveness
```yaml
metrics:
  relevance_score:
    description: "How relevant is the loaded context"
    calculation: "relevant_tokens / total_tokens"
    target: "> 0.8"
  
  completeness_score:
    description: "Does context have all needed info"
    calculation: "provided_requirements / total_requirements"
    target: "1.0"
  
  efficiency_score:
    description: "How efficiently context is used"
    calculation: "used_context / loaded_context"
    target: "> 0.7"
  
  freshness_score:
    description: "How up-to-date is the context"
    calculation: "recent_updates / total_items"
    target: "> 0.9"
```

---

## 💡 Best Practices

### DO:
- ✅ Load context progressively
- ✅ Prioritize recent and relevant information
- ✅ Summarize completed work
- ✅ Cache frequently used context
- ✅ Monitor token usage
- ✅ Prune obsolete information

### DON'T:
- ❌ Load entire codebase at once
- ❌ Keep outdated context
- ❌ Duplicate information
- ❌ Load unrelated documentation
- ❌ Exceed 90% of context window
- ❌ Forget to leave space for output

---

## 🔄 Context Lifecycle

### 1. Initial Load
```
Gather requirements → Load templates → Set up structure
```

### 2. Active Development
```
Load current task → Add relevant code → Include dependencies
```

### 3. Context Evolution
```
Complete task → Summarize results → Archive details → Load next
```

### 4. Session Cleanup
```
Extract decisions → Update PRP → Clear working memory → Save state
```

---

*Optimizing context is key to effective AI-driven development. Use these patterns to maximize Claude Code's capabilities while maintaining efficiency.*