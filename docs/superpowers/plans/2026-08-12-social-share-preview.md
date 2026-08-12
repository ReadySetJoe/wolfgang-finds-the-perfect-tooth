# Social Share Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a branded Open Graph/Twitter Card share image and the meta tags that reference it, so links to `/` and `/splash` render a rich preview when shared.

**Architecture:** Task 1 produces a static image asset (`public/og-image.png`) by rendering a standalone, git-ignored HTML file in a browser and screenshotting it — no application code involved. Task 2 adds a tiny shared constants module and per-page `<meta>` tags to the two existing pages' `<Head>` blocks.

**Tech Stack:** Next.js 16.2.4 (Pages Router), Playwright MCP tools (`mcp__playwright__browser_navigate`, `mcp__playwright__browser_resize`, `mcp__playwright__browser_take_screenshot`) for image generation.

**Spec:** `docs/superpowers/specs/2026-08-12-social-share-preview-design.md`

## Global Constraints

- Production domain is `https://theperfecttooth.com` — this is a fixed constant, not an env var (YAGNI: one domain, no per-environment config needed).
- Share image is 1200×630px, shared identically by both `/` and `/splash` (no per-page images).
- `og:description` and `twitter:description` text on both pages is exactly: `"An absurdist emo theater road trip through hell."`
- No test framework is configured in this repo. Verification is `npm run lint`, `npm run build`, and manual checks.

---

## File Structure

```
public/
  og-image.png     — Create: 1200x630 share image (binary, committed)

lib/
  site.ts          — Create: SITE_URL and OG_IMAGE_URL constants

pages/
  index.tsx        — Modify: add og:*/twitter:* meta tags to existing <Head>
  splash.tsx       — Modify: add og:*/twitter:* meta tags to existing <Head>
```

---

### Task 1: Generate the Share Image

**Files:**
- Create: `public/og-image.png`

