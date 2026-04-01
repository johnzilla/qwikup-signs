# Codebase Concerns

**Analysis Date:** 2026-04-01

## Tech Debt

**No Test Coverage:**
- Issue: Project has zero unit, integration, or end-to-end tests despite handling critical functionality (authentication, payments, location data)
- Files: Entire codebase - `app/`, `components/`, `lib/`
- Impact: Cannot reliably verify functionality changes, refactors risk breaking features silently, no regression detection
- Fix approach: Add vitest or Jest configuration, start with critical paths (auth actions in `app/auth/actions.ts`, Supabase queries in `components/worker/worker-dashboard.tsx` and `components/dashboard/owner-dashboard.tsx`), aim for >80% coverage on business logic

**Missing Error Recovery in Client Components:**
- Issue: Data loading operations use basic callbacks without retry logic or offline handling; network failures are silently ignored
- Files: `components/worker/worker-dashboard.tsx` (lines 71-114), `components/dashboard/owner-dashboard.tsx` (lines 59-76), `components/dashboard/dashboard-header.tsx` (lines 42-57)
- Impact: Users see stale data or empty states without knowing requests failed; no indication of retry capability
- Fix approach: Implement retry logic with exponential backoff, add loading/error states alongside success states, consider SWR or React Query for data fetching

**No Input Sanitization on Form Submissions:**
- Issue: Form data passed directly to Supabase without additional sanitization beyond Zod validation
- Files: `app/auth/actions.ts` (lines 78-101), `components/dashboard/owner-dashboard.tsx` (lines 78-101), `components/public/report-form.tsx` (lines 72-117)
- Impact: While Zod validates type/format, no protection against injection attacks or malicious content in long text fields
- Fix approach: Add HTML/content sanitization library (DOMPurify or similar), sanitize before storing any user-generated content

**Weak Password Requirements:**
- Issue: Minimum password length is only 6 characters, insufficient for security
- Files: `lib/validations.ts` (lines 5, 10)
- Impact: Accounts vulnerable to brute force attacks; does not meet modern security standards (typically 12+ chars recommended)
- Fix approach: Increase minimum length to 12, add complexity requirements (uppercase, lowercase, number, special char), consider passphrase support

## Security Considerations

**Exposed Public Keys in Environment Variables:**
- Risk: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are intentionally public but still need protection from exposure
- Files: `lib/supabase/client.ts`, `lib/supabase/middleware.ts`, `.env` (not read but known to exist)
- Current mitigation: Keys are anon-level in Supabase (read-only for most tables), Row Level Security (RLS) policies assumed to be in place
- Recommendations: Verify Supabase RLS policies are correctly enforced on all tables; add rate limiting on public endpoints to prevent abuse; consider separate keys for different user roles if Supabase supports it

**Missing CORS Headers and CSRF Protection:**
- Risk: No explicit CORS configuration visible; form submissions use basic POST without CSRF token verification
- Files: `app/auth/actions.ts`, `components/dashboard/owner-dashboard.tsx` (form submission at line 133)
- Current mitigation: Next.js Server Actions provide some CSRF protection via origin checking
- Recommendations: Explicitly configure Next.js security headers in `next.config.js`, verify Server Actions are indeed CSRF-protected in Next.js 15

**Geolocation Data Collection Without Consent:**
- Risk: Report form automatically requests user location without explicit opt-in consent notice
- Files: `components/public/report-form.tsx` (lines 35-50)
- Current mitigation: Browser prompts user for permission; error handling for denied access
- Recommendations: Add explicit consent checkbox before geolocation request, store consent in localStorage/DB, provide alternative ways to report without GPS

**No Rate Limiting on Public Endpoints:**
- Risk: Report submission (`components/public/report-form.tsx`) and photo uploads (`components/worker/photo-upload.tsx`) have no rate limiting
- Files: `components/public/report-form.tsx` (lines 99-106), `components/worker/photo-upload.tsx` (lines 44-56)
- Impact: Users could spam reports; workers could upload excessive files; potential for storage/DB exhaustion attacks
- Recommendations: Implement server-side rate limiting (e.g., via Supabase RLS or Next.js middleware), add client-side debouncing, track report frequency per IP/email

**Photo Upload File Type/Size Not Validated Server-Side:**
- Risk: File type and size checked client-side only; malicious clients can bypass checks
- Files: `components/worker/photo-upload.tsx` (lines 24-32)
- Impact: Could upload non-image files or oversized files to storage bucket
- Recommendations: Add server-side validation in Supabase storage policies or API route, use file signature verification (magic bytes), consider async virus scanning for user-uploaded content

