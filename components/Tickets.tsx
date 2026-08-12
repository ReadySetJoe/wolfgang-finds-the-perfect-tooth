import Ornament from "./Ornament";
import { TICKETS_PAYMENT_LINK_URL } from "@/lib/site";

export default function Tickets() {
  return (
    <section className="animate-fade-in-up min-h-screen bg-gradient-to-b from-bg-dark via-bg-light to-bg-dark py-24 px-6">
      <div className="mx-auto max-w-xl text-center">
        <div className="relative flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
          <span className="text-gold text-[10px] tracking-[0.4em] uppercase text-center">
            Wolfgang Finds the Perfect Tooth
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
        </div>

        <h1 className="font-heading text-4xl text-text-primary tracking-wider uppercase mb-4">
          Get Your Tickets
        </h1>
        <p className="text-sm text-red-soft italic mb-12">
          One night only. Hell doesn&apos;t wait.
        </p>

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
          <div className="sm:col-span-2">
            <p className="text-xs text-gold tracking-[0.3em] uppercase mb-2">
              Price
            </p>
            <p className="text-lg text-text-primary">
              $25 &middot; General Admission
            </p>
          </div>
        </div>

        <Ornament />

        <a
          href={TICKETS_PAYMENT_LINK_URL}
          className="inline-block border border-gold text-gold px-9 py-3 text-xs tracking-[0.25em] uppercase font-heading transition-colors duration-300 hover:bg-gold hover:text-bg-dark"
        >
          Buy Tickets
        </a>

        <p className="text-xs text-text-muted mt-6">
          You&apos;ll complete your purchase securely via Stripe, then return
          here for confirmation.
        </p>
      </div>
    </section>
  );
}
