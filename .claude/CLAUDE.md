# Claude Code Rules - xText-PRP with FloSho Testing

## Context Engineering + Visual Testing

This project combines xText-PRP's context engineering with FloSho's visual testing framework.

## Your Workflow

1. **Receive PRP (Product Requirements Prompt)**
   - Analyze requirements
   - Plan implementation
   - Identify test scenarios

2. **Implement Features**
   - Follow xText-PRP patterns
   - Add data-testid attributes
   - Create testable components

3. **Test with FloSho** (MANDATORY)
   ```javascript
   import { FloSho } from './testing/flosho';
   
   const flosho = new FloSho('feature-name');
   await flosho.init();
   
   // Test user flows
   await flosho.flow('User Journey', steps);
   
   // Test APIs
   await flosho.api('/api/endpoint', tests);
   
   await flosho.done(); // Generates documentation
   ```

4. **Documentation Auto-Generated**
   - User manuals with screenshots
   - API visual documentation
   - Complete test reports

## Testing Rules

- ❌ No feature is complete without FloSho tests
- ❌ No PR without screenshot evidence
- ❌ No deployment without visual documentation
- ✅ Every test creates user documentation
- ✅ Screenshots flow into user manuals
- ✅ APIs are visually documented

## Context + Testing = Quality

xText-PRP provides the context, FloSho provides the proof.