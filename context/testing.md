# Testing Context - xText-PRP with FloSho

## Overview

xText-PRP now includes FloSho - a visual testing and documentation framework that automatically generates user manuals from your tests.

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Run your first test
npm run test:flow "My Feature"
```

## Writing Tests

### User Flow Testing

```javascript
import { FloSho } from './testing/flosho/index.js';

const flosho = new FloSho('User Authentication');
await flosho.init();

// Test login flow
await flosho.flow('Login Process', [
  {
    action: 'navigate',
    url: '/login',
    description: 'Navigate to login page'
  },
  {
    action: 'fill',
    selector: '#email',
    value: 'user@example.com',
    description: 'Enter email address'
  },
  {
    action: 'fill',
    selector: '#password',
    value: 'password123',
    description: 'Enter password'
  },
  {
    action: 'click',
    selector: '#submit',
    description: 'Click login button'
  },
  {
    action: 'wait',
    selector: '.dashboard',
    description: 'Wait for dashboard to load'
  },
  {
    action: 'screenshot',
    name: 'dashboard',
    description: 'User dashboard after successful login'
  }
]);

await flosho.done();
```

### API Testing

```javascript
// Test API endpoints with visual documentation
await flosho.api('/api/users', [
  {
    name: 'Create user',
    method: 'POST',
    data: {
      name: 'Test User',
      email: 'test@example.com'
    },
    expect: { status: 201 }
  },
  {
    name: 'Get user',
    method: 'GET',
    expect: { status: 200 }
  }
]);
```

## Available Actions

- `navigate` - Go to a URL
- `click` - Click an element
- `fill` - Fill in a form field
- `select` - Select from dropdown
- `wait` - Wait for element or duration
- `screenshot` - Capture current state
- `hover` - Hover over element
- `press` - Press keyboard key
- `upload` - Upload files

## Output Structure

```
testing/flosho-docs/
├── screenshots/         # Annotated screenshots
├── user-manual/        # Generated documentation
│   ├── README.md       # Main documentation
│   ├── login-flow.md   # Feature-specific docs
│   └── api-reference.md # API documentation
├── api-flows/          # API visualization
└── videos/            # Screen recordings
```

## Integration with PRPs

When implementing features from PRPs:

1. Read the PRP requirements
2. Implement the feature
3. Create FloSho tests that cover all requirements
4. Use the generated documentation to verify completion

## Best Practices

1. **Test Everything**: Every feature should have tests
2. **Descriptive Steps**: Use clear descriptions for documentation
3. **Capture States**: Screenshot before and after actions
4. **Test Errors**: Include error state testing
5. **API Coverage**: Test all API endpoints

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: FloSho Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npx playwright install chromium
      - run: npm test
      - uses: actions/upload-artifact@v3
        with:
          name: flosho-docs
          path: testing/flosho-docs/
```