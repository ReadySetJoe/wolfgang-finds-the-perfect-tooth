# Ticket Purchase Source Attribution — Design

## Overview

Track which channel (Instagram, a specific QR code, a direct link someone shared, etc.) led a given customer to buy a ticket, without building new backend infrastructure or passing custom metadata to Stripe. The goal is to be able to look at a completed Stripe payment and know "this customer came from Instagram" (or from a specific post, or a specific QR code placement).

**Context:** The site currently sends buyers to a static Stripe Payment Link (`TICKETS_PAYMENT_LINK_URL` in `lib/site.ts`) with no backend, no API routes, and no analytics installed (per [[2026-08-12-tickets-page-design]]). Marketing links (Instagram bio, QR codes on flyers/posters, direct shares) may point at the homepage or directly at `/tickets`.

## Scope

**In scope:**
- Capturing a freeform source label from a `?src=` query param on any page
- Persisting that label across navigation (e.g. homepage → `/tickets`) and across return visits, until overwritten by a new one
- Attaching the label to the Stripe Payment Link as `client_reference_id` so it's visible on the resulting payment in the Stripe Dashboard
- Basic sanitization so a malformed or oversized query string can't break the link or exceed Stripe's field limit

**Explicitly out of scope:**
- An enum/allow-list of source values — sources are freeform strings (e.g. `ig-story-oct12`, `qr-flyer-lobby`) chosen at link-creation time, not defined in code
- Any new backend, API route, database, or webhook
- Multi-field metadata (campaign, landing page, etc.) — only a single source label, via `client_reference_id`
- A custom admin page or report — the Stripe Dashboard's payment list/search is the viewing surface, matching the existing convention from [[2026-08-12-tickets-page-design]]

## Architecture

**Approach: capture `?src=` client-side, persist in `localStorage`, forward as Stripe's `client_reference_id` URL parameter on the existing Payment Link.**

Stripe Payment Links natively accept `client_reference_id` as a URL query parameter on the link itself; Stripe carries that value through to the resulting Checkout Session and payment record automatically. This avoids any custom metadata API calls or backend — the same "no backend" constraint that shaped the original ticketing design continues to hold here.

- A marketing link looks like `theperfecttooth.com/?src=ig-story-oct12` or `theperfecttooth.com/tickets?src=qr-flyer-lobby`.
- On every page load, a global capture step reads the `src` param (if present), sanitizes it, and writes it to `localStorage`, overwriting any previously stored value (last-touch: whichever link was clicked most recently before purchase wins).
- On `/tickets`, the Buy Tickets button reads the stored value back and appends it to `TICKETS_PAYMENT_LINK_URL` as `?client_reference_id=<value>` (or `direct` if nothing was ever captured).
- Stripe forwards `client_reference_id` through checkout with no further action needed; it appears on the Checkout Session and Payment record in the Dashboard, and is filterable/searchable there.

**Why not server-side Checkout Sessions with full metadata?** That would support multiple attribution fields at once, but requires introducing this site's first API route (using the currently-unused `STRIPE_SECRET_KEY`/`STRIPE_PRICE_ID` in `.env.local`) and changing the Buy Tickets button from a static link to a fetch-then-redirect. A single source label doesn't need that — `client_reference_id` on the existing static link covers the actual requirement with zero new backend surface.

**Why `localStorage` over `sessionStorage`?** Attribution should survive someone clicking a link today and completing the purchase in a later browser session (e.g. days later), not just within one tab session.

## Code Changes

- `lib/attribution.ts` (new) — small client-only utility:
  - `captureSource()`: reads `src` from `window.location.search`, sanitizes it (strip to `[A-Za-z0-9_-]`, trim, truncate to Stripe's 200-character `client_reference_id` limit), and writes it to `localStorage` under a single key if present and non-empty. No-ops server-side / when `window` is undefined.
  - `getSource()`: reads the stored value back from `localStorage`, returning `"direct"` if nothing was ever captured. No-ops (returns `"direct"`) server-side.
- `pages/_app.tsx` — calls `captureSource()` once on mount so any page (not just `/tickets`) can be a valid entry point for a tracked link.
- `components/Tickets.tsx` — the Buy Tickets `<a href>` is built from `getSource()` at render time (via `useEffect`/`useState`, since `localStorage` isn't available during server render) instead of using `TICKETS_PAYMENT_LINK_URL` directly: `${TICKETS_PAYMENT_LINK_URL}?client_reference_id=${encodeURIComponent(source)}`.
- No new dependencies, no API routes, no database.

## Error Handling / Edge Cases

- **No `src` ever captured:** Buy Tickets link falls back to `client_reference_id=direct`.
- **Malformed/oversized `src` value:** sanitization strips anything outside a safe charset and truncates to 200 characters before it's stored or used, so it can't break the URL or exceed Stripe's field limit.
- **Multiple different links clicked before purchase:** last-touch — the most recently captured value overwrites the previous one, matching "the link they clicked before buying."
- **`localStorage` unavailable** (e.g. private browsing edge cases, disabled storage): capture/read silently no-ops and the link falls back to `direct` — buying still works, only attribution is lost for that visitor.

## Testing / QA Plan (manual — no automated test framework in this repo)

1. Visit `/?src=ig-story-oct12`, navigate to `/tickets`, and inspect the Buy Tickets link's `href` to confirm it ends in `?client_reference_id=ig-story-oct12`.
2. Visit `/tickets` directly with no query param and confirm the link falls back to `client_reference_id=direct`.
3. Visit `/tickets?src=qr-flyer-lobby` directly (no homepage hop) and confirm the same capture works on a non-homepage entry point.
4. In Stripe **test mode**, complete a purchase through a tracked link and confirm the source value appears on the resulting payment/Checkout Session in the test Dashboard.
5. Confirm a `src` value containing unsafe characters (e.g. `?src=<script>` or an overly long string) is sanitized/truncated before being stored or sent to Stripe.
