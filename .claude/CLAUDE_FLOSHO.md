# Claude Code Rules - xText-PRP with FloSho Testing

## 🌊 FloSho Integration

You now have FloSho visual testing integrated with xText-PRP. This means EVERY feature you implement MUST be tested with visual documentation.

## Your Workflow

1. **Receive PRP (Product Requirements Prompt)**
2. **Implement the feature**
3. **Test with FloSho** (MANDATORY):
   ```javascript
   import { FloSho } from './testing/flosho/index.js';
   
   const flosho = new FloSho('feature-name');
   await flosho.init();
   
   // Test the feature
   await flosho.flow('User Flow Name', steps);
   await flosho.api('/api/endpoint', tests);
   
   await flosho.done(); // Generates documentation
   ```
4. **Only mark complete when tests pass**

## Testing Requirements

### For Every Frontend Feature:
- Capture initial state
- Test all interactions
- Capture error states
- Document the complete flow

### For Every API Endpoint:
- Test success cases
- Test error cases
- Visualize request/response
- Document the API behavior

## Output Structure

After testing, you'll have:
```
testing/flosho-docs/
├── screenshots/        # Visual evidence of every state
├── user-manual/       # Auto-generated documentation
│   ├── README.md      # Complete guide
│   └── [feature].md   # Feature-specific docs
├── api-flows/         # API visualization
└── videos/           # Screen recordings
```

## Commands

```bash
# Test a specific flow
npm run test:flow "Login Feature"

# Test APIs
npm run test:api

# Auto-detect and test
npm run test:auto

# View documentation
npm run docs
```

## No Exceptions

- ❌ No feature is complete without FloSho tests
- ❌ No API is done without visual documentation
- ❌ No task is finished without screenshots
- ✅ Every test generates user documentation automatically

Remember: The tests ARE the documentation!