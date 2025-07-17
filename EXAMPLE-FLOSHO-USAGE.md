# FloSho Testing Examples for xText-PRP

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Run example test
node examples/flosho-demo.js
```

## Example 1: Testing a Todo App

```javascript
import { FloSho } from './testing/flosho';

async function testTodoApp() {
  const flosho = new FloSho('todo-app');
  await flosho.init();

  // Test the complete todo flow
  await flosho.flow('Todo Management', [
    {
      action: 'navigate',
      url: 'http://localhost:3000',
      description: 'Open Todo App'
    },
    {
      action: 'screenshot',
      name: 'empty-state',
      description: 'Todo list empty state'
    },
    {
      action: 'fill',
      selector: '#new-todo',
      value: 'Write documentation',
      description: 'Enter new todo'
    },
    {
      action: 'press',
      key: 'Enter',
      description: 'Add todo with Enter key'
    },
    {
      action: 'screenshot',
      name: 'todo-added',
      description: 'First todo added to list'
    },
    {
      action: 'click',
      selector: '.todo-checkbox',
      description: 'Mark todo as complete'
    },
    {
      action: 'screenshot',
      name: 'todo-completed',
      description: 'Todo marked as complete'
    }
  ]);

  // Test the API
  await flosho.api('/api/todos', [
    {
      name: 'Get all todos',
      method: 'GET',
      expect: { status: 200 }
    },
    {
      name: 'Create todo',
      method: 'POST',
      data: { title: 'Test todo', completed: false },
      expect: { status: 201 }
    },
    {
      name: 'Update todo',
      method: 'PUT',
      endpoint: '/api/todos/1',
      data: { completed: true },
      expect: { status: 200 }
    }
  ]);

  await flosho.done();
}

testTodoApp();
```

## Example 2: Testing Authentication Flow

```javascript
import { FloSho } from './testing/flosho';

async function testAuth() {
  const flosho = new FloSho('authentication');
  await flosho.init();

  // Test login flow
  await flosho.flow('User Login', [
    {
      action: 'navigate',
      url: '/login',
      description: 'Navigate to login page'
    },
    {
      action: 'screenshot',
      name: 'login-form',
      description: 'Login form initial state'
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
      value: 'securepassword',
      description: 'Enter password'
    },
    {
      action: 'screenshot',
      name: 'login-filled',
      description: 'Login form filled out'
    },
    {
      action: 'click',
      selector: '#login-button',
      description: 'Click login button',
      highlightSelector: '#login-button'
    },
    {
      action: 'wait',
      selector: '.dashboard',
      description: 'Wait for dashboard to load'
    },
    {
      action: 'screenshot',
      name: 'dashboard',
      description: 'User dashboard after login'
    }
  ]);

  // Test registration flow
  await flosho.flow('User Registration', [
    {
      action: 'navigate',
      url: '/register',
      description: 'Navigate to registration'
    },
    // ... registration steps
  ]);

  // Test password reset
  await flosho.flow('Password Reset', [
    {
      action: 'navigate',
      url: '/forgot-password',
      description: 'Navigate to password reset'
    },
    // ... password reset steps
  ]);

  await flosho.done();
}
```

## Example 3: Responsive Testing

```javascript
import { FloSho } from './testing/flosho';

async function testResponsive() {
  const flosho = new FloSho('responsive-design');
  await flosho.init();

  // Test desktop view
  await flosho.setViewport('desktop');
  await flosho.flow('Desktop Layout', [
    { action: 'navigate', url: '/', description: 'Homepage on desktop' },
    { action: 'screenshot', name: 'desktop-home', description: 'Desktop homepage' }
  ]);

  // Test tablet view
  await flosho.setViewport('tablet');
  await flosho.flow('Tablet Layout', [
    { action: 'navigate', url: '/', description: 'Homepage on tablet' },
    { action: 'screenshot', name: 'tablet-home', description: 'Tablet homepage' }
  ]);

  // Test mobile view
  await flosho.setViewport('mobile');
  await flosho.flow('Mobile Layout', [
    { action: 'navigate', url: '/', description: 'Homepage on mobile' },
    { action: 'screenshot', name: 'mobile-home', description: 'Mobile homepage' },
    { action: 'click', selector: '#mobile-menu', description: 'Open mobile menu' },
    { action: 'screenshot', name: 'mobile-menu', description: 'Mobile menu open' }
  ]);

  await flosho.done();
}
```

## Example 4: E-commerce Checkout

```javascript
import { FloSho } from './testing/flosho';

