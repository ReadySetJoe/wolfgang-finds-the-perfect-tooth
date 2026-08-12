# Ticket Capacity Enforcement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static Stripe Payment Link on `/tickets` with a dynamic Checkout Session created per purchase, gated by a live capacity check against Stripe — since Stripe removed the Payment Link feature the original design relied on to stop sales at capacity.

**Architecture:** One serverless API route (`pages/api/checkout.ts`) creates a fresh Stripe Checkout Session per purchase after checking a live sold-count (queried from Stripe's PaymentIntents Search API, filtered by a metadata tag this app sets on every session it creates). `/tickets` server-renders with the same live count so it can show "Sold Out" without a client round-trip when capacity is already exhausted. No database, no webhooks — Stripe remains the only ledger of sales.

**Tech Stack:** Next.js 16 (Pages Router), React 19, TypeScript, `stripe` npm package (official Node SDK). No test framework exists in this repo — verification is `npx tsc --noEmit`, `npm run build`, and manual `curl`/browser checks against a locally running dev server.

## Global Constraints

- `TICKET_CAPACITY = 250` (placeholder — update when Joe confirms real venue capacity).
- `TICKET_UNIT_PRICE_CENTS = 2500` ($25.00 placeholder — must stay in sync with whatever Price is referenced by `STRIPE_PRICE_ID`).
- `MAX_QUANTITY_PER_ORDER = 8` (arbitrary per-order cap, prevents one order from claiming a large block of remaining inventory).
- Metadata tag used to identify this show's sales: key `ticket_type`, value `wolfgang-ga`.
- **No database, no webhooks.** Stripe's own PaymentIntents are the only record of sales.
- **Fail open, not closed, on our own infrastructure errors.** If the live sold-count check itself fails (network error, Stripe outage, bad credentials), treat sold count as `0` for that request (log the error, don't block sales) rather than showing a false "Sold Out." The real backstop against overselling during an outage is that Stripe's own checkout session creation will itself fail if Stripe is genuinely unreachable — that failure surfaces to the buyer as a normal error, not a crash.
- Two new **server-only** environment variables: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`. Never reference either from a component that renders in the browser — only from `pages/api/*`, `getServerSideProps`, or modules exclusively imported by those.
- Same-tab navigation to Stripe's hosted checkout (no `target="_blank"`) — unchanged reasoning from the original design: Stripe's post-payment redirect must land back in the same tab.
- Match the existing site's dark gothic visual language (`font-heading`, `bg-bg-dark`/`bg-bg-light`, `text-gold`, `text-text-primary`, `text-text-muted`, `text-red-soft`, the gold-bordered CTA button style, `Ornament` divider) — same tokens used throughout this codebase.
- No automated tests exist in this repo. Implementers cannot obtain real Stripe credentials in their environment — verification is limited to `tsc`/`build`/lint-level checks and manual `curl` checks of code paths that don't require a real Stripe call to succeed (see each task's verification steps). Do not attempt to fabricate a successful real Stripe API call in this environment.

---

### Task 1: Stripe client and ticket configuration/helper

**Files:**
- Modify: `package.json` (add `stripe` dependency)
- Create: `lib/stripe.ts`
- Create: `lib/tickets.ts`

**Interfaces:**
- Produces: `stripe` (a configured `Stripe` client instance), exported from `lib/stripe.ts`.
- Produces: `TICKET_CAPACITY: number`, `TICKET_UNIT_PRICE_CENTS: number`, `MAX_QUANTITY_PER_ORDER: number`, `TICKET_METADATA_KEY: string`, `TICKET_METADATA_VALUE: string`, and `getTicketsSoldCount(): Promise<number>`, all exported from `lib/tickets.ts`. Task 2 and Task 3 both import from this file — it's the single source of truth for capacity logic, so those tasks don't duplicate the counting logic.

- [ ] **Step 1: Install the Stripe SDK**

Run: `npm install stripe`
Expected: `package.json` and `package-lock.json` gain a `stripe` entry (dependencies, not devDependencies).

- [ ] **Step 2: Create the Stripe client module**

Create `lib/stripe.ts`:

```ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
```

- [ ] **Step 3: Create the ticket configuration and sold-count helper**

Create `lib/tickets.ts`:

```ts
import { stripe } from "./stripe";

export const TICKET_CAPACITY = 250;
export const TICKET_UNIT_PRICE_CENTS = 2500;
export const MAX_QUANTITY_PER_ORDER = 8;
export const TICKET_METADATA_KEY = "ticket_type";
export const TICKET_METADATA_VALUE = "wolfgang-ga";

export async function getTicketsSoldCount(): Promise<number> {
  try {
    const paymentIntents = await stripe.paymentIntents
      .search({
        query: `status:"succeeded" AND metadata["${TICKET_METADATA_KEY}"]:"${TICKET_METADATA_VALUE}"`,
        limit: 100,
      })
      .autoPagingToArray({ limit: 1000 });

    const totalCents = paymentIntents.reduce((sum, pi) => sum + pi.amount, 0);

    return Math.round(totalCents / TICKET_UNIT_PRICE_CENTS);
  } catch (error) {
    // Fail open: an infra hiccup here shouldn't block ticket sales.
    // Stripe's own checkout session creation is the real backstop if
    // Stripe itself is unreachable.
    console.error("Failed to fetch tickets sold count from Stripe:", error);
    return 0;
  }
}
```

- [ ] **Step 4: Verify the module compiles**

Create a temporary local `.env.local` (if you don't already have one) with placeholder values sufficient to let the app boot — these are not real credentials and will not successfully call Stripe:

```
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_PRICE_ID=price_placeholder
```

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json lib/stripe.ts lib/tickets.ts
git commit -m "feat(tickets): add Stripe client and ticket capacity helper"
```

Do NOT commit `.env.local` — it's already covered by this repo's `.env*` gitignore rule.

---

### Task 2: Checkout API route

**Files:**
- Create: `pages/api/checkout.ts`

**Interfaces:**
- Consumes: `stripe` from `lib/stripe.ts` (Task 1); `TICKET_CAPACITY`, `MAX_QUANTITY_PER_ORDER`, `TICKET_METADATA_KEY`, `TICKET_METADATA_VALUE`, `getTicketsSoldCount()` from `lib/tickets.ts` (Task 1); `SITE_URL` from `lib/site.ts` (existing).
- Produces: `POST /api/checkout` accepting JSON body `{ quantity: number }`, responding `200 { url: string }` on success, `400 { error: string }` for an invalid quantity, `409 { error: "sold_out" }` if insufficient capacity remains, `500 { error: "checkout_failed" }` if Stripe's session creation itself fails. Task 3's client code calls this exact contract.

- [ ] **Step 1: Create the API route**

Create `pages/api/checkout.ts`:

```ts
import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
import {
  TICKET_CAPACITY,
  MAX_QUANTITY_PER_ORDER,
  TICKET_METADATA_KEY,
  TICKET_METADATA_VALUE,
  getTicketsSoldCount,
} from "@/lib/tickets";
import { SITE_URL } from "@/lib/site";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const quantity = Number(req.body?.quantity);

  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > MAX_QUANTITY_PER_ORDER
  ) {
    return res.status(400).json({ error: "invalid_quantity" });
  }

  const sold = await getTicketsSoldCount();
  const remaining = Math.max(0, TICKET_CAPACITY - sold);

  if (quantity > remaining) {
    return res.status(409).json({ error: "sold_out" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID as string,
          quantity,
        },
      ],
      payment_intent_data: {
        metadata: {
          [TICKET_METADATA_KEY]: TICKET_METADATA_VALUE,
        },
      },
      custom_fields: [
        {
          key: "purchaser_name",
          label: { type: "custom", custom: "Full name" },
          type: "text",
        },
      ],
      success_url: `${SITE_URL}/tickets/thank-you`,
      cancel_url: `${SITE_URL}/tickets`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Failed to create Stripe checkout session:", error);
    return res.status(500).json({ error: "checkout_failed" });
  }
}
```

- [ ] **Step 2: Verify build and the validation path that doesn't require a real Stripe call to succeed**

Run: `npm run build`
Expected: build succeeds (this typechecks and bundles the API route even though it isn't statically prerendered).

With the placeholder `.env.local` from Task 1 still in place, run: `npm run dev` in the background, then in another terminal:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" -d '{"quantity": 0}'
```
Expected: `400` (quantity `0` is invalid — this path is rejected before any Stripe call is made, so it works even with placeholder credentials).

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" -d '{"quantity": 100}'
```
Expected: `400` (exceeds `MAX_QUANTITY_PER_ORDER` of 8 — also rejected before any Stripe call).

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" -d '{"quantity": 1}'
```
Expected: `500` — this is correct with placeholder credentials: validation passes, the (fail-open) sold-count check returns `0` sold since the placeholder key can't authenticate with Stripe, so it proceeds to attempt session creation, which Stripe rejects for an invalid key. A clean `500 { "error": "checkout_failed" }` (not an unhandled crash or hung request) demonstrates the error handling works. This is the expected result in this environment — do not attempt to make this return `200`, that requires real Stripe credentials which are out of scope for this task's verification (Joe verifies the real success path manually per the design spec's QA plan).

Stop the dev server after checking.

- [ ] **Step 3: Commit**

```bash
git add pages/api/checkout.ts
git commit -m "feat(tickets): add dynamic checkout session API route with live capacity gate"
```

---

### Task 3: Wire up `/tickets` with server-side capacity check and a purchase UI

**Files:**
- Modify: `pages/tickets.tsx`
- Modify: `components/Tickets.tsx`
- Modify: `lib/site.ts` (remove now-unused `TICKETS_PAYMENT_LINK_URL`)

**Interfaces:**
- Consumes: `TICKET_CAPACITY`, `MAX_QUANTITY_PER_ORDER`, `getTicketsSoldCount()` from `lib/tickets.ts` (Task 1); `POST /api/checkout` contract from Task 2.
- Produces: `Tickets` component now takes a `remaining: number` prop (previously took no props). Nothing later in this plan depends on this, but note the changed signature if this component is touched again in future work.

- [ ] **Step 1: Remove the unused Payment Link constant**

In `lib/site.ts`, remove these two lines (the constant is no longer referenced anywhere after this task):

```ts
export const TICKETS_PAYMENT_LINK_URL =
  "https://buy.stripe.com/test_eVqfZhgPL0RK9IJacS6Vq00";
```

`lib/site.ts` should now contain only:

```ts
export const SITE_URL = "https://theperfecttooth.com";
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;
```

- [ ] **Step 2: Add the server-side capacity check to the `/tickets` page**

Replace the full contents of `pages/tickets.tsx`:

```tsx
import Head from "next/head";
import type { GetServerSideProps } from "next";
import Tickets from "@/components/Tickets";
import { SITE_URL, OG_IMAGE_URL } from "@/lib/site";
import { TICKET_CAPACITY, getTicketsSoldCount } from "@/lib/tickets";

interface TicketsPageProps {
  remaining: number;
}

export const getServerSideProps: GetServerSideProps<TicketsPageProps> =
  async () => {
    const sold = await getTicketsSoldCount();
    const remaining = Math.max(0, TICKET_CAPACITY - sold);

    return { props: { remaining } };
  };

export default function TicketsPage({ remaining }: TicketsPageProps) {
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
        <Tickets remaining={remaining} />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Rebuild the `Tickets` component with a quantity selector, purchase flow, and sold-out state**

Replace the full contents of `components/Tickets.tsx`:

```tsx
import { useState } from "react";
import Ornament from "./Ornament";
import { MAX_QUANTITY_PER_ORDER } from "@/lib/tickets";

interface TicketsProps {
  remaining: number;
}

export default function Tickets({ remaining }: TicketsProps) {
  const maxQuantity = Math.min(remaining, MAX_QUANTITY_PER_ORDER);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(
          data.error === "sold_out"
            ? "Sorry, we just sold out."
            : "Something went wrong. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

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

        {remaining <= 0 ? (
          <p className="font-heading text-lg text-red-soft uppercase tracking-wider">
            Sold Out
          </p>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-center gap-3">
              <label
                htmlFor="quantity"
                className="text-xs text-gold tracking-[0.3em] uppercase"
              >
                Quantity
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="bg-bg-dark border border-gold text-text-primary px-3 py-2"
              >
                {Array.from({ length: maxQuantity }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={handleBuy}
              disabled={isSubmitting}
              className="inline-block border border-gold text-gold px-9 py-3 text-xs tracking-[0.25em] uppercase font-heading transition-colors duration-300 hover:bg-gold hover:text-bg-dark disabled:opacity-50"
            >
              {isSubmitting ? "Redirecting..." : "Buy Tickets"}
            </button>

            {error && <p className="text-sm text-red-soft mt-4">{error}</p>}
          </>
        )}

        <p className="text-xs text-text-muted mt-6">
          You&apos;ll complete your purchase securely via Stripe, then return
          here for confirmation.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds. In the route summary printed by the build, `/tickets` should no longer be marked `○ (Static)` the way it was before — it now has `getServerSideProps`, so Next.js marks it as server-rendered per-request instead (the exact symbol/label Next.js uses for this may vary by version; what matters is it's no longer grouped with the static routes like `/`, `/404`, `/splash`). This is an expected and correct change, not a regression.

With the placeholder `.env.local` from Task 1 still in place, run `npm run dev` and load `http://localhost:3000/tickets` in a browser:
- Expected: because the placeholder Stripe key can't authenticate, `getTicketsSoldCount()` fails open (returns `0`), so the page renders with `remaining = 250` and shows the quantity selector (1–8) and "Buy Tickets" button — it should NOT show "Sold Out" and should NOT crash or 500.
- Click "Buy Tickets". Expected: the button briefly shows "Redirecting...", then an inline error message appears ("Something went wrong. Please try again.") — this is correct given the placeholder credentials (mirrors Task 2's `curl` check, exercised through the real UI this time). Do not treat this error message as a bug; it's the expected result without real Stripe credentials.

Stop the dev server after checking.

- [ ] **Step 5: Commit**

```bash
git add pages/tickets.tsx components/Tickets.tsx lib/site.ts
git commit -m "feat(tickets): wire /tickets to live capacity check and dynamic checkout flow"
```

---

## Post-Plan Note

Once these three tasks are merged, Joe needs to: (1) add `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` to `.env.local` for local testing (test-mode values first) and to Vercel's environment variables before deploying; (2) follow the design spec's QA plan (`docs/superpowers/specs/2026-08-12-tickets-capacity-enforcement-design.md`) to verify a real purchase completes end-to-end and that the capacity cutoff actually triggers at the configured limit; (3) update `TICKET_CAPACITY` in `lib/tickets.ts` once the real venue capacity is confirmed, and `TICKET_UNIT_PRICE_CENTS` if the final price differs from $25. Never paste the real `STRIPE_SECRET_KEY` into a chat/transcript — set it directly via `.env.local` or the Vercel dashboard.
