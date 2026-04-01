# Codebase Structure

**Analysis Date:** 2026-04-01

## Directory Layout

```
qwikup-signs/
├── app/                          # Next.js App Router pages and layouts
│   ├── layout.tsx                # Root layout (metadata, global styles, Toaster)
│   ├── page.tsx                  # Landing page route (/)
│   ├── loading.tsx               # Global loading fallback
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 fallback
│   ├── auth/                     # Authentication routes
│   │   ├── actions.ts            # Server Actions: login, signup, logout
│   │   ├── login/page.tsx        # Login page (/auth/login)
│   │   └── signup/page.tsx       # Signup page (/auth/signup)
│   ├── dashboard/                # Owner dashboard
│   │   └── page.tsx              # Owner dashboard route (/dashboard)
│   ├── worker/                   # Worker dashboard
│   │   └── dashboard/page.tsx    # Worker dashboard route (/worker/dashboard)
│   ├── report/                   # Public report submission
│   │   ├── page.tsx              # Report listing page (/report)
│   │   └── [qrCode]/page.tsx     # Dynamic QR report page (/report/{qrCode})
│   └── globals.css               # Global Tailwind styles
├── components/                   # React components organized by feature
│   ├── auth/                     # Authentication components
│   │   └── auth-form.tsx         # Login/signup form with tabs
│   ├── dashboard/                # Owner dashboard components
│   │   ├── dashboard-header.tsx  # Dashboard header with user profile
│   │   ├── owner-dashboard.tsx   # Main owner dashboard container
│   │   └── qr-code-dialog.tsx    # QR code display/download modal
│   ├── landing/                  # Landing page components
│   │   └── landing-page.tsx      # Full landing page (hero, features, CTA)
│   ├── public/                   # Public-facing components (no auth required)
│   │   └── report-form.tsx       # Report submission form
│   ├── ui/                       # Shadcn/UI component library
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sonner.tsx            # Toast notifications wrapper
│   │   ├── switch.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   └── tooltip.tsx
│   └── worker/                   # Worker dashboard components
│       └── worker-dashboard.tsx  # Main worker dashboard container
├── hooks/                        # Custom React hooks
│   └── use-toast.ts              # Toast notification hook
├── lib/                          # Utility functions and configuration
│   ├── database.types.ts         # Supabase TypeScript types (auto-generated)
│   ├── qr-generator.ts           # QR code generation utility
│   ├── utils.ts                  # Shared utilities (cn() for className merging)
│   ├── validations.ts            # Zod validation schemas
│   └── supabase/                 # Supabase client initialization
│       ├── client.ts             # Browser client factory
│       ├── server.ts             # Server client factory
│       └── middleware.ts         # Middleware Supabase client for auth/routing
├── middleware.ts                 # Next.js request middleware for auth
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── package.json                  # Dependencies and scripts
├── supabase/                     # Supabase configuration
│   └── migrations/               # Database migrations
│       ├── 20250704171535_wispy_grass.sql        # Initial schema
│       └── 20260301000000_add_storage_bucket.sql # Storage configuration
└── .planning/                    # GSD planning documents
    └── codebase/                 # This directory (ARCHITECTURE.md, STRUCTURE.md, etc.)
```

## Directory Purposes