**Interfaces:**
- Produces: a 1200×630px PNG at `public/og-image.png`, consumed by Task 2 as the `og:image`/`twitter:image` value (referenced there as `${SITE_URL}/og-image.png`, i.e. served from the site root by Next.js's static `public/` handling).

- [ ] **Step 1: Write the standalone card HTML to scratch space (not the repo)**

Create `/tmp/og-card.html` (or your environment's scratch directory — this file must NOT be added to git) with this exact content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: 1200px;
    height: 630px;
    overflow: hidden;
    background: linear-gradient(to bottom, #0a0000 0%, #2a0000 50%, #0a0000 100%);
    font-family: Georgia, "Times New Roman", serif;
  }
  .card {
    position: relative;
    width: 1200px;
    height: 630px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 40%, rgba(139,0,0,0.3), transparent 70%);
  }
  h1 {
    position: relative;
    font-family: 'Cinzel', Georgia, serif;
    font-weight: 700;
    font-size: 64px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    line-height: 1.2;
    color: #CC9900;
    text-shadow: 0 0 50px rgba(139,0,0,0.6);
    margin-bottom: 28px;
  }
  .tagline {
    position: relative;
    font-size: 22px;
    font-style: italic;
    color: #ff8888;
    margin-bottom: 32px;
  }
  .ornament {
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;
  }
  .line {
    height: 1px;
    width: 90px;
  }
  .line--left { background: linear-gradient(to right, transparent, #CC9900); }
  .line--right { background: linear-gradient(to left, transparent, #CC9900); }
  .cross { color: #8B0000; font-size: 22px; }
  .details {
    position: relative;
    font-size: 18px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #CC9900;
  }
</style>
</head>
<body>
  <div class="card">
    <div class="glow"></div>
    <h1>Wolfgang Finds<br>the Perfect Tooth</h1>
    <p class="tagline">An absurdist emo theater road trip through hell.</p>
    <div class="ornament">
      <div class="line line--left"></div>
      <div class="cross">&#10013;</div>
      <div class="line line--right"></div>
    </div>
    <p class="details">October 17, 2026 &middot; Centre Stage, Greenville, SC</p>
  </div>
</body>
</html>
```

- [ ] **Step 2: Render and screenshot at exactly 1200x630**

Using the Playwright MCP tools:
1. `mcp__playwright__browser_navigate` to `file:///tmp/og-card.html` (adjust path to wherever you saved it in Step 1).
2. `mcp__playwright__browser_resize` with `width: 1200, height: 630`.
3. `mcp__playwright__browser_take_screenshot` with `filename: "og-image.png"`, `type: "png"`, `scale: "css"`.

The tool call returns/prints the path it saved the file to (its own output directory) — note that path.

- [ ] **Step 3: Copy the screenshot into the repo and verify dimensions**

```bash
cp <path printed by the screenshot tool> /Users/joepowers/Documents/code/wolfgang-finds-the-perfect-tooth/public/og-image.png
file /Users/joepowers/Documents/code/wolfgang-finds-the-perfect-tooth/public/og-image.png
```

Expected `file` output includes `PNG image data, 1200 x 630`. If the dimensions are wrong (e.g. scaled by device pixel ratio), redo Step 2 checking the `scale` parameter is `"css"`, then re-copy.

- [ ] **Step 4: Visually confirm the image**

Read the resulting `public/og-image.png` (e.g. with the Read tool, which can display images) and confirm: dark red-black gradient background, gold uppercase "WOLFGANG FINDS THE PERFECT TOOTH" title, red-soft italic tagline below it, a small gold-line-and-cross ornament, and gold date/venue text at the bottom. No cut-off text, no unstyled fallback font (i.e. title is NOT in a generic sans-serif — if Cinzel failed to load, the screenshot will show a serif fallback instead of Cinzel's distinct engraved look; if that happens, add a `browser_wait_for` for the font/network to settle before Step 2's screenshot, then redo Steps 2-3).

- [ ] **Step 5: Commit**

```bash
git add public/og-image.png
git commit -m "feat: add branded social share preview image

1200x630 card matching the site's theme, for Open Graph/Twitter
Card previews when links are shared."
```

Do NOT add the scratch HTML file from Step 1 to this commit — it's not part of the repo.

---

### Task 2: Add Meta Tags

**Files:**
- Create: `lib/site.ts`
- Modify: `pages/index.tsx`
- Modify: `pages/splash.tsx`

**Interfaces:**
- Consumes: `public/og-image.png` from Task 1 (referenced by URL, not imported).
- Produces: `SITE_URL` (string constant) and `OG_IMAGE_URL` (string constant) exported from `lib/site.ts`, consumed by both modified pages.

- [ ] **Step 1: Create the shared constants module**

Create `lib/site.ts`:

```ts
export const SITE_URL = "https://theperfecttooth.com";
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;
```

- [ ] **Step 2: Add meta tags to pages/index.tsx**

In `pages/index.tsx`, add the import and expand the `<Head>` block. The full file should read:

```tsx
import Head from "next/head";
import CurtainIntro from "@/components/CurtainIntro";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Details from "@/components/Details";
import CastCrew from "@/components/CastCrew";
import Footer from "@/components/Footer";
import { SITE_URL, OG_IMAGE_URL } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Head>
        <title>Wolfgang Finds the Perfect Tooth</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Wolfgang Finds the Perfect Tooth" />
        <meta
          property="og:description"
          content="An absurdist emo theater road trip through hell."
        />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wolfgang Finds the Perfect Tooth" />
        <meta
          name="twitter:description"
          content="An absurdist emo theater road trip through hell."
        />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
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

- [ ] **Step 3: Add meta tags to pages/splash.tsx**

In `pages/splash.tsx`, add the import and expand the `<Head>` block. The full file should read:

```tsx
import Head from "next/head";
import Splash from "@/components/Splash";
import { SITE_URL, OG_IMAGE_URL } from "@/lib/site";

export default function SplashPage() {
  return (
    <>
      <Head>
        <title>Wolfgang Finds the Perfect Tooth &mdash; Info</title>
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Wolfgang Finds the Perfect Tooth — Info"
        />
        <meta
          property="og:description"
          content="An absurdist emo theater road trip through hell."
        />
        <meta property="og:url" content={`${SITE_URL}/splash`} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Wolfgang Finds the Perfect Tooth — Info"
        />
        <meta
          name="twitter:description"
          content="An absurdist emo theater road trip through hell."
        />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
      </Head>
      <main>
        <Splash />
      </main>
    </>
  );
}
```

Note: `og:title`/`twitter:title` use a literal em dash character (`—`) in the string, not the `&mdash;` HTML entity — entity references only decode inside JSX text children (like the `<title>` above them), not inside plain string attribute values.

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: build succeeds, no TypeScript errors on the new `lib/site.ts` import.

- [ ] **Step 6: Manual verification**

Run `npm run dev`, open `http://localhost:3000` and `http://localhost:3000/splash`, and in each case view the page source (or browser devtools Elements panel) to confirm the `<head>` contains all the `og:*` and `twitter:*` tags with the exact values above, and that `og:image`/`twitter:image` resolve to `https://theperfecttooth.com/og-image.png` (the browser will 404 on that exact absolute URL locally since `theperfecttooth.com` isn't this dev server — that's expected; just confirm the tag's `content` string is correct, and separately confirm `http://localhost:3000/og-image.png` loads the image successfully).

- [ ] **Step 7: Commit**

```bash
git add lib/site.ts pages/index.tsx pages/splash.tsx
git commit -m "feat: add Open Graph and Twitter Card meta tags

Both / and /splash now advertise a title, description, and the
shared share image so links render rich previews when shared."
```
