# Technology Stack

**Analysis Date:** 2026-04-01

## Languages

**Primary:**
- TypeScript 5.7 - Entire application codebase
- JavaScript - Next.js configuration and build files

**Secondary:**
- CSS - Styling via Tailwind CSS (in `app/globals.css`)

## Runtime

**Environment:**
- Node.js - Development and production runtime (version specified in `.nvmrc` if present)

**Package Manager:**
- npm - Version management via package-lock.json
- Lockfile: Present (`package-lock.json`)

## Frameworks

**Core:**
- Next.js 15.3.0 - Full-stack React framework with App Router
- React 19.0.0 - UI component library
- React DOM 19.0.0 - DOM rendering for React

**UI Components:**
- Radix UI - Unstyled, accessible component library providing:
  - `@radix-ui/react-avatar` - User avatars
  - `@radix-ui/react-checkbox` - Checkbox inputs
  - `@radix-ui/react-dialog` - Modal dialogs
  - `@radix-ui/react-dropdown-menu` - Dropdown menus
  - `@radix-ui/react-label` - Form labels
  - `@radix-ui/react-popover` - Popover menus
  - `@radix-ui/react-progress` - Progress indicators
  - `@radix-ui/react-select` - Select dropdowns
  - `@radix-ui/react-separator` - Visual separators
  - `@radix-ui/react-slot` - Slot composition
  - `@radix-ui/react-switch` - Toggle switches
  - `@radix-ui/react-tabs` - Tabbed interfaces
  - `@radix-ui/react-toast` - Toast notifications (underlying for Sonner)
  - `@radix-ui/react-tooltip` - Tooltips

**Styling:**
- Tailwind CSS 3.4.0 - Utility-first CSS framework
- Tailwind Merge 2.5.2 - Utility class conflict resolution
- Tailwind CSS Animate 1.0.7 - Animation utilities
- PostCSS 8.4.47 - CSS transformation tool
- Autoprefixer 10.4.20 - Browser prefix automation
- Class Variance Authority 0.7.0 - Component variant patterns

**Forms & Validation:**
- React Hook Form 7.53.0 - Form state management
- `@hookform/resolvers` 3.9.0 - Schema validation integration
- Zod 3.23.8 - TypeScript-first schema validation

**UI Feedback:**
- Sonner 1.5.0 - Toast notification system (using Radix Toast)

**Utilities:**
- Lucide React 0.446.0 - Icon library
- Date-fns 3.6.0 - Date utility functions
- QRCode 1.5.4 - QR code generation
- Vaul 0.9.9 - Drawer component (side menus)
- clsx 2.1.1 - Conditional className utility
- Next Themes 0.3.0 - Dark/light mode theming

**Testing:**
- Not configured in package.json

**Build/Dev:**
- ESLint 9.0.0 - Code linting
- ESLint Config Next 15.3.0 - Next.js linting rules

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` 2.50.3 - Supabase JavaScript client for database and auth
- `@supabase/ssr` 0.5.0 - Supabase SSR integration for Next.js (server/client auth flows)

**Infrastructure:**
- Next.js 15.3.0 - Full-stack framework with SSR, API routes, and middleware
- React 19.0.0 - Core UI rendering library

## Configuration

**Environment:**
- `.env.local.example` - Example configuration file (never committed)
- Environment variables required:
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public)
  - `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-only)
  - `NEXT_PUBLIC_APP_URL` - Application base URL
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key (optional, not yet wired)
  - `STRIPE_SECRET_KEY` - Stripe secret key (optional, not yet wired)
  - `STRIPE_WEBHOOK_SECRET` - Stripe webhook signature (optional, not yet wired)

**Build:**
- `next.config.js` - Next.js configuration (minimal; only sets `images.unoptimized: true`)
- `tsconfig.json` - TypeScript compiler options with path alias `@/*` for root directory
- `tailwind.config.ts` - Tailwind CSS configuration with dark mode support via class
- `postcss.config.js` - PostCSS configuration (Tailwind and Autoprefixer)

## Platform Requirements

**Development:**
- Node.js (latest LTS recommended)
- npm package manager
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` required for local development

**Production:**
- Deployment target: Vercel (Next.js native) or any Node.js hosting
- Environment variables must be set in deployment platform

---

*Stack analysis: 2026-04-01*
