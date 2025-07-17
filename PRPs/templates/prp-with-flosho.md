# Product Requirements Prompt Template with FloSho Testing

## Project Overview
- **Name**: [Project Name]
- **Description**: [Brief description]
- **Target Users**: [Who will use this]
- **Key Features**: [Main functionality]

## Implementation Requirements

### Feature 1: [Feature Name]

#### Requirements
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

#### FloSho Test Scenarios

```javascript
// Required test coverage
await flosho.flow('[Feature Name] - Happy Path', [
  { action: 'navigate', url: '/feature', description: 'Navigate to feature' },
  { action: 'click', selector: '#start', description: 'Start the process' },
  { action: 'fill', selector: '#input', value: 'test data', description: 'Enter data' },
  { action: 'screenshot', name: 'feature-complete', description: 'Feature completed' }
]);

await flosho.flow('[Feature Name] - Error Handling', [
  { action: 'navigate', url: '/feature', description: 'Navigate to feature' },
  { action: 'click', selector: '#start', description: 'Start without data' },
  { action: 'wait', selector: '.error', description: 'Wait for error message' },
  { action: 'screenshot', name: 'error-state', description: 'Error state shown' }
]);
```

#### Documentation Requirements
- User flow screenshots
- Error state documentation
- API endpoint visualization
- Success criteria evidence

### Feature 2: [Feature Name]

[Repeat structure...]

## Technical Specifications

### Frontend Requirements
- Framework: [React/Vue/etc]
- Testing: FloSho visual testing
- Documentation: Auto-generated from tests

### Backend Requirements
- API Framework: [Express/FastAPI/etc]
- Testing: FloSho API visualization
- Documentation: Visual API docs

## Acceptance Criteria

1. **Functional Requirements**
   - [ ] All features implemented
   - [ ] Error handling in place
   - [ ] Performance targets met

2. **FloSho Testing Requirements**
   - [ ] All user flows tested with screenshots
   - [ ] API endpoints visually documented
   - [ ] Error states captured
   - [ ] Documentation generated

3. **Documentation Deliverables**
   - [ ] User manual with screenshots
   - [ ] API reference with examples
   - [ ] Video walkthroughs
   - [ ] Quick start guide

## Definition of Done

✅ Code complete
✅ FloSho tests passing
✅ Screenshots captured
✅ Documentation generated
✅ Reviewed and approved

## Example Test Implementation

```javascript
// Complete test file example
import { FloSho } from '../testing/flosho';

async function testFeature() {
  const flosho = new FloSho('Feature Name');
  await flosho.init();
  
  // Test all user flows
  await flosho.flow('Complete User Journey', [
    // ... test steps
  ]);
  
  // Test all APIs
  await flosho.api('/api/feature', [
    // ... API tests
  ]);
  
  await flosho.done();
}

testFeature();
```

---

*This PRP template includes FloSho visual testing requirements to ensure every feature is properly tested and documented.*