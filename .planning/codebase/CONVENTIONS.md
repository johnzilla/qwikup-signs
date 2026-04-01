# Coding Conventions

**Analysis Date:** 2026-04-01

## Naming Patterns

**Files:**
- Components: kebab-case (e.g., `auth-form.tsx`, `dashboard-header.tsx`, `owner-dashboard.tsx`, `qr-code-dialog.tsx`)
- Utility/Library files: kebab-case (e.g., `qr-generator.ts`, `use-toast.ts`)
- Page/Route files: kebab-case for nested routes (e.g., `/auth/login/page.tsx`, `/report/[qrCode]/page.tsx`)
- UI library components: kebab-case (e.g., `button.tsx`, `dropdown-menu.tsx`, `dialog.tsx`)
- Type definition files: descriptive kebab-case (e.g., `database.types.ts`)

**Functions:**
- Regular functions: camelCase (e.g., `login()`, `signup()`, `logout()`, `generateQRCode()`, `generateCampaignQRCode()`)
- React components (uppercase): PascalCase (e.g., `AuthForm`, `OwnerDashboard`, `DashboardHeader`, `ReportForm`)
- Hook functions: camelCase with `use` prefix (e.g., `useToast()`)
- Async server actions: camelCase (e.g., `createClient()`, `updateSession()`)

**Variables:**
- Regular variables: camelCase (e.g., `isPending`, `loading`, `campaigns`, `userType`, `locationError`)
- State variables from useState: camelCase (e.g., `[campaigns, setCampaigns]`, `[error, setError]`)
- Constants: UPPER_SNAKE_CASE for module-level constants (e.g., `TOAST_LIMIT`, `TOAST_REMOVE_DELAY`)
- Local constants: camelCase (e.g., `redirectPath`, `sanitizedName`, `timestamp`)
- Type unions for state: PascalCase (e.g., `'owner' | 'worker'`, `'active' | 'paused' | 'completed'`)

**Types:**
- Interfaces: PascalCase (e.g., `AuthFormProps`, `Campaign`, `Profile`, `DashboardHeaderProps`)
- Type aliases: PascalCase (e.g., `UserRole`, `CampaignStatus`, `SignStatus`)
- Generic parameters: Single uppercase letters (e.g., `<T>`, `<P extends SomeInterface>`)

**Database/Backend:**
- Database fields: snake_case (e.g., `first_name`, `company_name`, `owner_id`, `qr_code`, `created_at`)
- Enum values in validation: lowercase (e.g., `'owner'`, `'worker'`, `'active'`)

## Code Style

**Formatting:**
- No explicit formatter config (Prettier not configured in `.eslintrc.json`)
- Line length: No explicit rule; files follow natural breaking points
- Indentation: 2 spaces (observed in all source files)
- Quotes: Single quotes for strings in TypeScript/JavaScript

**Linting:**
- Tool: ESLint with Next.js core-web-vitals config
- Config: `.eslintrc.json` extends `next/core-web-vitals`
- Key rules: Default Next.js rules for React 19 and TypeScript 5.7+
- No custom ESLint overrides configured

**Semicolons:**
- Required at end of statements (consistently used)
- Used after import statements and function declarations

## Import Organization

**Order:**
1. React/Next.js imports (e.g., `'use client'` directives, `import { useState }`, `import Link from 'next/link'`)
2. Third-party library imports (e.g., `import { Button }` from `@radix-ui/...`, `import { Mail }` from `lucide-react`)
3. Absolute path imports from `@/` (e.g., `@/components/...`, `@/lib/...`, `@/app/...`)
4. Type imports (e.g., `import type { NextRequest }`, used inline with imports)
5. Blank line between groups

**Path Aliases:**
- Base alias: `@/*` maps to `./*` (root directory)
- Used throughout: `@/components/...`, `@/lib/...`, `@/app/...`, `@/hooks/...`
- Example: `import { Button } from '@/components/ui/button'`

**Specific Examples from Codebase:**
```typescript
// App/auth/actions.ts pattern
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { loginSchema, signupSchema } from '@/lib/validations';
```

```typescript
// Component pattern
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';

interface AuthFormProps {
  mode: 'login' | 'signup';
}
```

## Error Handling

