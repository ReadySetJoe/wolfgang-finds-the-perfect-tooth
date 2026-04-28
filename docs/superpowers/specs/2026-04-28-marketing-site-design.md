# Wolfgang Finds the Perfect Tooth — Marketing Site Design

## Overview

A single-page marketing website for the musical "Wolfgang Finds the Perfect Tooth." The site's purpose is to build hype and intrigue, provide essential show information, and funnel visitors toward purchasing tickets.

**Tagline:** "An absurdist emo theater road trip through hell. It makes sense, we swear."

**Show Details:**
- Date: October 17, 2026 at 7:00 PM
- Venue: Centre Stage, Greenville, SC
- Single performance
- Tickets: https://centrestage.org/

**Social:** Instagram — https://www.instagram.com/wolfgangwallaceband/

## Visual Identity

**Approach:** Atmospheric Scroll — a single continuous page that builds tension like acts of a play. Dark and macabre aesthetic; humor lives in the copy, not the visuals.

**Tone:** Dark & Theatrical. Gothic elegance meets playbill drama. The visuals say "serious theater about descending into hell." The copy says "it makes sense, we swear."

**Color Palette:**
- Background: Deep red-blacks (#0a0000 → #1a0000 → #2a0000)
- Primary text: Warm off-white (#f5e6c8)
- Gold accents: #CC9900 (ornamental elements, CTAs, highlights)
- Blood red accents: #8B0000, #CC0000 (glows, subtle emphasis)
- Muted text: #996633, #ff8888 (secondary info, tagline)

**Typography:**
- Serif throughout (Cinzel for headings, Georgia/serif stack for body)
- Title is unified — "WOLFGANG FINDS THE PERFECT TOOTH" rendered as one block, same size and weight
- Generous letter-spacing on headings and labels
- Body text at comfortable reading width (~650px max)

**Decorative Elements:**
- Gold ornamental lines and dividers between sections
- Subtle radial glows behind key content
- Cross/dagger ornaments as section markers
- No dependency on images — pure CSS/typography driven

**Animations:**
- Subtle fade-in on page load for the hero (curtain-opening feel)
- Sections reveal on scroll with fade/slide effects
- Nothing gimmicky — atmosphere, not spectacle

## Page Sections

### 1. Hero (Full Viewport)
- Full viewport height, centered content
- Top ornamental line with subtitle "A Descent in Three Acts"
- Full title "WOLFGANG FINDS THE PERFECT TOOTH" in unified serif typography, uppercase, bold
- Tagline in two lines: italic red for the description, gold for "It makes sense, we swear."
- Date and venue in small gold uppercase text
- "Get Tickets" CTA button (gold border, gold text, links to centrestage.org)
- Bottom ornamental cross
- Scroll indicator hinting at more content below
- Deep red-black gradient background with subtle radial glow behind title

### 2. About the Show
- Gold ornamental divider from hero
- Placeholder synopsis copy — a few paragraphs written in the absurdist tone (darkly funny, macabre)
- Centered column (~650px max width)
- Serif body text in warm off-white

### 3. Details
- Date, time, venue presented as elegant key-value pairs or small grid
- "October 17, 2026 / 7:00 PM / Centre Stage / Greenville, SC"
- Gold accent line dividers
- Second "Get Tickets" CTA button — this is the info section where visitors decide to commit

### 4. Cast & Creative Team
- Two groups with headings: "Cast" and "Creative Team"
- Names in gold, roles in muted off-white
- Clean grid or list layout
- Placeholder names for now (real names to be plugged in)
- Gold ornamental divider between the two groups

### 5. Footer
- Final "Get Tickets" CTA — last push before leaving the page
- Instagram link (wolfgangwallaceband)
- Small repetition of title and tagline as closing motif
- Subtly darker than the rest of the page — the bottom of the descent

## Technical Approach

- **Framework:** Next.js 16 (Pages Router) — already scaffolded
- **Styling:** Tailwind CSS v4 — already configured
- **Fonts:** Google Fonts via next/font (Cinzel for headings + Georgia/serif fallback for body)
- **No image dependencies** — entire design is CSS/typography driven
- **Single page:** `pages/index.tsx` with section components
- **Responsive:** Must work well on mobile — stacked layout, adjusted font sizes
- **External links:** Ticket CTA → centrestage.org, Instagram → wolfgangwallaceband profile

## Future Considerations (Out of Scope)

- Easter egg pages hidden throughout the site — architecture should remain flexible for adding routes later
- Real cast/crew names (placeholders for now)
- Promotional images/artwork (when available)
- Real show synopsis copy
