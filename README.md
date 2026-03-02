# QwikUp Signs - Sign Cleanup & Bounty Platform

A platform that transforms sign cleanup into a community-driven initiative through GPS tracking, QR codes, and bounty payments.

## Overview

QwikUp Signs connects sign owners, gig workers, and the public to maintain clean, compliant communities. Sign owners create campaigns with bounties, the public reports expired signs via QR codes, and gig workers claim and complete sign removal for payment.

### Features

- **Multi-role system** -- sign owners, gig workers, and public reporters
- **GPS tracking** -- precise location for deployment, reporting, and pickup verification
- **QR code generation** -- unique downloadable QR codes per campaign
- **Bounty system** -- campaign-level bounty amounts for sign cleanup
- **Photo verification** -- proof of pickup via Supabase Storage
- **Form validation** -- zod schemas for all user inputs
- **Auth middleware** -- protected routes with role-based redirects
- **Mobile-first** -- responsive design with camera capture support

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript 5.9
- **Styling**: Tailwind CSS 3.4, shadcn/ui components
- **Database**: Supabase PostgreSQL with Row Level Security
- **Auth**: Supabase Auth (email/password) via `@supabase/ssr`
- **Storage**: Supabase Storage for proof photos
- **Validation**: Zod
- **Payments**: Stripe Connect (planned, not yet wired up)

## Project Structure

```
├── app/
│   ├── auth/
│   │   ├── login/page.tsx       # Login page
│   │   ├── signup/page.tsx      # Signup page
│   │   └── actions.ts           # Server actions (login, signup, logout)
│   ├── dashboard/page.tsx       # Owner dashboard
│   ├── worker/dashboard/page.tsx # Worker dashboard
│   ├── report/
│   │   ├── page.tsx             # Generic report form
│   │   └── [qrCode]/page.tsx   # QR-linked report form
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/                      # shadcn/ui primitives
│   ├── auth/auth-form.tsx       # Login/signup form
│   ├── dashboard/
│   │   ├── owner-dashboard.tsx  # Campaign management + stats
│   │   ├── dashboard-header.tsx # Nav + user menu + logout
│   │   └── qr-code-dialog.tsx   # QR code viewer/download
│   ├── worker/
│   │   ├── worker-dashboard.tsx # Bounties, claims, history
│   │   └── photo-upload.tsx     # Camera/file upload component
│   ├── landing/landing-page.tsx
│   └── public/report-form.tsx   # Public sign report form
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser Supabase client
│   │   ├── server.ts            # Server Supabase client
│   │   └── middleware.ts        # Session refresh + route protection
│   ├── database.types.ts        # Full typed schema (6 tables)
│   ├── validations.ts           # Zod schemas
│   ├── qr-generator.ts          # QR code generation
│   └── utils.ts                 # Tailwind cn() helper
├── supabase/
│   ├── config.toml              # Local Supabase config
│   └── migrations/
│       ├── 20250704171535_wispy_grass.sql  # Core schema + RLS
│       └── 20260301000000_add_storage_bucket.sql # Photo storage
├── middleware.ts                 # Next.js middleware (auth guard)
└── .env.local.example           # Environment variable template
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (cloud or self-hosted)
- Git

### Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/qwikup-signs/qwikup-signs.git
   cd qwikup-signs
   npm install --legacy-peer-deps
   ```

2. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Supabase URL and anon key. Stripe keys are optional for now.

3. **Run Supabase migrations**
   Apply the SQL files in `supabase/migrations/` to your Supabase project, either via the Supabase dashboard SQL editor or the Supabase CLI:
   ```bash
   supabase db push
   ```

4. **Start dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Database Schema

Six tables with RLS enabled on all:

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles linked to `auth.users`, with role (`owner`/`worker`) |
| `campaigns` | Sign campaigns with bounty amounts and QR codes |
| `sign_pins` | Individual sign locations with status tracking |
| `reports` | Public reports of expired signs with GPS coordinates |
| `claims` | Worker claims on bounties with pickup/dropoff verification |
| `payouts` | Payment records (pending Stripe integration) |

Custom enums: `user_role`, `campaign_status`, `sign_status`, `claim_status`, `payout_status`.

## User Roles

**Sign Owners** -- create campaigns, set bounty amounts, generate QR codes, view deployment/removal stats.

**Gig Workers** -- browse available bounties, claim signs, upload photo proof of pickup, track earnings.

**Public Users** -- scan QR codes on expired signs, submit reports with GPS location. No account required.

## Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional (for admin/server operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional (Stripe -- not yet wired up)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in the Vercel dashboard
3. Deploy -- build command is `npm run build`, output is `.next`

### DigitalOcean / Self-hosted

1. Build: `npm run build`
2. Start: `npm start`
3. Set environment variables on the host
4. Point your Supabase config to your self-hosted instance

## Roadmap

- [ ] Stripe Connect integration for worker payouts
- [ ] Interactive map view (Leaflet/Mapbox) for sign pins
- [ ] Real-time notifications via Supabase Realtime
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Multi-language support

## License

Apache License 2.0 -- see [LICENSE](LICENSE).