**app/**
- Purpose: Next.js App Router pages and layouts defining all routes
- Contains: Page components, layouts, error boundaries, Server Actions
- Key files: `layout.tsx` (root), `page.tsx` (landing), `middleware.ts` (auth)

**components/**
- Purpose: Reusable React components organized by feature
- Contains: UI components (Shadcn), feature components (auth, dashboard), page templates
- Key files: `ui/` (base components), `landing/landing-page.tsx` (hero), `dashboard/owner-dashboard.tsx` (owner UI)

**lib/**
- Purpose: Shared utilities, constants, types, and configurations
- Contains: Supabase clients (browser/server/middleware), validation schemas, QR generation, database types
- Key files: `supabase/client.ts` (browser), `supabase/server.ts` (server), `validations.ts` (Zod schemas)

**hooks/**
- Purpose: Custom React hooks for shared behavior
- Contains: Toast notification state management
- Key files: `use-toast.ts` (custom toast hook, alternative to Sonner library API)

**supabase/migrations/**
- Purpose: Database schema definition and migrations
- Contains: SQL migrations that define tables, columns, foreign keys, enums
- Key files: Initial schema (profiles, campaigns, sign_pins, reports, claims, payouts)

## Key File Locations

**Entry Points:**

- `app/layout.tsx`: Root layout wrapper (metadata, global CSS, Toaster)
- `app/page.tsx`: Landing page route (/)
- `middleware.ts`: Request middleware for auth and role-based routing

**Authentication:**

- `app/auth/actions.ts`: Server Actions for login, signup, logout
- `app/auth/login/page.tsx`: Login page component
- `app/auth/signup/page.tsx`: Signup page component
- `components/auth/auth-form.tsx`: Reusable login/signup form

**Data Access:**

- `lib/supabase/client.ts`: Browser Supabase client factory
- `lib/supabase/server.ts`: Server Supabase client factory
- `lib/supabase/middleware.ts`: Middleware for session management and routing

**Core Logic:**

- `lib/validations.ts`: Zod schemas for form validation
- `lib/qr-generator.ts`: QR code generation utility
- `lib/database.types.ts`: TypeScript types from Supabase schema

**Features:**

- `components/landing/landing-page.tsx`: Public landing page with hero and CTA
- `components/dashboard/owner-dashboard.tsx`: Owner dashboard (create campaigns, view stats)
- `components/worker/worker-dashboard.tsx`: Worker dashboard (browse bounties, claim, earn)
- `components/public/report-form.tsx`: Public report submission form

## Naming Conventions

**Files:**

- `[component].tsx`: React components (PascalCase filename)
- Example: `AuthForm`, `OwnerDashboard`, `LandingPage`
- Exceptions: `page.tsx`, `layout.tsx`, `error.tsx` (Next.js reserved)

- `[utility].ts`: Non-React utilities, functions, types (camelCase filename)
- Example: `qr-generator.ts`, `database.types.ts`, `use-toast.ts`

- `actions.ts`: Server Actions file (contains 'use server' functions)
- Example: `app/auth/actions.ts`

**Directories:**

- Feature-based organization: `components/{feature}/` groups related components
- Examples: `components/dashboard/`, `components/auth/`, `components/landing/`

- Utility directories: `lib/{category}/` groups related utilities
- Examples: `lib/supabase/` for client variants, `supabase/migrations/` for DB

**Components (PascalCase):**

- Export default or named: `export function AuthForm({ mode }: AuthFormProps)`
- Props interface: `interface {ComponentName}Props { ... }`
- Example: `interface AuthFormProps { mode: 'login' | 'signup' }`

**Functions (camelCase):**

- Utility functions: `generateQRCode()`, `createClient()`, `loginSchema()`
- Example: `export async function generateQRCode(campaignId: string): Promise<string>`

**Variables (camelCase):**

- React state: `const [campaigns, setCampaigns] = useState<Campaign[]>([])`
- Objects/refs: `const supabase = createClient()`

**Types (PascalCase):**

- Type definitions: `type UserRole = 'owner' | 'worker'`
- Interfaces: `interface Campaign { ... }`
- From database: `type Campaign = Database.public.Tables.campaigns.Row`

## Where to Add New Code

**New Feature (e.g., Analytics Dashboard):**

1. **Create page route:**
   - File: `app/analytics/page.tsx`
   - Contains: Layout wrapper, calls feature component

2. **Create feature component:**
   - Directory: `components/analytics/`
   - Files: `analytics-dashboard.tsx`, `analytics-chart.tsx`, `analytics-sidebar.tsx`

3. **Add Server Actions if needed:**
   - File: `app/analytics/actions.ts` if creating/updating data
   - Contains: `'use server'` functions for mutations

4. **Add types and validation:**
   - File: `lib/database.types.ts` (auto-updated from Supabase)
   - File: `lib/validations.ts` (add Zod schemas if new forms)

5. **Add tests (when testing is set up):**
   - File: `app/analytics/__tests__/page.test.ts` or similar

**New Component (e.g., SignSelector):**

1. **Create component file:**
   - File: `components/dashboard/sign-selector.tsx` (if feature-specific)
   - Or: `components/ui/sign-selector.tsx` (if generic UI component)
   - Start with: `'use client'` if interactive, omit if Server Component

2. **Add props interface:**
   ```typescript
   interface SignSelectorProps {
     onSelect: (signId: string) => void;
     campaignId: string;
   }
   ```

3. **Use existing patterns:**
   - Import UI components from `components/ui/`
   - Use `createClient()` for data fetching in client components
   - Use Supabase server client in Server Components

**New Utility/Helper:**

1. **Shared function:**
   - File: `lib/utils.ts` or create `lib/{category}/{name}.ts`
   - Example: `lib/geolocation-utils.ts`

2. **Validation schema:**
   - File: `lib/validations.ts`
   - Add Zod schema and export

3. **Custom hook:**
   - File: `hooks/use-{feature}.ts`
   - Example: `hooks/use-location.ts`

## Special Directories

**node_modules/:**
- Purpose: NPM dependencies (installed via `npm install`)
- Generated: Yes (created by package manager)
- Committed: No (listed in `.gitignore`)

**.next/:**
- Purpose: Build output from Next.js compiler
- Generated: Yes (created during `npm run build` or dev server)
- Committed: No (listed in `.gitignore`)

**.git/:**
- Purpose: Git repository metadata
- Generated: Yes (created by `git init`)
- Committed: N/A (git internal)

**supabase/migrations/:**
- Purpose: Database schema and migrations
- Generated: No (manually created SQL files)
- Committed: Yes (version controlled with code)

**.planning/codebase/:**
- Purpose: GSD codebase analysis documents
- Generated: No (manually maintained or generated by GSD tools)
- Committed: Yes (planning documentation)

**.claude/ and .bolt/:**
- Purpose: Project-specific Claude/Bolt configuration
- Generated: N/A (tool-specific)
- Committed: Typically yes

---

*Structure analysis: 2026-04-01*
