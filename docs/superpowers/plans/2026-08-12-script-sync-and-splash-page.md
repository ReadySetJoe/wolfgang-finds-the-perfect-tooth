# Script Sync & Splash Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sync site copy to script-v2 (Colonel removed, Hygienist elevated) and add a new fullscreen `/splash` info page.

**Architecture:** Two independent tasks touching disjoint files. Task 1 edits existing copy in `components/CastCrew.tsx` and `components/About.tsx`. Task 2 adds a new page (`pages/splash.tsx`) and a new component (`components/Splash.tsx`) following the existing pattern of one component per page section, reusing `Ornament` and `TicketButton`.

**Tech Stack:** Next.js 16.2.4 (Pages Router), React 19, Tailwind CSS v4.

**Spec:** `docs/superpowers/specs/2026-08-12-script-sync-and-splash-page-design.md`

## Global Constraints

- Next.js 16.2.4, Pages Router — routes are files under `pages/`, no `app/` directory.
- `next/link`'s `<Link href="...">` takes children directly (no nested `<a>` needed) — confirmed against `node_modules/next/dist/docs/02-pages/03-building-your-application/01-routing/03-linking-and-navigating.md`.
- No test framework is configured in this repo (`package.json` has no test script). Verification is `npm run lint`, `npm run build`, and manual visual check via `npm run dev`.
- Tailwind v4 utility classes only, using the existing theme tokens from `styles/globals.css` (`bg-dark`, `bg-mid`, `bg-light`, `text-primary`, `text-muted`, `gold`, `red-soft`, `font-heading`). Do not invent new color tokens.

---

## File Structure

```
components/
  CastCrew.tsx   — Modify: remove Colonel, reorder Hygienist, update two descriptions
  About.tsx      — Modify: replace two sentences in "The Show" copy
  Splash.tsx     — Create: fullscreen single-viewport splash section

pages/
  splash.tsx     — Create: new route at /splash, composes Splash component
```

---

### Task 1: Sync Cast & About Copy to script-v2

**Files:**
- Modify: `components/CastCrew.tsx`
- Modify: `components/About.tsx`

**Interfaces:**
- No new exports or props — both components remain default-exported, zero-prop, as they are today.

- [ ] **Step 1: Update the `characters` array in CastCrew.tsx**

In `components/CastCrew.tsx`, replace the entire `characters` array (currently lines 4–58) with:

```tsx
const characters = [
  {
    name: "The Patient",
    actor: "Matthew Wallace",
    description: "Our reluctant hero with a hidden streak of courage",
  },
  {
    name: "The Dentist",
    actor: "Joe Powers",
    description:
      "A charming but sinister figure obsessed with power and perfection",
  },
  {
    name: "Wolfman",
    actor: "TBD",
    description:
      "A vengeful creature seeking revenge for the destruction of the moon and his kind",
  },
  {
    name: "The Hygienist",
    actor: "TBD",
    description:
      "Warm, capable, and quietly fierce — with a past that's about to catch up with her",
  },
  {
    name: "The Hag",
    actor: "TBD",
    description: "An ancient, wish-granting being of terrible power",
  },
  {
    name: "The Receptionist",
    actor: "TBD",
    description: "A no-nonsense clerical worker from Shreveport, Louisiana",
  },
  {
    name: "The Demon",
    actor: "TBD",
    description: "Hell's resident musical duelist and potent grudge holder",
  },
  {
    name: "The Judge",
    actor: "TBD",
    description:
      "A mountainous demon presiding over the trial of the Patient's soul",
  },
  {
    name: "The Jury",
    actor: "You!",
    description: "Spectators who will judge the Patient's fate",
  },
];
```

This removes "The Colonel" entry, moves "The Hygienist" to right after "Wolfman", and updates the Wolfman and Hygienist `description` strings. The `crew` array below it and the rest of the file are unchanged.

- [ ] **Step 2: Update the two sentences in About.tsx**

In `components/About.tsx`, the first `<p>` currently reads:

```tsx
          <p>
            A routine dental procedure goes sideways when the Dentist discovers
            a mythical wish-granting tooth inside the mouth of his most
            unremarkable Patient. But he&rsquo;s not the only one who wants it.
            A vengeful Wolfman and a rhyme-obsessed Colonel wait in the lobby,
            and they&rsquo;re not here for a cleaning.
          </p>
```

Replace it with:

```tsx
          <p>
            A routine dental procedure goes sideways when the Dentist discovers
            a mythical wish-granting tooth inside the mouth of his most
            unremarkable Patient. But he&rsquo;s not the only one who wants it.
            A vengeful Wolfman is already waiting in the lobby, and
            he&rsquo;s not here for a cleaning.
          </p>
```

The second `<p>` currently reads:

```tsx
          <p>
            What follows is a grenade explosion, a journey through Hell, a
            musical duel with a demon, a trial before a jury of audience
            members, and a love story between a Dentist and an ancient Hag. All
            set to original songs that are sure to have you asking,
            &quot;What?&quot;.
          </p>
```

Replace it with:

