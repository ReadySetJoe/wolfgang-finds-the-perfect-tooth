# Marketing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page marketing site for "Wolfgang Finds the Perfect Tooth" with a dark, theatrical aesthetic and atmospheric scroll.

**Architecture:** Single-page site built as component sections composed in `pages/index.tsx`. Each section is its own component in `components/`. Global styles, colors, and fonts configured in `styles/globals.css` and `pages/_app.tsx`. All styling via Tailwind CSS v4 utility classes with custom theme tokens for the show's color palette.

**Tech Stack:** Next.js 16 (Pages Router), React 19, Tailwind CSS v4, Cinzel font via next/font/google

**Spec:** `docs/superpowers/specs/2026-04-28-marketing-site-design.md`

**IMPORTANT:** Before writing any Next.js code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices. This is Next.js 16 which may differ from training data.

---

## File Structure

```
components/
  Hero.tsx           — Full-viewport hero section (title, tagline, date, CTA)
  About.tsx          — Show synopsis with placeholder copy
  Details.tsx        — Date/time/venue info + second ticket CTA
  CastCrew.tsx       — Cast and creative team lists
  Footer.tsx         — Final CTA, Instagram link, closing motif
  Ornament.tsx       — Reusable gold ornamental divider
  TicketButton.tsx   — Reusable "Get Tickets" CTA button

styles/
  globals.css        — Modify: replace boilerplate with show theme colors/tokens

pages/
  _app.tsx           — Modify: swap Geist fonts for Cinzel + serif
  _document.tsx      — Modify: update page title and meta description
  index.tsx          — Modify: replace boilerplate with section components
```

---

### Task 1: Set Up Theme Foundation

**Files:**
- Modify: `styles/globals.css`
- Modify: `pages/_app.tsx`
- Modify: `pages/_document.tsx`

- [ ] **Step 1: Replace globals.css with show theme**

Replace the entire contents of `styles/globals.css` with:

```css
@import "tailwindcss";

:root {
  --color-bg-dark: #0a0000;
  --color-bg-mid: #1a0000;
  --color-bg-light: #2a0000;
  --color-text-primary: #f5e6c8;
  --color-text-muted: #996633;
  --color-gold: #CC9900;
  --color-red-deep: #8B0000;
  --color-red-bright: #CC0000;
  --color-red-soft: #ff8888;
}

@theme inline {
  --color-bg-dark: var(--color-bg-dark);
  --color-bg-mid: var(--color-bg-mid);
  --color-bg-light: var(--color-bg-light);
  --color-text-primary: var(--color-text-primary);
  --color-text-muted: var(--color-text-muted);
  --color-gold: var(--color-gold);
  --color-red-deep: var(--color-red-deep);
  --color-red-bright: var(--color-red-bright);
  --color-red-soft: var(--color-red-soft);
  --font-heading: var(--font-cinzel);
}

body {
  background: var(--color-bg-dark);
  color: var(--color-text-primary);
  font-family: Georgia, "Times New Roman", serif;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out both;
}
```

- [ ] **Step 2: Update _app.tsx with Cinzel font**

Replace the entire contents of `pages/_app.tsx` with:

```tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={cinzel.variable}>
      <Component {...pageProps} />
    </div>
  );
}
```

- [ ] **Step 3: Update _document.tsx with page metadata**

Replace the entire contents of `pages/_document.tsx` with:

```tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Wolfgang Finds the Perfect Tooth — An absurdist emo theater road trip through hell. October 17, 2026 at Centre Stage, Greenville, SC."
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

- [ ] **Step 4: Verify dev server starts**

Run: `npm run dev`

Open in browser. The page should show the old boilerplate content but with a dark red-black background, warm off-white text, and no Geist fonts. If the page loads without errors, the theme foundation is working.

- [ ] **Step 5: Commit**

```bash
git add styles/globals.css pages/_app.tsx pages/_document.tsx
git commit -m "feat: set up dark theatrical theme foundation