**No Authentication Check Before Dashboard Access:**
- Risk: Dashboard pages don't validate user exists before rendering; only protected by middleware redirect
- Files: `app/dashboard/page.tsx`, `app/worker/dashboard/page.tsx`
- Current mitigation: Middleware in `lib/supabase/middleware.ts` checks auth status before these routes are accessible
- Recommendations: Add server-side verification in page components themselves (belt-and-suspenders), avoid relying solely on client-side role checks in `DashboardHeader`

## Performance Bottlenecks

**Unbounded Supabase Queries:**
- Problem: Several queries lack proper pagination; fetching all user data could be slow with large datasets
- Files: `components/worker/worker-dashboard.tsx` (line 89 - no limit, line 104-110 has `.limit(20)` inconsistently), `components/dashboard/owner-dashboard.tsx` (lines 64-68 - no limit)
- Cause: Early-stage app; no pagination implemented yet
- Improvement path: Add cursor-based pagination, implement infinite scroll with Intersection Observer, add search/filter to reduce data volume

**N+1 Query Pattern in Dashboard Components:**
- Problem: Profile data loaded separately from campaign/claim data; multiple Supabase round-trips
- Files: `components/dashboard/dashboard-header.tsx` (lines 42-57 loads profiles), `components/worker/worker-dashboard.tsx` (lines 73-114 makes 4 separate `.from()` calls)
- Cause: Modular component design with independent data loading
- Improvement path: Batch queries where possible using Supabase joins, use React Query/SWR to cache and deduplicate requests, consider API route aggregation layer

**Image Preview with FileReader for Large Files:**
- Problem: `components/worker/photo-upload.tsx` reads entire file into memory as DataURL for preview; 5MB limit could cause UI jank
- Files: `components/worker/photo-upload.tsx` (lines 34-36)
- Cause: Using base64 DataURL for client-side preview
- Improvement path: Use URL.createObjectURL() instead (no memory overhead), compress image client-side before upload, show placeholder during upload

**QR Code Generation Async Without Suspense:**
- Problem: `generateQRCode` in `lib/qr-generator.ts` is async but UI doesn't show loading state during generation
- Files: `lib/qr-generator.ts`, usage in components like `components/dashboard/qr-code-dialog.tsx`
- Cause: Promise-based API with no client loading indicator
- Improvement path: Wrap in React Suspense boundary, add explicit loading state, consider pre-generating QR codes server-side

## Fragile Areas

**Worker Dashboard Data Refresh:**
- Files: `components/worker/worker-dashboard.tsx` (lines 71-115)
- Why fragile: State mutations (`setBounties`, `setActiveClaims`, etc.) called in loadData callback; if any query fails, partial state updates leave UI in inconsistent state
- Safe modification: Wrap all queries in try-catch, validate all data before setting state, consider atomic state updates with useReducer
- Test coverage: No tests verify correct data display after claim/pickup verification

**Campaign QR Code Generation:**
- Files: `lib/qr-generator.ts` (lines 23-26), `components/dashboard/owner-dashboard.tsx` (line 93)
- Why fragile: `generateCampaignQRCode` creates non-standard QR format (text like `QR_CAMPAIGN_NAME_TIMESTAMP`); if lookup expects URL format, reports won't resolve campaigns
- Safe modification: Standardize QR format to always be `{APP_URL}/report/{campaign_id}`, store mapping server-side instead of encoding campaign ID in QR
- Test coverage: No tests verify QR codes can be scanned and resolved

**Auth Redirect Logic in Middleware:**
- Files: `lib/supabase/middleware.ts` (lines 49-57)
- Why fragile: Reads profile role from DB on every request; if profile missing/role null, user redirected to wrong dashboard or infinite loop
- Safe modification: Handle missing profile case explicitly (redirect to profile setup page), add console error logging for missing role
- Test coverage: No tests for edge cases (missing profile, null role)

**Form Error Handling:**
- Files: `app/auth/actions.ts` (lines 14, 22-24, 76-78, 91-93)
- Why fragile: Returns only first error message from Zod, Supabase errors shown directly to user (e.g., duplicate email error exposes that email is registered)
- Safe modification: Map Supabase error codes to user-friendly messages, don't expose database error details, add logging for debugging
- Test coverage: No tests verify error handling for edge cases (duplicate email, network failures)

## Scaling Limits

**Supabase Storage Bucket for Proof Photos:**
- Current capacity: Depends on Supabase plan; default plan has limits
- Limit: Storage costs scale linearly; could hit limits if workers upload many high-resolution photos
- Scaling path: Implement image compression/resizing (Sharp library), purge old/completed claim photos, consider S3 for cost optimization, add storage usage monitoring

