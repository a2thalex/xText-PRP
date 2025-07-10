# Testing & Deployment Workflows
## Comprehensive Quality Assurance and Release Management

---

## 🧪 TESTING STRATEGY

### Testing Pyramid Implementation
```
         /\
        /E2E\      (10% - Critical user journeys)
       /------\
      /  INT   \   (20% - API & Integration tests)  
     /----------\
    /   UNIT     \ (70% - Business logic & components)
   /--------------\
```

### Test Configuration by Layer

#### Unit Testing Setup
```typescript
// vitest.config.ts (Frontend)
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
});

// jest.config.js (Backend)
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

#### Integration Testing
```typescript
// backend/src/__tests__/setup.ts
import { prisma } from '../lib/prisma';

beforeAll(async () => {
  // Setup test database
  await prisma.$connect();
});

afterAll(async () => {
  // Cleanup
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clear data between tests
  const tables = ['user', 'post', 'comment']; // Add your tables
  for (const table of tables) {
    await prisma.$executeRaw`TRUNCATE TABLE ${table} CASCADE`;
  }
});

// Test utilities
export function createAuthToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

export async function createTestUser(data?: Partial<User>) {
  return prisma.user.create({
    data: {
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      ...data
    }
  });
}
```

#### E2E Testing with Playwright
```typescript
// e2e/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});

// e2e/tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('user can register, login, and access protected content', async ({ page }) => {
    // Register
    await page.goto('/register');
    await page.fill('[name="email"]', 'newuser@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('[type="submit"]');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Logout
    await page.click('[data-testid="logout-button"]');
    
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'newuser@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('[type="submit"]');
    
    // Verify authenticated state
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });
});
```

---

## 🔍 TESTING PATTERNS

### Component Testing Pattern
```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
  
  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('can be disabled', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Service Testing Pattern
```typescript
// src/services/__tests__/user.service.test.ts
describe('UserService', () => {
  let service: UserService;
  let mockRepo: jest.Mocked<UserRepository>;
  
  beforeEach(() => {
    mockRepo = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    };
    service = new UserService(mockRepo);
  });
  
  describe('createUser', () => {
    it('should hash password before saving', async () => {
      const input = { email: 'test@example.com', password: 'plain123' };
      const hashedUser = { ...input, password: 'hashed_password' };
      
      mockRepo.create.mockResolvedValue(hashedUser);
      
      const result = await service.createUser(input);
      
      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          password: expect.not.stringMatching('plain123')
        })
      );
    });
    
    it('should throw on duplicate email', async () => {
      mockRepo.findByEmail.mockResolvedValue({ id: '1', email: 'test@example.com' });
      
      await expect(
        service.createUser({ email: 'test@example.com', password: '123' })
      ).rejects.toThrow('Email already exists');
    });
  });
});
```

### API Testing Pattern
```typescript
// src/__tests__/api/users.test.ts
import request from 'supertest';
import { app } from '../../app';

describe('Users API', () => {
  describe('POST /api/users', () => {
    it('should create a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'newuser@example.com',
          password: 'SecurePass123!'
        });
        
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: expect.any(String),
          email: 'newuser@example.com'
        }
      });
    });
    
    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'invalid-email',
          password: 'SecurePass123!'
        });
        
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('email');
    });
  });
});
```

---

## 🚀 DEPLOYMENT WORKFLOWS

### CI/CD Pipeline Configuration

#### GitHub Actions
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost:5432/testdb
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost:5432/testdb
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
      
      - name: Build application
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
        if: github.event_name == 'pull_request'

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run security audit
        run: npm audit --audit-level=high
      
      - name: Run Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  deploy-staging:
    needs: [test, security-scan]
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to staging
        run: |
          # Deploy scripts here
          echo "Deploying to staging..."
      
      - name: Run smoke tests
        run: npm run test:smoke
        env:
          TEST_URL: https://staging.example.com

  deploy-production:
    needs: [test, security-scan]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          # Deploy scripts here
          echo "Deploying to production..."
      
      - name: Verify deployment
        run: npm run test:smoke
        env:
          TEST_URL: https://example.com
```

### Docker Configuration
```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001
CMD ["npm", "run", "start:prod"]

# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Deployment Environments

#### Environment Configuration
```yaml
# deployment/staging.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-staging
  namespace: staging
spec:
  replicas: 2
  selector:
    matchLabels:
      app: myapp
      env: staging
  template:
    metadata:
      labels:
        app: myapp
        env: staging
    spec:
      containers:
      - name: backend
        image: myapp/backend:staging
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "staging"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

---

## 📊 MONITORING & OBSERVABILITY

### Application Monitoring
```typescript
// src/lib/monitoring.ts
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

export function initializeMonitoring() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [
      new ProfilingIntegration(),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: 1.0,
  });
}

// Performance monitoring
export function trackPerformance(name: string, fn: () => Promise<any>) {
  const transaction = Sentry.startTransaction({ name });
  Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));
  
  return fn()
    .then(result => {
      transaction.setStatus('ok');
      return result;
    })
    .catch(error => {
      transaction.setStatus('internal_error');
      throw error;
    })
    .finally(() => {
      transaction.finish();
    });
}
```

### Health Checks
```typescript
// src/routes/health.ts
router.get('/health', async (req, res) => {
  const checks = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    database: 'unknown',
    redis: 'unknown'
  };
  
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'healthy';
  } catch (error) {
    checks.database = 'unhealthy';
  }
  
  try {
    // Check Redis
    await redis.ping();
    checks.redis = 'healthy';
  } catch (error) {
    checks.redis = 'unhealthy';
  }
  
  const isHealthy = checks.database === 'healthy' && checks.redis === 'healthy';
  res.status(isHealthy ? 200 : 503).json(checks);
});
```

---

## 🔄 ROLLBACK PROCEDURES

### Automated Rollback
```yaml
# .github/workflows/rollback.yml
name: Rollback Production

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to rollback to'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - name: Rollback to version
        run: |
          # Rollback scripts
          kubectl set image deployment/app-prod \
            backend=myapp/backend:${{ github.event.inputs.version }} \
            -n production
            
      - name: Verify rollback
        run: |
          # Wait for rollout to complete
          kubectl rollout status deployment/app-prod -n production
          
          # Run smoke tests
          npm run test:smoke
```

### Database Migration Rollback
```typescript
// package.json scripts
{
  "scripts": {
    "migrate:up": "prisma migrate deploy",
    "migrate:down": "prisma migrate resolve --rolled-back",
    "migrate:status": "prisma migrate status"
  }
}
```

---

## ✅ DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All tests passing
- [ ] Security scan clean
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Rollback plan documented

### During Deployment
- [ ] Monitor deployment progress
- [ ] Watch error rates
- [ ] Check resource utilization
- [ ] Verify health endpoints

### Post-Deployment
- [ ] Run smoke tests
- [ ] Monitor error rates (first 30 min)
- [ ] Check performance metrics
- [ ] Verify all features working
- [ ] Update status page
- [ ] Notify stakeholders

---

## 🎯 SUCCESS METRICS

### Deployment Success Indicators
- Zero downtime during deployment
- Error rate < 0.1% post-deployment
- Response times within SLA
- All health checks passing
- No rollback required

### Quality Gates
```yaml
quality_gates:
  test_coverage: ">= 80%"
  code_duplication: "< 5%"
  technical_debt: "< 2 days"
  security_issues: 0
  performance_regression: "< 5%"
```

---

*This comprehensive testing and deployment workflow ensures high-quality, reliable releases with minimal risk.*