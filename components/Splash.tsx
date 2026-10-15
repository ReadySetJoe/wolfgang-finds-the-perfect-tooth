import Image from "next/image";
import Link from "next/link";
import Ornament from "./Ornament";
import TicketButton from "./TicketButton";

export default function Splash() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-bg-dark via-bg-light to-bg-dark px-6 py-12 text-center">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(139,0,0,0.15),transparent_70%)]" />

      {/* Logo emblem */}
      <Image
        src="/Logo_vA.png"
        alt="Wolfgang Finds the Perfect Tooth emblem"
        width={2927}
        height={3088}
        className="relative mb-4 h-auto w-24 md:w-28"
        priority
      />

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
        A dentist unearths a wish-granting tooth &mdash; and he&rsquo;s not the
        only one who wants it.
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
          Learn More
        </Link>
      </div>
    </section>
  );
}
