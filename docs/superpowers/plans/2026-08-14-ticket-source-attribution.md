# Ticket Purchase Source Attribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture a freeform marketing-link source label (e.g. `ig-story-oct12`, `qr-flyer-lobby`) from a `?src=` query param, persist it across navigation and return visits, and forward it to Stripe as `client_reference_id` on the existing Buy Tickets link so completed purchases are attributable to a source in the Stripe Dashboard.

**Architecture:** A small client-only utility (`lib/attribution.ts`) reads `?src=` off the URL, sanitizes it, and stores it in `localStorage`. `pages/_app.tsx` calls this capture function on every route change so any page can be a tracked entry point. `components/Tickets.tsx` reads the stored value back and appends it to the existing static `TICKETS_PAYMENT_LINK_URL` as `client_reference_id`, which Stripe natively carries through checkout to the resulting payment record. No API routes, database, or webhooks are introduced.

**Tech Stack:** Next.js 16 (Pages Router), React 19, TypeScript. No test framework exists in this repo — verification is done via `npx tsc --noEmit`, `npm run build` + grepping generated HTML, and manual browser QA (including `localStorage` inspection via devtools), matching the convention established in `docs/superpowers/plans/2026-08-12-tickets-page.md`.

**Spec:** `docs/superpowers/specs/2026-08-14-ticket-source-attribution-design.md`

## Global Constraints

- Source values are freeform strings, not an enum — no allow-list, no mapping to "other".
- Sanitize captured values to the charset `[A-Za-z0-9_-]` and truncate to 200 characters (Stripe's `client_reference_id` limit).
- Persist in `localStorage` (not `sessionStorage`) under a single key, last-touch: a newly captured value overwrites any previously stored one.
- Fallback value is the literal string `"direct"` when nothing has ever been captured, or when `localStorage`/`window` is unavailable (e.g. during server render).
- No new backend, API route, or database — the existing static `TICKETS_PAYMENT_LINK_URL` in `lib/site.ts` is reused as-is; only a `client_reference_id` query param is appended to it at render time.

---

### Task 1: Add the attribution capture/read utility

**Files:**
- Create: `lib/attribution.ts`

**Interfaces:**
- Produces: `sanitizeSource(raw: string): string`, `captureSource(): void`, `getSource(): string` — all exported from `lib/attribution.ts`. Task 2 consumes `captureSource`. Task 3 consumes `getSource`.

- [ ] **Step 1: Create `lib/attribution.ts`**

```ts
const STORAGE_KEY = "wftpt_ticket_source";

export function sanitizeSource(raw: string): string {
  return raw.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 200);
}

export function captureSource(): void {
  if (typeof window === "undefined") return;

  const raw = new URLSearchParams(window.location.search).get("src");
  if (!raw) return;

  const sanitized = sanitizeSource(raw);
  if (!sanitized) return;

  window.localStorage.setItem(STORAGE_KEY, sanitized);
}

export function getSource(): string {
  if (typeof window === "undefined") return "direct";
  return window.localStorage.getItem(STORAGE_KEY) ?? "direct";
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manually sanity-check the sanitizer**

Run: `node -e "
const s = (raw) => raw.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 200);
console.log(s('ig-story-oct12'));
console.log(s('<script>alert(1)</script>'));
console.log(s('a'.repeat(250)).length);
"`
Expected output:
```
ig-story-oct12
scriptalert1script
200
```
This confirms the same regex/truncate logic used in `sanitizeSource` strips unsafe characters and enforces the 200-character limit.

- [ ] **Step 4: Commit**

```bash
git add lib/attribution.ts
git commit -m "feat(tickets): add source attribution capture/read utility"
```

---

### Task 2: Capture `?src=` on every page load

**Files:**
- Modify: `pages/_app.tsx`

**Interfaces:**
- Consumes: `captureSource` from `lib/attribution.ts` (Task 1).
- Produces: nothing new consumed by later tasks — this task only causes `captureSource()` to run as a side effect on mount and on every route change.

- [ ] **Step 1: Wire `captureSource()` into `_app.tsx`**

Replace the full contents of `pages/_app.tsx`:

```tsx
import "@/styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { Cinzel } from "next/font/google";
import { captureSource } from "@/lib/attribution";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    captureSource();
  }, [router.asPath]);

  return (
    <div className={cinzel.variable}>
      <Component {...pageProps} />
    </div>
  );
}
```

Depending on `router.asPath` (rather than an empty dependency array) means `captureSource()` re-runs if someone follows an internal link with a `?src=` param during client-side navigation, not just on the initial full page load.

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manually verify capture in the browser**

Run: `npm run dev`, then in a browser:
1. Visit `http://localhost:3000/?src=ig-story-oct12`.
2. Open devtools console and run `localStorage.getItem("wftpt_ticket_source")`.
   Expected: `"ig-story-oct12"`.
3. Visit `http://localhost:3000/?src=<script>bad` (unsafe characters).
   Expected: `localStorage.getItem("wftpt_ticket_source")` now returns `"scriptbad"` (unsafe characters stripped), confirming sanitization runs before storage and the last-touch overwrite works.
