# In-House Ticketing (`/tickets`) — Design

## Overview

Replace the current "Get Tickets" flow — which links offsite to `https://centrestage.org/` — with a ticket-purchase experience built into this site at `/tickets`. This removes the dependency on the venue's third-party box office link for ticket sales while keeping the actual payment processing on a PCI-compliant, hosted payment page (Stripe) rather than building custom payment infrastructure.

**Context:** Single performance, single date (October 17, 2026, 7:00 PM), single venue (Centre Stage, Greenville, SC). No recurring shows, no multiple ticket tiers.

## Scope

**In scope:**
- A `/tickets` page on this site with show details and a purchase CTA
- One ticket type: General Admission, $25/ticket (exact price/capacity to be confirmed later — currently placeholder values)
- Capacity enforcement (~250 tickets, placeholder pending real venue capacity number)
- Purchaser name collection for a door list
- Post-purchase confirmation (email receipt + on-site thank-you page)

**Explicitly out of scope (deferred or not needed):**
- Multiple ticket tiers/pricing (only one show, one price)
- Per-attendee names within a single order (purchaser name + quantity is sufficient for door check-in)
- A custom admin/sales dashboard — the Stripe Dashboard's payment list serves as the door-check reference and sales visibility
- Custom backend, database, or webhook infrastructure
- QR-code or scannable ticket generation

## Architecture

**Approach: Stripe Payment Link, linked from an on-site `/tickets` page.**

- A single Stripe Payment Link (created by hand in the Stripe Dashboard, not via API/code) represents the GA ticket product.
- The Payment Link is configured with:
  - Adjustable quantity, so a single order can buy multiple tickets
  - An inventory/"limit the number of payments" cap (250 placeholder) so Stripe automatically deactivates the link once sold out, with a custom sold-out message matching the show's tone
  - Name collection (purchaser name only — no full billing address)
  - An after-payment redirect to `https://theperfecttooth.com/tickets/thank-you`
  - Branding (colors/logo) matched to the site as closely as Stripe's branding settings allow
- This site's `/tickets` page is purely presentational plus a link/button to the Payment Link — no API routes, no database, no webhooks. Stripe owns inventory tracking, payment processing, and receipt delivery.
- Sales visibility and the door-entry list both come directly from the Stripe Dashboard's payment list (name + quantity per order) — no custom reporting is built.

**Why not a custom Checkout Session (dynamically created via our own API route)?** That approach would require us to track remaining inventory ourselves (a database or KV store, plus a webhook to confirm payment completion) to safely enforce the capacity cap under concurrent purchases. A static Payment Link with Stripe's built-in inventory limit avoids that infrastructure entirely, which fits a single one-night show.

## Page & Purchase Flow

1. Visitors reach "Get Tickets" CTAs throughout the marketing site (hero, details section, footer) as they do today, but these now link internally to `/tickets` instead of directly offsite.
2. `/tickets` recaps the show (title, date, time, venue) and price, styled consistently with the rest of the site (dark gothic theme, Cinzel headings, gold accents), and presents a single "Buy Tickets" button.
3. "Buy Tickets" links out to the Stripe Payment Link — the one unavoidable offsite hop, required for PCI-compliant payment handling.
4. On the Stripe-hosted page, the buyer selects quantity, enters their name and payment details, and completes checkout.
5. On success, Stripe redirects back to `/tickets/thank-you` on this site, which confirms the purchase and reminds the buyer to check their email for the receipt. Stripe also sends an automatic email receipt.
6. If the Payment Link has reached its inventory limit, Stripe shows its own deactivated-link page with a custom sold-out message — no additional logic is needed on this site to detect or display sold-out state.

## Stripe Configuration (manual, dashboard-only)

- One Product: "Wolfgang Finds the Perfect Tooth — General Admission", one Price: $25 (placeholder, to be confirmed).
- One Payment Link on that product, configured per the Architecture section above.
- Configuration is done by hand in the Stripe Dashboard — not scripted via the Stripe API — since this is a single static link for a single show and does not need to be reproducible or automated.
- Joe is responsible for creating/accessing the Stripe account, completing business verification, and configuring the Payment Link in the dashboard; this is account-level setup outside of what can be done via code changes in this repo.

## Code Changes

- `lib/site.ts` — add a `TICKETS_PAYMENT_LINK_URL` constant holding the Stripe Payment Link URL.
- `components/TicketButton.tsx` — change the link target from `https://centrestage.org/` to `/tickets` (internal Next.js link).
- `pages/tickets.tsx` — new page: show recap (title, date, venue, price) and a "Buy Tickets" button linking to `TICKETS_PAYMENT_LINK_URL`, styled consistently with the rest of the site.
- `pages/tickets/thank-you.tsx` — new lightweight confirmation page shown after Stripe redirects back post-payment.
- No new dependencies, no API routes, no database.

## Error Handling / Edge Cases

- **Payment declines or failures:** handled entirely by Stripe's hosted checkout page; no custom handling needed on this site.
- **Buyer closes tab mid-checkout:** no partial state exists on this site to clean up — Stripe manages the checkout session lifecycle, and no inventory is deducted unless payment completes.
- **Sold out:** Stripe's built-in deactivated-link page and custom message handle this; no detection logic needed here.

## Testing / QA Plan (manual — no automated test framework in this repo)

1. Set up the Payment Link in **Stripe test mode** first; point a local `/tickets` build at it and run a full test purchase using Stripe's test card numbers.
2. Verify: quantity selection works, the name field is collected, redirect to `/tickets/thank-you` happens after payment, and a receipt email arrives.
3. Temporarily set the inventory limit very low (e.g. 1) in test mode to confirm the sold-out message displays correctly once exhausted, then reset the limit.
4. Check `/tickets` and `/tickets/thank-you` responsiveness on mobile, matching the rest of the site.
5. Once verified in test mode, switch in the live Payment Link and do one final real low-stakes purchase (e.g. refund it afterward) before announcing publicly.

## Open Items (to confirm before or during implementation)

- Exact ticket price (currently $25 placeholder) and exact venue capacity (currently 250 placeholder) — Joe will confirm exact numbers later.