**Real-Time Geolocation Map Display:**
- Current capacity: No map implementation yet (placeholder in `components/dashboard/owner-dashboard.tsx` lines 299-305)
- Limit: When implemented, displaying thousands of sign pins in real-time could cause UI lag
- Scaling path: Implement clustering libraries (Mapbox Cluster, Leaflet MarkerClusterGroup), use virtual scrolling, tile-based rendering for large datasets

**Concurrent Database Connections:**
- Current capacity: Supabase connection pool depends on plan
- Limit: Multiple simultaneous bounty claims could cause connection exhaustion or lock contention
- Scaling path: Add request queuing/throttling, implement optimistic locking for claim status updates, consider RabbitMQ for async claim processing

## Test Coverage Gaps

**Authentication Flow:**
- What's not tested: Login/signup with valid/invalid credentials, password mismatch, duplicate email signup, role-based redirects
- Files: `app/auth/actions.ts`, `components/auth/auth-form.tsx`
- Risk: Auth system is critical; untested changes could lock users out or expose privileged dashboards to wrong users
- Priority: **High**

**Bounty Claim Logic:**
- What's not tested: Claiming same bounty twice, claiming while already verified, completing claims without pickup verification
- Files: `components/worker/worker-dashboard.tsx` (lines 121-144, 146-164)
- Risk: Could allow double-payment or claim race conditions
- Priority: **High**

**Campaign Creation and Validation:**
- What's not tested: Creating campaigns with invalid bounty amounts (0, negative, over limits), XSS in campaign names/descriptions
- Files: `components/dashboard/owner-dashboard.tsx` (lines 78-101), `lib/validations.ts` (lines 22-26)
- Risk: Invalid campaigns could be stored; stored XSS in reports
- Priority: **Medium**

**Report Submission:**
- What's not tested: Submitting without location, duplicate reports, geolocation failure fallback
- Files: `components/public/report-form.tsx` (lines 72-117)
- Risk: Reports could be created with null location; no safety checks for spam
- Priority: **Medium**

**Photo Upload:**
- What's not tested: File upload failures, retry behavior, oversized files, non-image MIME types
- Files: `components/worker/photo-upload.tsx` (lines 20-57)
- Risk: Workers could lose progress if upload fails; no clear error messages
- Priority: **Medium**

**Role-Based Access Control:**
- What's not tested: Worker accessing owner dashboard directly, owner accessing worker routes
- Files: `lib/supabase/middleware.ts`, `components/dashboard/dashboard-header.tsx`
- Risk: Privilege escalation if middleware or role checks fail
- Priority: **High**

## Known Bugs

**Profile Initialization Race Condition:**
- Symptoms: New users see "Loading..." in avatar fallback indefinitely or show wrong name
- Files: `components/dashboard/dashboard-header.tsx` (lines 42-57)
- Trigger: Fast page navigation before profile query completes; component unmounts before setProfile fires
- Workaround: Reload page manually
- Root cause: No request cancellation on unmount; stale closure captures old setState

**Missing Campaign Validation on Create:**
- Symptoms: User can create campaign with empty name or invalid bounty
- Files: `components/dashboard/owner-dashboard.tsx` (lines 133-151)
- Trigger: Form has `required` attribute but no real-time validation feedback
- Workaround: None; silently fails server-side
- Root cause: Form validation only on server; no client feedback until after submission

**QR Code Lookup Failure Silent:**
- Symptoms: Report form shows "QR:" label but campaign not found; user sees generic campaign context
- Files: `components/public/report-form.tsx` (lines 52-70)
- Trigger: Invalid QR code or campaign already archived
- Workaround: Report still submits but may not credit correct campaign
- Root cause: No error handling if campaign lookup returns null; proceeds with `campaignId: null`

## Missing Critical Features

**No Payment Integration:**
- Problem: Bounty payments hardcoded as display only; no actual transfer mechanism implemented
- Blocks: Workers cannot receive earnings; owners cannot fund campaigns
- Impact: MVP incomplete for core business model

**No Notification System:**
- Problem: Workers not notified when new bounties available; owners not notified when signs reported
- Blocks: Users must manually refresh to find updates
- Impact: Poor user experience; lost business opportunities

**No Persistence of Unsaved Drafts:**
- Problem: If form submission fails, user loses all entered data
- Blocks: Bad UX for long forms; frustrating retry experience
- Impact: Abandoned signups/reports

**No Mobile Optimization for Worker Photos:**
- Problem: Photo upload works but no mobile camera integration beyond capture attribute
- Blocks: Workers must take screenshot of camera preview instead of direct submission
- Impact: Poor quality proof photos; friction in workflow

---

*Concerns audit: 2026-04-01*
