import Link from "next/link";
import AddToCalendarButton from "./AddToCalendarButton";
import Ornament from "./Ornament";

export default function TicketsThankYou() {
  return (
    <section className="animate-fade-in-up flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-bg-dark via-bg-light to-bg-dark py-24 px-6 text-center">
      <div className="mx-auto max-w-xl">
        <h1 className="font-heading text-4xl text-gold tracking-wider uppercase mb-6">
          You&apos;re In
        </h1>
        <p className="text-lg text-text-primary mb-4">
          Your ticket purchase is confirmed. Check your email for your
          receipt.
        </p>
        <p className="text-sm text-text-muted mb-12">
          We&apos;ll see you October 17, 2026 at Centre Stage. Hell awaits.
        </p>
        <Ornament />
        <div className="mb-8">
          <AddToCalendarButton />
        </div>
        <Link
          href="/"
          className="inline-block border border-gold text-gold px-9 py-3 text-xs tracking-[0.25em] uppercase font-heading transition-colors duration-300 hover:bg-gold hover:text-bg-dark"
        >
          Back to the Show
        </Link>
      </div>
    </section>
  );
}
