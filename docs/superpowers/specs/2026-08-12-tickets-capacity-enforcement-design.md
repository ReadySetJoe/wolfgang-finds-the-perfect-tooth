# Ticket Capacity Enforcement — Design

## Overview

Supersedes the "Stripe Payment Link, no backend" architecture from `2026-08-12-tickets-page-design.md` for one reason: Stripe has removed the "limit the number of payments" feature from Payment Links that the original design relied on to auto-deactivate sales at capacity. Without it, a static Payment Link has no way to stop selling once the venue is full.

This design replaces the static Payment Link with a small serverless capacity check + dynamic Checkout Session creation. It stays well short of a full ticketing backend: **no database, no webhooks**. Stripe remains the sole source of truth for "how many have sold" — we just ask it live instead of relying on a link-level setting that no longer exists.

## Problem With the Superseded Design

- The static Payment Link has no built-in mechanism left to stop selling at 250 tickets.
- A page-load-only "sold out" check (re-checking Stripe once when `/tickets` renders) would only hide the button in our UI — the underlying Payment Link itself would remain purchasable indefinitely if visited directly, and the check would go stale between page loads.

## Chosen Approach: Dynamic Checkout Session with a Live Capacity Gate

Instead of a pre-made Payment Link, `/tickets` now creates a fresh Stripe Checkout Session per purchase attempt, via one serverless API route, gating on real-time sold count at the moment of the click — not just at page load.

**Flow:**
1. `/tickets` loads and server-renders with a live capacity check (`getServerSideProps` calls the same sold-count helper described below). If sold count is already at or over capacity, the page renders a "Sold Out" state — no button, no client-side call needed.
2. If tickets remain, the page shows a quantity selector (1 up to the smaller of remaining capacity or a per-order cap of 8) and a "Buy Tickets" button.
3. Clicking "Buy Tickets" calls a new API route (`POST /api/checkout`) with the chosen quantity.
4. The API route re-checks sold count live (defense against the page having gone stale since render), and only if `quantity <= remaining` does it create a Stripe Checkout Session for that quantity and return its hosted URL.
5. The client redirects the browser (`window.location.href`) to that URL, in the same tab — same reasoning as before, so Stripe's post-payment redirect lands back on this site.
6. Stripe's Checkout Session `success_url` points to `/tickets/thank-you` (unchanged from before); `cancel_url` points back to `/tickets`.
7. If the API route finds insufficient remaining capacity, it returns an error and the page shows a sold-out message instead of redirecting.

**Counting "sold so far":** every Checkout Session this app creates tags its underlying PaymentIntent with `metadata: { ticket_type: "wolfgang-ga" }`. A shared helper queries Stripe's PaymentIntents Search API for `status:"succeeded" AND metadata["ticket_type"]:"wolfgang-ga"`, and sums each result's `amount` divided by the ticket unit price (in cents) to get total quantity sold — this correctly accounts for multi-ticket orders without needing to expand line items.