async function testCheckout() {
  const flosho = new FloSho('ecommerce-checkout');
  await flosho.init();

  await flosho.flow('Complete Purchase Flow', [
    // Browse products
    {
      action: 'navigate',
      url: '/products',
      description: 'Browse product catalog'
    },
    {
      action: 'click',
      selector: '.product-card:first-child',
      description: 'Select first product'
    },
    {
      action: 'screenshot',
      name: 'product-detail',
      description: 'Product detail page'
    },
    
    // Add to cart
    {
      action: 'click',
      selector: '#add-to-cart',
      description: 'Add product to cart'
    },
    {
      action: 'wait',
      duration: 1000,
      description: 'Wait for cart update'
    },
    {
      action: 'click',
      selector: '#view-cart',
      description: 'Go to shopping cart'
    },
    {
      action: 'screenshot',
      name: 'shopping-cart',
      description: 'Shopping cart with items'
    },
    
    // Checkout
    {
      action: 'click',
      selector: '#checkout',
      description: 'Proceed to checkout'
    },
    {
      action: 'fill',
      selector: '#shipping-name',
      value: 'John Doe',
      description: 'Enter shipping name'
    },
    {
      action: 'fill',
      selector: '#shipping-address',
      value: '123 Main St, City, ST 12345',
      description: 'Enter shipping address'
    },
    {
      action: 'screenshot',
      name: 'shipping-info',
      description: 'Shipping information entered'
    },
    
    // Payment
    {
      action: 'click',
      selector: '#continue-to-payment',
      description: 'Continue to payment'
    },
    {
      action: 'fill',
      selector: '#card-number',
      value: '4242 4242 4242 4242',
      description: 'Enter card number'
    },
    {
      action: 'fill',
      selector: '#card-expiry',
      value: '12/25',
      description: 'Enter card expiry'
    },
    {
      action: 'fill',
      selector: '#card-cvc',
      value: '123',
      description: 'Enter CVC'
    },
    {
      action: 'screenshot',
      name: 'payment-info',
      description: 'Payment information entered'
    },
    
    // Complete order
    {
      action: 'click',
      selector: '#place-order',
      description: 'Place order'
    },
    {
      action: 'wait',
      selector: '.order-confirmation',
      description: 'Wait for confirmation'
    },
    {
      action: 'screenshot',
      name: 'order-confirmation',
      description: 'Order confirmation page'
    }
  ]);

  await flosho.done();
}
```

## Generated Documentation

After running these tests, FloSho generates:

### 1. User Manual (`testing/flosho-docs/user-manual/README.md`)
- Complete guide with all flows
- Step-by-step instructions with screenshots
- Organized by feature

### 2. Individual Flow Docs
- `todo-management.md` - Todo app workflow
- `user-login.md` - Authentication process
- `complete-purchase-flow.md` - Checkout steps

### 3. API Documentation
- Visual request/response examples
- Status codes and payloads
- Error scenarios

### 4. Screenshot Gallery
- All UI states captured
- Before/after comparisons
- Error states documented

## Tips for Effective FloSho Testing

1. **Use Descriptive Names**
   ```javascript
   // Good
   { action: 'screenshot', name: 'empty-cart', description: 'Shopping cart with no items' }
   
   // Bad
   { action: 'screenshot', name: 'sc1', description: 'Screenshot 1' }
   ```

2. **Test Happy Path and Errors**
   ```javascript
   // Happy path
   await flosho.flow('Successful Login', successSteps);
   
   // Error cases
   await flosho.flow('Login Errors', errorSteps);
   ```

3. **Use Highlighting**
   ```javascript
   {
     action: 'click',
     selector: '#important-button',
     description: 'Click the important button',
     highlightSelector: '#important-button' // Adds red outline in screenshot
   }
   ```

4. **Add Context with Descriptions**
   ```javascript
   {
     action: 'wait',
     duration: 2000,
     description: 'Wait for animation to complete and data to load'
   }
   ```

5. **Test Different Viewports**
   ```javascript
   const viewports = ['desktop', 'tablet', 'mobile'];
   for (const viewport of viewports) {
     await flosho.setViewport(viewport);
     await flosho.flow(`${viewport} Experience`, steps);
   }
   ```

---

*FloSho - Where testing meets documentation in xText-PRP*