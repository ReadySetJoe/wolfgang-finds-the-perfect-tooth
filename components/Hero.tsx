import TicketButton from "./TicketButton";

export default function Hero() {
  return (
    <section className="animate-fade-in-up relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-bg-dark via-bg-light to-bg-dark">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(139,0,0,0.15),transparent_70%)]" />

      {/* Top ornamental line */}
      <div className="relative flex items-center gap-4 mb-8">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
        <span className="text-gold text-[10px] tracking-[0.4em] uppercase text-center">
          From Bagelbob Productions
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