**Known limitation, accepted deliberately:** Stripe's Search API is eventually consistent (data becomes searchable within about a minute, not immediately after write — [Stripe's documented caveat](https://docs.stripe.com/search#data-freshness)). Combined with the gap between the capacity check and session creation, there's a narrow window where two near-simultaneous purchases at the last ticket could both succeed, oversized by a small number of tickets. This is an accepted tradeoff for a single one-night show — closing it fully would require a database or webhook-based reservation system, which is explicitly out of scope (see below).

## Explicitly Out of Scope

- **Database or persistent order storage.** Stripe's own records remain the only ledger of sales.
- **Webhooks.** No webhook endpoint is added; the capacity check reads live via the Search API instead of reacting to events.
- **Airtight overselling prevention.** The narrow race-window limitation above is accepted, not solved. If a future show needs guaranteed exact capacity enforcement, that would need the full DB + webhook approach considered and rejected in the original design, and should get its own design pass.
- **Per-attendee names, multiple ticket tiers, admin dashboard, QR codes** — unchanged from the original design; still out of scope.

## Configuration

**New environment variables (server-only, never sent to the browser):**
- `STRIPE_SECRET_KEY` — Stripe secret API key. Test mode key while testing, live mode key in production.
- `STRIPE_PRICE_ID` — the ID of the existing $25 GA Price object Joe already created in the Stripe Dashboard while setting up the (now-unused) Payment Link. Test mode and live mode have different Price IDs, so this env var is what changes when switching modes — no code change needed.

Both are added to `.env.local` for local development (already covered by the repo's blanket `.env*` gitignore rule) and must be added to Vercel's environment variables for production before deploy.

**Code constants (not secret, safe to commit):**
- `TICKET_CAPACITY = 250` in `lib/tickets.ts` (placeholder, same as the original design — update when Joe confirms the real venue capacity).
- Ticket metadata key/value (`ticket_type: "wolfgang-ga"`) used to tag and later count this show's sales, also in `lib/tickets.ts`.
- Per-order quantity cap of 8 (prevents one order from claiming a large block of remaining inventory in one purchase; arbitrary but reasonable for a small venue).

## Code Changes

- Add `stripe` npm package (official Node SDK) as a dependency.
- `lib/stripe.ts` (new) — server-only Stripe client instance, initialized from `STRIPE_SECRET_KEY`. Never imported from a component that renders in the browser.
- `lib/tickets.ts` (new) — `TICKET_CAPACITY`, `TICKET_METADATA_KEY`/`TICKET_METADATA_VALUE`, `TICKET_UNIT_PRICE_CENTS`, `MAX_QUANTITY_PER_ORDER`, and a shared `getTicketsSoldCount(): Promise<number>` helper (PaymentIntents Search + summation), used by both `pages/tickets.tsx`'s `getServerSideProps` and the checkout API route — kept in one place so the two call sites can't drift.
- `pages/api/checkout.ts` (new) — `POST` handler: validates `quantity` is an integer between 1 and `MAX_QUANTITY_PER_ORDER`, calls `getTicketsSoldCount()`, rejects with a sold-out error if insufficient capacity remains, otherwise creates a Checkout Session (`line_items` referencing `STRIPE_PRICE_ID` at the requested quantity, `payment_intent_data.metadata` tagging, `success_url` → `/tickets/thank-you`, `cancel_url` → `/tickets`, a required `custom_fields` entry collecting the purchaser's full name) and responds with `{ url }`.
- `pages/tickets.tsx` (modified) — becomes server-rendered (`getServerSideProps` calls `getTicketsSoldCount()`, computes `remaining = Math.max(0, TICKET_CAPACITY - sold)`, passes it as a prop).
- `components/Tickets.tsx` (modified) — accepts `remaining: number`. Renders a "Sold Out" message when `remaining <= 0`. Otherwise renders a quantity selector (1 to `min(remaining, MAX_QUANTITY_PER_ORDER)`) and a "Buy Tickets" button wired to `POST /api/checkout`, redirecting to the returned URL on success or showing an inline error/sold-out message on failure.
- `lib/site.ts` — remove `TICKETS_PAYMENT_LINK_URL` (no longer used).

## Testing / QA Plan

Same test-mode-first discipline as the original design:
1. Set `STRIPE_SECRET_KEY` (test mode) and `STRIPE_PRICE_ID` (test mode Price, already created) in `.env.local`.
2. Temporarily set `TICKET_CAPACITY` to a small number (e.g. 2) to reach the cap quickly.
3. Run through: buy 1 ticket (succeeds, redirects to `/tickets/thank-you`), buy another to hit the cap, then reload `/tickets` and confirm it now shows "Sold Out", and confirm a direct `POST /api/checkout` at that point returns the sold-out error rather than a session URL.
4. Restore `TICKET_CAPACITY` to the real value before going live.
5. Switch `STRIPE_SECRET_KEY`/`STRIPE_PRICE_ID` to live-mode values in Vercel's environment variables when ready to sell for real; no code changes needed for that switch.
