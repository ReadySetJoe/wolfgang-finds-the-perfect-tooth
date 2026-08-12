# Social Share Preview (Open Graph / Twitter Card) — Design

## Overview

Right now, sharing a link to this site (iMessage, Slack, Twitter/X, Discord, etc.) renders a bare title/URL with no image, because the site has no `og:*`/`twitter:*` meta tags and no share image asset. This adds both, for `/` and `/splash`.

**Production domain:** `https://theperfecttooth.com`

## Share Image

**Asset:** `public/og-image.png`, 1200×630px (the standard OG image size).

**Generation approach:** No image-generation tool is available in this environment. Build the card as a standalone HTML/CSS file (not a Next.js route — lives only in scratch space, never committed), matching the site's existing theme exactly:
- Dark gradient background (`#0a0000` → `#2a0000` → `#0a0000`, same as Hero's `bg-dark`/`bg-light` tokens)
- Radial red glow behind the title (same `rgba(139,0,0,0.15)` treatment as Hero)
- Cinzel font for the title (loaded via Google Fonts CDN in the standalone HTML, since it's outside the Next.js font pipeline)
- Gold ornamental line flourish, matching `Ornament.tsx`'s style

Render this HTML in a browser at exactly 1200×630 viewport and screenshot it to produce the final PNG.

**Card content (all centered):**
1. Title: "WOLFGANG FINDS THE PERFECT TOOTH" — gold, uppercase, bold, Cinzel, same letter-spacing as Hero's `<h1>`.
2. Tagline: "An absurdist emo theater road trip through hell." — red-soft, italic.
3. Ornamental gold line flourish.
4. Date/venue: "OCTOBER 17, 2026 · CENTRE STAGE, GREENVILLE, SC" — gold, small, uppercase, letter-spaced.

## Meta Tags

Both `pages/index.tsx` and `pages/splash.tsx` already use `next/head`'s `<Head>` for a page-specific `<title>`. Add to each `<Head>` block:

- `og:type` = `website`
- `og:title` — same text as the page's `<title>`
- `og:description` — `"An absurdist emo theater road trip through hell."` (the show's tagline, exact text, identical on both pages)
- `og:url` — absolute, page-specific (`https://theperfecttooth.com/` for index, `https://theperfecttooth.com/splash` for splash)
- `og:image` — absolute URL to the shared image: `https://theperfecttooth.com/og-image.png`
- `og:image:width` = `1200`, `og:image:height` = `630`
- `twitter:card` = `summary_large_image`
- `twitter:title`, `twitter:description`, `twitter:image` — same values as their `og:` counterparts

**Shared constant:** Both pages repeat the domain and image path. Add a small `lib/site.ts` exporting `SITE_URL = "https://theperfecttooth.com"` and `OG_IMAGE_URL = ${SITE_URL}/og-image.png`, imported by both pages, so the domain string exists in exactly one place.

## Out of Scope

- No per-page distinct images (both routes share the same card, per decision).
- No env-var-based configurability for the domain — it's a fixed constant (YAGNI; this site has one production domain).
- No changes to the global `<meta name="description">` already in `pages/_document.tsx`.
