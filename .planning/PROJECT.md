# QwikUp Signs

## What This Is

A two-sided marketplace for sign cleanup accountability. Sign owners register their signs with QR codes and fund bounties for removal. Gig workers claim and remove signs, verified by photos and GPS. The public can report signs anonymously. Built as a portfolio piece showcasing marketplace product thinking.

## Core Value

Every sign has a responsible party, an expiration, and a funded removal path — turning sign litter from an unaccountable nuisance into a managed system.

## Requirements

### Validated

- ✓ User authentication with role-based access (owner/worker) — existing
- ✓ Campaign creation and management for sign owners — existing
- ✓ Sign pin tracking with GPS coordinates and lifecycle status — existing
- ✓ QR code generation linking signs to campaigns — existing
- ✓ Public sign reporting (anonymous or authenticated) — existing
- ✓ Worker claim system with bounty tracking — existing
- ✓ Photo verification for pickup and dropoff — existing
- ✓ Payment/payout record tracking via Stripe — existing
- ✓ Role-based dashboards (owner and worker views) — existing
- ✓ Middleware-enforced route protection — existing

### Active

- [ ] End-to-end flow validation (all existing features working together)
- [ ] README showcasing product thinking and marketplace mechanics
- [ ] Planning artifacts (REQUIREMENTS.md, ROADMAP.md) demonstrating process

### Out of Scope

- New feature development — portfolio piece, not active product
- Demand validation or user research — startup hypothesis shelved
- UI polish or redesign — value is in product thinking, not pixel output
- Mobile app — web-only
- Real Stripe integration testing — payment records exist but not live
- Social media shaming integration — unvalidated mechanism, deferred

## Context

- **Origin:** Personal frustration with sign litter. Politicians promise to pick up signs and ghost you. Property owners (especially commercial like gas stations) deal with constant sign clutter.
- **Key product insight:** The HOA gatekeeper model — "you can put signs up if they are QwikUp signs." This flips from reactive cleanup to proactive accountability. Sign owners pay because they can't advertise without registration.
- **Startup assessment:** Evaluated 2026-04-01. No demand evidence, no specific target customer validated, no willingness-to-pay tested. Shelved as startup, retained as portfolio piece.
- **Codebase state:** Vibe-coded, not validated end-to-end. Auth, campaigns, claims, reports, payouts all wired to Supabase but flows untested as a complete system.
- **Tech stack:** Next.js 15, React 19, Supabase (PostgreSQL), Radix UI, Tailwind CSS, Zod validation, QR code generation.

## Constraints

- **Effort:** Minimal — user has other projects. Only planning artifacts and README.
- **No code changes:** Codebase is final state as-is.
- **Portfolio framing:** README should frame as "a startup idea I explored, stress-tested, and shelved" to demonstrate judgment.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Shelve as startup | Zero demand evidence, no validated customer, other priorities | ✓ Good — honest assessment |
| Retain as portfolio piece | Codebase demonstrates real marketplace product thinking | — Pending |
| HOA gatekeeper model as key insight | Strongest structural innovation in the design | — Pending |
| GSD artifacts + README approach | Shows both product thinking and engineering process | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-01 after initialization*
