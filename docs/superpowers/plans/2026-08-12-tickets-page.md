# In-House Ticketing (`/tickets`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's offsite "Get Tickets" link (currently `https://centrestage.org/`) with an in-house `/tickets` page that sells General Admission tickets via a Stripe Payment Link, with a confirmation page at `/tickets/thank-you`.

**Architecture:** `/tickets` is a static Next.js Pages Router page presenting show details and a "Buy Tickets" button that links to a Stripe Payment Link (created by hand in the Stripe Dashboard — not via API). Stripe owns payment processing, inventory/capacity enforcement, name collection, and receipt email. After payment, Stripe redirects the buyer back to `/tickets/thank-you` on this site. No API routes, database, or webhooks are introduced.

**Tech Stack:** Next.js 16 (Pages Router), React 19, TypeScript, Tailwind CSS v4. No test framework exists in this repo — verification is done via `npm run build` (which runs the TypeScript compiler and statically prerenders every page to HTML under `.next/server/pages/`) plus grepping the generated HTML for expected content, and manual QA in a browser.

## Global Constraints

- Single ticket type: General Admission, placeholder price **$25** (exact price to be confirmed later by Joe).
- Placeholder capacity: **250** tickets (exact venue capacity to be confirmed later by Joe).
- Purchaser name only is collected — no per-attendee names, no billing address.
- No custom backend, database, or webhook code — Stripe Payment Link handles inventory, payment, and receipts.
- Stripe Payment Link itself is configured **by hand in the Stripe Dashboard**, not via code or the Stripe API.
- Match the existing site's dark gothic visual language: `font-heading` (Cinzel) for headings, `bg-bg-dark`/`bg-bg-light` gradients, `text-gold`, `text-text-primary`, `text-text-muted`, `text-red-soft` color tokens (defined in `styles/globals.css`), gold-bordered CTA buttons matching `components/TicketButton.tsx`'s existing style, and the `Ornament` component for section dividers.
- Show details to repeat consistently: October 17, 2026, 7:00 PM, Centre Stage, Greenville, SC (as already used in `components/Hero.tsx` and `components/Details.tsx`).

---

### Task 1: Add the tickets payment link constant

**Files:**
- Modify: `lib/site.ts`

**Interfaces:**
- Produces: `TICKETS_PAYMENT_LINK_URL: string`, exported from `lib/site.ts`, consumed by Task 3's `components/Tickets.tsx`.

- [ ] **Step 1: Add the constant**

Edit `lib/site.ts` to add a new exported constant below the existing ones:

```ts
export const SITE_URL = "https://theperfecttooth.com";
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;
export const TICKETS_PAYMENT_LINK_URL =
  "https://buy.stripe.com/REPLACE_WITH_REAL_PAYMENT_LINK";
```

This is a placeholder value. Task 5 replaces it with the real Stripe Payment Link URL once that's created by hand in the Stripe Dashboard.

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/site.ts
git commit -m "feat(tickets): add placeholder Stripe payment link constant"
```

---

### Task 2: Point the existing "Get Tickets" button at `/tickets`

**Files:**
- Modify: `components/TicketButton.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: `TicketButton` now renders an internal `next/link` to `/tickets` instead of an external anchor to `centrestage.org`. `Hero.tsx`, `Details.tsx`, and `Footer.tsx` all render `<TicketButton />` unchanged — this task only changes what's inside that component.

- [ ] **Step 1: Rewrite the component**

Replace the full contents of `components/TicketButton.tsx`:

```tsx
import Link from "next/link";

export default function TicketButton() {
  return (
    <Link
      href="/tickets"
      className="inline-block border border-gold text-gold px-9 py-3 text-xs tracking-[0.25em] uppercase font-heading transition-colors duration-300 hover:bg-gold hover:text-bg-dark"
    >
      Get Tickets
    </Link>
  );
}
```

- [ ] **Step 2: Build and verify no `centrestage.org` references remain in the homepage output**

Run: `npm run build && grep -c 'centrestage.org' .next/server/pages/index.html; grep -c 'href="/tickets"' .next/server/pages/index.html`
Expected: first command outputs `0` (or the grep itself reports no match / exits non-zero — either is fine, it means the string is gone); second command outputs `3` (Hero, Details, and Footer each render one `TicketButton`).

- [ ] **Step 3: Commit**

```bash
git add components/TicketButton.tsx
git commit -m "feat(tickets): point Get Tickets button at internal /tickets page"
```

---

### Task 3: Build the `/tickets` page

**Files:**
- Create: `components/Tickets.tsx`
- Create: `pages/tickets.tsx`

**Interfaces:**
- Consumes: `TICKETS_PAYMENT_LINK_URL` from `lib/site.ts` (Task 1), `Ornament` from `components/Ornament.tsx` (existing).
- Produces: `Tickets` component (default export, no props) rendered by the `/tickets` route. Later tasks don't depend on this component's internals.

