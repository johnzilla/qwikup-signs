# Architecture

**Analysis Date:** 2026-04-01

## Pattern Overview

**Overall:** Client-Server Next.js App Router with Server Components and Actions

**Key Characteristics:**
- Server-side rendering with Next.js 15 App Router (file-based routing)
- Server Actions for mutations (`'use server'` directive)
- Client Components with `'use client'` for interactive UI
- Supabase for authentication and real-time data access
- Separation of concerns between pages, components, and utilities
- Role-based access control via middleware

## Layers

**Presentation Layer:**
- Purpose: Renders UI and handles user interactions
- Location: `components/` directory
- Contains: React components organized by feature (auth, dashboard, landing, public, ui, worker)
- Depends on: Utility components from `components/ui/`, data from Supabase client, form validation from `lib/`
- Used by: Page components in `app/` directory

**Page Layer:**
- Purpose: Defines routes and page structure using App Router
- Location: `app/` directory with file-based routing
- Contains: Page components, layouts, error boundaries, loading states
- Depends on: Presentation components, Server Actions, server utilities
- Used by: Next.js router

**Server Actions Layer:**
- Purpose: Handles server-side mutations and protected operations
- Location: `app/auth/actions.ts` (primary), inline in components where needed
- Contains: Authentication (login, signup, logout), database writes
- Depends on: Supabase server client, validation schemas
- Used by: Client components via form actions or direct calls

**Data Access Layer:**
- Purpose: Provides Supabase client instances for browser and server contexts
- Location: `lib/supabase/` directory
- Contains: Browser client (`client.ts`), server client (`server.ts`), middleware (`middleware.ts`)
- Depends on: Supabase packages, Next.js primitives (cookies, headers)
- Used by: Components, Server Actions, middleware

**Middleware Layer:**
- Purpose: Intercepts requests for authentication and routing decisions
- Location: `middleware.ts` at project root
- Contains: Session management, protected route enforcement, role-based redirects
- Depends on: Supabase server client, routing utilities
- Used by: Next.js request pipeline

**Utility Layer:**
- Purpose: Shared helper functions and constants
- Location: `lib/` directory root
- Contains: Validation schemas (Zod), QR code generation, type definitions, utility functions
- Depends on: External packages (zod, qrcode)
- Used by: All other layers

## Data Flow

**Authentication Flow:**

1. User navigates to `/auth/login` or `/auth/signup`
2. `AuthForm` component renders with form fields
3. User submits form via `action={handleSubmit}`
4. `login()` or `signup()` Server Action executes
5. Supabase authenticates credentials
6. Profile created in `profiles` table (signup only)
7. Middleware intercepts subsequent requests
8. `updateSession()` checks auth status via `supabase.auth.getUser()`
9. User redirected to role-based dashboard (`/dashboard` for owner, `/worker/dashboard` for worker)

**Campaign Creation Flow:**

1. Owner visits `/dashboard`
2. `OwnerDashboard` loads campaigns from Supabase
3. User clicks "Create Campaign" button
4. Dialog opens with `CreateCampaignForm`
5. User submits form data
6. `handleCreateCampaign()` executes in component
7. Campaign inserted to `campaigns` table with `generateCampaignQRCode()`
8. QR code string stored in database
9. Campaigns list refreshes via `loadCampaigns()`

**Report Submission Flow:**

1. Public user scans QR code linking to `/report/[qrCode]`
2. `QRReportPage` renders with QR code as param
3. `ReportForm` component:
   - Requests browser geolocation
   - Looks up campaign by QR code from `campaigns` table
   - User fills in optional description/contact
4. Form submission inserts to `reports` table
5. Toast notification confirms success
6. Page shows success state

**Worker Claim Flow:**

1. Worker views `/worker/dashboard`
2. `WorkerDashboard` fetches available bounties from `sign_pins` table (status='deployed')
3. Worker clicks "Claim Bounty"
4. Record inserted to `claims` table with status='claimed'
5. Worker uploads photo and submits verification
6. Claim status updated to 'pickup_verified'
7. Upon completion, status moves to 'completed'
8. Payout record created in `payouts` table

**State Management:**

- **Page/Component State:** Uses React `useState()` for UI state (dialogs, forms, loading)
- **Authentication State:** Managed by Supabase, accessed via `supabase.auth.getUser()`
- **Data Cache:** Loaded on component mount with `useCallback` + `useEffect`, refetched on actions
- **No Global State:** No Redux, Zustand, or Context API for data (Supabase is source of truth)

## Key Abstractions

**Supabase Client Variants:**

1. **Browser Client** (`lib/supabase/client.ts`):
   - Purpose: Client-side data access in `'use client'` components
   - Usage: `const supabase = createClient(); await supabase.from('campaigns').select('*')`
   - Pattern: Created fresh on each call (lightweight)

