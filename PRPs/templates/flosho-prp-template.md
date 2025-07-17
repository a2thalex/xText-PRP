# PRP Template with FloSho Testing

## Feature: [Feature Name]

### Overview
[Brief description of the feature]

### Requirements
1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]

### User Stories
- As a [user type], I want to [action] so that [benefit]
- As a [user type], I want to [action] so that [benefit]

### FloSho Test Scenarios

#### Scenario 1: Happy Path
```javascript
await flosho.flow('Happy Path - [Feature]', [
  // Test steps here
]);
```

#### Scenario 2: Error States
```javascript
await flosho.flow('Error Handling - [Feature]', [
  // Error test steps
]);
```

#### Scenario 3: Edge Cases
```javascript
await flosho.flow('Edge Cases - [Feature]', [
  // Edge case test steps
]);
```

### API Tests (if applicable)
```javascript
await flosho.api('/api/endpoint', [
  // API test cases
]);
```

### Acceptance Criteria
- [ ] All user stories implemented
- [ ] FloSho tests passing
- [ ] Screenshots captured for all states
- [ ] User documentation generated
- [ ] API documentation complete
- [ ] Error states handled

### Definition of Done
1. Code implemented
2. FloSho tests written and passing
3. Documentation auto-generated
4. Screenshots verify functionality
5. PR approved

### FloSho Output
After implementation, verify:
- `testing/flosho-docs/user-manual/[feature].md` exists
- Screenshots in `testing/flosho-docs/screenshots/`
- All test scenarios covered