- [ ] **Step 1: Create the page content component**

Create `components/Tickets.tsx`:

```tsx
import Ornament from "./Ornament";
import { TICKETS_PAYMENT_LINK_URL } from "@/lib/site";

export default function Tickets() {
  return (
    <section className="animate-fade-in-up min-h-screen bg-gradient-to-b from-bg-dark via-bg-light to-bg-dark py-24 px-6">
      <div className="mx-auto max-w-xl text-center">
        <div className="relative flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
          <span className="text-gold text-[10px] tracking-[0.4em] uppercase text-center">
            Wolfgang Finds the Perfect Tooth
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
        </div>

        <h1 className="font-heading text-4xl text-text-primary tracking-wider uppercase mb-4">
          Get Your Tickets
        </h1>
        <p className="text-sm text-red-soft italic mb-12">
          One night only. Hell doesn&apos;t wait.
        </p>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 mb-12">
          <div>
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-2">
              Date
            </p>
            <p className="text-lg text-text-primary">October 17, 2026</p>
          </div>
          <div>
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-2">
              Time
            </p>
            <p className="text-lg text-text-primary">7:00 PM</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-2">
              Venue
            </p>
            <p className="text-lg text-text-primary">Centre Stage</p>
            <p className="text-sm text-text-muted mt-1">Greenville, SC</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-2">
              Price
            </p>
            <p className="text-lg text-text-primary">
              $25 &middot; General Admission
            </p>
          </div>
        </div>

        <Ornament />

        <a
          href={TICKETS_PAYMENT_LINK_URL}
          className="inline-block border border-gold text-gold px-9 py-3 text-xs tracking-[0.25em] uppercase font-heading transition-colors duration-300 hover:bg-gold hover:text-bg-dark"
        >
          Buy Tickets
        </a>

        <p className="text-xs text-text-muted mt-6">
          You&apos;ll complete your purchase securely via Stripe, then return
          here for confirmation.
        </p>
      </div>
    </section>
  );
}
```

Note: this anchor deliberately has no `target="_blank"` — the buyer needs to stay in the same tab so Stripe's post-payment redirect back to `/tickets/thank-you` lands in that same tab.

- [ ] **Step 2: Create the page wrapper**

Create `pages/tickets.tsx`:

```tsx
import Head from "next/head";
import Tickets from "@/components/Tickets";
import { SITE_URL, OG_IMAGE_URL } from "@/lib/site";

export default function TicketsPage() {
  return (
    <>
      <Head>
        <title>Tickets — Wolfgang Finds the Perfect Tooth</title>
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Tickets — Wolfgang Finds the Perfect Tooth"
        />
        <meta
          property="og:description"
          content="An absurdist emo theater road trip through hell."
        />
        <meta property="og:url" content={`${SITE_URL}/tickets`} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Tickets — Wolfgang Finds the Perfect Tooth"
        />
        <meta
          name="twitter:description"
          content="An absurdist emo theater road trip through hell."
        />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
      </Head>
      <main>
        <Tickets />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Build and verify the page renders with expected content**

Run: `npm run build && grep -o 'Get Your Tickets' .next/server/pages/tickets.html && grep -o 'buy.stripe.com[^"]*' .next/server/pages/tickets.html`
Expected: first grep outputs `Get Your Tickets`; second grep outputs the placeholder payment link URL from Task 1 (confirms the button links to the constant, not a hardcoded string).

- [ ] **Step 4: Commit**

```bash
git add components/Tickets.tsx pages/tickets.tsx
git commit -m "feat(tickets): add /tickets page with show recap and Buy Tickets CTA"
```

---

### Task 4: Build the `/tickets/thank-you` confirmation page

**Files:**
- Create: `components/TicketsThankYou.tsx`
- Create: `pages/tickets/thank-you.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks except standard site conventions (color tokens, `Ornament`).
- Produces: `TicketsThankYou` component (default export, no props) rendered by the `/tickets/thank-you` route. Nothing later depends on this.

- [ ] **Step 1: Create the confirmation content component**

Create `components/TicketsThankYou.tsx`:

```tsx
import Link from "next/link";
import Ornament from "./Ornament";

export default function TicketsThankYou() {
  return (
    <section className="animate-fade-in-up flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-bg-dark via-bg-light to-bg-dark py-24 px-6 text-center">
      <div className="mx-auto max-w-xl">
        <h1 className="font-heading text-4xl text-gold tracking-wider uppercase mb-6">
          You&apos;re In
        </h1>
        <p className="text-lg text-text-primary mb-4">
          Your ticket purchase is confirmed. Check your email for your
          receipt.
        </p>
        <p className="text-sm text-text-muted mb-12">
          We&apos;ll see you October 17, 2026 at Centre Stage. Hell awaits.
        </p>
        <Ornament />
        <Link
          href="/"
          className="inline-block border border-gold text-gold px-9 py-3 text-xs tracking-[0.25em] uppercase font-heading transition-colors duration-300 hover:bg-gold hover:text-bg-dark"
        >
          Back to the Show
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create the page wrapper**

Create `pages/tickets/thank-you.tsx`:

```tsx
import Head from "next/head";
import TicketsThankYou from "@/components/TicketsThankYou";
import { SITE_URL } from "@/lib/site";

