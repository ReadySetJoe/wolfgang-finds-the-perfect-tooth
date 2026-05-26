# Curtain Opening Animation — Design

A theatrical curtain reveal that plays once on landing-page load. Two deep-red velvet panels split outward to reveal the page beneath, then unmount cleanly.

## Goals

- Reinforce the "absurdist emo theater" brand identity at first contact.
- Auto-play on landing-page load with zero user action.
- Land in roughly 1.5 seconds — dramatic, not annoying.
- Leave no DOM, no listeners, and no scroll-lock behind once finished.
- Respect `prefers-reduced-motion`.

## Non-goals

- Replaying the animation on every navigation, every session, or via user trigger.
- Adding the animation to any page other than the landing page (`pages/index.tsx`).
- Image-based curtain texture; this is pure CSS.
- Persistence (no `sessionStorage`, no cookies). The animation runs on every fresh page load. (If repeat-visit fatigue ever becomes a concern, swap in `sessionStorage` later — one line of change.)

## Architecture

A new client component `<CurtainIntro />` is rendered as the first child of `<main>` in `pages/index.tsx`. It draws two fixed, full-viewport panels (`position: fixed; inset: 0; z-index: 50`), each 50vw wide, meeting at the horizontal center.

On mount it triggers the open transition. When the CSS transition ends, the component unmounts itself via a state flag. After unmount there is no DOM, no event listener, no scroll lock — just the page.

The component lives in `pages/index.tsx`, not `_app.tsx`. That keeps the animation scoped to the landing page and avoids re-running it on internal navigation.

## Visual treatment

Each panel is built in CSS only — no images, no SVG, no canvas:

- **Base color:** `--color-red-deep` (#8B0000) with a subtle radial darkening toward the outer edges, suggesting a soft highlight catching the center of the fabric.
- **Pleats:** vertical pleats rendered with a `repeating-linear-gradient` of thin dark and light red bands at ~40–60px spacing, giving a fabric-fold shimmer.
- **Gold trim:** a 2px gold (`--color-gold`, #CC9900) vertical strip running down the *inner* edge of each panel (the edge facing the center seam), with a soft glow via `box-shadow`. When closed, the two trims meet to form a single seam down the center of the viewport.
- **Top shadow:** a faint inner shadow along the top edge of each panel, suggesting weight hanging from a rod.

## Motion & timing

- **Initial state:** both panels cover the full viewport. The page sits fully rendered underneath.
- **Trigger:** ~50ms after mount (one tick after the first paint of the closed curtain), an `is-open` class is added to both panels.
- **Open motion:** `transform: translateX(...)` — left panel to `-100%`, right panel to `+100%`.
- **Duration:** 1500ms.
- **Easing:** `cubic-bezier(0.7, 0, 0.3, 1)` — a heavy, weighted ease that starts slow, accelerates, and settles. Not linear, not the default ease, both of which feel like sliding doors rather than fabric mass.
- **Cleanup:** a `transitionend` listener on one of the panels flips a `done` state in React, which unmounts the component. No `setTimeout` for cleanup — we listen to the real transition end so it cannot desync from the animation.
- **Scroll lock:** while the curtain is animating, `<body>` gets `overflow: hidden` to prevent scrolling past the hero before the reveal completes. The lock is held by a `useEffect` keyed on the `isDone` flag; when `transitionend` flips `isDone` to `true`, the effect re-runs, its prior cleanup fires (restoring `overflow`), and the new run early-returns. The component then renders `null` on the next pass. Note: returning `null` from a component does not by itself trigger effect cleanup — only a parent unmount or a deps change does — so the lock release must be driven by the `isDone` dependency, not by the `null` return.
- **Reduced motion:** under `@media (prefers-reduced-motion: reduce)`, the panel CSS sets `display: none`, so the browser hides the curtain at first paint — no flash, no animation. The body scroll-lock effect also checks `matchMedia('(prefers-reduced-motion: reduce)').matches` and skips applying the lock when true. The page appears as-is.

## File layout

**New files:**

- `components/CurtainIntro.tsx` — the component. Owns three pieces of state-like behavior:
  1. `isOpen` — toggled to `true` in a `useEffect` shortly after mount; triggers the CSS transition.
  2. `isDone` — set to `true` on `transitionend`; causes the component to return `null`.
  3. Body scroll-lock side effect — adds `overflow: hidden` on mount, removes it on cleanup.

**Modified files:**

- `pages/index.tsx` — import `CurtainIntro` and render it as the first child of `<main>`, before `<Hero />`.
- `styles/globals.css` — add curtain-related styles: `.curtain-root`, `.curtain-panel`, `.curtain-panel--left`, `.curtain-panel--right`, the `is-open` modifier, and the `prefers-reduced-motion` short-circuit. Pleat gradient and gold trim are defined here so the component file stays small.

## SSR considerations

Next.js renders pages on the server. Because the curtain must be present at first paint (otherwise the page flashes before the animation begins), the component renders unconditionally on the server in its closed state. The `useEffect` only runs client-side and adds the `is-open` class one tick later, triggering the CSS transition.

The initial server HTML and the initial client render both show the curtain closed, so there is no hydration mismatch. Reduced motion is handled at the CSS layer (see *Motion & timing*) rather than by returning `null` from the component; this keeps server and client output identical and avoids any reduced-motion-related hydration concerns.

## Testing / verification

- Load `/` in a browser: curtain is visible at first paint, splits open over ~1.5s, then disappears.
- After animation: inspect DOM and confirm no `.curtain-root` element remains, and `<body>` has no inline `overflow: hidden`.
- Toggle "Reduce motion" in OS preferences and reload: no curtain visible, page is immediately interactive.
- Reload the landing page: curtain plays again (every fresh load, by design).
- Navigate to landing page from another page (if/when other pages exist): curtain plays each time the landing page mounts.

## Dependencies

None. No new packages. Pure CSS transition + one `useState` + one `useEffect` + one `transitionend` listener.
