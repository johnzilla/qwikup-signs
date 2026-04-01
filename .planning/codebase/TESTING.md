# Testing Patterns

**Analysis Date:** 2026-04-01

## Test Framework

**Status:** Not configured

**Current State:**
- No test framework installed or configured
- No jest, vitest, or playwright dependencies in `package.json`
- No test config files present (no `jest.config.js`, `vitest.config.ts`, etc.)
- No test files in the project source code

**Dependencies Available:**
- ESLint 9.0.0+ with Next.js config
- TypeScript 5.7.0
- Development dependencies cover linting only, not testing

## Test Infrastructure Setup Needed

To add testing to this project, the following setup would be required:

**For Unit/Integration Tests:**
- **Vitest** (recommended for Next.js 15, faster than Jest)
  - Install: `npm install -D vitest @vitest/ui`
  - Or **Jest** with Next.js config
  - Install: `npm install -D jest @testing-library/react @testing-library/jest-dom @types/jest`

**For React Component Testing:**
- **@testing-library/react** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation

**For API/Server Action Testing:**
- **Node test runner** (built-in for Node 20+)
- Or continue with Vitest/Jest for API routes

**For E2E Testing:**
- **Playwright** - Recommended for Next.js
  - Install: `npm install -D @playwright/test`

## Code Patterns for Testing (Future)

### Current Testable Patterns

**Server Actions** (`app/auth/actions.ts`):
- Pure input/output: accept FormData, return error object or redirect
- Testable with mock Supabase client
- Pattern:
  ```typescript
  // Testable structure
  export async function login(formData: FormData) {
    const parsed = loginSchema.safeParse({...});
    if (!parsed.success) return { error: ... };
    
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({...});
    if (error) return { error: error.message };
    
    redirect(...);
  }
  ```

**Validation Schemas** (`lib/validations.ts`):
- Already structured for testing
- Zod schemas directly testable without mocking
- Example test:
  ```typescript
  const result = loginSchema.safeParse({ email: 'test@example.com', password: 'password' });
  expect(result.success).toBe(true);
  ```

**Utility Functions** (`lib/qr-generator.ts`, `lib/utils.ts`):
- Pure functions with clear inputs/outputs
- `generateQRCode()`: async function, throws on error
- `cn()`: pure function for class merging
- Both easily testable with simple assertions

**React Components:**
- Client components use React hooks (useState, useEffect, useCallback)
- Server action integration via form submission
- Supabase client initialized within components (would need mocking)

## Recommended Testing Structure

If testing were to be implemented:

**Directory Layout:**
```
app/
├── auth/
│   ├── actions.ts
│   └── actions.test.ts          # Server action tests
├── ...
lib/
├── validations.ts
├── validations.test.ts          # Schema tests
├── qr-generator.ts
├── qr-generator.test.ts         # Utility tests
└── utils.ts
    utils.test.ts               # Class utility tests
components/
├── auth/
│   ├── auth-form.tsx
│   └── auth-form.test.tsx       # Component tests
└── ...
```

**Test File Naming:**
- `*.test.ts` for TypeScript utility/schema tests
- `*.test.tsx` for React component tests

## Mocking Patterns (Recommended)

**For Supabase:**
```typescript
// Mock pattern for testing
const mockSupabaseClient = {
  auth: {
    signInWithPassword: jest.fn(),
    getUser: jest.fn(),
    signUp: jest.fn(),
  },
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ data: {...} })
      })
    })
  })
};
```

**For Server Actions:**
- Mock FormData construction in tests
- Mock `next/navigation` redirect function
- Test error returns without making real auth calls

**For Components:**
- Mock Supabase client creation
- Mock useRouter/useSearchParams hooks
- Mock sonner toast library for notifications

## Validation Testing (Existing Asset)

The Zod schemas in `lib/validations.ts` provide the foundation for validation testing:

**What's Already Testable:**
- Email format validation
- Password length and confirmation
- Required field validation
- Optional field handling
- Custom refinements (password matching)

**Test Examples:**
```typescript
// Valid login
const valid = loginSchema.safeParse({
  email: 'user@example.com',
  password: 'password123'
});
expect(valid.success).toBe(true);

// Invalid email
const invalid = loginSchema.safeParse({
  email: 'invalid-email',
  password: 'password123'
});
expect(invalid.success).toBe(false);
expect(invalid.error?.issues[0].message).toBe('Invalid email address');

// Signup with mismatched passwords
const mismatch = signupSchema.safeParse({
  email: 'user@example.com',
  password: 'password123',
  confirmPassword: 'different123',
  firstName: 'John',
  lastName: 'Doe'
});
expect(mismatch.success).toBe(false);
```

## Coverage Targets (Recommended)

For this codebase, if tests are implemented:

**High Priority:**
- Validation schemas (lib/validations.ts) - 100% coverage
- Server actions (app/auth/actions.ts) - 80%+ coverage
- QR code generation (lib/qr-generator.ts) - 80%+

**Medium Priority:**
- Dashboard components (components/dashboard/) - 60%+
- Form components (components/auth/, components/public/) - 60%+

**Lower Priority:**
- UI library components (components/ui/) - Already tested in Radix UI
- Utility functions (lib/utils.ts) - Simple helpers, basic coverage

## Running Tests (When Configured)

When a test framework is added, commands would look like:

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # With coverage report
```

## Current Gaps

**Testing Gaps:**
1. No unit tests for validation schemas
2. No tests for server actions (auth logic)
3. No component integration tests
4. No E2E tests for user workflows
5. No coverage metrics/enforcement

**Risk Areas Without Tests:**
- Authentication flow (critical)
- Form validation edge cases
- QR code generation errors
- Supabase integration points
- Component state management
- Error handling paths

## Testing Best Practices (Not Yet Applied)

When testing is implemented, follow these patterns:

**For Server Actions:**
- Test both success and error paths
- Mock external dependencies (Supabase, auth)
- Verify correct redirect calls

**For Components:**
- Use `@testing-library/react` for user-centric tests
- Test state changes and effects
- Mock API calls and toast notifications

**For Validation:**
- Test valid inputs
- Test invalid inputs and error messages
- Test edge cases (empty strings, special characters)

---

*Testing analysis: 2026-04-01*

**Note:** This project currently has no automated testing infrastructure. The patterns documented above show where tests could be added and what patterns would be testable based on the current code structure. Implementation of testing is recommended before significant feature additions.
