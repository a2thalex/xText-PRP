# Implementation Guide
## Phase-by-Phase Development with Context Engineering

This guide provides Claude Code with structured implementation patterns for each phase of app development.

---

## 🎯 Implementation Philosophy

### Context-Driven Development (CDD)
1. **Always start with context** - Read the PRP thoroughly
2. **Validate understanding** - Confirm interpretation before coding
3. **Implement incrementally** - Small, testable chunks
4. **Self-validate continuously** - Check work at each step
5. **Maintain context coherence** - Keep decisions consistent

### The Implementation Loop
```
Read Context → Plan Approach → Implement → Test → Validate → Iterate
```

---

## 📋 Phase 1: Project Foundation

### 1.1 Project Initialization
```bash
# Step 1: Create project structure
mkdir -p project-name/{frontend,backend,shared}
cd project-name

# Step 2: Initialize version control
git init
echo "node_modules/\n.env\n.env.local\ndist/\nbuild/" > .gitignore

# Step 3: Set up package management
npm init -y # in root for workspace
npm init -y # in frontend/
npm init -y # in backend/
```

### 1.2 TypeScript Configuration
```typescript
// tsconfig.base.json (root)
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["shared/*"]
    }
  }
}
```

### 1.3 Development Environment
```yaml
# .env.example
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Frontend
VITE_API_URL="http://localhost:3001"

# Backend
PORT=3001
NODE_ENV="development"
```

### 1.4 Quality Tools Setup
```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}

// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

---

## 🏗️ Phase 2: Architecture Implementation

### 2.1 Backend Architecture
```typescript
// backend/src/app.ts - Express setup with best practices
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import routes from './routes';

export function createApp(): Express {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({ origin: process.env.FRONTEND_URL }));
  
  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  
  // Compression and logging
  app.use(compression());
  app.use(requestLogger);
  
  // Routes
  app.use('/api', routes);
  
  // Error handling (must be last)
  app.use(errorHandler);
  
  return app;
}
```

### 2.2 Frontend Architecture
```typescript
// frontend/src/main.tsx - React app setup
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
```

### 2.3 Database Layer
```typescript
// backend/src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Repository pattern example
export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
  
  async create(data: CreateUserDto) {
    return prisma.user.create({ data });
  }
}
```

---

## 🔧 Phase 3: Feature Implementation

### 3.1 Feature Development Pattern
```typescript
// 1. Define types/interfaces
interface Feature {
  id: string;
  name: string;
  data: unknown;
}

// 2. Create service layer
class FeatureService {
  constructor(private repository: FeatureRepository) {}
  
  async processFeature(input: FeatureInput): Promise<FeatureOutput> {
    // Validation
    const validated = featureSchema.parse(input);
    
    // Business logic
    const processed = await this.businessLogic(validated);
    
    // Persistence
    const saved = await this.repository.save(processed);
    
    // Return formatted response
    return this.formatResponse(saved);
  }
}

// 3. Create controller
class FeatureController {
  constructor(private service: FeatureService) {}
  
  async handleRequest(req: Request, res: Response) {
    try {
      const result = await this.service.processFeature(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

// 4. Wire up routes
router.post('/features', authenticate, featureController.handleRequest);
```

### 3.2 Frontend Feature Pattern
```typescript
// 1. Create custom hook
export function useFeature() {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['features'],
    queryFn: fetchFeatures,
  });
  
  const mutation = useMutation({
    mutationFn: createFeature,
    onSuccess: () => {
      queryClient.invalidateQueries(['features']);
    },
  });
  
  return { features: data, isLoading, error, createFeature: mutation.mutate };
}

// 2. Create component
export function FeatureComponent() {
  const { features, isLoading, createFeature } = useFeature();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      {features?.map(feature => (
        <FeatureCard key={feature.id} {...feature} />
      ))}
      <CreateFeatureForm onSubmit={createFeature} />
    </div>
  );
}
```

---

## 🧪 Phase 4: Testing Implementation

### 4.1 Unit Testing Pattern
```typescript
// backend/src/services/__tests__/feature.service.test.ts
describe('FeatureService', () => {
  let service: FeatureService;
  let mockRepository: jest.Mocked<FeatureRepository>;
  
  beforeEach(() => {
    mockRepository = createMockRepository();
    service = new FeatureService(mockRepository);
  });
  
  describe('processFeature', () => {
    it('should process valid input correctly', async () => {
      // Arrange
      const input = { name: 'Test Feature' };
      const expected = { id: '1', name: 'Test Feature', processed: true };
      mockRepository.save.mockResolvedValue(expected);
      
      // Act
      const result = await service.processFeature(input);
      
      // Assert
      expect(result).toEqual(expected);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test Feature'
      }));
    });
    
    it('should handle errors gracefully', async () => {
      // Test error scenarios
    });
  });
});
```

### 4.2 Integration Testing
```typescript
// backend/src/__tests__/api/features.test.ts
import request from 'supertest';
import { createApp } from '../../app';
import { prisma } from '../../lib/prisma';

describe('Features API', () => {
  const app = createApp();
  
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE features CASCADE`;
  });
  
  describe('POST /api/features', () => {
    it('should create a new feature', async () => {
      const response = await request(app)
        .post('/api/features')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'New Feature' });
        
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe('New Feature');
    });
  });
});
```

---

## 🚀 Phase 5: Optimization & Deployment

### 5.1 Performance Optimization
```typescript
// 1. API Response Caching
import { Redis } from 'ioredis';
const redis = new Redis();

async function getCachedOrFetch(key: string, fetcher: () => Promise<any>) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const fresh = await fetcher();
  await redis.set(key, JSON.stringify(fresh), 'EX', 300); // 5 min cache
  return fresh;
}

// 2. Database Query Optimization
const optimizedQuery = await prisma.user.findMany({
  where: { active: true },
  select: {
    id: true,
    email: true,
    profile: {
      select: { name: true, avatar: true }
    }
  },
  take: 20,
  cursor: { id: lastId }
});

// 3. Frontend Bundle Optimization
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['date-fns', 'lodash-es']
        }
      }
    }
  }
};
```

### 5.2 Deployment Configuration
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - postgres
      
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://backend:3001
      
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=appdb
      - POSTGRES_USER=appuser
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      
volumes:
  postgres_data:
```

---

## 📊 Continuous Validation

### After Each Implementation
1. **Code Quality Check**
   ```bash
   npm run lint
   npm run type-check
   npm run test
   ```

2. **Security Audit**
   ```bash
   npm audit
   # Fix vulnerabilities
   npm audit fix
   ```

3. **Performance Check**
   - Lighthouse scores > 90
   - API response times < 200ms
   - Bundle size within limits

4. **User Acceptance**
   - Feature works as described in PRP
   - Edge cases handled
   - Error messages helpful

---

## 🎯 Success Indicators

You know implementation is successful when:
- ✅ All tests pass
- ✅ No linting errors
- ✅ Type checking passes
- ✅ Performance targets met
- ✅ Security scan clean
- ✅ Code follows project patterns
- ✅ Documentation updated
- ✅ PRP requirements satisfied

---

*This guide ensures Claude Code follows best practices and maintains consistency throughout the implementation process.*