**Patterns:**
- **Server actions:** Return error objects `{ error: string }` instead of throwing exceptions
  - Example: `if (!parsed.success) return { error: parsed.error.errors[0].message };`
  - Supabase operations return `{ data, error }` destructuring pattern
- **Client components:** Check `error?.message` after server actions
- **Async operations:** Use `safeParse()` from Zod for validation before operations
- **API data flow:** Await operations, check for errors, then proceed with data
- **Geolocation:** Use error callbacks in geolocation API (e.g., `() => { setLocationError(...) }`)
- **Toast notifications:** Use `sonner` library for user feedback (`toast.error()`, `toast.success()`)

**Error Recovery:**
- Validation failures render error message in UI
- Server action failures return error object to be set in state
- Geolocation failures gracefully set error state, show message to user
- Database operation failures extract `.message` from error object

## Logging

**Framework:** `console` (no explicit logging library)

**Patterns:**
- `console.error()` used for exception logging in async functions
- Example: `console.error('Error generating QR code:', error);`
- No structured logging or log levels
- Error messages are user-facing via return/toast rather than server logs

## Comments

**When to Comment:**
- Rarely used; code is generally self-documenting
- Comments appear only for non-obvious behavior or workarounds
- Example in `use-toast.ts`: `// ! Side effects ! - This could be extracted into a dismissToast() action, but I'll keep it here for simplicity`

**JSDoc/TSDoc:**
- Not used systematically
- No function/type documentation comments observed
- Type safety relies on TypeScript interfaces and Zod schemas instead

## Function Design

**Size:**
- Small functions preferred; most functions 20-80 lines
- Complex components may reach 150-200 lines (e.g., `OwnerDashboard`, `ReportForm`)

**Parameters:**
- Destructured props for React components (e.g., `{ mode }: AuthFormProps`)
- FormData passed as parameter to server actions
- Supabase clients created locally within functions

**Return Values:**
- Components return JSX
- Server actions return `{ error: string } | undefined`
- Utility functions return specific types (e.g., `Promise<string>` for `generateQRCode()`)
- Hooks return objects with properties and methods (e.g., `{ toasts, toast, dismiss }`)

**Async/Await:**
- Used consistently for async operations
- No promise chains; all async code uses await
- Example pattern:
  ```typescript
  async function loadProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    // ... more awaits
  }
  ```

## Module Design

**Exports:**
- Named exports for functions, components, types: `export function name() { }`, `export const name = ...`
- Barrel files: `index.ts/tsx` not used; components import directly from files
- Server/client separation: Marked with `'use server'` and `'use client'` directives

**File Organization:**
- One component per file typically (e.g., `auth-form.tsx` exports `AuthForm`)
- Utility functions grouped by concern (e.g., `supabase/client.ts`, `supabase/server.ts`)
- UI components in `components/ui/` (Radix UI library)
- Domain-specific components in `components/{domain}/` (e.g., `components/dashboard/`, `components/auth/`)

## TypeScript Patterns

**Strict Mode:**
- Enabled in `tsconfig.json` (`"strict": true`)
- All types explicitly declared

**Interfaces for Props:**
- All component props defined as interfaces (e.g., `interface AuthFormProps { ... }`)
- Props interfaces inherit from element types when needed (e.g., `ButtonProps extends React.ButtonHTMLAttributes`)

**Union Types:**
- Used for state variants (e.g., `'owner' | 'worker'`, `'active' | 'paused' | 'completed'`)
- Used for discriminated unions (action types in `use-toast.ts`)

**Database Types:**
- Generated from Supabase schema in `lib/database.types.ts`
- Covers Row, Insert, and Update variants for each table
- Used for type-safe database operations

## Validation

**Framework:** Zod for runtime validation
- Files: `lib/validations.ts`
- Schemas defined once, reused in server actions and components
- Pattern: `schema.safeParse()` returns `{ success: boolean, data?, error? }`
- Includes custom refinements (e.g., password confirmation matching)

**Validation Schemas:**
- `loginSchema`: email, password
- `signupSchema`: email, password, confirmPassword, firstName, lastName, phone, companyName, role
- `campaignSchema`: name, description, bountyAmount
- `reportSchema`: description, email, phone, locationLat, locationLng

---

*Convention analysis: 2026-04-01*
