# Script Sync & Splash Page — Design

## Overview

Two independent, small changes to the marketing site:

1. **Script sync** — update site copy to match `public/script-v2.txt`, which cuts the Colonel character entirely and elevates the Hygienist into a major character (secretly the Wolfman's ex, central to the Act 3 sacrifice).
2. **Splash page** — a new fullscreen, single-viewport info page at `/splash` for use in QR codes / social bios, with links to the full site and to tickets.

These ship as two separate units of work; either can land independently.

## Part 1: Script Sync

### Diff between script.txt (v1) and script-v2.txt

- The Colonel (rhyme-speaking military man) is removed entirely — no longer in the cast, no longer in "Summoning"/"Candelabra," no longer part of the finale.
- The Hygienist is expanded into a major character: she and the Wolfman are revealed as ex-partners; she performs the tooth ritual and sacrifices herself in the finale (the role the Colonel used to play).
- "Summoning" (Wolfman, Colonel, Dentist, Patient) is renamed "Whatever it Takes" (Wolfman, Hygienist, Dentist, Patient). "Candelabra" is now the Hygienist's song, not the Colonel's.
- Wolfman's motivation is reframed: revenge for the destruction of the moon and his kind (less "love of chaos," more grief-driven).

### Site changes

**`components/CastCrew.tsx`** — `characters` array:
- Remove the "The Colonel" entry.
- Reorder so Hygienist sits right after Wolfman: Patient, Dentist, Wolfman, Hygienist, Hag, Receptionist, Demon, Judge, Jury.
- Wolfman description → `"A vengeful creature seeking revenge for the destruction of the moon and his kind"`.
- Hygienist description → `"Warm, capable, and quietly fierce — with a past that's about to catch up with her"` (light tease of the reveal; no mention of the ex-boyfriend twist or her sacrifice).
- All other entries (Patient, Dentist, Hag, Receptionist, Demon, Judge, Jury) unchanged.

**`components/About.tsx`** — "The Show" copy:
- Paragraph 1: replace the Colonel-referencing sentence — `"A vengeful Wolfman and a rhyme-obsessed Colonel wait in the lobby, and they're not here for a cleaning."` → `"A vengeful Wolfman is already waiting in the lobby, and he's not here for a cleaning."`
- Paragraph 2: append a light tease after the Dentist/Hag love story mention — `"...and a reunion neither the Wolfman nor the Hygienist saw coming."`
- Paragraphs 3–4 unchanged (the "people we love" framing already covers both romance threads).

No other files reference "Colonel," "Receptionist," or "Hygienist" in story copy (confirmed via repo-wide grep of `components/` and `pages/`), so no other edits are needed.

## Part 2: Splash Page

### Purpose

A fast, single-screen page for contexts where the full scrolling site is too much (QR codes on flyers, a link in a social bio) — just enough to identify the show, tell people when/where, and get them either to tickets or to the full site.

### Routing

- New route: `pages/splash.tsx` → `/splash`.
- The full site remains at `/` (`pages/index.tsx`), unchanged.

### Component

- New `components/Splash.tsx`, imported by `pages/splash.tsx` — same pattern as `index.tsx` composing section components.
- Single `<section>` sized to the viewport (`min-h-screen`, centered flex column, no page scroll expected). Reuses existing design tokens (bg-dark gradient, gold, red-soft), the heading font, and the `Ornament` component — visually a condensed sibling of `Hero`, not a new theme.

### Content (top to bottom)

1. Eyebrow: "From Bagelbob Productions" (same treatment as Hero).
2. Title: "Wolfgang Finds the Perfect Tooth."
3. Tagline: "An absurdist emo theater road trip through hell." / "It makes sense, we swear."
4. One-line premise (new copy, shorter than the About blurb, no spoilers): "A dentist unearths a wish-granting tooth — and he's not the only one who wants it."
5. Date/time/venue: "October 17, 2026 · 7:00 PM" / "Centre Stage · Greenville, SC".
6. Two CTAs side by side:
   - **Get Tickets** — reuse the existing `TicketButton` component as-is (links to centrestage.org).
   - **Full Site** — new lightweight link/button using Next.js `Link` to `/`.

### Head

- `pages/splash.tsx` sets its own `<title>` (e.g. "Wolfgang Finds the Perfect Tooth — Info"), independent of the full site's title.

## Out of Scope

- No changes to the full site's routing or navigation (nothing on the full site links to `/splash` — it's meant for external links like QR codes/social bios).
- No new images/artwork.
- No changes to ticketing destination or Instagram link.
