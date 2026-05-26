# Curtain Opening Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a theatrical curtain reveal that auto-plays once when the landing page loads, then unmounts cleanly. See spec at `docs/superpowers/specs/2026-05-25-curtain-animation-design.md`.

**Architecture:** A single client component `<CurtainIntro />` is rendered as the first child of `<main>` in `pages/index.tsx`. Two fixed full-viewport panels are drawn in CSS (no images), slide outward via a CSS `transform` transition triggered by a class toggle in `useEffect`, and the component unmounts itself on `transitionend`. Reduced motion is handled via a CSS media query so the curtain is hidden at first paint, with no flash. The body is scroll-locked while the animation runs.

**Tech Stack:** Next.js 16 (Pages Router), React 19, Tailwind v4, plain CSS in `styles/globals.css`. No new dependencies.

**Testing note:** This project has **no test framework installed** (no Vitest/Jest/Playwright). Adding one for a single decorative component would be massive scope creep — out of scope per AGENTS.md ("Don't add features, refactor, or introduce abstractions beyond what the task requires"). Verification at each commit is done by running the dev server and visually checking in a browser. Each task lists the exact things to confirm.

**Dev server reminder:** Run `npm run dev` once and leave it running across tasks. Most tasks will hot-reload; full reload is called out where needed.

---

## File Structure

**New file:**
- `components/CurtainIntro.tsx` — the React component. Owns mount-time effect to toggle `is-open`, body scroll lock, and unmount-on-`transitionend`.

**Modified files:**
- `pages/index.tsx` — import `CurtainIntro`, render it as the first child of `<main>`, before `<Hero />`.
- `styles/globals.css` — add curtain styles: root container, panel base, left/right modifiers, `is-open` state, pleat gradient, gold trim, top shadow, and `prefers-reduced-motion` override.

---

## Task 1: Add curtain CSS to globals

This task adds *only* the styling. After this task, no curtain appears yet (nothing renders it) — we're laying the foundation so subsequent tasks can verify visual results immediately.

**Files:**
- Modify: `styles/globals.css` (append at end)

- [ ] **Step 1: Append curtain styles to `styles/globals.css`**

Append the following at the end of the file:

```css
/* ===== Curtain intro animation ===== */

.curtain-root {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
}

.curtain-panel {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50vw;
  background-color: var(--color-red-deep);
  background-image:
    radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.35) 100%),
    repeating-linear-gradient(
      to right,
      rgba(0, 0, 0, 0.35) 0px,
      rgba(0, 0, 0, 0.05) 14px,
      rgba(255, 255, 255, 0.06) 24px,
      rgba(0, 0, 0, 0.05) 34px,
      rgba(0, 0, 0, 0.35) 48px
    );
  box-shadow: inset 0 12px 24px rgba(0, 0, 0, 0.55);
  transition: transform 1500ms cubic-bezier(0.7, 0, 0.3, 1);
  will-change: transform;
}

.curtain-panel--left {
  left: 0;
  border-right: 2px solid var(--color-gold);
  box-shadow:
    inset 0 12px 24px rgba(0, 0, 0, 0.55),
    2px 0 12px rgba(204, 153, 0, 0.5);
}

.curtain-panel--right {
  right: 0;
  border-left: 2px solid var(--color-gold);
  box-shadow:
    inset 0 12px 24px rgba(0, 0, 0, 0.55),
    -2px 0 12px rgba(204, 153, 0, 0.5);
}

.curtain-root.is-open .curtain-panel--left {
  transform: translateX(-100%);
}

.curtain-root.is-open .curtain-panel--right {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .curtain-panel {
    display: none;
  }
}
```

- [ ] **Step 2: Verify CSS file is valid**

