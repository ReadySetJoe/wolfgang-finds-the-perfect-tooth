import Ornament from "./Ornament";
import TicketButton from "./TicketButton";
import { useScrollReveal } from "./useScrollReveal";

export default function Footer() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <footer ref={ref} className="animate-on-scroll bg-[#050000] py-20 px-6">
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