4. Visit `http://localhost:3000/` with no `src` param.
   Expected: `localStorage.getItem("wftpt_ticket_source")` still returns `"scriptbad"` (unchanged) — visiting without a `src` param must not clear a previously captured value.

- [ ] **Step 4: Commit**

```bash
git add pages/_app.tsx
git commit -m "feat(tickets): capture ticket source from URL on every page load"
```

---

### Task 3: Forward the captured source as Stripe's `client_reference_id`

**Files:**
- Modify: `components/Tickets.tsx`

**Interfaces:**
- Consumes: `getSource` from `lib/attribution.ts` (Task 1), `TICKETS_PAYMENT_LINK_URL` from `lib/site.ts` (existing).
- Produces: nothing consumed by later tasks — this is the last code task.

- [ ] **Step 1: Update `components/Tickets.tsx` to build the Buy Tickets link dynamically**

Replace the full contents of `components/Tickets.tsx`:

```tsx
import { useEffect, useState } from "react";
import Ornament from "./Ornament";
import { TICKETS_PAYMENT_LINK_URL } from "@/lib/site";
import { getSource } from "@/lib/attribution";

export default function Tickets() {
  const [source, setSource] = useState("direct");

  useEffect(() => {
    setSource(getSource());
  }, []);

  const buyTicketsUrl = `${TICKETS_PAYMENT_LINK_URL}?client_reference_id=${encodeURIComponent(source)}`;

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
          href={buyTicketsUrl}
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

The `source` state starts at `"direct"` so server-rendered HTML always has a valid `client_reference_id`; the `useEffect` swaps in the real stored value after hydration if one exists.

- [ ] **Step 2: Build and verify the fallback appears in static HTML**

Run: `npm run build && grep -o 'client_reference_id=direct' .next/server/pages/tickets.html`
Expected: outputs `client_reference_id=direct` (the server-rendered fallback, before any client-side `localStorage` read happens).

- [ ] **Step 3: Manually verify the link updates after hydration**

Run: `npm run dev`, then in a browser:
1. Visit `http://localhost:3000/?src=ig-story-oct12` to capture a source (per Task 2).
2. Navigate to `http://localhost:3000/tickets`.
3. Inspect the "Buy Tickets" link in devtools (Elements panel) and confirm its `href` ends in `?client_reference_id=ig-story-oct12`.
4. Open a new private/incognito window (fresh `localStorage`) and visit `http://localhost:3000/tickets` directly with no query param.
   Expected: the "Buy Tickets" link's `href` ends in `?client_reference_id=direct`.
5. In the same fresh private/incognito window, visit `http://localhost:3000/tickets?src=qr-flyer-lobby` directly — no homepage hop first.
   Expected: the "Buy Tickets" link's `href` ends in `?client_reference_id=qr-flyer-lobby`, confirming capture works on `/tickets` itself as an entry point, not just via the homepage.

- [ ] **Step 4: Commit**

```bash
git add components/Tickets.tsx
git commit -m "feat(tickets): forward captured source as Stripe client_reference_id"
```

---

### Task 4: Verify end-to-end in Stripe test mode

This task is manual verification, not code — but it's required to confirm the feature actually surfaces in Stripe, per the design spec (`docs/superpowers/specs/2026-08-14-ticket-source-attribution-design.md`).

**Files:** none.

- [ ] **Step 1: Complete a tracked test-mode purchase**

With `npm run dev` running (the current `TICKETS_PAYMENT_LINK_URL` in `lib/site.ts` is already a Stripe test-mode link per the existing `test(tickets): wire in Stripe test-mode payment link for QA` commit):
1. Visit `http://localhost:3000/?src=ig-story-oct12`.
2. Navigate to `/tickets` and click "Buy Tickets".
3. Complete checkout using Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC, and a test name.

- [ ] **Step 2: Confirm the source appears in the Stripe Dashboard**

In the Stripe Dashboard, switch to test mode, open Payments, and find the payment just completed.
Expected: the payment (or its associated Checkout Session) shows `client_reference_id: ig-story-oct12`.

- [ ] **Step 3: Confirm the `direct` fallback also reaches Stripe**

Repeat the purchase in a private/incognito window, visiting `/tickets` directly with no `?src=` param.
Expected: the resulting test payment shows `client_reference_id: direct`.

No commit for this task — it's verification only, confirming Tasks 1–3 work end-to-end against real Stripe test-mode infrastructure.

---

## Post-Plan Note

After Task 4, any marketing link of the form `theperfecttooth.com/?src=<label>` or `theperfecttooth.com/tickets?src=<label>` will attribute a completed ticket purchase to `<label>` in the Stripe Dashboard, with no code changes needed to mint new tracked links for new Instagram posts, QR codes, or shares. See `docs/superpowers/specs/2026-08-14-ticket-source-attribution-design.md` for full design rationale and out-of-scope items (multi-field metadata, custom admin reporting, server-side Checkout Sessions).
