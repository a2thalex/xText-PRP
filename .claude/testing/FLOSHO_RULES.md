# FloSho Testing Requirements

## What is FloSho?

FloSho (Flow + Show) is our integrated visual testing framework that automatically:
- Captures screenshots at every step
- Generates user documentation
- Creates visual API documentation
- Produces test reports with evidence

## Mandatory Testing Protocol

### 1. Frontend Testing
```javascript
await flosho.flow('Feature Name', [
  { action: 'navigate', url: '/', description: 'Start at homepage' },
  { action: 'click', selector: '#button', description: 'Click action button' },
  { action: 'screenshot', name: 'result', description: 'Show the result' }
]);
```

### 2. Backend Testing
```javascript
await flosho.api('/api/users', [
  {
    name: 'Create user',
    method: 'POST',
    data: { name: 'Test User', email: 'test@example.com' },
    expect: { status: 201 }
  }
]);
```

### 3. Screenshot Requirements
- Before state (initial)
- Action state (during interaction)
- After state (result)
- Error states (if applicable)

## Output Structure

```
testing/flosho-docs/
├── screenshots/        # All captured screenshots
├── user-manual/        # Auto-generated documentation
│   ├── README.md      # Main guide
│   ├── feature-1.md   # Feature documentation
│   └── api-docs.md    # API reference
├── api-flows/         # Visual API documentation
└── videos/            # Screen recordings
```

## Benefits

1. **Zero Manual Documentation** - Tests create the docs
2. **Visual Proof** - See exactly what users see
3. **Regression Prevention** - Screenshots catch UI changes
4. **Stakeholder Ready** - Professional documentation

## Integration with xText-PRP

FloSho enhances xText-PRP by:
- Adding visual validation to PRPs
- Creating documentation from implementation
- Providing screenshot evidence of requirements
- Closing the loop from idea to proof