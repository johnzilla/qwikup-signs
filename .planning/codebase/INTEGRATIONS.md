# External Integrations

**Analysis Date:** 2026-04-01

## APIs & External Services

**QR Code Generation:**
- QRCode - QR code generation for campaigns
  - SDK/Client: `qrcode` npm package
  - Usage: `lib/qr-generator.ts` generates codes for sign tracking

**Geolocation/Mapping:**
- Not configured - Platform collects latitude/longitude coordinates for sign deployment and reporting
- Client-side location tracking for claims (pickup and dropoff)

## Data Storage

**Databases:**
- Supabase (PostgreSQL)
  - Connection: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - Client: `@supabase/supabase-js` (browser client) and `@supabase/ssr` (server-side)
  - Type definitions: `lib/database.types.ts`

**Database Schema:**
The application uses seven main tables:

1. **profiles** - User accounts
   - Stores user role (owner/worker), email, phone, company name
   - Tracks Stripe account integration via `stripe_account_id`
   - Tracks worker ratings and earnings

2. **campaigns** - Sign cleanup campaigns
   - Contains campaign metadata (name, description, bounty amount)
   - Tracks status (active, paused, completed)
   - Contains QR code identifier and deployment metrics

3. **sign_pins** - Individual sign locations
   - GPS coordinates and address for each sign
   - Tracks sign lifecycle status (deployed, reported, claimed, removed)
   - Timestamps for each status change

4. **reports** - Public sign reports
   - Allows anonymous or authenticated reporting of signs
   - Captures reporter contact info (email, phone optional)
   - Location coordinates and description

5. **claims** - Worker claims on sign removal bounties
   - Links workers to sign pins with bounty amount
   - Tracks claim status (claimed, pickup_verified, completed, cancelled)
   - Stores pickup and dropoff photos (URLs) and locations
   - Worker ratings after completion

6. **payouts** - Payment records
   - Tracks payments to workers via Stripe
   - Stores `stripe_payment_id` reference
   - Status tracking (pending, processed, failed)

7. **Foreign Key Relationships:**
   - campaigns → profiles (owner)
   - sign_pins → campaigns
   - reports → sign_pins, campaigns
   - claims → profiles (worker), sign_pins
   - payouts → profiles (worker), claims

**File Storage:**
- Not configured - Application is prepared for file uploads (photo URLs in claims table) but storage backend not implemented

**Caching:**
- Not implemented - No Redis or server-side caching configured

## Authentication & Identity

**Auth Provider:**
- Supabase Auth (built-in PostgreSQL Auth)
  - Implementation: Email/password authentication
  - SDK: `@supabase/supabase-js` provides `auth.signInWithPassword()` and `auth.signUp()`

**Auth Flow:**
- Server-side: `lib/supabase/server.ts` - Creates authenticated Supabase client with cookies
- Client-side: `lib/supabase/client.ts` - Browser Supabase client for client components
- Middleware: `middleware.ts` → `lib/supabase/middleware.ts` - Manages session updates on every request
- Protected Routes: `/dashboard` and `/worker/dashboard` require authentication (enforced in middleware)
- Role-based Routing: After login, users redirected to `/dashboard` (owner) or `/worker/dashboard` (worker)

**User Signup:**
- Server action in `app/auth/actions.ts` → `signup()`
- Creates Supabase Auth user with email/password
- Stores user metadata in Auth: `first_name`, `last_name`, `role`
- Creates corresponding profile record in `profiles` table
- Optional fields: phone, company_name

**User Login:**
- Server action in `app/auth/actions.ts` → `login()`
- Authenticates via Supabase Auth
- Queries `profiles` table to determine role and redirect destination

**Logout:**
- Server action in `app/auth/actions.ts` → `logout()`
- Calls `supabase.auth.signOut()`
- Redirects to home page

## Monitoring & Observability

**Error Tracking:**
- Not configured

**Logs:**
- Console logging only (via browser console and Node.js stdout)
- No centralized logging service

## CI/CD & Deployment

**Hosting:**
- Designed for Vercel (Next.js native) but can run on any Node.js server
- Docker-friendly (standard Node.js application)

**CI Pipeline:**
- Not configured in repository

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (required)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (required)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (required for server-side operations)
- `NEXT_PUBLIC_APP_URL` - Application base URL (required for some flows)

**Optional env vars:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key (not yet wired)
- `STRIPE_SECRET_KEY` - Stripe secret key (not yet wired)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signature (not yet wired)

**Secrets location:**
- Development: `.env.local` (gitignored)
- Production: Deployment platform environment variables (Vercel, Docker, etc.)

## Webhooks & Callbacks

**Incoming:**
- Stripe webhooks - Not yet implemented (infrastructure prepared in `payouts` table schema and env vars)

**Outgoing:**
- None configured

## API Routes

**Supabase Operations:**
- No custom API routes in `app/api/` directory
- All database operations performed via server actions and middleware
- Server actions in `app/auth/actions.ts` handle authentication flows

**Data Access Patterns:**
- Server components and server actions use `lib/supabase/server.ts` client
- Client components use `lib/supabase/client.ts` client
- Query examples:
  - `supabase.from('profiles').select('role').eq('id', userId)`
  - `supabase.from('campaigns').select('*').eq('owner_id', ownerId)`
  - Queries validated with Zod schemas in `lib/validations.ts`

---

*Integration audit: 2026-04-01*