export default function TicketsThankYouPage() {
  return (
    <>
      <Head>
        <title>Thank You — Wolfgang Finds the Perfect Tooth</title>
        <meta name="robots" content="noindex" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Thank You — Wolfgang Finds the Perfect Tooth"
        />
        <meta property="og:url" content={`${SITE_URL}/tickets/thank-you`} />
      </Head>
      <main>
        <TicketsThankYou />
      </main>
    </>
  );
}
```

`robots: noindex` keeps this transactional page out of search results — it's only ever reached via Stripe's post-payment redirect.

- [ ] **Step 3: Build and verify the page renders with expected content**

Run: `npm run build && grep -o "You're In" .next/server/pages/tickets/thank-you.html`
Expected: outputs `You're In`.

- [ ] **Step 4: Commit**

```bash
git add components/TicketsThankYou.tsx pages/tickets/thank-you.tsx
git commit -m "feat(tickets): add /tickets/thank-you confirmation page"
```

---

### Task 5: Configure the Stripe Payment Link and wire in the real URL

This task is manual dashboard configuration, not code — but it's required before the feature is actually usable, so it's documented here in full per the design spec (`docs/superpowers/specs/2026-08-12-tickets-page-design.md`).

**Files:**
- Modify: `lib/site.ts`

- [ ] **Step 1: Create the Stripe account (if not already done)**

Sign up / log in at https://dashboard.stripe.com. Complete business verification — this is required before Payment Links can go live (test mode works without full verification).

- [ ] **Step 2: Create the product and price**

In the Stripe Dashboard: Product catalog → Add product.
- Name: `Wolfgang Finds the Perfect Tooth — General Admission`
- Price: `$25.00` USD, one-time (adjust if Joe has confirmed a different final price by this point)

- [ ] **Step 3: Create the Payment Link**

From the product, create a Payment Link with these settings:
- **Quantity:** enable "Allow customers to adjust quantity"
- **Limit the number of payments:** enabled, set to `250` (adjust if Joe has confirmed a different final capacity by this point), with a custom deactivation message, e.g.: `Wolfgang Finds the Perfect Tooth is sold out. Thank you for your interest — follow @wolfgangwallaceband for updates.`
- **Collect customer name:** enabled (individual name), full billing address NOT required
- **After payment → redirect to a website:** `https://theperfecttooth.com/tickets/thank-you`
- **Branding:** upload/set colors to match the site's palette (gold `#CC9900` accent, dark background) under the Payment Link's or account's branding settings, as closely as Stripe's options allow

- [ ] **Step 4: Test the link in Stripe test mode**

Toggle Stripe Dashboard to test mode, repeat Steps 2–3 in test mode (or use the "copy to test mode" option if available), and get the test-mode Payment Link URL.

Temporarily set `lib/site.ts`'s `TICKETS_PAYMENT_LINK_URL` to this test-mode URL, run `npm run dev`, and in a browser:
1. Go to `/tickets`, click "Buy Tickets".
2. Complete checkout using Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC, and a test name.
3. Confirm you're redirected to `/tickets/thank-you` and see "You're In".
4. In the Stripe Dashboard (test mode), confirm the payment appears with the name you entered.
5. Temporarily edit the test Payment Link's "limit the number of payments" down to `1` less than current test purchases, reload the test Payment Link URL directly in a browser, and confirm Stripe shows the sold-out/deactivation message. Then restore the limit to `250`.
6. On a phone (or browser dev tools device emulation), check `/tickets` and `/tickets/thank-you` look correct at mobile widths.

- [ ] **Step 5: Go live**

Once test mode is verified, switch the Stripe Dashboard to live mode, repeat Step 3 to create the real live Payment Link, and update `lib/site.ts`:

```ts
export const TICKETS_PAYMENT_LINK_URL = "https://buy.stripe.com/<real-live-link-id>";
```

Do one real low-stakes purchase yourself on the live link to confirm everything works end-to-end, then refund it from the Stripe Dashboard.

- [ ] **Step 6: Commit**

```bash
git add lib/site.ts
git commit -m "feat(tickets): wire in live Stripe payment link"
```

---

## Post-Plan Note

After Task 5, `components/TicketButton.tsx` across the whole site (hero, details, footer) and the new `/tickets` page will route ticket buyers entirely through this site and Stripe — `centrestage.org` is no longer referenced anywhere in the codebase. See `docs/superpowers/specs/2026-08-12-tickets-page-design.md` for the full design rationale, scope, and out-of-scope items (multiple ticket tiers, per-attendee names, custom admin dashboard, QR codes — all intentionally deferred).
