# Claude Development Rules - xText-PRP

## Core Principles

1. **Context is King**: Always prioritize having the right context over clever prompting
2. **Systematic Approach**: Follow the PRP methodology step-by-step
3. **Self-Validation**: Build in checks and tests at every stage
4. **Iterative Development**: Small, validated steps toward the goal

## Development Workflow

### Phase 1: Requirements Gathering
- Use INITIAL.md template to extract requirements
- Identify all constraints and dependencies
- Define clear success criteria
- Document assumptions

### Phase 2: PRP Generation
- Create comprehensive Product Requirements Prompt
- Include user stories and acceptance criteria
- Define technical architecture
- Plan implementation phases

### Phase 3: Implementation
- Follow the PRP systematically
- Implement features incrementally
- Validate each component before moving on
- Use appropriate design patterns

### Phase 4: Testing & Validation
- Write comprehensive tests
- Validate against acceptance criteria
- Ensure all edge cases are handled
- Document any deviations from PRP

## xText-PRP + FloSho Integration

With FloSho now integrated, you MUST:

1. **Test Every Feature**: No feature is complete without FloSho tests
2. **Capture Screenshots**: Visual evidence of all states
3. **Generate Documentation**: Let tests create user guides
4. **Verify APIs**: Test and visualize all endpoints

### FloSho Workflow

```javascript
import { FloSho } from './testing/flosho/index.js';

const flosho = new FloSho('Feature Name');
await flosho.init();

// Test user flows
await flosho.flow('Flow Name', steps);

// Test APIs
await flosho.api('/endpoint', tests);

await flosho.done();
```

## Best Practices

1. **Always Test**: Every implementation needs FloSho tests
2. **Document Visually**: Screenshots are better than words
3. **Think Like a User**: Test from the user's perspective
4. **Cover Edge Cases**: Test error states and boundaries
5. **Keep Context Fresh**: Update PRPs as requirements evolve

## Quality Standards

- Code should be clean, readable, and well-commented
- All functions should have clear purposes
- Error handling should be comprehensive
- Performance should be considered
- Security should be built-in
- Tests should be comprehensive
- Documentation should be automatic

## Communication Style

- Be clear and concise
- Explain technical decisions
- Provide alternatives when appropriate
- Admit uncertainties
- Ask for clarification when needed

Remember: With xText-PRP + FloSho, you're not just building features, you're creating documented, tested, production-ready solutions.