2. **Server Client** (`lib/supabase/server.ts`):
   - Purpose: Server-side data access in Server Components and Actions
   - Usage: `const supabase = await createClient(); await supabase.auth.signUp(...)`
   - Pattern: Uses Next.js `cookies()` for session management

3. **Middleware Client** (`lib/supabase/middleware.ts`):
   - Purpose: Request interception for auth and role-based routing
   - Usage: Automatic, called by `middleware.ts`
   - Pattern: Checks user, redirects to `/auth/login` if protected route accessed without auth

**Validation Schema Abstractions:**

- Location: `lib/validations.ts`
- Pattern: Zod schema definitions for form validation
- Schemas: `loginSchema`, `signupSchema`, `campaignSchema`, `reportSchema`
- Usage: `schema.safeParse(formData)` returns `{ success, error, data }`

**Type Definitions:**

- Location: `lib/database.types.ts`
- Purpose: TypeScript types for all Supabase tables (auto-generated from schema)
- Pattern: `Database.public.Tables.campaigns.Row` for type-safe queries
- Enums: `UserRole`, `CampaignStatus`, `SignStatus`, `ClaimStatus`, `PayoutStatus`

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Every page load (wraps entire app)
- Responsibilities: Global CSS, metadata, Toaster component, Inter font

**Landing Page (Public):**
- Location: `app/page.tsx` → `components/landing/landing-page.tsx`
- Triggers: User visits `/`
- Responsibilities: Hero section, feature showcases, role-based call-to-action, footer

**Authentication Pages:**
- Locations: `app/auth/login/page.tsx`, `app/auth/signup/page.tsx`
- Triggers: User clicks login/signup or middleware redirect
- Responsibilities: Render `AuthForm` component, handle form submission via Server Actions

**Owner Dashboard:**
- Location: `app/dashboard/page.tsx` → `components/dashboard/owner-dashboard.tsx`
- Triggers: Owner logs in, visited via `/dashboard`
- Responsibilities: List campaigns, create campaigns, view campaign stats, display QR codes

**Worker Dashboard:**
- Location: `app/worker/dashboard/page.tsx` → `components/worker/worker-dashboard.tsx`
- Triggers: Worker logs in, visited via `/worker/dashboard`
- Responsibilities: Show available bounties (map view), list active claims, show completed claims with earnings

**Report Page:**
- Location: `app/report/[qrCode]/page.tsx` → `components/public/report-form.tsx`
- Triggers: Public user scans QR code or visits `/report/{qrCode}`
- Responsibilities: Auto-detect location, fetch campaign details, submit report form

**Middleware Entry:**
- Location: `middleware.ts` at project root
- Triggers: Every HTTP request matching the config matcher
- Responsibilities: Session management, protected route enforcement, role-based redirects

## Error Handling

**Strategy:** Graceful degradation with user feedback

**Patterns:**

1. **Form Validation Errors:**
   - Zod schemas return error on `safeParse()`
   - First error message displayed in red banner
   - User sees form again to correct and resubmit

2. **Supabase Query Errors:**
   - Caught with `if (error)` after query
   - Logged to console
   - Toast notifications display friendly message: "Could not find the associated campaign"

3. **Authentication Errors:**
   - `login()`/`signup()` catch Supabase auth errors
   - Return `{ error: errorMessage }` to client
   - Client displays in error banner

4. **Geolocation Errors:**
   - Fallback message: "Unable to get your location. Please enable location services."
   - User can still submit report without geolocation (lat/lng optional in some flows)

5. **Server Action Errors:**
   - Try-catch blocks in `login()`, `signup()` actions
   - Returns error object or redirects on success
   - Client-side `useTransition()` catches errors from actions

## Cross-Cutting Concerns

**Logging:**
- Approach: `console.error()` and `console.log()` for development
- No structured logging library (Sentry/LogRocket not configured)
- Async operations log errors to console on failure

**Validation:**
- Approach: Zod schemas enforce type-safe validation
- Pattern: `schema.safeParse(data)` returns typed result
- Location: `lib/validations.ts` contains all schemas
- Applied at: Form submission (Server Actions), database inserts

**Authentication:**
- Approach: Supabase built-in auth with row-level security (RLS) expected but not visible
- Pattern: `supabase.auth.getUser()` checks session, `supabase.auth.signUp()` creates account
- Roles: `'owner'` vs `'worker'` stored in `profiles.role`
- Middleware enforces: Redirects to `/auth/login` for protected routes without valid session

**Authorization:**
- Approach: Role-based redirects in middleware
- Pattern: Protected paths list in `middleware.ts`: `['/dashboard', '/worker/dashboard']`
- Owner dashboards check `owner_id === user.id` before displaying data
- No explicit RLS policies visible in client code (assumed Supabase-side)

---

*Architecture analysis: 2026-04-01*