Run: `npm run build`
Expected: build completes without CSS errors. (If dev server is running, the build will compete for the port — kill the dev server, run build, then restart dev server. Or simply check the dev server console for compile errors after saving — that's sufficient.)

- [ ] **Step 3: Commit**

```bash
git add styles/globals.css
git commit -m "feat(curtain): add curtain panel styles"
```

---

## Task 2: Create the CurtainIntro component (closed state only)

Render two panels covering the viewport. No animation yet, no unmount logic, no scroll lock. Just confirm the curtain *appears closed* over the page on load.

**Files:**
- Create: `components/CurtainIntro.tsx`
- Modify: `pages/index.tsx`

- [ ] **Step 1: Create `components/CurtainIntro.tsx`**

```tsx
export default function CurtainIntro() {
  return (
    <div className="curtain-root" aria-hidden="true">
      <div className="curtain-panel curtain-panel--left" />
      <div className="curtain-panel curtain-panel--right" />
    </div>
  );
}
```

`aria-hidden="true"` because the curtain is purely decorative — screen readers should ignore it.

- [ ] **Step 2: Render it from `pages/index.tsx`**

Modify `pages/index.tsx` so it imports and renders `CurtainIntro` as the first child of `<main>`:

```tsx
import Head from "next/head";
import CurtainIntro from "@/components/CurtainIntro";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Details from "@/components/Details";
import CastCrew from "@/components/CastCrew";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Wolfgang Finds the Perfect Tooth</title>
      </Head>
      <main>
        <CurtainIntro />
        <Hero />
        <About />
        <Details />
        <CastCrew />
        <Footer />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify in browser**

Start dev server if not running: `npm run dev`
Open `http://localhost:3000` in a browser.

Expected:
- The entire viewport is covered by a deep red velvet-textured curtain.
- A bright gold vertical line runs down the exact center of the viewport (the meeting point of the two panel trims).
- Vertical pleat shading is visible across both panels.
- The curtain stays closed indefinitely — no animation yet.
- Resize the window: the curtain still covers the full viewport and the gold seam stays centered.

If anything looks wrong, fix the CSS in Task 1 before continuing.

- [ ] **Step 4: Commit**

```bash
git add components/CurtainIntro.tsx pages/index.tsx
git commit -m "feat(curtain): render closed curtain over landing page"
```

---

## Task 3: Trigger the open animation

Add a `useEffect` that toggles `is-open` shortly after mount, so the curtain transitions open. Still no unmount and no scroll lock — verify the slide animation works first.

**Files:**
- Modify: `components/CurtainIntro.tsx`

- [ ] **Step 1: Add `is-open` toggle in `useEffect`**

Replace `components/CurtainIntro.tsx` with:

```tsx
import { useEffect, useState } from "react";

export default function CurtainIntro() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // requestAnimationFrame ensures the browser has painted the closed
    // state before we apply `is-open`, so the transition actually runs
    // instead of jumping straight to the open state.
    const raf = requestAnimationFrame(() => {
      setIsOpen(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`curtain-root${isOpen ? " is-open" : ""}`}
      aria-hidden="true"
    >
      <div className="curtain-panel curtain-panel--left" />
      <div className="curtain-panel curtain-panel--right" />
    </div>
  );
}
```

The `requestAnimationFrame` (rather than `setTimeout`) is intentional and worth the comment: it guarantees the browser has painted the closed-state frame before we toggle the class, which is what makes the transition reliably play. A bare `setIsOpen(true)` in `useEffect` can be batched into the same paint and skip the animation.

- [ ] **Step 2: Verify in browser**

Hard-reload the landing page (Cmd+Shift+R).

Expected:
- Curtain is visible at first paint (still closed).
- Within a frame or two, both panels begin sliding outward — left panel exits to the left, right panel exits to the right.
- Animation takes ~1.5s and has a heavy, weighted feel (slow start, faster middle, settled stop) — not a uniform linear slide.
- After the animation, the curtain panels are off-screen but the `.curtain-root` DOM element is still present (open devtools to confirm — we'll clean this up in the next task).
- The page underneath is visible and interactive.

- [ ] **Step 3: Commit**

```bash
git add components/CurtainIntro.tsx
git commit -m "feat(curtain): trigger open animation on mount"
```

---

## Task 4: Unmount after the animation finishes

Listen for `transitionend` and set a `done` flag that causes the component to return `null`, removing the curtain DOM entirely after the animation.

**Files:**
- Modify: `components/CurtainIntro.tsx`

- [ ] **Step 1: Add `done` state and `transitionend` handler**

Replace `components/CurtainIntro.tsx` with:

```tsx
import { useEffect, useRef, useState } from "react";

export default function CurtainIntro() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsOpen(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={rootRef}
      className={`curtain-root${isOpen ? " is-open" : ""}`}
      aria-hidden="true"
      onTransitionEnd={(event) => {
        // Both panels fire transitionend; either one signals completion.
        // Guard against firing on unrelated property transitions.
        if (event.propertyName === "transform") {
          setIsDone(true);
        }
      }}
    >
      <div className="curtain-panel curtain-panel--left" />
      <div className="curtain-panel curtain-panel--right" />
    </div>
  );
}
```

The `propertyName === "transform"` guard is important: if anyone later adds another transitioning property to `.curtain-panel`, `transitionend` would fire for each, and we'd unmount too early. Filtering on `transform` makes this future-proof.

- [ ] **Step 2: Verify in browser**

Hard-reload the landing page. Open devtools, Elements panel, and watch the DOM.

Expected:
- Curtain appears closed, animates open over ~1.5s.
- The instant the animation finishes, the `<div class="curtain-root">` element is *removed* from the DOM (you can see it disappear in the Elements panel).
- No JS errors in the console.

- [ ] **Step 3: Commit**

```bash
git add components/CurtainIntro.tsx
git commit -m "feat(curtain): unmount curtain after animation completes"
```

---

## Task 5: Lock body scroll while the curtain animates

Prevent the user from scrolling past the hero before the curtain finishes opening. Skip the lock entirely when reduced motion is on (since there's no animation to wait for).

**Files:**
- Modify: `components/CurtainIntro.tsx`

- [ ] **Step 1: Add body scroll-lock effect**

Replace `components/CurtainIntro.tsx` with:

```tsx
import { useEffect, useRef, useState } from "react";

export default function CurtainIntro() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsOpen(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Under reduced motion there's no animation, so there's nothing to
    // scroll-lock around. Leave the body as-is.
    if (prefersReducedMotion) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={rootRef}
      className={`curtain-root${isOpen ? " is-open" : ""}`}
      aria-hidden="true"
      onTransitionEnd={(event) => {
        if (event.propertyName === "transform") {
          setIsDone(true);
        }
      }}
    >
      <div className="curtain-panel curtain-panel--left" />
      <div className="curtain-panel curtain-panel--right" />
    </div>
  );
}
```

Note: when `isDone` becomes `true`, the component returns `null`, which unmounts everything *including* this effect — and the effect's cleanup function runs at unmount, restoring `document.body.style.overflow`. So the lock is released automatically at the same moment the curtain DOM is removed. We save and restore the previous value (rather than blindly clearing) in case any other code later sets `body.style.overflow` and expects it to persist.

- [ ] **Step 2: Verify scroll lock in browser**

Hard-reload the landing page.

Expected:
- While the curtain is animating open (~1.5s window), try scrolling with the mouse wheel, trackpad, or arrow keys. The page should **not** scroll.
- Immediately after the animation finishes (and the curtain unmounts), scrolling works normally.
- In devtools, after the animation, inspect `<body>` and confirm there is no leftover inline `style="overflow: hidden"`.

- [ ] **Step 3: Commit**

```bash
git add components/CurtainIntro.tsx
git commit -m "feat(curtain): scroll-lock body during curtain animation"
```

---

## Task 6: Verify reduced-motion behavior end-to-end

Reduced motion was already handled in Task 1's CSS (`@media (prefers-reduced-motion: reduce) { .curtain-panel { display: none; } }`) and in Task 5's scroll-lock effect (skip the lock under reduced motion). This task is a verification-only pass to confirm everything composes correctly.

**Files:** none modified.

- [ ] **Step 1: Enable reduced motion in your OS**

- **macOS:** System Settings → Accessibility → Display → enable "Reduce motion".
- **Or in DevTools (Chrome/Edge/Firefox):** open DevTools → Cmd+Shift+P (Ctrl+Shift+P) → type "Emulate CSS prefers-reduced-motion: reduce" → enter.

- [ ] **Step 2: Verify reduced-motion behavior**

Hard-reload the landing page.

Expected:
- No curtain is visible at any point — the page (Hero, etc.) is fully visible and interactive from the first paint.
- Scrolling works immediately from the first paint (no lock).
- In devtools, the `<div class="curtain-root">` element is still rendered on the server, but its child panels have `display: none` from CSS, so nothing visual appears. (After ~1.5s the curtain-root will unmount because there's no animation to wait for and `transitionend` never fires — actually it never unmounts in this branch. That's fine: it's a 0×0 invisible empty container that does nothing. If you'd prefer to unmount it, see "Known follow-ups" below.)

- [ ] **Step 3: Restore normal motion and re-verify the full flow**

Turn reduced motion back off in OS settings or DevTools.

Hard-reload. Confirm the full animation still plays as expected (closed → 1.5s slide → unmount).

- [ ] **Step 4: Commit (verification only — likely an empty commit)**

If you haven't modified any files, skip this commit. If you tweaked anything during verification, commit it:

```bash
git add -A
git commit -m "test(curtain): verify reduced-motion behavior"
```

---

## Final verification

Run through this checklist in a browser to confirm the feature is complete:

- [ ] **Cold load:** open the landing page in a fresh tab. Curtain is visible at first paint (no flash of un-curtained page), slides open over ~1.5s with a weighted ease, then disappears.
- [ ] **DOM cleanup:** after the animation, no `.curtain-root` element exists in the DOM.
- [ ] **Scroll behavior:** scrolling is blocked during the animation and works freely afterward. No leftover `overflow: hidden` on `<body>`.
- [ ] **Reduced motion:** with reduced motion on, no curtain appears and the page is immediately interactive.
- [ ] **Resize:** during the animation, resizing the window keeps the panels covering the correct halves of the viewport.
- [ ] **Production build:** run `npm run build` — completes with no errors or warnings introduced by these changes.
- [ ] **Lint:** run `npm run lint` — no new lint errors.

## Known follow-ups (out of scope for this plan)

- **Persistence:** the spec calls out that we *don't* want session persistence right now; adding `sessionStorage` later is a one-line change in `useEffect`.
- **Reduced-motion DOM cleanup:** under reduced motion, the empty `.curtain-root` div stays in the DOM forever. It's invisible and inert, but if it ever needs to go, add `if (prefersReducedMotion) setIsDone(true);` in the reduced-motion branch.
