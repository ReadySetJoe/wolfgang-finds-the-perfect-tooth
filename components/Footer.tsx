import Image from "next/image";
import Ornament from "./Ornament";
import TicketButton from "./TicketButton";
import { useScrollReveal } from "./useScrollReveal";

export default function Footer() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <footer ref={ref} className="animate-on-scroll bg-[#050000] py-14 px-6">
      <Ornament />
      <div className="mx-auto max-w-xl text-center">
        {/* Final CTA */}
        <Image
          src="/banner-option-b.png"
          alt="Wolfgang Finds the Perfect Tooth"
          width={332}
          height={104}
          className="mx-auto mb-2 h-auto w-full max-w-[280px]"
        />
        <p className="text-sm text-red-soft italic mb-8">
          An absurdist emo theater road trip through hell.
        </p>
        <div className="mb-10">
          <TicketButton />
        </div>

        {/* Instagram */}
        <div className="flex flex-col items-center gap-2">
          <a
            href="https://www.instagram.com/wolfgangwallaceband/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-text-muted text-sm tracking-wide hover:text-gold transition-colors duration-300"
          >
            @wolfgangwallaceband
          </a>
          <a
            href="https://www.instagram.com/bagelbobproductions/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-text-muted text-sm tracking-wide hover:text-gold transition-colors duration-300"
          >
            @bagelbobproductions
          </a>
        </div>

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