Replace boilerplate styles with show color palette, swap Geist for
Cinzel heading font, add page metadata."
```

---

### Task 2: Create Reusable Components (Ornament + TicketButton)

**Files:**
- Create: `components/Ornament.tsx`
- Create: `components/TicketButton.tsx`

- [ ] **Step 1: Create components directory**

```bash
mkdir -p components
```

- [ ] **Step 2: Create Ornament component**

Create `components/Ornament.tsx`:

```tsx
export default function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
      <div className="text-red-deep text-lg">&#10013;</div>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
    </div>
  );
}
```

- [ ] **Step 3: Create TicketButton component**

Create `components/TicketButton.tsx`:

```tsx
export default function TicketButton() {
  return (
    <a
      href="https://centrestage.org/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block border border-gold text-gold px-9 py-3 text-xs tracking-[0.25em] uppercase font-heading transition-colors duration-300 hover:bg-gold hover:text-bg-dark"
    >
      Get Tickets
    </a>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/Ornament.tsx components/TicketButton.tsx
git commit -m "feat: add reusable Ornament and TicketButton components"
```

---

### Task 3: Build Hero Section

**Files:**
- Create: `components/Hero.tsx`
- Modify: `pages/index.tsx`

- [ ] **Step 1: Create Hero component**

Create `components/Hero.tsx`:

```tsx
import TicketButton from "./TicketButton";

export default function Hero() {
  return (
    <section className="animate-fade-in-up relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-bg-dark via-bg-light to-bg-dark">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(139,0,0,0.15),transparent_70%)]" />

      {/* Top ornamental line */}
      <div className="relative flex items-center gap-4 mb-8">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
        <span className="text-gold text-[10px] tracking-[0.4em] uppercase">
          A Descent in Three Acts
        </span>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
      </div>

      {/* Title */}
      <h1 className="relative text-center font-heading text-5xl font-bold uppercase leading-tight tracking-wider text-text-primary md:text-7xl [text-shadow:0_0_50px_rgba(139,0,0,0.5)]">
        Wolfgang Finds
        <br />
        the Perfect Tooth
      </h1>

      {/* Tagline */}
      <div className="mt-6 text-center max-w-md">
        <p className="text-sm text-red-soft italic leading-relaxed">
          An absurdist emo theater road trip through hell.
        </p>
        <p className="text-sm text-gold mt-1 tracking-wide">
          It makes sense, we swear.
        </p>
      </div>

      {/* Date & Venue */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gold tracking-[0.3em] uppercase">
          October 17, 2026 &middot; 7:00 PM
        </p>
        <p className="text-[11px] text-text-muted tracking-widest mt-1.5">
          Centre Stage &middot; Greenville, SC
        </p>
      </div>

      {/* CTA */}
      <div className="mt-8">
        <TicketButton />
      </div>

      {/* Bottom ornament */}
      <div className="mt-10 flex items-center gap-3">
        <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#4a0000]" />
        <div className="text-[#4a0000] text-base">&#10013;</div>
        <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#4a0000]" />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 animate-bounce">
        <div className="h-6 w-4 rounded-full border border-gold/30 flex items-start justify-center pt-1">
          <div className="h-1.5 w-0.5 rounded-full bg-gold/50" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace index.tsx with Hero**

Replace the entire contents of `pages/index.tsx` with:

```tsx
import Head from "next/head";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Head>
        <title>Wolfgang Finds the Perfect Tooth</title>
      </Head>
      <main>
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify in browser**

Run: `npm run dev` (if not already running)

Open in browser. You should see a full-viewport hero with:
- Dark red-black gradient background with subtle glow
- Gold ornamental line with "A DESCENT IN THREE ACTS"
- Large serif title "WOLFGANG FINDS THE PERFECT TOOTH"
- Tagline in red italic + gold
- Date and venue in gold
- "Get Tickets" button with gold border
- Scroll indicator bouncing at the bottom

- [ ] **Step 4: Commit**

```bash
git add components/Hero.tsx pages/index.tsx
git commit -m "feat: add Hero section with title, tagline, and ticket CTA"
```

---

### Task 4: Build About Section

**Files:**
- Create: `components/About.tsx`
- Modify: `pages/index.tsx`

- [ ] **Step 1: Create About component**

Create `components/About.tsx`:

```tsx
import Ornament from "./Ornament";

export default function About() {
  return (
    <section className="bg-bg-mid py-20 px-6">
      <Ornament />
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl text-gold tracking-wider uppercase mb-8">
          The Show
        </h2>
        <div className="space-y-6 text-base leading-relaxed text-text-primary/90">
          <p>
            Wolfgang has lost something. Not his keys. Not his dignity — that
            was gone long before the first act. No, Wolfgang has lost a tooth,
            and he will stop at absolutely nothing to find it. Even if
            &ldquo;nothing&rdquo; means hitchhiking through the underworld with
            a Greek chorus that only speaks in Dashboard Confessional lyrics.
          </p>
          <p>
            Part fever dream, part group therapy session, part road trip through
            the nine circles of hell with unreliable GPS,{" "}
            <em>Wolfgang Finds the Perfect Tooth</em> is the emo theater
            experience you didn&rsquo;t know you needed and definitely
            can&rsquo;t explain to your parents.
          </p>
          <p>
            Bring tissues. Bring eyeliner. Bring a willingness to question
            everything you thought you knew about dental hygiene and the
            afterlife.
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add About to index.tsx**

In `pages/index.tsx`, add the import and component:

```tsx
import Head from "next/head";
import Hero from "@/components/Hero";
import About from "@/components/About";

export default function Home() {
  return (
    <>
      <Head>
        <title>Wolfgang Finds the Perfect Tooth</title>
      </Head>
      <main>
        <Hero />
        <About />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify in browser**

Scroll past the hero. You should see:
- Gold ornamental divider
- "THE SHOW" heading in gold Cinzel font
- Three paragraphs of placeholder synopsis in warm off-white serif text
- Centered column, comfortable reading width

- [ ] **Step 4: Commit**

```bash
git add components/About.tsx pages/index.tsx
git commit -m "feat: add About section with placeholder synopsis"
```

---

### Task 5: Build Details Section

**Files:**
- Create: `components/Details.tsx`
- Modify: `pages/index.tsx`

- [ ] **Step 1: Create Details component**

Create `components/Details.tsx`:

```tsx
import Ornament from "./Ornament";
import TicketButton from "./TicketButton";

export default function Details() {
  return (
    <section className="bg-bg-dark py-20 px-6">
      <Ornament />
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-heading text-3xl text-gold tracking-wider uppercase mb-12">
          When &amp; Where
        </h2>
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
        </div>
        <TicketButton />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add Details to index.tsx**

In `pages/index.tsx`, add the import and component after About:

```tsx
import Head from "next/head";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Details from "@/components/Details";

export default function Home() {
  return (
    <>
      <Head>
        <title>Wolfgang Finds the Perfect Tooth</title>
      </Head>
      <main>
        <Hero />
        <About />
        <Details />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify in browser**

Scroll to the Details section. You should see:
- Gold ornamental divider
- "WHEN & WHERE" heading in gold
- Date, Time, and Venue in a clean grid layout
- Second "Get Tickets" button

- [ ] **Step 4: Commit**

```bash
git add components/Details.tsx pages/index.tsx
git commit -m "feat: add Details section with date, time, venue, and ticket CTA"
```

---

### Task 6: Build Cast & Creative Team Section

**Files:**
- Create: `components/CastCrew.tsx`
- Modify: `pages/index.tsx`

- [ ] **Step 1: Create CastCrew component**

Create `components/CastCrew.tsx`:

```tsx
import Ornament from "./Ornament";

const cast = [
  { name: "Cast Member One", role: "Wolfgang" },
  { name: "Cast Member Two", role: "The Narrator" },
  { name: "Cast Member Three", role: "The Tooth Fairy" },
  { name: "Cast Member Four", role: "Charon (Uber Driver)" },
  { name: "Cast Member Five", role: "Greek Chorus" },
  { name: "Cast Member Six", role: "Greek Chorus" },
];

const crew = [
  { name: "Crew Member One", role: "Director" },
  { name: "Crew Member Two", role: "Writer" },
  { name: "Crew Member Three", role: "Musical Director" },
  { name: "Crew Member Four", role: "Stage Manager" },
  { name: "Crew Member Five", role: "Set Design" },
  { name: "Crew Member Six", role: "Lighting Design" },
];

function PersonList({
  people,
}: {
  people: { name: string; role: string }[];
}) {
  return (
    <ul className="space-y-4">
      {people.map((person) => (
        <li key={`${person.name}-${person.role}`} className="text-center">
          <p className="text-gold text-lg">{person.name}</p>
          <p className="text-text-primary/60 text-sm tracking-wide">
            {person.role}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function CastCrew() {
  return (
    <section className="bg-bg-mid py-20 px-6">
      <Ornament />
      <div className="mx-auto max-w-3xl">
        <h2 className="font-heading text-3xl text-gold tracking-wider uppercase mb-12 text-center">
          Cast
        </h2>
        <PersonList people={cast} />

        <div className="my-16">
          <Ornament />
        </div>

        <h2 className="font-heading text-3xl text-gold tracking-wider uppercase mb-12 text-center">
          Creative Team
        </h2>
        <PersonList people={crew} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add CastCrew to index.tsx**

In `pages/index.tsx`, add the import and component after Details:

```tsx
import Head from "next/head";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Details from "@/components/Details";
import CastCrew from "@/components/CastCrew";

export default function Home() {
  return (
    <>
      <Head>
        <title>Wolfgang Finds the Perfect Tooth</title>
      </Head>
      <main>
        <Hero />
        <About />
        <Details />
        <CastCrew />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify in browser**

Scroll to the Cast & Creative Team section. You should see:
- "CAST" heading with placeholder names in gold and roles in muted text
- Gold ornamental divider between groups
- "CREATIVE TEAM" heading with same layout

- [ ] **Step 4: Commit**

```bash
git add components/CastCrew.tsx pages/index.tsx
git commit -m "feat: add Cast & Creative Team section with placeholder names"
```

---

### Task 7: Build Footer Section

**Files:**
- Create: `components/Footer.tsx`
- Modify: `pages/index.tsx`

- [ ] **Step 1: Create Footer component**

Create `components/Footer.tsx`:

```tsx
import Ornament from "./Ornament";
import TicketButton from "./TicketButton";

export default function Footer() {
  return (
    <footer className="bg-[#050000] py-20 px-6">
      <Ornament />
      <div className="mx-auto max-w-xl text-center">
        {/* Final CTA */}
        <p className="font-heading text-2xl text-gold tracking-wider uppercase mb-2">
          Wolfgang Finds the Perfect Tooth
        </p>
        <p className="text-sm text-red-soft italic mb-8">
          An absurdist emo theater road trip through hell.
        </p>
        <div className="mb-10">
          <TicketButton />
        </div>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/wolfgangwallaceband/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-text-muted text-sm tracking-wide hover:text-gold transition-colors duration-300"
        >
          @wolfgangwallaceband
        </a>

        {/* Bottom ornament and copyright */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#2a0000]" />
          <div className="text-[#2a0000] text-xs">&#10013;</div>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#2a0000]" />
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Add Footer to index.tsx**

Replace the entire contents of `pages/index.tsx` with the final version:

```tsx
import Head from "next/head";
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

Scroll to the very bottom. You should see:
- The darkest section of the page
- Title and tagline repeated as a closing motif
- Final "Get Tickets" button
- Instagram link (@wolfgangwallaceband)
- Subtle bottom ornament

- [ ] **Step 4: Commit**

```bash
git add components/Footer.tsx pages/index.tsx
git commit -m "feat: add Footer with final ticket CTA and Instagram link"
```

---

### Task 8: Add Scroll Animations

**Files:**
- Modify: `styles/globals.css`
- Modify: `components/About.tsx`
- Modify: `components/Details.tsx`
- Modify: `components/CastCrew.tsx`
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Add scroll-reveal animation classes to globals.css**

Append to the end of `styles/globals.css` (the `fade-in-up` keyframes and `.animate-fade-in-up` class already exist from Task 1 — add only the scroll-specific classes):

```css
.animate-on-scroll {
  opacity: 0;
}

.animate-on-scroll.is-visible {
  animation: fade-in-up 0.8s ease-out both;
}
```

- [ ] **Step 2: Add scroll observer hook**

Create `components/useScrollReveal.ts`:

```ts
import { useEffect, useRef } from "react";

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
```

- [ ] **Step 3: Add scroll reveal to About**

In `components/About.tsx`, import the hook and apply it:

```tsx
import Ornament from "./Ornament";
import { useScrollReveal } from "./useScrollReveal";

export default function About() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="animate-on-scroll bg-bg-mid py-20 px-6">
      <Ornament />
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl text-gold tracking-wider uppercase mb-8">
          The Show
        </h2>
        <div className="space-y-6 text-base leading-relaxed text-text-primary/90">
          <p>
            Wolfgang has lost something. Not his keys. Not his dignity — that
            was gone long before the first act. No, Wolfgang has lost a tooth,
            and he will stop at absolutely nothing to find it. Even if
            &ldquo;nothing&rdquo; means hitchhiking through the underworld with
            a Greek chorus that only speaks in Dashboard Confessional lyrics.
          </p>
          <p>
            Part fever dream, part group therapy session, part road trip through
            the nine circles of hell with unreliable GPS,{" "}
            <em>Wolfgang Finds the Perfect Tooth</em> is the emo theater
            experience you didn&rsquo;t know you needed and definitely
            can&rsquo;t explain to your parents.
          </p>
          <p>
            Bring tissues. Bring eyeliner. Bring a willingness to question
            everything you thought you knew about dental hygiene and the
            afterlife.
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add scroll reveal to Details**

In `components/Details.tsx`, import the hook and apply it:

```tsx
import Ornament from "./Ornament";
import TicketButton from "./TicketButton";
import { useScrollReveal } from "./useScrollReveal";

export default function Details() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="animate-on-scroll bg-bg-dark py-20 px-6">
      <Ornament />
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-heading text-3xl text-gold tracking-wider uppercase mb-12">
          When &amp; Where
        </h2>
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
        </div>
        <TicketButton />
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Add scroll reveal to CastCrew**

In `components/CastCrew.tsx`, import the hook and apply it:

Add to the top of the file:
```tsx
import { useScrollReveal } from "./useScrollReveal";
```

Update the section tag in the component:
```tsx
export default function CastCrew() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="animate-on-scroll bg-bg-mid py-20 px-6">
```

(Rest of component stays the same.)

- [ ] **Step 6: Add scroll reveal to Footer**

In `components/Footer.tsx`, import the hook and apply it:

Add to the top of the file:
```tsx
import { useScrollReveal } from "./useScrollReveal";
```

Update the footer tag in the component:
```tsx
export default function Footer() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <footer ref={ref} className="animate-on-scroll bg-[#050000] py-20 px-6">
```

(Rest of component stays the same.)

- [ ] **Step 7: Verify in browser**

Scroll through the entire page. Each section should fade in and slide up slightly as it enters the viewport. Sections that are already visible should not animate. The hero should be visible immediately (no scroll animation on it).

- [ ] **Step 8: Commit**

```bash
git add styles/globals.css components/useScrollReveal.ts components/About.tsx components/Details.tsx components/CastCrew.tsx components/Footer.tsx
git commit -m "feat: add scroll-reveal fade-in animations to all sections"
```

---

### Task 9: Final Verification and Cleanup

**Files:**
- Remove: `public/next.svg`
- Remove: `public/vercel.svg`
- Remove: `public/file.svg`
- Remove: `public/globe.svg`
- Remove: `public/window.svg`
- Remove: `pages/api/hello.ts`

- [ ] **Step 1: Remove boilerplate files**

```bash
rm public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg
rm pages/api/hello.ts
```

- [ ] **Step 2: Run lint**

Run: `npx eslint .`

Fix any lint errors that appear.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: Build succeeds with no errors.

- [ ] **Step 4: Full browser walkthrough**

Run: `npm run dev`

Verify the complete experience:
- Hero fills the viewport with dark gradient, gold ornaments, title, tagline, date, and ticket button
- Scrolling reveals About section with placeholder synopsis
- Details section shows date/time/venue grid with second ticket button
- Cast & Creative Team section shows placeholder names in gold with roles
- Footer has final ticket CTA, Instagram link, and closing ornament
- All "Get Tickets" buttons link to centrestage.org in a new tab
- Instagram link goes to wolfgangwallaceband profile
- Scroll animations trigger on each section
- Page looks good on mobile (resize browser to ~375px width)

- [ ] **Step 5: Commit**

```bash
git rm public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg pages/api/hello.ts
git commit -m "chore: remove boilerplate files from create-next-app"
```