```tsx
          <p>
            What follows is a grenade explosion, a journey through Hell, a
            musical duel with a demon, a trial before a jury of audience
            members, a love story between a Dentist and an ancient Hag, and a
            reunion neither the Wolfman nor the Hygienist saw coming. All set
            to original songs that are sure to have you asking,
            &quot;What?&quot;.
          </p>
```

The third and fourth `<p>` tags, and the rest of the file, are unchanged.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual visual check**

Run: `npm run dev`, open `http://localhost:3000`.

Scroll to the "Characters" section — confirm there is no "The Colonel" entry, and "The Hygienist" appears directly after "Wolfman" with the new description. Scroll to "The Show" section — confirm the lobby sentence no longer mentions a Colonel, and the second paragraph ends with the new "reunion" clause before "All set to original songs...".

- [ ] **Step 5: Commit**

```bash
git add components/CastCrew.tsx components/About.tsx
git commit -m "content: sync cast bios and show copy to script-v2

Remove the Colonel (cut from script-v2), move the Hygienist up as a
top-tier character, and lightly tease her hidden history with
Wolfman without spoiling the Act 3 reveal."
```

---

### Task 2: Build the Splash Page

**Files:**
- Create: `components/Splash.tsx`
- Create: `pages/splash.tsx`

**Interfaces:**
- Consumes: `Ornament` (default export, zero props, from `./Ornament`), `TicketButton` (default export, zero props, from `./TicketButton`) — both already exist and are used the same way by `Hero.tsx` and `Footer.tsx`.
- Produces: `Splash` (default export, zero props) from `components/Splash.tsx`, consumed by `pages/splash.tsx`.

- [ ] **Step 1: Create the Splash component**

Create `components/Splash.tsx`:

```tsx
import Link from "next/link";
import Ornament from "./Ornament";
import TicketButton from "./TicketButton";

export default function Splash() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-bg-dark via-bg-light to-bg-dark px-6 py-12 text-center">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(139,0,0,0.15),transparent_70%)]" />

      {/* Top ornamental line */}
      <div className="relative flex items-center gap-4 mb-6">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
        <span className="text-gold text-[10px] tracking-[0.4em] uppercase">
          From Bagelbob Productions
        </span>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
      </div>

      {/* Title */}
      <h1 className="relative font-heading text-4xl font-bold uppercase leading-tight tracking-wider text-text-primary md:text-6xl [text-shadow:0_0_50px_rgba(139,0,0,0.5)]">
        Wolfgang Finds
        <br />
        the Perfect Tooth
      </h1>

      {/* Tagline */}
      <div className="mt-5 max-w-md">
        <p className="text-sm text-red-soft italic leading-relaxed">
          An absurdist emo theater road trip through hell.
        </p>
        <p className="text-sm text-gold mt-1 tracking-wide">
          It makes sense, we swear.
        </p>
      </div>

      {/* One-line premise */}
      <p className="mt-5 max-w-md text-sm text-text-primary/80 leading-relaxed">
        A dentist unearths a wish-granting tooth &mdash; and he&rsquo;s not
        the only one who wants it.
      </p>

      <div className="my-8 w-full max-w-xs">
        <Ornament />
      </div>

      {/* Date & Venue */}
      <div className="text-center">
        <p className="text-xs text-gold tracking-[0.3em] uppercase">
          October 17, 2026 &middot; 7:00 PM
        </p>
        <p className="text-[11px] text-text-muted tracking-widest mt-1.5">
          Centre Stage &middot; Greenville, SC
        </p>
      </div>

      {/* CTAs */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <TicketButton />
        <Link
          href="/"
          className="inline-block border border-text-muted text-text-primary px-9 py-3 text-xs tracking-[0.25em] uppercase font-heading transition-colors duration-300 hover:border-gold hover:text-gold"
        >
          Full Site
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create the splash page route**

Create `pages/splash.tsx`:

```tsx
import Head from "next/head";
import Splash from "@/components/Splash";

export default function SplashPage() {
  return (
    <>
      <Head>
        <title>Wolfgang Finds the Perfect Tooth &mdash; Info</title>
      </Head>
      <main>
        <Splash />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual visual check**

Run: `npm run dev`, open `http://localhost:3000/splash`.

Confirm the page fills the viewport with no scroll on a standard desktop window: eyebrow, title, tagline, one-line premise, an `Ornament` divider, date/venue, and two buttons side by side ("Get Tickets" linking to centrestage.org in a new tab, and "Full Site" navigating to `/`). Click "Full Site" and confirm it loads the existing homepage at `/`. Resize to a narrow mobile width and confirm the two buttons wrap without overlapping and no content is cut off.

- [ ] **Step 5: Build check**

Run: `npm run build`
Expected: build succeeds, and the output lists `/splash` as a generated route alongside `/`.

- [ ] **Step 6: Commit**

```bash
git add components/Splash.tsx pages/splash.tsx
git commit -m "feat: add fullscreen /splash info page

Single-viewport page with title, tagline, one-line premise,
date/venue, and links to tickets and the full site — for use in
QR codes and social bios."
```
