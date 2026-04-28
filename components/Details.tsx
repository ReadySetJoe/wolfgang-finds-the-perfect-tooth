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
